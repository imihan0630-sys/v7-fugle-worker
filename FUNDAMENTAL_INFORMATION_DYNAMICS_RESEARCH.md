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
- https://doi.org/10.1016/j.frl.2026.107833 (verify exact DOI from source before engineering citation if needed)

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
