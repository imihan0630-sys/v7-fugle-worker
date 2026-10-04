# Market Microstructure Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: MS-001 through MS-044 complete.
Next: evidence accumulation; concept lane complete.

## Durable conclusions

- Market microstructure is a distinct information layer from K-line and price-volume.
- Bid-ask spread is both execution friction and an adverse-selection/liquidity signal; it is not directional alpha by itself.
- Order Flow Imbalance (OFI) is conceptually stronger than raw volume for short-horizon supply/demand pressure, but true OFI requires real quote/order-book event data.
- The same imbalance has larger price impact in thinner books; depth must therefore normalize imbalance interpretation.
- Imbalance persistence can arise from order splitting, but persistent pressure can later reverse; do not map imbalance monotonically to bullish/bearish labels.
- Queue imbalance has documented one-tick-ahead predictive value in limit-order-book research, especially for large-tick stocks; this does not establish 15m or multi-day alpha.
- A simple weighted-mid is only a proxy. Do not label it a fitted Stoikov microprice.
- Trade aggressor side inferred from price/quotes is imperfect. Fugle bid/ask-at-trade plus provider inside/outside volume can support research proxies, but inferred/provided pressure must not be called ground-truth OFI.
- Execution cost must remain separate from selection/signal quality. No real fill => no implementation-shortfall claim.
- Intraday liquidity has time-of-day structure; same-slot normalization is the default research design.
- Taiwan-specific price limits, tick sizes, call-auction periods, volatility interruptions and odd-lot mechanics require explicit controls.
- OHLCV cannot reconstruct true OFI, cancellations, queue state or full depth. Historical backfill from candles is prohibited.
- Preferred architecture remains six layers: Liquidity Cost / Available Depth / Pressure / Price Response / Persistence / Constraint.
- Highest-value integration point is 15m BUY and Execution Alpha research, especially false-breakout, chase/slippage and absorption diagnostics.
- Fugle data availability is sufficient for prospective Shadow microstructure research: quote, trades, volumes and WebSocket books/trades expose useful fields.
- Current main-source Worker audit shows candles + quote calls but no direct use of trades/volumes or quote depth/inside-outside fields. This is source truth only; deployed runtime can differ due to guarded deploy patches.
- Formal Core remains LOCKED. This lane is research-only / Shadow.

## Pre-registered minimum Shadow V1 fields

1. msQuotedSpreadBps
2. msDepthImbalance1
3. msDepthImbalance5Notional
4. msTradePressureProxy (provider inside/outside proxy; NOT true OFI)
5. msWeightedMidProxyBps
6. msTransactionRate
7. msSessionState
8. msPriceLimitState
9. same-slot normalized spread/depth/pressure when historical coverage is sufficient
10. capturedAt/source/pointInTimeEligible/coverage/UNKNOWN provenance

## Positive hypotheses

- Tight same-slot spread + positive pressure + positive price progress improves 10m/30m follow-through versus price progress alone.
- Buy pressure without price progress is an absorption/exhaustion warning.
- Widening spread during chase-like conditions degrades execution alpha.
- Depth/queue state adds incremental information after current price-volume, ATR/liquidity, Residual RS, overheat, sector and regime controls.

## Counter-hypotheses / failure modes

- Displayed depth can be fleeting or canceled.
- High pressure can be late-stage chasing.
- Microstructure may add no incremental value after existing variables.
- Effects may disappear after cost, tick-size, price-tier and session controls.
- Results limited to opening minutes / one stock / one tier are fragile, not promotable.
- Prospective data may be insufficient.
- Taiwan call auction, price limit and volatility interruption mechanics can dominate normal continuous-market relations.
- Outcome-tuned thresholds are prohibited.

## Data source findings

Fugle official docs currently provide:
- intraday quote with market-state / limit / halt / trial / continuous fields and quote data;
- intraday trades with bid/ask/price/size/time/serial;
- intraday volumes with price-level volumeAtBid / volumeAtAsk;
- WebSocket books with best-five prices/sizes plus isContinuous/isTrial;
- WebSocket trades with event-level trade data.

Fugle explicitly excludes the opening first trade from its inside/outside-volume calculation because opening call auction may not represent the same supply-demand mechanism.

## MS-013 through MS-018 durable update

- Absorption is dynamic: pressure + repeated opposing-side replenishment + weak price response. One large displayed queue is insufficient.
- Liquidity-vacuum breakouts and depth-supported breakouts must be separated; a large move in a thin book can reflect high price impact rather than strong demand.
- Failed-breakout research is pre-registered around spread widening, pressure-price divergence, replenishment and depth-imbalance flips, with matched successful-breakout controls.
- Taiwan 2004 order-imbalance evidence supports persistence from order splitting/herding but little aggregate price pressure beyond one day; trader-class findings are historically bounded and must not be transplanted to 2026.
- 2026 TWSE market-structure commentary indicates a much more institutionalized market than circa 2000, strengthening the need for current revalidation.
- V8.8.1 already records top-five bids/asks, spreadPct, bidDepth5, askDepth5, depthImbalance and executionMarketState in the research recorder. Do not duplicate these fields.
- Current recorder event cadence (open, first 10m/15m/30m, formal signal) is too sparse for true event-level OFI or seconds-scale resiliency.
- Incremental priority is now same-slot normalization, trade-pressure proxy, pressure-to-price response, weighted-mid displacement, transaction rate, replenishment/resiliency and persistence states.
- Adding new REST trades/volumes calls directly to Formal monitoring can create shared-runtime risk and should be Class B unless isolated. Preferred future design is a separate research-only capture path.

## Exact next continuation

- MS-019 minimum prospective cadence/storage burden for replenishment.
- MS-020 adverse-selection / post-trade markout.
- MS-021 Taiwan tick-size-band / thousand-dollar normalization.
- MS-022 price-limit-proximity nonlinear behavior.
- MS-023 cross-lane redundancy matrix.
- MS-024 frozen empirical protocol before implementation.

Files:
- MICROSTRUCTURE_RESEARCH.md
- MICROSTRUCTURE_CHECKPOINT.md


## MS-019 through MS-024 durable update

- Dynamic replenishment/resiliency cannot be inferred from the current sparse open/10m/15m/30m/signal snapshots; prospective high-frequency/event-driven data are required.
- Cadence pilot is frozen to compare 1s / 5s / 15s state-reconstruction fidelity without return outcomes; per regular 4.5h session this is 16,200 / 3,240 / 1,080 buckets per symbol.
- Post-fill markout and implementation shortfall are only valid when genuine fills exist; otherwise use post-signal/post-pressure mid moves.
- TWSE tick normalization is mandatory: stock ticks are NT$0.01 / 0.05 / 0.10 / 0.50 / 1 / 5 across the official price bands, making thousand-dollar stocks structurally distinct.
- Price-limit proximity and volatility-interruption/trial states are separate nonlinear regimes, not automatic BAD observations.
- Cross-lane redundancy matrix is frozen; existing spread/depth fields must be reused, and new variables need stable incremental value after K-line, price-volume, ATR/liquidity, Residual RS, sector, regime and overheat controls.
- First empirical protocol is frozen prospectively. Primary horizons are +1m/+5m/+10m/+15m/+30m, 15m/30m MFE/MAE, breakout hold/failure and fill-quality outcomes only where fills are verified.
- Next action is evidence collection from the existing recorder before any new runtime capture is proposed.

