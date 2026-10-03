# D16-25 Probabilistic Decision / Bayesian Updating / Uncertainty-aware Selection V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH-ONLY / L2_MECHANISM_FALSIFICATION_AND_EXECUTABLE_VALIDATION_FROZEN / L3_REAL_PIT_EVIDENCE_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Related merge candidate: D15-19 Kelly / Fractional Kelly
Merge decision: NOT YET — this file first establishes D16-25 responsibility and the handoff boundary.

## Purpose

D16-25 studies how PIT-safe evidence becomes:
1. a predictive probability or predictive distribution;
2. a calibrated uncertainty-aware decision;
3. an explicit ABSTAIN / ACCEPT decision under after-cost utility.

It does NOT assume that more evidence modules should become more AND-gates.
It does NOT assume that a calibrated probability is already a position size.
It does NOT replace portfolio risk controls.

Canonical cross-system governance:
- shared-knowledge/PROBABILISTIC_SELECTION_GOVERNANCE_V0_1.md
- shared-knowledge/HYBRID_SELECTION_EXECUTION_DIRECTIVE_V0_1.md

## 1. Core decomposition: estimation, decision, allocation

Freeze three layers.

### A. Predictive estimation — D16-25 owner
Estimate a target-specific predictive object from information available at decision time.

Examples:
- P(target reached before stop | evidence at T)
- P(after-cost D5 return > 0 | evidence at T)
- predictive distribution of after-cost D5 return.

Every probability must name:
- strategyId / strategyVersion;
- decisionStage;
- targetId;
- horizon;
- reference/entry basis;
- cost model;
- outcome rule;
- modelVersion;
- calibrationVersion;
- baseRateCohortVersion;
- decisionAt / firstKnownAt lineage.

A generic "win probability" without these fields is semantically invalid.

### B. Decision utility / abstention — D16-25 owner
A probability is useful only through a decision problem.

Decision evaluation must combine:
- predictive distribution/probability;
- payoff magnitude;
- transaction cost / slippage assumptions;
- explicit uncertainty;
- ABSTAIN option;
- false-acceptance / missed-opportunity cost.

Simple research EV:
EV = P(win) * conditionalAvgWin - P(loss) * conditionalAvgLoss - expectedTradingCost.

This is an intentionally simplified representation.
For asymmetric/multi-outcome equity returns, the full predictive payoff distribution is preferred.

### C. Position allocation — D15 owner / D15-19 candidate
Convert a validated predictive edge/distribution into capital fractions under:
- risk budget;
- wealth objective;
- concentration/correlation constraints;
- drawdown/tail constraints;
- liquidity/capacity;
- position lifecycle;
- portfolio interaction.

D16-25 therefore produces a **sizing input**, not an automatically authorized size.

This layer separation is the central dependency for the later D15-19 merge decision.

## 2. Five Hybrid decision roles remain mandatory

Every input must have one primary role:
- HARD_INVALIDATION;
- PRIMARY_ALPHA;
- SUPPORTIVE;
- CONTEXT_ONLY;
- CONFIDENCE_UNCERTAINTY.

Rules:
- UNKNOWN != FAIL.
- UNKNOWN != 0.
- SUPPORTIVE absence does not become automatic rejection.
- CONTEXT_ONLY does not silently become a stock-level hard gate.
- correlated signals are not independent votes.
- new knowledge defaults to RESEARCH_ONLY.

## 3. Target and label semantics

### 3.1 Target must be frozen before outcomes
No post-hoc target switching.

A change in any of these creates a new experiment:
- D1 vs D5 vs D20;
- positive return vs target-first;
- close-to-close vs executable-entry reference;
- gross vs after-cost;
- stop/target geometry;
- corporate-action price space;
- ambiguous same-bar treatment.

### 3.2 Outcome maturity
At evaluation cutoff T:
- only labels whose outcomeMaturedAt <= T are eligible;
- immature D+N labels remain IMMATURE / UNKNOWN;
- they are never coerced to 0/loss.

Overlapping D+N outcomes require purging/block-aware validation around chronological holdouts.

