# Fundamental Information Dynamics Research
# 基本面資訊動態：Level / Change / Surprise / Revision / Price Reaction

Started: 2026-09-25 Asia/Taipei
Status: ACTIVE RESEARCH LANE
Scope: Research-only / Shadow. Formal Core unchanged.

## Purpose

目前系統已有基本面品質分數，但主要使用「已公告數字的水準與成長」：
- revenueYoY
- revenueMoM
- revenueYTDYoY
- EPS / epsYoY
- gross / operating margin
- valuation / announcements

這條新研究主線不是再加更多財務比率，而是拆開五種不同資訊：

1. LEVEL — 數字本身高低
2. CHANGE — 相對自己過去變好/變差
3. SURPRISE — 相對公告前預期超出/低於多少
4. REVISION — 公告前後市場/分析師對未來預期如何修正
5. PRICE REACTION — 公布當下價格反應多少、之後是否延續/反轉

Source audit of current main Worker:
- `revenueYoY`: present
- `epsYoY`: present
- `fundamentalScore()`: present
- strings `surprise`, `consensus`, `revision`, `forecast`: absent

Therefore this is a genuinely incremental knowledge layer.

---

## FD-001 — Growth is not surprise

Example:
A company reports monthly revenue YoY +30%.

This says:
- growth versus last year = +30%.

It does NOT say:
- market expected +10%, therefore +20ppt positive surprise;
- market expected +50%, therefore negative surprise.

Likewise EPS YoY +40% is not an earnings surprise unless a pre-announcement expectation is defined.

### Required naming
- revenueYoY = realized growth
- epsYoY = realized growth
- consensusRevenueSurprise = actual minus pre-event consensus, only when true consensus vintage exists
- consensusEpsSurprise = actual minus pre-event consensus
- modelRevenueInnovation = actual minus frozen model expectation
- modelEarningsInnovation = actual minus frozen model expectation

Never call a YoY growth rate “surprise.”

Status: SEMANTIC BOUNDARY FROZEN.

---

## FD-002 — Post-Earnings-Announcement Drift (PEAD) is real literature, not a guaranteed modern edge

### Evidence
PEAD describes stock prices continuing in the direction of earnings surprise after the announcement rather than fully adjusting immediately.

A 2021 review covers more than 200 published/working studies and concludes PEAD is one of the most studied anomalies, with evidence across many markets. However mechanisms remain debated and the magnitude may have changed over time.

Source:
- Journal of Behavioral and Experimental Finance 29 (2021), A review of the Post-Earnings-Announcement Drift
- https://doi.org/10.1016/j.jbef.2020.100446

### Positive mechanism
Underreaction / gradual information diffusion:
- investors do not fully update;
- analyst revisions can be slow;
- limited attention can delay incorporation.

### Counter-mechanisms / caveats
- risk adjustment;
- transaction costs;
- bid-ask / liquidity;
- announcement timing;
- effect decay as markets become more efficient;
- cross-country differences;
- small/illiquid firms can show stronger apparent drift.

### System implication
Do not encode “positive EPS surprise => buy.”
Research:
`Surprise x ImmediateReaction x Attention/Liquidity x SubsequentDrift`.

Status: HIGH-VALUE EVENT-STUDY TOPIC.

---

## FD-003 — Revenue surprise contains information beyond earnings surprise

### Evidence
Jegadeesh & Livnat (2006) show revenue surprises are related to announcement returns and subsequent abnormal returns even after controlling for earnings surprise. Analysts revise future earnings in response to revenue surprises but may incorporate the information slowly.

Source:
- Journal of Accounting and Economics 41, Revenue surprises and stock returns
- https://doi.org/10.1016/j.jacceco.2005.10.003

### Why this matters for Taiwan
Taiwan has unusually frequent mandatory monthly revenue disclosure.
This can provide fundamental information between quarterly earnings reports.

### Critical distinction
Monthly revenue YoY/MoM:
- useful realized change,
- but not a true surprise unless compared with a pre-event expectation.

### Research hypotheses
- strong monthly revenue innovation + restrained initial price reaction may drift;
- strong reported growth after a large pre-announcement run-up may show short-term reversal/crowding;
- revenue signal may be stronger when margins/EPS confirm later;
- revenue acceleration without profitability confirmation may be lower-quality.

Status: MONTHLY REVENUE IS A PRIORITY TAIWAN-SPECIFIC LANE.

---

## FD-004 — Taiwan monthly revenue is a timestamped information event

### Current legal/publication rule
Taiwan listed companies generally file prior-month operating revenue by the 10th day of each calendar month.

Sources:
- Securities and Exchange Act Article 36
- TWSE reporting rules
- MOPS monthly revenue

### Research consequence
Using “the month's revenue” on all earlier dates in that month creates look-ahead.

Need exact:
- revenuePeriod
- announcedAt / filedAt
- availableTradingDate
- value as first reported
- correction/revision timestamp if later corrected

### Event alignment
If announced:
- before market open -> same-session event can be considered;
- during session -> event timestamp matters;
- after close -> next trading session is first fully tradable reaction window.

Do not simply assign all monthly revenue to month-end or the 10th.

Status: POINT-IN-TIME AVAILABILITY MANDATORY.

---

## FD-005 — First-known vintage matters; corrected data cannot be backfilled

MOPS can contain later corrected monthly revenue or financial information.

A historical research feature must use:
- what was known at the decision timestamp,
not:
- today's corrected/current snapshot retroactively inserted into history.

### Required fields
- firstReportedValue
- firstReportedAt
- latestValue
- latestUpdatedAt
- correctedFlag
- pointInTimeEligible

### Current system risk
Existing monthly-revenue evidence is current snapshot oriented; it is not automatically a historical first-known vintage series.

Therefore historical monthly-revenue surprise/drift backtests require archived first-known disclosures or prospective capture.

Status: VINTAGE CONTROL FROZEN.

---

## FD-006 — Analyst forecast revision is separate from earnings surprise

### Evidence
Forecast revisions themselves can contain return information.

