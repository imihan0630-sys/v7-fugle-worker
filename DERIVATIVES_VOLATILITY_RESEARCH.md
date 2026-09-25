# Derivatives Information & Volatility Surface Research
# 衍生性商品資訊＋波動率曲面

Started: 2026-09-25 Asia/Taipei
Status: ACTIVE RESEARCH LANE
Scope: Research-only / Shadow. Formal Core unchanged.

## Purpose

研究臺股期貨/選擇權提供的前瞻風險與交易人需求資訊，補足目前股票現貨 K線、價量、RS、Regime、微結構、廣度與基本面事件的視角。

核心問題：
1. Put/Call Ratio 到底在測什麼？成交量 PCR 與未平倉 PCR 是否應分開？
2. 外資期貨淨多空是方向預測、避險需求，還是兩者混合？
3. 隱含波動率、VIX、偏斜(skew)與波動率曲面能否描述市場風險，而不是被誤用成簡單多空指標？
4. 期貨基差應如何扣除利率、股息、到期時間與轉倉因素？
5. 到期/結算/夜盤如何改變訊號語意？
6. 這些市場層資訊能否增量改善我們的 Regime / risk-on/off 判斷，而不是直接挑個股？

## Existing-system audit

Current main `Worker.js` source contains no explicit production/research fields for:
- Put/Call Ratio / PCR
- TAIFEX VIX
- implied volatility
- volatility skew/surface
- futures basis
- open interest
- foreign futures positioning

This is therefore a genuinely under-studied information layer.

---

## DR-001 — Derivatives data are mostly market-state/context information, not a stock-picking oracle

Index futures/options summarize:
- hedging demand,
- leverage demand,
- volatility/tail-risk pricing,
- market expectations,
- liquidity and dealer positioning,
- basis/carry,
- institutional portfolios.

For our system the natural first use is:
- market Regime,
- risk state,
- entry aggressiveness research,
- crash/tail-risk diagnostics,
not:
- “PCR=120 -> buy stock X”.

Status: MARKET-CONTEXT LAYER FIRST.

---

## DR-002 — Put/Call Ratio is not one variable

TAIFEX officially publishes TXO:
- Put volume
- Call volume
- volume PCR
- Put open interest
- Call open interest
- OI PCR

Official page notes the table combines weekly-expiry contracts and monthly expiries.

Source:
- TAIFEX TXO Put/Call Ratio

### Distinct meanings

#### Volume PCR
`putVolume / callVolume`
Measures today's trading activity mix.

#### OI PCR
`putOpenInterest / callOpenInterest`
Measures outstanding contract stock, accumulated over time.

These can diverge materially.

### Key limitation
Public aggregate PCR does NOT reveal:
- whether a put was bought or sold;
- whether trade opened or closed a position;
- strike/moneyness;
- expiry;
- trader identity;
- delta-equivalent directional exposure.

Therefore aggregate PCR cannot be translated mechanically into bearish/bullish positioning.

Status: PCR SEMANTICS FROZEN.

---

## DR-003 — Signed/opening option flow and aggregate PCR are different information objects

Pan & Poteshman (2006) find predictive information in put-call ratios constructed from **buyer-initiated opening option volume**, a proprietary signed-flow measure.

Source:
- Review of Financial Studies 19(3), The Information in Option Volume for Future Stock Prices.

This is materially richer than a public aggregate volume PCR.

### Taiwan evidence
Chang, Hsieh & Lai (2009) study TAIEX options by trader type:
- aggregate option volume as a whole did not predict spot-index changes in their sample;
- foreign institutional options trading showed predictive information, especially around near-the-money/middle-horizon options.

Source:
- Journal of Banking & Finance 33(4), 757-764.

### Newer Taiwan counterpoint
A 2025 Pacific-Basin Finance Journal study reports market-wide PCR helped condition Taiwan option-writing strategies and outperformed VIX-based conditioning in that study; institutional PCRs were less effective than market aggregate PCR.

Source:
- Pacific-Basin Finance Journal 90 (2025), 102687.

### Conclusion
No universal hierarchy:
- aggregate PCR,
- signed opening flow,
- trader-type positions,
- moneyness-specific flow,
have different semantics and can produce different evidence.

Status: NO “ONE TRUE PCR”.

---

## DR-004 — TAIFEX VIX is expected volatility pricing, not a direction forecast

TAIFEX publishes the TAIEX Options Volatility Index using the CBOE VIX formula.

Source:
- TAIFEX Taiwan VIX daily/minute index pages.

### Meaning
VIX-type indices summarize option prices into a model-free-ish measure of expected variance over a forward horizon under risk-neutral pricing.

High VIX can reflect:
- higher expected volatility;
- stronger demand for downside insurance;
- higher volatility risk premium;
- market stress/uncertainty.

It does **not** mathematically mean:
- index must fall tomorrow.

Markets can rally while VIX remains high, and VIX can fall during stable declines.

### Research states
- IV_LEVEL
- IV_CHANGE
- IV_SHOCK
- IV_TERM_STRUCTURE
- IV_VS_REALIZED
- IV_WITH_PRICE_REGIME

