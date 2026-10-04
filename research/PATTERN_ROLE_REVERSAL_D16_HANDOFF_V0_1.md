# D01 DL-034 — D16 Role-Reversal Incrementality Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes role-reversal semantics.
D16 owns future statistical inference.

The central question is not whether breakout retests can work.

It is:

> Does certified prior opposite-role history add information beyond generic breakout/retest mechanics?

## 2. Required future units

Preserve:
- immutable decision parent;
- structuralRootId;
- structuralVersionId;
- breakoutEventId;
- roleEpisodeId;
- first opposite-side retest opportunity.

These are linked observations, not separate independent votes.

## 3. Eligibility vs outcome

Eligibility is frozen at canonical breakoutConfirmedAt.

The first opposite-side retest is the first outcome opportunity.

Do not define a flip as "confirmed" because the first retest bounced and then reuse that bounce as the tested outcome.

## 4. Required comparator

G0:
generic confirmed breakout/retest boundary without certified prior opposite-role structural history.

G1:
same context, but the boundary belongs to a certified prior support/resistance root with the opposite original role.

The G0/G1 comparison should preserve common support in:
- breakout direction;
- breakout quality/lifecycle;
- D02 acceptance/persistence;
- retest latency;
- opportunity geometry;
- volatility/liquidity;
- scale/regime;
- path/displacement;
- gap/limit constraint state.

## 5. Nested inference

F0:
generic confirmed breakout/retest controls.

F1:
F0 + prior opposite-role structural history.

F2:
F1 + original-role age, interaction count, bounce count and salience/history.

F3:
F2 + DL-031/DL-032/DL-033 aging, scale/regime and path controls.

Interpretation:
- former-role coefficient absent after F0 -> generic retest;
- former-role history remains after F1/F2/F3 -> polarity-memory representation candidate;
- effect only in one preregistered stratum -> context-specific;
- no common support -> not evaluable.

## 6. First vs later retests

The first retest is special for causal ordering.

Later retests occur within the same role episode.

Do not select the best-performing retest.
Do not count multiple retests as independent flip events.

## 7. Censoring / cancellation

Candidate cancellation before first valid test is not a failed retest.

Keep separate:
- breakout reclaimed before test;
- market invalidated;
- continuity failure;
- constrained / no valid retest opportunity;
- study end.

## 8. Mechanism caution

Osler-style order clustering can create reversal/continuation around salient levels without proving polarity memory.

Henderson et al. model polarity reversal as a path-dependent regime state but this is theoretical support for the mechanism class, not empirical identification.

D16 should therefore test incrementality over generic breakout/retest controls, not merely whether flipped levels bounce above 50%.

## 9. Promotion boundary

Even a robust incremental polarity effect remains research-only until it passes:
- PIT / replay;
- OOS / prospective;
- multiple-testing;
- redundancy;
- cost / tradability;
- Formal governance.

No ranking, gating, capital or runtime change is authorized.

Formal Core remains LOCKED.
