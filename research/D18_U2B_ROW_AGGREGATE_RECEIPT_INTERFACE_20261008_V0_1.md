# D18-04 U2B Row + Aggregate Receipt Interface 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / EXECUTABLE_INTERFACE_FROZEN / PHYSICAL_BUILDER_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Module: D18-04
Formal Core impact: NONE

## Purpose

Freeze the machine interface that the first executable U2B builder must emit once:
- exact-session identity is available;
- CORR-007 suspension provenance binding is fixed;
- a real versioned CLEAR_NO_ACTION continuity receipt exists.

This file does not implement the builder.

## 1. Row object

Canonical row:
`D18_U2B_ROW_V0_1`.

Required identity:
- marketDate;
- decisionTimestamp;
- market;
- symbol;
- companyName optional;
- currentSessionDate;
- priorEligibleSessionDate;
- currentSecurityIdentity;
- priorSecurityIdentity;
- identityRelation;
- pairComparabilityState;
- returnDefinitionVersion;
- priceSpaceVersion;
- sessionCalendarVersion;
- membershipReceiptId/hash;
- currentSourceRowHash;
- priorSourceRowHash;
- exactPairHash.

Required continuity:
- continuityReceiptId;
- continuityReceiptHash;
- sourceHistoryHash;
- priceResetFamilySetVersion;
- priceResetCoverageReceiptHash;
- suspensionEvidenceReceiptId/hash;
- suspensionEvidenceIntervalHash;
- pairContinuityState.

Required values:
- currentClose;
- priorClose;
- priceReturn or null;
- disposition;
- blockerCodes;
- observedAt/capturedAt where applicable.

## 2. Row dispositions

Allowed:

- `U2B_READY_CLEAR_NO_ACTION`;
- `U2B_BLOCKED_ACTION_EVENT`;
- `U2B_BLOCKED_CONTINUITY_UNKNOWN`;
- `U2B_BLOCKED_IDENTITY_TRANSITION`;
- `U2B_BLOCKED_IDENTITY_EQUIVALENCE_UNKNOWN`;
- `U2B_BLOCKED_PRIOR_SESSION_MISSING`;
- `U2B_BLOCKED_SESSION_SUBSTITUTION`;
- `U2B_BLOCKED_SOURCE_REVISION_INVALID`;
- `U2B_BLOCKED_PRICE_RESET_FAMILY_SCOPE`;
- `U2B_BLOCKED_LATE_EVIDENCE`;
- `U2B_BLOCKED_OTHER`.

Only:
`U2B_READY_CLEAR_NO_ACTION`
may have non-null V0.1 `priceReturn`.

All blocked rows preserve denominator membership and blocker provenance.

## 3. Return formula

For READY row only:

`priceReturn = currentClose / priorClose - 1`.

Requirements:
- both closes finite and >0;
- exact current/prior eligible sessions;
- same comparable security identity;
- pair continuity CLEAR_NO_ACTION;
- price-reset family coverage version explicit;
- no post-cutoff evidence.

No winsorization, clipping or z-score at row-construction time.

## 4. Pair hash

`exactPairHash` must depend on:
- market/symbol/security identities;
- current/prior dates;
- current/prior source-row hashes;
- membership/session identity;
- continuity receipt hash;
- priceResetFamilySetVersion;
- priceResetCoverageReceiptHash;
- suspension evidence hash;
- returnDefinitionVersion;
- priceSpaceVersion.

Changing any of these changes the pair hash.

## 5. Aggregate date receipt

Canonical aggregate:
`D18_U2B_DATE_AGGREGATE_V0_1`.

Required identity:
- marketDate;
- decisionTimestamp;
- aggregateVersion;
- rowSchemaVersion;
- priceResetFamilySetVersion;
- universeVersion;
- sessionCalendarVersion;
- orderedRowHash;
- aggregateReceiptHash.

