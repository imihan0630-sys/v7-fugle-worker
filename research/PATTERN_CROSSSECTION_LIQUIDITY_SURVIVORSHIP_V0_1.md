# D01 DL-039 — Cross-Sectional Generalization vs Liquidity / Size / Survivorship Selection V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / CROSS_SECTION_SELECTION_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-038 separated detector robustness from economic robustness.

DL-039 freezes another generalization hazard:

> Pattern may appear robust only because large, liquid, long-listed and data-rich stocks are easier to observe, easier to detect, more likely to generate clean opportunities and easier to trade.

Cross-sectional generalization therefore requires an explicit attrition ledger from the point-in-time universe through detector, opportunity and execution readiness.

No economic outcome is opened in D01.

## 2. Evidence context

External evidence makes size/liquidity conditioning non-optional.

- Taiwan firm-level technical-trading evidence finds profitability associated with firm size and trading volume.
- Taiwan size-effect evidence shows illiquidity and price-limit related limits-to-arbitrage matter for cross-sectional behavior.
- Survivorship-bias literature shows historical cross-sectional results can change when delisted/non-surviving firms are restored.

Therefore:
- size/liquidity are not harmless background descriptors;
- current survivors cannot reconstruct a historical universe;
- data-rich symbols cannot silently become the study population.

## 3. Target population must be frozen

Every future design declares one target population before outcomes:

A. POINT_IN_TIME_MARKET_UNIVERSE
- all securities belonging to the historically valid universe under the canonical universe receipt.

B. FORMAL_ELIGIBLE_UNIVERSE
- only symbols passing the existing Formal eligibility frame at the decision timestamp.

If B is used:
- conclusions apply only to the Formal-eligible universe;
- market-wide generalization is prohibited.

D01 does not redefine Formal liquidity/price eligibility.

## 4. Universe authority

D01 consumes an existing point-in-time universe receipt.

Preferred canonical source when validated:
- System 2 historical universe registry / snapshot;
- current + delisted membership intervals;
- future delisting information hidden from the strategy timestamp.

D01 does not build a second historical-universe taxonomy.

If the authoritative point-in-time universe receipt is unavailable:
UNIVERSE_DATA_BLOCKED.

## 5. Cross-sectional attrition stages

Every symbol/date in the frozen target population remains represented through exactly one downstream status at each stage.

U0 TARGET_UNIVERSE_ELIGIBLE

U1 HISTORY_READY
- required pre-decision history is available under listing-age-aware semantics.

U1A HISTORY_TOO_SHORT_BY_DESIGN
- listing age is shorter than detector minimum history;
- not a data failure;
- not a negative pattern case.

U1B HISTORY_DATA_BLOCKED
- expected historical sessions should exist but required data/provenance is incomplete.

U2 DETECTOR_EVALUABLE

U2A DETECTOR_NO_STRUCTURE
- detector ran causally and emitted no eligible structure.

U2B DETECTOR_DATA_BLOCKED

U3 STRUCTURE_EMITTED

U4 OPPORTUNITY_READY

U4A NO_VALID_OPPORTUNITY
- structure exists but no valid future interaction opportunity in the evaluation design.

U4B OPPORTUNITY_DATA_BLOCKED

U5 ECONOMIC_EVALUABLE
- only future D16 may open outcomes.

U6 TRADABILITY_EVALUABLE
- execution / cost receipts are sufficiently observed.

No downstream stage may delete upstream members from the denominator without an explicit state.

## 6. Listing-age firewall

A new listing may have perfect data but insufficient causal history for the detector.

If listing-age-aware expected history is complete but detectorMinimumHistorySessions is not reached:
HISTORY_TOO_SHORT_BY_DESIGN.

Do not classify as:
- missing;
- detector failure;
- no structure;
- negative pattern.

This prevents mature listings from dominating simply because only they can satisfy a long lookback.

## 7. Historical-survivorship firewall

Historical symbol membership uses point-in-time intervals.

Prohibited:
- today's listed symbols as the historical universe;
- dropping later-delisted members;
- using known future delisting date as a decision-time signal;
- silently ending a symbol's record because later outcomes are inconvenient.

A later delisting is not automatically a zero return or business failure.
D16 must own terminal-outcome / censoring treatment.

D01 only preserves membership and later-evaluation state.

