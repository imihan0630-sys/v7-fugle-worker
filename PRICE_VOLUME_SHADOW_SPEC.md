# Price-Volume Shadow Research Specification

Status: RESEARCH_ONLY / decisionImpact=false / Formal Core LOCKED

This file operationalizes the research conclusions in `PRICE_VOLUME_RESEARCH.md` through PV-037. It is a specification, not an implementation approval.

## Objective
Test whether contextual price-volume states add incremental information to the existing selector/monitor, especially:
1. same-slot 15m relative volume vs the current previous-5-bar volume ratio;
2. cumulative-volume pace;
3. structural acceptance / failure;
4. direction vs risk outcomes;
5. market/sector-common vs stock-specific abnormal participation.

## Formal isolation
Shadow PV must not change A/B eligibility, ranking, 3+3 selection, BUY/ADD/REDUCE, maxChase, stop, capital allocation, push semantics or ABF re-add.

Every stored snapshot must have `decisionImpact=false`.

## Minimum feature set

### Reuse existing Worker fields
- volumeTodayVsPrev5
- volumeContraction5to20
- avgVolume20Lots
- avgAmount20
- dailyClosePosition
- dailyUpperShadowRatio
- lateStage / ret20
- sector / institutional context
- 15m previous-5-bar volumeRatio

### Add daily Shadow fields
- pvDailyRvol20
- pvMarketResidualRvol
- pvSectorResidualRvol
- pvPersistenceState
- pvGuardState
- pvEventAgeTradingDays
- pvDaysSincePeakRvol
- coverage/provenance/schemaVersion

### Add 15m Shadow fields
- pvSlotRvol20
- pvCumvolPace20
- pvResponseState
- pvAcceptanceState
- pvPersistenceState
- pvGuardState
- slotHistoryCount
- completedBar
- coverage/provenance/schemaVersion

## Taiwan market-structure guards
Add to intraday/context semantics:
- pvSessionPhase = OPEN_AUCTION_MIXED / CONTINUOUS / CLOSE_AUCTION_MIXED / UNKNOWN
- pvViState = KNOWN_VI / KNOWN_NO_VI / UNKNOWN only when a reliable source exists; never infer VI from OHLCV shape
- referencePriceGuard = NORMAL / EX_RIGHTS_DIVIDEND / CORPORATE_ACTION / UNKNOWN
- unsupported market structures (e.g. TPEx Emerging Stock Board) => pvGuardState=UNSUPPORTED_MARKET_STRUCTURE

Shadow v0.1 normalization is frozen as:
- pvDailyRvol20 = current daily volume / median(prior 20 valid daily volumes)
- pvSlotRvol20 = current 15m slot volume / median(prior 20 valid same-slot volumes)
- pvCumvolPace20 = current cumulative volume through slot / median(prior 20 valid cumulative volumes through same slot)

Mean/log/MAD/percentile variants may be stored for diagnostics but are not additional scores.

## Proposed D1 schema

### v7_pv_shadow_snapshots
- snapshot_id TEXT PRIMARY KEY
- symbol TEXT NOT NULL
- market_date TEXT NOT NULL
- observed_at TEXT NOT NULL
- observation_type TEXT NOT NULL
- schema_version TEXT NOT NULL
- event_key TEXT
- features_json TEXT NOT NULL
- context_json TEXT
- coverage_json TEXT
- source_json TEXT
- decision_impact INTEGER NOT NULL DEFAULT 0
- created_at TEXT NOT NULL

Logical identity: symbol + observed_at + observation_type + schema_version.

### v7_pv_outcomes
One row per snapshot/horizon:
- snapshot_id TEXT NOT NULL
- horizon TEXT NOT NULL
- completed_at TEXT
- direction_return REAL
- mfe REAL
- mae REAL
- range_atr REAL
- stop_first INTEGER
- false_break INTEGER
- acceptance_result TEXT
- outcome_complete INTEGER NOT NULL DEFAULT 0
- outcome_json TEXT
- PRIMARY KEY(snapshot_id,horizon)

