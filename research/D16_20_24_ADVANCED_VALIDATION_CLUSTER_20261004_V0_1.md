# D16-20 ~ D16-24 Advanced Statistical Validation Cluster 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L2_MECHANISM_FALSIFICATION_DEFINED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Production/runtime impact: NONE

## Purpose

Close the mechanism + falsification layer for five previously L0 modules without inventing Taiwan PIT evidence:

- D16-20 Causal Inference
- D16-21 Alternative Data Provenance / Selection Bias
- D16-22 NLP / LLM Financial-text Feature Validation
- D16-23 Stress Test / Scenario / Reverse Stress Test
- D16-24 Monte Carlo Simulation / Distributional Validation

All five are validation / confidence / uncertainty modules. None becomes PRIMARY_ALPHA merely because the method is sophisticated.

## Common firewalls

1. Prediction is not causation.
2. Simulation is not empirical evidence.
3. Stress scenarios are not probability forecasts.
4. Alternative-data timestamp integrity does not prove representativeness.
5. NLP/LLM transformation quality does not create a second Alpha vote from the same text.
6. Every historical input must preserve decision-time / first-known semantics.
7. UNKNOWN is not FAIL / 0 / no-event.
8. Every model / prompt / scenario / sampling / simulation variant joins the experiment family.
9. Outer OOS / prospective evidence remains untouched.
10. No Formal selection, ranking, sizing, monitoring, notification or execution behavior changes.

---

# D16-20 Causal Inference

## Ownership

D16-20 owns identification and causal-validation methodology.
The economic observable remains owned by its source domain.

Examples:
- an earnings surprise remains D07/D17 evidence;
- an institutional flow remains D06 evidence;
- D16-20 may test whether a defensible intervention/exposure effect is identified.

Causal sophistication is not a stock-selection vote by itself.

## Estimand first

Before choosing a method, freeze:
- treatment/exposure;
- treatment assignment clock;
- outcome;
- horizon;
- target population;
- estimand: ATE / ATT / CATE / policy effect / local effect;
- pre-treatment covariates;
- interference/spillover assumptions;
- missingness / censoring semantics.

A predictor that cannot be interpreted as a coherent intervention may remain predictive only; causal language is not required for stock-selection usefulness.

## Identification families

Admissible research families include:
- randomized / quasi-randomized designs when genuinely available;
- matching / weighting / outcome-regression under conditional exchangeability;
- difference-in-differences with credible timing and pre-trend logic;
- instrumental variables under relevance + exclusion + monotonicity/local-effect semantics where justified;
- regression discontinuity around genuine assignment cutoffs;
- synthetic-control-style counterfactuals for suitable aggregate/event settings;
- Double / Debiased Machine Learning for nuisance-function estimation when its causal identifying assumptions are separately satisfied.

Machine learning can estimate nuisance functions; it does not create identification.

Chernozhukov et al. (2018) show how orthogonal scores + cross-fitting reduce regularization/overfit bias for causal parameters. This still assumes a valid causal design.

## Finance-specific failure modes

- anticipation: price moves before the official event;
- post-treatment control: conditioning on a variable already affected by the event;
- collider bias;
- staggered / heterogeneous treatment timing;
- treatment spillovers across firms/sectors;
- market-wide common shocks;
- changing universe / delisting / corporate-action selection;
- outcome-conditioned sample construction;
- lack of overlap / positivity;
- time-varying confounding;
- using ex-post event classification.

## Falsification

Required where applicable:
- pre-trend / pre-event tests;
- placebo dates / placebo outcomes;
- negative controls;
- lead-lag diagnostics;
- overlap/common-support diagnostics;
- alternative covariate sets defined ex ante;
- sensitivity to influential dates / sectors / episodes;
- explicit unmeasured-confounding sensitivity when possible;
- matched descriptive baseline separated from causal claim.

A statistically significant coefficient is not a causal effect.
A causal effect is not automatically predictable Alpha: a true causal mechanism may be fully priced.

## PIT/replay contract

Treatment assignment and all controls must be known at the causal decision clock.
Revised macro labels, later event classifications or present-day universe membership cannot be backfilled.

## L3 blocker

No L3 until at least one executable Taiwan PIT causal research design demonstrates:
- treatment clock;
- cohort membership;
- pre-treatment covariate build;
- overlap diagnostics;
- deterministic replay;
- fail-closed UNKNOWN semantics.

---

# D16-21 Alternative Data Provenance / Selection Bias

## Ownership boundary vs D16-11

D16-11 remains the generic provenance primitive owner:
source identity, version/generation, first-known/available-at/captured-at, lineage, replay, missingness and substitution control.

