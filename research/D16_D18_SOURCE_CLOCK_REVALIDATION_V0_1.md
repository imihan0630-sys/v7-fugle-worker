# D16 + D18 Source Clock Revalidation V0.1

Updated: 2026-10-01 Asia/Taipei
Status: RESEARCH-ONLY / SOURCE_FAMILY_REVALIDATION_REQUIRED / NO POLICY IMPACT
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Revalidate the source-family assumptions behind the System 2 prospective Decision Clock and D18 market-level Breadth before interpreting additional dates as ordinary latency samples.

The central falsification question is no longer only:
"How many minutes after 13:30 does the same-day full-market close become READY?"

It is now:
"Does the selected source family reliably expose the intended same-day object at all, with semantics suitable for the factor being measured?"

No strategy return or outcome was used to reach this conclusion.

## 1. 2026-09-29: first real prospective date

Scheduled workflow:
- System2 Prospective Clock Evidence Read-only;
- run `36526809162`;
- event = schedule;
- run_attempt = 1;
- conclusion = SUCCESS;
- immutable A1, A5/B2 and daily-bundle artifacts exist.

Next-calendar-day readiness/finalized audit:
- run `36651867330`;
- immutable readiness + finalized-date acceptance artifacts exist.

Finalized acceptance for 2026-09-29:
- coverageClass = TRADING_DAY_COMPLETE;
- coveragePromotionEligible = true;
- selected run = immutable attempt-one run `36526809162`;
- promotionGradeDateCount = 1;
- independentTradingDates = 1;
- completeTradingDates = 0;
- precisionEligibleDates = 0;
- requiredReady = false;
- sameSessionClockReady = false;
- precisionEligible = false;
- candidateTimestamp = null;
- a5AvailableByCandidate = false;
- blocker includes A5_NOT_AVAILABLE_BY_CANDIDATE.

Interpretation:
2026-09-29 is a valid independent prospective evidence date for the frozen evidence program, but it is NOT a complete/precise Decision Clock date.

Promotion-grade date inclusion, source completeness and freeze-eligible precision are different states and must never be collapsed.

## 2. 2026-09-29 raw source evidence

A1 observation window extended from roughly 13:35 to 16:02 Asia/Taipei.

TWSE:
- 30/30 observations = NOT_READY;
- reason = TARGET_DATE_NOT_PRESENT;
- payload date remained 2026-09-24.

TPEx:
- 30/30 observations = SOURCE_ERROR;
- 24 HTTP 403;
- 6 network errors.

B2 never became READY.
A5 was prospectively observed but did not satisfy the candidate-boundary contract.

This was not a near-miss within a five-minute precision bracket.

## 3. 2026-09-30 raw source evidence

Scheduled run:
- `36674088814`;
- event = schedule;
- attempt one;
- workflow conclusion = SUCCESS;
- immutable A1 / dependency / daily-bundle artifacts exist.

Observation window extended from roughly 13:35 to 16:10 Asia/Taipei.

TWSE A1:
- 30/30 observations did not expose the 2026-09-30 target date;
- the source remained on 2026-09-29 through the final observation.

TPEx:
- initially remained on the prior date;
- later source behavior included non-JSON/transport instability in some lanes;
- by the final relevant B2 observation, TPEx daily data had reached 2026-09-30;
- final TPEx target-date ordinary-symbol count was 888 and classification coverage passed.

B2:
- did not become complete because the two markets were not simultaneously same-date ready;
- TWSE remained prior-date while TPEx eventually advanced.

The next-calendar-day finalized acceptance for 2026-09-30 was not yet available at the start of this research round and must not be inferred from the same-day workflow conclusion.

## 4. Falsification of the simple latency model

The simple model:
"Start polling shortly after 13:30, wait long enough, and TWSE + TPEx full-market daily rows will jointly become same-date READY"

is not yet supported.

Observed failure modes include:
- multi-day TWSE staleness on 2026-09-29;
- next-day TWSE staleness persisting past 16:00 on 2026-09-30;
- TPEx HTTP/network/non-JSON instability;
- cross-market asynchronous date availability;
- dependency completion failure despite successful workflow execution.

