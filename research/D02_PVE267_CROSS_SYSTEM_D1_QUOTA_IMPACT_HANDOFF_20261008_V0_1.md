# D02 PVE-267 — Cross-System D1 Quota Impact Handoff

Date: 2026-10-08 Asia/Taipei  
Room: 02｜價量研究室 (D02)  
Status: EVIDENCE_COMPLETE / HANDOFF_TO_EXISTING_CORR003 / NO_QUEUE_OWNERSHIP_TRANSFER / FORMAL_UNCHANGED

## Scope

This document does not open a new System2 correction and does not mutate the System2 correction queue.

It contributes new D02 evidence to the already-open canonical directive:

`S2-CORR-20261007-003` — System2 isolated D1 writers lack global free-tier daily write-budget coordination.

Canonical queue state observed before this handoff:
- severity: HIGH;
- status: OPEN;
- routingClass: REMEDIATION_LANE;
- assignedRoom: System 2｜補強修復室;
- modificationOwner: SYSTEM2_REMEDIATION_ROOM.

AUDIT_LANE remains the routing/severity/closure authority.

## New cross-system evidence

### 1. System1 after-market execution was physically blocked by the shared D1 account quota

PVE-263 read-only production side-effect audit observed:
- `V7_LAST_SCAN_ATTEMPT.status = FAILED`;
- requestedDate = 2026-10-07;
- generatedAt = 2026/10/07 23:36:10 Asia/Taipei;
- error = Cloudflare D1 Free daily row-write limit exceeded;
- failure alert was sent.

The 2026-10-07 after-market lease also has a 23:55 Asia/Taipei update, proving the configured primary/recovery family was entered even though no D1 cron-audit row could be persisted.

Therefore missing `v7_cron_runs` rows do not prove the trigger was absent. Once D1 write quota is exhausted, `writeCronRun()` itself cannot persist the audit row and its failure is fail-open.

### 2. The account-level write load was overwhelmingly System2

PVE-264 Cloudflare D1 analytics for 2026-10-07:
- SYSTEM2_DB rowsWritten = 124,629;
- V7_DB rowsWritten = 1,869;
- account rowsWritten = 126,498;
- official Free ceiling = 100,000 rowsWritten per UTC day.

Shares of measured account writes:
- SYSTEM2_DB ≈ 98.52%;
- V7_DB ≈ 1.48%.

This physically falsifies the assumption that separate D1 database IDs isolate the Free write quota.

### 3. Physical table population identifies historical A1 as the dominant System2 row family

PVE-266 read-only table attribution for UTC 2026-10-07:
- `s2_historical_a1_bars`: 18,460 rows with `captured_at` in the UTC day;
- `s2_historical_a1_pack_manifests`: 1,538 rows;
- `s2_historical_ingest_batches`: 21 rows;
- `s2_resonance_runs`: 1 row;
- `s2_resonance_snapshots`: 0 rows.

Canonical CORR-003 calibration independently measured:
- Recent A1 Hot History Warmup: 9,640 logical A1 bars -> 57,880 D1 rowsWritten, approximately 6.00x logical-row amplification;
- Daily Shadow scheduled run: 13,130 rowsWritten;
- later Daily Shadow push run: 1,296 rowsWritten;
- 2024 TWSE annual sample: 7,358 rowsWritten.

The new PVE-266 table distribution is consistent with the existing CORR-003 diagnosis that indexed historical A1 insertion is a dominant write-amplification family. It does not claim that every one of the 124,629 System2 rowsWritten is attributable to one workflow.

## Material impact extension

Existing CORR-003 already proves System2 execution continuity and quota governance are defective.

PVE-263/PVE-264 add a new material impact:
**System2 account-level write consumption can deny System1 V7_DB writes even when V7_DB itself has consumed only a small fraction of the daily account total.**

The impact is therefore cross-system, not merely isolated-System2 workflow contention.

D02 does not self-change CORR-003 severity or routing.
AUDIT_LANE should decide whether the existing HIGH classification and affectedScope/acceptanceCriteria need amendment.

## Acceptance extension recommended to AUDIT_LANE

Without changing strategy or Formal Core, CORR-003 closure should additionally prove:

1. Account-level reservation semantics explicitly protect the System1 after-market critical window, not only System2 P0 writers.
2. A lower-priority System2 bulk/warmup writer cannot consume reserved headroom needed for System1 primary/recovery after-market persistence.
3. Unknown account-wide usage remains fail-closed; a separate database ID is not quota isolation.
4. At least one later real trading day physically demonstrates:
   - the quota gate/reservation was active before the after-market window;
   - the System1 23:35 primary and 23:55 recovery family was invoked;
   - at most one business scan succeeds;
   - the completed scan persists its normal production receipts;
   - quota exhaustion does not prevent audit evidence from distinguishing trigger absence from write failure.
5. No automatic paid-plan upgrade or billing change occurs.
6. No System1 Formal Core, A/B, Top6/3+3, capital, order, notification eligibility or System2 strategy/ranking/final-selection semantics change under this quota fix.

## D02 consequences

- 2026-10-07 cannot become a clean H001 prospective date.
- The PVE-261 baseline-freshness remediation remains a separate owner-gated Class-B runtime issue.
- Fixing account quota coordination does not repair the stale 2026-10-07 11:45 baseline retrospectively.
- Clean prospective H001 dates remain 0.
- D02 maturity remains 60.0%.
- Gate 7 remains CLOSED.
- Formal Core remains LOCKED.

## Exact continuation

PVE-268 — freeze a research-only cross-system quota acceptance guard matching the extension above. It must not implement the quota allocator. After that, return to D02's own evidence lane: preserve the baseline-refresh owner gate and wait for a future genuinely prospective post-remediation exact-slot receipt; no retrospective date promotion.
