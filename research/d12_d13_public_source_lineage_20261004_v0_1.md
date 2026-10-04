# Room 09 D12/D13 public-source lineage continuation — 2026-10-04

Status: RESEARCH_ONLY / SOURCE_QA / OUTCOMES_CLOSED / NO_PROMOTION
Observed main before durable write: 2e5b2d30e446de79c9530ba8b36bc64317377996
Room: 09｜衍生品與國際總經研究室
Domains: D12, D13

## D12 — public option time-and-sales route, source-version guard, and H11 implications

### DR-074 — official time-and-sales route exists, but publication timestamp needs receipt identity
TAIFEX's official "Time & Sales Data for Previous 30 Trading Days" explicitly offers RPT and CSV downloads. Current official English and Chinese crawls disagree on the displayed issued time for 2026-10-02 (16:46:35 vs 05:23:20). This is not resolved by choosing one crawl. The issued-time field itself must be bound to language/page version, observedAt, and source receipt before it can be used as a PIT clock.

Sources:
- https://www.taifex.com.tw/enl/eng3/optPrevious30DaysSalesData?menuid1=03
- https://www.taifex.com.tw/cht/3/optPrevious30DaysSalesData

### DR-075 — official OpenAPI route confirmed; current fetcher cannot materialize the full payload
TAIFEX OpenAPI Swagger exposes GET /OptionsTimeAndSalesData ("每日選擇權每筆成交資料"). A direct fetch to the public endpoint is reachable but the current extraction path returns CONTENT_TOO_LARGE before rows can be inspected. Therefore:
- source route = CONFIRMED;
- raw parent bytes/rows = NOT_MATERIALIZED_IN_THIS_RUN;
- schema/date-history semantics = NOT_YET_ATTESTED from the live payload;
- no L3 credit from route existence.

Source:
- https://openapi.taifex.com.tw/

### DR-076 — transaction parent and quote/surface parent are different evidence objects
Per-trade time-and-sales can validate contract/date/time/price/size/session replay, but it does not by itself prove contemporaneous bid/ask quote surface or order-book depth. D12-07 simple skew/term and D12-16 volatility surface need quote-quality/common-support evidence under the frozen surface method. A trade-only parent cannot silently substitute for a quote parent.

### DR-077 — H11 raw-parent preservation must obey source-license/provenance boundaries
The H11 remaining delta still requires one permitted raw parent with source identity/hash. Raw bytes should not be committed to the public repository unless redistribution is explicitly permitted. The safe durable pattern is:
1. preserve public URL, source page identity, retrieval time, content hash, row/schema summary and parser version in GitHub;
2. keep raw bytes only in an authorized storage location if license/terms permit;
3. store no reconstructed/degraded bytes as if they were the original source;
4. missing raw parent remains UNKNOWN.

### DR-078 — D12 conclusion
This run improves source-route and evidence-object separation but does not complete the raw option-chain parent, same-parent skew-vs-surface comparison, divergent-state audit or prospective 18:10 receipt. D12 remains 40.0%, L2 aggregate. H11 remains PARTIAL_EVIDENCE_RECEIVED. Outcomes CLOSED. Formal Core LOCKED.

## D13 — cross-release CBC vintage arithmetic and revision attribution firewall

### MC-177 — Q1 was already revised by the Q2 publication vintage
CBC 2025-05-20 Q1 headline current-account surplus = 302.3 USD100m.
CBC 2025-08-20 Q2 headline current-account surplus = 362.3 USD100m and H1 cumulative = 659.9 USD100m.

Using values within the August publication vintage:
659.9 - 362.3 = 297.6 USD100m.

Therefore the Q1 amount embedded in the August H1 cumulative is approximately 297.6 at headline precision, not the May headline 302.3. A revision to prior-quarter history had already occurred by the Q2 publication. Cross-release headline addition 302.3 + 362.3 = 664.6 is not the August-vintage H1 total and is invalid for a PIT reconstruction.

Sources:
- https://www.cbc.gov.tw/tw/cp-432-181493-00b13-1.html
- https://www.cbc.gov.tw/tw/cp-432-182951-a9c69-1.html

