# System 2 TPEx 6184 Dividend Revision-Control Validation V0.1

Updated: 2026-10-04 Asia/Taipei  
Status: RESEARCH_ONLY / TARGETED VALIDATION  
System 1 Formal Core: LOCKED

## Purpose

Validate a targeted candidate for the remaining TPEx ex-right/dividend representative-authority gap.

Candidate:
- 6184 大豐電
- MOPS ROC113 / month 5
- subject family: `除息基準日及轉換公司債停止轉換期間`
- expected TPEx actual ex-dividend effective date: 2024-06-20

## Acceptance

Candidate is valid only if:
- official MOPS history is readable;
- at least one original row and one later correction/cancellation row exist in the subject family;
- at least two distinct date/time/sequence versions exist;
- official TPEx `TPEX_EX_RIGHT_DIVIDEND_ACTUAL` contains symbol 6184 with exact effective date 2024-06-20.

This probe does not freeze the representative control. Promotion requires a later versioned control/authority/receipt change.

## Boundaries

Always false:
- exact public availableAt / knownAt certification;
- bounded authority revision completeness;
- bounded revision-history completeness;
- revisionCoverageComplete;
- noEventMayBeClaimed;
- technical continuity;
- selection/push/capital/order authority.
