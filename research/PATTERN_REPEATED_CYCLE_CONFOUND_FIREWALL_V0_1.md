# D01 DL-026 — Repeated-Cycle Crossing-Opportunity Confound Firewall V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / CROSS-LANE_CONTROL_SPEC / FORMAL_CORE_LOCKED

## 1. Problem

DL-023 defines repeated-cycle counts, exposure and gap times.

Even cycleCount / observableEligibleSessions is not fully opportunity-adjusted.

The chance to cross/re-cross a structural zone depends on the underlying price path and market mechanics.

Potential confounds:
- volatility magnitude;
- structural-zone width;
- price distance/location around the zone;
- tick-size / price-resolution effects;
- liquidity / spread / depth;
- price-limit constrained sessions;
- price-volume acceptance/persistence;
- episode age / time at risk.

Therefore:
HIGH_RECURRENCE != STRONG_STRUCTURAL_MEMORY by default.

## 2. Volatility opportunity

A more volatile price path has more opportunity to traverse a fixed-width zone.

Required control/context:
- ATR% or equivalent volatility measure owned by D04;
- realized-volatility context where PIT-valid;
- max adverse/favorable path excursion already owned by Pattern.

Do not interpret more crossings as stronger Pattern information before volatility is controlled.

## 3. Zone-width opportunity

The same ATR path crosses:
- a narrow zone more easily;
- a wide zone less easily.

Required Pattern geometry controls:
- parentZoneWidth = parentUpper - parentLower;
- parentZoneWidthPct;
- parentZoneWidthATR when ATR is valid.

These are scale/context descriptors.
They are not votes.

## 4. Tick / price-resolution confound

Discrete price grids can alter observed zero moves, clustering and crossing frequency.

Required control:
- relative tick size to price;
- relative tick size to zone width / ATR where valid;
- price-tier / tick-rule version.

Ownership:
Microstructure / shared market-rules lane.

Pattern consumes receipt/version; it does not implement a second tick engine.

## 5. Liquidity / market-friction confound

Illiquid stocks may:
- jump across zones;
- print sparse closes;
- show apparent repeated crossing differently from liquid stocks.

Highly liquid stocks may:
- traverse more price points;
- show finer reentry/reclaim timing.

Required cross-lane controls:
- liquidity;
- spread/depth where available;
- turnover / participation;
- D02 price-volume acceptance/persistence.

Missing microstructure evidence remains UNKNOWN.
Do not impute neutral.

## 6. Price-limit / constrained-session confound

Constrained sessions preserve structural chronology but ordinary crossing interpretation can be unresolved.

Required:
- constrainedEligibleSessionsAtRisk;
- ordinary observable exposure;
- price-limit/session-rule provenance.

Raw event counts that mix constrained and ordinary sessions are not comparable.

## 7. Boundary-proximity opportunity

A path spending much of its time near a zone has more crossing opportunity than one far away.

No arbitrary "within 2%" occupancy threshold is frozen.

Future flexible models may consume continuous:
- signed distance path;
- cumulative signed distance;
- absolute/normalized distance summaries;
- zone width / ATR.

D01 does not define a new boundary-proximity score in v0.1.

## 8. Required control bundle

RCCB_V0_1 — Repeated-Cycle Confound Bundle

Pattern-owned:
- parentZoneWidthPct;
- parentZoneWidthATR;
- current/continuous boundary-distance path descriptors;
- episode age;
- repeated-cycle exposure / gap descriptors.

D04 / volatility-owned:
- ATR / realized-volatility receipt/reference.

Microstructure-owned:
- tick-rule version;
- relative tick;
- spread/depth if available;
- price-limit/session mechanics.

D02-owned:
- turnover / participation;
- acceptance/persistence state.

Regime-owned:
- market/sector regime.

No copied reimplementation across lanes.

## 9. Interpretation ladder

Q0:
raw recurrence count.

Q1:
count + observable exposure.

Q2:
Q1 + volatility + zone width.

Q3:
Q2 + tick/liquidity/constrained-session controls.

Q4:
Q3 + D02 acceptance + market/sector regime.

Only residual value beyond Q4 could support a structural repeated-cycle representation candidate.

Even then:
source novelty remains NONE.

## 10. Kill rules

Reject a structural repeated-cycle interpretation if:
1. effect disappears after ATR/volatility + zone width;
2. effect is explained by tick-price tier;
3. effect is concentrated in illiquid/sparse-print names;
4. constrained-session share drives recurrence;
5. effect disappears after D02 acceptance/persistence;
6. effect exists only at one regime or price tier without preregistered mechanism;
7. missing controls are silently set to neutral.

## 11. External evidence interpretation

Taiwan evidence documents pervasive price/size clustering and links clustering to firm risk and transitory volatility.

General tick-size research shows discrete price grids alter return distributions and price formation.

D01 implication:
crossing frequency is partly an opportunity/microstructure phenomenon.
It cannot be interpreted as pure support/resistance memory.

## 12. Current decision

RAW_CYCLE_RATE =
INSUFFICIENTLY_OPPORTUNITY_ADJUSTED.

CROSSING_OPPORTUNITY_CONTROL =
REQUIRED.

NEW_OPPORTUNITY_SCORE =
REJECTED_V0_1.

CROSS_LANE_OWNERSHIP =
REQUIRED.

REPEATED_CYCLE_STRUCTURAL_INCREMENTALITY =
UNKNOWN.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 13. Exact next continuation

1. Freeze a machine-readable required-control bundle and availability auditor.
2. Do not calculate a structural recurrence residual until all required controls have legitimate PIT receipts.
3. Hand Q0-Q4 ladder to D16.
4. Next science: distinguish "structural memory" from generic volatility-driven level-crossing by negative-control boundaries, without post-outcome boundary mining.
5. No outcome join / no Formal change.
