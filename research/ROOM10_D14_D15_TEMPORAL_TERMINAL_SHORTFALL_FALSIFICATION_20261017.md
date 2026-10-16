# Room10 D14/D15 — final-terminal chronology and two-sided execution shortfall falsification
Date: 2026-10-17 00:35 Asia/Taipei
Source main SHA at study start: 5c6408490d8b06348add96c378f48897f5c97661
Owner: Room10; scope: D14 execution quality / D15 portfolio cash and realized-loss evidence.
Status: RESEARCH_ONLY_SYNTHETIC / NOT_PRODUCTION_VERIFIED
Formal Core: LOCKED; no selection, sizing, signal, order, monitoring, push, or deployment change.

## Delta vs preceding Room10 evidence
Do not repeat the 2026-10-16 event-scope/correction study. Its archived prototype event_scope_guard.py checks source identity, revision chain, quantity and first-known cutoff. New falsification identifies a separate **event effective-time chronology** omission. Its audit() accepted a synthetic 20-share FILL effective at t=11 and a positively verified final TERMINAL effective at t=10 with cumulative 20 shares; the prior prototype returned BROKER_REPORTED_DETAIL_MATCH. A final terminal with a reliable broker *effective-finalization clock* cannot precede the fill it finalizes. The new research-only terminal_chronology() rejects this input as UNKNOWN / FILL_EFFECTIVE_AFTER_FINAL_TERMINAL.

**Critical qualification:** this check is valid only when the broker's TERMINAL.occurred represents the effective finalization instant. If it is merely an order-status snapshot or receipt-transmission time, do not infer invalidity; instead mark the clock contract UNKNOWN until source semantics are verified. Late delivery of a previously effective fill is not equivalent to a late effective fill. A correction first known later cannot rewrite the prior as-of decision.

## D14: sign-consistent parent-order implementation shortfall
For side s = +1 BUY or -1 SELL, frozen decision benchmark P0, parent quantity Q, verified filled quantities q_j at p_j, end-horizon comparator Ph, positively evidenced explicit fees C:

  IS = s * sum_j q_j (p_j - P0) + s * (Q - sum_j q_j) (Ph - P0) + C.
  IS_bps = 10,000 * IS / (P0 * Q).

This is an arithmetic attribution **not** a causal market-impact estimate, actual broker P/L, or a standalone alpha signal. The horizon comparator is an ex-post opportunity-cost convention and must not enter an earlier decision's feature set. Missing fees, future horizon price, incomplete terminal lifecycle, non-broker fills, or overfill => UNKNOWN, not 0.

Synthetic witnesses:
- BUY 100 @ decision 50; 40 fill @50; 60 unfilled; horizon 51; assumed fee 20 => IS 80, 160 bps.
- SELL same parent, 40 fill @50, horizon 49, fee 20 => IS 80, 160 bps.
- SELL 100 fill @51, decision 50, fee 0 => IS -100 (price improvement).
- SELL 100 entirely unfilled while horizon rises from 50 to 51, fee 0 => IS -100, i.e. not selling avoided an adverse sale; it is not booked P/L.
These are synthetic inputs, not actual Taiwan transactions, and the 20 fee is arbitrary.

## D15 evidence boundary
The two-sided shortfall is an execution diagnostic. It does not establish broker cash reservation, settled holdings, inventory lot basis, or realized P/L. A terminal receipt and priced fill details still require identity, chronology, correction version, and account reconciliation. Never count a SELL opportunity-cost benefit as cash received; never add modeled implementation shortfall to an actual fill-price ledger as an extra generic slippage charge.

## Hypotheses and adversarial controls
H1 (chronology): verified finalization effective time bounds prior effective fills. Support: strict source-clock contract. Falsifier: source proves TERMINAL is only an interim snapshot or uses a different clock. Alternative: late notification, retroactive correction, clock skew. Failure: source clock semantics or synchronized clock unknown.
H2 (two-sided shortfall): side-normalized arithmetic makes BUY/SELL cost signs consistent and preserves unfilled parent denominator. Support: deterministic paired synthetic cases. Falsifier: incorrect side sign, filled-only denominator, unpriced residual. Alternative: adverse selection, market/sector move, liquidity and orderability. Failure: missing benchmark, fee, actual fill, lifecycle or horizon receipt.
H3 (portfolio inference): implementation shortfall cannot establish realized P/L or available cash. Support: distinct account and lot-level provenance. Falsifier: audited broker statement can supply those independently. Alternative: settlement/fee aggregation and financing. Failure: missing account/lot/cost-basis/settlement.

## Verification and promotion gates
30 synthetic unit checks passed (10 chronology + 20 two-sided shortfall), after correcting one initially mistaken test expectation about as-of correction visibility. These are **not 30 independent trading days** and are not PIT/OOS performance evidence. Real Taiwan PIT source clocks, untouched OOS, walk-forward, independent sessions, actual fees, slippage, limit/odd-lot mechanism, broker fills, portfolio funding, multiple testing and cross-regime robustness remain unverified. All absent evidence = UNKNOWN. No historical Shadow was manufactured. No FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation
1. Obtain broker-specific clock semantics: distinguish execution effective-at, status effective-at, broker transmitted-at, local received-at, and first-known-at. Only then validate chronology on genuine prospective receipts.
2. Restore this isolated research delta to canonical D14/D15 specialist checkpoints without replacing parallel updates. Re-read latest main and file blob SHAs before writing.
3. Reconcile the already-frozen D14-16/D14-17 L2 mechanism contracts versus tracker L0 through explicit evidence review; D14-18 and D15-23/24 remain candidate-only until reviewed. Do not claim official maturity upgrade from this study.
4. Keep Formal Core LOCKED and separate execution diagnostics from broker-confirmed positions and realized P/L.
