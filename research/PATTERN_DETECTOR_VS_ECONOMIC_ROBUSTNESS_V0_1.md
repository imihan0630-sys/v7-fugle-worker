# D01 DL-038 — Detector Robustness vs Economic Robustness Across Symbols, Dates and Regimes V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / GENERALIZATION_FIREWALL / SDA_001_SDA_002_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-037 froze detector-parameter-family robustness.

DL-038 separates two concepts that must never be conflated:

A. DETECTOR_ROBUSTNESS
Does the same local price geometry receive a stable structural identity across frozen detector variants?

B. ECONOMIC_ROBUSTNESS
Does the structural state retain incremental economic representation across different symbols, dates, regimes and independent evaluation periods?

A can be high while B is zero or unknown.

No return outcome is opened in D01.

## 2. Evidence context

The technical-rule literature repeatedly shows that in-sample or local stability does not guarantee out-of-sample persistence.

- Sullivan, Timmermann and White show technical-rule universes require data-snooping correction.
- Fang et al. report that several well-known technical rules did not retain predictive evidence in a true fresh out-of-sample period.
- Chuang et al. (2024) test tens of thousands of rules in China; after multiple-testing correction, out-of-sample evaluation and costs, much apparent profitability disappears.
- Recent breakout evidence also shows rule behavior varies materially with market conditions.

These results motivate a generalization firewall.

## 3. Two-axis state space

Freeze two independent axes.

### D-AXIS — DETECTOR

D0 DETECTOR_NOT_EVALUABLE
D1 DETECTOR_UNSTABLE
D2 DETECTOR_LOCALLY_STABLE

D2 may be supported by DL-037 robustness descriptors.

### E-AXIS — ECONOMIC

E0 ECONOMIC_NOT_OPENED
E1 ECONOMIC_LOCAL_ONLY
E2 ECONOMIC_MULTI_SYMBOL
E3 ECONOMIC_MULTI_DATE
E4 ECONOMIC_MULTI_REGIME
E5 ECONOMIC_PROSPECTIVE_OOS_COST_AWARE

D01 may only freeze readiness semantics.
D16 owns actual E-axis promotion evidence.

## 4. Detector stability cannot promote economic evidence

High sameRootSupportRate or low conflictRate means:
the detector is stable on the same parent geometry.

It does NOT imply:
- positive expected return;
- stable response across stocks;
- stable response across dates;
- regime invariance;
- cost-adjusted profitability;
- OOS persistence.

DETECTOR_ROBUSTNESS_TO_ECONOMIC_PROMOTION =
PROHIBITED.

## 5. Parent / root dependence

Repeated observations of one persistent root across adjacent dates do not create independent economic replication.

Future D16 must distinguish:
- unique decision parents;
- unique structural roots;
- unique object episodes;
- independent date clusters;
- unique symbols;
- regime strata.

A single root observed 30 times is not 30 independent replications.

## 6. Symbol generalization

A detector can be stable on one stock but fail elsewhere.

Future multi-symbol evidence must report:
- eligible symbol count;
- included symbol count;
- missing/data-blocked symbol count;
- symbol-level effect distribution;
- concentration in top contributors;
- whether one or a few symbols dominate.

Do not average one dominant stock across many dates and call it broad cross-sectional evidence.

## 7. Date generalization

Adjacent dates share:
- the same market regime;
- the same root;
- overlapping outcome windows;
- repeated information.

Future D16 must cluster/dependence-adjust date evidence.

Required:
- independent date or episode clusters;
- preregistered evaluation windows;
- no best-date selection.

## 8. Regime generalization

A result can be:
- stable within one regime;
- absent in another;
- reversed in another.

Regime labels must come from canonical ex-ante owners.

D01 does not mine regimes from Pattern performance.

No:
"Pattern worked in these months, therefore define them as the favorable regime."

## 9. Coverage selection firewall

Economic robustness can be overstated if evaluation includes only:
- symbols with complete data;
- clean pattern cases;
- liquid names;
- cases that generated a retest;
- roots that remained detector-visible.

Future reports must include:
- eligible denominator;
- observed/evaluable denominator;
- data-blocked cases;
- no-opportunity cases;
- coverage by symbol/date/regime.

UNKNOWN is not zero and is not dropped silently.

## 10. Economic replication unit

One economic replication unit should be independent enough to test generalization.

Possible future D16 units:
- root episode;
- symbol-by-independent-date cluster;
- preregistered regime block;
- prospective selection date.

D01 does not choose the estimator.

But the unit cannot be:
- detector variant;
- repeated daily snapshot of same root;
- named-pattern alias;
- volume/indicator confirmation derived from same parent.

## 11. In-sample / OOS separation

For future economic validation, record:

developmentPeriodId;
validationPeriodId;
holdoutId;
holdoutFirstOpenedAt;
holdoutUseCount;
prospectiveFlag.

Repeatedly opening the same holdout converts it into development information.

D16 owns holdout-use governance.

## 12. Transaction cost and execution boundary

Economic robustness is not established by gross return alone.

