# Corporate Actions & Capital Supply Research

Status: RESEARCH_ONLY / CONCEPT_BUILD / Formal Core LOCKED
Updated: 2026-09-25 Asia/Taipei

## Boundary

This lane studies how corporate actions change:
- shares outstanding / float / potential float;
- capital structure;
- mechanical reference prices;
- dilution or contraction of equity supply;
- the interpretation of price, volume, EPS and institutional flow.

Core topics:
- treasury-share repurchases;
- cash capital increases / seasoned equity offerings;
- rights/ex-right mechanics;
- stock dividends / capitalization;
- capital reduction;
- convertible bonds and bond-to-stock conversion;
- stock splits/reverse splits where applicable;
- action timing and actual-versus-announced execution.

This lane does NOT assume:
- buyback = bullish;
- capital increase = bearish;
- convertible bond = immediate dilution;
- ex-right/ex-dividend price drop = negative return.

No Formal rule changes without explicit owner approval.

---

## CA-001 — Separate ANNOUNCED equity supply from REALIZED equity supply

Corporate actions have lifecycles.

Examples:
- buyback announced -> actual repurchase -> cancellation / transfer / other disposition;
- cash capital increase announced -> priced -> subscribed -> new shares delivered/listed;
- convertible bond issued -> outstanding -> converted or redeemed;
- capital reduction announced -> suspended/resumed -> new share base effective.

Therefore never map:
announcement -> immediate full share-count change.

Frozen layers:
- ANNOUNCED
- APPROVED/REGISTERED
- IN_PROGRESS
- COMPLETED
- REALIZED_SHARE_CHANGE
- CANCELLED/EXPIRED
- UNKNOWN.

Status: ACTION-LIFECYCLE MODEL FROZEN.

---

## CA-002 — Taiwan share-repurchase purposes are economically different

Securities and Exchange Act Article 28-2 allows listed/OTC companies to repurchase shares for:
1. transfer to employees;
2. equity-conversion purposes related to warrants/convertible securities;
3. maintaining company credit/shareholder equity, with repurchased shares cancelled.

The total repurchase may not exceed 10% of issued shares.

Primary source:
- Securities and Exchange Act Article 28-2:
  https://twse-regulation.twse.com.tw/en/law/DOC01_print.aspx?FLCODE=FL007009&FLNO=28-2

### Consequence
Only purpose 3 directly implies cancellation under the statutory purpose.
Employee-transfer/equity-conversion repurchases do not automatically shrink long-run shares outstanding.

Status: BUYBACK PURPOSE MUST BE PRESERVED.

---

## CA-003 — Buyback plan size is not actual buyback size

Current Taiwan repurchase rules require announcement of:
- purpose;
- planned period;
- planned shares;
- price range;
- monetary ceiling;
and completion status after the program.

The repurchase period must generally be completed within two months, with completion/execution status publicly announced afterward.

Primary source:
- Regulations Governing Share Repurchase by Exchange-Listed and OTC-Listed Companies:
  https://law.fsc.gov.tw/EngLawContent.aspx?id=2851&lan=E

### Required metrics
- plannedRepurchaseShares
- actualRepurchasedShares
- executionRate = actual/planned
- averageRepurchasePrice
- cancelledShares
- purpose
- firstAnnouncedAt
- completionAnnouncedAt

### Research rule
Use announcement size only as intended demand.
Use actual repurchase as realized company demand.
Use cancellation as realized equity-supply contraction.

Status: INTENT / EXECUTION / CANCELLATION SEPARATED.

---

## CA-004 — Buyback announcement effect is not enough; credibility matters

Taiwan research finds positive announcement reactions in many samples, but governance and actual execution affect credibility.

Evidence:
- Wu (2012), Corporate Governance: An International Review:
  corporate-governance quality affects repurchase announcement credibility and execution behavior.
- Taiwan 2026 research on repeated buyback announcements finds positive reactions can transfer to industry peers and vary by announcement frequency.

Counter-evidence:
Other Taiwan long-horizon research finds weak or no persistent abnormal outperformance after repurchase announcements.

### System implication
Do not create:
BUYBACK_ANNOUNCED = bullish score.

Potential useful variables:
- execution history;
- current execution rate;
- purpose;
- valuation/cash/debt context;
- cancellation intent;
- repeated-announcement history.

Status: BUYBACK = CONTEXTUAL SIGNAL / SUPPLY EVENT, NOT MONOTONIC ALPHA.

---

## CA-005 — Cash capital increase creates new equity supply, but the economic meaning is conditional

Taiwan listed/OTC companies conducting cash capital increases issue new shares under securities issuance rules; listed/OTC firms generally allocate a portion for public offering subject to current regulations.

Primary source:
- Regulations Governing the Offering and Issuance of Securities by Securities Issuers, Article 17:
  https://twse-regulation.twse.com.tw/tw/law/DOC01_print.aspx?FLCODE=FL007033&FLNO=17

### Potential negative channels
- EPS dilution;
- more float/supply;
- adverse-selection/signaling;
- agency/free-cash-flow risk.

### Potential positive channels
- funding positive-NPV growth;
- balance-sheet repair;
- debt reduction;
- capacity expansion that later raises earnings.

Taiwan evidence is mixed across samples and governance/use-of-proceeds.

Status: SEO/CASH INCREASE ≠ AUTOMATIC BEARISH.

---

## CA-006 — Use of proceeds is a first-order conditioning variable

A cash increase used for:
- debt repayment;
- working capital;
- capacity expansion;
- acquisition/investment;
can have different risk/return implications.

Taiwan research reports heterogeneous post-SEO outcomes depending on company quality/governance and use of capital.

### Research fields
- statedUseOfProceeds
- debtRepaymentFlag
- workingCapitalFlag
- capexFlag
- acquisitionFlag
- otherFlag
- proceedsNTD
- sharesIssued
- issuePrice
- dilutionPct
- governance/context controls

### Guard
Management-stated purpose is not proof of realized economic success.
Outcome validation remains separate.

Status: PROCEEDS PURPOSE REQUIRED.

---

## CA-007 — SEO event stages must be separated

For cash capital increases, relevant clocks can include:
- board/shareholder announcement;
- regulatory effective registration;
- pricing;
- ex-right date;
- subscription/payment period;
- allotment/new-share delivery;
- listing/trading of new shares.

Taiwan event studies show market response can differ materially across these stages.

### Rule
Do not use one generic “capital increase date.”

Status: MULTI-CLOCK SEO EVENT MODEL FROZEN.

---

## CA-008 — Ex-right and ex-dividend price changes are mechanical unless measured against the correct reference

TWSE publishes ex-right reference-price formulas incorporating:
- prior close;
- cash dividend;
- subscription price;
- subscription ratio;
- stock dividend ratio.

Official source:
- TWSE Ex-right Price Data:
  https://wwwc.twse.com.tw/en/announcement/ex-right/twt49u.html

### Consequence
A raw close-to-open percentage can look like a large loss even when it is mostly a mechanical reference-price adjustment.

### Mandatory firewall
For technical/event research:
- rawPriceReturn
- referenceAdjustedReturn
must remain distinct.

Status: CORPORATE-ACTION REFERENCE PRICE FIREWALL REQUIRED.

---

## CA-009 — Capital reduction also mechanically rebases price and share count

TWSE publishes capital-reduction reference-price formulas for:
- cash refund;
- loss write-off;
- capital reduction plus cash injection.

Official source:
- https://wwwc.twse.com.tw/en/announcement/reduction/twtauu.html

### Economic channels differ
Cash-return reduction:
- returns capital to shareholders;
- reduces share count/capital base.

Loss-offset reduction:
- accounting restructuring;
- no equivalent cash distribution.

