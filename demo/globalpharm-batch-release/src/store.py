"""In-memory persistence.

Stands in for the Oracle instance the real service talks to. The
`audit_events` list is the closest thing this service has to a 21 CFR
Part 11 audit trail - and it is not written on every path (see GP-4821).
"""
from __future__ import annotations

from .models import Batch


class Store:
    def __init__(self) -> None:
        self.batches: dict[str, Batch] = {}
        self.audit_events: list[dict] = []
        # Scaffolded but unused until GP-4821 adds idempotency.
        self.release_keys: dict[str, str] = {}

    def reset(self) -> None:
        self.batches.clear()
        self.audit_events.clear()
        self.release_keys.clear()


store = Store()
