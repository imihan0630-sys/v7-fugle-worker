# D01 DL-041 — Pattern Generalization vs Market-Wide Common Shocks / Beta V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MARKET_COMMON_SHOCK_FIREWALL / SDA_001_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-040 separated Pattern generalization from sector / industry composition.

DL-041 freezes the next confound:

> A Pattern result may appear to replicate across several sectors on the same dates because the whole market moved together, because the selected stocks carry similar market beta, or because one market-wide shock drove both the Pattern state and the later response.

Many sectors on one market date are not automatically independent Pattern replications.

No future outcome is opened in D01.

## 2. Evidence context

External and internal evidence make a market-common-shock firewall mandatory.

- CAPM / factor research treats market beta as systematic exposure rather than stock-specific alpha.
- Taiwan evidence reports a conditional relationship between beta and returns and also shows beta can be state-dependent rather than constant.
- Taiwan latent-factor evidence finds an aggregate factor explains a large share of stock-return fluctuation in the full sample, while common-factor importance rises during adverse macro events.
- Crisis-shock research shows market-wide / global shocks can dominate residual equity returns during stress periods.

Therefore cross-sector breadth is not sufficient evidence of stock-specific Pattern incrementality.

## 3. Ownership boundary

D01 owns:
- Pattern structural state;
- Pattern opportunity state;
- Pattern claim scope;
- the firewall that prevents market-wide dependence from being counted as independent Pattern replication.

D19 owns:
- benchmark construction / methodology;
- market beta;
- benchmark-relative alpha / residual interpretation;
- factor exposure and multicollinearity.

D18 owns:
- market regime / common market-state semantics where canonically available.

D13 owns:
- global / cross-market shock receipts.

D09 owns:
- sector context from DL-040.

D01 consumes owner receipts and does not rebuild beta, benchmark, market-regime or global-shock models.

## 4. Market context receipt

For each parent / predictor freeze preserve when owner data exist:

- benchmarkId;
- benchmarkVersion;
- benchmarkKnownAt;
- benchmarkReturnAsOf;
- candidateIncludedInBenchmark;
- candidateWeightInBenchmark where owner-replayable;
- exCandidateBenchmarkReceipt where supported;
- betaModelId;
- betaModelVersion;
- betaEstimate;
- betaEstimateKnownAt;
- betaEstimationWindow;
- betaObservationCount;
- betaState;
- D18 marketRegimeReceipt;
- D13 globalShockReceipt where relevant;
- source / provenance / hash.

UNKNOWN remains UNKNOWN.

## 5. Beta is pre-outcome exposure, not alpha

A beta estimate is context.

It does not imply:
- bullishness;
- independent alpha;
- a bonus / penalty;
- higher confidence.

Future economic inference may use beta to ask whether Pattern response remains after systematic market exposure is controlled.

D01 never converts beta into a Pattern score.

## 6. Beta model freeze

Beta results can depend on:
- benchmark;
- return frequency;
- estimation window;
- thin-trading adjustment;
- conditional / dynamic specification.

Therefore the beta model / benchmark version must be frozen before outcomes.

Prohibited:
- trying several beta windows after outcomes;
- selecting the beta model that preserves Pattern significance;
- replacing a weak market control with a favorable one;
- importing a current beta estimate into historical predictor snapshots.

If beta receipt is unavailable:
BETA_CONTEXT_UNKNOWN.

Do not impute beta = 1 or 0.

## 7. Market-date dependence

A cross-sector Pattern result may contain:
- 20 stock rows;
- 15 symbols;
- 8 sectors;
- but only 2 market dates.

Those are not 20 or 8 independent market-shock replications.

Future D16 reports separately:
- stockObservationN;
- uniqueSymbolN;
- structuralRootN;
- uniqueSectorN;
- sectorDateClusterN;
- marketDateClusterN;
- commonShockClusterN where an owner receipt exists.

Market-date N is a first-class replication count.

## 8. Market-wide common shock state

D01 does not create an arbitrary shock threshold.

Consume owner state where available.

Allowed generic states:
- MARKET_CONTEXT_KNOWN;
- MARKET_CONTEXT_UNKNOWN;
- OWNER_COMMON_SHOCK_ACTIVE;
- OWNER_COMMON_SHOCK_INACTIVE;
- OWNER_COMMON_SHOCK_UNKNOWN.