Therefore adding more dates without revalidating the source family can accumulate source-failure dates rather than estimate a meaningful publication-latency distribution.

## 5. Official publication-clock plausibility

Public exchange documentation shows that regular-session close at roughly 13:30 is not equivalent to full closing-file publication at 13:30.

TWSE daily closing market-data products document multiple later production times, including approximately 14:00, 15:30 and 17:30 depending on product cycle.

TPEx daily quote products document post-close production times including approximately 14:00 and later after-market versions around 14:50 / 17:45.

These facts do not prove the exact live OpenAPI arrival time.
They do falsify any assumption that a full same-day closing file must naturally be available immediately after the continuous-trading close.

The prospective artifact clock remains authoritative for actual source availability.

## 6. Source architecture split

D18 must not force all market-state factors through one A1 source family.

### A. MARKET_DIRECTION_BREADTH

Preferred semantic object:
official exchange aggregate advancing / declining / unchanged / untraded / no-comparison statistics.

Reason:
- the factor asks about market-wide direction counts;
- aggregate exchange statistics directly define those counts;
- untraded / no-comparison semantics are explicit rather than reconstructed from per-stock parser assumptions.

TWSE:
- direct official OpenAPI TWTaZU source is machine-readable;
- research-only parser can be executable/tested independently.

TPEx:
- official market-highlight semantics expose advancing / declining / flat / untraded counts;
- exact machine-readable transport and prospective availability clock remain to be verified before L3 source promotion.

Do not invent a TPEx JSON contract from an HTML page.

### B. COMMON-STOCK / RETURN DISTRIBUTION

Preferred object:
per-symbol official daily rows with explicit universe identity and actual daily market presence.

This lane is needed for:
- common-stock breadth;
- median/equal-weight return;
- return dispersion;
- cross-sectional history.

It has stricter continuity and availability requirements than aggregate direction breadth.

### C. FORMAL OPPORTUNITY-SET BREADTH

Formal-normalized rows remain a separate estimand and cannot replace market breadth.

## 7. Decision Clock implication

Do not repair the observed failures by:
- silently extending the polling timeout until a favorable date appears;
- lowering source-readiness gates;
- substituting later historical retrieval;
- mixing another collector fingerprint without a new evidence epoch;
- accepting TPEx-ready/TWSE-stale as a combined same-date state;
- treating workflow SUCCESS as source READY.

Before the current A1 family contributes to a frozen Decision Clock:
1. identify the intended source object per factor;
2. measure its actual prospective arrival distribution;
3. verify same-date and cross-market synchronization requirements;
4. preserve failed dates;
5. version any material collector/source change before new evidence accumulation.

## 8. D16 evidence interpretation

The 2026-09-29 acceptance advances evidence understanding:
- one immutable promotion-grade independent date is confirmed;
- zero complete dates;
- zero precision-eligible dates.

This is meaningful PIT/provenance evidence but not an exact-clock freeze signal.

No D16 module is promoted solely from this date.

## 9. D18 evidence interpretation

Market-level Direction Breadth should be allowed to mature on an aggregate-source lane independently from per-symbol return/history breadth.

This is not a shortcut:
- market breadth still requires PIT availability and explicit denominator semantics;
- cross-market aggregation remains blocked until both market contracts are prospectively verified;
- Strategy × Regime policy remains blocked.

## 10. Current decision

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

No:
- System 1 Formal change;
- System 2 strategy activation/weight change;
- exact Decision Clock authorization;
- general System 2 selection capture authorization;
- capital/execution/notification change.

## Exact next continuation

1. Verify prospective publication timing of the TWSE official aggregate breadth source.
2. Identify and verify a TPEx machine-readable official aggregate breadth transport; HTML semantics alone are not enough for L3.
3. Compare aggregate market breadth with per-stock reconstructed breadth only on same-date common-support receipts; treat differences as universe/source diagnostics, not alpha.
4. Read the 2026-09-30 finalized-date acceptance only when its scheduled next-day audit exists.
5. Continue U2 True Return Distribution under a separate continuity-certified contract.
6. Do not test a Breadth policy threshold until source occupancy/missingness is stable.
