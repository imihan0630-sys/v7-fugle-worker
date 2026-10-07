# System 2 — Institutional Monitoring UI / UX North Star V0.1

Updated: 2026-10-04 Asia/Taipei
Status: OWNER NORTH-STAR / DESIGN CONTRACT
Scope: System 2 monitoring, decision and performance interface
Formal trading authority: NOT ENABLED
System 1 / V8 Formal Core impact: NONE

## Product role

The System 2 interface must feel like a professional institutional trading / portfolio decision terminal, while remaining clear enough that the owner can understand the state of every candidate or holding within seconds.

The interface is not a decorative dashboard. Its job is to answer quickly:

- What is the market Regime now?
- Where is capital moving?
- Which stocks deserve attention now?
- What is the recommended action?
- What price zone matters?
- What changed since the last decision?
- Which risks require attention?
- Did resonance trigger?
- Which positions should be held, added, reduced or exited?
- How are the strategies actually performing?

## Visual direction

Target mood:

**institutional trading desk + premium wealth-management terminal + high-performance command center.**

The desired "發大財氛圍" should come from clarity, confidence, precision and premium presentation — not casino-like flashing graphics.

Recommended visual language:
- dark graphite / navy base;
- restrained gold / amber accent for premium emphasis;
- Taiwan-market convention: red = up / gain, green = down / loss;
- cyan / blue for neutral information, system states and technical overlays;
- white / high-contrast typography for primary numbers;
- muted secondary text;
- avoid excessive neon, gradients, animated noise or decorative charts.

Color must always have a semantic role and must not be the only carrier of critical information.

## Information hierarchy

The user should understand priority within 3–5 seconds.

### Level 1 — immediate action
Always prominent:
- symbol / company name;
- current price / change;
- recommended action;
- entry zone / trigger;
- stop / invalidation;
- targets;
- alert / resonance state;
- urgency;
- major warning.

### Level 2 — why
Show compactly:
- strategy / setup;
- market Regime;
- sector / industry state;
- top 3–5 supportive reasons;
- top contradictory reasons;
- confidence / uncertainty;
- capital-flow / chip state.

### Level 3 — drill-down
Expandable:
- detailed factor evidence;
- raw values / timestamps / source;
- charts;
- ownership history;
- institutional flows;
- fundamentals / valuation;
- event timeline;
- performance attribution;
- frozen decision history.

## Primary desktop layout

### Top command bar
Show:
- TAIEX / TPEx;
- breadth;
- turnover;
- large vs small leadership;
- Risk-on / Risk-off;
- sector rotation summary;
- USD/TWD / major global-risk context where relevant;
- system health;
- data freshness;
- current Taipei time.

### Left rail — watch / strategy navigator
Tabs:
- TODAY'S PRIORITY;
- SHORT;
- SWING;
- ACCUMULATION;
- INDUSTRY;
- EVENT;
- HOLDINGS;
- RESONANCE;
- WARNINGS.

Each row should show:
- company name + symbol;
- price;
- strategy badge;
- current action;
- confidence;
- alert state;
- change since last snapshot.

### Center — decision chart workspace
Primary chart:
- dynamic candlestick;
- volume;
- support / resistance;
- prior highs / trapped-supply zones;
- entry zone;
- trigger;
- stop;
- targets;
- add / reduce markers;
- resonance markers;
- optional EMA16 / EMA64 / Impulse MACD baseline;
- event / earnings / corporate-action markers;
- selectable timeframes.

Chart overlays must be toggleable so the view never becomes cluttered.

### Right rail — action card
This is the main decision card.

Show:
- ACTION: HOLD / ADD / REDUCE / EXIT / WATCH / ENTER;
- confidence;
- setup;
- thesis;
- entry zone;
- trigger price;
- do-not-chase level;
- stop / invalidation;
- targets;
- max holding period;
- next upgrade condition;
- next downgrade condition;
- key risk;
- last decision time.

A user should not need to interpret ten indicators before seeing the recommendation.

### Bottom workspace
Switchable panels:
- price-volume;
- chips / ownership;
- institutional flows;
- industry / capital flow;
- fundamentals / valuation;
- news / event timeline;
- strategy evidence;
- frozen decision history;
- simulated position lifecycle; actual-position lifecycle only after `ACTUAL_POSITION_MONITOR_VERIFIED=true`;
- performance / MFE / MAE;
- alert log.

## Market command center

Provide a dedicated market page with:

- market Regime;
- breadth heatmap;
- sector / industry relative-strength heatmap;
- turnover-share rotation;
- capital-flow rotation;
- large / mid / small-cap leadership;
- foreign / trust / dealer flows;
- volatility state;
- global market transmission;
- event risk radar.

The purpose is to prevent single-stock decisions from being viewed without market context.

## Candidate board

The candidate board should support:
- sorting by strategy;
- setup;
- decision state;
- entry readiness;
- confidence;
- sector;
- capital-flow alignment;
- resonance state;
- warning severity;
- distance to trigger.

Do not expose a fake universal score when strategy meanings differ.

## Holdings board

This board is a target UI surface with a strict provenance split.

