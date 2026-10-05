# D03 Interaction Search Genealogy / Rebin Firewall V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-749~820
Status: RESEARCH_ONLY / OUTCOME_CLOSED / SEARCH_GENEALOGY_FROZEN
Formal Core: LOCKED
Tickets: SDA-004 primary, SDA-001 secondary

## Purpose

Freeze how D03 accounts for interaction variants created by:
- threshold changes;
- horizon changes;
- parameter-window changes;
- discretization/rebinning;
- continuous-vs-categorical representation changes;
- lifecycle/state definition changes;
- support-driven redesign;
- outcome-driven redesign.

The goal is to prevent sparse support, weak results or failed variants from disappearing through renaming.

## TI-821 — every interaction research family has a search-universe identity

Before confirmatory outcome inspection, bind:
- interactionSearchFamilyId;
- local multipleTestingFamilyId;
- outer researchStreamId or EXPLORATORY_ONLY;
- component-pair identity;
- primary mechanism claim hash;
- allowed parameter/search axes;
- candidate birth rule;
- retirement rule;
- representation-change policy;
- support-only redesign policy;
- outcome-release boundary.

A new file name, module ID or experiment ID cannot create a fresh search universe.

## TI-822 — variant birth ledger is immutable

Every candidate variant receives:
- variantId;
- variantVersion;
- registeredAt;
- parentVariantRefs;
- birthReasonCode;
- candidateSource;
- supportDiagnosisRefsKnownAtBirth;
- priorOutcomeReleaseRefsKnownAtBirth;
- representationClass;
- formula/threshold/window/horizon identity;
- result state;
- retirement state.

Variants are append-only.
Failed, blocked, sparse, negative, inconclusive and retired variants remain visible.

## TI-823 — support-only redesign is allowed only under an outcome-blind boundary

A sparse-support finding can legitimately motivate redesign before target outcome access.

Allowed state:
`OUTCOME_BLIND_SUPPORT_REDESIGN`.

Requirements:
- outcomeAccessed=false;
- support diagnostics use predictor/design/admission information only;
- redesign lineage points to the sparse parent;
- new design is registered before any target outcome inspection;
- the redesign remains in the same interactionSearchFamilyId unless the economic mechanism itself changes;
- all tested child variants remain in local/outer multiplicity accounting when evaluated on outcomes.

This is not holdout consumption by itself, but it is not permission to erase the parent candidate.

## TI-824 — outcome-driven support repair is adaptive research

If threshold/rebin/window/representation changes occur after any target outcome release from the parent or sibling search family:
- state = OUTCOME_DRIVEN_REDESIGN;
- prior holdout is development-consumed;
- child cannot reuse that holdout as untouched validation;
- child inherits parent outcome-release lineage;
- fresh evidence is required for confirmation.

No "we only changed the bins because support was poor" exception exists once outcomes were already known.

## TI-825 — threshold lattice belongs to one family

For a fixed mechanism, variants such as:
- ADX > 20 / 25 / 30;
- Bollinger width quantiles 10% / 15% / 20%;
- band multipliers 1.5 / 2.0 / 2.5;
- volume RVOL 1.2 / 1.5 / 2.0;
- joint cells formed from nearby cutpoints

remain one search family.

Picking the threshold with:
- best effect;
- best support/effect compromise;
- best p-value;
- best Sharpe;
- best hit rate

after outcome access is model selection and must be accounted for.

## TI-826 — horizon lattice belongs to the search history

D5/D10/D20 or other outcome horizons cannot be used as independent retry buttons.

If all are registered, they belong to the declared multiplicity family.
If a new horizon is introduced after seeing another horizon's result, it is an adaptive child and inherits consumption.

A weak D5 interaction cannot be rescued by calling a favorable D20 result the new primary without a new family/fresh evidence boundary.

## TI-827 — parameter windows and smoothing axes cannot reset the family

Examples:
- Bollinger center window 20 vs 10/30/50;
- Bollinger dispersion estimator/window;
- ADX Wilder period 14 vs 7/21;
- DI/ADX smoothing alternatives;
- MA/EMA lookbacks feeding an interaction;
- participation lookbacks;
- intraday aggregation windows.

Searching these axes is part of the interaction candidate universe.
Changing a parameter-family label does not erase prior attempts.

## TI-828 — representation switches are explicit adaptive events

Switches among:
- categorical joint cells;
- continuous product/basis;
- mixed threshold-continuous;
- path/lifecycle state

must create a new variantVersion and preserve the same search-family ancestry when the mechanism is unchanged.

Before outcomes, an outcome-blind preregistered switch policy may be valid.
After outcomes, the switch is adaptive and old holdout evidence is consumed.

## TI-829 — rebinning cannot silently delete empty or losing cells

