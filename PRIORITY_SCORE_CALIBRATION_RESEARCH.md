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


## Signal-grade / channel asymmetry audit

Formal uses the same letters for two different concepts:
- strategy channel A = pullback;
- strategy channel B = breakout;
- signalLevel A/B/C = setup-quality grade.

The grade is determined **only** by setupQuality:
- A grade: >=80;
- B grade: >=65;
- C: <65 and rejected.

Institutional, fundamental, sector, market-RS, RR and market-consensus inputs do not enter the grade directly.

### Structural channel asymmetry

A setup:
`70 - 3*|pullbackPct-7| - 3*supportDistancePct + volumeBonus`.

A raw pass can theoretically score ~38–82, but final grade eligibility requires >=65.
Thus A has an additional effective gate after A.pass.

For A to be A-grade:
- volumeTodayVsPrev5 must be <=0.9, otherwise A max is only 74;
- `|pullbackPct-7| + supportDistancePct <= 0.667`.

This is an extremely narrow structural region.

B setup:
`55 + min(25,volumeRatio*8) + closePosition*20 - upperShadow*25`.

At the B pass boundary itself, theoretical setupQuality is already ~69.65.
Therefore a valid B setup cannot become C under the current formula; the >=65 grade gate is effectively redundant for B.

### Interpretation firewall

The letter grade is supported only as a **setup-quality label**.
It is not currently an “overall candidate quality” grade because most PriorityScore dimensions are excluded from the grade formula.

Prospective analysis must compare grades within channel first.
Pooling A-channel A-grade with B-channel A-grade assumes a calibration that is not structurally established.

Machine artifact:
`research/signal_grade_channel_asymmetry_v0_1.json`.

No grade threshold, eligibility or display-label change is authorized.


## PriorityScore overlap graph — structural audit

The deployed ordering is not a single independent-factor sum. Several concepts influence selection in multiple layers:

| Concept | Hard gate / eligibility | PriorityScore | Lexicographic comparator | Confirmed overlap |
|---|---|---|---|---|
| setup | A/B pass + signalLevel >=B | setupQuality 28% | setupQuality 4th | YES |
| RR | RR >=2 | rewardRisk 14% | raw RR 2nd | YES |
| sector | breadth/change/activity gate | sectorFlow 14% | sectorFlow 5th | YES |
| market RS | no standalone hard gate | relativeStrength 14% | raw RS 6th | YES |
| consensus | source-count gate for bonus | post-score +0..7 overlay | consensusScore 3rd after RR tie | YES |
| institutional | current Formal eligibility evidence | institutionalQuality 16% | no later tie-break found | partial |
| fundamental | current Formal quality evidence + valuation interaction | fundamentalQuality 14% | no later tie-break found | partial |

This graph is descriptive, not a defect claim. Multi-layer influence can be intentional when the layers encode different objectives.

### PS-OVERLAP-001 — comparator influence is conditional

A later comparator matters only when every earlier comparator ties. Therefore the existence of a tie-break does not prove material influence.

Prospective metrics must measure:
- first differing comparator frequency;
- selected-name change under removal of one later comparator only;
- score saturation/tie frequency after one-decimal rounding;
- channel/pool/date strata.

### PS-OVERLAP-002 — effective weight is not nominal weight

The nominal 28/14/16/14/14/14 base weights cannot be interpreted as total influence because:
- upstream gates truncate the candidate distribution;
- score components can saturate;
- the consensus overlay changes post-base score;
- later tie-breakers reintroduce raw values.

Therefore optimization must estimate marginal decision influence on the admitted candidate set, not compare nominal percentages.

### PS-OVERLAP-003 — frozen counterfactual order

To avoid Factor-Zoo tuning, test one structural layer at a time:
1. current Formal baseline;
2. remove only a duplicated later comparator while preserving its gate/score;
3. remove only the duplicated score contribution while preserving its gate/comparator;
4. only after those fixed ablations, consider any rescaling.

Do not simultaneously change gate, weight and comparator and then attribute the result to one factor.

### PS-OVERLAP-004 — optimization trigger

A multi-layer concept becomes a FORMAL_OPTIMIZATION_CANDIDATE only if:
- its duplicated layer has non-trivial prospective decision incidence;
- ablation improves or preserves return/path quality with no material downside/coverage/zero-pick deterioration;
- result survives independent dates, A/B and pool strata, regime, costs and redundancy controls;
- effect is not dominated by one crisis/date/sector;
- OOS/holdout direction agrees.

