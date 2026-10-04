# D03 MOPS Version Clock Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03 / shared TECHNICAL_CONTINUITY
Status: RESEARCH_ONLY / OUTCOME_BLIND / CLOCK_SEMANTICS_FROZEN
Formal Core: LOCKED

## Purpose

Prevent historical MOPS display timestamps from being silently promoted into causal `firstKnownAt` clocks.

Official Taiwan material-information records expose source-labeled speech/report date and time fields. Current TWSE disclosure rules require listed companies to input material information into the designated internet reporting system within specified deadlines and to update/supplement previously published material information promptly when later developments materially change.

These facts support a source-reported disclosure clock candidate.

They do **not**, by themselves, prove the earliest instant at which every archived row became publicly observable to the market.

## TI-564 — clock names are not interchangeable

Freeze the following meanings.

### sourceReportedAt

Constructed from the MOPS row's source-reported:
- spoke_date / 發言日期;
- spoke_time / 發言時間.

Semantics:
- official source-reported disclosure/speech timestamp candidate;
- preserves row/version chronology;
- not automatically first-known certified.

### capturedAt

Observer wall-clock timestamp when a research fetch completed.

Semantics:
- capture execution time;
- not publication time;
- must never be backdated to sourceReportedAt.

### firstObservedAt

Earliest successful append-only observer capture of the exact version identity:
- source host;
- stock code;
- sourceReportedAt;
- seqNo;
- normalized subject/content hash.

Semantics:
- prospective observer evidence;
- conservative upper bound on public availability;
- may be used as a no-lookahead research availability clock for prospectively observed versions.

### firstKnownAt

Promotion-grade causal clock.

Current rule:
- historical sourceReportedAt alone => `firstKnownAt=UNKNOWN`;
- prospective exact-version firstObservedAt may provide a conservative no-lookahead usable clock;
- any stronger backfilled firstKnownAt claim requires an authoritative source contract proving timestamp/publication semantics.

## TI-565 — correction chains preserve version identity

A later corrected/supplemental/cancellation row does not overwrite an earlier row.

Minimum version identity:
- sourceHost;
- stockCode;
- sourceReportedAt;
- seqNo;
- contentHash.

One event family may therefore contain:
- ORIGINAL;
- CORRECTION;
- SUPPLEMENT;
- CANCELLATION / REVOCATION.

The technical continuity resolver must evaluate the latest version that is causally usable at the decision clock.

It must not:
- rewrite the earlier row;
- assume the final row was known at the original timestamp;
- collapse all versions into one final-state record without chronology.

## TI-566 — historical replay rule

For a historical decision timestamp `T`:

1. Versions with certified causal availability `<=T` may be used.
2. Versions whose only clock is historical `sourceReportedAt` remain clock-uncertified unless an authoritative publication-time contract is later established.
3. A final corrected corporate-action state observed today must not be injected into an older decision as though it were known then.
4. If continuity depends on an uncertified historical version, state = `UNKNOWN/BLOCKED`, not PASS and not zero-event.

## TI-567 — prospective observer rule

For versions captured after this contract:

- store immutable raw/source hash;
- store sourceReportedAt separately;
- store capturedAt;
- first successful exact-version capture freezes firstObservedAt;
- same identity + same content => idempotent repeat;
- same identity + changed content => provenance conflict / source mutation;
- new sourceReportedAt or seqNo => new version, never overwrite.

Research may use `firstObservedAt` as a conservative availability clock because doing so can only delay use relative to the unknown true public-availability instant.

This provides a safe prospective path without pretending historical first-known certainty.

## TI-568 — current certification state

`SOURCE_REPORTED_CLOCK_SEMANTICS = DEFINED`

`SOURCE_REPORTED_AT = OFFICIAL_FIELD_CANDIDATE`

`HISTORICAL_FIRST_KNOWN_AT = UNKNOWN`

`PROSPECTIVE_FIRST_OBSERVED_AT = SAFE_CONSERVATIVE_RESEARCH_CLOCK`

`KNOWN_AT_VERSION_CLOCK_CERTIFIED = false`

`REVISION_COVERAGE_COMPLETE = false`

`TECHNICAL_CONTINUITY_CERTIFIED = false`

No maturity promotion follows from clock naming alone.

## Next gate

1. Physically observe new MOPS/OpenAPI versions prospectively with append-only exact-version receipts.
2. Reconcile MOPS row sourceReportedAt against the official daily major-information dataset for the same row.
3. Measure firstObservedAt - sourceReportedAt lag without using stock outcomes.
4. Confirm correction rows preserve independent sourceReportedAt/seqNo chronology.
5. Only after repeated prospective agreement may a stronger version-clock certification be proposed.
6. Historical rows without such certification remain conservative UNKNOWN for causal replay.

Formal Core remains LOCKED.
