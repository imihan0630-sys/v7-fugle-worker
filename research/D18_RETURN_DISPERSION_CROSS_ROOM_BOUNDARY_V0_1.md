# D18 Return Dispersion Cross-Room Boundary V0.1

Updated: 2026-10-02 Asia/Taipei
Status: RESEARCH-ONLY / MATURITY-FIREWALL
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Prevent a valid D09 data-feasibility promotion for same-day cross-sectional price-change dispersion from being over-transferred into D18 True Return Distribution maturity.

The two rooms study related but different estimands.

## 1. Inherited D09 evidence

D09 BR-041 established that same-day Taiwan member-level:
- industry identity;
- `changePercent`;
- `tradeValue`;
- symbol identity

are available at the decision-time data layer and can support research-only cross-sectional descriptors such as:
- CSSD;
- CSAD;
- IQR;
- MAD;
- median price change;
- coverage;
- trade-value-based leader-removal diagnostics.

D09-09 therefore advanced to L3 for Taiwan PIT data feasibility.

This evidence is accepted and not duplicated here.

## 2. D18 asks a stricter return question

D18 U2B requires:
`CONTINUITY_CERTIFIED_RETURN`.

Primary D18 return-distribution descriptors must not treat two raw closing prices as an economic return when price-space continuity is unresolved.

Required D18 U2B ancestry includes:
- previous official comparable session;
- target-date-bounded corporate-action information;
- technical-price continuity certification;
- source/vintage/knownAt/effective-date provenance;
- explicit UNKNOWN when continuity cannot be proven.

Therefore:

`D09_RAW_PRICE_CHANGE_DISPERSION_L3`
does not imply
`D18_CONTINUITY_CERTIFIED_RETURN_DISTRIBUTION_L3`.

## 3. Current Worker semantics support the distinction

Current `normalizeMarketRow()`:
- reads daily close and exchange change;
- when TWSE sign field is `X`, change is set to null;
- resulting `changePercent` is null rather than flat.

This is good for same-day non-comparable protection.

However `buildMarketRowsFromHistoryCache()` fallback:
- obtains current close and previous cached close;
- computes `(close - prevClose) / prevClose`;
- the inspected path itself does not establish shared `TECHNICAL_CONTINUITY` certification before that raw ratio is formed.

This does not prove the fallback is wrong for all uses.
It proves D18 cannot treat the fallback ratio as U2B merely because it is numerically available.

## 4. Corporate-action counterexample

Suppose:
- prior raw close = 100;
- event-date raw close = 90;
- the reference-price reset explains most/all of the 10% raw gap.

A raw cross-sectional dispersion measure can legitimately describe traded-price discontinuity.

But a D18 economic/continuity return distribution that labels this as a -10% market loss would contaminate:
- median/equal-weight return;
- downside dispersion;
- positive/negative return shares;
- Regime attribution;
- Strategy × Regime interaction.

Therefore raw price-change dispersion and continuity-certified return dispersion must remain separate fields.

## 5. Required shared authority

D18 must consume the shared `TECHNICAL_CONTINUITY` authority.

Do not:
- build a D18-specific corporate-action transform;
- infer adjustment factors from future prices;
- use today's adjusted provider history to rewrite old PIT replays;
- inherit a D09 L3 label as evidence of continuity certification.

## 6. Two-lane future receipt

When the shared continuity runtime is executable, one research receipt should preserve both:

### RAW_PRICE_CHANGE lane
- raw changePercent;
- raw CSSD / CSAD / IQR / MAD;
- N / coverage;
- NOT_COMPARABLE / UNKNOWN.

### CONTINUITY_CERTIFIED_RETURN lane
- continuity return;
- continuity CSSD / CSAD / IQR / MAD;
- N / coverage;
- continuity source/version;
- corporate-action receipt ancestry;
- UNKNOWN reasons.

The two lanes must share:
- market date;
- universe definition;
- symbol identity;
- PIT clock;
- source lineage.

## 7. Falsification test

If a supposed D18 Regime effect:
- appears strongly in raw price-change dispersion;
- weakens/disappears after continuity certification;
- concentrates on corporate-action/event dates;

classify it as:
`PRICE_SPACE_CONTAMINATION_CANDIDATE`,
not market-state alpha.

No policy threshold may be tuned on the raw-contaminated signal.

## 8. Maturity decision

D09-09 L3 is retained within D09's estimand.

D18-04 / U2 True Return Distribution remains below L3 because continuity-certified return execution is still incomplete.

No D18 maturity promotion is inherited from BR-041.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next continuation

1. Reuse BR-041 metric definitions where appropriate instead of redefining dispersion.
2. Wait for shared TECHNICAL_CONTINUITY execution evidence.
3. Build paired raw-vs-continuity dispersion receipt on no-action controls first.
4. Then test corporate-action-heavy dates as falsification cases.
5. Keep forward strategy outcomes closed until the source/continuity layer is valid.
