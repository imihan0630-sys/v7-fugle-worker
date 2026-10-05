# D03 Interaction Increment Evidence Accounting Guard V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Scope: SDA-001 / SDA-004 cross-root and nonlinear-composite evidence counting
Status: RESEARCH_ONLY / OUTCOME_CLOSED / INTERACTION_GUARD_FROZEN
Formal Core: LOCKED

## Purpose

Freeze when an interaction or nonlinear composite built from already-counted information roots may add one further effective evidence increment.

This contract distinguishes:
1. information-source independence; and
2. predictive interaction incrementality.

An interaction does not create a new information source. Even when its predictive increment is later proven, the number of independent information roots does not increase.

For a PRICE_OHLC root P and VOLUME_TURNOVER root V:
- independent information-root count can remain 2;
- a separately proven P×V interaction may contribute at most one additional residual interaction increment;
- the interaction may never be labelled INDEPENDENT_SOURCE_PROVEN merely because it improves prediction.

## TI-777 — source count and interaction increment are separate quantities

Machine accounting must expose at least:
- effectiveIndependentSourceRootCount;
- provenResidualMainEffectCount where applicable;
- provenInteractionIncrementCount;
- effectiveEvidenceCount.

For two separately accepted roots P and V with no accepted interaction:
- effectiveIndependentSourceRootCount = 2;
- provenInteractionIncrementCount = 0;
- effectiveEvidenceCount = 2.

If one preregistered P×V interaction later survives the full gate:
- effectiveIndependentSourceRootCount remains 2;
- provenInteractionIncrementCount = 1;
- effectiveEvidenceCount may become 3.

The third unit is an interaction increment, not a third source.

## TI-778 — interaction hierarchy for third-unit eligibility

This contract governs the path to a third effective unit after two component/root families are already accepted for the same consumer population.

A candidate interaction must bind:
- both component factor IDs and versions;
- both component information roots;
- exact component evidence-status receipts;
- interactionHypothesisId;
- interactionFamilyId;
- interactionVersion;
- transform/formula version;
- decision clock and firstObservableAt;
- common-support and joint-support identities;
- D16 method/incrementality receipts;
- multiplicity family;
- selection-identification disposition.

Interactions may be researched before both components graduate, but they cannot claim third-unit eligibility under this contract until the component bindings are valid.

## TI-779 — main-effects-complete comparator is mandatory

The interaction must be tested against a comparator that already contains both main effects.

A comparison against:
- price-only;
- volume-only;
- one component omitted;
- a weaker historical baseline

cannot prove interaction incrementality.

Primary null:
> the preregistered interaction adds no predictive/path-risk value beyond both component main effects plus the registered common controls.

## TI-780 — nonlinear marginal misspecification must not masquerade as interaction

A product/AND/ratio/joint-state term may appear useful merely because the additive main-effect baseline is too rigid.

Therefore the D16 method receipt must either:
1. include a preregistered flexible marginal/main-effect control appropriate to the component semantics; or
2. justify why the frozen main-effect representation is already the intended estimand and cannot absorb the apparent interaction.

The exact statistical representation belongs to D16. D03 freezes only the requirement.

A result that disappears after adequate marginal controls is:
`MAIN_EFFECT_MISSPECIFICATION_NOT_INTERACTION`.

No interaction increment is granted.

## TI-781 — representation family cannot multiply interaction votes

The following representations of the same component pair/mechanism belong to one interaction experiment family unless preregistered otherwise:
- product;
- logical AND;
- ratio;
- thresholded joint state;
- quadrant/cell label;
- percentile interaction;
- z-score interaction;
- sign interaction;
- crossover/acceptance label derived from the same joint primitives.

Renaming or reparameterizing the same pair cannot reset multiplicity or create another evidence unit.

## TI-782 — maximum one increment per frozen interaction family

For one component-pair mechanism family:
- multiple successful parameterizations do not create multiple increments;
- aliases and monotone/cosmetic transforms do not create increments;
- the maximum contribution of the family to provenInteractionIncrementCount is 1.

A second interaction increment requires a distinct preregistered mechanism family with non-duplicative primitive/parent lineage and its own D16 multiplicity accounting. Merely changing thresholds, windows or algebraic form is insufficient.

## TI-783 — joint-support / positivity is stricter than marginal support

Both component families may individually have adequate support while their joint state is sparse.

Interaction graduation requires:
- exact identical common support across baseline and challenger;
- joint-state or interaction-design support diagnostics;
- no zero/near-zero cell or region being repaired by extreme weights and then treated as identified;
- selection-identification rules from TI-769~776.

Marginal positivity does not imply joint positivity.

If joint support is inadequate:
`INTERACTION_JOINT_SUPPORT_INSUFFICIENT`
and interaction increment = 0.

## TI-784 — clock is the maximum component observability clock

An interaction cannot be known before all of its required components are known.

Required:
`interactionFirstObservableAt >= max(componentFirstObservableAt)`.

For cross-timeframe components, timeframe-specific finality remains binding.

Any interaction computed with one component's final state before that component was observable fails PIT and cannot enter the research evidence count.

## TI-785 — selection scope of the interaction cannot exceed its proof scope

The interaction receipt must inherit or explicitly reconcile:
- target-population/admitted population;
- restricted-support rule;
- admission lineage;
- positivity/overlap state;
- evaluation cutoff;
- weighting/imputation contract.