A 2026 Taiwan study using consensus earnings-growth forecasts finds upward revisions associated with positive excess returns and persistence for up to roughly one month, while downward revisions associate negatively.

Source:
- Finance Research Letters 88 (2026), Profit from analysts’ earnings forecasts consensus? Evidence from Taiwan stock market
- https://doi.org/10.1016/j.frl.2025.109164

Broader literature also documents post-forecast-revision drift and links it partly to analyst underreaction.

### Data boundary
Current system has no verified analyst consensus/revision feed.
Official MOPS actuals cannot be used to fabricate analyst expectations.

Therefore:
- analystRevision fields = UNKNOWN until a valid point-in-time source exists;
- do not approximate consensus using current realized YoY.

### Potential future fields
- consensusEpsNextFY
- consensusEpsRevision5D/20D
- analystCount
- revisionBreadth = upgrades / total revisions
- revisionDispersion
- consensusTimestamp / source

Status: HIGH-VALUE BUT EXTERNAL-DATA-DEPENDENT.

---

## FD-007 — Analysts can mediate PEAD; revision speed matters

### Evidence
Research finds that when analyst forecasts respond more quickly to earnings announcements, more price reaction occurs near the event and less remains for the drift period.

Source:
- Journal of Accounting and Economics 46 (2008), Analyst responsiveness and the post-earnings-announcement drift
- https://doi.org/10.1016/j.jacceco.2008.04.004

### Mechanism
Two positive-surprise stocks may differ:

A:
- analysts revise forecasts immediately,
- price gaps strongly,
- less unprocessed information may remain.

B:
- consensus revisions arrive slowly,
- price reaction modest,
- more delayed adjustment may remain.

### Research interaction
`surpriseMagnitude x revisionSpeed x immediatePriceReaction`

No monotonic assumption:
strong immediate reaction could be efficient adjustment OR overreaction.

Status: INTERACTION HYPOTHESIS.

---

## FD-008 — Price reaction is information about information

The same fundamental surprise can generate different market responses.

### Event features
- eventGapPct
- eventDayAbnormalReturn
- eventClosePosition
- eventVolumeRvol
- postEvent1D/3D/5D/10D
- eventResidualReturn vs market/sector
- immediateReactionPerUnitSurprise

### Conceptual states
1. POSITIVE_SURPRISE + STRONG_POSITIVE_REACTION
2. POSITIVE_SURPRISE + WEAK_REACTION
3. POSITIVE_SURPRISE + NEGATIVE_REACTION
4. NEGATIVE_SURPRISE + STRONG_NEGATIVE_REACTION
5. NEGATIVE_SURPRISE + WEAK_REACTION
6. NEGATIVE_SURPRISE + POSITIVE_REACTION

Cases 3 and 6 are especially informative:
the market may be focusing on guidance, margins, quality, prior expectations, or other simultaneous news not captured by one metric.

### Rule
Never override observed market reaction with “but fundamentals were good.”
The disagreement itself is a research state.

Status: PRICE-REACTION LAYER FROZEN.

---

## FD-009 — Taiwan monthly revenue can show both short-term reversal and longer drift

### Recent Taiwan evidence
A 2026 Finance Research Letters study of record-breaking monthly revenue announcements in Taiwan reports a nonlinear pattern:
- short-term abnormal returns from shorting at next-day open were strongest among names with strong pre-announcement gains/high prices/rapid revenue growth;
- a post-announcement buy-and-hold strategy showed positive returns over the following ~20 trading days.

Source:
- Finance Research Letters (2026), Trading on record-breaking monthly revenue announcements
- https://doi.org/10.1016/j.frl.2026.109911 (verify exact DOI from source before engineering citation if needed)

### Research lesson
“Good monthly revenue” can coexist with:
- immediate attention/overconfidence reversal,
- medium-horizon gradual information incorporation.

Therefore horizon must be explicit.

### Candidate state variables
- preAnnouncementRet5/20
- revenueGrowthLevel
- revenueAcceleration
- eventGap / eventDayReturn
- institutionalNetBeforeEvent
- D1 reversal
- D5/D10/D20 drift

### Counterpoint
Record-breaking revenue is a salient subset, not all revenue announcements.
Do not extrapolate its pattern to ordinary monthly reports.

Status: TAIWAN EVENT-HORIZON HYPOTHESIS.

---

## FD-010 — Fundamental information transfer across peers

### Evidence
Same-industry peer earnings announcements can convey information about other firms and contribute to drift / price reactions.

Source:
- International Review of Financial Analysis, Competitive earnings news and post-earnings announcement drift
- https://doi.org/10.1016/j.irfa.2017.02.002

### Taiwan relevance
Supply-chain / industry clustering is strong.
A peer's:
- revenue surprise,
- margin change,
- guidance,
may change expectations for related firms before they report.

### Research boundary
Do not assume positive peer news benefits every peer.
Possible competitive effects:
- demand read-through positive,
- share gain for reporter implies share loss for competitor,
- input-cost shock affects peers differently.

### Candidate peer context
- sameIndustryRecentPositiveEvents
- sameIndustryRecentNegativeEvents
- peerEventDispersion
- ownStockNotYetReported flag
- supplyChainRelationship only if explicitly sourced; do not infer from industry alone.

Status: PEER INFORMATION TRANSFER WORTH RESEARCH.


---

## FD-011 — Surprise measurement hierarchy: expectation source is part of the variable

A fundamental "surprise" is only defined relative to an expectation that existed **before** the release.

### Tier A — True point-in-time analyst consensus
Preferred when available:
- consensus estimate timestamped before event;
- analyst count;
- mean / median estimate;
- dispersion;
- latest revision time.

Fields:
- consensusActual
- consensusExpected
- surpriseRaw = actual - expected
- surprisePct only when denominator semantics are safe
- surpriseScaled = raw surprise / frozen dispersion or another pre-registered scale

Never use a consensus snapshot downloaded after the event as the pre-event expectation.

### Tier B — Company guidance / company financial forecast
Taiwan MOPS exposes financial forecast / forecast-vs-actual related disclosures and investor-conference information.

This is **management expectation**, not analyst consensus.

