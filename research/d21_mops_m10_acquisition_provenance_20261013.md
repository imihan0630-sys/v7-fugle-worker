# D21 — MOPS M10 historical provenance and paid/free acquisition gate (2026-10-13 05:30 Asia/Taipei)

Status: RESEARCH_ONLY / D21-03 L2 / D21-04 L2 / SOURCE_RECEIPT_BLOCKED / FORMAL_CORE_LOCKED
Baseline main SHA: a585abdc400f79ff14f0a808c5ca24ba018764ce
Owner: 14｜公司治理與內部人研究室
Scope: D21 only. No live trading, weights, ranking, thresholds, execution, deployment, or historical Shadow claims.

## 1. New authoritative discovery: official push product exists, but it is NOT yet a historical receipt

TWSE's own Data E-Shop MOPS Push Service "Package 2" publicly lists:
- D01: daily announced intended transfers;
- D02: daily untransferred reports;
- M10: monthly ex-post insider holding-change report.
- Package 2 price displayed: NT$40,000/month.
- Package 2 Plus also includes D01/D02/M10; displayed price NT$50,000/month.

Primary sources:
- https://eshop.twse.com.tw/zh/mops/detail/000000007af53455017af57a15fe0007
- https://eshop.twse.com.tw/zh/mops/detail/000000007af53455017af57b3a120008
- https://eshop.twse.com.tw/zh/mops/list
- https://eshop.twse.com.tw/zh/mops/about

This is a concrete **alternative data-acquisition route** for D21-03 beyond the public MOPS interactive query. It does NOT prove that:
(a) any particular historical M10 file can be retrieved;
(b) original publication timestamps and every amended vintage are retained;
(c) person-level original fields suffice to separate market transactions from gifts/trust/tax/pledge;
(d) the subscription includes historical backfiles or redistribution/research-use rights.
These four requirements are UNKNOWN until original contract/specimen/archive confirmation.

The shop says organization application documents are required; it is not evidence of an immediately free public API. Do not buy or request paid subscription without owner authorization and cost/license assessment.

## 2. Free source comparator and its limits

Official Taiwan open-data listings:
- https://data.gov.tw/dataset/22811 : listed directors/supervisors holding balances; listed metadata says monthly; fields include measurement month, holdings, pledged shares and related-person totals.
- https://data.gov.tw/dataset/22812 : OTC counterpart; metadata says yearly, despite a measurement-month field.
- https://data.gov.tw/dataset/22815 : listed daily untransferred intended-sale report.
- https://data.gov.tw/dataset/22816 : OTC daily untransferred intended-sale report.
- https://data.gov.tw/dataset/22814 : OTC daily intended-transfer report.

These are different statistical objects. A holdings balance is not gross buy/sell executions. An intended transfer is not a completed sale. A non-transfer report's absence is not proof of full execution. Current open-data snapshot is not an immutable original first-known vintage. Published update frequency is metadata, not proof of historical row coverage.

## 3. Four hypotheses: support, falsification, alternative explanation, failure conditions

H1: M10 push data may supply authoritative historical ex-post changes.
Support: official product code M10 expressly names ex-post monthly holding changes.
Falsification: a catalog listing alone has no file bytes, historical archive, original knownAt or amendment sequence.
Alternative: M10 may be a current/monthly push feed only, with no historical backfill.
Failure: if immutable event-time and vintage reconstruction are unavailable, it cannot unlock PIT/OOS and D21-03 stays L2.

H2: D01 + D02 + M10 could identify actual self-funded purchases/sales.
Support: independent intent, untransferred and ex-post report families provide complementary observations.
Falsification: without stable event ID, person/controller identity, transaction-method coding, revisions, gross amounts and evidence of actual economic consideration, no unique pairing or self-funding proof exists.
Alternative: gift, inheritance, trust, pledge, tax planning, intra-group movement, passive corporate actions or netted gross flows.
Failure: cannot separate market own-funds from non-market movements or pair original versions without hindsight; mark UNKNOWN, never 0/BAD.

