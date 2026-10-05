# D03 Mixed-Root Residual Graduation Guard V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Scope: SDA-001 / SDA-004 cross-domain evidence counting
Status: RESEARCH_ONLY / OUTCOME_CLOSED / SEMANTIC_GUARD_FROZEN
Formal Core: LOCKED

## Purpose

Freeze the evidence-counting rule for a factor whose lineage consumes more than one information root, especially a PRICE_OHLC + VOLUME_TURNOVER composite.

The problem is asymmetric:

1. treating the whole mixed-root factor as redundant forever can hide a genuinely incremental non-price component;
2. promoting the whole mixed-root factor after one component proves residual value can double-count the already-consumed price component.

The safe rule is component-specific graduation:

> only the root-specific residual component that survives the frozen D16 residual/OOS/multiplicity gate may graduate. The original mixed-root composite does not automatically become a second independent evidence vote.

This contract does not assert that any residual component has already passed.

## TI-759 — mixed-root composite is not an independent source by construction

A factor with information roots such as:
- PRICE_OHLC;
- VOLUME_TURNOVER

is not automatically two independent pieces of evidence.

The composite may summarize both roots, but its active state is still one observed factor representation.

Before a component-specific residual proof:
- composite independence state = PARTIAL_OVERLAP or RESIDUAL_CANDIDATE;
- effective independent evidence increment from the composite = 0 beyond already-counted overlapping root families;
- existing conservative connected-root dedup remains valid.

Different formula names, nonlinear interactions or low correlation do not change this default.

## TI-760 — graduation attaches to the isolated residual component, not the parent composite

Suppose a mixed factor M consumes roots P and V, where:
- P = PRICE_OHLC;
- V = VOLUME_TURNOVER.

If D16 later proves that a V-specific residual component adds stable incremental value conditional on P and all registered controls, the promotable object is a new immutable child representation R(V | P, controls), not M itself.

Required child lineage:
- componentFactorId;
- componentFactorVersion;
- parentCompositeFactorId + parentCompositeFactorVersion;
- isolatedInformationRoot;
- conditionedOnInformationRoots;
- residualizationMethodVersion;
- baselineFeatureSetHash;
- commonSupportHash;
- d16MethodReceiptHash;
- d16IncrementalityReceiptHash;
- parameterFamilyId;
- decisionClock / firstObservableAt;
- provenance;
- independenceStatus.

Allowed graduation state:
`RESIDUAL_INCREMENTAL_PROVEN`.

The child may not claim `INDEPENDENT_SOURCE_PROVEN` merely because it is residualized.

## TI-761 — parent composite stays non-additive after child graduation

When a residual child is proven:
- the parent composite remains a descriptive/interaction carrier;
- the parent composite contributes no extra effective evidence beyond its already-accounted components;
- any raw active parent may remain visible for explanation or lifecycle logic;
- parent + residual child cannot both each add an independent unit for the same isolated root.

Therefore, for a price family plus one proven volume residual:
- price family effective evidence = at most 1;
- proven volume residual family increment = at most 1;
- original price-volume composite increment = 0;
- total attributable effective evidence = at most 2, never 3.

This is an anti-stacking rule, not a promise that the residual earns one vote in Formal ranking.

## TI-762 — proof must be root-specific and baseline-bound

A D16 receipt is insufficient if it only says:
"the mixed factor beats the price-only model."

It must identify which component is incremental and bind the result to the exact control set.

A root-specific graduation requires:
1. exact parent/composite version;
2. exact isolated root;
3. exact conditioned-on roots;
4. exact baseline feature set and hash;
5. exact common-support population/hash;
6. exact residualization / comparison method version;
7. preregistered parameter-family and multiplicity identity;
8. dependence-aware / date-aware inference;
9. untouched OOS or genuine prospective evidence;
10. relevant transaction-cost/fillability treatment where the component affects tradable selection;
11. D16 receipt;
12. Room00 closure before any cross-system promotion authority.

A generic uplift, correlation difference or in-sample coefficient is not root-specific proof.

## TI-763 — no residual laundering through interaction labels

