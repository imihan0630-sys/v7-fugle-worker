# System 2 Expanded Missing Revision Control Discovery V0.3

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY EXPANDED DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Continue the exact V0.2 discovery algorithm without changing the revision-chain acceptance rule.

After the physically verified 4/6 representative milestone, the remaining lanes are:

- TWSE par-value change;
- TPEx ex-right/dividend.

## Frozen search expansion

### TWSE par-value change

V0.2 already exhausted the official 2020..2026 candidate set and found no positive chain.

V0.3 adds official event years:
- 2017
- 2018
- 2019

All unique symbol-year candidates from those official events are eligible, bounded by cap 24.

### TPEx ex-right/dividend

V0.2 identified 621 unique 2026 official candidates and queried the deterministic first 24 after the existing V0.1 exclusions.

V0.3 preserves the same sorting/exclusion semantics and queries the deterministic next slice:
- offset = 24
- cap = 48
- therefore candidate positions 25 through 72 in that frozen ordering.

Previously screened symbols 8102 and 4207 remain excluded exactly as in V0.2.

## Methodology unchanged

The following are intentionally unchanged from V0.2:

- official-event-derived candidate selection;
- MOPSOV company-year `month=all` query;
- strict action-family filters;
- TPEx ex-right/dividend exclusion of reduction/share-exchange/par-value semantics;
- correction/cancellation hint requirement;
- earlier original-row requirement;
- conservative normalized subject-stem exact/containment match;
- distinct `date|time|seqNo` versions;
- negative results remain valid.

No rule is loosened merely to fill the remaining 2/6 matrix.

## Promotion boundary

A positive is still discovery only.

Promotion requires a separate versioned control that physically joins:
1. issuer original + correction/cancellation chain;
2. exact official exchange operational/effective event;
3. source-clock semantics;
4. unchanged downstream authority blockers.

## Authority boundary

Always false in discovery:
- representativeControlsFrozen;
- authorityRevisionCoverageComplete;
- publicAvailabilityLatencyCertified;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- NO_EVENT;
- technical continuity;
- all trading authority.
