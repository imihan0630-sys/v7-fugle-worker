# D16 + D18 Statistical Validation / Regime × Strategy Checkpoint

Updated: 2026-09-28 Asia/Taipei
Status: ACTIVE_RESEARCH / FORMAL_CORE_LOCKED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Scope
This checkpoint owns D16 statistical validation and D18 regime × strategy interaction. It does not duplicate domain-specific factor research.

## 2026-09-28 synthesis — validation architecture frozen

### 1. Regime is an as-of covariate, not an ex-post story
A regime label is admissible only when every input has marketDate / observedAt / availableAt / source / PIT eligibility and the label can be replayed from information available at the decision clock. Historical labels reconstructed with later classification, revised data, future transition knowledge, or current industry membership are not OOS evidence.

### 2. Regime × strategy needs two separate estimands
- Attribution estimand: how a frozen strategy performed conditional on a PIT-safe regime.
- Policy estimand: whether changing activation/weight because of that regime improves outcomes after costs versus the same frozen strategy without switching.
Good attribution does not imply a useful switching policy.

### 3. Switching policy must pay a hysteresis tax
Any activation/deactivation or dynamic weighting rule must measure transition delay, false transitions, churn/whipsaw, opportunity cost, turnover/slippage and UNKNOWN coverage. A regime rule that looks better only because it uses same-day final state before the strategy decision is look-ahead contaminated.

### 4. Walk-forward protocol frozen before outcomes
For any D18 strategy-policy hypothesis:
1. Freeze regime taxonomy and input contract.
2. Freeze decision clock and strategy version.
3. Train/calibrate only on prior eligible dates.
4. Purge training dates whose D+N outcome overlaps the next holdout boundary.
5. Test the next untouched block; no threshold retuning inside holdout.
6. Roll forward and repeat.
7. Aggregate by independent scan date, not stock rows.
8. Report UNKNOWN/coverage and regime occupancy.
9. Compare static strategy vs regime-conditioned policy after identical costs.
10. Run leave-one-date / leave-one-regime sensitivity where sample size permits.

### 5. Minimum falsification matrix
Every claimed interaction must survive:
- static-strategy baseline;
- same strategy with shuffled/permuted regime labels within PIT-safe blocks as a negative control;
- date-cluster sensitivity;
- transaction-cost/slippage stress;
- regime prevalence/coverage check;
- factor redundancy check against trend, volatility, breadth, sector RS and stock-level signals;
- transition-only exclusion sensitivity;
- no single regime/year/sector/date may dominate the conclusion.

Permutation is a research negative control, not a source of synthetic market history; temporal dependence must be preserved by block/date permutation rather than arbitrary stock-row shuffling.

### 6. Current data limitations
System 2 Market Regime V0 already freezes useful PIT semantics for trend, participation, liquidity, concentration, sector observation, institutions and volatility, but large-cap vs small-cap leadership remains UNKNOWN until a PIT-safe size-bucket contract exists; global/macro remains UNKNOWN until durable receipt contracts exist. Therefore D18-06 and parts of D18-07 cannot advance to L2/L3 from inference alone.

R06 transition research also has a session-continuity constraint: adjacent observed research dates are not necessarily adjacent official trading sessions. GAP_UNKNOWN must remain UNKNOWN; missing dates cannot be silently bridged.

### 7. Shadow cohort warning
Current bounded/reason-ordered rejected cohorts and first-failure semantics can bias counterfactual estimates. Regime interaction studies must not treat bounded Shadow membership as a representative rejected universe. D16-13 remains evidence-infrastructure constrained until membership/population semantics are prospectively repaired.

## Module conclusions this round

### D18-08 Strategy activation/deactivation rules
Mechanism and falsification are now defined: activation rules are policy hypotheses, not descriptive regime labels. They require PIT-safe state, frozen decision clock, static baseline, hysteresis/transition-cost accounting, and walk-forward OOS. Status can advance conceptually from L1 to L2; no strategy activation is approved.

### D18-09 Dynamic strategy weighting
Dynamic weights are a stronger policy intervention than on/off gating and add degrees of freedom. First admissible test should use a tiny preregistered weight set or monotone mapping, not continuous optimizer tuning. Compare against equal/static weights and charge turnover. Conceptual L2 only; alpha UNKNOWN.

### D18-10 Multi-strategy correlation / Ensemble
Correlation must be measured on same-date strategy returns with missing-strategy days explicit; row-pooled stock correlation is not portfolio diversification evidence. Regime-conditioned correlation is secondary and requires enough independent dates per regime. Conceptual L2 only.

### D18-12 Drawdown-aware de-risking
A drawdown rule may reduce tail loss but is path-dependent and can mechanically buy low exposure after losses and miss recovery. Test against fixed-risk baseline with the drawdown state known before the next decision; include recovery opportunity cost and churn. Conceptual L2 only.

### D18-13 Regime performance attribution
Freeze strategy version and regime label before outcome; report both unconditional and conditional performance, regime occupancy, independent dates and uncertainty. Attribution alone cannot justify switching. Conceptual L2 only.

### D18-14 Walk-forward regime validation
Protocol above supplies mechanism + falsification + PIT/replay contract. Conceptual L2 only; L3 requires actual Taiwan PIT data feasibility for the full tested inputs and L4 requires prospective/OOS evidence.

## Overfitting controls added
- Every new regime threshold, transition persistence length, weighting map, cost assumption used for selection, or label taxonomy variant is a new experiment/version.
- Do not choose regimes because they maximize historical strategy spread.
- Prefer coarse interpretable states until evidence proves incremental value.
- Nested tuning is required if any hyperparameter selection is introduced; outer holdout stays untouched.
- Multiple strategies × regimes × horizons create a multiplicity family and must be registered together rather than cherry-picked.

## Optimization decision
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Reason: architecture/gates improved, but no mature prospective/OOS regime-policy evidence yet. No Formal Core or System 2 strategy weight/activation change is justified.


## 2026-09-28 deep falsification continuation — size/global/shadow contracts

### D18-06 PIT-safe large-cap vs small-cap leadership contract
A size-leadership state is admissible only if membership is frozen using information available at the regime decision clock. The preferred first contract is cross-sectional, date-relative and coarse rather than an outcome-tuned NT$ cutoff:
- universe = same frozen ordinary-share universe used for the market snapshot;
- size basis = PIT-safe market capitalization only;
- explicit market-cap source is preferred; sharesOutstanding × close is admissible only when sharesOutstanding has its own observedAt/availableAt/provenance and corporate-action denominator semantics;
- UNKNOWN source/vintage => UNKNOWN size membership, never imputed from current shares;
- freeze large/small buckets before observing subsequent strategy outcomes; preregister bucket construction and minimum eligible coverage;
- measure leadership using same-horizon aggregate/median returns of frozen buckets and keep liquidity/activity as separate covariates.

Critical falsification: existing market-cap-floor research shows size can proxy liquidity, limit-hit/limits-to-arbitrage and information quality. Therefore a raw large-minus-small return spread is not independent regime evidence. Any claimed strategy interaction must survive controls/matching for executable liquidity, price, volatility, limit state, information quality and sector composition. If the interaction disappears, D18-06 is redundant context rather than a strategy switch.

Do not infer size leadership from trade value, price level, index membership, or today's reconstructed market cap. Do not threshold-sweep bucket cutoffs after seeing outcomes.

Current status: CONTRACT_DEFINED / DATA_FEASIBILITY_PARTIAL. D18-06 remains below PIT-evidence promotion until a durable prospective market-cap vintage receipt exists with adequate coverage.

### D18-07 domestic risk state is not global risk-on/off
Freeze two distinct objects:
1. TAIWAN_DOMESTIC_RISK_CONTEXT: may use PIT-safe Taiwan trend, breadth/participation, liquidity/activity, concentration, institutions and realized volatility.
2. GLOBAL_TRANSMISSION_CONTEXT: remains UNKNOWN until durable receipts exist for each selected foreign index/FX/rate/commodity/macro input with source timestamp, observedAt, availableAt, Taiwan decision-clock alignment, holiday/session semantics and revision vintage where relevant.

A domestic weak tape must not be relabeled GLOBAL_RISK_OFF. Conversely, a US/global risk-off observation does not prove a Taiwan strategy gate unless the transmission adds OOS information beyond domestic trend/volatility/breadth and stock/sector factors.

Required negative controls:
- domestic-only baseline;
- global-only context;
- domestic + global incremental model;
- lagged global inputs aligned to what Taiwan knew at decision time;
- holiday/session mismatch exclusion;
- event-release revision/availability audit;
- identical cost treatment.

If global context adds no stable incremental OOS value, simplify/remove it rather than retaining narrative complexity.

Current status: SEMANTIC_SPLIT_FROZEN / GLOBAL_RECEIPTS_UNKNOWN.

### D16-13 Shadow population receipt for unbiased counterfactuals
A bounded or reason-ordered Shadow cohort cannot estimate the effect of regime gating unless inclusion probability/population semantics are known. Future counterfactual research needs a per-date population receipt frozen before outcomes:
- scanDate, strategyVersion, regimeVersion, universeVersion;
- eligiblePopulationCount and stable population hash/manifest reference;
- inclusion rule and cap;
- ordering key before truncation;
- sampled/included count;
- exclusion counts by reason;
- whether sampling is deterministic census, random sample, or top-K/reason-ordered;
- inclusion probability when probabilistic;
- UNKNOWN/missing-source counts;
- outcome horizon availability tracked separately.

