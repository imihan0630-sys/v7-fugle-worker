# D01 DL-148 — migration receipt causality and content-binding falsification (2026-10-12)

Research-only; Formal Core LOCKED. No live scan, capital, signal, monitor, push, or selection changes.

## Current mainline
Canonical main D01 checkpoint still designates DL-148 after completed DL-147; D01 11/11 L3, maturity 60.0%, whole tracker 22 domains / 356 modules / 47.9%. Prior DL-148 v1/v2/v3 source/test artifacts were restored from existing local archives and tested rather than recreated. Mainline owner source R1-R6 physical receipts for 1101/2021-06-15 (61 eligible sessions) remain unverified; no R7 or outcome join.

## New falsifier 1 — bridge can predate the migration receipt it uses
Synthetic scenario: bridge available 2026-06-01 12:00 +08; migration continuity receipt available 2026-06-02 12:00 +08; decision cutoff 2026-06-02 16:00 +08. Existing v3 returns READY_FOR_INDEPENDENT_D09_REVIEW although the bridge predates its own cited evidence. Research-only v4 correctly blocks BRIDGE_PREDATES_MIGRATION_RECEIPT. Supporting mechanism: bridge first-known must not precede first-known of any receipt it depends on. Alternative: official advance notice may predate the actual migration effective date, so compare source publication rather than effective dates. Failure: without independent source publication proof, synthetic timestamps do not certify official truth.

## New falsifier 2 — continuity receipts were not content-bound to the bridge
V3 accepts certain modifications of receipt source hash / timestamp without invalidating the bridge temporal digest. V4 requires deterministic digest of every migration receipt's securityId, venue direction, owner source hash, certification, and UTC-normalized first-known timestamp; any unbound change blocks. Extraneous receipts and mismatched venue directions also block. Equivalent timezone representations retain identical digest. A self-declared digest is not an independent signature: V4 still never allows a sector metric or independent selection vote.

## Executed native tests
Node.js 22.16.0: existing v1 43/43, denominator properties 400/400, v2 17/17, v3 12/12, new v4 18/18; total 490/490 checks PASS, zero failures. These are synthetic deterministic tests, not market observations. Native test stdout, file SHA256 and all v1-v4 source/tests are in local archive D01_DL148_收據綁定反證_490項原生測試_20261012.zip. No GitHub Actions CI or real historical outcomes claimed.

## Mandatory adversarial and evidence boundary
PIT/UTC chronology and source-vintage admission tested in synthetic inputs. OOS and walk-forward outcomes UNKNOWN; no fabricated historical Shadow. Selection bias: preserve old/new TWSE/TPEx UNKNOWN/CONFLICT/MISSING denominators. Look-ahead: late receipts fail. Data snooping, multiple testing and overfitting: v1-v4 are one preregistered hypothesis family, not four independent wins. Factor redundancy: individual stock price and sector index are not independent votes. Sample size/date clustering: 490 checks are zero real independent market dates. Transaction costs, liquidity and regime dependence remain UNKNOWN. D09 owns sector source/membership certification, D16 owns statistical/OOS signoff.

## Exact next continuation
Re-read latest main and concurrent branches before any merge. Safely persist the complete v1-v4 source/tests with physical native/CI receipts, then update D01 dedicated checkpoint and only afterward tracker if formal evidence actually changes. Obtain D09 certified historical membership/venue receipts; 1101/2021-06-15 exact R1-R6 physical witness remains blocked. If source blocked, move to another unfinished D01 price-structure module. Formal Core stays LOCKED, no promotion candidate yet.
