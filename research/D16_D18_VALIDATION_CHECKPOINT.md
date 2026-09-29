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

## Exact next continuation — revised
1. After the scheduled finalized-date audit exists, read the immutable acceptance state for 2026-09-29 and only then decide whether it increments Decision Clock promotion-grade date counts.
2. Continue Direction Breadth prospective occupancy / NOT_COMPARABLE / UNKNOWN design; no policy threshold.
3. Test state-dependent missingness before any coverage gate.
4. Keep Market Direction Breadth separate from Opportunity-Set Breadth.
5. Continue True Return Distribution PIT/continuity work independently.
6. Preserve the B2 X/not-comparable issue as shared-runtime falsification evidence; prepare governance-classified correction only if required.