## Revised exact next continuation

- MS-025 quantify actual existing execution-recorder coverage by event/date.
- MS-026 test whether existing spread/depth snapshots can answer a first baseline question with zero code.
- MS-027 if coverage permits, pre-register/run zero-code baseline using existing fields.
- MS-028 only if inadequate, prepare isolated research-capture proposal with cadence/storage/rate-limit budget.


## MS-025 through MS-026 — recorder coverage gate
- V8.8.0 writes are prospective/event-driven only at OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE and FORMAL_SIGNAL_OBSERVED while monitor results exist.
- Current read contract cannot prove exhaustive date/event coverage: rolling days only, newest-first SQL LIMIT 500, only newest 80 exposed, no exact-date cursor/truncation/expected-event/completeness fields.
- Coverage by historical event/date is therefore NOT_QUANTIFIABLE_FROM_CURRENT_READ_CONTRACT. Missing rows remain UNKNOWN, never NO-BUY/BAD/0.
- Sparse snapshots can describe captured spread/depth state but cannot identify seconds-scale replenishment/resiliency or true OFI.
- MS-026 zero-code inferential baseline is DATA_QUALITY_BLOCKED. Running outcome comparisons on returned rows would create coverage/selection bias. Descriptive audits may label the sample non-exhaustive but cannot estimate event frequency or absence.
- Counter-hypothesis: zero-code would be sufficient if complete target-date coverage were proven; current contract does not prove it.
- Shared endpoint completeness extension remains Class B proposal-first. No runtime/Formal/monitor/signal/capital/push change.

## Revised exact continuation
- MS-027 blocked until complete-enough recorder evidence exists; do not run on convenience samples.
- MS-028 prepare isolated research capture/readout design only, with cadence/storage/rate-limit budget and proof Formal runtime semantics are untouched. Re-evaluate MS-027 first if a complete existing artifact/readback appears.


## MS-027 through MS-043 — concept convergence
- MS-027 zero-code baseline remains DATA_QUALITY_BLOCKED because recorder coverage is not exhaustive.
- MS-028–032 froze an isolated-collector architecture, Fugle quota/storage budget, compact bucket schema and explicit completeness contract. Dynamic research requires prospective data; no historical OHLCV reconstruction.
- Official Fugle plan evidence: Basic currently supports 5 WebSocket subscriptions / 60 intraday REST calls per minute; Developer 300 / 600; Advanced 2000 / 2000. Books+trades requires 2 subscriptions per symbol. Actual account plan remains UNKNOWN until verified.
- Illustrative fixed-bucket burden shows 1s permanent capture scales too quickly; pilot 1s/5s/15s fidelity before choosing cadence.
- MS-033 retained flow-toxicity as a concept but explicitly rejected VPIN as a magic metric because published evidence is contested and sensitive to intensity/classification/sampling.
- MS-034 public top-five depth is only displayed liquidity; hidden liquidity exists and intent such as spoofing/iceberg cannot be asserted from public patterns alone.
- MS-035 separated signal quality, executable price quality and limit-fill probability. Hypothetical touch != proven fill.
- MS-036 separated transient from retained price impact; simple multi-horizon retention/retracement study preferred over structural impact modeling.
- MS-037 froze breakout/failed-breakout microstructure event-study windows and matched controls.
- MS-038 concluded a separate research collector is scientifically justified but is Class-B infrastructure proposal-first; no deployment.
- MS-039 created `MICROSTRUCTURE_COLLECTOR_PROPOSAL.md` with isolation/quota/storage/fidelity/go-no-go gates and no code/deploy.
- MS-040 current TWSE opening/closing/VI call auctions are separate regimes from continuous trading.
- MS-041 price discovery can arrive with lag; pressure must be tested at multiple horizons rather than only immediate reaction.
- MS-042 market/industry-wide liquidity commonality is documented globally and in Taiwan; stock liquidity stress must be separated from sector/market liquidity stress.
- MS-043 introduced a research-only Liquidity Regime layer distinct from Price Regime.
- Conceptual microstructure lane is now converged. Additional indicator invention is paused to avoid Factor-Zoo risk.
- Formal Core remains LOCKED; no Formal/monitor/signal/capital/push change and no deployment.

## Exact next continuation
- MS-044 mark concept lane CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Start new durable lane: Market Breadth + Sector Rotation + Leadership.
- First tasks: breadth definitions, advance/decline structure, new-high/new-low participation, breadth divergence, industry momentum/rotation, leader participation, Taiwan data-source feasibility, positive/counter evidence.


## MS-044 — lane state
- Market-microstructure concept learning is now CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Dynamic evidence requires prospective complete capture; collector proposal exists but is not deployed.
- No further indicator invention until data-quality/evidence gates permit testing.


## MS-025 through MS-032 durable update

- Existing recorder capability does not prove live D1 sample coverage. Runtime coverage remains UNKNOWN until authorized recorder rows are read.
- Zero-code baseline feasibility gate is frozen: multiple dates, complete monitored controls, non-null spread/depth fields, mechanism-state coverage, point-in-time outcome matching, explicit missingness, and tick-tier representation are required.
- A 2025 NTU high-frequency TWSE top-five study reports meaningful incremental information in levels 2-5 and significant short-horizon association of book imbalance with future returns; use as Taiwan-specific motivation, not a universal production rule.
- Taiwan price-limit policy-change evidence shows spread/depth/trader behavior distributions can shift structurally, supporting same-slot/own-history normalization rather than timeless absolute thresholds.
- Resiliency now uses dual clocks: elapsed time and number of book/trade events since liquidity shock.
- Deeper-book shape gets only a limited incremental test over best-level state to control Factor-Zoo risk.
- 2026 Taiwan derivatives spoofing research reinforces displayed-liquidity cancellation/survival risk, but no stock spoofing classifier or intent inference is permitted.
- Shadow state taxonomy frozen: LIQUIDITY_HEALTHY, DEMAND_ACCEPTED, DEMAND_ABSORBED, SUPPLY_ACCEPTED, SUPPLY_ABSORBED, LIQUIDITY_VACUUM_UP/DOWN, PRESSURE_EXHAUSTION_CANDIDATE, LIQUIDITY_STRESS, NON_CONTINUOUS_REGIME, UNKNOWN. No state directly maps to BUY/SELL.

