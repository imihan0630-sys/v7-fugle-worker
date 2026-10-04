# Stock Selection Self-Deception Audit V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CANONICAL_CROSS_DOMAIN_AUDIT
Scope: D01-D22 / System 1 / System 2
Authority: latest GitHub main + canonical tracker/checkpoints
Formal Core impact: NONE
Purpose: detect and prevent research/system behaviors that create false confidence, duplicate evidence, hindsight, proxy overclaim, leakage, or non-executable Alpha.

## Audit principle

The objective is not to maximize curriculum completion. The objective is to maximize validated incremental information available at the stock-selection decision timestamp.

A domain may be knowledgeable yet still be unsafe for selection if it:
- double-counts the same information root;
- infers latent intent/causality from a proxy;
- uses future confirmation, revised data, or hindsight labels;
- selects its own favorable sample/universe/regime after outcomes;
- treats a mechanism, event, producer, consumer, and outcome as independent votes;
- ignores missingness, coverage, tradability, or transaction costs;
- repeatedly reuses the same OOS period;
- confuses maturity percentage with proven stock-selection incrementality.

## Audit risk taxonomy

- SD01 SAME_ROOT_DOUBLE_COUNT
- SD02 PROXY_AS_TRUTH
- SD03 LOOKAHEAD_OR_VINTAGE_LEAKAGE
- SD04 HINDSIGHT_LABEL_OR_OUTCOME_CONDITIONING
- SD05 SAMPLE_UNIVERSE_SURVIVORSHIP_BIAS
- SD06 PARAMETER_REGIME_MULTIPLE_TESTING
- SD07 CAUSAL_OVERCLAIM
- SD08 CROSS_LAYER_EVIDENCE_REUSE
- SD09 MISSINGNESS_COVERAGE_SELECTION_BIAS
- SD10 NON_EXECUTABLE_PAPER_ALPHA
- SD11 TARGET_BENCHMARK_SELF_SELECTION
- SD12 VALIDATOR_SELF_CONFIRMATION

## Responsibility model

Learning rooms own:
- semantic definition;
- competing mechanisms;
- falsification;
- proxy limits;
- source/PIT feasibility;
- exact conditions under which a concept is or is not a distinct candidate.

11｜統計驗證與策略市場狀態研究室 (D16) owns:
- common-support tests;
- residual incrementality;
- OOS/Shadow discipline;
- dependence/date-cluster handling;
- multiple-testing/Factor-Zoo controls;
- target/benchmark freeze;
- calibration and ABSTAIN logic.

00｜研究總控室 owns:
- cross-domain overlap and orphan checks;
- routing;
- owner-gate protection;
- audit closure;
- ensuring a closed issue is not silently recreated in another domain.

System 1 / System 2 engineering rooms own:
- immutable clocks/vintages/provenance;
- lineage/redundancy metadata;
- one-primitive/one-receipt enforcement;
- raw-vote vs de-duplicated evidence diagnostics;
- replay and no-lookahead tests;
- missingness fail-closed behavior;
- execution/coverage observability;
- preventing diagnostics from silently changing Formal behavior.

## Domain-by-domain audit map

