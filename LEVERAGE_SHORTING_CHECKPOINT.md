# Leverage & Shorting Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: LS-001 through LS-047 complete.
Status: CONCEPT_COMPLETE / DATA_SPEC_COMPLETE / SOURCE_CONTRACT_PARTIAL.
Next: LS-048 only after an official TPEx margin UTF-8 CSV artifact or verified stable endpoint is available; then run a finalized-history backfill pilot without outcome testing.

## Durable conclusions

- Margin purchase, margin short, securities borrowing and actual borrowed-stock short sale are distinct objects.
- Balance (stock) and daily flow are separate.
- Absolute margin balances are structurally misleading across eras; normalize by market/stock scale and own history.
- 2026 TWSE evidence shows margin trading remains heavily retail-dominated while its share of total market activity is much lower than 2000-era levels.
- Rising margin financing has both constructive and adverse/crowding interpretations.
- Falling margin balance does not prove forced liquidation.
- SBL/borrowed short sales are hedge-confounded; borrowing itself is not proof of short sale.
- Historical Taiwan evidence supports testing short-interest information, but old regime effect sizes/thresholds cannot be transplanted to 2026.
- Participant identity matters; aggregate public data mix information, sentiment, correction and hedging.
- Short-sale constraints / eligibility / disposition states require regime controls.
- Short covering is not automatically a squeeze; squeeze candidates require joint prior short crowding + price/volume + covering/return evidence.
- High margin-long and high short-side positioning can represent disagreement/volatility rather than direction.
- TWSE warns current-day margin balance is auxiliary and may be revised; next-day “previous balance” is final. Vintage/finality must be stored explicitly.
- V8.7.11 currently has useful single-day TWSE margin and actual SBL short evidence but lacks contiguous history and TPEx parity.
- TPEx official margin and borrowed-short history sources exist; current UNKNOWN is a capture gap, not a data-unavailability claim.
- No state maps directly to BUY/SELL.
- Formal Core remains LOCKED.

## Exact next continuation
LS-025 audit exact V8.7.11 persisted MI_MARGN fields.
LS-026 design TWSE+TPEx point-in-time history/vintage capture.
LS-027 storage/API/backfill feasibility.
LS-028 minimal Shadow schema/completeness contract.
LS-029 governance proposal only if justified.


## LS-025 through LS-040 durable update

- Exact V8.7.11 margin schema audited: marginBuy, marginSell, marginPrevBalance, marginTodayBalance, marginBalanceChangePct, marginShortCover, marginShortSale, marginShortPrevBalance, marginShortTodayBalance. Current same-day balance change is preliminary, not authoritative finalized history.
- TWSE official semantics require preserving same-evening preliminary balance and next-trading-day finalized prior balance as separate vintages; never overwrite one with the other.
- Historical finalized daily TWSE/TPEx margin and SBL data are research-feasible, but historical backfill cannot recreate first-known timestamps or prove same-night availability.
- Minimal Shadow schema now separates raw margin long, margin short, actual SBL short sale, restriction/quota state, vintage/provenance and derived states.
- Same-day use before the 23:35 Formal scan must be based on actual capturedAt; source readiness is never assumed.
- Historical regime map includes SBL formula/rule changes, short-sale exemptions/limits, 2020-03-23 continuous trading, 2020-10-26 intraday odd-lot and later TPEx SBL limit changes.
- Preferred normalization starts with daily-volume / ADV20 / own-history / quota-utilization views. Issued shares are not free float.
- First hypotheses H1-H5 are frozen before outcome inspection: long-leverage crowding, deleveraging stress, actual SBL short information, squeeze candidate and two-sided crowding/disagreement.
- Cross-lane ownership is frozen to avoid double counting with Price-Volume, institutional cash flow, derivatives, microstructure and Portfolio Risk.
- Shadow v0.1 is compact and OBSERVER-only; no modifier/veto/Formal score.
- Lane status is CONCEPT_COMPLETE / DATA_BUILD_PENDING. No runtime or Formal change.

## Exact next continuation

LS-041: prepare offline historical-data specification and exact TWSE/TPEx field mappings.
LS-042: validate a small multi-date sample before large backfill.
LS-043: only after schema validation, collect independent-date evidence.
In parallel, identify the next genuinely under-studied concept lane rather than invent more leverage indicators.


