# Price-Volume Shadow V0.1 — Implementation Plan

Status: READY_TO_PROPOSE / CLASS_A_RESEARCH_ONLY / NOT_IMPLEMENTED

Canonical engineering semantics for PV_SHADOW_V0_1.
Formal Core remains LOCKED.

## 1. Objective

Collect prospective, immutable price-volume research data for stocks that the existing Formal system already selects/monitors.

Primary experiment:
Does same-slot 15m RVOL + cumulative-volume pace add incremental information beyond the existing previous-5-bar volumeRatio for false/no-follow-through, MFE/MAE and structural acceptance?

PV must not influence cohort selection or any Formal action.

## 2. Feature flag

`PV_SHADOW_ENABLED=false` by default.

OFF:
- no PV bootstrap;
- no PV calculation;
- no PV D1 writes;
- Formal system behaves exactly as before.

ON:
- research-only logging;
- decisionImpact=false;
- no push/action effects.

## 3. Formal functions that MUST remain behaviorally unchanged

Do not modify decision semantics inside:
- `evaluatePullback`
- `evaluateMomentum`
- `evaluateStop`
- `buildFinalDecision`
- `compareResults`
- `evaluateOperationSignals`
- any A/B selection/ranking/capital logic

PV observes copies of their outputs.

## 4. D1 additions

### v7_pv_shadow_snapshots

```sql
CREATE TABLE IF NOT EXISTS v7_pv_shadow_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  market_date TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  observation_type TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  event_key TEXT,
  features_json TEXT NOT NULL,
  context_json TEXT,
  coverage_json TEXT,
  source_json TEXT,
  decision_impact INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
```

Suggested indexes:
- market_date, observation_type
- symbol, observed_at
- event_key

### v7_pv_outcomes

```sql
CREATE TABLE IF NOT EXISTS v7_pv_outcomes (
  snapshot_id TEXT NOT NULL,
  horizon TEXT NOT NULL,
  completed_at TEXT,
  direction_return REAL,
  mfe REAL,
  mae REAL,
  range_atr REAL,
  stop_first INTEGER,
  false_break INTEGER,
  acceptance_result TEXT,
  outcome_complete INTEGER NOT NULL DEFAULT 0,
  outcome_json TEXT,
  PRIMARY KEY(snapshot_id, horizon)
);
```

### v7_pv_intraday_baselines

```sql
CREATE TABLE IF NOT EXISTS v7_pv_intraday_baselines (
  symbol TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL,
  valid_sessions INTEGER NOT NULL,
  last_market_date TEXT,
  slot_stats_json TEXT NOT NULL,
  corporate_action_reset_at TEXT,
  updated_at TEXT NOT NULL
);
```

No existing D1 table is altered or dropped.

## 5. V0.1 field dictionary

Identity:
- snapshotId
- schemaVersion = PV_SHADOW_V0_1
- symbol
- marketDate
- observedAt
- observationType = AFTER_MARKET | INTRADAY_15M
- barStart/barEnd
- eventKey
- decisionImpact=false

Frozen Formal context:
- channel
- planDate
- buyLow/buyHigh/breakout/maxChase/stop/profitCheck
- formalDecisionLevel/text
- formalLocalVolumeRatio

Core PV:
- pvDailyRvol20
- pvSlotRvol20
- pvCumvolPace20
- pvSlotRangeExpansion20
- pvSignedProgress20
- pvBodyShare
- pvPeakRvol
- pvCurrentToPeakRvolRatio

States:
- pvResponseState
- pvAcceptanceState
- pvPersistenceState
- pvGuardState
- pvGuardFlags[]
- pvInterpretability
- pvSessionPhase

Coverage/provenance:
- slotHistoryCount
- dailyHistoryCount
- baselineAsOfDate
- baselineSource
- sourceBarTimestamp
- sourceFetchedAt
- coverageReasons[]
- corporateActionResetAt

Numeric unavailable = null.
State unclassifiable = UNKNOWN.
Never substitute neutral 1.0/0.

## 6. Normalization

V0.1 primary:
- daily RVOL = current daily volume / median(prior 20 valid daily source-family observations)
- slot RVOL = current 15m volume / median(prior 20 valid same-slot intraday observations)
- cumulative pace = observed-session cumulative intraday volume / median(prior 20 valid cumulative volumes through the same slot)