Fields:
- companyGuidanceLow / High / Mid
- guidancePeriod
- guidanceIssuedAt
- guidanceRevisedAt
- actualVsGuidance

### Tier C — Frozen model expectation
When no external expectation exists, a model can estimate a benchmark using only information available before the event.

Examples:
- seasonal random-walk EPS model;
- same-calendar-month revenue seasonal model;
- rolling company-specific trend model.

Naming:
- modelInnovation
not:
- analystSurprise / consensusSurprise.

### Tier D — Simple realized change
- YoY
- MoM
- QoQ

These are still useful, but they are **CHANGE**, not SURPRISE.

Status: EXPECTATION-HIERARCHY SEMANTICS FROZEN.

---

## FD-012 — SUE: EPS YoY is not Standardized Unexpected Earnings

### Literature definition
The PEAD literature commonly defines SUE as:
`(actual earnings - expected earnings) / scale`

Expectation can come from:
- a time-series earnings model, or
- analyst forecasts.

Scale can be:
- historical standard deviation of forecast errors,
- price,
- another pre-specified deflator.

The 2021 PEAD review explicitly notes that SUE construction varies across studies.

Sources:
- Fink (2021), A review of the Post-Earnings-Announcement Drift
- Jegadeesh & Livnat (2006), Revenue surprises and stock returns

### Research rule
Do not have one generic field named `SUE` while changing the expectation/scale underneath.

Use explicit names:
- `sueSeasonalErrorStd`
- `sueConsensusErrorStd`
- `ueScaledByPrice`

Each definition is a separate experiment.

### Seasonal-model candidate
For quarterly EPS, one simple pre-registered model:
`UE_t = EPS_t - EPS_{t-4}`

Then standardize with only prior seasonal errors, e.g. rolling historical standard deviation available before t.

This is a model-based surprise, not analyst surprise.

### Taiwan accounting guards
- true single-quarter EPS only;
- par-value/share-count/capital-action adjustments must be verified;
- negative/zero prior EPS makes percentage growth problematic but does **not** invalidate raw unexpected EPS;
- corrected filings require vintage control.

### Current-system implication
Existing `epsYoY` and `epsYoYChangeAmount` are useful CHANGE measures but are not SUE.

Status: SUE SEMANTICS FROZEN; NO NEW FORMAL SCORE.

---

## FD-013 — Monthly revenue needs seasonality and calendar controls

Taiwan monthly revenue has a strong operational calendar:
- different numbers of working/shipping days;
- Lunar New Year can shift activity between January and February;
- company/industry seasonal patterns;
- month-end shipment timing.

A raw MoM comparison can therefore be misleading.

### Preferred hierarchy
1. YoY same calendar month — basic seasonality control.
2. YoY acceleration:
   `revenueYoY_t - revenueYoY_{t-1}`
   This is **growth acceleration**, not surprise.
3. Seasonal model innovation:
   actual revenue minus a model fitted only on pre-event historical same-month/nearby information.
4. Analyst/company expectation surprise when genuine pre-event expectations exist.

### January/February guard
For businesses materially exposed to Lunar New Year timing, test:
- Jan and Feb separately;
- combined Jan+Feb growth;
- working-day / holiday-position controls if reliable.

Do not choose whichever version has the best historical returns after seeing outcomes.

### Taiwan evidence
A 2013–2022 Taiwan study finds monthly revenue announcements carry significant information and that effects differ by exchange, industry and season, with stronger announcement effects in Q1 than Q4 in that sample. This supports treating season as a conditioning variable, not assuming one universal effect.

Source:
- Huang (2024), The Effect of Monthly Sales Announcements for Taiwan-Listed Companies.

Status: SEASONALITY CONTROL REQUIRED.

---

## FD-014 — Earnings quality: cash versus accrual components

### Evidence
Sloan (1996) documents that the persistence of earnings depends on its cash-flow and accrual components; investors historically appeared to over-weight the less-persistent accrual component.

Later work confirms accrual/cash-flow information is important but debates mechanisms and how it overlaps with profitability.

Sources:
- Sloan (1996), The Accounting Review, "Do Stock Prices Fully Reflect Information in Accruals and Cash Flows About Future Earnings?"
- Ball et al. (2016), Accruals, cash flows, and operating profitability in the cross section of stock returns.

### Basic accounting concept
A simple broad proxy:
`accrualComponent ≈ netIncome - operatingCashFlow`

Scaled forms may use:
- average total assets,
- market capitalization,
- sales,
depending on the specific literature.

### Why useful
Two firms can report the same EPS growth:
- Firm A: cash flow supports earnings.
- Firm B: earnings growth is largely accrual-driven.

These may have different persistence.

### Counter-evidence / caveat
High accruals are not automatically manipulation.
Accruals are a normal part of accounting and can reflect legitimate working-capital growth.

Do not label:
- HIGH_ACCRUAL = FRAUD / BAD.

### Taiwan data feasibility
MOPS exposes cash-flow statements, so cash/accrual quality can in principle be built from official data.

Current main Worker source audit finds no:
- cashFlow,
- operatingCash,
- accrual,
- operating-cash-flow fields.

This is a genuine missing fundamental dimension.

Status: HIGH-VALUE FUTURE SHADOW CANDIDATE.

---

## FD-015 — Margin dynamics and operating leverage: level is not enough

Current system uses gross and operating margin levels / YoY changes.

New questions:
- Is revenue growth accelerating while margins expand or contract?
- Is operating profit growing faster/slower than revenue?
- Is the market rewarding growth quality or merely top-line acceleration?

### Candidate realized states
- revenueGrowth
- grossMarginChange
- operatingMarginChange
- operatingIncomeGrowth
- operatingLeverageRealized ≈ operatingIncomeGrowth - revenueGrowth

Call these **realized dynamics**, not surprise.

### Surprise form
A true margin surprise needs a pre-event expected margin:
- analyst consensus,
- company guidance,
- or frozen model.

### Constructive state
Revenue acceleration + margin expansion can indicate scalable growth.