Reduction + cash injection:
- combines contraction and new issuance.

### Rule
Do not group all “capital reduction” as one bullish/bearish event.

Status: CAPITAL REDUCTION SUBTYPES FROZEN.

---

## CA-010 — Technical indicators need action-adjusted history or explicit discontinuity guards

Unadjusted price series around:
- ex-rights;
- ex-dividend;
- capital reduction;
- stock split/reverse split;
can create fake:
- gaps;
- support breaks;
- moving-average crosses;
- ATR spikes;
- momentum collapses.

### Research requirement
For each data provider/history series, determine:
- raw vs adjusted prices;
- adjustment methodology;
- adjustment timestamp/vintage;
- volume/share adjustments.

If unknown:
CORPORATE_ACTION_ADJUSTMENT_UNKNOWN.

Never mix adjusted history with raw live prices without a documented bridge.

Status: PRICE-SERIES ADJUSTMENT AUDIT REQUIRED.

---

## CA-011 — EPS and per-share growth also need share-count awareness

New shares from:
- cash increase;
- CB conversion;
- employee equity;
can dilute per-share metrics even if aggregate profit grows.

Buyback cancellation/capital reduction can move the opposite direction.

### Separate
- aggregate earnings growth;
- weighted-average shares;
- EPS change;
- shares outstanding change;
- fully diluted potential shares.

### Guard
EPS improvement caused mainly by denominator contraction is not equivalent to operating profit growth.

Status: NUMERATOR / DENOMINATOR DECOMPOSITION FROZEN.

---

## CA-012 — Convertible-bond issuance is potential dilution, not immediate full dilution

Current Taiwan securities rules require convertible-bond registration and define conversion procedures.
Conversion can be satisfied by:
- newly issued shares; or
- already issued shares,
depending on the issuer/terms.

Primary source:
- Regulations Governing the Offering and Issuance of Securities by Securities Issuers, Articles 27–37:
  https://twse-regulation.twse.com.tw/ENG/EN/law/DAT0201.aspx?FLCODE=FL007033

### Consequence
CB face value / conversion price gives a potential-share quantity only under the contractual assumptions.
Actual dilution depends on actual conversion and whether new shares are delivered.

Status: CB POTENTIAL DILUTION ≠ REALIZED DILUTION.

---

## CA-013 — CB events can interact with shorting/arbitrage

Taiwan research documents higher securities-borrowing/margin-short activity around convertible-bond announcement/pricing/issuance windows, consistent with convertible-arbitrage behavior in some samples.

Source:
- National Central University research on short selling and convertible-bond arbitrage, Taiwan 2007–2011.

### Integration
This connects to the existing Leverage & Shorting lane.

Possible state:
CB_EVENT x SBL_SHORT_FLOW

### Counterpoint
Historical research does not prove all modern CB-related shorting is arbitrage.
Do not classify trader intent from flow alone.

Status: CB/SHORT INTERACTION RESEARCH CANDIDATE.

---

## CA-014 — Conversion price and conversion premium matter, but terms can change

Research fields:
- faceValueOutstanding
- conversionPrice
- stockPrice
- conversionPremiumPct
- conversionPeriod
- reset/adjustment terms
- call/put/redemption terms
- newSharesVsTreasuryShareDelivery
- actualConvertedAmount

### Guard
A one-time conversion price snapshot can become stale after:
- ex-right/dividend adjustments;
- contractual resets;
- corporate actions.

Use point-in-time terms/vintage.

Status: CB TERMS MUST BE VINTAGED.

---

## CA-015 — Potential dilution should be expressed as a range, not a point truth

Simple upper-bound concept:
potentialNewShares = convertibleFaceValue / conversionPrice

But this can be wrong if:
- not all bonds convert;
- conversion price changes;
- treasury shares are delivered;
- bonds are redeemed/put/called;
- conversion period has not started.

### Research labels
- THEORETICAL_MAX_DILUTION
- CURRENT_CONVERTIBLE_DILUTION
- REALIZED_CONVERSION_DILUTION
- UNKNOWN.

Status: DILUTION RANGE SEMANTICS FROZEN.

---

## CA-016 — Equity-supply change should be normalized to existing float/share base

Absolute shares are not comparable across companies.

Candidate:
- announcedNewShares / sharesOutstanding
- actualNewShares / sharesOutstanding
- cancelledShares / sharesOutstanding
- convertedNewShares / sharesOutstanding
- netShareSupplyChangePct

Where float data are reliable:
- change relative to free float.

### Guard
Shares outstanding and free float are different denominators.
Do not call issued-share percentage “float dilution” unless free-float denominator is verified.

Status: SUPPLY-CHANGE NORMALIZATION FROZEN.

---

## CA-017 — Buyback plus new issuance can coexist

A firm can:
- repurchase shares;
- issue employee equity;
- have CB conversions;
- conduct cash capital increase;
within overlapping windows.

Looking at one action alone can misstate net share supply.

### Research concept
netEquitySupplyChange over a window =
realized new shares
- cancelled shares
+/- other verified share-base changes.

Do not net announced but unrealized quantities with realized quantities.

Status: NET EQUITY SUPPLY REQUIRES MATCHED REALIZATION STATES.

---

## CA-018 — Corporate actions can contaminate institutional-flow and volume interpretation

Examples:
- new-share listing creates fresh supply and unusual turnover;
- ex-right day creates mechanical reference change;
- buyback program creates issuer demand;
- CB arbitrage can create short flow.

Thus:
high volume + foreign selling
may reflect supply absorption rather than ordinary bearish conviction.

### Integration
Corporate Actions owns:
“Is there a mechanical/company-created supply-demand event?”

Price-Volume owns:
“How did price respond to participation?”

Leverage/Shorting owns:
“Did margin/SBL flows change?”

No duplicate score.

Status: CAUSAL-CONTEXT LAYER FROZEN.

---

## CA-019 — First non-directional state taxonomy

- NO_MAJOR_CAPITAL_ACTION
- BUYBACK_ANNOUNCED
- BUYBACK_IN_PROGRESS
- BUYBACK_COMPLETED_HIGH_EXECUTION
- BUYBACK_COMPLETED_LOW_EXECUTION
- BUYBACK_CANCELLATION_SUPPLY_CONTRACTION
- CASH_INCREASE_ANNOUNCED
- CASH_INCREASE_PRICED
- NEW_SHARES_PENDING
- NEW_SHARES_LISTED
- CB_ISSUED
- CB_CONVERSION_PRESSURE
- REALIZED_CB_DILUTION
- CAPITAL_REDUCTION_PENDING
- CAPITAL_REDUCTION_EFFECTIVE
- EX_RIGHT_DIVIDEND_MECHANICAL
- MULTIPLE_CAPITAL_ACTIONS
- DATA_INCOMPLETE
- UNKNOWN

No state maps directly to BUY/SELL.

Status: STATE TAXONOMY V1 FROZEN.

---

## CA-020 — First empirical protocol

### Primary hypotheses
H1 — Buyback credibility:
Higher actual execution/cancellation produces different forward behavior than low-execution announcement-only programs.

Counter:
Announcement information may be fully priced before execution.

H2 — Equity supply:
Large realized new-share supply relative to shares outstanding increases short-horizon absorption burden.

Counter:
Strong growth/proceeds use can dominate dilution.

H3 — SEO lifecycle:
Announcement, ex-right, allotment/listing have different price/volume behavior.

Counter:
After proper reference-price adjustment, some apparent effects may disappear.

H4 — CB dilution/arbitrage:
Low conversion premium / conversion activity with rising SBL flow may have different near-term pressure.

