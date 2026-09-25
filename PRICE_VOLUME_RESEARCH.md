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


# PV-005 — Taiwan Same-Slot 15-Minute Volume Normalization

## Feasibility
Fugle Historical Candles supports intraday timeframes including 15 minutes.
Its documented historical intraday coverage begins 2023-05-23.
This makes a research-only same-slot baseline feasible without changing Formal data semantics.

Official docs:
https://developer.fugle.tw/docs/data/http-api/historical/candles/
https://developer.fugle.tw/docs/data/http-api/intraday/candles/

## Problem with current previous-5-bar comparison
Current intraday logic uses the current bar divided by the average of the previous five bars.
That is useful as a local acceleration measure, but it mixes two effects:
1. genuine abnormal participation;
2. normal time-of-day volume seasonality.

Taiwan microstructure research shows opening/closing activity is structurally different from midday activity.
Therefore “1.5x previous five bars” is not equivalent at 09:15, 11:30 and 13:15.

## Research-only baseline v0.1
For each symbol and 15-minute slot:
- build a rolling history of prior valid sessions;
- use robust medians first, because event days can create extreme outliers;
- preserve mean/std alternatives for z-score comparison.

Candidate fields:
- `SLOT_VOLUME_MEDIAN_20`
- `SLOT_RVOL_20 = currentSlotVolume / median(prior same-slot volume)`
- `SLOT_LOGVOL_Z20`
- `CUM_VOLUME_TO_SLOT`
- `CUMVOL_MEDIAN_TO_SLOT_20`
- `CUMVOL_PACE_20 = current cumulative volume / median historical cumulative volume to same slot`
- `LOCAL_ACCEL_PREV5` = retain current metric for independent comparison
- `SLOT_EXCESS_VS_DAY_PACE` = SLOT_RVOL / max(CUMVOL_PACE before/current slot, epsilon), exploratory

## Minimum data rules
Research proposal:
- require >=20 valid historical sessions for primary slot baseline;
- expose coverage count, median, MAD/std and missing-session count;
- insufficient coverage = UNKNOWN, not neutral 1.0;
- do not silently fill halted / non-trading slots with zero;
- newly listed or frequently halted symbols remain data-limited.

The exact minimum must be frozen before return-outcome comparison.

## Special-session handling
Exclude or separately flag:
- shortened / exceptional exchange sessions;
- prolonged trading halts;
- no-trade bars;
- obvious data gaps;
- newly listed periods with unstable baseline;
- symbols/timeframes whose volume unit semantics differ from ordinary listed shares.

## Three interpretations to retain simultaneously
1. `LOCAL_ACCEL_PREV5`: did activity accelerate relative to the immediately preceding bars?
2. `SLOT_RVOL`: is this bar unusual for this time of day?
3. `CUMVOL_PACE`: is the entire day running above/below its normal participation pace?

None subsumes the others.

Example:
- 09:00 bar can be 3x previous-bars conceptually impossible / unstable because no prior five bars exist, but SLOT_RVOL has a valid historical comparison.
- 13:15 bar may be high versus midday previous bars but ordinary for late-session seasonality.
- a stock can have high CUMVOL_PACE all day while one slot has no incremental surge.

## Validation
Compare current intraday volume metric vs same-slot variants on:
- formal selected names only first, to avoid selection contamination;
- prospective dates with complete recorder coverage;
- whether BUY-trigger / NO-BUY classification is better explained;
- false breakout / maxChase / no-retest outcomes;
- MFE/MAE after observation;
- morning vs midday vs late-session strata.

No historical reconstruction of BUY states from later prices.

## Engineering class
- Isolated historical fetch + research snapshot + diagnostics: Class A.
- Any change to Formal 15m confirmation / BUY semantics: Class C.

Status: IMPLEMENTABLE_AS_CLASS_A_RESEARCH, but not yet justified as Formal logic.


# PV-006 — Integration with Pattern Maturity: volume must describe lifecycle, not duplicate pattern names

