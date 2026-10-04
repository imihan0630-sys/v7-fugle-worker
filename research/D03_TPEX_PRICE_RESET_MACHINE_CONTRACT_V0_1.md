# D03 TPEx Price-Reset Machine Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03 / shared TECHNICAL_CONTINUITY / TPEx price-reset evidence
Status: RESEARCH_ONLY / BOUNDED_PHYSICAL_PASS
Formal Core: LOCKED

## Purpose

Physically qualify official TPEx machine sources needed to distinguish economic price movement from mechanical ex-right/ex-dividend and capital-reduction resets.

No stock forward outcome is inspected.

## TI-599 — official action routes are physically discovered

Official pages and frozen actions:

1. 除權除息計算結果表
   - page: `/zh-tw/announce/market/ex/cal.html`
   - action: `bulletin/exDailyQ`
   - fields: `startDate`, `endDate`.

2. 除權除息預告表
   - page: `/zh-tw/announce/market/ex/announce.html`
   - action: `bulletin/prePost`.
   - discovered for context; not used as promotion-grade actual-result source in this tranche.

3. 減資恢復交易參考價
   - page: `/zh-tw/announce/market/reduction/reference.html`
   - action: `bulletin/revivt`
   - fields: `startDate`, `endDate`.

With `API_PATTERN=/www/{LANG}/{ACTION}`, actual-result endpoints are:

- `https://www.tpex.org.tw/www/zh-tw/bulletin/exDailyQ`
- `https://www.tpex.org.tw/www/zh-tw/bulletin/revivt`.

## TI-600 — ex-right/ex-dividend actual-result source physically passes

Read-only workflow:
`Research TPEx Price Reset Machine Contract Readonly`

Accepted physical run:
`37182282950`

Frozen interval:
2026-07-01 through 2026-10-04.

JSON result:
- HTTP 200;
- `stat=ok`;
- rows = 587;
- `totalCount=587`;
- payload SHA-256 = `7fe0627f0da66c146b6cd076b72aed8a841bd37e804461602d33f9c8c2768538`.

The 21 returned fields include:
- ex-right/ex-dividend date;
- symbol/name;
- prior close;
- reference price;
- rights value;
- dividend value;
- limit-up/down;
- trading-base price;
- ex-dividend reference price;
- cash dividend;
- stock/cash-capital-increase allocation fields.

This is exactly the type of reference-price evidence needed to avoid interpreting an exchange-defined mechanical reset as ordinary momentum/volatility.

CSV:
- HTTP 200;
- 587 physical data rows;
- JSON unique keys = 587;
- CSV unique keys = 587;
- JSON-only = 0;
- CSV-only = 0.

`EX_DAILY_Q_JSON_CSV_KEYSET_EQUIVALENCE=PASS`.

## TI-601 — capital-reduction actual-result source physically passes

Frozen interval:
2026-01-01 through 2026-10-04.

JSON:
- HTTP 200;
- `stat=ok`;
- rows = 11;
- `totalCount=11`;
- payload SHA-256 = `0b0f9aaa0d0e4c3e396078f0d4ce04964bb90d3e2059326734148d0b4ddaff4d`.

Returned fields include:
- resumption date;
- symbol/name;
- last-trading-day close;
- post-reduction resumption reference price;
- limit-up/down;
- trading-base price;
- ex-right reference price;
- reduction reason;
- detail payload.

The detail payload physically exposes values such as:
- suspension date;
- resumption date;
- replacement shares per 1,000 old shares;
- cash returned per share;
- cash-capital-increase fields when applicable.

CSV:
- 11 data rows;
- the first 10 non-detail columns are exactly keyset-equivalent to JSON;
- JSON-only = 0;
- CSV-only = 0.

`REDUCTION_REFERENCE_JSON_CSV_KEYSET_EQUIVALENCE=PASS`.

## TI-602 — source-local empty semantics pass on price-reset lanes

On 2026-10-04 only:
- `exDailyQ`: HTTP 200, `stat=ok`, rows 0, total 0;
- `revivt`: HTTP 200, `stat=ok`, rows 0, total 0.

Therefore zero is a source-declared bounded empty only when transport and schema are valid.
Transport failure is never NO_EVENT.

## TI-603 — prospective knowledge-time implication

The existing shared continuity archive explicitly supports:
`knowledgeTimeMode=PROSPECTIVE_OBSERVED`.

Under that mode:
- source `fetchedAt` becomes a conservative observed availability upper bound;
- PIT event replay may use only a source capture obtained no later than the feature decision cutoff;
- no historical first-known timestamp needs to be fabricated.

This materially changes the forward path:
- historical unknown source timing remains blocked;
- a future source capture obtained before a genuine parent decision can be PIT-valid even if older historical publication latency is unknown.

It does NOT permit a capture made after the parent cutoff to backfill that parent.

## TI-604 — source lane is now much narrower than the parent lane

For TPEx, the following official machine surfaces are now physically usable in bounded research:

- halt/resumption symbol-session source;
- ex-right/ex-dividend actual-result price reset;
- capital-reduction resumption/reference price;
- MOPSOV original/correction/cancellation chronology from prior TI-555~563.

The remaining D03-10 L3 blockers are no longer "we do not know the TPEx machine endpoints."

They are:
1. first genuine post-V8.17 immutable parent/capture generation readback;
2. a parent-cutoff-safe source capture / continuity receipt for the exact symbol/window;
3. all expected parents attempted and persisted VALID/BLOCKED/UNKNOWN;
4. price-limit/special-session provenance and exact window replay.

D03-09 ADX adds recursive replay/state lineage after these.

## TI-605 — maturity decision remains anti-inflationary

These source advances are substantial but do not satisfy TI-531's explicit first promotion-grade prospective-parent requirement.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 remains 56.7%.

No percentage is awarded for source discovery alone.

The next honest transition remains:
- Bollinger L3 -> D03 58.3%;
- ADX L3 -> D03 60.0%.

## Current status

`TPEX_HALT_MACHINE = BOUNDED_PHYSICAL_PASS`
`TPEX_EX_DAILY_Q = BOUNDED_PHYSICAL_PASS`
`TPEX_REDUCTION_REFERENCE = BOUNDED_PHYSICAL_PASS`
`TPEX_JSON_CSV_KEYSETS = PHYSICAL_PASS`
`TPEX_SOURCE_LOCAL_EMPTY = PHYSICAL_PASS`
`PROSPECTIVE_OBSERVED_KNOWLEDGE_CLOCK = CONTRACT_AVAILABLE`
`FIRST_GENUINE_V8_17_PARENT_READBACK = PENDING`
`D03_10_BOLLINGER = L2_REMAINS`
`D03_09_ADX = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.
