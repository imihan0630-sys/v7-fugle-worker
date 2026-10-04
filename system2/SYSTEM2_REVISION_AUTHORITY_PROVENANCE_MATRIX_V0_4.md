# System 2 Revision Authority Provenance Matrix V0.4

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / PHYSICALLY VERIFIED
System 1 Formal Core: LOCKED

## Version purpose

V0.4 preserves the V0.3 authority matrix and adds the 5356 TPEx ex-right/dividend authority join.

5356 authority chain:
- issuer role: MOPS original + two correction rows;
- exchange role: `TPEX_EX_RIGHT_DIVIDEND_ACTUAL`;
- exact symbol: 5356;
- exact effective date: 2026-07-08.

## Physical acceptance

PR #535 / `d82b757f0c81e44750053b24ad9ba47a92d3af7a`.

Physical result:
- frozenControlCount=8;
- frozenControlPassCount=8;
- `frozenAuthorityRoutingCoverageComplete=true`;
- representativeExchangeLaneCount=5.

Representative exchange lanes now observed:
1. TWSE ex-right/dividend;
2. TWSE capital reduction;
3. TPEx ex-right/dividend;
4. TPEx capital reduction;
5. TPEx par-value change.

Only representative-routing gap:
- `TWSE_PAR_VALUE_CHANGE_REFERENCE`.

## Boundary

Still false:
- `authorityRevisionCoverageComplete`;
- `publicAvailabilityLatencyCertified`;
- `knownAtVersionClockCertified`;
- `revisionCoverageComplete`;
- session/technical continuity;
- all trading authority.