## Principle
Pattern research already concludes named patterns should be decomposed into latent geometry.
Price-volume research should attach participation / supply-demand state to those same lifecycle states instead of creating separate “volume patterns” that double-count the same setup.

## Integration map

### VCP / contraction structures
Geometry already measures contraction legs.
Price-volume research adds:
- whether volume contracts across non-overlapping legs;
- whether range contraction and volume contraction occur together;
- whether final contraction shows low supply without loss of support;
- whether breakout participation is moderate/healthy or extreme/climactic.

Opposing case:
volume contraction can simply reflect fading interest. Require relative-strength / support / rebound-demand context.

### Cup-with-Handle
Geometry defines cup and handle maturity.
Price-volume adds:
- handle volume relative to cup/right-side baseline;
- downside-bar volume during handle;
- breakout RVOL quality;
- post-break acceptance.

Opposing case:
a very quiet handle with weakening closes can be no demand, not constructive drying supply.

### W / Double Bottom
Geometry defines two troughs and neckline.
Price-volume adds:
- selling effort on first vs second trough;
- price response per unit volume;
- neckline-break participation;
- whether retest volume contracts while neckline holds.

Opposing case:
a low-volume second low is not automatically accumulation; it can be thin participation.

### Platform / Flag / Triangle
Geometry defines compression and boundary.
Price-volume adds:
- participation decay through the base;
- local vs same-slot breakout surge;
- acceptance / failure lifecycle.

Opposing case:
volume contraction inside a base may have little discriminating power; breakout quality may carry more information. Treat formation-volume claims as hypotheses, not axioms.

### False breakout / Upthrust / Spring
Geometry detects level breach and re-entry.
Price-volume adds:
- breach RVOL and price-efficiency;
- rejection effort;
- re-entry participation;
- follow-through.

Critical ambiguity:
high-volume rejection can be distribution or absorption. Direction is not resolved from the breach bar alone.

## Anti-Factor-Zoo rule
Do not separately score:
“VCP volume contraction,” “cup handle dry-up,” “platform dry-up,” and “W second-bottom low volume”
if they are all manifestations of the same latent variable.
Prefer one reusable `SUPPLY_CONTRACTION_STATE` attached to pattern lifecycle.

Status: INTEGRATION_ARCHITECTURE_DEFINED.


# PV-007 — Institutional / Sector Participation as a Moderator, not a duplicate factor

## Evidence
Huang, Heian & Zhang (2011) find high-volume premiums can differ by the mechanism producing the volume shock; in their U.S. evidence, increased institutional ownership is associated with stronger high-volume premiums.
Taiwan research on price contribution also finds professional institutions' order aggressiveness / trade size can carry different information from aggregate retail-heavy activity.

Sources:
https://doi.org/10.1111/j.1475-6803.2010.01283.x
https://doi.org/10.1016/j.iref.2019.10.011

## Existing system
The current system already has:
- institutional score / consecutive buy days / normalized net activity;
- sector score, breadth, amount vs 20-day average and volume vs 20-day average.

Therefore “add institutional volume” or “add sector volume” is likely redundant.

## Better hypothesis
Use them as moderators of abnormal individual-stock volume:
- high stock RVOL + sector participation + institutional participation;
- high stock RVOL without sector confirmation and without institutional support;
- low-volume quiet strength with/without sector persistence.

The question is incremental interaction, not another additive score.

## Counter-interpretations
- institutional flows can be reactive, hedging-related, or already embedded in price;
- broad sector volume can occur near thematic peaks;
- absence of institutional net buying does not prove retail speculation;
- daily institutional data may not align perfectly with intraday event timing.

Status: INTERACTION_ONLY / REDUNDANCY_RISK_HIGH.
# PV-008 — Nonlinear Breakout-Volume Response / Climax Interaction

## Research question
The current B-channel formally requires breakout-day volume / previous-5-day average volume >= 1.3 and then rewards higher relative volume up to a cap. This embeds a partly monotonic assumption: more breakout volume is better, at least over the scored range.