### MC-178 — Q3 publication proves another H1 revision, but does not identify Q2 alone
CBC 2025-11-20 Q3 current-account surplus = 458.4 USD100m and Q1-Q3 cumulative = 1122.4 USD100m.

Same-vintage arithmetic:
1122.4 - 458.4 = 664.0 USD100m for H1 at the November vintage.

Compared with August H1 659.9, prior H1 history increased by approximately 4.1. Without the November native quarter table, this change cannot be allocated uniquely to Q1, Q2 or both. It narrows revision lineage but does not prove that 2025Q2 had already reached 372.01.

Source:
- https://www.cbc.gov.tw/tw/cp-302-187386-47288-1.html

### MC-179 — full-year publication proves further prior-quarter revision
CBC 2026-02-26 Q4 current-account surplus = 699.3 USD100m and full-year 2025 current-account surplus = 1811.4 USD100m.

Same-vintage arithmetic:
1811.4 - 699.3 = 1112.1 USD100m for Q1-Q3 at the February vintage.

This is approximately 10.3 below the November Q1-Q3 cumulative 1122.4, proving further revision to prior quarters between publication vintages. Again, aggregate subtraction cannot attribute the change to Q1, Q2 or Q3 individually.

Source:
- https://www.cbc.gov.tw/tw/cp-302-190856-142ce-1.html

### MC-180 — later year-on-year headlines bound the revised quarter values
CBC 2026-05-20 Q1 current account = 625.3 and reported YoY increase = 328.4, implying a prior-year Q1 headline basis near 296.9 at one-decimal precision.
CBC 2026-08-20 Q2 current account = 584.9 and reported YoY increase = 212.9, implying a prior-year Q2 headline basis near 372.0, consistent with the previously verified native 372.01 endpoint.

This shows that prior-year quarter values continue to migrate across vintages. It still does not identify the first release date at which Q2 became exactly 372.01.

### MC-181 — frozen revision-lineage rule
For CBC BOP research:
- arithmetic may be used only within the same publication vintage unless explicit native revision lineage is available;
- cross-release cumulative subtraction is prohibited because it mixes revised and unrevised quarters;
- cumulative changes prove that at least one prior component changed but cannot allocate the revision without component-level/native evidence;
- revised historical values cannot be backfilled to their reference quarter's decision date;
- first-public revision date remains UNKNOWN until a native intermediate annex proves it.

Maturity impact: none. D13 remains 41.1%. D13-17 remains L2. Strict clean prospective dates added=0. Outcomes CLOSED. Formal Core LOCKED. FORMAL_OPTIMIZATION_CANDIDATE=NONE.

## Tool/source limitations in this run

- TAIFEX interactive CSV click automation could not be started because the external automation wallet had insufficient balance. No retry was made.
- CBC Q3/Q4/Q1 native XLSX attachment URLs were identified. Static extraction exposed ZIP/XLSX bytes non-losslessly and cannot be treated as a valid workbook parse. No reconstructed workbook was used.
- Tool limitations are ACCESS/TOOLING state, not source absence.

## Exact next continuation

1. D12 / DR-079: audit TAIFEX OpenAPI /OptionsTimeAndSalesData via a bounded authorized path or metadata route that can preserve a raw parent/hash without public redistribution; freeze actual row schema/date semantics.
2. D12 / H11: obtain quote-chain parent under permitted terms, then parse D12-07 simple skew/term and D12-16 complex surface from identical parent rows/common support. Record divergent states and return KEEP_SEPARATE / SCOPE_DEDUP_ONLY / MERGE_ELIGIBLE / EVIDENCE_INSUFFICIENT.
3. D13 / MC-182: acquire/read lossless CBC 2025-11-20 native XLSX first. Inspect historical quarter rows and revision markers. If Q2 != 372.01, proceed chronologically to 2026-02-26 and 2026-05-20; stop as soon as first-public revised Q2 value is proven.
4. Preserve all publication/reference/observedAt/version clocks separately. No outcome join or L3 promotion before applicable PIT/source-attestation gates.
