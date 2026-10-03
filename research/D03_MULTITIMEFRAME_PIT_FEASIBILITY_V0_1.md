# D03 Multi-Timeframe PIT Feasibility / Causal Clock Audit V0.1

Updated: 2026-10-03 Asia/Taipei  
Lane: D03-13｜多時間框架趨勢／動能衝突  
Classification: Class A（研究專用）  
Formal Core（正式核心）impact: NONE / LOCKED

## Purpose（目的）

This tranche moves the frozen multi-timeframe theory into an executable Taiwan PIT（Point-in-Time，時點一致性）feasibility contract.

The primary hierarchy remains:

- Weekly（週線） = major trend / large structure context;
- Daily（日線） = selection / principal setup;
- M15（15 分 K） = transition / acceptance / execution context;
- M5（5 分 K） = execution detail only where separately allowed.

The research question is not whether three timeframes agree.  
It is whether each timeframe state can be reconstructed from exactly what was knowable at the parent decision time without:
- future completed bars;
- partial-bar relabeling;
- aggregation-boundary leakage;
- same-event vote multiplication.

No outcome, BUY/SELL（買進／賣出）, score, rank, capital, monitoring or Formal Core behavior is changed.

---

## TI-491 — multi-timeframe evidence needs three clocks, not one timestamp

Every bar-derived feature must preserve:

1. `barStartAt` — interval identity / start;
2. `barEndAt` — mathematical completion boundary;
3. `featureKnownAt` — when the system actually had a valid source observation after completion.

For a 15-minute bar starting 09:00 Asia/Taipei:

```
barStartAt = 09:00
barEndAt   = 09:15
featureKnownAt >= barEndAt
```

If the runtime fetches it at 09:16:
- it was not usable at 09:05;
- it was not usable merely because the chart labels the candle 09:00;
- the earliest system evidence time is 09:16 for that captured version.

Therefore:

`BAR_IDENTITY_TIME != FEATURE_KNOWN_TIME`.

This same distinction applies to:
- provisional daily bars;
- weekly aggregation;
- corrected source versions.

---

## TI-492 — current Taiwan M15 source path is causally usable but session-incomplete

Repository runtime evidence:

- `Worker.js::fetchCandles(symbol,15)` uses Fugle stock intraday candles;
- `analyzeFrame()` includes only bars satisfying `nowMs >= start + 15m`;
- current C3 research persistence stores:
  - `bar_start`;
  - `bar_end`;
  - `scheduled_time`;
  - `source_fetched_at`;
  - `source_family=FUGLE_INTRADAY_CANDLES_15M`;
  - `completed_bar=1`.

Current pre-registered C3 slots are:

09:00, 09:15, ... , 12:45, 13:00

= **17 completed-bar start slots**.

TWSE regular trading is 09:00–13:30. A full equal-interval decomposition contains 18 15-minute slots:
- final start = 13:15;
- final end = 13:30.

Current System 1 minute Cron ends at 13:24, so the zero-extra-call monitoring path cannot capture the 13:15-start bar after its 13:30 completion.

Therefore the honest v0.1 state is:

`M15_CURRENT_RUNTIME_COVERAGE = PARTIAL_REGULAR_SESSION_17_OF_18_SLOTS`.

This is sufficient for PIT feasibility of the observed intraday window, but **not** evidence of full-session M15 coverage.

External source corroboration:
- Fugle stock intraday candles support `timeframe=15`.
- TWSE regular trading session is 09:00–13:30.

---

## TI-493 — completed bar does not equal source available

A completed interval can still be unavailable, stale, missing or transport-failed.

For any M15 technical feature:

```
eligibleAt =
  max(barEndAt, sourceFetchedAt)
```

subject to:
- exact source bar identity;
- session membership;
- no duplicate/conflicting version;
- continuity/constraint state;
- completed-bar validation.

`sourceFetchedAt` is knowledge-time provenance, not part of immutable semantic bar identity.

Repeated fetches of the same logical bar may have different fetch timestamps without becoming different market bars.

This inherits the Price-Volume finding that volatile acquisition timestamps must not create mutation conflicts.

