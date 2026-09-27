# System 2 Strategy Source Readiness V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH-ONLY / SOURCE-READINESS MAPPING / NO STRATEGY THRESHOLDS FROZEN

## Purpose

Map each owner-approved StrategyContract（策略契約） to the actual current System 2 source contract.

This document answers:
1. what can be measured now;
2. what can be measured prospectively after frozen capture;
3. what is blocked by PIT（時點一致性） / semantic / source gaps;
4. whether a strategy may start an honest limited Shadow（影子模擬） without pretending missing evidence exists.

GitHub source contracts and evidence override chat assumptions.

## Readiness vocabulary

- READY_CURRENT（目前可用）: machine-readable current/recent source exists.
- DERIVABLE_CURRENT（目前可推導）: deterministically derivable from current valid source fields.
- PROSPECTIVE_CAPTURE_REQUIRED（需前瞻凍結）: usable going forward after immutable capture; do not fabricate history.
- PIT_AUDIT_REQUIRED（需時點稽核）: source exists, but historical vintage/continuity is not yet safe.
- SOURCE_EXTENSION_REQUIRED（需擴充資料源）: required data family is not canonically available.
- SEMANTIC_GAP（語意不足）: data exists but does not support the intended interpretation.
- BLOCKED_FOR_FULL_SHADOW（完整影子模擬受阻）: strategy identity cannot yet be represented honestly with its required evidence.
- LIMITED_SHADOW_ELIGIBLE（可有限影子模擬）: a constrained preregistered version can run prospectively if missing evidence remains explicit and is not silently replaced.

## Cross-strategy source matrix

| Strategy | Current usable core | Main gaps | Readiness |
|---|---|---|---|
| SHORT_MOMENTUM（短線動能） | Daily OHLCV, MA/ATR/basic structure, daily price-volume, current 3-institution flow, TAIEX, current TDCC context | TPEx/small-cap regime contract, prospective breadth/sector snapshot, richer pattern lifecycle, same-slot/cumulative intraday baseline history, corporate-action historical semantics | LIMITED_SHADOW_ELIGIBLE |
| SWING_GROWTH（波段成長） | Current quarterly financials, PE/PB, current ownership, daily timing fields | Historical publication vintages, monthly-revenue first-known history, richer industry-cycle state, analyst expectations/forward valuation, precise catalyst/expectation source | LIMITED_SHADOW_ELIGIBLE after prospective source freeze; retrospective claims restricted |
| INDUSTRY_TREND（產業趨勢） | Generic sector strength/current classification, current financials, technical/PV timing | Canonical industry-specific demand/supply/inventory/capacity/product-price sources, classification vintages, company exposure/earnings-elasticity contracts | BLOCKED_FOR_FULL_SHADOW |
| EVENT_DRIVEN（事件驅動） | Official announcement date/title, current price reaction and technical/PV fields | Precise firstKnownAt/availableAt, immutable event IDs/revisions, general news, verified mechanism/exposure/half-life source, intraday event ordering | BLOCKED_FOR_FULL_SHADOW; date-level exploratory capture only |
| VALUE_REVERSION（價值回歸） | Current PE/PB, current quarterly fundamentals, daily technical/PV | Historical valuation percentiles, peer-vintage comparability, richer cash-flow/balance-sheet fields, repair-catalyst semantics | LIMITED_SHADOW_ELIGIBLE as RESEARCH_ONLY with explicit missingness |

Pending identity contracts:
- INSTITUTIONAL_ACCUMULATION（法人累積／法人布局）: source feasibility is relatively strong (A3/A4/A1), but machine contract remains blocked by owner-review status, not by basic data availability.
- FUNDAMENTAL_GROWTH（基本面成長）: source feasibility is partial; identity remains owner-review pending. ROA（資產報酬率） is a research candidate, not a required gate.
- BLACK_HORSE_ACCUMULATION（黑馬潛伏）: remains a research lane until incremental distinctness from Institutional Accumulation is proven.

## SHORT_MOMENTUM source map

### TECHNICAL_STRUCTURE（技術結構）
Current:
- close/open/high/low;
- MA5/10/20/60;
- ATR%;
- prior highs/lows;
- gap and breakout-distance fields where produced;
- daily close/wick features.

State:
DERIVABLE_CURRENT for basic trend/level/extension structure.

Gap:
Named-pattern topology/lifecycle and safe historical backtest require raw-vs-adjusted / corporate-action / swing-confirmation provenance.
Do not claim the full Technical Structure Engine is production-ready.

### PRICE_VOLUME（價量）
Current:
- daily volume;
- avgVolume20Lots;
- volumeTodayVsPrev5;
- volumeContraction5to20;
- daily price response.

State:
DERIVABLE_CURRENT for daily context.

Gap:
sameSlotRVOL（同時段相對量）, cumulativeVolumePace（累積成交量進度） and richer intraday acceptance require prospective clean baseline/coverage before strategy use.

### MARKET_REGIME（市場環境）
Current:
TAIEX current contract.