Until then the overlap graph is a falsification map, not a recommendation to simplify Formal.


## Whole-system influence-layer map

The nominal base PriorityScore weights are:
- setup 28%;
- sector 14%;
- institutions 16%;
- fundamentals 14%;
- market-relative RS 14%;
- RR 14%.

These are **not** the total decision influence weights of the full Formal system.

Several components also act outside the composite:
- Setup: A/B technical qualification + signal-grade C rejection + later setup tie-break.
- Sector: hard gate + score + sectorFlow tie-break.
- RR: hard RR>=2 gate + score + raw RR tie-break.
- Fundamentals: data-count and score-quality hard gates + upstream quarterly/valuation/announcement completeness.
- Institutions: conditional >=70 requirement for the 10–30bn small-cap exception.
- RS: score + final raw relativeStrength tie-break.
- Market consensus: +0..7 overlay into PriorityScore + third comparator.

Then post-consensus PriorityScore is:
1. the first deployed ranking key;
2. also used proportionally for planned capital allocation.

Therefore “28/14/16/14/14/14” must not be read as a causal or total-importance decomposition.

### Important methodological consequence

Future calibration must condition on the **decision path**:
- gate effects;
- within-qualified score effects;
- tie-break incidence;
- selection-capacity effect;
- capital-allocation effect.

A factor can look weak among qualified rows because its hard gate already removed the lower tail.
Conversely a factor can look strong because it is repeated at gate + score + tie-break.

Do not turn “number of layers” into a pseudo-weight.
Layering is structural exposure, not proof of excessive influence.

Machine artifact:
`research/formal_influence_layer_map_v0_1.json`.

No simplification or reweighting is authorized before prospective path-level evidence.


## Capital-utilization cross-link

Do not misdiagnose idle capital as a score-cap redistribution problem.

Existing durable capital-utilization research already established:
- 1 candidate -> 35% planned deployment;
- 2 -> 60%;
- 3+ -> 85%;
- per-name 35% cap is not redistributed;
- first tranche is 60% of planned name allocation.

However the preregistered competing-hypothesis framework identifies untriggered first-tranche opportunity and second-tranche reserve as the more important idle-capital questions to falsify.

Therefore:
- score-proportional allocation and cap non-redistribution remain part of PriorityScore sizing calibration;
- but “redistribute capped excess” is NOT a new optimization candidate by itself;
- any capital-utilization change must be evaluated against selection quality, BUY conversion, drawdown avoided, opportunity cost and cash-state attribution.

Cross-reference:
`research/notes/CAPITAL_UTILIZATION_REENTRY_FALSIFICATION_2026-09-22.md`
and `PORTFOLIO_RISK_RESEARCH.md` PR-021/PR-022/PR-025.


## ATR -> stop -> RR coupling

PriorityScore RR calibration cannot be studied independently of stop construction.

Formal ATR path:
`ATR gate -> channel-specific stop -> RR gate -> RR score -> raw RR comparator -> score-proportional capital`.

The coupling is stronger for B by construction because B stop uses `max(0.65*ATR,1.2% breakout)`.
A stop may stay pinned to support*0.98 when structure geometry dominates.

Therefore:
- RR bands must be stratified by channel and ATR/stop-binding state;
- a high RR can partly mean low measured volatility/narrow stop, not only large upside;
- an apparent RR alpha may collapse after stop-distance/ATR controls;
- an apparent ATR penalty may already be implemented indirectly through RR filtering.

Cross-reference:
`research/atr_rr_channel_coupling_v0_1.json`
and `VOLATILITY_REGIME_RESEARCH.md` VR-018.


### Channel-precedence correction — mutual exclusivity proven (2026-09-27)

Earlier setup-quality notes said dual-pass frequency should be measured prospectively.

That is unnecessary under the current definitions.

Proof:
1. `recentHigh10` is the maximum high of the previous 10 sessions.
2. `priorHigh20` is the maximum high of the previous 20 sessions.
3. Therefore `priorHigh20 >= recentHigh10`.
4. B requires `close >= priorHigh20 * 1.002`, hence `close >= recentHigh10 * 1.002`.
5. A pullback is `(recentHigh10-close)/recentHigh10*100`; under B pass this is <= -0.2%.
6. A requires pullback between +2% and +15%.

