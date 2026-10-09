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


## BR-036 — Taiwan size leadership is a conditional state, not a permanent small-cap bonus

Artifact:
`research/br036_size_leadership_contract_v0_1.json`

### Taiwan-native proxy set
Use official total-return index families rather than reconstructing history with today's size ranks:
- Large: FTSE TWSE Taiwan 50;
- Mid: FTSE TWSE Taiwan Mid-Cap 100;
- Small: TWSE TAIEX Small-Cap 300 Sub-Index.

Initial research spreads:
- smallTR - largeTR;
- midTR - largeTR;
- smallTR - midTR;
at frozen D1/D5/D20/D60 horizons.

The total-return versions are preferred for performance comparison so dividend treatment is not silently inconsistent.

### Why curated mid/small indices are not interchangeable with pure size
The newer Pristine mid/small-cap products additionally screen profitability, dividends, attention, operating stability and revenue growth. Those are useful investment products but confound a pure size-leadership study.

### Positive mechanism
Large-only leadership, small/mid diffusion and broad confirmation are different market states.

Potential interpretations to test:
- large-cap leadership: institutional/global-liquidity/mega-cap earnings concentration;
- mid/small confirmation: broader risk appetite and participation;
- divergence: index strength without broad size participation.

These are hypotheses, not permanent signs.

### Strong Taiwan-specific counterevidence
Prior Taiwan research finds strong contemporaneous co-movement and does not establish a universal positive large-stock lead over small stocks.

More recent Taiwan size-effect research also points to illiquidity and price-limit/limits-to-arbitrage mechanisms as important explanations of predictable size effects.

Therefore:
`SMALL_OUTPERFORMS != AUTOMATIC_RISK_ON`
and
`LARGE_LEADS != SMALL_WILL_FOLLOW`.

### Required controls
Before any strategy use, control:
- market trend;
- sector composition / Sector RS;
- breadth / Above-MA;
- volatility / regime;
- liquidity / turnover;
- institutional flow;
- leader concentration;
- index rebalance/event state;
- price-limit/limit-hit context where available.

If size spread disappears after sector or liquidity controls, classify it as `SECTOR_MIX_DOMINATED` or `LIQUIDITY_DOMINATED`, not independent size leadership.

### PIT/source feasibility
Official Taiwan index sources provide:
- explicit large/mid/small index semantics;
- official historical index-value surfaces;
- official end-of-day values.

This supports an outcome-blind daily size-state receipt without reconstructing historical constituents.

If constituent-level attribution is later attempted, effective-dated index membership/review vintages become mandatory; current membership must not be backfilled.

### Maturity
`D09-08 大型股vs小型股領導: L1 -> L3`.

This jump covers:
- L2 mechanism/falsification;
- L3 Taiwan PIT source feasibility.

It does **not** imply predictive efficacy, OOS value or a bullish/bearish size signal.

D09-06 Sector Rotation remains L2.
D09-12 Breadth×Regime remains L2.

Formal Core unchanged.

### Exact next
BR-037: build an outcome-blind `SIZE_LEADERSHIP_RECEIPT` from official total-return index values at D1/D5/D20/D60; preserve source/knownAt clocks and add sector/liquidity controls before any outcome test.


## BR-037 / BR-039 — First official size-state receipt and official TWSE stock breadth PIT receipt

Artifacts:
- `research/br037_size_leadership_receipt_20261001_v0_1.json`
- `research/br039_twse_advance_decline_receipt_20261002_v0_1.json`

### BR-037 — first official Taiwan size-state receipt

The first common-complete total-return-index receipt is frozen at 2026-10-01 because the 2026-10-02 official page had:
- Taiwan 50 price index available but TRI = `--`;
- Mid-Cap 100 price index available but TRI = `--`;
- Small-Cap 300 TRI already available.

Therefore 2026-10-02 was **not** mixed across price/TR bases.

Official total-return returns as of 2026-10-01:

| Horizon | Taiwan 50 | Mid-Cap 100 | Small-Cap 300 |
| --- | ---: | ---: | ---: |
| D1 | +1.0808% | +0.1704% | +0.4410% |
| D5 | +1.0472% | +1.4561% | +1.7980% |
| D20 | +3.7414% | +1.1876% | +0.8257% |
| D60 | +5.4433% | -0.4964% | -4.4239% |

This produces a cross-horizon conflict:
- D5: small > mid > large;
- D20/D60: large > mid > small.

Hence `SMALL_LEAD = RISK_ON` is not an admissible one-line interpretation.
A short-horizon small-cap diffusion state can coexist inside a medium-horizon large-cap leadership regime.

D09-08 remains L3: first official state receipt is now frozen, but no outcome/OOS promotion is justified.

### BR-039 — official TWSE stock breadth

Official TWSE 2026-10-02 stock-only counts:
- up 483, of which 24 limit-up;
- down 506, of which 1 limit-down;
- unchanged 91;
- unmatched 0;
- N/A / not-comparable 2.

Comparable denominator:
`483 + 506 + 91 = 1,080`.

Derived:
- advance share = 44.72%;
- decline share = 46.85%;
- unchanged = 8.43%;
- net advance-minus-decline = -2.13 percentage points.

Contemporaneously the TAIEX closed +0.25%.

This is a direct Taiwan witness that:
`CAP_WEIGHTED_INDEX_UP != POSITIVE_STOCK_COUNT_BREADTH`.

### Universe firewall

TWSE publishes both `Overall Market` and `Stocks` counts.
The overall-market column includes non-stock instruments and must not be substituted for stock breadth.

Research must preserve separately:
1. official TWSE stock breadth;
2. official TPEx stock breadth when available;
3. System1 `TWSE_TPEX_COMBINED_FORMAL_NORMALIZED` strategy-universe breadth.

No cross-universe denominator substitution is allowed.

TWSE `N/A` includes cases such as ex-right/ex-dividend, new listing, resume trading or missing prior close; these are NOT_COMPARABLE for ordinary close-to-close A/D and are not coded as flat/up/down.

### D09 maturity decisions

`D09-04 漲跌家數／Advance-Decline: L2 -> L3`.

Reason:
official Taiwan stock-only daily up/down/unchanged counts expose decision-date PIT values with explicit comparison and N/A semantics. This is bounded Taiwan PIT data feasibility only.

No promotion:
- D09-12 remains L2;
- D09-08 remains L3;
- D09-05 remains L2 pending clean post-repair System1 history/selection lineage.

Formal Core unchanged.

### Exact next
- BR-038: accumulate independent common-complete total-return size receipts.
- BR-040: repeat TWSE stock breadth across dates, add TPEx and strategy-universe lanes without denominator mixing.
- Only after multiple independent dates may index/breadth divergence states enter D09-12 interaction testing.


## BR-041 — Cross-sectional return dispersion is a state descriptor, not a direction signal

Artifact:
`research/br041_cross_sectional_return_dispersion_contract_v0_1.json`

### Source audit
Current `buildTodaySectorStats(rows, features)` already groups same-day Taiwan rows by `industry` and reads member-level `changePercent`, `tradeValue` and symbol identity at the decision clock.