Status: VOLATILITY/RISK STATE, NOT DIRECTIONAL ORACLE.

---

## DR-005 — Volatility skew/smirk carries tail-risk information

Option implied volatility varies by strike.

A common downside-skew concept compares:
- OTM put IV
against
- ATM option/call IV.

Xing, Zhang & Zhao (2010) find steeper individual-stock volatility smirks predict lower future stock returns in their sample.

Source:
- Journal of Financial and Quantitative Analysis, "What Does the Individual Option Volatility Smirk Tell Us About Future Equity Returns?"

Other research finds call-put IV differences / put-call parity deviations can contain return information.

Source:
- Cremers & Weinbaum (2010), JFQA.

### Interpretation
Steeper downside skew may reflect:
- crash insurance demand;
- informed bearish flow;
- supply/demand imbalances;
- short-sale constraints;
- volatility risk pricing.

Not every cause is directional information.

### Taiwan initial focus
Use index-option skew first, because single-stock options may be too sparse for broad coverage.

Status: TAIL-RISK CANDIDATE.

---

## DR-006 — Volatility surface construction is itself a model-risk problem

Ulrich & Walther (2020) show option-implied variance/skew/variance-risk-premium estimates can differ economically depending on volatility-surface construction, especially in OTM puts.

Source:
- Review of Derivatives Research 23, 323-355.

### Research consequence
Do not:
- scrape a few strikes,
- interpolate casually,
- call the result “the skew”.

Need frozen choices:
- expiry horizon;
- moneyness/delta definition;
- quote filtering;
- stale/zero-bid handling;
- interpolation/extrapolation;
- rate/dividend inputs;
- minimum liquidity.

Every material surface-construction variant is a separate experiment.

Status: MODEL-RISK GUARD FROZEN.

---

## DR-007 — Variance Risk Premium is not simply VIX minus past volatility

Variance risk premium literature defines a gap between option-implied variance and expected/realized variance under the physical measure.

Bollerslev, Tauchen & Zhou find strong aggregate return-predictive evidence in their U.S. sample, particularly at intermediate horizons, but results depend importantly on model-free implied variance and high-frequency realized variance.

Sources:
- Review of Financial Studies 22(11), 4463-4492.
- Annual Review of Financial Economics (2018) survey.

### Look-ahead trap
If we compute:
`IV_t - realizedVariance_{t+1:t+N}`
the future realized variance is an **outcome**, unavailable at t.

A live feature may instead use:
- IV_t minus a frozen forecast of future realized variance;
- or `IV_t / trailingRealizedVol` as a state proxy.

But these are not the same object as ex-post realized VRP.

### Naming
- `ivVsTrailingRv` = contemporaneous proxy/state.
- `exPostVariancePremiumOutcome` = research outcome only.
- `forecastVarianceRiskPremium` only with a pre-event variance forecast model.

Status: LOOK-AHEAD BOUNDARY FROZEN.

---

## DR-008 — Futures basis must be adjusted for carry and dividends

Raw basis:
`FuturesPrice - SpotIndex`

But equity-index futures fair value depends on:
- financing/risk-free rate,
- expected dividends,
- time to expiry,
- market frictions.

A discount is not automatically bearish and a premium is not automatically bullish.

### Candidate measures
- rawBasisPoints
- basisBps
- daysToExpiry
- theoreticalFairBasis
- abnormalBasis = observedBasis - fairBasis
- annualizedAbnormalBasis

### Taiwan-specific issue
Dividend season can materially alter fair carry for TAIEX futures.

### Counterpoint
Abnormal basis may still contain sentiment/inventory/constraint information; research in other markets shows sentiment can contribute to basis deviations.

Status: FAIR-VALUE-ADJUSTED BASIS REQUIRED.

---

## DR-009 — Open interest measures participation/risk transfer, not net market direction

Futures/open-option interest is the number of outstanding contracts.

Every futures contract has a long and a short.
Therefore:
- total OI increasing does not mean “more bulls than bears”.

Possible meanings:
- more hedging demand,
- more speculation,
- larger risk-transfer activity,
- greater market participation.

Hong & Yogo (2012 working-paper/research stream) find futures-market open interest can carry macro/asset-price information, illustrating that OI is potentially informative—but not as a simple sign signal.

Source:
- NBER Working Paper 16712.

### Research interactions
- price up + OI up
- price up + OI down
- price down + OI up
- price down + OI down

These are hypotheses about participation/position buildup, not universal textbook laws.

Status: OI PARTICIPATION STATE.

---

## DR-010 — Foreign futures net shorts can be hedge, alpha, basis, or cross-market inventory

TAIFEX publishes institutional trading/open-interest by:
- dealers,
- investment trusts,
- foreign institutions.

Official TAIFEX itself warns these statistics are for reference and should be cited carefully to avoid misleading interpretation.

Source:
- TAIFEX institutional trading information.

### Why “foreign net short = bearish” is unsafe
Foreign investors may simultaneously hold:
- Taiwan cash equities,
- ETFs,
- options,
- futures in other sizes/maturities,
- ADR/global tech exposure.

A short TAIEX futures position can hedge a large long cash portfolio.