### Counter-state
Revenue acceleration + margin compression can still be rational:
- intentional investment,
- new-product ramp,
- input-cost shock,
- mix shift.

Therefore no automatic good/bad score.

Status: QUALITY-OF-GROWTH INTERACTION CANDIDATE.

---

## FD-016 — Guidance / outlook is a first-class event, but coverage is selective

### Taiwan disclosure environment
TWSE/MOPS provide:
- financial forecast sections;
- actual-vs-forecast disclosures;
- investor-conference information;
- material information.

TWSE rules require listed-company investor-conference information to be disclosed and generally require the event details to be announced at least the prior day; information presented is subject to disclosure requirements.

Sources:
- MOPS information structure
- TWSE material-information procedures Article 8

### Research fields
When explicit quantitative guidance exists:
- guidanceMetric
- guidancePeriod
- guidanceLow / High / Mid
- guidanceIssuedAt
- guidanceRevisionDirection
- actualVsGuidance later

When only qualitative outlook exists:
- retain text/document;
- do not automatically convert "審慎樂觀" into a numerical growth estimate.

### Selection bias
Not every company gives comparable guidance.
Companies choosing to guide may systematically differ from non-guiders.

Therefore:
- guidance missing = UNKNOWN / NOT_PROVIDED,
not zero or neutral.

Status: GUIDANCE EVENT LANE FEASIBLE BUT COVERAGE-SENSITIVE.

---

## FD-017 — Taiwan event-time alignment for abnormal returns

Fundamental-event studies need a tradable clock, not just a report date.

### Event timestamp states
- BEFORE_OPEN
- DURING_SESSION
- AFTER_CLOSE
- DATE_ONLY_UNKNOWN_TIME

### First tradable reference
- BEFORE_OPEN: same-session open is post-information.
- DURING_SESSION: intraday event study if exact timestamp and intraday data exist.
- AFTER_CLOSE: next session open is first post-information price.
- DATE_ONLY_UNKNOWN_TIME: do not pretend the day's open/close cleanly separates pre/post information.

### Event windows
Pre-event:
- D-20 to D-1 return
- D-5 to D-1 return
- pre-event abnormal volume

Immediate:
- overnight gap when applicable
- event-session abnormal return
- event-volume RVOL

Post:
- D+1 / D+3 / D+5 / D+10 / D+20
- MFE / MAE
- market- and sector-adjusted returns

### Simultaneous-news guard
If the same timestamp/date contains:
- earnings,
- dividends,
- guidance,
- major contract,
- financing,
- litigation,
etc.,
the event is `MULTI_NEWS`.
Do not attribute the whole return to EPS/revenue alone.

### Taiwan market guards
- price-limit proximity,
- suspension,
- delayed opening,
- non-trading days.

Status: EVENT-TIME PROTOCOL FROZEN.

---

## FD-018 — Fundamental event × K-line/price-volume reaction states

This lane should integrate with, not duplicate, K-line and price-volume research.

### State examples

1. GOOD_INFO + GAP_UP + HOLD + VOLUME_CONFIRM
2. GOOD_INFO + GAP_UP + FADE
3. GOOD_INFO + NO_REACTION
4. GOOD_INFO + NEGATIVE_REACTION
5. BAD_INFO + GAP_DOWN + CONTINUE
6. BAD_INFO + GAP_DOWN + RECOVER
7. BAD_INFO + POSITIVE_REACTION

### Interpretation questions
GOOD_INFO + weak/negative reaction may mean:
- already priced in;
- expectation was even higher;
- guidance/margins offset headline;
- market/sector shock;
- low information quality.

BAD_INFO + positive reaction may mean:
- bad news was expected;
- "less bad" than consensus;
- guidance improves;
- short covering;
- other simultaneous positive information.

### Research principle
Observed price reaction is not subordinate to our fundamental opinion.
The disagreement is itself data.

### Candidate interaction
`FundamentalInnovation x PreEventRunup x EventReaction x PostEventAcceptance`

Status: CROSS-LANE EVENT STATE FROZEN.

---

## FD-019 — Current data feasibility audit

### Already available in repository/system
Official/current:
- monthly revenue amount / MoM / YoY / YTD YoY;
- quarterly financials;
- true single-quarter EPS review for candidates;
- EPS YoY/change amount and profit/loss transition semantics;
- gross / operating / net margins;
- valuation;
- official announcements;
- MOPS/TWSE source infrastructure.

### Public Taiwan sources also support
- cash-flow statements;
- financial forecasts and forecast-vs-actual disclosures;
- investor-conference information.

### Not currently represented in main Worker source
- analyst consensus;
- forecast revisions;
- surprise fields;
- cash-flow / accrual fields;
- structured guidance;
- explicit investor-conference event extraction.

### Historical data-quality limits
- current MOPS monthly revenue snapshot != guaranteed first-known vintage;
- corrections must not be backfilled;
- historical analyst consensus is unavailable from current official sources;
- exact announcement timestamps may be missing for some current tables;
- historical corporate-action/share-count consistency must be verified for SUE.

### Implication
Near-term research should prioritize:
1. official actuals + exact availability/vintage;
2. model innovations with frozen expectations;
3. price reactions.

Analyst-consensus research waits for a point-in-time provider.

Status: FEASIBILITY MAP FROZEN.

---

## FD-020 — Minimal prospective Fundamental Event Shadow schema

### Event identity
- eventId
- symbol
- eventType
- fiscal/revenue period
- source
- firstPublishedAt
- firstTradableAt
- capturedAt
- correctionOfEventId / correctedFlag
- pointInTimeEligible

### Actual data
Depending on event:
- revenueActual
- revenueYoY / MoM / acceleration
- quarterEPSActual
- epsYoYChangeAmount / profit-transition state
- margins
- CFO / accrual measures when available
- company guidance actual fields when explicitly disclosed

### Expectation
- expectationType = ANALYST_CONSENSUS / COMPANY_GUIDANCE / FROZEN_MODEL / NONE
- expectedValue
- expectationAsOf
- analystCount if applicable
- expectationDispersion if applicable
- modelVersion if applicable