---

## TI-494 — daily state has PROVISIONAL and CONFIRMED semantics already implemented

System 2 Daily Resonance already separates:

- `LIVE` current daily bar -> `PROVISIONAL_DAILY_BAR`;
- `FINAL` source + independently confirmed official close -> `CONFIRMED_DAILY_CLOSE`;
- no current-date bar -> `CURRENT_DAILY_BAR_MISSING`.

The monitor also freezes:

- live daily signal = PROVISIONAL;
- final daily state = CONFIRMED only after the official close and finality check;
- 15m context cannot alter the daily EMA16/EMA64/Impulse-MACD state.

This provides an existing causal daily-bar finality model for D03-13.

A provisional intraday-updated daily bar may cross EMA16 or change Impulse direction and then reverse before close. That is legitimate live information but not a confirmed historical daily signal.

---

## TI-495 — weekly completion must be calendar-aware, not “five bars means a week”

Canonical weekly aggregation is deterministic from eligible daily bars:

```
weeklyOpen  = first eligible daily open
weeklyHigh  = max eligible daily high
weeklyLow   = min eligible daily low
weeklyClose = last eligible daily close observed in the week
```

But completion cannot be inferred from “five daily rows”.

Required weekly completion rule:

A calendar-week bar is `COMPLETED_HIGHER_TIMEFRAME_BAR` only when:
1. the official exchange calendar proves there is no later exchange session remaining in that calendar week after `asOf`;
2. all expected symbol-session states through the completion boundary are reconciled;
3. missing symbol bars are explained by verified suspension/no-trade provenance rather than silently skipped;
4. technical continuity / semantic space is valid.

Therefore:
- a Wednesday weekly bar is partial;
- a Thursday bar can be completed if Friday is an official holiday known in the versioned exchange calendar;
- a symbol suspended on Friday does not make Thursday information magically “Friday-known”; final weekly completion still needs the calendar/suspension state available by the correct cutoff.

Required fields:
- `calendarWeekId`;
- `marketSessionCalendarVersion`;
- `symbolSessionReceiptId`;
- `weeklySourceDailyBarIds[]`;
- `weeklyCompletedThrough`;
- `weeklyPartialAsOf`;
- `barCompletionState`.

TWSE publishes an official annual market open/holiday calendar, so the calendar family itself is source-feasible.

---

## TI-496 — partial weekly state can reverse before completion

Synthetic outcome-blind witness:

Monday–Wednesday:
- weekly open = 100;
- high = 104;
- low = 98;
- Wednesday close = 99.

Partial weekly state:
- close below weekly open -> DOWN_FROM_OPEN.

After Thursday–Friday:
- full weekly high = 106;
- low = 97;
- Friday close = 105.

Completed weekly state:
- close above weekly open -> UP_FROM_OPEN.

Therefore a causal Wednesday weekly state is useful only as:

`PARTIAL_ASOF_HIGHER_TIMEFRAME_BAR`.

It may not be persisted later as though Wednesday already knew the Friday-completed weekly direction.

---

## TI-497 — holiday-shortened weeks require official-session semantics

A naive rule requiring five daily bars creates two errors:

1. a four-session holiday week may never become complete;
2. a later session can be incorrectly borrowed from the next week to “fill” five bars.

Frozen rule:

`WEEK_COMPLETION = CALENDAR_BOUNDARY + VERIFIED_EXPECTED_SESSIONS`

not:

`WEEK_COMPLETION = FIVE_OBSERVED_BARS`.

Weekly indicator lookbacks must therefore count completed weekly aggregates, not arbitrary groups of five observations.

No future holiday-calendar revision may rewrite an earlier parent unless the revised calendar version was first-known before that parent cutoff.

---

## TI-498 — daily and M15 are nested but not temporally identical evidence

Within the same session:
- M15 bars contribute to the still-forming daily OHLC;
- the daily high/low/close is an aggregate over the full session;
- current M15 zero-extra-call coverage ends at 13:15 while the regular session continues to 13:30.

Therefore:

