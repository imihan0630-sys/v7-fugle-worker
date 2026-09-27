# Technical Indicator Prospective Observer State Construction V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / DESIGN_FROZEN / RUNTIME_NO_GO
Formal Core: LOCKED

## Purpose

Freeze the source, state-construction, lineage and parent-identity semantics for a future prospective Technical Indicator observer.

This is a design document only.
It does not authorize:
- Worker.js changes;
- D1 schema changes;
- schedules;
- new provider pulls;
- ranking/scoring;
- BUY/SELL/capital/push changes.

## TI-275 — Authoritative state cannot be a moving 65-bar re-seed

The current production daily cache retains 65 bars.

For finite-window indicators this can be sufficient if the full required clean window is present.

For recursive indicators, recomputing each day from the newest 65 bars creates a moving initialization anchor.

Consequences:
- RSI14 seed origin changes every day;
- recursive state is not the same object as continuously updated Wilder state;
- later platform/replay comparisons can disagree even with identical final 65 bars if the prior state history differs.

Therefore:

FIXED_65_BAR_DAILY_RESEED
= allowed for mechanics QA only;
= NOT the authoritative prospective inference state for recursive indicators.

## TI-276 — Preferred architecture: canonical replay lineage + optional state cache

Primary research authority:

CANONICAL_REPLAY_LINEAGE

Definition:
- every recursive indicator belongs to an immutable state lineage;
- lineage is tied to:
  - symbol;
  - formulaVersion;
  - source semantic-space version;
  - continuity-engine version;
  - session-calendar version;
  - initialization anchor;
  - state-construction version.

Optional persisted recursive state may be used for efficiency, but is a CACHE only.

Rule:
CACHE_STATE != SOURCE_OF_TRUTH.

A persisted state is inference-eligible only when it can be reproduced by canonical replay under the same lineage contract.

## TI-277 — State lineage identity

Frozen conceptual identity:

stateLineageId = hash(
  symbol,
  formulaVersion,
  continuitySpaceVersion,
  sourceFamilyVersion,
  sessionCalendarVersion,
  initializationAnchor,
  stateConstructionVersion
)

A change in any component creates a NEW lineage.

Do not silently continue old recursive state after:
- formula changes;
- source-family semantic changes;
- corporate-action continuity-engine changes;
- history correction/backfill that changes the canonical input path;
- session-calendar correction;
- initialization-anchor change.

## TI-278 — Initialization anchor semantics

The anchor is not merely "N bars ago."

Required fields:
- initializationAnchorDate;
- initializationAnchorBarIdentity;
- initializationMethod;
- cleanHistoryStartDate;
- eligibleBarsFromAnchorToAsOf;
- sourceHistoryHash;
- continuityTransformHash.

Permitted methods:

A. FULL_REPLAY_FROM_LINEAGE_ANCHOR
Preferred authority when canonical continuity history is available.

B. TRUSTED_PRIOR_STATE
Allowed only if the prior state's lineage/hash/provenance is exact and replay-certified.

C. LOCAL_WINDOW_BOOTSTRAP
Allowed only as explicitly versioned bootstrap/QA state.
It cannot claim parity with full-history/platform state unless proven.

## TI-279 — Prospective bootstrap policy

A future observer may begin collecting before recursive seed influence is negligible, but such rows must be classified explicitly.

formulaReadiness:
- WARMUP_INCOMPLETE
- FIRST_CALCULABLE
- READY

seedStability:
- UNASSESSED
- SEED_SENSITIVE
- WITHIN_DECLARED_BOUND

Rows in SEED_SENSITIVE state may be retained for recorder QA and missingness diagnostics.

They are blocked from ordinary alpha/incremental-value inference unless the preregistered analysis explicitly studies initialization sensitivity.

No historical backfill may be used to make the prospective clock appear older.

## TI-280 — Current 65-bar implications

Using the already-frozen formulas:

KD9-3-3:
- seed influence is effectively negligible at 65 bars.

MACD12/26/9:
- EMA26 first-close seed-state weight at 65 bars is ~0.726%.

RSI14:
- locally seeded Wilder avgGain/avgLoss state retains ~2.459% seed weight at 65 closes.

These are mathematical state-weight diagnostics only.

They do not authorize changing MARKET_STATE_DAYS.

## TI-281 — Recursive state vectors that must be persisted if cache mode is used

KD:
- K;
- D;
- last eligible bar identity.

RSI14:
- avgGain;
- avgLoss;
- last eligible Close;
- recursive update count after seed.

MACD12/26/9:
- EMA12;
- EMA26;
- Signal EMA;
- last eligible Close.

ADX14 future implementation:
- smoothed TR14;
- smoothed +DM14;
- smoothed -DM14;
- current +DI/-DI;
- ADX state after initialization;
- count of DX values incorporated;
- last eligible H/L/C.

ATR14 if stored:
- Wilder ATR state;
- last eligible Close.

