# D03 Bollinger / ADX Parameter Search Genealogy Audit V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent rules: TI-803~838
Status: RESEARCH_ONLY / OUTCOME_CLOSED / PARAMETER_GENEALOGY_AUDIT_FROZEN
Formal Core: LOCKED

## Purpose

Audit the actual Bollinger/ADX repository state against the interaction-search genealogy firewall and freeze the parameter/search axes that would enter multiplicity if they are later outcome-tested.

This audit distinguishes:
- parameter values merely mentioned in research/literature;
- candidates evaluated only for formula/support/mechanics;
- candidates inspected against target economic outcomes.

Mention alone is not an outcome-tested multiplicity attempt.

## TI-839 — current canonical Bollinger formula is fixed, not optimized

Current canonical contract:
`BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1`.

Frozen baseline:
- close input;
- period = 20;
- center = SMA;
- population standard deviation;
- upper/lower multiplier = 2;
- no current runtime parameter search;
- exact 20 eligible-session continuity requirement for L3 evidence.

Current state:
`CANONICAL_BASELINE_FIXED_NOT_PARAMETER_WINNER`.

No multiplicity debt is inferred merely because other Bollinger variants exist in literature.

## TI-840 — current canonical ADX formula is fixed, not optimized

Current canonical contract:
`WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1`.

Frozen baseline:
- period = 14;
- Wilder smoothing/init semantics;
- explicit DM tie rule;
- directionless ADX strength semantics;
- canonical FULL_REPLAY requirement;
- no threshold optimization.

Current state:
`CANONICAL_BASELINE_FIXED_NOT_PARAMETER_WINNER`.

## TI-841 — mentioned conventional thresholds are not automatically tested hypotheses

Research documents mention conventional ADX values such as 20/25/40.

They are explicitly descriptive and the prior contract says:
- continuous ADX first;
- broad bins only for diagnostics;
- no threshold sweep before redundancy evidence.

Therefore:
- MENTIONED_ONLY does not consume economic outcome multiplicity;
- SUPPORT_EVALUATED_ONLY remains outcome-blind if target outcomes are unopened;
- OUTCOME_INSPECTED enters local/outer multiplicity accounting.

Every candidate record must expose one of those evidence-access states.

## TI-842 — Bollinger future search axes are frozen as one family budget

If future work explores any of these, they belong to the Bollinger search genealogy unless a genuinely different mechanism is preregistered:
- center lookback;
- SMA vs EMA/other center;
- population vs sample dispersion;
- band multiplier;
- raw width vs percentage width;
- %B/location encoding;
- squeeze percentile lookback;
- squeeze threshold/quantile;
- squeeze duration rule;
- upper/lower touch vs close-outside vs re-entry;
- breakout/mean-reversion sign interpretation;
- lifecycle/retest encoding;
- volatility comparator set;
- outcome horizon;
- regime/context subgroup.

A favorable combination of these axes is not a fresh independent hypothesis merely because it has a new formulaVersion.

## TI-843 — ADX future search axes are frozen as one family budget

Future ADX/DMI search axes include:
- Wilder period;
- initialization/smoothing semantics;
- ADX level threshold;
- ADX slope definition/window;
- +DI/-DI dominance threshold;
- DI crossover/retest encoding;
- DX/DI contrast transform;
- directional-efficiency comparator;
- ATR/TR normalization controls;
- strength-state binning;
- trend direction gate;
- lifecycle/persistence rule;
- outcome horizon;
- regime/context subgroup.

ADX14 plus threshold 25 is not automatically a different mechanism from ADX14 plus threshold 20.

## TI-844 — parameter cross-products are one searched universe when jointly optimized

If several axes are searched jointly, the family size is the actual candidate lattice considered, not the number of winning axes reported.

Example:
3 periods × 3 thresholds × 2 slope rules × 3 horizons
is a 54-candidate design universe if all combinations are actually eligible/tested.

The report cannot describe it as:
"one ADX test with four tuning choices."

The exact candidate-set hash must be durable before confirmatory outcome interpretation.

## TI-845 — sequential search funnels may reduce tested candidates but not erase screened candidates

