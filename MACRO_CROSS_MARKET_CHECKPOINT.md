# Macro / Cross-Market Checkpoint

Updated: 2026-09-28 20:35 Asia/Taipei
Formal Core: LOCKED
Current cursor: MC-001 through MC-076 complete.

## Durable conclusions

- Current Formal after-market selector has no explicit global-market state for U.S. indexes, Japan/Korea, DXY, USD/TWD or oil.
- V7.5.30 `marketConsensus` is a per-symbol independent-source consensus overlay, not a global/macro factor.
- Prior U.S. cash close is known before Taiwan opens; by 18:10 Taiwan has already had its opening auction and full cash session to react. Raw U.S. return must therefore be tested as common-beta/overnight context first, not assumed fresh after-market alpha.
- The next U.S. cash session after the 18:10 Taiwan scan is future information and is ineligible for that selection decision.
- Japan and Korea cash markets close at 14:30 Taipei while Taiwan closes at 13:30. Their same-date daily close-to-close returns are mixed-window observations: mostly overlapping with Taiwan plus about one hour post-Taiwan-close. Daily data cannot be mislabeled as a clean post-close lead.
- The highest-value after-market question is global-shock absorption/divergence: conditional on the global shock and Taiwan/sector response already observed, does any residual state predict continuation, reversal, gap or downside?
- CBC NT$/US$ interbank closing rate is a materially valid same-day official source for the 18:10 decision clock because the CBC states it is provided each business day around 16:00-17:00 Taipei.
- FRED DEXTAUS is useful as historical/cross-check data but not as the preferred same-day PIT source because its H.10 daily observations are updated weekly and are New York noon rates.
- U.S. broad prior-session series are source-feasible; provider/terms/version contract still needs to be frozen. U.S. technology/semiconductor source remains partially selected.
- Oil/DXY/rates/macroeconomic releases remain separate slower/specialized source-contract work; do not block Phase-1 global receipts on them.
- No global score, veto, ranking bonus or Formal threshold is authorized.

## Phase-1 prospective receipt

Priority:
1. prior U.S. broad equity close;
2. prior U.S. technology/semiconductor close;
3. CBC same-day NTD/USD close;
4. already-existing Taiwan market/sector response fields.

Japan/Korea daily close may be captured only with `ASIA_DAILY_MIXED_WINDOW` semantics until a clean Taiwan-13:30-to-foreign-close subwindow is available.

## Primary falsification

- U.S. broad must add value beyond Taiwan same-day market return/regime.
- U.S. technology must add value beyond broad U.S. + Taiwan sector/Residual RS.
- FX must survive sector/exposure and regime controls.
- Japan/Korea daily close cannot be called a post-close lead without intraday anchors.
- Remove largest shock dates and use scanDate as the independent inference unit.
- Split next-open gap from open-to-close and D3/D5; gap prediction alone is not after-market stock-selection alpha.
- Date-shift placebo is mandatory.

## Exact next continuation

1. Freeze a machine-readable Phase-1 receipt/source contract.
2. Update System 2 source matrix: CBC USD/TWD from SOURCE_NEEDED -> prospective official source identified/materially feasible.
3. Keep U.S. broad/tech provider contract unresolved until terms/session/availability are explicit.
4. Do not implement shared runtime capture while concurrent version lineage is active unless governance class is re-read and branch isolation is proven.
5. Continue another independently falsifiable research lane while prospective evidence accumulates.


## 2026-09-28 D13-06 U.S. Treasury yield-curve deepening

