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


## PR-058 — NT$1,000-grid equal-risk counterfactual survives full plan-preview quantization (2026-09-28)

PR-057 showed that integer-share flooring does not explain away the 2026-09-18 PriorityScore risk-concentration witness. PR-058 removes the last major structural idealization from the equal-risk comparator: continuous allocation amounts.

### Frozen grid method

Constraints:
- same three selected names;
- same NT$168,000 current planned deployment;
- same 35% per-name cap;
- NT$1,000 allocation grid;
- same buyHigh-to-stop conservative risk definition.

Starting from the continuous capped equal-risk target, each allocation is floored to the NT$1,000 grid. Residual NT$1,000 units are then assigned deterministically to the eligible name that minimizes squared projected-risk-space error to the continuous target.

On 2026-09-18 this yields:
- 2006 = NT$70,000;
- 3105 = NT$41,000;
- 6133 = NT$57,000.

No outcome is used to choose those amounts.

### Before share flooring

Grid equal-risk:
- projected stop-risk = NT$5,965.732;
- HHI = 0.33438488;
- max/min projected-risk ratio = 1.137143.

### After the same 60/40 + integer-share preview flooring

Grid equal-risk:
- preview suggested notional = NT$167,697.54;
- share-floor residual = NT$302.46;
- preview projected stop-risk = NT$5,951.36;
- preview risk HHI = 0.33434138.

Current PriorityScore sizing:
- preview suggested notional = NT$167,471.13;
- preview projected stop-risk = NT$6,459.97;
- preview risk HHI = 0.37670778.

Therefore current minus grid equal-risk is:
- +NT$508.61 projected stop-risk;
- +0.04236640 risk HHI;
- HHI is ~12.67% higher relative to the grid comparator.

Critically, the grid comparator actually carries **NT$226.41 more plan-preview suggested notional** than current, yet still has materially lower projected stop-risk and concentration.

So two counter-explanations are rejected on this witness:
1. equal-risk only looks better because its allocations were continuous/non-executable;
2. equal-risk only looks safer because it leaves more cash unused after share flooring.

This materially strengthens the structural finding, but it still does not prove equal-risk sizing has better realized returns.

Durable receipt:
`research/grid_equal_risk_production_receipt_20260928.json`.

Status:
`GRID_AND_SHARE_QUANTIZATION_COUNTEREVIDENCE_SURVIVES / STRUCTURAL_RISK_CONCENTRATION_STRENGTHENED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-059 — exhaustive grid search: exact optimum shifts after share quantization (2026-09-28)

The NT$1,000-grid structural search was upgraded from a target-following construction to **complete enumeration**.

For 2026-09-18, under:
- the same three selected names;
- the same NT$168,000 planned deployment;
- the same 35% per-name cap;
- at least one NT$1,000 unit per selected name;

there are exactly **946 feasible grid states**, and all were evaluated.

### PRE_SHARE objective

Before 60/40 tranche and integer-share flooring, the unique minimum-HHI and unique minimum-max/min allocation are both:

- 2006 = NT$70,000;
- 3105 = NT$41,000;
- 6133 = NT$57,000.

Projected risk:
- total = NT$5,965.732;
- HHI = 0.3343848759;
- max/min = 1.13714329.

This independently verifies the PR-058 70/41/57 grid allocation as the **global pre-share optimum**, not merely a heuristic near the continuous target.

### POST_SHARE objective

After applying the exact same:
- 60/40 tranche split;
- integer-share floor at buyHigh;

the unique minimum-HHI and minimum-max/min allocation both shift to:

- 2006 = NT$70,000;
- 3105 = NT$42,000;
- 6133 = NT$56,000.

Its plan-preview geometry:
- suggested notional = NT$167,227.36;
- projected stop-risk = NT$5,940.8663;
- HHI = 0.3342784042;
- max/min = 1.1265985.

Current PriorityScore sizing remains:
- 50k / 64k / 54k;
- preview projected stop-risk = NT$6,459.97;
- HHI = 0.37670778.

Thus the exact minimizing allocation is **objective/quantization-sensitive by one NT$1,000 unit**, but the conclusion that current sizing is materially more concentrated survives either semantic definition.

### Important cash-drag nuance

The post-share HHI optimum has NT$243.77 less preview suggested notional than current, so that optimum alone cannot prove its lower risk is independent of cash drag.

The separate PRE_SHARE-global optimum 70/41/57 still supplies that counterexample:
after the same share flooring it carries NT$167,697.54 preview notional, **NT$226.41 more than current**, while retaining much lower projected-risk concentration.

Therefore:
- exact comparator allocation is not invariant across structural objectives;
- the structural concentration finding is robust;
- the earlier cash-drag falsification remains supported by a distinct comparator.

Durable receipt:
`research/exhaustive_grid_risk_optima_production_receipt_20260928.json`.

Status:
`DISCRETE_OBJECTIVE_SENSITIVITY_CONFIRMED / UNIQUE_OPTIMA_BY_SEMANTIC / STRUCTURAL_CONCLUSION_ROBUST / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-060 — stop-risk entry-reference sensitivity test (2026-09-28)

