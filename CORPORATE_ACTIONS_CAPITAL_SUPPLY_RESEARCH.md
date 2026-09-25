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


---

## CA-056 — Branch prototype upgraded to explicit mode-specific factors

Research branch:
research/class-b-corporate-action-history-semantics-20260925

V3 event contract now separates:
- technicalPriceFactor;
- priceIndexComparableFactor;
- totalReturnComparableFactor.

There is intentionally no automatic generic fallback into Price-Index-Comparable mode.

Reason:
Mixed cash+stock or rights events can have different correct factors for:
- technical continuity;
- TAIEX Price-Index-compatible return;
- total-return-compatible return.

If the requested mode factor is absent:
- priceContinuityComplete = false;
- an UNKNOWN reason is emitted;
- another mode's factor is not substituted.

Status: MODE-SPECIFIC FACTOR PROTOTYPE COMPLETE.

---

## CA-057 — Mixed cash + stock dividend test fixture added

Synthetic frozen example:
- prior close = 100;
- cash dividend = 5;
- stock dividend ratio = 10%.

Theoretical ex-price:
(100 - 5) / 1.10 = 86.3636.

Raw price return:
86.3636 / 100 - 1 = -13.6364%.

Technical / Total-Return factor:
0.863636.
Expected mechanical return after continuity = approximately 0%.

Price-Index-Comparable factor:
1 / 1.10 = 0.909091.
Expected return:
86.3636 / 90.9091 - 1 = -5%.

Thus the three semantics intentionally disagree:
- RAW = -13.64%;
- PRICE_INDEX_COMPAT = -5%;
- TECHNICAL/TOTAL_RETURN = 0%.

The branch test fixture encodes these expected values.

Test fixture is checked in but is not claimed as CI-executed in this turn.

Status: MIXED-ACTION SEMANTIC TEST FROZEN.

---

## CA-058 — Offline MFI94U source contract created

Dedicated file:
CORPORATE_ACTION_RS_SOURCE_CONTRACT.md

It freezes:
- current Formal FMTQIK Price Index as the price benchmark;
- official TWSE MFI94U as the Total Return benchmark;
- exact target/start-date coverage;
- no interpolation / no nearest-date substitution / no missing-as-zero;
- source provenance;
- Shadow-only join fields;
- validation gates;
- no production Worker fetch.

Status: RS BENCHMARK SOURCE CONTRACT COMPLETE.

---

## CA-059 — Research branch isolation remains intact

Latest main-to-branch comparison:
- branch differs in exactly two files:
  1. research/corporate_action_continuity_prototype.mjs
  2. tests/test_corporate_action_continuity_prototype.mjs
- no Worker.js changes;
- no deployment workflow changes.

The branch is behind newer main research-document commits because main research continued after branch creation.
This does not indicate a production-code conflict; the actual diff remains isolated research files.

Status: BRANCH ISOLATION VERIFIED.

---

## CA-060 — Corporate-action lane evidence phase checkpoint

Completed:
- concept;
- official source map;
- raw-history semantic defect audit;
- six action-type real samples;
- rolling-window persistence;
- no-future-event controls;
- unit-scale versus supply-change volume distinction;
- technical versus Price-Index versus Total-Return semantics;
- mixed-event factor decomposition;
- isolated branch prototype;
- official TAIEX Total Return offline source contract.

Still missing:
- broad point-in-time all-market corporate-action registry;
- authoritative tradable-share/listing timeline for SUPPLY_CHANGE volume normalization;
- multi-date Shadow RS ranking sample;
- automated execution of branch test fixtures in CI;
- owner decision on any Formal implementation.

No Formal Core change.

## Exact next evidence target after CA-060

Build a small official point-in-time corporate-action registry dataset across independent dates:
- sample ordinary cash dividends;
- stock dividends;
- capital reductions;
- par-value changes;
- rights/cash capital increases;
- no-action controls.

For each record, freeze:
- first-known/effective dates;
- raw reference inputs;
- per-mode factors;
- volumeTransformMode;
- source/provenance;
- coverage status.

Only after registry schema/data pass should RS Shadow ranking comparison begin.

Do not add more scoring indicators before this evidence layer exists.


---

## CA-061 — Corporate-action “reference price” must be split into distinct fields

The 2412 cash-dividend sample exposed a provenance problem.

Known facts:
- prior raw close = 139.5;
- cash dividend = 5.2;
- economic ex-dividend arithmetic gives 134.3;
- provider adjusted history also maps the prior close to 134.3;
- some market reporting/change semantics show 134.5.

Therefore a generic referencePrice field is unsafe.

### Revised registry fields
- previousRawClose;
- economicAdjustmentReference;
- exchangeOpeningReference;
- providerAdjustedAnchor;
- dailyChangeReference;
- referenceQuality;
- referenceConflictReasons.

### Ownership
Technical/total-return continuity:
prefer the verified economic/action adjustment basis.

Execution, price-limit and gap studies:
require the official exchange opening/reference-price basis.

Do not infer one from the other when tick/rounding/provider conventions differ.

### 2412 quality decision
- economicAdjustmentReference = 134.3;
- providerAdjustedAnchor = 134.3;
- exchangeOpeningReference = UNKNOWN until a primary exchange record is archived;
- conflicting secondary references are preserved as conflict evidence rather than silently selected.

Status: REFERENCE-PRICE PROVENANCE LAYER FROZEN.

---

## CA-062 — 2412 recalculation with economic reference 134.3

Recomputed point-in-time technical bridge factor:
134.3 / 139.5 = 0.96272401.

Technical features on 2026-07-09 become:
- ret20 = -3.70%;
- ret60 = +2.72%;
- MA20 = 137.58;
- MA60 = 134.24;
- ATR = 1.32%;
- priorHigh20 = 141.52;
- pullback = 5.67%;
- support distance = 0.60%.

A checks:
- trend = true;
- pullback = true;
- nearSupport = true;
- volume = false;
- structure = false;
- notLate = true.

Full A remains FAIL.

This supersedes the earlier 134.5 technical-bridge diagnostic for 2412.
The broader conclusion is unchanged and slightly strengthened: a small cash-dividend reference difference can flip additional subconditions even without flipping the full setup.

Status: 2412 TECHNICAL SAMPLE CORRECTED.

---

## CA-063 — Stock-dividend share supply is not an ex-date UNIT_SCALE event

Official Fubon Media documentation for the 2025 stock distribution states:
- capital-surplus stock distribution = 0.5 per share / 50 shares per 1000;
- 12,617,870 new shares issued;
- regulatory effectiveness in July 2025;
- ex-right entitlement/record process in August;
- new shares completed listing on 2025-10-09.

### Consequence
The additional 5% shares were not all new tradable shares on the ex-right date.

Therefore:
- price continuity can begin at the ex-right/reference event;
- tradable-share supply changes on a different lifecycle;
- pre-ex-right raw trading volume must NOT automatically be multiplied by 1.05 and called actual-volume continuity.

For stock dividends:
volumeTransformMode = SUPPLY_CHANGE
until point-in-time listed/tradable-share vintages establish a better denominator.

This directly validates the CA-043 correction.

Status: STOCK-DIVIDEND VOLUME CLASSIFICATION VERIFIED BY ISSUANCE TIMELINE.

---

## CA-064 — Registry sample v0.1 quality policy

A first registry sample is now useful, but it is not yet an inference dataset.

Every record carries:
- source quality;
- factor quality;
- first-known completeness;
- separate reference semantics;
- volume transform mode;
- UNKNOWN reasons.

Records with:
- missing firstKnownAt;
- unarchived specific official event document;
- reference conflicts
remain valid for schema/source testing but are NOT eligible for point-in-time outcome inference.

Status: REGISTRY SAMPLE BUILD AUTHORIZED AS RESEARCH ARTIFACT.


---

## CA-065 — Event versioning is mandatory for point-in-time corporate-action replay

Real examples show that the action itself may be known early while the final exchange schedule is revised later.

### 3593
MOPS-mirror timeline shows:
- earlier exchange-plan announcement in November 2025;
- later schedule changes;
- final correction published 2025-12-09 18:39:32 for the schedule leading to 2025-12-22 new-share trading.

A historical replay before the final correction must not use the later final schedule.

### 8103
Timeline:
- cash-reduction decision known by 2025-05-08;
- initial exchange plan published in August;
- final revised schedule leading to 2025-12-08 new-share trading published 2025-10-20.

### 8422
The 10-to-1 par-value exchange plan specifying 2025-11-17 new-share trading was publicly announced on 2025-10-16.

