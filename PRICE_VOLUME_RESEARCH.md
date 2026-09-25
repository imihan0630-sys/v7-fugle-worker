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
# PV-021 — Intraday Volume Concentration by Time Block without Look-Ahead

## Evidence / Taiwan context
Taiwan intraday activity has a pronounced time-of-day pattern. A Taiwan study of 429 listed firms around the 2001 trading-hour extension reports U-shaped intraday trading volume and volatility, with stronger information-trading interpretation near the open and different motives near the close. Earlier Taiwan futures evidence also reports U-shaped intraday activity.

Sources:
- https://ir.lib.ncu.edu.tw/handle/987654321/12038
- https://doi.org/10.1002/fut.10040

The historical samples are old, so the U-shape is a structural prior to revalidate with current Fugle data, not a modern trading rule.

## Frozen research blocks for 15m data
For the current ordinary 09:00–13:30 Taiwan cash session, research v0.1 uses:
- OPENING: 09:00–10:00, first 4 completed 15m bars;
- MID: 10:00–12:30, next 10 completed 15m bars;
- CLOSING: 12:30–13:30, final 4 completed 15m bars.

If exchange hours or candle semantics change, increment schemaVersion rather than silently moving boundaries.

## Two different measurements
### A. As-of intraday, usable without future leakage
At the end of each block:
- `BLOCK_VOLUME`;
- `BLOCK_RVOL20 = current block volume / median(prior 20 valid same blocks)`;
- `CUMVOL_PACE20` at that timestamp;
- `BLOCK_SHARE_OF_CUM = current block volume / cumulative volume so far`;
- historical percentile / robust z-score of block volume.

### B. End-of-day descriptive, research-only after 13:30
- `OPEN_SHARE_FULLDAY`;
- `MID_SHARE_FULLDAY`;
- `CLOSE_SHARE_FULLDAY`.

These full-day shares MUST NOT be inserted into a 10:00 or 12:30 decision snapshot because the day's final volume was not yet known.

## Positive interpretation
Unusually concentrated opening activity can indicate rapid incorporation of overnight information. Persistent elevated block activity after the opening can indicate that participation is not merely an opening auction / overnight reset.

## Opposing interpretations
- opening concentration can be retail attention, sentiment or gap-chasing;
- closing concentration can reflect overnight inventory management, benchmark/auction mechanics or end-of-day execution rather than directional information;
- a U-shaped market-wide pattern can make raw block volume look special when it is normal for the clock time;
- one stock's high block volume may simply mirror a market-wide high-volume day.

## Decision
Time-block concentration adds context but does not replace same-slot RVOL. Same-slot normalization remains the primary clock-time control; block concentration is a secondary persistence/shape descriptor.

Status: WORTH_SHADOW_RESEARCH / STRICT_NO_LOOKAHEAD_RULE.


# PV-022 — Dry-Up -> Expansion -> Retest Contraction -> Reacceleration Sequence

## Hypothesis
Practitioner language often treats this four-stage sequence as a constructive setup:
1. supply dry-up before breakout;
2. participation expansion on breakout;
3. volume contraction on retest while structure holds;
4. renewed participation on reacceleration.

This exact sequence should NOT be treated as an established law.

Technical-pattern research by Lo, Mamaysky & Wang shows some objectively detected chart patterns contained incremental return information in their U.S. sample, but that does not validate this specific price-volume sequence. A recent preregistered breakout/retest experiment in U.S. small caps reported that the retest rule it tested did not improve outcomes. The latter is not a universal academic result, but it is a useful falsification warning.

Sources:
- https://www.nber.org/papers/w7613
- https://bbresearch.net/ledger/does-breakout-and-retest-work

## Research state sequence
Use state transitions, not additive points:

### S0 — PRE_BREAKOUT
Record Pattern Maturity and support/pivot geometry.

### S1 — DRYUP_CANDIDATE
Require the PV-002 constructive-supply-dry-up conditions as a research state:
- declining participation relative to own history;
- no material support loss;
- range / downside progress not worsening;
- sufficient liquidity.

A quiet but weakening stock stays `NO_DEMAND_RISK` or `AMBIGUOUS`.

### S2 — BREAKOUT_EXPANSION
Record:
- nonlinear breakout-volume bucket from PV-008;
- same-slot / daily RVOL;
- price-response efficiency;
- gap and price-limit guards.

### S3 — RETEST
Do not require that every successful breakout retests.
If a retest occurs, record:
- volume relative to breakout and its own same-slot baseline;
- downside price progress per ATR;
- pivot hold / re-entry;
- close recovery;
- time elapsed since breakout.

### S4 — REACCELERATION
Record:
- renewed positive price progress;
- participation re-expansion relative to the retest phase;
- acceptance state;
- sector / institutional moderators.

## Falsification cases
The full sequence should be rejected as useful if:
- breakouts without retest perform as well or better;
- retest volume contraction adds no value after pivot-hold geometry;
- “re-expansion” is redundant with the existing 15m strong-close / volume logic;
- benefit appears only after tuning phase lengths or thresholds to outcomes;
- the effect disappears after scan-date / regime controls.

Status: HIGH_VALUE_SEQUENCE_HYPOTHESIS / NOT_ASSUMED_ALPHA.


# PV-023 — Incremental-Value Test: Price-Volume Must Beat What the System Already Knows

## Core question
The research target is not “does a PV feature correlate with returns?” It is:
“Does the PV state add useful information after the existing selector already knows trend, pattern, relative strength, sector, institutions, overheat, liquidity and information discreteness?”

## Baseline controls
At minimum include available as-of features from:
- Formal A/B eligibility and quality;
- Pattern Maturity;
- Residual RS;
- sector strength / breadth;
- institutional activity;
- ret20 / ret60 / MA state;
- overheat / lateStage;
- liquidity tier / price tier;
- Information Discreteness;
- market regime;
- gap / price-limit guard.

## Comparisons
Primary comparisons remain inside the existing funnel:
1. SELECTED: PV-strong vs PV-weak;
2. Near-miss: PV-strong vs matched PV-weak;
3. Rejected control: PV-strong vs matched controls;
4. BUY-triggered vs NO-BUY among the same selected plan cohort.

Prefer same-scan-date or date-matched comparisons to reduce market-regime contamination.

## Leakage controls
- Split train/validation by date blocks, never random individual rows from the same date.
- All PV features are frozen as-of observation timestamp.
- Later retest/reacceleration states may evaluate later actions but cannot rewrite earlier features.
- If thresholds are changed, create a new schema version and restart prospective validation rather than back-edit history.

## Multiple-testing controls
White's Reality Check and Harvey-Liu-Zhu both document why repeated testing on the same return history creates false discoveries. Therefore:
- pre-register primary PV hypotheses;
- cap the number of primary variants;
- report all tested variants, not only winners;
- use false-discovery / multiple-testing-aware inference where statistical claims are made;
- require out-of-sample / forward evidence, not only in-sample t-statistics.

Sources:
- https://doi.org/10.1111/1468-0262.00152
- https://www.nber.org/papers/w20592

## Promotion criterion concept
A PV feature is useful only if it shows:
- incremental outcome separation beyond baseline;
- stable sign across more than one time block / market regime where coverage is adequate;
- economically meaningful MFE/MAE / failure-rate improvement, not only a tiny p-value;
- no unacceptable coverage loss;
- no obvious duplication of an existing Formal variable.

Status: REQUIRED_GATE_BEFORE_ANY_FORMAL_PROPOSAL.


# PV-024 — Prospective Coverage, Sample and Stopping Rules

## Why no universal magic sample size
Event-study power depends on effect size, event clustering, firm characteristics, event-induced variance and benchmark design. Research on event studies shows sample selection can bias inference, and even a paper studying small stock exchanges that suggested about 25 events as a minimum did so for its own particular setup. That number is not adequate as a universal promotion threshold for our clustered multi-feature Taiwan selector.

Sources:
- https://doi.org/10.1016/j.jempfin.2009.01.003
- https://doi.org/10.1080/13518470600880176

## Pre-registered operational gates v0.1
These are engineering/research governance gates, NOT claims of universal statistical sufficiency.

### Feature-computation coverage
- same-slot / block baseline: >=20 prior valid sessions, matching PV-005;
- less than 20 => UNKNOWN;
- no zero-filling of halts / missing bars.

### Pilot stage
Purpose: data-quality and semantics only.
- first 50 completed symbol-events may reveal bugs / missingness;
- no alpha promotion decision from this stage;
- definitions may be corrected only for semantic/data bugs, with versioning.

### Evidence stage
Begin outcome interpretation only after:
- >=100 completed symbol-events;
- >=30 distinct market dates represented;
- no single scan date contributes >10% of the primary event sample;
- main comparison cohorts each have enough observations to show distributions, not isolated anecdotes.

These are conservative operational floors, not a claim of statistical power.

### Stability milestones
Evaluate at predeclared milestones such as 100 / 250 / 500 completed events.
Do not continuously retune thresholds after every new winner/loser.
A candidate that changes sign materially across milestones is unstable / UNKNOWN.

### Regime coverage
If a BULL/MIXED/BEAR or liquidity/price-tier subgroup has insufficient observations, report it as INSUFFICIENT rather than averaging it away.

## Outcome uncertainty
Use confidence intervals / date-clustered resampling where feasible and report raw effect sizes:
- return lift;
- MFE / MAE difference;
- false-break reduction;
- stop-first difference;
- coverage / zero-pick impact.

## Stop / archive rules
Archive or demote a candidate when:
- effect is economically trivial after adequate coverage;
- incremental value disappears after baseline controls;
- sign is unstable across milestones;
- benefit comes from one market date / one sector;
- data cost or missingness overwhelms benefit;
- it is a duplicate description of an existing factor.

Status: PROSPECTIVE_GOVERNANCE_DEFINED.


# PV-025 — Minimum Viable Price-Volume Shadow Feature Set

## Goal
Implement the smallest useful research set, not every interesting feature found in the literature.

## Keep existing fields
Do NOT duplicate fields already present in Worker:
- `volumeTodayVsPrev5`;
- `volumeContraction5to20`;
- `avgVolume20Lots`;
- `avgAmount20`;
- daily close position / upper shadow;
- ret20 / lateStage;
- sector and institutional context;
- existing 15m local previous-5-bar `volumeRatio`.

## Proposed new minimal Shadow fields
All are `decisionImpact=false`.

### 1. `pvDailyRvol20`
Own-history daily participation normalization.
Primary purpose: distinguish truly abnormal daily activity from raw high volume.

### 2. `pvSlotRvol20`
15m current slot / prior-valid-sessions same-slot median.
Primary purpose: remove Taiwan clock-time seasonality.

### 3. `pvCumvolPace20`
Cumulative volume to current slot / historical median cumulative volume to same slot.
Primary purpose: distinguish one-bar burst from an elevated whole-day participation regime.

### 4. `pvResponseState`
One of:
- EFFICIENT_UP
- EFFICIENT_DOWN
- HIGH_EFFORT_LOW_PROGRESS
- LOW_EFFORT_LOW_PROGRESS
- UNKNOWN

No directional inference from HIGH_EFFORT_LOW_PROGRESS alone.

### 5. `pvAcceptanceState`
Lifecycle state from PV-010:
PRE_EVENT / BREAKOUT_ATTEMPT / INITIAL_ACCEPTANCE / RETEST / REACCELERATION / FAILED_REENTRY / AMBIGUOUS.

### 6. `pvPersistenceState`
ONE_OFF / PERSISTENT / DECAYING / UNKNOWN.

### 7. `pvGuardState`
NORMAL_MARKET / PRICE_CENSORED / ILLIQUID / GAP_DOMINATED / DATA_INSUFFICIENT.

### 8. Coverage / provenance fields
- slotHistoryCount;
- dailyHistoryCount;
- sourceTimestamp;
- schemaVersion;
- completedBar;
- decisionImpact=false.

## Explicitly reject from minimum set for now
Do NOT add yet:
- “buy volume / sell volume” from candle sign;
- free-float turnover without reliable timestamped free-float data;
- 52-week-high x turnover dedicated factor;
- standalone VWAP-above/below score;
- separate daily/60m/30m/15m/10m volume points;
- numerous pattern-specific volume scores;
- raw block-share-of-full-day in live snapshots;
- trade-value price-impact as an alpha score.

These remain secondary experiments only.

## Why this is suitable for engineering
The minimum set answers distinct questions:
1. Is participation abnormal?
2. Is it abnormal for this time of day?
3. Is it persistent through the session?
4. Is price responding efficiently?
5. Is structure accepting or rejecting the move?
6. Is the event persisting or decaying?
7. Is market structure making the observation unreliable?

It also reuses current Formal context instead of duplicating it.

## Proposed next system action
This set is suitable to propose for **research-only Shadow logging** in the stock-selection / monitoring code, because it can be isolated with `decisionImpact=false` and validated prospectively without changing Formal selection, ranking, entry, capital or push behavior.

It is NOT yet suitable for Formal scoring.

Status: MINIMUM_SHADOW_SET_READY_FOR_ENGINEERING_PROPOSAL / FORMAL_LOCKED.


# PV-026 — Volume May Be More Reliable as an Information-Intensity / Risk Signal than a Direction Signal

## Evidence
Taiwan and broader microstructure literature repeatedly finds a strong relationship between trading activity and return volatility / information arrival. A Taiwan 5-minute study finds that price-volume information jointly matters for describing volatility, while later Taiwan work on abnormal volume also focuses on volatility rather than a simple directional-return rule. The broader mixture-of-distributions literature interprets volume and volatility as jointly responding to latent information flow.

Sources:
- https://doi.org/10.1016/S1044-0283(01)00023-0
- https://ah.lib.nccu.edu.tw/item?item_id=38189
- https://doi.org/10.1016/j.intfin.2006.10.001
- https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/volume-and-volatility-in-a-commonfactor-mixture-of-distributions-model/ACFD6A47569CD7923F59E49CD081D585

## Important implication
A strong volume feature may fail as a directional stock-selection factor but still be valuable for:
- uncertainty / expected-range estimation;
- false-break / whipsaw risk;
- stop-distance diagnostics;
- maxChase / execution-risk research;
- deciding how much confirmation is needed.

This is a fundamentally different use from “high volume = buy.”

## Positive case
Abnormal participation can indicate information arrival and make subsequent movement / range expansion more likely, even if direction remains uncertain.

## Opposing case
Volume-volatility correlation does not tell us which direction price will move and can be partly mechanical / regime-dependent. Turning it into a bullish score would misuse the evidence.

## Research handoff
When validating the minimal PV set, test two targets separately:
A. directional outcome / continuation;
B. risk outcome / realized range, MFE+MAE magnitude, false-break and stop-first.

A feature can survive for B even if it fails A.

Status: HIGH_VALUE_REFRAMING / DIRECTION_AND_RISK_TARGETS_MUST_BE_SEPARATE.


# PV-027 — Residual Abnormal Volume: Stock-Specific Participation beyond Market/Sector Activity

## Motivation
A stock can have 2x its normal volume simply because the entire market or its sector is unusually active. This weakens the interpretation of raw individual RVOL as stock-specific information.

The common-factor volume/volatility literature supports the existence of common activity components, while the current system already measures sector participation.

Source:
- https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/volume-and-volatility-in-a-commonfactor-mixture-of-distributions-model/ACFD6A47569CD7923F59E49CD081D585

## Candidate research residuals
Do not add another score. Instead estimate:
- `stockLogRvol - marketMedianLogRvol`;
- `stockLogRvol - sectorMedianLogRvol`;
- same concept for same-slot 15m RVOL where broad coverage is available.

These measure whether the stock's abnormal participation exceeds the common activity backdrop.

## Positive interpretation
High residual RVOL may better identify stock-specific attention / information than raw RVOL.

## Opposing interpretation
- sector medians can be unstable in small industries;
- market-wide bursts can themselves be relevant information;
- residualization may remove genuine theme-level signal that the selector wants to retain;
- current sector score may already capture much of this distinction.

Therefore raw and residual RVOL should be compared side-by-side; do not assume residual is superior.

Status: WORTH_SHADOW_COMPARISON / MODERATOR_NOT_EXTRA_POINTS.


# Batch synthesis after PV-027

The price-volume lane now has a concrete engineering boundary:
- the minimal Shadow set is ready to propose;
- Formal scoring is not;
- PV research must evaluate direction and risk as separate targets;
- residual stock-specific participation is a promising comparison, but it must not erase valid sector-level information.

The strongest architecture remains:
`participation -> price response -> acceptance -> persistence -> guard`,
with market/sector common activity as contextual normalization rather than an extra additive score.
# PV-028 — Volume-at-Price / Intrabar Distribution: Prospective Only unless Historical Semantics Exist

## Data reality
Fugle provides current-day:
- `/intraday/trades/{symbol}` with trade price, size, time and cumulative volume;
- `/intraday/volumes/{symbol}` with volume by price and bid/ask-side aggregates.

The documented historical endpoint is historical candles, not historical trades or historical volume-at-price.

Sources:
- https://developer.fugle.tw/docs/data/http-api/intraday/trades/
- https://developer.fugle.tw/docs/data/http-api/intraday/volumes/
- https://developer.fugle.tw/docs/data/http-api/historical/candles/

## Governance consequence
Never fabricate historical volume profile, trade-count, bid/ask-volume or volume-at-price from OHLCV candles.
An OHLCV bar cannot reveal where inside the range the volume actually traded.

## Potential future research
If prospective capture is later justified:
- selected symbols only;
- fixed capture timestamps;
- raw source timestamp and completeness flag;
- decisionImpact=false;
- record volume concentration near pivot / breakout price;
- record bid/ask volume-at-price only with the provider's documented semantics.

Important provider caveat:
Fugle documents that opening first-match volume is excluded from its bid/ask-side comparison for intraday volume-at-price because the opening call auction may not represent ordinary supply/demand. This reinforces the need to preserve source semantics.

## Decision
Interesting, but not part of the minimum Shadow set because:
- no equivalent historical depth for backfill;
- prospective storage/API cost;
- high risk of over-interpreting microstructure;
- current 15m/state architecture can be tested first.

Status: DEFER / PROSPECTIVE_ONLY / DO_NOT_SYNTHESIZE_HISTORY.


# PV-029 — Number of Trades vs Average Trade Size

## Taiwan evidence
Taiwan OTC research reports that transaction count has a stronger relationship with price volatility than average trade size in its sample. Related Taiwan microstructure work also finds that the number of trades can be more informative for volatility than average trade size.

Sources:
- https://doi.org/10.1108/03074350610703849
- https://scholars.lib.ntu.edu.tw/handle/123456789/414879

## Data feasibility
Fugle current-day `intraday/trades` exposes individual trade `size`, so prospective metrics are technically possible:
- tradeCount per slot;
- median / mean trade size;
- large-trade share;
- tradeCount RVOL versus historical prospectively stored baseline.

But the documented historical candles do not include trade count.

**PV-070 correction:** this limitation applies to historical *intraday* trade-count baselines from Fugle candles. Daily transaction count is available from official TWSE/TPEx closing data already fetched by Worker, so daily count/average-trade-size research is feasible at low incremental cost.

## Positive case
Intraday trade-count surprise may be a better information-intensity / volatility feature than raw shares alone; daily transaction-count decomposition is separately defined in PV-070/PV-073.

## Opposing case
- evidence is from an older Taiwan OTC market structure and may not generalize to today's TWSE/TPEx;
- pagination / API cost is materially higher than candles;
- trade splitting by algorithms can change interpretation through time;
- prospective history would take time to accumulate;
- likely more useful for risk/volatility than direction.

## Decision
Do not burden the initial Shadow implementation. If candle-based PV features prove useful for risk but leave unexplained volatility, trade-count capture can become a second-stage prospective experiment.

Status: INTRADAY_TRADE_COUNT_SECOND_STAGE; DAILY_COUNT_SUPERSEDED_BY_PV070_AS_FEASIBLE_TIER2.


# PV-030 — Corporate Actions Can Break RVOL Baselines

## Data / market structure
Raw share volume is not invariant to capital structure changes. Stock splits, par-value changes and capital reductions can change price/share units, shares outstanding and normal trading activity.

Fugle has a corporate-actions capital-change endpoint with split/par-value/capital-reduction events, halt/resume dates and adjustment-related fields. TWSE also publishes capital-reduction reference-price rules.

Sources:
- https://developer.fugle.tw/docs/data/http-api/corporate-actions/capital-changes/
- https://www.twse.com.tw/en/announcement/reduction/twtauu.html
- https://doi.org/10.1111/j.1540-6261.1987.tb04370.x

Historical Fugle candles support `adjusted=true` for daily/weekly/monthly price bars, but intraday bars are not documented as adjusted.

Source:
- https://developer.fugle.tw/docs/data/http-api/historical/candles/

## Failure mode
A 20-day RVOL baseline that straddles:
- a split / reverse split;
- par-value change;
- material capital reduction;
- long halt/resumption
can create false abnormal volume even if underlying participation intensity has not changed comparably.

## Conservative baseline-reset rule
Research proposal:
- set `CORPORATE_ACTION_GUARD` from halt through resume and baseline rebuild;
- for same-slot / daily raw-volume baselines, do not mix pre-action and post-action sessions unless volume-adjustment semantics are independently verified;
- require >=20 valid post-action sessions before normal PV baseline status;
- until then `pvGuardState=DATA_INSUFFICIENT` or `CORPORATE_ACTION_RESET`.

This sacrifices coverage but avoids silently manufacturing a signal.

## Alternative later
If a reliable historical share/volume adjustment method is verified, compare adjusted-baseline vs reset-baseline prospectively. Do not assume price adjustment factors automatically make volume comparable.

Status: HIGH_PRIORITY_DATA_QUALITY_GUARD.


# PV-031 — Downside / Upside Volume-Volatility Asymmetry

## Evidence
Taiwan research reports asymmetric volatility response, with negative shocks having stronger volatility impact in its sample. Broader Taiwan price-limit research also shows market-structure constraints can materially alter observed volatility and serial dependence.

Sources:
- https://ah.lib.nccu.edu.tw/item?item_id=38189
- https://doi.org/10.1016/S0927-538X(98)00011-0
- https://doi.org/10.1016/j.pacfin.2007.11.002

## Research implication
Do not assume an extreme-volume positive bar and an extreme-volume negative bar have symmetric risk implications.

Candidate risk-only interactions:
- negative return / bearish close x extreme participation;
- downside true-range expansion x RVOL;
- high downside effort x poor close;
- negative gap x opening concentration;
- downside event x price-limit proximity.

## Positive/constructive counter-case
Extreme downside volume can also be capitulation / absorption. A single high-volume red bar is not a sell conclusion. Later recovery, support reclaim and acceptance remain necessary to distinguish liquidation from accumulation.

## Separation of targets
Test:
A. subsequent direction;
B. subsequent realized range / MAE / stop-first;
C. rebound/reversal probability after extreme downside effort.

Do not collapse these into one bearish score.

Status: WORTH_RISK_SHADOW / DIRECTION_REMAINS_AMBIGUOUS.


# PV-032 — Map Price-Volume Research to the Existing Trading Funnel

## Purpose
Convert research into testable questions relevant to the current system without changing Formal behavior.

## After-market selection
Research fields:
- pvDailyRvol20;
- supply-contraction / no-demand state;
- persistence state;
- gap / corporate-action / price-limit guards;
- residual stock-vs-sector/market RVOL comparison.

Primary question:
Does PV state improve D1/D3/D5, MFE/MAE and false-break outcomes inside SELECTED / Near-miss / Rejected after current selection controls?

## 15m entry confirmation
Compare current:
- local previous-5-bar volumeRatio

against research additions:
- pvSlotRvol20;
- pvCumvolPace20;
- pvResponseState;
- pvAcceptanceState.

Primary question:
Does clock-time normalization reduce false confirmation / no-follow-through cases without materially suppressing valid BUY events?

This is currently the clearest direct optimization hypothesis because it addresses a known semantic weakness in the existing intraday volumeRatio.

## maxChase / gap risk
Research only:
- gap-dominated guard;
- extreme-volume + weak progress;
- opening concentration;
- price-limit proximity.

Primary question:
Do these explain poor chase outcomes / high MAE beyond existing maxChase and overheat logic?

No maxChase change is approved.

## stop / risk diagnostics
Research only:
- information-intensity / volatility PV target;
- downside asymmetry;
- price-censored guard.

Primary question:
Can PV state predict stop-first or unusually large realized range even when it cannot predict direction?

Any stop-distance / capital-sizing change remains Formal Class C.

## re-add after reduction
Future research possibility:
- recovery of acceptance state;
- participation normalization;
- renewed sector / stock residual participation.

Do not attach PV to ABF re-add until the separate reduced-position state machine is validated; avoid solving two immature mechanisms at once.

## Ranked engineering hypotheses
Research priority, not trading recommendation:
1. Same-slot 15m RVOL + cumulative pace versus current previous-5-bar ratio.
2. Acceptance lifecycle for breakout / retest / failure.
3. Price-limit / corporate-action / gap guards.
4. Direction-vs-risk dual target.
5. Residual stock-specific RVOL.
6. Trade-count / volume-at-price only later if candle-based research leaves meaningful unexplained value.

Status: SYSTEM_MAPPING_COMPLETE / FORMAL_UNCHANGED.


# Batch synthesis after PV-032

The PV lane now separates four categories cleanly:

1. **Candidate information** — daily/same-slot abnormal participation, persistence, acceptance.
2. **Interpretation context** — gap, sector/market common activity, pattern maturity, institutions.
3. **Risk information** — volatility/intensity, downside asymmetry, false-break / stop risk.
4. **Data guards** — price limits, corporate actions, missing history, illiquidity, current-only microstructure data.

This is preferable to a single bullish/bearish “volume score.”

The first engineering proposal should remain deliberately small:
- add research-only logging for the PV-025 minimum set;
- validate the current 15m local-volume ratio against same-slot RVOL/cumulative pace;
- capture outcome ledgers prospectively;
- do not alter selection, BUY, maxChase, stop, capital, push, or ABF re-add behavior.
# PV-033 — Risk Targets: Volume Can Be Useful Even When Direction Is Unclear

## Research question
PV-026 separated directional alpha from information-intensity / risk value. PV-033 defines the actual risk outcomes so the research does not accidentally judge every volume feature only by future return sign.

## Academic anchor
Trading volume is widely linked to volatility / information arrival. Taiwan 5-minute evidence finds a persistent volume-volatility relation, and microstructure models explicitly motivate lagged volume as information about future price variability.

Sources:
- https://doi.org/10.1016/S1044-0283(01)00023-0
- https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/abs/trading-volume-and-information-revelation-in-stock-market/4EE7120A7541D10B580FC555DEEB1B77
- https://doi.org/10.1002/for.2897

## Outcome labels
Feature snapshot remains immutable at observation time. Outcomes are computed only after the horizon completes.

### Direction targets
- D1 / D3 / D5 / D10 close-to-close return;
- breakout-hold / false-break;
- reacceleration / failed re-entry.

### Excursion / risk targets
For anchor price P0 at the observation timestamp:
- `MFE_H = max(high_after_t..H / P0 - 1)`;
- `MAE_H = min(low_after_t..H / P0 - 1)`;
- `range_H = maxHigh / minLow - 1`;
- ATR-normalized MFE / MAE / range using ATR known at t;
- close-to-close realized volatility over the completed horizon where enough bars exist.

### Existing-plan risk targets
Only when a valid plan already existed at t:
- `stopFirst_H`: planned stop touched before planned profit-check / target event;
- `maxChaseAdverse_H`: entry/chase event followed by predefined adverse excursion;
- `falseConfirm_H`: 15m confirmation followed by failed structural acceptance inside the frozen horizon.

Do not invent a stop or target retrospectively for stocks that had none at t.

## Positive use case
A PV feature may have near-zero average directional return effect but still identify:
- higher MAE;
- larger realized range;
- more stop-first events;
- more false confirmations.
That can be valuable later for confirmation/risk research.

## Opposing case
High expected volatility can also create high MFE and more opportunity. A “high-risk” label must not be automatically converted into avoidance or smaller size without separate utility / execution testing.

## Required reporting
Always report direction and risk separately:
- return / hit-rate;
- MFE;
- MAE;
- stop-first;
- false-break;
- coverage.

Status: RISK_OUTCOME_SCHEMA_DEFINED / NO_RISK_RULE_CHANGE.


# PV-034 — Daily Market / Sector Residual RVOL; Defer Full-Market 15m Residualization

## Evidence
Trading activity contains common components. Lo & Wang show turnover is well described by a multi-factor structure. Market-microstructure research also documents market- and industry-wide commonality in liquidity / order flow.

Sources:
- https://www.nber.org/papers/w7625
- https://doi.org/10.1111/1475-6803.00035
- https://doi.org/10.1016/S0304-405X(99)00057-4

## Daily feasibility in the current system
The current Worker already maintains full-market daily histories and sector group statistics. Therefore daily residual participation can be researched without a new full-market historical API layer.

For each stock/date:
1. compute own-history log RVOL:
   `stockLogRvol = log(volume_t / median_or_mean_prior20_volume)`;
