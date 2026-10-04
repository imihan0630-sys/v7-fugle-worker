# H06 Room13 Counterpart V0.2 — D20-06 vs D06-06

Updated: 2026-10-04 Asia/Taipei
Owner: 13｜行為金融與市場心理研究室
Classification: KEEP_SEPARATE_CONDITIONAL_ON_BEHAVIOR_IDENTIFIABILITY / COUNTERPART_COMPLETE
Formal Core: LOCKED

## Accepted boundary
- D06-06 owns observable crowding: holdings, financing, lending, flow and ownership concentration.
- D20-06 owns behavioral/social herding only when an independent behavioral observable survives common-information and crowding controls.
- The same D06 primitive cannot become a second D20 vote.

## Independent behavior-specific observable now verified
Live PTT Stock public-source verification establishes a bounded prospective social-behavior stream:
- Atom feed gives article URL, publication/update clocks, author and preview.
- Article pages give original post time, public participant handles, push/boo/arrow reactions, minute-level comment times and explicit edit times.
- Conservative first-known = system capturedAt.
- Snapshots append; later edit/deletion does not rewrite earlier captured state.
- Public handles are forum actors only, not brokerage investor identities.

Canonical source receipt:
research/d20_ptt_social_source_live_receipt_20261004_v0_1.json

D20 contract:
research/d20_06_ptt_social_herding_pit_contract_v0_1.json

## Behavioral transform
D20-06 uses aggregate:
- distinct-participant count;
- frozen stance histogram;
- sequence-transition counts;
- stance-convergence/adoption measures.

No named-user psychology, influence or leader score is retained.

A herding interpretation is eligible only after controlling:
- common news/event;
- topic/theme;
- attention;
- market/sector move;
- thread age/posting-time effects;
- regime.

Push/boo/arrow is not automatically stock stance.

## Divergent states
A. High D06 crowding / D20 herding UNKNOWN or low:
Index/passive rebalance creates concentrated positions/flow with no independent social convergence.

B. D20 social herding candidate / D06 crowding moderate:
A new public-forum stance begins converging across distinct participants before large ownership/financing concentration is observable, while common-news/topic/attention controls do not explain the sequence.

C. High apparent social synchronization / D20 rejected:
A common headline drives same-topic discussion; after event/news control there is no residual adoption signal.

## PIT/replay
- firstKnown = capturedAt;
- source post/edit/comment times retained as provenance only;
- prior captured versions remain immutable;
- pre-first-capture deletion/history = UNKNOWN;
- only post-preregistration aggregate parents can later count toward L4.

## Terminal specialist return
KEEP_SEPARATE_CONDITIONAL_ON_BEHAVIOR_IDENTIFIABILITY.

Reason:
An independent, replayable public-forum behavioral observable now exists beyond D06 crowding primitives. This supports a bounded D20-06 social-herding sublane, not general investor-account herding.

D20-06 = L3 data feasibility only.
No alpha/OOS/Formal claim.
