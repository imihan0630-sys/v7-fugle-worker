# D01 DL-043 — D16 Overnight / Opening-Auction Path Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / DATA_QUALITY_BLOCKED_PARTIAL

## 1. Purpose

D01 freezes response-path decomposition semantics.

D16 owns future economic inference.

Key question:
Does Pattern representation survive after the next opening price is set, or is the apparent daily effect carried mainly by overnight / opening-auction price discovery?

## 2. Owner dependencies

Consume:
- D11 overnight-gap / reference-price / corporate-action receipts;
- D05 opening-auction / microstructure receipts;
- D04 volatility context;
- DL-042 event state;
- DL-041 market/beta context;
- DL-040 sector context.

Do not rebuild these owner engines in D01.

## 3. Required response decomposition

Report separately:
- total close-to-close response;
- close-to-open overnight response;
- open-to-close intraday response;
- first 5m / 15m / 30m path where clean data exist.

Do not infer continuous-session Pattern value from total daily return alone.

## 4. Corporate-action firewall

Raw previous-close gap is not safe on reference-reset days.

Require D11 continuity/reference-price state.

Missing provenance:
CORPORATE_ACTION_GAP_DATA_BLOCKED.

## 5. Opening selection / censoring

Retain:
- normal opens;
- price-limit constrained opens;
- suspended no-open;
- missing opening rows;
- corporate-action blocked rows;
- auction-state unknown rows.

Do not infer from clean normal opens only.

## 6. Mechanism ladder

G0 daily close-to-close.
G1 overnight/intraday split.
G2 market/sector opening context.
G3 opening-auction state.
G4 intraday residual Pattern.
G5 cross-path replication.

Possible findings include overnight-only, auction-dominant, intraday continuation, reversal, market/sector gap explanation, constraint explanation, contamination, mixed path or not evaluable.

## 7. Post-treatment state

For an after-market predictor, next opening-auction state is post-selection.

It may be used for mechanism/path-conditional analysis, not as a baseline confounder for the total Pattern estimand.

## 8. Data readiness

Repository audit already shows full historical opening evidence is not yet inference-ready:
- referencePrice/openTime incomplete historically;
- opening recorder not exhaustive;
- current/latest feed cannot reconstruct missing historical receipts.

Therefore DL-043 remains DATA_QUALITY_BLOCKED_PARTIAL for economic inference.

No historical reconstruction from current values.

## 9. Promotion boundary

No path diagnostic changes Formal eligibility, ranking, Top6, capital or runtime.

Formal Core remains LOCKED.