The current Portfolio Risk structural result uses `buyHigh` as the conservative planned entry reference.

PR-060 tests a direct counter-hypothesis:

`The observed 2026-09-18 risk concentration is only an artifact of choosing buyHigh.`

For every reconstructable multi-name date, projected stop-risk is recomputed under three frozen references:
- BUY_LOW;
- MIDPOINT = (buyLow + buyHigh) / 2;
- BUY_HIGH.

For each reference, the audit compares:
1. current PriorityScore-proportional allocation;
2. same-deployment equal capital;
3. exhaustive NT$1,000-grid global minimum HHI under the same 35% per-name cap.

The grid search uses the same selected names and same planned deployment. No realized price/fill is assumed.

Interpretation is pre-registered:
- if current remains more concentrated than equal-capital and the global grid minimum across all three references, the structural conclusion survives reference-price falsification;
- if the gap disappears or reverses at BUY_LOW/MIDPOINT, the earlier conclusion must be downgraded as reference-sensitive.

Artifacts:
`research/entry_reference_risk_sensitivity_v0_1.mjs`;
`research/entry_reference_risk_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_entry_reference_sensitivity_readonly_audit.mjs`.

Status:
`REFERENCE_SENSITIVITY_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-060 Production result — buyHigh reference does not create the concentration finding

Read-only Production run `36350840822` / job `108709088620` tested the only reconstructable multi-name date, 2026-09-18, under three entry references.

### BUY_LOW

Current HHI = 0.4252711642.  
Equal-capital HHI = 0.3950931017.  
Exhaustive NT$1,000-grid minimum HHI = 0.3486465228.

### MIDPOINT

Current HHI = 0.3934504209.  
Equal-capital HHI = 0.3683594007.  
Exhaustive grid minimum HHI = 0.3377017368.

### BUY_HIGH

Current HHI = 0.3772380854.  
Equal-capital HHI = 0.3558588621.  
Exhaustive grid minimum HHI = 0.3343850287.

3105 is the widest stop-risk name under every reference:
- buyLow: 3.570699%;
- midpoint: 4.292115%;
- buyHigh: 5.002817%.

The key counter-hypothesis is therefore rejected:

`The structural concentration exists only because risk was measured from conservative buyHigh.`

In fact the current-minus-equal-capital HHI gap is **largest at buyLow** (0.0301780625) and **smallest at buyHigh** (0.0213792233). Conservative buyHigh does not exaggerate the witness; on this date it attenuates the relative concentration gap.

The exact risk-minimizing grid allocation moves with the reference price (70/36/62 at buyLow, 70/39/59 at midpoint, 70/41/57 at buyHigh), so the exact comparator remains model-sensitive. The direction of the structural conclusion does not.

Durable receipt:
`research/entry_reference_risk_sensitivity_production_receipt_20260928.json`.

Status:
`ENTRY_REFERENCE_ARTIFACT_FALSIFIED / STRUCTURAL_CONCLUSION_STRENGTHENED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-061 — separate stop-geometry concentration from PriorityScore sizing increment (2026-09-28)

PR-033 through PR-060 show that current PriorityScore sizing compounds with heterogeneous stop distance. PR-061 adds an important anti-overclaim decomposition.

Equal-capital is used as a **descriptive bridge**, not a causal counterfactual claim.

For a selected set of N names:

`current HHI - 1/N = (equal-capital HHI - 1/N) + (current HHI - equal-capital HHI)`.

The first term describes concentration already present when capital is neutral across names but stop distances differ.

The second term is the incremental concentration associated with the current PriorityScore capital tilt on the same names.

A second bridge uses the exhaustive feasible grid minimum:

`current HHI - global-min HHI = (equal-capital HHI - global-min HHI) + (current HHI - equal-capital HHI)`.

### Governance firewall

These components are algebraically exact but **not statistically independent and not causal factor attribution**.

Therefore future reporting must not say:
`PriorityScore causes all observed risk concentration`.

The correct statement is:
`stop geometry already creates unequal projected-risk contributions under equal capital; current PriorityScore sizing adds an additional concentration increment on the observed date.`

Executable decomposition:
`research/risk_concentration_bridge_v0_1.mjs`.

Audit:
`tests/risk_concentration_bridge_audit_v0_1.mjs`.

