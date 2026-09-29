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


---

## DR-035 — D12-10 session clock must be split at the 18:10 decision boundary

TAIFEX defines the TX after-hours session as 15:00 Taipei to 05:00 the following day, and attributes those trades to the following regular trading session. The expiring TX contract has no after-hours session on its last trading day.

For the System 1 / System 2 after-market decision clock at 18:10 Taipei, the night session is **not one information object**.

Required partition:

1. `NIGHT_PRE_SCAN` = 15:00 -> 18:10
   - observable by the 18:10 decision;
   - PIT-eligible if captured with an immutable timestamp.

2. `NIGHT_POST_SCAN` = 18:10 -> 05:00
   - future information for the 18:10 selector;
   - may be eligible for later monitoring / next-morning decisions only.

3. `NIGHT_FULL_SESSION` = 15:00 -> 05:00
   - future-contaminated outcome for the 18:10 decision;
   - cannot be backfilled as a selector feature.

This corrects an earlier coarse interpretation that treated “Taiwan night futures after scan” as if the whole night session occurred after the scan.

Status: DECISION-CLOCK PARTITION FROZEN.

---

## DR-036 — Taiwan evidence supports absorption / continuity, not a universal night-up => day-up rule

A 2024 PLOS ONE study of TX regular and after-hours sessions (2017-2022, 1,220 observations) finds:
- strong price continuity between after-hours close and the following regular-session open;
- after-hours trading efficiently absorbs European, U.S. and Taiwan post-market information;
- prior after-hours return had a negative relation with subsequent regular-session return in the estimated mean equation;
- after-hours volatility did not significantly transmit into the following regular-session volatility in the same specification;
- the study interprets the night session as an information/risk absorption channel.

This directly falsifies a monotonic textbook rule:
`nightReturn > 0 => nextRegularReturn > 0`.

The useful question is instead:
**How much of the information available by 18:10 has already been absorbed by TX, and what residual remains after controlling global futures?**

Status: ABSORPTION MODEL, NOT DIRECTIONAL ORACLE.

---

## DR-037 — researchable 18:10 features

The first feature family must use only `NIGHT_PRE_SCAN`.

Raw, assumption-light features:

- `nightPreScanReturnFromOpen` = log(TX_18:10 / TX_15:00_open)
- `nightPreScanReturnFromSettlement` = log(TX_18:10 / prior_regular_settlement)
- `nightPreScanHighLowRange`
- `nightPreScanRealizedVol` from frozen bar frequency
- `nightPreScanVolume`
- `nightPreScanVolumeZ` versus a trailing same-window baseline
- `nightPreScanDistanceFromHigh`
- `nightPreScanDistanceFromLow`
- `nightPreScanReversalFromExtreme`

No full-night last/high/low/volume may enter the 18:10 feature set.

### Contract rule

Use a pre-registered front-contract rule with roll/expiry flags. On the expiring contract's last trading day, there is no after-hours session for that expiring contract, so a naive continuous “front month” series can silently jump to the next contract.

Required metadata:
- contractMonth;
- daysToExpiry;
- rollFlag;
- lastTradingDayFlag;
- sourceSession;
- capturedAt.

Status: PRE-SCAN RAW FEATURE CONTRACT FROZEN.

---

## DR-038 — Taiwan-specific residual is higher-value than raw night direction

TAIFEX after-hours trading overlaps foreign-market hours. Therefore raw TX night return is likely to contain:
- U.S./global equity repricing;
- Taiwan-specific interpretation of that repricing;
- Taiwan post-close corporate/policy information;
- local basis/liquidity noise.

The incremental hypothesis should isolate the Taiwan-specific component.

### Candidate global controls

Same-window 15:00->18:10 returns for:
- S&P 500 futures proxy;
- Nasdaq-100 futures proxy;
- semiconductor futures proxy;
- optional USD/TWD or USD context when a PIT-compatible intraday source exists.

TAIFEX itself lists U.S. S&P 500, Nasdaq-100 and PHLX Semiconductor futures as after-hours products from 15:00 to 05:00, offering a same-exchange candidate control set, subject to liquidity/tracking-quality checks.