For deterministic top-K/reason-ordered bounded cohorts, do not apply naive inverse-probability weighting: units with zero inclusion probability are unidentified. Such cohorts support descriptive audit of the captured subset, not universe-level counterfactual claims.

Preferred evidence hierarchy:
1. census of all otherwise-eligible research rows when storage/cost permits;
2. preregistered probability sample with recorded seed/version and non-zero inclusion probability;
3. stratified probability sample by date/regime/strategy when census is impractical;
4. bounded top-K/reason-ordered sample only for diagnostics, not causal/counterfactual estimation.

### New falsification: attribution-policy gap
Even a statistically significant conditional return difference can fail as a policy because:
- regime recognition is delayed;
- transition false positives create churn;
- strategy opportunity arrives before the regime label stabilizes;
- the regime variable duplicates trend/volatility/sector signals already inside the strategy;
- gating removes rare high-payoff recovery dates;
- extra turnover/slippage consumes the gross edge.

Therefore promotion requires net policy value versus the frozen static strategy, not merely conditional attribution significance.

### Multiplicity / overfit rule strengthened
The family of tested strategy × regime × horizon × transition-rule × weight-map combinations is one multiplicity family. A small p-value from one selected cell is not promotion evidence. First-line reporting should emphasize effect size, independent dates, uncertainty, stability and holdout performance; any multiplicity-adjusted significance is secondary to untouched OOS/forward evidence.

### Optimization decision
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Reason: contracts and falsification gates improved, but D18-06 lacks durable PIT size vintages, D18-07 lacks durable global receipts, and D16-13 lacks prospective population receipts. No regime gate/weight change is justified.


## 2026-09-28 long-form research continuation — regime policy validation layer

Detailed research note: `research/D16_D18_REGIME_POLICY_VALIDATION_V0_1.md`.

### Core research decisions
- Regime attribution and regime policy remain separate estimands. Conditional historical superiority is not policy evidence.
- First policy experiment must be a parallel-arm design: STATIC_BASELINE vs REGIME_POLICY_CHALLENGER on the same frozen source session, universe, strategy, candidates, execution assumptions, capital and costs.
- Preserve the static baseline counterfactual even when the challenger disables exposure; otherwise missed upside is unidentified.
- Add an exposure-matched non-regime negative control so risk reduction from simply investing less is not mislabeled regime timing skill.
- HMM / Markov-switching trading decisions may use filtered/current probabilities only. Smoothed probabilities are ex-post diagnostics because they condition on future sample observations.
- Prefer coarse observable PIT states as the first challenger. Latent-state models add extra degrees of freedom and belong later in the challenger family.
- The multiplicity family includes taxonomy, state count, thresholds, persistence/hysteresis, strategy-regime pairing, horizon, exposure/weight maps, model families and selection-time cost assumptions. Failed variants remain counted.
- White Reality Check / Hansen SPA / PBO-CSCV / DSR are supplementary search/selection diagnostics. They do not replace chronological untouched OOS and prospective Shadow.
- Dynamic weighting must benchmark against simple static/equal weights; estimation error is itself a falsification channel.
- Independent decision date / portfolio path remains the primary inference unit, not stock rows.

### D16-13 evidence revision
System 2 repository evidence now proves full-universe membership semantics are technically feasible:
- daily Shadow orchestrator enumerates base, excluded and eligible symbols;
- every eligible symbol is accounted;
- incomplete eligible-universe accounting fails the run;
- tests verify COMPLETE vs INCOMPLETE behavior;
- storage tests preserve base/excluded/eligible/accounted counts and state counts.

Therefore D16-13 may advance from L2 to L3 (Taiwan PIT data feasibility validated at the contract/runtime-test level). It does NOT advance to L4 because scheduled prospective Shadow capture is still disabled.

This does not retroactively repair bounded/reason-ordered historical V8 Shadow cohorts.

### D18 maturity revision
Mechanism + falsification are now explicit for:
- D18-06 Large-cap vs Small-cap leadership;
- D18-07 Risk-on/Risk-off semantic split;
- D18-08 activation/deactivation;
- D18-09 dynamic weighting;
- D18-10 ensemble/correlation;
- D18-12 drawdown-aware de-risking;
- D18-13 regime attribution;
- D18-14 walk-forward regime validation.

These may advance conceptually to L2. No D18 module advances to L3 from this round because the required full PIT data feasibility is incomplete for size/global lanes and no actual Taiwan policy experiment has matured.

### External evidence synthesis
- White (2000): data snooping requires benchmark-relative inference accounting for the searched model family.
- Hansen (2005): SPA improves power and reduces sensitivity to irrelevant alternatives relative to the Reality Check.
- Harvey/Liu/Zhu (2016): ordinary significance thresholds are too weak under extensive factor search.
- Bailey/Borwein/López de Prado/Zhu: PBO/CSCV explicitly diagnoses selection-process backtest overfitting.
- Bailey/López de Prado: DSR addresses selection bias plus non-normality in Sharpe evidence.
- DeMiguel/Garlappi/Uppal: optimized weights can lose to simple 1/N OOS because estimation error consumes theoretical gains.
- Recent regime-switching research continues to identify false state changes, signal delay and transaction-cost escalation as central implementation failure modes.

### New hard falsification gate
A regime policy that lowers drawdown only because average exposure is lower is not timing alpha. It must beat an exposure-matched control with comparable invested fraction and cost accounting.

### Optimization decision
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
No System 1/System 2 Formal Core, rank, gate, weight, capital or execution rule change is justified yet.


## 2026-09-28 implementation audit continuation

New research artifacts:
- `research/D18_REGIME_POLICY_PARALLEL_ARM_RECEIPT_V0_1.md`
- `research/D18_OBSERVABLE_REGIME_LABEL_CONTRACT_V0_1.md`

### Key implementation finding
Current-main code search shows the planned System 2 regime state names/raw fields are specification-level in `SYSTEM2_MARKET_REGIME_V0.md`; an executable regime builder for the named trend/breadth/volatility/concentration states is not yet present.

Therefore:
- D18-01 remains L2, not L3.
- No historical System 2 regime stream may be inferred from the spec.
- This is a clean pre-outcome preregistration window.
- The observable proposal keeps trend, breadth, volatility, activity, concentration, institutions, size and global context as separate dimensions; it intentionally does not emit one composite RISK_ON/RISK_OFF score.
- HMM/latent-state models are challengers, not the baseline truth; filtered/current state only is admissible for decisions, while smoothed state is retrospective only.
- After-close regime state may affect only the next tradable session; same-session retroactive filtering is forbidden.
- Natural zero-pick, policy-disabled exposure and data-UNKNOWN are distinct states.

### Optimization decision
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
The evidence architecture advanced, but executable regime capture and prospective policy outcomes are still absent.


## 2026-09-28 long-form continuation — promotion gate + raw-feature readiness

New durable research artifacts:
- `research/D16_D18_PROMOTION_GATE_V0_1.md`
- `research/D18_REGIME_RAW_FEATURE_READINESS_V0_1.md`

### A. Regime evidence must count episodes, not only dates
Persistent market states create pseudo-replication. Eighty consecutive dates in one drawdown are not eighty independent regime demonstrations.

New mandatory reporting:
- official decision-date count;
- regime-episode count;
- episode lengths;
- transition count;
- state/action/exposure occupancy;
- UNKNOWN share;
- leave-one-episode-out contribution sensitivity.

A state observed in only one contiguous episode remains descriptive-only regardless of date count. Multiple episodes are necessary but still not sufficient.

### B. Fixed-N readiness is not promotion proof
Existing 15-date / 20-paired-date gates remain descriptive-readiness floors only.

Policy sample sufficiency must depend on:
- preregistered economically meaningful effect (MDE);
- date/episode variance;
- serial dependence;
- state occupancy/action frequency;
- costs;
- multiple-testing family size.

Repeated peeking is not allowed to create an early promotion. Promotion analyses occur at preregistered evidence checkpoints unless a sequentially valid method was frozen in advance.

### C. Policy classes separated
Do not pool:
- ENTRY_GATE_ONLY;
- ENTRY_SIZE_SCALE;
- ADD_READD_GATE;
- EXISTING_POSITION_DERISK;
- STRATEGY_WEIGHT_REALLOCATION.

Each intervention has different timing, execution cost and counterfactual. Changing policy class creates a new experiment version.

### D. After-close causality strengthened
An after-close regime snapshot affects no earlier than the next official tradable session.

For existing positions, de-risking must model next-session open/gap/limit feasibility. Close-price retroactive liquidation is forbidden.

### E. Dependence-aware inference
Daily policy differentials may be dependent from regime persistence, overlapping horizons, position carry and volatility clustering.

Naive iid inference is not primary.
Candidate tools:
- stationary / block bootstrap;
- HAC-style inference where assumptions fit.

Block length/bandwidth is documented and sensitivity-tested, never outcome-tuned.

### F. Multiple-testing literature retained with counterevidence
White (2000) and Hansen (2005) support benchmark-relative correction for model search.
Harvey/Liu/Zhu (2016) show conventional significance hurdles are problematic under extensive factor search.
Bailey et al. PBO/CSCV and DSR provide selection-overfit diagnostics.