## Revised exact continuation

- MS-033 deployment/version lineage audit for recorder fields.
- MS-034 top-five notional versus share weighting under Taiwan price tiers.
- MS-035 buy/sell pressure-response asymmetry.
- MS-036 exact opening/closing auction contamination windows.
- MS-037 cross-lane state integration without double counting.
- MS-038 smallest combined feature matrix before empirical work.


## Deployment-lineage correction — 2026-09-25

A source/runtime distinction is now explicit:

- Current `main/Worker.js` is a pre-build base and does **not** itself contain the V8.8.x execution-recorder fields.
- The production GitHub Actions workflow applies `scripts/apply_v8_8_0.py` and `scripts/apply_v8_8_1.py` sequentially before deployment, then explicitly validates that the built `Worker.js` contains:
  - `CREATE TABLE IF NOT EXISTS trade_research_execution_snapshots`
  - `/api/research/execution-recorder`
  - `RESEARCH_EXECUTION_RECORDER_FAIL_OPEN`
- The same workflow then applies later patches through V8.10.0 before uploading the built Worker to Cloudflare.

Therefore:
- “not present in main/Worker.js” is **not** evidence that the deployed build lacks the recorder;
- “patch scripts and build-time validation exist” is evidence that the normal deployment pipeline is intended to include the recorder;
- this turn did not independently read the live runtime source or protected recorder rows, so live-runtime deployment/coverage remains unverified here.

Use status:
- BUILD_PIPELINE_INCLUDES_RECORDER = VERIFIED
- LIVE_RUNTIME_RECORDER_PRESENCE_THIS_TURN = NOT_INDEPENDENTLY_VERIFIED
- LIVE_D1_COVERAGE = UNKNOWN

This supersedes any wording that treats raw main-source presence as the deployment proof.


## 2026-09-28 deep-research update — horizon transfer / D05-05 L2 gate

New durable conclusions:
- One-tick / short-interval queue imbalance and OFI evidence is real enough to motivate research, but it does not establish 15m or D1 alpha.
- Taiwan 2025 top-five evidence supports incremental information in deeper levels and also documents material heterogeneity by relative tick size, volatility and activity. This argues against universal raw imbalance thresholds.
- Event-to-15m translation is frozen as Pressure × Price Response × Persistence, with continuous/auction/VI/trial/odd-lot regime separation.
- Fugle 2026 stock WebSocket fields materially support prospective research: best-five books plus continuous/trial state and trade bid/ask/price/size/time/serial.
- Source-field existence is not capture completeness. L3 remains blocked until our own PIT event capture, missing-event detection, replay and coverage contract are demonstrated.
- D05-05 OFI now satisfies L2 curriculum semantics (mechanism + falsification defined), but not L3.

Cross-lane volatility conclusion:
- external volatility-scaling evidence is mixed in real-time/OOS tests;
- current Formal already conditions selection through ATR gate + ATR stop geometry + RR rejection/ranking;
- future volatility tests must decompose those layers before claiming independent alpha or proposing any throttle.

Revised exact continuation:
1. D04: build outcome-free ATR-conditioning decomposition spec across pre-ATR -> ATR gate -> stop geometry -> RR survival -> selected cohort.
2. D04: preserve prospective TAIEX RV5/RV20/RV5to20 raw primitives before any thresholding.
3. D05: do not invent additional indicators; wait for complete prospective capture or a proven complete recorder artifact.
4. D05: when capture is available, validate event/1m/5m -> 10m/15m/30m horizon retention using the frozen Pressure × Response × Persistence protocol.
5. Keep Formal Core locked; no spread/depth/OFI/ATR throttle or sizing change.


## 2026-09-28 21:04 deep-research update — dual-clock + ATR decomposition frozen

Durable D04 conclusions:
- ATR must be decomposed as pre-ATR eligibility -> explicit ATR gate -> channel-specific stop geometry -> RR survival -> final selection.
- B channel has a structural ATR-binding kink around ~1.8%-1.9% when close is near breakout; above it, ATR directly widens the stop and compresses RR for fixed target geometry.
- A channel can remain support-stop-bound over much/all of the 1%-10% ATR gate depending on structureLow/support, so pooled global ATR optimization is structurally suspect.
- RV5/RV20 is an overlapping-window state ratio, not an independent acceleration factor; do not count RV5, RV20 and their ratio as three separate votes.
- A non-overlapping recent-RV5 versus prior-RV15 comparison is retained only as a robustness/decomposition comparator.
- TAIEX official market RV provenance is materially stronger than stock-level continuity provenance. V8.12 RAW_HISTORY_ADMISSION does not certify corporate-action TECHNICAL_CONTINUITY.

Durable D05 conclusions:
- Wall-clock horizons alone are insufficient; every future microstructure study must preserve event intensity / event time.
- Published multi-horizon OFI evidence supports an effective stock-specific horizon near a small number of average price changes, not a universal number of minutes.
- First deeper-book test is top1 baseline versus one aggregate top-five block. Do not create separate level-2/3/4/5 factor zoo.
- TWSE call-auction / continuous / VI regimes and price-tier tick sizes are mandatory strata.
- Fugle source fields and plan limits make a 1-2 symbol isolated pilot technically plausible, but actual account plan, concurrent subscriptions and complete event-ledger reliability remain UNKNOWN.
- No D05 L3 promotion until own prospective PIT capture proves coverage/replay/missing-event semantics.

New machine artifacts:
- research/volatility_atr_conditioning_decomposition_v0_1.json
- research/microstructure_dual_clock_horizon_protocol_v0_1.json

Maturity decision:
- D04 remains 42%.
- D05 remains 46%.
- No module upgrade this round because no new own PIT/OOS/Shadow evidence was produced.

Exact next continuation:
1. D04 — outcome-free observability audit: determine which L0-L4 ATR decomposition fields already exist for all relevant candidate/reject cohorts and where Shadow sampling/first-failure bias blocks inference.
2. D04 — market RV capture gate: preserve or verify prospective TAIEX RV5/RV20/RV5to20 on clean post-capture dates; no retrospective first-known reconstruction.
3. D04 — only after independent clean dates exist, compare overlapping RV5/RV20 versus non-overlapping recent5/prior15 as robustness, not factor expansion.
4. D05 — evidence gate remains prospective complete capture. Before any outcome study, verify actual collector plan/quota and event completeness if/when infrastructure is owner-authorized.
5. D05 — once valid events exist, run E0(event) -> E1(1m/5m) -> E2(10m/15m) retention ladder with event-count matching and top1-vs-top5 nested test.
6. Formal Core remains LOCKED; no ATR/stop/RR/spread/depth/OFI/BUY/maxChase/sizing change.


## 2026-09-28 21:04 continuation — ATR observability audit closed

