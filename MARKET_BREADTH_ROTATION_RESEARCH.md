# Market Breadth + Sector Rotation + Leadership Research
# 市場廣度＋族群輪動＋領導股結構

Started: 2026-09-25 Asia/Taipei
Status: ACTIVE RESEARCH LANE
Scope: Research-only / Shadow. Formal Core unchanged.

## Purpose

補足目前 K線、價量、Residual RS、ATR/Regime、微結構之外的「參與度與領導結構」知識。

核心問題：
1. 指數上漲時，是多數股票共同參與，還是少數權值股拉動？
2. 個股強勢時，整個產業是否同步擴散，還是只有一兩檔領頭？
3. 族群領導是否正在擴散、收斂、輪動或衰退？
4. 現有單日 sector breadth / sector score 是否提供了足夠資訊，或缺少時間維度與市場層對照？
5. 廣度是否真的有增量預測價值，還是只是一個好看的敘事指標？

## Existing-system boundary / redundancy audit

Current source already has `buildTodaySectorStats(rows, features)`:
- sector breadth = 當日上漲股票數 / 該產業股票數
- avgChange = 產業成分股平均漲跌
- amount / volume vs 20-day averages
- institutionalNetValueEstimate
- top 3 daily leaders
- a sector score using amount share, breadth and avgChange

Formal source also currently applies a sector-strength hard gate:
- breadth >= 40%
- avgChange >= -1%
- amountVs20DayAverage >= 0.5

Important data-semantics finding:
`normalizeMarketRow()` excludes:
- ETF / ETN / warrants / preferred shares / DR-like names
- close < MIN_CLOSE_PRICE (current system minimum = NT$10)

Therefore current sector breadth is **eligible-scan-universe breadth**, not whole-market breadth.

Do not duplicate this one-day field. New lane must add temporal / cross-sectional / leadership / market-vs-sector structure.

---

## BR-001 — Breadth means participation, not market direction

### Definition
Market breadth asks how widely a move is shared across securities.

Basic same-day quantities:
- Advancers A
- Decliners D
- Unchanged U
- Tradable comparison universe N
- Net breadth = A - D
- Advance share = A / (A+D)
- Advance-decline ratio = A / max(D,1)
- cumulative A/D line = prior A/D line + (A-D)

These describe participation. They are not intrinsically bullish/bearish trading rules.

### Positive evidence
A 2021 global study across 64 countries (1973–2018) reports that a portfolio-level breadth measure predicts future returns and that high-breadth portfolios outperform low-breadth portfolios after several controls.

Source:
- Economic Modelling 97 (2021), Herding for profits: Market breadth and the cross-section of global equity returns
- https://doi.org/10.1016/j.econmod.2020.04.006

### Strong counter-evidence
A broad 2014 review/test of 93 technical market indicators, including advance/decline-type measures, finds little robust return-predictive evidence after robustness, state-dependence and economic-significance tests.

Source:
- Journal of Behavioral and Experimental Finance 4 (2014), Technical market indicators: An overview
- https://doi.org/10.1016/j.jbef.2014.09.001

### Research conclusion
Breadth deserves study as a **state / confirmation / concentration variable**, not adoption as a standalone timing signal.

Status: WORTH_SHADOW_RESEARCH; predictive claim UNSET.

---

## BR-002 — Three different breadth universes must never be mixed

### Universe A — Official market breadth
Purpose: describe the actual exchange market.
TWSE official source provides:
- overall market and stocks
- up / limit-up / down / limit-down / unchanged / untraded / no-comparison

Official endpoint:
- TWSE OpenAPI `/opendata/twtazu_od`

TPEx provides daily total advancing/declining/flat/untraded counts through official after-trading statistics.

### Universe B — Common-stock research breadth
Purpose: cross-sectional academic-style study.
Possible exclusions:
- ETF/ETN/warrants
- preferred shares
- special non-common equity structures
But do NOT apply the strategy's price or liquidity thresholds unless explicitly studying eligible breadth.

### Universe C — Formal eligible-universe breadth
Purpose: answer “among stocks the system could actually consider, how broad is strength?”
This may legitimately use:
- price >= NT$10
- ordinary-stock constraints
- liquidity gates
But must be labeled `eligibleBreadth`, never `marketBreadth`.

### Why this matters
If low-price / illiquid stocks are excluded first, A/D statistics can change materially. A bullish-looking eligible breadth and weak full-market breadth can coexist.

Status: UNIVERSE SEMANTICS FROZEN.

---

## BR-003 — Breadth is more useful as a time series than a single-day percentage

Current source uses one-day sector breadth.

New research should examine:
- breadth_1D
- breadth_5D_mean
- breadth_10D_mean
- breadthSlope5D
- breadthAcceleration = recent slope - prior slope
- cumulative AD
- breadth persistence: consecutive days above/below its own baseline
- breadth expansion / contraction state

### State model
No thresholds frozen yet:
- BROAD_EXPANSION
- BROAD_STABLE
- NARROWING
- BROAD_WEAKNESS
- RECOVERY
- UNKNOWN

### Constructive mechanism
If price trend and participation both strengthen, trend continuation may have broader sponsorship.

### Counter-mechanism
Strong trends can remain narrow for long periods, especially cap-weighted indices. Breadth deterioration is not a mechanical sell signal.

Status: TIME-DIMENSION CANDIDATE.

---

## BR-004 — Price/breadth divergence is a concentration diagnosis first, reversal signal second

### Practitioner idea
A cap-weighted index can rise while many members fall. That is commonly called poor/narrow breadth.

### Research interpretation
If:
- index makes a new 20/60D high,
- but advance share / cumulative A/D / new-high participation fails to confirm,

first interpret this as:
**leadership concentration / participation divergence**.

Do NOT immediately label:
- top,
- crash warning,
- sell signal.

### Required decomposition
1. cap-weighted market return
2. equal-weight common-stock return
3. median stock return
4. advance share
5. top-10/top-20 contribution concentration if weights are available
6. large-cap vs rest participation

### Counter-evidence
The broad technical-indicator literature does not establish stable universal return prediction for A/D-style signals. Divergences can persist.

Status: DIAGNOSTIC HYPOTHESIS, not reversal rule.

---

## BR-005 — New-high / new-low breadth is a different dimension from daily A/D

Daily breadth asks:
“who rose today?”

New-high/new-low breadth asks:
“how many stocks are extending meaningful trends?”

Prospective/as-of-date candidate measures:
- pctNewHigh20 / pctNewLow20
- pctNewHigh60 / pctNewLow60
- pctNewHigh120 / pctNewLow120
- pctNewHigh252 / pctNewLow252 only when true 252-session point-in-time history exists
- netNewHigh20 = NH20 - NL20
- highLowBreadthRatio

### Positive interpretation
Index breakout + broad increase in new highs can represent widening leadership.

### Negative / falsification
- New highs are highly correlated with momentum and current Formal breakout features.
- 20D/60D variants may add little beyond existing ret20 / breakout / Residual RS.
- Corporate actions and stale history can create false highs/lows.
- Current B-130 stale-history discovery makes history freshness a mandatory prerequisite.

### Governance
Do not backfill 252D breadth if historical universe membership/history was not available as of that date.

Status: CANDIDATE WITH HIGH REDUNDANCY RISK.

---