The literature does not justify that assumption as a universal rule. Gervais, Kaniel & Mingelgrin report a high-volume return premium in U.S. stocks, while Wang & Cheng report the opposite sign for extreme-volume stocks in China, especially among prior winners / glamour stocks. Lee & Swaminathan show high-volume winners can reverse sooner over longer horizons. More recent evidence also shows turnover can shift short-horizon behavior from reversal toward momentum in some markets, but this relation is not universal.

Sources:
- https://doi.org/10.1111/0022-1082.00349
- https://doi.org/10.1016/j.pacfin.2004.04.002
- https://doi.org/10.1111/0022-1082.00280
- https://doi.org/10.1093/rfs/hhab055
- https://doi.org/10.1016/j.jempfin.2024.101556

## Positive mechanism
A breakout accompanied by abnormal participation may reflect new information, recognition, broad demand or informed trading. If price accepts the new level, heavy participation can support continuation.

## Opposing mechanism
Extreme volume can also reflect disagreement, attention chasing, forced liquidity, distribution, late-stage crowding or overreaction. In that case the largest volume can be worse than moderate expansion.

## Frozen Shadow study
Do not tune thresholds after outcome inspection. Preserve the Formal >=1.3 rule unchanged and create research-only buckets using the existing `volumeTodayVsPrev5`:
- V0: <1.0
- V1: 1.0 to <1.3
- V2: 1.3 to <1.8
- V3: 1.8 to <2.5
- V4: 2.5 to <4.0
- V5: >=4.0

In parallel, compute own-history percentile / robust z-score so the fixed buckets are not the only view. The fixed bins are diagnostic bins, not buy/sell judgments.

## Climax-candidate interactions
An extreme-volume bar becomes a `CLIMAX_CANDIDATE`, not a bearish label, when abnormal volume coexists with one or more:
- late-stage extension / high ret20 or large MA20 distance;
- large gap;
- poor close location;
- large upper shadow / rejection;
- weak price progress per ATR despite extreme volume;
- sector non-confirmation;
- institution non-confirmation;
- next-bar/day failure to hold the breakout.

Opposite interpretation remains possible: high volume + poor immediate progress can be absorption. Follow-through decides the later state.

## Outcomes
Pre-register:
- D1 / D3 / D5 / D10 return;
- MFE / MAE;
- stop-first;
- close-below-pivot within 1/3/5D;
- retest-hold rate;
- time-to-reacceleration;
- by market regime, liquidity tier, price tier, pattern maturity and late-stage state.

Status: HIGH_PRIORITY_SHADOW_STUDY / FORMAL_UNCHANGED.


# PV-009 — Research-Only Data Schema and Outcome Ledger

## Principle
Price-volume research must be reproducible as-of-time and must never rewrite historical features because later price action became known.

## Daily Shadow record
Proposed research-only record, `decisionImpact=false`:
- schemaVersion, symbol, marketDate, asOfTimestamp, sourceProvenance;
- OHLC, volumeShares, tradeValue;
- rvol5, rvol20, logVolumeZ20 / robust percentile;
- valueRvol20;
- volumeTodayVsPrev5, volumeContraction5to20;
- ATR/range expansion, close location, upper/lower shadow;
- gapPct, ret20, MA20 distance, lateStage;
- pivot / breakout distance in ATR;
- Pattern Maturity state;
- sector participation snapshot;
- institution snapshot;
- liquidity coverage;
- price-limit state;
- dataCoverage / missingness reason;
- decisionImpact=false.

## Intraday Shadow record
Key by `symbol + marketDate + slotEnd`:
- timeframe;
- local previous-5-bar volume ratio;
- same-slot historical median / robust dispersion;
- same-slot relative volume;
- cumulative expected-volume pace;
- OHLC, range, body, close location, shadows;
- price vs session cumulative average when available;
- pivot distance;
- freshness / completed-bar flag;
- historical-slot coverage count;
- decisionImpact=false.

