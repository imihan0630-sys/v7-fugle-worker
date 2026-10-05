# D03 System 1 SDA Consumer Mapping Review V0.1

Updated: 2026-10-05 Asia/Taipei
Room: 03｜技術指標與趨勢動能研究室
Reviewed implementation: `research/system1_sda_shadow_v0_1.mjs`
Merged engineering source: PR #608
Tickets: SDA-001, SDA-004
Classification: Class A research readback
Formal Core impact: NONE / LOCKED
Outcome access: CLOSED

## Purpose

Perform the D03-owned consumer mapping-drift review requested by the merged System 1 SDA Shadow remediation checkpoint.

This review answers whether the System 1 Class A diagnostic consumer preserves the frozen D03 lineage, alias, redundancy, parameter-family and fail-closed semantics.

It does not judge economic superiority and does not close SDA-001 or SDA-004.

## TI-733 — merge/readback authority

PR #608 is merged. The reviewed implementation exists on current main as:
- `research/system1_sda_shadow_v0_1.mjs`;
- `tests/test_system1_sda_shadow_v0_1.mjs`.

The implementation imports the canonical D03 registry directly and pins its digest. Caller-provided D03 lineage cannot silently override the pinned mapping.

Decision:
`SYSTEM1_D03_REGISTRY_PINNING = PASS`.

## TI-734 — alias and retired-module mapping

The consumer correctly resolves retired D03-11 to canonical D03-02, retains the original parameter-family lineage and rejects alias parameter/experiment drift.

Same-horizon return / ROC / Momentum-index / log-return aliases collapse under the same family in deterministic tests.

Decision:
`D03_ALIAS_RETIREMENT_MAPPING = PASS`.

## TI-735 — same-root and parent-child deduplication

The diagnostic builds connected components when active factors share:
- an information root;
- a redundancy group;
- a direct parent/child link.

This is deliberately more conservative than simply grouping by indicator name. D03 price-derived trend, EMA, MACD, pattern and mixed price-volume representations sharing PRICE_OHLC can collapse rather than manufacture independent votes.

The implementation labels this policy:
`BINARY_ACTIVE_CONNECTED_ROOT_FAMILY_V0_1`.

Decision:
`SAME_ROOT_CONNECTED_DEDUP = PASS_CONSERVATIVE`.

Caution:
`dedupedEvidenceFamilyCount` is therefore a connected-root-family diagnostic, not proof that each resulting connected component is an economically independent Alpha source.

## TI-736 — independent-evidence promotion path remains closed

The current implementation hard-codes:
`effectiveIndependentEvidenceCount = 0`
and
`independentEvidenceStatus = NOT_PROVEN_NO_PROMOTION_PATH`.

No lineage status, correlation, local backtest, or deduped family count can silently promote an independent Alpha vote.

This is stricter than the minimum D03 guard and is safe pending D16/00 evidence.

Decision:
`INDEPENDENT_EVIDENCE_PROMOTION_FIREWALL = PASS`.

## TI-737 — fail-closed / PIT / outcome-only guards

Observed protections:
- missing or invalid lineage -> invalid / aggregate incomplete;
- future or malformed firstObservableAt -> PIT clock invalid;
- non-boolean activity -> unknown signal state;
- D03-04 outcome-relation lane -> OUTCOME_NOT_A_VOTE;
- any incomplete Formal-eligible candidate suppresses the aggregate Shadow ranking rather than using favorable complete cases.

Decision:
`FAIL_CLOSED_AND_CLOCK_GUARD = PASS`.

## TI-738 — diagnostic schema gap: canonical D03 field names are not fully emitted

The canonical D03 registry requires the following diagnostic concepts:
- RAW_SIGNAL_COUNT;
- DEDUPED_EVIDENCE_FAMILY_COUNT;
- EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT;
- OVERLAPPING_SIGNAL_IDS;
- REDUNDANCY_GROUP_CONTRIBUTIONS;
- DOMINANT_INFORMATION_ROOTS;
- RAW_SCORE;
- DEDUPED_SHADOW_SCORE;
- RANK_AND_TOP6_SENSITIVITY.

System 1 currently emits most of these semantics, but two contract gaps remain:

1. the per-component payload is exposed generically as `contributions`, not the canonical explicit `redundancyGroupContributions`;
2. no top-level `dominantInformationRoots` field is emitted.

The underlying roots/groups are present inside component contributions, so this is not evidence that grouping is wrong. It is a machine-contract/readback gap.

Decision:
`CANONICAL_DIAGNOSTIC_FIELD_COVERAGE = PARTIAL`.

Required correction:
emit explicit additive research-only aliases/fields without changing ranking, lifecycle or Formal behavior.

## TI-739 — diagnostic identity gap: overlappingSignalIds are indices

The current `overlappingSignalIds` field is populated from `signalIndex` values.

Indices are deterministic inside one receipt but are not durable semantic factor identities across:
- input reordering;
- regenerated receipts;
- cross-system comparisons;
- factor-version migration.

D03 requires stable overlap identity for audit/replay.

Required future diagnostic should preserve at least:
- factorId;
- factorVersion;
- original signalIndex as local trace aid.

Decision:
`OVERLAP_IDENTITY_DURABILITY = PARTIAL`.

This is a traceability gap, not current evidence-count inflation.

## TI-740 — overall review decision

System 1 core D03 mapping result:

`PASS_WITH_DIAGNOSTIC_SCHEMA_GAPS`.

Passed:
- canonical D03 registry digest pin;
- retired alias mapping;
- same-root / redundancy-group / parent-child conservative dedup;
- parameter-family reset prevention;
- fail-closed lineage and PIT clock handling;
- outcome-only lane exclusion;
- no independent-evidence promotion path;
- no Formal decision impact.

Open diagnostic deltas:
1. explicit `redundancyGroupContributions`;
2. explicit `dominantInformationRoots`;
3. stable overlap identities using factorId + factorVersion, while retaining indices only as local trace.

No maturity promotion:
- D03 = 56.7%;
- D03-09 = L2/40;
- D03-10 = L2/40;
- raw receipt gate = 2/3;
- outcomes = CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

SDA-001 / SDA-004 remain REMEDIATION_IN_PROGRESS.

## Exact next continuation point

1. System 1 engineering owner may add the three research-only diagnostic schema deltas above; no scoring or Formal behavior change is authorized.
2. After that delta, D03 readback verifies exact field semantics and receipt stability; do not redo already-passed mapping logic.
3. First genuine-session System 1 receipt remains required; synthetic fixtures do not close SDA-001/SDA-004.
4. System 2 still lacks its corresponding runtime dedup diagnostic implementation.
5. D16 still owns cross-family/sibling common-support residual tests, parameter-family multiplicity, holdout/OOS inference and any future independent-evidence graduation.
6. Room 00 remains the independent closure authority.
