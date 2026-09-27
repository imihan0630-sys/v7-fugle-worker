# System 2 State-Owned Bank Flow Research

Updated: 2026-09-27 Asia/Taipei
Status: DISCOVERY / RESEARCH_REQUIRED / AUXILIARY_CONTEXT_ONLY / SOURCE_CONTRACT_NOT_READY

## Research question

Can trading by Taiwan's state-owned bank group provide incremental context for:
1. market-stabilization / contrarian buying during broad selloffs;
2. distinguishing policy/stabilization flow from ordinary institutional conviction;
3. interpreting later state-owned-bank selling after a rebound without automatically treating it as company-thesis deterioration?

This research is motivated by owner observation and external evidence. It is NOT assumed to be a standalone stock-selection alpha.

## Important semantic distinction

STATE_OWNED_BANK_FLOW（公股行庫資金流） is NOT identical to:
- National Financial Stabilization Fund（國安基金） activity;
- government fund activity;
- ordinary three-institution flow;
- informed "smart money" conviction.

Public reporting and vendor descriptions indicate that state-owned-bank trading may include ordinary bank proprietary/investment operations, while government-related funds may also route orders through state-owned bank channels. Therefore motive/beneficial-owner identity is generally UNKNOWN unless independently evidenced.

## Evidence summary

- Public reporting has repeatedly documented state-owned banks buying during market stress or sharp foreign selling.
- Public-bank managers have also stated that banks retain their own board-authorized investment operations and may buy quality companies for investment return rather than only for stabilization.
- Historical cases show state-owned banks can be net sellers even while the National Financial Stabilization Fund is active; therefore "state-owned bank flow = government stabilization" is false.
- Academic/event-study evidence on Taiwan large shipping stocks finds statistically significant abnormal-return associations around extreme net trading by the eight state-owned banks, but the study is narrow (three shipping stocks) and does not establish a universal directional rule.
- Taiwan government-intervention research supports market-wide stabilization effects from direct government intervention, especially in blue chips, but this is not evidence that every state-owned-bank trade has the same mechanism.

## Owner hypothesis to test

Potential lifecycle:
MARKET_STRESS（市場壓力）
-> STATE_OWNED_BANK_SUPPORT_BUY（公股支撐買盤）
-> PRICE_STABILIZATION / REBOUND（價格穩定／反彈）
-> STATE_OWNED_BANK_NORMALIZATION_SELL（公股正常化賣出）

Key implication:
A later state-owned-bank sell after a successful rebound may represent:
- normalization / reduction of stabilization inventory;
- ordinary profit-taking / portfolio management;
rather than new negative information about the company.

Therefore a state-owned-bank sell must NOT be treated with the same semantic sign as:
- trust selling;
- foreign directional selling;
- ownership concentration deterioration.

## Candidate factor states

- PUBLIC_FLOW_SUPPORTIVE（公股流向支撐）
- PUBLIC_FLOW_COUNTERCYCLICAL（公股逆勢承接）
- PUBLIC_FLOW_NORMALIZATION_SELL（公股正常化賣出）
- PUBLIC_FLOW_ALIGNED_SELL（公股與市場同步賣出）
- PUBLIC_FLOW_DIVERGENCE（公股與其他法人方向背離）
- PUBLIC_FLOW_UNKNOWN（公股流向未知）

These are descriptive states only.

## Candidate derived features

Market-level:
- stateOwnedNetBuyValue;
- stateOwnedNetBuyValue / marketTurnover;
- consecutiveStateOwnedBuyDays;
- stateOwnedFlowVsTAIEXReturn;
- stateOwnedFlowVsForeignFlow;
- stateOwnedFlowVsMarketBreadth;
- stateOwnedFlowRegime: CONTRARIAN / ALIGNED / MIXED.

