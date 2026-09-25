# Event Risk, Gap Risk & Overnight Information Research

Status: RESEARCH_ONLY / CONCEPT_BUILD / Formal Core LOCKED
Updated: 2026-09-25 Asia/Taipei

## Boundary

This lane studies discontinuous price/execution risk around non-trading intervals and discrete information events:
- close-to-open gaps;
- scheduled and unscheduled corporate events;
- gap-through-stop;
- price-limit carryover / constrained exit;
- weekend/holiday information accumulation;
- event clustering across portfolio holdings;
- execution at the next opening auction.

It does not duplicate:
- Fundamental Information Dynamics: content, surprise, revision and price reaction semantics;
- Market Microstructure: continuous-session order-book state;
- Trading Frictions: explicit/implicit cost of acting;
- Portfolio Risk: covariance/concentration/heat.

No event concept changes Formal entry/add/reduce/sell/stop behavior without explicit owner approval.

---

## ER-001 — Decompose close-to-close return into overnight and intraday components

For ordinary adjacent trading sessions:

`overnightReturn_t = open_t / close_{t-1} - 1`

`intradayReturn_t = close_t / open_t - 1`

`closeToClose_t = close_t / close_{t-1} - 1`

The arithmetic relationship is multiplicative:
`1+closeToClose = (1+overnightReturn)*(1+intradayReturn)`.

### Critical guards
Do not compute a raw gap across:
- ex-dividend/ex-right reference-price changes;
- stock split/capital reduction;
- newly listed no-limit windows;
- missing/stale previous close.

Corporate-action-adjusted reference truth is required.

### Why this matters
A daily candle merges two distinct information/execution regimes:
- price discovery while the market is closed;
- price evolution while trading is possible.

Status: OVERNIGHT / INTRADAY DECOMPOSITION FROZEN.

---

## ER-002 — Taiwan-specific evidence says night and day are not interchangeable regimes

Recent Taiwan evidence reports different asset-pricing relations between intraday and overnight returns, including opposite beta-return relations in the studied sample.

Source:
- Chang, Tseng & Yang, Pacific-Basin Finance Journal 95 (2026), 103003.
- DOI: 10.1016/j.pacfin.2025.103003
- https://www.sciencedirect.com/science/article/abs/pii/S0927538X25003403

Earlier Taiwan research also documented systematic daytime/overnight differences and negative cross-correlation patterns.

Source:
- The overnight effect on the Taiwan stock market, Physica A 391 (2012), 6497-6505.
- DOI: 10.1016/j.physa.2012.07.010

### Positive implication
Overnight gap state may add information not contained in same-day intraday trend alone.

### Counterpoint
These papers do not prove “positive gap = buy” or a stable 15m trading rule.
Market structure and samples differ, and overnight premia can be strategy/population specific.

Status: TREAT OVERNIGHT AS DISTINCT REGIME, NOT DIRECTIONAL ALPHA.

---

## ER-003 — Material-information timing creates genuine next-open jump risk

Current TWSE material-information procedures require listed companies to publish material information within specified deadlines; many events must be filed no later than two hours before the following trading day begins, while media-related or certain press-conference situations have other immediate/two-hour requirements.

Primary source:
- TWSE Procedures for Verification and Disclosure of Material Information, Article 6:
  https://twse-regulation.twse.com.tw/EN/law/DOC01_print.aspx?FLCODE=FL007111&FLNO=6

MOPS is the official public-company disclosure platform:
- https://mops.twse.com.tw/

### Consequence
A position held overnight can receive material information when the regular continuous market is unavailable.
The next executable price may be the opening auction price, not yesterday's stop or theoretical mark.

Status: AFTER-CLOSE/PRE-OPEN INFORMATION IS AN EXECUTION-RISK STATE.

---

## ER-004 — Scheduled and unscheduled event risk must be separated

### Scheduled / approximately scheduled
Examples:
- monthly revenue publication window;
- quarterly/annual financial reports;
- investor conferences;
- shareholder meetings / dividend-related dates;
- known ex-right/ex-dividend dates.

### Unscheduled
Examples:
- major contracts;
- M&A / disposal;
- litigation;
- production interruption;
- management changes;
- trading halt/resumption;
- unexpected customer/supply-chain event.

