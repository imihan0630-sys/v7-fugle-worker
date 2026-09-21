# P2 research note — Taiwan information path / intraday prior

Timestamp: 2026-09-22 05:52 +08:00
Governance: RESEARCH ONLY / Formal Core LOCKED

## Research question
Before prospective execution-shadow-v2 is mature, what external evidence should constrain interpretation of price-path quality, opening gaps and intraday continuation in Taiwan?

## New Taiwan-specific evidence
1. Lin, Ko, Chen & Chu (Pacific-Basin Finance Journal, 2016), `Information discreteness, price limits and earnings momentum`, reports that Taiwan earnings momentum is stronger among stocks whose information arrives more continuously / attracts less attention. Their Taiwan-specific modification treats price-limit events as attention-grabbing discrete events and finds stronger support for underreaction than overreaction.
2. Chen, Hsieh & Lee (Pacific-Basin Finance Journal, 2023), `Revisiting the momentum effect in Taiwan: The role of persistency`, reports that ordinary Taiwan momentum is attenuated by high turnover in winner/loser portfolios, while a persistency-based momentum construction is significantly profitable in the intermediate term.
3. Ho, Hsiao, Lo & Yang (Pacific-Basin Finance Journal, 2023), `Momentum investing and a tale of intraday and overnight returns: Evidence from Taiwan`, finds positive intraday-momentum returns but negative overnight-momentum returns, interpreting the former as underreaction and the latter as correction of overnight overreaction.
4. A Taiwan short-term momentum study using 2000-2021 listed-stock data reports an important regime caveat: average reversal before the 2015 price-limit relaxation, but average short-term momentum after the relaxation; turnover-conditioned sorts show momentum and reversal can coexist. This reinforces the need to condition path evidence on market structure / turnover rather than assume one unconditional Taiwan momentum law.
5. Broader persistency evidence reports that many nominal winners/losers immediately fall out of their groups, while persistent members show materially stronger continuation. This is consistent with using path persistence to distinguish fragile one-shot moves from durable trends.
6. International evidence from Da, Gurun & Warachka's information-discreteness framework is directionally consistent: gradual/continuous information is associated with stronger return continuation than discrete/jumpy information.

## Interpretation / falsification prior
- This strengthens the prior that `price path quality / persistence` is more promising than raw cumulative return alone for Taiwan.
- It also strengthens existing R05's separation of intraday and overnight returns. Opening gap must NOT be assumed bullish merely because it is positive; Taiwan evidence gives a prior that overnight strength may contain overreaction that subsequently corrects.
- A positive opening gap followed by intraday confirmation and a positive gap without intraday confirmation should be treated as potentially different paths in future descriptive analysis, but no threshold/classification is registered yet.
- Information discreteness is conceptually close to existing persistence, positiveDayRatio20, breakout quality and R07/R08 attention proxies. Creating a new formal factor now would risk redundancy / Factor Zoo. First test whether existing stored fields already span the same information.
- Price-limit events are attention shocks in Taiwan-specific evidence; future ID-style research must account for price-limit days rather than blindly importing a US-style ID formula.
- Taiwan's 2015 price-limit regime change and turnover interaction are explicit falsification dimensions. A result that appears only in one market-structure era or one turnover bucket is not general evidence.

## Bias / redundancy checks
- Do not infer causality from the cited observational return patterns.
- Do not tune a new ID window, gap threshold, intraday confirmation threshold or holding horizon after seeing Shadow outcomes. Any such definition requires a new preregistered experiment/version.
- Do not backfill execution-shadow-v2 or market mechanism state historically.
- Same-day stocks remain clustered observations; independent scan date remains the primary evidence unit.
- Transaction costs, liquidity/spread, residualSectorRs20, positiveDayRatio20, turnover/attention, breakout quality and market regime remain required controls.
- Turnover is both a possible attention proxy and a conditioning variable; avoid double-counting it through multiple correlated factors.

## R01-R08 / I01-I07 impact
- R05 receives stronger Taiwan-specific external prior; definition unchanged.
- R03/R04/R07/R08 remain relevant controls/comparators; definitions unchanged.
- R01-R08 unchanged; I01-I07 unchanged; no R09 created.
- No engineering change, branch, test or deployment in this cycle.

## Engineering classification
Research interpretation only. No code change. Formal Core remains LOCKED.

## Exact next continuation point
Continue P2 without waiting for user interaction:
1. Research whether existing stored `positiveDayRatio20`, persistence and breakout/path fields can reproduce an information-discreteness-like ranking without a new factor definition.
2. Inspect repository definitions of persistence / positiveDayRatio20 / breakout quality to map conceptual overlap before proposing any new Shadow diagnostic.
3. Once actual execution-shadow-v2 trading-day snapshots exist, read coverage by independent scan date before any directional Execution Alpha inference.
4. Preserve opening gap as a diagnostic/control until prospective evidence tests whether intraday confirmation separates continuation from overnight correction.
