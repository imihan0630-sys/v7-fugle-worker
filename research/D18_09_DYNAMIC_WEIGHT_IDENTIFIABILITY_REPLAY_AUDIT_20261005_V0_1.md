# D18-09 Dynamic Weight Identifiability and Replay Audit — 2026-10-05 V0.1

Status: RESEARCH-ONLY / FORMAL_CORE_LOCKED / L2_EVIDENCE_DEEPENED
Owner: 11｜統計驗證與策略市場狀態研究室
Scope: D18-09 only; cross-checks D16 validation gates.
Formal impact: NONE.

## Question
Can a regime-conditioned dynamic-weight policy be made identifiable and replayable without confusing regime allocation skill with lower exposure, turnover differences, missing-strategy renormalization, or post-outcome tuning?

## Current-main evidence reused
- D18-01 immutable observable regime vector provides marketDate, decisionTimestamp, receiptHash, explicit KNOWN / CONTEXT_RAW / UNKNOWN dimensions, and no policy/weight impact.
- D18-08 activation frame already binds shadow accounting, run fingerprint, regime vector, preregistration and one identical cost contract while separating NATURAL_ZERO_PICK, POLICY_DISABLED and DATA_UNKNOWN.
- D18-10 common-support panel proves missing strategy-date observations must remain MISSING rather than zero and stock rows are not independent strategy dates.
- D18-14 chronological walk-forward infrastructure is the downstream validation boundary; D18-09 must not create a second fold clock.
- The existing D18 parallel-arm receipt already requires STATIC_BASELINE, REGIME_POLICY_CHALLENGER and optional EXPOSURE_MATCHED_CONTROL.

## Main finding: dynamic weights need a stricter identity than binary activation
Binary activation answers whether one frozen strategy is enabled. Dynamic weighting changes relative allocation, total exposure, turnover and opportunity cost simultaneously. Therefore D18-08 L3 evidence cannot be inherited by D18-09.

A valid D18-09 receipt must separate four estimands:
1. allocation effect at matched aggregate exposure;
2. mechanical aggregate-exposure effect;
3. incremental turnover/cost effect;
4. missed-opportunity effect during de-risked states.

A challenger that only beats the static baseline because it invests less has not demonstrated regime allocation skill.

## First-generation admissible policy
The first executable challenger must be deliberately small:
- one PIT-safe regime dimension;
- a frozen strategy set;
- a tiny preregistered set of discrete weight maps;
- next-tradable-session effect when the regime snapshot is after close;
- no continuous optimizer;
- no post-outcome renormalization or threshold search.

Every additional regime dimension, threshold, persistence length, weight map, strategy subset, holding horizon, refit frequency or selection-time cost assumption is part of the same multiplicity family.

## Three-arm identification
Required:
A. STATIC_WEIGHT_BASELINE — frozen weights, no regime intervention.
B. REGIME_DISCRETE_WEIGHT_CHALLENGER — only the preregistered discrete mapping may differ.
C. EXPOSURE_MATCHED_REGIME_INDEPENDENT_CONTROL — same aggregate exposure path as B, but construction cannot use the regime signal.

When feasible, add a turnover-matched regime-independent diagnostic. It is secondary and must be preregistered.

Interpretation:
- B > A but B ~= C: likely exposure reduction, not regime allocation skill.
- B > C after identical costs: candidate evidence for incremental regime allocation.
- Gross B > C but net B <= C: turnover/slippage consumes the effect.
- Improvement dominated by one regime episode: unstable; no promotion.

## Fail-closed receipt contract
A decision-time receipt must bind:
- marketDate and decisionTimestamp;
- actionEffectiveSession;
- strategy IDs and versions;
- source/shadow run fingerprint and accounting hash;
- regime vector version and hash;
- preregistered policy/version/parameter hash;
- prior weights;
- static baseline weights;
- challenger weights;
- aggregate exposure for every arm;
- estimated incremental turnover;
- identical cost-contract hash;
- common-support state and explicit unknown reasons;
- createdAt and receipt hash.

No matured outcome may be attached to this decision receipt.

## Missingness / renormalization firewall
If one expected strategy is missing, blocked, version-mismatched, or lacks common support, the policy must fail closed unless the preregistered policy explicitly defined that missingness behavior before the decision clock.

Implicitly renormalizing remaining strategies changes both exposure and relative weights. It is a new policy, not a harmless data-cleaning step.

UNKNOWN must not become zero weight, neutral state, or a synthetic strategy return.

## Replay invariants before any alpha search
A research-only verifier should test:
1. identical frozen inputs => identical weights and receipt hash;
2. post-decision registration => reject;
3. UNKNOWN selected regime dimension => no actionable challenger weights;
4. marketDate/decisionTimestamp mismatch => reject;
5. regime vector hash/version mismatch => reject;
6. strategy set/version mismatch => reject;
7. missing prior-weight identity => reject;
8. cost contract unavailable at decision time => reject;
9. matured outcomes present in decision receipt => reject;
10. incomplete common support => fail closed;
11. missing strategy cannot be silently renormalized;
12. challenger and exposure-matched control expose aggregate exposure decomposition explicitly.

Passing synthetic invariants is engineering evidence only. It does not justify L3. L3 still requires genuine Taiwan PIT receipts and replay.

## Statistical inference boundary
Primary inference unit: independent decision date / portfolio path, with regime episodes reported separately.
Do not inflate sample size using stock rows or strategy sleeves from the same date.

Required later diagnostics:
- independent decision-date count;
- independent regime-episode count;
- transition count;
- UNKNOWN / blocked-date count;
- policy-action count;
- turnover-event count;
- leave-one-regime-episode-out sensitivity;
- identical-cost paired net outcomes;
- exposure-matched paired outcomes;
- prospective-vs-historical replay divergence.

## Falsification
The dynamic-weight hypothesis is weakened or rejected if:
- benefit disappears under exposure matching;
- benefit disappears after identical realistic costs/slippage;
- one regime episode dominates;
- adjacent preregistered discrete maps reverse the conclusion;
- missing/common-support coverage is regime-dependent and complete-case results change materially;
- static/equal weights match or beat the challenger OOS;
- prospective Shadow diverges materially from historical replay;
- apparent value is absorbed by existing trend, volatility, breadth, rotation or stock-level signals.

## Optimization decision
FORMAL_OPTIMIZATION_CANDIDATE: NONE.

Reason: this round improves identification and replay design but provides no genuine Taiwan PIT dynamic-weight replay, untouched OOS policy value, or prospective Shadow outcome evidence.

## Exact next continuation point
Build or audit a research-only deterministic discrete-weight receipt verifier that reuses D18-01 regime identity, D18-08 registration/cost lineage, D18-10 common-support semantics and D18-14 chronological validation boundaries. Run the 12 fail-closed invariants before any return or optimal-weight search. If genuine Taiwan PIT inputs are unavailable, record DATA_BLOCKED and move to the next executable D16/D18 module without fabricating L3 evidence.
