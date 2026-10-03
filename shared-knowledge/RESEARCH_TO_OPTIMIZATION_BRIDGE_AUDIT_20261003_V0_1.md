# Research-to-Optimization Bridge Audit 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: BRIDGE_GAP_AUDIT_COMPLETE / NO_UNSURFACED_READY_CANDIDATE_FOUND
Scope: canonical research tracker + explicit optimization-bridge lanes + repository-wide FORMAL_OPTIMIZATION_CANDIDATE search
Formal Core impact: NONE

## Purpose

Audit whether research that is already evidence-ready has failed to surface a Formal optimization candidate, and detect the opposite error: research being treated as optimization-ready before it passes the existing research gates.

Canonical governance requires a candidate to cover, where applicable:
- positive mechanism/evidence;
- explicit counterevidence and alternative mechanisms;
- PIT/no-look-ahead;
- Prospective Shadow/OOS or justified holdout;
- independent-date/date-cluster robustness;
- market/regime/industry concentration;
- redundancy/incremental value over existing Formal controls;
- transaction cost/slippage;
- candidate coverage/zero-pick;
- source/UNKNOWN semantics;
- overfit/multiple-testing controls.

## Executive result

### 1. Existing Formal optimization candidate
There remains **one canonical candidate lineage**:

**HISTORY_SOURCE_REVALIDATION_V2.3**
- classification: FORMAL_OPTIMIZATION_CANDIDATE;
- owner approved;
- merged/deployed;
- operational follow-up remains live-day verification rather than a new research candidate.

This is not an unsurfaced bridge gap.

### 2. Unsurfaced evidence-ready candidates
**NONE FOUND.**

No current research lane was found that simultaneously:
1. claims all applicable bridge gates are passed;
2. has an evidence-backed proposed Formal behavior change;
3. is absent from the candidate registry.

Therefore this audit does **not** manufacture a new optimization candidate merely from maturity level or research volume.

### 3. Mature validation infrastructure is not Alpha
The only curriculum modules currently at L4/80% are D16 validation/governance modules:
D16-01, D16-02, D16-03, D16-04, D16-05, D16-06, D16-07, D16-09, D16-12 and D16-15.

Their maturity means the validation methods/governance are mature.
It does **not** mean they should become stock-selection features.

The recently merged System1 evidence-automation research layer is likewise evidence infrastructure. Better evidence capture can enable later optimization research but is not itself a Formal stock-selection optimization candidate.

## Bridge watchlist — plausible future candidates, currently blocked

| ID | Lane | Current bridge state | Main missing gate |
|---|---|---|---|
| AF | Base Admission Funnel | FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY | Reason-stratified prospective rejected-control cohort, execution/risk controls, independent dates, size/price/regime strata, downside/cost/coverage safety. |
| LQ | Liquidity Admission | EVIDENCE_GAP_CAPTURE_CANDIDATE / NOT_FORMAL_OPTIMIZATION_CANDIDATE | Prospective rejected-control opportunity-cost evidence after execution cost, spread/depth, risk and coverage controls. |
| MCAP | Market Cap Admission | NOT_FORMAL_OPTIMIZATION_CANDIDATE | Prospective counterfactual evidence that changing market-cap admission improves opportunity capture without risk/cost deterioration. |
| TRR | Target / Resistance / RR | STRUCTURAL_PROVENANCE_RISK_CONFIRMED / NOT_FORMAL_OPTIMIZATION_CANDIDATE | Structural provenance/replay quality must be solved before outcome inference. |
| VAL | Valuation | FALSIFICATION_IN_PROGRESS / PIT_COHORT_AUDIT_REQUIRED / NOT_OPTIMIZATION_READY | PIT cohort audit and outcome join remain incomplete; several valuation sublanes are shadow/spec only. |
| VR | Volatility Regime | FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY | Prospective capture, historical vintage, independent-date, crisis-removal, redundancy and OOS evidence remain incomplete. |
| TMR | Trend / Momentum / Reversal | NOT_OPTIMIZATION_READY | Prospective transition-state evidence and incremental value beyond current lateStage/overheat/momentum controls remain missing. |
| IC | Institutional / Crowding | FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY | Prospective PIT/source parity, passive-flow separation, redundancy, independent dates, costs and actor/state incrementality. |
| FD | Fundamental Information Dynamics | SHADOW_SPEC_FROZEN / OUTCOME_JOIN_LOCKED / NOT_FORMAL_OPTIMIZATION_CANDIDATE | Outcome join and prospective official-vintage evidence remain locked. |
| MC | Macro / Cross-market | FALSIFICATION_IN_PROGRESS / DATA_QUALITY_BLOCKED / NOT_OPTIMIZATION_READY | Prospective source receipts, source entitlement/quality, Taiwan/sector controls, non-crisis independent dates and residual incrementality. |
| EA | Execution Alpha | FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY | Need counterfactual execution evidence showing a specific entry-gate relaxation improves net opportunity after missed-upside, costs and strategy/regime controls. |
| PV | Price / Volume | OUTCOMES_CLOSED / NO_FORMAL_OPTIMIZATION_CANDIDATE | Clean prospective cohorts and Gate-7 outcome maturity remain absent; price+volume must beat price-only baseline on common support. |
| D16-25 | Probabilistic Decision / Uncertainty-aware Selection | L2_CLOSED / READY_FOR_D15_19_SPECIALIST_COMPARISON / NOT_OPTIMIZATION_READY | Real Taiwan PIT calibration population, frozen predictions, matured outcome joins, calibration/utility/coverage evidence; D15-19 specialist comparison still required. |