The D04 L0-L4 observability audit is now complete.

Key result:
- existing Class-A observers can compute ordered gate state, ATR_QUALITY, channel, Formal stop geometry, target state, RR state and downstream grade from same-scan already-loaded inputs with zero new market-data calls;
- the blocker is durable denominator/provenance, not formula availability;
- legacy Shadow cohorts are bounded, single-membership, first-failure-conditioned and mutable, so ATR reject-vs-survivor outcome analysis on those convenience cohorts is prohibited;
- future ATR evidence must reuse the shared immutable per-symbol decision-state parent rather than create a volatility-specific duplicate persistence stack.

New artifact:
- research/volatility_atr_conditioning_observability_audit_v0_1.json

Revised exact continuation:
- D04 next = prospective TAIEX RV capture/readback gate on clean dates, followed by overlapping RV5/RV20 versus non-overlapping recent5/prior15 robustness only after independent PIT-valid dates accumulate.
- D04 stock-level volatility controls require TECHNICAL_CONTINUITY-safe windows.
- ATR outcome/opportunity-cost analysis remains blocked until the shared immutable decision-state parent is available.
- D05 remains EVIDENCE_PENDING: no more concept-factor invention; wait for complete prospective event capture, then execute the dual-clock E0->E1->E2 retention ladder and nested top1-vs-top5 test.
- Formal Core remains LOCKED.


## 2026-09-28 21:36 deep-research update — persistence wiring + provider-event semantics + tick granularity

### D04 durable findings
- Prospective market-RV theory/source feasibility is no longer the main blocker. The repository has:
  - System2 market-regime design fields for RV5/RV20/RV5-to-20;
  - `s2_market_regime_snapshots.factor_observations_json`;
  - assembler/orchestrator support for `regimeFactorObservations`;
  - official A2 TAIEX/FMTQIK source probing.
- Fresh repository search found no runtime path that actually populates raw `realizedVol5`, `realizedVol20`, or `volRatio5to20` factor observations; `regimeFactorObservations` remains an optional/default-empty input and no active caller was found. Therefore compute/schema/source are ready but prospective persistence is not proven.
- System2 runtime `regime.volatilityState` is an evidence-quality state (KNOWN/UNKNOWN/STALE/INVALID/NOT_APPLICABLE), not the economic direction label VOL_EXPANDING/VOL_CONTRACTING. Raw RV values must live in MARKET factor observations and economic labels remain downstream/context-only.
- First promotion-grade market-RV sample begins only when raw values are actually persisted with the same decision-clock source receipt and immutable run linkage. Historical first-known states cannot be reconstructed from current/latest mutable snapshots.
- ATR% normalizes price scale but not Taiwan price-grid discreteness. Official tick-band jumps create large discontinuities in ATR measured in legal ticks: for example ATR=1% is about 10 ticks at 99.9 or 999 but about 2 ticks at 100 or 1000.
- Therefore future ATR/RR/execution studies retain `relativeTickBps`, `atrTicksApprox`, and `stopDistanceTicksApprox` as confound/control descriptors. No new tick threshold or Formal stop change is authorized.

New durable files:
- `research/market_rv_persistence_gap_audit_v0_1.json`
- `research/volatility_tick_granularity_guard_v0_1.json`

### D05 durable findings
- Fugle trades expose a serial field, but current Books documentation does not expose a sequence/serial field. Received book-message count is therefore provider-message time, not proven complete exchange-event time.
- True event-level OFI remains reserved until the capture/source contract proves the required event completeness. When only successive received book snapshots are available, use `snapshotDeltaPressureProxy`, not `trueOFI`.
- Horizon-retention evidence must beat nested simpler explanations:
  - B0 activity/risk: message/trade intensity, mid-price-change count, local volatility, tick/session state;
  - B1 immediate liquidity: spread + top1 depth/imbalance;
  - B2 pressure-response/persistence;
  - B3 one aggregate top-five block.
- Frozen negative controls: time-shift placebo, within-symbol/day pressure-sign shuffle, event-intensity matched control, spread-only control, volatility/activity control, and continuous-session primary analysis with auction/VI/limit cohorts separated.
- Three estimands remain separate: price formation, breakout path quality, execution quality. Passing one does not imply the others.
- Collector go/no-go is now identifiability-first. If provider-message semantics cannot support true OFI/replenishment identification, narrow the estimand rather than fabricating event completeness.

New durable file:
- `research/microstructure_provider_event_clock_falsification_v0_1.json`

### Maturity decision
- D04 remains 42%.
- D05 remains 46%.
- No L3/L4 promotion this round because no new own prospective PIT/OOS/Shadow observations were created.
- No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core remains LOCKED.

### Exact next continuation
1. D04: verify/implement only through the authorized research engineering path a prospective raw market-RV persistence contract; first valid evidence date starts when the factors are actually stored, not when formulas were documented.
2. D04: after independent clean dates accumulate, compare RV5/RV20 with non-overlap recent5/prior15 as robustness only; do not add a fourth vote.
3. D04: ATR opportunity-cost outcome inference remains blocked until the shared immutable per-symbol decision-state parent is available; tick granularity is a control, not a new gate.
4. D05: wait for complete prospective event capture. Before calling anything true OFI, prove provider/reconnect/missing-event semantics.
5. D05: then execute B0->B1->B2->B3 nested tests through E0(event)->E1(1m/5m)->E2(10m/15m)->E3(30m), with independent-date and session/tick strata.
6. D05: no BUY/maxChase/action mapping unless E2 survives all controls and later Shadow/OOS promotion gates; any Formal use remains Class C.


## 2026-09-30 05:44 deep-research update — RV builder + high-frequency measurement noise + limit censoring

### Governance / continuation recovery
- Re-read latest main before research.
- Recovered and merged the previously pending 2026-09-29 D04 market-RV persistence contract and 2026-09-30 01:34 contraction/expansion checkpoint into the canonical tracker.
- The shared immutable per-symbol decision-state parent is still design/prototype only and not production-persisted, so ATR opportunity-cost and contraction->expansion outcome inference remain blocked.
- Formal Core remains LOCKED.

### D04 market-RV engineering progress
- A pure Class-A research builder is now merged through PR #273:
  - `system2/runtime/market_rv_builder_v0_1.mjs`
  - `system2/tests/market_rv_builder_v0_1.test.mjs`
- Pre-merge final-head verification:
  - System2 Research CI #315 PASS;
  - V8 Regression #1135 PASS.