- D13-06 advances L1 -> L2. A Treasury yield is not one causal variable: separate front-end policy-path sensitivity, long nominal discount rate, real yield, inflation compensation, curve shape and model-estimated term premium.
- Official U.S. Treasury par-curve inputs are indicative bid-side quotes obtained near 15:30 U.S. Eastern Time. Fed H.15 is posted at 16:15 Eastern Time.
- For Taiwan's 18:10 after-market decision, the same U.S. calendar day's official curve/H.15 is FUTURE information. Default PIT-safe official input is the most recent U.S. trading-day official observation already published before the Taiwan decision.
- Any contemporaneous intraday U.S. Treasury/futures quote observed at 18:10 Taipei is a separate source/object and must not be silently substituted into official daily CMT history.
- Curve states are split into BULL_STEEPENER / BEAR_STEEPENER / BULL_FLATTENER / BEAR_FLATTENER / MIXED using changes in front/back yields; the label is descriptive, not causal.
- Federal Reserve term-premium/yield-curve models are staff research products that may be delayed/revised/methodologically changed. Without historical vintage/capturedAt semantics, term-premium history is not PIT-eligible alpha.
- Taiwan transmission remains sector-conditioned and absorption-based. Rates must add value after Taiwan market/sector response, prior U.S. broad/tech move and USD/TWD.
- Falsification frozen: date-shift placebo; event-day vs normal-day split; gap vs open-close; tech vs non-tech; FX control; nominal vs real/curve decomposition; crisis removal.
- Machine-readable contract: `research/d13_06_us_yield_curve_pit_spec_v0_1.json`.
- L3 remains blocked until prospective receipts with source date / capturedAt / knownAt / firstEligibleTaiwanDecision exist.
- Formal Core unchanged; no yield score/veto/ranking bonus.

## Updated exact next continuation

1. Phase-2 prospective macro receipt: prior eligible official UST nominal/real yields with exact source/clock semantics.
2. D13-07 Oil L1 -> L2 using demand-vs-supply-vs-geopolitical shock decomposition.
3. D13-09 / D13-11 macro-surprise lanes only after expectation vintage and release-clock provenance are frozen.
4. Cross-link D13 rate state with D12 event-conditioned IV only as a dependency; do not double-count maturity.


## 2026-09-28 D13-07 / D13-09 / D13-11 long-segment deepening

### D13-07 Oil
- Advances L1 -> L2.
- Raw oil up/down is rejected as a universal equity sign because oil moves are endogenous to supply, global demand and precautionary/geopolitical demand.
- Structural shock decomposition is separated from real-time `OIL_MOVE_CONTEXT`; live co-movement labels are descriptive, not causal.
- At Taiwan 18:10, timestamped live WTI/Brent futures can be PIT-eligible; same-day later settlement/full-session values are future.
- TAIFEX BRF is a useful local cross-check but TWD quotation/local basis can mix Brent and FX effects.
- Roll/contract/term-structure semantics and sector-conditional Taiwan transmission are frozen.
- EIA inventory realized surprise on the same U.S. date occurs after Taiwan 18:10 and is future for that selector.
- Machine-readable contract: `research/d13_07_oil_shock_context_spec_v0_1.json`.

### D13-09 CPI/PPI/NFP/unemployment + D13-11 Macro Surprise
- Both advance L1 -> L2.
- Scheduled event, initial release, consensus, surprise and market reaction are separate objects.
- CPI/PPI/Employment Situation are scheduled at 08:30 U.S. Eastern Time; for Taiwan 18:10, same-U.S.-calendar-day realization is future while the event schedule is known.
- This creates an explicit pre-event risk state during TX night trading: major release can occur after the selector but before the next Taiwan cash open.
- BLS series are revision-sensitive; current history is not guaranteed to equal first print. PPI can revise for months, payroll first print is revised twice and later benchmarked, seasonal adjustment can revise history.
- Historical consensus must be timestamped/provider-specific; absent consensus vintage => surprise UNKNOWN.
- Standardized surprise denominator uses prior events only; activity/inflation/labor-tightness surprises remain separate dimensions.
- Machine-readable contract: `research/d13_09_11_macro_release_surprise_spec_v0_1.json`.
- Formal Core unchanged; no event veto, position-size change, score or sector penalty.

## Updated exact next continuation

