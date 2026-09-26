# PriorityScore Calibration Research

Updated: 2026-09-26
Status: FALSIFICATION_IN_PROGRESS / WAITING_PROSPECTIVE
Formal Core: LOCKED

## Research question

Does the existing Formal `priorityScore` contain incremental, monotonic information about forward outcomes that is strong enough to justify its current role in capital sizing after selection?

The pre-consensus base score weights are unchanged:
- setupQuality 28%
- sector score 14%
- institutional score 16%
- fundamental score 14%
- market-relative RS 14%
- RR component 14%

Production source-of-truth audit found an important post-baseline overlay from V7.5.30:
- market consensus requires at least 2 independent sources before adding a bonus;
- the bonus is capped at +7 points;
- the stored/ranked `priorityScore` is the base score after that consensus bonus is applied.

Actual Production ordering after the patch chain is:
1. post-consensus `priorityScore`
2. raw `rewardPerRisk`
3. `marketConsensusScore`
4. `setupQuality`
5. `sectorFlow`
6. `relativeStrength`

This corrects the earlier baseline-Worker reading that had RR first. The deploy patch chain, not root `Worker.js` alone, is authoritative for Formal runtime semantics.

## Positive hypothesis

Within the same scan date and comparable eligibility set, higher PIT `priorityScore` should show monotonic improvement in at least one economically useful dimension without worsening downside:
- forward return;
- MFE;
- MAE;
- stop-first rate;
- realized opportunity retention.

If higher score does not improve outcomes, or only works in one date/sector/regime, proportional sizing by score is not supported.

## Counterevidence / falsification

The study must explicitly test:
- flat, non-monotonic or inverted-U score/outcome relations;
- score effect disappearing after within-date de-meaning;
- rewardPerRisk dominating the apparent score effect;
- sector/regime concentration;
- component redundancy and double counting;
- higher scores producing worse MAE or stop-first rates;
- allocation caps/rounding erasing practical sizing differences;
- cost/slippage removing any apparent advantage;
- selection bias from observing only Formal winners.

## PIT audit completed 2026-09-26

Current selected Formal trade journal already persists:
- `priority_score`;
- `reward_risk`;
- `allocation_ratio`;
- `total_allocation`;
- plan identity and scan date.

However, the existing research snapshot builder did not persist `priorityScore` at all. Therefore Shadow `QUALIFIED_NOT_SELECTED`, `NEAR_MISS` and control snapshots could not provide PIT score observations.

This means historical score calibration using only existing selected rows would be selection-biased and is prohibited.

The current Shadow archive is also bounded, especially `QUALIFIED_NOT_SELECTED` sampling, so it is not a complete historical pool receipt. That limitation remains explicit.

## V8.13.0 Class-A provenance patch

V8.13.0 adds research-only prospective persistence inside existing research snapshots:
- post-consensus `priorityScore`;
- raw `rewardPerRisk`;
- rounded `rewardRisk`;
- `marketConsensusScore`;
- `marketConsensusSources`;
- `marketConsensusBonus`;
- `setupQuality`;
- `sectorFlow`;
- `relativeStrength`;
- frozen definition/comparator labels.

The base-score formula and the consensus overlay must be analyzed separately. A pretty final `priorityScore` result cannot be attributed to the 28/14/16/14/14/14 base weights unless the consensus contribution is controlled.

No Formal formula, ranking, threshold, quota, capital, BUY/ADD/REDUCE, monitoring, signal or push behavior is changed.

## Prospective analysis protocol

Primary unit: independent `scanDate`.

Do not recompute old PriorityScore with current code and call it historical PIT evidence.

First descriptive table requires at least 20 clean independent scan dates with field maturity and no provenance ambiguity. This does not satisfy the full Formal-promotion gate by itself.

Required comparisons:
1. within-date score rank vs forward D1/D3/D5 return;
2. score rank vs MFE / MAE / stop-first;
3. current score-proportional sizing vs equal-capital;
4. current score-proportional sizing vs equal-planned-stop-risk;
5. score effect controlling for raw rewardPerRisk and market-consensus contribution;
6. base-score components versus consensus bonus as separate explanatory layers;
7. date-cluster / leave-one-date-out stability;
8. sector and market-regime strata;
9. common-support and coverage loss;
10. transaction-cost sensitivity.

No threshold or weight tuning is allowed before the frozen comparisons are mature.

## Current conclusion

`PRIORITY_SCORE_CALIBRATION` is not optimization-ready.

Status:
`WAITING_PROSPECTIVE / NOT_OPTIMIZATION_READY`.

V8.13.0 improves evidence quality only. It does not assert that the present PriorityScore is good, bad, too strong or too weak.


## SetupQuality channel-scale structural audit

The largest base PriorityScore weight is `setupQuality * 0.28`, but A and B do not share a calibrated scoring function.

### A — pullback
`clamp(70 - |pullbackPct-7|*3 - supportDistancePct*3 + (volumeTodayVsPrev5<=0.9 ? 12 : 4), 0, 100)`

Within the actual A pass envelope:
- theoretical qualifying minimum ≈ 38;
- theoretical maximum = 82.

