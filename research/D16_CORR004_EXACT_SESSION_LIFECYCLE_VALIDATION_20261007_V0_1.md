# D16 CORR-004 Exact-Session + Lifecycle Admissibility Validation 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / ADVERSARIAL_ACCEPTANCE_DELTA_FROZEN / ENGINEERING_FIX_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Correction: S2-CORR-20261007-004
Formal Core impact: NONE

## Purpose

Validate the statistical admissibility boundary for System2 Daily Shadow history readiness.

The defect is not merely "one missing row".

A 60-observation rolling window can still contain 60 rows while missing one required recent eligible trading session and substituting one older observation. That silently changes the time support of MA60 / ret60 / other rolling features while preserving the nominal row count.

For D16 this is a PIT, target-support and dependence problem.

## Core admissibility rule

For every symbol / decision date / lookback:

`HISTORY_READY`

requires exact equality between:
1. the expected eligible symbol-session set;
2. the observed selected PIT symbol-session set.

Count equality is necessary but not sufficient.

The expected set must be constructed from:
- official market trading dates;
- PIT-safe listing membership;
- certified symbol-local no-trading lifecycle intervals.

No older observed date may replace a missing expected recent date.

## Why stale substitution is statistically material

Replacing a missing recent session with an older session changes:
- the effective lag structure;
- the calendar span of rolling returns/averages;
- the information set represented by the feature;
- common support across symbols and dates;
- comparability between strategy runs.

This can induce apparent smoothing or altered serial dependence even when the nominal observation count is unchanged.

Classic nonsynchronous-trading research shows that infrequent/stale observation timing changes return variances and autocorrelation/cross-autorrelation properties. Missing-observation research likewise warns that naive handling can yield inconsistent time-series inference.

Therefore exact session identity is part of the estimand, not metadata decoration.

## Current PR #817 positive findings

At audited head `43784e500f678be6ee95710822fdafd2af50ac50`:

- history reader moves from count-based long-listed readiness to exact expected-session reconciliation;
- expected and observed session hashes are emitted;
- missing and unexpected sessions are explicit symbol-local blockers;
- `EXPECTED_SESSION_HASH_MISMATCH` binds the factor-load read path to the probed date set;
- clean long-listed exact-window fixture passes;
- long-listed missing-recent + older-substitution fixture fails closed;
- new-listing short legitimate window remains supported;
- certified lifecycle no-trading interval can remove a truly ineligible market session;
- mixed-universe symbol-local incompleteness remains symbol-local;
- System2 Research CI, V8 Regression and Stage-1 assessor-policy checks passed at that PR head.

These are engineering-candidate facts only.
Merged-main physical readback is still required.

## New Room11 lifecycle adversarial gap

The TWSE lifecycle source correctly states:

`absenceCertifiesNoEvent=false`.

However the interval normalizer can create:

`suspendedFrom = STOP`
`resumedOn = null`
`coverageTo = end of queried window`

when a positive STOP event exists but no positive RESUME is present.

This open-ended interval is not automatically admissible for exact-session exclusion.

### Why

There are at least three states:

1. CERTIFIED_STILL_SUSPENDED
   - positive evidence proves the stop remains active through the relevant date.

2. CERTIFIED_RESUME_BOUNDARY
   - positive RESUME / termination evidence closes the interval.

3. RESUME_STATUS_UNKNOWN
   - STOP is observed, but source completeness / later resume evidence is not proven.

Only states 1 or 2 may remove expected symbol sessions.

State 3 must remain fail-closed.

### Failure mode

Suppose:
- STOP is correctly observed;
- RESUME exists in reality but its detail fetch is missing/partial;
- D1 history is also missing resumed-session bars.

If the STOP interval is extended to `coverageTo` merely because no RESUME was observed, those missing resumed sessions can disappear from the expected set.

Older rows may then again satisfy exact observed-vs-expected equality.

This recreates CORR-004 through the lifecycle exception path.

## Frozen acceptance addition

A lifecycle interval may alter the expected eligible-session set only if its boundary authority is explicit.

Required per interval:
- symbol;
- market;
- stop effective date;
- close/resume effective date OR active-through proof;
- source event identities/hashes;
- source completeness state;
- decision-time admissibility / known-at state;
- intervalDisposition.

Allowed intervalDisposition:
- `CLOSED_POSITIVE_BOUNDARIES_CERTIFIED`;
- `OPEN_ACTIVE_THROUGH_DATE_CERTIFIED`;
- `NOT_ADMISSIBLE_BOUNDARY_INCOMPLETE`.

If intervalDisposition is `NOT_ADMISSIBLE_BOUNDARY_INCOMPLETE`:
the interval may remain descriptive evidence but MUST NOT remove sessions from the expected history set.