2. compute market median `marketMedianLogRvol` across valid liquid equities for the same date;
3. compute leave-one-out sector median `sectorMedianLogRvol` where sector sample is adequate;
4. save, do not automatically score:
   - `pvMarketResidualRvol = stockLogRvol - marketMedianLogRvol`;
   - `pvSectorResidualRvol = stockLogRvol - sectorMedianLogRvol`.

Use robust medians first. Small-sector / insufficient-coverage result = UNKNOWN.

## Why leave-one-out matters
The target stock should not mechanically help create the sector benchmark used to judge itself, especially in small sectors.

## Positive interpretation
A stock with 2x normal volume on a day when the market and its sector are normal may contain more stock-specific information/attention than a stock with 2x normal volume during a market-wide surge.

## Opposing interpretation
Theme-level volume is often exactly what the selector wants to capture. Residualizing against sector activity can remove genuine group confirmation. Therefore retain both:
- raw RVOL / sector context;
- residual RVOL.

Residual RVOL is a contextual decomposition, not a superior replacement by assumption.

## 15m feasibility decision
Do NOT build full-market same-slot residual RVOL yet.
Reason:
- same-slot baselines require historical intraday data for each stock;
- doing this across ~full market would materially expand storage/API/runtime;
- current highest-value use is only the monitored/selected set;
- market index intraday `volume` has different units (index volume can be traded value), so an index cannot be naively used as the stock-volume denominator.

Fugle source semantics:
- historical intraday bars available from 2023-05-23;
- listed-stock intraday volume is in lots, daily volume is shares;
- index intraday volume semantics differ from equity volume.

Source:
- https://developer.fugle.tw/docs/data/http-api/historical/candles/

Status: DAILY_RESIDUAL_RVOL_FEASIBLE / FULL_MARKET_15M_DEFER.


# PV-035 — Abnormal-Volume Freshness, Decay and Half-Life

## Evidence
Recent abnormal-trading-volume research finds that persistence in abnormal volume is associated with continued short-run drift, while abnormal volume gradually reverts toward its long-run mean and later return behavior can reverse. This supports treating “fresh shock,” “persistent wave,” and “decayed event” as different states.

Source:
- https://doi.org/10.1080/1351847X.2024.2303092

## Important restraint
The literature does NOT give us a universal “volume signal expires after N days” rule for Taiwan or our selector. Do not hard-code 3D/5D half-life from the paper.

## Store continuous freshness variables first
Daily:
- `pvEventStartDate`;
- `pvEventAgeTradingDays`;
- `pvPeakRvol20`;
- `pvDaysSincePeakRvol`;
- `pvCurrentToPeakRvolRatio`;
- `pvRvolSlope3` / `pvRvolSlope5`;
- consecutive days above frozen abnormal-volume threshold/bucket.

15m:
- bars since current intraday RVOL event began;
- bars since peak same-slot RVOL;
- current / peak same-slot RVOL ratio;
- cumulative-volume pace decay.

## State concepts
Only after definitions are frozen:
- `FRESH_SHOCK`;
- `PERSISTENT_WAVE`;
- `DECAYING`;
- `NORMALIZED`;
- `UNKNOWN`.

These are descriptive states. They are not bullish/bearish labels.

## Positive interpretation
Persistent abnormal volume plus structural acceptance can reflect continuing information diffusion / recognition.

## Opposing interpretation
Persistent high volume late in an extended move can be crowding / attention persistence. Falling price progress while volume remains high can indicate exhaustion risk rather than strength.

## Validation
Compare the same initial shock by later freshness trajectory:
- FRESH->PERSISTENT;
- FRESH->FAST_DECAY;
- PERSISTENT->DECAY;
with D1/D3/D5/D10, MFE/MAE, false-break and stop-first.

Status: HIGH_VALUE_STATE_EXTENSION / NO_FIXED_EXPIRY_YET.


# PV-036 — Information Discreteness / News Context: Interaction, not Double Counting

## Evidence
Information Discreteness (Frog-in-the-Pan) research argues that gradual, continuous price information receives less attention and is incorporated more slowly, while discrete price moves act as cognitive triggers and are incorporated faster. Related attention research shows individual investors disproportionately buy attention-grabbing stocks, including stocks in the news, with abnormal trading volume or extreme one-day returns.

Sources:
- https://doi.org/10.1016/j.jfineco.2021.10.011
- https://doi.org/10.1093/rfs/hhm079

Volume/volatility dynamics also differ between periods with identifiable public news and without it, so high volume cannot be assigned one universal information meaning.

Source:
- https://doi.org/10.1016/j.jbankfin.2006.11.019

## System implication
PV and Information Discreteness may partly measure the same latent attention/information-arrival episode.

Therefore DO NOT create:
`PV score + ID score + news score`
as three independent additive rewards without redundancy testing.

## Research interaction grid
Record combinations such as:
1. continuous-information / quiet-normal participation;
2. continuous-information / abnormal participation;
3. discrete-information / normal participation;
4. discrete-information / extreme participation.

Optional public-news context:
- `PUBLIC_NEWS_KNOWN`;
- `NO_PUBLIC_NEWS_FOUND`;
- `NEWS_UNKNOWN`.

“NO_PUBLIC_NEWS_FOUND” must never be treated as proof of no information event.

## Hypotheses to falsify
- discrete move + extreme volume may be faster information incorporation OR attention-driven overreaction; continuation is not guaranteed;
- continuous move + moderate persistent volume may be gradual recognition OR simply low-salience drift;
- no-news abnormal volume may represent private information OR overconfident/noise trading.

## Engineering decision
Initial PV Shadow implementation should not add a mandatory external-news dependency.
Use already-available Information Discreteness / price path as a moderator. Add verified news context later only if source/provenance can be stored reliably.

Status: INTERACTION_REQUIRED / ADDITIVE_DOUBLE_COUNTING_PROHIBITED.


# PV-037 — Exact Research-Only Shadow Engineering Specification

## Scope
This is an engineering proposal only.
It MUST NOT change:
- A/B eligibility;
- ranking / priority;
- selected 3+3 pool;
- BUY / ADD / REDUCE;
- maxChase;
- stop;
- capital allocation;
- push semantics;
- ABF re-add.

Every record carries `decisionImpact=false`.

## A. Minimum feature set

### Existing fields reused
- volumeTodayVsPrev5;
- volumeContraction5to20;
- avgVolume20Lots;
- avgAmount20;
- dailyClosePosition;
- dailyUpperShadowRatio;
- lateStage / ret20;
- sector / institutional context;
- current 15m local previous-5-bar volumeRatio.

### New daily research fields
- pvDailyRvol20;
- pvMarketResidualRvol;
- pvSectorResidualRvol;
- pvPersistenceState;
- pvGuardState;
- pvEventAgeTradingDays / pvDaysSincePeakRvol;
- coverage + schemaVersion + source timestamp.

### New 15m research fields
- pvSlotRvol20;
- pvCumvolPace20;
- pvResponseState;
- pvAcceptanceState;
- pvPersistenceState;
- pvGuardState;
- slotHistoryCount;
- completedBar;
- source timestamp.

## B. Storage proposal
Prefer dedicated D1 tables so research data cannot mutate Formal plan objects.

### `v7_pv_shadow_snapshots`
Suggested columns:
- snapshot_id TEXT PRIMARY KEY;
- symbol TEXT NOT NULL;
- market_date TEXT NOT NULL;
- observed_at TEXT NOT NULL;
- observation_type TEXT NOT NULL; -- AFTER_MARKET / INTRADAY_15M
- schema_version TEXT NOT NULL;
- event_key TEXT;
- features_json TEXT NOT NULL;
- context_json TEXT;
- coverage_json TEXT;
- source_json TEXT;
- decision_impact INTEGER NOT NULL DEFAULT 0;
- created_at TEXT NOT NULL.

Unique logical identity:
`symbol + observed_at + observation_type + schema_version`.

### `v7_pv_outcomes`
One row per snapshot x horizon:
- snapshot_id TEXT NOT NULL;
- horizon TEXT NOT NULL; -- D1/D3/D5/D10 or B1/B2/B4/B8 for completed 15m bars
- completed_at TEXT;
- direction_return REAL;
- mfe REAL;
- mae REAL;
- range_atr REAL;
- stop_first INTEGER;
- false_break INTEGER;
- acceptance_result TEXT;
- outcome_complete INTEGER NOT NULL DEFAULT 0;
- outcome_json TEXT;
- PRIMARY KEY(snapshot_id,horizon).

Outcomes never update the original feature snapshot.

### `v7_pv_intraday_baselines`
Cache only symbols that actually enter monitored/selected research scope:
- symbol;
- baseline_version;
- valid_sessions;
- last_market_date;
- slot_stats_json;
- corporate_action_reset_at;
- updated_at.

## C. API / runtime budget design
### Daily layer
Use existing full-market history cache for daily RVOL and daily residual-RVOL.
Expected incremental historical market-data calls: zero for the daily PV fields if current cache coverage is valid.

### 15m bootstrap
For each newly monitored symbol lacking a baseline:
- one historical 15m request covering enough calendar days to obtain >=20 valid sessions;
- Fugle supports 15m historical bars and single query ranges under one year.

Do NOT refetch 20 days of 15m history on every monitor cycle.

### Baseline maintenance
After bootstrap:
- append completed current-session 15m bars to cache;
- roll prior-session window;
- rebuild after corporate-action guard/reset;
- missing/failed refresh => UNKNOWN, never fallback to fake 1.0 RVOL.

Current monitored pool is small, so selected-symbol baselines are preferred over full-market intraday baselines.

Fugle documentation:
- historical candles support 15m;
- intraday history starts 2023-05-23;
- intraday `average` is cumulative transaction average from open;
- volume units differ by security/timeframe and must not be mixed raw across daily/intraday.

Source:
- https://developer.fugle.tw/docs/data/http-api/historical/candles/
- https://developer.fugle.tw/docs/data/http-api/intraday/candles/

## D. No-look-ahead invariants
1. Intraday features use completed bars only.
2. Same-slot median uses sessions strictly before marketDate.
3. Cumulative-volume pace denominator uses historical cumulative volume only through the same clock slot.
4. Full-day volume cannot enter a live 10:00/11:00/12:00 feature.
5. Later RETEST / REACCELERATION updates create later snapshots/states; they do not rewrite the original BREAKOUT_ATTEMPT row.
6. Outcome tables are joined only after horizon completion.
7. Corporate-action reset prevents baseline mixing across incompatible share units/regimes.

## E. Required tests before deployment
### Unit tests
- slot mapping around 09:00 / 13:30;
- exactly 20 valid-session boundary;
- missing / halted sessions excluded, not zero-filled;
- listed-stock intraday lots vs daily shares not cross-divided;
- completed-bar filter;
- median / MAD edge cases;
- zero/near-zero historical volume;
- gap / price-limit guard state;
- corporate-action reset;
- leave-one-out sector median;
- event-age / days-since-peak semantics.

### Leakage tests
Construct synthetic future-volume changes and prove a historical snapshot does not change.
Construct later retest success/failure and prove prior BREAKOUT_ATTEMPT row stays byte-identical.

### Formal-isolation tests
For identical market inputs, enabling PV Shadow must produce identical:
- selected symbols;
- ranks;
- plan prices;
- BUY/ADD/REDUCE decisions;
- capital allocation;
- push events.

Any difference = test failure.

### Failure-mode tests
- Fugle historical 404 / timeout;
- insufficient history;
- D1 write failure;
- partial intraday data;
- trading halt;
- new listing;
- corporate action.
Expected behavior: research state UNKNOWN / logging warning; Formal path unchanged.

## F. Rollout phases
1. LOG_ONLY: compute/store fields; no evaluation claims.
2. DATA_QA after first ~50 completed events: semantics/missingness only.
3. EVIDENCE after predeclared minimum coverage from PV-024.
4. COMPARE current local 15m volumeRatio vs slot-RVOL/cum-pace.
5. Only if incremental value is stable, draft a separate Class C proposal.
6. Owner approval required before any Formal change.

Status: ENGINEERING_SPEC_READY / NOT_IMPLEMENTED / FORMAL_LOCKED.


# Batch synthesis after PV-037

The price-volume research has crossed an important boundary:
- enough has been learned to define a small, reproducible Shadow recorder;
- not enough has been learned to change Formal selection or execution.

The highest-value near-term experiment is still narrow:
**Does same-slot 15m relative volume + cumulative-volume pace explain false confirmations / no-follow-through better than the current previous-5-bar volume ratio?**

The broader PV architecture remains:
`participation -> price response -> acceptance -> persistence -> guard`,
with:
- direction and risk evaluated separately;
- market/sector common activity treated as context;
- Information Discreteness treated as an interaction/moderator;
- outcomes stored separately from immutable as-of features.
# PV-038 — Volume-Conditioned Return Autocorrelation: Continuation vs Reversal Diagnostic

## Evidence
Llorente, Michaely, Saar & Wang model two broad mechanisms:
- risk-sharing / liquidity-motivated high-volume returns tend to reverse;
- private-information/speculative high-volume returns tend to continue.
They test this through the interaction between volume and first-order return autocorrelation.

Sources:
- https://www.nber.org/papers/w8312
- https://doi.org/10.1093/rfs/15.4.1005

## Research feature idea
A direct diagnostic can be based on:
`nextReturn ~ currentReturn + abnormalVolume + currentReturn * abnormalVolume + controls`.

The interaction term asks whether a high-volume price move tends to be followed by continuation or reversal.

## Important limitation
Do NOT interpret a positive coefficient as “informed traders were buying” or a negative coefficient as “liquidity traders were selling.” The latent trader motive is not observed in our data.

## Estimation restraint
The current ~60-day per-stock history is too short for a stable stock-specific dynamic-regression coefficient. Therefore:
- do not add a per-stock Llorente beta to the minimum Shadow set;
- if tested, pool across many dates/stocks with date/sector/liquidity controls;
- optionally estimate by liquidity/price/market-cap strata;
- validate out of sample.

## Positive use
This can empirically answer a central question already raised by PV research:
“Under our Taiwan universe, when does abnormal-volume price movement continue versus mean-revert?”

## Opposing case
- coefficients can be regime-dependent;
- bid/ask bounce and price limits can create serial-correlation artifacts;
- overnight and intraday returns should not be mixed blindly;
- strong current trend / pattern state may dominate the volume interaction.

Status: RESEARCH_DIAGNOSTIC_ONLY / NOT_MINIMUM_SHADOW_FIELD.


# PV-039 — Audit of Classic Volume Indicators: Mostly Repackaging, Not New Independent Factors

## OBV
Fidelity defines OBV as cumulative volume added on up-close days and subtracted on down-close days.

Source:
- https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/OBV

Mathematically, this is a cumulative version of the signed-volume proxy already considered in PV-011.

### Positive case
OBV trend/divergence is a compact visualization of persistent price-direction-weighted volume.

### Opposing case
- every share on an up day is labeled “up volume,” despite every trade having both buyer and seller;
- cumulative level is path-dependent and arbitrary in absolute value;
- it overlaps return direction, positive-day ratio and volume persistence.

Decision: DO NOT add OBV as an independent score.

## Accumulation/Distribution and CMF
Accumulation/Distribution weights volume by close location within the high-low range; CMF normalizes a rolling sum of similar money-flow-volume by total volume.

Sources:
- https://www.fidelity.com/products/atp/pdf/ATPChartingIndicators.pdf
- https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cmf

### Positive case
They combine “where did the bar close?” with “how much traded?” and therefore approximate effort-vs-result.

### Opposing case
The current system already has daily close position / upper shadow and volume fields. Gap days, limit-censored bars and narrow ranges can make close-location multipliers misleading.

Decision: mathematical concept already represented by PV response-state ingredients; no separate CMF/A-D score.

## MFI
MFI is essentially an RSI-style oscillator applied to typical-price x volume money flow.

Source:
- https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/mfi

### Positive case
It normalizes directional price-volume flow into a bounded oscillator.

### Opposing case
- duplicates momentum + volume;
- fixed 80/20 practitioner thresholds are not universal;
- strong trends can remain “overbought/oversold” for extended periods even in Fidelity's own description;
- it can obscure the separate mechanisms we intentionally preserve.

Decision: do not add MFI to Formal or minimum Shadow.

## Volume Oscillator
VO = percentage difference between short and long volume moving averages.

Source:
- https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/volume-oscillator

The current Worker already has:
- short-vs-long volume relation via `volumeRatio` / `volumeContraction5to20`;
- current-day vs previous-5 via `volumeTodayVsPrev5`.

Decision: redundant.

## Price/Volume Distribution chart approximation
Some chart implementations allocate a bar's volume to histogram price buckets based on bar price information rather than actual historical trade-by-price records.

Source:
- https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/price-volume-distribution

For our system, do not confuse such OHLCV-derived approximation with true exchange volume-at-price. PV-028 already reserves actual current-day Fugle volume-at-price as prospective-only microstructure data.

## Synthesis
Classic indicators are useful conceptual teaching tools, but the system should retain their primitive components rather than stacking OBV + CMF + MFI + VO on top of existing factors.

Status: CLASSIC_INDICATOR_AUDIT_COMPLETE / NO_NEW_SCORE.


# PV-040 — Robust Volume Normalization: Freeze Semantics before Testing

## Problem
Mean-based RVOL is sensitive to one or two prior extreme-volume days. Median-based RVOL is more robust but intentionally ignores part of the magnitude distribution. There is no reason to assume one normalization wins in every regime.

## Proposed semantics

### Daily primary
For the new minimum Shadow field:
`pvDailyRvol20 = volume_t / median(prior 20 valid daily volumes)`.

Why median primary:
- robust to a recent single extreme event;
- current Worker already exposes mean-based volume context through avgVolume20 / previous-5 relationships, so this adds complementary information.

### Same-slot 15m primary
`pvSlotRvol20 = current slot volume / median(prior 20 valid same-slot volumes)`.

This stays consistent with PV-005 and avoids a few event days dominating the baseline.

### Cumulative pace primary
`pvCumvolPace20 = current cumulative volume through slot / median(prior 20 valid cumulative volumes through same slot)`.

## Secondary diagnostics, not independent scores
- mean-based RVOL;
- `logRvol = log(max(volume,epsilon)) - median(log prior volume)`;
- robust z using median/MAD;
- historical percentile.

## Edge cases
- median baseline <=0 => UNKNOWN;
- <20 valid sessions => UNKNOWN;
- corporate-action reset => history restarts;
- halted / missing bars excluded, not zero-filled;
- extreme values may be capped only for model-fitting stability, never silently changed in raw storage.

## Why keep raw + transformed
Always store source volume and baseline statistic so future researchers can reproduce the derived number. Do not store only a clipped z-score.

Status: NORMALIZATION_SEMANTICS_FROZEN_FOR_SHADOW_V0_1.


# PV-041 — Event De-duplication: One Abnormal-Volume Episode Is Not Ten Independent Samples

## Problem
If abnormal participation persists for five days, recording five daily rows is correct for state evolution but statistically treating them as five independent “signals” exaggerates sample size.

The same issue occurs intraday when a 90-minute participation wave generates six consecutive 15m abnormal-volume bars.

## Episode concept
Create a research `event_key` when ParticipationState transitions from QUIET/NORMAL into ELEVATED/EXTREME.

Later snapshots retain the same event_key while the episode remains active.

Do not tune an arbitrary fixed “three-day episode” to outcomes. Store:
- event start;
- event age;
- time/bars since peak;
- state transitions;
- normalization timestamp.

## Primary vs secondary observations
### Primary event-level analysis
Use the first abnormal observation as the primary event snapshot for initial-shock outcome studies.

### State-transition analysis
Later rows are valid for:
- persistence;
- decay;
- retest;
- reacceleration;
but are nested observations within the same event.

## Inference
Where statistical inference is used:
- cluster by market date;
- also account for repeated observations from the same event/symbol;
- do not report raw snapshot count as if it equals independent event count.

## Opposing risk
Over-aggressive de-duplication can merge two genuinely distinct information shocks close together. Therefore raw snapshots remain stored; event_key is an analytical grouping layer, not destructive compression.

Status: REQUIRED_SAMPLE_INTEGRITY_RULE.


# PV-042 — Volume as Momentum-Life-Cycle Context, not Monotonic Strength

## Evidence
Lee & Swaminathan find that past trading volume helps explain the magnitude and persistence of momentum in their U.S. sample; high-volume winners reverse faster over longer horizons. Asia-Pacific evidence has also reported support for related volume/momentum life-cycle patterns, although results vary by country and sample.

Sources:
- https://doi.org/10.1111/0022-1082.00280
- https://doi.org/10.1016/j.pacfin.2007.01.002

## Critical horizon warning
The original Lee-Swaminathan result concerns intermediate/longer horizons and turnover characteristics. It must NOT be imported as “today's high-volume winner should be sold tomorrow.”

## System interaction
The current system already has:
- ret20 / ret60;
- lateStage;
- MA20 distance;
- breakout structure;
- overheat controls.

Therefore volume should moderate stage, not create a new generic strength score.

## Research state
A `LATE_STAGE_VOLUME_RISK_CANDIDATE` may be recorded when:
- price is already extended / lateStage;
- abnormal volume is persistent or extreme;
- price-response efficiency deteriorates;
- upper rejection / weak acceptance appears.

This remains a descriptive risk candidate until tested.

## Positive continuation case
High volume in an early/mid-stage breakout with strong structural acceptance can still precede continuation. Llorente-style information-driven continuation and short-run high-volume effects are counterexamples to a simple “high-volume winner = late” rule.

## Falsification
The late-stage volume interaction should be rejected if:
- lateStage alone explains the outcome;
- PV adds no incremental D1-D10 / MAE / false-break information;
- effect exists only at horizons irrelevant to our system;
- result depends on one bull-market cohort.

Status: WORTH_INTERACTION_TEST / NO_SELL_OR_REDUCE_RULE.
# PV-043 — Taiwan Auction-Aware 15m Semantics

## Current market structure
Both TWSE and TPEx mainboard use:
- opening call auction;
- continuous trading after the opening match through 13:25;
- closing call auction from 13:25 to 13:30 (or delayed close in specified cases).

Sources:
- https://www.twse.com.tw/en/products/system/trading.html
- https://www.tpex.org.tw/en-us/mainboard/trading/rules/system.html

## Implication
A 15m bar touching the open or close is not microstructurally identical to a pure continuous-trading midday bar.

Same-slot RVOL already solves much of the clock-time baseline problem, but interpretation also needs a session-phase label:
- `OPEN_AUCTION_MIXED`;
- `CONTINUOUS`;
- `CLOSE_AUCTION_MIXED`;
- `UNKNOWN`.

## Vendor-candle caution
Do not assume whether a Fugle 15m timestamp denotes slot start/end or exactly how opening/closing auction prints are grouped without an empirical fixture test against known trade timestamps.

Required test:
- fetch a known trading day at 1m and 15m;
- aggregate completed 1m volume into proposed 15m buckets;
- verify the 15m provider bucket boundaries exactly before production semantics are frozen.

## Positive interpretation
High opening auction participation can represent overnight information incorporation; high closing participation can represent genuine institutional positioning.

## Opposing interpretation
Opening/closing auction concentration can also be benchmark, inventory, or auction-mechanics flow and need not predict same-direction continuation.

Status: HIGH_PRIORITY_INTRADAY_SEMANTIC_GUARD.


# PV-044 — Intraday Volatility Interruption (VI) Can Distort a 15m Bar

## Current rule
TWSE/TPEx continuous trading includes an intraday volatility interruption mechanism. When a potential execution price moves beyond the specified +/-3.5% reference range, matching can be postponed for two minutes and resume through call auction before returning to continuous trading.

Sources:
- https://www.twse.com.tw/en/products/system/trading.html
- https://www.tpex.org.tw/zh-tw/mainboard/trading/rules/continuous.html

## Why PV cares
A 15m bar that contains:
- normal continuous trading;
- a two-minute interruption;
- a reopening call auction
can show abnormal volume/range/close-location for reasons partly caused by market structure.

## Data limitation
Historical OHLCV candles alone do not prove that a VI occurred.
Do NOT infer VI from:
- a two-minute low-volume patch;
- a sudden jump;
- a later volume burst.

Those patterns are not unique to VI.

## Guard
Unless a reliable event source is captured:
- keep `pvViState=UNKNOWN`;
- include VI as a documented unobserved confounder;
- if future real-time/event data expose VI explicitly, store it prospectively with source timestamp.

Status: IMPORTANT_CONFOUNDER / DO_NOT_SYNTHESIZE_FROM_CANDLES.


# PV-045 — Closing-Bar Volume Is Not Automatically Late-Day Confirmation

## Mechanism
Because 13:25-13:30 is a closing call-auction phase on TWSE/TPEx mainboard, the final 15m bar can contain accumulated closing-auction flow.

Sources:
- https://www.twse.com.tw/en/products/system/trading.html
- https://www.tpex.org.tw/en-us/mainboard/trading/rules/system.html

## Positive case
Abnormally strong closing participation with a constructive close can represent durable demand and may improve next-session acceptance.

## Opposing case
Closing flow may reflect:
- benchmark/auction execution;
- inventory or end-of-day rebalancing;
- forced execution;
- broad market closing activity.
Therefore a high final-bar RVOL is not equivalent to an intraday breakout surge.

## Research rule
- compare closing bar only with historical same closing slot;
- keep `CLOSE_AUCTION_MIXED` phase;
- evaluate next-session gap/acceptance separately;
- do not award an automatic “strong close volume” bonus.

Status: SAME_SLOT_REQUIRED / DIRECTION_NOT_ASSUMED.


# PV-046 — Ex-Rights / Ex-Dividend Reference-Price Guard for Gap and Price-Response Features

## Market rule
TWSE opening auction reference prices are adjusted for ex-rights/ex-dividend events under exchange rules. Fugle historical daily `change` also documents that ex-dividend day change is calculated versus the adjusted previous reference, not simply the raw prior close.

Sources:
- https://twse-regulation.twse.com.tw/ENG/EN/law/DAT0202_print.aspx?FLCODE=fl007304&LCC=2&LCNOS=++54+++
- https://developer.fugle.tw/docs/data/http-api/historical/candles/

## Failure mode
Naive:
`open / rawPreviousClose - 1`
can create a fake negative “overnight gap” on ex-dividend/ex-rights dates.

That would contaminate:
- PV-018 gap archetype;
- effort-vs-result;
- price-limit distance;
- abnormal return;
- Information Discreteness;
- late-stage / rejection diagnostics.

## Rule
For event days:
- use exchange-consistent adjusted reference price when available;
- otherwise mark the gap/return-derived feature UNKNOWN / CORPORATE_ACTION_GUARD;
- never silently substitute raw previous close.

Price adjustment and volume adjustment are separate issues: an adjusted reference price does not prove pre/post corporate-action raw volume is comparable.

Status: HIGH_PRIORITY_RETURN_SEMANTIC_GUARD.


# PV-047 — Market-Universe Guard: TPEx Mainboard Is Compatible; Emerging Stock Board Is Not

## Mainboard compatibility
TWSE and TPEx mainboard both use opening/closing call auction and intraday continuous trading, so the same basic 15m PV state architecture is conceptually compatible.

Source:
- https://www.tpex.org.tw/web/service/sotck_info/comparison/market_comparison.php?l=en-us

## Emerging Stock Board difference
TPEx Emerging Stock Board is quote-driven / negotiated, trades 09:00-15:00, has no conventional opening/closing price in the same sense, and uses different trading mechanics.

Sources:
- https://www.tpex.org.tw/en-us/esb/trading/rules/overview.html
- https://www.tpex.org.tw/en-us/about/company/faq.html

## Rule
PV Shadow v0.1 applies only to ordinary TWSE/TPEx listed mainboard equities that pass the existing universe rules.

If an ESB / incompatible market type enters the data feed:
- `pvGuardState=UNSUPPORTED_MARKET_STRUCTURE`;
- do not compute same-slot/mainboard acceptance semantics;
- do not coerce its volume units/session into the mainboard baseline.

Status: UNIVERSE_BOUNDARY_DEFINED.


# Batch synthesis after PV-047

The Taiwan-specific 15m layer now needs two kinds of normalization:
1. **statistical normalization** — same-slot RVOL / cumulative pace;
2. **market-structure normalization** — auction phase, price-limit/corporate-action guards, unsupported-market guard, and awareness of unobserved VI.

This strengthens the core conclusion:
a 15m volume number is only meaningful after we know **when it occurred, under which matching mechanism, relative to what baseline, and whether price/reference semantics were structurally altered**.
# PV-048 — Limit-Up / Limit-Down Lock, Unlock and Queue Semantics

## Current market rule
TWSE ordinary stocks generally trade within +/-10% of the auction reference price at market open, subject to documented exceptions such as newly listed common stocks during their first five trading days. TPEx mainboard uses the same 10% framework for ordinary listed stocks.

