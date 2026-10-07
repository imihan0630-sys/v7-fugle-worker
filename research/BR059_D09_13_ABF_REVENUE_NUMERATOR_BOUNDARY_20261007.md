# BR-059 D09-13 ABF Revenue Numerator Boundary — 2026-10-07

Status: ISSUER_NATIVE_UPPER_BOUND_EVIDENCE_FROZEN / ABF_SPECIFIC_COMPATIBLE_NUMERATOR_STILL_UNKNOWN / TAXONOMY_FIREWALL_STRENGTHENED / OUTCOMES_CLOSED

Owner room: 07｜產業與供應鏈研究室
Domain/module: D09 / D09-13
Task: BR-059
Observed main before write: `7291d84e504d1917f671f7ff509eacbddfacb46f`
Date: 2026-10-07 Asia/Taipei

## Objective

Continue issuer-native product/application revenue numerator search for 3189 Kinsus and 8046 Nan Ya PCB, prioritizing an ABF/substrate-specific numeric numerator while preserving product-vs-application taxonomy separation.

No forward return outcome was opened.

## Evidence A — Kinsus 3189

Official source:
`https://www.kinsus.com.tw/upload/media/ir/financial-information/financial-report/114/114Q4.pdf`

2025 consolidated revenue:
- total revenue: NTD 39,351,096 thousand;
- substrate operating segment revenue: NTD 32,311,845 thousand;
- optical operating segment revenue: NTD 7,039,251 thousand.

The substrate operating segment represents about 82.11% of consolidated revenue.

The same official financial report defines the substrate operating segment as the unit responsible for BGA substrate production/manufacturing and sales.

Separate issuer-native corporate communication states that Kinsus focuses on high-end FCBGA and SiP substrates and has made progress in large-area high-layer-count ABF substrates.

### BR-059 interpretation

The NTD 32,311,845 thousand substrate revenue is a valid issuer-native numeric upper bound for ABF-specific revenue because ABF is a subset of the broader substrate business.

It is NOT an ABF-compatible numerator.

Reason:
the disclosed substrate operating segment contains multiple substrate products/technologies and does not separately disclose ABF revenue.

Frozen state:
`KINSUS_3189_ABF_NUMERATOR = UNKNOWN`
`KINSUS_3189_SUBSTRATE_UPPER_BOUND_2025 = 32,311,845 thousand NTD`

Do not convert the 82.11% substrate share into an ABF share.

## Evidence B — Nan Ya PCB 8046

Official sources:
- `https://www.nanyapcb.com.tw/nypcb/images/InvestorRelations/FinancialReport/114Q4.pdf`
- `https://www.nanyapcb.com.tw/nypcb/Chinese/AboutNanYaPCB/CompanyProfile/Company`

2025 consolidated revenue:
- total revenue: NTD 40,172,990 thousand;
- disclosed main-product category "circuit board": NTD 39,060,099 thousand;
- other: NTD 1,112,891 thousand.

The broad "circuit board" revenue category represents about 97.23% of consolidated revenue.

The issuer-native company profile separately lists the company's operating products as:
- Conventional PCB;
- HDI;
- Rigid-Flex;
- ABF substrate;
- PP substrate.

The official technology navigation separately exposes ABF substrate and PP substrate roadmaps.

### BR-059 interpretation

The NTD 39,060,099 thousand "circuit board" product category is an issuer-native numeric upper bound only.

It is NOT an ABF-compatible numerator.

Reason:
the disclosed category aggregates conventional PCB, HDI, rigid-flex and multiple IC-substrate families. The taxonomy is much broader than ABF.

Frozen state:
`NANYA_8046_ABF_NUMERATOR = UNKNOWN`
`NANYA_8046_BROAD_CIRCUIT_BOARD_UPPER_BOUND_2025 = 39,060,099 thousand NTD`

Do not convert the 97.23% broad category share into an ABF share.

## Cross-issuer comparability firewall

Kinsus 2025:
`SUBSTRATE_OPERATING_SEGMENT`

Nan Ya PCB 2025:
`BROAD_CIRCUIT_BOARD_PRODUCT_CATEGORY`

These are not taxonomy-compatible numerators and must not be compared as if they represent the same economic product perimeter.

In particular:

`KINSUS_SUBSTRATE_SHARE != NANYA_BROAD_CIRCUIT_BOARD_SHARE != ABF_REVENUE_SHARE`

Application revenue such as AI/HPC is also not interchangeable with ABF product revenue.

A valid cross-issuer ABF numerator requires one of:
1. explicit ABF revenue;
2. explicit ABF revenue share with compatible total denominator;
3. a product category proven to contain only ABF;
4. a documented algebraic decomposition from issuer-native mutually exclusive categories that isolates ABF without residual ambiguity.

None is currently available for 3189 or 8046 in the reviewed 2025 issuer-native financial disclosures.

## New research value

Previous BR-059 state only recorded "numeric magnitude unknown".

This round adds a stronger boundary:
- issuer-native numeric upper bounds now exist for both 3189 and 8046;
- their taxonomy scopes are explicitly frozen;
- the upper bounds cannot be promoted to ABF numerators;
- cross-company ratios using these broad categories are forbidden.

This reduces future false precision and prevents a common denominator/numerator taxonomy error.

## Counter-evidence / limitations

- The absence of ABF-specific revenue in the reviewed consolidated financial report does not prove that no issuer-native ABF number exists anywhere.
- Investor conference files, annual report narrative tables, customer/product presentation slides or future disclosures may later provide a compatible numerator.
- Capacity, product roadmap, customer certification, AI/HPC application revenue and ABF product existence are not revenue numerators by themselves.
- No forward stock-return outcome was inspected; this task remains measurement construction only.

## Maturity decision

D09-13 remains L3 / 60.
D09 aggregate remains 57.1%.

Reason:
issuer-native measurement boundaries materially improved, but an ABF-specific compatible numerator remains unavailable and no prospective/OOS economic evidence was created.

## Exact next

`BR-059A`:
continue issuer-native search in:
- Kinsus 2025 annual report / 2025-2026 investor presentations;
- Nan Ya PCB 2025 annual report / 2025-2026 investor presentations;
- official shareholder / investor-relations downloads.

Search only for product-level mutually exclusive revenue/share disclosures capable of isolating ABF.

If no compatible numerator exists, retain UNKNOWN and treat the newly frozen broad-category values only as upper bounds.

Do not substitute:
- application revenue;
- capacity;
- shipment mix;
- sell-side estimates;
- media estimates;
- peer-derived ratios.
