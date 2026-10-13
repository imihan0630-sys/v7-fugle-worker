# Room10 D14+D15 pending-order cash envelope: validation receipt

2026-10-14 Asia/Taipei. Research-only, Formal Core LOCKED.

Companion hypothesis: `research/ROOM10_D14_D15_20261014_PENDING_ORDER_CASH_ENVELOPE_V0_1.md`.

Synthetic validation: 41 local Python standard-library tests passed, 0 failed. No actual Taiwan trading dates or broker receipts were used. Local reproducibility hashes: implementation ba402aa5c2f3f734fe46bf410bfec26a08417e996d6458ca2704d55f356a4535; tests 64cabb14828ad377d8e2ff6167fb237f2a31382432608458ead20a1c95d8eab8. Test files are local evidence, not claimed as committed to GitHub.

Two self-falsifications corrected before reporting: (1) confirmed shares multiplied by buy limit is not a lower bound for actual gross spending when fill price is lower; missing fill price => UNKNOWN. (2) future-known malformed events must not invalidate an earlier decision; filter first-known timestamps before payload validation. Broker terminal status without authenticated final cumulative fill quantity does not establish zero remaining fills; late-reported fills are not automatically late-executed fills.

In the synthetic 10,000-cash example, buy A 100 at limit 50 and buy B 100 at limit 70 give a 12,000 maximum gross limit-based exposure and 2,000 gross-only excess scenario before fees. This is NOT actual broker funding demand, an account cash-gap ceiling, verified execution, or realized P/L. Commissions, settlement, credit and margin are UNKNOWN.

PIT: immutable broker submission and event first-known clocks. OOS/walk-forward: genuine prospective independent sessions only. Bias: retain attempted, cancelled, rejected, partial and no-fill orders. Count all tested variants; control market mechanism, size, spread, impact, fee/tax and date clustering. D14 owns order lifecycle; D15 owns portfolio-level cash/exposure; one shared receipt cannot become two independent alpha votes.

Checkpoint/tracker writes remain separate governance actions. No maturity upgrade from these tests. No historical Shadow fabrication. FORMAL_OPTIMIZATION_CANDIDATE: NONE.
