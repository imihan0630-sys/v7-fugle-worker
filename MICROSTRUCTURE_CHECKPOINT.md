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
