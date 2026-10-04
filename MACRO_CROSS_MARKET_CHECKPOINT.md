# Macro / Cross-Market Checkpoint

Updated: 2026-09-28 20:35 Asia/Taipei
Formal Core: LOCKED
Current cursor: MC-001 through MC-148 complete.

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


## 2026-09-30 global prospective source-only evidence begins

- Latest main already contained `research/global_market_prospective_capture_design_v0_1.json`; this run continued it rather than creating a duplicate architecture.
- Implemented and tested `research/global_market_receipt_guard_v0_1.mjs` as isolated Class-A research infrastructure. It does not touch Worker, Cron, D1 production schema, API budgets, Formal selection, monitoring or pushes.
- Unified receipt schema `research/global_market_receipt_v0_1.json` is now partially implemented at the guard/schema layer and includes `TAIWAN_VIX`.
- First bounded source-only prospective pilot written:
  - `research/global_market_source_only_pilot_20260930.json`
  - capture clock 2026-09-30 05:20:18 Taipei;
  - target decision 2026-09-30 18:10 Taipei;
  - four source-only clean receipts:
    1. U.S. Treasury official 2026-09-29 nominal par curve;
    2. BLS Employment Situation schedule for 2026-10-02;
    3. BLS CPI schedule for 2026-10-14;
    4. BLS PPI schedule for 2026-10-15.
- The pilot explicitly inspects no Taiwan outcome and is classified `PARTIAL_SOURCE_ONLY_DATE__NOT_A_CLEAN_GLOBAL_VECTOR_DATE`.
- Same-U.S.-date future macro realizations remain absent. Schedule-known and realization-known are separate objects.
- DXY/HG/GC/TX were deliberately not fabricated into the 05:20 pilot because provider entitlement / decision-window capture had not been proven at that clock.
- Source-only evidence is append-only; missing lanes remain UNKNOWN.
- One partial pilot date does not justify D13 maturity promotion or any predictive claim.
- Formal Core remains LOCKED. `FORMAL_OPTIMIZATION_CANDIDATE = NO`.

## Updated exact next continuation

1. Continue source-only prospective collection across independent Taiwan decision dates; outcome joins remain CLOSED.
2. Add official/current TAIWAN VIX and TX NIGHT_PRE_SCAN via their tested isolated builders on eligible market dates.
3. Do not add DXY/HG/GC until provider entitlement and latency are frozen; provider choice cannot be selected after observing outcomes.
4. Preserve repeated versions of BLS schedule metadata so calendar revisions can be detected instead of overwritten.
5. After sufficient clean-date coverage, preregister the D13-12 absorption-residual outcome join and compare simple domestic/sector baselines before complex global vectors.
6. Still no scalar GLOBAL_RISK_SCORE; vector-first architecture remains authoritative.


## 2026-10-02 D13 source-attestation and event-clock falsification (MC-084–MC-089)

- Re-read latest main and reconciled the 2026-09-30 global pilot plus the independent 2026-10-01 D13-11 macro-schedule manifest. Latest canonical tracker baseline before this work: D12 40%, D13 41.5%, overall 47% over 229 modules.
- MC-084: independently recomputed all four 2026-09-30 stored receipt SHA-256 values and the ordered ledger digest: 4/4 exact match. This proves internal manifest integrity, not provider-native first-known capture.
- MC-085: audited original 2026-09-30 GitHub commit time (2026-09-30 05:24:29 Taipei) versus declared 05:20:18 capture; the close timing is plausible but commit/readback cannot authenticate provider-response availability. Official U.S. Treasury 2026-09-29 curve cross-check confirms recorded 2Y 4.89% and 10Y 5.26%; a current numerical match is not historical raw-response identity.
- MC-086: 2026-10-01 D13-11 five-item schedule-vintage manifest is useful dated research evidence but likewise lacks native source HTTP/connector body bytes/hash/length/immutable archive proof. The two legacy artifacts remain untouched and are excluded from strict clean prospective date counts until independently source-attested. Strict source-attested dates currently: **0**.
- MC-087: implemented `research/source_receipt_attestation_v0_1.mjs` and 13 locally executed adversarial tests, including attempted backdating, spoofed provider availability flag, late capture, unavailable raw bytes, tampered raw body, incorrect URL and entitlement failures. This new pure Class-A guard does not fetch, schedule, modify Worker, Formal or shared databases. Its PASS is synthetic unit evidence, not live provider proof.
- MC-088: latest public official UST table displays 2026-10-01 2Y 4.78% and 10Y 5.24%; this October 2 webpage cross-check is **DESCRIPTIVE_WEB_VERIFIED_NO_NATIVE_RESPONSE** and must not be backfilled as 2026-10-01 Taiwan 18:10 knowledge.
- MC-089: preregistered Oct 2 September Employment Situation schedule (2026-10-02 08:30 EDT = 20:30 Taipei) against the 18:10 selector. Keep event schedule known before decision separate from later first-print realization and subsequent TX night reaction. Friday/weekend gap, regular options expiry, concurrent global moves and post-release reactions are explicit competing explanations. Exact research contract: `research/d12_d13_20261002_nfp_event_clock_falsification_v0_1.md`.

New audit: `research/global_market_source_attestation_audit_20261002.json`. Source attestation upgrade is frozen in `research/global_market_prospective_capture_design_v0_1.json`.

**Maturity: unchanged. Outcome joins: CLOSED. Formal Core: LOCKED. No optimization candidate.**

## Exact next continuation after MC-089

