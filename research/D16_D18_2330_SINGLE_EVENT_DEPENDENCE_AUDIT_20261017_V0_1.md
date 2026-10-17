# Room11 D16/D18 — 2330 single-event dependence audit
Date: 2026-10-17 Asia/Taipei. Research-only; Formal Core LOCKED.

## Source
Latest main source-only 61-session 2330 window evidence:
- system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json
- system2/migration/issue1068_pita_2330_native_ca_window_exposure_v0_1.mjs
- system2/tests/issue1068_pita_2330_native_ca_window_exposure_v0_1.test.mjs

Known 2026-09-15 to 09-16 ex-dividend raw-price boundary is at indices 40->41 of 61 sessions (2026-07-21..2026-10-16). 19 later sessions. Independent index/window audit: 15/15 deterministic invariants passed; no provider-byte independent audit.

## Finding
Five of nine declared input windows cross this one known raw-price boundary: PRIOR_20_CLOSE_PRICE; CURRENT_60_CLOSE_PRICE; PRIOR_60_HIGH_LOW; CURRENT_20_PRIOR_CLOSE_RETURN; CURRENT_60_PRIOR_CLOSE_RETURN.
CURRENT_20_CLOSE_PRICE and CURRENT_1D_CLOSE_RETURN do not cross THIS event; neither is a certified NO_EVENT row. Two other fields are non-price volume/turnover windows, with separate continuity unknowns.

D16: five exposed feature rows have one shared known event root, NOT five independent observations. A naive five-vote statistical significance claim would be pseudoreplication. No outcome or effect-size inference is authorized.
D18: one issuer and one cut cannot establish market-wide breadth/regime. Lack of this known crossing is not official negative corporate-action/suspension evidence.

Support: exact event boundary and windows pinned in source-only receipts.
Counterevidence: adjusted OHLC continuity and all-other-events absence remain unverified.
Alternative: declared raw-price strategies may intentionally include ex-dividend gaps, but cannot call them event-neutral return.
Failure: duplicate-root votes, UNKNOWN->NO_EVENT, retroactive September first-known, one-symbol market-state inference.

## Exact next continuation
Check latest main for first independently audited hash-bound CLEAR_NO_ACTION stock-date pair and full ordinary-equity population; then run D18_U2B_ROW/DATE_AGGREGATE RB-T01..T16. For D16-20, obtain real official treatment and same-clock controls/pre-treatment covariates/positivity. If still blocked, continue D16-17 immutable historical membership or D16-25 canonical stock-return calibration. No maturity promotion or Formal changes.
