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

## Mandatory operator ceilings

Live capture remains disabled unless all three runtime limits are explicit:
- C3_RESEARCH_MAX_SYMBOLS
- C3_RESEARCH_MAX_CALLS_PER_SLOT
- C3_RESEARCH_CALL_BUDGET_PER_SESSION

No default provider quota is invented. An unset limit is a blocker, not zero
budget and not implicit permission.

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

## Evidence boundary

This candidate does not establish that no-retest entry is superior and does
not authorize any Formal entry change. It only makes prospective path evidence
possible for names that Formal did not monitor.

No merge or deployment is authorized by this checkpoint. Exact-head CI must
pass first. After CI, explicit owner Class-B approval is still required before
main merge/deployment and before setting live provider ceilings.
