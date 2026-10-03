# D04 / D05 Taiwan PIT Feasibility Promotion Audit — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei  
Room: 04｜波動與市場微結構研究室  
Status: OUTCOME_BLIND_L3_FEASIBILITY_AUDIT  
Formal Core impact: NONE  
Alpha / OOS claim: NONE

## Maturity rule applied

Canonical learning-map definition:
- L2 = MECHANISM_AND_FALSIFICATION_DEFINED;
- L3 = TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED;
- L4 = PROSPECTIVE_SHADOW_OR_OOS_EVIDENCE.

This audit therefore asks only:
"Can the Taiwan source, clock, semantic space, UNKNOWN behavior and replay identity be defined and reproduced causally?"

It does NOT ask whether the feature makes money.

A module can reach L3 while efficacy remains completely UNKNOWN.

## Common A1 daily source evidence

System2 A1 historical source validation already live-validated:
- TWSE MI_INDEX historical daily source;
- TPEx dailyQuotes historical daily source;
- 2017-era and recent sessions;
- requested-date/source-date equality;
- fail-closed source-date/schema/OHLC integrity.

Current A1 contract carries/derives:
- open/high/low/close;
- ATR%;
- volatility20;
- ret20/ret60;
- prior highs/lows;
- daily close position;
- gap/breakout-distance fields where produced.

Corporate-action / symbol-session guard:
- RAW_HISTORY_ADMISSION_PASS is not TECHNICAL_CONTINUITY_CERTIFIED;
- when a lookback crosses a relevant unresolved corporate action or unexplained missing symbol session, state is BLOCKED/UNKNOWN;
- no pseudo-bar or factor=1 default is permitted;
- future efficacy must consume shared TECHNICAL_CONTINUITY rather than create a D04-specific adjustment engine.

This is sufficient for L3 feasibility when the module can fail closed on unresolved continuity; it is not L4 evidence.

---

# D04 promotions

## D04-03 Volatility Contraction — PASS L2 -> L3

Mechanism/falsification already frozen in D04_CONTRACTION_EXPANSION_PROTOCOL_V0_1.

PIT-feasible observables:
- rolling close-return dispersion;
- true-range / ATR context;
- high-low/range compression;
- Bollinger/range comparators where formula version is frozen;
- exact eligible-session window.

Clock:
- only bars complete and known by parent decision cutoff;
- same-bar future high/low unavailable at the cutoff is forbidden.

Replay:
- exact source dates + history hash + formula version + continuity state.

Fail closed:
- unresolved corporate action;
- unexplained missing session;
- price-limit constrained interpretation;
- insufficient lookback.

Decision:
`D04-03 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / ALPHA_UNKNOWN`.

## D04-04 Volatility Expansion / Shock — PASS L2 -> L3

Uses the same causal daily source family but a distinct state question:
- change/increase in volatility/range;
- shock magnitude;
- direction stored separately.

PIT guard:
- expansion cannot use a not-yet-completed bar range;
- overnight gap and intraday range remain separate components where needed.

Replay and continuity rules are identical to D04-03.

Decision:
`D04-04 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / DIRECTION_NOT_IMPLIED`.

## D04-07 Volatility × Trend / Breakout Interaction — PASS L2 -> L3

No new market-data family is required.

Inputs:
- D04 volatility state from causal daily A1 windows;
- trend/breakout state from already PIT-feasible D01/D03 price-structure families;
- common parent decision timestamp.

Anti-double-count:
- one breakout event remains one primitive event;
- volatility is a conditioning/context variable, not a second copy of breakout evidence.

Replay:
- exact same parent receipt/common support;
- no joining of volatility state from one source date to breakout state from another.

Decision:
`D04-07 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / INCREMENTAL_VALUE_UNKNOWN`.

## D04-09 Tail / Gap Volatility Risk — PASS L2 -> L3

Taiwan historical A1 source contains observed OHLC.

Causal descriptors:
- previous eligible close -> current observed open gap;
- intraday high/low excursion;
- tail/range descriptors;
- resumption-session gap where suspension provenance is verified.

Critical semantics:
- RAW_EXECUTION gap is valid market/execution evidence;
- a known corporate-action mechanical reset must be separated from residual market gap;
- missing/synthetic Open is prohibited;
- unresolved corporate-action continuity => UNKNOWN/BLOCKED;
- limit-constrained sessions remain separate.