### Required fields
- eventVersion;
- firstKnownAt;
- finalScheduleKnownAt;
- supersedes[];
- effectiveDate valid for that version;
- sourceCapturedAt/source hash.

### Rule
Historical replay at time T may only use the latest event version known by T.

Do not collapse an event to its final version before replay.

Status: EVENT-VERSION VINTAGE MODEL CONFIRMED BY REAL SCHEDULE REVISIONS.

---

## CA-066 — Registry sample v0.1 upgraded with version provenance

Research artifact:
research/corporate_action_registry_sample_v0_1.json

Current sample contains:
- 2412 cash dividend;
- 8454 stock dividend;
- 3593 loss-offset reduction;
- 8103 cash-refund reduction;
- 8422 par-value change.

The sample now carries:
- eventVersion;
- supersedes;
- firstKnownAt;
- finalScheduleKnownAt;
- separate reference semantics;
- mode-specific factors;
- volumeTransformMode;
- source/factor/first-known quality;
- unknown reasons.

### Important quality state
This remains a schema/source-validation artifact, NOT an inference-ready all-market corporate-action archive.

Records sourced through timestamped MOPS mirrors remain explicitly identified as such until preferred primary MOPS archival records are preserved.

### Supersession note
For 2412, the earlier 134.5 technical bridge is superseded.
Research technical/total-return continuity now uses economicAdjustmentReference 134.3.
The exchange/trading-reference field remains separately unresolved where primary exchange evidence is not archived.

Status: REGISTRY SAMPLE V0.1 BUILT / PARTIAL POINT-IN-TIME PROVENANCE.

## Exact next continuation after CA-066

CA-067: convert the registry schema into deterministic validation rules and quality states.
CA-068: add no-action control records and incomplete-event negative controls.
CA-069: define how the 60-day history window queries all effective event versions without future leakage.
CA-070: use the registry sample to produce the first offline Shadow feature-delta dataset; no return-outcome optimization.
CA-071: only after registry/feature-delta validation, begin Price-Index vs Total-Return RS ranking comparison.


---

## CA-067 — One corporate action can require multiple effective events

Stock-dividend evidence changes the lifecycle model.

Example 8454:
- ex-right date creates an entitlement/price-reference reset;
- the newly issued stock does not become listed/tradable until a later date.

Therefore one “stock dividend event” must not automatically apply price and share-supply effects on the same date.

### Revised lifecycle

A. EX_RIGHT_PRICE_EVENT
- effective at ex-right date;
- applies mode-specific price factor;
- raw tradable-share volume unit remains unchanged;
- volumeTransformMode = NONE unless a true same-day unit conversion occurs.

B. NEW_SHARES_LISTED
- effective when additional shares become listed/tradable;
- no mechanical historical price factor unless separately evidenced;
- factors may be 1 for price modes;
- volumeTransformMode = SUPPLY_CHANGE;
- point-in-time shares outstanding / float becomes relevant.

### 8454 corrected event-day result
Using price factor 1 / 1.05 and leaving raw volume unchanged:

Raw:
- ret20 = -7.61%;
- MA20 = 273.18;
- MA60 = 274.86;
- volumeTodayVsPrev5 = 1.38;
- volumeContraction5to20 = 0.76;
- A trend = false;
- A full pass = false.

Price-continuity with raw tradable volume:
- ret20 = -2.99%;
- MA20 = 260.79;
- MA60 = 261.98;
- volumeTodayVsPrev5 = 1.38;
- volumeContraction5to20 = 0.76;
- A trend = true;
- A volume still passes because prior 5-day volume is contracted versus 20-day volume;
- full A = true.

Thus the A-state flip remains valid without any speculative volume scaling.

### Rights/cash capital increase
Apply the same principle:
- ex-right entitlement/reference event;
- later new-share delivery/listing supply event.

Status: PRICE EVENT AND SHARE-SUPPLY EVENT DECOUPLED.

---

## CA-068 — Event relevance is scoped to the exact history window

For a target-date history window:

historyStartDate = first actual bar supplied to the feature calculation.

An action affects continuity transformation only if:
historyStartDate < effectiveDate <= targetDate.

### Why

Event effective before/on the first bar:
- every bar in the supplied window is already post-event;
- no pre-event bar exists to transform;
- a supply change before the window does not create mixed-regime share volume inside that window.

Event effective after targetDate:
- must not enter technical/RS history;
- it may belong to Event Risk as a future known event, but that is a different lane.

### Multiple events
Apply eligible events in chronological order.
Each event transforms only bars strictly earlier than its own effective date.

### Prototype
The research branch now scopes eligible events to the supplied history window.

Status: WINDOW-SCOPED EVENT APPLICATION FROZEN.

---

## CA-069 — Registry quality is multidimensional, not one PASS/FAIL flag

Required readiness dimensions:

### SCHEMA_VALID
- dates parse;
- factors are positive when present;
- event version identifiers valid;
- source metadata present.

### POINT_IN_TIME_READY
- firstKnown/version-known timing sufficient for target;
- no later revision is backfilled into an earlier replay;
- effective date corresponds to the version known at target.

### TECHNICAL_PRICE_READY
- every relevant price-reset event in the history window has a verified technicalPriceFactor.

### TECHNICAL_VOLUME_READY
- every UNIT_SCALE event has a verified shareUnitFactor;
- no unresolved SUPPLY_CHANGE crosses the volume feature window unless a point-in-time shares/turnover normalization is available.

### PRICE_RS_READY
- every relevant event has a verified priceIndexComparableFactor;
- exact TAIEX Price Index start/end dates exist.

### TOTAL_RS_READY
- every relevant event has a verified totalReturnComparableFactor;
- exact TAIEX Total Return start/end dates exist.

### INFERENCE_READY
Requires:
- relevant readiness dimensions;
- complete universe/denominator coverage for the study question;
- no convenience sampling;
- source revision completeness.

A record can be TECHNICAL_PRICE_READY while not INFERENCE_READY.

Status: READINESS MATRIX FROZEN.

---

## CA-070 — Registry sample advances to lifecycle-aware v0.2

The next registry sample supersedes the single-event stock-dividend representation.

8454 is split into:
1. 2025-08-21 STOCK_DIVIDEND_EX_RIGHT;
2. 2025-10-09 NEW_SHARES_LISTED.

The first owns price continuity.
The second owns realized tradable-share supply.

3593 and 8103 preserve multiple announcement/schedule versions.
8422 preserves first-known exchange-plan timing before the 2025-11-17 unit conversion.
2412 preserves separate economic/reference fields and reference conflict status.

Status: REGISTRY LIFECYCLE MODEL V0.2 FROZEN.

## Exact next continuation after CA-070

CA-071: materialize registry sample v0.2 and mark v0.1 superseded for lifecycle semantics.
CA-072: add deterministic registry validation specification.
CA-073: define feature-window coverage manifest: expected events vs observed/verified events.
CA-074: build first offline feature-delta sample only from readiness-qualified windows.
CA-075: do not start forward-return optimization until registry coverage is demonstrably complete.


---

## CA-071 — Lifecycle-aware registry v0.2 is materialized

Research artifact:
research/corporate_action_registry_sample_v0_2.json

v0.2 supersedes v0.1 for lifecycle semantics.

Current records:
- 2412 cash-dividend price event;
- 8454 stock-dividend EX_RIGHT_PRICE_EVENT;
- 8454 later NEW_SHARES_LISTED supply event;
- 3593 loss-reduction unit conversion;
- 8103 cash-refund-reduction unit conversion;
- 8422 par-value unit conversion.

Critical correction preserved:
A stock-dividend ex-right price event does NOT automatically mean that new shares are already tradable that day.

Therefore:
- ex-right date owns the price/reference reset;
- later new-share listing owns realized tradable-share supply;
- do not rescale ex-right-day trading volume merely from the announced stock-dividend ratio.

Status: REGISTRY V0.2 MATERIALIZED / V0.1 SUPERSEDED FOR LIFECYCLE SEMANTICS.

---

## CA-072 — Deterministic registry validation specification is materialized and passes v0.2 structural checks

Specification:
CORPORATE_ACTION_REGISTRY_VALIDATION_SPEC.md

The validator contract covers:
- schema validity;
- event version/vintage validity;
- history-window relevance;
- mode-specific price factors;
- reference provenance;
- volume transform semantics;
- lifecycle consistency;
- multidimensional readiness;
- fail-closed UNKNOWN behavior.

