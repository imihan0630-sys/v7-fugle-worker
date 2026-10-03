# D03 Primary Queue Incremental Inference Preregistration V0.1

Updated: 2026-10-04 Asia/Taipei
Scope: TI-005 KD vs RSI -> TI-006 MACD vs Direct Trend
Status: OUTCOME_CLOSED / PREREGISTERED / EXECUTION_BLOCKED_BY_UPSTREAM_GATES
Formal Core: LOCKED

## Purpose

Freeze the first Technical Indicator incremental-inference questions **before** any outcome access.

This document does not authorize outcome joins.

A critical correction is frozen first:

> The 3-session raw source-version receipt gate is necessary source-clock evidence, but it is NOT sufficient for R1/R2/R4/R5 Technical Indicator observer readiness.

TI-005/TI-006 may execute only after the full parent/continuity/state/prospective gates pass.

---

## TI-543 — gate hierarchy correction

### Gate S0 — source-version observer
Required:
- three independent completed Taiwan sessions under the frozen raw-byte source/version protocol;
- at least one validated same-trade-date repeat for the third session;
- invalid/truncated transports excluded;
- same-date changes reconciled before any outcome access.

Current: **2/3**.

Passing S0 does not imply Technical Indicator R1.

### Gate T1 — immutable parent/source readiness
Required:
- shared immutable Level-B per-symbol decision-state parent;
- captureGeneration;
- exact parentKeysetHash;
- every expected parent enumerated;
- TECHNICAL_CONTINUITY receipt or explicit BLOCKED/UNKNOWN;
- symbol-session and price-limit/special-session provenance;
- exact asOf/availableAt;
- no selected-only parent population.

### Gate T2 — observer completeness
Required:
- attemptedParentCount == expectedParentCount;
- persisted child attempt for every parent;
- no duplicate/orphan child;
- COMPLETE run receipt;
- version counts preserved.

Blocked/UNKNOWN rows count as attempted, not as negative signals.

### Gate T3 — formula/state replay
Required:
- formulaVersion frozen;
- stateConstructionMode frozen;
- recursive-state lineage/replay certification where needed;
- prefix invariance;
- exact readback.

### Gate T4 — common-support descriptive readiness
Required before outcomes:
- valid common-support cohort frozen;
- missing/blocked/constrained rates reported by date/pool/market;
- version compatibility proven or stratified;
- no outcome-selected completeness rule.

### Gate T5 — outcome-join readiness
Required:
- forward-only outcome provenance;
- exact parent/evidence/outcome keyset join;
- no partial-date truncation;
- preregistered experiment version;
- independent-date/episode unit preserved.

### Gate T6 — incremental inference floor
Use existing global governance floors:
- D5 mature sample >= 60;
- prospective complete snapshots >= 30;
- independent Formal scan dates >= 15;
- at least two market regimes;
- purged training >= 10 scan dates;
- untouched holdout >= 5 scan dates;
- coverage / zero-pick / redundancy / cost / overfit gates.

Only T6 permits incremental inference.
No gate automatically authorizes Formal change.

---

## TI-544 — TI-005 semantic question

The primary KD/RSI question is not "Which named indicator wins?"

It is:

> Does B2 rolling-range/extreme-location information and/or B3 signed-return gain/loss balance add information beyond the direct price/trend/context baseline?

KD and RSI are correlated but not algebraic aliases.

### Frozen B2 basis
- primary continuous range-position representation;
- audit fields may include RSV9 / K9 / D9;
- K/D smoothing is not an independent vote.

### Frozen B3 basis
- RSI14 / signed-return path-balance representation;
- avgGain14 / avgLoss14 may be preserved for audit;
- overbought/oversold labels are deterministic children, not extra votes.

No 20/80, 30/70 or other threshold has directional authority in the primary test.

---

## TI-545 — TI-005 nested comparison ladder

Exact common-support feature sets:

### K0 BASE
- A/B setup/context where defined;
- ret5 / ret10 / ret20 / ret60;
- MA/EMA trend/alignment/slope;
- trendPersistence;
- pathEfficiency when valid;
- ATR% / volatility;
- Pattern lifecycle;
- Price-Volume state;
- market/sector Regime;
- liquidity / price tier;
- overheat / lateStage;
- constrained-session state.

### K1 B2_RANGE
K0 + one frozen continuous B2 range-position representation.

### K2 B3_RSI
K0 + RSI14 continuous representation.

### K3 BOTH
K0 + B2 + RSI14.

### K4 KD_SMOOTHING_DIAGNOSTIC
K3 + preregistered K/D smoothing residual fields.

K4 is diagnostic and lower priority; it tests whether K/D recursive smoothing adds anything beyond raw range position + RSI/direct controls.

No extra zone/crossover/persistence labels enter the primary model unless separately preregistered later.

### TI-005 primary nulls

H005-A:
B2 adds no incremental predictive/path-risk information beyond K0.

H005-B:
RSI14 adds no incremental information beyond K0.

H005-C:
K3 adds no incremental value beyond the better of K1/K2.

H005-D:
K/D smoothing adds no residual information beyond K3.

Failure to reject any null => keep that representation explanatory/timing-only.

---

## TI-546 — TI-006 semantic question

MACD contains exact aliases and non-alias filter-response fields.

Rejected as independent fields:
- MACD zero-line state separately from EMA12 > EMA26 alignment;
- signal-line crossover separately from Histogram sign;
- raw unnormalized DIF/Histogram magnitude cross-sectionally.

