# D02 L4 Effect-Target Derivation Readiness Matrix V0.1

Updated: 2026-10-05 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / PARTIAL_TARGET_SHELL_FREEZE / NUMERICAL_VALUES_PENDING
Evidence cursor: PVE-239
Formal Core impact: NONE

## Research conclusion

A repository-wide audit does not support inventing one universal numerical MDE or precision bound for all D02 evidence keys.

External methodological guidance is consistent with this rule:
a smallest effect size of interest should be justified by theory, practical consequence or cost-benefit considerations and fixed before results; generic benchmark effect sizes are a weak justification.

D14 Trading Frictions further makes a universal after-cost threshold impossible today:
- Taiwan sell-side tax semantics are known;
- broker commission/minimum fee is account-specific;
- slippage/implementation shortfall requires actual decision/fill/quote provenance;
- missing commission or slippage may remain UNKNOWN rather than zero.

Therefore this pass freezes the *derivation shell* for each evidence key and explicitly leaves unsupported numerical values pending.

## What is frozen now

For every evidence key this matrix records:
- primary research question;
- primary comparator family;
- currently registered outcome family;
- currently legal horizon family/bound;
- cost-treatment dependency;
- which target components are already stable;
- which components are still unresolved;
- exact reason numerical freeze is blocked;
- owner/dependency needed to close it.

This is not a complete EffectTargetReceipt.
Promotion-grade D16 validation remains blocked until the relevant numerical target is legitimately frozen.

## Readiness matrix

### 1. D02-01:SEMANTIC_GOVERNANCE
- target kind: SEMANTIC_MATERIALITY_TARGET
- primary question: Does frozen unit/session/corporate-action governance materially prevent false classification?
- comparator: GOVERNED_CLASSIFICATION vs UNGOVERNED_FROZEN_COUNTERFACTUAL
- registered outcomes: classificationDelta; materialPreventionCandidate
- horizon state: same decision receipt
- cost treatment: NOT_AN_ALPHA_ESTIMAND
- ready components: estimand; comparator; outcome family; horizon; cost treatment
- pending components: numerical semantic tolerance
- blocker: No formal acceptable false-classification/material-prevention tolerance is frozen.
- required owner/dependency action: D02 owner must justify semantic materiality from governance consequence, not from observed incidence.

### 2. D02-02:H001
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does same-slot RVOL add incremental discrimination beyond local previous-five volume ratio?
- comparator: C vs B
- registered outcomes: false/no-follow-through; MFE; MAE; future return
- horizon state: B1/B2/B4 where applicable; D1 secondary
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: estimand family; comparator; admission support
- pending components: single primary outcome metric; single primary horizon; numerical target; cost-benefit anchor
- blocker: Multiple registered outcomes remain; choosing one after outcomes would be test shopping.
- required owner/dependency action: D02 must freeze one primary outcome/horizon pre-outcome; D14 supplies cost context if economic.

### 3. D02-03:H20
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does same-slot RVOL improve D01-owned breakout quality beyond local volume ratio?
- comparator: C vs B on identical D01 breakout events
- registered outcomes: false/no-follow-through; MFE; MAE; structural acceptance/failure
- horizon state: B1/B2/B4; D1 secondary
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: primitive event owner; comparator; negative cases
- pending components: single primary outcome metric; single primary horizon; numerical target; economic utility anchor
- blocker: Breakout quality has several valid outcomes; no single decision-value target is canonical yet.
- required owner/dependency action: D02+D01 must keep event identity fixed; D02 freezes one outcome/horizon; D14 cost context later.

### 4. D02-04:DRYUP
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does pre-outcome low participation improve later setup quality beyond consolidation/volatility/liquidity?
- comparator: DRYUP candidate vs identical-support controls without D02 dry-up increment
- registered outcomes: later demand re-expansion; future path quality; MFE/MAE
- horizon state: not yet singularly frozen
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: feature identity; required controls; hindsight prohibition
- pending components: primary outcome metric; primary horizon; numeric target
- blocker: Setup quality is conceptually frozen but not reduced to one primary metric/horizon.
- required owner/dependency action: D02 must freeze target shell before outcome access; D16 owns adequacy thereafter.

