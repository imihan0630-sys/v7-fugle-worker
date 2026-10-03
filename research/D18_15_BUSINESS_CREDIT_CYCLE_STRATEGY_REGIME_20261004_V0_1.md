# D18-15 Business / Credit Cycle × Strategy Regime 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L2_MECHANISM_FALSIFICATION_DEFINED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Production/runtime impact: NONE

## Purpose

Define the mechanism, ownership boundary, falsification design, PIT/replay contract and Taiwan-data requirements for:

D18-15 Business / Credit Cycle × Strategy Regime
（景氣／信用循環與策略市場狀態互動）

This module does not measure the business cycle itself and does not construct issuer credit fundamentals.
It tests whether an already-frozen business/credit-cycle state changes the effectiveness, risk or appropriate activation of a frozen strategy.

No strategy policy, weight, threshold, capital allocation or Formal rule is authorized by this research.

---

## 1. Ownership boundary

### D13-18 owns Business Cycle measurement
D13-18 owns:
- leading / coincident / lagging indicators;
- first-known macro vintage;
- publication/revision clock;
- turning-point uncertainty;
- Taiwan NDC indicator semantics;
- ex-TAIEX circularity firewall.

D18-15 consumes only a frozen D13-18 cycle-state receipt.

### D22 owns Credit Cycle primitives
Relevant producer families include:
- D22-04 cost of debt / refinancing risk;
- D22-06 credit spread / bond yield;
- D22-11 credit cycle / bank lending conditions;
- issuer-level leverage / coverage modules where used as controls.

D18-15 does not recreate those measurements.

### D18-15 owns Strategy Interaction
D18-15 owns:
- strategy performance conditional on frozen business/credit state;
- interaction / heterogeneity estimates;
- cycle-specific attribution;
- later, only after evidence, strategy activation challenger design.

### D18-13 and D18-14 remain downstream validation owners
- D18-13 owns general Regime attribution across strategy results.
- D18-14 owns walk-forward Regime validation and promotion-gate methodology.

Anti-double-count:
one D13/D22 state receipt may condition D18-15 once; it does not become a second stock-level Alpha vote.

Terminal overlap result vs D13-18:
KEEP_SEPARATE / MACRO_STATE_TO_STRATEGY_INTERACTION.

---

## 2. Positive mechanism

The economic mechanism is plausible but not universal.

### Business-condition risk premia vary over time
Fama & French (1989) document business-cycle variation in expected stock/bond returns, with expected returns tending to be lower in strong conditions and higher in weak conditions.

Implication:
a strategy's unconditional average payoff may hide materially different conditional risk premia.

### Momentum may depend on macro conditions
Chordia & Shivakumar (2002) show momentum profits are related to lagged macro variables and time-varying expected returns.

Implication:
momentum-style strategy performance can be state-dependent rather than invariant.

### Credit tightening can affect firm groups asymmetrically
Perez-Quiros & Timmermann (2000) find smaller firms exhibit stronger cyclical asymmetry and greater sensitivity to credit conditions in recession states.

Implication:
size/liquidity composition can mediate a cycle × strategy result.

### Credit spreads carry macro/financial-condition information
Gilchrist & Zakrajsek (2012) show their excess bond premium contains predictive information for economic activity and asset prices and is linked to financial-sector risk-bearing capacity.

Implication:
business-cycle and credit-cycle states should not automatically be collapsed into one variable; credit tightening can carry distinct information.

### Strategy crash risk can be state dependent
Daniel & Moskowitz (2016) show momentum crashes cluster in panic states after market declines, with high volatility and rebounds.

Implication:
a state interaction may matter for tail risk even when average return differences are modest.

### Firm-level credit quality can interact with momentum
Avramov et al. (2007) document strong momentum among low-grade firms and little among high-grade firms.

Guard:
this is firm-level credit quality evidence, not proof that a macro credit-cycle state has the same effect.

---

## 3. Core falsification

The positive literature does NOT authorize Taiwan transfer.

D18-15 must actively falsify:

1. US-market transfer failure
   - sign/magnitude may differ in Taiwan;
   - sector composition, financing structure and investor base differ.

2. Market-state redundancy
   - cycle state may merely proxy trend, volatility, breadth, liquidity or Risk-on/Risk-off.

3. Size/liquidity composition
   - apparent cycle effect may come from small-cap or low-liquidity stocks changing risk exposure.

4. Crisis domination
   - one recession/crisis episode may generate the full result.

