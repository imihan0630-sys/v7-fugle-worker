# BR-074 — D09-04 Three-Date Advance/Decline D16 Handoff V0.1

Status: RESEARCH_ONLY / OUTCOME_BLIND_D16_HANDOFF / THREE_INDEPENDENT_TWSE_DATES / POWER_INSUFFICIENT / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-04
Date: 2026-10-08 Asia/Taipei
Observed main before write: 4e10181cd8fd9ea0dd63e5040af58d6ffd57d9a2

## Purpose

Freeze the validation unit and outcome-access rules after the third independent official TWSE stock-breadth date, before any prospective market/selection outcome is opened.

Parents:
- research/br039_twse_advance_decline_receipt_20261002_v0_1.json
- research/br040_twse_advance_decline_second_date_20261007_v0_1.json
- research/br073_twse_advance_decline_third_date_20261008_v0_1.json

## Frozen date roots

2026-10-02:
- comparable N = 1,080;
- advance = 44.72%;
- decline = 46.85%;
- net advance-minus-decline = -2.13 percentage points.

2026-10-07:
- comparable N = 1,074;
- advance = 54.7486%;
- decline = 36.0335%;
- net advance-minus-decline = +18.7151 percentage points.

2026-10-08:
- comparable N = 1,074;
- advance = 39.5717%;
- decline = 50.2793%;
- net advance-minus-decline = -10.7076 percentage points.

## Independent unit

Primary independent unit = TWSE_MARKET_DATE_BREADTH_ROOT.

The following do NOT increase independent N:
- D5 / D20 / D60 horizons;
- D09-12 consumption of the same daily breadth root;
- multiple derived transforms of up/down/flat counts;
- index-context joins;
- sector/strategy consumers.

Permanent rule:
`ONE_MARKET_DATE_ROOT / MANY_CONSUMERS_OR_HORIZONS / ONE_INDEPENDENT_DATE`.

Current independent date N = 3.

## Denominator contract

Use only the official TWSE Stocks column.
Comparable denominator = up + down + unchanged.
N/A and unmatched stay outside the comparable denominator.
TWSE-only breadth is not relabeled Taiwan-wide breadth.
Strategy/Formal eligible universe remains a separate denominator.

## Outcome firewall

Room07 opens no future-return, selection, rank, capital or position outcome from these three dates.

Before any predictive access, Room11/D16 must freeze:
- market-date clustering;
- common-support market/regime fields;
- horizon multiplicity family;
- cost/slippage treatment if a tradable claim is tested;
- date weighting;
- missing TPEx / strategy-universe policy;
- redundancy test against D09-12, D09-05, D09-10 and cap-weighted index direction;
- minimum-support / power disposition.

Any result with inadequate date N must return POWER_INSUFFICIENT rather than loosen thresholds.

## Current inference readiness

Taiwan PIT source feasibility = PASS.
Prospective repeated-date evidence = PRESENT_BOUNDED.
Independent date N = 3.
Predictive/OOS inference = POWER_INSUFFICIENT.
L4 promotion = NO.

## Exact next

Room11/D16 freezes the date-level validation method before any outcome access.
Room07 continues appending official TWSE dates outcome-blind under unchanged denominator semantics.
Add TPEx only through an accepted same-clock official denominator and never merge denominators silently.

Formal Core unchanged.
