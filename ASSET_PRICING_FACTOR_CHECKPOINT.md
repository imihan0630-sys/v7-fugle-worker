# Asset Pricing / Factor Investing Checkpoint

Updated: 2026-10-04 Asia/Taipei
Scope: D19｜資產定價／因子投資／市場異象
Status: RESEARCH_ACTIVE / D19_12_L3_BOUNDED_DATE_INTRINSIC / OTHER_14_ACTIVE_MODULES_L2 / D19_04_DATA_LANE_DEPENDENCIES_OPEN / FORMAL_CORE_UNCHANGED

## Governance
- This file is the canonical continuation checkpoint for D19.
- Start from the latest tracker/router/main; do not restart completed work.
- Every claim requires positive mechanism, counterevidence/failure mode, PIT, replayability, data quality, redundancy, costs and System 1/System 2 incremental-value assessment.
- UNKNOWN != 0. No Formal promotion without existing governance gates and owner approval.

## Completed
- D19-01 CAPM／Beta／Alpha與Benchmark Residual: L2.
- D19-02 Size規模因子: L2.
- D19-03 Value價值因子: L2.
- D19-04 Cross-sectional Momentum橫截面動能因子: L2.
- D19-05 Quality／Profitability品質與獲利能力因子: L2.
  - Narrowed "quality" to auditable profitability definitions before any composite-quality claim.
  - Recorded measure sensitivity, emerging-market weakness and Taiwan five-factor mixed evidence.
  - Defined first-known accounting/PIT and redundancy contract.
- D19-06 Investment／Asset Growth投資與資產成長因子: L2.
  - Separated capital expenditure, total-asset growth and broader investment characteristics.
  - Recorded U.S. investment/asset-growth evidence and Taiwan evidence that may show opposite investment-factor sign.
  - Defined accounting-event, restatement and cross-factor redundancy contract.

## Taiwan PIT source-map status
- Official TWSE/TPEx/MOPS/CBC source roles mapped at design level.
- Known gaps: historical dataset start dates differ; pre-2011 halt coverage needs another source; delisted-universe continuity and TPEx coverage must be explicitly validated.
- TWSE Data E-Shop daily shares-outstanding product is an authoritative candidate but paid; availability is not equivalent to ingestion.
- No L3 promotion until executable PIT ingestion/replay receipts exist.

## Current maturity
- All 15 active D19 modules: L2 / 40% each (D19-14 retired/merged into D19-13 and is not an active denominator item).
- Current D19 curriculum denominator: 15 active modules.
- D19 domain simple-average maturity: 41.3%.
- Formal optimization candidate: NO.
- Formal Core: unchanged.

## Stage 4 completed on 2026-10-03
- D19-07 Low Volatility／Low Beta低波動低Beta因子 -> L2 / 40%.
  - Separated total volatility from market beta and from D04 volatility research.
  - Recorded leverage/benchmark-demand mechanisms and Taiwan funding-liquidity regime reversal risk.
  - Frozen rule: no blanket low-volatility or low-beta bonus.
- D19-08 Idiosyncratic Volatility特質波動異象 -> L2 / 40%.
  - Residual volatility is model-relative; required controls include size, beta, total volatility, liquidity, industry, momentum/MAX-like effects and short-sale constraints.
  - Governance remains research-only / residual alpha unproven.
- D19-09 Residual Momentum／Factor Neutralization殘差動能與因子中性化 -> L2 / 40%.
  - Distinguished time-series residualization from cross-sectional neutralization.
  - Recorded omitted-factor contamination, model sensitivity and sequential-orthogonalization order dependence.
  - Taiwan evidence supports research value but does not establish dominance or independence.
- D19-10 Factor Exposure／Multicollinearity因子曝險與共線性 -> L2 / 40%.
  - Frozen anti-double-count governance: prediction ability is not proof of independent factor value.
  - New factors require spanning/residual/OOS incremental evidence after existing-factor controls.
- Existing System2 historical cold infrastructure preserves observedAt, availableAt, barHash, provenance and survivorship-controlled registry semantics, but D19 still lacks factor-layer PIT receipts.
- No L3 promotion in Stage 4.

