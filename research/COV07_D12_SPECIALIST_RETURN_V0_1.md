# COV-07 / D12 Specialist Return V0.1

Room: 09｜衍生品與國際總經研究室
Candidate: Futures Term Structure / Calendar Spread / Roll Yield
Status: SPECIALIST_RETURN_COMPLETE / ADD_MODULE_RECOMMENDED / OUTCOMES_CLOSED / FORMAL_UNCHANGED
Evidence: `research/cov07_d12_tx_curve_replay_20261004_v0_1.json`

## Terminal recommendation

**ADD_MODULE**

This is a curriculum recommendation only. It does not authorize module-count mutation, maturity transfer, System 1/System 2 use, ranking, signal, capital, monitoring or Formal Core changes. Control-plane Dependency Audit, overlap recheck, anti-orphan audit and owner approval remain required.

## 1. Exact knowledge definition

The candidate owns the same-date multi-expiry Taiwan futures price curve:
- contract-tenor vector ordered by expiry;
- near/next/far calendar spreads;
- annualized descriptive roll-yield/carry proxies;
- curve slope/curvature across futures expiries;
- expiry-transition and continuous-contract construction semantics;
- explicit contract identity across rolls.

Sign convention:
`calendarSpread(near,far) = nearPrice - farPrice`.
Positive = backwardation; negative = contango.

Descriptive annualized roll-yield proxy:
`((nearPrice - farPrice) / nearPrice) * 365 / (farDTE - nearDTE)`.

This is a curve/carry state, not realized return or causal expected return.

## 2. Boundary versus existing D12 owners

### D12-01 basis
D12-01 owns cash index versus one futures contract.
COV-07 owns futures contract versus futures contract across expiries.

Real residual witness:
- 2026-09-14 front basis = -18.65 bp, front-next spread = -126 points;
- 2026-09-16 front basis = -19.61 bp, front-next spread = -301 points.

Basis is almost unchanged while inter-contract curve slope changes by 175 points.

Additional divergent state:
- 2026-09-15 basis = +17.69 bp;
- front-next spread remains contango at -135 points.

Therefore curve shape is not a rename of spot-futures basis.

### D12-02 open interest
D12-02 owns contract-level OI and migration/position state.
OI helps identify liquidity/roll dominance but does not determine the price curve.

After September expiry:
- 2026-09-17 front OI share = 98.60%, spread = -157;
- 2026-09-18 front OI share = 98.55%, spread = -153;
- 2026-10-02 front OI share = 97.73%, spread = -171.

Similar OI concentration does not collapse the curve state.

### D12-09 expiry/settlement
D12-09 owns expiry/settlement event mechanics. COV-07 uses expiry identity as a mandatory curve/roll guard but does not duplicate event-effect ownership.

### D12-07 option skew/term
D12-07 is option implied-volatility skew/term structure. COV-07 is futures-price term structure. No duplicate vote is permitted merely because both use “term structure.”

## 3. Official Taiwan replay feasibility

TAIFEX TX historical daily download:
- source: `https://www.taifex.com.tw/cht/3/futDataDown`
- query: 2026/09/14 through 2026/10/02, TX, download type 1
- raw SHA-256: `6465a86fadde57abe16a9db63cdf20702c7aa2c3420452f61503660b7d111701`
- bytes: 29,219
- fields include date, contract, expiry month, OHLC, volume, settlement, OI, final best bid/ask and session.

TAIFEX TX contract specification:
- source: `https://www.taifex.com.tw/cht/2/tX?menuid1=12`
- SHA-256: `3a84e988f3ada407a331d0e2c47a31f1b600b0bf91798637e9f0dcaf0d87185c`
- third-Wednesday monthly last-trading/settlement rule verified.
- holiday/disruption exceptions must use the official calendar rather than arithmetic.

TWSE TAIEX history used only for same-date basis cross-check:
- 2026-09 source SHA-256: `b6f8cf1552ff55338934e646ca846b54d1b18c0b82919ca78f440174bb605404`
- 2026-10 source SHA-256: `0bf01255d772a79508da8e30c195ddcfb2be1f8a8c151866181f555ca61a2e53`.

Raw bytes were not committed.

Conclusion:
**Taiwan contract-level historical futures price/OI/volume and expiry replay is feasible.**

## 4. Expiry-transition evidence

September 2026 TX monthly expiry is 2026-09-16 under the third-Wednesday rule.

Observed OI migration:
- 2026-09-14: Sep OI 47,416; Oct OI 59,870.
- 2026-09-15: Sep OI 18,797; Oct OI 89,861.
- 2026-09-16: Sep OI 9,684; Oct OI 95,896.
- 2026-09-17: Sep is no longer the front curve node; Oct OI 99,476.