## LS-041 through LS-046 durable update

- `LEVERAGE_SHORTING_DATA_SPEC.md` freezes offline finalized-history grain, source mappings, vintage/finality, units, regime metadata, completeness and backfill go/no-go rules.
- Small fixed sample validation: TWSE margin and TWSE SBL schemas/algebra PASS; TPEx margin displayed schema/algebra PASS; TPEx SBL displayed schema/algebra PASS.
- TPEx official EDIS S47 `Margin_SBL.csv` machine contract is verified, including production metadata and field order.
- TPEx margin officially offers BIG5/UTF-8 CSV, but stable programmatic download endpoint/parameter contract remains unresolved; do not guess URLs.
- Unit audit: TPEx margin is displayed in lots, TWSE MI_MARGN uses trading units, and SBL files use share counts. Raw fields are not universally comparable before verified unit normalization.
- Cross-market automated large backfill remains NO_GO until the unresolved TPEx margin source contract is solved or an official downloadable-artifact ingestion workflow is chosen.
- Safe fallback is official artifact ingestion with source/date/checksum/schema/parser metadata; no access-control bypass or hidden-endpoint guessing.
- No outcome tests H1-H5 have been run yet. Formal Core unchanged.

## Exact next continuation

LS-047: validate TPEx margin parser only when an official artifact/endpoint is available.
LS-048: finalized-history backfill pilot with no outcome testing.
LS-049: completeness/revision audit.
LS-050: only after data gates pass, run pre-registered H1-H5 tests.


## LS-047 — TPEx margin programmatic contract re-audit (2026-09-27 Asia/Taipei)

- Re-checked only official TPEx sources; no outcome/return data were inspected.
- Current official margin page and legacy official page both verify that BIG5 and UTF-8 CSV downloads exist. The legacy page redirects to the current `/zh-tw/mainboard/trading/margin-trading/transactions.html` page.
- Official indexed HTML result `margin_bal_result.php?...&o=htm` remains machine-readable and reproduces the frozen field layout and lots (張) semantics on 2026-09-24.
- Browser-rendered extraction exposes ordinary page/history/SBL links, but the BIG5/UTF-8 CSV controls are not exposed as stable anchor hrefs. Official-domain searches for a verified CSV request pattern returned no source-backed contract.
- Direct generic web fetch of the current TPEx page returned HTTP 403. This is an access/source-contract limitation; it is not permission to infer hidden parameters or bypass protections.
- Therefore `TPEX_MARGIN_DATA_PRODUCT_AND_UTF8_CSV_EXISTENCE = VERIFIED`, while `TPEX_MARGIN_PROGRAMMATIC_DOWNLOAD_CONTRACT = UNRESOLVED`.
- Large automated cross-market backfill remains NO_GO. Safe route remains the LS-046 contract: ingest an official UTF-8 CSV artifact with source/date/downloadedAt/checksum/schema/parser metadata, or use a later documented/stable TPEx endpoint if one becomes verifiable.
- Machine receipt: `research/leverage_shorting_ls047_tpex_margin_source_contract_receipt_v0_1.json`.
- Lane status is more precisely `DATA_SOURCE_BLOCKED / OFFICIAL_ARTIFACT_OR_ENDPOINT_REQUIRED`; this is not a claim that the underlying margin data are unavailable.
- No Worker/runtime/Formal change. No H1-H5 outcome test.

## LS-047A — official TPEx machine-data paths verified; access/cost remains a gate (2026-09-29 Asia/Taipei)

A fresh official-source audit materially narrows the earlier source ambiguity without starting LS-048 outcomes or backfill.

### Free public margin path
- TPEx's public Margin Transactions page remains official and states data availability since 2007/01.
- Current result HTML is machine-readable and includes full margin-long/margin-short columns.
- BIG5 and UTF-8 CSV download controls are publicly exposed.
- However a documented stable historical programmatic CSV parameter/endpoint contract is still not frozen.
- Therefore the free path is valid for manual official-artifact ingestion, but automated historical backfill still fails closed.

