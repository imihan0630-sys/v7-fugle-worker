# Macro / Cross-Market Regime Transmission Research

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## MC-001 — scope
Global moves are not stock-selection alpha by themselves. The question is whether information known before Taiwan's after-market scan changes the next-session environment or the reliability of existing A/B selections after Taiwan market/sector controls.

## MC-002 — clock separation
For a Taiwan after-market scan on date t:
- same-day Taiwan close is known;
- prior U.S./Europe close is known;
- same-day Japan/Korea close is generally known;
- U.S. session after Taiwan close is NOT known yet and cannot enter the t after-market selection feature;
- Taiwan night futures after scan are future information for the t scan, though potentially useful for later intraday risk monitoring.

Every cross-market feature needs source market, session date, timezone, knownAt and firstEligibleTaiwanDecision.

## MC-003 — avoid duplicate global beta
Candidate families:
- prior-session U.S. index return;
- semiconductor/technology relative move;
- Japan/Korea equity move;
- USD/TWD or DXY context;
- oil/rates where mechanism is relevant;
- residual Taiwan sensitivity after common global factor.

Validation order:
Taiwan market return/regime -> sector/residual RS -> breadth/liquidity -> global candidate.
If global candidate only restates Taiwan same-day move, mark REDUNDANT.

## MC-004 — transmission is sector-conditional
A global semiconductor shock may matter more for electronics than domestic financial/consumer names. Oil/rates likewise have heterogeneous exposure.

Pre-register sector interaction before outcomes. Do not apply one global risk score uniformly to every stock.

## MC-005 — scheduled macro vs realized surprise
Separate:
- scheduled event presence known before scan;
- consensus/expectation if PIT provenance exists;
- realized release only after actual publication time;
- market reaction after publication.

Never use the realized CPI/Fed/NFP surprise before its release clock. Event calendars alone do not encode direction.

## MC-006 — falsification
Mandatory:
- date-shift placebo;
- Taiwan-market-only baseline;
- sector-control baseline;
- remove largest global shock dates;
- independent-date aggregation;
- timezone/holiday mismatch audit;
- compare raw global return with residual/global-relative feature;
- check whether effect is only gap prediction and disappears by close.

## MC-007 — optimization bridge
A possible Formal optimization is not a blanket global risk veto.
Only if a PIT global state robustly changes A/B selection downside/continuation after Taiwan/sector controls, across independent dates and non-crisis periods, can it become a context/tie-break/risk candidate.

Current status: FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.
