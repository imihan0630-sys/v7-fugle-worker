# D03 Bollinger First-Parent Acceptance V0.2

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND / V0.1 SOURCE-LINEAGE_GAP_SUPERSEDED
Formal Core: LOCKED

## TI-625 — V0.1 source-lineage self-attestation gap

The first Bollinger acceptance evaluator correctly enforced:
- exact 20-session window;
- population standard deviation;
- parent cutoff;
- complete expected-parent attempts.

But it could accept a continuity object that self-asserted `technicalContinuity=true` without the full upstream receipt identity.

That is too weak for promotion-grade PIT evidence.

V0.2 supersedes V0.1 for L3 review.

## TI-626 — upstream continuity identity now mandatory

V0.2 requires:
- sourceFamilyVersion;
- 64-hex sourceHistoryHash;
- rawHistoryAdmissionReceiptId;
- symbolSessionContractVersion;
- sessionCalendarVersion;
- continuityEngineVersion;
- corporateActionRegistryVersion;
- 64-hex continuityTransformHash;
- receiptVersion;
- cleanHistoryStartDate;
- continuityReceiptId.

D03 consumes these fields from the shared continuity owner and does not self-issue them.

## TI-627 — exact 20 eligible-session population bound

Promotion-grade finite-window input requires:
- exactly 20 expected eligible symbol sessions;
- expectedEligibleSymbolSessionCount=20;
- observedRawBars=20;
- continuityBars=20;
- exactly 20 delivered bars;
- identical expected/bar date sets;
- zero unresolved missing sessions;
- zero unresolved relevant events;
- zero pseudo bars delivered.

A symbol suspension may change the surrounding market-calendar span, but the delivered indicator window must remain exactly 20 verified eligible symbol sessions.

## TI-628 — raw-bar identity binding

Every bar must retain:
- observedRawBarIdentity;
- 64-hex sourceBarHash;
- symbolSessionVerified;
- technicalContinuity;
- corporateActionContinuityResolved;
- sourceFetchedAt no later than parent knownAt.

The continuity window hash includes raw-history receipt, source-history hash, transform hash and per-bar identities.

This prevents a numerically identical close vector from being treated as the same PIT source lineage when its underlying version provenance differs.

## TI-629 — one canonical formula implementation

V0.2 calls `computeBollingerBands` from the frozen technical-indicator core.

It does not reimplement mean/variance arithmetic inside the acceptance layer.

Thus formula parity and source/PIT acceptance remain separate concerns.

## TI-630 — maturity remains first-genuine-parent gated

V0.2 fixture success closes a design/provenance loophole only.

D03-10 remains L2/40 until a genuine post-V8.17 parent generation supplies a cutoff-safe continuity receipt that passes V0.2 for every expected parent and the run reconciles COMPLETE.

A future genuine pass would move D03 56.7% -> 58.3%.

No fixture pass alone changes maturity.

Formal Core remains LOCKED.