Counterevidence is explicitly retained:
- later Andrew Chen research disputes the broad interpretation that most return-predictability findings are false and questions a universal raised t-stat hurdle;
- Harvey & Liu (2020) emphasize joint Type-I / Type-II error calibration.

Therefore D18 does NOT adopt a universal t > 3 promotion rule.
It uses experiment-family accounting + MDE + OOS/Shadow + dependence-aware uncertainty + error-cost asymmetry.

### G. Domestic Regime raw-feature readiness audit
Existing source contracts materially narrow the engineering gap.

Potential zero-new-network-call / existing-source lanes:
- A1 same-day breadth counts, median return, total/median trade value, top10/top20 trade-value concentration, return dispersion;
- A3 market institution aggregates when both market receipts are valid;
- B2 prospective industry context.

History-dependent but source-feasible:
- A2 TAIEX trend/MA/slope;
- A2 realized volatility;
- 20-day market activity history;
- history-based breadth participation.

Still PIT-blocked:
- D18-06 size leadership due market-cap/share-denominator vintage lineage;
- full D18-07 global transmission due incomplete canonical global source/decision-clock receipts.

### H. Main L2 -> L3 bottleneck identified
For domestic observable Regime, the bottleneck is now an executable **market-level feature builder**, not general source discovery.

L3 requires:
- tested builder;
- sourceSession/universe/version hashes;
- availableAt/PIT proof;
- coverage numerator/denominator;
- official-session continuity;
- history hash;
- UNKNOWN fail-closed behavior;
- deterministic replay.

A spec or endpoint alone is not L3.

### I. Regime policy promotion levels frozen
- L2: mechanism + falsification.
- L3: executable Taiwan PIT/replay feasibility.
- L4: paired prospective/OOS evidence with next-session timing, complete counterfactuals, multiple relevant episodes and identical costs.
- L5: multi-episode/period/state robustness, cost/slippage stress, redundancy, multiple-testing/search diagnostics and no single episode/year/sector dominance.

Only after L5 can a D18 result be considered for FORMAL_OPTIMIZATION_CANDIDATE review.

### Optimization decision
FORMAL_OPTIMIZATION_CANDIDATE: NONE.

Reason:
promotion governance and data-readiness understanding improved substantially, but the domestic market-level regime builder is not executable yet and there is no paired prospective Regime-policy evidence.


## 2026-09-30 continuation — Direction Breadth exchange semantics + universe endogeneity

Durable research:
- `research/D18_DIRECTION_BREADTH_SEMANTICS_V0_1.md`
- executable Class-A observer `research/d18_direction_breadth_semantics_v0_1.mjs`
- falsification test `tests/test_d18_direction_breadth_semantics_v0_1.mjs`
- PR #274 merged as `31f7c1819b9acf807f2942b63884733889ad814d`
- verified head `fd3d3e92dac08f6f77390b8876e621d3a600dab9`
- V8 Regression run `36645020491` PASS
- V8 Repair CI run `36645020534` PASS

### D18-04 critical semantic falsification: X is not flat
Official TWSE/TPEx quote semantics distinguish X / not-comparable from a true flat observation.

Repository audit found:
- A1 symbol snapshot preserves raw `sourceFields.change` but its generic numeric parser strips leading X, so raw `X0.00` may coexist with numeric `change=0`.
- B2 industry observer also strips leading X in its numeric helper and then classifies numeric zero as FLAT.

Therefore any Direction Breadth implementation that consumes only normalized numeric change can inflate flatCount and contaminate the breadth denominator.

The isolated D18 observer recovers the raw marker and freezes:
- X / explicit not-comparable => NOT_COMPARABLE;
- no usable close => UNKNOWN;
- missing/unparseable change => UNKNOWN;
- comparable positive/negative => UP/DOWN;
- true comparable zero => FLAT.

NOT_COMPARABLE and UNKNOWN are excluded from the UP/DOWN/FLAT denominator but are preserved as explicit diagnostic shares/reasons. Exclusion alone is not proof of unbiasedness.

### Informative-missingness extension
NOT_COMPARABLE / UNKNOWN may be state-dependent, including corporate-action-heavy, volatility, stress, liquidity or listing-age conditions.

Before any coverage threshold or Breadth policy:
- report notComparablePct / unknownPct;
- stratify them by observable Regime dimensions when PIT-safe;
- test whether complete-case breadth changes materially when high-missingness dates are removed;
- do not set an acceptable coverage percentage from outcomes.

### Market Breadth != Opportunity-Set Breadth
The repository now explicitly contains two different breadth estimands:

1. MARKET_DIRECTION_BREADTH
   - PIT-ready TWSE + TPEx ordinary-share market snapshot;
   - admissible as an external D18 market-state context.

2. OPPORTUNITY_SET_BREADTH
   - existing V8 research context `TWSE_TPEX_COMBINED_FORMAL_NORMALIZED`;
   - applies Formal price/instrument filters;
   - describes the strategy/formal opportunity set, not the whole market.

Using opportunity-set breadth to control the same strategy can create circular/endogenous logic:
Formal eligibility -> opportunity breadth -> Regime policy -> Formal opportunity.

D18 experiments must keep these universes separate. Opportunity-set breadth may be a control/diagnostic but cannot silently substitute for market-state breadth.

### D18-04 maturity interpretation
Direction Breadth now has executable/tested PIT semantic feasibility at the sublane level.

However the whole D18-04 module remains L2 because:
- true percentage-return distribution remains a separate continuity/coverage problem;
- prospective Direction Breadth occupancy / NOT_COMPARABLE / UNKNOWN coverage has not accumulated;
- no Breadth Regime threshold or policy has OOS/Shadow evidence.

Recommended status:
`DIRECTION_BREADTH_EXECUTABLE_PIT_SEMANTICS_VALIDATED / RETURN_DISTRIBUTION_AND_PROSPECTIVE_COVERAGE_PENDING`.

### B2 boundary
The B2 X->0->FLAT risk is recorded as a falsification finding. PR #274 does not modify shared B2 runtime and does not retroactively repair any B2 historical/prospective receipt.

Any shared B2 semantic correction must be separately classified under engineering governance, with protected-invariant regression evidence.

### Formal decision
FORMAL_OPTIMIZATION_CANDIDATE: NONE.

No breadth threshold, market label, strategy gate, score, capital, execution or notification behavior changed.


## 2026-09-30 continuation — first real Decision Clock artifact is not yet accepted evidence

Direct GitHub Actions audit found the first ordinary prospective schedule run:
- workflow: `System2 Prospective Clock Evidence Read-only`;
- run: `36526809162`;
- event: `schedule`;
- run_attempt: `1`;
- created: 2026-09-29 13:34 Asia/Taipei;
- conclusion: SUCCESS;
- head SHA: `666f8fff97da8395e427d0d892df356c237b8761`.

Immutable artifacts exist:
- `system2-a1-arrival-2026-09-29-36526809162`;
- `system2-required-dependencies-2026-09-29-36526809162`;
- `system2-decision-clock-daily-2026-09-29-36526809162`.

Job audit:
- calendar gate SUCCESS;
- A1 prospective daily-arrival polling SUCCESS;
- A5/B2 prospective dependency polling SUCCESS;
- immutable daily-bundle build/upload SUCCESS.

### Critical D16 interpretation
Workflow success != source completeness != promotion-grade evidence.

The collector is intentionally capable of recording an honest incomplete observation without converting the workflow into a failed GitHub Actions run.

Therefore the 2026-09-29 state is:
`PROSPECTIVE_ARTIFACT_OBSERVED / FINALIZED_DATE_ACCEPTANCE_PENDING`.

At 2026-09-30 07:19 Asia/Taipei, the scheduled next-calendar-day Decision Clock Readiness/Finalized-Date audit (normally around 08:30 Taipei) had not yet executed. The most recent readiness schedule run was still the prior date.

Do NOT:
- increment promotion-grade independentTradingDates early;
- call this a strategy Shadow sample;
- call this Regime OOS evidence;
- infer READY merely from GitHub workflow conclusion=success.

This is real prospective **source-clock/provenance** evidence only.

### D16 maturity effect
No L-level change from this observation alone.

The evidence strengthens D16 PIT/provenance practice but does not satisfy the L4 Shadow/OOS meaning for a new module:
- no Regime policy was run;
- general System2 selected Shadow capture remains separately gated;
- no outcome was joined;
- final acceptance is pending.


### Breadth denominator / missingness contract added
Durable contract:
- `research/D18_BREADTH_DENOMINATOR_MISSINGNESS_CONTRACT_V0_1.md`

The breadth population is now frozen as distinct estimands:
- U0 MARKET_BASE_UNIVERSE;
- U1 DIRECTION_COMPARABLE_UNIVERSE;
- U2 RETURN_KNOWN_UNIVERSE;
- U3 HISTORY_FEATURE_UNIVERSE;
- U4 OPPORTUNITY_SET_UNIVERSE (separate estimand, not a silent replacement for U0-U3).

Missingness reason families are preserved rather than coerced:
STRUCTURAL_NOT_COMPARABLE, NO_USABLE_CLOSE, CHANGE_MISSING_OR_UNPARSEABLE,
PRIOR_SESSION_PRICE_MISSING, NEW_OR_RETURN_HISTORY_UNAVAILABLE,
CONTINUITY_UNVERIFIED, SOURCE_OR_CLOCK_INVALID,
CLASSIFICATION_OR_UNIVERSE_UNKNOWN, HISTORY_INSUFFICIENT, UNKNOWN_OTHER.

