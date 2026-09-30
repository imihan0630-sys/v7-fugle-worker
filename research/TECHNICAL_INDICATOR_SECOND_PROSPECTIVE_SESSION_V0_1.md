# Technical Indicator Second Prospective Session V0.1

Updated: 2026-09-30 Asia/Taipei
Status: RESEARCH_ONLY / SECOND_SESSION_MATERIAL / THREE_SESSION_GATE_ACCUMULATING_2_OF_3
Formal Core: LOCKED

## Result

TI-445 through TI-452 add the 2026-09-30 completed Taiwan trading session to the outcome-blind D03 source-version observer. The prospective denominator is now two independent completed trading sessions out of the preregistered three. Two after-hours capture batches preserve both the initial 2026-09-30 state and a repeated same-trade-date state. All four valid official objects are byte-identical across the repeat interval.

The session-count gate is still closed. No revision rate, indicator return, OOS（樣本外）result, Walk-forward（滾動前推）result, transaction cost（交易成本）, fill（成交）or incremental selection value is inferred.

## TI-445 — second independent completed session

The first accepted 2026-09-30 after-hours batch was observed at 20:11 Taipei:

- TWSE historical `MI_INDEX`: 246,881 bytes, 1,382 rows, requested trade date 2026-09-30;
- TPEx historical `dailyQuotes`: 1,774,916 bytes, 11,772 rows, requested trade date 2026-09-30;
- TWSE current `STOCK_DAY_ALL`: 319,882 bytes, 1,382 rows, but observed trade date remained 2026-09-29;
- TPEx current `tpex_mainboard_daily_close_quotes`: 4,607,484 bytes, 11,772 rows, observed trade date 2026-09-30.

Unlike multiple polls during the prior after-hours interval, 2026-09-30 is a newly completed trading session. The preregistered prospective count therefore advances from 1/3 to 2/3.

## TI-446 — current-endpoint freshness remains exchange-specific

At the same decision clock, TWSE's historical endpoint already exposed the 2026-09-30 report while its current endpoint still exposed 2026-09-29. TPEx current and historical endpoints both exposed 2026-09-30.

This is a direct counterexample to treating `current` as a semantic guarantee of latest completed-session availability. It also prevents a false cross-contract revision call: TWSE current and historical manifests are not compared because their trade dates differ.

## TI-447 — same-date TPEx parity is complete but same-owner only

TPEx current and historical normalized manifests contain the same 11,772 symbols and identical open/high/low/close projections:

- added symbols: 0;
- removed symbols: 0;
- changed OHLC rows: 0;
- unchanged rows: 11,772.

This supports deterministic same-owner replay for the captured state. It remains corroboration, not independent source attestation, provider correction identity, certified symbol-session evidence or corporate-action ancestry.

## TI-448 — repeated same-trade-date versions are byte-stable

A second accepted batch was observed at 20:19–20:20 Taipei. Relative to the 20:11 batch, all four valid payload hashes are unchanged:

- TWSE historical repeat interval: 498 seconds;
- TWSE current repeat interval: 499 seconds;
- TPEx current repeat interval: 501 seconds;
- TPEx historical repeat interval: 560 seconds.

The append-only ledger now has 20 entries and 12 like-for-like comparisons, all classified `UNCHANGED_BYTES`. Finite unchanged comparisons do not establish zero correction incidence; the correct state remains `UNKNOWN`.

## TI-449 — a second truncated-transport counterexample

The repeat TPEx historical HTTP/2 transfer ended early after 359,134 persisted bytes and failed JSON validation. It was excluded before entering the observation chain. A bounded HTTP/1.1 recapture returned 1,774,916 valid bytes and exactly matched the first batch hash.

This independently reproduces the earlier transport warning: HTTP status 200 plus a partial local body can create a false changed hash unless complete JSON/schema validation precedes source-version classification. The rejected body is transport evidence, not a TPEx revision.

The second batch used five explicitly observed transport commands. Curl's internal retry attempt count was not exposed, so exact provider-request count is recorded as `AT_LEAST_5_CURL_RETRY_INTERNAL_ATTEMPTS_NOT_EXPOSED`, not guessed.

## TI-450 — cost and storage evidence

