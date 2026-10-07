# BR-063 D18 Same-Clock Capture Dependency — 2026-10-07

Status: CROSS_ROOM_DEPENDENCY_REQUEST / RESEARCH_ONLY / NO_POLICY_IMPACT / NO_FORMAL_CHANGE

Requester: 07｜產業與供應鏈研究室
Dependency owner: Room11 / D18 research capture, with System2 research engineering where applicable
Consumer module: D09-12 Breadth×Regime交互作用
Research item: BR-063

## Confirmed gap

2026-10-06 scheduled prospective evidence run:
- workflow: `System2 Prospective Clock Evidence Read-only`;
- run id: `37419347091`;
- URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37419347091
- conclusion: SUCCESS.

But the immutable daily bundle reports:
- dailyGateComplete=false;
- sameSessionClockReady=false;
- requiredReady=false;
- precisionEligible=false;
- TWSE A1 readyObserved=false after 30 attempts;
- TPEx A1 readyObserved=true;
- A2 TAIEX attemptCount=0;
- B2 dependency coverage=false.

Repository workflow search finds no same-day scheduled workflow capturing `A2_TAIEX_CLOSE` / `d18_taiex_context_v0_1.mjs`.

Therefore D09-12 cannot produce the first genuine same-clock joint receipt from 2026-10-06.

## Minimum dependency needed

On a future completed Taiwan session, persist one immutable research-only dependency packet with:

### A. D18 TAIEX context
- marketDate;
- exact decisionTimestamp;
- A2 source receipt;
- source observedAt;
- prospectiveSameDateEligible;
- 25 official-session TAIEX history window;
- official-session-window hash;
- history-window hash;
- trendContext;
- volatilityDirection;
- receiptHash.

Must satisfy current `d18_taiex_context_v0_1.mjs` fail-closed semantics.

### B. Direction breadth
At the same marketDate and exact decisionTimestamp:
- venue source lineage;
- advance / decline / flat counts or continuity-safe symbol distribution;
- comparable / N-A / untraded / unknown denominators;
- coverage;
- sourceBatchHash / receiptHash;
- point-in-time readiness.

If canonical `BROAD_POSITIVE/BROAD_NEGATIVE` is requested, medianReturn must be continuity-certified.
Otherwise preserve `CONTEXT_RAW`.

### C. Joint binding
- identical marketDate;
- identical decisionTimestamp;
- exact source references/hashes;
- no retrospective reconstruction presented as prospective;
- policyApplied=false;
- selectionImpact=false;
- strategyWeightImpact=false;
- capitalImpact=false.

## Acceptance for BR-063

BR-063 may count as the first genuine joint receipt only if:
1. A2 was actually captured prospectively on that date;
2. breadth was actually captured prospectively on that date;
3. clocks bind exactly;
4. missing venue / missing continuity remains UNKNOWN;
5. the packet existed before any D09-12 forward-outcome access.

No scalar Regime score is needed.
No System2 policy change is needed.
No System1 data is required.

## Existing replay witness

2026-10-06 official data is durable at:
- `research/BR063_BREADTH_REGIME_REPLAY_WITNESS_20261006_V0_1.md`;
- `research/br063_breadth_regime_replay_witness_20261006_v0_1.json`.

It is useful for deterministic replay only and is explicitly prospective-ineligible.

## Return contract

When the first eligible packet exists, return:
- receipt/artifact path;
- workflow run / immutable artifact id;
- marketDate;
- decisionTimestamp;
- A2 eligibility;
- breadth eligibility;
- exact unknown/coverage states;
- receipt hashes.

Room07 will then freeze the BR-063 no-outcome joint receipt and reassess D09-12 L3 only on data-feasibility grounds.
