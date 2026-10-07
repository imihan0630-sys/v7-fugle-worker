# 00 Dynamic Tri-Lane Current Cycle — 2026-10-07 V0.1

Status: ACTIVE_CURRENT_CYCLE_RECEIPT
Execution model: DYNAMIC_TRI_LANE_LAUNCH_CRITICAL_PRIORITY
Observed main: `04c69539d7894450300c955720761b1b6c5d6662`
Formal Core: LOCKED

## System2 lane — WAITING / CONTENT DELTA

Stage-1 assessor policy freeze is complete on main.

SDA-022 System2 fingerprint PR #762:
- head `a5487086ba15f844d775e12bc7ce2c3852749644`;
- workflow `37555568966` PASS;
- 00 independent content audit = PASS for S22-T06~T10;
- SHORT_MOMENTUM and SWING_GROWTH remain distinct;
- max12/max3/no-forced-fill/no-universal-score preserved;
- System1 candidate/rank dependency = false;
- candidateUniverseMode remains `NOT_PHYSICALLY_PROVEN`;
- no final selection/live push/capital/order/Formal authority;
- PR is open and mergeable=false on current main.

Exact next BUILD_LANE action:
rebase/rebuild #762 on latest main, rerun exact-head checks, then canonical merge.
After canonical fingerprint acceptance, physical NC-T01 S22-T11~T16 becomes the immediate independence gate.

No NC-T01 workflow/PR was found at this readback.

## 01–15 Research lane — ACTIVE / MATERIAL DELTA

First-sample operational preflight run `37574013925` PASS for 2026-10-07:
- official trading day = true;
- collector freeze guard PASS;
- schedule guard PASS;
- prospective collector workflow active and eligible;
- no retrospective evidence claim.

Prospective Clock Evidence run `37577209442` remains ACTIVE:
- calendar PASS;
- safety PASS;
- A1 daily-arrival polling IN_PROGRESS;
- A5/B2 required-dependency polling IN_PROGRESS.

Do not classify the 2026-10-07 sample until terminal evidence exists.

D03 / S2-07 membership falsification:
V1.6.1 physical run `37549222488` PASS as a negative/fail-closed result:
- unionVersionCount=168;
- second capture added 2 versions;
- membershipStable=false;
- stableTailCount=1/3;
- payloadConflictCount=0;
- expectedMopsKeysetComplete=false;
- noRevisionGapThroughCut=false.
This proves membership drift and forbids premature keyset freeze.
V1.7 PR #761 has no accepted physical result because its physical run was cancelled.

## DATA_LANE — DELTA CLOSED / NEXT WAITING

2024 TWSE annual physical run `37564954928` SUCCESS.
00 independently accepted the evidence and merged DATA_LANE PR #771.

Canonical merge:
`04c69539d7894450300c955720761b1b6c5d6662`.

Disposition:
2024 TWSE raw A1 coverage accepted with replay readiness PARTIAL and UNKNOWN gaps preserved.

Exact next DATA_LANE action:
fresh-dispatch 2024 TPEx annual backfill from latest main, then apply the same Physical verify + artifact + System1-isolation acceptance standard.

00 does not dispatch or implement DATA_LANE work.

## System1 sentinel — NOT_ESCALATED

No current System1 issue was found that qualifies for priority escalation under:
- shared-runtime/data regression affecting active lanes;
- SDA-022 comparator requirement;
- Formal Core protection;
- verified direct blocker.

System1 remains DEFAULT_LAST / SENTINEL_ONLY.

## Dynamic priority after this cycle

1. System2 BUILD_LANE: canonicalize #762, then physical NC-T01.
2. Research: allow the live 2026-10-07 prospective clock collector to finish; consume terminal result immediately.
3. DATA_LANE: 2024 TPEx fresh annual continuation.
4. System1: sentinel only.

Priority is critical-path based, not round-robin.


## 00 re-entry readback delta — 2026-10-07 afternoon

Observed latest main at re-entry:
`f24183f5bed51ba145a5e830a090c446d7c03ac6`.

### System2 BUILD_LANE

PR #762 current state:
- open / non-draft / GitHub mergeable=true;
- head `a5487086ba15f844d775e12bc7ce2c3852749644`;
- dedicated fingerprint run `37555568966` PASS;
- V8 Regression `37555569004` PASS;
- System2 Research CI `37555568971` PASS;
- changed files remain limited to the eight System2 SDA-022 policy-fingerprint implementation/evidence/test files.

However, independent compare from PR base `24a1404ca0d18110d0c6d0b67044261ccf67dcdd` to current latest main shows 84 newer commits.
00 therefore retains the existing governance requirement:
- do NOT canonical-merge the stale head merely because GitHub currently reports mergeable=true;
- BUILD_LANE must rebuild/rebase the fingerprint delta on latest main;
- rerun exact-head fingerprint CI + System2 Research CI + applicable V8 Regression;
- only then canonical merge;
- physical NC-T01 S22-T11~T16 is next immediately afterward.

00 posted this exact audit requirement to PR #762.
No NC-T01 physical receipt/workflow was accepted at this readback.

### 01–15 / prospective research evidence

Prospective clock run `37577209442` is still IN_PROGRESS, not stalled:
- calendar = PASS;
- safety = PASS;
- A1 daily-arrival polling = IN_PROGRESS;
- A5/B2 required-dependency polling = IN_PROGRESS;
- workflow contract allows up to 180 minutes for each polling job;
- polling configuration = 30 attempts x 300 seconds.

Therefore 00 does not cancel, timeout-label, or pre-classify the 2026-10-07 sample.
Consume only terminal immutable evidence.

### DATA_LANE

Run `37579384088` completed SUCCESS but is NOT 2024 TPEx.
Independent readback proves:
- market = TWSE;
- year = 2024;
- artifact `system2-historical-coverage-TWSE-2024`;
- artifact id `11464492577`;
- Production isolation PASS;
- physical coverage shows 242/242 sessions, 1,038 historical-universe symbols, 246,037 actual bars, 478 explicit UNKNOWN symbol-session gaps, 0 unexpected bars.

This is a later TWSE-2024 rerun/verification receipt only.
It must not be misclassified as completion of the current DATA_LANE next action.

Exact DATA_LANE next remains:
fresh-dispatch 2024 TPEx annual backfill from latest main, followed by the same physical verify + artifact + System1-isolation acceptance standard.

### Dynamic priority after re-entry readback

1. System2 BUILD_LANE — latest-main rebuild/canonicalization of #762, then physical NC-T01.
2. Research — allow `37577209442` to reach terminal state and consume the immutable prospective clock bundle immediately.
3. DATA_LANE — 2024 TPEx annual continuation; TWSE-2024 rerun does not advance this cursor.
4. System1 — DEFAULT_LAST / SENTINEL_ONLY.

Formal Core remains LOCKED.