5. Revised-history look-ahead
   - later-revised macro indicators may create cleaner cycles than investors knew in real time.

6. Equity-price circularity
   - Taiwan NDC leading/monitoring indicators include TAIEX information.
   - aggregate NDC state cannot support a stock-return claim unless the ex-TAIEX / non-price-component test survives.

7. Credit-state ambiguity
   - wider spreads can reflect expected default, liquidity, risk aversion, dealer balance-sheet capacity or supply/demand.
   - one spread cannot be automatically called "credit supply tightening".

8. Attribution-policy confusion
   - a strategy doing worse in one cycle is descriptive attribution.
   - it does not prove deactivation/weight reduction improves OOS utility after missed-opportunity cost.

9. Frequency pseudo-replication
   - 20 daily trade dates under one monthly macro vintage are not 20 independent business-cycle observations.

10. Multiple testing
   - cycle taxonomy × credit taxonomy × strategy × horizon × threshold × lag × policy all belong to the same experiment family.

---

## 4. State architecture

Do NOT immediately collapse business and credit conditions into one scalar Regime score.

Store separate producer receipts first.

### BUSINESS_CYCLE_STATE
Producer: D13-18.
Candidate semantic family, only after producer validation:
- ACCELERATING
- DECELERATING
- TURNING / TRANSITION
- UNKNOWN

Any expansion/recession label must be defined by frozen first-known rules.
Retrospective turning-point labels are diagnostic only.

### CREDIT_CYCLE_STATE
Producer: D22 credit modules.
Candidate semantic family, only after producer validation:
- EASING
- TIGHTENING
- TRANSITION
- UNKNOWN

No threshold is frozen here.

### Two-dimensional interaction
Preferred initial design:
Business state × Credit state remain separate.

Illustrative research cells:
- growth accelerating + credit easing;
- growth accelerating + credit tightening;
- growth decelerating + credit easing;
- growth decelerating + credit tightening;
- transition / unknown states.

These are research cells, not trading policies.

Sparse cells remain descriptive-only.

---

## 5. Decision-clock and vintage contract

Required on every state receipt:
- source;
- stateVersion;
- reference period;
- publishedAt;
- capturedAt;
- knownAtTaipei;
- firstEligibleTaiwanDecision;
- vintage/hash;
- revision status;
- component-definition version;
- state confidence / UNKNOWN reason;
- producer receipt reference.

Rules:
- July macro data published in August is not July-known information.
- later revisions never overwrite the first-known historical state.
- ex-post recession/turning-point dates cannot be backfilled into trading decisions.
- after-close or after-decision releases affect no earlier than the next eligible decision.
- stale credit observations preserve age/staleness explicitly.

---

## 6. Taiwan circularity firewall

D13-18 has already established that Taiwan NDC leading / monitoring composites include TAIEX information.

Therefore D18-15 stock-return experiments must compare:

A. aggregate cycle composite;
B. ex-TAIEX reconstruction where PIT-vintage components permit;
C. macro-component baseline excluding market-price components.

If only A is available:
- cycle state may be used as descriptive macro context;
- it cannot prove incremental stock-return timing value.

This is mandatory, not optional sensitivity analysis.

---

## 7. Primary estimands

### Attribution estimand
For frozen strategy s and cycle state r:

E[NetOutcome_s | State_r]

reported against:
- unconditional same-strategy outcome;
- same-date market/exposure controls;
- identical costs/horizon.

This is descriptive conditional performance, not policy value.

### Interaction estimand
Prefer an incremental contrast such as:

Delta(s,r) =
[Strategy_s - matched baseline | r]
-
[Strategy_s - matched baseline | reference state]

This asks whether the strategy's incremental effect itself changes by state.

Do not call it causal without a separate D16-20 identification design.

### Policy estimand — later only
If a cycle-aware activation/weighting challenger is eventually tested:

NetOutcome(CYCLE_POLICY)
-
NetOutcome(STATIC_STRATEGY)

Both arms must share:
- decision dates;
- candidate stream;
- execution/cost model;
- capital model;
- strategy version;
- outcome horizon.

Exposure-matched control is required where de-risking can explain the result.

---

## 8. Evidence units

Report simultaneously:
- stock/trade row count;
- independent strategy decision dates;
- independent macro release vintages;
- independent business-cycle episodes;
- independent credit-cycle episodes;
- joint-state episodes;
- transition counts.

A monthly state repeated over many daily observations cannot create independent macro evidence.