Sources:
- https://twse-regulation.twse.com.tw/ENG/EN/law/DOC01.aspx?FLCODE=fl007304&FLNO=63
- https://www.tpex.org.tw/en-us/mainboard/trading/rules/system.html
- https://www.tpex.org.tw/en-us/about/company/faq.html

## Data available prospectively
Fugle current intraday quote exposes:
- referencePrice;
- lastPrice / last trade;
- best-five bids and asks with size;
- cumulative trade volume/value/transaction count;
- bid-side / ask-side matched volume;
- timestamps and trial information.

Sources:
- https://developer.fugle.tw/docs/data/http-api/intraday/quote/
- https://developer.fugle.tw/docs/data/http-api/intraday/trades/

## What cannot be reconstructed reliably from historical candles
Historical 15m/daily OHLCV cannot tell us:
- how long the stock was locked at limit;
- how many times it unlocked/relocked;
- historical queue size at the limit;
- canceled queue size;
- order priority;
- whether a one-sided book existed between candle timestamps.

Do not infer these from a high/close at the daily limit.

## Prospective research states
Only when an exact official/verified limit price and live book are available:
- `NOT_LIMIT_CONSTRAINED`;
- `UPPER_LIMIT_TOUCH`;
- `LOWER_LIMIT_TOUCH`;
- `UPPER_ONE_SIDED_BOOK_CANDIDATE`;
- `LOWER_ONE_SIDED_BOOK_CANDIDATE`;
- `UNLOCK_OBSERVED`;
- `RELOCK_OBSERVED`;
- `UNKNOWN`.

Use “candidate” when book depth is only a snapshot. A five-level book does not equal the full queue.

## Positive interpretation
A stock holding the upper limit with persistent one-sided demand may indicate strong unmet demand / censored price discovery.

## Opposing interpretation
- price limits mechanically censor price progress;
- queue size can be canceled;
- a late upper-limit lock may represent attention/crowding;
- unlock/relock can be information discovery, not necessarily weakness;
- a lower-limit queue can contain panic or forced selling and may later reverse.

Therefore limit state is a market-structure context, not a bullish/bearish score.

## Engineering decision
PV Shadow v0.1 should keep the existing generic `PRICE_CENSORED` guard.
Detailed lock/unlock/queue research is a later **prospective-only** extension requiring exact limit-price semantics and time-stamped book capture.

Status: PROSPECTIVE_ONLY / HISTORICAL_QUEUE_NOT_RECONSTRUCTABLE.


# PV-049 — Price-Volume Divergence without Hindsight Pivot Picking

## Problem
Classic “price made a higher high but volume made a lower high” is highly vulnerable to hindsight:
after the chart is complete, a researcher can choose whichever prior peak makes the divergence look best.

Practitioner sources describe divergence this way, but robust academic evidence for a universal volume-divergence trading rule is limited. Treat it as a hypothesis, not a law.

## As-of reference rule
Reuse the Pattern Maturity / swing-segmentation framework.
A divergence comparison may reference only a **previous pivot that was already confirmed before the current observation timestamp**.

Never select a prior high/low because later outcomes made it visually convenient.

## Normalize participation before comparison
Do not compare raw volume across distant dates.
For each pivot/event store:
- daily RVOL20;
- market/sector residual RVOL if available;
- response efficiency;
- event age;
- market regime;
- corporate-action guard.

## Continuous research fields
For a higher-high comparison:
- `pvPriceExtremeProgressATR` = current extreme minus previous confirmed pivot, normalized by ATR known at t;
- `pvParticipationDelta` = log(current normalized participation) - log(previous pivot normalized participation);
- `pvResponseEfficiencyDelta`;
- `pvDivergenceAge` = trading days between comparable pivots.

Analogous fields apply to lower lows.

Do not freeze a bullish/bearish threshold until prospective data are inspected under the pre-registration rules.

## Bearish-divergence hypothesis
Price makes a valid higher high while normalized participation is materially lower.

Possible adverse interpretation:
- marginal buyers are thinning;
- trend may be losing participation.

Constructive counter-interpretation:
- supply may be scarce, allowing price to advance efficiently on less volume;
- a mature leader may not need increasing raw participation at every new high.

Therefore require later acceptance/failure, price efficiency and late-stage context.

## Bullish-divergence hypothesis
Price makes a valid lower low while selling participation is lower.

Possible constructive interpretation:
- selling pressure is drying up.

Adverse counter-interpretation:
- liquidity / interest may be disappearing;
- there may be no meaningful rebound demand.

Therefore combine with PV-002 supply-dry-up vs no-demand logic and later reclaim/acceptance.

## Falsification
Reject divergence if:
- it adds no value beyond lateStage / Pattern Maturity / Residual RS;
- results depend on pivot parameters;
- effect vanishes using normalized rather than raw volume;
- reference-pivot age drives the apparent signal;
- the sign flips across market regimes.

Status: WORTH_SHADOW_RESEARCH / HINDSIGHT_GUARD_REQUIRED.


# PV-050 — Turnover Rate with Timestamped Issued Shares

## Definition
Standard share turnover is:
`daily traded shares / shares outstanding (or issued common shares)`.

Taiwan microstructure research commonly uses this construction. Official TWSE/TPEx statistics also describe turnover using issued shares.

Sources:
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10105614/
- https://www.twse.com.tw/downloads/zh/about/company/factbook/2026/3.01.html
- https://www.tpex.org.tw/epaper/monthly/202609/en/statistical_1.html

## Official data feasibility
Official company-basic datasets for both TWSE-listed and TPEx-listed companies include:
- report date;
- company code;
- issued common shares / TDR underlying issued shares.

Sources:
- https://data.gov.tw/dataset/18419
- https://data.gov.tw/dataset/25036
- https://openapi.twse.com.tw/

This makes current/as-of issued-share turnover technically feasible.

## Important distinction
Issued shares are NOT free float.
Do not call:
`volume / issued shares`
“free-float turnover.”

A reliable timestamped free-float dataset would be needed for that.

## Proposed Shadow variables
Daily only first:
- `pvIssuedShares`;
- `pvIssuedShareAsOfDate`;
- `pvTurnoverRate = dailyVolumeShares / issuedShares`;
- `pvTurnoverRvol20 = current turnover / median(prior20 valid turnover)`.

## Corporate-action alignment
The shares denominator must be the value valid at the event date.
A current share count must never be applied backward across:
- stock split/reverse split;
- capital reduction;
- share issuance;
- merger/reorganization;
- par-value/capital changes.

PV-030 corporate-action reset remains mandatory.

## Why turnover may add value
Raw share volume is difficult to compare across firms of very different capital structures.
Turnover asks what fraction of the issued share base changed hands.

## Opposing case
- issued-share turnover still ignores actual free float and strategic holdings;
- high turnover can represent informed activity, attention, speculation or disagreement;
- turnover may duplicate liquidity / market-cap / volume features.

## Engineering priority
Secondary to own-history RVOL.
Add only if timestamped issued-share snapshots can be stored cleanly and incremental-value tests show benefit.

Do not estimate shares as marketCap / price as a hidden fallback when official shares are missing; rounding and event timing can contaminate the denominator.

Status: FEASIBLE_SECONDARY_NORMALIZATION / NOT_MINIMUM_V0_1.


# PV-051 — Price-Volume State Is Regime-Dependent

## Evidence
Research finds the return-volume relation can differ materially across bull and bear market states. Chen (2012) reports positive contemporaneous return-volume correlation in bull markets and negative correlation in bear markets, while dynamic predictive evidence from volume to returns is weaker. Emerging-Asian evidence, including Taiwan, also finds heterogeneous volume-return effects across return quantiles.

Sources:
- https://doi.org/10.1016/j.jbankfin.2012.02.003
- https://doi.org/10.1111/j.1467-8586.2011.00428.x
- https://doi.org/10.1016/j.irfa.2021.101923

## System advantage
The current research system already has durable broad-market regime labels such as:
- BULL_BROAD;
- MIXED;
- BEAR_BROAD.

Therefore no new regime model is needed just for PV.

## Required validation split
For every primary PV state report results by:
- BULL_BROAD / MIXED / BEAR_BROAD;
- high-market-volume vs normal/low-market-volume day;
- optionally broad sector-participation state.

## Examples of why sign may change
### High volume + rising price
Bull:
- broad risk appetite / participation can support continuation.
Counter:
- may also be late-stage crowding.

Bear:
- can be short-covering / violent rebound rather than durable accumulation.

### Low volume pullback
Bull:
- may be constructive supply contraction.
Bear:
- may simply reflect lack of buyers / illiquidity.

### Extreme downside volume
Bear:
- can signal worsening liquidation risk.
Counter:
- can also be capitulation near a reversal.

## Promotion rule
A PV feature does not need identical magnitude in every regime, but:
- if sign flips materially, the regime interaction must be explicit;
- if benefit exists only in one small regime sample, keep it UNKNOWN rather than promoting a universal rule.

Status: REGIME_INTERACTION_REQUIRED / UNIVERSAL_SIGN_PROHIBITED.


# PV-052 — Integrated Price-Volume Interpretation Matrix

## Principle
A PV observation must resolve through four questions:
1. What is participation doing?
2. What is price doing per unit participation?
3. Where in structure/life-cycle is this occurring?
4. Is market/data structure distorting the observation?

No single row below is an automatic buy/sell rule.

| Observed state | Constructive interpretation | Adverse interpretation | UNKNOWN / guard conditions | Shadow evidence |
|---|---|---|---|---|
| Low volume during pullback | supply drying up | no demand / fading interest | illiquid, support not defined, missing history | pvDailyRvol20, contraction, slope, support hold, close location |
| Moderate breakout volume | healthy participation | insufficient confirmation | gap-dominated, price-censored | nonlinear RVOL bucket, response state, acceptance |
| Extreme breakout volume | broad/informed recognition | climax, disagreement, crowding | limit-up / corporate action / news ambiguity | RVOL, lateStage, gap, response efficiency, persistence |
| High volume + strong price progress | efficient directional participation | could still be late-stage | price limit, gap, event/news shock | pvResponseState, lateStage, acceptance |
| High volume + little progress | absorption | distribution/exhaustion | auction/VI/price-censored | response state + later acceptance/failure |
| New high + lower normalized participation | scarce supply / efficient trend | bearish participation divergence | pivot not confirmed, old pivot, regime mismatch | PV-049 continuous divergence fields |
| New low + lower selling participation | selling exhaustion | no liquidity / no rebound demand | illiquid, support absent | divergence + reclaim + demand state |
| Persistent abnormal volume | information diffusion / sustained recognition | persistent crowding/attention | common market/sector volume | persistence, residual RVOL, acceptance |
| Fast-decaying abnormal volume | event completed cleanly | failed interest / one-off attention | insufficient event history | event age, peak ratio, decay slope |
| High closing-slot RVOL | genuine end-day demand | benchmark/auction flow | CLOSE_AUCTION_MIXED | same-slot RVOL, next-session acceptance |
| Limit-up / one-sided book | censored unmet demand | unstable/cancelable queue, crowding | no exact limit/book history | PRICE_CENSORED, prospective limit state |
| High turnover | broad share-base participation | speculation/disagreement | issued shares stale, free float unknown | pvTurnoverRate, RVOL, residual context |
| Market-wide high volume + stock high volume | theme/risk-on confirmation | little stock-specific information | sector too small | raw RVOL + market/sector residual RVOL |
| Stock high volume, market/sector normal | stock-specific attention/information | isolated speculation/noise | bad sector classification | residual RVOL |
| Discrete price jump + extreme volume | fast information incorporation | attention/overreaction | news source unknown | Information Discreteness x PV interaction |
| Continuous price drift + moderate persistent volume | gradual recognition | weak/slow demand | low liquidity | ID x persistence x acceptance |

## Decision semantics
Allowed research outputs:
- `CONSTRUCTIVE_CANDIDATE`;
- `ADVERSE_CANDIDATE`;
- `AMBIGUOUS`;
- `DATA_INSUFFICIENT`;
- `MARKET_STRUCTURE_GUARD`.

Do not force every observation into bullish or bearish.

## Strongest engineering candidates after PV-052
### Tier 1 — minimum v0.1
- pvDailyRvol20;
- pvSlotRvol20;
- pvCumvolPace20;
- pvResponseState;
- pvAcceptanceState;
- pvPersistenceState;
- pvGuardState;
- coverage/provenance.

### Tier 2 — after v0.1 proves data quality
- daily market/sector residual RVOL;
- divergence continuous features;
- turnover rate with timestamped issued shares;
- event freshness/decay;
- late-stage interaction.

### Deferred / prospective microstructure
- limit queue/lock duration;
- intraday trade-count baseline;
- historical volume-at-price;
- explicit VI state without an event source;
- true free-float turnover.

## Final research stance at PV-052
The useful price-volume model is not:
“volume rises => stronger.”

It is:
**normalized participation + price response + structural acceptance + persistence + regime + market-structure/data guard.**

Status: INTEGRATED_INTERPRETATION_MATRIX_COMPLETE / FORMAL_CORE_LOCKED.
# PV-053 — Pattern-Maturity x Price-Volume Matrix without Duplicate Scoring

## Goal
The K-line / Pattern Maturity lane already models geometry. PV must contribute only participation/response/acceptance information that is not already encoded in the pattern score.

Academic chart-pattern work supports studying objectively defined geometry, but does not justify multiplying scores for every named pattern-volume slogan.

Source:
- https://www.nber.org/papers/w7613

## Shared latent PV components
Use the same reusable components across VCP, cup/handle, W, platform and false-break:
- supply contraction vs no-demand;
- breakout participation;
- response efficiency;
- acceptance / retest / failure;
- persistence;
- market/data guard.

## Pattern mapping

### VCP / tightening structure
Geometry owns:
- contraction legs;
- narrowing price swings;
- pivot maturity.

PV adds:
- whether participation contracts across already-defined legs;
- whether downside effort falls without support loss;
- breakout/reacceleration participation.

Do not create a separate “VCP volume score” if the same supply-contraction state already exists.

### Cup / Handle
Geometry owns:
- rim/cup/handle shape;
- handle location and depth.

PV adds:
- handle supply state;
- breakout participation;
- post-break acceptance.

### W / Double Bottom
Geometry owns:
- first/second trough and neckline.

PV adds:
- normalized selling participation at comparable troughs;
- reclaim/neckline participation;
- retest acceptance.

A lower-volume second trough can be selling exhaustion OR no demand. No automatic bullish label.

### Platform / Flag / Triangle
Geometry owns:
- range boundary / compression.

PV adds:
- base participation state;
- breakout RVOL;
- false-break lifecycle.

### False Break / Upthrust / Spring
Geometry owns:
- level breach and re-entry.

PV adds:
- effort on breach;
- price progress;
- rejection / absorption ambiguity;
- later acceptance/failure.

## Anti-duplication test
Before adding any pattern x PV field ask:
“If Pattern Maturity and the generic PV latent states are both known, does this new field contain anything else?”

If no, reject it.

Status: INTEGRATION_MAP_COMPLETE / NO_PATTERN_VOLUME_BONUS.


# PV-054 — Sector Leader / Follower Participation Synchronization

## Evidence
Industry information can diffuse gradually. Hou (2007) finds intra-industry lead-lag effects where large firms tend to lead smaller firms, consistent with slow diffusion of common industry information.

Source:
- https://doi.org/10.1093/revfin/hhm003

This supports studying time-ordered sector participation, but does NOT imply that simultaneous sector volume is always bullish.

## Research hierarchy
For each sector/day:
1. identify leaders using information available before the follower observation:
   - market-cap/liquidity tier;
   - existing sector-relative-strength leadership;
   - no future return information.
2. record leader abnormal participation / price acceptance;
3. record follower event time and lag;
4. evaluate whether follower PV event is:
   - synchronized;
   - leader-first diffusion;
   - isolated;
   - broad indiscriminate sector burst.

## Candidate fields
- `pvSectorLeaderState`;
- `pvLeaderRvolMedian`;
- `pvLeaderAcceptanceBreadth`;
- `pvFollowerLagDays`;
- `pvSectorParticipationBreadth`;
- `pvStockVsLeaderResidualParticipation`.

## Constructive interpretation
A follower setup occurring after accepted price/volume strength in established sector leaders may represent information diffusion / rotation.

## Adverse interpretation
- follower can simply be late-stage catch-up;
- broad sector volume can occur at thematic peaks;
- leader definition can become hindsight if based on later performance;
- large firms may lead due liquidity/attention rather than fundamental information.

## Governance
This is a moderator of stock PV context, not a sector-volume bonus.
It must prove incremental value beyond the current sector score / breadth / RS variables.

Status: WORTH_INTERACTION_TEST / HIGH_REDUNDANCY_RISK.


# PV-055 — Event-Day Volume and Baseline Contamination

## Evidence
Earnings/news events often generate abnormal trading volume and attention, but the relation between event-day volume and subsequent returns is not one-directional. PEAD research links attention, unexpected volume, disagreement and delayed price adjustment in different ways.

Sources:
- https://doi.org/10.1111/j.1475-679X.2006.00193.x
- https://doi.org/10.1016/j.jbef.2020.100446
- https://doi.org/10.1016/j.econmod.2022.105796
- https://www.nber.org/papers/w11683

## Problem
Suppose an earnings/material-information event creates 4 days of 5x normal volume.
If each day is treated as a fresh independent event:
- sample size is inflated;
- rolling baseline can start adapting to the event itself;
- “decay” becomes harder to interpret.

## Dual-baseline solution
### Ordinary rolling baseline
Keep the robust prior-20-session median for general RVOL.
Because median is robust, one isolated event day should not dominate it.

### Frozen event-start baseline
When a new abnormal-volume episode begins:
- save the pre-event median baseline in the event record;
- use that frozen baseline for within-episode persistence/decay diagnostics;
- do not replace it with later event days.

This allows:
`currentVolume / preEventBaseline`
to measure event decay cleanly.

## Public-event context
If a verified earnings/material-information timestamp exists, store it as context.
Do not require an external news source for v0.1 and do not infer that “no tagged event” means no information.

## Opposing case
Excluding all earnings/news days from ordinary volume history could make the baseline unrealistically quiet and add an external-data dependency.
Therefore v0.1 should **not** blanket-exclude event days from the 20-session median.

Status: FROZEN_EVENT_BASELINE_WORTH_ADDING / NO_BLANKET_EVENT_EXCLUSION.


# PV-056 — PV Governance: Observer, Modifier, Veto

## Why this layer is needed
A research feature can be useful without deserving power over Formal decisions.
The owner explicitly requires judgment rather than automatically inserting every learned idea into the selector.

## Level 0 — OBSERVER
Default for all PV research.
May:
- log state;
- explain behavior;
- segment outcomes;
- appear in research reports.

May NOT change:
- eligibility;
- ranking;
- BUY;
- maxChase;
- stop;
- capital;
- push.

All current PV fields are here.

## Level 1 — MODIFIER
Future possibility only after prospective incremental evidence and explicit owner approval.
Examples:
- adjust confidence of 15m confirmation;
- alter research ranking within otherwise eligible names;
- require extra confirmation in a validated high-risk state.

Promotion requirements:
- stable incremental value after existing features;
- adequate coverage/regime evidence;
- economic relevance;
- Formal-isolation proposal reviewed as Class C.

## Level 2 — VETO
Extremely high bar.

### Data-semantic veto
Allowed in research immediately:
- missing history;
- unsupported market structure;
- corporate-action incompatible baseline;
- stale/incomplete bar.
Meaning: veto **PV interpretation**, not the stock's Formal eligibility.

### Predictive trading veto
Not approved.
An adverse PV pattern must never automatically reject a Formal candidate unless a later separate Class C proposal demonstrates strong, stable benefit and the owner approves.

## Important distinction
“PV data invalid” and “stock is bad” are completely different statements.

Status: GOVERNANCE_HIERARCHY_DEFINED / ALL_CURRENT_PV=OBSERVER.


# PV-057 — First Prospective Price-Volume Experiment: Pre-Registered Protocol

## Primary question
Does same-slot 15m RVOL plus cumulative-volume pace add incremental information beyond the current previous-5-bar volume ratio for distinguishing valid confirmation from false/no-follow-through confirmation?

This is intentionally narrower than testing every PV idea simultaneously.

## Cohort
Use only stocks already selected/monitored by the existing Formal system.
Do not let PV alter which symbols enter the cohort.

For every eligible completed 15m observation save:
- existing local previous-5-bar volumeRatio;
- pvSlotRvol20;
- pvCumvolPace20;
- response/acceptance/guard state;
- existing Formal 15m inputs;
- plan/pivot context;
- market regime;
- sector/institution context.

## Primary outcomes
Frozen before inspection:
1. false/no-follow-through after the observed confirmation state;
2. MFE and MAE over predefined completed-bar horizons;
3. structural acceptance/failure;
4. BUY-trigger vs NO-BUY descriptive split, without rewriting historical BUY logic.

## Secondary outcomes
- D1 return after relevant event;
- stop-first when a valid Formal plan existed;
- maxChase adverse excursion.

## Primary hypotheses
### H1
Same-slot RVOL/cumulative pace contain information not captured by local previous-5-bar volumeRatio.

### H2
The incremental value, if any, comes from clock-time normalization and participation persistence rather than simply “larger volume is better.”

### H3
PV guard states reduce interpretability; guarded observations should not be pooled blindly with normal-session observations.

No direction (bullish/bearish) threshold is tuned from the same sample.

## Comparator models
A. Existing Formal/context fields only.
B. A + current local volumeRatio.
C. B + pvSlotRvol20.
D. C + pvCumvolPace20.
E. D + latent response/acceptance/guard states.

The research question is the incremental change from A->B->C->D->E, not which model can be tuned to the best historical result.

## Evaluation
Report:
- effect size;
- MFE/MAE;
- false-confirmation rate;
- coverage;
- BULL/MIXED/BEAR splits;
- morning/midday/closing-phase splits;
- date-clustered uncertainty where applicable.

Use PV-024 operational milestones:
- first ~50 completed events = DATA_QA only;
- evidence interpretation only after predeclared broader coverage;
- milestone reviews at 100 / 250 / 500 events without threshold retuning.

## Stop rules
Do not promote if:
- same-slot metrics add no incremental information;
- effect is driven only by one regime/date/sector;
- coverage cost is too high;
- clock-time normalization does not outperform or complement local acceleration;
- benefits disappear after existing Formal controls.

## Implementation boundary
The experiment requires Shadow logging but not a Formal strategy change.
Any later use in BUY/ranking/selection requires a new owner-approved Class C proposal.

Status: PRIMARY_PROSPECTIVE_EXPERIMENT_FROZEN / READY_FOR_RESEARCH_IMPLEMENTATION.
# PV-058 — Exact False / No-Follow-Through Labels for the 15m Experiment

## Principle
Outcome labels may use later bars only after the horizon completes, but the anchor levels must come entirely from the Formal plan / completed bar known at event time.

Never redraw breakout/support levels after observing failure.

## Separate A and B channels
Do not pool A pullback and B breakout outcomes as if they are the same event.

### B breakout anchor
Anchor timestamp = first completed 15m bar in the episode that satisfies the existing Formal B breakout-confirmed definition already present in Worker:
- close >= breakout * 1.003;
- local previous-5-bar volumeRatio >= 1.3;
- strong close;
- upper-shadow ratio < 0.45.

The experiment does not change that definition; it observes alternative PV fields at the same anchor.

Frozen at anchor:
- breakout;
- buyLow/buyHigh or derived retest range;
- maxChase;
- stop;
- anchor OHLC;
- existing local volumeRatio;
- all PV Shadow fields.

### B failure labels
Use current Formal structural semantics where possible.

- `B_FAILED_REENTRY_B1/B2/B4`:
  within the completed-bar horizon, a 15m close falls below `breakout * 0.995`.
  This reuses the system's existing “touch breakout then close below 0.995” failure tolerance rather than inventing a new threshold.

- `B_RETEST_ZONE_LOST_B1/B2/B4`:
  a completed 15m close falls below frozen `retestLow`.

- `B_NO_CLOSE_PROGRESS_B1/B2/B4`:
  after the anchor, no completed-bar close exceeds the anchor close inside the horizon.

- `B_NO_HIGH_PROGRESS_B1/B2/B4`:
  after the anchor, no completed-bar high exceeds the anchor high.

These last two are deliberately threshold-free descriptive outcomes, not “bad trade” labels.

### A pullback anchor
Anchor timestamp = first Formal A BUY-confirmed completed 15m bar under the existing pullback logic.

Frozen:
- buyLow/buyHigh;
- stop;
- anchor OHLC;
- prior stop/reversal bar used by Formal;
- local volume ratio and PV fields.

### A failure labels
- `A_ZONE_LOST_B1/B2/B4`: completed 15m close < frozen buyLow.
- `A_STOP_BROKEN_B1/B2/B4`: only when Formal stop existed at anchor, completed 15m close < frozen stop.
- `A_NO_CLOSE_PROGRESS_B1/B2/B4`: no later completed-bar close > anchor close.
- `A_NO_HIGH_PROGRESS_B1/B2/B4`: no later completed-bar high > anchor high.

## Why multiple labels
A breakout can fail structurally without immediately hitting the plan stop.
A setup can hold structure yet show no follow-through.
These are distinct outcomes and must not be collapsed into one subjective “false signal.”

## MFE / MAE
Always compute continuous MFE/MAE alongside the binary structural labels.
Binary thresholds alone discard information.

Status: LABEL_SEMANTICS_FROZEN / FORMAL_DEFINITIONS_REUSED.


# PV-059 — Intraday Bar Horizons vs Trading-Day Horizons

## Problem
A 15m event at 09:30 and an event at 13:15 do not have equal same-day opportunity for 4 or 8 future bars.
Rolling the late event into the next session would mix intraday continuation with overnight information.

## Intraday bar horizons
Primary same-session horizons:
- B1 = next completed 15m bar;
- B2 = next 2 completed 15m bars;
- B4 = next 4 completed 15m bars.

Rule:
If the current trading session ends before the full bar horizon is observed, that horizon is `INCOMPLETE`.
Do NOT continue counting into the next trading day.

This makes morning/midday/late-session observations comparable on a clearly defined basis while honestly losing some late-session coverage for longer horizons.

## Overnight / next-session outcomes
Store separately:
- NEXT_OPEN return;
- NEXT_SESSION_HIGH/LOW excursion;
- NEXT_CLOSE return.

Do not call these B1/B2/B4.

## Daily horizons
D1 / D3 / D5 / D10 use future trading dates from the official trading calendar, not calendar days.

## Overlap
Multiple snapshots from the same event can have overlapping future windows.
PV-041 event_key grouping remains mandatory so inference does not pretend overlapping snapshots are independent.

## Session-phase reporting
Always report B-horizon coverage by:
- OPEN_AUCTION_MIXED;
- CONTINUOUS;
- CLOSE_AUCTION_MIXED.

Closing-phase B4 will naturally have low/no same-session coverage; do not impute it.

Status: HORIZON_SEMANTICS_FROZEN.


# PV-060 — Outcome Completion / Finalization Jobs and Idempotency

## Storage principle
Feature snapshots are append-only / immutable.
Outcome rows are completed later when enough future data exist.

## Intraday finalization
After a newly completed 15m bar:
- identify pending B1/B2/B4 outcomes whose required same-session horizon has now completed;
- calculate only from completed official bars;
- upsert by `snapshot_id + horizon`;
- once `outcome_complete=1`, repeated cron runs must produce the identical value or fail validation.

At session end:
- horizons impossible to complete because the session ended are marked `INCOMPLETE_SESSION_END`, not zero / failure.

## Daily finalization
After official daily data are available:
- map snapshot market date through the existing official trading calendar;
- finalize D1/D3/D5/D10 only when the required future trading date is present;
- holidays/weekends do not count;
- missing official bars keep outcome pending.

## Idempotency
A finalizer must be safe under the current every-minute cron architecture.

Required keys:
- feature snapshot unique identity;
- outcome primary key = snapshot_id + horizon.

Repeated job:
- no duplicate snapshot;
- no duplicate outcome;
- no horizon counter advancement from rerun alone.

## Provenance
Outcome row stores:
- source trading dates / bar ends;
- finalized_at;
- data completeness;
- schema version.

## Mutation test
Re-running finalization one day later with the same source bars must leave the completed outcome byte-equivalent except for non-semantic audit metadata explicitly excluded from equality checks.

Status: FINALIZER_DESIGN_DEFINED / NOT_IMPLEMENTED.


# PV-061 — API and D1 Budget Audit under Current Monitor Architecture

## Current Formal architecture
Worker currently:
- monitors at most 6 stocks (3 non-thousand + 3 thousand);
- runs the intraday monitor every minute during the regular session;
- fetches Quote each minute;
- refreshes 10m/15m candles only after relevant bar close;
- was explicitly designed around a 60-requests/minute Fugle safety architecture.

These are existing project constraints; PV must not create a second parallel live-fetch loop.

## Incremental live API cost for PV v0.1
### During ordinary monitoring
Target: **zero additional live candle calls**.

PV calculations should consume the already fetched Formal 15m frame/candle response:
- local volumeRatio already exists;
- pvResponseState uses the same OHLCV;
- current-session cumulative volume can be derived from existing bars;
- event/acceptance state can be updated from the same frame.

