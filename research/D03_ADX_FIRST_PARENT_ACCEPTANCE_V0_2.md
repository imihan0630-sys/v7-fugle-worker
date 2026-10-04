# D03 ADX First-Parent Acceptance V0.2

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND / V0.1 SELF-FALSIFIED_AND_SUPERSEDED
Formal Core: LOCKED

## TI-619 — V0.1 self-falsification

The first ADX acceptance draft correctly rejected local-window bootstrap and required FULL_REPLAY.

However, it could still accept:
- a self-declared FULL_REPLAY label;
- arbitrary nonempty lineage/hash strings;
- an arbitrary first bar relabeled as the canonical initialization anchor.

That violates the already-frozen rule that self-issued hashes/assertions do not authenticate source lineage.

Therefore V0.1 is superseded for promotion-grade use.

## TI-620 — V0.2 upstream receipt chain

V0.2 additionally requires:
- sourceFamilyVersion;
- 64-hex sourceHistoryHash;
- rawHistoryAdmissionReceiptId;
- symbolSessionContractVersion;
- sessionCalendarVersion;
- continuityEngineVersion;
- corporateActionRegistryVersion;
- 64-hex continuityTransformHash;
- receiptVersion;
- 64-hex stateLineageId.

Missing/placeholder values block.

These fields are consumed from the shared continuity owner; D03 does not self-issue them.

## TI-621 — canonical anchor certification

FULL_REPLAY is accepted only when:
- cleanHistoryStartDate is valid;
- initializationAnchorDate is valid;
- they are identical in v0.2;
- anchorCertificationState = CANONICAL_LINEAGE_ANCHOR_CERTIFIED;
- the first replay bar date equals the certified anchor;
- eligibleBarsFromAnchorToAsOf equals delivered bar count.

This deliberately rejects an arbitrary trailing 80/150/200-bar local reconstruction relabeled as full replay.

The rule is stricter than mere numerical convergence.

## TI-622 — raw-bar binding strengthened

Every replay bar must carry:
- observedRawBarIdentity;
- 64-hex sourceBarHash;
- verified symbol session;
- technical continuity;
- resolved corporate-action continuity;
- sourceFetchedAt no later than parent knownAt.

H/L/C geometry remains mandatory.

Thus the replay state is bound to a specific continuity-transformed source lineage rather than only numeric H/L/C arrays.

## TI-623 — FULL_REPLAY remains the only v0.2 promotion path

TRUSTED_PRIOR_STATE remains blocked until a separate trusted-state certifier proves:
- prior state lineage;
- prior-state replay equivalence;
- no continuity/source version conflict;
- exact suffix update semantics.

This is intentionally conservative.

## TI-624 — maturity remains genuine-parent gated

V0.2 deterministic tests may close the acceptance-logic design gap only.

D03-09 remains L2/40 until:
- first genuine V8.17 parent exists;
- cutoff-safe owner continuity receipt exists;
- canonical anchor-certified FULL_REPLAY passes for every expected parent;
- parent run reconciliation is COMPLETE.

No maturity increase from fixture PASS.

Current target after a future real pass:
D03-09 L3 => aggregate 60.0%, assuming Bollinger has already reached L3.

Formal Core remains LOCKED.
