# System 2 Go-Live Priority Directive — 2026-10-07 V0.1

Status: OWNER_DIRECTIVE_ACTIVE / PROJECT_P0 / SYSTEM2_GO_LIVE_FAST_TRACK
Authority: explicit owner direction on 2026-10-07 Asia/Taipei
Repository: imihan0630-sys/v7-fugle-worker
Authoritative branch: main
Observed main at directive creation: `c57c4a07fa51b59be003f9f16f0f455f82e6ee23`

## Objective

System 2 is now the project's highest execution priority.

Primary objective:
bring System 2 to truthful formal operation as soon as its required launch gates are physically satisfied.

This directive accelerates execution. It does not authorize fake evidence, weakened PIT/UNKNOWN semantics, System1 convergence, or bypass of independent acceptance.

## Stage-1 formal operating target

The first formal go-live target is a production advisory / monitoring system with:

1. independently identifiable System 2 strategy assessment;
2. System 2-owned candidate generation;
3. System 2 ranking / capacity under the current canonical capacity contract;
4. a bounded preselected monitoring pool, not full-market intraday scanning;
5. Daily Resonance monitoring and institutional UI/read APIs;
6. guarded live recommendation / notification authority only after the launch acceptance gates pass.

Stage 1 does NOT require:
- broker/order routing;
- automated capital deployment;
- import of System1 holdings;
- owner actual-holdings monitoring;
- completion of every historical backfill year.

Those remain later protected gates unless a specific launch validator proves they are required for the Stage-1 strategy contract.

## Project-wide priority order

### P0-A — BUILD_LANE launch chain

1. Freeze the smallest falsifiable assessor policies for the launch strategies already registered in System 2.
   Current blocker:
   - SHORT_MOMENTUM = ASSESSOR_POLICY_NOT_FROZEN
   - SWING_GROWTH = ASSESSOR_POLICY_NOT_FROZEN

   Engineering must not invent arbitrary thresholds. Policy/version/provenance must be explicit and independently fingerprintable.

2. Wire only the validated source/regime/factor inputs required by those frozen launch policies.

3. Produce the first genuine daily strategy evaluations, ranking and physical immutable `s2_capacity_runs` receipt.

4. Populate the formal Candidate Board from the authorized S2-07 candidate source.

5. Complete SDA-022 System 2 policy fingerprints S22-T06~T10.

6. Produce physical NC-T01 S22-T11~T16 proving at least one System 2 strategy remains independently executable with System1 Top6/rank removed and no hidden fallback.

7. Complete guarded final-selection / live-notification activation only after independent launch-gate acceptance.

### P0-B — DATA_LANE launch window

The launch-critical data objective is the minimum validated current/recent window required by the frozen launch strategies, not universal historical completion.

Current accepted hot-history evidence:
- Recent A1 Hot History Warmup run 37550201160 = PASS;
- requiredSessions = 60;
- readyDateCountAfter = 28;
- remainingBlocked = [];
- continuity for newly warmed rows remains UNVERIFIED.

Therefore DATA_LANE priority is:
1. advance the recent A1 hot-history window toward the launch-required session depth;
2. close current-session/symbol continuity needed by launch strategies;
3. preserve revision/PIT lineage;
4. keep full historical backfill/revision work running in parallel only when it does not delay launch-critical work.

2021 TPEx and other older-year replay work is NOT a blanket Stage-1 launch blocker. It becomes P0 again only if a formal launch validator or frozen strategy requirement explicitly depends on it.

### P0-C — evidence / D16 / SDA-022

Prospective evidence accumulation begins as soon as genuine System 2 decisions exist.

Required:
- exact System 2 policy lineage;
- common-support/UNKNOWN accounting;
- prospective overlap/divergence receipts;
- SDA-022 dependence/incrementality validation at the required maturity gate.

Synthetic fixtures may prove engineering semantics but cannot substitute for genuine prospective promotion evidence.

### P0-D — 00 independent audit

00 prioritizes System 2 launch blockers over unrelated System1 and general-curriculum progress.

00 responsibilities:
- read latest main frequently;
- prevent false closure;
- close launch sub-gates immediately when physical evidence lands;
- route defects to the correct lane;
- prevent cross-system convergence;
- avoid taking implementation ownership from BUILD_LANE / DATA_LANE / REMEDIATION_LANE.

## Current launch facts at priority switch

Current System 2 runtime/infrastructure:
- Daily Resonance Worker/Cron/UI/read APIs are physically deployed;
- `resonanceState=BOUNDED_RESONANCE_SCHEDULED`;
- current capture authority remains `CAPTURE_DISABLED`;
- upstream operations remain blocked when no genuine capacity receipt exists.

Latest daily diagnostic run 37550200819:
- PASS at diagnostic/persistence/readback layer;
- marketDate=2026-10-07;
- BEFORE_CLOSE_DIAGNOSTIC_SKIP;
- strategyEvaluation=BLOCKED_ASSESSOR_POLICY_NOT_FROZEN;
- capacity=NOT_PRODUCED;
- capacityRunId=null;
- selectedCount=null;
- public readback exact;
- no fabricated zero-pick.

S2-07 V1.6:
- physical exact-version capture is accepted on main;
- membership stability / drift remains a real blocker;
- it does not authorize strategy/capacity/live recommendation by itself.

SDA-022:
- System1 fingerprint S22-T01~T05 PASS;
- D16 prereg S22-T25~T28 PASS;
- System2 fingerprint S22-T06~T10 PENDING;
- physical NC-T01 S22-T11~T16 PENDING;
- prospective S22-T17~T24 not yet mature.

## Owner authorization boundary

This owner directive authorizes:
- project-wide reprioritization toward System 2;
- preparation, implementation and testing of launch-critical System 2 work inside the existing lane/governance boundaries;
- completion of data warmup, diagnostic, strategy/capacity and independence evidence work;
- preparation of guarded live recommendation/notification activation.

Once all formal Stage-1 launch acceptance gates are independently verified, this directive is sufficient owner intent to proceed with System 2 production advisory/monitoring activation without asking again merely whether System 2 should be prioritized.

This directive does NOT authorize:
- automatic broker orders;
- real-money capital deployment;
- import/reconciliation of owner actual holdings;
- removal of required promotion/OOS/prospective gates;
- arbitrary assessor thresholds;
- System1 ranking/candidate fallback;
- any Formal Core mutation.

Any later real-order/capital/actual-holdings activation remains separately owner-gated.

## Exact next continuation

BUILD_LANE:
assessor-policy freeze -> launch-source/regime wiring -> genuine strategy decisions -> ranking/capacity -> System2 policy fingerprints + NC-T01 -> Candidate Board -> guarded live-notification readiness.

DATA_LANE:
recent 60-session launch window + required continuity first; historical completeness second unless explicitly launch-critical.

00:
audit these two lanes concurrently and immediately update launch readiness as physical evidence lands.
