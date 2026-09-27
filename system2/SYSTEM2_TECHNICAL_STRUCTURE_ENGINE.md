# System 2 Technical Structure Engine

Updated: 2026-09-27 Asia/Taipei
Status: DESIGN DRAFT V0.1 / RESEARCH-ONLY / THRESHOLDS NOT FROZEN

## Purpose

Define the shared TECHNICAL_STRUCTURE_ENGINE（技術結構引擎） for System 2.

The engine describes market structure and technical context. It does NOT directly emit BUY/SELL decisions. Strategy engines consume these outputs differently.

Shared research evidence is inherited from the K-line / pattern / price-volume / trend-momentum-reversal research lanes. No System 1 Formal Core behavior is changed.

## Design principles

1. Named patterns are explainability labels, not automatic bullish/bearish truth.
2. Geometry/lifecycle/state are more important than pattern names.
3. Pattern state at time t uses only information knowable by time t.
4. Technical indicators are auxiliary/context signals, not standalone BUY/SELL rules.
5. Multiple indicators derived from the same price series must not be double-counted.
6. Price-volume remains a separate engine and interacts with technical structure.
7. Missing, stale or semantically invalid data remains UNKNOWN（未知）.
8. Exact thresholds/lookbacks/weights remain research hypotheses pending PIT（時點正確性）/Shadow（影子模擬）/OOS（樣本外） validation.

## Module layers

### T1 — Trend Structure（趨勢結構）

Core outputs:
- trendState: UPTREND（上升趨勢） / DOWNTREND（下降趨勢） / RANGE（區間） / TRANSITION（轉折中） / UNKNOWN（未知）
- higherHighState（高點墊高狀態）
- higherLowState（低點墊高狀態）
- lowerHighState（高點下移狀態）
- lowerLowState（低點下移狀態）
- ma5/ma10/ma20/ma60/ma120 where available
- maSlope5/10/20/60（均線斜率）
- maAlignment（均線排列）
- maConvergenceDivergence（均線收斂／發散）
- distanceToMA20/60（距20/60日均線乖離）
- trendPersistence（趨勢持續性）
- structuralExtensionState: NORMAL（正常） / EXTENDED（延伸） / EXTREME（極端） / UNKNOWN

### T2 — Structural Levels（結構價位／區域）

Outputs:
- supportZones[]（支撐區）
- resistanceZones[]（壓力區）
- priorHigh20 / priorHigh60 / majorStructuralHigh
- priorLow20 / priorLow60 / majorStructuralLow
- necklineZones[]（頸線區）
- platformZones[]（平台區）
- trappedSupplyZones[]（套牢區）
- gapZones[]（缺口區）
- zoneStrengthMetadata（區域強度描述；不可直接當方向分數）
- zoneLifecycle: BELOW（區域下方） / APPROACH（接近） / FIRST_BREAK（首次突破） / HOLDING_ABOVE（站穩上方） / REENTERED（跌回區域） / FAILED（突破失敗）

Prefer zones over single exact prices when structure is naturally fuzzy.

### T3 — Pattern Topology（型態拓撲／幾何結構）

Pattern families:
- W_BOTTOM（W底／雙底）
- INVERSE_HEAD_SHOULDERS（反頭肩）
- CUP_HANDLE（杯柄）
- ROUNDED_BOTTOM（圓弧底）
- PLATFORM（平台整理）
- VCP（波動收縮型態）
- FLAG（旗形）
- PENNANT（尖旗形）
- TRIANGLE（三角收斂）
- WEDGE（楔形）
- MULTI_PEAK_TROUGH（多重頂底）
- GAP_ISLAND（缺口／島狀反轉）
- SAKATA_SEQUENCE（酒田／多K線序列）

Latent geometry fields should be preferred over binary labels:
- baseDurationDays（底部／整理時間）
- depthPct（型態深度）
- widthCompression（寬度收斂）
- contractionCount（收縮段數）
- contractionDepthPct[]（各段收縮幅度）
- higherLowRatio（低點改善程度）
- rimDiffPct（杯緣差異）
- necklinePrice / necklineZone（頸線）
- handleDepthPct（把手深度）
- poleReturnPct（旗桿漲幅）
- channelSlope（通道斜率）
- boundaryFitError（邊界擬合誤差）
- apexDistance（收斂頂點距離）
- patternOverlapGroup（跨型態共用幾何群組，防重複計分）

