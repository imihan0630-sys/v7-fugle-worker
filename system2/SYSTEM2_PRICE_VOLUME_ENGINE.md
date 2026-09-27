# System 2 Price-Volume Engine

Updated: 2026-09-27 Asia/Taipei
Status: DESIGN DRAFT V0.1 / RESEARCH-ONLY / OWNER REVIEW PENDING / THRESHOLDS NOT FROZEN

## Purpose

Define an independent PRICE_VOLUME_ENGINE（價量引擎） for System 2.

The engine answers a different question from TECHNICAL_STRUCTURE_ENGINE（技術結構引擎）:

- Technical structure: what geometry / trend / level / pattern is present?
- Price-volume: how much participation/effort accompanied the move, how did price respond, and was the move accepted, rejected, absorbed or unresolved?

The two engines interact but remain separate so a named chart pattern or technical indicator cannot silently substitute for price-volume evidence.

Shared knowledge is inherited from the existing PRICE_VOLUME research lane. No System 1 Formal Core behavior is changed.

## Design principles

1. Volume is contextual; more volume is not monotonically bullish.
2. Same price-volume combination can mean different things by location, trend, strategy, market/industry regime and prior participation.
3. Price-volume outputs describe participation/response. They do not claim hidden order-flow causality from candles alone.
4. Missing/stale/semantically invalid data remains UNKNOWN（未知）.
5. Same-slot / same-session normalization is preferred for intraday research where available.
6. Volume unit semantics, corporate-action continuity, suspensions and symbol-session provenance must be explicit.
7. PRICE_VOLUME_ENGINE does not directly emit BUY/SELL.
8. Exact thresholds/lookbacks/weights require PIT（時點正確性）/Shadow（影子模擬）/OOS（樣本外） validation.

## P1 — Raw Participation / Normalization（原始參與度／標準化）

Candidate outputs:
- volumeShares / volumeLots with explicit unit
- turnoverValue（成交值）
- relativeVolume5 / 20 / 60（日相對量）
- sameSlotRVOL（同時段相對量） where valid
- cumulativeVolumePace（累積成交量進度） where valid
- turnoverShareOfStockHistory（相對自身成交值）
- volumeAcceleration / deceleration（量能加速／減速）
- volumeDryUp（量縮／乾量）
- volumeExpansion（量增）
- volumePersistence（量能持續性）

Never coerce unavailable same-slot history to neutral.

## P2 — Price Response to Participation（價格對量能反應）

Candidate outputs:
- return / intrabar return
- trueRange / ATR-normalized range（真實波幅／ATR標準化波幅）
- closeLocation（收盤位置）
- bodySize / wick ratios（實體／上下影比例）
- gap context（缺口脈絡）
- priceProgressPerVolume（單位成交量價格推進；研究用）
- effortVsResultState（努力與結果狀態）
- responseEfficiency（價格反應效率；研究用）

Examples:
- high participation + strong directional close can be efficient continuation;
- high participation + little progress can be disagreement/absorption/distribution candidate;
- low participation + pullback can be healthy supply contraction in an established uptrend;
- low participation + breakout can be fragile or simply early/unconfirmed depending context.

No causal label such as institutional absorption may be asserted from OHLCV alone.

## P3 — Canonical Price-Volume States（核心價量狀態）

Descriptive state families:
- PRICE_UP_VOLUME_UP（價漲量增）
- PRICE_UP_VOLUME_DOWN（價漲量縮）
- PRICE_DOWN_VOLUME_UP（價跌量增）
- PRICE_DOWN_VOLUME_DOWN（價跌量縮）
- BREAKOUT_PARTICIPATION（突破參與）
- PULLBACK_VOLUME_CONTRACTION（回檔量縮）
- CLIMAX_PARTICIPATION（極端／高潮量）
- LOW_BASE_CONTROLLED_ACCUMULATION_CANDIDATE（低檔受控吸籌候選）
- HIGH_LEVEL_DISTRIBUTION_CANDIDATE（高檔派發候選）
- PRICE_VOLUME_DIVERGENCE（價量背離）
- PARTICIPATION_UNKNOWN（參與度未知）

