# Technical Indicator Official Source Capability Pilot V0.1

Updated: 2026-09-30 Asia/Taipei  
Status: RESEARCH_ONLY / BOUNDED_PUBLIC_CAPTURE_PASS / ROW_VERSION_PIT_UNKNOWN  
Formal Core: LOCKED

## Result

TI-418 through TI-427 complete a bounded, outcome-blind public-source pilot for the OHLC row-version receipt introduced in TI-412 through TI-417. TWSE and TPEx public official endpoints can supply broad OHLC payloads that are replayable within a short capture window, and their current/historical contracts showed material same-date value parity. They still do **not** expose the row-level version, first-known clock, correction/supersession identity, independently attested D03 digest, certified symbol-session receipt, corporate-action transform ancestry or immutable parent generation required to make a row `ELIGIBLE` under `TECHNICAL_OHLC_ROW_VERSION_RECEIPT_V0_1`.

The correct result is therefore not `BAD` and not zero coverage. It is:

`PUBLIC_BYTES_CAPTURED / SAME-DATE_VALUE_PARITY_MATERIAL / ROW-VERSION-PIT_ATTESTATION_UNKNOWN`.

## TI-418 — short-window replay stability is real but bounded

At 2026-09-30 01:17 Taipei, the official TWSE `STOCK_DAY_ALL` endpoint was fetched twice about ten seconds apart. Both responses were 318,836 bytes with the same SHA-256, ETag and 1,380-row payload. The TPEx `tpex_mainboard_daily_close_quotes` endpoint was fetched twice about 31 seconds apart. Both responses were 4,584,216 bytes with the same SHA-256, ETag and 11,730-row payload.

This proves that the captured objects were stable over those two short windows. It does not prove immutable archives, historical first-known time or zero revision incidence. A revision occurring before the first poll, after the second poll or through another contract is not observable in this test.

## TI-419 — same-source cross-contract parity is strong corroboration, not independence

For TWSE trade date 2026-09-24, `STOCK_DAY_ALL` and the official `MI_INDEX?type=ALLBUT0999` historical report shared all 1,380 symbols:

- 1,333 rows had byte-identical OHLC strings;
- 31 additional rows were numerically identical after removing display thousands separators;
- 16 rows were jointly missing prices but used different absence markers: empty strings versus `--`;
- zero rows had a conflicting numeric OHLC value.

For TPEx trade date 2026-09-29, the current OpenAPI and official historical `dailyQuotes` report shared all 11,730 symbols and all OHLC strings matched exactly.

The positive interpretation is that the public contracts are internally coherent enough for deterministic source adapters and cross-contract QA. The counterargument is equally important: both contracts in each comparison have the same exchange source owner. Agreement is corroboration, not an independent attestation or a publisher-signed row version.

## TI-420 — retrieval time does not prove latest trade date

The TWSE current OpenAPI object retrieved at 2026-09-30 01:17 Taipei contained only trade date 2026-09-24, even though the official TWSE historical endpoint successfully returned the 2026-09-29 full-market report minutes later with 1,382 rows. The endpoint name or current retrieval clock therefore cannot be used as a freshness guarantee. The row date must be checked explicitly, and historical availability observed now cannot be backfilled as proof that the same version was available at an earlier decision cutoff.

This source-specific counterexample does not establish that TWSE is generally unreliable. It establishes that the source contract and freshness clock must be explicit per endpoint.

## TI-421 — representation differences must not become price differences

TWSE exposed two deterministic representation differences:

1. high-priced securities used values such as `2475.00` in OpenAPI and `2,475.00` in the historical report;
2. no-price rows used empty strings in one contract and `--` in the other.

The adapter must preserve original bytes for receipt hashing while separately normalizing the economic value. Empty and `--` are `NOT_PRESENT`; neither may be coerced to numeric zero or called an observed OHLC field. Conversely, normalization must not erase the original source bytes, because the immutable raw digest needs the exact captured representation.

## TI-422 — source row count is not the research parent denominator

TWSE returned 1,380/1,382 rows across the two dates, while TPEx returned 11,660/11,730 rows because the public report includes a much broader instrument set, including many non-common-stock codes. These totals are source payload denominators, not the future Technical Indicator parent count. The authoritative denominator remains the exact immutable same-scan parent generation defined by the shared decision-state architecture. Filtering a source payload first and then calling the survivors “complete coverage” would create selection bias.

## TI-423 — why public HTTP metadata cannot self-authorize the receipt

