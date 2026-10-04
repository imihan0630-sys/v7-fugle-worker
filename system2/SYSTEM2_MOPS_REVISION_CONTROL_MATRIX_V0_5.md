# System 2 MOPS Revision Control Matrix V0.5

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / PHYSICALLY VERIFIED
System 1 Formal Core: LOCKED

## Version purpose

V0.5 preserves all V0.4 controls and adds the TPEx ex-right/dividend representative control for 5356 協益.

New control:
- id: `TPEX_EX_RIGHT_DIVIDEND_CORRECTION_5356_2026`;
- exchange: TPEx;
- lane: `TPEX_EX_RIGHT_DIVIDEND_ACTUAL`;
- action family: EX_RIGHT_DIVIDEND;
- MOPS ROC115 / month 6;
- subject family: `除息基準日及發放日`;
- official effective date: 2026-07-08.

## Physical evidence

PR #535 / merge `d82b757f0c81e44750053b24ad9ba47a92d3af7a`.

Physical workflow:
- System2 TPEx 5356 Representative Control Readonly `37197137413`: PASS.
- System2 Research CI `37197137461`: PASS.
- V8 Regression `37197137463`: PASS.

Result:
- controlCount=8;
- passCount=8;
- source-reported clock controls=8/8 PASS;
- `knownAtVersionClockCertified=false`.

5356 issuer chain:
- original: 2026-06-02 17:51:32 / seqNo=1;
- correction: 2026-06-18 18:55:49 / seqNo=2;
- second correction: 2026-06-18 19:17:38 / seqNo=3.

## Boundary

This matrix does not certify bounded-market revision completeness, exact public availability, exact knownAt, NO_EVENT, technical continuity, selection authority, live push, capital or order authority.