1. Build research-only prospective receipts for: 18:10 oil snapshot, BLS scheduled-event metadata, first-print release value and (after provider selection) consensus vintage.
2. Join D13 pre-event flags to D12 NIGHT_PRE_SCAN/NIGHT_POST_SCAN and test risk outcomes before direction.
3. Continue D13-05 DXY from L1 -> L2 with redundancy tests versus USD/TWD and U.S. rates.
4. Continue D13-08 metals/commodities from L1 -> L2 using demand/supply/sector transmission rather than one commodity-risk score.
5. No L3 promotion until durable PIT receipts and independent-date evidence exist.


## 2026-09-28 D13-05 / D13-08 long-segment deepening

### D13-05 DXY
- Advances L1 -> L2.
- DXY is a fixed six-currency geometric basket, not a broad global/Asia dollar index. EUR weight is 57.6%; JPY 13.6%; GBP 11.9%; CAD 9.1%; SEK 4.2%; CHF 3.6%.
- Federal Reserve Broad Dollar Index is a different macro object with trade-based weights. 2026 weights include meaningful China/Korea/Taiwan exposures that DXY does not contain directly.
- Global-dollar financial-channel evidence is real, but proxy choice is unresolved: broad dollar appreciation is linked to tighter EME financial conditions, while raw DXY may be euro-dominated.
- ICE official DXY source is identified and calculated intraday; a timestamped pre-18:10 observation is conceptually PIT-eligible. Provider entitlement/history contract remains NOT_FROZEN and no durable 18:10 receipt exists.
- Mandatory redundancy order: Taiwan market/Regime -> USD/TWD -> U.S. rates -> global equity state -> VIX/IV -> DXY.
- EUR/USD substitution and DXY-vs-USD/TWD divergence are mandatory falsifications.
- Machine-readable contract: `research/d13_05_dxy_pit_redundancy_spec_v0_1.json`.

### D13-08 metals / commodities / critical minerals
- Advances L1 -> L2.
- Commodity family split is mandatory:
  1. industrial/base metals (demand + supply + inventory);
  2. precious/monetary metals (USD + real rates + risk demand);
  3. critical/strategic minerals (technology demand + concentration + export controls + opaque markets).
- Copper price direction does not identify global-growth direction because supply shocks can generate the same move. CME HG is a clean prospective 18:10 market-price candidate if timestamped and contract/roll semantics are preserved.
- Gold is not an industrial-demand proxy and not a universal safe haven. CME GC is PIT-feasible but must be tested after DXY, real yields and VIX/IV.
- Critical-mineral markets can be economically important while price transparency is poor. Event/supply evidence may be more informative than stale price series.
- D13 owns global mineral state/event clock/source provenance; D10 owns Taiwan company/industry exposure, pass-through, inventory/capacity and beneficiary/victim mapping. No double-counting maturity.
- Regional price divergence must be retained; do not force one world price for rare/minor minerals.
- Machine-readable contract: `research/d13_08_commodity_family_spec_v0_1.json`.

### Unified receipt schema
- Frozen `research/global_market_receipt_v0_1.json`.
- One common PIT envelope now covers D12/D13 instrument families with explicit observedAt, capturedAt, knownAtTaipei, firstEligibleTaiwanDecision, latency class, entitlement, stale/revision and rules-version fields.
- Instrument-specific payloads remain separate. This prevents incompatible timestamps/latency semantics from being silently merged into one global score.
- Schema status: RESEARCH_ONLY_SCHEMA_FROZEN_NOT_IMPLEMENTED.
- Implementation is Class A only if isolated from Formal/shared runtime; otherwise proposal-first Class B.

### Optimization status
- No FORMAL_OPTIMIZATION_CANDIDATE yet.
- D13-05 and D13-08 remain evidence-pending; L3 requires durable PIT receipts plus independent-date/event evidence.
- Formal Core unchanged. No DXY/commodity/gold/mineral score, veto, sector bonus or position-size change.

## Updated exact next continuation

