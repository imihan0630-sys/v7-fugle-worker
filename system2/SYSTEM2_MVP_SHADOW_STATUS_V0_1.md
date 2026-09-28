# System 2 MVP + Shadow Production Status V0.1

Updated: 2026-09-28 Asia/Taipei  
Status: ENGINEERING_BASELINE / P0_IMPLEMENTATION_IN_PROGRESS  
Authority: GitHub main only. Chat memory is non-authoritative.

## Purpose

This file separates what is already implemented from what is only designed, and defines the shortest remaining path to Shadow Production（影子正式運行）without waiting for all 226 learning modules.

Target operating model:

System 2 engineering + daily Shadow selection + Prediction Snapshot（預測快照） + outcome/performance tracking + ongoing learning-room research proceed in parallel.

This does not enable real-money trading and does not change System 1 / V8 Formal Core.

## 1. Implemented and reusable now

### Governance / architecture

Implemented:
- Shared Knowledge governance and cross-system routing.
- System 2 architecture, factor contracts, strategy contracts, Market Regime（市場狀態） V0 and strategy preregistration.
- System 1 / System 2 isolation and production-isolation CI guards.
- Global candidate capacity architecture: max 12 unique symbols; per-strategy active monitor max 3.
- Candidate lifecycle / ranking research scaffolding and immutable strategy-version semantics.

### Decision-time data / provenance

Implemented:
- immutable factor observations with KNOWN / UNKNOWN / STALE / INVALID / NOT_APPLICABLE states;
- PIT（Point-in-Time，時點一致性） availableAt enforcement;
- Market Regime snapshot contract;
- family-assessment receipts;
- strategy-state evaluator;
- source-readiness receipts;
- full-universe Shadow accounting receipt;
- source-session receipt;
- run fingerprint and replay/provenance checks;
- immutable frozen decision archive and decision hash;
- append-only / conflict-detecting decision-time persistence batch.

### Storage

Implemented and physically verified:
- isolated D1 database: `system2-research`;
- binding: `SYSTEM2_DB`;
- schema V1.0 is physically applied and contains 39 `s2_` tables, including external cold-pack manifests, resumable checkpoints, completion receipts and historical-universe registry receipts;
- write/read sentinel verification and replay-safe persistence;
- no System 1 / V8 production D1 reuse.

Physical qualification note: isolated D1 schema V1.0 migration plus write/read verification passed in GitHub run `36434206278`. The isolated R2 bucket and credentials have not yet been provisioned/read back. V0.9 inline smoke packs remain read-compatible, but new multi-year backfill is routed only through the external cold-object path and is manual-only until isolated R2 credentials exist.

Existing schema already contains:
- factor snapshots;
- market/industry snapshots;
- decisions;
- Shadow runs;
- ranking / capacity / lifecycle receipts;
- simulation orders/fills/positions;
- outcomes;
- strategy daily performance;
- experiment / provenance receipts.
- external cold-pack manifests/checkpoints/receipts and historical-universe registry receipts (schema V1.0 applied to isolated `system2-research`; no R2 objects populated yet).

### Worker / deployment skeleton

Implemented and smoke-verified:
- isolated Worker: `system2-shadow-research`;
- health-only fetch route in current code;
- isolated D1 binding;
- `SYSTEM2_CAPTURE_ENABLED=false`;
- scheduled capture fails closed;
- Worker Cron count = 0;
- workers.dev / Preview exposure remains off;
- no System 1 runtime/service binding.

Important: the Worker skeleton exists, but it is not yet a functioning daily Shadow runner.

### Source readiness / official evidence

Implemented:
- official source-arrival probes and Decision Clock（決策時間點） evidence contracts;
- independent TWSE trading-day gate;
- A5 quarterly-filing vintage observer;
- B2 industry snapshot observer;
- automated read-only GitHub Actions evidence collection;
- anti-cherry-picking coverage/finalization/readiness checks.

The first ordinary eligible prospective Decision Clock evidence date remains 2026-09-29.

