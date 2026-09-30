# Technical OHLC Row-Version Receipt V0.1

Updated: 2026-09-29 Asia/Taipei
Status: RESEARCH_ONLY / DESIGN_FROZEN / ISOLATED_QA_PASS
Formal Core: LOCKED

## Result

TI-409, TI-410 and TI-411 are now represented by one executable research contract rather than three disconnected warnings. The new receipt binds exact raw OHLC strings to a canonical digest, binds every transformed OHLC row to its raw ancestor and corporate-action price space, records the bar interval/completion and version clocks, and commits the resulting row version to one immutable parent decision generation.

This solves an **internal contract problem**, not the upstream trust problem. `technical_ohlc_row_version_receipt_v0_1.mjs` can prove that the object it receives is internally consistent and causally eligible for a specified decision cutoff. It cannot make an adapter's own strings independent. `PROVIDER_SIGNED` or `SOURCE_OWNER_VERIFIED` therefore remains an external authority boundary; `LOCAL_CAPTURE_ONLY` returns `UNKNOWN`, not `VALID`.

## TI-412 — consolidated receipt and two-stage content binding

The raw digest includes provider/market/symbol/date identity, bar interval and completion state, provider row version, publication/first-known/capture clocks, raw payload receipt/hash, exact raw OHLC string bytes and per-field observed status. This directly closes the internal form of TI-409: changing `110.0` to `112.0` while retaining the old digest is blocked.

The transformed digest is separate. It binds the recomputed raw digest to the technical price-space version, transformation version, corporate-action receipt, technical price factor, optional superseded raw version and transformed numeric OHLC. This prevents a valid raw receipt from being silently attached to a different adjustment or transformed bar.

Finally, the immutable parent stores the transformed row-version digest. A correct row from another `captureGeneration`, or a row whose parent commitment differs, is blocked even if all price bytes are valid.

## TI-413 through TI-417 — positive and negative witnesses

The executable test covers twelve assertions:

- a completed same-day row first-known and captured after the session, independently attested and committed to the correct parent, is eligible for a 16:00 decision;
- exact raw bytes changed under an old digest are blocked;
- transformed OHLC changed under an old transform digest is blocked;
- a legitimate next-day correction is blocked for the prior-day decision but eligible for a later decision when it is separately committed;
- a full daily bar whose interval ends after a 09:00 decision is blocked;
- a `PARTIAL` bar cannot silently satisfy a `COMPLETE` daily request;
- local/self-issued capture evidence remains `UNKNOWN` without independent attestation;
- missing per-version first-known time remains `UNKNOWN`;
- foreign parent generation, broken transform ancestry and changed parent commitment are blocked.

This gives both directions of evidence. The contract rejects three known contamination paths, but it also admits a legitimate after-market final row and a later correction for a later decision. It therefore does not solve look-ahead by permanently deleting corrections or banning all same-date bars.

## Bounded official-source check

At 2026-09-29 20:20 Taipei, a source-only GET of the official TWSE OpenAPI `STOCK_DAY_ALL` returned HTTP 200, 1,380 rows and one row date, ROC date `1150924` (2026-09-24). The response contained `Date`, `Code`, `Name`, volume/value, OHLC, change and transaction count. The whole payload SHA-256 was `5895bbf2882e0b3d095befea940700d812418ad3a763d2304f8cb964b79f0fdf`; HTTP metadata included `Last-Modified: Mon, 28 Sep 2026 21:20:44 GMT` and `ETag: "6abada2c-4dd74"`.

This one bounded capture is useful counterevidence against treating HTTP retrieval time, `Last-Modified`, or current calendar date as the row's market date. The endpoint's visible fields did not provide a row-level version/correction identifier or first-known/captured clock. The whole-file ETag can support capture replay but cannot independently certify row-version history. No conclusion is drawn about all TWSE endpoints, TPEx, Fugle or production coverage from one capture.

The official trading-system description also confirms why a fixed 13:30 rule is insufficient: ordinary closing is scheduled for 13:25–13:30, but an individual security can be delayed to 13:33 under the closing-stabilization procedure. The receipt therefore uses a certified symbol-session interval plus source clocks rather than a universal wall-clock shortcut.

## Bias, inference and promotion controls

- PIT (point-in-time, 時點一致性): every row version is evaluated against the exact decision cutoff; later versions never rewrite earlier truth.
- Look-ahead (偷看未來): complete daily bars after an intraday cutoff and later corrections are blocked.
- Selection bias (選擇偏誤): future coverage must count every parent child status, including `BLOCKED` and `UNKNOWN`; only successful indicator rows cannot define the sample.
- Date clustering (日期群聚): one source capture or many symbols on one date is not many independent source-version observations.
- Multiple testing / overfitting (多重測試／過擬合): no threshold, parameter, outcome or return was inspected in this stage.
- Factor redundancy (因子冗餘): untouched; the receipt only makes future KD/RSI/MACD/direct-price comparisons causally testable.
- Trading costs / fills (交易成本／成交性): not applicable to input-integrity QA and remain `UNKNOWN` for efficacy.
- Corporate actions, price limits, suspensions: represented as required upstream lineage/session dependencies; not rederived inside D03.

No OOS (out-of-sample, 樣本外), Walk-forward（滾動前推）, after-cost, return or fill evidence exists. D03 maturity must not rise, TI-005 KD-vs-RSI and TI-006 MACD-vs-direct-trend remain blocked, and no `FORMAL_OPTIMIZATION_CANDIDATE` is created.

## Exact next continuation point

Map real TWSE/TPEx/Fugle rows into this contract through the shared source/continuity owner, without D03 self-attestation. Run outcome-blind multi-date capture across market/source contracts; count complete, partial, corrected and `UNKNOWN` rows, verify symbol-session and corporate-action ancestry, measure legitimate-correction false blocks, reconcile the exact immutable parent/child keysets, and record non-secret runtime cost/latency. Only after prospective PIT-complete capture and governance review may TI-005/TI-006 begin outcome tests or a Class-B runtime proposal be considered.