Status:
`GEOMETRY_AND_SIZING_COMPONENTS_SEPARATED / ECONOMIC_VALUE_UNKNOWN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-062 — concentration-metric sensitivity falsification (2026-09-28)

PR-033 through PR-061 rely heavily on HHI to summarize projected stop-risk concentration.

PR-062 tests the counter-hypothesis:

`The structural conclusion is an artifact of HHI itself.`

Five metrics are evaluated on the same projected-risk contribution vectors:
- HHI;
- Gini;
- coefficient of variation;
- maximum contribution share;
- max/min positive contribution ratio.

For every metric and every entry reference (buyLow, midpoint, buyHigh), the Production audit compares:
1. current PriorityScore sizing;
2. equal capital;
3. the exhaustive global minimum over all legal NT$1,000-grid states under the same deployment and 35% cap.

The exact optimal allocation is allowed to differ by metric. Agreement of exact optima is **not** required.

The falsification target is directional:
if several non-HHI metrics no longer show current as more concentrated than equal capital/global minima, the HHI-based structural claim must be downgraded.

Artifacts:
`research/risk_metric_sensitivity_v0_1.mjs`;
`research/risk_metric_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_metric_sensitivity_readonly_audit.mjs`.

Status:
`METRIC_SENSITIVITY_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-062 Production result — concentration direction survives five metrics

Read-only Production run `36351672635` / job `108711424760` evaluated:
- 3 entry references: buyLow, midpoint, buyHigh;
- 5 concentration metrics: HHI, Gini, CV, maximum contribution share, max/min;
- all 946 legal NT$1,000-grid states per reference.

Directional result:
- current > equal-capital concentration: **15 / 15** metric-reference combinations;
- current > metric-specific global minimum: **15 / 15**.

The exact global optimum is objective-sensitive:
- buyLow: HHI/CV -> 70/36/62; Gini/MAX_SHARE/MAX_MIN -> 70/37/61;
- midpoint: HHI/CV -> 70/39/59; Gini/MAX_SHARE/MAX_MIN -> 70/40/58;
- buyHigh: all five metrics -> 70/41/57.

Therefore the counter-hypothesis
`the concentration result is only an HHI artifact`
is rejected on the 2026-09-18 witness.

At the same time, the optimum differences reinforce a governance constraint:
**there is no single objective-free “correct” risk-minimizing allocation.**
Exact comparator allocation depends on reference price, integer grid and concentration objective.

Durable receipt:
`research/risk_metric_sensitivity_production_receipt_20260928.json`.

Status:
`HHI_ARTIFACT_FALSIFIED / METRIC_DIRECTION_ROBUST / OPTIMUM_OBJECTIVE_SENSITIVE / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 — per-name cap creates a separate non-redistributed reserve channel (2026-09-28)

Source audit of `allocateAndBuildPlans()` confirms the sequence:

`rawRatio = deployRatio × scoreShare`

then

`ratio = min(35%, rawRatio)`

then each name is independently floored to NT$1,000.

There is no second redistribution pass for clipped score weight.

Therefore the selected-count deployment ratio is an **upper target**, not a guaranteed planned deployment.

Cap-binding score-share thresholds:
- 1 selected: raw ratio is exactly 35%; no extra cap reserve;
- 2 selected: one name binds above 58.333333% of selected score weight;
- 3–6 selected: one name binds above 41.176471%.

A deterministic hypothetical shows the mechanism:
scores 100/50/50 with NT$200,000 capital and 3 selected names imply an 85% nominal target (NT$170,000), but the top name is clipped from 42.5% to 35%. The clipped score weight creates NT$15,000 cap-induced reserve; NT$1,000 floors add another NT$1,000 reserve, leaving NT$154,000 planned.

This is not automatically a defect. It may be desirable risk control. The research question is whether this implicit extra cash materially contributes to under-deployment and whether the forgone exposure is economically justified.

Artifacts:
`research/score_cap_reserve_v0_1.mjs`;
`research/score_cap_reserve_spec_v0_1.json`;
`tests/portfolio_risk_score_cap_reserve_readonly_audit.mjs`.

Status:
`CAP_RESERVE_MECHANISM_PROVEN / PRODUCTION_OCCURRENCE_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 Production result — cap mechanism did not cause observed historical underdeployment

Read-only Production run `36352049564` / job `108712476115` checked both reconstructable plan dates.

### 2026-09-18

- selected names = 3;
- nominal deploy target = 85% × NT$200,000 = NT$170,000;
- highest score share = 3105 at 38.172502%;
- cap-binding threshold for 3+ names = 41.176471%;
- cap-binding symbols = none;
- cap-induced reserve = NT$0;
- planned allocation after NT$1,000 floors = NT$168,000;
- floor reserve = NT$2,000;
- designed strategic reserve = NT$30,000;
- remaining cash after plan = NT$32,000.

