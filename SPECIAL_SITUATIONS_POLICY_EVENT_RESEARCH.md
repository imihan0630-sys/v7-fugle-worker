# Special Situations & Policy Event Research

Updated: 2026-10-03 Asia/Taipei  
Status: RESEARCH_ONLY / MECHANISM_AND_FALSIFICATION_FROZEN / OUTCOMES_CLOSED  
Owner: 08｜事件與新聞研究室  
Scope: D11-15..D11-19 + D17-14  
Formal Core impact: NONE

## 0. Research question and boundary

This continuation asks whether the newly added special-situation and policy-event curriculum can be represented as **point-in-time event state machines** rather than one-shot narrative labels, while preserving failure/cancellation states, source clocks, instrument semantics, transaction costs and UNKNOWN.

This file does **not** claim predictive alpha. It does not inspect post-event stock returns, tune thresholds, open a historical Shadow cohort, or alter System 1 / System 2 formal behavior.

Primary ownership:
- D11 owns company-event terms, legal/economic state transitions, effective/tradable clocks and deal-break states.
- D17 owns information arrival, policy/regulatory novelty, expectation-versus-surprise and transmission.
- D10 may provide supply-chain exposure dependencies only.
- D13 may provide macro/geopolitical controls only.
- D14/D15/D16 own execution cost, portfolio risk and validation respectively.

## 1. Cross-module event clock contract

A Boolean such as `IPO=true`, `lockupExpired=true`, `privatePlacement=true`, `tenderOffer=true`, `merger=true` or `policyEvent=true` is insufficient.

Preserve, where applicable:

- `eventFamily`
- `eventId` / source-native identifier when available
- `stage`
- `eventOccurredAt`
- `boardApprovedAt`
- `shareholderApprovedAt`
- `regulatoryFiledAt`
- `sourcePublishedAt`
- `capturedAt`
- `effectiveFromSession`
- `tradableFromSession`
- `settlementOrClosingAt`
- `expectedAt` / `expectedWindow`
- `expectedState`
- `realizedState`
- `revisionOf`
- `cancelledAt`
- `sourceVersion`
- `rawPayloadHash`
- `parserVersion`
- `dataQuality`
- `pointInTimeEligible`

Until source-native availability is independently authenticated, `capturedAt` remains the conservative replay-eligibility clock. Legal deadlines, fact dates, filing dates and displayed publication timestamps remain separate provenance fields and cannot backdate strategy observability.

Revisions, amendments, postponements, extensions, failed deals and withdrawals append new versions; they never rewrite the earlier state.

## 2. D11-15 — IPO / Listing / Bookbuilding

### Mechanism

Taiwan IPO underwriting has multiple ex-ante and realized clocks: underwriting method, bookbuilding/auction window, expected price range, final underwriting price, allocation, first tradable session and any failed/withdrawn path. TWSE/Taiwan Securities Association rules provide formal underwriting-process semantics; the bookbuilding price range is determined and filed before the relevant bookbuilding period.

The economic channels are not one-dimensional:
- offer-price discovery and information aggregation;
- supply introduced into public trading;
- allocation scarcity and attention;
- stabilization/underwriting mechanics;
- first-session liquidity and price-limit/microstructure effects.

### Falsification and failure conditions

- IPO completion-only samples create survivorship/selection bias by dropping withdrawn, delayed or failed offerings.
- Underpricing is not equivalent to persistent post-listing alpha.
- A hot issuance market can jointly drive issuance volume and first-day returns.
- Bookbuilding information may already be incorporated before first trading.
- Allocation probability and inability to obtain the offer allocation make offer-to-close returns non-replicable for many investors.
- First-session price behavior can be dominated by liquidity, limits and attention rather than valuation discovery.

### PIT contract

Frozen stages:
`APPLICATION -> APPROVAL -> UNDERWRITING_METHOD -> RANGE_KNOWN -> BOOKBUILDING_OR_AUCTION -> FINAL_PRICE -> ALLOCATION -> FIRST_TRADABLE_SESSION`

