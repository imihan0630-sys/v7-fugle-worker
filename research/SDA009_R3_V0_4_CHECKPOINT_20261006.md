# SDA-009 R3 V0.4 Checkpoint — 2026-10-06

Status: EFFECTIVE_BUILD_AUTHORITY_CORRECTED / GATE_SCORE_PARITY_SPLIT / ATOMIC_REPLAY_PASS_29 / RECEIPT_ORACLE_PASS_30 / GENUINE_RECEIPT_PENDING / FORMAL_CORE_UNCHANGED

Owner room: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`

## Effective runtime authority correction

Repository baseline `Worker.js` is not the post-patch deployed Worker.

The V8 deployment workflow starts from the baseline and applies the complete ordered patch chain. In particular:
- `scripts/apply_v7_5_30.py` changes the comparator from rewardPerRisk-first to priorityScore-first;
- later V8 patches build on that state;
- the deployment regression includes `tests/test_v8_15_4_c4_priority_provenance.mjs`.

Latest verified V8.20 deployment evidence inspected:
- workflow: V8 Cloudflare Deploy;
- run: `37483896567`;
- head: `1bd9e05d730f2f7c5909a52502837eabd2bb111f`;
- conclusion: SUCCESS;
- Apply V7.5.30: SUCCESS;
- V8.15.4 priority provenance patch: SUCCESS;
- Behavioral regression: SUCCESS;
- code deploy: SUCCESS;
- deployed-version/config readback: SUCCESS.

Therefore current effective comparator authority is:
`PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`

ordered:
1. post-consensus priorityScore;
2. rewardPerRisk;
3. marketConsensusScore;
4. setupQuality;
5. sectorFlow;
6. relativeStrength;
7. stable pre-sort order only after all explicit comparator keys tie.

Any prior Room07 wording that treated rewardPerRisk as the first effective comparator is superseded.

## SDA-009 implication

Sector score contributes 14% to base priorityScore, and post-consensus priorityScore is the first effective ranking key.

Therefore sector self-contribution can affect rank without requiring an RR tie.

However actual rank impact still requires exact final priorityScore semantics and same-generation cross-candidate comparison.

## Priority delta correction

Do not use:
`0.14 × sectorScoreDelta`
as the final Formal priorityScore delta.

It is only:
`structuralUnroundedSectorContributionDelta`.

Formal priorityScore additionally includes:
- score clamp;
- one-decimal rounding;
- market-consensus bonus;
- second clamp/round after consensus.

Exact final priority delta requires exact runtime-equivalent replay or explicit raw/LOO final priority scores.

## Parity split

### Gate parity
Existing C1 production-inclusive values:
- breadth;
- avgChange;
- amountVs20DayAverage.

After the two-atom row extension:
- currentChangePercent;
- currentTradeValue;

these three gate primitives can be independently reconstructed.

Gate LOO interpretation requires:
`gateParityState=PASS`.

### Score parity
Existing C1 does not persist production sector.score.

Therefore a research-recomputed score is not enough to authorize score/rank/allocation inference.

Require one of:
- production sectorScore capture; or
- generation-level sectorDecisionStateDigest over a frozen score-relevant projection.

Until then:
`SCORE_EFFECT_UNVERIFIED`.

## Recommended sectorDecisionStateDigest

Canonical sorted per-industry projection:
- industry;
- stockCount;
- historicalCoverage;
- amount;
- breadth;
- avgChange;
- amountVs20DayAverage;
- score.

Bind digest to:
- scanDate;
- generationId;
- sourceMainSha;
- effectiveRuntimeVersion;
- membershipDigest;
- projectionVersion.

This keeps the receipt compact while proving the full score-relevant inclusive sector state.

## V0.4 atomic replay prototype

Files:
- `research/sda009_c1_atomic_replay_prototype_v0_4.mjs`;
- `research/test_sda009_c1_atomic_replay_prototype_v0_4.mjs`.

Local isolated Node.js v22.16.0:
PASS / 29 assertions.

Corrections over V0.3:
- stored inclusive gate state is mandatory;
- missing parity blocks;
- score parity is separated from gate parity;
- final priority delta is not inferred linearly;
- rank/seat/allocation remain unauthorized by the atomic replay layer.

## V0.4 receipt oracle

Files:
- `research/sda009_r3_receipt_oracle_v0_4.mjs`;
- `research/test_sda009_r3_receipt_oracle_v0_4.mjs`.

Local isolated Node.js v22.16.0:
PASS / 30 assertions.

The oracle now requires layered authority:
- gate flip => gate parity PASS;
- score effect => score parity PASS;
- rank flip => rankIdentifiability PASS + exact effective comparator version + comparator attribution;
- pool-seat flip => rankIdentifiability PASS + exact comparator;
- allocation effect => allocationIdentifiability PASS.

A mechanically calculable lower layer cannot auto-promote a higher layer.

## Current System1 implementation state

Latest-main search still finds no production/research runtime implementation of:
- candidateSelfContribution;
- currentChangePercent C1 row extension;
- currentTradeValue C1 row extension;
- membershipDigest for SDA-009;
- SDA-009 parity receipt.

Matches remain research/governance artifacts only.

Genuine Taiwan SDA-009 candidate-level receipt count: 0.

## Maturity

D09 remains 57.1%.

No promotion because:
- this round corrects research authority and strengthens deterministic acceptance;
- System1 runtime diagnostic is still pending;
- no genuine common-support Taiwan receipt exists;
- no D16 economic/incremental evidence exists.

## Exact next

`SDA-009-R3A1`:
System1 implements the minimum C1 research projection delta:
- currentChangePercent;
- currentTradeValue;
- classificationSchemeId;
- membershipVersion;
- membershipDigest;
- production sectorScore or sectorDecisionStateDigest.

Then prove inclusive gate parity and score parity against the effective built runtime.

`SDA-009-R3A2`:
after parity PASS, run the pure C1-side LOO analyzer and emit the first genuine candidate-level receipt.

`SDA-009-R3B`:
Room07 consumes that receipt with `sda009_r3_receipt_oracle_v0_4.mjs`, reporting P0-P5 denominators, direction, gate/score/rank/seat/allocation authority and BLOCKED/UNKNOWN rows.

D16 then performs common-support economic validation.
