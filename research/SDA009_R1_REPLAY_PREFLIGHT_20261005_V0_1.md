# SDA-009 R1 Replay Preflight 2026-10-05 V0.1

Status: R1_PREFLIGHT_COMPLETE / LIVE_CANDIDATE_LEVEL_REPLAY_BLOCKED_BY_MISSING_ATOMIC_INPUTS / FORMAL_CORE_UNCHANGED

Owner room: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`
Observed main: `aaa04683e5bc9677367ccee9069cc09ec86c37f7`

## Purpose

Advance SDA-009 from semantic contract to an honest replay-readiness audit. This artifact must not manufacture a leave-one-out Taiwan result when the repository does not preserve the atomic candidate/sector inputs required to reproduce the production sector state.

## Production paths re-confirmed

Current Worker logic uses one inclusive `sectorStats[f.industry]` object for:
1. hard admission: breadth >= 40, avgChange >= -1, amountVs20DayAverage >= 0.5;
2. ranking: `sector.score` contributes 14% of `priorityScore`;
3. history warmup: `sector.score` contributes up to 35 points through `coarseWarmupScore`.

The separately implemented 20-day peer-return term already excludes the candidate. Therefore self-exclusion is already an accepted local design precedent, but it is not yet applied to the same-day sector gate/score/warmup paths.

## Historical candidate anchors available in repository

`data/v7_formal_scan_backfill.json` preserves the 2026-09-11 Formal selections:
- 2820 華票
- 2201 裕隆
- 1301 台塑
- 6278 台表科
- 6530 創威

These are valid candidate/date anchors only. The file does not preserve the sector-member atomic rows needed to recompute the production sector state.

## Why exact R1 replay cannot yet be claimed

The durable repository evidence does not currently provide, for the same candidate × scanDate × classificationVintage:
- exact effective-dated sector member list;
- per-member same-day changePercent;
- per-member tradeValue;
- per-member 20-day average amount / history-ready state;
- candidate-specific recomputed cross-sector maxAmount after exclusion;
- machine-visible membershipVersion / classificationSchemeId on the historical selection receipt.

Existing official TWSE industry-index receipts cannot substitute for these missing primitives because production uses a custom same-day equal-member/amount composite rather than the exchange industry total-return index.

The historical Formal backfill also cannot substitute because it stores selected outputs, not the complete sector denominator.

Any numeric leave-one-out result reconstructed without these fields would be a synthetic proxy, not a replay of the Formal decision state.

## R1 minimum replay row

Each replay row must persist:
- scanDate;
- decisionTimestamp;
- candidateSymbol;
- candidateName;
- classificationSchemeId;
- membershipVersion;
- effective member set;
- inclusive peerCount;
- leaveOneOut peerCount;
- candidate tradeValue;
- inclusive sector amount;
- leave-one-out sector amount;
- candidate selfAmountShare;
- inclusive breadth;
- leave-one-out breadth;
- inclusive avgChange;
- leave-one-out avgChange;
- inclusive amountVs20DayAverage;
- leave-one-out amountVs20DayAverage;
- inclusive maxSectorAmount;
- leave-one-out candidate-specific maxSectorAmount;
- inclusive sectorScore;
- leave-one-out sectorScore;
- sectorScoreDelta;
- priorityScoreDeltaFromSector;
- inclusive hardGatePass;
- leave-one-out hardGatePass;
- gateFlip;
- inclusive raw rank;
- leave-one-out diagnostic rank;
- inclusive Top6;
- leave-one-out diagnostic Top6;
- supportState;
- replayTrust.

## Fail-closed rules

- missing membershipVersion => replayTrust = BLOCKED;
- ambiguous classification source => replayTrust = BLOCKED;
- zero remaining peers => leave-one-out = UNKNOWN;
- zero history-ready peers => 20-day activity = UNKNOWN;
- one remaining peer => SMALL_N_SENSITIVE;
- missing candidate-specific maxAmount recomputation => score comparison invalid;
- exchange industry-index values may be used only as an external cross-check, never as a replacement for production primitives.

## R1 cohort strategy

Prioritize cases with the highest probability of material self-influence:
1. low peer count;
2. high candidate share of sector trade value;
3. candidate daily return near/extreme relative to peers;
4. inclusive sector state near the 40 / -1 / 0.5 hard thresholds;
5. candidate near rank or Top6 boundary;
6. candidate whose sector score materially affects history warmup priority.

The 2026-09-11 five-name Formal backfill is a useful anchor set once exact same-date C1/sector primitives are available. Until then it is not a valid completed replay cohort.

## Engineering dependency

System 1 diagnostic output is now the shortest trustworthy path to R1 completion. It must emit the frozen SDA-009 contract fields on common-support candidates without changing Formal selection.

The diagnostic should preserve both inclusive production-equivalent state and candidate-specific leave-one-out state in the same immutable receipt.

## D16 dependency

After machine receipts exist, D16 must compare:
- raw rank vs leave-one-out rank;
- raw Top6 vs leave-one-out Top6;
- gate flips;
- priority delta;
- residual/incremental evidence after controlling own-stock momentum and preregistered common controls.

No Alpha claim is allowed from a mere mechanical rank change.

## Research decision

SDA-009 remains open.
R1 replay semantics and data sufficiency requirements are complete.
Actual Taiwan candidate-level leave-one-out replay count remains 0.
No D09 maturity promotion.
No Formal Core mutation.

## Exact next

SDA-009-R2: obtain the first machine-visible candidate-level receipt containing the atomic inclusive and leave-one-out sector state on one genuine Taiwan scan date. Run the first common-support replay table and classify each candidate as NO_MATERIAL_SELF_EFFECT, SCORE_ONLY_SELF_EFFECT, GATE_FLIP, RANK_FLIP, TOP6_FLIP, SMALL_N_SENSITIVE or BLOCKED.

If no machine receipt exists yet, route this preflight plus the frozen semantic contract to System 1 diagnostic implementation; do not fabricate a historical replay from incomplete backfill data.
