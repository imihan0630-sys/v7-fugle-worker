# D01 DL-031 — D16 Aging / Censoring / Opportunity Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes structural semantics.
D16 owns future statistical inference.

The central requirement is to separate:
- chronological structural age;
- detector observability;
- interaction exposure;
- prior successful/failed uses;
- explicit market invalidation;
- administrative censoring.

## 2. Future estimands must remain distinct

### E1 — STRUCTURAL_RESPONSE_AT_OPPORTUNITY

Unit:
one causally valid structural interaction opportunity.

Predictor state is frozen immediately before opportunity.

Primary question:
does structural response vary with eligible-session age after controlling prior interaction history and opportunity covariates?

Non-approach days are not failures.

### E2 — OBJECT_EPISODE_INVALIDATION

Unit:
one structural-object episode.

Event:
explicit MARKET_INVALIDATED only.

Window censoring, detector absence and study end are not failure events.

### E3 — DETECTOR_OBSERVABILITY

Unit:
one structural root under a specified detector/horizon.

Event/state:
loss of detector reconstructibility.

This is detector architecture behavior, not structural market decay.

Do not interpret E3 as E2.

## 3. Required risk-set distinctions

A future survival-style analysis must distinguish:
- prospective/at-entry first-confirmation observed roots;
- exact historical replay roots;
- left-truncated roots with unknown first confirmation;
- right-censored study-end roots;
- detector-window-censored but persisted roots;
- explicit market invalidation.

Left-truncated unknown-first-confirmation roots are not promotion-grade for age-decay inference.

## 4. Time-varying predictors

At each valid opportunity, preserve:
- ROOT_AGE;
- VERSION_AGE;
- prior interaction/bounce/break/reclaim counts;
- time since last interaction/bounce;
- DL-026 opportunity controls;
- volatility/liquidity;
- round/tick context;
- D02 acceptance/persistence;
- market/sector regime.

Age and interaction history must enter as separate predictor families.

Do not fit one composite "strength-decay" score first.

## 5. Censoring warning

WINDOW_CENSORED_ROOT_PERSISTED is mechanically related to age under finite lookback detectors.

Therefore it cannot be treated casually as independent censoring of structural survival.

Preferred future design:
continue follow-up from the persisted root/boundary ledger after detector-window censoring, while separately marking detector reconstructibility.

If persisted-root follow-up is unavailable, structural decay beyond the detector horizon is NOT_IDENTIFIED.

## 6. Shape uncertainty

D01 does not freeze:
- exponential decay;
- linear decay;
- fixed half-life;
- age buckets;
- a third-touch threshold.

Future D16 work should preregister a no-age null and flexible age representation on common support, with complexity controlled under existing multiple-testing governance.

## 7. Literature alignment

Chung and Bellotti (2021):
prior bounce count and elapsed time can carry opposing effects, motivating separate age and interaction dimensions.

Henderson, Jacka, Liu and Maeda (2026):
path-dependent regime transition and waiting-time structure support time-varying state modeling as a mechanism candidate, not an empirical alpha conclusion.

Standard left-truncation/right-censoring and time-varying-covariate methodology:
risk-set membership and censoring state must be explicit.

## 8. Promotion boundary

Even a robust age effect remains research-only until:
- first-confirmation provenance;
- persisted-root follow-up;
- opportunity definition;
- D16 preregistration;
- OOS/prospective evidence;
- redundancy/cost controls

all clear existing governance.

Formal Core remains LOCKED.
