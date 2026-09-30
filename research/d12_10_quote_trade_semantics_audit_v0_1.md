# D12-10 TAIFEX same-venue quote-versus-trade falsification

Updated: 2026-09-30 Asia/Taipei
Status: OUTCOME_BLIND_MEASUREMENT_SEMANTICS_FROZEN / NO_PROMOTION
Formal Core impact: NONE

## New finding

The same-venue global-control lane must separate quote availability from executed-trade freshness.

Official TAIFEX market-maker incentive material for UDF/SPF/UNF explicitly specifies quote-time, spread and minimum-size conditions. This proves that executable-looking two-sided quote activity and actual trades are distinct market objects. Historical incentive documents also segment quote activity by clock window. Therefore a control cannot be admitted solely because:
- full-session volume is non-zero;
- a market-maker program exists; or
- a quote is present near 18:10.

SXF market-making incentives can be concentrated in a different clock segment, so market-maker obligations are not a substitute for exact 15:00-18:10 evidence.

## Measurement layers

For each candidate control (UDF/SPF/UNF/SXF), preserve separately:
1. TRADE_COVERAGE: tradeCount, first/last trade timestamp, max inter-trade gap, stale age at 18:10.
2. QUOTE_COVERAGE: first/last two-sided quote timestamp, two-sided quote coverage ratio, spread/tick distribution, quoted size, quote stale age.
3. PRICE_DISCOVERY_CONFIDENCE: research label derived only after both layers are characterized across independent dates; missing quote or trade evidence = UNKNOWN.
4. CONTRACT_STATE: contract month, DTE, roll/expiry and ex-ante contract-selection rule.
5. CLOCK_PROVENANCE: sourceSessionDate, tradingDate, source timestamp, file/source publishedAt and capturedAt.

## Falsification

- High quote coverage with few/no trades does not establish home-market information absorption.
- High trade volume outside 15:00-18:10 does not establish NIGHT_PRE_SCAN freshness.
- Tight quoted spreads can be incentive-driven and do not by themselves prove informative price discovery.
- If a simple trade-only freshness gate performs as well as quote+trade quality after future outcome testing, the quote layer is redundant.
- If external/home-market controls later explain the same movement and TAIFEX residual adds nothing, same-venue complexity is redundant.

## Outcome firewall

No Taiwan return, gap, MAE, MFE, hit rate, selection result or threshold optimization was inspected to create this measurement contract. Numeric eligibility thresholds remain unfrozen until outcome-blind independent-date distributions exist.

## Maturity

D12-10 remains L2 / 40%. FORMAL_OPTIMIZATION_CANDIDATE = NO.

## Exact next continuation

Replay UDF/SPF/UNF/SXF over exact 15:00-18:10 source-session windows. Collect trade coverage first and quote coverage only where a PIT/replay-capable source exists. Characterize independent-date distributions with outcomes closed, then preregister instrument/contract eligibility and staleness rules before any Taiwan outcome join. Keep historical replay evidence separate from prospective 18:10 receipts.