### T4 — Pattern Lifecycle（型態生命週期）

Generic states:
- FORMING（形成中）
- STRUCTURE_VALID（結構成立）
- MATURE（成熟）
- PIVOT_READY（接近關鍵突破）
- BREAKOUT_ATTEMPT（嘗試突破）
- BREAKOUT_CONFIRMED（突破確認）
- RETESTING（回測中）
- ACCEPTED（突破被市場接受）
- REENTERED（跌回原結構）
- FAILED（型態失敗）
- EXPIRED（失效／過期）
- AMBIGUOUS（模糊）

Every pattern instance stores:
- patternFamily
- state
- stateAsOf
- pivotAt（極值發生日）
- confirmedAt（結構第一次可被確認的日期）
- referenceLevels
- provisionalLegUsed（是否使用未確認波段）
- noLookaheadVerified（無未來偷看驗證）
- confidence（型態清晰度，不等於上漲機率）
- ambiguity（型態模糊度）

### T5 — Candlestick / Sakata Layer（K線／酒田輔助層）

Contextual signals only:
- realBodyATR（實體相對ATR）
- upperWickRatio（上影比例）
- lowerWickRatio（下影比例）
- closeLocation（收盤位置）
- bodyOverlap（實體重疊）
- engulfingRatio（吞噬比例）
- gapSize（缺口大小）
- sequenceDirectionCount（連續方向根數）
- priorTrendContext（前置趨勢）
- locationVsSupportResistance（相對支撐壓力位置）
- candlestickLabels[]（十字、錘頭、吞噬、晨星、暮星、紅三兵、黑三鴉等；僅說明用）

Single-candle or named-sequence labels must never directly trigger a trade.

### T6 — Technical Indicator Auxiliary Layer（技術指標輔助層）

#### KD / Stochastic Oscillator（KD隨機指標）
Fields:
- kValue
- dValue
- kdCrossState: GOLDEN_CROSS（金叉） / DEATH_CROSS（死叉） / NONE
- kdZone: OVERSOLD（超賣） / NEUTRAL（中性） / OVERBOUGHT（超買）
- kdPersistence（高檔／低檔鈍化持續）
- kdDivergence（KD背離；需演算法定義）

Rules:
- low KD != automatic BUY;
- high KD != automatic SELL;
- high-level persistence may be trend strength in momentum regimes.

#### MACD（指數平滑異同移動平均線）
Fields:
- dif（快慢均線差）
- signal / dea（訊號線）
- histogram（柱狀體）
- macdCrossState（金叉／死叉）
- zeroLineState（零軸上／下）
- difSlope
- histogramSlope
- histogramExpansionState（柱狀體擴張／收斂）
- macdDivergence（MACD背離）

#### RSI（相對強弱指標）
Fields:
- rsiValue
- rsiSlope
- rsiZone（超買／中性／超賣）
- rsiDivergence（RSI背離）
- rsiFailureSwing（RSI失敗擺盪，如定義成熟）

#### ATR（平均真實波幅）
Fields:
- atr
- atrPct
- atrPercentile（自身歷史波動百分位，資料允許時）
- volatilityExpansionState（波動擴張）
- volatilityContractionState（波動收斂）
- stopDistanceContext（停損距離脈絡）
- extensionNormalizedByATR（以ATR標準化的延伸程度）

#### MA / EMA（移動平均線／指數移動平均線）
Fields:
- values
- slope
- alignment
- crossovers
- distance
- compression / expansion
- supportResistanceInteraction

#### DMI / ADX（趨向指標／平均趨向指數）
Fields:
- plusDI
- minusDI
- adx
- diCrossState
- adxSlope
- trendStrengthState

ADX measures trend strength, not direction by itself.

#### Bollinger Bands（布林通道）
Fields:
- middleBand
- upperBand
- lowerBand
- bandWidth
- bandWidthPercentile
- squeezeState（壓縮）
- expansionState（擴張）
- priceLocationInBand
- bandBreakState