A direct structural validation of v0.2 found:
- 6 records;
- zero duplicate/missing event keys;
- zero invalid effective dates;
- zero invalid positive factors;
- zero UNIT_SCALE records missing shareUnitFactor;
- zero firstKnown/finalSchedule ordering violations under the implemented checks.

Mechanics-qualified technical windows currently:
- 2412 2026-07-09;
- 3593 2025-12-22;
- 8103 2025-12-08;
- 8422 2025-11-17.

8454 records remain excluded from the first mechanics-delta sample because:
- ex-right record lacks archived exact first-known timing;
- later new-share-listing record additionally lacks a point-in-time listed-share denominator and therefore Technical Volume readiness.

Status: REGISTRY V0.2 STRUCTURAL VALIDATION PASS / INFERENCE READINESS STILL FALSE.

---

## CA-073 — Feature-window coverage manifest v0.1

Artifact:
research/corporate_action_feature_window_manifest_v0_1.json

### Purpose
Do not confuse:
“the event record we know is valid”
with:
“we know every relevant corporate action in this history window.”

Each window therefore records separately:
- pointInTimeReady;
- technicalPriceReady;
- technicalVolumeReady;
- eventCoverageComplete;
- eligibleForMechanicsDelta;
- eligibleForOutcomeInference.

### Current state
For the four qualified mechanics windows:
- point-in-time event semantics = ready;
- technical price = ready;
- technical volume = ready;
- all-market/event-denominator completeness = UNKNOWN.

Therefore:
- mechanics feature-delta analysis = allowed;
- forward-return/outcome inference = not allowed.

8454 stock-dividend lifecycle windows remain negative controls for incomplete readiness.

Status: COVERAGE MANIFEST V0.1 CREATED / EVENT-COVERAGE COMPLETENESS UNKNOWN.

---

## CA-074 — First readiness-qualified offline feature-delta sample

Artifact:
research/corporate_action_feature_delta_sample_v0_1.json

The current Formal feature formulas were evaluated on raw versus point-in-time continuity histories.
No future-return outcome was used.

### 2412 cash dividend
Raw -> continuity:
- ret20 -7.29% -> -3.70%;
- ret60 -1.11% -> +2.72%;
- MA20 142.65 -> 137.58;
- support distance 6.41% -> 0.60%;
- A trend false -> true;
- A nearSupport false -> true.
Full A/B remain false.

### 3593 loss reduction
Raw -> continuity:
- ret20 +68.49% -> +1.10%;
- ret60 +75.71% -> +5.43%;
- support distance 59.33% -> 1.26%;
- volumeTodayVsPrev5 0.95 -> 1.58 after verified unit conversion;
- A pullback false -> true;
- A nearSupport false -> true;
- A volume true -> false;
- B breakout true -> false;
- B volume false -> true.
Full A/B remain false.

This confirms that a price-only repair would be incomplete; unit-aware volume semantics materially matter.

### 8103 cash-refund reduction
Raw -> continuity:
- ret20 +7.89% -> -6.41%;
- ret60 +48.14% -> +28.50%;
- support distance 8.59% -> 3.20%;
- A trend true -> false;
- A pullback true -> false;
- A nearSupport false -> true;
- B trend true -> false.
Full A/B remain false.

### 8422 par-value change
Raw -> continuity:
- ret20 -87.80% -> +21.98%;
- ret60 -87.53% -> +24.75%;
- ATR 72.84% -> 3.02%;
- support distance 88.57% -> 1.92%;
- volumeTodayVsPrev5 21.12 -> 2.11;
- A trend/pullback/nearSupport/structure all false -> true;
- full A false -> true.

### Interpretation boundary
This dataset proves mechanical feature sensitivity.
It does NOT prove that the continuity version has better future returns.

Status: FIRST MECHANICS FEATURE-DELTA SAMPLE BUILT / NO OUTCOME CLAIM.

---

## CA-075 — Forward-return optimization remains explicitly blocked

The first feature-delta sample is convenience-selected around known corporate actions.

Therefore it must not be used to claim:
- better D1/D3/D5 returns;
- better win rate;
- better stop avoidance;
- better A/B selection quality;
- a production threshold;
- an expected-return edge.

Before outcome inference:
1. event coverage must be demonstrably complete for the tested universe/date range;
2. no-action controls must be sampled systematically;
3. missing/incomplete corporate-action windows must remain UNKNOWN;
4. event selection must not depend on observed feature flips or future returns;
5. benchmark RS semantics must be validated separately.

Status: MECHANICS EVIDENCE YES / ALPHA EVIDENCE NO.

## Exact next continuation after CA-075

CA-076: audit registry coverage acquisition paths for complete TWSE listed-universe event discovery, not convenience sampling.
CA-077: build deterministic event-window discovery manifest for a bounded historical period.
CA-078: validate official TAIEX Price Index and Total Return Index exact-date source contracts on several event/no-event windows.
CA-079: compare Legacy RS vs Price-Index-Compatible RS vs Total-Return RS only as semantic diagnostics.
CA-080: keep forward-return optimization blocked until denominator completeness is demonstrated.


---

## CA-076 — Complete event discovery requires a denominator source, not hand-picked actions

New source contract:
CORPORATE_ACTION_DISCOVERY_SOURCE_CONTRACT.md

### Verified official discovery layers

1. TWSE OpenAPI TWT48U_ALL
- current/prospective listed-stock ex-right/ex-dividend forecast table;
- exposes date, code, stock-dividend ratio, rights subscription ratio/price, cash dividend and allocation fields.

2. TWSE historical/public pages
- Ex-right Announcement;
- Ex-right Price Data;
- Capital Reduction Announcement;
- Reference Price for Capital Reduction;
- Change of Par Value Announcement;
- Reference Price after Change of Par Value.

3. TWSE Official Document Announcements
- exchange-plan/new-share listing/resume-trading dates.

4. TWSE Data E-Shop
- documented complete daily Common Stock EX-Right and Capital Reduction files;
- includes issued shares before/after actions;
- available historically from 2005-03-01 for the product;
- paid official data contract.

### Gate
Prospective complete discovery = FEASIBLE.
Historical complete official discovery = FEASIBLE through documented paid files.
Historical complete FREE automated discovery = still PARTIAL because one stable all-event historical machine endpoint has not been frozen across every lifecycle stage.

Status: EVENT-DENOMINATOR SOURCE MAP COMPLETE / FREE HISTORICAL AUTOMATION PARTIAL.

---

## CA-077 — Bounded-period event discovery manifest design

A bounded study must begin from the event denominator, not from stocks that already showed suspicious charts.

For study interval [startDate, endDate]:

A. Freeze point-in-time common-stock universe.
B. Enumerate every ex-right/ex-dividend/rights event.
C. Enumerate every capital-reduction resume event.
D. Enumerate every par-value-change event.
E. Enumerate every later new-share-listing supply event.
F. Preserve announcement/revision versions.
G. Join events to symbols only after the event table is complete.
H. Emit explicit:
- EXPECTED_EVENT_COUNT;
- OBSERVED_EVENT_COUNT;
- VERIFIED_EVENT_COUNT;
- UNKNOWN_EVENT_COUNT;
- sourceCoverageByActionType.

No-event controls can only be sampled from symbol/windows after this denominator pass.

Current v0.2 convenience registry does not satisfy this standard.

Status: BOUNDED DISCOVERY MANIFEST CONTRACT FROZEN / FULL HISTORICAL MANIFEST NOT YET BUILT.

---

## CA-078 — TWSE Price Index and Total Return Index exact-date source contracts are now live-validated

Official current OpenAPI endpoints:
- /exchangeReport/FMTQIK;
- /indicesReport/MFI94U.

Live payloads return:
- ROC date;
- TAIEX price index;
- TAIEX Total Return Index.

Official historical monthly contracts were also live-validated:
- /rwd/zh/afterTrading/FMTQIK?date=YYYYMM01&response=json
- /rwd/zh/TAIEX/MFI94U?date=YYYYMM01&response=json

Validated historical months:
- 2025-10;
- 2025-11;
- 2025-12;
- 2026-06;
- 2026-07.

These monthly records provide exact trading-date values needed for the stock return start date and target date.

No interpolation or nearest-date substitution is needed for the first four qualified event windows.

Status: HISTORICAL PRICE-INDEX AND TOTAL-RETURN BENCHMARK CONTRACTS = GO.

---

## CA-079 — First Legacy vs Price-Compatible vs Total-Return RS semantic sample

Artifact:
research/corporate_action_rs_semantic_sample_v0_1.json

