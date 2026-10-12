# D03 observed-zero versus missing-telemetry semantics — 2026-10-12

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED.

## Trigger and question

Merge `10c1a7c9f165c6ed2a7d2d0434813f538a4d7525` corrects destination quota telemetry so an empty current-UTC-day GraphQL group is `EMPTY_UNOBSERVED`, not zero usage. System2 CI Run 38192097094 passes 17/17 and V8 CI Run 38192096876 passes. No physical destination quota read or import grant is created by that merge.

D03 generalizes the same causal rule: when an expected market observation is absent, may a technical indicator use numeric zero, carry-forward state, “no signal,” or a shortened denominator?

Answer: no, unless a separately typed and preregistered rule proves that the observation is structurally not applicable. Numeric zero is data and requires positive observation evidence.

## Typed input states

Every symbol-session-field input must resolve to exactly one of:

1. `OBSERVED_VALUE`: provider/source row exists, version is selected, clocks and lineage are admissible; value may be nonzero.
2. `OBSERVED_ZERO`: the row exists and the field is exactly zero under valid market semantics.
3. `OBSERVED_FLAT`: both required prices exist and are equal; the derived price change is zero.
4. `NOT_APPLICABLE_NONSESSION`: the date is authoritatively not an eligible session for this symbol/market.
5. `NOT_YET_PUBLISHED`: the observation is expected but not causally available at the cutoff.
6. `MISSING_EXPECTED_SESSION`: an eligible session is expected but no selected row exists.
7. `MULTIPLE_VERSION_UNRESOLVED`: more than one admissible candidate remains without a deterministic version policy.
8. `SOURCE_CONFLICT`: authoritative sources disagree beyond the frozen reconciliation policy.
9. `POLICY_EXCLUDED`: a row exists but is excluded by a preregistered data-quality policy, with reason preserved.

Only states 1–3 may supply a numeric input. State 4 is excluded from the expected-session set and must not add a zero. States 5–9 propagate a typed block/UNKNOWN unless an indicator-specific replay-certified policy says otherwise.

## Output states

Indicator results must distinguish:

- `VALID_NONZERO`;
- `VALID_ZERO`;
- `WARMUP_INCOMPLETE`;
- `DATA_UNKNOWN`;
- `VERSION_CONFLICT_BLOCKED`;
- `NOT_APPLICABLE`;
- `POLICY_EXCLUDED_WITH_REASON`.

“No bullish/bearish signal” is permitted only after a valid indicator value is computed. A blocked computation is not a neutral signal.

## Module-specific consequences

### Direct returns and ROC

If either endpoint close is missing or late, ret5/20/60 and ROC are `DATA_UNKNOWN`, not zero. `OBSERVED_FLAT` yields a valid zero return. Non-session dates are absent from the eligible-session index rather than inserted as flat prices.

### Moving averages, trend slope and persistence

An incomplete exact session set cannot shorten the denominator or forward-fill a missing close. A genuinely unchanged observed close is valid. Positive-day ratios require the exact expected denominator; missing sessions are not negative or zero-return days.

### KD

If the observed rolling high equals the observed rolling low, the RSV denominator is truly zero and the implementation must use its frozen zero-range convention. Missing high/low values cannot invoke that convention.

### RSI

An observed flat close-to-close pair contributes zero gain and zero loss. A missing close makes the delta unavailable and breaks canonical Wilder ancestry until full replay or a replay-certified state restores it. “No loss” from missing data must not force RSI to 100.

### MACD

Missing an expected close does not license silent EMA carry-forward. State age, expected-session identity and replay ancestry must be preserved. A carried state is valid only under an explicit non-session transition, not an absent eligible session.

### ADX

Observed unchanged OHLC can produce valid zero true range and directional movement. Missing high/low/close cannot become zero TR/DM; it invalidates the recursive state unless a trusted replay-certified state is supplied.

### Bollinger Bands

Twenty observed equal closes can produce valid zero standard deviation. Nineteen closes plus one missing session cannot be padded with the prior close or zero and cannot be labeled a zero-width band.

### Divergence and multi-timeframe conflict

No confirmed divergence after complete pivots is valid “none.” Missing indicator/pivot data is unobservable, not no divergence. Likewise, an incomplete weekly or intraday frame is not “no timeframe conflict”; it is incomplete evidence.

## Completeness identity and PIT

Every indicator artifact must hash:

- exact expected session IDs;
- observed session IDs;
- selected source versions;
- field-level state mask;
- cutoff and causal clocks;
- gap/conflict/exclusion reasons;
- indicator parameters and warm-up/replay identity.

The completeness/state-mask hash is part of factor identity. Two equal numeric outputs with different missingness ancestry are not the same evidence. Destination persistence time or later backfill cannot rewrite an earlier `NOT_YET_PUBLISHED`/`MISSING_EXPECTED_SESSION` state into historical PIT availability.

## Support, counterevidence, alternatives and failures

Support:

- Merge `10c1a7c9` proves the operational telemetry analogue: empty group and numeric zero are different states.
- Existing D03 exact-session reconciliation already rejects missing-recent plus unexpected-older substitution.
- Wilder-recursive and finite-window indicators both depend on exact session identity, though their recovery rules differ.

Counterevidence:

- No current physical indicator dataset demonstrates the full typed state mask across Taiwan symbols.
- Existing stored bars may not expose all original causal clocks or source-version conflicts.
- Some production libraries may silently skip or forward-fill missing values; their behavior remains UNKNOWN until exact implementation inspection.

Alternative explanations:

- Zero volume may be a genuine observed field, a halt-state observation, or a malformed/missing record; lineage decides.
- A calendar date gap may be a holiday, a symbol-specific halt, a delisting boundary, or missing data; it cannot be classified by absence alone.
- A flat price can be real, tick-size constrained, stale, or backfilled; positive observation and version provenance are required.

Hard failures:

- missing close -> zero return;
- missing loss -> RSI 100;
- missing OHLC -> zero ADX TR/DM;
- incomplete Bollinger window -> zero standard deviation or padded close;
- missing timeframe -> no conflict;
- missing divergence inputs -> no divergence;
- current-day telemetry absence -> zero usage/headroom;
- later backfill timestamp -> historical availability.

## Bias and robustness

- PIT/look-ahead: late backfills remain unavailable at earlier cutoffs.
- Selection bias: complete-case filtering must report excluded symbols/dates and compare the eligible denominator.
- Date clustering: missingness must be summarized by date/regime/source, not only overall percentage.
- OOS/walk-forward: state rules freeze before outcome inspection and must be replayed chronologically.
- Multiple testing/overfitting: no alternative fill methods may be selected using outcomes; fill policy is a preregistered sensitivity analysis only.
- Redundancy: typed missingness is a data-quality root, not independent alpha and must not receive a score vote.
- Cost/fillability/regime: UNKNOWN until valid signals are joined to executable outcomes.

## Disposition and next

No maturity promotion, outcome join, FORMAL_OPTIMIZATION_CANDIDATE, or Formal Core change.

Next:

1. Inspect the actual indicator implementation paths for silent skip, denominator shrink, forward-fill and recursive carry-forward behavior.
2. Build a real per-symbol/session field-state census after destination data import and source/destination parity.
3. Persist completeness/state-mask hashes with Bollinger and ADX replay artifacts.
4. Run preregistered missingness sensitivity by source/date/regime only after PIT-ready data exists; never choose a fill rule from performance.

D03 remains 56.7%; 12 active modules = 10 L3 + 2 L2; D03-09 and D03-10 remain L2/40; outcomes closed; Formal Core locked.
