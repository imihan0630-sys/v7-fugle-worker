# D01 DL-007A–E: nested graph and continuous breakout path QA

Updated: 2026-09-28 Asia/Taipei. Status: ISOLATED CLASS-A QA PASS / OUTCOME BLIND / FORMAL LOCKED.

This tranche implements the exact DL-006 continuation in isolated research code. It does not read returns, manufacture historical Shadow rows, wire a production observer, alter Formal selection, or create a new Pattern score.

## DL-007A — Causal graph fixture

New files:
- `research/pattern_nested_structure_graph_v0_1.mjs`
- `research/test_pattern_nested_structure_graph_v0_1.mjs`

The graph accepts only objects whose confirmation and underlying source-bar availability are known by `asOfDate`. A later weekly parent therefore cannot be attached retrospectively to a daily child. Weekly/daily/local scale, layer, semantic-space version, completeness, anchors, roots, immutable boundary/version and source-bar receipts remain explicit.

Edges are direct typed observations only:
- `CONTAINS` requires a completed higher-scale interval that actually contains the lower-scale interval;
- `REFINES` requires an explicit object mapping;
- `SHARES_ANCHORS` reports measured Jaccard overlap;
- `SHARES_TRIGGER` requires the same immutable boundary/version, direction and first break date;
- `CONTRADICTS` preserves both chronologically observed objects.

No transitive closure is applied. If a weekly Cup contains a daily W and the W overlaps a daily VCP, the graph does not invent a Cup/VCP shared-anchor relation. A partial week remains `PARTIAL` and cannot act as a completed parent. A non-symbol-session pseudo-bar blocks the object. Incompatible technical-price spaces and same-version boundary mutation become provenance conflicts, not edges.

Counterevidence and limitation: a graph can prevent double counting but cannot prove predictive independence or a return sign. Two objects with low anchor overlap may still be the same economic episode; two objects with high overlap may represent distinct layers. Therefore `scoringVoteCount` remains null and direction remains `UNKNOWN`.

## DL-007B — Prefix replay and boundary falsification

The isolated fixtures pass these adversarial cases:
1. daily W confirmed on Monday, weekly Cup confirmed Friday: Monday replay contains no future weekly parent;
2. full Friday graph creates only direct containment edges;
3. partial weekly candle is visible as partial but cannot be promoted to a completed parent;
4. RAW_EXECUTION versus TECHNICAL_CONTINUITY objects conflict rather than match;
5. identical boundary ID/version with changed coordinates fails closed;
6. verified non-session pseudo-bar blocks the parent object;
7. replay from a longer input with an earlier `asOfDate` equals the original prefix graph.

This verifies causal mechanics only. It does not validate weekly Cup, daily W or VCP alpha.

## DL-007C — Continuous breakout path descriptor prototype

New files:
- `research/pattern_breakout_path_descriptors_v0_1.mjs`
- `research/test_pattern_breakout_path_descriptors_v0_1.mjs`

For each immutable boundary/version/direction episode, the prototype records:
- eligible and observable session counts since the confirmed break;
- close counts beyond the break edge, inside the zone and beyond the failure edge;
- the observable fraction beyond the break boundary;
- longest/current uninterrupted run beyond the boundary;
- break-bar-inclusive versus post-break favorable intraday extension;
- maximum favorable closing extension and maximum adverse intraday distance;
- optional ATR-normalized values only when ATR is point-in-time verified;
- first reentry, failure and reclaim offsets in eligible symbol sessions;
- observed inside/failure bars before the first reclaim;
- cumulative signed close distance and a dated causal path.

`noFollowThroughDescriptor` is deliberately descriptive. It contains no Boolean verdict and no optimized 3-day/5-day cutoff. UP/DOWN are mirrored, and episode identity includes boundary ID, boundary version, direction and first break date.

## DL-007D — Denominator counterexamples

The most important falsification concerns the denominator:
- a limit-constrained bar can have a real printed price while normal acceptance remains unobservable;
- counting it as an ordinary persistence day can manufacture strength;
- dropping it without disclosure can also inflate a fraction, for example one observed hold divided by one observed session after two constrained sessions.

The prototype therefore exposes both `eligibleBarsSinceBreak` and `observableBarsSinceBreak`, excludes constrained/unavailable observations from the persistence denominator, marks the result `PARTIALLY_OBSERVED`, and breaks consecutive-run continuity across excluded observations. If all post-break evidence remains constrained, status is `CONSTRAINED_UNRESOLVED`; unknown symbol-session provenance is `DATA_BLOCKED`.

