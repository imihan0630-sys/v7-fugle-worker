# Technical Indicator Row-Diff Baseline V0.1

Updated: 2026-09-30 Asia/Taipei
Status: RESEARCH_ONLY / PROSPECTIVE_DIFF_BASELINE_MATERIAL / THREE_SESSION_GATE_ACCUMULATING
Formal Core: LOCKED

## Result

TI-436 through TI-444 close a replay gap in the fixed-cadence official-source observer without opening outcomes or changing any technical-indicator formula. The prior ledger retained whole-payload hashes but intentionally did not retain multi-megabyte raw responses. That was sufficient to detect a byte change, but not sufficient to satisfy the already-frozen requirement to identify every D03-relevant symbol added, removed or changed after the old raw body disappeared.

The new compact baseline retains the exact normalized `symbol/open/high/low/close` projection for 1,382 TWSE rows and 11,730 TPEx rows on trade date 2026-09-29. It is 83,594 bytes after deterministic gzip compression (669,561 bytes uncompressed), versus 6,912,349 accepted raw bytes in the latest four-response batch. It therefore preserves the information needed for future D03 OHLC add/remove/change reconciliation while still avoiding durable storage of the four raw multi-megabyte payloads.

This is a prospective repair only. It cannot reconstruct row-level differences for a past payload whose body was never retained.

## TI-436 — the prospective session gate remains 1/3

The run occurred before the next Taiwan session completed. Repeated captures on the same calendar date do not become additional independent trading sessions. `PROSPECTIVE_COMPLETED_SESSION_COVERAGE` therefore remains `ACCUMULATING_1_OF_3`; correction incidence must remain `UNKNOWN`.

## TI-437 — a third accepted observation batch extends the real interval

Four accepted official responses were captured at 2026-09-30 07:13–07:14 Taipei:

- TWSE current: 319,882 bytes, 1,382 rows, 8,158 ms;
- TPEx current: 4,584,216 bytes, 11,730 rows, 12,541 ms;
- TWSE 2026-09-29 historical: 247,621 bytes, 1,382 rows, 7,528 ms;
- TPEx 2026-09-29 historical accepted recapture: 1,760,630 bytes, 11,730 rows, 10,376 ms.

The append-only ledger now has 12 chained observations and seven like-for-like comparisons. All seven valid comparisons are byte-unchanged; chain verification passes. Finite unchanged observations still do not prove zero revisions.

## TI-438 — TWSE current-endpoint freshness changed, but its first-known clock is still unknown

At 02:12 Taipei the TWSE current endpoint still exposed 2026-09-24. At 07:13 it exposed 2026-09-29 with 1,382 rows and the same normalized D03 OHLC projection as the 2026-09-29 historical report. The public refresh therefore occurred somewhere inside that interval. Neither the later response nor its `Last-Modified` header proves the exact first instant every row became available, and neither may be backdated into an earlier decision receipt.

This is a useful freshness counterexample in both directions: a stale current endpoint can later recover, so stale-at-one-poll is not permanent source failure; retrieval after recovery still does not prove earlier availability.

## TI-439 — invalid persisted transport is not a provider revision

One TPEx historical download returned HTTP success, but the locally persisted body later failed JSON parsing and ended early. It was excluded, recaptured, parsed, and the accepted recapture matched the earlier valid 2026-09-29 hash exactly. The ledger records five transport calls but only four accepted captures.

The positive rule is fail-closed validation before hashing evidence into the accepted chain. The counterexample is that HTTP success or a transfer byte report alone can produce a false changed hash if the persisted body is incomplete. Such a body is a transport/persistence failure, not evidence of exchange correction, deletion or changed market data.

## TI-440 — whole-payload hashes alone cannot satisfy future row reconciliation

If an old raw payload is discarded and only its whole-object hash remains, a later different hash proves only that *something* changed. A cryptographic digest is not invertible: it cannot identify added, removed or modified symbols. The previous instruction to perform full row reconciliation after a hash change therefore lacked durable state needed to execute it.

The new baseline fixes this prospectively by retaining sorted canonical rows:

`[symbol, normalized open, normalized high, normalized low, normalized close]`.