Counter:
CB financing can support firm value and short flow need not be directional information.

H5 — Mechanical price adjustment:
Raw technical signals around ex-right/reduction show materially more false breaks than reference-adjusted signals.

### Outcomes
- D1/D3/D5/D20
- MFE/MAE
- false breakout
- stop-first
- volume absorption
- institutional/SBL interaction
- EPS denominator effect

### Controls
- market/sector
- pre-event trend
- liquidity
- valuation
- company size
- governance where available
- use of proceeds
- event stage
- realized vs announced share change

### Anti-bias
- point-in-time event dates;
- current rule regimes;
- no future execution rate at announcement-time feature;
- reference-price firewall;
- announced and realized states kept separate;
- independent-date/event clustering.

Status: EMPIRICAL PROTOCOL V1 FROZEN.

---

## CA-021 — Concept convergence and next source audit

Highest likely system value:
1. prevent fake K-line/gap signals around corporate actions;
2. distinguish announced from realized equity supply;
3. add dilution/supply context to volume and institutional-flow interpretation;
4. distinguish credible executed buybacks from announcement-only intent;
5. connect CB conversion to short-flow research without asserting intent.

Formal Core remains LOCKED.

## Exact next continuation

CA-022: audit official TWSE/MOPS open-data endpoints for buyback announcement/completion records.
CA-023: audit cash-capital-increase/rights/new-share listing point-in-time sources.
CA-024: audit CB issue/conversion/outstanding data sources and machine contracts.
CA-025: audit current market-history adjustment semantics for ex-right/dividend/reduction.
CA-026: freeze minimal corporate-action Shadow schema and evidence-quality states.
CA-027: only then run small multi-date source validation; no outcome test until source contracts pass.


---

## CA-022 — Treasury-share official source audit

MOPS publicly exposes treasury-share basic information, expiration/completion information, threshold-triggered repurchase information, and employee-transfer information.

From 2026-05-01, amended treasury-share filing rules moved the filing/announcement process fully into MOPS electronic submission, strengthening prospective first-known provenance.

TWSE MOPS Push Service Package 2 provides structured official records including:
- U02 treasury-stock expiration/cancellation/transfer already performed;
- U03 repurchase exceeding a specified threshold;
- U17 board resolution to repurchase shares for employee-option fulfillment.

Conclusion:
- public human-query source = GO;
- official structured paid source = GO;
- stable free machine lifecycle endpoint = NOT YET FROZEN.

Execution rate and cancellation must not be reconstructed from headlines alone.

Status: TREASURY SOURCE CONTRACT = PUBLIC GO / STRUCTURED PAID GO / FREE MACHINE PARTIAL.

---

## CA-023 — Cash-capital-increase / new-share source audit

MOPS provides fundraising-plan execution, company capital increase/decrease summaries, significant-information announcements, and ex-right/dividend announcements.

TWSE MOPS Push Package 2 provides:
- U04 public notice before securities delivery under Company Act Articles 252/273;
- U05 stock listing approval;
- U18 new shares delivered for conversions/subscriptions of prior convertible/warrant bonds.

TWSE public ex-right/dividend reference-price pages provide downloadable CSV and formulas. TWSE Data E-Shop documents files containing subscription ratio/price, public/employee/shareholder allocations, and issued shares before/after ex-right or capital reduction/cash injection.

Conclusion:
The lifecycle is official-data feasible, but no single free machine feed has been established for:
board decision -> regulatory effectiveness -> pricing -> subscription -> paid-in completion -> actual new-share delivery/listing.

Status: SEO SOURCE = MULTI-SOURCE FEASIBLE / ONE-FEED CONTRACT NOT FROZEN.

---

## CA-024 — Convertible-bond source audit

Public MOPS exposes:
- domestic CB basic information;
- CB monthly reports;
- domestic/overseas securities conversion status;
- related bond announcements.

Structured MOPS Push data include:
- U18 new shares from prior CB/warrant conversion;
- U24 conversion suspension;
- U26 ownership-transfer suspension;
- U28 conversion start;
- U29 first conversion;
- U32 conversion-price change;
- U35 put-right exercise;
- U38 compulsory redemption/expiry/delisting;
- U41 CB fully converted to common stock or repurchased.

Package 3 also contains M18 monthly domestic/overseas securities conversion/exchange information.

Thus official content is strong enough to reconstruct issue terms, conversion start, conversion-price changes, conversion progress and completion/redemption. A stable free historical machine contract remains partial.

Status: CB CONTENT STRONG / FREE AUTOMATION CONTRACT PARTIAL.

---

## CA-025 — Current Formal history adjustment audit: material semantic risk

Current source calls Fugle historical daily candles with:
- timeframe D;
- fields open, high, low, close, volume, turnover, change;
- ascending order.

But the request does not explicitly pin adjusted=true or adjusted=false.

The mapping then retains date, close, high, low, volume and turnover while discarding open, change and provider adjustment metadata.

Fugle documents that:
- historical D/W/M candles support adjusted=true/false;
- daily change on ex-right/ex-dividend dates is calculated versus the adjusted previous close;
- adjusted=true returns an adjusted price sequence and an adjusted flag.

Current buildMarketFeatures directly uses stored closes/highs/lows for:
- ret20 / ret60;
- MA5 / MA10 / MA20 / MA60;
- ATR20;
- volatility20;
- priorHigh20 / priorLow20 / priorHigh60;
- platform range and related A/B setup state.

No corporate-action bridge/guard is applied first.

Mechanical reference resets in documented examples can be very large:
- 6752: 158.5 -> 150.95, about -4.76%;
- 4554: 36.95 -> 32.39, about -12.34%;
- 8422 par-value change: 250 -> 25, -90%;
- 3593 capital reduction: 8.1 -> 13.5, +66.67%;
- 8103 cash-refund reduction: 74.7 -> 86.11, +15.27%.

These are not ordinary market returns.

Therefore an unbridged corporate-action discontinuity can mechanically change MA ordering, MA distance, returns, ATR, platform highs/lows, support distance and A/B classification.

Status: CORPORATE_ACTION_HISTORY_SEMANTICS_RISK = CONFIRMED BY SOURCE/CODE AUDIT.

---

## CA-026 — Why blindly setting adjusted=true is not a safe Formal fix

A simple adjusted=true switch is NOT approved.

Reason 1 — Historical replay look-ahead:
For a historical target date, it must be proven that the adjusted series uses only actions effective by that target date. A later corporate action must not rewrite an earlier research information set.

Reason 2 — Benchmark semantics:
Formal RS compares stock ret20 with the official TAIEX price-index return. Dividend-adjusted stock returns versus an unaligned benchmark can change the meaning of RS.

Reason 3 — Volume/share-base breaks:
Price adjustment alone does not solve share-volume scaling after stock dividends, splits or capital reductions.

Preferred research model:
- RAW_EXECUTION_SERIES = actual traded prices;
- CONTINUITY_SERIES = point-in-time corporate-action bridged prices used only where technically justified;
- corporate-action event state retained separately.

Candidate point-in-time bridge:
actionFactor = referencePrice / previousClose.
Only actions effective on or before the scan/target date may enter the cumulative bridge.

Status: SIMPLE adjusted=true FORMAL CHANGE = NOT APPROVED.

---

## CA-027 — Existing provider can support an isolated Corporate Action registry

Fugle now documents dedicated corporate-action endpoints.

Dividends endpoint supplies:
- event date;
- previousClose;
- referencePrice;
- dividend type;
- cash dividend;
- stock-dividend shares;
- opening reference price;
- limit prices.

