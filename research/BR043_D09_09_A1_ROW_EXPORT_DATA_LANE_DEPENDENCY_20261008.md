# BR-043 D09-09 Read-Only A1 Row Export DATA_LANE Dependency — 2026-10-08

Status: CROSS_LANE_DEPENDENCY_REQUEST / READ_ONLY / NO_DB_MUTATION / FORMAL_CORE_UNCHANGED
Requester: 07｜產業與供應鏈研究室
Consumer: D09-09 橫截面報酬離散度
Owner: System2 DATA_LANE
Parent: research/BR043_D09_09_LIVE_SECTOR_DISPERSION_ROW_ACCESS_READINESS_20261008_V0_1.md
Observed main before write: f629847e97814b0e326d887d03ceb174fd4632f1

## Requested export

Return a read-only immutable artifact for marketDate 2026-10-07 from `s2_historical_a1_bars`.

Required A1 fields, using existing canonical column semantics only:
- market;
- symbol;
- company_name when stored;
- market_date;
- close_price;
- change / prior-close-compatible daily-return input if stored;
- trade_value;
- availability_basis;
- available_at;
- observed_at;
- source_id;
- source_row_hash / bar_hash;
- price_space;
- continuity_state;
- pit_replay_eligible.

If daily percentage return is not physically stored, export only raw canonical fields needed to derive it without changing row semantics. Do not synthesize from an unrelated price series.

## B5 companion receipt

Return the same-observation current listing-metadata receipt or export sufficient for symbol->industry join:
- market;
- symbol;
- industry;
- listingDate;
- observedAt;
- metadataHash;
- source IDs.

Current classification may be used only for the live/current receipt. It must not be backfilled into prior dates.

## Integrity requirements

- query is read-only;
- exact query text or query contract preserved;
- row count by market preserved;
- unique market|symbol coverage reported;
- duplicate/revision handling explicit;
- artifact SHA-256/digest preserved;
- no D1 write, deploy, schema mutation, selection, capacity, push or order effect.

Expected 2026-10-07 denominator lineage:
- TWSE persisted/readback = 1,086;
- TPEx persisted/readback = 887;
- total = 1,973.

A difference is not auto-failure if immutable revisions make multiple physical rows per symbol; classify and return the reason rather than deduplicating silently.

## Room07 use

Room07 will perform the frozen BR-043 CSSD/CSAD/IQR/MAD/trade-value-leader-removal calculation and own the research interpretation.

DATA_LANE is not asked to calculate or optimize the dispersion factor.

Formal Core unchanged.