Therefore:
`A.pass && B.pass = impossible`
under the current definitions and valid inputs.

The code branch `if (B.pass) ... else if (A.pass) ...` is not a channel-precedence bias today.
It is merely defensive ordering.

Research consequence:
- remove dual-pass frequency from outcome research;
- convert it into an invariant test: any observed dual pass means code/data semantics changed or are inconsistent;
- keep the real cross-channel issue: A and B setupQuality scales remain structurally different and still require within-channel / cross-channel calibration.

Machine artifact `research/setup_quality_channel_falsification_v0_1.json` updated accordingly.


## PR-037 — prospective sizing attribution needs shared Shadow↔journal generation identity (2026-09-27)

A pre-9/29 evidence-chain audit checked whether V8.13 PriorityScore provenance can be safely joined to Portfolio Risk trade-journal plans for future sizing calibration.

### What is already good

V8.13 prospectively freezes inside the research snapshot:
- post-consensus PriorityScore;
- raw rewardPerRisk / rewardRisk;
- consensus score/source-count/bonus;
- setupQuality;
- sectorFlow;
- relativeStrength;
- definition and comparator versions;
- point-in-time observation semantics.

Shadow capture is prospective and explicitly marks capturedAtSelection / shadowOnly / noForwardFill.

Therefore **within-Shadow** ranking/component calibration can continue under the existing prospective protocol.

### Cross-store identity gap

The Shadow D1 schema is keyed by:
`PRIMARY KEY(scan_date, symbol)`.

The snapshot has scanDate and symbol, but no shared immutable:
- scanGeneration;
- planInstanceId; or
- decision fingerprint also persisted on the trade-journal plan row.

The trade journal is the immutable plan-time source for allocation, buy zone and stop geometry used by Portfolio Risk.

Thus `scanDate + symbol` equality proves same nominal date/name, but does not prove the Shadow score provenance and journal allocation came from the **same decision generation** after same-day reruns, partial failures or asymmetric overwrites.

This is the same class of evidence-chain problem already recognized by VALIDATION_GOVERNANCE for generation-uncertified joins.

### Safe firewall

Allowed:
- prospective PriorityScore analysis entirely inside a generation-coherent Shadow record set, subject to existing coverage/cohort controls.

Guarded:
- score-proportional sizing attribution that joins V8.13 Shadow provenance to journal allocation/stop rows.

Forbidden for Formal promotion:
- treating `scanDate|symbol` as sufficient shared-generation proof.

A future Class-B evidence proposal may add one shared immutable scan-generation / decision fingerprint to both stores with mismatch fail-closed readback. No such persistence change is made here.

This finding does **not** change Formal behavior and does not invalidate PR-033/034, which deterministically replay the allocation from the immutable journal itself. It specifically constrains future attribution of those allocations to richer V8.13 score-component provenance across stores.

Durable artifact:
`research/portfolio_risk_shadow_journal_generation_alignment_v0_1.json`.

Status:
`CROSS_STORE_GENERATION_ALIGNMENT_UNCERTIFIED / WITHIN_SHADOW_RESEARCH_CONTINUES / SIZING_PROMOTION_GUARDED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-038 — correction: selected-only sizing has an existing same-writer generation witness (2026-09-27)

PR-037 correctly identified that the independent Shadow archive is keyed only by scan_date + symbol and lacks a shared immutable generation ID with the trade journal.

A deeper writer audit narrows that blocker substantially for **selected plans**.

Inside `recordTradeJournalDay`:
- one `first-primary` D1 session is opened;
- one invocation-level `now = new Date().toISOString()` is created;
- each `v8_trade_journal_plans` row is written with `recorded_at = now`;
- the selected plan's attached `researchSnapshot` is then written to `trade_research_snapshots` with `updated_at = the same now`;
- V8.13 PriorityScore provenance is part of `buildResearchSnapshot`, so the selected research snapshot carries the prospective ranking fields.

Same-day rerun semantics strengthen this witness:
- plan rows for the date are deleted and rebuilt;
- research snapshots are upserted;
- a fully successful rerun gives both sides the new identical timestamp;
- an asymmetric failure can leave a timestamp mismatch and must fail closed.

### Strict positive selected-generation classifier

A selected plan may be treated as same-generation only when all are true:
1. exact scan_date;
2. exact symbol;
3. `plan.recorded_at === selectedSnapshot.updated_at`;
4. snapshot `sourceCompleteness === FULL_FORMAL_SCAN`;
5. required V8.13 ranking provenance + definition/comparator versions are present;
6. journal day completeness is positively verified.

This is stronger than a bare scanDate|symbol join and requires no fabricated historical Shadow.

### Remaining limitation

The convenient Portfolio Risk `/api/journal` reader currently exposes plan `recorded_at` but not the selected research snapshot's `updated_at`/raw row. Therefore the **storage contract is source-ready**, while live readback certification still needs a safe reader/classifier path.

That reader work is evidence infrastructure only; it must not alter Formal selection/ranking/capital/signals.

The independent non-selected Shadow archive remains under PR-037's generation firewall.

Corrected status:
`SELECTED_GENERATION_WITNESS_SOURCE_READY / READER_PATH_PENDING / NONSELECTED_SHADOW_STILL_GUARDED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-039 — fail-closed selected-generation classifier frozen before prospective data (2026-09-27)