H3: legal monthly deadline is a sufficient first-known timestamp.
Support: statutory monthly reporting by the 15th bounds compliant submission behavior.
Falsification: deadlines are obligations, not receipts; late submissions, hidden leaver records, and pre-deadline amendments can break the claimed exact vintage.
Alternative: early upload, late upload, correction, missing public visibility.
Failure: any unavailable authoritative publication evidence prevents exact-knownAt labeling. A conservative daily bound must require valid historical rule, affirmative source coverage and no contrary late-filing evidence; never infer intraday availability.

H4: pledge setup/release is a directional bearish/bullish insider trade.
Support: secured borrowing can create financing or forced-liquidation exposure in some contracts.
Falsification: collateral transfer is not an equity sale; no loan maintenance terms, lender covenants or controller chain were obtained.
Alternative: normal financing, collateral substitution, estate/tax planning, institutional collateral arrangements.
Failure: absent original controller-specific event receipt and borrowing terms, only non-directional governance-risk context is permissible.

## 4. Required paid-product procurement proof (no purchase authorized)

Request a no-cost written specification/sample FIRST, asking:
1. Is M10 historical backfile available for 2019–2026 and for delisted issuers?
2. Does each original and revised file retain first public upload/dispatch time, amendment ID and immutable archive checksum?
3. What are file field dictionary, transfer-method taxonomy, related-party identifiers, unit/corporate-action rules and market-vs-nonmarket coding?
4. Can the original event be linked to D01/D02 and pledge setup/release without person-name/date heuristic joins?
5. What are historical revision coverage, missing-month flags, delivery cadence and late-filing semantics?
6. What are exact fees (including backfiles), redistribution/internal research license, archival rights, cancellation and API/storage constraints?

Until all are answered with verifiable evidence, label PRODUCT_AVAILABLE / HISTORICAL_PIT_UNPROVEN / LICENSE_COST_UNVERIFIED. Prefer free public source validation before paid procurement.

## 5. Falsification and experiment gates

- Decision-time clock: original knownAt, amendment knownAt, first observed time, effective-from; never backfill later revisions.
- Historical full population: listed, OTC, delisted, leavers, controlling groups, amendments, non-market transfers, zero-row days.
- Deduplicate person/related group/ultimate controller; do not treat grouped filings as independent votes.
- Pre-register hypotheses and factor family, OOS and walk-forward folds; purging/embargo for overlapping horizons.
- Stratify size, industry, controller type, reporting channel, market regime and source coverage.
- Test transaction cost, slippage, liquidity and incremental signal beyond D06/D07/D11.
- Missing record = UNKNOWN, never zero, bad, no-trade or synthetic Shadow.
- No historical Shadow fabricated. No alpha or maturity promotion without true first-known historical receipts.

## 6. Deterministic synthetic guard exercise

12 deliberately synthetic classification cases were run: 12 pass / 0 fail. Cases covered future knowledge, actual post-publication, missing receipt, deadline-only, missing timestamp, unproven revision, gift, trust, inheritance, intended transfer, pledge setup and pledge release.
This is a specification exercise, NOT live historical data, OOS, walk-forward or market validation.

## 7. Exact next continuation

1. Verify whether a FREE original historical M10/monthly actual-change file and an original controller pledge setup/release file can be obtained; archive bytes, original source URL, SHA256, original/publication timestamp and amendment sequence.
2. If free original evidence remains unavailable, request product specification and historical sample without purchasing. Escalate cost/rights decision to owner only after a quantified gap/cost/coverage comparison.
3. Construct at least two contrasting verified transfer-method events and one setup/release pledge pair; otherwise maintain D21-03/D21-04 L2 40%.
4. Only after historical PIT, population, OOS, walk-forward, redundancy, cost and regime gates pass may a FORMAL_OPTIMIZATION_CANDIDATE be proposed; Formal Core stays LOCKED.
