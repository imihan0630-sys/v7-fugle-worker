# Technical Indicator Prospective Observer Readiness Gate V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / READINESS_MODEL_FROZEN / RUNTIME_NO_GO
Formal Core: LOCKED

## Purpose

Separate five different questions that must never be collapsed:

1. Can the formula be computed correctly?
2. Is the source/provenance clean enough to persist an observation?
3. Is the prospective observer complete enough for descriptive analysis?
4. Is the evidence mature enough for incremental/outcome inference?
5. Is a finding mature enough to be proposed for Formal review?

A row existing in storage answers none of questions 3-5 by itself.

## TI-367 — Readiness levels

### R0_FORMULA_QA_READY

Requirements:
- frozen formulaVersion;
- deterministic oracle;
- replay exact;
- prefix invariant where applicable;
- edge/zero/tie semantics defined.

Meaning:
formula mechanics are trustworthy in isolation.

Does NOT mean:
market data is valid or outcomes may be studied.

### R1_SOURCE_READY

Requirements:
- parent decision identity available;
- raw-history admission valid;
- exact symbol-session coverage;
- TECHNICAL_CONTINUITY receipt valid;
- price-limit provenance resolved;
- formula/state lineage valid;
- asOf/availableAt point-in-time complete.

Meaning:
one observation can be constructed from a valid causal source state.

### R2_CAPTURE_COMPLETE

Requirements for each scan date:
- exact expected parent keyset;
- 100% attempt accounting;
- every expected parent resolves to VALID or explicit BLOCKED/UNKNOWN/CONSTRAINED;
- missing parent count=0;
- provenance conflict count=0;
- run receipt COMPLETE;
- same generation/keyset used by evidence reader.

Meaning:
the observer did not silently select the easy/available subset.

### R3_DESCRIPTIVE_READY

Requirements:
- R2 complete on a preregistered minimum set of independent scan dates;
- blocked/unknown/constrained rates quantified by date/cohort/pool;
- common-support cohort defined;
- formula/source version stable or changes explicitly stratified;
- no material silent market/cohort bias.

Meaning:
safe to describe distributions, coverage and disagreement states.

No predictive claim yet.

### R4_OUTCOME_JOIN_READY

Requirements:
- R3;
- outcome source has matching provenance quality;
- exact parent/evidence/outcome keyset join;
- no partial-date reader truncation;
- outcomes point-in-time after decision only;
- independent date/episode unit preserved;
- constrained and special-listing strata not silently pooled;
- experiment preregistered before outcome inspection.

Meaning:
descriptive forward outcomes may be inspected.

### R5_INCREMENTAL_INFERENCE_READY

Requirements:
- enough mature prospective observations for the specific preregistered comparison;
- BASE controls present on common support;
- redundancy residualization defined;
- date clustering / leave-one-date-out;
- regime / industry / liquidity splits;
- transaction-cost/slippage treatment where timing changes;
- multiple-testing ledger updated;
- purged train/holdout design when applicable.

Meaning:
the question "does this indicator add anything?" may be answered.

### R6_FORMAL_REVIEW_ELIGIBLE

Requirements:
reuse global project maturity gates, including:
- D5 mature sample >=60;
- prospective complete snapshots >=30;
- independent Formal scan dates >=15;
- >=2 years;
- >=2 market regimes;
- purged training scan dates >=10;
- holdout >=5 Formal scan dates;
- train/holdout directional consistency;
- no material candidate-coverage/zero-pick damage;
- redundancy/cost/overfit/Baseline-vs-Formal incremental checks pass.

Meaning:
a specific evidence-backed behavior change may qualify to be surfaced as FORMAL_OPTIMIZATION_CANDIDATE.

Even R6 does NOT authorize a Formal change.

## TI-368 — Readiness is per question, not per indicator name

Example:
MACD formula mechanics can be R0 PASS,
while MACD transition residual value remains R1/R2 blocked because prospective continuity-valid capture does not exist.

Likewise:
Bollinger finite-window mechanics can be R0 PASS while BBW-vs-VCP inference remains blocked by missing common prospective Pattern/runtime support.

Do not publish:
"MACD validated"
without naming the readiness dimension.

## TI-369 — Every expected parent gets one attempt result

Attempt status:
- VALID_OBSERVABLE;
- VALID_CONSTRAINED;
- BLOCKED_SOURCE;
- BLOCKED_CONTINUITY;
- BLOCKED_FORMULA_STATE;
- UNKNOWN_PROVENANCE.

Exactly one primary attempt status per expected parent per observer version.

Additional diagnostic reasons may be arrays.

A parent may not disappear because:
- history unavailable;
- corporate-action factor unresolved;
- price-limit reference unknown;
- recursive seed invalid.

Silent dropping creates endogenous research selection.

## TI-370 — Complete run receipt

Required:
- observerVersion;
- scanDate;
- captureGeneration;
- parentKeysetHash;
- expectedParentCount;
- attemptedParentCount;
- validObservableCount;
- validConstrainedCount;
- blockedCount;
- unknownCount;
- missingCount;
- provenanceConflictCount;
- continuityReceiptMissingCount;
- limitProvenanceUnknownCount;
- replayCheckedCount/failureCount;
- prefixCheckedCount/failureCount;
- formulaVersionCounts;
- stateLineageVersionCounts;
- startedAt/finishedAt;
- runStatus.