D16-21 owns the residual alternative-data bias layer:
- vendor/platform selection bias;
- panel entry/exit bias;
- survivorship/backfill;
- entity-mapping error;
- non-random missingness;
- population representativeness;
- vendor methodology/model changes;
- platform-user behavior drift;
- alternative-data-specific leakage.

Terminal specialist classification:
SCOPE_DEDUP_ONLY / KEEP_BOTH_WITH_NARROWED_D16_21_SCOPE.

## Generic provenance can be perfect while alternative data is still biased

Example:
every mobile-device observation has perfect timestamp/version lineage, but the device panel overrepresents a demographic/geographic subgroup.

D16-11 may PASS provenance.
D16-21 must still flag REPRESENTATIVENESS_UNKNOWN / BIASED.

This divergent state proves the modules are not duplicates.

## Alternative-data validation matrix

For every dataset freeze:
- target population;
- observed sampling frame;
- unit of observation;
- entity-mapping method/version;
- inclusion/exclusion mechanism;
- panel entry/exit;
- vendor backfill policy;
- historical revisions;
- geographic/demographic/platform coverage;
- missingness mechanism;
- methodology/model version;
- data latency and publication behavior;
- legal/licensing access constraints where relevant.

Ekster & Kolm (2021) identify entity mapping, ticker tagging, panel stabilization and debiasing as core alternative-data challenges.

## Selection-bias falsification

Required where possible:
- compare coverage against a PIT official universe;
- coverage by size/liquidity/sector/listing venue;
- panel entry/exit event study;
- common-support analysis;
- entity-link precision/recall audit;
- source/vendor change-point audit;
- missingness vs issuer characteristics;
- leave-vendor / leave-source sensitivity;
- current coverage must not be backfilled into the past.

Inverse-probability weighting is not a magic repair:
if some historical units have zero inclusion probability, universe-level effects are unidentified from that vendor sample.

## Interface with D16-22

D16-21 owns who/what enters the alternative-text/data sample.
D16-22 owns whether the NLP/LLM transformation of a frozen text sample is valid.
One raw dataset cannot generate two independent votes through these validation layers.

## L3 blocker

No L3 until a Taiwan alternative dataset has:
- frozen PIT panel/universe;
- entity-link replay;
- vendor-version receipt;
- coverage/entry-exit diagnostics;
- selection-bias audit.

---

# D16-22 NLP / LLM Financial-text Feature Validation

## Ownership

D16-22 validates text-to-feature transformation.
It does not re-own:
- D17 news/event semantics;
- D07 fundamental disclosure semantics;
- D11 official event clocks;
- D16-11 generic provenance.

If D16-22 extracts sentiment/event features from a D17 document, the text feature remains a transformation of the same parent evidence receipt unless incremental information is independently proven.

## Task taxonomy

Separate:
1. extraction / structured field parsing;
2. classification / topic tagging;
3. sentiment / tone;
4. summarization;
5. event / relation extraction;
6. generative forecasting / open-world reasoning.

Historical PIT risk generally rises as the task relies more on model-internal world knowledge rather than source-local text.

## LLM look-ahead firewall

A modern pretrained LLM may contain information from after the historical decision date in its weights.

Therefore:
- source text being PIT-safe is necessary but not sufficient;
- a current unrestricted LLM cannot automatically create promotion-grade historical forecasts for pre-training-cutoff dates;
- model knowledge cutoff / training-vintage evidence is part of the PIT contract for open-world tasks;
- point-in-time model vintages are preferred for historical predictive claims;
- source-local extraction/classification may be researched with strict prompts, but contamination/distraction tests remain required.

Glasserman & Lin (2023) show look-ahead/distraction concerns in GPT sentiment backtests.
Kelly et al. (2026) explicitly motivate Point-in-Time language models because unrestricted internet pretraining embeds future information.
Kong et al. (2026) identifies look-ahead, survivorship, narrative, objective and cost bias as recurring financial-LLM evaluation failures.

## Immutable text-model receipt

Freeze:
- documentId/version;
- source/publishedAt/availableAt/firstKnownAt;
- text hash;
- model provider/model/version/vintage;
- tokenizer where relevant;
- system prompt;
- user prompt template/version;
- retrieval/tool state;
- temperature/top-p/seed where controllable;
- output schema/parser version;
- run timestamp;
- raw model output hash;
- normalized feature output.

A silent vendor model upgrade creates a new experiment version.

## Baselines

LLM feature must compare against simpler baselines where applicable:
- keyword/lexicon;
- bag-of-words / linear model;
- finance-specific encoder/classifier;
- source-native structured fields;
- no-text baseline.

Model size or prose quality is not incremental financial information.

