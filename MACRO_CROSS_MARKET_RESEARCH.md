# Macro / Cross-Market Regime Transmission Research

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## MC-001 — scope
Global moves are not stock-selection alpha by themselves. The question is whether information known before Taiwan's after-market scan changes the next-session environment or the reliability of existing A/B selections after Taiwan market/sector controls.

## MC-002 — clock separation
For a Taiwan after-market scan on date t:
- same-day Taiwan close is known;
- prior U.S./Europe close is known;
- same-day Japan/Korea close is generally known;
- U.S. session after Taiwan close is NOT known yet and cannot enter the t after-market selection feature;
- Taiwan night futures after scan are future information for the t scan, though potentially useful for later intraday risk monitoring.

Every cross-market feature needs source market, session date, timezone, knownAt and firstEligibleTaiwanDecision.

## MC-003 — avoid duplicate global beta
Candidate families:
- prior-session U.S. index return;
- semiconductor/technology relative move;
- Japan/Korea equity move;
- USD/TWD or DXY context;
- oil/rates where mechanism is relevant;
- residual Taiwan sensitivity after common global factor.

Validation order:
Taiwan market return/regime -> sector/residual RS -> breadth/liquidity -> global candidate.
If global candidate only restates Taiwan same-day move, mark REDUNDANT.

## MC-004 — transmission is sector-conditional
A global semiconductor shock may matter more for electronics than domestic financial/consumer names. Oil/rates likewise have heterogeneous exposure.

Pre-register sector interaction before outcomes. Do not apply one global risk score uniformly to every stock.

## MC-005 — scheduled macro vs realized surprise
Separate:
- scheduled event presence known before scan;
- consensus/expectation if PIT provenance exists;
- realized release only after actual publication time;
- market reaction after publication.

Never use the realized CPI/Fed/NFP surprise before its release clock. Event calendars alone do not encode direction.

## MC-006 — falsification
Mandatory:
- date-shift placebo;
- Taiwan-market-only baseline;
- sector-control baseline;
- remove largest global shock dates;
- independent-date aggregation;
- timezone/holiday mismatch audit;
- compare raw global return with residual/global-relative feature;
- check whether effect is only gap prediction and disappears by close.

## MC-007 — optimization bridge
A possible Formal optimization is not a blanket global risk veto.
Only if a PIT global state robustly changes A/B selection downside/continuation after Taiwan/sector controls, across independent dates and non-crisis periods, can it become a context/tie-break/risk candidate.

Current status: FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.


## MC-008 — weekend/holiday alignment is a first-class data problem

Calendar-day lag is not trading-session lag. For every foreign market observation, map:
foreignSessionClose -> knownAtTaipei -> first eligible Taiwan scan/session.

If the foreign market was closed, do not forward-fill and call it a new signal. Preserve STALE_NO_NEW_SESSION. If Taiwan was closed, the accumulated foreign information window must be explicitly defined rather than silently using one calendar day.

## MC-009 — gap versus full-session target

Global information may be incorporated primarily at the Taiwan open.

Therefore split:
- next-open gap;
- open-to-close return;
- close-to-close return;
- MAE/MFE.

A feature that predicts the gap but has no open-to-close persistence may be useful for execution/risk context but not for after-market stock ranking.

## MC-010 — residualization protects against false stock alpha

For stock-level tests, first remove:
- Taiwan market move;
- sector move;
- pre-existing stock beta/RS context where available.

Then ask whether global state changes residual outcome or selection hit rate.

Otherwise a U.S. tech rally followed by Taiwan electronics strength can be falsely counted as stock-picking alpha when it is common beta.

## MC-011 — first data gate

Before outcome tests, audit whether existing Global Radar evidence is durably stored with session/date/knownAt provenance. Notification text alone is not a research dataset.

If historical/prospective receipts are absent, mark DATA_QUALITY_BLOCKED and define a prospective Class-A receipt schema rather than reconstructing global states from current web data.

Minimal receipt:
sourceMarket, instrument, sessionDate, close/value, currency/unit, source, capturedAt, knownAtTaipei, firstEligibleTaiwanDecision, staleFlag, revisionStatus.

No historical Shadow fabrication.


## MC-012 — repository provenance audit: historical global receipts are not proven

Bounded repository search for Global Radar, DXY, NASDAQ and sessionDate/knownAt found research/notification references but no durable historical global-market observation table/receipt whose rows independently prove source sessionDate, capturedAt/knownAtTaipei and firstEligibleTaiwanDecision.

This is a provenance result, not a claim that no global data ever existed outside the repository. Existing notification text must not be reverse-engineered into historical features.

Status: HISTORICAL_GLOBAL_RECEIPT = DATA_QUALITY_BLOCKED / UNKNOWN.

## MC-013 — prospective global receipt contract

A research-only prospective receipt may contain:
- receiptId
- sourceMarket
- instrumentId / instrumentType
- sourceSessionDate
- sourceTimezone
- observedCloseOrValue
- unit / currency
- sourceId / sourceUrl
- sourcePublishedAt when applicable
- capturedAt
- knownAtTaipei
- firstEligibleTaiwanDecision
- staleFlag
- staleReason
- revisionStatus
- sourceQuality
- pointInTimeEligible
- missingReason

Calendar/session mapping is explicit. A receipt is not PIT-eligible merely because it was fetched before an outcome test.

## MC-014 — synthetic timezone/holiday falsification matrix

Required tests before outcome use:
1. prior U.S. close before Taiwan scan => eligible;
2. U.S. session that occurs after Taiwan scan => FUTURE / ineligible;
3. Japan/Korea same-day close captured before scan => eligible;
4. foreign holiday => STALE_NO_NEW_SESSION, not a fresh zero-return observation;
5. Taiwan holiday with multiple intervening foreign sessions => ACCUMULATED_WINDOW_REQUIRED, not silent one-day forward fill;
6. macro release after Taiwan scan => future for that scan;
7. revised macro value => original vintage retained; revision cannot overwrite historical knownAt;
8. capture failure => UNKNOWN, not neutral/zero;
9. DST/session-time shift => use source exchange session/timezone, not fixed UTC assumptions;
10. source disagreement => preserve both/provenance or UNKNOWN; do not choose the ex-post convenient value.

## MC-015 — implementation classification

A standalone research receipt writer/storage isolated from Formal selection is Class A only if it does not change shared runtime paths/scheduling/storage relied on by Formal. If durable capture requires shared Cron, shared D1 schema, common fetch routing or production scheduling, it becomes Class B proposal-first.

No historical backfill from current web values is authorized. No outcome lookup is needed to establish this data gate.

Optimization status remains FALSIFICATION_IN_PROGRESS / DATA_QUALITY_BLOCKED / NOT_OPTIMIZATION_READY. A future global context candidate must still prove incremental value beyond Taiwan market, sector, RS/beta and regime controls and survive non-crisis/date-cluster tests.


## MC-016 — current Formal runtime has no global-market state

Fresh repository/runtime patch-chain audit confirms:
- current after-market selection has no explicit NASDAQ / S&P / Dow / SOX / Nikkei / KOSPI / DXY / USD-TWD / WTI / Brent feature family;
- V7.5.30 `marketConsensus` is NOT a macro/global market factor. It is a manually supplied per-symbol independent-source consensus overlay that can add at most +7 priority points after hard eligibility.

Therefore:
`GLOBAL_MARKET_STATE_IN_FORMAL_SELECTOR = ABSENT`.

Global Radar / notification activity, where it exists outside this repository, is not equivalent to a durable PIT research dataset and must not be reverse-engineered into one.

## MC-017 — after-market timing changes what “global lead” can mean

For the 18:10 Taiwan after-market decision clock:

### Prior U.S. cash close
The prior U.S. regular cash close is known before Taiwan opens.
Taiwan's opening auction and full 09:00-13:30 session then have hours to react before the after-market selector runs.

Therefore prior U.S. broad/tech return is primarily:
- an overnight/opening explanatory input;
- a common-beta control;
- a possible divergence/underreaction context.

It is NOT automatically a fresh 18:10 directional lead.

The first falsification must control:
- Taiwan opening gap;
- Taiwan full-session return;
- sector return / Residual RS;
- breadth/regime.

If the U.S. return adds nothing after Taiwan has already reacted, mark it REDUNDANT for after-market ranking.

### Next U.S. cash session
The U.S. regular cash session that starts after the Taiwan 18:10 scan is FUTURE for that selection decision and may not be used.

U.S. futures trading at 18:10 would be a separate derivatives/global receipt with its own source/clock; it must not be mislabeled as the U.S. cash-index close.

## MC-018 — Japan/Korea daily close is a mixed-window variable

TWSE regular trading closes 13:30 Taipei.

Current official exchange hours:
- Japan cash equities trade to 15:30 JST = 14:30 Taipei;
- Korea cash equities trade to 15:30 KST = 14:30 Taipei.

Therefore a same-date Nikkei/KOSPI close-to-close return contains:
- a large interval that overlaps the Taiwan trading session;
- about one final hour after the Taiwan regular close.

Using the whole daily return as a “post-Taiwan-close lead” is semantically contaminated.