Do not call Fugle again merely to calculate Shadow fields.

### Historical 15m bootstrap
One historical 15m request per newly monitored symbol lacking a baseline, covering enough prior calendar history to obtain >=20 valid sessions.

Then persist baseline/cache and roll it forward.

Fugle documents that rate limits vary by plan and excess requests return HTTP 429; therefore the implementation must respect the active account's actual quota rather than hard-code an external plan assumption.

Source:
- https://developer.fugle.tw/docs/data/http-api/getting-started/

## D1 snapshot upper bound — SUPERSEDED BY PV-068
Earlier PV-061 assumed a complete 270-minute session implied 18 observable 15m bars under the current live-monitor path. PV-068 corrected this after auditing Fugle timestamp semantics and the actual Formal cron.

For **zero-extra-live-call v0.1**, the current monitor stops at 13:24, so only completed 15m bars starting 09:00 through 13:00 are observable: 17 bars/symbol.

At the current Formal maximum of 6 symbols:
- current zero-extra-call ceiling = 17 x 6 = 102 intraday feature snapshots / trading day.

Closing-auction / 13:15–13:30 research is outside this v0.1 live path unless separately designed and budgeted.

## D1 outcomes
If B1/B2/B4 plus selected daily horizons are separate rows, outcome-row count can exceed feature-row count.
This is acceptable architecturally only if:
- inserts/upserts are idempotent;
- indexes use snapshot/horizon keys;
- payload JSON remains compact;
- retention/archival is reviewed before long-term scale-up.

Do not write the same 15m snapshot every minute.
Unique identity must be bar-end based so 15 monitor runs during one bar still create only one row per symbol/bar/schema.

## Daily layer
Daily RVOL/residual calculations should use the existing D1 full-market history cache.
Incremental daily historical Fugle calls should be zero when the cache is complete.

## Explicit exclusions from v0.1 budget
No:
- full-market 15m baseline fetch;
- historical trades pagination;
- historical volume-at-price reconstruction;
- second 10m Shadow baseline;
- live order-book recording every minute.

Status: V0_1_RESOURCE_DESIGN_ACCEPTABLE_IN_PRINCIPLE / MUST_MEASURE_ACTUAL_CALLS_AND_WRITES_IN_LOG_ONLY.


# PV-062 — Research Reporting / Dashboard Semantics

## Goal
Surface evidence without turning Shadow diagnostics into trade instructions.

## Research summary
A PV research page/report should show:
- snapshot/event count;
- independent event count after de-duplication;
- coverage / UNKNOWN / guard rates;
- current local volumeRatio distribution;
- pvSlotRvol20 distribution;
- pvCumvolPace20 distribution;
- A vs B channel counts;
- BULL/MIXED/BEAR counts;
- session-phase counts.

## Primary experiment table
Compare models/stages:
A. context only;
B. + local previous-5 volumeRatio;
C. + slot RVOL;
D. + cumulative pace;
E. + response/acceptance/guard state.

Show:
- false structural failure rate;
- no-close/no-high-progress rate;
- median MFE/MAE;
- coverage;
- confidence interval / uncertainty where applicable.

## No trading language
Research UI must not say:
- BUY because PV strong;
- SELL because PV weak;
- upgrade/downgrade Formal grade;
- increase/reduce allocation.

Allowed:
- “Shadow state: ELEVATED participation / INITIAL_ACCEPTANCE”
- “Research cohort historically showed X outcome distribution”
- “Insufficient sample / UNKNOWN”

## Drift / integrity alerts
Report:
- baseline missing;
- corporate-action resets;
- unusual guard-rate increase;
- feature distribution shift;
- Formal-isolation test failure.

Any Formal-isolation failure is red-alert engineering failure, not a market signal.

## Access
Prefer admin/research surface rather than the normal user-facing signal panel until the experiment has enough evidence, reducing the risk that a descriptive Shadow state is mistaken for an action signal.

Status: RESEARCH_REPORTING_SPEC_DEFINED / NO_PUSH_NO_ACTION.
# PV-063 — Exact pvResponseState Formula v0.1

## Objective
Describe how much price response occurred relative to observed participation without converting the state into a directional trading signal.

This is a descriptive state machine, not a buy/sell rule.

## Required inputs
For the current completed 15m bar:
- open/high/low/close;
- closePosition;
- upperShadowRatio;
- lowerShadowRatio;
- pvSlotRvol20;
- prior-20-valid-session same-slot median true range;
- pvGuardState / flags.

Historical 15m bootstrap already contains OHLCV, so the same-slot range baseline does not require a second API family.

## Derived variables
- `barRange = high - low`
- `body = abs(close - open)`
- `signedBody = close - open`
- `bodyShare = body / max(barRange, epsilon)`
- `slotRangeMedian20 = median(prior 20 valid same-slot trueRange)`
- `rangeExpansion20 = currentTrueRange / slotRangeMedian20`
- `signedProgress20 = signedBody / slotRangeMedian20`

If slotRangeMedian20 <= 0 or <20 valid sessions => response state UNKNOWN.

## Participation bands
Use existing research / Formal semantics rather than outcome-tuning:
- LOW: pvSlotRvol20 <= 0.8
- NORMAL: 0.8 < pvSlotRvol20 < 1.3
- ELEVATED: 1.3 <= pvSlotRvol20 < 2.5
- EXTREME: pvSlotRvol20 >= 2.5

Rationale:
- 0.8 already exists in current volume-signal semantics as contraction;
- 1.3 already exists as attack/breakout volume;
- 2.5 was frozen in PV-008 as the boundary into very high breakout-volume buckets.
No outcome inspection is used to create these v0.1 boundaries.

## Response states

### EFFICIENT_UP
Require:
- participation ELEVATED or EXTREME;
- close > open;
- closePosition >= 2/3;
- upperShadowRatio < 0.45;
- signedProgress20 >= +0.25 OR rangeExpansion20 >= 1.0 with bodyShare >= 0.5.

### EFFICIENT_DOWN
Symmetric:
- participation ELEVATED or EXTREME;
- close < open;
- closePosition <= 1/3;
- lowerShadowRatio < 0.45;
- signedProgress20 <= -0.25 OR rangeExpansion20 >= 1.0 with bodyShare >= 0.5.

### HIGH_EFFORT_LOW_PROGRESS
Require:
- participation ELEVATED or EXTREME;
AND at least one:
- abs(signedProgress20) < 0.25;
- bodyShare <= 0.25;
- closePosition between 1/3 and 2/3.

This state remains directionally AMBIGUOUS because it can represent absorption, distribution or two-sided disagreement.

### LOW_EFFORT_LOW_PROGRESS
Require:
- participation LOW;
- abs(signedProgress20) < 0.25;
- rangeExpansion20 < 1.0.

Possible interpretations include quiet supply contraction or no demand.

### NORMAL_RESPONSE
Anything valid that does not satisfy the stronger states.

### UNKNOWN
Any:
- insufficient slot/range history;
- invalid/missing OHLCV;
- unsupported market structure;
- corporate-action/reset semantics that make the baseline incomparable.

## Guard interaction
PRICE_CENSORED and AUCTION_MIXED observations may still store the raw derived metrics, but the primary directional response state is downgraded to `GUARDED_RESPONSE` for primary analysis; substate retains the mechanical classification for diagnostics.

## Why range baseline is needed
A tiny full-body green candle on 3x volume is not necessarily efficient price response.
Same-slot range normalization prevents bodyShare alone from calling a historically tiny move “efficient.”

Amihud-style return-per-dollar-volume measures are only rough price-impact proxies, and Taiwan evidence shows their interpretation can be dominated by volume/mispricing components, especially under price limits. Therefore pvResponseState is explicitly descriptive, not a liquidity/alpha factor.

Sources:
- https://doi.org/10.1016/S1386-4181(01)00024-6
- https://doi.org/10.1016/j.pacfin.2023.101984

Status: FORMULA_V0_1_FROZEN / SHADOW_ONLY.


# PV-064 — Exact pvAcceptanceState Transitions for A and B

## Principle
Acceptance is channel-specific.
A pullback does not pass through the same geometry as a B breakout.

Every transition stores its own timestamp. Later states never rewrite earlier timestamps.

## Common fields
- acceptanceState;
- acceptanceStateEnteredAt;
- acceptanceEventKey;
- previousAcceptanceState;
- transitionReason;
- frozenPlanLevels;
- decisionImpact=false.

## B channel

### B_PRE_EVENT
No valid breakout attempt yet.

### B_BREAKOUT_ATTEMPT
First completed 15m bar with:
- high >= frozen breakout
OR
- close >= frozen breakout.

This is observation only; Formal breakout confirmation may still be absent.

### B_INITIAL_ACCEPTANCE
Use the existing Formal breakoutConfirmed semantics:
- completed bar close >= breakout * 1.003;
- existing local previous-5-bar volumeRatio >=1.3;
- strongClose;
- upperShadowRatio <0.45.

PV fields do not cause the transition; they are observed alongside it.

### B_RETEST
After B_INITIAL_ACCEPTANCE, a later completed bar overlaps the frozen retest zone:
- low <= retestHigh;
- high >= retestLow.

### B_REACCELERATION
After a B_RETEST bar that still holds structure:
- close >= breakout * 0.997;
- a later completed bar is bullish;
- later close > retest-bar close OR later high > retest-bar high;
- later close remains >= breakout * 0.997.

This describes renewed price progress and does not require any new PV threshold.

### B_FAILED_REENTRY
At any point after B_BREAKOUT_ATTEMPT and before expiry:
- completed 15m close < breakout * 0.995
OR
- completed 15m close < frozen retestLow after acceptance.

Store which failure condition fired.

### B_EXPIRED_AMBIGUOUS
Episode ends by predeclared time/session rule without REACCELERATION or FAILED_REENTRY.

## A channel

### A_PRE_EVENT
No interaction with pullback zone.

### A_PULLBACK_TEST
Completed bar overlaps frozen buy zone and closes >= buyLow.

### A_INITIAL_ACCEPTANCE
Reuse existing Formal pre-BUY setup semantics:
- bar entered/overlapped the zone;
- held close >= buyLow;
- local previous-5-bar volumeRatio <=0.9;
- reversalK OR strongClose.

### A_REACCELERATION
Equivalent to the existing Formal A BUY structure:
- previous bar satisfied the accepted pullback setup;
- current low >= previous low;
- current bar bullish;
- current close > previous close OR current high > previous high.

Again PV Shadow does not cause the state; it observes it.

### A_FAILED_REENTRY
- completed 15m close < frozen buyLow;
OR if a valid stop existed at anchor:
- completed 15m close < frozen stop.

### A_EXPIRED_AMBIGUOUS
Zone interaction ended without reacceleration/failure under the frozen episode rule.

## State-history rule
Store transitions append-only:
- `stateHistory=[{state,enteredAt,reason}]`
or normalized rows if preferred.

Never overwrite the first B_INITIAL_ACCEPTANCE timestamp when a later retest succeeds.

Status: CHANNEL_SPECIFIC_STATE_MACHINE_FROZEN.


# PV-065 — pvPersistenceState without Outcome Tuning

## Goal
Describe whether abnormal participation is fresh, sustained, fading or normalized using thresholds already frozen elsewhere.

## Abnormal threshold
For v0.1:
`abnormal = normalizedParticipation >= 1.3`.

This reuses the existing system's attack-volume threshold and the PV-063 participation boundary.

Use:
- daily pvDailyRvol20 for daily episodes;
- pvSlotRvol20 for 15m slot episodes.

Do not combine daily and 15m ratios into one sequence.

## States

### NORMAL
No active event and current normalized participation <1.3.

### FRESH_SHOCK
Current >=1.3 and immediately prior comparable observation <1.3, or no active event exists.

Create new event_key and freeze pre-event baseline.

### PERSISTENT
Current >=1.3 and event already has >=2 consecutive abnormal comparable observations.

Store:
- consecutiveAbnormalCount;
- eventAge;
- peakRvol;
- observationsSincePeak.

### DECAYING
Event was FRESH/PERSISTENT and current <1.3 for exactly one comparable observation.

Do not close the event yet; one normal observation may be temporary.

### NORMALIZED
Event has >=2 consecutive comparable observations <1.3.

Close the event at the second below-threshold observation.

### REIGNITED
Optional diagnostic:
while in DECAYING, current returns >=1.3 before normalization.
Retain the same event_key but store reignitionCount.

## Why two below-threshold observations
This is a pre-registered hysteresis rule to prevent one noisy bar/day from ending an event.
It is not tuned to returns.

## Gap rules
Missing/halted/non-comparable observations do not count as below-threshold observations.
They pause state evaluation and raise a guard.

## Daily event isolation
A Friday abnormal day followed by Monday abnormal day is consecutive by trading observation, not separated by weekend calendar days.

Status: PERSISTENCE_V0_1_FROZEN.


# PV-066 — pvGuardState Precedence and Multi-Flag Semantics

## Design
One primary guard string is insufficient when multiple conditions coexist.
Store:
- `pvGuardState` = highest-precedence primary guard;
- `pvGuardFlags[]` = all applicable guards;
- `pvInterpretability` = VALID / GUARDED / INVALID.

## Precedence

### INVALID guards
1. `INVALID_SOURCE_DATA`
2. `UNSUPPORTED_MARKET_STRUCTURE`
3. `CORPORATE_ACTION_RESET`
4. `REFERENCE_PRICE_UNRESOLVED`
5. `DATA_INSUFFICIENT`
6. `STALE_OR_INCOMPLETE_BAR`

Any INVALID guard means primary PV interpretation = UNKNOWN.
Raw source data may still be stored for audit if valid enough.

### GUARDED contextual states
7. `PRICE_CENSORED`
8. `AUCTION_MIXED`
9. `GAP_DOMINATED`
10. `ILLIQUIDITY_WARNING`
11. `VI_STATE_UNKNOWN_CONFOUNDER`

These allow metric storage but require stratified analysis or exclusion from the primary clean cohort.

### VALID
12. `NORMAL_MARKET`

## Multiple flags example
Ex-dividend opening bar near upper limit:
- pvGuardState = REFERENCE_PRICE_UNRESOLVED if the adjusted reference is missing;
- pvGuardFlags may also contain AUCTION_MIXED, PRICE_CENSORED, GAP_DOMINATED;
- pvInterpretability = INVALID.

If the adjusted reference is verified:
- primary may become PRICE_CENSORED;
- AUCTION_MIXED and GAP_DOMINATED remain flags;
- interpretability = GUARDED.

## Crucial governance rule
A PV INVALID/GUARDED state never means the Formal stock is invalid.
It means only that the PV research interpretation is invalid/guarded.

Status: GUARD_PRECEDENCE_FROZEN.


# PV-067 — Implementation-Ready Pseudocode and Test Contract

## No Worker modification yet
This section specifies code shape and tests only.
Any implementation remains a separate research-only Class A proposal.

## Pseudocode: completed 15m observation

```text
onCompleted15m(symbol, plan, frame15, dailyContext, baselineCache):
    bar = frame15.latest
    assert bar is completed

    guards = evaluatePvGuards(symbol, plan, bar, dailyContext, baselineCache)

    slotStats = baselineCache.sameSlot(bar.time)
    if slotStats.validSessions < 20:
        guards += DATA_INSUFFICIENT

    slotRvol = safeRatio(bar.volume, slotStats.volumeMedian20)
    cumPace = safeRatio(currentSessionCumulativeVolume(frame15),
                        slotStats.cumulativeVolumeMedian20)

    response = classifyResponse(
        bar,
        slotRvol,
        slotStats.trueRangeMedian20,
        guards
    )

    acceptance = advanceAcceptanceState(
        previousState,
        plan,
        frame15,
        existingFormalEvaluation
    )

    persistence = advancePersistenceState(
        previousPersistence,
        slotRvol,
        comparableObservation=true
    )

    snapshot = immutable({
        symbol,
        barEnd,
        planLevelsFrozen,
        existingLocalVolumeRatio,
        slotRvol,
        cumPace,
        response,
        acceptance,
        persistence,
        guardState,
        guardFlags,
        coverage,
        schemaVersion,
        decisionImpact:false
    })

    insertIfAbsent(snapshotKey, snapshot)
```

## Pseudocode: baseline bootstrap

```text
ensure15mBaseline(symbol):
    if cache exists and validSessions >= 20 and no reset:
        return cache

    bars = fetch historical 15m once
    split by trading session and same-slot key
    discard future/current incomplete session from baseline
    discard invalid/halted/missing bars; do not zero-fill
    calculate prior-session volumeMedian / trueRangeMedian /
        cumulativeVolumeMedian
    persist cache with asOf marketDate
```

## Pseudocode: finalizer

```text
finalizePendingOutcomes(newCompletedBarOrDailyBar):
    pending = outcomes whose horizon can now be completed
    for each:
        load immutable snapshot
        use frozen plan/pivot levels
        compute horizon outcome
        upsert(snapshotId,horizon)
        if already complete:
            assert semantic equality
```

## Required test contract

### T1 No-look-ahead slot baseline
Add an extreme future session to fixture.
Historical snapshot for prior date must remain byte-identical.

### T2 Bar completion
At 10:14:59 a 10:00-10:15 bar cannot be used.
At/after 10:15 according to verified provider semantics, it may be used.

### T3 Same-slot seasonality
A closing bar 1.5x recent midday bars but normal versus historical closing slots must show:
- high local acceleration possible;
- near-normal pvSlotRvol20 possible.
Both values retained.

### T4 Response ambiguity
3x slot RVOL + tiny body/central close => HIGH_EFFORT_LOW_PROGRESS, not bullish.

### T5 Efficient up
Elevated RVOL + strong close + adequate normalized progress => EFFICIENT_UP.

### T6 Price limit
Same price/volume fixture with PRICE_CENSORED guard => primary response GUARDED, not clean efficient-up cohort.

### T7 B state machine
PRE_EVENT -> BREAKOUT_ATTEMPT -> INITIAL_ACCEPTANCE -> RETEST -> REACCELERATION with immutable timestamps.

### T8 B failure
Later close < breakout*0.995 => B_FAILED_REENTRY without rewriting prior acceptance.

### T9 A state machine
PRE_EVENT -> PULLBACK_TEST -> INITIAL_ACCEPTANCE -> A_REACCELERATION according to existing Formal conditions.

### T10 Persistence hysteresis
1.4,1.6,1.2,1.5 ratios =>
FRESH_SHOCK -> PERSISTENT -> DECAYING -> REIGNITED,
same event_key.

### T11 Persistence close
1.4,1.5,1.2,1.1 =>
FRESH -> PERSISTENT -> DECAYING -> NORMALIZED.

### T12 Missing observation
1.5, missing, 1.4 does not count missing as below-threshold.

### T13 Corporate action reset
Pre-event baseline cannot be reused after reset until >=20 valid post-reset sessions.

### T14 Unit safety
Daily shares and intraday lots cannot enter the same raw ratio.

### T15 Formal isolation
With Shadow OFF vs ON, identical fixture inputs must produce exactly identical:
- selected symbols;
- source ranks;
- plan prices;
- finalDecision;
- BUY/ADD/REDUCE;
- allocation;
- push payload.

### T16 D1 idempotency
15 one-minute monitor cycles inside the same completed 15m slot create exactly one feature row per symbol/schema.

### T17 Outcome idempotency
Repeated finalizer on same source data leaves completed outcome semantically identical.

### T18 Late-session horizon
13:15 event cannot manufacture B4 by consuming next-session bars.

## Proposed schema version
`PV_SHADOW_V0_1`

A semantic change to thresholds/state rules must increment schemaVersion and must not rewrite prior rows.

Status: IMPLEMENTATION_READY_SPEC / WORKER_UNCHANGED.
# PV-068 — Fugle Candle Timestamp Semantics and Current-Cron Coverage Correction

## Provider timestamp semantics
Fugle v1 migration documentation explicitly states that for 1-minute candles:
- trades from 09:00:00 through 09:00:59 belong to the candle timestamped 09:00.

The official historical-candle example also shows a separate 13:30 one-minute candle for the closing auction print.

Sources:
- https://developer.fugle.tw/docs/data/migration-guide/
- https://developer.fugle.tw/docs/data/http-api/historical/candles/

Therefore v1 candle timestamps are start-of-bucket semantics for ordinary minute bars.

## Important unresolved detail
Do not infer the exact 15m treatment of the isolated 13:30 closing-auction print solely from the 1m example.
A fixture must verify whether historical/intraday 15m returns:
- a separate 13:30 bar;
- a special aggregation;
- or another documented boundary behavior.

## Current Worker coverage
The existing Formal cron runs:
- every minute 09:00–12:59 Taiwan time;
- every minute 13:00–13:24;
- it does NOT run 13:25–13:30.

Current `analyzeFrame` treats a bar as complete only after:
`barStart + timeframe`.

Therefore under current Formal data flow:
- 13:00–13:15 can be observed as a completed 15m bar;
- 13:15–13:30 cannot become completed before the current monitor cron stops;
- the 13:30 closing-auction print is not part of the ordinary live-monitor observation path.

## Correction to PV-061 resource ceiling
The earlier “18 x 15m slots x 6 stocks = 108 rows/day” assumption is not correct for **zero-extra-live-call v0.1 under the current cron**.

Observed completed 15m starts are expected from 09:00 through 13:00 inclusive:
17 possible completed bars per symbol.

Thus current zero-extra-call ceiling:
`17 x 6 = 102 intraday feature snapshots / trading day`.

This is an engineering bound for the present cron, not a statement that the exchange has only 17 15m market intervals.

## Closing-auction research
If later research wants 13:15–13:30 / closing-auction information, it needs a separate after-close capture/finalization design and must be budgeted separately.
Do NOT silently extend the Formal monitor cron just to collect research.

Status: PROVIDER_SEMANTICS_PARTLY_CONFIRMED / V0_1_COVERAGE_CORRECTED.


# PV-069 — Day-Trading Intensity as a Taiwan-Specific Volume-Quality Moderator

## Evidence
Taiwan research after relaxation of day-trading restrictions finds day-trading volume rose materially and that unexpected day-trading volume can have stronger relationships with volatility / return dynamics than aggregate market volume.

Source:
- https://doi.org/10.1016/j.heliyon.2023.e14939

Earlier Taiwan research also finds speculative/day-trading activity can affect intraday volatility, with effects depending on how speculative activity is measured.

Source:
- https://doi.org/10.1016/S1044-0283(03)00043-7

## Official data availability
TWSE publishes per-security day-trading volume/value in its day-trading statistics report.
TPEx likewise publishes per-security day-trading volume/value, with an important caveat that TPEx values can continue to be adjusted through T+2, and T+2 is the final correct figure.

Sources:
- https://www.twse.com.tw/exchangeReport/TWTB4U?response=html&selectType=All
- https://www.twse.com.tw/zh/products/system/day-trading.html
- https://www.tpex.org.tw/zh-tw/mainboard/trading/day-trading/statistics/day.html

## Candidate after-market fields
- `pvDayTradeVolumeShares`;
- `pvDayTradeShare = officialDayTradeVolume / compatibleOfficialTotalVolume`;
- `pvDayTradeShareRvol20`;
- `pvDayTradeDataFinality = T / T+1 / T+2_FINAL`.

Do not compute the ratio until numerator/denominator volume scope is verified compatible.

## Constructive interpretation
High day-trading share can improve liquidity and indicate broad active participation.

## Adverse interpretation
High day-trading share can also mean:
- short-horizon churn;
- attention/speculation;
- elevated volatility;
- weaker persistence into later sessions.

Therefore it is a moderator of volume quality / risk, not a discount factor and not a bullish/bearish score.

## Timing rule
Because final day-trading statistics are after-market and TPEx may revise to T+2:
- never use final T+2 knowledge in a T-day selection snapshot;
- T-day as-known value may be stored with finality flag;
- later revisions create a separate data-quality/final record, not retroactive mutation of the T-day as-of feature.

Status: TAIWAN_SPECIFIC_TIER2_MODERATOR / AS_OF_FINALITY_REQUIRED.


# PV-070 — Correction: Daily Transaction Count Is Available from Official Closing Data

## Correction to PV-029
PV-029 correctly states that historical Fugle candles do not provide historical transaction count, so **intraday historical trade-count baselines** are not available from candle history.

However, daily transaction count is available from official Taiwan daily stock reports.

TWSE official daily stock data include:
- traded shares;
- traded value;
- number of transactions.

TPEx daily stock quotes likewise publish transaction-count fields in the official daily data family.

Sources:
- https://data.gov.tw/dataset/11549
- https://data.gov.tw/dataset/11370

## Current Worker opportunity
The Worker already fetches:
- TWSE `STOCK_DAY_ALL`;
- TPEx `tpex_mainboard_daily_close_quotes`.

But `normalizeMarketRow` currently extracts:
- volumeShares;
- tradeValue;
and does **not** persist transaction count.

Therefore daily transaction-count research is potentially a low-cost extension of data already being fetched.

## Candidate daily fields
- `pvTransactionCount`;
- `pvAverageTradeSizeShares = volumeShares / transactionCount`;
- `pvTransactionCountRvol20`;
- `pvAverageTradeSizeRvol20`.

## Why this may matter
Two stocks can both trade 2x normal share volume:
- one because many small transactions occurred;
- another because average trade size rose.

Taiwan research has reported that number of trades can explain volatility differently from average trade size.

## Opposing interpretation
- trade splitting / algorithmic execution changes the meaning of “average trade size” over time;
- transaction count may duplicate volume/attention;
- public daily count does not identify buyer/seller type;
- cross-market field semantics must be fixture-tested before merging TWSE and TPEx.

## Decision
Upgrade **daily transaction count** from second-stage prospective-only to:
`TIER2_LOW_INCREMENTAL_COST_CANDIDATE`.

Intraday trade-count remains prospective/current-trades only.

Status: PV-029_PARTIALLY_CORRECTED / DAILY_COUNT_FEASIBLE.


# PV-071 — Daily vs Intraday Volume Scope Must Not Be Assumed Identical

## Market structure
TWSE has multiple trading mechanisms beyond ordinary round-lot regular trading:
- regular trading;
- intraday odd-lot;
- after-hours fixed-price;
- after-hours odd-lot;
- block trading;
- other sessions.

TWSE market daily summaries explicitly state that some daily statistics cover regular, odd-lot, after-hours fixed-price and block trading.

Source:
- https://www.twse.com.tw/en/products/system/trading.html
- https://www.twse.com.tw/en/exchangeReport/FMTQIK?response=html

Fugle intraday candles support a separate `type=oddlot` parameter, which is evidence that default intraday candle scope and odd-lot scope are distinct.

Source:
- https://developer.fugle.tw/docs/data/http-api/intraday/candles/

## Research consequence
Do NOT assume:
`sum(default intraday 15m volume) * 1000 == historical daily volume`.

The daily and intraday products may have different session/instrument-scope semantics.

## v0.1 safe rule
- daily RVOL is normalized only against historical daily volume from the same source family;
- intraday slot RVOL/cumulative pace are normalized only against historical intraday default-candle volume from the same source family;
- never use daily total as the denominator of intraday cumulative pace.

This was already the intended architecture; PV-071 makes the source-scope reason explicit.

## Fixture reconciliation
Before any cross-timeframe volume arithmetic:
on several liquid TWSE and TPEx stocks/dates compare:
1. sum of default 1m/15m intraday volume;
2. Fugle daily volume;
3. official exchange daily volume;
4. odd-lot volume where separately available.

Store observed scope relationship; do not “correct” discrepancies without source documentation.

Status: SOURCE_SCOPE_GUARD / CROSS_TIMEFRAME_RAW_VOLUME_DIVISION_PROHIBITED.


# PV-072 — Attention / Disposition / Abnormal-Security Status as PV Context

## Data availability
Fugle v1 migration documentation exposes security metadata/state including:
- `isAttention`;
- `isDisposition`;
- `isUnusuallyRecommended`;
- `isSpecificAbnormally`;
- securityStatus.

Source:
- https://developer.fugle.tw/docs/data/migration-guide/

TWSE also publishes official attention / disposition-related datasets in its market-information/OpenAPI ecosystem.

## Why it matters
A stock under attention/disposition or unusual-promotion status can show abnormal:
- volume;
- transaction count;
- volatility;
- liquidity;
because market participants are reacting not only to the underlying stock story but also to regulatory attention or trading restrictions.

## Research fields
- `pvAttentionFlag`;
- `pvDispositionFlag`;
- `pvUnusualRecommendationFlag`;
- `pvAbnormalSecurityFlag`;
- status source timestamp.

## Interpretation
These are context/guard variables, not negative scores.

Possible adverse interpretation:
- abnormal participation may be attention/speculation-driven;
- trading rules/status can alter liquidity and behavior.

Counter-case:
- genuine fundamental information can coexist with an attention flag;
- regulatory attention does not prove the move will reverse.

## Governance
Primary clean-cohort PV experiments should report results:
- with these flags excluded;
- and separately as a guarded subgroup.

No automatic rejection of Formal candidates.