1. Obtain a genuine authorized source response with raw bytes, transport-completed clock, source usage permission and immutable archive identity *during* a new prospective session; independently read back raw bytes before strict clean-date counting.
2. On future qualified dates capture official TAIWAN VIX during 09:00–13:45 and TX NIGHT_PRE_SCAN 15:00–18:10 before the decision; do not retrofit 2026-09-30/10-01 using complete-night bars.
3. For Oct 2 NFP event, preserve the 18:10 known schedule without inferred payroll surprise; separately timestamp future 20:30 realization and post-release TX response.
4. Once independent source-attested dates accumulate, test D13-12 residual versus Taiwan domestic/sector baselines using past-only parameters; preserve non-event Friday controls and separate expected/observed clocks.


## 2026-10-02 evening post-decision / pre-release QA (MC-090–MC-092)

- MC-090: exact local clock was post 18:10 and still pre 20:30. A live official BLS CPS page check at ~19:55 Taipei still displayed September 2026 Employment Situation as the **Next Release**, scheduled October 2 at 8:30 a.m. ET. No release value was present in the audited extract.
- MC-091: this proves a clean temporal distinction in the research design: at this later post-decision time the release was still unresolved. It does **not** retroactively authenticate what the 18:10 process captured. The observation is therefore `POST_DECISION_PRE_RELEASE_QA`, never an 18:10 parent.
- MC-092: frozen append-only artifact `research/d12_d13_20261002_postdecision_prerelease_source_qa_v0_1.json`. It separately records BLS pre-release status and TAIFEX VIX/statistical/live-source feasibility. Parsed connector output is not native raw-source attestation, so strict clean count remains unchanged.

Employment first print / payroll surprise remain UNKNOWN until actual official publication plus a separately preserved source object. Any post-20:30 market reaction is future relative to 18:10.

Formal Core LOCKED. No maturity promotion and no FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation after MC-092

1. Never edit the pre-release QA after publication; create a separate first-print object only in a later continuation when the release is actually observed.
2. Preserve first print and consensus as separate clocks/sources. If no authentic pre-release consensus vintage exists, surprise remains UNKNOWN.
3. Keep post-release TX/U.S.-market reaction as an outcome/mediator for the 18:10 study, not a predictor.
4. Continue source-attested independent-date accumulation before D13-12 absorption-residual outcome tests.


## 2026-10-03 Oct-2 Employment Situation release-vector continuation (MC-093–MC-096)

- Official BLS September 2026 Employment Situation content is now observable and verified:
  - release clock/embargo: 2026-10-02 08:30 ET = 20:30 Taipei;
  - payroll +29,000;
  - unemployment 4.2%;
  - labor-force participation 61.8%;
  - employment-population ratio 59.2%;
  - AHE +0.1% m/m and +3.0% y/y;
  - workweek 34.4 hours.
- July was revised +21k -> -10k (-31k) and August +162k -> +133k (-29k), combined -60k. Revisions are a separate release dimension.
- Project observation occurred on 2026-10-03, after publication. This verifies official release content but does **not** prove native project capture at the 20:30 release clock.
- Authentic pre-release consensus vintage remains absent. Therefore payroll/unemployment/wage/revision surprise = UNKNOWN. Current actual-vs-consensus claims from later websites are not admitted.
- The release's own prior-12-month payroll average (+45k) can be used only as internal historical context, not market surprise.
- Pre-release QA `research/d12_d13_20261002_postdecision_prerelease_source_qa_v0_1.json` remains immutable. Post-release object is separate:
  `research/d13_09_11_bls_employment_release_observed_20261003_v0_1.json`.
- D13-09 and D13-11 remain L2 / 40%; one later-observed official release is not multi-event source-attested prospective evidence.
- Formal Core LOCKED; outcomes still CLOSED for this macro-surprise lane.

## Exact next continuation after MC-096

1. Future BLS events: source-attest official first print at release time and preserve raw bytes/readback.
2. Consensus stays UNKNOWN unless an approved pre-release timestamped vintage is preserved before release.
3. Store headline payroll, unemployment, wage, workweek and revision vectors separately; no one-dimensional macro score.
4. Accumulate independent events, then test scheduled-event risk before signed-surprise direction.


## 2026-10-03 continuation — D13-14 fiscal / D13-15 financial conditions / D13-16 system liquidity

### D13-14 Fiscal Policy / Deficit / Government Spending
- Advances L0 -> L2 / 40%.
- Fiscal research now separates enacted policy, forecasts/baselines, Treasury cash receipts/outlays/deficit/financing, BEA NIPA government consumption/investment and debt-financing state.
- Raw deficit change is not automatically discretionary fiscal impulse; cyclical effects, interest cost, timing and one-offs must be separated.
- Short-run demand, borrowing/rates, private-investment and sector-composition channels can point in different directions.
- Official-source/PIT requirement: preserve announcement/enactment/effective clocks, MTS/DTS publishedAt/reference period, BEA vintage and forecast vintage.
- Machine contract: `research/d13_14_fiscal_policy_transmission_spec_v0_1.json`.
- No scalar fiscal bullish/bearish score.

### D13-15 Monetary Transmission / Financial Conditions
- Advances L0 -> L2 / 40%.
- Policy stance != financial conditions. Rates, credit spreads, equities, FX, housing and bank lending can move materially while the policy rate is unchanged.
- Chicago Fed NFCI/ANFCI and Fed FCI-G are different objects:
  - NFCI = broad weekly statistical financial-condition state;
  - ANFCI = conditions adjusted for macro activity/inflation;
  - FCI-G = model-based future-growth impulse from seven financial variables.