This is a semantic diagnostic only.

### 2412 cash dividend
2026-06-10 -> 2026-07-09:
- TAIEX Price Index return = +4.93%;
- TAIEX Total Return Index return = +5.68%;
- Legacy RS = -12.22%;
- Price-Compatible RS = -12.22%;
- Total-Return RS = -9.38%.

Interpretation:
For an ordinary cash dividend, Price-Compatible stock return intentionally stays price-return based. Total-return semantics add the dividend back and compare with a total-return benchmark.

### 3593 loss reduction
2025-11-13 -> 2025-12-22:
- Price Index return = +0.88%;
- Total Return Index return = +1.03%;
- Legacy RS = +67.61%;
- Price-Compatible RS = +0.21%;
- Total-Return RS = +0.07%.

The apparent +67.6 percentage-point Legacy relative strength is overwhelmingly a capital-reduction price-base artifact.

### 8103 cash-refund reduction
2025-10-30 -> 2025-12-08:
- Price Index return = +0.06%;
- Total Return Index return = +0.06%;
- Legacy RS = +7.83%;
- Price-Compatible RS = -6.47%;
- Total-Return RS = -6.47%.

The sign itself reverses after the corporate-action bridge.

### 8422 par-value change
2025-10-07 -> 2025-11-17:
- Price Index return = +0.86%;
- Total Return Index return = +0.87%;
- Legacy RS = -88.67%;
- Price-Compatible RS = +21.11%;
- Total-Return RS = +21.11%.

This is a roughly 109.8 percentage-point semantic swing in relative strength.

### Core conclusion
One universal “adjusted return” is wrong.

Required semantic modes remain separate:
- LEGACY/RAW PRICE RETURN;
- PRICE_INDEX_COMPARABLE;
- TOTAL_RETURN_COMPARABLE.

Corporate-action mechanics can dominate current raw RS around unit-conversion events.

Status: RS SEMANTIC MATERIALITY = CONFIRMED / ALPHA VALUE NOT TESTED.

---

## CA-080 — No forward-return optimization after the RS semantic result

The RS differences are extremely large in some examples.

That is exactly why threshold tuning must remain blocked.

Do NOT:
- choose the RS mode that gives the best later return;
- retune RS thresholds on these hand-picked events;
- claim Price-Compatible or Total-Return RS improves selection win rate;
- promote either to Formal.

Next evidence target is denominator completeness and no-action controls.

The first question is:
“Which return definition is mechanically coherent for the stated benchmark?”

Only after that is frozen can future predictive value be tested on a complete, independent event/control sample.

Status: RS SEMANTIC BUG/RISK EVIDENCE STRONG / PREDICTIVE-ALPHA CLAIM NONE.

## Exact next continuation after CA-080

CA-081: define a prospective daily corporate-action archive using TWT48U_ALL + TWSE announcements + MOPS versioning.
CA-082: design historical bounded-period ingestion from official CSV/page artifacts with explicit completeness receipts.
CA-083: add systematic no-action controls matched by date, price tier, liquidity and sector.
CA-084: quantify how long raw-vs-continuity feature contamination persists after each action without using future return.
CA-085: test interaction with history-freshness PR #100 and Pattern raw/adjusted dual-space rules.


---

## CA-081 — Prospective daily corporate-action archive contract

New specification:
CORPORATE_ACTION_ARCHIVE_SPEC.md

Prospective archive sources:
- TWSE TWT48U_ALL snapshots;
- TWSE Official Document Announcements;
- capital-reduction/par-value announcement/reference pages;
- MOPS first-known filings and corrections;
- TWSE FMTQIK/MFI94U benchmark snapshots.

Every capture preserves:
- fetchedAt;
- payload hash;
- parser version;
- source status;
- event version;
- first-known/final-schedule-known timing;
- supersession chain.

No final event version may overwrite an earlier historical vintage.

Status: PROSPECTIVE ARCHIVE CONTRACT FROZEN.

---

## CA-082 — Historical bounded ingestion requires completeness receipts

For every historical interval and frozen stock universe, ingestion must emit a completeness receipt.

Required receipt fields:
- interval;
- universe version/count;
- source coverage by action type;
- expected/observed/verified/unknown event counts;
- parser failures;
- missing source dates;
- revision coverage;
- artifact hashes.

### Critical no-event rule
NO_EVENT is legal only after every relevant event-source family is complete for that symbol/window.

Otherwise:
EVENT_COVERAGE_UNKNOWN.

This prevents missing corporate-action data from silently becoming a clean no-action control.

Status: HISTORICAL COMPLETENESS RECEIPT CONTRACT FROZEN.

---

## CA-083 — Systematic no-action control matching design

No-action controls must not be arbitrary famous stocks.

For each action window, candidate controls should match point-in-time on:
- market date/regime;
- exchange;
- sector/industry where feasible;
- price tier including thousand-dollar pool;
- ADV/liquidity bucket;
- market-cap bucket;
- pre-event 20d/60d trend bucket;
- volatility bucket.

Exclude controls with:
- any unresolved corporate action inside the relevant 60-session feature window;
- suspension/halting ambiguity;
- incomplete history;
- event-coverage UNKNOWN.

### Purpose
Controls answer:
“Would raw and continuity pipelines be identical when no mechanical event exists?”

They are not selected to maximize outcome contrast.

### Outcome firewall
Matched controls can validate:
- identity;
- feature-distribution stability;
- false transformation rate.

They must not be used for alpha tuning until the event/control denominator is complete.

Status: MATCHED NO-ACTION CONTROL DESIGN FROZEN / SAMPLE BUILD PENDING.

---

## CA-084 — Corporate-action contamination persists far beyond event day

Artifact:
research/corporate_action_contamination_persistence_v0_1.json

Raw versus point-in-time continuity features were compared across post-event trading days without using forward-return outcomes.

### 2412
Observed 55 post-event trading days through 2026-09-24.
- numeric feature differences still present on day 54;
- A/B condition differences last observed day 46;
- full A/B pass-state difference last observed day 34.
Numeric convergence is right-censored because later data were not yet available.

### 3593
- numeric differences through trading-day offset 59;
- A/B condition differences through offset 54;
- full pass-state differences through offset 54.

### 8103
- numeric differences through offset 59;
- A/B condition differences through offset 14;
- full pass-state differences through offset 12.

### 8422
- numeric differences through offset 59;
- A/B condition differences through offset 50;
- full pass-state differences through offset 30.

### Structural explanation
This is expected from the feature architecture:
- MA5/10 recover quickly;
- 20-session return/MA/ATR/high-low/volume windows can carry contamination for roughly 20 sessions;
- MA60/ret60/priorHigh60 can carry it for roughly 60 sessions.

Therefore an event-day-only exclusion is insufficient.

Status: ROLLING-WINDOW CONTAMINATION PERSISTENCE = EMPIRICALLY CONFIRMED.

---

## CA-085 — Critical interaction with history-freshness PR #100

PR #100 correctly addresses stale/gapped all-market history, but the current proposed invariant uses market-wide official trading sessions.

Corporate-action research exposes a separate legitimate gap class:
**symbol-specific trading suspension.**

Verified examples:
- 8422 last old-share trade 2025-11-05, resumed 2025-11-17;
- 3593 last old-share trade 2025-12-10, resumed 2025-12-22;
- 8103 has the same capital-reduction suspension/resumption structure.

For a resume-day target, a validator that requires the immediately prior market-wide trading session can falsely classify a valid suspended symbol as stale.

### Required ordering

1. Market calendar proves which dates were exchange sessions.
2. Symbol-specific suspension archive proves which sessions the symbol was not supposed to trade.
3. Freshness validator checks expected SYMBOL sessions, not blindly every market session.
4. Only then can corporate-action continuity transform the valid raw history.
5. Pattern/K-line raw-vs-adjusted dual-space logic consumes the validated series.

### Fail-closed rule
If suspension provenance is unavailable:
UNKNOWN / DATA_INCOMPLETE.

Do not:
- invent bars;
- forward-fill suspended sessions;
- call the history fresh merely because a corporate action is suspected.

### Action taken
A blocking research comment was added to draft PR #100 requesting suspension-aware tests before any merge/deploy.

This preserves B-130 stale-history protection while avoiding a new false-rejection class.

### Pattern lane integration
K-line/Pattern research already requires explicit raw vs adjusted price space and corporate-action flags.
Corporate Actions should own the point-in-time event/continuity semantics.
Pattern research should consume those semantics rather than independently invent another adjustment method.

