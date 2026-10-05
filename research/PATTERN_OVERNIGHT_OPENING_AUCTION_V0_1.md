# D01 DL-043 — Pattern Response vs Overnight Gap / Opening Auction Mechanics V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / RETURN_PATH_DECOMPOSITION_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-042 separated Pattern generalization from event-day clustering.

DL-043 freezes the next mechanism distinction:

> A daily Pattern response may be realized entirely through the next opening gap / opening call auction rather than through continuous-session price evolution.

If a Pattern cohort earns its apparent response only from prior-close -> next-open movement, D01 must not describe that as continuous-session structural follow-through.

No historical economic outcome is opened in this tranche.

## 2. Evidence context

Taiwan market structure makes this distinction mandatory.

- TWSE uses opening call auction price formation before the continuous session.
- Taiwan-listed stocks cannot continuously trade during the normal overnight interval, so overnight information can be impounded at the next opening.
- Taiwan research documents materially different overnight and intraday return behavior and distinct beta-return relations across these regimes.
- Event/earnings research in other markets likewise finds strong differences between overnight/opening reactions and later intraday trading.

Therefore close-to-close daily returns are too coarse for Pattern mechanism attribution.

## 3. Ownership boundary

D01 owns:
- Pattern predictor / structure identity;
- future response claim scope;
- decomposition semantics needed to avoid calling opening-gap behavior continuous Pattern follow-through.

D11 owns:
- overnight gap / event risk;
- reference-price / corporate-action continuity;
- suspension / resumption event clocks;
- gap-through-stop and constrained-open context.

D05 owns:
- opening call auction;
- opening price-discovery / auction state;
- tick, liquidity and market-microstructure context.

D04 owns:
- volatility-scale context.

D16 owns future economic inference.

D01 consumes owner receipts and does not recreate the event, corporate-action or auction engines.

## 4. Return-path decomposition

For an ordinary adjacent session with valid continuity:

OVERNIGHT_RETURN =
open_t / close_{t-1} - 1.

INTRADAY_RETURN =
close_t / open_t - 1.

CLOSE_TO_CLOSE_RETURN =
close_t / close_{t-1} - 1.

Identity:
1 + CLOSE_TO_CLOSE_RETURN
=
(1 + OVERNIGHT_RETURN) * (1 + INTRADAY_RETURN).

These are different economic/trading regimes.

## 5. Reference-price firewall

previousClose and referencePrice are not interchangeable.

Store both where available.

RAW_OVERNIGHT_GAP =
openPrice / previousClose - 1.

REFERENCE_GAP =
openPrice / referencePrice - 1.

On ex-right/ex-dividend, split, capital reduction or other reference reset:
- raw previous-close gap can mix corporate-action mechanics with price movement;
- reference-gap context must be preserved;
- continuity state must come from D11 owner receipt.

If required reference-price / corporate-action provenance is missing:
CORPORATE_ACTION_GAP_DATA_BLOCKED.

Do not silently use raw gap.

## 6. Opening-auction state

Opening receipt should preserve where owner-supported:
- tradeDate;
- expectedOpenCapture;
- capturedAt;
- previousClose;
- referencePrice;
- openPrice;
- openTime;
- limitUpPrice;
- limitDownPrice;
- openingAuctionState;
- priceLimitState;
- suspensionState;
- source / provenance.

Missing open is not zero return.

## 7. Future-path timing

For an after-market Pattern predictor at date t:

- next-session open is future;
- opening-auction imbalance is future unless observed by a later intraday decision clock;
- next-session close is future;
- first 15m / 30m path is future.

None may enter the t predictor.

These are outcome-path variables for future D16 evaluation.

## 8. Total response vs path mechanism

Future D16 must distinguish:

TOTAL_NEXT_SESSION_RESPONSE
- close-to-close or decision-to-future-close response.

OVERNIGHT_COMPONENT
- prior close -> next open.

INTRADAY_COMPONENT
- next open -> next close.

EARLY_CONTINUOUS_COMPONENT
- post-open 5m / 15m / 30m path where clean owner data exist.

A Pattern result can be positive in total while intraday continuation is zero or negative.

## 9. Opening-only interpretation

Future possible state:

OPENING_GAP_ONLY
- total response is carried primarily by overnight/opening component;
- little/no same-direction open-to-close continuation.

Interpretation:
Pattern may be exposure to overnight information / auction price discovery rather than continuous-session structural persistence.

This is not automatically failure.
It is a narrower mechanism claim.

## 10. Intraday continuation / reversal

Future mechanism classes may include:

OVERNIGHT_ONLY;
OPENING_AUCTION_DOMINANT;
INTRADAY_CONTINUATION;
INTRADAY_REVERSAL;
MIXED_PATH;
LIMIT_CONSTRAINED;
CORPORATE_ACTION_CONTAMINATED;
NOT_EVALUABLE.

D01 freezes labels only.
D16 chooses quantitative criteria before outcomes.

## 11. No arbitrary gap threshold

D01 does not define:
- 2% gap;
- 1 ATR gap;
- large/small opening move;
- 50% gap fill.

Gap / path descriptors remain continuous unless D16 preregisters thresholds.

No outcome-selected threshold.

## 12. Event-day relation

DL-042 event state remains context.

A scheduled/unscheduled event may drive the overnight gap.

But:
eventCategory != gap sign;
gap sign != intraday continuation;
event presence != Pattern alpha.

Future analyses should preserve:
event state + gap component + intraday component separately.

## 13. Market/sector overnight context

D11 already proposes a simple relative-gap baseline.

Future context may consume:
- broad Taiwan opening move;
- sector/peer median opening move;
- ex-candidate market/sector opening context where owner-supported.