Combined with D09-01 effective-dated classification semantics, sector return dispersion is prospectively PIT-computable without a new external data source.

### Frozen metric family
Do not use one standard deviation as the whole concept.

Initial receipt must preserve:
- CSSD: sample cross-sectional standard deviation;
- CSAD: mean absolute deviation around sector mean;
- IQR: Q75-Q25;
- MAD: median absolute deviation;
- median return;
- member count / valid-return coverage;
- upside/downside descriptive dispersion;
- dispersion after removing top-1/top-3 members by **trade value**, never by realized return.

Trade-value removal is a robustness diagnostic against mega-cap/activity dominance. Removing names because their return is extreme would be outcome-conditioned and is forbidden.

### Interpretation states
Examples:
- positive sector return + low dispersion -> broad synchronized strength candidate;
- positive return + high dispersion -> selective rotation / leader differentiation candidate;
- negative return + low dispersion -> broad sell-off candidate;
- negative return + high dispersion -> idiosyncratic stress / event differentiation candidate.

No state receives a permanent bullish/bearish sign.

### Taiwan-specific falsification
Taiwan herding literature itself warns against a one-line dispersion rule:
- linear CSSD evidence and nonlinear/state-space evidence can disagree;
- more recent CSAD evidence shows herding varies with venue/microstructure, ESG grouping and market stress.

Therefore dispersion requires:
- regime;
- market/sector volatility;
- breadth;
- leader concentration;
- price-limit/event contamination;
- liquidity;
- member-count/coverage controls.

### Maturity
`D09-09 橫截面報酬離散度: L2 -> L3`.

Reason:
member return, industry identity and trade-value fields are already available at the Taiwan decision clock, and PIT classification semantics are established. This is source/data feasibility only.

D09-12 remains L2. No predictive/OOS conclusion exists.

Formal Core unchanged.

### Exact next
BR-042: build an isolated research-only CSSD/CSAD/IQR/MAD receipt with coverage and trade-value leader-removal diagnostics; freeze one source-only Taiwan date before forward outcomes.


## BR-042 — Synthetic falsification proves dispersion is directionless

Artifact:
`research/br042_dispersion_synthetic_falsification_qa_v0_1.json`

Synthetic QA deliberately separates return direction from dispersion.

Examples:
- `[+2,+2,+2,+2]`: CSSD/CSAD/IQR/MAD all 0;
- `[-2,-2,-2,-2]`: the same zero-dispersion values;
- `[+10,0,0,0]`: CSSD 5, CSAD 3.75, IQR 2.5, but MAD 0;
- `[-10,0,0,+10]`: mean 0 while CSSD ≈8.165, CSAD/IQR/MAD all 5.

These fixtures prove:
- low dispersion has no bullish/bearish direction by itself;
- high CSSD can be one-outlier-driven rather than broad differentiation;
- average return and dispersion encode different dimensions;
- robust and non-robust measures must be retained separately.

D09-09 stays L3; synthetic QA is not additional PIT evidence and does not justify L4.
D09-12 stays L2.

Exact next:
BR-043 freezes the first source-only/live Taiwan sector dispersion receipt on a clean member-universe lineage, with one fixed quantile convention and no forward outcomes.

Formal Core unchanged.


## BR-044 — Official TWSE industry-index rank transition establishes sector-rotation PIT feasibility

Artifact:
`research/br044_twse_sector_rotation_pit_pilot_20261002_v0_1.json`

### Source contract
TWSE `MI_INDEX` daily reports expose official industry price and total-return indices by date. This provides a Taiwan-native sector series that is independent from System 1's custom same-day sector score.

For rotation research, use official **total-return** industry indices when comparing multi-day relative performance so dividend treatment is not silently inconsistent.

### Bounded rank-transition witness
A seven-sector source-only pilot compares official 2026-09-23 and 2026-10-02 observations.

2026-09-23 daily-return rank within the bounded pilot:
1. 電子零組件 +1.49%
2. 半導體 +1.25%
3. 數位雲端 +0.73%
4. 油電燃氣 +0.06%
5. 航運 -0.49%
6. 金融保險 -0.78%
7. 綠能環保 -1.10%

2026-10-02:
1. 油電燃氣 +5.51%
2. 電子零組件 +2.21%
3. 航運 +0.81%
4. 金融保險 -0.11%
5. 半導體 -0.18%
6. 數位雲端 -0.21%
7. 綠能環保 -0.85%

This gives deterministic rank transitions without any arbitrary Top-N entry rule.

A useful counterexample appears immediately:
金融保險 improves from rank 6 to rank 4 even though its daily return remains negative.
Therefore:
`RANK_IMPROVEMENT != ABSOLUTE_POSITIVE_RETURN`.

### Multi-day interval context
Using the same official total-return index levels from 2026-09-23 to 2026-10-02:
- 油電燃氣: +13.01%
- 電子零組件: +4.82%
- 綠能環保: +0.55%
- 半導體: -0.13%
- 航運: -0.63%
- 數位雲端: -1.91%
- 金融保險: -2.30%

This is descriptive state evidence only, not a predictive ranking.

### Firewalls
- Seven sectors are a bounded pilot, not the full TWSE industry universe.
- The dates are not consecutive sessions; this does not estimate one-day rotation velocity.
- Cap-weighted industry indices can move on concentrated leadership; member breadth and concentration must remain separate.
- Historical page retrieval now does not authenticate original historical first-known time. Future prospective receipts use capturedAt conservatively unless native availability time is proven.
- Constituent-level interpretation requires effective-dated membership; current constituents may not be backfilled.

### Maturity
`D09-06 Sector Rotation族群輪動: L2 -> L3`.

Reason:
official Taiwan industry total-return indices are date-addressable, replayable and support continuous rank/percentile transitions under a prospective capturedAt clock. The pilot also validates a concrete rank-vs-absolute-return counterexample.

This is PIT/source feasibility only:
- no persistence/reversal alpha;
- no preferred sector;
- no Formal sector-score change;
- no System 2 weight change.

### Exact next
BR-045: create an append-only prospective daily official-industry-index receipt over the full eligible TWSE industry-index set, with rank/percentile and source clock.
Accumulate independent dates before testing persistence, reversal, breadth confirmation or stock-selection interaction.

Formal Core unchanged.


## BR-046 — ABF proves theme exposure and formal industry are many-to-many

Artifact:
`research/br046_abf_industry_exposure_bridge_v0_1.json`

### Bounded Taiwan counterexample
Current official Taiwan sources establish:

- 8046 南亞電路板:
  - TWSE formal industry = `電子零組件業`;
  - issuer official business profile explicitly lists ABF substrate, PP substrate and PCB products.

- 3189 景碩:
  - TWSE/MOPS formal industry = `半導體業`;
  - issuer official product/management sources establish FCBGA/IC-substrate and large-area high-layer-count ABF substrate exposure.

Therefore two verified ABF/IC-substrate exposures occupy different formal TWSE industries.