### Ranking / capacity research plumbing

Implemented:
- RANK-01 strategy-local Pareto baseline without arbitrary numeric weights;
- ranking experiment receipts;
- global candidate pool capacity logic;
- active monitor capacity logic;
- overlap / concentration / displacement research receipts.

These are research plumbing, not authorization to freeze a final production strategy ranking rule.

### New P0 implementation on 2026-09-28

Merged to main:

1. PR #221 / merge commit `b4a433a56da29426da6c4155449490542b518b87`
   - fixed Shadow full-universe accounting so `SELECTED` is a valid accounted state;
   - added Prediction Snapshot V0.1 projection;
   - archives Selected / Near-miss / Important Rejected without changing upstream selection rules;
   - preserves company name, time, strategy/version, rank/score if explicitly defined, factor observations, regime, entry plan, thesis, invalidation, reasons/warnings and immutable hashes;
   - does not relabel normalized factor values as strategy scores;
   - preserves zero-pick days;
   - outcome join requires valid run fingerprint evidence.

2. PR #222 / merge commit `4d7e8f5d0538cd0f67eb03cd1d962287e4972e18`
   - added A1 per-symbol daily snapshot adapter for TWSE / TPEx;
   - normalizes company name, OHLC（開高低收）, volume shares/lots, trade value, transaction count and change;
   - preserves source fields, per-row hash and source provenance;
   - filters to ordinary four-digit equities for this adapter;
   - fails closed on duplicate symbols, cross-market duplicate symbols, OHLC inconsistency, insufficient coverage or source observation after the Decision Clock;
   - no-trade / no-price rows are preserved explicitly rather than silently dropped.

3. PR #223 / merge commit `714f560a4ed6ae150b3ed623ea88574041730e4b`
   - added System 2 decision outcome tracker V0.1;
   - computes D1 / D3 / D5 / D10 / D20 signal returns;
   - computes MFE（最大有利幅度） and MAE（最大不利幅度） through 20 sessions;
   - computes benchmark-relative and industry-relative returns when references exist;
   - observes target-first / stop-first / AMBIGUOUS_SAME_BAR without pretending daily OHLC proves intraday execution order;
   - supports explicit cost-scenario returns while keeping them distinct from simulated realized fills;
   - only populates realized return after cost when an execution simulator result is explicitly supplied;
   - enforces contiguous future sessions, data available-by-time, one price space and monotonic outcome updates;
   - marks performance ineligible when corporate-action state is UNKNOWN.

All three PR heads passed System2 Research CI and V8 Regression before merge.

## 1A. Ordered 1→6 engineering foundation now present (2026-09-28)

The owner-authorized build sequence now has repository-side executable foundations for all six ordered layers:

1. A1 Historical Window（歷史視窗） / factor primitives — implemented and CI-verified.
2. Historical Store（歷史資料庫） — append-oriented normalized A1 storage contract + isolated D1 migration implemented.
3. PIT Replay（時點重播） — availableAt-gated replay with fail-closed revision ambiguity implemented.
4. Bulk Backtest Runner（大量回測執行器） — full-universe partitioning, no hard symbol cap, checkpoint/resume and rolling digest implemented.
5. Historical Base Dataset（歷史基礎研究樣本庫） — Selected / Near-miss / Important Rejected archive projection and persistence records implemented. Final SELECTED remains owner-gated.
6. Daily Shadow Orchestrator（每日影子編排器） — limited research-only orchestrator implemented; final selection and scheduled capture remain disabled.

Incremental backfill support is also implemented:
- initial Core lane default start: 2017-01-01;
- per-market last-stored date determines the next effective start date;
- already-caught-up ranges create zero work units instead of reloading the full history;
- backfill work is chunked and checkpoint/resume capable;
- tests explicitly verify 2026-09-24 → 2026-09-25 continuation.

Important limitation: this is an executable engineering foundation, **not** a claim that the 2017→present official historical dataset has already been physically populated. The next P0 step is isolated R2 provisioning plus D1 schema V1.0, followed by bounded object/manifest qualification, staged official TWSE/TPEx annual ingestion and the first real full-market replay.