Outcome data never rewrite feature snapshots.

### v7_pv_intraday_baselines
Selected/monitored symbols only:
- symbol TEXT PRIMARY KEY
- baseline_version TEXT NOT NULL
- valid_sessions INTEGER NOT NULL
- last_market_date TEXT
- slot_stats_json TEXT NOT NULL
- corporate_action_reset_at TEXT
- updated_at TEXT NOT NULL

## Data/API design
- Daily PV uses the existing full-market daily history cache whenever coverage is valid.
- Bootstrap a 15m same-slot baseline only for a newly monitored symbol lacking one.
- Historical 15m baseline requires >=20 prior valid sessions.
- After bootstrap, roll the cache forward; do not refetch the historical window on every monitor cycle.
- Missing history / failed refresh => UNKNOWN, never neutral RVOL=1.
- Full-market 15m residualization is deferred.

Fugle source semantics:
- historical intraday data starts 2023-05-23;
- 15m is supported;
- listed-stock intraday volume is lots while daily volume is shares;
- index volume semantics differ from listed-stock volume;
- adjusted=true is documented only for daily/weekly/monthly price candles.

References:
- https://developer.fugle.tw/docs/data/http-api/historical/candles/
- https://developer.fugle.tw/docs/data/http-api/intraday/candles/

## No-look-ahead invariants
1. Intraday features use completed bars only.
2. Same-slot baselines use sessions strictly before marketDate.
3. Cumulative pace compares only through the same slot.
4. Eventual full-day volume never enters an earlier live snapshot.
5. RETEST/REACCELERATION creates later states; prior rows stay immutable.
6. Outcomes are joined only after horizon completion.
7. Corporate-action resets prevent mixing incompatible volume regimes.

## Required tests
- slot mapping and completed-bar boundary;
- >=20 valid-session boundary;
- missing/halted sessions excluded rather than zero-filled;
- intraday lots vs daily shares never raw-cross-divided;
- robust median/MAD edge cases;
- zero/near-zero historical volume;
- gap/price-limit/corporate-action/ex-rights guards;
- auction-session phase classification;
- 1m-to-15m fixture test to verify Fugle 15m bucket boundaries before freezing open/close semantics;
- unsupported-market-structure guard;
- leave-one-out sector median;
- freshness / days-since-peak;
- future-data mutation test;
- later-retetest mutation test;
- D1/API failure => Shadow UNKNOWN and Formal unchanged.

Formal-isolation regression test must prove identical selected symbols, ranks, plan prices, BUY/ADD/REDUCE states, allocation and push events with Shadow enabled vs disabled.

## Research outcome targets
Direction and risk are separate:
- D1/D3/D5/D10
- MFE / MAE
- ATR-normalized excursion/range
- stop-first when a valid plan existed at t
- false-break / failed acceptance
- reacceleration
- coverage

## Rollout
1. LOG_ONLY
2. DATA_QA (~first 50 completed events; semantics only)
3. EVIDENCE after predeclared coverage gates
4. Compare current previous-5-bar volumeRatio against pvSlotRvol20 + pvCumvolPace20
5. Evaluate incremental value after existing selector features
6. Any Formal proposal is separate Class C work requiring owner approval

## Current highest-value experiment
Does same-slot 15m RVOL + cumulative-volume pace explain false confirmations / no-follow-through better than the current previous-5-bar volume ratio?

No Formal change is implied by this specification.


## Governance levels
All current PV research is Level 0 OBSERVER.
- OBSERVER: log/explain/segment only; no Formal effect.
- MODIFIER: future Class C only after stable incremental evidence and owner approval.
- VETO: data-semantic guards may invalidate PV interpretation; they do not reject the Formal stock. Predictive trading veto is not approved.

## Event baseline
When an abnormal-volume episode starts, preserve:
- ordinary rolling prior-20 median baseline;
- frozen pre-event baseline inside the event record.

