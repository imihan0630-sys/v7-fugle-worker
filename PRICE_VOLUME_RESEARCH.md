# Price-Volume Relationship Research

Updated: 2026-09-25 Asia/Taipei
Research lane: PV-001
Status: ACTIVE / research-only
Governance: Formal Core LOCKED. No production strategy change from this file.

## Mission
Continuously study price-volume relationships for the Taiwan stock selection / monitoring system.
The goal is not to collect technical-analysis slogans. Each idea must be tested from supporting and opposing angles, mapped against current system features, and classified as redundant, falsified, uncertain, or worthy of Shadow research.

## Mandatory reasoning rule
For every price-volume hypothesis:
1. State the proposed mechanism.
2. State the opposite interpretation and failure mode.
3. Identify where the signal occurs: breakout, pullback, base, late-stage advance, reversal, or intraday execution.
4. Separate raw volume, relative volume, turnover, traded value, and price impact.
5. Check redundancy with existing Formal and K-line / pattern research.
6. Pre-register measurable features before looking at future returns.
7. Treat missing evidence as UNKNOWN.
8. No Formal Core change without owner approval.

---

# PV-001 — Volume is information, but “more volume = better” is not a valid rule

## Core evidence

### A. Volume contains information not fully captured by price alone
Blume, Easley & O'Hara (1994), Journal of Finance, “Market Statistics and Technical Analysis: The Role of Volume.”
- Their equilibrium model shows aggregate volume can reveal information about signal quality that price alone does not fully reveal.
- Implication: joint price-volume sequences can be worth studying rather than price-only patterns.

Source:
https://doi.org/10.1111/j.1540-6261.1994.tb04424.x

### B. Price-change magnitude and volume are related
Karpoff (1987), Journal of Financial and Quantitative Analysis, survey of price-volume research.
- Volume is positively related to the absolute magnitude of price change.
- In equity markets, volume is also positively related to the signed price change in many settings.
- This is descriptive, not a trading rule.

Source:
https://doi.org/10.2307/2330874

### C. Abnormally high volume can precede short-horizon continuation
Gervais, Kaniel & Mingelgrin (2001), Journal of Finance, “The High-Volume Return Premium.”
- Stocks with unusually high recent volume tended to appreciate over the following month in their sample, while unusually low-volume stocks tended to depreciate.
- The proposed mechanism includes increased investor visibility / attention.
- Later work also finds the premium is strongest early and can weaken or reverse with longer holding periods.

Sources:
https://doi.org/10.1111/0022-1082.00349
https://doi.org/10.1111/j.1475-6803.2010.01266.x

### D. But high past turnover can also signal faster momentum decay
Lee & Swaminathan (2000), Journal of Finance, “Price Momentum and Trading Volume.”
- Past volume helps predict the magnitude and persistence of momentum.
- High-volume winners reversed faster at long horizons; low-volume winners had more persistent momentum characteristics.
- Taiwan evidence is directionally compatible: a 2022 Taiwan listed/OTC study reports lower-turnover winners outperforming higher-turnover winners over intermediate horizons, though it did not observe the same long-run reversal in all settings.

Sources:
https://doi.org/10.1111/0022-1082.00280
https://ah.lib.nccu.edu.tw/item?item_id=159940&locale=zh_TW

### E. Taiwan-specific abnormal-volume evidence exists
Lu & Lee (2016), Taiwan 50 sample, “Is Abnormally Large Volume a Clue?”
- Abnormal trading volume contained information about future price movement in their sample.
- They used out-of-sample and sensitivity tests.
- This supports researchability, not a universal threshold.

Source:
https://doi.org/10.5539/ijef.v8n9p226

### F. Taiwan market microstructure makes intraday raw volume time-of-day dependent
Lee, Fok & Liu (2001) use Taiwan order-flow data and find intraday trading volume / order activity is strongly time-of-day patterned (J-shaped), with high activity near open and close.
Fan & Lai (2006) also document familiar inverse-J / U-shaped intraday patterns for Taiwanese securities.
- Therefore a 15-minute bar's raw volume or volume vs immediately previous bars can confound true abnormal participation with normal time-of-day seasonality.

Sources:
https://doi.org/10.1111/1468-5957.00371
https://doi.org/10.1016/j.irfa.2006.02.005

