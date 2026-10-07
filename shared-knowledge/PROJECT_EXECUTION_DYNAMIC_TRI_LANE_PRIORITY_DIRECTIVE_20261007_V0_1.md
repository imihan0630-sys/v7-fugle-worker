# Project Execution Dynamic Tri-Lane Priority Directive — 2026-10-07 V0.1

Status: OWNER_DIRECTIVE_ACTIVE / PROJECT_EXECUTION_AUTHORITY
Authority: explicit owner approval on 2026-10-07 Asia/Taipei
Repository: imihan0630-sys/v7-fugle-worker
Authoritative branch: main
Observed main at directive creation: `d13ff8a40007a3e7e8f8ab0fdfb0970c73fd0d08`

## Objective

Preserve System 2 go-live as the North Star objective while preventing a false single-lane optimization that starves the research and data dependencies System 2 actually consumes.

The project execution model is therefore changed from:
`SYSTEM2_GO_LIVE_PROJECT_P0`

to:
`DYNAMIC_TRI_LANE_LAUNCH_CRITICAL_PRIORITY`.

## Three active execution lanes

The following three lanes remain concurrently ACTIVE:

1. `SYSTEM2_BUILD_AND_GO_LIVE`
   - System 2 BUILD_LANE / launch-critical remediation / selection-to-capacity / candidate board / resonance / UI / guarded recommendation-notification activation.
   - North Star remains truthful Stage-1 System 2 formal operation.

2. `RESEARCH_01_TO_15`
   - 01–15 research rooms and their owned domains.
   - Prioritize research that directly changes System 2 launch policy, source interpretation, assessor design, anti-double-count controls, falsification, or stock-selection quality.
   - General long-horizon learning remains active but does not automatically preempt a live launch-critical blocker.

3. `SYSTEM2_DATA_LANE`
   - historical/current/PIT/revision/continuity data required by System 2.
   - prioritize launch-required recent/current data and continuity first;
   - broader historical completion continues in parallel and becomes launch-critical only when a frozen strategy/validator explicitly depends on it.

These lanes are not executed by fixed round-robin turns.

## Dynamic priority rule

00｜研究／稽核總控室 MUST dynamically allocate attention by current launch-critical blocker value.

At every audit cycle:
1. refresh latest main and canonical checkpoints;
2. inspect all three active lanes;
3. identify the blocker with the highest marginal effect on:
   - System 2 launch readiness;
   - stock-selection correctness;
   - evidence integrity;
   - cross-system independence;
4. let that lane continue uninterrupted while it is actively burning down the blocker;
5. switch attention when:
   - the blocker reaches a waiting state;
   - the lane hits an external dependency;
   - another lane becomes the higher-risk or higher-value critical path;
   - independent audit evidence shows the active path is no longer the shortest truthful route to launch.

A fixed 1:1:1 rotation is explicitly NOT required.

## System 2 remains the North Star

This directive does not demote the System 2 launch objective.

System 2 Stage-1 target remains:
independent System 2 assessment
-> System 2 candidate generation
-> ranking/capacity
-> bounded monitoring pool
-> Daily Resonance
-> institutional UI/read APIs
-> guarded formal advisory/notification authority.

The project should prefer the shortest truthful route to this target.

## Research lane anti-bloat rule

01–15 research is not treated as one undifferentiated launch prerequisite.

Research work is classified as:
- `LAUNCH_CRITICAL_RESEARCH`: directly blocks a frozen System 2 strategy, source, assessor, independence, falsification, or promotion gate;
- `SELECTION_QUALITY_RESEARCH`: materially improves stock-selection quality but does not currently block Stage-1;
- `LONG_HORIZON_RESEARCH`: valuable curriculum progression not on the immediate launch path.

Priority order within the research lane:
`LAUNCH_CRITICAL_RESEARCH > SELECTION_QUALITY_RESEARCH > LONG_HORIZON_RESEARCH`.

No room may claim launch-critical priority merely because its maturity percentage is low or because a module remains open.

## DATA_LANE anti-overreach rule

