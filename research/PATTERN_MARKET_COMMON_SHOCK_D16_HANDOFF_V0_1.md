# D01 DL-041 — D16 Market Common-Shock / Beta Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / SDA_001_REMEDIATION

## Purpose

D01 freezes timing, ownership, dependence-unit and claim-scope semantics.

D16 owns future residual / beta / factor inference.

The central question is:

Does Pattern add representation beyond market-wide common shocks after sector composition is already controlled?

## Required dependence counts

Always report separately:
- stock observations;
- symbols;
- structural roots;
- sectors;
- sector-date clusters;
- market-date clusters;
- independent market episodes;
- regimes.

Many sectors on one date remain one market-date common-shock family.

## Owner receipts

Consume:
- D09 market/sector breadth and context;
- D18 ex-ante regime;
- D19 beta / market-factor / benchmark context.

Do not create substitute taxonomies or factor models inside D01.

## Predictor timing

Only point-in-time context known by predictorFreezeAt may enter baseline controls.

Future benchmark/factor returns belong to D16 outcome evaluation.

Session-date equality is not enough when intraday ordering matters.

## Benchmark / factor pre-registration

Freeze before outcomes:
- benchmark ID/version;
- factor-model ID/version;
- beta estimation policy/window;
- regime owner/version;
- dependence unit.

No best residual benchmark/model selection after outcomes.

## Future ladder

M0 raw cross-sector Pattern;
M1 market-date clustered;
M2 pre-signal market context matched;
M3 D19 beta/factor context ready;
M4 market + sector residual design frozen;
M5 independent market-date replication ready.

Possible interpretations include:
market common-shock explanation;
beta exposure explanation;
regime explanation;
sector+market explanation;
within-market-date Pattern increment;
multi-date cross-sector Pattern candidate;
not evaluable.

## SDA-001 boundary

Pattern + stock trend + sector RS + market trend are not multiple independent votes by default.

Residual D16 evidence remains mandatory.

## Promotion boundary

No market/beta diagnostic changes Formal ranking, gates, Top6, weights, capital or runtime.

Formal Core remains LOCKED.
