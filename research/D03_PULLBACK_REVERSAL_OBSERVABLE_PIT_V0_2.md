# D03 Pullback / Short-Term Reversal Observable PIT V0.2

Updated: 2026-10-04 Asia/Taipei
Lane: D03-05｜Pullback（回檔）與短期反轉
Classification: Class A（研究專用）
Formal Core（正式核心）impact: NONE / LOCKED

## Purpose（目的）

This tranche reconciles D03-05 with the owner-approved H07 semantic split.

The older D03-05 audit correctly rejected a generic short-term reversal score and correctly kept pullback **origin attribution** data-gated.

However, H07 now freezes D03-05's primary ownership as the **observable price phenomenon**:
- pullback geometry;
- short-horizon reversal;
- failed reversal;
- observable price/volume/volatility state;
- PIT-safe replay of reversal behavior.

Therefore:

`PULLBACK_ORIGIN_UNKNOWN`

must not be conflated with:

`PULLBACK_REVERSAL_OBSERVABLE_STATE_UNKNOWN`.

D03-05 may reach Taiwan PIT data-feasibility maturity for the observable phenomenon while causal-origin labels remain optional owner-lane moderators.

No BUY/SELL（買進／賣出）, ranking, threshold, capital, notification or Formal behavior changes.

---

## TI-534 — H07 ownership reconciliation

Owner-approved H07 freezes:

- D03-05 = observable pullback / short-term reversal phenomenon;
- D20-09 = behavioral overreaction mechanism only when independent behavioral/event expectation evidence exists;
- D05 / D08 / D09 / D18 may provide causal/context receipts but do not own the price episode itself.

Therefore D03-05 v0.2 separates two layers:

### Layer A — observable price episode
Required for D03-05 PIT feasibility.

### Layer B — origin/context attribution
Optional moderator:
- structural/no identified shock;
- market/sector driven;
- event-information;
- liquidity-pressure candidate;
- multiple origins;
- unknown origin.

Missing Layer-B receipts leave `originState=UNKNOWN`.
They do **not** erase a causally observable Layer-A pullback/reversal episode.

This supersedes the earlier overly strict implication that all origin branches had to be promotion-grade before the D03-05 observable phenomenon could become L3.

---

## TI-535 — frozen daily parent geometry

The research parent reuses the current A/PULLBACK observable geometry from `strategySetupState()` without changing production:

- trend structure valid;
- pullback from recent high between 2% and 15%;
- support distance <= 4%;
- pullback volume contraction / no heavy sell-volume condition;
- structure not broken;
- not late-stage.

For a replayable research parent, preserve at least:

```
parentDecisionReceiptId
captureGeneration
scanDate
planDate
symbol
sourceHistoryHash
formulaVersion
support
recentHigh
pullbackPct
supportDistancePct
A.checks
parentKnownAt
```

A Formal plan is not required to be the source of truth for the observable geometry.
If plan fields are consumed for compatibility, the research row must preserve the exact observed values and provenance.

Current selected-plan journal/runtime identity remains only PARTIAL and must not be retroactively upgraded into immutable generation linkage.

---

## TI-536 — causal 15m episode state machine

Research-only observable states:

```
PULLBACK_PENDING
ZONE_ENTERED_HELD
REVERSAL_SEED_VISIBLE
REVERSAL_CONFIRMED
FAILED_ZONE_BREAK
FAILED_DOWN_VOLUME
NO_CONFIRMATION_YET
DATA_BLOCKED
UNKNOWN_PROVENANCE
```

Formal-compatible geometry:

1. `ZONE_ENTERED_HELD`
   - completed 15m bar overlaps frozen pullback zone;
   - close holds >= frozen lower bound.

2. `REVERSAL_SEED_VISIBLE`
   - zone entered/held;
   - local volume ratio finite and <= 0.9;
   - reversalK or equivalent frozen reversal morphology present.

3. `REVERSAL_CONFIRMED`
   - the next completed 15m bar has low >= seed-bar low;
   - bullish turn-up;
   - close > seed close or high > seed high.

4. `FAILED_ZONE_BREAK`
   - completed 15m close < frozen lower bound before confirmation.

