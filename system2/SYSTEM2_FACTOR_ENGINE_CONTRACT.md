# System 2 Factor Engine Contract

Updated: 2026-09-26 Asia/Taipei
Status: P2 CONTRACT V0.1 / RESEARCH-ONLY

## Purpose

Define the machine contract used by future System 2 factor engines before any scoring implementation.

The contract makes missingness, point-in-time eligibility and normalization explicit so a missing source can never silently become a neutral/zero score.

## Core semantics

### Observation states

- KNOWN: valid value with usable provenance.
- UNKNOWN: value cannot be established.
- STALE: value exists but is too old for the factor contract.
- INVALID: source/semantic validation failed.
- NOT_APPLICABLE: factor is not meaningful for this symbol/context.

Only KNOWN values may carry a normalized numeric score.

### Point-in-time eligibility

A factor is point-in-time eligible only when:
- its source existed by the decision timestamp;
- availableAt <= decisionTimestamp;
- no later revision/current snapshot is substituted for the historical vintage;
- required market/session alignment is valid.

If any of these cannot be established, pointInTimeEligible is false or UNKNOWN and the historical factor cannot enter a backtest score.

### Normalization

System 2 has no universal normalization formula.

Allowed normalization families include:
- NONE
- CROSS_SECTIONAL_PERCENTILE
- CROSS_SECTIONAL_ZSCORE
- TIME_SERIES_ZSCORE
- BOUNDED_RATIO
- BOOLEAN_STATE
- ORDINAL_STATE
- CUSTOM_VERSIONED

Every normalized factor records normalizationVersion and reference universe/window when applicable.

### Missingness

Prohibited:
- UNKNOWN -> 0
- missing source -> average score
- stale value -> latest known historical value without an explicit carry-forward contract
- current value -> historical vintage

Strategy definitions must specify whether a factor is:
- REQUIRED
- OPTIONAL
- CONTEXT_ONLY
- EXCLUSION_ONLY

A required UNKNOWN factor can make that strategy evaluation INCOMPLETE, but must not imply negative fundamentals/technicals.

## Factor value contract

Every factor value carries:
- factorId
- factorVersion
- symbol/scope
- marketDate
- decisionTimestamp
- rawValue
- normalizedValue
- state
- confidence
- provenance
- normalization metadata
- warnings/quality flags

## Interaction contract

Interactions are first-class factor outputs, not hidden score arithmetic.

Example:
institutional accumulation + TDCC concentration rising + low extension + controlled volume.

An interaction records:
- component factor IDs/versions;
- component states;
- interaction definition/version;
- normalized interaction value;
- whether any component is UNKNOWN;
- falsification/control-group tag.

## Regime contract

Market regime is a frozen snapshot consumed by strategies, not recomputed differently inside each strategy.

V0 should use Tier A/early Tier B only:
- TAIEX state
- prospective breadth
- turnover/liquidity state
- large-vs-small proxy only if sourced
- sector rotation state
- volatility state

Global/macro states remain UNKNOWN until source contracts are ready.

## Decision contract

A strategy evaluation produces one of:
- SELECTED
- QUALIFIED_NOT_SELECTED
- REJECTED
- INCOMPLETE
- WATCH

The evaluation stores exact factor inputs and strategy version. Later outcomes never rewrite this record.

## Versioning

Any change to:
- raw formula;
- normalization;
- lookback window;
- universe;
- factor interaction;
- strategy weight/floor;
- regime gate;
- exclusion semantics

requires a new factor or strategy version.

## Safety boundary

This contract is System 2 only. It does not modify V8 Formal Core, Worker runtime, A/B definitions, 3+3 rules, monitoring or push behavior.