Terminal alternatives:
`WITHDRAWN / FAILED / POSTPONED / UNKNOWN`.

Do not use final price or allocation information before its actual first-known clock.

Maturity decision: **D11-15 L0 -> L2**. Taiwan official rule lanes are identified, but historical/prospective first-known capture and complete failed-offering coverage are not yet validated; L3 remains closed.

## 3. D11-16 — Lock-up Expiry / Insider Supply

### Mechanism

TWSE listing-review rules create explicit centralized-custody restrictions for specified insiders/shareholders and release schedules tied to elapsed time from listing. This provides a plausible, pre-scheduled **potential supply** event.

The correct state is potential tradability, not realized sale:
`LOCKUP_DEFINED -> LOCKED -> RELEASE_SCHEDULED -> PARTIAL_RELEASE_AVAILABLE -> FULL_RELEASE_AVAILABLE`.

Actual owner sale, borrow availability, pledge release or market disposal are distinct later states.

### Falsification and failure conditions

- Release eligibility is not sale.
- A fully anticipated expiry can be priced in before the release date.
- Insiders may voluntarily continue holding.
- Simultaneous earnings, index changes, capital raising or market-wide stress can dominate the event.
- Historical international evidence documents higher trading volume and negative average abnormal returns around some IPO lockup expiries, but also reports incomplete explanatory power; it is mechanism evidence, not a Taiwan sign rule.
- Ownership categories and lockup terms vary; one universal “180-day supply shock” shortcut is prohibited.

### PIT and supply semantics

Required fields include original locked quantity, holder category, release fraction/date, extensions/exemptions, actual released quantity when observable and later realized disposal if separately disclosed.

Maturity decision: **D11-16 L0 -> L2**. Mechanism and counterevidence are frozen; Taiwan PIT historical/prospective release receipts remain pending.

## 4. D11-17 — Secondary Offering / Private Placement

### Mechanism

Public follow-on issuance, cash capital raising and private placement must not be merged into one dilution label.

Taiwan Securities and Exchange Act private-placement rules separate:
- shareholder authorization;
- pricing rationale and subscriber eligibility;
- payment completion;
- restricted resale;
- later public issuance/listing eligibility.

Private-placement securities can occupy a different tradability/instrument space from exchange-listed common shares for years. This directly reuses the corporate-action denominator lesson: registered-issued, exchange-listed, tradable and free-float spaces are not interchangeable.

Frozen lifecycle:
`PROPOSAL -> SHAREHOLDER_AUTH -> PRICING -> SUBSCRIBER_FIXED -> PAYMENT_COMPLETE -> DELIVERY -> RESTRICTED_HOLDING -> PUBLIC_ISSUANCE_ELIGIBILITY -> LISTING_OR_OTHER_EXIT`.

### Falsification and alternative mechanisms

A new equity issue can mean:
- adverse-selection / financing-need signal;
- mechanical supply/dilution;
- growth financing;
- balance-sheet repair;
- strategic/monitoring investor certification.

The sign is therefore not monotonic. Empirical private-placement research reports materially different outcomes depending on governance, buyer type and pricing; long-run “new issue underperformance” can also weaken after risk/liquidity/matching controls. Event-study design must not hard-code “issuance = bearish”.

### PIT / bias controls

- Keep public offering and private placement separate.
- Preserve instrument/tradability state and exact denominator space.
- Include cancelled/failed offerings.
- Do not use later realized use-of-proceeds or subscriber outcomes at the authorization timestamp.
- Control issuance size against the correct point-in-time share denominator.
- Separate announcement, pricing, payment, delivery and listing clocks.

Maturity decision: **D11-17 L0 -> L2**. Taiwan legal/source semantics are identified; versioned first-known event histories and prospective receipts remain pending.

## 5. D11-18 — Tender Offer / Going Private / Delisting

### Mechanism

