# D03 post-facto indicator clock firewall

## Physical increment consumed

System2 DATA_LANE run 37878847039 / job 113653590991 physically captured 12 of 12 canonical TWSE and TPEx official source-date receipts for six completed sessions from 2026-10-01 through 2026-10-08. The receipt contains 6,518 TWSE and 5,325 TPEx ordinary stock-date rows, 11,843 combined, with payload-date identity and normalized bar hashes.

This is valuable source-existence and deterministic mechanism-replay evidence. Every receipt is explicitly marked POST_FACTO_SOURCE_OBSERVATION_NOT_ORIGINAL_FIRST_KNOWN.

## Central falsification

Later retrieval of a historical bar proves that the source can return the bar later. It does not prove that the exact bytes, version or normalized row were known and available by the historical decision cutoff.

The following substitutions are prohibited:

- source receipt count -> historical PIT availability;
- source key count -> Hot D1 presence;
- later Hot D1 repair -> original firstKnownAt;
- current storage equality -> no historical revision;
- six adjacent dates -> OOS or walk-forward evidence;
- source availability -> technical continuity;
- successful indicator recomputation -> lawful outcome join.

## Three separate clocks

1. Market-data clock: the date represented by the bar.
2. Observation clock: when the exact source version was physically captured.
3. Decision clock: the latest information legally available to the model or strategy.

Market date equality does not collapse the observation and decision clocks. Backfilling observedAt or firstKnownAt to the bar date is a hard failure.

## Executable admission stages

The 20-case oracle freezes four cumulative stages:

1. POST_FACTO_SOURCE_ONLY: exact source receipts and hashes permit outcome-blind indicator mechanics/replay diagnostics only.
2. PIT_INPUT_READY: additionally requires a non-post-facto causal availability receipt and certified exact symbol sessions.
3. W0_READY: additionally requires corporate-action ancestry, halt/no-event certification, identity-transition disposition and continuity-receipt hash binding.
4. OUTCOME_JOIN_READY: additionally requires a genuine immutable parent, complete population denominator and bound cost/fillability assumptions.

Hot D1 census completion does not change the epistemic clock. A D1 value mismatch or RAW multiversion becomes STORAGE_CONFLICT rather than permission to choose a favorable row.

## Current D03 disposition

Current state is POST_FACTO_SOURCE_ONLY. Mechanism replay is permitted; PIT admission, W0, parent-bound indicator inference and outcome joins remain false.

This does not change D03-09 or D03-10 level. It does not establish alpha, OOS, walk-forward, selection-bias control, multiple-testing control, cost, fillability or market-state robustness. D03 remains 56.7%. Formal Core remains LOCKED and FORMAL_OPTIMIZATION_CANDIDATE is NONE.
