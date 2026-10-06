# SDA-009 D09 Deep Falsification V0.2

Status: DEEP_FALSIFICATION_COMPLETE / CURRENT_PATH_INVENTORY_CORRECTED / ENGINEERING_DELTA_REFINED / FORMAL_CORE_UNCHANGED

Owner room: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`
Observed main: `af7921f3d7e754b2e9c1ea83212a437d2dea18cd`
Date: 2026-10-06 Asia/Taipei

## 1. Corrected current-path inventory

Latest-main Worker readback changes the earlier three-path description.

### Active path A — sector hard gate
ACTIVE / FIRST-ORDER

A candidate contributes to the same inclusive sector:
- breadth;
- average daily change;
- amount-vs-20-day-average.

The candidate is then evaluated against:
- breadth >= 40;
- avgChange >= -1;
- amountVs20DayAverage >= 0.5.

This is the strongest current circularity path because self-contribution can change candidate eligibility before ranking.

### Active path B — selection ordering through sector score
ACTIVE / CONDITIONAL

`sector.score` contributes 14% to rounded `priorityScore`.

The initial selection comparator is:
1. rewardPerRisk;
2. priorityScore;
3. setupQuality;
4. sectorFlow;
5. relativeStrength.

Therefore the sector component does not dominate ordering whenever rewardPerRisk differs. The earlier wording "sector score materially inflates rank" must be treated as a hypothesis, not a general current fact.

However sector score has two ordering entries:
- inside priorityScore;
- again as direct `sectorFlow` tie-break.

This is structural double-layer influence, but practical rank impact is conditional on earlier comparator ties.

### Active path C — capital allocation
ACTIVE / FIRST-ORDER AFTER SELECTION

After the independent 3+3 pool selections are merged, capital allocation is calculated from the selected candidates' rounded priorityScore values:

`rawRatio_i = deployRatio × priorityScore_i / Σ(priorityScore_selected)`

with:
- selected=1 => deployRatio 0.35;
- selected=2 => 0.60;
- selected>=3 => 0.85;
- per-name cap = 0.35;
- monetary allocation floored to NT$1,000 units.

Therefore candidate self-contribution to sector score can alter capital allocation even when selection rank does not change.

This creates cross-candidate and cross-pool spillover:
- one candidate's self-inflated priorityScore raises the shared denominator;
- other selected names can receive less capital;
- GENERAL and THOUSAND pools have independent seats but share the post-selection capital denominator.

When a candidate is already capped at 35%, further self-inflation may leave its own allocation unchanged while still reducing other names' allocations and increasing residual cash.

This is a previously under-specified SDA-009 path and must enter diagnostics.

### Legacy path D — sector-score warmup priority
NOT ACTIVE IN CURRENT AFTER-MARKET PATH

The helper `chooseHistoryWarmupTargets` and `coarseWarmupScore` still exist, and the latter contains a sector-score bonus.

However latest-main readback shows:
- no call site for `chooseHistoryWarmupTargets`;
- current 18:10 path sets `warmupTargets = []`;
- current history acquisition is delegated to seed-lite;
- `buildHistorySeedQueue` ranks by current-symbol bonus, trade amount, volume and daily change, not sector score.

Therefore the prior statement "history warmup priority is a confirmed current circularity path" is too strong.

Correct status:
`LEGACY_OR_DORMANT_PATH / NOT_CURRENT_PRODUCTION_EVIDENCE`.

If later reactivated, it must inherit SDA-009 exclusion safeguards. It must not be counted as current impact now.

### Downstream path E — monitor-card ordering
ACTIVE / DISPLAY-SALIENCE ONLY

Monitoring card sort uses signal/action state, then signal level, then priorityScore, rewardRisk, sectorFlow and relativeStrength.

This may change presentation/attention ordering but does not establish a Formal selection change. Treat separately from selection Alpha.

## 2. Directional symmetry: self-promotion and self-suppression

SDA-009 must not assume self-inclusion only rewards a candidate.

A candidate can:
- promote itself through the sector gate;
- suppress itself through the sector gate;
- improve or worsen its own sector score;
- improve or worsen its own allocation;
- move other candidates' allocations in the opposite direction.

Diagnostics must preserve direction:
- `SELF_PROMOTION`;
- `SELF_SUPPRESSION`;
- `MIXED`;
- `NONE`;
- `BLOCKED`.

## 3. Breadth exact sensitivity

Let:
- n = inclusive sector member count;
- k = inclusive positive-return member count;
- p = 1 if candidate is positive, else 0.

Inclusive breadth:
`B = 100 × k/n`.

Leave-one-out breadth:
`B_loo = 100 × (k-p)/(n-1)`.

If candidate is positive:
`B - B_loo = 100 × (n-k)/(n(n-1))`.

If candidate is non-positive:
`B - B_loo = -100 × k/(n(n-1))`.

At the 40% gate, exact single-candidate flip examples include:
- n=2: positive candidate 50% -> 0%;
- n=3: non-positive candidate 33.33% -> 50%;
- n=4: positive candidate 50% -> 33.33%;
- n=5: positive candidate 40% -> 25%;
- n=6: non-positive candidate 33.33% -> 40%;
- n=10: positive candidate 40% -> 33.33%;
- n=20: positive candidate 40% -> 36.84%.

Conclusion:
the 40% breadth threshold has discrete small-N sensitivity by construction. Sector-size stratification is mandatory in D16 readback.

## 4. Average-change exact sensitivity

Let peer mean daily change excluding candidate be `mu_peer`, candidate daily change be `x`, and inclusive member count be n.

Inclusive mean:
`mu_inc = (x + (n-1)mu_peer)/n`.

Difference:
`mu_inc - mu_peer = (x - mu_peer)/n`.

At the -1% gate:
- self-promotion occurs when peers are below -1% but candidate is strong enough to pull inclusive mean to >= -1%;
- self-suppression occurs when peers are >= -1% but candidate is weak enough to pull inclusive mean below -1%.

Sensitivity decays as 1/n but can remain large in concentrated/small sectors.

## 5. Activity-ratio exact sensitivity

For history-ready peers:
- peer current amount = A;
- peer 20-day average amount = H;
- candidate current amount = c;
- candidate 20-day average amount = h.

Inclusive activity:
`R_inc = (A+c)/(H+h)`.

Leave-one-out:
`R_loo = A/H`.

At threshold 0.5, candidate promotes the sector when:
`c - 0.5h >= 0.5H - A`.

Candidate suppresses the sector when the inequality reverses while peers alone pass.

This proves that the activity gate is not only a high-turnover boost. A low-current-activity candidate can mechanically suppress itself.

## 6. Sector-score decomposition

Current score:
`S = clamp(45×amount/maxAmount + 0.3×breadth + clamp(5×avgChange+15,0,25),0,100)`.

Required attribution must split:

### Local constituent effect
Hold the inclusive cross-sector maxAmount fixed and remove candidate from:
- own-sector amount;
- breadth;
- avgChange.

This identifies direct local self-contribution.

### Normalizer externality
Then recompute candidate-specific maxAmount across sectors after removal.

Difference between:
- leave-one-out with frozen maxAmount;
- leave-one-out with recomputed maxAmount

is the cross-sector normalizer effect.

Without both states, attribution can confuse direct candidate contribution with denominator switching.

## 7. Rank sensitivity must respect comparator precedence

Because `rewardPerRisk` is comparator #1, a score-only self effect cannot change initial rank unless earlier comparator values permit it.

Each rank diagnostic must retain:
- raw rewardPerRisk;
- leave-one-out rewardPerRisk (expected unchanged);
- rrTieAgainstAdjacent;
- raw priorityScore;
- leave-one-out priorityScore;
- setupQuality;
- sectorFlow;
- adjacent-comparator reason.

A reported rank flip without comparator attribution is incomplete.

## 8. 3+3 pool semantics

Selection is not a generic global Top6.

Formal seats are:
- GENERAL pool: max 3;
- THOUSAND pool: max 3;
- no cross-pool seat filling.

Therefore SDA-009 receipts must bind:
- `poolId = GENERAL | THOUSAND`;
- rawPoolRank;
- leaveOneOutPoolRank;
- rawPoolTop3;
- leaveOneOutPoolTop3;
- finalUnionSelected.

A generic Top6 flag alone can conceal an invalid cross-pool comparison.

## 9. Capital-allocation circularity

For selected candidate i before the 35% cap:
`w_i = D p_i/P`,
where D is deployRatio, `p_i` is priorityScore and `P=Σp`.

Sensitivity to candidate's own score:
`dw_i/dp_i = D(P-p_i)/P^2 > 0`.

For another selected candidate j:
`dw_j/dp_i = -D p_j/P^2 < 0`.

Thus one stock's self-score mechanically redistributes capital away from peers.

Special cases:
- one selected name: deployRatio=35% and cap=35%; score changes do not change allocation;
- two or more selected names: score changes can alter allocation;
- if candidate is capped at 35%, further score inflation can still reduce peer allocations because P rises, even when candidate allocation is fixed;
- NT$1,000 flooring creates discrete allocation jumps.

Required diagnostics:
- raw allocation ratio/NTD;
- leave-one-out diagnostic allocation ratio/NTD;
- per-peer allocation deltas;
- residual-cash delta;
- cap-binding state;
- rounding/flooring state.

No economic conclusion follows from mechanical capital movement alone.

## 10. Classification and regime sensitivity

External literature does not justify a universal positive industry-momentum sign.

Evidence relevant to falsification:
- Taiwan momentum can be positive during market-state continuation and reverse during transitions;
- Taiwan winner/loser persistence materially changes momentum outcomes;
- industry-momentum results can change or reverse under different classification granularity.

Therefore D16 validation must stratify or control for:
- classification scheme/version;
- sector member count/concentration;
- market-state continuation vs transition where preregistered and PIT-valid;
- persistent vs nonpersistent own-stock momentum where applicable.

These are sensitivity/control dimensions, not extra Alpha votes.

## 11. Revised engineering minimum

System 1 diagnostic must now include:
- current active path A gate diagnostics;
- current active path B rank/comparator diagnostics;
- current active path C allocation diagnostics;
- pool-specific 3+3 identity;
- promotion/suppression direction;
- local self-effect vs max-normalizer externality;
- dormant warmup path marked NOT_ACTIVE rather than implemented as if current.

Formal Core remains unchanged.

## 12. Maturity decision

No D09 maturity promotion.

Reason:
this round materially improves falsification, causal-path accuracy and diagnostic design, but produces no genuine Taiwan candidate-level leave-one-out receipt and no D16 outcome evidence.

## Exact next

`SDA-009-R3A`: System 1 implements corrected Class-A diagnostic fields under the V0.2 handoff.

`SDA-009-R3B`: first genuine receipt is evaluated on common support with:
- gate direction;
- pool-specific seat flip;
- comparator-attributed rank flip;
- allocation redistribution;
- normalizer externality;
- blocked/UNKNOWN retention.

Then D16 evaluates economic incrementality under preregistered classification/sector-size/state controls.