The following do not create a new residual family:
- renaming PRICE_VOLUME_RESPONSE as "confirmation";
- replacing a product with a ratio;
- percentile / z-score / rank transforms;
- sign inversion;
- thresholding a continuous composite;
- adding an interaction label after outcome inspection;
- changing timeframe while consuming the same primitive roots;
- splitting one mixed factor into multiple child labels without isolated-root proof.

All such variants remain inside the same experiment-family accounting until explicitly preregistered and validated.

## TI-764 — baseline drift invalidates inherited graduation

A root-specific residual proof is tied to the baseline against which the residual was established.

If any of the following changes materially:
- price/trend baseline family;
- parent composite formula/version;
- isolated-root source semantics;
- common-support definition;
- residualization method;
- decision clock;
- parameter family;
- outcome family;
- holdout or dependence method

the old receipt cannot be copied forward as proof.

State becomes:
`RESIDUAL_PROOF_REVALIDATION_REQUIRED`
or fail-closed `UNKNOWN`.

This prevents a stale residual receipt from becoming permanent "independence credit."

## TI-765 — residual child must not reuse parent raw state as proof input and vote

The machine consumer must distinguish:
- parent raw activity;
- isolated residual component state;
- proof receipt that justifies evidence status.

The same parent activity used to construct or define the residual cannot also be counted as an additional independent vote merely because the child is active.

Required accounting:
- rawSignalCount may include both parent and child for observability;
- deduped family accounting may expose their relationship;
- effectiveIndependentEvidenceCount must count only the allowed independent/residual families;
- parentCompositeContributionToIndependentEvidence = 0 when its residual child is the promoted object.

## TI-766 — mixed-root missing lineage fails closed

If a factor claims multiple roots but lacks any of:
- explicit parent lineage;
- root decomposition;
- exact source/root semantics;
- baseline/control identity;
- residual proof identity

then the system must not infer a hidden residual component.

Allowed state:
`MIXED_ROOT_UNDECOMPOSED`.

Its effective independent increment is zero beyond existing connected-root family accounting.

No heuristic "one root looks new" rule is allowed.

## TI-767 — examples and cross-domain ownership

### D02 price-volume example
D02 owns whether a price-volume observable truly contains VOLUME_TURNOVER information and whether source/unit/PIT semantics are valid.

D03/lineage guard owns only the cross-domain anti-stacking rule:
- PRICE_OHLC ancestry already counted elsewhere cannot be re-counted;
- only a D16-proven VOLUME_TURNOVER residual child may become a separate residual family.

### D03 Bollinger example
Bollinger location and width may be tested separately against:
- price/MA location controls;
- D04 volatility/dispersion controls.

If one component later proves residual value, only that isolated residual component may graduate. The full Bollinger envelope cannot simultaneously become an extra vote on top of its proven child and its parent families.

### D03 ADX example
Directional movement and true-range components require separate trend and volatility/range controls. Proof for one residual component does not promote the full ADX composite as an additional independent source.

## TI-768 — current decision and routing

Frozen decision:
`MIXED_ROOT_GRADUATION = COMPONENT_SPECIFIC_ONLY`.

Current state:
- no D02 volume residual component is declared proven by this contract;
- no D03 Bollinger/ADX residual component is declared proven;
- System 1 conservative connected-root dedup remains valid;
- System 2 must use the same component-specific promotion rule if/when it consumes mixed-root evidence;
- D16 owns root-specific residual/common-support/OOS/multiplicity proof;
- Room00 owns cross-domain closure;
- outcome joins remain CLOSED;
- Formal Core remains LOCKED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

No maturity promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40.

## Exact next continuation point

1. Freeze a machine-readable mixed-root component receipt schema and deterministic acceptance fixture.
2. Reject whole-parent graduation when only one child root has proof.
3. Reject child proof whose baseline/common-support/method receipt no longer matches.
4. Allow a synthetic contract PASS only for the accounting rule; do not claim empirical incrementality.
5. External pending lanes remain independent: System1 diagnostic schema implementation, first genuine System1 receipt, System2 runtime dedup diagnostics, D16 D03 method receipt, protected PR #600/Bollinger/ADX evidence path.
