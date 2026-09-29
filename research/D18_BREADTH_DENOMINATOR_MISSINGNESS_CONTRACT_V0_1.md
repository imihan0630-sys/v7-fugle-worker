# D18 Breadth Denominator + Missingness Contract V0.1

Updated: 2026-09-30 Asia/Taipei
Status: RESEARCH-ONLY / SEMANTIC CONTRACT / NO POLICY IMPACT
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Prevent denominator drift and missingness coercion in Breadth × Strategy research.

Breadth is not one denominator.
Each research object must name the population it measures and preserve the reasons rows leave the next stage.

## 1. Denominator ladder

### U0 — MARKET_BASE_UNIVERSE
PIT-ready actual same-session TWSE + TPEx ordinary-share presence.

Includes rows even when price direction cannot be classified.

Required:
- universeVersion / source batch hash;
- TWSE/TPEX counts;
- exclusions by instrument definition;
- duplicate/cross-market conflict diagnostics.

### U1 — DIRECTION_COMPARABLE_UNIVERSE
Subset of U0 with a valid comparable direction:
UP / DOWN / true FLAT.

Excluded but preserved separately:
- NOT_COMPARABLE;
- UNKNOWN.

Direction Breadth denominators use U1, not U0, but U0->U1 loss must always be reported.

### U2 — RETURN_KNOWN_UNIVERSE
Subset with a PIT-safe true return:
- valid current close;
- previous official-session close;
- correct identity/session continuity;
- no future revision;
- required price-space continuity semantics.

U2 may be smaller than U1.
A comparable direction does not prove a valid percentage return.

### U3 — HISTORY_FEATURE_UNIVERSE
Subset of U2 with sufficient PIT rolling history for:
- MA participation;
- positive5d;
- realized volatility or other history-based breadth.

Missing history reduces U3 coverage. It does not become below-MA / negative.

### U4 — OPPORTUNITY_SET_UNIVERSE
Strategy/Formal-normalized eligibility universe after price/instrument/liquidity/other filters.

This is NOT a descendant that may silently replace U0-U3 as "market breadth".
It is a separate estimand:
OPPORTUNITY_SET_BREADTH.

## 2. Missingness taxonomy

Do not collapse all missingness into one UNKNOWN when the cause is known.

Minimum reason families:

- STRUCTURAL_NOT_COMPARABLE
  - exchange X marker / explicit not-comparable state.

- NO_USABLE_CLOSE
  - no usable current close / no trade or source does not provide usable close.

- CHANGE_MISSING_OR_UNPARSEABLE
  - price exists but direction source field is missing/invalid.

- PRIOR_SESSION_PRICE_MISSING
  - current close exists but prior official-session close cannot be proven.

- NEW_OR_RETURN_HISTORY_UNAVAILABLE
  - actual current listing/presence but no valid return history yet.

- CONTINUITY_UNVERIFIED
  - corporate action / price-space continuity is not proven.

- SOURCE_OR_CLOCK_INVALID
  - source missing, stale, future relative to decision clock, schema invalid, duplicate conflict.

- CLASSIFICATION_OR_UNIVERSE_UNKNOWN
  - universe/market identity cannot be frozen.

- HISTORY_INSUFFICIENT
  - valid current/return rows but insufficient rolling history for the requested metric.

Unknown cause remains UNKNOWN_OTHER; never guess a reason from outcomes.

## 3. Missingness is a research variable, not a neutral nuisance

For every date preserve:
- U0/U1/U2/U3 counts;
- each transition coverage ratio;
- reason counts/shares;
- TWSE/TPEx decomposition.

Prospective research must test whether missingness shares vary with PIT-safe context:
- trend;
- realized volatility;
- activity/liquidity;
- concentration;
- market stress;
- corporate-action intensity when available;
- listing-age/size only when PIT-safe.

If missingness is regime-dependent, complete-case Breadth is potentially selected.

## 4. No universal coverage threshold yet

Do NOT introduce:
- U1/U0 >= 80%;
- U2/U0 >= 90%;
- or any other arbitrary readiness cutoff

before prospective coverage distributions are observed and a non-outcome-based data-quality reason is defined.

A future coverage threshold is a versioned research parameter and must not be selected because it improves strategy returns.

## 5. Sensitivity analysis once evidence exists

For descriptive/OOS work report:
- full eligible dates;
- high-missingness-date exclusion sensitivity using preregistered data-quality rules;
- TWSE-only / TPEx-only diagnostic splits;
- difference between U0 market composition and U4 opportunity-set composition;
- whether strategy conclusions change materially as coverage changes.

Do not impute missing direction/return as zero for the primary estimand.

Any later imputation model is a separate experiment and must prove PIT inputs plus sensitivity to model error.

## 6. Regime interaction guard

A Regime × Strategy result is blocked from promotion when:
- the policy edge appears only on dates with unusually low/high coverage;
- Regime state materially predicts row inclusion and the analysis ignores it;
- U4 opportunity-set breadth is mislabeled as exogenous market breadth;
- the denominator definition changes across OOS folds without versioning;
- missingness handling is changed after seeing policy returns.

## 7. Walk-forward rule

Within each outer fold:
- denominator semantics are frozen;
- any learned coverage model/threshold uses training data only;
- holdout rows keep their observed missingness states;
- no full-sample imputation/scaling/threshold may enter the fold.

Every fold records the exact U0-U3 receipt version.

## 8. Current implementation link

D18 Direction Breadth V0.1 already preserves:
- NOT_COMPARABLE;
- UNKNOWN;
- reasonCounts;
- comparable coverage;
- TWSE/TPEx split.

This contract generalizes that design for later return/history breadth.

## 9. Current maturity conclusion

No D18-04 level change.

Direction Breadth has executable PIT semantic feasibility, but:
- prospective missingness distributions are not yet accumulated;
- Return Known / History Feature universes remain unfinished;
- no coverage gate is frozen;
- no Breadth policy has OOS/Shadow evidence.

## Exact next continuation

1. Obtain the first prospectively captured U0->U1 direction receipt under an authorized context-only path.
2. Measure NOT_COMPARABLE/UNKNOWN rates before thresholds.
3. Build U2 True Return coverage separately.
4. Compare Market Breadth (U0-U3) against Opportunity-Set Breadth (U4) only as distinct estimands.
5. Pre-register any future coverage threshold before strategy outcomes are inspected.
