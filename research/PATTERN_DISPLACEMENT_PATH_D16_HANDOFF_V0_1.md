# D01 DL-033 — D16 Displacement / Excursion Path Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes path/location semantics.
D16 owns future inference.

Future age analysis must not confuse elapsed age with:
- current distance from the zone;
- maximum prior excursion;
- cumulative travel path;
- time since last interaction;
- return-trip direction.

## Required nested comparison

P0:
age + interaction history + DL-032 scale/regime context.

P1:
P0 + current location/distance.

P2:
P1 + max/cumulative excursion path.

P3:
P2 + interaction-recency / return-trip descriptors.

If age disappears after P1/P2/P3, classify location/path/recency confounding rather than rescuing the age story.

## Path completeness

All path summaries require verified eligible-session continuity.

Missing path interval:
PATH_SUMMARY_DATA_BLOCKED.

Do not impute max excursion or path length.

## Common support

Old/young comparisons require overlap in:
- current distance;
- excursion magnitude;
- interaction recency;
- interaction history;
- DL-032 scale/regime context.

No extrapolation outside support.

## Promotion boundary

No path descriptor is a Formal feature by default.
No runtime/ranking/capital change is authorized.
Formal Core remains LOCKED.
