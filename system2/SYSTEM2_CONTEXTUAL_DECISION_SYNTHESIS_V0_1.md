# System 2 — Contextual Decision Synthesis Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Status: OWNER NORTH-STAR / DESIGN CONTRACT
Scope: System 2 decision synthesis
Formal trading authority: NOT ENABLED
System 1 / V8 Formal Core impact: NONE

## Purpose

System 2 must convert the knowledge learned across market, macro, industry, fundamentals, valuation, technicals, price-volume, chips, capital flow, events, supply/demand and Regime into **context-dependent trading judgment**.

The system must not behave like a checklist that requires every learned condition to be true. It must decide which evidence families are relevant to the current setup, weigh supportive and contradictory evidence, preserve UNKNOWN honestly, and produce an actionable conclusion.

The goal is not to maximize the number of conditions passed. The goal is to maximize the quality of the trading decision after costs, uncertainty and risk.

## Core principle — knowledge is routed by context

Every candidate first receives a **scenario / setup diagnosis**. Examples include, but are not limited to:

- breakout / prior-high breakout;
- pullback in trend;
- base / consolidation breakout;
- reversal / early turn;
- institutional accumulation;
- stealth accumulation / black-horse setup;
- industry-cycle rerating;
- growth repricing;
- event-driven reaction / second wave;
- value-reversion repair;
- trend continuation;
- trend deterioration / exit risk;
- resonance confirmation;
- post-reduction re-add / restore.

The diagnosed scenario determines which knowledge families receive priority.

This routing is not a fixed one-rule table. The system may combine multiple scenarios when evidence overlaps, but each evidence contribution must remain attributable.

## Contextual Evidence Router

For every symbol and decision timestamp, build a Contextual Evidence Packet containing:

- detected setup(s);
- applicable strategy family / families;
- current market and sector Regime;
- relevant evidence families;
- supportive evidence;
- contradictory evidence;
- UNKNOWN / unavailable evidence;
- evidence freshness / availableAt;
- interaction / confluence findings;
- thesis;
- invalidation conditions;
- actionable decision;
- confidence / uncertainty notes.

A factor that is economically irrelevant to the setup should be marked NOT_APPLICABLE rather than forced into the decision.

## Hard gates vs contextual evidence

To prevent rule accumulation from starving the system, knowledge items are classified into three roles.

### HARD_GATE

Use only where failure makes the trade structurally unacceptable or the evidence unusable. Examples may include:

- security not tradeable / excluded instrument;
- liquidity below an owner-approved or evidence-backed minimum;
- data integrity failure or PIT violation;
- impossible / invalid simulated fill condition;
- strategy thesis explicitly invalidated;
- risk/reward below a validated minimum for that strategy;
- prohibited chase / limit-price / gap condition when the strategy contract defines it;
- owner-approved production safety boundaries.

Hard gates must be few, explicit, versioned and evidence-backed.

### PRIMARY_EVIDENCE

Evidence that materially determines whether the setup is real, attractive and timely.

### SUPPORTING / CONTRADICTORY EVIDENCE

Evidence that raises or lowers confidence but does not automatically veto the trade.

UNKNOWN is never silently converted to BAD, zero or PASS.

## No-condition-pileup rule

System 2 must never create a universal requirement such as:

"technical good + price-volume good + foreign buying + investment-trust buying + fundamentals good + valuation cheap + industry strong + event positive + market risk-on"

for every stock.

Different setups require different evidence.

A valid trade may be strong because a smaller number of high-quality, mutually reinforcing observations fit the current context. Conversely, many weak correlated signals must not be counted as many independent confirmations.

## Example — prior-high breakout

When a stock breaks a prior high, System 2 should not classify the move as valid merely because price crossed a line.

The Contextual Evidence Router should determine which evidence is relevant, such as:

### Technical / structure
- breakout distance and close quality;
- prior-high / trapped-supply zone;
- platform duration / compression;
- moving-average slope / trend extension;
- whether the move is early, mature or blow-off;
- failed-break / rejection evidence;
- multi-timeframe structure.

### Price-volume
- relative volume vs 5/20/60-day context;
- turnover value and liquidity;
- breakout volume quality;
- close location within the bar;
- follow-through persistence;
- whether high volume represents demand confirmation or late-stage distribution;
- price-volume divergence.

### Chips / ownership
- foreign / trust / dealer behavior where relevant;
- financing / SBL / short context;
- TDCC concentration trend where available;
- whether large-holder accumulation preceded the breakout;
- whether distribution evidence contradicts the price move.

### Market / capital flow / sector
- broad-market Regime;
- sector relative strength;
- sector turnover share / capital rotation;
- large-cap vs small-cap leadership;
- whether the breakout is aligned with or fighting the active capital regime.