## BR-006 — “Above moving average” breadth is cross-sectional trend participation, not another stock MA signal

Candidate measures:
- pctAboveMA20
- pctAboveMA60
- pctAboveMA120
- pctAboveMA20_and_MA20Rising
- pctBullStack5_10_20
- pctPositiveRet20

These aggregate individual states across a fixed point-in-time universe.

### Potential value
A stock's own MA structure can be identical on two dates while the surrounding market participation is very different.

### Redundancy risk
This can duplicate:
- price Regime
- broad index trend
- stock K-line/MA state
- Residual RS

Therefore any use must demonstrate incremental value after those controls.

Status: SHADOW CANDIDATE, NOT NEW FORMAL FACTOR.

---

## BR-007 — Industry momentum has strong historical evidence, but is not universal

### Positive evidence
Moskowitz & Grinblatt document strong industry momentum in U.S. equities; controlling for industry momentum substantially reduces individual-stock momentum profitability, while industry momentum remains strong after multiple controls.

Source:
- Journal of Finance 54(4), Do Industries Explain Momentum?
- https://doi.org/10.1111/0022-1082.00146

### Supporting mechanism
Individual winners can be riding an industry-wide information/flow process rather than purely firm-specific momentum.

### Counter-evidence / instability
Later research shows sector/industry time-series momentum can weaken materially in periods of high cross-industry correlation; one study finds strong 1990s predictability that disappears in the 2000s as sector correlations rise.

Source:
- International Review of Economics & Finance, Time-series momentum as an intra- and inter-industry effect
- https://doi.org/10.1016/j.iref.2013.03.001

### Taiwan implication
Do not transplant U.S. industry ranking thresholds.
Test Taiwan point-in-time sectors directly and condition on cross-sector correlation / market regime.

Status: HIGH-VALUE RESEARCH TOPIC.

---

## BR-008 — Sector rotation is not just “which sector rose most”

### Evidence
Beber, Brandt & Kavajecz find active sector order flow contains information beyond relative sector returns and is consistent with deliberate sector rotation related to macroeconomic expectations.

Source:
- Review of Financial Studies 24(11), What Does Equity Sector Orderflow Tell Us About the Economy?
- https://doi.org/10.1093/rfs/hhr067

### Important distinction
Price ranking:
- which sector has already performed best?

Rotation:
- is leadership moving from one sector to another?
- is participation expanding within the receiving sector?
- is the outgoing sector losing breadth/relative strength/flow simultaneously?

### Initial price-based rotation state
Without trustworthy historical sector orderflow:
- sectorRet5 / 20 / 60
- sectorResidualRet vs market
- sectorBreadth trend
- sectorPctAboveMA20/60
- sectorNewHigh share
- leadership count
- sector correlation to market
- change in rank over time

Do NOT call trade-value increase “capital inflow.” Current source already correctly labels trade amount as activity, not true net inflow.

Status: PRICE/PARTICIPATION ROTATION FIRST; TRUE ORDERFLOW LATER.

---

## BR-009 — Leadership breadth: distinguish one-star sector from broad sector leadership

Current source stores the top 3 daily leaders by percentage change. That is descriptive, but it does not measure concentration.

Candidate leadership measures:
- leaderCountTop10Pct = count of members in top market decile
- sectorTop1ContributionShare
- sectorTop3ContributionShare
- medianMemberReturn
- leaderMedianGap
- leaderBreadth = fraction of members outperforming market / sector benchmark
- pctMembersRSPositive
- pctMembersNewHigh20
- pctMembersAboveMA20
- leaderPersistence: prior leaders still leaders after 5/10 sessions
- leadershipRotation: new entrants into top-member set

### Interpretation
Strong sector, broad:
- top names strong + median member strong + breadth expanding.

Strong sector, narrow:
- top 1–3 names strong + median weak + breadth contracting.

### Hypothesis
Broad sector leadership may have better durability than a single-stock spike.

### Counter-hypothesis
Narrow leadership can be economically rational when one dominant firm captures most industry profit. Broadness is not inherently superior.

Status: HIGH-VALUE SHADOW CANDIDATE.

---

## BR-010 — Taiwan data feasibility and first research protocol

### Available official market breadth
TWSE:
- OpenAPI `/opendata/twtazu_od` gives daily up/down/limit/flat/untraded/no-comparison counts.
- MI_INDEX / official closing data provide stock-level closing data and index data.

TPEx:
- official after-trading market highlight publishes up/down/limit/flat/untraded counts.
- official dailyQuotes supports stock-level reconstruction.

### Existing repository assets
Already available:
- TWSE + TPEx daily stock rows
- official index comparison
- industry labels (with `未分類` coverage issue)
- 20/60D histories where freshness is valid
- existing sector single-day breadth/avgChange/activity
- per-stock ret20, sector peer return, Residual RS research layer

### Critical current limitation
Formal normalized rows remove <NT$10 stocks before sector breadth is computed. Therefore do not reuse that value as whole-market breadth.

### First prospective feature set
Market layer:
1. officialTwseAdvanceShare
2. officialTpexAdvanceShare
3. commonStockAdvanceShare
4. eligibleAdvanceShare
5. equalWeightReturn
6. medianStockReturn
7. pctAboveMA20 / MA60
8. pctNewHigh20 / NewLow20
9. breadthSlope5D
10. marketLeadershipConcentration

Sector layer:
11. sectorBreadth1D / 5D
12. sectorPctAboveMA20 / MA60
13. sectorNewHigh20Share
14. sectorRet5 / 20 / 60
15. sectorResidualReturn
16. sectorRankChange5D
17. sectorLeaderConcentration
18. sectorLeaderPersistence
19. sectorMemberCoverage
20. sectorClassificationUnknownRate

### Pre-registered hypotheses
H1. Individual breakout follow-through is stronger when sector breadth is expanding, after controlling for existing sector one-day gate and Residual RS.
H2. Sector return strength with contracting member breadth has lower subsequent persistence than sector return strength with expanding breadth.
H3. Index strength with weak equal-weight/median/breadth participation represents concentration; test whether it predicts lower future market participation, not automatically negative index return.
H4. Sector-rank acceleration/rotation adds information beyond current sector score.
H5. Leadership concentration has a nonlinear effect: extreme concentration may be fragile, but some concentration may reflect genuine leader quality.

### Counter-hypotheses
- Breadth adds no incremental value beyond current trend/RS/volume/sector gate.
- Breadth predicts dispersion/participation but not return direction.
- Industry momentum is regime/correlation dependent.
- Broad participation can occur late in a cycle and signal indiscriminate chasing rather than healthy early trend.
- Universe changes and classification quality can dominate the measured signal.

### Primary outcomes
Market:
- D1/D3/D5/D10 equal-weight and cap-weight return
- dispersion
- next-period breadth change
- drawdown/MFE/MAE

Sector/stock:
- D1/D3/D5/D10
- MFE/MAE
- breakout failure
- sector rank persistence
- leader retention
- selected vs near-miss incremental effect

### Bias controls
- freeze universe definition per metric;
- point-in-time membership where possible;
- TWSE/TPEx shown separately before combined;
- no current constituents backfilled historically;
- no stale history;
- `未分類` explicitly reported, not silently assigned;
- corporate action guards;
- date clustering / leave-one-date-out;
- multiple-testing ledger;
- no outcome-tuned breadth thresholds.