Historical-data work remains essential but does not receive blanket veto over Stage-1 launch.

The controlling question is:
does the frozen launch strategy or launch validator explicitly require this data segment?

If YES:
- the data segment is launch-critical.

If NO:
- it remains active background / validation work and must not block Stage-1 solely because broader history is incomplete.

Current/recent PIT integrity, source revision lineage, continuity, and the strategy-required lookback window outrank non-required historical completeness.

UNKNOWN remains UNKNOWN.
No historical gap may be coerced into NO_EVENT / NO_SUSPENSION / zero / benign status merely to accelerate launch.

## System 1 default-last rule

System 1 is now:
`DEFAULT_LAST / SENTINEL_ONLY_UNLESS_ESCALATED`.

System 1 does not receive routine equal-share execution attention.

It may preempt the three active lanes only under one of these explicit escalation conditions:

1. `SAFETY_REGRESSION`
   - a System 1/shared-runtime failure threatens data integrity, production safety, or shared infrastructure used by System 2.

2. `SHARED_DATA_REGRESSION`
   - a shared source/primitive/transport regression materially affects System 2 or research evidence.

3. `SDA022_INDEPENDENCE_REQUIRED`
   - System 1 evidence is required as a comparator/baseline to prove System 2 independent discovery or non-convergence.

4. `FORMAL_CORE_PROTECTION`
   - a change risks mutating locked System 1 Formal Core or violating protected cross-system boundaries.

5. `DIRECT_BLOCKER`
   - verified evidence shows a System 1 task directly blocks one of the three active lanes.

Outside these cases, System 1 remains last.

## Chatroom / GitHub authority rule

Chatrooms are research/execution interfaces, not machine authority.

The canonical dependency path is:
chat/research work
-> durable contract/checkpoint/receipt in GitHub main
-> consuming system.

System 2 must not wait for a chatroom to "finish learning" in the abstract.
It consumes only sufficiently frozen, versioned, falsifiable outputs.

Likewise, research rooms may continue evolving after System 2 consumes a frozen version; later ideas do not silently mutate the running System 2 policy.

## Assessor anti-rush rule

System 2 assessor policy is currently a critical path.

Acceleration MUST NOT mean inventing arbitrary thresholds merely to make the pipeline produce picks.

The preferred launch policy is:
the smallest falsifiable, versioned, independently auditable strategy assessor that:
- uses only validated inputs;
- has explicit UNKNOWN handling;
- has explicit invalidation;
- can produce real prospective receipts;
- remains distinct from System 1.

If governance permits a single genuinely independent launch strategy to satisfy Stage-1 before a second strategy is ready, 00/BUILD_LANE should evaluate that narrower launch path rather than forcing simultaneous maturity solely for symmetry.

## Completion semantics

"System 2 complete" is staged.

Stage 1:
formal advisory/monitoring operation.

Later protected stages:
- actual holdings ingestion;
- portfolio/capital authority;
- broker/order execution;
- real-money automation.

Stage 1 must not be held hostage by later-stage features unless a formal dependency is demonstrated.

## 00 audit cadence

Each 00 cycle must report:
- System 2 lane: DELTA / NO_CHANGE / WAITING;
- 01–15 research lane: DELTA / NO_CHANGE / WAITING;
- DATA_LANE: DELTA / NO_CHANGE / WAITING;
- System 1 sentinel: ESCALATED / NOT_ESCALATED.

Priority is chosen by critical-path impact, not fairness or turn count.

## Supersession

This directive supersedes only the PROJECT-WIDE EXECUTION PRIORITY semantics of:
`shared-knowledge/SYSTEM2_GO_LIVE_PRIORITY_DIRECTIVE_20261007_V0_1.md`.

The System 2 Stage-1 go-live objective and its safety boundaries remain valid.

Canonical project execution priority after this directive:
`DYNAMIC_TRI_LANE_LAUNCH_CRITICAL_PRIORITY`.

System 1 priority:
`DEFAULT_LAST_SENTINEL_ONLY`.

Formal Core remains LOCKED.