### G. Price impact is separable from raw volume
Amihud (2002) defines an easily computed daily price-impact proxy as |return| / dollar volume.
- It measures how much price movement accompanies a unit of traded value.
- Important caveat: later research notes close-to-close returns include overnight movement while regular-session volume does not; open-to-close variants reduce that mismatch.

Sources:
https://doi.org/10.1016/S1386-4181(01)00024-6
https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3335508

---

## Existing system baseline — do not duplicate blindly
Current `Worker.js` already includes:
- `avgVolume20Lots`
- `avgAmount20`
- `volumeRatio = avg(volume last 5) / avg(volume last 20)`
- `volumeTodayVsPrev5 = todayVolume / previous-5-day average`
- `volumeContraction5to20 = previous-5-day average / previous-20-day average`
- A-channel pullback volume condition: today/prev5 <= 1.05 OR 5-to-20 contraction <= 0.95.
- B-channel breakout volume hard gate: today/prev5 >= 1.3.
- B setup quality increases monotonically with `volumeTodayVsPrev5` until capped, while also rewarding strong close and penalizing upper shadow.
- Intraday bar builder currently compares each bar's volume mainly with the previous 5 bars and labels >=1.3x / >=1.5x as attack / strong-attack volume.

Therefore the research gap is NOT “add volume.”
The gap is conditional interpretation, normalization, and interaction.

---

# PV-001A — Candidate factor family: Contextual Relative Volume

## Hypothesis
Relative volume should be interpreted differently depending on price location and state, rather than as one monotonic score.

### Constructive interpretations
- Breakout + above-normal relative volume + strong close + range expansion + later acceptance above breakout:
  possible broad participation / information incorporation.
- Pullback + contracting relative volume + support held + narrowing range:
  possible supply drying up while trend remains intact.
- Base / compression + quiet volume followed by controlled expansion:
  possible transition from low-attention accumulation to active price discovery.

### Opposing interpretations
- Breakout + extreme volume + little net price progress / long upper shadow:
  may be distribution, absorption, exhaustion, or two-sided disagreement.
- Pullback + low volume + weak close / repeated inability to rebound:
  may be lack of demand rather than constructive supply contraction.
- Extreme high-volume winner after an already extended run:
  may be attention climax and have shorter remaining persistence.
- Low raw volume in an illiquid stock:
  can create deceptive price jumps and poor execution quality.

## Research features to pre-register
No thresholds promoted yet.

Daily:
- RVOL_5 = todayVolume / median or mean prior 5 sessions.
- RVOL_20 = todayVolume / median or mean prior 20 sessions.
- LOGVOL_Z20 / LOGVOL_Z60 = z-score of log(volume).
- TURNOVER_Z if point-in-time shares outstanding/free-float data becomes reliable.
- AMOUNT_RVOL20 = tradeValue / prior-20-day tradeValue baseline.
- RANGE_EXPANSION = trueRange / ATR20.
- BODY_EFFICIENCY = |close-open| / max(high-low, epsilon).
- CLOSE_LOCATION = (close-low)/(high-low).
- PRICE_PROGRESS_PER_VOLUME = session return or open-to-close return scaled by traded value; research-only, not interpreted as a standalone liquidity alpha.
- BREAKOUT_DISTANCE / SUPPORT_DISTANCE / LATE_STAGE / GAP context from existing structure.

Intraday 15-minute:
- SLOT_RVOL = current 15m volume / historical median volume for the same 15m slot across prior N valid sessions.
- CUMVOL_PACE = cumulative volume up to time t / historical expected cumulative volume up to same time t.
- SLOT_PRICE_EFFICIENCY = bar return/range/close-location conditional on SLOT_RVOL.
- OPEN/CLOSE bucket flags so normal opening/closing activity is not mislabeled as abnormal attack volume.

## Why this may help current system
Current B logic correctly requires price structure + strong close + limited upper shadow, but still has a one-direction volume reward: more relative volume raises setup quality until a cap.
PV-001A tests whether the missing variable is not “more volume,” but “appropriate volume for the price response and lifecycle stage.”

