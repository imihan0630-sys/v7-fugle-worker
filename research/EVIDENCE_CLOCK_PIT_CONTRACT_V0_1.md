# Evidence Clock / Point-in-Time Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / CLOCK_SEMANTICS_FROZEN
Formal Core: LOCKED

## Purpose

Prevent one generic "as-of date" field from collapsing different evidence clocks.

## TI-499 — Evidence state time is not always a date

Examples:

Daily Technical Indicator:
represents one trading session.

Intraday evidence:
represents an exact instant.

Monthly revenue:
represents a calendar month.

Quarterly evidence:
may represent a quarter.

Therefore generic evidence identity uses:

- as_of_kind;
- as_of_key.

Frozen v0.1 kinds:
- SESSION_DATE;
- INSTANT;
- CALENDAR_MONTH;
- CALENDAR_QUARTER.

Unknown/new time kinds require a contract-version change.
Do not silently stuff arbitrary period labels into SESSION_DATE.

## TI-500 — Canonical as_of_key

SESSION_DATE:
YYYY-MM-DD.

INSTANT:
UTC ISO-8601 millisecond form:
YYYY-MM-DDTHH:mm:ss.sssZ.

CALENDAR_MONTH:
YYYY-MM.

CALENDAR_QUARTER:
YYYY-Q1 .. YYYY-Q4.

The family semantic contract decides which kind applies.

## TI-501 — available_at needs precision

Source availability may be known at different precision.

available_at_precision:

INSTANT
- exact offset-aware timestamp known;
- canonicalize to UTC milliseconds.

DATE_ONLY
- only publication/availability date known;
- store YYYY-MM-DD.

UNKNOWN
- exact/date availability not established;
- available_at = null.

Do not invent 00:00 or 23:59 for DATE_ONLY.

## TI-502 — Same-day date-only availability cannot prove PIT eligibility

If decision cutoff is on 2026-09-10
and source availability is only known as 2026-09-10:

the source may have appeared:
- before the decision;
- after the decision.

Therefore:
PIT state = UNKNOWN
unless another source proves a before-cutoff instant.

For DATE_ONLY:

available date < decision local date
=> eligible for later-day decision.

available date > decision local date
=> not yet available.

available date == decision local date
=> UNKNOWN for same-day cutoff.

This rule is conservative and prevents look-ahead.

## TI-503 — captured_at and created_at remain separate

captured_at:
when the collector actually observed/froze evidence.

created_at:
when persistence wrote the row.

Neither proves:
when the public/source information first became available.

PIT validity comes from available_at and its provenance.

## TI-504 — Point-in-time state

Generic:
VALID
- source availability is positively established before decision cutoff.

BLOCKED
- source is positively established as unavailable until after cutoff.

UNKNOWN
- timing evidence insufficient, including same-day DATE_ONLY ambiguity.

No UNKNOWN -> VALID coercion.

## TI-505 — Evidence identity clock

Generic evidence receipt identity includes:
- as_of_kind;
- as_of_key.

available_at/captured_at are provenance payload,
not the primary identity of what state the evidence describes.

If the same evidence state is recaptured later:
the original first-known immutable child must not be overwritten.

If a genuinely new source vintage/revision is required:
use a versioned evidence item/source receipt contract rather than mutating old evidence.

## Current status

EVIDENCE_CLOCK_KINDS = FROZEN_V0_1
AVAILABLE_AT_PRECISION = FROZEN_V0_1
SAME_DAY_DATE_ONLY_PIT = UNKNOWN
GENERIC_CHILD_CLOCK_SCHEMA = V0_6
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.
