# D06 IC-040 — TPEx two-stage publication vintage protocol

Updated: 2026-09-30 Asia/Taipei
Status: OUTCOME-BLIND / PIT CONTRACT ADVANCED / FORMAL CORE LOCKED

Official TPEx evidence materially resolves the public-table clock question left UNKNOWN in IC-039.

- The official English TPEx Short sale Balance of Margin Trading and SBL page states that, following the TWSE daily work schedule, the information is updated at 20:30 and 22:30.
- The public table exposes margin-short and SBL-short prior balance, daily sell/return/adjustment, current balance and next-business-day SBL-short limit.
- The separate TPEx E-Data Shop S47 Margin_SBL.csv remains a paid daily product with a 22:00 production contract. No purchase is authorized.

## Falsification and PIT consequence

A same-date public value is not a timeless finalized fact. The official two-update schedule creates at least two public vintages. Historical downloads cannot reveal which vintage was known at an earlier decision time.

Therefore:
1. a 20:30 capture must not be silently replaced by a 22:30 value in PIT replay;
2. a 22:00 paid-product clock does not prove the public table first-known time beyond the explicit public 20:30/22:30 update schedule;
3. content differences between the two public vintages are revision evidence, not duplicate observations;
4. missing early capture remains UNKNOWN;
5. the 2025-05-26 change to next-day SBL short-sale limits (30% of prior 30-session average volume) is a rule-vintage boundary and must be stored explicitly.

## Prospective revision audit frozen before outcomes

For each future trading date, capture the public table shortly after the 20:30 and 22:30 scheduled updates and preserve:
sourceDate, requestedAt, capturedAt, firstSuccessfulCaptureAt, contentHash, schemaHash, rowCount, parseStatus, source identity and ruleVintage.

Compare by security code and field:
margin-short prior/sell/buy/stock-return/current/limit; SBL-short prior/sell/return/adjustment/current; next-day SBL-short limit; note.

Report hash changes, changed symbols/cells, field-level revision counts and revision magnitude. Do not inspect forward returns while this receipt/revision lane is being established.

## Readiness gate

At least 10 independent trading dates are required before making a stability claim about the 20:30 versus 22:30 public vintages. At least 20 independent dates plus common-support and source-quality checks are required before any outcome join. Stable hashes can support prospective snapshot stability only; they cannot manufacture historical firstKnownAt.

No scalar crowding score, threshold tuning or Formal change is allowed.

Exact next continuation: IC-041 accumulate prospective two-vintage receipts; separately continue PF-039 and institutional D5+ maturity. If automated public capture is unavailable, preserve UNKNOWN rather than substituting paid data.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.


## IC-041 prospective receipt — 2026-09-30 early public vintage

Outcome-blind capture performed after the official 20:30 update and before the scheduled 22:30 second update.

- sourceDate: 2026-09-30
- captureRuntime: 2026-09-30T21:07:50+08:00
- source: https://www.tpex.org.tw/www/zh-tw/margin/sbl?date=2026%2F09%2F30&id=&response=html
- title: 信用額度總量管制餘額
- parsed security-code count: 814 unique rows
- extracted text length: 64,527 characters
- ETag / Last-Modified: not exposed by capture transport
- full cryptographic content hash: unavailable in this capture transport; do not fabricate one
- parseStatus: PASS for table date and row extraction
- vintageStatus: EARLY_CAPTURED / LATE_CAPTURE_PENDING

Sentinel rows frozen before the late capture (field order follows the public table):
- 3105 穩懋: 1,025,000 | 415,000 | 41,000 | 0 | 1,399,000 | 105,985,096 | 26,805,000 | 278,000 | 4,660,000 | 0 | 22,423,000 | 8,876,916
- 3324 雙鴻: 150,000 | 11,000 | 22,000 | 8,000 | 131,000 | 23,269,209 | 2,578,000 | 50,000 | 10,000 | 0 | 2,618,000 | 1,233,503
- 3363 上詮: 297,000 | 2,000 | 17,000 | 0 | 282,000 | 27,160,141 | 9,763,292 | 100,000 | 29,000 | 0 | 9,834,292 | 1,029,764
- 3374 精材: 770,000 | 0 | 73,000 | 0 | 697,000 | 67,841,079 | 6,141,000 | 14,000 | 270,000 | 0 | 5,885,000 | 4,054,536
- 3260 威剛: 62,000 | 4,000 | 13,000 | 0 | 53,000 | 83,615,854 | 25,415,573 | 889,000 | 197,000 | 0 | 26,107,573 | 2,279,643

Governance: this is the first prospective early-vintage receipt for IC-041, not an outcome observation and not evidence of alpha. The 22:30+ late vintage must be captured independently and compared without forward-return inspection. A single date cannot establish revision stability. FORMAL_OPTIMIZATION_CANDIDATE remains NONE.

Exact next continuation: after 22:30 Asia/Taipei, capture the same 2026-09-30 public table again; compare row count and the frozen sentinel rows, record any revision evidence, and continue accumulating independent dates toward the 10-date stability gate.