No universal coverage threshold is authorized before prospective coverage/missingness distributions are observed.

## Exact next continuation — revised
1. After the scheduled finalized-date audit exists, read the immutable acceptance state for 2026-09-29 and only then decide whether it increments Decision Clock promotion-grade date counts.
2. Continue Direction Breadth prospective occupancy / NOT_COMPARABLE / UNKNOWN design; no policy threshold.
3. Test state-dependent missingness before any coverage gate.
4. Keep Market Direction Breadth separate from Opportunity-Set Breadth.
5. Continue True Return Distribution PIT/continuity work independently.
6. Preserve the B2 X/not-comparable issue as shared-runtime falsification evidence; prepare governance-classified correction only if required.


## 2026-10-01 continuation — Decision Clock source-family revalidation + U2 return firewall

Durable artifacts:
- `research/D16_D18_SOURCE_CLOCK_REVALIDATION_V0_1.md`
- `research/D18_U2_TRUE_RETURN_DISTRIBUTION_CONTRACT_V0_1.md`
- `system2/runtime/d18_twse_official_market_breadth_v0_1.mjs`
- `system2/tests/d18_twse_official_market_breadth_v0_1.test.mjs`

Engineering evidence:
- PR #286 merged research-only;
- merge commit `346938bc3c7409f06535bde6563fed96b0d4f4e3`;
- final verified pre-merge head `0fa244ac717f213b97cbc9baebc58473f734a840`;
- System2 Research CI `36784939010` PASS;
- V8 Repair CI `36784939033` PASS;
- V8 Regression `36784939167` PASS;
- no Worker.js / Formal selection / ranking / capital / signal / push change.

### D16 — 2026-09-29 finalized source-clock acceptance is now known

The next-calendar-day audit is no longer pending.

2026-09-29 finalized acceptance:
- immutable selected attempt-one run: `36526809162`;
- coverage = TRADING_DAY_COMPLETE;
- coveragePromotionEligible = true;
- countsTowardIndependentDate = true;
- promotionGradeDateCount = 1;
- independentTradingDates = 1;
- countsTowardCompleteTradingDate = false;
- completeTradingDates = 0;
- countsTowardPrecisionEligibleDate = false;
- precisionEligibleDates = 0;
- status = INCOMPLETE_REQUIRED_EVIDENCE;
- requiredReady = false;
- sameSessionClockReady = false;
- A5 was not available by a candidate decision boundary;
- exact clock / Cron / capture authorization remain false.

Important naming firewall:
`promotionGradeDateCount=1` means the immutable attempt-one artifact is admissible to the independent evidence ledger. It does NOT mean the source set was complete, precise or ready for decision-clock freeze.

Keeping the failed/incomplete attempt-one date is desirable anti-selection-bias behavior: an inconvenient date cannot be discarded and replaced by a later prettier rerun.

### D16 — first two prospective source days falsify a simple latency-only model

2026-09-29 raw evidence:
- TWSE A1 did not reach the target market date during the observation window;
- TPEx A1 remained source/transport-error;
- B2 did not become complete.

2026-09-30 raw evidence:
- TWSE A1 still exposed 2026-09-29 through the final roughly 16:10 Taipei observation;
- TPEx eventually reached 2026-09-30 with 888 ordinary-symbol rows and classification coverage passing;
- cross-market same-date readiness therefore remained false;
- source availability is asynchronous across venues.

Conclusion:
the working hypothesis "poll after 13:30 and wait long enough for the existing full-market A1 source family" is not yet validated.

Accumulating more dates without source-family revalidation can accumulate source-failure dates rather than estimate a meaningful latency distribution.

Official public product schedules also make the immediate-after-close assumption weak: closing products can be produced materially after the continuous-session close. The prospective artifact clock remains authoritative.

### D18 — factor-specific source architecture

Direction Breadth does not need to wait for the same per-symbol file used for return/history research.

Freeze three different source/estimand lanes:

1. OFFICIAL_AGGREGATE_MARKET_DIRECTION
   - market up/down/unchanged/untraded/no-comparison;
   - TWSE official TWTaZU machine-readable parser is now executable and adversarial-tested;
   - TPEx official market-highlight semantics are known, but exact machine-readable transport + prospective availability remain unverified.

2. PER_SYMBOL_COMMON_STOCK_RETURN_HISTORY
   - common-stock breadth;
   - median/equal-weight return;
   - dispersion;
   - rolling history/MA participation;
   - stricter source-clock and continuity requirements.

3. FORMAL_OPPORTUNITY_SET
   - strategy/formal-filtered universe;
   - diagnostic estimand only, not a substitute for external market state.

The whole D18-04 module remains L2. A validated TWSE parser is a sublane feasibility result, not a two-market Regime builder.

### D18 — U2 True Return Distribution split

U2 is now frozen into:

- U2A RAW_CLOSE_RETURN_DIAGNOSTIC:
  raw traded close ratio across the verified previous official session;
  useful for source diagnostics;
  not automatically an economic/continuity return.

- U2B CONTINUITY_CERTIFIED_RETURN:
  target-date-bounded corporate-action continuity;
  explicit price-space/version/provenance;
  only information effective/known by target date;
  unresolved continuity => UNKNOWN.

Primary D18 median/equal-weight/dispersion/return-share Regime descriptors must use U2B.

The existing official full-market historical adapter assigns `continuityState=UNVERIFIED`, so it cannot silently populate U2B.

D18 must reuse the shared TECHNICAL_CONTINUITY authority rather than invent a second adjustment truth. Current shared continuity runtime remains blocked/partial.

### Cross-room evidence-ladder falsification

2026-09-29 demonstrates that "valid date" is estimand-specific:

- D16 source-clock lane:
  valid immutable independent prospective evidence date.

- D09 BR-030 strategy/sector lane:
  INVALID for outcome inference because 1,883 symbols failed history/source admission; zero candidates were a data-admission failure, not a market-state zero.

Therefore freeze the evidence ladder:

`SOURCE_CLOCK_VALID`
does not imply
`FEATURE_VALID`
does not imply
`STRATEGY_COHORT_VALID`
does not imply
`OUTCOME_VALID`.

Every D18 Regime × Strategy receipt must carry enough lineage to prove each layer independently.

Never transfer an "independent date count" from one estimand into another without proving common eligibility.

### New research question — global vs strategy-specific Decision Clock

System 2 already distinguishes evidence roles such as REQUIRED / SUPPORTIVE / CONTEXT in strategy contracts, but the repository audit did not find a complete machine-readable strategy -> exact source-ID -> readyAt dependency graph.

Potential failure mode:
a single global clock can inherit a slowest-source tax even for a strategy that does not require the slow source.

This is research-only at present.

Do NOT change to strategy-specific clocks until:
1. exact strategy source dependencies are frozen;
2. the global-clock delay attributable to non-required sources is measured;
3. safety/fail-closed invariants are specified;
4. owner/governance class is assessed.

A strategy-specific clock would change admissible decision behavior and is not authorized by this Class-A research round.

### Missingness / source failure is not market weakness

Preserve separate states:
- DATA_NOT_PUBLISHED_YET;
- SOURCE_TRANSPORT_ERROR;
- SOURCE_SCHEMA_INVALID;
- CROSS_MARKET_ASYNCHRONOUS;
- CONTINUITY_UNVERIFIED;
- HISTORY_ADMISSION_FAILED;
- TRUE_MARKET_ZERO / NATURAL_ZERO_PICK.

Do not collapse them into bearish breadth, zero return, no-opportunity market, or bad strategy performance.

### Maturity decision

D16-11 remains L3 / 60%.
Reason:
real prospective provenance evidence improved substantially, but exact source-clock completeness/precision remains zero and source-family assumptions require revalidation.

D18-04 remains L2 / 40%.
Reason:
TWSE official aggregate breadth has an executable tested sublane, but TPEx/cross-market prospective source readiness, U2B continuity and context-only occupancy are still incomplete.

No D18 policy module receives L3/L4 evidence from this round.

### Formal decision

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

No Regime threshold, strategy gate, dynamic weight, Formal score, capital, execution or notification change is justified.

## Exact next continuation — 2026-10-01

1. Read the finalized 2026-09-30 Decision Clock acceptance only after the scheduled next-calendar-day audit exists; do not infer it from raw workflow success.
2. Prospectively measure TWSE TWTaZU aggregate-breadth availability using the frozen parser; publication timing remains evidence, not assumed documentation.
3. Resolve a machine-readable official TPEx aggregate breadth transport and measure its availability; HTML semantics alone are not L3.
4. When both aggregate venues are valid on common support, compare official aggregate breadth versus per-symbol reconstructed breadth as a source/universe diagnostic, not an alpha test.
5. Reuse shared TECHNICAL_CONTINUITY for a future U2A/U2B comparison receipt; do not create a second corporate-action transform.
6. Test whether missing/not-comparable/source-failure shares are state-dependent before any coverage threshold.
7. Audit global-clock vs strategy-specific required-source dependencies as a separate architecture hypothesis; no runtime change.
8. Regime-policy alpha remains closed until source occupancy, feature validity and strategy-cohort validity all pass.


## 2026-10-02 continuation — three-day finalized evidence, A5 attribution repair, strategy-stage clock audit

