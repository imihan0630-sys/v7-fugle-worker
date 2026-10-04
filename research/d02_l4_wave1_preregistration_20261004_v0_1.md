# D02 L4 Wave-1 Prospective Preregistration V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / FROZEN_BEFORE_FIRST_CLEAN_POST_REPAIR_DATE
Formal Core: LOCKED
Evidence cursor: PVE-239

## Purpose

Freeze the first D02 L4 evidence program before any clean post-repair outcome is inspected.

Wave-1 prioritizes:
1. D02-02 / H001 — same-slot RVOL incremental value;
2. D02-03 / H20 — breakout volume confirmation;
3. D02-06 / H003 — Effort-vs-Result incremental value beyond price-only response.

This file does not open Gate 7.
It only defines what must already be true before Gate 7 can legally open.

## Two different maturity floors

### Floor A — DESCRIPTIVE_READY
Requires:
- >=20 CLEAN scan dates;
- exact common support for the compared models;
- Gate 0→6 pass;
- no Formal isolation failure;
- no post-outcome sample substitution.

This floor allows:
- QA / coverage tables;
- feature-distribution tables;
- rank correlations;
- disagreement matrices;
- descriptive outcome summaries only if the pre-existing Gate-7 conditions for that outcome family are also satisfied.

It does NOT by itself justify L4 promotion.

### Floor B — L4_EVIDENCE_ELIGIBLE
Requires at minimum:
- >=100 completed eligible events;
- >=30 distinct CLEAN scan dates;
- all rows/events on exact common support for the comparison being interpreted;
- DATA_QA_PASS;
- clean cohort provenance;
- generation alignment;
- Formal isolation pass;
- no unresolved source/unit/session/corporate-action blocker;
- outcomes strictly future to feature firstKnownAt;
- no threshold/model editing after outcome access.

This floor operationalizes the older PV-024/PVE-195 evidence floor.
High row count on a few dates cannot substitute for independent dates.

## Dependence unit

Primary dependence/cluster unit:
`scanDate`

Rules:
- multiple symbols on one scanDate are clustered observations, not independent experiments;
- first reports must show both row/event count and distinct CLEAN scan-date count;
- naive row-level IID significance is prohibited;
- exact finite-sample inference remains D16-owned.

## Wave-1 experiment registry

### Experiment W1-H001 — D02-02 Same-slot RVOL

Primary question:
Does same-slot RVOL add incremental information beyond Formal context + Formal previous-5-bar local volume ratio?

Exact model ladder:
- A = Formal context only;
- B = A + formalLocalVolumeRatio;
- C = B + pvSlotRvol20;
- D = C + pvCumvolPace20, only when cumulativeValid=true.

Primary contrast:
`C vs B`

Secondary contrast:
`D vs C`, only after H002 redundancy conditions are satisfied.

Common-support requirements:
- slot >= 10:15;
- same symbol;
- same scanDate;
- same completed 15m bar/slot;
- finite formalLocalVolumeRatio;
- finite pvSlotRvol20;
- slotHistoryCount >= 20;
- clean same-slot baseline;
- current session required-slot coverage valid;
- clean cohort provenance;
- identical outcome availability for B and C;
- for D: finite pvCumvolPace20, cumulativeHistoryCount >=20, complete current/historical prefix.

Registered diagnostic metrics:
- relationship/rank correlation of local ratio vs RVOL;
- frozen-band disagreement matrix;
- future return;
- MFE;
- MAE;
- false/no-follow-through or opportunity-retention metric where already frozen and valid.

Mandatory controls / strata before interpretation:
- market activity;
- sector activity where PIT-valid;
- liquidity;
- event context;
- market Regime;
- session/auction/price-censor guards.

Forbidden:
- searching a new RVOL threshold after outcomes;
- choosing a better slot after outcomes;
- dropping losing dates;
- comparing B and C on different rows.

### Experiment W1-H20 — D02-03 Breakout Volume Confirmation

Primitive event owner:
D01-05 price-structure breakout/failure event.

One primitive breakout event may carry D02 volume confirmation metadata but cannot mint a second breakout vote.

Event key:
`H20_BREAKOUT:<marketDate>:<symbol>:<anchorBarStart>`
or a deterministic equivalent already frozen by the D01 owner.

Exact model ladder:
- A = D01 price-only breakout/failure baseline;
- B = A + existing local previous-five-bar volume ratio;
- C = B + same-slot historical RVOL;
- D = C + cumulative participation pace only when H002 redundancy/common-support requirements pass.