## Stage 5 completed on 2026-10-03
- D19-11 Factor Crowding／Capacity／Turnover因子擁擠容量與換手 -> L2 / 40%.
  - Crowding requires observable shared positioning/flow/liquidity evidence; popularity alone is not crowding.
  - Capacity is implementation-specific and must be estimated from turnover, spread, impact, participation rate, execution horizon and stressed liquidity.
  - No direct PIT crowding evidence means UNKNOWN/proxy-only, not a negative score.
- D19-12 Seasonality／Calendar Anomalies季節性與日曆異象 -> L2 / 40%.
  - Taiwan literature documents calendar patterns, but effects are sample-, institution- and test-definition-sensitive and may decay or reverse.
  - All calendar hypotheses require preregistration, actual trading-calendar vintages, multiple-testing control and cost-adjusted OOS evidence.
  - Governance remains research-only / high-data-mining-risk.
- No L3 promotion in Stage 5.

## Stage 6 completed on 2026-10-04
- D19-13 Relative Value／Pairs Trading／Cointegration／Residual Mean Reversion -> L2 / 40%.
  - Locked as a strategy-specific family, not a generic long-only vote.
  - Taiwan evidence and counterevidence emphasize structural breaks, cost, pair overlap, short-leg executability and multiple testing.
- D19-15 Index／Benchmark Construction／Methodology -> L2 / 40%.
  - Benchmark vintage is part of the model; current constituents/weights cannot reconstruct historical alpha/beta.
  - Benchmark receipt requirements are defined.
- D19-16 Liquidity Premium／Illiquidity Factor -> L2 / 40%.
  - Taiwan evidence is measure-sensitive; direct illiquidity-risk interpretation is contradicted by evidence that Amihud pricing can be volume/mispricing-dominant under price limits.
  - Residual liquidity premium remains research-only.
- D19 factor-layer PIT adapter V0.1 research contract defined above existing System2 cold replay.
- Repository audit confirms the six D19 receipt types are not yet implemented in code.
- No L3 promotion in Stage 6.

## Stage 7 completed on 2026-10-04
- PR #439 merged to main as `76f5ef80dbf0654a033a0a780b065ebfabbf0e30`.
- Research-only D19 factor-layer receipt adapter is implemented with deterministic six-layer receipts and fail-closed tests.
- System2 Research CI `37165603677`: PASS.
- V8 Regression `37165603710`: PASS.
- Real official-source D19 smoke `37165603790`: PASS_NEGATIVE_L3_GATE; System1 production isolation PASS.
- TWSE physical witness covered 2026-08-03..2026-08-31, 21 official sessions, full-market source rows=22,810; bounded 2330/2454 receipt chain complete.
- TPEx physical source failed closed: both primary and legacy transports returned HTTP 520 on 2026-08-03; no data were fabricated.
- D19 maturity remains 40.0%. No L3 promotion.

## Current L3 blockers for first D19-04 replay
1. BOUNDED_UNIVERSE_NOT_HISTORICAL_REGISTRY.
2. CORPORATE_ACTION_CONTINUITY_UNVERIFIED.
3. INDUSTRY_NEUTRALIZATION_NOT_PROVEN.
4. D03_D09_REDUNDANCY_NOT_PROVEN.
5. COST_PROVENANCE_MODELED_TRANSPORT_ONLY.
6. TPEX_OFFICIAL_HISTORICAL_SOURCE_UNAVAILABLE.

## Exact next continuation
1. Replace bounded witness membership with an actual date-vintaged historical-universe registry snapshot/receipt.
2. Bind corporate-action continuity evidence to the exact replay bars without rewriting raw history.
3. Diagnose and physically revalidate an official TPEx historical transport; remain UNKNOWN/SOURCE_UNAVAILABLE until successful.
4. Add date-vintaged industry membership and industry neutralization.
5. Run paired D03/D09 redundancy controls on the same PIT dates/universe.
6. Replace engineering cost placeholder with a versioned D14-compatible research cost scenario and explicit provenance quality.
7. Re-run D19-04. Only a zero-blocker deterministic Taiwan PIT replay can trigger an L3 readiness review; no automatic promotion.
8. D19-07 remains L2 until benchmark/beta-estimation semantics are executable; raw volatility alone is insufficient.


