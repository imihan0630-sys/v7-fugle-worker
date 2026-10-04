# System 2 Missing Revision Representative Control Discovery V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY_DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Search for real MOPS revision/cancellation chains that can become representative controls for the four continuity lanes still lacking them.

The discovery universe is frozen from already-verified official final-result events, not chosen after seeing MOPS revision results.

## Frozen candidate universe

- TWSE par-value change: 6949, official effective date 2026-09-07.
- TPEx ex-right/dividend: 8102 (2026-04-07), 4207 (2026-04-08).
- TPEx capital reduction: 5381 (2026-04-13), 3152 (2026-06-30).
- TPEx par-value change: 8937 (2026-04-13), 3086 (2026-04-20).

These candidates come from the previously verified official continuity parser physical run.

## Query design

For each frozen company:
- query MOPSOV once using ROC year 115 and `month=all`;
- parse the full company-year material-information history;
- filter only rows whose text matches the target action family;
- preserve date/time/seqNo and correction/cancellation hints;
- normalize the subject conservatively and search for exact-stem original + revision/cancellation chains.

The discovery does not assume that a candidate must have a revision.

For the ex-right/dividend lane, generic `基準日` alone is deliberately insufficient because capital-reduction / share-exchange disclosures also use that term. Ex-right/dividend matching requires dividend/right-specific language and explicitly excludes reduction/share-exchange/par-value-change rows.

## Positive discovery semantics

A row group becomes a **candidate** only when:
- same normalized subject stem has at least two rows;
- at least one row is original;
- at least one row is marked correction/cancellation;
- at least two distinct `date|time|seqNo` versions exist.

This is not yet a frozen representative control. Human/research review must confirm the semantic match to the official exchange event before promoting it.

## Negative result semantics

If no exact-stem chain is found for a lane, the workflow still passes as a valid negative discovery result.

The next step may:
- inspect near-match action rows;
- broaden the frozen candidate set using other official events;
- refine subject normalization without weakening revision evidence requirements.

It must not fabricate a representative control.

## Authority boundary

This discovery changes no completeness or trading authority.

Always false:
- representativeControlsFrozen;
- authorityRevisionCoverageComplete;
- publicAvailabilityLatencyCertified;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- noEventMayBeClaimed;
- technicalContinuityCertified;
- all selection/push/capital/order/System1 authority.
