# D21｜內部人揭露可見性與交易意圖不可識別性反證（2026-10-11）

Owner: 14｜公司治理與內部人研究室。研究專用，非正式策略。Formal Core LOCKED。
Base main observed: 5a17a0c643e0a9d58ae9f2e81614333e6c7e6e60。
Modules: D21-03 (L2/40%), D21-04 (L2/40%); D21-07 as anti-double-count dependency only。
This receipt adds a **new official FAQ-backed observability/identification gate**, not historical MOPS receipts and not a replay.

## 1. First-party source and exact statements
Taiwan Stock Exchange, 內部人股權管理／常見問答:
https://www.twse.com.tw/zh/products/education/insider/qa.html
Observed during 2026-10-11 research. The live FAQ has **no verified immutable historical publication timestamp**, so its current content must not be backfilled as a verified earlier rule vintage.

- Q4: once a pre-transfer filing has been fully sold during its declared window, an insider with a further >10,000-share transfer need may file another advance notice. Separate filing intentions can exist; do not count each filing as a realized trade.
- Q6: an insider resigning mid-month must still file prior-month change by the fifth of next month, but MOPS will not display that change because the person is no longer an insider. This is **filing-versus-public-visibility divergence**; an absent MOPS row does not mean no filing or no transaction.
- Q9: a gift of shares can be made while a company is repurchasing treasury shares because a gift is not a market sale. Distinguish gift from sale and from company buyback.
- Q10: a short-swing profit recapture request at or above NT$20m meets the described material-information disclosure threshold. **Absence of a major-information notice is not proof of zero short-swing events**; threshold, applicability and contemporaneous version must be checked.
- Q12: an internal form handed/faxed to the issuer or transfer agent is not the same as confirmed MOPS upload; a transfer may be undertaken under the rule only after confirmation that the notice was uploaded. A purported form preparation date is not public first-known.
These are source statements about the current FAQ, not independent evidence of historical issuer-specific actions.

## 2. Non-identification proofs and observation model
Let latent gross market buys B>=0 and sells S>=0; public monthly holding delta may satisfy ΔH = B-S+G+T+I+O, where G=gift/inheritance net transfer, T=trust movement, I=issuance/corporate action, O=other adjustments (all with signed conventions). From ΔH=0 alone, both (B=0,S=0) and (B=100,S=100) are observationally equivalent, as are offsetting gifts/trusts. Therefore net holdings alone cannot identify gross transactions or motive.

For an insider leaving office, define F=actual filing made, V=publicly visible MOPS row, R=resignation status. Official Q6 provides an allowed state R=1,F=1,V=0. Hence V=0 does **not** imply F=0. Missingness can depend on governance turnover (R), which is also a hypothesized predictor: it is not safe to assume missing completely at random.

For pre-transfer intent, observed announced quantity A does not identify realized quantity X; X may be 0<=X<=A for a single notice absent amendments/exception checks. Repeated notices cannot be summed as executed sales without independent completion records. For pledge, legal collateral status is separate from ownership transfer, actual loan cash-flow, and margin-call terms.

## 3. Research-only event schema and fail-closed gate
Required provenance:
issuerId, filerId, controllerGroupId, legalRoleAsOf, roleEffectiveFrom, roleEffectiveTo, eventFamily, eventAction, measurementAsOf, noticePreparedAt, issuerReceivedAt, mopsUploadedAt, firstPublicKnownAt, firstKnownEvidenceKind, documentId, sourceURL, documentVersionHash, regulationVersion, originalOrCorrection, parentEventId, observedQuantity, executedQuantity, observedChannel, visibilityState, observationCoverage, motiveEvidence, status.
All unknown fields are nullable/UNKNOWN; no invented timestamps or amounts.

