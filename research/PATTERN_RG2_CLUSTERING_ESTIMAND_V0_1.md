# D01 DL-015 — PATTERN-RG2 Cross-Parent Clustering & Preregistered Estimand V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / PREREGISTERED / OUTCOME_CLOSED / FORMAL_CORE_LOCKED

## 1. Purpose

This tranche freezes the statistical target and sample identity for PATTERN-RG2 before any outcome join.

It does NOT inspect future returns, MFE, MAE or failure labels.

It does NOT create R09, a new Pattern score, a new ranking rule, a hard resistance veto or any Formal behavior change.

PATTERN-RG2 remains the already-frozen nested-resistance research family.

## 2. Five identities must not be confused

1. parentDecisionReceiptId = one immutable symbol decision state in one scan generation.
2. scanDate = common market decision date and primary common-shock grouping.
3. symbol = the listed security; multiple structural episodes on one symbol remain potentially dependent.
4. relationEpisodeKey = one immutable local-boundary × major-parent-zone RG2 relation across dates.
5. observation row = one as-of snapshot of that relation attached to one parent.

One relationEpisodeKey can appear under multiple parentDecisionReceiptIds as the same relation evolves longitudinally.

A new localBoundaryVersion or parentZoneVersion creates a new relation episode. Lifecycle progress alone does not.

## 3. Parent-outcome multiplicity firewall

One immutable parent has exactly one future outcome vector for a given outcome contract.

Therefore zero/many Pattern child rows must NEVER multiply that parent outcome into independent evidence.

After deterministic Pattern evidence de-dup:

- 0 unique RG2 relations => NO_RG2_RELATION.
- exactly 1 unique RG2 relation => SINGLE_RELATION_ELIGIBLE for the primary RG2 estimand.
- >1 non-equivalent RG2 relations => MULTI_RELATION_AMBIGUOUS.
- duplicate identical relation item keys under one parent => QA_FAIL_DUPLICATE_RELATION.
- same relation item key with conflicting immutable fingerprint => PROVENANCE_CONFLICT.

Primary B0/B1 inference uses SINGLE_RELATION_ELIGIBLE only.

MULTI_RELATION_AMBIGUOUS remains in coverage diagnostics and is NOT silently dropped from denominator reporting. No nearest/best/strongest relation may be chosen after outcomes.

A future set-valued multi-relation model would require a new preregistered experiment/version.

## 4. Dependence structure

Primary dependence dimensions:
- scanDate: same-date symbols share market/sector/liquidity/news shocks.
- symbol: the same stock can carry persistent unobserved characteristics and can generate multiple RG2 episodes over time.

relationEpisodeKey is a de-dup / longitudinal identity, not a replacement for symbol clustering.

This is stricter than clustering only by episode because separate episodes on the same symbol need not be independent.

Primary effect estimates are equal-scanDate weighted whenever a date-level aggregation is used.

Required robustness:
- leave-one-scanDate-out;
- episode-first-observation sensitivity;
- episode-holdout sensitivity;
- overlapping-outcome-window sensitivity;
- regime / industry concentration diagnostics.

Exact finite-sample inference implementation is owned by D16 Statistical Validation and must be preregistered before outcomes.

D01 requires that D16 handle both time/date dependence and within-symbol persistence. Naive iid standard errors are prohibited.

## 5. Existing global maturity gates remain authoritative

Do not invent a second D01 maturity threshold.

Inherit RESEARCH_WORKLIST global gates:
- at least 60 mature D5 rows;
- at least 30 prospective complete snapshots;
- at least 15 independent Formal scan dates;
- at least 10 valid leave-one-date-out checks;
- at least 2 years;
- at least 2 market regimes;
- purged training at least 10 scan dates;
- holdout at least 5 scan dates;
- training/holdout direction consistency;
- coverage / zero-pick / redundancy / cost / overfit gates.

Important small-cluster guard:
15 scan dates is the existing governance minimum for review eligibility, NOT proof that asymptotic two-way cluster standard errors are accurate.

When date clusters remain small, D16 must use an appropriate finite-sample robust procedure or resampling diagnostic and must not rely on a naive asymptotic t-statistic alone.

## 6. Common-support sample contract

A row can enter promotion-grade B0-vs-B1 comparison only when ALL are true:
- immutable parent generation certified;
- Pattern ROOT run COMPLETE;
- exactly one primary RG2 relation after de-dup;
- B0 fields complete under their canonical receipts;
- B1 RG2 fields complete;
- outcome maturity/provenance valid;
- same symbol/date belongs to both B0 and B1 evaluation sets;
- no UNKNOWN coerced to zero;
- no later vintage substituted for decision-time evidence.