The residual question is:

> Does normalized filtered-trend magnitude and/or transition-curvature timing add beyond direct returns, EMA/MA trend, trend persistence and price structure?

---

## TI-547 — TI-006 nested comparison ladder

### M0 BASE
Same common-support control family as K0, with explicit direct trend controls:
- ret5/10/20/60;
- EMA12/EMA26 alignment;
- EMA/MA slopes;
- trendPersistence;
- returnVelocityShift / comparable acceleration state where valid;
- Pattern / PV / Regime / liquidity / overheat context.

### M1 DIF_MAG
M0 + normalized `difPct`.

### M2 TRANSITION
M0 + preregistered non-alias transition fields:
- difSlope;
- histogramPct;
- histogramSlope.

### M3 COMBINED
M0 + M1 + M2 fields.

No zero-line/crossover alias is added separately.

### TI-006 primary nulls

H006-A:
normalized DIF adds no residual information beyond direct trend.

H006-B:
transition/curvature fields add no residual information beyond direct trend + acceleration/slope controls.

H006-C:
combined non-alias MACD fields add no value beyond the better single residual family.

If apparent value is only faster reaction with materially worse false-transition/MAE/cost burden, classify SPEED_NOISE_TRADEOFF, not incremental alpha.

---

## TI-548 — frozen outcome family

No outcomes may be read until T5.

When T5/T6 are satisfied, freeze the following family as one multiplicity ledger.

### Primary horizon
D5.

### Registered endpoints
- D5 returnPct;
- D5 MFE;
- D5 MAE.

All three are declared together; the report may not select whichever looks favorable.

### Secondary horizons
- D10 return / MFE / MAE;
- D20 return / MFE / MAE.

Secondary horizons cannot rescue a failed D5 primary conclusion.

Where an existing setup/plan exists:
- stop-first / structural failure may be descriptive secondary outcomes;
- exact execution/fill claims require their own provenance and are not inferred from daily OHLC.

---

## TI-549 — inference and dependence firewall

D03 freezes the comparison objects; statistical implementation belongs to D16 governance.

Before any outcome read, the experiment must carry a D16 method receipt freezing one estimator/inference procedure.

Mandatory properties:
- exact common support;
- equal-scanDate weighting when aggregating date-level effects;
- scanDate clustering / dependence-aware inference;
- symbol/episode dependence diagnostic where repeated names occur;
- purged training dates whose D+N window crosses holdout boundary;
- untouched chronological holdout;
- leave-one-date sensitivity;
- regime / industry / price-tier / liquidity concentration diagnostics;
- non-overlapping-outcome-window sensitivity when feasible;
- no row-count pseudo-replication.

With few date clusters, naive asymptotic t-statistics alone are insufficient; use an appropriate finite-sample robust / resampling diagnostic under D16.

No estimator, loss function or encoding may be selected after holdout results are viewed.

---

## TI-550 — rejection / promotion firewall

A representation is **rejected as additive alpha** if any of the following holds:

1. no incremental effect on the preregistered common-support primary family;
2. effect disappears after direct-price/trend controls;
3. effect exists only through a deterministic alias/child label;
4. apparent effect is selected-only and not supported on the frozen parent population;
5. sign/effect is unstable under leave-one-date / holdout / regime sensitivity;
6. result is concentrated in one narrow date/regime/industry/price/liquidity cell without broader stability;
7. coverage/UNKNOWN or zero-pick/opportunity loss materially drives the apparent improvement;
8. speed benefit is offset by false-transition/MAE/cost burden;
9. result requires threshold/parameter tuning after outcome inspection;
10. version/source/state-lineage incompatibility is unresolved.

A field surviving the above becomes at most:
`PREDICTIVE_INCREMENTALITY_CANDIDATE`.

It does NOT automatically become a Formal Optimization Candidate.

Formal candidacy still requires R5 maturity, untouched OOS/Prospective Shadow evidence, costs, multiple testing, redundancy, coverage and owner review.

---

## Multiple-testing family

The first family contains:
- H005-A/B/C/D;
- H006-A/B/C;
- D5 return/MFE/MAE primary endpoints;
- D10/D20 registered secondary endpoints.

Failed cells remain counted.
No renaming resets the family.
No alternate KD/RSI/MACD periods are authorized in this first family.
No timeframe search is authorized.

---

## Current execution state

`RAW_SOURCE_VERSION_GATE = 2_OF_3`

`TECHNICAL_OBSERVER_R1 = BLOCKED_SHARED_PARENT_CONTINUITY_RUNTIME`

`OUTCOME_JOIN = CLOSED`

`TI_005 = PREREGISTERED_NOT_EXECUTABLE`

`TI_006 = PREREGISTERED_NOT_EXECUTABLE`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

## Exact next continuation

1. Next genuine Taiwan completed session: attempt the third raw-byte source-version receipt + same-date repeat.
2. If 3/3 passes, do NOT open outcomes automatically.
3. Re-audit shared immutable parent, TECHNICAL_CONTINUITY, symbol-session/limit provenance and stateConstructionMode.
4. Start the true prospective Technical Indicator observer clock only when T1-T3 are physically live.
5. Accumulate T4/T6 coverage floors.
6. Obtain D16 method receipt before T5 outcome access.
7. Execute TI-005 first; TI-006 second; do not reorder based on descriptive disagreement.
