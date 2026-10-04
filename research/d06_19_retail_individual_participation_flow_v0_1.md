# D06-19 Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）研究 V0.1

Updated: 2026-10-04 Asia/Taipei
Owner: 05｜法人與籌碼研究室
Status: MECHANISM_AND_FALSIFICATION_DEFINED / DIRECT_RETAIL_OBSERVABILITY_VERIFIED_AT_MARKET_AND_CHANNEL_LEVEL / STOCK_DATE_DIRECTIONAL_SOURCE_GAP / OUTCOMES_CLOSED / FORMAL_UNCHANGED
Formal Core impact: NONE / LOCKED

## Research question（研究問題）

台灣市場能否把 retail / individual investor（散戶／自然人）視為獨立可觀測的市場參與者，而不是用融資、當沖、零股、券商分點或 total-minus-institutions（市場總量減法人）殘差替代？若可以，哪些 observable（可觀測量）可直接使用，哪些仍必須保持 UNKNOWN（未知）？

## 1. Exact object decomposition（精確物件拆解）

本模組分成四種不同物件，禁止互相代換：
- participation（參與）：自然人成交值、成交戶數、成交占比；
- ownership（持有）：自然人持股戶數、持股級距、市場持股占比；
- directional flow（方向流）：自然人買進、賣出、淨買賣；
- channel activity（通道活動）：零股、信用、當沖等特定制度下的自然人參與。

只有來源直接提供 investor class（投資人類別）時，才可稱 direct retail / individual observable（直接自然人可觀測量）。

## 2. Taiwan direct observability（台灣直接可觀測性）

### Market-wide trading participation（市場整體交易參與）
TWSE Fact Book 2026 的 Annual Trading Value by Shareholder Structure（依股東結構年度成交值）把 Domestic Individual Investors（本國自然人）獨立列示。2025 年本國自然人成交值占比為 52.11%。
Source: https://www.twse.com.tw/downloads/zh/about/company/factbook/2026/3.04.html

這證明：
`DOMESTIC_INDIVIDUAL_MARKET_TRADING_PARTICIPATION = DIRECTLY_OBSERVABLE`。

### Ownership（持有）
TWSE Fact Book 2026 直接列示 Domestic Individual Share-ownership by Size of Holding（本國自然人持股級距）。2025 年各持股級距的人數與比重可直接觀察。
Source: https://www.twse.com.tw/downloads/zh/about/company/factbook/2026/4.01.html

這證明：
`DOMESTIC_INDIVIDUAL_MARKET_OWNERSHIP_DISTRIBUTION = DIRECTLY_OBSERVABLE_AT_AGGREGATE_LEVEL`。

### Odd-lot channel（零股通道）
TWSE 官方研究指出，2020-10-26 至 2024-10-30 盤中零股交易中，本國自然人成交金額占比 82.5%。
Source: https://www.twse.com.tw/market_insights/zh/detail/8a8216d6933460a401936c53f6d9018e

這證明自然人可在特定通道被直接分類；但只證明 channel-specific participation（特定通道參與），不能外推成全市場或個股方向流。

### Individual account data exist but are private/account-scoped（個人帳戶資料存在但屬個人範圍）
TWSE 投資人查詢程序明定可查詢本人證券帳戶、成交紀錄與委託紀錄。
Source: https://twse-regulation.twse.com.tw/m/LawContent.aspx?FID=FL086228

這證明交易資料可辨識到個人帳戶層級，但該查詢制度是個人資料服務，不是可供市場研究建模的全市場自然人聚合資料契約。

## 3. Directional stock-level gap（個股方向流缺口）

截至本輪官方來源盤點，尚未驗證到一個可授權、可持續、可重播的官方資料產品，能同時提供：
- domestic natural person（本國自然人）；
- stock/security（個股／證券）；
- trade date（交易日）；
- buy shares/value（買進股數／金額）；
- sell shares/value（賣出股數／金額）；
- net buy/sell（淨買賣）；
- producedAt / firstKnownAt / revision semantics（產製／首次可知／修訂語意）。

因此：
`DOMESTIC_NATURAL_PERSON_STOCK_DATE_DIRECTIONAL_FLOW = UNKNOWN / SOURCE_GAP`。

UNKNOWN 不是 0，也不是「散戶沒有買賣」。

## 4. Positive mechanisms（正向機制）

自然人資料具有潛在研究價值的正向機制包括：
1. attention / speculative participation（注意力／投機參與）：自然人參與可能在特定市場狀態下放大成交與波動；
2. contrarian / mean-reversion demand（反向／均值回歸需求）：部分台灣研究發現自然人群聚更偏向買進過去弱勢、賣出過去強勢；
3. disposition effect（處分效果）：自然人可能較快實現獲利、較慢實現虧損；
4. overconfidence / turnover（過度自信／換手）：市場上漲後自然人交易活動可能增加；
5. microstructure interaction（微結構交互）：自然人占比較高的零股、信用、當沖等通道可能有不同的流動性與價格形成效果。

