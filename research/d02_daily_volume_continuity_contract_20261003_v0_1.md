# D02 Daily Volume Continuity Contract V0.1

Updated: 2026-10-03 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / RESEARCH_ONLY
Scope owner: D02 Price × Volume
Formal Core: LOCKED / unchanged
Evidence cursor impact: NONE; PVE remains 239

## Purpose

Freeze the minimum data-semantic contract required before daily volume magnitude, pvDailyRvol20, signedVolumeBalance20, or D02-09 pivot-signed-volume divergence can be treated as PIT-clean price-volume evidence.

This contract does not inspect forward returns, does not tune thresholds, and does not change System1/System2 Formal behavior.

## Source facts revalidated

1. Fugle official Historical Candles documentation states that regular-stock historical daily/weekly/monthly candle `volume` is reported in shares, while regular-stock intraday candle `volume` is reported in lots.
2. Therefore the existing D1 history mapping from historical daily `volume` to `volumeShares` is dimensionally consistent with the documented daily source unit.
3. Intraday H001/H002 volume baselines and daily pvDailyRvol20 must never be reconciled by absolute magnitude without an explicit unit adapter. Their normalized ratios may be compared only as separately defined research features.
4. The official documentation does not, by itself, prove the exact odd-lot inclusion contract for the daily aggregate. `oddLotCoverage` therefore remains source-contract UNKNOWN unless separately evidenced.

Official documentation:
- https://developer.fugle.tw/docs/data/http-api/historical/candles/
- https://developer.fugle.tw/docs/data/http-api/intraday/candles/

## Code-proven daily-builder gap

Current `pvBuildDailyFeature(history, marketDate)`:
- keeps only rows where `positiveNumber(volumeShares)` is non-null;
- takes the last 20 earlier surviving rows;
- has no symbol-session calendar input;
- has no corporate-action/reset input;
- has no volumeUnit/tradingUnit provenance input.

Consequences:

### Zero is not missing
A factual zero-volume eligible session and a missing/non-session row are semantically different.
The current positive-only filter collapses both into row absence.

A future research implementation must distinguish at least:
- `VALID_SESSION_POSITIVE_VOLUME`;
- `VALID_SESSION_ZERO_VOLUME`;
- `VERIFIED_SUSPENSION_OR_NON_SYMBOL_SESSION`;
- `EXPECTED_SESSION_MISSING_SOURCE`;
- `SOURCE_SEMANTICS_UNKNOWN`.

No older row may be pulled in merely to make the count equal 20.

### 20 rows is not 20 comparable sessions
A numeric `dailyHistoryCount=20` is insufficient.
The required set is the exact most-recent 20 eligible symbol sessions under verified session provenance and the applicable continuity regime.

Reuse the cross-lane contract:
`EXPECTED_SYMBOL_SESSIONS = OFFICIAL_EXCHANGE_SESSIONS - VERIFIED_SYMBOL_SUSPENSION_SESSIONS`.

Unknown suspension provenance remains UNKNOWN; provider bar presence is not proof of a valid symbol session.

## Corporate-action semantic split

Corporate Actions research already freezes two distinct families and D02 must preserve that separation.

### A. UNIT_SCALE — hard magnitude continuity break

Examples include share-unit conversions where one native share unit before and after the event is not directly comparable without a verified factor.

For D02 V0.1:
- raw prints remain factual raw-source observations;
- cross-event magnitude comparability is BLOCKED unless a verified PIT share-unit bridge exists;
- the conservative default is RESET, not retrospective rewriting;
- pre-reset rows do not enter a post-reset 20-session magnitude baseline;
- `postResetComparableSessionCount >= 20` is required before pvDailyRvol20 or signed-volume magnitude can be clean under the reset-only lane.

Allowed statuses:
- `UNIT_SCALE_BRIDGE_VERIFIED`;
- `UNIT_SCALE_RESET_ACTIVE`;
- `UNIT_SCALE_UNKNOWN_BLOCKED`.

A generic corporate-action flag is insufficient.

### B. SUPPLY_CHANGE — unit remains valid, economic interpretation changes

A pure supply change does not make factual raw executed-share volume dimensionally undefined.
One share remains one share.

Therefore:
- do NOT mechanically rescale historical RAW_SHARE_VOLUME;
- do NOT call the raw volume invalid solely because listed/issued supply changed;
- persist `supplyBreakPresent`, effective date, source, and known-at provenance.

However a cross-break raw-volume baseline may no longer mean stable participation intensity or turnover intensity.

Freeze two research modes:

1. `RAW_ACTIVITY`
   - raw share-volume ratios remain factual;
   - supply break must be a control/stratum;
   - interpretation is raw executed-share activity only.

2. `COMPARABLE_PARTICIPATION`
   - require a PIT denominator-normalized lane, OR
   - require the baseline window to be fully post-break (`postSupplyBreakComparableSessionCount >= 20`);
   - otherwise status = `SUPPLY_BREAK_MIXED_BASELINE` and clean participation inference is blocked.