| Domain | Learning room | Primary self-deception / blind spot | Risk codes | Learning-room remediation | System/build remediation | Launch priority |
|---|---|---|---|---|---|---|
| D01 K線／型態／價格結構 | 01｜K線與型態研究室 | Named-pattern hindsight; multiple names for same geometry; pivots/confirmation that require future bars; successful-pattern survivorship | SD01 SD03 SD04 SD06 | Freeze label-independent geometry, firstObservableAt/confirmedAt, failure lifecycle, divergent-state tests; treat names as taxonomy not Alpha | System1+System2: episode identity, PRICE_OHLC lineage, one geometry family one effective vote, future-pivot guard | P0 |
| D02 價量關係 | 02｜價量研究室 | Volume interpreted as accumulation/distribution/intent; price component duplicated with D01/D03; intraday/seasonal volume distortion | SD01 SD02 SD07 SD09 | Separate participation from motive; require price-only control and same-slot normalization; keep intent UNKNOWN unless identified | System1+System2: PRICE_OHLC vs VOLUME_TURNOVER lineage, residual-volume diagnostics, no duplicate price vote | P0 |
| D03 趨勢／動能／反轉／技術指標 | 03｜技術指標與趨勢動能研究室 | Indicator zoo; ROC/return/Momentum aliases; EMA/MACD same-root stacking; parameter snooping; repainting | SD01 SD03 SD06 SD11 | Freeze formula/horizon/parameter families before outcomes; prove residual value vs simple returns/trend; repaint-safe clocks | System1+System2: alias registry, redundancy groups, parameter-version registry, dedupedShadowScore | P0 |
| D04 波動率／波動狀態 | 04｜波動與市場微結構研究室 | Volatility state is often a transform/consequence of price; contraction/expansion can duplicate D01/D03; regime state labeled with future realized volatility | SD01 SD03 SD04 SD08 | Define ex-ante volatility states; compare against price/trend controls; freeze episode state before outcome | System1+System2: VOLATILITY_STATE lineage, cutoff-safe state snapshots, one breakout episode not multiple votes | P1 |
| D05 市場微結構／撮合／流動性 | 04｜波動與市場微結構研究室 | Quote/depth snapshot mistaken for executable fill; queue/own impact absent; active-stock coverage bias; liquidity used as Alpha instead of capacity | SD02 SD09 SD10 | Separate observability, capacity and prediction; preserve UNKNOWN for queue/OFI/own impact; study rejected/unfilled opportunities | System1: execution-capacity gate + fill/unfilled/cancel/reject receipts; System2: capacity provenance; never infer fill from quote alone | P1 safety |
| D06 法人／籌碼／槓桿／擁擠／被動資金 | 05｜法人與籌碼研究室 | Flow/holding change interpreted as investor intent; passive/active flows double counted; crowding confused with herding; reporting lags/revisions | SD01 SD02 SD03 SD07 SD08 | Separate observed flow/ownership from motive; preserve passive-flow identity; effective-date/revision semantics; test residual value | System1+System2: INSTITUTIONAL_FLOW_OWNERSHIP lineage, vintage/lag fields, shared receipt reused once | P0 |
| D07 基本面／財報／資訊動態 | 06｜基本面與估值研究室 | Revised statements used historically; accounting comparability breaks; many quality ratios repackage same statements; analyst/forecast availability bias | SD01 SD03 SD05 SD09 | Filing-vintage PIT replay; denominator/comparability guards; cluster accounting ratios by root; no revised-data backfill | System1: filing/source vintage and known-at enforcement, historical universe membership, missingness diagnostics | P1 floor/challenger |
| D08 估值 | 06｜基本面與估值研究室 | Historical percentiles built with current universe; stale fundamentals vs live price; cheapness confused with distress; comparable-group hindsight | SD03 SD05 SD07 SD09 SD11 | PIT comparable universe and denominator rules; separate cheapness from quality/distress; freeze benchmark group ex ante | System1: valuation-source vintage, membership version, denominator eligibility, no current-universe historical backfill | P2 |
| D09 產業／族群／市場廣度／輪動 | 07｜產業與供應鏈研究室 | Circularity: industry winner defined by constituent returns then same constituents rewarded; classification hindsight; breadth/momentum duplicates price family | SD01 SD03 SD05 SD08 SD11 | Effective-dated membership; leave-one-out/benchmark controls; separate taxonomy from return signal; test industry value beyond stock momentum | System1: industry-vintage registry, leave-one-out diagnostics, lineage to constituent returns; no circular double reward | P0 |
| D10 供應鏈／產能／庫存／原物料傳導 | 07｜產業與供應鏈研究室 | Narrative supply-chain mapping after the event; stale supplier/customer graph; ignores substitution/alternate paths; structural exposure duplicated by event modules | SD02 SD04 SD07 SD08 SD09 | Effective-dated graph, confidence/coverage, alternate-path/substitution falsifiers, pre-event structural ownership | System1/System2: versioned exposure graph; D17 consumes graph rather than recreating it; one exposure receipt | P2 challenger |
| D11 公司行動／重大事件／事件風險 | 08｜事件與新聞研究室 | Event importance inferred from subsequent price; announcement time confused with first-known; duplicate disclosures; mechanical corporate-action price effects read as Alpha | SD03 SD04 SD07 SD08 | Freeze event taxonomy/surprise before outcome; separate mechanical adjustment from economic event; dedup event identity | System1: immutable eventId/firstKnownAt/availableAt, duplicate-event guard, corporate-action adjustment lineage | P1 |
| D12 期貨／選擇權／衍生品 | 09｜衍生品與國際總經研究室 | Many features from same option/futures chain; expiry/roll artifacts; continuous-contract lookahead; thin contracts; underlying-price/volatility overlap | SD01 SD03 SD05 SD06 SD09 | Same-parent residual tests; contract/expiry/liquidity semantics; no retroactive continuous back-adjustment; simple-baseline first | System1/System2: DERIVATIVES lineage, contract provenance, roll version, shared-parent dedup | P2 |
| D13 總體經濟／跨市場傳導 | 09｜衍生品與國際總經研究室 | Revised macro releases; timezone/availability leakage; narrative “risk-on/off” after price move; broad macro applied uniformly to stocks; overlaps D18 | SD03 SD04 SD07 SD08 | Vintage/first-release only; surprise vs expectation; heterogeneous exposure; pre-freeze transmission hypothesis | System1/System2: macro vintage/clock, exposure mapping, regime input lineage; no post-outcome risk-on labeling | P2 |
| D14 交易成本／執行品質／Execution Alpha | 10｜投組風控與交易執行研究室 | Filled-trade-only bias; paper slippage; ignores cancels/rejects/unfilled; odd-lot/auction mechanics; selection Alpha confused with execution Alpha | SD05 SD09 SD10 SD11 | Opportunity-set accounting; explicit comparator order; include unfilled/cancel/reject; venue/session separation | System1: broker-confirmed fill lineage, decisionAt quote, implementation-shortfall receipts, fill-opportunity denominator | P1 safety |
| D15 投資組合／風險／資金利用／部位生命週期 | 10｜投組風控與交易執行研究室 | Ex-post optimization; future covariance; utilization mistaken for selection quality; repeated sector exposure; thresholds tuned to winners | SD03 SD05 SD06 SD11 | Freeze risk inputs/constraints; distinguish selection quality from sizing; stress concentration and cash as valid outcome | System1: immutable portfolio decision receipt, pre-trade covariance/version, lifecycle state machine, no hindsight resizing | P1 safety |
| D16 統計驗證／PIT／Shadow／OOS／防過擬合 | 11｜統計驗證與策略市場狀態研究室 | Validator can validate its own chosen target; repeated reuse of same OOS; optional stopping; multiple families; benchmark/target chosen after seeing outcomes; maturity % mistaken for proof | SD05 SD06 SD11 SD12 | Independent preregistration, family accounting, target/MDE freeze, dependence-aware inference, sequential-testing rules, negative-result preservation | System1/System2: immutable experiment registry, outcome-lock, holdout-use ledger, no silent target/benchmark mutation | P0 guard |
| D17 新聞／事件半衰期／受益受害傳導 | 08｜事件與新聞研究室 | Duplicate stories treated as new evidence; publication vs first availability; beneficiary narrative after move; half-life optimized after outcome; overlaps D10/D11/D20 | SD01 SD03 SD04 SD07 SD08 SD09 | Story clustering, source/license coverage, fixed half-life families, event surprise and structural exposure separated | System1/System2: canonical newsEventId, firstKnownAt, story-cluster dedup, consume D10 graph and D11 event identity | P2 challenger |
| D18 市場Regime×策略互動 | 11｜統計驗證與策略市場狀態研究室 | Regimes defined after seeing strategy performance; too many regime slices; regime inputs duplicate D03/D04/D09/D13; small sample per state | SD01 SD04 SD05 SD06 SD11 | Ex-ante state definition, minimum support, simple baseline regimes, interaction preregistration, no performance-shaped regime discovery | System1/System2: frozen regimeState at decision time, lineage of inputs, UNKNOWN/ABSTAIN for unsupported states | P0/P1 control |
| D19 資產定價／因子投資／市場異象 | 12｜資產定價與因子研究室 | Factor Zoo; momentum duplicates D03; current-universe survivorship; benchmark choice; turnover/cost omission; calendar anomaly data-mining | SD01 SD05 SD06 SD10 SD11 | Factor family accounting, PIT universe, spanning/residual tests, cost-aware net factor return, independent years/regimes | System1: Challenger-only integration until incremental OOS evidence; factor lineage and turnover diagnostics | P2 challenger |
| D20 行為金融／投資人注意力／市場心理 | 13｜行為金融與市場心理研究室 | Story-first behavioral labels; latent motive unidentifiable; herding duplicates D06 crowding; reversal duplicates D03; social-data availability bias | SD01 SD02 SD04 SD07 SD09 | Require behavior-specific observable beyond primitive price/flow; competing mechanism tests; preserve UNIDENTIFIED state | System1/System2: no behavioral vote without observable lineage; social-source coverage/latency and missingness diagnostics | P2 |
| D21 公司治理／經營者／內部人／控制權品質 | 14｜公司治理與內部人研究室 | Governance score built after scandals; insider action timing/administrative reasons; lagged filings; successful-firm survivorship; governance correlated with fundamentals | SD03 SD04 SD05 SD07 SD08 | Authoritative known-at dates; distinguish transaction from motive; control fundamentals/size/industry; preserve negative/null cases | System1: governance/insider event vintage, issuer-universe history, no hindsight controversy labels | P2 |
| D22 信用市場／資本結構／融資壓力／股債傳導 | 15｜信用市場與資本結構研究室 | Credit ratios duplicate D07; sparse bond coverage creates biased sample; fair value confused with trades; recovery/seniority flattened; rates double counted through D13/D07 | SD01 SD05 SD07 SD08 SD09 | Same-population accounting baseline; coverage maps; instrument-level seniority/collateral; fair-value vs trade separation; residualize rates/fundamentals | System1: CREDIT_CAPITAL_STRUCTURE lineage, coverage eligibility, instrument provenance; no sparse-coverage “good data only” Alpha | P2 |