Therefore the extra NT$2,000 under the nominal 85% deployment target came entirely from NT$1,000 flooring, not the 35% cap.

### 2026-09-21

- selected names = 1;
- nominal deploy target = 35% = NT$70,000;
- raw ratio = cap = 35%;
- cap-induced reserve = NT$0;
- floor reserve = NT$0;
- remaining cash = NT$130,000, entirely the designed 65% strategic reserve.

The historical hypothesis
`current observed planned underdeployment was caused by non-redistributed cap clipping`
is rejected for the available dates.

The structural mechanism remains valid prospectively: if selected score concentration crosses the cap-binding threshold, clipped mass is not redistributed and will become extra reserve.

Durable receipt:
`research/score_cap_reserve_production_receipt_20260928.json`.

Status:
`CAP_RESERVE_MECHANISM_PROVEN / HISTORICAL_OCCURRENCE_NOT_OBSERVED / PROSPECTIVE_WATCH_ONLY / ECONOMIC_VALUE_UNKNOWN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-064 — FIRST-tranche risk concentration test (2026-09-28)

The existing structural evidence uses the full planned allocation, but actual live exposure may stop after FIRST and never reach ADD.

PR-064 tests whether the concentration finding survives when risk is restricted to the Formal 60% FIRST tranche.

For each multi-name date:
- FIRST amount = round(totalAllocation × 0.60);
- FIRST preview shares = floor(FIRST amount / buyHigh);
- FIRST projected stop-risk = FIRST preview notional × conservative stop-risk fraction.

The audit compares:
1. current PriorityScore sizing;
2. same-deployment equal capital;
3. the exhaustive NT$1,000-grid allocation with minimum FIRST-preview risk HHI under the same 35% cap.

The falsification target is lifecycle-stage sensitivity:
if current FIRST risk is no longer more concentrated than equal-capital/global minimum, the earlier full-plan conclusion must be downgraded.

This remains plan-preview geometry only. It does not assert a BUY trigger, submitted order, fill or realized exposure.

Artifacts:
`research/first_tranche_risk_concentration_v0_1.mjs`;
`research/first_tranche_risk_concentration_spec_v0_1.json`;
`tests/portfolio_risk_first_tranche_readonly_audit.mjs`.

Status:
`FIRST_TRANCHE_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-064 Production result — concentration survives in FIRST-only exposure

Read-only Production run `36352649582` / job `108714150360` tested 2026-09-18 using only the Formal 60% FIRST tranche.

Current PriorityScore sizing:
- FIRST preview notional = NT$100,609.21;
- FIRST projected stop-risk = NT$3,881.77;
- FIRST HHI = 0.3769514595;
- FIRST max/min risk = 2.44266646.

Equal-capital:
- FIRST preview notional = NT$100,484.28;
- FIRST HHI = 0.3551615396.

Exhaustive 946-state FIRST-only minimum:
- allocation = 70k / 42k / 56k;
- FIRST HHI = 0.3343161104.

Thus:
- current − equal FIRST HHI = +0.0217899199;
- current − global-min FIRST HHI = +0.0426353491.

Current FIRST-only HHI is also slightly **higher** than current full-plan preview HHI:
0.3769514595 vs 0.3767077818, delta +0.0002436776.

Therefore the counter-hypothesis
`the concentration only appears when the full 60%+40% planned position is counted`
is rejected on the available multi-name witness.

This remains plan-preview geometry, not realized exposure.

Durable receipt:
`research/first_tranche_risk_production_receipt_20260928.json`.

Status:
`FIRST_TRANCHE_CONCENTRATION_SURVIVES / LIFECYCLE_STAGE_ARTIFACT_FALSIFIED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-065 — ADD-tranche risk concentration test (2026-09-28)

PR-064 showed the structural concentration survives in FIRST-only preview exposure. PR-065 tests the complementary Formal 40% ADD tranche.

For each multi-name date:
- FIRST amount = round(totalAllocation × 0.60);
- ADD amount = totalAllocation − FIRST amount;
- ADD preview shares = floor(ADD amount / buyHigh);
- ADD projected stop-risk = ADD preview notional × conservative stop-risk fraction.

The audit compares:
1. current PriorityScore sizing;
2. same-deployment equal capital;
3. exhaustive NT$1,000-grid minimum ADD-preview HHI under the same 35% cap.

This is intentionally independent of execution state. It does **not** assume FIRST was filled or that ADD ever triggered.

The counter-hypothesis is:
`the concentration direction is specific to FIRST/full-plan and reverses or disappears in the smaller ADD tranche because share quantization differs.`

Artifacts:
`research/add_tranche_risk_concentration_v0_1.mjs`;
`research/add_tranche_risk_concentration_spec_v0_1.json`;
`tests/portfolio_risk_add_tranche_readonly_audit.mjs`.

Status:
`ADD_TRANCHE_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-065 Production result — concentration also survives ADD-only preview

