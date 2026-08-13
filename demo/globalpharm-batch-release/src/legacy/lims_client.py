"""Legacy LIMS bridge.

Production posts batch-release records to a COBOL LIMS on a mainframe via an
internal connector that Platform has been "about to retire" since 2016. Two
things you must respect:

  1. It is FLAKY - it intermittently rejects with LIMS-BUSY and expects retry.
  2. It is NOT idempotent - posting the same release twice creates two LIMS
     records, which in a GxP system is a data-integrity deviation, not a shrug.

Do not paper over this by removing the boundary. The real mainframe exists.
"""
from __future__ import annotations

import time
from dataclasses import dataclass


@dataclass
class LimsPostResult:
    lims_ref: str
    raw_code: str


class LimsError(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(f"{code}: {message}")
        self.code = code


class LegacyLimsClient:
    def __init__(self) -> None:
        self._posts = 0

    def post_release(self, batch_id: str, lot_number: str, quantity_units: int) -> LimsPostResult:
        self._posts += 1
        # Simulated mainframe think-time.
        time.sleep(0.005)

        if quantity_units <= 0:
            raise LimsError("LIMS-417", "non-positive quantity rejected")

        # ~1 in 12 calls flakes - useful for the Debug-mode / retry beat.
        if self._posts % 12 == 0:
            raise LimsError("LIMS-BUSY", "region busy, retry")

        return LimsPostResult(lims_ref=f"LIMS-{lot_number}-{self._posts}", raw_code="00")


legacy_lims = LegacyLimsClient()