`M15_STATE + DAILY_STATE`

is usually `SHARED_COMPONENT` / `NESTED_HORIZON`, not two independent observations.

However M15 may still carry execution-path information that daily OHLC cannot recover, for example:
- breakout then rejection before the daily close;
- acceptance duration;
- intra-session reversal path;
- same-slot participation context.

The incremental question is therefore:

> conditional on a frozen daily setup, does causal M15 state improve execution/acceptance outcomes?

It is **not**:

> do daily and M15 both say bullish?

---

## TI-499 — final M15 coverage gap must remain explicit

Because current captured starts stop at 13:00:

- observed completed interval through current zero-extra-call path: 09:00–13:15;
- regular session continues: 13:15–13:30;
- the 13:15-start closing interval is unobserved in that path.

Required v0.1 fields:

- `intradayExpectedRegularSlots = 18`;
- `intradayObservedConfiguredSlots = 17`;
- `intradayCoverageThrough = 13:15`;
- `closingM15State = UNOBSERVED_CURRENT_ZERO_EXTRA_CALL_PATH`.

Consequences:
- an M15 “session close state” claim is forbidden from these 17 bars;
- daily final close must come from its own final source, not reconstructed from the 17 M15 bars;
- a future extension to the 13:15 bar is a new capture/version scope and cannot backfill older evidence.

---

## TI-500 — same underlying event cannot multiply confirmation counts

Cross-timeframe alignment is represented as:

- `ALIGNED`;
- `MIXED`;
- `CONFLICT`;
- `UNKNOWN`.

It is never automatically a count.

Examples:

### SAME_EVENT_DUPLICATE
Daily breakout occurs because the final observed M15 bar crosses the same exact boundary.

=> one event, two representations.

### NESTED_HORIZON
ret5 and a completed weekly return cover nearly the same eligible sessions.

=> nested memory, not two independent momentum votes.

### DISTINCT_HORIZON_CONTEXT
Weekly major resistance remains overhead while daily local breakout occurs.

=> plausible hierarchical context.

### DISTINCT_SESSION_INFORMATION
Overnight gap vs intraday acceptance.

=> potentially different information origin.

Only the latter two begin with a plausible incremental-value prior, and even they require residual tests.

---

## TI-501 — System 2 Daily Resonance semantics are consistent with the hierarchy

The existing System 2 Daily Resonance contract already freezes:

- EMA16/EMA64 + Impulse MACD calculated from **daily bars only**;
- LIVE daily bar -> PROVISIONAL;
- finalized daily bar after independent close gate -> CONFIRMED;
- `intraday15mAffectsDailyResonance = false`;
- M15 is `EXECUTION_AUXILIARY_ONLY`.

D03 therefore does **not** need to redesign Daily Resonance.

Research handoff rule:

```
dailyResonanceState = DAILY_FAMILY_STATE
m15Context = EXECUTION_CONTEXT
crossTimeframeRelation = ALIGNED | MIXED | CONFLICT | UNKNOWN
independentVoteCount = null
```

Any future Challenger that changes this hierarchy is a separately versioned hypothesis.

---

## TI-502 — Taiwan PIT data feasibility is now validated for D03-13

### Weekly
Feasible from:
- existing daily PIT OHLC lineage;
- official market-session calendar;
- symbol-session/suspension provenance;
- deterministic aggregation;
- existing Pattern multiscale prefix/replay semantics.

### Daily
Feasible from:
- existing daily history;
- System 2 live adapter;
- explicit LIVE/FINAL source state;
- independent post-13:30 close-finality gate;
- continuity/state-lineage provenance.

### M15
Feasible within explicitly bounded coverage from:
- Fugle M15 source;
- `analyzeFrame()` completed-bar filter;
- C3 persisted `bar_start/bar_end/scheduled_time/source_fetched_at/source_family/completed_bar`;
- exact 17 configured observed slots.

The current M15 path is partial-session, but partial coverage is **known and versioned**, not hidden.

### M5
Not required for V0.1 maturity.
It remains execution-detail-only and cannot be introduced merely because it creates more crosses.

