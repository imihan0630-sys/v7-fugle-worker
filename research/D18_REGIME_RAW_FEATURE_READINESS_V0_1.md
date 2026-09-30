# D18 Market-Level Regime Raw-Feature Readiness V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH-ONLY SOURCE/DERIVATION AUDIT
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Audit whether the observable Regime V0 dimensions can be produced prospectively from existing System 2 source contracts without inventing new sources or backfilling current values into history.

This file distinguishes:
- SOURCE_READY: official/current source contract exists;
- DERIVABLE_ZERO_NEW_CALL: deterministic market-level derivation can be built from already-captured rows;
- HISTORY_DEPENDENT: needs prior frozen snapshots/history;
- BUILDER_MISSING: source exists but executable market-level builder/replay test is absent;
- PIT_BLOCKED: source/vintage semantics are not sufficient.

A specification is not treated as implementation evidence.

## 1. Trend context

Planned fields:
- TAIEX close;
- dailyReturn;
- return5/return20;
- ma20;
- ma20Slope5.

Evidence:
- A2 TAIEX current normalized contract is TIER_A_CURRENT;
- official A2 probe contract exists;
- current source audit documents asOfDate/count/history[]/return20/dailyReturn.

Readiness:
- close/dailyReturn/current TAIEX observation: SOURCE_READY;
- return windows / ma20 / slope: HISTORY_DEPENDENT;
- market-level frozen derivation/replay implementation for the exact D18 fields: BUILDER_MISSING.

Network implication:
No new external source family is required if sufficient A2 history is frozen prospectively.

L3 implication:
D18 Trend interaction cannot move to L3 merely because the A2 endpoint exists. The exact market-level features and replay provenance must be executable and tested.

## 2. Breadth / participation

Planned:
- official exchange advance/decline/unchanged counts;
- official untraded / no-comparison diagnostics where the venue exposes them;
- common-stock direction breadth;
- medianReturn / equal-weight return distribution;
- aboveMa20Pct;
- positive5dPct;
- explicit U0/U1/U2/U3 coverage.

New source-family split:
1. **Official aggregate market-direction breadth**
   - TWSE official `/opendata/twtazu_od` directly exposes stock-category up / limit-up / down / limit-down / unchanged / untraded / no-comparison counts.
   - `system2/runtime/d18_twse_official_market_breadth_v0_1.mjs` now provides an isolated research-only parser with target-date, PIT, duplicate, impossible-subcount and denominator guards.
   - PR #286 final-head System2 Research CI, V8 Repair CI and V8 Regression all passed before merge.
   - TPEx official market-highlight semantics expose advancing / declining / flat / untraded counts, but an exact machine-readable prospective transport/clock has not yet been verified for this D18 lane. Do not invent one from HTML.
2. **Per-symbol A1 common-stock / return lane**
   - needed for common-stock breadth, median/equal-weight return and rolling-history participation;
   - current prospective Decision Clock evidence shows same-day source availability is not yet reliable enough to call this lane decision-ready at the frozen clock.
3. **Formal opportunity-set breadth**
   - remains a separate estimand and must not substitute for market breadth.

Prospective falsification evidence:
- 2026-09-29 attempt-one source clock: TWSE A1 remained on the prior official session through the observation window; TPEx A1 produced transport/source errors; B2 was incomplete.
- finalized 2026-09-29 acceptance still counts that immutable attempt-one date as an independent source-clock date, but `completeTradingDates=0` and `precisionEligibleDates=0`.
- 2026-09-30 raw source clock: TWSE A1 remained on 2026-09-29 through roughly 16:10 Taipei while TPEx eventually reached 2026-09-30, proving cross-market asynchronous availability.
- workflow SUCCESS is therefore not equivalent to factor READY.