## Outcome ledger
Outcome data are stored separately and joined only after the horizon has elapsed:
- eventId / featureSnapshotId;
- D1/D3/D5/D10;
- MFE/MAE;
- stopFirst;
- falseBreak1D/3D/5D;
- retestHold;
- reacceleration;
- realized horizon completion status.

Never backfill the feature snapshot from the outcome ledger.

## Technical feasibility
Fugle historical candles expose OHLC, volume and daily turnover, and historical intraday candles support 1/3/5/10/15/30/60-minute bars. That is sufficient for isolated daily + 15m Shadow capture without touching Formal logic.

Sources:
- https://developer.fugle.tw/docs/data/http-api/historical/candles/
- https://developer.fugle.tw/docs/data/http-api/intraday/candles/

Status: SCHEMA_DEFINED / CLASS_A_IF_RESEARCH_ONLY.


# PV-010 — Volume Acceptance Lifecycle

## Core idea
A breakout-volume bar is an event start, not a conclusion. Price-volume interpretation should be a state machine that updates only as later evidence arrives.

## Research states
1. `NO_EVENT`
2. `BREAKOUT_ATTEMPT`
3. `INITIAL_ACCEPTANCE`
4. `RETEST`
5. `REACCELERATION`
6. `FAILED_REENTRY`
7. `EXPIRED_OR_AMBIGUOUS`

## Observable transitions
### BREAKOUT_ATTEMPT
As-of bar/date only:
- price probes or closes beyond a pre-existing pivot / platform boundary;
- record RVOL, range, close location, gap and price-limit state.

### INITIAL_ACCEPTANCE
Requires later evidence, for example:
- close remains above / recovers above pivot;
- price progress is not immediately reversed;
- close location remains constructive.

No fixed trading threshold is approved; these are research definitions to freeze before testing.

### RETEST
Observe:
- distance to pivot;
- whether volume contracts relative to breakout event;
- whether downside price progress is small relative to selling effort;
- whether the close recovers / holds structure.

### REACCELERATION
Observe:
- renewed positive price progress;
- improvement in close location;
- renewed participation relative to the retest phase;
- sector / institution moderators.

### FAILED_REENTRY
Observe:
- decisive close back inside the prior range / below pivot;
- expanding downside range or poor recovery;
- later evidence must be timestamped when it actually occurs.

## Why this matters
Llorente, Michaely, Saar & Wang distinguish information-driven high-volume returns, which can continue, from risk-sharing/liquidity-driven high-volume returns, which can reverse. A lifecycle of acceptance/failure is a practical observable proxy for this otherwise latent motive.

Sources:
- https://www.nber.org/papers/w8312
- https://doi.org/10.1093/rfs/15.4.1005

Status: HIGH_VALUE_STATE_MACHINE_CANDIDATE / NO_FORMAL_USE.


# PV-011 — Up-Volume / Down-Volume Asymmetry: Useful Proxy, Dangerous Label

## Research question
Can the direction of volume over multiple bars add information beyond total volume?

## Critical semantic warning
Every executed trade has both a buyer and seller. Calling all volume on an up bar “buy volume” and all volume on a down bar “sell volume” is only a price-direction proxy. It is not true aggressor-side order flow.

## Low-cost proxies worth testing
Daily and 15m research-only variants:
- `signedVolCC = sign(close - prevClose) * volume`;
- `signedVolOC = sign(close - open) * volume`;
- `upDownVolumeBalanceN = (upVolume - downVolume)/(upVolume + downVolume)`;
- positive-bar vs negative-bar volume ratio;
- price progress per signed-volume shock.

## Positive case
Persistent positive signed-volume imbalance with improving price acceptance may reveal directional participation not captured by total RVOL alone. Prior research has used signed-volume-based measures to study momentum / overreaction.

Source:
- https://www.sciencedirect.com/science/article/pii/S1059056022000740

## Opposing case
- bar-signing is noisy and can misclassify gap days / intrabar reversals;
- it can duplicate return momentum, positive-day ratio and close-location features;
- institutional net-flow features already capture a separate directionality signal;
- historical candle data do not provide true historical aggressor-side order flow.