### Surprise / innovation
- rawInnovation
- standardizedInnovation
- scalingMethod
- no misleading percent surprise when denominator <=0

### Market reaction
- preRet5 / preRet20
- eventGap
- eventDayResidualReturn
- eventRVOL
- closePosition
- D1 / D3 / D5 / D10 / D20
- MFE / MAE
- priceReactionState

### Context / guards
- marketRegime
- sectorState
- breadthState
- liquidityState if available
- simultaneousNewsCount/types
- suspension/limit flags
- dataQualityState

### Missing-data semantics
Expectation absent:
- surprise fields = UNKNOWN,
but actual-change event can still be studied.

No exact timestamp:
- intraday event reaction = UNKNOWN;
- only safely aligned broader daily windows may be used according to a pre-registered conservative rule.

Status: PROSPECTIVE SCHEMA FROZEN.

## Exact next continuation after FD-020

FD-021: Earnings persistence / mean reversion and why one quarter of growth should not be extrapolated.
FD-022: Accruals versus investment/growth confounds; avoid simplistic "low accrual good".
FD-023: Analyst dispersion and disagreement as uncertainty/attention state.
FD-024: Fundamental momentum — sequences of revenue/EPS changes versus one-off surprise.
FD-025: Fundamental-price disagreement lifecycle and falsification.
FD-026: Cross-sectional peer-normalized surprise/quality versus own-history normalization.
FD-027: Readiness / redundancy map against existing fundamentalScore, DL-001, Quiet/Attention, K-line/PV/RS.
FD-028: Decide whether this concept lane is complete and whether prospective official-vintage capture can be proposed without touching Formal Core.


---

## FD-021 — Fundamental persistence: one strong quarter should not be extrapolated indefinitely

A high growth print contains at least two questions:
1. how large was the change?
2. how persistent is that change likely to be?

### Why persistence matters
PEAD and earnings-time-series research exist partly because current earnings contain information about future earnings, but investors may not process the serial structure correctly.

A single positive quarter can reflect:
- durable demand,
- temporary shipment timing,
- low-base effect,
- one-time gain,
- inventory cycle,
- currency,
- accounting timing.

### Research variables
Do not create a one-number persistence score first.

Track:
- revenueYoY sequence over 3/6/12 months;
- revenueAcceleration sequence;
- quarterEPS direction sequence;
- margin direction sequence;
- cash-flow confirmation;
- fraction of prior positive growth events followed by positive next-period growth, estimated only from pre-event history.

### Mean-reversion guard
Extremely high growth after an unusually weak base may naturally decelerate without becoming a bad business.

Therefore:
- acceleration down from +100% to +40% is deceleration but still strong realized growth;
- do not label deceleration as negative surprise unless expectation says so.

Status: PERSISTENCE / BASE-EFFECT SEPARATION FROZEN.

---

## FD-022 — Accruals are entangled with investment and growth

Sloan-style accrual evidence is important, but the literature offers competing explanations:
- mispricing due to investors overestimating accrual persistence;
- investment/growth effects;
- risk-based interpretations.

Research on accrual and investment anomalies shows they are intrinsically related, and some studies find return-dispersion/risk variables can weaken the anomaly.

Source:
- Does return dispersion explain the accrual and investment anomalies?
- Journal of Accounting and Economics / related asset-pricing literature.

### Research consequence
Never create:
`lowAccrual = 1 -> good`

Instead condition accrual quality on:
- sales growth,
- asset/investment growth,
- working-capital change,
- cash operating profitability,
- industry,
- lifecycle / size.

### Preferred question
For two firms with similar reported growth/profitability, does cash-supported earnings have greater subsequent persistence than accrual-heavy earnings?

That is closer to the original mechanism and less likely to confuse growth investment with low quality.

Status: SIMPLE ACCRUAL RANKING REJECTED; CONDITIONAL QUALITY STUDY RETAINED.

---

## FD-023 — Analyst dispersion is uncertainty/disagreement, not automatically bearish

### Evidence
Analyst forecast dispersion has a large, contested literature.

Research finds:
- dispersion is related to disagreement and trading around earnings;
- change in dispersion may contain information distinct from the level;
- some documented return relations are conditional on forecast direction, investor optimism/pessimism, disclosure behavior, or measurement choices.

Sources:
- Cen, Wei & Yang (2017), Disagreement, underreaction, and stock returns.
- Ali et al. (2019), Corporate disclosure, analyst forecast dispersion, and stock returns.
- Xu, Yang & Zhang (2026), Investor disagreement and state-dependent mispricing.

### Data fields if a future consensus provider exists
- analystCount
- estimateMean / Median
- estimateStd
- coefficientOfVariation only when denominator is meaningful
- dispersionChange5D / 20D
- meanRevision5D / 20D
- upgradeDowngradeBreadth

### Important interaction
A rising mean forecast with falling dispersion is different from:
- falling mean + rising dispersion,
- rising mean + rising dispersion.

Do not use dispersion direction alone.

### Measurement risk
A 2025 paper shows analyst-window construction itself materially changes dispersion measures and their association with announcement volume/returns.

Therefore forecast-vintage/window definition must be frozen before outcomes.

Status: EXTERNAL-DATA-DEPENDENT UNCERTAINTY LAYER.

---

## FD-024 — Fundamental momentum is broader than one surprise

### Evidence
Earnings momentum has a long literature. Novy-Marx (2015 working paper) argues fundamental earnings momentum can explain substantial price-momentum behavior in his sample.

A revenue/earnings/price momentum study associated with Taiwan researchers finds no single information type dominates: revenue surprises, earnings surprises and past returns can each contain exclusive information, with joint alignment especially informative in their sample.

Sources:
- NBER Working Paper 20984, Fundamentally, Momentum is Fundamental Momentum.
- Chen et al. (2015), Does revenue momentum drive or ride earnings or price momentum?

### Research translation
Fundamental momentum can be represented as a **sequence**, not just one high growth print:
- repeated positive model innovations;
- repeated upward revisions;
- repeated revenue acceleration;
- earnings + revenue jointly improving;
- margins/cash flow confirming.