## 00 continuation delta — 2026-10-07 15:xx Asia/Taipei

Observed latest main:
`2ddada1cdec9bc2fb362329a8aa6bb889b506a9e`.

### System2 BUILD_LANE critical-path readback

PR #762 is still OPEN and GitHub currently reports:
- mergeable=true;
- mergeable_state=clean;
- head `a5487086ba15f844d775e12bc7ce2c3852749644`.

However an independent head-vs-main compare is DIVERGED:
- main is 103 commits ahead of PR head;
- PR head is 8 commits ahead of the merge base.

Therefore the prior 00 disposition is unchanged:
GitHub's current mergeable=true is not sufficient canonical acceptance. BUILD_LANE must rebuild/rebase the eight-commit fingerprint delta on latest main, rerun exact-head fingerprint/System2 Research/V8 applicable checks, then canonical merge. Only after that may physical NC-T01 S22-T11~T16 become the immediate accepted independence gate.

No physical NC-T01 receipt is accepted yet.

### Research lane

Prospective Clock Evidence run `37577209442` remains IN_PROGRESS.
No 2026-10-07 prospective sample classification is authorized before terminal immutable evidence.

### DATA_LANE correction

Run `37579384088` is SUCCESS but its only artifact is:
`system2-historical-coverage-TWSE-2024`.

It is therefore a TWSE-2024 physical verification receipt, not the required 2024 TPEx continuation.
DATA_LANE exact next remains:
fresh-dispatch 2024 TPEx annual backfill from latest main, then physical verify + artifact + System1-isolation acceptance.

### System1 sentinel

Latest main currently includes independent System1 research work, but 00 found no new condition that escalates System1 above the three active lanes. System1 remains DEFAULT_LAST / SENTINEL_ONLY for 00 scheduling.

### Current dynamic priority

1. System2 BUILD_LANE — rebase/rebuild and canonicalize #762.
2. Research — consume `37577209442` only when terminal.
3. DATA_LANE — execute actual 2024 TPEx annual continuation.
4. System1 — sentinel only.

Formal Core remains LOCKED.


## 00 continuation delta — 2026-10-07 16:04 Asia/Taipei

Observed latest main:
`5374b212b752893973080d7ee1f0ef179774f0f3`.

### System2 BUILD_LANE — still highest launch-critical blocker

PR #762 remains OPEN on stale head `a5487086ba15f844d775e12bc7ce2c3852749644`.
No equivalent canonical System2 policy-fingerprint receipt satisfying S22-T06~T10 was found on latest main outside that PR.
Existing 00 audit comments already instruct BUILD_LANE to rebuild/rebase on latest main, rerun exact-head fingerprint/System2 Research/applicable V8 checks, and canonical merge.
00 will not duplicate the same directive comment.

Therefore:
- S22-T06~T10 content evidence remains accepted-but-not-canonical;
- physical NC-T01 S22-T11~T16 remains blocked behind canonical fingerprint acceptance;
- no final selection/live push/capital/order authority follows from the stale PR.

### Research lane — terminal evidence still pending

Prospective Clock Evidence run `37577209442` remains IN_PROGRESS.
Its configured polling window has not yet been exhausted at this readback.
No 2026-10-07 prospective sample classification is permitted before terminal immutable evidence.

### DATA_LANE — 2024 TPEx cursor materially changed

2024 TPEx annual run #28 = `37587943578` failed twice before Physical verify:
- attempt 1: TPEx PRIMARY timeout on 2024-04-26;
- attempt 2: TPEx PRIMARY timeout on 2024-01-15;
- System1 isolation PASS both times;
- legacy non-equivalent TPEx endpoint remained forbidden.

The changed failure date supports intermittent runner-to-PRIMARY transport exhaustion rather than a deterministic corrupt market date.

A bounded PRIMARY-only transport-recovery implementation is now on latest main and System2 Research CI `37590871628` PASS.
The remediation does not weaken schema/date/OHLC/data-integrity fail-closed behavior and does not permit the legacy endpoint to satisfy canonical ingestion.

Exact DATA_LANE next:
fresh workflow_dispatch from then-latest main with `year=2024 / market=TPEX`.
Do not rerun old #28 because it is bound to the pre-fix head.
Acceptance still requires:
annual backfill PASS + Physical verify PASS + artifact + System1 isolation PASS.

### System1 sentinel

No new System1 condition currently qualifies to preempt the three active lanes.
System1 remains DEFAULT_LAST / SENTINEL_ONLY.

### Dynamic priority after 16:04 readback

1. System2 BUILD_LANE — canonicalize #762 on latest main; then physical NC-T01.
2. Research — consume `37577209442` at terminal evidence.
3. DATA_LANE — fresh 2024/TPEX dispatch using the transport-recovery main.
4. System1 — sentinel only.

Formal Core remains LOCKED.


## 00 deep-dive delta — terminal prospective clock + narrow Stage-1 critical path (2026-10-07)

### Research lane — 2026-10-07 prospective clock is now terminal

Authoritative physical run:
- workflow `37577209442`: COMPLETED / SUCCESS;
- all jobs terminal PASS: calendar, safety, daily_arrival, required_dependencies, bundle.

Immutable artifacts:
- A1 source-arrival artifact `11469331429`, digest `sha256:4b2b436015a385c89402d071d9f1c8efc644b6fda2707962263a272b81553ef2`;
- A5/B2 dependency artifact `11468824436`, digest `sha256:a2b94b923095ade2a650477df94fa2154b9557625321430a7b41539966f5833c`;
- daily decision-clock bundle `11469168019`, digest `sha256:9e1ff9c1ad5a88406095b405a057ce97c90ef051fe347ef13eb8a204388b1baf`.

Terminal bundle:
- marketDate = 2026-10-07;
- requiredReady = false;
- precisionEligible = false;
- a5AvailableByCandidate = false;
- candidateTimestamp = null;
- exactDecisionClockAuthorized = false;
- cronAuthorized = false;
- externalMutationPerformed = false.

A1 decomposition:
- A1_TWSE_DAILY_CLOSE: 30/30 observations remained NOT_READY; target date 2026-10-07 was not physically observed by this run;
- A1_TPEX_DAILY_CLOSE: zero READY observations across 30 attempts; explicit NOT_READY and INVALID_PAYLOAD/NON_JSON_RESPONSE states were observed;
- therefore poll exhaustion is physical evidence of an unresolved acquisition/readiness path, not evidence of zero market data and not a clean zero-pick day.

Required-dependency decomposition:
- A5_QUARTERLY_FINANCIALS: prospectively observable and mostly READY within this run;
- B2_INDUSTRY_THESIS_PROSPECTIVE: never READY in this run;
- dependencyCoverage = A5 true / B2 false;
- prospectiveEvidenceEligible = false.

### Critical-path correction — B2 is not a SHORT_MOMENTUM launch prerequisite