- Builder has zero market calls, zero D1 writes, zero Formal scoring/selection dependency and `selectionImpact=false`.
- It enforces future-row rejection, duplicate-date rejection, source-date equality, decision-clock availability, explicit UNKNOWN, 21-session minimum and zero-RV20 denominator semantics.
- It computes the existing project-compatible rolling close-to-close population standard deviation over 5 and 20 simple returns, non-annualized; ratio is descriptive only.
- Terminology correction: these D04 factors are `ROLLING_CLOSE_TO_CLOSE_RETURN_DISPERSION_POPSTD_SIMPLE`, not academic high-frequency intraday realized variance. Existing factor IDs remain for contract continuity.

Critical boundary:
`BUILDER_IMPLEMENTED_AND_TESTED != PROSPECTIVE_EVIDENCE_CAPTURED`.

D04-02 therefore remains L2 / 40% until the first real factor observations are prospectively persisted with A2 source receipt + regime snapshot + immutable run linkage and survive write/readback/replay.

### D04/D05 high-frequency volatility measurement
- Daily market-regime RV and intraday local RV are now frozen as separate estimands.
- Naive every-trade tick RV is rejected as the primary local-volatility control because bid-ask bounce, ticks and other microstructure noise can inflate highest-frequency squared-return measures.
- First simple intraday basis is causal two-sided mid-quote RV in normal continuous sessions.
- Transaction-price RV is a same-window noise diagnostic, not a replacement when mid-quote coverage is missing.
- A 1s/5s/15s volatility-signature QA is frozen; cadence selection is based on state fidelity, missingness, estimator stability and storage burden, never return outcomes.
- Noise-robust estimators (two/multi-scale RV, realized kernels, pre-averaging family) are measurement challengers only if simple mid-quote RV is unstable. They are not new factor votes.
- Fixed buckets must preserve quote/trade age and reconnect segmentation; carry-forward across a gap cannot become observed evidence.
- Pressure and volatility must share the same session/mechanism segmentation: OPEN_CALL / NORMAL_CONTINUOUS / VI_TRIAL / CLOSE_CALL / LIMIT / ODD_LOT / UNKNOWN.

New machine contract:
- `research/D04_D05_HIGH_FREQUENCY_VOLATILITY_MEASUREMENT_PROTOCOL_V0_1.json`

### D04 price-limit censoring
- A binding TWSE stock price limit creates observed constrained volatility, not proof of low latent volatility.
- Historical Taiwan evidence documents delayed price discovery / spillover / magnet effects and structural market-quality changes under different price-limit widths; it does not support a universal "limits reduce volatility" rule.
- Stock ATR/high-low range can be directly censored on the binding session.
- Close-to-close dispersion can shift part of adjustment into later sessions.
- A small range while pinned at a limit cannot be called clean contraction.
- No latent unconstrained price may be imputed from future prices.

New machine guard:
- `research/D04_PRICE_LIMIT_VOLATILITY_CENSORING_GUARD_V0_1.json`

### Maturity
- D04 remains 42%.
- D05 remains 46%.
- No module is promoted this round because there is still no new own promotion-grade prospective RV persistence sample or complete D05 event ledger.
- No FORMAL_OPTIMIZATION_CANDIDATE.

### Exact next continuation
1. D04-RV-PERSIST-03: wire the already-merged pure builder into the EXISTING research-only regime-factor persistence path only through the applicable governance boundary. Before any outcome inspection, first real date must pass A2 same-date source receipt -> builder -> same regime snapshot -> persistence -> readback -> deterministic replay -> run-fingerprint linkage.
2. Do not count builder tests, synthetic fixtures or current/latest historical recomputation as independent PIT evidence.
3. After multiple clean prospective dates exist, test VOL_EXPANDING/CONTRACTING occupancy and overlapping RV5/RV20 versus non-overlap recent5/prior15 robustness before strategy outcomes.
4. D04-CE-01 and ATR opportunity-cost inference still wait for the immutable per-symbol parent persistence.
5. D05-HORIZON-04 waits for complete prospective books+trades. Before any B0->B3 outcome inference, run provider completeness, reconnect/quote-age QA and 1s/5s/15s midquote volatility-signature diagnostics.
6. Primary D05 inference remains NORMAL_CONTINUOUS_TWO_SIDED_BOOK; limit/VI/auction/odd-lot are separate cohorts.
7. No ATR gate/stop/RR, volatility throttle, spread/depth/OFI, BUY/maxChase, sizing, monitoring or push change.


## 2026-10-02 05:43 — D04 PIT acceptance and D05 sampling falsification

Status: CLASS_A_RESEARCH_MERGED / REAL_PROSPECTIVE_EVIDENCE_PENDING
Formal Core: LOCKED.

### D04 — next evidence gate actually hardened
- Re-read current main and verified D04 pure builder PR #273 remains the only caller of `buildMarketRvBundleV0_1` outside tests; no live `regimeFactorObservations` population/readback has been proved.
- Audited and falsified two unsafe assumptions in the existing V0.1 standalone calculator:
  - a backdated availableAt could make an observation with observedAt/capturedAt AFTER the decision clock appear KNOWN;
  - 21 distinct date rows do not prove the latest 21 OFFICIAL trading sessions.
- PR #294 merged as `ddcba75a4937c5203ea4de9f869bba6c2cbe8c4a` with three green gates: System2 Research CI #333, V8 Repair CI #674, V8 Regression #1189.
- New research-only `research/market_rv_pit_acceptance_v0_1.mjs` and CI-linked synthetic tests require consistent A2 source clocks/window hash, independent official session list, calendar first-known timing, and full available/observed/captured <= decision cutoff.
- Crucial safety correction: STRUCTURAL_PASS produces diagnostic calculator values ONLY; its externally exposed factorObservations remain UNKNOWN, even with self-consistent claimed receipts, until independent source authenticity AND actual prospective immutable write/readback/replay/run fingerprint verification. Synthetic receipts never count as genuine evidence.
- Explicit mathematical falsification for frozen 5/20 rolling POPULATION dispersion:
  `Var20=.75 Var(prior15)+.25 Var(recent5)+.1875(Mean5-Mean15)^2`.
  For Var20>0, `0 <= SD5/SD20 <= 2`. Five identical +3% daily returns after 15 zero-return days produce near-zero recent SD despite a strong positive trend. Low ratio is NOT by itself proof of calm price levels or pre-breakout contraction.
- Machine/long-form receipt: `research/D04_RV_PIT_RECEIPT_AND_OVERLAP_FALSIFICATION_20261002.md`.
- D04-02 stays L2; D04 maturity 42%. Actual A2 authenticity/current-date receipt and persisted same-run RV trio still pending.