### 5. D02-05:EXTREME_PARTICIPATION
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does extreme participation × price response add stable path information after controls?
- comparator: controlled response model with vs without extreme-participation interaction
- registered outcomes: future path; MFE; MAE; failure/continuation
- horizon state: not yet singularly frozen
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: observable construct; forbidden motive labels; control set
- pending components: primary metric; horizon; numeric target
- blocker: No directional sign is assumed; a single promotion estimand is not yet frozen.
- required owner/dependency action: D02 must choose a non-motive path metric/horizon before any outcome inspection.

### 6. D02-06:H003
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does PRICE_PLUS_VOLUME_RESPONSE discriminate future outcomes beyond PRICE_ONLY_RESPONSE?
- comparator: PV vs P identical rows
- registered outcomes: future discrimination; acceptance/failure; MFE; MAE
- horizon state: future-only after feature bar; exact primary horizon not singularly frozen
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: comparator; anti-circular clock; clean-event counter
- pending components: primary discrimination metric; primary horizon; numeric target
- blocker: Representation incrementality is frozen, but the promotion-grade discrimination metric is not.
- required owner/dependency action: D02 freezes one metric/horizon; D16 evaluates dependence-aware improvement.

### 7. D02-07:SVB20
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does signedVolumeBalance20 add residual information beyond price, direct volume and PV response states?
- comparator: D vs C
- registered outcomes: future return/path; MFE; MAE
- horizon state: D1/D3/D5/D10 eligible family; no single primary
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: canonical comparator; anti-duplicate rule; common-support sequence
- pending components: primary outcome; primary horizon; numeric target
- blocker: SVB residual value is defined, but no single promotion metric/horizon is frozen.
- required owner/dependency action: D02 must not let CMF/OBV variants select the target ex post.

### 8. D02-08:PROVIDER_PRESSURE
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does providerTradePressureProxy add value beyond OHLCV/RVOL/response after coverage and liquidity controls?
- comparator: baseline controls vs baseline + provider pressure proxy
- registered outcomes: future path discrimination; MFE; MAE
- horizon state: intraday/future path not singularly frozen
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: proxy semantics; coverage variable; liquidity controls; intent prohibition
- pending components: primary metric; primary horizon; numeric target
- blocker: Independent source exists, but no single promotion outcome/horizon is canonical.
- required owner/dependency action: D02 must freeze an observable predictive estimand, never participant intent.

### 9. D02-09:PIVOT_SIGNED_VOLUME
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does pivot signed-volume disagreement add value beyond price pivot progression and primitive volume controls?
- comparator: typed divergence model vs primitive price+volume model
- registered outcomes: post-confirmation future path; MFE; MAE
- horizon state: post-confirmedAt; no single primary horizon
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: typed family; pivot clock; anti-cherry-pick rules
- pending components: primary metric; primary horizon; numeric target
- blocker: Confirmation-lag-safe outcome family exists but single decision horizon is not frozen.
- required owner/dependency action: D02 must freeze horizon after confirmedAt and keep pivot scale fixed.

### 10. D02-09:PARTICIPATION_TRAJECTORY
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does participation-trajectory disagreement add value beyond price progression + current participation?
- comparator: C vs B in typed trajectory sequence
- registered outcomes: future path; MFE; MAE
- horizon state: not yet singularly frozen
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: typed family; primitive controls
- pending components: primary metric; primary horizon; numeric target
- blocker: Relational transform is frozen; promotion outcome is not singularly frozen.
- required owner/dependency action: D02 must not borrow the pivot-family target.

### 11. D02-10:TREND_VOLUME_INTERACTION
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does explicit trend × participation interaction add residual information beyond both parents?
- comparator: D vs C
- registered outcomes: future path discrimination; MFE; MAE
- horizon state: not yet singularly frozen
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: parent ownership; interaction clock; D-vs-C comparator
- pending components: primary metric; primary horizon; numeric target
- blocker: Residual interaction question is clear, but promotion metric/horizon is not.
- required owner/dependency action: D02 freezes target shell; D03 parent semantics remain unchanged.

