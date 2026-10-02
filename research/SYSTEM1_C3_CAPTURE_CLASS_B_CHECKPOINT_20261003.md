# System 1 C3 Shadow-only 15m capture — Class B checkpoint

Date: 2026-10-03 Asia/Taipei
Status: CLASS-B CANDIDATE / NOT MERGED / NOT DEPLOYED / FORMAL CORE LOCKED
PR: #322
Parent research PR: #321

## Purpose

Provide prospective completed 15-minute bars for bounded C2 Shadow-only names
without adding those symbols to the Formal monitoring target list. Existing
Formal/PV evidence is reused for names already monitored, so the additional
provider path is only for Shadow-only research names.

## Candidate runtime

Patch: `scripts/apply_v8_15_2.py`
Candidate version: `8.15.2-c3-research-capture`.

The patch adds immutable research-only D1 tables for:
- generation-linked one-session C3 cohorts;
- completed 15-minute C3 bars.

Admin-only research endpoints allow cohort registration/readback and bar
readback. Cohort registration requires an existing exact C1 generation,
matching source session/content/universe digests, C2 fingerprint, next trading
session, C1-universe membership and an explicit bounded call contract.

## Frozen conservative provider ceilings

Current Fugle public pricing documentation was checked on 2026-10-03 and lists
the Basic Taiwan-stock intraday REST limit as 60 calls/minute. The candidate
does not assume a paid Developer/Advanced plan.

The V8.15.2 research contract freezes:
- provider limit reference: 60 calls/minute;
- maximum Shadow-only capture symbols: 6;
- maximum extra calls per completed 15m slot: 6;
- maximum extra calls per session: 102 (= 6 × 17 completed 15m slots).

Current Formal monitoring is capped at six stocks. Its static worst overlap
minute is 6 Quote + 6 10m candles + 6 15m candles = 18 requests/minute.
The research path adds no Quote request and at most six 15m requests at that
minute, producing a static 24/60 requests/minute envelope.

These are code-versioned ceilings, not a target utilization. The optional
`C3_RESEARCH_CAPTURE_DISABLED=true` binding is an emergency kill switch.
No manual Cloudflare limit variables are required for normal activation.

## Formal separation

The extra path runs only on the existing completed-15m cadence and only after:
1. Formal monitoring results;
2. Formal processSignalState;
3. Formal live-state D1/KV persistence;
4. the existing PV Shadow recorder.

The C3 helper:
- calls 15m candles only;
- makes no extra quote call;
- never appends to monitoringStocks/results;
- never calls processSignalState, sendPush or saveStockConfig;
- has no order, allocation, FIRST/ADD/REDUCE/SELL or System2 path;
- rejects symbols already in the Formal monitoring set so those names reuse
  existing PV Shadow rather than duplicate provider reads;
- fails open as research metadata and cannot fail the Formal decision path.

## Scheduled registration

The existing 00:10 Taipei prospective C1/C2 workflow is extended only for
`schedule` events. After it has already saved a cryptographically verified C1
artifact and matched C2 ledger, it:
1. reads the current Formal config;
2. reuses existing PV Shadow for Formal-monitored eligible names;
3. deterministically selects at most six Shadow-only names from the verified
   C2 cohort;
4. posts only those Shadow-only names to the admin research cohort endpoint.

Push-triggered CI/evidence checks set C3 registration OFF, so repository
changes cannot silently create a live cohort. The registration client does not
guess a weekday. It omits targetTradeDate; the Worker loads the official
trading calendar and derives `nextTradingDate(sourceSessionDate)`. A supplied
mismatching target date is rejected.

Registration failure creates a separate
`SYSTEM1_C3_REGISTRATION_BLOCKER_V0_1` receipt and fails that workflow step,
but does not rewrite or invalidate the already-saved C1/C2 evidence.

## Evidence boundary

This candidate does not establish that no-retest entry is superior and does
not authorize any Formal entry change. It only makes prospective path evidence
possible for names that Formal did not monitor.

No merge or deployment is authorized by this checkpoint. Exact-head CI must
pass after the latest registration/ceiling changes. After CI, explicit owner
Class-B approval is still required before main merge/deployment.

No retrospective cohort may be built from the invalid 2026-10-02 C1 session.
The first honest Shadow-only C3 capture can occur only after a future complete
C1/C2 session has been registered prospectively for its next official trading
session.
