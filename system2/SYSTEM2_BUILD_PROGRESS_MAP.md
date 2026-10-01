# System 2 Build Progress Map

Updated: 2026-10-02 Asia/Taipei  
Status: CANONICAL_BUILD_PROGRESS_MAP  
Scope: System 2 engineering/research build sequence  
System 1 / V8 Formal Core impact: NONE

## Purpose

This file is the canonical engineering progress map for System 2. It separates:
- repository/design complete;
- physically deployed;
- prospective evidence accumulating;
- implementation pending;
- owner-gated production authority.

GitHub `main` remains authoritative. Chat summaries are context only.

## Status legend

- ✅ COMPLETE / VERIFIED — implemented and, where relevant, physically verified.
- 🟡 IN PROGRESS / PARTIAL — useful components exist, but the end-to-end lane is not complete.
- ⏳ PLANNED / WAITING EVIDENCE — preregistered or mapped, not yet promoted.
- 🔒 OWNER GATE — explicit owner approval required before activation.
- ❌ NOT BUILT — no trustworthy implementation exists yet.

## End-to-end System 2 map

| ID | Layer | Status | Current truth / next dependency |
|---|---|---|---|
| S2-01 | Governance / System isolation | ✅ | Shared Knowledge + System 1/System 2 isolation established. |
| S2-02 | Data-source contracts / PIT clocks | 🟡 | Core source contracts exist; additional sources continue through PIT/availability verification. |
| S2-03 | Historical infrastructure | 🟡 | D1/R2, manifests, checkpoints, receipts, PIT Replay/Bulk Backtest primitives exist; full 2017-present cold history completion remains separate work. |
| S2-04 | Market Regime / shared 18-domain research | 🟡 | Shared research network active; not every research finding is a production factor. |
| S2-05 | Factor Engine / family assessments / UNKNOWN semantics | 🟡 | Core contracts and research plumbing exist; richer validated factors remain incremental. |
| S2-06 | Multi-strategy contracts | 🟡 | Strategy families and Shadow contracts exist; exact live weights/thresholds remain evidence-gated. |
| S2-07 | Daily PIT-safe Shadow Orchestrator | ❌ | Current primary upstream gap: full-market source -> factor -> strategy -> ranking -> capacity -> frozen receipt is not yet physically producing daily `s2_capacity_runs`. |
| S2-08 | Frozen Daily Decision / immutable archive | 🟡 | Schema/runtime primitives exist; depends on S2-07 for real daily prospective cohorts. |
| S2-09 | Ranking / capacity / overlap / concentration | 🟡 | Research engines and receipts exist; daily physical production depends on S2-07. |
| S2-10 | 19:00 next-session bounded pool | ✅ | Physically deployed; same-date/PIT freshness guarded; stale pools fail closed; max 9 unique, no forced filling. |
| S2-11 | User-video Daily Resonance baseline | ✅ | EMA16 + EMA64 + Impulse MACD; 0/3 to 3/3; intraday PROVISIONAL, closed-day CONFIRMED; bounded pool only. |
| S2-12 | Resonance Challenger comparison lane | ⏳ | **Now formally mapped.** Same pool/data/clock comparison against S2-11; Challenger formula not frozen yet. See dedicated contract below. |
| S2-13 | Fugle live bounded monitor | ✅ | Worker secret configured; Ticker/adjusted history/Quote path deployed; no intraday full-market scan. |
| S2-14 | Resonance D1 persistence / episodes / operations audit | ✅ | Schema V1.1, 46 isolated `s2_` tables; snapshots/latest/runs/episode events and 19:00 operations audit deployed. |
| S2-15 | System 2 Worker / Cron | ✅ | `system2-shadow-research`; one consolidated Cron; four System 1 Cron triggers untouched. |
| S2-16 | UI / read API | 🟡 | Resonance UI, pool API, operations API, health live; full multi-strategy/performance/backtest dashboard still pending. |
| S2-17 | Execution simulation / position lifecycle | 🟡 | Minimum research runtime exists; automated future-session outcome loop remains incomplete. |
| S2-18 | Strategy performance engine | 🟡 | Metrics/spec/storage concepts exist; trustworthy prospective sample population depends on S2-07 and downstream outcomes. |
| S2-19 | PIT Replay / Bulk Backtest | 🟡 | Engines exist; broad historical dataset and multi-strategy evidence expansion remain incomplete. |
| S2-20 | OOS / Forward / Prospective Shadow promotion evidence | ⏳ | Requires independent dates/regimes, cost/slippage, redundancy, overfit/multiple-testing and date-clustering checks. |
| S2-21 | Strategy version promotion / live capital / real order | 🔒 | Not authorized; requires evidence packet + explicit owner approval. |

