# System 1 C3/C4/C5 Shadow checkpoint — 2026-10-03

Status: CLASS-A ISOLATED SHADOW / PR #321 DRAFT / FORMAL CORE LOCKED / FIXTURE VERIFIED / LIVE PROSPECTIVE EVIDENCE PENDING
PR: https://github.com/imihan0630-sys/v7-fugle-worker/pull/321
Branch base: 9edc2969778380d9debb9a9ffb7482211d9bc207
Current validated PR head: 0e316477c9f5dd50058ab31301e4cc07aa5d29c1

This continues the owner-approved Hybrid Shadow execution in
`shared-knowledge/SYSTEM1_SELECTION_REDESIGN_GOVERNANCE_V0_1.md`.
It does not authorize any Formal selection, ranking, capital, entry, signal,
push, order or System2 change.

## C3 — entry timing experiment

File: `research/system1_c3_c4_c5_shadow_v0_1.mjs`.

The experiment accepts only a verified C2 paired ledger and explicit entry
receipts tied to the same C1 generation. Geometry must be authenticated and
known no later than C1 decisionAt. Future 15-minute bars must be completed,
strictly ordered and later than decisionAt.

Two preregistered Shadow alternatives are implemented:
- Setup A support revisit/reclaim: support-zone revisit within 1%, completed-bar
  reclaim, volumeRatio >= 0.8, depthScore >= 50, abs(gap) <= 3%, maxChase <= 2%,
  not limit-up, not late-stage, remaining RR >= 2.
- Setup B controlled no-retest continuation: no breakout-level revisit within
  0.2% tolerance, completed close acceptance >= breakout +0.2%, volumeRatio
  >=1.2, depthScore >=60, abs(gap)<=3%, maxChase<=2%, not limit-up, not
  late-stage, remaining RR>=2.

A trigger is never filled on the same bar close. The simulation uses the NEXT
completed bar open plus an explicit frozen slippage contract. If the next-bar
fill degrades RR below 2, the event becomes INVALIDATED_AT_FILL / NO_TRADE.
If stop and target are both touched inside one bar, STOP_FIRST_AMBIGUOUS is
used. Transaction assumptions must explicitly provide brokerFeeBpsPerSide,
sellTaxBps and slippageBpsPerSide; missing cost assumptions are rejected.

Formal baseline status is counted only when a verified receipt carries the same
generation/session and a knownAt later than decisionAt. Otherwise it is
UNKNOWN. Eligible C2 names that lack an entry receipt are explicitly listed as
missingEntryReceiptSymbols and are never converted into NO_TRIGGER.

No parameter above is claimed optimal. They are frozen V0.1 research
parameters to prevent post-outcome tuning. Economic superiority remains
UNKNOWN.

## C4 — capital allocation experiment

The identical candidate set is held fixed. Current Formal geometry is the
baseline:
- selected count deploy target: 1=35%, 2=60%, 3+=85%;
- per-name cap 35%;
- score-proportional priorityScore weighting;
- no redistribution of clipped Formal score weight;
- NT$1,000 plan allocation floor;
- 60/40 FIRST/ADD amount split represented in the plan geometry.

Two isolated comparators are added:
1. EQUAL_CAPITAL_SAME_DEPLOY_TARGET.
2. EQUAL_PLANNED_STOP_RISK_SAME_DEPLOY_TARGET.

Both retain the same total deploy target, per-name cap and NT$1,000 floor.
Capped alternative weights are redistributed only inside their own comparator.
Outputs include capital utilization, reserve versus nominal target, planned
stop-risk amount and risk HHI. No allocator is marked preferred and no
portfolio orders are produced.

## C5 — overfilter diagnostic

C5 requires matched C1 full-population diagnosis plus the same-session C2
ledger. It does not use firstFailure as causal attribution.

For SHORT and SWING separately, every observed gate is assigned one research
role:
- HARD_INVALIDATION,
- PRIMARY_ALPHA,
- SUPPORTIVE,
- CONTEXT_ONLY,
- CONFIDENCE_UNCERTAINTY.

SHORT keeps source/session/CA/execution/account safety plus price/history,
abnormality, liquidity and severe-event admission as hard safeguards. Slow
financial/ownership/valuation fields are separated into supportive/context or
uncertainty roles instead of being assumed hard solely because current Formal
is fail-fast. SWING keeps stronger slow-evidence roles as primary alpha.

C5 reports full failure overlap, UNKNOWN counts, role-level failure counts,
setup-not-ready, optional-only failure diagnostics, hard/primary failures and
safety-UNKNOWN conditional upper bounds. optionalOnlyFailN is explicitly a
diagnostic, never a candidate, WATCH or BUY count.

## Verification

Final PR-head checks:
- V8 Regression run 37061636731: PASS.
- V8 Repair CI run 37061636592: PASS.
- System1 isolated offline review run 37061636689: PASS.
- Dedicated C3/C4/C5 fixture test: 48 assertions PASS.
- Isolated review: 59/59 tests PASS.
- Test receipt: c3EntryShadow=true, c4AllocationShadow=true,
  c5Overfilter=true, prospectiveAlphaClaims=0, realOrders=0,
  formalCoreImpact=false, system2Touched=false.

An intermediate fixture-formatting commit produced a syntax-only CI failure;
it was fixed at 0e316477c9f5dd50058ab31301e4cc07aa5d29c1 and the exact final head
is green. No production action occurred.

## Evidence boundary

All C3/C4/C5 results today are synthetic contract tests. There is still no
genuine complete prospective C1/C2 market generation after the newly deployed
cross-midnight recovery repair. Therefore:
- no claim that no-retest continuation is better;
- no claim that equal/risk-aware sizing is better;
- no claim that any current Formal gate should be removed;
- no FORMAL_OPTIMIZATION_CANDIDATE;
- no retrospective WATCH fabrication.

Latest main advanced after branch creation only in governance/learning files
(`RESEARCH_ENGINEERING_GOVERNANCE.md`,
`research/stock_market_learning_tracker_v0_1.json`,
`shared-knowledge/CURRICULUM_RETIREMENT_AND_CAPABILITY_LEDGER_V0_1.md`) at
review time; there was no overlap with this branch's three implementation/test
files. Refresh main again before any future merge/update.

## Exact continuation

1. Keep PR #321 draft; do not merge solely because fixture CI passes.
2. On the first genuine complete C1/C2 session, preserve the exact generation
   and collect verified Formal baseline entry receipts plus complete 15-minute
   bars for all C2-eligible names. Missing receipts remain UNKNOWN.
3. Run C3 on the same names/date with the frozen cost contract and report
   trigger/no-trigger, next-bar fill/no-fill, invalidated-at-fill, stop-first,
   target and simulated after-cost outcomes.
4. Run C5 from the same C1/C2 denominator before changing any gate. Preserve
   positive and negative cases and measure firstFailure attribution bias.
5. Run C4 only on an identical frozen candidate set. Do not mix admission,
   ranking and sizing improvements in one comparison.
6. Accumulate prospective dates and apply the existing Formal-switch maturity
   gates before requesting any Class-C activation.
7. Any wiring into scheduled collection, D1/shared schema or production
   runtime is Class B. Any change to Formal A/B/ranking/3+3/capital/15m
   signal/push is Class C and requires separate explicit owner approval.

Rollback: close PR #321/delete branch. Production is unchanged.