## Main falsification tests
Reject or downgrade the candidate if:
- RVOL variants add no incremental information after current `volumeTodayVsPrev5`, close-position, upper-shadow, ret20, ATR, sector strength, institutional flow, and Pattern Maturity.
- apparent improvement exists only in one market regime or one date cluster.
- effect disappears after transaction cost / slippage controls.
- same-time-slot intraday normalization does not improve false-signal discrimination versus current previous-5-bar volume ratio.
- the signal only works after outcome-tuned thresholds.

Status: WORTH_SHADOW_RESEARCH, not Formal.

---

# PV-001B — Candidate event: Effort-versus-Result / Volume-Price Efficiency

## Hypothesis
A large increase in volume is most informative when interpreted with how efficiently price responds.

Four research quadrants:

1. High volume + strong upward price progress
   - Positive view: demand overwhelms supply; participation confirms move.
   - Negative view: if late-stage/extreme gap/near major resistance, could be climax.

2. High volume + weak upward progress / upper rejection
   - Negative view: supply absorbs demand / distribution / exhaustion.
   - Alternative view: legitimate accumulation can absorb large supply before a later breakout; one bar alone cannot decide direction.

3. Low volume + price holds/rises efficiently
   - Positive view: little supply available; quiet strength.
   - Negative view: illiquidity / low participation can exaggerate small trades.

4. Low volume + weak price / failed rebound
   - Negative view: absence of demand.
   - Alternative view: normal consolidation if structure and sector remain strong.

## Programmatic implication
Do NOT encode these as direct buy/sell rules.
Research them as interaction features and event labels:
- `volume_state x price_efficiency x structure_location x overheat_state`
- require follow-through / acceptance before directional classification when ambiguity remains.

Status: WORTH_SHADOW_RESEARCH.

---

# PV-001C — Intraday seasonality normalization is a high-priority research candidate

## Problem
The current 15m bar logic computes `volumeRatio = current bar / average(previous 5 bars)`.
Because Taiwan intraday volume is structurally high near the open and close and lower in the middle of the session, a bar can appear “strong-volume” or “low-volume” simply because of clock time.

## Candidate
Research-only same-slot expected-volume baseline:
- for each 15-minute slot, maintain historical median/mean volume for that stock and slot;
- optionally scale by that day's cumulative market/stock volume pace;
- compare current bar against the same time-of-day distribution, not only the previous five bars.

## Positive case
Could reduce false attack-volume labels and make 15-minute confirmation more comparable across the trading day.

## Counter-case
- Requires enough historical intraday coverage.
- Corporate actions, halts, shortened sessions, auction behavior, newly listed stocks, and unusual event days can distort slot baselines.
- A slot-normalized measure can over-normalize genuinely important opening information shocks.
Therefore retain both raw current/prev5 ratio and slot-normalized ratio in research until incremental value is proven.

Engineering classification:
- Class A if isolated to research snapshots/diagnostics with decisionImpact=false.
- Class C if used to alter formal 15-minute confirmation semantics.

Status: HIGH_PRIORITY_SHADOW_CANDIDATE.

---

## Research order after PV-001
PV-002: Volume dry-up vs no-demand — separate constructive pullback contraction from weak participation.
PV-003: Breakout volume quality — threshold vs nonlinear / saturation / climax.
PV-004: Price-volume divergence and effort-result sequences across 3-10 bars.
PV-005: Same-slot 15m volume seasonality and cumulative-volume pace for Taiwan.
PV-006: Volume-price interactions with Pattern Maturity (VCP / cup / platform / W / false breakout).
PV-007: Cross-check with institutional flow and sector participation to distinguish broad participation from isolated attention.
PV-008: Regime conditioning and late-stage / overheat interaction.
PV-009: Prospective Shadow validation with D1/D3/D5/D10, MFE/MAE, stop-first, false-break rate and execution coverage.

## Promotion discipline
No price-volume feature is eligible for Formal merely because literature supports a mechanism.
Promotion requires:
- independent prospective dates,
- non-overlapping / purged validation,
- multiple regimes,
- redundancy controls,
- transaction-cost / liquidity checks,
- no missing-as-zero,
- no historical Shadow fabrication,
- evidence of incremental value over the current Formal and Pattern Research feature set,
- explicit owner approval for any Class C change.


# PV-002 — Volume Dry-Up vs No Demand

## Question
When a stock pulls back on lower volume, is that constructive supply contraction or simply weak demand?