Status: CROSS-LANE INTEGRATION DEFECT FOUND / PR #100 MERGE SHOULD REMAIN BLOCKED UNTIL SUSPENSION SEMANTICS ARE TESTED.

## Exact next continuation after CA-085

CA-086: specify symbol-session calendar = market sessions minus verified symbol suspensions.
CA-087: create suspension-aware freshness test fixtures for 8422/3593/8103 on a research branch only.
CA-088: verify no conflict with B-130 stale-history rejection.
CA-089: define the exact handoff object from validated raw history -> corporate-action continuity -> Pattern dual-space research.
CA-090: only after cross-lane tests pass, prepare a combined owner decision memo; no merge/deploy.


---

## CA-086 — Symbol-session calendar contract

Market-wide session continuity is necessary but not sufficient.

Define:

SYMBOL_EXPECTED_SESSIONS(T) =
OFFICIAL_MARKET_SESSIONS(before T)
minus
VERIFIED_SYMBOL_SUSPENSION_SESSIONS.

Only VERIFIED suspension intervals may remove a market session.

If a suspected suspension lacks authoritative provenance:
SUSPENSION_PROVENANCE_UNKNOWN
and freshness remains UNKNOWN/DATA_INCOMPLETE.

### Why this matters
Capital reduction/par-value exchange can suspend one symbol while the market remains open.

The prior valid symbol session before resume day can therefore be many market sessions earlier.

Status: SYMBOL-SESSION CALENDAR CONTRACT FROZEN.

---

## CA-087 — Suspension-aware freshness prototype and fixtures

Draft PR #101 now includes:
- research/symbol_session_calendar_prototype.mjs
- tests/test_symbol_session_calendar_prototype.mjs

Fixtures cover:
- 8422 par-value suspension/resumption;
- 3593 loss-reduction suspension/resumption;
- 8103 cash-reduction suspension/resumption;
- unknown suspension provenance;
- B-130 stale-history control.

Expected behavior:
- verified suspension removes those dates from expected symbol sessions;
- valid pre-suspension history can remain fresh on resume day;
- unknown suspension evidence fails closed;
- B-130 remains stale when no verified suspension explains the missing sessions.

No Worker.js wiring exists in PR #101.

Status: SUSPENSION-AWARE PURE PROTOTYPE + FIXTURES CREATED.

---

## CA-088 — B-130 protection and suspension handling are compatible

These are different missing-bar classes.

### B-130 stale cache
Market session existed.
Symbol should have traded.
No verified suspension explains the missing bars.
=> reject as STALE / DATA_INCOMPLETE.

### Verified capital-action suspension
Market session existed.
Symbol was officially suspended.
No bar should exist.
=> exclude that date from expected SYMBOL sessions.

### Unknown reason for no bar
=> UNKNOWN / DATA_INCOMPLETE.

Therefore suspension awareness does not weaken the stale-history guard.
It improves the definition of the expected session set.

Status: STALE-HISTORY AND SUSPENSION SEMANTICS ARE LOGICALLY COMPATIBLE.

---

## CA-089 — Exact cross-lane handoff object

Validated history should flow through layers in this order:

### Layer 1 — RAW_VALIDATED
Fields:
- symbol;
- targetDate;
- rawBars;
- marketCalendarStatus;
- symbolSessionStatus;
- freshnessStatus;
- suspensionEvents;
- source provenance.

No corporate-action price transformation yet.

### Layer 2 — CORPORATE_ACTION_CONTEXT
- relevant action events inside feature window;
- event versions;
- first-known/effective timing;
- reference conflicts;
- volume transform modes;
- readiness/unknown reasons.

### Layer 3 — derived semantic spaces

RAW_EXECUTION_SPACE:
- actual traded OHLC;
- actual raw volume;
- used for execution/slippage and factual market prints;
- corporate-action reset flags mandatory.

TECHNICAL_CONTINUITY_SPACE:
- point-in-time continuity OHLC;
- comparable volume only when readiness permits;
- intended for MA/ATR/support/swing/pattern geometry research.

PRICE_INDEX_COMPARABLE_SPACE:
- stock price-return semantics aligned to TAIEX Price Index.

TOTAL_RETURN_COMPARABLE_SPACE:
- stock total-return semantics aligned to TAIEX Total Return Index.

### Layer 4 — Pattern Research
Pattern/K-line detectors consume the declared space.

Rules:
- support/resistance/swing topology should not treat a mechanical corporate-action reset as an ordinary break;
- raw overnight gap studies may inspect RAW_EXECUTION_SPACE but must tag/exclude corporate-action reset gaps from ordinary pattern inference;
- Pattern lane must not independently invent a second adjustment engine.

### Layer 5 — diagnostics
Persist:
- semantic space;
- action events applied;
- transform version;
- raw/continuity deltas;
- UNKNOWN reasons.

Status: CROSS-LANE HANDOFF CONTRACT V1 FROZEN.

---

## CA-090 — Combined owner decision memo is not yet ready

Research-only prototypes now exist for:
- corporate-action continuity;
- lifecycle-aware volume semantics;
- symbol-specific suspension calendars.

Draft PR #101 remains isolated and unmerged.

A small PR-specific GitHub Actions workflow was added on the research branch to define deterministic Node test commands, but no workflow run was observed from the current branch-only workflow addition.

Therefore do NOT claim execution-pass evidence yet.

Before an owner merge/deploy decision:
1. execute both prototype test suites in a trusted runner;
2. integrate/verify suspension source provenance;
3. re-run B-130 stale-history tests;
4. verify no-action identity;
5. verify Pattern handoff semantics;
6. decide whether PR #100 needs a suspension-aware revision or a separate prerequisite layer.

Status: OWNER DECISION MEMO = PENDING TEST EXECUTION / NO MERGE / NO DEPLOY.

## Exact next continuation after CA-090

CA-091: obtain executable test evidence for PR #101 without touching production.
CA-092: determine the safest integration order between PR #100 freshness and suspension/corporate-action context.
CA-093: design a prospective suspension archive from official TWSE announcements.
CA-094: test multiple corporate actions inside one 60-session window.
CA-095: test stock-dividend ex-right followed by later new-share listing as two-stage contamination windows.

---

## CA-091 — Executable PR #101 evidence obtained

The prior CA-090 state was TEST_EXECUTION_PENDING. That state is now superseded.

Draft PR #101 head `35209c791ce59959ca5a4ffd0d1fdbd9b11f9492` produced trusted GitHub Actions execution:
- Research Corporate Action Prototype run `36138447978`: completed / success;
- V8 Repair CI run `36138447823`: completed / success;
- V8 Regression Tests run `36138447812`: completed / success.

Research job `108082103374` executed:
- `node tests/test_corporate_action_continuity_prototype.mjs`
  -> `corporate action semantic prototype tests passed`;
- `node tests/test_symbol_session_calendar_prototype.mjs`
  -> `symbol-session calendar prototype tests passed`.

This confirms executable evidence for the pure research prototypes. It does NOT prove that the prototypes are production-ready and does not authorize merge/deploy.

Status:
PR_101_RESEARCH_TEST_EXECUTION = CONFIRMED_SUCCESS.
FORMAL_CORE = UNCHANGED.
WORKER_WIRING = NONE.

---

## CA-092 — Safe integration order between PR #100 and suspension/corporate-action context

PR #100's branch implementation validates freshness against market-wide official sessions.
That is correct for ordinary active symbols, but insufficient for verified symbol-specific capital-action suspensions.

PR #101 separately proves a pure symbol-session definition:
`EXPECTED_SYMBOL_SESSIONS = MARKET_SESSIONS - VERIFIED_SYMBOL_SUSPENSION_SESSIONS`.

Positive evidence:
- 8422 resume 2025-11-17 can legitimately use 2025-11-05 as the prior symbol session when 2025-11-06..2025-11-14 is a VERIFIED suspension interval.
- 3593 and 8103 exhibit the same capital-action suspension/resumption class.
- The PR #101 fixture passes these cases.

Negative/falsification evidence:
- Unknown suspension quality returns `SUSPENSION_PROVENANCE_UNKNOWN`; it does not silently excuse gaps.
- B-130 stale cache remains rejected when no verified suspension explains 2026-09-14..2026-09-23 missing symbol sessions.
- Therefore suspension awareness does not weaken the stale-history invariant; it changes only the expected-session set when evidence is VERIFIED.

