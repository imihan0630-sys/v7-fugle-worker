# D15-19｜Kelly / Fractional Kelly Research Contract V0.1

Updated: 2026-10-03 Asia/Taipei
Status: MECHANISM_FALSIFICATION_CONTRACT_FROZEN / TAIWAN_PIT_EVIDENCE_PENDING
Formal Core impact: NONE
Owner room: 10｜投組風控與交易執行研究室
Dependency: D16-25 probabilistic decision / calibration / uncertainty

## 1. Research question

D15-19 studies whether Kelly-style log-growth sizing, especially Fractional Kelly, can add robust capital-allocation value over the current fixed-capital / PriorityScore allocation and simpler risk-budget baselines.

It does NOT assume Kelly is superior and does NOT authorize any change to Formal sizing, PriorityScore, Top6/3+3, capital cap, BUY/ADD/REDUCE/RE-ADD, monitoring, signals or pushes.

## 2. Ownership boundary with D16-25

D16-25 owns:
- target definition;
- prior / posterior probability semantics;
- probability calibration;
- uncertainty representation;
- ABSTAIN semantics;
- decision-utility validation.

D15-19 owns:
- transformation of valid predictive distributions into growth-oriented position size;
- Full Kelly vs Fractional Kelly;
- portfolio Kelly under simultaneous positions;
- capital / risk constraints;
- comparison with fixed sizing and risk-budget baselines;
- realized growth, drawdown and survival consequences.

D15-19 MUST NOT manufacture a probability edge from uncalibrated PriorityScore or raw model score.

## 3. K1-K8 validation contract

### K1 — Objective semantics
Primary theoretical objective is expected log wealth growth, not hit rate, raw expected return, Sharpe, or terminal wealth alone.
Any production comparison must separately report growth, drawdown, tail loss, turnover, coverage and survival.

### K2 — Probability / distribution eligibility
Kelly input must come from a PIT-valid probability or return distribution with explicit calibration provenance.
Raw PriorityScore, rank, technical score, confidence label or analyst conviction is NOT a win probability.

If D16-25 eligibility is not met:
KELLY_INPUT_STATUS = INELIGIBLE / UNKNOWN.

### K3 — Payoff geometry
Binary textbook Kelly requires identifiable win probability and win/loss payoff ratio.
For real equity positions with continuous, path-dependent outcomes, use a scenario/return-distribution log-growth formulation rather than forcing arbitrary binary wins/losses.

Stops, gaps, limit moves, partial exits and time exits make payoff path-dependent and must be represented or explicitly approximated.

### K4 — Estimation error / shrinkage
Full Kelly is a theoretical comparator, not the default candidate.
Parameter uncertainty can materially over-size positions. Fractional Kelly or uncertainty-aware shrinkage must be evaluated against Full Kelly.

Fractions such as 1/2 or 1/4 are challengers, not universal constants.
Fraction selection must be preregistered or tuned only inside training data and evaluated OOS / Prospective Shadow.

### K5 — Portfolio dependence
Independent single-name Kelly fractions cannot simply be added when positions are correlated.
Portfolio Kelly must consider joint return distribution / covariance / tail dependence where data permits.
If dependence evidence is unavailable, portfolio-level Kelly optimality remains UNKNOWN.

### K6 — Constraints and survival
Any candidate must respect frozen portfolio constraints in research simulation:
- capital budget;
- no implicit leverage unless separately authorized;
- per-name cap;
- lot / share feasibility;
- liquidity;
- stop-risk geometry;
- concentration;
- cash reserve;
- drawdown / survival constraints.

A mathematically optimal unconstrained Kelly solution that violates implementable constraints is not an eligible comparator.

### K7 — Costs and execution
Sizing comparison must include, when evidence exists:
- commission;
- transaction tax;
- slippage;
- partial fill;
- orderability;
- turnover;
- opportunity cost from unfilled or abstained capital.

UNKNOWN costs cannot become zero.

### K8 — Common-support comparator and promotion gate
Compare on identical PIT-eligible opportunities:
A. current/frozen sizing baseline;
B. equal-capital;
C. risk-budget / equal planned-stop-risk baseline where feasible;
D. Full Kelly theoretical comparator;
E. preregistered Fractional Kelly variants;
F. uncertainty-aware Kelly challenger if D16-25 provides eligible uncertainty output.