`FORMAL_INDUSTRY != THEME_EXPOSURE`
and
`THEME_EXPOSURE != ONE_FORMAL_INDUSTRY`.

### Bridge semantics
The bridge must be effective-dated and many-to-many:
`issuer <-> formal industry <-> product/theme/supply-chain node`.

Required clocks/fields include:
- formal classification scheme / knownAt / effectiveFrom / effectiveTo;
- theme/product exposure basis / knownAt / effective dates;
- exposure magnitude and basis when disclosed;
- revision/supersession lineage;
- source class and confidence.

### PIT firewall
Current official pages support a **prospective** bridge from the conservative capture clock.

They do not authorize:
- backfilling today's industry label to earlier dates;
- backfilling today's ABF capability to earlier dates;
- inventing revenue/order share;
- treating all members of one formal industry as theme members;
- treating a media theme label as verified company exposure.

Missing exposure magnitude remains UNKNOWN.

### Maturity
`D09-11 題材股與正式產業分類橋接: L2 -> L3`.

Reason:
a bounded Taiwan prospective many-to-many bridge can now be replayed from official TWSE industry identity and issuer-official product exposure, and the ABF pair provides an explicit taxonomy counterexample.

This is bounded Taiwan PIT feasibility only:
- historical full theme membership remains incomplete;
- exposure magnitude is mostly UNKNOWN;
- no theme-return outcome was opened;
- no theme score/weight is authorized.

D10-01 supply-chain graph remains L2 because complete effective-dated historical graph coverage is still not established.
D10-12 remains L3.

### Exact next
BR-047: append additional cross-industry theme bridges under the same prospective clock.
BR-048: seek effective-dated historical exposure vintages before any historical theme-return study.

Formal Core unchanged.


## BR-049 — Industry structure is a state vector, not a moat label

Artifact:
`research/br049_industry_structure_five_forces_contract_v0_1.json`

D09-13 is initialized with a Five Forces / industry-structure research contract. The contract converts rivalry, entry, substitution, supplier power and buyer power into observable, effective-dated fields rather than a narrative score.

Key falsification:
- concentration is not equivalent to weak competition;
- a structurally attractive industry does not prove a specific issuer wins;
- cyclical scarcity can mimic durable barriers;
- regulation can simultaneously raise entry barriers and constrain profitability;
- firm resources/capabilities remain a competing explanation.

PIT rules:
- product/geographic market definition is a vintage;
- missing evidence remains UNKNOWN;
- no current taxonomy backfill;
- no stock/future-margin outcome while classifying force states.

Maturity: `D09-13 L0 -> L2` for mechanism + falsification only. Taiwan PIT data feasibility is not yet established.

## BR-050 — Market share requires a denominator; entry barriers and substitutes require explicit evidence

Artifact:
`research/br050_market_share_entry_substitution_contract_v0_1.json`

D09-14 now separates:
- revenue / shipment / capacity / installed-base share;
- sunk capex and minimum efficient scale;
- customer qualification, IP/process know-how, scarce-input access, switching costs, network/data effects and multi-level entry;
- functional substitution, price-performance, qualification time, switching cost and customer acceptance.

A reported market share is unusable if product, geography, period or denominator is missing. Historical share cannot be assumed to equal future competitive significance after technology, capacity, regulation or customer-sourcing changes.

Maturity: `D09-14 L0 -> L2` for mechanism + falsification only.

### Exact next
- BR-051: first Taiwan industry-structure PIT receipt for one priority industry.
- BR-052: first Taiwan market-share / entry-barrier / substitution receipt with explicit denominator and a negative control.
- Existing BR-038/040/043/045/047 lanes remain valid and are not overwritten.

Formal Core unchanged.


## H01 specialist validation — D09-13 vs D09-14

Artifact:
`research/h01_d09_13_d09_14_specialist_validation_20261003_v0_1.json`

Terminal specialist classification proposed: **SCOPE_DEDUP_ONLY**.

Evidence:
- D09-13 owns industry×market-definition×vintage structural state.
- D09-14 is only distinct if narrowed to issuer×industry×observable-strategic-action×implementation-stage×vintage.
- Static market share, capacity, price, margin, customer and supplier observations are shared parent evidence and cannot create two votes.
- Three valid divergent-state families exist: attractive-industry/weak-firm, unattractive-industry/strong-firm, and stable-structure/changing-firm-action.
- Repository search found no Production/runtime/API/UI capability dependent on standalone D09-14 identity.
- Therefore unrestricted KEEP_SEPARATE would duplicate evidence, while immediate merge would erase a useful dynamic firm-action distinction before owner review.

No merge/retirement executed. Owner/dependency audit remains required.

## BR-051 — First Taiwan foundry industry-structure PIT receipt

Artifact:
`research/br051_taiwan_foundry_industry_structure_pit_v0_1.json`

2025 TSIA/ITRI industry data freeze Taiwan-headquartered IC foundry output at NT$4.1693tn, +28.5% YoY. The receipt joins this industry denominator with issuer-native TSMC and UMC capacity/technology/product/customer evidence.

Critical denominator firewall:
TSMC/UMC consolidated revenue is **not** divided by TSIA foundry output and labeled market share. Production value vs accounting revenue compatibility is not yet proven. Likewise wafer-capacity shares cannot be treated as revenue shares without a complete comparable denominator.

Observed structure is segmented rather than homogeneous:
- TSMC: >17m annual 12-inch-equivalent capacity, 15.0m shipments, 305 technologies, 12,682 products, 534 customers, 74% wafer revenue from 7nm-and-beyond.
- UMC: >400k 12-inch-equivalent wafers/month across 12 fabs, with mature/specialty logic positioning and geographically diversified Asia capacity.

Entry barriers are directly observable through scale, process/yield learning, qualification, capital and technology breadth. Supplier/buyer power magnitude and exact firm market shares remain UNKNOWN.

Maturity: **D09-13 L2 -> L3 Taiwan PIT data feasibility only**. No predictive outcome or Formal score.

### Exact next
- BR-052 becomes a firm-specific competitive-action/position receipt under the H01 dedup boundary.
- Add a non-semiconductor industry control before any cross-industry structural score.
- No Five-Forces composite score, market-share factor or Formal change.


## BR-052 — Firm competitive action has a distinct PIT lifecycle

Artifact:
`research/br052_issuer_competitive_action_pit_v0_1.json`

BR-052 proves that the deduplicated D09-14 scope has a distinct unit and replay contract:
`issuer × strategic action × implementation stage × vintage`.

Three official action receipts establish the boundary:
- TSMC 2025 U.S. expansion: announcement/intention later progresses to confirmed construction/schedule acceleration.
- UMC 2025 Singapore fab: facility unveiled while HVM remains future-dated, proving opening != operating qualified capacity.
- UMC/Intel 12nm collaboration: node/capacity advancement through partner manufacturing, falsifying the assumption that competitive advancement always requires own-fab capex.