Therefore it must pass an incremental-value test after controlling for existing return, candle, institution and sector variables.

Status: MEDIUM_PRIORITY_SHADOW / HIGH_REDUNDANCY_RISK.


# PV-012 — Turnover / Shares-Outstanding Normalization

## Why raw volume is not cross-stock comparable
100,000 shares can be trivial for one company and huge for another. Cross-stock interpretation should distinguish:
- raw shares;
- traded value;
- share turnover;
- value turnover;
- free-float turnover where defensible.

## Feasible layers
### A. Own-history RVOL
Already highest priority because it avoids cross-sectional size distortion without needing share-count data.

### B. Issued-share turnover
`volumeShares / issuedCommonShares`.

TWSE / public-company basic data include issued common share count and are updated daily. This can support a current cross-sectional turnover research field.

Sources:
- https://openapi.twse.com.tw/
- https://data.gov.tw/dataset/28567

### C. Value-turnover proxy
Current Worker data already contain historical `tradeValue` and current `marketCapYi`. A research proxy `tradeValue / marketCap` is technically possible, but historical use is dangerous if a current market-cap snapshot is applied backward through corporate actions.

## Free-float warning
Issued shares are not free float. A free-float turnover factor should not be invented from issued shares. Until a reliable, timestamped free-float source is available, label free-float turnover UNKNOWN rather than approximate it silently.

## Research position
Use own-history RVOL first. Add issued-share / value-turnover normalization only as secondary cross-sectional context with explicit as-of provenance.

Status: WORTH_SHADOW_RESEARCH / DATA_QUALITY_GATED.


# PV-013 — Taiwan Price-Limit-Aware Price-Volume Semantics

## Current market rule
TWSE stocks normally have daily price fluctuation limits of +/-10% from the auction reference price. Newly TWSE-listed common stocks have no price limit for their first five trading days, subject to the rule's stated exceptions.

Source:
- https://twse-regulation.twse.com.tw/ENG/EN/law/DOC01.aspx?FLCODE=fl007304&FLNO=63
- https://www.twse.com.tw/en/products/system/trading.html

## Why this changes price-volume interpretation
Near an upper or lower limit, observed price progress is censored by market structure. Therefore:
- “extreme volume + little further price progress” can be falsely labeled inefficiency / distribution;
- return-per-volume and range-per-volume metrics are mechanically compressed;
- next-period continuation or reversal can contain information that could not be expressed in the event bar.

Taiwan studies report delayed price discovery / serial-correlation effects around price limits and evidence of overnight continuation followed by later reversal in historical samples. These findings are not a direct modern trading rule, but they are enough to prohibit naive treatment of limit-hit bars as ordinary bars.

Sources:
- https://www.sciencedirect.com/science/article/pii/S0927538X98000110
- https://www.sciencedirect.com/science/article/pii/S1059056000000824
- https://www.sciencedirect.com/science/article/pii/S0927538X19301957

## Shadow fields
- distanceToUpperLimitPct / distanceToLowerLimitPct;
- touchedUpperLimit / touchedLowerLimit;
- closedAtUpperLimit / closedAtLowerLimit;
- priceCensored=true/false;
- firstFiveListingDays / no-limit regime if known;
- intraday lock/reopen metrics only if robust 1m history is available.

## Governance
Generic effort-vs-result regressions should either:
1. exclude price-censored observations, or
2. analyze them as a separate cohort.

A limit-up close is not automatically bullish; a limit-hit reversal is not automatically bearish. The state requires subsequent acceptance / failure evidence.

Status: TAIWAN_SPECIFIC_HIGH_PRIORITY_CONTROL.


# PV-014 — Persistence of Abnormal Volume vs One-Day Shock

## Evidence
Recent research on persistence in abnormal trading volume finds that persistent abnormal-volume episodes can be associated with continued short-run drift, while trading activity later mean-reverts and return behavior can eventually reverse.

Source:
- https://doi.org/10.1080/1351847X.2024.2303092