Every cached state must carry:
- stateLineageId;
- formulaVersion;
- stateConstructionVersion;
- sourceHistoryHash or parent source receipt;
- lastAsOfDate;
- replayCertificationState.

## TI-282 — Repair semantics

If canonical history changes for a past bar inside a recursive lineage:

Do NOT:
- patch only the current indicator value;
- continue recursion from the old contaminated state;
- wait an arbitrary number of bars.

Required:
1. mark affected lineage DIRTY;
2. rebuild from a trusted pre-change state or canonical anchor;
3. regenerate state forward causally;
4. compare replay hashes;
5. version any changed prospective evidence rather than silently overwriting first-known evidence.

This follows the already-frozen memory-continuity rule:
repair by replay, not by arbitrary waiting.

## TI-283 — Corporate-action boundary rule

Technical Indicator primary inference consumes:
TECHNICAL_CONTINUITY.

RAW_EXECUTION may be used only for formula-mechanics stress tests and execution/reference-price questions.

A corporate action must not be handled by:
- local indicator-specific adjustment logic;
- provider change/change_rate fields;
- assumed factor=1 when provenance is missing.

The observer must consume the shared Corporate Actions continuity engine.

Current state:
TECHNICAL_CONTINUITY production/runtime availability remains BLOCKED.

Therefore:
PROSPECTIVE_TECHNICAL_OBSERVER_RUNTIME = NO_GO.

## TI-284 — Parent population and exact keyset

The observer must attach to the existing prospective Shadow parent population.
It must not create a second candidate universe.

Latest cross-lane governance requires exact parent lineage.

Required parent linkage when available:
- parentDecisionReceiptId;
or
- scanDate + symbol + parentSnapshotHash + captureGeneration.

Do not independently query a truncated date range and assume it matches the parent archive.

Run receipt must preserve:
- expectedParentCount;
- attemptedParentCount;
- validCount;
- blockedCount;
- missingCount;
- provenanceConflictCount.

A date is COMPLETE only when every expected parent resolves to VALID or explicit BLOCKED.

Missing silently is not allowed.

## TI-285 — Source strategy

Current repo facts:
- production D1 cache stores about 65 bars per symbol;
- current raw daily history requests O/H/L/C/volume/turnover/change;
- deeper historical fetch capability exists in research code;
- deeper fetch capability does not equal an approved scheduled data contract.

Therefore future source priority is:

1. reuse already-authorized canonical daily history where semantics are sufficient;
2. use shared TECHNICAL_CONTINUITY transform;
3. if deeper history is required for bootstrap/replay, treat any additional provider pull/storage path as separate governance work;
4. never widen provider calls merely to improve apparent sample maturity.

## TI-286 — No-extra-call distinction

For current formulas:

Finite-window mechanics such as:
- raw range-position14;
- Bollinger20;
can be computed from the existing 65-bar cache if continuity semantics are valid.

Recursive research:
- KD/MACD mechanics are numerically deep enough for low seed sensitivity at 65 bars;
- RSI14 exact research lineage still requires declared state-construction semantics;
- ADX14 remains unimplemented and has longer initialization/smoothing requirements.

Therefore:

ZERO_EXTRA_CALL_FORMULA_FEASIBILITY
does NOT imply
ZERO_EXTRA_CALL_INFERENCE_READINESS.

## TI-287 — Run-level QA

Future observer run status:

COMPLETE:
- exact parent coverage;
- every parent VALID/BLOCKED;
- no provenance conflicts;
- formula replay/prefix checks pass for sampled QA;
- state lineages valid.

INCOMPLETE:
- missing parents;
- missing required source history;
- unresolved parent keyset.

QA_FAIL:
- same lineage/as-of replay mismatch;
- cache != canonical replay;
- prefix-invariance failure;
- source hash conflict;
- formula/state version mismatch.

Outcome inference requires COMPLETE, never merely "rows exist."

## TI-288 — Current design decision

Preferred authority:
CANONICAL_REPLAY_LINEAGE.

Optional optimization:
PERSISTED_RECURSIVE_STATE_CACHE with mandatory replay certification.

Rejected as primary inference semantics:
ROLLING_65_BAR_RESEED for recursive indicators.

Runtime status:
NO_GO until shared TECHNICAL_CONTINUITY and exact prospective parent lineage are runtime-ready.

FORMAL_OPTIMIZATION_CANDIDATE:
NONE.

Formal Core remains LOCKED.

## Exact next continuation

1. Freeze exact ADX14 and Bollinger20x2 formula contracts for isolated QA.
2. Add formula-readiness / seed-readiness / lineage fields to the next snapshot-contract version proposal.
3. Do not implement runtime persistence before Corporate Actions TECHNICAL_CONTINUITY and parent-key governance are ready.
4. When implementation is eventually proposed, classify D1/persistence/runtime changes under project governance before merge/deploy.
5. No outcome inference before COMPLETE prospective receipts.
