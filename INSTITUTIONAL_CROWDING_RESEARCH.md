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


## IC-021 — TWSE/TPEx institutional-flow unit parity verified

Fresh parser + first-party exchange audit closes one potential cross-market unit risk.

### TWSE
Current parser reads fields explicitly named:
- 外陸資買賣超**股數**(不含外資自營商);
- 外資自營商買賣超**股數**;
- 投信買賣超**股數**;
- 自營商買賣超**股數**;
- 三大法人買賣超**股數**.

### TPEx
Current `dailyTrade` 24-column table structure is:
- indexes 8/9/10 = 外資及陸資 aggregate buy / sell / net **股數**;
- indexes 11/12/13 = 投信 buy / sell / net **股數**;
- indexes 20/21/22 = 自營商 aggregate buy / sell / net **股數**;
- index 23 = 三大法人買賣超**股數合計**.

Current parser uses exactly:
- foreignNet = row[10];
- trustNet = row[13];
- dealerNet = row[22];
- institutionTotalNet = row[23].

The existing validation also requires:
`foreignNet + trustNet + dealerNet == institutionTotalNet`
for every normalized stock.

### Score denominator compatibility

Formal net-intensity component divides:
`institutionTotalNet / (avgVolume20Lots * 1000)`.

Since:
- institutionTotalNet is raw shares;
- avgVolume20Lots is lots and ×1000 converts to shares;

the ratio is shares / shares on both TWSE and TPEx.

Decision:
`INSTITUTION_FLOW_UNIT_PARITY = MATERIAL_PASS`.

Do NOT create a market-specific 1000x correction.
Any observed TWSE/TPEx institutional-score difference must be investigated through actor composition, liquidity/size, source coverage or market structure rather than assumed unit mismatch.

Remaining semantic issues are unchanged:
- foreign-main vs foreign-dealer are collapsed;
- dealer proprietary vs hedge are collapsed;
- flow is not holdings;
- actor effect remains regime/state dependent.


## IC-022 — TPEx parser schema-drift hardening

Current unit/actor order is materially consistent with the official TPEx table, so no current flow rescaling is required.

A separate reliability gap remains:
- parser consumes fixed positions 10/13/22/23;
- validator requires 24 fields plus only field[0] and field[23] sentinels;
- interior actor columns are not individually schema-asserted.

Therefore a future interior reorder could be accepted while changing actor meaning.

This is a **source-contract robustness risk**, not evidence of current bad data.

Frozen proposal:
`research/institution_source_schema_hardening_v0_1.json`.

Before implementation:
1. capture official JSON fixture(s);
2. freeze exact 24-field strings/order and semantic fingerprint;
3. validate actor indexes explicitly;
4. fail closed on unrecognized schema;
5. preserve total arithmetic consistency.

Because the parser is shared Formal ingestion, implementation is Class B proposal-first.
No runtime/parser change is authorized here.


## IC-023 — long-block falsification synthesis: institutional flow is a state-conditioned interaction, not a monotonic rank

Research cycle: 2026-09-28 Asia/Taipei
Status: FALSIFICATION_ADVANCED / FORMAL_CORE_LOCKED

### Question
Does stronger institutional buying, persistence or ownership concentration deserve a universally higher after-market selection rank?

### Positive mechanism
Taiwan evidence supports plausible information-based institutional herding and continuation in some samples. Persistent same-side institutional demand can reveal correlated information, delayed price discovery or benchmark-related demand that has not fully cleared.

### Counterevidence
The sign is not stable enough to justify a universal monotonic rule:
- Taiwan studies report institutional-herding effects that vary with market pressure/state and stock characteristics.
- Foreign institutional industry behavior has changed between momentum and contrarian modes across tranquil versus crisis samples.
- Taiwan mutual-fund evidence distinguishes buy-side continuation from sell-side reversal.
- Current public three-institution aggregates mix economically different motives, including directional conviction, hedging, passive/index activity and inventory/liquidity management.

Decision: reject the hypothesis `MORE_INSTITUTIONAL_BUYING_IS_UNCONDITIONALLY_BETTER` as a research assumption. This does NOT reject institutional information itself; it changes the required estimand to conditional incremental information.

### Frozen primary estimand
Do not search new weights. On existing prospective Shadow rows, test whether the already-stored institutional components add incremental information conditional on:
1. scanDate and market/regime state;
2. stock and sector momentum / Residual RS;
3. price-volume reaction and liquidity/size;
4. overheat and sector-gate state;
5. passive/index contamination where known.

Primary comparison cells:
- FLOW_ALIGNED: positive institutional flow + positive price reaction;
- BUY_ABSORBED: positive flow + flat/negative reaction;
- SELL_RESILIENT: negative flow + positive reaction;
- SELL_ALIGNED: negative flow + negative reaction.

These names describe observables only and MUST NOT assert motive.

Outcomes: D1/D3/D5/D10/D20 return, MFE, MAE, stop/no-follow-through/false-break where available.
Inference unit: independent scanDate, not individual stock rows.

### Existing-score decomposition
For every clean prospective row, derive without changing runtime capture:
- streakLinearContribution;
- consensusInteractionContribution;
- aggregateNetIntensityContribution;
- largeHolderConcentrationContribution;
- preClampInstitutionalScore;
- scoreSaturated100;
- actorSignDivergence;
- concentrationShareOfScore.

First inspect coverage, saturation and component correlation before returns. Outcome inspection is forbidden until data-quality/coverage receipt is frozen.

### Critical falsification
A candidate component is downgraded or rejected if:
- its effect disappears after price/volume, Residual-RS and regime controls;
- one date/sector/actor cluster dominates;
- passive/index event removal removes the effect;
- high institutionalScore merely identifies already-rising/high-volume stocks;
- TDCC large-holder concentration has no incremental effect or has an opposite downside-risk sign;
- saturation at 100 destroys meaningful cross-sectional rank;
- TWSE/TPEx source coverage or UNKNOWN handling differs materially.

### Crowding interpretation
Crowding is explicitly two-sided. Persistent flow/ownership may support continuation before cessation, but can raise exit-risk after demand exhausts. Therefore future crowding research must estimate both continuation and downside/flow-cessation reversal. A useful crowding feature may become a risk/context flag rather than a rank booster.

### Leverage/shorting semantic guard
Do not combine:
- margin long balance/change;
- margin short balance/change;
- securities borrowing;
- actual borrowed-stock short sale;
- borrowed-stock short-sale balance.

Borrowing is not short selling. No `short pressure` variable is valid unless its underlying object is explicit. This preserves LS-001..LS-047 semantics.

### Passive-flow contamination guard
Institutional cash flow on index-review/effective dates may be benchmark mechanical. Announcement date, effective date and effective-close execution are separate clocks. If passive contamination cannot be identified, mark it UNKNOWN; do not infer informed buying/selling.

### Candidate status
No FORMAL_OPTIMIZATION_CANDIDATE yet.
The current best research candidate is an OBSERVER-only `INSTITUTIONAL_STATE_INTERACTION` diagnostic, not a new score, veto or weight.
Promotion gate requires prospective PIT/OOS or Shadow evidence, independent dates, regime coverage, passive-flow exclusion/stratification, redundancy controls and costs.

## IC-024 — exact next continuation after long-block synthesis

1. Read the newest prospective Shadow archive and determine whether clean rows already contain all IC-023 decomposition parents.
2. Freeze a coverage/saturation receipt before looking at future outcomes.
3. If sample gates pass, run the pre-registered decomposition and four flow×price-response cells by independent scanDate.
4. Test leave-one-date-out, sector concentration, TWSE/TPEx strata and passive-event exclusion.
5. Separately continue LS-048 only when the official TPEx margin artifact/stable contract exists; do not let that blocker stop the institutional-score decomposition lane.
6. Keep PF outcome testing data-gated until constituent/AUM/effective-close contracts are adequate.
7. Only surface a Class-C institutionalScore reformulation if incremental evidence survives the full falsification stack.

## IC-025 — prospective Shadow readiness re-audit closes outcome interpretation

Research cycle: 2026-09-28 Asia/Taipei
Status: DATA_QUALITY_BLOCKED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Latest verified Production research-dashboard readback:
- runtime version = `8.14.0-sector-gate-provenance-shadow`;
- Candidate Shadow Archive = 62 rows across only 2 archived scan dates (2026-09-21 and 2026-09-22);
- expected scan dates = 3, archived dates = 2, integrity = `RESEARCH_DATA_GAP`;
- known missing archive date = 2026-09-23;
- outcome coverage = D1 40, D3 18, D5/D10/D20 all 0;
- external-evidence market coverage = TWSE 53 / TPEx 0 / UNKNOWN 9;
- actual SBL-short evidence available = 0;
- evidence-readiness matrix remains `DATA_QUALITY_BLOCKED` and not eligible for Formal review.

Source code confirms prospective research serialization contains the parents needed for exact existing-score decomposition, but the current verified runtime readback exposes aggregate readiness rather than an auditable row-level parent-completeness/saturation distribution.

Therefore:
- source-schema presence is not market-data completeness;
- do not infer score-saturation frequency, component correlation or actor-divergence frequency from code alone;
- do not use synthetic fixtures as empirical evidence;
- do not inspect forward institutional outcomes while the pre-registered data-quality gate is closed.

Machine receipt:
`research/institutional_score_decomposition_readiness_20260928_v0_1.json`.

## IC-026 — ownership cadence and passive contamination refine the decomposition unit

Parallel PIT audits materially change how the ownership component must be tested.

`chipConcentration` is a slow ownership stock measured from weekly TDCC distribution data, while foreign/trust/dealer observations are daily/3-session flows. Reusing one weekly ownership value on several scan dates does not create several independent ownership updates.

Required ownership inference unit:
`symbol × chipAsOfDate` for ownership-vintage questions, with scanDate clustering retained for market-outcome inference.

Current prospective research rows preserve `chipConcentration` but not an immutable same-generation `chipAsOfDate/chipDefinition` receipt. A later mutable quality-snapshot reread cannot prove same-generation lineage. Therefore ownership-vintage deduplication is currently provenance-blocked and remains UNKNOWN rather than being approximated by scanDate.