### D05 — verified current source semantics and sampling falsification
- TWSE continuous primary session 09:00-13:25; call auctions and VI separated.
- Rechecked 2026-08-12 Fugle STOCK Books docs: top5 bids/asks, provider timestamp, continuous/trial fields, NO documented book-event sequence. Trades docs expose serial but its completeness semantics still require validation.
- Fugle 2026-09-30 pricing: Basic 5 stock-WS subscriptions/1 connection; Developer 300/2; Advanced 2000/2. Actual owner plan and free quota unknown. Books+Trades = 2 subscriptions per symbol, assuming no existing allocation.
- Repo's ACTIVE bounded daily resonance uses five-minute current Quote and a previously frozen pool. It is NOT a prospective 1s/5s/15s Books+Trades ledger; do not reuse the HTTP quote cache as true OFI, event time or high-frequency RV.
- Added analytic falsification: `RV_fine - RV_coarse = -2ab` for adjacent returns a,b. Finer-sampled realized variance can exceed OR fall below coarse-sampled variance depending on autocorrelation; signature slope alone does not prove noise. Require trade-vs-midquote, spread, tick, quote-age, reconnect/coverage and same-window controls.
- First 1s/5s/15s study must compare exact common 15-second windows AND report full-window/volatile-period exclusions, avoiding survivorship-by-coverage.
- No additional live WebSocket subscriptions, storage, service plan, Cron, push or runtime changes made. Actual prospective event-ledger coverage remains unproved.
- New files: `research/D05_QUOTE_AGE_AND_SAMPLING_FALSIFICATION_20261002.md` and `research/d05_sampling_measurement_qa_v0_1.json`.
- D05-05 remains L2; D05 maturity 46%.

### Exact continuation
1. D04-RV-PERSIST-05: connect audited A2 source/calendar receipts to the existing research-only RV factor path ONLY under applicable governance; first valid date requires raw official authenticity, prospective clock, actual snapshot immutable write/readback/replay and same-run fingerprint. Do not infer provenance from retrospective endpoint responses.
2. D04-CE/ATR outcome analysis still blocked until shared immutable per-symbol decision-state parent is physically present.
3. D05-HORIZON-05: first ensure actual entitlement/quota and complete prospective Books+Trades capture design; run 1s/5s/15s common-support quote-age/vol-signature QA before B0->B3 outcome tests. TRUE_OFI remains prohibited without book-event completeness proof.
4. No L3/L4 maturity promotion and no FORMAL_OPTIMIZATION_CANDIDATE.


## 2026-10-03 18:26 segment close — D05-11/12/13 mechanism block

Status: SEGMENT_COMPLETE / D05_11_12_13_L2 / OWN_PIT_EVIDENCE_PENDING  
Formal Core: LOCKED.

### D05-11 Market Impact
- Implementation Shortfall / arrival slippage / actual fills are observable execution-cost objects.
- Causal own-order market impact is NOT directly observable from the tape and defaults to UNKNOWN without own-order lifecycle plus a matched/modelled no-order counterfactual.
- Temporary/permanent impact is a model decomposition, not a raw-data field.
- Square-root impact is retained only as an empirical challenger; no universal Taiwan coefficient is authorized.

### D05-12 Adverse Selection / Order-flow Toxicity
- First observable is signed post-fill markout, conditioned on passive/aggressive execution, spread, local volatility, activity, market/sector drift and mechanism state.
- An adverse markout does not prove the counterparty was informed.
- VPIN/toxicity is not imported as a ready factor; it must survive activity/volatility/spread controls and trade-classification uncertainty.

### D05-13 Queue Position / Order Priority
- TWSE continuous trading uses price priority and time priority at the same price; pre-open same-price sequencing remains a separate call-auction mechanism.
- Public top-five aggregate depth lacks individual order IDs / per-order timestamps / a documented complete book-event sequence, so exact personal queue rank is not identifiable.
- Allowed research label is QUEUE_AHEAD_PROXY unless richer order-level sequencing exists.
- Owner-approved role remains execution confidence / fill-probability / passive-vs-aggressive execution research, NOT stock-selection alpha or a universal gate.

### Shared validation contract
- Keep execution cost, causal self-impact, adverse-selection markout and queue/fill confidence as four distinct estimands.
- Required future evidence: own-order lifecycle, prospective Books/Trades, common-support windows, market/sector controls, spread/local-vol/activity controls, size/participation strata, tick/session strata, matched no-order windows and independent dates.
- No outcome-based promotion, no inferred trader intent, no true OFI from unsequenced book snapshots.

Durable artifacts:
- `MICROSTRUCTURE_RESEARCH.md` MS-063..MS-072.
- `research/d05_execution_impact_adverse_queue_contract_v0_1.json`.

### D04 side-lane status (not merged)
- PR #351, `research: add isolated D04 A2 end-of-day diagnostic epoch`, has green System2 Research CI #430, V8 Regression #1388 and V8 Repair #814.
- It remains OPEN / UNMERGED / CLASS_B_PROPOSAL.
- It deliberately leaves the frozen 13-file System2 Decision Clock V0.3 collector unchanged and creates a separate EOD diagnostic evidence epoch.
- No schedule is enabled and no D04 maturity promotion is claimed.

### Maturity
- D05-11: L0 -> L2 / 40%.
- D05-12: L0 -> L2 / 40%.
- D05-13: L0 -> L2 / 40%.
- D05 aggregate maturity recalculated to 41.4% under the current 14-module curriculum.
- This is knowledge maturity only; no own Taiwan PIT execution-event evidence exists yet.
- No FORMAL_OPTIMIZATION_CANDIDATE.

### Exact next continuation
This segment is closed. Do not reopen D05-11/12/13 theory unless new evidence falsifies the contract.
Next fresh segment may start at D05-14 Market Integrity / Abnormal Trading Patterns, while empirical D05-11/12/13 work waits for prospective own-order/event-ledger evidence.


## 2026-10-03 21:41 segment close — D05-14 Market Integrity / Abnormal Trading Patterns

Status: SEGMENT_COMPLETE / D05_14_L2 / PIT_INTEGRITY_EVIDENCE_PENDING  
Formal Core: LOCKED.

### Core semantic firewall
Four layers are frozen and non-interchangeable:
1. observable market/statistical anomaly;
2. official TWSE surveillance state (attention / disposition);
3. non-accusatory research pattern candidate;
4. authoritative legal/regulatory finding.

Taiwan Securities and Exchange Act Article 155 contains intent-sensitive manipulation prohibitions. Public price/volume/top-five behavior does not prove actor intent.

### Taiwan official surveillance state
- Current TWSE attention/disposition rules (2026-08-03) use price, volume, turnover, broker/investor concentration, valuation, lending/short-related, day-trading and other abnormality dimensions.
- The detailed standards include explicit exclusions/adjustments for IPO no-limit periods, corporate-action price adjustments and other special states.
- Attention status is therefore a statistical/official surveillance state, NOT a manipulation verdict.
- Disposition can alter matching cadence, advance collection of funds/securities, margin and other execution conditions. It is an execution-regime intervention and must be separated from untreated market sessions.

