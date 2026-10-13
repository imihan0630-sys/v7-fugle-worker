# Room10 — Pending-order cash envelope, research only

Date: 2026-10-14 Asia/Taipei. Formal Core LOCKED.

Question: Can a cancellation request release cash before a broker terminal receipt?

Hypothesis: pending buy orders can overlap and temporarily require more cash than a plan-level allocation implies.
Support: a parent order has a verified fill lower bound and an open quantity upper bound; a cancellation request alone does not reduce the upper bound.
Falsification: a broker-authenticated terminal cancellation at a trustworthy first-known timestamp may reduce the remaining bound. A replacement with confirmed exclusive linkage may remove overlap; do not assume this linkage.
Alternatives: delayed reports, partial fills, broker-side reservation, credit/margin rules and lot-specific mechanisms.
Failure: missing order IDs, order-limit prices, account cash availability, terminal receipts, first-known clocks or broker fee schedule => UNKNOWN, not zero.

Synthetic example: account cash 10,000; buy A 100 shares at limit 50, with 40 confirmed and 60 pending cancellation; buy B 100 shares at limit 70 with no terminal receipt. Verified gross buy spend >= 2,000; potential total gross spend <= 12,000 under these two limit prices; worst-case gross gap versus 10,000 cash is 2,000 before fees. No actual broker risk or real P/L is inferred.

PIT: only decision-known cash, limits, fills and terminal events may enter the envelope. Later broker reports cannot retroactively change an earlier decision-time bound. All attempted orders, rejected orders and unfilled opportunities stay in the denominator. Compare fixed decisions on independent dates with an untouched OOS window; cluster by date/account, count all tested buffers and limits; control costs, slippage, liquidity, basis, margin and factor redundancy.

D14 owns order lifecycle and executable cost; D15 owns account-wide cash and portfolio exposure aggregation. Shared receipt is one evidence source, not two alpha votes. Research-only; no sizing or capital change. No fabricated historical Shadow.

Next: reconcile dedicated checkpoints and tracker only after fresh main read and independent review; obtain genuine prospective broker/settlement receipts. FORMAL_OPTIMIZATION_CANDIDATE: NONE.
