# BR-066 — D09-12 Same-Day Breadth × Regime Joint Receipt V0.1

Status: RESEARCH_ONLY / PROSPECTIVE_SAME_DATE_JOINT_RECEIPT / TWSE_SCOPE_KNOWN / TPEX_SCOPE_UNKNOWN / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-12
Date: 2026-10-07 Asia/Taipei
Decision cutoff: 2026-10-07T23:55:26+08:00
Observed main before write: 48d69c94e31e49c4ab4810c56b1305d4f0f3a86d

## Purpose

Create the first bounded same-date breadth × market-regime receipt after BR-063 without retrospective reconstruction.

## Official TWSE evidence observed before the cutoff

Official sources:
- https://www.twse.com.tw/exchangeReport/MI_INDEX?response=html
- https://www.twse.com.tw/exchangeReport/FMTQIK?response=html
- https://www.twse.com.tw/indicesReport/MI_5MINS_HIST?response=html

2026-10-07 TAIEX:
- close = 49,806.37;
- daily change = -16.18 points / approximately -0.03%.

2026-10-07 TWSE stock-direction breadth:
- up = 588;
- down = 387;
- flat = 99;
- unmatched = 5;
- N/A = 3;
- comparable N = 1,074;
- advance share = 54.7486033519553%;
- decline share = 36.03351955307262%;
- flat share = 9.217877094972067%;
- net advance-minus-decline share = +18.71508379888268 percentage points;
- comparable coverage = 99.26062846580407%.

TPEx same-clock breadth is preserved as UNKNOWN in this receipt because an equally verified current denominator was not frozen before the decision cutoff.

## Frozen TAIEX context

The exact existing D18_TAIEX_CONTEXT_V0_1_RESEARCH formula is reused without threshold changes.

25-session window ending 2026-10-07 gives:
- MA20 = 47,577.466;
- MA20 five official sessions earlier = 46,911.3815;
- MA20 slope over five official sessions = +666.0845;
- 5-session return = +3.8928555263%;
- 20-session return = +5.2404298923%;
- realized volatility 5 = 0.009369687857411083;
- realized volatility 20 = 0.009596370587846249;
- volatility ratio 5/20 = 0.9763782850651622;
- trendContext = UP_TREND_CONTEXT;
- volatilityDirection = VOL_CONTRACTING.

History-window hash:
`6645e596fb59f53dc5d7218734b7224b0ec4850fb0ce60a4596f73610a588227`

Official-session-window hash:
`72325e6cb39b7362e397fc0dec097d80e25e3587ff0d7250b120a5ff944b421d`

TAIEX-context receipt hash:
`5693e2d58d2ecbe192b07c838b413ceba728505f8c4f966eeb37eeec0f24a1ef`

TWSE breadth receipt hash:
`fce59775c8298dcd6be9dd3bdd8c33c754241a01f004d2fc6b7493a740a18d25`

Joint receipt hash:
`0990d30af73efc932aeb25be9476cfff154e03ba77b7c6bd3457d85c65ca687b`

## Same-clock binding

Both the TAIEX context and TWSE breadth are bound to the same research decision cutoff:
`2026-10-07T23:55:26+08:00`.

The joint receipt is same-date and outcome-blind.

No retrospective 2026-10-07 source is relabeled as having been known before the current observation.
No future return / ranking / selection / position outcome is accessed.

## Important falsification

2026-10-06 replay witness:
- TAIEX +0.22%;
- combined descriptive breadth was negative.

2026-10-07 prospective TWSE-only witness:
- TAIEX -0.03%;
- TWSE stock-direction breadth is positive.

Therefore the divergence direction can reverse across adjacent sessions.

Permanent rule:
`CAP_WEIGHTED_INDEX_DIRECTION != EQUAL_STOCK_DIRECTION_BREADTH`.

Also:
`ONE_DAY_BREADTH_REGIME_STATE != PREDICTIVE_ALPHA`.

## Maturity decision

D09-12 is promoted from L2 / 40% to L3 / 60%.

Reason:
the canonical L3 requirement is Taiwan PIT data source / semantics / replay feasibility. BR-066 provides the first bounded same-date prospective joint receipt under one decision cutoff using official TWSE breadth and official TAIEX context, while unavailable TPEx scope remains UNKNOWN.

This promotion does not claim:
- canonical BROAD_POSITIVE / BROAD_NEGATIVE label;
- full dual-market breadth;
- predictive stock-selection value;
- L4 prospective/OOS evidence;
- any System1/System2 policy change.

## Exact next

BR-067:
accumulate independent same-clock joint receipts, preferably with both TWSE and TPEx breadth and continuity-certified median-return context; keep outcomes closed until D16 common-support / OOS validation is preregistered.

Formal Core unchanged.