Use the frozen baseline for persistence/decay within the episode so later high-volume event days do not redefine their own reference. Do not blanket-exclude all earnings/news days from the ordinary median.

## First prospective experiment
Cohort: symbols already selected/monitored by Formal only. PV does not alter cohort inclusion.

Compare:
A. existing context/Formal fields;
B. A + current previous-5-bar 15m volumeRatio;
C. B + pvSlotRvol20;
D. C + pvCumvolPace20;
E. D + pvResponseState / pvAcceptanceState / pvGuardState.

Primary outcomes:
- false/no-follow-through;
- MFE/MAE;
- structural acceptance/failure.

Secondary:
- D1;
- stop-first where a valid plan existed;
- maxChase adverse excursion.

First ~50 completed events are DATA_QA only. Evidence review follows the predeclared PV-024 coverage milestones. No threshold retuning at each milestone.

## Deferred Tier 2
- market/sector residual RVOL;
- divergence continuous fields using as-of confirmed pivots;
- issued-share turnover with timestamped official shares;
- event freshness/decay;
- sector leader/follower timing;
- late-stage PV interaction.

## Prospective-only / deferred microstructure
- limit lock duration / unlock count / queue history;
- full historical volume-at-price;
- trade-count baselines;
- explicit VI state without authoritative event data;
- free-float turnover without timestamped free-float data.


## Frozen outcome labels
A and B are evaluated separately.

### B anchor
First completed 15m bar satisfying the existing Formal B breakout-confirmed definition. Freeze breakout/retest/maxChase/stop and anchor OHLC at that time.

Outcomes:
- B_FAILED_REENTRY_B1/B2/B4: close < breakout*0.995
- B_RETEST_ZONE_LOST_B1/B2/B4: close < frozen retestLow
- B_NO_CLOSE_PROGRESS_B1/B2/B4: no later close > anchor close
- B_NO_HIGH_PROGRESS_B1/B2/B4: no later high > anchor high
- continuous MFE/MAE always stored

### A anchor
First Formal A BUY-confirmed completed 15m bar.

Outcomes:
- A_ZONE_LOST_B1/B2/B4: close < frozen buyLow
- A_STOP_BROKEN_B1/B2/B4: only if stop existed at anchor
- A_NO_CLOSE_PROGRESS_B1/B2/B4
- A_NO_HIGH_PROGRESS_B1/B2/B4
- continuous MFE/MAE

## Horizon semantics
- B1/B2/B4 are same-session future completed 15m bars only.
- If the session ends before the required horizon, mark INCOMPLETE_SESSION_END.
- NEXT_OPEN / NEXT_SESSION_HIGH_LOW / NEXT_CLOSE are separate overnight/next-session outcomes.
- D1/D3/D5/D10 use official future trading dates, not calendar days.

## Finalizer
- snapshots immutable;
- outcomes upsert by snapshot_id+horizon;
- complete only when all source bars/dates exist;
- every-minute reruns are idempotent;
- completed outcomes must remain semantically identical under rerun.

## Resource boundary
Current Formal monitor max is 6 stocks.
The ordinary intraday PV layer must reuse already-fetched 15m frames and add zero duplicate live candle calls.
One historical 15m bootstrap is allowed per newly monitored symbol lacking >=20 valid-session baseline; then roll cache forward.

At 18 x 15m slots and 6 symbols, full-bar logging ceiling is 108 feature rows/trading day. Unique bar-end identity prevents every-minute duplicate writes.

## Research reporting
Admin/research surface only until evidence matures.
Report:
- event vs snapshot counts;
- coverage/UNKNOWN/guards;
- A/B and regime/session splits;
- existing local volumeRatio vs slot RVOL/cumulative pace;
- false/no-progress;
- MFE/MAE;
- model A→E incremental comparisons.

Do not emit PV-based BUY/SELL, grade changes, capital changes or push signals.