No "TAIEX up > X%" threshold is defined in D01.

## 9. Candidate self-inclusion firewall

A cap-weighted benchmark can contain the candidate itself.

Then candidate price contributes to:
- the Pattern;
- the benchmark return used as market control.

This is direct mechanical self-inclusion.

Preferred when D19 owner supports it:
EX_CANDIDATE_MARKET_CONTEXT.

If unavailable:
SELF_INCLUSION_UNRESOLVED.

An included-candidate market statistic cannot be described as independent confirmation.

Even ex-candidate market context remains a context/control family, not a second alpha vote.

## 10. Sector replication vs market replication

DL-040 C5 CROSS_SECTOR_PATTERN_CANDIDATE is not yet market-independent evidence.

A result may replicate across:
- semiconductors;
- financials;
- shipping;
- industrials

on the same broad-market surge.

DL-041 therefore requires a second replication layer:
CROSS_MARKET_DATE_RESIDUAL_REPLICATION.

Cross-sector breadth and cross-market-date breadth are different.

## 11. Beta concentration

Even when sectors differ, selected Pattern names may all be high-beta names.

Future reports should preserve:
- beta distribution;
- beta coverage;
- beta concentration by Pattern state;
- beta overlap between Pattern and controls.

No high / medium / low beta threshold is frozen in D01.

If Pattern cases and controls occupy disjoint beta regions:
BETA_COMMON_SUPPORT_FAILED.

Do not extrapolate.

## 12. Market absorption / same-day response

For after-market selection, much of a market shock may already be reflected in the Taiwan close.

Therefore future D16 tests should distinguish:
- same-day market move already observed;
- next-session response;
- residual response after market / sector context;
- gap vs open-to-close continuation.

D01 only freezes the context timing.

No next-session outcome belongs in this manifest.

## 13. Market factor is model-relative

A benchmark residual depends on the selected benchmark / beta model.

Therefore:
- RAW_RESPONSE;
- MARKET_ADJUSTED_RESPONSE;
- BETA_RESIDUAL_RESPONSE

are different future estimands.

A Pattern claim that survives one residualization but not another is MODEL_SENSITIVE, not automatically robust.

D19 owns the benchmark/beta model inventory.
D16 owns economic comparison.

## 14. Nested future comparison ladder

M0 RAW_CROSS_SECTOR_PATTERN
- descriptive only.

M1 MARKET_DATE_MATCHED
- match / cluster by market date and market state.

M2 EX_CANDIDATE_MARKET_CONTEXT
- use ex-candidate benchmark / breadth where owner-supported.

M3 BETA_MARKET_RESIDUAL_CONTROLLED
- use frozen D19 beta / benchmark model.

M4 SECTOR_PLUS_MARKET_RESIDUAL
- add DL-040 sector controls and market residualization.

M5 CROSS_MARKET_DATE_RESIDUAL_REPLICATION
- require residual representation across multiple independent market dates / regimes.

No stage may be skipped by pointing to many stocks or sectors.

## 15. Future interpretation states

R0 MARKET_COMMON_SHOCK_EXPLANATION
- raw Pattern difference vanishes after market-date matching / common-shock control.

R1 BETA_EXPOSURE_EXPLANATION
- difference vanishes after beta / benchmark exposure control.

R2 MARKET_REGIME_EXPLANATION
- difference is restricted to one preregistered market regime.

R3 SECTOR_PLUS_MARKET_EXPLANATION
- DL-040 sector plus market context jointly explains the raw result.

R4 RESIDUAL_PATTERN_INCREMENT
- Pattern remains after frozen market / beta / sector controls on common support.

R5 CROSS_MARKET_DATE_RESIDUAL_CANDIDATE
- residual representation replicates across independent market-date clusters.

R6 MODEL_SENSITIVE
- conclusion changes materially across preregistered benchmark/beta models.

R7 NOT_EVALUABLE
- owner receipts / common support / timing / coverage inadequate.

None proves alpha.

## 16. Common support

Future inference requires overlap in:
- DL-039 size / liquidity / listing age;
- DL-040 sector context;
- market regime;
- beta;
- benchmark / market-return context;
- Pattern opportunity geometry;
- detector history readiness;
- price / tick tier.