Required labels:
- `ASIA_DAILY_MIXED_WINDOW` for daily JP/KR close-to-close data;
- `POST_TAIWAN_CLOSE_CLEAN` only if an intraday anchor at Taiwan 13:30 (Japan/Korea 14:30 local) and their 15:30 local close are both observed.

No daily-series backfill may pretend to contain that post-close subwindow.

## MC-019 — cross-market absorption is higher-value than raw return direction

Taiwan evidence supports strong overseas information transmission into Taiwan's overnight/opening process, especially for technology-linked information.

This makes the central after-market research question:

**Given a global shock was already known before Taiwan opened, did Taiwan/its relevant sector fully absorb, underreact to, or overreact to that shock by the close?**

Do NOT freeze a bullish/bearish rule yet.

First raw state should preserve:
- prior U.S. broad return;
- prior U.S. technology/semiconductor return;
- Taiwan open gap;
- Taiwan close-to-close return;
- Taiwan relevant-sector return / Residual RS;
- source/session/clock provenance.

Only after enough history exists may a pre-registered residual/absorption model estimate expected Taiwan response.
Do not choose beta/window length from outcome performance.

Possible research outcomes:
- continuation;
- next-open gap;
- open-to-close;
- D1/D3/D5;
- MAE/MFE.

A raw global return that predicts only Taiwan's already-observed same-day gap is not incremental after-market alpha.

## MC-020 — Taiwan-specific evidence supports sector-conditional transmission

Durable evidence:
- Taiwan overnight/intraday research emphasizes that information arriving while Taiwan is closed is incorporated at the next opening.
- A Taiwan/U.S. high-technology supply-chain study reports return spillovers from major U.S. technology firms to Taiwanese suppliers, electronics indices and the Taiwan market.
- Recent Taiwan illiquidity research warns that U.S. market information, particularly NASDAQ/Philadelphia Semiconductor context, can materially affect Taiwan overnight returns/opening prices.

These findings support:
- broad U.S. market as common-risk control;
- technology/semiconductor channel as a sector-specific candidate.

They do NOT justify a universal U.S.-up => Taiwan-stock-up score.

## MC-021 — USD/TWD official source gate materially resolved

The Central Bank of the Republic of China publishes the NT$/US$ interbank closing rate, sourced from Taipei Forex Inc., each business day approximately 16:00-17:00 Taipei.

For an 18:10 after-market decision:
`CBC_NTDUSD_SAME_DAY_CLOSE_SOURCE = MATERIAL_PASS_FOR_PROSPECTIVE_CAPTURE`.

Minimum provenance:
- source date;
- NTD per USD;
- source = CBC / Taipei Forex;
- capturedAt;
- firstEligibleTaiwanDecision;
- missing/stale state.

Interpretation guard:
an increase in NTD/USD = NTD depreciation; sign must be explicit.

A 2026 Taiwan study reports asymmetric/time-varying stock-FX dependence, reinforcing that FX should be a regime/context variable rather than a universal linear score.

### FRED distinction
FRED DEXTAUS is useful for historical/cross-check research but its H.10 daily observations are published in a weekly update and use New York noon buying rates.
It is not the preferred same-day 18:10 PIT production source.

## MC-022 — source hierarchy for Phase-1 global capture

Do not wait to source every macro series before research can begin.

### Phase 1A — highest-value / clock-clean
1. prior U.S. broad equity close;
2. prior U.S. technology/semiconductor close;
3. CBC same-day NTD/USD official close;
4. Taiwan market/sector response already available in-system.

### Phase 1B — useful but mixed-window
5. Japan daily close;
6. Korea daily close.

Their daily values remain `ASIA_DAILY_MIXED_WINDOW` unless the post-Taiwan-close subwindow is captured separately.

### Phase 2 — slower / specialized
- oil/commodities;
- DXY;
- rates/yield curve;
- scheduled macro releases;
- European session at 18:10;
- U.S. futures contemporaneous to Taiwan after-market.

These should enter only after exact source, publication/session clock and economic mechanism are frozen.

Global Radar may still display a wider information set; research eligibility is stricter than display coverage.

## MC-023 — public source feasibility nuance

FRED provides daily close series for S&P 500 and NASDAQ Composite, sourced from S&P Dow Jones Indices and Nasdaq respectively, and is useful for historical/prospective prior-U.S.-session research where its publication latency is safely before the Taiwan decision.

However:
- S&P daily history availability/licensing terms differ from Nasdaq;
- FRED is not automatically the best production source for every global instrument;
- SOX, Japan/Korea, DXY and oil still require explicit source/terms/clock selection if used live.

Therefore:
`US_BROAD_PRIOR_SESSION_SOURCE = FEASIBLE_BUT_PROVIDER_CONTRACT_NOT_FROZEN`;
`US_TECH_SEMICON_SOURCE = SOURCE_SELECTION_PARTIAL`.

Do not mix providers silently across history without source-version metadata.

## MC-024 — exact falsification matrix for global absorption

Pre-register before outcomes:

A. **US broad only**
- Does prior U.S. broad return add anything beyond Taiwan same-day market return/regime?
- Expected null is acceptable; redundancy is a valid result.

B. **US technology / semiconductor**
- Test only after broad U.S. and Taiwan market controls.
- Then add Taiwan sector return / Residual RS.
- If effect disappears, classify it as sector beta, not stock alpha.

C. **FX**
- Test NTD/USD level/change and shock separately.
- Condition exporter/importer/financial sector where economically justified.
- If only whole-market beta remains, keep it as market context.

D. **Japan/Korea**
- Daily close first treated as mixed-window control.
- Do not claim post-close leadership unless the 13:30-Taipei-to-close subwindow is isolated.

E. **Crisis removal**
- remove largest global shock dates;
- leave-one-date-out;
- separate normal versus crisis regimes.

F. **Outcome decomposition**
- next open gap;
- open-to-close;
- close-to-close;
- D3/D5;
- MFE/MAE.

G. **Date-shift placebo**
- one-session shifted foreign return must not retain the same “predictive” pattern unless an economically valid lag mechanism exists.

No global score, veto, bonus or threshold is authorized.

## MC-025 — engineering boundary

The correct next engineering object is a **global observation receipt**, not a global score.

If a standalone research fetch/storage path can be added without:
- changing Formal selection;
- altering shared scheduled jobs relied upon by Formal;
- changing source-call budgets that Formal depends on;
- changing monitoring/push behavior,

it may be Class A.

If it needs shared production cron/scheduling, common fetch routing, or shared schema paths that Formal relies on, it is Class B proposal-first.

Current state:
`CONCEPT_FALSIFICATION_MATURE / USD_TWD_SOURCE_MATERIAL_PASS / US_SOURCE_PARTIAL / ASIA_DAILY_MIXED_WINDOW / PROSPECTIVE_RECEIPT_NOT_IMPLEMENTED / NOT_OPTIMIZATION_READY`.


---

## MC-026 — D13-06 reopened: a Treasury yield is not one economic factor

D13-06 remained L1. The first correction is to reject the shortcut:

`10Y yield up = tech down`.

A nominal Treasury yield mixes multiple economic channels. Federal Reserve term-structure work decomposes longer yields into:
- expected average future short rates; and
- a term premium (期限溢酬), defined as the yield minus the expected average short rate over the bond's life.

The Federal Reserve also publishes nominal and TIPS (通膨保值債券) yield-curve research and derived inflation-compensation concepts.

### Research state must therefore separate

1. **Policy-path / front-end**
   - 2Y nominal yield / change;
   - short-end curve changes.

2. **Long nominal discount rate**
   - 10Y / 30Y nominal yield / change.

3. **Real-rate channel**
   - 5Y/10Y real Treasury yield where PIT source/version is valid.

4. **Inflation-compensation channel**
   - nominal-minus-real proxy only with matched maturity/source semantics.

5. **Curve shape**
   - 2s10s = 10Y - 2Y;
   - 3m10y where useful;
   - level and slope changes separately.

6. **Term-premium research layer**
   - model estimate only;
   - never treated as an official observed market quote.

A single raw yield therefore cannot be assigned one universal risk-on/risk-off sign.

Status: YIELD-DECOMPOSITION SEMANTICS FROZEN.

---

## MC-027 — 18:10 Taiwan decision clock creates a hard PIT boundary for U.S. official yields

The U.S. Treasury states its official par yield curve uses indicative bid-side quotations obtained by the Federal Reserve Bank of New York at or near **15:30 U.S. Eastern Time** each trading day.

The Federal Reserve H.15 (Selected Interest Rates) release is posted Monday-Friday at **16:15 U.S. Eastern Time**.

For the Taiwan after-market selector at 18:10 Taipei:
- 18:10 Taipei is morning in New York;
- the same U.S. calendar day's 15:30 Treasury input snapshot has not happened yet;
- the same U.S. calendar day's H.15 release has not happened yet.

Therefore:

`US_SAME_CALENDAR_DAY_OFFICIAL_CMT_AT_TAIWAN_1810 = FUTURE_INFORMATION`.

The default PIT-safe official daily input is:
- the most recent U.S. trading-day official curve that was already published before the Taiwan decision.

### Important separation

If a live U.S. Treasury future or intraday cash-yield quote is observed at Taiwan 18:10, it is a separate contemporaneous market-data object:
- different source;
- different timestamp;
- different microstructure;
- different historical availability/licensing.