Minimum history = 20 valid sessions.

Daily and intraday raw volume are never cross-divided.

## 7. pvResponseState

Participation:
- LOW <=0.8
- NORMAL >0.8 and <1.3
- ELEVATED >=1.3 and <2.5
- EXTREME >=2.5

Derived:
- slotRangeMedian20
- rangeExpansion20
- signedProgress20
- bodyShare
- closePosition
- upper/lower shadow ratio

States:
- EFFICIENT_UP
- EFFICIENT_DOWN
- HIGH_EFFORT_LOW_PROGRESS
- LOW_EFFORT_LOW_PROGRESS
- NORMAL_RESPONSE
- GUARDED_RESPONSE
- UNKNOWN

Classification uses unrounded raw numbers.

## 8. Acceptance state

B:
B_PRE_EVENT
-> B_BREAKOUT_ATTEMPT
-> B_INITIAL_ACCEPTANCE
-> B_RETEST
-> B_REACCELERATION
or B_FAILED_REENTRY / B_EXPIRED_AMBIGUOUS.

A:
A_PRE_EVENT
-> A_PULLBACK_TEST
-> A_INITIAL_ACCEPTANCE
-> A_REACCELERATION
or A_FAILED_REENTRY / A_EXPIRED_AMBIGUOUS.

Transitions reuse existing Formal geometry; PV fields do not cause transitions.

## 9. Persistence

abnormal = normalized participation >=1.3

NORMAL
-> FRESH_SHOCK
-> PERSISTENT
-> DECAYING
-> NORMALIZED

DECAYING -> REIGNITED is allowed under same eventKey.

Two consecutive comparable sub-1.3 observations are required to normalize.
Missing/halted observations pause; they do not normalize.

## 10. Guard precedence

Store primary guard + all flags + interpretability.

INVALID:
1 INVALID_SOURCE_DATA
2 UNSUPPORTED_MARKET_STRUCTURE
3 CORPORATE_ACTION_RESET
4 REFERENCE_PRICE_UNRESOLVED
5 DATA_INSUFFICIENT
6 STALE_OR_INCOMPLETE_BAR

GUARDED:
7 PRICE_CENSORED
8 AUCTION_MIXED
9 GAP_DOMINATED
10 ILLIQUIDITY_WARNING
11 VI_STATE_UNKNOWN_CONFOUNDER

VALID:
12 NORMAL_MARKET

PV invalidity never invalidates Formal eligibility.

## 11. Current-cron coverage

Fugle minute candles use start-of-bucket timestamps.

Current Formal cron ends at Taiwan 13:24.
With completed-bar requirement and zero added live calls, v0.1 observes 15m bar starts:
09:00 through 13:00 inclusive.

Current ceiling:
17 bars/symbol x 6 monitored stocks = 102 intraday feature rows/trading day.

Closing-auction / 13:15–13:30 capture is OUT OF SCOPE for v0.1.

## 12. Integration points

### ensureD1Schema
Add research tables only.

### After Formal after-market plan save
Best-effort bootstrap missing intraday baselines:
```text
formalPlan = saveFormalPlan(...)
if PV_SHADOW_ENABLED:
    try bootstrap missing selected-symbol baselines
    catch log only
return formalPlan
```

PV failure cannot roll back Formal plan.

### runBackgroundMonitor
Keep existing Formal flow first.

After `results` are fully computed:
- if PV enabled and a new 15m completed bar is available:
  - build PV snapshot from copies of Formal result/frame;
  - insert-if-absent by stable bar key;
  - catch/log PV failure.

Then continue existing signal/push behavior unchanged.

No second live candle fetch loop.

### Daily snapshot
After Formal selection/plan state is frozen, read history cache and record pvDailyRvol20 for selected/monitored symbols separately.

Do not insert PV fields into the selector feature object in v0.1.

## 13. Baseline bootstrap

One historical 15m request per newly monitored symbol lacking valid cache.

Rules:
- prior sessions only;
- >=20 valid sessions;
- no zero-filling;
- corporate-action reset;
- store volume median, true-range median and cumulative-volume median per same-slot key;
- then roll cache forward from observed sessions.

Bootstrap errors => UNKNOWN/research warning; Formal unaffected.

## 14. Outcome labels

