# Alpha-oriented Knowledge Discovery｜外部續掃 V0.2

研究時間：2026-10-04T07:20:54+08:00 → 2026-10-04T07:40:28+08:00（台北；提交時間另以 Git commit 為準）。
起始 main：5c0f413c88065878d84236f0c979b489f419c271；提交前核對基準：ca844efda3809050238986acb1a160e2d439a428。

## 結果

沒有新增 Specialist Validation Candidate，沒有證明 TRUE_GAP。37 個題目登錄：Layer A 35、B 1、C 1、D 0。題目數不是論文數，也不是新增模組數。31 個指定家族均有 triage；此處對照 owner scopes，不重做 354 模組終審。

- AOKD-05：經濟實質的跨期揭露變動，SCOPE_EXTENSION_CANDIDATE，Layer C；先做歷史 corpus／clock 可行性和既有 owner 範圍釐清。
- AOKD-06：相對契約條件的 B2B 付款行為，DATA_FEASIBILITY_BLOCKED，Layer B；台灣歷史 issuer panel 未證实。
- AOKD-01～04 狀態照舊，不代寫 specialist return。最新 tracker 已有 D07-33，但預期 A01 回件未找到，00 必須核對來源與治理鏈。

最新核對 tracker：22 domains／354 modules／41.5% weighted maturity。與移交38.3%及初讀39.5%的差異來自其他研究室；本提交不修改 tracker、owner、maturity、System1／System2 Formal。Formal Core LOCKED；COV ID = NONE；FORMAL_OPTIMIZATION_CANDIDATE = NONE。

## 證據門檻與查重

每一題先比 observable、economic mechanism、decision role；機器登錄保存命中模組完整 learningScope。家族相同且只是新論文／新資料／新模型，歸既有主責。一般 NLP／LLM 仍屬 D16-22；A05 保留的是窄的跨期經濟揭露 observable，並非新增文字工具課。

文獻多為 primary abstract／author-university record／官方文件。無法取得全文的論文沒有假稱完成 full-table factor control；正證只提供待驗假說，不提供台股 alpha。日本 counterexample 為2026會議論文，不能等同高品質獨立金融期刊 replication。來源新舊、修訂日期與 retrieval 限制见來源登錄。

## 反證摘要

1. L02 日本整體文本變動沒有支持單純 Lazy Prices 移植；方向性詞彙結果是另一限定假說。
2. L03 optionable conditioning、L04 處理科技、L05 微型股／replication 使歷史顯著不等於可交易台股增益。
3. L08 同一付款文獻中，突發嚴重拖延與持續適度拖延方向不同；付款晚不能直接變負分。
4. L10／L11 風險補償與產業困境可解释 returns；必須區分 priced risk 與排序增量。
5. L13 注意力造成波動並不等於可預測方向；L15 模型分歧不等於投資人意見分歧。
6. O11 的明細付款 API 限美國；O09 台灣商業報告存在不能推導長期台灣PIT panel。
7. 原始修訂鏈、as-of entity mapping、delisted coverage 缺少時維持 UNKNOWN，不得回填歷史 Shadow。

## 飽和紀錄

- initial broad scan：fundamentals/accounting/valuation/asset pricing; microstructure/options; innovation/network/regimes。Existing owners dominate; narrow filing-delta extension emerged; inherited A01–04 routed, not redone.
- official-source check：TWSE/TPEx/MOPS/TAIFEX/TIPO/FSC/TDCC/MOL; government sources。Availability does not establish historical first-known receipts. Taiwan corpus/payment panels unproven.
- expanded gap search：productivity/trade credit/cyber/internal controls/litigation; disagreement/common ownership; supply/attention。B2B contract-relative payment observable identified as A06; saturation not declared at this point.
- follow-up 1：information processing/payments/productivity。A06 source restriction verified; other results existing/inherited; zero additional retained families.
- follow-up 2：disclosure/network/distress。Existing mechanisms and A05/A06 duplicates; zero additional retained families.
- follow-up 3：replication/text/attention/out-of-sample。Counterevidence and existing methodology owners; zero additional retained families.

在 A06 出現後才進行三輪 follow-up，均未新增保留家族。故判為本輪、有範圍的外部探索暫時飽和，不宣稱全球文獻窮盡。搜尋異常回傳字典／無關頁面的 system1 批次不計為飽和證據；不得把沒有檢索到當成反證。

## 文件導航