### Official EDIS S23 — STKDMARGIN.TXT
TPEx's current EDIS format contract explicitly defines:
- file code S23;
- file STKDMARGIN.TXT;
- daily individual-stock margin financing and margin short balances;
- 165-byte fixed records;
- long-margin previous balance, buy, sell, cash repayment, current balance, limit, utilization;
- margin-short equivalent fields;
- securities-finance-company portions and offsetting;
- balance/flow/limit units in thousand shares and utilization in percent.

The TPEx E-Data Shop lists this file inside the 上櫃股票統計資料 product group, with data start 2010-07-19 and observed price NT$10,000/month for internal or external use.

Decision:
TPEX_FULL_MARGIN_OFFICIAL_MACHINE_PATH = VERIFIED
but
TPEX_FULL_MARGIN_ACCESS = NOT_SUBSCRIBED / COST_GATED.

No purchase/subscription may be initiated autonomously.

### Official EDIS S47 — Margin_SBL.csv
The separate TPEx credit-data product:
- is produced daily at 22:00 Asia/Taipei;
- starts 2006-01-02;
- contains margin-short control balance plus actual SBL short-sale previous/current balance, sell, return, adjustment and next-business-day SBL-short limit;
- observed price = NT$1,000/month internal / NT$1,500/month external.

Important falsification:
S47 is useful for short-side/SBL history but does NOT replace S23 for long-margin-financing history.

### Governance decision
Source existence, access authorization and cost are three different states.
A paid official product must never be treated as automatically available merely because its schema is public.

Machine receipt:
research/leverage_shorting_ls048_authorized_source_paths_v0_1.json.

Status:
OFFICIAL_MACHINE_PATHS_VERIFIED / FREE_PROGRAMMATIC_HISTORY_UNRESOLVED / PAID_ACCESS_NOT_AUTHORIZED / COST_GUARD_ACTIVE / LS048_BACKFILL_NOT_STARTED / FORMAL_UNCHANGED.

## Exact next continuation after LS-047A
1. Keep LS-048 outcome-blind and blocked until an authorized official artifact or documented free stable endpoint is actually available.
2. Do not subscribe to S23/S47 or incur charges without owner approval.
3. If an official artifact becomes available through an authorized path, run the finalized-history pilot first with no return/outcome join.
4. Then run LS-049 completeness/revision/unit audit before H1-H5.
5. Do not let this source gate block the separate institutional-score decomposition observer lane.

## LS-047B / D06-18 — borrow economics（借券經濟）語意與 H12 去重完成（2026-10-03）

本輪沒有啟動 LS-048 歷史回填，也沒有讀 outcome（結果）。新增的是借券費率／可借性／使用率的機制與資料防火牆。

### Official semantics（官方語意）
- TWSE 借券交易分定價、競價、議借三類；費率形成機制不同，禁止直接把三類費率混成一條 scarcity score（稀缺分數）。
- 定價交易 FAQ 目前固定年利率 3.5%；競價與議借上限年利率 16%。
- 官方揭露可包含成交量／成交費率、未成交出借量、未成交借券量、最佳五檔數量／費率等，因此可以研究 displayed supply/demand（揭示供需）。
- TWSE 再次明確：借券成交不等於借券放空；借券可用於避險、套利、還券、履約。

### Availability / utilization firewall（可借量／使用率防火牆）
- 未成交出借量只能稱 displayed availability（揭示可借供給），不能稱 total lendable inventory（全市場總可借庫存）。
- 真正 utilization（使用率）需要 verified lendable inventory（已驗證可借庫存）作分母。
- 借券餘額、借券賣出餘額、借券賣出額度都不是合格的 lendable-inventory denominator（可借庫存分母）。
- 因此目前 `MARKET_WIDE_TRUE_UTILIZATION = UNKNOWN`，不得用偽分母硬算。

### H12 scope de-dup（範圍去重）
- D06-09 owns observed lending/short activity（已觀測借券／空方活動）。
- D06-18 owns borrow economics（借券成本／供需／可借性）。
- D14-19 consumes feasibility（消費執行可行性），只在必要空方部位事實上無法建立／維持時，才可能形成 strategy-specific hard invalidation（策略專屬硬否決）。
- D20-13 consumes limits-to-arbitrage context（套利限制情境），不得重複形成方向票。

Research artifact:
`research/d06_securities_lending_economics_h12_v0_1.md`.

