# D16｜System1 Quality Verification Harness Authority Audit V0.1

更新：2026-10-07 Asia/Taipei
狀態：BUILD_CHAIN_OMITTED_IN_VERIFICATION_HARNESS / LIVE_SOURCE_CHECK_NOT_EXECUTED / QUALITY_STATE_UNRESOLVED
主責：11｜統計驗證與策略市場狀態研究室 / D16
Formal Core impact：NONE
成熟度影響：NONE
工程修復 owner：System1 engineering lane

## 1. Trigger and observed failure

PR #763 merge:
`420094e95adba8366c6e2f96ecf45e028cd64e41`.

Trigger artifact:
`research/SYSTEM1_QUALITY_TRANSPORT_LIVE_VERIFY_TRIGGER_20261007.json`.

Dedicated workflow:
`.github/workflows/system1-quality-transport-verification.yml`.

Run:
`37555765564`.

Job:
`112581505705`.

Observed:
- checkout = PASS;
- Node setup = PASS;
- `Verify transport-retry contract offline` = FAIL;
- actual official-quality recovery = SKIPPED;
- FINANCIAL / QUARTER_EPS readiness verification = SKIPPED;
- no artifact emitted.

Failure:
`AssertionError: V8.9.7+ runtime required`
from
`tests/test_v8_9_7_recovery_hardening.mjs`.

## 2. Root source model is a baseline, not deployed V8 runtime

Latest-main root:
`Worker.js`
contains:
`const VERSION = "7.5.26-q1-statement-column-validation";`.

This is not evidence of a V8.20 source regression.

Canonical build evidence:
`scripts/apply_v7_5_27.py`
explicitly reads `Worker.js` and expects the 7.5.26 baseline literal before advancing the patch chain.

Canonical production workflow:
`.github/workflows/v7-cloudflare.yml`
checks out repository baseline and then sequentially applies:
- V7.5.x patch scripts;
- V8.0.x ... V8.19.x patch scripts;
- `scripts/apply_v8_20_0.py`.

The canonical V8.20 patch changes effective runtime to:
`8.20.0-formal-c1-binding-ledger`.

Previously accepted V8.20 deployment and regression evidence therefore remains compatible with the baseline-source architecture.

## 3. Verification harness defect

The dedicated quality verification workflow currently:
1. checks out latest main;
2. sets Node;
3. immediately runs `node tests/test_v8_9_7_recovery_hardening.mjs`.

It does NOT:
- run the canonical V7→V8 patch chain;
- generate the effective V8.20 candidate Worker;
- set `V7_TEST_WORKER_PATH` to an already-generated V8 candidate.

The offline test defaults to:
`../Worker.js`.

Therefore it reads the legitimate 7.5.26 baseline and rejects it before any live-quality step.

Canonical classification:
`BUILD_CHAIN_OMITTED_IN_VERIFICATION_HARNESS`.

Not:
- `MAIN_SOURCE_VERSION_REGRESSION`;
- `FINANCIAL_SOURCE_FAILURE`;
- `QUARTER_EPS_SOURCE_FAILURE`;
- `QUALITY_TRANSPORT_REPAIR_PASS`.

## 4. D16 evidence interpretation

Run 37555765564 contains no empirical information about whether repaired official quality transport works.

The live steps never executed.

For 2026-10-06:
- prior observed quality state remains the last valid state;
- FINANCIAL / QUARTER_EPS repair result = UNKNOWN / NOT TESTED BY THIS RUN;
- no retrospective C1 evidence is created;
- no blocked date may be converted into a valid prospective sample.

This run may enter the operational attempt ledger as:
`VALIDATOR_CONTRACT_FAILURE`
or
`VERIFICATION_HARNESS_AUTHORITY_MISMATCH`.

It must not enter strategy or economic outcome denominators.

## 5. Correct engineering remediation boundary

Room11 does not modify System1 runtime.

System1 engineering should make the quality verification harness consume the same effective-runtime authority as canonical production validation.

Acceptable implementation patterns include:
- run the canonical build/patch chain before the offline V8 recovery test; or
- reuse a canonical generated candidate artifact and bind `V7_TEST_WORKER_PATH` to it.

Any implementation must prove that the tested candidate is the same effective source/version lineage intended for Production.

After harness repair, rerun in this order:
1. effective V8 candidate contract test;
2. recovery-only official quality transport for 2026-10-06;
3. read-only FINANCIAL / QUARTER_EPS readiness verification;
4. preserve no after-market scan / no plan mutation / no trade / no push.

A green harness test alone is not a quality-source PASS.
Actual live recovery + readback is required.

## 6. Formal / research boundaries

- no System1 Formal Core change authorized by this audit;
- no selection-rule change;
- no economic outcome opening;
- no historical prospective backfill;
- D16 maturity unchanged;
- genuine Formal↔C1 N remains 0.

## 7. Exact next

1. Re-read latest main for a harness repair.
2. If a repaired verification run appears, independently read job steps/logs.
3. Require live quality recovery step to execute, not skip.
4. Require FINANCIAL and QUARTER_EPS readiness readback.
5. Only then update quality transport state.
6. Preserve 2026-10-06 original prospective failure regardless of later repair.
