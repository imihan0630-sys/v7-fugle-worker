# Institutional / Crowding Research

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## IC-001 — scope
Institutional flow is not automatically informed demand. Foreign/dealer/trust activity can represent directional conviction, passive/index flow, hedging, liquidity provision, arbitrage or inventory management.

Research question: after existing price/volume/trend/sector controls, do PIT institutional/crowding states add incremental information for after-market selection quality?

## IC-002 — actor separation
Never collapse:
- foreign investors;
- investment trusts;
- dealers;
- dealer proprietary vs hedge where source semantics allow;
- margin financing;
- securities borrowing / actual SBL short sale.

A combined "institutional net buy" can cancel economically different mechanisms.

## IC-003 — flow vs stock
Separate daily FLOW from POSITION/STOCK:
- cash net buy/sell = flow;
- futures/options OI = stock/exposure;
- margin balance/SBL balance = stock;
- daily margin/SBL changes = flow.

Raw levels need normalization by liquidity/free-float/market cap where PIT denominator exists. If denominator provenance is unavailable, keep raw evidence descriptive rather than fabricate normalized history.

## IC-004 — existing data audit
The project already has an official TWSE/TPEx institution synchronization path and research evidence for TWSE margin/SBL.
Important limitations:
- TPEX SBL is currently UNKNOWN in V8.7.11 research evidence;
- one-day SBL is RAW_DAILY_ONLY_NO_CONTIGUOUS_HISTORY and must not be labeled 5/20/60-day shorting flow;
- source-date/PIT guards already exist and must be preserved;
- current monthly snapshots cannot backfill historical first-known time.

Therefore market-source parity is a first-class falsification gate.

## IC-005 — candidate mechanisms
Pre-register before outcomes:
A. persistent same-actor cash flow (requires contiguous PIT history);
B. actor divergence: foreign vs trust vs dealer;
C. price-flow divergence: price strength with institutional selling, or weakness with accumulation;
D. crowding/overownership proxy only where denominator provenance exists;
E. margin/SBL pressure and unwind;
F. cash-vs-futures foreign exposure jointly with derivatives lane.

No universal "foreign buy = bullish" threshold is authorized.

## IC-006 — redundancy order
Validation order:
1. price trend / residual sector RS;
2. volume/liquidity;
3. existing Formal institutional condition;
4. market regime/breadth;
5. candidate institutional/crowding feature.

If the candidate adds no incremental information beyond existing institutional condition or price-volume reaction, mark REDUNDANT.

## IC-007 — falsification
Mandatory negative controls:
- actor-label shuffle within date;
- date-shift placebo;
- remove index-rebalance/passive-flow dates where identifiable;
- same-day cross-sectional rank rather than raw market-wide flow;
- TWSE-only vs TPEx-covered samples separately;
- crisis/event-date removal;
- independent scan-date aggregation.

Reject/downgrade if:
- effect is entirely price momentum;
- one institution actor/date cluster drives it;
- TPEx UNKNOWNs are silently treated as zero;
- raw net shares merely proxy stock size/liquidity;
- normalization uses future share denominator;
- passive/index flow explains the result.

## IC-008 — optimization bridge
Potential after-market optimization is not "require more institutional buying".
A candidate may be proposed only if a specific actor/state improves incremental selection quality or downside control beyond the existing Formal institutional rule and survives PIT/source-parity, passive-flow, redundancy, date-cluster and cost gates.

Possible future behavior:
- evidence/context annotation;
- tie-breaker among otherwise equivalent plans;
- only later, if strong evidence, a Formal condition adjustment.

Current status: FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.


## IC-009 — persistence requires a trading-session continuity proof

"Foreign bought 3 days in a row" is not valid from three rows unless those rows are the immediately preceding official trading sessions and each source is complete.

Required receipt:
- expectedSessions;
- observedSessions;
- missingSessions;
- sourceMarket;
- sourceDate/knownAt;
- provider completeness;
- actor field schema version.

Any missing expected session => persistence UNKNOWN, not false and not zero.

## IC-010 — reaction may be more informative than flow magnitude

Institutional flow should be tested jointly with price response.

Frozen descriptive cells:
- BUY_FLOW + PRICE_UP = aligned demand;
- BUY_FLOW + PRICE_FLAT/DOWN = possible absorption/distribution disagreement;
- SELL_FLOW + PRICE_UP = possible resilient demand / passive sell absorption;
- SELL_FLOW + PRICE_DOWN = aligned risk-off.

These are hypotheses, not labels of motive. Motive remains UNKNOWN without evidence.

Incremental test should ask whether flow-response interaction adds beyond price/volume alone. If not, reject the flow feature as redundant.

## IC-011 — crowding has two-sided risk

Persistent institutional ownership/flow can support continuation but can also create crowded-exit risk. Therefore crowding cannot be encoded as monotonic bullish evidence.

