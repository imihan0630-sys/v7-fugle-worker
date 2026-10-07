# BR-063 Breadth × Regime 2026-10-06 Replay Witness

Status: REAL_MARKET_REPLAY_WITNESS / PROSPECTIVE_SAME_CLOCK_INELIGIBLE / KEEP_D09_12_L2 / OUTCOMES_CLOSED / FORMAL_UNCHANGED

Owner room: 07｜產業與供應鏈研究室
Module: D09-12 Breadth×Regime交互作用
Research item: BR-063
Market date: 2026-10-06

## 1. Why this receipt exists

2026-10-06 provides a genuine Taiwan market state that is useful for falsification:
- TAIEX closed higher and remained well above a rising MA20;
- equal-stock direction breadth was weak on both TWSE and TPEx.

However the canonical BR-063 promotion gate requires a genuine same-clock D18 observable-regime receipt plus official breadth receipt.

That gate is NOT met.

This artifact therefore freezes the real-market state as a replay witness while explicitly prohibiting prospective promotion.

## 2. Official market facts

TWSE stock-only:
- up 462;
- down 519;
- unchanged 100;
- N/A / not comparable 2;
- comparable N = 1,081;
- advance share = 42.7382%;
- decline share = 48.0111%;
- net advance-minus-decline = -5.2729 percentage points.

TPEx:
- up 300;
- down 475;
- flat 90;
- untraded including suspended 28;
- comparable N = 865;
- advance share = 34.6821%;
- decline share = 54.9133%;
- net advance-minus-decline = -20.2312 percentage points.

Combined descriptive lane only:
- comparable N = 1,946;
- advance share = 39.1572%;
- decline share = 51.0791%;
- flat share = 9.7636%;
- net advance-minus-decline = -11.9219 percentage points;
- comparable coverage = 98.4818%.

The combined lane is descriptive only because TWSE N/A and TPEx untraded/suspended have different venue semantics and remain explicit.

## 3. Index context

Official 2026-10-06:
- TAIEX = 49,822.55, +0.22%;
- TPEx index = 430.86, -0.37%.

Using the exact frozen formula in `system2/runtime/d18_taiex_context_v0_1.mjs` and the official 25-session TAIEX close history ending 2026-10-06:

- MA20 = 47,453.461;
- MA20 five official sessions earlier = 46,820.7985;
- MA20Slope5 = +632.6625;
- D5 return = +4.59899%;
- D20 return = +7.02758%;
- realizedVol5 = 0.0085638343;
- realizedVol20 = 0.0100403787;
- volRatio5to20 = 0.8529393744.

Deterministic replay state:
- trendContext = `UP_TREND_CONTEXT`;
- volatilityDirection = `VOL_CONTRACTING`.

This replay is NOT prospective for BR-063 because its source values were re-read after the market date and there is no same-day A2 receipt.

## 4. Genuine same-day prospective collector readback

System2 scheduled run:
- workflow: `System2 Prospective Clock Evidence Read-only`;
- run: `37419347091`;
- URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37419347091
- market date: 2026-10-06;
- conclusion: SUCCESS;
- immutable daily artifact id: `11397914577`.

The collector itself proves BR-063 was not same-clock ready:
- `dailyGateComplete=false`;
- `sameSessionClockReady=false`;
- `requiredReady=false`;
- `precisionEligible=false`;
- `exactDecisionClockAuthorized=false`;
- TWSE A1: 30 attempts, no READY observation;
- TPEx A1: READY first observed at `2026-10-06T08:03:54.274Z`;
- A2 TAIEX: attemptCount=0;
- B2 dependency coverage=false.

No other repository workflow references `A2_TAIEX_CLOSE` or the D18 TAIEX context builder for prospective scheduled capture on this date.

## 5. What this proves

Real descriptive witness:
`CAP_WEIGHTED_UPTREND_CAN_COEXIST_WITH_WEAK_EQUAL_STOCK_DIRECTION_BREADTH`.

It does NOT prove:
- future return direction;
- a bullish or bearish Breadth×Regime policy;
- D09-12 L3;
- D18 prospective regime readiness.

The D18 canonical breadth label remains `CONTEXT_RAW` because same-clock median return continuity is not certified.

## 6. Maturity

D09-12 remains:
- L2;
- 40%;
- `GENUINE_SAME_CLOCK_JOINT_RECEIPT_MISSING`.

No maturity promotion.

## 7. Exact next

On a future completed Taiwan session:
1. prospectively capture A2 TAIEX context;
2. prospectively capture the required official / continuity-safe breadth lane;
3. bind both to one exact decision timestamp;
4. preserve UNKNOWN and venue coverage;
5. freeze the joint receipt before any outcome access.

Retrospective replay may test code but cannot satisfy BR-063 promotion.