### Why
Scheduled events permit pre-event risk measurement.
Unscheduled events do not permit a complete calendar-based avoidance rule.

### Naming
- EVENT_SCHEDULED_KNOWN
- EVENT_UNSCHEDULED_DISCLOSED
- EVENT_UNKNOWN
- NO_KNOWN_EVENT

“NO_KNOWN_EVENT” never means “no event can happen.”

Status: EVENT-PREDICTABILITY LAYER FROZEN.

---

## ER-005 — A stop price is not a maximum-loss guarantee across an overnight gap

Suppose:
- close = 100;
- planned stop = 95;
- adverse information arrives after close;
- next opening auction = 88.

The stop level 95 can describe a decision boundary, but execution near 95 may be impossible.

### Required distinction
- plannedStopLoss
- executableExitPrice
- realizedExitPrice
- gapThroughStopPct

Candidate:
`gapThroughStopPct = max(0, (stop - nextExecutablePrice)/stop)`
for a long position, with correct sign semantics and actual execution provenance.

### Integration
Portfolio planned heat must be accompanied by event/gap stress because several positions can gap through stops simultaneously.

Status: STOP-RISK ≠ REALIZED MAX LOSS.

---

## ER-006 — Taiwan's ±10% price limits can spread price discovery and exit risk across days

Current TWSE rules generally impose stock daily price limits of ±10% around the opening auction reference price, with specified exceptions such as newly listed common stocks during the first five trading days.

Primary sources:
- TWSE Operating Rules Article 63:
  https://twse-regulation.twse.com.tw/EN/law/DOC01.aspx?FLCODE=FL007304&FLNO=63
- TWSE Trading Mechanism:
  https://www.twse.com.tw/en/products/system/trading.html

### Historical Taiwan evidence
Older studies under different limit regimes found that price limits can delay price discovery and that limit events may be followed by continuation and/or later reversal.

Sources:
- Huang, Fu & Ke (2001), International Review of Economics & Finance 10, 263-288.
  DOI: 10.1016/S1059-0560(00)00082-4
- Chen (1993), Pacific-Basin Finance Journal, Price limits and stock market volatility in Taiwan.

### Guard
Those studies used earlier market structures/limit widths.
They support the **mechanism possibility** of delayed adjustment, not a 2026 return forecast.

### System implication
A limit-down close can create:
- unresolved exit demand;
- next-day continuation risk;
- inability to assume stop execution.

Status: MULTI-DAY CONSTRAINED-EXIT RISK REQUIRED.

---

## ER-007 — Near-limit state and locked-limit state are economically different

Research states:
- LIMIT_FAR
- LIMIT_NEAR_UP
- LIMIT_NEAR_DOWN
- LIMIT_UP_TOUCHED
- LIMIT_DOWN_TOUCHED
- LIMIT_UP_LOCKED_OR_NO_SELLABLE_LIQUIDITY_UNKNOWN
- LIMIT_DOWN_LOCKED_OR_NO_BUYER_LIQUIDITY_UNKNOWN

Public quote data alone may not prove actual fillability for our order.

### No false certainty
“Limit down” is not identical to “cannot sell.”
Actual queue/depth/order priority matter.
Without order/fill evidence, fillability remains UNKNOWN.

Status: PRICE CONSTRAINT AND EXECUTABILITY KEPT SEPARATE.

---

## ER-008 — Longer non-trading intervals can accumulate more information, but duration alone is not a signal

Weekend and holiday gaps create a longer interval in which:
- company news;
- foreign-market movement;
- macro releases;
- geopolitical events;
- customer/supply-chain news
can arrive.

Classic evidence on Friday/earnings timing shows information-release timing can interact with next-trading-day reactions, but explains only part of broader weekend effects.

Source:
- Damodaran (1989), Review of Financial Studies 2(4), 607-623.
  DOI: 10.1093/rfs/2.4.607

### Research variable
`nonTradingHours` should be a conditioning variable, not a bullish/bearish factor.

Candidate cohorts:
- ordinary overnight;
- weekend;
- long holiday;
- typhoon/market-closure extension;
- UNKNOWN.

Status: NON-TRADING DURATION = EXPOSURE WINDOW, NOT DIRECTION.