PR-038 established that existing storage contains a same-writer generation witness for selected plans. PR-039 converts that contract into an executable **research-only pure classifier** before any 2026-09-29 prospective rows exist.

Positive certification requires all of:
- exact scan_date;
- exact symbol;
- plan recorded_at exactly equals selected research snapshot updated_at;
- sourceCompleteness = FULL_FORMAL_SCAN;
- required V8.13 PriorityScore/ranking provenance present;
- journal selected_count exactly equals plan_count.

The test suite explicitly fails closed on:
- date mismatch;
- symbol mismatch;
- timestamp mismatch;
- PARTIAL_CURRENT_SCAN_RECONSTRUCTION;
- missing ranking provenance;
- journal completeness mismatch.

### Reader audit

Existing Production storage is already sufficient in principle:
- /api/journal exposes plan recorded_at;
- internal readResearchSnapshots reads trade_research_snapshots.updated_at + snapshot_json from first-primary D1.

However /api/research/dashboard intentionally does not expose raw snapshot rows/timestamps. Therefore an external research script cannot currently pair both witnesses without widening a Production API.

No API is widened now.

Reason:
there are not yet prospective 2026-09-29 selected V8.13 rows to justify adding another Production surface. The classifier is frozen first; after the first prospective row exists, the least-invasive reader path can be evaluated against a real row rather than speculative plumbing.

This is a governance improvement: evidence requirements are pre-registered before seeing the prospective outcome/sample.

Artifact:
`research/portfolio_risk_selected_generation_classifier_v0_1.mjs`.

Receipt:
`research/portfolio_risk_selected_generation_classifier_receipt_20260927.json`.

Status:
`CLASSIFIER_READY / PRODUCTION_READER_DEFERRED / FIRST_PROSPECTIVE_LIVE_QA_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-041 — PriorityScore has a second exposure channel after selection (2026-09-27)

A structural hypothesis was falsified:

`PriorityScore influence ends when ranking/selection is complete.`

It does not. After a name is selected, the same post-consensus PriorityScore also drives proportional planned capital. Therefore PriorityScore has at least two distinct decision-path exposures:
1. ranking/selection exposure;
2. post-selection sizing exposure.

On the immutable 2026-09-18 three-name journal, equal capital at the same NT$168,000 deployment is NT$56,000/name. Current planned capital is:
- 2006: NT$50,000;
- 3105: NT$64,000;
- 6133: NT$54,000.

Thus 3105 receives a +NT$8,000 sizing tilt versus equal capital. Because 3105 also has the widest conservative planned stop fraction, that positive sizing tilt increases its projected stop-risk contribution relative to equal capital.

This does **not** mean the extra exposure is harmful. It may be justified if the higher PriorityScore contains genuine prospective alpha.

It also does not permit factor-level attribution: setup, RR, sector, institutions, fundamentals, RS and consensus all contribute to the final score, some through multiple layers. The correct future decomposition is therefore:

`factor/gate effect -> ranking/selection incidence -> selected score -> sizing tilt -> realized outcome`.

Selection influence and sizing influence must be reported separately and must not be added as though statistically independent.

Machine artifact:
`research/priority_score_sizing_multiplier_structural_v0_1.json`.

Executable decomposition:
`research/priority_score_sizing_influence_v0_1.mjs`.

Status:
`SECOND_EXPOSURE_CHANNEL_CONFIRMED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-042 cross-link — score × stop-distance interaction

PriorityScore sizing must be evaluated jointly with stop geometry, not only capital share.

