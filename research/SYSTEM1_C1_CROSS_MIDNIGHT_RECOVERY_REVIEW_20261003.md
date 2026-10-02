# System 1 cross-midnight recovery — Class B review

Date: 2026-10-03 Asia/Taipei
Status: CLASS-B CANDIDATE / CI PASS / DRAFT PR #318 / NOT MERGED / FORMAL CORE LOCKED
PR: https://github.com/imihan0630-sys/v7-fugle-worker/pull/318

## Live evidence and root cause

The 2026-10-02 market session failed to produce a C1 generation even though the
late official-data retry eventually completed all required source families.

Observed immutable GitHub Actions evidence:

- Run 37028644283 (started ~23:40 Taipei) failed in QUARTER_EPS source review
  after three HTTP 503 responses. Recovery was therefore skipped.
- Run 37030724117 (started ~23:58 Taipei) successfully cached institution data
  for 1,865 symbols and completed INDEX, TDCC, VALUATION, ANNOUNCEMENTS,
  FINANCIAL and QUARTER_EPS readiness for marketDate 2026-10-02.
- That successful job reached recover_after_market at 00:01 Taipei on
  2026-10-03. The old script recomputed "today" at step execution time, changed
  its target to 2026-10-03 and exited with "Outside 23:35-23:59 same-day
  recovery window". It therefore never recovered the missing 2026-10-02 scan.
- Scheduled C1 collector run 37033639328 then failed closed with
  C1_GENERATION_NOT_FOUND / FORMAL_SCAN_NOT_CONFIRMED and correctly refused to
  count the date as zero picks.

The direct failure mechanism is therefore a cross-midnight date drift inside
the late fallback workflow. This does not prove that the earlier EPS 503 was
the only upstream issue, but it explains why the later fully-ready retry still
did not execute the intended 2026-10-02 recovery.

## Candidate repair

PR #318 freezes one target market_date at the trading-day gate and passes the
same date through official close, institution and quality synchronization.
For the 23:25/23:45 Taipei late schedules, an execution that starts after local
midnight resolves to the intended prior market session.

Automatic after-market recovery is narrowed to the explicit 23:45 fallback
schedule. The scheduled fallback carries the frozen target through midnight,
is limited to today/previous-Taipei-date only, and still performs at most one
business POST. An ambiguous timeout is followed only by read-only scan-status
confirmation; no blind repeated POST was added. Manual blank dispatch keeps
the existing 23:35-23:59 guard; explicit historical recovery remains separate.

Protected invariants: no A/B, score, ranking, threshold, 3+3+3 quota, capital,
15-minute confirmation, signal, push, System2 or Formal candidate semantics
are changed.

## Validation

PR head 7c42432cc587f253acf89873ea5a4ecdf3b7f195:
- V8 Regression Tests run 37038560945: PASS.
- V8 Repair CI run 37038561353: PASS.
- System1 isolated offline repair review run 37038560672: PASS, 58/58 tests.
- Dedicated cross-midnight regression: 27 assertions PASS.
- Test receipt explicitly reports crossMidnightPinned=true,
  scheduledFallbackOnly=true, businessPostRetryChanged=false,
  formalSelectionRulesChanged=false, system2Touched=false.
- Latest main divergence at review time touched only
  shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md; no repair-file overlap.
- PR was mergeable/clean at review time.

## Decision boundary and continuation

This repair changes the shared scheduled data/recovery path and can indirectly
cause the missing Formal scan to execute. It is therefore Class B even though
it does not alter selection logic. Owner approval is required before merge and
deployment.

If approved:
1. refresh latest main and re-check overlap/CI;
2. merge PR #318;
3. monitor any triggered Worker deployment and prove runtime/config/Cron and
   formal-selection behavior unchanged;
4. do NOT manufacture a retrospective 2026-10-02 C1/WATCH sample;
5. on the next genuine trading session, verify 23:35 Formal or 23:45 fallback,
   C1 saveOk/readbackVerified, complete hashes/pagination, then the 00:10 paired
   C1/C2 collector;
6. only complete prospective generations enter economic evaluation.

Rollback: revert PR #318. Existing plans, receipts and research rows are not
deleted. Formal Core remains locked.
