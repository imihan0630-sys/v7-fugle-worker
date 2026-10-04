# System 1 market-cap floor economic audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_PENDING / FORMAL_CORE_LOCKED

## Purpose

Separate the mixed Formal `MARKET_CAP_FLOOR` gate into its two semantically different states:

1. missing market-cap input = confidence / uncertainty;
2. known marketCapYi < 10 = economic/context threshold.

Only the second state is eligible for future economic counterfactual research.

This implements R1 from:
`research/SYSTEM1_SELECTION_IMPROVEMENT_EVIDENCE_MATRIX_20261004_V0_1.md`.

## Frozen Formal semantics

Current order before MARKET_CAP_FLOOR:

1. PRICE_FLOOR;
2. HISTORY_60D;
3. RS_CONTEXT;
4. MARKET_CAP_FLOOR.

Current production reasons:
- missing market cap -> `缺市值資料`;
- known market cap < 10bn -> `市值低於10億`.

The A2 gate-role inventory already freezes:

- missing market cap = CONFIDENCE_UNCERTAINTY;
- known below-10bn threshold = CONTEXT/ECONOMIC rule.

This audit does not merge those states.

## Formal-reach denominator

A row reaches the market-cap economic threshold only when:
- PRICE_FLOOR = PASS;
- HISTORY_60D = PASS;
- RS_CONTEXT = PASS.

Rows are classified:

- `MARKET_CAP_MISSING`;
- `KNOWN_BELOW_10_FAIL`;
- `KNOWN_10_30_PASS`;
- `KNOWN_30_100_PASS`;
- `KNOWN_100_PLUS_PASS`.

Primary economic incidence:

`KNOWN_BELOW_10_FAIL / all reached rows with known marketCapYi`.

Missing values are excluded from that denominator.

## Implementation

Pure Class-A analyzer:

`research/system1_market_cap_floor_economic_audit_v0_1.mjs`

Inputs:
- immutable adapted C1 rows;
- same-generation gate-overlap diagnosis;
- optional same-date firstFailure masking evidence.

No market-cap threshold, pool definition, ranking or trade behavior is changed.

## Observer parity

The analyzer independently verifies:

- marketCapYi missing -> MARKET_CAP_FLOOR UNKNOWN;
- marketCapYi < 10 -> FAIL;
- marketCapYi >= 10 -> PASS.

Any mismatch increments:
`observerParityMismatchN`

and sets:
`evidenceTrust = DATA_QUALITY_BLOCKED`.

## Economic threshold cohort

For positively upstream-reached `KNOWN_BELOW_10_FAIL` rows, report:

- total known-below-10 count;
- reject rate among known market-cap rows;
- GENERAL / THOUSAND incidence;
- exact production firstFailure cross-check;
- same-scan downstream observed gate states;
- single-gate observed-state replay.

The replay uses the existing:
`research/formal_gate_replay_v0_1.mjs`

and may report:
- earlier blocker;
- next observed blocker;
- unresolved UNKNOWN / NOT_EVALUABLE;
- all-other-observed-gates-clear.

`ALL_OTHER_OBSERVED_GATES_CLEAR` is not a recovered Formal candidate, rank, Top3 member or trade.

## P1-A missing state

`MARKET_CAP_MISSING` is separately reported under:

`p1aMissingState`

with:
`classification = CONFIDENCE_UNCERTAINTY`.

It may never be relabeled:
- small-cap economic reject;
- zero market cap;
- neutral/pass.

## Downstream overlap

For known-below-10 rows, the audit records same-scan observer states for:

- DAILY_ABNORMALITY;
- LIQUIDITY;
- SMALL_CAP_SPECIAL;
- MID_CAP_LIQUIDITY;
- ANNOUNCEMENT_RISK;
- VALUATION_RELATIVE_RISK;
- SECTOR_GATE;
- AB_SETUP;
- FUNDAMENTAL_QUALITY;
- ATR_QUALITY;
- TARGET_AVAILABLE;
- REWARD_RISK;
- FINAL_SIGNAL_GRADE.

These are independent research observations only.

A downstream PASS does not prove the row would have reached that stage under a changed Formal path.

## Daily collection

The existing verified C1 evidence artifact now appends:

`marketCapFloorEconomic`.

No:
- new endpoint;
- HTTP/provider call;
- scheduler;
- D1 schema;
- Worker runtime hook;
- Production deployment

is introduced.

## Interpretation guardrails

This audit does not prove:
- 10bn is too high;
- microcaps should be admitted;
- lower market cap means higher alpha;
- an all-other-observed-clear row would be selected;
- candidate-count increase is beneficial.

No threshold sweep around 10bn is allowed.

Future economic evaluation must control for:
- price tier;
- liquidity / traded value / spread / depth;
- sector;
- ATR/volatility;
- market regime;
- event/corporate-action state;
- setup/channel;
- execution costs;
- forward MAE/MFE and stop/no-follow-through.

## Formal boundary

No Formal market-cap threshold, liquidity rule, A/B, ATR, RR, grade, score, comparator, 3+3/Top6, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing daily C1 workflow emit the first genuine V8.17+ market-cap-floor economic receipt.
3. Keep missing-market-cap P1-A rows separate from known-below-10 rows on every date.
4. Accumulate independent dates and quality-complete outcomes.
5. Only after matched execution/downside/OOS evidence may the known 10bn threshold become a Class-C optimization candidate.