## Stage 8 completed on 2026-10-04
- PR #460 merged as `1a7b6e7e8d8552953f909f4ee1448733a1daf643`.
- Full TWSE 2026-08-31 survivorship-controlled historical-universe denominator physically reconciled against official 2026-08-03..2026-08-31 daily history.
- Coverage workflow `37172684933` PASS; System2 Research CI `37172684904` PASS; V8 Regression `37172684903` PASS; production isolation PASS.
- Snapshot denominator = 1,089; D19-04 factor input = 1,064 KNOWN / 25 explicit UNKNOWN = 97.7043% KNOWN.
- UNKNOWN split: 2 recent-listing insufficient lookback; 6 incomplete session rows requiring symbol-session provenance; 17 null/invalid close cases requiring trading-state provenance. No silent omission and no UNKNOWN->0.
- PR #459 was a negative TPEx transport experiment and was closed without merge. All three official historical transports returned HTTP 520 in run `37172219750`; CI/regression passed fail-closed behavior only.
- Earlier TPEx full-market benchmark had successfully read 18,646 rows for the same August interval, but was read-only and did not persist a full-market replayable dataset.
- Corporate-action official source/parser is physically verified, but full continuity certification remains locked.
- Cost gate narrowed: statutory tax semantics are sourceable; broker-specific commission/slippage/turnover remain unresolved.
- Machine reconciliation: `research/d19_04_l3_blocker_reconciliation_20261004_v0_1.json`.
- D19 remains 40.0%; no L3 promotion.

## Current D19-04 L3 blocker state
1. HISTORICAL_UNIVERSE = PARTIAL_PASS: TWSE resolved; TPEx date-vintaged universe/replay remains unresolved.
2. FACTOR_INPUT_COVERAGE = PARTIAL_PASS: 1,064/1,089 TWSE KNOWN; 25 explicit UNKNOWN, including 2 legitimate recent listings and 23 requiring symbol-session/trading-state evidence.
3. CORPORATE_ACTION_CONTINUITY = PARTIAL_PASS_SOURCE_PARSER_ONLY: full certification / revision / NO_EVENT / suspension-resumption completeness still required.
4. INDUSTRY_NEUTRALIZATION = BLOCKED: no date-vintaged PIT industry classification.
5. D03_D09_REDUNDANCY = BLOCKED: paired same-date same-universe residual test not yet executed.
6. COST_PROVENANCE = PARTIAL_PASS_TAX_ONLY: statutory tax source available; account-specific commission, slippage and turnover semantics unresolved.
7. TPEX_HISTORICAL_SOURCE = BLOCKED_CURRENT_TRANSPORT: live official routes currently HTTP 520; do not infer historical nonexistence and do not fabricate rows.

## Updated exact next continuation
1. Resolve the 23 TWSE non-recent-listing UNKNOWN names with authoritative symbol-session / trading-state provenance; preserve the two recent listings as insufficient-lookback rather than failures.
2. Build TPEx date-vintaged historical-universe receipt and source-independent replay from immutable persisted official history where available; live HTTP transport must not be the sole replay dependency.
3. Bind shared corporate-action continuity receipt to exact D19 formation windows; do not implement a D19-local adjustment engine.
4. Freeze PIT industry vintage and run industry neutralization.
5. Execute D03/D09 paired redundancy controls on identical frozen date/universe.
6. Freeze D14-compatible research cost scenarios with explicit quality; actual owner commission remains UNKNOWN until directly evidenced.
7. Zero applicable blockers may trigger L3 readiness review only; no automatic promotion.