### Pattern-family falsification
- High cancellation / order-to-trade ratios alone do not identify spoofing.
- Spoofing/layering requires non-bona-fide intent; without account/order-level lifecycle, only SPOOFING_LIKE / LAYERING_LIKE research tags are allowed.
- Public top-five data cannot establish beneficial-owner identity, collusive matched orders, wash trading, exact spoof intent, coordinated accounts or trader motive.
- Momentum ignition cannot be inferred from price acceleration alone.
- Marking-open/close candidates must control legitimate auction/index/ETF/rebalance/expiry/hedging demand.

### Anti-double-count boundary
- D05-06 = canonical owner of auction mechanics / auction imbalance primitive.
- D05-14 = integrity interpretation / false-positive controls.
- Shared auction evidence cannot create two independent alpha votes.
- TWSE attention/disposition labels also cannot duplicate D01/D02 primitive price-volume anomalies as free alpha.

### Mandatory false-positive controls
Corporate actions; earnings/news/regulatory events; index/ETF/passive flow; derivatives expiry/hedging; VI; price limit; disposition; opening/closing auction; odd-lot/special sessions; low float/small cap; spread/depth/tick tier; market/sector common shocks.

### Non-accusatory state vocabulary
Allowed:
- NORMAL_NO_INTEGRITY_FLAG;
- OFFICIAL_ATTENTION;
- OFFICIAL_DISPOSITION;
- OBSERVED_STATISTICAL_ANOMALY;
- EXPLAINED_ABNORMALITY;
- INTEGRITY_PATTERN_CANDIDATE;
- DATA_INSUFFICIENT;
- UNKNOWN.

Prohibited without authoritative official legal evidence:
- MANIPULATOR;
- ILLEGAL_TRADING_CONFIRMED;
- INFORMED_TRADER_CONFIRMED;
- FRAUD_CONFIRMED.

### Durable artifacts
- `MICROSTRUCTURE_RESEARCH.md` MS-073..MS-084.
- `research/d05_market_integrity_abnormal_trading_contract_v0_1.json`.

### Maturity
- D05-14: L0 -> L2 / 40%.
- D05 aggregate: 44.3% across 14 modules.
- Knowledge maturity only; no own Taiwan PIT integrity/event evidence, no L3.
- No FORMAL_OPTIMIZATION_CANDIDATE.

### Exact next continuation
This D05-14 segment is closed.
Before opening more theory, follow current total-control routing:
1. COV-02 specialist validation — determine whether Closing Auction / Auction Imbalance should EXTEND D05-06, MERGE/ADD, NOT_A_GAP or remain evidence-insufficient.
2. Priority-B overlap validation — D05-05 OFI vs D05-12 Adverse Selection/Toxicity; shared order-flow primitive must not produce duplicate alpha votes.
3. D05-14 empirical stage remains blocked on PIT official label knownAt, versioned rules, replayable market data and false-positive controls.


## 2026-10-04 07:45 — Room04 crosses 50% through validated L3 PIT feasibility

Status: D04_52.0 / D05_51.4 / ROOM04_51.7 / L3_FEASIBILITY_ONLY  
Formal Core: LOCKED.  
FORMAL_OPTIMIZATION_CANDIDATE: NONE.

### Governance work completed first

COV-02 specialist return:
- terminal recommendation = EXTEND_EXISTING_SCOPE;
- recommended owner = D05-06 expanded to Opening / Closing Auction & Auction Imbalance;
- closing call-auction mechanics and prospective trial state are source-feasible;
- complete historical pre-close imbalance replay remains PARTIAL/UNKNOWN;
- no module-count change and no maturity promotion from naming/scope cleanup alone;
- structural change remains pending 00 intake + dependency/overlap/anti-orphan + owner approval.

B14 D05-05 vs D05-12 specialist return:
- terminal classification = KEEP_SEPARATE / OBSERVABLE_INPUT_VS_LATENT_MECHANISM;
- mandatory SCOPE_DEDUP_ONLY at the shared pressure/OFI primitive;
- D05-12 only becomes distinct evidence when fill-conditioned adverse markout / execution risk adds residual information beyond OFI/activity/volatility/spread/depth;
- no maturity transfer.

### D04 L3 promotions

Canonical L3 definition:
TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED.

Promoted L2 -> L3:
- D04-03 Volatility Contraction;
- D04-04 Volatility Expansion / Shock;
- D04-07 Volatility × Trend / Breakout;
- D04-09 Tail / Gap Volatility Risk;
- D04-10 Price-Limit Contamination.

Evidence:
- TWSE/TPEx official historical daily A1 source families have live-validated requested-date/source-date equality and OHLC integrity;
- exact bar/session clocks and source lineage exist;
- shared TECHNICAL_CONTINUITY semantics fail closed on unresolved corporate actions/sessions;
- price-limit state remains constrained/UNKNOWN where exact historical reference semantics are not provable.

Not promoted:
- D04-02, D04-05, D04-06: A2 market-RV Decision Clock persistence/readback/replay remains incomplete.
- D04-08: sizing/policy transformation requires separate portfolio/risk evidence.

D04:
42.0% -> 52.0%.

### D05 L3 promotions

Promoted L2 -> L3:
- D05-03 Bid-Ask Spread;
- D05-04 Order-book Depth;
- D05-07 Intraday Matching / VI & abnormal matching state, with CAUSE_UNKNOWN guard;
- D05-08 Odd-lot vs round-lot execution difference;
- D05-09 Liquidity-state classification.

Evidence:
- merged PR #327 provides bounded prospective raw Quote context with symbol/date/timestamp freshness, top-five bids/asks, spread, depth, and mechanism/limit flags;
- stale/future/trial/halt incompatibilities fail closed;
- Class-A live-depth preregistry uses same-symbol same-15m-slot strictly prior sessions, min-history UNKNOWN, no missing-data imputation, no outcome tuning;
- current Taiwan intraday odd-lot mechanics and current Fugle odd-lot data modes establish prospective source feasibility.

Not promoted:
- D05-05: true OFI event completeness/sequence unproven.
- D05-06: COV-02 structural extension pending total-control intake and historical closing imbalance replay partial.
- D05-11: own-order/counterfactual absent.
- D05-12: own-fill residual adverse-markout evidence absent.
- D05-13: exact queue rank unavailable from public top-five.
- D05-14: official surveillance knownAt/versioned replay incomplete.

D05:
44.3% -> 51.4%.

### Room maturity

D04 points:
520 / 1000.

D05 points:
720 / 1400.

Room04:
1240 / 2400 = **51.6667% -> 51.7%**.

This crosses 50 legitimately under the canonical learning-maturity scale.

It does NOT claim:
- profitable volatility alpha;
- spread/depth alpha;
- odd-lot premium;
- VI alpha;
- true OFI;
- market-impact identification;
- toxicity/informed trader identification;
- OOS/Shadow efficacy.

Those remain L4 questions.