Promotion decision:
D06-18 足以由 L0 升 L2「機制＋反證已定義」；仍不足 L3，因真正 utilization 分母、TPEx 對等借券經濟資料、prospective fee/supply receipt（前瞻費率／供給憑證）與 OOS（樣本外）仍未完成。

Room-05 H12 terminal recommendation:
`KEEP_ALL / SCOPE_DEDUP_ONLY / COUNTERPART_VALIDATION_REQUIRED_FROM_ROOMS_10_AND_13`.

LS-048 status remains blocked by the previously frozen authorized-source/cost gate. No paid subscription is authorized. Formal Core unchanged.

## LS-047C / D06-18 — borrow-fee identifiability, order-persistence asymmetry and 2026 settlement-vintage guard

### 1. 2026-06-01 payment/settlement rule break
- TWSE adjusted lending-related fee payment mechanics effective 2026-06-01.
- Outstanding positions moved to monthly fee calculation/payment; negotiated full/partial returns also moved to monthly centralized settlement.
- Fixed-price/competitive-bid early returns keep next-business-day payment.
- Therefore trade-time borrow rate, accrued fee, settlement date and payment date are separate objects.
- A daily paid-fee cashflow series spanning 2026-06-01 is structurally confounded unless the rule vintage is preserved.
- `DAILY_FEE_PAID = DAILY_SHORT_DEMAND` is rejected.

### 2. Borrow fee is not a pure short-demand measure
- Fee/rate can reflect demand, lendable supply, transaction type, search/friction, recall/tenor/collateral terms, benchmark ownership and market regime.
- External evidence is a falsification prior only, not a Taiwan-2026 effect-size transplant: high fees can coexist with supply constraints/search costs, and benchmarked institutional holdings can affect both lending supply and shorting demand.
- Historical Taiwan short-interest evidence remains relevant to actual short-position hypotheses, but it does not validate 2026 borrow-fee alpha by itself.

### 3. Public TWSE displayed supply/demand has asymmetric quote clocks
- Under TWSE SBL rules, borrowing quotes in fixed-price/competitive-bid transactions are valid only on the submission day.
- Lending quotes remain valid until cancelled.
- Therefore unexecuted borrowing quantity and unexecuted lending quantity do not share the same quote-age distribution.
- A raw `unexecutedBorrowQty / unexecutedLendQty` ratio must not be called symmetric demand/supply pressure.
- Recall-notification terms must also be preserved because matching requires compatible terms.

### 4. Public prospective source contract
- TWSE rules require Internet/computer disclosure of fixed-price rate, executed quantity, unexecuted lending quantity and unexecuted borrowing quantity.
- Competitive-bid disclosure includes executed rate/quantity and best-five lending/borrowing rate/quantity plus totals.
- Negotiated public disclosure is a loan-balance statement, not a comparable live rate book.
- Exact current machine endpoint contract remains not yet verified; next valid trading-day capture is still required.

Artifacts:
- `research/d06_18_borrow_fee_identifiability_rule_vintage_v0_1.md`
- `research/d06_18_public_sbl_rate_supply_contract_v0_1.json`
- `research/d06_ic039_receipt_product_matrix_v0_2.json`

Maturity decision:
- D06-18 remains L2 / 40%.
- This round improves semantic/PIT/rule-vintage quality but does not add prospective live receipts, verified total lendable inventory, TPEx parity or OOS evidence.
- LS-048 historical backfill cost/access gate remains unchanged.
- Formal Core unchanged.

## Exact next continuation after LS-047C
1. On the next valid trading day, capture an outcome-blind TWSE public rate/supply snapshot through an authorized public route.
2. Preserve transaction type, recall term, capturedAt/firstKnownAt, quote-persistence vintage and 2026-06-01 fee-settlement vintage.
3. Do not compute true utilization without verified total lendable inventory.
4. Do not infer direction from borrow fee or thin displayed supply alone.
5. Keep H12 counterpart validation pending Rooms 10/13.


## 00 control-plane receipt — H12 Room05 side accepted

00｜研究總控室 accepted the Room05 H12 evidence:
- `research/d06_securities_lending_economics_h12_v0_1.md`;
- `research/d06_18_borrow_fee_identifiability_rule_vintage_v0_1.md`.