The expiry-day Sep row has settlement field 0 while close is 45,759. This is a concrete source-quality warning.

Frozen price rule:
1. positive official settlement;
2. otherwise positive close with explicit fallback flag;
3. otherwise UNKNOWN/exclude.

Expiry-day curve observations remain a special regime even when a positive close exists.

## 5. Near-expiry / liquidity / session guards

Primary curve:
- regular session only;
- monthly TX only;
- explicit contract ID and expiry;
- weekly/flexible expiries excluded;
- volume and OI preserved separately;
- no zero/nonpositive price;
- DTE and expiry day flagged;
- price-limit/session state preserved when available.

Far contracts may have very low volume and OI. Their prices can describe a curve only with liquidity-quality state; low-liquidity curvature cannot automatically be interpreted as clean carry.

## 6. Continuous-contract construction

For feature replay, raw contract history is never back-adjusted.

Frozen rule:
- at close t, calculate roll condition using only information known at close t;
- any roll becomes effective next trading session, never retroactively at the same close;
- roll to next monthly contract when front calendar DTE <= 5 OR next-contract OI > front-contract OI;
- preserve selected contract identity.

Observed example:
- 2026-09-14 satisfies both triggers;
- a PIT-safe synthetic selection moves to 202610 from the next trading session rather than waiting until 202609 expiry.

Back-adjustment firewall:
- never rewrite historical source prices using a future roll gap;
- a display series, if needed, is a separate stitched object with explicit roll events;
- without an executable roll-price convention, cross-contract return over the switch is UNKNOWN rather than calculated from two different contract closes.

## 7. Residual context independent of basis and OI

Real divergent states:
1. Nearly equal basis, very different curve:
   - 2026-09-14: -18.65 bp / -126 points;
   - 2026-09-16: -19.61 bp / -301 points.
2. Basis sign flips while curve regime persists:
   - 2026-09-15: +17.69 bp / -135 points.
3. Similar high front-OI concentration with different curve slopes:
   - 2026-09-17, 09-18, 10-02: front OI share about 97.7%-98.6%;
   - spreads -157, -153, -171.

These establish state separability, not predictive alpha. Taiwan forward-return outcomes were not inspected.

## 8. Carry / hedging-pressure interpretation firewall

Contango/backwardation can reflect financing/dividend/carry expectations, hedging demand, positioning/liquidity, expiry mechanics, macro/rate expectations or contract-specific supply/demand.

Curve shape does not causally identify one mechanism.
No “contango bearish” or “backwardation bullish” rule is approved.

## 9. Anti-double-count rules

- D12-01 basis and COV-07 calendar spread remain separate primitives.
- D12-02 OI may qualify liquidity/roll dominance but cannot be counted again as an independent curve signal without incremental evidence.
- D12-09 expiry state is a contamination/control variable, not another directional vote.
- D12-07/D12-16 option IV term/surface and COV-07 futures-price curve remain different feature families.
- D13 rates/dividend/macro carry context is explanatory/control context; do not duplicate the same carry shock as both D13 and COV-07 votes.
- Any future composite must test curve residual information after basis, OI, expiry and macro/carry controls.

## 10. Terminal specialist decision

The candidate satisfies the burden for **ADD_MODULE**:
- distinct owner gap exists;
- official Taiwan contract-level replay is feasible;
- expiry/roll semantics can be made PIT-safe;
- real residual states survive D12-01 basis and D12-02 OI ownership;
- continuous-contract leakage guards are frozen;
- causal and anti-double-count firewalls are explicit.

This does not establish L3/L4 or alpha.

Recommended governance:
`ADD_MODULE / RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_UNCHANGED`.

Suggested capability name:
**Futures Term Structure／Calendar Spread／Roll Yield（期貨期限結構／跨月價差／轉倉收益）**

## 11. Maturity and Formal firewall

- Existing D12 maturity is unchanged by this specialist packet.
- No existing module is promoted.
- No return outcome was opened.
- No OOS/Prospective Shadow evidence exists.
- Formal Core remains LOCKED.
- `FORMAL_OPTIMIZATION_CANDIDATE=NONE`.

## 12. Exact next continuation

1. Return this packet to 00 control plane.
2. Do not mutate canonical module count/name until Dependency Audit + anti-orphan audit + owner approval.
3. If approved, build prospective source-attested independent curve dates under the frozen contract/roll rules.
4. Only after enough independent dates exist, preregister incremental tests versus D12-01 basis + D12-02 OI + D12-09 expiry + D13 carry/rates controls.