Pre-registered competing directions:
- amplification: high score aligns with wider stop;
- neutral: no stable association;
- natural offset: high score aligns with narrower stop.

Primary analysis is within-date on generation-certified multi-selected samples. This avoids mistaking market-regime or selected-count composition for score-stop coupling.

See `research/priority_score_stop_distance_interaction_protocol_v0_1.json`.

No score weight, stop rule or sizing rule is changed.


## PR-043 — post-selection sizing break-even / opportunity-cost framework pre-registered (2026-09-27)

PR-041 established that PriorityScore creates a second exposure channel through post-selection capital sizing. PR-043 freezes the economic break-even algebra **before** prospective outcomes mature.

### Primary comparator

Use the same selected names and the same total planned deployment, but replace current PriorityScore-proportional sizing with equal capital.

This isolates sizing from selection.

For any horizon:

`gross sizing alpha = Σ[(current allocation - comparator allocation) × realized return]`.

Because the allocation tilts sum to approximately zero under same deployment, this is exactly:

`transferred capital × (return of capital tilted up - return of capital tilted down)`.

Therefore the gross break-even condition needs no subjective threshold:

`positive-tilt weighted return = negative-tilt weighted return`.

### 2026-09-18 algebra witness

Equal capital is NT$56,000/name.

Current minus equal-capital tilt:
- 2006 = -NT$6,000;
- 3105 = +NT$8,000;
- 6133 = -NT$2,000.

Hence current sizing has positive gross incremental P&L only if:

`R_3105 > 0.75 × R_2006 + 0.25 × R_6133`.

No 2026-09-18 outcome is read or inferred. This is algebra only.

### Projected-risk link

If conservative planned stop-risk inputs are complete, also report:
- current projected plan-risk;
- comparator projected plan-risk;
- incremental projected plan-risk;
- gross incremental P&L / extra projected plan-risk when the risk delta is positive.

No arbitrary “required P&L per risk” cutoff is introduced. The ratio is descriptive until independent dates establish a stable distribution.

### Cost firewall

Cost-adjusted dominance remains UNKNOWN unless the **incremental cost difference** between the sizing rules is explicitly measured or conservatively bounded.

Same total deployment may make linear entry notional costs similar, but minimum commissions, odd-lot effects, exit notional and slippage can still differ. Incremental cost must not silently be set to zero.

### Outcome-clock firewall

The primary sizing estimand is fixed-cohort:
`formal selection close -> D1/D3/D5`
on the same selected names.

BUY-triggered trade P&L is secondary execution evidence only. Restricting the primary comparison to BUY-triggered rows can create post-selection trigger bias and is forbidden.

Executable algebra:
`research/priority_score_sizing_breakeven_v0_1.mjs`.

Protocol:
`research/priority_score_sizing_breakeven_protocol_v0_1.json`.

Status:
`BREAKEVEN_PROTOCOL_PREREGISTERED / OUTCOMES_PENDING / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-044 — correction: paper path edge vs realized execution edge are different clocks (2026-09-27)

PR-043's algebra is valid, but its terminology was too strong.

Multiplying planned allocation tilt by `formal selection close -> D1/D3/D5` returns does **not** create realized P&L, because no fill at the formal close is implied.

The sizing research is now split into two estimands.

### 1. Selection-path clock

Population:
all generation-certified selected names on identifying multi-name dates.

Common baseline:
formal selection close.

Output:
`PAPER_PATH_SIZING_EDGE`.

Question:
did PriorityScore tilt more planned capital toward names that subsequently had better fixed-horizon paths?

This is useful predictive/calibration evidence, but it is not executable or realized P&L.

### 2. Execution clock

Output:
`REALIZED_OR_EXECUTABLE_SIZING_EDGE`.

This requires:
- implemented Confirmed Fill Ledger with planScanDate + ledgerEpoch coverage;
- proof that BUY trigger timing/eligibility is allocator-invariant, or an explicit counterfactual trigger model;
- comparator share sizing;
- actual/defensible fill-price treatment;
- fees, taxes, odd-lot/minimum-fee and slippage treatment;
- untriggered planned capital left as cash.

Current confirmed-fill ledger remains a Class-B proposal and is not implemented, so execution-edge evidence is still blocked.

### Trigger-conditioning correction

BUY-only rows must not replace the all-selected predictive estimand.

However, for realized allocation economics, conditioning on actual BUY/fill is necessary. It therefore becomes a separate execution-clock estimand with coverage/invariance requirements rather than being mixed into the selection-path cohort.

### Cost correction

Trading costs belong to the execution clock.
Do not subtract guessed trading costs from a formal-close paper-path edge and call the result realized net P&L.

New executable paper-path module:
`research/priority_score_sizing_edge_v0_2.mjs`.

Two-clock protocol:
`research/priority_score_sizing_two_clock_protocol_v0_2.json`.

PR-043 v0.1 is retained as an algebra/history artifact but its realized-P&L wording is superseded.

Status:
`SEMANTIC_CORRECTION_FROZEN / PAPER_EDGE_READY / EXECUTION_EDGE_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-045 — initial BUY trigger is structurally allocation-invariant; execution is not (2026-09-27)