### 3.3 Target-first / stop-first ambiguity
If target and stop cannot be ordered from available bar granularity:
- retain AMBIGUOUS;
- do not fabricate a binary win/loss label.

A binary probability model may exclude AMBIGUOUS only under a preregistered label policy and must report excluded coverage.

## 4. Base rate / prior contract

A Bayesian prior is not a subjective convenience.

The base-rate cohort must be PIT-safe and target-specific:
- strategy;
- target;
- horizon;
- eligibility population;
- market/session semantics;
- cost model.

Possible hierarchy:
global strategy/horizon prior
-> broad Regime prior
-> narrower context prior

But every extra conditioning dimension fragments samples and increases estimation error.

Rules:
- prior hyperparameters are estimated/frozen from training data only;
- a holdout outcome cannot update the prior before its decision;
- low-N cells shrink toward a broader parent prior rather than produce extreme 0/1 estimates;
- Regime-specific priors require multiple independent episodes, not many rows from one persistent episode;
- base-rate drift must be monitored prospectively.

A Beta-Binomial updater is a useful binary baseline, not proof that the true equity-return process is Bernoulli.

## 5. Bayesian Updating guardrails

Bayesian Updating is OPTIONAL and must beat simpler baselines.

Major falsification risk:
**correlated evidence double counting**.

Examples:
- RSI + ROC + MA slope + recent return;
- breakout + distance-to-high + momentum;
- sector breadth + market breadth + risk-on label.

Do NOT multiply independent likelihood ratios unless conditional independence is justified.

Safer approaches:
- group correlated inputs into evidence families;
- estimate joint or conditional incremental contribution;
- regularize/shrink;
- compare ablations;
- keep one simple score/rank baseline.

Posterior precision must not increase merely because duplicate transforms of the same source were added.

## 6. Calibration is separate from discrimination

A model can rank stocks well and still output misleading probabilities.

Required metrics for binary probability:
- Brier score;
- logarithmic loss;
- fixed-bin reliability table / calibration plot;
- empirical outcome rate;
- frozen reference-base-rate Brier comparator;
- Brier skill only against a base rate frozen without using the evaluation outcomes.

Where predictive distributions are available:
- proper distributional score such as CRPS may be added;
- PIT/reliability diagnostics may be used under appropriate time-series semantics.

AUC/rank correlation/return spread alone cannot certify probability calibration.

Literature anchor:
Gneiting & Raftery (2007) — strictly proper scoring rules reward truthful probabilistic forecasts.
Gneiting, Balabdaoui & Raftery (2007) — evaluate sharpness subject to calibration.

## 7. Brier decomposition

For binary predictions, research may report a fixed-bin approximate decomposition:
- Reliability: forecast probabilities versus observed frequency;
- Resolution: conditional outcome rates versus overall event rate;
- Uncertainty: base outcome uncertainty.

Bins must be frozen before outcomes.
Do not change bin edges to make calibration look better.

Exact Brier score remains primary; binned decomposition is diagnostic and depends on grouping.

## 8. ECE boundary

Expected Calibration Error (ECE) may be shown only as a secondary diagnostic.

Do not use ECE as the sole promotion metric because:
- it depends on binning;
- different probability distributions can produce misleading comparisons;
- modern work documents theoretical pathologies/discontinuities.

Primary calibration evidence remains proper scoring + reliability diagnostics + prospective utility.

## 9. Calibration under Regime / distribution shift

Historical calibration is not permanent.

Covariate/Regime shift can break probability calibration.

Required:
- chronological evaluation;
- walk-forward recalibration only from matured prior outcomes;
- calibrationVersion / trainingThroughDate;
- calibration by relevant Regime where sample supports it;
- explicit UNKNOWN/ABSTAIN when the model is out-of-domain;
- no random-fold mixing that leaks future states into calibration.

Changing:
- calibration method;
- calibration window;
- Regime partition;
- shrinkage prior

creates a new version/experiment.

## 10. Uncertainty is not just p near 0.5

A forecast p=0.50 can be:
- very precise evidence of no edge;
- or highly uncertain.

These are different.