## 1B. Packed historical cold-store path verified and externalized (2026-09-28)

The legacy V0.9 validation established the packed representation before externalization:
- schema V0.9 adds `s2_historical_a1_packs` and `s2_historical_pack_ingest_receipts`;
- packs are keyed by market + symbol + year + price-space;
- payloads are canonicalized, hashed, gzip-compressed and Base64-stored;
- reruns are idempotent; differing content at the same logical pack key fails closed as an immutable conflict;
- query/unpack reconstructs ordinary historical bars with conservative per-date session-close `availableAt` semantics for PIT replay.

Real official-source + isolated-D1 smoke run `36427386634` PASS:
- 2026-08-03→2026-08-31 (21 trading dates);
- TWSE 2330/2454 and TPEx 3105/6488;
- 84 packed bars round-tripped exactly through D1;
- observed gzip payload ratio was about 0.41 and Base64 storage ratio about 0.54–0.56 versus canonical JSON;
- System1 production isolation PASS and V8 Regression `36427386650` PASS.

The full-market one-month benchmark is complete: 41,456 bars became 1,977 packs; gzip was 1,389,468 bytes and Base64-in-D1 would have been 1,855,256 bytes. The conservative 4.7M-bar projection was about 150.2 MiB gzip or 200.6 MiB Base64 payload before SQLite/index/receipt overhead. This accepted yearly per-symbol packs as the preferred cold representation and rejected row-wise multi-million-bar D1 storage.

The production-quality research path now externalizes compressed bytes:
- schema V1.0 table `s2_historical_a1_pack_manifests` stores only deterministic object keys, payload/object hashes, coverage, source metadata and byte counts;
- compressed `.json.gz` objects are written immutably to isolated Cloudflare R2; D1 does not store `gzip_base64` on the new path;
- object SHA-256 is verified before manifest commit and again on read; same logical key with different immutable content fails closed;
- `s2_historical_cold_backfill_checkpoints` supports chunk resume and immutable retry validation, while `s2_historical_cold_ingest_receipts` is written only after all objects and manifests are ready;
- a completed-receipt rerun recomputes the manifest rolling hash and verifies every referenced R2 object before it can return `ALREADY_COMPLETE`;
- legacy V0.9 inline packs remain read-only compatible for existing bounded smoke evidence;
- unpacked rows now preserve actual backfill `observedAt`, conservative session-close `availableAt`, deterministic `barHash` and source provenance, so they can feed PIT Replay directly;
- `createHistoricalColdBacktestLoadersV0_1` connects D1 survivorship-registry membership and R2 cold packs to the existing partitioned Bulk Backtest Runner;
- historical-universe registries now have rerun-safe immutable persistence and completion receipts.

The 2017 annual backfill workflow is manual-only and requires a separately isolated R2 bucket plus least-privilege object read/write credentials. No R2 resource or 2017 full-market cold backfill is claimed complete yet.

PR #245 qualification evidence:
- System2 Research CI run `36434552698` PASS;
- V8 Regression run `36434552278` PASS;
- isolated D1 schema V1.0 physical smoke run `36434206278` PASS;
- bounded official-source V0.9 pack compatibility/readback run `36434541564` PASS after source-row provenance was made opt-in for the new external-cold annual path.

The isolated D1 schema V1.0 migration is therefore complete. R2 provisioning/readback and the 2017 annual external-cold population remain pending and are not claimed complete.

## 2. Designed but not yet fully implemented

The following are not allowed to be described as complete:

- end-to-end daily orchestrator:
  source fetch -> per-symbol history -> factor observations -> family assessments -> strategy state -> ranking/capacity -> final cohort -> Prediction Snapshot -> isolated D1 persistence;
