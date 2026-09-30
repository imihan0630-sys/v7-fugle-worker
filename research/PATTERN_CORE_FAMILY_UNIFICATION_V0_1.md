# Pattern Core-Family Unification & Evidence-Dedup Contract v0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_FREE / FROZEN_V0_1
Formal Core: LOCKED

## Purpose

Unify the six mandatory D01 study themes without turning their names into duplicate votes:

- K-line / candlestick morphology;
- Sakata families;
- W/M;
- Cup / Cup-with-Handle;
- VCP;
- Breakout / false breakout lifecycle.

The central rule is:

NAMED LABEL COUNT
!=
DISTINCT STRUCTURAL OBJECT COUNT
!=
INDEPENDENT INFORMATION COUNT.

No return outcome is used in this contract.

## D01-U01 — Four-layer interpretation hierarchy

### Layer A — Macro topology
Examples:
- W / Double Bottom;
- M / Double Top;
- Cup / Bowl;
- large Platform / Triangle-like boundary geometry.

Primary objects:
confirmed swings, neckline/rim/boundary zones, prior trend, major-zone location.

### Layer B — Compression / progression
Examples:
- VCP sequential contractions;
- handle tightening;
- platform narrowing;
- rising-low / falling-high progression.

Primary objects:
contraction depth sequence, boundary width, range/ATR progression, volume-context references.

### Layer C — Local candlestick / Sakata morphology
Examples:
- Engulfing / Harami / Piercing relational shapes;
- Three Soldiers / Three Crows;
- Three Methods;
- local Sakata-style multi-candle motifs.

Primary objects:
OPEN/HIGH/LOW/CLOSE relations, body/wick/overlap, local sequence direction and prior-trend context.

### Layer D — Trigger / lifecycle
Examples:
- neckline break;
- cup-rim break;
- VCP pivot break;
- breakout, retest, reclaim, reentry, failure.

Primary objects:
boundary relation through time.

Breakout is not a new pattern vote.
It is a lifecycle state of a structural object.

## D01-U02 — W/M and Cup are not automatically independent

W and Cup can be different visual descriptions of related reversal geometry.

W emphasizes:
- LOW -> MID_HIGH -> LOW;
- right-low relation;
- neckline.

Cup emphasizes:
- HIGH -> LOW -> HIGH;
- bowl depth;
- rim similarity;
- recovery symmetry / curvature.

A long rounded recovery can contain a short W near its bottom.
A W can also form inside a broader Cup.

Rules:
- preserve both labels when detector contracts match;
- preserve exact anchors;
- compute anchor overlap;
- do not add two votes merely because two labels exist.

If two labels use the exact same structural anchor set at the same scale:
they are one exact-anchor structural group for dedup diagnostics.

This does not assert they are economically identical.

## D01-U03 — Cup handle, VCP final leg and Platform can overlap

The right-side handle of a Cup may itself satisfy:
- short consolidation;
- contraction;
- Platform-like;
- Flag-like;
- VCP final-leg morphology.

Likewise a VCP final contraction can look like a narrow Platform/Triangle.

Therefore:
- Handle is a local substructure of a Cup episode when its anchor set is nested in the cup episode;
- VCP/Platform labels sharing the same contraction anchors must expose overlap;
- rawLabelCount may increase;
- distinct root price provenance does not.

No overlap threshold is used to assign predictive independence.

## D01-U04 — Breakout / false breakout is orthogonal to the label name

A boundary event can belong simultaneously to multiple labels when those labels share the same trigger zone.

Example:
W neckline == Cup right rim == VCP pivot within the exact same versioned boundary object.

One close above that shared boundary is:
ONE observed boundary-break event,
not three independent breakouts.

Lifecycle states remain causal:
APPROACH
-> FIRST_BREAK
-> HOLDING/RETEST
-> REENTERED
-> FAILED

No N-bar acceptance threshold is added here.

## D01-U05 — False breakout must be defined as lifecycle failure, not visual disappointment

The phrase "false breakout" is often used loosely.

Research contract:
a breakout can be called structurally failed only from an as-of lifecycle state that records:
- a previously verified boundary break;
- later reentry / failed-below state under the same boundary version;
- causal timestamps.

A single upper wick or next-day red candle is not automatically a false breakout.

Price-limit-constrained sessions remain CONSTRAINED / UNRESOLVED until an eligible unconstrained session permits ordinary acceptance/failure interpretation.

## D01-U06 — Sakata / candlestick is micro morphology, not a macro substitute

Sakata-style names are retained as historical taxonomy.

