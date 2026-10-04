# D03 Decision-Cutoff Minimal Implementation Audit V0.1

Updated: 2026-10-04 Asia/Taipei  
Lane: D03 shared-parent dependency  
Classification: RESEARCH_ONLY / IMPLEMENTATION_SURFACE_AUDIT  
Formal Core impact: NONE / LOCKED

## Purpose

Reduce the remaining owner implementation ambiguity for `decisionCutoffAt` without performing a runtime or Production mutation.

The latest D03 causal contract already identifies the correct effective V8.17 boundary:

`V7_MARKET_CONSENSUS read -> decisionCutoffAt stamp -> selectTomorrowCandidates(...)`

This audit asks a narrower engineering question:

> What is the minimum additive persistence/readback surface required for a genuine cutoff-bearing C1 parent, and does it require a D1 schema migration?

## TI-686 — no dedicated D1 column is intrinsically required

Current C1 persistence already constructs:

`header = {...receipt, rows: undefined, ...}`

and writes the whole header into:

`trade_research_c1_generations.header_json`.

Current C1 readback parses `header_json` and returns it as the immutable generation header.

Therefore a new scalar field added to the C1 receipt, including `decisionCutoffAt`, is automatically persisted and read back through the existing immutable `header_json` contract.

A dedicated `decision_cutoff_at` D1 column may be useful for indexing/query ergonomics, but is **not required for semantic persistence**.

Conclusion:

`DECISION_CUTOFF_REQUIRES_D1_SCHEMA_MIGRATION = FALSE_AS_SEMANTIC_REQUIREMENT`.

This materially reduces deployment risk versus an unnecessary schema migration.

## TI-687 — existing immutable-header conflict logic can protect the cutoff

Current V8.15.1+ persistence rejects a same-generation write when the stored `header_json` differs from the incoming header.

Once `decisionCutoffAt` is part of the receipt/header:
- changing the cutoff for the same generation changes `header_json`;
- the existing immutable-generation conflict guard rejects that mutation.

Therefore the cutoff can inherit the existing append-only/immutable generation semantics without a second persistence mechanism.

Required owner test:
- same generation + same cutoff -> idempotent;
- same generation + different cutoff -> conflict;
- no update/backfill path.

## TI-688 — cutoff should remain a C1 parent fact, not a duplicated membership fact

Shadow cohort membership rows already bind to:
- `captureGeneration`;
- exact C1 row hash;
- exact parent generation.

The storage reader `loadShadowC1Parent` reads the C1 `header_json`.

Therefore D03 does not need `decisionCutoffAt` duplicated into every cohort membership row.

Preferred single-owner architecture:

`membership -> captureGeneration -> immutable C1 header -> decisionCutoffAt`.

Benefits:
- no duplicated timestamp authority;
- no membership-table migration;
- no risk that a copied cutoff diverges from the parent;
- D03 can bind continuity evidence to the exact parent generation.

If another consumer later requires the cutoff directly in a cohort header, that is a separate schema/version decision and must not be silently added here.

## TI-689 — minimum runtime patch surface

The smallest semantically complete owner patch is:

1. after the final Formal-affecting `V7_MARKET_CONSENSUS` read, stamp a real `decisionCutoffAt = new Date().toISOString()`;
2. pass that exact value into `selectTomorrowCandidates`;
3. pass it into `buildC1PopulationReceipt`;
4. validate it is finite, same-session, and no later than the later `decisionAt`;
5. include it in the C1 receipt/header;
6. preserve existing selector ordering, scores, quotas, capital, plans, signals and push behavior;
7. preserve existing generation identity; do not derive a new generation from the cutoff;
8. persist/read back through existing `header_json`;
9. expose it through the existing C1 generation readback used by research evidence;
10. never synthesize historical values for old generations.

No market-data/provider call is needed merely to stamp the cutoff.

## TI-690 — decisionAt remains a later receipt clock

`decisionCutoffAt` and `decisionAt` are distinct.

Required ordering:

`decisionCutoffAt <= decisionAt <= captureCompletedAt/readback time`.

The owner must not:
- copy `decisionAt` into `decisionCutoffAt`;
- infer a historical cutoff from schedule time;
- use a later C1 capture timestamp as the Formal-input cutoff.

The cutoff means:
> all currently observed Formal-affecting external inputs are loaded, while Formal selection has not yet started.

The decision receipt clock means:
> the C1 decision-state receipt was later materialized.

## TI-691 — acceptance tests required before deployment

A future owner implementation should prove all of the following on the effective patched Worker:

### Source-boundary tests
- exactly one final `V7_MARKET_CONSENSUS` read before selector;
- exactly one `decisionCutoffAt` stamp after that read and before selector;
- no async/external Formal-affecting read between cutoff stamp and selector;
- selector remains synchronous.

### Parent propagation tests
- cutoff passed into the selector/C1 builder without recomputation;
- C1 header readback equals the stamped runtime value;
- same-generation cutoff mutation conflicts;
- missing/invalid cutoff blocks promotion-grade parent use.

### Formal parity tests
- removing research-only C1/cohort fields yields identical Formal scan/selection result to the pre-cutoff provenance patch on the same fixture;
- no change to selected symbols, ranking tuple, pool/quota, plan, capital, signal or push.

### Historical firewall
- legacy generations without cutoff remain readable as legacy evidence;
- they are ineligible for D03 cutoff-safe promotion;
- no backfill/rewrite.

## TI-692 — shadow cohort semantic fingerprint need not change for D03

Current shadow cohort parent semantic fingerprint is computed from its own parent object and memberships; it does not need to become the cutoff owner.

D03 can resolve the cutoff from the exact C1 parent generation.

Therefore the minimum cutoff provenance patch can preserve current shadow cohort membership schema/fingerprint semantics.

If the owner deliberately chooses to include `decisionCutoffAt` inside the shadow cohort parent object, that must be treated as a versioned cohort-semantic change and separately tested. It is not required by D03.

## Maturity decision

This tranche reduces engineering ambiguity but creates no genuine trading-session evidence.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 aggregate remains 56.7%.

The next honest promotion remains:
- genuine cutoff-bearing parent;
- cutoff-safe owner continuity receipt;
- complete Bollinger v0.2 expected-parent reconciliation;
- then D03-10 L3 -> D03 58.3%.

ADX still requires canonical FULL_REPLAY after the Bollinger-class gates.

## Current status

`DECISION_CUTOFF_MINIMAL_PERSISTENCE_PATH = HEADER_JSON_NO_D1_MIGRATION_REQUIRED`

`DECISION_CUTOFF_DUPLICATE_MEMBERSHIP_FIELD = NOT_REQUIRED`

`DECISION_CUTOFF_RUNTIME_IMPLEMENTATION = OWNER_PENDING`

`HISTORICAL_BACKFILL = FORBIDDEN`

`D03_MATURITY = 56.7_PERCENT`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

## Exact next continuation point

1. Shared System1 parent owner decides/implements the additive provenance patch under Production governance.
2. Re-audit the effective runtime boundary immediately before any deploy.
3. First genuine post-deploy trading session: read back one cutoff-bearing immutable C1 generation.
4. Shared continuity owner binds a market-wide evidence cut satisfying `evidenceCutoffAt <= decisionCutoffAt`.
5. Run Bollinger v0.2 on every expected parent and require COMPLETE reconciliation.
6. Promote D03-10 only if the genuine physical evidence passes; otherwise retain L2 with explicit blocker.
7. ADX follows only with canonical FULL_REPLAY.
