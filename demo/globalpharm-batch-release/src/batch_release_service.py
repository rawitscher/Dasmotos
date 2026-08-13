"""BatchReleaseService - the god class.

This one class does batch intake, quality-check evaluation, LIMS posting,
labeling, status transitions, and (partial) audit. It is exactly the kind of
4,000-line-in-spirit service a senior engineer avoids touching. Everything the
demo needs to improve lives here.

Known issues (intentional, see GP-4821):
  * release_batch() is NOT idempotent - a retry double-posts to LIMS.
  * Audit trail is written for some transitions but NOT for release.
  * Error shapes are inconsistent (ValueError here, dict-with-status elsewhere).
"""
from __future__ import annotations

from . import audit
from .labeling import generate_label
from .legacy.lims_client import LegacyLimsClient, LimsError, legacy_lims
from .models import Batch, BatchStatus, QualityCheck, ReleaseRequest
from .store import Store, store


class BatchReleaseError(Exception):
    def __init__(self, code: str, message: str, http_status: int = 400) -> None:
        super().__init__(message)
        self.code = code
        self.http_status = http_status


class BatchReleaseService:
    def __init__(self, data: Store | None = None, lims: LegacyLimsClient | None = None) -> None:
        self.store = data or store
        self.lims = lims or legacy_lims

    # --- intake -----------------------------------------------------------
    def create_batch(self, batch_id: str, product_code: str, lot_number: str, quantity_units: int) -> Batch:
        if not batch_id or not product_code or not lot_number:
            raise ValueError("batch_id, product_code, lot_number are required")
        if quantity_units <= 0:
            raise ValueError("quantity_units must be positive")

        batch = Batch(
            id=batch_id,
            product_code=product_code,
            lot_number=lot_number,
            quantity_units=quantity_units,
        )
        self.store.batches[batch_id] = batch
        # NOTE: intake IS audited...
        audit.record("batch.created", batch_id, actor="system", before=None, after=BatchStatus.QUARANTINE.value)
        return batch

    def get_batch(self, batch_id: str) -> Batch | None:
        return self.store.batches.get(batch_id)

    # --- quality ----------------------------------------------------------
    def evaluate_quality(self, batch_id: str, checks: list[QualityCheck], actor: str) -> Batch:
        batch = self._require(batch_id)
        before = batch.status.value
        if all(c.passed for c in checks):
            batch.status = BatchStatus.UNDER_REVIEW
        else:
            batch.status = BatchStatus.REJECTED
        # ...and quality transitions ARE audited.
        audit.record(
            "batch.quality_evaluated",
            batch_id,
            actor=actor,
            before=before,
            after=batch.status.value,
            failed=[c.name for c in checks if not c.passed],
        )
        return batch

    # --- release (the hot path) ------------------------------------------
    def release_batch(self, req: ReleaseRequest) -> Batch:
        batch = self._require(req.batch_id)

        if batch.status == BatchStatus.RELEASED:
            # Inconsistent: this path raises, but callers upstream sometimes
            # swallow it, which is how a retry still reaches LIMS.
            raise BatchReleaseError("already_released", "batch already released", http_status=409)
        if batch.status != BatchStatus.UNDER_REVIEW:
            raise BatchReleaseError(
                "not_reviewable",
                f"batch must be under_review to release, is {batch.status.value}",
                http_status=409,
            )

        # Posts to the flaky mainframe. No idempotency guard - retries double-post.
        try:
            result = self.lims.post_release(batch.id, batch.lot_number, batch.quantity_units)
        except LimsError as e:
            raise BatchReleaseError("lims_unavailable", str(e), http_status=502) from e

        batch.lims_ref = result.lims_ref
        batch.label_id = generate_label(batch.product_code, batch.lot_number, result.lims_ref)
        batch.status = BatchStatus.RELEASED

        # BUG (GP-4821): the release transition is NOT written to the audit
        # trail. In a validated system this is a Part 11 gap.

        return batch

    # --- helpers ----------------------------------------------------------
    def _require(self, batch_id: str) -> Batch:
        batch = self.store.batches.get(batch_id)
        if batch is None:
            raise BatchReleaseError("batch_not_found", f"unknown batch {batch_id}", http_status=404)
        return batch