Primary contrast:
`C vs B`

Mandatory common support:
- identical D01 breakout event identity;
- same event timestamp/anchor;
- same symbol/date;
- same D01 structure state;
- same price-only breakout inputs;
- same outcome horizon;
- same market/sector/liquidity/event/regime controls;
- C and B available for the same event.

Required negative cases remain in the report:
- successful breakout + normal volume;
- failed breakout + high volume;
- high volume + weak price response;
- moderate abnormal volume + strong Acceptance;
- extreme volume in high-volatility/event state.

Interpretation:
volume is `CONDITIONAL_INCREMENTAL_EVIDENCE` only if it adds beyond B on common support.
It never receives an independent primitive breakout vote.

### Experiment W1-H003 — D02-06 Effort-vs-Result

Primary question:
Does adding volume effort to price response improve future discrimination beyond price geometry alone?

Exact comparison:
- P = PRICE_ONLY_RESPONSE;
- PV = PRICE_PLUS_VOLUME_RESPONSE.

Mandatory anti-circularity:
- P and PV are computed from the same feature bar;
- the outcome begins strictly after the feature bar;
- same-bar signed progress, close position, body/wick and range geometry cannot be credited again as future outcome;
- P and PV must be compared on identical rows/events.

Required event counters:
1. RAW_ACCEPTANCE_KEY_COUNT;
2. ACTIVE_ACCEPTANCE_LIFECYCLE_COUNT;
3. H003_HYPOTHESIS_CLEAN_EVENT_COUNT.

Only #3 counts toward H003 maturity.

Acceptance phantom rule:
`PRE_EVENT -> EXPIRED_AMBIGUOUS` / PRE_EVENT_ONLY_EXPIRY is QA only and never a failed Acceptance event.

Mandatory falsifier:
if PRICE_ONLY_RESPONSE provides essentially the same future discrimination as PRICE_PLUS_VOLUME_RESPONSE, classify the volume addition as REDUNDANT.

## Outcome clock

For every Wave-1 row/event:
- feature snapshot is immutable;
- outcomeStartAt must be strictly later than feature firstKnownAt / completed feature bar;
- outcomeKnownAt must be at or after the complete horizon;
- later data-quality overlays may quarantine evidence but may not rewrite historical features to improve results;
- censored/missing outcome remains CENSORED/UNKNOWN, never 0.

## Outcome access states

`OUTCOME_ACCESS_CLOSED`
- fewer than descriptive floor;
- or Gate 0→6 incomplete;
- or common support incomplete;
- or any source/cohort/formal-isolation blocker.

`DESCRIPTIVE_ONLY`
- >=20 CLEAN scan dates;
- common support valid;
- but L4 evidence floor not yet reached.

`L4_EVIDENCE_ELIGIBLE`
- >=100 completed eligible events;
- >=30 CLEAN scan dates;
- all mandatory integrity/common-support conditions pass.

`L4_PROMOTION_REVIEW`
- L4_EVIDENCE_ELIGIBLE plus actual prospective/OOS evidence exists for the specific module;
- the result is interpreted under D16 dependence-aware methods;
- no single date/sector/regime dominates;
- negative controls and redundancy checks are reported.

None of these states authorizes Formal Core modification.

## Sequential / stopping governance

Before L4_EVIDENCE_ELIGIBLE:
- do not inspect/tune predictive outcomes;
- QA failures may be fixed only through a new forward schema/version;
- failed/blocked dates remain in the ledger.

At the registered milestones:
- 20 CLEAN dates: descriptive checkpoint only;
- 30 CLEAN dates AND 100 completed eligible events: first L4 evidence-eligibility checkpoint;
- 250 events: second stability checkpoint;
- 500 events: larger-sample stability checkpoint.

No early promotion because an interim result looks favorable.
No threshold/model family search between milestones.

## Multiple-testing family

Wave-1 is one coordinated family:
- H001 C-vs-B primary;
- H20 C-vs-B primary;
- H003 PV-vs-P primary.

D-vs-C cumulative-pacing comparisons are secondary and belong to the H002 redundancy family.

Any new threshold, new horizon, new slot, new breakout definition or new response formula after outcomes requires a new preregistration version and a fresh forward evidence clock.

## L4 promotion boundaries

A module may become L4 only if its own registered prospective/OOS comparison reaches the L4 evidence floor.

One successful Wave-1 experiment does not automatically promote the other D02 modules.

No pooled "D02 works" conclusion is allowed.

Formal optimization remains a later and higher gate.
