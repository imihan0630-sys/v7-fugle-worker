# D21-03 insider monthly actual-change acquisition boundary receipt — 2026-10-08 05:32 Asia/Taipei

Scope: D21-03 only
Formal Core impact: NONE
Maturity promotion: NONE

## New first-party evidence
- TWSE Data E-Shop confirms D01 (daily announced transfers), D02 (daily announced untransferred shares), and M10 (monthly insider holding-change ex-post filing) are distinct official data objects.
- TWSE insider reporting Q&A confirms Article 25 monthly ex-post reporting is not merely an end-of-month balance: insiders must separately report prior-month share changes by acquisition/transfer method, including exchange-market acquisition/transfer, other-market acquisition/transfer, and private-placement acquisition/transfer.
- Therefore a historical M10 row can potentially distinguish economic transaction channels better than a simple month-end delta, but only if the actual historical row is obtained. D01/D02 cannot substitute for M10 execution evidence.
- TWSE guidance confirms pledge setup/release is a separate reporting clock: the insider notifies the issuer immediately and the issuer reports within five days. Pledge evidence must remain separate from ordinary acquisition/transfer evidence.

## Falsification / alternative explanations
- A negative month-end holding delta is not sufficient to infer bearish discretionary selling.
- Gift, trust, estate/tax, legal-status change, nominee/related-person scope change, pledge/release, and other non-market transfers remain competing explanations unless the official acquisition/transfer method resolves them.
- Filing deadline is not exact first-known. Final historical database value must not be backfilled to an earlier decision date when original receipt/version timing is unavailable.
- Missing historical M10 content or original receipt remains UNKNOWN, never 0/BAD.

## PIT / OOS / replay gate
- D21-03 remains L2 / 40%.
- L3 still requires at least one authoritative historical M10 actual-change record plus a safe publication bound/original receipt sufficient for end-to-end PIT replay.
- No historical Shadow is fabricated. No OOS/Walk-forward claim is made.
- No monotonic buy/sell interpretation is authorized.

## Exact next continuation
Stop re-searching whether official M10 exists. The source family is confirmed. Only accept authorized historical M10 content/receipt as the unblocker for D21-03. If unavailable, continue executable L3 modules with genuine prospective/OOS evidence rather than repeating equivalent source discovery.

Sources checked:
- TWSE Data E-Shop package listing for D01/D02/M10.
- TWSE insider equity reporting Q&A / guidance for Article 25 monthly change-method reporting and pledge reporting clocks.