Status: FIRST PROTOCOL FROZEN. Formal Core unchanged.


---

## BR-011 — Breadth thrust: research the acceleration, not a folklore threshold

“Breadth thrust” is a practitioner concept: participation shifts from very weak to very strong over a short interval.

### Research translation
Do not begin from a named indicator's fixed threshold.

Represent:
- breadthLevel
- breadthSlope
- breadthAcceleration
- pctAdvancing5D
- pctAboveMA20 change
- newHighShare change
- sectorParticipationCount change

Candidate event:
`BREADTH_ACCELERATION_EVENT` = unusually rapid participation expansion relative to the same market's own history.

### Why not adopt a named threshold now
Current literature search finds mixed evidence for broad technical market indicators and substantial data-snooping risk. A fixed “thrust” threshold selected because it worked historically would add another Factor-Zoo branch.

### Positive mechanism
Rapid participation expansion after a washed-out period may represent broad demand returning rather than one-index-leader rebound.

### Counter-mechanism
A breadth surge can occur during:
- short covering,
- indiscriminate relief rallies,
- late-cycle speculative broadening,
and need not imply durable trend.

Status: CONCEPT WORTH TESTING; NO FOLKLORE THRESHOLD ADOPTED.

---

## BR-012 — Breadth deterioration near market peaks has a timing problem

### Practitioner evidence
Breadth divergences are widely used as cautionary diagnostics: an index can make new highs while fewer stocks confirm.

### Core statistical problem
A divergence can begin long before price turns.
Therefore “divergence existed before a top” does not establish useful timing.

Required measurements:
- divergenceStartDate
- daysFromDivergenceToPeak
- maxFurtherIndexGainAfterDivergence
- maxDrawdownBeforePeak
- falseAlarmDuration
- whether breadth later re-confirms before any material decline

### Null / counterexample
Index can continue rising for weeks/months under narrow leadership.
A divergence may predict future cross-sectional dispersion rather than negative index return.

### Research outcome hierarchy
1. participation change
2. dispersion / equal-weight relative performance
3. volatility / drawdown risk
4. only then aggregate index return

This avoids forcing breadth into a directional market-timing story it may not support.

Status: DIVERGENCE DURATION / FALSE-ALARM PROTOCOL FROZEN.

---

## BR-013 — Cross-sector correlation controls whether “rotation” is even meaningful

### Evidence
Industry/sector momentum evidence is regime dependent. Research on intra/inter-industry time-series momentum finds strong sector-level predictability in the 1990s but not the 2000s, coincident with a sustained rise in correlations across sectors.

### Proposed rotation-environment variables
- medianPairwiseSectorCorr20
- medianPairwiseSectorCorr60
- sectorReturnDispersion5 / 20
- fractionSectorsPositive5 / 20
- topBottomSectorSpread5 / 20
- rankTurnover5D

### Interpretation
Low/moderate correlation + high dispersion:
- more room for genuine relative sector leadership/rotation.

Very high correlation + low dispersion:
- “sector rotation” may just be market beta moving everything together.

### Counterpoint
High correlation does not eliminate all sector information; relative returns can still matter. Correlation is a conditioning state, not a hard reject.

Status: HIGH-VALUE ROTATION REGIME CANDIDATE.

---

## BR-014 — Leadership diffusion lifecycle

Instead of static “top 3 leaders,” track how leadership spreads through members.

### Proposed lifecycle
1. LEADER_ONLY
   - one/few leaders outperform
   - median member weak
   - breadth low

2. EARLY_DIFFUSION
   - leaders remain strong
   - median improves
   - breadth / pctAboveMA rises

3. BROAD_PARTICIPATION
   - many members positive / above trend
   - leader concentration declines without collapse

4. LATE_BROADENING
   - breadth very high
   - weaker members surge
   - leaders may stop improving
   - requires overheat/valuation/volume controls

5. NARROWING
   - sector price/leader remains strong
   - median/breadth/new highs roll over

6. LEADERSHIP_BREAK
   - leaders lose RS / sector rank falls

### Why nonlinear
“Broader is always better” is too simple.
Early diffusion may be constructive; indiscriminate late broadening can be a maturity/exhaustion state.

### Required context
- sector return age / duration
- overheat
- volume state
- market Regime
- sector correlation environment

Status: LIFECYCLE HYPOTHESIS.

---

## BR-015 — Current sector hard gate may discard context; research it without changing it

Current Formal logic rejects a sector if:
- breadth < 40%, or
- avgChange < -1%, or
- amountVs20DayAverage < 0.5.

This is production truth, not evidence that those exact cutoffs are optimal.

### Research questions
1. Are rejected-by-sector-gate Near-miss stocks systematically worse at D1/D3/D5?
2. Which component is doing useful work?
3. Does one-day breadth <40% remain informative after:
   - sector 5D/20D breadth trend,
   - Residual RS,
   - market Regime,
   - sector correlation,
   - stock setup quality?
4. Are there high-quality early rotation cases where one-day breadth is temporarily weak but breadth acceleration is positive?
5. Does the activity threshold mostly duplicate stock/sector volume features?

### Important boundary
No threshold sweep to find a prettier 37%, 43%, etc.
First test the **current frozen thresholds** against prospective cohorts.
Alternative definitions become separately preregistered experiments only after the current gate is understood.

Status: FORMAL-GATE AUDIT PROPOSED, RESEARCH ONLY.

---

## BR-016 — Point-in-time universe is the hardest breadth data problem

### Survivorship risk
Reconstructing old breadth from today's listed stocks:
- excludes delisted firms,
- may include firms not yet listed at the historical date,
- changes the denominator,
- can bias new-high / MA / A-D measures.

### Industry reclassification risk
Current repository history bars preserve price/volume, but do not preserve a historical industry classification on every bar.
Current enrichment/profile industry may overwrite the stock's present state.

Therefore:
- current industry label must not be blindly applied backward to dates before a reclassification;
- historical sector breadth reconstructed with current classifications is not strictly point-in-time.

### Listings / IPOs
New stocks lack 20/60/120/252 sessions.
They must be:
- excluded only from metrics requiring unavailable history,
- still counted appropriately in official A/D if the exchange counts them,
- accompanied by denominator/coverage fields.

### Delisting / suspension
Do not carry stale last prices forward as unchanged active members.

### Recommended data architecture
For every research date store:
- universeDefinition
- market
- symbol
- eligibility flags
- industryCode/name as known that date
- listing/history-age flags
- comparison eligibility
- source/provenance

Status: POINT-IN-TIME MEMBERSHIP REQUIRED FOR HISTORICAL CLAIMS.

---

## BR-017 — Redundancy map against existing system

| New breadth/rotation concept | Existing nearest feature | Incremental question |
|---|---|---|
| official market advance share | market index return / Regime | participation behind index |
| eligible advance share | one-day sector breadth | market-wide eligible participation |
| breadth slope/acceleration | one-day breadth | time evolution |
| pctAboveMA20/60 | individual MA/K-line | cross-sectional participation |
| new-high share | breakout/ret20 | breadth of trend extension |
| sectorRet20 | current sector peer return | already partly present; reuse |
| sector rank change | sector score / sector return | rotation velocity |
| sector breadth trend | one-day sector breadth | persistence/diffusion |
| leader concentration | top-3 leaders | concentration vs distribution |
| leader persistence | current leaders | durability |
| cross-sector correlation | Regime | whether rotation is distinct from market beta |
| equal-weight vs cap-weight gap | TWSE index return | concentration of index leadership |