Also, TDCC 400-lot-plus concentration is holder-identity agnostic. It cannot identify active institutions, passive index funds, strategic holders or other large holders. No passive ownership share may be inferred from this bracket.

Implication for current institutionalScore:
- the ownership term must be interpreted as a slow ownership-state component, not same-day Smart Money flow;
- its repeated presence across daily scores may create persistence in the score without new ownership information;
- its incremental value must eventually be tested at ownership-vintage cadence, not by treating each daily repetition as independent evidence.

## IC-027 — passive-flow negative evidence is now narrow but usable as a semantic control

Passive-flow research has validated a deterministic four-cycle source pattern for one bounded universe:
`MSCI | GLOBAL_STANDARD | TAIWAN | PERIODIC_REVIEW | MEMBERSHIP_ADD_DELETE`.

This enables the narrow state:
`NO_MSCI_STANDARD_MEMBERSHIP_ADD_DELETE_VERIFIED`,
when provider artifact identity, publication/effective clocks, Taiwan-section presence and summary-vs-section count reconciliation all pass.

Important falsification:
This does NOT establish `NO_INDEX_EVENT`, `NO_WEIGHT_CHANGE`, `NO_PASSIVE_FLOW` or `ORDINARY_FLOW_CONTEXT_VERIFIED`. Weight-only changes, other MSCI families, FTSE/TWSE/TIP/custom indices, ETF creations/redemptions and other benchmark flows remain outside the bounded denominator.

A further source-use gate exists: public MSCI artifacts include restrictions on database/analytics uses. Public accessibility is not authorization for persistent automated ingestion. Any future event archive/runtime join must use an authorized/licensed source or receive an appropriate permission determination.

### Revised exact next continuation
1. Keep institutional outcomes closed until the row-level decomposition readiness gate is satisfied.
2. Obtain verified row-level or server-side aggregate research access and compute outcome-blind coverage, score saturation, actor divergence and component correlations before any returns.
3. Preserve `chipAsOfDate/chipDefinition` prospectively before ownership-vintage inference; no historical reconstruction.
4. Use bounded MSCI membership negative evidence only as a narrow contamination stratifier; broader passive context remains UNKNOWN.
5. Keep LS-048 independently blocked on the official TPEx margin artifact/stable endpoint; do not coerce missing leverage history into zero.
6. No alternative institutionalScore weights or thresholds are to be searched.
7. No FORMAL_OPTIMIZATION_CANDIDATE exists yet.

## IC-028 — crowding must be multi-axis and multi-cadence, not a scalar score

Research cycle: 2026-09-28 Asia/Taipei
Status: CONCEPT_FALSIFICATION_ADVANCED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

A new research artifact freezes the cross-family state model:
`research/crowding_multiaxis_state_matrix_v0_1.json`.

### Why a scalar crowding score is rejected at concept level
Current evidence families represent different economic objects and clocks:
- margin long = leveraged long stock/flow;
- margin short = exchange margin short stock/flow;
- securities borrowing = borrow transaction/stock, not automatically a short sale;
- actual SBL short sale = short execution evidence, still potentially hedge/arbitrage-confounded;
- institutional cash flow = daily/3-session actor flow;
- TDCC concentration = slow weekly ownership stock;
- passive/index event = mechanical-flow context with separate announcement/effective clocks.

Adding or netting these raw objects into one number would destroy information and create false cancellation.

### 2026 market-structure falsification of nominal-margin alarm
TWSE's 2026 market-structure analysis provides a useful contemporary falsification: nominal market-wide margin-loan balance reached a record, yet margin-loan balance relative to listed market capitalization was much lower than the April-2000 comparison and market-wide margin-call/forced-liquidation conditions were comparatively contained.

Research decision:
`NOMINAL_MARGIN_BALANCE_HIGH => CROWDING_HIGH` is rejected.

Required leverage views are scale/history normalized when PIT denominators are valid:
- balance / market or stock scale;
- daily change / ADV;
- own-history percentile/z-score;
- sector-relative leverage penetration where comparable.

### Two-sided positioning is disagreement, not arithmetic neutralization
Historical Taiwan short-sale evidence found short-interest information and an interaction between high relative short interest and high relative margin trading consistent with stronger disagreement/overvaluation effects in its historical regime.

The old sample/rules cannot be transplanted to 2026, but it strongly rejects a naive construction:
`long leverage - short positioning = net crowding`.

High long and high short positioning must remain a `TWO_SIDED_DISAGREEMENT` state to be tested for volatility, drawdown and path dependence rather than assigned a directional sign.

### Frozen state families
- `LONG_LEVERAGE_BUILD`;
- `LONG_CROWDING_RISK`;
- `DELEVERAGING_STATE`;
- `SHORT_INFORMATION_PRESSURE`;
- `SQUEEZE_CANDIDATE`;
- `TWO_SIDED_DISAGREEMENT`;
- `INSTITUTIONAL_OWNERSHIP_CROWDING`;
- `MECHANICAL_FLOW_CONTEXT`.

None maps directly to BUY/SELL.

Critical negative definitions:
- falling financing balance alone is NOT forced liquidation;
- high short balance alone is NOT a squeeze;
- short covering alone is NOT a squeeze;
- securities borrowing alone is NOT short pressure;
- high ownership concentration alone is NOT institutional conviction;
- mechanical/passive context alone is NOT bearish and not non-predictive.

## IC-029 — revised exact next continuation

1. Do not invent or tune a scalar crowding score.
2. First obtain PIT-complete normalized inputs and estimate state frequencies/transitions without outcomes.
3. Keep long leverage, margin short, securities borrowing, actual SBL shorting and ownership as separate evidence families.
4. When outcome gates later pass, test continuation plus MAE/MFE and volatility/false-break outcomes by state, with independent scanDate and ownership-vintage clustering.
5. Require regime/sector/liquidity/passive-event controls and preserve UNKNOWN.
6. Current D06 evidence is stronger conceptually but still not sufficient for L3 promotions without PIT empirical coverage.
7. Formal Core remains unchanged; no FORMAL_OPTIMIZATION_CANDIDATE.

## IC-030 — Production outcome-blind decomposition: severe cap saturation falsified; actor divergence and same-session exposure become the primary structural questions

Research cycle: 2026-09-29 Asia/Taipei
Production evidence: `research/institutional_score_decomposition_observer_readback_20260929_v0_2.json`
Status: STRUCTURAL_FALSIFICATION_ADVANCED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

The Class-A server-side observer is deployed and verified on the existing 62-row prospective Shadow archive.

### Data/invariant result
- 62/62 rows are decomposition-ready;
- stored institutionalScore reconstructs exactly on all 62 rows;
- no stored parent field is missing;
- foreign/trust/dealer streak endpoint versus current-net sign mismatch = 0 for all three actors;
- archive still spans only two independent scan dates (2026-09-21 and 2026-09-22); 2026-09-23 remains missing and integrity remains RESEARCH_DATA_GAP.

The zero endpoint mismatch materially supports semantic consistency of the stored 3-session streak endpoints on this bounded archive. It does NOT prove that upstream serialized zeros preserve every missing-source distinction; the observer retains that guard.

### Cap-saturation hypothesis is currently falsified
The earlier formula-geometry concern that the 100-point clamp might already be broadly flattening live institutional ranks is not supported in this bounded archive:
- saturated at 100 = 0/62;
- maximum pre-clamp score = 90.63;
- net-intensity subcomponent capped at 25 = 1/62 (1.61%).

Decision:
`CURRENT_SEVERE_100_CAP_SATURATION = FALSIFIED_ON_BOUNDED_SHADOW_ARCHIVE`.

This does not prove the cap can never matter on future/full-scan populations. Keep monitoring prospectively rather than reformulating the score because of theoretical geometry alone.

### Same-session direction versus real persistence
The streak-related score can now be split without outcomes:
- currentDayDirectionBase mean = 9.065 points;
- persistenceBeyondDay1 mean = 8.806 points;
- nonlinear consensus interaction mean = 6.339 points;
- sameSessionDirectionPoints (current direction base + nonlinear current-direction bonus) mean = 15.403 points.

Relative to pre-clamp institutionalScore:
- same-session direction share: mean 39.1%, median 43.2%;
- persistence beyond day 1 share: mean 19.3%, median 22.1%.

Structural correlation:
`currentDayDirectionBase × consensusInteraction = 0.8155`.

Interpretation:
The current score has substantial exposure to the same current-session actor-direction state through both first-day streak points and the +6/+15 interaction. This is not proof that the nonlinear interaction is harmful: a consensus interaction can contain valid nonlinear information. But it falsifies any interpretation that all streak/consensus points represent independent multi-day persistence.

Future outcome tests must therefore compare:
1. current-day direction base;
2. persistence beyond day 1;
3. nonlinear consensus interaction;
4. aggregate net intensity;
5. ownership concentration;
rather than treating the existing 0–100 score as one indivisible institutional construct.

### Actor divergence is common
On the 62 bounded rows:
- mixed actor signs = 36/62 (58.06%);
- at least one actor positive while aggregate institutional total is negative = 23 rows;
- aggregate total positive while at least one actor is negative = 13 rows;
- all three actors positive = 5/62 (8.06%).

This materially supports actor separation. Aggregate three-institution sign frequently hides cross-actor disagreement and must not be treated as equivalent to consensus.

### >=70 occupancy
5/62 rows (8.06%) have institutionalScore >=70.

This is only bounded-Shadow occupancy. It is NOT full-scan prevalence and does not establish a defect in the 10–30bn special-reason gate. The 100 cap and >=70 eligibility are separate questions.

### Ownership remains cadence-blocked
Large-holder concentration contributes mean 8.898 points and accounts for mean 36.6% / median 27.9% of pre-clamp score in this bounded archive.

This is structurally material, but no economic sign may be inferred yet because TDCC is slow weekly ownership and immutable same-generation chipAsOfDate is not preserved in current research rows. Daily reuse of one weekly value must not multiply independent ownership evidence.

### Promotion decision
No FORMAL_OPTIMIZATION_CANDIDATE.