### Durable artifacts
- `research/D04_D05_PIT_FEASIBILITY_PROMOTION_AUDIT_20261004_V0_1.md`;
- `research/d04_d05_pit_feasibility_promotion_audit_20261004_v0_1.json`;
- `research/COV_02_CLOSING_AUCTION_SPECIALIST_RETURN_20261004_V0_1.md`;
- `research/PRIORITY_B_B14_D05_05_D05_12_SPECIALIST_RETURN_20261004_V0_1.md`;
- `VOLATILITY_REGIME_RESEARCH.md` VR-042;
- `MICROSTRUCTURE_RESEARCH.md` MS-085..MS-087.

### Exact continuation

1. Do not re-study the ten promoted L3 modules' source feasibility unless new evidence falsifies a contract.
2. L4 requires prospective Shadow/OOS and cannot be accelerated by writing more theory.
3. D04 nearest empirical gate remains A2 market-RV Decision Clock persistence for D04-02/05/06.
4. D05 nearest event-level gate remains true event completeness for D05-05 and own-order lifecycle for D05-11/12/13.
5. COV-02 and B14 specialist returns are complete and ready for 00 intake; this room must not directly mutate canonical module count/ownership structure.
6. Formal Core remains unchanged.


### COV-02 formal return-contract closure

After the initial specialist analysis, the newer total-control Intake Template / JSON Schema was re-read and applied.

COV-02 now has:
- complete formal intake header;
- evidence cutoff;
- all 10 required fields;
- mandatory source table;
- mandatory overlap table;
- mandatory counterevidence table;
- exactly one terminal recommendation: `EXTEND_EXISTING_SCOPE`;
- schema-aligned machine return: `research/cov_02_closing_auction_specialist_return_20261004_v0_1.json`.

Current lawful state:
`SPECIALIST_RETURN_CONTRACT_COMPLETE / READY_FOR_00_INTAKE`.

This room does NOT self-assign:
`RETURN_ACCEPTED_FOR_INTAKE`.

Only 00｜研究總控室 may perform intake acceptance and the later Dependency Audit / overlap / anti-orphan / owner-approval transition.
No COV-02 structural recommendation was used to inflate maturity; the separate L3 promotions came from the independent PIT-feasibility audit.


## 2026-10-04 09:08 — COV-02 / B14 specialist return + >50% maturity audit

Status: SPECIALIST_RETURN_COMMITTED / NO_ARTIFICIAL_PROMOTION / FORMAL_CORE_LOCKED

### COV-02 terminal specialist recommendation
- Closing Auction / Auction Imbalance is a SCOPE_EXTENSION_CANDIDATE, not a new module.
- Terminal recommendation: `EXTEND_EXISTING_SCOPE -> D05-06`.
- D05-06 should own Opening / Closing Auction & Auction Imbalance with explicit phase state.
- Current Taiwan evidence supports the closing call-auction mechanism, final close/volume and current indicative/trial states where exposed.
- Historical PIT replay of a full pre-close imbalance time series is NOT proven; missing indicative imbalance remains UNKNOWN.
- No module-count change and no maturity promotion from this scope recommendation.
- D05-14 retains integrity interpretation; D14 retains execution-cost consequences; one auction primitive cannot become multiple alpha votes.

### Priority-B B14 terminal specialist recommendation
- Pair: D05-05 OFI vs D05-12 Adverse Selection / Toxicity.
- Terminal recommendation: `KEEP_SEPARATE / OBSERVABLE_INPUT_VS_LATENT_MECHANISM`.
- D05-05 owns observable pressure/imbalance.
- D05-12 must add fill-conditioned signed markout and controls beyond OFI; informed-trader intent remains unobserved.
- Same-OFI / different-markout states establish a valid semantic divergence.
- OFI may enter D05-12 once as an input/control; the same transform cannot become a second toxicity vote.
- If future D05-12 research cannot demonstrate distinct observable/falsifiable evidence beyond OFI, narrowing/merge becomes eligible.

Specialist artifact:
- `shared-knowledge/ROOM04_COV02_B14_SPECIALIST_RETURN_20261004.md`.

### Honest >50% audit
Current room aggregate:
- D04 = 42.0% / 10 modules.
- D05 = 44.3% / 14 modules.
- Combined room04 = 43.3% / 24 modules.

One L2 -> L3 promotion contributes 20/24 = ~0.83 room percentage points.
To exceed 50%, at least 9 L2 modules would need valid L3 promotion.

Current hard blockers:
- D05 checkpoint: no L3 until own prospective PIT event capture proves coverage/replay/missing-event semantics.
- D04 multi-session stock volatility: official TWSE/TPEx A1 historical adapters are validated, but corporate-action TECHNICAL_CONTINUITY is still UNVERIFIED.
- D04 market RV: builder and PIT acceptance gate exist, but live decision-clock persistence/readback/replay remains pending.

Therefore no L3 upgrades are made merely to cross 50%.

### Fastest legitimate path above 50%
1. Complete corporate-action TECHNICAL_CONTINUITY for A1 daily history; re-audit D04-03/04/07/09/10 and any other daily-only volatility modules.
2. Accumulate real D04 market-RV prospective persisted dates for D04-02/05/06 where applicable.
3. Only after owner-authorized D05 Books+Trades capture proves replay/coverage may D05-03/04/05/07/09 or related modules be reconsidered for L3.

No FORMAL_OPTIMIZATION_CANDIDATE.


### 00 control-plane receipt — COV-02 Intake passed

00｜研究總控室 accepted the formal COV-02 return and completed Dependency / overlap / PIT-replay / anti-double-count / anti-orphan review.

State:
`OWNER_APPROVAL_REQUIRED`.

Proposed structural action:
`EXTEND_EXISTING_SCOPE → D05-06`.

Proposed name:
`Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）`.

Audit:
`shared-knowledge/CURRICULUM_COVERAGE_COV02_INTAKE_DEPENDENCY_AUDIT_20261004_V0_1.md`.

This receipt does not alter Room04's active empirical research order and does not promote D05-06 maturity. Wait for explicit owner approval before canonical scope/name mutation.


### 00 control-plane receipt — COV-02 canonical update complete

Owner approved the 00-room COV-02 structural recommendation.

Canonical D05-06 is now:
`Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）`.

Governance effect:
- L2 / 40% unchanged;
- D05 aggregate maturity unchanged by this scope action;
- no module-count change;
- historical pre-close imbalance remains UNKNOWN where timestamped source evidence is absent;
- final close / final volume / generic EOD volume cannot backfill the pre-close path;
- D05-14 remains integrity consumer; D14 execution consumer; D11/D17 event-clock context;
- no independent directional auction Alpha vote;
- Formal Core unchanged.

Room04 should continue its existing empirical sequence; do not re-study COV-02 ownership unless new evidence falsifies this boundary.