A source-level audit traced the complete initial-entry path:
`evaluatePullback/evaluateMomentum -> evaluateStop/evaluateProfit -> buildFinalDecision -> applyPlanValidity -> evaluateOperationSignals`.

Across the upstream decision chain, the following sizing fields are absent:
- allocationRatio;
- totalAllocation;
- firstAmount / firstShares;
- secondAmount / secondShares;
- PriorityScore.

For an unheld name (`positionStage=NONE`), initial BUY eligibility is currently:

`finalDecision == buy`
AND
`maxChase is absent OR currentPrice <= maxChase`.

Only after that predicate passes does the signal payload attach:
`firstAmount` and `firstShares`.

### Research consequence

For current vs alternative sizing rules that preserve the same selected name and all non-sizing plan fields, the same observed **initial BUY signal timestamp** can be used as common trigger evidence, provided:
- the plan/research generation is certified;
- the Worker trigger contract/version is the same;
- the same market data are used.

This materially reduces one execution-clock uncertainty.

### What is NOT invariant

The finding does not certify:
- identical fill price;
- identical fill probability;
- identical slippage;
- orderability if a counterfactual allocation rounds to zero shares;
- ADD lifecycle after first execution;
- later REDUCE/SELL realized economics.

Therefore an alternative allocator may share the initial trigger event, but its amount, shares, cash left idle and execution friction still require separate reconstruction.

A source-contract test is added so any future introduction of PriorityScore/allocation fields into initial BUY eligibility fails Tier-A CI instead of silently changing the counterfactual assumption.

Artifact:
`research/initial_buy_trigger_allocation_invariance_v0_1.json`.

Test:
`tests/test_initial_buy_trigger_allocation_invariance_v0_1.mjs`.

Status:
`INITIAL_BUY_TRIGGER_STRUCTURALLY_ALLOCATION_INVARIANT / EXECUTION_NOT_INVARIANT`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-046 — counterfactual initial-BUY orderability gate (2026-09-27)

PR-045 proved the initial BUY trigger predicate is structurally independent of PriorityScore/allocation sizing. PR-046 addresses the next execution question:

`If the trigger is shared, can the alternative allocator actually place at least one share at that trigger?`

Current source semantics:
- plan preview firstShares uses `sharesFor(firstAmount,buyHigh)`;
- live BUY push recomputes suggestedShares using `sharesFor(signal.amount,currentPrice)`;
- `sharesFor = floor(amount/price)`.

Therefore counterfactual execution must **not** copy the current plan's precomputed firstShares.

For a shared observed BUY trigger:
1. take the alternative allocator's allocation;
2. apply the frozen first-tranche ratio (60%);
3. use the observed trigger price;
4. recompute `floor(firstAmount / triggerPrice)`.

If that result is zero, the counterfactual is non-orderable at that trigger and execution comparison fails closed for that name.

This still does not certify:
- fill probability;
- identical fill price;
- partial fill;
- slippage/fees;
- ADD execution.

Executable research gate:
`research/counterfactual_initial_buy_orderability_v0_1.mjs`.

Contract:
`research/counterfactual_initial_buy_orderability_contract_v0_1.json`.