It must not be silently substituted into the official daily CMT series.

Status: UST-DECISION-CLOCK BOUNDARY FROZEN.

---

## MC-028 — yield-curve direction needs four states, not one slope sign

A curve can steepen or flatten for very different reasons.

Minimum state decomposition:

### Bull steepening
- front-end yields fall more than long-end yields.
Possible mechanisms:
- easier policy expectations;
- recession/risk-off policy repricing.
Not automatically bullish equities.

### Bear steepening
- long-end yields rise more than front-end yields.
Possible mechanisms:
- stronger growth;
- inflation risk;
- fiscal/term-premium/supply pressure.
Potentially adverse for long-duration valuation even if growth expectations improve.

### Bull flattening
- long-end falls more than front-end.
Possible mechanisms:
- long-run inflation/growth expectations fall;
- duration demand rises.

### Bear flattening
- front-end rises more than long-end.
Possible mechanisms:
- tighter near-term policy expectations.

### Research rule

Store:
- delta2Y;
- delta10Y;
- delta30Y;
- delta2s10s;
- delta3m10y where source-compatible;
- curveMoveType = BULL_STEEPENER / BEAR_STEEPENER / BULL_FLATTENER / BEAR_FLATTENER / MIXED.

Do not infer the macro story from the label alone. The label is a price-state description; causality needs event/context evidence.

Status: CURVE-MOVE TAXONOMY FROZEN.

---

## MC-029 — term premium is useful research context but has revision risk

Federal Reserve term-structure models can estimate expected short rates and term premiums, but the Board explicitly labels these yield-curve models as staff research products rather than official statistical releases and notes they may be delayed, revised or methodologically changed.

Therefore:
- current/latest term-premium history cannot automatically be assumed to equal what was known historically;
- any backtest needs vintage or capturedAt semantics;
- if historical vintages are unavailable, term premium remains a descriptive/research-control layer, not PIT-eligible alpha.

This is especially important because real-time decompositions can materially differ from standard ex-post decompositions.

Status: TERM-PREMIUM VINTAGE GUARD FROZEN.

---

## MC-030 — Taiwan transmission should be sector-conditioned and absorption-based

Possible Taiwan channels:

### Technology / long-duration growth
Higher real discount rates may pressure long-duration valuation, but the effect can be dominated by:
- U.S. semiconductor earnings/news;
- Taiwan sector RS;
- growth expectations;
- USD/TWD;
- existing price positioning.

### Financials
Yield-curve changes can affect margin expectations, but bank/insurer sensitivity differs and cannot be represented by one market-wide sign.

### Exporters
Rate moves can transmit through:
- USD;
- risk appetite;
- global demand expectations;
rather than directly from the yield itself.

### Correct after-market question

Because the prior U.S. official yield move is already known before Taiwan opens, by 18:10 the higher-value test is:

**After Taiwan market/sector/FX has already reacted, does the residual U.S. rate/curve state change the next-session continuation, gap or downside risk?**

This follows the same absorption logic as MC-019.

Status: SECTOR-CONDITIONAL TRANSMISSION FROZEN.

---

## MC-031 — D13-06 falsification matrix and maturity decision

### Baseline sequence

Test incremental value only after:
1. Taiwan same-day market return / Regime;
2. Taiwan sector return / Residual RS;
3. prior U.S. broad and technology/semiconductor move;
4. USD/TWD context;
5. then U.S. yield/curve candidate.

### Candidate features
- prior-US-session 2Y change;
- prior-US-session 10Y change;
- prior-US-session 10Y real-yield change where PIT-valid;
- 2s10s level/change;
- curveMoveType;
- large rate-shock percentile using a frozen trailing window.

### Falsification
- date-shift placebo;
- remove FOMC/CPI/NFP extreme dates and test normal dates separately;
- event days as their own Regime;
- gap versus open-to-close decomposition;
- technology versus non-technology sector interaction;
- control DXY/USD-TWD;
- compare nominal 10Y against real-yield and curve decomposition;
- test whether one crisis window drives the result;
- no threshold/window tuning from realized stock outcomes.

### Primary targets
- next-open gap;
- next-session MAE / realized range;
- D1/D3 continuation/reversal;
- System 1 / System 2 selection hit-rate conditional on sector and market state.

### Maturity decision
D13-06 advances **L1 -> L2**:
- mechanism decomposed;
- official-source decision clock established;
- causal ambiguity and revision guards established;
- falsification design frozen.

It does **not** advance to L3 because a durable prospective receipt with knownAt / firstEligibleTaiwanDecision has not yet been implemented.

Formal Core remains LOCKED. No “yield up/down” score, veto or stock-ranking bonus is approved.

## Exact next continuation after MC-031

1. Add prior-U.S-session official nominal/real yield receipt design to the Phase-2 macro source contract, preserving source date, capturedAt and firstEligibleTaiwanDecision.
2. Continue D13-07 Oil from L1 -> L2, explicitly separating demand shock, supply shock and geopolitical risk rather than assigning oil one fixed equity sign.
3. Continue D13-09 CPI/PPI/NFP/unemployment and D13-11 Macro Surprise clocks only after vintage/consensus provenance is frozen.


---

## MC-032 — D13-07 reopened: an oil-price move is endogenous, not one macro signal

D13-07 remained L1. The first falsification is conceptual:

`oil up = risk-off` is not a valid universal rule.

Kilian (2009) separates oil-market movements into economically different shocks, including:
- crude-oil supply shocks;
- global aggregate-demand shocks for industrial commodities;
- oil-market-specific precautionary-demand shocks.

Kilian & Park (2009) show U.S. stock-market responses differ materially depending on what drives the oil-price change. This explains why simple regressions of stock returns on raw oil-price changes can be unstable.

For Taiwan, a 2024 study using demand/supply decomposition likewise finds sector effects rather than one market-wide sign and reports adverse effects of oil-price increases on semiconductors/TSMC in its sample.

Therefore the first System 1 / System 2 object is not “oil bullish/bearish.” It is:
- oil-price state;
- oil-volatility state;
- curve/tightness state;
- shock-context state;
- sector exposure state.

Status: RAW-OIL-SIGN RULE REJECTED.

---

## MC-033 — structural oil shocks and real-time trading features are different objects

Academic structural decompositions often use monthly/global datasets and model restrictions. They are valuable for mechanism research but cannot be silently relabeled as a real-time 18:10 shock classifier.

At 18:10 Taipei, a production-quality feature may observe:
- a live WTI/Brent futures price;
- a live term spread if both contracts are available;
- same-window global equity / FX / commodity context;
- already-published event information.

It generally cannot observe:
- the ex-post structural VAR identification of “true aggregate demand shock”;
- future inventory reports;
- future event outcomes;
- revised macro data.

Naming rule:
- `STRUCTURAL_OIL_SUPPLY_SHOCK` only when produced by a frozen research model with valid historical inputs and timing;
- real-time combinations of prices are named `OIL_MOVE_CONTEXT`, not causal shock labels.

Status: CAUSAL-LABEL FIREWALL FROZEN.

---

## MC-034 — 18:10 source clock: live futures can be eligible; daily closes/settlements may not be

At 18:10 Taipei:
- CME WTI futures trade nearly around the clock;
- ICE Brent futures are also open during this window;
- TAIFEX Brent Crude Oil Futures (BRF) trade 15:00 -> 05:00.

Thus a timestamped live/near-live futures observation captured before 18:10 can be PIT-eligible.

But:
- the U.S. trading day's later official/final settlement is future information;
- the full TAIFEX BRF night-session OHLC/close is future information;
- EIA spot-price tables are authoritative historical references but are not a contemporaneous 18:10 market quote.

### BRF special guard

TAIFEX BRF is quoted in TWD and ultimately references ICE Brent plus USD/TWD for final settlement mechanics. A raw BRF move can therefore contain:
- Brent move;
- TWD/USD move;
- local basis/liquidity.

It must not be treated as a pure global crude-oil return without FX/basis checks.

Status: OIL SOURCE-CLOCK CONTRACT FROZEN.

---

## MC-035 — front-month futures need roll and curve semantics

Raw front-month oil futures have contract-roll contamination.

Required metadata:
- exchange;
- contractMonth;
- daysToExpiry;
- rollFlag;
- frontPrice;
- nextPrice;
- frontNextSpread;
- sourceTimestamp;
- sourceTimezone.

Candidate features:
- same-contract return;
- front/next calendar spread;
- spread change;
- curveState = BACKWARDATION / CONTANGO / NEAR_FLAT;
- oil realized/intraday volatility;
- jump magnitude.

Do not splice two different contracts and call the roll jump an oil shock.

The curve itself is not a pure supply indicator:
- storage/carry;
- inventory tightness;
- convenience yield;
- event risk;
- financing
can all contribute.

Status: ROLL/CURVE GUARD FROZEN.

---

## MC-036 — real-time oil context taxonomy without pretending causality

A practical research-only taxonomy may describe co-movement, not causal truth.

### A. GROWTH_COMPATIBLE_OIL_UP
Observed pattern:
- oil up;
- broad/cyclical risk assets not deteriorating;
- industrial-demand proxies not weakening.

