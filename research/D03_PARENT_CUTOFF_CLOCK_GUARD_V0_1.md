# D03 Parent Decision-Cutoff / Two-Point Continuity Reconciliation V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03-09 / D03-10 shared parent-continuity timing
Status: OUTCOME_BLIND / DESIGN_AND_FALSIFICATION / NO MATURITY PROMOTION
Formal Core: LOCKED

## Purpose

Resolve a hidden timing ambiguity between the deployed V8.17 C1 parent and the canonical immutable-parent research contract.

The canonical contracts already require `decisionCutoffAt`.
The deployed C1 runtime currently persists `decisionAt` / `capturedAt`, but does not persist `decisionCutoffAt`.

This matters because `decisionAt` is stamped inside `buildC1PopulationReceipt(...formalResults...)` after the Formal result map and selected set already exist.

Therefore:

`C1 decisionAt receipt stamp != proven Formal input cutoff`.

D03 must not silently substitute one for the other.

## TI-651 — canonical contract and deployed runtime are semantically different

Canonical research contracts:
- `CAPTURE_GENERATION_CONTRACT_V0_1` requires `decisionCutoffAt`;
- `IMMUTABLE_DECISION_STATE_PARENT_CONTRACT_V0_1` puts `decisionCutoffAt` in immutable parent identity;
- generic evidence-clock guards compare evidence `availableAt` to `decisionCutoffAt`.

Deployed C1 V8.17:
- obtains already-computed `c1FormalResults` and `selected`;
- then calls `buildC1PopulationReceipt`;
- builder creates `decisionAt=new Date().toISOString()`;
- persisted generation stores decision_at/captured_at, not canonical `decisionCutoffAt`.

Thus the deployed C1 is a strong immutable population/generation parent, but its receipt stamp is not by itself proof of the earlier Formal information cutoff.

## TI-652 — receipt-stamp substitution has a concrete look-ahead counterexample

Synthetic chronology:

- actual Formal decision calculation complete: 18:09:50;
- later research/source capture: 18:10:00;
- C1 receipt `decisionAt` stamp: 18:10:05.

A guard using only:

`sourceCapturedAt <= C1 decisionAt`

would accept the 18:10:00 source even though it was unavailable when the 18:09:50 Formal decision was already computed.

Therefore:

`decisionAtMaySubstituteForCutoff=false`.

This is a timing/provenance result, not evidence that Production selected incorrectly.

## TI-653 — missing decisionCutoffAt is an upstream schema/runtime gap, not a D03-local field to invent

D03 may not:
- manufacture a cutoff from the nearest timestamp;
- assume scheduled 18:10 equals actual input freeze without a lineage receipt;
- rewrite existing C1 generations;
- infer cutoff from child capture time;
- use current source state to repair an earlier parent.

The owner/shared-parent lane must eventually provide a physical cutoff identity if promotion-grade research requires that semantic.

This can remain additive Class-B provenance plumbing and need not change Formal scores, thresholds, selection, capital or push behavior, but D03 does not authorize that runtime change here.

## TI-654 — prospective exact-version capture does not require global public-latency certification

For one future parent, a genuinely prospective source snapshot can prove an exact version set was publicly visible at its own `capturedAt`.

Global statements such as:
- exact publication-to-web latency;
- universal `knownAtVersionClockCertified`;

are not required for that one parent if a stricter parent-specific reconciliation is available.

However the pre-snapshot alone is insufficient because a correction can appear between pre-snapshot and the parent cutoff.

## TI-655 — two-point fail-closed reconciliation

A parent-specific continuity path can be safe when all of the following are true:

1. an explicit parent `decisionCutoffAt` exists;
2. pre-parent exact-version snapshot is physically captured no later than that cutoff;
3. pre-snapshot bounded query identity is immutable;
4. after the parent, the same bounded revision-history population is re-read under certified completeness;
5. source-reported version-clock semantics are certified;
6. every immutable version whose `sourceReportedAt <= decisionCutoffAt` was already present in the pre-snapshot;
7. any missing such version blocks the parent;
8. versions with `sourceReportedAt > decisionCutoffAt` do not contaminate the earlier parent;
9. post-readback never rewrites the pre-snapshot.

This intentionally converts unknown transport latency into a fail-closed coverage rule.

If a version was source-reported by cutoff but did not become publicly visible until later, post-reconciliation will block the parent rather than falsely admit it. That is conservative.

## TI-656 — this reduces the need for arbitrary high-frequency polling

D03 does not need to demand continuous MOPS polling merely to prove one parent-specific technical-continuity state.

A two-point design can be enough:
- one promotion-grade pre-cutoff exact-version snapshot;
- one post-parent complete reconciliation.

High-frequency first-observed sampling remains useful for the System2 owner's broader public-latency / historical-knownAt research, but it is not the only safe path for D03 parent-specific eligibility.

This distinction avoids turning a research evidence problem into an unnecessary always-on polling/cost problem.

## TI-657 — current physical blocker after this audit

The new deterministic guard can define the acceptance logic, but today's deployed C1 still lacks explicit `decisionCutoffAt`.

Additionally System2 owner state still has:
- bounded revision-history completeness incomplete;
- technical continuity not certified;
- zero prospective availability observations in the owner observer;
- first genuine post-V8.17 trading-session parent pending.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 aggregate remains 56.7%.

The new result is blocker reduction / semantic correction, not maturity inflation.

## Exact next continuation

1. Shared parent owner: reconcile deployed C1 `decisionAt` with canonical `decisionCutoffAt`; persist a real cutoff or another cryptographically linked input-freeze receipt before promotion use.
2. Shared continuity owner: obtain bounded revision-history completeness for the relevant six lanes.
3. On the first genuine V8.17 trading session, capture a pre-cutoff exact-version continuity snapshot using the approved owner path.
4. After parent freeze, re-read the same bounded version population and apply the two-point no-gap guard.
5. Bind the eligible continuity receipt to the exact D03 parent-continuity binding identity.
6. Run Bollinger v0.2 across the complete parent keyset first. Only then can D03-10 be reconsidered for L3 and D03 58.3%.
7. ADX follows only with canonical-anchor FULL_REPLAY and complete recursive lineage for D03 60.0%.
8. TI-005/TI-006 outcomes remain closed.

No Formal or Production behavior is changed by this research artifact.
