# TPEx Daily Denominator Ingestion Contract

Updated: 2026-09-25 Asia/Taipei  
Scope: Corporate Actions CA-112  
Status: FROZEN_FOR_RESEARCH_ARCHIVE / POST-2015-11-16 LANE  
Formal Core: LOCKED / UNCHANGED

## Purpose

Freeze an official, replay-safe TPEx daily issued-share denominator ingestion lane for the project-relevant historical era without depending on a mutable current snapshot.

## Authoritative artifact lane

Official TPEx E-Data Shop product:
`上櫃股票基本資料`.

Daily security quote artifact:
- file name: `STKT2QUOTESN.TXT`;
- EDIS file code: `S38`;
- description: 個股證券日行情資料(含盤後)(新版);
- data group: Third group / 上櫃股票基本資料;
- format: fixed-width TXT;
- official product start date: 2015-11-16;
- production times: 14:55 and 17:45 Asia/Taipei;
- subscription cadence: daily.

Official EDIS format specification V1.33 defines the denominator fields directly:
- `成交股數`: `9(12)`, unit = shares;
- `發行股數`: `9(13)`, unit = shares;
- `市值`: `9(14)`, unit = NTD.

This resolves the TPEx daily issued-share raw-unit ambiguity for the S38 lane:
`TPEX_S38_ISSUED_SHARE_UNIT = SHARES`.

## Acquisition contract

Preferred archive object:
the original `STKT2QUOTESN.TXT` bytes acquired from the official TPEx E-Data Shop subscription/download path.

TPEx documents that after-hours subscribed files may be downloaded from the E-Data Shop and can also be obtained through two specific URL-application methods. Exact credentials/tokens remain account-bound and must not be embedded in source control.

Every acquired artifact must persist:
- exchange = `TPEX`;
- sourceProduct = `上櫃股票基本資料`;
- sourceFile = `STKT2QUOTESN.TXT`;
- sourceFileCode = `S38`;
- officialFormatVersion, e.g. `V1.33`;
- sourceTradeDate;
- fetchedAt;
- raw byte hash;
- parserVersion;
- acquisitionMethod (`ESHOP_DOWNLOAD` or authorized URL application);
- subscription/account identifier only as a non-secret logical alias;
- parse status and rejected-row count.

Raw source bytes are immutable. Re-parsing creates a new parser receipt, never an overwrite of the source artifact.

## Parser contract

1. Treat the file as fixed-width according to the archived official format version.
2. Preserve raw strings before numeric conversion.
3. Parse `發行股數` directly as integer shares; do not multiply by 1000.
4. Parse `成交股數` directly as integer shares.
5. Do not synthesize `EXCHANGE_LISTED_SHARES` from `發行股數`; S38 proves an issued-share denominator only.
6. A row with malformed length, non-numeric issued shares, unknown security identity, or unsupported format version fails closed.
7. Preserve symbol/security-type fields required to exclude ETF, warrant, special or otherwise unsupported securities at the research-universe layer.

## Replay semantics

For each security/session, S38 can supply:
`denominatorType = REGISTERED_OR_EXCHANGE_PUBLISHED_ISSUED_SHARES`
with the narrower operational label:
`TPEX_DAILY_ISSUED_SHARES`.

The archive must preserve:
- `effectiveFromSession = sourceTradeDate` for the daily snapshot state;
- `knownAt = artifact production/acquisition time` unless an earlier official publication timestamp is independently proven;
- source provenance and format version.

Do not reinterpret a daily S38 issued-share count as:
- exchange-listed/tradable supply;
- public-float shares;
- free-float shares;
- EPS weighted-average shares.

## Coverage and completeness

For the frozen S38 lane:
- supported official product era: 2015-11-16 onward;
- project 2025/2026 corporate-action witnesses are inside this era;
- pre-2015-11-16 denominator history is outside this artifact contract and must use a separately validated official source lane.

A date is `TPEX_S38_COMPLETE` only when:
1. the expected TPEx market session exists;
2. the official S38 artifact for that session is archived;
3. raw hash and parser receipt exist;
4. the target symbol is present or an official symbol-state reason explains absence;
5. format-version parser coverage is complete;
6. no unresolved duplicate/conflict exists.

Missing artifact/date must be:
`DENOMINATOR_COVERAGE_UNKNOWN`.

Never infer `NO_CHANGE` from a missing daily file.

## Positive and negative controls

Positive evidence:
- official product page exposes S38 as a daily 14:55/17:45 file starting 2015-11-16;
- official EDIS V1.33 format specifies `發行股數 9(13)` with unit `股`; this is direct unit proof;
- public historical Daily Stock Quotes independently expose `發行股數` as integer share counts.

Negative controls:
- TPEx OpenAPI `tpex_mainboard_daily_close_quotes` is suitable for prospective latest-day capture but is not the historical archive backbone because the official/open endpoint is a latest-snapshot service;
- the public historical HTML/CSV page is a useful reconciliation surface but does not replace immutable archived S38 bytes when a completeness receipt claims the S38 lane;
- issued shares are not silently promoted to listed/tradable shares.

## Security / authorization

Subscription credentials, cookies, tokens and URL-application secrets must stay outside the repository.
If automated acquisition requires MFA, secret entry or a new commercial subscription, stop at the authorization boundary and request owner action only for that minimum step.

## CA-112 result

`TPEX_HISTORICAL_DAILY_DENOMINATOR_INGESTION_CONTRACT = FROZEN_FOR_2015-11-16_PLUS`.

This closes the semantic/unit/parser contract for the official TPEx S38 artifact lane.
It does not claim that the repository already contains every historical S38 file.
It does not change Formal Core or Worker.js.

## Executable parser evidence

Draft PR #101 research branch now includes:
- `research/tpex_s38_denominator_parser_prototype.mjs`;
- `tests/test_tpex_s38_denominator_parser_prototype.mjs`.

The parser freezes the official S38 prefix through industry code at 201 characters and reads:
- trade volume directly as shares;
- issued shares directly as shares;
- market capitalization directly as NTD;
without any x1000 normalization.

Negative controls reject:
- too-short rows;
- non-numeric issued-share fields;
- duplicate symbols within one artifact.

Branch commit `78f627d36de44e50d50f74bb387e19dec9558a7a` has fresh trusted execution:
- Research Corporate Action Prototype `36149848429`: SUCCESS;
- V8 Regression Tests `36149848439`: SUCCESS;
- V8 Repair CI `36149848481`: SUCCESS.

Research job `108120054170` explicitly passed `TPEx S38 denominator parser tests` together with the existing corporate-action continuity, suspension, integration, denominator-vintage and lifecycle tests.

This is parser/semantic evidence only. It does not claim that the repository already contains a complete historical S38 archive.