Read-only Production run `36352942937` / job `108714975039` tested 2026-09-18 using only the Formal ADD tranche.

Current PriorityScore sizing:
- ADD preview notional = NT$66,861.92;
- ADD projected stop-risk = NT$2,578.20;
- ADD HHI = 0.3763426432;
- ADD max/min risk = 2.43024727.

Equal-capital:
- ADD preview notional = NT$67,155.16;
- ADD HHI = 0.3557339695.

Exhaustive 946-state ADD-only minimum:
- allocation = 70k / 42k / 56k;
- ADD HHI = 0.3342266703.

Thus:
- current − equal ADD HHI = +0.0206086737;
- current − global-min ADD HHI = +0.0421159729.

ADD-only HHI is slightly below current full-plan preview HHI:
0.3763426432 vs 0.3767077818, delta -0.0003651386.

Combined with PR-064, the concentration direction now survives:
- FIRST-only;
- ADD-only;
- FULL preview.

The stage changes the exact HHI slightly but does not reverse the structural result.

Durable receipt:
`research/add_tranche_risk_production_receipt_20260928.json`.

Status:
`ADD_TRANCHE_CONCENTRATION_SURVIVES / TRANCHE_STAGE_REVERSAL_FALSIFIED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-066 — lifecycle × concentration-metric sensitivity (2026-09-28)

PR-062 established metric robustness for full planned exposure, while PR-064/065 established HHI robustness for FIRST and ADD separately.

PR-066 crosses both dimensions:

- lifecycle stages: FIRST, ADD, FULL;
- metrics: HHI, Gini, CV, maximum contribution share, max/min.

For every stage-metric cell, Production compares:
1. current PriorityScore sizing;
2. equal capital;
3. metric-specific exhaustive NT$1,000-grid global minimum under the same deployment and 35% cap.

This creates 15 directional falsification cells.

The purpose is to prevent a compound artifact:
`the conclusion appears robust by stage only because HHI was used, or robust by metric only because FULL exposure was used.`

Exact global optima are allowed to differ. Direction is the falsification target.

Artifacts:
`research/lifecycle_metric_sensitivity_v0_1.mjs`;
`research/lifecycle_metric_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_lifecycle_metric_sensitivity_readonly_audit.mjs`.

Status:
`LIFECYCLE_METRIC_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-066 Production result — 15/15 lifecycle × metric cells preserve the direction

Read-only Production run `36353326188` / job `108716060944` evaluated 2026-09-18 across:
- FIRST, ADD, FULL;
- HHI, Gini, CV, maximum risk share, max/min;
- all 946 legal NT$1,000 allocation states per stage.

Directional agreement:
- current > equal-capital concentration = **15/15**;
- current > metric-specific global minimum = **15/15**.

HHI summary:
- FIRST: current 0.3769514595 / equal 0.3551615396 / global min 0.3343161104;
- ADD: current 0.3763426432 / equal 0.3557339695 / global min 0.3342266703;
- FULL: current 0.3767077818 / equal 0.3553897407 / global min 0.3342785411.

Under buyHigh plan-preview semantics, all 15 stage-metric cells have the same unique global-min allocation:
`70k / 42k / 56k`.

That convergence is strong structural evidence for this witness, but it is not universal: PR-060 already shows the exact optimum moves when buyLow/midpoint are used instead of buyHigh.

Therefore both compound counter-hypotheses are rejected:
- stage robustness is not merely an HHI artifact;
- metric robustness is not merely a FULL-position artifact.

Durable receipt:
`research/lifecycle_metric_sensitivity_production_receipt_20260928.json`.

Status:
`LIFECYCLE_X_METRIC_ARTIFACT_FALSIFIED / 15_OF_15_DIRECTIONAL_AGREEMENT / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-067 — one-grid local allocation falsification (2026-09-28)

The exhaustive global searches show current sizing is not the concentration minimum. PR-067 asks a stricter and more local question:

`Is the current allocation at least a local concentration optimum on the Formal NT$1,000 grid?`

Starting from the observed current allocation, enumerate every legal directed transfer of exactly NT$1,000 from one selected name to another while preserving:
- same selected names;
- same total planned deployment;
- 35% per-name cap;
- positive per-name allocation.

Each one-step neighbor is evaluated across 15 cells:
- FIRST / ADD / FULL;
- HHI / Gini / CV / maximum risk share / max-min.

A neighbor `weakly dominates current` only if it improves at least one cell and worsens none.

This deliberately avoids relying on a distant global optimum. If a one-grid move already dominates current, the structural concentration has a local downhill direction.

Artifacts:
`research/local_grid_reallocation_v0_1.mjs`;
`research/local_grid_reallocation_spec_v0_1.json`;
`tests/portfolio_risk_local_grid_reallocation_readonly_audit.mjs`.

Status:
`LOCAL_NEIGHBORHOOD_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-067 Production result — current sizing is not a one-grid local concentration optimum