Safe dependency order:
1. prove exchange market sessions;
2. prove exchange-scoped symbol suspension intervals;
3. derive expected symbol sessions;
4. run freshness validation on the expected symbol sessions;
5. only after raw history is valid, derive corporate-action semantic spaces;
6. Pattern/K-line and other research lanes consume the declared semantic space.

Merge/deploy implication:
PR #100 should not be promoted as a market-session-only freshness implementation.
The minimum safe promotion candidate must first consume a verified symbol-session layer or equivalent suspension-aware expected-session contract and must retain the B-130 negative control.

Status:
INTEGRATION_ORDER = SYMBOL_SESSION_PREREQUISITE_BEFORE_FRESHNESS_PROMOTION.
NO MERGE / NO DEPLOY performed.

---

## CA-093 — Prospective suspension archive widened to TWSE + TPEx

The previous archive design was materially TWSE-centric. That is insufficient for a Taiwan common-stock universe that includes TPEx securities.

### TWSE official lane
Verified public surfaces:
- TWSE OpenAPI Swagger advertises `GET /exchangeReport/TWTAWU` for suspended-trading securities.
- TWSE historical suspended-trading page supports period/security/category search and CSV export and states coverage from 2011-10-03:
  https://www.twse.com.tw/zh/trading/historical/twtawu.html
- TWSE Official Document Announcements and MOPS significant disclosures remain required to attribute corporate-action cause, revisions and first-known timing.

Falsification / uncertainty:
The direct TWTAWU API payload was not retrievable through this round's web client.
Therefore exact field/schema assumptions are not promoted:
`TWSE_TWTAWU_MACHINE_FIELD_CONTRACT=UNKNOWN`
until a successful archived capture exists.

### TPEx official lane
Verified public surface:
- TPEx Trading Halt/ Resumption Trade:
  https://www.tpex.org.tw/en-us/announce/market/halt/historical.html
  exposes Today/History, year/security-category filters and CSV download.
- TPEx change-of-par-value and capital-reduction/new-share official pages provide separate corporate-action cause/resume evidence.

Falsification / uncertainty:
A stable public machine endpoint for the TPEx halt/resumption dataset was not frozen in this round.
Therefore:
`TPEX_HALT_MACHINE_ENDPOINT_CONTRACT=UNKNOWN`.
Do not invent one.

### New completeness rule
Suspension coverage is exchange-scoped.
A complete TWSE lane does not imply complete TPEx coverage.
Absence may become NO_SUSPENSION only when the symbol's exchange/date/parser lane is proven complete; otherwise it remains SUSPENSION_PROVENANCE_UNKNOWN / EVENT_COVERAGE_UNKNOWN.

The durable source/archive contracts were extended in:
- CORPORATE_ACTION_ARCHIVE_SPEC.md;
- CORPORATE_ACTION_DISCOVERY_SOURCE_CONTRACT.md.

Status:
PROSPECTIVE_SUSPENSION_ARCHIVE = EXCHANGE_SCOPED_CONTRACT_READY / MACHINE_CONTRACT_PARTIAL.

---

## CA-094 — Multiple corporate actions inside one rolling window

The existing prototype already had a synthetic two-unit-conversion compounding test. That proves transformation ordering mechanics, but not a real Taiwan lifecycle family.

A real lifecycle witness was added to PR #101 using 8454:
- stock-dividend ex-right price event: 2025-08-21;
- later new-shares-listed supply event: 2025-10-09;
- both can coexist inside a 60-session rolling history.

New deterministic test:
- targetDate = 2025-10-09;
- ex-right factor = `1 / 1.05`;
- ex-right volume mode = NONE;
- later listing factor = 1;
- later listing volume mode = SUPPLY_CHANGE;
- event input order is tested both forward and reversed.

Expected and now tested semantics:
- price adjustment applies only to bars before the ex-right event;
- the later listing event does not retroactively create another price reset;
- raw share volume is not mechanically rescaled at either stage;
- the result is invariant to input event order because events are sorted by effective date;
- price continuity remains complete;
- volume continuity becomes incomplete when the SUPPLY_CHANGE stage enters the relevant window.

PR #101 research-only commit:
`a6b45a4253648372dcb462f0cacfedea50234775`
message:
`research: add 8454 two-stage corporate-action window test`.

Fresh CI on that commit:
- Research Corporate Action Prototype `36139660200`: success;
- V8 Repair CI `36139659976`: success;
- V8 Regression Tests `36139660103`: success.

Status:
REAL_TWO_EVENT_WINDOW_ORDERING = TESTED_SUCCESS.
No Worker.js wiring, merge or deploy.

---

## CA-095 — Stock-dividend ex-right -> later new-share listing is a two-stage contamination problem

8454 is the decisive lifecycle witness.

Stage 1 — EX_RIGHT_PRICE_EVENT:
- mechanical price reset occurs on the ex-right trading date;
- technical/RS price semantics may require a point-in-time price bridge;
- tradable-share volume is not automatically rescaled merely because stock dividend entitlement exists.

Stage 2 — NEW_SHARES_LISTED:
- later new shares enter the tradable supply;
- this is not another mechanical ex-right price-reset event;
- old daily share volume must not be multiplied by a stock-dividend ratio;
- rolling volume comparisons become semantically incomplete unless a point-in-time listed-shares/float/turnover denominator is available.

Positive validation:
The new two-stage PR #101 test preserves price continuity and correctly flips `volumeContinuityComplete` to false at the listing stage.

Negative validation:
A naive one-event model would create at least one of two errors:
1. rescale volume at the ex-right date before tradable supply actually changes; or
2. ignore the later supply-stage comparability break because no new price factor is needed.

Therefore:
PRICE_EVENT and SUPPLY_EVENT must remain separate records even when they share one `actionFamilyId`.

This is a mechanics/data-semantics result only.
It is not evidence that stock dividends are bullish/bearish and it does not justify an alpha score.

Status:
TWO_STAGE_STOCK_DIVIDEND_CONTAMINATION = EMPIRICALLY_SUPPORTED_BY_REAL_LIFECYCLE_TEST.

## Exact next continuation after CA-095

CA-096: build a full 60-session 8454 real-bar window spanning both lifecycle stages and quantify which current Formal rolling price/volume features remain admissible vs UNKNOWN.
CA-097: distinguish listed-shares, issued-shares, free-float and traded-volume denominators; determine the minimum denominator contract for SUPPLY_CHANGE volume comparability.
CA-098: add exchange-scoped suspension completeness fixtures, including a TPEx corporate-action suspension/resumption witness.
CA-099: combined PR #100/#101 test matrix — valid suspension, unknown suspension, ordinary stale cache, multiple actions, and no-action identity.
CA-100: produce an evidence-gated owner decision memo only if CA-096..099 pass; still no autonomous merge/deploy or Formal Core change.

---

## CA-096 — Full real 61-bar 8454 lifecycle window

A complete real daily-bar mechanics witness is now materialized:
`research/corporate_action_8454_full_window_v0_1.json`.

Source:
Fugle Stock `FCNT000002` ("近5年價量(交易用)") raw trading series.

Critical source falsification:
A separate `FCNT000154` request was sent with `adjusted=false`, but the returned payload explicitly reported `adjusted=true`.
Therefore FCNT000154 is not accepted as raw evidence for this study.
The raw-trading contract was cross-checked through FCNT000002, which preserves:
- 2025-08-20 close = 272;
- 2025-08-21 close = 261;
and thus preserves the actual ex-right discontinuity.

Target:
2025-10-09, with 61 bars for exact ret60/priorHigh60 mechanics.

Events in the window:
- 2025-08-21 stock-dividend EX_RIGHT_PRICE_EVENT;
- 2025-10-09 NEW_SHARES_LISTED / SUPPLY_CHANGE.

Raw vs TECHNICAL_CONTINUITY:
- ret20: 4.0323% vs 4.0323%;
- ret60: -0.7692% vs +4.1923%;
- MA20: 246.20 vs 246.20;
- MA60: 259.6167 vs 253.9929;
- ATR20%: 2.0736 vs 2.0736;
- priorHigh20: 258.5 vs 258.5;
- priorHigh60: 287.0 vs 273.3333.

Interpretation:
By 2025-10-09 the ex-right reset has aged out of 20-session price features but remains inside 60-session features.
This is exactly the rolling-contamination shape predicted by CA-084.

Negative result retained:
The raw and continuity versions both fail the full A/B setup on 2025-10-09.
Therefore this witness supports semantic/material feature differences but does NOT support a forced signal-flip claim.

Volume:
- raw volumeTodayVsPrev5 = 0.825379;
- volumeContraction5to20 = 1.153497.
The later SUPPLY_CHANGE does not justify mechanically rescaling old executed-share volume.