- physical 2017→present external cold-object population and readback qualification;
- full per-company fundamental metric extraction for SWING_GROWTH; current A5 observer proves filing/vintage coverage, not the complete quantitative factor set;
- B2 directional industry thesis / strategy score; current B2 observer derives prospective industry snapshot but explicitly does not assign thesis direction or strategy score;
- final `SELECTED` authorization policy for the initial strategies;
- final strategy weights / thresholds / score floors;
- automated post-decision outcome collection and D1 update job;
- execution-simulator runtime implementation for gaps, limits, tradability, slippage, commissions/tax and fill sequencing;
- corporate-action-normalized outcome source integration;
- public/read-only Shadow query API;
- System 2 UI/dashboard;
- exact after-close Decision Clock;
- enabled Worker Cron / always-on Shadow capture.

## 3. Remaining P0 before Shadow Production

P0 means required to operate a trustworthy automated Shadow loop, not merely to display a prototype.

### P0-A: daily data-to-factor pipeline

Required:
- fetch official A1 TWSE/TPEx daily payloads into the new per-symbol adapter;
- add verified historical lookback needed by technical/price-volume factors;
- turn source snapshots into versioned factor observations;
- attach company names / market / source hashes / availableAt;
- preserve UNKNOWN instead of imputing missing inputs.

### P0-B: end-to-end full-market orchestrator

Required:
- establish the daily ordinary-equity base universe and exclusion reasons;
- guarantee every eligible symbol is accounted for;
- run source readiness, factors, family assessments and strategy-state evaluation;
- construct rank/capacity receipts;
- construct and persist frozen decision + Prediction Snapshot evidence;
- make run fingerprint complete before outcome joining.

### P0-C: initial final-selection policy — OWNER GATE

Current limited Shadow specs intentionally have final selection disabled.

A daily `SELECTED` cohort cannot be truthfully produced until the initial final-selection policy is frozen.

This affects formal System 2 strategy behavior and therefore requires explicit owner approval before activation. Engineering may prepare comparison candidates and tests first, but must not silently invent or enable the policy.

### P0-D: automated outcome / execution loop

Repository-side outcome math now exists. Still required:
- collect post-decision future sessions automatically;
- update `s2_outcomes` under monotonic revision guards;
- feed benchmark and industry references;
- integrate corporate-action state;
- implement the minimum execution simulator runtime;
- keep signal return, simulated gross return and net-after-cost return separate;
- preserve AMBIGUOUS_SAME_BAR rather than selecting the favorable path.

### P0-E: Decision Clock + scheduled capture — OWNER GATE

The prospective evidence program remains active and read-only.

Still required:
- accumulate independent official trading-date evidence;
- reach the preregistered Decision Clock evidence gates;
- propose exact after-close clock for owner review;
- separately obtain owner approval before enabling System 2 Worker Cron / capture.

No current code change should bypass this gate.

### P0-F: full-market historical backtest / Base Dataset engine

Backtest capability is now a core System 2 engineering requirement, not an optional later tool.

P0 must provide:
- Historical Data Store（歷史資料庫） for normalized reusable daily/history inputs;
- PIT Replay（時點重播） that evaluates each historical decision date using only data available at that time;
- Bulk Backtest Runner（大量回測執行器） using batch/partition/stream processing, not manual per-symbol execution;
- checkpoint/resume so long multi-year full-market runs can continue after interruption;
- reusable factor cache so parameter/strategy comparisons do not repeatedly download/recompute unchanged primitives;
- strategy/policy/version pinned replay;
- historical full-universe accounting with Selected / Near-miss / Important Rejected samples;
- Base Dataset（基礎研究樣本庫） generation for later incremental-factor, falsification, OOS and Regime research;
- outcome linkage to D1/D3/D5/D10/D20, MFE/MAE, benchmark/industry-relative performance and execution-cost scenarios.

The P0 architecture must support the whole eligible Taiwan-equity universe over multi-year windows. Historical replay must explicitly preserve listing/delisting and survivorship boundaries, corporate-action state, source provenance, availableAt/firstKnownAt and UNKNOWN semantics. Historical backtests may inform research but must never be relabeled as prospective Shadow evidence.

