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

## 2026-10-04 physical promotion acceptance

Candidate validation PR #533 merged as `f39de82fbbb34d360f01d9a28f25f732d6939278`.

Promotion PR #535 merged as `d82b757f0c81e44750053b24ad9ba47a92d3af7a`.

Physical promotion result:
- MOPS controls 8/8 PASS;
- source-reported clock controls 8/8 PASS;
- 5356 issuer chain = one original + two corrections / three distinct version keys;
- official TPEx ex-right/dividend event exact match = 5356 / 2026-07-08;
- authority controls 8/8 PASS;
- representative exchange lane count=5;
- supplemental receipt V0.4 representativeAuthorityReadyCount=5.

A prior candidate, 6184 大豐電, was rejected in closed unmerged PR #531 because it is TWSE-listed, not TPEx. That wrong-exchange false positive was not promoted.
