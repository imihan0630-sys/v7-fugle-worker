# D15-23 | Derivative hedge overlay: evidence and falsification contract

Date: 2026-10-13 Asia/Taipei
Owner: 10 / D15-23
Scope: research-only, no trading instruction, Formal Core LOCKED.
Main evidence base: tracker D15-23 L0/0 at commit 78157bb71b4928592062e29c0f8d31c70c5a14d3.

## Nonduplicated ownership
D12 owns derivative contract/payoff/parity mechanics. D15-23 owns whether an overlay changes portfolio exposure, tail loss, liquidity needs and lifecycle after costs, compared with a same-decision-time cash/spot-reduction alternative. D15-13 owns expected shortfall; D15-24 owns VaR calibration; D16 owns OOS/statistical promotion.

## Immutable decision receipt
Freeze at decision cutoff: portfolio inventory provenance, timestamped equity exposures, hedge instrument, contract multiplier, maturity, signed delta/beta estimate with training vintage, liquidity/margin requirements, hedge quantity rule, alternatives, scenario horizon, fees, expected slippage, financing/roll assumptions, first-known times and experiment family ID.
A signal/plan/push is not an order. An order acknowledgment is not a fill. A broker-confirmed fill is not a verified settled holding. P/L is realized only with matched close/settlement and full cost/fee lineage. Unknown data remains UNKNOWN.

## Hypotheses and adversarial alternatives
H1: beta-neutral futures overlay reduces market loss. Support: synchronized PIT exposures, matched contract and broker-confirmed fill; falsify with basis dislocation, hedge beta error, timing mismatch, short squeeze, under/over-hedge or gap before execution. Alternative: direct spot reduction/cash at the same cutoff.
H2: tail protection improves downside. Support: preregistered tail metric on independent forward dates; falsify when margin/roll costs or gap losses dominate, hedge correlation changes, or options expire out of money. Alternative: low-risk allocation rather than derivative leverage.
H3: capital efficiency improves. Support: net cash and collateral ledger, marked-to-market margin and liquidity buffer, total financing costs; falsify by margin calls, forced liquidation, unavailable cash, missed order or partial fill. Cash released from spot reduction is not equivalent to freely available margin.
H4: overlay preserves alpha. Support: cost-adjusted selection-vs-sizing-vs-hedge attribution with common-support frozen selected names. Falsify if hedge merely reduces gross beta or increases costs; do not label lower volatility alone as positive alpha.

## Replay / bias / cost firewall
- First-known <= decision cutoff for each input. Future realized correlation, close, basis, implied volatility and order book must not be used in past decisions.
- No broker fill means no actual hedge exposure or realized hedge P/L claim; model-only output is MODELED, not actual.
- Preserve all planned/attempted/rejected/cancelled/partially filled hedge opportunities, not just successful hedges.
- Separate market/regular-lot/auction/derivative session and after-hours gaps; price limits, expiry, contract roll and margin calls may make hedge execution infeasible.
- Count every hedge ratio, horizon, regime and instrument tried in the multiple-testing family; purge overlapping outcomes, cluster by independent decision date, run forward-only OOS and walk-forward tests.
- Check redundant factor votes: beta hedge, volatility reduction, risk concentration and tail-risk statistics can share the same return information; do not count as independent proof.
- Cost accounting: actual fill prices already include execution price concessions; never subtract modeled slippage again on the same filled quantity. Broker fees, tax, funding, roll, bid/ask and missed fills must have independent provenance.
- Absence of verified derivative account permissions, margin receipts, market depth or signed contract position blocks real execution claims.
- Any sizing, risk, execution or portfolio rule change is Class C; research proposal only.

## Maturity and exact next
Mechanism/falsification research candidate only. L2 review requires checkpoint and tracker synchronization; L3 requires real Taiwan PIT source feasibility and deterministic replay; L4 genuine prospective/OOS; L5 multi-regime, cost, redundancy, independent-date robustness. No automatic level promotion from this file.
Next: obtain genuine timestamped broker/order/position/margin receipts or label unavailable UNKNOWN; construct matched frozen spot-reduction comparator; preregister forward holdout and no-peeking policy. Do not fabricate historical Shadow.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
