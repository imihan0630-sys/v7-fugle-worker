# D04 Market-RV Persistence Checkpoint — 2026-09-29 01:30 Asia/Taipei

Status: DURABLE_RESEARCH_PROGRESS / TRACKER_SYNC_PENDING
Formal Core impact: NONE

## Completed
- Frozen `research/market_rv_prospective_persistence_contract_v0_1.json`.
- Required raw observations remain MARKET_RV5_CC_SIMPLE, MARKET_RV20_CC_SIMPLE, MARKET_RV_RATIO_5_20.
- Ratio is derived context, not an independent vote.
- Same marketDate/decisionTimestamp, official A2 TAIEX source receipt, PIT timestamps, same regime snapshot persistence, and immutable run-fingerprint linkage are mandatory.
- Missing/late/stale/invalid/insufficient 21-session evidence => UNKNOWN.
- Historical first-known backfill from mutable latest data is prohibited.
- First valid sample is the first actually persisted prospective observation under this contract.
- Pre-outcome acceptance requires write/readback/replay consistency before any return or strategy-outcome inspection.

## Maturity
D04 remains 42%; D04-02 remains L2. A persistence contract is not a PIT sample.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation
1. Authorized isolated research-only wiring may populate the existing regimeFactorObservations path from the existing A2 official source path; no selection/runtime behavior change.
2. On the first prospective persisted date, verify source receipt, clock equality, raw values, ratio consistency, snapshot hash and run fingerprint on readback/replay.
3. Accumulate independent clean dates.
4. Only then compare overlapping RV5/RV20 against non-overlapping recent5/prior15 as robustness.
5. D05 remains EVIDENCE_PENDING until complete prospective event capture proves provider/reconnect/missing-event semantics.

## Sync note
Direct optimistic-concurrency updates to MICROSTRUCTURE_CHECKPOINT.md and research/stock_market_learning_tracker_v0_1.json were attempted after fresh SHA reads but were blocked by the write safety layer before repository mutation. This append-only checkpoint preserves the exact durable continuation without overwriting concurrent research. Next run must re-read main and merge this progress into canonical checkpoint/tracker if the write path is available.
