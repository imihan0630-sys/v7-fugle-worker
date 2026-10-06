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

## 2026-10-07 S2-07 Eight-Lane Market-Wide Source Cut V1.5 — PHYSICAL PASS

Authoritative implementation:
- PR #738 merged as `34455da7f47016ee149ffeaa963f798251e9fe3d`;
- dedicated `System2 S2-07 Eight-Lane Market-Wide Source Cut V1.5 Readonly` run `37545155428` / job `112547281624`: PASS;
- System2 Research CI run `37545155258`: PASS;
- physical artifact `11450381019`, digest `sha256:24f955376900366f929ec9739f42ea07fa6db1fc102ec5ce7ae7f00a265e6157`;
- V8 Regression `37545155314` reproduced only the already documented SDA-016 stale assertion and did not implicate any V1.5/System2 file.

Physical source cut:
- interval = 2026-04-05..2026-10-07;
- evidenceCutoffAt = `2026-10-06T23:12:23.799Z` (2026-10-07 07:12:23.799 Asia/Taipei);
- state = `EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_READY`;
- sourceCutId = `S2-8LANE:55289262efdd48b2004494d86979873207e256ef645bea2a5d358b9fafed606d`;
- sourceLaneManifestHash = `1e8e4db2699a0e214123087c08ce390af85c547be71229b53ff6ea552f57b863`;
- 8/8 lanes eligible; TWSE=4 / TPEx=4; blockers=[].

Frozen lane results:
- TWSE ex-right/dividend actual: 1,131 rows / 836 ordinary symbols / exact range PASS;
- TWSE capital-reduction reference: 10 / 10 / exact range PASS;
- TWSE par-value-change reference: 1 / 1 / exact range PASS;
- TPEx ex-right/dividend actual: 936 / 614 / exact range PASS;
- TPEx capital-reduction reference: 11 / 11 / exact range PASS;
- TPEx par-value-change reference: 4 / 4 / exact range PASS;
- TWSE daily material information: 54 rows / 46 ordinary symbols / whole-snapshot parser PASS;
- TPEx daily material information: 29 rows / 21 ordinary symbols / whole-snapshot parser PASS.

Boundary:
- this closes the eight-lane whole-source snapshot gate only;
- `expectedMopsKeysetComplete=false`;
- `noRevisionGapThroughCut=false`;
- `preParentEvidenceCutReady=false`;
- symbol-session completeness=false;
- technical continuity=false;
- no scheduler/Cron, history mutation, selection/final-selection, push, capital or order authority;
- System1 runtime unused and Formal Core unchanged.

Durable evidence:
`system2/evidence/S2_07_EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_V1_5_PHYSICAL_20261007.json`.

Next exact BUILD_LANE continuation:
1. prospectively capture MOPS exact disclosure versions for the frozen event population;
2. use exact-version row/content hashes, source-reported clock and first-observed clock;
3. freeze the complete expected MOPS version-key set before the parent cutoff;
4. bind V1.5 source-lane manifest + V1.4.1 MOPS version domain into the pre-parent evidence cut;
5. after the parent, run bounded-complete MOPS reconciliation and require `noRevisionGapThroughCut=true`;
6. only then bind symbol-session and technical-continuity receipts to genuine parent generations.