Current readiness:
- `VIRTUAL_POSITION_READY`: simulated/virtual positions sourced from `s2_positions` remain clearly labeled **SIMULATED / VIRTUAL**.
- `ACTUAL_HOLDINGS_SOURCE_AUTHORIZED=USER_UPLOADED_BROKER_SCREENSHOT`: the Actual Holdings board may only consume a confirmed screenshot snapshot from the dedicated actual-holdings read model.
- `CHAT_ASSISTED_HOLDINGS_IMPORT_READY=CODE_TESTED_PENDING_REAL_OWNER_SNAPSHOT`: the UI must show no current holdings until a real Owner screenshot has passed validation + confirmation + persistence/readback.
- `ACTUAL_POSITION_MONITOR_VERIFIED=false` until that real snapshot exists.
- Virtual positions, signals, suggested shares, plans, candidates and simulated fills can never be relabeled actual holdings.

The Actual Holdings board must remain visually separate from VIRTUAL POSITIONS, CANDIDATES, WATCHLIST and SIMULATED FILLS and expose Source, Last verified/effectiveAsOf and reconciliation/review state. Low-confidence imports remain REVIEW_REQUIRED and must not appear as verified holdings.

For a verified actual holding, the target board may show:
- reconciled quantity;
- cost only when actually sourced/reconciled;
- current P/L;
- desired action;
- current thesis;
- stop / invalidation;
- add/re-add zone;
- reduce zone;
- target;
- risk warning;
- time in trade;
- MFE / MAE;
- strategy attribution;
- holdings source / as-of / reconciliation state.

Warnings should prioritize action, not generate alert fatigue.

## Resonance center

The resonance center must show:

- bounded monitored pool;
- component state (0/3, 1/3, 2/3, 3/3 or version-equivalent);
- PROVISIONAL / CONFIRMED / RETRACTED;
- first trigger timestamp;
- trigger price;
- data freshness;
- alert delivery status;
- alert latency;
- missed / failed alert diagnostics;
- current chart with trigger marker.

When an owner-approved resonance reaches its actionable state, the interface should make it immediately obvious and the notification pipeline should attempt prompt delivery subject to verified data/finality rules.

## Alert design

Priority classes:

- CRITICAL: exit / stop / invalidation / severe data issue;
- HIGH: confirmed entry / add / resonance / material thesis change;
- MEDIUM: approaching trigger / warning / regime deterioration;
- INFO: routine state change / data update.

Every alert should include:
- company + symbol;
- action;
- price;
- reason;
- key level;
- timestamp;
- strategy;
- link to the decision card.

Deduplicate repeated alerts. Do not repeatedly notify the same unchanged condition.

## Human factors

The UI must:
- minimize clicks for the most common actions;
- preserve context when navigating between stocks;
- support desktop first, with a compact mobile monitoring view;
- keep the action state fixed and visible;
- avoid dense walls of text;
- provide tooltips / explanations for advanced terms;
- surface stale or missing data clearly;
- distinguish UNKNOWN from bearish;
- allow drill-down without forcing drill-down;
- support keyboard / quick navigation where practical.

## Professional data behavior

Every visible decision should be traceable to:
- market date;
- observedAt;
- availableAt;
- decision version;
- strategy version;
- source freshness;
- latest frozen snapshot.

The UI must never silently blend later information into an earlier decision view.

## Performance center

Provide institutional-grade performance views by:
- strategy;
- version;
- Regime;
- industry;
- holding horizon;
- setup;
- year / month;
- selected -> triggered -> filled -> profitable funnel.

Metrics:
- total return;
- win rate;
- expectancy;
- payoff;
- profit factor;
- max drawdown;
- MFE / MAE;
- turnover;
- costs;
- capital utilization;
- alert precision / recall where defined;
- resonance latency / missed-alert rate.

Avoid vanity-only charts.

## Usability acceptance goals

Target future acceptance criteria:
- user can identify the highest-priority action within 5 seconds;
- user can locate entry / stop / target within 5 seconds;
- user can tell whether a signal is provisional or confirmed without opening details;
- user can tell whether data is stale / UNKNOWN;
- candidate vs holding vs warning states are visually distinct;
- common monitoring tasks require minimal navigation;
- no critical alert is hidden only inside a secondary panel.

## Implementation sequencing

This document is a North-Star design contract, not authority to prematurely rewrite the current deployed resonance UI.

Recommended implementation path:
1. information architecture / design tokens;
2. shared decision-card components;
3. market command center;
4. candidate / holdings boards;
5. chart workspace;
6. resonance center;
7. performance center;
8. responsive/mobile monitoring;
9. usability testing and latency/readability acceptance;
10. production activation only under the applicable owner/runtime gates.

### Actual Holdings source badge

Until a real verified snapshot exists, display:
- Source: `USER_UPLOADED_BROKER_SCREENSHOT`;
- Last verified: `NO VERIFIED SNAPSHOT`;
- State: `OWNER SCREENSHOT IMPORT PENDING`.

After a verified import, display the immutable snapshot source/as-of/readback identity. Never expose broker API connectivity because it is not authorized.
