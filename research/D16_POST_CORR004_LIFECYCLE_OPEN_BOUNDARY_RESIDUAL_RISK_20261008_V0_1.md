# D16 Post-CORR004 Lifecycle Open-Boundary Residual Risk 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / DISTINCT_POST_CORR004_RESIDUAL_RISK_CONFIRMED / FIRST_NCT01_NONBLOCKING_IF_CLEAN_WITNESS
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Separate two claims that must not be conflated:

1. CORR-004 original defect:
   a long-listed symbol could keep nominal 60-row readiness while one required recent eligible session was missing and an older row substituted.

2. Residual lifecycle admissibility risk:
   an observed STOP with no positively certified RESUME/termination/active-through proof can still normalize to an open interval through `coverageTo`, and that interval can delete expected sessions.

The first claim is now physically repaired and independently closed.

The second claim remains present in current runtime and was not exercised by the CORR-004 physical witness.

## 1. CORR-004 closure is valid for its original scope

Canonical physical readback:
- PR #817 merged as `625ea3d0bda28fcd06df4c3163a054573c3982f7`;
- run `37639310919` succeeded;
- exact-session reconciliation enabled;
- pre-fix reference historyReadyCount = 51;
- post-fix exactSessionHistoryReadyCount = 46;
- 1101/TWSE is a real exact-session-ready positive witness;
- 1213/1218 are real fail-closed mismatch examples;
- rowsWritten = 0;
- continuityReadyCount = 0.

Therefore the original count-only stale-substitution defect is genuinely repaired.

Room11 does not reopen CORR-004.

## 2. Residual runtime fact

Current:
`system2/runtime/twse_regulatory_lifecycle_source_v0_1.mjs`

still contains this normalization behavior:

- STOP / SHARE_CONVERSION_STOP opens an interval;
- RESUME or DELISTING closes it;
- if the interval is still open at the end of event processing and `open.start <= coverageTo`, the normalizer emits:
  - `suspendedFrom = open.start`;
  - `resumedOn = null`;
  - `coverageTo = query end`.

At the same time the source explicitly states:
`absenceCertifiesNoEvent=false`.

Therefore:
"no RESUME observed"
is not equivalent to:
"the suspension is positively certified active through coverageTo".

## 3. Why this is a distinct false-readiness path

Consider a symbol with:
- a genuine STOP event observed;
- a genuine later RESUME event that is missing from the retrieved/detail-complete evidence set;
- one or more resumed trading sessions absent from D1 history;
- older pre-gap rows available.

Before lifecycle exclusion:
the exact-session reconciler correctly sees missing expected resumed sessions.

If an uncertified open STOP interval is allowed to delete those expected resumed sessions through coverageTo:
- the missing dates disappear from the expected set;
- older rows can again match the now-shortened expected set;
- historyReady can be manufactured through an exception path.

This is not the original count-only defect.
It is a boundary-authority defect in the exception set used by exact-session reconciliation.

## 4. Why CORR-004 physical PASS did not test this path

Physical CORR-004 run recorded:
- lifecycleQueriedSymbolCount = 2;
- lifecycleIntervalCount = 0;
- lifecycleState = OBSERVED_POSITIVE_EVENTS_UNCERTIFIED_ABSENCE.

Thus the real run proved:
an empty/uncertified lifecycle lookup did not wash gaps into PASS.

It did not prove:
an observed positive STOP with an incomplete RESUME boundary cannot wash gaps into PASS.

The independent verification's lifecycle PASS is therefore valid only for:
- unit/integration positive closed-interval semantics;
- physical empty/no-interval fail-closed behavior.

It is not a physical proof of open-boundary admissibility.

## 5. Current first-NC-T01 consequence

00 has already identified a separate bounded negative-suspension path using TWTAWU for the exact replay interval.

For the first narrow TWSE witness:
- exact-session readiness is already physically proven;
- DATA_LANE must prove bounded suspension completeness for that exact interval;
- only then may the shared continuity certifier produce CLEAR_NO_ACTION.

Therefore this residual lifecycle issue need not block the first NC-T01 if:
- the chosen witness has no lifecycle exclusion;
- bounded suspension completeness is independently proven;
- the continuity receipt is hash-bound to the exact replay window.

But it remains a general history-reader correctness risk for future symbols/runs.

## 6. Frozen lifecycle interval admissibility states

An interval may remove expected sessions only under one of:

1. `CLOSED_POSITIVE_BOUNDARIES_CERTIFIED`
   - STOP and RESUME/termination boundaries are positively certified.

2. `OPEN_ACTIVE_THROUGH_DATE_CERTIFIED`
   - STOP exists and a separate authoritative source proves suspension remains active through the target date.

Otherwise:
`NOT_ADMISSIBLE_BOUNDARY_INCOMPLETE`.

For this state:
- preserve the lifecycle evidence descriptively;
- do not delete expected sessions;
- keep the affected symbol fail-closed / incomplete.

## 7. Required adversarial regression

A future correction must include at least:

### LB-T01 — STOP + missing RESUME + missing resumed history
Expected:
- open interval is NOT admissible;
- resumed sessions remain in expected set;
- historyReady=false.

### LB-T02 — STOP + certified RESUME
Expected:
- closed interval admissible;
- sessions inside half-open suspension interval are removed.

### LB-T03 — STOP + certified active-through target date
Expected:
- open interval admissible only through the certified bound.

### LB-T04 — partial detail transport
Expected:
- partial source state cannot certify active-through.

### LB-T05 — post-STOP observed trading rows
Expected:
- an open suspension claim conflicting with observed later trading must fail closed / require boundary resolution.

### LB-T06 — exact-session mismatch before/after lifecycle
Expected:
- lifecycle exclusion may reduce expected sessions only when each removed date is covered by an admissible interval.

## 8. Provenance requirement

Every lifecycle exclusion used in expected-session construction must bind:
- symbol;
- market;
- intervalDisposition;
- suspendedFrom;
- resumedOn or activeThroughDate;
- source event identities/hashes;
- source completeness state;
- decision-time admissibility state;
- boundaryAuthorityHash.

ExpectedSessionHash must be downstream of these exact admissible exclusions.

A bare `coverageTo` parameter is not boundary authority.

## 9. Governance recommendation

This is a new post-CORR004 residual risk, not grounds to falsify CORR-004 closure.

Recommended routing:
- 00｜研究／稽核總控室 decides whether to open a separate correction ticket;
- DATA_LANE / System2 history-reader owner implements if routed;
- Room11 D16 remains research/validation owner for the acceptance semantics.

No direct runtime modification is performed by Room11.

## 10. Maturity impact

No maturity promotion.

D16-11 remains L3/60 because:
- exact-session physical provenance is now materially stronger;
- but source-clock divergence, continuity certification, lifecycle-boundary authority and real NC-T01 remain incomplete.

## Exact next

1. Keep CORR-004 closed for its original defect.
2. Route this residual lifecycle-boundary risk separately rather than reopening CORR-004.
3. Validate CORR-005 hidden-fallback hardening.
4. Validate bounded TWTAWU suspension completeness and first real CLEAR_NO_ACTION receipt.
5. Then validate the physical NC-T01 receipt/hash chain.