Capital-changes endpoint supplies:
- capital reduction;
- par-value change;
- split/reverse split;
- halt/resume dates;
- adjustment factor;
- prior/reference/opening-reference prices;
- reduction reason;
- refund per share;
- post-reduction rights-offering ratio/price.

These fields are enough for a Research/Shadow registry of major mechanical price resets.

They do not replace MOPS for treasury-share lifecycle, full SEO lifecycle, CB completion, or first-known announcement provenance.

Status: ISOLATED CORPORATE-ACTION REGISTRY = DATA-FEASIBLE.

---

## CA-028 — Minimal Corporate Action Shadow schema

Identity/provenance:
- eventKey, symbol, market;
- actionType/actionSubtype;
- announcedAt, firstKnownAt, effectiveDate, realizedDate;
- source, sourceCapturedAt, sourceVersion/hash;
- quality = ACTUAL / VERIFIED_OFFICIAL / MODELED / UNKNOWN.

Share supply:
- sharesOutstandingBefore/After;
- announcedShareChange;
- realizedShareChange;
- shareChangePct;
- freeFloat before/after only if verified.

Reference mechanics:
- previousClose;
- referencePrice;
- openingReferencePrice;
- adjustmentFactor;
- rawGapPct;
- referenceAdjustedGapPct.

Buyback:
- purpose;
- plannedShares;
- actualRepurchasedShares;
- executionRate;
- cancelledShares.

SEO:
- issueShares;
- issuePrice;
- subscriptionRatio;
- statedUseOfProceeds;
- newSharesDeliveryDate.

CB:
- faceValueOutstanding;
- conversionPrice;
- conversionStart;
- actualConvertedAmount;
- realizedNewShares;
- conversionPriceVersion.

Research flags:
- technicalContinuityRisk;
- volumeShareBaseBreak;
- decisionImpact=false;
- unknownReasons.

No corporate-action score.

Status: SHADOW SCHEMA V1 FROZEN.

---

## CA-029 — First source-validation protocol

Step A:
Select verified examples covering cash-dividend only, stock-dividend/ex-right, cash-capital-increase ex-right, loss-offset capital reduction, cash-refund capital reduction, and par-value change/split.

Step B:
For each target date compare:
- raw previous close/reference price;
- raw historical OHLC;
- provider adjusted=true OHLC;
- current Formal cached history where available.

Step C:
Calculate current Formal technical features versus a point-in-time continuity-bridged Research version:
- ret20/ret60;
- MA stack;
- ATR;
- platform highs/lows;
- A/B checks;
- RR/selection only as Shadow diagnostics.

Falsification:
Do not call the issue practically material if the current source already preserves continuity or the differences do not change relevant technical states across a sufficiently broad multi-date sample.

Do not optimize the bridge against future returns. The first criterion is market/accounting correctness.

Status: DATA-QUALITY VALIDATION PROTOCOL FROZEN.

---

## CA-030 — Governance boundary

Any future change that pins historical price semantics, retains corporate-action-aware change, or inserts an action bridge can alter future Formal eligibility.

Classification: Class B proposal-first.

Allowed now:
- documentation;
- offline tests;
- branch/proposal/test plan;
- Shadow comparison.

Not allowed without owner approval:
- production merge;
- change to Formal selection inputs;
- deployment.

Future validation must also test interaction with the separate history-freshness work on PR #100.

Status: FORMAL CORE UNCHANGED.

## Revised exact continuation

CA-031: build a small verified corporate-action event sample.
CA-032: run raw-vs-reference/adjusted feature-impact calculations offline.
CA-033: determine whether actual A/B states change.
CA-034: if material, prepare a Class B history-semantics proposal/test plan only.
CA-035: continue buyback/SEO/CB realized-supply source validation separately.


---

## CA-031 — Verified three-event corporate-action sample

A small source-validation sample now uses the same raw trading series source plus a point-in-time reference bridge.

### 2412 Chunghwa Telecom — 2026-07-09 cash dividend
Official company evidence:
- ex-dividend trade date: 2026-07-09;
- cash dividend: NT$5.2/share.

Raw trading series:
- 2026-07-08 close = 139.5;
- 2026-07-09 close = 133.5;
- daily change field = -1.0, implying the market reference used for the daily change is approximately 134.5 after tick treatment.

Point-in-time bridge factor used for this diagnostic:
134.5 / 139.5 = 0.964158.

### 4554 — 2025-08-26 ex-right/reference reset
Raw trading series:
- prior close = 36.95;
- event-day close = 32.5;
- daily change = +0.1;
- event-day reference implied by change = approximately 32.4.

Point-in-time bridge factor:
32.4 / 36.95 = 0.876861.

### 8422 — 2025-11-17 par-value change / large price-base reset
Official TWSE/raw market data:
- prior tradable close = 250;
- event-day close = 24.7;
- daily change = -0.3;
- event reference implied by change = 25.

Point-in-time bridge factor:
25 / 250 = 0.1.

TWSE daily market data independently confirms the 250 -> 24.7 scale break around the resumed trading date.

### Method
For the technical-state diagnostic only:
- all OHLC before the effective event date are multiplied by the target-date-known bridge factor;
- event-day OHLC remain actual traded prices;
- volume is left unchanged in this first price-only test;
- no future returns are used.

Status: SMALL VERIFIED EVENT SAMPLE BUILT.

---

## CA-032 — Raw vs point-in-time continuity feature impact

The current Formal buildMarketFeatures/strategySetupState formulas were reproduced without changing thresholds.

### 2412 cash dividend

Raw:
- ret20 = -7.29%
- ret60 = -1.11%
- MA20 = 142.65
- MA60 = 139.35
- ATR = 1.54%
- priorHigh20 = 147
- pullback = 9.18%
- support distance = 6.41%

Point-in-time bridge:
- ret20 = -3.85%
- ret60 = +2.57%
- MA20 = 137.78
- MA60 = 134.44
- ATR = 1.32%
- priorHigh20 = 141.73
- pullback = 5.81%
- support distance = 0.74%

Formal A sub-condition flip:
- nearSupport: false -> true.

Full A and B still remain false on this event date.

### 4554 ex-right reset

Raw:
- ret20 = -18.95%
- ret60 = -12.16%
- MA20 = 37.03
- MA60 = 38.96
- ATR = 5.54%
- pullback = 25.97%
- support distance = 12.23%

Point-in-time bridge:
- ret20 = -7.57%
- ret60 = +0.17%
- MA20 = 32.67
- MA60 = 34.23
- ATR = 4.48%
- pullback = 15.57%
- support distance = 0.52%

A sub-condition flips:
- nearSupport false -> true;
- structure false -> true.

Full A/B remain false because other conditions still fail.

### 8422 par-value change

Raw:
- ret20 = -87.80%
- ret60 = -87.53%
- MA20 = 216.16
- MA60 = 204.00
- ATR = 72.84%
- priorHigh20 = 256
- pullback = 90.35%
- support distance = 88.57%

Point-in-time bridge:
- ret20 = +21.98%
- ret60 = +24.75%
- MA20 = 22.73
- MA60 = 20.77
- ATR = 3.02%
- priorHigh20 = 25.6
- pullback = 3.52%
- support distance = 1.92%

A condition flips:
- trend false -> true;
- pullback false -> true;
- nearSupport false -> true;
- structure false -> true.

B trend also flips false -> true.

Most importantly:
- Formal A technical setup pass = false on raw series;
- Formal A technical setup pass = true on the point-in-time continuity bridge.

This proves practical state materiality, not merely cosmetic chart distortion.

Caveat:
The test isolates price continuity. Share-volume-base changes, especially the 8422 par-value event, require a separate volume-unit bridge before any production implementation.

Status: TECHNICAL-STATE MATERIALITY = CONFIRMED IN SMALL SAMPLE.