Leave-one-cycle-episode-out sensitivity is required when episode count permits.

A result driven by one recession / credit event is not robust.

---

## 9. Negative controls

Required challenger/falsification battery:

1. first-known vintage vs current revised history;
2. aggregate NDC vs ex-TAIEX / non-price component state;
3. date-shift placebo;
4. future-state lead test:
   if future cycle labels outperform contemporaneous frozen labels materially, suspect look-ahead/timing mismatch;
5. lag sensitivity:
   assess whether stale cycle labels retain/lose information;
6. business-only vs credit-only vs joint-state;
7. domestic trend/volatility/breadth/Risk-on-off controls;
8. size/liquidity composition controls;
9. crisis / largest-episode exclusion;
10. same-state different-strategy and same-strategy different-state tests;
11. static strategy baseline;
12. exposure-matched control for de-risking policy.

---

## 10. Transition-state firewall

Turning points are precisely where later data make the cycle look clearest but real-time state is most uncertain.

Therefore:
- transition / disagreement is a first-class state;
- no ex-post relabel of transition months into the later-known regime;
- minimum-duration rules cannot assign the first days/months retrospectively;
- policy research may abstain from Regime changes during transition, but that abstention must include missed-opportunity cost.

---

## 11. Strategy-specific hypotheses

Cycle state is not a universal BUY/SELL gate.

Examples worth testing only as preregistered hypotheses:
- momentum / trend;
- mean reversion;
- breakout;
- value / quality;
- small-cap / illiquidity-sensitive strategies;
- defensive / low-volatility strategies.

External literature supplies plausibility, not sign authority.

A state may alter:
- mean return;
- tail loss;
- hit rate;
- payoff asymmetry;
- turnover;
- drawdown;
- execution cost;
without changing all of them in the same direction.

---

## 12. L2 maturity decision

D18-15 now satisfies L2 mechanism + falsification:

- producer/consumer ownership frozen;
- business vs credit state separation frozen;
- PIT/revision/decision-clock contract frozen;
- Taiwan NDC TAIEX circularity firewall frozen;
- primary attribution/interaction/policy estimands separated;
- episode/release-vintage dependence frozen;
- negative-control battery frozen;
- transition-state semantics frozen;
- multiple-testing family defined.

Promotion:
D18-15 L0 -> L2 / 40%.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

---

## 13. Why not L3

D18-15 remains blocked from L3 because:

1. D13-18 real-time Taiwan business-cycle vintage chain remains pending.
2. ex-TAIEX cycle reconstruction is not proven on historical first-known vintages.
3. D22-11 Credit Cycle / Bank Lending Conditions is still L0.
4. D22-06 Credit Spread / Bond Yield is still L0.
5. no immutable D18-15 two-dimensional cycle-state builder/replay exists.
6. no multi-episode Taiwan occupancy has been accumulated.

No synthetic labels or today's revised history may fill these gaps.

---

## 14. D18 L3 eligibility audit after this study

No other D18 promotion is justified in this cycle.

- D18-01: market-level builder missing.
- D18-02: market trend builder/replay missing.
- D18-03: market realized-volatility builder/replay missing.
- D18-04: TWSE direction-breadth sublane is executable/PIT-validated, but the whole module remains L2 because TPEx cross-market availability, U2 return continuity and prospective occupancy are incomplete.
- D18-05: B2 prospective observer exists; final D18 rotation label builder/replay is missing.
- D18-06: promotion-grade market-cap vintage/PIT source unresolved.
- D18-07: durable prospective global receipts incomplete.
- D18-08~14: policy/attribution/walk-forward lanes require executable frozen Regime states plus OOS/prospective evidence; specifications alone are not L3.
- D18-15: mechanism/falsification now L2; producer data/replay remains incomplete.

Therefore this research cycle intentionally stops D18 at 40.0%, rather than inventing L3 progress.

---

## Exact next continuation

1. Keep D18-15 at L2 until D13 first-known cycle vintages and D22 credit-cycle producers mature.
2. For D18 L3 progress, highest-value engineering/evidence path remains the isolated market-level Regime feature builder for D18-01/02/03, followed by replay tests.
3. D18-04 should accumulate both-venue prospective availability and U2B continuity before whole-module L3.
4. D18-05 should map B2 observer outputs into immutable D18 context receipts before any rotation-policy test.
5. No strategy activation/weighting until state occupancy is known and one policy class + strategy + MDE is preregistered.

Formal Core remains LOCKED.