COMPLETE requires:
attemptedParentCount == expectedParentCount;
missingCount == 0;
provenanceConflictCount == 0;
no replay/prefix correctness failure.

Blocked/unknown rows do not make the run incomplete if they are explicitly attempted and accounted.

## TI-371 — Data readiness is not inference readiness

DATA_READY:
source/formula/provenance sufficient to trust the observation.

INFERENCE_READY:
the observation belongs to a sufficiently complete prospective common-support cohort with valid outcome joins and preregistered analysis.

ALPHA_MATURE:
incremental predictive/path-risk evidence passes project maturity/falsification gates.

These labels are not interchangeable.

A technically perfect formula can have:
ALPHA_MATURE = UNKNOWN.

## TI-372 — Current primary-queue readiness

### KD vs RSI
R0:
PASS materially.
- semantic fixtures pass;
- KD/RSI formulas deterministic.

R1:
BLOCKED.
- runtime TECHNICAL_CONTINUITY absent;
- prospective exact parent lineage not armed.

Special:
recursive replay/state construction required.

### MACD vs direct trend
R0:
PASS materially.
- formula/replay;
- F1-F12 response mechanics;
- exact alias map.

R1:
BLOCKED by same runtime provenance dependencies.

### ADX vs direct trend quality
R0:
PASS materially.
- isolated core;
- TA-Lib-style oracle;
- asymmetric initialization oracle;
- prefix invariance.

R1:
BLOCKED.
- requires H/L/C continuity + price-limit provenance + replay lineage.

### Bollinger vs ATR/VCP
R0:
PASS materially for Bollinger formula.
- population-std oracle;
- finite-window prefix QA.

R1:
BLOCKED by runtime continuity/limit provenance.
R5 comparison additionally depends on common-support Pattern/VCP evidence, whose runtime remains blocked.

No primary question is currently R4/R5-ready.

## TI-373 — Constrained observations and readiness

VALID_CONSTRAINED can be R1/R2 data-ready.

It must remain a separate stratum for R3/R4.

It cannot enter ordinary unconstrained incremental inference merely because:
- formula is valid;
- outcome later exists.

This prevents censorship/mechanism mixing.

## TI-374 — UNKNOWN is part of the denominator

Coverage reporting must retain:
- UNKNOWN source;
- BLOCKED continuity;
- constrained;
- valid ordinary.

Do not report only valid rows.

Minimum reporting:
- rate by scanDate;
- price pool;
- cohort membership;
- market (TWSE/TPEx);
- indicator family;
- blocked reason.

A seemingly strong effect with systematically missing difficult symbols/dates is not inference-ready.

## TI-375 — Version changes split evidence unless exact compatibility is proven

Changes that split lineage/version include:
- formulaVersion;
- continuityEngineVersion;
- corporateActionRegistryVersion where transformed history changes;
- symbolSessionContractVersion;
- priceLimitContractVersion;
- stateConstructionVersion.

Old/new rows may be pooled only after explicit compatibility evidence.

Do not silently relabel old rows into a newer contract.

## TI-376 — Prospective clock starts only when the whole contract is live

The prospective Technical Indicator evidence clock begins only when:
- immutable parent lineage exists;
- the observer is armed;
- source/continuity/limit/state contracts are persisted;
- run receipts enforce 100% attempt accounting.

It does NOT begin from:
- historical daily bars already present;
- isolated formula implementation date;
- specification date;
- reconstructed legacy Shadow rows.

Historical backfill may be used for mechanics/source QA only, never to fabricate prospective evidence age.

## TI-377 — Engineering classification

Pure isolated formula/readiness computation:
Class A research-only.

Shared D1 tables, Worker wiring, scheduled capture, shared continuity transform:
Class B proposal-first because they touch shared runtime/storage/fetch paths.

Any change to:
- A/B eligibility;
- score/rank/weight/threshold;
- Top6/3+3;
- capital;
- BUY/ADD/REDUCE/SELL;
- 15m execution;
- monitor/push
remains Class C.

This readiness document authorizes no implementation.

## TI-378 — Current decision

TECHNICAL_INDICATOR_FORMULA_QA = R0_MATERIAL_PASS
TECHNICAL_INDICATOR_SOURCE_RUNTIME = BELOW_R1
TECHNICAL_INDICATOR_CAPTURE = NOT_STARTED
DESCRIPTIVE_PROSPECTIVE_EVIDENCE = NOT_STARTED
OUTCOME_JOIN = NO_GO
INCREMENTAL_INFERENCE = NO_GO
FORMAL_REVIEW_ELIGIBILITY = NO

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze machine-readable readiness gate.
2. Do not start an evidence clock before exact parent/continuity/limit/runtime contracts are implemented.
3. Research may continue with isolated source/semantic QA.
4. The next engineering step, if eventually pursued, is a Class-B proposal for immutable research persistence/observer wiring; do not implement/merge/deploy without owner approval.
5. Until then, no alpha result can be legitimately generated for the primary Technical Indicator queue.
