# D04 session-clock addendum — 2026-10-16

D04-03, D04-04 and D04-07 cannot use same-day completed daily OHLC as an input to a 13:00 D05 decision. TWSE normal close is 13:30 and the source receipt may be later. Previous-session daily bars may be valid if independently time-verified.

The C3 scheduled capture ends at 13:00; no 13:25–13:30 closing-auction point is scheduled. This is not evidence of missing data in other sources.

Research-only contract tests: 40 passed, 0 failed. Genuine L4 parents remain UNKNOWN; maturity D04 58.0%, D05 54.3% unchanged. Formal Core locked.

Next: frozen-parent coverage and first-known time audit, then D16 dependence review before any outcomes.
