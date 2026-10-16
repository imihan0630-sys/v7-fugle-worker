# D05 C3 recent-session baseline support — 2026-10-17

Owner: Room04 D05. Canonical maturity remains 54.3%; Wave-1 D05-03/04/09 remain L3. This is a research-only admission observer, not a change to capture, normalization, trading or alerts.

Original source read: research/system1_c3_live_depth_prereg_v0_1.mjs blob 955fbf64acdc5c2f96e64681d436f54e933b1990 at main 5c6408490d8b06348add96c378f48897f5c97661. Its baseline sorts observed same-symbol/same-slot dates, takes up to 20 observed rows and requires 10. It does not independently certify the most recent 20 official trading sessions or historical quote timestamp-to-slot identity.

Synthetic falsification: 20 sparse historical observations and 20 recent observations both return NORMALIZED_VECTOR_READY; with equal depth each yields 50th percentile. A history row with earlier tradeDate but current-date quoteTimestamp is also accepted by the isolated normalization function. These are source-logic demonstrations, not live incident counts. Upstream validation may exist and must be checked against original receipts.

Support: same-symbol same-slot ECDF reduces time-of-day and price-scale differences. Counterargument: missing-not-at-random observations bias the baseline toward available/active market states. Alternatives: exchange holidays, halts, provider limits, reconnections and fixed cohort sampling. Invalidity: missing official calendar, first-known timestamps, atomic bid/ask snapshot identity or C1/C2/C3 prospective registration. Keep exact queue, true OFI, market impact and executable capacity UNKNOWN per SDA-006.

44/44 local synthetic/source-logic tests passed; no genuine prospective performance sample proven. Next: freeze official last-20-session denominator and exact slot/capture clocks for successful registered prospective parents; report missing reasons and D04 overlap before D16 review. Formal Core locked; tracker unchanged.
