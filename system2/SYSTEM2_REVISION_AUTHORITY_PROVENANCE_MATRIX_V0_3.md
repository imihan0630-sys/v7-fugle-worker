# System 2 Revision Authority Provenance Matrix V0.3

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / REPRESENTATIVE EXCHANGE LANES 4 OF 6
System 1 Formal Core: LOCKED

## Purpose

Version the cross-authority matrix after adding the physically verified 6548 TPEx par-value-change control.

V0.3 preserves all V0.2 controls and adds:

- issuer: 6548 MOPS original + correction chain
- exchange source: `TPEX_PAR_VALUE_CHANGE_REFERENCE`
- exact official effective date: 2022-09-05

## Physical acceptance

PR #520 / `53a9680acef1a667e8f05efc0f5387fd326d47a4`:

- frozenControlCount=7
- frozenControlPassCount=7
- `frozenAuthorityRoutingCoverageComplete=true`
- representativeExchangeLaneCount=4

Representative-ready exchange lanes:
1. TWSE ex-right/dividend
2. TWSE capital reduction
3. TPEx capital reduction
4. TPEx par-value change

Remaining representative-routing gaps:
1. TWSE par-value change
2. TPEx ex-right/dividend

## Boundary

Representative breadth is not bounded-market completeness.

Still false:
- authorityRevisionCoverageComplete
- publicAvailabilityLatencyCertified
- knownAtVersionClockCertified
- revisionCoverageComplete
- NO_EVENT
- session/technical continuity
- all trading authority
