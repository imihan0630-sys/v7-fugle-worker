# Curriculum H01-H04 Specialist Validation Packets 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READY_FOR_SPECIALIST_EXECUTION
Parent contract:
`shared-knowledge/CURRICULUM_H01_H04_CONSOLIDATION_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

These packets do not authorize retirement or Formal Core changes.

## Packet H01 — 07｜產業與供應鏈研究室

Target:
D09-13 Industry Structure／Porter Five Forces
vs
D09-14 Market Share／Entry Barrier／Substitution／Competitive Strategy

Required work:
1. Build a concept-by-concept ownership matrix.
2. Separate industry-level structure from firm-level strategic actions.
3. Identify exact observable sources for rivalry, share, barriers, substitutes, supplier/customer power and strategic actions.
4. Produce at least three divergent-state cases where D09-13 and D09-14 would legitimately differ, or explicitly report that such cases cannot be defined.
5. Test whether D09-14 has any unique PIT/replay/data contract.
6. Freeze anti-double-count rules.
7. Propose one terminal classification:
   - MERGE_ELIGIBLE
   - KEEP_SEPARATE
   - SCOPE_DEDUP_ONLY
   - EVIDENCE_INSUFFICIENT
8. If MERGE_ELIGIBLE, propose surviving name/scope and capability-preservation map.

Forbidden:
- no retirement;
- no maturity promotion from title cleanup;
- no Formal change.

## Packet H02 — 10｜投組風控與交易執行研究室

Target:
D14-03 Signal Price vs Fill Price
+
D14-04 Slippage
vs
D14-17 Implementation Shortfall／Market-impact Cost

Required work:
1. Freeze price benchmark taxonomy: signal, decision, arrival, order, fill, VWAP/TWAP/reference.
2. Build the signal-to-fill accounting identity.
3. Separate spread/slippage, delay cost, market impact, partial fill, explicit fees/taxes and opportunity cost.
4. Map current D14-03 L3 evidence and D14-04 L2 evidence to child semantics.
5. Define what remains uniquely unvalidated in D14-17.
6. Verify D14-12 Execution Alpha remains downstream and is not duplicated.
7. Produce replay/schema/API/UI capability inventory.
8. Propose terminal classification and merged-scope maturity map.

Mandatory maturity firewall:
D14-17 cannot inherit L3 merely because D14-03 is L3.

Forbidden:
- no merge;
- no maturity carry-forward by max/average;
- no live execution behavior change.

## Packet H03 — 10｜投組風控與交易執行研究室

Target:
D15-13 Expected Shortfall／Tail Risk
vs
D15-24 VaR／Parametric-Historical VaR

Required work:
1. Define common portfolio, horizon, confidence and P&L distribution contracts.
2. Compare parametric VaR, historical VaR and Expected Shortfall mathematically and operationally.
3. Record VaR and ES failure modes separately.
4. Verify whether VaR owns any distinct limit-management/regulatory/policy state.
5. Preserve D16-23 Stress Test as separate validation/stress methodology.
6. Define nonlinear/derivative/liquidity/concentration limitations.
7. Return terminal classification.
8. If merge supported, propose unified module name, child methods and maturity recomputation.

Forbidden:
- no statement that ES equals VaR;
- no use of VaR as replacement for stress testing;
- no automatic L2 transfer to unvalidated VaR semantics.

## Packet H04 — 09｜衍生品與國際總經研究室

Target:
D12-14 IV-RV Spread
vs
D12-15 Volatility Risk Premium

Required work:
1. Freeze formal definitions for IV-RV proxy and ex-ante VRP.
2. Distinguish volatility units from variance units.
3. Align DTE/horizon between implied and realized measures.
4. Define risk-neutral vs physical expectation semantics.
5. Identify jump, liquidity, sparse quote and interpolation contamination.
6. Trace both modules back to exact parent option-chain/realized-volatility rows.
7. Produce divergent-state examples where IV-RV and VRP legitimately differ.
8. Test incremental OOS information after common-support controls.
9. Propose terminal classification.
10. If merge supported, propose D12-15 survivor with D12-14 as named proxy child.

Forbidden:
- same source rows cannot create two independent Alpha votes;
- no L3 promotion without Taiwan PIT evidence;
- no Formal change.

## Return format for all packets

Specialist room must return:
- evidence files/paths;
- exact module IDs;
- positive mechanism;
- counterevidence/falsification;
- PIT/source/replay contract;
- shared vs unique observables;
- divergent-state examples;
- capability-preservation inventory;
- anti-double-count rule;
- terminal classification;
- maturity implication;
- explicit "Formal Core unchanged" statement.

00｜研究總控室 will then perform Dependency Audit and owner review.
