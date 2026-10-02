# Probabilistic Selection Governance V0.1

Updated: 2026-10-03 00:58 Asia/Taipei
Status: OWNER_APPROVED_RESEARCH_GOVERNANCE / SHADOW_FIRST / FORMAL_CORE_LOCKED
Scope: Cross-system decision architecture for System 1 and System 2
Formal Core impact: NONE

## Purpose

Prevent the growing stock-market knowledge curriculum from turning into an ever-longer serial AND-gate funnel. More knowledge must improve discrimination, calibration and risk understanding; it must not automatically mean more mandatory filters.

This governance implements D16-25 `Probabilistic Decision／Bayesian Updating／Uncertainty-aware Selection` as a research architecture. It does not authorize any production ranking, threshold, allocation or trading-rule change.

## Five decision roles

Every candidate feature, research result or domain input proposed for selection must be assigned exactly one primary decision role before system use.

1. **HARD_INVALIDATION（硬否決）**
   - Reserved for conditions where trading would be unsafe, non-reproducible or outside explicit risk authority.
   - Examples: untrusted/stale source, PIT failure, impossible or materially non-executable order, unresolved corporate-action continuity break, structurally undefined stop/risk, account/risk-limit breach, prohibited instrument state.
   - The burden of proof for creating a new hard gate is HIGH. "Useful predictor" is not enough.

2. **PRIMARY_ALPHA（主要 Alpha）**
   - Evidence with independently validated predictive or economic value for a specific strategy and horizon.
   - Requires PIT, replayability, OOS/prospective Shadow, redundancy control, costs, multi-regime review and calibrated uncertainty.
   - It may materially affect ranking/probability, but is not automatically a hard gate.

3. **SUPPORTIVE（輔助證據）**
   - Evidence that can raise or lower confidence after a valid thesis exists.
   - Failure/absence normally adjusts score, posterior probability or uncertainty; it does not reject the symbol by itself.

4. **CONTEXT_ONLY（情境資訊）**
   - Market, macro, industry or Regime context that primarily changes strategy prior, sizing, expected distribution or interpretation.
   - It must not be silently converted into stock-level pass/fail unless separately validated for that exact strategy.

5. **CONFIDENCE／UNCERTAINTY（可信度／不確定性）**
   - Describes evidence quality, missingness, freshness, model uncertainty and disagreement.
   - UNKNOWN != FAIL and UNKNOWN != 0.
   - Missing supportive/context evidence should normally widen uncertainty or reduce confidence rather than mechanically reject the stock.

## Decision objective

Do not optimize for number of picks or for raw hit rate alone.

Primary research objective:
**Opportunity Capture Efficiency（有效機會捕捉效率） under bounded risk**

A candidate architecture must jointly report:
- after-cost expected/realized return,
- opportunity capture and missed-opportunity rate,
- zero-pick rate separated from source/UNKNOWN failure,
- false acceptance / stop-first frequency,
- MFE/MAE,
- drawdown and tail risk,
- capital utilization,
- turnover and execution feasibility,
- probability calibration / Brier or equivalent calibration diagnostics where applicable,
- uncertainty and abstention behavior by Regime.

Higher pick count is not evidence of improvement. Lower pick count is not evidence of quality.

## Probability / expected-value research contract

Research may estimate a target such as:
`P(target reached before stop | evidence available at decision time)`

Then evaluate expected decision value using outcome magnitude, costs and risk rather than probability alone.

A simplified research representation may be:
`EV = P(win)*AvgWin - P(loss)*AvgLoss - TradingCost`

More complete portfolio use must also account for uncertainty, concentration, tail risk and portfolio interaction.

No probability may be used operationally unless calibrated on held-out/prospective data. A model output of 70% is meaningless if outcomes occur near 50%.

## Bayesian updating guardrails

Bayesian Updating（貝氏更新） is a candidate mechanism for combining prior/base-rate information with new evidence. It is not a license to invent subjective probabilities.

Required:
- define target outcome and horizon before measurement,
- define base-rate cohort using PIT-safe membership,
- avoid correlated evidence double counting,
- preserve missing/UNKNOWN separately,
- compare Bayesian/probabilistic method against simple baselines,
- validate calibration and decision utility prospectively.

## System 1 policy

System 1 remains the conservative production benchmark.

- Existing Formal logic is unchanged.
- Build an isolated **System1 Probabilistic Challenger** only in Shadow/research.
- First research target is not "replace all gates"; it is to classify current gates into the five decision roles and identify gates that may be supportive/context rather than true hard invalidation.
- Any gate-removal or gate-to-score conversion must be tested one change at a time or with preregistered factorial/ablation design.
- Compare matched dates/universe/data with current Formal baseline.
- Formal replacement requires explicit owner approval after prospective evidence.

## System 2 policy

System 2 should not copy a universal all-domain AND-gate architecture.

For each strategy:
- define a small set of strategy-specific PRIMARY_ALPHA families,
- define only necessary HARD_INVALIDATION rules,
- treat correlated indicators as one evidence family where appropriate,
- use SUPPORTIVE and CONTEXT evidence without turning every domain into a mandatory vote,
- maintain CONFIDENCE/UNCERTAINTY separately,
- permit **ABSTAIN（不交易）** when expected value is insufficient or uncertainty is excessive.

The 22 domains / 366 modules are a knowledge universe, not 366 required conditions and not 366 independent votes.

## Promotion gate

No probabilistic or Bayesian selection design may enter Formal Core until it demonstrates, on independent prospective evidence:
1. improved after-cost decision value or opportunity capture,
2. no unacceptable degradation in drawdown/tail risk,
3. calibrated probabilities or uncertainty,
4. controlled false acceptance,
5. explicit transaction-cost/fill feasibility,
6. stability across relevant Regimes,
7. no hidden look-ahead/PIT violation,
8. incremental value versus simpler ranking/scoring methods,
9. explicit rollback plan,
10. owner approval.

## Explicit anti-overfiltering rule

A new research module does **not** create a new selection gate by default.

Default role for newly learned evidence is **RESEARCH_ONLY** until role classification and validation are complete.

Creating a new HARD_INVALIDATION rule requires stronger evidence than creating a SUPPORTIVE or CONTEXT feature, because a hard gate destroys candidate coverage and can compound multiplicatively with existing filters.

## Current decision

Owner approved:
- D07-33 Intangible Capital／R&D／Innovation Accounting
- D08-19 Reverse DCF／Market-Implied Expectations／Expectations Gap
- D16-25 Probabilistic Decision／Bayesian Updating／Uncertainty-aware Selection

All start at L0. No production behavior change is authorized by this document.
