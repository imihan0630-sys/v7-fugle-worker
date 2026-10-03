# Taiwan Data Feasibility Matrix V0.2

所有 UNKNOWN 均為未知，不是0／BAD／無事件。來源存在不等於 PIT 歷史已成立。未採購、未與供應商聯絡、未建立台灣面板。

## TWSE/MOPS annual reports（O01,O02）

|Field|Readout|
|---|---|
|authority|official|
|historyStart|UNKNOWN exact earliest complete comparable vintage|
|granularity|issuer/document/period|
|firstKnownClock|original public upload clock UNKNOWN|
|revisionSemantics|corrections/version chain completeness UNKNOWN|
|entityMapping|O03/O04 code-taxID + historical successor map|
|replayFeasibility|PARTIAL source existence; NOT certified|
|missingness|delisted/missing PDF/OCR/language changes|
|licensing|access exists; bulk/reuse limits not validated|
|candidate|AOKD-05|

## TWSE/TPEx basic information（O03,O04）

|Field|Readout|
|---|---|
|authority|official|
|historyStart|catalog date != history start; as-of start UNKNOWN|
|granularity|issuer code/name/tax ID|
|firstKnownClock|dataset publication/capture != historical first-known|
|revisionSemantics|current updates; historical revisions UNKNOWN|
|entityMapping|issuer-level; subsidiaries/name changes need audit|
|replayFeasibility|current mapping only|
|missingness|survivorship/current-only gaps|
|licensing|government open-data terms; verify field-level attribution|
|candidate|both|

## TAIFEX daily/historical options（O05,O06）

|Field|Readout|
|---|---|
|authority|official|
|historyStart|purchase trades from 2001-12-24; specific issuer availability varies|
|granularity|contract/day or trade|
|firstKnownClock|trade date/night attribution != release time|
|revisionSemantics|2022/2025 schema updates; vintage corrections UNKNOWN|
|entityMapping|contract-underlying/adjustments required|
|replayFeasibility|historical products exist; PIT certification separate|
|missingness|liquidity/individual underlying coverage|
|licensing|some products paid|
|candidate|counterevidence context, already owned|

## TDCC weekly share distribution（O07）

|Field|Readout|
|---|---|
|authority|official|
|historyStart|built 2008-07; current stated online retention one year|
|granularity|issuer/holding bracket/week|
|firstKnownClock|week-end observation != publication clock|
|revisionSemantics|past correction/complete archive UNKNOWN|
|entityMapping|issuer code, bins not investor identity|
|replayFeasibility|retention limits; own immutable captures needed|
|missingness|no investor identity/common-owner links|
|licensing|open catalog; historical licensing verify|
|candidate|ownership already owned|

## TIPO patent publication（O08）

|Field|Readout|
|---|---|
|authority|official|
|historyStart|complete comparable API history UNKNOWN|
|granularity|patent/assignee/publication|
|firstKnownClock|publication != application/grant/market awareness|
|revisionSemantics|register changes + version trail needs receipt|
|entityMapping|assignee-company historical mapping|
|replayFeasibility|possible; not certified here|
|missingness|unpatented innovations/no assignee link|
|licensing|API application/terms per source|
|candidate|inherited AOKD01; not re-audited|

## D&B Taiwan report / detail API（O09,O10,O11）

|Field|Readout|
|---|---|
|authority|commercial provider|
|historyStart|Taiwan historical panel start UNKNOWN|
|granularity|firm/payment score; transaction detail Taiwan UNKNOWN|
|firstKnownClock|vintage authorized-availability UNKNOWN|
|revisionSemantics|current history labels not immutable vintage proof|
|entityMapping|DUNS-taxID-issuer-subsidiary historical map UNKNOWN|
|replayFeasibility|BLOCKED; detail API found US-only|
|missingness|supplier contributor selection/no reporting ≠ no lateness|
|licensing|paid/product/country/redistribution restrictions|
|candidate|AOKD-06|

## JCIC enterprise report/score（O12）

|Field|Readout|
|---|---|
|authority|official credit registry|
|historyStart|broad usable issuer panel history UNKNOWN|
|granularity|authorized entity report; score scope restricted|
|firstKnownClock|report issue/consent access; historical first-known UNKNOWN|
|revisionSemantics|history not public vintage guarantee|
|entityMapping|entity authorization required|
|replayFeasibility|not a public listed-issuer replay solution|
|missingness|listed/OTC enterprise-score eligibility exclusion|
|licensing|authorized/self application; no entitlement claimed|
|candidate|AOKD-06|

## Labor/job vacancies（O13）

|Field|Readout|
|---|---|
|authority|official|
|historyStart|historical job snapshot start UNKNOWN|
|granularity|job/employer|
|firstKnownClock|posting/update/capture clocks need frozen receipts|
|revisionSemantics|overwrites/removal/reposts not certified|
|entityMapping|employer to issuer/subsidiary unresolved|
|replayFeasibility|NOT certified|
|missingness|platform/reporting/coverage bias|
|licensing|dataset terms per route UNKNOWN|
|candidate|AOKD03 monitoring only|

## FSC disclosure deadlines（O14）

|Field|Readout|
|---|---|
|authority|official regulator|
|historyStart|rule-version history not corpus history|
|granularity|issuer/report obligation|
|firstKnownClock|deadline is NOT actual first upload|
|revisionSemantics|rule versions separate from issuer corrections|
|entityMapping|legal issuer code|
|replayFeasibility|supports obligation only|
|missingness|not proof every historical file preserved|
|licensing|public rules|
|candidate|AOKD-05|

## Weather + facility geography（O15,O16）

|Field|Readout|
|---|---|
|authority|official|
|historyStart|station histories available; historical firm facility map UNKNOWN|
|granularity|station/time + facility/entity|
|firstKnownClock|observation/release vs later cleaned data separate|
|revisionSemantics|reanalysis/registration corrections UNKNOWN|
|entityMapping|factory-taxID-listed parent historical relation UNKNOWN|
|replayFeasibility|not certified|
|missingness|foreign facilities/exposure/intensity missing|
|licensing|route-dependent terms UNKNOWN|
|candidate|climate already owned|


來源 URL 在總報告及 JSON sources；O13 為目前刊登中職缺，不是歷史 snapshot。O14 義務期限不得代替 publicKnownAt。O11 US-only 是已查到產品的地域限制，不證明所有 D&B 產品均無台灣資料。
