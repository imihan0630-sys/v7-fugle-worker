# D03 Immutable Parent Deployment Reassessment 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03 shared prospective evidence infrastructure
Status: RESEARCH_ONLY / DEPLOYMENT_REASSESSED / FIRST_GENUINE_GENERATION_PENDING
Formal Core: LOCKED

## TI-575 — prior "implementation pending" state is superseded

Latest main contains:
- research/SYSTEM1_SHADOW_COHORT_MEMBERSHIP_IMPLEMENTATION_20261004.md
- research/system1_shadow_cohort_deployment_20261004_v0_1.json

Current authoritative state:
- PR #454 merged after explicit owner Production approval;
- runtime version = 8.17.0-shadow-cohort-membership;
- Production deploy run 37171810825 = success;
- public version readback verified;
- TEST_MODE=false;
- KV/D1=true;
- Formal Core unchanged.

Therefore the old D03 statement:
IMMUTABLE_PARENT_RUNTIME = IMPLEMENTATION_PENDING

is superseded by:
IMMUTABLE_PARENT_RUNTIME = DEPLOYED_AND_VERSION_VERIFIED.

## TI-576 — deployed runtime is not yet a prospective evidence generation

Deployment proof does not equal market-generation proof.

Canonical implementation checkpoint explicitly states:
- FIRST_PROSPECTIVE_SHADOW_COHORT_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION;
- FIRST_PROSPECTIVE_C1_CHILD_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION.

Because 2026-10-04 is a non-trading Sunday, D03 may not synthesize or backfill a fake generation merely to obtain a PASS.

Therefore:
PHYSICAL_IMMUTABLE_PARENT_RUNTIME = DEPLOYED;
PHYSICAL_GENUINE_PARENT_GENERATION = NOT_YET_OBSERVED.

## TI-577 — what is now physically implemented

The deployed research-only substrate includes:
- immutable C1 full-population generation as canonical decision parent;
- trade_research_population_receipts;
- trade_research_candidate_memberships;
- append-only quality overlays;
- atomic D1 batch persistence;
- generation/fingerprint/idempotency conflict protection;
- exact reason x pool denominators;
- overlapping memberships;
- read-only /api/research/shadow-cohort readback;
- whole-generation membership/keyset verification;
- no Formal decision impact on failure.

This materially satisfies the engineering side of the shared-parent architecture that D03 had previously treated as NOT_IMPLEMENTED.

## TI-578 — remaining parent acceptance for D03 R1/R2

D03 still requires one genuine post-deployment generation proving:
- actual normal scan completed;
- C1 parent generation persisted;
- population receipt readable;
- candidate memberships readable;
- parent/keyset hashes reconcile;
- expected/persisted counts reconcile;
- whole-generation coverage verified;
- quality watermark pinned;
- no truncation;
- no provider/capture integrity failure;
- no Formal plan/capital/output difference.

Until this occurs:
TECHNICAL_OBSERVER_PARENT_READY = PENDING_GENUINE_READBACK.

## TI-579 — maturity implication

This reassessment removes "implementation missing" as a design/engineering blocker.

It does NOT promote D03-10 or D03-09 yet because:
- no genuine prospective parent generation has been read back;
- TECHNICAL_CONTINUITY remains not fully certified;
- historical version-clock completeness remains conservative;
- Bollinger requires exact 20-session continuity-corrected parent rows;
- ADX additionally requires recursive replay authority.

Therefore:
D03_10_BOLLINGER = L2_REMAINS;
D03_09_ADX = L2_REMAINS;
D03_MATURITY = 56.7_PERCENT.

Next honest maturity remains:
- Bollinger L3 => 58.3%;
- ADX L3 after that => 60.0%.

## Exact next continuation

At the first genuine post-deployment Taiwan trading session:
1. do not trigger a synthetic scan;
2. let normal production scan generate C1;
3. use existing system1-c1-evidence workflow;
4. verify immutable parent + cohort generation readback;
5. preserve any unavailable/partial state as UNKNOWN/BLOCKED;
6. if parent passes, D03 immediately re-audits the remaining TECHNICAL_CONTINUITY source gate for Bollinger;
7. no outcome join is opened by parent readiness alone.

Formal Core remains LOCKED.
