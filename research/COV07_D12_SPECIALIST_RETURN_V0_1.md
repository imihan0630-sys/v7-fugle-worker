# COV-07 / D12 Specialist Return V0.1

- Candidate ID: COV-07
- Domain: D12
- Specialist room: 09｜衍生品與國際總經研究室
- Return artifact path: research/COV07_D12_SPECIALIST_RETURN_V0_1.md
- Evidence cutoff: 2026-10-04T23:59:59+08:00
- Current candidate class: TRUE_GAP_CANDIDATE
- Proposed terminal recommendation: ADD_MODULE

Evidence: `research/cov07_d12_tx_curve_replay_20261004_v0_1.json`
Governance: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_UNCHANGED

## 1. Exact Knowledge Definition

The candidate owns the same-date multi-expiry Taiwan futures price curve: ordered contract-tenor vector, near/next/far calendar spreads, descriptive annualized roll-yield/carry proxies, curve slope/curvature, expiry-transition semantics, continuous-contract construction and explicit contract identity across rolls.

Frozen sign convention: `calendarSpread(near,far) = nearPrice - farPrice`. Positive means backwardation; negative means contango.

Descriptive annualized roll-yield proxy: `((nearPrice - farPrice) / nearPrice) * 365 / (farDTE - nearDTE)`.

This is a curve/carry state, not realized return or causal expected return.

## 2. Existing-module Overlap Matrix

- D12-01 basis owns cash index versus one futures contract. COV-07 owns futures contract versus futures contract across expiries.
- D12-02 owns contract-level OI and migration/position state. OI qualifies liquidity/roll dominance but does not determine the price curve.
- D12-09 owns expiry/settlement event mechanics. COV-07 uses expiry identity as a mandatory curve/roll guard without duplicating event-effect ownership.
- D12-07 owns option implied-volatility skew/term structure. COV-07 owns futures-price term structure.
- D13 rates/dividend/macro carry context is explanatory/control context and cannot be counted again as an independent COV-07 vote.

Real residual witnesses from the preserved replay:
- 2026-09-14 front basis -18.65 bp, front-next spread -126 points.
- 2026-09-16 front basis -19.61 bp, front-next spread -301 points.
- 2026-09-15 basis +17.69 bp while front-next spread remained contango at -135 points.
- 2026-09-17, 09-18 and 10-02 front OI share stayed about 97.7%-98.6% while spreads were -157, -153 and -171.

These establish state separability only; no predictive alpha is claimed.

## 3. Why Current Scope Is Insufficient

Existing D12 modules do not own the cross-expiry futures-price curve as a first-class object. Cash-futures basis cannot represent near-versus-far slope; OI cannot replace price-curve state; expiry mechanics are controls rather than the curve itself; option IV term structure is a different market object. Without a dedicated owner, futures curve slope, calendar spread, roll/carry proxy and PIT-safe roll construction have no canonical research home and are at risk of either omission or double counting.

## 4. Taiwan Data Feasibility

Official TAIFEX TX historical daily download is replay-feasible. Preserved source evidence covers 2026-09-14 through 2026-10-02 and includes date, contract, expiry month, OHLC, volume, settlement, OI, final best bid/ask and session.

Preserved raw source SHA-256: `6465a86fadde57abe16a9db63cdf20702c7aa2c3420452f61503660b7d111701`; bytes: 29,219.

TAIFEX TX contract specification source hash: `3a84e988f3ada407a331d0e2c47a31f1b600b0bf91798637e9f0dcaf0d87185c`. Third-Wednesday monthly last-trading/settlement rule was verified; holiday/disruption exceptions require the official calendar.

TWSE TAIEX history was used only for same-date basis cross-check. September source hash: `b6f8cf1552ff55338934e646ca846b54d1b18c0b82919ca78f440174bb605404`; October source hash: `0bf01255d772a79508da8e30c195ddcfb2be1f8a8c151866181f555ca61a2e53`.

Raw bytes were not committed. Historical replay feasibility is established; historical first-known decision-time availability is not.

## 5. PIT / Replay Implication

Primary curve uses regular session, monthly TX only, explicit contract ID and expiry, positive prices, DTE/expiry flags, and separate volume/OI quality state. Weekly/flexible expiries are excluded.

Frozen price rule: positive official settlement; otherwise positive close with explicit fallback flag; otherwise UNKNOWN/exclude. The 2026-09-16 expiry-day September row has settlement 0 and close 45,759, proving the fallback flag is necessary.

Frozen roll rule: at close t, evaluate roll conditions only from information known at close t; any roll becomes effective next trading session, never retroactively at the same close. Roll when front calendar DTE <= 5 OR next-contract OI > front-contract OI. Preserve selected contract identity.

No future roll gap may rewrite historical source prices. Without an executable roll-price convention, cross-contract return over the switch remains UNKNOWN. Historical daily replay does not prove 18:10 first-known availability; prospective source-attested independent dates remain required.

## 6. Decision Role

Research-only contextual state and control family. The candidate may describe futures curve/carry regime, qualify roll/expiry/liquidity context, and later enter incremental tests after basis/OI/expiry/macro controls. It is not approved as a directional vote, ranking factor, capital rule, monitoring trigger or production signal.

Contango/backwardation may reflect financing/dividend/carry expectations, hedging demand, positioning/liquidity, expiry mechanics, macro/rate expectations or contract-specific supply/demand. Curve shape does not identify one causal mechanism, so no monotonic bullish/bearish interpretation is authorized.

## 7. Anti-double-count Rule

- D12-01 basis and COV-07 calendar spread remain separate primitives.
- D12-02 OI can qualify liquidity/roll dominance but cannot be counted again as an independent curve signal without incremental evidence.
- D12-09 expiry state is a contamination/control variable, not another directional vote.
- D12-07/D12-16 option IV term/surface and COV-07 futures-price curve remain different feature families.
- D13 rates/dividend/macro carry context is explanatory/control context; the same carry shock cannot be duplicated as both D13 and COV-07 votes.
- Any future composite must test residual curve information after basis, OI, expiry and macro/carry controls on common support.

## 8. Proposed Owner

D12 domain under 09｜衍生品與國際總經研究室. The proposed owner scope is futures term structure / calendar spread / roll-yield research only. Canonical module identifier is not reserved by this packet; D12-18 is retired/absorbed and must not be reused. Any future identifier requires control-plane dependency/overlap/anti-orphan review plus explicit owner approval.

## 9. Maturity Starting Point

If the structural addition is later approved, specialist recommendation is L0 / 0% at canonical creation. Existing D12 L2 evidence must not be inherited automatically. The historical replay packet can then support staged advancement only under the canonical maturity governance, with prospective source-attested independent dates required before L3 and outcome evidence required before any higher promotion.

No current D12 module, domain maturity, module count, Router, Shared Master, System 1, System 2 or Formal Core state is changed by this return.

## 10. Terminal Recommendation

ADD_MODULE

Rationale: a distinct owner gap exists; official Taiwan contract-level replay is feasible; expiry/roll semantics can be made PIT-safe; real residual states survive D12-01 basis and D12-02 OI ownership; continuous-contract leakage guards and anti-double-count rules are frozen. This recommendation does not establish alpha, L3/L4, production use or Formal optimization.

Exact next continuation after specialist return: 00 control plane performs Intake plus Dependency / overlap / anti-double-count / anti-orphan review. If owner approval later authorizes structural addition, build prospective source-attested independent curve dates under the frozen contract/roll rules, then preregister incremental tests versus D12-01 basis, D12-02 OI, D12-09 expiry and D13 carry/rates controls.