A preregistered deterministic funnel may be used:
1. formula/mechanics admissibility;
2. support/continuity;
3. redundancy/main-effect controls;
4. outcome testing.

Candidates eliminated before target outcome access:
- remain in the search ledger;
- do not consume outcome holdout;
- are marked pre-outcome screened/retired.

Candidates that reach outcome testing:
- enter multiplicity and holdout-consumption accounting.

## TI-846 — support selection may choose one canonical candidate if outcome-blind

Example:
several squeeze definitions are generated before outcomes;
a frozen support rule selects the definition with:
- adequate independent-date support;
- lower leverage/concentration;
- acceptable continuity;
- no zero-support critical cells.

This can remain outcome-blind if:
- economic outcomes were not accessed;
- candidate set and support selection policy were frozen;
- all considered candidates stay in the ledger.

The chosen candidate is not a historical "winner" on economic performance.

## TI-847 — threshold-free continuous analysis is the preferred first redundancy test

For ADX and Bollinger continuous states:
- continuous ADX level/slope;
- continuous BBW/%B or decomposed location/dispersion

should be evaluated before outcome-driven categorical threshold search.

This reduces arbitrary cutpoint degrees of freedom.

It does not eliminate the need for:
- nonlinear marginal controls;
- leverage/design support;
- multiplicity if spline/basis complexity is searched.

## TI-848 — Bollinger touch/squeeze labels are state transforms, not free extra families

Upper touch, lower touch, close outside, re-entry, squeeze, expansion and squeeze-duration labels share the same parent center/dispersion lineage.

Unless a genuinely distinct preregistered interaction mechanism is defined:
- evidence dedup keeps them in the canonical parent/interaction families;
- search accounting preserves each outcome-tested label/variant;
- successful labels cannot stack as independent evidence.

## TI-849 — ADX threshold/slope/crossover labels are state transforms, not free extra families

High ADX, rising ADX, ADX crossing 20/25/40, +DI crossover and strength-state labels are downstream transforms of the same DMI/ADX parent system.

They may encode different research hypotheses, but:
- parent lineage stays shared;
- local search genealogy remains linked;
- each outcome-tested variant is visible;
- no alias reset.

## TI-850 — exact canonical baselines cannot be changed to repair future poor support/outcomes

For current L3 physical readiness:
- Bollinger remains 20×2 exact canonical baseline;
- ADX remains Wilder 14 exact canonical baseline.

Changing those formulas would define a different research variant and cannot be used to make a blocked canonical L3 receipt pass.

Physical readiness of the canonical formula and predictive search over alternatives are separate lanes.

## TI-851 — current audit finds no evidence of completed outcome-driven parameter sweep

Repository evidence inspected in this audit supports:
- canonical Bollinger 20×2 fixed;
- canonical ADX14 fixed;
- conventional ADX thresholds discussed descriptively;
- explicit no-threshold-optimization language;
- outcomes remain closed in the D03 primary queue.

Therefore current disposition:
`NO_VERIFIED_OUTCOME_DRIVEN_BOLLINGER_ADX_PARAMETER_SWEEP`.

This is not proof that no historical exploratory calculation ever existed outside governed evidence.
It means no governed D03 promotion evidence currently depends on such a sweep.

## TI-852 — exact next parameter-governance decision

Future Bollinger/ADX confirmatory interaction work must bind:
- interactionSearchFamilyId;
- parameter candidate-set hash;
- support-selection policy;
- local multipleTestingFamilyId;
- D16 researchStreamId or EXPLORATORY_ONLY;
- variant birth/outcome-access ledger;
- fresh winner-validation state where selection occurred.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- outcomes remain CLOSED;
- Formal Core remains LOCKED;
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Exact next continuation point

1. Freeze one combined D03 interaction support + search-governance acceptance receipt contract that future D16 receipts can consume directly.
2. Do not open outcomes.
3. Re-read System1/System2 machine implementation deltas before further semantic expansion; if they land, switch to incremental readback rather than inventing more governance.
4. Protected Bollinger/ADX L3 physical evidence remains separate from predictive interaction promotion.