Research representation uses:
- body direction and body/ATR;
- wick ratios;
- close location;
- open relation;
- overlap/containment/engulfment;
- multi-bar directional sequence;
- prior trend;
- structural location.

A Three Soldiers-like sequence at a W neckline is:
- one local multi-candle morphology;
- inside one macro structural episode;
- possibly inside the same breakout lifecycle.

It is not automatically an independent bullish vote.

## D01-U07 — Three different diversity concepts

### rawNamedLabelCount
How many labels matched.

Useful for explainability only.

### structuralObjectCount
How many exact, versioned structural objects exist.

Examples:
- one Cup macro episode;
- one nested handle/VCP compression object;
- one breakout lifecycle event.

This is still price-derived structure.

### rootProvenanceCount
How many genuinely different root information families exist.

Examples:
- PRICE_OHLC;
- VERIFIED_VOLUME_FLOW;
- ORDER_BOOK_MICROSTRUCTURE;
- SECTOR_CONTEXT;
- EVENT_CONTEXT.

Five price-derived labels can still have rootProvenanceCount=1.

Never call rawNamedLabelCount "five independent confirmations."

## D01-U08 — Exact-anchor and exact-trigger dedup are deterministic

Outcome-free exact dedup uses no tuned overlap threshold.

Exact-anchor group key:
- scale;
- semantic-space version;
- sorted structural anchor IDs.

If W and Cup share this exact key:
sameAnchorSet=true.

Partial overlap:
report Jaccard overlap continuously.
Do not force independent/dependent classification from an arbitrary threshold.

Exact-trigger group key:
- versioned boundary ID;
- firstBreakAt.

If multiple families share that key:
one observed trigger event.

## D01-U09 — Nested structure is preserved, not flattened

A nested W inside a larger Cup is not discarded.

Store:
- parent/child scale relation;
- containment share;
- anchor overlap;
- structural layer.

The purpose is to avoid duplicate scoring, not delete useful morphology.

Cross-scale agreement is a diagnostic.
It is not automatically stronger.

## D01-U10 — Mandatory anti-double-count controls for future inference

Any future outcome study must compare:

1. named-label effect;
2. constituent latent-geometry vector;
3. exact-anchor structural group;
4. root provenance family;
5. existing Formal / Price-Volume controls.

If the named label adds nothing after its primitives are controlled:
LABEL_INCREMENT = REDUNDANT / UI_ONLY.

If multiple labels share one exact trigger:
do not count them as separate breakout observations.

## D01-U11 — Evidence from prior literature

Systematic chart-pattern research such as Lo-Mamaysky-Wang supports objective geometric detection and reports that some detected chart patterns can change conditional return distributions.

This supports:
"pattern geometry can be studied objectively."

It does NOT support:
"more matching names = more alpha."

Taiwan candlestick research found only a subset of tested one-day candle patterns profitable after costs and robustness checks in a 1992-2009 sample.

This supports:
"local OHLC morphology may contain information."

But because that sample predates current 10% limits and 2020 continuous trading, it does not authorize a modern fixed Sakata sign.

## D01-U12 — Practical interpretation for System 1 / System 2

Possible future roles after prospective evidence:
- warning / explanation;
- tie-break context;
- risk penalty;
- selection feature;
- execution revalidation.

Current prohibited behavior:
- pattern-name majority vote;
- one score point per matching label;
- W + Cup + VCP + breakout + Sakata = five confirmations;
- using false-breakout wording before causal failure state exists.

## Current status

CORE_FAMILY_HIERARCHY = FROZEN_V0_1
NAMED_LABEL_COUNT = EXPLAINABILITY_ONLY
EXACT_ANCHOR_DEDUP = RESEARCHABLE
EXACT_TRIGGER_DEDUP = RESEARCHABLE
INDEPENDENT_INFORMATION_COUNT = NOT_INFERRED_FROM_LABEL_COUNT
DIRECTIONAL_ALPHA = UNKNOWN
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Add pure outcome-free evidence-dedup helper and adversarial fixtures.
2. Falsify exact-anchor grouping on:
   - same-anchor W + Cup;
   - nested W inside Cup;
   - Cup handle + VCP/Platform overlap;
   - same boundary break named by multiple families;
   - Sakata local motif inside breakout bars.
3. Preserve partial overlap as continuous diagnostics, not a binary independence rule.
4. Then study false-breakout lifecycle taxonomy separately:
   immediate reentry, delayed failure, undercut-reclaim, constrained/unresolved breakout.
5. No forward-return tuning and no Formal change.
