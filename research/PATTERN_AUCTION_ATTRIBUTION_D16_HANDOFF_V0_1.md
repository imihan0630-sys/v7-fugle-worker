# D01 DL-062 — D16 Auction Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes how structural state is attributed around opening/closing call auctions.
D05-06 remains the auction-mechanics owner.
D16 owns future residual inference.

## 2. Critical distinction

Separate:
- continuous-session structural state before auction;
- auction trial state actually observed before freeze;
- final auction displacement;
- final official close;
- passive/index replication context.

A final close is not a historical trial-imbalance receipt.

## 3. Historical missingness

Historical pre-close trial/imbalance:
UNKNOWN unless genuinely archived.

Never infer from:
- final close;
- final auction volume;
- late-session EOD volume;
- close-minus-last-trade alone.

## 4. Same-print leakage

If CLOSE_FINAL is needed to confirm the D01 structure, the same print cannot be both predictor and response.

Preserve:
structureFirstObservableAt;
structureConfirmedAt;
predictorFreezeAt;
finalMatchAt.

## 5. Required comparisons

A0-A11 ladder:
raw close classification;
pre-auction timing;
continuous last price;
auction phase;
observed trial state;
auction-volume concentration;
passive replication;
delayed close;
generic auction comparator;
continuous-vs-auction divergence;
structural residual candidate;
prospective multi-date replication.

## 6. Generic comparator

Compare the same auction state:
- away from a preconfirmed zone;
- at a preconfirmed zone.

If no residual zone representation remains:
AUCTION_MECHANICS_SUFFICIENT.

## 7. Passive-close interaction

Consume DL-061 / D06 / D11 receipts for index/passive activity.
Modeled exposure remains distinct from verified execution.

## 8. Opening auction

Opening gaps through/into a prior zone are auction/overnight-information states, not ordinary continuous retests.

Do not mix them into the same opportunity class.

## 9. Dependence

Structure, close displacement, auction volume, trial imbalance and passive context may share one session/order-flow parent.

Default effectiveIndependentEvidenceCount remains 1 until D16 validates residual/dependence structure.

## 10. Promotion boundary

No ranking, gating, Top6, score, weight, capital, runtime or Formal change is authorized.

Formal Core remains LOCKED.