1. Provider/entitlement matrix for the unified receipt: DXY, HG copper, GC gold and critical-mineral event sources.
2. Research-only prospective 18:10 capture design; no historical first-known fabrication.
3. Continue D13-03 Japan/Korea L2 -> L3 feasibility by testing a clean Taiwan 13:30 -> Japan/Korea 14:30 Taipei subwindow source.
4. Integrate only PIT-safe lanes into D13-12 global-shock / Taiwan-residual research; missing lanes stay UNKNOWN.
5. Prospectively test whether DXY survives USD/TWD/rates/VIX controls and whether copper/gold survive global-risk controls before any optimization proposal.


## 2026-09-28 D13-03 / D13-12 continuation and evidence-source convergence

### D13-03 Japan/Korea clean post-Taiwan-close window
- Clean conceptual window frozen: Taiwan 13:30 close -> Japan/Korea regular close 14:30 Taipei.
- Japan TSE closes 15:30 JST; Korea KRX regular market closes 15:30 KST.
- The full same-day JP/KR close-to-close return remains ASIA_DAILY_MIXED_WINDOW because most of it overlaps Taiwan trading.
- Free official long-history intraday replay of the exact Taiwan-13:30 anchor was NOT established in the bounded source audit. JPX public historical TOPIX is daily; public intraday display is not equivalent to a durable long-history PIT archive.
- Korea now has extended/multi-venue trading structure after 2025; KRX regular close, after-hours and ATS extended session are separate objects and require rulesRegimeVersion.
- D13-03 remains L2 / 40%. Clean post-close feature = WAITING_SOURCE, not backfilled.

### D13-12 global-shock / Taiwan-residual deepening
- Naming firewall frozen: OBSERVED_MOVE != STATISTICAL_SHOCK != STRUCTURAL_SHOCK.
- Transmission estimation and 18:10 absorption prediction are separate estimands. Taiwan same-day response is an outcome for transmission studies but a legitimate known input for after-market residual-state prediction.
- Global layer remains VECTOR-FIRST; no scalar global risk score is approved.
- PIT residual model must estimate parameters only from prior dates. Full-sample beta/window selection is prohibited.
- Under/over-absorption labels require expected-response model + past-only residual scale; raw Taiwan-vs-US magnitude comparisons are insufficient.
- Falsification ladder now orders domestic Taiwan/sector baselines before global families and requires simple-vs-complex comparison, redundancy, crisis/event stratification and date placebo.
- D13-12 remains L2 / 40%; prospective evidence, not conceptual indicator invention, is the bottleneck.
- Machine-readable contract: `research/d13_12_global_absorption_residual_spec_v0_1.json`.

### Source/provider convergence
- Frozen unified envelope: `research/global_market_receipt_v0_1.json`.
- Frozen provider/entitlement matrix: `research/global_market_provider_entitlement_matrix_v0_1.json`.
- Highest readiness: public official schedule/FX/rate lanes with explicit timing.
- Next prospective market lanes: DXY, TX NIGHT_PRE_SCAN, WTI/Brent, HG copper, GC gold.
- Lowest source-readiness: historical macro consensus, opaque critical-mineral prices, long-history JP/KR clean intraday anchors.
- Critical-mineral research remains event-first where price transparency is weak.

### Optimization status
- Still NO FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.
- The next meaningful maturity step is prospective PIT evidence, not another global indicator.

## Updated exact next continuation

1. Design an isolated research-only prospective capture path around `GLOBAL_MARKET_RECEIPT_V0_1`.
2. Re-read governance before implementation and prove whether capture can stay Class A; if shared runtime/cron/schema/budgets are touched, stop at Class B proposal-first.
3. Start with the smallest high-value clock-clean set: TX NIGHT_PRE_SCAN + DXY + HG copper + GC gold + scheduled macro-event flags, while retaining existing CBC USD/TWD and prior-published UST state.
4. Preserve source/provider entitlement and latency for every receipt; UNKNOWN rather than synthetic zero.
5. After enough independent dates, test D13-12 absorption residual versus domestic Taiwan/sector baselines before considering any Formal optimization.
