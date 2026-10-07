# BR-038 — D09-08 Size Leadership Partial Observation — 2026-10-07

Status: PRICE_INDEX_ONLY_PARTIAL_OBSERVATION / COMMON_TRI_NOT_PROVEN / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-08
Observed main before write: de089b8f776b1672b60eb4b1836a02bba1b1fc97

Official TWSE 2026-10-07 price-index observations:
- Taiwan 50: -0.23%;
- Mid-Cap 100: +0.65%;
- Small-Cap 300: +0.92%.

These values are descriptive PRICE_INDEX controls only.
BR-037 requires a common-complete TOTAL_RETURN_INDEX basis across the same three size families.
The bounded current official/repository check did not establish same-clock 2026-10-07 TRI values for all three frozen series.

Frozen rule:
PRICE_INDEX_COMPLETE != TOTAL_RETURN_INDEX_COMPLETE.

A later-retrieved TRI value may be stored as later-known evidence, but must not be relabeled as prospectively known at this capture without source-clock proof.
No second official size-state receipt is counted from 2026-10-07.
D09-08 remains L3/60.

Exact next:
- accumulate the next genuinely common-complete official TRI date across Taiwan50 / MidCap100 / SmallCap300;
- preserve source/capture clocks;
- never splice price-index and TRI series;
- add sector-mix/liquidity/breadth controls before outcome interpretation.

Formal Core unchanged.