Status: TIER2_CONTEXT_GUARD / NO_FORMAL_PENALTY.


# Batch correction and synthesis after PV-072

Three important corrections/refinements are now durable:

1. **Zero-extra-call v0.1 current-cron coverage is 17 completed 15m bars per symbol, not 18.**
   Current theoretical ceiling = 102 feature rows/day for six stocks.
   Closing-auction research is outside the current live-monitor path.

2. **Daily transaction count is available cheaply from exchange closing data already fetched by Worker.**
   Only intraday historical trade-count remains unavailable from historical candles.

3. **Daily and intraday volume must remain source-family-normalized.**
   Their trading-session scope must not be assumed identical.

The next layer of PV research should treat day-trading intensity and regulatory attention as contextual explanations for “why volume is high,” not as independent bullish/bearish signals.
# PV-073 — Decompose Daily Abnormal Volume into Transaction Count vs Average Trade Size

## Identity
At daily level:
`traded shares = transaction count x average shares per transaction`.

The components answer different questions:
- did activity rise because there were many more executions?
- or because average executed size was larger?

## Taiwan evidence
Taiwan OTC evidence finds number of transactions explains price volatility/liquidity more strongly than average trade size in its sample, and the relation varies with market condition.

Sources:
- https://doi.org/10.1108/03074350610703849
- https://scholars.lib.ntu.edu.tw/handle/123456789/414879

## Candidate daily fields
Using official TWSE/TPEx daily closing data:
- `pvTransactionCount`;
- `pvAvgTradeSizeShares = volumeShares / transactionCount`;
- `pvTransactionCountRvol20 = currentCount / median(prior20 valid counts)`;
- `pvAvgTradeSizeRvol20 = currentAvgSize / median(prior20 valid avg sizes)`.

## Descriptive decomposition states
Reuse 1.3 abnormal threshold without outcome tuning:
- `COUNT_DRIVEN`: count RVOL>=1.3, avg-size RVOL<1.3;
- `SIZE_DRIVEN`: avg-size RVOL>=1.3, count RVOL<1.3;
- `BOTH_EXPANDED`: both>=1.3;
- `NEITHER_COMPONENT_EXTREME`: neither>=1.3;
- `UNKNOWN`.

## Possible interpretations

### COUNT_DRIVEN
Constructive:
- wider participation / attention / information arrival.

Adverse:
- order splitting / algorithmic fragmentation;
- speculative churn;
- high retail attention.

### SIZE_DRIVEN
Constructive:
- larger blocks / concentrated conviction may matter.

Adverse:
- one/few large executions can distort the day;
- cannot identify institutional investor from trade size alone;
- block/auction/session-scope effects can contaminate interpretation.

### BOTH_EXPANDED
Constructive:
- broad and deep participation.

Adverse:
- maximum crowding/attention can also occur near peaks.

## Governance
Do not label count-driven as retail or size-driven as institutional without investor-type evidence.
Treat decomposition as information-intensity/risk context.

Status: TIER2_LOW_COST_DECOMPOSITION.


# PV-074 — Intraday Volume Shape: Front-Loaded, Persistent, or Spiky

## Motivation
Two days can have the same cumulative-volume pace but different shapes:
- huge opening burst then silence;
- steady elevated participation all session;
- one isolated midday spike.

PV-005 slot RVOL + cumulative pace already capture much of this. The question is whether a compact shape descriptor adds anything incremental.

## Live/as-of-safe descriptors
At each observed completed 15m bar:
- `pvPeakSlotRvolSoFar`;
- `pvBarsSincePeakSlotRvol`;
- `pvAbnormalSlotCountSoFar` using >=1.3;
- `pvPostOpeningAbnormalCount`;
- `pvOpeningBlockRvol` once the opening block is complete;
- `pvCurrentToPeakSlotRvol`.

These use only bars observed so far.

## Post-observation-window descriptors
After the current monitor's final completed 13:00-start bar:
- concentration of observed-session volume shares across the 17 available completed slots;
- optional Herfindahl / entropy of volume share;
- fraction of observed volume in opening block.

These are descriptive for the **observed monitor window**, not the full exchange day because 13:15–13:30/closing auction is outside zero-extra-call v0.1.

## Positive interpretation
Persistent elevated participation across many slots may be more robust than one isolated burst.

## Adverse interpretation
- persistent activity can be persistent speculation/crowding;
- front-loaded volume can represent legitimate overnight information incorporation;
- a single spike can be an institutional/block-like event or noise;
- shape metrics may duplicate pvPersistenceState and cumulative pace.

## Decision
Do not add HHI/entropy to v0.1.
First test whether simpler:
- abnormalSlotCount;
- barsSincePeak;
- cumulative pace;
already explain the outcomes.

Status: SHAPE_IDEA_VALID / COMPLEX_CONCENTRATION_METRICS_DEFERRED.


# PV-075 — First-15m Opening Auction Mixture vs Continuous Trading

## Market / provider fact
TWSE mainboard opens through a call auction at 09:00, then continuous trading begins.
Fugle v1 minute candles timestamp 09:00:00–09:00:59 activity at 09:00.

Sources:
- https://www.twse.com.tw/en/products/system/trading.html
- https://developer.fugle.tw/docs/data/migration-guide/

Therefore the first default 15m bar inevitably mixes:
- opening auction print / overnight price discovery;
- early continuous trading.

## Same-slot normalization benefit
Comparing today's first 15m bar with historical first 15m bars is still valid for abnormal-participation detection because the mixture is structurally repeated.

## But interpretation remains ambiguous
A huge first-15m bar can come from:
- opening call auction imbalance;
- immediate continuous follow-through;
- both.

These mechanisms may have different implications.

## Optional decomposition
A research-only 1m decomposition could compare:
- 09:00 candle / first-15m total;
- 09:01–09:14 continuous volume / first-15m total;
- continuous price drift after opening print.

## Cost/benefit
This would require:
- historical 1m baseline/cache;
- extra live or historical data handling;
- more session-boundary tests.

It violates the “zero additional live candle calls” simplicity if implemented naively.

## Decision
Do not include opening-auction decomposition in v0.1.
Revisit only if the primary experiment finds first-slot pvSlotRvol20 behaves materially differently from later slots.

Status: CONDITIONAL_SECOND_STAGE / FIRST_SLOT_STRATIFY_FIRST.


# PV-076 — Can Day-Trading Share Explain High-RVOL False Confirmations?

## Hypothesis
Some extreme volume may be short-horizon churn rather than durable participation.
A high day-trading share could therefore interact with:
- high RVOL;
- high MAE;
- failed breakout acceptance;
- fast volume decay.

## Counter-hypothesis
Day trading can improve liquidity and accelerate price discovery. High day-trade share need not worsen continuation.

Taiwan evidence supports both the importance of day-trading activity and its volatility channel; it does not justify a universal adverse sign.

Sources:
- https://doi.org/10.1016/j.heliyon.2023.e14939
- https://doi.org/10.1016/j.gfj.2003.10.003

## Timing problem
The current Formal after-market scan runs at 18:10.
Official per-security day-trading statistics may not be final or even available by that exact decision time:
- TWSE data products describe generation later in the evening for some products;
- TPEx explicitly notes T/T+1 revisions and T+2 finality.

Therefore same-day final day-trading share cannot be silently used as if known at 18:10.

## Research use
First use day-trading share as:
- explanatory / outcome-analysis context;
- with exact retrieval timestamp and finality.

Do not use it in same-day Formal selection or rank.

If later a reliable as-of-18:10 source is proven, that is a new data-semantics project.

Status: EXPLANATORY_ONLY_FOR_NOW / TIMING_BLOCKS_FORMAL_USE.


# PV-077 — Tier-2 Pruning before Shadow v0.1 Implementation

## Principle
Deep research should reduce the feature set, not endlessly expand it.

## Keep for v0.1
Only Tier-1 already frozen:
- pvDailyRvol20;
- pvSlotRvol20;
- pvCumvolPace20;
- pvResponseState;
- pvAcceptanceState;
- pvPersistenceState;
- pvGuardState/flags;
- coverage/provenance;
- current existing volume fields.

## Strong Tier-2 candidates after v0.1 data quality
### KEEP CANDIDATE — daily transaction decomposition
Reason:
- official daily data already fetched;
- low marginal API cost;
- distinct mechanism: count vs avg trade size.

### KEEP CANDIDATE — daily market/sector residual RVOL
Reason:
- daily full-market history already exists;
- helps separate common activity from stock-specific activity.

### KEEP CANDIDATE — event freshness
Reason:
- low storage/computation cost;
- directly addresses stale-shock problem.

### CONDITIONAL — issued-share turnover
Reason:
- conceptually useful;
- needs timestamped share denominator / corporate-action alignment.

### CONDITIONAL — divergence fields
Reason:
- useful only after Pattern Maturity pivot semantics are fully stable;
- high hindsight/redundancy risk.

### CONDITIONAL — attention/disposition flags
Reason:
- useful clean-vs-guarded subgroup;
- data availability for historical/as-of snapshots must be verified.

## Defer
- opening 1m auction decomposition;
- intraday historical trade count;
- volume-at-price history;
- limit queue history;
- day-trading-share as same-day selection input;
- complex HHI/entropy intraday-shape features;
- full-market 15m residual RVOL.

## Reject as independent scores
- OBV;
- CMF/A-D;
- MFI;
- Volume Oscillator;
- pattern-specific duplicate volume bonuses;
- “buy/sell volume” inferred solely from candle direction.

## Current judgment
PV v0.1 is already sufficiently rich.
The correct next move after state/spec QA is **collect prospective Shadow evidence**, not add more indicators.

Status: FEATURE_PRUNING_COMPLETE / V0_1_SCOPE_STABLE.
# PV-078 — Cross-File Consistency Audit and Supersession Discipline

## Purpose
Deep research creates a new failure mode: an early assumption can remain in an older section even after later work disproves or qualifies it. A future chat or engineer may then implement the stale statement.

PV research therefore needs an explicit supersession discipline.

## Audit findings fixed in this pass

### A. PV-061 18-slot / 108-row assumption
Earlier PV-061 treated the full 270-minute regular session as 18 observable 15m bars under the current zero-extra-call live path.

PV-068 audited the actual Worker cron and provider timestamp semantics:
- Formal monitor stops at 13:24;
- a 15m bar is accepted only after barStart + 15m;
- zero-extra-call v0.1 can therefore observe completed starts 09:00 through 13:00 only;
- 17 bars/symbol, maximum 102 feature rows/day for 6 stocks.

The old 108 statement is now explicitly marked SUPERSEDED wherever found.

### B. PV-029 trade-count feasibility
PV-029 originally concluded historical trade-count research was prospective-only because Fugle historical candles do not expose transaction count.

PV-070 qualified this:
- historical intraday trade count remains unavailable from candle history;
- official TWSE/TPEx daily closing data do expose daily transaction count;
- Worker already fetches those daily sources.

The old broad “prospective-only” statement is now explicitly qualified.

## Supersession rule
When a later PV section changes an earlier factual/engineering assumption:
1. do not delete the historical reasoning;
2. mark the earlier statement SUPERSEDED / QUALIFIED;
3. identify the later PV section;
4. update CHECKPOINT, DEEP_LEARNING_CHECKPOINT and SHADOW_SPEC;
5. implementation must follow the latest non-superseded definition.

## Canonical precedence
For implementation:
1. PRICE_VOLUME_SHADOW_IMPLEMENTATION_PLAN.md
2. PRICE_VOLUME_SHADOW_SPEC.md
3. latest PRICE_VOLUME_CHECKPOINT.md continuation / corrections
4. PRICE_VOLUME_RESEARCH.md full evidence history

Research.md preserves the intellectual trail; the implementation files carry current executable semantics.

Status: CONSISTENCY_AUDIT_COMPLETE_FOR_V0_1.


# PV-079 — Exact Worker / D1 Implementation Delta Map for a Class-A Shadow Patch

## Goal
Identify exactly where a research-only patch would attach without modifying the Formal decision path.

No code is changed by this section.

## Current Formal flow audited
Relevant current functions:
- `ensureD1Schema(env)`
- `normalizeMarketRow(row, market)`
- `buildMarketFeatures(stock)`
- `runAfterMarketScanCore(...)`
- `runBackgroundMonitor(...)`
- `analyzeStockSmart(...)`
- `analyzeFrame(...)`
- `buildBar(...)`
- `evaluatePullback(...)`
- `evaluateMomentum(...)`
- `buildFinalDecision(...)`

Formal intraday decisions are produced before signal-state/push processing.

## Hard isolation rule
Do NOT modify:
- evaluatePullback;
- evaluateMomentum;
- evaluateStop;
- buildFinalDecision;
- compareResults;
- evaluateOperationSignals;
- selection/ranking eligibility functions.

PV Shadow attaches **after** the Formal result exists.

## Delta A — D1 schema only
In `ensureD1Schema`, add research tables:
- `v7_pv_shadow_snapshots`
- `v7_pv_outcomes`
- `v7_pv_intraday_baselines`
- optional `v7_pv_meta` for schema/QA state.

All tables are additive. Existing tables and keys are untouched.

## Delta B — pure helper functions
Add new side-effect-free helpers:
- `medianFinite(values)`
- `pvSafeRatio(num, den)`
- `pvSlotKey(timestamp)`
- `classifyPvSessionPhase(timestamp)`
- `evaluatePvGuards(...)`
- `classifyPvResponse(...)`
- `advancePvAcceptance(...)`
- `advancePvPersistence(...)`
- `buildPvSnapshot(...)`
- `pvSnapshotKey(...)`

These helpers must not call Formal evaluators with altered inputs.

## Delta C — intraday baseline cache
Add isolated D1 functions:
- `readPvIntradayBaseline(env, symbol)`
- `writePvIntradayBaseline(env, baseline)`
- `bootstrapPvIntradayBaseline(env, symbol, asOfDate)`
- `rollPvIntradayBaseline(env, completedBars)`

Bootstrap source:
historical Fugle 15m candles, once per newly monitored symbol lacking >=20 valid prior sessions.

## Delta D — bootstrap timing
Preferred v0.1:
after the Formal after-market plan has been successfully saved at 18:10, perform a best-effort PV baseline bootstrap for newly monitored symbols.

Critical isolation:
```text
saveFormalPlan();
try { await bootstrapMissingPvBaselines(); }
catch (err) { log PV research error; DO NOT fail/rollback Formal plan; }
```

Do not make the next morning's Formal BUY path wait for a baseline.

## Delta E — intraday snapshot hook
In `runBackgroundMonitor`:
1. compute `results` exactly as today;
2. preserve an immutable Formal result fingerprint for tests;
3. only when `need15 || forceFrames`, call best-effort `recordPv15mSnapshots(results,...)`;
4. catch all PV storage/calculation errors;
5. continue existing notification/signal state unchanged.

Even if `frame15` is reused, snapshot key by bar timestamp prevents duplicate writes.

Stricter implementation can require the bar-end key not already stored before doing the D1 insert.

## Delta F — daily PV snapshot
Daily `pvDailyRvol20` can be computed from the existing history associated with `buildMarketFeatures`.

Preferred isolation:
do NOT add PV fields to the Formal feature object used by selectors in v0.1.

Instead, after Formal selection has completed, build a research snapshot from:
- the selected/monitored symbol;
- its existing history cache;
- frozen Formal plan/context.

This reduces accidental use by ranking code.

## Delta G — outcome finalizer
Add separate best-effort functions:
- `finalizePvIntradayOutcomes(...)`
- `finalizePvDailyOutcomes(...)`

They read immutable snapshots and write only `v7_pv_outcomes`.

They never write stock configuration, signal state or live Formal snapshot.

## Delta H — research endpoint
Optional admin-only:
- `GET /api/research/pv/status`
- `GET /api/research/pv/summary`

No public homepage card and no push in v0.1.

## Tier-2 future delta, NOT v0.1
Only later:
- `normalizeMarketRow` may parse daily transaction count;
- daily market/sector residual RVOL;
- issued-share turnover;
- attention/disposition flags.

Keeping Tier-2 out of the first patch minimizes blast radius.

Status: IMPLEMENTATION_DELTA_MAP_FROZEN / NO_CODE_APPLIED.


# PV-080 — PV_SHADOW_V0_1 Field Dictionary and Null / UNKNOWN Semantics

## Identity fields
- `snapshotId: string` — deterministic immutable key.
- `schemaVersion: "PV_SHADOW_V0_1"`.
- `symbol: string`.
- `marketDate: YYYY-MM-DD`.
- `observedAt: ISO timestamp`.
- `observationType: "AFTER_MARKET" | "INTRADAY_15M"`.
- `barStart: ISO|null`.
- `barEnd: ISO|null`.
- `eventKey: string|null`.
- `decisionImpact: false`.

## Frozen Formal context
- `channel: "A" | "B" | "BOTH" | "UNKNOWN"`.
- `planDate: string|null`.
- `buyLow/buyHigh/breakout/maxChase/stop/profitCheck: number|null`.
- `formalDecisionLevel: string|null`.
- `formalDecisionText: string|null`.
- `formalLocalVolumeRatio: number|null`.

These values are copied for research; never recomputed later from an updated plan.

## Core v0.1 numeric PV fields
- `pvDailyRvol20: number|null`.
- `pvSlotRvol20: number|null`.
- `pvCumvolPace20: number|null`.
- `pvSlotRangeExpansion20: number|null`.
- `pvSignedProgress20: number|null`.
- `pvBodyShare: number|null`.
- `pvPeakRvol: number|null`.
- `pvCurrentToPeakRvolRatio: number|null`.

## State fields
- `pvResponseState` enum:
  - EFFICIENT_UP
  - EFFICIENT_DOWN
  - HIGH_EFFORT_LOW_PROGRESS
  - LOW_EFFORT_LOW_PROGRESS
  - NORMAL_RESPONSE
  - GUARDED_RESPONSE
  - UNKNOWN
- `pvAcceptanceState`: channel-specific A_* / B_* enum + UNKNOWN.
- `pvPersistenceState`:
  NORMAL / FRESH_SHOCK / PERSISTENT / DECAYING / REIGNITED / NORMALIZED / UNKNOWN.
- `pvGuardState`: precedence enum from PV-066.
- `pvGuardFlags: string[]`.
- `pvInterpretability: "VALID" | "GUARDED" | "INVALID"`.
- `pvSessionPhase: "OPEN_AUCTION_MIXED" | "CONTINUOUS" | "CLOSE_AUCTION_MIXED" | "UNKNOWN"`.

## Coverage / provenance
- `slotHistoryCount: integer`.
- `dailyHistoryCount: integer`.
- `baselineAsOfDate: string|null`.
- `baselineSource: string|null`.
- `sourceBarTimestamp: string|null`.
- `sourceFetchedAt: string|null`.
- `coverageReasons: string[]`.
- `corporateActionResetAt: string|null`.

## Null vs UNKNOWN
### Numeric fields
Unavailable numeric data = `null`.
Never substitute:
- 0;
- 1.0;
- prior value;
- market median
unless the field definition explicitly calls for that value.

Reason for null appears in guard/coverage fields.

### State fields
If the state cannot be classified because required data are missing/incompatible => explicit `UNKNOWN`.

Do not use null for a state enum except an optional not-applicable auxiliary field.

## Precision
Store calculations at sufficient machine precision.
Display rounding is a presentation concern.
Do not round a stored 1.2996 to 1.30 and then classify it as >=1.3.

Classification uses unrounded values.

## Schema evolution
Any change to:
- threshold;
- state transition;
- slot definition;
- baseline-window semantics;
- source-unit semantics;
- guard precedence
requires a new schemaVersion (e.g. `PV_SHADOW_V0_2`).

Old rows are never rewritten into the new semantic version.

Additive non-semantic audit fields may be added without reclassifying old rows, but the change must be documented.

Status: FIELD_DICTIONARY_FROZEN.


# PV-081 — Rollout Acceptance Tests, Kill Switch and Rollback Criteria

## Feature flag
A research-only implementation must have:
`PV_SHADOW_ENABLED=false` by default at first deployment.

Enable only after unit/integration tests pass in the repository environment.

Disabling the flag must:
- stop PV computation/writes/bootstrap;
- leave Formal monitoring fully operational;
- not require deleting research tables.

## Pre-deploy acceptance
Mandatory:
1. all PV-067 tests pass;
2. existing Formal test suite passes unchanged;
3. Formal-isolation fixture produces identical Formal outputs Shadow OFF vs ON;
4. schema creation is idempotent;
5. no existing D1 table migration is destructive.

## LOG_ONLY acceptance
First active phase:
- zero PV-based user push;
- zero PV fields consumed by Formal selection;
- zero additional ordinary-session live candle calls;
- baseline bootstrap failures isolated from Formal;
- duplicate snapshot rate = 0;
- source/unit guard failures become UNKNOWN, never guessed values.

## Operational telemetry
Track:
- PV snapshot writes/run;
- duplicate conflicts/run;
- D1 write failures;
- baseline bootstrap calls/errors;
- PV compute duration;
- total Formal Fugle calls with Shadow OFF/ON;
- monitor cron success/failure;
- guard/UNKNOWN rate.

## Immediate rollback / kill-switch triggers
Disable PV_SHADOW_ENABLED immediately if any:
- selected symbols/ranks/plans differ because Shadow is enabled;
- BUY/ADD/REDUCE/push payload changes;
- Formal cron begins failing/timing out due PV work;
- ordinary intraday Fugle call count rises unexpectedly;
- a PV exception propagates into the Formal job;
- duplicate snapshots are produced;
- completed historical snapshot mutates;
- daily shares and intraday lots are mixed in a ratio;
- future/session-end data enter an earlier feature snapshot.

## Data-quality pause, not full rollback
Pause interpretation while keeping safe logging if:
- >20% of expected primary observations are UNKNOWN for baseline reasons after bootstrap period;
- guard rate unexpectedly shifts because provider semantics changed;
- first-slot/closing-slot timestamp fixture fails;
- baseline reset behavior is uncertain around a new corporate action type.

Threshold 20% here is an operational QA alarm, not an alpha threshold.

## Rollback mechanics
1. set PV_SHADOW_ENABLED=false;
2. do not delete D1 research data;
3. preserve error/audit rows;
4. confirm Formal outputs and call counts return to baseline;
5. fix under a new code commit;
6. if semantic meaning changes, increment schemaVersion before re-enable.

Status: ROLLOUT_AND_ROLLBACK_CONTRACT_FROZEN.


# PV-082 — Research Readiness Decision for Class-A Shadow Implementation

## Question
Has the research matured enough to implement a **research-only** recorder without influencing Formal decisions?

## Evidence supporting readiness
- a narrow primary question is pre-registered;
- minimal feature set is frozen;
- robust same-slot/daily normalization semantics are frozen;
- A/B state transitions reuse current Formal geometry instead of inventing outcome-tuned thresholds;
- risk and direction outcomes are separated;
- no-look-ahead and episode de-duplication rules are defined;
- current cron/API budget has been audited and corrected;
- provider/unit/session/corporate-action guards are explicit;
- implementation delta map isolates research after Formal results;
- field dictionary/schema version is frozen;
- idempotency, Formal isolation, kill-switch and rollback tests are defined;
- Tier-2 feature creep has been explicitly pruned.

## Evidence against any Formal promotion
There is still **no prospective outcome sample** for the new same-slot RVOL / cumulative-pace states in this system.

Therefore we do not yet know whether they:
- improve false-confirmation detection;
- reduce MAE;
- improve MFE;
- add value beyond current local volumeRatio;
- remain stable across regimes/session phases.

## Decision
Research is sufficient to **propose a Class-A, LOG_ONLY, decisionImpact=false implementation of PV_SHADOW_V0_1**.

Research is NOT sufficient to:
- alter A/B eligibility;
- alter ranking;
- change BUY/ADD/REDUCE;
- change maxChase/stop/capital;
- add a PV veto;
- change push behavior.

## Owner-control boundary
No Worker.js implementation is made in this research step.
The implementation should begin only after the owner explicitly chooses to move from research specification to Class-A Shadow logging.

Status: READY_TO_PROPOSE_CLASS_A_SHADOW / NOT_READY_FOR_FORMAL_OPTIMIZATION.
# PV-083 — Statistical Evaluation Unit and Dependence Handling

## Problem
PV Shadow will generate many snapshots, but snapshots are not independent observations:
- multiple 15m bars can belong to one abnormal-volume episode;
- the same symbol can contribute repeated events;
- many symbols on one market date share the same macro/market shock;
- sector names can move together.

Treating raw snapshot count as independent N would overstate evidence.

## Primary analysis units

### Event-level
Primary for shock/confirmation questions:
- one `eventKey` = one abnormal-participation episode;
- first eligible anchor snapshot represents the event for initial-shock comparisons;
- later snapshots describe persistence/retest/reacceleration but do not increase independent event count one-for-one.

### Snapshot-level
Allowed for state-transition analysis only.
Inference must account for nesting within event/symbol/date.

## Dependence controls
Preferred order:
1. same-date matched descriptive comparisons;
2. event-level aggregation;
3. date-block bootstrap / resampling;
4. where sample size supports it, cluster by market date and account for repeated symbol/event observations.

Avoid ordinary iid standard errors on raw 15m rows.

## Date contamination
Train/validation or exploratory/confirmation splits must be by date blocks, not random rows.
A single market day must never appear in both sides through different stocks.

## Event concentration report
Every result must show:
- raw snapshot count;
- unique event count;
- unique symbol count;
- unique market-date count;
- largest date share of events;
- largest sector share of events.

A large raw N with few dates remains weak evidence.

## Research basis
White's Reality Check formalizes data-snooping risk when the same data are repeatedly used for model selection/inference.
Harvey, Liu & Zhu show that factor discovery requires much stronger multiple-testing discipline than conventional single-test significance.

Sources:
- https://doi.org/10.1111/1468-0262.00152
- https://www.nber.org/papers/w20592
- https://doi.org/10.1093/rfs/hhv059

Status: DEPENDENCE_GOVERNANCE_FROZEN.


# PV-084 — Effect Size, Stability and Calibration before Significance

## Principle
A tiny but statistically significant PV effect may be economically useless.
A large effect with huge uncertainty may be interesting but not ready.

Report both.

## Primary descriptive effect sizes

For binary structural failure:
- absolute percentage-point difference;
- relative risk ratio;
- event counts in numerator/denominator.

For continuous outcomes:
- median MFE difference;
- median MAE difference;
- median return difference;
- quantile differences, especially adverse tail MAE.

Do not rely only on means because event outcomes are heavy-tailed.

## Nested model A->E reporting
The first prospective experiment compares:
A context
B + local previous-5 volumeRatio
C + pvSlotRvol20
D + pvCumvolPace20
E + response/acceptance/guard states.

For each increment report:
- incremental false-confirmation discrimination;
- incremental MFE/MAE separation;
- coverage loss;
- calibration if a probability model is actually fit;
- regime/session stability.

## Probability-model metrics — only if model fitting is introduced
Use:
- Brier score;
- calibration curve / calibration slope;
- log loss;
- ROC-AUC only as a secondary ranking metric.

AUC alone can improve while probability calibration remains poor.

## Stability table
At each predeclared milestone show:
- full sample;
- BULL/MIXED/BEAR;
- open/mid/late observed session;
- A vs B channel;
- liquid vs less-liquid eligible tiers.

Do not call a feature stable if the sign changes materially in well-covered subgroups.

## Minimum economic interpretation
No fixed universal “must improve X%” is imposed before data exist.
Instead classify:
- NO_MATERIAL_SEPARATION;
- PROMISING_BUT_UNCERTAIN;
- STABLE_INCREMENTAL_SEPARATION.

Thresholds for actual trading utility belong to PV-086 / owner decision, not post-hoc statistical tuning.

Status: EFFECT_SIZE_FIRST / P_VALUE_NOT_ENOUGH.


# PV-085 — Multiple-Testing and Model-Comparison Governance

## Why this matters
The PV lane has deliberately studied many hypotheses. Even if only a few are implemented, repeatedly testing thresholds/variants on the same outcomes can manufacture a winner.

White (2000) addresses data snooping.
Harvey, Liu & Zhu (2016) show conventional t-statistic hurdles are inadequate after large-scale factor searches.
Bailey & Lopez de Prado's Deflated Sharpe Ratio similarly adjusts performance interpretation for selection bias / multiple trials and non-normality.

Sources:
- https://doi.org/10.1111/1468-0262.00152
- https://doi.org/10.1093/rfs/hhv059
- https://papers.ssrn.com/abstract=2460551

## Freeze the primary family
V0.1 primary model comparisons are only:
- A -> B
- B -> C
- C -> D
- D -> E

Primary outcome family:
- structural false/no-follow-through defined in PV-058;
- MFE/MAE are co-primary descriptive risk outcomes, not alternative ways to fish for a winner.

All other Tier-2 features are secondary/exploratory until separately preregistered.

## No threshold tournament
Do not test:
1.2 / 1.25 / 1.3 / 1.35 / 1.4...
and then report only the best.

V0.1 thresholds are frozen from existing system/research semantics.