Read-only Production run `36353663428` / job `108717034051` evaluated all six legal directed NT$1,000 transfers around the 2026-09-18 current allocation:

`50k / 64k / 54k`.

Across the 15 FIRST/ADD/FULL × concentration-metric cells, two one-step moves strictly dominate current:

### 3105 -> 2006

New allocation:
`51k / 63k / 54k`.

Result:
- improved cells = 15;
- worsened cells = 0.

FULL deltas versus current:
- HHI = -0.0031753015;
- Gini = -0.0072141368;
- CV = -0.0134547140;
- max risk share = -0.0059580253;
- max/min = -0.0860813875.

### 3105 -> 6133

New allocation:
`50k / 63k / 55k`.

Result:
- improved cells = 15;
- worsened cells = 0.

FULL deltas:
- HHI = -0.0025063406;
- Gini = -0.0047377054;
- CV = -0.0105771343;
- max risk share = -0.0066849619;
- max/min = -0.0380891095.

The reverse-direction transfers into 3105 from either 2006 or 6133 worsen all 15 cells.

Therefore:
`current allocation is a Pareto local concentration optimum`
is rejected.

This is stronger than the distant-global-optimum evidence because concentration can be reduced by the smallest permitted NT$1,000 move.

### Critical limit

This is **not** an allocation recommendation.

3105 has the highest PriorityScore on the witness. A local risk-concentration improvement can still destroy expected return if that score contains genuine prospective alpha. Economic sizing dominance remains untested.

Durable receipt:
`research/local_grid_reallocation_production_receipt_20260928.json`.

Status:
`CURRENT_NOT_LOCAL_CONCENTRATION_OPTIMUM / TWO_STRICTLY_DOMINATING_ONE_GRID_MOVES / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-062 — execute the pre-registered PriorityScore × stop-distance interaction test (2026-09-28)

PR-042 froze three competing hypotheses before prospective data:
- amplification;
- neutral;
- natural offset.

PR-062 now executes the **mechanical within-date** part of that protocol on available Production plan geometry.

For every identifying multi-name date and for BUY_LOW / MIDPOINT / BUY_HIGH references, the audit records:
- Spearman(PriorityScore, stop-risk%);
- Kendall tau;
- Pearson correlation;
- whether the highest-score name is also the widest-stop name;
- exact descending rank-order agreement;
- score-share × stop-risk covariance;
- exact within-set permutation diagnostics.

The exact permutation result is deliberately treated as descriptive only. With only three names and one date it cannot be promoted into population significance or OOS evidence.

Artifacts:
`research/score_stop_interaction_audit_v0_1.mjs`;
`research/score_stop_interaction_audit_spec_v0_1.json`;
`tests/portfolio_risk_score_stop_interaction_readonly_audit.mjs`.

Status:
`PR042_EXECUTION_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-062 Production result — perfect within-date score/stop rank concordance, tiny-n only

Read-only Production run `36377294110` / job `108785634124` evaluated 2026-09-18.

PriorityScore order:
`3105 > 6133 > 2006`.

The stop-risk order is identical under all three entry references:
`3105 > 6133 > 2006`.

Results:
- BUY_LOW: Spearman = 1, Kendall τ = 1, Pearson = 0.98098681;
- MIDPOINT: Spearman = 1, Kendall τ = 1, Pearson = 0.98061825;
- BUY_HIGH: Spearman = 1, Kendall τ = 1, Pearson = 0.98025167.

3105 is simultaneously the highest PriorityScore and widest-stop name under every reference.

This confirms the **mechanical amplification witness** on 2026-09-18: score-proportional sizing tilted more capital toward names with wider planned stop geometry.

However n=3 gives only 6 rank permutations. The exact one-sided permutation diagnostic is 1/6 = 0.16666667 and the two-sided diagnostic is 1/3 = 0.33333333.

Therefore this is not population significance and not OOS evidence. The PR-042 population question remains open until independent multi-name dates accumulate.

Receipt:
`research/score_stop_interaction_production_receipt_20260928.json`.

