# D04 / D05 L4 Wave-1 Prospective Preregistration — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Room: 04｜波動與市場微結構研究室
Status: PREREGISTERED_RESEARCH_ONLY / NO_L4_PROMOTION_YET
Formal Core: LOCKED
Current maturity at freeze:
- D04 = 58.0%
- D05 = 51.4%
- Room04 weighted = 54.2%

## 1. Purpose

Freeze the first promotion-grade L4 evidence program before future eligible outcomes are inspected.

Canonical maturity rule:
- L3 = Taiwan PIT source / clock / replay feasibility.
- L4 = genuine prospective Shadow or untouched chronological OOS evidence.

This preregistration does NOT promote any module.
It only defines what future observations must satisfy before an L4 review can occur.

No historical reconstruction may be relabeled as prospective evidence.
No synthetic fixture, CI test, code availability, or current mutable endpoint read is L4 evidence.

## 2. Shared evidence firewall

Every promotion-grade parent must freeze before outcome access:
- marketDate;
- symbol where stock-specific;
- decisionTimestamp / firstKnownAt;
- source receipt IDs and hashes;
- formula / state version;
- continuity / corporate-action state;
- market mechanism state;
- UNKNOWN reason where blocked;
- parent receipt hash.

Outcome fields are forbidden in the parent.

Later corrections append a new evidence state; they do not rewrite the parent to improve results.

Primary dependence units:
- D04 market-level studies: independent official decision dates and, where state persistence matters, independent volatility episodes.
- D04 stock interaction studies: decision date remains the primary cluster unit; symbols on one date are not independent experiments.
- D05 intraday studies: marketDate is the top cluster; symbol-slot rows are nested observations, not independent dates.

Naive row-level IID inference is prohibited.

## 3. Common L4 review gate

An L4 review requires all:
1. frozen preregistered parent and outcome definitions;
2. genuine prospective or untouched chronological OOS observations;
3. exact common support for baseline/challenger comparisons;
4. outcome begins strictly after parent firstKnownAt;
5. source/replay/UNKNOWN audit passes;
6. more than one relevant state episode where state persistence is part of the hypothesis;
7. no obvious single-date / single-episode / single-sector domination;
8. negative controls and simpler baseline included;
9. no post-outcome threshold, horizon, state, or cohort tuning;
10. dependence-aware inference owned by D16 where statistical inference is attempted.

There is no universal fixed N for all D04/D05 modules.
Sample sufficiency must be tied to:
- effect size / MDE;
- state occupancy;
- date and episode variability;
- missingness;
- multiple-testing family;
- execution-cost uncertainty where applicable.

Early samples are descriptive only.

## 4. D04 Wave-1

Wave-1 D04 modules:
- D04-03 Volatility Contraction;
- D04-04 Volatility Expansion / Shock;
- D04-07 Volatility × Trend / Breakout Interaction.

D04-02 / D04-05 / D04-06 continue accumulating A2/context receipts but are not Wave-1 efficacy priorities.
D04-08 remains L2 and is not included.
D04-09 / D04-10 remain guard/context modules until a distinct prospective economic question is frozen.

### 4.1 D04-03 Volatility Contraction

Primary question:
Does a PIT-defined contraction state contain prospective information about future volatility/range expansion beyond current volatility level and ordinary market context?

Parent:
- frozen D04-03 contraction state at decision date t;
- exact causal window only;
- no use of t+1 high/low/close;
- TECHNICAL_CONTINUITY must be valid;
- price-limit/corporate-action contaminated states retained as separate strata or UNKNOWN.

Primary outcomes:
- future 1-session realized range normalized by prior close;
- future 3-session cumulative realized range/dispersion;
- future 5-session cumulative realized range/dispersion.

Directional stock return is secondary only and cannot define success.

Baseline:
- matched non-contraction observations on exact common support.

Mandatory controls:
- current volatility level;
- market volatility context;
- trend state;
- liquidity/price tier;
- sector;
- price-limit state;
- corporate-action continuity.