Durable artifacts:
- `research/D16_DECISION_CLOCK_DIAGNOSTIC_ATTRIBUTION_V0_1.md`
- `research/D16_STRATEGY_STAGE_CLOCK_DEPENDENCY_AUDIT_V0_1.md`

Engineering correction:
- PR #312 merged as `332cdd844583cf5a4f2bc070d0e3d821f4c2a4fd`;
- final verified head `a177ca68690d7e59a602ee315ae7a4a280716229`;
- System2 Research CI `36984225991` PASS;
- V8 Repair CI `36984226112` PASS;
- V8 Regression `36984225981` PASS;
- correction affects diagnostic attribution only; no Decision Clock authorization or trading behavior changed.

### D16 finalized prospective evidence through 2026-10-01

Promotion-grade finalized trading dates:
- 2026-09-29;
- 2026-09-30;
- 2026-10-01.

Aggregate:
- independentTradingDates = 3;
- completeTradingDates = 0;
- precisionEligibleDates = 0;
- collectorContractConsistent = true;
- candidateTaipeiTime = null;
- exactDecisionClockAuthorized = false.

All three dates:
- selected immutable attempt-one scheduled artifacts;
- coveragePromotionEligible = true;
- sameSessionClockReady = false;
- requiredReady = false;
- candidateTimestamp = null;
- do not count toward complete or precision-eligible dates.

Therefore repeated incomplete dates are now structural evidence, not a one-day anomaly.

### 2026-10-02 raw / not-yet-finalized evidence

Do not increment finalized independent-date counts yet.

TWSE A1:
- 30/30 TARGET_DATE_NOT_PRESENT;
- payload remained 2026-10-01 through the final observation;
- no same-date READY inside the observation window.

TPEx A1:
- 13 TARGET_DATE_NOT_PRESENT;
- 16 HTTP-200 NON_JSON_RESPONSE;
- final observation READY;
- firstReadyAt = 16:08:27.888 Asia/Taipei;
- last observed NOT_READY = 15:58:11.726;
- arrival lower bound = 148.195 minutes after 13:30 close;
- arrival upper bound = 158.465 minutes;
- bracket width = 10.269 minutes;
- recordCount = 868.

This is the first concrete TPEx prospective arrival bracket in this sequence, but it is not yet an exchange publication-time estimate because transport instability is mixed into the source path.

### Publication latency != transport reliability

TPEx has now shown three distinguishable states:
- valid prior-date JSON;
- HTTP 200 but non-JSON response;
- valid same-date JSON / READY.

Do not merge these into one NOT_READY bucket.

A latency model built on an unstable transport path can measure collector/provider instability instead of publication timing.

### D16 diagnostic attribution repair

The daily evidence and finalized-date acceptance semantics already define A5 boundary failure correctly:
A5 can miss a candidate boundary only after sameSessionClockReady is true and a candidate exists.

Aggregation previously used:
`a5AvailableByCandidate !== true`
without requiring sameSessionClockReady.

This incorrectly labeled dates with:
- sameSessionClockReady = false;
- candidateTimestamp = null;

as A5 boundary failures in owner-review aggregation.

PR #312 corrected:
`sameSessionClockReady === true && a5AvailableByCandidate !== true`.

Required interpretation:
- A1/B2 incomplete + no candidate -> INCOMPLETE_REQUIRED_EVIDENCE, not A5 boundary miss;
- A1/B2 ready + candidate exists + A5 late -> genuine A5_NOT_AVAILABLE_BY_CANDIDATE.

This prevents root-cause frequency inflation and optimization effort being directed at the wrong source.

### D16 contract inconsistency: global clock vs strategy requirements

Current global daily `requiredReady` effectively depends on:
- A1 TWSE;
- A1 TPEx;
- B2 prospective industry dependency;
- A5 available by the computed candidate boundary.

But frozen Limited Shadow `SHORT_MOMENTUM V0.1-CONTRACT` requires for non-INCOMPLETE evaluation:
- TECHNICAL_STRUCTURE;
- PRICE_VOLUME;
- RISK_FRICTION.

Its preregistry explicitly allows prospective breadth/sector gaps and global/macro context to remain UNKNOWN, and A5 is not a required family.

Therefore:
`GLOBAL_REQUIRED_SET != SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET`.

This confirms a contract inconsistency and makes a slowest-source tax plausible.

It does NOT prove an earlier actionable strategy clock is safe because downstream shared ranking/capacity/execution may add legitimate dependencies.

### Strategy-specific clock is still too coarse

System 2 already separates:
- Strategy Validity;
- Entry Readiness.

Research must extend this into a stage graph:

1. SOURCE_READY;
2. STRATEGY_VALIDITY_READY;
3. ENTRY_READINESS_READY;
4. SHARED_SELECTION_READY;
5. EXECUTION_READY.

The correct dependency object is:
`strategyId × stageId -> required evidence/source contracts -> readiness state/time`.

A thesis can be valid while entry timing or shared selection remains blocked.

### SWING_GROWTH boundary

SWING_GROWTH Limited Shadow requires:
- FUNDAMENTAL_QUALITY;
- INDUSTRY_THESIS.

A5 can support the fundamental family.

However the current B2 prospective observer is descriptive industry breadth/participation and explicitly does not itself assign an industry-thesis direction/strategy score.

Therefore:
`B2 SOURCE READY`
does not automatically imply
`INDUSTRY_THESIS READY`.

Source readiness and strategy-semantic readiness remain separate evidence layers.

### D18 implication

Regime evidence must enter each strategy according to its declared role:
- REQUIRED;
- SUPPORTIVE;
- CONTEXT_ONLY;
- HARD_INVALIDATION;
- WARNING.

D18 must not silently turn Market Regime into a universal REQUIRED dependency for every strategy merely because a Regime layer exists.

If Regime is CONTEXT_ONLY for a strategy stage, late Regime arrival cannot retroactively invalidate an earlier PIT-valid stage.

No policy behavior is changed by this conclusion.

### Maturity decision

D16 overall remains 73.3%.

D16-11 Data Provenance remains L3 / 60%:
- prospective evidence count improved from 1 to 3 finalized independent dates;
- diagnostic attribution is now more accurate;
- but complete/precision dates remain 0.

D16-14 Generation Alignment remains L3 / 60%:
- strategy-stage dependency mismatch is now identified;
- executable machine-readable stage dependency graph is still missing.

D18 remains 40%; no D18 policy module gains OOS/Shadow evidence.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next continuation — 2026-10-02

1. Finalize 2026-10-02 only through the next-calendar-day acceptance artifact; do not count the raw run early.
2. Read the next readiness aggregation after PR #312 and verify 9/29-10/01 are no longer falsely listed as A5 boundary failures.
3. Build a research-only machine-readable strategy-stage dependency matrix for SHORT_MOMENTUM and SWING_GROWTH.
4. Resolve exact A1-derived RISK_FRICTION and entry-readiness dependencies; do not assume all A1 fields share identical finality.
5. Resolve whether any current B2 output is sufficient for SWING_GROWTH INDUSTRY_THESIS; default is NO until semantic mapping is explicit.
6. Record hypothetical stage-ready timestamps prospectively without changing actual runtime.
7. Only after stage graph + timestamps exist may global-vs-stage timing deltas be measured.
8. Keep TPEx transport instability separate from publication latency.
9. Continue TWSE source-family revalidation; no same-date A1 READY has yet been observed in the current four-day raw sequence.


## 2026-10-03 priority continuation — D16-25 Probabilistic Decision / Bayesian Updating / Uncertainty-aware Selection

Owner priority:
D16-25 is temporarily prioritized ahead of other D16/D18 continuations because D15-19 Kelly / Fractional Kelly is an owner-approved strong merge candidate that explicitly depends on D16-25.

Durable artifacts:
- `research/D16_25_PROBABILISTIC_DECISION_RESEARCH_V0_1.md`
- `research/d16_25_probabilistic_decision_contract_v0_1.json`
- `research/d16_25_probability_validation_v0_1.mjs`
- `system2/tests/d16_25_probability_validation_v0_1.test.mjs`
- `research/D16_25_D15_19_MERGE_DECISION_INPUT_V0_1.md`

Engineering evidence:
- PR #325 merged as `2f63157bd0555458331177abd8c3514ad456ae19`;
- PR #325 final head `ec04987cfcc4680a90d0d351be4ad3b8d89c4a28`;
- System2 Research CI `37088089033` PASS;
- V8 Repair CI `37088089159` PASS;
- V8 Regression `37088089066` PASS.
- PR #326 merged as `74773b427aa7954d1994825070f8874f2e2197d0`;
- PR #326 final head `96e1b795d2c52d95b6f1537cd526ec180eee0c3a`;
- System2 Research CI `37088328576` PASS;
- V8 Regression `37088328526` PASS;
- V8 Repair CI `37088328567` PASS.

No Worker/Cron/D1 mutation, Formal selection/rank/capital/monitor/push change, System2 final-selection authority, or Kelly sizing was introduced.

### D16-25 responsibility is now frozen

D16-25 owns two upstream layers:

1. Predictive estimation:
   - target/horizon definition;
   - PIT-safe base rate / prior;
   - Bayesian/probabilistic evidence combination;
   - probability or predictive distribution;
   - calibration;
   - model/data/shift uncertainty.