### Kill rules
Remove/deprioritize a feature if:
- correlation/redundancy with existing state is high,
- conditional/incremental effect is unstable,
- effect vanishes out-of-sample or by date clustering,
- only one threshold/window works,
- classification/universe coverage is poor.

Status: REDUNDANCY GATE FROZEN.

---

## BR-018 — Zero-code feasibility audit: what can be learned now versus prospectively

### Can be studied now with official current/as-of-date data
- official TWSE same-day A/D state
- official TPEx same-day A/D state
- current eligible-universe breadth
- current sector breadth
- current equal-weight / median stock return from complete daily rows
- current sector dispersion / rank
- current leader concentration if full current rows are available

### Historical inference blocked or qualified
1. Whole-market A/D:
   - possible only if dated official historical endpoints / archives are fetched and coverage verified.
2. pctAboveMA / new-high breadth:
   - current D1 histories have known freshness issue (B-130/B-131) pending repair/revalidation.
3. Historical sector breadth/rotation:
   - current bars do not retain point-in-time industry classification, creating classification look-back risk.
4. Historical universe:
   - current active-stock reconstruction creates survivorship/listing bias unless dated membership is recovered.
5. Existing sector breadth:
   - uses filtered >=NT$10 scan rows, so it is not whole-market evidence.

### Prospective low-risk route
Without touching Formal decisions:
- compute/store one research snapshot per completed scan date,
- snapshot both official-market and eligible-universe definitions,
- freeze industry classification/provenance on that date,
- persist denominators and UNKNOWN/coverage,
- then accumulate independent dates.

This is conceptually Class A only if implemented downstream and decisionImpact=false; using shared scan/runtime storage may still require Class-B engineering review under current governance.

### Conclusion
Do not force a historical breadth backtest from contaminated universes.
Prospective snapshots are more scientifically defensible.

Status: HISTORICAL CLAIMS DATA-QUALITY-LIMITED; PROSPECTIVE SNAPSHOT PREFERRED.

---

## Second synthesis — what this lane adds beyond current sector score

Current system already asks:
“Is this sector weak today?”

The new lane asks:
- Is participation widening or narrowing over time?
- Is index strength broad or concentrated?
- Is a sector entering, maturing in, or exiting leadership?
- Is the leader set diffusing to members or becoming more concentrated?
- Is apparent sector rotation genuine relative movement or merely high market-wide correlation?
- Does breadth add anything after existing K-line, price-volume, Residual RS, Regime and current sector gate?

This is materially different from adding another one-day sector score.

## Exact next continuation after BR-018

BR-019: Define market/equal-weight/median concentration gap precisely for TWSE+TPEx.
BR-020: Define sector rank-transition matrix and rotation velocity without arbitrary “top N” dependence.
BR-021: Study persistence vs reversal of industry momentum by horizon; short/medium/long horizon separation.
BR-022: Study sector breadth + stock RS interaction (strong stock in weak sector vs average stock in strong sector).
BR-023: Study leader concentration mathematically (HHI / contribution share / effective number of leaders).
BR-024: Define prospective breadth snapshot schema and evidence-readiness gates.
BR-025: Decide whether breadth concepts are complete enough to move to evidence accumulation, then open next untouched lane.


---

## BR-019 — Concentration gap: cap-weighted index versus the “typical stock”

A cap-weighted index can be strong even when the median stock is weak.

### Minimum concentration panel
For each market/date:
- capWeightedReturn = official index return
- equalWeightReturn = mean common-stock return
- medianStockReturn
- advanceShare
- p25 / p75 return
- crossSectionalDispersion
- capVsEqualGap = capWeightedReturn - equalWeightReturn
- capVsMedianGap = capWeightedReturn - medianStockReturn

### Interpretation
Positive large gap:
- large-cap / high-weight leadership dominates.

Near-zero gap:
- index and typical member move similarly.

Negative gap:
- smaller/equal-weight members outperform index leadership.

### Important caveat
Equal weighting creates size exposure. A cap-vs-equal gap is a concentration diagnostic, not pure “health.”

Research on equal-weight versus cap-weight indices shows long-run and short-run results can differ materially, and concentration can influence relative performance.

### Taiwan design
Keep TWSE and TPEx separate:
- TWSE official cap-weighted index has strong large-cap influence.
- TPEx has different constituent/liquidity composition.

Combined breadth may be shown only after market-specific components and denominators are preserved.

Status: CONCENTRATION PANEL FROZEN.

---

## BR-020 — Sector rank transition should measure movement, not only Top-N membership

“Top 5 sector today” loses information:
- rank 1 -> 2 and rank 1 -> 15 are both technically “changed.”
- rank 6 -> 5 creates a Top5 entry despite tiny movement.

### Proposed continuous variables
For each sector:
- rankRet5_t / rankRet20_t
- deltaRank1D
- deltaRank5D
- percentileRank_t
- deltaPercentileRank
- relativeReturnAcceleration
- breadthRank
- breadthRankChange
- compositeRotationVector = changes in return rank + breadth rank + RS state

### Transition labels
No arbitrary Top5 dependence:
- RISING_LEADERSHIP
- STABLE_LEADER
- FALLING_LEADER
- EARLY_IMPROVER
- STABLE_MIDDLE
- DETERIORATING
- RECOVERING_LAGGARD
- UNKNOWN

### Rotation velocity
Possible research measure:
`rotationVelocity = |percentileRank_t - percentileRank_t-5|`

But direction must be retained; magnitude alone treats rise/fall equally.

### Counterpoint
Fast rank change can be noisy mean reversion, not meaningful rotation.
Require persistence and member breadth confirmation.

Status: CONTINUOUS RANK-TRANSITION SPEC FROZEN.

---

## BR-021 — Industry momentum has multiple horizons; do not collapse them

A recent literature review notes that industry momentum evidence exists at different formation horizons and that 1-month and 6/12-month forms can be weakly correlated, suggesting different mechanisms.

Source:
- Financial Markets and Portfolio Management (2022), Momentum: what do we know 30 years after Jegadeesh and Titman’s seminal paper?
- https://doi.org/10.1007/s11408-022-00417-8

### Research horizons
Keep separate:
- short rotation: 5D / 20D
- intermediate: 60D / 120D
- longer: ~252D only after sufficient point-in-time history

Do not average them into one “sector momentum” score.

### Important counter-evidence
Industry momentum is not universal across markets/samples.
A Latin America study reports no robust industry momentum after idiosyncratic-return controls and multiple-hypothesis considerations.

Source:
- Journal of Business Research, Industry momentum in Latin America
- https://doi.org/10.1016/j.jbusres.2023.113715

Industry-classification choice itself can materially alter momentum results.

Source:
- Research in International Business and Finance (2022), Industry classification, industry momentum and short-term reversal.

### Taiwan implication
Industry definition is part of the experiment.
Do not silently switch/merge industry taxonomies after seeing results.

Status: MULTI-HORIZON + CLASSIFICATION-SENSITIVE DESIGN FROZEN.

---

## BR-022 — Stock RS × sector state: four distinct cases

