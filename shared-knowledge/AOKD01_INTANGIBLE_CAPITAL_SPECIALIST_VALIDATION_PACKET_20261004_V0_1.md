# AOKD-01 Specialist Validation Packet — Intangible Capital / R&D / Innovation Quality

Status: READY_FOR_SPECIALIST_VALIDATION  
Primary specialist room: 06｜基本面與估值研究室  
Primary domain: D07  
Dependencies: D08 / D19 / D16  
Canonical module-count impact: NONE until 00-room decision.

## Question

Does the current 354-module curriculum lack a distinct, stock-selection-relevant owner for:

- R&D capitalization / knowledge capital;
- organization capital / customer capital;
- patent / innovation quality;
- innovation efficiency;
- intangible-adjusted profitability and valuation?

The specialist must determine whether this should be:

- `EXTEND_EXISTING_SCOPE`;
- `ADD_MODULE`;
- `MERGE_INTO_EXISTING`;
- `NOT_A_GAP`;
- `EVIDENCE_INSUFFICIENT`.

Do **not** change the tracker/module count.

## Mandatory validation

### 1. Exact knowledge definition

Separate at minimum:
- reported R&D expense;
- capitalized R&D stock;
- organization capital;
- customer / brand capital;
- patent quantity;
- patent quality;
- innovation efficiency;
- intangible-adjusted profitability;
- intangible-adjusted valuation.

Do not collapse them into one score unless the economic primitive is proven.

### 2. Existing-owner overlap

Compare directly with:
- D07-04 ROE / ROIC;
- D07-07 earnings quality / accruals;
- D07-12 business model / revenue engine;
- D07-13 competitive advantage / moat;
- D07-18 to D07-25 forecasting/accounting capabilities;
- D08 valuation family;
- D19-03 Value;
- D19-05 Quality / Profitability;
- D19-06 Investment / Asset Growth;
- D19-10 factor exposure / multicollinearity;
- D16-21 alternative-data provenance;
- D16-22 NLP / LLM financial-text validation.

The return must state what residual capability remains after these owners.

### 3. Taiwan PIT feasibility

At minimum evaluate:
- MOPS financial statement/disclosure availability for R&D-related accounting data;
- TIPO patent application/publication/right-status open data;
- issuer ↔ applicant/subsidiary entity resolution;
- application/publication/status first-known clocks;
- historical backfill / revision semantics;
- industry classification;
- delisted/merged issuer continuity where applicable.

### 4. Innovation-quality construction

If patent quality is retained, test candidate measures such as:
- patent family / grant / maintenance status;
- claim breadth/count where reproducible;
- citation-based measures only if historical citation vintages are available;
- technology-class novelty / concentration;
- patent output per R&D unit;
- patent persistence / maintenance.

No metric may be called “quality” solely because it is easy to collect.

### 5. Capitalization assumptions

If R&D or SG&A is capitalized:
- freeze the capitalization share;
- freeze depreciation assumptions;
- test sensitivity;
- distinguish sector-specific useful lives;
- prevent current-accounting data from being backfilled into past decision dates.

### 6. Stock-selection incrementality

The candidate must be tested against:
- Size;
- Value;
- Momentum;
- Profitability;
- Investment;
- Industry;
- baseline D07 fundamental quality;
- baseline D08 valuation.

A raw long-short return is insufficient if it disappears after these controls.

### 7. Taiwan-specific falsification

Required counter-tests:
- semiconductor/electronics versus non-tech;
- growth versus mature firms;
- loss-making versus profitable firms;
- young versus old firms;
- high-R&D but weak commercialization;
- patent-heavy subsidiaries with listed-parent mapping ambiguity;
- acquisition-created intangibles versus internally developed intangibles.

### 8. Decision role

State whether the capability is primarily:
- explanatory;
- validation;
- supportive;
- strategy evidence.

Do not automatically make it an independent Alpha vote.

### 9. Anti-double-count

Freeze explicit rules preventing:
- R&D intensity + intangible-adjusted profitability + patent count from becoming three votes from one economic mechanism;
- double counting with D19 Quality / Investment;
- double counting with D08 valuation adjustments;
- narrative “moat” evidence from being scored again as innovation quality.

### 10. Terminal recommendation

Exactly one:
- `ADD_MODULE`
- `EXTEND_EXISTING_SCOPE`
- `MERGE_INTO_EXISTING`
- `NOT_A_GAP`
- `EVIDENCE_INSUFFICIENT`

## Expected return path

`research/AOKD01_D07_INTANGIBLE_CAPITAL_SPECIALIST_RETURN_V0_1.md`

## 00-room intake rule

This is a discovery-stage packet.
Even a complete return does not create COV-13 automatically.

00｜研究總控室 must first decide whether the result:
- closes into an existing module;
- becomes a formal Coverage candidate;
- or is rejected for insufficient incremental value / Taiwan feasibility.
