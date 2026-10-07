# D18 Price-Space vs Share-Denominator Action-Family Adequacy 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / TWO_FAMILY-SET_SEMANTICS_FROZEN / U2B_FULL_ADEQUACY_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Affected modules: D18-04, D18-06
Formal Core impact: NONE

## Purpose

Prevent one generic "corporate action complete" flag from being reused for two different estimands:

1. D18-04 U2B price-return continuity;
2. D18-06 market-cap/share-denominator vintage.

These require overlapping but non-identical event families.

## 1. Two different family-set authorities

### A. PRICE_RESET_FAMILY_SET

Question:
Can raw close-to-close prices be interpreted in one coherent price space across the target pair/window?

Primary consumer:
D18-04 U2B.

Relevant event types include:
- ex-right / ex-dividend reference-price resets;
- rights/subscription-related ex-right resets where represented by the ex-right reference-price family;
- capital-reduction reference-price resets;
- par-value/share-unit changes;
- split/reverse-split-like unit changes;
- suspension/resumption with special reference-price or unit-space implications;
- merger/share-conversion/delisting/identifier transitions when the old/new security price pair is not directly comparable.

### B. SHARE_DENOMINATOR_FAMILY_SET

Question:
What share denominator was economically effective for the target market date?

Primary consumer:
D18-06.

Relevant event types include:
- stock dividend/capitalization new-share listing;
- cash capital increase / payment-certificate/new-share listing;
- capital reduction;
- par-value/share-unit conversion;
- treasury-share acquisition/cancellation/transfer depending on the chosen denominator definition;
- CB/warrant conversion when new shares are actually issued/listed;
- employee/restricted-share issuance when realized;
- merger/share exchange;
- other realized share-base changes.

The denominator set is broader than the price-reset set.

## 2. Shared research already proves the clocks can differ

Canonical corporate-action research shows:
- registration date;
- legal effective date;
- ex-right/reference-price date;
- suspension/resumption date;
- new-share listing/delivery date;
- source publication/knownAt date
may all differ.

Therefore one event receipt cannot automatically answer both:
"Is today's price comparable with the prior session?"
and
"Which share count is effective today?"

## 3. Current official/shared continuity coverage

Current System2 historical actual-result continuity infrastructure materially covers:
- EX_RIGHT_DIVIDEND;
- CAPITAL_REDUCTION;
- PAR_VALUE_CHANGE;
for TWSE and TPEx.

TWSE bounded suspension completeness is now being developed from TWTAWU for the exact replay interval.

These are strong inputs for PRICE_RESET_FAMILY_SET.

But U2B full family adequacy is not yet proven merely because those three official action families exist.

## 4. Event-family disposition for U2B V0.1

### EX_RIGHT_DIVIDEND

Role:
PRICE_RESET_REQUIRED.

Reason:
the reference-price reset directly changes the meaning of raw prior close vs current close.

Cash/stock dividend and rights/subscription price-reset mechanics belong here when the canonical source family maps them to the exchange reference-price event.

### CAPITAL_REDUCTION

Role:
PRICE_RESET_REQUIRED + DENOMINATOR_RELEVANT.

Reason:
can mechanically rebase price and change the share base.

### PAR_VALUE_CHANGE

Role:
PRICE_RESET_REQUIRED + DENOMINATOR_RELEVANT.

Reason:
can produce a large unit/price reset while changing share count without changing enterprise value.

### SECURITY-UNIT SPLIT / CONSOLIDATION — domestic ordinary common equity scope

Role:
PRICE_RESET_REQUIRED + DENOMINATOR_RELEVANT.

Updated disposition:
`DOMESTIC_ORDINARY_COMMON_EQUITY_MECHANICAL_UNIT_CHANGE_MAPPED_TO_PAR_VALUE_CHANGE`.

Official TWSE/TPEX market rules make the mapping explicit for stock par-value changes:
- share-exchange ratio = old par value / new par value;
- the same ratio = post-change issued shares / pre-change issued shares;
- the resumed-trading reference-price framework is mechanically based on that ratio.

Therefore, for the bounded D18 ordinary-common-equity price-space claim, a separate generic "stock split" family is not required when the economic event is an official stock-par-value change already captured by the canonical PAR_VALUE_CHANGE family.

Important scope limits:
- this mapping is for security-unit changes in domestic ordinary common equity;
- ETF beneficiary-certificate split/reverse-split is a separate exchange process and is outside the ordinary-equity U2B universe;
- foreign/TDR/other security-class unit changes are not silently inherited;
- legal COMPANY_DEMERGER / business split is NOT a stock-unit split and remains an identity/pair-comparability problem.

Official anchors:
- TWSE stock par-value change reference-price calculator/rules;
- TWSE Operating Rules Article 67-2;
- TPEx stock par-value-change announcement table.

This resolves the domestic ordinary-equity split-like unit-change alias question without creating a new provider family.

### SUSPENSION / RESUMPTION

Role:
SESSION_AND_REFERENCE_CONTINUITY_REQUIRED.

A no-trade interval changes prior-session identity.
Resumption can also have special reference-price semantics.

Bounded TWTAWU completeness can prove the suspension-state part for one exact window.
It does not by itself prove every price-reset family.

### MERGER / SHARE_CONVERSION / DELISTING / IDENTIFIER CHANGE

Role:
PAIR_COMPARABILITY_BLOCKER unless a separate canonical transformation exists.

V0.1 should not manufacture an adjusted cross-security return.
If the pair crosses identity/membership semantics:
U2B = UNKNOWN / NOT_COMPARABLE.

### NEW-SHARE LISTING WITHOUT PRICE RESET

Role:
DENOMINATOR_RELEVANT, not automatically PRICE_RESET_REQUIRED.

