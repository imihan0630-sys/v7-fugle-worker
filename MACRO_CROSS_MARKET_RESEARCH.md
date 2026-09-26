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


## MC-016 — current Formal runtime has no global-market state

Fresh repository/runtime patch-chain audit confirms:
- current after-market selection has no explicit NASDAQ / S&P / Dow / SOX / Nikkei / KOSPI / DXY / USD-TWD / WTI / Brent feature family;
- V7.5.30 `marketConsensus` is NOT a macro/global market factor. It is a manually supplied per-symbol independent-source consensus overlay that can add at most +7 priority points after hard eligibility.

Therefore:
`GLOBAL_MARKET_STATE_IN_FORMAL_SELECTOR = ABSENT`.

Global Radar / notification activity, where it exists outside this repository, is not equivalent to a durable PIT research dataset and must not be reverse-engineered into one.

## MC-017 — after-market timing changes what “global lead” can mean

For the 18:10 Taiwan after-market decision clock:

### Prior U.S. cash close
The prior U.S. regular cash close is known before Taiwan opens.
Taiwan's opening auction and full 09:00-13:30 session then have hours to react before the after-market selector runs.

Therefore prior U.S. broad/tech return is primarily:
- an overnight/opening explanatory input;
- a common-beta control;
- a possible divergence/underreaction context.

It is NOT automatically a fresh 18:10 directional lead.

The first falsification must control:
- Taiwan opening gap;
- Taiwan full-session return;
- sector return / Residual RS;
- breadth/regime.

If the U.S. return adds nothing after Taiwan has already reacted, mark it REDUNDANT for after-market ranking.

### Next U.S. cash session
The U.S. regular cash session that starts after the Taiwan 18:10 scan is FUTURE for that selection decision and may not be used.

U.S. futures trading at 18:10 would be a separate derivatives/global receipt with its own source/clock; it must not be mislabeled as the U.S. cash-index close.

## MC-018 — Japan/Korea daily close is a mixed-window variable

TWSE regular trading closes 13:30 Taipei.

Current official exchange hours:
- Japan cash equities trade to 15:30 JST = 14:30 Taipei;
- Korea cash equities trade to 15:30 KST = 14:30 Taipei.

Therefore a same-date Nikkei/KOSPI close-to-close return contains:
- a large interval that overlaps the Taiwan trading session;
- about one final hour after the Taiwan regular close.

Using the whole daily return as a “post-Taiwan-close lead” is semantically contaminated.

Required labels:
- `ASIA_DAILY_MIXED_WINDOW` for daily JP/KR close-to-close data;
- `POST_TAIWAN_CLOSE_CLEAN` only if an intraday anchor at Taiwan 13:30 (Japan/Korea 14:30 local) and their 15:30 local close are both observed.

No daily-series backfill may pretend to contain that post-close subwindow.

## MC-019 — cross-market absorption is higher-value than raw return direction

Taiwan evidence supports strong overseas information transmission into Taiwan's overnight/opening process, especially for technology-linked information.

This makes the central after-market research question:

**Given a global shock was already known before Taiwan opened, did Taiwan/its relevant sector fully absorb, underreact to, or overreact to that shock by the close?**

Do NOT freeze a bullish/bearish rule yet.

First raw state should preserve:
- prior U.S. broad return;
- prior U.S. technology/semiconductor return;
- Taiwan open gap;
- Taiwan close-to-close return;
- Taiwan relevant-sector return / Residual RS;
- source/session/clock provenance.

Only after enough history exists may a pre-registered residual/absorption model estimate expected Taiwan response.
Do not choose beta/window length from outcome performance.

Possible research outcomes:
- continuation;
- next-open gap;
- open-to-close;
- D1/D3/D5;
- MAE/MFE.

A raw global return that predicts only Taiwan's already-observed same-day gap is not incremental after-market alpha.

## MC-020 — Taiwan-specific evidence supports sector-conditional transmission

Durable evidence:
- Taiwan overnight/intraday research emphasizes that information arriving while Taiwan is closed is incorporated at the next opening.
- A Taiwan/U.S. high-technology supply-chain study reports return spillovers from major U.S. technology firms to Taiwanese suppliers, electronics indices and the Taiwan market.
- Recent Taiwan illiquidity research warns that U.S. market information, particularly NASDAQ/Philadelphia Semiconductor context, can materially affect Taiwan overnight returns/opening prices.

These findings support:
- broad U.S. market as common-risk control;
- technology/semiconductor channel as a sector-specific candidate.

They do NOT justify a universal U.S.-up => Taiwan-stock-up score.

## MC-021 — USD/TWD official source gate materially resolved