- NFCI/ANFCI history can revise with incoming/revised data and changing model weights. Current revised history is not automatically the real-time vintage.
- FCI composites must be tested after their own component baselines to avoid double-counting rates/equity/USD already in D13.
- SLOOS remains a distinct lower-frequency bank-credit standards/terms/demand object.
- Machine contract: `research/d13_15_monetary_financial_conditions_spec_v0_1.json`.

### D13-16 Central-bank Balance Sheet / System Liquidity
- Advances L0 -> L2 / 40%.
- Fed total assets, reserve balances, TGA, ON RRP and currency are distinct balance-sheet objects.
- Reserve balances can diverge from Fed asset-stock changes when TGA/ON-RRP/currency/other liabilities move.
- “net liquidity = Fed assets - TGA - ON RRP” is frozen as a heuristic, not a universal accounting identity or alpha formula.
- Ample reserves is a demand-dependent regime/range, not one fixed reserve-balance number.
- H.4.1 is the preferred official weekly decomposition source; release/reference clock and vintage must be preserved.
- Machine contract: `research/d13_16_central_bank_liquidity_spec_v0_1.json`.

### Current maturity / governance
- D12: 40.0%.
- D13: 34.7% across 19 modules.
- Room 09 weighted D12+D13: ~37.2%.
- Global tracker: 35.9% across 354 modules at this write.
- D13-14..16 are L2 mechanism+falsification only; no L3/PIT/OOS promotion.
- Formal Core remains LOCKED. Outcomes remain CLOSED. No FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation after MC-112

1. Continue D13-17 Trade / Geopolitical Risk / Capital-flow Transmission with tariff/export-control/sanction/capital-flow clocks separated from market reaction.
2. Preserve source-only fiscal, NFCI/ANFCI/FCI-G and H.4.1 vintages before outcome joins.
3. D13-15 composite conditions must beat component-only baselines; D13-16 liquidity decomposition must beat rates/USD/VIX/FCI baselines.
4. Do not create a scalar macro/liquidity risk score from the newly reconciled modules.
5. No L3 until independent Taiwan PIT/source-attested evidence exists.


## 2026-10-03 late continuation — D13-17 trade/geopolitics/flows + D13-18 cycle + D13-19 expectations/growth

### D13-17 Trade / Geopolitical Risk / Capital-flow Transmission
- Advances L0 -> L2 / 40%.
- Policy/event clock stack frozen: rumor -> investigation/proposal -> final action -> legal publication -> effective/compliance/customs-entry -> exclusion/license/expiry -> realized trade/financial flow -> market reaction.
- Tariff announcement != customs-effective exposure; export-control press release != generic effective date; sanctions designation/license/removal lineage preserved.
- Trade Policy Uncertainty (TPU) is separate from actual tariff level/effective policy.
- GPR (geopolitical risk) remains news-based context with threats vs acts separated; no directional score.
- Capital-flow object firewall:
  - TWSE foreign-investor trading = same-market trading flow;
  - CBC BOP = quarterly external-account flow;
  - U.S. TIC = lagged cross-U.S.-border securities/banking flow.
  These are not one `foreignCapitalFlow`.
- TWSE 18:10 version issue frozen:
  - aggregate file ~14:50 ex block / ~19:40 including block;
  - per-security file ~18:00 ex block / ~20:00 including block;
  - later full version cannot backfill 18:10.
- Fragmentation evidence is targeted/sector-country-pair dependent and can create diversion/connector beneficiaries, so D13 owns clocks/global state while D10/D07 own company/supply-chain exposure.
- Contracts:
  - `research/d13_17_trade_geopolitical_capitalflow_spec_v0_1.json`
  - `research/d13_17_event_flow_clock_schema_v0_1.json`.

### D13-18 Business Cycle / Leading-Coincident-Lagging Indicators
- Advances L0 -> L2 / 40%.
- “Leading” means leading the business-cycle reference series, not automatically leading stock returns.
- NDC leading/coincident/lagging families frozen separately.
- Critical stock-target circularity found: NDC leading index and monitoring indicators include TAIEX. Aggregate NDC leading/monitoring states cannot be used as clean Taiwan-stock predictors without an ex-TAIEX/component-only falsification.
- NDC monthly publication/reference-month clocks separated; NDC explicitly revises history monthly as components/source data/seasonal and trend adjustments update.
- OECD CLI is qualitative turning-point context; NBER cycle dates are retrospective labels and never valid historical live features before their announcements.
- Contract: `research/d13_18_business_cycle_indicator_spec_v0_1.json`.

### D13-19 Capital Market Expectations / Long-run Growth Drivers
- Advances L0 -> L2 / 40%.
- Structural growth capacity, expectations and asset valuation are separate objects.
- Long-run potential growth decomposed into labor-force/input growth plus productivity; productivity includes capital accumulation/deepening and TFP under the chosen framework.
- Fed SEP = policymaker conditional projection, not market consensus.
- Nominal Treasury yield = expected short-rate path + term premium under term-structure interpretation; no pure-growth shortcut.
- Breakeven inflation contains expected inflation + inflation-risk premium + TIPS-liquidity effects.
- r-star and term premium are model-estimated latent objects with model/vintage uncertainty.
- AI/technology capex is not realized TFP; horizon mismatch blocks using slow structural-growth objects as next-day alpha without separate transportability evidence.
- Contract: `research/d13_19_capital_market_expectations_longrun_growth_spec_v0_1.json`.

