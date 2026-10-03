# New Candidate Evidence Packs V0.2

只作 Discovery evidence pack，不是 Specialist Validation Packet。兩者皆尚未達到专科投入門檻，沒有模組ID、COV ID或owner變更。

## AOKD-05｜Economically material longitudinal disclosure-change / filing-delta information｜具經濟實質的跨期揭露變動

|Required field|Evidence / decision|
|---|---|
|id|AOKD-05|
|knowledgeFamily|Economically material longitudinal disclosure-change / filing-delta information｜具經濟實質的跨期揭露變動|
|classification|SCOPE_EXTENSION_CANDIDATE|
|layer|C|
|state|CORPUS_FEASIBILITY_AND_OWNER_TRIAGE_REQUIRED|
|economicMechanism|New or removed business-risk/accounting/operations disclosures may change cash-flow expectations but be incompletely processed. Pure formatting changes have no such mechanism.|
|whyItMayHelpStockSelection|Hypothesis: sort on unanticipated economically adverse additions/removals after public availability, conditional on existing accounting/news/attention features. Future cross-sectional net return ranking is the target, not document classification accuracy.|
|strongestPositiveEvidence|L01|
|strongestCounterevidence|L02; L03; L04; L05|
|existing354OwnerOverlap|D07-08; D07-24; D07-25; D20-07; D20-08; D16-22|
|incrementalValueHypothesis|Residual semantic change could add information beyond levels, sentiment, announced events and quality; NOT demonstrated for Taiwan. D16 tool ownership does not alone settle economic feature ownership.|
|taiwanDataFeasibility|Official annual-report source exists (O01/O02), but frozen historical corpus, initial upload receipts, revision chain and universe coverage UNKNOWN.|
|pitReplay|Each issuer document vintage needs publicKnownAt, captureAt, raw hash, fiscalPeriod, language, version chain and as-of entity map. Fiscal year/deadline is never availableAt; later corrected PDF cannot replace original.|
|antiDoubleCountRule|One economic disclosure event = one owner-produced feature family. No extra votes for cosine distance, NLP sentiment, risk paragraphs and accounting red flags from the same content. D20 consumes surprise/attention moderator only.|
|proposedOwner|D07 economic-disclosure producer; closest anchor D07-08, consult D07-24/25 and D20. Proposal only; no owner reassignment.|
|dependencies|D16-22; D16-01; D16-05; D16-07; D17; D20-07; D20-08|
|failureConditions|Material delta not explicit after template/regulation/OCR/language changes removed; Original vintage/public clock unavailable; Effect explained by accounting quality/value/momentum/news; Effect restricted to untradeable smallcaps or absent after costs; Post-discovery untouched holdout fails or effect unstable across sectors/regimes|
|specialistValidationNeeded|NOT READY. First obtain corpus feasibility receipt and existing-owner scope decision; only then preregister economic-content + incremental ranking test.|
|currentRecommendation|Layer C only. No specialist packet, no Coverage, no module ID.|
|factorControls|Future prereg: size/value/momentum/profitability/investment + sector/liquidity + levels/sentiment/events + missingness/coverage; exact controlled survival in Taiwan UNKNOWN.|
|outOfSample|Japan conference counterexample and optionability conditions limit transport. No Taiwan historical Shadow or prospective OOS exists.|

## AOKD-06｜B2B payment behavior relative to contractual terms｜企業對供應商的付款行為

|Required field|Evidence / decision|
|---|---|
|id|AOKD-06|
|knowledgeFamily|B2B payment behavior relative to contractual terms｜企業對供應商的付款行為|
|classification|DATA_FEASIBILITY_BLOCKED|
|layer|B|
|state|TAIWAN_HISTORICAL_VENDOR_PANEL_UNPROVEN|
|economicMechanism|Payment delays can disclose private cash stress; persistent moderate delay can instead reflect bargaining power/trade-credit policy. Contract-relative transaction behavior is distinct from aggregate payables turnover.|
|whyItMayHelpStockSelection|Potential downside ranking from abrupt severe deterioration, with moderate persistent delay separated. Not a universal late-payment short rule.|
|strongestPositiveEvidence|L08; L09|
|strongestCounterevidence|L08; L10; O10; O11; O12|
|existing354OwnerOverlap|D07-22; D22-07; D22-12|
|incrementalValueHypothesis|A vintage supplier-observed payment series could lead public working-capital/distress data. Increment beyond financial statements, size/value/momentum/quality/investment/credit/liquidity is UNKNOWN; full controlled tables not verified.|
|taiwanDataFeasibility|D&B Taiwan offers current commercial reports (O09/O10). No broad historical Taiwan listed-issuer as-of panel certified; O11 detailed payment API is US-only. JCIC self/authorized reports are not a general public issuer panel; listed-firm enterprise score restrictions apply.|
|pitReplay|Invoice date, agreed due date, payment date, supplier report date, vendor ingest date, first authorized-access date and revision/vintage version must be separate. Current Paydex history period is not firstKnownAt.|
|antiDoubleCountRule|Use only residual payment surprise; do not separately count payables ratio, liquidity/distress and payment score reflecting same shock. Maintain bargaining-power vs distress decomposition.|
|proposedOwner|D07-22 working-capital economic producer; D22-07/12 distress interpretation. Proposal only, no formal ownership change.|
|dependencies|D16-21; D16-05; D17; D10|
|failureConditions|Vendor offers only current reports or reconstructed histories; Taiwan listed issuer coverage sparse or not PIT; Supplier reporting changes produce artificial deterioration; Firm/subsidiary mapping cannot be validated as-of; Risk/factor controls/costs remove information; Commercial entitlement or reproducibility unavailable|
|specialistValidationNeeded|NOT READY. Obtain country/product proof, licensed sample vintage receipts and coverage/mapping audit before specialist allocation.|
|currentRecommendation|Layer B, DATA_FEASIBILITY_BLOCKED. No vendor contact/purchase, no specialist packet, no Coverage.|
|factorControls|Required: working capital/cash flow/profitability/investment/leverage/distress + size/value/momentum + bargaining power/sector/supplier-report intensity. Publication abstract does not verify all these.|
|outOfSample|Independent Taiwan replication absent; private contributor selection, delisted coverage and vendor revision biases unresolved.|


## 共同預先停止規則

資料 gate 未通過前不計算「歷史有效報酬」；不得為了出結果使用今日修訂資料。若後續資料有效，先凍結 universe、as-of features、economic-content definition、one-event-one-family、成本、benchmark ladder、primary horizon、purged chronological holdout、date-cluster estimator、多重檢定與失敗條件。先比 existing factors / owner-produced observables，再測 incremental residual；共支持集、產業、流動性、缺失覆蓋及delisting均要進分母。任何單篇顯著均不能晉升。