Interpretation hypothesis:
- global demand/growth may be contributing.

### B. ADVERSE_OIL_UP
Observed pattern:
- oil up sharply;
- equities/risk appetite deteriorate and/or inflation/rates stress rises;
- known supply/geopolitical event may exist.

Interpretation hypothesis:
- supply/geopolitical/precautionary stress may dominate.

### C. DEMAND_DESTRUCTION_OIL_DOWN
Observed pattern:
- oil down;
- global equities/industrial-demand proxies also weaken.

Interpretation hypothesis:
- weaker demand/growth concern.

### D. BENIGN_SUPPLY_OIL_DOWN
Observed pattern:
- oil down while broad risk assets hold/improve.

Interpretation hypothesis:
- supply relief / disinflation may dominate.

### Firewall
These labels are **contextual observational states**, not structurally identified shocks.

If the same oil return produces different equity outcomes under different contexts, that is expected and supports the taxonomy rather than invalidating it.

Status: OBSERVATIONAL CONTEXT TAXONOMY FROZEN.

---

## MC-037 — Taiwan sector transmission must be exposure-conditional

Taiwan evidence is explicitly sector-dependent.

Potential channels:

### Semiconductor / electronics
- energy/input costs;
- global-demand information embedded in oil;
- discount-rate/inflation response;
- USD/TWD interaction.
Recent Taiwan research reports adverse semiconductor/TSMC responses to oil-price increases in its specification, but this remains sample/model evidence, not a timeless rule.

### Transportation / airlines
- fuel is a direct cost channel;
- hedging, ticket pricing, demand and FX can offset/lag the effect.

### Petrochemical / plastics
- crude/naphtha is input cost;
- product spreads and downstream demand matter;
- crude up alone does not tell margin direction.

### Shipping
- fuel cost, freight demand and geopolitical rerouting can move simultaneously;
- oil up during strong global trade differs from oil up during supply disruption.

### Financial / domestic sectors
- effects can arrive through inflation, rates, consumption and risk appetite rather than direct energy cost.

Research rule:
oil-state interactions must be pre-registered by economically justified sector/exposure groups. Do not apply one oil score to all stocks.

Status: SECTOR-CONDITIONAL TRANSMISSION FROZEN.

---

## MC-038 — event clocks: EIA/OPEC/geopolitics cannot be backfilled

CME notes the EIA Weekly Petroleum Status Report is normally released Wednesday 10:30 U.S. Eastern Time.

For Taiwan 18:10:
- that same U.S. day's 10:30 ET inventory release occurs later than the Taiwan decision;
- its realized surprise is FUTURE for the 18:10 selector.

Allowed before release:
- scheduledEventWithinHours flag;
- frozen consensus expectation only if a timestamped PIT provider exists.

Allowed after release:
- realized inventory surprise;
- post-release WTI/Brent reaction;
- but only for decisions whose timestamp is later than release.

OPEC/producer announcements and geopolitical shocks require their own publishedAt/knownAt timestamps. Surprise events cannot be retroactively marked “known before scan.”

Status: OIL-EVENT CLOCK FROZEN.

---

## MC-039 — falsification matrix for D13-07

Baseline order:
1. Taiwan same-day market return / Regime;
2. Taiwan sector return / Residual RS;
3. prior U.S. broad/technology information;
4. USD/TWD;
5. rates/inflation-risk context where available;
6. oil candidate.

Candidate families:
- Brent and WTI same-contract returns;
- oil return shock percentile;
- oil intraday/realized volatility;
- front/next spread and spread change;
- contextual oil state;
- BRF only with FX/local-basis guard.

Mandatory falsification:
- Brent vs WTI replication;
- futures vs delayed spot reference;
- roll-day exclusion / explicit roll state;
- normal vs crisis/geopolitical dates;
- demand-compatible vs adverse oil-up split;
- sector interaction;
- date-shift placebo;
- leave-one-date-out;
- remove largest oil shock dates;
- test whether oil adds anything beyond global equities/FX/rates;
- separate next-open gap from open-to-close and D1/D3;
- transaction-cost relevance only if the feature changes an actionable decision.

A raw oil feature that only restates global risk-off is REDUNDANT.

Status: OIL FALSIFICATION MATRIX FROZEN.

---

## MC-040 — D13-07 maturity decision

D13-07 advances **L1 -> L2**.

Why:
- endogeneity/shock-source ambiguity is explicit;
- live-vs-daily source timing is frozen;
- roll/curve contamination is explicit;
- causal structural shocks are separated from real-time contextual states;
- Taiwan sector transmission is defined;
- event-clock and falsification rules are frozen.

Why not L3:
- no durable 18:10 prospective oil receipt exists yet;
- no frozen live provider/session contract has been validated across independent dates;
- no Taiwan OOS/Shadow evidence under the frozen taxonomy exists.

Formal Core remains LOCKED. No oil risk veto, sector penalty, ranking bonus or position-size change is approved.

## Exact next continuation after MC-040

1. Build a prospective 18:10 oil receipt: WTI/Brent contract identity, timestamp, front/next prices, curve, FX and quality metadata.
2. Prefer direct benchmark futures when licensing/source permits; BRF can be a Taiwan-local cross-check but requires FX/basis controls.
3. Continue D13-09 and D13-11 together: BLS release clocks, initial-vintage values, revisions, consensus provenance and macro-surprise semantics.
4. Cross-test oil context with D12-10 `NIGHT_PRE_SCAN` only after both receipt streams are PIT-safe.


---

## MC-041 — D13-09 / D13-11: release calendar, realized value and surprise are three different information objects

D13-09 and D13-11 remained L1.

For CPI / PPI / Employment Situation, separate:

1. **SCHEDULED_EVENT**
   - release date/time known in advance from BLS calendar;
   - direction unknown.

2. **INITIAL_RELEASE_VALUE**
   - first value actually published at the release timestamp;
   - may later be revised.

3. **CONSENSUS_EXPECTATION**
   - market expectation collected before release;
   - not supplied by BLS;
   - requires its own timestamped provider/vintage.

4. **SURPRISE**
   - initial release minus the pre-release consensus, with indicator-specific sign semantics.

5. **MARKET_REACTION**
   - asset-price move after release;
   - different object from the surprise itself.

Never collapse these into one “macro signal.”

Status: MACRO-OBJECT SEMANTICS FROZEN.

---

## MC-042 — BLS release clock creates a predictable 18:10 Taiwan event-risk window

BLS schedules:
- CPI at 08:30 U.S. Eastern Time;
- PPI at 08:30 ET;
- Employment Situation at 08:30 ET.

BLS calendars explicitly state times are Eastern Time.

At Taiwan 18:10, 08:30 ET on the same U.S. calendar date has **not occurred yet**, whether the U.S. is on standard or daylight time.

Therefore:
- the realized same-U.S.-date CPI/PPI/payroll/unemployment release is FUTURE for the 18:10 Taiwan selector;
- but the fact that a release is scheduled a few hours later is known.

This creates a clean pre-event feature:
- `eventWithin6h`;
- `eventType`;
- `scheduledReleaseAtTaipei`;
- `timeToReleaseMinutes`.

For major 08:30 ET releases, the release commonly lands around 20:30 or 21:30 Taipei depending daylight-saving time, meaning it occurs during the TX after-hours session and **after** the 18:10 selector.

This is a direct dependency between D13 macro clocks and D12 `NIGHT_POST_SCAN`.

Status: PRE-EVENT CLOCK CANDIDATE FROZEN.

---

## MC-043 — first print must be preserved; current historical values can contain revisions

BLS explicitly documents revisions.

Examples:
- PPI can be revised monthly for up to four months after initial publication.
- National CES payroll estimates are first published as preliminary, then revised in the next two releases, and later subject to annual benchmarking.
- BLS seasonal-adjustment recalculation can revise historical series.
- Household/employment series have their own concurrent seasonal-adjustment and revision procedures.

Therefore:

`CURRENT_BLS_HISTORY != GUARANTEED_INITIAL_RELEASE_VINTAGE`.

A valid surprise backtest requires:
- the exact first-published value known at release time;
- the prior-period value as it stood in that same release if the headline calculation depends on it;
- revision/version identity.

Do not compute “historical surprise” using today's revised database against an old consensus.

Status: FIRST-PRINT VINTAGE GUARD FROZEN.

---

## MC-044 — consensus is the hardest provenance object

Academic/event-study evidence commonly defines macro surprise as:
`actual release - median/consensus forecast`.

Federal Reserve research using Bloomberg Economic Calendar notes that forecasts can be submitted and updated up to the official release, making the near-release median a plausible real-time expectations measure.

But consensus is:
- provider-specific;
- timestamp-sensitive;
- revision-sensitive as forecasters update;
- sometimes missing;
- not reproducible from the realized series itself.

Required fields:
- provider;
- consensusCapturedAt;
- forecastCount if available;
- median/mean convention;
- lastUpdateBeforeRelease;
- unit;
- referencePeriod;
- seasonal-adjustment convention.

If historical consensus vintage is unavailable:
`MACRO_SURPRISE = UNKNOWN`.

Do not substitute:
- previous release;
- model forecast built later;
- current website “forecast” field
for historical market consensus.