This is consistent with the broader idea that a single volume spike and a multi-day participation wave are different phenomena.

## Candidate features
Research only:
- abnormalVolumeDays3 / abnormalVolumeDays5;
- rvolPersistence3 / rvolPersistence5;
- mean / median log-RVOL over 3/5 days;
- volumeDecaySlope after event;
- timeSincePeakRVOL;
- persistence x price-acceptance interaction.

## Positive interpretation
Persistent elevated participation plus sustained price acceptance may indicate information diffusion / recognition and continuation.

## Opposing interpretation
Persistent elevated participation late in an extended move may be crowding / attention persistence before exhaustion. If price progress decays while volume stays high, interpretation should worsen rather than improve.

Status: WORTH_SHADOW_RESEARCH / INTERACT_WITH_PV010.


# PV-015 — Turnover x 52-Week-High Context: Evidence Exists, Redundancy Risk High

## Evidence
Chen, Stivers & Sun (2024) report that short-term reversal weakens as turnover and price-to-52-week-high increase, with momentum appearing in stocks that are simultaneously high-turnover and near their 52-week highs.

Source:
- https://doi.org/10.1016/j.jempfin.2024.101556

Related international work finds high-turnover stocks can exhibit short-term momentum, but Chinese-market replications show materially different behavior. This is exactly why the interaction must not be imported as a universal rule.

Sources:
- https://doi.org/10.1093/rfs/hhab055
- https://doi.org/10.1016/j.pacfin.2022.101920

## Current-system overlap
The system already has:
- ret20 / ret60;
- prior highs / high60;
- breakout structure;
- overheat / lateStage logic;
- liquidity constraints.

Fugle `historical/stats` exposes `week52High`, but adding a full-universe call solely for this field may add cost and duplicate existing structure.

Source:
- https://developer.fugle.tw/docs/data/http-api/historical/stats/

## Decision
Treat 52-week-high x turnover as a literature moderator and redundancy test, not a current engineering priority. Only promote if it adds incremental information after the existing high60 / breakout / lateStage variables.

Status: LOW_TO_MEDIUM_PRIORITY / REDUNDANCY_TEST_FIRST.


# Batch synthesis after PV-015

## Strongest candidates so far
1. Same-slot 15m RVOL + cumulative-volume pace.
2. Nonlinear breakout-volume response instead of monotonic “more is better.”
3. Acceptance lifecycle: breakout -> hold -> retest -> reacceleration / failure.
4. Taiwan price-limit-aware censoring control.
5. Persistent abnormal-volume wave vs one-day shock.
6. Constructive dry-up vs no-demand separation.

## Candidates that require restraint
- signed up/down-volume proxies: noisy and potentially redundant;
- share / value turnover: useful context but historical normalization quality matters;
- 52-week-high x turnover: supported in some samples but likely overlaps current breakout / overheat structure;
- institutional / sector volume: moderator only, avoid duplicate additive scores.

## Formal decision
No Formal A/B rule, threshold, capital rule, entry confirmation or push logic is changed by PV-008 through PV-015. All items remain research / Shadow hypotheses until prospective evidence shows incremental value.
# PV-016 — Session Average / VWAP-Style Acceptance: Diagnostic, not Proven Alpha

## Data fact
Fugle intraday / historical intraday candles expose `average`, documented as the cumulative average transaction price from market open for intraday bars.

Sources:
- https://developer.fugle.tw/docs/data/http-api/intraday/candles/
- https://developer.fugle.tw/docs/data/http-api/historical/candles/

## Why it may help
For a breakout / reacceleration event, price staying above the session cumulative average while same-slot participation remains elevated may be a compact description of intraday acceptance. Conversely, repeated failure above the average may show weak acceptance.

Candidate diagnostics:
- `closeVsSessionAvgPct`;
- `lowVsSessionAvgPct`;
- number / fraction of completed bars above session average;
- reclaim / loss events relative to session average;
- interaction with same-slot RVOL and pivot acceptance.