Primary falsifier:
If contraction does not improve future-expansion discrimination beyond current volatility level and simple trend/range baselines, classify the contraction state as descriptively redundant.

Forbidden:
- choosing a new contraction threshold after future outcomes;
- defining "successful contraction" by whether a breakout later occurred;
- counting VCP contraction as an independent second vote from the same primitive.

### 4.2 D04-04 Volatility Expansion / Shock

Primary question:
Does a PIT-defined expansion/shock state prospectively distinguish volatility persistence versus normalization?

Parent:
- frozen expansion magnitude/state at decision date t;
- direction stored separately;
- overnight gap and intraday range not silently pooled where their mechanisms differ.

Primary outcomes:
- next-session realized range/dispersion;
- D3 and D5 realized volatility/range persistence;
- tail excursion / gap incidence as secondary diagnostics.

Baseline:
- same current volatility level without a newly expanding/shock state.

Negative controls:
- absolute return magnitude;
- event/news flag where PIT-valid;
- market-wide shock;
- price-limit/VI/suspension contamination.

Falsifier:
If expansion adds no information beyond current volatility amplitude/event context, label D04-04 transition component redundant for that outcome.

No bullish/bearish direction is preregistered.

### 4.3 D04-07 Volatility × Trend / Breakout Interaction

Primitive owner:
- D01 owns the breakout/price-structure event.
- D04 owns volatility context.

One breakout event remains one primitive event.

Primary question:
Does frozen volatility context add incremental information about breakout path quality beyond the price-only breakout baseline?

Model ladder:
- A = price-only breakout/structure baseline;
- B = A + current volatility level;
- C = B + contraction/expansion state;
- D = C + market-vs-stock volatility interaction only when D04-06 parent is valid.

Primary contrast:
- C vs B.
D is secondary.

Primary outcomes:
- D1/D3/D5 breakout follow-through;
- D3/D5 MFE;
- D3/D5 MAE;
- failed-breakout state under the already-frozen D01 definition.

Common support:
same breakout receipt, symbol, marketDate, decision cutoff, outcome horizon, continuity state and control availability.

Mandatory anti-double-count:
volatility cannot become a second breakout confirmation vote merely because the same event already passed D01 price structure.

Falsifier:
if C adds no residual discrimination beyond B, D04 volatility-state interaction is non-incremental for breakout quality.

## 5. D05 Wave-1

Wave-1 D05 modules:
- D05-03 Bid-Ask Spread;
- D05-04 Order-book Depth;
- D05-09 Liquidity State Classification.

These are chosen because snapshot-level PIT feasibility is already validated.

D05-05 true OFI remains blocked by event-sequence completeness.
D05-06 closing imbalance remains L2.
D05-11/12/13 need own-order/fill lifecycle.
D05-14 needs PIT official integrity/event lineage.

### 5.1 D05-03 Bid-Ask Spread

Primary question:
Does an outcome-blind same-symbol/same-slot spread state persist and explain short-horizon executable friction/path quality beyond activity and volatility?

Parent:
- valid two-sided quote;
- quoteTimestamp;
- spreadTicks + spreadBps where available;
- same-symbol/same-slot prior-session normalization;
- stale/future/trial/halt invalid states excluded or UNKNOWN.

Primary outcomes:
- next completed-slot spread state;
- next-slot midquote path range;
- simulated immediate crossing cost using contemporaneous bid/ask only as a descriptive execution benchmark.

Do NOT call simulated crossing cost a real fill.

Controls:
- local midquote volatility;
- event/message activity;
- tick/price tier;
- market mechanism state;
- time of day.

Falsifier:
if normalized spread state has no persistence/incremental explanatory value beyond local volatility/activity/tick state, treat it as context-only.

### 5.2 D05-04 Order-book Depth

Primary question:
Does top-five displayed depth add prospective information beyond spread, volatility and activity?