Reason:
- only two independent scan dates;
- D5/D10/D20 institutional outcomes remain unavailable;
- 9/23 archive gap persists;
- TPEx external-evidence coverage remains incomplete;
- passive-context denominator is incomplete;
- ownership vintage provenance remains incomplete.

---

## IC-031 — broker branch flow is an execution-location proxy, not main-force identity

Research artifact:
`research/broker_branch_main_force_semantic_guard_v0_1.json`.

Official exchange semantics materially falsify a common market shortcut.

Broker/branch buy-sell data describe transactions executed through a broker/branch. They do not reveal a unique beneficial owner. A branch can aggregate many unrelated clients; one investor can route through several branches; and broker head-office rows can include proprietary activity.

Therefore the following identity claim is prohibited:
`BRANCH_NET_BUY => ONE_MAIN_FORCE/SMART_MONEY_BUYING`.

Valid future research objects may include normalized branch-flow concentration, branch breadth and persistence, but their interpretation is order-routing/concentration evidence, not investor identity.

A second falsification concerns sample construction. Official hot-stock/hot-broker subsets are conditioned on popularity/turnover. They cannot serve as an unbiased universe for testing branch alpha. A complete-universe or explicitly sampled denominator is required.

The official complete all-stock branch product exists but is cost-gated. No paid source purchase is authorized or necessary for the current concept stage.

Status: `MECHANISM_AND_FALSIFICATION_DEFINED / BENEFICIAL_OWNER_UNIDENTIFIABLE / OUTCOMES_CLOSED`.

---

## IC-032 — day trading is turnover composition, not directional inventory

Research artifact:
`research/day_trading_chip_crowding_semantic_guard_v0_1.json`.

Official Taiwan stock-level day-trading data make this lane feasible, but the economic object must be kept straight.

Day-trading activity measures same-session round-trip turnover under the applicable eligibility rules. It can proxy attention, liquidity demand, speculative intensity and short-horizon turnover. It is not an overnight position stock.

Rejected shortcuts:
- high day-trading ratio = bullish;
- high day-trading ratio = bearish;
- day-trading buy value minus sell value = clean directional inventory.

Potential future state interaction:
- high day-trading + weak price acceptance + high leverage/volatility may describe fragile speculative crowding;
- high day-trading + strong depth/acceptance may instead describe healthy liquidity/participation.

Therefore day trading enters D06 as context/interacting state, not as a standalone monotonic score.

Prospective same-day source timestamp before the after-market decision clock still needs proof before L3.

---

## IC-033 — D06 curriculum denominator correction

The learning map previously contained 12 D06 modules but omitted three subjects already required by the room scope:
- broker branch / main-force proxies;
- day trading / short-horizon turnover;
- state-owned-bank / specific-fund flow.

These are now explicitly restored as D06-13 through D06-15. Each starts at L2 because mechanisms and falsification conditions are defined, but PIT/OOS evidence is not mature.

D06 therefore now contains 15 modules and remains 40.0%.

This is a curriculum-denominator correction, not maturity inflation.

## IC-034 — exact next continuation
1. Do not change institutionalScore weights after the structural readback.
2. Accumulate independent prospective scan dates until D5+ outcomes and readiness gates open.
3. Pre-register component-level outcome comparisons before reading those outcomes: current-day direction, persistence-beyond-day1, nonlinear consensus, actor divergence, net intensity and ownership concentration.
4. Preserve TDCC chipAsOfDate/chipDefinition prospectively before ownership outcome inference.
5. Continue PF with prospective ETF units-delta + PCF timestamp/corporate-action receipts; do not substitute AUM delta.
6. Keep LS-048 blocked unless a free documented official history contract or explicitly authorized artifact/subscription becomes available; do not incur data cost autonomously.
7. For broker branches, require complete-universe/source-vintage evidence before alpha tests; do not use hot-stock leaderboards as a substitute.
8. For day trading, first prove same-day PIT availability relative to the after-market decision clock, then test only conditional interactions.
9. State-owned-bank flow remains context-only until its source contract and beneficial-owner ambiguity are handled.
10. Formal Core remains LOCKED; current promotion status is FALSIFICATION_IN_PROGRESS.


## IC-035 — D06 after-market source-clock matrix: activity, stock and eligibility must not share one timestamp

Research cycle: 2026-09-29 Asia/Taipei
Status: PIT_CONTRACT_ADVANCED / PROSPECTIVE_RECEIPT_STILL_REQUIRED / FORMAL_CORE_LOCKED

Official exchange product contracts add an important timing falsification to D06-07/08/09/14.

### Confirmed TWSE publication clocks
- Stock-level day-trading statistics: approximately 20:00 each trading day. The file contains day-trading shares plus buy/sell value; it is an activity/turnover object, not directional overnight inventory.
- Securities-borrowing balance (TWT72U): 20:30 each trading day. It contains prior balance, new borrowing, returns/closures, current balance and market fields. This is a stock/flow ledger for borrowing, not proof that every borrowed share was sold short.
- Margin financing / margin short weekly balance product: approximately 20:30 on the last trading day of each week. A weekly product cannot be substituted for a daily first-known contract.
- Three-institution weekly report product: 20:00 each trading day and explicitly separates dealer proprietary versus hedge activity. This supports actor/desk semantic separation but does not by itself prove our runtime capture time.

### PIT consequence
There is no valid single label called AFTER_MARKET_AVAILABLE for all chip data. Each field family requires its own sourceDate, sourceProduct/version, producedAtContract, capturedAt and firstKnownAt. A 20:00 decision may know one product while a 20:30 product is still future information. Historical files downloaded later may establish event-date values but cannot fabricate historical capturedAt/firstKnownAt or historical Shadow.

### Cross-factor falsification
The timing split blocks a subtle look-ahead path in crowding composites. A same-date feature such as dayTradingRatio x borrowingBalanceDelta x marginLeverage is PIT-valid only when the decision timestamp is after the latest first-known timestamp among all required inputs. Otherwise the composite is UNKNOWN, not partially zero-filled. This is especially important because day trading is turnover composition while borrowing balance is a position/ledger object; contemporaneous correlation does not establish causality.

### TPEx boundary
A TPEx market-summary product has an explicit 17:20 production clock, proving that TPEx products can expose formal production times. It does NOT prove the clock for stock-level day-trading, margin or borrowing products. Those remain product-specific UNKNOWN until their own documented contract or prospective receipt is obtained.

### Research decision
- D06-14 remains L2: TWSE contract-time feasibility improved, but prospective receipt/replay evidence and TPEx product-specific coverage are still incomplete.
- D06-07/08/09 remain L2: official product semantics/clocks improve the source contract, but no promotion is allowed without prospective capture, market coverage and replay evidence.
- No scalar crowding score, no threshold tuning, no outcome reading, no Formal change.
- FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## IC-036 — exact next continuation
1. Build an outcome-blind prospective receipt ledger for each D06 source family with sourceDate, market, product/version, producedAtContract, requestAt, capturedAt, firstKnownAt, parse status, coverage and deterministic content hash.
2. Do not infer TPEx day-trading/margin/SBL clocks from unrelated TPEx products; obtain product-specific documented contracts or keep UNKNOWN.
3. Keep IC-030 institutional decomposition outcome preregistration closed until independent D5+ outcomes/readiness gates open; do not inspect outcomes early.
4. For D06-14 preregister conditional states only after receipt coverage exists: day-trading intensity x price acceptance x volatility x leverage/shorting, with monotonic high-day-trading shortcuts as negative controls.
5. For D06-07/08/09 preserve financing, margin short, securities borrowing and actual SBL shorting as separate evidence families; never net them into one directional score.
6. Continue PF with prospective ETF units-delta + PCF timestamp/corporate-action receipts; do not substitute AUM delta.
7. Keep broker-branch beneficial-owner identity prohibited and require complete-universe/source-vintage evidence before alpha tests.
8. Formal Core remains LOCKED; promotion status remains FALSIFICATION_IN_PROGRESS.

## IC-044 — broker-branch source tiers: dealer-confound reduction can create selection bias

Research cycle: 2026-10-04 Asia/Taipei
Status: SOURCE_TIER_FALSIFICATION_ADVANCED / COST_GATED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Research artifact: `research/broker_branch_main_force_semantic_guard_v0_2.json`.

Official TWSE products expose three materially different research universes:
- public current-day BSR query: same-day branch execution view, but not a frozen historical bulk replay contract;
- full all-stock report: 16:10 production, complete universe, but combines proprietary and brokerage-client flow; proprietary activity is aggregated to head office and the source is paid/cost-gated;
- most-active-stock broker detail: 15:00 production and excludes proprietary trading, but selects securities by purchase turnover and therefore conditions the sample on activity/attention.

Important falsification:
Removing proprietary trading does NOT solve beneficial-owner identity. The selected active-stock product reduces dealer confounding but introduces sample-selection/collider risk. It cannot be used to claim full-market branch alpha.

Therefore source denominator is part of the feature definition. Branch concentration/persistence statistics are comparable only inside an explicitly declared source tier and selection rule.

D06-13 remains L2/40%. No authorized complete-universe replayable source is currently available without cost, and no purchase is authorized.

---

## IC-045 — day-trading surveillance threshold is not an alpha threshold; TPEx requires vintage-aware replay

Research artifact: `research/day_trading_chip_crowding_semantic_guard_v0_2.json`.

TWSE official day-trading product is produced at approximately 20:00 and supplies stock-level day-trading shares plus buy/sell values. This confirms a same-day source clock for TWSE.

However TWSE's own surveillance rule is a strong falsifier against treating a popular threshold as alpha. The high-day-trading attention condition uses >60% day-trading-volume ratios over the latest six sessions and the prior session, with liquidity/activity exceptions and ETF/active-ETF exclusions.

Research decision:
`DAYTRADING_RATIO > 60% => BEARISH` and `=> BULLISH` are both rejected. The 60% level is a regulatory surveillance condition, not a predictive return cutoff.

TPEx adds a separate PIT problem. Its stock-level day-trading figures are broker-reported and can be revised on T+1 and T+2; T+2 is final while T/T+1 are auxiliary. Publication completion on T day varies with broker processing.

