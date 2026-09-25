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
