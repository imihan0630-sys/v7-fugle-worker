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


---

## DR-016 — Implied-volatility term structure: near risk and long risk are different

A single VIX/IV level collapses maturities that can price different risks.

### Candidate state
For matched moneyness/delta:
- nearIV
- nextIV
- fartherIV
- termSlope = fartherIV - nearIV
- nearEventPremium = nearIV - interpolated longer-horizon baseline

### Interpretation
Near IV > farther IV may reflect:
- near-term event/crash risk,
- supply/demand stress,
- expiry-specific scarcity.

Farther IV > near IV may reflect:
- calmer near term with persistent longer uncertainty,
- ordinary upward term structure.

### Evidence
Volatility-term-premium research shows term-structure prices and premia vary across horizons and can contain information for option/variance returns.

Source:
- Federal Reserve Bank of New York Staff Report 867, Equity Volatility Term Premia.
- Vasquez (2017), JFQA, Equity Volatility Term Structures and the Cross Section of Option Returns.

### Guard
Term slope is not direct market direction.
It is a horizon distribution of priced uncertainty/risk premium.

Status: TERM-STRUCTURE LAYER FROZEN.

---

## DR-017 — Skew term structure separates immediate crash insurance from longer-tail pricing

Short-dated and longer-dated downside skew can reflect different forces.

Research on risk-neutral skewness term structure reports that short- and long-horizon skewness can carry different return information.

Source:
- The information content of the term structure of risk-neutral skewness (2020).

### Candidate fields
Using a frozen delta/moneyness definition:
- skewNear
- skewNext
- skewFar
- skewTermSlope
- downsideWingRichness
- skewShock

### Positive mechanism
Short-dated downside put richness can reveal immediate protection demand / event risk.

### Counter-mechanism
It can also reflect:
- market-maker inventory,
- temporary supply shortage,
- illiquidity,
- strike discreteness,
- expiry concentration.

### Mandatory controls
- bid/ask quality;
- OI/volume;
- expiry;
- delta/moneyness;
- price-limit/market stress;
- surface-fit quality.

Status: TAIL-RISK TERM STRUCTURE CANDIDATE.

---

## DR-018 — Public OI cannot identify dealer gamma exposure sign

Gamma itself is computable for a contract conditional on a pricing model.
But **dealer gamma exposure (GEX)** additionally requires knowing or assuming who owns which side.

Public OI tells:
- total open contracts.

It does not tell:
- dealer long vs short;
- customer long vs short;
- OTC offsets;
- intraday opening/closing flows;
- futures/stock hedge inventory.

### Safe outputs
If only public OI exists:
- unsignedGammaConcentration
- strikeGammaMassProxy
- OIWeightedGammaMagnitude

Do NOT label:
- dealerGexPositive / dealerGexNegative
unless participant-side inventory is actually identified.

### Research role
High gamma concentration near spot/expiry may indicate stronger potential hedge sensitivity, but hedge **direction** remains assumption-dependent.

Status: GEX-SIGN INFERENCE PROHIBITED WITHOUT POSITION SIDE.

---

## DR-019 — “Max pain” is not the same as documented expiration pinning

### Evidence that is real
Ni, Pearson & Poteshman (2005) document that optionable U.S. stocks cluster more often near option strike prices on expiration dates and link the effect partly to hedge rebalancing and other expiration mechanisms.

Source:
- Journal of Financial Economics 78(1), Stock price clustering on option expiration dates.

### What this does NOT prove
It does not establish the popular claim:
> price is pulled toward the one strike that minimizes total option-holder payout ("max pain").

Strike pinning:
- local clustering near strikes.

Max-pain theory:
- convergence to a specific chain-wide payout-minimizing strike.

Those are different hypotheses.

### Taiwan research decision
Do not add “max pain” to the system.

If expiration clustering is ever tested:
- preregister nearest-heavy-strike / OI-concentration hypotheses;
- separate weekly/monthly expiries;
- compare to non-expiry control days;
- do not select the strike after the close.

Status: MAX-PAIN INDICATOR REJECTED; EXPIRY-PINNING MECHANISM RETAINED.

---

