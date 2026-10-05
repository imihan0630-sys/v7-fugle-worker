# D03 Interaction Negative-Control / Permutation Falsification Oracle V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-749~852
Status: RESEARCH_ONLY / OUTCOME_CLOSED / NEGATIVE_CONTROL_ORACLE_FROZEN
Formal Core: LOCKED
Tickets: SDA-001 / SDA-004
D16 dependency: D16-06 dependence-aware inference + SDA-016 consumption / outer research stream

## Purpose

Freeze what constitutes a valid falsification/null reference for a claimed technical-indicator interaction.

A useful falsifier must break the claimed incremental relation while preserving enough of the real data-generating structure that the null is not artificially easy.

The null generator is itself part of the confirmatory method and cannot be chosen after seeing which null makes the observed interaction look strongest.

## TI-853 — every falsifier must state the exact null it represents

Required:
- falsifierFamilyId;
- falsifierVersion;
- targetInteractionFamilyId/version;
- nullClaimHash;
- preservedStructureHash;
- deliberatelyBrokenRelationHash;
- conditioningSetHash;
- representationClass;
- consumerScopeHash;
- decisionClock;
- outcomeHorizon;
- preregistrationHash.

A generic label such as "permutation placebo" is insufficient.

## TI-854 — primary null is residual interaction absence, not full independence

For a third-unit interaction claim, the relevant null is normally:

> after preserving both main effects and registered controls, the claimed interaction adds no incremental predictive/path-risk value.

Destroying all relation between the component, controls and market state tests a much stronger/easier null and can give false reassurance.

The falsifier must be aligned with the estimand in TI-777~794.

## TI-855 — naive row-wise shuffling is forbidden by default

Randomly shuffling stock rows across dates can destroy:
- same-date market shocks;
- sector/industry composition;
- regime/state composition;
- serial dependence;
- cross-sectional dependence;
- repeated-symbol structure;
- admission/support structure.

Therefore naive row-wise shuffling cannot be promotion-grade evidence unless D16 explicitly proves exchangeability for the exact unit being shuffled.

Current default:
`NAIVE_ROW_SHUFFLE = INVALID_REFERENCE_NULL`.

## TI-856 — exchangeability is a required proof obligation

Permutation exactness requires an appropriate randomization/exchangeability hypothesis.

When exchangeability is absent but weak dependence is modeled, only a D16-approved asymptotically valid/studentized or dependence-aware permutation procedure may be used.

Method name alone does not establish validity.

The receipt must state:
- permutation unit;
- exchangeability group/block;
- why permutations are legal under the null;
- whether validity is exact, asymptotic or heuristic.

## TI-857 — decision-date panels should remain intact when date shocks are nuisance structure

If the claim is cross-sectional and same-date common shocks are not the object being broken:
- keep the decision-date panel identity;
- do not separate a stock row from the date-level environment without justification;
- preserve date weighting and admission denominator.

A whole-date panel may be the unit for temporal resampling when the D16 method calls for it.

## TI-858 — conditioning variables must be decision-time legitimate

Conditional permutation/randomization controls may include only information legally known for the tested estimand at the relevant clock.

No future regime label, realized persistence, future liquidity, matured outcome or ex-post survivor state may enter the conditioning set.

A statistically sophisticated conditional null with future information still fails PIT.

## TI-859 — conditional permutation/randomization is model-dependent

A conditional permutation/randomization test aims to break X-Y association conditional on Z while preserving the X-Z relation.

Promotion-grade use requires:
- explicit X|Z conditional-distribution/sampler identity;
- sampler training cutoff;
- predictor set;
- validation/misspecification diagnostics;
- no target-outcome-driven sampler tuning;
- support checks for generated/permuted X.

If the conditional model is materially misspecified:
`CONDITIONAL_NULL_MODEL_UNRELIABLE`.

No interaction pass may rely solely on it.

## TI-860 — conditional sampler training is outcome-blind

Preferred sources:
- separate predictor-only/unlabeled historical data under the same source semantics; or
- a preregistered cross-fitting scheme that does not use target economic outcomes to choose the conditional sampler.

The sampler cannot be selected from several candidates by which one gives the most favorable interaction p-value.

