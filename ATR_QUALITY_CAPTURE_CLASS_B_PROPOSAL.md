# ATR_QUALITY — Prospective OHLC / Range Receipt Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-B PROPOSAL ONLY / NOT IMPLEMENTED  
Formal Core: LOCKED

## Minimum receipt

Unit:
`scanDate x decisionGeneration x symbol`.

Parent linkage:
- immutable parent generation/fingerprint;
- exact pre-ATR Formal reach;
- history-source revalidation version/status;
- history source id and adjustment semantics.

Last-20 ATR source evidence:
- date;
- close;
- high numeric-observed flag;
- low numeric-observed flag;
- high/low raw-normalized state (numeric/null/missing/invalid);
- deployed true range;
- finite-range flag.

Aggregate:
- requested range count;
- finite deployed range count;
- fully observed H/L range count;
- deployed atr20;
- deployed atrPercent;
- exact lower/upper gate state;
- ATR evidence-quality class;
- downstream stop/RR source version linkage.

## Acceptance / kill guards

- no new market calls;
- capture uses already-loaded last20 bars;
- exact deployed ATR value must match `buildMarketFeatures`;
- clean 20/20 numeric H/L rows must produce zero Formal decision difference;
- missing source evidence is never relabeled as observed zero;
- receipt failure cannot alter Formal behavior;
- duplicate/partial generation fails research quality closed.

## Possible implementation after evidence

If prospective receipts prove missing H/L occurs, a source-quality repair can be proposed separately. That would be Class B owner-approval work because it changes which data are allowed to reach Formal even though it does not alter the 1%/10% strategy thresholds.

No validation/admission change is implemented by this proposal.