Because official OHLC source and the required semantic firewall are available, future prospective/replay construction is feasible without a new data family.

Decision:
`D04-09 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / TAIL_PREMIUM_UNKNOWN`.

## D04-10 Price-Limit Contamination of Volatility — PASS L2 -> L3

Official Taiwan price-limit rules provide the mechanism and current versioned rule source.

Prospective source feasibility:
- official/reference price context;
- provider ticker/quote limitUpPrice / limitDownPrice where explicitly available;
- raw OHLC/trade state;
- explicit limit flags where supplied;
- official exception/special-state contract.

Required replay state:
- rule version;
- reference price/limit values as known at session;
- exception/no-limit state;
- touched/closed-at-limit state;
- price-limit-constrained count inside the volatility window.

Unknown rule:
- if exact limit/reference/exception state cannot be proved for a historical session, contamination state is UNKNOWN rather than inferred from a round percentage move.

This validates prospective PIT/replay feasibility, not a claim about latent unconstrained volatility.

Decision:
`D04-10 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / LATENT_PRICE_UNOBSERVED`.

### D04 modules NOT promoted

D04-02 RV5/RV20:
- source/formula machinery exists;
- but canonical A2 prospective decision-clock persistence/readback remains unresolved; Class-B EOD proposal is not Decision Clock evidence.
- KEEP L2.

D04-05 volatility regime transitions:
- transition semantics exist;
- canonical raw market-RV persistence is still pending.
- KEEP L2.

D04-06 market × stock volatility:
- stock side feasible;
- exact market-side A2 decision-clock persistence still incomplete.
- KEEP L2.

D04-08 volatility scaling / sizing:
- data inputs can be observed, but the module is a policy/risk transformation requiring a separate portfolio/execution evidence contract.
- KEEP L2.

D04 result:
prior = 420 / 1000 = 42.0%.
Five L2 -> L3 promotions add 100 points.
new = **520 / 1000 = 52.0%**.

---

# D05 promotions

## Shared merged prospective snapshot evidence

Merged PR #327 provides a bounded research-only C3 Quote chain with:
- symbol/trading-date validation;
- quote timestamp normalization;
- stale/future quote rejection;
- top-five bids/asks;
- best bid/ask + spread;
- bidDepth5 / askDepth5 / depthImbalance;
- trial / continuous / delayed-open / delayed-close / halt / explicit limit-price flags;
- source/fetchedAt semantics;
- no Formal decision use.

Related Class-A readiness code:
- same-symbol same-15m-slot prior-session baseline;
- strict prior-session only;
- duplicate/lookahead rejection;
- minimum-baseline UNKNOWN;
- no missing-data imputation;
- no post-outcome threshold selection.

This proves bounded Taiwan PIT feasibility for snapshot-level spread/depth/mechanism/liquidity state. It does NOT prove complete exchange-event reconstruction or true OFI.

## D05-03 Bid-Ask Spread — PASS L2 -> L3

Observed:
- bestBid;
- bestAsk;
- spreadPct;
- quoteTimestamp;
- market date/symbol;
- freshness and mechanism flags.

Normalization can be same-symbol/same-slot prior-session only.

UNKNOWN:
- missing side;
- crossed/invalid quote;
- stale/future timestamp;
- trial/halt state where ordinary continuous-spread inference is not valid.

Decision:
`D05-03 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / SPREAD_ALPHA_UNKNOWN`.

## D05-04 Order-book Depth — PASS L2 -> L3

Observed:
- top-five bid/ask levels;
- bidDepth5 / askDepth5;
- raw depth imbalance;
- quoteTimestamp.

Readiness code already rejects incomplete raw depth and insufficient same-slot history.

Boundary:
- top-five snapshots are aggregated displayed depth;
- no order IDs / exact queue rank;
- message count is not exchange-event count.

Decision:
`D05-04 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / EVENT_COMPLETENESS_NOT_CLAIMED`.

## D05-07 Intraday Matching / VI / Abnormal Matching State — PASS L2 -> L3 WITH BOUNDED CAUSE SEMANTICS

Current Quote evidence can distinguish bounded observable states:
- CONTINUOUS;
- TRIAL;
- HALTED;
- DELAYED_OPEN / DELAYED_CLOSE;
- explicit limit-price/halt flags where provider supplies them;
- UNKNOWN.

