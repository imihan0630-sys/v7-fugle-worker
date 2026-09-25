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
