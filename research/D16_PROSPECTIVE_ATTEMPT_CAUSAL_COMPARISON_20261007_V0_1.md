# D16｜10/02 vs 10/06 Prospective Attempt Causal Comparison V0.1

更新：2026-10-07 Asia/Taipei
狀態：RESEARCH_ONLY / CAUSAL-ATTRIBUTION FIREWALL EXAMPLE
Formal Core impact：NONE

## Common surface code

兩次 attempt 都觀測到：
- `FORMAL_SCAN_NOT_CONFIRMED`;
- `C1_GENERATION_NOT_FOUND`;
- `eligibleForResearch=false`;
- `mayCountAsZeroPick=false`.

如果只看 terminal blocker code，兩次看起來完全一樣。

## 2026-10-02

Canonical prior receipt：
`research/d02_20261002_after_market_h20_receipt_v0_1.json`.

Facts：
- institutionReady=true；
- qualityReady=true；
- missingQuality=[]；
- late recovery reached 00:01:12 Taipei；
- recovery skipped because old same-day window had already crossed midnight；
- missed ready recovery root cause = `CROSS_MIDNIGHT_TARGET_DATE_DRIFT`;
- direct original 23:35/23:55 Worker failure remains unknown；
- PR #318 later repaired cross-midnight date pinning；
- no retrospective C1 generation was fabricated。

Causal status：
`PARTIAL_CAUSAL_CHAIN`.

## 2026-10-06

Canonical attempt：
`research/D16_PROSPECTIVE_EVIDENCE_ATTEMPT_20261006_V0_1.json`.

Facts：
- institutionReady=true；
- qualityReady=false；
- missingQuality=[FINANCIAL, QUARTER_EPS]；
- formalScanDate remained 2026-09-29；
- formalPipelineComplete=false；
- no C1 generation；
- only readiness blocker artifact was emitted。

No complete execution chain currently proves that missing FINANCIAL / QUARTER_EPS was the sole causal reason for the absent Formal scan/C1 generation.

Causal status：
`OBSERVED_FACTS_ONLY`.

## Statistical conclusion

Same blocker code does not identify same missingness mechanism.

Therefore future sensitivity analysis must condition on a richer pre-outcome failure taxonomy rather than treating all parent-missing attempts as exchangeable.

At minimum preserve:
- source readiness state；
- missing dataset identities；
- clock/recovery state；
- validator/lineage status；
- causal-attribution confidence；
- repair/version boundary。

Do not pool 10/02 and 10/06 as one homogeneous missingness stratum unless a defensible preregistered mechanism mapping is later established.

No maturity change.