The resulting H01 specialist classification is superseded from preliminary `SCOPE_DEDUP_ONLY` to **KEEP_SEPARATE**, with mandatory scope dedup:
- D09-13 = industry structure / competition state.
- D09-14 = issuer-specific competitive action / relative-position lifecycle.
- Shared share/capacity/price/margin observations have one parent lineage and cannot cast two votes.

Maturity: **D09-14 L2 -> L3 Taiwan PIT data feasibility only**.

No merge/retirement or Formal change executed.


## BR-053 — Steel proves industry structure must remain route/product specific

Artifact:
`research/br053_taiwan_steel_industry_structure_control_v0_1.json`

Taiwan steel is the second non-semiconductor structural control:
- CSC is an integrated blast-furnace/basic-oxygen-furnace producer with about 10m tonnes annual crude-steel capacity, broad flat/long product coverage and both domestic/export demand.
- Tung Ho is a scrap-based electric-arc-furnace producer focused on construction/structural steel; 2025 primary raw material is about 98% scrap.
- Therefore one TWSE steel label does not imply one economic market, one raw-material beta or one pricing-power state.

Key falsification:
- integrated BF/BOF and EAF producers face different upstream inputs, fixed-cost structures, decarbonization burdens and end-demand regimes;
- iron ore/coking-coal exposure cannot be copied to scrap/electricity-based steel;
- capacity, production index and issuer revenue remain incompatible market-share denominators unless explicitly reconciled.

D09-13 remains L3. This strengthens cross-industry generalization, not predictive efficacy.

## BR-054 — Strategic action must allow failure/suspension states

Artifact:
`research/br054_cross_industry_competitive_action_failure_control_v0_1.json`

D09-14 is extended outside semiconductors using:
- Tung Ho smart-scrap inspection R&D as an in-progress process action;
- CSC AI sinter optimization as an implemented operational action;
- Foxconn/Lordstown as a specific strategic-action chain that moved from agreement and partial implementation to investment dispute, counterparty bankruptcy/litigation and suspended negotiations.

The Lordstown control is deliberately bounded: it is evidence that one strategic partnership chain can fail after partial implementation; it is not evidence that Foxconn's entire EV strategy failed.

D09-14 remains L3.

## BR-055 — PCB structure is product/application/material segmented

Artifact:
`research/br055_taiwan_pcb_industry_structure_control_v0_1.json`

2025 Taiwan PCB evidence shows broad industry growth can coexist with opposite product/application states:
- multilayer, substrates and HDI grew while flex and rigid-flex declined in the same period;
- computer/semiconductor applications strengthened while communications/automotive weakened;
- advanced-material bottlenecks such as low-CTE glass and high-end copper foil can create upstream supplier power;
- one issuer may span conventional PCB, HDI, rigid-flex and ABF/PP substrates, so theme membership is not one economic exposure.

D09-13 remains L3.

## BR-056 — Native strategic-action outcome semantics frozen

Artifact:
`research/br056_strategic_action_native_outcome_contract_v0_1.json`

Strategic actions now have explicit native lifecycle states:
ANNOUNCED / APPROVED_OR_CONTRACTED / FUNDED / IMPLEMENTATION_STARTED / OPERATIONAL_MILESTONE_ACHIEVED / COMMERCIALIZED / PARTIAL_SUCCESS / DELAYED / SUSPENDED / CANCELLED / COUNTERPARTY_FAILURE / RESTRUCTURED / OUTCOME_UNKNOWN.

Controls:
- CSC AI sinter action = operational milestone achieved, but no company-wide alpha claim.
- Tung Ho smart-scrap project = implementation started, outcome unknown.
- Foxconn/Lordstown = partial implementation followed by suspended partnership/investment path and counterparty failure.

No cross-action scalar "strategy success score" is allowed because native metrics are not common-support.

### Exact next
- BR-057: effective-dated PCB/ABF issuer product/application exposure denominator.
- BR-058: prospective new strategic-action receipts frozen before outcomes are known, followed later by native outcomes on publication clocks.
- D09-13 and D09-14 both remain L3.
- H01 specialist return has been submitted to the canonical intake ledger for 00 Dependency Audit / owner review.

Formal Core unchanged.


## BR-057 — PCB/ABF issuer exposure requires a compatible numerator

Artifact:
`research/br057_pcb_abf_issuer_exposure_denominator_firewall_v0_1.json`

For 8046 南亞電路板 and 3189 景碩, issuer-native evidence is sufficient to freeze product/application scope and total-company revenue denominators, but not a compatible ABF/AI product-revenue numerator.

Therefore:
- verified product presence != numeric revenue exposure;
- TPCA product growth cannot fill an issuer numerator;
- ABF material market share cannot become ABF-substrate manufacturer share;
- roadmap/certification or qualitative contribution growth cannot be converted to a percentage;
- missing exposure magnitude remains UNKNOWN.

D09-13 remains L3. This improves denominator integrity, not predictive efficacy.

## BR-058 — First prospective issuer strategic-action cohort frozen before outcomes

Artifact:
`research/br058_prospective_strategic_action_cohort_v0_1.json`

Two issuer actions are frozen before future outcomes are opened:
- UMC 2026-07-29 phased expansion: Singapore cleanroom expansion plus Tainan fab-building shell, with company-stated long-term customer commitments as context. Future HVM, utilization, margin, share and stock outcomes remain UNKNOWN.
- Foxconn / Mitsubishi Electric 2026-04-24 automotive-business MOU: possible joint operation / equity transfer remains conditional; definitive agreement, closing and synergy outcomes remain UNKNOWN.

Pre-registered future outcome layers:
- operational milestones;
- financial outcomes after material implementation;
- relative-position outcomes only with compatible denominators;
- stock-market outcomes only after separate D16 preregistration/common-support approval.

D09-14 remains L3 by design. BR-058 is the first true prospective cohort freeze; L4 requires future evidence, not a receipt count.

### Exact next
- BR-059: add issuer-native PCB/ABF product/application revenue numerators only when compatible disclosures appear.
- BR-060: append future strategic-action milestones on native publication clocks and add at least two more pre-outcome actions.
- D09-07, D09-12 remain L2 until their explicit evidence blockers are cleared.

Formal Core unchanged.


## BR-045 — Five official TWSE snapshots clear the bounded sector-leadership PIT gate

Artifact:
`research/br045_twse_sector_leadership_lifecycle_pit_v0_1.json`

Five independent official TWSE close snapshots across all 34 industry total-return indices are frozen:
- 2026-09-23: 18/34 positive = MIXED_PARTICIPATION.
- 2026-09-24: 12/34 positive = NARROW_PARTICIPATION.
- 2026-09-30: 31/34 positive = BROAD_PARTICIPATION.
- 2026-10-01: 15/34 positive = MIXED_PARTICIPATION; top3 had zero overlap with 9/30.
- 2026-10-02: 16/34 positive = MIXED_PARTICIPATION; top3 again had zero overlap with 10/01.

Frozen descriptive semantics:
- leader set = same-date top quartile of official industry daily total-return percentage;
- broad participation >=75% positive industries;
- mixed = 40% to <75%;
- narrow <40%;
- thresholds are research descriptors only and were not tuned to forward returns.