Sampler-family search belongs to the search genealogy.

## TI-861 — derived technical fields cannot be independently shuffled if algebraically/path coupled

If two components are deterministic descendants of the same primitive path:
- shuffling one descendant while freezing the other may generate states that no valid primitive history can produce;
- such off-manifold pseudo-data are not a valid primary falsifier.

This applies directly to:
- Bollinger location and width from the same close window;
- DMI/ADX direction and TR/range from the same H/L/C path;
- MA slope and return features from the same price path;
- nested timeframe descendants sharing the same underlying bars.

## TI-862 — lineage-consistent surrogate generation is preferred

When feasible:
1. perturb/resample at the earliest valid primitive/root layer;
2. preserve declared nuisance structure;
3. recompute all downstream descendants through the frozen factor DAG;
4. reapply continuity, PIT and formula-version checks.

Every surrogate receives:
- primitiveSurrogateId;
- source/root lineage;
- descendantRecomputeReceiptHash;
- continuityDisposition;
- supportDisposition.

Derived-field cut-and-paste without descendant recomputation is rejected where deterministic lineage would be broken.

## TI-863 — mixed-root interaction may conditionally resample one root

For a PRICE_OHLC × VOLUME_TURNOVER interaction, a candidate falsifier may:
- keep the price path and decision-time context fixed;
- resample/permutate the volume root conditional on registered price/context/liquidity/sector/regime controls;
- recompute all volume-derived descendants;
- recompute the interaction.

This is valid only if the conditional null model is itself admissible.

It is not a blanket authorization to shuffle raw volume across arbitrary symbols/dates.

## TI-864 — same-root interactions need path-level or residualized methods

For same-root interactions such as:
- Bollinger location × width;
- ADX direction × range;

there may be no meaningful independent component permutation.

D16 must choose a null method consistent with the shared primitive path, such as:
- a valid path-level surrogate under a stated null;
- a residualized/statistical interaction test with dependence-aware inference;
- another explicitly justified method.

State `NO_VALID_COMPONENTWISE_PERMUTATION` is an acceptable scientific conclusion.

## TI-865 — time-shift/cyclic-shift placebo has a narrow null

Temporal shifts may test alignment-specific hypotheses, but they are not automatically valid for nonstationary market data.

Required:
- stationary/segment assumption or explicit break-aware scheme;
- no wrap-around across source/version/continuity breaks unless justified;
- preserved session calendar semantics;
- no future information in live-feature construction.

A cyclic shift that preserves a marginal autocorrelation but destroys regime/nonstationary structure can be an invalid easy null.

## TI-866 — Fourier/phase surrogate methods are null-specific diagnostics, not a default

Phase-randomized / amplitude-adjusted surrogate families may preserve selected linear correlation/amplitude properties while destroying higher-order temporal structure.

They are allowed only when:
- the null being tested matches those preserved/destroyed properties;
- stationarity/nonstationarity assumptions are explicit;
- surrogate diagnostics verify the intended properties.

They cannot become a generic "nonlinearity proven" button for Taiwan-stock interaction evidence.

## TI-867 — sign-flip tests require symmetry, not convenience

Sign-flip/random-sign nulls require an appropriate symmetry assumption for the residual/test unit.

Returns, volumes, technical states or path effects are not automatically sign-symmetric.

Without a D16 method proof:
`SIGN_FLIP_NULL_NOT_JUSTIFIED`.

## TI-868 — pseudo-feature negative controls must be mechanism-matched

A pseudo interaction may be created from a non-causal/non-target component only if:
- it is matched on source timing, missingness, support and scale as appropriate;
- it does not leak target outcome information;
- its family was fixed before outcome interpretation.

A trivially noisy pseudo-feature that is much easier to beat is weak falsification evidence.

## TI-869 — placebo clocks test leakage, not alpha by themselves

Useful clock placebos include:
- deliberately lagged versions known safely before decision;
- forbidden lead/future sentinels that the pipeline must reject;
- timestamp-shift tests for accidental after-cutoff ingestion.

A future sentinel becoming predictive is a leakage alarm, not a candidate signal.

It must never enter Formal ranking.

