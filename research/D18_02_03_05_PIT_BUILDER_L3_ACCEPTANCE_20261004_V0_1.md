# D18-02 / D18-03 / D18-05 Taiwan PIT Builder L3 Acceptance — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 2 policy impact: NONE

## Scope

This acceptance packet evaluates only:
- D18-02 Trend vs Range × Strategy;
- D18-03 High/Low Volatility × Strategy;
- D18-05 Sector Rotation × Strategy.

It does not claim:
- policy alpha;
- strategy activation value;
- dynamic weights;
- prospective performance;
- L4 evidence.

D18-01 Market Regime Taxonomy remains L2 because the full multi-dimensional observable regime vector is not yet executable across breadth/activity/concentration/institutions/size/global lanes.

---

## L3 gate

Per `research/D16_D18_PROMOTION_GATE_V0_1.md`, L3 requires:
1. executable or tested data builder;
2. source/version/availableAt provenance;
3. replay test;
4. UNKNOWN fail-closed behavior;
5. no current-data historical backfill;
6. source coverage audited.

All six are reviewed below.

---

# D18-02 Trend vs Range × Strategy

## Executable builder

New isolated research-only module:
`system2/runtime/d18_taiex_context_v0_1.mjs`

It consumes:
- A2 TAIEX official source-probe receipt;
- exact official-session calendar window;
- frozen TAIEX close history;
- frozen after-close decision timestamp.

It derives:
- close;
- MA20;
- MA20 five official sessions earlier;
- MA20Slope5;
- return5;
- return20.

Frozen descriptive label:
- UP_TREND_CONTEXT if close > MA20 and MA20Slope5 > 0;
- DOWN_TREND_CONTEXT if close < MA20 and MA20Slope5 < 0;
- RANGE_OR_MIXED otherwise.

No optimized threshold exists.
No strategy action is wired.

## PIT / provenance

The builder fails closed unless:
- A2 sourceId is exact;
- A2 marketDate matches;
- A2 state = READY;
- A2 prospectiveSameDateEligible = true;
- A2 observedAt <= decisionTimestamp;
- exact 25-session history ends on marketDate;
- exact 25-session independent calendar window matches history;
- calendar receipt is READY;
- calendar raw hash is present;
- calendar observedAt <= decisionTimestamp.

The resulting receipt freezes:
- contextVersion;
- source contract version;
- source observedAt;
- history window hash;
- official-session window hash;
- decisionTimestamp;
- receipt hash.

## Replay / falsification

Verified:
- identical input -> identical receiptHash;
- history mutation -> new historyWindowHash and receiptHash;
- post-decision A2 observation -> UNKNOWN;
- official-session mismatch/gap -> UNKNOWN;
- future history row -> hard rejection;
- no policy/selection impact.

This closes the previous `MARKET_BUILDER_MISSING` blocker for the trend sublane.

## Remaining limits

L3 is data feasibility only.
No Taiwan OOS/prospective strategy interaction has been tested.
D18-02 remains blocked from L4.

---

# D18-03 High/Low Volatility × Strategy

## Executable builder

The same A2 builder derives:
- realizedVol5 = population SD of last 5 official close-to-close simple returns;
- realizedVol20 = population SD of last 20 official close-to-close simple returns;
- volRatio5to20.

Frozen descriptive label:
- VOL_EXPANDING if RV5 > RV20;
- VOL_CONTRACTING if RV5 < RV20;
- VOL_EQUAL if equal.

No epsilon band / VOL_NORMAL threshold is introduced.

## Anti-misinterpretation

The ratio is not a standalone amplitude measure.
Prior D04 research proves RV5/RV20 is mechanically constrained by overlapping windows and can be low during a smooth directional rally.

Therefore D18-03 L3 means:
"the volatility-direction state can be generated PIT-safely",
not:
"the state predicts returns".

## Replay / fail-closed

Same exact 25-session/source/calendar gate as D18-02.

Verified:
- flat returns produce known RV5=0 and RV20=0 with VOL_EQUAL;
- ratio is null when RV20=0;
- post-decision source -> UNKNOWN;
- session mismatch -> UNKNOWN;
- deterministic replay hash.