A stock-level signal should be interpreted jointly with sector participation.

### 2x2 conceptual matrix

1. STOCK_STRONG + SECTOR_STRONG
   - stock RS positive
   - sector breadth/RS improving
   Hypothesis: broad sponsorship / continuation candidate.

2. STOCK_STRONG + SECTOR_WEAK
   - idiosyncratic leader
   Hypothesis A: exceptional stock, valuable independence.
   Hypothesis B: lonely leader vulnerable to mean reversion.
   Must test, not assume.

3. STOCK_WEAK + SECTOR_STRONG
   - potential laggard / catch-up
   Hypothesis A: rotation candidate.
   Hypothesis B: stock-specific weakness for a reason.

4. STOCK_WEAK + SECTOR_WEAK
   - weakest context, but could be washed-out reversal candidate.

### Why useful
Current Residual RS tells whether the stock outperforms market/sector.
Current sector gate tells whether sector is weak today.
What is missing is the **interaction and its future path**.

### Pre-registered comparison
Within same scan date / setup family:
- compare future D1/D3/D5/MFE/MAE by 2x2 state;
- control for A/B pattern, price-volume, ATR, liquidity, institutions, overheat.

Do not promote “stock strong + sector strong” as winner before evidence.

Status: INTERACTION STUDY FROZEN.

---

## BR-023 — Leadership concentration needs a mathematical measure

Top-3 names alone cannot distinguish:
- three similarly strong leaders,
- one giant leader + two irrelevant names.

### Candidate measures

#### Contribution HHI
If contribution weights `w_i` sum to 1:
`HHI = sum(w_i^2)`

Effective number of leaders:
`N_eff = 1 / HHI`

Possible contribution bases:
- positive return contribution to sector equal-weight move;
- positive traded-value-weighted return contribution;
- market-cap contribution only if point-in-time cap weights are valid.

#### Simpler robust measures
- top1PositiveContributionShare
- top3PositiveContributionShare
- top3ReturnMinusMedian
- fractionMembersOutperformSector
- fractionMembersOutperformMarket

### Guard
If sector aggregate return is <=0 or positive contribution denominator is near zero, contribution HHI can become unstable/meaningless.
Return UNKNOWN / use membership concentration instead of forcing a value.

### Interpretation
High HHI:
- narrow leadership.

Low HHI:
- distributed leadership.

No monotonic bullish/bearish assumption.

Status: LEADERSHIP CONCENTRATION SPEC FROZEN.

---

## BR-024 — Prospective breadth snapshot schema

A daily research-only snapshot should freeze the information set as known that day.

### Header
- scanDate
- capturedAt
- schemaVersion
- sourceVersions
- pointInTimeEligible
- dataQualityState

### Market breadth by market
For TWSE / TPEx separately:
- officialAdvancers
- officialDecliners
- officialUnchanged
- officialUntraded
- officialNoComparison
- officialAdvanceShare
- commonStockCount
- commonStockAdvanceShare
- eligibleCount
- eligibleAdvanceShare
- equalWeightReturn
- medianReturn
- capWeightedReturn
- capVsEqualGap
- capVsMedianGap
- dispersion

### Cross-sectional trend participation
Coverage required:
- ma20EligibleCount
- pctAboveMA20
- ma60EligibleCount
- pctAboveMA60
- newHigh20EligibleCount
- pctNewHigh20
- newLow20EligibleCount
- pctNewLow20

### Sector rows
For each frozen industry identity:
- industryCode
- industryName
- memberCount
- historyCoverage20 / 60
- breadth1D
- breadth5D only when prospective history exists
- pctAboveMA20/60
- pctNewHigh20
- equalWeightRet5/20/60
- residualReturn vs market
- returnRankPercentile
- rankChange5D
- leaderHHI / effectiveLeaders
- top1/top3 contribution share
- medianMemberReturn
- unknownClassificationCount

### Coverage / semantics
Never omit:
- universeDefinition
- excludedCountsByReason
- staleHistoryCount
- unknownIndustryCount
- marketSourceStatus

Status: SNAPSHOT CONTRACT FROZEN.

---

## BR-025 — Evidence-readiness gates and concept-lane convergence

### Market-level breadth readiness
DESCRIPTIVE_READY when:
- official TWSE/TPEx same-day counts verified,
- market denominators explicit.

PROSPECTIVE_TREND_READY when:
- >=20 independent completed trading dates with consistent universe/schema.

INFERENTIAL_ACCUMULATING:
- enough independent dates for preregistered D1/D3/D5 analysis but below project maturity gates.

### Sector rotation readiness
Blocked if:
- industry unknown rate materially high,
- point-in-time industry identity not frozen,
- stale daily histories present,
- sector has insufficient member/history coverage.

### Promotion gate
Even statistically promising breadth findings remain Shadow research until they pass:
- current project prospective sample/maturity rules,
- date-cluster robustness,
- redundancy,
- transaction-cost relevance where trading implications exist,
- multiple-testing controls,
- owner approval for any Formal change.

### Concept status
The breadth/rotation lane now has:
- universe semantics,
- positive and negative academic evidence,
- Taiwan source feasibility,
- time-series breadth,
- divergence/concentration,
- new-high/MA participation,
- industry momentum,
- rotation velocity,
- leadership diffusion/concentration,
- stock×sector interaction,
- point-in-time data-quality controls,
- prospective schema/readiness gates.

Further indicator invention should pause until prospective evidence begins.

Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.

## Exact next continuation after BR-025

Open the next genuinely under-studied lane rather than creating more breadth variants.

Candidate next lane priority:
1. **Fundamental information dynamics / earnings & revenue surprise / post-announcement drift**
2. **Derivatives information: futures/options positioning, volatility/skew, basis**
3. **Behavioral / attention / sentiment micro-signals beyond existing Quiet/Attention research**
4. **Risk/portfolio construction beyond fixed position caps: correlation, marginal risk, drawdown clustering**

Recommended next: Fundamental Information Dynamics, because current system uses fundamental quality but has not deeply separated **level, change, surprise, revision, and price reaction**.


---

## BR-026 — Sector-gate provenance capture deployed; evidence accumulation begins

### Why this step was necessary
The first empirical task is to falsify the **existing** sector hard gate before inventing new breadth thresholds.

A source audit found two missing pieces:
1. `researchMarketContext.advancePct` came from Formal-normalized daily rows, not official whole-market breadth.
2. Existing Shadow rows did not retain the exact hard-gate inputs:
   - sector breadth;
   - sector average change;
   - sector amount versus 20-day average.

Therefore prior Shadow data cannot support a clean causal claim about whether the 40% / -1% / 0.5 gate helps or hurts.

### V8.14 prospective provenance
Runtime: `8.14.0-sector-gate-provenance-shadow`.

Every prospective Shadow snapshot now stores:
- exact gate input values;
- each frozen gate check;
- combined gate result with UNKNOWN preserved;
- exact threshold/version identity;
- point-in-time provenance;
- A/B technical pass/missing state.

The market-context snapshot also labels the actual universe:
`TWSE_TPEX_COMBINED_FORMAL_NORMALIZED`.

It explicitly states:
`officialWholeMarketBreadth=false`.

### New bounded counterevidence cohort
`SECTOR_GATE_REJECTED` captures candidates whose exact current Formal rejection reason is:
`產業廣度、漲幅或資金活躍度偏弱`.