## Strong warning
VWAP is primarily established as an execution benchmark, not a universal return-prediction signal. Academic VWAP literature focuses heavily on execution / tracking, not on “price above VWAP = bullish alpha.”

Source:
- https://doi.org/10.1080/24725854.2019.1688896

Therefore session-average position should be used only as an acceptance descriptor and must prove incremental information beyond:
- close location;
- trend / moving averages;
- breakout distance;
- same-slot RVOL;
- intraday return.

Status: MEDIUM_PRIORITY_DIAGNOSTIC / DO_NOT_PROMOTE_AS_STANDALONE_ALPHA.


# PV-017 — Price Impact / Effort-vs-Result Normalization

## Academic anchor
Amihud's illiquidity measure uses absolute return divided by dollar trading volume as a rough low-frequency price-impact proxy. Later work shows that true intraday order-flow price-impact estimates are richer, and other research argues that part of the Amihud measure's return relation is driven by its volume component rather than pure price impact.

Sources:
- https://doi.org/10.1016/S1386-4181(01)00024-6
- https://doi.org/10.1016/j.finmar.2013.02.001
- https://doi.org/10.1093/rfs/hhx072

## Research interpretation
For our system, “price response per trading effort” may help describe a bar/sequence, but must not be mislabeled as a clean alpha factor.

Candidate research features:
- `absReturn / tradeValue`;
- `trueRangePct / tradeValue`;
- `pivotProgressATR / log(1 + valueRVOL)`;
- signed price progress / abnormal value traded;
- rolling median-normalized versions by symbol.

## Positive interpretation
High price progress per unit effort can indicate thin resistance / efficient directional movement.

## Opposing interpretation
The same ratio can simply indicate illiquidity, small-cap fragility or sparse depth. Very low price progress on huge volume can be either absorption or distribution. Price-limit bars mechanically censor progress.

## Controls
- liquidity gate;
- market cap / price tier;
- spread proxy if available;
- price-limit state from PV-013;
- follow-through state from PV-010.

Status: WORTH_RESEARCH_AS_DIAGNOSTIC / NOT_STANDALONE_SELECTION_FACTOR.


# PV-018 — Taiwan Gap x Volume Archetypes: Overnight Shock vs Intraday Acceptance

## Taiwan-specific evidence
Taiwan's market structure makes the open especially informative because overnight information cannot be continuously incorporated into TWSE-listed stock prices before the next session. Research on Taiwan separates overnight and intraday return behavior and reports that overnight-return patterns are linked to investor sentiment / retail participation, while intraday and overnight components can have materially different predictive behavior.

Sources:
- https://doi.org/10.1016/j.pacfin.2023.102086
- https://doi.org/10.1016/j.pacfin.2023.102044
- https://ideas.repec.org/a/eee/pacfin/v80y2023ics0927538x23001646.html
- https://ideas.repec.org/a/eee/pacfin/v82y2023ics0927538x23002226.html

## Research decomposition
Do not call a positive opening gap “strong” or “exhaustion” by itself.

Separate:
1. `overnightReturn = open / prevClose - 1`;
2. first 15m / 30m same-slot RVOL;
3. intraday drift from open;
4. gap-fill depth;
5. close location / session-average relation;
6. pivot / breakout acceptance;
7. price-limit censoring.

## Candidate archetypes
Research labels only:
- `GAP_INFO_ACCEPTED`: gap + elevated opening participation + later hold / intraday acceptance;
- `GAP_SENTIMENT_RISK`: large gap + extreme opening activity + poor progress / gap erosion;
- `GAP_LOW_PARTICIPATION`: gap without abnormal opening participation;
- `GAP_AMBIGUOUS`: insufficient evidence.

These labels require later as-of transitions; the opening print alone cannot assign the final state.

## Formal relevance
This may eventually help prevent the B breakout channel from treating a gap-driven breakout the same as a continuous-session breakout. For now, no Formal change.

Status: HIGH_VALUE_TAIWAN_SHADOW_CANDIDATE.


# PV-019 — Multi-Timeframe Volume Alignment without Double Counting

