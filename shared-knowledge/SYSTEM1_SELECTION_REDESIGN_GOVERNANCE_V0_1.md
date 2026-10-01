# System 1 Selection Redesign Governance Proposal V0.1
Updated: 2026-10-01 Asia/Taipei
Owner: 00｜研究總控室（governance and routing only）
Status: GOVERNANCE_PROPOSAL / SHADOW_CHALLENGER_REQUEST / NO_PRODUCTION_AUTHORITY
Formal Core: LOCKED

## Purpose
Test whether System 1's restrictive common gates and wait-only entry lifecycle suppress economically valuable opportunities and capital utilization, while preserving its production-grade source, execution and risk safeguards. Do not equate a higher pick count with better decisions. The independent System 2 program remains separate; this proposal is not an attempt to clone it or import its unvalidated factor catalog.

## Verified starting points from current main (2026-10-01)
- Worker.js selectTomorrowCandidates() filters/ranks FORMAL_GENERAL and FORMAL_THOUSAND with separate maximum 3 names each; third HYBRID_THOUSAND_SHADOW is observation only and is not formal buy authority.
- scoreCandidate() is sequential fail-fast: 60-day history, authentic market/peer RS, cap/liquidity/holding-concentration and complete financial/valuation/announcements fields; common sector breadth >= 40%, sector mean return >= -1%, amount/20d >= 0.5; A pullback or B post-breakout; basic quality, ATR, verified resistance target, RR >= 2 and grade >= B.
- RR-first final sorting: rewardPerRisk, then priorityScore, setupQuality, sectorFlow and relativeStrength.
- Planned deployment is selected-count dependent: 0 -> 0%, 1 -> 35%, 2 -> 60%, 3+ -> 85%, capped 35% per name. First/second tranches are 60/40 with actual BUY/ADD conditions.
- Pre-existing research in RESEARCH_WORKLIST.md demonstrates first-failure-count attribution bias and top-6-per-pool rejection sampling bias; the low-liquidity rejected population is not yet cleanly captured. The sector-gate rejected cohort is bounded and cannot establish full Formal counterfactuals.
- Plan-time cash attribution has production PIT evidence, but actual broker cash, fills, realized execution edge and economic superiority remain UNKNOWN.
- Prior valid zero-pick dates must be separated from failed market-data, scan-recovery or UNKNOWN dates. 2026-09-22 and 09-23 are documented completed zero-pick dates; subsequent conclusions require date-specific current production readback.

## Diagnosis: separate five different causes
1. RESEARCH_DATA_BLOCKED: genuinely unavailable/stale/ambiguous source. Repair sources; never relax UNKNOWN into zero or pass.
2. STRATEGY_ADMISSION_BLOCKED: economically optional factors hard-gate all strategies, especially short-horizon setups.
3. SETUP_NOT_READY: a defensible thesis exists, but the exact next-day A/B setup is not present.
4. ENTRY_WAIT/NO_FILL: selected plan exists but intraday valid trigger/fill never occurs, or opportunity runs away before retest.
5. SIZING_RESERVE: valid selections/fills exist but selected-count 35/60/85 deployment, max-35% per name, tranches or quantization leave reserve.
Report each separately; reject any dashboard metric that combines them into one "cash idle" category.

## Research-only Challenger architecture

### C0 immutable production baseline
Record unchanged existing A/B, current numeric gates/weights/quotas, selected and zero-pick date receipts, wait/BUY/ADD transitions, plan-vs-actual exposure, and no-selection reasons. Never change production observations or rerun old code on revised data as if PIT original.

### C1 full gate-overlap observer before tuning
For each eligible symbol/session calculate every gate independently as PASS/FAIL/UNKNOWN, firstFailureReason separately, and exact first-known receipt. Preserve full exclusion denominators by symbol/date/price pool plus stratified reason-specific reproducible samples (not current alphabetic top-6 truncation). Establish overlap and counterfactual admission only with each alternative's complete independent rule evaluation, not firstFailureCount subtraction. Keep source gaps and true market closures apart.

### C2 strategy-specific eligibility without unsafe all-gates loosening
Keep hard for every challenger: source authenticity/PIT/session/corporate-action continuity, minimum positive tradability and execution-feasibility evidence, severe corporate-event risk, coherent structural stop, account/risk limits, and non-fabricated market/sector data. Preserve the production baseline price >= NT$10 and its original liquidity gate for the first experiment.
- Short-horizon pullback/breakout Shadow: make earnings/valuation and slow-release ownership variables REQUIRED only where the specific short thesis truly needs them; otherwise label available values SUPPORTIVE or CONTEXT_ONLY. Missing supporting values stay UNKNOWN, NEVER 0/neutral. Do not send source-incomplete names to real trading.
- Swing/high-conviction Shadow: retain stronger fundamental, industry, ownership/flow and valuation floors, with actual PIT evidence.
- Retain A pullback and B post-breakout as separate baseline comparators; no stealth redefinition of Formal A/B. Candidate-only optional early-continuation / second-leg sub-study may be separately registered after C1.