Gap:
TPEx, breadth, sector rotation and large-vs-small leadership are incomplete or prospective-only.

Rule:
Do not substitute TAIEX for TPEx/small-cap state.

### Decision
A limited Short Momentum Shadow version is feasible now/prospectively using current-safe fields, provided:
- missing market breadth/TPEx data remains UNKNOWN;
- richer pattern/volume research is not silently treated as present;
- no numeric weights are tuned from outcomes.

## SWING_GROWTH source map

### FUNDAMENTAL_QUALITY（基本面品質）
Current:
quarter revenue/EPS, revenue QoQ/YoY, gross/operating margins and changes.

State:
READY_CURRENT for prospective snapshots.
Historical outcome tests remain PIT_AUDIT_REQUIRED until publication-time vintages are frozen.

### INDUSTRY_THESIS（產業投資邏輯）
Current:
current classification and some sector state can be captured prospectively.

Gap:
industry future/cycle stage is not yet a complete canonical contract across industries.

### EVENT_CATALYST / EXPECTATION（事件催化／預期變化）
Current:
official announcements at date/title level.

Gap:
market expectation/surprise and precise first-known semantics are incomplete.

### VALUATION（估值）
Current:
PE/PB.

Gap:
forward PE, PEG, EV/EBITDA, FCF yield, historical valuation percentiles.

### Decision
A source-restricted Swing Growth Shadow can begin prospectively only if the strategy version explicitly states which current fields constitute its initial thesis and leaves unavailable forward-estimate/event fields UNKNOWN.
Do not market that version as the full eventual Swing Growth strategy.

## INDUSTRY_TREND source map

Core requirement:
industry cycle stage + company-level earnings transmission.

Current generic proxies are insufficient to represent this fully across Taiwan industries.

Major missing canonical families:
- product pricing;
- inventory;
- utilization;
- capacity additions;
- demand/supply balance;
- commodity/raw-material transmission;
- company exposure / pass-through / earnings elasticity.

Decision:
Do not launch a "full Industry Trend" Shadow merely from sector relative strength and technical charts.
That would change the strategy identity into momentum-by-sector.

Allowed now:
- source discovery;
- prospective sector-cycle card capture;
- industry-specific pilot research where source semantics are frozen.

## EVENT_DRIVEN source map

Core requirement:
verified event + firstKnownAt/availableAt + mechanism + company exposure + half-life/expiry/invalidation.

Current announcement date/title does not satisfy the full contract.

Decision:
Full Event-Driven intraday Shadow is BLOCKED_FOR_FULL_SHADOW.
Allowed:
- date-level event-card prototyping;
- source-contract research;
- prospective immutable capture once a canonical source is selected;
- post-event price-response research only when event timing is sufficiently precise for the horizon.

## VALUE_REVERSION source map

Core requirement:
valuation dislocation vs durable fundamentals + credible repair path.

Current PE/PB alone cannot establish "cheap relative to history" robustly.

Decision:
Research-only limited prospective Shadow may record:
- current PE/PB;
- current fundamentals;
- repair observations;
- technical/PV stabilization.

But:
- historical valuation percentile remains UNKNOWN;
- peer comparison requires comparable-industry/vintage control;
- low PE/PB alone never qualifies a stock.

## Source-first rule

When a strategy is source-blocked, System 2 must choose one of:
1. keep the factor UNKNOWN;
2. run a clearly narrower preregistered strategy version;
3. wait for source extension.

Prohibited:
- substitute a convenient proxy and keep the same strategy name/claim;
- backfill current values into historical dates;
- treat missing as neutral;
- lower a REQUIRED condition only to increase candidate count.

## Next engineering step

1. Freeze machine-readable source-readiness receipts for each contract family.
2. Build an evaluator that separates StrategyValidity（策略有效性） from EntryReadiness（進場準備度） and fails closed on missing REQUIRED evidence.
3. Implement first limited Shadow contracts only for strategies whose source map allows an honest version.
4. Preserve all blocked/incomplete evaluations so zero-pick and source-gap days remain visible.


## 2026-09-27 prospective-source upgrade

System 2 now has dedicated read-only observers for the two dependencies that previously blocked decision-clock evidence:

- A5_QUARTERLY_FINANCIALS: official market-wide filing-vintage observation with explicit first-observed semantics;
- B2_INDUSTRY_THESIS_PROSPECTIVE: same-day derived industry breadth/participation snapshot from official profile + close data.

Impact on source readiness:

- SHORT_MOMENTUM remains LIMITED_SHADOW_ELIGIBLE under its preregistered restricted contract.
- SWING_GROWTH has materially improved prospective source readiness because A5 and a descriptive B2 observer now exist.
- This does NOT make the eventual full SWING_GROWTH strategy source-complete: forward expectations, precise catalysts, richer industry-cycle mechanisms and historical publication vintages remain incomplete.
- B2 descriptive industry breadth is not a substitute for a full INDUSTRY_TREND cycle thesis.

The first honest trading-date evidence from these observers is still pending. 2026-09-27 was a non-trading smoke and 2026-09-28 is an official holiday.
