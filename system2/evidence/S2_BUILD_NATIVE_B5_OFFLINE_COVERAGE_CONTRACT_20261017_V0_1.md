# System 2 BUILD｜官方 B5 全市場涵蓋率：唯讀接入契約與拒絕誤認證 V0.1

Date 2026-10-17 Asia/Taipei; owner industry taxonomy V1.0, Class A only. Consumes DATA #1068 source originals when they actually exist; no new native GET, Cron, secrets, D1/R2, production, strategy or Frozen writes.

## Actual code

- `system2/runtime/industry_native_b5_coverage_v0_1.mjs`: **input-only** exact market T source whole four-digit instrument list and separate market profile-source receipts, verify signed hash, market, dates, provider source SHA, identity, duplicates and native issuer sector code+label. Reuses existing `b2_industry_snapshot_observer.mjs::parseIndustryProfiles` as extra parser sanity control; never overrides a duplicate classification silently. Handles TWSE and TPEx independently, exact real source subset counts and status.
- `system2/scripts/run_industry_native_b5_coverage_readonly_v0_1.mjs`: once source material is supplied, read-only local CLI emits create-once JSON+Markdown; may omit a missing exchange source with `-`, then marks it UNKNOWN, not 0 selections.
- `system2/tests/industry_native_b5_coverage_v0_1.test.mjs`: 10 synthetic contract tests (NOT actual Taiwan-equity market coverage) including TWSE/TPEx exact denominators, unknown, missing exchange, conflicting duplicate sectors, code absent, source captured late past T23:45, historical effective date leak, forged SHA, invalid original timing, non-ordinary class inference.

## Classification states and admission

Current `B5_NATIVE_PROVISIONAL_CLASSIFIED` means ONLY that the externally supplied native normalized row is date/source/hash internally consistent, **NOT** that original B5 bytes/provider clocks were independently attested. Official original source and full-market denominator must be supplied by DATA and independently verified by AUDIT; therefore `fullMarketIndependentlyCertifiedB5Coverage=null`, `ordinaryShareUniverseDenominator=null`, `actualClassificationPITAccepted=false`, `selectedCount=null` even in synthetic perfect coverage cases. No backdating after native source observation, firstKnownAt, availableAt, or effective-vintage boundary.

The complete source universe must not be substituted by Scheme C's 30 visible research names. The required exact signed `S2_A1_FOUR_DIGIT_UNIVERSE_HANDOFF_V0_1` containing all T four-digit identity+row hashes is a new producer/consumer handoff **spec**, not evidence that it already exists. Similarly `S2_DATA_NATIVE_B5_PROFILE_SOURCE_HANDOFF_V0_1` is an input-only normalized source schema, not an actual production source ingestion run. Neither input is synthetically generated for a claimed actual T.

## True readiness / next real work

- DATA #1068: official T market/date original exact A1 universe, B5 code+label native per exchange, source SHA and original available/known times, classification changes and native source profile receipts; do not re-fetch already verified original requests just to satisfy a new schema.
- AUDIT #1127: independent original native provider bytes/codes/effective histories, record conflicts, T cut, share class denominator, negative-control and actual coverage acceptance.
- BUILD #1132/#1234: only AFTER true independent source receipts use this module to output an **actual** per-market counted coverage and then safely attach official B5 display to Scheme C. P0 preliminary price/volume candidate report must remain valid without the industry handoff.

Prior Class A [PR #1479](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1479) preserved 6 bounded industry research examples (4 TWSE/2 TPEx) and optional research sidecar. This module handles the separate future real B5 source denominator and must not treat these old six as an actual source universe. Official strategy 7-factor ranking, Formal Core, orders, Frozen/Shadow and production unchanged.