---

## CA-033 — Blind provider adjusted=true is empirically unsafe for historical replay

The same three symbols were queried through the provider's current adjusted historical series, with query end set to the historical event date.

Observed event-date closes:

- 2412 actual target close 133.5 -> adjusted target close 133.5.
- 4554 actual target close 32.5 -> adjusted target close 27.83.
- 8422 actual target close 24.7 -> adjusted target close 23.65.

For 4554 and 8422, the adjusted series changes the event-day actual traded close itself.

Interpretation:
The adjusted series retrieved today is expressed on a later adjustment basis that includes corporate actions beyond the historical target event, even though the requested query window ends on the target date.

Therefore a present-day adjusted=true query cannot be assumed to reconstruct the point-in-time series that a historical scan would have seen.

This empirically validates the look-ahead concern from CA-026.

### Additional connector provenance finding
The connected Fugle content action for "adjusted historical price" returned adjusted=true even when adjusted=false was passed in the initial test. Therefore that content action cannot be used as the raw comparator. The independent trading-price content source was used for raw observations.

Status:
- CURRENT ADJUSTED SERIES = useful for continuity/reference research;
- CURRENT ADJUSTED SERIES = NOT POINT-IN-TIME HISTORICAL TRUTH.

---

## CA-034 — Class B history-semantics proposal is now justified

Evidence threshold for a proposal has been met because:
1. source semantics are ambiguous in current Formal request;
2. current Formal technical features depend directly on the affected OHLC history;
3. verified real corporate actions create material feature changes;
4. at least one real sample flips full Formal A technical setup state;
5. blindly using today's adjusted series creates historical look-ahead.

### Proposed direction
Do not patch selection logic.

Instead prepare a history-data integrity layer that:
- explicitly records series semantics;
- attaches corporate-action event/reference metadata;
- builds a target-date-bounded continuity view for technical calculations;
- retains raw traded series for execution/gap/event research;
- leaves Formal behavior unchanged until separately approved.

### Required tests
- cash dividend;
- stock dividend/ex-right;
- cash capital increase ex-right;
- par-value change/split;
- loss-offset capital reduction;
- cash-refund capital reduction;
- multiple corporate actions in one 60-day window;
- target-date replay before a later corporate action;
- current-date scan;
- benchmark RS semantic consistency;
- volume/share-unit break handling;
- exact reproduction of current behavior when no corporate action exists;
- interaction regression with history-freshness PR #100.

### Governance
Class B proposal/test plan only.
No merge.
No deployment.
No Formal input change.

Status: PROPOSAL-READY / OWNER APPROVAL REQUIRED BEFORE ANY FORMAL IMPLEMENTATION.


---

## CA-035 — Current share-count snapshots are not historical realized-supply truth

Connected Fugle content exposes:
- latest capital;
- latest issued common shares.

Example current 8422 readback:
- latest capital: 1,358,762,544;
- latest issued common shares: 1,359,472,977.

These are current/latest snapshots.

They do NOT establish the point-in-time share count on:
- 2025-11-17;
- a past cash-capital-increase listing date;
- a past CB conversion date;
- a past buyback cancellation date.

Therefore they cannot be copied backward to compute historical realized dilution/contraction.

Historical equity-supply research requires a vintaged sequence from official action filings/capital-change records or an independently verified historical share-count source.

### Rule
- latestSharesOutstanding = current context only;
- historicalSharesOutstanding(T) = UNKNOWN unless point-in-time/vintaged evidence exists.

Status: CURRENT SHARE SNAPSHOT USEFUL / HISTORICAL BACKFILL PROHIBITED.

## CA-036 — Corporate Actions lane evidence checkpoint

Current state:
- concept model: COMPLETE;
- buyback/SEO/CB official source map: COMPLETE enough for design;
- free machine lifecycle contracts: PARTIAL;
- raw-vs-continuity technical materiality: CONFIRMED in small real sample;
- adjusted=true historical replay safety: REJECTED;
- Class B history-semantics proposal: CREATED;
- historical realized share-count series: NOT YET ESTABLISHED;
- production change: NONE.

## Exact next continuation after CA-036

CA-037: widen the corporate-action technical-impact sample beyond three events, prioritizing pure stock dividend, loss-offset capital reduction and cash-refund capital reduction.
CA-038: add volume/share-unit bridge research for split/par-value/stock-dividend cases.
CA-039: test no-action controls to ensure continuity bridge reproduces current Formal features when no event exists.
CA-040: only after CA-037..039, decide whether to prepare a branch/test implementation under the existing Class B proposal; no merge/deploy without owner approval.


---

## CA-037 — Broader real-event validation

Three additional action types were validated using independent raw trading-price data plus point-in-time action references.

### 8454 Fubon Media — stock dividend ex-right, 2025-08-21
Company dividend history reports:
- stock dividend = NT$0.5/share;
- ex-right date = 2025-08-21.

Raw:
- prior close = 272;
- event-day reference implied by close/change = about 259;
- price bridge factor = 259 / 272 = 0.952206;
- share-unit factor = 1.05.

Raw A setup = FAIL.
Point-in-time price+share bridge A setup = PASS.

The primary state change is trend continuity:
- A trend false -> true;
- B trend false -> true.

### 3593 Limin — loss-offset capital reduction, resumed 2025-12-22
Official/provider action data:
- prior close = 8.1;
- resume reference = 13.5;
- reduction ratio about 40%;
- post-reduction shares per 1000 old shares = 600.

Price bridge factor = 1.666667.
Share-unit factor = 0.6.

Raw ret20 = +68.49%.
Continuity ret20 = +1.10%.

Price-only bridge would make the full A technical setup PASS on the event date.
However after share-unit volume continuity is also applied:
- volumeTodayVsPrev5 = 1.58;
- A volume condition flips true -> false;
- full A returns to FAIL.

This is a decisive warning that price-only repair can create a new false signal.

### 8103 Lotes? / 瀚荃 — cash capital reduction, resumed 2025-12-08
Official/provider action data:
- prior close = 74.7;
- reference price = 86.11;
- cash refund = 1.5/share;
- post-reduction shares per 1000 old shares = 850.

Price bridge factor = 1.152744.
Share-unit factor = 0.85.

Raw versus continuity:
- ret20 +7.89% -> -6.40%;
- support-distance 8.59% -> 3.21%;
- A trend true -> false;
- A pullback true -> false;
- A nearSupport false -> true.

Full A/B remain false on the event date, but several technical-state bits materially change.

### Result
The broader sample now contains:
- cash dividend;
- stock dividend;
- ex-right reset;
- loss-offset capital reduction;
- cash-refund capital reduction;
- par-value change.

Materiality is not confined to one extreme split case.

Status: CA-037 BROADER ACTION-TYPE MATERIALITY CONFIRMED.

---

## CA-038 — Share-unit continuity is mandatory for volume-derived features

Price continuity and share-volume continuity are separate transformations.

### General rule
A pre-action raw volume must only be converted into post-action share units when the action changes share units.

Examples:
- cash dividend: shareUnitFactor = 1;
- stock dividend 5%: shareUnitFactor = 1.05;
- 40% capital reduction: shareUnitFactor = 0.60;
- 15% cash reduction: shareUnitFactor = 0.85;
- par-value 10 -> 1 split: shareUnitFactor = 10.

Price factor is NOT generally the inverse of share factor.
Cash distributions and rights terms can break that identity.

### Real effects

8454:
- raw volumeTodayVsPrev5 = 1.38;
- share-unit-adjusted = 1.32.
Still above B volume threshold, but close enough to show threshold sensitivity.