This prevents a false universal reset while also preventing a mixed pre/post supply window from masquerading as stable participation intensity.

## Daily-source semantic fields

Minimum provenance fields for a clean daily magnitude observation:

- symbol
- marketDate
- source
- sourceFetchedAt
- featureKnownAt
- volumeUnit
- volumeValue
- oddLotCoverage
- symbolSessionVerified
- expectedSymbolSessionSetHash
- unitScaleState
- unitScaleEffectiveAt
- unitScaleKnownAt
- unitScaleFactor when applicable
- supplyBreakPresent
- supplyBreakEffectiveAt
- supplyBreakKnownAt
- comparableSessionCount
- baselineAsOfDate
- missingExpectedSessionCount
- unknownReasons[]

The value `null` means unavailable/unknown.
UNKNOWN must never be rewritten to 0 or false.

## pvDailyRvol20 V0.1 clean contract

For a marketDate observation:

`pvDailyRvol20 = currentDailyShares / median(prior 20 comparable daily-share observations)`

only when all are true:

1. current row belongs to a verified eligible symbol session;
2. source unit is explicit and stable as SHARES for the daily lane;
3. the exact expected prior symbol-session set is verified;
4. no expected source row is silently missing;
5. UNIT_SCALE continuity is either bridge-verified or reset-clean with 20 post-reset comparable sessions;
6. for COMPARABLE_PARTICIPATION interpretation, any SUPPLY_CHANGE is denominator-normalized or the full 20-session baseline is post-break;
7. source/provenance known-at timestamps are PIT-valid;
8. no pseudo/no-trade provider bar is mistaken for an eligible traded session;
9. daily odd-lot coverage is not silently assumed to equal intraday regular-lot coverage.

If any mandatory item fails:
- feature value may remain available as a factual raw-source diagnostic where appropriate;
- clean inference state is UNKNOWN/BLOCKED;
- the row does not enter D02-09 L3 feasibility evidence or clean H-family outcome denominators.

## signedVolumeBalance20 and D02-09 consequence

`signedVolumeBalance20` is directly volume-magnitude weighted.

Therefore the same session/unit/corporate-action contract applies.
A repaint-safe pivot clock cannot rescue a magnitude path that crosses an unresolved UNIT_SCALE boundary or an unverified expected-session gap.

For pivot divergence P1 -> P2:
- price pivots follow the already-frozen consecutive same-type same-scale confirmed chronology;
- volume interval must carry a clean continuity receipt for every eligible session in the interval;
- if the interval crosses unresolved UNIT_SCALE, status = `VOLUME_PATH_BLOCKED`;
- if it crosses SUPPLY_CHANGE, raw signed-volume may be reported only as RAW_ACTIVITY unless participation comparability is separately restored.

## Falsification cases frozen before outcomes

1. UNIT_SCALE with verified factor but fewer than 20 post-reset sessions:
   daily magnitude is factual; reset-only pvDailyRvol20 remains DATA_INSUFFICIENT.

2. Pure SUPPLY_CHANGE with stable share unit:
   raw share volume is not invalid by definition; universal-reset claim is false.

3. Pure SUPPLY_CHANGE inside a 20-session participation baseline with no denominator:
   raw ratio may be factual but stable participation-intensity interpretation is not proven.

4. Verified suspension represented by a provider pseudo-bar:
   provider row presence must not make the date eligible.

5. Valid expected session with factual zero volume:
   zero must not be silently converted to missing and replaced by an older row.

6. Missing expected session with no verified suspension:
   must fail closed as `EXPECTED_SESSION_MISSING_SOURCE`; no backfill.

7. Daily SHARES versus intraday regular-lot LOTS:
   dimensionless within-lane RVOL can coexist, but absolute-volume equivalence is false without an adapter.

## Maturity implication

This contract closes the ambiguity about what D02 means by daily-volume continuity, but it does not prove that the current production/research recorder satisfies the contract.

Therefore:
- D02-09 remains L2 / 40%.
- D02-07 remains L2 / 40%.
- D02 aggregate remains 48.3%.
- no outcome test is opened.
- no FORMAL_OPTIMIZATION_CANDIDATE is created.
- Formal Core remains LOCKED.

## Exact continuation

Formal evidence cursor remains PVE-239.
PVE-240 remains reserved for the first genuine completed market session after the approved cross-midnight repair and must execute Gate 0 through Gate 6 before any outcome use.

Pre-PVE-240 research may continue outcome-blind by building a replay/validation receipt against already-frozen corporate-action and symbol-session witnesses:
- UNIT_SCALE positive mechanics witness;
- UNIT_SCALE counterexample without Boolean flip;
- SUPPLY_CHANGE raw-valid / participation-confounded witness;
- suspension pseudo-bar witness;
- zero-versus-missing session semantics.

No historical sample may be relabeled as prospective Shadow evidence.