## DR-020 — Futures curve and roll: front basis is not enough

Near expiry, front-contract basis converges mechanically toward spot/final settlement conditions.

Therefore track:
- front contract;
- next contract;
- days to each expiry;
- front fair-value-adjusted basis;
- next fair-value-adjusted basis;
- calendar spread;
- roll window.

### Roll states
- NORMAL_FRONT
- PRE_ROLL
- EXPIRY_DAY
- POST_ROLL_RESET

### Research question
Does abnormal basis persist across both front and next contracts?
If only the expiring front looks extreme while next contract is normal, the signal may be expiry mechanics rather than broad sentiment.

### Dividend/carry guard
Expected dividends differ by horizon; front-vs-next fair values require horizon-consistent dividend/rate assumptions.

Status: CURVE/ROLL CONTEXT REQUIRED.

---

## DR-021 — Foreign cash × futures × options must be read as a joint exposure state

Single-market labels are ambiguous.

### Candidate joint states

A. Cash buy + futures net-short increasing
- possible long-cash hedge / basis/risk reduction.

B. Cash buy + futures short decreasing / long increasing
- more aligned directional risk-on state.

C. Cash sell + futures net-short increasing
- more directionally consistent risk-off state.

D. Cash sell + futures short decreasing
- cash reduction with derivative hedge removal / mixed state.

Then add option context:
- put/call position changes;
- skew/VIX;
- expiry.

### Important rule
Do not call any state "foreign investor forecast" before prospective validation.

### Normalization
Use:
- futures notional / cash net flow;
- net OI change / total OI;
- price/index move;
- basis;
rather than raw contracts alone.

Status: JOINT-EXPOSURE HYPOTHESIS FROZEN.

---

## DR-022 — Taiwan derivatives do contribute to price discovery, but dominance is state/mechanism dependent

### Taiwan evidence
Hsieh, Lee & Yuan (2008) find futures have a dominant tendency in price discovery relative to index options, while options still contribute non-trivially; results depend on the method used to infer option-implied spot.

Chen & Gau (2009) find stock/futures/options price-discovery shares can change after tick-size changes because relative transaction costs/liquidity change.

Later Taiwan work also finds meaningful price-discovery competition between regular/mini futures, with liquidity/arbitrage mechanisms affecting which contract leads.

Sources:
- Journal of Futures Markets 28 (2008), 354-375.
- Journal of Futures Markets 29 (2009), 74-93.
- Journal of Futures Markets 41 (2021), 926-948.

### Night-session evidence
Taiwan after-hours futures trading was introduced to allow reactions to global events while cash is closed. Research theses/studies find night trading is materially influenced by U.S. market information and affects the price-discovery process.

### System implication
Night futures can be an early next-cash-session information channel.
But our global radar already contains U.S. indices, so incremental value must be tested.

Potential comparison:
- U.S. index move alone
vs
- U.S. move + TAIEX night futures residual move.

The residual may capture Taiwan-specific interpretation.

Status: NIGHT-FUTURES RESIDUAL INFORMATION CANDIDATE.

---

## DR-023 — Official TAIFEX data feasibility is strong, but IV surface requires computation/cleaning

Official TAIFEX currently provides historical/current public data for:
- TXO volume/OI PCR;
- TAIEX options volatility index;
- institutional futures/options trades and OI;
- full option daily chain by expiry/strike/call-put with prices, settlement, volume, OI and best bid/ask;
- futures/options contract specifications and expiry information.

The option daily market table is available historically from early TXO history and distinguishes general/night sessions in query semantics.

### What is not directly solved by a daily chain
To construct a robust IV surface, research still needs:
- spot/futures reference;
- rate;
- expected dividend/carry;
- time-to-expiry;
- option pricing/inversion method;
- stale/zero-bid filtering;
- quote-quality rules.

### Point-in-time advantage
Unlike analyst consensus, much of this derivative data is exchange-native and historically queryable, making clean historical research more feasible.

### Caveats
- contract definitions/weekly products changed over time;
- night-session introduction is a structural break;
- expiry series composition evolves;
- current product mechanics must not be backfilled into earlier regimes without version awareness.