### Current maturity / governance
- D12: 40.0%.
- D13: 41.1% across 19 modules.
- Room 09 weighted D12+D13: 40.6%.
- Global tracker: 38.1% across 354 modules at this write.
- D13-17..19 are L2 mechanism+falsification only; no L3 promotion.
- Outcome joins remain CLOSED for these new lanes.
- Formal Core remains LOCKED; no FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation after MC-141

1. Stop adding macro concepts temporarily; begin source-only vintage evidence for D13-14..19.
2. Priority public-official source vintages:
   - NDC monthly business indicators + component definition/vintage;
   - Fed SEP / CBO structural-growth projections;
   - Fed H.4.1 balance-sheet components;
   - CBC BOP;
   - one USTR/BIS/OFAC policy-event lineage with announcement/legal/effective clocks.
3. Audit TWSE 18:10 foreign-flow version/source entitlement; never substitute the 19:40/20:00 full versions.
4. Build no scalar macro/geopolitical/liquidity/growth score. Every composite must beat its simpler components and Taiwan domestic/rates/USD baselines.
5. Preserve D13-18 -> D18-15 ownership boundary: D13 measures first-known cycle state; D18 tests strategy effectiveness conditional on that frozen state.
6. No L3/OOS/Formal promotion until independent source-attested vintages/dates exist.


## 2026-10-04 Room09 continuation — MC-148 / source-only NDC and SEP vintage audit



Status: RESEARCH_ONLY / LATER_OBSERVED_SOURCE_QA / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED.

- MC-142: Latest main at first read was 46ffc0e665cbcedf89fa84620de0a97bdff7a347. D13-17/18/19 already L2/40 with research/MC-113..141 and Router/Map synchronized; no reconciliation rewrite. Recomputed D12 40.0%, D13 41.1%, room 09 40.6% across 36 modules. Parallel-room maturity is not this run's contribution.
- MC-143: Official NDC method has X13, two-stage HP, mean absolute deviation standardization, equal-weight composition, amplitude adjustment and trend restoration. A final published index cannot be reduced by subtracting TAIEX raw price. Conditional pre-amplitude standardized identity is (7*Z_all-Z_TAIEX)/6, only if the same-vintage standardized inputs exist. An independently recalibrated six-component index is a new research object, not an official NDC index.
- MC-144: NDC search-service opens returned 403, Python urllib GET returned 403; bounded curl GET succeeded HTTP 200. Native 11508 attachment download completed 2026-10-03T23:59:34.344603Z, 860717 bytes, SHA256 c035dc5bbd3fe91ca80a620fd84828a54e8c49885a1b3aa51db5e42857772c83. Five sheets, 537 rows each including header inspected by read-only OOXML extraction. No entitlement or immutable native archive/readback proof; therefore no strict source attestation or historical first-known promotion. Raw files were temporary QA inputs, not a durable source archive.
- MC-145: Leading raw sheet omits TIER manufacturing-climate component, exposes nominal M1B/equipment imports, and has latest employee-net-accession ellipsis. Standardized vintage components, deflators, hidden estimated inputs and calibration/amplitude factors are not established. Thus numeric official ex-TAIEX reconstruction from this annex alone is UNKNOWN. Ellipsis is missingness, never 0 or BAD; published aggregate does not authenticate unavailable constituents.
- MC-146: Concrete revision witness: July release headline 104.63; August annex revised July 103.87791359650292 and August 104.40865987750504. Same-vintage MoM is positive ~0.51%, but cross-release splice is negative ~0.21%. This is revision contamination, not proof of August contraction. Months within a single revised history are not independent vintage evidence. July/August text each names 4/6 rising non-price components; this optional breadth object loses magnitudes and remains a distinct preregistered custom context.
- MC-147: Independently read Fed June 17 and September 16 2026 original accessible SEP pages. Release 14:00 EDT is next calendar date 02:00 Taipei. Compare calendar year+variable+statistic+unit+definition. Same 2026 medians changed GDP +0.1pp, unemployment -0.2pp, PCE +0.1pp, core PCE +0.1pp, policy +0.3pp. These are policy-projection revisions, not market surprises. 2029 is newly added; missing June horizon cannot become zero.
- MC-148: SEP GDP/PCE are Q4/Q4, unemployment Q4 average, policy year-end midpoint. Core-PCE longer-run is not collected. Aggregate median changes are not same-person revisions; anonymous distributions and horizon-specific participation matter. Unchanged long-run GDP median 2.0 does not imply unchanged distribution (central tendency June 1.8–2.0, September 2.0–2.2). September comparator row cross-checks June page but does not prove native capture at June release.

Positive mechanism: cycle components may describe slow demand breadth, SEP revisions may distinguish growth from discount-rate transmission. Counterevidence: revision/estimation and price circularity can create spurious timing; public macro news may already be absorbed in rates/USD/global and Taiwan prices. Taiwan incremental value remains UNPROVEN. Baselines: Taiwan price/sector -> macro component-only -> rates/USD/global -> candidate; no duplicate composite votes.

Validation requirements remain PIT/source attestation, first-known vintage, independent release/event dates, frozen horizons, OOS/walk-forward and overlapping-window purge, prospective Shadow, leave-one-event-out/regime tests, transaction costs, selection/look-ahead/overfit and multiple-testing accounting. Outcomes not inspected. No test-PASS or alpha/OOS claim from OOXML inspection or arithmetic.

Artifacts:
- research/d13_18_ndc_vintage_reconstruction_audit_20261004_v0_1.json
- research/d13_19_sep_projection_vintage_audit_20261004_v0_1.json

