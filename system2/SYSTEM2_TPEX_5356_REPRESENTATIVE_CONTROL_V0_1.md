# System 2 TPEx 5356 Ex-Dividend Representative Control V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / REPRESENTATIVE CONTROL PROMOTION
System 1 Formal Core: LOCKED

## Frozen issuer chain

Symbol: 5356 協益  
MOPS: ROC115 / month 6  
Subject family: `除息基準日及發放日`

Physically validated source rows:
- original: 2026-06-02 17:51:32 / seqNo=1;
- correction: 2026-06-18 18:55:49 / seqNo=2;
- second correction: 2026-06-18 19:17:38 / seqNo=3.

## Frozen exchange join

Official exchange source:
`TPEX_EX_RIGHT_DIVIDEND_ACTUAL`

Required exact event:
- symbol 5356;
- effective date 2026-07-08.

## Version promotion

This change creates:
- MOPS revision control matrix V0.5;
- authority provenance matrix V0.4;
- supplemental revision provenance receipt V0.4.

Expected physical state after PASS:
- MOPS controls 8/8;
- source-clock controls 8/8;
- authority controls 8/8;
- representative exchange lane count 5;
- representativeAuthorityReadyCount 5/6.

Only representative-routing gap remaining:
- TWSE par-value change.

## Boundary

5/6 representative breadth is not full revision completeness.

Still false:
- public availability latency certification;
- exact knownAt certification;
- authorityRevisionCoverageComplete;
- bounded revision-history completeness;
- revisionCoverageComplete;
- NO_EVENT;
- technical continuity;
- all trading authority.