Status: DATA FEASIBILITY HIGH.

---

## DR-024 — Minimal prospective/historical Derivatives Shadow schema

### Date/session identity
- tradeDate
- session = REGULAR / NIGHT
- capturedAt
- source
- rulesRegimeVersion

### Futures
- spotIndexClose/reference
- frontContract
- frontDaysToExpiry
- frontPrice
- rawBasis / basisBps
- fairBasis / abnormalBasis
- nextContract / nextBasis
- calendarSpread
- totalOI / deltaOI
- volume

### Institutional futures
Per dealer/trust/foreign:
- tradeLong / tradeShort / tradeNet
- OILong / OIShort / OINet
- deltaOINet
- normalizedNetOI
- notional

### Options aggregate
- volumePCR
- oiPCR
- totalCall/Put volume
- totalCall/Put OI
- expiryComposition
- expiryDay/roll flags

### Volatility/tail
- taifexVix
- vixChange
- realizedVolTrailing
- ivVsTrailingRv
- nearIV / nextIV
- termSlope
- skewNear / skewNext
- skewTermSlope
- surfaceCoverage
- surfaceFitQuality

### Joint context
- foreignCashNet
- cashFuturesDivergenceState
- marketRegime
- breadthState
- liquidityRegime
- globalOvernightState

### Data quality
- missingContractCount
- staleQuoteCount
- zeroBidExcludedCount
- liquidStrikeCount
- surfaceMethodVersion
- rates/dividend source
- UNKNOWN fields

### Pre-registered hypotheses
H1. Derivative risk-state features improve next-session volatility/drawdown prediction more consistently than return direction.
H2. Fair-value-adjusted basis adds more information than raw basis.
H3. Foreign futures positioning is more informative jointly with cash flow/basis than standalone raw net contracts.
H4. IV/skew shocks identify tail-risk regimes but their direction-return relation is conditional.
H5. Night-futures residual vs global-index move adds Taiwan-specific next-open information.
H6. Aggregate PCR has horizon/expiry dependence and should not have a universal threshold.

### Falsification
Downgrade/remove if:
- effect is only expiry mechanics;
- raw global indices explain night-futures result;
- VIX/skew add no value beyond realized volatility/Regime;
- institutional positions are unstable after cash-flow hedge controls;
- surface results depend heavily on one interpolation/filter choice;
- only one PCR cutoff/window works.

Status: FIRST DERIVATIVES PROTOCOL FROZEN.

## Exact next continuation after DR-024

DR-025: Build redundancy map versus existing Global Radar / Regime / ATR / breadth.
DR-026: Separate prediction targets: return direction vs volatility vs drawdown vs gap.
DR-027: Study event-conditioned IV around CPI/Fed/earnings/global shocks without look-ahead.
DR-028: Define point-in-time historical rules-regime segments for weekly options/night trading/product changes.
DR-029: Concept convergence and evidence-readiness gate.
DR-030: Then open the next untouched lane: Portfolio/Risk Construction & correlation clusters.


---

## DR-025 — Redundancy map: derivatives must beat existing market-risk context

| Derivatives candidate | Closest existing context | Incremental question |
|---|---|---|
| TAIEX VIX level/change | ATR / market volatility Regime | forward option-implied risk vs trailing realized risk |
| IV vs trailing RV | ATR / realized volatility | option insurance richness |
| skew | drawdown/overheat/regime | tail-risk price asymmetry |
| futures basis | index trend / foreign flow | futures-vs-cash relative pricing after carry |
| futures OI | volume/activity | leveraged risk-transfer participation |
| foreign futures net OI | foreign cash flow | hedge-adjusted derivative exposure |
| PCR | market sentiment proxies | option demand composition |
| night futures residual | U.S. indices/global radar | Taiwan-specific interpretation of global news |
| expiry state | calendar | mechanical contamination guard |

### Validation order
1. existing price/volatility Regime;
2. global market returns;
3. Taiwan cash-market breadth/liquidity;
4. foreign cash flow;
5. derivative candidate.

If a derivative signal vanishes after these controls, it should remain descriptive or be removed.

Status: REDUNDANCY GATE FROZEN.

---

