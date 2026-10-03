# D02 continuity inheritance readiness V0.1
Updated: 2026-10-03 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / SCHEMA_READINESS_ONLY
PVE cursor: 239
Formal Core: LOCKED

Purpose: map owner-lane fields that D02 may inherit by immutable reference versus D02-owned fields that must be persisted with the observation. No runtime wiring, outcome inspection, historical Shadow fabrication, or maturity promotion.

Corporate Actions inheritance:
- inherit receipt identity/version, event family, knownAt, effective session, verified unit factor, denominator semantic space/knownAt, revision lineage.
- derive D02 unitScaleState, supplyBreakPresent, rawActivityEligible, comparableParticipationEligible, post-break/reset comparable-session counts.
- semantic contract and bounded mechanics are ready; complete bounded dual-exchange denominator archive and prospective immutable denominator collector are not ready. Runtime inheritance is not compliance-proven.

Symbol-session / Pattern inheritance:
- inherit official session identity, verified suspension/non-session receipt and provenance.
- for D02-09 inherit confirmed pivot identity, pivotAt, confirmedAt, swing scale, Pattern spec version and parent lineage.
- confirmed-pivot PIT semantics and bounded suspension witnesses are research-ready; full production symbol-session completeness remains partial.

D02-owned persisted fields:
- symbol, marketDate/slot, source, sourceFetchedAt, featureKnownAt, volumeUnit/value, oddLotCoverage, baselineAsOfDate.
- exact comparable-session set or deterministic hash, comparableSessionCount, missingExpectedSessionCount.
- pvDailyRvol20 and signedVolumeBalance20 values plus eligibility/status.
- continuityJoinStatus, unknownReasons, and exact owner receipt IDs/versions consumed at decision time.

Fail-closed join:
1. observation source/knownAt provenance must be immutable;
2. expected symbol-session set must be verified;
3. required owner receipts must be known by feature cutoff;
4. UNIT_SCALE must be bridge-verified or reset-clean;
5. SUPPLY_CHANGE interpretation must explicitly choose RAW_ACTIVITY or COMPARABLE_PARTICIPATION;
6. expected source sessions cannot be silently missing/replaced;
7. consumed owner receipt versions are persisted;
8. missing owner evidence remains UNKNOWN/BLOCKED.

Anti-rewrite:
- D02 stores owner references, not copied authoritative histories.
- later owner corrections append a new versioned observation and never rewrite the old decision-time state.
- no later-known fact may backfill an earlier featureKnownAt.
- missing owner coverage never means NO_EVENT.
- valid Pattern pivot does not prove valid volume path.
- semantic readiness does not prove runtime availability.

Readiness: schema PASS; runtime compliance UNKNOWN/NOT_PROVEN; historical-to-prospective promotion FORBIDDEN; outcomes CLOSED.
D02-07 L2/40 unchanged; D02-09 L2/40 unchanged; D02 aggregate 48.3% unchanged.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.

Exact continuation: PVE-240 remains reserved for the first genuine completed post-repair market session and Gate 0-6 must pass before outcomes. Before that session, build a deterministic fail-closed join fixture covering clean owner receipts, missing CA receipt, late-known CA correction, verified suspension, missing expected source session, and valid pivot with blocked volume continuity. Research-only; no Worker/runtime wiring.