- 完整機器登錄：[aokd_external_sweep_registry_20261004_v0_2.json](aokd_external_sweep_registry_20261004_v0_2.json)
- Layer A：[AOKD_REJECTED_ALREADY_OWNED_REGISTRY_20261004_V0_2.md](AOKD_REJECTED_ALREADY_OWNED_REGISTRY_20261004_V0_2.md)
- 台灣資料矩陣：[AOKD_TAIWAN_DATA_FEASIBILITY_MATRIX_20261004_V0_2.md](AOKD_TAIWAN_DATA_FEASIBILITY_MATRIX_20261004_V0_2.md)
- 主責／增量矩陣：[AOKD_OWNER_INCREMENTALITY_MATRIX_20261004_V0_2.md](AOKD_OWNER_INCREMENTALITY_MATRIX_20261004_V0_2.md)
- 候選證據包：[AOKD_NEW_CANDIDATE_EVIDENCE_PACKS_20261004_V0_2.md](AOKD_NEW_CANDIDATE_EVIDENCE_PACKS_20261004_V0_2.md)
- 00續接／空的專科shortlist：[AOKD_00_CONTINUATION_CHECKPOINT_20261004_V0_2.md](AOKD_00_CONTINUATION_CHECKPOINT_20261004_V0_2.md)

## 來源