---

## ER-009 — Event type does not determine event sign

The same category can be good or bad:
- “earnings announcement” can beat or miss;
- “major contract” may be material or already expected;
- “capital expenditure” may signal growth or cash burden;
- “management change” can be positive, negative or neutral.

Therefore Event Risk does not create:
`eventType -> bullish/bearish score`.

Instead record:
- eventCategory;
- firstKnownAt;
- scheduled/unscheduled;
- materiality evidence;
- Fundamental Dynamics surprise/revision state when valid;
- initial price gap/reaction separately.

Status: CATEGORY ≠ DIRECTION.

---

## ER-010 — Information surprise and price gap are separate layers

Fundamental Dynamics asks:
“What new information arrived relative to expectations?”

Event Risk asks:
“How much discontinuity/execution risk appeared before continuous trading resumed?”

Possible combinations:
- positive surprise + positive gap;
- positive surprise + flat/negative gap;
- negative surprise + negative gap;
- no verified surprise + large gap.

### Research value
A large gap with weak verified information may behave differently from a gap supported by a strong, novel event.
But this must be tested, not assumed.

### Anti-double-count rule
If Fundamental Dynamics already supplies surprise/revision state, Event Risk may consume that state as context but must not add another copy of the same fundamental score.

Status: SURPRISE x GAP INTERACTION ONLY; NO DUPLICATE FUNDAMENTAL SCORE.

---

## ER-011 — Portfolio event clustering can create simultaneous gap risk

Several positions may be exposed to one information shock:
- same customer;
- same AI/PCB/ABF chain;
- same commodity/input;
- same currency/export factor;
- same global technology earnings;
- same policy/macro release.

### Portfolio-risk connection
Ordinary correlation estimated from historical daily returns may understate one-night common-event exposure.

Research-only diagnostics:
- commonEventCluster
- positionsExposedCount
- capitalExposedToEvent
- plannedHeatExposedToEvent

Do not infer an event cluster solely from official sector labels.

Status: COMMON-EVENT EXPOSURE CANDIDATE.

---

## ER-012 — FIRST / ADD / FULL creates different overnight event exposure

Holding stage matters.

For the same adverse overnight event:
- FIRST loses on smaller exposure;
- FULL carries larger gap exposure;
- ADD immediately before an event increases exposure to a discrete jump.

### Research question
Does ADD timing near known events improve expected participation enough to justify added gap risk?

### Critical boundary
There is no rule here to automatically avoid earnings/revenue events.
Avoidance can also miss positive gaps.

Study:
- pre-event stage;
- added capital before event;
- next-open gap;
- D1/D3 continuation;
- downside gap;
- event surprise;
- net outcome after friction.

Status: EVENT EXPOSURE BY POSITION STAGE FROZEN.

---

## ER-013 — Gap-and-go, gap-fill and reversal are outcomes, not assumptions

For a gap at the open, define later behavior without hindsight in the trigger:

Candidate outcomes:
- GAP_CONTINUATION: price extends in gap direction;
- GAP_PARTIAL_FILL: retraces part of gap;
- GAP_FULL_FILL: trades back to prior close;
- GAP_REVERSAL: crosses prior close and continues opposite;
- LIMIT_CONSTRAINED / UNKNOWN.

### Horizons
Measure:
- first 15m;
- first 30m;
- close;
- D1/D3/D5.

### Context controls
- event/no-event;
- gap size normalized by ATR;
- market/sector overnight move;
- opening auction mechanism;
- liquidity/tick tier;
- price-limit proximity.

Do not bake arbitrary “50% gap fill” thresholds into Formal logic.

Status: OUTCOME TAXONOMY FROZEN.

---

## ER-014 — Market-relative and sector-relative gap decomposition

A stock opening +4% after a global semiconductor rally is different from +4% when peers are flat.

Research decomposition:
`stockGap = commonMarketGap + sectorGap + residualStockGap`

Exact statistical method is not frozen yet.

### Simple first layer
Before factor modeling, compare:
- stock overnight return;
- broad Taiwan benchmark overnight/opening move;
- sector/peer median opening move where point-in-time classification is available.

### Positive hypothesis
Residual gap may better isolate stock-specific information.