A tender offer is a conditional claim, not a guaranteed convergence trade. Taiwan rules distinguish filing/announcement, offer period, changed terms, condition achievement, regulatory approvals, settlement and unsuccessful termination. Current rules specify a bounded offer period and explicitly define condition achievement around required tender quantity plus required approvals/effectiveness.

Frozen lifecycle:
`FILED_ANNOUNCED -> TENDER_OPEN -> CONDITION_PENDING -> REGULATORY_PENDING -> CONDITION_MET -> TENDER_CLOSED -> PAYMENT_SETTLEMENT -> DELISTING_PROCESS -> DELISTED`.

Failure branches:
`MINIMUM_NOT_MET / REGULATORY_FAILURE / WITHDRAWAL_OR_STOP_APPROVED / PAYMENT_FAILURE / EXTENDED / TERMS_REVISED / UNKNOWN`.

Going-private and delisting clocks are separate from the tender announcement. A share conversion or merger can create stop-trading and termination-of-listing dates that are mechanically distinct from first announcement.

### Falsification and costs

- Offer spread is compensation for deal-break, time, funding and settlement risk.
- Capital can be locked during tender/settlement.
- Minimum tender conditions may fail.
- Regulatory approvals may be delayed or denied.
- Changed terms and extensions alter the expected payoff.
- A stock can trade above an offer because of competing-bid expectations; this does not prove the original deal value is wrong.
- Delisting mechanics can create liquidity/exit constraints before economic closing.

Maturity decision: **D11-18 L0 -> L2**. Legal stage semantics and failure states are defined; Taiwan historical first-known and complete tender lifecycle capture remain unvalidated, so L3 is closed.

## 6. D11-19 — Spin-off / Merger Arbitrage / Deal-break Risk

### Ownership boundary versus D11-06

D11-06 remains owner of the underlying M&A/disposition transaction state. D11-19 owns the **tradable special-situations payoff geometry**, hedge state, spread, corporate restructuring entitlement and explicit deal-break risk. It must not duplicate D11-06 as a second M&A vote.

### Merger-arbitrage state

For cash deals:
`dealSpread_t = offerCashKnownAt_t - targetPrice_t` is descriptive only; it is not expected return until success probability, timing, costs and break-state loss are modeled.

For stock deals:
`dealValue_t = exchangeRatioKnownAt_t * acquirerPrice_t + cashComponentKnownAt_t`.

The exchange ratio and cash terms must be those knowable at time t; later amendments cannot be backfilled.

Required states:
`AGREEMENT -> TERMS_KNOWN -> SHAREHOLDER_PENDING -> REGULATORY_PENDING -> CLOSING_CONDITIONS_PENDING -> CLOSE / BREAK / REPRICE / EXTEND`.

### Spin-off state

Preserve:
`BOARD_PROPOSAL / SHAREHOLDER_APPROVAL / RECORD_DATE / ENTITLEMENT_RATIO / EFFECTIVE_DATE / CHILD_LISTING_DATE / DISTRIBUTION_OR_SETTLEMENT / REVISION_OR_CANCEL`.

The parent, child and any stub claim are distinct instruments; price continuity and denominator semantics must be guarded.

### Counterevidence

Classic merger-arbitrage evidence shows nonlinear downside in severe market declines and emphasizes transaction costs; risk-arbitrage returns can resemble short-index-put exposure rather than a free convergence premium. Acquirer-price reaction can also contain arbitrage-trader short-sale pressure, which is an alternative explanation to pure fundamental wealth destruction.

Costs include:
- borrow/locate and recall risk for stock deals;
- hedge-ratio drift;
- settlement/funding cost;
- taxes/fees/slippage;
- capital lock-up;
- gap and price-limit risk on deal break.

Maturity decision: **D11-19 L0 -> L2**. Payoff geometry and falsification are frozen; Taiwan deal-history PIT receipts and replicable cost/borrow evidence remain pending.

## 7. D17-14 — Policy / Regulatory Event Clock / Surprise