## 8. Data survivorship firewall

Keep separate:
- DATA_OBSERVABLE;
- HISTORY_TOO_SHORT_BY_DESIGN;
- HISTORY_DATA_BLOCKED;
- DETECTOR_DATA_BLOCKED;
- OPPORTUNITY_DATA_BLOCKED;
- EXECUTION_CONTEXT_UNKNOWN.

UNKNOWN is not NO_STRUCTURE.

Only clean symbols must not define the denominator.

## 9. Liquidity and size context

D01 consumes point-in-time owner receipts for:
- market capitalization / size;
- value traded / volume / turnover;
- spread/depth where available;
- relative tick;
- price tier;
- price-limit / constrained-session state;
- listing age.

D01 does not invent alternative liquidity or size formulas.

All receipts must be as-of safe.
Current/future liquidity or current market cap cannot be backfilled into historical decisions.

## 10. Formal liquidity eligibility vs research generalization

A pre-existing Formal liquidity filter may legitimately exclude symbols from the tradable strategy universe.

This does not erase the scientific selection issue.

Future reports must show:
- target market-universe denominator;
- Formal-eligible denominator;
- detector-evaluable denominator;
- opportunity denominator;
- tradability denominator.

If analysis starts after the Formal filter:
claim scope = FORMAL_ELIGIBLE_UNIVERSE_ONLY.

No market-wide claim.

## 11. Detection bias vs tradability bias

Two questions are distinct.

DETECTABILITY:
Can the structure be causally detected from available point-in-time data?

TRADABILITY:
Can the resulting opportunity be executed with sufficient liquidity/cost evidence?

A symbol may be:
- detector-evaluable but not tradability-evaluable;
- tradable but history-ineligible for the detector;
- data-ready but no structure;
- structure-emitted but no opportunity.

Do not merge these states.

## 12. Cross-sectional coverage matrix

Future reports preserve counts and rates by point-in-time context.

At minimum:
- market;
- size context;
- liquidity context;
- listing-age context;
- price/tick context.

For each stratum:
- targetEligibleCount;
- historyReadyCount;
- historyTooShortCount;
- historyBlockedCount;
- detectorEvaluableCount;
- noStructureCount;
- structureEmittedCount;
- opportunityReadyCount;
- noOpportunityCount;
- opportunityBlockedCount;
- economicEvaluableCount;
- tradabilityEvaluableCount.

Strata definitions must be frozen before outcomes.

## 13. No successful-case denominator

Prohibited denominators:
- only symbols where a structure was emitted;
- only symbols that later retested;
- only symbols with complete execution data;
- only current survivors;
- only symbols with sufficient history if listing-age attrition is hidden.

Coverage rates must preserve the appropriate upstream denominator.

## 14. Cross-sectional concentration

A multi-symbol sample can still be economically concentrated.

Future reports must separate:
- uniqueSymbolCount;
- uniqueRootCount;
- opportunityCount;
- top1SymbolShare;
- top5SymbolShare;
- symbolConcentrationMeasure if preregistered.

One stock producing most roots/opportunities cannot support a broad cross-sectional claim.

D01 freezes fields; D16 owns inference thresholds.

## 15. Common-support firewall

Future economic comparison requires overlap in point-in-time:
- size;
- liquidity;
- listing age;
- price/tick tier;
- market;
- regime;
- detector-history readiness;
- D02 acceptance where relevant.

If old/young, pattern/control or success/failure groups occupy disjoint size/liquidity regions:
CROSS_SECTIONAL_EXTRAPOLATION_PROHIBITED.

No outcome-based trimming to create support.

## 16. Liquidity-conditioned technical effect is not Pattern alpha

If Pattern works only in large/high-volume symbols, possible interpretations include:
- cleaner price discovery;
- better detector observability;
- different trend persistence;
- lower noise/tick distortion;
- lower cost;
- selection into cleaner data.

D01 does not choose the mechanism.

Likewise, stronger apparent returns in illiquid names may reflect:
- stale prices;
- nonsynchronous trading;
- spread effects;
- limits-to-arbitrage;
- untradeable marks.

Economic interpretation belongs to D16/D04/D05 with appropriate controls.

## 17. Point-in-time filter timing

Any eligibility/filter receipt must carry:
- calculatedAt;
- asOfMarketDate;
- sourceVersion;
- ruleVersion;
- fields known at decision time.

