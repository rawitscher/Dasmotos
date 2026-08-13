"""Domain models for the batch release service.

Kept as plain dataclasses on purpose - this service predates the team's
move to pydantic, and nobody has funded the migration.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum


class BatchStatus(str, Enum):
    QUARANTINE = "quarantine"
    UNDER_REVIEW = "under_review"
    RELEASED = "released"
    REJECTED = "rejected"


class Currency(str, Enum):
    USD = "USD"
    EUR = "EUR"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class Batch:
    id: str
    product_code: str
    lot_number: str
    quantity_units: int
    status: BatchStatus = BatchStatus.QUARANTINE
    lims_ref: str | None = None
    label_id: str | None = None
    created_at: str = field(default_factory=_now)


@dataclass
class QualityCheck:
    name: str
    passed: bool
    detail: str = ""


@dataclass
class ReleaseRequest:
    batch_id: str
    released_by: str
    # NOTE: no idempotency_key today - see GP-4821