### Counterpoint
Benchmark/sector opening prices themselves can be noisy and synchronous; residualization can add estimation error.

Status: SIMPLE RELATIVE-GAP BASELINE FIRST.

---

## ER-015 — Point-in-time event provenance prevents look-ahead

Every event used in research needs:
- company/symbol;
- eventCategory;
- eventOccurredAt when known;
- disclosedAt / firstKnownAt;
- source;
- source snapshot/version;
- whether known before the decision timestamp;
- scheduledAt if previously announced;
- revision/cancellation history;
- timezone.

### MOPS rule
Use the actual public disclosure timestamp as the default information-availability anchor when possible, not the fiscal period end or later database row date.

### No-look-ahead examples
- a 20:15 MOPS announcement cannot explain a 13:20 decision that day;
- an earnings date learned only after the fact cannot be treated as “known scheduled event” in an earlier backtest;
- revised financial data cannot overwrite the vintage seen by the strategy.

Status: EVENT-VINTAGE FIREWALL FROZEN.

---

## First Event-Risk synthesis

The event-risk layer is not another “news sentiment score.”
Its main purpose is to measure when the strategy's continuous-price assumptions are unsafe.

Highest-value interactions with the current system:
1. planned stop versus next executable price;
2. portfolio heat versus common overnight event exposure;
3. FIRST/ADD/FULL stage before known events;
4. limit-down/limit-up carryover and exit uncertainty;
5. gap residual after market/sector move;
6. point-in-time MOPS provenance.

Formal Core remains LOCKED.

## Exact next continuation

ER-016: distinguish scheduled-event exposure days from ordinary nights using only point-in-time-known calendars.
ER-017: monthly revenue / earnings / investor-conference event-window semantics for Taiwan.
ER-018: gap-through-stop stress distribution and limit-down scenarios.
ER-019: overseas-market lead/lag and ADR/global-customer overnight context without double counting macro lane.
ER-020: opening-auction execution risk and first-15m stabilization.
ER-021: common-event portfolio clustering.
ER-022: event-aware projected heat.
ER-023: negative controls and falsification tests.
ER-024: prospective Shadow protocol.
ER-025: concept convergence / evidence readiness.


---

## ER-016 — Scheduled-event calendar needs certainty levels

A statutory filing deadline is not the same as a pre-announced exact event date/time.

### Event-calendar certainty
- EXACT_SCHEDULE_KNOWN — exact date/time publicly known before the trading decision.
- DATE_KNOWN_TIME_UNKNOWN — public date known, exact time unknown.
- DEADLINE_WINDOW_KNOWN — only regulatory filing window/deadline known.
- UNSCHEDULED_DISCLOSED — no valid prior schedule; event becomes known at disclosure.
- UNKNOWN.

### Example
“Monthly revenue must be filed by the 10th” does not prove a company will publish exactly on the 10th.

### No-look-ahead rule
Historical databases that show eventual publication dates may not be used as if those dates were known beforehand unless a contemporaneous schedule announcement proves it.

Status: EVENT-CALENDAR CERTAINTY TAXONOMY FROZEN.

---

## ER-017 — Taiwan recurring disclosure windows: window truth vs publication truth

### Monthly operating revenue
Taiwan listed companies generally file prior-month operating revenue by the 10th day of each calendar month.

Primary sources:
- Securities and Exchange Act Article 36:
  https://twse-regulation.twse.com.tw/TW/law/DOC01_print.aspx?FLCODE=fl007009&FLNO=36
- TWSE periodic-reporting rules:
  https://twse-regulation.twse.com.tw/m/en/LawContent.aspx?FID=FL007250

### Financial reports
Article 36 generally requires:
- annual report within three months after fiscal-year end;
- Q1/Q2/Q3 financial reports within 45 days after quarter end.

### Investor conferences
Conference schedules and materials can be publicly announced through MOPS/TWSE before the event in many cases.

### Research semantics
Store separately:
- regulatoryDeadline;
- scheduledEventAt;
- actualPublishedAt;
- firstKnownScheduledAt.

Only `firstKnownScheduledAt` can establish ex-ante exact schedule knowledge.

Status: TAIWAN DISCLOSURE-WINDOW SEMANTICS FROZEN.

