# System 2 Initial Strategy Preregistry

Updated: 2026-09-26
Status: PRE-REGISTERED HYPOTHESES / NOT LIVE

Purpose: freeze initial hypotheses before outcome data is used to tune weights.

## S2-SM-001 — SHORT_MOMENTUM_V0

### Hypothesis
Short-horizon opportunities are better identified when technical/price-volume strength is supported by market breadth, sector capital activity and chip confirmation, while fundamentals/valuation act mainly as extreme-risk filters.

### Initial factor priority
1. market regime / breadth / capital activity
2. technical trend & breakout/pullback structure
3. price-volume confirmation
4. institutional/chip activity
5. industry momentum
6. event catalyst
7. fundamentals/valuation risk filters

### Initial exclusions
- illiquid/abnormal trading;
- severely stale or missing data;
- obvious late-stage blow-off / extreme extension;
- unresolved material negative event where source timing is valid.

### Primary horizons
D+1, D+3, D+5, D+10.
Also measure MFE/MAE and trigger conversion.

### Falsification
Reject/reshape if performance disappears after costs, is concentrated in a few dates/sectors, or factor contribution is redundant with simple relative-strength/volume baselines.

---

## S2-SG-001 — SWING_GROWTH_V0

### Hypothesis
Weeks-to-months opportunities require future earnings/industry upside and catalysts, with valuation and market/chip confirmation controlling overpayment/timing risk.

### Initial factor priority
1. industry future/cycle
2. fundamental growth/acceleration
3. catalyst / expectation revision
4. valuation vs growth
5. institutional/ownership trend
6. technical/price-volume timing
7. market regime

### Primary horizons
D+5, D+10, D+20 and later 40/60 sessions when data accumulates.

### Falsification
Reject/reshape if apparent alpha is explained by generic momentum, if high-growth names fail after valuation/cost controls, or if results depend on hindsight-biased forward information.

---

## S2-IA-001 — INSTITUTIONAL_ACCUMULATION_V0

### Hypothesis
Persistent institutional accumulation combined with improving holder concentration and limited price extension can identify under-recognized positioning before a larger move.

### Candidate signals to test
- trust/foreign persistent net buying;
- buy amount relative to turnover;
- 400+/1000+ TDCC holder share rising;
- retail holder share/count falling where measurable;
- higher lows / controlled volatility;
- volume accumulation without blow-off;
- stock return not yet excessively extended;
- sector/fundamental/catalyst support.

### Primary horizons
D+5, D+10, D+20.

### Negative-control cases
- institutions buying while 1000+ concentration falls;
- institutional buying after large prior price extension;
- buying in weakening sector/breadth;
- accumulation followed by poor price response.

### Falsification
Reject/reshape if simple institution-buying alone performs equally well, if TDCC weekly lag destroys timeliness, or if results are concentrated in a small number of names/dates.

---

## Future split candidate

BLACK_HORSE_ACCUMULATION will remain conceptually separate but is not preregistered as a fourth strategy until IA-001 evidence shows whether "black horse" is statistically distinct from institutional accumulation rather than a narrative duplicate.

## Common controls

All three strategies require:
- PIT-valid inputs;
- frozen daily decisions;
- no retroactive editing;
- equalized/comparable simulated capital;
- realistic Taiwan fees/tax/slippage;
- purged/OOS validation;
- independent-date clustering;
- factor redundancy tests;
- zero-pick and capital-utilization reporting.