Status:
FULL_REAL_8454_60_SESSION_MECHANICS = MATERIALIZED.
NO ALPHA CLAIM.
FORMAL CORE UNCHANGED.

---

## CA-097 — Raw share volume vs issued-share/free-float turnover

The previous single Boolean `technicalVolumeReady` / `volumeContinuityComplete` is too coarse for lifecycle semantics.

New durable specification:
`CORPORATE_ACTION_VOLUME_DENOMINATOR_SPEC.md`.

### Required split

RAW_SHARE_VOLUME:
- actual executed shares;
- no denominator;
- pure SUPPLY_CHANGE does not change the meaning of one executed share;
- do not mechanically rescale historical raw volume.

ISSUED_SHARE_TURNOVER:
- executed shares / point-in-time issued or listed shares;
- minimum defensible denominator for normalizing a changing share base.

FREE_FLOAT_TURNOVER:
- executed shares / point-in-time free-float shares;
- distinct research question and denominator contract.

Suggested research readiness fields:
- shareUnitComparable;
- rawShareVolumeReady;
- issuedShareTurnoverReady;
- freeFloatTurnoverReady;
- supplyBreakPresent;
- supplyBreakEffectiveDate;
- denominatorKnownAt;
- denominatorSource;
- unknownReasons.

### 8454 exact denominator falsification

The initial diagnostic used the nominal 5% stock-distribution ratio to backsolve:
12,617,870 / 5% = 252,357,400 shares.

Official company capital history proves that exact backsolve is wrong by five shares:
- official pre-increase shares: 252,357,405;
- official post-registration shares: 264,975,275;
- actual new shares: 12,617,870;
- actual aggregate increase: about 4.9999999009%.

The company FAQ states the 264,975,275 issued shares were approved by MOEA on 2025-09-22.
The annual report capital table shows 252,357,405 before the increase and 264,975,275 after.

Therefore:
NOMINAL_DISTRIBUTION_RATIO != AUTHORITATIVE_EXACT_DENOMINATOR.

The CA-096 artifact was corrected to preserve the nominal-ratio backsolve only as a falsification witness; official share counts are now the authoritative denominator evidence.

At 2025-10-09:
- raw volumeTodayVsPrev5 = 0.825379;
- issued-share-turnover-normalized analogue using official share counts = about 0.786075.
No A/B volume-condition flip occurs in this specific witness.

Boundary sensitivity remains real:
- raw 1.32 with a ~5% denominator step becomes about 1.257, crossing a 1.30 breakout-volume threshold;
- raw 1.08 becomes about 1.029, which can cross a 1.05 low-volume threshold.

These are semantic boundary examples only, not outcome or alpha evidence.

Formal implication:
Current Formal A/B arithmetic is explicitly raw share-volume based.
A pure SUPPLY_CHANGE does not make those raw arithmetic features undefined.
Any future switch/addition to turnover-normalized features is a separate owner-governed strategy/data-definition decision.

Status:
VOLUME_SPACE_SPLIT = REQUIRED.
OFFICIAL_POINT_IN_TIME_DENOMINATOR = REQUIRED.
NO FORMAL CHANGE.

---

## CA-098 — TPEx corporate-action suspension witness

A real TPEx fixture is now included in PR #101.

Official witness:
5314 世紀民生 / par-value change:
- old par value: NT$10;
- new par value: NT$0.5;
- suspension interval: 2025-03-20 through 2025-03-28;
- new shares resume trading: 2025-03-31;
- TPEx announcement document number referenced by the fixture: 11400008901.

Research branch commit:
`3003492b46600bc7bed556e753de57da3fc5239e`
adds the TPEx fixture to:
`tests/test_symbol_session_calendar_prototype.mjs`.

Expected semantics:
For target 2025-03-31, the prior expected symbol session is 2025-03-19 after removing the VERIFIED TPEx suspension interval from TPEx market sessions.

Important design result:
The pure symbol-session calendar logic is exchange-agnostic.
Exchange-specific responsibility belongs in the source/provenance layer.

Status:
TPEX_REAL_SUSPENSION_FIXTURE = ADDED / VERIFIED BY CI AFTER TEST CONTRACT FIX.

---

## CA-099 — Combined falsification matrix

New PR #101 test:
`tests/test_corporate_action_integration_matrix.mjs`.

Matrix:
1. VERIFIED suspension -> valid symbol history;
2. UNKNOWN suspension -> fail closed;
3. ordinary B-130 stale cache -> reject;
4. two corporate actions in one window -> deterministic ordering / price complete / normalized volume continuity not proven;
5. no corporate action -> strict transform identity.

Workflow:
`.github/workflows/research-corporate-action-prototype.yml`
now runs the integration matrix explicitly.

### Failure retained, diagnosed and corrected

First integrated run:
`36140962127` = FAILURE.

Cause:
The new TPEx 5314 fixture asserted `result.expectedSessions`, but `validateSymbolHistoryFreshness()` does not expose that field in its return contract.

This was a TEST-CONTRACT ERROR, not a prototype-logic failure.

Corrective action:
commit
`6729c56d045d993c58cd89290411d45a5b394142`
removed the unsupported assertion without changing the prototype behavior.

Fresh trusted execution on current PR #101 head:
- Research Corporate Action Prototype `36141243309`: SUCCESS;
- V8 Regression Tests `36141242876`: SUCCESS;
- V8 Repair CI `36141243153`: SUCCESS.

Research job `108091334629` explicitly reports success for:
- Corporate action continuity tests;
- Symbol suspension calendar tests;
- Corporate action integration falsification matrix.

Status:
COMBINED_FALSIFICATION_MATRIX = EXECUTED_SUCCESS.
FAILURE_HISTORY RETAINED.
NO PROTOTYPE BEHAVIOR WAS CHANGED TO MAKE THE TEST PASS.

---

## CA-100 — Evidence-gated owner decision memo

Materialized:
`CORPORATE_ACTION_OWNER_DECISION_MEMO.md`.

The memo separates:
- empirically supported data-semantics conclusions;
- executable test evidence;
- PR #100 / #101 dependency ordering;
- remaining source/completeness blockers;
- future owner decision options.

Current draft states:
- PR #100 must not be promoted as market-session-only freshness;
- symbol-session provenance is a prerequisite layer;
- PR #101 remains research-only and has no Worker.js wiring;
- no merge/deploy is authorized;
- Formal Core remains locked.

Remaining blockers include:
- production-grade TWSE + TPEx suspension capture/completeness receipts;
- point-in-time event version archive;
- explicit raw vs normalized volume semantic contract for downstream consumers;
- production integration tests against preserved real historical caches;
- owner authorization for any future Class B runtime change.

Status:
OWNER_DECISION_MEMO = EVIDENCE_GATED_READY.
NO OWNER OPTION AUTO-SELECTED.
NO MERGE / NO DEPLOY.

## Exact next continuation after CA-100

CA-101: harden point-in-time issued-share denominator sourcing across cash capital increase, stock dividend, capital reduction and par-value change.
CA-102: build denominator-vintage fixtures that prove no future share-count leakage into historical replay.
CA-103: quantify raw-volume vs issued-share-turnover threshold disagreement rates on a bounded non-inference sample.
CA-104: research corporate-action interactions with institutional-flow normalization and market-cap/valuation denominators.
CA-105: widen lifecycle/state-machine tests to same-day/multiple-stage/revision edge cases; keep Formal Core locked.



---

## CA-101 — Point-in-time share-denominator source contract hardened

A durable source contract now exists in:
`CORPORATE_ACTION_SHARE_DENOMINATOR_SOURCE_CONTRACT.md`.

### Required denominator spaces

The research can no longer use one generic `sharesOutstanding` concept.

Separate:
- REGISTERED_ISSUED_SHARES;
- EXCHANGE_LISTED_SHARES / tradable listed supply;
- OUTSTANDING_SHARES;
- FREE_FLOAT_SHARES;
- EPS_WEIGHTED_AVERAGE_SHARES.

Each version must preserve both:
- `knownAt`: when the value became available to the system;
- `effectiveFromSession`: when that denominator semantics becomes applicable to a market session.

Replay may consume a version only when both gates pass.

### Real family validation

8454 stock dividend:
- registered issued shares 252,357,405 -> 264,975,275;
- registration approval 2025-09-22;
- new shares listed 2025-10-09.
This proves registration and tradable-supply clocks differ.

