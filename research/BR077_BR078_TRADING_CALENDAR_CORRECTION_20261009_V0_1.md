# BR-077 / BR-078 Trading-Calendar Correction — 2026-10-09

Status: APPEND_ONLY_CORRECTION / SOURCE_CLOCK_REPAIRED / OUTCOMES_REMAIN_CLOSED / FORMAL_CORE_UNCHANGED
Observed main: e381dc956443515fd09dd7ea91016da133b6ea21

Official TWSE 2026 market calendar confirms 2026-10-09 is a market holiday because National Day falls on Saturday 2026-10-10 and Friday 2026-10-09 is the compensatory holiday.

Correction:
- BR-077 wording that treated 2026-10-09 as a regular next-session close is incorrect.
- BR-078 next-session market date 2026-10-09 is incorrect.
- The next eligible regular Taiwan session after 2026-10-08 is 2026-10-12.

Impact:
- No 2026-10-09 market outcome exists.
- BR-077 and BR-078 remain outcome-blind.
- Their first next-session D1 endpoint is not mature until the 2026-10-12 close.
- No 2026-10-08 state/rank/size-return observation is changed.
- No maturity promotion or Formal change results from this correction.

Permanent rule: HOLIDAY_CALENDAR_IS_PART_OF_OUTCOME_CLOCK_SEMANTICS.

Formal Core unchanged.
