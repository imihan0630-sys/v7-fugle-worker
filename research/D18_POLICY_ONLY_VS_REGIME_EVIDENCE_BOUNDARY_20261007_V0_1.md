# D18｜System2 Policy-only vs Strategy×Regime Evidence Boundary V0.1

更新：2026-10-07 Asia/Taipei
狀態：RESEARCH_ONLY / EVIDENCE-LANE BOUNDARY FROZEN
主責：11｜統計驗證與策略市場狀態研究室 / D18
Formal Core impact：NONE
成熟度影響：NONE

## 1. Why this split is required

System2 Stage-1 launch policies are now frozen, while the daily diagnostic still reports:
`regime.state = UNKNOWN / VALIDATED_REGIME_SOURCES_NOT_WIRED`.

The System2 go-live directive requires only the source/regime/factor inputs needed by the frozen launch policies. The current SHORT_MOMENTUM launch policy does not require MARKET_REGIME as a launch-required family, and SWING_GROWTH requires PIT-valid INDUSTRY_THESIS + FUNDAMENTAL_QUALITY rather than a generic market-regime label.

Therefore D18 must not become an unnecessary global launch blocker.

But D18 must also not count policy-only observations as strategy×regime evidence.

## 2. Evidence lane A — POLICY_ONLY_PROSPECTIVE_OBSERVATION

A genuine physical strategy evaluation may be retained in this lane when all are true:
- exact strategyVersion + assessorPolicyId + assessorPolicyVersion are bound;
- decision timestamp is immutable;
- required strategy families obey PIT/UNKNOWN semantics;
- denominator provenance is explicit;
- System1 runtime/Top6/rank dependency is false;
- strategy evaluation physically executed;
- outcome is not yet used to mutate policy.

This lane may support:
- System2 launch engineering evidence;
- future SDA-022 policy lineage / overlap accounting;
- strategy-policy coverage diagnostics.

It does NOT count as D18 strategy×regime evidence if regime is UNKNOWN.

## 3. Evidence lane B — D18_STRATEGY_REGIME_PROSPECTIVE_OBSERVATION

To enter D18:
- every lane-A condition must pass;
- regime state must be KNOWN at the relevant decision clock, or replay-eligible under the strict rule below;
- regime policy/version/source lineage must be explicit;
- regime fit/knowledge cutoff must obey D18 fit-clock rules;
- structural/replication episode identity must remain prospective;
- no future persistence facts may define the primary state.

If regime is UNKNOWN:
`D18_STRATEGY_REGIME_INELIGIBLE_REGIME_UNKNOWN`.

The policy-only observation is preserved; it is not discarded.

## 4. No casual retroactive Regime upgrade

A policy-only row cannot later be relabeled as D18 evidence merely because a regime label becomes available after the decision.

A later deterministic replay is eligible only if all are proven:
- exact immutable decision-time raw inputs existed;
- every required source had `availableAt <= decisionTimestamp`;
- regime rule/version was already frozen before the decision;
- no future session/input/episode fact enters the replay;
- fit knowledge cutoff <= decision timestamp for learned components;
- replay digest and source-clock lineage are immutable.

Otherwise:
`RETROSPECTIVE_REGIME_LABEL_NOT_PROMOTION_ELIGIBLE`.

## 5. Partial denominator remains separate

CORR-004 is independently VERIFIED_CLOSED.

Therefore policy-only evaluations may legitimately proceed for clean symbols while other symbols remain INCOMPLETE/BLOCKED.

Required:
- selection denominator COMPLETE/PARTIAL/UNKNOWN remains explicit;
- blocked symbols stay denominator-accounted;
- partial coverage may not become clean zero-pick;
- D18 state-conditioned rates must report the same denominator provenance.

A policy evaluation on partial coverage is not rejected solely for being partial, but any D18 claim must carry that partial-support identity.

## 6. Launch implication

This boundary intentionally does NOT require D18 Regime wiring before System2 can:
- execute authorized Stage-1 Shadow policy evaluation;
- build policy lineage;
- collect SDA-022 policy fingerprints/independence evidence;
- exercise denominator-safe capacity plumbing.

It DOES require Regime wiring before claiming:
- works in TREND/RANGE/HIGH_VOL/etc.;
- Regime-conditioned hit rate;
- strategy activation/deactivation by Regime;
- D18 episode replication;
- D18 policy×Regime incrementality.

## 7. Exact next

1. First physical Stage-1 strategy evaluation should be classified lane A.
2. If regime remains UNKNOWN, preserve it as policy-only and do not delay System2 launch solely for D18.
3. Once a decision-time Regime receipt exists, classify qualifying rows into lane B.
4. No backfill before the 2026-10-07 Stage-1 policy freeze.
5. D18 maturity remains 52% until genuine prospective strategy×Regime evidence exists.
