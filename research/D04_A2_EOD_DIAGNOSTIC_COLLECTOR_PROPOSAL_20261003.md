# D04 A2 / TAIEX EOD Diagnostic Collector V0.1 Proposal — 2026-10-03

Status: CLASS_B_PROPOSAL / PR_ONLY / NOT_ENABLED  
Owner: 04｜波動與市場微結構研究室  
Formal Core: LOCKED  
Existing Decision Clock V0.3: BYTE-FOR-BYTE UNCHANGED  
Production selection / notification / capital impact: NONE

## Why PR #315 was correctly superseded

PR #315 attempted to piggyback A2_TAIEX_CLOSE into the already-frozen System2 Prospective Decision Clock V0.3 collector.

The collector freeze guard correctly rejected that design because the following files are part of the frozen 13-file evidence contract:
- `.github/workflows/system2-prospective-clock-evidence-readonly.yml`;
- `system2/runtime/source_arrival_latency.mjs`;
- `system2/runtime/official_source_probes.mjs`;
- `system2/scripts/measure_source_arrival_readonly.mjs`;
- and the remaining V0.3 dependency/bundle/calendar contract files.

Changing any of them after prospective evidence has started would create a new Decision Clock evidence epoch. Silent hash refresh is prohibited.

Therefore PR #315 was intentionally closed unmerged.

## Replacement design

Create an entirely separate D04 research epoch:

`D04_A2_EOD_EPOCH_V0_1`

New files only:
- `research/runtime/d04_a2_eod_diagnostic_v0_1.mjs`;
- `.github/workflows/d04-a2-eod-diagnostic-readonly.yml`;
- dedicated System2 tests;
- this proposal.

No frozen V0.3 collector-contract file is edited.

## Source and timing

One bounded run per weekday:
- schedule candidate: 16:30 Asia/Taipei (08:30 UTC);
- same-Taipei-date only;
- official TWSE trading-day gate first;
- if non-trading day, no diagnostic collection;
- if trading day, one collection attempt only;
- no 2.5-hour polling loop.

Each attempt performs only three official GET requests:
- current-month TWSE FMTQIK;
- previous-month FMTQIK;
- two-months-prior FMTQIK.

The three-month window is chosen to guarantee enough source history for the last 21 official sessions even around short-calendar months such as Lunar New Year periods. No historical "first-known" time is inferred for older rows.

## Raw-source preservation

For each FMTQIK response the collector preserves in the GitHub artifact:
- exact raw response text;
- SHA-256 of raw UTF-8 bytes;
- byte length;
- requestedAt;
- receivedAt;
- official source URL;
- source month anchor.

Parsed rows must:
- come from the requested month;
- have unique dates;
- contain a positive numeric TAIEX close;
- never contain a date after marketDate.

Cross-month rows are sorted and deduplicated. The latest 21 official source rows ending on marketDate form the diagnostic window.

## Diagnostic semantics

The frozen D04 statistical convention is unchanged:
- SIMPLE close-to-close returns;
- population standard deviation;
- 5-return dispersion;
- 20-return dispersion;
- 5/20 overlap ratio;
- prior15 non-overlap dispersion;
- recent5/prior15 robustness ratio;
- mean and cumulative return retained separately from dispersion.

This collector does NOT emit a System2 Decision Clock factor.

Every result is explicitly:
- `pointInTimeDecisionEligible=false`;
- `promotionGradeProspectiveDateCount=0`;
- `immutableD1WritePerformed=false`;
- `runFingerprintLinked=false`;
- `formalDecisionImpact=false`.

A successful artifact proves only:
"By this EOD observation time on this market date, the official monthly FMTQIK source contained these rows and bytes."

It does NOT prove:
- the source was available at V0.3 Decision Clock time;
- the same values were known at 13:25 / 14:xx;
- a strategy could have acted on them;
- D04 L3 promotion;
- any BUY / SELL / sizing / RR / stop rule.

## Cost/resource guard

Compared with the rejected piggyback/extra polling alternatives:
- no second long-running GitHub job;
- no Cloudflare Worker Cron;
- no D1;
- no R2;
- no Fugle entitlement;
- no paid provider;
- three official HTTP GETs per weekday only;
- GitHub artifact retention 90 days.

The artifact volume is expected to be small because FMTQIK monthly JSON is compact, but actual storage usage must be observed rather than assumed.

## Falsification / failure cases

The collector fails closed or records not-ready when:
- target market date is not in official FMTQIK;
- same-Taipei-date rule fails;
- HTTP fails;
- JSON/schema invalid;
- target close missing/non-numeric;
- duplicate official dates appear;
- fewer than 21 usable observed sessions exist;
- last 21 window does not end on marketDate.

No later retrieval may backfill a missed EOD observation and be relabeled as prospective.

## Activation boundary

Allowed now:
- implementation branch;
- deterministic tests;
- PR;
- CI / V8 regression;
- research documentation.

Not allowed without owner approval:
- merging the workflow to main;
- enabling the scheduled weekday run.

Even after owner approval and merge, D04 maturity remains unchanged until real independent EOD artifacts accumulate and their replay/coverage semantics are audited.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