If B1 is unavailable but B0 is available, the row is coverage-missing for the paired estimand, not a B1 failure.

Report B0-only / B1-only / common-support counts by scanDate, pool, market, regime and major missing reason.

## 7. Frozen baseline information sets

### B0_PRICE_STRUCTURE — diagnostic baseline

Reuse the already-frozen direct price/structure controls:
- priorHigh20 / priorHigh60;
- simple 260-session-high distance;
- MA60 / MA120 location where causally available;
- ret20 / ret60;
- ATR / realized-volatility state;
- close location / upper-shadow context;
- daily Pattern major-zone / current setup state.

This baseline asks whether RG2 is more than generic long-horizon price location/trend.

### B0_FULL_CONTEXT — promotion-grade baseline

B0_PRICE_STRUCTURE plus canonical:
- D02 price-volume acceptance / persistence where applicable;
- market and sector regime;
- liquidity;
- frozen round-price proximity control.

If RG2 appears incremental against B0_PRICE_STRUCTURE but not B0_FULL_CONTEXT, classify CONTEXT_PROXY_RISK; do not claim independent Pattern alpha.

## 8. Frozen RG2 challenger information set

B1 = corresponding B0 + RG2_CORE_V0_1.

RG2_CORE_V0_1 contains:
- availableAirToParentLowerPct;
- geometryRelationState;
- compoundLifecycleState;
- parentZoneAgeEligibleSessions.

Diagnostic-only fields retained but NOT added to RG2_CORE_V0_1 primary challenger:
- availableAirToParentLowerATR;
- distanceLocalToParentCenterPct;
- repeatedTouchProgression detail vector.

Reason: avoid expanding the first challenger into a factor zoo. Any promotion of diagnostic fields into the primary challenger is a new experiment version and counts toward multiple testing.

## 9. Co-primary outcomes

PATTERN-RG2 mechanism concerns both opportunity and adverse path risk.

Freeze two co-primary D5 endpoints:
- D5 MFE percent;
- D5 MAE percent.

Secondary endpoints:
- D5 returnPct;
- D10 MFE / MAE;
- structural reentry / failed-break chronology;
- no-follow-through continuous descriptors.

Co-primary means both are tracked and counted in the same multiple-testing family. Do not select whichever looks better after results.

## 10. Primary estimand target

Define per-parent forecast loss under the same holdout row:
- L0 = loss of B0 forecast;
- L1 = loss of B1 forecast.

Row loss differential:
d = L0 - L1.

Positive d means B1 has lower predictive loss.

For each clean scanDate t:
D_t = mean(d_it across common-support eligible parents on date t).

Primary target:
ESTIMAND_E1 = equal-weight mean of D_t across eligible holdout scanDates.

This date-balanced target prevents a high-count date from dominating only because it had more symbols.

Raw pooled-row loss difference is descriptive only.

Because B1 nests B0, raw MSPE superiority alone is not sufficient evidence. D16 owns the exact valid nested-model forecast-comparison method and must preregister it before outcome access.

## 11. Forward OOS / purge contract

Split only by scanDate in chronological order. Random row split is prohibited.

For each outcome horizon:
- training dates whose forward outcome window crosses the first holdout date are purged;
- holdout is never used to choose features, encodings, transformations, loss functions or relation-selection rules;
- feature scaling / encoding is fit on training only.

Same relation episode may legitimately continue from training into holdout under the realistic forward-production estimand because prior states were genuinely known at the time.

However, this can overstate generalization to new structural episodes.

Therefore freeze an episode-holdout sensitivity:
remove from training every relationEpisodeKey that appears in the holdout.

If realistic forward OOS looks useful but episode-holdout collapses, label EPISODE_MEMORIZATION_RISK.

## 12. Episode-first sensitivity

Create a deterministic sensitivity set containing only the first promotion-grade eligible observation of each relationEpisodeKey.

Earliest ordering:
scanDate -> as_of -> parentDecisionReceiptId.

Recompute the same date-balanced estimand on that set.

If the full longitudinal result materially depends on repeat observations from long-lived episodes, label LONGITUDINAL_REPEAT_DEPENDENCE.

This is a robustness diagnostic, not an alternative primary winner-selection path.

## 13. Overlapping outcome-window sensitivity

Adjacent scan dates can have overlapping D5/D10 future windows, creating strong dependence in forecast loss differentials.