Status: CONSENSUS-PROVENANCE GATE FROZEN.

---

## MC-045 — standardized surprise needs a PIT-safe scale

Raw surprise units are incomparable:
- payroll thousands;
- CPI percentage points;
- unemployment percentage points;
- PPI percentage points.

A common research transformation is:
`standardizedSurprise = (actual - consensus) / historicalStdDevOfSurprise`.

Federal Reserve research uses historical standard deviation to place different macro surprises on a comparable scale.

PIT rule:
- denominator uses only surprises observed before the event;
- minimum history must be frozen;
- no full-sample standard deviation;
- no post-event recalibration.

If the history is too short:
- raw surprise may be stored;
- standardized surprise = UNKNOWN.

Status: SURPRISE NORMALIZATION CONTRACT FROZEN.

---

## MC-046 — “positive surprise” does not have one equity sign

Indicator semantics differ.

### Inflation
- CPI/PPI above consensus = upside inflation surprise.
Potential channels:
- higher rates / discount rate;
- lower policy-easing probability;
- margin/cost pressure.
But market reaction depends on the inflation/policy Regime.

### Payroll employment
- payroll above consensus = stronger employment/activity surprise.
Potential channels:
- stronger growth/cash-flow outlook;
- tighter policy expectations.
The net equity sign can change with the macro Regime.

### Unemployment rate
A higher-than-consensus unemployment rate is usually weaker labor-market news; raw numeric sign must therefore not be mixed with payroll surprise without sign mapping.

### Research architecture
Store separately:
- `activitySurprise`;
- `inflationSurprise`;
- `laborTightnessSurprise`;
- `policySensitivityRegime`.

Federal Reserve research finds aggregate stock prices can respond positively to real-activity news and negatively to price news, while announcement effects vary with monetary-policy context. That supports dimensional/regime decomposition rather than one “economic surprise score.”

Status: MULTI-DIMENSION SURPRISE ARCHITECTURE FROZEN.

---

## MC-047 — scheduled event presence may be more useful to the 18:10 selector than the realized surprise

There are two distinct use cases.

### A. BEFORE RELEASE at 18:10
Known:
- event type;
- release time;
- perhaps consensus if captured.

Unknown:
- actual;
- realized surprise;
- post-release market move.

Research target:
- does imminent scheduled macro-event risk alter overnight gap/MAE/stop risk for selections made at 18:10?

This is an **event-risk** hypothesis, not direction prediction.

### B. AFTER RELEASE on a later Taiwan decision
Known:
- initial value;
- consensus;
- surprise;
- U.S./global market reaction;
- Taiwan's same-day response may already have occurred.

Research target:
- has Taiwan already absorbed the surprise, or does a residual state remain?

This mirrors the cross-market absorption framework.

Status: EVENT-PRESENCE VS REALIZED-SURPRISE SPLIT FROZEN.

---

## MC-048 — D13-09 / D13-11 falsification matrix

For pre-event presence:
- compare scheduled major-event nights vs matched non-event nights;
- control pre-event VIX/IV, TX `NIGHT_PRE_SCAN`, global futures and Taiwan Regime;
- outcome = post-scan night range, next-open gap, next-session MAE, stop incidence;
- direction is secondary.

For realized surprise:
- initial-vintage actual only;
- timestamped consensus only;
- separate activity/inflation/labor dimensions;
- control market reaction if testing residual after-market value;
- split inflation-sensitive vs growth-sensitive regimes;
- distinguish first release from later revisions;
- date-shift placebo;
- leave-one-event-out;
- prevent one CPI/NFP crisis print from dominating;
- no event list selected by outcome performance.

A finding that only says “big announcements cause volatility” without adding beyond VIX/IV/night-futures state is REDUNDANT.

Status: MACRO FALSIFICATION MATRIX FROZEN.

---

## MC-049 — D13-09 and D13-11 maturity decisions

D13-09 advances **L1 -> L2**.
D13-11 advances **L1 -> L2**.

Why:
- official release clocks are frozen;
- same-calendar-day 18:10 future-information boundary is explicit;
- initial-vintage/revision semantics are explicit;
- consensus provenance is defined;
- surprise normalization and dimension mapping are pre-registered;
- pre-event versus post-release use cases and falsification are defined.

Why not L3:
- no durable timestamped consensus-vintage dataset exists in the repository;
- no prospective first-print receipt stream is implemented;
- no independent-event OOS/Shadow evidence exists.

Formal Core remains LOCKED. No macro-event veto, size reduction, score or sector penalty is approved.

## Exact next continuation after MC-049

1. Prospectively capture BLS schedule metadata even before consensus data is solved: event type, scheduledAt, capturedAt, sourceVersion.
2. Freeze a provider contract for timestamped consensus before any surprise backtest.
3. Capture initial release values separately from revised series.
4. Join pre-event flags to D12 `NIGHT_PRE_SCAN` and evaluate post-scan night / next-open downside risk before testing direction.
5. Continue D13-05 DXY and D13-08 commodities only after avoiding duplication with USD/TWD, oil and global risk factors.


---

## MC-050 — D13-05 reopened: DXY is a fixed developed-market currency basket, not “the world dollar”

D13-05 remained L1.

ICE states that the U.S. Dollar Index (USDX/DXY):
- is a geometrically averaged calculation of six currencies against the U.S. dollar;
- uses fixed composition/weights;
- changed composition only once, when the euro replaced legacy European currencies in 1999;
- retains 57.6% cumulative euro exposure.

Current fixed weights:
- EUR 57.6%;
- JPY 13.6%;
- GBP 11.9%;
- CAD 9.1%;
- SEK 4.2%;
- CHF 3.6%.

Therefore DXY is **not** a broad Asia/EM dollar index.

A large DXY move can be dominated by EUR/USD even when:
- USD/TWD is stable;
- KRW or CNY move differently;
- Asian financial conditions are not moving proportionally.

Status: DXY-COMPOSITION SEMANTICS FROZEN.

---

## MC-051 — DXY and the Federal Reserve Broad Dollar Index are different economic objects

The Federal Reserve broad dollar index is designed around U.S. trade exposure and periodically updates weights.

Fed 2026 broad-index weights include, among others:
- Euro Area about 21.0%;
- Mexico about 14.8%;
- Canada about 12.8%;
- China about 10.9%;
- Japan about 5.2%;
- Korea about 3.6%;
- Taiwan about 3.0%.

This differs sharply from DXY's fixed six-currency developed-market basket.

Research consequence:

### DXY
Best interpreted first as:
- liquid/tradable developed-market dollar benchmark;
- real-time FX/risk context;
- heavily EUR-driven composite.

### Fed Broad Dollar
Best interpreted first as:
- broader trade-weighted macro dollar measure;
- more representative of U.S. trade relationships including Asian/EM currencies;
- not automatically an 18:10 real-time market quote.

Do not merge them into one field named `dollarStrength`.

Status: DXY_VS_BROAD_DOLLAR FIREWALL FROZEN.

---

## MC-052 — the global-dollar mechanism is real, but DXY is only one proxy

BIS / NBER / Federal Reserve research documents a global-dollar financial channel:
- broad dollar appreciation is associated with tighter global financial conditions;
- dollar appreciation can reduce EME capital flows, credit and investment;
- dollar shocks correlate with U.S. monetary tightening, dollar-funding stress and global risk appetite.

This supports a **global dollar risk-state hypothesis**.

It does not prove:
- DXY itself is the optimal Taiwan proxy;
- DXY up always means Taiwan equities down;
- raw DXY has incremental information beyond USD/TWD, U.S. rates, VIX or global equity futures.

For Taiwan, the hierarchy must test:
1. USD/TWD direct local FX state;
2. U.S. rate state;
3. global equity/risk state;
4. DXY;
5. broad-dollar alternative when PIT/source timing is valid.

Status: GLOBAL-DOLLAR MECHANISM SUPPORTED / PROXY CHOICE UNRESOLVED.

---

## MC-053 — DXY is potentially PIT-clean at 18:10, but provider/licensing must be explicit

ICE states that:
- the cash USDX is calculated intraday from component-currency bid/offer midpoints;
- the index is calculated in real time every second;
- USDX futures trade for approximately 21 hours per day.

Therefore a timestamped ICE DXY/USDX observation captured at or before 18:10 Taipei is conceptually PIT-eligible.

However:
- current repository has no durable DXY receipt;
- provider entitlement/licensing/history contract is not frozen;
- delayed vendor data must not be mislabeled real-time;
- a daily close or later settlement cannot be backfilled as the 18:10 value.

Source state:
`ICE_DXY_OFFICIAL_SOURCE = IDENTIFIED`
`DXY_1810_PROVIDER_ENTITLEMENT = NOT_FROZEN`
`DXY_HISTORICAL_1810_RECEIPT = NOT_ESTABLISHED`.

Status: SOURCE_FEASIBILITY MATERIAL_PASS / DATA CONTRACT PENDING.

---

## MC-054 — DXY needs a euro-dominance / redundancy audit before Taiwan use

Because EUR weight is 57.6%, a DXY move can largely reflect EUR/USD.

Minimum decomposition:
- DXY return;
- EUR/USD return;
- USD/JPY return;
- USD/TWD return;
- U.S. 2Y/10Y changes;
- global equity-futures state.