---

## ER-018 — Gap-through-stop stress must be empirical and scenario-based

### Actual event metric
For a long position with planned stop S and next executable/fill price X below S:
`gapThroughStopLossNTD = shares * max(0, S-X)`

This is additional loss beyond the planned stop boundary before fees.

### Research distributions
Estimate separately by:
- ordinary overnight;
- known scheduled event;
- unscheduled material event;
- market-wide shock;
- sector shock;
- limit-down/near-limit state;
- weekend/holiday interval.

### Stress scenarios before enough actual samples exist
Use explicitly hypothetical layers such as:
- historical stock-specific adverse-gap percentile;
- sector adverse-gap percentile;
- market shock scenario;
- one-limit-session / multi-session constrained-exit scenario.

Do not claim a price-limit scenario is the expected loss.

### Key outcome
`realizedLoss / plannedStopRisk`
is a useful calibration diagnostic when actual fills exist.

Status: GAP-THROUGH-STOP CALIBRATION FRAME FROZEN.

---

## ER-019 — Overseas-market context is relevant to Taiwan's overnight interval, but it is not a duplicate macro score

Older Taiwan linkage research found substantial US-to-Taiwan volatility spillover, especially in close-to-open returns.

Source:
- Chou, Lin & Wu (1999), Pacific Economic Review 4, 305-320.
- DOI: 10.1111/1468-0106.00081

Recent Taiwan research also emphasizes that overseas information arriving while Taiwan stocks are closed can be reflected at the next opening.

Source:
- Momentum investing and a tale of intraday and overnight returns: Evidence from Taiwan, Pacific-Basin Finance Journal (2023).

### Context fields
For an overnight stock-gap study, freeze only the context needed:
- prior US session broad-index move;
- relevant global sector/peer move where justified;
- Taiwan futures night-session change if point-in-time data are available;
- USD/TWD overnight move where relevant.

### Anti-double-count
The macro lane may already know these variables.
Event Risk uses them to explain/common-factor-adjust the stock gap, not to award another bullish/bearish score.

### Counterpoint
Foreign-market relationships are regime-dependent and can weaken or reverse. No fixed US→Taiwan beta is assumed.

Status: OVERSEAS CONTEXT = GAP EXPLANATORY CONTROL.

---

## ER-020 — The opening auction is the first major price-discovery point after overnight information

Current TWSE regular-market mechanism:
- pre-open/opening uses call auction;
- intraday 09:00–13:25 uses continuous matching;
- closing 13:25–13:30 uses call auction.

Primary source:
- https://www.twse.com.tw/en/products/system/trading.html

Taiwan overnight-return research specifically notes the opening auction's role in aggregating reactions to information released while the market was closed.

### Research timestamps
Separate:
- priorClose;
- openingAuctionPrice;
- first continuous-trading observations;
- 5m/15m/30m post-open marks.

### Question
Does the overnight gap:
- immediately incorporate information;
- continue during the first 15m;
- partially/full reverse;
- remain price-limit constrained?

### Guard
Do not use the first 15m outcome to classify the opening gap state itself.

Status: OPENING AUCTION + POST-OPEN PATH SEPARATED.

---

## ER-021 — Common-event clustering should be event-specific, not only correlation-based

### Examples
- NVIDIA/customer earnings can affect several Taiwan AI suppliers.
- Oil/material shocks can hit multiple companies.
- USD/TWD or rate shocks can affect exporters/financials differently.
- A single customer order cut can affect a supply-chain cluster.

### Event-exposure graph
Research-only representation:
`event -> exposed symbols -> capital / planned heat`

Fields:
- eventId
- eventCategory
- exposureReason
- evidenceSource
- symbolsExposed
- liveCapitalExposed
- plannedHeatExposed
- confidence / UNKNOWN

### Counterpoint
Theme narratives are easy to overfit.
Every exposure link needs a documented economic relation available before or at the event, not post-hoc price co-movement alone.

Status: EVENT-EXPOSURE GRAPH CONCEPT FROZEN.

---

## ER-022 — Event-aware projected heat is scenario risk, not a new stop rule

Portfolio heat based on stop distance assumes approximate executability.
Event-aware stress adds discontinuity scenarios.