The sequence demonstrates replayable leadership persistence, churn, widening and narrowing at the mainstream-sector level. It does not prove stock-level leader lifecycle or predictive value.

Maturity: `D09-07 L2 -> L3` bounded Taiwan PIT/source feasibility only.

Exact next:
BR-061 append future official snapshots under unchanged semantics; add member-level concentration/breadth only with effective-dated membership; no L4 before preregistered persistence/reversal outcomes and redundancy tests.

Formal Core unchanged.


## BR-062 — D18 dependency is ready, but same-clock joint breadth-regime evidence is not

Artifact:
`research/br062_breadth_regime_same_clock_dependency_audit_v0_1.json`

The prior D09-12 blocker has narrowed:
- D18-01 observable-regime taxonomy is now L3 and executable;
- D18-02 TAIEX trend and D18-03 volatility-direction builders are L3;
- D09-04 has a genuine official TWSE stock-breadth receipt for 2026-10-02.

However, repository audit found no genuine persisted 2026-10-02 A2_TAIEX_CLOSE 25-session D18 context receipt sharing the exact decision clock with the breadth receipt.

Prohibited shortcuts:
- D18 test fixtures are not market evidence;
- today's historical reconstruction cannot be backfilled into the 2026-10-02 decision state;
- source existence does not authenticate first-known timing.

Decision:
`D09-12 KEEP L2`.

Exact next:
BR-063 must persist the first genuine same-clock D18 observable-regime context + official breadth receipt on a future completed Taiwan session, with identical marketDate/decisionTimestamp and immutable source hashes.

Formal Core unchanged.


## BR-060 — Strategic-action cohort expanded to four actions; original milestone lanes remain pending

Artifact:
`research/br060_strategic_action_cohort_expansion_v0_1.json`

Outcome-blind milestone surveillance and cohort expansion were completed on 2026-10-04.

Original BR-058 actions:
- UMC 2026-07-29 phased Singapore P4 cleanroom expansion plus Tainan P7/P8 fab-shell construction: no same-action post-freeze issuer-native milestone was found in the bounded official-newsroom scan through the latest visible 2026-08-17 item. This is not evidence of no progress; implementation outcomes remain closed.
- Hon Hai / Mitsubishi Electric 2026-04-24 automotive-equipment MOU: no same-case definitive-agreement or closing milestone was found in the bounded Hon Hai official-news scan through the latest visible 2026-09-05 item. Mitsubishi Electric's official case page remains at MOU/discussion stage and states that material future matters will be disclosed. Absence of a new press release is not treated as a negative outcome.

Two additional pre-outcome strategic actions are now frozen:
1. TSMC / Sony, 2026-08-11: legally binding definitive JV agreement for Advanced Vision Semiconductor Manufacturing Corporation in Kumamoto; TSMC planned cash investment up to JPY 282 billion; mass production is expected in 2029. Current state = DEFINITIVE_AGREEMENT / PRE_IMPLEMENTATION. Incorporation, facility execution, production readiness and 2029 mass production remain future milestones.
2. TSMC / ASML, 2026-09-08: joint industry initiative to transition High-NA EUV photomasks from 6-inch to 12-inch format; pilot-line target by 2031, full lithography-system readiness by 2033, and TSMC stated intent to introduce High-NA technology into advanced-process mass production from 2030. Current state = INITIATIVE_ANNOUNCED / PRE_PILOT.

Cohort state:
- action count: 2 -> 4;
- issuer count: 3;
- the two TSMC actions are not two independent issuer observations. Any future statistical inference must cluster by issuer and action date and must not inflate independent sample size.

No stock return, revenue, margin, market-share or realized implementation outcome was opened. D10 physical-capacity facts remain dependencies, not duplicate D09-14 votes.

Maturity decision: `D09-14 L3 / 60% KEEP`. This round improves cohort breadth and anti-leakage discipline, not predictive-efficacy evidence.

Exact next:
- continue native milestone surveillance for all four frozen actions;
- add issuer-diverse pre-outcome actions when clean native evidence appears;
- freeze each implementation milestone before any outcome join;
- no stock outcome before D16 preregistration/common support; no L4 before prospective/OOS evidence.

Formal Core unchanged.


## BR-059 — First compatible issuer-native PCB application-revenue numerator

Artifact:
`research/br059_compeq_pcb_application_revenue_numerator_v0_1.json`

Compeq 2313 provides the first clean positive control for the BR-057 denominator firewall. Its issuer-hosted investor presentation discloses application revenue mix under one same-company, same-table, same-period denominator. For 2025Q3, Data Center / Networking is 5% of Operation Revenue.

The receipt is usable because:
- numerator and denominator are issuer-native and period-compatible;
- the category is explicitly application revenue mix, not a third-party market-size proxy;
- product presence is no longer being substituted for a numeric exposure share.

The 2025Q3 displayed categories sum to 101%, consistent with rounded presentation percentages. The row is preserved as disclosed and is not re-normalized.

First-known handling is conservative. The issuer conference list shows a 2025-11-25 14:00 investor forum near the document release. The PDF filename contains a 2025-11-21 timestamp, but filename metadata is not treated as authoritative public first-known time. The receipt therefore uses the verified 2025-11-25 conference clock and preserves the earlier filename timestamp only as non-authoritative document metadata.

Critical taxonomy firewall:
- Data Center / Networking 5% is **not** relabeled as AI revenue;
- it is **not** relabeled as ABF-substrate revenue;
- it cannot be transferred to 3189 Kinsus or 8046 Nan Ya PCB;
- those issuers' ABF/AI numeric exposure magnitude remains UNKNOWN until a same-company, same-period compatible numerator is disclosed.

This positive control proves that issuer-native application-revenue numerators are observable in Taiwan PCB issuers when disclosed, while simultaneously reinforcing that missing ABF numerators cannot be filled from industry growth, material share, roadmap or qualitative product presence.

Maturity decision: `D09-13 L3 / 60% KEEP`. One compatible application numerator is data-feasibility evidence, not prospective/OOS predictive efficacy.

Exact next:
- add independent issuer-native product/application revenue numerators;
- prioritize ABF/substrate-specific numerator evidence for 3189/8046 only when denominator compatibility is explicit;
- preserve broader application taxonomies without AI/ABF relabeling;
- no composite industry-structure score before OOS/redundancy validation.

Formal Core unchanged.


## SDA-009 — D09 leave-one-out circularity contract frozen

Artifacts:
- `research/SDA009_D09_LEAVE_ONE_OUT_CIRCULARITY_CONTRACT_V0_1.md`
- `research/sda009_d09_leave_one_out_circularity_contract_v0_1.json`

The 2026-10-05 self-deception audit confirmed three candidate self-influence paths in current production semantics:
1. same-day sector hard-gate inputs: breadth, avgChange and amountVs20DayAverage include the candidate;
2. sector.score includes the candidate and contributes 14% of priorityScore;
3. sector.score also contributes to history warmup priority, so self-influence can affect observability/admission timing.

