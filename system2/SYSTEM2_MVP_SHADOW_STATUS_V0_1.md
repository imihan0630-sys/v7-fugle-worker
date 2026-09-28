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
- schema V0.5;
- 26 `s2_` tables;
- write/read sentinel verification and replay-safe persistence;
- no System 1 / V8 production D1 reuse.

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

Additional latest-main implementation discovered during the current audit:

4. PR #225 / merge commit `ba8d05444dce42d84edfc6b79bb68e2e459938aa`
   - added the A1 historical daily-bar primitive engine;
   - derives versioned technical, price-volume and liquidity observations from source-injected history;
   - preserves price-space, volume-unit, corporate-action continuity and PIT fail-closed semantics;
   - does not fetch a provider, assign a strategy score or apply a strategy threshold.

5. PR #226 / merge commit `b3001d6`
   - added the Limited Shadow full-universe run assembler;
   - connects source-session receipt, regime, per-symbol factor snapshots, strategy assessments, frozen decisions, full-universe accounting, run fingerprint, Prediction Snapshot and immutable persistence batch;
   - explicitly refuses to enable the final-selection layer.

6. Minimum execution/outcome persistence runtime V0.1 (current P0 implementation branch)
   - implements explicit entry expiry, gaps, official price-limit validation, halt/liquidity blocks, target/stop/max-holding exits, configurable slippage/commission/tax and same-bar ambiguity;
   - never fabricates an exact fill timestamp from daily OHLC;
   - persists simulated orders/fills immutably and updates `s2_outcomes` only under monotonic revision and optimistic concurrency guards;
   - remains research-only, source-injected and unscheduled.

## 2. Designed but not yet fully implemented

The following are not allowed to be described as complete:

- end-to-end daily orchestrator:
  source fetch -> per-symbol history -> factor observations -> family assessments -> strategy state -> ranking/capacity -> final cohort -> Prediction Snapshot -> isolated D1 persistence;
- production-grade A1 historical-window adapter needed for MA slopes, RVOL, breakout/range/volatility and other multi-session factors;
- full per-company fundamental metric extraction for SWING_GROWTH; current A5 observer proves filing/vintage coverage, not the complete quantitative factor set;
- B2 directional industry thesis / strategy score; current B2 observer derives prospective industry snapshot but explicitly does not assign thesis direction or strategy score;
- final `SELECTED` authorization policy for the initial strategies;
- final strategy weights / thresholds / score floors;
- automated post-decision outcome collection and D1 update job;
- scheduled orchestration around the implemented minimum execution/outcome runtime;
- partial-fill / calibrated market-impact expansion beyond the current all-or-none simulator;
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
- connect the implemented historical primitive engine to the official daily source-fetch path;
- turn source snapshots into versioned factor observations;
- attach company names / market / source hashes / availableAt;
- preserve UNKNOWN instead of imputing missing inputs.

### P0-B: end-to-end full-market orchestrator

Required:
- establish the daily ordinary-equity base universe and exclusion reasons;
- guarantee every eligible symbol is accounted for;
- run source readiness, factors, family assessments and strategy-state evaluation;
- construct rank/capacity receipts;
- extend the implemented one-strategy Limited Shadow assembler into the authorized multi-strategy ranking/capacity/final-cohort chain;
- construct and persist frozen decision + Prediction Snapshot evidence through that chain;
- make run fingerprint complete before outcome joining.

### P0-C: initial final-selection policy — OWNER GATE

Current limited Shadow specs intentionally have final selection disabled.

A daily `SELECTED` cohort cannot be truthfully produced until the initial final-selection policy is frozen.

This affects formal System 2 strategy behavior and therefore requires explicit owner approval before activation. Engineering may prepare comparison candidates and tests first, but must not silently invent or enable the policy.

### P0-D: automated outcome / execution loop

Repository-side outcome math now exists. Still required:
- collect post-decision future sessions automatically;
- invoke the implemented monotonic `s2_outcomes` persistence runtime from an automated job;
- feed benchmark and industry references;
- integrate corporate-action state;
- connect the implemented minimum execution simulator to persisted selected/triggered decisions;
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
- more detailed strategy-correlation and concentration reporting.

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

1. Connect official A1 source retrieval to the implemented per-symbol/history adapters.
2. Extend the Limited Shadow assembler through multi-strategy ranking/capacity while keeping final selection disabled.
3. Connect automated future-session collection to the implemented outcome/execution persistence runtime.
4. Prepare initial final-selection policy candidates and evidence packet for owner approval.
5. Continue Decision Clock prospective evidence in parallel.
6. After owner approvals, arm exact clock + isolated Worker scheduled Shadow capture.
7. Add read API / UI after trustworthy daily records exist.

This path deliberately does not wait for the full 226-module research curriculum.

## Safety / scope

This status baseline authorizes no real trades, no System 1 / V8 Formal change, no strategy-weight freeze, no final-selection activation, no Worker Cron activation and no capital allocation.

Research engineering, tests, isolated Shadow plumbing, checkpoints and evidence can continue autonomously within existing governance.