### Counterpoint
Persistence can turn into extrapolation/overreaction.
Taiwan monthly-sales research has evidence consistent with representativeness-driven reversal after repeated sales news in some samples.

Therefore:
- repeated good news is not mechanically more bullish;
- pre-event price run-up and attention are required controls.

Status: FUNDAMENTAL-SEQUENCE LANE RETAINED WITH OVERREACTION COUNTERSTATE.

---

## FD-025 — Fundamental × price disagreement is a lifecycle, not one-day contradiction

A one-day disagreement may resolve in multiple ways.

### Positive fundamental / weak price reaction
Possible lifecycle:
1. INFO_POSITIVE_REACTION_WEAK
2. PRICE_CATCHUP
3. CONFIRMED_UNDERREACTION

or:
1. INFO_POSITIVE_REACTION_WEAK
2. FURTHER_WEAKNESS
3. MARKET_REJECTED_HEADLINE

### Negative fundamental / resilient price
Possible lifecycle:
1. INFO_NEGATIVE_PRICE_RESILIENT
2. CONTINUED_RESILIENCE
3. BAD_NEWS_PRICED_IN

or:
1. INFO_NEGATIVE_PRICE_RESILIENT
2. DELAYED_BREAK
3. FALSE_RESILIENCE

### Falsification
Do not label underreaction on event day and then backfill the label because price later rose.
The state at t must only use data known at t.

Post-event outcome labels are separate.

Status: AS-OF LIFECYCLE FROZEN.

---

## FD-026 — Own-history surprise and peer-normalized fundamental change answer different questions

### Own-history
“Is this unusual for this company?”
Examples:
- revenue growth percentile vs its own prior years;
- margin change vs own history;
- model innovation normalized by own forecast errors.

### Peer-relative
“Is this unusual versus competitors facing similar conditions?”
Examples:
- revenue growth minus sector median;
- margin change minus sector median;
- earnings innovation percentile within reporting peers.

### Benefits
Peer normalization can remove:
- macro cycle,
- seasonal industry demand,
- commodity/input-price cycle.

### Risks
- historical industry classification must be point-in-time;
- peer group may be too small;
- diversified companies may not fit one industry;
- same-industry firms can have different geographic/product mix.

### Rule
Preserve both:
- ownHistoryInnovation
- peerResidualInnovation

Do not collapse them into one score before evidence.

Status: TWO-BENCHMARK DESIGN FROZEN.

---

## FD-027 — Redundancy map against the existing system

| Fundamental dynamics candidate | Existing nearest field | Incremental question |
|---|---|---|
| realized revenue YoY/MoM | fundamentalScore | already present; reuse |
| revenue acceleration | revenue YoY history | change of growth |
| model revenue innovation | none | unexpected vs frozen seasonal expectation |
| true consensus surprise | none | expectation error |
| EPS SUE | epsYoY/change | standardized unexpected earnings |
| forecast revision | none | expectations changing before/after event |
| forecast dispersion | none | disagreement/uncertainty |
| CFO/accrual quality | margins/EPS | persistence/quality of earnings |
| margin dynamics | margin levels/YoY | quality of growth |
| event price reaction | K-line/PV | market interpretation of fundamental event |
| pre-event run-up | ret/K-line/attention | priced-in/overreaction context |
| peer event transfer | sector/RS | new information from other firms |

### Incremental-validation order
1. current fundamentalScore / existing fields;
2. K-line and price-volume event response;
3. Residual RS / sector state;
4. Quiet/Attention / Information Discreteness;
5. Regime / liquidity;
6. candidate fundamental-dynamics feature.

### Kill rule
If a candidate merely re-encodes revenueYoY/epsYoY or event-day price return and adds no stable incremental value, remove it.

Status: REDUNDANCY GATE FROZEN.

---

## FD-028 — Concept-lane convergence and evidence path

### Highest-value candidates by feasibility

#### Tier 1 — official-source / near-term
- monthly revenue event timestamp/vintage;
- revenue acceleration;
- frozen seasonal model innovation;
- true quarterly EPS event;
- realized margin dynamics;
- event price reaction;
- pre-event run-up;
- multi-news guard.

#### Tier 2 — official-source but additional parsing/history
- CFO/accrual quality;
- explicit company financial forecasts;
- investor-conference/guidance extraction;
- forecast-vs-actual company guidance.

#### Tier 3 — external point-in-time provider required
- analyst consensus surprise;
- analyst forecast revisions;
- analyst dispersion.

### Scientific priority
First build point-in-time event truth.
Without that, sophisticated surprise formulas create false precision.

### Concept status
The fundamental-dynamics lane now covers:
- level/change/surprise/revision/reaction semantics;
- PEAD and revenue surprise;
- Taiwan monthly revenue timing;
- first-known vintage/corrections;
- analyst revisions/disagreement;
- SUE;
- seasonality;
- cash/accrual quality;
- margins/operating leverage;
- guidance;
- event-time alignment;
- price/fundamental interaction;
- persistence;
- fundamental momentum;
- peer transfer / peer normalization;
- redundancy and feasibility.

Further feature invention should pause until point-in-time evidence is available.

Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.

## Exact next continuation after FD-028

Open the next genuinely under-studied knowledge lane.

Priority recommendation:
**Derivatives Information & Volatility Surface**
- index futures basis / open interest / volume;
- option implied volatility;
- put-call skew and tail-risk pricing;
- term structure;
- futures/options positioning;
- expiration/microstructure effects;
- distinction between hedging demand and directional prediction;
- Taiwan futures/options-specific data and settlement mechanics.

Do not interpret put/call or foreign futures positioning as a one-line bullish/bearish oracle; build positive and counter-mechanisms first.


## FD-029 — record-high revenue evidence refresh / DOI correction

Publisher evidence now resolves the exact citation:
- Lai, Tsai, Lin & Lin (2026), Finance Research Letters, `Trading on record-breaking monthly revenue announcements`
- DOI: `10.1016/j.frl.2026.109911`.