Primary inference must account for this dependence.

Also freeze a deterministic non-overlapping-date sensitivity:
- start from the earliest eligible clean scanDate;
- include the next scanDate only when its forward outcome window begins after the prior selected date's outcome window ends;
- continue greedily in chronological order;
- never choose the anchor after seeing outcomes.

If the result exists only when heavily overlapping dates are pooled, label OUTCOME_WINDOW_DEPENDENCE.

## 14. Small-cluster / strong-dependence handoff to D16

Methodological evidence motivates two guards:

1. Finance panels commonly require simultaneous time and entity dependence handling; firm-only or time-only clustering can be insufficient.
2. Conventional cluster-robust or Diebold-Mariano-style inference can be unreliable with few clusters or strongly dependent loss differentials.

D16 must freeze the exact finite-sample inference method before outcome access.

Candidate methodological families for D16 review include:
- multi-way cluster-robust covariance;
- wild-cluster / cluster-resampling diagnostics where appropriate;
- date-level paired loss-differential inference with dependence correction;
- nested-model forecast comparison adjustment such as Clark-West where its assumptions fit.

D01 does not choose the p-value method or significance cutoff here; that belongs to D16.

References:
- Cameron, Gelbach & Miller, Robust Inference with Multi-way Clustering, NBER T0327.
- Petersen (2011), Journal of Financial Economics, DOI 10.1016/j.jfineco.2010.08.016.
- MacKinnon, Nielsen & Webb (2023), Journal of Econometrics, DOI 10.1016/j.jeconom.2022.04.001.
- Clark & West (2007), Journal of Econometrics, DOI 10.1016/j.jeconom.2006.05.023.
- Coroneo & Iacone (2025), International Journal of Forecasting, DOI 10.1016/j.ijforecast.2024.11.003.

## 15. Interpretation states

Possible future classifications are frozen before outcomes:

- NO_INCREMENTAL_VALUE: B1 does not improve promotion-grade B0_FULL_CONTEXT.
- PRICE_REDUNDANCY: loses already against B0_PRICE_STRUCTURE.
- CONTEXT_PROXY_RISK: survives price-only baseline but loses after D02/regime/liquidity/round-price controls.
- FRAGILE_DATE_DEPENDENCE: driven by a small number of scan dates.
- LONGITUDINAL_REPEAT_DEPENDENCE: effect collapses on episode-first sensitivity.
- EPISODE_MEMORIZATION_RISK: effect collapses when holdout episodes are removed from training.
- OUTCOME_WINDOW_DEPENDENCE: effect collapses on non-overlapping-date sensitivity.
- REGIME_OR_INDUSTRY_CONCENTRATED: effect exists only in narrow concentration without stable broader evidence.
- PREDICTIVE_INCREMENTALITY_CANDIDATE: survives preregistered B0_FULL_CONTEXT, date/episode/window robustness, holdout and governance checks.

PREDICTIVE_INCREMENTALITY_CANDIDATE is still research status only. It does not authorize Formal promotion.

## 16. Multiple-testing accounting

All of the following stay in one PATTERN_RG2 family ledger:
- B0_PRICE_STRUCTURE diagnostic contrast;
- B0_FULL_CONTEXT primary promotion contrast;
- D5 MFE and D5 MAE co-primary endpoints;
- D5 return / D10 / lifecycle secondary endpoints;
- episode-first sensitivity;
- episode-holdout sensitivity;
- non-overlapping-date sensitivity;
- boundary-sensitivity control from DL-013.

Sensitivities are not independent new alpha wins. Failed variants remain recorded.

Do not create a new experiment ID merely because a robustness view has a different name.

## 17. Outcome firewall

Current state remains:
- no Pattern outcome join;
- no historical Shadow fabrication;
- no runtime Pattern observer wiring;
- no B0/B1 model fit;
- no p-value;
- no direction claim;
- no score / gate / rank / BUY / SELL impact.

PATTERN_RG2 = PREREGISTERED / OUTCOME_CLOSED / ALPHA_UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 18. Exact next continuation

1. Build an outcome-blind sample-unit / multiplicity helper for RG2 parents and relation episodes.
2. Freeze a machine-readable D16 validation handoff describing dependence units, estimands, common-support and method requirements.
3. Audit RG2_CORE_V0_1 field observability against the future shared-child v0.3 schema; missing canonical mappings remain BLOCKED.
4. Do not fit B0/B1 or inspect outcomes.
5. Keep D01 maturity unchanged until genuine prospective/OOS evidence exists.