Maturity unchanged: D13-18/19 L2 40%; D12 40.0%; D13 41.1%; room09 40.6%. Strict clean prospective dates added: 0. FORMAL_OPTIMIZATION_CANDIDATE NONE. Formal Core LOCKED; no runtime, score, ranking, signal, portfolio or push changes.

Exact next continuation: obtain/readback authorized NDC native vintage archives and standardized/estimated component transforms; if unavailable, retain numeric official ex-TAIEX UNKNOWN and separately preregister six-component macro breadth. Then CBO original projection vintage/assumptions, H.4.1 decomposition, CBC BOP/policy lineage and TWSE 18:10 version receipts. Do not repeat MC-142..148 or pretend these later observations were release-time captures.


## 2026-10-04 Room09 — MC-149..152 CBO projection assumption-clock audit

Status: RESEARCH_ONLY / LATER_OBSERVED_OFFICIAL_WEB_QA / OUTCOMES_CLOSED.
Observed 2026-10-04 approximately 08:25–08:28 Asia/Taipei. Recovery base main: 589534a945cda7b41593e57042be79337d02e429. MC-142..148 and DR-001..066 were read, not repeated.

- MC-149: Official report landing page https://www.cbo.gov/publication/61882 states publication February 11, 2026; https://www.cbo.gov/publication/62105 is its detailed HTML report, not a second independent projection vintage. Same report title/content and landing-page links must be resolved before counting independent releases. Search-engine publication-age metadata is not release evidence.
- MC-150: Report notes expose distinct assumptions: trade policy cutoff 2025-11-20; economic developments/laws cutoff 2025-12-03; demographic laws/policies cutoff 2025-09-30; budget legislation cutoff 2026-01-14. Publication is not universal information cutoff. Record these fields separately; preserve UNKNOWN intraday release/capture clocks. Budget years are fiscal years; economic years are calendar years. Do not join equal year labels without basis reconciliation.
- MC-151: Official data catalog https://www.cbo.gov/data/budget-economic-data lists economic projection vintages February 2026, September 2025, January 2025. A February-vs-January comparison is not the latest-adjacent revision if September exists; however partial September coverage may differ and must be inspected, not presumed identical. Potential GDP and underlying inputs are included in projection supplements from January 2020. Native workbook rows, headers, hashes and archive readback are NOT yet verified. Three link clicks returned tool argument-resolution errors; direct catalog and report landing-page reads succeeded. This is route QA, not missing-data proof or completed workbook comparison.
- MC-152: Preregister source-only alignment: variable + calendar/fiscal basis + year/horizon + annual-average/Q4-Q4/unit + actual/estimate/projection + assumption cutoffs + vintage identity. Common-horizon deltas only; new years remain NOT_COMPARABLE, never zero. Separate labor supply, capital and productivity assumptions; no AI-capex-to-realized-TFP shortcut. No surprise without independently archived pre-release expectations. No structural forecast-to-next-day Taiwan alpha claim.

Mechanism: changed structural growth assumptions can distinguish demand/productivity and discount-rate channels. Counterevidence: unchanged headline forecasts may hide offsetting assumptions; forecasts are conditional model outputs and may be stale by publication; public information may already be priced. Taiwan exposure mapping belongs to D07/D10; strategy effectiveness conditional on frozen macro state belongs to D18. Require Taiwan price/sector, rates/USD/global component baselines, costs, PIT, independent events, OOS, leave-one-event-out and multiple-testing controls before promotion. No outcomes inspected.

D12 40.0%; D13 41.1%; room09 40.6%, unchanged. D13-19 remains L2/40%. Strict clean prospective dates added=0. FORMAL_OPTIMIZATION_CANDIDATE=NONE. Formal Core LOCKED. No runtime/selection/signal/push/capital changes. Global tracker observed 42.4% / 354 modules; other-room progress is not credited to this audit.

Exact next: resolve/download permitted February 2026, September 2025 and January 2025 CBO original economic projection supplements via the official report/catalog, preserve raw identity, inspect common-variable/horizon coverage and assumptions outcome-blind. Do not repeat MC-149..152. Then H.4.1 decomposition and CBC BOP/policy/TWSE version receipts. NDC official numeric ex-TAIEX remains UNKNOWN pending same-vintage standardized/estimated inputs and authorized archive/readback. Raw attestation and true prospective dates remain required for L3.


## 2026-10-04 Room09 — MC-153..164 CBO coverage, H.4.1 decomposition and CBC vintage firewall

Run started 2026-10-04 08:40 Asia/Taipei. Recovery main 55bd2b5e9d9ffa329eebb694f49e0306ac3c711a. RESEARCH_ONLY / SOURCE_QA / OUTCOMES_CLOSED / NO_PROMOTION. No MC-149..152 repetition.

