# D16 Strategy-Clock Over-gating Validation — 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / AUDIT_DEFECT_CONFIRMED / CORRECTION_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Related correction: S2-CORR-20261007-002
Formal Core impact: NONE
System2 implementation authority: BUILD_LANE only

## Question

Does the current global System2 Decision Clock create a statistical/research bias by blocking SHORT_MOMENTUM on B2/A5 evidence that its frozen Stage-1 policy does not require?

## Verdict

YES — the defect is statistically material.

Canonical state:
GLOBAL_REQUIRED_SET != SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET.

The current global clock may classify an otherwise evaluable SHORT_MOMENTUM opportunity as not-ready because another strategy's source dependencies are unavailable.

This is not merely an operational delay.
It changes the observed research population.

## 1. Statistical failure mode

Let:
- E_s(t) = strategy s has all strategy-required evidence at time t;
- G(t) = global readiness gate;
- A_s(t) = strategy s is admitted for evaluation.

Correct Stage-1 admission requires:
A_s(t) = E_s(t) AND universal_integrity(t).

Current over-gating approximates:
A_SHORT(t) = E_SHORT(t) AND B2(t) AND A5(t) AND universal_integrity(t).

Because B2/A5 are not required by frozen SHORT_MOMENTUM semantics, missing B2/A5 create artificial censoring.

## 2. Why this biases later research

If readiness-censored dates are dropped, later metrics can be biased:

- coverage appears lower for SHORT_MOMENTUM;
- zero-pick rate can be inflated;
- opportunity starvation can be mistaken for strategy selectivity;
- outcome samples become conditional on unrelated source readiness;
- regime/source-health periods can be selectively removed;
- capacity denominator is distorted;
- cross-system overlap can be distorted;
- strategy performance conditional on "available dates" may become selection-biased.

If B2/A5 availability is correlated with market stress, sector events or publication timing, the missingness may be informative rather than random.

## 3. Missingness taxonomy

For each strategy/date separate:

1. STRATEGY_REQUIRED_SOURCE_MISSING
   - legitimate strategy-specific blocker.

2. UNIVERSAL_INTEGRITY_BLOCK
   - legitimate universal blocker:
     PIT/session/source identity/integrity failure.

3. STRATEGY_IRRELEVANT_SOURCE_MISSING
   - must NOT block this strategy;
   - may block another strategy.

4. POLICY_DISABLED
   - valid policy decision after evidence is ready.

5. NATURAL_ZERO_PICK
   - strategy evaluated correctly but generated no eligible candidate.

6. DATA_UNKNOWN
   - required evidence cannot be evaluated.

Over-gating converts type 3 into type 6/blocked, contaminating semantics.

## 4. Denominator rule

Future physical receipts must expose per-strategy denominators:

- expectedStrategyOpportunityN;
- strategyRequiredReadyN;
- universalIntegrityReadyN;
- strategyEvaluableN;
- policyDisabledN;
- naturalZeroPickN;
- dataUnknownN;
- irrelevantSourceMissingButNonBlockingN.

Global requiredReady can remain as a separate cross-strategy artifact.
It must not be substituted for strategyEvaluableN.

## 5. Candidate-clock rule

Each strategy-stage pair needs immutable identity:

- strategyId;
- strategyVersion;
- stageId;
- dependencyContractVersion;
- requiredSourceFamilies;
- universalIntegrityContractVersion;
- candidateReadyAt;
- evaluationReadyAt;
- blockers;
- source-generation identities.

Do not infer one strategy's decision clock from another strategy's later source readiness.

A later B2/A5 arrival cannot backdate SHORT_MOMENTUM candidateReadyAt.

## 6. Physical acceptance for correction

Synthetic tests are necessary but not sufficient.

A genuine trading-date prospective receipt must demonstrate at least one mixed state:

- SHORT_MOMENTUM required inputs READY;
- universal integrity READY;
- B2 and/or A5 unavailable;
- SHORT_MOMENTUM remains evaluable;
- SWING_GROWTH remains blocked/incomplete if its required B2/A5 lane is missing.

Also test:
- missing A1 / universal source failure blocks SHORT_MOMENTUM;
- PIT/session mismatch blocks every strategy;
- no source is imputed to produce a favorable result.

## 7. D16-14 interpretation

This correction directly validates the existing D16-14 conclusion that a global clock and a strategy-stage clock are different estimands.

D16-14 remains L3 because:
- mismatch is physically observed;
- dependency contracts exist;
- but corrected runtime strategy-specific clock and prospective receipt are not yet proven.

No L4 claim.

## 8. D16-09 interpretation

Coverage/zero-pick accounting must be strategy-local before aggregation.

A global "not ready" state cannot be used to infer:
- strategy zero-pick;
- strategy failure;
- strategy conservatism;
- low opportunity prevalence.

Until correction:
SHORT_MOMENTUM coverage statistics derived from global requiredReady are not promotion-grade.

## 9. SDA-022 implication

Cross-system incrementality requires common-support rows.

A System2 strategy-specific over-gate can shrink System2 support for reasons unrelated to its policy.
This may:
- reduce observed overlap;
- create fake diversification;
- distort Brier/incrementality comparisons;
- violate positivity/common-support assumptions.

Therefore SDA-022 opening must use strategy-specific readiness after correction, or explicitly mark affected rows admission-blocked.

## 10. D18 implication

D18 regime-policy evidence requires the strategy to be genuinely evaluable first.

If a strategy is suppressed by unrelated B2/A5:
- no regime-policy conclusion may be drawn from its absence;
- the date is not POLICY_DISABLED;
- the date is an infrastructure admission defect.

This protects D18-08/D18-14 from attributing clock defects to regime policy.

## 11. Governance boundary

Room11 validates semantics only.

Room11 does NOT:
- alter System2 runtime;
- weaken global Decision Clock;
- change strategy thresholds;
- modify ranks/capacity;
- authorize final selection, push, capital or orders.

Implementation remains BUILD_LANE and requires owner approval under the correction ticket.

## 12. Maturity decision

No maturity increase:
- D16 remains unchanged;
- D18 remains unchanged.

Reason:
the new evidence is a confirmed defect and sharper statistical contract, not corrected prospective runtime evidence.

## Exact next continuation

1. If S2-CORR-20261007-002 implementation lands, validate per-strategy readiness receipts and mixed-dependency cases.
2. Before SDA-022 economic opening, require strategy-specific common-support/readiness semantics.
3. Do not use global requiredReady as SHORT_MOMENTUM zero-pick/coverage denominator.
4. Preserve 2026-10-07 over-gated observations as failure evidence; do not erase them after repair.
