# Research Checkpoint

Updated: 2026-09-21T20:48+08:00

## Continuity / baseline
- Formal Core: LOCKED.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback must override remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.

## Repository state recovered this cycle
- `RESEARCH_ENGINEERING_GOVERNANCE.md` exists on main and defines Class A/B/C boundaries and protected formal invariants.
- `RESEARCH_WORKLIST.md` exists on main and records implementation through V8.7.11 research evidence work, R01-R08 governance, maturity/readiness/anti-overfit diagnostics, and Formal Core LOCKED.
- `RESEARCH_CHECKPOINT.md` was required by the durable-continuity protocol but was absent from main (404). This file is created as a Class A research-governance continuity artifact only; it cannot alter formal selection/runtime behavior.
- Production HTTP readback could not be obtained in this cycle because the available web fetch path reported the Worker URL inaccessible. Therefore no Production version/health claim is made here.

## Last completed research direction
Priority 5 — Supply-Chain Lead-Lag.

### Research question
Can point-in-time confirmed customer/supplier relationships provide incremental lead-lag information after controlling own momentum, sector/residual momentum, size/liquidity and classical factor exposure, without network look-ahead?

### Supporting evidence carried forward
- Prior research supports information diffusion along economically linked customer/supplier relationships and fundamental information transmission.
- A potentially useful interaction hypothesis remains: confirmed edge × customer fundamental surprise × supplier information state / disclosure proximity.

### Counterevidence carried forward
- Much cross-firm lead-lag can disappear after controlling common factor exposures, size/liquidity and own/sector momentum.
- Customer momentum can decay post-publication and can be confounded with large-to-small lead-lag.
- Taiwan disclosure-based customer/supplier identity can be sparse or coded, so absence of an observed edge is UNKNOWN rather than no relationship.

### Redundancy / bias firewall
- Must control `residualSectorRs20`, own momentum and liquidity/size before calling residual predictability Supply-Chain Alpha.
- Do not double-count `positiveDayRatio20` / information discreteness if used only as an interaction diagnostic.
- No current-news supply-chain map may be backfilled into historical dates.
- Relationship edges require source publication timestamp / `known_at` eligibility.
- Coverage and identity disclosure are expected to be non-random; selection/market-source bias must be measured.

### UNKNOWN / data quality
- Unidentified/coded customers, sub-10% relationships, unavailable historical disclosure vintages and unverified edge start/end dates remain UNKNOWN.
- No zero-imputation for missing edges.

### R01-R08 / I01-I07 impact
- No experiment definition is promoted or modified in this checkpoint.
- Existing R01-R08/I01-I07 remain unchanged pending evidence that Supply-Chain adds incremental information beyond existing research factors.

## Engineering classification / actions this cycle
- Class A: created this durable `RESEARCH_CHECKPOINT.md` continuity record because the required checkpoint file was absent. Documentation/governance only; no runtime code, formal output, monitoring, push, capital or selection path changed.
- Branch/commit: written directly as a documentation-only main commit via GitHub contents API because no runtime code is touched; resulting commit is recorded by GitHub write response.
- Tests: code/runtime tests not applicable to this documentation-only addition. Formal invariants are unchanged by construction because only a Markdown file is added.
- Deployment: none requested or claimed; no Worker code changed.
- Rollback: delete/revert this Markdown-only commit if needed.

## Unfinished items / blocker
1. Production readback/health/version remains unverified this cycle because the available web fetch tool could not access the Worker URL.
2. Supply-Chain PIT coverage/UNKNOWN-rate feasibility remains the next research task; no ingestion code should be added before coverage is measured.

## Exact next continuation point
Resume Priority 5 at **Taiwan point-in-time supply-chain edge coverage / UNKNOWN-rate feasibility**. Quantify whether official/reliable disclosures provide enough identified, timestamped customer/supplier edges for prospective research. Measure identified-vs-coded-vs-UNKNOWN coverage and disclosure clustering. Only if coverage is adequate should a Class A isolated proposal for `supplyChainEdgeAsOf`, `known_at`, `relationship_strength`, and `identity_status` be implemented. If coverage is too sparse/non-random, keep Supply-Chain as a research hypothesis and do not add system complexity. After resolving this gate, proceed to Priority 6 Execution Alpha.