If a liquidity/size value is known only after the predictor freeze:
POST_HOC_FILTER_NOT_ELIGIBLE.

## 18. Delisting / suspension / price-limit handling

Keep separate:
- DELISTED_DURING_EVALUATION;
- SUSPENDED;
- PRICE_LIMIT_CONSTRAINED;
- NORMAL_TRADING;
- UNKNOWN.

No state is silently dropped.

D01 does not assign terminal returns.

## 19. Cross-sectional readiness ladder

X0 TARGET_UNIVERSE_UNFROZEN

X1 POINT_IN_TIME_UNIVERSE_READY

X2 HISTORY_AND_DATA_ATTRITION_AUDITED

X3 DETECTOR_COVERAGE_BY_SIZE_LIQUIDITY_READY

X4 COMMON_SUPPORT_AND_SURVIVORSHIP_READY

X5 OPPORTUNITY_SELECTION_AUDITED

X6 TRADABILITY_CONTEXT_AUDITED

These are readiness stages, not economic success stages.

## 20. D16 handoff questions

F1:
Does Pattern representation survive cross-symbol inference after point-in-time universe restoration?

F2:
Does apparent effect change after size/liquidity adjustment?

F3:
Is detection/emission probability itself strongly size/liquidity dependent?

F4:
Are later-delisted / short-history / data-blocked symbols systematically different?

F5:
Does any effect survive common support and symbol concentration controls?

F6:
Does it survive tradability/cost treatment?

F7:
Does it remain incremental to PRICE_OHLC / D02 / D03 under SDA-001?

## 21. Required manifest fields

Per design:
- experimentId;
- targetPopulationType;
- symbolUniverseVersion;
- universeSnapshotId/hash;
- formalEligibilityRuleVersion;
- detectorMinimumHistorySessions;
- coveragePolicyId;
- missingnessPolicyId;
- sizeLiquidityReceiptVersion;
- listingAgePolicyVersion;
- pointInTimeFilterPolicyId;
- concentrationPolicyId;
- commonSupportPolicyId;
- outcomeJoinState;
- manifestVersion/hash.

Per symbol/date:
- parentDecisionId;
- marketDate;
- market;
- symbol;
- membershipStateAtDate;
- listingDateKnownAt;
- listingAgeEligibleSessions;
- targetUniverseEligible;
- formalEligible;
- historyStage;
- detectorStage;
- structureStage;
- opportunityStage;
- economicEvaluabilityStage;
- tradabilityStage;
- sizeReceipt;
- liquidityReceipt;
- relativeTickReceipt;
- constraintState;
- delistingDuringEvaluationState;
- source/provenance receipts.

No future-return field belongs in the D01 manifest.

## 22. Current decision

CURRENT_SURVIVORS_CAN_DEFINE_HISTORICAL_UNIVERSE =
FALSE.

HISTORY_TOO_SHORT_EQUALS_DATA_MISSING =
FALSE.

DATA_BLOCKED_EQUALS_NO_STRUCTURE =
FALSE.

NO_RETEST_EQUALS_FAILED_PATTERN =
FALSE.

FORMAL_ELIGIBLE_SAMPLE_EQUALS_MARKET_WIDE_GENERALIZATION =
FALSE.

LIQUIDITY_FILTER_MAY_USE_FUTURE_DATA =
FALSE.

DELISTED_SYMBOLS_CAN_BE_SILENTLY_DROPPED =
FALSE.

CLEAN_DATA_ONLY_DENOMINATOR =
PROHIBITED.

ECONOMIC_VALIDATION_OWNER =
D16.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 23. Exact next continuation

1. Build deterministic target-population / attrition-stage / point-in-time receipt helper and adversarial tests.
2. Preserve listing-age insufficiency separately from data missingness and no-structure states.
3. Preserve market-universe vs Formal-eligible claim scope explicitly.
4. Hand X0-X6 / size-liquidity common-support / delisting / concentration semantics to D16.
5. Consume existing System 2 historical-universe and D04/D05 liquidity owners without redefining their taxonomies.
6. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS.
7. Next D01 science: separate cross-sectional coverage from sector/industry composition so a Pattern effect concentrated in one industry is not mislabeled as generic chart-structure evidence.
8. No outcome join / no runtime wiring / no Formal change.
