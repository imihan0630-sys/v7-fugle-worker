# Pattern Named-Label Governance v0.1

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / FROZEN
Formal Core: LOCKED

## Purpose

Prevent traditional chart names from becoming duplicated, one-sign scores before their underlying geometry has demonstrated incremental value.

This contract applies to Cup-with-Handle, W/Double-Bottom, VCP, Platform, Flag, Pennant, Triangle, Wedge, Head-and-Shoulders, Sakata/candlestick families and future named chart labels.

## 1. Named labels are metadata, not directional priors

A label such as "bullish flag" or "head-and-shoulders top" may describe a historical trading convention, but the name itself does not authorize:
- a positive/negative score;
- a buy/sell interpretation;
- a selection veto;
- a ranking bonus;
- a fixed expected-return sign.

Reason:
- academic/formal-classification literature documents definition ambiguity;
- modern machine-chart evidence shows several textbook labels do not map cleanly to the conventional directional sign;
- economic effects vary by scale, market, regime, liquidity and holding/execution design.

Do not invert a label merely because one external model disagrees with folk wisdom. The sign is UNKNOWN until our own prospective evidence matures.

## 2. Quantitative layer = latent geometry + lifecycle

Primary quantitative objects are continuous/as-of features:

TREND_CONTEXT
- prior trend / prior advance or decline
- MA/swing context
- residual-strength context

COMPRESSION
- range / ATR contraction
- contraction sequence
- duration
- volume dry-up

SUPPORT_RESISTANCE_TOPOLOGY
- confirmed boundary slopes
- touch progression
- zone distance / available air
- true neckline / rim / pivot relations

SWING_PROGRESSION
- higher lows / lower highs
- contraction depth progression
- recovery progression

SHAPE_SYMMETRY
- rim/trough symmetry
- time symmetry
- bottom residence
- curvature residual

IMPULSE_QUALITY
- pole return
- path efficiency
- range expansion / compression relation

VOLUME_STRUCTURE
- down-leg volume progression
- base / handle / consolidation volume relation

PIVOT_CLARITY
- competing references
- scale disagreement
- boundary fit residual

MATURITY / LIFECYCLE
- forming
- structurally valid
- mature/context-ready
- first break
- holding/retest
- reentry/failure

LOCATION / MECHANICAL RISK
- overheat
- larger-zone location
- gap/event dependence
- price-limit constrained price discovery
- corporate-action boundary

## 3. Multi-label overlap

One structure may carry multiple labels.

Examples:
- Cup handle may also look like a short Flag.
- VCP final contraction may look like a Platform/Triangle.
- Rising Three Methods may be a micro Flag.
- W can be nested inside a larger Cup.

Required behavior:
- preserve all plausible labels;
- preserve shared confirmed anchor IDs;
- store ambiguity/conflict;
- never count two labels as two independent pieces of evidence when they arise from the same anchors.

## 4. Scale is part of the observation

Pattern family without scale is under-specified.

Each observation must preserve:
- detector scale;
- lookback/context horizon;
- confirmed anchors;
- as-of date;
- detector version.

Cross-scale agreement is diagnostic. Disagreement is not automatically bad.

Never pick MICRO/BASE/MAJOR because the chosen scale later produced the best return.

## 5. Detection vs prediction

Detection question:
"Does this sequence satisfy the stated morphology/geometry contract as of t?"

Prediction question:
"Conditional on current Formal/PV/regime controls, does this as-of geometry add stable forward information?"

These are separate.

High classification accuracy does not prove economic alpha.
A visually convincing named pattern does not prove prediction.

## 6. Redundancy firewall

Before any named label can be interpreted as incremental, compare it against:
- its own latent geometry vector;
- ret20 / persistence / Residual RS;
- priorHigh20 / priorHigh60 / major-zone distance;
- ATR / volatility / compression;
- daily close position / upper shadow;
- breakoutQualityResearch;
- volumeTodayVsPrev5 / PV context;
- overheat;
- market/industry regime.

If the label disappears after its constituent geometry is controlled, the label remains explainability/UI only.

## 7. Candlestick-specific rule

Candlestick names sit above continuous relational OHLC encoding:
- body/ATR;
- range/ATR;
- wick ratios;
- close location;
- body overlap / containment / engulfment;
- gap/open relation;
- penetration of prior body;
- prior trend;
- structural location;
- corporate-action / price-limit state.

A named candlestick label cannot become an independent score merely by matching a textbook boolean formula.

## 8. Machine-learning boundary

Image/CNN/transformer-style chart models are deferred until clean prospective Pattern data is mature.

If later introduced, their first role is an independent falsification benchmark:
"Does flexible representation contain information beyond transparent latent geometry + Formal/PV controls?"

Requirements:
- same PIT input universe;
- purged temporal train/validation/holdout;
- frozen architecture before final holdout;
- explicit turnover/costs;
- no retroactive tuning of transparent detector thresholds from ML outcomes.

ML does not replace the transparent detector by default.

## 9. Experiment-accounting rule

A new:
- hard geometry threshold;
- lookback;
- label variant;
- scale-selection rule;
- acceptance-bar count;
- interaction;
- aggregation weight

is a new experiment/variant unless it is merely a numerical implementation tolerance.

Do not hide new degrees of freedom under an old label name.

## 10. Promotion boundary

Named Pattern evidence cannot enter Formal Core until it independently passes:
- prospective complete parent coverage;
- replay/prefix invariance;
- point-in-time data semantics;
- mature sample/date/regime gates;
- purged holdout;
- redundancy;
- transaction-cost/slippage;
- date-cluster robustness;
- coverage/zero-pick impact;
- explicit owner strategy approval.

Current status:
NAMED_LABELS = EXPLAINABILITY_ONLY
LATENT_GEOMETRY = RESEARCHABLE
DIRECTIONAL SIGN = UNKNOWN
FORMAL CORE = LOCKED