### Stage 8 symbol-session addendum
- Shared System2 continuity state explicitly reports `suspensionCoverageComplete=false` and `symbolSessionCompletenessCertified=false`.
- Therefore the 23 non-recent-listing TWSE UNKNOWN names cannot be promoted to known suspension/no-trade solely from null closes or missing rows.
- D19 must consume the shared exchange-complete symbol-session receipt when certified; a D19-local suspension inference/engine is prohibited.


## Stage 9 completed on 2026-10-04
- PR #461 merged as `a6bbbbffd4d1de62306f3515ba7ad3562adb82e0`: official continuity range sources cross-checked against Stage-8 UNKNOWN names; bounded verified events observed for 4190, 6955 and 6176.
- PR #463 merged as `67ff5fca7544954ed12cb59449b6dae046c012b6`: official TWSE historical suspended-trading payload physically captured for 2026-08-03..2026-08-31. 1218 suspended 2026-08-13 and resumed 2026-08-14; 1909 suspended 2026-08-12 and resumed 2026-08-13. Raw payload hash `072e88890972ebbfed3d64a82ec0bbeee22044ec21a3146aaac3ca989d50f7c0`.
- Six fewer-than-21-row cases (1563, 1589, 2867, 6176, 6949, 8105) were individually matched to official TWSE stop-trading / structural-event windows during this research round. Their missing rows are not treated as silent source loss; immutable D19 raw-byte/revision bundling remains pending.
- PR #464 merged as `c8945c76e2cc4cd72faecaa4cd6d09a0b7077eb1`: remaining 15 invalid-close symbols produced 50 invalid-close rows, decomposed into 11 official zero-trade rows and 39 rows with positive trading activity but unavailable OHLC.
- Positive volume/value/transactions do not authorize reconstruction of a missing official close. Forward-fill and UNKNOWN->0 remain prohibited.
- The fixed-21-market-session assumption is falsified as a sufficient symbol-level data rule. D19-04 now requires a preregistered valid-observation / symbol-session contract with explicit stale-price handling and complete denominator accounting.
- D03/D09 paired redundancy remains blocked by compatible same-date full-universe PIT input readiness; current-vintage industry labels must not be used as a substitute.
- D19 maturity remains 40.0%; no L3 promotion.

## Updated D19-04 L3 blocker state after Stage 9
1. HISTORICAL_UNIVERSE = PARTIAL_PASS: TWSE denominator resolved; TPEx date-vintaged universe/replay unresolved.
2. FACTOR_INPUT_COVERAGE = PARTIAL_PASS_SESSION_STATES_NARROWED: 1,064 KNOWN / 25 explicit UNKNOWN; 2 recent listings, 6 documented non-trading/event-window cases, 2 physically captured temporary suspensions, and 15 remaining invalid-close names with 11 zero-trade + 39 unresolved active/no-OHLC rows.
3. CORPORATE_ACTION_CONTINUITY = PARTIAL_PASS_SOURCE_PARSER_AND_BOUNDED_EVENT_PROVENANCE: bounded event/session evidence improved; full revision/NO_EVENT/exchange-complete certification remains open.
4. INDUSTRY_NEUTRALIZATION = BLOCKED: no date-vintaged PIT industry classification.
5. D03_D09_REDUNDANCY = BLOCKED_COMPATIBLE_PIT_INPUTS.
6. COST_PROVENANCE = PARTIAL_PASS_TAX_ONLY: statutory tax source available; account-specific commission/slippage/turnover semantics unresolved.
7. TPEX_HISTORICAL_SOURCE = BLOCKED_CURRENT_TRANSPORT: current official refetch paths remain unavailable; prior read-only feasibility is not persisted replay evidence.

## Exact next continuation after Stage 9
1. Freeze D19-04 valid-observation / symbol-session semantics and stale-price policy before recomputing momentum.
2. Reconcile the 39 positive-activity/no-OHLC rows against authoritative price/session-type semantics; unresolved stays UNKNOWN.
3. Archive immutable receipt-equivalent evidence for the six documented stop-trading/event cases.
4. Build TPEx date-vintaged universe + source-independent replayable history.
5. Bind shared continuity receipts to exact factor lookback windows.
6. Acquire PIT industry vintage and run industry neutralization.
7. Execute D03/D09 paired redundancy only after compatible PIT inputs exist.
8. Freeze D14-compatible component-wise cost scenarios with explicit evidence quality.
9. Only a zero-applicable-blocker deterministic full-Taiwan replay can trigger L3 readiness review; no automatic promotion.