## Current anti-premature-promotion findings

### D02-07 OBV
Status after specialist return:
`OBSERVATION_ONLY / COMPARATOR_ONLY / MERGE_CANDIDATE_PENDING_INCREMENTAL_TEST`.

It cannot be PRIMARY_ALPHA or a Hard Gate from the current evidence.
A residual common-support OOS/prospective test remains required.

### D02-08 accumulation/distribution proxy
Status:
`STRONG_MERGE_CANDIDATE_IF_STANDALONE_REMAINS_OHLCV_ONLY`.

OHLCV transforms do not identify hidden actor intent.
Without an independent microstructure observable family, it should move toward curriculum consolidation rather than optimization promotion.

### H20 breakout family
D02-03 specialist return explicitly reports:
`FORMAL_OPTIMIZATION_CANDIDATE: NONE`.

Current evidence freezes one breakout event receipt and an incremental test design.
Rooms 01 and 04 still need to return their counterpart evidence, and clean prospective residual outcomes remain missing.

## Bridge leakage audit

The following mistakes are now explicitly prohibited:

1. **Maturity leakage**
   - L3/L4 curriculum maturity != optimization readiness.

2. **Infrastructure leakage**
   - source QA, replay, calibration, experiment registry and evidence automation != Alpha.

3. **Shadow-spec leakage**
   - a complete Shadow specification != positive outcome evidence.

4. **Mechanism leakage**
   - plausible mechanism + counterexample design != incremental predictive value.

5. **Coverage-pressure leakage**
   - zero picks, idle cash or a small candidate set do not justify gate relaxation by themselves.

6. **Complexity leakage**
   - a more complex model, factor, indicator or Bayesian layer is not a candidate unless it beats a simpler baseline.

7. **Duplicate-vote leakage**
   - downstream transformations of one primitive receipt cannot create multiple candidate benefits.

## Bridge status vocabulary

Each research lane must use exactly one control-plane state:

- `DISCOVERY`
- `FALSIFICATION_IN_PROGRESS`
- `EVIDENCE_READY`
- `FORMAL_OPTIMIZATION_CANDIDATE`
- `REJECTED_OR_REDUNDANT`

Additional operational labels may be appended, but they may not replace these five bridge states.

## Evidence-ready firewall

A lane may enter `EVIDENCE_READY` only if:
- its own applicable evidence gates are explicitly closed as PASS;
- unresolved source/PIT/outcome issues are not material to the proposed change;
- the proposed effect is incremental over the current Formal baseline;
- costs/coverage/zero-pick and failure modes are quantified where actionable;
- no unresolved dependency can reverse the proposed conclusion.

Only after EVIDENCE_READY may 00｜研究總控室 ask whether the finding deserves a `FORMAL_OPTIMIZATION_CANDIDATE` handoff.

## Current bridge queue

- Existing candidate/deployed lineage: **1**.
- New unsurfaced ready candidates discovered: **0**.
- Explicit blocked/watchlist lanes: **13**.
- D02 anti-premature-promotion items recorded: D02-07, D02-08, H20.
- Formal Core changes authorized by this audit: **0**.

## Next control-plane action

Do not create new Formal candidates yet.

Continue:
1. specialist intake for H01-H20;
2. prospective/OOS outcome collection in the watchlist lanes;
3. System1 A2/Baseline and System2 strategy-specific Shadow comparisons;
4. automatic re-audit when a lane first becomes `EVIDENCE_READY`.

When a lane first becomes EVIDENCE_READY, 00 must immediately produce an auditable candidate handoff or explicitly classify it REJECTED_OR_REDUNDANT; it must not silently remain in research.
