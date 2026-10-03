# Alpha-oriented Knowledge Discovery Audit 2026-10-04 V0.1

Status: DISCOVERY_AUDIT_ACTIVE / NO_CURRICULUM_CHANGE
Purpose: discover knowledge families that may improve stock selection and are not already cleanly owned by the canonical 354-module curriculum.
Canonical impact: NONE.
Formal Core impact: NONE.
System1/System2 Formal impact: NONE.

## Admission rule

A discovery candidate is retained only when all of the following are plausible:

1. Cross-sectional selection relevance — evidence connects the knowledge to future firm performance, valuation mispricing, or cross-sectional stock returns.
2. Incrementality — the candidate is not merely a relabeling of an existing D01-D22 module.
3. Taiwan feasibility — a PIT/replay-capable Taiwan source is plausible.
4. Falsifiability — both positive mechanism and counterevidence can be tested.
5. Governance fit — the candidate can have a clean owner and explicit anti-double-count boundary.

Discovery candidate != Coverage candidate.
Coverage candidate != module addition.
No module-count, maturity, owner, or Formal change is authorized by this audit.

---

## AOKD-01 — Intangible Capital / R&D Capitalization / Innovation Quality

Priority: HIGH  
Discovery state: PROVISIONAL_COVERAGE_CANDIDATE_READY_FOR_SPECIALIST_VALIDATION  
Proposed primary owner: D07 Fundamentals / Accounting / Information Dynamics  
Dependencies: D08 Valuation, D19 Asset Pricing / Factors, D16 Validation / Alternative-data provenance

### Why it matters for stock selection

The canonical map contains R&D-adjacent accounting, profitability, valuation, factor and alternative-data capabilities, but no explicit owner for the full chain:

R&D expense
→ capitalized knowledge capital
→ organization / customer / knowledge intangible capital
→ patent / innovation output quality
→ intangible-adjusted profitability / valuation
→ future fundamentals and cross-sectional returns.

This is economically distinct from simply observing R&D expense or generic profitability.

### External evidence — positive

- NBER Working Paper 31068, *An Intangibles-Adjusted Profitability Factor*:
  treating intangible-creating expenditures as investment changes profitability measurement and improves cross-sectional factor-model performance.
- NBER Working Paper 34882, *Intangible Intensity* (2026):
  constructs text-based intangible-investment intensity and separates knowledge, customer and organization capital.
- SSRN 6442563 (2026):
  reports strong valuation effects and positive risk-adjusted returns for high intangible-intensity firms.
- Finance Research Letters 76 (2025), 106923:
  patent-quality measures are associated with profitability among technology firms.

### Counterevidence / anti-hype

- SSRN 6901498 (2026) finds an intangible-capital return premium that becomes statistically insignificant after controlling for momentum, profitability and investment.
- Classic R&D evidence does not support a naive monotonic “more R&D = higher future return” rule.
- Industry mix, accounting conventions, acquisition accounting and lifecycle stage can dominate raw R&D intensity.

Therefore the research object is not an R&D score.
The object is whether intangible-adjusted measures add residual information beyond D07 profitability, D08 valuation and D19 style factors.

### Taiwan feasibility

Strong enough for specialist validation.

Official Taiwan Intellectual Property Office open data provides:
- patent application / publication identifiers;
- application and publication dates;
- applicant information;
- inventor information;
- IPC classification;
- patent-right status / change data;
- XML / API / downloadable datasets.

MOPS provides listed-company financial statements and disclosures.

Potential PIT chain:
- R&D/accounting vintage from financial filings;
- patent application/publication/status first-known clocks from TIPO;
- issuer/applicant entity resolution;
- sector-neutralized innovation/intangible metrics.

### Critical Taiwan blockers

- listed issuer ↔ subsidiary / affiliate ↔ patent applicant identity mapping;
- patent publication lag versus economic investment timing;
- patent quantity versus patent quality;
- missing or difficult citation / claim-quality history;
- R&D capitalization assumptions and depreciation rates;
- acquisition-created versus internally-created intangibles;
- sector comparability;
- avoiding duplicate votes with D07 profitability, D08 value and D19 quality/investment.

### Specialist questions required before Coverage promotion

1. Can TIPO + MOPS build a reproducible issuer-level PIT panel?
2. Which metric is the economic primitive: R&D capital, organization capital, patent quality, innovation efficiency, or a family with one owner?
3. Does the signal survive controls for profitability, investment, momentum, value, size and industry?
4. Does Taiwan evidence support stock-selection incrementality rather than descriptive valuation only?
5. Should ownership be:
   - EXTEND_EXISTING_SCOPE in D07,
   - a new D07 module,
   - or a D19 factor sub-capability with D07 producer dependency?

Current 00-room recommendation:
**promote to specialist validation packet, but do not yet assign COV-13.**

---

## AOKD-02 — Firm-level Demand Nowcasting via Alternative Sales / Product Data