Prospective targets must include:
- continuation return;
- downside MAE/drawdown;
- liquidity deterioration;
- reversal after flow cessation.

A useful crowding feature may be a risk flag rather than a rank booster.

## IC-012 — first evidence gate

Before outcome testing:
1. prove contiguous multi-session official actor-flow history for both TWSE and TPEx or explicitly stratify markets;
2. preserve source schemas and PIT clocks;
3. identify passive/index rebalance dates or mark contamination UNKNOWN;
4. verify denominator provenance before any size-normalized flow.

Until then, one-day official flows are descriptive evidence only.

Status: DATA_FEASIBILITY_PARTIAL / MULTI_SESSION_PARITY_NOT_YET_PROVEN.


## IC-013 — current Formal institutionalScore decomposition

The current Formal helper is not a pure institutional-flow factor. It is a bounded composite:

`institutionalScore = clamp(8*foreignBuyDays + 10*trustBuyDays + 4*dealerBuyDays + 15*institutionsAligned + 6*currentBuy + clamp((institutionTotalNet/ADV20Shares)*25,0,25) + 0.15*chipConcentration, 0, 100)`.

Current streak horizon is exactly 3 official trading sessions.

Therefore the theoretical pre-clamp component ceilings are:
- foreign streak: 24;
- trust streak: 30;
- dealer streak: 12;
- synchronized current buying: 15;
- any current institutional buying: 6;
- aggregate positive net-flow / ADV contribution: 25;
- TDCC 400-lot-plus holder concentration: up to 15.

The unclamped maximum is 127, so saturation at 100 is structurally possible.

This score enters Formal candidate priority at 16%, and is also used by the small-market-cap exception. Any formula change is therefore Class C.

Status: FORMAL_COMPONENT_MAP_FROZEN / NO_CHANGE_AUTHORIZED.

## IC-014 — deterministic overlap inside the score

For a ready 3-session institution history, `foreignBuyDays>0`, `trustBuyDays>0`, and `dealerBuyDays>0` already encode the current session sign for those actors.

Therefore:
- `currentBuy` is deterministically implied by at least one current positive actor/streak;
- `institutionsAligned` is deterministically implied by all three current positive actors/streaks.

The +6 and +15 terms are not independent evidence. They are explicit nonlinear interaction bonuses layered on top of the already-scored current-day signs.

This is not automatically a bug: nonlinear consensus weighting can be intentional.
But it creates a mandatory falsification question:
does the interaction bonus add incremental outcome/risk information beyond the actor streak terms, or merely compress the score toward saturation?

A one-session all-three-positive state contributes at least:
`8 + 10 + 4 + 15 + 6 = 43`
before net-flow intensity and holder concentration.

A three-session all-three-positive state contributes:
`24 + 30 + 12 + 15 + 6 = 87`
before net-flow intensity and holder concentration.

Therefore saturation frequency and rank compression must be measured prospectively before any argument that a higher score is meaningfully stronger.

## IC-015 — chipConcentration is ownership concentration, not institutional identity

Current TDCC provenance explicitly defines `chipConcentration` as:
`集保400張以上持股占比；每週資料，不等於主力或法人身分`.

Yet it contributes `0.15 * chipConcentration`, up to 15 points, inside `institutionalScore`.

This creates a semantic hybrid:
- institutional cash-flow / persistence evidence;
- large-holder ownership concentration.

The ownership term may be useful, but it must not be interpreted as institutional buying or Smart Money identity.

Frozen falsification:
1. decompose current score into FLOW/STREAK, NONLINEAR_CONSENSUS, NET_INTENSITY, and LARGE_HOLDER_CONCENTRATION components;
2. test whether the concentration component adds incremental value after size, liquidity, price trend, Residual RS and existing flow components;
3. if not, classify the ownership contribution as REDUNDANT inside institutionalScore;
4. if it predicts downside/crowded-exit risk with the opposite sign, do not preserve it as a monotonic positive score merely because it is ownership concentration.

No weight removal is proposed yet.

## IC-016 — actor semantic compression in current parser

The official TWSE and TPEx three-institution daily reports expose more actor detail than the current normalized snapshot retains.

Official source supports:
- foreign investors excluding foreign dealers;
- foreign dealers;
- investment trusts;
- dealer proprietary trading;
- dealer hedging;
- aggregate dealer;
- aggregate three-institution total.

Current parser instead stores only:
- `foreignNet`, with TWSE foreign-main + foreign-dealer combined;
- `trustNet`;
- `dealerNet`, with proprietary + hedge combined;
- `institutionTotalNet`.

Therefore economically distinct dealer proprietary and hedge flows are collapsed before `institutionalScore`.
The same source already contains the split; no new public data vendor is needed for future semantic preservation.