This closes the previous `MARKET_BUILDER_MISSING` blocker for the volatility-direction sublane.

## Remaining limits

No strategy interaction or policy OOS evidence.
D18-03 remains blocked from L4.

---

# D18-05 Sector Rotation × Strategy

## Existing producer

`system2/runtime/b2_industry_snapshot_observer.mjs` already provides a prospective observer using:
- official TWSE/TPEx company-profile classification;
- official same-date TWSE/TPEx close rows;
- explicit market coverage checks;
- classification vintage semantics:
  `PROFILE_FIRST_OBSERVED_PROSPECTIVELY_NO_HISTORICAL_BACKFILL`.

The producer intentionally does not assign strategy direction.

## New D18 consumer builder

New isolated research-only module:
`system2/runtime/d18_sector_rotation_context_v0_1.mjs`

It consumes two adjacent official-session B2 receipts.

It derives:
- industry daily mean-change ranking;
- prior rank;
- current rank;
- rankImprovement;
- breadth context;
- common-industry count.

Important semantic boundary:
- industryKey remains market-prefixed;
- TWSE/TPEX taxonomies are not silently harmonized;
- no ROTATING/STABLE threshold is invented;
- no strategy score/policy is assigned.

## PIT / replay rules

Fail closed unless:
- current/prior B2 receipts are READY;
- dependencyCoverageEligible = true;
- B2 classification-vintage rule is exact;
- current observedAt <= decision timestamp;
- prior and current dates are adjacent in the provided official-session sequence;
- receipt hashes exist;
- rankable industry rows exist.

Verified:
- identical inputs -> identical receiptHash;
- post-decision current receipt -> UNKNOWN;
- non-adjacent prior session -> UNKNOWN;
- NOT_READY B2 receipt -> UNKNOWN;
- ranking transition is deterministic.

This closes the previous exact D18 factor-output / replay blocker for the prospective sector-rotation context lane.

## Remaining limits

This does not establish:
- historical sector membership replay;
- universal cross-market taxonomy;
- sector-rotation alpha;
- regime-policy value.

D18-05 remains blocked from L4 pending prospective/untouched OOS interaction evidence.

---

# CI / regression evidence

PR #433 first implementation head:
`0c2f6b183e9815e624299c897481b1dc114d7b98`

Verified CI:
- System2 Research CI run #483 / run id 37163232569: SUCCESS.
  - log explicitly contains `D18 sector rotation context builder tests: PASS`
  - log explicitly contains `D18 TAIEX context builder tests: PASS`
- V8 Regression Tests run #1550 / run id 37163232532: SUCCESS.

The new modules remain unreferenced by production strategy/policy code.
No selection/ranking/capital/execution/notification behavior changed.

---

# Why D18-01 remains L2

D18-01 is the broader Market Regime Taxonomy module.

The current implementation closes:
- Trend context;
- Volatility direction;
- Sector rotation context.

But the canonical observable regime vector still includes additional lanes:
- Breadth / participation;
- Activity / liquidity;
- Concentration;
- Institutional context;
- Size leadership;
- Global transmission.

Known blockers remain:
- D18-04 full cross-market breadth/U2 continuity incomplete;
- size market-cap vintage lineage incomplete;
- global durable receipts incomplete;
- one full immutable vector builder has not yet been wired.

Therefore D18-01 remains L2.
A partial vector is not treated as full taxonomy L3.

---

# Maturity decision

Promote:
- D18-02: L2/40 -> L3/60.
- D18-03: L2/40 -> L3/60.
- D18-05: L2/40 -> L3/60.

Keep:
- D18-01: L2/40.
- D18-04: L2/40.
- D18-06~15: unchanged.

With 15 D18 modules:
D18 maturity moves 40.0% -> 44.0%.

This is Taiwan PIT data-feasibility maturity, not strategy-performance maturity.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next

1. Build the full immutable observable regime vector before reconsidering D18-01 L3.
2. Complete TPEx + U2B continuity for D18-04.
3. Persist prospective D18-02/03/05 context occupancy before opening any strategy outcomes.
4. L4 only after frozen strategy/regime versions, untouched OOS/prospective outcomes, multiple relevant episodes and identical cost treatment.
