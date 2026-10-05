# System 2 Bounded Revision-Chain Topology — Low-Volume V0.2

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / VERSION-CHAIN TOPOLOGY
System 1 Formal Core: LOCKED

## Purpose

Continue from the 23/23 issuer-history observability census without overclaiming exact event-level revision completeness.

This gate asks a narrower question:

When a MOPS action-family history contains a correction/cancellation hint, can that later version be linked to an earlier original disclosure in the same symbol/action-family history?

## Scope

Same frozen low-volume event universe:
2026-04-05..2026-10-02.

- TWSE capital reduction;
- TWSE par-value change;
- TPEx capital reduction;
- TPEx par-value change.

## Topology semantics

For each symbol/action-family history:
1. strip the MOPS row prefix;
2. normalize correction/revision prefixes and non-semantic date/number punctuation;
3. preserve `date|time|seqNo` version identity;
4. for each correction/cancellation row, search only earlier original rows;
5. accept exact stem or conservative containment >=72%.

A correction row without a compatible earlier original remains unresolved.

## Important boundary

This is symbol-family topology, not exact final-event linkage.

The same company could theoretically have more than one action in the two-year observation window.

Therefore:
- resolved topology proves the historical version rows form an internally traceable chain;
- it does not yet prove the chain belongs to one specific final-result event;
- no-revision-hint events remain `NO_REVISION_HINT_UNQUALIFIED`.

## Negative no-revision rule

Absence of a correction hint is not yet evidence that no revision occurred.

Before a no-revision event can become qualified negative evidence, a later gate must verify per-symbol query integrity and absence semantics for the relevant bounded window.

Thus V0.2 always keeps:
- `noRevisionNegativeClaimQualifiedCount=0`;
- `noRevisionAbsenceSemanticsCertified=false`;
- `boundedRevisionHistoryCoverageComplete=false`.

## Next gate

1. inspect any unresolved revision chains;
2. physically verify per-symbol full-query vs month-shard integrity for the 23 symbols;
3. define qualified negative no-revision/cancellation semantics;
4. then perform exact final-event linkage where more than one same-family action is possible.

No trading authority is affected.
