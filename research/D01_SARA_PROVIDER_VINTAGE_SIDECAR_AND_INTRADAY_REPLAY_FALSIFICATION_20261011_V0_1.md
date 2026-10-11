# D01 Sara 金包銀 — raw provider 60m payload vs point-in-time sidecar (2026-10-11)

Owner: 01｜K線與型態研究室
Status: CLASS_A_RESEARCH_ONLY / DOCUMENT_VERIFIED / REAL_60M_BAR_RECEIPT_NOT_VERIFIED / NO_OUTCOMES / FORMAL_LOCKED
Exact parent: KLINE_PATTERN_CHECKPOINT.md, latest 2026-10-11 Sara tranche.

## Primary authoritative source

1. https://developer.fugle.tw/docs/data/http-api/historical/candles/
   Fugle stock historical candles supports 60m since 2023-05-23, with <1-year date ranges. Historical response includes symbol/exchange/timeframe/sort, per-bar date/OHLC/volume/average, but no firstKnownAt, completedAt or source revision hash. Historical candles updated by 16:30 does not certify their contemporaneous intraday first-known time. Minute adjusted option is unsupported. For listed ordinary lot-market equities minute volume = LOTS (rather than daily shares); minute average is average accumulated from open, not a standalone 60m VWAP. The exact last shortened 60m bucket and timestamp start/end are not defined in the available docs.
2. https://developer.fugle.tw/docs/data/http-api/technical/sma/
   SMA endpoint documents timeframe 60 and period parameters, but minute data only covers the LAST 30 DAYS regardless of from/to. It cannot supply a multi-year historical 60m MA240 series, source-vintage replay or archived first-known receipts.
3. Frozen connected Fugle-Stock FCNT000154 source attempt for 1101 / 2026-08-01 through 2026-10-08 / 60m gave a content ID only, without any actual source rows. Physical 60m sample remains blocked. No generated candidate, wins or losses can be counted.

## Data model falsification

Earlier research admission expected enriched per-row completedAt, firstKnownAt, revisionId and sessionBucketReceiptId. Those are NOT native Fugle Historical Candles data fields. Their absence in a raw provider payload cannot be repaired by guessing. Use TWO separate provenance stages:

A. RAW_HTTP_SNAPSHOT / observational source capture: authorized collector records actual response bytes, independent sha256 digest, request/endpoint, physical symbol/exchange/timeframe, timestamp and raw row count. Raw source rows may be historically accurate but this alone proves nothing about their past decision-time availability.

B. ARCHIVED_PIT_SIDECAR / replay admission: independent bounded source-vintage receipt, verified first-observed time and revision, real market-session bucket start/end and last shortened/closing auction details, corporate-action price-space continuity. Bind the same raw source SHA. Do not claim that a bar timestamp indicates its publication/completion, and NEVER use a retrospective chart fetch to backdate firstKnownAt to earlier decision time.

If a snapshot is first captured on 2026-10-11, it cannot retroactively certify that a 2026-08 intraday signal was observable that morning. It can still support descriptive chart study, labeled HISTORY_DESCRIPTIVE_ONLY / PIT_REPLAY_BLOCKED. A truly archived August firstKnown receipt would need independent dated physical evidence.

## New isolated research-only code and tests

Files:
- research/d01_sara_provider_sidecar_admission_v0_1.mjs
- research/test_d01_sara_provider_sidecar_admission_v0_1.mjs

Admission guard checks provider data presence, symbol/exchange, timeframe 60, timezone, monotonic OHLC, capture time/source, nonadjusted minute contract, and sidecar row/clock/revision/bucket matching. A late revision blocks earlier predictor. A source 60m chart does not become an intraday decision-ready history by itself.

First isolated JS V8 evaluation: 21/21 PASS. Inspection found a second potential failure: if the raw row payload changed after first acceptance, an old sidecar could be reused. Added fail-closed count and row-content fingerprint; retest 22/22 PASS in isolated V8. The row fingerprint uses NONCRYPTOGRAPHIC FNV-1a and protects only against accidental process mutation; genuine provider authenticity still requires the independent collector to calculate source SHA256 from original response bytes. A caller-supplied property named payloadSha256 is NOT an authenticated proof.

No new native Node or GitHub CI run was verified in this tranche. Public GitHub raw source retrieval in the local Node execution environment failed DNS, so exact-file native transport for prior 46/21 cases remains an outstanding action. Isolated V8 checks cannot be presented as Node parity. The previous separate native 16/16 support-contact suite is NOT evidence of native execution for these 22 cases.

## Additional scientific threats frozen before seeing outcomes

- Two moving-average support-touch notions differ: past bars against signal-time MA60 versus past bars against their OWN contemporaneous MA60. Keep both as distinct predeclared alternatives, one shared PRICE_OHLC information root.
- Strict Sara-like overhead declining 120/240 averages may exclude ordinary established uptrend pullbacks; preserve strict vs generic trend-pullback comparator families without outcome-tuned relabeling.
- Current 30d technical SMA service and post-close historical candles cannot establish pre-close signals for prior months. Do not equate descriptive 60m chart reconstruction with chronological intraday trader realizability.
- Unknown bar bucket/corporate action/first-known is UNKNOWN_BLOCKED, never NO_PATTERN or zero profitable signals.

## Exact next continuation / owners

1. Room01: exact-file native Node or existing safe CI parity for old 46, prior 21 and new 22 synthetic fixtures. Record SHA-bound stdout, exits and genuine run IDs, no fabricated native evidence.
2. Existing market-data owner: authorized isolated 1101 2026-08-01..10-08 timeframe 60 request; return response hash, physical rows, sanitized provenance. Do not access/modify production Worker or secrets.
3. D05 market microstructure: 60m bucket start/end, shortened final bucket, auction and source first-known clock certification.
4. Corporate Actions owner: raw/adjusted lifetime and ex-right boundaries for continuous price-space.
5. Room11/D16: only after source acceptance, independently register net-of-cost T vs B/M common-support denominators, legal fills, OOS holdout and multiple-testing family. Never turn paper hit-rate into proven Alpha.
6. Mainline DL-147 and frozen 1101/2021-06-15 R1-R6 remain separate and pending. D01 11/11 modules L3, maturity 60.0%, SDA-001/002 open, Formal Core locked.
