# D03 → Shared Parent Owner: Decision-Cutoff Provenance Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
Producer: D03｜技術指標與趨勢動能研究室
Owner lane: System 1 shared immutable C1 parent / capture-generation owner
Status: RESEARCH_HANDOFF / CLASS_B_PROPOSAL_ONLY / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Close the timing gap identified by TI-651~TI-657 before the first genuine post-V8.17 parent is used for promotion-grade Technical Indicator evidence.

The canonical research contracts require `decisionCutoffAt`.
The deployed V8.17 C1 parent currently persists a later `decisionAt` receipt stamp but not the actual Formal input-freeze cutoff.

D03 does not authorize or implement Production changes here.

## TI-658 — exact current code boundary is now source-audited

Current-main `runAfterMarketScanCore` performs all material input reads before:

```
const marketState = updateMarketState(...)
const storedBudget = await env.STOCKS_KV.get(...)
const totalCapital = ...
const scan = selectTomorrowCandidates(...)
```

The selection function is synchronous and receives already-loaded market state / rows / official index / environment configuration.

The V8.15+ C1 patch then builds `c1PopulationReceipt` inside `selectTomorrowCandidates` **after** the Formal candidate/result maps exist.

V8.17 only adds Shadow membership capture around that C1 receipt; it does not add `decisionCutoffAt`.

Therefore the clean input-freeze boundary is structurally available before the call to `selectTomorrowCandidates`, but it is not persisted today.

## TI-659 — two separate clocks are required

The shared parent should preserve at least:

- `decisionCutoffAt`: latest instant at which a source/input may legally enter the Formal computation;
- `decisionAt`: receipt/build timestamp after Formal scoring/selection state exists.

Optional but strongly preferred:
- `formalFrozenAt`: instant after Formal result set/fail-closed selection gates are frozen;
- `captureCompletedAt`: research persistence/readback completion time.

These clocks are not interchangeable.

Required invariant:

```
decisionCutoffAt <= formalFrozenAt <= decisionAt/captureCompletedAt
```

The exact field names may be owner-versioned, but the semantic distinction may not be removed.

## TI-660 — recommended additive implementation point

Owner implementation should freeze the cutoff:

> after all Formal source/input reads required for selection are complete, but immediately before the first pure selection/scoring computation.

In current `runAfterMarketScanCore`, the natural candidate is immediately before:

`selectTomorrowCandidates(marketState, rows, ...)`.

This is only a source-audit recommendation. The owner must verify that no newly introduced Formal-affecting external read exists inside/after that boundary before implementation.

A later diagnostics-only read must not move the input cutoff unless it can change Formal selection/action.

## TI-661 — cutoff must be cryptographically linked to the immutable generation

Promotion-grade parent identity must bind the cutoff to the exact immutable C1 generation.

Minimum linkage:
- generationId / captureGeneration;
- scanDate;
- `decisionCutoffAt`;
- runtimeVersion;
- selectionRuleVersion;
- population content digest / parent keyset digest;
- source/semantic fingerprint;
- Formal result fingerprint where owner contract requires it.

The cutoff may live in the generation header if every child binding cryptographically commits to that header/generation identity.

A free-floating timestamp in logs is insufficient.

## TI-662 — no historical backfill

Existing V8.15/V8.16/V8.17 generations without a physically persisted cutoff remain:

`LEGACY_DECISION_CUTOFF_UNKNOWN`.

Forbidden:
- setting cutoff to scheduled 18:10 retrospectively;
- copying `decisionAt`;
- using C1 `capturedAt`;
- deriving cutoff from first child observation;
- inferring cutoff from source-reported publication time;
- recomputing an old generation and attaching a new cutoff.

Historical C1 generation remains valid for its existing research uses, but not for a child whose admission requires exact cutoff-safe causality.

## TI-663 — first genuine evidence must be prospective

After owner merge/deploy:
1. wait for a genuine Taiwan trading-day Formal scan;
2. read back the immutable C1 generation;
3. verify persisted `decisionCutoffAt`;
4. verify `decisionCutoffAt <= decisionAt`;
5. verify exact generation/content digest is unchanged by adding the provenance field;
6. verify Formal selection/ranking/capital/signal/push parity on frozen inputs;
7. do not synthesize/backfill a generation to obtain PASS.

Only then can D03 attach a cutoff-safe pre-parent continuity snapshot.

## TI-664 — two-point continuity can then replace arbitrary high-frequency polling for D03

Once the real cutoff exists, D03 can use the already-tested two-point fail-closed contract:

- exact pre-cutoff version snapshot;
- exact post-parent bounded revision-history reconciliation;
- missing pre-snapshot version whose source-reported time is <= cutoff => BLOCKED;
- versions reported after cutoff remain later information;
- incomplete bounded revision population => UNKNOWN.

This path is parent-specific.
It does **not** certify global public-availability latency or historical firstKnownAt for every disclosure.

## TI-665 — acceptance / authority boundary

Owner acceptance should prove:
- additive provenance only;
- no change to Formal A/B logic;
- no change to Top6 / 3+3 / capital / signals / push;
- no new market-data call required merely to stamp the cutoff;
- existing C1 population/membership keysets unchanged on frozen inputs;
- existing D1 generation remains immutable/idempotent;
- readback exposes the cutoff under the exact generation identity.

D03 acceptance after owner work:
- consume owner readback;
- do not self-attest;
- no maturity increase until a genuine parent and continuity receipt exist.

Current D03:
- D03-10 Bollinger = L2/40;
- D03-09 ADX = L2/40;
- aggregate = 56.7%.

Formal Core remains LOCKED.

## Exact next continuation

Shared-parent owner:
1. review the proposed input-freeze boundary against current effective built Worker, not raw-base assumptions alone;
2. implement/version the additive cutoff provenance only under Class-B governance;
3. CI-test byte/semantic parity of protected Formal behavior;
4. deploy only under applicable Production approval;
5. wait for genuine-session readback.

D03:
1. continue source/continuity bounded-completeness research outcome-blind;
2. consume the first genuine cutoff-bearing parent when it exists;
3. run two-point continuity reconciliation;
4. attempt Bollinger L3 first;
5. ADX remains separately recursive-replay gated.
