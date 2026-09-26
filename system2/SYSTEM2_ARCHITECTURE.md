# System 2 Architecture

Updated: 2026-09-26
Status: DESIGN V0.1

## Separation

System 2 shares research knowledge and selected data infrastructure with System 1 but owns its strategy/scoring/performance state.

No System 2 code may silently change V8 Formal Core.

## Logical layers

### L0 Market / Global Regime
Taiwan index, TPEx, breadth, turnover, large-vs-small leadership, global equities, rates, FX, USD/TWD, oil/commodities, volatility, risk-on/off, sector rotation.

### L1 Industry / Supply-Demand Regime
Demand, supply, inventory, capacity, utilization, pricing, shortages, expansions, substitutions, policy, customer adoption and cycle phase.

### L2 Company Fundamentals / Valuation
Revenue, EPS, margins, cash flow, ROE/ROA, growth acceleration/deceleration, PE/forward PE/PEG/PB/EV-EBITDA/FCF-yield where appropriate, own-history percentile and peer-relative valuation.

### L3 Technical / Price-Volume Structure
Trend, moving averages, slope, support/resistance, distance/extension, KD, MACD, RSI, ATR, Fibonacci confluence, breakout/pullback, triangle/flag/cup/W-bottom/other validated structures, price-volume state and divergence.

### L4 Chips / Ownership / Capital Flow
Foreign/investment-trust/dealer, financing/short/SBL, TDCC holder brackets including 400+ and 1000+ share groups, retail share/count where available, concentration trend, turnover, sector/stock capital flow.

### L5 News / Event / Catalyst
Material news, product, capacity, customer validation, price hikes, shortages, policy and external shocks. Every event has evidence timestamp, mechanism, beneficiary/victim map, confidence and half-life/expiry.

### L6 Strategy Engine
Each strategy defines:
- required factors;
- weights;
- minimum floors;
- hard exclusions;
- regime activation/deactivation;
- confluence bonuses/penalties;
- valid holding horizon;
- entry/exit logic;
- strategy version.

### L7 Decision/Timing State
Candidate, watch, entry-zone, trigger, hold, reduce/exit, thesis weakening/invalidated. This is separate from System 1's live state machine.

### L8 Performance/Research
Frozen decision snapshots, simulated fills, costs/slippage, outcomes, attribution, OOS and version comparison.

## Key principle: context-dependent interpretation

A factor cannot be interpreted without context. Examples:
- price up + volume up after low-base breakout may be positive;
- price up + extreme blow-off volume after an extended run may be negative;
- volume contraction during a healthy pullback can be positive;
- high PE can be justified by strong forward growth in a growth strategy but penalized heavily in a value strategy.

## Event horizon

Classify each event:
- INTRADAY/VERY_SHORT
- SHORT (days/weeks)
- SWING (weeks/months)
- STRUCTURAL (quarters/years)

Event scores decay or expire. A one-time shock must not become a permanent trend score.

## Data contract principle

Every factor value should support:
- symbol
- marketDate
- observedAt
- availableAt
- source
- rawValue
- normalizedValue
- confidence
- unknownReason
- factorVersion

Historical backfills may not use information unavailable at the decision timestamp.