B anchor = first existing Formal B breakout-confirmed completed 15m bar.

B:
- FAILED_REENTRY if close < breakout*0.995
- RETEST_ZONE_LOST if close < frozen retestLow
- NO_CLOSE_PROGRESS
- NO_HIGH_PROGRESS
- MFE/MAE

A anchor = first existing Formal A BUY-confirmed completed bar.

A:
- ZONE_LOST if close < frozen buyLow
- STOP_BROKEN if valid stop existed
- NO_CLOSE_PROGRESS
- NO_HIGH_PROGRESS
- MFE/MAE

Same-session horizons:
- B1
- B2
- B4

Incomplete at session end => INCOMPLETE_SESSION_END.
Never consume next-session bars.

Overnight / daily outcomes are separate:
- NEXT_OPEN
- NEXT_SESSION
- D1/D3/D5/D10

## 15. Finalizer

Snapshots are immutable.

Outcomes key:
snapshot_id + horizon.

Repeated cron runs:
- no duplicate rows;
- complete only when horizon data exist;
- once complete, recomputation must be semantically identical.

## 16. Mandatory tests

T1 no-look-ahead slot baseline
T2 completed-bar boundary
T3 same-slot vs local acceleration divergence
T4 high-effort/low-progress ambiguity
T5 efficient-up fixture
T6 price-limit guard
T7 B state lifecycle
T8 B failure immutable history
T9 A lifecycle
T10 persistence reignition
T11 persistence normalization
T12 missing observation pause
T13 corporate-action reset
T14 daily-share / intraday-lot unit safety
T15 Formal isolation OFF vs ON
T16 one D1 snapshot per bar despite minute cron
T17 outcome idempotency
T18 late-session horizon cannot cross overnight

Additional implementation acceptance:
- zero unexpected ordinary-session live candle calls;
- zero PV exceptions propagated into Formal job;
- zero PV-based pushes/actions.

## 17. Kill switch

`PV_SHADOW_ENABLED=false`

Immediate disable if:
- Formal outputs differ OFF vs ON;
- BUY/ADD/REDUCE/push differs;
- monitor failure/latency is caused by PV;
- live API calls unexpectedly rise;
- future data leak is found;
- snapshot mutation occurs;
- unit/source scope is mixed.

Research tables are retained for audit after disable.

## 18. Tier-2 explicitly OUT OF SCOPE for first patch

Do not add in v0.1:
- daily transaction-count decomposition
- daily market/sector residual RVOL
- issued-share turnover
- divergence
- day-trading share
- attention/disposition context
- 1m opening-auction decomposition
- historical volume-at-price
- limit queue history
- HHI/entropy
- full-market 15m residualization

These remain separately evaluated candidates.

## 19. Readiness

V0.1 is sufficiently specified for a Class-A LOG_ONLY implementation proposal.

It is not evidence for Formal optimization.

Implementation requires explicit owner approval.

## 20. Validation governance

Primary statistical unit:
- eventKey, not raw snapshot count.

Every report shows:
- snapshots;
- unique events;
- unique symbols;
- unique market dates;
- largest date share;
- largest sector share.

Primary model family:
A context only
B + current local previous-5 volumeRatio
C + pvSlotRvol20
D + pvCumvolPace20
E + response/acceptance/guard states

No threshold tournament inside PV_SHADOW_V0_1.

Primary effect reporting:
- absolute structural-failure difference;
- relative risk;
- median MFE/MAE;
- valid-opportunity retention;
- adverse-confirmation capture;
- coverage/UNKNOWN/guard rates;
- regime/session/channel stability.

Train/design vs confirmation splits use date blocks, never random stock rows.

Any semantic threshold revision requires a new schemaVersion and later untouched validation block.

## 21. Observer -> Modifier governance

All PV_SHADOW_V0_1 fields are OBSERVER.

A future Modifier proposal requires:
1. data integrity;
2. adequate prospective event/date coverage;
3. incremental value after current Formal/local-volume context;
4. stability across sufficiently covered regimes/session phases;
5. favorable risk-avoidance vs opportunity-loss trade-off;
6. simple rule;
7. later untouched confirmation block.

Win-rate improvement caused by suppressing BUY frequency / capital utilization is not sufficient.

Predictive VETO is not part of v0.1 and requires a separate Class-C owner-approved proposal.