Stock-level:
- stateOwnedStockNetBuyValue;
- stateOwnedStockNetBuyShares;
- stateOwnedStockFlow / stockTurnover;
- stateOwnedStockFlow / ADV;
- consecutiveStateOwnedStockBuyDays;
- stateOwnedFlowVsStockReturn;
- stateOwnedFlowVsForeignTrustFlow;
- stateOwnedFlowVsOwnershipConcentration;
- postSupportSellAfterRebound flag;
- priorSupportAccumulatedInventory proxy only if source semantics permit.

## Interpretation rules

1. A large state-owned-bank buy during a broad selloff is market-support context, not proof the specific stock is undervalued.
2. A state-owned-bank buy against heavy foreign selling may indicate cushioning/absorption but does not prove that the public bank has superior information.
3. A later public-bank sell after a rebound does not automatically invalidate a bullish industry/company thesis.
4. A public-bank sell that coincides with deteriorating industry/company evidence, weak price acceptance, foreign/trust selling and ownership dispersion may be more adverse.
5. Strong state-owned-bank activity in index heavyweights must control index-weight / blue-chip bias.
6. ETF/index-rebalance/passive-flow contamination must be separated where possible.
7. No hidden intent such as "護盤" or "出貨" is asserted from broker-flow data alone unless supported by independent evidence.

## Role inside INSTITUTIONAL_ACCUMULATION

Proposed role: CONTEXT_ONLY（僅脈絡） / WARNING_MODIFIER（警告修正） at first.

Do NOT merge state-owned-bank flow into ordinary institutional-accumulation score.

Potential value:
- reduce false positive: public-bank support buying should not be mistaken for ordinary informed institutional accumulation;
- reduce false negative: public-bank selling after a rebound should not automatically be treated as deterioration if primary industry/fundamental/chip thesis remains strong;
- identify market-stabilization regime where other actor flows need different interpretation.

Promotion to SUPPORTIVE or REQUIRED requires prospective incremental evidence.

## Falsification design

Compare:
A. baseline institutional/chip model without state-owned-bank context;
B. + state-owned-bank market-level regime;
C. + stock-level state-owned-bank flow;
D. + lifecycle classification (support buy -> rebound -> normalization sell).

Required controls:
- TAIEX/TPEx market return and breadth;
- market turnover;
- stock size/index weight;
- stock/sector relative strength;
- foreign/trust/dealer flow;
- price-volume acceptance;
- industry/fundamental thesis;
- passive/index-rebalance dates;
- crisis/event clusters;
- liquidity;
- independent scan date.

Outcomes:
- D1/D3/D5/D10/D20;
- MFE/MAE;
- false-break/stop-first where applicable;
- whether public-bank selling after prior support buy predicts adverse returns after controlling rebound magnitude;
- whether public-bank support buys improve downside stabilization rather than upside alpha.

Reject/downgrade if:
- effect disappears after market drawdown/index-weight controls;
- benefit is only blue-chip/index exposure;
- vendor "state-owned bank" data cannot establish stable historical semantics;
- activity is dominated by government-fund/passive routing that cannot be separated;
- public-bank flow adds no incremental information to market regime + price-volume + ordinary institutional flow.

## Source readiness

Current System 2 repository does not contain a canonical state-owned-bank flow source.

Potential external sources observed:
- TEJ historical dataset used by academic research;
- CMoney total-company state-owned-bank broker aggregation.

Important provenance issue:
Vendor definitions may aggregate only selected head-office broker branches and may differ across platforms. Such data are not equivalent to legal beneficial-owner identity.

Before use:
1. freeze exact member institutions / broker codes;
2. define total-company vs all branches;
3. verify stock/ETF coverage;
4. verify shares/value units;
5. verify corporate-action handling;
6. record availableAt / update time;
7. preserve source/vendor version;
8. explicitly mark government-fund identity UNKNOWN.

## Current decision

WORTH_RESEARCH / AUXILIARY_CONTEXT_ONLY.
Do not use as a standalone buy/sell signal and do not assume "public buy = bullish" or "public sell = bearish".