## Falsification battery

- entity-name redaction / anonymization;
- date redaction where task permits;
- pre-cutoff vs post-cutoff performance;
- prompt paraphrase stability;
- repeated-run / seed stability;
- retrieval ON vs OFF;
- document truncation / metadata removal;
- company-size / familiarity stratification;
- Chinese/Taiwan-domain terminology stability;
- model-version upgrade sensitivity;
- simple-baseline incremental OOS test;
- transaction-cost and turnover test for any trading feature.

If anonymization materially changes historical profitability, model-internal company knowledge may be contaminating the feature.

## L3 blocker

No L3 until an executable Taiwan PIT text corpus + frozen model/prompt pipeline demonstrates:
- immutable source clocks/versions;
- deterministic or bounded-repeat replay;
- contamination controls;
- simple-baseline comparison;
- model-version lineage.

Current general-purpose LLM access alone is not L3 PIT evidence.

---

# D16-23 Stress Test / Scenario / Reverse Stress Test

## Ownership boundary vs D07-23

D07-23 owns enterprise/fundamental scenario objects:
revenue, margin, capex, cash flow and business assumptions.

D16-23 owns stress-validation methodology:
scenario severity, model risk, tail behavior, dependency structure, reverse stress and failure-threshold logic.

Terminal specialist classification:
KEEP_SEPARATE / OBJECT_MODEL_VS_VALIDATION_METHOD.

D16-23 must not rebuild company forecasts as a second scenario owner.

## Stress taxonomy

Freeze each test class separately:
- one-factor sensitivity;
- historical stress replay;
- hypothetical coherent scenario;
- multi-factor dependency stress;
- liquidity / slippage / fill stress;
- correlation-break / concentration stress;
- source/data-outage stress;
- parameter/model stress;
- reverse stress.

BCBS stress-testing principles define stress scenarios as adverse conditions and reverse stress testing as starting from a predefined adverse outcome and identifying scenarios that can lead to it.

## Stress test != probability forecast

A severe-but-plausible scenario need not carry a calibrated occurrence probability.
Do not say:
"scenario loss = 12%" -> "12% expected loss".

Reverse stress identifies vulnerabilities; it does not estimate likelihood.

## Scenario contract

Freeze before results:
- test objective;
- portfolio/strategy/version;
- starting state and decision clock;
- horizon/path;
- stressed variables;
- joint-dependency assumptions;
- execution/rebalancing response;
- limits/trading-halt assumptions;
- pass/failure outcome;
- model overlays/judgment;
- comparison baseline.

## Falsification

- scenario chosen after seeing desired result;
- impossible combination of shocks;
- double-counting correlated shocks;
- unchanged correlation/liquidity during crisis without justification;
- close-price liquidation despite limit-down/non-orderability;
- using post-stress information for defensive action;
- ignoring recovery / missed-rebound opportunity cost;
- reporting only the scenario that harms or favors the strategy;
- confusing stress survival with expected profitability.

## Reverse stress

Define failure first, for example:
- drawdown breach;
- liquidity/execution breakdown;
- zero-pick/coverage failure;
- portfolio heat breach;
- calibration support collapse.

Then search for a coherent minimal/severe combination capable of causing the failure.
The output is a vulnerability map, not an event probability.

## D16-24 handoff

D16-23 defines scenarios/failure conditions.
D16-24 may simulate or validate distributions under frozen assumptions.
D15 risk modules remain owners of portfolio risk measures/policies.

## L3 blocker

No L3 until an executable Taiwan research-only stress harness proves:
- frozen starting state;
- reproducible scenario IDs;
- coherent dependency inputs;
- executable Taiwan price/limit/cost semantics;
- replay and fail-closed UNKNOWN.

---

# D16-24 Monte Carlo Simulation / Distributional Validation

## Core principle

Monte Carlo simulation propagates assumptions.
It does not manufacture empirical evidence.

10,000,000 simulated paths from four historical bear episodes still rest on four historical bear episodes plus model assumptions.

More paths reduce Monte Carlo sampling error; they do not eliminate model error, parameter error or structural misspecification.

## Simulation families

Keep separate:
- parametric Monte Carlo;
- historical bootstrap;
- block/stationary bootstrap;
- residual/bootstrap-from-fitted-model;
- regime-conditional simulation;
- copula/dependence simulation;
- scenario-conditioned simulation.

IID normal simulation is a baseline, not a default truth for equity returns.

## Distributional object

Freeze:
- target return/P&L variable;
- horizon;
- conditioning information;
- marginal distributions;
- serial dependence;
- cross-sectional dependence;
- volatility dynamics;
- tail treatment;
- regime/state assumptions;
- transaction-cost/execution model;
- parameter-estimation method;
- random-number generator / seed;
- number of paths;
- simulation version.