Canonical Stage-1 assessor policy proves:
- SHORT_MOMENTUM launch families = TECHNICAL_STRUCTURE + PRICE_VOLUME + RISK_FRICTION;
- SWING_GROWTH required thesis families = INDUSTRY_THESIS + FUNDAMENTAL_QUALITY;
- A1 timing cannot synthesize a missing SWING_GROWTH thesis.

Canonical project directive explicitly allows 00/BUILD_LANE to evaluate a single genuinely independent strategy as the narrower Stage-1 path rather than forcing simultaneous second-strategy maturity for symmetry.

SDA-022 S22-T13 likewise requires at least one System2 strategy candidate-generation path to remain executable when its own required inputs are READY.

00 disposition:
- SHORT_MOMENTUM becomes the current narrow Stage-1 lead path;
- B2 remains a real SWING_GROWTH blocker, but it is NOT a global Stage-1 blocker solely by symmetry;
- this is an execution-priority/audit interpretation, not a strategy-policy mutation;
- SWING_GROWTH is not relabeled READY;
- final selection/live notification/capital/order authority remains disabled.

### New launch-critical A1 correction

Opened:
`S2-CORR-20261007-001`.

Classification:
- HIGH / OPEN;
- routingClass = DATA_LANE;
- scope = current/prospective A1 daily-close acquisition only;
- historical 2024 TPEx annual population remains under existing CORR-001 and is not duplicated.

Root-level readback:
- current `system2/runtime/official_source_probes.mjs` performs one GET per source probe and returns `NON_JSON_RESPONSE` after HTTP-success JSON parse failure;
- the historical A1 path independently gained bounded PRIMARY-only transport-exhaustion recovery after repeated TPEx annual failures;
- these are not the same exact code defect, but they establish a recurring official-source acquisition-instability class;
- no current/prospective A1 repair is accepted until a later real-trading-date physical receipt passes the new correction criteria.

### System2 BUILD_LANE interaction

PR #762 remains the canonicalization gate for S22-T06~T10 and must still be rebuilt/rebased on latest main before canonical merge.

After canonical fingerprints:
1. physical NC-T01 should prioritize the SHORT_MOMENTUM path;
2. S22-T13 must be tested only when SHORT_MOMENTUM's own required inputs are truthfully READY;
3. B2/SWING_GROWTH must not be used as a reason to postpone an otherwise valid SHORT_MOMENTUM independence test;
4. no synthetic output may substitute for physical independence.

### Revised dynamic priority

1. BUILD_LANE — canonicalize #762 on latest main; prepare physical NC-T01 around SHORT_MOMENTUM.
2. DATA_LANE launch-critical current data — burn down S2-CORR-20261007-001 so current/prospective A1 can become physically READY.
3. DATA_LANE historical — fresh 2024/TPEX annual dispatch under existing CORR-001 continues in parallel, but must not outrank current A1 merely because the annual sequence is older.
4. BUILD/Research parallel — B2/SWING_GROWTH remains active but no longer globally blocks the narrow Stage-1 launch path.
5. System1 — DEFAULT_LAST / SENTINEL_ONLY unless an escalation condition appears.

Stage-1 still requires the remaining independent promotion gates; this narrowing does not itself authorize go-live.
Formal Core remains LOCKED.


## 00 deep critical-path compression audit — 2026-10-07 afternoon

Observed latest main before write:
`3f4dd6bb0eba7209caa0cc326d0255e7ba2c8556`.

### Key finding — old aggregate launch blockers are too coarse

Independent latest-main readback shows several previously grouped blockers are NOT universal Stage-1 gates anymore.

1. MARKET_REGIME is not a universal launch dependency.
   - D18 policy/regime boundary explicitly states SHORT_MOMENTUM launch policy does not require MARKET_REGIME as a launch-required family.
   - Policy-only prospective System2 evidence may proceed while Regime remains UNKNOWN.
   - Regime is required only for a strategy×regime/D18 claim or a preregistered regime challenger, not for the smallest truthful SHORT_MOMENTUM Stage-1 path.

2. Whole-universe perfect 60-session readiness is not a universal launch gate.
   - CORR-004 is VERIFIED_CLOSED.
   - Symbol-local history/continuity gaps remain per-symbol INCOMPLETE/BLOCKED while clean symbols may proceed.
   - Partial denominator semantics remain explicit and cannot become a false zero-pick.
   - Therefore old wording such as “28 READY dates versus required 60” must not be interpreted as requiring every current-universe symbol to become fully ready before any Stage-1 strategy evaluation can run.

3. SWING_GROWTH missing thesis inputs must not block the first independent Stage-1 lane.
   - SWING_GROWTH still requires PIT-valid INDUSTRY_THESIS + FUNDAMENTAL_QUALITY and A1 timing cannot manufacture them.
   - The project dynamic-priority directive explicitly allows 00/BUILD_LANE to evaluate a single genuinely independent launch strategy before a second strategy is ready.
   - SDA-022 NC-T01 requires at least one independently executable System2 strategy without System1 Top6/rank.
   - No canonical rule found that requires SHORT_MOMENTUM and SWING_GROWTH to become physically launch-ready simultaneously.

### Shortest truthful System2 Stage-1 path

00 therefore freezes the current launch-critical sequence as:

1. canonicalize System2 policy fingerprints S22-T06~T10 from #762 on latest main;
2. physical NC-T01 S22-T11~T16 using at least one independent strategy path;
3. use SHORT_MOMENTUM as the first launch-path candidate because its frozen policy can operate without MARKET_REGIME and does not depend on SWING_GROWTH's unresolved fundamental/industry thesis inputs;
4. wire genuine daily SHORT_MOMENTUM strategy evaluation under exact policy id/version;
5. produce strategy-local RANK-01;
6. produce the first physical immutable `s2_capacity_runs` receipt only from truthfully ready symbols with explicit COMPLETE/PARTIAL/UNKNOWN denominator provenance;
7. populate Candidate Board / bounded monitor pool from that authorized capacity receipt;
8. allow deployed Daily Resonance / institutional UI to consume the genuine pool;
9. only then evaluate guarded final-selection / advisory-notification activation under the existing owner/promotion gates.

This compression does NOT:
- invent thresholds;
- downgrade PIT/UNKNOWN semantics;
- make partial coverage a clean zero-pick;
- promote Regime;
- make SWING_GROWTH optional forever;
- authorize live capital/orders/broker routing;
- mutate System1 Formal Core.

### Hidden post-#762 blocker exposed

The daily diagnostic orchestrator currently remains intentionally non-executing:
`ASSESSOR_POLICIES_READY_DIAGNOSTIC_EVALUATION_NOT_EXECUTED`,
with ranking `NOT_EXECUTED` and capacity `NOT_PRODUCED`.

Therefore merging #762 alone is not sufficient for Stage-1 progress.
Immediately after NC-T01, BUILD_LANE must move into genuine SHORT_MOMENTUM daily evaluation -> RANK-01 -> capacity persistence rather than spending the next cycle on non-launch-critical general completeness.