Band touch alone is not a reversal signal.

#### ROC / Momentum（變動率／動能指標）
Fields:
- rocN
- momentumSlope
- accelerationState
- decelerationState

Must control redundancy with direct returns, relative strength and existing momentum factors.

#### OBV（能量潮）
Research-only auxiliary PRICE_VOLUME（價量） field:
- obv
- obvSlope
- obvDivergence

Must prove incremental value beyond direct volume/turnover/price-response measures.

### T7 — Volatility / Compression Layer（波動／壓縮層）

Outputs:
- realizedVolatility20/60
- ATR compression/expansion
- rangeCompressionSlope
- trueRangeDryUp
- squeezeDuration
- breakoutRangeExpansion
- volatilityRegimeContext

### T8 — Multi-timeframe Context（多週期脈絡）

Primary roles:
- Weekly（週K）: major trend / long resistance / large base context
- Daily（日K）: selection / principal structure / major setup
- 15-minute（15分K）: strategy-specific intraday confirmation
- 5-minute（5分K）: execution detail / early observation where strategy allows

No universal rule forces every strategy through the same timeframe confirmation.

Outputs:
- weeklyTrendState
- dailyTrendState
- intraday15mState
- intraday5mState
- timeframeAlignmentState: ALIGNED（同向） / MIXED（混合） / CONFLICT（衝突） / UNKNOWN

### T9 — Failure / False-break Layer（失敗／假突破層）

Outputs:
- falseBreakoutState
- undercutReclaimState（跌破後收復）
- springCandidate（假跌破／Spring候選）
- upthrustCandidate（假突破／Upthrust候選）
- breakoutReentrySpeed
- failedBreakWithin3D / 5D (research only, no historical look-ahead in live state)
- limitConstrainedBreakState（漲跌停限制下突破狀態）
- acceptanceState: OBSERVABLE（可觀察） / UNRESOLVED（未解） / ACCEPTED（接受） / FAILED（失敗）

## Cross-engine boundary

TECHNICAL_STRUCTURE_ENGINE（技術結構引擎） describes structure.
PRICE_VOLUME_ENGINE（價量引擎） describes participation/effort/response.
MARKET_REGIME（市場環境） describes top-down context.
STRATEGY_ENGINE（策略引擎） makes strategy-specific decisions.

Example:
- Technical: PLATFORM_BREAKOUT_CONFIRMED（平台突破確認）
- Price-volume: moderate participation + strong close acceptance
- Market: RISK_ON（風險偏好）
- Strategy SHORT_MOMENTUM（短線動能） may promote to NEAR_ENTRY（接近進場）
- FUNDAMENTAL_GROWTH（基本面成長） may use the same structure only as timing context.

## Recommended normalized output object

Per symbol / decision timestamp:
- dataQualityState
- trend
- levels
- activePatterns[]
- candlestickContext
- indicators
- volatility
- timeframeContext
- failureSignals
- patternConfidence
- patternAmbiguity
- provenance
- availableAt
- engineVersion

The engine must not emit BUY/SELL by itself.

## Redundancy firewall

Mandatory future tests:
- KD vs RSI vs short-horizon returns;
- MACD vs MA slope/alignment/trend persistence;
- ADX vs existing trend-quality metrics;
- Bollinger width vs ATR/range-compression/VCP features;
- OBV vs direct price-volume measures;
- named-pattern labels vs latent geometry;
- multiple overlapping named patterns sharing the same pivots.

If incremental information is absent, retain the indicator only for explanation/UI or remove it from scoring.

## Validation

Before strategy weighting:
- PIT/no-lookahead replay;
- prefix invariance;
- source/corporate-action/session semantics;
- prospective Shadow capture;
- date-cluster robustness;
- regime/industry splits;
- multiple-testing control;
- incremental-value / redundancy tests;
- transaction-cost implications where used for timing/execution.

## Current status

DESIGN_DRAFT_V0_1.
Shared pattern research is materially reusable, but Pattern runtime evidence remains NO_GO for shared production wiring until semantic/data gates in the existing K-line research lane clear.
System 2 may continue isolated design and research without modifying System 1.
