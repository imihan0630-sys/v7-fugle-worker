# D19 Stage 30 — six-receipt semantic attestation falsification

Date: 2026-10-13 Asia/Taipei. RESEARCH_ONLY. Formal Core LOCKED. No maturity change.

## Latest canonical state and prior branch reconciliation
- Main at branch creation: `faa40eefc276079960532122e928e44cf2161cfb`. Tracker updated 2026-10-13 10:16 Taipei: D19 15 active modules, 41.3%; overall 356 modules, 47.9%.
- Stage 28 D19-16 preregistration is only on `research/d19-stage28-liquidity-prereg-20261012`. Stage 29 branch contains only the same three Stage 28 files; no new Stage 29 remote commit. No unmerged evidence is counted as formal progress.
- Main already has D19-13 and D19-15 Stage 16 preregistration. D19-14 is retired; do not recreate it.

## New code-level negative-control finding
- Read exact main source `system2/runtime/d19_factor_receipt_adapter_v0_1.mjs` and test `system2/tests/d19_factor_receipt_adapter_v0_1.test.mjs`.
- `receiptChainComplete` is determined from six upstream READY states; `l3DataFeasibilityEligible` is READY plus caller-provided `eligibilityBlockers.length===0`. This is a structural readiness calculation, not independent provenance attestation.
- Neutralization READY permits null `benchmarkVintageHash` and `industryVintageHash`; cost READY permits `MODELED` zero slippage and null component `sourceHash`; replay checks nonempty upstream receiptHash strings but does not independently recompute physical raw-source hashes or validate upstream runId/date/factor identity.
- Executed exact fetched adapter functions with SHA-hash and deep-freeze dependencies stubbed. Synthetic upstream receipts with READY states, absent benchmark/industry vintage, modeled zero slippage, null cost sourceHash, mismatched runId and no caller blockers returned `receiptChainComplete=true`, `l3DataFeasibilityEligible=true`. Adding `SYNTHETIC` blocker returned L3=false; setting cost state INCOMPLETE returned L3=false.
- This is a reproducible source-path semantic counterexample, NOT a real Taiwan PIT replay, NOT a full cryptographic runtime integration test, and NOT evidence of a live false promotion. Existing D19-04 smoke explicitly supplies blockers and returns L3=false.

## Research-only independent attestation requirements
1. Freeze factor identity, factor set/version, code version, decision clock, universe vintage, benchmark methodology, return definition and experiment family before outcome inspection.
2. Verify canonical receipt hashes against raw immutable source bytes; cross-check runId/date/market/factor/version across all six child receipts, and independently recompute replay outputHash.
3. `universeReceipt`: historical TWSE/TPEx including delisted/suspended/relisted, session/vintage/first-known provenance; no current-universe backfill.
4. `returnReceipt`: corporate actions, adjusted/total-return semantics, valid observations, price limits, zero trade and non-price records, revision/continuity policy.
5. `factorInputReceipt`: timezone-aware firstKnownAt/availableAt <= decisionAt, source hash, frozen formation windows; missing/zero traded value remains UNKNOWN.
6. `neutralizationReceipt`: factor-set and industry/benchmark vintage when required by the preregistered method, same-date same-universe D03/D09 spanning, independent-date clustering, multicollinearity diagnostics and residual lineage.
7. `costReceipt`: D14 actual/modeled quality separation, commission, taxes, spread, slippage, market impact, turnover, capacity, short-leg borrowability; modeled zero cost is not observed executable net alpha.
8. `replayReceipt`: independent provenance-generated blocker ledger, canonical source/result hashes, deterministic replay and independent auditor signature or immutable evidence reference.
9. Distinguish UNKNOWN (unavailable provenance) from FAIL (observed contradiction). Optional industry/borrow fields can be NOT_APPLICABLE only under a frozen, explicit factor design.
10. L3 requires source-native Taiwan replay and attested six-receipt chain; L4 requires genuine OOS or prospective Shadow; L5 requires independent multi-regime robustness. No historical Shadow fabrication.

## Scientific falsification and incremental value
The risk is evidence promotion by mistaking transport-schema readiness for economic/data certification. Alternative explanation: adapter READY is intentionally a transport-layer status and callers are responsible for explicit blockers. No production defect is proven. Positive mechanism is a separate attestation layer preventing factor-zoo, survivorship, benchmark-shopping and D03/D09 double counting. Negative controls must vary missing vintages, synthetic hashes, mismatched runs, modeled costs, cross-zone first-known clocks, and unverified borrowability. Real Taiwan net alpha, liquidity/capacity gains and System 1/System 2 incremental returns remain UNKNOWN. Formal Core unchanged; `FORMAL_OPTIMIZATION_CANDIDATE` NONE.

## Exact next continuation
1. Independently re-execute adversarial tests with unmodified cryptographic hashing and source-native archived Taiwan receipts in isolated research CI.
2. Reconcile Stage 28 preregistration into latest-main research-only branch without stale overwrite; preserve Stage 29 local-only evidence as unmerged, not authoritative.
3. Bind D19-04 upstream TWSE/TPEx historical registry, company-action continuity, industry/benchmark vintage, same-date D03/D09 spanning, D14 component costs and borrowability to six source-native receipts.
4. Only zero-applicable-blocker, independently verified physical Taiwan replay can trigger L3 review. No L4 without OOS/prospective Shadow. Do not change System 2 adapter, Formal Core or production without approval.