Therefore later historical TPEx values must not be backfilled as if they were the original T-day decision-time values. Required labels are `T_PRELIM`, `T1_REVISED`, `T2_FINAL` with actual capturedAt/firstKnownAt.

D06-14 remains L2/40% because cross-market prospective replay is not yet validated even though TWSE's contract is strong.

---

## IC-046 — public-financial-institution identity is not the same object as the market 'eight-bank' trading proxy

Research artifact: `research/state_owned_bank_flow_identity_guard_v0_1.json`.

Ministry of Finance official public-financial-institution governance refers to a nine-bank set that includes the Export-Import Bank. Market/vendor 'eight state-owned-bank' trading aggregates are therefore not automatically the same entity universe.

Four identity layers are now frozen separately:
1. legal public financial institution;
2. securities broker/branch used for execution;
3. beneficial owner / investment book;
4. government policy or stabilization mandate.

A branch affiliated with a public financial group may execute customer orders, while a public bank can route its own trade through another broker. Likewise public-bank ordinary investment and government-fund/policy intervention are distinct economic actors.

Therefore branch/proxy flow may support `PUBLIC_PROXY_FLOW_*` context states but cannot be labeled `GOVERNMENT_BUY`, `NATIONAL_STABILIZATION_FUND_BUY` or `POLICY_SUPPORT_BUY` without independent official mandate evidence.

D06-15 remains L2/40% and CONTEXT_ONLY / WARNING_MODIFIER. The exact provider-specific member/broker-code map, vintage and customer-vs-proprietary semantics must be frozen before any empirical test.

---

## IC-047 — weekend continuation after source-identity deepening
1. Do not promote D06-13/14/15 from documentation alone.
2. Next valid trading day, preserve TPEx day-trading T-day preliminary receipt and later T+1/T+2 revisions for the same date; measure revision magnitude outcome-blind before any return join.
3. Keep D06-13 complete-universe broker data cost-gated; selected active-stock products may be used only for selected-universe methodology tests, never full-market alpha claims.
4. Freeze any future 'eight-bank' provider membership and broker-code vintage before use; policy motive stays UNKNOWN without independent official evidence.
5. Continue IC-043/PF-040/D06-18 prospective capture lanes on the next valid trading day.
6. H06/H12/H14 remain counterpart-pending until the total-control intake ledger receives all required room packets.
7. Institutional component outcomes remain closed until independent D5+ and readiness gates pass.
8. Formal Core remains LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

---

## IC-048 — D06-03 dealer proprietary / hedge split reaches L3 source-feasibility maturity

Research cycle: 2026-10-04 Asia/Taipei
Status: TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Research receipt:
`research/d06_03_dealer_prop_hedge_pit_contract_v0_1.json`.

### Why L3 is now justified
Both Taiwan markets expose dealer proprietary trading and dealer hedging as distinct official stock-level source fields.

TWSE:
- official T86 stock-level reports explicitly provide self-trading and hedge buy/sell/net fields;
- official date-query pages replay historical dates;
- the exchange data product documents daily production at 18:00 excluding block trades and 20:00 including block trades, with history from 2004-09-09.

TPEx:
- official stock-level institutional detail exposes dealer proprietary and dealer hedge buy/sell/net separately;
- the official historical query family supports long-running date/year/month replay;
- System 2 retrospective source verification requested 2026-09-24 and received the target-date TPEx institution dataset with 775 covered rows, establishing date-specific replay/coverage feasibility.

Therefore the research question 'can Taiwan proprietary and hedge dealer flows be sourced, semantically separated and replayed by date?' is no longer merely conceptual.

### Critical boundary: research source maturity is not Formal adoption
Current System 1 Formal persistence still stores only aggregate `dealerNet`; the split source fields are compressed before `institutionalScore` is evaluated.

Consequently:
- D06-03 can advance from L2 to L3 as a knowledge/data-feasibility module;
- historical Formal rows cannot be retroactively decomposed if the split was never persisted;
- preserving the split in shared runtime remains a Class-B proposal-first engineering question;
- assigning new Formal weights/signs to the split remains Class C and requires owner approval.

### Falsification remains open
L3 does NOT mean proprietary flow is bullish or hedge flow is noise. It means the Taiwan PIT source/semantic/replay layer is ready for prospective research.

Next maturity gate is L4: independent prospective split-flow receipts plus Shadow/OOS evidence versus aggregate dealerNet, price-volume, derivatives/passive context and market regime.

Promotion:
`D06-03 L2/40% -> L3/60%`.

---

## IC-049 — D06-10 TDCC distribution reaches L3 while ownership inference remains L2

Research receipt:
`research/d06_10_tdcc_distribution_pit_source_contract_v0_1.json`.

TDCC source feasibility now clears the L3 gate for D06-10 itself.

Official source semantics are frozen:
- issuer/security × weekly data date × holding bracket;
- fields include data date, security code, bracket, holder count, shares and percentage of deposited inventory;
- the official OpenAPI exposes the shareholding-distribution dataset;
- data are slow ownership stock, not daily institutional flow and not investor identity.

Production parsing is also materially validated:
- grades 1-15, grade-16 adjustment and grade-17 total are reconciled by share counts;
- 400-lot-plus and 1,000-lot-plus ratios are deterministically derived;
- `chipAsOfDate` and `chipDefinition` are preserved upstream;
- ordinary-stock coverage must exceed the frozen completeness floor.

Observed production/readback evidence already includes:
- 2026-09-17: 2,955 securities with TDCC as-of 2026-09-11;
- 2026-09-18 quality acceptance: 2,956 securities;
- 2026-10-02 quality readback: 2,957 securities with TDCC as-of 2026-09-24.

This proves that Taiwan source semantics, parser reconciliation, weekly date provenance and replay of captured vintages are operationally feasible.

Promotion:
`D06-10 L2/40% -> L3/60%`.

### Why D06-05 does NOT inherit this promotion
D06-05 is an economic ownership-concentration interpretation module, not merely the TDCC source module.

It still lacks:
- immutable same-generation `chipAsOfDate/chipDefinition/hash` inside the prospective research row itself;
- holder identity capable of separating active institution, passive fund, strategic holder and other large-holder ownership;
- vintage-deduplicated prospective outcome evidence.

Therefore:
`D06-05 = L2/40%` remains frozen.

Source maturity cannot be copied into inference maturity.

---

## IC-050 — maturity impact and exact continuation
With D06-03 and D06-10 each moving from 40% to 60%, while all other D06 modules remain unchanged, the 17-module D06 maturity becomes 47.1%.