Positive control: 20-day sector peer return already excludes the candidate before candidate Sector RS is computed. The remediation therefore extends an existing excluding-self precedent rather than redesigning all D09 semantics.

Frozen research diagnostic unit:
`candidate × scanDate × classificationVintage`.
For each candidate preserve inclusive and leave-one-out sector states under the same decision clock and effective-dated membership.

Mandatory diagnostics include self amount share, breadth/avgChange/activity/sector-score deltas, hard-gate flip, raw-vs-leave-one-out rank/Top6 difference and history-warmup priority delta. Candidate-specific sector-score normalization must recompute the cross-sector maximum after candidate removal.

Adversarial proof-of-possibility:
a two-member sector with candidate +10% change / trade amount 90 / avg20 amount 100 and one peer -2% / 10 / 100 passes the current inclusive hard gate with breadth 50%, avgChange +4% and activity 0.5. After excluding the candidate, breadth becomes 0%, avgChange -2%, activity 0.1 and the gate fails. With another sector fixing max amount at 100, sector score moves from 85 to 9.5, a 75.5-point sector-score delta and about 10.57 priority-score points through the 14% sector term alone.

This is a deterministic circularity counterexample, not an estimate of live prevalence.

Status: `RESEARCH_SEMANTICS_FROZEN / ENGINEERING_DIAGNOSTIC_PENDING / D16_VALIDATION_PENDING`.
No Formal A/B, gate, score, ranking, Top6, capital or trading behavior changed.

Exact next for SDA-009:
System 1 implements diagnostic-only machine fields and deterministic tests; D16 later compares raw versus leave-one-out rank/Top6 effects on common support; 00 independently closes the ticket. 07 resumes the pre-existing research cursor in parallel.

Formal Core unchanged.


## BR-059B — 8046 provides second compatible application-revenue numerator; ABF magnitude still UNKNOWN

Artifact:
`research/br059_nanya_pcb_application_numerator_kinsus_negative_control_v0_1.json`

Nan Ya PCB 8046 official investor materials provide an independent positive control for the BR-057 denominator firewall.

The issuer's 2026-08-27 presentation shows application revenue mix under one total operating-revenue denominator. For 2025:
- PC 17%;
- Networking & Communication 49%;
- Consumer Electronics 12%;
- Automotive Electronics 6%;
- Artificial Intelligence & High-Performance Computing 16%.

The five categories sum to 100%. The rendered chart also shows the same 16% AI/HPC share for 2026Q1. The visual chart is used for the numeric period label; machine text around the later presentation contains mixed first-half wording, so no 2026H1 percentage is inferred from that conflict.

Taxonomy firewall:
- 16% is a valid issuer-native AI/HPC **application** revenue share;
- it is not an ABF-substrate revenue share;
- it cannot be assigned only to IC substrates because Nan Ya PCB also discloses ABF, BT and general-PCB product families;
- it cannot be transferred to Kinsus or other issuers.

Bounded Kinsus 3189 negative control:
official sources confirm high-end FCBGA / large-area high-layer-count ABF positioning and state that AI advanced-packaging-substrate revenue contribution grew significantly, but the bounded official-source scan did not find a numeric same-company product/application revenue-share numerator. Therefore Kinsus numeric exposure magnitude remains UNKNOWN, not zero.

Cross-issuer BR-059 state:
- compatible issuer-native application numerators: 2 issuers (Compeq 2313, Nan Ya PCB 8046);
- ABF-specific compatible numeric numerators: 0;
- Kinsus 3189 ABF/AI magnitude: UNKNOWN.

Maturity decision: `D09-13 L3 / 60% KEEP`. Cross-issuer feasibility improved, but no ABF-specific numeric exposure and no prospective/OOS predictive evidence were opened.

Exact next:
continue issuer-native numerator search, prioritizing ABF/substrate-specific numeric revenue evidence for 3189/8046; preserve application-vs-product taxonomy separation and keep missing ABF magnitude UNKNOWN.

Formal Core unchanged.


## BR-059C — realized ABF numerator disclosure audit (2026-10-07)

Artifact:
- `research/BR059C_ABF_REALIZED_NUMERATOR_DISCLOSURE_AUDIT_20261007_V0_1.md`

Current issuer-native disclosures for 3189 Kinsus and 8046 Nan Ya PCB were re-audited under the existing denominator/taxonomy firewall.

### 8046 Nan Ya PCB

The latest official investor presentation provides application-revenue categories and separately discusses ABF substrate, BT substrate and general PCB product development.

Therefore:
`APPLICATION_REVENUE_MIX != PRODUCT_REVENUE_MIX`.

Networking/communication or AI/HPC application shares cannot be relabeled as ABF revenue shares.

Current realized ABF numerator/share remains UNKNOWN.

### 3189 Kinsus

Current issuer-native strategy disclosure supports:
- high-end FCBGA / SiP focus;
- large-area high-layer-count ABF development;
- capacity/customer-certification progress;
- 2026 ABF market-recovery expectation.

But it does not disclose a realized mutually exclusive ABF revenue amount/share.

Therefore:
`ABF_TECHNOLOGY_OR_CAPACITY_DISCLOSURE != REALIZED_ABF_REVENUE`.

Current realized ABF numerator/share remains UNKNOWN.

### Evidence taxonomy

Four axes remain separate:
1. application mix;
2. product-family mix;
3. capacity/technology state;
4. realized product revenue numerator.

Only axis 4 may populate the realized ABF revenue numerator.

No application share, capacity share, project expected-sales value, roadmap or analyst estimate may substitute for it.

Maturity:
- D09-13 remains L3/60;
- D09 aggregate maturity unchanged;
- no composite structure score and no stock outcome.

Exact next:
BR-059D wait for or prospectively capture an issuer-native realized mutually exclusive ABF/BT/general-PCB product revenue split or a directly reconcilable ABF revenue amount. Preserve UNKNOWN otherwise.

Formal Core unchanged.


## BR-064 — VIS/VSMC prospective capital-injection strategic action (2026-10-07)

Artifact:
- `research/BR064_VIS_VSMC_PROSPECTIVE_CAPITAL_INJECTION_STRATEGIC_ACTION_20261007_V0_1.md`

Taiwan MOPS provided a same-day, post-freeze strategic-action receipt for VIS 5347 / VSMC:
- 2026-10-07 17:18 Asia/Taipei: VSMC board resolved a cash capital increase;
- 2026-10-07 17:19 Asia/Taipei: VSMC announced the record date;
- total amount: US$100 million;
- 100,000,000 shares at US$1;
- all shares subscribed by existing shareholders;
- stated purpose: company operating needs.

The parent strategic program is the VIS/NXP VSMC Singapore 300mm fab JV. The fab officially opened on 2026-09-28.

This expands the frozen D09-14 action cohort:
- action count: 4 -> 5;
- issuer count: 3 -> 4.

Critical dedup:
- D09-14 owns the strategic capital action and implementation-state transition;
- D10 owns physical capacity / qualification / ramp / utilization;
- `CAPITAL_INJECTION_ACTION != PHYSICAL_CAPACITY_VOTE`.