### Candidate residual

A pre-registered research-only model may estimate:

`txNightResidual = txPreScanReturn - betaBroad*broadFutureReturn - betaTech*techFutureReturn - betaSemi*semiFutureReturn`

Rules:
- beta window must be frozen before outcome testing;
- beta uses only prior dates;
- no dynamic window chosen because it predicts outcomes better;
- if control contracts are illiquid/stale, mark UNKNOWN rather than force zero.

A simpler baseline must always be tested first:
- raw TX pre-scan return;
- raw U.S. futures return;
- TX minus U.S. broad return;
before allowing a multi-beta residual.

Status: TAIWAN-SPECIFIC NIGHT RESIDUAL CANDIDATE.

---

## DR-039 — public historical daily night data create an 18:10 look-ahead trap

TAIFEX public historical daily after-hours files identify the full 15:00->05:00 session by the **following trading date**. Those files are suitable for full-session description but not for reconstructing the exact 18:10 state.

TAIFEX FAQ states:
- individual futures/options trades are publicly downloadable for the past 30 trading days;
- older transaction-level historical data require application/purchase;
- TAIFEX does not provide a historical database API.

Therefore:

`FREE_LONG_HISTORY_1810_NIGHT_SNAPSHOT = NOT_ESTABLISHED`.

Research choices:
1. **Prospective capture** at/just before 18:10 -> preferred clean PIT Shadow route.
2. **Recent 30-trading-day replay** from transaction data -> useful for parser/replay QA, not enough for robust inference.
3. **Purchased historical transaction data** -> possible future long-history route if approved and licensing permits.
4. Full-session daily night OHLC -> outcome/descriptive only for the 18:10 selector.

This is a data-provenance limitation, not evidence against the economic hypothesis.

Status: HISTORICAL PIT GATE FROZEN.

---

## DR-040 — outcome decomposition and falsification

Primary targets:

A. **Next cash open gap**
- likely first location where overnight information is incorporated.

B. **Next regular open-to-close**
- tests whether the night signal contains continuation/reversal information beyond opening incorporation.

C. **Next D1 close-to-close / MAE / MFE**
- secondary risk/continuation targets.

D. **Selection-environment outcomes**
- hit rate / MAE / stop incidence for System 1 / System 2 candidates selected at 18:10.

Mandatory controls:
- prior Taiwan regular return / market Regime;
- prior U.S. cash close information already known before Taiwan day session;
- same-window U.S. futures / tech / semiconductor futures;
- Taiwan breadth / sector RS;
- expiry/roll state;
- night liquidity / stale quote state;
- scheduled macro-event clock.

Falsification:
1. if TX pre-scan adds nothing beyond same-window U.S. futures, mark REDUNDANT;
2. if result is only next-open gap and disappears open-to-close, classify execution/opening context rather than after-market stock alpha;
3. if full-night data work but 18:10-cut data do not, reject for the 18:10 selector as LOOK_AHEAD_ARTIFACT;
4. if results disappear outside crisis dates, classify CRISIS_ONLY;
5. date-shift placebo;
6. leave-one-date-out;
7. separate normal, expiry/roll and macro-event days;
8. same-window volume/liquidity quality filter fixed before outcome testing.

Status: FALSIFICATION MATRIX FROZEN.

---

## DR-041 — D12-10 maturity decision

D12-10 advances **L1 -> L2**.

Why:
- session/date semantics are frozen;
- 18:10 PIT partition is explicit;
- Taiwan evidence supports the absorption mechanism while falsifying simple directional continuation;
- public historical-data limitations are identified;
- raw/residual feature families and outcome decomposition are pre-registered;
- explicit redundancy tests against global futures are defined.

Why not L3:
- no durable prospective 18:10 TX snapshot receipts yet;
- no same-window replay corpus with immutable knownAt semantics has been validated;
- no independent-date Taiwan outcome evidence has been accumulated under the frozen contract.

