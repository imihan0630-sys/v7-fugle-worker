# SC-090 — D10-08 Prospective Supply-Gap Event Cohort Contract V0.1

Status: RESEARCH_ONLY / PROSPECTIVE_EVENT_COHORT_CONTRACT_FROZEN / EVENT_ROOT_DEDUP / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-08
Date: 2026-10-08 Asia/Taipei
Parents:
- research/sc042_shortage_supply_gap_event_contract_v0_1.json
- research/SC089_GLOBALWAFERS_NOVARA_REALIZED_SUPPLY_GAP_SUBSTITUTION_20261008_V0_1.md
Observed main before write: 5b9f7b8d839b0ef19e5fe89ab2f3f2010e47191f

## Purpose

Freeze how future issuer-native shortage / allocation / supply-gap events enter the D10-08 prospective cohort.

## Independent unit

Primary independent unit:
`SUPPLY_DISRUPTION_EVENT_ROOT`.

Examples of a root:
- one facility fire;
- one supplier shutdown;
- one explicit allocation/quota episode;
- one transportation/logistics closure;
- one utility outage;
- one material embargo/export restriction if it creates an issuer-specific supply interruption;
- one qualification failure that blocks a required supply path.

## Descendant updates do not increase event N

Within one root, the following are descendants:
- initial disruption notice;
- partial restart;
- alternate-site support activation;
- customer qualification progress;
- equipment replacement;
- capacity-transfer update;
- insurance update;
- gradual recovery;
- full recovery;
- revenue-impact update.

Permanent rule:
`MILESTONE_COUNT != INDEPENDENT_EVENT_COUNT`.

Novara 2026-07-20 fire root currently counts as one issuer-native event root despite multiple later updates.

## Required prospective fields

Every future root must preserve:
- eventRootId;
- issuer / symbol;
- sourcePublishedAt;
- capturedAt;
- eventOccurredAt when disclosed;
- firstEligibleDecision;
- affected facility / supplier / product scope;
- event class;
- explicit shortage/allocation/capacity-constraint state;
- production/lead-time/inventory/price operational consequence;
- demand state separately;
- alternate-path state;
- qualification state;
- spare-capacity / allocation state;
- recovery state;
- source lineage;
- parent/descendant relation;
- UNKNOWN reasons.

## Admission rules

ADMIT_ROOT when:
- authoritative issuer/exchange/government source;
- a new disruption/allocation root is directly disclosed;
- at least one operational consequence is observable or explicitly pending.

ADMIT_DESCENDANT when:
- the source updates an already-known root;
- no new independent event is created.

CONTEXT_ONLY when:
- only generic industry shortage language exists without issuer-specific root.

REJECT_AS_ROOT when:
- media rumor only;
- price increase without supply constraint;
- long delivery time without explicit shortage/allocation/capacity constraint;
- later milestone is merely a continuation of an existing root.

## Cross-module lineage

D10-08 owns the event root.
D10-01 may reference structural alternate-path implications.
D10-04 may reference capacity state.
D10-10 owns/reuses event clock semantics.
D17 may consume realized propagation but may not recreate the structural/event root as an independent D10 vote.

All consumers preserve one `dedupRootId`.

## Current cohort state

Issuer-native independent event roots prospectively usable for future validation under this contract:
- GlobalWafers / Novara fire root = 1.

SC-042 survey/monthly shortage states remain source-feasibility/context evidence and are not reclassified as issuer-event roots.

Therefore current issuer-event root N = 1.

## L4 gate

D10-08 remains L3 / 60%.

L4 requires:
- multiple independent post-contract issuer/event roots;
- at least one different issuer or different supply-chain mechanism;
- event-root dependence preserved;
- common-support fields frozen before outcomes;
- D16 method receipt before economic/stock outcome access;
- no bullish sign inferred from shortage alone;
- adequate power / OOS evidence.

## Exact next

SC-091:
capture the next genuinely new issuer-native shortage/allocation/capacity-constraint root after SC-090. If none exists, preserve NULL observation rather than recycling Novara descendants as new events.

Formal Core unchanged.