### C3 separate candidate discovery from executable entry
DISCOVERED -> THESIS_VALID -> WATCH_EARLY -> ENTRY_READY -> VIRTUAL_TRIGGER -> SIM_FILL -> HOLD/EXIT.
Preserve WATCH even when valid thesis has not formed a next-day A/B exact setup, but do not call it selected or BUY. WATCH retention requires bounded expiry and daily thesis revalidation, not unlimited stale watch.
Test two pre-registered entry challengers:
A: existing pullback waiting vs pre-declared alternative confirmation after a valid support-zone revisit.
B: existing breakout-then-retest waiting vs a controlled no-retest continuation if completed-bar price-volume acceptance, maxChase, structural risk and RR all still hold; gap/limit-up/poor depth and late-stage acceleration are hard invalidation. Do not assume the controlled alternative is better; evaluate missed winners and additional false breakouts on the same prospective dates.
Retain explicit transaction costs, fill feasibility, no-fill and failed-gate reasons.

### C4 rank and capital allocation are separate experiments
After holding identical eligible names, compare existing RR-first ordering against risk-aware readiness / quality ordering or Pareto selection on a frozen contract; do not inject additional 18-domain votes or rank on future outcomes.
On identical selected names and price/stop snapshots compare present score-proportional allocation to equal-capital and quantized risk-aware alternatives, while keeping current total budget, max-35% cap, round-lot/odd-lot math and 60/40 FIRST/ADD safeguards. Track capital reserve causes. Higher utilization is valuable only if after-cost return, max drawdown, stop-risk concentration and tail-risk constraints are acceptable. A one-name 35% cap cannot justify forced deployment into an unvalidated name.

### C5 independent anti-overfiltering cross-check
Study breadth/sector state as a regime-dependent variable rather than always replacing a sector-level hard FAIL with a stock-level PASS. A leader/relative-strength exception is a Shadow challenger only after proving independent sector/leader definitions and no look-ahead. Fix the currently known sampling/PIT defects before any claim about sector-gate removal.
Do not modify the third hybrid pool or cross-pool quotas in initial tests; isolate admission, timing, ranking and sizing effects.

## Pre-registered evaluation
Same completed Taiwan trade dates, same price universe and price pools, same source availability, identical benchmark/cost/fill simulator and immutable decision-clock snapshots. Count all zero-pick and failed-source days with different labels; report opportunity coverage and reasons for exclusion.
Primary: after-cost portfolio return per calendar day at fixed budget with marked cash; drawdown/tail risk; realized or explicitly simulated capital deployment; selection-to-trigger-to-fill funnel.
Secondary: candidate count/coverage, valid BUY trigger incidence, opportunity cost of no-retest winners, false acceptance, MFE/MAE, stop-first, turnover, concentration, strategy and regime attribution.
Required controls: independent date groups, prospective Shadow/OOS, purged holdout, market/industry/volatility regimes, source-coverage floor, bootstrap/date-cluster intervals, multiple testing, comparison with present System1 and simple passive/cash controls.
Guardrails: NEVER use selected-only evaluation or post-hoc recasting of historical WATCH; no cherry-picked leaderboard; absent data is UNKNOWN and modeled fills are never ACTUAL; never claim that extra picks automatically improve return.

## Research routing / implementation boundaries
00｜研究總控室: owns this roadmap, approval/ownership matrix, progress audit only; does not implement specialist research or System1 production code.
01 / 02 / 03 / 07 / 10 / 11: own dedicated price-structure, price-volume, trend, sector, allocation and validation evidence in their own checkpoints; avoid duplicate new research from room 00.
System 1 engineering room: after reading latest main and RESEARCH_ENGINEERING_GOVERNANCE.md, prepare separate isolated read-only Class-A observers/challenger where physical source separation is proven; any shared runtime/schema change requires Class-B proposal-first. Write exact test, regression, rollback and provenance receipts. Do not change Formal A/B, RR, pool quotas, entry/ADD/REDUCE/SELL, push or allocation in this proposal.
Owner decisions: authorize formal changes only after evidence-ready Class-C packet states exact changed lines/behavior, positive and negative prospective/OOS evidence, costs/fill quality, risks, rollback and matched baseline.

## Current decision
AUTHORIZE GOVERNANCE DESIGN ONLY. No claim that Challenger code or PIT/OOS results exist; no Formal deployment or operational behavior change; no maturity upgrade.
Exact next engineering continuation: inventory currently available full-population gate/entry/fill receipts and pre-existing Shadow observer ownership; implement missing C1 denominator/overlap observers in isolated Class A if possible; present source/shared-schema Class B request only if needed; then preregister C2/C3 contrasts before the next observation window.