Official TWSE rules provide the matching-mechanism interpretation.

Critical boundary:
- a provider `isTrial=true` proves trial/non-continuous state, not necessarily the exact regulatory cause;
- VI-specific cause remains UNKNOWN unless an authoritative VI event receipt is present;
- disposition status is a separate official-surveillance input and is not inferred from trial flags.

Thus the market-mechanism state is PIT/replay feasible with bounded labels even though cause attribution can remain UNKNOWN.

Decision:
`D05-07 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_WITH_CAUSE_UNKNOWN_GUARD`.

## D05-08 Odd-lot vs Round-lot Execution Difference — PASS L2 -> L3

Current official Taiwan mechanics:
- intraday odd-lot orders 09:00-13:30;
- matching begins 09:10 and proceeds by 5-second call auctions;
- trial information and best-five states are disseminated;
- after-hours odd-lot is a separate session.

Current Fugle source contract explicitly supports odd-lot mode for:
- Intraday Quote (`type=oddlot`);
- Intraday Candles (`type=oddlot`);
- WebSocket Books (`intradayOddLot=true`);
- WebSocket Trades (`intradayOddLot=true`).

Therefore a prospective common-clock round-lot versus intraday-odd-lot comparison is source-feasible.

Replay requirements:
- venue/session type;
- odd-lot flag;
- source timestamp;
- same symbol/date;
- matched comparable time window;
- separate after-hours odd-lot;
- no assumption that regular-lot queue/event semantics transfer unchanged.

No source is claimed for historical first-known odd-lot books before prospective capture.

Decision:
`D05-08 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_PROSPECTIVE_ONLY`.

## D05-09 Liquidity State Classification — PASS L2 -> L3

PIT-feasible component vector:
- spreadPct / spread quality percentile;
- total displayed top-five depth percentile;
- depth imbalance;
- market mechanism state;
- quote freshness/coverage state;
- optional activity inputs only when provenance-valid.

Current outcome-blind normalization contract already supports:
- same symbol;
- same 15m slot;
- prior sessions only;
- ECDF midrank;
- minimum prior sessions;
- UNKNOWN when baseline insufficient;
- no compositeDepthScore or trigger permission.

Therefore a replayable liquidity-state **component vector** is feasible.

No universal GOOD/BAD threshold is authorized.
No Formal `depthScore` mapping is inferred.

Decision:
`D05-09 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / COMPOSITE_THRESHOLD_NOT_AUTHORIZED`.

### D05 modules NOT promoted

D05-05 OFI:
- snapshot pressure proxy feasible;
- true OFI still needs event-completeness/sequence proof.
- KEEP L2.

D05-06 Opening Auction:
- opening mechanics/trial source is observable;
- COV-02 now recommends expanded opening+closing ownership, while historical pre-close imbalance replay remains partial.
- avoid promoting immediately before total-control intake/recomputation.
- KEEP L2.

D05-11 Market Impact:
- own-order lifecycle/counterfactual not yet available.
- KEEP L2.

D05-12 Adverse Selection/Toxicity:
- own-fill signed markout feasibility requires order lifecycle; B14 keeps it separate from OFI.
- KEEP L2.

D05-13 Queue Position:
- exact queue rank unavailable from public top-five; stronger order-lifecycle evidence needed.
- KEEP L2.

D05-14 Market Integrity:
- exact official attention/disposition knownAt/versioned historical replay and actor-level pattern data are not yet proven.
- KEEP L2.

D05 result:
prior = 620 / 1400 = 44.2857%.
Five L2 -> L3 promotions add 100 points.
new = **720 / 1400 = 51.4286%**.

---

# Room 04 combined maturity

D04 = 520 points / 10 modules.
D05 = 720 points / 14 modules.

Combined:
`(520 + 720) / 24 = 51.6667%`.

Rounded room maturity:
**51.7%**.

This is a legitimate L3 feasibility increase, not OOS/alpha evidence.

## Explicit non-claims

This audit does NOT prove:
- volatility contraction alpha;
- volatility expansion direction;
- breakout improvement;
- tail-risk forecasting edge;
- price-limit forecasting edge;
- spread/depth alpha;
- VI alpha;
- odd-lot premium;
- liquidity state alpha.

Those require L4 Prospective Shadow/OOS evidence.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.