Future higher-level evidence must preserve:
- spread;
- slippage;
- fees/taxes;
- capacity;
- fillability;
- unfilled/cancel/reject states where applicable.

D01 does not estimate execution Alpha.

## 13. Generalization matrix

Future D16 may populate:

G0 LOCAL_DETECTOR_ONLY
- detector robustness only;
- economic outcomes unopened or local.

G1 CROSS_SYMBOL
- same preregistered semantic rule across multiple symbols.

G2 CROSS_DATE
- independent date/root/episode clusters.

G3 CROSS_REGIME
- multiple ex-ante regimes with adequate support.

G4 PROSPECTIVE_OOS
- prospective/OOS evidence with holdout discipline.

G5 COST_AWARE
- G4 plus executable cost/capacity treatment.

No row may be skipped by claiming detector stability.

## 14. Economic robustness labels

Allowed future interpretation:

R0 DETECTOR_STABLE_ECONOMIC_UNKNOWN
R1 LOCAL_ONLY
R2 CROSS_SYMBOL_BUT_DATE_FRAGILE
R3 CROSS_DATE_BUT_REGIME_SPECIFIC
R4 MULTI_REGIME_REPLICATED
R5 PROSPECTIVE_OOS_REPLICATED
R6 COST_AWARE_INCREMENTAL
R7 NOT_EVALUABLE

Only D16 / later governance can assign R1-R6 from outcome evidence.

D01 can only freeze the taxonomy and readiness requirements.

## 15. SDA-001 relation

Detector variants, multiple roots, named pattern aliases and repeated dates may all inflate apparent evidence.

Future reporting therefore keeps:
- raw representation N;
- deduped PRICE_OHLC effective evidence N;
- unique structural roots;
- independent economic replication N.

These Ns are different.

No confluence score may substitute for them.

## 16. SDA-002 relation

Generalization evidence must use only replay-safe pattern receipts.

If a pattern receipt was confirmed with future bars:
- it is excluded from the corresponding historical predictor set;
- it may not enter cross-symbol/date/regime replication.

A large sample of hindsight-labeled patterns remains invalid.

## 17. Research readiness helper

Before outcomes can be opened, a candidate validation design must freeze:
- semantic detector contract;
- parameterFamilyId;
- parent identity;
- structural-root identity;
- symbol universe/vintage;
- date windows;
- regime owner/version;
- target/benchmark/horizon;
- cost treatment;
- missingness policy;
- dependence unit;
- holdout policy.

Missing any required item:
ECONOMIC_VALIDATION_NOT_READY.

## 18. Future falsification questions

F1:
Does detector robustness correlate with economic performance at all?

F2:
Does any local result survive cross-symbol generalization?

F3:
Does it survive independent dates/episodes?

F4:
Does it survive ex-ante regimes without cherry-picking?

F5:
Does it survive prospective/OOS holdout discipline?

F6:
Does it survive costs/capacity?

F7:
Does Pattern add residual value beyond direct PRICE_OHLC baseline and overlapping D02/D03 families?

F7 remains central under SDA-001.

## 19. Required manifest fields

Per research design:
- experimentId;
- semanticRuleId;
- detectorFamilyId;
- parameterFamilyId;
- parameterGridHash;
- targetDefinitionId;
- benchmarkId;
- horizonId;
- costPolicyId;
- parentIdentityContractId;
- structuralIdentityContractId;
- symbolUniverseVersion;
- eligibleSymbolCount;
- dateWindowId;
- regimeOwner;
- regimeVersion;
- dependenceUnit;
- holdoutId;
- holdoutFirstOpenedAt;
- holdoutUseCount;
- prospectiveFlag;
- coveragePolicyId;
- missingnessPolicyId;
- informationRoot;
- redundancyGroup;
- outcomeJoinState;
- manifestVersion/hash.

No future return field belongs in this D01 readiness manifest.

## 20. Current decision

DETECTOR_ROBUSTNESS_EQUALS_ECONOMIC_ROBUSTNESS =
FALSE.

PARAMETER_STABILITY_EQUALS_GENERALIZATION =
FALSE.

REPEATED_ROOT_DATES_EQUAL_INDEPENDENT_REPLICATIONS =
FALSE.

REGIME_DISCOVERY_FROM_PATTERN_PERFORMANCE =
PROHIBITED.

COVERAGE_FAILURES_CAN_BE_SILENTLY_DROPPED =
FALSE.

ECONOMIC_VALIDATION_OWNER =
D16.

INFORMATION_ROOT =
PRICE_OHLC.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

SDA_002_STATUS =
REMEDIATION_IN_PROGRESS.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic validation-readiness and replication-unit accounting helper plus adversarial tests.
2. Preserve detector robustness, economic replication and coverage as separate ledgers.
3. Hand G0-G5 / R0-R7 generalization ladder to D16.
4. Keep PRICE_OHLC deduped evidence N separate from structural-root N and economic-replication N.
5. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS until canonical closure evidence exists.
6. Next D01 science: separate cross-sectional generalization from liquidity/size survivorship so Pattern does not appear robust only because data-rich liquid stocks are easier to detect and trade.
7. No outcome join / no runtime wiring / no Formal change.
