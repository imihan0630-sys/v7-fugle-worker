# D04 RV PIT receipt gate and overlapping-window falsification — 2026-10-02

Status: CLASS_A_RESEARCH_ONLY / CODE_AND_TEST_PR / NOT_PROSPECTIVE_EVIDENCE  
Formal Core impact: NONE  
Owner: 04｜波動與市場微結構研究室

## Previous accepted boundary

The `market_rv_builder_v0_1.mjs` pure function was merged via PR #273. It computes rolling population SD of the last 5 and 20 TAIEX close-to-close SIMPLE returns; `MARKET_RV_RATIO_5_20` is derived context. No runtime persistence was wired. No genuine decision-clock RV date had been certified.

The 2026-09-29 prospective contract requires one A2 official source receipt, 21 official sessions, exact decision-clock provenance, an immutable regime snapshot, readback/replay and run fingerprint. Synthetic code tests never advance the prospective sample counter.

## D04-RV-PERSIST-04 — two previously hidden false-acceptance conditions

1. Existing V0.1 `sourceEligible` checks declared `availableAt <= decisionTimestamp` and `observedAt <= capturedAt`, but does not demand actual `observedAt <= decisionTimestamp` or `capturedAt <= decisionTimestamp`. A post-decision observation with backdated availability can therefore be labeled KNOWN.
2. V0.1 only demands 21 distinct history rows, not the EXACT last 21 independently certified TWSE trading sessions. One missing official session replaced by an older row can silently alter the rolling 20-return window. Its original synthetic "September 1 through 21" fixture contained non-trading dates and is not an official-calendar test.

These are consequential PIT/source semantics defects in a not-yet-wired research function, **not** proof that historical research results were contaminated, because no genuine market-RV persistence row is verified.

## Isolated research audit, not runtime rewrite

New pure `research/market_rv_pit_acceptance_v0_1.mjs` wraps the existing builder and guards:
- independent A2 source receipt identity/date/clock plus a deterministic window hash;
- an independently sourced official FMTQIK session-list receipt;
- exact last-21 session identity including holidays and month boundaries;
- strict available / actually observed / captured <= decision cutoff;
- source and calendar receipt capture-vintage check;
- duplicate/future/missing/invalid history rejection;
- explicit UNKNOWN factor observations if any structural check fails.

Neither a caller-set source flag, a self-supplied 64-character hash, nor a synthetic receipt can **cryptographically establish official authenticity**. The pure function calls its pass `STRUCTURAL_PASS`, not `PROMOTION_GRADE`. Even STRUCTURAL_PASS carries:
- `externalRawSourceAttestation = REQUIRED_NOT_PROVEN_BY_THIS_PURE_FUNCTION`;
- `immutableWriteReadbackReplay = NOT_PERFORMED`;
- `runFingerprintLinkage = NOT_PERFORMED`;
- `promotionGradeProspectiveDateCount = 0`.

Production-grade evidence is possible only after independent raw-source receipt validation plus actual prospective same-run durable write/readback/replay. Do not transplant the synthetically passing test into a real evidence ledger.

### Existing source re-use without paid products

- `official_source_probes.mjs` A2/FMTQIK validates same-day source readiness, but does **not** construct the cross-month 21-close historical window.
- `historical_twse_calendar_v0_1.mjs` already parses FMTQIK per-month exact trading dates with source month checks. Reuse the semantic approach, but do not modify shared runtime or source routing without Class-B approval if one is necessary.
- At the beginning of October, recent 21 trading sessions necessarily cross September/October boundaries. Fetching the current October FMTQIK report alone is insufficient.
- Official source: https://www.twse.com.tw/exchangeReport/FMTQIK?response=html (monthly exchange report). This current endpoint is not evidence of historical first-known receipt time.

## D04-RV-OVERLAP-01 — mechanical ratio bound

With 20 simple daily returns partitioned into prior15 (weight .75) and recent5 (weight .25), all using population variance:

`Var20 = .75 Var15 + .25 Var5 + .1875 (Mean5 - Mean15)^2`.

Therefore for nonzero Var20:

`0 <= SD5/SD20 <= 2`.

The ratio is mathematically bounded by window overlap. There is no valid >2 ratio under the frozen convention, aside from floating numerical tolerance or calculation/version/data defects.

Counterexample:
- prior 15 daily returns all zero;
- recent 5 daily returns all +3%;
- SD5 ~0 because there is almost no variation *within* recent5;
- SD20 >0 because earlier 0%-return group and recent +3%-return group differ;
- ratio ~0 despite a sustained +3% daily rally.

Hence low `RV5/RV20` alone is **NOT** proof of calm prices, directional weakness or a pre-breakout contraction state.

If a challenger needs genuine amplitude, add independent raw return/range descriptors as controls, not extra independent factor votes. Keep close-to-close dispersion, mean return and intraday range semantically separate. No threshold derived from this toy example is authorized.

## Negative controls / precise continuation

- Repeat with a gap in official 21 sessions while preserving 21 unique input rows.
- Repeat with a post-decision actual observation/capture but backdated availability.
- Repeat with mismatched A2 window hash, mismatched calendar hash and calendar receipt first-observed after decision.
- Flat 20 returns must produce RV5=RV20=0 and ratio UNKNOWN, never divide by zero.
- First structural pass proves only computation/receipt self-consistency; independent TWSE authenticity and durable persistence remain separate.

No strategy outcomes were inspected. No threshold, score, sizing, BUY or Formal change is proposed.

Next evidence milestone:
1. CI verify PR branch isolated research test and V8 regression.
2. Only after merge, under the applicable governance path, build a prospective independent-source receipt bridge and physically persist the raw RV trio to an immutable snapshot/run.
3. Independently read back and replay the first eligible date before checking returns; never reconstruct first-known historical dates from today's mutable endpoint.
4. D05 capture/missing-event and quote-age gates remain independent and blocked on prospective ledger evidence.

Maturity: D04 42%, D05 46%; no L3/L4 promotion.
