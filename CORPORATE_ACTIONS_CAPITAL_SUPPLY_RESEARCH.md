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
