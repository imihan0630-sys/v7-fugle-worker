# D03 same-session daily-bar cutoff falsification v0.1

Updated: 2026-09-29 Asia/Taipei. Status: RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_LOCKED.

## Hypothesis and distinct negative witness

A complete daily OHLC bar is not available merely because its trade date equals the decision date. The TWSE regular matching session runs 09:00–13:30 Taipei time (official source: https://www.twse.com.tw/en/products/system/trading.html). Even after the session ends, actual dissemination and local capture of the final source version need their own evidence. This is a logical source-timing requirement, not a claim that a provider or production Worker leaked future data.

`test_technical_indicator_same_session_bar_falsification_v0_1.mjs` builds 50 synthetic bars ending 2026-02-19 and sets `asOf` to 09:00 Taipei on that same date. The window-level `sourceAvailableAt` remains 16:00 on the previous date. Two alternative final-bar high values and corresponding asserted raw IDs/digests both return `VALID` from the isolated guard, with different KD. The guard's final check is `lastBar.date > asOf.slice(0,10)`; equality passes without checking a completed-bar availability clock for that date. Thus a future full-day range can be replayed at a pre-completion decision. This is TI-411, separate from TI-409's unbound digest and TI-410's later revision of an older bar.

The fixture's session and observed-field labels are self-asserted. It does not prove that 2026-02-19 was an actual eligible session, that either hypothetical range occurred, or that a live adapter uses this guard. It proves the isolated guard does not reject the constructed same-date future bar. Any intraday partial bar would require its own explicitly versioned as-of semantics and cannot silently stand in for a final daily bar.

## Correct boundary and counterargument

Do not ban every same-date input. An after-market decision may legitimately use that day's final daily bar after its source version has been published and captured. A real-time strategy may also use a partial intraday bar if its interval, completeness state and first-known time are declared; it is a different feature contract. For an end-of-day daily window, the upstream owner must attest symbol/session identity, bar interval end and completion, per-version publication/first-known/capture clocks, and exact raw/derived row-version ancestry. Each version's availability must precede the decision cutoff. A simple hardcoded 13:30 rule is insufficient for delayed closes, alternative venues, corrections and late publication. An uncertified clock is `UNKNOWN`, not zero or `BAD`.

## Inference and next evidence

The positive mechanism is removing future daily-range contamination from KD and other derived indicators. Counterevidence is possible coverage loss if legitimate same-day after-market rows lack trustworthy clocks; quantify rejections by provider, date, market, symbol, session state and corporate-action boundary before any inference. No real-source denominator, selection outcome, OOS (樣本外), Walk-forward (滾動前推), costs, fill data or incremental value over direct price and System 1/System 2 factors is available. Because this is a source QA falsifier rather than a trading rule, no indicator threshold search, return test or maturity increase follows. Formal Core remains LOCKED; no optimization candidate.

Next: merge TI-409/410/411 into one versioned upstream receipt requirement, obtain permissioned outcome-blind raw field/version and session-clock samples, measure rejection/UNKNOWN rates and exact immutable parent-child keyset/cost. Only then consider Class-B prospective capture; TI-005 and TI-006 remain blocked.