## Distributional validation

Compare simulated/predicted distributions with later untouched outcomes using:
- probability integral transform / reliability diagnostics where appropriate;
- quantile/interval coverage;
- tail exceedance frequency;
- proper scoring rules;
- calibration + sharpness;
- moment/tail diagnostics;
- date/regime stability.

Diebold, Gunther & Tay (1998) provide a foundational density-forecast evaluation framework.
Gneiting, Balabdaoui & Raftery (2007) emphasize calibration and sharpness together.

## Dependence firewall

Stock-market paths exhibit serial dependence, volatility clustering, cross-sectional common shocks and regime persistence.

Therefore:
- naive iid row resampling is not a primary uncertainty tool;
- date/block/episode resampling is preferred when the target estimand requires preserving temporal dependence;
- block length is an inference parameter, not something tuned for the best p-value;
- whole-date resampling is needed when many symbols share one market shock.

## Parameter vs process uncertainty

Report separately where possible:
- Monte Carlo sampling error;
- parameter-estimation uncertainty;
- model-form uncertainty;
- regime/dependence uncertainty;
- execution/cost uncertainty.

A narrow simulation interval conditional on fixed estimated parameters is not proof the real-world outcome is precise.

## Falsification

- empirical tail exceedances materially exceed simulation;
- observed volatility clustering absent from simulated paths;
- cross-sectional correlation collapses or explodes incorrectly;
- result changes sign under modest defensible distribution choices;
- simulation result is one-regime dependent;
- parameter uncertainty omitted;
- historical bootstrap silently excludes dead/delisted names;
- random seed/path count is not replayable;
- simulated success is treated as prospective evidence.

## Relationship to D16-23 / D15

D16-24 validates / simulates distributions.
D16-23 defines stress/reverse-stress scenarios.
D15 owns portfolio sizing/risk policy and tail-risk measures.

No duplicate Alpha vote or risk-policy authority.

## L3 blocker

No L3 until an executable Taiwan PIT simulation/replay demonstrates:
- PIT-frozen input distribution;
- dependency-preserving path generation;
- random-seed/version replay;
- later-outcome distributional validation;
- Taiwan execution/cost semantics where strategy P&L is simulated.

---

# Cluster conclusions

## Maturity

The five modules now satisfy L2 mechanism + falsification:

- D16-20 -> L2 / 40%
- D16-21 -> L2 / 40%
- D16-22 -> L2 / 40%
- D16-23 -> L2 / 40%
- D16-24 -> L2 / 40%

No L3 is claimed.

## Overlap terminal classifications

- D16-11 vs D16-21:
  SCOPE_DEDUP_ONLY / KEEP_BOTH_WITH_NARROWED_D16_21_SCOPE.
- D07-23 vs D16-23:
  KEEP_SEPARATE / OBJECT_MODEL_VS_VALIDATION_METHOD.

These are specialist research returns; any curriculum merge/retirement remains owner-controlled.

## D16 domain impact

With the current 25-module D16 inventory, promoting D16-20~24 from L0 to L2 moves D16 domain maturity:

52.0% -> 60.0%.

The 354-module global weighted maturity moves to approximately 40.0% after tracker recomputation.

This is curriculum maturity only, not evidence of improved trading returns.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next continuation

D16 has now exhausted its remaining L0 modules.

Do not invent L3 for D16-20~24.

Next research choices:
1. attempt L3 only where executable Taiwan PIT builders/replays genuinely exist;
2. otherwise move to remaining room-owned D18 work, especially D18-15 (currently L0) or evidence-dependent D18 lanes;
3. keep D16-20~24 at L2 until real replay/data evidence exists.

## Methodology anchors

- Hernán & Robins, Causal Inference: What If.
- Chernozhukov et al. (2018), Double/debiased machine learning for treatment and structural parameters.
- Ekster & Kolm (2021), Alternative Data in Investment Management: Usage, Challenges and Valuation.
- Glasserman & Lin (2023), Assessing Look-Ahead Bias in Stock Return Predictions Generated by GPT Sentiment Analysis.
- Kelly et al. (2026), Scaling Point-in-Time Language Models.
- Kong et al. (2026), Evaluating LLMs in Finance Requires Explicit Bias Consideration.
- BCBS (2018; consolidated 2026), Stress testing principles.
- Diebold, Gunther & Tay (1998), Evaluating Density Forecasts with Applications to Financial Risk Management.
- Gneiting, Balabdaoui & Raftery (2007), Probabilistic Forecasts, Calibration and Sharpness.