Candidate diagnostic:
`dxyExEuroResidual` only as research-only residual after a pre-registered model.

But do not jump directly to residualization.

Validation order:
1. raw DXY;
2. EUR/USD alone;
3. USD/TWD alone;
4. DXY + USD/TWD;
5. DXY after U.S. rates/global risk controls;
6. only then consider a DXY residual.

If EUR/USD alone explains the DXY result, classify:
`EURO_DOMINATED_NOT_TAIWAN_INCREMENTAL`.

Status: EURO-DOMINANCE REDUNDANCY GATE FROZEN.

---

## MC-055 — DXY candidate state architecture

Do not define one binary “strong dollar = bad” state.

Research-only raw states:
- `dxyLevelPctile`;
- `dxyReturnPreScan`;
- `dxyShockZ`;
- `dxyTrend20`;
- `dxyVolatility`;
- `dxyVsUsdTwdDivergence`;
- `dxyVsRatesDivergence`.

Potential contextual patterns:

### BROAD_DOLLAR_STRESS_CANDIDATE
- DXY up;
- USD/TWD up (TWD weaker);
- U.S. rates and/or global risk stress aligned.

### EURO_LED_DXY_UP
- DXY up;
- EUR/USD explains most of move;
- USD/TWD / Asian FX not confirming.

### LOCAL_TWD_WEAKNESS_WITHOUT_DXY
- USD/TWD up materially;
- DXY flat/down.
This may be more Taiwan-specific and cannot be replaced by DXY.

These are descriptive states, not trading rules.

Status: DOLLAR-CONTEXT TAXONOMY FROZEN.

---

## MC-056 — D13-05 falsification and maturity decision

Primary targets:
- next-open gap;
- next-session MAE / realized range;
- D1/D3 Taiwan market residual return;
- System 1 / System 2 candidate hit-rate and stop incidence.

Mandatory controls:
1. Taiwan same-day market/Regime;
2. USD/TWD;
3. U.S. rates;
4. prior U.S. broad/tech + same-window futures where available;
5. VIX/IV;
6. then DXY.

Falsification:
- EUR/USD substitution test;
- USD/TWD substitution test;
- broad-dollar comparison when PIT-valid;
- crisis removal;
- date-shift placebo;
- leave-one-date-out;
- direction vs risk-target split;
- Asian FX confirmation interaction;
- no threshold/window selected from outcome performance.

D13-05 advances **L1 -> L2**.

Why not L3:
- official source is identified, but no durable 18:10 DXY receipt/provider entitlement is frozen;
- no independent-date Taiwan evidence under the fixed redundancy order exists.

Formal Core remains LOCKED. No DXY veto, score, risk throttle or ranking bonus is approved.

---

## MC-057 — D13-08 reopened: “metals / commodities / rare elements” is not one factor family

D13-08 remained L1.

Three economically distinct groups must be separated:

### A. Industrial / base metals
Examples:
- copper;
- aluminium;
- zinc;
- tin.
Core drivers:
- global industrial demand;
- construction/infrastructure;
- manufacturing;
- mine/smelter disruptions;
- inventories;
- energy/input constraints.

### B. Precious / monetary metals
Example:
- gold.
Core drivers:
- real rates;
- USD;
- safe-asset demand;
- central-bank/investor demand;
- geopolitical/financial stress;
- mining supply.

### C. Critical / strategic minerals
Examples:
- lithium;
- cobalt;
- graphite;
- rare earths;
- gallium;
- germanium;
- indium;
- tungsten.
Core drivers:
- highly specific technology demand;
- processing/refining concentration;
- export controls;
- small/opaque markets;
- substitution constraints;
- by-product supply.

A single `COMMODITY_RISK_SCORE` would mix incompatible mechanisms.

Status: COMMODITY-FAMILY SEPARATION FROZEN.

---

## MC-058 — industrial-metal prices are endogenous to both global demand and supply

World Bank research finds modern commodity-price variation is materially driven by global macro demand, while metal-specific supply disruptions remain important.

For copper/aluminium:
- recession/recovery demand shocks can move prices strongly;
- supply disruptions can also produce large moves;
- the same +5% copper move can mean stronger industrial demand or tighter mine/smelter supply.

Therefore:
`copperUp = globalGrowthUp`
is not a valid identity.

Research-only context must preserve:
- price return;
- curve/spread where available;
- inventory/tightness proxies where PIT-valid;
- known supply-disruption event;
- global equity/PMI/growth context.

Status: INDUSTRIAL-METAL ENDOGENEITY GUARD FROZEN.

---

## MC-059 — copper is a clean 18:10 market-price candidate, but roll and USD redundancy matter

CME HG copper futures trade nearly around the clock. A timestamped HG futures observation before 18:10 Taipei can therefore be PIT-eligible.

Required contract fields:
- exchange;
- contractMonth;
- daysToExpiry;
- frontPrice;
- nextPrice;
- frontNextSpread;
- rollFlag;
- sourceTimestamp;
- currency = USD;
- quoteQuality.

Candidate features:
- same-contract 15:00->18:10 return;
- 1D/5D return known at scan;
- shock percentile;
- front/next spread change;
- realized/intraday volatility.

Mandatory redundancy controls:
- DXY / USD;
- U.S. rates;
- global equity futures;
- oil;
- Taiwan electronics/industrial sector RS.

Because copper is USD-denominated, some price movement can be mechanical or correlated with dollar moves. Test metal returns in both raw USD terms and USD-controlled residual form only after pre-registration.

Status: COPPER PRE-SCAN SOURCE FEASIBLE / PROVIDER CONTRACT PENDING.

---

## MC-060 — gold is not an industrial commodity proxy and safe-haven behavior is conditional

Gold differs from copper.

CME and empirical research identify major gold channels:
- U.S. dollar;
- real yields / opportunity cost;
- investor/central-bank demand;
- risk/geopolitical conditions;
- supply.

Recent multi-country evidence finds gold's hedge/safe-haven role varies by market and regime. It is not universally a strong safe haven for every equity market in every episode.

Research consequence:
- gold up cannot automatically mean RISK_OFF;
- gold down cannot automatically mean RISK_ON.

At 18:10, CME gold futures are actively trading and can be PIT-eligible if timestamped.

Mandatory redundancy:
- DXY;
- 10Y real yield;
- VIX/IV;
- global equity futures;
- geopolitical/event state.

A gold signal that vanishes after DXY + real-yield controls is not incremental.

Status: GOLD MONETARY/RISK FAMILY FROZEN.

---

## MC-061 — critical minerals have an opposite data problem: economic importance can be high while price transparency is low

IEA 2025/2026 work emphasizes:
- high refining/processing concentration;
- export restrictions;
- small and opaque markets for many strategic minerals;
- extreme price volatility;
- by-product dependence;
- limited substitution;
- limited price transparency.

IEA 2026 reports that strategic minor minerals such as gallium, germanium, indium, tungsten and others can support very large downstream economic value despite small physical market size.

For rare earths, the IEA explicitly calls for greater price transparency because limited transparency complicates contracting and hedging.

Therefore:
`NO_RELIABLE_DAILY_PRICE != NO_ECONOMIC_SIGNAL`.

For many rare/strategic minerals, event/supply-chain evidence may be more reliable than a stale vendor price.

Status: PRICE-TRANSPARENCY LIMIT FROZEN.

---

## MC-062 — critical-mineral architecture should be event-first, price-second

For rare earths / strategic minor minerals:

Primary state objects:
1. `SUPPLY_RESTRICTION_EVENT`
   - export control;
   - quota;
   - mine/refinery outage;
   - sanction/trade restriction.

2. `SUPPLY_CONCENTRATION_STATE`
   - producer/refiner concentration;
   - by-product dependency;
   - substitute availability.

3. `PRICE_EVIDENCE`
   - only when source/method/currency/region/timestamp is explicit;
   - preserve regional price divergence instead of forcing one “world price.”

4. `DOWNSTREAM_EXPOSURE_DEPENDENCY`
   - owned by D10 supply-chain research, not duplicated here.

This room owns:
- global event clock;
- commodity/mineral market state;
- source/provenance.

D10 owns:
- which Taiwan companies/products are exposed;
- beneficiary/victim chain;
- inventory/capacity/pass-through.

Status: D13<->D10 OWNERSHIP BOUNDARY FROZEN.

---

## MC-063 — regional price divergence is information, not bad data by default

IEA 2026 documents large regional price gaps after export restrictions, including much higher non-China prices for some rare earths/gallium/germanium.

Therefore a “single global mineral price” can destroy useful information.

Required price identity:
- mineral/material grade;
- purity/specification;
- geography;
- incoterm/market location if applicable;
- currency;
- unit;
- source/method;
- assessment timestamp;
- capturedAt;
- revision flag.

If two sources/regions disagree:
- preserve both;
- do not average blindly;
- define `REGIONAL_PRICE_DIVERGENCE`.

Status: MINERAL PRICE IDENTITY CONTRACT FROZEN.

---

## MC-064 — D13-08 falsification and maturity decision

### Industrial metals
Test:
- copper/metal state beyond global equity + USD + oil;
- demand-compatible versus supply-tightness contexts;
- sector-conditioned Taiwan effects.

