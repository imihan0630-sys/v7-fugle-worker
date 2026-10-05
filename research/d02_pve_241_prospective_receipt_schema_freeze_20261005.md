# D02 PVE-241 — Prospective PV provenance receipt schema freeze
Updated: 2026-10-05
Status: OUTCOME_BLIND / SCHEMA_FROZEN / NO_MATURITY_CHANGE / FORMAL_UNCHANGED

## Purpose
Freeze the machine-checkable prospective receipt boundary requested by PVE-240 before any promotion-grade economic outcome use.

## What is frozen
The receipt binds one symbol/date/timeframe observation to:
1. exact provider/endpoint/retrieval time/raw payload hash;
2. availableAt, firstKnownAt and decisionCutoff;
3. completed-bar identity and Asia/Taipei clock;
4. raw volume unit and explicit normalization to SHARES;
5. price adjustment semantics;
6. corporate-action status and receipt lineage;
7. information-root identity;
8. participation proxy class with intentIdentified=false;
9. fail-closed admission booleans and reasons.

## Unit normalization
Allowed V0.1 rules:
- SHARES -> SHARES by IDENTITY_SHARES;
- regular-lot LOTS -> SHARES by REGULAR_LOT_X_1000.
Anything else is UNKNOWN/BLOCKED until a separately versioned rule exists.
A row cannot pass merely because the numerical values look plausible.

## Corporate-action firewall
A corporate-action status must be explicit.
UNKNOWN fails promotion-grade prospective admission.
Mechanical ex-right/ex-dividend gaps cannot be ordinary breakout/response evidence.
SUPPLY_CHANGE and UNIT_SCALE remain distinct semantics and cannot be silently merged.

## Availability-clock firewall
Historical availability today is not proof of original decision-time observability.
knownByDecisionCutoff must be derived from bound firstKnownAt/availableAt evidence.
If firstKnownAt is later than decisionCutoff, PIT fails.
Late corrections create a new version; they do not rewrite the earlier decision state.

## Participation-intent firewall
All volume, RVOL, cumulative pace, bid/ask-side volume, signed-volume and price-volume-response fields remain participation/proxy observables.
intentIdentified is hard-frozen false in V0.1.
Opening-auction side-volume completeness is explicitly typed because provider side-volume documentation excludes the first opening-auction match.
No accumulation/distribution/smart-money/true-OFI claim is authorized.

## Information-root anti-double-counting
PRICE_OHLC, VOLUME_TURNOVER and PRICE_PLUS_VOLUME_DERIVED are explicit roots.
A derived price-volume state does not create a second independent price vote.
Future incrementality tests must use identical common support against the price-only parent.

## Fail-closed matrix
Admission must be false for at least:
- incomplete bar;
- firstKnownAt after decisionCutoff;
- unknown/unproven volume-unit conversion;
- corporate-action UNKNOWN where contamination is possible;
- missing source hash or endpoint lineage;
- cross-timeframe unit join without explicit conversion;
- opening-auction side-volume treated as complete when source contract says incomplete;
- any intentIdentified=true under this schema;
- adjusted-minute semantics silently inherited from daily bars.

## Counter-evidence and limits
This schema proves neither predictive alpha nor L4 readiness.
It does not create a clean prospective date.
It does not freeze a numerical EffectTargetReceipt.
It does not choose a D16 model/calibrator.
It does not authorize historical backfill as Prospective Shadow evidence.

## Result
PVE-241 closes the schema-definition degree of freedom before outcomes.
The next information gain is executable fixture/guard validation plus first genuine prospective receipt capture.
D02 maturity remains 60.0%; Gate 7 remains CLOSED; Formal Core remains LOCKED.