3593:
- raw = 0.95;
- share-unit-adjusted = 1.58.
This flips:
- A volume true -> false;
- B volume false -> true.

8422:
- raw event-day volumeTodayVsPrev5 = 21.12;
- post-split-share-unit comparison = 2.11.
Both exceed the B volume threshold, but raw magnitude is inflated by roughly the 10x share-unit change.

8103:
- raw = 1.00;
- adjusted = 1.18.

### Window persistence
The volume issue persists while rolling windows mix old-unit and new-unit bars.
A single event-day flag is insufficient.

### Required semantics
Maintain separately:
- rawVolumeShares;
- continuityVolumeShares;
- turnoverNTD.

Turnover value is not automatically a perfect replacement, but it is less directly distorted by pure share-unit rescaling and should be retained as a control.

Status: PRICE-ONLY CONTINUITY IS INSUFFICIENT.

---

## CA-039 — Persistence and no-look-ahead controls

### First 10 post-event trading days

Full A/B technical-state differences were observed beyond the event date.

8454 stock dividend:
- complete A differs on 2025-08-21, 08-22 and 09-04.

3593 loss reduction:
- complete A differs on 2025-12-30, 2026-01-02, 01-06 and 01-07.
- condition-level differences occur on every sampled post-event date through 2026-01-07.

8103 cash reduction:
- complete A differs on 2025-12-11, 12-15, 12-17 and 12-18.

8422 par-value change:
- complete A differs on 2025-11-17, 11-24, 11-25, 11-27, 11-28 and 12-01.

Therefore contamination is a rolling-window problem, not an event-day-only problem.

### Future-event negative controls

For targets immediately BEFORE the later corporate action:
- 8454 target 2025-08-20, future event 2025-08-21;
- 3593 target 2025-12-10, future event 2025-12-22;
- 8103 target 2025-11-26, future event 2025-12-08;
- 8422 target 2025-11-05, future event 2025-11-17.

A target-date-bounded continuity algorithm applies no future event.

For all four controls:
- last price;
- MA5/20/60;
- ret20;
- priorHigh20/priorLow20;
- volumeTodayVsPrev5
match raw history exactly.

This validates the core no-look-ahead rule for the prototype design.

Status: PERSISTENCE CONFIRMED / FUTURE-EVENT NO-OP CONTROL PASSED.

## CA-040 — Prototype gate satisfied

Evidence now supports building an isolated branch prototype.

The prototype must:
- never modify Worker.js on main;
- never alter deployment workflows;
- implement pure transformation functions only;
- require explicit targetDate;
- ignore events effective after targetDate;
- keep raw and continuity series separate;
- accept explicit priceFactor and shareUnitFactor;
- mark volume continuity incomplete when share-unit factor is unknown;
- support multiple sequential corporate actions;
- include no-action/future-event tests.

No Formal promotion is authorized.


---

## CA-041 — One return series is insufficient: split semantics by use

The current Formal path reuses one stock ret20 for:
- technical overextension / late-stage checks;
- market relative strength versus TAIEX;
- sector-peer relative return.

Corporate actions show these uses do not always share the same return semantics.

### Series A — RAW_EXECUTION_SERIES
Purpose:
- actual fills;
- actual gaps;
- opening/closing execution;
- event studies.

Definition:
Actual traded OHLC. Never rewritten.

### Series B — TECHNICAL_CONTINUITY_SERIES
Purpose:
- MA;
- ATR;
- support/resistance;
- platform/pullback/breakout structure;
- technical ret20/ret60 / late-stage diagnostics.

Treatment:
Neutralize verified mechanical price-base resets using only actions effective by the target date.
Cash dividends are normally neutralized here because a dividend reference reset should not manufacture a technical breakdown.

### Series C — PRICE_INDEX_COMPARABLE_RETURN
Purpose:
Research-only relative-strength return that follows the corporate-action semantics of the official TAIEX Price Index.

Critical difference:
Cash dividends are NOT neutralized for this mode, because the TAIEX Price Index itself does not adjust its base for cash dividends.
Other events for which TAIEX adjusts its base to preserve continuity should be neutralized correspondingly.

### Series D — TOTAL_RETURN_COMPARABLE_RETURN
Purpose:
Research-only shareholder-wealth / momentum return comparable with the official TAIEX Total Return Index.

Treatment:
Same continuity events as the Price Index plus cash-dividend adjustment.

### Consequence
Do not replace the existing Formal ret20 with one generic adjusted ret20.

Potential future Shadow names:
- ret20Technical;
- ret20PriceIndexComparable;
- ret20TotalReturnComparable;
- marketReturn20Price;
- marketReturn20TotalReturn.

Status: MULTI-SERIES RETURN SEMANTICS FROZEN FOR RESEARCH.

---

## CA-042 — Official TAIEX benchmark semantics confirm the split

TWSE TAIEX Methodology explicitly defines:
- Price Index;
- Total Return Index.

The Total Return Index adjusts for cash dividends.

The index-maintenance rules also adjust the index base for specified capital/share events to preserve continuity, including several new-share, cancellation/reduction, conversion and capital-change cases.

For ordinary cash ex-dividend:
- TAIEX Price Index base is not adjusted;
- TAIEX Total Return Index does adjust.

Current Formal V7 official index source is verified in Worker.js as:
- FMTQIK;
- field = 發行量加權股價指數;
therefore it is the Price Index.

TWSE also publicly provides the official Total Return Index history through MFI94U.

### Implication
Using TECHNICAL_CONTINUITY stock ret20, which neutralizes a cash-dividend reset, against current Formal Price-Index return would mix semantics.

Two research-clean alternatives exist:
1. PRICE_INDEX_COMPARABLE stock return versus current TAIEX Price Index.
2. TOTAL_RETURN_COMPARABLE stock return versus official TAIEX Total Return Index.

Neither alternative is approved for Formal ranking.
Changing Formal RS benchmark/definition would alter ranking and is a Formal-Core decision, not an automatic data-cleaning patch.

Status: RS SEMANTIC MISMATCH CONFIRMED / SHADOW COMPARISON REQUIRED.

---

## CA-043 — Corporate-action treatment matrix

### CASH_DIVIDEND
Technical price continuity:
- YES.

Price-index-comparable return:
- NO cash-dividend neutralization.

Total-return-comparable return:
- YES.

Volume unit transform:
- NONE.

### STOCK_DIVIDEND / BONUS SHARES
Technical price continuity:
- YES.

Price-index-comparable:
- YES, because TAIEX market-value mechanics preserve continuity rather than treating the lower ex-right price as an economic loss.

Total-return-comparable:
- YES.

Volume:
- DO NOT automatically multiply historical trading volume merely from the stock-dividend ratio.
The event increases eventual share supply, but tradable-new-share timing matters.
Use actual listed-share vintages/turnover normalization or mark volume continuity PARTIAL.

### PAR-VALUE CHANGE / SPLIT / REVERSE SPLIT
Technical price continuity:
- YES.

Price-index-comparable:
- YES.

Total-return-comparable:
- YES.

Volume unit transform:
- UNIT_SCALE with verified conversion factor.

### LOSS-OFFSET CAPITAL REDUCTION
Technical price continuity:
- YES.

Price-index-comparable:
- YES.

Total-return-comparable:
- YES.

Volume unit transform:
- UNIT_SCALE with verified remaining-share ratio.

### CASH-REFUND CAPITAL REDUCTION
Technical price continuity:
- YES.

Price-index-comparable:
- YES under index continuity mechanics.

Total-return-comparable:
- YES, with cash-return economics preserved by the reference/action treatment.

Volume unit transform:
- UNIT_SCALE with verified remaining-share ratio.

