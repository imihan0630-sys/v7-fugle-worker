# D18-04 Breadth Common-Support / Missingness / Continuity Audit V0.1

Updated: 2026-10-04 Asia/Taipei
Owner: 11｜統計驗證與策略市場狀態研究室
Scope: D18-04 only
Formal Core impact: NONE
Status: RESEARCH_ONLY / L2_MAINTAINED

## Research question

Can market breadth be compared across official aggregate breadth, per-symbol direction breadth, and true-return breadth without creating PIT leakage, denominator drift, or complete-case selection bias?

## Frozen estimands

Keep three objects separate:
1. OFFICIAL_AGG_DIRECTION_BREADTH: venue-published up/down/unchanged/untraded/no-comparison counts.
2. SYMBOL_DIRECTION_BREADTH: same frozen common-stock universe, direction classified from PIT-eligible same-session observations.
3. U2B_TRUE_RETURN_BREADTH: continuity-certified symbol returns only; requires shared technical-continuity eligibility.

Do not substitute Formal opportunity-set breadth for any market-breadth object.

## Common-support rule

Any aggregate-vs-symbol comparison is admissible only when:
- same marketDate and venue;
- both observations were available by the frozen decision clock;
- denominator semantics are explicit;
- symbol universe/accounting hash is frozen;
- UNKNOWN/no-comparison/untraded semantics remain explicit;
- no later continuity repair is backfilled into the earlier receipt.

A date failing any prerequisite is COMMON_SUPPORT_UNKNOWN, not zero disagreement.

## Missingness audit

Before any strategy interaction or breadth threshold:
- report eligible dates, common-support dates, and exclusion reasons;
- stratify missingness by venue, source transport state, trend context, volatility context, and transition state when those states are themselves PIT-valid;
- never condition on future strategy outcome;
- retain source/transport failure separately from genuine market no-trade/no-comparison states.

Primary question:
P(common-support identifiable | PIT-safe context) must be stable enough that complete-case analysis does not systematically exclude stressed or asynchronous-market dates.

## U2A / U2B firewall

U2A raw-close return is diagnostic only.
U2B is the primary return-distribution object and requires continuity certification.

Rules:
- corporate-action / suspension / revision uncertainty => UNKNOWN;
- current adjustment factors may not backfill historical receipts;
- missing continuity evidence is not a negative return;
- U2A-vs-U2B disagreement is a data-quality diagnostic, not alpha.

## Falsification matrix

The hypothesis "breadth adds independent regime information" is weakened or rejected if:
1. aggregate-vs-symbol disagreement is mostly denominator/source-clock artifact;
2. common-support dates are materially selected by volatility/trend/transition state;
3. U2B coverage collapses in stressed regimes;
4. breadth interaction disappears after controlling for trend, volatility, sector rotation and stock-level signals;
5. effect is dominated by one regime episode or venue;
6. threshold/significance appears only after trying multiple denominator or coverage definitions;
7. after identical transaction costs and exposure matching, regime-conditioned policy does not beat static strategy;
8. prospective receipts diverge from historical replay.

## Multiplicity firewall

The following are one multiplicity family if explored:
- breadth definition;
- venue combination;
- denominator rule;
- coverage floor;
- breadth threshold;
- strategy pairing;
- horizon;
- transition persistence;
- policy weight/gate.

No selected cell may be promoted without untouched chronological OOS and prospective evidence.

## Promotion gate

D18-04 stays L2/40.

L3 requires executable Taiwan PIT feasibility for the tested breadth object, including:
- TPEx machine-readable aggregate source/clock for cross-market aggregate claims;
- shared technical-continuity path for U2B true-return claims;
- deterministic replay;
- explicit denominator/coverage;
- UNKNOWN preservation;
- common-support receipt.

L4 additionally requires prospective/OOS strategy interaction across multiple independent dates and regime episodes with static and exposure-matched controls, identical costs, and multiplicity governance.

## Exact next continuation

1. Do not invent TPEx transport or U2B continuity.
2. When both are available, build a research-only common-support receipt joining TWSE/TPEx aggregate breadth, symbol-direction breadth, and U2B coverage by marketDate/venue/decision clock.
3. First empirical output is missingness/common-support occupancy by PIT-safe context, not strategy alpha.
4. Only after missingness is characterized, preregister one breadth × one frozen strategy interaction.
5. Formal Core remains locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.