Closed on the Room05 side:
- D06-09 primitive observed borrowing/short quantities;
- D06-18 fee / availability / supply-demand / scarcity economics;
- borrowing != shorting;
- one primitive receipt / no duplicate bearish votes;
- utilization requires verified lendable-inventory denominator;
- 2026-06-01 fee settlement/payment rule-vintage guard.

H12 remains partial pending Room10 D14-19 and Room13 D20-13.
Do not repeat the Room05 ownership research.


## 00 control-plane receipt — H06 closure

00｜研究總控室 closed H06:
KEEP_SEPARATE / BOUNDED_SOCIAL_HERDING_SUBLANE / SHARED_SOCIAL_RECEIPT_FIREWALL.

D06-06 remains canonical observable crowding owner.
D20-06 may own only independent behavior-specific social-herding evidence after structural controls.
Crowding cannot be relabeled as social proof.

D06-06 remains L3/60%.
No maturity/count/Formal change.

Audit:
shared-knowledge/CURRICULUM_H06_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md


## LS-047D / D06-18 — public SBL source-layer decomposition after the 2026-10-05 missing live slot

Durable contract: `research/d06_18_public_sbl_source_layer_contract_20261005_v0_1.json`.

The failed 2026-10-05 15:20 live capture is preserved exactly as UNKNOWN/MISSING. This research does not backfill it.

Official TWSE evidence now freezes four different evidence objects that must never be collapsed:
1. intraday quote book — fixed/competitive displayed lend/borrow quantities and rates, including best five where applicable;
2. executed borrow rate — transaction type, executed quantity and fee rate;
3. end-of-day SBL balance — previous/current balance, borrowing and returns;
4. verified total lendable inventory — still UNKNOWN and required before true utilization can be computed.

TWSE rules require public Internet/computer disclosure of the first layer, while public historical transaction and balance pages expose query/CSV interfaces for replay-oriented layers. TWT72U is documented at 20:30 with balance fields. None of these balance fields prove live quote depth or total lendable inventory.

Forbidden conversions are frozen in the machine contract, including balance->quote book, executed fee->directional conviction, displayed lend quantity->total inventory, SBL volume->short-sale volume and any utilization ratio with an unverified denominator.

Maturity impact: NONE. D06-18 remains L2/40%. Source-layer clarity improved, but today's live receipt is still missing and true utilization is still unidentified.

Exact next: preserve today's missing slot; continue only authorized discovery of a stable public/machine live quote representation for a future date. Historical execution/balance replay may progress separately but cannot substitute for the live layer.


## LS-047E / D06-07~09 — 2026-10-05 TPEx EARLY slot preserved as UNKNOWN/MISSING

Durable receipt: `research/d06_07_08_09_tpex_leverage_early_20261005_v0_1.json`.

At 2026-10-05T20:33:21+08:00 the official TPEx margin and borrowed-stock short-sale pages were reachable and exposed the validated field headers, but the same-day stock rows were not available through the verified free machine representation used in this research lane.

Frozen state:
- EARLY 20:30 = UNKNOWN/MISSING;
- no zero imputation;
- no later backfill into EARLY;
- undocumented endpoint guessing remains forbidden;
- source existence remains verified, while point-in-time machine row access at this slot is not.

No D06-07/08/09 promotion follows. LATE 22:30 remains the exact next paired capture. Outcomes and Formal remain closed.


## LS-047F / D06-07~09 — 2026-10-05 LATE captured; universe and unit guards frozen

Durable evidence:
- `research/d06_07_08_09_tpex_leverage_late_20261005_v0_1.json`;
- `research/d06_07_08_tpex_margin_late_snapshot_20261005_2340_v0_1.csv`;
- `research/d06_08_09_tpex_sbl_late_snapshot_20261005_2340_v0_1.csv`;
- `research/d06_07_08_09_tpex_leverage_late_stability_20261005_v0_1.json`;
- `research/d06_08_09_tpex_margin_sbl_universe_guard_20261005_v0_1.json`.

LATE source integrity:
- margin table 918 rows; financing arithmetic 918/918; margin-short arithmetic 918/918;
- SBL table 931 rows; margin-short arithmetic 931/931; actual-SBL-short arithmetic 931/931;
- both snapshots repeat-stable on the same evening.