- PRE_TRANSFER_NOTICE => INTENT_ONLY until independently matched to an executed market trade; internal fax is not firstPublicKnownAt.
- EXECUTED_MARKET_TRADE => observable transaction only if execution is documented; economic motive remains UNKNOWN absent separate evidence.
- GIFT / TRUST / INHERITANCE / TAX_REORGANIZATION / PASSIVE_CORPORATE_ACTION => non-directional, not market buy/sell.
- PLEDGE_SETUP / PLEDGE_RELEASE => collateral-state change, not buy/sell or inferred distress.
- RESIGNED_INSIDER_MONTHLY => visibility may be NOT_PUBLIC despite reporting duty; keep non-observable group in the missingness ledger.
- SHORT_SWING_MAJOR_NOTICE => threshold-selected event view, not complete short-swing population.
- MOPS corrections append a new known-at vintage; never overwrite historical earlier knowledge.
- Same ultimate controller, same underlying event and related legal persons share parentEventId; do not create independent evidence votes.

## 4. Hypotheses, falsifications and alternative explanations
H1: economically funded insider net purchases may contain incremental information. Support: asymmetric private information could exist. Falsification: ownership delta is not gross market flow; gifts/trusts/tax/pledges/passive changes and role-related missingness can mimic directional signals. Alternative: diversification, liquidity, estate planning, corporate actions, employee compensation. Reject H1 as a trade signal if genuine executed own-capital changes cannot be independently isolated, or if PIT OOS residual alpha after size/industry/controller type/price trend/liquidity/valuation/earnings/event controls and costs is absent.

H2: controller pledge increases governance tail risk. Support: potential collateral calls and forced sales. Falsification: pledge may be routine financing, a foreign institutional collateral arrangement or tax/asset planning; release is not purchase. Alternative: firm credit quality, volatility, sector funding and controller liquidity. Without original setup/release receipts, controller identity, contract terms, first-known and future independent tail outcomes, risk score and margin-call price remain UNKNOWN.

H3: observable insider rows represent the whole insider population. Official resignation counterexample refutes that identification assumption. Stratify historical role transitions, include delisted firms, compute coverage by sector, size, controller and resignation state. Missingness itself is not automatically BAD.

## 5. Verification design / gate status
- PIT: each field uses firstPublicKnownAt and source/version; absent exact timestamp, conservative legally valid day-bound is allowed only where separately proven, never intraday.
- OOS/walk-forward: pre-register calendar windows, immutable issuer/role cohort, no survivorship, independent date clusters; hold out a true future or independent period.
- Multiple testing / overfit: pre-register family hypotheses, correct for tests, report all attempts and negative outcomes.
- Incrementality: compare D06 ownership flows, D07 fundamentals, D11 event clocks, D21-01 controller graph, D21-07 capital actions; one parent event is one information root.
- Costs/regime: liquidity, spread, taxes, turnover, limits, borrow constraints where relevant; test market and industry states.
- Synthetic guard: 9/9 **isolated classification smoke fixtures** passed in this run; they are NOT historical Shadow, OOS, pipeline acceptance or proof of alpha.
- Historical monthly actual-change original receipt: UNKNOWN / BLOCKED. Original controller pledge setup/release receipt: UNKNOWN / BLOCKED.
- D21-03 and D21-04 stay L2/40%; D21 domain 56.4%; global 47.9% from main tracker observed 2026-10-11 02:14:51 +08:00. No formal optimization candidate.

## 6. Exact continuation
1. Obtain actual historical MOPS monthly change records and public-availability receipts (including coverage for departed insiders) without confusing statutory filing deadlines with observed timestamps.
2. Obtain original controller/insider pledge setup and release events, controller legal identity and public-known receipts; do not use offshore institutional collateral as a substitute.
3. Reconcile 2025 TWSE governance rating 1749/1754 source conflict and unmerged branch receipts separately, without mixing rating ranks into insider directionality.
4. Only after source coverage, PIT replay and preregistered OOS/walk-forward incrementality may L3/L4 or FORMAL_OPTIMIZATION_CANDIDATE be considered. Formal Core remains LOCKED.