## Stage 10 completed on 2026-10-04
- PR #489 merged as `81145020202f2806f754007062ae6a60d2979760`.
- D19-04 valid-observation / symbol-session contract is now executable and fail-closed. No forward fill, previous-close substitution, UNKNOWN->0 or local suspension inference is authorized.
- Preregistered comparators: `CALENDAR_20_STRICT_V0_1` and `VALID_OBSERVATION_20_V0_1`; valid-observation mode requires an explicit maximum calendar-span parameter and remains sensitivity research.
- Shared TWSE monthly-history adapter was corrected for live ROC-calendar row dates and regression-tested.
- Physical validation: System2 CI `37181597861` PASS; V8 Regression `37181597874` PASS; V8 Repair CI `37181597908` PASS; D19 real-source workflow `37181597868` PASS; production isolation PASS.
- Primary TWSE full-market source reproduced 11 official zero-trade rows + 39 positive-activity/no-valid-close rows; evidence hash `37d7a2d4922ae857ac9c62ede85a98e8f9fcbe3c75f085d2d776e3d13b0111d4`.
- Independent TWSE STOCK_DAY monthly cross-check found 0/39 alternate valid closes. All 50 non-price rows existed in the alternate official source and 50/50 matched volume/value/transaction-count fields exactly. Cross-source evidence hash `5e2670ceab44650e7609b604c12bd19fb57d2fb92f2857f7cc4355c3ead878e3`.
- Therefore the 39 cases are no longer treated as a plausible single-endpoint recoverable omission. They remain non-price observations; exact transaction-mechanism cause remains UNKNOWN.
- D19 maturity remains 40.0%; no L3 promotion.

## Updated D19-04 L3 blocker state after Stage 10
1. HISTORICAL_UNIVERSE = PARTIAL_PASS: TWSE date-vintaged denominator resolved; TPEx universe/replay remains unresolved.
2. FACTOR_INPUT_OBSERVATION_SEMANTICS = PARTIAL_PASS_STRONGLY_NARROWED: explicit observation-state contract exists; 11 zero-trade and 39 activity/no-close rows are dual-source confirmed non-price observations; affected factor windows remain incomplete unless a preregistered valid-observation comparator can lawfully assemble sufficient prior valid observations.
3. CORPORATE_ACTION_CONTINUITY = PARTIAL_PASS_SOURCE_PARSER_AND_BOUNDED_EVENT_PROVENANCE: full revision/NO_EVENT/exchange-complete certification and exact-window binding remain open.
4. INDUSTRY_NEUTRALIZATION = BLOCKED: date-vintaged PIT industry classification unavailable.
5. D03_D09_REDUNDANCY = BLOCKED_COMPATIBLE_PIT_INPUTS.
6. COST_PROVENANCE = PARTIAL_PASS_TAX_ONLY: owner commission/slippage/turnover evidence incomplete.
7. TPEX_HISTORICAL_SOURCE = BLOCKED_FULL_MARKET_TRANSPORT / ALTERNATE_MONTHLY_ROUTE_NOT_YET_PHYSICALLY_QUALIFIED.

## Exact next continuation after Stage 10
1. Physically qualify the existing TPEx individual-security monthly-history route on frozen August-2026 symbols; if readable, classify it as an alternate replay primitive only, not full-market completion.
2. Build TPEx date-vintaged universe population/scale path independent of the currently failing full-market live route.
3. Persist immutable receipt-equivalent evidence for six documented TWSE stop-trading/structural-event cases and bind shared continuity receipts to exact factor windows.
4. Acquire date-vintaged PIT industry membership and run industry neutralization.
5. Run paired D03/D09 redundancy on identical frozen PIT inputs.
6. Freeze D14-compatible versioned component-wise cost scenarios with evidence quality; actual owner commission remains UNKNOWN absent direct evidence.
7. Zero applicable blockers may trigger L3 readiness review only; no automatic promotion.


