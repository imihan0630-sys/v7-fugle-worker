# Curriculum 15-Item Dependency Audit 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: OWNER_APPROVED / EXECUTED_GOVERNANCE_CLASSIFICATION
Scope: 15 remaining curriculum review candidates
Formal Core impact: NONE
Curriculum count impact: NONE — remains 22 domains / 354 modules

## Governing decision

The owner approved the 15-item governance classification from 00｜研究總控室.

This approval does **not** authorize any immediate module deletion, standalone-ID retirement, Formal Core promotion, production ranking change, capital change, entry/exit change, monitoring change or notification change.

Current result:
- Formal keep: 2
- Keep but role-limited to context/capability: 4
- Observation / RESEARCH_ONLY: 8
- Strong merge candidate after validation: 1
- Immediate retirement: 0

Curriculum remains 22 domains / 354 modules.

The governing principle remains:

**拆開學習，融合判斷。不是獨立 Alpha 不代表沒有學習價值；有研究價值也不代表應形成 Hard Gate（硬門檻）。**

## Owner-approved classifications

| Module | Governance classification | Hybrid role | Dependency / anti-orphan rule | Required next step |
|---|---|---|---|---|
| D02-07 OBV（能量潮） | OBSERVATION / RESEARCH_ONLY / MERGE_CANDIDATE | SUPPORTIVE（輔助）或解釋用途；不得為 Hard Gate / PRIMARY_ALPHA | Preserve existing research and System 2 OBV explanatory capability. D02 owns residual comparison against direct price/volume, turnover and RVOL. | Run residual / incremental-value tests. If no independent value remains, merge into the D02 price-volume family or keep UI/explanation only. |
| D02-08 吸籌／出貨代理變數 | OBSERVATION / RESEARCH_ONLY / STRONG_MERGE_CANDIDATE_IF_UNIDENTIFIABLE | CONFIDENCE / CONTEXT only until independently observable evidence exists | D02-06 owns effort-vs-result; D02-05/D02-09 own overlapping price-volume descriptions; D05/D06-13 may supply a different data family. OHLCV alone cannot identify hidden actor intent. | Require an independent observable data family and falsification against liquidity/rebalancing/event alternatives. Never infer “主力意圖” from OHLCV transforms alone. |
| D05-13 Queue Position / Order Priority（委託排隊位置／優先權） | FORMAL_KEEP | STRATEGY_SPECIFIC_CAPABILITY（策略專屬能力） / execution confidence | D05 owns queue mechanics; D14 may consume it for fill probability/slippage/partial-fill execution research. | Study market-rule and order-book observability; do not turn it into stock-selection Alpha. |
| D06-15 官股行庫／特定資金流 | KEEP_ROLE_LIMITED | CONTEXT_ONLY（僅情境） / warning modifier | D06-13 broker-branch data is execution-channel evidence, not beneficiary identity. Government-bank/fund intent remains UNKNOWN without independent evidence. | Validate regime/context usefulness; never map public-bank buying directly to bullish or selling directly to bearish. |
| D12-08 Gamma Exposure / Dealer Gamma（伽瑪曝險／造市商伽瑪） | OBSERVATION / RESEARCH_ONLY | CONTEXT_ONLY / CONFIDENCE until PIT-signed-position identifiability is proven | Preserve D12-08 identifiability firewall. D12-13 owns contract Greeks; D12-09 owns expiry effects; neither fully replaces dealer-position exposure. | Continue prospective Gamma evidence and signed-position identifiability work before considering merge. |
| D14-16 VWAP / TWAP / Participation Execution（成交量加權／時間加權／參與率執行） | KEEP_ROLE_LIMITED | STRATEGY_SPECIFIC_CAPABILITY / Execution capability | D05 owns microstructure/impact mechanisms; D14-17 owns implementation shortfall; D14-18 owns alpha decay/urgency. | Keep as execution-method family; no stock-selection Gate. Revisit priority as capital size / automation grows. |
| D14-19 Short-sale Execution / Recall / Forced Buy-in / Squeeze Risk（放空執行／召回／強制回補／軋空風險） | KEEP_ROLE_LIMITED | STRATEGY_SPECIFIC_CAPABILITY; selected borrowability/safety conditions may be HARD_INVALIDATION for short strategies only | D06-18 owns securities-lending economics/availability; D20-13 owns limits-to-arbitrage mechanism; D14-19 owns actual short execution/maintenance/exit. Do not collapse these three layers. | Preserve separate ownership and cross-link them; validate Taiwan short-sale/borrow lifecycle and forced-cover conditions. |
| D15-19 Kelly / Fractional Kelly（凱利／分數凱利） | VALIDATION_THEN_STRONG_MERGE_CANDIDATE | STRATEGY_SPECIFIC_CAPABILITY / position sizing method | Depends on D16-25 probability calibration and D15 risk/position lifecycle controls. Preserve theory/evidence even if standalone ID later retires. | Do not merge yet. After calibrated win/loss distribution and uncertainty evidence mature, evaluate absorption into position-sizing / probabilistic-decision ownership. |
| D19-08 Idiosyncratic Volatility（特質波動異象） | OBSERVATION / RESEARCH_ONLY | PRIMARY_ALPHA candidate only after neutralized residual evidence; otherwise SUPPORTIVE/REJECT | Must control Size, Beta, total volatility, liquidity and related factor exposures; D16 owns multiple-testing/overfit controls. | Taiwan PIT neutralization and OOS/multi-regime tests required before independent-factor status. |
| D19-12 Seasonality / Calendar Anomalies（季節性／日曆異象） | OBSERVATION / RESEARCH_ONLY | CONTEXT_ONLY or strategy-specific Alpha candidate only after robust OOS evidence | High data-mining / multiple-testing risk; D16 controls multiple testing and OOS; event/regime explanations must be separated. | Multi-year, multi-regime, pre-specified calendar tests with transaction costs and independent dates. |
| D19-13 Relative Value / Pairs / Cointegration / Residual Mean Reversion（相對價值／配對／共整合／殘差均值回歸） | FORMAL_KEEP | STRATEGY_SPECIFIC_CAPABILITY / strategy-specific PRIMARY_ALPHA family | D19-14 has already merged here. Preserve factor-neutralization, structural-break, cost, capacity and multiple-testing controls. | Keep as independent strategy family; never add it as a generic long-only stock-selection vote. |
| D19-16 Liquidity Premium / Illiquidity Factor（流動性溢酬／非流動性因子） | OBSERVATION / RESEARCH_ONLY | PRIMARY_ALPHA candidate only after residual evidence; otherwise context/supportive | Must neutralize Size, Value, Volatility, Turnover, Spread and control costs/capacity. D05 remains owner of execution liquidity mechanics. | Prove residual Taiwan PIT alpha beyond liquidity/tradability observables before promotion. |
| D20-03 Overconfidence（過度自信） | OBSERVATION / RESEARCH_ONLY | CONTEXT_ONLY / CONFIDENCE unless independent observable proxy proves incrementality | High overlap with D20-07 attention, D20-10 sentiment and D20-12 behavioral-vs-structural falsification. Price/volume alone cannot prove psychology. | Search for independent observable proxies; if mechanism is not separately identifiable, merge into behavioral attention/sentiment/falsification family. |
| D20-05 Representativeness / Recency（代表性／近因偏誤） | OBSERVATION / RESEARCH_ONLY | CONTEXT_ONLY unless independent mechanism evidence survives | High overlap with D20-08 underreaction, D20-09 overreaction/reversal and D03 momentum/reversal. | Test identifiable proxies and residual value; if not separable, merge into D20-08/D20-09 behavior-response family. |
| D21-02 Board / Independent Directors（董事會／獨立董事） | KEEP_ROLE_LIMITED | CONTEXT_ONLY / CONFIDENCE / tail-risk context | Explicit dependency from D21-01 ownership/control work. Separate board/management control from voting/cash-flow rights; preserve PIT/vintage governance data. | Study governance context, monitoring quality and tail-risk relevance; do not use as a short-horizon stock-selection hard gate. |