Sampling is bounded to 6 per pool per scan and deterministically ordered by A/B technical closeness.

This design can support paired falsification, but **cannot** support:
- exhaustive rejected-universe counts;
- market-wide opportunity-loss totals;
- claims that a recorded rejected row would otherwise have passed full Formal RR/basic/fundamental checks after the gate.

The snapshot explicitly records:
`fullFormalCounterfactual=false`.

### Frozen hypotheses
H0 / counter-hypothesis:
The current one-day sector hard gate adds little incremental information after stock setup, Price-Volume, sector RS and market regime, or it excludes useful early-rotation setups.

H1 / positive hypothesis:
The current gate removes fragile setups and improves follow-through / downside characteristics after those controls.

No direction is preferred.

### Frozen first descriptive analysis
Minimum:
- >=20 clean independent scan dates;
- only post-V8.14 PIT rows;
- mature D1/D3/D5 outcomes.

Compare:
- current gate-pass context;
- bounded `SECTOR_GATE_REJECTED`.

Outcomes:
- D1/D3/D5 return;
- MFE;
- MAE;
- false-breakout / stop-risk where observable.

Controls / strata:
- scan date;
- A vs B technical readiness;
- sector RS;
- setup quality;
- Price-Volume state;
- market regime;
- which exact gate component failed.

Robustness:
- date-cluster inference;
- leave-one-date-out;
- no threshold sweep;
- no current-industry backfill for historical claims;
- costs only when translating evidence into a trading counterfactual.

### Promotion boundary
Even a descriptive difference after 20 dates is **not** enough to alter the 40% / -1% / 0.5 gate.

Any future Formal change still requires:
- positive + counterevidence;
- incremental value after redundancy controls;
- independent-date / regime robustness;
- coverage and zero-pick impact;
- transaction-cost relevance where applicable;
- anti-overfit / holdout;
- owner approval.

Status: `WAITING_PROSPECTIVE / NOT_OPTIMIZATION_READY`.

Formal Core unchanged.


## BR-027 — Industry classification vintage is a PIT variable, not static metadata

### Why this matters
Industry / sector membership is not timeless metadata. Taiwan Stock Exchange classification rules permit periodic and special reclassification, so any historical Sector RS（產業相對強弱）, breadth, rotation or leadership study that assigns today's industry label backward creates a classification look-ahead（分類偷看未來） risk.

Official Taiwan evidence establishes that the classification itself has an effective-date lifecycle:
- TWSE currently maintains an industry-classification framework and regularly reviews classification using recent annual-report business composition, with special adjustment when business changes materially.
- The review convention has changed historically; after IFRS-era rule changes, regular review moved to an annual cadence.
- A concrete 2023 adjustment moved 47 listed companies into new/changed industry categories with a specified effective date, proving that historical membership can differ materially from current membership.

External research also shows that industry-momentum / reversal results are classification-sensitive. A classification scheme that is too coarse or silently changes can alter measured industry returns and apparent persistence.

### PIT contract
For every sector/industry observation at decision time t, preserve:
- classificationSchemeId / version;
- industryCode / industryName as known at t;
- membershipEffectiveFrom / membershipEffectiveTo;
- sourcePublishedAt / knownAt;
- reclassification reason when available;
- UNKNOWN when historical membership cannot be reconstructed.

Forbidden:
- backfilling current industry labels onto older dates;
- merging old/new taxonomies after seeing returns;
- treating a current label as proof of historical membership.

### Maturity implication
Taiwan official effective-dated reclassification evidence is sufficient to establish D09-01 PIT feasibility prospectively and for bounded historical dates where official notices exist. It is NOT sufficient to claim complete machine-readable historical membership coverage.

Status: `D09-01 -> L3 PIT_FEASIBLE_BOUNDED / COMPLETE_HISTORY_UNKNOWN`.

---

## BR-028 — Sector RS needs participation and physical-cycle confirmation

### Core falsification
Sector RS（產業相對強弱） is a price-relative state, not a guaranteed fundamental-cycle signal.

Evidence is intentionally mixed:
- Classic industry-momentum research finds industry-level return continuation can explain a substantial part of stock momentum.
- Customer-supplier research documents delayed information transmission across verified economic links.
- Taiwan-specific evidence also reports significant industry reversal at short horizons, which directly rejects a universal rule that stronger recent industry return must imply better forward return.
- More recent work separates short-horizon residual industry momentum / lead-lag from factor momentum, reinforcing that mechanism and horizon matter.

Therefore the research question is not "Is sector RS high?" but:
1. is strength broad or leader-concentrated?
2. is the sector rank transition persistent or one-day noise?
3. does physical demand / sales / inventory confirm the price move?
4. is supply response (capacity / capex) supportive or becoming oversupply?
5. can raw-material cost be passed through without margin damage?
6. does the individual company have a verified earnings-transmission path?

### Concentration firewall
A cap-weighted industry or index can be dominated by a few mega-cap firms. Taiwan's semiconductor sector represented more than half of listed-market capitalization in the 2025 TWSE Fact Book, a structural example of why cap-weight strength cannot be equated with broad member participation.

Always preserve separately:
- cap-weight return;
- equal-weight / median member return when feasible;
- advancing-member ratio / Above-MA participation;
- leader contribution share / HHI / effective leader count;
- stock-count denominator and UNKNOWN coverage.

### Integrated state, not a new weighted score
Do not immediately create another scalar "industry score". First preserve orthogonal state dimensions:
- PRICE_CONFIRMATION: sector RS / residual RS / rank persistence;
- PARTICIPATION: breadth / Above-MA / leader concentration;
- PHYSICAL_CYCLE: production / sales / inventory state;
- SUPPLY_RESPONSE: capacity / capex / utilization when explicitly sourced;
- PRICING_TRANSMISSION: raw-material / selling-price / margin pass-through;
- COMPANY_TRANSMISSION: verified exposure and earnings sensitivity.

Candidate state examples for Shadow research:
- PRICE_ONLY;
- PRICE_PLUS_PHYSICAL_CONFIRMATION;
- PHYSICAL_EARLY_PRICE_NOT_CONFIRMED;
- LEADER_ONLY_CONCENTRATION;
- CAPACITY_OVERSHOOT_RISK;
- COST_SQUEEZE;
- BULLWHIP_RISK;
- UNKNOWN.

No state has a permanently bullish/bearish meaning before prospective evidence.

### System 1 / System 2 relationship
System 1 already uses same-day sector breadth, average change, amount activity, a hard gate and a sector score. This research must test incremental value AFTER those fields plus stock trend / Residual RS / price-volume / regime controls; otherwise it is REDUNDANT.

System 2's OWNER_APPROVED INDUSTRY_TREND contract explicitly requires `IND.CYCLE_STAGE`, `IND.SUPPLY_DEMAND`, `IND.INVENTORY`, `IND.CAPACITY`, `IND.PRICING`, and `IND.COMPANY_TRANSMISSION`, while current readiness is SOURCE_EXTENSION_REQUIRED. The integrated state above is therefore a direct research bridge to the missing Industry Thesis evidence family, without changing any formal score or threshold.

Status: `HIGH_VALUE_RESEARCH_BRIDGE / NOT_OPTIMIZATION_READY / PROSPECTIVE_EVIDENCE_REQUIRED`.