These are not universal bullish/bearish labels.

## P4 — Location-aware Interpretation（位置感知解讀）

The same raw state must be interpreted by:
- trend state;
- distance from support/resistance/pivot;
- pattern lifecycle;
- market / industry regime;
- prior return / extension;
- event context;
- strategy role.

Examples:
- price-up/volume-up near a fresh base breakout differs from the same state after a parabolic late-stage run;
- price-down/volume-down near support in an intact uptrend differs from price-down/volume-down during a structural breakdown;
- climax volume at a new high can be continuation or exhaustion until subsequent acceptance/rejection evidence resolves it.

## P5 — Acceptance / Rejection Lifecycle（接受／拒絕生命週期）

Candidate states:
- UNOBSERVED（尚未觀察）
- UNRESOLVED（未解）
- PARTICIPATION_CONFIRMED（參與確認）
- ACCEPTING（逐步接受）
- ACCEPTED（價格接受）
- REJECTED（價格拒絕）
- REENTERED（回到原區間）
- FAILED_BREAKOUT（突破失敗）
- FAILED_BREAKDOWN（跌破失敗）

Required timestamps:
- barStart / eventTime（事件時間）
- barEnd（K棒完成時間）
- featureKnownAt（特徵可知時間）
- recordedAt（寫入時間）

Bar identity time must not be confused with first-known time.

## P6 — Persistence / Episode Model（持續性／事件段落）

Price-volume events should be tracked as episodes rather than independent bars where appropriate:
- participationEpisodeId
- episodeStart
- episodeKnownAt
- persistenceBars / sessions
- peakParticipation
- responseEvolution
- gapReason / missing-observation provenance

Do not continue an episode across recorder gaps or unknown symbol-session status as if continuity were proven.

## P7 — Multi-timeframe Price-Volume Context（多週期價量脈絡）

Daily:
- base formation;
- breakout/pullback volume;
- 5/20/60 relative volume;
- longer participation persistence.

15-minute:
- primary intraday participation / acceptance for strategies that use it.

5-minute:
- execution detail / early observation only where strategy permits.

Weekly:
- major accumulation/distribution context only if data semantics are sufficient; not a substitute for daily detail.

## P8 — Conflict Resolution with Technical Structure / Indicators（與技術結構／指標衝突處理）

System 2 must NOT use majority voting such as "3 bullish indicators vs 2 bearish indicators".

Evidence roles:
- DATA_VALIDITY（資料有效性）
- THESIS_PRIMARY（策略主要投資邏輯）
- HARD_INVALIDATION（硬失效條件）
- STRUCTURE_CONFIRMATION（結構確認）
- PARTICIPATION_CONFIRMATION（參與度確認）
- AUXILIARY_INDICATOR（輔助指標）
- WARNING_CONTEXT（警告脈絡）

Priority rules:
1. DATA_VALIDITY first. Invalid/unknown source cannot be converted into a bullish/bearish vote.
2. Strategy HARD_INVALIDATION overrides auxiliary indicator optimism.
3. Technical structure and price-volume are orthogonal primary context layers; neither has a universal permanent priority over the other.
4. AUXILIARY_INDICATOR signals such as KD/MACD/RSI can strengthen/weaken confidence but cannot rescue a broken structural thesis or clear price rejection.
5. Contradictory valid evidence becomes CONFLICT / WAIT / LOWER_READINESS rather than being forced into a single score.
6. Each strategy declares whether price-volume confirmation is REQUIRED（必要）, SUPPORTIVE（加強）, CONTEXT_ONLY（僅脈絡） or NOT_APPLICABLE（不適用） for a setup.
7. A bullish fundamental/industry thesis may remain valid while technical/PV timing is poor; this should produce WAIT rather than falsely marking the company bad.
8. A technically attractive move with adverse material event/fundamental invalidation cannot be rescued by KD/MACD or volume alone.

