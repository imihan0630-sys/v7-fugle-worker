# D16 + D18 Regime Label Measurement-Error Checkpoint

Date: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED / OUTCOMES_CLOSED
Owner: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Research conclusion

A replayable decision-time regime label can still be noisy, delayed, ambiguous, or UNKNOWN. Replayability is necessary but does not prove classification accuracy or policy value.

Hypothesis: Strategy × Regime value is credible only if it survives plausible label error, transition ambiguity, UNKNOWN coverage, independent regime episodes, identical costs, and exposure-matched controls.

Falsification:
- the interaction disappears when transition or ambiguous dates are excluded;
- the interaction flips under fixed adjacent-state contamination stress;
- one regime episode or source generation dominates;
- trend/volatility/breadth primitives explain the result;
- net policy value disappears after identical costs.

Alternative explanations include ordinary factor exposure, informative missingness, delayed state confirmation, and source-generation changes that alter label prevalence.

Failure condition: if the result is not robust to frozen label-uncertainty sensitivity and common support, it remains descriptive and cannot justify switching or weighting.

## Frozen pre-outcome validation family

Before protected outcomes open, preregister:
1. frozen base label;
2. transition-date exclusion;
3. ambiguous/UNKNOWN exclusion reported as coverage loss, never BAD/0;
4. fixed symmetric adjacent-state contamination stress chosen without outcome inspection;
5. component-drop sensitivity for regime primitives;
6. static-strategy and exposure-matched non-regime controls.

Treat taxonomy, transition rule, persistence rule, error stress, component-drop set, strategy, horizon and policy map as one multiple-testing family. Never tune these after seeing outcomes.

Misclassification need not only attenuate an interaction. Differential error related to volatility, liquidity, transition state, missingness or strategy opportunity can create or reverse an apparent interaction.

Any reference label used to estimate classification quality must itself have a PIT-safe frozen contract; an ex-post label using future information is diagnostic only.

UNKNOWN coverage is part of the estimand. A policy acting only on easy-to-classify dates identifies value only for that supported subset.

## Module implications

D16-06: evidence remains date/episode based.
D16-10: label perturbation and component-drop are negative controls, not synthetic history.
D16-15: promotion requires sensitivity robustness; fixed N alone is insufficient.
D18-01: replayability is necessary but classification uncertainty stays explicit.
D18-13: attribution must report occupancy, UNKNOWN/ambiguous coverage and episode concentration.
D18-14: walk-forward folds freeze label-generation and sensitivity rules before each untouched test block.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next continuation point

Re-read latest main. If first physical System2 Stage-1 evaluation lands, validate policy id/version and denominator provenance. If decision-time Regime is also KNOWN, require frozen regime vector/version, component states, transition/ambiguity/UNKNOWN semantics and source generation before outcome use. If prospective Strategy × Regime receipts begin accumulating, preregister this label-error sensitivity family before protected outcomes open. Otherwise continue the next executable D16/D18 module without historical Shadow fabrication or retrospective labels.
