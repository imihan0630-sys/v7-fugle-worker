# System 2 S2-07 Eight-Lane Market-Wide Source Cut V1.5

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE / shared TECHNICAL_CONTINUITY owner  
Status: RESEARCH_ONLY / PHYSICAL_SOURCE_CUT_CANDIDATE  
Formal Core: LOCKED  
Scheduler: NOT ADDED  
Trading authority: NONE

## Purpose

Continue from the physically accepted V1.4.1 identity-domain correction by implementing the first genuine dual-market eight-lane source snapshot required by the shared pre-parent continuity contract.

V1.5 closes only the **market-wide source-lane snapshot** layer. It does not claim that the complete MOPS exact-version population has already been prospectively observed, and it does not certify noRevisionGapThroughCut, symbol-session completeness or TECHNICAL_CONTINUITY.

## Frozen eight-lane set

Historical actual-result range lanes:

1. TWSE_EX_RIGHT_DIVIDEND_ACTUAL
2. TWSE_CAPITAL_REDUCTION_REFERENCE
3. TWSE_PAR_VALUE_CHANGE_REFERENCE
4. TPEX_EX_RIGHT_DIVIDEND_ACTUAL
5. TPEX_CAPITAL_REDUCTION_REFERENCE
6. TPEX_PAR_VALUE_CHANGE_REFERENCE

Current daily material-information snapshot lanes:

7. TWSE_DAILY_MATERIAL_INFORMATION
8. TPEX_DAILY_MATERIAL_INFORMATION

The six historical lanes require exact response-range identity. The two daily disclosure feeds are current whole-endpoint snapshots and remain separate from MOPS historical/version identity.

## Readiness rules

A V1.5 source cut is READY only when:

- the exact frozen set contains eight unique lanes and no missing/replaced identity;
- four lanes are TWSE and four are TPEX;
- every lane is observed no later than the evidence cutoff;
- every lane has a 64-hex payload hash;
- parser and query completeness are true;
- no lane is truncated;
- each historical range lane has responseRangeVerified=true.

The physical probe uses only public official endpoints and retries transient reads before failing closed.

## Identity boundary

V1.5 does not merge source-lane identity with either:

- MOPS disclosure-version identity from V1.4.1; or
- official reference-row stable identity from V1.3.

The source-lane manifest proves only that the required whole-source snapshots were captured and hashed by the cutoff.

## Physical execution

The dedicated workflow:

`.github/workflows/system2-s2-07-eight-lane-market-wide-source-cut-v1-5-readonly.yml`

runs:

1. deterministic contract tests;
2. live read-only capture of all eight official lanes;
3. exact range/parser/hash/cutoff validation;
4. System1/no-mutation guards;
5. artifact upload of the physical receipt.

No D1/R2 write, Worker deploy, Cron, notification, selection or order path is introduced.

## Remaining gates after V1.5

Even when V1.5 is READY, all of the following remain false until separately proven:

- expectedMopsKeysetComplete;
- noRevisionGapThroughCut;
- preParentEvidenceCutReady;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- selection/final-selection/push/capital/order authority.

## Exact continuation

After a successful physical V1.5 capture:

1. prospectively capture the MOPS exact-version population required by the frozen event set;
2. freeze the complete expected MOPS version-key set before the parent cutoff;
3. bind the V1.5 source-lane manifest and V1.4.1 MOPS exact versions into one pre-parent evidence cut;
4. after the parent, run bounded-complete MOPS reconciliation;
5. only after noRevisionGapThroughCut passes may symbol-session and technical-continuity receipts bind to a genuine parent generation.
