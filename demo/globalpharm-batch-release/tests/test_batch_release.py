"""Thin existing coverage - the happy path only.

Note what is NOT tested: retries/idempotency and the audit trail on release.
That gap is the demo. Adding those tests is part of GP-4821.
"""
import unittest

from src.batch_release_service import BatchReleaseService, BatchReleaseError
from src.legacy.lims_client import LegacyLimsClient
from src.models import BatchStatus, QualityCheck, ReleaseRequest
from src.store import Store


class BatchReleaseHappyPath(unittest.TestCase):
    def setUp(self) -> None:
        self.store = Store()
        self.lims = LegacyLimsClient()
        self.svc = BatchReleaseService(self.store, self.lims)

    def _reviewed_batch(self, batch_id: str = "B1") -> None:
        self.svc.create_batch(batch_id, "PROD-9", "LOT-2201", 1000)
        self.svc.evaluate_quality(
            batch_id,
            [QualityCheck("sterility", True), QualityCheck("assay", True)],
            actor="qa.reviewer",
        )

    def test_release_moves_to_released_and_posts_lims(self) -> None:
        self._reviewed_batch()
        batch = self.svc.release_batch(ReleaseRequest(batch_id="B1", released_by="qa.reviewer"))
        self.assertEqual(batch.status, BatchStatus.RELEASED)
        self.assertTrue(batch.lims_ref and batch.lims_ref.startswith("LIMS-"))
        self.assertTrue(batch.label_id and batch.label_id.startswith("LBL-"))

    def test_cannot_release_unreviewed_batch(self) -> None:
        self.svc.create_batch("B2", "PROD-9", "LOT-2202", 500)
        with self.assertRaises(BatchReleaseError) as ctx:
            self.svc.release_batch(ReleaseRequest(batch_id="B2", released_by="qa.reviewer"))
        self.assertEqual(ctx.exception.code, "not_reviewable")


if __name__ == "__main__":
    unittest.main()