If later data suggest a threshold is poor:
- document the finding;
- define PV_SHADOW_V0_2 before testing the new threshold prospectively.

## Multiple-comparison reporting
If formal inferential p-values are reported:
- identify the family of tests;
- use a multiple-testing-aware adjustment or bootstrap procedure;
- report unadjusted and adjusted results transparently.

But promotion does not depend on p-value alone.

## Research ledger
Maintain a durable tested-hypothesis ledger:
- hypothesis ID;
- schema version;
- first test date;
- outcomes examined;
- result;
- promoted/rejected/archived.

Failed tests stay visible.

Status: TESTING_FAMILY_FROZEN / WINNER_PICKING_PROHIBITED.


# PV-086 — Practical Utility: Avoid False Confirmations without Killing Good Setups

## Core problem
A PV modifier can reduce bad entries simply by blocking nearly everything.
That is not useful.

Therefore any future modifier must measure both:
- adverse events avoided;
- valid opportunities lost.

## Define retrospective research labels
For evaluation only:
- `VALID_FOLLOW_THROUGH`: structure holds and predefined positive-progress criteria occur within the frozen horizon;
- `ADVERSE_CONFIRMATION`: false re-entry / zone loss / high adverse excursion under frozen labels;
- `AMBIGUOUS_OUTCOME`: neither clearly resolves within horizon.

These are outcome labels, not live states.

## Candidate filter evaluation
If a future PV state were hypothetically used as a warning/filter, report:
- adverse confirmations flagged / total adverse confirmations;
- valid follow-throughs also flagged / total valid follow-throughs;
- precision of the warning;
- coverage / abstention rate;
- opportunity-retention rate;
- median MFE lost by filtered valid cases;
- median MAE avoided in filtered adverse cases.

## Pareto view
Do not collapse this immediately into one score.

Show the trade-off:
- more risk avoided;
- more valid opportunities sacrificed.

The owner can later decide whether that trade-off fits the strategy's purpose.

## Capital-utilization interaction
Because the current system already suffers from sparse BUY signals / idle capital, a future PV rule that reduces bad entries by suppressing many valid entries may worsen the larger system objective.

Therefore promotion analysis must also report:
- BUY frequency impact;
- zero-pick / idle-capital impact;
- average days capital remains unused;
- whether filtered cases later become RE-ADD / valid opportunities.

## Important distinction
A useful **risk observer** may never deserve to become an **entry veto**.
It can remain diagnostic or require extra confirmation instead.

Status: UTILITY_FRAMEWORK_FROZEN / NO_SINGLE_SCORE_YET.


# PV-087 — Observer -> Modifier Promotion Gates

## Current state
Every PV feature/state is Level-0 OBSERVER.

## Earliest possible promotion target
The first thing that could ever be considered for Modifier status is not a generic “volume score.”

It is the narrow intraday hypothesis:
**same-slot RVOL / cumulative pace provides incremental confirmation-risk information beyond the current local previous-5 volumeRatio.**

## Minimum evidence gates before a Modifier proposal can even be drafted

### Gate 1 — Data integrity
Pass all PV-067 / PV-081 tests.
No unresolved:
- look-ahead;
- unit mismatch;
- baseline contamination;
- snapshot mutation;
- Formal-isolation failure.

### Gate 2 — Coverage
Pass PV-024 prospective evidence stage.
No promotion from the first ~50 DATA_QA events.
At least reach a predeclared evidence milestone with enough unique dates/events to avoid one-date dominance.

The 100/250/500 milestones are review points, not automatic pass thresholds.

### Gate 3 — Incremental value
C/D/E must add information after:
- existing Formal context;
- current local volumeRatio;
- pattern/trend/RS/sector/institution/overheat context where applicable.

Standalone correlation is insufficient.

### Gate 4 — Stability
Direction/effect must not be driven by:
- one regime;
- one sector;
- one time-of-day phase;
- one short date cluster.

If sign genuinely differs by regime, the future Modifier must be regime-conditional rather than universal.

### Gate 5 — Utility
Risk reduction must be weighed against valid-opportunity suppression and capital utilization.

A rule that “improves win rate” by nearly eliminating BUYs fails.

### Gate 6 — Simplicity
Prefer the smallest rule that captures the stable effect.
If pvSlotRvol20 alone explains it, do not add five interacting fields.

### Gate 7 — Fresh confirmation sample
After any candidate rule is designed from accumulated Shadow data:
- freeze it;
- test on a later untouched date block;
- do not use the design sample as the final proof.

## Failure-to-promote conditions
Keep as Observer or archive if:
- no incremental value;
- unstable sign;
- benefit disappears out of sample;
- coverage/latency/data cost is poor;
- duplicate with existing Formal feature;
- utility trade-off is unfavorable;
- requires many tuned thresholds/interactions.

## Veto remains separate
Even a successful Modifier does not automatically become a VETO.
Veto-level predictive authority would require a separate owner-approved Class C proposal and substantially stronger evidence.

Status: PROMOTION_GOVERNANCE_FROZEN / ALL_PV_REMAINS_OBSERVER.
# PV-088 — Deterministic Synthetic Fixtures before Implementation

## Principle
Before writing Shadow code, define inputs with expected outputs.
The implementation must satisfy these fixtures without consulting real future returns.

## Response fixtures

### R1 — EFFICIENT_UP
Given:
- pvSlotRvol20 = 1.8;
- slotRangeMedian20 = 10;
- open=100, high=111, low=99, close=109;
- no guards.

Expected:
- bullish;
- closePosition = 10/12 ~=0.833;
- bodyShare = 9/12 =0.75;
- signedProgress20 = +0.9;
- participation=ELEVATED;
- pvResponseState=EFFICIENT_UP.

### R2 — HIGH_EFFORT_LOW_PROGRESS
Given:
- pvSlotRvol20 = 3.0;
- slotRangeMedian20 = 10;
- open=100, high=106, low=94, close=101;
- no guards.

Expected:
- EXTREME participation;
- bodyShare ~=0.083;
- signedProgress20=+0.1;
- pvResponseState=HIGH_EFFORT_LOW_PROGRESS;
- no bullish/bearish conclusion.

### R3 — LOW_EFFORT_LOW_PROGRESS
Given:
- pvSlotRvol20=0.6;
- slotRangeMedian20=10;
- open=100, high=102, low=99, close=100.5.

Expected:
- LOW participation;
- abs signedProgress20=0.05;
- rangeExpansion<1;
- LOW_EFFORT_LOW_PROGRESS.

### R4 — GUARDED price-censored
Reuse R1 mechanical price/volume values plus PRICE_CENSORED.

Expected:
- diagnosticSubstate=EFFICIENT_UP allowed;
- primary pvResponseState=GUARDED_RESPONSE;
- pvInterpretability=GUARDED;
- never included in clean EFFICIENT_UP cohort.

## Acceptance fixtures

### B1 lifecycle
Frozen breakout=100, retestLow=99.5, retestHigh=101.

Sequence:
1. bar high=100.2 close=99.9 => B_BREAKOUT_ATTEMPT.
2. completed Formal-confirmed breakout bar => B_INITIAL_ACCEPTANCE.
3. later bar low=100.2 high=102 close=100.4 => B_RETEST.
4. later bullish bar closes above retest-bar close and remains >=99.7 => B_REACCELERATION.

All earlier enteredAt timestamps stay unchanged.

### B2 failed re-entry
After initial acceptance:
completed close=99.4 with breakout=100.

Expected:
B_FAILED_REENTRY because close<99.5.

### A1 lifecycle
Frozen buyLow=95, buyHigh=98.
1. bar overlaps zone and closes 96.5 => A_PULLBACK_TEST.
2. same/next valid setup with local volume<=0.9 and reversal/strong close => A_INITIAL_ACCEPTANCE.
3. next bar higher-low + bullish + higher close/high => A_REACCELERATION.

### A2 failure
completed close=94.9 => A_FAILED_REENTRY.

## Persistence fixtures

### P1 reignition
Comparable normalized participation:
1.4, 1.6, 1.2, 1.5

Expected:
FRESH_SHOCK -> PERSISTENT -> DECAYING -> REIGNITED
same eventKey.

### P2 normalization
1.4, 1.5, 1.2, 1.1

Expected:
FRESH -> PERSISTENT -> DECAYING -> NORMALIZED.

### P3 missing pause
1.4, MISSING, 1.2, 1.1

Expected:
missing does not count below threshold;
state pauses; normalization only after two actual comparable sub-1.3 observations.

## Guard fixtures

### G1 missing history
slotHistoryCount=19.

Expected:
DATA_INSUFFICIENT / INVALID / numeric slot RVOL=null.

### G2 multiple flags
verified ex-dividend reference + upper-limit proximity + first-slot auction.

Expected:
primary guard PRICE_CENSORED;
flags include PRICE_CENSORED + AUCTION_MIXED + GAP_DOMINATED if applicable;
interpretability=GUARDED.

### G3 unresolved reference
same as G2 but adjusted reference unavailable.

Expected:
REFERENCE_PRICE_UNRESOLVED outranks contextual flags;
interpretability=INVALID.

## Unit fixture
Daily volume=1,000,000 shares and intraday bar volume=1,000 lots may numerically represent the same share quantity but are from different source/timeframe semantics.

Expected:
no raw cross-family ratio is computed solely because 1,000 lots*1,000 = 1,000,000 shares.

Status: SYNTHETIC_ORACLE_DEFINED.


# PV-089 — Exact Baseline Bootstrap and Slot-Key Semantics

## Timezone
All slot keys are Taiwan local exchange time, Asia/Taipei.

Provider timestamps are parsed as offset-aware timestamps and converted/validated before slot assignment.

## V0.1 observed slot universe
Because current Formal cron stops at 13:24 and Shadow adds no live candle calls:
expected observable completed 15m starts are:
09:00, 09:15, 09:30, ..., 12:45, 13:00.

17 slot keys.

Historical provider may expose later bars; v0.1 baseline should not use a slot that the live experiment cannot observe.

## Slot key
`slotKey = HH:MM of provider bar start in Taiwan time`.

Do not use array position alone.
Missing bars must not shift later slot identity.

## Prior-only baseline
For a snapshot on market date T:
- baseline sessions must be strictly < T;
- current T bars never enter the denominator;
- baselineAsOfDate records the most recent prior session used.

## Validity for slot RVOL
A prior session contributes to one slot if:
- the exact slot exists;
- OHLCV passes source validation;
- bar belongs to supported market structure;
- no incompatible corporate-action/reset state applies.

A session missing a different slot may still contribute to this slot's standalone median.

## Validity for cumulative pace
A prior session contributes cumulative volume through slot S only if:
- all required observable slot bars from 09:00 through S are present/valid under the provider's actual candle emission semantics;
OR a separately verified cumulative-volume source proves the cumulative value.

Do not sum across silently missing bars.

## Explicit zero vs missing
- explicitly returned valid bar with volume=0 may be stored as zero if provider semantics allow it;
- absent bar is MISSING and is never fabricated as zero.

If zeros dominate the median and denominator<=0 => derived ratio UNKNOWN.

## Holiday/session handling
Use the project's official trading calendar.
Weekends/holidays are skipped; they are not zero-volume sessions.

## Corporate-action reset
After an incompatible reset event:
- pre-event sessions are not mixed into the post-event raw-volume baseline;
- require >=20 valid post-reset sessions for normal interpretation.

## Cache version
Baseline cache carries:
- schemaVersion;
- source/timeframe;
- slot definitions;
- baselineAsOfDate;
- valid session counts;
- corporateActionResetAt.

Any source/timeframe/slot semantic change invalidates/rebuilds cache under a new version.

Status: BOOTSTRAP_SEMANTICS_FROZEN.


# PV-090 — Research and Formal Fingerprints for Isolation / Mutation Detection

## Why fingerprints
Tests should not depend on visual JSON comparison.
A deterministic fingerprint can prove that:
- Formal output did not change when Shadow was enabled;
- historical PV snapshot did not mutate later.

## Canonical serialization
Before hashing:
- sort object keys recursively;
- preserve array order where semantically meaningful;
- exclude explicitly non-semantic runtime fields such as generatedAt/audit write timestamp;
- normalize null explicitly;
- never omit a field because its value is false/0.

Hash:
SHA-256 over canonical UTF-8 JSON.

## Formal fingerprint
Include only semantic Formal outputs:
- selected/planned symbol set and order;
- sourceRank/displayRank where decision-semantic;
- plan levels;
- position stage;
- finalDecision level/text;
- Formal A/B evaluation states;
- operation-signal types/amount/shares;
- capital allocation.

Do not include PV fields.

Test:
same fixture, Shadow OFF vs ON => identical Formal fingerprint.

## PV snapshot fingerprint
Include:
- snapshot identity;
- frozen Formal context copy;
- all v0.1 feature/state/guard fields;
- source bar identifiers;
- baseline version/asOf.

Exclude:
- created_at;
- last audit access time.

On insert conflict:
- same snapshotId + same fingerprint => idempotent duplicate attempt, ignore;
- same snapshotId + different fingerprint => MUTATION_CONFLICT alert; do not overwrite silently.

## Outcome fingerprint
Once outcome_complete=1:
canonical outcome semantic fields hash is frozen.

Later finalizer rerun:
- identical => idempotent;
- different => OUTCOME_MUTATION_CONFLICT.

Status: FINGERPRINT_CONTRACT_FROZEN.


# PV-091 — Durable Hypothesis / Test Ledger

## Purpose
Prevent failed ideas from disappearing and being rediscovered/tuned later as if new.

## Canonical file
Create and maintain:
`PRICE_VOLUME_HYPOTHESIS_LEDGER.md`.

Each hypothesis entry:
- hypothesisId;
- title;
- research origin PV section;
- schemaVersion;
- status: PLANNED / DATA_QA / TESTING / SUPPORTED / NOT_SUPPORTED / INCONCLUSIVE / ARCHIVED;
- firstFrozenAt;
- feature definitions;
- primary outcome;
- secondary outcomes;
- cohort;
- exclusions/guards;
- milestones reviewed;
- variants tried;
- result summary;
- decision;
- next untouched confirmation period if applicable.

## V0.1 initial hypotheses

### PV-H001
Same-slot 15m RVOL adds incremental information beyond local previous-5-bar volumeRatio for structural false/no-follow-through.

### PV-H002
Cumulative-volume pace adds information beyond same-slot RVOL by distinguishing one-bar spike from persistent day participation.

### PV-H003
Response/acceptance/guard states add information beyond numeric RVOL ratios.

### PV-H004
High abnormal participation has risk/information-intensity value even when directional return value is weak.

## Rule
A rejected/unsupported hypothesis remains in the ledger.
Reopening it with a changed threshold requires:
- a new hypothesis ID or version;
- explicit reason;
- new prospective confirmation data.

Status: TEST_LEDGER_SCHEMA_FROZEN.


# PV-092 — Final Pre-Implementation Readiness Audit

## Safe to implement as Class-A research-only
No owner judgment is needed on the mathematics of these already-frozen logging semantics:
- D1 additive research tables;
- feature flag default OFF;
- 20-valid-session robust baselines;
- slot keys / current-cron 17-bar scope;
- null/UNKNOWN semantics;
- pvResponseState v0.1;
- A/B acceptance observer states;
- persistence hysteresis;
- guard precedence;
- immutable snapshots/outcomes;
- fingerprints;
- idempotency;
- admin-only research summary;
- zero PV push/action effects.

## Requires explicit owner approval before code work
Moving from specification to actual Worker.js Class-A implementation is still a project-change decision.
The owner must authorize:
- adding D1 research tables;
- adding research storage/calls after plan save;
- enabling prospective data collection.

This is not because Formal strategy changes; it is because production Worker code/storage would change.

## Not safe / not justified to implement in Formal
No evidence yet supports:
- replacing local volumeRatio;
- requiring pvSlotRvol20 for BUY;
- PV-based ranking;
- PV-based maxChase/stop/capital changes;
- PV-based candidate rejection;
- PV-based ABF re-add.

## Remaining technical unknowns that do NOT block initial v0.1
Can remain guarded/deferred:
- exact 15m representation of 13:30 closing auction, because current zero-extra-call v0.1 stops earlier;
- explicit VI event source;
- day-trading data finality at 18:10;
- free-float denominator;
- historical intraday trade count;
- volume-at-price history.

## Blocking conditions if implementation is authorized
Before enabling logging:
- fixture tests must confirm provider 15m slot timestamp semantics for observed slots;
- D1 schema/tests must pass;
- Formal fingerprint OFF/ON must match;
- historical bootstrap must demonstrate no current-session leakage.

## Readiness judgment
Research phase for **PV_SHADOW_V0_1 specification** is mature.

The rational next step is not more indicator invention.
It is:
1. owner-authorized Class-A LOG_ONLY implementation;
2. DATA_QA;
3. prospective evidence collection;
4. only then decide whether any PV idea deserves a Formal proposal.

Status: V0_1_RESEARCH_SPEC_COMPLETE / AWAIT_OWNER_IMPLEMENTATION_APPROVAL / FORMAL_LOCKED.

# PV-098 — Dealer Proprietary vs Dealer Hedge Must Be Separated Conceptually

## Current official data
TWSE T86 and TPEx daily institutional data both publish dealer activity in separate components:
- dealers proprietary / 自行買賣;
- dealers hedge / 避險;
- combined dealers total.

TWSE fields explicitly include:
- 自營商買賣超股數(自行買賣)
- 自營商買賣超股數(避險)
- 自營商買賣超股數

TPEx exposes the same split.

Official sources:
- https://www.twse.com.tw/fund/T86?response=html
- https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?l=zh-tw&o=htm&se=E

## Current Worker semantics audited
Current Worker parses:
- TWSE: `dealerNet = 自營商買賣超股數`
- TPEx: combined dealer net field
and stores only:
- dealerNet
- dealerBuyDays

Therefore existing `dealerBuyDays` mixes:
1. directional proprietary inventory decisions;
2. derivative / ETF / structured-product hedging flows.

## Why this matters
A positive hedge flow can arise because a dealer needs to dynamically hedge:
- call warrants;
- put warrants;
- ETFs;
- ETNs;
- other equity derivatives.

That does not necessarily mean the dealer is expressing a bullish discretionary view on the stock.

## Constructive interpretation of combined dealer buying
- it still represents real cash-market demand;
- persistent hedging demand can create genuine price/volume pressure;
- hedge flow itself may contain information about derivative demand.

## Adverse interpretation
- it can be mechanically generated;
- sign can reverse when delta/exposure changes;
- expiration/unwind can reverse the cash-market impact;
- combining hedge and proprietary may overstate “institutional conviction.”

## Research decision
Do NOT change Formal dealerBuyDays yet.

Create a future research decomposition:
- `dealerProprietaryNet`
- `dealerHedgeNet`
- `dealerCombinedNet`
- streaks for each.

Because the same official payload already contains these fields, incremental API cost should be zero.

Status: HIGH_PRIORITY_TIER2_DECOMPOSITION / FORMAL_UNCHANGED.


# PV-099 — Covered-Warrant Hedging Can Mechanically Affect Underlying Volume and Volatility

## Taiwan evidence
Research using Taiwan covered warrants finds dealer/issuer hedging demand can affect underlying stocks:
- positive abnormal volume before warrant issuance;
- stronger effects when hedging demand is larger;
- persistent relation between hedge-demand elasticity and underlying volatility/volume during warrant life;
- negative price effect after in-the-money call-warrant expiry due to hedge liquidation.

Source:
- Chung, Liu & Tsai (2014), Journal of Banking & Finance
  https://doi.org/10.1016/j.jbankfin.2014.01.027

## Mechanism
For a call warrant:
- dealer short call exposure may require buying underlying stock as delta increases;
- if the underlying rises, delta can rise and force more buying;
- at expiry/unwind, hedge inventory may be sold.

For puts or other structures, direction can differ.

## Implication for price-volume interpretation
High underlying volume accompanied by large dealer hedge buying can be:
- genuine mechanical demand;
- not necessarily fundamental conviction;
- potentially self-reinforcing intraday;
- potentially reversible when hedge need disappears.

## Opposing case
Mechanical flow is still real flow.
It can:
- improve price discovery;
- persist for multiple days;
- interact with investor demand in a way that makes continuation genuine.

Therefore dealer hedge flow is a **volume-origin label**, not a discount factor.

## Candidate future research fields
- `pvDealerProprietaryNet`
- `pvDealerHedgeNet`
- `pvDealerHedgeShareOfDealerFlow`
- `pvDealerHedgeShareOfStockVolume`
- `pvDealerFlowDivergence = sign(proprietary) vs sign(hedge)`

Do not infer exact warrant delta demand without warrant-level outstanding/delta data.

Status: MECHANICAL_FLOW_CONTEXT / NO_DIRECTIONAL SCORE.


# PV-100 — ETF Creation/Redemption and Arbitrage Can Generate Constituent Flow without Stock-Specific Information

## Official Taiwan mechanism
TWSE and TPEx describe ETF creation/redemption as a primary-market process linking ETF units to baskets of constituent securities.

For in-kind creation:
- basket securities are delivered in exchange for ETF units.

For redemption:
- ETF units are exchanged for constituent baskets.

This mechanism supports arbitrage between ETF price and NAV.

Official sources:
- https://www.twse.com.tw/en/products/securities/etf/overview/issuing.html
- https://www.tpex.org.tw/en-us/product/etf/overview/introduction.html

## Why this matters for stock PV
Large ETF subscriptions/redemptions or arbitrage can create buy/sell demand in many constituents simultaneously.

A constituent can therefore show:
- elevated volume;
- closing pressure;
- sector/basket synchronization;
without a stock-specific information event.

## Constructive interpretation
ETF-linked flow can be persistent and economically meaningful.
If a broad theme receives durable ETF inflows, constituent demand may support continuation.

## Adverse interpretation
It may be:
- mechanical basket replication;
- arbitrage;
- temporary rebalancing;
- largely common-factor flow rather than stock-specific information.

## Important counter-evidence
Broader ETF research finds ETF shocks do not always lead underlying-stock returns; in some samples arbitrage opportunities arise from underlying moves and ETF quotes adjust afterward.

Source:
- Journal of Financial Economics (2021)
  https://doi.org/10.1016/j.jfineco.2021.04.023

Therefore “ETF flow causes the stock move” must not be assumed.

## Research semantics
Potential future context:
- `ETF_BASKET_FLOW_CONTEXT`
- `INDEX_REBALANCE_CONTEXT`
- market/sector residual RVOL used to distinguish common basket activity from stock-specific activity.

No direct alpha score.

Status: COMMON_FLOW_CONTEXT / CAUSAL_DIRECTION_AMBIGUOUS.


# PV-101 — Block Trades Can Inflate Daily RVOL but May Contain Either Information or Temporary Liquidity Pressure

## Official daily-volume scope
TWSE official daily stock statistics include:
- regular trading;
- odd-lot;
- after-hours fixed price;
- block trading;
and exclude auction/tender offers.

Therefore daily RVOL can be elevated by block-trade activity not visible in the default intraday regular-lot candle path.

Official source:
- https://www.twse.com.tw/en/exchangeReport/FMTQIK?response=html

## Taiwan evidence
Intraday Taiwan research on block orders finds:
- professional institutional block orders have significant price impact;
- foreign investors submit the largest and most aggressive block orders;
- block-order aggressiveness/size rises nearer the close;
- effects can contain both permanent information and temporary liquidity components.

Source:
- https://doi.org/10.1016/j.pacfin.2022.101828

## Interpretation
High daily RVOL + ordinary intraday participation:
- more likely broad trading participation.

High daily RVOL + modest regular-session intraday volume:
- may indicate block/after-hours/odd-lot contribution.

But this discrepancy is not automatically suspicious.

## Constructive case
Large block activity may carry genuine institutional information.

## Adverse case
It may be:
- ownership transfer;
- temporary liquidity demand;
- portfolio rebalance;
- negotiated execution with little relevance to next-day direction.

## Candidate research variable
If official block-volume data are reliably available per symbol:
- `pvBlockTradeShare`
- `pvRegularVsDailyVolumeGap`

Do not estimate block share merely as:
dailyVolume - intradayVolume
because daily and intraday scope differ in several ways simultaneously.

Status: DAILY_RVOL_ORIGIN_GUARD / DIRECT_RESIDUAL_ESTIMATE_PROHIBITED.


# PV-102 — Volume-Origin Decomposition Priority after PV-098~101

## What has changed
Price-volume research now distinguishes two different questions:

1. **How abnormal is participation?**
   - daily RVOL
   - slot RVOL
   - cumulative pace

2. **Where might that participation come from?**
   - dealer proprietary flow
   - dealer hedge flow
   - ETF creation/redemption or index rebalance
   - block trades
   - odd-lot activity
   - day trading
   - actual securities-lending short sales

The second family explains **origin**, not strength.

## Highest-priority next decomposition
### Dealer proprietary vs hedge
Reasons:
- official TWSE/TPEx data already expose the split;
- current Worker already fetches the payload;
- zero incremental API cost;
- existing dealerBuyDays currently mixes both mechanisms;
- strong microstructure rationale.

This becomes the first Tier-2 origin decomposition worth testing.

## Medium priority
- actual SBL short-sale activity;
- day-trading share;
- index-rebalance context;
- block-trade share where official per-stock data are feasible.

## Lower / conditional priority
- ETF creation/redemption constituent exposure;
- odd-lot share;
- warrant-level delta reconstruction.

These require more joins/data semantics and risk feature creep.

## Formal governance
Current A-line condition “foreign/trust/dealer at least one side consecutive buying” remains unchanged.

Before any change to the dealer component:
1. preserve existing combined dealerNet;
2. prospectively store proprietary and hedge separately;
3. compare:
   - combined dealer streak;
   - proprietary streak;
   - hedge streak;
   - proprietary+foreign/trust combinations;
4. evaluate D1/D3/D5, MFE/MAE, false-confirmation and capital-utilization impact;
5. only then consider a Class-C proposal.

## New hypothesis
PV-H005:
“Dealer proprietary-flow streak provides cleaner incremental institutional-confirmation information than combined dealer flow, while dealer hedge flow is primarily a volume-origin/risk-context variable.”

Counter-hypothesis:
Hedge demand itself may carry useful directional information or persistent mechanical demand, so stripping it out may worsen performance.

Status: ORIGIN_DECOMPOSITION_FRAMEWORK_COMPLETE / FORMAL_LOCKED.

# PV-103 — Margin Financing / Short Interest Are Leverage-and-Disagreement States, Not Simple Direction Scores

## Taiwan evidence
Historical TWSE research using 1991–2004 data found heavily shorted stocks subsequently produced negative risk-adjusted abnormal returns, with the effect weakening as holding horizon lengthened. The same study also found interaction between high relative short interest and high margin-trading levels consistent with disagreement/overvaluation dynamics.

Source:
- Hu, Huang & Liao (2009), Quarterly Review of Economics and Finance
  https://doi.org/10.1016/j.qref.2008.07.002

## Why direct translation is unsafe
The study:
- uses an older regulatory/microstructure regime;
- focuses on monthly/longer horizons;
- predates today's market structure, ETF scale, algorithmic trading and current short-sale rules.

Therefore:
“high short interest => short-term bearish signal”
is not justified for the present system.

## Better research interpretation
Margin/short variables describe:
- leverage;
- disagreement;
- crowding;
- potential forced-cover / forced-sell risk;
- financing sensitivity.

## Candidate states
- `MARGIN_LONG_CROWDING`
- `SHORT_CROWDING`
- `TWO_SIDED_LEVERAGED_DISAGREEMENT`
- `LEVERAGE_NORMAL`
- `UNKNOWN`

These should be derived from normalized rates, not raw balances.

## Normalization candidates
Use:
- balance / issued shares;
- change in balance / turnover;
- own-history percentile or robust z-score;
- margin-long vs short ratio.

Raw share count across firms is not comparable.

## Constructive counter-cases
High margin financing can:
- reflect conviction;
- support momentum while financing remains available.

High short interest can:
- contain information;
- but also create future short-cover demand.

Therefore both sides can create continuation OR reversal depending on price acceptance and crowding.

Status: LEVERAGE_RISK_CONTEXT / NO_SIMPLE_DIRECTION SCORE.


# PV-104 — Same-Day Short-Sale / SBL Data Are Potentially As-Of-Safe for the Current 23:35 Scan

## Current production times
Official data-shop documentation states:
- TWSE Daily Short Sale Balances: production around 23:30 Taipei time;
- TPEx Margin Trading and SBL balance file: production around 22:00 Taipei time.

Sources:
- https://eshop.twse.com.tw/en/product/detail/000000006e0bbe8d016f183dc3be033a
- https://eshop.tpex.org.tw/en/product/detail/2c92e013922929930192b293cae303ff

## Current system timing
The current after-market Formal scan runs at approximately 23:35 Taipei time.

Therefore, unlike the old 18:10 architecture:
- TPEx same-day margin/SBL data should normally be temporally available before scan;
- TWSE same-day short-sale balance is theoretically available only a few minutes before scan.