Repeated bulk historical studies should preferentially read official/history stores and cached normalized data. Fugle API usage, if any, should be contract-specific and should not be the default transport for every repeated historical replay.

## 4. P1 after Shadow Production begins

P1 improves usability and breadth but should not delay the first trustworthy Shadow records:

- read-only API for daily selections, near-misses, rejected diagnostics and outcomes;
- UI/dashboard for strategy / regime / industry attribution;
- scheduled performance summaries;
- richer A3 institutional / A4 TDCC / A6 valuation / A7 event integration where source contracts are ready;
- broader execution/slippage calibration;
- partial-fill modeling;
- better industry benchmark construction;
- operator observability / alerts for failed daily runs;
- more detailed strategy-correlation and concentration reporting;
- XQ-style interval/condition backtest surface: reusable condition API, parameter sweeps, strategy-version A/B comparison, Regime/industry/year stratification, exportable trade/sample details and optional UI/dashboard for research operators.

## 5. P2 / P3 long-term expansion

Do not block MVP on these:

- promotion of additional strategy families beyond the first limited Shadow pair;
- remaining 226 learning modules and deeper falsification work;
- validated interaction/confluence models;
- Regime x Strategy adaptive weighting after PIT / OOS / Shadow evidence;
- richer event transmission / supply-demand / inventory / capacity models;
- advanced valuation / forward-estimate datasets;
- portfolio optimization and capital-allocation research;
- ML / statistical models only after leakage, redundancy, date clustering and multiple-testing controls are satisfied.

## 6. Reuse decision: what can be carried forward

| Component | Reuse status | Boundary |
|---|---|---|
| Shared Knowledge research | YES | evidence can be shared; System 1 Formal logic cannot be imported as System 2 authority |
| V8 production Worker runtime | NO direct reuse | do not bind System 2 to V8 production runtime |
| V8 production D1 / KV | NO | System 2 uses isolated `system2-research` D1 |
| System 2 isolated D1 | YES | already provisioned / verified |
| System 2 Worker skeleton | YES | health shell is reusable; actual capture/orchestration still missing |
| Official TWSE / TPEx sources | YES, contract-by-contract | PIT / availability / schema validation remains mandatory |
| A5 / B2 observers | YES | current semantics are evidence/observer semantics, not full strategy scores |
| GitHub Actions System2 Research CI | YES | required regression/isolation gate |
| Decision Clock evidence Actions | YES | remain read-only and cannot be relabeled as Worker Cron |
| isolated D1 provision / Worker audit / smoke workflows | YES | retain confirmation / isolation guards |
| current public API | PARTIAL | only health route exists; no Shadow read API |
| System 2 UI | NO current implementation | P1 |
| execution simulator | SPEC ONLY | runtime still P0-D |

## 7. Shortest safe path from here

Engineering order:

1. Provision the isolated System2 R2 history bucket and least-privilege object credentials; apply isolated D1 schema V1.0.
2. Run staged 2017 TWSE/TPEx external cold-pack backfill, verify object hashes/manifests/receipts/universe coverage, then continue year by year.
3. Full-market orchestrator through frozen decision / Prediction Snapshot persistence.
4. First real full-market PIT Replay/Bulk Backtest and Historical Base Dataset generation with Selected / Near-miss / Important Rejected and outcome linkage.
5. Automated outcome persistence + minimum execution simulator.
6. Prepare initial final-selection policy candidates and evidence packet for owner approval.
7. Continue Decision Clock prospective evidence in parallel.
8. After owner approvals, arm exact clock + isolated Worker scheduled Shadow capture.
9. Add read API / XQ-style condition-backtest UI after trustworthy data paths exist.

This path deliberately does not wait for the full 226-module research curriculum.

## Safety / scope

This status baseline authorizes no real trades, no System 1 / V8 Formal change, no strategy-weight freeze, no final-selection activation, no Worker Cron activation and no capital allocation.

Research engineering, tests, isolated Shadow plumbing, checkpoints and evidence can continue autonomously within existing governance.