## DR-026 — Derivatives may predict risk better than direction

Do not force every feature into “tomorrow up/down.”

Separate targets:

### Direction
- next open gap
- D1/D3/D5 index residual return

### Volatility
- next-session realized range/variance
- 5D realized volatility

### Downside risk
- next-session MAE
- 5D max drawdown
- probability/magnitude of large downside tail

### Cross-sectional environment
- stock return dispersion
- breadth deterioration
- liquidity stress

### Why
VIX/skew are directly tied to distribution/risk pricing. They may be useful for predicting:
- how violent,
- how asymmetric,
- how uncertain
the next state is,
without reliably predicting sign.

### System implication
Potential future benefit may be:
- risk throttle,
- confidence/context,
not stock ranking.

No production risk throttle is approved.

Status: TARGET DECOMPOSITION FROZEN.

---

## DR-027 — Event-conditioned IV must be treated differently from ordinary IV

Known scheduled macro events:
- central-bank decisions;
- CPI / inflation;
- employment reports;
- major Taiwan/global election or policy events where relevant;
can concentrate near-term option premium.

### Research state
For a scheduled event known at t:
- eventWithin1D/3D/5D
- nearIVPremiumVsNext
- skewShift
- preEventPCR/OI
- postEventVolCrush

### Key mechanism
High near-term IV before a scheduled event can mean:
- expected large move,
not:
- expected down move.

After event resolution, IV can fall sharply even if price falls.

### Look-ahead guard
Only use events and release times that were scheduled/known before t.
Do not retroactively tag “surprise news” into a pre-event scheduled-risk feature.

### Redundancy
Our macro radar already knows some scheduled events; derivative features should test whether **market pricing of those events** adds information beyond event presence alone.

Status: EVENT-RISK PRICING CANDIDATE.

---

## DR-028 — Historical rules-regime segmentation is mandatory

Taiwan derivatives market design changed over time:
- weekly option variants/product availability;
- after-hours trading introduction;
- contract/strike availability;
- market participation;
- margin/position rules;
- quote/data fields.

A long historical backtest that applies 2026 mechanics to all years is structurally wrong.

### Required snapshot metadata
- productRulesVersion
- nightSessionAvailable
- expiryTypeAvailable
- contractMultiplier
- settlementRuleVersion
- strikeListingRegime
- dataFieldCoverage

### Structural-break policy
When rules change:
- analyze pre/post separately first;
- do not pool until stability is demonstrated.

### Example
Night-session features cannot exist before that session existed.
Friday weekly contracts cannot be backfilled before their product regime.

Status: RULES-VINTAGE CONTROL FROZEN.

---

## DR-029 — Concept convergence / evidence readiness

The derivatives lane now covers:
- PCR/OI semantics;
- trader-type information;
- VIX / implied volatility;
- skew and term structure;
- variance risk premium look-ahead;
- futures fair basis;
- institutional hedge ambiguity;
- option OI/Greeks limits;
- expiry/settlement/night session;
- price discovery;
- max-pain rejection / pinning distinction;
- official data feasibility;
- joint cash/futures/options state;
- target decomposition;
- event-conditioned IV;
- historical rules regimes;
- redundancy/falsification.

### Evidence readiness

DESCRIPTIVE_READY:
- official PCR/VIX/institutional/futures/option-chain data with explicit date/session/expiry.

SURFACE_READY:
- enough liquid strikes/expiries plus frozen IV inversion/filter/rate/dividend method.

INFERENTIAL_READY:
- independent dates across multiple volatility/expiry regimes;
- current project maturity/date-cluster controls;
- no threshold/data-method cherry-picking.

### Concept status
CONCEPT_COMPLETE / EVIDENCE_PENDING.

Further derivatives indicator invention should pause.

## Exact next continuation after DR-029

Open the next under-studied lane:
**Portfolio & Risk Construction / Correlation Clusters**

Priority questions:
- equal capital != equal risk;
- correlation clusters can create hidden concentration across different stock codes;
- volatility scaling and marginal contribution to risk;
- drawdown correlation and crisis correlation;
- sector/ABF/AI-chain concentration;
- first/add/full sizing versus portfolio-level risk;
- whether fixed per-stock caps should remain the sole sizing framework;
- all research-only unless owner later approves Formal changes.