Status:
`MECHANICAL_AMPLIFICATION_WITNESS_CONFIRMED / POPULATION_DIRECTION_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 — FIRST/ADD tranche-ratio sensitivity sweep (2026-09-28)

FIRST-only and ADD-only audits both preserve the 2026-09-18 structural concentration. PR-063 tests a stronger counter-hypothesis:

`The concentration is a special artifact of the current 60/40 split.`

The FIRST ratio is swept from 40% to 90% in 5-point increments. At every ratio:
- FIRST amount = round(allocation × ratio);
- ADD amount = allocation - FIRST amount;
- each tranche is integer-share floored at buyHigh;
- the two tranche preview notionals are recombined.

For each ratio the audit compares:
1. current PriorityScore allocation;
2. same-deployment equal capital;
3. exhaustive NT$1,000-grid minimum HHI under the same 35% cap and the same ratio-specific share flooring.

Interpretation is frozen:
- persistent current > equal-capital > / or current > global minimum across the ratio grid rejects a 60/40-specific explanation;
- direction reversals over a material part of the grid would downgrade the structural finding as ratio-sensitive.

Artifacts:
`research/tranche_ratio_sensitivity_v0_1.mjs`;
`research/tranche_ratio_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_tranche_ratio_sensitivity_readonly_audit.mjs`.

Status:
`TRANCHE_RATIO_SENSITIVITY_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 Production result — concentration survives FIRST-ratio sweep from 40% to 90%

Read-only Production run `36377784618` / job `108787059102` evaluated 2026-09-18.

FIRST ratios tested:
`40%, 45%, 50%, 55%, 60%, 65%, 70%, 75%, 80%, 85%, 90%`.

At every ratio:
- current PriorityScore sizing HHI > same-deployment equal-capital HHI;
- current PriorityScore sizing HHI > exhaustive ratio-specific NT$1,000-grid minimum HHI.

Directional agreement:
- current > equal-capital: **11 / 11**;
- current > global minimum: **11 / 11**.

Examples:
- 40/60: current HHI 0.3767077818, equal-capital 0.3553897407, global minimum 0.3342785411;
- 60/40: current HHI 0.3767077818, equal-capital 0.3553897407, global minimum 0.3342785411.

The exact optimum can move by one NT$1,000 grid unit as integer-share flooring changes, but the concentration direction does not reverse over the tested range.

Thus the counter-hypothesis
`the structural finding is specific to the 60/40 tranche split`
is rejected over FIRST ratios 40%-90%.

A more extreme 5%-95% stress test remains separately useful because integer-share flooring can create larger discontinuities when one tranche becomes very small.

Receipt:
`research/tranche_ratio_sensitivity_production_receipt_20260928.json`.

Status:
`TRANCHE_RATIO_ARTIFACT_FALSIFIED_40_TO_90 / EXTREME_RATIO_STRESS_PENDING / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-064 — extreme tranche-ratio stress and two-stage orderability (2026-09-28)

PR-063 rejected a 60/40-specific concentration artifact over FIRST ratios 40%-90%.

PR-064 pushes the stress further and separates two different questions:

### Structural concentration

FIRST ratio is swept from 5% to 95% in 5-point steps.

At each ratio the same ratio-specific two-tranche share flooring is applied to:
- current PriorityScore allocation;
- equal-capital allocation;
- every legal NT$1,000-grid comparator state.

This asks whether the concentration direction survives much more extreme split assumptions.

### Two-stage orderability

FIRST ratio is swept from 1% to 99% in 1-point steps.

For each selected name, both planned stages must separately satisfy:
- FIRST shares >= 1;
- ADD shares >= 1;
using buyHigh as the conservative plan-preview price.

A ratio can therefore be:
- structurally valid for concentration analysis;
- but operationally infeasible for a two-stage execution path because one tranche rounds to zero shares.

This is intentionally stronger than checking combined shares only.

Artifacts:
`research/tranche_stage_orderability_v0_1.mjs`;
`research/extreme_tranche_ratio_stress_spec_v0_1.json`;
`tests/portfolio_risk_extreme_tranche_ratio_readonly_audit.mjs`.

Status:
`EXTREME_RATIO_STRESS_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-064 Production result — extreme ratio direction survives; current plan is two-stage orderable 1%-99%

Read-only Production run `36378225540` / job `108788327294` evaluated 2026-09-18.

### Current two-stage orderability

FIRST ratios from 1% through 99% were tested in 1-point steps.

Result:
- tested ratios = 99;
- all names have FIRST shares >= 1 and ADD shares >= 1 at every ratio;
- feasible ratios = **99 / 99**.

Even at FIRST = 1%, the high-price 3105 plan still has:
- FIRST amount = NT$640;
- buyHigh = 496.92;
- FIRST shares = 1.

Thus the current 50k / 64k / 54k allocation remains plan-preview two-stage orderable throughout the full 1%-99% ratio grid.

