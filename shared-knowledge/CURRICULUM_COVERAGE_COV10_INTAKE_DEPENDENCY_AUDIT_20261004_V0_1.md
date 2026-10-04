# COV-10 Intake + Dependency Audit 2026-10-04 V0.1

Status: OWNER_APPROVAL_REQUIRED
Audit base main: `95a1fa11a1ca39a5318f53add59b3e26df9483be`
Candidate: COV-10 — Belief Updating Biases / Confirmation–Perseverance–Conservatism
Specialist return: `research/COV10_D20_SPECIALIST_RETURN_V0_1.md`
Terminal specialist recommendation: `ADD_MODULE`
Formal Core impact: NONE

## Intake result

PASS.

The return defines a measurable non-price object:
prior belief → new information → congruence/conflict → exposure evidence → post-information belief update.

It explicitly preserves UNKNOWN when exposure, prior belief, signal direction or update baseline is not observable.

Taiwan feasibility is prospective and source-bounded, not a fabricated historical psychology panel.

## Gap / overlap audit

### D20-03 Overconfidence
Owns explicit confidence/calibration.
It does not own asymmetric updating conditional on new evidence.

### D20-04 Anchoring
Owns reference-point dependence.
A sticky reference point is not sufficient to identify evidence-conditioned belief updating.

### D20-05 Representativeness / Recency
Owns formation/weighting around recent patterns or salient samples.
It does not own prior-belief × new-signal × exposure × revision sequence.

### D20-06 Herding / Social Proof
Owns cross-actor convergence/social-herding.
Belief updating is within a frozen prior/new-information sequence and may diverge from cross-actor convergence.

### D20-07 Attention
Owns whether information becomes salient/observable.
Exposure is a prerequisite/control for COV-10, not the same object.

### D20-08 Underreaction / Post-event Drift
Owns price-path underreaction/drift.
Price drift alone cannot prove conservatism or belief perseverance.

### D20-11 Narrative Diffusion
Owns cross-article/account topic/phrase/stance diffusion.
The same social source may be reused only through child transforms.

### D20-12 Behavioral-vs-Structural Falsification
Owns the falsification framework.
It does not own the target belief-update hypothesis.

Result:
`PASS_TRUE_OWNER_GAP`.

No existing D20 module fully owns the complete observable update sequence.

## Proposed new owner

`D20-14｜Belief Updating Biases / Confirmation–Perseverance–Conservatism（信念更新偏誤／確認偏誤－信念固著－保守更新）`

One umbrella module only.
Do not split confirmation bias, belief perseverance and conservatism into three modules.

Primary role:
`VALIDATION`.

Secondary:
`EXPLANATORY / CONTEXT`.

Initial independent directional vote:
`NOT_AUTHORIZED`.

## Dependency audit

Required parent receipts:
- D20-03 explicit confidence when used as prior-strength context;
- D20-06 social-source actor/stance evidence when used;
- D20-07 attention/exposure evidence;
- D20-08 event/price-path context;
- D20-11 narrative/social-source version lineage;
- D20-12 structural falsification controls;
- D11/D17 official event clocks.

COV-10 is a child behavioral transform over those parents, not a duplicate raw-data owner.

Result:
`PASS_BELIEF_UPDATE_CHILD_TRANSFORM_GRAPH`.

## Anti-double-count

1. confirmation bias / perseverance / conservatism are one belief-update family, not three votes;
2. same PTT/social receipt referenced by D20-06/11/07 cannot become multiple independent votes;
3. official event receipt remains owned by D11/D17/D20-08;
4. absence of exposure cannot be counted as both attention failure and confirmation bias;
5. price underreaction/reversal without a belief-update sequence remains outside D20-14;
6. D20-03 confidence may be context but cannot be rescored as another belief-update vote.

Result:
`PASS_ONE_BELIEF_UPDATE_FAMILY_ONE_VOTE_MAX`.

## Anti-orphan

Adding D20-14 does not orphan:
- confidence calibration;
- anchoring;
- recency/representativeness;
- social herding;
- attention;
- post-event drift;
- narrative diffusion;
- structural falsification.

Instead it fills the missing evidence-conditioned update sequence between exposure and later belief state.

Result:
`PASS_NO_ORPHAN`.

## Data / PIT firewall

Allowed initial replay:
prospective public-source stance/version chain + certified official event clock + exposure evidence.

Not proven:
- complete historical Taiwan analyst×firm×forecast-vintage public PIT panel;
- historical named-user psychology;
- effect size / alpha;
- independent directional value.

Named-user psychology/profiling is prohibited; only aggregate behavioral transition research is allowed.

## Maturity / structure

If approved:
- create D20-14 at L0/0%;
- module count would increase by 1;
- no maturity inheritance from existing L3 D20 modules;
- aggregate/domain maturity must be recomputed mechanically after insertion;
- no Formal/System1/System2/runtime change.

Current canonical state remains unchanged until approval.

## Recommended canonical action

`ADD_MODULE → D20-14 at L0/0%`

Current state:
`OWNER_APPROVAL_REQUIRED`.