Required outcomes:
- CAGR / geometric growth proxy;
- expected log-growth and realized log-growth;
- maximum drawdown;
- tail loss / Expected Shortfall where valid;
- ruin / near-ruin or capital-floor breach rate;
- turnover and all-in cost;
- concentration / portfolio heat;
- coverage / ABSTAIN / zero-pick;
- calibration-conditioned performance;
- date and Regime robustness.

No candidate is promoted from in-sample superiority alone.

## 4. Positive mechanism

If predictive probabilities / return distributions are genuinely calibrated and stable, log-growth sizing provides a coherent link between estimated edge, payoff distribution and capital at risk. Fractional Kelly can reduce sensitivity to estimation error and lower drawdown relative to Full Kelly while retaining part of the long-run growth objective.

## 5. Falsification and competing explanations

F1. Higher backtest CAGR does not prove Kelly value if the Kelly challenger used future outcomes, post-hoc probability calibration or a different opportunity set.

F2. Full Kelly can look superior in a correctly specified simulator yet fail OOS because expected return / win probability estimation error is amplified into size.

F3. A fixed 1/2-Kelly or 1/4-Kelly fraction is not intrinsically optimal. Apparent superiority can be parameter snooping.

F4. Kelly sizing may merely re-express existing PriorityScore / stop-distance / volatility information. Incremental value must survive redundancy controls.

F5. Higher geometric growth can coexist with unacceptable drawdown, liquidity, concentration or implementation risk. Growth optimality is not identical to owner utility or risk mandate.

F6. Binary win/loss Kelly can be badly misspecified for path-dependent stock trades. Continuous-distribution / scenario log-growth is the preferred research representation when feasible.

F7. Single-name sizing gains can disappear at portfolio level because simultaneous positions share sector/factor/tail dependence.

F8. Ignoring transaction costs and share/lot quantization can create phantom sizing improvements.

## 6. PIT / anti-overfit firewall

Required:
- firstKnownAt / predictionAt / decisionAt;
- frozen opportunity universe;
- frozen target horizon / exit policy;
- calibrated probability/distribution produced without future labels;
- purged / embargoed split where overlapping outcomes exist;
- date-balanced diagnostics;
- multiple-testing accounting for Kelly fractions / constraints;
- common-support comparisons;
- independent dates and multiple Regimes;
- prospective Shadow before any Formal proposal.

Historical labels may evaluate a frozen historical prediction but may not retroactively change that prediction.

## 7. Current evidence state

D16-25 is L2 and has a conceptual/executable probability-validation contract, but genuine complete Taiwan PIT prediction/outcome/calibration receipts are not yet sufficient for L3.

Therefore D15-19 can complete theory/mechanism/falsification now, but cannot claim Taiwan PIT feasibility of Kelly sizing from calibrated edge.

Current Formal PriorityScore is NOT treated as a calibrated probability or expected-return estimate.

## 8. Maturity decision

D15-19 may advance from L0 to L2 because:
- objective semantics are defined;
- D16-25 ownership boundary is explicit;
- K1-K8 mechanism / falsification contract is frozen;
- baseline and challenger set is defined;
- PIT / cost / dependence / survival firewalls are defined.

D15-19 MUST remain below L3 until real Taiwan PIT-eligible probability/distribution inputs and common-support sizing replay exist.

## 9. Exact next continuation

1. Build a research-only Kelly eligibility validator that consumes D16-25 receipts and fails closed when calibration / PIT provenance is missing.
2. Freeze continuous-return/scenario log-growth sizing semantics; retain textbook binary Kelly only as a sanity-check comparator.
3. On the first genuine complete Taiwan PIT generation, run A-F common-support sizing replay.
4. Compare Full Kelly, preregistered Fractional Kelly, current sizing, equal capital and risk-budget baselines.
5. Stratify by date / Regime / liquidity / concentration and include cost / share quantization sensitivity.
6. No L3 until Taiwan PIT feasibility is demonstrated; no FORMAL_OPTIMIZATION_CANDIDATE until OOS / Prospective Shadow plus robustness/cost/redundancy gates pass.
