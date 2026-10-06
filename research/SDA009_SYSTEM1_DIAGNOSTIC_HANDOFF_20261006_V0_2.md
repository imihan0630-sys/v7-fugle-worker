# SDA-009 System 1 Diagnostic Handoff V0.2 — 2026-10-06

Status: READY_FOR_SYSTEM1_CLASS_A_DIAGNOSTIC_IMPLEMENTATION
Supersedes: `research/SDA009_SYSTEM1_DIAGNOSTIC_HANDOFF_20261006.md`
Source owner: 07｜產業與供應鏈研究室
Engineering owner: System 1
Audit ticket: `SDA-009`
Formal Core impact authorized: NONE

## Why V0.2

Deep latest-main readback corrected and extended the earlier handoff:
1. sector-score warmup priority is not active in the current after-market path and must not be represented as current impact;
2. capital allocation is an active circularity path because selected capital weights depend on priorityScore;
3. initial selection is 3+3 pool-specific rather than a generic global Top6;
4. sector-score rank impact is comparator-conditional because rewardPerRisk precedes priorityScore;
5. self-inclusion can promote or suppress a candidate;
6. max-sector-amount normalization needs local-effect versus denominator-externality attribution.

Authoritative research:
`research/SDA009_D09_DEEP_FALSIFICATION_V0_2.md`.

## Current active paths to instrument

### A. Hard-gate path
Candidate-specific inclusive and leave-one-out:
- breadth;
- avgChange;
- amountVs20DayAverage;
- hardGatePass;
- per-component pass/fail/UNKNOWN;
- gate flip direction.

### B. Ordering path
Retain both states for:
- rewardPerRisk;
- priorityScore;
- setupQuality;
- sectorFlow;
- relativeStrength;
- pool rank.

Record the exact comparator that changes ordering.

Do not attribute a rank change to sector score when an earlier comparator already determines the order.

### C. Capital-allocation path
After applying the same diagnostic selection universe:
- raw allocation ratio;
- leave-one-out diagnostic allocation ratio;
- raw total allocation NTD;
- leave-one-out diagnostic total allocation NTD;
- allocation delta NTD;
- peer allocation deltas;
- remaining-cash delta;
- 35% cap-binding state;
- NT$1,000 flooring state.

### D. Dormant warmup helper
`chooseHistoryWarmupTargets` / `coarseWarmupScore` currently have no active caller in the latest-main after-market path.

Do not spend engineering scope implementing warmup circularity diagnostics as a current launch blocker.

Keep a regression guard so reactivation cannot silently bypass SDA-009 semantics.

## Candidate-specific sector states

Required states:

### Inclusive production-equivalent
Current Formal sector construction containing the candidate.

### Leave-one-out local
Remove candidate from own-sector amount, breadth, avgChange and activity primitives while holding the inclusive cross-sector maxAmount fixed.

Purpose:
isolate direct constituent contribution.

### Leave-one-out full counterfactual
Remove candidate and recompute candidate-specific cross-sector maxAmount.

Purpose:
remove residual self-contribution and measure full current-formula counterfactual.

Persist:
- localSelfContribution;
- maxNormalizerExternality;
- fullCounterfactualDelta.

## Direction fields

For each candidate preserve:
- gateDirection = SELF_PROMOTION | SELF_SUPPRESSION | NONE | BLOCKED;
- scoreDirection;
- rankDirection;
- poolSeatDirection;
- allocationDirection;
- overallDirection = SELF_PROMOTION | SELF_SUPPRESSION | MIXED | NONE | BLOCKED.

A positive-only diagnostic is insufficient.

## 3+3 pool fields

Required:
- poolId = GENERAL | THOUSAND;
- rawPoolRank;
- leaveOneOutPoolRank;
- rawPoolTop3;
- leaveOneOutPoolTop3;
- finalUnionSelectedRaw;
- finalUnionSelectedLoo.

Do not infer a valid seat transition from a generic global Top6 rank because seats cannot cross pools.

## Minimum lineage

Required:
- scanDate;
- decisionTimestamp;
- generationId;
- parentReceiptId/source receipt;
- candidateSymbol;
- candidateName;
- classificationSchemeId;
- membershipVersion;
- effectiveFrom/effectiveTo or equivalent decision-time membership proof;
- replayTrust.

Missing/ambiguous classification or membership lineage => BLOCKED.

## UNKNOWN / support rules

- zero peers => LOO UNKNOWN;
- zero history-ready peers => activity UNKNOWN;
- one peer => SMALL_N_SENSITIVE;
- incomplete denominator lineage remains visible;
- rows must not disappear from common support.

## Protected outputs

Diagnostic-only implementation must not change:
- Formal A/B eligibility;
- Formal sector gate;
- Formal ranking;
- Formal 3+3 seats;
- Formal priorityScore;
- Formal allocation;
- capital;
- BUY/ADD/REDUCE/SELL/STOP;
- 15m semantics;
- push/order behavior.

The diagnostic computes counterfactual outputs beside Formal outputs only.

## Deterministic acceptance

At minimum test:
1. positive candidate causes breadth self-promotion across 40%;
2. non-positive candidate causes breadth self-suppression across 40%;
3. avgChange promotion and suppression across -1%;
4. amount-activity promotion and suppression across 0.5;
5. zero peer => UNKNOWN;
6. one peer => SMALL_N_SENSITIVE;
7. missing membership version => BLOCKED;
8. frozen-max LOO differs from recomputed-max LOO when candidate removal changes max sector;
9. rank attribution respects rewardPerRisk precedence;
10. GENERAL and THOUSAND seats remain independent;
11. single-selection allocation stays 35% despite score change;
12. multi-selection score change redistributes allocation;
13. cap-bound candidate can reduce peer allocations without increasing own allocation;
14. NT$1,000 flooring delta is explicit;
15. Formal outputs are unchanged byte-for-byte or by canonical protected-output comparison;
16. dormant warmup helper cannot silently become an active Formal consumer without a failing guard.

## D16 return requirements

First genuine receipt is not promotion evidence.

D16 must evaluate on common support:
- gate-flip incidence by direction;
- sector-size and concentration sensitivity;
- pool-seat changes;
- rank changes with comparator attribution;
- allocation redistribution;
- classification-vintage sensitivity;
- market-state sensitivity only under preregistered PIT-valid state definitions;
- residual incrementality beyond candidate own-stock momentum.

## Exact next

Implement as Class-A research-only diagnostic, produce the first genuine same-generation candidate-level receipt, then return it to Room07 for `SDA-009-R3B` oracle/readback.

No Formal replacement is authorized.