## Important operational risk
23:30 production does not guarantee:
- public endpoint is populated by exactly 23:35 every day;
- CDN/API propagation is complete;
- no delayed production occurs.

Therefore TWSE has a very narrow freshness margin.

## Safe future ingestion semantics
If researched:
1. fetch with exact source date = marketDate;
2. store sourcePublishedAt / fetchedAt;
3. if marketDate mismatch or data unavailable => UNKNOWN;
4. never delay or fail Formal scan waiting for it;
5. never substitute previous day as current day without an explicit lag flag.

## Governance
Same-day availability makes these fields **eligible for research at 23:35**, but not automatically eligible for Formal use.

Status: AS_OF_FEASIBLE_WITH_NARROW_TWSE_MARGIN / FAIL_OPEN_REQUIRED.


# PV-105 — Margin + Short Interaction as Disagreement / Crowding Research

## Hypothesis
When both:
- normalized margin-long exposure is high;
- normalized short/SBL exposure is high;
the stock may be experiencing elevated disagreement and leverage crowding.

Potential outcomes:
- higher realized volatility;
- larger intraday range;
- more false breakouts;
- larger MFE and MAE simultaneously.

## Constructive interpretation
Two-sided participation can:
- improve liquidity;
- accelerate price discovery;
- create fuel for a directional breakout once one side loses.

## Adverse interpretation
Crowded leverage can:
- amplify forced selling;
- amplify short covering;
- increase whipsaw.

## Research variables
Potential Tier-2:
- `pvMarginBalanceRate`
- `pvShortBalanceRate`
- `pvSblShortSaleRate`
- `pvLeverageDisagreementState`
- `pvMarginDeltaRvol20`
- `pvShortDeltaRvol20`

## Primary outcomes
Do not begin with next-return sign.
First test:
- realized range;
- MAE;
- false-confirmation rate;
- stop-first;
- gap risk;
- MFE/MAE joint expansion.

## Why this belongs after v0.1
The mechanism is plausible, but it requires:
- additional daily joins;
- shares-outstanding normalization;
- exact source-timing semantics;
- separate margin-short vs SBL-short definitions.

Status: TIER2_RISK_MECHANISM / DEFER UNTIL CORE PV DATA_QA.


# PV-106 — Existing DealerBuyDays Has a Known Interpretation Risk

## Current implementation audit
Current Worker:
- parses official combined `dealerNet`;
- persists only combined dealerNet;
- computes `dealerBuyDays` from combined net.

This means the existing institutional confirmation rule can count:
- proprietary dealer buying;
- hedge-related dealer buying;
as one combined streak.

## This is not necessarily a bug
The combined number is an official dealer total and represents real net cash-market demand.

However, it is semantically broader than:
“dealer directional conviction.”

## Research risk
If hedge flows dominate some names:
- dealerBuyDays may overstate directional institutional sponsorship;
- especially in stocks with active warrant/ETF/derivative hedging.

Counter-case:
- hedging flow itself may be persistent and useful;
- removing it could reduce predictive value.

## Required future test
PV-H005 should compare:
A. current combined dealerBuyDays;
B. proprietary-only dealerBuyDays;
C. hedge-only dealerBuyDays;
D. foreign/trust confirmation without dealer;
E. conditional combinations.

Outcomes:
- D1/D3/D5;
- MFE/MAE;
- false-confirmation;
- selected-name scarcity / capital utilization.

No Formal change before prospective or sufficiently clean historical evidence.

Status: KNOWN_SEMANTIC_RISK / VALIDATION_REQUIRED.


# PV-107 — Priority after Leverage and Dealer-Flow Research

## High priority
1. Dealer proprietary vs hedge decomposition.
   - zero incremental API cost;
   - current payload already contains the fields;
   - directly tests an existing Formal context variable.

2. As-of short/SBL availability audit at 23:35.
   - important because the timing architecture changed from 18:10 to 23:35.

## Medium priority
3. Margin-short disagreement / crowding.
4. actual SBL short-sale flow vs short balance.

## Lower priority
5. detailed warrant-level delta reconstruction;
6. ETF constituent creation/redemption attribution;
7. full block-trade decomposition.

## Current rule
Do not expand PV_SHADOW_V0_1 during DATA_QA.

All PV-098~107 items remain Tier-2 research/context candidates.

Status: PRIORITY_FROZEN / V0_1_UNCHANGED / FORMAL_LOCKED.

# PV-108 — Disposition Securities Change the Trading Clock; Standard 15m PV Semantics Can Break

## Taiwan market structure
TWSE disposition measures can change matching from normal continuous trading to periodic call auction.

TWSE investor education describes examples:
- first disposition: matching every 5 minutes;
- repeated disposition: matching every 20 minutes;
- securities already under special periodic trading can be extended further;
- pre-collection of cash/securities and tighter credit conditions may also apply.

Official source:
- https://www.twse.com.tw/rwd/staticFiles/product/publication/0001069208.pdf

## Why this is critical for PV
A 20-minute matching cycle does not align with 15-minute candle slots.

Observed 15m candles can therefore show:
- near-zero volume in one slot;
- a burst in the next slot;
- artificial range/body concentration;
because execution timing is imposed by regulation rather than natural participation.

This can corrupt:
- pvSlotRvol20;
- pvCumvolPace20;
- pvResponseState;
- pvPersistenceState.

## Decision
Disposition-day intraday PV must not be interpreted as normal-market 15m participation.

Future guard:
`DISPOSITION_PERIODIC_AUCTION`

Interpretability:
INVALID for the primary clean 15m PV cohort.

Raw observations may still be stored for audit / separate market-structure research.

Status: ALTERED_TRADING_CLOCK_INVALIDATES_CLEAN_15M_PV.


# PV-109 — Attention and Disposition Are Different Guard Levels

## Attention security
An attention flag warns that the security meets exchange surveillance conditions.

Attention status by itself does not necessarily replace the normal continuous-trading clock.

Research role:
- context;
- attention/speculation moderator;
- not automatically invalid.

Candidate:
`ATTENTION_CONTEXT` => GUARDED or contextual subgroup.

## Disposition security
Disposition can impose actual trading restrictions:
- periodic call auction;
- pre-collected cash/securities;
- tighter margin/short-sale conditions.

Research role:
- altered market structure;
- primary clean 15m PV invalid when periodic matching is active.

Candidate:
`DISPOSITION_PERIODIC_AUCTION` => INVALID for clean intraday PV.

## Important rule
Do not collapse:
attention == disposition.

They have different causal impact on price-volume data generation.

Status: ATTENTION_CONTEXT ≠ DISPOSITION_MARKET_STRUCTURE.


# PV-110 — Disposition Sessions Should Be Excluded from Same-Slot Baseline, Not Treated as Zero

## Baseline consequence
If a stock trades normally for 19 days, then spends 10 days under periodic disposition trading, those disposition sessions are not comparable same-slot observations.

Therefore:
- do not enter them into the normal 15m slot median;
- do not zero-fill missing/misaligned slots;
- do not let their forced bursts distort cumulative pace.

## After disposition ends
Disposition is usually a temporary trading regime, not a permanent corporate-action transformation.

Therefore the preferred rule is:
- retain valid pre-disposition normal sessions;
- pause baseline accumulation during disposition;
- resume adding normal sessions after normal trading returns.

A full 20-post-event reset is NOT automatically required as it is for a split/capital reduction.

## Possible post-release context
The first normal sessions after restrictions end can still experience:
- pent-up participation;
- released leverage/shorting demand;
- normalization of liquidity.

Potential context:
`POST_DISPOSITION_RELEASE`

Do not hard-code a 1/3/5-day duration before evidence.

Status: BASELINE_PAUSE_NOT_ZERO / NO_AUTOMATIC_FULL_RESET.


# PV-111 — Current Cross-Market Disposition Evidence Has a Coverage Asymmetry

## Existing research infrastructure audit
Current research external-evidence code already captures:
- TWSE official attention/disposition context.

But the V8.7.11 cross-market evidence layer explicitly records TPEx:
- `UNKNOWN_TPEX_ATTENTION_NOT_CAPTURED_V8_7_11`
- `UNKNOWN_TPEX_DISPOSITION_NOT_CAPTURED_V8_7_11`

Therefore:
TPEx missing flag cannot mean “normal.”

## Consequence for PV
A future disposition guard cannot be promoted as a Taiwan-wide clean filter until:
- TPEx authoritative source is captured;
- date/finality semantics are verified.

Until then:
- TWSE flagged disposition => known guard;
- TPEx status unavailable => UNKNOWN coverage state.

## Research-only workaround
For historical/outcome analysis:
- exclude known TWSE disposition events from clean 15m cohort;
- report TPEx disposition coverage limitation separately;
- do not silently classify TPEx as non-disposition.

Status: CROSS_MARKET_PARITY_GAP / UNKNOWN_NOT_FALSE.


# PV-112 — Leverage/Shorting Lane Confirms Disposition Is a Constraint Variable, Not an Alpha Factor

## Cross-lane integration
The existing `LEVERAGE_SHORTING_RESEARCH.md` independently concluded:
- attention/disposition rules alter margin/short eligibility and price discovery;
- sudden changes in short activity cannot be interpreted without checking regulatory restrictions;
- constraint state should be a control/guard.

This reinforces the PV result:
a volume change during disposition can arise from a changed participant set and matching mechanism.

## Combined causal chain
Disposition may change:
1. who can finance/short;
2. cash/securities pre-collection;
3. matching frequency;
4. observed transaction timing;
5. liquidity;
6. daily/intraday volume;
7. false-break / price-response behavior.

Therefore the same observed RVOL cannot be compared naïvely with normal-regime observations.

## Ownership
- Leverage/Shorting lane owns financing/shorting restrictions.
- PV lane owns whether the resulting volume/price observation is comparable.
- Market Microstructure owns matching mechanics.

No duplicate score.

Status: CROSS_LANE_GUARD OWNERSHIP FROZEN.


# PV-113 — Existing Passive-Flow Lane Already Covers Index-Rebalance Contamination; PV Should Consume the State, Not Rebuild It

## Cross-lane audit
The existing `PASSIVE_FLOW_INDEX_REBALANCING_RESEARCH.md` has already established:
- index addition/deletion/weight change is distinct from fundamental news;
- mechanical passive demand can still have real price impact;
- announcement and effective windows are separate states;
- additions/deletions are asymmetric;
- event-date index weights are required;
- late-session 15m bars cannot isolate closing-auction flow;
- passive-flow evidence remains data-gated.

## Integration rule
PV should not build a second index-rebalance model.

Future PV context should consume a passive-flow event state such as:
- NO_EVENT
- ANNOUNCED_PRE_EFFECTIVE
- EFFECTIVE_MINUS_1
- EFFECTIVE_SESSION
- POST_EFFECTIVE

Then ask:
Does the same PV state behave differently inside vs outside passive-flow windows?

## Primary comparison
Example:
`EXTREME_RVOL + EFFICIENT_UP`

Compare:
- no passive-flow event;
- index effective-session;
- post-effective.

Outcomes:
- next-session acceptance;
- reversal;
- D3/D5 retention;
- MFE/MAE.

## Rule
Do not estimate “actual passive flow” from coarse RVOL.
Use the passive-flow lane's provenance-quality event state.

Status: CROSS_LANE_REUSE / NO_DUPLICATE_INDEX_MODEL.

# PV-114 — Derivatives Expiry Is a Market-State Moderator, Not a Stock-Level Causal Attribution

## Existing derivatives lane
The repository already contains `DERIVATIVES_VOLATILITY_RESEARCH.md`, whose core conclusion is:
- futures/options evidence should first be used as market-state / risk context;
- aggregate PCR, OI, basis and foreign futures positions are not direct stock-picking oracles;
- expiry composition and settlement mechanics require explicit guards.

PV should consume these states rather than rebuild derivatives models.

Status: CROSS_LANE_REUSE.


# PV-115 — Taiwan Expiry Windows Can Mechanically Affect Late-Session Spot Activity

## Official settlement mechanics
TAIFEX domestic equity-index futures/options final settlement uses the arithmetic mean of the underlying index during the last 30 minutes before cash-market close.

Source:
- https://www.taifex.com.tw/enl/eng5/formulaIndex

Single-stock futures/equity options final settlement uses the arithmetic mean of the underlying security during the last 60 minutes of cash-market trading.

Source:
- https://www.taifex.com.tw/enl/eng5/formulaStock

## Implication
On expiry/final-settlement sessions:
- hedging;
- inventory adjustment;
- basis convergence;
- option/futures position liquidation
can create spot-market activity during the settlement window.

## Critical guard
A high-volume late-session stock bar on expiry day does NOT prove derivative hedging caused the flow.

Need separate evidence:
- derivative product exists;
- expiry/final-settlement date;
- relevant underlying;
- dealer/participant positioning where available.

Status: EXPIRY_WINDOW_CONTEXT / CAUSAL ATTRIBUTION PROHIBITED.


# PV-116 — Index-Derivatives Expiry Is Mainly a Common-Factor Contamination Problem

## Difference from covered warrants
Covered warrants can generate stock-specific hedge demand in the individual underlying.

Index futures/options are primarily broad-market instruments.

Therefore their spot impact should usually appear as:
- broad index/large-cap activity;
- correlated constituent flow;
- late-session common participation.

## PV integration
This strengthens the value of:
- market residual RVOL;
- sector residual RVOL;
- cross-sectional breadth;
- expiry-day market-state flag.

If the entire market volume rises during an index expiry window, raw stock RVOL may overstate stock-specific information.

## Counter-case
A high-weight constituent can receive disproportionate impact due index contribution/liquidity.

Therefore common-factor residualization helps but does not perfectly remove expiry mechanics.

Status: BROAD COMMON-FLOW MODERATOR.


# PV-117 — Derivative-Hedge Context Ownership

## Stock-specific hedge origin
Owned primarily by:
- covered warrant / structured-product dealer hedge flow;
- single-stock futures/options where meaningful.

Potential PV context:
`STOCK_SPECIFIC_DERIVATIVE_HEDGE_CONTEXT`

## Market-wide derivative state
Owned by Derivatives/Volatility lane:
- index futures basis;
- option IV/VIX;
- PCR;
- OI;
- expiry/roll;
- foreign derivatives positioning.

PV consumes:
`DERIVATIVES_EXPIRY_CONTEXT`
or broader risk state.

## Rule
Do not add:
- PCR points;
- foreign-futures-short points;
- VIX points
into a stock PV score.

Use them only to test whether the same stock PV state behaves differently under different market derivative states.

Status: DERIVATIVES-PV OWNERSHIP FROZEN.

# PV-118 — Unified Volume-Origin Taxonomy

## Why a taxonomy is needed
A high-RVOL observation answers only:
“How much participation occurred relative to history?”

It does not answer:
“Why did the participation occur?”

The same 3x RVOL can arise from very different mechanisms with different persistence and risk implications.

## Canonical origin classes

### O1 — STOCK_SPECIFIC_INFORMATION
Examples:
- earnings / revenue / material information;
- company-specific order/customer/product news;
- firm-specific regulatory/corporate event.

Interpretation:
potentially information-driven, but public-news coverage is incomplete and “no news found” is not evidence of no information.

### O2 — DISCRETIONARY_DIRECTIONAL_FLOW
Examples:
- foreign cash-equity buying/selling;
- investment-trust buying/selling;
- dealer proprietary inventory decisions.

Interpretation:
participant appears to be making a directional cash-market allocation, but motive is still not directly observable.

### O3 — MECHANICAL_HEDGE_FLOW
Examples:
- dealer warrant/option hedge;
- single-stock derivative hedge;
- inventory delta adjustment.

Interpretation:
real cash demand/supply can persist, but motive is mechanical risk management rather than necessarily fundamental conviction.

### O4 — PASSIVE_BASKET_FLOW
Examples:
- index addition/deletion/weight change;
- passive ETF/index tracking;
- creation/redemption basket activity;
- benchmark closing execution.

Interpretation:
common/basket demand rather than necessarily stock-specific information.

### O5 — LEVERAGE_CROWDING_FLOW
Examples:
- margin financing build-up/unwind;
- margin short build/cover;
- actual SBL short-sale flow;
- squeeze/deleveraging.

Interpretation:
describes leveraged positioning, disagreement and forced-flow risk.

### O6 — MARKET_STRUCTURE_DISTORTION
Examples:
- disposition periodic auctions;
- price-limit censoring;
- volatility interruption/reopening;
- opening/closing auction mixture;
- corporate-action reference-price issues.

Interpretation:
observed volume/price timing is mechanically altered; clean PV comparability may be invalid.

### O7 — COMMON_FACTOR_FLOW
Examples:
- broad market risk-on/off;
- sector-wide activity;
- index-derivative expiry/settlement;
- macro shock.

Interpretation:
participation is real but may contain little stock-specific information.

### O8 — LIQUIDITY_TRANSFER / NEGOTIATED_FLOW
Examples:
- block trade;
- large ownership transfer;
- negotiated after-hours trade.

Interpretation:
can contain information or temporary liquidity demand; do not infer one sign.

### O9 — RETAIL_SHORT_HORIZON_ACTIVITY
Examples:
- odd-lot activity;
- day trading;
- high transaction-count churn.

Interpretation:
attention/short-horizon participation context, not automatically dumb-money or reversal.

### O10 — UNKNOWN_OR_MIXED
Default when several mechanisms are plausible or evidence is insufficient.

## Multi-origin rule
One observation may have multiple simultaneous origin tags.

Example:
an index-addition effective session may also have:
- foreign directional flow;
- passive basket flow;
- dealer hedge flow;
- broad market volume shock.

Do not force one mutually exclusive cause.

## Ownership
Each specialized research lane owns its causal evidence:
- PV: abnormal participation / price response / acceptance;
- Institutional: cash investor-type flow;
- Leverage/Shorting: financing / SBL;
- Passive Flow: index/ETF events;
- Derivatives: expiry/risk state;
- Microstructure: auction/VI/order-book mechanics.

PV consumes origin context; it does not duplicate every source model.

Status: UNIFIED_VOLUME_ORIGIN_TAXONOMY_FROZEN.


# PV-119 — Attribution Confidence: Never Claim Causality More Strongly Than the Evidence

## Core rule
An origin tag is not the same as a causal conclusion.

The system must carry:
- `originClass`
- `attributionConfidence`
- `evidenceType`
- `evidenceTimestamp`
- `coverageState`

## Confidence levels

### AC0 — UNKNOWN
No reliable origin evidence.

Allowed language:
- “origin unknown”
- “multiple mechanisms possible”

### AC1 — CONTEXT_PRESENT
A known event/regime overlaps the PV observation, but no direct flow amount links it to the stock move.

Examples:
- MSCI effective date;
- derivatives expiry day;
- attention status;
- broad market shock.

Allowed language:
- “index-rebalance context present”
- “expiry context present”

Forbidden:
- “the volume was caused by the rebalance.”

### AC2 — DIRECT_RELATED_FLOW_OBSERVED
A same-date, same-symbol official flow variable is observed.

Examples:
- dealer hedge net flow;
- dealer proprietary net flow;
- actual SBL short-sale flow;
- official day-trading volume.

Allowed language:
- “dealer hedge flow was elevated alongside the volume event.”

Still forbidden:
- “dealer hedging caused X% of the volume”
unless gross compatible flow attribution is directly measured.

### AC3 — QUANTIFIED_CONTRIBUTOR
A directly compatible gross flow/share can be quantified against the same-scope denominator.

Examples only when source semantics genuinely match:
- official day-trading volume / official total compatible volume;
- directly reported block-trade volume / compatible total volume.

Allowed language:
- “at least/approximately X% of compatible reported activity was in category Y,”
with provenance and scope caveats.

### AC4 — CAUSAL_IDENTIFICATION
Reserved for research designs with credible causal identification or direct tagged execution data.

Not available from ordinary production market data in the current system.

## Net-flow warning
Net buy/sell is NOT gross participation share.

For example:
dealer hedge net +5,000 shares does not mean dealer hedge generated only 5,000 shares of turnover; gross buys and sells may be much larger.

Therefore:
- net flow supports AC2;
- do not convert net/volume into a causal “share of volume” without validating the construct.

## Multiple-origin output
If several AC1/AC2 origins coexist:
report:
`MIXED_ORIGIN_CONTEXT`
rather than selecting a winner.

Status: ATTRIBUTION_CONFIDENCE_FROZEN / CAUSAL_OVERCLAIM_PROHIBITED.


# PV-120 — Volume-Origin Source Readiness Matrix

## Purpose
Separate:
- source exists;
- source is integrated;
- source is point-in-time safe;
- source is historically available;
- source is cheap enough to use.

### Core PV 15m OHLCV
Source: Fugle historical/live candles.
Current integration: YES.
Point-in-time: YES under completed-bar rules.
Historical baseline: YES for documented modern window.
Incremental live API cost: zero in v0.1 because existing Formal 15m frame is reused.
Readiness: READY / DATA_QA.

### Dealer proprietary vs hedge
TWSE official data explicitly publish Dealers (Proprietary) and Dealers (Hedge); TWSE E-Shop daily investor detail is generated at 18:00 excluding block trades and 20:00 including block trades. Current Worker already fetches an official T86-style payload but stores combined dealerNet only.
TPEx official institutional page likewise publishes proprietary, hedge and combined dealer flows.

Sources:
- TWSE investor daily detail production/data fields:
  https://eshop.twse.com.tw/en/product/detail/6edec1b6e62345cb9f1244acbbcefae0
- TPEx institutional daily page:
  https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?l=zh-tw&o=htm

Current integration:
- payload available;
- split fields not persisted by current Formal institution snapshot.

Incremental API cost:
expected zero if parsed from existing payload.

Readiness:
HIGH / BEST NEXT TIER2 CAPTURE CANDIDATE.

### TWSE attention/disposition
Official TWSE daily attention/disposition data exist; Data E-Shop production is 19:00. Current research layer already captures TWSE attention/disposition context.

Source:
https://eshop.twse.com.tw/en/product/detail/23b52f831197436b9ac497cec4a92bb0

Readiness:
READY AS RESEARCH CONTEXT.

### TPEx attention/disposition
Official TPEx public query pages exist:
- attention history from 2002;
- disposition history from 2003-era coverage.
TPEx E-Data Shop produces attention/disposition files daily at 22:00.

Sources:
- https://www.tpex.org.tw/zh-tw/announce/market/attention.html
- https://www.tpex.org.tw/zh-tw/announcement/mainboard/disposal.html
- https://eshop.tpex.org.tw/en/product/detail/2c92e013922929930192b2923ce703fd

Current production integration:
NOT captured in V8.7.11 research layer; currently recorded as UNKNOWN_TPEX_*.

Readiness:
SOURCE_AVAILABLE / INTEGRATION_GAP.

### TWSE actual short/SBL state
TWSE Daily Short Sale Balances (TWT93U) production time is 23:30 and includes margin short and SBL short flows/balances/quotas.

Source:
https://eshop.twse.com.tw/en/product/detail/000000006e0bbe8d016f183dc3be033a

Current scan:
23:35, leaving a narrow nominal availability buffer.

Current research integration:
TWSE actual SBL-short evidence exists in V8.7.11 research layer.

Readiness:
SOURCE_READY / TIMING_FRAGILE / MUST FAIL OPEN.

### TPEx margin/SBL state
TPEx E-Data Shop Margin_SBL.csv production time: 22:00; history begins 2006-01-02.

Source:
https://eshop.tpex.org.tw/en/product/detail/2c92e013922929930192b293cae303ff

Current V8.7.11 integration:
TPEx SBL/margin still UNKNOWN/not captured.

Readiness:
SOURCE_EXISTS / INTEGRATION-LICENSING-ACCESS GAP.

### Day-trading volume
TWSE security-level day-trading statistics are generated at 20:00 and include day-trading volume and buy/sell values.

Source:
https://eshop.twse.com.tw/en/product/detail/0000000071aa258c01725a782bd4008f

TPEx day-trading research remains source/finality-sensitive and should not be assumed symmetric without a verified comparable file.

Readiness:
TWSE SOURCE_READY / TPEx NEEDS PARITY AUDIT.

### Daily transaction count
TWSE daily quote data include transaction count and are generated multiple times after close.
Existing daily-source family already makes daily count a low-cost research candidate.

Source:
https://eshop.twse.com.tw/en/product/detail/ef7b7785e2cb4793baca3644c8a74d4e

Readiness:
HIGH / LOW INCREMENTAL COST.

### Block-trade origin
Official market sources exist, but the current PV pipeline does not have a verified per-symbol block-share dataset joined point-in-time.

Readiness:
SOURCE FAMILY EXISTS / NOT INTEGRATED / MEDIUM PRIORITY.

### Passive/index rebalance
Existing Passive Flow lane has event clocks and partial constituent/AUM maps, but closing-auction-specific microdata remain missing.

Readiness:
EVENT CONTEXT PARTIAL / FLOW QUANTIFICATION DATA-GATED.

### Derivatives expiry
Official expiry/calendar and settlement mechanics are available.
Stock-specific causal flow attribution usually is not.

Readiness:
CONTEXT READY / CAUSAL ORIGIN LOW CONFIDENCE.

## Readiness categories
- READY: integrated and point-in-time semantics frozen.
- SOURCE_READY: authoritative source exists but production integration incomplete.
- PARTIAL: event/source exists but key quantities missing.
- DATA_GATED: needed data not currently available at required granularity.
- UNKNOWN: source semantics unresolved.

Status: SOURCE_READINESS_MATRIX_V1_FROZEN.


# PV-121 — Residual RVOL and Origin Context Solve Different Problems

## Definitions
Raw RVOL asks:
“Is this stock unusually active relative to itself?”

Market/sector residual RVOL asks:
“Is the stock unusually active relative to the common activity around it?”

Origin context asks:
“What mechanisms plausibly contributed to that activity?”

They are complementary, not interchangeable.

## Decision table

### Raw high + residual high + no mechanical context
Interpretation candidate:
more stock-specific participation.

Still not proof of private/fundamental information.

### Raw high + residual low
Interpretation:
activity is largely common with market/sector.

Possible causes:
- macro event;
- sector theme;
- index/expiry flow.

### Raw high + residual high + direct dealer-hedge AC2
Interpretation:
stock-specific abnormality exists, with dealer hedge flow observed.

Do not subtract dealer net from volume; net flow is not gross turnover.

### Raw high + residual low + index-effective AC1
Interpretation:
common/passive-flow explanation becomes more plausible.

### Raw normal + residual high
Possible when the whole market is abnormally quiet.
Interpretation:
stock is relatively active despite normal own-history volume.

This can be informative and demonstrates why raw/residual views should coexist.

## No double-count scoring
Do not award:
+1 raw RVOL
+1 residual RVOL
+1 sector strength
+1 passive-flow context

as if independent.

Instead use a latent description:
`PARTICIPATION_SPECIFICITY_STATE`

Candidate states:
- STOCK_SPECIFIC_ELEVATION
- COMMON_ACTIVITY_ELEVATION
- RELATIVE_RESILIENCE
- MIXED
- UNKNOWN

No Formal score.

Status: RAW_RESIDUAL_ORIGIN_ORTHOGONALITY_FROZEN.


# PV-122 — PV-H005 Dealer Proprietary vs Hedge Capture/Test Protocol

## Objective
Test whether current combined dealerBuyDays mixes two materially different mechanisms:
- directional dealer proprietary flow;
- mechanical hedge flow.

No Formal change.

## Data capture
For every official institution snapshot date/symbol, research schema should preserve:

### Core
- marketDate
- symbol
- sourceMarket
- sourceEndpoint/sourceFamily
- capturedAt
- sourceDate
- schemaVersion
- decisionImpact=false

### Dealer split
- dealerProprietaryBuy
- dealerProprietarySell
- dealerProprietaryNet
- dealerHedgeBuy
- dealerHedgeSell
- dealerHedgeNet
- dealerCombinedBuy
- dealerCombinedSell
- dealerCombinedNet

### Other institutional controls
- foreignNet
- trustNet
- institutionTotalNet

## Integrity tests
1. numeric fields must be present; missing != 0.
2. combined dealer net must reconcile to proprietary+hedge net within exact source semantics.
3. source date must equal marketDate.
4. market coverage TWSE/TPEx reported separately.
5. duplicate symbol/date rejected.
6. no backfill from future snapshots into earlier decision dates.

## Derived research features
- propBuyDays
- hedgeBuyDays
- combinedBuyDays
- propSellDays
- hedgeSellDays
- propVsHedgeSignState:
  - SAME_POSITIVE
  - SAME_NEGATIVE
  - PROP_BUY_HEDGE_SELL
  - PROP_SELL_HEDGE_BUY
  - MIXED_ZERO
  - UNKNOWN
- hedgeDominance:
  descriptive only; use gross-compatible measures where available, not net/volume as causal share.

## Primary comparison
On existing selected/control cohorts:

A. current combined dealer streak
B. proprietary-only streak
C. hedge-only streak
D. foreign/trust only
E. combined institutional rule with proprietary dealer substituted for combined dealer

Do not alter actual Formal selection.