2. Decision utility:
   - after-cost expected decision value;
   - uncertainty-aware ACCEPT / ABSTAIN / DATA_BLOCKED;
   - opportunity-capture / false-acceptance / missed-opportunity evaluation.

D16-25 does NOT automatically own position size.

Position allocation remains a downstream D15 responsibility unless a later owner-approved curriculum merge explicitly transfers that responsibility.

### Probability identity firewall

A probability is invalid without a frozen semantic identity.

The executable validator now requires homogeneous:
- strategyId;
- strategyVersion;
- decisionStage;
- targetId;
- horizon;
- referenceBasis;
- costModelVersion;
- outcomeRuleVersion;
- baseRateCohortVersion;
- modelVersion;
- calibrationVersion.

Changing any of these creates a different calibration family.

Do not pool:
- D5 and D20;
- gross and after-cost outcomes;
- target-first and positive-return labels;
- selected-conditioned and filled-conditioned targets;
- different cost models;
- different calibration versions.

### Outcome-maturity firewall

Only outcomes with:
`outcomeMaturedAt <= evaluationCutoff`
enter probability evaluation.

Immature D+N:
- remains IMMATURE / UNKNOWN;
- never becomes loss/0.

Target/stop same-bar ambiguity remains explicit unless a label policy was preregistered.

### Calibration contract

Primary binary metrics:
- Brier score;
- logarithmic loss;
- fixed-bin reliability table.

Secondary:
- binned reliability/resolution/uncertainty decomposition;
- ECE only as a secondary diagnostic.

A frozen reference base rate must come from prior training evidence.
The holdout empirical outcome rate is descriptive and cannot be silently reused as the frozen baseline.

Exact wrong p=0 or p=1 produces infinite logarithmic loss.
The V0.1 evaluator deliberately performs no silent clipping.

### Bayesian prior / updating contract

Base-rate cohorts are target-specific:
- strategy;
- target;
- horizon;
- intended eligibility population;
- cost semantics.

A Beta-Binomial updater is implemented as a simple binary baseline only.

Guardrails:
- only matured prior observations update the posterior;
- immature/unknown outcomes are excluded and counted;
- small samples widen uncertainty/shrink toward the prior rather than justify extreme 0/1;
- correlated evidence cannot be multiplied as independent likelihood ratios without proof;
- Bayesian complexity must beat simpler base-rate/score/calibration baselines.

### Uncertainty contract

Probability and uncertainty remain separate.

p≈0.5 does not automatically mean "high uncertainty".

Required conceptual channels:
- ALEATORIC_OUTCOME;
- EPISTEMIC_PARAMETER_MODEL;
- DATA_PROVENANCE;
- DISTRIBUTION_SHIFT_REGIME;
- EXECUTION_PAYOFF.

The executable selective-policy test proves:
- p=0.5 with explicitly low uncertainty can pass an uncertainty gate;
- missing uncertainty becomes DATA_BLOCKED when the frozen policy requires it.

### ABSTAIN contract

ABSTAIN is a valid decision.

A selective policy must report:
- accepted coverage;
- abstention;
- data-blocked share;
- opportunity capture;
- missed positive opportunity;
- false acceptance;
- accepted after-cost realized value where mature.

Accuracy/return on accepted rows alone is insufficient because a model can game apparent quality by abstaining on nearly everything.

Thresholds are frozen inputs.
The evaluator does not search outcomes for an optimal probability / EV / uncertainty threshold.

### Utility finding

Probability alone is insufficient.

Executable negative example:
- p(win)=0.70;
- avg win=+1%;
- avg loss magnitude=4%;
- zero cost;
=> EV = -0.5%.

Therefore "70% chance" can still be a bad decision.

D16-25 output must preserve payoff/utility semantics, not only probability.

### Population / denominator firewall

Promotion-grade calibration requires the intended decision population.

Do not use selected-only or bounded/reason-sorted legacy Shadow as the deployment population.

System1 C1 complete-population infrastructure gives strong schema/engineering feasibility, but real positive evidence is still blocked.

Latest scheduled C1 collector:
- workflow run `37033639328`;
- observed 2026-10-03 00:24 Taipei;
- scanDate = 2026-10-02;
- verificationFailure = C1_GENERATION_NOT_FOUND;
- category = FORMAL_SCAN_NOT_CONFIRMED;
- formalScanDate remained 2026-09-29;
- formalPipelineComplete = false;
- institutionDate=2026-10-02 and institutionReady=true;
- qualityDate=2026-10-02 and qualityReady=true;
- eligibleForResearch=false;
- mayCountAsZeroPick=false.

Therefore:
missing C1 generation is a data/population failure, not a zero-opportunity market date.

Synthetic fixtures / CI do not satisfy Taiwan PIT L3.

### D16-25 -> D15-19 interface

Dependency is now supported:
D15-19 requires a calibrated target-specific probability/payoff distribution with uncertainty before Kelly-style sizing can be responsibly evaluated.

But dependency != redundancy.

D16-25 unique:
- target/base rate/prior;
- probability/distribution estimation;
- calibration;
- uncertainty / shift;
- ABSTAIN;
- decision utility validation.

D15-19 unique:
- log-growth objective;
- Kelly capital fraction;
- Fractional Kelly;
- portfolio correlation/concentration;
- drawdown/ruin constraints;
- lifecycle/portfolio heat.

Current relationship:
`STRONG_DEPENDENCY / PARTIAL_CONCEPTUAL_OVERLAP / DISTINCT_PORTFOLIO_ALLOCATION_RESPONSIBILITY`.

### Four later curriculum structures are now explicit

A. Keep D16-25 + D15-19 with a strict PredictiveDecisionReceipt -> KellySizingReceipt interface.

B. Merge D15-19 into D15-16 Portfolio Optimization method family while D16-25 remains upstream probability/calibration authority.

C. Merge D15-19 directly into an expanded D16-25 only if D16-25 formally absorbs downstream allocation/portfolio responsibilities.

D. Retire D15-19 standalone ID and split-transfer:
- probability/input semantics -> D16-25;
- Kelly/Fractional Kelly sizing mechanics -> D15-16 / D15 sizing ownership.

No option is executed here.

The D16-25-side research currently makes B or D structurally more natural than silently moving all Kelly allocation responsibility into statistical validation, but final curriculum action still requires D15-19 specialist research + owner decision.

### D16-25 maturity decision

Advance:
`L0 / 0% -> L2 / 40%`.

Reason:
- theory/mechanism;
- positive mechanism;
- explicit falsification matrix;
- PIT/target/label maturity contract;
- base-rate/Bayesian guardrails;
- calibration metrics;
- uncertainty semantics;
- ABSTAIN;
- utility/payoff semantics;
- population firewall;
- D15-19 handoff;
- executable pure evaluator;
- adversarial tests;
- CI + V8 regression isolation

are all established.

Do NOT advance to L3.

Missing L3 evidence:
- genuine complete Taiwan PIT intended population;
- frozen real D16-25 predictions;
- causally joined matured outcomes;
- source-generation-complete replay/calibration receipt.

### Current optimization / merge decision

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

D15-19 retirement/merge:
NOT EXECUTED.

D16-25 is now sufficiently researched on the conceptual/validation side to support a later cross-module ownership comparison, but not to claim empirical Kelly sizing superiority.

## Exact next D16-25 continuation

1. Obtain first genuine complete C1 population generation; keep failures as failures.
2. Freeze one simple actual probabilistic target before outcome review.
3. Use a simple base-rate / simple-score calibrator first; Bayesian model is challenger.
4. Freeze trainingThroughDate and calibrationVersion.
5. Produce immutable prediction receipts before outcome.
6. Join only matured D+N outcomes.
7. Measure Brier/log loss/reliability, after-cost utility, coverage/ABSTAIN and Regime drift.
8. Only after those exist consider D16-25 L3/L4.
9. D15 room must independently study Kelly/Fractional Kelly, then compare merge structures A/B/C/D under anti-orphan governance.


## 2026-10-03 D16-25 L2 closure addendum — Regime calibration and risk-coverage validation

Owner priority remains D16-25 until the D16 side is sufficiently complete for D15-19 merge governance.

PR #333:
- merged as `f93d41436291f1319f7ca402ff8cac55ff27d63d`;
- final PR head `448afc26bd9164087120a21f51590d69d42a994f`;
- V8 Repair CI `37090669475` PASS;
- V8 Regression `37090669501` PASS;
- System2 Research CI `37090669430` attempt 3 PASS;
- System2 CI attempts 1/2 were cancelled by repository-wide `concurrency: system2-research-ci / cancel-in-progress: true`, not by test failure;
- successful System2 job `111110654817` passed research tests, syntax checks, SQLite schema validation and Production isolation guard.

Additional executable D16-25 closure:
- per-prediction optional `regimeId` is preserved;
- evaluation now reports per-Regime N, independent scan dates, empirical event rate, Brier score and log loss;
- low-N Regime cells are explicitly descriptive, not stable calibration claims;
- multiple preregistered ABSTAIN / selective policies can be evaluated side-by-side;
- the evaluator never selects a winning policy from evaluation outcomes;
- `bestPolicySelected=false` and `NO_OUTCOME_TUNED_POLICY_SELECTION` are explicit;
- duplicate policy versions fail closed.