### MC-153..158 — CBO official transformed-data audit
- Official CBO data page explicitly routes automated use to US-CBO/cbo-data. README says outputs transform source spreadsheets; canonical originals remain cbo.gov. Verified source commit 284a95665f9f2f74ed1f482feb629b43fce323da with connector and downloaded nine pinned CSVs + schema/catalog. Artifact manifest records URLs by path, exact byte counts/SHA256. This authenticates later-retrieved transformed content only, not historical first-known/native XLSX.
- Nine CSVs total 25,480 rows; no duplicate (date,variable) within any file, all numeric finite, no blank values or unknown schema variables. Cross-file uniqueness requires vintage+frequency+date+variable; calendar/fiscal annual dates are bare year strings despite README examples CY/FY. A parser relying on examples would generate false missingness or mix year bases. An initial CY2026 query returned no rows; inspecting actual labels and correcting to 2026 recovered values. No source absence claim from that failed query.
- Quarterly 2025-01: 7,728 rows/138 variables/2022q1..2035q4. 2025-09: 1,092/39/2022q1..2028q4. 2026-02: 8,176/146/2023q1..2036q4. September has only potential_lfpr from the potential family, no real_potential_gdp or labor-force/productivity decomposition. Structural revisions need January->February common rows, labeled LAST_AVAILABLE_COMPARABLE_VINTAGE rather than latest-adjacent; September absence remains NOT_IN_VINTAGE.
- Calendar annual real-GDP growth fields for 2026: 1.827/2.034/2.364 percent for Jan/Sep/Feb. Independent ratios of annual mean quarterly levels give 1.827985/2.034225/2.364424 percent; Q4/Q4 gives 1.805989/2.161528/2.228176. Hence calendar annual field is annual-mean YoY and cannot silently replace report Q4/Q4 headline or Fed SEP. Small field/level-derived differences require upstream precision reconciliation, not redefinition.
- Calendar 2026 potential-output growth Jan->Feb 2.286->2.215%; potential labor-force growth 1.098->0.557%; labor-force productivity 1.174->1.648%. Directional offsets matter. Exact level-based multiplicative labor*productivity reconstruction agrees with potential-output growth within <0.0002 percentage points. This is arithmetic/mechanism evidence; it neither proves AI causality nor next-day Taiwan alpha. No missing September values imputed.
- Official transform parser derives estimate_type from workbook fill styles and identifies projection columns using a final different-color run. CSV labels therefore require original-cell verification; current shared schema is not automatically vintage-specific definition proof, especially 2026 Census/BLS splitting. Original URLs were resolved from official etl/config.py; all three bounded native XLSX GETs returned 403. Respect block; no bypass. Initial missing bs4 dependency was handled via standard HTML parser; initial transform filename 404 corrected by repository tree. Hashing/transformed QA does not satisfy native-source attestation or Taiwan L3.

Artifact: research/d13_19_cbo_three_vintage_source_qa_20261004_v0_1.json.
Sources: https://www.cbo.gov/data/budget-economic-data ; https://github.com/US-CBO/cbo-data/blob/284a95665f9f2f74ed1f482feb629b43fce323da/README.md ; same commit etl/config.py, etl/transform_econ_projections.py and data/economic/economic_projections/schema.json.

### MC-159..161 — H.4.1 reserve-factors witness
Official dated page https://www.federalreserve.gov/releases/h41/20261001/ and release-method page https://www.federalreserve.gov/releases/h41/about.htm independently read. Later official web QA only, no source-attested release-time capture.
- Reference week/Wednesday=2026-09-30; release date=2026-10-01. Typical Thursday 16:30 New York converts to Friday 2026-10-02 04:30 Taipei under DST; winter typical clock is 05:30. Typical schedule is not exact actual release/capture proof. Do not use Wednesday data before Thursday publication or backfill Oct1 Taiwan 18:10.
- Table1 millions USD, weekly averages: supplying factors 6,790,836; absorbing excluding reserves 3,842,746; reserves 2,948,090. Level closure exact. Weekly changes -9,687 - (-27,584) = +17,897 reserves. Falling supplying factors coexist with rising reserves. This is reserve-factor accounting, not an assertion of QE or bullish stock liquidity.
- Wednesday point reserves 2,881,686 differ from weekly average 2,948,090. Never mix timing bases. Reverse repos total=329,260 average, foreign official=325,518, others=3,742. Total reverse repos are not domestic ON RRP; others is not an independently matched daily NYFed facility receipt. TGA average=948,674, Wednesday=984,046. Currency/other deposits/liabilities remain required. Assets-TGA-ONRRP heuristic is not reserve identity or automatic directional score.

### MC-162..164 — CBC flow and revision witness
Official releases:
https://www.cbc.gov.tw/tw/cp-302-191278-bfcdf-1.html (2026-05-20 Q1)
https://www.cbc.gov.tw/tw/cp-302-192739-2cf64-1.html (2026-08-20 Q2)
https://www.cbc.gov.tw/tw/cp-432-182951-a9c69-1.html (2025-08-20 Q2)
All later-observed web QA; no native annex, first-known capture, strict prospective count.
- Q2 2026 portfolio net-assets +48.1 = resident foreign-assets +67.1 minus nonresident liabilities +19.0, billions in original units are USD100m (億美元). Nonresident increase is mainly overseas corporate bonds, not proof of Taiwan-equity buying. Q1 +415.1 = +161.7 - (-253.4); negative nonresident investment mainly Taiwan-equity selling. Quarterly cross-border net assets, TWSE daily institution trades and actual FX conversion/hedging are distinct. Sector transmission needs D07/D10; domestic institution flow remains D06.
- Revision/discrepancy witnesses: August H1 financial net-assets 1,181.2 less Q2 537.9 implies Q1 643.3, whereas May Q1 headline=648.6; -5.3 cannot be ordinary one-decimal rounding. August Q2 current-account 584.9 minus same-vintage stated YoY increase 212.9 implies prior-year Q2=372.0; 2025 release gave 362.3. These are cross-release inconsistency/revision flags, not silently repaired historical observations; annex/version reconciliation required. H1 current-account implied Q1 625.4 vs May625.3 can reflect rounding and is not independent revision proof.
- Q2 component sums current-account585.0 vs headline584.9; finance538.0 vs537.9, consistent with component rounding. Current-account584.9 minus finance537.9 minus reserves7.9 leaves39.1; do not label it a capital-flight residual or assign entirely to errors/omissions without capital-account/full annex/sign convention. Next release is scheduled 2026-11-20 16:20 per Q2 page, not a realized publication. Quarter-end is never knownAt. Preserve announced schedule, actual publication/capture, reference quarter and revised-version identity separately.