### CASH CAPITAL INCREASE / RIGHTS
Technical price continuity:
- use verified ex-right reference mechanics.

Price/total-return comparable:
- require action-specific rights/entitlement semantics.

Volume:
- SUPPLY_CHANGE, not automatic UNIT_SCALE at ex-right.
New-share delivery/listing timing is required.

### CB CONVERSION / NEW SHARES
No automatic historical OHLC unit rescaling unless an exchange reference-price event exists.
Treat primarily as realized share-supply / index-base context.

Volume:
- SUPPLY_CHANGE; normalize with point-in-time shares outstanding rather than inventing a split factor.

### BUYBACK CANCELLATION
No per-share unit conversion.
Treat as share-base contraction / index-base context.

### Volume correction to prior CA-038
The earlier use of 1.05 for 8454 pre-event volume is retained only as an ECONOMIC_EQUIVALENT_VOLUME hypothesis.
It is NOT validated as the correct tradable-volume transformation.
The strong UNIT_SCALE evidence remains 3593/8103/8422-type conversion events.

Status: ACTION-TREATMENT MATRIX V1 FROZEN; STOCK-DIVIDEND/RIGHTS VOLUME CLAIM NARROWED.

---

## CA-044 — Research prototype requirements revised

The branch prototype must distinguish:
- price continuity semantics;
- volume transformation semantics;
- benchmark-return semantics.

### VolumeTransformMode
- NONE
- UNIT_SCALE
- SUPPLY_CHANGE
- UNKNOWN

Only UNIT_SCALE may directly rescale historical raw share volume.

SUPPLY_CHANGE:
- leaves raw volume unchanged;
- marks rolling share-volume comparability incomplete until point-in-time shares/listing data are available;
- may later support turnover-rate normalization.

### ReturnMode
- TECHNICAL_CONTINUITY
- PRICE_INDEX_COMPARABLE
- TOTAL_RETURN_COMPARABLE

For CASH_DIVIDEND:
- TECHNICAL_CONTINUITY applies the action price factor;
- PRICE_INDEX_COMPARABLE does not;
- TOTAL_RETURN_COMPARABLE applies it.

### Governance refinement
History continuity for technical data quality remains Class B proposal-first.
Any promotion that changes the current RS benchmark/return definition changes Formal ranking semantics and requires explicit owner decision under Formal-Core governance.

No production implementation is authorized.

Status: PROTOTYPE V2 SEMANTICS FROZEN.


---

## CA-045 — Corporate-action contamination reaches ranking through current ret20 reuse

Current Formal source reuses stock ret20 in several roles.

Technical role:
- lateStage;
- A/B structure context;
- debug/diagnostics.

Market-RS role:
current rs = stock ret20 - TAIEX Price Index return20.

The RS component enters priorityScore through the current formula:
clamp(50 + rs * 2, 0, 100) * 0.14.

Therefore a corporate-action distortion in ret20 can change ranking even when other gates pass.

Real small-event magnitude:

2412 cash dividend:
- raw ret20 = -7.29%;
- technical-continuity ret20 = -3.85%;
- difference = 3.44 percentage points.

8454 stock-dividend case:
- raw ret20 = -7.61%;
- technical continuity = -2.97%;
- difference = 4.64 percentage points.

Before clamping, those differences correspond to roughly:
- 6.88 RS-score points for 2412;
- 9.28 RS-score points for 8454;
or about:
- 0.96;
- 1.30
priority-score points respectively at the current 14% RS weight.

This can matter for close-ranked candidates.

Sector-peer diagnostic:
sectorReturn20 currently averages peer stock ret20 values.
A mechanically distorted peer can therefore contaminate displayed sectorRelativeStrength for other stocks in the same industry.

Current source does not place sectorRs directly into priorityScore, so this is currently a diagnostic/semantic issue rather than the same direct ranking channel.

Governance:
Any RS-return or benchmark replacement can change priority ranking and potentially selected Top3/Top6.
This is not auto-promotable as a hidden data fix.

Status: RANKING MATERIALITY CHANNEL CONFIRMED.

---

## CA-046 — Official TAIEX Total Return source is available for Shadow benchmark comparison

Official TWSE methodology:
- defines TAIEX Price Index and Total Return Index;
- Total Return Index adjusts for cash dividends;
- both share other index-maintenance continuity rules except the cash-dividend treatment.

Current Formal benchmark source:
- FMTQIK;
- field = 發行量加權股價指數;
therefore it is the Price Index.

Official Total Return history source:
- TWSE MFI94U / 發行量加權股價報酬指數.

The current repository contains no MFI94U ingestion path.

Research-only comparison:

A. LEGACY_RS:
current raw stock ret20 versus TAIEX Price Index.

B. PRICE_INDEX_COMPAT_RS:
stock Price-Index-Comparable return versus TAIEX Price Index.

C. TOTAL_RETURN_RS:
stock Total-Return-Comparable return versus official TAIEX Total Return Index.

Cash-dividend semantics:
- PRICE_INDEX_COMPAT retains ordinary cash-dividend price drag;
- TOTAL_RETURN neutralizes cash dividends on stock and benchmark.

Capital/split/reduction events:
- Price-compatible and Total-return-compatible stock series both require the appropriate continuity treatment corresponding to index-maintenance rules.

Status: TOTAL-RETURN BENCHMARK SOURCE FEASIBLE / REPO INGESTION ABSENT.

---

## CA-047 — Pre-registered RS comparison before any benchmark change

Population:
Use all target-date stocks/dates for which raw history, corporate-action coverage, TAIEX Price Index history and TAIEX Total Return history are complete.

Include:
- action-window stocks;
- matched no-action controls.

Do not select only cases where modes differ.

Three RS definitions:
1. LEGACY = raw stock ret20 - price-index return20.
2. PRICE_COMPAT = price-index-comparable stock ret20 - price-index return20.
3. TOTAL_RETURN = total-return-comparable stock ret20 - total-return-index return20.

First semantic questions:
- How often does ranking order change?
- How often does Top3-per-pool membership change in Shadow replay?
- Are differences concentrated around corporate-action windows?
- Does PRICE_COMPAT equal LEGACY on no-action controls?
- Does one mode remove mechanical outliers without broad unrelated ranking drift?

Phase 1 is semantic/data-quality validation only:
- score differences;
- rank differences;
- candidate membership differences;
- no-action equality.

Do NOT choose a mode by future returns yet.

Only after semantic correctness is established may D1/D3/D5/MFE/MAE be studied.

Changing Formal benchmark or RS definition is an explicit Formal-Core ranking decision.

Status: RS COMPARISON PROTOCOL FROZEN.

---

## CA-048 — Technical-history correction and RS strategy are separate decisions

Decision A — Technical-history integrity:
Should technical features use point-in-time continuity rather than mechanical raw discontinuities?
Evidence supports Class B engineering investigation.

Decision B — Relative-strength definition:
Which stock return semantics should rank against which TAIEX benchmark?
This is a ranking/strategy question and requires separate Shadow evidence plus explicit owner decision.

Do not bundle A and B into one patch.

Recommended sequence:
1. finish technical continuity validation;
2. keep legacy RS unchanged during technical Shadow comparison;
3. add independent Shadow RS fields;
4. compare benchmark semantics;
5. only then consider any Formal RS decision.

Status: TECHNICAL DATA FIX AND RS STRATEGY CHANGE DECOUPLED.

---

## CA-049 — Branch prototype volume semantics revised

Research branch:
research/class-b-corporate-action-history-semantics-20260925

Prototype now has explicit VolumeTransformMode:
- NONE
- UNIT_SCALE
- SUPPLY_CHANGE
- UNKNOWN

Only UNIT_SCALE rescales historical share volume.

