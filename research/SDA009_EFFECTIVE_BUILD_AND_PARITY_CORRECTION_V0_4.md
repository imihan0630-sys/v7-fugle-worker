# SDA-009 Effective Build Authority and Parity Correction V0.4

Status: PRIOR_INTERPRETATION_CORRECTED / EFFECTIVE_BUILD_AUTHORITY_FROZEN / PARITY_TIERS_FROZEN / FORMAL_CORE_UNCHANGED

Owner room: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`
Date: 2026-10-06 Asia/Taipei

## 1. Correction to V0.2 comparator interpretation

The earlier V0.2 deep-falsification note read the repository baseline `Worker.js` directly and described the current rank comparator as:
1. rewardPerRisk;
2. priorityScore;
3. setupQuality;
4. sectorFlow;
5. relativeStrength.

That is not the authoritative deployed-build comparator.

The deployment workflow builds the effective Worker by applying the patch chain to the baseline Worker. It explicitly applies:
`scripts/apply_v7_5_30.py`
before the later V8 patches.

That patch changes the comparator to:
1. priorityScore;
2. rewardPerRisk;
3. marketConsensusScore;
4. setupQuality;
5. sectorFlow;
6. relativeStrength.

Final full ties preserve stable pre-sort order.

The frozen comparator label is:
`PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`.

The latest V8.20 Cloudflare deployment run `37483896567` completed successfully. Its steps include:
- Apply V7.5.30 market consensus radar: SUCCESS;
- Apply V8.15.4 C4 priority-score provenance: SUCCESS;
- Behavioral regression: SUCCESS;
- Deploy Worker code only: SUCCESS;
- Verify deployed version/configuration: SUCCESS.

The deployment workflow includes `tests/test_v8_15_4_c4_priority_provenance.mjs`, whose comparator assertion requires priorityScore before rewardPerRisk.

Therefore for current effective-build research:
`BUILT_RUNTIME > BASELINE_WORKER_FOR_POST_PATCH_SEMANTICS`.

The V0.2 statement that sector-score rank impact generally requires rewardPerRisk ties is superseded.

## 2. Revised SDA-009 ranking risk

Sector score contributes 14% to the base priority score.

Because post-consensus priorityScore is the first comparator key in the effective build, a sector self-contribution can affect rank without an RR tie if it changes the final rounded post-consensus priority score enough to cross another candidate.

Sector score also remains a later direct sectorFlow comparator key.

Therefore the structural paths are:
- first-order potential influence through priorityScore;
- later tie-break influence through sectorFlow.

Actual rank/seat flips still require exact same-generation counterfactual replay.

## 3. Priority-score delta correction

The earlier receipt oracle used:
`0.14 × sectorScoreDelta`
as a fallback priorityScore delta.

That quantity is only the unrounded linear sector contribution inside the base score formula.

It is not necessarily the final production priorityScore delta because:
1. the base score is clamped to [0,100];
2. Formal result priorityScore is rounded to one decimal;
3. market consensus can add a bonus;
4. the post-consensus score is again clamped and rounded to one decimal.

Therefore V0.4 freezes:

`structuralUnroundedSectorContributionDelta = 0.14 × sectorScoreDelta`

but:

`priorityScoreDeltaFromSector = UNKNOWN`

unless the exact frozen runtime score path is replayed or both exact Formal-equivalent counterfactual priority scores are captured.

No rank or allocation inference may use the structural linear delta as if it were the final score delta.

## 4. Parity must be layered

### Gate parity
Current C1 already stores production-inclusive:
- breadth;
- avgChange;
- amountVs20DayAverage.

After adding currentChangePercent and currentTradeValue to every C1 row, research can reconstruct these three primitives from the same-generation full denominator.

If all three match:
`GATE_PARITY_PASS`.

This is sufficient to authorize mechanical gate-flip analysis.

If stored inclusive gate primitives are missing or mismatched:
BLOCK the generation for SDA-009 gate inference.

### Score parity
Current C1 does not store production sector.score.

Research can calculate a sector score from reconstructed primitives, but that is not an independent proof that the exact production score state was reproduced.

Therefore score/rank/allocation interpretation additionally requires a production score reference.

Preferred minimum:
- persist `sectorScore` in the existing C1 sector projection; OR
- persist a generation-level `sectorDecisionStateDigest` over a frozen canonical projection containing all score-relevant production sector states.

Until one of those passes parity:
`SCORE_PARITY_UNVERIFIED`.

Gate results may still be usable.
Score/rank/allocation results are not.

## 5. Recommended sector decision digest

A compact generation-level digest is preferable to duplicating a large sector object on every C1 row.

Canonical per-industry score-relevant projection:
- industry;
- stockCount;
- historicalCoverage;
- amount;
- breadth;
- avgChange;
- amountVs20DayAverage;
- score.

Sort by industry, canonicalize deterministically, then hash.

Because the list includes every sector amount, the cross-sector maxAmount used by the score formula is reconstructable from the same projection.

The digest must bind:
- scanDate;
- generationId;
- sourceMainSha;
- effectiveRuntimeVersion;
- membershipDigest;
- projection version.

## 6. Prototype V0.3 self-falsification

V0.3 research prototype had a semantic bug:
when `storedInclusive` was absent, parity returned NOT_AVAILABLE but LOO computation continued.

That violated the frozen fail-closed rule.

V0.4 fixes this:
- missing inclusive production state => BLOCKED;
- gate parity mismatch => BLOCKED;
- missing production sector score => gate analysis may continue but scoreEffectAuthorized=false;
- rank/seat/allocation remain unauthorized by the atomic replay prototype.

## 7. V0.4 deterministic prototype

Artifacts:
- `research/sda009_c1_atomic_replay_prototype_v0_4.mjs`;
- `research/test_sda009_c1_atomic_replay_prototype_v0_4.mjs`.

Local Node.js v22.16.0:
PASS / 29 assertions.

Validated:
- mandatory gate parity;
- score-parity separation;
- self-promotion;
- self-suppression;
- membership digest mismatch blocking;
- missing current-session atom blocking;
- zero-peer UNKNOWN;
- small-N preservation;
- local self contribution;
- max-normalizer externality;
- no inferred final priorityScore delta;
- no rank/seat/allocation authorization.

## 8. Updated System1 minimum

For R3A1, the minimum engineering evidence is now:

Per C1 row:
- currentChangePercent;
- currentTradeValue.

Per generation:
- classificationSchemeId;
- membershipVersion;
- membershipDigest;
- score-parity reference: production sectorScore or sectorDecisionStateDigest.

Required readback:
1. full C1 parent identity;
2. gate inclusive parity PASS;
3. score parity PASS before score/rank/allocation inference;
4. exact effective comparator version from the built runtime, not the baseline Worker source;
5. protected Formal output parity.

No new provider call is required.

## 9. Maturity decision

D09 remains 57.1%.

This is a material correction and improves research validity, but:
- System1 SDA-009 implementation is still pending;
- genuine Taiwan LOO receipt count is still zero;
- D16 economic evidence is absent.

## Exact next

`SDA-009-R3A1`:
System1 implements/captures the two C1 atoms, exact membership identity and score-parity reference, then proves gate and score inclusive parity against the effective built runtime.

`SDA-009-R3A2`:
only after parity PASS, run the pure C1-side candidate LOO analyzer.

`SDA-009-R3B`:
Room07 evaluates the first genuine receipt with P0-P5 denominators and corrected comparator authority.

D16 follows with common-support incremental/economic validation.
