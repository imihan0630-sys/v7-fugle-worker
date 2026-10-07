# D16｜Source-Acquisition Coarsening and Observation-Channel Missingness Addendum V0.1

更新：2026-10-07 Asia/Taipei
狀態：RESEARCH_ONLY / OBSERVATION-MECHANISM CONTRACT FROZEN
主責：11｜統計驗證與策略市場狀態研究室 / D16
Formal Core impact：NONE
成熟度影響：NONE

## 1. Trigger

The 2026-10-07 System1 quality-only live recovery reached the official MOPS batch-financial source and exhausted the configured bounded transport retries before a complete response body was observed.

This creates a concrete distinction between:
- source data existence/publication;
- source transport observability;
- successful ingestion;
- semantic validation;
- downstream research admission.

A failure at an earlier stage cannot be relabeled as failure at a later stage.

## 2. Observation chain

For each required dataset/date, preserve independent stage states:

1. PROVIDER_PUBLICATION_STATE
2. TRANSPORT_ACCESS_STATE
3. BODY_COMPLETION_STATE
4. PARSE_STATE
5. SEMANTIC_VALIDATION_STATE
6. PERSISTENCE_READBACK_STATE
7. RESEARCH_ADMISSION_STATE

Allowed states should include:
- VERIFIED_AVAILABLE;
- VERIFIED_UNAVAILABLE;
- OBSERVED_SUCCESS;
- OBSERVED_FAILURE;
- NOT_REACHED;
- UNKNOWN.

Example:
MOPS FINANCIAL on run 37556241467:
- provider publication state = UNKNOWN_FROM_THIS_RUN;
- transport access = attempted;
- body completion = failed after bounded retry;
- parse = NOT_REACHED;
- semantic validation = NOT_REACHED;
- persistence/readback = NOT_REACHED;
- research admission = NOT_READY.

Therefore:
`OBSERVATION_CHANNEL_CENSORED`
is more accurate than
`SOURCE_DATA_MISSING`.

## 3. Ignorability is not assumed

Heitjan and Rubin's coarsening framework establishes that a stochastic coarsening mechanism can be ignored only under appropriate coarsened-at-random / parameter-distinctness conditions.

For this system, those conditions are NOT established.

Transport success may vary with pre-outcome operational conditions such as:
- endpoint;
- query time;
- request method;
- request payload;
- reporting calendar;
- market/disclosure congestion;
- runner/network path;
- source-side load;
- retry/timeout policy version.

Therefore complete-case dates must not automatically represent the target research population.

## 4. Attempt-one observational anchor

For each market opportunity/source requirement:
- preserve first scheduled acquisition attempt;
- later success does not rewrite first-attempt transport state;
- later recovery may establish current source accessibility but cannot create historical prospective observability;
- operational retries within one attempt remain one acquisition episode, not independent N.

For the MOPS witness:
three internal retries are one failed acquisition attempt, not three independent failures.

## 5. Missingness model inputs

If future admission weighting or missingness modelling is attempted, covariates must be pre-outcome and first-known at the attempt clock.

Candidate observed covariates:
- source family / endpoint identity;
- local query time;
- reporting-period indicator;
- known request payload class;
- runner/platform identity;
- timeout/retry policy version;
- prior source-availability history known before the attempt;
- market-date/session metadata known at the attempt clock.

Forbidden:
- later outcome return;
- later successful data values;
- future endpoint behavior;
- post-result reclassification chosen to improve performance.

## 6. Positivity / support

IPW or any response-probability weighting is not automatically authorized.

Before use:
- estimate/report response probability by frozen pre-outcome strata;
- report near-zero / zero-support strata;
- report weight distribution and concentration;
- no extreme-weight rescue when support is absent;
- trimming/overlap weighting changes the estimand and must be labeled as such.

If a required source has no successful first-attempt observations in a stratum:
`ACQUISITION_POSITIVITY_NOT_ESTABLISHED`.

Use partial-identification / sensitivity reporting instead of pretending the full target is recovered.

## 7. Multi-stage missingness must not collapse

Do not combine:
- PROVIDER_NOT_PUBLISHED;
- TRANSPORT_TIMEOUT;
- HTTP_AUTHORIZATION_BLOCKED;
- BODY_STREAM_INCOMPLETE;
- PARSER_FAILURE;
- SEMANTIC_VALIDATION_FAILURE;
- PERSISTENCE_FAILURE;
- READBACK_FAILURE

into one generic MISSING bucket for causal or sensitivity analysis.

A high-level admission state may remain blocked, but the observation mechanism must retain stage provenance.

## 8. Current real witness

Run:
`37556241467`.

Dataset:
FINANCIAL.

Endpoint:
`/mops/web/ajax_t163sb04`.

Configured:
- maxAttempts=3;
- timeout=45000ms per attempt;
- timeout/aborted retryable;
- full body inside retry boundary.

Observed:
`MOPS_BATCH_FINANCIAL_TRANSPORT_RETRY_EXHAUSTED`.

Classification:
- source data existence = UNKNOWN_FROM_THIS_RUN;
- acquisition channel = CENSORED/FAILED;
- parse = NOT_REACHED;
- persistence = NOT_REACHED;
- FINANCIAL readiness = NOT_READY;
- QUARTER_EPS = downstream NOT_REACHED.

## 9. Canonical SDA-016 mapping

This addendum is supplemental only.
It does not expand the canonical V0.5 58-test oracle.

It strengthens:
- T28 — admission missingness by state;
- T31 — complete-case target mismatch;
- T33 — positivity failure hidden by weighting;
- T39 — outcome-tuned missingness/imputation model.

## 10. Maturity boundary

This improves missingness honesty and causal attribution.

It does not create:
- Alpha evidence;
- valid C1 population;
- valid Formal↔C1 sample;
- calibrated probability evidence;
- D16 maturity promotion.

D16 remains 60%.

## 11. Method anchors

- Heitjan DF, Rubin DB. Ignorability and Coarse Data. Annals of Statistics. 1991;19(4):2244-2253.
- Seaman SR, White IR. Review of inverse probability weighting for dealing with missing data. Statistical Methods in Medical Research. 2013;22(3):278-295.

## 12. Exact next

1. Append every future quality-source attempt with stage-wise observation state.
2. Do not classify transport timeout as provider-data absence.
3. If FINANCIAL later succeeds, preserve the original failed acquisition episode.
4. Accumulate attempt-one source observability by frozen pre-outcome strata before any missingness weighting.
5. If support is weak/zero, use sensitivity/bounds rather than IPW rescue.
6. Formal Core remains LOCKED.