## 00 routed H19 exact remaining delta — 2026-10-04

H19 state:
`PARTIAL_EVIDENCE_RECEIVED / COMMON_SUPPORT_REDUNDANCY_RESIDUAL_TESTS_PENDING`.

Accepted ownership:
- D03-04 = within-security / time-series momentum continuation;
- D19-04 = cross-sectional momentum rank/factor;
- D19-09 = residual/factor-neutral momentum after neutralization.

Do not repeat theory/definitions.

Room12 exact remaining work:
1. run D03-04 vs D19-04 on the same date, same survivorship-safe universe and same valid-observation denominator;
2. test whether cross-sectional rank adds information beyond each security's own raw momentum state;
3. freeze one factor-set/version and date-vintaged industry map before D19-09 residualization;
4. preserve estimation window, coefficients, factor-set/version, industry vintage and residual hash;
5. compare raw D19-04 vs D19-09 residual momentum under identical common support;
6. include turnover/cost/capacity and UNKNOWN rows;
7. until residual incremental value passes, one return history cannot become three independent Alpha votes.

This is aligned with the room's existing D03/D09 redundancy blocker and does not alter the active research order.


## 00 routed COV-09 final specialist-return delta — 2026-10-04

COV-09 is now:
`SPECIALIST_RETURN_READY_PENDING_TERMINAL_RECOMMENDATION`.

Do not redo generic factor research.

Accepted:
- D19-15 = benchmark construction/methodology owner;
- D19-01 = benchmark-relative alpha/residual interpretation;
- D19-10 = exposure/multicollinearity/spanning diagnostics;
- benchmark vintage and PIT universe/corporate-action/delisting semantics;
- Fama-French / profitability-investment / q-style contextual evidence;
- benchmark models are not automatic strategy votes.

Exact remaining return delta:
1. freeze D19-15 as the benchmark-model construction owner versus D19-01/D19-10 consumers;
2. state whether Taiwan inference requires Taiwan-reconstructed benchmark portfolios rather than imported U.S. factors;
3. choose exactly one terminal recommendation;
4. commit `research/COV09_D19_SPECIALIST_RETURN_V0_1.md`.

No maturity or Formal change is authorized by this routing.


## Stage 11 durable pointer — 2026-10-04
- Canonical receipt: `research/d19_stage11_tpex_source_and_calendar_path_20261004_v0_1.json`.
- TPEx current individual-monthly route/schema/unit semantics are bounded-feasible; unattended transport and full-market historical-universe replay remain incomplete and owned by DATA_LANE.
- D19 remains 40.0%; no L3 promotion.
- Exact next: audit D19-12 weekday/month-of-year bounded L3 feasibility with the existing official historical TWSE calendar and durable 2017 session evidence. Holiday/pre-holiday/turn-of-month stay outside the promotable scope until historical known-at calendar-vintage semantics are proven.