The current endpoints exposed whole-object ETag and Last-Modified metadata. D03 also captured the exact payload bytes and computed local SHA-256 digests. None of the inspected row schemas exposed:

- a native provider row-version ID;
- row-level published/first-known clocks;
- correction or supersession identity;
- an attestation over D03's canonical raw-row digest;
- a certified symbol-session receipt;
- corporate-action transformation ancestry;
- immutable parent decision generation identity.

The local digest remains useful for replay and change detection. It is not `SOURCE_OWNER_VERIFIED`, because D03 would otherwise be signing its own claim. Public rows must remain `UNKNOWN` at the independent-attestation gate until the shared source/continuity owner supplies that authority boundary.

## TI-424 — correction incidence and false-block rate remain unknown

The two current-endpoint polls showed zero byte changes within their short windows. That observation must not be reported as zero corrections. A legitimate-correction false-block rate also cannot be calculated because no independently identified v1→v2 correction pair was captured. Estimating either quantity requires fixed-cadence immutable recaptures of the *same trade date* across multiple completed sessions and after-hours intervals, with versions retained instead of overwritten.

## TI-425 — public OHLC parity does not solve session or corporate actions

Same-date OHLC agreement does not prove the correct per-symbol closing interval, suspended/no-trade state, special-session status, price-limit regime or corporate-action price-space transformation. Those dependencies remain owned by the shared symbol-session and continuity layers. D03 must consume their receipts and cannot infer them merely because two OHLC endpoints agree.

## TI-426 — Fugle coverage is unobserved, not failed

No task-scoped Fugle credential was exposed in this automation runtime. D03 did not retrieve a secret, dispatch a privileged workflow or add provider calls. Fugle is therefore `ACCESS_NOT_PRESENT_IN_AUTOMATION_RUNTIME`, not `BAD`, not zero coverage and not a provider failure. A future capture must reuse the authorized shared history/continuity path and measure incremental calls rather than adding per-indicator requests.

## TI-427 — bias, maturity and promotion decision

- PIT（時點一致性）／look-ahead（偷看未來）: current retrieval and historical query availability were not backdated to earlier decisions.
- Selection bias（選擇偏誤）: all returned rows and missing-price representations remained in the source counts; numeric successes alone did not define coverage.
- Date clustering（日期群聚）: two trade dates and multiple symbols are source witnesses, not independent alpha dates.
- Multiple testing（多重測試）／overfitting（過擬合）: no indicator parameter, threshold, return or outcome was searched.
- Factor redundancy（因子冗餘）: not testable at the source-integrity stage.
- Transaction cost（交易成本）／fill（成交）: remain outside this input-integrity pilot and unknown for efficacy.

The new evidence improves the source capability map but does not produce prospective PIT-complete indicator snapshots, OOS（樣本外）, Walk-forward（滾動前推）, cost, fill or incremental-alpha evidence. D03 maturity stays 44.6%; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains locked.

## Artifacts and reproducibility

- Machine-readable compact receipt: `research/technical_indicator_official_source_capability_pilot_20260930.json`
- Deterministic consistency test: `research/test_technical_indicator_official_source_capability_pilot_v0_1.mjs`
- Prior row-version contract: `research/technical_ohlc_row_version_receipt_contract_v0_1.json`

The compact receipt retains URLs, response clocks, payload sizes/hashes, counts and comparison outcomes without checking multi-megabyte public payloads into Git. The payload hashes authenticate only the bytes captured by this run; they do not create provider-signed historical provenance.

## Exact next continuation point

1. Continue fixed-cadence, outcome-blind captures across at least three completed trading sessions plus a defined after-hours interval. Retain repeated versions of the same trade date and classify add/remove/change before estimating revision incidence.
2. Require the shared source/continuity owner to supply independent raw-row attestation, certified symbol-session receipts and corporate-action transform ancestry. Same-source endpoint agreement cannot self-authorize `SOURCE_OWNER_VERIFIED`.
3. Map Fugle only through an authorized shared path, with provider/date/market/symbol coverage, explicit `UNKNOWN`, source-call delta and latency. Do not add D03-specific provider calls.
4. Reconcile every child attempt to the exact immutable parent generation and measure non-secret storage/latency/cost before a consolidated Class-B proposal.
5. Keep TI-005 KD-vs-RSI, TI-006 MACD-vs-direct-trend, outcome joins and Formal changes blocked until prospective PIT-complete receipts pass governance.