---

## DR-030 — D12-08 reopened: Gamma sign is inventory-side, not Call-vs-Put

D12-08 was still L0 in the learning tracker even though DR-018 had already frozen the warning that public OI cannot identify dealer GEX sign. This section reconciles the curriculum and turns that warning into an explicit research contract.

Gamma measures how Delta changes when the underlying changes. For a standard long option position, both long calls and long puts carry positive Gamma; short calls and short puts carry negative Gamma. Therefore the popular shortcut:

- Call OI = positive Gamma
- Put OI = negative Gamma

is **not a mathematical identity**. It is an inventory-side assumption about who owns versus wrote those options.

CME option-Greeks education explicitly notes that options have positive Gamma values in the long-option convention; Cboe's market-maker discussion likewise distinguishes market impact by whether dealers are net long or short Gamma, not by Call versus Put label.

### System rule

Any public-data GEX implementation that assigns sign from Call/Put alone must be named an **ASSUMPTION_SCENARIO**, not `dealerGex`.

Status: SIGN-SEMANTICS FROZEN.

---

## DR-031 — TAIFEX public data can support Gamma concentration, but not exact option-market-maker signed GEX

Official TAIFEX public data provide two useful but differently granular objects.

### A. Option-chain market data
Daily option-chain reports expose, by active series:
- contract / contract date;
- strike;
- Call/Put;
- price / settlement;
- volume;
- open interest;
- bid/ask.

This is enough to compute a model-consistent Gamma per series after freezing underlying reference, rate/dividend/forward convention, DTE, IV inversion/filter and quote-quality rules.

### B. Major institutional trader data
TAIFEX also publishes dealer-class Call/Put long/short open-interest totals.

But the public institutional table is aggregated by product and Call/Put. It does **not** publicly cross-tab dealer-class inventory by:
- strike;
- exact expiry;
- position side at each strike-expiry node.

TAIFEX further defines “Dealers” as Futures Proprietary Merchants and Securities Dealers. That population is broader than a clean “option market makers only” set.

Therefore:

`EXACT_PUBLIC_OPTION_MARKET_MAKER_GEX = NOT_IDENTIFIED`.

### Correct TAIFEX direction mapping

TAIFEX states:
- buy calls + sell puts are grouped as “long”;
- sell calls + buy puts are grouped as “short”.

For Gamma sign this means:
- CALL dealer long OI = buy Call = positive Gamma;
- CALL dealer short OI = sell Call = negative Gamma;
- PUT dealer long OI = sell Put = negative Gamma;
- PUT dealer short OI = buy Put = positive Gamma.

The word “long” in the TAIFEX institutional table is therefore a **directional grouping**, not always “long option Gamma”.

Status: PUBLIC-IDENTIFIABILITY LIMIT FROZEN.

---

## DR-032 — Researchable layer 1: unsigned Gamma concentration

Even without signed dealer inventory, public chain data can support an honest market-structure measure.

For each strike-expiry node, after a frozen Gamma calculation:

`unsignedGamma1Pct = gamma × OI × contractMultiplier × underlying² × 0.01`

Interpretation:
- approximate absolute Delta-notional sensitivity associated with a 1% underlying move;
- not a dealer hedge-flow forecast;
- units and underlying convention must be explicit.

Candidate descriptors:
- `totalUnsignedGamma1Pct`
- `nearSpotGammaShare`
- `nearExpiryGammaShare`
- `gammaConcentrationHHI`
- `topGammaNodeStrike`
- `topGammaNodeDistancePct`

### Critical falsification

Gamma weighting must beat a simpler OI-only concentration measure. If:
- Gamma-weighted concentration adds no information beyond OI,
then the extra model complexity is rejected.

### No “Gamma wall” language by default

A high-Gamma/high-OI strike is not automatically support, resistance or a price magnet.

Peer-reviewed expiration research documents strike-price clustering and finds market-maker hedge rebalancing can contribute, but the effect is specifically tied to expiration mechanics and is not proof that every large-Gamma node behaves as a universal wall.

