# System 2 TPEx 5356 Dividend Revision-Control Validation V0.1

Updated: 2026-10-04 Asia/Taipei  
Status: RESEARCH_ONLY / TARGETED VALIDATION  
System 1 Formal Core: LOCKED

## Candidate

- 5356 協益
- market: TPEx
- MOPS ROC115 / month 6
- subject family: `除息基準日及發放日`
- expected TPEx actual ex-dividend date: 2026-07-08

## Acceptance

The candidate is valid only if:
- MOPS history contains at least one original plus one correction/cancellation in the subject family;
- distinct MOPS version keys >= 2;
- official `TPEX_EX_RIGHT_DIVIDEND_ACTUAL` contains symbol 5356 with exact effective date 2026-07-08.

Validation does not itself freeze or promote the control.

## Boundary

This probe cannot certify exact public availableAt/knownAt, bounded revision completeness, NO_EVENT, technical continuity or any trading authority.