## Example conflict semantics

### Example A — Pattern bullish, indicator bullish, price-volume rejects
- PLATFORM_BREAKOUT（平台突破）
- MACD bullish crossover
- KD rising
- extreme volume
- long upper wick
- close back below pivot

Interpretation:
PRICE_REJECTION / FAILED_BREAKOUT risk.
Auxiliary indicators do not override observed rejection.

### Example B — Strong structure, low breakout volume
- mature VCP
- clean pivot break
- low/modest relative volume
- strong close
- supportive sector

Interpretation:
UNRESOLVED / needs strategy-specific confirmation.
Do not universally reject just because breakout volume is not large.

### Example C — KD overbought during strong trend
- higher highs / higher lows
- sector leadership
- stable participation
- KD high and persistent

Interpretation:
KD high is not an automatic SELL; may be strong-trend persistence.

### Example D — Pullback with contracting volume
- intact uptrend
- pullback toward support
- price decline
- volume contraction
- no structural low break

Interpretation:
Potential healthy pullback; strategy may promote to WATCH/NEAR_ENTRY when other conditions align.

### Example E — High volume, little price progress
Interpretation:
DISAGREEMENT / ABSORPTION_OR_DISTRIBUTION_UNRESOLVED.
Do not label institutional accumulation/distribution from OHLCV alone.

## P9 — Strategy adapters（策略適配）

Initial qualitative roles, not weights:

- SHORT_MOMENTUM（短線動能）: price-volume often PRIMARY/REQUIRED for breakout/reacceleration confirmation.
- SWING_GROWTH（波段成長）: SUPPORTIVE timing/acceptance; fundamental/industry thesis remains primary.
- INSTITUTIONAL_ACCUMULATION（法人累積）: important for price-response-to-buying / controlled accumulation context.
- BLACK_HORSE_ACCUMULATION（黑馬潛伏研究）: controlled-volume + higher-low interactions may be important but must not infer hidden actors.
- INDUSTRY_TREND（產業趨勢）: timing/acceptance support; industry cycle thesis primary.
- FUNDAMENTAL_GROWTH（基本面成長）: mainly timing/risk; weak PV does not erase company quality.
- EVENT_DRIVEN（事件驅動）: crucial for post-event price discovery / acceptance / rejection.
- VALUE_REVERSION（價值回歸）: important to identify selling exhaustion/reversal confirmation and avoid catching a falling knife.

## P10 — Recommended normalized output

Per symbol / decision timestamp:
- dataQualityState
- participation
- relativeVolume
- turnover
- response
- effortVsResult
- canonicalState
- locationContext
- acceptanceLifecycle
- persistenceEpisode
- divergence
- warnings
- provenance
- availableAt / featureKnownAt
- engineVersion

The engine must not directly emit BUY/SELL.

## Redundancy firewall

Mandatory comparisons:
- same-slot RVOL vs local 5-day/20-day volume ratios;
- cumulative pace vs same-slot RVOL;
- direct price-volume response vs OBV（能量潮）;
- volume expansion vs breakout/pattern maturity;
- close location / wick ratios vs candlestick labels;
- volatility/range expansion vs ATR/Bollinger/VCP features;
- institutional flow signals vs price-volume response to avoid counting one market move twice.

Keep only incremental information in scoring; redundant variables may remain for explanation/UI.

## Validation

Before formal System 2 strategy weighting:
- PIT / first-known correctness;
- symbol-session and suspension semantics;
- volume-unit correctness;
- corporate-action continuity;
- prospective Shadow capture;
- coverage-before-performance reporting;
- common-support comparisons;
- independent clean-date clustering;
- regime/industry stratification;
- OOS / holdout validation;
- redundancy and multiple-testing controls;
- transaction-cost/slippage impact for executable timing rules.

## Current status

DESIGN_DRAFT_V0_1 / OWNER REVIEW PENDING.
No thresholds or strategy weights are frozen.
No System 1 Formal behavior is changed.