The disclosure does not state shareholder-specific subscription amounts in the observed MOPS text; VIS-specific US-dollar subscription remains UNKNOWN.

D09-14 remains L3/60.
No stock outcome or Formal change.

Exact next:
BR-065 continue native milestone surveillance across all five frozen actions; preserve issuer clustering and shared D10 lineage where physical milestones are consumed.


## BR-066 — 2026-10-07 same-date Breadth × Regime joint receipt

Artifacts:
- `research/BR066_D09_12_SAME_DAY_BREADTH_REGIME_JOINT_RECEIPT_20261007_V0_1.md`
- `research/br066_d09_12_same_day_breadth_regime_joint_receipt_20261007_v0_1.json`

Decision cutoff:
`2026-10-07T23:55:26+08:00`.

Official TWSE evidence frozen before the cutoff:
- TAIEX close 49,806.37, daily move -16.18 / approximately -0.03%;
- stock-direction breadth: 588 up / 387 down / 99 flat / 5 unmatched / 3 N-A;
- comparable N = 1,074;
- advance share = 54.7486%;
- decline share = 36.0335%;
- net advance-minus-decline = +18.7151 percentage points;
- comparable coverage = 99.2606%.

The existing D18 TAIEX formula is reused unchanged:
- MA20 = 47,577.466;
- five-session MA20 slope = +666.0845;
- return5 = +3.8929%;
- return20 = +5.2404%;
- RV5 = 0.0093696879;
- RV20 = 0.0095963706;
- RV5/RV20 = 0.9763782851;
- trendContext = UP_TREND_CONTEXT;
- volatilityDirection = VOL_CONTRACTING.

TPEx same-clock breadth remains UNKNOWN because an equally verified current denominator was not frozen in this receipt.

Critical cross-date falsification:
- 2026-10-06 replay: cap-weighted TAIEX positive while descriptive stock breadth was weak/negative;
- 2026-10-07 prospective bounded receipt: cap-weighted TAIEX slightly negative while TWSE stock breadth is positive.

Thus:
`CAP_WEIGHTED_INDEX_DIRECTION != EQUAL_STOCK_DIRECTION_BREADTH`
and the divergence sign is not stable day to day.

Maturity decision:
- D09-12: L2/40 -> L3/60;
- reason: first bounded same-date prospective joint receipt validates Taiwan PIT source/semantic/replay feasibility under one decision cutoff;
- this is not L4, not predictive Alpha, not a canonical BROAD_POSITIVE/BROAD_NEGATIVE claim.

Exact next:
BR-067 accumulate independent same-clock joint receipts, preferably with both TWSE and TPEx breadth plus continuity-certified median-return context; no outcome join before D16 common-support/OOS preregistration.

Formal Core unchanged.


## BR-066 — D09-12 same-day breadth × regime joint receipt (2026-10-07)

Artifacts:
- `research/BR066_D09_12_SAME_DAY_BREADTH_REGIME_JOINT_RECEIPT_20261007_V0_1.md`
- `research/br066_d09_12_same_day_breadth_regime_joint_receipt_20261007_v0_1.json`

A bounded same-date joint receipt was frozen at 2026-10-07T23:55:26+08:00:
- TAIEX close = 49,806.37;
- TWSE stock-direction breadth = 588 up / 387 down / 99 flat / 5 unmatched / 3 N-A;
- comparable N = 1,074;
- advance share = 54.7486%;
- decline share = 36.0335%;
- net advance-minus-decline = +18.7151 percentage points;
- TAIEX context under unchanged D18 formula = UP_TREND_CONTEXT / VOL_CONTRACTING;
- TPEx equivalent same-clock denominator remains UNKNOWN;
- no forward outcome was opened.

Adjacent-session falsification:
- 2026-10-06 replay witness: TAIEX positive while breadth was weak;
- 2026-10-07 same-date witness: TAIEX slightly negative while TWSE direction breadth was positive.

Frozen:
`CAP_WEIGHTED_INDEX_DIRECTION != EQUAL_STOCK_DIRECTION_BREADTH`.

D09-12 is promoted L2/40 -> L3/60 on Taiwan PIT data/replay feasibility only.
No BROAD_POSITIVE/BROAD_NEGATIVE canonical label, predictive Alpha or L4 claim is created.

Exact next:
BR-067 accumulate independent same-clock receipts with broader venue/continuity coverage before any D16 OOS validation.

## BR-068 — D09-05 post-midnight parent-readiness reconciliation (2026-10-08)

Artifact:
- `research/BR068_D09_05_POST_MIDNIGHT_PARENT_READINESS_20261008_V0_1.md`

D09-05 remains L2/40.

The isolated Above-MA20/60 builder remains ready, but the first live research receipt remains bound to the genuine same-generation C1 parent required by BR-035.

Latest causal state:
- prior scheduled C1 attempt = FORMAL_SCAN_NOT_CONFIRMED / C1_GENERATION_NOT_FOUND;
- FINANCIAL official-quality acquisition was not ready;
- QUARTER_EPS was downstream-blocked;
- MOPSOV transport incompatibility was narrowed to Node fetch/undici;
- a native-HTTPS repair candidate exists but production deployment/live readback is not established by Room07;
- SDA-016 T48 finalization is separate completeness debt, not the immediate missing-generation root cause.

At the bounded readback after 00:15 Asia/Taipei, the expected 00:10 C1 workflow run was not yet observable in the Actions list.

Frozen classification:
`SCHEDULE_NOT_YET_OBSERVED`, not failure, missed, zero-pick or no-signal.

Exact next:
consume the first real C1 scheduled run when observable and inspect the actual readiness/population artifact. Only a scanDate=2026-10-07 same-generation complete/readback-verified research-eligible parent may unlock the frozen Above-MA builder. No substitute universe.

Formal Core unchanged.


## BR-047 — AI data-center theme spans different formal industries (2026-10-08)

Artifact:
- `research/BR047_AI_DATA_CENTER_CROSS_INDUSTRY_THEME_BRIDGE_20261008_V0_1.md`

A second theme family now validates the D09-11 many-to-many bridge beyond ABF.

Current official/issuer-native bridge:
- 2382 Quanta — TWSE Computer and Peripheral Equipment — AI/cloud server product/manufacturing edge;
- 2308 Delta — TWSE Electronic Parts/Components — AI data-center power/cooling/infrastructure edge.

Frozen:
- `THEME_MEMBERSHIP != FORMAL_INDUSTRY_MEMBERSHIP`;
- `SHARED_THEME != SHARED_ECONOMIC_EDGE`;
- `SHARED_THEME != EQUAL_EXPOSURE_WEIGHT`.

Exposure magnitude remains UNKNOWN unless issuer-native and scope-compatible.

D09-11 remains L3/60.
No stock outcome or Formal change.

Exact next:
BR-048 create effective-dated exposure vintages where issuer-native product/revenue/capacity evidence changes over time; no indefinite carry-forward of a static theme label.


## BR-073 — third independent official TWSE stock-breadth date (2026-10-08)