Keep separate uncertainty channels where possible:
1. ALEATORIC / OUTCOME uncertainty — irreducible payoff dispersion.
2. EPISTEMIC / PARAMETER uncertainty — finite-sample/model uncertainty.
3. DATA_PROVENANCE uncertainty — missing/stale/untrusted evidence.
4. DISTRIBUTION_SHIFT uncertainty — current context differs from training support.
5. EXECUTION_PAYOFF uncertainty — fill/slippage/target-stop payoff uncertainty.

Do not use |p-0.5| as the universal uncertainty metric.

A model may be confident that p≈0.5 and therefore correctly abstain for lack of edge.

## 11. ABSTAIN / selective decision contract

ABSTAIN is a legitimate action.

Possible preregistered reasons:
- expected net utility <= threshold;
- uncertainty exceeds a frozen tolerance;
- data/provenance is not decision-grade;
- current input is out-of-support;
- payoff distribution cannot be safely estimated;
- required HARD_INVALIDATION cannot be resolved.

Evaluation must report both quality and coverage:
- accepted coverage;
- abstention rate;
- opportunity capture;
- missed positive opportunities;
- false acceptance;
- accepted after-cost realized value;
- drawdown/tail where portfolio path is available;
- reason-specific zero-pick.

A challenger that looks accurate only because it abstains on nearly everything is not superior.

Classical reject-option research establishes that error and rejection form a trade-off; rejection is not equivalent to prediction failure.

## 12. Decision thresholds must not be outcome-tuned

Any:
- minimum posterior probability;
- minimum predicted EV;
- maximum uncertainty;
- abstention threshold;
- probability-to-tier mapping

is a research parameter.

It must be:
- preregistered;
- fitted using training only if learnable;
- frozen inside each outer OOS fold;
- evaluated on untouched holdout/prospective dates;
- counted in the multiple-testing family.

No full-sample "best threshold".

## 13. Time dependence / independence unit

Primary inference unit is not the stock row.

Rows from the same scan date share:
- market state;
- liquidity;
- sector shocks;
- source health;
- ranking capacity.

Report:
- row N;
- independent scan dates;
- relevant Regime episodes;
- leave-one-date/episode sensitivity.

Overlapping D5/D10/D20 labels create temporal dependence.
Use purging/blocking and dependence-aware uncertainty where appropriate.

## 14. Population / selection-bias firewall

Promotion-grade calibration requires a population matching the intended decision.

Do NOT calibrate selection probability from:
- selected-only rows;
- bounded/reason-sorted legacy Shadow rejects;
- rows whose inclusion is determined by the outcome.

Current System 1 feasibility:
- V8.15 C1 complete-population receipt captures the normalized ordinary price>=10 population before history admission and preserves original Formal states/gate evidence/UNKNOWN;
- C1/C2 adapters verify generation/hash/count/PIT semantics;
- however the 2026-10-03 scheduled C1 collector still did not obtain a genuine complete 2026-10-02 generation and failed closed with a preserved blocker artifact.

Therefore:
- architecture/schema feasibility is strong;
- positive promotion-grade Taiwan calibration population is still pending;
- D16-25 must not claim L3 from synthetic fixtures alone.

The mutable legacy `trade_research_shadow_candidates` remains non-authoritative for full-population calibration.

## 15. Selection probability vs execution probability

Never conflate:
- P(strategy outcome succeeds);
- P(entry triggers);
- P(order fills);
- P(target before stop);
- return distribution conditional on fill.

These have different denominators and conditioning.

For example:
P(target before stop | selected)
is not
P(target before stop | filled).

A Kelly/sizing method needs payoff probabilities/distributions conditional on the actual decision/action it will size.

## 16. Utility must include payoff magnitude

Counterexample:
- p(win)=0.70;
- average win = +1%;
- average loss = -4%;
- ignoring costs, EV = 0.7*1% - 0.3*4% = -0.5%.

Therefore a calibrated 70% win probability can still describe a bad trade.

Conversely, a lower hit-rate strategy may have positive EV if wins are sufficiently larger than losses.

