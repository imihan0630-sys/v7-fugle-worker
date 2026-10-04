# System 1 selection-improvement evidence matrix V0.1

Date: 2026-10-04 Asia/Taipei
Status: STRUCTURAL_AUDIT_COVERAGE_CONSOLIDATED / PROSPECTIVE_EVIDENCE_PENDING / FORMAL_CORE_LOCKED

## Purpose

Prevent endless audit proliferation while preserving the original objective:

**improve System 1 stock-selection logic only when the exact current gate/ranking mechanism has clean prospective evidence showing avoidable opportunity loss or redundant decision influence.**

This matrix is not a new scoring model. It is the routing authority for what should be researched next versus what should now wait for genuine trading-session evidence.

## Current Formal gate coverage

| Formal gate | Current role / defect | Current research owner / evidence | Readiness for logic change | Next action |
|---|---|---|---|---|
| PRICE_FLOOR | Owner-fixed universe policy | A2 gate-role inventory | NOT A RESEARCH RELAXATION TARGET | Preserve <10 exclusion |
| HISTORY_60D | Confidence / feature sufficiency | P1-A minimal-blocking contract | EVIDENCE/PIPELINE ISSUE, NOT NEGATIVE ALPHA | Keep UNKNOWN/blocked semantics |
| RS_CONTEXT | Confidence / availability only | P1-A minimal-blocking + C5 reach | SAME | Do not treat missing RS as bearish alpha |
| MARKET_CAP_FLOOR | Mixed: missing data vs known <10bn economic/context threshold | P1-A explicitly splits missing vs economic threshold; gate overlap exists | **REMAINING DIRECT GAP for known <10bn economic threshold** | Prospective economic-threshold counterfactual may be designed Class-A; no Formal change |
| DAILY_ABNORMALITY | Context proxy over-hardened; +/-9.8 is not legal limit state | extreme-move structural falsification + PR #559 daily formal-reach denominator | PROSPECTIVE INCIDENCE READY / OFFICIAL STATE NOT JOINED | Wait for genuine dates; keep UP/DOWN/missing separate |
| LIQUIDITY | Execution proxy over-hardened | V8.17 memberships + PR #563 LIQUIDITY_REJECTED_CONTROL | PROSPECTIVE SELECTION-TIME CONTROL READY | Wait quality + independent dates + executable outcome evidence |
| SMALL_CAP_SPECIAL | Context/primary by horizon; over-hardened | market-cap conditional-admission audit + liquidity control | PROSPECTIVE INCIDENCE READY | Wait outcomes |
| MID_CAP_LIQUIDITY | Context/primary by horizon; over-hardened | market-cap conditional-admission audit + liquidity control | PROSPECTIVE INCIDENCE READY | Wait outcomes |
| CHIP_CONCENTRATION_PRESENT | Confidence/presence, not chip-quality alpha | P1-A minimal-blocking contract | P1-A OWNER | Do not build duplicate gate audit |
| FINANCIAL_SOURCE_COMPLETENESS | Confidence / source completeness | P1-A minimal-blocking contract | P1-A OWNER | Do not equate missing source with negative alpha |
| ANNOUNCEMENT_RISK | Concrete severe official event risk | A2 aligned-hard classification + gate observer | HARD INVALIDATION SUBJECT TO PIT QUALITY | No relaxation study merely for candidate scarcity |
| VALUATION_RELATIVE_RISK | Context for short / primary candidate for swing; current hard gate over-hardened | valuation domain research exists; C1 gate overlap exists | **REMAINING DIRECT SYSTEM1 GATE-SPECIFIC ECONOMIC GAP** | Build only a same-parent prospective matched-control contract; no threshold sweep |
| SECTOR_GATE | Context over-hardened | PR #501 sector component audit + firstFailure masking + sector research | PROSPECTIVE COMPONENT EVIDENCE READY | Wait independent dates/outcomes |
| AB_SETUP | Core A/B strategy identity | existing A/B formal definitions + setup channel scale audit | PRIMARY STRATEGY / DO NOT RELAX BY SCARCITY | Evaluate alternatives only as explicit strategy redesign |
| FUNDAMENTAL_COMPONENT_COUNT | Confidence/evidence count | P1-A minimal-blocking contract | P1-A OWNER | Do not treat count as economic quality |
| FUNDAMENTAL_QUALITY | Supportive for short / primary candidate for swing; over-hardened short | C5 role repair + fundamental research | ECONOMIC OUTCOME EVIDENCE REQUIRED | No duplicate incidence audit; future same-parent outcome study only |
| ATR_QUALITY | Context/risk over-hardened | PR #504 low/high ATR decomposition + firstFailure masking | PROSPECTIVE EVIDENCE READY | Keep LOW/HIGH separate; wait outcomes |
| TARGET_AVAILABLE | Risk-geometry availability; semantic concern | target four-state contract + validated target/RR observer | STRUCTURAL OBSERVER READY / SOURCE-PROVENANCE CAVEAT | Do not interpret null target as bad alpha; wait clean child/source evidence |
| REWARD_RISK | Legitimate primary payoff filter, but role hardened | target/RR observer + C4 saturation carryover | STRUCTURAL/RANKING EVIDENCE READY | Wait prospective outcomes before threshold/comparator change |
| FINAL_SIGNAL_GRADE | Core primary threshold | A/B setup channel scale audit | PROSPECTIVE SCALE ASYMMETRY READY | Wait A-vs-B outcome evidence before threshold normalization |