Artifact:
- `research/br073_twse_advance_decline_third_date_20261008_v0_1.json`

Official TWSE stock-only counts:
- up 425;
- down 540;
- unchanged 109;
- unmatched 3;
- N/A 5;
- comparable N = 1,074;
- total state N = 1,082.

Derived under the unchanged denominator:
- advance = 39.5717%;
- decline = 50.2793%;
- unchanged = 10.1490%;
- net advance-minus-decline = -10.7076 percentage points;
- comparable coverage = 99.2606%.

This is the third independent official TWSE breadth date after:
- 2026-10-02;
- 2026-10-07.

The 2026-10-08 receipt is one evidence root. If D09-12 later consumes the same date after a same-clock official TAIEX context receipt becomes available, consumer count must not increase independent evidence-root count.

D09-04 remains L3/60.
No stock outcome or L4 promotion.

Exact next:
continue independent official TWSE dates under the same denominator; TPEx is admitted only with accepted same-clock official transport; no L4 before D16 common-support/OOS validation.


## BR-074 — D09-04 three-date breadth D16 handoff (2026-10-08)

Artifacts:
- `research/BR074_D09_04_THREE_DATE_ADVANCE_DECLINE_D16_HANDOFF_20261008_V0_1.md`
- `research/BR074_D09_04_D16_VALIDATION_DEPENDENCY_REQUEST_20261008.md`

Independent official TWSE market-date roots now equal 3:
- 2026-10-02;
- 2026-10-07;
- 2026-10-08.

The independent unit is the market-date breadth root. D5/D20/D60 horizons, D09-12 consumption, index-context joins and multiple transforms do not increase independent N.

Current:
- independent date N = 3;
- predictive/stock outcomes opened = 0;
- inference readiness = POWER_INSUFFICIENT;
- D09-04 remains L3/60.

Room11/D16 must freeze date clustering/weighting, common support, horizon multiplicity, missing TPEx/strategy-universe policy, redundancy controls and power disposition before any predictive access.

Exact next:
continue official TWSE dates outcome-blind; consume D16 method return when available; no L4 until prospective/OOS evidence is adequate under the frozen method.

Formal Core unchanged.


## BR-075 — D09-08 size-leadership D16 preregistration (2026-10-08)

Artifacts:
- `research/BR075_D09_08_SIZE_LEADERSHIP_D16_PREREG_20261008_V0_1.md`
- `research/BR075_D09_08_D16_VALIDATION_DEPENDENCY_REQUEST_20261008.md`

Frozen:
- independent unit = common-complete size-TRI market date;
- all Taiwan50 / MidCap100 / SmallCap300 legs must share a common total-return basis;
- D1/D5/D20/D60 are repeated horizons, not independent dates;
- price-index-complete does not equal TRI-complete;
- partial/missing legs do not increment complete-date N.

Current complete-date N = 1.
Opened predictive outcomes = 0.
Inference state = POWER_INSUFFICIENT.

D09-08 remains L3/60.

Room11/D16 must freeze date dependence, horizon multiplicity, sector/effective-membership/liquidity/breadth/concentration/regime controls and missingness policy before predictive use.

Exact next:
accumulate genuinely new common-complete official TRI dates and consume D16 method return when available.

Formal Core unchanged.


## BR-076 — 2026-10-08 D09-12 same-clock eligibility guard

Artifact:
- `research/br076_d09_12_20261008_same_clock_eligibility_v0_1.json`

The 2026-10-08 official TWSE breadth root exists through BR-073:
- up 425 / down 540 / flat 109;
- comparable N 1,074;
- net advance-minus-decline share -10.7076 percentage points.

Repository and Actions audit found no genuine 2026-10-08 prospective A2 TAIEX close/context observation under the same decision clock.

Therefore 2026-10-08 is frozen as:
`PROSPECTIVE_BREADTH_ONLY_CONTROL / NOT_A_GENUINE_D09_12_JOINT_RECEIPT`.

Current retrievability of the official 2026-10-08 TAIEX close cannot be backfilled into prior same-clock evidence.

D09-12 remains L3/60.
Independent genuine same-clock joint receipt N remains 1.
No outcome opened.

## BR-077 — seventh official TWSE sector lifecycle date

Artifact:
- `research/br077_twse_sector_lifecycle_seventh_date_20261008_v0_1.json`

Official TWSE 2026-10-08 industry total-return block was frozen on 2026-10-09 12:24 Asia/Taipei, before the 2026-10-09 regular-session close.

Unchanged 34-industry semantics:
- positive industries = 17/34 = 50.0%;
- state = MIXED_PARTICIPATION;
- prior 2026-10-07 state = 25/34 positive = MIXED_PARTICIPATION;
- direction = NARROWING_WITHIN_MIXED.

Top3:
1. 油電燃氣 +3.04%;
2. 通信網路 +1.02%;
3. 水泥 +0.83%.

Prior top3:
- 玻璃陶瓷;
- 塑膠;
- 油電燃氣.

Top3 overlap = 1/3.
Top3 turnover = 2/3.

Top-quartile leader set uses ranks 1-9.
Top9 overlap with 2026-10-07 = 4/9:
- 油電燃氣;
- 塑膠;
- 紡織纖維;
- 橡膠.

This is one shared official root consumed by D09-06 and D09-07; consumer count does not create two independent evidence roots.

Sequence length:
7 official dates:
2026-09-23, 09-24, 09-30, 10-01, 10-02, 10-07, 10-08.

D09-06 remains L3/60.
D09-07 remains L3/60.
The 2026-10-09 close was not opened at capture, so the next-session close endpoint remained immature.

Exact next:
- continue append-only official 34-industry states;
- keep D16 lifecycle/OOS method as the L4 gate;
- add effective-dated member breadth/concentration before treating sector-index leadership as broad member leadership.

Formal Core unchanged.


## BR-078 — D09-08 second common-complete size-TRI date (2026-10-09)

Artifact:
- `research/BR078_D09_08_SECOND_COMMON_COMPLETE_SIZE_TRI_DATE_20261008_V0_1.md`

The completed 2026-10-08 TWSE session supplies all three size legs on one official total-return-index basis:
- Taiwan 50 TRI: -1.28%;
- Mid-Cap 100 TRI: -0.03%;
- Small-Cap 300 TRI: -0.25%.

Frozen D1 ordering:
`MID > SMALL > LARGE`.

Spreads:
- small - large = +1.03 percentage points;
- mid - large = +1.25 percentage points;
- small - mid = -0.22 percentage points.

Independent unit remains:
`COMMON_COMPLETE_SIZE_TRI_MARKET_DATE`.

Complete-date N:
`1 -> 2`.

D5/D20/D60 compatible reference joins remain PENDING; no price-index splice, interpolation, carry-forward or zero fill is allowed.

The receipt was frozen before the 2026-10-09 close, so the next-session close endpoint remained unopened.

D09-08 remains L3/60.
Inference remains POWER_INSUFFICIENT.
Exact next remains additional common-complete TRI dates plus the BR-075 D16 method gate.

Formal Core unchanged.
