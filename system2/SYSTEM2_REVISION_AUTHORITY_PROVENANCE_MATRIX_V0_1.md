# System 2 Revision Authority Provenance Matrix V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / FROZEN CONTROL AUTHORITY ROUTING
System 1 Formal Core: LOCKED

## Purpose

Join revision/cancellation evidence by the authority that actually owns each fact.

One source must not be treated as universal authority.

The frozen control matrix separates:

- **ISSUER** — MOPS/MOPSOV company disclosure, correction, withdrawal/cancellation disclosure;
- **REGULATOR** — FSC/SFB regulatory case status such as revocation/withdrawal approval;
- **EXCHANGE** — TWSE/TPEx operational/effective market state such as actual ex-right/ex-dividend or capital-reduction resume/reference.

## Frozen controls

### 2467 dividend correction
Required:
- MOPS issuer original + correction;
- TWSE actual ex-right/ex-dividend operational record for 2467.

### 1459 capital-reduction schedule correction
Required:
- MOPS issuer original + correction;
- TWSE capital-reduction resume/reference operational record for 1459.

### 2321 capital-reduction board-decision correction
Required:
- MOPS issuer original + correction.

The board-decision revision is an issuer fact. The matrix does not fabricate an exchange-stage requirement merely because an exchange stage may occur later.

### 1342 cash-capital-increase schedule correction
Required:
- MOPS issuer original + correction.

### 1342 cash-capital-increase cancellation
Required:
- MOPS issuer cancellation chain;
- direct SFB/FSC regulator record showing the 1342 cash-capital-increase case as revocation/cancellation.

## Physical probe

The read-only physical probe:

1. rechecks all five MOPS controls;
2. fetches TWSE historical actual-result ranges for 2026-01-01..2026-10-02;
3. requires 2467 to appear in the TWSE ex-right/dividend actual lane;
4. requires 1459 to appear in the TWSE capital-reduction actual lane;
5. reruns the official SFB/FSC annual-case probe;
6. requires a direct 1342 cash-capital-increase `廢止/撤銷` regulator row;
7. joins all evidence into the frozen authority routing matrix.

## Promotion semantics

If all five frozen controls pass:

`frozenAuthorityRoutingCoverageComplete=true`

may be emitted.

That means only:
- every frozen representative control is backed by the appropriate authority role;
- issuer/regulator/exchange facts were not collapsed into one provenance class.

It does **not** mean:
- bounded interval authority revision coverage is complete;
- MOPS public availability latency is certified;
- exact knownAt is certified;
- all six official continuity lanes have complete revision history;
- NO_EVENT may be claimed;
- technical continuity is certified.

Therefore these remain false:
- `authorityRevisionCoverageComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `technicalContinuityCertified=false`;
- all selection/push/capital/order/System1 authority.

## Next gate

After this matrix:
1. define the bounded-market supplemental revision channel receipt using the now-separated authority roles;
2. keep exact knownAt blocked until genuine prospective MOPS availability observations exist;
3. integrate exchange-complete suspension/resumption coverage;
4. only then reconsider revision/session/technical continuity completeness.

## 2026-10-04 physical cross-authority matrix acceptance

PR #483 merged as `4c8ecd468632d51e25e93beab2eb9e50ef5d29a6`.

Physical checks:
- Revision Authority Provenance Matrix Readonly `37180661644`: PASS.
- System2 Research CI `37180661631`: PASS.
- V8 Regression `37180661579`: PASS.
- state=`FROZEN_AUTHORITY_CONTROL_MATRIX_OBSERVED`.
- frozenControlCount=5 / frozenControlPassCount=5.
- `frozenAuthorityRoutingCoverageComplete=true`.

Representative authority chains verified:
- 2467 dividend correction:
  - MOPS issuer revision chain PASS;
  - TWSE actual ex-right/dividend operational evidence matched 2467, effective date 2026-06-18.
- 1459 capital-reduction schedule correction:
  - MOPS issuer revision chain PASS;
  - TWSE capital-reduction operational evidence matched 1459, effective date 2026-08-03.
- 2321 capital-reduction board-decision correction:
  - MOPS issuer authority PASS; no fabricated exchange-stage requirement.
- 1342 cash-capital-increase schedule correction:
  - MOPS issuer authority PASS.
- 1342 cash-capital-increase cancellation:
  - MOPS issuer cancellation chain PASS;
  - SFB/FSC direct regulator `廢止/撤銷` evidence PASS.

This validates authority routing for the frozen representative controls only.

Still false:
- `authorityRevisionCoverageComplete=false`;
- `publicAvailabilityLatencyCertified=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `suspensionCoverageComplete=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`;
- all trading authority flags.
