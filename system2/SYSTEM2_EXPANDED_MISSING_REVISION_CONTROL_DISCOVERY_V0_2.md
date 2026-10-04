# System 2 Expanded Missing Revision Control Discovery V0.2

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY EXPANDED DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Expand representative-control discovery for the three continuity lanes still missing after the physically verified 3/6 milestone:

- TWSE par-value change;
- TPEx ex-right/dividend;
- TPEx par-value change.

V0.1 already produced a valid negative result for the first frozen candidate set except for 3152 TPEx capital reduction, which was separately promoted. V0.2 widens evidence breadth without weakening the revision-chain acceptance rule.

## Candidate selection

Candidates are derived only from the already-supported official historical final-result endpoints.

### TWSE par-value change
Official events from 2020 through 2026-10-02.

### TPEx ex-right/dividend
Official 2026 events through 2026-10-02.

### TPEx par-value change
Official events from 2020 through 2026-10-02.

For each lane:
- deduplicate by symbol + event year;
- sort deterministically by official effective date then symbol;
- exclude symbols already physically screened in V0.1;
- query at most 24 candidates;
- query each candidate's MOPSOV company-year history once using `month=all`.

Selection depends only on official event chronology, never price or later trading performance.

## Revision-chain discovery

Rows must first pass a strict action-family filter.

For TPEx ex-right/dividend, rows containing reduction/share-exchange/par-value-change semantics are explicitly excluded.

A revision candidate requires:
- a correction/cancellation-hint row;
- an earlier original row;
- same action family;
- normalized subject stems either exact or conservative containment >=72%;
- distinct `date|time|seqNo` versions.

This remains discovery, not promotion.

Every positive chain must later be reviewed against the exact official operational event before becoming a representative control.

## Negative-result semantics

No positive chain is a valid research result.

A negative lane may require:
- another bounded official-event window;
- another year range;
- different official issuer/regulator evidence;
- a conclusion that revision events are too sparse for that lane to serve as a representative historical control.

The system must not lower revision-chain requirements merely to fill the 6/6 matrix.

## Authority boundary

Always false:
- representativeControlsFrozen;
- authorityRevisionCoverageComplete;
- publicAvailabilityLatencyCertified;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- NO_EVENT;
- technical continuity;
- all trading authority.