### Research features
Separate:
- daily trade net
- end-of-day OI net
- change in net OI
- net OI normalized by total OI
- notional value
- expiry/roll state
- cash-equity foreign net flow
- option position context

### Better question
Does a **change** in foreign futures exposure add information beyond foreign cash flow, market return, basis, volatility and expiry state?

Status: HEDGE-CONFOUND CONTROL MANDATORY.

---

## DR-011 — Option OI by call/put is not directional exposure without side information

For options:
- long call is positive delta;
- short call is negative delta;
- long put is negative delta;
- short put is positive delta.

Public call OI alone does not reveal which side the institution/public holds unless side-specific position data are available.

Even when trader-class long/short option statistics exist, aggregation across:
- strikes,
- expiries,
- calls/puts,
can obscure delta/gamma/vega exposure.

### Rule
Do not transform:
“lots of put OI”
into:
“market very bearish”.

Need strike/expiry/side and preferably Greeks for exposure interpretation.

Status: OPTION-OI DIRECTIONALITY GUARD FROZEN.

---

## DR-012 — Expiry composition contaminates aggregate PCR and OI time series

TAIFEX TXO has:
- monthly contracts,
- weekly Wednesday contracts,
- weekly Friday contracts,
with contract-specific last trading days/settlement.

The public PCR table aggregates weekly and monthly expiries.

### Consequences
Around expiration:
- contracts disappear;
- new series are added;
- OI mechanically drops/rolls;
- moneyness distribution shifts;
- gamma/time decay changes quickly.

Therefore a PCR change across expiry cannot automatically be treated as a sentiment change.

### Required context
- daysToNearestExpiry
- expiryDayFlag
- week/month contract composition
- roll/reset flag
- OI by expiry where available

Status: EXPIRY-COMPOSITION GUARD REQUIRED.

---

## DR-013 — Taiwan option settlement mechanics matter for intraday interpretation

TAIFEX TXO:
- European style;
- regular session 08:45–13:45;
- expiring contract stops at 13:30;
- night session 15:00–05:00, but expiring contracts have no night session on last trading day;
- final settlement uses the average underlying index over the final 30 minutes of spot trading.

Source:
- TAIFEX TXO contract specification.

### Consequence
On expiry day:
- final 30-minute spot-index behavior has settlement relevance;
- option/futures positions can be closed/rolled;
- normal PCR/OI relationships may distort.

Create:
- NORMAL
- WEEKLY_EXPIRY
- MONTHLY_EXPIRY
- SETTLEMENT_WINDOW
- POST_EXPIRY_RESET

Do not pool all days.

Status: SETTLEMENT REGIME FROZEN.

---

## DR-014 — Night-session information must not be mixed blindly with regular-session daily data

Taiwan index derivatives trade after the cash market closes.

This is valuable because:
- U.S./global events occur while Taiwan cash is closed;
- night futures/options can reprice before next cash open.

But it creates timestamp semantics:
- “date” in vendor/TAIFEX records must be mapped to the correct trading session;
- overnight move may already explain next-day cash gap.

### Candidate decomposition
- cashCloseToNightClose/05:00
- nightSessionReturn
- preOpenFuturesGap
- nextCashOpenGap
- overnightIVChange

### Key research question
Does night-session repricing add anything beyond U.S. indices / global radar already monitored?

High redundancy is plausible.

Status: OVERNIGHT INFORMATION CANDIDATE WITH REDUNDANCY RISK.

---

## DR-015 — First derivatives feature architecture

Do not create a single “derivatives sentiment score.”

Separate latent layers:

### 1. Directional / positioning
- futures fair-value-adjusted basis
- participant net-OI changes
- cash-vs-futures positioning divergence
- option signed-position proxies when valid

### 2. Volatility / uncertainty
- TAIEX VIX level/change
- IV vs trailing/forecast realized vol
- term structure

### 3. Tail-risk pricing
- downside skew
- put wing richness
- call-put IV spread

### 4. Participation
- futures OI / changes
- options volume/OI
- option-to-futures/cash activity where denominator is valid

### 5. Expiry/mechanics guard
- days to expiry
- settlement window
- weekly/monthly composition
- night/day session

### 6. Data-quality/model-risk
- quote coverage
- surface fit quality
- stale strike count
- minimum OI/volume
- model version

The first research target is market-state classification and incremental Regime information, not stock selection.

Status: ARCHITECTURE V1 FROZEN.

## Exact next continuation after DR-015

DR-016: IV term structure / calendar spread — expected near-term event risk vs longer risk.
DR-017: Skew term structure and crash-insurance demand.
DR-018: Delta/gamma exposure proxies and why public OI cannot prove dealer GEX sign.
DR-019: “Max pain” theory/evidence audit — likely reject unless robust evidence exists.
DR-020: Futures roll/basis curve and front-vs-next contract information.
DR-021: Foreign cash × futures × options joint state, with hedge ambiguity.
DR-022: Taiwan-specific evidence on futures/options price discovery and night-session information.
DR-023: Official TAIFEX data-source feasibility and point-in-time historical availability.
DR-024: Freeze minimal derivatives Shadow snapshot schema and falsification protocol.
