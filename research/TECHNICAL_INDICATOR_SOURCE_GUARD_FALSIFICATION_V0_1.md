# D03 Technical Indicator source guard falsification v0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / ISOLATED_CLASS_A / FORMAL_LOCKED
Scope: D03-06/07/08 source validity for KD/RSI/MACD and future D03 formulas. No market outcome inference.

## Research question

Can the existing isolated formula core label a malformed stock-price sequence as VALID and compute apparently usable technical indicators? If so, can a prospective research-only boundary reject these rows without altering the frozen formulas for valid rows?

Evidence examined: `research/technical_indicator_core_v0_1.mjs`, `research/test_technical_indicator_core_v0_1.mjs`, D03 checkpoint and shared governance on current main. The core has no Worker import or production wiring. Taiwan Stock Exchange official corporate-action reference price calculation confirms that raw cross-event price changes have separate event semantics; this is background for continuity checks, not proof that our source transformation is correct: https://wwwc.twse.com.tw/zh/announcement/ex-right/twt49u.html.

## TI-402 — Direct negative probe of frozen v0.1 core

`validateIndicatorBars()` used `Number.isFinite(Number(value))`; JavaScript coerces null, empty string and boolean to finite prices (0/1). It tested high >= low but did not require positive prices, open/close inside high/low, or a dated ascending symbol sequence.

With a 40-row synthetic flat NT$100 series and one malformed bar at index 20, direct v0.1 `buildIndicatorSnapshot(..., strictSemantics:true)` returned `dataQualityState=VALID` and finite KD/RSI/MACD for:
- close=null: KD K ~49.248, RSI ~51.852, MACD DIF ~1.073;
- close='': same false-valid calculation;
- close=true: falsely valid;
- close=-1: falsely valid;
- close=110 while high=101: falsely valid;
- negative open/high/low/close: falsely valid.
An undefined high was blocked, showing the defect is selective rather than all bad input passing.

These are adversarial synthetic witnesses. They prove a research-core validation defect, not a production incident and not a real market observation.

## TI-403 — Positive and counterfactual checks

A new additive wrapper `research/technical_indicator_source_guard_v0_1.mjs` rejects:
- null/blank/boolean/hex/nonpositive price;
- close or open outside same-space high/low;
- mixed symbols, invalid/duplicate/out-of-order dates, future bar;
- unresolved point-in-time source availability;
- wrong continuity price space;
- unverified symbol session/technical continuity/corporate-action continuity;
- suspension or no-trade pseudo-bar.

Only finite positive decimal prices pass; numeric decimal strings are normalized. This is a deliberate input contract, not an optimized trading parameter. The wrapper stores a distinct `TECHNICAL_INDICATOR_SNAPSHOT_V0_2_RESEARCH` / guard version and delegates unchanged formula computation to the frozen v0.1 core.

On valid 50-bar synthetic input, KD/RSI/MACD outputs of the guarded wrapper equal the original strict core exactly. Guard replay is deterministic. Original core regression, new adversarial suite and 19 shared-parent receipt assertions pass under Node. The original v0.1 formulas and production Worker were not modified.

Negative control: numeric decimal strings that represent the same valid OHLC are allowed. This rejects the overbroad alternative of blocking every string-typed provider row, which could silently shrink sample coverage without improving validity.

## TI-404 — Limits of the new guard

The guard checks row chronology but does not independently establish an official TWSE/TPEx session calendar. Synthetic test dates include weekends while asserting `symbolSessionVerified=true`; hence a malicious/incorrect upstream assertion can still pass. It cannot create trusted provenance by itself.

Likewise `pointInTimeEligible=true` and sourceAvailableAt <= asOf are necessary contract checks, not proof that the provider actually published those values by that timestamp. Technical continuity booleans are upstream assertions, not a verified corporate-action transformation. No D1 full-parent completeness, recursive canonical lineage, actual price-limit regime, live provider behavior or economic incremental value is proven by this isolated module.

Therefore:
- FORMULA_INPUT_GUARD_SYNTHETIC = PASS;
- SOURCE_AUTHENTICITY = UPSTREAM_DEPENDENCY / UNKNOWN;
- TECHNICAL_CONTINUITY_RUNTIME = BLOCKED;
- PROSPECTIVE_CAPTURE = NOT_STARTED;
- OUTCOME_JOIN = NO_GO.

The wrapper is not promotion-grade until provenance receipts and parent keyset coverage are independently validated. Do not make the wrapper itself the authority for official sessions or continuity, and do not retrofit historical Shadow.

## TI-405 — Selection relevance and falsification

Positive mechanism: keeping malformed rows out of KD/RSI/MACD prevents artificial oversold/overbought/crossover states, which could otherwise create false factor effects or wrong descriptive regimes. It reduces evidence contamination and is reusable by System 1 and System 2 research.

Counterevidence/side effects: a stricter guard may reduce observability if the legitimate provider emits numeric strings (allowed), minor OHLC rounding differences, or incomplete optional fields (currently open is required). Coverage must be reported by exact rejection reason/date/source/symbol, not summarized as “no signal.” If real valid rows are disproportionately excluded by stock price, exchange, corporate actions or regime, an apparent alpha change would be selection bias. No indicator weights or formal gate may be adjusted from these synthetic tests.

PIT: asOf/availableAt and exact source family/version must be attached to the immutable future parent. Replay: original valid formula outputs must be byte/equivalence stable across repeated runs. OOS, date clustering, transaction cost, fill feasibility and incremental-value evidence are absent; they are not inferable from input QA.

The first eventual empirical tests remain KD vs RSI with direct price controls, then normalized MACD vs direct trend. No `FORMAL_OPTIMIZATION_CANDIDATE`.

## Durable code and verification

- `research/technical_indicator_source_guard_v0_1.mjs`: additive isolated Class-A guard; commit `7e369550e9017e45899676dad3c02c5f0966f8f2`.
- `research/test_technical_indicator_source_guard_v0_1.mjs`: valid equivalence, malicious input, PIT/source and replay fixtures; commit `b2bb984a119bcbc478b1892759afe9d2c6b39772`.
- `node research/test_technical_indicator_source_guard_v0_1.mjs`: PASS.
- `node research/test_technical_indicator_core_v0_1.mjs`: PASS.
- `node research/test_technical_indicator_parent_reconciliation_v0_1.mjs`: PASS.
- Exact GitHub readback of both new files matches locally tested contents.

## Exact next continuation

1. Audit the upstream real source normalization contract for whether open/high/low/close arrive as numbers or decimal strings, whether adjusted OHLC share one space, and the canonical date/session receipt.
2. Run source-grounded non-outcome fixtures on independently verified symbol/event dates when available; preserve a complete rejection denominator and review false positives.
3. Require immutable parent/captureGeneration and canonical continuity lineage before prospective observation or outcome joining. No direct Worker wiring without Class-B review.
4. Keep the current Formula v0.1 immutable and require the versioned guard for new research snapshots; do not silently redefine old rows.
5. Continue D03's other independent hypotheses while prospective data accumulates, without tuning indicator thresholds or adding redundant votes.
