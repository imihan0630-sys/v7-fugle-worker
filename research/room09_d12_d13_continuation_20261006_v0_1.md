# Room09 D12+D13 continuation 2026-10-06

Research only. Outcomes closed. Formal Core locked.

## D12
DR-104: Official TAIFEX pages observed on 2026-10-06 now show 2026-10-05 afternoon Delta versions. Under the already-frozen TAIFEX clock semantics, an afternoon version is for the next business day, so it is not a same-day 2026-10-05 regular-session model-error baseline.

DR-105: The preserved 2026-10-02 16:39:21 afternoon Delta maps to 2026-10-05. Official 2026-10-05 TX/TXO regular-session data now exist. A same-effective-date research lane is therefore feasible only on common contract support and only after quote/reference clock, forward/spot, volatility, rate/dividend and new-series exclusions are aligned. Missing required model inputs remain UNKNOWN.

DR-106: Official 2026-10-05 front TX 202610 settlement is 49,944, change +1,280 (+2.63%). Treat this as an adversarial input-state for stale-reference sensitivity; do not tune after seeing errors.

DR-107: 2026-10-05 participant option tables still expose aggregate participant Call/Put long/short OI, not strike-expiry-participant-side joint inventory. Exact signed dealer GEX remains NOT_IDENTIFIED.

D12 remains 40.0%; no promotion.

## D13
MC-205: Research clock must be independently verified before source-eligibility decisions. Reference date, publication/availability time, observed time and first eligible Taiwan decision remain separate.

MC-206: U.S. Treasury observations carrying U.S. date 2026-10-05 cannot be used for Taiwan 2026-10-05 18:10 merely by calendar-date matching. The already-frozen Treasury semantics place the market reference around 15:30 U.S. Eastern, with website availability potentially later.

MC-207: H.4.1, Treasury yields, CBC, TWSE and TAIFEX retain heterogeneous source clocks. No single market-date field is a safe cross-market join key.

D13 remains 41.1%; no promotion.

## Exact next continuation
D12: build common support between preserved 2026-10-02 afternoon Delta and official 2026-10-05 regular-session inputs, then freeze model-input clocks before numerical attribution. Keep unavailable TAIFEX internal inputs UNKNOWN.
D13: prospectively capture official U.S. rate/H.4.1 realizations after verified publication and map each to first eligible Taiwan decision. Never backdate from source date.