Decimal normalization is string-exact rather than binary floating-point. Thousands separators and trailing zeros normalize consistently; blank and dash-only price markers become `NOT_PRESENT`, never numeric zero. Duplicate symbols, invalid decimals, mixed trade dates and missing historical tables fail closed.

## TI-441 — raw change and D03-relevant OHLC change stay separate

The observer now has two complementary evidence layers:

1. whole-payload hash for any byte-level source change;
2. compact technical manifest for symbol/OHLC economic change.

A top-level metadata, field-order or harmless formatting change may alter raw bytes while leaving the D03 projection unchanged. It must be classified `NO_D03_OHLC_ROW_CHANGE`, not silently called a price revision. Conversely, any symbol or normalized OHLC change is listed explicitly as added, removed or changed before outcomes are opened.

The compact manifest does not preserve non-OHLC fields. A future volume, quote-depth or metadata change remains detectable by the whole-payload hash but is outside this D03 projection and must be routed to the owning domain if material.

## TI-442 — all 13,112 projected rows agree across same-owner contracts

For 2026-09-29, current and historical official contracts produced identical normalized D03 projections:

- TWSE: 1,382/1,382 unchanged rows;
- TPEx: 11,730/11,730 unchanged rows;
- added: 0;
- removed: 0;
- changed normalized OHLC: 0.

This is strong internal corroboration and a valid seed for future diffing. It is still same-owner agreement, not independent attestation, provider correction identity, certified symbol session or corporate-action ancestry.

## TI-443 — falsification and reproducibility

The new 23-assertion test covers:

- formatting-equivalent decimal representations;
- dash and blank missing markers;
- invalid decimals;
- same-economic-row/different-contract representation;
- explicit symbol addition, removal and OHLC modification;
- manifest tampering;
- duplicate-symbol fail-closed behavior.
- durable gzip receipt decompression, manifest verification and exact row counts.

The evolving fixed-cadence test now reconciles its durable comparison counts instead of freezing the first batch's count at four. The full D03 regression set is rerun before submission.

## TI-444 — bias, maturity and promotion decision

- PIT（時點一致性）／look-ahead（偷看未來）: no availability time was backdated; the refresh interval remains bounded but not exact.
- Selection bias（選擇偏誤）: all 13,112 returned symbols remain in the manifests, including rows whose OHLC is `NOT_PRESENT`.
- Date clustering（日期群聚）: this remains one prospective completed session, not 13,112 independent dates.
- Multiple testing（多重測試）／overfitting（過擬合）: no indicator threshold, parameter, return or outcome was searched.
- Factor redundancy（因子冗餘）: not testable until the outcome gate opens.
- Transaction cost（交易成本）／fill（成交）: still unknown and not part of source-integrity evidence.

No OOS（樣本外）, Walk-forward（滾動前推）, return, cost, fill or incremental-system evidence was added. D03 maturity remains 44.6%; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains locked.

## Artifacts

- Compact baseline: `research/technical_indicator_row_diff_baseline_20260930.json.gz`
- Manifest implementation: `research/technical_indicator_row_diff_manifest_v0_1.mjs`
- Generator: `research/build_technical_indicator_row_diff_baseline_v0_1.mjs`
- Deterministic test: `research/test_technical_indicator_row_diff_manifest_v0_1.mjs`
- Updated append-only ledger: `research/technical_indicator_fixed_cadence_observations_20260930.json`

## Exact next continuation point

1. Append outcome-blind captures and compact OHLC manifests after each of the next two completed Taiwan trading sessions. Do not estimate correction incidence before three prospective completed sessions exist.
2. On any valid payload or manifest change, calculate symbol additions, removals and OHLC modifications before inspecting outcomes. Invalid/truncated transport remains transport failure; provider correction identity stays `UNKNOWN` unless independently supplied.
3. Record accepted latency, call count, raw transferred bytes and compact stored bytes for each batch.
4. Require shared independent attestation, certified symbol sessions, corporate-action ancestry, authorized shared-path Fugle mapping and exact immutable parent-child reconciliation.
5. Keep TI-005/TI-006, outcomes, Class-B runtime wiring and Formal changes blocked until the prospective PIT-complete receipt gate passes governance.