The Central Bank of the Republic of China publishes the NT$/US$ interbank closing rate, sourced from Taipei Forex Inc., each business day approximately 16:00-17:00 Taipei.

For an 18:10 after-market decision:
`CBC_NTDUSD_SAME_DAY_CLOSE_SOURCE = MATERIAL_PASS_FOR_PROSPECTIVE_CAPTURE`.

Minimum provenance:
- source date;
- NTD per USD;
- source = CBC / Taipei Forex;
- capturedAt;
- firstEligibleTaiwanDecision;
- missing/stale state.

Interpretation guard:
an increase in NTD/USD = NTD depreciation; sign must be explicit.

A 2026 Taiwan study reports asymmetric/time-varying stock-FX dependence, reinforcing that FX should be a regime/context variable rather than a universal linear score.

### FRED distinction
FRED DEXTAUS is useful for historical/cross-check research but its H.10 daily observations are published in a weekly update and use New York noon buying rates.
It is not the preferred same-day 18:10 PIT production source.

## MC-022 — source hierarchy for Phase-1 global capture

Do not wait to source every macro series before research can begin.

### Phase 1A — highest-value / clock-clean
1. prior U.S. broad equity close;
2. prior U.S. technology/semiconductor close;
3. CBC same-day NTD/USD official close;
4. Taiwan market/sector response already available in-system.

### Phase 1B — useful but mixed-window
5. Japan daily close;
6. Korea daily close.

Their daily values remain `ASIA_DAILY_MIXED_WINDOW` unless the post-Taiwan-close subwindow is captured separately.

### Phase 2 — slower / specialized
- oil/commodities;
- DXY;
- rates/yield curve;
- scheduled macro releases;
- European session at 18:10;
- U.S. futures contemporaneous to Taiwan after-market.

These should enter only after exact source, publication/session clock and economic mechanism are frozen.

Global Radar may still display a wider information set; research eligibility is stricter than display coverage.

## MC-023 — public source feasibility nuance

FRED provides daily close series for S&P 500 and NASDAQ Composite, sourced from S&P Dow Jones Indices and Nasdaq respectively, and is useful for historical/prospective prior-U.S.-session research where its publication latency is safely before the Taiwan decision.

However:
- S&P daily history availability/licensing terms differ from Nasdaq;
- FRED is not automatically the best production source for every global instrument;
- SOX, Japan/Korea, DXY and oil still require explicit source/terms/clock selection if used live.

Therefore:
`US_BROAD_PRIOR_SESSION_SOURCE = FEASIBLE_BUT_PROVIDER_CONTRACT_NOT_FROZEN`;
`US_TECH_SEMICON_SOURCE = SOURCE_SELECTION_PARTIAL`.

Do not mix providers silently across history without source-version metadata.

## MC-024 — exact falsification matrix for global absorption

Pre-register before outcomes:

A. **US broad only**
- Does prior U.S. broad return add anything beyond Taiwan same-day market return/regime?
- Expected null is acceptable; redundancy is a valid result.

B. **US technology / semiconductor**
- Test only after broad U.S. and Taiwan market controls.
- Then add Taiwan sector return / Residual RS.
- If effect disappears, classify it as sector beta, not stock alpha.

C. **FX**
- Test NTD/USD level/change and shock separately.
- Condition exporter/importer/financial sector where economically justified.
- If only whole-market beta remains, keep it as market context.

D. **Japan/Korea**
- Daily close first treated as mixed-window control.
- Do not claim post-close leadership unless the 13:30-Taipei-to-close subwindow is isolated.

E. **Crisis removal**
- remove largest global shock dates;
- leave-one-date-out;
- separate normal versus crisis regimes.

F. **Outcome decomposition**
- next open gap;
- open-to-close;
- close-to-close;
- D3/D5;
- MFE/MAE.

G. **Date-shift placebo**
- one-session shifted foreign return must not retain the same “predictive” pattern unless an economically valid lag mechanism exists.

No global score, veto, bonus or threshold is authorized.

## MC-025 — engineering boundary

The correct next engineering object is a **global observation receipt**, not a global score.

If a standalone research fetch/storage path can be added without:
- changing Formal selection;
- altering shared scheduled jobs relied upon by Formal;
- changing source-call budgets that Formal depends on;
- changing monitoring/push behavior,

it may be Class A.

If it needs shared production cron/scheduling, common fetch routing, or shared schema paths that Formal relies on, it is Class B proposal-first.

Current state:
`CONCEPT_FALSIFICATION_MATURE / USD_TWD_SOURCE_MATERIAL_PASS / US_SOURCE_PARTIAL / ASIA_DAILY_MIXED_WINDOW / PROSPECTIVE_RECEIPT_NOT_IMPLEMENTED / NOT_OPTIMIZATION_READY`.