Research implication:
- current `dealerNet` must not be described as pure directional dealer conviction;
- future actor-separated research should first preserve raw proprietary/hedge and foreign-dealer components prospectively;
- historical exact split is not to be fabricated from existing aggregate D1 institution snapshots.

Because the parser is shared by Formal institution-history ingestion, any runtime change to preserve these extra fields should be reviewed as shared-runtime/Class-B proposal-first even if downstream research remains decisionImpact=false.

## IC-017 — 3-session cross-market persistence parity is already materially proven

The earlier IC-012 blocker was too broad.

Current runtime:
- uses official TWSE T86 and TPEx dailyTrade endpoints;
- requires minimum combined coverage of 1,500 securities;
- derives `expectedDates` from the official trading calendar;
- requires all 3 immediately recent official trading sessions;
- fails the after-market scan when the 3-session institution-history receipt is not ready.

Thus for a successful Formal scan:
`FOREIGN/TRUST/DEALER AGGREGATE 3_SESSION_PERSISTENCE_PARITY = MATERIAL_PASS`
for the current normalized actor schema.

Still unresolved:
- 5/20/60-session institutional persistence;
- historical immutable first-known provenance for richer actor splits;
- dealer proprietary vs hedge persistence;
- foreign-main vs foreign-dealer persistence;
- passive/index-flow contamination;
- actor-specific size/liquidity normalization beyond current aggregate net/ADV proxy.

The first evidence gate should therefore be narrowed rather than left as a generic multi-session-source blocker.

## IC-018 — existing Shadow data are sufficient for score-decomposition falsification

Prospective research snapshots already contain:
- institutionalScore;
- foreignBuyDays/trustBuyDays/dealerBuyDays;
- foreignNet/trustNet/dealerNet;
- institutionTotalNet;
- chipConcentration;
- avgVolume20Lots in the volume block.

Therefore the current Formal score can be decomposed exactly for clean prospective Shadow parents without any new market-data call or historical reconstruction.

Frozen diagnostics, with no score change:
- streakLinearContribution;
- consensusInteractionContribution;
- aggregateNetIntensityContribution;
- largeHolderConcentrationContribution;
- preClampInstitutionalScore;
- scoreSaturated100;
- actorSignDivergence;
- aggregateNetNegativeButAnyActorPositive;
- score share attributable to ownership concentration.

Primary falsification:
- if full institutionalScore adds no more than price/volume/Residual-RS controls, reject incremental value;
- if only one decomposed component is stable, do not preserve all components by inertia;
- if saturation is common, test whether the 0-100 compression destroys rank information;
- if high scores behave differently across market regimes, do not encode universal monotonic strength;
- if concentration and institutional flow point in opposite risk directions, split semantics rather than averaging them.

No alternative weight set is authorized. This is decomposition, not parameter search.

## IC-019 — Taiwan evidence strengthens the non-monotonic / state-dependent guard

Relevant evidence:
- Hsieh (2013), International Review of Financial Analysis, finds Taiwan institutional herding and subsequent return effects that vary with market pressure and stock characteristics. DOI: 10.1016/j.irfa.2013.01.003.
- Chen (2012), Managerial Finance, reports foreign institutional industry herding, with momentum trading in tranquil 2002–2006 but contrarian trading during the 2007–2008 crisis. DOI: 10.1108/03074351211201442.
- A 2025 Taiwan market-state herding study reports that the relation between institutional herding and future excess returns differs across downturns/booms and by concentration intensity. DOI: 10.1080/23322039.2025.2571399.
- Tsai, Shu & Chiang (2019) report foreign investors facilitate price discovery in hot markets but become market followers in cold markets. DOI: 10.1016/j.mulfin.2019.100591.

These studies use different samples/measures and do not validate the current proprietary score weights.
They do, however, strongly falsify a naive assumption that institutional/crowding intensity should have one unconditional positive sign.

## IC-020 — exact next continuation

1. Do not change institutionalScore or its 16% Formal priority weight.
2. On the first clean prospective Shadow cohorts, compute the exact existing-score decomposition from already stored fields; no runtime capture change is required.
3. Measure score saturation and actor-divergence frequency before outcome analysis.
4. After coverage is complete, test D1/D3/D5/D10/MFE/MAE/false-break/stop outcomes by decomposed component with scanDate as the inference unit.
5. Control current market regime, R06 transition state when valid, stock/sector momentum, Price-Volume, liquidity/size, overheat and sector gate.
6. Treat TDCC concentration separately from institutional cash flow in interpretation.
7. Prepare a separate Class-B proposal only if preserving dealer proprietary/hedge and foreign-dealer splits prospectively is justified; do not modify the shared parser autonomously.
8. Only after robust incremental evidence may a Class-C institutionalScore reformulation be surfaced to the owner. No weight tuning before that.