### 12. D02-11:LIQUIDITY_COUNTERFACTUAL
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does volume-capacity context improve eligibility/risk classification using admitted + reason-stratified rejected controls?
- comparator: ADMITTED vs LIQUIDITY_REJECTED_CONTROL within frozen reason strata
- registered outcomes: execution cost; spread/depth; opportunity cost; future return
- horizon state: execution horizon / D1+ not singularly frozen
- cost treatment: D14_EXECUTION_COST_RECEIPT_REQUIRED_FOR_ECONOMIC_TARGET
- ready components: counterfactual lane; reason stratification; no threshold sweep
- pending components: primary utility metric; cost provenance; primary horizon; numeric target
- blocker: Economic meaning depends directly on execution-cost/opportunity-cost tradeoff; D14 cost inputs are incomplete/UNKNOWN for universal use.
- required owner/dependency action: D14 must provide cost-quality-aware anchor; D02 must not infer universal commission/slippage.

### 13. D02-12:TIME_OF_DAY_VOLUME_CURVE
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does bounded 09:00–13:00 time-of-day volume shape add value beyond same-slot RVOL/cumulative pace/price location?
- comparator: controls vs controls + time-curve shape
- registered outcomes: future path discrimination; MFE; MAE
- horizon state: within observed intraday window; no single primary
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: family identity; coverage bound; controls
- pending components: primary metric; primary horizon; numeric target
- blocker: Current monitor is bounded and no singular promotion outcome is frozen.
- required owner/dependency action: D02 must keep full-session claims out until source coverage exists.

### 14. D02-12:PRICE_BY_VOLUME_PROFILE
- target kind: MDE_OR_PRECISION_TARGET
- primary question: Does prospectively captured price-by-volume profile add value beyond RVOL/pace/price-location controls?
- comparator: controls vs controls + price-by-volume profile
- registered outcomes: future path discrimination; MFE; MAE
- horizon state: prospective current-day onward; no single primary
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- ready components: family identity; prospective-only constraint; controls
- pending components: primary metric; primary horizon; numeric target
- blocker: No historical backfill and no singular promotion metric/horizon are available yet.
- required owner/dependency action: D02 must freeze a prospective target before enough data accumulate.


## Cross-key findings

1. D02-01 is not an alpha target. Its missing numerical object is a semantic materiality tolerance, not return.
2. Wave-1 H001/H20/H003 has the strongest comparator and event governance, but still has multiple valid registered outcomes. Choosing the winner after outcomes is forbidden.
3. D02-07/09 have unusually strong anti-redundancy semantics, but not a singular promotion-grade outcome/horizon.
4. D02-11 is the most explicitly D14-dependent target because its claim is about the tradeoff between executability protection and rejected opportunity.
5. D02-08 cannot use any hidden-actor/OFI target.
6. D02-12 time-curve and price-by-volume profile must keep separate targets.
7. No evidence key may inherit a numerical target from another key merely because both live in the same multiple-testing family.

## Target-value freeze policy

A numerical target may move from TARGET_VALUE_PENDING_FREEZE to FROZEN only when:
- its primary estimand is singular;
- primary metric is singular;
- primary horizon is singular;
- comparator is singular;
- cost treatment is singular and sufficiently evidenced for the claim;
- rationale is independent of observed D02 outcomes;
- target value is justified by a decision consequence, cost-benefit anchor, theoretical bound, prior independent evidence, or an explicitly justified precision requirement;
- target ID/version/hash are generated before outcome access.

If these conditions are not satisfied, pending is the correct state.

## Immediate next research order

1. Freeze *primary outcome metric + primary horizon* for Wave-1 H001/H20/H003 first because their comparator/event definitions are already strongest.
2. Build D14 dependency receipts for D02-11 before attempting a numerical economic target.
3. Freeze D02-01 semantic materiality policy separately from alpha work.
4. Only then derive numeric MDE/precision values; do not start from an arbitrary bps or percentage-point benchmark.

## Current state

D02 maturity = 60.0%.
PVE cursor = 239.
CLEAN_DATE_ZERO.
Gate 7 CLOSED.
14/14 numerical target values remain pending.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.