This is why D16-25 must output payoff/utility information, not only win probability.

## 17. D16-25 -> D15-19 handoff contract

D16-25 should eventually emit a `PredictiveDecisionReceipt` containing:

Identity:
- predictionId;
- parentDecisionReceiptId / generation;
- strategy/version;
- target/horizon;
- decisionAt.

Prediction:
- predictedProbability where binary;
- predictiveDistribution reference where available;
- conditional payoff estimates;
- predicted gross/net utility.

Calibration:
- modelVersion;
- calibrationVersion;
- trainingThroughDate;
- baseRateCohortVersion;
- calibration status/metrics from prior eligible evaluation.

Uncertainty:
- uncertainty channels;
- interval/model-dispersion/sample-support metadata;
- out-of-domain state.

Decision:
- ACCEPT / ABSTAIN / DATA_BLOCKED;
- reason;
- threshold/utility policy version.

Sizing firewall:
- sizingEligible = false unless calibration, payoff, uncertainty and execution inputs satisfy a separately frozen downstream contract.

D15-19 may consume this receipt.
D15-19 must not silently reconstruct a different probability from the same factors.

## 18. D15-19 Kelly dependency — overlap vs unique responsibility

### Shared concepts
Both D16-25 and D15-19 care about:
- probability;
- payoff distribution;
- uncertainty;
- expected utility/value;
- risk of estimation error.

### D16-25 unique responsibility
- target definition;
- base-rate/prior construction;
- Bayesian/probabilistic evidence combination;
- calibration;
- model/data uncertainty;
- distribution shift;
- ABSTAIN;
- probability/utility validation;
- selection policy research.

### D15-19 unique responsibility
- map a validated edge/distribution to wealth fraction;
- logarithmic-growth objective / Kelly criterion;
- Fractional Kelly risk scaling;
- capital/risk constraints;
- portfolio correlation/concentration;
- drawdown/ruin constraints;
- position lifecycle and aggregate portfolio heat.

Therefore dependency is strong, but duplication is not yet proven.

## 19. Kelly-specific merge firewall

Original Kelly theory maximizes asymptotic logarithmic wealth growth under a specified probabilistic betting environment.

Important limits for stock-system use:
- real equity payoff is not necessarily binary;
- win/loss magnitude is variable;
- estimated probabilities are uncertain;
- slippage/fills/limits alter payoff;
- multiple concurrent positions are correlated;
- short/medium horizon risk can be large even when long-run Kelly growth is attractive.

Fractional Kelly can reduce risk at the cost of growth.

Bayesian Kelly research further shows that when model parameters are unknown, optimal control depends on posterior state/learning.

Implication:
A raw Kelly fraction calculated from an uncalibrated `p` is invalid.

Minimum D15-19 input quality before a merge decision:
1. calibrated target-specific predictive probability/distribution;
2. payoff distribution after costs;
3. uncertainty/parameter-risk representation;
4. explicit action conditioning (selected/triggered/filled);
5. portfolio constraints.

## 20. Simple baselines D16-25 must beat

Complex probabilistic/Bayesian models require incremental value versus:

1. BASE_RATE_ONLY
   - same frozen strategy/target/horizon prior.

2. SIMPLE_SCORE_OR_RANK
   - existing Formal score/rank or strategy rank;
   - no fake probability interpretation.

3. SIMPLE_CALIBRATOR
   - a low-complexity monotone/logistic mapping where admissible.

4. STATIC_ACCEPT_POLICY
   - current frozen baseline decision.

A Bayesian model is rejected/redundant if it adds complexity but no stable:
- calibration improvement;
- after-cost utility improvement;
- opportunity-capture improvement under bounded risk;
- uncertainty/abstention benefit.

## 21. Falsification matrix

D16-25 is falsified or downgraded if any of these occur:

### F1 — probability is uncalibrated
Rank spread looks good but reliability/Brier/log loss is poor.

### F2 — calibration is sample/regime specific
Good overall result disappears by chronology or Regime.

### F3 — probability adds no value versus simple rank/score
No incremental utility or calibration after simple baseline.

