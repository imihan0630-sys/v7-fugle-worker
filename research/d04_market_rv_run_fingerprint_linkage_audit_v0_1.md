# D04 Market-RV Run-Fingerprint Linkage Audit V0.1

Updated: 2026-10-01 13:36 Asia/Taipei
Status: EVIDENCE_INTEGRITY_GAP_CONFIRMED / DESIGN_FROZEN / NOT_IMPLEMENTED
Scope: D04 volatility evidence persistence; D05 dependency only
Formal Core impact: NONE

## Finding
Current main builds S2_SHADOW_RUN_FINGERPRINT_V0_1 before buildRegimeStorageRow(). The fingerprint commits source-session/accounting/decision/order/ranking/capacity/lifecycle hashes, but not regime_snapshot_id, regime snapshot_hash, regimeFactorObservations, or the Market-RV bundle.

Persistence co-location is not equivalent to immutable run-level commitment.

## Evidence consequence
Until linkage is proven, a real date that successfully writes and reads back Market-RV observations may be labelled only PERSISTED_BUT_FINGERPRINT_LINKAGE_UNPROVEN. It must not be promoted to PROSPECTIVE_PIT_VALID_DATE. Historical recomputation, synthetic fixtures, builder tests, or later backfill cannot repair a missing decision-time commitment.

## Minimal versioned design candidate
Do not silently change S2_SHADOW_RUN_FINGERPRINT_V0_1 hash semantics.
1. Build the regime storage row before the run fingerprint.
2. Preserve the regime snapshot hash over factor observations plus source receipts.
3. Introduce a versioned fingerprint schema candidate that explicitly commits regimeSnapshotId plus regimeSnapshotHash.
4. Preserve V0.1 replay semantics for historical rows.
5. No new Market-RV table is required; the existing regime snapshot remains the single persistence surface.

This is evidence-integrity research only. It changes no selection, BUY, ranking, ATR, stop, maxChase, sizing, monitoring, or Formal Core behavior.

## Mandatory falsification tests
- Same inputs reproduce the same regime snapshot hash and run fingerprint.
- Change only MARKET_RV5_CC_SIMPLE: both hashes must change.
- Change only MARKET_RV20_CC_SIMPLE: both hashes must change.
- Change only Market-RV provenance/source receipt while numeric values stay fixed: both hashes must change.
- V0.1 historical fingerprints replay under V0.1 semantics; a new version must not reinterpret them.
- UNKNOWN/late/stale/invalid A2 evidence stays UNKNOWN and later backfill cannot make the original date valid.

Failure of any mutation test keeps the date PERSISTED_BUT_FINGERPRINT_LINKAGE_UNPROVEN.

## D05 dependency
D05 may later reuse the run-level commitment pattern for causal midquote-RV and microstructure evidence, but this audit does not promote snapshot pressure to true OFI and does not relax books/trades completeness requirements.

## Exact next continuation
D04-RV-PERSIST-04B:
1. Under applicable governance, implement or separately approve the versioned regime-snapshot commitment path without altering Formal Core.
2. Add deterministic positive and negative mutation tests.
3. Re-read latest main and verify CI/regression.
4. Only then wire the existing Market-RV builder output into the same-run regimeFactorObservations path.
5. FIRST REAL DATE must pass same-date A2 receipt -> builder -> regime snapshot -> persistence -> readback -> deterministic replay -> versioned run-fingerprint linkage before any outcome inspection.
6. After multiple independent clean dates accumulate, test state occupancy and overlap-vs-nonoverlap robustness; do not tune thresholds from outcomes.

D04 maturity remains 42%; D05 remains 46%. No FORMAL_OPTIMIZATION_CANDIDATE.
