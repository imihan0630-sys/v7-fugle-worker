# D18-01 Observable Regime Vector L3 Acceptance — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 2 policy impact: NONE

## Scope

This packet evaluates D18-01 Market Regime Taxonomy only.

It accepts the executable taxonomy/vector layer to L3 because the complete schema can now:
- consume frozen PIT-safe component receipts;
- preserve decision-clock identity;
- emit one immutable multi-dimensional regime receipt;
- expose mature dimensions;
- preserve blocked dimensions as UNKNOWN or CONTEXT_RAW;
- replay deterministically;
- fail closed on clock/provenance mismatches;
- avoid any scalar Risk-On/Risk-Off score or policy action.

This is NOT a claim that every regime dimension has complete Taiwan evidence.

D18-04 Breadth, D18-06 Size and D18-07 Global remain separately blocked at their own current maturity.

## Frozen observable vector

The executable vector contains:
- trendContext;
- breadthContext;
- volatilityDirection;
- activityDirection;
- concentrationContext;
- sizeLeadership;
- institutionalContext;
- globalTransmission;
- sectorRotationContext.

Known / executable upstream lanes currently include:
- D18-02 TAIEX trend context;
- D18-03 volatility direction;
- D18 direction breadth raw context;
- D18-05 prospective sector-rotation context.

Unready lanes remain explicit:
- breadth canonical BROAD_POSITIVE/BROAD_NEGATIVE label remains CONTEXT_RAW because U2B continuity-certified median return is not ready;
- activity remains UNKNOWN unless a frozen 20-session activity context is supplied;
- concentration remains CONTEXT_RAW without an outcome-independent high/low threshold;
- institutional flow remains CONTEXT_RAW and never becomes a majority-vote bull/bear state;
- size remains UNKNOWN while PIT market-cap vintage is incomplete;
- global remains UNKNOWN while durable decision-time global receipts are incomplete.

## L3 promotion-gate review

Per research/D16_D18_PROMOTION_GATE_V0_1.md:

### 1. Executable/tested data builder — PASS
Implementation:
system2/runtime/d18_observable_regime_vector_v0_1.mjs

Test:
system2/tests/d18_observable_regime_vector_v0_1.test.mjs

### 2. Source/version/availableAt provenance — PASS for vector identity
The vector consumes already versioned/frozen upstream receipts and preserves:
- receiptId;
- vectorVersion;
- marketDate;
- exact decisionTimestamp;
- upstream source hashes;
- component source lineage.

It does not manufacture unavailable timestamps.

### 3. Replay test — PASS
Verified:
same inputs -> same receiptHash.
A changed upstream TAIEX source receipt / value changes the vector receiptHash.

### 4. UNKNOWN fail-closed — PASS
Hard prerequisites fail the whole vector when:
- TAIEX context is absent/not PIT-ready;
- direction breadth is absent/not ready;
- decision clocks disagree;
- market dates disagree.

Non-hard dimensions preserve their own UNKNOWN / CONTEXT_RAW state instead of being coerced to neutral.

### 5. No current-data historical backfill — PASS by contract
The vector performs no source fetch and no historical reconstruction.
It only consumes frozen upstream receipts.
Prospective-only sector classification remains prospective-only.
Blocked size/global/history-dependent lanes stay UNKNOWN.

### 6. Source coverage audited — PASS
Prior D18 source-readiness audits explicitly classify:
- source-ready;
- derived-ready;
- history-dependent;
- blocked dimensions.

This builder encodes those audited gaps rather than hiding them.

## Falsification / anti-overclaim

The following are intentionally prohibited:

- no scalar regime score;
- no majority vote;
- no composite Risk-On/Risk-Off label;
- no strategy activation/deactivation;
- no dynamic weight;
- no ranking impact;
- no capital impact;
- no fill/execution impact;
- no threshold tuning from outcomes.

A partially known vector is not mislabeled as "complete regime known".

The receipt exposes evidenceCompleteness:
- dimensionCount;
- knownCount;
- rawContextCount;
- unknownCount;
- allDimensionsReady.

## Why partial UNKNOWN dimensions do not block D18-01 L3

D18-01 owns taxonomy/data-feasibility, not the independent maturity of every producer module.

The L3 gate requires:
- a tested builder;
- provenance;
- replay;
- UNKNOWN semantics;
- no backfill;
- audited coverage.

The correct behavior when a producer is not ready is explicit UNKNOWN.
Requiring fabricated values for all dimensions would violate the same L3 gate.

Therefore:
D18-01 can reach L3 as an executable fail-closed taxonomy layer while D18-04/06/07 remain at their own lower maturity.

## D18-04 blocker remains real

D18-04 is NOT promoted by this packet.

The canonical breadth label still depends on U2B continuity-certified return distribution.

Current shared continuity infrastructure still records:
technicalContinuityCertified = false

and official historical corporate-action final-result ranges do not yet prove complete immutable revision/correction/cancellation version history.

Therefore:
- raw direction breadth can enter the vector as CONTEXT_RAW;
- canonical return-aware breadth regime remains blocked;
- no second corporate-action adjustment engine may be invented in D18.

## Maturity decision

Promote:
D18-01: L2/40 -> L3/60.

Keep unchanged:
D18-04 and all other producer-specific modules.

This is Taiwan PIT taxonomy/data-feasibility maturity only.
It is not OOS/prospective strategy evidence.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## L4 blockers

D18-01 remains blocked from L4 until:
- vector versions are frozen prospectively;
- state occupancy accumulates across multiple dates/episodes;
- any tested policy is preregistered;
- baseline/challenger are paired;
- next-session timing is correct;
- costs and exposure controls are identical;
- UNKNOWN coverage is reported;
- more than one relevant regime episode exists.

## Exact next

1. Persist context-only prospective D18 observable-regime receipts.
2. Do not arm policy.
3. Continue D18-04 only through the shared continuity truth; no local adjustment engine.
4. Improve activity/concentration/institutional producer receipts without forcing D18-01 taxonomy labels.
5. L4 only after prospective/OOS occupancy and strategy-interaction evidence.
