# System 1 valuation source-vintage capture Class-B proposal V0.1

Date: 2026-10-05 Asia/Taipei
Status: DESIGN_READY / CLASS_B_IMPLEMENTATION_OWNER_APPROVED / PRODUCTION_DEPLOY_NOT_AUTHORIZED / FORMAL_CORE_LOCKED

## Purpose

Close the only remaining promotion-grade provenance gap for the already-implemented System 1 `VALUATION_RELATIVE_RISK` audit without changing the Formal valuation rule.

Current R2 structural audit is merged and daily-collected, but outcome attribution remains blocked because C1 preserves the gate values while dropping the source-vintage metadata needed to prove what valuation/financial version was known at decision time.

This proposal defines the minimum additive capture required to make future valuation outcome evidence PIT-auditable.

It does **not** authorize implementation, merge, deployment, threshold changes, score changes, or any Formal behavior change.

## Current runtime facts

### Valuation source

Current validated `VALUATION` quality snapshot already returns:

- snapshot `asOfDate`;
- per-symbol `priceEarningsRatio`;
- per-symbol `priceBookRatio`;
- per-symbol `valuationObserved`;
- per-symbol `valuationDate`;
- per-symbol `valuationSource`:
  - `TWSE正式日估值`;
  - `TPEx正式日估值`.

The after-market scan reads that immutable-for-request snapshot before selection and merges each symbol's valuation fields into the scan row.

### Financial source

Current validated `FINANCIAL` quality snapshot already returns:

- snapshot `asOfDate`;
- `year`;
- `quarter`;
- per-symbol derived quarterly financial fields including `revenueQuarterYoY`.

### Quarter EPS source

Current `QUARTER_EPS` snapshot can return:

- snapshot `asOfDate`;
- `year`;
- `quarter`;
- per-symbol `epsYoY`;
- `quarterEpsSource`;
- per-symbol quarter/year source metadata where available.

### sectorMedianPe

`sectorMedianPe` is not an independent provider field.

During `selectTomorrowCandidates()`, the current scan:
1. takes same-scan feature rows with positive `priceEarningsRatio`;
2. groups them by `industry`;
3. requires at least 3 positive-PE peers;
4. computes the 50th percentile;
5. stores that derived value on the same feature row.

Therefore provenance for `sectorMedianPe` must reference:
- the valuation snapshot vintage used by its peers;
- the same scan decision context;
- a fixed derivation version;
- peer count.

## What is currently missing

C1 currently projects only the numeric/boolean gate inputs and does not preserve the source metadata above.

It also does not freeze an immutable, first-written receipt for the quality snapshots themselves.

Therefore current C1 cannot prove, for historical outcome attribution:
- which exact valuation snapshot version was first observed by the system;
- whether a same-`asOfDate` quality snapshot was later rewritten;
- the first system-observed timestamp for the financial/valuation snapshot content;
- field-level official first-known publication timestamps for all growth fields.

This distinction must remain explicit:

- `sourceAsOfDate` = date the source data represents;
- `captureObservedAt` = when this system read/froze that snapshot;
- `officialFirstKnownAt` = official publication first-known timestamp, currently not proven for all fields.

Never alias one into another.

## Minimum Class-B capture

### A. Snapshot provenance receipt

At the same after-market request that already reads the quality snapshots, build a research-only provenance object:

`valuationSourceVintage`

with at minimum:

```
{
  schemaVersion,
  decisionAt,
  captureGeneration,

  valuation: {
    asOfDate,
    captureObservedAt,
    contentDigest,
    stockCount,
    sourceState: "OFFICIAL_VALIDATED_SNAPSHOT"
  },

  financial: {
    asOfDate,
    year,
    quarter,
    captureObservedAt,
    contentDigest,
    stockCount,
    sourceState: "OFFICIAL_VALIDATED_SNAPSHOT"
  },

  quarterEps: {
    present,
    asOfDate,
    year,
    quarter,
    captureObservedAt,
    contentDigest,
    stockCount,
    scope
  }
}
```

`contentDigest` must be deterministic over the exact normalized snapshot payload consumed by the same scan.

`captureObservedAt` means first frozen by this C1 request, not official publication time.

### B. Per-symbol valuation provenance

For each C1 feature row, preserve research-only:

```
valuationProvenance: {
  valuationDate,
  valuationSource,
  valuationSnapshotAsOfDate,
  valuationSnapshotDigest,

  financialSnapshotAsOfDate,
  financialYear,
  financialQuarter,
  financialSnapshotDigest,

  quarterEpsSnapshotAsOfDate,
  quarterEpsYear,
  quarterEpsQuarter,
  quarterEpsSnapshotDigest,
  quarterEpsSource,

  sourceKnownByDecisionAt,
  officialFirstKnownAt: null,
  officialFirstKnownState: "NOT_PROVEN"
}
```

Missing provenance remains null/UNKNOWN and must never be inferred from the numeric field itself.

### C. sectorMedianPe derivation provenance

Add research-only:

```
sectorMedianPeProvenance: {
  derivationVersion: "SAME_SCAN_POSITIVE_PE_MEDIAN_V0_1",
  industry,
  positivePePeerCount,
  valuationSnapshotAsOfDate,
  valuationSnapshotDigest,
  knownAt: decisionAt
}
```

Do not persist a later-recomputed peer median for an old generation.

### D. Immutable parent semantics

All new provenance must be included in:
- C1 canonical content digest;
- immutable generation readback;
- D1/chunk persistence if that is the current parent store;
- page/readback verification.