8422 par-value change:
- registration occurred months before the actual market share-unit switch;
- old-unit shares continued trading until the suspension/resume boundary.
This proves a registration date cannot be reused as a bar-unit conversion date.

3593 capital reduction:
- reduction basis, registration and resumed trading/new-share listing are separate dates.
This proves financial-report/accounting share restatement is not a bar-level trading denominator.

2465 cash increase/payment certificates:
- the listing-stage evidence initially appeared to support a 83,946,031 -> 93,946,031 share-base step on 2025-11-17;
- deeper official registration evidence falsifies that as REGISTERED_ISSUED_SHARES timing;
- 10,000,000 payment certificates began listed trading on 2025-11-17, while the MOEA change-registration list records NT$939,460,310 capital only on 2026-01-06;
- therefore tradable supply can change before final registered common-share state.

This negative result is retained. It is exactly the kind of denominator-semantic error the source contract is designed to prevent.

Status:
POINT_IN_TIME_DENOMINATOR_CONTRACT = HARDENED.
FORMAL CORE = UNCHANGED.

---

## CA-102 — Denominator-vintage anti-leakage fixtures

Materialized:
`research/corporate_action_denominator_vintage_threshold_v0_1.json`.

Four deterministic replay fixtures freeze the anti-look-ahead behavior:

1. FUTURE_KNOWN_BLOCK:
   a denominator learned after replayAsOf cannot leak backward even if its effective session is earlier than the target being studied.

2. KNOWN_BUT_NOT_EFFECTIVE:
   a future supply change may be known, but the old denominator remains active until its own effective market session.

3. KNOWN_AND_EFFECTIVE:
   the new version becomes consumable only after both clocks pass.

4. LATE_REVISION_NO_RETRO_LEAK:
   a correction learned later can improve EX_POST_MECHANICS_TRUTH but cannot rewrite what POINT_IN_TIME_KNOWN_TRUTH was at the historical decision time.

Real-event guard:
8454's exact first-known timestamp is not fully archived, so verified ex-post mechanics must not be relabeled as historically known truth.

Status:
DENOMINATOR_VINTAGE_FIXTURES = FROZEN.
NO FUTURE SHARE-COUNT LEAKAGE = REQUIRED.

---

## CA-103 — Bounded raw-volume vs turnover-normalized threshold disagreement

The first bounded mechanics artifact is:
`research/corporate_action_denominator_vintage_threshold_v0_1.json`.

No forward returns are used.
No parameter is tuned.
This is not an alpha test.

### 8454 real event-day witness

On 2025-10-09:
- raw volumeTodayVsPrev5 = 0.8253790;
- registered-issued-turnover analogue = 0.7860752;
- A low-volume threshold 1.05: both PASS;
- B breakout threshold 1.30: both FAIL.

So a material numeric change does not necessarily cause a Boolean condition flip.

### 2465 five-session real listing window

TWSE historical stock-profile snapshot volumes are preserved for 2025-11-10 through 2025-11-21.

Critical source correction:
- strict then-registered denominator stays 83,946,031 through the tested 2025-11 window;
- 93,946,031 was not yet the confirmed registered-share state on 2025-11-17;
- therefore REGISTERED_ISSUED_SHARE_TURNOVER has no denominator step at the payment-certificate listing date and produces zero threshold disagreement with raw volume in this window.

A separate public-tradable sensitivity uses:
58,946,031 original listed common shares excluding 25,000,000 private-placement shares
-> 68,946,031 after adding 10,000,000 listed payment certificates.

Under that sensitivity:
- 2025-11-18 raw ratio = 1.0908796;
- normalized ratio = 1.0003297;
- raw A low-volume <=1.05 = FAIL;
- tradable-supply normalized A low-volume <=1.05 = PASS.

Five-session count:
- registered-issued low-volume disagreement: 0/5;
- public-tradable sensitivity low-volume disagreement: 1/5;
- breakout >=1.30 disagreement: 0/5.

Because the exact exchange-listed denominator definition for private-placement treatment remains PARTIAL_CONFLICT, the 1/5 result is a sensitivity result, not production truth.

### Structural result

For:
current turnover / average(previous 5 turnover),
a one-time denominator step can alter the ratio only while the rolling window straddles the step.
After current plus all five prior sessions share one constant denominator, that denominator cancels algebraically unless another denominator event occurs.

This gives a finite contamination horizon for this specific normalized ratio.

Status:
THRESHOLD_DISAGREEMENT = REAL BUT DENOMINATOR-SEMANTIC DEPENDENT.
ALPHA = NOT TESTED.
FORMAL = UNCHANGED.

---

## CA-104 — Institutional flow, market-cap and valuation denominator interactions

### Institutional flow

Current Worker institutional fields are raw net-share counts / sign streaks:
- foreignNet;
- trustNet;
- dealerNet;
- institutionTotalNet;
- foreignBuyDays / trustBuyDays / dealerBuyDays.

A pure supply change does not invalidate those factual net-share counts.

Do not rescale historical raw institution flow merely because new shares are listed.

If research later constructs:
- institutionNet / issued shares;
- institutionNet / listed shares;
- institutionNet / free float;
each becomes a separate denominator-defined feature and must pass the CA-101/102 point-in-time contract.

A holdings percentage is different again:
the percentage can move mechanically when the denominator changes even with zero holder trading.

### Market capitalization

Current `Worker.js` can fall back to:
`sharesOutstanding * close / 1e8`
when explicit `marketCapYi` is missing.

That is safe only for the semantic/date represented by the supplied share count.
It is unsafe for historical replay if a current share snapshot is multiplied by an old price across a corporate action.

Research market-cap records therefore need:
- marketCapSemantic;
- denominatorType/value;
- price session;
- knownAt;
- source provenance.

Registered issued shares, tradable listed shares and free float are not interchangeable market-value denominators, especially with private-placement shares/payment certificates.

No Worker code is changed here.

### Valuation / EPS

EPS weighted-average shares belong to financial-report semantics.
They are not a daily trading-supply denominator.

Capital reduction/split accounting may restate comparative EPS deliberately.
That does not authorize using the restated weighted-average share count to normalize old daily volume.

Point-in-time valuation research must preserve the source snapshot/methodology rather than recomputing historical P/E with a present-day share base.

Status:
INSTITUTION / MARKET_CAP / VALUATION DENOMINATOR FIREWALL = FROZEN.
NO FORMAL CHANGE.

---

## CA-105 — Lifecycle revision and same-day/multiple-stage edge matrix

Materialized:
`research/corporate_action_lifecycle_edge_matrix_v0_1.json`.

The matrix freezes eight cases:

1. same-day registration + listing;
2. revision before the original effective date;
3. late correction after effective date;
4. cancellation before effective date;
5. same-day UNIT_SCALE + SUPPLY_CHANGE;
6. conflicting primary denominator artifacts;
7. real 8454 registration -> later new-share listing;
8. real 2465 payment-certificate listing -> later registered-share change.

### Frozen lifecycle rules

- Event identity includes actionFamilyId + stage + effectiveSession + version.
- Different semantic stages remain separate even on the same session.
- Input/ingestion order must not determine transformation order.
- Revision preserves old versions for historical replay; it does not delete history.
- A cancelled planned event never becomes realized supply.
- UNIT_SCALE, PRICE_RESET and SUPPLY_CHANGE are independently idempotent transforms.
- Conflicting primary artifacts produce CONFLICT / UNKNOWN for normalized features; no latest-wins shortcut.
- Raw factual share volume may remain usable even when a normalized denominator is UNKNOWN.
- NO_EVENT is legal only when event-source coverage is complete.

This artifact is a deterministic specification fixture, not executable CI evidence.
No runtime implementation is claimed.

Status:
LIFECYCLE_REVISION_EDGE_CONTRACT = FROZEN.
FORMAL CORE = LOCKED / UNCHANGED.

## Exact next continuation after CA-105

CA-106: build an official TWSE + TPEx denominator-source archive/completeness receipt contract, including payment certificates/private-placement treatment.
CA-107: widen CA-103 to a pre-registered multi-event bounded sample across stock dividend, cash increase/payment certificate, capital reduction and unit-scale families without outcome inference.
CA-108: create point-in-time market-cap / institutional-normalization replay fixtures and quantify denominator disagreements.
CA-109: make lifecycle revision/cancellation fixtures executable in the research-only test lane; preserve negative controls and no Worker.js wiring.
CA-110: evidence checkpoint: decide whether the denominator archive/state machine is mature enough for a Class-A Shadow implementation proposal only; no Formal merge/deploy.
