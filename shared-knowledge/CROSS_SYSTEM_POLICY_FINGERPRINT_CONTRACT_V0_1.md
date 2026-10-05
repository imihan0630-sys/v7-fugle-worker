# Cross-System Policy Fingerprint Contract V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CANONICAL_SDA022_OBSERVABILITY_CONTRACT
Owner: 00｜研究總控／稽核
Scope: System 1 + System 2
Formal Core impact: NONE

## Purpose

Create immutable, comparable decision-policy receipts so System 1 and System 2 cannot silently converge while still appearing independent.

This contract measures policy lineage. It does not require the systems to disagree and does not authorize any ranking/selection change.

## Required fingerprint fields

Each system/strategy fingerprint must preserve:

- fingerprintVersion;
- systemId;
- policyId / policyVersion;
- strategyId / strategyVersion when applicable;
- effectiveAt / decisionClockRole;
- sourceArtifactPaths + immutable sourceArtifactDigests;
- candidateUniverseMode;
- candidateUniverseSourceRefs;
- requiresOtherSystemCandidateOutput;
- requiresOtherSystemRankOutput;
- hardGateIds or gate-family identities;
- requiredEvidenceFamilies;
- supportiveEvidenceFamilies;
- contextEvidenceFamilies;
- informationRoots;
- rankingPolicyId / rankingPolicyVersion;
- rankingMechanism;
- capacityPolicy;
- entryConfirmationPolicy;
- lifecyclePolicy;
- primaryHorizon;
- UNKNOWN/fail-closed semantics;
- Formal/research authority state.

## Candidate-universe dependency states

Allowed values:

- INDEPENDENT_FULL_MARKET
- INDEPENDENT_AUTHORIZED_UNIVERSE
- OPTIONAL_OTHER_SYSTEM_CONTEXT
- REQUIRED_OTHER_SYSTEM_CANDIDATES
- REQUIRED_OTHER_SYSTEM_RANK
- NOT_PHYSICALLY_PROVEN

Architecture text alone cannot upgrade NOT_PHYSICALLY_PROVEN to independent physical proof.

## Ranking mechanism identities

Examples:
- SYSTEM1_FORMAL_COMPARATOR
- STRATEGY_LOCAL_PARETO
- NO_LOCAL_RANK_FROZEN
- GLOBAL_PRIORITY_UNRESOLVED
- OTHER_VERSIONED_POLICY

Different labels are insufficient: the actual gate/evidence/ranking lineage must be present.

## Cross-system comparison receipt

For a comparable decision date, preserve:

- system1FingerprintHash;
- system2StrategyFingerprintHash;
- candidateUniverseOverlap;
- selectedSetOverlap / selectedSetJaccard;
- commonSupportRankCorrelation when meaningful;
- sharedInformationRoots;
- sharedInformationRootRatio;
- sharedHardGateFamilies;
- requiresUpstreamSystemOutput;
- system1OnlySymbols;
- system2OnlySymbols;
- overlapSymbols;
- divergenceReasons;
- comparableSupportDefinition;
- missing/UNKNOWN denominators.

No arbitrary overlap threshold is frozen in V0.1.

## Fail-closed rules

1. Missing fingerprint => cross-system independence UNKNOWN.
2. Same symbol in both systems => not two independent confirmations by default.
3. Different symbol sets => not proof of diversification.
4. Shared raw evidence is allowed; duplicated vote claims are not.
5. System2 architecture documents saying "independent" do not by themselves prove physical independent discovery.
6. If System2 requires System1 Top6/rank at runtime, independence status becomes REQUIRED_OTHER_SYSTEM_* until architecture is explicitly changed and revalidated.
7. A future cross-system combined policy must receive its own policyId/version and D16 preregistration.

## System-level mutation trigger

Any change that:
- imports System1 A/B, Top6/3+3, Formal comparator or 15m gate into System2;
- imports System2 strategy-local rank, Regime/confluence/capacity/lifecycle into System1 Formal;
- changes whether one system consumes the other system's candidate/rank output;
- replaces strategy-local policies with a common universal score;

must generate a new fingerprint and surface SDA-022 architecture review.

## Closure evidence

SDA-022 cannot close from this contract alone.

Required:
- System1 runtime/research fingerprint receipt;
- System2 per-strategy fingerprint receipts;
- physical NC-T01 proof: at least one System2 discovery path executes without System1 Top6/rank input;
- prospective overlap/divergence receipts;
- D16 dependence/incrementality analysis;
- 00 independent readback.
