# D12-10 same-venue control eligibility audit

Updated: 2026-09-30 Asia/Taipei
Status: OUTCOME_BLIND_NEGATIVE_EVIDENCE / NO_PROMOTION
Formal Core impact: NONE

## Finding

Same-venue status does not establish control eligibility. Official TAIFEX daily-session evidence shows large cross-instrument and contract-month activity dispersion. UDF is a liquidity challenger to SPF, but full-session volume cannot prove 15:00-18:10 freshness. UNF/SXF remain UNKNOWN until timestamped same-window replay exists.

## Evidence

- SPF 202612 on 2026-09-29: after-hours volume 1, all-day volume 2, OI 88.
- UDF trading-date 2026-09-30 / source-session 2026-09-29: 202612 after-hours volume 646 and 202703 volume 582.
- TX trading-date 2026-09-30 / source-session 2026-09-29: 202610 after-hours volume 29,632.
- These are full-session activity observations only, not NIGHT_PRE_SCAN coverage proof.

## Guards

1. Keep sourceSessionDate separate from tradingDate.
2. Full-session volume is only a coarse activity screen.
3. Instrument eligibility and contract eligibility are separate.
4. Contract selection must be frozen PIT-safely before outcome joins; do not pick the ex-post daily volume winner.
5. UNF/SXF stay UNKNOWN until exact 15:00-18:10 timestamp coverage is measured.
6. Market-maker obligations do not prove continuous executable liquidity.

## Maturity

D12-10 remains L2 / 40%. FORMAL_OPTIMIZATION_CANDIDATE = NO.

## Exact next continuation

Replay recent TAIFEX individual trades for UDF/SPF/UNF/SXF by sourceSessionDate and exact 15:00-18:10 timestamps with outcomes closed. Measure trade count, first/last timestamp, maximum inter-trade gap, stale age at 18:10, zero-trade incidence, contract month, DTE and roll state. Freeze instrument/contract eligibility before any Taiwan outcome join.
