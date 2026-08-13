"""Label generation.

Trusts its inputs a little too much - a mild finding for the security-minded
reviewer to notice during the demo.
"""
from __future__ import annotations

import uuid


def generate_label(product_code: str, lot_number: str, lims_ref: str) -> str:
    # No validation of product_code/lot_number formatting - legacy behavior.
    label_id = f"LBL-{product_code}-{lot_number}-{uuid.uuid4().hex[:8]}"
    return label_id
