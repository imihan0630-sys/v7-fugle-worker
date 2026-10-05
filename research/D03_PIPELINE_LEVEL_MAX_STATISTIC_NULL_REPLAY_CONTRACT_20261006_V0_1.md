# D03 Pipeline-Level Max/Selected-Statistic Null Replay Contract V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-821~904
Status: RESEARCH_ONLY / OUTCOME_CLOSED / PIPELINE_NULL_CONTRACT_FROZEN
Formal Core: LOCKED

## Purpose

Prevent an observed-side search advantage from being omitted from the null distribution.

## TI-905 — inferential target determines whether full search must be replayed

If the target claim concerns a factor/interaction fixed before any target-outcome access, a fixed-candidate null may be admissible subject to D16.

If the target claim concerns:
- a selected winner;
- a tuned threshold/window;
- the best horizon;
- the best representation;
- a final ranked strategy after candidate filtering;

the null must account for that selection process.

## TI-906 — fixed-winner null is invalid after observed-side search

Forbidden pattern:
1. search K variants on observed outcomes;
2. choose winner j*;
3. keep j* fixed;
4. permute data and test only j*;
5. compare observed winner to single-candidate null.

This ignores winner selection and understates the reference distribution.

State:
`FIXED_WINNER_NULL_AFTER_SEARCH = INVALID`.

## TI-907 — selected/max statistic must be frozen

Before outcome interpretation, define:
- candidate universe;
- candidate eligibility rules;
- support filter;
- fitting/tuning rule;
- evaluation metric;
- direction/sign;
- selection statistic;
- tie-break rule;
- final null comparison statistic.

Examples:
- maximum studentized effect;
- maximum absolute effect;
- best prespecified loss improvement;
- selected rank score under a frozen rule.

The metric cannot change after seeing which null is hardest/easiest.

## TI-908 — null draws replay the same candidate-generation policy

For every null draw:
- start from the same candidate-universe identity;
- apply the same support/admissibility policy;
- apply the same model fitting;
- apply the same tuning/cross-fitting;
- apply the same ranking/winner selection;
- calculate the same selected/max statistic.

The exact surviving candidate set may differ if the null generator legitimately changes support, but the policy and original candidate universe must be identical and all denominator shifts reported.

## TI-909 — pre-outcome support screening remains symmetric

If observed analysis used an outcome-blind support funnel before economic testing, the null replay applies the same frozen support funnel.

The null may not:
- skip expensive support gates;
- admit candidates blocked in the observed arm under identical rules;
- discard null candidates merely because they produce extreme null statistics.

## TI-910 — fitting/tuning is rerun when it was part of the observed pipeline

If observed-side model parameters, spline bases, interaction basis complexity, regularization or thresholds were fit/tuned from permitted training data, the null draw re-runs that fitting using the same chronology and tuning rules.

Copying fitted parameters from the observed outcome-selected model into each null draw is allowed only when those parameters were genuinely frozen independently of the target outcome and the inferential target is that fixed model.

## TI-911 — fold/split identity is preserved, training is not frozen incorrectly

Where cross-fitting/cross-validation is used:
- same split-generation rule;
- same fold/calendar identities where appropriate;
- same train/validation chronology;
- re-fit permitted model components under the null;
- no null-fold access to held-out outcomes beyond the frozen procedure.

This separates split symmetry from parameter-copy shortcuts.

## TI-912 — ranking/selection and trading consequences are replayed

If interaction changes:
- TopK selection;
- rank;
- entry/exit;
- turnover;
- capital usage;
- transaction cost;
- fillability;

the null pipeline recomputes those consequences under the same rules.

Feature-only null statistics cannot confirm a claim whose observed statistic benefited from downstream strategy selection.

## TI-913 — null support failure is data, not a reason to redraw until favorable

If a null draw legitimately produces:
- support insufficiency;
- no eligible candidate;
- all candidates blocked;

the preregistered null protocol must state how that draw contributes to the reference distribution.

It is forbidden to silently discard inconvenient null draws and keep resampling until a full candidate set appears.

## TI-914 — no candidate-set asymmetry

Observed and null arms share:
- candidate birth set;
- aliases;
- parameter grid;
- horizon family;
- subgroup family;
- cost assumptions;
- retirement rules.

A candidate removed from the null family because it creates a large null statistic is a blocking violation.

## TI-915 — no observed winner leakage into null selection

The observed winner identity may be recorded after selection, but cannot constrain the null candidate search unless the inferential target was ex-ante fixed.

The null must be allowed to choose a different winner under the same rule.

## TI-916 — max/selected null also needs dependence-valid resampling

Replaying search does not repair an invalid null generator.

The null generator must separately satisfy TI-853~904:
- exchangeability/dependence;
- lineage consistency;
- support/mechanics;
- clock symmetry;
- selection-identification.

Pipeline replay and null validity are multiplicative gates, not substitutes.

## TI-917 — computational shortcuts need equivalence proof

Shortcuts such as:
- reusing a fitted model;
- screening fewer null candidates;
- analytic approximation of max statistic;
- fewer folds under null;
- fewer cost calculations

may be used only if D16 preregisters and validates that the shortcut preserves the target null distribution sufficiently for the claim.

"Too expensive to replay" does not authorize an easier null.

## TI-918 — null Monte Carlo state is append-only

Each draw records:
- draw id;
- seed;
- null-generator version;
- surviving candidate count;
- selected candidate id;
- selected/max statistic;
- support-block disposition;
- pipeline hash;
- timestamp.

Failed/crashed draws are not silently overwritten.
Retry semantics are frozen.

## TI-919 — observed statistic and null statistic use identical scale

Do not compare:
- raw observed effect vs studentized null;
- net-of-cost observed vs gross null;
- OOS observed vs in-sample null;
- selected observed maximum vs mean null candidate.

The test-statistic identity/hash must match exactly.

## TI-920 — pipeline-null result remains one falsifier, not another evidence vote

A successful max/selected-statistic null test strengthens the falsification case for the interaction.

It does not create an extra evidence unit beyond the interaction itself.

Evidence count remains governed by TI-777~794.

## Exact next continuation point

1. Freeze machine receipt and deterministic cases for fixed-vs-selected interaction claims.
2. Bind null draw ledger identity to the search genealogy candidate-set hash.
3. Then freeze null-generator validation diagnostics and falsifier-disagreement policy.
