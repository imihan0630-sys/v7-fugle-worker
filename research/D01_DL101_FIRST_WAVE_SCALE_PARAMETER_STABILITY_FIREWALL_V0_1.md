# D01 DL-101 — First-Wave Scale / Parameter Stability Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: OUTCOME_BLIND / PARAMETER_STABILITY_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose
Prevent a pattern from looking robust only because one scale, lookback, threshold, or alignment was selected after future performance was known.

## Core rules
A change in lookback, sequence length, candle threshold, gap threshold, base width/depth, rim/handle tolerance, breakout tolerance, timeframe, bar alignment or scale-selection rule is a distinct experiment unless it is only a numerical implementation tolerance.

Before outcomes, test representation stability across a preregistered local parameter neighborhood. This is not an alpha test.

Two configurations may describe the same structural episode only when symbol, predictor cutoff, information root, source-history identity and causal anchors remain compatible. For base families, baseEpisodeId must not drift.

Allowed stability states:
- STABLE_REPRESENTATION
- CONFIG_SENSITIVE_REPRESENTATION
- IDENTITY_DRIFT
- DATA_BLOCKED
- UNKNOWN

D01-02: continuous one-bar geometry is primary; named thresholds are metadata variants.
D01-03: sequence length and named thresholds are experiment dimensions.
D01-07: base width/depth/rim/handle tolerances are major overfit risks; anchor/lifecycle identity controls the episode.
D01-09: raw gap remains continuous; named large-gap thresholds are child experiments; legal price-limit boundaries are market rules, not tunable pattern parameters.

Reuse DL-008 multi-scale rules: higher-timeframe agreement is not an extra vote; timeframe/alignment belongs to the multiple-testing family; equivalent-horizon and bar-boundary placebos remain required for predictive claims.

STABLE_REPRESENTATION does not imply alpha, and CONFIG_SENSITIVE does not imply failure. These are representation-quality states only.

PARAMETER_FAMILY_IS_HYPOTHESIS = TRUE.
OUTCOME_SELECTED_SCALE = PROHIBITED.
STABILITY_EQUALS_ALPHA = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