### Extreme concentration sweep

FIRST ratios from 5% through 95% were tested in 5-point steps.

Directional agreement:
- current > equal-capital HHI = **19 / 19**;
- current > ratio-specific global minimum HHI = **19 / 19**.

This rejects tranche-ratio reversal over a much broader range than PR-063.

### Remaining comparator caveat

The exhaustive global-min search currently requires positive combined preview shares, but has not yet required each comparator name to have >=1 FIRST share **and** >=1 ADD share.

Therefore the next falsification must recompute the global minimum over only **two-stage-orderable comparator states**.

Receipt:
`research/extreme_tranche_ratio_production_receipt_20260928.json`.

Status:
`EXTREME_RATIO_DIRECTION_ROBUST / CURRENT_TWO_STAGE_ORDERABLE_1_TO_99 / COMPARATOR_STAGE_FEASIBILITY_PENDING / ECONOMIC_VALUE_UNKNOWN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-065 — enforce two-stage orderability on global grid minima (2026-09-28)

PR-064 showed the current 2026-09-18 plan remains two-stage orderable for FIRST ratios 1%-99%.

A stricter caveat remained:
the ratio-specific global minimum HHI search had not required each **comparator** name to have:
- FIRST shares >= 1;
- ADD shares >= 1.

PR-065 recomputes the exhaustive NT$1,000-grid search for FIRST ratios 5%-95%.

For every ratio it reports:
- all legal allocation states;
- the unconstrained global minimum HHI;
- the count of states where every name is orderable in both stages;
- the global minimum HHI within that two-stage-feasible subset;
- whether the minimum changes;
- whether every unconstrained optimum is already two-stage feasible.

Interpretation:
- if the minima are unchanged, the prior low-concentration comparator is not a mathematical artifact of allowing a zero-share tranche;
- if the minima rise materially, prior comparator evidence must be downgraded as execution-feasibility sensitive.

Artifacts:
`research/stage_feasible_grid_sensitivity_v0_1.mjs`;
`research/stage_feasible_grid_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_stage_feasible_grid_readonly_audit.mjs`.

Status:
`STAGE_FEASIBLE_GRID_AUDIT_READY / PRODUCTION_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-065 Production result — global minima survive two-stage orderability constraint

Read-only Production run `36378589526` / job `108789397492` evaluated 2026-09-18 across FIRST ratios 5%-95%.

For every tested ratio:
- legal NT$1,000-grid states = 946;
- the stage-feasible minimum HHI equals the unconstrained minimum HHI;
- every unconstrained HHI optimum is already two-stage orderable.

Summary:
- tested ratios = **19**;
- global minimum unchanged after requiring FIRST>=1 and ADD>=1 share for every name = **19 / 19**;
- unconstrained optima already two-stage feasible = **19 / 19**.

At the tested ratio range, the same-deployment + 35% cap geometry itself keeps every legal allocation large enough to avoid zero-share tranches.

Therefore the remaining PR-064 caveat is closed:

`the low-concentration comparator is not a mathematical artifact of allowing an unorderable zero-share tranche.`

This still does not prove fills or economic superiority.

Receipt:
`research/stage_feasible_grid_production_receipt_20260928.json`.

Status:
`COMPARATOR_STAGE_FEASIBILITY_CAVEAT_CLOSED / GLOBAL_MINIMA_UNCHANGED_19_OF_19 / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-066 — per-name capital-cap sensitivity (2026-09-28)

Several low-concentration comparators allocate 2006 near the current Formal 35% per-name cap. PR-066 tests whether that specific cap value creates the comparator advantage.

The cap is swept from 32% through 50% in 1-point steps.

Why start at 32%:
the observed 2026-09-18 current allocation has a maximum name allocation of NT$64,000 / NT$200,000 = 32%. Caps below 32% make the observed current allocation itself illegal and therefore cannot support a fair current-vs-comparator cap sensitivity claim.

At each valid cap:
- same selected names;
- same NT$168,000 planned deployment;
- NT$1,000 allocation grid;
- 60/40 tranche split;
- buyHigh integer-share flooring;
- every comparator name must be orderable in both FIRST and ADD.

The exhaustive cap-specific minimum HHI is compared with the unchanged current allocation HHI.

Interpretation:
- if current remains above the global minimum across the cap grid, the structural comparator advantage is not a 35%-specific artifact;
- if the gap disappears/reverses at valid caps, prior evidence must be downgraded as cap-sensitive.

Artifacts:
`research/per_name_cap_sensitivity_v0_1.mjs`;
`research/per_name_cap_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_per_name_cap_sensitivity_readonly_audit.mjs`.

Status:
`PER_NAME_CAP_SENSITIVITY_READY / PRODUCTION_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.
