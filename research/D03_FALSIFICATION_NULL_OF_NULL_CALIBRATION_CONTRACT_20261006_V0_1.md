# D03 Falsification "Null-of-Null" Calibration Contract V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: D03
Method owner dependency: D16
Parent rules: TI-853~950
Status: RESEARCH_ONLY / SYNTHETIC_METHOD_CALIBRATION_ONLY / OUTCOMES_CLOSED
Formal Core: LOCKED

## Purpose

Test whether the interaction falsification pipeline itself behaves properly in worlds where truth is known.

This is method calibration, not Taiwan-stock evidence.

## TI-951 — synthetic calibration has two distinct goals

Goal A — null calibration:
when no residual interaction exists, the falsification pipeline should not manufacture excessive discoveries.

Goal B — sensitivity calibration:
when a known interaction is injected, the pipeline should retain enough sensitivity to detect it under supported conditions.

Passing Goal A without Goal B can indicate an uninformative low-power procedure.
Passing Goal B without Goal A can indicate an anti-conservative procedure.

## TI-952 — calibration worlds are separate from market evidence

Synthetic/simulated results may validate:
- software;
- null-generator behavior;
- Type-I properties;
- directional-error properties;
- power/sensitivity;
- search-selection adjustment.

They do not validate:
- Taiwan-stock alpha;
- real-market transportability;
- target-population economics;
- future profitability.

Synthetic evidence contributes zero market-evidence units.

## TI-953 — no-interaction worlds must include correlated main effects

An easy null where P and V are independent is insufficient for a price×volume interaction method.

At least one null family should preserve:
- substantial P-V correlation/dependence;
- both P and V main effects on the outcome;
- date/sector/regime nuisance structure;
- zero residual P×V interaction by construction.

This tests whether main-effect misspecification is falsely labeled interaction.

## TI-954 — date-common-shock panel null

Synthetic panel world includes:
- multiple symbols per date;
- shared date shock;
- symbol-specific component;
- optional sector shock;
- no residual interaction.

Naive row-IID inference should fail this stress by design.
Date-aware methods should preserve nominal behavior subject to method assumptions.

## TI-955 — serial-dependence null

Synthetic world includes:
- autocorrelated predictor/root process;
- autocorrelated/heteroskedastic outcome innovations as appropriate;
- no residual interaction.

Purpose:
detect false reassurance from shuffles that erase time dependence.

## TI-956 — volatility-clustering / regime null

Include a world with:
- conditional heteroskedasticity or volatility clustering;
- regime-varying marginal variances;
- stable no-interaction structural relation.

A null generator that preserves only global variance but not local variance/regime structure should be exposed.

## TI-957 — sector-concentration null

Include:
- sector-specific exposures;
- unequal sector sizes;
- common sector shocks;
- no generic market-wide interaction.

Purpose:
detect a pipeline that mistakes one-sector concentration for a universal interaction.

## TI-958 — admission/missingness null

Include outcome-blind but state-dependent:
- missingness;
- data capture/admission;
- liquidity eligibility;
- support thinning.

No residual interaction exists.

Purpose:
verify selection/admission handling does not create an interaction through complete-case filtering.

## TI-959 — same-root deterministic-indicator null

For Bollinger/ADX-style validation:
- generate valid primitive price/HLC paths;
- derive both technical components deterministically from the same path;
- construct outcomes from registered main effects but no residual interaction.

A componentwise-shuffle method should be identified as off-manifold/invalid.
Path/residualized methods can be evaluated.

## TI-960 — mixed-root conditional null

For price×volume:
- generate price and volume with realistic dependence on shared context;
- permit both main effects;
- set residual interaction to zero;
- test whether conditional null method controls false discoveries.

Include deliberate conditional-sampler misspecification scenarios.

## TI-961 — injected-interaction worlds vary effect geometry

Sensitivity worlds should include, where method-relevant:
- weak/medium/strong smooth interaction;
- threshold interaction;
- localized interaction;
- regime-conditional interaction;
- interaction with unequal support.

This prevents calibration only to one convenient functional form.

## TI-962 — main-effect misspecification world is mandatory

Create a no-interaction world with nonlinear main effects.

A rigid additive baseline may spuriously report interaction.

A valid method should either:
- absorb the nonlinear main effect through the frozen marginal-control design; or
- block with METHOD_INCOMPATIBLE / MAIN_EFFECT_MISSPECIFICATION_NOT_INTERACTION.

## TI-963 — search-selection calibration replays the candidate zoo

At least one synthetic null audit runs the full parameter/representation/horizon candidate search under zero interaction.

The observed-side selection procedure is replayed exactly.

Purpose:
estimate whether max/winner adjustment actually controls false discoveries after search.

## TI-964 — support-block calibration tests denominator behavior

Synthetic worlds should include:
- zero/near-zero joint cells;
- thin independent-date support;
- low effective cluster count;
- extreme weights;
- concentration.

Expected behavior is often a valid blocking terminal state, not a forced p-value.

A method that always returns a result even in unidentifiable worlds is suspect.

## TI-965 — directional-error calibration is separate

Where a signed interaction direction is claimed, calibration should check:
- false positive rate;
- wrong-sign/directional error rate.

A two-sided rejection that frequently assigns the wrong direction cannot support a signed trading interpretation.

## TI-966 — calibration development and audit worlds are separated

To prevent overfitting the falsifier to its own synthetic tests:

Development set:
- used to debug/choose method implementation under the preregistered method-development policy.

Audit set:
- generated from frozen but unrevealed scenario/seed identities after method version freeze;
- used only to audit final calibration.

If audit worlds cause redesign:
- method version increments;
- old audit becomes development-consumed;
- a new audit world set is required.

## TI-967 — seeds and DGP identities are durable

Every world binds:
- syntheticWorldFamilyId;
- syntheticWorldVersion;
- DGP hash;
- parameter hash;
- seed;
- sample geometry;
- truth label;
- expected support state;
- method version.

Deleting bad seeds or re-running until a favorable calibration result is forbidden.

## TI-968 — calibration thresholds are frozen before audit reveal

Before audit results:
- Type-I tolerance;
- directional-error tolerance;
- minimum sensitivity/power criterion if used;
- acceptable support-block behavior;
- aggregation across scenarios

are frozen by D16.

D03 does not invent universal numeric thresholds here.

## TI-969 — synthetic audit cannot repair empirical insufficiency

Even a perfectly calibrated falsification pipeline cannot promote an empirical interaction when:
- genuine support is insufficient;
- prospective/OOS evidence is absent;
- selection identification is blocked;
- D16 real-data method receipt is blocked.

Synthetic readiness only clears the method layer.

## TI-970 — current decision

Frozen:
`FALSIFIER_CALIBRATION = TWO_STAGE_SYNTHETIC_DEVELOPMENT_PLUS_HELD_OUT_AUDIT`.

No synthetic worlds are claimed to have been executed by this contract.
No market outcomes are opened.
No maturity change.

## Exact next continuation point

1. Freeze machine synthetic-world/calibration receipt schema.
2. Do not create favorable fake empirical samples and call them evidence.
3. The next actual evidence gain must come from external machine implementation or genuine prospective/raw-source gates; semantic research alone should no longer increase D03 maturity.
