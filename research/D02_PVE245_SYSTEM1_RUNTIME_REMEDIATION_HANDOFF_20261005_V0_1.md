# D02 PVE-245 — System 1 runtime remediation handoff

Updated: 2026-10-05 Asia/Taipei
Status: ROUTED / RESEARCH_BLOCKER / FORMAL_CORE_LOCKED / NO_PRODUCTION_CHANGE_AUTHORIZED
Source evidence: PVE-244

## Purpose

Route three physically observed D02 prospective-evidence blockers to System 1 engineering without D02 changing Formal production behavior.

This handoff is an acceptance contract, not authority to deploy.

## Physical evidence

Canonical D02 evidence:
- research/D02_PVE244_LIVE_15M_READONLY_AUDIT_20261005_V0_1.md
- research/d02_pve244_live_15m_readonly_audit_v0_1.json

Read-only physical D1 run:
- workflow: .github/workflows/d02-pve244-d1-readonly.yml
- successful run: 37334245340
- head SHA: 517b5d95352cd63d328f68e858c0c6d4d3381050
- mutationCount=0
- temporary diagnostic Worker/subdomain cleaned up.

## Remediation A — prospective raw-source provenance persistence

Observed physical INTRADAY_15M source fields contain:
- sourceFamily;
- barStart;
- barEnd;
- sourceFetchedAt;
- completedBar;
- semanticFingerprint.

Missing:
- provider;
- endpoint;
- rawPayloadHash.

Research requirement:
future D02 canonical receipts must bind the raw provider response at decision time, before normalization.

Acceptance:
1. provider is explicit and versioned;
2. endpoint/source contract identity is explicit;
3. rawPayloadHash is computed from the exact captured provider payload or a frozen canonical raw-payload representation at fetch time;
4. semanticFingerprint remains separate from rawPayloadHash;
5. no API key/secret is persisted;
6. PVE-241 canonical guard passes on a future physical 15m row;
7. missing raw provenance fails closed.

Classification:
- read-only inventory/diagnostics: Class A;
- production persistence/schema/runtime changes: Class B minimum; follow governance and owner approval.

## Remediation B — 15m historical baseline bootstrap readiness

Frozen implementation intends:
- if validSessions < 20, fetch historical 15m from marketDate-180 days to marketDate-1;
- normalize sessions;
- merge/write baseline;
- skip only after validSessions >=20.

Physical 2026-10-05 baselines:
- 2006 = 2 valid sessions;
- 2454 = 1 valid session;
- 4977 = 2 valid sessions.

2454 H001 rows at 10:15/10:30/10:45 therefore have:
- slotHistoryCount=1;
- pvSlotRvol20=null;
- DATA_INSUFFICIENT / INVALID.

Acceptance:
1. first perform read-only root-cause diagnosis;
2. expose bootstrap attempt status, requested range, provider status, raw bar count, normalized valid-session count, rejected-session count/reasons and final validSessions;
3. no silent success when <20 remains;
4. H001 remains DATA_INSUFFICIENT until same-slot history >=20;
5. prove at least one future monitored symbol has a physical >=20-session baseline before H001 admission;
6. do not reconstruct 2026-10-05 as clean prospective H001 evidence after repair.

Classification:
- diagnostics/receipts: Class A;
- production bootstrap/runtime correction: Class B minimum.

## Remediation C — scheduled capture continuity and after-market classification

Physical 2026-10-05 evidence:
- INTRADAY_MONITOR D1 rows are observed through approximately 11:08 Asia/Taipei;
- no later intraday monitor row is observed before history warmup;
- last 15m snapshot is therefore 10:45;
- source/spec defines regular intraday monitor window through 13:24;
- current deployed cron readback after market contains the intended intraday trigger families;
- 23:35 Asia/Taipei D1 row is recorded as job_type=INTRADAY_MONITOR and SKIPPED;
- source implementation says Taiwan hour >=18 is after-market;
- root cause is not certified.

Acceptance:
1. diagnose actual Cloudflare scheduled-event continuity for a full future trading session;
2. prove D1 cron audit continuity or explicit bounded skip semantics through 13:24;
3. reconcile 23:35/23:55 cron identity with isAfterMarketSchedule;
4. future after-market triggers must be physically read back as AFTER_MARKET_SCAN or an explicitly governed equivalent;
5. missing scheduled events remain UNKNOWN/FAILED, never inferred SUCCESS;
6. no retrospective reconstruction of missing 2026-10-05 intraday events as prospective evidence.

Classification:
- read-only schedule/readback diagnosis: Class A;
- changing formal scheduled triggers/monitor runtime may affect production behavior and must be classified under governance before deployment; do not assume Class A.

## D02 admission after remediation

A future H001 date may begin only after all are simultaneously true:
- canonical 15m raw provenance complete;
- slot >=10:15;
- >=20 same-slot prior valid sessions;
- pvSlotRvol20 finite;
- baseline clean;
- current-slot coverage valid;
- common support valid;
- source continuity valid;
- cohort/generation/Formal isolation gates pass;
- no post-outcome repair.

2026-10-05 remains excluded from clean prospective-date counting.

## Formal boundary

No request in this handoff authorizes:
- Formal A/B eligibility change;
- ranking/Top6 change;
- threshold/weight change;
- capital/trading/push change;
- outcome access;
- historical evidence relabeling.

Formal Core remains LOCKED.

## D02 continuation after handoff

PVE-246 — consume System 1 remediation readback when durable, then capture the first future 15m H001 canonical receipt under the corrected path. Until then, H001 prospective admission remains fail-closed.