## Ranking / Top6 coverage

The admission matrix is not enough. Current post-admission ranking now also has dedicated Class-A evidence for:

- exact Formal comparator parity;
- one-at-a-time tie-break ablation;
- one-at-a-time PriorityScore component ablation;
- RR / RS / consensus saturation carryover;
- one-decimal PriorityScore rounding collisions;
- GENERAL 3 / THOUSAND 3 no-cross-fill preservation;
- zero-pick counterfactual rank-input capture;
- immutable ranking tuple/fingerprint provenance.

Canonical checkpoints:
- `research/SYSTEM1_C4_RANKING_REDUNDANCY_CHECKPOINT_20261004.md`
- `research/SYSTEM1_C4_SATURATION_CARRYOVER_CHECKPOINT_20261004.md`
- `research/SYSTEM1_C4_PRIORITY_ROUNDING_COLLISION_CHECKPOINT_20261004.md`
- zero-pick V8.16 checkpoints.

No ranking/comparator/precision change is authorized before prospective economic evidence.

## Admission evidence added in the 2026-10-04 improvement tranche

- Shadow Cohort V8.17 immutable membership substrate;
- A/B setup-quality scale audit;
- market-cap conditional-admission audit;
- firstFailure masking audit;
- sector-gate component audit;
- low/high ATR decomposition;
- +/-9.8 extreme-move formal-reach denominator;
- reason-stratified LIQUIDITY_REJECTED_CONTROL consumer.

All are:
- outcome-blind at capture;
- research-only;
- decisionImpact=false;
- Formal Core unchanged.

## Stop rule for new Class-A instrumentation

Do **not** create another dedicated gate audit merely because a gate exists.

A new Class-A instrument is justified only when at least one is true:

1. a materially different economic mechanism is currently collapsed into one state;
2. the existing full-population denominator is biased or unavailable;
3. current firstFailure attribution hides the estimand;
4. the same factor is reused across gate/score/comparator layers and its marginal decision incidence cannot otherwise be measured;
5. a frozen research contract explicitly identifies a persistence/consumer gap that V8.17 can now satisfy.

Otherwise, wait for prospective evidence.

## Remaining direct structural work

### R1 — known market-cap <10bn economic threshold

Do not mix with missing-market-cap P1-A.

Research question:
among rows with known, PIT-valid market cap below 10bn, what opportunity/risk/execution paths occur versus matched 10bn+ controls after liquidity, price tier, sector, ATR, regime and event controls?

Current status:
`CONTRACT_NOT_YET_DEDICATED / FORMAL_UNCHANGED`.

No threshold sweep around 10bn is permitted.

### R2 — VALUATION_RELATIVE_RISK System1 gate-specific matched control

Current gate:
PE > 2.5x sector median unless revenueQuarterYoY>25 or epsYoY>25.

Valuation-domain research exists, but System 1 still lacks a dedicated same-parent prospective gate-specific matched-control evidence object.

Required future split:
- PE/sector-median inputs known;
- no-positive-PE / not-evaluable state;
- high-growth exception source;
- gate PASS/FAIL;
- exact first-known valuation/financial vintage;
- price-tier/size/sector/trend/RS/regime controls.

No 2.5x or 25% threshold sweep is permitted.

Current status:
`SYSTEM1_GATE_SPECIFIC_MATCHED_CONTROL_NOT_YET_IMPLEMENTED / FORMAL_UNCHANGED`.

### R3 — outcome maturity, not more structure

For the already-instrumented gates, the next bottleneck is genuine prospective evidence:

- first valid V8.17+ trading-session receipts;
- multiple independent dates;
- exact quality state;
- outcome maturity;
- execution/cost controls;
- date-cluster/OOS validation.

This is now more valuable than inventing additional structural audits.

## Promotion firewall

A gate/ranker may become a Formal optimization candidate only after:

1. clean immutable parent and exact same-date denominator;
2. prospective independent-date support;
3. matched/control-compatible outcome evidence;
4. costs/execution/downside included;
5. no material zero-pick degradation;
6. no one-regime/one-industry dependence;
7. purged/OOS/date-cluster robustness;
8. explicit Class-C owner approval.

Until then:

`economicSuperiority=UNKNOWN`

`formalOptimizationCandidate=NONE`

Formal Core: LOCKED

## Exact next continuation

1. Let the first genuine V8.17+ daily artifact exercise all currently wired audits.
2. Verify no side-study is DATA_QUALITY_BLOCKED and all parent/generation linkages reconcile.
3. If weekend/non-market work continues before that evidence arrives, only R1 or R2 is justified as new direct System1 selection research.
4. Prefer R1 first because MARKET_CAP_FLOOR is earlier in the Formal funnel and has a clean known-vs-missing semantic split already frozen.
