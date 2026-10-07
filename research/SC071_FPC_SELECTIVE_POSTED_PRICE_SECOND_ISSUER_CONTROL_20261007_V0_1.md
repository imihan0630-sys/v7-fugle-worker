# SC-071 — FPC Selective Posted-Price Second-Issuer Control V0.1

Status: RESEARCH_ONLY / SECOND_ISSUER_FULL_POSTED_MATRIX / DESCRIPTIVE_ONLY / HISTORICAL_CLOCK_PARTIAL / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-06
Date: 2026-10-07 Asia/Taipei
Observed main before write: `294e93ab5c0487cf71a4bace3b3411b60741e0c7`
Parent:
- research/sc032_pricing_power_receipt_schema_v0_1.json

## Objective

Satisfy the outstanding cross-issuer calibration gap:
obtain one different-issuer official full pricing event under the frozen SC-032 multidimensional pricing-power state vector.

The event must be outcome-blind and must not infer realized ASP or margin from a posted-price list.

## Official issuer-native source

Formosa Plastics Corporation / 1301 official domestic list-price notice.

Document date:
2026-02-01.

Official source:
https://www.fpc.com.tw/fpcwuploads/pdocument/pdocument_260201090528.pdf

The official document lists the following observed product rows and adjustments in NTD/kg:

- suspension homopolymer PVC: +1.0;
- emulsion PVC: unchanged;
- copolymer PVC: unchanged;
- plastic additive MBS: +3.0;
- processing aid PA: unchanged;
- liquid caustic soda (100%): unchanged;
- flake/granular caustic soda: unchanged;
- industrial hydrochloric acid (100%): unchanged;
- sodium thiosulfate: unchanged;
- methyl chloride MCM: unchanged;
- methylene chloride DCM: unchanged.

The issuer explicitly states:
- some cash/term-price adjustment magnitudes may differ because of interest-rate factors;
- some products/specifications and internal corporate customers are not listed;
- actual selling prices remain subject to salesperson quotation.

## Clock treatment

The document itself is dated 2026-02-01.

Current research capture occurred on 2026-10-07.

The bounded evidence packet does not independently authenticate the exact second the document first became publicly retrievable.

Therefore freeze:
- `documentDate = 2026-02-01`;
- `sourcePublishedAt = UNKNOWN_EXACT_PUBLIC_AVAILABILITY`;
- `capturedAt = 2026-10-07 Asia/Taipei`;
- historical outcome/PIT use before the current capture is NOT authorized from this receipt alone.

This event qualifies as cross-issuer pricing-state calibration, not exact historical decision-clock proof.

## SC-032 state vector

```json
{
  "issuerSymbol": "1301",
  "issuerName": "Formosa Plastics Corporation",
  "eventId": "FPC_DOMESTIC_LIST_PRICE_20260201",
  "documentDate": "2026-02-01",
  "sourcePublishedAt": "UNKNOWN_EXACT_PUBLIC_AVAILABILITY",
  "capturedAt": "2026-10-07 Asia/Taipei",
  "inputCostContext": "UNKNOWN",
  "postedPriceResponse": "SELECTIVE",
  "realizedAspResponse": "UNKNOWN",
  "realizedMarginResponse": "UNKNOWN",
  "volumeMixResponse": "UNKNOWN",
  "inferenceState": "DESCRIPTIVE_ONLY",
  "observedListedRows": 11,
  "rowsUp": 2,
  "rowsFlat": 9,
  "rowsDown": 0,
  "companyWideCoverage": "UNKNOWN",
  "actualTransactionPrice": "NOT_IDENTIFIED_FROM_LIST_PRICE",
  "stockOutcomesOpened": false,
  "formalCoreChanged": false
}
```

## Why this is a genuine second-issuer control

The prior three-event calibration was all China Steel / 2002.

FPC / 1301 is:
- a different issuer;
- a different product family / industry setting;
- an issuer-native posted-price document;
- a multi-product matrix containing both increases and unchanged rows.

Therefore it falsifies any claim that selective posted pricing was merely a China Steel-specific reporting artifact.

Cross-issuer rule:
`SELECTIVE_POSTED_PRICE_RESPONSE_IS_OBSERVABLE_ACROSS_ISSUERS`.

But:
`SELECTIVE_POSTED_PRICE_RESPONSE != REALIZED_PASS_THROUGH`.

## Strong transaction-price firewall

The issuer itself states that actual selling prices are subject to salesperson quotation and that some rows/specifications are omitted.

Therefore a posted list price is not a realized transaction ASP.

Permanent rules:
- `LIST_PRICE != REALIZED_ASP`;
- `OBSERVED_PRODUCT_MATRIX != COMPANY_WIDE_COMPLETE_PRODUCT_UNIVERSE`;
- `UNCHANGED_LIST_PRICE != NO_PRICING_POWER`;
- `PRICE_INCREASE != MARGIN_PROTECTION`.

## Cross-issuer comparison with China Steel

Common result:
- both issuers exhibit non-uniform product-level pricing responses.

Differences:
- China Steel receipts include explicit cost/demand narrative around the pricing decision;
- this FPC receipt's observed price-list document does not itself identify a complete input-cost narrative;
- FPC explicitly warns actual selling price can differ from posted list price.

Therefore the evidence should not be collapsed into one scalar cross-company pricing-power score.

## D10-06 maturity

D10-06 remains L3 / 60%.

The outstanding different-issuer source-calibration gap is now materially resolved.

L4 is still blocked by:
- prospective native publication/capture clocks;
- realized ASP/margin follow-up on compatible scope;
- common-support economic validation;
- D16 validation;
- no stock-outcome evidence yet.

No Formal optimization candidate.
Formal Core unchanged.

## Exact next

SC-072:
freeze the first genuinely prospective future pricing event after this cross-issuer calibration:
- sourcePublishedAt/capturedAt before later ASP/margin;
- same SC-032 state vector;
- posted-price matrix preserved;
- no synthetic transaction ASP;
- no stock outcome.

Parallel future follow-up:
when an issuer later discloses compatible realized ASP/margin, join only by source/product/time compatibility and preserve confounders.