- **L01** [Lazy Prices](https://www.nber.org/papers/w25084) (2020; abstract/repository) — US filing changes can precede fundamentals/returns; original study is not Taiwan validation.
- **L02** [Do Lazy Prices Hold in Japan?](https://www.jstage.jst.go.jp/article/pjsai/JSAI2026/0/JSAI2026_2H6OS2c02/_article/-char/en) (2026-07; primary conference abstract) — Japanese conference study: overall change not predictive; directional growth vocabulary differs. Lower evidentiary weight than finance-journal replication.
- **L03** [Attentive Options Traders](https://doi.org/10.1017/S0022109026102804) (2026-04; primary abstract) — Optionable stocks and option smirk condition filing-return relation; restrict transferability.
- **L04** [Effect of New Information Technologies on Asset Pricing Anomalies](https://www.nber.org/papers/w32767) (2025 revision; search abstract; page access limited) — Information-processing technology can alter anomaly persistence; no constant historical premium assumption.
- **L05** [Replicating Anomalies](https://www.nber.org/papers/w23394) (2017; primary abstract) — Microcap weighting and replication choices undermine many published anomalies.
- **L06** [Product Market Threats, Management Disclosure, and Stock Returns](https://doi.org/10.1111/1911-3846.70059) (2026; primary abstract) — Dynamic competition matters, but overlaps industry/competitive-position owners.
- **L07** [Labor Productivity, Return Predictability, and Operating Profitability](https://doi.org/10.1111/jbfa.70021) (2026; primary university abstract) — Labor productivity reported predictive after accounting/factor controls; overlaps AOKD03 and profitability.
- **L08** [Show me the receipts: B2B payment timeliness and expected returns](https://pure.psu.edu/en/publications/show-me-the-receipts-b2b-payment-timeliness-and-expected-returns/) (2025; primary university abstract; full tables not verified) — Abrupt severe late payment and persistent moderate lateness have different return implications; supplier payment records are private.
- **L09** [Do Trade Creditors Possess Private Information?](https://www.nber.org/papers/w25553) (2019; 2026 revision; primary abstract) — Trade creditors may have information unavailable in standard statements; not proof of Taiwan coverage.
- **L10** [Industry Distress and Asset Pricing](https://www.nber.org/papers/w35513) (2026-07; primary abstract) — Industry distress risk is a competing priced-risk explanation.
- **L11** [Supply Chain Centrality and Stock Returns](https://doi.org/10.1111/eufm.70052) (2026; primary abstract) — Peripheral firms higher returns can reflect systematic risk, not free alpha.
- **L12** [Institutional Investor Attention](https://doi.org/10.1111/jofi.70009) (2026; primary abstract) — Information allocation observable differs from generic attention, but same owner mechanism.
- **L13** [AI search attention and Korean technology stocks](https://doi.org/10.1111/ajfs.70060) (2026-09; primary abstract) — Search attention shocks affect turbulence without reliable short-horizon directional return prediction.
- **L14** [News disagreement](https://doi.org/10.1007/s11142-025-09897-1) (2025; primary abstract) — Disagreement effect depends on optimism/information environment.
- **L15** [Machine Learning Forecast Disagreement](https://www.nber.org/papers/w31583) (2025 revision; primary abstract) — Model forecast dispersion is not automatically investor belief dispersion.
- **L16** [Long-run Stock Returns Following Internal Control Disclosures](https://research.aalto.fi/en/publications/long-run-stock-returns-following-internal-control-disclosures/) (2026; primary university abstract) — Economic disclosure content belongs to control/accounting/event owners.
- **L17** [Patent-based products](https://www.nber.org/papers/w34592) (2025-12; primary abstract) — Patent coverage misses many products; mapped to inherited AOKD01, not reopened.
- **L18** [Profitability: A Retrospective](https://www.nber.org/papers/w33601) (2025; primary abstract) — Profitability findings are factor-owner work, not new families.
- **L19** [Stock Valuations and Interest Rates](https://www.nber.org/papers/w34814) (2026; primary abstract) — Discount-rate/valuation interaction already owned.
- **L20** [Assessing Agentic AI for Equity Investing](https://www.nber.org/papers/w35431) (2026; primary abstract) — Explanatory selection exercises do not establish prospective implementable stock-selection alpha.
- **L21** [Informed Trading and Option Prices](https://www.nber.org/papers/w10925) (2004; primary abstract) — Option information varies across instrument and trading context; generic option gap rejected.
- **L22** [Climate/property exposure](https://doi.org/10.1007/s11146-026-10046-x) (2026; primary abstract) — Physical exposure and beta interpretation differ from residual alpha.
- **L23** [Supply-chain common suppliers](https://doi.org/10.1111/irfi.70087) (2026; primary abstract) — New linkage measurement remains existing network mechanism.
- **O01** [TWSE company information services](https://wwwc.twse.com.tw/zh/about/company/service.html) (current; official documentation) — Official MOPS/financial/yearbook entrypoints; vintage completeness not certified.
- **O02** [MOPS annual-report query](https://mops.twse.com.tw/mops/web/t120sb02_q10) (current; official query entrypoint) — Annual report retrieval exists; original receipt and correction chain UNKNOWN.
- **O03** [Listed-company basic information](https://data.gov.tw/dataset/18419) (current; official catalog) — Issuer identifiers support mapping; current catalog not historical identity universe.
- **O04** [OTC-company basic information](https://data.gov.tw/dataset/25036) (current; official catalog) — TPEx identity complement; as-of mapping must be frozen.
- **O05** [TAIFEX option daily market](https://www.taifex.com.tw/cht/3/optDailyMarketView) (current; official documentation) — Trading-date/night-session and schema-change semantics matter.
- **O06** [TAIFEX historical data purchase](https://www.taifex.com.tw/cht/3/hisAppForm) (current; official documentation) — Historical products offered; paid coverage is not every issuer-option history.
- **O07** [TDCC shareholding distribution](https://www.tdcc.com.tw/portal/zh/smWeb/qryStock) (current; official documentation) — Weekly distribution, bounded online retention; bins not investor identity.
- **O08** [TIPO open data](https://cloud.tipo.gov.tw/S220/opdata/) (current; official documentation) — Patent release dates and assignee mapping needed; no new AOKD01 review.
- **O09** [D&B Taiwan finance analytics](https://www.dnb.com.tw/Finance-Analytics/) (current; provider documentation) — Commercial payment/report offerings; historical listed-issuer panel not documented.
- **O10** [D&B Taiwan report FAQ](https://www.dnb.com.tw/Web-Ordering/Web-OrderingFAQ) (current; provider documentation) — Country/product content varies; paid current reports cannot certify PIT panel.
- **O11** [D&B Payment Information Detail API](https://docs.dnb.com/direct/2.0/en-US/tradedetail/latest/orderproduct/dtri-rest-API) (current; provider API documentation) — Detailed payment product global availability specifies US businesses only. NOT Taiwan API proof.
- **O12** [JCIC enterprise credit report](https://www.jcic.org.tw/main_ch/report_2_6_3.aspx?pid=1672&uid=1672) (current; official documentation) — Authorization/self-report constraints; enterprise score eligibility excludes listed/OTC firms.
- **O13** [TaiwanJobs current vacancy list](https://data.gov.tw/dataset/44062) (current; official catalog) — Current posted vacancies API capped per request; no historical employer snapshot guarantee.
- **O14** [Annual-report legal filing rule](https://twse-regulation.twse.com.tw/TW/law/DOC01_print.aspx?FLCODE=FL007032&FLNO=23) (2025 amendment; official regulation) — Disclosure deadline rule is not actual public-upload evidence.
- **O15** [CWA CODiS](https://codis.cwa.gov.tw/) (current; official entrypoint) — Station history availability; historical issuer facility exposure not certified.
- **O16** [Registered factory directory](https://data.gov.tw/dataset/6569) (current; official catalog) — Currently producing registered factories; historical closure/parent mappings not certified.