SUPPLY_CHANGE:
- leaves raw volume unchanged;
- marks volume comparability incomplete;
- requires later point-in-time shares/listing evidence or turnover-rate normalization.

This supersedes the earlier blanket stock-dividend volume scaling assumption.

Status: BRANCH PROTOTYPE V2 VOLUME SEMANTICS COMPLETE.

---

## CA-050 — Branch prototype return modes revised

Prototype now supports:
- TECHNICAL_CONTINUITY
- PRICE_INDEX_COMPARABLE
- TOTAL_RETURN_COMPARABLE.

Cash-dividend fixture:
- Technical mode adjusts pre-event price;
- Price-Index-Comparable mode leaves cash-dividend price drag;
- Total-Return mode adjusts it.

Stock-dividend fixture:
- price continuity applies;
- volume remains unresolved SUPPLY_CHANGE rather than being fabricated.

Capital reduction/par-value fixtures:
- UNIT_SCALE volume conversion remains explicit.

Test fixtures are checked into the branch.
They have not been claimed as CI-executed in this research turn.

Status: BRANCH PROTOTYPE V2 RETURN SEMANTICS COMPLETE.

---

## CA-051 — Branch isolation re-verified

Before the semantic V2 commits, main-to-branch comparison showed only:
- research/corporate_action_continuity_prototype.mjs
- tests/test_corporate_action_continuity_prototype.mjs

No Worker.js or workflow file was changed.

V2 continues to modify only those same research/test files on the research branch.

Formal main and deployment path remain untouched.

Status: ISOLATION PRESERVED.

## Exact next continuation

CA-052: freeze official MFI94U offline source contract and coverage rules.
CA-053: define Price-Index vs Total-Return Shadow result schema.
CA-054: audit action-specific benchmark-treatment edge cases such as rights offerings and mixed cash+stock distributions.
CA-055: update checkpoints and freeze the next empirical data-build step.


---

## CA-052 — Official MFI94U offline source contract

Official TWSE sources are sufficient for an offline Total-Return benchmark archive.

### Source
TAIEX Total Return:
- provider = TWSE;
- report = MFI94U;
- official OpenAPI catalog path = /indicesReport/MFI94U;
- human/history page = /indicesReport/MFI94U.

TAIEX Price Index:
- keep the current Formal FMTQIK source for legacy/price-index comparison.

### Canonical offline record
- marketDate;
- taiExPriceClose;
- taiExTotalReturnClose;
- priceSourceUrl;
- totalReturnSourceUrl;
- sourceFetchedAt;
- sourcePayloadHash/version;
- coverageQuality;
- unknownReasons.

### Coverage gate
For each target scan date:
- exact target date must exist in both series;
- exact return-start date used by the stock must exist;
- no duplicate dates;
- no future dates;
- no interpolation;
- no nearest-date substitution;
- no absence-as-zero.

For a 20-day comparison the source must support the same exact pair of trading dates as the stock return definition.

### Historical-vintage note
TAIEX index values are official end-of-day index facts rather than later analyst estimates, but offline archive still records source fetch time/hash for reproducibility.

### Architecture
Offline/Research only.
No Worker call, cron dependency or production quality gate is authorized.

Status: OFFICIAL TOTAL-RETURN OFFLINE SOURCE CONTRACT FROZEN.

---

## CA-053 — RS Shadow result schema

Per symbol / target date:

Identity:
- targetDate;
- symbol;
- pool;
- existingFormalRank;
- actionCoverageComplete;
- actionEventsInWindow;
- dataQuality.

Returns:
- legacyRawRet20;
- technicalRet20;
- priceIndexComparableRet20;
- totalReturnComparableRet20;
- taiExPriceReturn20;
- taiExTotalReturn20.

RS:
- legacyRs;
- priceCompatRs;
- totalReturnRs.

Ranking diagnostics:
- legacyRsComponent;
- priceCompatRsComponent;
- totalReturnRsComponent;
- legacyPriorityScore;
- priceCompatCounterfactualPriorityScore;
- totalReturnCounterfactualPriorityScore;
- legacyRank;
- priceCompatShadowRank;
- totalReturnShadowRank;
- legacyTop3;
- priceCompatShadowTop3;
- totalReturnShadowTop3.

Controls:
- noActionWindow;
- priceCompatEqualsLegacyWhenExpected;
- unknownReasons;
- researchOnly=true;
- decisionImpact=false.

### Freeze all other factors
For the first RS semantic comparison:
- A/B channel state;
- setupQuality;
- sector score;
- institutional score;
- fundamentals;
- RR;
must be held fixed.

This isolates ranking impact from RS semantics rather than mixing in the separate technical-continuity fix.

Status: RS SHADOW RESULT SCHEMA FROZEN.

---

## CA-054 — Mixed corporate actions require mode-specific factors, not a Boolean flag

The V2 research prototype used:
- one priceFactor;
- a Boolean priceIndexAdjusts.

This is insufficient for mixed distributions.

### Example: cash + stock dividend on the same ex-date

Suppose:
- previous close P0 = 100;
- cash dividend D = 5;
- stock dividend ratio s = 10%;
- no other terms.

Mechanical ex-date reference:
(100 - 5) / 1.10 = 86.3636.

Technical / total-return continuity factor:
86.3636 / 100 = 0.863636.

But a Price-Index-Comparable stock series should:
- neutralize the 10% stock-distribution unit effect;
- retain the 5% cash-dividend drag.

Its pre-event comparable close should be:
100 / 1.10 = 90.9091.

Therefore its factor is:
0.909091,
not:
- 1.0;
- and not the full 0.863636 reference factor.

If the event-day price equals the theoretical 86.3636:
- technical/total-return mode shows roughly 0% mechanical return;
- price-index-compatible mode shows about -5%, preserving cash-dividend drag.

### Revised event contract
Each event may need separate explicit factors:
- technicalPriceFactor;
- priceIndexComparableFactor;
- totalReturnComparableFactor.

A generic referencePrice/previousClose factor may populate technical/total-return mode for simple verified cases.
It must NOT automatically populate Price-Index-Comparable mode for mixed cash distributions.

### Rights offerings
Cash capital increase / rights events also require formula-specific treatment because subscription price and entitlement value enter reference mechanics.
Do not infer price-index factor from action label alone.

### Unknown rule
If a mode-specific factor cannot be verified:
- that return mode is UNKNOWN for that event/window;
- do not substitute another mode's factor.

Status: MODE-SPECIFIC FACTOR MODEL REQUIRED.

---

## CA-055 — Evidence state after benchmark-semantic deepening

What is now established:
- raw technical history can be mechanically wrong around corporate actions;
- technical continuity can fix real A/B state distortions;
- volume requires separate unit/supply semantics;
- present-day provider adjusted history is not point-in-time replay truth;
- current Formal RS uses the TAIEX Price Index;
- official TAIEX Total Return history is available from TWSE;
- technical-return and ranking-return semantics must be separated;
- mixed cash+stock actions require mode-specific factors.

What is NOT established:
- which RS definition is better for future returns;
- whether Formal should change benchmark;
- a complete point-in-time corporate-action registry across the whole market;
- correct historical volume normalization for SUPPLY_CHANGE events.

No Formal change is approved.

## Exact next continuation

CA-056: revise branch prototype from Boolean price-index adjustment to explicit mode-specific factors.
CA-057: revise branch tests with a synthetic mixed cash+stock event that distinguishes 0%, -5% and raw semantics.
CA-058: add an offline MFI94U source-contract document; no runtime code.
CA-059: compare branch to main again and checkpoint.
CA-060: next evidence target = automated construction of a small official corporate-action registry sample, not more indicators.