## TI-870 — the full allowed modeling pipeline must be replayed inside the null

If the observed interaction statistic is produced by:
- fitting;
- tuning;
- threshold selection;
- candidate filtering;
- ranking;
- winner selection;

the null reference must replay the same preregistered allowed pipeline inside each null draw whenever the inferential target is the final selected result.

Holding the selected model fixed while the observed side benefited from search understates the null selection effect.

## TI-871 — winner/max-statistic null must reflect the same candidate universe

If the observed research result is the best among K candidate variants:
- null draws must apply the same K-candidate selection rule or an equivalent multiplicity-valid method;
- compare the observed selected statistic to the selected/max null statistic, not to the null of only the winning variant.

This links negative controls to TI-821~852 search genealogy.

## TI-872 — null generation may not mutate the candidate family

The candidate-set hash, support-selection policy, ranking metric and tie-break rule used inside null resamples must match the observed analysis.

Dropping inconvenient variants from the null or adding extra variants only to the observed side is invalid.

## TI-873 — cross-sectional nuisance structure must be preserved or explicitly modeled

For market-wide claims, preserve or model relevant:
- date;
- sector/industry;
- market regime;
- size/liquidity;
- exchange/listing board;
- tick/price-limit environment;
- repeated-symbol history.

The exact conditioning/block set belongs to D16 and must be frozen pre-outcome.

Over-conditioning on descendants of the target interaction or outcome-mediated variables is also forbidden.

## TI-874 — market-mechanics constraints survive surrogate generation

Null/surrogate data must respect applicable mechanical constraints:
- nonnegative volume/turnover;
- H >= L and valid close placement where primitive H/L/C is generated;
- Taiwan session/calendar identity;
- price-limit/halt/resumption states;
- corporate-action continuity;
- source/version semantics.

An impossible synthetic market state is not automatically informative just because the model performs worse on it.

## TI-875 — support/admission policy is common between observed and null arms

The null arm cannot receive easier/harder admission semantics than the observed arm.

Required:
- same target population;
- same admissibility rules;
- same missingness handling;
- same support floor;
- same cost/fillability contract where applicable.

If null generation changes which observations are admissible, the receipt reports that denominator shift explicitly and may fail closed.

## TI-876 — trading consequence must be recomputed when the interaction changes selection

If the interaction affects stock ranking/selection/entry timing:
- replay the same selection rule under each admissible null draw;
- recompute turnover/exposure/cost/fillability where they are part of the estimand;
- do not compare a searched tradable observed strategy to a static feature-only null.

This prevents "predictive statistic passes, trading implementation ignored" falsification.

## TI-877 — Monte Carlo permutation p-values are discrete and never zero

For random permutation/simulation draws:
- record requested and realized replication counts;
- use a valid finite-M p-value convention;
- zero p-values are forbidden;
- random seed / RNG algorithm / sampler version are durable.

For a standard Monte Carlo rank construction, the +1 form
`p=(1+exceedanceCount)/(1+M)`
is the default candidate unless D16 freezes another valid method.

No universal M is frozen by D03.

## TI-878 — Monte Carlo resolution/precision must be preregistered

Before target outcome interpretation, D16 freezes:
- replication-count rule;
- minimum attainable p-value/resolution;
- Monte Carlo precision requirement;
- adaptive stopping rule if any;
- tail-approximation method if any.

Running more permutations only because the current p-value is "almost significant" is outcome-adaptive unless covered by the frozen sequential Monte Carlo rule.

## TI-879 — falsifier family itself is multiplicity-governed

A confirmatory interaction must preregister:
- primary falsifier;
- secondary sensitivity falsifiers;
- interpretation rule when they disagree.

Trying many null generators and reporting only the one most favorable to the interaction is forbidden.

Each outcome-informed falsifier change enters the research/search history.

## TI-880 — disagreement among valid falsifiers yields uncertainty, not cherry-picking

If two admissible falsifiers target materially different nulls and disagree:
- report the null-specific conclusions;
- do not average or select the favorable one;
- narrow the scientific claim if possible;
- otherwise use `FALSIFIER_DISAGREEMENT_UNRESOLVED`.

A third interaction evidence unit cannot be granted from unresolved primary-falsifier disagreement.

