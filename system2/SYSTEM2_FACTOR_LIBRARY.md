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
monthly revenue MoM/YoY and acceleration, quarterly revenue, EPS, gross/operating/net margins, cash flow, ROE/ROA, leverage, earnings quality and forward changes when PIT-valid.

### VALUATION
PE, forward PE, PEG, PB, EV/EBITDA, FCF yield, dividend yield when relevant, historical percentile, peer-relative valuation, valuation vs growth.

### TECHNICAL
MA structure/slope, support/resistance, distance from MA, ATR, KD, MACD, RSI, trend persistence, breakout/pullback, consolidation, chart-pattern topology, Fibonacci confluence as auxiliary evidence.

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