### Why policy is not one event timestamp

Policy/regulatory information may arrive through:
`RUMOR -> DRAFT_OR_CONSULTATION -> PREANNOUNCEMENT -> SCHEDULED_DECISION -> FINAL_DECISION_PUBLISHED -> IMPLEMENTATION_RULE -> EFFECTIVE -> REVISED / DELAYED / CANCELLED / COURT_STAY`.

Taiwan FSC exposes draft-preannouncement/consultation records separately from final laws and press releases. Therefore draft publication, final issuance and effective date are separate clocks.

### Surprise contract

A valid policy surprise requires an ex-ante expectation source preserved **before** the decision:
`surprise_t = realizedDecision_t - expectedDecision_(t-)`
only when both sides share compatible units/definitions.

If no archived expectation exists, surprise is **UNKNOWN**. It may not be reverse-engineered from the market reaction.

For categorical policies, store the pre-event expected distribution/scenario set rather than inventing a numeric surprise.

### Information-shock falsification

High-frequency monetary-policy research provides an important general falsification: measured “policy surprises” can correlate with information already observable before the event, and central-bank announcements can combine a policy shock with an information shock. Therefore “unexpected tightening/easing” and “new information about the economy” are separate mechanisms.

Policy communication may also be multi-stage: statement, press conference, minutes, speech or implementing regulation. They belong to one event family only when identity/version evidence supports the cluster; distinct new information must remain a new version/event.

### Cross-domain boundary

- D17 owns policy event identity, source/version, first-known clock, expectation/surprise and attention/transmission.
- D13 owns macro-policy state and cross-market controls.
- D10 owns supply-chain exposure propagation.
- D11 owns issuer-specific corporate event states.
No double factor voting across these domains.

Maturity decision: **D17-14 L0 -> L2**. Mechanism and falsification are defined; Taiwan prospective/historical PIT capture across draft/final/effective versions remains pending.

## 8. Duplicate / revision / negative-evidence rules

One economic event can appear as:
- regulator announcement;
- exchange notice;
- issuer material disclosure;
- media syndication/update.

`articleIdentity != eventIdentity`.

Official facts may serve as canonical event truth, while media still provide attention/discovery evidence. Do not count every retelling as a new event.

A disappearance from a source window is never proof of cancellation. Cancellation requires a positive cancellation/revision record or verified source semantics.

`NO_KNOWN_EVENT` requires expected-versus-observed source coverage over the relevant lanes. Otherwise absence remains UNKNOWN.

## 9. Bias / overfit / Factor-Zoo controls

Mandatory before any outcome study:
1. Include failed, cancelled, withdrawn and delayed events.
2. Freeze event inclusion before inspecting returns.
3. Freeze D0/D1/D5/D20 or other horizons before outcome joins; do not search horizons for the best effect.
4. Use independent event dates; report event/date clustering and sector concentration.
5. Control market/sector/regime and overlapping major events.
6. Preserve exact common-support samples when comparing alternative definitions.
7. Correct for multiple testing across event families, stages, horizons and thresholds.
8. Compare simple baselines before NLP/complex models.
9. Treat multiple stages from one deal as correlated observations, not independent evidence.
10. Test incremental value beyond existing D11/D17 clocks, corporate-action guards, liquidity, volatility, gap and price-trend controls.

## 10. Cost and replay requirements

Outcome evidence must include event-specific implementation costs:
- IPO allocation probability and unavailable allocation;
- lock-up release liquidity and realized-sale uncertainty;
- offering dilution/tradability and issuance settlement;
- tender capital lock/funding;
- merger-arbitrage borrow/hedge/recall and deal-break gaps;
- delisting/suspension/price-limit exit constraints.

Replay requires immutable source/version receipts, exact first-known eligibility, correction chains, point-in-time instrument mapping and explicit UNKNOWN.

Historical “Shadow” samples may not be fabricated from current webpages or ex-post event lists.

## 11. Incremental value to System 1 / System 2

