# Technical Indicator Primary Queue Readiness Matrix V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / DATA_READINESS_AUDIT
Formal Core: LOCKED

## Purpose

The four primary technical-indicator theory decompositions are now complete enough that the next bottleneck is prospective data/state construction rather than additional indicator invention.

Primary queue:
1. KD vs RSI
2. MACD vs direct trend
3. ADX vs direct trend quality
4. Bollinger Width vs ATR / realized-vol / VCP

This matrix separates:
- formula specification;
- isolated mechanics;
- source semantics;
- seed/state construction;
- prospective capture;
- outcome readiness.

## TI-265 — KD vs RSI readiness

Formula:
MATERIAL_PASS.
- KD9-3-3 frozen.
- Wilder RSI14 frozen.

Semantic decomposition:
PASS.
- B2 range location and B3 signed-return path balance are proven non-equivalent.

Outcome-blind fixtures:
MATERIAL_PASS.
- same-close/different-range witness;
- similar-KD/different-RSI witness.

Seed/state construction:
PARTIAL.
- KD is seed-stable within current 65-bar cache by a wide margin.
- locally recomputed RSI14 at 65 bars retains ~2.46% linear seed-state weight.
- FIRST_CALCULABLE and SEED_STABLE are now explicitly distinct.

Runtime/prospective observer:
NOT_IMPLEMENTED.
- isolated core/test exists;
- no production/research runtime persistence of the technical snapshot is found outside research files.

Source semantics:
BLOCKED/PARTIAL.
- TECHNICAL_CONTINUITY and symbol-session semantics remain mandatory.
- current cache length is not enough for a <1% RSI local-seed tolerance if recomputed from scratch.

Outcome readiness:
NO_GO.

Next unblock:
freeze stateConstructionMode, then prospectively capture complete parent rows.

## TI-266 — MACD vs direct trend readiness

Formula:
PASS.
- EMA12/26, Signal9 frozen.

Exact redundancy:
PASS.
- zero-line state = EMA12/26 alignment;
- crossover state = Histogram sign.

Seed/state construction:
MATERIAL_PASS for current 65-bar cache under first-close EMA seed:
- EMA26 seed weight ~0.726% at 65 bars.

Mechanics:
PARTIAL.
- isolated MACD core exists;
- F1-F12 response-profile expectations are specified but not yet executed as a dedicated response suite.

Runtime/prospective observer:
NOT_IMPLEMENTED.

Source semantics:
PARTIAL/BLOCKED by TECHNICAL_CONTINUITY and exact prospective parent provenance.

Outcome readiness:
NO_GO.

Next unblock:
prospective capture of normalized non-alias MACD fields + direct trend controls under one stateConstructionMode.

## TI-267 — ADX vs trend-quality readiness

Formula/theory:
PASS at specification level.

Exact semantic split:
PASS.
- direction = DI dominance;
- strength = ADX;
- ADX directionless by construction.

Executable isolated core:
NOT_IMPLEMENTED for ADX14 in the current technical-indicator core.

Response/adversarial mechanics:
SPEC_ONLY.
- mirrored up/down, choppy, gap, limit-constrained fixtures specified.

Source semantics:
BLOCKED/PARTIAL.
- H/L/previous-Close, TECHNICAL_CONTINUITY and constrained-session handling required.

Runtime/prospective observer:
NOT_IMPLEMENTED.

Outcome readiness:
NO_GO.

Next unblock:
isolated formula QA first, no outcome join.

## TI-268 — Bollinger Width vs ATR/VCP readiness

Formula/theory:
PASS at specification level.

Exact redundancy:
PASS for %B versus standardized MA-distance within an identical formula version.

BBW incremental hypothesis:
VALID_UNRESOLVED.
- close-level dispersion is not identical to ATR or return-volatility.

Executable isolated core:
NOT_IMPLEMENTED for BBW20x2 in current technical core.

Formula-version details:
PARTIAL.
Must freeze:
- SMA vs EMA center;
- population vs sample standard deviation;
- lookback;
- multiplier;
- continuity space.

Pattern comparator:
SPEC_READY.
VCP/Platform geometry already has a dedicated research lane but Pattern runtime remains NO_GO.

Runtime/prospective observer:
NOT_IMPLEMENTED.

Outcome readiness:
NO_GO.

Next unblock:
formula parity + isolated adversarial mechanics, then prospective common-support capture.

## TI-269 — Current daily history/cache feasibility

Production market state retains:
MARKET_STATE_DAYS = 65.

Formal candidate admission requires:
historyDays >= 60.

Implications:
- KD9-3-3 mechanics are comfortably seed-stable.
- MACD12/26 first-close EMA seed is below ~1% by this depth.
- RSI14 local-window recomputation is not below the preregistered <1% seed-state tolerance.
- ADX/BBW have not yet been implemented in the isolated core, so no runtime readiness conclusion follows from 65 bars alone.

