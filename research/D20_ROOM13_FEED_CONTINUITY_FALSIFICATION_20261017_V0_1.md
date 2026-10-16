# D20 Room13 | 2026-10-17 01:10 prospective-source gap and finite-window continuity falsification

Status: RESEARCH_ONLY / SOURCE_BLOCKED / NO_PROMOTION
Main readback before work: `5c6408490d8b06348add96c378f48897f5c97661`
Canonical tracker at read: D20=58.5%, 13 modules (12 L3, 1 L2); overall=47.9%, 356 modules.

## 01:10 source attempt
The actually executed Room13 scheduled run attempted `https://www.ptt.cc/atom/Stock.xml` at the fixed 01:10 Taipei slot. Native web read returned INACCESSIBLE. The connected Firecrawl credit balance was -1000, so no paid fetch was attempted. Raw immutable source body, article IDs, content fingerprint and source freshness were not obtained. New eligible L4 primary social parent count is **zero receipts**, NOT zero posts. Actual article count and interval completeness remain UNKNOWN. The prior 2026-10-16 20:10 report is an unmerged local process artifact, not a canonical immutable parent.

## New falsification: stable ID overlap is necessary but not sufficient for interval completeness
The frozen `research/d20_social_sampling_coverage_contract_v0_1.json` requires at least one stable article ID overlap between adjacent primary snapshots or independently frozen continuity evidence. This is a useful truncation diagnostic, but alone does not prove complete intervening post coverage.

Construct two synthetic worlds with identical endpoint observations: both 17-entry feed windows share one stable ID. World A has no unseen intermediate post; World B contains a post created and removed between snapshots. The endpoints and overlap are identical, while the complete event histories differ. Likewise, identical IDs at both endpoints cannot exclude an intermediate edit/reversion. Thus `overlap>0` must not be promoted to `completeInterval=true` without origin guarantees or independent immutable archival evidence.

Observable proxy: snapshot ID intersection, capturedAt, first-observed times, immutable source-body hashes, version chain. Support mechanism: overlap narrows some window-truncation risk. Structural alternatives: deletion, hidden entries, cache, reordering, ephemeral edits, producer latency. Falsification/exit: source-guaranteed monotone append-only full ID history, or independently replayable archive of all events with timestamps. Until then: INTERVAL_COMPLETENESS=UNKNOWN. This is a research-only proposed strengthening; frozen contracts are not modified.

## Bias and formal boundaries
PIT firstKnownAt is capture-time only; no historical source availability backfill. OOS and walk-forward absent. Finite feed introduces selection and survivorship bias. No post-outcome selection, parameter mining, multiple-testing promotion, model fitting or historical Shadow creation. The same primitive cannot vote independently for D20-03/06/07/11. Trading cost and market-regime effects UNKNOWN. Forum account identity is not brokerage investor identity. No psychological inference from prices, volumes or single posts. Formal Core LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE=NONE`.

## Reproducibility
19 synthetic cases passed in a local research-only oracle; these are NOT 19 market observations. Full local evidence: `d20_room13_20261017_0105_audit.json`, `d20_room13_20261017_0105_window_identifiability_oracle.py` and manifest. These local files are not claimed as merged repository artifacts.

## Exact next continuation
At the next actually executed fixed :10 slot, attempt immutable source capture and source freshness, then compare stable IDs and interval completeness. Keep missed intervals UNKNOWN. On the next genuine Taiwan trading day, D20-13 may attempt the frozen official TWSE 09:15/12:00/15:20 ±5-minute windows. No retroactive Shadow, no Formal modification.