### Incremental-value falsification and continuation
Positive mechanisms: growth composition, reserve liability shifts and investment-instrument composition can distinguish macro states that identical headlines conceal. Counterevidence: conditional projections, accounting reallocation, seasonal/quarter-end balance-sheet moves, trade-credit settlement and prior market absorption may fully explain apparent direction. No scalar macro score.
Freeze Taiwan price/sector -> domestic institution flow -> rates/USD/global -> candidate baseline order, then independent release-level comparisons with costs, OOS/walk-forward, overlapping-horizon purge, leave-one-event/regime-out and multiple-testing accounting. Do not count thousands of CSV rows, quarters inside a revision file or constituent arithmetic as independent prospective events.
D13-16/17/19 remain L2/40%; D12=40.0%, D13=41.1%, room09=40.6%. Strict clean prospective dates added=0. Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE=NONE; outcomes CLOSED. No Worker/runtime, rankings, signals, push, capital or holdings changes. Global tracker observed42.4%/354 modules, not this run's promotion.

Exact next: obtain permitted CBO native XLSX (or explicitly validated official original archive) and verify projection shading/definition against pinned transformed rows; do not bypass 403. Read CBC May/August/2025 annex vintages to reconcile the -5.3/+9.7 discrepancies; keep UNKNOWN until complete signs/rows are verified. Then audit one USTR/BIS/OFAC announcement/legal/effective policy lineage and TWSE 18:10 foreign-flow version receipts. For H.4.1, preserve a future authorized raw receipt at actual publication; independently matched NYFed ONRRP before heuristic comparisons. NDC ex-TAIEX remains UNKNOWN pending standardized vintage inputs. Do not repeat MC-153..164.


## 2026-10-04 source-lineage deepening — MC-149..MC-156
- MC-149..151 are D12 cross-links; canonical D12 details live in DERIVATIVES_VOLATILITY_CHECKPOINT.md.
- MC-152: CBC BOP Q2 release fixes quarterly-flow semantics and explicitly schedules next release 2026-11-20 16:20. Quarterly BOP and daily TWSE foreign trading are different populations/clocks.
- MC-153: CBC 2026-Q3 release separates 2026-09-17 rate decision/release from selective-credit-control effective date 2026-09-18. Announcement/decision/legal/effective clocks must remain separate.
- MC-154: Fed H.4.1 has distinct week-average and Wednesday-level objects; DDP series identity/frequency/statistic/reference/release fields are mandatory. No asset-size=liquidity shortcut.
- MC-155: CBO 2026 baseline is assumption/cutoff dependent; potential-growth projection is structural context, not market consensus or next-session alpha.
- MC-156: TWSE 2026-10-02 foreign-flow table has precise venue/accounting coverage; it is not BOP portfolio flow or intraday foreign pressure. Later observation is not strict 18:10 first-known attestation.
- Durable evidence: `research/d12_d13_source_lineage_deepening_20261004_v0_1.md`.
- Maturity unchanged: D13 41.1%; outcomes CLOSED; FORMAL_OPTIMIZATION_CANDIDATE NONE; Formal Core LOCKED.

### Exact next continuation after MC-156
1. Prospectively preserve CBC 2026-11-20 16:20 BOP release if available, with prior-vintage/revision lineage.
2. Build append-only CBC policy announcement/decision/effective lineage.
3. Archive future H.4.1 series-specific vintages without mixing week-average/Wednesday stock.
4. Capture TWSE foreign-flow source response before/at an eligible future 18:10 research decision.
5. Independent PIT-clean dates are required before L3/OOS/optimization.


## 2026-10-04 Room09 — MC-165..172 native CBC revisions and BIS legal clocks
Run start 2026-10-04 11:34 Asia/Taipei. RESEARCH_ONLY / OUTCOMES_CLOSED / NO_PROMOTION.
Artifact: research/d13_cbc_native_revision_policy_lineage_20261004_v0_1.json.

### Append-only evidence-identity reconciliation
Two earlier source families reused MC-149..156. Retain both unchanged. Disambiguate by (evidenceId,sourceArtifact,runHeading), never evidenceId alone: CBO family research/d13_19_cbo_three_vintage_source_qa_20261004_v0_1.json and preceding MC-149..152 CBO heading; cross-link family research/d12_d13_source_lineage_deepening_20261004_v0_1.md. Max prior substantive sequence is MC-164; this run continues MC-165..172, next MC-173. No deletion, historical renumbering, false progress rollback or duplicate independent-event credit.

### MC-165 — three permitted native annexes
Retrieved CBC official XLSX at links attached to 2026-05-20,2026-08-20 and2025-08-20 releases. URLs, byte counts, SHA256, local completion time, selected raw cached cell strings and labels recorded in artifact. Respect allowed native downloads; no original-release byte attestation inferred. May has3 worksheets; August and prior-year August have4 because H1 comparison is additional sheet2. Historical current/financial sheets are May2/3 vs August3/4. Resolve table title/units/reference quarter and revision marker rather than ordinal index. Native p/r note=preliminary/revised. Standard-library OOXML read only; no formula recalculation; arithmetic at displayed0.01 USD100m while preserving raw serialization tails. Corrected an intermediate mistaken 'service detail' description to H1 comparison after native title read.

