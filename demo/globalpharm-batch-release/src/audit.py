"""Audit trail helper.

In a validated system EVERY state change must be recorded with who, what,
when, and the old->new transition. This helper exists; the problem is that
`BatchReleaseService` only calls it on some paths. Completing that coverage
is half of GP-4821.
"""
from __future__ import annotations

from datetime import datetime, timezone

from .store import store


def record(action: str, batch_id: str, actor: str, before: str | None, after: str | None, **extra) -> None:
    event = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "action": action,
        "batch_id": batch_id,
        "actor": actor,
        "before": before,
        "after": after,
    }
    event.update(extra)
    store.audit_events.append(event)