The paper uses 12 years of one-second Taiwan intraday data and reports a horizon split:
- record-high monthly revenue announcements can be followed by next-session opening strength and intraday reversal;
- the short-term reversal is stronger after large pre-announcement run-ups;
- pre-announcement institutional net selling strengthens the short-term reversal;
- longer ~20-trading-day post-announcement returns are positive in the paper's design.

The paper's record-high subset is highly salient and is NOT equivalent to arbitrary positive revenueYoY/MoM.

Therefore:
- do not turn “record-high revenue” into a universal bullish or bearish score;
- the relevant research object is an event interaction: `fundamental news state × pre-event price run-up × institutional flow × immediate reaction × horizon`;
- current Formal `fundamentalScore` weights realized growth/levels and does not prove this event timing effect.

Historical return magnitudes from the paper are not imported into Formal thresholds.

## FD-030 — current revenue Shadow cannot establish event time

Fresh source audit of V8.7.11 external evidence:
- official TWSE/TPEx current monthly-revenue snapshots are fetched;
- rows preserve `dataMonth`, current/previous/last-year revenue, MoM, YoY and cumulative values;
- `pointInTimeHistoryStatus = CURRENT_SNAPSHOT_ONLY`;
- `firstKnownAt = null`;
- policy explicitly states that `dataMonth` is report period, not proof of first market-known timestamp;
- `historicalHighStatus = UNKNOWN_REQUIRES_HISTORY`.

Therefore existing rows can support contemporaneous fundamental context, but they cannot cleanly identify:
- announcement day;
- pre-announcement return window;
- announcement-day institution flow alignment;
- next-session D1 reaction anchored to the release;
- whether the value was a historical record at first publication.

Status:
`EVENT_CLOCK_NOT_PROVEN / HISTORICAL_RECORD_STATE_NOT_PROVEN`.

Do not use current snapshot age or scanDate as a retroactive announcement timestamp.

## FD-031 — zero-extra-call source opportunity exists, but runtime boundary is shared

The normal after-market official enrichment already fetches full-market:
- TWSE `t187ap05_L`;
- TPEx `t187ap05_O`;

before candidate selection.

Thus a future first-observed revenue-vintage receipt does not inherently require an additional market-data API call.

However the source payload is consumed inside the shared Formal enrichment path.
Changing parser/output/storage semantics in that shared path is not treated as an autonomous Class-A research tweak.

Engineering classification:
`CLASS_B_PROPOSAL_FIRST`.

No shared runtime change is authorized by this research note.

## FD-032 — conservative prospective first-observed event clock

If later approved, the smallest safe research receipt should store only a data-month transition observed from the already-fetched official full-market payload:

- symbol / market;
- source endpoint / source export date when available;
- previousObservedDataMonth;
- newObservedDataMonth;
- firstObservedAt;
- firstObservedScanDate;
- revenue fields as first observed;
- raw/payload semantic fingerprint or source receipt hash where feasible;
- correction/revision state when the same dataMonth later changes;
- pointInTimeEligible;
- observationLagState.

Conservative tradability rule:
- when exact filing timestamp is unavailable, a newly observed dataMonth at the after-market scan may be used no earlier than the **next official trading session** for event-return attribution;
- do not claim same-session attribution from an 18:10 observation;
- if the system missed prior clean scans, mark `OBSERVATION_DELAY_UNKNOWN`; first observed is not assumed equal to first published.

This deliberately sacrifices some event-timing precision to preserve no-look-ahead.

## FD-033 — record-high classification requires vintage history

A record-high monthly revenue state needs a historical sequence of revenue values that were valid at each first-known vintage.

Current `previousRevenue` and `lastYearRevenue` fields are insufficient to prove an all-time/rolling historical record.

Therefore:
`RECORD_HIGH_REVENUE = UNKNOWN`
until either:
1. a validated historical first-known revenue archive exists, or
2. enough prospective monthly vintages have accumulated under the frozen receipt contract.

A current corrected historical series must not be used to fabricate past “record-high at the time” labels.

## FD-034 — smallest immediately testable mechanism is not record-high

Even before a long record-high history exists, a future clean prospective event clock could test a narrower mechanism without pretending to replicate the paper:

`realized revenue growth state × pre-event run-up × pre-event institutional flow × immediate price reaction`.

This is a NEW system-native hypothesis, not a replication of the record-high study.

Required controls:
- current fundamentalScore / EPS / margins;
- ret20/ret60 / overheat / rank-persistency if available;
- Residual RS / sector;
- market regime / R06 transition / realized volatility;
- liquidity / price tier;
- institutional-score decomposed components rather than only its aggregate score;
- official event overlap / other simultaneous disclosures.

Primary outcome decomposition:
- next-session overnight;
- next-session intraday;
- D3/D5/D10/D20;
- MFE/MAE;
- false/no-follow-through.

Critical falsifications:
- if overheat alone explains the short-term reversal, revenue-event interaction is redundant;
- if institutional net-selling adds no value after its decomposed flow components, reject that interaction;
- if no exact event clock exists, do not test event windows;
- if long-horizon drift is confined to record-high events, do not generalize it to generic YoY growth.

## FD-035 — optimization bridge

No Formal optimization candidate exists.

The plausible eventual system change, only after evidence, is a **fundamental-event reaction context/guard**, not “add more points for higher revenue growth.”

A candidate would have to show that identical fundamentalScore stocks have materially different short-horizon risk / medium-horizon continuation depending on:
- pre-event run-up;
- institutional flow;
- immediate reaction;
- event age.

Any effect on Formal ranking/eligibility is Class C and requires owner approval.

Current status:
`SOURCE_PRESENT / EVENT_CLOCK_DATA_GATED / RECORD_HIGH_HISTORY_GATED / FALSIFICATION_SPEC_READY`.


## FD-036 — Formal fundamentalScore structural audit

Current Formal formula is an additive 0–100 composite with nine possible components:

1. monthly revenue YoY: max 30;
2. monthly revenue MoM, falling back to quarterly revenue QoQ when MoM is missing: max 10;
3. YTD revenue YoY: max 15;
4. positive EPS level: 15 if EPS > 0, otherwise 0;
5. gross-margin level: max 15;
6. operating-margin level: max 15;
7. EPS YoY: max 10;
8. gross-margin YoY change: max 5;
9. operating-margin YoY change: max 5.