## Evidence boundary
There is no justification for treating “pullback + lower volume” as automatically bullish.
The broader literature supports volume as information, but Lee & Swaminathan (2000) also show that the meaning of volume changes with return path and horizon. Taiwan evidence also shows high/low turnover relationships are horizon-dependent. Therefore this must be treated as a conditional state, not a one-bar slogan.

## Constructive mechanism — supply dry-up
A pullback can be constructive when:
- the prior trend / relative strength remains intact;
- price approaches an identified support or prior breakout level;
- downside price progress becomes smaller while volume contracts;
- range contracts and closes improve rather than repeatedly finishing at the low;
- the stock remains liquid enough that “low volume” is not merely sparse trading;
- sector / market context is not collapsing;
- later demand reappears without requiring an excessive chase.

Interpretation: fewer holders are willing to sell into the pullback, so less trading effort is required to stabilize price.

## Opposing mechanism — no demand
The same low-volume pullback can be weak when:
- each rebound attempt occurs on equally low or lower volume;
- closes deteriorate, support repeatedly fails, or price drifts down despite low volume;
- the stock is structurally illiquid;
- the sector is weakening and there is no relative-strength support;
- price remains below broken support / neckline;
- low volume follows a high-attention spike and reflects interest disappearing rather than supply drying up.

Interpretation: sellers may not be aggressive, but buyers are absent too.

## Research-only feature specification v0.1
Define an as-of-date pullback segment from the latest confirmed local high / structural level.

Candidate measurements:
- `PULLBACK_VOLUME_RATIO`: mean/median volume during pullback divided by pre-pullback baseline.
- `DOWN_BAR_VOLUME_RATIO`: volume on negative-return bars divided by baseline.
- `PULLBACK_PRICE_SLOPE`: normalized decline per session.
- `RANGE_CONTRACTION`: median true range in late pullback vs early pullback / ATR20.
- `CLOSE_RECOVERY`: trend in close-location within the pullback.
- `SUPPORT_HOLD_DISTANCE`: existing structure support distance / violation state.
- `REBOUND_DEMAND_STATE`: prospective later state only; volume/price response when price attempts to turn up.
- `LIQUIDITY_CONTEXT`: avgVolume20Lots, avgAmount20, spread/depth when available.
- `SECTOR_RELATIVE_STATE`: current sector strength / residual RS context.

### Candidate states
- `SUPPLY_DRY_UP_CANDIDATE`: volume contracts + downside efficiency weakens + range contracts + support holds.
- `NO_DEMAND_RISK`: volume contracts but price/close structure deteriorates or rebounds fail to attract participation.
- `AMBIGUOUS_LOW_VOLUME`: evidence insufficient; remain UNKNOWN-like research state.

No state is a Formal buy/sell signal.

## Bias controls
- Do not define the pullback endpoint with future reversal information.
- A dry-up candidate must be detectable as-of-date.
- Rebound demand is a later confirmation state, not retroactive proof that the earlier pullback “was” constructive.
- Do not use low volume as positive evidence for stocks failing existing liquidity requirements.
- Compare incremental value against current A-channel `volumeTodayVsPrev5`, `volumeContraction5to20`, support distance, ret20, ATR, sector strength and Pattern Maturity.
- Test failures as aggressively as successes.

## Program relevance
The current A-channel already accepts volume contraction. PV-002 is potentially valuable only if it separates two cases currently merged by the same gate:
1. true constructive contraction;
2. weak participation / no-demand drift.

Status: WORTH_SHADOW_RESEARCH. Any later A-channel gate/ranking change would be Class C.


# PV-003 — Breakout Volume Quality Is Probably Nonlinear

## Question
Should the system continue treating larger breakout volume as monotonically better up to the current cap?

## Evidence
Supporting continuation:
- Gervais, Kaniel & Mingelgrin (2001) document a short-horizon high-volume return premium.
- Taiwan abnormal-volume studies also find predictive information in unusual volume.

