# Macro / Cross-Market Checkpoint

Updated: 2026-09-28 18:58 Asia/Taipei
Formal Core: LOCKED
Current cursor: MC-001 through MC-049 complete.

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
