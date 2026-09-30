# D11 Capital-Structure Event State Machines — Convertible Bonds and Treasury Stock

Updated: 2026-10-01 Asia/Taipei
Room: 08｜事件與新聞研究室
Scope: D11-04 可轉債／CB事件; D11-05 庫藏股
Mode: deep research + falsification + Taiwan PIT feasibility
Formal Core impact: NONE

## Executive result

Two D11 modules now have Taiwan-specific point-in-time source feasibility strong enough for L3, but not outcome alpha.

The common result is that corporate-action announcements are state transitions, not one bullish/bearish event. Intention/authorization, legal filing/publication, effective trading or conversion window, actual execution/conversion, settlement/share-delivery, and later cancellation/transfer/redemption/registration must remain separate clocks.

## D11-04 — Convertible bond / CB event state machine

### Official Taiwan evidence

Current FSC rules for domestic convertible bonds require issue/conversion terms to specify issuance date, redemption/call terms, listing or OTC trading, conversion procedure, conversion price, conversion period, conversion-price adjustment, post-conversion rights and fulfillment method. Conversion requests become effective on delivery to the issuer/agent; when new shares are used, shares or bond-conversion certificates must be delivered within five business days. Issuers using new shares must announce the prior quarter's newly issued share amount within 15 days after quarter end.

Official TPEx and government open-data surfaces separately expose recently listed convertible/exchangeable bonds, issue date, maturity, current outstanding balance, issue conversion price, conversion period, early-redemption/call notices with announcement and future delisting dates, and conversion/cumulative statistics. MOPS also exposes convertible-bond announcement and conversion-change query lanes.

This proves a Taiwan event ledger is feasible, but it also proves there is no single CB date.

### Frozen CB states

BOARD_OR_FILING_INTENT -> REGULATORY_EFFECTIVE -> ISSUE_PRICED -> ISSUED -> LISTED -> CONVERSION_WINDOW_OPEN -> CONVERSION_PRICE_ADJUSTED -> CONVERSION_REQUEST -> SHARE_OR_CERTIFICATE_DELIVERED -> CALL_OR_EARLY_REDEMPTION_NOTICE -> FINAL_CONVERSION_WINDOW -> DELISTED_OR_MATURED -> CAPITAL_REGISTRATION_UPDATE.

Each state preserves sourcePublishedAt, capturedAt/knownAt, effectiveFrom, bondCode and issuerCode, conversion price/adjustment basis when relevant, outstanding balance, conversion-period bounds, call/redemption terms, source lineage and revision state.

### Strong falsification: conversion reports are not daily share-denominator truth

A quarterly announcement of newly issued shares is a lagging aggregation. Legal share delivery can occur within five business days of a conversion request, while capital registration can occur later. Therefore CB issue announcement is not the dilution date; conversion-window opening is not converted amount; call notice is not converted-share count; and quarterly converted-share disclosure is not exact daily listed-share denominator.

Corporate-action denominator logic must consume a daily/exact share source or an event ledger whose completeness and effective dates are independently proven. Otherwise denominator state is UNKNOWN.

### Directional falsification

No universal CB_ISSUE=bearish or CB_CALL=bullish/bearish rule survives the evidence. Taiwan research reports negative announcement effects in some samples, while other Asian evidence reports positive announcement effects when investment opportunities/use of proceeds differ. Convertible-call literature also separates signaling, forced-conversion supply, hedging/short-sale pressure, liquidity and wealth-transfer mechanisms; in-the-money and out-of-the-money calls can have different signs.

Status: D11-04 = L3 / TAIWAN_PIT_SOURCE_FEASIBLE / MULTI_CLOCK_STATE_MACHINE_FROZEN / OUTCOME_EVIDENCE_PENDING.

## D11-05 — Treasury-stock state machine

### Official Taiwan evidence

Taiwan's current share-repurchase rules require an exchange/OTC-listed company to announce and file the buyback plan within two days of the board resolution, including purpose, security type, maximum amount, planned period/quantity, price range, method, existing treasury shares and prior/uncompleted programs.

The plan is not the execution: purchases must be completed within two months of filing; cumulative purchases reaching 2% of issued shares or NT$300 million trigger an additional disclosure within two days; completion/expiry must be reported within five days; MOPS transmission completes the statutory disclosure; and the company may later change the original purpose under specified governance procedures.

TWSE public statistics provide a strong real-world counterexample to treating authorization as realized demand: among 152 buyback programs in the cited one-year window, only 35 reached 100% execution while 34 were below 50%.

### Frozen treasury-stock states

BOARD_AUTHORIZATION -> PLAN_DISCLOSED -> EXECUTION_WINDOW_OPEN -> ACTUAL_PURCHASE_ACCUMULATING -> THRESHOLD_DISCLOSURE -> COMPLETED/EXPIRED/TERMINATED -> ACTUAL_EXECUTION_SUMMARY -> HELD_AS_TREASURY -> TRANSFER_TO_EMPLOYEES / EQUITY_CONVERSION_USE / CANCELLATION_REGISTRATION / OTHER_LEGAL_DISPOSITION.

The three statutory purposes are materially different: employee transfer; equity-conversion use for warrant/convertible instruments; or protection of company credit/shareholder interests with cancellation.

### Denominator / supply firewall

Do not equate planned buyback quantity, actual purchased quantity, treasury inventory, cancelled shares, and later transferred/reissued shares. Actual market purchases can reduce public float/outstanding availability before they reduce legal issued shares. Purpose-3 cancellation has its own registration clock. Employee transfer or conversion use can later return treasury shares to outside holders.

A single sharesOutstanding -= plannedBuyback shortcut is prohibited.

### Strong PIT counterevidence

Completion-period disclosures may later contain daily actual purchase details, but an ex-post daily breakdown is not proof that the same details were public on each historical trading day. Historical replay uses only what was captured/available by decision time.

### Directional falsification

Repurchase announcements often have positive average announcement effects in Taiwan research, but this does not justify a deterministic bullish rule. Actual execution materially varies; stated purpose may add little incremental information; and the relation depends on execution intensity, financial flexibility, prior credibility, retirement versus reissue/transfer and later operating performance. Actual repurchase can be more informative than announcement alone.

Status: D11-05 = L3 / TAIWAN_PIT_SOURCE_FEASIBLE / INTENT_VS_EXECUTION_SEPARATED / OUTCOME_EVIDENCE_PENDING.

## Cross-module D17-06 implication — Expectation vs Surprise

Corporate actions give a concrete falsification framework for D17-06: announced planned quantity is expectation/intention; actual buyback quantity is realization; planned CB issuance/conversion terms are opportunity sets; actual conversion, call and outstanding-balance changes are realizations.

A future surprise variable must compare the pre-event expected state against newly knowable realized state. It may not use final execution data to rewrite the earlier expectation. D17-06 remains L2 because predictive/OOS value is not yet proven.

## System implications

System 1: no Formal factor is proposed; these states strengthen historical-continuity, denominator and event-risk firewalls.

System 2: the event/news layer can later consume CB state transitions and treasury authorization-vs-execution states, but no directional score, ranking weight, sizing rule or live trigger is authorized.

FORMAL_OPTIMIZATION_CANDIDATE = NO.

## Exact next continuation

1. Build immutable prospective Taiwan CB lifecycle receipts across independent dates, without joining returns.
2. Build prospective treasury-stock plan-to-execution receipts separating plan, threshold disclosures, final execution and disposition.
3. Only after those receipts exist, preregister D17-06 expectation-vs-realization surprise definitions before outcome inspection.
4. Keep D17 fixed-cadence disclosure capture and CA-113/114 denominator archive gates independent.