Exact next:
1. Do not search additional score weights or thresholds.
2. D06-03: preserve prospective dealer proprietary/hedge split receipts with schema fingerprint and firstKnownAt, then wait for independent Shadow/OOS evidence before L4.
3. D06-10: preserve immutable TDCC vintage/hash receipts; repeated scan dates sharing one `chipAsOfDate` are not independent ownership observations.
4. D06-05 remains L2 until same-generation lineage and ownership inference are prospectively validated.
5. Next valid trading date still owns IC-043, PF-040, D06-18 prospective borrow-economics and D06-14 T/T+1/T+2 vintage capture.
6. H06/H12/H14 remain counterpart-pending under total-control intake.
7. Formal Core remains LOCKED and `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

---

## IC-051 — D06-06 Crowding reaches L3 through a minimum PIT-feasible core vector, not by waiting for every optional axis

Research cycle: 2026-10-04 Asia/Taipei
Status: CORE_CROWDING_PIT_DATA_FEASIBILITY_VALIDATED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Research receipt:
`research/d06_06_core_crowding_pit_contract_v0_1.json`.

### Why the previous L2 blocker no longer applies to the whole module
Earlier D06-06 work correctly refused promotion while the concept was implicitly tied to leverage, shorting, ownership, passive flow and institutional flow all at once. That would require every source family to mature simultaneously.

The module is now split into:
- CORE_CROWDING: institutional actor flow/persistence + liquidity normalization + identity-agnostic large-holder ownership + price-flow reaction;
- EXTENDED_CROWDING: optional margin-long, margin-short, securities borrowing, actual SBL shorting, day trading, passive/index context and borrow-economics axes.

Missing extension axes remain UNKNOWN and do not become zero.

### Operational Taiwan evidence
The core vector is not merely theoretical.

`research/institutional_score_decomposition_observer_readback_20260929_v0_2.json` proves bounded row-level co-presence on 62 real prospective Shadow rows:
- institutional-flow/streak parents reconstruct 62/62;
- `avgVolume20Lots` liquidity denominator is preserved;
- large-holder concentration is present on every decomposition-ready row;
- actor divergence is observed on 36/62 rows;
- no outcome interpretation was used.

`research/d02_20261002_after_market_h20_receipt_v0_1.json` separately proves production data-QA co-availability on 2026-10-02:
- institution ready = 1,865 stocks;
- TDCC ready = 2,957 securities;
- TDCC as-of date = 2026-09-24.

The 2026-10-02 Formal generation was not confirmed and is ineligible as an outcome cohort. It is used only as source/coverage feasibility evidence.

Current Worker runtime also joins institutional persistence/net-flow/liquidity and `chipConcentration` in one stock feature object. This is operational join evidence only; the current Formal `institutionalScore` is NOT adopted as the crowding definition.

### Core vector semantics
The canonical core is a non-scalar state vector:
- actor direction and persistence;
- actor divergence/alignment;
- aggregate flow normalized by contemporaneous liquidity;
- weekly TDCC large-holder concentration with `chipAsOfDate`;
- same-date price/volume response.

Allowed descriptive states include `FLOW_CONCENTRATION`, `FLOW_OWNERSHIP_CONCENTRATION`, `BUY_ABSORBED`, `SELL_RESILIENT`, and `ACTOR_DIVERGENCE`.

None maps directly to BUY/SELL.

### Strong falsification boundary
Taiwan evidence rejects a universal sign.
- Hsieh (2013) finds institutional and individual herding differ in stock characteristics, market-pressure response and subsequent returns.
- Lee/Lin/Xia (2025) finds institutional-herding effects vary across downturns/booms and by intensity.

Therefore even if the data vector is PIT-feasible, economic sign remains state-dependent and outcome-closed.

### Why D06-07/08/09/11/14/18 do not inherit this promotion
They remain separate source modules. Their unresolved TPEx clocks, paid-access gates, revision vintages, utilization denominators or passive-flow coverage are not bypassed.

Promotion:
`D06-06 L2/40% -> L3/60%`.

---

## IC-052 — exact next after core-crowding promotion
1. Build immutable prospective CORE_CROWDING receipts with source hash and firstKnownAt for institutional, TDCC and price/volume parents.
2. Same `chipAsOfDate` reused across multiple scanDates is one ownership vintage, not repeated independent evidence.
3. Extension axes are attached only when their own PIT contracts are ready; missing means UNKNOWN.
4. Do not build or tune a scalar crowding score.
5. L4 requires independent dates, D5+ outcomes, date clustering, regime/sector/liquidity controls, passive-event stratification, and incremental tests against simpler institutional/price-volume baselines.
6. D06-07/08/09 remain L2 until authorized/replayable TPEx evidence is actually captured; source existence or paid product availability is insufficient.
7. Formal Core remains LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.


---

## COV-03 canonical owner approval — 2026-10-04

00｜研究總控室完成 Intake / Dependency / overlap / anti-double-count / anti-orphan 後，韓哥已明確批准新增 D06-19 `Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）`，正式起點 L0 / 0%。

固定防火牆：
- 只有來源直接辨識自然人時才建立 direct-retail receipt；
- 融資、當沖、零股、券商分點、total-minus-institutions 殘差都不能改名成直接散戶流；
- 本國自然人個股×日期方向流未有權威 PIT 來源前維持 UNKNOWN；
- D20 行為解釋只可引用同一底層 receipt，不得再算一張獨立票；
- 初期角色只允許 context / validation / supportive；不得直接進 Formal。

D06-19 exact next：先做直接自然人來源 taxonomy＋PIT/replay 契約與 market/channel source receipts；方向性與選股增量研究要等 stock×date direct source 成立後才開。

Formal Core unchanged / FORMAL_OPTIMIZATION_CANDIDATE = NONE.

---

## IC-053 — D06-19 direct-retail module advances from L0 to L2 after independent post-creation research

Research cycle: 2026-10-04 Asia/Taipei
Status: MECHANISM_AND_FALSIFICATION_DEFINED / STOCK_DATE_DIRECTIONAL_SOURCE_GAP / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Canonical artifact:
`research/d06_19_retail_individual_participation_flow_v0_1.md`.

COV-03 has already completed total-control Intake, owner approval and canonical creation as D06-19 at L0/0%. This round does not inherit pre-creation maturity; it performs a separate post-creation research pass against the canonical module.

### Direct Taiwan observability is real but multi-granular
Official TWSE evidence directly identifies domestic individual investors at several levels:
- annual market trading-value share by shareholder structure;
- domestic-individual ownership distribution by holding size;
- investor-type composition inside the intraday odd-lot channel;
- investor self-query of personal account/order/trade records.

These establish that natural-person identity is a real observable category, not merely a residual inferred from institutional flow.

### The core source gap remains stock-date direction
No verified authorized research contract currently supplies domestic-natural-person × stock × date buy/sell/net-flow with replayable first-known/revision semantics.

Therefore:
`DOMESTIC_NATURAL_PERSON_STOCK_DATE_DIRECTIONAL_FLOW = UNKNOWN / SOURCE_GAP`.

### Positive mechanism families
- retail attention/speculative participation;
- contrarian/mean-reversion demand;
- disposition effect;
- overconfidence/turnover response;
- channel-specific microstructure effects.

Taiwan literature supports treating these as distinct, state-dependent hypotheses rather than one universal retail sign. Historical studies using identified investor datasets find individual/institutional herding differs; Taiwan individual investors show disposition-effect and overconfidence-related trading patterns. These results are hypothesis priors only and are not imported as 2026 effect sizes.

### Falsification guard
The following equivalences are rejected:
- margin financing = retail flow;
- day trading = retail flow;
- odd-lot = all retail;
- broker branch = retail/main-force identity;
- total market minus institutions = direct retail net flow;
- high retail participation = universally bullish or bearish.

### Owner boundary
D06-19 owns direct investor-class evidence and market/channel/ownership/directional semantics only. D06-07/10/13/14 retain leverage, TDCC, branch and day-trade primitives. D20 may consume the same receipt only through an independently identified behavioral transform; no duplicate directional vote.

Promotion:
`D06-19 L0/0% -> L2/40%`.

Why not L3:
stock-date domestic natural-person directional flow remains source-gated; market/channel aggregates cannot substitute it; no prospective immutable replay receipt exists.

---

## IC-054 — weekend promotion audit after D06-19

D06-13 broker/branch remains L2: full-universe TWSE report has a documented 16:10 production contract and history from 2012-10-25, but access is paid/not authorized; public current-day query is not historical bulk replay, while selected active-stock products have selection bias.

D06-15 state-owned-bank/specific-fund flow remains L2: legal public-financial-institution identity, broker execution, beneficial owner and policy/stabilization mandate remain distinct layers; no canonical replayable source resolves them.

D06-11 passive flow remains L2: bounded MSCI membership methodology and ETF units/PCF contracts are advanced, but source authorization/history and the next independent prospective units+PCF receipt remain incomplete.

No maturity promotion is granted to D06-05, D06-07/08/09, D06-11, D06-13/14/15/16/18 in this weekend pass.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core remains LOCKED.

---

## IC-055 — next-trading-day D06 capture plan is pre-registered outcome-blind

Research artifact:
`research/d06_next_trading_day_outcome_blind_capture_plan_v0_1.json`.

The weekend research phase now closes the design loop for the next valid trading day without reading any future outcomes.

Frozen lanes:
- D06-03 dealer proprietary/hedge split;
- D06-05 same-generation TDCC ownership lineage;
- D06-06 CORE_CROWDING immutable child receipt;
- D06-07/08/09 TPEx leverage/shorting EARLY/LATE vintage capture;
- D06-14 TPEx T_PRELIM -> T1_REVISED -> T2_FINAL day-trade vintage chain;
- D06-16 / PF-040 independent-date units-delta + PCF receipt;
- D06-18 securities-lending rate/displayed-supply receipt;
- D06-19 direct-retail source discovery with proxy-substitution forbidden.

All lanes preserve source date/version, capturedAt, firstKnownAt, content hash, coverage, revision/finality and UNKNOWN reasons. Derived states are decision-time eligible only after the latest required-parent firstKnownAt.

Outcomes remain CLOSED. No D1/D3/D5/D10/D20, MFE, MAE, return, hit-rate or selection result may be joined during readiness capture.

No additional maturity promotion is granted from this pre-registration. It only prevents outcome-guided definition drift and makes the next trading-day work executable immediately.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core remains LOCKED.

---

## IC-056 — D06-19 source gap refined: public-product gap, not data-existence gap

Research cycle: 2026-10-04 Asia/Taipei
Status: RESTRICTED_RESEARCH_SOURCE_EXISTS / PUBLIC_REUSABLE_PIT_CONTRACT_UNVERIFIED / L2_REMAINS / FORMAL_CORE_LOCKED

Machine audit:
`research/d06_19_retail_source_access_audit_v0_1.json`.

### New source classification
Earlier wording `STOCK_DATE_DIRECTIONAL_SOURCE_GAP` was too coarse because it could be read as if TWSE does not possess investor-type stock/order data.

External evidence now proves otherwise.
A 2026 Journal of Banking & Finance study states that the authors acquired a unique limit-order-book dataset directly from TWSE covering 2013-05-02 through 2018-03-31. Each order contains stock identifier, buy/sell direction, price/volume and investor type, including individual investor, foreign investor, others and securities investment trust.

Therefore the safe state is:
`DIRECT_DOMESTIC_INDIVIDUAL_STOCK_ORDER_DATA_EXISTS_AT_TWSE`
but
`CURRENT_AUTHORIZED_REUSABLE_PIT_RESEARCH_CONTRACT = UNVERIFIED`.

### Public Data E-Shop is not automatically the same dataset
TWSE Data E-Shop currently advertises historical order-book products such as `Order book log`, `Securities intra-day data with order type`, and `Securities intra-day data with 5-level order book`. Their public product descriptions specify history, price and internal-use restrictions, but do not advertise investor-type identity as a field.

Accordingly, the academically used investor-type limit-order dataset must not be assumed to be identical to the standard public Data E-Shop historical products.

### Four access classes are now separated
1. PUBLIC_AGGREGATE: market/channel/ownership natural-person statistics;
2. PERSONAL_ACCOUNT_SCOPED: investors may retrieve their own account/order/trade records;
3. PUBLIC_STANDARD_DATA_PRODUCT: historical market/order-book products whose advertised fields do not establish domestic-natural-person identity;
4. RESTRICTED_RESEARCH: direct TWSE investor-type stock/order data demonstrably used by academic researchers, with current access/application/licence contract not yet verified.

### L3 decision
D06-19 remains L2/40%.

Why:
- historical academic access proves data existence, not current project authorization;
- current eligibility/application path, cost/licence, permitted persistence, coverage, delivery clock and replay rights are not frozen;
- TPEx parity is not verified;
- no current immutable prospective receipt exists.

Do not autonomously purchase or request restricted data.

---

## IC-057 — cross-room governance state refresh after H06/H14 closure

Total-control intake now records:
- H06 D06-06 Crowding vs D20-06 Herding = `CLOSED_NO_STRUCTURAL_CHANGE`; keep separate. D06-06 owns observable crowding; D20-06 must own independently identified behavioral/herding content.
- H14 D06-11 Passive Flow vs D11-14 Index Adjustment = `CLOSED_NO_STRUCTURAL_CHANGE`; keep producer/consumer boundary and a single event receipt.
- H12 short-side execution cluster remains `PARTIAL_EVIDENCE_RECEIVED`: Room05 + Room13 semantic work exists, but Room10 execution counterpart and Room13 first live TWSE source receipt remain required.

Research consequence:
- remove obsolete H06/H14 counterpart-pending language from Room05 continuation state;
- no maturity increase follows from closure alone;
- H12 remains a live dependency but does not block D06's other research lanes.

Exact continuation:
1. D06-19: identify current TWSE restricted-research application/licensing route for investor-type stock/order data; no autonomous purchase/request.
2. D06-05: wait for prospective same-generation immutable TDCC lineage; no historical reconstruction.
3. H12: await Room10 counterpart + first live TWSE source receipt.
4. Execute the pre-registered next-trading-day capture plan when a valid session arrives.
5. Formal Core remains LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

---

## IC-058 — D06-19 access gate refined to special-access contract, not data-existence uncertainty

Research cycle: 2026-10-04 Asia/Taipei
Status: DIRECT_DATA_EXISTENCE_VERIFIED / CURRENT_SPECIAL_ACCESS_CONTRACT_UNVERIFIED / L2_REMAINS / FORMAL_CORE_LOCKED

Machine audit:
`research/d06_19_retail_source_access_audit_v0_2.json`.

### Standard TWSE historical order product is not the investor-type research dataset
TWSE Data E-Shop currently documents a standard historical Order book log / 委託檔 with:
- history from 2006-01-01;
- the most recent one year excluded;
- internal-use-only licensing;
- custom production lead time of at least seven working days;
- observed price NT$10,000 per month.

However the public product contract does not advertise investor-type identity as a standard field.

By contrast, the 2026 Journal of Banking & Finance study `Behavioural theories of investor behaviour: Empirical evidence from the limit order book` states that the authors acquired a unique dataset directly from TWSE for 2013-05-02 through 2018-03-31. Each order contains stock ID, buy/sell direction, price/volume and investor type including individual investor, foreign investor, others and securities investment trust.

Therefore:
`DIRECT_INVESTOR_TYPE_STOCK_ORDER_DATA_EXISTS_AT_TWSE = VERIFIED`
but
`STANDARD_PUBLIC_ORDER_PRODUCT_EQUALS_INVESTOR_TYPE_DATA = REJECTED`.

### Current public access route remains unverified
Public TWSE pages provide Data E-Shop product enquiry contacts, but this audit did not identify a current public self-service product or public research-application form specifically licensing the investor-type order dataset used in academic research.

Safe state:
`SPECIAL_RESEARCH_ACCESS = HISTORICALLY_DEMONSTRATED / CURRENT_ELIGIBILITY_PRICE_PERSISTENCE_DELIVERY_CONTRACT_UNVERIFIED`.

No autonomous enquiry, request or purchase is authorized by this research cycle.

### TPEx parity remains open
TPEx publicly supports investors retrieving their own OTC/Emerging-stock order and transaction records. This proves account-scoped order/trade data exist, but does not establish a market-wide investor-type research feed.

Thus:
`TPEX_MARKETWIDE_INVESTOR_TYPE_PARITY = UNVERIFIED`.

D06-19 remains L2/40%.

---

## IC-059 — retail participation sublane is replayable at aggregate level but cannot promote stock-flow maturity

TWSE historical statistical publications provide monthly/annual trading-value shares for Domestic Juridical, Foreign Juridical, Domestic Individual and Foreign Individual investors. This supports retrospective aggregate participation-regime research.

Separate sublane states are therefore frozen:
- `RETAIL_MARKET_PARTICIPATION_HISTORY = AGGREGATE_REPLAY_FEASIBLE`;
- `RETAIL_CHANNEL_PARTICIPATION = DIRECTLY_OBSERVABLE_FOR_SELECTED_CHANNELS` such as odd-lot and credit studies;
- `DIRECT_DOMESTIC_RETAIL_STOCK_DATE_FLOW = RESTRICTED_SOURCE_ACCESS_GATED / CURRENT_PIT_CONTRACT_UNVERIFIED`.

Anti-leak rule:
aggregate monthly/annual participation must never be backfilled into stock-day direct-retail flow. A stock-day feature stays UNKNOWN even when the market-wide retail share for that month/year is known.

Exact continuation:
1. D06-19 no longer needs further public-web searching for proof of data existence; that question is closed.
2. A future special-data pursuit requires owner authorization before contacting/requesting/purchasing anything.
3. Until then, research may use aggregate retail participation only as market-level context/control, never as stock-level retail direction.
4. D06-05, D06-13/14/15, D06-11/16/18 and next-trading-day PIT capture lanes continue independently.
5. H12 remains blocked by Room10 execution counterpart plus first genuine live TWSE rate/supply receipt.
6. Formal Core remains LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

---

## IC-060 — D06-19 aggregate retail-participation replay contract frozen without stock-flow promotion

Research cycle: 2026-10-04 Asia/Taipei
Status: AGGREGATE_RETAIL_PARTICIPATION_REPLAY_CONTRACT_FROZEN / PROXY_VALIDATION_READY / STOCK_DATE_DIRECTIONAL_FLOW_UNKNOWN / L2_REMAINS / FORMAL_CORE_LOCKED

Machine contract:
research/d06_19_retail_market_participation_pit_contract_v0_1.json

TWSE historical statistical publications directly report market-level trading-value amount/share for Domestic Juridical, Foreign Juridical, Domestic Individual and Foreign Individual investors by month/year. This makes aggregate domestic-individual market-participation history replayable as a directly identified investor-class object.

Supporting channel evidence is also direct but narrower:
- TWSE 2026 market-structure analysis reports domestic individuals above 98% of margin trading at end-July 2026;
- TWSE odd-lot studies directly report domestic-individual participation inside that channel.

These channels are useful falsification controls but retain their original meanings.

### New proxy-validation use
The aggregate retail-participation receipt can be used as an outcome-blind benchmark to test whether common proxies actually track direct natural-person participation:
- margin-trading market share/composition;
- odd-lot natural-person participation;
- day-trading aggregate participation where investor-class semantics are available;
- broker/branch data only as execution context, never identity.

First-stage diagnostics are restricted to coverage overlap, common-frequency correlation, directional disagreement, regime divergence and missingness. Return outcomes remain closed.

### Critical maturity firewall
RETAIL_MARKET_PARTICIPATION_HISTORY = AGGREGATE_REPLAY_FEASIBLE
does NOT imply
DIRECT_DOMESTIC_RETAIL_STOCK_DATE_FLOW = PIT_READY.

The whole D06-19 module therefore remains L2/40%. The missing core capability is an authorized/reusable stock-date investor-type source contract, not aggregate participation history.

---

## IC-061 — Sunday promotion-ceiling audit

After latest-main review, no additional D06 L2 module can be honestly promoted to L3 during the non-trading-day window.

Blocked modules:
- D06-05 Ownership: immutable same-generation TDCC lineage in the prospective research row is still missing; no historical reconstruction is allowed.
- D06-07/08/09 leverage/shorting: TPEx official machine products exist but authorized/replayable historical access remains gated; source existence is not PIT readiness.
- D06-11/16 ETF/passive mechanics: independent same-generation units-delta + PCF prospective receipts remain insufficient.
- D06-13 broker/branch: free official BSR is current-day only; complete historical all-stock product is paid/not authorized, while selected products are biased universes.
- D06-14 day trading: TPEx T_PRELIM -> T1_REVISED -> T2_FINAL prospective vintage receipt is still required.
- D06-15 public/state-related flow: legal entity, broker execution, beneficial owner and policy/stabilization motive remain non-equivalent and source mapping is unresolved.
- D06-18 lending economics: first genuine live TWSE rate/supply receipt plus verified utilization denominator remain missing.
- D06-19 direct retail: restricted source exists historically, but current access/PIT/replay contract and TPEx parity remain unverified.

Therefore further weekend percentage increases would require relaxing the frozen maturity definition and are rejected.

Exact next:
1. Next valid trading session: execute the already frozen prospective capture set rather than inventing retrospective receipts.
2. D06-19: aggregate proxy-validation may proceed outcome-blind; special investor-type source pursuit requires owner authorization before contact/request/purchase.
3. H12 remains partial until Room10 D14-19 counterpart and first genuine live TWSE rate/supply receipt arrive.
4. Formal Core remains LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

---

## IC-062 — D06-19 first outcome-blind proxy validation: retail identity purity must be separated from retail-universe coverage

Research cycle: 2026-10-04 Asia/Taipei
Status: OUTCOME_BLIND_PROXY_VALIDATION_STAGE1_COMPLETE / L2_REMAINS / FORMAL_CORE_LOCKED

Machine receipt:
`research/d06_19_retail_proxy_validation_stage1_20261004_v0_1.json`.

### Direct baseline
TWSE annual trading-value statistics directly identify domestic individual participation. For 2020-2025 the domestic-individual share is:
`62.07%, 67.99%, 58.30%, 57.91%, 54.07%, 52.11%`.

### Margin / credit proxy comparison
At the same annual TWSE market frequency:
- margin-purchase market share = `7.16%, 7.17%, 5.50%, 6.22%, 5.97%, 5.33%`;
- total credit-trading share = `8.16%, 7.92%, 6.53%, 6.89%, 6.45%, 5.78%`.

Descriptive correlations, with outcomes closed:
- retail share vs margin-purchase share: Pearson r = 0.8499;
- retail share vs total credit-trading share: Pearson r = 0.8904;
- first-difference correlations fall to 0.7287 and 0.7047 respectively.

Direction-change disagreement also exists:
- margin-purchase proxy disagrees with direct retail-share change in 1/5 annual transitions = 20%;
- total credit-trading proxy disagrees in 2/5 annual transitions = 40%.

These six annual observations are far too small for predictive inference. The purpose is falsification of proxy identity, not alpha estimation.

### Purity-versus-coverage decomposition
Official 2026 market-structure evidence reports natural persons above 98% of credit trading, while credit trading itself is only about 6% of total market trading value. This is high identity purity but narrow market coverage.

Official odd-lot evidence reports domestic individuals at 82.5% of intraday odd-lot trading value, while total odd-lot trading is only about 0.91% of centralized-market trading value over the study period. This is again high identity purity but very narrow total-market coverage.

Therefore a retail proxy must be evaluated on at least two independent dimensions:
1. identity purity: how much of the proxy channel is directly attributable to natural persons;
2. retail-universe coverage: how much of total natural-person activity the proxy channel can plausibly represent.

`HIGH_PURITY != HIGH_COVERAGE`.

### Research decision
Margin/credit trading is useful as a market-level retail-participation proxy/control, not direct retail flow.
Odd-lot participation is a high-purity channel control, not a complete retail proxy.
Broker/branch remains execution context only.
Stock-date direct-retail direction remains UNKNOWN.

D06-19 remains L2/40%. No maturity promotion, outcome join or Formal change.

---

## IC-063 — Sunday continuation ceiling after proxy validation

New information gained:
- D06-19 no longer treats proxies as a single quality dimension; identity purity and universe coverage are frozen separately.
- Aggregate proxy validation now has a first bounded empirical receipt rather than only a conceptual plan.
- Shared-trend inflation is explicitly recognized: level correlations exceed first-difference correlations.
- Two annual transition disagreements materially falsify deterministic proxy equivalence.

Still blocked:
- current authorized TWSE stock/order investor-type contract;
- TPEx marketwide investor-type parity;
- stock-date firstKnownAt/revision semantics;
- prospective immutable direct-retail stock-flow receipts.

Therefore Sunday L3 promotion remains rejected. Exact next remains the next genuine trading-day prospective capture set plus owner-authorized special-data pursuit only if explicitly approved.

Formal Core remains LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

---

## IC-065 — SDA-007 one-primitive lineage semantic remediation

Research cycle: 2026-10-05 Asia/Taipei
Status: SDA007_LEARNING_SEMANTIC_REMEDIATION_COMPLETE / ENGINEERING_AND_D16_PENDING / FORMAL_CORE_LOCKED

Machine contract:
`research/d06_sda007_flow_ownership_lineage_contract_20261005_v0_1.json`.

The D06 learning-room side of SDA-007 is now consolidated across institutional flow, TDCC ownership, passive/index context, ETF primary-market flow, margin/leverage, SBL activity, lending economics, day trading, broker/branch execution and direct-retail investor-class observations.

The core rule is one primitive observation -> one primitiveReceiptId -> many allowed consumers, with explicit parentReceiptIds and informationRoot. A new module name, transformation or interpretation does not manufacture a second independent vote.

### Motive firewall
Observed flow and ownership stay observational unless an independent source identifies motive. The contract preserves ACTIVE_CONVICTION_UNIDENTIFIED, HEDGE_ARBITRAGE_POSSIBLE, POLICY_MOTIVE_UNKNOWN, RETAIL_BEHAVIOR_MOTIVE_UNKNOWN and BENEFICIAL_OWNER_UNKNOWN.

Forbidden shortcuts include SMART_MONEY_CONVICTION, PASSIVE_FLOW_PROVEN_FROM_EVENT_ONLY, GOVERNMENT_SUPPORT_INTENT, RETAIL_PANIC_OR_FOMO and SHORT_SPECULATIVE_INTENT without independent identifying evidence.

### Canonical double-count examples
- D06-01/02/03/04 institutional flow is the primitive; D06-06 crowding and D06-12 normalization consume it and are not extra independent votes by transformation alone.
- D06-10 TDCC ownership is one weekly primitive; D06-05 ownership interpretation and D06-06 ownership-crowding consume the same vintage.
- D11-14 index event, D06-11 realized passive flow and D06-16 ETF mechanics remain event -> measured-flow -> transmission layers. Event-imputed flow is not independent realized flow.
- D06-09 SBL activity and D06-18 lending economics remain linked; generic borrowing, short-sale activity, borrow fee and ETF fulfillment are not interchangeable or automatically independent.
- D06-07/14/13 proxies cannot be relabeled as D06-19 direct retail identity.

### Residual-incrementality gate
A derived child becomes a distinct candidate only after D16 proves residual/common-support incrementality beyond its parent receipts, with PIT, OOS/Shadow, dependence/date clustering, cost and multiple-testing controls. Correlation below one, a different formula or a different module owner is not independence evidence.

No outcomes were opened. No score, weight, threshold or rank was changed.

---

## IC-066 — SDA-007 handoff boundary and exact continuation

Room05 completion status:
- observed-flow vs motive split = COMPLETE;
- effective/revision clock semantics = COMPLETE at research-contract level;
- passive-flow identity boundary = COMPLETE at research-contract level;
- one-receipt-many-consumers semantic guard = COMPLETE;
- residual-test design = PREREGISTERED SEMANTICALLY;
- System1/System2 machine lineage = PENDING;
- D16 incrementality validation = PENDING;
- 00 audit closure = REQUIRED.

Therefore SDA-007 itself remains open. Learning-room documentation does not close an audit ticket.

Exact next:
1. next valid trading-date D06 capture must attach primitiveReceiptId/parentReceiptIds to the frozen parent receipts;
2. System1/System2 engineering must enforce shared lineage and raw-vote versus de-duplicated evidence diagnostics;
3. D16 must run common-support/passive-active residual incrementality only after prospective PIT coverage is sufficient;
4. 00 alone advances or closes SDA-007 after readback;
5. D06 maturity remains unchanged; Formal Core remains LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

---

## IC-067 — 2026-10-05 new TDCC weekly parent captured before market; same-generation ownership join remains the promotion gate

Research cycle: 2026-10-05 Asia/Taipei
Status: NEW_TDCC_WEEKLY_PARENT_CAPTURED / SOURCE_INTEGRITY_PASS / SAME_GENERATION_JOIN_PENDING / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Durable parent receipt: research/d06_tdcc_parent_receipt_20261005_v0_1.json.

The official TDCC shareholding-distribution source was captured pre-market on 2026-10-05 and reports source date 2026-10-02, newer than the previously durable D06 ownership vintage 2026-09-24.

Outcome-blind source integrity:
- 69,326 bracket rows;
- 4,078 unique securities;
- every security has grades 1 through 17;
- exact identity sum(grades 1..15 shares) - grade16 adjustment = grade17 total shares passes 4,078/4,078;
- deterministic source fingerprint fnv1a64-utf8:ad1a265c0a3dcaf8.

Research implication:
- D06-10 receives a genuine new prospective weekly parent vintage and its existing L3 source/replay status is strengthened;
- D06-05 does NOT promote from L2 merely because the source parent exists;
- D06-05 L3 requires the exact primitiveReceiptId, source fingerprint, chipAsOfDate and chipDefinition to be immutably attached to the same 2026-10-05 research generation that consumes chip concentration;
- later scan dates that reuse 2026-10-02 TDCC data remain one ownership-vintage inference unit.

Motive/identity remains unresolved:
TDCC large-holder brackets do not identify active institution, passive fund, strategic holder, natural-person whale or other beneficial-owner motive. Holder identity and passive share remain UNKNOWN.

The pre-open capture session was updated at research/d06_20261005_prospective_capture_session_v0_1.json.

Maturity impact: NONE at this pre-market stage.
Formal Core remains LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

Exact next:
After the 2026-10-05 after-market research generation exists, bind D06-20261005-TDCC-WEEKLY to same-generation D06-05/D06-06 research rows. Only after that immutable join passes may D06-05 L3 source/PIT feasibility be reconsidered. Continue the other frozen 2026-10-05 capture lanes at their actual source clocks; outcomes stay closed.


## IC-068 — SDA-007 passive-active residual identifiability firewall

Research cycle: 2026-10-05 Asia/Taipei
Status: RESIDUAL_IDENTIFIABILITY_FIREWALL_COMPLETE / D16_AND_ENGINEERING_PENDING / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Durable contract: `research/d06_sda007_passive_active_residual_identifiability_20261005_v0_1.json`.

Fresh external and Taiwan-source review strengthens an important falsifier: investor-class flow and trading motive are not the same object. TWSE institutional reports classify foreign, investment-trust and dealer desks, while ETF primary-market rules allow in-kind/cash creation, aggregate/minimum creation and cash substitution. Units-delta plus PCF therefore measures modeled basket exposure, not proven same-day constituent execution.

Recent passive-flow literature also shows why a subtraction shortcut is unsafe. ETF flow effects can reflect non-fundamental price pressure; ETF sampling changes which constituents actually absorb arbitrage demand; passive demand can be accommodated by firms and can move together with other institutional trading. Consequently:

- observed institutional flow minus modeled passive exposure MUST NOT be labeled active conviction;
- the only allowed residual label is `INSTITUTIONAL_FLOW_RESIDUAL_AFTER_PASSIVE_CONTROLS`;
- `INDEX_EVENT_EXPECTATION`, `ETF_MODELED_BASKET_EXPOSURE` and `ACTUAL_PASSIVE_STOCK_EXECUTION` remain three distinct identification layers;
- D06-06 crowding remains a child of exact parent receipts and gets no independent vote merely by transformation;
- D16 must test common-support residual incrementality and dependence-aware inference before any distinct evidence claim;
- motive remains UNKNOWN unless a separate source/design identifies it.

Four residual questions R1-R4 are frozen in the machine contract before outcomes: institutional-after-passive, passive-after-institutional, crowding-after-parents, and active-conviction identifiability. Statistical residualization by itself cannot pass the fourth gate.

Maturity impact: NONE. This is anti-self-deception governance plus preregistration, not prospective return evidence. Formal Core unchanged.

Exact next: continue today's frozen source captures; route the contract to D16 plus System 1/System 2 lineage owners. Do not open outcomes until D16 freezes horizon/benchmark/dependence/multiple-testing/stop rules and prospective common-support coverage is sufficient.


---

## IC-069 — 2026-10-05 TPEx dealer proprietary/hedge split captured prospectively before TWSE source clock

Research cycle: 2026-10-05 Asia/Taipei
Status: TPEX_SAME_DAY_PARENT_CAPTURED / SCHEMA_AND_ARITHMETIC_RECONCILIATION_PASS / TWSE_PENDING_BY_CLOCK / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Durable receipt:
`research/d06_03_tpex_dealer_split_capture_20261005_v0_1.json`.

This is a genuine same-day prospective parent capture for D06-03, not a historical replay.

At 2026-10-05T15:28:58+08:00 the official TPEx stock-level institutional endpoint returned source date 20261005 and table date 115/10/05 with 916 rows.

Frozen schema contract:
- foreignNet index 10;
- trustNet index 13;
- dealer proprietary buy/sell/net indices 14/15/16;
- dealer hedge buy/sell/net indices 17/18/19;
- dealer aggregate buy/sell/net indices 20/21/22;
- institution total net index 23.

Outcome-blind integrity:
- total rows = 916;
- numeric-valid rows = 916;
- ordinary four-digit stock rows = 795;
- duplicate codes = 0;
- proprietary/hedge/aggregate dealer reconciliation = 916/916 PASS;
- foreign + trust + aggregate dealer = institution total = 916/916 PASS;
- content hash = fnv1a64-utf8:5bd324cc7136e2ca;
- schema fingerprint = fnv1a64-utf8:6ca0bb5edbff5cd3.

Interpretation guard:
- proprietary and hedge are observed dealer-desk categories, not motive labels;
- proprietary is not automatically informed conviction;
- hedge is not automatically noise or non-directional;
- this TPEx subreceipt belongs to primitiveReceiptId `D06-20261005-INSTITUTION-DEALER-SPLIT` and does not create an extra independent vote under SDA-007;
- TWSE had not reached its frozen 18:00/20:00 publication clocks at this capture time, so its pre-clock no-data state remains PENDING_BY_CLOCK rather than MISSING/FAIL.

Research impact:
D06-03 already sits at L3, so this capture strengthens prospective PIT evidence but does not promote maturity. Current Formal persistence still compresses dealer desks into aggregate dealerNet. No return, ranking, hit-rate, MFE/MAE, selection or signal outcome was read.

Formal Core unchanged; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

Exact next:
1. preserve the existing TPEx receipt immutably;
2. at/after the TWSE 18:00 and 20:00 source clocks capture the listed-market dealer split as a sibling market subreceipt, without rewriting the TPEx firstKnownAt;
3. after the 2026-10-05 research generation exists, attach exact parentReceiptIds to D06-06 CORE_CROWDING and the TDCC weekly parent to D06-05/D06-06 same-generation rows;
4. keep D06-14 T_PRELIM pending until the actual TPEx day-trading statistics object is observed; DayTradeMark eligibility data are not a substitute;
5. keep outcomes closed.


---

## IC-070 — TPEx dealer desk split structural falsification on the first prospective date

Research cycle: 2026-10-05 Asia/Taipei
Status: OUTCOME_BLIND_STRUCTURAL_FALSIFICATION_COMPLETE / FORMAL_CORE_LOCKED

Parent receipt:
`research/d06_03_tpex_dealer_split_capture_20261005_v0_1.json`.

Population:
795 ordinary four-digit TPEx stocks from the same 2026-10-05 source version.

Observed desk structure:
- proprietary desk nonzero: 193;
- hedge desk nonzero: 450;
- both desks nonzero: 165;
- hedge-only: 285;
- proprietary-only: 28;
- both zero: 317.

Among the 165 stocks where both desks were active:
- same positive sign: 45;
- same negative sign: 38;
- opposite signs: 82 = 49.7%.

Across active stocks, absolute hedge flow dominated absolute proprietary flow in 374 cases versus 103 proprietary-dominant cases. Among nonzero aggregate dealer rows, 83 rows = 17.4% contained an opposing desk whose sign was hidden by the aggregate sign.

Interpretation:
This one-date prospective cross-section falsifies the shortcut that aggregate dealerNet can be interpreted as proprietary-desk conviction. Aggregation can materially compress desk disagreement. It does not prove either desk has incremental predictive value, and raw share magnitudes remain size/liquidity confounded.

L4 design implication:
future tests must compare aggregate dealerNet against the split desks on common support, normalize by liquidity, cluster by market date, and test residual value beyond institutional flow, price-volume, passive/derivatives context and regime. No desk sign or weight may be tuned from this single date.

Maturity impact: NONE.
Outcomes remain CLOSED.
Formal Core unchanged.


---

## IC-071 — D06-06 cross-domain price/volume parent lineage firewall

Research cycle: 2026-10-05 Asia/Taipei
Status: CROSSDOMAIN_PARENT_LINEAGE_FROZEN / DUPLICATE_PRICE_VOLUME_PRIMITIVE_FORBIDDEN / SHARED_PARENT_BINDING_PENDING / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Durable contract:
`research/d06_core_crowding_crossdomain_parent_lineage_20261005_v0_1.json`.

A new self-deception gap was closed without creating a new factor. D06-06 CORE_CROWDING requires same-date price/volume response, but price and volume are shared primitives already owned by the D02/shared price-volume lineage. Re-materializing those observations inside D06 under a new receipt name would allow the same PRICE_OHLC / VOLUME_TURNOVER information to appear once in D02 and again inside D06 crowding.

The frozen rule is therefore:
- D06 institutional-flow and TDCC ownership parents remain D06-owned primitives;
- PRICE_OHLC and VOLUME_TURNOVER are shared parents consumed by D06, not new D06 primitives;
- `D06-20261005-LIQUIDITY-PRICEVOLUME` is consumer-alias-only until it is bound to exact same-generation shared parent receipt identities;
- if the same-generation D02/canonical shared parent does not yet exist, D06-06 remains WAITING_SHARED_PARENT_RECEIPT rather than reconstructing a duplicate;
- `D06_CORE_CROWDING_PRICE_FLOW_REACTION` is a derived interaction with effectiveIndependentEvidenceCount increment = 0 until D16 proves common-support residual incrementality beyond its exact parents.

This is a D06 responsibility under SDA-007 and a dependency-aware guard against the same-root risks represented by SDA-001/SDA-003. Room05 does not claim ownership or closure of those other tickets.

At the time of this freeze, no durable 2026-10-05 same-generation D02/shared price-volume parent receipt was found in the repository. The official market close being observable is not sufficient reason to create a duplicate D06 primitive.

Maturity impact: NONE. D06 remains 47.8%. Outcomes remain CLOSED. Formal Core unchanged.

Exact next:
1. when the exact 2026-10-05 shared D02/canonical PRICE_OHLC + VOLUME_TURNOVER parent receipt becomes durable, bind its primitiveReceiptId/hash/firstKnownAt into D06-06;
2. until then keep the price/volume parent state waiting and do not fabricate a D06 duplicate;
3. continue TWSE dealer split, TPEx leverage EARLY/LATE, D06-14 T_PRELIM and PF-040 only at their actual source clocks;
4. preserve the existing TDCC weekly parent for the same-generation D06-05/D06-06 join;
5. no maturity or Formal promotion follows from lineage governance alone.


---

## IC-072 — 2026-10-05 TWSE 18:00 dealer split captured prospectively; listed-market structural disagreement confirmed

Research cycle: 2026-10-05 Asia/Taipei  
Status: TWSE_1800_PUBLIC_PARENT_CAPTURED / 1344_OF_1344_RECONCILED / STRUCTURAL_FALSIFICATION_CORROBORATED / 2000_INCLUDE_BLOCK_ACCESS_GATED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Durable receipt:
`research/d06_03_twse_dealer_split_capture_20261005_1800_v0_1.json`.

The official TWSE T86/TWT86UC non-block-trade report for 2026-10-05 was captured after its documented 18:00 source clock.

Outcome-blind full-table integrity:
- total rows = 1,344;
- numeric-valid rows = 1,344;
- ordinary four-digit stocks = 1,088;
- duplicate ordinary codes = 0;
- proprietary buy-sell-net arithmetic = 1,344/1,344 PASS;
- hedge buy-sell-net arithmetic = 1,344/1,344 PASS;
- proprietary + hedge = aggregate dealer = 1,344/1,344 PASS;
- institutional components = institutional total = 1,344/1,344 PASS;
- source fingerprint = fnv1a64-utf8:be22e70f6ec9da3a;
- schema fingerprint = fnv1a64-utf8:334c6531bfaa2963.

Among 1,088 ordinary four-digit listed stocks:
- proprietary desk nonzero = 537;
- hedge desk nonzero = 491;
- both desks active = 351;
- opposite signs among both-active = 150 = 42.7%;
- aggregate dealer nonzero = 677;
- rows where aggregate dealer flow contains opposing desks = 150 = 22.2%.

Together with the earlier TPEx prospective receipt, this corroborates across both Taiwan cash markets that aggregate dealerNet can materially compress internal desk disagreement. It does not identify motive or predictive value.

The 20:00 including-block-trade sibling product TWTAIUC is an official paid product. Its existence and clock are verified, but no access/purchase is authorized. The public non-block T86 receipt must not be relabeled as the 20:00 including-block version.

D06-03 remains L3/60%. No maturity promotion follows from another source-feasibility receipt alone; L4 still requires OOS/Shadow residual incrementality on common support. Formal Core unchanged.

---

## IC-073 — 2026-10-05 TPEx 20:30 leverage EARLY slot preserved missing; day-trade T_PRELIM remains variable-clock pending

Research cycle: 2026-10-05 Asia/Taipei  
Status: LEVERAGE_EARLY_SLOT_UNKNOWN_MISSING / DAYTRADE_T_PRELIM_VARIABLE_CLOCK_PENDING / NO_BACKFILL / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Durable receipts:
- `research/d06_07_08_09_tpex_leverage_early_20261005_v0_1.json`;
- `research/d06_14_tpex_daytrade_tprelim_attempt_20261005_v0_1.json`.

At 20:33 the official TPEx current margin and SBL pages were reachable and their schema headers were observable, but same-date stock rows were not exposed through the already-verified free machine-readable route. The stable documented historical programmatic margin contract remains unresolved.

Therefore the preregistered EARLY slot is `UNKNOWN_MISSING_AT_EARLY_SLOT`. It is not zero, no-flow or a failed market state. Later data must never be backfilled into this 20:30 receipt.

For D06-14, the official TPEx day-trading page was reachable at the same time but the T-day stock-level statistics object was not yet observed. Because TPEx T-day completion depends on broker reporting/adjustment workflow, this state is `PENDING_BY_VARIABLE_SOURCE_WORKFLOW`, not a fixed-clock failure.

Exact next:
1. repeat the same authorized TPEx leverage source families at LATE 22:30; preserve separate firstKnownAt if rows appear;
2. retry D06-14 T_PRELIM later the same evening and append only when the actual statistics object is observed;
3. never rewrite EARLY from LATE;
4. outcomes stay closed.