No historical V8.17 or earlier receipt may be rewritten/backfilled.

## Research promotion states

Future R2 evidence may progress through:

1. `STRUCTURAL_ONLY`
   - current state;
2. `SELECTION_TIME_SOURCE_VINTAGE_CAPTURED`
   - same-scan source date/digest/capture time frozen;
3. `SYSTEM_FIRST_OBSERVED_PROVENANCE_VALID`
   - immutable capture continuity proven over genuine dates;
4. `OFFICIAL_FIRST_KNOWN_COMPLETE`
   - only if official publication timing is separately proven where required;
5. `OUTCOME_JOIN_ELIGIBLE`
   - only after all required fields meet the pre-registered estimand's provenance rule.

This proposal by itself can at most enable states 2-3.

It must not falsely grant state 4.

## Formal firewall

Forbidden:
- changing `scoreCandidate()` valuation condition;
- changing PE/sector-median threshold 2.5x;
- changing growth exception threshold 25%;
- changing A/B, liquidity, ATR, RR, grade or sector rules;
- changing comparator/ranking;
- changing Top6 or 3+3;
- changing capital or BUY/ADD/REDUCE/SELL/STOP;
- changing 15m semantics;
- changing push/order behavior;
- System2 changes.

Formal selection must be byte-/fixture-equivalent after the additive provenance capture.

## Runtime/provider budget

Required:
- zero new external/provider calls;
- reuse the quality snapshots already read by the after-market scan;
- no duplicate valuation/financial fetch;
- no new market-data entitlement.

Storage growth must be measured at 500/1000/2000-row C1 generations before merge.

If the provenance object would exceed existing chunk/storage safety bounds, use normalized shared snapshot metadata plus compact per-symbol references rather than duplicating full metadata per row.

## Failure semantics

Research provenance capture:
- fails closed for valuation promotion;
- fails open to existing Formal selection.

If digesting/persisting provenance fails:
- Formal scan proceeds unchanged;
- valuation source-vintage evidence is marked blocked;
- no fake provenance object is emitted.

## Validation / acceptance contract

Before merge of any concrete implementation PR require:

- exact latest-main base;
- guarded patch chain; no direct ad-hoc Worker.js edit;
- protected Formal function parity;
- selected-symbol parity on frozen fixtures;
- plan/capital parity;
- signal-state / 15m / push / order parity;
- provider-call delta = 0;
- snapshot content-digest determinism;
- same-request provenance binding;
- `knownAt <= decisionAt` enforcement;
- missing metadata remains UNKNOWN/null;
- sectorMedianPe provenance tied to same valuation snapshot and derivation version;
- no historical backfill;
- immutable generation conflict detection;
- D1/readback verification;
- chunk/storage scale tests;
- V8 Regression PASS;
- V8 Repair CI PASS;
- System1 isolated review PASS.

## Deployment boundary

Owner approval of this Class-B scope authorizes engineering implementation only.

If implementation changes guarded runtime / D1 production schema or triggers Cloudflare deployment, the concrete PR must return to the owner with:

- exact PR/head SHA;
- exact runtime/version change;
- CI results;
- Formal parity evidence;
- provider-call delta;
- storage/resource delta;
- rollback path.

Production deploy remains separately gated unless current governance explicitly authorizes it.

## Explicit owner approval phrase

Recommended authorization:

> 批准 Valuation Source Vintage Class-B 實裝。

Until that explicit approval exists:

`implementationAuthorized=false`

`deploymentAuthorized=false`

`economicSuperiority=UNKNOWN`

`formalOptimizationCandidate=NONE`

Formal Core: LOCKED


## Owner approval receipt

- Owner approval received in ChatGPT on 2026-10-05 Asia/Taipei:
  `批准 Valuation Source Vintage Class-B 實裝。`
- This approval authorizes repository engineering implementation of the additive research provenance capture defined in this proposal.
- It does not authorize:
  - Formal valuation-rule changes;
  - PE/sector-median threshold changes;
  - growth-exception threshold changes;
  - ranking/comparator/Top6/3+3/capital/trading changes;
  - live trading;
  - Production deployment unless separately permitted by current governance after concrete PR/CI/runtime review.

Implementation state now:

`implementationAuthorized=true`

`deploymentAuthorized=false`

`formalChangeAuthorized=false`

`economicSuperiority=UNKNOWN`

`formalOptimizationCandidate=NONE`

Formal Core: LOCKED

## Exact implementation handoff

Use Codex + GPT-6 Astra + High (or strongest current coding equivalent).

First action:
1. fetch latest `main`;
2. read `AGENTS.md`, `VERSIONING.md`, `REQUIREMENTS_30.md`, this proposal, and the R2 checkpoint;
3. inspect current patch-chain/runtime version before assigning any version;
4. implement only the minimum additive source-vintage capture;
5. use guarded patch-chain engineering, not ad-hoc direct Worker.js edits;
6. open a PR and run exact-head Regression, Repair CI, and isolated review;
7. do not deploy Production unless current governance separately authorizes it after the concrete implementation is reviewed.

## Implementation continuation

The V8.18.0 candidate is implemented on `codex/system1-valuation-source-vintage`.
Continue from `research/SYSTEM1_VALUATION_SOURCE_VINTAGE_IMPLEMENTATION_20261005.md` and the exact PR/head CI packet. Do not restart R1/R2 research or this proposal. Production merge/deploy remains NOT AUTHORIZED.