### Lane implications

- BUILD_LANE: #762 -> NC-T01 -> SHORT_MOMENTUM physical evaluation/capacity is the dominant launch path.
- Research/D16-D18: validate policy-only prospective receipts; do not require Regime for this lane; preserve D18 regime evidence as a separate lane.
- DATA_LANE: continue recent/current PIT integrity and 2024 TPEx recovery, but broader annual-history completeness must not veto Stage-1 unless the actual SHORT_MOMENTUM evaluator/validator proves the missing segment is required.
- SWING_GROWTH: continue as parallel second-strategy readiness; do not use its unresolved FUNDAMENTAL_QUALITY/INDUSTRY_THESIS as a global Stage-1 blocker.
- System1: sentinel only unless SDA-022 comparator or other explicit escalation condition triggers.

Formal Core remains LOCKED.


## 00 A1 root-cause split — publication lag vs transport integrity

Independent read-only live diagnosis after run `37577209442` separates the A1 failure into two classes:

1. TWSE current A1:
   - independent live GET returned HTTP 200 / valid JSON / 1,381 rows;
   - source date still `1151006` (2026-10-06);
   - therefore the immediate blocker is source publication/readiness timing at the canonical endpoint, not parse failure.
   - Official TWSE daily-closing product documentation has production batches approximately at 14:00, 15:30 and 17:30; exact OpenAPI timing is not asserted equal.
   - A collector ending before the later official production horizon cannot safely equate poll exhaustion with end-of-day unavailability.

2. TPEx current A1:
   - independent live GET returned HTTP 200 / valid complete JSON / about 4.67 MB / 12,245 rows;
   - source date = `1151007` (2026-10-07);
   - current-day source publication is therefore physically observable by the later read;
   - earlier `NON_JSON_RESPONSE` states in GitHub polling are classified as transient acquisition/body-integrity risk, not proof of current-day source absence.

This strengthens `S2-CORR-20261007-001`:
- TWSE remediation must include later-observation/finality design;
- TPEx remediation may use bounded acquisition retry only under fail-closed integrity guards;
- one generic retry policy must not obscure the distinct source states.

Launch-critical consequence:
A1 remains the true current-data blocker for the SHORT_MOMENTUM narrow Stage-1 path.
B2 remains SWING_GROWTH-specific and must not regain global Stage-1 blocking status solely for symmetry.

Formal Core remains LOCKED.


## 00 prospective terminal intake + strategy-specific blocker split — 2026-10-07

Observed latest main before write:
`38c99f2df324b820211831a00bf40fd6708cf8f0`.

Prospective Clock Evidence run `37577209442` reached terminal SUCCESS.
00 independently inspected job logs and immutable artifacts instead of equating workflow SUCCESS with evidence readiness.

### A1 daily gate — NOT READY

Artifact:
`system2-a1-arrival-2026-10-07-37577209442`
digest:
`sha256:4b2b436015a385c89402d071d9f1c8efc644b6fda2707962263a272b81553ef2`.

Collector window:
2026-10-07 13:37:25 -> 16:11:02 Asia/Taipei approximately.

Terminal result:
- dailyGateComplete=false;
- decisionClockStatus=BLOCKED_DEPENDENCIES;
- decisionClockFrozen=false.

Observed failure semantics include:
- TWSE A1 returned HTTP 200 but target-date rows were not present; observed payload date remained 2026-10-06 during the sampled window;
- TPEx A1 produced HTTP-200 NON_JSON responses in some probes and later target-date-not-present states;
- no source state is converted to zero, no-trade, bearish or strategy failure.

Therefore 2026-10-07 is NOT a valid exact decision-clock strategy-evaluation sample from this collector.

### A5 / B2 dependency split

Artifact:
`system2-required-dependencies-2026-10-07-37577209442`
digest:
`sha256:a2b94b923095ade2a650477df94fa2154b9557625321430a7b41539966f5833c`.

A5_QUARTERLY_FINANCIALS:
- coverage READY;
- TWSE EPS ordinary symbols 1084;
- TWSE profit ordinary symbols 1054;
- matched same-vintage count 1054;
- TPEx EPS ordinary symbols 892;
- TPEx profit ordinary symbols 885;
- matched same-vintage count 885;
- dominant vintage 2026Q2;
- dependencyCoverageEligible=true;
- publicationTimestampProven=false;
- admissible semantics remain prospective first-observed upper-bound, not company filing time.

B2_INDUSTRY_THESIS_PROSPECTIVE:
- dependencyCoverageEligible=false;
- final dependency state SOURCE_ERROR;
- TWSE/TPEX profile transport observed HTTP 200 NON_JSON responses;
- TPEx daily also observed HTTP 200 NON_JSON;
- TWSE daily target date remained 2026-10-06 in the final sampled receipt;
- derived snapshot incomplete;
- thesisDirectionAssigned=false;
- strategyScoreAssigned=false.

### Immutable daily bundle

Artifact:
`system2-decision-clock-daily-2026-10-07-37577209442`
digest:
`sha256:9e1ff9c1ad5a88406095b405a057ce97c90ef051fe347ef13eb8a204388b1baf`.

Final evidence:
- requiredReady=false;
- precisionEligible=false;
- a5AvailableByCandidate=false;
- candidateTimestamp=null;
- exactDecisionClockAuthorized=false;
- cronAuthorized=false;
- externalMutationPerformed=false.

### Launch-path consequence

This terminal sample sharpens, rather than expands, the launch blockers.