## Stage 12 completed on 2026-10-04
- Receipt: `research/d19_12_date_intrinsic_calendar_pit_receipt_20261004_v0_1.json`.
- D19-12 Seasonality／Calendar Anomalies advances L2 / 40% -> L3 / 60% for a strictly bounded scope only: WEEKDAY and MONTH_OF_YEAR on TWSE historical sessions.
- Executable lineage is existing `system2/runtime/historical_twse_calendar_v0_1.mjs` plus its tests and 2017 physical market-year evidence.
- Physical evidence year 2017: 246 official trading dates; 222,194 fresh-official rows exactly reconciled to 222,194 cold rows; zero missing/extra/source-row-hash mismatches.
- Weekday/month states are intrinsic to the current ISO marketDate and do not require future trading-calendar knowledge. Historical replay is conservatively consumed after session-close finality.
- Promotion explicitly excludes HOLIDAY / PRE_HOLIDAY / POST_HOLIDAY / TURN_OF_MONTH / LUNAR_CALENDAR / SETTLEMENT_OR_INDEX_REBALANCE until their separate historical known-at/vintage semantics are proven.
- No return outcome, alpha sign, threshold, score or Formal rule is opened. High data-mining risk remains.
- D19 simple-average maturity is now 41.3% (one active module at L3/60, fourteen at L2/40).
- Formal Core unchanged; no FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation after Stage 12
1. D19-12: append at least one additional independent historical year for the same WEEKDAY/MONTH_OF_YEAR contract; do not broaden the promoted scope while doing so.
2. D19-12: seek historical calendar-vintage/announcedAt evidence before any holiday/pre-holiday/post-holiday or turn-of-month L3 review; lunar/settlement/rebalance remain separately source-gated.
3. D19-04: consume DATA_LANE TPEx universe/full-market/continuity artifacts when verified; do not duplicate their engineering.
4. D19-04 research-owned gates remain PIT industry vintage, compatible D03/D09 paired redundancy and D14 component-wise cost provenance.
5. No L4 without prospective/OOS outcome evidence, costs, multiple-testing control and robustness.


## Stage 13 completed on 2026-10-05
- Receipt: `research/d19_12_date_intrinsic_calendar_pit_receipt_20261005_v0_2.json`.
- D19-12 WEEKDAY/MONTH_OF_YEAR PIT feasibility is now physically replayed under identical semantics across independent TWSE years 2017 and 2018.
- 2017: 246 sessions, 222,194 fresh/cold rows, zero reconciliation mismatch.
- 2018: 247 sessions, 227,381 fresh/cold rows, zero reconciliation mismatch.
- 2017 includes 3 Saturday trading sessions and 2018 includes 2, proving that Taiwan weekday-state research must use the weekday of actual official trading dates rather than assume Monday-Friday.
- System2 CI `37243300685`, V8 Regression `37243300702`, D19 smoke `37243300721`: PASS.
- D19-12 remains L3 / 60%; D19 aggregate remains 41.3%.
- No L4 promotion; outcomes, costs and multiple-testing-controlled efficacy remain closed.

## Exact next continuation after Stage 13
1. D19-12: establish bounded historical annual-calendar knownAt/announcement evidence before HOLIDAY/PRE_HOLIDAY/POST_HOLIDAY or TURN_OF_MONTH L3 scope review.
2. Separate scheduled annual holidays from emergency/typhoon closures; the latter require event-specific announcement clocks.
3. D19-04: consume DATA_LANE TPEx universe/full-market/continuity artifacts when verified; do not duplicate their engineering.
4. D19-04 research-owned gates remain PIT industry vintage, compatible D03/D09 paired redundancy and D14 component-wise cost provenance.
5. No L4 without prospective/OOS outcome evidence, costs, multiple-testing control and robustness.


## Stage 15 completed on 2026-10-07
- Canonical receipt: `research/d19_stage15_cost_liquidity_falsification_receipt_20261007_v0_1.md`.
- D19-13: Taiwan pairs evidence supplies a transaction-cost falsification witness; search breadth is now explicitly part of the multiple-testing family. D19-13 remains L2/40.
- D19-16: Taiwan liquidity evidence is heterogeneous across controls, market direction and metric definitions. Signal and execution-friction roles must be separated; comparator variants must be preregistered. D19-16 remains L2/40.
- First factor-layer PIT chain must be selected by upstream receipt readiness, not observed performance.
- D19 aggregate remains 41.3%; no L3/L4 promotion; Formal Core unchanged; FORMAL_OPTIMIZATION_CANDIDATE=NONE.

## Exact next continuation after Stage 15
1. Freeze machine-readable D19-13 preregistration receipt with search-breadth/multiple-testing and two-leg execution/cost provenance.
2. Freeze machine-readable D19-16 PIT input receipt separating signal/friction and metric variants.
3. Build D19-15 benchmark PIT receipt with historical methodology/constituent/weight vintage and sourceHash.
4. Choose first executable factor-layer PIT chain by upstream receipt completeness before inspecting outcomes; missing mandatory evidence stays UNKNOWN.
