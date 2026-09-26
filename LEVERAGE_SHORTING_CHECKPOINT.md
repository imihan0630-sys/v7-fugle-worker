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