EARLY remains UNKNOWN/MISSING. No late-to-early backfill is permitted, so 2026-10-05 revision magnitude is not identifiable.

Cross-table unit audit:
- five margin-short balance/flow fields match 918/918 after lots x1000 to shares;
- limit field uses whole-lot display precision on the margin page and exact-share precision on SBL; floor(shares/1000) matches displayed lots 918/918.

Universe guard:
- SBL has 13 Y/not-credit-qualified rows absent from the margin table;
- all 13 have nonzero SBL-short balance; 5 have same-day SBL sell and 7 have same-day sell/return/adjustment activity;
- therefore D06-09 must not inherit the D06-08 margin-eligible denominator.

Maturity:
D06-07/08/09 remain L2/40. The source/replay gate is stronger but the preregistered paired EARLY/LATE revision requirement remains incomplete.

### Exact next continuation after LS-047F
1. Next genuine trading date, capture EARLY near 20:30 and LATE near 22:30 through the exact same official pages/parser.
2. Preserve source-native units and limit precision; never convert share-limit remainders into false source conflicts.
3. Maintain separate D06-08 margin-eligible and D06-09 SBL universes.
4. Only if both vintages exist, compute revision deltas on union and common support.
5. No outcomes or Formal change until later validation gates.


## LS-047G / D06-18 — 2026-10-06 live-route preflight clears route uncertainty before the 15:20 slot

Durable evidence:
- `research/d06_18_twse_sbl_live_route_preflight_20261006_v0_1.json`;
- `research/d06_18_twse_sbl_live_field_schema_v0_1.json`.

Official TWSE rendered route now physically supports security selection through `?ch=<symbol>`.
`?ch=2330&lang=zhHant` rendered 台積電(2330) and the required securities-lending rate/depth fields.

A deterministic five-symbol source-route pilot was frozen before the target slot:
`1101 / 2451 / 3532 / 6187 / 9941`.

All five route checks matched the selected security and exposed the expected field labels.

The pilot is not a cross-sectional market sample and carries no alpha interpretation. It exists only to prove and execute the source route at the frozen 15:20 slot.

Field schema is frozen:
- fixed-rate versus competitive-bid versus negotiated transaction families stay separate;
- 10/3/1-day recall-notice states stay separate;
- dash remains NULL, not zero;
- displayed lend quantity is not total lendable inventory;
- borrowing/fee/depth do not identify bearish motive.

The 2026-10-05 missing 15:20 receipt remains immutable UNKNOWN/MISSING.

D06-18 remains L2/40.
Exact next: at 2026-10-06 15:20 ±5m, capture exactly the frozen five symbols through the same route and preserve source date, transaction type, recall state, rate/depth values, capturedAt and hash.


## LS-047H / D06-18 — 2026-10-06 post-close query executed; frozen 15:20 slot remains missed

Durable receipt:
`research/d06_18_twse_sbl_postclose_query_20261006_v0_1.json`.

At 19:10-19:15 Asia/Taipei, after TWSE SBL service hours, the frozen five-symbol source-route pilot was queried through the official rendered security selector.

All five selected identities matched:
1101 台泥 / 2451 創見 / 3532 台勝科 / 6187 萬潤 / 9941 裕融.

Rendered state:
- fixed-rate 10/3/1-day sections: totalQty 0, rate/depth fields NULL for all five;
- competitive-bid 10/3/1-day sections: totalQty 0, rate/depth fields NULL for all five;
- negotiated:
  - 1101: matchTime 15:01:09.76, totalQty 7000;
  - 2451: 15:01:32.23, totalQty 1450;
  - 3532: 11:45:32.02, totalQty 44;
  - 6187: 14:24:39.33, totalQty 40;
  - 9941: no match time, totalQty 0.

Critical timing guard:
this was outside the preregistered 15:20±5m slot. The 15:20 slot is therefore MISSED/UNKNOWN and is not backfilled from the 19:10 post-close page.

The rendered security pages also did not explicitly certify a source/trade date, so the observed values are not admitted as date-certified 2026-10-06 live evidence.

Interpretation remains bounded:
- negotiated lending quantity != short-sale volume;
- lending quantity/rate != bearish conviction;
- NULL != zero;
- five-symbol pilot != market representation.