### MC-166 — Q1 2026 financial revision decomposes
May sheet1 B19=648.64; August sheet4 D32=643.30 with C32=1r. Delta -5.34 USD100m. Net direct73.68->73.02 (-0.66); portfolio415.07->417.78 (+2.71); derivative -2.31 unchanged; other162.20->154.81 (-7.39). Component deltas close -5.34 exactly. May resident-other assets292.62->283.05 and liabilities130.42->128.24 explain net-other change. Revised accounting cannot establish why source submissions changed or a new capital-flight event on original quarter date.

### MC-167 — small current-account change is a real revision
May CA625.29 vs August history625.35, C32=1r, delta+0.06. Goods580.05->584.04 (+3.99), services-34.23->-36.25 (-2.02), primary92.21->90.33 (-1.88), secondary-12.74->-12.77 (-0.03), exact sum+0.06. Previously headline-only625.3/625.4 allowed rounding; native revised row now resolves it. A tiny net revision conceals materially offsetting component changes; no gross double-counting score.

### MC-168 — prior-year base revision resolves +9.7 witness
2025 August native Q2 CA362.29; 2026 August same quarter revised372.01 (sheet3 C29=2r). Exact +9.72 USD100m. Goods+10.79, services-1.57, primary+0.47, secondary+0.03 close+9.72. Current Q2 YoY212.90 uses revised372.01. Applying original362.29 to current584.91 instead gives222.62: different version-defined comparison, not economic surprise. These endpoints do not identify intervening release or first revision time; lineage interval remains unresolved.

### MC-169 — complete signs close the earlier residual
August native Q2: CA584.91 + capital(-0.03) - FA537.89 + errors(-39.13) = reserves7.86 USD100m. May Q1 same identity closes -46.55;2025Q2 closes160.02. Eight targeted Decimal checks PASS:3 revision decompositions,3 BOP identities,2 Q2 component sums. The headline39.1 residual is accounted for by capital plus errors with proper signs; not identified equity withdrawal/FX demand. Q2 net financial84.68+48.06-88.32+493.47=537.89. Resident/nonresident net accounting remains distinct from TWSE daily equities and actual FX settlement.

### MC-170 — BIS original document boundary and clocks
Verified official govinfo PDF2025-19001,90FR47201, publication2025-09-30, effective2025-09-29; original press datedSept29 has no audited intraday time. Document's own footer Filed9-29-25;8:45am. First-page PDF includes tail/footer of PRECEDING2025-18992; never assign that identity to affiliates rule. Original text includes50-percent ownership restrictions and scoped temporary license endingNov28,2025; not universal transaction relief. Ownership, jurisdiction/items, party restrictions and exceptions remain separate from company-sector exposures.
Source: https://www.govinfo.gov/content/pkg/FR-2025-09-30/pdf/2025-19001.pdf ; https://www.bis.gov/press-release/department-commerce-expands-entity-list-cover-affiliates-listed-entities .

### MC-171 — supersession and scheduled phase
Official2025-19846 PDF90FR50857: filedNov10,2025;8:45am, effectiveNov10; publicationNov12. It stays changes throughNov9,2026 and schedules reinstatementNov10,2026 absent further extension/amendment. Future phase=SCHEDULED_SUBJECT_TO_AMENDMENT, not observed or guaranteed current law. Not an exhaustive intervening-amendment legal audit. PDF includes beginning of another Entity List rule after its own footer: exclude unrelated provisions. Filing footer's quoted clock has no encoded timezone; no invented UTC timestamp. Announcement, public inspection, formal publication, effective, transition expiry and local observedAt must remain separate.
Source: https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf .

### MC-172 — mechanism, falsification and eligibility
Possible incremental signal is revision composition/known legal phase conditional on Taiwan price/sector, domestic flow, rates/USD/global baselines. Rival explanations: reporting revisions, offsets, instrument/settlement shifts, anticipatory pricing, correlated diplomatic/macro events. Later retrieved official native bytes improve source QA but do not establish historical first-known or source-attested decision-time receipts. Raw native bytes are not durably archived by this JSON; hashes/excerpts are not archive/readback certification. No imputation, realized outcome joins, company eligibility claim or trading recommendation. Require contemporaneous immutable source receipt, event-cluster independence, exposure known at decision, costs, purged walk-forward/OOS, leave-one-event/regime-out and multiple-testing control before promotion.

D12=40.0%; D13=41.1%; room09=40.6%,36 modules unchanged. D13-11/16/17 stay L2/40%; strict clean prospective dates added0. FORMAL_OPTIMIZATION_CANDIDATE=NONE; Formal Core LOCKED. No runtime, selection, ranking, signal, push, capital/holdings change. Latest global tracker read43.7%/356 modules; concurrent other-room work is not credited to this run.

Exact next: MC-173. Bound CBC intermediate release lineage to identify when2025Q2 revisions became public; preserve future2026-11-20 scheduled BOP raw receipt only upon actual release and authorized archive/readback. For BIS, audit amendment/supersession chain before any current legal-state claim; resolve authoritative public-inspection availability and timezone only from direct evidence. D12 next remains permitted raw TAIFEX option-chain metadata/date/strike/bid-ask/settlement coverage and first-known receipts; later replay alone is not L3. CBO native403 remains blocked; no bypass. Do not repeat MC-165..172.
