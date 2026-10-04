# System 2 Final-Two Representative Revision Control Discovery V0.3

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY
System 1 Formal Core: LOCKED

## Purpose

Continue from the physically verified 4/6 representative-authority milestone.

Only two representative-routing gaps remain:

1. TWSE par-value change;
2. TPEx ex-right/dividend.

V0.3 changes the search design rather than weakening the evidence rule.

## TWSE par-value lane

The complete 2020..2026 official candidate set was already negative in PR #518.

V0.3 extends the official-event window backward to 2010..2019 and queries every unique symbol-year candidate returned by the supported official TWSE par-value endpoint.

A positive still requires an earlier original plus a later correction/cancellation in the same action family with exact or conservative normalized subject-stem compatibility.

## TPEx ex-right/dividend lane

PR #518 queried the first 24 chronologically ordered 2026 candidates and found no positive.

V0.3 avoids another chronology-prefix bias.

From the full deterministic 2026 official candidate list:
- the prior first 24 are skipped;
- 48 additional candidates are selected by evenly spaced deterministic stratification over the remaining year-wide candidate pool;
- each symbol-year is queried once from MOPSOV;
- reduction/share-exchange/par-value rows remain explicitly excluded.

This is bounded research, not a claim that all 2026 TPEx dividend issuers have been exhaustively checked.

## Acceptance

A positive discovery is only a promotion candidate.

It must still pass:
- exact issuer original/correction or cancellation chain review;
- exact exchange operational/effective event join;
- source-clock checks;
- versioned authority-matrix promotion.

A negative result remains valid and must not cause the chain criteria to be weakened.

## Authority boundary

Always false:
- representativeControlsFrozen;
- authorityRevisionCoverageComplete;
- publicAvailabilityLatencyCertified;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- noEventMayBeClaimed;
- technicalContinuityCertified;
- all trading authority.

## 2026-10-04 physical V0.3 acceptance

PR #528 merged as `a0b0fbb26a4038e1f986a106ef92422a946ecfd2`.

Checks:
- Final Two Representative Revision Control Discovery Readonly `37196151989`: PASS.
- System2 Research CI `37196151886`: PASS.
- V8 Regression `37196151868`: PASS.

Result:
- TWSE par-value 2010..2019 official endpoint returned 0 events / 0 candidates;
- prior TWSE par-value 2020..2026 complete official candidate set had already been negative;
- TPEx ex-right/dividend deterministic 48-candidate year-wide sample after the prior first 24 was also negative;
- positiveCandidateCount=0.

This negative result changed the research path:
- TWSE par-value should use alternate official issuer/regulator/exchange evidence discovery rather than repeating the same final-result candidate scan;
- TPEx ex-right/dividend moved to targeted correction-event discovery, which later found 5356.