5. `FAILED_DOWN_VOLUME`
   - bearish completed bar with finite local volume ratio >= 1.3 before confirmation.

These are observable states, not standalone trading signals.

---

## TI-537 — exact slot continuity is stricter than numeric availability

Current Formal `buildBar` can compute the previous-five-bar local volume ratio from the prior five **available** completed bars.

If an expected 15m slot is missing, a number may still be produced even though the elapsed clock spacing is wrong.

Price-Volume research already freezes stricter expected-slot semantics.

Therefore D03-05 research v0.2 requires:

`M15_SESSION_PREFIX_CONTIGUOUS = TRUE`

through the reversal-confirmation bar.

If an expected ordinary-session slot is missing:
- `DATA_BLOCKED / MISSING_EXPECTED_15M_SLOT`;
- no silent substitution by an older bar;
- no interpolation;
- no zero-fill.

This prevents a numerically present volumeRatio from masquerading as a time-consistent ratio.

---

## TI-538 — reversal confirmation clock cannot backdate to the low

Required clocks:

```
seedBarStart
seedBarEnd
seedFeatureKnownAt
confirmBarStart
confirmBarEnd
confirmFeatureKnownAt
reversalConfirmedAt
```

Frozen rule:

`reversalConfirmedAt = max(confirmBarEnd, confirmFeatureKnownAt, required prior-bar/parent availability)`.

The seed/pullback low can be stored as a geometric anchor, but the reversal signal cannot be timestamped at that low.

Required lag fields:

```
pullbackLowAt
pullbackLowPrice
confirmationLagEligibleBars
priceAtConfirmation
priceMoveLowToConfirmationPct
priceMoveLowToConfirmationATR
```

Pre-confirmation recovery is confirmation-lag cost, not post-signal alpha.

---

## TI-539 — failed reversal is first-class evidence

D03-05 owns failed reversal as well as successful confirmation.

A future episode may transition:

```
ZONE_ENTERED_HELD
 -> REVERSAL_SEED_VISIBLE
 -> REVERSAL_CONFIRMED
```

or:

```
ZONE_ENTERED_HELD
 -> FAILED_ZONE_BREAK
```

or:

```
ZONE_ENTERED_HELD
 -> FAILED_DOWN_VOLUME
```

A later failure after a confirmed episode is recorded as a later outcome/state transition.
It does not repaint the historical fact that confirmation was first observed earlier.

Episode history is append-only.

---

## TI-540 — session / corporate-action / price-limit guards

The observable price episode does not require a complete causal-origin taxonomy, but it still requires honest market-data provenance.

Required guards:

- ordinary eligible symbol-session chronology;
- completed 15m bars only;
- no pseudo-bars for suspensions/no-trade sessions;
- corporate-action contamination check over the parent/episode window;
- price-limit / delayed-close / special-session state preserved;
- sourceFetchedAt / barEnd ordering;
- explicit UNKNOWN when provenance is incomplete.

If an unresolved corporate action makes the daily parent geometry non-comparable:
`DATA_BLOCKED`.

If the price episode is observable but the session is constrained:
`VALID_BUT_CONSTRAINED`.

A constrained episode may be described but must not be silently pooled with ordinary continuous-session reversal behavior.

TWSE regular trading is 09:00-13:30, with symbol-specific closing delay possible to 13:33 under the official stabilization mechanism.

---

## TI-541 — owner-origin receipts are optional moderators, not existence gates

Optional fields:

```
marketSectorContextReceiptId
eventContextReceiptId
microstructurePressureReceiptId
behavioralContextReceiptId
originState
originEvidenceCompleteness
```

Rules:

- no owner receipt -> `UNKNOWN_ORIGIN`;
- candle morphology never upgrades liquidity-pressure origin;
- multiple valid owners -> `MULTIPLE_ORIGINS`;
- no origin state directly changes BUY/SELL;
- D03 does not recreate D05/D08/D09/D18 source engines.

Future incremental research can compare equal-setup pullbacks across valid origin strata.
That is a later moderator test, not a prerequisite for observing the reversal episode itself.

