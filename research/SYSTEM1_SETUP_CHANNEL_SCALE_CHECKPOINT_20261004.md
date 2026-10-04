# System 1 A/B setup channel scale audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_PENDING / FORMAL_CORE_LOCKED

## Why this matters

System 1 uses different formulas for A pullback and B breakout setup quality, but both feed:
- one common B-grade minimum of 65;
- the same 28% PriorityScore component;
- the same later setupQuality comparator.

The frozen structural contract already proves the score scales are not automatically comparable:

- A qualifying theoretical setupQuality range: 38 to 82.
- B qualifying theoretical setupQuality range: 69.65 to 100.
- Therefore a valid B setup necessarily exceeds the current grade-65 threshold under the current formula.
- A valid A setup does not necessarily exceed grade 65.

So the common FINAL_SIGNAL_GRADE is structurally capable of acting as an additional A-channel filter while being redundant for valid B setups. This is a scale/semantics asymmetry, not evidence that the threshold is economically wrong.

Parent structural artifact:
`research/setup_quality_channel_falsification_v0_1.json`.

## Implementation

Pure Class-A module:
`research/system1_setup_channel_scale_audit_v0_1.mjs`.

Daily collector output:
`setupChannelScale` inside the existing C1 evidence artifact.

No extra HTTP call, provider call, schedule, Worker hook, D1 schema or Production write is introduced.

The audit uses only the already immutable C1 fields:
- derived A/B pass state;
- derived channel;
- derived setupQuality;
- stored Formal qualified/selected flags;
- price pool context.

## Daily outputs

For A and B separately:
- channelFormedN;
- setupQuality known / UNKNOWN counts;
- gradePassN / gradeFailN at the existing 65 threshold;
- gradeFailRate;
- Formal qualified count;
- Formal selected count;
- setupQuality min/max/mean/median;
- qualified/selected score summaries.

B additionally reports:
- number of B setups above A's theoretical maximum of 82;
- selected B names above A's theoretical maximum.

The audit also reports the raw B-minus-A setupQuality median gap descriptively when both channels are observed.

## Invariants / fail-closed checks

- A.pass and B.pass must not both be true under current definitions.
- derived channel must match the setup pass state.
- observed A setupQuality must remain inside 38..82 when known.
- observed B setupQuality must remain inside 69.65..100 when known.
- missing setupQuality remains UNKNOWN; it is never converted to zero or FAIL.

Invariant violations mark this side-study `DATA_QUALITY_BLOCKED`; they do not alter Formal execution.

## Important limitation retained

The current immutable C1 projection does not preserve the raw A/B setup metrics needed to inspect the A-volume 0.90/0.91 discontinuity directly:
- pullbackPct;
- supportDistancePct;
- volumeTodayVsPrev5;
- dailyClosePosition;
- dailyUpperShadowRatio.

Therefore V0.1 does **not** fabricate these fields and does not request a runtime expansion.

The existing structural artifact remains the authority for the mathematical 0.90/0.91 cliff. A future raw-field capture extension, if economically justified, would require separate governance review.

## Interpretation

The following are explicitly forbidden conclusions from this audit alone:

- A should receive a lower grade threshold;
- B should be penalized or normalized;
- setupQuality should be removed;
- channel quotas should be introduced;
- a higher candidate count is better;
- observed score differences prove outcome superiority.

Required future evidence:
- prospective independent dates;
- within-channel setupQuality vs D1/D3/D5/MFE/MAE/stop-first;
- matched cross-channel controls;
- pool/sector/liquidity/RR/regime controls;
- costs/fill feasibility;
- purged/OOS/date-cluster validation.

Only after those gates may any formula, threshold, weight or normalization become a Class-C proposal.

## Formal boundary

No Formal A/B definition, grade threshold, PriorityScore weight, comparator, 3+3/Top6, capital, signal, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. On the first genuine V8.17+ C1 generation, inspect A/B channel counts and grade exposure from the automatic artifact.
3. Accumulate independent dates before any cross-channel calibration claim.
4. If A grade-fail incidence is materially non-zero prospectively, join future outcomes before considering whether the common 65 threshold is economically over-restrictive.
5. If B setupQuality ever violates its theoretical floor or A/B mutual exclusivity fails, treat it as data/definition regression, not market evidence.