### F4 — double-counted evidence creates overconfidence
Posterior confidence rises with redundant indicators but OOS reliability worsens.

### F5 — ABSTAIN gaming
Accepted subset looks good only because coverage collapses; opportunity capture falls materially.

### F6 — payoff mismatch
High p maps to negative after-cost utility because loss magnitude/cost dominates.

### F7 — base-rate leakage
Prior/calibrator uses outcomes not matured by decision time.

### F8 — selection-bias denominator
Calibration sample excludes hard cases/nonselected rows in a way that differs from intended deployment population.

### F9 — shift failure
Probability calibration breaks under changed volatility/liquidity/Regime.

### F10 — sizing misuse
A downstream sizing rule consumes uncalibrated p or ignores payoff/uncertainty.

## 22. Promotion levels for D16-25

### L1
Theory and vocabulary understood.

### L2
Mechanism + falsification + target/prior/calibration/uncertainty/abstention contracts frozen.

### L3
Taiwan PIT feasibility:
- genuine immutable/full intended population exists;
- predictions can be frozen at decision time;
- matured outcomes can be causally joined;
- evaluator/replay works;
- no source-generation leakage.

Synthetic fixtures alone do not satisfy L3.

### L4
Prospective/OOS evidence:
- frozen model/calibrator produces real probabilities;
- calibration measured on independent matured dates;
- baseline comparison;
- after-cost decision utility;
- selective coverage/false acceptance;
- relevant Regime representation.

### L5
Robustness:
- multi-period/multi-Regime;
- calibration drift;
- cost/slippage;
- parameter/model uncertainty;
- redundancy/multiple-testing;
- no single episode/date/sector dominance;
- stable benefit versus simpler alternatives.

## 23. Current evidence status

As of 2026-10-03:
- governance architecture: owner-approved;
- role semantics: frozen;
- System1 C1/C2 full-population research infrastructure: implemented/activated, but latest scheduled 2026-10-03 collector failed to retrieve a genuine complete 2026-10-02 C1 generation and preserved a blocker artifact;
- System2 outcome tracker and replay infrastructure: substantial engineering exists, but broad genuine final-selection probability evidence is not yet mature;
- real calibrated D16-25 model: NONE;
- prospective probability predictions: NONE;
- D16-25 probability calibration evidence: NONE;
- sizing handoff evidence: NONE.

Therefore D16-25 cannot honestly be L3 yet.

## 24. Current D15-19 merge-decision status

Current conclusion:
`DEPENDENCY_CONFIRMED / RESPONSIBILITY_OVERLAP_PARTIAL / FULL_MERGE_NOT_YET_JUSTIFIED`.

Reason:
- D16-25 should own probability/distribution estimation, calibration, uncertainty and abstention;
- D15-19 owns a distinct downstream allocation objective: mapping edge to capital fraction under wealth/risk/portfolio constraints;
- D15-19 depends on D16-25 inputs but dependency alone does not make the modules duplicates.

A future merge becomes structurally reasonable only if the surviving D16-25/position-sizing owner explicitly absorbs:
- Kelly/log-growth theory;
- Fractional Kelly;
- estimation-error haircut;
- portfolio/correlation constraints;
- drawdown/ruin controls;
- comparison with fixed/risk-budget sizing.

Do not retire D15-19 before that anti-orphan mapping is complete.

## 25. Current decision

D16-25 recommended maturity after this research contract:
**L2 / 40%**, contingent on executable validation code/tests passing.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

No:
- System 1 Formal gate/rank change;
- System 2 final selection;
- probability threshold;
- sizing rule;
- Kelly sizing;
- capital allocation;
- monitoring/push/trading change

is authorized.

## Exact next continuation

1. Implement pure outcome-blind probability validation utilities:
   - matured-label filter;
   - Brier/log loss;
   - fixed-bin calibration table;
   - frozen-base-rate comparator;
   - selective/ABSTAIN coverage evaluation;
   - Beta-Binomial prior-update baseline.