Potential System 1 value:
- event-continuity firewall;
- structured gap/tail-risk context;
- prevention of invalid denominators and impossible exits;
- future research candidates for event-aware eligibility only after evidence.

Potential System 2 value:
- structured event timeline and explanations;
- special-situations state visualization;
- expectation-versus-realization narratives with source provenance;
- more faithful scenario and risk tracking.

Current decision:
`FORMAL_OPTIMIZATION_CANDIDATE = NO`.

Reason:
All six modules now have mechanism/falsification contracts, but none has passed L3 PIT replay feasibility plus L4 prospective/OOS outcomes, transaction-cost robustness, redundancy and multi-regime validation.

## 12. Engineering / governance classification

This work is **Class A — research documentation / schema contract only**.

No Worker.js change, Cron, binding, database production schema, Formal selection, ranking, threshold, Top6, 3+3, capital, entry/add/reduce/sell/stop, monitoring, push or Production behavior is changed.

## 13. Maturity decision

- D11-15: L0 -> L2
- D11-16: L0 -> L2
- D11-17: L0 -> L2
- D11-18: L0 -> L2
- D11-19: L0 -> L2
- D17-14: L0 -> L2

With the current 19-module D11 and 14-module D17 curriculum:
- D11 recomputes to approximately **50.5%**
- D17 recomputes to approximately **41.4%**
- Room 08 weighted-by-module aggregate recomputes to approximately **46.7%**

This is curriculum learning progress, not trading-performance evidence.

## 14. Exact next continuation point

1. D11-15: freeze at least two independent Taiwan IPO lifecycles including range/final-price/first-trade and at least one failed/withdrawn/delayed control if available; preserve source-native versions and capturedAt.
2. D11-16: build issuer-specific lock-up/custody release receipts with original quantity, release schedule, actual tradability and later insider-sale evidence kept separate.
3. D11-17: build public-offering versus private-placement state receipts, including payment, delivery, restricted-trading and later listing clocks; reconcile exact denominator space.
4. D11-18/19: collect complete tender/M&A lifecycles containing success **and** failure/extension/reprice states before opening any spread-return cohort.
5. D17-14: prospectively capture draft/consultation, final decision and effective-date versions for independent Taiwan policy events; preserve ex-ante expectation sources or set surprise UNKNOWN.
6. Only after PIT/source-version completeness is validated may any of these modules be considered for L3. Outcome joins remain closed until preregistered.

## 15. Source anchors

Primary Taiwan official:
- TWSE/Taiwan Securities Association underwriting rules: https://twse-regulation.twse.com.tw/TW/law/DOC01.aspx?FLCODE=fl007541&FLNO=23
- TWSE listing review custody/lock-up rules: https://twse-regulation.twse.com.tw/tw/law/DOC01_print.aspx?FLCODE=FL007326&FLNO=10
- FSC Securities and Exchange Act: https://law.fsc.gov.tw/LawContent.aspx?id=FL007009
- FSC tender-offer regulations: https://law.fsc.gov.tw/LawContent.aspx?id=FL007245
- TWSE Operating Rules / merger and share-conversion clocks: https://twse-regulation.twse.com.tw/TW/law/DAT06.aspx?FLCODE=FL007304&FLDATE=20260806&LSER=001
- FSC draft-regulation history: https://law.fsc.gov.tw/DraftForum.aspx?Type=H

Mechanism/counterevidence:
- Field & Hanka (2001), IPO lockup expiry: https://doi.org/10.1111/0022-1082.00334
- Kang & Park (2020), private placements and firm value: https://doi.org/10.1017/S0022109020000599
- Mitchell & Pulvino (2001), risk arbitrage: https://doi.org/10.1111/0022-1082.00385
- Bauer & Swanson, reassessing monetary-policy surprises: https://www.nber.org/papers/w29939
- Jarociński & Karadi (2020), monetary policy vs information shocks: https://doi.org/10.1257/mac.20180090