Formal Core remains LOCKED. No 18:10 score, risk throttle, veto or ranking weight is approved.

## Exact next continuation after DR-041

1. Create a research-only `NIGHT_PRE_SCAN` receipt at 18:10 with TX plus same-window global control futures.
2. Validate recent transaction-level replay against live/prospective snapshots.
3. Accumulate independent dates before any L3 review.
4. Cross-link D12-10 with D13 scheduled macro-event clock so 18:10 states are not compared across incompatible event regimes.


---

## DR-042 — prospective receipt firewall is now executable, not only conceptual

D12 source research now has an executable isolated receipt layer:
- unified `global_market_receipt_guard_v0_1.mjs`;
- TAIWAN VIX receipt builder;
- TX NIGHT_PRE_SCAN receipt builder.

The guard enforces:
- offset-aware source clocks;
- observed/captured/known ordering;
- first eligible Taiwan decision;
- latency/entitlement state;
- stale/missing state;
- future-information rejection;
- deterministic receipt hashing.

Receipt hash/digest protects replay integrity; it does not prove source truth by itself. Source identity/quality remain separate evidence.

Status: PIT FIREWALL IMPLEMENTED / RESEARCH ONLY.

---

## DR-043 — TAIWAN VIX source state can be validly missing before the publication session

TAIFEX publishes TAIWAN VIX during the regular session, not continuously overnight.

At the 2026-09-30 05:20 source-only capture clock:
- the day's regular VIX publication session had not started;
- therefore a same-day VIX value did not yet exist as a clean source receipt for the later 18:10 decision.

Correct action:
- do not use prior/current webpage state as if it were same-session VIX;
- do not fabricate a numeric value;
- wait for an actual official same-session observation;
- if a scheduled capture later fails, record SOURCE_MISSING/UNKNOWN.

This is a concrete falsification of “every factor must have a number every run.”

Status: MISSING-AS-EVIDENCE SEMANTICS CONFIRMED.

---

## DR-044 — TAIWAN VIX receipt contract

Clean receipt requires:
- source timestamp within 09:00-13:45 Taipei;
- official 15-second publication grid;
- finite positive VIX;
- captured/known before target decision;
- public-official source entitlement;
- rules-regime version.

Quality states remain separate:
- VIX_VALID_OFFICIAL;
- VIX_STALE_OR_HALTED;
- VIX_SOURCE_MISSING;
- VIX_RULES_REGIME_UNCERTAIN.

Stale/halt/missing are preserved but never count as clean coverage.

The payload explicitly prohibits directional interpretation. VIX remains expected-volatility/risk-pricing evidence first.

Status: VIX RECEIPT CONTRACT EXECUTABLE.

---

## DR-045 — NIGHT_PRE_SCAN receipt prevents full-night leakage

A clean TX NIGHT_PRE_SCAN receipt requires:
- exact 15:00 Taipei source-window start;
- observedAt <= 18:10;
- mandatory TAIFEX sourceSessionDate for following-regular-session attribution;
- contract month, DTE and roll state;
- last-trading-day guard;
- OHLC/volume/trade-count integrity.

The same first-known receipt may never later be mutated with:
- 18:10-05:00 prices;
- final full-night high/low/volume;
- next-open outcomes.

Later source versions must be separate receipts with their own eligibility clock.

Status: NIGHT-PRE-SCAN LEAKAGE FIREWALL EXECUTABLE.

---

## DR-046 — D12 evidence bottleneck moves from semantics to independent dates

D12-05 and D12-10 remain L2 / 40%.

Why no promotion:
- executable data contracts show feasibility;
- no actual multi-date source coverage yet;
- no replay/correction incidence evidence for these lanes;
- no outcome evidence.

Next:
1. capture real TAIWAN VIX and TX NIGHT_PRE_SCAN on eligible dates;
2. characterize missing/stale/roll/event states outcome-blind;
3. only then compare VIX against D04 realized-volatility/ATR and night residual against admissible global controls;
4. use independent date as inference unit.

Formal Core remains LOCKED.