Repository capability:
research code already demonstrates that deeper historical daily fetches (e.g. ~150 calendar days in existing research enrichment code) are technically possible.

But:
- zero-extra-call availability for an ordinary technical observer is NOT proven;
- deeper fetch capability must not be confused with an approved scheduled runtime data contract.

## TI-270 — No current prospective evidence clock

There is no technical-indicator equivalent of the mature Price-Volume Shadow evidence lane currently wired.

Therefore:
- no clean prospective KD/RSI dates exist under the newly frozen semantic/seed contract;
- no MACD residual outcome cohort exists;
- no ADX/BBW cohort exists;
- historical rows must not be fabricated/backfilled as if the new contract had existed.

Outcome status remains:
UNKNOWN / NOT_COLLECTED.

## TI-271 — Minimal prospective capture proposal boundary

A future research-only observer should capture only the primary queue and direct controls.

Minimum candidate fields:

Identity/provenance:
- scanDate;
- symbol;
- parentSnapshotHash;
- asOf;
- availableAt;
- formulaVersion;
- stateConstructionMode;
- inputStartDate;
- inputBarCount;
- continuity/session quality.

KD/RSI:
- rangePosition14;
- rsv9;
- k9;
- d9;
- rsi14;
- optional avgGain14/avgLoss14 for audit;
- seedInfluenceBound.

MACD:
- ema12;
- ema26;
- difPct;
- histogramPct;
- difSlope;
- histogramSlope.

ADX:
- plusDI14;
- minusDI14;
- adx14;
- adxSlope.

Bollinger:
- sma20;
- sigma20;
- bandWidthPct;
- percentB only if retained as explanation;
- formula stdDefinition.

Direct controls:
- existing ret5/10/20/60;
- MA slopes/alignment;
- trendPersistence;
- pathEfficiency;
- ATR%;
- volatility20;
- Pattern lifecycle/compression;
- Price-Volume state;
- market/sector regime;
- liquidity.

No score/rank/BUY/SELL/capital field.

## TI-272 — Evidence order after future capture

Gate 0:
source/continuity/session validity.

Gate 1:
parent coverage and uniqueness.

Gate 2:
formula parity / replay / prefix invariance.

Gate 3:
seed-state construction consistency.

Gate 4:
common-support coverage.

Gate 5:
mechanical redundancy diagnostics.

Gate 6:
descriptive outcome separation by independent date.

Gate 7:
incremental-value tests.

Gate 8:
OOS/regime/liquidity/cost/overfit falsification.

Only after Gate 8:
consider FORMAL_OPTIMIZATION_CANDIDATE.

## TI-273 — No engineering conclusion from theory alone

The completed theory work is sufficient to:
- reject aliases;
- freeze primary hypotheses;
- define source/state requirements;
- avoid Factor-Zoo expansion.

It is NOT sufficient to:
- change A/B rules;
- add technical scores;
- change selection ranking;
- loosen/tighten thresholds;
- alter capital;
- alter 15m execution;
- change MARKET_STATE_DAYS.

Current engineering stance:
RESEARCH_CAPTURE_SPECIFIABLE / RUNTIME_NOT_AUTHORIZED_BY_THIS_DOCUMENT.

## TI-274 — Current queue status

KD_vs_RSI:
THEORY_PASS / FIXTURE_PASS / SEED_MODE_UNRESOLVED / PROSPECTIVE_NOT_COLLECTED / OUTCOME_NO_GO

MACD_vs_DIRECT_TREND:
THEORY_PASS / EXACT_ALIAS_MAP_PASS / MECHANICS_PARTIAL / PROSPECTIVE_NOT_COLLECTED / OUTCOME_NO_GO

ADX_vs_TREND_QUALITY:
THEORY_PASS / CORE_NOT_IMPLEMENTED / PROSPECTIVE_NOT_COLLECTED / OUTCOME_NO_GO

BBW_vs_ATR_VCP:
THEORY_PASS / FORMULA_VERSION_PARTIAL / CORE_NOT_IMPLEMENTED / PATTERN_RUNTIME_BLOCKED / OUTCOME_NO_GO

FORMAL_OPTIMIZATION_CANDIDATE:
NONE

Formal Core remains LOCKED.

## Exact next continuation

1. Stop expanding theory unless a contradiction appears.
2. Freeze a single technical-observer source/state construction proposal.
3. First priority is preventing RSI rolling-reseed ambiguity.
4. Second priority is isolated ADX/BBW formula/mechanics QA.
5. Do not join outcomes until prospective complete parents exist under the frozen contract.
6. Formal Core remains unchanged.