### B — breakout
`clamp(55 + min(25,volumeTodayVsPrev5*8) + dailyClosePosition*20 - dailyUpperShadowRatio*25,0,100)`

Within the actual B pass envelope:
- theoretical qualifying minimum ≈ 69.65;
- theoretical maximum = 100.

Thus the two scores are not on demonstrably comparable 0–100 scales.
An 18-point ceiling gap equals 5.04 PriorityScore points at the current 28% weight.

### A volume cliff

For otherwise identical A setups:
- volume ratio 0.90 => +12 setup points;
- volume ratio 0.91 => +4 setup points.

This 0.01 change can create an 8-point setup jump = 2.24 PriorityScore points while both candidates remain A-eligible.

This is a structural discontinuity, not yet evidence of outcome harm.

### Channel precedence

Current Formal assigns:
`B if B.pass; else A if A.pass`.

No A/B quota was identified; final quotas are price-pool based.
Actual dual-pass frequency must be measured prospectively.

### Frozen research question

Before changing any score:
1. Is setupQuality monotonic within A?
2. Is setupQuality monotonic within B?
3. Are raw A and B setupQuality values cross-channel calibrated after outcome/risk controls?
4. Does the A 0.90 volume cliff materially change ranking/selection?
5. Does B's higher attainable score reflect genuine better path quality or only formula scale?

Machine artifact:
`research/setup_quality_channel_falsification_v0_1.json`.

No normalization, reweighting or channel precedence change is authorized.
Any such change would be Class C.


## RR multi-layer influence structural audit

Current deployed Formal uses reward/risk three times in different roles:

1. **hard eligibility:** `RR >= 2`;
2. **PriorityScore component:** `clamp(RR*20,0,100)*0.14`;
3. **lexicographic tie-break:** raw `rewardPerRisk` is second after post-consensus PriorityScore.

PriorityScore is rounded to one decimal before the deployed comparator.

### Existing formula breakpoints

- RR 2.0 -> 5.6 PriorityScore points;
- RR 3.0 -> 8.4;
- RR 4.0 -> 11.2;
- RR 5.0 -> 14.0;
- RR >5.0 -> additive RR contribution stays 14.0, but raw rewardPerRisk can still win a PriorityScore tie.

Thus RR has confirmed multi-layer influence.
This is not automatically erroneous: a risk/reward floor plus preference among otherwise similar candidates can be intentional.

### Required falsification

Do not ask merely whether “high RR is good.”
Test:
- how often raw RR actually resolves a rounded PriorityScore tie;
- whether RR 2–3, 3–5 and >5 show monotonic improvement in target-first, MFE/MAE, stop-first and forward return;
- whether theoretical reward distance is realized before stop/time horizon;
- whether A/B channel stop-entry construction changes RR calibration;
- whether removing only the raw RR tie-break in a research replay changes selected names and improves/worsens outcomes.

Machine artifact:
`research/rr_priority_structural_falsification_v0_1.json`.

No RR gate, 14% weight, target construction or comparator change is authorized.


## Sector + market-RS multi-layer structural audit

### Sector: gate + score + tie-break

Current hard gate requires:
- breadth >= 40%;
- average daily change >= -1%;
- amountVs20DayAverage >= 0.5.

Current sector score is:
`clamp(amount/maxSectorAmount*45 + breadth*0.3 + clamp(avgChange*5+15,0,25),0,100)`.

The same score then contributes 14% of PriorityScore and `sectorFlow` remains the fifth deployed comparator.

Important semantic result:
- breadth and avgChange are used at both gate and score layers;
- gate activity is relative to the sector's own 20-day amount;
- score activity is absolute sector amount relative to the day's largest sector amount.

Thus these are not one consistent “flow” object.

### Cross-sector denominator externality

Fixed example:
- own amount=50, max sector amount=100, breadth=60, avgChange=+1 => sector score 60.5;
- keep own amount/breadth/change identical, but another sector doubles the max denominator to 200 => score 49.25.

The sector loses 11.25 score points without its own state weakening.
At 14% weight this is 1.575 PriorityScore points.

This may be intentional as a “where is absolute market attention concentrated?” measure, but it must not be described as own-sector flow strength without qualification.

### Market-relative RS: score + tie-break

Current RS:
`ret20 - official TAIEX return20`.

Priority component:
`clamp(50 + RS*2,0,100)*0.14`.

Therefore:
- RS=0 contributes 7 PriorityScore points;
- RS=+25 reaches the 14-point maximum;
- RS<=-25 reaches zero.

Raw `relativeStrength` also remains the sixth deployed comparator.

This is a double-layer ordering influence and may overlap the same price-history information already present in setup/trend/overheat families.

### Observability

V8.14 prospectively preserves the exact sector hard-gate inputs/checks and a bounded rejected cohort.
V8.13 preserves sectorFlow and relativeStrength in ranking provenance.

However candidate snapshots do not freeze the exact sector absolute amount and the cross-sector maxAmount denominator, so exact retrospective attribution of the 45-point amount-share component is incomplete.

Machine artifact:
`research/sector_rs_priority_structural_falsification_v0_1.json`.

No sector gate/score, RS formula, 14% weights or comparator changes are authorized.