Status: UNSIGNED-GAMMA CONCENTRATION CANDIDATE.

---

## DR-033 — Researchable layer 2: partial-identification bounds for dealer-class Gamma

There is a more rigorous middle ground between:
- pretending exact dealer GEX is observable; and
- giving up on signed information entirely.

Use the same-date TAIFEX aggregate dealer-class Call/Put long/short OI counts and the strike-expiry market OI capacities to calculate a **partial-identification interval**.

### Bound logic

For each Call/Put side:
1. compute Gamma for every eligible strike-expiry node;
2. use each node's market OI as the maximum capacity for dealer long or dealer short contracts at that node;
3. respect the published aggregate dealer-class contract totals;
4. solve the minimum possible signed dealer-class Gamma by allocating positive-Gamma inventory to the lowest-Gamma capacity and negative-Gamma inventory to the highest-Gamma capacity;
5. solve the maximum by reversing those allocations.

A linear-program implementation is preferred for exact capacity handling.

Outputs:
- `dealerClassGammaLower`
- `dealerClassGammaUpper`
- `boundWidthNormalized`
- `gammaSignIdentified`

Sign rule:
- lower > 0 => POSITIVE;
- upper < 0 => NEGATIVE;
- interval includes 0 => UNKNOWN.

If source universes/date/session cannot be reconciled, result is also UNKNOWN.

### Naming firewall

This object must be called:
`TAIFEX_REPORTED_DEALER_CLASS_GAMMA_BOUND`

It must **not** be called:
- exact market-maker GEX;
- exact dealer hedge demand;
- exact Gamma flip.

This preserves the difference between “what public data constrain” and “what we wish we knew”.

Status: PARTIAL-IDENTIFICATION DESIGN FROZEN.

---

## DR-034 — Expected market mechanism and falsification target

Cboe explains the standard dynamic-hedging mechanism:
- a long-Gamma market maker tends to hedge opposite the market move, potentially damping moves;
- a short-Gamma market maker tends to hedge in the same direction, potentially amplifying moves.

A 2024 Journal of Economic Dynamics and Control simulation study similarly finds positive net Gamma of dynamic hedgers reduces volatility/increases stability, while negative Gamma increases volatility/fragility.

This supports a **conditional market-quality mechanism**, not a deterministic direction rule.

### Primary research targets
1. next-session realized range / variance;
2. intraday reversal versus momentum after large moves;
3. liquidity / spread stress;
4. price dwell/crossing near Gamma concentration nodes.

### Secondary targets
- index direction only after the risk/volatility targets;
- stock-level outcomes only after market and sector controls.

### Mandatory controls
- TAIEX VIX / realized volatility;
- DTE / moneyness;
- weekly/monthly expiry and settlement-window state;
- quote quality / stale bids;
- scheduled macro-event state;
- global shock state;
- liquidity regime.

### Falsification
Reject or downgrade signed-Gamma use if:
- dealer-class bounds cross zero on most independent dates;
- results disappear after expiry/event controls;
- OI-only concentration performs as well as Gamma-weighted concentration;
- results depend on one IV/filter/forward convention;
- apparent node “pinning” exists only after choosing the winning strike/window ex post.

### Maturity decision
D12-08 advances from **L0 -> L2**:
- mechanism defined;
- public-data identifiability limit defined;
- negative evidence and falsification defined;
- machine-readable research contract frozen in `research/d12_08_gamma_exposure_identifiability_spec_v0_1.json`.

It does **not** advance to L3 because no prospective PIT receipt set has yet established real same-date/session evidence.

Formal Core remains LOCKED. No score, veto, risk throttle or ranking weight is approved.

## Exact next continuation after DR-034

1. Build a research-only prospective TAIFEX chain + dealer-aggregate receipt with exact date/session/universe reconciliation.
2. Implement unsigned Gamma concentration plus dealer-class lower/upper bound calculator.
3. Accumulate independent normal, expiry and scheduled-event dates before any L3 review.
4. In parallel continue D12-10 night-futures/overnight information from L1 -> L2, because its mechanism can be researched without waiting for Gamma prospective evidence.
