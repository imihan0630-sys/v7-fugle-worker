# System 2 A1 Daily Close Integrity（A1 每日收盤完整性）V0.2

Updated: 2026-09-28 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Purpose

A1_TWSE_DAILY_CLOSE and A1_TPEX_DAILY_CLOSE are required same-session Decision Clock gates.

The prior parser used the raw count of target-date ordinary-symbol rows. Before the first prospective sample, this is hardened against three false-READY paths:

1. duplicate rows inflating the market-wide count;
2. undated rows being mistaken for target-date data;
3. target-date rows existing without a usable close value.

## Validation V0.2

Validation version:

`S2_A1_DAILY_CLOSE_VALIDATION_V0_2`

For the required A1 TWSE/TPEx daily-close sources:

- only ordinary four-digit stock symbols are considered;
- every counted row must have a parseable official target date equal to `marketDate`;
- symbols are counted uniquely, not by raw row count;
- duplicate target-date ordinary symbols make the payload schema invalid;
- an ordinary-symbol row with a missing/unparseable date is never assigned to the target date;
- a symbol counts toward the required market-wide minimum only when the target-date row has a usable positive close value.

Existing required market-wide minimums are unchanged:

- TWSE: 600 usable unique ordinary symbols;
- TPEx: 450 usable unique ordinary symbols.

These are integrity rules, not optimized thresholds.

## Receipt diagnostics

A1 probe receipts preserve:

- validation version;
- target-date ordinary row count;
- target-date unique ordinary-symbol count;
- usable-close unique-symbol count;
- duplicate target-symbol row count;
- undated ordinary-row count.

This makes a NOT_READY / INVALID_PAYLOAD classification auditable instead of reducing it to one count.

## State semantics

The existing Source Arrival Latency（資料來源到達延遲）state rules remain:

- transport failure => `SOURCE_ERROR`;
- invalid schema/duplicate target symbols => `INVALID_PAYLOAD`;
- valid payload but target date absent => `NOT_READY`;
- target date present but usable-close coverage below the existing minimum => `INVALID_PAYLOAD`;
- target-date schema + coverage after 13:30 close finality => `READY`.

`SOURCE_ERROR` and `INVALID_PAYLOAD` remain distinct from `NOT_READY` and cannot form a false precision lower bound.

## Collector provenance

The Decision Clock Collector Provenance（擷取器來源證明）V0.3 fingerprint already includes:

- `system2/runtime/official_source_probes.mjs`;
- `system2/runtime/source_arrival_latency.mjs`.

Therefore this pre-evidence integrity change necessarily changes the collector fingerprint before 2026-09-29.

After the first promotion-grade prospective sample exists, a material A1 parser change cannot be silently pooled with the existing evidence epoch.

## Safety

- no System 2 D1 write;
- no Worker mutation;
- no Worker Cron authorization;
- capture remains disabled;
- no System 1/V8 runtime or Formal Core change;
- no historical observation substituted for prospective arrival evidence;
- no stock return/outcome data used to choose these rules.