The break bar is measured twice: inclusive and post-break. This resolves the prior helper's ambiguity without rewriting that existing lifecycle implementation. A reclaim never erases a prior reentry/failure. Prefix replay confirms that a later failure or reclaim cannot rewrite an earlier path snapshot.

Counterevidence and limitation: these descriptors remain algebraic transforms of OHLC and may be redundant with existing momentum, close location, ATR, prior-high and 15-minute execution controls. Longer observed persistence is not assumed bullish, and shorter persistence is not automatically a false breakout.

## DL-007E — Three-Gaps source witness audit

Authoritative source findings:

1. Fugle Historical Candles documents daily/weekly/monthly `open/high/low/close`, an explicit `adjusted=true|false` switch, and a response `adjusted` flag when adjusted history is requested. It also states that corporate-action-day `change` uses an adjusted prior-close basis. Source: https://developer.fugle.tw/docs/data/http-api/historical/candles/
2. TWSE's official ex-right/ex-dividend table publishes the reference-price formula and has data from 2003-05-05. Source: https://www.twse.com.tw/zh/announcement/ex-right/twt49u.html
3. Fugle's dividend event endpoint exposes ex-date, previous close, reference price and opening reference price. It can return future announced rows whose price fields are still null. Source: https://developer.fugle.tw/docs/data/http-api/corporate-actions/dividends/
4. Fugle's capital-change endpoint exposes action type, halt/resume dates, adjustment factor, previous close, reference price and opening reference price, and allows future query dates. Source: https://developer.fugle.tw/docs/data/http-api/corporate-actions/capital-changes/
5. TWSE's official historical suspension query states coverage begins 2011-10-03. Source: https://wwwc.twse.com.tw/zh/trading/historical/twtawu.html
6. TPEx publishes an official historical halt/resumption page, but earliest complete coverage is still unverified. Source: https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html

These findings prove that OPEN and several corporate-action/session witnesses are source-available. They do not prove an end-to-end point-in-time Three-Gaps data contract:
- the current shared history mapper requests OPEN but drops it before persistence;
- the previously audited connected content route returned `adjusted:true` even for an `adjusted=false` request, so caller intent alone cannot certify RAW_EXECUTION;
- provider-adjusted history can be recomputed after later corporate actions and is not automatically an immutable historical vintage;
- capital-action rows cover event-specific halts, not every security-specific suspension cause;
- TWSE strict session coverage before 2011-10-03 remains limited and TPEx earliest complete coverage remains unknown;
- future event rows require a separate first-known/availability clock and cannot be inserted into earlier historical decisions.

Result: a Three-Gaps detector was intentionally **not** implemented. Current readiness is:

`OPEN_SOURCE_AVAILABLE / RAW_MODE_REQUIRES_RESPONSE_VERIFICATION / TECHNICAL_CONTINUITY_RUNTIME_BLOCKED / SYMBOL_SESSION_COVERAGE_PARTIAL / THREE_GAPS_DETECTOR_NO_GO`.

This is a stronger result than merely adding a detector: it prevents raw ex-right resets, suspension pseudo-bars and future-known corporate actions from becoming three false gap votes.

## Validation and maturity

Passing commands:
- `node research/test_pattern_nested_structure_graph_v0_1.mjs`
- `node research/test_pattern_breakout_path_descriptors_v0_1.mjs`
- `node research/test_pattern_breakout_lifecycle_v0_1.mjs`
- `node research/test_pattern_evidence_dedup_v0_1.mjs`

No outcomes were inspected. No experiment R09 was created. No historical Pattern Shadow data was backfilled. D01 remains 51.7%; D01-05 and D01-10 remain L3, D01-09 remains L2. `FORMAL_OPTIMIZATION_CANDIDATE = NONE`. Formal Core remains LOCKED.

## Exact next continuation point after DL-007

1. Freeze graph/path v0.1; do not add more Pattern names or tune thresholds.
2. Add a synthetic Three-Gaps *precondition validator* only if it remains detector-free and can prove RAW response mode, OPEN, TECHNICAL_CONTINUITY version, corporate-action effective/known clocks and explicit symbol-session membership; otherwise keep `DATA_BLOCKED`.
3. Audit whether the existing History Source Revalidation receipts can provide Pattern-safe per-symbol session membership without conflating legal no-trade gaps with ordinary sessions. Do not fork its canonical logic.
4. Keep current shared history OPEN retention and any continuity/session persistence proposal at Class B; do not implement without owner review.
5. Prospective graph/path outcomes still wait for COMPLETE immutable parent/run receipts. When available, compare incremental value against frozen momentum, prior-high, close-location, ATR, price-volume, 15-minute execution and regime controls.
6. Directional effect remains UNKNOWN; no R09 and no Formal change.