Readiness:
- TWSE official aggregate direction-breadth parser/replay semantics: **EXECUTABLE_PIT_SUBLANE_VALIDATED**.
- TWSE aggregate prospective publication-time distribution: **PENDING**.
- TPEx aggregate machine-readable source + prospective clock: **SOURCE_TRANSPORT_PENDING**.
- cross-market official aggregate breadth: **BLOCKED_PENDING_BOTH_VENUES**.
- per-symbol direction breadth semantic classifier: **EXECUTABLE_PIT_SUBLANE_VALIDATED**.
- per-symbol common-stock breadth at a frozen after-close clock: **SOURCE_FAMILY_REVALIDATION_REQUIRED**.
- medianReturn / equal-weight return: **U2_CONTINUITY_DEPENDENT**; two raw closes alone are insufficient.
- aboveMa20Pct / positive5dPct: **HISTORY_DEPENDENT** on symbol-level PIT history + certified technical continuity.
- eligibleCoveragePct: derivable only after the exact requested universe/denominator contract is named; do not reuse Formal-normalized coverage as market coverage.

Critical semantics:
- Direction Breadth and True Return Distribution mature separately.
- `X`/no-comparison is not FLAT; untraded/no-comparison remain explicit denominator diagnostics.
- U2A raw-close return is diagnostic only; primary D18 return distribution requires U2B continuity-certified return.
- current official full-market historical rows assign continuity `UNVERIFIED`, so they cannot silently become U2B.
- missing history reduces coverage and never means below MA / negative return.
- official exchange market breadth, common-stock research breadth and Formal opportunity-set breadth are distinct objects.
- a source-clock-valid date can still be feature-invalid or strategy-cohort-invalid; do not promote evidence across layers.

L3 implication:
The TWSE official aggregate direction-breadth **sublane** now meets executable/parser-test feasibility. The whole D18-04 module remains L2 because TPEx/cross-market prospective availability, U2 return continuity and context-only occupancy are still incomplete.

## 3. Market activity / liquidity context

Planned:
- totalTradeValue;
- medianTradeValue;
- liquidSymbolCount;
- totalTradeValueVs20D;
- liquidityCoveragePct.

Evidence:
A1 daily rows already carry trade value/current price-volume primitives.

Readiness:
- totalTradeValue / medianTradeValue: DERIVABLE_ZERO_NEW_CALL;
- liquidSymbolCount: needs a frozen liquidity definition; BUILDER_MISSING until that definition is versioned;
- totalTradeValueVs20D: HISTORY_DEPENDENT on 20 frozen market snapshots;
- coverage: DERIVABLE_ZERO_NEW_CALL from explicit row/universe accounting.

Semantic guard:
Traded value is activity/liquidity context, not literal capital inflow.

## 4. Concentration / dispersion

Planned:
- top10TradeValueShare;
- top20TradeValueShare;
- returnDispersion.

Evidence:
All are deterministic cross-sectional functions of same-day A1 full-universe rows if coverage is complete.

Readiness:
- source: SOURCE_READY through A1;
- calculation: DERIVABLE_ZERO_NEW_CALL;
- executable D18 market-level builder: BUILDER_MISSING.

No HIGH/LOW concentration threshold is authorized.
Store raw fields first.

## 5. Volatility direction

Planned:
- realizedVol5;
- realizedVol20;
- volRatio5to20.

Evidence:
A2 TAIEX history is the intended source family. A1 symbol-level primitives already demonstrate tested return-volatility calculation mechanics, but that does not equal a market-level A2 builder.

Readiness:
- source family: SOURCE_READY;
- rolling calculation: HISTORY_DEPENDENT;
- market-level D18 implementation/replay: BUILDER_MISSING.

No outcome-tuned VOL_NORMAL epsilon band is allowed.

## 6. Institutional market context

Planned:
- market aggregate foreignNet;
- trustNet;
- dealerNet.

Evidence:
A3 TWSE/TPEx official source probes and current synchronized per-stock fields exist.

Readiness:
- source: SOURCE_READY for recent/prospective use;
- market aggregation: DERIVABLE_ZERO_NEW_CALL when both market receipts are present;
- D18 aggregate context builder: BUILDER_MISSING.

Guard:
- flow != holdings;
- foreign/trust/dealer signs are not majority votes;
- missing one market cannot silently become a Taiwan-wide zero.

## 7. Sector participation / rotation

Evidence:
B2 prospective derived observer is already implemented using current official company-profile classification plus same-date TWSE/TPEx close rows.

Readiness:
- prospective industry snapshot: SOURCE/DERIVATION READY at observer-contract level;
- classification vintage semantics: prospective only, no historical backfill;
- final D18 sector-rotation labels/policy: BUILDER_MISSING / observation-only.