## Resonance comparison lane — Baseline vs Challenger

### Role separation

**Baseline**  
`USER_VIDEO_RESONANCE_V0_1`

- owner-specified monitoring logic;
- current deployed reference lane;
- daily EMA16 / EMA64 / Impulse MACD;
- 0/3 -> 3/3 progression;
- PROVISIONAL before daily finality;
- CONFIRMED only after provider finality plus independent close-time gate.

**Challenger**  
`SYSTEM2_RESONANCE_CHALLENGER_V0_1`

- research-only alternate monitor designed by System 2;
- starts from the general architecture: Trend + Momentum + Price/Structure Confirmation;
- exact indicator family, lookback and threshold parameters are **NOT frozen by this map**;
- parameters must be preregistered before prospective comparison and cannot be changed retroactively after outcomes are known;
- cannot alter the Baseline signal, pool membership, capital, push, or order behavior.

### Mandatory fair-comparison contract

Both lanes must observe the **same**:
- bounded preselected stock pool;
- symbol membership and strategy membership;
- market date and observation timestamps;
- raw market-data/source vintage;
- current daily-bar finality semantics;
- corporate-action/adjustment semantics;
- transaction-cost/slippage assumptions for outcome evaluation;
- outcome horizons and MFE/MAE calculation window;
- Regime labels used for stratification.

No lane may receive a better data vintage or hindsight-only feature.

### Minimum immutable record

For every symbol / market date / observation clock / resonance version:
- monitor version;
- formula/parameter version;
- source receipt hash;
- pool id / capacity run id;
- 0/3–3/3 or equivalent component states;
- PROVISIONAL / CONFIRMED / RETRACTED state;
- first trigger timestamp;
- trigger price reference;
- final daily close state;
- signal retraction / whipsaw state;
- 1/3/5/10/20 trading-day forward returns when available;
- MFE / MAE;
- transaction-cost/slippage-adjusted outcome;
- Trend/Range and broader market Regime;
- whether the signal preceded, matched, lagged or disagreed with the other lane.

Historical records are immutable. A new parameter set requires a new Challenger version.

### Comparison questions

The lane exists to answer:
1. Which version triggers earlier?
2. Which version retracts or whipsaws more often?
3. Which version has better MFE/MAE geometry after trigger?
4. Which version survives costs better?
5. Which version behaves better in Trend vs Range and Risk-on vs Risk-off?
6. Does the Challenger add residual information beyond the Baseline, or is it merely a correlated restatement of EMA/MACD?
7. Are any apparent gains concentrated in one date cluster, industry or Regime?
8. Does either version reduce opportunity/capital utilization excessively?

### Promotion rule

The Challenger begins as **Shadow-only**.

It cannot replace, modify, veto, or add conditions to `USER_VIDEO_RESONANCE_V0_1` merely because backtest results look better. Promotion requires:
- preregistered version;
- PIT-safe replay and prospective Shadow;
- OOS and independent-date evidence;
- Trend/Range + Regime robustness;
- repaint/whipsaw analysis;
- cost/slippage;
- MFE/MAE;
- redundancy/incremental-value evidence;
- overfit / multiple-testing controls;
- explicit owner approval.

The comparison should **not** combine both lanes into a stricter four/five/six-condition live rule by default; that would risk recreating a low-trigger "always waiting" system without evidence.

## Phase placement

- **P3 Strategy / Shadow scoring:** preregister Challenger formula/version and comparison hypothesis.
- **P4 Frozen archive / simulated execution:** persist side-by-side immutable observations and outcomes.
- **P5 Performance / attribution:** expose Baseline vs Challenger performance, timing, retraction and Regime splits.
- **P6 OOS / Forward validation:** decide whether Challenger is incremental, redundant, regime-specific or rejected.
- **P7 / Owner gate:** only an explicitly approved version may affect user-visible formal monitoring authority.

## Current continuation priority

1. Build S2-07 Daily PIT-safe Shadow Orchestrator so real daily `s2_capacity_runs` exist.
2. Observe the first truthful 19:00 pool-refresh audit and next-session bounded monitor cycle.
3. Implement S2-12 Challenger preregistration + immutable paired capture on exactly the same bounded pool.
4. Accumulate paired prospective samples before any Challenger promotion decision.
5. Continue historical/PIT/OOS/performance infrastructure in parallel.

No step above authorizes real orders, live capital allocation, System 1 Formal changes, or forced stock selection.
