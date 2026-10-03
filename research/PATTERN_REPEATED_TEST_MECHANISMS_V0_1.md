# D01 DL-037 — Repeated-Test Competing-Mechanism Contract V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / COMPETING_MECHANISMS / FORMAL_CORE_LOCKED

## 1. Problem

"More touches" has incompatible intuitive interpretations.

Mechanism A:
SALIENT_REINFORCEMENT
- repeated successful reactions make a level more visible;
- traders may anchor orders/expectations to it;
- self-reinforcing behavior can increase future reaction probability.

Mechanism B:
DEPLETION_ABSORPTION
- repeated interaction may consume/rearrange resting supply/demand;
- shrinking rejections / tighter approaches may precede break;
- repeated tests can reflect pressure rather than strength.

Mechanism C:
SELECTION_SURVIVORSHIP
- a level must survive to accumulate many touches;
- high touch count partly reflects conditional survival.

Mechanism D:
CROSSING_OPPORTUNITY
- volatility, width, proximity, tick and liquidity alter how often a zone is touched.

Touch count alone cannot distinguish A-D.

## 2. Evidence hierarchy by data layer

### L0 — Price-history only

Can observe:
- touch count;
- spacing / recency;
- dwell;
- rejection progression;
- break/reentry/reclaim path.

Can support:
PATH_PATTERN_DESCRIPTION.

Cannot directly claim:
resting liquidity depletion,
order replenishment,
investor attention.

### L1 — Price + volume/turnover

Add D02:
- participation;
- relative volume;
- acceptance/persistence;
- response/effort.

Can support:
PRICE_VOLUME_MECHANISM_PROXY.

Still cannot directly observe:
queue depletion/replenishment.

### L2 — Market microstructure

If PIT-valid D04/order-book evidence exists:
- depth;
- spread;
- queue state;
- add/cancel behavior;
- replenishment/resiliency.

Can support stronger:
ORDER_BOOK_MECHANISM_DIAGNOSTIC.

Even L2 remains observational unless design supports stronger identification.

## 3. Reinforcement-compatible path signatures

Outcome-blind descriptors that may be compatible with reinforcement:
- repeated prior bounces;
- stable / non-shrinking rejection distance;
- durable time between interactions;
- persistent behavioral salience;
- repeated participation around the same level.

These are compatibility descriptors only.

They do NOT make a level bullish/bearish.

## 4. Depletion/absorption-compatible path signatures

Outcome-blind descriptors that may be compatible with depletion/absorption:
- shrinking rejection distance;
- rising lows toward resistance / falling highs toward support;
- shorter re-test spacing;
- more dwell near the boundary;
- progression toward the zone;
- participation/acceptance shifts where D02-valid.

These can also arise from trend/momentum.

Therefore:
DEPLETION_PROXY != OBSERVED_LIQUIDITY_DEPLETION.

## 5. Direct microstructure evidence boundary

Daily OHLC cannot reveal:
- whether a resting order was consumed;
- whether liquidity replenished after execution;
- whether hidden/reserve liquidity existed;
- whether displayed depth was canceled before contact.

Any statement "orders were depleted" from daily Pattern data alone is prohibited.

Use:
DEPLETION_COMPATIBLE_PRICE_PATH
unless D04 provides valid direct evidence.

## 6. Literature interpretation

Curcio et al. (2014), Scientific Reports:
support/resistance bounce probability rises with previous bounces relative to shuffled series.
This is compatible with self-reinforcing beliefs/attention.

Chung & Bellotti (2021):
detected levels with higher prior bounce count show higher subsequent bounce probability and level influence decays with time.

Li, Wang & Zeng (2012):
resistance/support levels are associated with peaks in limit-order-book depth; order clustering can contribute to level formation.

Limit-order-book resiliency literature:
liquidity is dynamic and can replenish after shocks.

Therefore:
level interaction is plausibly linked to trader behavior/liquidity,
but repeated touch count alone does not identify whether liquidity is strengthening or being consumed.

## 7. Competing-mechanism ladder

M0:
touch count only.

M1:
M0 + risk-set/exposure + spacing/recency/dwell.

M2:
M1 + rejection progression / path geometry.

M3:
M2 + D02 participation / acceptance.

M4:
M3 + D04 direct microstructure where PIT-valid.

Interpretation:
- contradictory M2/M3/M4 evidence => AMBIGUOUS;
- price-only evidence cannot escalate beyond PATH_MECHANISM_CANDIDATE;
- direct microstructure evidence can refine mechanism but not create independent Pattern votes.

## 8. No mechanism score

Rejected:
- reinforcementScore;
- depletionScore;
- touchStrength;
- absorption points;
- vote for "touches + rising lows + volume" as independent factors.

These are interacting observations from shared price/volume/microstructure roots.

## 9. Interaction with G0-G9 ladder

Repeated-test mechanism cannot bypass DL-034.

Even a strong reinforcement/depletion narrative must still pass:
- simple redundancy;
- opportunity;
- negative controls;
- detector selection/salience;
- frontier;
- detector robustness;
- D16 OOS/statistical validation.

Narrative plausibility is not evidence promotion.

## 10. Current decision

TOUCH_COUNT_UNIVERSAL_SIGN = REJECTED.

REINFORCEMENT_MECHANISM = PLAUSIBLE / NOT_UNIVERSAL.

DEPLETION_ABSORPTION_MECHANISM = PLAUSIBLE_PROXY / DIRECT_DAILY_EVIDENCE_UNAVAILABLE.

PRICE_ONLY_MAX_INTERPRETATION = PATH_MECHANISM_CANDIDATE.

DIRECT_ORDERBOOK_MECHANISM = D04_OWNED.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 11. Exact next continuation

1. Freeze a machine-readable mechanism-evidence hierarchy.
2. Build an evidence-level auditor preventing price-only "liquidity depletion" claims.
3. Hand D02/D04 ownership boundaries to Shared Knowledge.
4. Next science: age/decay of structural levels, separating calendar/session age from time since last interaction and detector survival.
5. No outcome join / no Formal change.
