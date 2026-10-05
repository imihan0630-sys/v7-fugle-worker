# System 2 Bounded Revision Stage-Aware Linkage V0.3

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / STAGE-AWARE EVENT LINKAGE
System 1 Formal Core: LOCKED

V0.2 physically showed 6 resolved events and 17 ambiguous events. The dominant ambiguity was not missing data; it was that a broad CAPITAL_REDUCTION family contains board decisions, creditor notices, registration, subsidiary reductions, treasury-share cancellation and final exchange-operation announcements.

V0.3 routes issuer evidence by the official final-result event stage.

For capital-reduction resume/reference, eligible issuer evidence must be the listed issuer's own disclosure, exclude subsidiary and treasury-share cancellation rows, contain reduction language plus operational-stage language such as share replacement, exchange plan, trading suspension/resumption, new-share listing, or a relevant base date, and fall within 210 days before the official effective date.

For par-value resume/reference, eligible issuer evidence must contain par-value semantics plus replacement/effective operational-stage language within the same lookback.

States are STAGE_LINKED_REVISION_CHAIN_OBSERVED, STAGE_LINKED_CANCELLATION_CHAIN_OBSERVED, STAGE_LINKED_NO_REVISION_HINT_QUERY_SUPPORTED, STAGE_LINKED_QUERY_INTEGRITY_NOT_SUPPORTED, and NO_STAGE_LINKED_ISSUER_ROWS.

This narrows semantic linkage only. It does not certify exhaustive correction/cancellation history, exact public knownAt, bounded revision completeness, or trading authority.