Residual stock gap is a future research estimand, not a D01 score.

Market/sector gap context is not an independent Pattern vote.

## 14. Opening-auction microstructure is a mediator / mechanism state

For an after-market predictor, opening-auction state occurs after selection.

Therefore opening imbalance / auction state is not a baseline confounder for total Pattern prediction.

It may be used in:
- mechanism decomposition;
- path-conditional analysis;
- execution-quality analysis.

Any such use changes the estimand.

## 15. Selection / censoring firewall

Do not evaluate only names that:
- opened normally;
- were not limit-constrained;
- had complete opening data;
- avoided suspension.

Preserve:
- NORMAL_OPEN;
- PRICE_LIMIT_CONSTRAINED;
- SUSPENDED_NO_OPEN;
- OPENING_DATA_MISSING;
- CORPORATE_ACTION_GAP_DATA_BLOCKED;
- AUCTION_STATE_UNKNOWN.

Otherwise the clean-opening subset can create selection bias.

## 16. Data-readiness boundary

Existing research audit states current historical execution snapshots are incomplete for full DL-043 inference:
- previousClose/openPrice may exist in some paths;
- referencePrice/openTime are not durably complete for the needed historical panel;
- opening recorder coverage is not exhaustive all-symbol/all-date.

Therefore current economic status is:
OPENING_PATH_EVIDENCE_READINESS = PARTIAL / DATA_QUALITY_BLOCKED.

No historical gap-path Shadow may be fabricated from current/latest feeds.

## 17. Common support

Future comparisons require overlap in:
- DL-039 size/liquidity/listing age;
- DL-040 sector context;
- DL-041 market/beta context;
- DL-042 event state;
- gap magnitude;
- volatility;
- price/tick tier;
- auction / limit state;
- opportunity geometry.

Lack of overlap:
OPENING_PATH_EXTRAPOLATION_PROHIBITED.

## 18. Future comparison ladder

G0 DAILY_CLOSE_TO_CLOSE
- descriptive daily response only.

G1 OVERNIGHT_INTRADAY_SPLIT
- separate close->open and open->close.

G2 MARKET_SECTOR_GAP_CONTROLLED
- contextualize stock overnight gap.

G3 OPENING_AUCTION_STATE_CONTROLLED
- path-conditional mechanism analysis.

G4 INTRADAY_RESIDUAL_PATTERN
- ask whether Pattern representation remains after the opening price is set.

G5 CROSS_PATH_REPLICATION
- replicate across overnight-dominant and intraday-dominant contexts / independent dates.

## 19. Future interpretation

P0 DAILY_EFFECT_IS_OVERNIGHT_ONLY;
P1 OPENING_AUCTION_MECHANISM_EXPLANATION;
P2 INTRADAY_CONTINUATION_PATTERN;
P3 INTRADAY_REVERSAL_AFTER_GAP;
P4 MARKET_SECTOR_GAP_EXPLANATION;
P5 LIMIT_OR_AUCTION_CONSTRAINT_EXPLANATION;
P6 CORPORATE_ACTION_CONTAMINATION;
P7 MIXED_PATH_PATTERN;
P8 NOT_EVALUABLE.

None proves alpha.

## 20. Required future receipt fields

Per predictor:
- parentDecisionId;
- predictorFreezeAt;
- symbol;
- structuralRootId;
- Pattern state;
- DL-042 event state;
- DL-041 market/beta receipt;
- DL-040 sector receipt.

Per future session when D16 outcome join is authorized:
- tradeDate;
- previousClose;
- referencePrice;
- openPrice;
- openTime;
- closePrice;
- rawOvernightGap;
- referenceGap;
- overnightReturn;
- intradayReturn;
- closeToCloseReturn;
- marketOpeningContext;
- sectorOpeningContext;
- openingAuctionState;
- priceLimitState;
- suspensionState;
- corporateActionContinuityState;
- dataCoverageState;
- source/provenance/hash.

No future path value belongs in the D01 predictor manifest.

## 21. Current decision

DAILY_RETURN_EQUALS_CONTINUOUS_SESSION_PATTERN =
FALSE.

OVERNIGHT_RETURN_EQUALS_INTRADAY_RETURN =
FALSE.

RAW_PREVIOUS_CLOSE_GAP_SAFE_ON_CORPORATE_ACTION_DAY =
FALSE.

NEXT_OPEN_CAN_ENTER_AFTER_MARKET_PREDICTOR =
FALSE.

OPENING_AUCTION_STATE_IS_BASELINE_CONFOUNDER =
FALSE.

MISSING_OPEN_EQUALS_ZERO_RETURN =
FALSE.

DROP_LIMIT_OR_SUSPENDED_CASES =
PROHIBITED.

ARBITRARY_GAP_THRESHOLD =
NOT_DEFINED.

OPENING_PATH_EVIDENCE_READINESS =
DATA_QUALITY_BLOCKED_PARTIAL.

ECONOMIC_VALIDATION_OWNER =
D16.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 22. Exact next continuation

1. Build deterministic opening-receipt validation, corporate-action gap guard and synthetic path-decomposition helper plus adversarial tests.
2. Preserve total, overnight, intraday and early-continuous path as separate future estimands.
3. Consume D11 reference-price/event receipts and D05 opening-auction receipts without rebuilding their engines.
4. Hand G0-G5 / P0-P8 path-decomposition inference to D16.
5. Preserve constrained / suspended / missing-open cases in denominators.
6. Next D01 science: separate overnight/opening mechanics from close-price construction / closing-auction effects so daily candle bodies are not treated as pure continuous-session evidence.
7. No outcome join / no runtime wiring / no Formal change.