---

## TI-542 — Taiwan PIT data-feasibility decision

D03-05 observable-price PIT feasibility is now supported by existing repository capabilities:

### Daily parent geometry
- current A/PULLBACK daily geometry and its exact formulas exist;
- daily price-history source semantics are already understood;
- invalid corporate-action/session lineage can fail closed instead of being imputed.

### Intraday causal path
- Worker already consumes completed Fugle 15m bars;
- current research infrastructure preserves barStart / barEnd / sourceFetchedAt semantics;
- Price-Volume Shadow V8.11.0 is implemented research-only and stores immutable intraday snapshots;
- its A lifecycle deterministic fixture already verifies:
  `A_PULLBACK_TEST -> A_INITIAL_ACCEPTANCE -> A_REACCELERATION`;
- same-session outcomes and failed reentry are stored separately from immutable feature snapshots;
- current zero-extra-call ordinary path is bounded to 17 completed 15m starts through 13:00; late-session unavailable horizons remain INCOMPLETE rather than crossing overnight.

### Additional D03 v0.2 stricter rule
- exact expected-slot continuity is mandatory;
- missing-slot numerical substitution is rejected.

Therefore D03-05 advances:

- L2 / 40% / MECHANISM_AND_FALSIFICATION_DEFINED

to:

- **L3 / 60% / TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED**

This promotion applies only to the **observable pullback/reversal phenomenon**.

It does NOT claim:
- predictive alpha;
- optimal 2%-15% / 4% / 0.9 / 1.3 thresholds;
- liquidity-pressure causal identification;
- behavioral overreaction;
- OOS / Prospective Shadow efficacy;
- Formal optimization eligibility.

The origin/context layer remains:
`OPTIONAL_MODERATOR / PARTIAL / UNKNOWN_ALLOWED`.

With 12 active D03 modules:
- prior aggregate = 55.0%;
- D03-05 +20 maturity points;
- new aggregate = **56.7%**.

---

## Deterministic falsification fixture

File:
`research/test_d03_pullback_reversal_observable_pit_v0_2.mjs`

Fixture proves:

1. zone entry alone is not confirmed reversal;
2. a reversal seed is not confirmed until a later completed bar forms a higher low and turn-up;
3. first legal confirmation time is after the confirmation bar end/source fetch, not at the seed low;
4. a missing expected 15m slot => DATA_BLOCKED;
5. a close below frozen lower zone before confirmation => FAILED_ZONE_BREAK;
6. origin UNKNOWN does not erase a valid observable price episode.

Local deterministic execution in this research turn: PASS.
Repository CI: NOT_TRIGGERED unless a workflow explicitly runs this fixture.

---

## Current status

`D03_05 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`

`GENERIC_REVERSAL_FACTOR = REJECTED_OR_REDUNDANT`

`OBSERVABLE_PULLBACK_REVERSAL_EPISODE = PIT_FEASIBLE`

`ORIGIN_ATTRIBUTION = OPTIONAL_MODERATOR / PARTIAL / UNKNOWN_ALLOWED`

`M15_MISSING_SLOT = DATA_BLOCKED`

`REVERSAL_SIGNAL_CLOCK = CONFIRM_BAR_KNOWN_AT_NOT_PULLBACK_LOW`

`D03_MATURITY = 56.7_PERCENT`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

---

## Exact next continuation point

1. D03-09 ADX and D03-10 Bollinger remain L2 because shared TECHNICAL_CONTINUITY is still not physically certified; official final-result pages do not prove complete revision history.
2. Do not weaken that source gate merely because D03-05 could progress under its newly narrowed observable-price ownership.
3. Raw-byte D03 primary source gate remains 2/3 over the weekend.
4. On the next genuine completed Taiwan session, close the frozen third-session raw receipt only with receipt-equivalent transport, then execute TI-005 KD-vs-RSI followed by TI-006 MACD-vs-direct-trend.
5. Until then, next useful outcome-blind work is to build the exact TI-005/TI-006 inference design and rejection thresholds **without opening outcomes**, so Monday can execute rather than redesign after seeing results.