Required denominators:
- U0_N;
- U1_DIRECTION_COMPARABLE_N;
- U2A_RAW_RETURN_KNOWN_N;
- U2B_READY_N;
- ACTION_EVENT_BLOCKED_N;
- CONTINUITY_UNKNOWN_N;
- IDENTITY_TRANSITION_BLOCKED_N;
- IDENTITY_EQUIVALENCE_UNKNOWN_N;
- PRIOR_SESSION_MISSING_N;
- SESSION_SUBSTITUTION_BLOCKED_N;
- SOURCE_REVISION_INVALID_N;
- PRICE_RESET_FAMILY_SCOPE_BLOCKED_N;
- LATE_EVIDENCE_BLOCKED_N;
- OTHER_BLOCKED_N.

Invariant:
the U2B ready + blocker partitions must reconcile to the frozen target population used for U2B accounting.

## 6. Aggregate descriptors

Allowed only if U2B_READY_N > 0:
- medianReturn;
- equalWeightMeanReturn;
- positiveN/share;
- negativeN/share;
- zeroN/share;
- Q10/Q25/Q75/Q90 when support permits;
- robustDispersion;
- min/max descriptive only.

If support is too small:
descriptor remains null with explicit reason.

No market Regime label or strategy rule is emitted by this builder.

## 7. TWSE / TPEx handling

First implementation may produce exchange-separated aggregate receipts.

Combined aggregate requires:
- compatible decision clock;
- compatible source availability semantics;
- compatible priceResetFamilySetVersion;
- both exchange source scopes validated;
- explicit pooledUniverseVersion.

Do not force pooling merely to increase N.

## 8. Coverage interpretation

Every aggregate must report:
- U2BReadyShareOfU0;
- blocker composition;
- exchange composition;
- listing-age composition if available.

If U2B coverage changes sharply by date/volatility:
that is missingness evidence, not a market return signal by itself.

## 9. Determinism

Same immutable row inputs sorted by:
`market | symbol | currentSessionDate | priorEligibleSessionDate`
must reproduce:
- same row receipts;
- same orderedRowHash;
- same aggregate descriptors;
- same aggregateReceiptHash.

No system clock, insertion order, random seed or hash-map order may alter the result.

## 10. No duplicate authority

Builder consumes:
- exact-session authority;
- shared continuity authority;
- identity/pair-comparability rules;
- frozen priceResetFamilySet.

It does not:
- fetch new corporate-action sources;
- build a second continuity engine;
- infer effective share denominator;
- alter System2 strategy state;
- alter Formal Core.

## 11. Required executable tests

### RB-T01 one clean pair
Deterministic READY return.

### RB-T02 current/prior row hash changes
Pair hash changes.

### RB-T03 continuity receipt hash changes
Pair hash changes.

### RB-T04 priceResetFamilySetVersion changes
Pair hash changes.

### RB-T05 blocked row with null return
Preserved in denominator.

### RB-T06 blocker partitions reconcile
Aggregate invariant passes.

### RB-T07 missing row silently dropped
Fail.

### RB-T08 duplicate symbol/date pair
Fail or deterministic dedup only with exact identical identity; non-identical duplicate fails.

### RB-T09 row order changes
Aggregate hash unchanged after canonical sorting.

### RB-T10 insufficient support
Descriptors null with reason, not fabricated zero.

### RB-T11 exchange-separated receipts
Allowed.

### RB-T12 pooled exchange semantics mismatch
Combined aggregate blocked.

### RB-T13 identity-transition row
Blocked and counted.

### RB-T14 late evidence row
Blocked and counted.

### RB-T15 session substitution row
Blocked and counted.

### RB-T16 same immutable inputs replay
Bitwise-stable JSON canonical hash.

## 12. Maturity implication

This freezes an implementation-ready machine interface.

It does not create executable Taiwan replay.

D18-04 remains L2/40 until:
- builder exists;
- tests pass;
- at least one real Taiwan READY pair exists;
- aggregate denominator accounting is physically demonstrated.

## Exact next

1. Wait for CORR-007 and real continuity evidence.
2. Engineering implements this research-only builder without new source authority.
3. Run RB-T01~T16 plus existing U2B and identity-transition oracles.
4. Produce first physical TWSE date receipt.
5. Then assess D18-04 for L3.