Priority: MEDIUM-HIGH  
Discovery state: RESEARCH_CANDIDATE_DATA_FEASIBILITY_REQUIRED  
Proposed primary owner if feasible: D07  
Dependencies: D16-21 Alternative Data Provenance, D17 event timing, D09/D10 sector and supply-chain context

### Economic hypothesis

High-frequency consumer/product demand data may reveal revenue persistence or deterioration before quarterly accounting reports and can improve interpretation of prior revenue surprises.

### External evidence

Recent research using retail scanner data and online-sales disclosures finds that alternative sales data can:
- help investors reassess revenue persistence;
- improve price discovery between earnings announcements;
- improve expectations before earnings;
- provide a real-economy benchmark after corporate scandals.

### Existing-map overlap

D16-21 already owns alternative-data provenance / selection bias.
That is a **data-governance owner**, not an economic signal owner.

Potential missing owner:
high-frequency firm-demand nowcasting as a D07 fundamental-information capability.

### Taiwan feasibility

Currently insufficient for Coverage promotion.

No authoritative, broad, issuer-level Taiwan consumer transaction / scanner / online-sales history has yet been verified.

Possible sources may be proprietary and may fail:
- historical availability;
- issuer/product mapping;
- representativeness;
- survivorship/coverage stability;
- legal/licensing reproducibility.

Current recommendation:
**retain as discovery candidate; do not promote to COV until a Taiwan PIT source is demonstrated.**

---

## AOKD-03 — Human Capital / Hiring / Skill-demand Signals

Priority: MEDIUM  
Discovery state: RESEARCH_CANDIDATE_DATA_FEASIBILITY_REQUIRED  
Possible owner: D07 business fundamentals or D21 management/organization quality  
Dependency: D16-21 Alternative Data Provenance

### Economic hypothesis

Firm hiring intensity, skill mix and labor-market competition may reveal expansion plans, technology adoption, cost pressure or hidden deterioration before accounting results.

### External evidence

Recent work finds:
- online job-posting measures can capture economically meaningful labor demand, though representativeness varies;
- labor-market competition for similar talent can affect future cash flows and stock returns;
- AI-related hiring is associated with firm-value and operating-performance measures;
- recruitment timing can also be strategically shifted before bad earnings news, so raw hiring growth is not a monotonic bullish signal.

### Taiwan feasibility

Taiwan has an official Ministry of Labor / TaiwanJobs open-data vacancy API with employer, occupation, pay, location and update fields.

However current blockers are substantial:
- not all listed-company recruiting occurs through TaiwanJobs;
- coverage differs by employer size and channel;
- listed issuer ↔ employer-name entity resolution;
- historical snapshots need prospective or archived capture;
- API query limits;
- job-count changes may reflect posting-channel behavior rather than true vacancies.

Current recommendation:
**retain as research candidate; require coverage-bias and issuer-mapping validation before Coverage promotion.**

---

## AOKD-04 — Employee Culture / Psychological Safety / Employee-review Signals

Priority: WATCHLIST  
Discovery state: WATCHLIST_NONCORE  
Possible owner if ever feasible: D21 with D16 text/provenance dependency

Recent studies report associations between employee satisfaction / psychological-safety text and future operating performance or abnormal returns.

Do not promote now because:
- Taiwan market-wide historical employee-review coverage is not verified;
- selection/manipulation/platform bias is high;
- D21 governance/culture and D16 NLP/provenance already cover much of the conceptual machinery.

---

## Candidates explicitly rejected as new knowledge gaps in this pass

### Analyst expectations / forecast revisions
REJECT_NEW_MODULE.
Already owned by D07-11 and deeply researched.

### Option-implied information / volatility surface
REJECT_NEW_MODULE.
Already owned by D12-11 / D12-13 / D12-14 / D12-15 / D12-16 and associated H11 governance.

### Generic NLP / LLM financial-text features
REJECT_NEW_MODULE.
Already owned by D16-22, with domain-specific semantics elsewhere.

### Generic alternative-data methodology
REJECT_NEW_MODULE.
Already owned by D16-21.

### Borrow fee / securities lending / shorting
REJECT_NEW_MODULE.
Already covered by D06 / D14 / D20 dependency chain.

---

## Ranked discovery result

1. AOKD-01 Intangible Capital / R&D / Innovation Quality — **PROMOTE TO SPECIALIST VALIDATION**
2. AOKD-02 Demand Nowcasting Alternative Data — **KEEP / SOURCE FEASIBILITY FIRST**
3. AOKD-03 Human Capital / Hiring Signals — **KEEP / COVERAGE-BIAS VALIDATION FIRST**
4. AOKD-04 Employee Culture / Reviews — **WATCHLIST**

## Stop rule

Do not create a new canonical module from this document.
Do not assign COV-13 until specialist validation demonstrates:
- Taiwan PIT feasibility;
- non-redundancy;
- owner boundary;
- plausible incremental stock-selection value.

Current canonical curriculum remains whatever the authoritative tracker reports at decision time.
