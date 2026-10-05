# D02 PVE-247 — Runtime remediation acceptance oracle

Updated: 2026-10-06 Asia/Taipei
Status: ACCEPTANCE_ORACLE_IMPLEMENTED / CI_PASS / SYSTEM1_FIX_NOT_YET_IMPLEMENTED / H001_FAIL_CLOSED / NO_MATURITY_CHANGE / FORMAL_UNCHANGED

## Purpose

PVE-247 does not pretend System 1 remediation exists.

It converts the three PVE-246 certified root causes into a deterministic research-only acceptance oracle so a future System 1 repair cannot be declared complete from prose, a source diff, or one green legacy regression alone.

Class:
CLASS_A / RESEARCH_ONLY / NO_PRODUCTION_MUTATION.

## Durable implementation

Oracle:
`research/d02_pve247_remediation_acceptance_oracle_v0_1.mjs`

Fixtures:
`tests/test_d02_pve247_remediation_acceptance_oracle_v0_1.mjs`

Dedicated CI:
`.github/workflows/d02-pve247-remediation-oracle.yml`

Dedicated CI run:
- run id `37381110086`;
- conclusion `success`;
- 15 deterministic fixtures PASS.

The files do not alter Worker runtime, Cloudflare schedules, D1 business state, Formal selection, capital, monitoring, signal or push behavior.

## Oracle layer 1 — after-market schedule identity

The oracle accepts either:
- one combined `35,55 15 * * mon-fri` schedule; or
- separately governed 23:35 and 23:55 schedules.

Physical readback must then show:
- a 23:35 primary event;
- a 23:55 recovery event;
- neither may be labeled `INTRADAY_MONITOR`;
- job types must be governed after-market types;
- at most one after-market business execution may succeed;
- recovery must prove only-if-missing / already-scanned idempotence unless primary failed and recovery becomes the single successful execution.

This prevents a naive repair that simply makes both 23:35 and 23:55 execute a full duplicate scan.

## Oracle layer 2 — 15m baseline readiness

The oracle requires a machine receipt containing:
- bootstrapAttemptAt;
- symbol;
- requested from/to dates;
- provider status;
- raw row count;
- normalized session count;
- rejected-session count and explicit reason list;
- final validSessions;
- same-slot history count;
- finite pvSlotRvol20;
- sameSlotBaselineClean=true.

Both normalizedSessionCount and final validSessions must be >=20.
The exact H001 slot also requires slotHistoryCount>=20 and finite pvSlotRvol20.

A silent bootstrap with no rejection accounting is not accepted.

## Oracle layer 3 — fetch-boundary raw provenance

Required:
- provider;
- endpoint;
- SHA-256 rawPayloadHash;
- `rawPayloadHashBasis=EXACT_PROVIDER_RESPONSE_SHA256`;
- capturedAt;
- normalizationVersion;
- semanticFingerprint retained separately.

Secret-bearing query material in the persisted endpoint is rejected.

The oracle does not permit semanticFingerprint to stand in for raw source provenance.

## Repair-ready is not H001 evidence-ready

The oracle deliberately has two states.

`remediationReady=true` means only:
- schedule identity passes;
- baseline readiness passes;
- fetch-boundary provenance passes.

It does NOT create an H001 research event.

`h001ReceiptEligible=true` additionally requires:
- marketDate later than 2026-10-05;
- PVE-241 canonical receipt guard PASS;
- PVE-242 H001 lane guard PASS;
- common support PASS;
- cohort / generation / Formal-isolation PASS.

Therefore a successful engineering repair cannot automatically increase D02 maturity.

## Non-retroactivity

The oracle executable rule rejects marketDate <= 2026-10-05 for this first repaired H001 path.

2026-10-05 remains permanently unavailable for retrospective clean prospective-date relabeling.

## New self-deception / test blind spot

PVE-247 found a second-order validation defect.

Existing:
`tests/test_v8_7_12_after_market_2335.mjs`

asserts:
- the Worker contains the single `35 15 * * MON-FRI` marker;
- the old 18:10 marker is gone;
- the broad Taipei-hour >=18 fallback is gone.

Separately:
- `tests/update_cloudflare_after_market_cron.mjs`;
- `tests/update_cloudflare_after_market_recovery_cron.mjs`

already understand the combined production schedule:
`35,55 15 * * mon-fri`.

But the existing runtime contract test never proves that `isAfterMarketSchedule` recognizes that combined schedule.

Result:
legacy regression can remain green while Production classifies both 23:35 and 23:55 as `INTRADAY_MONITOR / SKIPPED`.

System 1 repair acceptance must therefore add a runtime-level combined-Cron classification test, not only patch a literal string.

## Current oracle verdict

Current Production remains:
- schedule FAIL;
- baseline FAIL;
- provenance FAIL;
- remediationReady=false;
- h001ReceiptEligible=false.

No System 1 production fix is claimed.

## Permanent authorization firewall

The oracle always returns false for:
- outcomeAccessAuthorized;
- numericalTargetAuthorized;
- d16MethodSelectionAuthorized;
- maturityPromotionAuthorized;
- formalCoreChangeAuthorized.

## Maturity consequence

D02 remains 60.0%.
Clean prospective selection dates remain 0.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
Formal Core remains LOCKED.

## Exact next continuation point

PVE-248 — System 1 prepares the bounded Class-B repair candidate against the PVE-246 root-cause certification and PVE-247 executable oracle:
1. combined 23:35/23:55 after-market runtime classification with idempotent recovery;
2. baseline bootstrap availability/receipt path;
3. fetch-boundary provider/endpoint/rawPayloadHash persistence;
4. runtime-level tests covering the combined Cron.

D02 then consumes the unmerged candidate tests/readback first.
Merge/deploy remains owner-approval gated under engineering governance.
