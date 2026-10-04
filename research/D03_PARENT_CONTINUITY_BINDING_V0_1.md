# D03 Parent × Continuity Binding V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND
Formal Core: LOCKED

## TI-631 — source receipt and parent receipt must remain separate objects

The shared continuity receipt is a source fact and may legitimately be reused.
The immutable Shadow parent is a decision-state fact.

Do not duplicate the entire continuity payload into each parent.

Instead create an immutable binding receipt that references both identities.

## TI-632 — binding identity

Binding identity includes:
- scanDate;
- captureGeneration;
- symbol;
- parentSnapshotHash;
- parent knownAt;
- continuityReceiptId/version;
- continuity asOf/capturedAt;
- sourceHistoryHash;
- continuityTransformHash;
- expected eligible date-set hash;
- continuity bar date-set hash;
- sourceBarsThrough.

The complete payload is hashed into bindingId.

Changing parent generation, parent snapshot, continuity receipt or source/transform version changes bindingId.

## TI-633 — temporal and population invariants

Binding is VALID only when:
- continuity symbol == parent symbol;
- continuity asOf == parent scanDate;
- continuity capturedAt <= parent knownAt;
- expected eligible date set == delivered continuity-bar date set;
- sourceBarsThrough == final delivered bar date;
- final bar date <= parent scanDate.

Thus a same-symbol receipt from another decision date cannot be silently reused.

## TI-634 — bounded indicator wrappers

Promotion-grade calls should use:
- `evaluateBoundBollingerL3V0_1`;
- `evaluateBoundAdxL3V0_1`.

The wrapper first validates the parent×continuity binding.
Only then does it call the hardened v0.2 indicator evaluator.

A source-valid indicator calculation attached to the wrong parent is not L3 evidence.

## TI-635 — maturity remains genuine-parent gated

Synthetic binding tests can close join-identity design risk but cannot replace a genuine post-V8.17 parent.

D03 remains 56.7%.

Monday execution must persist/reconcile bindingId together with the indicator attempt for every expected parent.

Formal Core remains LOCKED.