D06-18 remains L2/40. No promotion, no outcomes, no Formal change.


## LS-047I / D06-07~09 — 2026-10-06 EARLY captured
- EARLY receipt: `research/d06_07_08_09_tpex_leverage_early_20261006_v0_1.json`.
- Margin snapshot: 918 rows; financing 918/918; margin-short 918/918.
- SBL snapshot: 931 rows; margin-short 931/931; actual-SBL-short 931/931.
- Cross-source unit audit: 918/918 five flow/balance fields match after lots x1000; limit floor rule 918/918.
- The same 13 Y/not-credit-qualified SBL-only symbols persist from 2026-10-05; all 13 again have nonzero SBL-short balance.
- D06-08 and D06-09 must keep separate denominators.
- D06-07/08/09 remain L2/40.
- Exact next: after 22:30 capture identical LATE sources and compare EARLY->LATE on union and common support. Outcomes/Formal closed.


## LS-047I / D06-07~09 — paired EARLY/LATE gate PASS; promote to L3 source/PIT feasibility

Durable decision:
`research/d06_07_08_09_tpex_paired_vintage_l3_decision_20261006_v0_1.json`.

2026-10-06 provided the first complete same-date prospective EARLY/LATE pair:
- EARLY 21:25:30;
- LATE 22:30:34;
- margin 918 rows both vintages;
- SBL 931 rows both vintages;
- all balance arithmetic passes.

Revision:
- margin: 0/918 rows changed;
- SBL: 1/931 rows changed;
- 4527 方土霖 only:
  - next-day SBL short limit 0 -> 7,044;
  - note V -> blank;
  - all current-day SBL flow/balance fields unchanged.
- official V semantics = no securities-lending transaction and no lending balance / suspend lending short sale.

Interpretation:
the later update changed next-business-day eligibility/limit state rather than today's SBL flow.

PassGate now clears for source/PIT/replay:
- D06-07 -> L3/60;
- D06-08 -> L3/60;
- D06-09 -> L3/60.

No outcome or Formal evidence is implied.

### Exact next
Continue multi-date EARLY/LATE captures for revision-frequency stability.
L4 requires OOS/Shadow residual incrementality, not more source existence evidence.


## LS-047J / D06-18 — 2026-10-07 genuine in-slot TWSE live receipt; bounded L3 promotion

Durable receipt: `research/d06_18_twse_sbl_live_slot_20261007_v0_1.json`.

The frozen 15:20 ±5m source contract was finally executed inside the allowed window on 2026-10-07. Capture window was 15:15:02-15:21:05 Asia/Taipei. All five frozen securities matched the requested identities and the official rendered page visibly showed 2026-10-07.

Observed source state:
- 1101 台泥: fixed/competitive 10/3/1-day states zero/NULL; negotiated 12:48:01.97 / 11,234.
- 2451 創見: fixed/competitive 10/3/1-day states zero/NULL; negotiated 14:47:28.05 / 211.
- 3532 台勝科: competitive-bid 3-day recall matched 14:57:19.04, total/latest qty 13, latest fee 4.00%, displayed lend/borrow qty 0/0; negotiated 11:57:52.97 / 12.
- 6187 萬潤: fixed/competitive zero/NULL; negotiated 0.
- 9941 裕融: fixed/competitive zero/NULL; negotiated 0.

This is the first post-contract live TWSE rate/supply receipt that is both in-slot and source-date-certified. The prior 2026-10-05 missing slot and 2026-10-06 missed/post-close observations remain immutable historical records and are not rewritten.

D06-18 promotes L2/40 -> L3/60 for bounded TWSE PIT/source feasibility only. TRUE_UTILIZATION remains prohibited because total lendable inventory is still unverified. Cross-market parity and predictive outcome evidence remain absent.

### Exact next
1. Accumulate independent in-slot trading dates without changing the frozen pilot after seeing outcomes.
2. Preserve transaction family, recall term, rule vintage and NULL-vs-zero semantics.
3. Seek naturally occurring positive displayed depth; never select symbols after inspecting the desired state.
4. L4 requires preregistered OOS/Shadow residual incrementality and D16 validation.
5. True utilization remains UNKNOWN until a verified total-lendable-inventory denominator exists.
