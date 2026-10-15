# Room11 D16+D18 retrospective paired-close missingness robustness — 2026-10-15

Status: RESEARCH_ONLY / DERIVED_RETROSPECTIVE / NO_FORMAL_CHANGE
Owner: 11｜統計驗證與策略市場狀態研究室
Base main: 6583dd3df011c5a42d5b34e9b66034b6b04a55a1

## Input and non-claims
Re-analysis of Room11's already preserved 2026-10-15 05:23 62-date, 61-adjacent-pair derived official-quote audit; no new original official fetch, no new independent dates, no ordinary-equity certification, no historical PIT, no U2B-certified returns, no prospective Shadow, no Alpha or policy value.

## New quantitative robustness result
- TWSE 61-pair repeated intersection count 66,194; raw paired-close missing 251; date-balanced missing share 0.3792%.
- TPEx repeated intersection count 54,153; raw paired-close missing 2,095; date-balanced missing share 3.8688%.
- On all 61 adjacent-date comparisons, TPEx raw paired-close missing share exceeds TWSE.
- Paired date-balanced gap 3.4895 percentage points; first 30 pairs 3.5252 pp, last 31 pairs 3.4550 pp.
- Lag-1 autocorrelation: TWSE 0.5642, TPEx 0.5108, paired gap 0.5192; overlapping date pairs are NOT independent.
- Fixed-seed circular moving-block bootstrap (5000 draws): 3-session descriptive 95% interval [3.2390,3.7426] pp; 5-session [3.2494,3.7395] pp; 10-session [3.2586,3.7309] pp.
- Leave-one-pair-out date-balanced gap range [3.4589,3.5115] pp.
- 20/20 local source-audit and adversarial validation tests passed; no official source re-fetch and no formal CI performed this turn.

## Four-sided falsification
Supporting mechanism: available-case breadth/return denominators differ systematically between exchange source populations, so exchange-composition and missingness must be explicit.
Counterevidence: four-digit quotes include uncertified non-common securities; missing close is neither zero return nor certified suspension; missingness mechanism cannot be identified from aggregate receipts.
Alternatives: instrument class, listing age, parser/source schema, trading halts, identity changes, corporate actions and liquidity.
Failure boundary: if PIT-certified ordinary-share identities and action/continuity receipts remove the gap, the raw-quote gap must not be projected onto U2B ordinary-equity breadth. The descriptive block bootstrap is not promotion-grade causal inference.

## Exact next continuation
Consume NEW immutable DATA_LANE ordinary-share identity, bounded suspension negative completeness, three corporate-action families, and real hash-bound CLEAR_NO_ACTION pair. Only then implement/validate the frozen D18-04 U2B row/date aggregate RB-T01..T16. For D16-20 require real same-cut official treatment+untreated population and pre-treatment PIT covariates/common-support diagnostics. Do not repeat prior 62-day source verification or earlier frozen synthetic oracles.

D16 tracker 65.6%; D18 tracker 54.7%; overall 47.9% as read at base main. These are unmodified formal tracker values. Formal Core LOCKED.
