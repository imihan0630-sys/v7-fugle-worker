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