This lane is closer to L3 than size/global, but needs exact D18 factor output + replay/UNKNOWN tests before promotion.

## 8. Size leadership

Planned:
- LARGE_CAP_LED / SMALL_CAP_LED.

Evidence:
Current marketCapYi source identity/vintage is not sufficiently preserved for historical/replay use. Existing research shows explicit vs sharesOutstanding×close paths and corporate-action denominator semantics matter.

Readiness:
PIT_BLOCKED above conceptual L2.

Do not proxy with:
- price level;
- trade value;
- TAIEX membership;
- current sharesOutstanding applied to historical close.

## 9. Global transmission

Planned:
US/global indexes, FX, rates, oil/commodities, macro.

Evidence:
- CBC USD/TWD prospective feasibility exists;
- prior US close feasibility exists;
- DXY/SOX/full global provider contract and macro revision clocks remain incomplete.

Readiness:
PARTIAL_SOURCE_FEASIBILITY / PIT_BLOCKED for one canonical GLOBAL_RISK_ON/OFF state.

Keep GLOBAL_TRANSMISSION_CONTEXT UNKNOWN until the chosen input set and decision-clock receipts are frozen.

## 10. Implementation priority

Lowest-risk order using existing infrastructure:

### Phase A — same-day zero-new-call raw context
1. A1 breadth counts / median return.
2. A1 total/median trade value.
3. A1 top10/top20 trade-value concentration.
4. A1 return dispersion.
5. A3 market aggregate institution flow when source receipts are ready.
6. B2 industry snapshot passthrough/context.

### Phase B — history-dependent market context
1. A2 ma20 / slope.
2. A2 realizedVol5/20.
3. A1/A2 20-day market activity history.
4. breadth MA/positive-5d participation with explicit history coverage.

### Phase C — blocked dimensions
1. size leadership after market-cap vintage/provenance repair;
2. global transmission after durable receipt/source-clock freeze.

## 11. Builder contract required for L3

A market-level Regime builder should preserve:
- marketDate;
- decisionTimestamp;
- featureVersion;
- sourceSessionHash;
- universeVersion/hash;
- raw feature values;
- observedAt/availableAt;
- pointInTimeEligible;
- coverage numerator/denominator;
- UNKNOWN reasons;
- prior-history window identity/hash;
- official-session continuity;
- capturedAt;
- featureSnapshotHash.

Fail closed when:
- required source receipt is future/invalid;
- universe accounting is incomplete;
- historical window has gaps/stale rows;
- coverage denominator is unknown;
- a requested history field is not mature.

## 12. Replay tests before L3

Minimum structural tests:
1. future source availableAt => UNKNOWN/BLOCK.
2. missing TPEx/TWSE half-universe => no Taiwan-wide breadth claim.
3. incomplete symbol history => coverage reduction, not negative breadth.
4. stale market-history snapshot => rolling feature UNKNOWN.
5. holiday gap uses official next/previous session, not calendar day.
6. duplicate symbol rows fail.
7. same source rows + same version => deterministic identical hash/output.
8. history mutation after freeze creates a new version/hash; no silent overwrite.
9. no future bar may enter rolling history.
10. current classification/market-cap data cannot backfill an old date.

## 13. L3 candidates from current evidence

Potential first L3 candidates **after builder/tests**, not now:
- D18-02 Trend vs Range;
- D18-03 High/Low Volatility;
- D18-04 Breadth × Strategy;
- parts of D18-05 Sector Rotation × Strategy.

Remain L2:
- D18-06 Size leadership;
- D18-07 composite/global Risk-on/off;
- policy modules until executable states and OOS evidence exist.

## 14. Current conclusion

The main bottleneck for domestic observable Regime research is no longer "find more data sources".
It is:
- build one PIT-safe market-level feature layer;
- prove coverage/continuity;
- freeze versions before outcomes;
- collect prospective occupancy before policy testing.

No Formal or System 2 strategy decision changes are authorized.

## Exact next continuation

1. Specify the market-level builder schema/tests as research-only engineering.
2. Decide whether D18 context builder is Class A isolated research code or touches shared capture/runtime and requires Class B governance.
3. Do not arm capture or strategy policy merely because the builder exists.
4. First prospective objective is state occupancy/UNKNOWN coverage, not alpha.
