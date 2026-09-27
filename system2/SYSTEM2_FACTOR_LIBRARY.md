# System 2 Factor Library

Updated: 2026-09-26
Status: INITIAL INVENTORY / NOT YET WEIGHTED

## Factor groups

### MARKET
TAIEX/TPEx trend, breadth, advance/decline, turnover, large/small leadership, volatility, risk-on/off, sector rotation, foreign futures/flow where validated.

### GLOBAL_MACRO
US/global equities, rates, yield curve, USD, USD/TWD, oil, commodities, geopolitical/event shocks and cross-market transmission.

### INDUSTRY
relative strength, breadth, turnover share, earnings revisions, cycle phase, demand/supply, inventory, capacity, utilization, product pricing, shortages/oversupply, policy and adoption.

### FUNDAMENTAL
monthly revenue MoM/YoY and acceleration, quarterly revenue, EPS, gross/operating/net margins, cash flow, ROE/ROA, leverage, earnings quality, contract-liability trend, and forward changes when PIT-valid.

#### CONTRACT_LIABILITY（合約負債） research factor

Status: OWNER-REQUESTED / RESEARCH_REQUIRED / SOURCE_CONTRACT_NOT_READY.

Rationale:
Contract liabilities represent consideration received or receivable from customers for goods/services the company still owes. For business models with meaningful customer prepayments, project deposits, subscription/deferred-service obligations or advance procurement payments, the trend may provide information about future revenue visibility.

Do **not** treat contract-liability growth as automatic future profit growth.

Candidate raw fields:
- contractLiabilityCurrent（流動合約負債）
- contractLiabilityNonCurrent（非流動合約負債）
- contractLiabilityTotal（合約負債合計）
- availableAt / filingPublishedAt（可用時間／財報發布時間）
- source / taxonomy provenance（來源／會計標籤來源）

Candidate derived features:
- QoQ change（季增率）
- YoY change（年增率）
- 2Q/3Q acceleration（連續季度加速度）
- contractLiabilityTotal / TTM revenue（合約負債／近十二月營收）
- contractLiabilityCurrent / contractLiabilityTotal（流動占比）
- contract-liability growth minus revenue growth（合約負債成長相對營收成長差）
- historical percentile within the same company when PIT-valid（公司自身歷史百分位）
- peer-relative percentile only within comparable business models（可比商業模式同業百分位）

Context / quality guards:
- industry applicability: NOT_APPLICABLE is valid for firms where customer prepayments are immaterial;
- high contract liabilities can reflect low-margin projects and do not guarantee profit;
- changes may be seasonal or caused by contract terms, customer mix, reclassification, M&A, FX or timing;
- examine gross/operating margin, cash flow, customer concentration, cancellation/refund terms and contract assets where available;
- declining contract liabilities are not automatically bearish because prior balances may have converted into recognized revenue;
- raw amount cannot be compared across industries without normalization.

Research interactions to test:
- contract-liability acceleration + revenue acceleration;
- contract-liability acceleration + margin stability/improvement;
- contract-liability acceleration + operating cash-flow support;
- contract-liability acceleration + industry up-cycle;
- contract-liability acceleration + sector-leader status;
- contract-liability deterioration while revenue remains strong as a possible forward-warning interaction.

PIT rule:
Use only the balance-sheet amount and notes that were actually published by the decision timestamp. Do not backfill later restatements into earlier decisions without versioned provenance.

### VALUATION
PE, forward PE, PEG, PB, EV/EBITDA, FCF yield, dividend yield when relevant, historical percentile, peer-relative valuation, valuation vs growth.

### TECHNICAL
MA structure/slope, support/resistance, distance from MA, ATR, KD, MACD, RSI, trend persistence, breakout/pullback, consolidation, chart-pattern topology, Fibonacci confluence as auxiliary evidence.

#### TECHNICAL_STRUCTURE_ENGINE（技術結構引擎） — DESIGN PENDING

System 2 should consume a dedicated technical-structure module rather than scatter pattern logic across strategies.

Planned scope:
- candlestick / Sakata-style signals（K線／酒田型態）;
- W-bottom, inverse head-and-shoulders, cup-and-handle, rounded bottom, flag, triangle, wedge（W底、反頭肩、杯柄、圓弧底、旗形、三角、楔形）;
- volatility contraction / expansion（波動收斂／擴張）;
- support/resistance, prior highs/lows, trapped-supply zones（支撐壓力、前高前低、套牢區）;
- MA structure, slope, convergence/divergence and distance（均線結構、斜率、收斂發散、乖離）;
- Fibonacci confluence（費波那契共振） as auxiliary evidence only;
- pattern lifecycle: FORMING（形成中）, CONFIRMED（確認）, FAILED（失敗）, EXPIRED（失效／過期）;
- multi-timeframe context（日K／週K／盤中K）;
- false-break and ambiguity semantics（假突破與模糊型態）.

Patterns are not universally bullish/bearish. Meaning must depend on location, trend, volume, market/industry regime and strategy context.

### PRICE_VOLUME
price-up/volume-up, price-up/volume-down, price-down/volume-up, price-down/volume-down, breakout volume, pullback volume contraction, climax volume, low-base accumulation, relative volume 5/20/60, turnover, volume persistence, divergence.

### CHIP_OWNERSHIP
foreign/trust/dealer flow, consecutive buying/selling, flow as % turnover, TDCC 400+ and 1000+ brackets, retail holder ratio/count, concentration changes, financing/margin short/SBL/crowding.

### CAPITAL_FLOW
stock/sector traded value share, capital-flow persistence, concentration, flow acceleration, diffusion/breadth and leadership changes.

### EVENT_CATALYST
material news, new product/capacity/customer certification/orders, shortages, price hikes/cuts, regulation/policy, M&A/corporate actions and event half-life.

### SUPPLY_CHAIN
raw-material dependencies, bottlenecks, substitution, upstream/downstream beneficiary-victim graphs, capacity additions, inventory turns and price-cycle transition.

## Interaction layer

Important combinations must be tested as explicit interactions rather than naive additive scores, e.g.:
- institutional accumulation + 1000+ holders rising + retail falling + price not yet extended;
- breakout + relative volume + sector inflow + supportive market regime;
- high valuation + earnings acceleration + estimate revisions;
- commodity shock + cost pass-through ability + industry pricing power.

## Research rule

No factor receives permanent positive/negative meaning before its context, failure modes and redundancy are tested.
