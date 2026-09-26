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


## MC-008 — weekend/holiday alignment is a first-class data problem

Calendar-day lag is not trading-session lag. For every foreign market observation, map:
foreignSessionClose -> knownAtTaipei -> first eligible Taiwan scan/session.

If the foreign market was closed, do not forward-fill and call it a new signal. Preserve STALE_NO_NEW_SESSION. If Taiwan was closed, the accumulated foreign information window must be explicitly defined rather than silently using one calendar day.

## MC-009 — gap versus full-session target

Global information may be incorporated primarily at the Taiwan open.

Therefore split:
- next-open gap;
- open-to-close return;
- close-to-close return;
- MAE/MFE.

A feature that predicts the gap but has no open-to-close persistence may be useful for execution/risk context but not for after-market stock ranking.

## MC-010 — residualization protects against false stock alpha

For stock-level tests, first remove:
- Taiwan market move;
- sector move;
- pre-existing stock beta/RS context where available.

Then ask whether global state changes residual outcome or selection hit rate.

Otherwise a U.S. tech rally followed by Taiwan electronics strength can be falsely counted as stock-picking alpha when it is common beta.

## MC-011 — first data gate

Before outcome tests, audit whether existing Global Radar evidence is durably stored with session/date/knownAt provenance. Notification text alone is not a research dataset.

If historical/prospective receipts are absent, mark DATA_QUALITY_BLOCKED and define a prospective Class-A receipt schema rather than reconstructing global states from current web data.

Minimal receipt:
sourceMarket, instrument, sessionDate, close/value, currency/unit, source, capturedAt, knownAtTaipei, firstEligibleTaiwanDecision, staleFlag, revisionStatus.

No historical Shadow fabrication.


## MC-012 — repository provenance audit: historical global receipts are not proven

Bounded repository search for Global Radar, DXY, NASDAQ and sessionDate/knownAt found research/notification references but no durable historical global-market observation table/receipt whose rows independently prove source sessionDate, capturedAt/knownAtTaipei and firstEligibleTaiwanDecision.

This is a provenance result, not a claim that no global data ever existed outside the repository. Existing notification text must not be reverse-engineered into historical features.

Status: HISTORICAL_GLOBAL_RECEIPT = DATA_QUALITY_BLOCKED / UNKNOWN.

## MC-013 — prospective global receipt contract

A research-only prospective receipt may contain:
- receiptId
- sourceMarket
- instrumentId / instrumentType
- sourceSessionDate
- sourceTimezone
- observedCloseOrValue
- unit / currency
- sourceId / sourceUrl
- sourcePublishedAt when applicable
- capturedAt
- knownAtTaipei
- firstEligibleTaiwanDecision
- staleFlag
- staleReason
- revisionStatus
- sourceQuality
- pointInTimeEligible
- missingReason

Calendar/session mapping is explicit. A receipt is not PIT-eligible merely because it was fetched before an outcome test.

## MC-014 — synthetic timezone/holiday falsification matrix

Required tests before outcome use:
1. prior U.S. close before Taiwan scan => eligible;
2. U.S. session that occurs after Taiwan scan => FUTURE / ineligible;
3. Japan/Korea same-day close captured before scan => eligible;
4. foreign holiday => STALE_NO_NEW_SESSION, not a fresh zero-return observation;
5. Taiwan holiday with multiple intervening foreign sessions => ACCUMULATED_WINDOW_REQUIRED, not silent one-day forward fill;
6. macro release after Taiwan scan => future for that scan;
7. revised macro value => original vintage retained; revision cannot overwrite historical knownAt;
8. capture failure => UNKNOWN, not neutral/zero;
9. DST/session-time shift => use source exchange session/timezone, not fixed UTC assumptions;
10. source disagreement => preserve both/provenance or UNKNOWN; do not choose the ex-post convenient value.

## MC-015 — implementation classification

A standalone research receipt writer/storage isolated from Formal selection is Class A only if it does not change shared runtime paths/scheduling/storage relied on by Formal. If durable capture requires shared Cron, shared D1 schema, common fetch routing or production scheduling, it becomes Class B proposal-first.

No historical backfill from current web values is authorized. No outcome lookup is needed to establish this data gate.

Optimization status remains FALSIFICATION_IN_PROGRESS / DATA_QUALITY_BLOCKED / NOT_OPTIMIZATION_READY. A future global context candidate must still prove incremental value beyond Taiwan market, sector, RS/beta and regime controls and survive non-crisis/date-cluster tests.