## Problem
The system has daily selection context and formal 15m entry confirmation. Adding daily, 60m, 30m, 15m and 10m volume scores independently would count the same participation event multiple times.

## Architecture
Use a hierarchy, not additive points:

### Daily = context
- supply contraction / breakout volume regime;
- late-stage / overheat;
- sector / institution context;
- price-limit / gap context.

### 60m or coarse intraday = transition
Optional research-only view:
- whether opening participation persists or decays;
- whether the event remains above pivot / session average.

### 15m = formal-resolution research layer
- same-slot RVOL;
- completed-bar close / range;
- acceptance / retest / reacceleration state.

### 10m = auxiliary only
Keep current governance: auxiliary diagnostics must not silently become Formal confirmation.

## Anti-duplication rule
A single volume event should contribute one latent participation state, with observations from multiple timeframes updating confidence. Do not award separate points for “daily high volume,” “60m high volume,” and “15m high volume” if they are the same event.

Status: ARCHITECTURE_RULE / FACTOR_ZOO_CONTROL.


# PV-020 — Compact Latent Price-Volume State Architecture

## Goal
Avoid dozens of overlapping factors by separating what price-volume data are trying to answer.

## Layer 1 — Participation state
Possible research states:
- `QUIET`
- `NORMAL`
- `ELEVATED`
- `EXTREME`
- `UNKNOWN`

Derived from own-history RVOL, same-slot intraday RVOL and coverage quality.

## Layer 2 — Price-response efficiency
Possible states:
- `EFFICIENT_UP`
- `EFFICIENT_DOWN`
- `HIGH_EFFORT_LOW_PROGRESS`
- `LOW_EFFORT_LOW_PROGRESS`
- `UNKNOWN`

This layer is descriptive. `HIGH_EFFORT_LOW_PROGRESS` is not directional because it can be absorption or distribution.

## Layer 3 — Structural acceptance lifecycle
From PV-010:
- `PRE_EVENT`
- `BREAKOUT_ATTEMPT`
- `INITIAL_ACCEPTANCE`
- `RETEST`
- `REACCELERATION`
- `FAILED_REENTRY`
- `AMBIGUOUS`

## Layer 4 — Persistence
From PV-014:
- `ONE_OFF`
- `PERSISTENT`
- `DECAYING`
- `UNKNOWN`

## Layer 5 — Constraint / interpretation guard
- `NORMAL_MARKET`
- `PRICE_CENSORED`
- `ILLIQUID`
- `GAP_DOMINATED`
- `DATA_INSUFFICIENT`

## Why this is better than another score
The same 3x volume ratio has different meaning depending on:
- whether the stock is breaking out or already extended;
- whether price progresses efficiently;
- whether the move holds later;
- whether the volume persists;
- whether price is censored by a limit;
- whether the event began as an overnight gap.

The latent-state architecture preserves these distinctions without multiplying near-duplicate scores.

## Candidate system handoff
If eventually validated, the safest first integration is not “add X points.” It is:
- record the latent PV state in Shadow;
- compare outcomes inside existing SELECTED / Near-miss / Rejected cohorts;
- only then ask whether it should alter ranking, eligibility or 15m confirmation.

Any such Formal change remains Class C and requires owner approval.

Status: HIGH_PRIORITY_INTEGRATION_ARCHITECTURE / FORMAL_LOCKED.


# Batch synthesis after PV-020

The research is converging away from “volume indicators” and toward a conditional state model:

`participation -> price response -> structural acceptance -> persistence -> market-structure guard`.

This directly supports the owner's requirement to learn both positive and negative interpretations of the same observation and prevents automatic conversion of a learned idea into a trading rule.

Next research should test:
- whether volume concentration by intraday time block adds information beyond same-slot RVOL;
- whether volume dry-up before breakout and re-expansion after breakout form a stable sequence feature;
- whether price-volume state adds incremental value after Pattern Maturity, Residual RS, sector, institution, overheat and Information Discreteness controls;
- minimum prospective sample / stopping rules before any Shadow implementation is recommended.

