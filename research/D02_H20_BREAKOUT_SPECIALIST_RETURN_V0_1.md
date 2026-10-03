# D02 H20 breakout specialist return V0.1

Updated: 2026-10-03 Asia/Taipei
Status: SPECIALIST_RETURN_READY / RESEARCH_ONLY
Parent contract:
- shared-knowledge/CURRICULUM_H13_H20_ANTI_DOUBLE_COUNT_ACCEPTANCE_CONTRACT_20261003_V0_1.md
- shared-knowledge/CURRICULUM_H13_H20_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md

## Exact modules
- D01-05 price-structure breakout/failure lifecycle — dependency owner outside D02
- D02-03 breakout volume confirmation — this room
- D04-07 volatility/trend/breakout interaction — dependency owner outside D02

## Primitive evidence owner
One breakout episode uses one shared primitive event receipt.

Primary event identity owner:
D01-05 price structure.

Recommended shared key:
`H20_BREAKOUT:<marketDate>:<symbol>:<anchorBarStart>`.

D02 must reference this identity; it must not mint a second event because volume is abnormal.

## D02 downstream transformation ownership
D02-03 owns:
- local previous-five-bar volume ratio comparator;
- same-slot RVOL;
- cumulative participation pace where valid;
- volume-confirmation residual/incremental testing.

D02-03 does not own:
- price breakout geometry;
- D04 volatility state/maturity;
- event/news cause;
- microstructure/order-flow cause.

## PIT / replay clocks
For an intraday breakout anchor:
- anchorBarStart is event identity only;
- volume and close geometry become known after barEnd;
- primary PIT use requires valid sourceFetchedAt/featureKnownAt >= barEnd;
- historical RVOL denominators use prior comparable sessions only;
- later follow-through/retest is an outcome path, never part of initial event eligibility.

## Divergent-state examples
1. PRICE_PASS + NORMAL_VOLUME + FOLLOW_THROUGH:
   falsifies universal volume necessity for that case.
2. PRICE_PASS + HIGH_VOLUME + FAILURE:
   falsifies high-volume sufficiency.
3. PRICE_PASS + EXTREME_VOLUME + WEAK_RESPONSE:
   possible climax/absorption/disagreement/event flow; confirmation unresolved.
4. PRICE_PASS + MODERATE_RVOL + STRONG_ACCEPTANCE:
   candidate constructive state; must be tested rather than assumed.
5. PRICE_FAIL + HIGH_VOLUME:
   abnormal participation does not rescue a failed price-structure event.
6. PRICE_PASS + HIGH_VOLUME + HIGH_VOLATILITY_EVENT:
   D04/event dependency needed; D02 may not claim the full effect.

## Incremental-value test
Frozen nested sequence on identical event/date/symbol common support:

A — D01 price-only breakout/failure baseline.
B — A + existing local previous-five-bar volume ratio.
C — B + same-slot historical RVOL.
D — C + cumulative participation pace when cumulativeValid=true and the common-support clock permits it.

For H20 D02-03, C-vs-B is the cleanest primary incremental question.
D-vs-C belongs cumulative-participation refinement and must also pass H002 redundancy controls.

Outcomes, only after clean prospective maturity:
- field-valid false-break/follow-through;
- MFE;
- MAE;
- opportunity retention;
- cost/slippage impact.

Controls:
- market/sector participation;
- D04 volatility state;
- liquidity;
- event context;
- Market Regime;
- date clustering;
- costs/slippage.

## Anti-double-count implementation
- one event receipt;
- D02 fields stored/joined as transforms on the event;
- D04 fields referenced as dependency-owned transforms;
- a single event cannot receive +1 “price vote”, +1 “volume vote”, +1 “volatility vote” unless residual incremental evidence has independently passed;
- shared OHLCV/source rows are referenced, not duplicated as independent observations.

## Maturity implication
D02-03 remains L3 / 60%.

Reason:
PIT/data semantics and the incremental test are defined, but clean prospective residual outcome evidence remains absent.

No D01/D04 maturity is changed or recomputed by D02.

## Terminal specialist classification
`KEEP_SEPARATE / MULTI_EVIDENCE_BREAKOUT_FAMILY / D02_CONDITIONAL_INCREMENTAL_ROLE / NO_INDEPENDENT_EVENT_VOTE_UNTIL_RESIDUAL_VALUE`.

No merge/retirement is executed here.
00｜研究總控室 owns final Dependency Audit and owner review.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core remains LOCKED.
