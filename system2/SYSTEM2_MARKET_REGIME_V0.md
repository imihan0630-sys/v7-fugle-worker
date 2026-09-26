# System 2 Market Regime V0

Updated: 2026-09-26 Asia/Taipei
Status: PRE-REGISTERED INPUT SPEC / NO STRATEGY IMPACT

## Objective

Create one frozen Taiwan market-context snapshot that all System 2 strategies consume.

V0 freezes inputs and semantics first. It does not outcome-tune thresholds and does not yet change strategy weights automatically.

## Decision clock

Default daily decision timestamp: after the Taiwan cash-market close, using only information available by that timestamp.

Each input carries:
- marketDate
- observedAt
- availableAt
- source
- pointInTimeEligible
- state/UNKNOWN reason

## V0 input families

### 1. TAIEX trend state — Tier A
Source: official index snapshot.

Raw inputs:
- close
- dailyReturn
- return5 derived from frozen history
- return20
- ma20 derived from frozen history
- ma20Slope5 derived from frozen history
- realizedVol20 derived from frozen history

Descriptive states:
- UP_TREND_CONTEXT
- DOWN_TREND_CONTEXT
- RANGE_OR_MIXED
- UNKNOWN

No tuned score yet.

### 2. Whole-universe participation — prospective Tier A derived
Source: same-day official TWSE/TPEx ordinary-share universe used by System 2 capture.

Freeze universe identity explicitly.

Inputs:
- advanceCount
- declineCount
- flatCount
- advanceShare
- medianReturn
- aboveMa20Count / aboveMa20Pct when history is complete
- positive5dCount / positive5dPct when history is complete
- eligibleCoveragePct

Important:
- official whole-market breadth and System-2-common-stock breadth are separate universes;
- missing histories reduce coverage, not silently count as below MA.

### 3. Market liquidity/activity — prospective Tier A derived

Inputs:
- totalTradeValue
- medianTradeValue
- liquidSymbolCount
- totalTradeValueVs20D only after 20 frozen market-level snapshots exist
- liquidityCoveragePct

Semantics:
traded value = activity/liquidity context, not literal net capital inflow.

### 4. Market concentration — V0 limited

Initial fields:
- top10TradeValueShare
- top20TradeValueShare
- returnDispersion

Large-cap-vs-small-cap leadership remains UNKNOWN until a PIT-safe market-cap/size-bucket contract is frozen.

### 5. Sector participation / rotation — V0 observation only

Current-industry prospective fields may be stored:
- fractionSectorsPositive
- sectorReturnDispersion
- topSectorShareOfTradeValue
- sectorRankSnapshot

But historical use is blocked until classification vintages are safe.

No fixed "rotation bullish/bearish" score in V0.

### 6. Institutional market context — Tier A recent

Inputs may include market aggregates of:
- foreignNet
- trustNet
- dealerNet

Use as context only.
Do not infer motives and do not treat three signs as majority voting.

### 7. Volatility state

From TAIEX frozen history:
- realizedVol20
- realizedVol5
- volRatio5to20

Descriptive states:
- VOL_EXPANDING
- VOL_CONTRACTING
- VOL_NORMAL
- UNKNOWN

Thresholds, if later introduced, must be versioned and preregistered.

### 8. Global/macro

V0 state = UNKNOWN until canonical durable receipt contracts exist for:
- US/global indexes
- FX/USD-TWD/DXY
- rates
- oil/commodities
- macro releases

System 2 must not fabricate global history from a current webpage snapshot.

## Snapshot outputs

V0 stores raw/derived features plus descriptive labels:

- trendState
- participationState
- liquidityState
- concentrationState
- sectorRotationState
- volatilityState
- institutionalContextState
- globalMacroState
- overallEvidenceCompleteness

No single universal "market score" is frozen in V0.

## Future labels

The target taxonomy remains:
- RISK_ON / RISK_OFF
- LARGE_CAP_LED / SMALL_CAP_LED
- TREND / RANGE
- HIGH_VOLATILITY / LOW_VOLATILITY
- SECTOR_ROTATION
- PANIC
- RECOVERY

V0 does not force these labels when evidence is incomplete.

## Strategy-use rule

Until prospective evidence accumulates:
- strategies may display regime context;
- strategy activation/weight changes remain Shadow hypotheses;
- no outcome-tuned regime gate is allowed.

## Falsification plan

Test whether regime context adds incremental value beyond stock-level factors using:
- within-date comparisons;
- independent scan dates;
- regime coverage;
- sector concentration;
- transaction costs;
- date-cluster robustness;
- redundancy against existing sector/RS/volatility factors.

If regime labels do not add incremental information, simplify them rather than preserving complexity.
