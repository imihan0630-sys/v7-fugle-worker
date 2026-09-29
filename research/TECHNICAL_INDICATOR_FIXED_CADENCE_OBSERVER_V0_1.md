# Technical Indicator Fixed-Cadence Source Observer V0.1

Updated: 2026-09-30 Asia/Taipei  
Status: RESEARCH_ONLY / AFTER_HOURS_REPEAT_PASS / THREE_SESSION_GATE_ACCUMULATING  
Formal Core: LOCKED

## Result

TI-428 through TI-435 convert the TI-427 continuation point from a one-off source pilot into an append-only, outcome-blind observation protocol. The protocol preserves exact payload hashes and source clocks, detects reorder/tamper through a digest chain, groups repeated observations by endpoint and trade date, and refuses to infer a revision rate from a finite run of unchanged payloads.

The first repeat interval is complete, but the required prospective coverage is not. Two after-hours batches on 2026-09-30 are about 55 minutes apart and produce four comparable endpoint/date pairs. All four pairs are byte-identical. Only one prospective completed-session observation date has elapsed, so the three-session gate remains `ACCUMULATING_NOT_MET`.

## TI-428 — fixed-cadence protocol and authority boundary

The observer freezes these rules before any additional data are collected:

1. Capture the official current and historical contracts without reading returns or later outcomes.
2. Bind each observation to endpoint, requested/observed trade date, HTTP response clock, payload length, SHA-256, row count and available HTTP object metadata.
3. Append entries into a digest chain. Reorder, deletion or mutation invalidates the chain.
4. Treat unchanged bytes only as bounded replay evidence. They do not prove zero revisions.
5. Treat changed bytes only as a trigger for all-row add/remove/change analysis. They are not automatically a legitimate correction because provider version/correction identity is still absent.
6. D03 may not self-issue `SOURCE_OWNER_VERIFIED`, symbol-session certification, corporate-action ancestry or immutable parent identity.

## TI-429 — prior pilot becomes the immutable seed

The final current-endpoint polls and 2026-09-29 historical captures from `technical_indicator_official_source_capability_pilot_20260930.json` were imported as sequences 1–4. They were not backdated or regenerated. Their original HTTP clocks, hashes, row counts and UNKNOWN latency semantics were preserved.

This avoids a subtle survivorship problem: beginning the ledger only with the latest successful recapture would discard the earlier version against which changes need to be detected.

## TI-430 — second after-hours batch

At 2026-09-30 02:12–02:13 Taipei, four public official objects were recaptured:

- TWSE `STOCK_DAY_ALL`: 318,836 bytes, 1,380 rows, only trade date 2026-09-24.
- TPEx `tpex_mainboard_daily_close_quotes`: 4,584,216 bytes, 11,730 rows, trade date 2026-09-29.
- TWSE `MI_INDEX` historical report for 2026-09-29: 247,621 bytes, 1,382 daily-close rows.
- TPEx `dailyQuotes` historical report for 2026-09-29: 1,760,630 bytes, 11,730 rows.

All four SHA-256 values exactly match the corresponding 01:17–01:18 captures. The minimum like-for-like repeat interval is 3,281 seconds. The second batch made four provider calls and transferred 6,911,303 bytes; raw multi-megabyte payloads were transient and only compact hashes/metadata were retained.

## TI-431 — positive evidence

The repeated current and historical objects are stable across an actual after-hours interval, not merely two requests seconds apart. This strengthens bounded replay feasibility for adapters and verifies that the earlier parity result was not caused by a one-request transient response.

The append-only digest chain validates all eight entries. A deterministic test also proves that payload mutation and entry reordering break validation.

## TI-432 — counterevidence and limits

Four unchanged comparisons are not an estimate of zero revision incidence. They cover one capture calendar date and only one prospective completed trading session. A correction could have happened before the seed, after this batch, or through a contract not observed here.

The observed trade dates 2026-09-24 and 2026-09-29 are source-content dates, not two prospective capture sessions. Counting them as two elapsed sessions would falsely inflate the denominator. The coverage count therefore remains 1 of 3.

TWSE current data also remained stale at 2026-09-24 while the historical report still served 2026-09-29. Repetition of the same stale object demonstrates replay stability but does not improve freshness.

## TI-433 — failure handling

The portable Node `fetch` transport encountered one HTTP 502 followed by a proxy tunnel 403, while `curl` successfully fetched the same public endpoints. This is classified as a transport-path problem, not source data failure. The observer now supports bounded retry and a pure `captureFromResponse` path so a successfully authorized transport can supply exact response bytes and headers without changing classification logic.

Because the fallback commands did not instrument per-request elapsed time, latency is explicitly `UNKNOWN_NOT_INSTRUMENTED_FOR_CURL_FALLBACK`. It was not reconstructed from batch wall time. Future batches should record per-request elapsed time at the successful transport boundary.

## TI-434 — bias and promotion controls

- PIT（時點一致性）／look-ahead（偷看未來）: HTTP response clocks are retained; current retrieval is not backdated to prior decisions.
- Selection bias（選擇偏誤）: full payload hashes and all row counts are retained; successful numeric rows do not define coverage.
- Date clustering（日期群聚）: one capture date is counted as one prospective session, regardless of thousands of rows.
- Multiple testing（多重測試）／overfitting（過擬合）: no indicator, parameter, threshold or outcome was inspected.
- Factor redundancy（因子冗餘）: still outside the source-integrity stage.
- Transaction cost（交易成本）／fill（成交）: not inferable here; source-call and byte deltas are recorded separately.
- Missing evidence: Fugle, independent source attestation, symbol-session receipts, corporate-action ancestry, immutable parent-child reconciliation and legitimate correction identity remain `UNKNOWN` or unobserved.

D03 maturity stays 44.6%. `FORMAL_OPTIMIZATION_CANDIDATE = NONE`. TI-005 KD-vs-RSI, TI-006 MACD-vs-direct-trend, outcome joins and Class-B runtime wiring remain blocked.

## TI-435 — artifacts and reproducibility

- Observer: `research/technical_indicator_fixed_cadence_observer_v0_1.mjs`
- Observation ledger: `research/technical_indicator_fixed_cadence_observations_20260930.json`
- Deterministic test: `research/test_technical_indicator_fixed_cadence_observer_v0_1.mjs`

## Exact next continuation point

1. Append outcome-blind captures after each of the next two completed Taiwan trading sessions, retaining repeated versions of the same trade date. Do not estimate correction incidence before three prospective completed sessions exist.
2. If any payload hash changes, run complete symbol/row add-remove-change reconciliation before inspecting outcomes. Keep provider correction identity `UNKNOWN` unless independently supplied.
3. Record per-request latency at the successful transport boundary and maintain non-secret provider-call, transferred-byte and compact-receipt storage deltas.
4. Require shared source/continuity attestation, certified symbol-session and corporate-action ancestry; map Fugle only through the authorized shared path and reconcile each child to the exact immutable parent generation.
5. Keep TI-005/TI-006, outcomes, Class-B wiring and Formal Core changes closed until the prospective PIT-complete receipt gate passes governance.
