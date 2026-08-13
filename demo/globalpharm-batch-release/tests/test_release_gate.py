"""Deliberately-armed release gate for the live demo.

This test encodes two controls GlobalPharm's change board would REQUIRE before
release logic ships:

  1. Idempotency: releasing the same batch twice must NOT post to LIMS twice.
  2. Audit trail: the release transition MUST be recorded (Part 11).

Both fail against today's code on purpose. During the demo you flip
RELEASE_GATE_ARMED to True (or set env GP_RELEASE_GATE=1) to show the gate
firing while the human holds the merge key, then let the agent make them pass.
"""
import os
import unittest

from src.batch_release_service import BatchReleaseService, BatchReleaseError
from src.legacy.lims_client import LegacyLimsClient
from src.models import QualityCheck, ReleaseRequest
from src.store import Store

RELEASE_GATE_ARMED = os.environ.get("GP_RELEASE_GATE") == "1"


@unittest.skipUnless(
    RELEASE_GATE_ARMED,
    "Release gate not armed. Set GP_RELEASE_GATE=1 to run the change-board gate (fails until GP-4821).",
)
class ReleaseGate(unittest.TestCase):
    def setUp(self) -> None:
        self.store = Store()
        self.lims = LegacyLimsClient()
        self.svc = BatchReleaseService(self.store, self.lims)
        self.svc.create_batch("B1", "PROD-9", "LOT-2201", 1000)
        self.svc.evaluate_quality("B1", [QualityCheck("assay", True)], actor="qa.reviewer")

    def test_release_is_idempotent(self) -> None:
        req = ReleaseRequest(batch_id="B1", released_by="qa.reviewer")
        first = self.svc.release_batch(req)
        # A client retry with the same intent must return the SAME result and
        # must NOT create a second LIMS record.
        try:
            second = self.svc.release_batch(req)
        except BatchReleaseError:
            self.fail("idempotent retry should not raise; it should return the original release")
        self.assertEqual(first.lims_ref, second.lims_ref, "retry double-posted to LIMS")

    def test_release_is_audited(self) -> None:
        self.svc.release_batch(ReleaseRequest(batch_id="B1", released_by="qa.reviewer"))
        release_events = [e for e in self.store.audit_events if e["action"] == "batch.released"]
        self.assertEqual(len(release_events), 1, "release transition was not written to the audit trail")


if __name__ == "__main__":
    unittest.main()