2. Add adversarial tests:
   - immature outcome != loss;
   - duplicate prediction rejected;
   - mixed target/horizon rejected;
   - p=0/1 wrong prediction receives infinite log loss rather than silent clipping;
   - missing uncertainty cannot silently pass an uncertainty gate;
   - probability near 0.5 is not automatically labeled high uncertainty;
   - frozen reference base rate cannot be recomputed from holdout outcomes.
3. Merge only as Class-A research after CI.
4. Wait for a genuine complete C1 generation before L3.
5. Then freeze first actual probabilistic challenger target/model/calibration preregistration.
6. Only after real calibration evidence matures revisit D15-19 merge/retirement.


## 26. External methodology validation — 2026-10-03

D16-25 was cross-checked against established probabilistic-forecast and selective-decision literature.

### Proper scoring / honest probability
Gneiting & Raftery (2007), *Strictly Proper Scoring Rules, Prediction, and Estimation*, supports using strictly proper scores for probabilistic forecasts.

Research implication:
- use Brier / logarithmic loss or another proper score for probability quality;
- do not certify probability from rank spread or hit rate alone;
- calibration and discrimination/sharpness are distinct.

### Selective prediction / ABSTAIN
Geifman & El-Yaniv (2017) and SelectiveNet (2019) formalize selective prediction through risk-versus-coverage behavior.

Research implication:
- ABSTAIN is a legitimate action;
- accepted-subset quality is insufficient if coverage collapses;
- compare multiple pre-frozen operating policies as a risk/coverage profile;
- never search evaluation outcomes for the prettiest abstention threshold and call it OOS.

### Calibration under distribution shift
Park et al. (AISTATS 2020) and later calibration-under-shift literature show that calibration can degrade when deployment distribution differs from calibration data.

Research implication:
- overall calibration is insufficient;
- retain chronology and relevant Regime labels;
- report per-Regime diagnostics when sample support exists;
- drift/out-of-support widens uncertainty or causes ABSTAIN rather than silently reusing old calibration.

### ECE boundary
Chidambaram et al. (ICML 2024) analyzes discontinuities/pathologies in Expected Calibration Error.

Research implication:
- ECE remains secondary;
- exact proper scores + frozen reliability diagnostics remain primary;
- no promotion from ECE improvement alone.

### Kelly dependency
Kelly's log-growth objective assumes a specified probability/payoff environment. Estimation-risk research reinforces that Kelly sizing can be fragile when edge/payoff parameters are uncertain.

Research implication:
- D16-25 validates the probability/payoff input before D15-19 sizes it;
- parameter uncertainty is a sizing input;
- Fractional Kelly is not a calibration method.

These references validate the architecture but do not substitute for Taiwan-market PIT/OOS evidence.

## 27. Regime and selective-policy executable requirements

The evaluator must support:
- optional Regime label on each frozen prediction;
- per-Regime N, independent-date count, event rate, Brier score and log loss;
- no automatic pooling of Regimes to hide local miscalibration;
- multiple preregistered ABSTAIN policies evaluated side-by-side;
- no automatic best-policy selection from evaluation outcomes.

A policy-set report is descriptive OOS/Shadow evidence. Choosing a production operating point remains a later policy decision.

## 28. L2 closure and D15-19 merge relevance

D16-25 L2 means the module now has:
- target/base-rate/prior semantics;
- calibration/discrimination separation;
- uncertainty channels;
- UNKNOWN/IMMATURE fail-closed semantics;
- ABSTAIN risk/coverage semantics;
- Bayesian double-counting guards;
- payoff/utility semantics;
- sizing handoff firewall;
- executable evaluator + adversarial tests.

L3 still requires a genuine immutable Taiwan intended population, decision-time frozen predictions, causally matured outcomes and replay without source-generation leakage.

For D15-19:
- D16-25 owns belief quality, probability/distribution calibration, uncertainty and abstention;
- D15-19 owns capital-fraction optimization from validated beliefs/payoff distributions.

Therefore dependency is confirmed, but immediate full merge is not justified by D16-25 alone. D15-19 specialist research is still required before retirement/absorption can be decided.

FORMAL_OPTIMIZATION_CANDIDATE remains NONE.


## 29. Date-balanced calibration / pseudo-replication firewall