- First 2026-09-30 batch: four accepted captures, 6,949,163 transferred bytes, accepted latency 8,624–19,914 ms.
- Repeat batch: four accepted captures, 6,949,163 accepted bytes, one rejected 359,134-byte partial body, accepted latency 7,834–23,162 ms.
- Durable session receipt: 172,863 compressed bytes, 1,309,538 uncompressed bytes.
- Durable repeat receipt: 172,863 compressed bytes, 1,309,538 uncompressed bytes.
- Raw multi-megabyte response bodies committed: 0 bytes.

The compact receipts retain normalized symbol/OHLC state needed for future same-trade-date add/remove/change reconciliation. A new trading date is explicitly classified `NEW_TRADE_DATE_NOT_A_REVISION_COMPARISON`.

## TI-451 — reproducibility and falsification

New durable artifacts:

- `research/build_technical_indicator_daily_session_receipt_v0_1.mjs`
- `research/technical_indicator_daily_session_receipt_20260930.json.gz`
- `research/technical_indicator_daily_session_repeat_receipt_20260930.json.gz`
- `research/test_technical_indicator_daily_session_receipt_v0_1.mjs`
- updated `research/technical_indicator_fixed_cadence_observations_20260930.json`

The new 31-assertion test verifies manifest integrity, 2026-09-30 row counts, TWSE stale/current-date mismatch handling, TPEx parity, repeat byte identity, append-only chain integrity, 2/3 coverage, rejected-transport accounting and locked maturity/promotion state.

## TI-452 — bias, maturity and promotion decision

- PIT（時點一致性）／look-ahead（偷看未來）: response clocks are preserved; TWSE's later historical availability is not backdated into an earlier decision.
- Selection bias（選擇偏誤）: full returned row manifests are retained; numeric-success rows do not define coverage.
- Date clustering（日期群聚）: 1,382 + 11,772 rows count as one new trading session, not 13,154 independent dates.
- Multiple testing（多重測試）／overfitting（過擬合）: no indicator parameter, threshold or outcome was searched.
- Factor redundancy（因子冗餘）: TI-005/TI-006 remain blocked; no KD/RSI/MACD efficacy conclusion is opened.
- Transaction cost（交易成本）／fill（成交）: still not inferable from source-integrity evidence.
- Missing dependencies: independent attestation, certified symbol sessions, corporate-action ancestry, authorized shared-path Fugle mapping and exact immutable parent-child reconciliation remain `UNKNOWN` or unobserved.

D03 maturity remains 44.6%. `FORMAL_OPTIMIZATION_CANDIDATE = NONE`. Formal Core remains locked.

## Current lane status after TI-452

PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_2_OF_3

APPEND_ONLY_OBSERVATION_CHAIN = PASS_20_ENTRIES

VALID_LIKE_FOR_LIKE_COMPARISONS = 12_UNCHANGED

SECOND_SESSION_COMPACT_OHLC_STATE = MATERIAL_13154_ROWS

TWSE_CURRENT_FRESHNESS_AT_20_20 = STALE_ON_2026_09_29

TPEX_CURRENT_HISTORICAL_PARITY = PASS_11772_ROWS

INVALID_TRANSPORT_EXCLUSION = PASS

REVISION_INCIDENCE = UNKNOWN

ROW_VERSION_PIT_ATTESTATION = UNKNOWN

SYMBOL_SESSION_CERTIFICATION = UNKNOWN

CORPORATE_ACTION_ANCESTRY = UNKNOWN

FUGLE_MAPPING = UNOBSERVED_ACCESS_NOT_PRESENT_IN_RUNTIME

OUTCOME_JOIN = NO_GO

FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

## Exact next continuation point

1. Do not count or persist additional hourly same-session duplicates merely because the automation runs again. The next denominator-changing capture is after the next completed Taiwan trading session.
2. Append the third prospective completed-session capture and at least one validated same-trade-date repeat. Keep revision incidence `UNKNOWN` until this is complete.
3. On any valid same-trade-date payload or manifest change, calculate complete symbol additions, removals and OHLC modifications before outcomes. Invalid/truncated transport remains transport failure, and provider correction identity stays `UNKNOWN` without independent evidence.
4. Record accepted latency, explicit transport-command count, provider-request-count uncertainty, transferred bytes and compact stored bytes.
5. Require shared independent attestation, certified symbol sessions, corporate-action ancestry, authorized shared-path Fugle and exact immutable parent-child reconciliation.
6. Keep TI-005 KD-vs-RSI, TI-006 MACD-vs-direct-trend, outcomes, Class-B runtime wiring and Formal changes blocked until the prospective PIT-complete receipt gate passes governance.