An interaction proven only on a restricted or observed subpopulation cannot become a global third unit.

If interaction and main effects use different population/support definitions, the third-unit claim is blocked.

## TI-786 — multiplicity family includes mechanism and parameter search

The interaction multiplicity ledger must include, where searched:
- component pair;
- direction/sign;
- product/ratio/AND/joint-cell representation;
- thresholds;
- windows/horizons;
- smoothing/normalization;
- acceptance/retest lifecycle encoding;
- outcome horizon;
- regime/context subgroup;
- selection/cost assumptions.

Failed/null/inconclusive variants stay in history.

A favorable representation cannot be selected after holdout inspection and then declared the preregistered mechanism.

## TI-787 — negative controls / falsifiers are mandatory

An accepted interaction must survive relevant falsifiers, including:
- both-main-effects baseline;
- flexible-main-effects sensitivity where applicable;
- date-aware dependence inference;
- leave-one-date sensitivity;
- regime/industry/liquidity concentration;
- shuffled/permuted component relation inside PIT-safe blocks where statistically valid;
- coverage/zero-pick/opportunity-loss checks;
- cost/fillability stress if the interaction changes tradable selection.

If the apparent gain is explained by lower exposure, favorable missingness or one date/episode:
interaction increment = 0.

## TI-788 — replacement/cap/residualization policy must be explicit

A consumer must declare how components and interaction combine.

Allowed research accounting policy in V0.1:
`MAIN_EFFECTS_PLUS_ONE_RESIDUAL_INTERACTION_CAP`.

Meaning:
- accepted main-effect families retain their existing units;
- one accepted residual interaction family may add at most +1;
- parent composite representations add +0;
- duplicated interaction labels add +0.

Silent component replacement or triple-counting by a composite is forbidden.

Alternative replacement policies require a new preregistered contract and cannot be inferred from this guard.

## TI-789 — interaction is not an independent-source label

Even after full proof:
- allowed state = `RESIDUAL_INTERACTION_INCREMENT_PROVEN`;
- forbidden state = `INDEPENDENT_SOURCE_PROVEN` for the interaction itself.

The underlying independent source roots remain the component roots.

This prevents ontology inflation where every useful nonlinear transform becomes a new "information source."

## TI-790 — parent/composite and interaction cannot both claim the same increment

If a PRICE_VOLUME composite already embeds P×V behavior and a separately named interaction child is tested:
- the composite stays representation/explanation unless separately decomposed;
- the accepted interaction increment belongs to one canonical interactionFamilyId;
- parent composite + child interaction cannot each add +1 for the same mechanism.

The same rule applies to Bollinger location×width, ADX direction×range, oscillator×trend, and nested-timeframe agreement composites.

## TI-791 — proof invalidation is strict

Any material drift in:
- component version;
- component evidence-status receipt;
- interaction formula/version;
- main-effect baseline;
- flexible marginal control;
- common/joint support;
- decision clock;
- D16 method receipt;
- multiplicity family;
- selection-identification scope;
- outcome family;
- cost/fillability contract

requires interaction proof revalidation.

Old interaction credit cannot be inherited across changed semantics.

## TI-792 — interaction evidence is consumer-scope bound

A proven interaction increment is valid only for a consumer whose:
- component versions match;
- population/support scope matches;
- decision clock matches;
- interaction mechanism/version matches.

A restricted-support interaction cannot be exported to unrestricted System 1/System 2 ranking.
A daily interaction cannot be silently reused intraday.
A research-only interaction cannot mutate Formal ranking without owner-gated approval.

## TI-793 — deterministic accounting expectations

The machine fixture must prove at least:
1. two proven roots without interaction => source roots 2 / interaction 0 / effective evidence 2;
2. valid proven interaction => source roots 2 / interaction 1 / effective evidence 3;
3. duplicate aliases of the same interaction family => still effective evidence 3;
4. interaction without both component bindings => no third unit;
5. weak/one-sided baseline => reject;
6. marginal-control insufficiency => reject or block;
7. joint-support failure => no third unit;
8. observed-subpopulation-only proof => no global third unit;
9. restricted-support consumer mismatch => no third unit;
10. PIT clock violation => reject;
11. multiplicity-family reset => reject;
12. post-outcome parameter retuning => reject;
13. interaction labelled independent source => reject;
14. stale component/baseline/method binding => revalidation required.

## TI-794 — current decision and routing

Frozen decision:
`INTERACTION_THIRD_UNIT = PREREGISTERED_RESIDUAL_INCREMENT_ONLY`.

No current interaction is empirically promoted by this contract.

Current evidence-accounting ceiling examples:
- two accepted roots, no interaction proof => 2;
- two accepted roots + one fully proven canonical interaction family => at most 3;
- two accepted roots + five aliases/parameterizations of the same interaction family => still at most 3.

No maturity promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw source-version gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

## Exact next continuation point

1. Freeze the machine-readable interaction receipt and deterministic acceptance fixture.
2. Keep source-root count separate from interaction-increment count.
3. D16 future interaction receipt must bind both main-effect receipts, joint support, flexible-main-effect control decision, multiplicity and selection-identification.
4. System1/System2 consumers may display raw interactions but must not count a third unit before this receipt passes.
5. After fixture freeze, D03 reviews whether existing Bollinger/ADX/price-volume composite contracts require only mapping addenda rather than redesign.
