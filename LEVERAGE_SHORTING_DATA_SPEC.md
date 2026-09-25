# Leverage & Shorting Offline Historical Data Specification

Updated: 2026-09-25 Asia/Taipei
Status: RESEARCH_ONLY / OFFLINE_SPEC
Formal Core: LOCKED
Related checkpoint: LEVERAGE_SHORTING_CHECKPOINT.md
Research cursor: LS-041

## 1. Purpose

Build a reproducible finalized-daily research dataset for Taiwan margin and actual SBL short-sale history before any large backfill or outcome testing.

This specification does NOT authorize:
- production Worker changes;
- new Formal factors;
- historical first-known-time reconstruction;
- same-day 23:35 availability claims;
- BUY/ADD/REDUCE/SELL/stop/capital changes.

## 2. Data-grain contract

Primary grain:
`market + trade_date + symbol`

One normalized row may contain:
- margin-long fields;
- margin-short fields;
- actual borrowed-stock short-sale fields;
- quota/restriction state;
- provenance and data-quality state.

Do not duplicate one symbol-day into separate “margin” and “SBL” rows unless the source cannot be joined without loss.

## 3. Source families

### TWSE margin
Official report family: MI_MARGN
Use exact-date official historical query.

Current V8 helper already maps:
- 融資買進 -> margin_buy
- 融資賣出 -> margin_sell
- 融資前日餘額 / 前日餘額 -> margin_prev_balance_reported
- 融資今日餘額 / 今日餘額 -> margin_today_balance_preliminary
- 融券買進 -> margin_short_cover
- 融券賣出 -> margin_short_sale
- 融券前日餘額 -> margin_short_prev_balance_reported
- 融券今日餘額 -> margin_short_today_balance_preliminary

Additional fields to preserve when source schema confirms:
- 現金償還 -> margin_cash_redemption
- 現券償還 -> margin_short_stock_redemption
- 次一營業日融資限額 -> margin_next_quota
- 次一營業日融券限額 -> margin_short_next_quota
- 資券互抵 -> margin_short_offset
- 備註 -> margin_note_raw

### TWSE actual SBL short sale
Official report family: TWT93U

Current V8 helper already maps positions corresponding to:
- previous SBL-short balance -> sbl_short_prev_balance
- current SBL short sale -> sbl_short_sale
- current return -> sbl_short_return
- adjustment -> sbl_short_adjust
- current SBL-short balance -> sbl_short_balance
- next-session limit -> sbl_short_next_limit

Also preserve:
- source note / restriction marker -> sbl_note_raw
- formula/regime version -> sbl_formula_regime

Never substitute generic securities borrowing for actual borrowed-stock short sale.

### TPEx margin
Official historical source family exists.

Mapping rule:
Do not finalize machine-field mapping until a small source sample is validated against the official displayed labels.

Target normalized concepts:
- margin_buy
- margin_sell
- margin_cash_redemption
- margin_prev_balance_reported
- margin_today_balance_preliminary
- margin_next_quota
- margin_short_cover
- margin_short_sale
- margin_short_stock_redemption
- margin_short_prev_balance_reported
- margin_short_today_balance_preliminary
- margin_short_next_quota
- margin_short_offset
- margin_note_raw

Until validated:
`tpex_margin_schema_status = UNRESOLVED_FIELD_CONTRACT`.

### TPEx actual SBL short sale
Official historical SBL balance source exists.

Target normalized concepts mirror TWSE:
- sbl_short_prev_balance
- sbl_short_sale
- sbl_short_return
- sbl_short_adjust
- sbl_short_balance
- sbl_short_next_limit
- sbl_note_raw

Until validated:
`tpex_sbl_schema_status = UNRESOLVED_FIELD_CONTRACT`.

## 4. Vintage/finality contract

For trade date T, do not collapse same-evening and finalized balances.

Fields:
- margin_today_balance_preliminary
- margin_short_today_balance_preliminary
- preliminary_captured_at
- margin_balance_final
- margin_short_balance_final
- finalized_known_at
- margin_revision
- margin_short_revision

Finalization logic:
- final balance for T is sourced from the next official trading session's reported previous balance, after calendar validation;
- next session means official trading session, not calendar T+1;
- if next-session source is missing, final remains UNKNOWN.