## Cross-domain mandatory controls

These controls apply to every domain, even if not repeated in its row:

1. **Lineage before voting** — every factor must expose its information root and ancestry.
2. **One primitive receipt, many consumers** — a single event/price-limit/flow/rate/exposure observation may feed multiple analytical layers but is not automatically multiple evidence votes.
3. **First-known clock** — historical decision uses only what was knowable then; revised/current data cannot backfill earlier decisions.
4. **Proxy firewall** — observed proxy != motive, causality, true flow, true OFI, accumulation, distribution, herding, attention, or distress unless separately identified.
5. **Target/benchmark freeze** — outcome, metric, comparator, horizon, cost treatment and threshold/MDE freeze before outcome inspection.
6. **Universe-vintage freeze** — current constituents, industries, issuers, listed survivors, and data-rich names cannot define historical universes.
7. **Common support** — incremental comparisons use the same eligible parents where possible; missing-data advantages are reported, not hidden.
8. **Negative-result preservation** — failed/neutral tests remain in the ledger; only publishing winners is an audit failure.
9. **Execution realism** — selection evidence does not imply fillability; spreads, depth, queue, reject/cancel/unfilled, odd-lot and market-impact limits stay explicit.
10. **Regime firewall** — regimes are frozen before strategy outcomes and cannot be carved to manufacture performance.
11. **Repeated-OOS ledger** — repeatedly querying the same “OOS” makes it development data; holdout consumption must be logged.
12. **Formal firewall** — Shadow diagnostics may be built autonomously; any change to formal eligibility/ranking/Top6/weights/thresholds requires explicit owner approval.

