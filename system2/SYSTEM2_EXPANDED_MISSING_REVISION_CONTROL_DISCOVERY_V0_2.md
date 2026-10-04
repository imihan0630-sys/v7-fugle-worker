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

## 2026-10-04 physical expanded-discovery acceptance

PR #518 merged as `5cbe141dd0b0091b0bb4f23d5a27b22696c921d4`.

Checks:
- Expanded Missing Revision Control Discovery Readonly `37186550916`: PASS.
- System2 Research CI `37186550796`: PASS.
- V8 Regression `37186550821`: PASS.

Expanded official-event-derived search:
- TWSE par-value: 2020..2026; 9 unique official candidates queried; 0 positive revision-chain candidates.
- TPEx ex-right/dividend: 2026; 621 unique official candidates existed, bounded first 24 queried; 0 positive revision-chain candidates.
- TPEx par-value: 2020..2026; 11 unique official candidates queried; 1 positive revision-chain candidate.

Accepted positive:
- 6548 長科* / TPEx par-value / official effective date 2022-09-05.
- Three exact-stem original -> correction chains were observed.
- The promotion path selected the direct換發基準日 chain:
  - original 2022-08-05 17:17:38 / seqNo=2;
  - correction 2022-08-08 17:26:39 / seqNo=2.

Valid negative results remain for:
- TWSE par-value in the complete 2020..2026 official candidate set examined by this pass;
- the first bounded 24 TPEx ex-right/dividend 2026 candidates.

Discovery alone did not promote authority; promotion occurred in PR #520.
