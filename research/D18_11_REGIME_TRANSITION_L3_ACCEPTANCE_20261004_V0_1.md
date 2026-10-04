# D18-11 Regime Transition L3 Acceptance — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 2 policy impact: NONE

## Scope

This packet evaluates D18-11 Regime Transition only.

The module is promoted to L3 because an executable research-only transition observer now:
- consumes two immutable D18 observable-regime vectors;
- requires strict PIT eligibility;
- requires increasing decision clocks;
- requires adjacent official sessions;
- preserves UNKNOWN when a dimension is not discretely known on both sides;
- replays deterministically;
- forbids smoothing, retrospective relabeling and strategy/policy impact.

No transition policy, hysteresis threshold, de-risking action, ranking or capital effect is authorized.

## Executable implementation

Implementation:
`system2/runtime/d18_regime_transition_v0_1.mjs`

Test:
`system2/tests/d18_regime_transition_v0_1.test.mjs`

The observer produces:
- prior/current vector hashes;
- prior/current decision clocks;
- per-dimension transition states;
- changed/unchanged/unknown dimension lists;
- deterministic transition receipt hash.

## Transition semantics

For each dimension:

KNOWN -> KNOWN with same discrete value:
UNCHANGED

KNOWN -> KNOWN with different discrete value:
CHANGED

Any side CONTEXT_RAW / UNKNOWN / missing:
UNKNOWN

This prevents raw breadth/context values or blocked producer dimensions from being silently turned into regime transitions.

## PIT / replay gates

Required:
- prior/current vectorVersion matches the canonical D18 observable vector version;
- both vectors are pointInTimeEligible;
- prior market date < current market date;
- prior decision clock < current decision clock;
- observedAt >= current decision clock;
- prior/current dates are adjacent in the official-session sequence;
- both vectors retain immutable receipt hashes.

Rejected:
- calendar gaps/non-adjacent sessions;
- non-PIT vector;
- reversed/equal decision clocks;
- missing immutable vector identity.

## Falsification

Verified:
1. Trend value change => CHANGED.
2. Same volatility state => UNCHANGED.
3. CONTEXT_RAW breadth => UNKNOWN transition.
4. UNKNOWN size leadership => UNKNOWN transition.
5. Same input => same receiptHash.
6. Current vector mutation => different receiptHash.
7. Non-adjacent official sessions => reject.
8. non-PIT vector => reject.
9. observedAt before current decision clock => reject.

## Anti-hindsight firewall

The observer explicitly stores:
- smoothingApplied=false;
- retrospectiveRelabelApplied=false;
- transitionPolicyApplied=false;
- transitionThresholdApplied=false.

No HMM smoothed state or ex-post boundary correction is permitted.

A transition receipt describes what changed between two frozen decision-time vectors.
It does not claim that the transition was tradable or that acting on it improves returns.

## L3 promotion-gate review

Per `research/D16_D18_PROMOTION_GATE_V0_1.md`:

1. executable/tested builder: PASS.
2. source/version/availableAt provenance: PASS via immutable upstream vector receipts + decision clocks.
3. replay test: PASS.
4. UNKNOWN fail-closed: PASS.
5. no current-data historical backfill: PASS; no source reconstruction occurs.
6. source coverage audited: PASS through D18-01 producer coverage/UNKNOWN semantics.

## Why not L4

L4 requires prospective/OOS evidence across more than one relevant transition episode.

Still missing:
- persisted prospective transition occupancy;
- frozen strategy + transition policy versions;
- correct next-session policy timing;
- paired static/exposure-matched controls;
- complete outcomes;
- transaction costs and missed-opportunity accounting;
- multiple independent transition episodes.

Therefore D18-11 stops at L3.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next

1. Persist context-only prospective transition receipts.
2. Measure transition frequency and UNKNOWN rate before defining any transition policy.
3. Do not choose hysteresis/minimum-duration thresholds from strategy returns.
4. D18-13/14 need a dedicated regime-outcome attribution / walk-forward join before L3.