The event can materially change market cap/float/supply while raw close-to-close price continuity may remain valid.

This event therefore belongs primarily to D18-06 / denominator lineage.

### TREASURY SHARE / BUYBACK

Role:
DENOMINATOR_DEFINITION_DEPENDENT.

It may affect OUTSTANDING_SHARES or free float depending on the chosen denominator.
It is not automatically a mechanical exchange reference-price reset.

### CB/WARRANT CONVERSION

Role:
DENOMINATOR_RELEVANT when new shares are realized/listed.

Potential dilution is not realized dilution.
No price-reset classification is inferred from conversion possibility alone.

## 5. Consequence for the first U2B CLEAR_NO_ACTION path

For one pair to enter:
`U2B_CLEAR_NO_ACTION_PRICE_RETURN`

the following must be separately true:

1. exact prior eligible session identity is proven;
2. bounded suspension/lifecycle state is complete for the pair/window;
3. PRICE_RESET_FAMILY_SET coverage is complete for the exchange/window;
4. no active price-reset event crosses the pair;
5. same-security identity/membership is preserved;
6. current/prior raw close rows are PIT-safe and hash-bound.

The pair does NOT need every denominator-changing event family to be absent if those events do not alter price-space comparability.

But any denominator-based statistic on the same row remains separately gated by SHARE_DENOMINATOR_FAMILY_SET.

## 6. Consequence for D18-06 size membership

D18-06 S1 EFFECTIVE_MARKET_CAP_MEMBERSHIP requires:
- denominatorType explicitly chosen;
- denominatorFamilySetVersion;
- effective-date/session semantics;
- realized share-base event coverage;
- current/point-in-time source and effective-vintage proof.

A PRICE_RESET_FAMILY_SET pass cannot certify the size denominator.

## 7. Preventing overblocking and underblocking

### Overblocking error

Rejecting a valid U2B price return merely because a new-share listing changed the denominator but did not break raw price-space comparability.

### Underblocking error

Accepting a U2B price return because share count was unchanged while an ex-right/capital-reduction/par-value reset mechanically changed the price space.

Both errors arise when one generic corporate-action flag is used for two different estimands.

## 8. Required version identities

Future receipts must use separate fields:

- `priceResetFamilySetVersion`;
- `priceResetCoverageReceiptHash`;
- `shareDenominatorFamilySetVersion`;
- `shareDenominatorCoverageReceiptHash`.

No aliasing.

For D18-04:
share-denominator fields may be null/not-applicable when no denominator metric is consumed.

For D18-06:
price-reset fields may still be useful for return controls but cannot substitute for denominator vintage.

## 9. Current adequacy conclusion

### U2B PRICE_RESET_FAMILY_SET

Status:
`PARTIAL_STRONG_BUT_NOT_COMPLETE`.

Strengths:
- EX_RIGHT_DIVIDEND official historical family;
- CAPITAL_REDUCTION official historical family;
- PAR_VALUE_CHANGE official historical family;
- exact-session reconciliation physically accepted;
- bounded TWTAWU negative-suspension proof path frozen.

Remaining:
- exact V0.1 treatment of merger/share-conversion/identifier transitions;
- non-domestic / non-ordinary-security unit-change scope remains fail-closed rather than inherited;
- first real bounded CLEAR_NO_ACTION receipt;
- machine receipt proving the family-set version actually used.

### D18-06 SHARE_DENOMINATOR_FAMILY_SET

Status:
`BROADER_SCOPE_NOT_EXECUTABLE`.

Shared research semantics are strong, but the point-in-time effective-share denominator replay is not yet a production-grade research receipt.

## 10. Maturity impact

No level change.

D18-04 remains L2/40.
D18-06 remains L2/40.

This packet removes semantic ambiguity; it does not create executable Taiwan replay evidence.

## Exact next

1. Freeze the domestic ordinary-equity PAR_VALUE_CHANGE mapping in the versioned PRICE_RESET_FAMILY_SET and keep non-domestic/non-ordinary security classes fail-closed.
2. Resolve merger/share-conversion/delisting/identifier-transition treatment as pair-comparability blockers unless an explicit transformation exists.
3. DATA_LANE produces first real bounded TWTAWU + price-reset-family complete CLEAR_NO_ACTION receipt.
4. Room11 builds/validates U2B row/aggregate receipt using that exact family-set version.
5. D18-06 separately waits for effective-share denominator replay; do not borrow U2B completeness.


## 2026-10-08 official-market clarification — par-value change is the domestic ordinary-share unit-change family

External official-source readback adds a scoped semantic clarification.

TWSE's stock par-value-change calculator states:
`exchangeRatio = oldParValue / newParValue = postChangeIssuedShares / preChangeIssuedShares`.

TWSE Operating Rules Article 67-2 likewise sets the resumed-trading price-limit/reference basis from the pre-change last close divided by the post-/pre-change issued-share ratio.

TPEx's stock par-value-change announcement table publishes the same exchange-ratio identity.

Research consequence:
- a mechanical share-unit expansion/contraction caused by stock par-value change is already a PAR_VALUE_CHANGE event in the ordinary domestic-equity price-space ontology;
- do not create a duplicate generic SPLIT_REVERSE_SPLIT family for the same event;
- legal corporate demerger / company split remains distinct and may involve reduction, exchange, suspension and identity change;
- ETF split/reverse-split is a distinct security-class process and is outside the ordinary-equity U2B baseline.

This is semantic/source-scope progress only; it does not create the first physical CLEAR_NO_ACTION receipt.

Official source anchors:
- https://www.twse.com.tw/zh/announcement/change/cal.html
- https://twse-regulation.twse.com.tw/tw/law/DOC01.aspx?FLCODE=FL007304&FLNO=67-2
- https://www.tpex.org.tw/zh-tw/announce/market/change.html