This validates data/PIT feasibility, not alpha.

---

## TI-503 — maturity decision

D03-13 advances:

- L2 / 40% / MECHANISM_AND_FALSIFICATION_DEFINED

to:

- **L3 / 60% / TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_WITH_BOUNDED_INTRADAY_COVERAGE**

Reasons:
- weekly completion/partial semantics are causal and calendar-versioned;
- daily provisional/final semantics already exist in executable System 2 code;
- M15 completed-bar/knowledge clocks are executable and persistence-ready;
- current session coverage gap is explicit rather than silently imputed;
- cross-timeframe overlap classes and anti-vote-count rule are frozen;
- no new data family is required for the core weekly/daily/M15 hierarchy.

This promotion does NOT claim:
- weekly context predictive incrementality;
- M15 execution alpha;
- three-timeframe resonance alpha;
- optimal timeframe pair;
- complete closing-M15 coverage;
- OOS / Prospective Shadow evidence;
- Formal eligibility.

Current active D03 modules = 12.

Prior maturity sum:
- 620 / 1200 = 51.7%.

After D03-13 +20 maturity points:
- 640 / 1200 = **53.3%**.

---

## Deterministic fixture

File:
`research/test_d03_multitimeframe_pit_feasibility_v0_1.mjs`

Assertions:
1. 09:00 M15 bar is incomplete before 09:15.
2. completion at 09:15 still does not make it known before the captured `sourceFetchedAt`.
3. 17 configured current-runtime slots end at 13:15 and do not cover the 13:15–13:30 interval.
4. Wednesday partial weekly direction can differ from the Friday completed direction.
5. a holiday-shortened week can complete with fewer than five bars when official expected sessions are exhausted.
6. an ordinary Wednesday week cannot be labeled completed.
7. daily LIVE state maps to PROVISIONAL and FINAL+close confirmation maps to CONFIRMED.
8. cross-timeframe agreement returns an alignment state, never an independent vote count.

Equivalent deterministic calculations were executed during this research tranche.
Repository CI execution remains separate and must not be claimed unless an actual workflow runs the new fixture.

---

## Required machine-readable contract

File:
`research/d03_multitimeframe_pit_contract_v0_1.json`.

It freezes:
- clock fields;
- weekly completion rule;
- daily finality states;
- M15 bounded coverage;
- overlap classes;
- role hierarchy;
- System 2 handoff;
- outcome gates.

---

## Current status

`D03_13 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_WITH_BOUNDED_INTRADAY_COVERAGE`

`WEEKLY_COMPLETION = CALENDAR_AWARE_CAUSAL`

`DAILY_FINALITY = PROVISIONAL_VS_CONFIRMED`

`M15_COMPLETION_CLOCK = BAR_END_PLUS_SOURCE_KNOWLEDGE_TIME`

`M15_CURRENT_RUNTIME_COVERAGE = 17_OF_18_REGULAR_SLOTS`

`TIMEFRAME_AGREEMENT = HIERARCHICAL_CONTEXT_NOT_VOTE_COUNT`

`D03_MATURITY = 53.3_PERCENT`

`OUTCOME_INFERENCE = NO_GO`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

---

## Exact next continuation point

1. Keep raw-byte completed-session source gate at 2/3 through the weekend.
2. Do not add the closing 13:15 M15 bar to production/runtime from this research room; that would be an engineering/runtime scope change.
3. Future M15 incremental inference must use exact `featureKnownAt`, common support, session-slot coverage and daily-setup conditioning.
4. Future weekly inference must beat daily equal-horizon / long-horizon controls and include boundary-sensitivity checks.
5. Once the raw receipt gate genuinely closes, preserve empirical order:
   TI-005 KD-vs-RSI -> TI-006 MACD-vs-direct-trend -> ADX -> Bollinger/ATR/VCP; D03-13 outcome work remains behind the primary queue.
6. Next outcome-blind D03 target: D03-04 momentum continuation versus D03-03 persistence / D03-02 direct return family, focusing on construct separation and Taiwan PIT feasibility without creating another momentum duplicate.