Full theoretical maximum = 120, then clamped to 100.

The score is used materially:
- main candidate priority weight = 14%;
- main quality rejection when available fundamental count >= 3 and score < 25;
- other research/Hybrid paths may apply additional thresholds.

Any formula change is Class C.

## FD-037 — availability-scale confounding

The score is summed across whichever components are available.
It is not normalized by:
- number of observed components;
- maximum available component weight;
- source completeness signature.

Only a minimum of three observed fields is required.

Therefore two stocks with identical values on the same three observed fundamentals can receive very different score scales when one stock has additional valid fields.

Frozen synthetic witness:
- illustrative three-field state: 47.5 / theoretical available max 55;
- same values plus three compatible fields: 86.5 / available max 100;
- same values with all nine fields: pre-clamp 101.5 => score 100 / available max 120.

This confirms a structural **coverage confound**.
It does not prove empirical harm; the extra fields may contain useful information.
But outcome studies must separate incremental information from the mechanical ability to accumulate more points.

Status:
`STRUCTURAL_COVERAGE_CONFOUND_CONFIRMED / EMPIRICAL_MATERIALITY_UNKNOWN`.

## FD-038 — saturation and baseline semantics

`scorePositive(value,maxScore) = clamp(maxScore/2 + 0.5*value,0,maxScore)`.

Consequences:
- revenue YoY reaches full 30 points at +30%;
- YTD revenue YoY reaches full 15 at +15%;
- EPS YoY reaches full 10 at +10%;
- gross-/operating-margin YoY change reaches full 5 at +5 percentage points;
- zero change receives half of the component maximum.

Thus the score is NOT a pure growth score.
It intentionally/implicitly mixes:
- positive level/quality baseline;
- realized change/growth.

A fully observed, profitable, zero-growth synthetic state can score 67.5.
A moderately negative-growth but profitable/margin-positive synthetic state can still score materially above zero.

This is not automatically wrong: profitable stable firms may deserve quality credit.
The research guard is semantic:
do not interpret a high fundamentalScore as “high growth” or “positive surprise.”

Saturation risk is structural because the nine maxima sum to 120.
Prospective research must measure actual score=100 frequency and rank compression before any claim that 90 vs 100 represents materially different quality.

## FD-039 — availability-dependent horizon switch

One component is defined as:
`revenueMoM ?? revenueQoQ`.

Therefore the same score slot changes economic horizon based on source availability:
- if monthly MoM exists, it scores monthly change;
- if monthly MoM is missing, it may score quarterly QoQ.

A frozen synthetic witness with identical other fields:
- monthly MoM = -20%, quarterly QoQ = +50% => component uses MoM and total example score = 35;
- monthly MoM missing, quarterly QoQ = +50% => same slot switches to QoQ and total example score = 45.

This is an availability-dependent semantic switch, not a stable single factor.

The switch may be operationally harmless if monthly MoM is always present for every eligible company/date, but that must be proven prospectively rather than assumed.

## FD-040 — current Shadow observability is insufficient for exact decomposition

Current research snapshot stores:
- fundamentalScore;
- revenueYoY / revenueMoM / revenueQuarterYoY / revenueQoQ / revenueYTDYoY;
- EPS / EPS YoY;
- gross margin / operating margin;
- valuation fields.

Repository audit finds no durable Shadow serialization of:
- grossMarginYoY;
- operatingMarginYoY;
- exact component-availability signature;
- pre-clamp fundamental score;
- theoretical available component maximum.

Because grossMarginYoY and operatingMarginYoY can contribute up to 10 combined points, the existing Shadow snapshot cannot always exactly reconstruct the Formal score from stored fields.

Therefore:
`FUNDAMENTAL_SCORE_COMPONENT_OBSERVABILITY = INCOMPLETE`.

Do not infer which component drove historical score differences when those fields were not captured.

## FD-041 — frozen structural-falsification artifact

Machine-readable artifact:
`research/fundamental_score_structural_falsification_v0_1.json`.

It freezes:
- exact current formula;
- full theoretical max 120;
- fixed missingness/saturation/horizon-switch synthetic witnesses;
- no outcome data;
- no alternative weights.

This prevents later outcome-driven rewriting of the problem statement.

## FD-042 — correct empirical order

Before any Class-C reformulation:

1. prospectively preserve exact score component values/availability and pre-clamp score;
2. measure availability signatures and score saturation by scan date / market / industry / size;
3. compare full score with grouped primitives:
   - revenue growth;
   - profitability level;
   - EPS level/change;
   - margin level/change;
4. control current price/RS/overheat/liquidity/sector/regime/valuation;
5. use scanDate as primary independent inference unit;
6. test whether score predicts path quality after controlling coverage signature;
7. if coverage signature explains apparent score advantage, classify current score as coverage-confounded;
8. if one component group carries the stable increment, do not preserve all weights by inertia;
9. only then may a Class-C reformulation candidate be surfaced for owner review.

No weight search is allowed before the existing formula is falsified.

## FD-043 — observability engineering boundary

The minimum useful prospective research extension would preserve, alongside each clean Shadow parent:
- all nine raw score inputs;
- component availability bitmask/signature;
- each component contribution;
- preClampFundamentalScore;
- fundamentalScore;
- availableWeightMax;
- scoreSaturated100;
- revenueChangeHorizonUsed = MONTHLY_MOM / QUARTERLY_QOQ / UNKNOWN;
- provenance / decisionImpact=false.

If implemented only by copying already-available in-memory fields into the research snapshot, with zero source calls and no Formal behavior change, it can be a Class-A candidate.

However V8.15 is currently occupied by the concurrent Valuation Provenance lane. Do not race the version lineage.

Current status:
`STRUCTURAL_FALSIFICATION_COMPLETE / OBSERVABILITY_GAP_CONFIRMED / ALPHA_UNKNOWN / NO_FORMAL_CHANGE`.