If Pattern and controls occupy different systematic-risk regions:
MARKET_BETA_EXTRAPOLATION_PROHIBITED.

## 17. SDA-001 relation

Candidate Pattern is PRICE_OHLC-derived.

Market / sector returns are also price-derived contexts.

If candidate is included in the benchmark or sector context, direct price reuse exists.

Even after candidate exclusion:
- market beta / sector / Pattern remain correlated price-derived representations;
- they are controls / exposure decompositions, not automatic independent votes.

SDA-001 remains REMEDIATION_IN_PROGRESS.

## 18. Common-shock days are not discarded

Do not remove strong market days merely because they are inconvenient.

Preserve:
- normal dates;
- high-common-shock dates;
- crisis dates where owner-defined;
- unknown context.

Future D16 may run:
- full sample;
- shock-excluded sensitivity;
- leave-one-market-date-out;
- regime-stratified analysis.

No outcome-selected date deletion.

## 19. Claim-scope ladder

Possible research claim scope:

MARKET_CONTEXT_UNRESOLVED
- market/beta receipts incomplete.

MARKET_EXPLAINED_PATTERN
- raw effect largely common-market exposure.

MARKET_CONDITIONAL_PATTERN
- Pattern only exists in preregistered market states.

MARKET_RESIDUAL_PATTERN
- Pattern adds representation after market/beta controls.

CROSS_MARKET_DATE_PATTERN_CANDIDATE
- residual representation survives independent market dates.

No claim becomes Formal automatically.

## 20. Required manifest fields

Per experiment:
- experimentId;
- benchmarkPolicyId;
- betaPolicyId;
- marketRegimePolicyId;
- marketClusteringPolicyId;
- exCandidateMarketPolicyId;
- sectorControlPolicyId;
- commonSupportPolicyId;
- outcomeJoinState;
- manifestVersion/hash.

Per parent / opportunity:
- parentDecisionId;
- marketDate;
- symbol;
- sectorId;
- structuralRootId;
- opportunityState;
- benchmarkId;
- benchmarkVersion;
- benchmarkKnownAt;
- candidateIncludedInBenchmark;
- candidateWeightInBenchmark;
- exCandidateBenchmarkState;
- betaModelId;
- betaModelVersion;
- betaEstimate;
- betaEstimateKnownAt;
- betaEstimationWindow;
- betaObservationCount;
- betaState;
- marketRegimeState;
- commonShockState;
- sectorContextReceipt;
- DL-039 cross-sectional receipt;
- source/provenance receipt.

No future return field belongs in D01.

## 21. Current decision

MANY_SECTORS_ONE_DATE_EQUALS_INDEPENDENT_REPLICATION =
FALSE.

BETA_EQUALS_ALPHA =
FALSE.

CURRENT_BETA_CAN_BACKFILL_HISTORY =
FALSE.

OUTCOME_SELECTED_BETA_MODEL =
PROHIBITED.

CANDIDATE_INCLUDED_BENCHMARK_EQUALS_INDEPENDENT_CONFIRMATION =
FALSE.

EX_CANDIDATE_MARKET_CONTEXT_EQUALS_NEW_ALPHA_VOTE =
FALSE.

CROSS_SECTOR_EQUALS_CROSS_MARKET_DATE =
FALSE.

UNKNOWN_BETA_CAN_BE_IMPUTED =
FALSE.

D19_OWNER_BETA_REDEFINED_BY_D01 =
FALSE.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

ECONOMIC_VALIDATION_OWNER =
D16.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 22. Exact next continuation

1. Build deterministic market-context / beta receipt validation, candidate-self-inclusion and replication-count helpers plus adversarial tests.
2. Preserve cross-sector replication and cross-market-date replication as separate dimensions.
3. Consume D19 benchmark/beta receipts, D18 market regime and D13 global-shock receipts without recreating owner models.
4. Hand M0-M5 / R0-R7 dependence-aware residual inference to D16.
5. Preserve SDA-001 as REMEDIATION_IN_PROGRESS until residual evidence / system lineage / independent 00 closure.
6. Next D01 science: separate market-wide common shocks from event-day clustering / scheduled-information days so one CPI/FOMC/earnings-season shock cluster is not mislabeled as independent Pattern replication.
7. No outcome join / no runtime wiring / no Formal change.
