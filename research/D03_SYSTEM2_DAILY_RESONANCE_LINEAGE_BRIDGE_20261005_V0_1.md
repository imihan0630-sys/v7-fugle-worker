# D03 System 2 Daily Resonance Lineage Bridge V0.1

Updated: 2026-10-05 Asia/Taipei
Room: 03｜技術指標與趨勢動能研究室
Classification: Class A research / Shadow diagnostic
Tickets: SDA-001, SDA-004
Formal Core impact: NONE / LOCKED
Outcome access: CLOSED

## Purpose

Freeze the lineage bridge between D03 anti-double-count rules and System 2's existing daily 3-condition resonance monitor.

This bridge does not change the System 2 state machine. It separates two concepts that must never be conflated:

1. condition count used to describe a resonance lifecycle state; and
2. effective independent evidence count used to claim independent stock-selection support.

A 3-of-3 state may remain a valid state-machine label while still representing only one effective same-root technical evidence family.

## TI-717 — actual System 2 runtime semantics observed

Current research runtime `system2/runtime/daily_resonance_monitor_v0_1.mjs` freezes three entry conditions:
- close above EMA16 while EMA16 slope is positive;
- EMA16 above EMA64;
- Impulse MACD bullish.

The symmetric three exit conditions use the opposite states.

The runtime computes `entryCount` and `exitCount` from these three booleans and uses 1/3, 2/3 and 3/3 for lifecycle progression.

The same runtime also explicitly states:
- `sameFamilyIndependenceClaim: false`;
- `evidenceFamily: "PRICE_DERIVED_TREND_MOMENTUM_STATE"`;
- the three conditions are correlated price-derived states, not three independent votes;
- `decisionImpact: false`, `notificationImpact: false`, `orderImpact: false`.

Therefore the current 3-of-3 implementation is not itself proof of a live double-counting bug. It is a research state machine with an explicit same-family disclaimer.

## TI-718 — D03 lineage mapping for the three resonance conditions

### Condition A — price above EMA16 and EMA16 rising
D03 owner: D03-01
Information root: `PRICE_OHLC`
Representation family: weighted/filtered price trend geometry
Redundancy group: `RG_D03_PRICE_TREND`
Independence default: `SAME_ROOT_REDUNDANT`

### Condition B — EMA16 above EMA64
D03 owner: D03-01
Information root: `PRICE_OHLC`
Representation family: weighted/filtered price trend geometry
Redundancy group: `RG_D03_PRICE_TREND`
Independence default: `SAME_ROOT_REDUNDANT`

### Condition C — Impulse MACD bullish
Observed System 2 formula:
- HLC3 source;
- SMMA34 high/low envelope;
- ZLEMA34 center;
- SMA9 signal;
- bullish when the Impulse MACD line exceeds its signal.

This is not the canonical D03-08 MACD12/26/9 formula. It is nevertheless a same-root filtered trend/transition transform of `PRICE_OHLC`.

D03 lineage assignment:
- D03 owner family: D03-08 comparator/challenger lineage;
- representation family: `FILTERED_PRICE_TREND_TRANSITION`;
- redundancy group: `RG_D03_PRICE_TREND`;
- independence default: `SAME_ROOT_REDUNDANT`;
- it does not receive an independent vote merely because the formula differs from canonical MACD.

## TI-719 — Impulse MACD parameter-family loophole closed

The D03 parameter-family guard applies to formula changes, not only window changes.

System 2 Impulse MACD must therefore carry a dedicated factor version while remaining inside the D03 trend-family experiment budget.

Frozen identifier:
`PF_D03_SYSTEM2_IMPULSE_MACD_34_9_HLC3_V0_1`.

This parameter family cannot be reset by:
- renaming the indicator;
- changing chart presentation;
- expressing the same state as a crossover, histogram sign or bullish/bearish label;
- testing EMA16/EMA64 and Impulse MACD as if they were separate independent families.

Any future change to source field, smoothing method, length, signal length, seed or warm-up creates a new factor version inside the same broader experimental family and must remain visible to D16 multiplicity accounting.

## TI-720 — 3-of-3 lifecycle count is not evidence count

Frozen semantics:

`entryCount` / `exitCount` = lifecycle condition count.

They are not:
- raw independent Alpha vote count;
- deduplicated evidence-family count;
- effective independent evidence count.

For the current three-condition daily resonance state, before any residual-independence proof:

- raw condition count: 0 to 3;
- deduplicated D03 redundancy-group count: at most 1;
- effective independent evidence count from this technical cluster: at most 1;
- dominant information root: `PRICE_OHLC`.

Thus a 3-of-3 resonance may legitimately mean "all three same-family conditions are aligned" but must not be described as three independent confirmations.

## TI-721 — System 2 semantic-basis mismatch

The older System 2 semantic-basis contract maps technical indicators into basis dimensions B1-B8. That decomposition is useful for explaining what a transform contains, but basis separation cannot override the newer D03 redundancy-group guard.

Key example:
- KD is mapped to B2;
- RSI is mapped to B3;
- D03 still places both inside `RG_D03_OSCILLATOR` until bilateral sibling residual evidence proves a justified split.

Therefore:
`semanticBasisIds` describe content dimensions;
`redundancyGroupId` governs effective-evidence deduplication.

A future scorer must not infer independence merely because two items occupy different semantic bases.

## TI-722 — missing runtime diagnostics

Current System 2 factor/runtime contracts do not yet expose the D03-required lineage diagnostics in the daily resonance snapshot:
- `rawSignalCount`;
- `dedupedEvidenceFamilyCount`;
- `effectiveIndependentEvidenceCount`;
- `overlappingSignalIds`;
- `redundancyGroupContributions`;
- `dominantInformationRoots`.

This is a diagnostic gap, not proof of incorrect live ranking.

Until the shared lineage guard is implemented, the safe status is:
`SEMANTIC_GUARD_PRESENT_RUNTIME_DEDUP_DIAGNOSTICS_MISSING`.

## TI-723 — acceptance rules for the future consumer bridge

A compliant research/shadow consumer must satisfy all of the following:

1. keep the existing 1/3, 2/3, 3/3 lifecycle state if desired;
2. expose the three raw conditions separately;
3. map all three current resonance conditions to `PRICE_OHLC`;
4. map all three to `RG_D03_PRICE_TREND` unless future D16/00 evidence explicitly reclassifies one;
5. report one deduplicated evidence family for a full 3-of-3 state;
6. keep `sameFamilyIndependenceClaim=false` until closure evidence changes it;
7. prevent `entryCount` or `exitCount` from being reused as an Alpha vote count;
8. preserve research-only / no-Formal-impact semantics;
9. version any changed Impulse MACD parameterization and charge it to the same experiment-family budget;
10. fail closed to UNKNOWN when lineage metadata is missing.

## TI-724 — maturity and routing

No module promotion is justified by this bridge.

Current:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw receipt gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- SDA-001 and SDA-004 remain `REMEDIATION_IN_PROGRESS`.

Exact next:
1. System 2 implementation owner adds research/shadow lineage diagnostics to the daily resonance consumer without changing the 3-of-3 lifecycle definition or Formal behavior.
2. D03 reviews the resulting machine receipt for exact mapping: three raw conditions -> one D03 price-trend redundancy group.
3. System 1 still requires equivalent raw-vs-deduplicated diagnostics for any D03-derived selection evidence.
4. D16 retains ownership of sibling residual tests, parameter-family multiplicity and OOS/prospective validation.
5. Protected PR #600 Production path remains owner-gated and independent from this bridge.