### Industry / fundamentals / catalyst
- whether an industry or company catalyst explains the repricing;
- whether forward earnings / supply-demand / pricing power support persistence;
- whether the move is already over-discounting a known catalyst.

### Risk / execution
- entry distance from support;
- stop geometry;
- gap/chase risk;
- liquidity and expected slippage;
- reward/risk to realistic targets.

The conclusion can be:
- ENTER_NOW;
- ENTER_ON_PULLBACK;
- WATCH_FOR_CONFIRMATION;
- HOLD_EXISTING;
- ADD_ON_CONFIRMATION;
- DO_NOT_CHASE;
- AVOID_FALSE_BREAK_RISK;
- INCOMPLETE_EVIDENCE.

The system must explain **why** it chose the action.

## Scenario-specific evidence examples

### Pullback in an uptrend
Prioritize:
- trend intactness;
- support quality;
- pullback volume contraction;
- selling pressure / chip deterioration;
- sector and market Regime;
- thesis continuity;
- reward/risk at the pullback level.

### Institutional accumulation
Prioritize:
- persistence and quality of institutional buying;
- ownership concentration trend;
- controlled volume / absorption;
- price extension still limited;
- higher lows / structure;
- industry/fundamental support;
- false-positive checks where institutions buy but price fails.

### Event-driven setup
Prioritize:
- source validity;
- firstKnownAt / availableAt;
- economic transmission;
- beneficiary / victim mapping;
- price-in degree;
- event half-life / expiry;
- liquidity;
- reaction structure and second-wave potential.

### Industry-trend setup
Prioritize:
- cycle stage;
- supply/demand/inventory/capacity;
- pricing;
- earnings sensitivity;
- capital rotation;
- company exposure and competitive position;
- whether the cycle is early, accelerating, mature or reversing.

## Interaction / confluence rule

Interactions can be more important than additive votes.

Example:
institutional gradual buying
+ rising 1000+ holder share
+ declining retail ownership
+ controlled volume
+ higher lows
+ sector improvement

may represent one coherent accumulation mechanism rather than six independent points.

System 2 should record:
- interaction name / hypothesis;
- component evidence;
- whether components are redundant;
- incremental value after controlling for the strongest single factor;
- applicable Regime;
- failure mode.

## Over-constraint / opportunity-starvation diagnostics

A legitimate zero-pick day is allowed.

However, System 2 must separately detect whether zero/low selection is caused by a **model design defect**.

Track at least:
- candidate universe count;
- count removed by each HARD_GATE;
- count downgraded by each contextual evidence family;
- selected count;
- near-miss count;
- recurring bottleneck conditions;
- condition co-occurrence / redundancy;
- opportunity-starvation rate;
- zero-pick days by Regime;
- subsequent performance of near-miss candidates;
- missed-opportunity rate.

If a rule repeatedly blocks later-profitable candidates without sufficient downside protection, it becomes a research target for falsification or redesign.

No rule may be loosened merely to increase stock count. Changes require evidence.

## Dynamic knowledge applicability

As new research is added to Shared Knowledge, System 2 must not automatically turn every new finding into a new required condition.

Each new finding must declare:
- applicable setup / strategy;
- applicable horizon;
- applicable Regime / industry;
- role: HARD_GATE / PRIMARY / SUPPORTIVE / CONTRADICTORY / EXPLANATORY;
- interaction candidates;
- redundancy risks;
- known failure modes;
- PIT/data readiness;
- evidence maturity.

Only validated knowledge should influence higher-authority decisions.

## Decision synthesis output

For each analyzed symbol, the human-facing decision should be able to show:

- setup / strategy;
- current action;
- confidence;
- entry zone / trigger;
- stop / invalidation;
- targets;
- add / reduce / exit conditions;
- expected holding horizon;
- top supportive reasons;
- top contradictory reasons;
- critical UNKNOWNs;
- market / sector Regime;
- next condition that would upgrade or downgrade the decision.

The final decision should read like an experienced trader's structured judgment, not a raw indicator dump.

## Learning objective

The system should continuously improve not only individual factors, but **which evidence to consult in which context**.

Research evaluation therefore includes:
- setup classification quality;
- evidence-routing quality;
- decision quality;
- false-break / failed-setup discrimination;
- missed-opportunity analysis;
- over-constraint analysis;
- decision calibration;
- performance after transaction costs.

## Safety / integrity

This contract does not authorize live capital, real orders or unvalidated production thresholds.

Contextual flexibility must never be used to rationalize hindsight. Every decision packet must be frozen at the decision timestamp with PIT-valid evidence.