### Gold
Test:
- incremental value beyond DXY + real yields + VIX/IV;
- crisis vs normal regimes;
- risk prediction vs return direction.

### Critical minerals
Test:
- event-first state vs price-only state;
- publishedAt/knownAt integrity;
- whether downstream Taiwan impact appears only after D10 exposure mapping;
- regional-price divergence vs single-price simplification;
- stale/opaque price sensitivity.

Common falsification:
- date-shift placebo;
- leave-one-date/event-out;
- remove extreme crises;
- no ex-post event classification;
- no provider switching based on better outcomes;
- UNKNOWN for missing/opaque price evidence.

D13-08 advances **L1 -> L2**.

Why not L3:
- no frozen prospective provider/receipt stream for copper/gold/critical minerals;
- critical-mineral price sources remain heterogeneous/opaque;
- no independent-date/event Taiwan evidence under the frozen D13-D10 boundary exists.

Formal Core remains LOCKED. No commodity score, rare-earth bonus, gold risk veto or sector weight change is approved.

## Exact next continuation after MC-064

1. Design one unified research-only `GLOBAL_MARKET_RECEIPT_V0_1` envelope with instrument-family-specific payloads rather than separate incompatible receipts.
2. First prospective lanes: DXY, HG copper, GC gold and scheduled critical-mineral supply events; preserve provider entitlement and observedAt/knownAt.
3. Continue D13-03 Japan/Korea from L2 toward L3 only after clean 13:30-Taipei -> 14:30-Taipei subwindow data feasibility is proven.
4. Continue D13-12 global shock / Taiwan residual by integrating only PIT-safe lanes; missing lanes remain UNKNOWN.
5. No Formal optimization proposal until prospective/OOS evidence demonstrates incremental value beyond domestic Taiwan state, USD/TWD, rates, VIX and sector RS.


---

## MC-065 — D13-03 deepening: Japan/Korea daily close contains a potentially clean post-Taiwan-close subwindow

Taiwan regular cash closes 13:30 Taipei.

Official exchange hours:
- Japan TSE regular cash session: 09:00-11:30 and 12:30-15:30 JST = close 14:30 Taipei.
- Korea KRX regular cash session: 09:00-15:30 KST = close 14:30 Taipei.

Therefore a clean conceptual subwindow exists:

`POST_TAIWAN_CLOSE_ASIA_WINDOW = 13:30 Taipei -> 14:30 Taipei`.

This is only about one hour and is much cleaner than using the entire Japan/Korea same-day close-to-close return as if it were a post-Taiwan-close lead.

Required anchors:
- JP/KR index value at Taiwan 13:30;
- JP/KR regular-session closing value at Taiwan 14:30.

Status: CLEAN-SUBWINDOW DEFINITION FROZEN.

---

## MC-066 — current free official historical replay for the clean subwindow is NOT established

JPX official public information provides:
- current/intraday market information with delay on some public pages;
- TOPIX historical daily index values/OHLC.

But the bounded official-source audit did not establish a free durable historical intraday archive that can reconstruct TOPIX/Nikkei value exactly at Taiwan 13:30 for a long backtest.

KRX official sources confirm regular trading hours and after-hours structure, but the bounded source audit likewise did not establish a durable freely reproducible historical KOSPI index snapshot specifically at Taiwan 13:30 across long history.

Therefore:
`JP_KR_POST_TAIWAN_CLOSE_LONG_HISTORY = SOURCE_FEASIBILITY_NOT_ESTABLISHED`.

Do not:
- interpolate from daily OHLC;
- use full daily return;
- use the 14:30 close and pretend the 13:30 anchor was known historically;
- backfill current public charts into historical receipts.

Status: HISTORICAL-INTRADAY SOURCE GATE FROZEN.

---

## MC-067 — Korea's extended trading ecosystem creates a rules-regime/version problem

KRX regular-session close remains 15:30 KST, but Korea introduced an alternative trading system (Nextrade) with extended pre/after-market trading from 2025.

For D13-03, define:
- `KRX_REGULAR_CLOSE` = KRX index/regular-market close;
- `KOREA_AFTER_MARKET` = separate market state where relevant;
- `ATS_EXTENDED_SESSION` = separate source/venue.

Do not merge venue/session prices into one “Korea close” without:
- venue;
- session;
- rulesRegimeVersion;
- timestamp.

Historical pre-2025 and post-2025 Korea session structures must be segmented.

Status: KOREA-MULTI-VENUE REGIME GUARD FROZEN.

---

## MC-068 — the D13-03 hypothesis should test information added after Taiwan already closed

Research question:

**Between Taiwan 13:30 and Japan/Korea 14:30, did Japan/Korea reveal new regional information that changes the next Taiwan session beyond what Taiwan already priced by its own close?**

Candidate clean features:
- `topixPostTwCloseReturn`;
- `nikkeiPostTwCloseReturn`;
- `kospiPostTwCloseReturn`;
- `jpKrPostTwCloseAgreement`;
- `jpKrPostTwCloseDispersion`.

Controls:
- Taiwan same-day market/sector state;
- Japan/Korea return during Taiwan-overlap hours;
- same-window global futures;
- USD/TWD / JPY / KRW context where PIT-safe;
- semiconductor-sector context.

If full JP/KR daily return works but the post-Taiwan-close subwindow does not, classify the result as OVERLAP/COMMON-BETA rather than fresh post-close information.

Status: POST-CLOSE INCREMENTAL HYPOTHESIS FROZEN.

---

## MC-069 — D13-03 maturity remains L2

No L2 -> L3 promotion.

Reason:
- mechanism and exact subwindow are clear;
- official session clocks are proven;
- but long-history PIT replay/source contract for the 13:30 anchor is not established.

Next evidence routes:
1. prospective 13:30 and 14:30 capture;
2. licensed intraday index history;
3. exchange/vendor source with explicit historical timestamps and entitlement.

Until then:
- same-day daily JP/KR close stays `ASIA_DAILY_MIXED_WINDOW`;
- clean post-close feature remains `WAITING_SOURCE`.

Formal Core unchanged.

---

## MC-070 — D13-12 deepening: raw market moves are not automatically “shocks”

The word shock must be reserved.

Three levels:

1. `OBSERVED_MOVE`
   - raw price/index/yield/FX/commodity change.

2. `STATISTICAL_SHOCK`
   - unexpected or standardized move relative to a pre-registered, past-only baseline.

3. `STRUCTURAL_SHOCK`
   - causally identified innovation under an explicit structural model / external identification.

Examples:
- DXY +1% = OBSERVED_MOVE.
- DXY +1% when trailing expected move was 0 with frozen scale = possible STATISTICAL_SHOCK.
- “Dollar funding shock” requires stronger structural identification.

This prevents causal over-claiming in Global Shock research.

Status: SHOCK-NAMING FIREWALL FROZEN.

---

## MC-071 — transmission estimation and 18:10 residual-state prediction are different estimands

There are two distinct research questions.

### A. Global -> Taiwan transmission
Question:
How did Taiwan respond to a global move/shock?

Here Taiwan same-day return is an outcome.
Do NOT control it away.

### B. 18:10 after-market residual state
Question:
Given global information was already known and Taiwan has already traded/closed, did Taiwan under-absorb, over-absorb or align with the global state, and does that residual state predict the next Taiwan session?

Here Taiwan same-day return/sector response is known at 18:10 and legitimately enters the residual-state calculation.

Mixing A and B creates post-treatment/control confusion.

Status: ESTIMAND SEPARATION FROZEN.

---

## MC-072 — first Global Observation Vector, not one global risk score

The global layer should remain a vector.

Candidate families:
- `GLOBAL_EQUITY` — U.S. broad/tech, Asia;
- `GLOBAL_VOLATILITY` — VIX/TAIEX VIX/IV;
- `GLOBAL_DOLLAR` — DXY, USD/TWD, broad-dollar context;
- `GLOBAL_RATES` — UST front/long/real/curve;
- `GLOBAL_ENERGY` — WTI/Brent context;
- `GLOBAL_INDUSTRIAL_METALS` — copper/base metals;
- `GLOBAL_MONETARY_METALS` — gold;
- `GLOBAL_CRITICAL_MINERAL_EVENT` — rare/strategic mineral supply events;
- `GLOBAL_MACRO_EVENT` — scheduled/released CPI/NFP/etc.;
- `TAIWAN_DERIVATIVE_ABSORPTION` — TX NIGHT_PRE_SCAN residual.

No scalar score is permitted before evidence proves:
- stable dimension reduction;
- no meaningful opposite-sign mechanisms are destroyed;
- OOS incremental value exceeds the vector/baseline alternatives.

Status: VECTOR-FIRST ARCHITECTURE FROZEN.

---

## MC-073 — absorption residual must be estimated only from information available before each date

A future research residual can take the form:

`expectedTaiwanResponse_t = f(globalState_t ; parameters estimated only on dates < t)`

`taiwanAbsorptionResidual_t = observedTaiwanResponse_t - expectedTaiwanResponse_t`

Possible response levels:
- TAIEX market;
- electronics/semiconductor sector;
- stock residual after market/sector controls.