## Cross-module decisions frozen by this audit

### D14-19 / D06-18 / D20-13
Do **not** merge these three at this stage.

Ownership is intentionally layered:
1. D06-18 = securities-lending supply, borrow fee, availability, utilization.
2. D20-13 = economic limits to arbitrage / noise-trader risk.
3. D14-19 = actual short-sale execution, recall, forced buy-in and squeeze execution risk.

### D12-08 / D12-09 / D12-13
Do **not** merge D12-08 yet.

- D12-13 = contract-level Greeks.
- D12-09 = expiry/settlement effects.
- D12-08 = market/dealer-position exposure hypothesis requiring signed-position identifiability.

The existing D12-08 identifiability firewall remains mandatory.

### D15-19 / D16-25 / D15 position sizing
D15-19 is the strongest future merge candidate in this audit, but **not yet mergeable**.

A later merge requires:
- calibrated outcome probabilities/distributions;
- uncertainty-aware sizing;
- comparison against simpler fixed/risk-budget sizing;
- drawdown/tail-risk constraints;
- transaction-cost and capital-utilization review;
- no hidden Formal promotion.

## Routing

- D02-07 / D02-08 -> 02｜價量研究室
- D05-13 -> 04｜波動與市場微結構研究室
- D06-15 -> 05｜法人與籌碼研究室
- D12-08 -> 09｜衍生品與國際總經研究室
- D14-16 / D14-19 / D15-19 -> 10｜投組風控與交易執行研究室
- D19-08 / D19-12 / D19-13 / D19-16 -> 12｜資產定價與因子研究室
- D20-03 / D20-05 -> 13｜行為金融與市場心理研究室
- D21-02 -> 14｜公司治理與內部人研究室

00｜研究總控室 owns governance and acceptance only; it does not claim specialist empirical validation.

## Formal boundary

- 22 domains / 354 modules remain unchanged.
- No module is retired by this audit.
- No maturity level is promoted by this audit.
- No System 1 / System 2 Formal Core behavior changes.
- No new Hard Gate is authorized.
- UNKNOWN remains distinct from FAIL and 0.
- Any later merge/retirement requires fresh latest-main read, specialist evidence, dependency re-audit, explicit owner approval and anti-orphan verification.