## TI-881 — falsifiers cannot replace OOS/prospective validation

Passing negative controls can reject some artifact explanations.

It does not by itself establish:
- economic usefulness;
- stability;
- target-population incrementality;
- future performance.

The third-unit path still requires the full TI-749~852 prospective/OOS and selection/multiplicity gates.

## TI-882 — falsifier must share the observed analysis clock

The observed and null pipelines use the same:
- decision cutoff;
- firstObservableAt semantics;
- data-release clock;
- source/version availability;
- training/holdout chronology.

A null built from later-revised or more complete data than the observed arm is not a fair reference.

## TI-883 — leakage sentinels are mandatory for high-risk pipelines

Where a research pipeline involves complicated joins, revisions or multi-timeframe states, include at least one deterministic leakage sentinel:
- future-only variable must be rejected;
- after-cutoff row must be rejected;
- revised-after-decision state must be rejected.

A pipeline that accepts the sentinel cannot produce promotion-grade falsification evidence.

## TI-884 — null generator validation is separate from interaction validation

Before using a null generator, validate that it actually preserves the declared nuisance structure and breaks the declared target relation.

Required diagnostics may include:
- marginal distribution distance;
- autocorrelation/spectral diagnostics;
- date/sector/regime composition;
- support/positivity;
- lineage/mechanical validity;
- target-relation break diagnostic.

A null generator can fail even if the observed interaction appears strong against it.

## TI-885 — null-generator selection sample cannot double as interaction confirmation

If multiple null generators are compared/tuned using the same target outcome and one is selected:
- the sample is development-consumed for the null-method choice;
- future confirmation requires fresh evidence or a preregistered selective method.

Null-method optimization is still method selection.

## TI-886 — external-method anchor interpretation

Methodology reviewed for this tranche supports the following boundaries:
- ordinary permutation requires exchangeability/randomization validity; weakly dependent time-series settings require carefully justified/studentized procedures;
- conditional permutation/randomization preserves X-Z structure only under an adequate conditional X|Z model and can inflate error under misspecification;
- block/exchangeability structures are needed when observations are not freely exchangeable;
- surrogate time-series methods are null-specific and can themselves fail to preserve intended dependence;
- finite Monte Carlo permutation p-values have discrete resolution and should not be reported as zero.

These anchors constrain methodology but do not prove any Taiwan-stock interaction alpha.

## TI-887 — canonical falsifier hierarchy

For future D03 interaction claims:

Tier 0 — software/PIT sentinels
- future-clock rejection;
- lineage/formula integrity;
- impossible-state rejection.

Tier 1 — outcome-blind null-generator validation
- preserved nuisance structure;
- broken target relation;
- support/mechanical validity.

Tier 2 — primary preregistered interaction falsifier
- method matched to interaction lineage and representation.

Tier 3 — secondary sensitivity falsifiers
- alternative admissible nulls with frozen interpretation.

Tier 4 — full-pipeline null replay
- same search/winner/cost logic inside null draws.

Tier 5 — fresh OOS/prospective confirmation
- still mandatory for third-unit review.

Skipping directly to a p-value without Tier 0/1 is not promotion-grade.

## TI-888 — current decision

Frozen:
`INTERACTION_FALSIFICATION = LINEAGE_CONSISTENT_DEPENDENCE_PRESERVING_PREREGISTERED_NULLS`.

Explicitly rejected as defaults:
- naive row shuffle;
- arbitrary derived-field shuffle;
- unvalidated cyclic shift;
- unvalidated sign flip;
- null-generator shopping;
- fixed-winner null after observed-side candidate search.

No current D03 interaction passes this oracle because no target outcomes are opened.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw source gate remains 2/3;
- outcomes remain CLOSED;
- Formal Core remains LOCKED;
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Exact next continuation point

1. Freeze machine-readable null-generator/falsifier receipt schema and deterministic adversarial fixture.
2. Create indicator-specific falsifier mapping for Bollinger location×width, ADX direction×range and mixed-root price×volume interactions.
3. Freeze the pipeline-level max/winner null replay contract so search multiplicity is represented inside each null draw.
4. Do not open economic outcomes.