### External evidence anchors
- Moskowitz & Grinblatt (1999), *Do Industries Explain Momentum?*, Journal of Finance.
- Cohen & Frazzini (2008), *Economic Links and Predictable Returns*, Journal of Finance.
- Liu & Fu (2011), Taiwan weekly industry momentum/reversal evidence.
- Li (2022), *Industry classification, industry momentum and short-term reversal*, Finance Research Letters.
- TWSE industry-classification rules and effective-dated reclassification notices.
- TWSE Fact Book 2026 (2025 market-cap distribution by industry).



## BR-029 — Formal industry, statistical industry and theme are three different taxonomies

### Finding
Three classification layers must not be conflated:

1. **TWSE/TPEx issuer industry** — an exchange classification used for listed-company grouping. TWSE rules reference official statistical industry concepts but classify issuers using company business / revenue composition and additional financial/business evidence. Classification is reviewed periodically and can be changed.
2. **MOEA/DGBAS statistical industry/product code** — an economic-activity taxonomy used for production / sales / inventory statistics, with detailed manufacturing codes such as 2611 integrated-circuit manufacturing, 2613 semiconductor packaging/testing and 2630 printed-circuit-board manufacturing.
3. **Investment theme / supply-chain group** — AI server, CPO, ABF, advanced packaging, cooling, power, robotics, etc. These themes can span multiple formal exchange and statistical industries and can change with product/customer exposure.

A direct one-to-one mapping among the three is therefore structurally invalid.

### Evidence-backed bridge contract
Use an effective-dated many-to-many bridge:

`INDUSTRY_EXPOSURE_VINTAGE`
- issuerMarket / issuerSymbol;
- twseTpexIndustryCode / label / classificationSchemeId;
- statisticalIndustryCode(s);
- themeId(s);
- exposureType = REVENUE / PRODUCT / CUSTOMER / CAPACITY / MATERIAL / MANAGEMENT_DISCLOSURE / VERIFIED_SUPPLY_CHAIN_EDGE / OTHER;
- exposureMagnitudePct and basis when actually disclosed;
- sourcePublishedAt / knownAt;
- effectiveFrom / effectiveTo;
- evidenceSourceId / sourceClass;
- confidence = HIGH / MEDIUM / LOW / UNKNOWN;
- identityResolution;
- revision / supersession reference.

### Falsification rules
- formal sector membership alone cannot prove theme exposure;
- a theme list from media / market convention cannot prove economic exposure;
- product capability does not prove current order/revenue contribution;
- one old customer relationship cannot be carried forward indefinitely;
- a current revenue mix cannot be backfilled before its disclosure date;
- if multiple statistical industries map to one issuer, preserve the vector rather than force one code;
- if no contemporaneous exposure evidence exists, theme membership = UNKNOWN.

### D09-11 maturity decision
The distinction, many-to-many schema and falsification rules are now defined.

`D09-11 題材股與正式產業分類橋接: L1 -> L2`.

No claim is made yet that a complete PIT exposure database exists.

Status: `MECHANISM_PLUS_FALSIFICATION_DEFINED / PIT_EXPOSURE_DATA_PENDING`.


## BR-030P — Leader-only versus broad participation preregistration before the first valid cohort

### Evidence clock
The deployed V8.14 sector-gate provenance collector states that the first expected clean post-deploy cohort is 2026-09-29, conditional on history/source admission. Today is 2026-09-28. Therefore no forward-return comparison is authorized yet.

This is a preregistration step only. BR-030 outcome status remains `WAITING_PROSPECTIVE`.

### Existing source audit
Current `buildTodaySectorStats()` already has, at decision time:
- member-level industry labels;
- member one-day changePercent;
- member tradeValue;
- sector stockCount;
- sector breadth;
- sector average change;
- sector amount and amountVs20DayAverage;
- top-3 return leaders.

The current sector score is:
`amount / maxSectorAmount * 45 + breadth * 0.3 + transformed avgChange`.

This means same-day sector strength already mixes activity, participation and average return, but it does NOT quantify whether activity/return leadership is concentrated in one or a few names.

### Concentration descriptors to freeze prospectively
Do not create a buy/sell threshold. Preserve continuous descriptors first:

1. `top1AmountShare` = largest member tradeValue / sector tradeValue.
2. `top3AmountShare` = three largest member tradeValues / sector tradeValue.
3. `amountHHI` = sum of squared member tradeValue shares.
4. `effectiveActiveNames` = 1 / amountHHI when denominator is valid.
5. `effectiveActiveNameRatio` = effectiveActiveNames / stockCount.
6. `returnLeaderGap1` = top-1 return minus sector median return.
7. `returnLeaderGap3` = mean(top-3 returns) minus sector median return.
8. `breadthExTop1` and `breadthExTop3` = participation after removing the strongest return leader(s).
9. `avgChangeExTop1` and `avgChangeExTop3`.
10. `leaderRemovalSignStable` = whether sector average return keeps the same sign after top-1/top-3 removal.
11. `memberReturnDispersion` = robust dispersion, preferably median absolute deviation or preregistered standard deviation.
12. `stockCount`, `knownMemberCount`, `unknownMemberCount` are mandatory denominators.

### Small-sector normalization
Raw HHI mechanically rises when a sector has few members. Therefore:
- always report `1/stockCount` as the equal-share HHI baseline;
- preserve `normalizedAmountHHI = (HHI - 1/N) / (1 - 1/N)` only when N > 1;
- preserve `effectiveActiveNameRatio`;
- never compare raw HHI across sectors of very different N without normalization.

A one-stock sector is not "extremely concentrated evidence"; it is structurally single-member and must be labeled separately.

### Price-limit / event contamination
Taiwan price limits can create apparent leadership concentration when one or a few names are locked near the daily limit. Preserve:
- limit-hit / near-limit status;
- event/news state when available;
- liquidity / trade-value coverage.

Do not infer durable leadership from a one-day limit event.

### Cross-room redundancy boundary
System 2 RANK-07 already measures **candidate-pool industry concentration** (how many selected/candidate stocks come from each industry). That is a portfolio/candidate-distribution question.