## Routing priority

### Immediate launch-critical audit work
- 01｜K線與型態研究室: D01 hindsight/geometry/clock firewall.
- 02｜價量研究室: D02 motive/proxy and price-vs-volume residual firewall.
- 03｜技術指標與趨勢動能研究室: D03 alias/indicator-zoo/parameter firewall.
- 05｜法人與籌碼研究室: D06 intent/vintage/passive-active/crowding firewall.
- 07｜產業與供應鏈研究室: D09 circular industry-return and membership-vintage firewall.
- 11｜統計驗證與策略市場狀態研究室: D16 validator/OOS/target firewall + D18 regime firewall.
- System 1: enforce lineage, clocks, universe vintage, raw-vs-dedup diagnostics, experiment/holdout ledger.
- System 2: same controls for resonance/confluence and strategy aggregation.

### Second wave
- 04｜波動與市場微結構研究室: D04/D05.
- 08｜事件與新聞研究室: D11/D17.
- 10｜投組風控與交易執行研究室: D14/D15.

### Challenger / non-blocking wave
- 06｜基本面與估值研究室: D07/D08.
- 09｜衍生品與國際總經研究室: D12/D13.
- 12｜資產定價與因子研究室: D19.
- 13｜行為金融與市場心理研究室: D20.
- 14｜公司治理與內部人研究室: D21.
- 15｜信用市場與資本結構研究室: D22.
- 07/08 remain owners for D10/D17 challenger-specific causal/graph work.

## Audit closure rule

A blind spot is not closed by adding documentation alone.

Closure requires, as applicable:
- learning-room semantic/falsification repair;
- machine-enforceable lineage/clock/provenance rule;
- deterministic tests;
- replay/Shadow receipt;
- D16 incremental/robustness evidence;
- 00-room cross-domain audit readback.

No blind-spot closure by maturity percentage alone.

## Current decision

This audit creates no Formal Core change, no ranking change, no module maturity change, and no automatic production behavior change.

It is a standing audit map for research and system construction.