## Mandatory adversarial cases

### T1 long-listed stale substitution

Expected 60 eligible sessions.
One recent expected session missing.
One older row substitutes.

Expected:
- historyReady=false;
- evaluationInputReady=false;
- missingExpectedSessionCount=1;
- unexpectedSessionCount=1.

### T2 clean exact window

Expected set == observed set.

Expected:
- historyReady=true if all other PIT/revision gates pass.

### T3 certified closed suspension

Positive STOP + positive RESUME define a closed interval.
Sessions inside the half-open interval are removed from expected eligible sessions.

Expected:
- exact reconciliation may pass.

### T4 incomplete open STOP

Positive STOP exists.
No certified RESUME boundary and no certified active-through-date state.

Expected:
- open interval NOT admissible for deleting expected sessions;
- exact history readiness remains UNKNOWN/INCOMPLETE if the disputed sessions are missing.

### T5 partial source + missing resumed bars

Lifecycle source partial.
Open STOP is present.
Resumed-session D1 bars are missing.

Expected:
- must NOT recover historyReady by extending STOP to coverageTo.

### T6 positive post-stop observed bars

If observed OHLC rows exist after an open STOP interval:
they must appear as unexpected sessions unless a positive RESUME/active-state boundary resolves the lifecycle state.

No silent coercion.

### T7 TPEx parity absent

TWSE lifecycle semantics may not be copied to TPEx.

Unresolved TPEx lifecycle gap remains symbol-local INCOMPLETE.

### T8 exact date-set load binding

After probe:
`expectedSessionHash`
must be recomputed against the exact dates loaded for factor construction.

Hash mismatch => fail closed.

### T9 source-row/revision lineage remains separate

Date-set equality proves temporal support only.

It does NOT prove that the same revisions/source rows were consumed.

NC-T01 must separately bind:
- replay hash;
- sourceHistoryHash;
- continuity receipt hash;
- factor snapshot hash;
- orchestration hash;
- final receipt hash.

### T10 no whole-universe veto

A symbol-local session defect must not automatically block unrelated symbols whose exact eligible windows are proven.

Denominators must retain:
- currentUniverseN;
- exactSessionReadyN;
- lifecycleBoundaryUnknownN;
- continuityReadyN;
- evaluationInputEligibleN.

## D16 implications

### D16-01 PIT temporal consistency

Exact eligible session-set identity is a prerequisite for a rolling feature to be called PIT-valid.

Row count alone is insufficient.

### D16-03 OOS / replay comparability

Two runs with different exact lookback date sets are different inputs even if both say "60 sessions".

They cannot be treated as identical parent evidence.

### D16-06 dependence

Stale/non-synchronous observations can alter serial dependence.
Dependence estimates must be computed on admitted exact-session rows, not on stale-substituted windows.

### D16-09 coverage / zero-pick

A symbol excluded for missing expected sessions is:
`DATA_INCOMPLETE`,
not
`NATURAL_ZERO_PICK`.

Lifecycle-boundary uncertainty is also not a zero pick.

### D16-11 provenance

Expected-session hash is necessary but not sufficient.
Source-row/revision identity and lifecycle-boundary authority remain separate provenance dimensions.

### SDA-022 / NC-T01

S22-T13 cannot pass merely because one symbol has count-ready history.

The physical witness needs:
- exact expected-session reconciliation;
- admissible lifecycle boundaries;
- replay-window hash binding;
- continuity receipt binding;
- real strategy execution.

## PR #817 disposition from Room11

Current research-owner verdict:

`DIRECTIONALLY_ACCEPTABLE / CORE_STALE_SUBSTITUTION_FIX_PRESENT / LIFECYCLE_OPEN_INTERVAL_ADVERSARIAL_GAP_REQUIRES_EXPLICIT_FAIL_CLOSED_RULE / PHYSICAL_MERGED_MAIN_EVIDENCE_PENDING`.

This is not a rejection of PR #817.

It is an acceptance refinement before CORR-004 can become promotion-grade D16 evidence.

## Maturity decision

No maturity change.

Reason:
- engineering candidate exists;
- CI is green at candidate head;
- no merged-main physical exact-session witness yet;
- lifecycle open-boundary adversarial case is not yet proven fail-closed;
- no economic/OOS result exists.

## Exact next continuation

1. Observe refreshed/merged PR #817.
2. Require merged-main read-only physical preflight with rowsWritten=0.
3. Verify at least one TWSE exact-session witness.
4. Verify incomplete open STOP cannot delete sessions unless active-through/resume boundary is certified.
5. After CORR-004 physical acceptance, regenerate System2 policy fingerprints against the new history-reader blob.
6. Then proceed to hash-bound CLEAR_NO_ACTION continuity and physical NC-T01.