Status:
`ORDERABILITY_GATE_READY / FILL_MODEL_STILL_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-048 — positive BUY signal can reconstruct live suggestedShares exactly (2026-09-27)

PR-047 established that a persisted V8.5 BUY signal row is strong positive evidence of the formal BUY signal's `market_price` and `occurred_at`.

Current runtime `buildPushPayload` recomputes BUY `suggestedShares` as:
`floor(signal.amount / result.currentPrice)`.

V8.5 signal journal persists from that same event:
- `signal_amount = signal.amount`;
- `market_price = result.currentPrice`.

Therefore a complete positive BUY row exactly reconstructs:
`live suggestedShares = floor(signal_amount / market_price)`.

This is signal-side quantity only, not broker execution.

Certified:
event identity, timestamp, signal price, signal amount, exact signal-side suggestedShares and one-share orderability.

Not certified:
broker order acknowledgement, actual fill, fill price/probability, partial fill, fees, slippage, or NO-BUY absence.

Artifacts:
`research/buy_signal_quantity_reconstruction_v0_1.mjs`;
`research/buy_signal_quantity_reconstruction_contract_v0_1.json`.

Status:
`POSITIVE_BUY_SIGNAL_QUANTITY_RECONSTRUCTABLE / FILL_EVIDENCE_STILL_SEPARATE`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-057 — sizing quantization cascade: score weight is discretized twice before execution (2026-09-27)

Formal post-selection capital does not flow continuously from PriorityScore into shares.

The current chain is:

1. continuous score-proportional allocation under the 35% per-name cap;
2. planned allocation floored to NT$1,000;
3. planned capital split into 60% FIRST + 40% ADD budgets;
4. plan-preview shares floored at buyHigh.

This creates two distinct pre-execution residuals:
- allocation implementation shortfall from the NT$1,000 floor;
- share-floor residual cash from integer-share conversion.

The second residual is especially important for high-price names: it is a modular floor effect, not a smooth function of price. A lower trigger price can increase suggested shares yet leave a larger residual cash amount.

Production 3006 already provides a concrete signal-side counterexample:
- first budget = NT$42,000;
- plan preview at buyHigh 287.08 -> 146 shares -> NT$86.32 residual;
- live BUY signal at 282.5 -> 148 shares -> NT$190 residual.

So “better/lower trigger price always improves capital utilization” is false under integer-share flooring.

### Evidence boundary

The new metric is:
`PLAN_PREVIEW_SUGGESTED_NOTIONAL`.

It is not:
- submitted order notional;
- filled notional;
- actual deployed capital.

Alternative allocators must use their own pre-registered quantization rule; continuous equal-capital/equal-risk allocations cannot be compared against current discrete shares without that extra step.

Artifacts:
`research/sizing_quantization_cascade_v0_1.mjs`;
`research/sizing_quantization_cascade_spec_v0_1.json`;
`tests/portfolio_risk_sizing_quantization_readonly_audit.mjs`.

Status:
`QUANTIZATION_CASCADE_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-057 Production result — share quantization does not explain away current risk concentration

Read-only Production run `36331652461` / job `108654620345` applied the frozen quantization cascade to 2026-09-18.

Current PriorityScore sizing:
- nominal deploy target = NT$170,000;
- planned allocation after NT$1,000 flooring = NT$168,000;
- plan-preview suggested notional after integer-share flooring = NT$167,471.13;
- NT$1,000-floor shortfall = NT$2,000;
- share-floor residual = NT$528.87;
- total nominal-to-preview shortfall = NT$2,528.87.

Risk concentration:
- planned projected-stop-risk HHI = 0.37723809;
- current plan-preview HHI = 0.37670778.

So integer-share flooring slightly attenuates current HHI by only 0.00053031 (~0.14% relative).

Applying the same share-floor rule to same-deployment equal capital:
- preview HHI = 0.35538974;
- current minus equal-capital HHI = +0.02131804 (~6.00% above the comparator);
- current preview projected stop-risk is NT$164.45 higher.

Applying the same share-floor rule to the continuous 35%-cap equal-risk diagnostic:
- preview HHI = 0.33428138;
- current minus comparator HHI = +0.04242640 (~12.69% above the comparator);
- current preview projected stop-risk is NT$520.70 higher.

Therefore the explanation:
`current risk concentration is mainly a share-floor / price-quantization artifact`
is rejected on the 2026-09-18 witness.

Important caveat:
the capped equal-risk comparator is still continuous at the **allocation** layer. PR-057 only adds share/tranche quantization to it. A true NT$1,000-grid same-deployment comparator remains the next structural falsification.

Durable receipt:
`research/sizing_quantization_production_receipt_20260928.json`.

Status:
`SHARE_QUANTIZATION_EXPLANATION_FALSIFIED_ON_WITNESS / GRID_EQUAL_RISK_NEXT / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.