Academic priors（學術先驗）只用於提出可反證假說，不直接移植效果大小：
- Hsieh (2013), International Review of Financial Analysis: Taiwan individual and institutional herding differ in stock characteristics and subsequent returns. https://www.sciencedirect.com/science/article/pii/S1057521913000045
- Chuang & Susmel (2011), Journal of Banking & Finance: Taiwan individual and institutional investors both trade more after gains in some regimes; only individuals show stronger risky-security response after gains. https://www.sciencedirect.com/science/article/pii/S0378426610004425
- Shu et al. (2005), Pacific-Basin Finance Journal: Taiwan individual investors show a strong disposition effect, but the effect varies by stock characteristics and margin usage. https://www.sciencedirect.com/science/article/pii/S0927538X04000411

## 5. Falsification（反證）

以下通用捷徑全部拒絕：
- `MARGIN_FINANCING = RETAIL_FLOW`：融資是槓桿通道，不是自然人身分類類別；
- `DAY_TRADING = RETAIL_FLOW`：當沖是 round-trip turnover（當日往返換手），不是自然人方向性持倉；
- `ODD_LOT = ALL_RETAIL`：零股自然人占比高不代表所有自然人只做零股，也不代表整體市場自然人比例相同；
- `BROKER_BRANCH = RETAIL_OR_MAIN_FORCE_IDENTITY`：券商／分點是執行中介，不是 beneficial owner（最終受益人）；
- `TOTAL_MARKET - INSTITUTIONS = RETAIL_NET_FLOW`：市場交易類別、交易雙邊性、其他法人／投資人類別與定義差異使殘差不能等同直接自然人淨流量；
- `RETAIL_HIGH = BEARISH` 或 `RETAIL_HIGH = BULLISH`：自然人參與的效果受市場狀態、股票特徵、價格位置、流動性與交易制度影響。

## 6. Frozen state taxonomy（凍結狀態分類）

允許的研究狀態：
- `RETAIL_MARKET_PARTICIPATION_HIGH/LOW`：只描述市場整體自然人交易參與；
- `RETAIL_OWNERSHIP_DISTRIBUTION_STATE`：描述市場持有結構；
- `RETAIL_CHANNEL_INTENSITY_ODDLOT/MARGIN/DAYTRADE`：描述特定通道，且必須保留原始 owner；
- `DIRECT_RETAIL_STOCK_FLOW`：只有在直接個股自然人方向流來源驗證後才允許啟用；目前 = UNKNOWN。

以上均不得直接映射 BUY/SELL。

## 7. Anti-double-count（防重複計票）

- D06-07 owns margin leverage（融資槓桿）；
- D06-10 owns TDCC holding-size distribution（集保持股級距）；
- D06-13 owns broker/branch execution flow（券商／分點執行流）；
- D06-14 owns day-trading turnover（當沖換手）；
- D06-19 只擁有 direct investor-class evidence（直接投資人分類證據）與其 market/channel/ownership/directional semantics（市場／通道／持有／方向語意）。

同一底層資料不得因被解讀成「散戶情緒」而在 D20 再形成第二張方向票。D20 若使用，必須是 behavioral transform（行為轉換）且有額外可識別行為證據。

## 8. PIT / Replay requirements（時點一致性／重播要求）

任何可進入 L3 的直接自然人來源至少需保存：
- investorClassDefinition；
- market / segment；
- tradeDate / symbol（若為個股）；
- sourceProduct / sourceVersion；
- producedAtContract；
- capturedAt；
- firstKnownAt；
- revision/finality；
- coverageUniverse；
- contentHash；
- parserVersion；
- unknownReasons。

後來取得的完整資料不得倒填成歷史 firstKnownAt；市場／年度統計不得回填成個股日流量；個人查詢服務不得當成全市場研究 feed（資料流）。

## 9. Maturity decision（成熟度判定）

Promotion: `D06-19 L0/0% -> L2/40%`.

Reason:
- 理論與物件定義已完整；
- 台灣直接自然人市場／通道／持有資料的官方可觀測性已驗證；
- 正向機制與主要反證均已定義；
- 與融資、當沖、零股、分點、D20 的 owner boundary（主責邊界）已凍結。

Why not L3:
- 本國自然人個股×日期方向流的官方／授權來源契約尚未驗證；
- 市場層級或通道層級資料不能替代個股方向流；
- 尚無前瞻 immutable receipt（不可變憑證）與 replay（重播）驗證。

## 10. Exact next（下一步）

1. 搜尋官方或授權型 stock×date×investor-class 研究資料路徑；若只有研究合作／受限資料，記錄 access class（存取級別），不得假裝 public feed。
2. 若直接方向流仍不可取得，先建立 market-level retail participation regime（市場自然人參與狀態）的 PIT contract（時點契約），但不得稱 stock-level retail flow。
3. 研究市場／通道自然人參與相對於 margin/day-trade/odd-lot proxies（融資／當沖／零股代理量）的相關性與失真，不讀未預註冊 outcome（結果）。
4. L3 之前不得建立自然人方向分數、買賣門檻或 Formal modifier（正式修正項）。

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