## Outcomes
- D1/D3/D5 return
- MFE/MAE
- structural false-confirmation
- stop-first where applicable
- selected-name scarcity counterfactual
- capital-utilization counterfactual

## Controls
- scan date cluster
- market
- sector
- liquidity
- price tier
- market regime
- current PV acceptance/participation
- passive-flow context
- derivatives-expiry context
- attention/disposition
- leverage/short context where coverage allows.

## Falsification
PV-H005 fails promotion if:
- proprietary-only does not add incremental information over combined;
- hedge flow is equally/more predictive;
- differences disappear after sector/regime/liquidity controls;
- result is concentrated in warrant-heavy names only without broader stability;
- replacing combined dealer flow materially worsens candidate scarcity/capital utilization;
- TWSE/TPEx effects disagree under adequate coverage.

## Governance
Initial capture can be research-only with zero extra API calls if the existing payload is reused.
Any change to Formal dealerBuyDays is Class C and requires separate owner approval after evidence.

Status: PV-H005 PROTOCOL FROZEN / CAPTURE NOT YET IMPLEMENTED.


# PV-123 — Correction to PV-111: TPEx Disposition Is an Integration Gap, Not a Source-Availability Gap

PV-111 correctly identified that V8.7.11 currently records TPEx disposition/attention as UNKNOWN.

However, official TPEx public sources do exist.

Therefore the precise statement is:
- **production research coverage gap**: YES;
- **authoritative source absent**: NO.

This matters because the remedy is data integration/provenance work, not abandoning TPEx parity.

Current safe rule remains:
UNKNOWN != NOT_DISPOSITION.

Status: PV-111 QUALIFIED / SOURCE EXISTS.


# PV-124 — Origin Attribution Should Usually Be a Set, Not a Single Label

## Problem
Market activity commonly has simultaneous mechanisms.

Example:
MSCI effective day + dealer hedge buying + high foreign cash buying + broad market rally.

Selecting one “cause” destroys information and creates false certainty.

## Representation
Store:
`originEvidence[]`

Each item:
- originClass
- confidence
- direction if directly observed
- grossOrNet
- source
- asOf
- scope
- notes

Then derive:
- highestConfidence
- originCount
- hasMechanicalContext
- hasStockSpecificFlowContext
- hasMarketStructureDistortion
- mixedOrigin=true/false

## Prohibited field
Do not create:
`primaryCause = "ETF"`
unless AC4 causal identification exists.

## Human-facing output
Preferred:
“爆量同時出現：指數調整背景（AC1）、自營商避險買超（AC2）；無法判定單一主因。”

Status: MULTI-EVIDENCE ORIGIN MODEL FROZEN.


# PV-125 — Abstention Is a Valid Research Output

## Principle
A mature system should sometimes say:
“we do not know what caused the volume.”

This is better than forcing:
- accumulation;
- distribution;
- smart money;
- retail chase;
- hedge flow.

## Required abstention cases
- conflicting AC2 flow directions;
- only AC1 event context;
- poor source coverage;
- TPEx disposition unknown;
- corporate-action/price-limit/auction confounders;
- common-factor activity without stock-specific evidence.

## Research benefit
Abstention rate itself is measurable:
- what fraction of high-RVOL events can be meaningfully decomposed?
- does higher attribution confidence improve outcome interpretation?
- do low-confidence events have noisier MFE/MAE?

Potential future hypothesis:
higher origin-attribution confidence improves explanatory stability, not necessarily directional alpha.

Status: ABSTENTION_ALLOWED / FORCED_CAUSAL_LABELS_PROHIBITED.

# PV-126 — Gross Participation and Net Direction Are Different Dealer Signals

## Problem
Dealer net flow compresses two quantities into one number.

Example A:
- buy 1,000,000
- sell 950,000
- net +50,000

Example B:
- buy 60,000
- sell 10,000
- net +50,000

Both have the same net flow but radically different market participation.

## Separate constructs

### Directional imbalance
For a dealer component:
`directionalImbalance = (buy - sell) / (buy + sell)`

Range:
-1 to +1 when denominator >0.

Interpretation:
how one-sided the participant's activity is.

### Side-participation share
If total-volume scope is verified compatible:
`sideParticipationShare = (buy + sell) / (2 * totalMarketVolume)`

Why denominator has 2x:
every executed share has a buyer-side and a seller-side.
The numerator counts participant-side volume.

Interpretation:
share of all trade-side volume attributed to that participant category.

This is NOT:
- unique-trade share;
- causal share of price movement;
- ownership turnover.

## Required separate fields
For proprietary:
- propGross = propBuy + propSell
- propNet = propBuy - propSell
- propDirectionalImbalance
- propSideParticipationShare (only with compatible denominator)

For hedge:
- hedgeGross
- hedgeNet
- hedgeDirectionalImbalance
- hedgeSideParticipationShare

## Scope guard
TWSE official investor statistics can include regular, odd-lot, after-hours fixed-price and block trading; official product families also distinguish excluding-vs-including block versions.
Therefore side-participation ratios require an explicitly compatible total-volume source/version.

Sources:
- https://www.twse.com.tw/en/fund/T86
- https://eshop.twse.com.tw/en/product/detail/6edec1b6e62345cb9f1244acbbcefae0
- https://eshop.twse.com.tw/en/product/detail/f73d0e1584694b6986c9f7751abc3ca3

## Why this matters for PV-H005
The strongest version of H005 is not merely:
“proprietary net vs hedge net.”

It is:
“Does directional proprietary imbalance and/or proprietary participation carry cleaner incremental information than combined dealer net, while hedge participation explains mechanical-flow intensity?”

Status: GROSS_VS_NET_SEMANTICS_FROZEN.


# PV-127 — Participant-Side Share Is Descriptive, Not a Causal Volume Share

## Important accounting issue
If an institution buys from another institution in the same category:
- the buy side is counted;
- the sell side is counted;
- the trade itself is still one market execution.

Thus:
`(buy+sell)/(2*marketVolume)`
is a valid **trade-side participation share** under compatible scope,
but not the fraction of unique executions “caused by” that category.

## Consequence
Allowed:
“dealer hedge accounts represented 18% of compatible reported trade-side volume.”

Not allowed:
“18% of today's volume was caused by dealer hedging.”

## Net-flow ratio
`net / totalVolume`
is a directional pressure proxy, not a participation share.

## Research design
For H005 always report:
- gross side-participation;
- net directional imbalance;
- raw net;
separately.

Do not choose one after seeing outcomes.

Status: PARTICIPATION_ACCOUNTING_GUARD_FROZEN.


# PV-128 — Selection-on-High-RVOL Can Create Collider / Selection Bias

## Problem
Suppose both:
- dealer hedge activity;
- company-specific information
can cause high volume.

If research includes only “high-RVOL events,” conditioning on high volume can induce an artificial relationship between the two causes even when they were otherwise weakly related.

More generally, conditioning on a common effect can create collider-stratification / selection bias.

Method sources:
- Cole et al., illustrating collider bias:
  https://pmc.ncbi.nlm.nih.gov/articles/PMC2846442/
- Hernán & Robins, Causal Inference: What If:
  https://www.hsph.harvard.edu/miguel-hernan/wp-content/uploads/sites/1268/2024/04/hernanrobins_WhatIf_26apr24.pdf

## PV implication
Do not test origin variables only inside:
`pvSlotRvol20 >= 1.3`
and then interpret associations causally.

High RVOL itself is affected by many candidate origins.

## Safer primary cohort
For H005 and future origin studies:
- use the existing Formal selected/control cohort independent of dealer split;
- retain the full range of RVOL;
- model/interact with RVOL rather than restrict entirely to high-RVOL events.

High-RVOL subgroup can be a secondary descriptive slice.

## Example
Primary:
Does proprietary/hedge decomposition add information across all eligible observations after controlling for participation?

Secondary:
Among high-RVOL events, what patterns are seen?

The secondary analysis is not causal proof.

Status: COLLIDER_SELECTION_GUARD_FROZEN.


# PV-129 — Origin-Conditioned Outcome Design Must Separate Mechanism, Participation and Outcome

## Minimal causal ordering
At observation time:

Context/regime
  -> origin flow states
  -> observed participation / price response
  -> future acceptance/outcome

But reality can also contain:
- common causes of origin and price;
- feedback within the same session;
- anticipatory trading.

Therefore simple regressions cannot prove causality.

## Research layers

### Layer A — descriptive source decomposition
What origin evidence coexists with the event?

No outcome inference required.

### Layer B — incremental prediction
Does origin evidence add out-of-sample information after:
- raw RVOL;
- residual RVOL;
- price response;
- Formal context;
- regime/sector/liquidity?

This is predictive, not causal.

### Layer C — causal mechanism
Requires stronger design:
- event timing;
- exogenous rule/index changes;
- direct tagged execution;
- credible identification.

Most PV work remains Layer A/B.

## Reporting language
Layer A:
“coincides with.”

Layer B:
“adds incremental predictive separation.”

Layer C:
“causal effect” only when identification is defensible.

Status: PREDICTION_CAUSALITY_BOUNDARY_FROZEN.


# PV-130 — Tier-2 Origin-Data Priority Ranking by Information Gain per Engineering Cost

## Priority 1 — Dealer proprietary vs hedge
Information gain:
HIGH.
Engineering cost:
LOW.
Reason:
existing official payload already contains fields; no new API expected.

Research objective:
PV-H005.

## Priority 2 — TPEx attention/disposition parity
Information gain:
HIGH for data validity.
Engineering cost:
LOW-MEDIUM.
Reason:
official public query/history exists; current gap is integration, not source absence.

Objective:
prevent invalid normal-market 15m interpretation.

## Priority 3 — Daily transaction-count decomposition
Information gain:
MEDIUM-HIGH.
Engineering cost:
LOW.
Reason:
daily source already includes transaction count.

Objective:
count-driven vs size-driven abnormal volume.

## Priority 4 — TWSE actual SBL / short context
Information gain:
MEDIUM-HIGH.
Engineering cost:
MEDIUM.
Reason:
research source exists; 23:30 publication gives narrow timing margin for 23:35 scan.

Objective:
risk/crowding/false-confirmation context.

## Priority 5 — Market/sector residual daily RVOL
Information gain:
HIGH.
Engineering cost:
MEDIUM.
Reason:
existing full-market daily data make it feasible.

Objective:
stock-specific vs common participation.

## Priority 6 — TPEx margin/SBL parity
Information gain:
MEDIUM-HIGH.
Engineering cost:
MEDIUM-HIGH because access/integration/licensing semantics remain.

## Priority 7 — Day-trading share / block-share
Information gain:
MEDIUM.
Engineering cost:
MEDIUM-HIGH due scope/finality parity.

## Priority 8 — Passive-flow exact quantity / close-auction attribution
Information gain:
potentially high for event days.
Engineering cost:
HIGH / DATA-GATED.

## Priority 9 — Warrant-level delta / exact hedge reconstruction
Information gain:
potentially high in subset.
Engineering cost:
VERY HIGH.

## Governance
Priority is research sequencing, not permission to implement into Formal.

Current next best research data extension remains:
**dealer proprietary/hedge split capture**, followed by **TPEx disposition parity**.

Status: ORIGIN_DATA_PRIORITY_FROZEN.

# PV-131 — Foreign / Trust Gross Participation May Matter, but Do Not Multiply the Factor Zoo

## Data reality
Official TWSE/TPEx institutional reports publish buy, sell and net values for:
- foreign investors;
- investment trusts;
- dealers proprietary;
- dealers hedge.

Current Worker persists only:
- foreignNet;
- trustNet;
- dealerNet;
plus streaks.

## Why gross activity may add information
Taiwan evidence shows institutional:
- trade size;
- order aggressiveness;
- price contribution;
can differ materially by trader type.

Some studies find professional institutional trades have informational content for future returns, while other Taiwan evidence shows foreign traders can behave more passively under certain market conditions.

Sources:
- Lien, Hung & Lin (2020), International Review of Economics & Finance:
  https://doi.org/10.1016/j.iref.2019.10.011
- Hao et al. (2015), Pacific-Basin Finance Journal:
  https://doi.org/10.1016/j.pacfin.2015.05.002
- Tsai, Shu & Chiang (2019), Journal of Multinational Financial Management:
  https://doi.org/10.1016/j.mulfin.2019.100591

## Research implication
Gross foreign/trust participation may describe:
- information-processing intensity;
- liquidity provision;
- portfolio turnover;
- common/global flow;
without necessarily sharing the sign of net flow.

## Anti-feature-zoo decision
Do NOT create separate new Formal factors:
- foreignGrossScore;
- trustGrossScore;
- dealerGrossScore.

Instead:
capture gross buy/sell as origin/context data and test incremental value after:
- existing net flow;
- RVOL;
- residual RVOL;
- sector/regime.

Status: CAPTURE_WORTHWHILE / NO_NEW_STANDALONE_SCORE.


# PV-132 — Source-Scope Compatibility Contract for Institutional Participation Ratios

## Problem
A ratio is meaningful only if numerator and denominator cover compatible trading sessions/types.

TWSE official institutional statistics and official daily stock statistics both can cover:
- regular trading;
- odd-lot;
- after-hours fixed-price;
- block trading;
while excluding auction/tender offers.

Sources:
- TWSE T86 report remarks:
  https://www.twse.com.tw/en/fund/T86
- TWSE daily STOCK_DAY / market summary remarks:
  https://www.twse.com.tw/en/exchangeReport/STOCK_DAY
  https://www.twse.com.tw/en/exchangeReport/FMTQIK

But TWSE also distributes versions excluding block trades versus including block trades.

Source:
https://eshop.twse.com.tw/en/product/detail/6edec1b6e62345cb9f1244acbbcefae0

## Required metadata
Every gross-flow record must carry:
- `flowScopeId`
- includesRegular
- includesOddLot
- includesAfterHoursFixed
- includesBlock
- excludesAuction
- sourceVersion

Every denominator must carry:
- `volumeScopeId`
with the same dimensions.

## Compatibility rule
Compute:
`sideParticipationShare`
only when:
`flowScopeId == volumeScopeId`
or an explicit audited mapping proves equivalence.

Otherwise:
- raw buy/sell/net may still be stored;
- participation-share field = null;
- coverage reason = SCOPE_MISMATCH.

## Intraday prohibition
Daily institutional gross data must never be divided by:
- default 15m candle volume;
- regular-session-only cumulative volume
unless a dedicated same-scope numerator exists.

Status: FLOW_DENOMINATOR_SCOPE_CONTRACT_FROZEN.


# PV-133 — Gross Institutional Participation Can Help Explain HIGH_EFFORT_LOW_PROGRESS, but It Must Not Duplicate Volume

## Question
When PV observes:
`HIGH_EFFORT_LOW_PROGRESS`
is high activity coming from:
- strong two-sided institutional trading;
- directional institutional imbalance;
- mechanical hedge;
- non-institutional/retail/common flow?

## Candidate decomposition
Within the same high-effort bar/day context:
- total RVOL;
- foreign side-participation;
- trust side-participation;
- dealer proprietary side-participation;
- dealer hedge side-participation;
- directional imbalance by category.

## Possible interpretations

### High gross institutional participation + low directional imbalance
Possible:
- liquidity provision;
- rotation/rebalancing;
- disagreement;
- two-sided execution.

### High gross + strong directional imbalance
Possible:
- more one-sided institutional demand/supply.

### Low institutional participation + high total RVOL
Possible:
- retail/day-trading;
- non-three-institution participants;
- block/other flows;
- common activity.

## Important counterpoint
Gross institutional participation is mechanically related to total volume.
Therefore an apparent predictive result may be only a restatement of RVOL.

## Incremental-value requirement
Any gross-participation variable must be tested after:
- total RVOL;
- daily transaction count;
- market/sector common activity;
- current net flows.

If no residual information remains, archive it.

Status: HIGH_EFFORT_DECOMPOSITION_CANDIDATE / REDUNDANCY_HIGH.


# PV-134 — Institutional Data Vintage / Finality Semantics for the 23:35 Scan

## Current scan timing
Formal after-market scan is approximately 23:35 Taipei time.

## TWSE institutional data
Official TWSE investor-detail products are generated:
- around 18:00 excluding block trades;
- around 20:00 including block trades.

Source:
https://eshop.twse.com.tw/en/product/detail/6edec1b6e62345cb9f1244acbbcefae0

The public T86 report notes statistics use original transactions and do not incorporate later brokerage account-error corrections.

Source:
https://www.twse.com.tw/en/fund/T86

## Research consequence
For a 23:35 decision snapshot:
same-day TWSE institutional flow is temporally available under normal publication.

But source identity matters:
- excluding-block version;
- including-block version;
must not be silently mixed historically.

## TPEx
Current official daily institutional page is available after close and exposes the proprietary/hedge split.
Production/finality should be captured from source timestamp rather than assumed identical to TWSE.

## Required fields
- sourceMarket
- sourceFamily
- sourceVariant
- marketDate
- publishedAtKnown / sourceProducedAt if documented
- fetchedAt
- asOfEligibleAt2335
- finalityState
- revisionPolicy

## Fail-open rule
If same-day source is:
- unavailable;
- wrong date;
- schema changed;
then institution origin fields = UNKNOWN.

Formal scan must not fail or reuse prior day as current day.

Status: INSTITUTION_VINTAGE_CONTRACT_FROZEN.


# PV-135 — Decision on H005 Capture Proposal Timing

## Question
Should dealer proprietary/hedge split capture be implemented immediately?

## Evidence for
- strong mechanism rationale;
- official fields already exist in payloads;
- expected zero incremental API calls;
- current combined dealerBuyDays has a known semantic mixture;
- buy/sell/net capture is low-complexity and point-in-time useful.

## Evidence against immediate implementation
PV_SHADOW_V0_1 is still in DATA_QA.

Adding a second new research recorder immediately would:
- expand the debugging surface;
- make data-quality failures harder to attribute;
- blur the clean prospective start of the core PV experiment.

## Decision
**Do not implement H005 capture until PV_SHADOW_V0_1 passes its first DATA_QA stabilization gate.**

Preparation status:
- hypothesis frozen;
- source feasible;
- field schema defined;
- integrity rules defined;
- gross/net semantics defined.

Implementation status:
WAIT.

## Trigger to revisit
Earliest:
after the core PV Shadow demonstrates:
- no Formal isolation failures;
- no duplicate/mutation issues;
- baseline/slot coverage stable;
- expected D1 writes/API behavior stable.

Then H005 can be proposed as a separate Class-A research-only capture change.

Status: H005_DESIGN_READY / IMPLEMENTATION_DEFERRED_UNTIL_CORE_DATA_QA_STABLE.

# PV-136 — Institutional Streak Length Loses Flow Magnitude Information

## Current issue
Current Worker uses:
- foreignBuyDays
- trustBuyDays
- dealerBuyDays

These preserve sign persistence but not magnitude.

Example:
Sequence A:
+1000, +900, +800 lots

Sequence B:
+1000, +50, +5 lots

Both are “3 consecutive buy days,” but participation persistence is very different.

## Required conceptual separation
1. **Direction persistence**
   - consecutive positive/negative days.

2. **Normalized magnitude**
   - daily net / compatible daily volume;
   - daily net / ADV20;
   - side-participation where scope-compatible.

3. **Cumulative pressure**
   - sum of signed normalized flows over the streak.

4. **Trajectory**
   - strengthening;
   - stable;
   - decaying;
   - reversing;
without forcing a tuned threshold before evidence.

## Why this matters
A long streak with vanishing magnitude may represent:
- residual allocation;
- passive rebalance tail;
- stale signal.

A short but very large flow may represent:
- concentrated information;
- one-off rebalance;
- event shock.

Neither dominates universally.

Status: STREAK_LENGTH_NOT_INTENSITY.


# PV-137 — Taiwan Herding Evidence Supports Persistence Research, but Not a Universal “Longer = Better” Rule

## Evidence
Taiwan studies document institutional herding/persistence, but behavior differs by:
- investor type;
- firm size/liquidity;
- market pressure;
- buy vs sell side.

Hsieh (2013) finds institutional herding and positive-feedback behavior with stronger effects in some stock/market states.

Source:
https://doi.org/10.1016/j.irfa.2013.01.003

Hung, Lu & Lee (2010) find Taiwan mutual funds may follow their own prior trading and report asymmetric future-return behavior for herd buying versus selling.

Source:
https://doi.org/10.1016/j.pacfin.2010.06.001

Other Taiwan evidence finds institutional/margin herding changes during extreme market moves.

Source:
https://www.sciencedirect.com/science/article/abs/pii/S1059056014000707

## Implication
Do not encode:
`buyDays 4 > buyDays 3 > buyDays 2`
as a universal linear score.

Instead test:
- sign persistence;
- flow intensity;
- market regime;
- buy/sell asymmetry;
- participant type.

Status: PERSISTENCE_CONTEXT_DEPENDENT.


# PV-138 — Institutional Flow Can Be Informed, Liquidity-Provision, or Price-Following

## Mixed Taiwan evidence
Institutional trading is not one mechanism.

Research reports:
- professional institutional order size/aggressiveness can contain future-price information;
- foreign institutions can contribute to price discovery in some market states;
- foreign institutions can become market followers/passive liquidity providers in other states;
- older Taiwan evidence even finds contrarian/stabilizing foreign behavior in some periods.

Sources:
- https://doi.org/10.1016/j.iref.2019.10.011
- https://doi.org/10.1016/j.mulfin.2019.100591
- https://doi.org/10.1016/j.pacfin.2015.05.002
- https://doi.org/10.1016/S1057-5219(02)00069-8

## PV consequence
Institutional flow observed on the same day as a price move may be:
- cause;
- response;
- liquidity provision;
- hedge;
- common reaction to third-party information.

Therefore contemporaneous:
`institutionalNet_t x return_t`
cannot establish information direction.

## Research timing
Separate:
- lagged flow -> future outcome;
- contemporaneous flow + contemporaneous PV response;
- future flow as outcome only.

Do not use future institutional persistence to relabel an earlier snapshot.

Status: REVERSE_CAUSALITY_GUARD_FROZEN.


# PV-139 — Flow Persistence Should Be Normalized Before Cross-Stock Comparison

## Problem
+5,000 lots is huge for one stock and trivial for another.

## Candidate normalized views
Prefer descriptive hierarchy:

### Flow vs daily turnover
`netFlow / compatibleDailyVolume`

### Flow vs own ADV20
`netFlow / ADV20`

### Gross side participation
`(buy+sell)/(2*compatibleDailyVolume)`

### Own-history percentile
Percentile of normalized flow using only prior valid observations.

## Capital/size view
Optional after issued-share semantics are point-in-time valid:
`netFlow / issuedShares`

Do not call this free-float flow.

## Rule
Raw net shares/lots may be retained for provenance but should not drive cross-stock inference alone.

Status: INSTITUTION_FLOW_NORMALIZATION_HIERARCHY_FROZEN.


# PV-140 — Institutional Flow x Price Acceptance Is More Informative Than Flow Alone, but Must Avoid Duplicate Scoring

## Interaction intuition
Same institutional buy flow can occur with different price responses.

### Large buy + efficient-up / acceptance
Possible:
- directional demand is being accepted.

### Large buy + high-effort/low-progress
Possible:
- seller absorption;
- distribution against institution;
- rebalance/liquidity transfer.

### Large buy + failed re-entry
Possible:
- flow was insufficient;
- mechanical/non-informational;
- stronger opposing supply.

### Small net + large gross participation
Possible:
- two-sided liquidity provision / rotation.

## Research interaction
Use:
`InstitutionFlowState x pvResponseState x pvAcceptanceState`

But do not add independent points for:
- flow;
- RVOL;
- response;
- acceptance
without incremental testing.

## Outcome questions
- Does accepted proprietary buying improve D1/D3/D5 compared with rejected proprietary buying?
- Does hedge buying behave differently from proprietary buying under the same PV state?
- Does foreign/trust flow only help in BULL_BROAD/MIXED or also BEAR_BROAD?
- Does gross participation explain MAE/range more than direction?

## Causality guard
Interaction improves description/prediction but does not prove the institution caused the move.

Status: FLOW_ACCEPTANCE_INTERACTION_FROZEN / NO_FORMAL_SCORE.

# PV-141 — Foreign Dealer Is a Distinct Semantic Category; “ForeignNet” Needs an Explicit Definition

## Official reporting
TWSE/TPEx institutional reports separate:
- foreign investors excluding foreign dealers;
- foreign dealers;
- investment trusts;
- dealers.

TWSE notes foreign-dealer trading is not included in the official total.
TPEx notes foreign-dealer trading is already included in dealer trading and therefore is not separately included in the three-institution total.

Sources:
- https://www.twse.com.tw/en/fund/T86
- https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?l=zh-tw&o=htm

## Current Worker audit
TWSE parser currently constructs:
`foreignNet = foreignMain + foreignDealer`.

TPEx parser uses the combined foreign row field.

Thus current `foreignNet` is closer to a broad “foreign-account flow” concept than the official:
`Foreign Investors excluding Foreign Dealers`
concept.

## Why this matters
A label such as:
“foreign consecutive buying”
must specify whether it means:
- foreign investors excluding foreign dealers;
- broad foreign accounts including foreign dealers.

Without that definition, historical comparisons and official-total reconciliation can be ambiguous.

## Decision
Do NOT alter current Formal semantics during PV research.

Research capture should preserve separately:
- foreignMainNet;
- foreignDealerNet;
- broadForeignNet;
and provenance.

Future evidence can decide which definition is useful.

Status: FOREIGN_FLOW_SEMANTIC_SPLIT_REQUIRED / FORMAL_UNCHANGED.


# PV-142 — Institutional Categories Are Not Independent Votes

## Temptation
A future rule might count:
- foreign buy = 1 vote;
- trust buy = 1 vote;
- dealer buy = 1 vote.

Then “3/3 buying” looks stronger than “1/3.”

## Problem
The categories can be correlated because of:
- common market information;
- index rebalance;
- sector rotation;
- same price momentum;
- shared liquidity conditions;
- ETF/hedge mechanics.

Dealer hedge can also respond mechanically to flows initiated by other investors.

Therefore three positive categories are not three independent pieces of evidence.

## Better research question
Does **institutional breadth** add incremental information beyond:
- strongest participant flow;
- total institutional net;
- gross institutional participation;
- market/sector common activity;
- PV acceptance?

## Candidate descriptive state
- SINGLE_GROUP
- TWO_GROUP_CONSENSUS
- THREE_GROUP_CONSENSUS
- CONFLICTED
- NONE
- UNKNOWN

No additive vote score.

Status: INSTITUTIONAL_BREADTH_NOT_INDEPENDENT_EVIDENCE.


# PV-143 — Flow Trajectory Is More Informative Than Streak Count Alone

## Descriptive trajectory
For a same-sign streak, preserve the normalized sequence:
`f_{t-k}, ..., f_t`

Possible trajectory labels after evidence design:
- ACCELERATING
- STABLE
- DECELERATING
- REVERSING
- IRREGULAR
- UNKNOWN

## Avoid premature thresholds
Do not define:
“last flow < 50% first flow = decaying”
without prospective evidence.

Initial research can use:
- normalized linear slope;
- current / median prior streak magnitude;
- cumulative normalized flow;
as continuous diagnostics.

## Important distinction
A decelerating positive streak may still be constructive if:
- price accepts;
- supply contracts;
- sector is strong.

An accelerating streak can be late/crowded.

Therefore trajectory is context, not a monotonic score.

Status: FLOW_TRAJECTORY_CONTINUOUS_FIRST.


# PV-144 — Investor-Flow Capture Should Preserve Raw Components before Derived Streaks

## Data architecture principle
The durable record should store daily raw point-in-time components first:
- buy;
- sell;
- net;
- source;
- scope;
- date;
- capturedAt.

Derived:
- streak days;
- normalized flow;
- trajectory;
- consensus breadth
can always be recomputed under a versioned research definition.

The reverse is impossible:
a stored `foreignBuyDays=3` cannot recover the underlying daily magnitudes.

## Implication for future Class-A capture
If/when institutional origin capture is implemented:
store raw components rather than only adding:
- propBuyDays;
- hedgeBuyDays.

This prevents future research from being trapped by today's derived definition.

Status: RAW_FIRST_DERIVED_LATER_FROZEN.


# PV-145 — Institutional-Origin Research Should Remain Separate from Core PV Shadow during Initial QA

## Reason
PV_SHADOW_V0_1 is validating:
- clock-time normalization;
- response;
- acceptance;
- persistence;
- guards.

Institution-flow decomposition studies:
- participant identity;
- gross/net;
- streak trajectory;
- mechanical hedge origin.

These are related but distinct data-generation questions.

## Governance
Do not merge the schemas during first QA.

Later integration should be by:
- marketDate;
- symbol;
- as-of-safe timestamps;
- schema versions.

This lets researchers ask:
`PV state x institution-origin state`
without making either recorder depend on the other.

## Benefit
If one source breaks:
- PV core remains valid;
- institution research becomes UNKNOWN;
- Formal remains unaffected.

Status: MODULAR_RESEARCH_LANES_REQUIRED.
