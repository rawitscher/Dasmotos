/**
 * Legacy ledger bridge.
 *
 * Production talks to a COBOL CICS region via an internal VB6 "Connector Hub"
 * that Platform swore they'd retire in 2019. Do not call this twice for the
 * same logical payment — the mainframe will happily post duplicates.
 */

export interface LedgerPostRequest {
  accountHint: string;
  amountCents: number;
  currency: string;
  narrative: string;
}

export interface LedgerPostResult {
  legacyRef: string;
  postedAt: string;
  rawCode: string;
}

export class LegacyLedgerClient {
  private posts = 0;

  async postCapture(req: LedgerPostRequest): Promise<LedgerPostResult> {
    this.posts += 1;
    // Simulated mainframe think-time
    await sleep(40 + Math.floor(Math.random() * 80));

    if (req.amountCents <= 0) {
      throw new LedgerError("LGR-417", "Non-positive amount rejected by region");
    }

    // ~8% flake — useful when showing Agent retry / debug mode
    if (this.posts % 13 === 0) {
      throw new LedgerError("LGR-908", "Region busy — retry later");
    }

    return {
      legacyRef: `LGR-${Date.now()}-${this.posts}`,
      postedAt: new Date().toISOString(),
      rawCode: "00",
    };
  }
}

export class LedgerError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "LedgerError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const legacyLedger = new LegacyLedgerClient();
