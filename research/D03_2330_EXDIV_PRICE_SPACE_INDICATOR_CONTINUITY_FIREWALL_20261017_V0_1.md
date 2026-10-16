# D03 2330 Ex-Dividend Price-Space and Indicator Continuity Firewall — 2026-10-17

## Scope

This research-only increment consumes the latest DATA and BUILD evidence for 2330/TWSE. It does not change System 2 gates, strategy weights, selection rules, Shadow, Frozen, or Formal Core.

## Physical evidence accepted

1. 2330 has 61/61 native TWSE daily source bodies for 2026-07-21 through 2026-10-16, read back before the fixed 2026-10-16 23:45 Taipei research cut.
2. Six current native corporate-action source families were retained; a real 2330 cash-dividend event exists on 2026-09-16.
3. The official native event row carries:
   - 2026-09-15 raw close: 2,385
   - 2026-09-16 raw close: 2,380
   - official ex-dividend reference: 2,377.99
   - native dividend field: 7.000001
4. 2330 actually traded on 2026-10-16 with positive volume, transactions and trade value.
5. The known 1218 suspension control proves the TWTAWU source route can return a positive row. Absence of a 2330 row is still not authoritative NO_SUSPENSION.

## Price-space counterexample

The same 2026-09-15 to 2026-09-16 close transition has opposite signs:

- raw close return = 2,380 / 2,385 - 1 = -0.209644%;
- official-reference return = 2,380 / 2,377.99 - 1 = +0.084525%.

This is a real sign flip, not rounding noise. A D03 rule that does not bind price space can label the same economic session as negative momentum or positive post-reference performance.

The 7.01-point raw-close-to-reference gap also differs from the 7.000001 native dividend field by 0.009999. Therefore the dividend field alone cannot be used as an improvised adjustment factor. The official reference row, effective date, source version and causal availability must stay bound together.

## Indicator contamination map

| D03 module | RAW event-crossing risk | Required protection |
|---|---|---|
| ret5/ret20/ret60 and ROC alias | event gap can reverse sign or magnitude | one declared price space for every numerator/denominator pair |
| moving averages and slope | raw event creates a false downward level shift | consistently adjusted OHLC history or explicit RAW_EVENT_CONTAMINATED state |
| KD | high/low/close range becomes internally inconsistent if close alone is adjusted | same adjustment lineage for full OHLC |
| RSI | ex-dividend raw loss enters average loss as market weakness | event-neutral price changes or blocked state |
| MACD | one discontinuity propagates through recursive EMA state | cut-safe adjusted ancestry plus frozen initialization |
| ADX | previous raw close creates artificial true range and directional movement | adjusted previous-close and OHLC ancestry, not close-only patch |
| Bollinger | event gap inflates mean displacement and band width | consistent adjusted window |
| divergence | raw price pivot can disagree with an adjusted oscillator parent | identical price-space identity across price and indicator pivots |
| multi-timeframe conflict | adjusted daily and raw weekly/monthly parents can manufacture conflict | same corporate-action lineage across all parent frames |

## Actual used-input implication

The latest BUILD manifest identifies seven Stage1 factor observations across TECHNICAL_STRUCTURE, PRICE_VOLUME and RISK_FRICTION. All depend on the 61-session A1 bars; price-derived metrics include MA5/10/20/60, ret20/ret60, prior highs/lows, MA20 distance, ATR14, candle position, shadows and volatility20.

The evidence reveals a pipeline contract conflict:
- downstream factor consumption permits CLEAR_NO_ACTION or ADJUSTED_CONTINUITY;
- the current upstream corporate-action gate only emits CLEAR_NO_ACTION and rejects any event, even if an adjusted event could be independently proven.

D03 records this as a cross-domain dependency. Quietly changing the gate would alter strategy eligibility and is outside D03 authority. It requires an owner-reviewed versioned contract and independent tests.

## Support, counterevidence, alternatives, failure states

Support:
- exact 61/61 raw source bodies exist for 2330;
- the official dividend row and price reference are physically reconciled;
- the sign flip is deterministic and directly relevant to D03 formulas;
- current-session trading is positively observed.

Counterevidence:
- 61-day adjusted feature continuity is not audited;
- original issuer publication time on the ex-date is not proven;
- current-session trade does not certify tradeability at 23:45, tomorrow, or next open;
- authoritative negative suspension evidence is absent;
- independent strategy-level audit remains incomplete.

Alternative explanations:
- the 0.009999 reference-gap difference may reflect exchange reference mechanics or rounding, not a missing dividend amount;
- one real cash-dividend case does not establish correctness for capital reductions, splits, rights or par-value changes;
- a raw-price strategy may intentionally retain event gaps, but then it must declare that semantics and cannot interpret the gap as pure market momentum.

Failure states:
- mixing raw and adjusted values inside one window;
- adjusting close without open/high/low;
- applying a current event row retrospectively without cut-safe availability;
- treating a traded row as continuous future tradeability;
- treating missing suspension rows as NO_EVENT;
- allowing MACD/ADX recursion to inherit pre-adjustment state silently;
- using one-symbol mechanics as OOS, cost, alpha or market-wide selection evidence.

## Oracle

TI-2033 through TI-2052 passed 20/20 deterministic cases. They cover raw/reference sign flip, mixed spaces, incomplete OHLC adjustment, per-indicator contamination, divergence and multi-timeframe conflicts, 61-day adjusted-lineage absence, factor gating, tradeability limits, pipeline contract conflict and the research-only ceiling.

## Conclusion

2330 now provides a real D03 corporate-action price-space counterexample. This materially improves causal formula specification but does not make the adjusted 61-session window PIT-ready. D03 maturity remains 56.7%; D03-09 and D03-10 remain L2; outcomes stay closed; no FORMAL_OPTIMIZATION_CANDIDATE exists.

## Exact next continuation

Consume an independently audited, cut-safe 2330 adjusted OHLC lineage for the 61 sessions. Recompute paired RAW versus ADJUSTED ret5/20/60, MA slopes, RSI14, Bollinger20 and event-day ADX TR diagnostics without outcomes. Freeze a recursive initialization contract before MACD/ADX state comparison. Keep KD, divergence and multi-timeframe parents blocked if any OHLC or parent-frame price-space identity differs. Do not change System 2 eligibility gates inside D03.