Row-weighted probability scores and date-balanced evidence answer different questions.

Row-weighted Brier/log loss:
- estimates average forecast quality per prediction/decision row;
- is appropriate when each row is a genuine deployment decision;
- can be dominated by a single scan date containing many rows.

Date-balanced Brier/log loss:
- first averages the score within each independent scan date;
- then gives each date equal weight;
- is a robustness diagnostic against pseudo-replication / one-large-cross-section dominance.

Neither replaces the other.

Required reporting when multiple rows can share a scan date:
- row-weighted Brier/log loss;
- independentScanDateCount;
- per-date N / Brier / log loss;
- date-balanced Brier/log loss;
- calibration-in-the-large gap = mean predicted probability - empirical event rate.

Interpretation:
- a large disagreement between row-weighted and date-balanced scores is a warning that evidence is concentrated in a small number of large scan dates;
- date-balanced evidence still does not create independence when adjacent dates share overlapping D+N outcomes or one persistent Regime episode;
- D16/D18 purging / episode robustness remains separately required.

The executable evaluator now implements these diagnostics and adversarial tests.

## 30. External-methodology counterevidence retained

### Proper scoring rules
Gneiting & Raftery and related forecast-evaluation literature support using strictly proper scores for probability forecasts.

Research implication:
- hit rate / return spread alone cannot validate probability;
- Brier and log loss remain primary binary calibration-quality scores;
- proper scoring evaluates belief quality, not capital sizing.

### Selective prediction / reject option
Selective-classification research treats rejection/abstention as a risk-versus-coverage trade-off.

Research implication:
- ABSTAIN can improve accepted-subset quality only by sacrificing coverage;
- accepted accuracy/value without coverage/opportunity-capture reporting is incomplete;
- multiple operating points may be evaluated, but outcome-based best-threshold selection remains forbidden.

### Calibration under covariate shift
Calibration-under-shift research shows deployment confidence can become misleading when the input distribution changes.

Research implication:
- one historical/global calibration certificate is insufficient;
- chronology / Regime / support shift must remain visible;
- out-of-support evidence widens uncertainty or triggers ABSTAIN rather than silently reusing an old calibration.

### Kelly under parameter uncertainty
Bayesian Kelly literature shows allocation under unknown model parameters depends on posterior belief/state rather than a single fixed known edge.

Research implication:
- D16-25 owns the quality/uncertainty of the predictive belief;
- D15-19 consumes that belief for a log-growth/capital-allocation problem;
- Fractional Kelly is a downstream risk-scaling choice, not a substitute for calibration.

These methodological anchors strengthen the separation between predictive validation and portfolio allocation rather than proving that the two curriculum modules are duplicates.

## 31. D16-25 specialist completion status for D15-19 comparison

D16-25 is now considered **specialist-complete at L2** for curriculum merge comparison.

This means the following are no longer open conceptual questions on the D16 side:
- target/horizon/action-conditioning identity;
- PIT/label maturity;
- base-rate/prior construction;
- Bayesian double-counting guard;
- probability calibration versus discrimination;
- proper scoring / reliability;
- uncertainty channels;
- distribution/Regime shift;
- ABSTAIN / selective decision risk-coverage semantics;
- after-cost expected utility;
- calibration-population / selection-bias firewall;
- date-clustering robustness;
- canonical PredictiveDecisionReceipt handoff;
- strict sizing firewall;
- D16 versus D15 responsibility boundary.

Remaining blockers are **empirical maturity**, not missing D16-25 conceptual ownership:
- genuine complete Taiwan PIT prediction population;
- frozen real probability predictions;
- matured outcomes;
- real OOS/prospective calibration;
- after-cost utility/coverage evidence.

These blockers prevent L3/L4 promotion.
They do NOT prevent D15-19 from now performing its own specialist research for the curriculum merge/retirement decision.

Current merge-side conclusion remains:
`D16_SIDE_READY / D15_SPECIALIST_RESEARCH_REQUIRED / DIRECT_FULL_MERGE_NOT_YET_JUSTIFIED`.

FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
