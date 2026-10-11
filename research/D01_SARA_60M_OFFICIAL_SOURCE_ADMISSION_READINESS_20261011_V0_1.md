# D01 Sara 金包銀 — 60m official source-readiness and physical blocker (2026-10-11)

Status: CLASS_A_RESEARCH_ONLY / DOC_VERIFIED / PHYSICAL_SOURCE_NOT_RETURNED / NO_OUTCOME_ACCESS
Owner: 01｜K線與型態研究室
Prior work: research/D01_SARA_JINBAOYIN_CAUSAL_ORACLE_AND_D16_VALIDATION_FREEZE_20261010_V0_1.md

## Official interface fact checked 2026-10-11

Primary authoritative source: https://developer.fugle.tw/docs/data/http-api/historical/candles/
- Fugle historical candles supports timeframe=60 (60m). Historical minute candles begin 2023-05-23, including TWSE and TPEx.
- Single date request must span LESS than one year, and no-data period responds 404 rather than a verified empty session.
- Minute candles have timezone-qualified ISO-8601 date, OHLC, volume, average; turnover/change are daily/weekly/monthly.
- adjusted=true/false is supported ONLY for daily, weekly, monthly. Never assert that hourly history was split-adjusted by this endpoint.
- Listed common-equity MINUTE volume is LOTS (張); daily/weekly/monthly is SHARES (股), while other instrument classes may differ. Separate scale factor and volume provenance.
- Official historical data is updated by 16:30 on trading days. That does NOT prove each individual 60m bar was available at its completion time during the trading session.
- Document specifies date timestamp but NOT whether it identifies a 60m bar beginning or end, a shortened final bucket, or closing-auction inclusion. A per-bar completionAt cannot be invented from date without independent vendor/session proof.
- Authenticated API uses protected X-API-KEY. No keys exposed or requested.

Also https://developer.fugle.tw/docs/data/http-api/intraday/candles/ supports current-session timeframe=60; its current partial-bar semantics require separate evidence and cannot prove historical as-of revision.

## First real-data access attempt: observable result

A frozen source-only connector probe was made via Fugle-Stock content spec FCNT000154:
- TWSE 1101, since=2026-08-01, until=2026-10-08, timeframe=60, sort=asc, adjusted=false.
- Returned only contentId string FCNT000154?symbol_id=1101&since=2026-08-01&until=2026-10-08&timeframe=60&sort=asc&adjusted=false, with structuredContent=null.
- No actual physical OHLC rows, no physical source revision, no timestamp-bucket identity, no coverage, no response timeframe or source hash were returned.
- Thus CONNECTOR_CONTENT_ID_ONLY_NOT_ROWS / PHYSICAL_SOURCE_UNVERIFIED; do not convert content-id into physical acceptance, EMPTY, or a winning/losing sample.
- Prior FCNT000154 daily-price adjusted=false mismatches had been documented in D01/Corporate Actions research; even a daily adjusted field does not certify raw minute candles.
- A separate authenticated official API request is needed from the data owner under existing authorized credentials. Do not change production Worker or harvest secrets.

## Research-only Class A admission oracle

Files:
- research/d01_sara_60m_source_admission_v0_1.mjs
- research/test_d01_sara_60m_source_admission_v0_1.mjs

Source gates:
1. correct 60m request, date coverage >=2023-05-23, <one year, no adjusted parameter;
2. physical rows instead of connector contentId-only;
3. exact exchange/symbol/timeframe/query receipt and row hash/firstKnownAt/revision;
4. independent certified bar date start-vs-end meaning, bucket end and full/short session schedule;
5. RAW_EXECUTION and canonical corporate-action boundary; no made-up adjusted 60m;
6. minute stock volume units LOTS, avoid 1000x cross-frequency error;
7. a later-revised bar cannot be inserted at prior historical decision cutoff;
8. 245 completed physically observed 60m buckets before claim of MA240 plus five-bucket slope.

21 synthetic adversarial cases, executed directly from branch-file content in isolated V8: 21/21 PASS. NATIVE NODE/CI and production data coverage remain UNVERIFIED. Fixtures include artificial nontrading times by design; they test parsing/admission behavior, NOT Taiwan calendar accuracy or market outcomes.

## Scientific counterexample and revalidation

Earlier Sara strict proxy uses proximity to the CURRENT MA60 to represent last-five-bar support touches. This can be computed at the signal cutoff, but does NOT establish whether each earlier bar touched its OWN contemporaneous MA60. Retain existing rule as CURRENT_SUPPORT_BAND_PROXIMITY. Predefine separate HISTORICAL_DYNAMIC_MA60_TOUCH using each candidate bar's as-of-MA60 without forward data; test signal-disagreement BEFORE viewing outcomes.

Uptrend pullback with simultaneously rising overhead 120/240 60m averages may fail the strict author's downward-overhead research proxy. It remains an independently preregistered comparator; don't loosen or merge families after looking at winners.

## Readiness table (2026-10-11)

| Layer | State |
|---|---|
| Official 60m historical API spec | DOCUMENT_VERIFIED |
| Official history start | 2023-05-23 |
| Actual 1101 physical historical hourly rows | PHYSICAL_NOT_RETURNED |
| Date start-vs-end and last-session bar | BUCKET_MEANING_UNVERIFIED |
| Intraday firstKnownAt + vintage | PIT_RECEIPT_UNVERIFIED |
| Provider-adjusted hourly data | NOT_DOCUMENTED |
| Listed common-stock minute volume | DOCUMENT_LOTS |
| First 245 physically certified completed 60m bars | NOT_VERIFIED |
| Native Node / CI 46 + 21 oracle tests | NOT_VERIFIED |
| Net returns/OOS/prospective hit rate | NOT_OPENED |

## Exact next point, owner routing

1. System2 DATA_LANE or existing authorized market-data owner: retrieve the frozen 1101 60m physical rows from official authenticated endpoint in isolated research context, with first-known/revision/bucket provenance; no production work.
2. D05 / market-microstructure owner: independently validate last 60m bucket, auction and actual complete bar cutoff.
3. Corporate Actions owner: certify RAW_EXECUTION and boundary continuity across date range.
4. Room01: run native Node or GitHub CI actual job for both the 46- and 21-fixture research modules; preserve test log and source SHA, then freeze and test dynamic historical MA60 support touch.
5. Room11 / D16: sign off common-support/cost/entry/horizon definitions before outcome joins. No selected winner claims.
6. Mainline DL-147 and frozen physical 1101 2021-06-15 R1-R6 remain separately pending. D01 11/11 L3/60.0%, SDA-001/SDA-002 open, Formal Core LOCKED.