Methodology boundary:
- proper probabilistic scoring remains primary for probability quality;
- ECE remains secondary;
- calibration must be rechecked under chronological / Regime / distribution shift;
- selective prediction must report risk/quality together with coverage/opportunity capture;
- Fractional Kelly is a downstream sizing response to validated uncertainty/edge, not a calibration method.

D16-25 maturity remains:
`L2 / 40%`.

Reason for no L3:
- genuine complete Taiwan intended-population C1 generation still absent;
- no immutable real D16-25 probability prediction series yet;
- no causally matured Taiwan calibration/OOS series yet;
- no promotion-grade replay/calibration receipt yet.

D16-25-side merge governance is now sufficiently mature to state:
- D16-25 = probability/distribution estimation + calibration + uncertainty + ABSTAIN + decision utility;
- D15-19 = Kelly/log-growth + Fractional Kelly + validated belief/payoff -> capital fraction + portfolio constraints;
- dependency is strong;
- conceptual overlap is partial;
- direct duplication is not established;
- a direct D15-19 -> D16-25 merge would require an explicit D16 scope expansion into portfolio sizing and carries anti-orphan risk;
- structurally, D15-19 -> D15-16 method-family absorption or split-transfer remains more natural than silently moving all Kelly allocation responsibility into D16, subject to D15 specialist validation.

Current D15-19 merge action:
`NO_MERGE_EXECUTION_YET`.

D16-side readiness:
`READY_FOR_D15_SPECIALIST_COMPARISON`.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next priority handoff

1. Keep D16-25 at L2 until genuine C1/PIT prediction-outcome evidence exists; do not manufacture L3.
2. D15 specialist room should now study D15-19 Kelly/Fractional Kelly independently:
   - log-growth objective;
   - full vs fractional Kelly;
   - parameter-estimation risk;
   - correlated multi-position Kelly;
   - drawdown/ruin constraints;
   - transaction costs/capacity;
   - comparison with fixed-risk, equal allocation, capped sizing, risk budgeting and D15-16 optimization family.
3. After D15-19 reaches at least mechanism/falsification maturity, compare Options A/B/C/D in `research/D16_25_D15_19_MERGE_DECISION_INPUT_V0_1.md`.
4. Any standalone module retirement still requires owner decision + anti-orphan verification.


## 2026-10-03 D16-25 specialist completion addendum — date-balanced calibration and merge-comparison readiness

Owner priority:
D16-25 remains the immediate prerequisite for D15-19 merge governance. This addendum closes the last identified D16-side methodological gap before handing the comparison to D15 specialist research.

Engineering evidence:
- PR #340 merged as `399287ac5ad669686f5f40fcfe72ea28617fd680`;
- final PR head `716b9038a1437b03dc5de92ee24709918a5b2deb`;
- System2 Research CI `37095784670` PASS;
- V8 Repair CI `37095784642` PASS;
- V8 Regression `37095784664` PASS.

No Worker/Cron/D1 mutation, Formal selection/rank/capital/monitor/push change, probability-model deployment, Kelly sizing, or live-trading behavior was introduced.

### Date-clustering / pseudo-replication firewall added

The probability evaluator now reports both:
- row-weighted Brier/log loss;
- date-balanced Brier/log loss.

It also reports:
- per-date N / empirical outcome rate / mean predicted probability / Brier / log loss;
- independentScanDateCount;
- meanPredictedProbability;
- calibrationInTheLargeGap.

Reason:
multiple stock rows from one scan date can share the same market/regime/source shock. A large cross-section can dominate row-weighted calibration even though it is not an independent-date replication.

Interpretation:
- row-weighted scores estimate average quality per prediction row;
- date-balanced scores are a robustness diagnostic across independent scan dates;
- neither substitutes for D16/D18 purging, overlapping-label control or Regime-episode robustness.

Adversarial test now proves that when one date contributes multiple poor rows and another date contributes one good row:
- row-weighted Brier and date-balanced Brier differ;
- the evaluator preserves both estimands;
- row multiplicity is not reported as extra independent dates.

### External-methodology counterevidence retained

Proper scoring:
probability quality must be evaluated with proper scores/reliability, not hit rate or rank spread alone.

Selective prediction:
ABSTAIN/reject-option quality is inseparable from accepted coverage and opportunity capture.

Covariate / Regime shift:
historical calibration may fail under changed deployment distribution; old calibration cannot be silently reused.

Kelly under parameter uncertainty:
sizing with unknown edge/payoff depends on posterior/uncertainty state. Fractional Kelly is not a probability-calibration method.

These findings strengthen the D16/D15 responsibility separation rather than collapsing the two modules into one.

### D16-25 specialist completion judgment

D16-25 is now considered **specialist-complete at L2 for curriculum merge comparison**.

D16-side conceptual ownership is sufficiently closed on:
- target/horizon/action conditioning;
- PIT outcome maturity;
- base-rate/prior semantics;
- Bayesian double-counting firewall;
- probability calibration vs discrimination;
- proper scoring/reliability;
- uncertainty channels;
- distribution/Regime shift;
- ABSTAIN/selective policy risk-coverage;
- after-cost expected utility;
- population/selection-bias firewall;
- date-clustering robustness;
- PredictiveDecisionReceipt handoff;
- sizing firewall.

Remaining blockers are empirical maturity only:
- genuine complete Taiwan PIT intended population;
- immutable real probability predictions;
- matured outcomes;
- real OOS/prospective calibration;
- after-cost utility / risk-coverage evidence.

Therefore:
- D16-25 remains L2 / 40%;
- L3 is still forbidden;
- D15-19 may now proceed with specialist research and A/B/C/D merge-structure comparison;
- direct merge/retirement still requires D15 anti-orphan validation and owner decision.

Current relation:
`D16_SIDE_READY / D15_SPECIALIST_RESEARCH_REQUIRED / DIRECT_FULL_MERGE_NOT_YET_JUSTIFIED`.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next priority handoff — D16-25

1. Stop expanding D16-25 conceptual scope unless new contradictory evidence appears.
2. Keep D16-25 at L2 until real Taiwan PIT calibration evidence exists.
3. D15 specialist room should now study D15-19 Kelly / Fractional Kelly:
   - log-growth objective;
   - full vs fractional Kelly;
   - parameter-estimation risk;
   - correlated multi-position Kelly;
   - drawdown/ruin constraints;
   - liquidity/cost/capacity;
   - comparison with fixed-risk, capped sizing, risk budgeting and D15-16 optimization.
4. After D15-19 reaches at least L2 mechanism/falsification maturity, compare merge Options A/B/C/D under anti-orphan governance.
5. Any curriculum merge/retirement remains owner-controlled and must preserve one canonical probability/calibration authority in D16-25.


## D16-25 continuation audit — 2026-10-03

Research-only synthetic counterevidence retained in `research/D16_25_SELECTIVE_DENOMINATOR_ACCEPTANCE_AUDIT_20261003_V0_1.md`. Existing evaluator reports selective coverage on matured-known-label rows, not the entire frozen decision population. A four-row reproduction keeps true operational acceptance at 75% while label arrival changes reported matured-subset coverage from 50% to 66.7%. This does not invalidate conditional matured-subset scores; it prohibits interpreting them as population coverage without a separate frozen decision ledger and label/cost completeness. Evaluator code is unchanged; dual-denominator implementation remains next work. Existing D16 probability tests and audit assertions PASS. No real Taiwan calibration evidence, L3 claim, Formal change or sizing authority. D16-25 stays L2/40%; D15-19 stays L0/0%; final merge remains evidence-insufficient pending D15 specialist research.

Latest-main C1 cross-midnight closure already records approved merge/deploy; first genuine accepted population remains pending. Latest C1 run 37067696964 is completed/failure; summary alone cannot identify root cause. Public runtime readback is 8.15.3-c3-quote-context, testMode=false. No historical receipt is created. Exact next: frozen full-population decision ledger, mature-label and cost completeness, label-arrival invariance, genuine parent/prediction/outcome causal join; D15 K1–K8 and anti-orphan review before owner merge choice.

Calibration implementation ownership follows the newer H09 producer-consumer contract: D16-19 produces model calibration; D16-25 consumes its quality and applies uncertainty/utility/ABSTAIN. This is not a second calibration vote or an H09 completion claim. Kelly input remains NOT_READY/UNKNOWN; FORMAL_OPTIMIZATION_CANDIDATE: NONE.

This package is published on an isolated research branch/draft PR. Main merge is withheld because the current v7-cloudflare workflow includes research non-Markdown files; tracker/MJS/JSON can trigger production deployment. No workflow bypass or production deployment is authorized by this audit.


## 2026-10-04 D16 model-validation cluster closure — D16-16~19

Canonical evidence: `research/D16_16_19_MODEL_VALIDATION_CLUSTER_20261004_V0_1.md`.

Research-only L2 closures:
- D16-16 Time-series Models -> L2/40: PIT temporal-model baseline/refit contract + structural-break/latent-state/forecast-vs-utility falsification frozen.
- D16-17 Panel/Cross-sectional Models -> L2/40: date/issuer dependence, PIT membership, cross-sectional transform and clustered-inference falsification frozen.
- D16-18 Regularization/Feature Selection -> L2/40: fold-local preprocessing/selection, correlated-feature instability, source-family redundancy and nested-selection falsification frozen.
- D16-19 Machine Learning/Calibration -> L2/40: model-selection bias, calibration family + IDENTITY baseline, sample-sufficiency, drift-vs-refit state machine and CalibrationReceipt ownership frozen.

