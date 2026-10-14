# D14-19 — Short-sale execution, borrow recall and forced buy-in research contract

Date: 2026-10-11 Asia/Taipei
Owner: 10 / D14-19
Classification: Class A, RESEARCH_ONLY
Formal Core: LOCKED
Evidence: mechanism/falsification semantics only; no broker fill or genuine prospective Shadow claim.

## Distinct scope and hypothesis
D14-19 tests whether an explicitly short-dependent strategy can establish, maintain and close a borrow-backed short position, including recall, forced buy-in, squeeze and unavailable-borrow risks. D06-18 owns borrow supply/economics; D20-13 owns arbitrage constraints. A borrow signal is not an independent bearish alpha vote.

Hypothesis H1: account-specific borrow availability at decision time constrains feasible short entry.
- Support: broker/account/symbol/quantity/approval-time/expiry/reserved-quantity receipts define a capacity bound.
- Falsification: public securities-lending balance, another account's approval, future approval or expired approval cannot prove orderability.
- Alternatives: margin/credit eligibility, collateral, exchange restrictions, venue, broker routing and stale approval.
- Failure: missing firstKnownAt, immutable broker approval ID, account or expiry => UNKNOWN, not no-borrow.

H2: borrow/recall economics change net holding-period feasibility.
- Support: contract-specific accrual, recall and buy-in costs can dominate gross return.
- Falsification: monthly fee payment date is not the original short-sale demand date; recall notice is not a buy-in fill.
- Alternatives: settlement conventions, contract type, rate resets, forced closure rules, exchange/stock-specific restrictions.
- Failure: no fee accrual or original contract provenance => realized net P/L UNKNOWN.

H3: apparent squeeze losses may be exposure/market-state effects rather than borrow scarcity alone.
- Support: borrow recall and adverse market price path can jointly create forced exit.
- Falsification: later price rise does not prove contemporaneous borrow scarcity or executed covering.
- Alternatives: market/sector/news movement, volatility interruption, price limits, queue priority and illiquidity.
- Failure: no mechanism-matched quotes and broker execution receipts => attribution UNKNOWN.

## Seven distinct stages, no promotion by implication
PLAN -> SIGNAL -> NOTIFICATION -> ORDER_SUBMITTED -> BROKER_EVENT_REPORTED -> BROKER_FILL_VERIFIED -> POSITION_AND_REALIZED_PNL_RECONCILED.
Borrow application, approval, short-sale order, confirmed sell fill, borrow maintenance, recall, cover order, confirmed cover fill and returned stock have independent identities. A notification cannot be a fill. A cancelled order may be partial; a missing fill is UNKNOWN unless a complete broker terminal receipt positively proves zero. Short-sale proceeds are not freely available cash without account-level collateral/settlement evidence.

## PIT replay / anti-leakage
Use separate economic eventAt and firstKnownAt; future-known malformed events cannot alter a historical cutoff. Visible fill/cancel/correction events must not predate the parent submission; clock ambiguity remains UNKNOWN. Never equate late receipt with late execution. Freeze account, symbol, side, quantity, venue, matching mechanism, order type, original broker event ID and fee/tax source before replay. D14-19 shares receipt infrastructure with D15-23, not outcome evidence.

## Test and comparator contract
Prospective read-only cohort includes borrow approved, denied, expired, recalled, rejected orders, partial/zero fills and executed exits. Compare feasible short strategies with a no-trade/flat alternative on identical decision-time opportunities. Preserve no-fill opportunity costs, fees, taxes, borrow accrual, adverse price limits, spread, slippage and queue/impact. Preregister horizons and subgroup tests; cluster by independent session/parent order; never count child events as independent dates. Use PIT, purged OOS, walk-forward, regime stratification, multiple-testing and redundancy checks; no future-price reconstruction.

## Evidence and maturity boundary
The local 2026-10-11 synthetic replay suite is reproducible when both v0_1 and v0_2 fixtures are available (50 tests), but synthetic structural validity is NOT verified broker provenance or actual P/L. No historical Shadow reconstruction. Missing evidence stays UNKNOWN. L2/40 is mechanism + falsification semantics only; L3 requires prospective Taiwan PIT broker/account and market-mechanism feasibility evidence across independent sessions, with verified fills for realized claims. No automatic L3 by date count.

Status: D14_19_MECHANISM_FALSIFICATION_FROZEN / TAIWAN_PIT_BROKER_RECEIPTS_PENDING / FORMAL_CORE_UNCHANGED
`FORMAL_OPTIMIZATION_CANDIDATE`: NONE.
