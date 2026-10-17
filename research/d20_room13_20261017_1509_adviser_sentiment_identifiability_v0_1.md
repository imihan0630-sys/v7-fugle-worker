# Room13 D20-10/D20-12 — 2026-10-17 professional-adviser sentiment measurement falsification

Status: RESEARCH_ONLY / SECONDARY_SOURCE / NO_PROMOTION
Governance: Formal Core LOCKED; no tracker/prereg/strategy change.
Continuation: builds on the prior 2026-10-17 10:14 Cathay vs NCU survey-semantic work; does not repeat it.

## New source and strict evidence grade

Official FPAT event confirms launch of a new Taiwanese certified financial-planner sentiment index on 2026-10-07: https://www.cfp.org.tw/2026-wfpd-taiwan-forum/

The event press statement, syndicated at https://more-news.tw/737694/ and https://more-news.tw/737938/, describes the July/August/September 2026 first three waves, 1,098 valid first-wave questionnaires, 503 respondents with complete answers in all three waves, monthly questionnaires on the 15th–20th and scheduled releases on the 25th. These are **secondary press figures**: original issuer bytes, source SHA, per-wave respondent microdata, publication clock and index construction files remain UNKNOWN. Do not promote to an L4 primary parent.

## Observed published aggregate numbers and arithmetic

| Wave | Client momentum as perceived by adviser | Adviser's own momentum | Client minus adviser |
|---|---:|---:|---:|
| July | 73.6 | 73.4 | +0.2 |
| August | 61.1 | 67.3 | -6.2 |
| September | 60.2 | 66.0 | -5.8 |

July-to-August client change -12.5; adviser change -6.1; gap change -6.4 index points. August-to-September gap change +0.4. These are descriptive aggregate differences, **not** within-person matched causal effects, psychological diagnoses, or statistical significance. The press statement does not establish that the published aggregate indices are calculated exclusively from the 503 complete three-wave respondents.

503/1098 = 45.81% is a complete-three-wave count relative to the first-wave valid count. It is NOT an identified dropout rate, and complete-case conditioning may induce nonresponse/selection bias.

## Measurement-scale falsification

For an identical ternary response question with positive share p, neutral n, negative q, p+n+q=1:
- FPAT-type 0–100 score S100 = 100p + 50n = 50 + 50(p-q).
- NCU-type 0–200 score S200 = 100 + 100p - 100q = 100 + 100(p-q).
- Thus S200 = 2*S100 **only if question, response classes, population and information clock are identical**.

Actual FPAT, Cathay and NCU questions/populations/times are not identical. Numeric conversion is a mathematical identity, not permission to compare or merge them into one sentiment vote.

## Joint-response non-identifiability

The prior Cathay September survey reports 62.6% expecting Taiwan stocks to rise; NCU September reports 14.2% judging the period a good time to invest. In a strictly hypothetical SAME population and time, Frechet bounds on their intersection are 0–14.2 percentage points, and on good-time conditional on up-expectation 0–22.68%. Actual surveys differ in sampling frame, survey time and question, so even those numerical joint bounds are **not valid estimates for the real joint distribution**. Direct matched individual responses would be needed.

## Behavior hypothesis, structural alternative, falsification

H1: adviser-client divergence might reflect differences in risk perception and constraints. Observable: the same respondent's own vs perceived-client answer at the same time, with stable respondent linkage. Alternatives: adviser projection, selection of adviser clientele, financial constraints, costs, common news, response composition and changing respondent pool. Falsify by matched-panel re-estimation, missingness sensitivity, independent actual-client responses and market-state controls. If no respondent-level pairing/source-vintage: behavioral cause UNKNOWN.

H2: index-scale differences may create spurious cross-source disagreement. Observable: original wording and p/n/q category shares. Structural alternative: genuine differences in populations/risks. Falsify on identical wording and representative same-clock samples. Otherwise cross-survey causal claims UNKNOWN.

H3: three-wave complete panel reduces some compositional variation but may amplify survivorship bias. Observable: wave-specific response counts, anonymized panel IDs, weighting, attrition by prior stance. Falsify if complete-case vs all-wave aggregate results diverge or missingness depends on previous sentiment. Without microdata: UNKNOWN.

## Quality gates

PIT: first public event October 7, not July/September. Our research capture October 17; exact issuer first-known time, raw source SHA UNKNOWN. October 25 future scheduled publication cannot be backfilled.
OOS / walk-forward: no qualified new sample. Original frozen D20-10 Cathay survey remains primary; FPAT is a possible **external negative-control candidate** only, subject to source and owner-governance approval.
Selection/survivorship: certified planners and their selected clientele are not all Taiwan investors; complete-three-wave subset can be selected.
Data mining/multiple testing/overfit: no return-based parameter selection; six questions, two viewpoints, three waves are not independent experiments.
Redundancy: FPAT, Cathay, NCU may reflect the same common market news and cannot be counted as three independent votes.
Cost/regime: trade costs and robust multi-regime predictive value UNKNOWN; no live trading recommendation.
Social fixed-slot capture: no primary new sample; native PTT Atom access failed, Firecrawl remaining credits -1000. Actual article count UNKNOWN, not zero.
D20-13: Saturday is not an eligible Taiwan trading day for 09:15/12:00/15:20 TWSE borrowing slots.

## Tests and continuation

30 synthetic/arithmetic checks PASS in local oracle; they are NOT 30 market observations.
D20-10 and D20-12 remain L3/60%; D20-13 L2/40%; D20 domain 58.5%, overall 47.9%, no promotion.
Exact next: obtain FPAT issuer-native immutable index release, source clock and wave denominators; then evaluate only external-control eligibility. Continue next genuine D20-13 trading-day slot and next actually executed Room13 fixed :10 social source capture. Never fabricate missing snapshots or historical Shadow.