If a categorical interaction has sparse/zero cells:
- the original cell universe remains durable;
- a new binning scheme is a child variant;
- old zero cells remain in history;
- the new scheme cannot be described as if it had been the original ex-ante design.

This prevents "support laundering" by merging only inconvenient cells.

## TI-830 — support-quality selection is still candidate selection

Even if outcomes are never viewed, choosing among multiple variants based on:
- minimum cell N;
- balance;
- effective cluster count;
- leverage;
- positivity;
- weight concentration

changes which candidate reaches outcome testing.

This can be valid if the support-selection rule is frozen before outcomes.

The final tested candidate must record:
- supportSelectionPolicyHash;
- all candidates considered under that policy;
- deterministic selection criterion;
- tie-break rule.

If the rule itself is modified after seeing support results, create a new version of the search policy.

## TI-831 — winner selection cannot reuse the selection sample as untouched confirmation

If several interaction variants are evaluated on economic outcomes and one winner is selected:
- the selection period is development-consumed for the winner;
- ordinary effect estimate is selection-biased / winner's-curse exposed;
- promotion requires fresh post-selection evidence or a valid selective-inference design frozen in advance.

The preferred D03 governance path is fresh chronological evidence.

A winner cannot become "preregistered" retroactively.

## TI-832 — inner and outer multiplicity are separate

Local interaction-family correction does not prove whole-program error control.

Future confirmatory D03 interaction research must bind:
- local multipleTestingFamilyId;
- D16 researchStreamId;
- outer error objective or explicit EXPLORATORY_ONLY state.

A valid local family does not reset outer stream budget.

## TI-833 — adaptive hypothesis birth is allowed but must be labeled

A new mechanism inspired by a prior result is not automatically invalid.

It must record:
- parent hypothesis/result refs;
- what information was known at birth;
- whether the mechanism claim changed;
- whether it remains same search family or becomes a distinct new family;
- how outer-stream error/evidence budget treats it.

Adaptive science is allowed.
Adaptive science disguised as ex-ante confirmation is not.

## TI-834 — support-blocked variants still remain in the research ledger

A candidate that never reaches outcome testing because of:
- sparse cells;
- insufficient dates;
- dependence;
- data-quality block;
- continuity failure

remains in the variant ledger.

Its result state can be:
- INSUFFICIENT_SUPPORT;
- DATA_QUALITY_BLOCKED;
- METHOD_INCOMPATIBLE;
- RETIRED_PRE_OUTCOME.

It does not consume outcome evidence if no outcome was inspected, but it cannot disappear from the search genealogy.

## TI-835 — outcome-inspected variants can never be deleted from multiplicity history

Any variant with target outcome information exposure remains permanently counted in:
- local family history;
- outer research stream history;
- holdout consumption lineage.

Renaming, retirement, superseding or merging variants cannot turn inspected evidence back into unseen evidence.

## TI-836 — same mechanism aliases collapse for evidence but remain visible for search accounting

Product, ratio, AND, thresholded joint label or cosmetic normalization may be equivalent enough to share one canonical interaction mechanism family.

Evidence counting:
- aliases do not multiply effective evidence.

Search accounting:
- if multiple aliases were actually tried on outcomes, those attempts remain visible in the multiplicity/search ledger.

Deduplication of evidence must not become deletion of research attempts.

## TI-837 — confirmatory winner needs fresh post-selection support and outcome evidence

Before a winner can receive a third interaction unit:
- search genealogy complete;
- all inspected siblings retained;
- local multiplicity disposition complete;
- outer stream disposition complete or exploratory label retained;
- winner's selection period not mislabeled untouched;
- fresh support vector satisfies TI-803~820;
- fresh D16 interaction incrementality receipt passes;
- consumer scope matches;
- Room00 closure remains separate.

## TI-838 — current D03 decision

Frozen:
`INTERACTION_SEARCH_HISTORY = APPEND_ONLY_NO_RESET_NO_REBIN_LAUNDERING`.

This contract authorizes outcome-blind support-driven redesign before target outcome access, but forces complete lineage and later multiplicity accounting.

It prohibits outcome-driven threshold/horizon/rebin/representation changes from reusing the same holdout as fresh confirmation.

No current D03 interaction is promoted.

No maturity promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- outcomes remain CLOSED;
- Formal Core remains LOCKED;
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Exact next continuation point

1. Freeze machine-readable variant/search ledger schema and adversarial fixture.
2. Audit Bollinger and ADX parameter axes against this search genealogy without opening outcomes.
3. Bind future D03 confirmatory interaction families to D16 outer researchStreamId before first genuine outcome inspection.
4. Continue to distinguish evidence deduplication from multiplicity-attempt preservation.