BR-030 measures **within-sector leadership concentration** (whether a sector's own price/activity strength is carried by a few members).

They are related but not duplicates:
- RANK-07: concentration *across candidates*;
- BR-030: concentration *inside the industry before candidate interpretation*.

No hard cap, diversification rule or industry quota is authorized by BR-030.

### Prospective hypotheses
H1 — `BROAD_PERSISTENT`: sector strength accompanied by participation that survives leader removal may be more persistent than leader-only strength.
H2 — `LEADER_INFORMATION_DIFFUSION`: leader-only strength can be an early stage rather than a false signal; followers may catch up later.
H3 — `LEADER_EXHAUSTION`: extreme leader concentration without follower confirmation can fail or reverse.
H4 — `STRUCTURAL_DOMINANCE`: concentrated leadership can be economically rational when one dominant firm captures most industry profits; broadness is not universally superior.

No hypothesis has a preferred winner before prospective evidence.

### Outcomes after cohort becomes valid
At the independent scan-date level:
- sector rank persistence / percentile movement D1/D3/D5;
- member breadth evolution;
- selected/near-miss D1/D3/D5 and MFE/MAE where already captured;
- false-breakout / stop-risk when valid;
- transition from leader-only -> diffusion -> broad -> narrowing.

### Mandatory controls
- current Formal sector gate components;
- sector RS / Residual RS;
- Price-Volume and K-line setup;
- market Regime;
- sector stockCount and liquidity;
- limit-hit/event state;
- classification vintage;
- date clustering and leave-one-date-out.

### Falsification
Classify leadership concentration as `REDUNDANT` if:
- it is almost fully explained by breadth/avgChange/amountVs20D;
- apparent effect disappears after stockCount normalization;
- one/few dates or mega-cap sectors drive the result;
- leader-removal descriptors add nothing beyond sector RS and existing setup;
- negative-control sectors show the same behavior.

Status: `PREREGISTERED / WAITING_PROSPECTIVE / NO_THRESHOLD / FORMAL_CORE_LOCKED`.


## BR-033 — Above-MA breadth requires coverage bounds, leave-one-out and redundancy controls

Artifact:
`research/br033_above_ma_breadth_contract_v0_1.json`

### Why this is not just another moving-average signal
Above-MA breadth measures cross-sectional participation:

`count(members with close > MA_h) / count(history-ready members)`.

It is not the same object as:
- one-day advance/decline breadth;
- sector average return;
- Sector RS;
- a candidate stock's own MA state.

The intended information is whether a sector/index move is broadly shared across member trends or concentrated in a few leaders.

### Existing system overlap
The existing research patch chain already computes market-level `aboveMa20Pct` and `aboveMa60Pct` from history-backed feature rows. The sector-stat builder already has:
- same-day industry identity;
- member rows;
- symbol feature mapping;
- history-ready counts.

Therefore sector Above-MA is structurally derivable without a new external data source.

However current post-repair live receipt completeness is not yet proven because 2026-09-30 recovery preview hit a Cloudflare Worker 1102 resource-limit failure after closure-proof validation. That prevents an L3 promotion from mechanism alone.

### Denominator contract
For each sector/window:
- `membershipN` = PIT-valid sector members under the classification vintage;
- `historyReadyN` = members with admitted history and finite MA;
- `passN` = history-ready members with close > MA;
- `unknownN = membershipN - historyReadyN`;
- point estimate = `passN / historyReadyN`;
- coverage = `historyReadyN / membershipN`;
- conservative lower bound = `passN / membershipN`;
- conservative upper bound = `(passN + unknownN) / membershipN`.

If `historyReadyN=0`, state = UNKNOWN, never 0%.

This prevents missing history from mechanically inflating breadth by silently shrinking the denominator.

### Candidate self-inclusion
If Above-MA is later used to evaluate a stock, the sector measure must also expose a candidate leave-one-out value.

For a small sector, one stock can materially change the percentage and create circular evidence:
`candidate is above MA -> sector breadth improves -> candidate receives a stronger sector signal`.

Leave-one-out sensitivity is therefore mandatory before any stock-level use.

### Horizon contract
Research windows are frozen initially to:
- MA20;
- MA60.

No 50/100/150/200-day sweep is authorized at this stage.

The existing 55/45 research regime labels are not inherited as D09-05 thresholds. Round-number threshold folklore remains a challenger, not truth.

### Positive mechanism
A sector whose average return is strong **and** whose members broadly remain above their own trend references is a different state from the same return produced by a few leaders while most members sit below trend.

Above-MA breadth may also change more slowly than one-day advance share and therefore can describe trend diffusion rather than a single-session rebound.

### Falsification
D09-05 is redundant/rejected if:
- it adds nothing after Sector RS/return, one-day advance breadth, equal/median return, leader HHI/top-share and dispersion;
- the sign reverses across Trend/Range or volatility regimes;
- small-sector leave-one-out removes the apparent signal;
- readings are explained by history-coverage changes;
- only one MA horizon or threshold survives after a parameter sweep.

Whipsaw around moving averages is an expected failure mode, not an exception.

### External evidence
- StockCharts defines percent-above-MA as a breadth/participation indicator and explicitly notes that shorter horizons are more volatile and threshold crossings can whipsaw.
- Yu, Webb & Lin (Journal of Investing, 2025) study index-over-moving-average percentages at 20/50/200-day horizons, supporting this as a legitimate empirical indicator family but not a universal Taiwan threshold.

### Maturity decision
`D09-05 Above-MA廣度: L1 -> L2`.

Reason:
mechanism, denominator semantics, data-quality failure states, self-inclusion counterexample, redundancy controls and promotion gates are now explicitly frozen.

Not L3 because the first clean post-repair Taiwan live receipt with replayable membership/history coverage is still pending.

No Formal sector gate, sector score, threshold, ranking, quota, capital, signal or push behavior changed.

### Exact next continuation
BR-034:
build an isolated research-only Above-MA receipt from existing feature rows + industry membership. Required outputs: MA20/MA60 point estimates, coverage/bounds, member counts and leave-one-out sensitivity. Freeze the first clean live receipt before any forward outcome join.


## BR-034 — Above-MA executable receipt QA

Artifacts:
- `research/above_ma_breadth_receipt_v0_1.mjs`
- `research/test_above_ma_breadth_receipt_v0_1.mjs`
- `research/br034_above_ma_breadth_isolated_qa_v0_1.json`

An isolated research-only builder now implements the BR-033 contract without Worker/runtime/Formal wiring.

### Adversarial QA
28 deterministic assertions pass.

Covered failure/counterexample cases:
1. Full 20d/60d history coverage returns exact point estimates.
2. Partial history coverage keeps point estimate separate from membership lower/upper bounds.
3. Candidate self-inclusion can materially change a small-sector reading; leave-one-out is therefore mandatory.
4. Candidate-only valid history can produce a full-sample 100% point estimate while leave-one-out is UNKNOWN.
5. Zero history-ready members returns UNKNOWN rather than 0%.
6. MA20 may be known while MA60 remains UNKNOWN.
7. Duplicate membership identity fails closed.
8. Missing classificationSchemeId fails closed.
9. Sector partitions remain independent.

### Concrete denominator counterexample
Four sector members:
- 3 history-ready;
- 2 of those 3 above MA20;
- 1 member history UNKNOWN.

Naive ready-only point estimate = 66.67%.

But full-membership uncertainty interval is:
- lower bound = 50%;
- upper bound = 75%;
- coverage = 75%.

Therefore a raw 66.67% breadth without coverage is not a complete sector-participation statement.

### Concrete self-inclusion counterexample
Two-member sector:
- candidate is above MA20;
- peer is below MA20.

Inclusive breadth = 50%.
Candidate leave-one-out breadth = 0%.

A candidate must not be allowed to strengthen the sector evidence used to validate itself without exposing this circularity.

### Current maturity
D09-05 remains L2 after executable QA.

The QA proves deterministic semantics, not Taiwan live PIT completeness. L3 still requires one clean post-repair Taiwan receipt with:
- effective-dated membership;
- admitted history;
- exact MA20/MA60 coverage;
- replayable source/decision clocks.

No outcomes were opened. No threshold search was performed. Formal Core unchanged.

### Exact next
BR-035: when the first clean post-repair scan is available, freeze one outcome-blind live Above-MA receipt. Only after that receipt passes coverage/replay checks may redundancy diagnostics versus Sector RS, advance breadth, leader concentration and dispersion begin.