Mandatory rules:
- rolling/expanding estimation uses only prior dates;
- minimum training count frozen;
- no future full-sample beta;
- no window chosen because OOS results looked better;
- model version stored in receipt;
- if training coverage is insufficient => UNKNOWN.

A simple benchmark must precede any complex model:
1. fixed historical beta;
2. one-factor global broad return;
3. broad + tech;
4. only then multi-family model.

Status: PIT RESIDUALIZATION CONTRACT FROZEN.

---

## MC-074 — underreaction / overreaction labels require sign-aware expected response

Do not label:
- Taiwan up less than U.S. = “underreaction”
without an expected-response model.

Because:
- Taiwan beta may be below 1;
- sector mix differs;
- FX/rates can offset;
- Taiwan may have idiosyncratic news.

After a PIT model:
- `UNDER_ABSORBED_POSITIVE` = actual response below expected positive response by threshold defined ex ante;
- `OVER_ABSORBED_POSITIVE` = actual above expected positive response;
- analogous negative states;
- `ALIGNED` within pre-registered residual band;
- `UNKNOWN` if model/data quality insufficient.

Threshold must come from trailing residual scale, not future outcomes.

Status: ABSORPTION LABEL SEMANTICS FROZEN.

---

## MC-075 — D13-12 falsification hierarchy

Before claiming residual alpha:

1. Taiwan domestic market/Regime baseline.
2. Taiwan sector / Residual RS.
3. Global broad equity only.
4. Add tech/semiconductor.
5. Add USD/TWD and rates.
6. Add volatility.
7. Add DXY.
8. Add oil/metals only when mechanism/sector relevant.
9. Add night-futures residual.
10. Test whether residual state changes next-open / open-close / MAE / selection outcomes.

Mandatory:
- independent date as inference unit;
- crisis removal;
- event-day stratification;
- date-shift placebo;
- leave-one-date-out;
- no factor family selected after outcome ranking;
- collinearity/redundancy audit;
- compare simple vs complex model;
- transaction-cost/actionability test if used for decision changes.

Status: GLOBAL-RESIDUAL FALSIFICATION LADDER FROZEN.

---

## MC-076 — D13-12 remains L2; evidence integration is now the bottleneck

D13-12 remains **L2 / 40%**.

Concept work is substantially deeper, but L3 requires:
- actual PIT-safe receipts from multiple global families;
- enough independent Taiwan dates;
- replayable residual-model parameters;
- evidence that global residual adds beyond Taiwan domestic/sector state.

Current bottleneck:
`PROSPECTIVE_GLOBAL_RECEIPTS`, not more indicator invention.

Machine-readable next object:
`research/d13_12_global_absorption_residual_spec_v0_1.json`.

Formal Core remains LOCKED. No global score, regime gate, risk throttle or ranking modifier is approved.

## Exact next continuation after MC-076

1. Freeze D13-12 machine-readable residual spec.
2. Build provider/entitlement matrix for `GLOBAL_MARKET_RECEIPT_V0_1`.
3. Decide Class A vs Class B for prospective receipt implementation only after checking whether capture can remain isolated from Formal/shared runtime.
4. Start prospective evidence rather than adding more conceptual global indicators.
5. Keep D13-03 at L2 until clean JP/KR intraday historical/prospective source is proven.


---

## MC-077 — observable on a website != admissible for automated research capture

A source can be economically relevant and visually accessible but still fail the machine-research source contract.

Separate gates:

1. **ECONOMIC_OBSERVABILITY**
   - the market/object exists and can be observed in principle.

2. **CLOCK_OBSERVABILITY**
   - an observation exists before the Taiwan decision clock with explicit observed/known timing.

3. **ENTITLEMENT**
   - the intended automated/non-display use is permitted by source terms or a licensed provider.

4. **REPLAYABILITY**
   - the same object can be durably stored/replayed with contract/session/version identity.

5. **OUTCOME ELIGIBILITY**
   - only after the previous four gates may the source enter OOS/Shadow outcome tests.

This prevents “I can see the quote in a browser” from silently becoming “the system may legally and reliably ingest the quote.”

Status: SOURCE-ADMISSIBILITY LADDER FROZEN.

---

## MC-078 — delayed market data can be PIT-safe, but only under honest delay semantics

A delayed quote is not automatically look-ahead.

If a provider publishes a market observation after a known delay:
- `observedAt` = source market event/quote timestamp;
- `knownAtTaipei` = when the delayed observation became available to our capture path;
- `capturedAt` = our actual receipt time;
- decision eligibility is based on `knownAtTaipei`, not the original market timestamp.

Example:
- market quote event 18:00 Taipei;
- licensed/public delayed publication 18:10;
- captured 18:10:05.

That object can be PIT-safe for a later decision, but it is **not** a real-time 18:00 receipt.

However, clock honesty does not solve licensing. Delayed data still requires an admissible entitlement for automated/non-display use.

Status: DELAYED-DATA SEMANTICS FROZEN.

---

## MC-079 — CME public website is not an admissible automated HG/GC/WTI research feed

CME Group's own market-data documentation states:
- website futures/options quotes are delayed at least 10 minutes;
- website data are for reference;
- licensed real-time/delayed/end-of-day data are available through CME or licensed distributors;
- non-display use includes system/process/program use for research and analysis and is subject to licensing.

Consequences for D13:
- HG copper, GC gold and CME WTI remain economically valid candidate markets;
- the free CME website must not be converted into an automated research API by scraping;
- a future licensed delayed feed could still be PIT-valid if delay/availability semantics are explicit;
- provider/license choice must be frozen **before** outcomes are inspected.

Current classification:
`CME_HG_GC_WTI_AUTOMATED_CAPTURE = SOURCE_CONTRACT_BLOCKED`.

Status: CME AUTOMATED NON-DISPLAY GATE FROZEN.

---

## MC-080 — DXY has the same entitlement problem and a stronger index-IP constraint

ICE documentation identifies DXY/USDX as proprietary ICE Data Indices content.

ICE Global Index Feed policy requires declaration/licensing for non-display use, including non-trading systems/processing/calculations. ICE Index Platform terms also restrict scraping/use outside an applicable agreement. ICE offers real-time, delayed, end-of-day and historical index data through licensed delivery mechanisms.

Therefore:
- DXY economic/source identity remains valid;
- an official page visible to a human is not authorization for automated ingestion;
- no page scraping is approved;
- DXY remains `PROVIDER_ENTITLEMENT_NOT_FROZEN`.

Current classification:
`DXY_AUTOMATED_CAPTURE = SOURCE_CONTRACT_BLOCKED`.

The broad-dollar/USD-TWD research question remains valid and can continue with admissible public-official controls while DXY is blocked.

Status: DXY NON-DISPLAY ENTITLEMENT GATE FROZEN.

---

## MC-081 — paid-data value gate: prove value with public-official lanes first

The project should not incur market-data cost merely because a factor is theoretically attractive.

Research order:

### Free/public-official first
- TAIFEX TAIWAN VIX;
- TAIFEX TX NIGHT_PRE_SCAN;
- CBC USD/TWD;
- U.S. Treasury already-published curve;
- BLS/Fed scheduled macro-event clocks and first releases where timing is valid.

### Paid/licensed later only if justified
- DXY automated feed;
- CME HG/GC/WTI automated non-display data;
- long-history TAIFEX VIX/tick data;
- historical macro consensus.

A paid source becomes review-worthy only if:
1. public-official lanes achieve stable prospective coverage;
2. a preregistered residual test identifies an unresolved information gap;
3. the paid lane has a credible mechanism to fill that gap;
4. expected research value exceeds source cost/complexity;
5. owner approves any paid commitment.

Status: COST-BENEFIT DATA GATE FROZEN.

---

## MC-082 — first prospective source-only evidence exists, but it is deliberately incomplete

At 2026-09-30 05:20:18 Taipei, before the 18:10 decision, the project created:
`research/global_market_source_only_pilot_20260930.json`.

It contains source-only receipts for:
- latest already-published U.S. Treasury official curve (source date 2026-09-29);
- BLS Employment Situation scheduled release metadata;
- BLS CPI scheduled release metadata;
- BLS PPI scheduled release metadata.

Important negative evidence:
- no same-day future macro realization was inserted;
- no DXY/HG/GC was inserted because entitlement was not proven;
- no TAIWAN VIX was invented before its regular publication session;
- no TX NIGHT_PRE_SCAN was invented before its 15:00 window existed.

This is a stronger data-quality result than filling every field: the architecture demonstrates it can remain incomplete without converting UNKNOWN into zero.

Status: FIRST SOURCE-ONLY PROSPECTIVE PARTIAL PASS.

---

## MC-083 — source infrastructure progress is not alpha maturity

The global receipt guard and first source-only pilot materially improve research integrity, but they do not prove predictive value.

Therefore:
- D13 maturity is not promoted by this implementation alone;
- D13-12 remains evidence-pending;
- outcome joins remain CLOSED;
- no global risk score or position throttle is authorized.

Next maturity evidence must be:
- independent clean decision dates;
- replay/hash verification;
- pre-registered domestic/sector baseline comparison;
- redundancy testing;
- then OOS/Shadow outcomes.

Status: NO MATURITY INFLATION / FORMAL CORE LOCKED.