Historical official backfill:
- may populate `*_balance_final` when exact-date historical source is validated;
- may populate `historical_final_only = true`;
- must NOT fabricate `preliminary_captured_at` or `source_observed_before_decision`.

## 5. Units

Every source field must carry verified unit metadata:
- shares;
- trading units/lots;
- NTD;
- ratio/percent.

No silent ×1000 conversion.

Normalized storage fields:
- raw_value
- raw_unit
- normalized_value
- normalized_unit
- unit_rule_version

If source unit is ambiguous:
- quality_state = UNIT_UNRESOLVED
- derived features = UNKNOWN.

## 6. Source-date integrity

Required:
- source_market_date == requested_trade_date for exact-date daily flows;
- no future dates;
- no duplicate symbol/date rows;
- symbol format validated per market;
- source schema hash/version retained.

If date mismatch:
`quality_state = DATE_MISMATCH`
and row cannot enter rolling features.

## 7. Formula consistency checks

### SBL
When all components are present:
`balance_expected = prev_balance + short_sale - short_return + adjustment`

Difference must be zero within verified unit/rounding semantics.

If not:
`quality_state = SBL_FORMULA_MISMATCH`.

### Margin long / margin short
Do not invent a balance equation until all official flow fields and signs are validated.
Cash/stock redemptions and offset fields can make simplified equations incomplete.

## 8. Historical regime metadata

At minimum:
- sbl_formula_regime
- short_sale_price_rule_regime
- sbl_daily_limit_regime
- continuous_trading_regime
- odd_lot_regime
- market
- source_schema_regime

Known anchors from LS-035 must be stored in a versioned rule table, not copied into feature formulas.

## 9. Normalized research features v0.1

Only after COMPLETE_FINAL history:

- ls_margin_level_adv20
- ls_margin_flow_daily_volume
- ls_margin_own_history_pct
- ls_margin_short_level_adv20
- ls_sbl_short_flow_daily_volume
- ls_sbl_short_level_adv20
- ls_sbl_return_rate
- ls_quota_constraint_state
- ls_balance_quality_state
- ls_crowding_state

All feature values need:
- as_of_date
- lookback_sessions
- valid_session_count
- denominator_provenance
- regime_version
- quality_state

No forward fill.

## 10. Denominator contract

Preferred v0.1:
- same-day official trading volume;
- prior completed 20-session ADV;
- own-history robust percentile;
- official quota/limit when semantics are verified.

Deferred:
- free-float normalization;
- market-cap normalization;
until point-in-time share/cap data are verified.

Issued shares must not be called free float.

## 11. Completeness states

- COMPLETE_FINAL
- COMPLETE_PRELIMINARY_ONLY
- PARTIAL_SOURCE
- DATE_MISMATCH
- UNIT_UNRESOLVED
- SCHEMA_CHANGED
- SBL_FORMULA_MISMATCH
- MISSING_SYMBOL
- PROVIDER_UNAVAILABLE
- REGIME_UNRESOLVED
- UNKNOWN

Missing/invalid never becomes 0.

## 12. LS-042 validation sample before backfill

Before large history ingestion, validate a small fixed sample:

Dates:
- one ordinary recent session;
- one session adjacent to a weekend/holiday;
- one high-volume/stress session;
- one date before/after a known rule breakpoint only if the source supports that range.

Symbols:
- liquid large-cap TWSE;
- high-priced TWSE;
- low/mid-liquidity TWSE;
- liquid TPEx;
- at least one symbol with margin/short restriction note if available.

Validation checks:
1. exact date;
2. exact symbol;
3. field labels;
4. unit;
5. source formula;
6. source coverage;
7. preliminary/final semantics;
8. restriction/note preservation;
9. no duplicate rows;
10. raw-source reproducibility.

No outcome/return comparison is allowed during schema validation.

## 13. Backfill go/no-go gate

GO only if:
- TWSE margin schema validated;
- TWSE SBL schema validated;
- TPEx margin schema validated;
- TPEx SBL schema validated;
- units resolved;
- date integrity passes;
- regime metadata attached;
- sample formula checks pass;
- missingness semantics frozen.

Otherwise:
`DATA_BUILD_BLOCKED`.

## Exact continuation

LS-042: execute the fixed small multi-date/source validation without reading outcome performance.
LS-043: if schema validation passes, prepare independent-date finalized-history evidence collection.
