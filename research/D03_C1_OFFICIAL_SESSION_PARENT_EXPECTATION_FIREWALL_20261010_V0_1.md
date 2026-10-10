# D03 C1 Official-Session Parent-Expectation Firewall

Status: RESEARCH_ONLY / MACHINE_CONTRACT_PASS / PHYSICAL_PARENT_PENDING
Date: 2026-10-10 Asia/Taipei
Domain: D03 trend / momentum / reversal / technical indicators
Formal Core impact: NONE / LOCKED

## New evidence consumed

Main merge `1a0c5ae5125cf0089b0152d1485df00236a5dd49` adds a source-authenticated official-session gate before the scheduled System1 C1 evidence collector:

- the 00:10 Taipei collector evaluates the preceding Taipei calendar date;
- the production trading-calendar implementation determines whether that date is an official trading session;
- an official non-trading session is classified `OFFICIAL_NONTRADING_SESSION_SKIP_C1`;
- an official trading session is classified `OFFICIAL_TRADING_SESSION_COLLECT_C1`, but readiness remains unverified;
- invalid, mismatched, unknown, future, or same-day-unclosed dates fail closed;
- non-trading skip may not count as a zero-pick;
- public runtime GET evidence is explicitly insufficient for Formal/C1 acceptance.

The merged test contains two positive and eight negative contract cases. No physical ordinary-session C1 parent receipt is created by this merge.

## H1 — Parent expectation must be conditional on the official session calendar

Support: no Formal selection population should be expected on an official non-trading session. Treating a holiday as a missing parent creates a false missingness event and can bias coverage, opportunity-loss, and indicator-parent reconciliation.

Counterevidence: a calendar-eligible trading date still does not prove the Formal scan ran, completed, persisted, or produced a C1 generation.

Alternative explanation: a missing C1 on a trading date may reflect upstream scan failure, quality blocking, persistence failure, collector failure, or genuine zero selection. Calendar eligibility alone cannot distinguish them.

Failure conditions: calendar source unavailable, target/calendar mismatch, non-boolean trading status, invalid date, future or unclosed target, or using weekday arithmetic in place of the official calendar.

## H2 — Three parent-expectation states are required

1. `PARENT_NOT_EXPECTED_NONTRADING`: official non-trading session; skip without zero-pick or missing-data inference.
2. `PARENT_EXPECTED_UNVERIFIED`: official trading session; collector may proceed, but Formal scan, C1 generation, population and binding remain unverified.
3. `PARENT_VERIFIED`: immutable same-generation C1 receipt plus authoritative V8.20 Formal-to-C1 binding and physical business readback pass.

States are not interchangeable. State 1 is not a valid denominator date. State 2 belongs in the expected-date denominator but cannot enter D03-10 or outcome analysis until classified as verified, genuinely zero-pick, or upstream failure with evidence. State 3 alone can supply the D03 parent.

## H3 — D03 indicators must separate calendar finality from data finality

Support: D03-10 Bollinger requires a genuine parent and exact 20 eligible parent sessions. Official-calendar finality says whether a parent could be expected; it does not prove price-window completeness, reset lineage, parent-child identity or indicator computation.

Counterevidence: the calendar gate is still useful because it prevents holidays from contaminating missing-rate denominators and walk-forward date counts.

Failure conditions:

- including official non-trading dates in C1 coverage denominators;
- treating a skipped holiday as zero-pick;
- treating `proceed=true` as Formal scan confirmation;
- treating HTTP 200/public latest snapshot as C1 generation proof;
- treating historical manual reads as genuine prospective evidence;
- using a later successful parent to backfill an earlier absent parent.

## D03 module implications

- D03-10 Bollinger: parent-expectation semantics improve, but L2/40 remains. A physical immutable parent, V8.20 binding, W0 continuity and exact 20 eligible sessions remain missing.
- D03-09 ADX: unchanged; calendar eligibility cannot replace full replay or a replay-certified trusted state.
- D03-04 momentum continuation and D03-12 divergence: future outcome date denominators must exclude non-trading sessions and preserve the actual decision/confirmation clock.
- D03-13 multi-timeframe conflict: daily/weekly frame completion must use the official session calendar, not weekday counting.

## Bias and robustness audit

- PIT/look-ahead: future or same-day-unclosed targets fail closed; historical manual reads are not prospective receipts.
- Selection bias: removing official non-trading dates corrects denominator contamination but does not create selected populations.
- OOS/walk-forward: calendar classification alone is not a sample or outcome.
- Multiple testing/overfitting: no indicator parameter or threshold is searched.
- Redundancy: the gate is temporal provenance, not a new price-information root.
- Date clustering: unchanged.
- Costs/fillability/limits/halts/ex-rights/market regime: UNKNOWN and unaffected.

## Current verdict

- official-session machine contract: PASS
- real official-session collector receipt from this merge: absent
- genuine C1 parent: absent
- non-trading date zero-pick interpretation: prohibited
- public runtime as Formal/C1 evidence: prohibited
- D03 maturity: 56.7%, unchanged
- outcomes: closed
- Formal Core: locked

## Exact next continuation point

On the next ordinary Taiwan trading session, require a physical official-calendar receipt followed by the genuine immutable C1 receipt and authoritative V8.20 binding. If the date is non-trading, record PARENT_NOT_EXPECTED_NONTRADING and exclude it from the parent denominator. If trading but C1 is absent, retain PARENT_EXPECTED_UNVERIFIED until evidence distinguishes upstream failure from genuine zero-pick. Only PARENT_VERIFIED may enter D03-10 parent reconciliation. In parallel, the Hot D1 36-key Scout and W0 continuity remain separate prerequisites.