For each live position:
- plannedStopRiskNTD;
- adverseGapScenarioNTD;
- constrainedExitScenarioNTD where relevant.

Portfolio:
`eventStressLossNTD = sum(positionScenarioLoss_i)`

### Do not simply add
Planned-stop risk and event-gap scenario loss are alternative path scenarios and can overlap.
Avoid double counting by clearly defining scenario paths.

### Candidate views
- NORMAL_STOP_PATH
- ADVERSE_GAP_PATH
- COMMON_EVENT_CLUSTER_PATH
- LIMIT_CONSTRAINED_PATH

Status: SCENARIO-BASED EVENT HEAT FROZEN.

---

## ER-023 — Negative controls and falsification are mandatory

### Negative/control cohorts
Compare event/gap states against:
- same stock ordinary non-event nights;
- same-date matched stocks without the event;
- sector peers;
- market-adjusted/residual gap;
- corporate-action-adjusted controls.

### Falsification
Reject an “event risk factor” if:
- effect is fully explained by market/sector overnight movement;
- only one famous event/date drives the result;
- corporate actions create the apparent gap;
- publication timestamp is after the decision but treated as before;
- only large winners are labeled as “events”;
- effect disappears out of sample.

### Price-limit historical evidence
Older Taiwan limit studies are mechanism evidence only because limit width and trading mechanism have changed.

Status: EVENT-RISK ANTI-NARRATIVE FIREWALL FROZEN.

---

## ER-024 — Prospective Shadow protocol

### Population
For every Formal selected/live monitored symbol on each trading date:
- record event-calendar certainty before close;
- record live position stage/exposure;
- capture disclosures that become public after decision time;
- capture next opening auction and post-open marks.

Do not restrict capture to large gaps.

### Required point-in-time fields
- decisionAt
- eventKnownStateAtDecision
- scheduledEventAt if known
- MOPS/material disclosure firstKnownAt
- priorClose/reference adjustments
- openingAuctionPrice
- price-limit state
- 5m/15m/30m/close
- D1/D3/D5
- positionStage
- actualShares where verified
- stop
- sector/market overnight context
- data provenance / UNKNOWN reasons

### Primary questions
1. How often does price gap through planned stop?
2. Does known-event exposure increase adverse-gap tail risk?
3. Does FULL vs FIRST materially change realized event loss?
4. Does market/sector-adjusted residual gap predict continuation/fade?
5. Does limit proximity create multi-day unresolved exit risk?
6. Does event-aware scenario heat identify risk missed by ordinary planned heat?

### Bias guards
- capture all monitored names/dates;
- independent-date inference;
- no retrospective event labeling;
- no outcome-selected gap threshold;
- corporate-action firewall;
- current-rule versus historical-rule separation.

Status: PROSPECTIVE EVENT-RISK PROTOCOL V1 FROZEN.

---

## ER-025 — Event-risk concept convergence

Covered conceptually:
- overnight/intraday return decomposition;
- scheduled vs unscheduled event certainty;
- MOPS first-known provenance;
- recurring Taiwan disclosure windows;
- gap-through-stop;
- ±10% price-limit constrained exits;
- weekend/holiday exposure;
- opening auction;
- overseas/common-factor gap context;
- event clusters across portfolio;
- stage-dependent exposure;
- event-aware portfolio stress;
- negative controls;
- prospective validation.

### What is not ready
Do not create a Formal “event penalty” or automatically:
- skip all pre-earnings trades;
- halve positions before every scheduled event;
- widen/tighten stops because an event is near;
- chase positive gaps;
- sell negative gaps.

All such choices require strategy-specific net evidence.

### Lane state
**EVENT_RISK concept learning = CONCEPT_COMPLETE / EVIDENCE_PENDING.**

Formal Core remains LOCKED.

## Exact next continuation

The next research action should prioritize evidence and integration rather than more event indicators:
1. audit current data sources for point-in-time MOPS/event timestamps and opening/reference-price fields;
2. determine whether existing recorder can support ER-024 without new shared-runtime calls;
3. if incomplete, prepare a research-only event-vintage capture proposal under governance;
4. integrate future event-risk outcomes with Portfolio Heat and Trading Frictions without duplicate scores.