H09 terminal specialist result: `SCOPE_DEDUP_ONLY`.
D16-19 owns model/calibration quality and model drift. D16-25 consumes one canonical CalibrationReceipt and owns decision utility/uncertainty/ABSTAIN/decision drift. No duplicate probability authority.

Repository search found evaluation support in `research/d16_25_probability_validation_v0_1.mjs`, but no proven executable Platt/Beta/Isotonic builder and no genuine complete Taiwan PIT calibrated-prediction -> matured-outcome series. Therefore all four modules stop at L2; no L3 is claimed from specifications or synthetic evidence.

D16 domain maturity after the four justified L2 promotions: **52%**.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

Exact next: D16-20 Causal Inference (L0), then D16-21 Alternative Data Provenance / Selection Bias (L0). Keep D16-16/17/18/19 at L2 until executable Taiwan PIT replay evidence exists.


## 2026-10-04 D16 advanced-validation cluster closure — D16-20~24

Canonical evidence: `research/D16_20_24_ADVANCED_VALIDATION_CLUSTER_20261004_V0_1.md`.

Research-only L2 closures:
- D16-20 Causal Inference -> L2/40: estimand/identification/PIT/falsification contract frozen; causal ML does not create identification.
- D16-21 Alternative Data Provenance / Selection Bias -> L2/40: alternative-data-specific sampling/coverage/entry-exit/entity-map/MNAR/vendor-drift contract frozen; D16-11 generic provenance remains canonical. Terminal overlap result: `SCOPE_DEDUP_ONLY / KEEP_BOTH_WITH_NARROWED_D16_21_SCOPE`.
- D16-22 NLP / LLM Financial-text Feature Validation -> L2/40: source-clock/model-vintage/prompt/retrieval/contamination/redaction/simple-baseline contract frozen; unrestricted pretrained LLM historical outputs are not automatically PIT-safe.
- D16-23 Stress / Scenario / Reverse Stress -> L2/40: scenario-vs-probability, reverse-stress, coherent dependency and execution-stress contract frozen. Terminal overlap result vs D07-23: `KEEP_SEPARATE / OBJECT_MODEL_VS_VALIDATION_METHOD`.
- D16-24 Monte Carlo / Distributional Validation -> L2/40: simulation-is-not-evidence firewall, dependence-preserving simulation, seed replay and density-forecast validation contract frozen.

No L3 is claimed for these modules. They require executable Taiwan PIT builders/replays.

D16 domain maturity after this justified batch: **60%**.
354-module global tracker maturity after recomputation: **40.7%**.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

Exact next: D16 has no remaining L0 modules. Do not invent D16 L3 evidence. Move to genuine executable Taiwan PIT evidence where available, otherwise continue room-owned D18-15 (L0) / evidence-dependent D18 work.


## 2026-10-04 D18-15 Business/Credit Cycle × Strategy closure

Canonical evidence: `research/D18_15_BUSINESS_CREDIT_CYCLE_STRATEGY_REGIME_20261004_V0_1.md`.

D18-15 -> L2/40.

Frozen results:
- D13-18 owns PIT business-cycle measurement/vintage; D18-15 owns strategy interaction only.
- D22 credit modules own credit-cycle/spread/lending primitives; D18-15 consumes frozen producer receipts.
- Business and credit cycle states remain separate inputs first; no one-score collapse or policy threshold is authorized.
- NDC TAIEX-component circularity requires aggregate-vs-ex-TAIEX/non-price-component falsification before stock-return claims.
- Monthly macro vintages, decision dates and cycle episodes are separate evidence counts; daily rows do not manufacture independent macro samples.
- Attribution != policy. Cycle-policy promotion requires paired static/exposure-matched controls, costs, OOS/prospective evidence and multiple episodes.
- Revised history and ex-post turning points cannot become live labels.

D18 L3 audit found no additional justified promotion: D18-01/02/03 builders missing; D18-04 only has a mature TWSE direction-breadth sublane; D18-05 label builder missing; D18-06/07 source/PIT gaps remain; D18-08~14 require executable frozen states + OOS/prospective evidence.

D18 domain maturity after the justified D18-15 L2 promotion: **40%**.
Global 354-module tracker maturity after recomputation: **41.5%**.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

Exact next: do not force D18 L3. Highest-value next evidence path is an isolated PIT-safe market-level Regime builder/replay for D18-01/02/03, plus prospective both-venue/U2B completion for D18-04 and immutable B2->D18 context receipts for D18-05.


## 2026-10-04 D18 executable PIT context builders — D18-02/03/05 L3

Canonical evidence: `research/D18_02_03_05_PIT_BUILDER_L3_ACCEPTANCE_20261004_V0_1.md`.

Validated research-only builders:
- `system2/runtime/d18_taiex_context_v0_1.mjs` — D18-02 / D18-03;
- `system2/runtime/d18_sector_rotation_context_v0_1.mjs` — D18-05.

Latest validated rebased head checks:
- System2 Research CI 37163488436 SUCCESS;
- V8 Regression 37163488405 SUCCESS;
- V8 Repair CI 37163488369 SUCCESS.

The tests prove exact-session/PIT guards, deterministic replay, mutation-sensitive hashes, post-decision UNKNOWN, gap/non-adjacent UNKNOWN and no policy/selection impact.

Maturity:
- D18-02 -> L3/60;
- D18-03 -> L3/60;
- D18-05 -> L3/60;
- D18-01 intentionally stays L2 because the complete multi-dimensional observable regime vector is not yet executable.

D18 domain maturity: **44%**.
Global tracker maturity after latest-main recompute: **42.3%**.

No L4 / policy-alpha claim. FORMAL_OPTIMIZATION_CANDIDATE: NONE. Formal Core LOCKED.


## 2026-10-04 D18-01 observable regime vector — L3

Canonical evidence: `research/D18_01_OBSERVABLE_REGIME_VECTOR_L3_ACCEPTANCE_20261004_V0_1.md`.

D18-01 -> L3/60.

Executable taxonomy layer:
- `system2/runtime/d18_observable_regime_vector_v0_1.mjs`;
- `system2/tests/d18_observable_regime_vector_v0_1.test.mjs`.

Key acceptance:
- exact marketDate / decisionTimestamp identity;
- immutable upstream hashes;
- deterministic vector replay;
- hard prerequisite mismatch -> UNKNOWN;
- immature producer dimensions remain UNKNOWN/CONTEXT_RAW;
- no scalar Risk-On/Off score;
- no policy/selection/weight/capital effect;
- no historical backfill.

D18-04 remains L2 because U2B continuity-certified return is not executable and shared Corporate Action revision/suspension/continuity gates remain incomplete.

D18 domain maturity after D18-01 promotion: **45.3%**.
Global tracker maturity after recompute: **43.5%**.

FORMAL_OPTIMIZATION_CANDIDATE: NONE. Formal Core LOCKED.

Exact next: persist prospective context-only D18 vector occupancy; continue shared-continuity dependencies for D18-04; no policy arm before OOS/prospective evidence.


## 2026-10-04 D18-11 Regime Transition — L3

Canonical evidence: `research/D18_11_REGIME_TRANSITION_L3_ACCEPTANCE_20261004_V0_1.md`.

D18-11 -> L3/60.

Executable observer:
- `system2/runtime/d18_regime_transition_v0_1.mjs`;
- `system2/tests/d18_regime_transition_v0_1.test.mjs`.

Acceptance:
- adjacent official sessions required;
- prior/current vector PIT identity required;
- changed/unchanged/unknown dimensions explicit;
- deterministic replay hash;
- no smoothing;
- no retrospective relabel;
- no policy/strategy/capital impact.

Prior validated head evidence:
- System2 Research CI 37174490288 SUCCESS;
- V8 Regression 37174490377 SUCCESS.

D18 domain maturity after D18-11 promotion: **46.7%**.
Global tracker maturity after recompute: **43.7%**.

D18-13/14 remain L2 pending a dedicated frozen Regime × strategy outcome attribution/walk-forward joiner.

FORMAL_OPTIMIZATION_CANDIDATE: NONE. Formal Core LOCKED.


## 2026-10-04 D18-13 Regime Performance Attribution — L3

Canonical evidence: `research/D18_13_REGIME_ATTRIBUTION_L3_ACCEPTANCE_20261004_V0_1.md`.

D18-13 -> L3/60.

Executable joiner:
- `system2/runtime/d18_regime_attribution_v0_1.mjs`;
- `system2/tests/d18_regime_attribution_v0_1.test.mjs`.

Acceptance:
- frozen decisionHash + strategyId/version;
- frozen D18 regime vector hash/version;
- later outcomeHash join;
- exact decision clock/date/symbol identity;
- MATURED / IMMATURE / UNKNOWN separated;
- signal return vs simulated execution semantics preserved;
- raw/unknown regime dimensions never coerced into discrete labels;
- attribution only, no switching/policy/capital impact.

Prior validated head:
- System2 Research CI 37174765289 SUCCESS;
- V8 Regression 37174765255 SUCCESS.

D18 domain maturity after D18-13 promotion: **48%**.
Global tracker maturity after recompute: **43.8%**.

D18-14 remains L2 until a dedicated chronological date-level walk-forward assembler consumes frozen attribution receipts with purge/holdout semantics.

FORMAL_OPTIMIZATION_CANDIDATE: NONE. Formal Core LOCKED.
