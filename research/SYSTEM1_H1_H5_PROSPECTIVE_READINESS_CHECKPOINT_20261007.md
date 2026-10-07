# System1 H1-H5 Prospective Readiness — 2026-10-07

Status: CLASS-A RESEARCH-ONLY / PROSPECTIVE POSTPROCESS / FORMAL CORE LOCKED

## Purpose

Make the next genuine C1/C2 scheduled generation immediately diagnosable without manual second-pass work, while preserving the time boundary between scan-session evidence and next-session entry evidence.

## Frozen time layers

T0 (scan-session, available after the 00:10 prospective collector):
- H1 P1-A semantic over-hardening: structural count ready; outcome still closed.
- H2 TARGET_AVAILABLE: only economically admissible when TARGET_NONE_SEARCH_COMPLETE is actually provenance-verified.
- H3 RR geometry: only economically admissible when its target is TARGET_FOUND with verified provenance.

T1 (next trading session):
- H4 B retest / confirmation delay: requires the registered C3 intraday capture and next-session path.
- H5 double maxChase: classifier is ready, but exact NO_BUY requires exhaustive expected monitor coverage plus negative signal coverage.

A zero before T1 is forbidden.

## Critical provenance finding

Current Production C1 V8.15 c1DerivedState() durably stores:
- targetState;
- target;
- rewardPerRisk;
- entryGeometry.

It does not durably store:
- targetSearchComplete;
- target source/authentication provenance;
- target source receipt IDs;
- targetGeometryVerified / geometry quality.

Therefore current-like C1 observations will correctly classify target semantics as TARGET_UNKNOWN_SOURCE rather than silently promoting legacy target NONE into TARGET_NONE_SEARCH_COMPLETE.

This is a capture gap, not a reason to weaken the gate.

## Workflow wiring

System 1 C1 Prospective Evidence now runs one additional offline step only after verified C1/C2 collection succeeds.

New artifacts:
- system1-h1-h5-readiness.json
- system1-c5-short.json
- system1-opportunity-loss-v0.3.json

No additional provider/network call is made by the postprocess. It reads only artifacts already produced in the same job.

If C1/C2 or Formal-C1 binding validation fails, the postprocess does not run and no fake H1-H5 result is produced.

## Safety

No Worker/D1/runtime strategy mutation.
No A/B, Top6/3+3, rank, capital, 15m semantics, maxChase, retest, signal, push, order or System2 behavior changes.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.

Bridge V0.3 explicitly adapts canonical SYSTEM1_C5_SEMANTIC_REPAIR_V0_2 into the older V0.2 bridge compatibility schema without weakening either verifier. The adapter is research-only and preserves source schema identity.

## H1 conditional upper-bound enhancement

The scheduled offline postprocess now also emits `system1-c5-daily-report.json`.

For H1 it preserves three separate estimands:
- strict P1-A structural blockers from canonical C5 semantic repair;
- conditional reach upper bound if unresolved safety evidence were later proven PASS;
- safety-capture engineering demand.

Conditional reach never mutates UNKNOWN to PASS, never creates a candidate, never authorizes selection, and never counts candidate lift as economic success.

The purpose is to decide whether expensive future safety-receipt capture is even worth considering before any Class-B request.