Parent:
- complete top-five displayed bids/asks;
- bidDepth5 / askDepth5;
- depthImbalance;
- timestamp/freshness;
- no order-ID or exchange-event completeness claim.

Primary outcomes:
- next-slot spread widening/narrowing;
- next-slot midquote range;
- next-slot depth persistence;
- price response conditional on observed pressure proxy as secondary.

Baseline:
- spread + local volatility + activity + tick state.

Primary contrast:
baseline versus baseline + top-five depth block.

Top-five levels are one block first.
No independent level-2/3/4/5 votes.

Falsifier:
if the full top-five block adds no value beyond best-quote/spread/top1 context, deeper depth is complexity without incremental evidence.

### 5.3 D05-09 Liquidity State Classification

Primary object:
a component vector, not a universal GOOD/BAD score.

Components:
- spread state;
- displayed depth state;
- freshness/coverage;
- mechanism state;
- activity where provenance-valid.

Primary question:
Does the preregistered component vector identify prospectively different execution/friction states without a tuned scalar threshold?

Outcomes:
- next-slot quote availability;
- next-slot spread;
- next-slot displayed depth;
- midquote range;
- missingness/reconnect incidence;
- actual fill/slippage only later if own-order evidence becomes available.

Forbidden:
- post-outcome creation of one composite liquidity score;
- dropping stressed/missing windows;
- using different support for spread/depth comparisons.

Falsifier:
if component-state differences disappear on exact common support or after volatility/activity controls, do not create a composite liquidity label for L4.

## 6. D05 common-support / sampling gate

Before any D05 Wave-1 outcome interpretation:
- compare only exact common 15-second/15-minute windows required by the frozen study;
- quote age and reconnect boundaries must be explicit;
- carried-forward values across reconnect are not new observations;
- transaction-price RV is a noise diagnostic, not the primary local-volatility control;
- midquote local volatility is primary when two-sided quotes are valid;
- opening/closing call, VI/trial, limit-constrained and odd-lot states are separate cohorts.

No true OFI claim is permitted.

## 7. Current evidence-count audit

As of this freeze:
- current repository evidence proves L3 source/replay feasibility;
- historical/synthetic fixtures are excluded from L4;
- System2 general daily prospective capture remains disabled / not a usable L4 stream;
- the 2026-10-02 System2 daily diagnostic is INPUTS_NOT_READY and counts zero;
- existing C3 research-capture engineering does not by itself establish a clean completed promotion-grade D05 outcome block;
- no D04/D05 module has enough prospective/OOS evidence for L4 promotion now.

Therefore:
L4_PROMOTIONS_THIS_TRANCHE = 0.

## 8. Promotion review outputs

Every future L4 review must report:
- eligible parent count;
- completed outcome count;
- distinct CLEAN decision-date count;
- state/episode counts;
- UNKNOWN/excluded counts and reasons;
- common-support retention;
- effect size with uncertainty;
- dependence-aware inference when sample supports it;
- negative-control result;
- redundancy result;
- date/sector/episode contribution concentration.

No favorable point estimate alone is sufficient.

## 9. Formal boundary

No experiment in this file changes:
- A/B definitions;
- Top6 / 3+3;
- ranking;
- BUY/ADD/REDUCE/SELL/STOP;
- capital/sizing;
- Formal monitoring;
- push/notification;
- production runtime.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## 10. Exact next continuation

1. Start counting only genuine post-freeze eligible D04/D05 parents.
2. Do not inspect predictive outcomes until each parent family reaches its preregistered descriptive-readiness checkpoint and D16 dependence/power review is frozen.
3. First D04 Wave-1 review: D04-03/04/07 common-support parent coverage and state/episode occupancy.
4. First D05 Wave-1 review: D05-03/04/09 quote/depth coverage, quote-age/reconnect missingness and exact common support.
5. D04-08 remains L2 until a separate portfolio-risk/execution policy feasibility contract is accepted.
6. No retrospective backfill of pre-freeze rows as Prospective Shadow.
