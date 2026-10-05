# D01 DL-043 — D16 Session-Mechanism / Opening-Gap Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes session decomposition semantics.

D16 owns future economic inference.

The core requirement is to distinguish:
- prior-close to open overnight return;
- opening call-auction price formation;
- immediate post-open continuous trading;
- later continuous-session structure.

## 2. Required future estimands

### E1 — DAILY_TOTAL_PATTERN
Daily close-to-close / daily-candle result.

### E2 — OVERNIGHT_COMPONENT
Prior close to current open.

### E3 — OPENING_MECHANISM_COMPONENT
Opening call-auction state / opening-cross type.

### E4 — IMMEDIATE_POST_OPEN_COMPONENT
Preregistered early continuous window.

### E5 — LATER_CONTINUOUS_COMPONENT
Continuous session after the opening segment.

Do not infer E5 from E1 alone.

## 3. Required crossing split

Keep:
- CONTINUOUS_CROSS;
- OPENING_GAP_CROSS;
- AUCTION_AT_BOUNDARY;
- CONSTRAINED_OPENING_CROSS;
- CROSSING_UNKNOWN.

A gap through resistance is not the same market mechanism as continuous trading through resistance.

## 4. Event interaction

Consume DL-042 event state.

A result concentrated on event-driven gap days can be:
- event mechanism;
- opening mechanism;
- both.

Do not collapse these explanations.

## 5. Taiwan mechanism context

TWSE currently uses a call auction at the open and continuous trading afterward.

Taiwan research documents distinct overnight and intraday return behavior.

This makes mechanism separation directly relevant rather than a generic microstructure concern.

## 6. Future comparison ladder

T0 RAW_DAILY_PATTERN
T1 OVERNIGHT_INTRADAY_DECOMPOSED
T2 OPEN_AUCTION_SEPARATED
T3 IMMEDIATE_POST_OPEN_SEPARATED
T4 LATER_CONTINUOUS_ONLY
T5 NON_GAP_CONTINUOUS_CROSS_ONLY
T6 SESSION_ROBUST_REPLICATION

Interpretation:
- overnight-only -> gap explanation;
- open-only -> opening-auction explanation;
- early-only -> immediate-post-open explanation;
- later continuous residual -> continuous-session candidate;
- survives non-gap continuous crosses + multiple session states -> stronger session-robust candidate.

## 7. Dependence / multiplicity

The four session components are decomposition views of one price path.

Do not count them as independent votes.

effectiveIndependentEvidenceCount = 1 by default.

## 8. Predictor-clock firewall

At each predictor freeze, later session components are future information.

Pre-open predictors cannot use open.
At-open predictors cannot use first-15m path.
First-15m predictors cannot use later-session path.

## 9. Common support

Future comparisons need overlap in:
- gap size;
- event state;
- market/sector gap;
- volatility/liquidity;
- relative tick;
- price tier;
- beta/regime;
- price-limit / halt state.

No extrapolation outside support.

## 10. Promotion boundary

No opening / overnight / session descriptor changes Formal eligibility, ranking, Top6, weights, capital or execution.

Formal Core remains LOCKED.