Counter-evidence:
- Lee & Swaminathan (2000) find high-volume winners can reverse faster over longer horizons.
- Huang, Heian & Zhang (2011) argue high-volume shocks can arise from different mechanisms. Their evidence shows high-volume premiums are weaker/inconsistent in Asian markets, and high-volume shocks associated with overconfidence can produce inferior returns. Their U.S. evidence also finds stronger high-volume premiums when institutional ownership rises.
- Disagreement research shows elevated trading volume can arise from belief dispersion rather than one-sided informed demand.
- Therefore an extreme-volume breakout can mean strong information incorporation, disagreement, attention, overconfidence, or climax. Volume magnitude alone cannot identify which mechanism dominates.

Sources:
https://doi.org/10.1111/j.1475-6803.2010.01283.x
https://doi.org/10.1016/j.iref.2014.11.012
https://doi.org/10.1257/jep.21.2.109
https://doi.org/10.1093/rapstu/raab008

## Existing system interaction
Current B-channel:
- requires `volumeTodayVsPrev5 >= 1.3`;
- increases `setupQuality` as `volumeTodayVsPrev5` rises until a cap;
- already adds close-position and upper-shadow information.

This is better than raw volume alone, but still embeds an approximately monotonic assumption inside the accepted range.

## Research design v0.1
Do not immediately replace the 1.3 threshold.
First estimate the prospective response curve.

Use:
- current `volumeTodayVsPrev5`;
- RVOL_20;
- log-volume z-score;
- trade-value RVOL;
- breakout distance;
- close location;
- body/range efficiency;
- upper-shadow ratio;
- gap size;
- ret20 / maDistance / lateStage;
- institutional net activity normalized by average volume;
- sector breadth / sector volume;
- Pattern Maturity and false-break structure.

Research breakout volume in pre-registered buckets or a smooth monotonicity diagnostic:
- below-normal;
- ordinary;
- moderate expansion;
- high expansion;
- extreme tail.

Bucket boundaries should be fixed from historical distribution quantiles or a training sample before holdout outcomes are inspected, not hand-tuned after seeing returns.

## Key competing hypotheses
H1 — confirmation:
moderate/high RVOL + strong close + efficient range expansion + sector/institutional participation -> better continuation.

H2 — climax:
extreme RVOL + late-stage extension + gap/upper rejection + poor price progress -> worse remaining upside / faster reversal.

H3 — disagreement/absorption:
extreme RVOL + little price progress is ambiguous; it may be distribution OR strong absorption. Direction should remain unresolved until subsequent acceptance/failure evidence.

H4 — quiet breakout:
a lower-volume breakout may still work when supply is unusually scarce, but it may also be fragile. This is where Pattern Maturity, liquidity and retest acceptance become critical.

## Proposed research outputs
- D1/D3/D5/D10 returns by RVOL bucket.
- MFE/MAE and stop-first.
- breakout acceptance / close-back-inside-base rate.
- retest-hold rate.
- performance conditional on lateStage and market regime.
- incremental value after current close-position and upper-shadow rules.
- same-date pair comparisons where possible to reduce market-date confounding.

## Program relevance
A credible result could eventually justify replacing the monotonic B setup-volume reward with a contextual/nonlinear volume-quality term.
That would be Class C and cannot be promoted automatically.

Status: HIGH_PRIORITY_SHADOW_RESEARCH.


# PV-004 — Sequence-Level Effort vs Result: first specification

## Why sequences matter
A single bar with high volume and little price progress is directionally ambiguous.
A sequence can separate some cases without pretending certainty.

Prospective event grammar:
- `HV_STRONG_PROGRESS`: abnormal volume + strong directional progress.
- `HV_STALLED`: abnormal volume + weak progress / rejection.
- `LV_HOLD`: low relative volume + support/base holds.
- `LV_DRIFT`: low relative volume + persistent adverse drift.
- `ACCEPTANCE`: later close(s) remain beyond the structural level.
- `FAILURE`: later close returns inside / through the broken level.

Research sequence examples:
- HV_STRONG_PROGRESS -> LV_HOLD -> renewed progress: possible healthy breakout/retest sequence.
- HV_STALLED -> repeated HV_STALLED -> FAILURE: possible distribution/exhaustion sequence.
- LV_HOLD -> rising price efficiency before volume expansion: possible quiet accumulation / low-supply state.
- LV_DRIFT -> weak rebound demand -> support break: no-demand sequence.

Critical rule:
later states may update the live research lifecycle, but cannot be used to rewrite what the system knew at the original timestamp.

Status: SPECIFIED_FOR_SHADOW_DESIGN.