SHORT_MOMENTUM:
- does NOT require B2 INDUSTRY_THESIS;
- does NOT require MARKET_REGIME for the frozen launch policy;
- remains blocked today by A1 exact same-date decision-clock readiness plus the engineering chain (#762 -> NC-T01 -> genuine evaluator/rank/capacity).

SWING_GROWTH:
- independently remains blocked by B2 INDUSTRY_THESIS_PROSPECTIVE not ready;
- A5 coverage readiness alone cannot manufacture a growth thesis;
- its blocker must not be promoted into a global SHORT_MOMENTUM/Stage-1 blocker.

Therefore first-launch scheduling remains:
#762 canonical -> physical NC-T01 -> SHORT_MOMENTUM genuine daily evaluation when A1 is decision-clock ready -> RANK-01 -> first immutable capacity receipt.

Research lane status for this sample:
TERMINAL_NEGATIVE_READINESS_EVIDENCE_ACCEPTED.
It is a valid prospective source-availability/clock observation but NOT a strategy-performance sample and NOT a zero-pick day.

Formal Core remains LOCKED.


## 00 exact continuation after deep Stage-1 compression

Current true state:
- assessor policies are READY for authorized Shadow evaluation; old ASSESSOR_POLICY_NOT_FROZEN launch text is historical/stale;
- 60-prior-session gaps are symbol-local when global universe accounting is intact; they do not globally block clean symbols;
- PARTIAL denominator capacity -> pool -> resonance provenance is already verified and may monitor clean admissions; false zero-pick remains prohibited;
- SHORT_MOMENTUM is the narrow Stage-1 lead path and does not wait for B2/SWING_GROWTH symmetry;
- A1 current/prospective source readiness is the highest live-data blocker under `S2-CORR-20261007-001`;
- PR #762 remains stale/open and non-canonical; latest-main rebuild is still required;
- G4 middle-layer evaluation -> ranking -> capacity implementation already exists; remaining delta is genuine physical wiring/readback;
- bounded pool / resonance / institutional read surfaces are already built and independently freshness/provenance guarded.

Fresh DATA_LANE activity:
- annual workflow run `37593983170` started via `workflow_dispatch` at 2026-10-07 16:28 Asia/Taipei on main head `5c50a246bf91f9b1bc37c99f082bdfec467d5f09`;
- migrate PASS;
- backfill currently IN_PROGRESS at this readback;
- year/market inputs are not yet independently visible from the non-terminal API/log, so 00 does NOT yet label it 2024/TPEX.

Exact next 00 actions:
1. consume BUILD_LANE latest-main replacement of #762 if/when it appears; require exact-head checks before canonical fingerprint acceptance;
2. consume terminal run `37593983170`; verify actual year/market + physical verify + artifact + System1 isolation before advancing DATA_LANE;
3. track `S2-CORR-20261007-001` implementation without seizing DATA_LANE conflict units;
4. if a later same-day TWSE source observation is taken, treat it as secondary diagnosis only; canonical promotion still requires the repaired prospective collector receipt;
5. after A1 READY + canonical System2 fingerprints, require physical NC-T01 around genuine SHORT_MOMENTUM and reuse the existing evaluation/ranking/capacity middle layer where contract-safe;
6. no B2/SWING_GROWTH symmetry wait, no synthetic zero-pick, no System1 fallback.

Formal Core LOCKED.


## 00 deep post-compression audit — 2026-10-07 16:40 Asia/Taipei

Observed main before correction write:
`03948c48745a9ebccafa92051e9bce48cb1a8fcb`.

### New launch-critical contradiction: global Decision Clock still over-gates SHORT_MOMENTUM

The earlier single-strategy critical-path compression is governance-valid but not yet runtime-executable.

Current global daily clock still freezes:
- same-session candidate = A1 TWSE + A1 TPEx + B2;
- global requiredReady additionally depends on A5 being available by that candidate boundary.

Latest D16 strategy-stage dependency audit explicitly states:
`GLOBAL_REQUIRED_SET != SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET`.

Frozen Stage-1 SHORT_MOMENTUM policy does not require B2 INDUSTRY_THESIS or A5 fundamental evidence, while SWING_GROWTH does require its PIT-valid thesis/fundamental families.

Therefore a second launch-critical correction is now open:
`S2-CORR-20261007-002`.

Routing:
- HIGH / OPEN;
- BUILD_LANE;
- ownerDecisionRequired=true because strategy/stage execution-clock routing changes admissible decision behavior even though the inconsistency itself is audit-proven.

The required repair is NOT to weaken or rewrite the existing global Decision Clock.
It is to preserve that artifact and add an explicit strategy/stage dependency-aware readiness path with real-date physical proof.

### A1 timing-window diagnosis

S2-CORR-20261007-001 remains valid, but its root classes are now further separated:
- the 2026-10-07 prospective A1 collector exhausted around 16:11 Taipei after 30 x 300-second attempts;
- the System2 daily diagnostic is scheduled at 18:35 Taipei;
- official TWSE documentation for related daily closing products includes later production cycles up to approximately 17:30, although this does not prove the exact free OpenAPI endpoint follows the identical schedule.

Therefore:
- TWSE prior-date payload at 16:11 must be treated as observed-not-ready, not proof of end-of-day unavailability;
- DATA_LANE should test later observation/finality coverage rather than applying transport retry to a genuinely stale-date payload;
- TPEx NON_JSON/body-integrity failures remain a distinct bounded transport/body recovery problem;
- a later genuine same-day observation can close readiness only prospectively; it may not backdate an earlier candidate clock.

### Revised shortest truthful Stage-1 chain

1. #762 latest-main canonical fingerprint acceptance;
2. physical NC-T01 on at least one independent strategy path;
3. close/approve the minimal strategy-stage clock mismatch correction (S2-CORR-20261007-002);
4. obtain genuine same-day A1 readiness under S2-CORR-20261007-001;
5. execute real SHORT_MOMENTUM Stage-1 evaluation under exact frozen policy id/version;
6. strategy-local RANK-01;
7. first immutable `s2_capacity_runs` receipt with explicit denominator provenance;
8. Candidate Board -> bounded monitor pool -> Daily Resonance;
9. guarded advisory/notification promotion only after existing owner/promotion gates.

SWING_GROWTH/B2/A5 remain parallel second-strategy work and must not be promoted back into a global SHORT_MOMENTUM blocker.

Formal Core remains LOCKED.


## 00 current-cycle reconciliation — 2026-10-07 19:27:51 Asia/Taipei

Observed latest main before this reconciliation:
`eb7058e0ba5c37ce5153777799da595e99b11bbe`.

This section supersedes only the CURRENT navigation/status interpretation of older same-day sections. Historical observations remain append-only evidence.

### 1. Stage-1 current A1 is physically READY; old launch-critical A1 classification is superseded

Scheduled System2 Daily Shadow Diagnostic run `37609474459` physically succeeded for marketDate `2026-10-07`.

Observed current Stage-1 source path:
- TWSE latest OpenAPI remained prior-date, then `A1_TWSE_MI_INDEX_EXACT_DATE_PROSPECTIVE` succeeded for 2026-10-07 with 1,086 normalized ordinary rows;
- TPEx latest OpenAPI returned HTTP 200 / NON_JSON_RESPONSE, then `A1_TPEX_DAILY_QUOTES_EXACT_DATE_PROSPECTIVE` succeeded for 2026-10-07 with 887 normalized ordinary rows;
- total A1 ordinary symbols = 1,973;
- prospective history readback = VERIFIED;
- preflight `capacityWriteAuthorized=true`;
- immutable D1 readback = VERIFIED;
- System1 runtime use = false;
- final selection / push / capital / orders remain false.

Therefore `S2-CORR-20261007-001` is now MEDIUM and scoped to prospective Decision Clock/source-arrival collector divergence only. It is no longer a proven Stage-1 A1 ingestion blocker.

Durable audit:
`system2/evidence/S2_CORR_20261007_001_SCOPE_RECLASSIFICATION_20261007_V0_1.json`.

### 2. S2-CORR-20261007-002 is REJECTED_WITH_EVIDENCE

Latest-main runtime readback disproves the assumed coupling between the broad A1+B2+A5 research Decision Clock and the actual Stage-1 execution/capacity path.

Current Stage-1 preflight / Limited Shadow / capacity runtime does not consume B2/A5/global `requiredReady` for SHORT_MOMENTUM.

The global-vs-strategy dependency mismatch remains a valid research/watchlist observation, but it is not a current HIGH launch-path defect and must not consume BUILD_LANE implementation capacity.

Durable rejection:
`system2/evidence/S2_CORR_20261007_002_REJECTION_VERIFICATION_20261007_V0_1.json`.

### 3. PR #762 is stale-base but semantically current

Independent drift audit against latest main found:
- PR #762 head = `a5487086ba15f844d775e12bc7ce2c3852749644`;
- PR base is stale;
- all 11/11 source-artifact blob SHAs pinned by the fingerprint implementation still exactly match latest main;
- all 8/8 PR-added paths remain unoccupied on main;
- SHORT_MOMENTUM / SWING_GROWTH strategy versions, assessor-policy IDs/versions and required-family semantics still match the canonical Stage-1 freeze;
- old PR-head fingerprint CI / System2 Research CI / V8 Regression were PASS, but they cannot substitute for post-rebase exact-head verification.

Disposition:
do NOT redesign the fingerprint implementation from scratch.
BUILD_LANE exact next is latest-main rebase/rebuild -> regenerate receipts -> exact-head fingerprint CI + System2 Research CI + V8 Regression -> canonical merge.

Durable drift audit:
`system2/evidence/S2_STAGE1_PR762_DRIFT_AUDIT_20261007_V0_1.json`.

### 4. Physical NC-T01 can be compressed to a read-only proof

After canonical #762 fingerprints, the shortest truthful NC-T01 S22-T11~T16 path is:
- real official current A1;
- real isolated-D1 PIT history;
- System1 Top6 input unavailable=false? NO: receipt must explicitly record `system1Top6InputAvailable=false`;
- System1 rank input `false`;
- no cached/persisted/alias/cross-project/stale System1-selection fallback;
- execute real SHORT_MOMENTUM assessor + physical strategy-run path;
- freeze the canonical `SDA022_NC_T01_RECEIPT_V0_1` receipt and result hash;
- legitimate zero-pick may PASS independence; missing inputs/runtime failure/dependency fallback may not.

Important:
the successful 2026-10-07 Daily Shadow diagnostic is seed/input-readiness evidence only. It did not execute strategy evaluation and therefore cannot itself satisfy NC-T01.

The existing remote D1 REST adapter supports SELECT-only `.first()` / `.all()` reads. A minimal NC-T01 proof therefore does not inherently require a D1 row write or `s2_capacity_runs` persistence and need not wait for the current write-quota reset if BUILD_LANE keeps the proof read-only and artifact-only.

Durable handoff:
`system2/evidence/S2_STAGE1_NC_T01_MINIMAL_PHYSICAL_HANDOFF_20261007_V0_1.json`.

### 5. New recurrent cross-lane quota correction

`S2-CORR-20261007-003` is HIGH / OPEN / REMEDIATION_LANE.

Physical sequence:
- Daily Shadow Diagnostic run `37609474459` succeeded with D1 `rowsWritten=13130`;
- approximately 22 minutes later historical run `37611914140` (#30) failed in migrate before backfill because Cloudflare returned the free-tier daily row-write-limit error;
- a materially equivalent free-tier quota block previously occurred during 2021 TPEx work.

Shared writer concurrency prevents simultaneous writes but does not create a daily write budget/reservation/priority policy.

Required remediation:
one System2-wide free-tier-safe UTC-day D1 write-budget / writer-priority contract, explicit quota deferral, no invented exact remaining quota, and no automatic paid-plan upgrade.

Durable diagnosis:
`system2/evidence/S2_CORR_20261007_003_D1_QUOTA_COORDINATION_DIAGNOSIS_V0_1.json`.

### 6. Historical DATA_LANE state

2024 TPEx remains NOT ACCEPTED.

Timeout hardening 60 -> 120 minutes is repository-ready and CI-clean, but fresh run #30 never reached backfill because the D1 free-tier daily row-write quota was already exhausted.

Current physical retry cannot usefully proceed before the free-tier reset:
`2026-10-08 08:00 Asia/Taipei`,
unless the REMEDIATION quota-governance fix changes the execution plan without paid billing.

No paid Cloudflare upgrade is authorized.

### Current dynamic priority after reconciliation

1. BUILD_LANE — rebase/canonicalize PR #762 on latest main, then execute the minimal real-data/read-only NC-T01 SHORT_MOMENTUM proof.
2. BUILD_LANE — use the same genuine strategy execution path to continue strategy evaluation -> strategy-local RANK-01 -> capacity persistence when D1 write headroom truthfully permits it.
3. REMEDIATION_LANE — implement `S2-CORR-20261007-003` global D1 free-tier write-budget / priority coordination.
4. DATA_LANE historical — retry 2024 TPEx only after free-tier reset / safe quota gate; do not buy a paid tier automatically.
5. DATA_LANE research evidence — close MEDIUM `S2-CORR-20261007-001` by aligning the prospective clock collector with the already-working Stage-1 exact-date source-selection contract.
6. System1 — DEFAULT_LAST / SENTINEL_ONLY unless an explicit escalation condition appears.

Formal Core remains LOCKED.
Final selection, live push, capital and real orders remain disabled.


## 00 continuation delta — PR #762 semantic-drift audit + minimal NC-T01 physical contract (2026-10-07 19:28 Asia/Taipei)

Observed latest main during audit advanced concurrently; audit writes preserved latest-main re-read semantics.

### PR #762 — stale base, but source-bound semantics remain current

Independent exact blob readback found:
- all 11 source artifacts hard-bound by the fingerprint generator remain byte/blob-SHA identical to latest main;
- all 8 PR-added paths remain absent from main, so no path-occupancy conflict was found;
- SHORT_MOMENTUM and SWING_GROWTH strategy/version/policy/required-family identities remain aligned with the frozen Stage-1 assessor policy;
- old PR-head fingerprint/System2/V8 CI are valid historical evidence only and cannot replace exact-head verification after latest-main rebuild.

Durable audit:
`system2/evidence/S2_STAGE1_PR762_DRIFT_AUDIT_20261007_V0_1.json`.

Disposition:
- do not redesign #762;
- BUILD_LANE should rebuild/rebase on latest main, regenerate receipts, rerun exact-head fingerprint + System2 Research CI + V8 Regression, then canonical merge;
- only merged-main evidence may credit S22-T06~T10.

Audit comment was posted directly to PR #762 with the narrowed continuation.

### NC-T01 — implementation-ready as a thin physical runner

Canonical oracle/schema already exist:
- `shared-knowledge/SDA022_ACCEPTANCE_ORACLE_V0_1.md`;
- `shared-knowledge/sda022_nc_t01_receipt_schema_v0_1.json`.

Existing main already provides:
- `SHORT_MOMENTUM_CONTRACT_V0_1`;
- Limited Shadow spec `S2-SM-LS-001`;
- `assessStage1StrategyV0_1`;
- `runDailyLimitedShadowOrchestratorV0_1`;
- exact-date official A1 path;
- PIT history reader/coverage;
- immutable Limited Shadow run/prediction/persistence-batch construction.

Physical 2026-10-07 Daily Shadow Diagnostic run `37609474459` already proved the input layer:
- same-date exact-date official A1 = READY;
- symbolCount = 1,973;
- `capacityWriteAuthorized=true`;
- prospective history + immutable D1 readback verified;
- `system1RuntimeUsed=false`.

It deliberately did NOT execute strategy evaluation and therefore is not itself NC-T01.

Minimal physical NC-T01 after canonical fingerprints:
1. workflow_dispatch-only System2 research runner;
2. System1 Top6/rank unavailable by construction;
3. explicit hidden-fallback audit rejects cached/persisted/alias/cross-project/stale System1 selection state;
4. real official A1 + isolated PIT history;
5. SHORT_MOMENTUM assessor bound directly to the existing daily Limited Shadow orchestrator;
6. canonical NC-T01 receipt binds source generation, strategy identity, decision clock, universe provenance and result hash;
7. legitimate zero-candidate execution may pass physical independence only when required inputs are READY and execution actually completed;
8. no final selection, live push, capital, orders or System1 Formal mutation.

Durable audit:
`system2/evidence/S2_STAGE1_NCT01_MINIMAL_PHYSICAL_EXECUTION_CONTRACT_20261007_V0_1.json`.

This is expected BUILD_LANE continuation, not a new correction.

### Updated true critical path

1. latest-main rebuild/canonical merge of #762;
2. physical NC-T01 S22-T11~T16;
3. genuine daily SHORT_MOMENTUM execution;
4. strategy-local RANK-01;
5. first truthful immutable `s2_capacity_runs` receipt with denominator provenance;
6. bounded pool -> Candidate Board / Daily Resonance consumption.

Formal Core remains LOCKED. No broker-order/live-capital authority is added.

## 00 deep continuation delta — first executable NC-T01 witness narrowed to TWSE single-window continuity certification (2026-10-07 20:50:50 Asia/Taipei)

Observed latest main before write:
`a1cee8d9b3dc8363a74a710409366e4bd23ccea3`.

This section supersedes the older shorthand "#762 -> NC-T01" where it omits the newly isolated continuity witness gate.

### Physical blocker exposed by the current Stage-1 seed

Daily Shadow Diagnostic run `37609474459` physically proved:
- current A1 source path READY for 2026-10-07;
- current universe = 1,973 ordinary symbols;
- global PIT/history integrity sufficient for authorized Shadow evaluation with symbol-local gaps;
- `historyReadyCount=51`;
- `continuityReadyCount=0`;
- `evaluationInputEligibleSymbolCount=0`.

Therefore an NC-T01 runner alone cannot yet satisfy S22-T13. At least one symbol must first obtain a source-honest continuity witness.

Durable audit:
`system2/evidence/S2_STAGE1_NCT01_SINGLE_WITNESS_CONTINUITY_OVERLAY_AUDIT_20261007_V0_1.json`.

### NC-T01 read/write execution footprint

00 independently verified:
- the existing history loader performs one per-symbol PIT SELECT;
- the remote D1 REST adapter supports `db.batch()`;
- current historical A1 indexes are suitable for symbol/window reads;
- the remaining concern is REST round-trip fanout, not a missing SQL index;
- a bounded batch/prefetch transport layer should preserve the existing per-symbol PIT SQL semantics;
- first one-strategy Limited Shadow + capacity persistence is estimated at about 21.7k D1 `rowsWritten` from current table/index topology, subject to physical `meta.rows_written` override.

Durable audit:
`system2/evidence/S2_STAGE1_NCT01_G4_D1_FOOTPRINT_AND_READ_PATH_AUDIT_20261007_V0_1.json`.

### First continuity witness can be TWSE-only

The existing corporate-action archive core derives `requiredExchanges` from the actual `requiredSourceContracts`; it does not hard-require both TWSE and TPEx.

For a first TWSE witness such as physically history-ready symbol 1101, the bounded evidence package may therefore require only:
- TWSE ex-right/ex-dividend historical actual-result range;
- TWSE capital-reduction historical actual-result range;
- TWSE par-value-change historical actual-result range;
- exact-window TWSE suspension/session lifecycle evidence;
- exact-window PIT universe membership.

TPEx parity remains parallel work and is not a prerequisite for the first TWSE NC-T01 witness.

The archive core already supports evidence readiness when:
- universe coverage complete;
- exact-range required source coverage complete;
- revision coverage complete;
- event reconciliation unambiguous;
- required-exchange suspension coverage complete.

It then sets:
- `noEventMayBeClaimed=true`;
- `symbolSessionCompletenessEvidenceReady=true`.

But canonical runtime deliberately keeps:
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`.

Repository search found no canonical runtime that promotes the evidence-ready state to a consumable continuity certification. Current `CLEAR_NO_ACTION` use is fixture-level only.

Durable audit:
`system2/evidence/S2_STAGE1_NCT01_TWSE_SINGLE_WITNESS_PROMOTION_CERTIFIER_AUDIT_20261007_V0_1.json`.

### Exact current critical path

1. BUILD_LANE: rebuild/rebase and canonically merge System2 SDA-022 fingerprints S22-T06~T10 from PR #762 on latest main; regenerate receipts and rerun exact-head fingerprint CI + System2 Research CI + V8 Regression.
2. DATA_LANE in parallel: produce one exact-window TWSE continuity evidence package for a physically history-ready symbol. Do not assume 1101 is clean; certify or fail closed from real source evidence.
3. BUILD_LANE: implement the smallest versioned promotion certifier that may map only a valid hash-bound witness to `CLEAR_NO_ACTION`; add mixed-continuity regression and bounded-batch PIT prefetch. Do not rewrite history or create a second strategy evaluator.
4. Execute full-universe read-only/artifact-only NC-T01. Preserve all 1,973-symbol provenance; at least one certified witness must be READY/EXECUTED, while uncertified symbols remain INCOMPLETE and denominator-accounted.
5. 00 independently verifies S22-T11~T16 and hidden-fallback evidence.
6. REMEDIATION_LANE closes CORR-003 enough to truthfully reserve D1 write headroom for the first persisted genuine SHORT_MOMENTUM -> RANK-01 -> `s2_capacity_runs` run.
7. Reuse bounded pool / Candidate Board / Daily Resonance / institutional surfaces; only after the existing promotion gate may guarded advisory/notification authority be reviewed.

### Non-blockers / parallel work

- TPEx continuity parity does not block the first TWSE witness.
- Full historical market-year completion does not globally veto the narrow Stage-1 witness when its exact required window is certified.
- SWING_GROWTH B2/A5 does not block the first SHORT_MOMENTUM independence proof.
- Regime UNKNOWN remains non-blocking for the policy-only Stage-1 witness.
- System1 stays sentinel-only unless an explicit SDA-022 comparator/escalation condition appears.

Formal Core remains LOCKED.
Final selection, live push, capital and real orders remain disabled.

## 00 supersession — NC-T01 continuity must bind the exact PIT replay window (2026-10-07 20:56:39 Asia/Taipei)

Observed latest main before write:
`cd007c029de49721eaa44c584c462919682925a5`.

The preceding single-witness continuity section is retained as chronology but is incomplete if interpreted as permitting a string-only continuity resolver.

### Runtime readback

Latest-main inspection proves:
- `buildPitReplayWindow` preserves selected raw/PIT rows and revision identity;
- `buildA1HistoryPrimitiveBundle` does NOT require historical D1 rows themselves to be rewritten from `UNVERIFIED`; continuity-sensitive factor eligibility is controlled by one top-level continuity state;
- therefore immutable historical D1 rows may remain unchanged.

However:
- `resolveContinuityState` currently executes BEFORE the PIT replay window is built;
- it returns only a text state;
- the current factor `sourcePayloadHash` hashes normalized date/OHLC/volume/tradeValue and does not bind a continuity receipt;
- current factor/candidate provenance does not retain `continuityReceiptId`, `sourceHistoryHash` or `continuityTransformHash`.

Therefore a continuity receipt is not currently provably bound to the exact selected PIT revisions/session set consumed by the factor engine.

Durable audit:
`system2/evidence/S2_STAGE1_NCT01_CONTINUITY_REPLAY_BINDING_AUDIT_20261007_V0_1.json`.

### Shared contract reuse

D03 already froze the needed continuity identity/provenance semantics:
- `continuityReceiptId`;
- `sourceHistoryHash`;
- `rawHistoryAdmissionReceiptId`;
- `symbolSessionContractVersion`;
- `sessionCalendarVersion`;
- `continuityEngineVersion`;
- `corporateActionRegistryVersion`;
- `continuityTransformHash`;
- exact expected eligible-session set;
- exact ordered bar/source identities.

System2 Stage-1 should reuse those shared identity semantics at its 61-session window length rather than inventing a second continuity model.

### First witness is CLEAR_NO_ACTION only

Current A1 primitive code treats both `CLEAR_NO_ACTION` and `ADJUSTED_CONTINUITY` as continuity-eligible, but current daily orchestration feeds RAW historical bars and does not apply a TECHNICAL_CONTINUITY price transform.

Therefore:
- first NC-T01 witness may promote only `CLEAR_NO_ACTION`;
- `ADJUSTED_CONTINUITY_REQUIRED` must remain fail-closed until an actual transformed technical-continuity window is supplied;
- merely returning the string `ADJUSTED_CONTINUITY` over RAW bars is prohibited.

### Exact BUILD_LANE runtime delta

1. Build the raw PIT replay window first.
2. Compute the exact ordered raw-window identity.
3. Validate a versioned continuity receipt after replay selection.
4. Require receipt symbol/asOf/cutoff/date set/`sourceHistoryHash` to match the selected live replay window.
5. Bind continuity receipt identity/hashes into factor/candidate provenance.
6. Only then pass `CLEAR_NO_ACTION` to the A1 factor primitive builder.
7. Any drift/mismatch remains `UNVERIFIED` / INCOMPLETE.

Required regressions include source-row drift, date-set drift, post-cutoff receipt, wrong symbol/date, missing receipt/hash, unresolved gaps/events and RAW+`ADJUSTED_CONTINUITY` rejection.

This narrows, rather than expands, the work: no D1 history rewrite and no second corporate-action/indicator engine are required.

Formal Core remains LOCKED.



## 00 supersession — CORR-20261007-004 exact-session gate precedes physical NC-T01 S22-T13 (2026-10-07 20:59:04 Asia/Taipei)

Observed latest main before audit evidence:
`f6cfa41e4bd88cb0d5cfa0286d585d81192dc729`.

A new DATA_LANE HIGH correction changes the interpretation of the earlier single-witness continuity path:

`S2-CORR-20261007-004` — long-listed Daily Shadow history readiness can silently substitute an older row for a missing expected symbol-session.

Independent runtime verification confirms:
- `daily_shadow_history_reader_v0_1.mjs` ranks available PIT rows by date and accepts the latest required count;
- for long-listed symbols, `ageLimited=false` makes `ageBoundaryMatches=true`;
- `historyReady` therefore checks count + ambiguity but does not reconcile the exact expected eligible-session set;
- a missing recent required session can be silently replaced by an older row while count remains 60;
- existing regressions do not falsify this case.

Durable verification:
`system2/evidence/S2_CORR_20261007_004_INDEPENDENT_CODEPATH_VERIFICATION_20261007_V0_1.json`.

NC-T01 consequence:
- the 51 symbols reported `historyReady=true` in run `37609474459` are NOT automatically trusted as continuity-witness seeds;
- symbol 1101 remains only a candidate for exact-window investigation, not a prequalified clean witness;
- `continuityReadyCount=0` / `evaluationInputEligibleSymbolCount=0` means no immediate strategy misuse is proven;
- physical S22-T13 must wait until at least one symbol passes exact eligible-session reconciliation and then a hash-bound continuity receipt matches that exact replay window.

Durable supersession:
`system2/evidence/S2_STAGE1_NCT01_EXPECTED_SESSION_GATE_SUPERSESSION_20261007_V0_1.json`.

### Revised parallel critical path

May continue now:
1. BUILD_LANE: latest-main rebuild/canonical merge of SDA-022 policy fingerprints S22-T06~T10;
2. BUILD_LANE: continuity receipt/hash binding and bounded PIT batch/prefetch engineering;
3. REMEDIATION_LANE: CORR-003 account-level D1 quota-budget governance;
4. DATA_LANE: CORR-20261007-001 prospective clock collector alignment.

Must complete before physical NC-T01 S22-T13:
1. DATA_LANE: repair CORR-20261007-004 with exact expected eligible symbol-session reconciliation;
2. physical Daily Shadow readback proves at least one exact-window history-ready witness;
3. continuity receipt binds exact date set / revision identity / sourceHistoryHash to the replay window consumed by factor primitives;
4. first witness may promote only `CLEAR_NO_ACTION` over RAW history; `ADJUSTED_CONTINUITY` remains fail-closed until a real transformed technical-continuity window exists;
5. then execute artifact-only NC-T01 and independently verify S22-T11~T16.

Formal Core remains LOCKED. No final selection, live push, capital or order authority is enabled.
