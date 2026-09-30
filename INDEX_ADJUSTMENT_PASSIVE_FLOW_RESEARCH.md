# Index Adjustment / Passive Flow Event Research

Updated: 2026-09-29 Asia/Taipei
Owner room: 08｜事件與新聞研究室
Primary module: D11-14 指數調整事件與被動流
Secondary dependency: D11-09 財報／月營收／法說事件窗, D17 event first-known / propagation
Status: RESEARCH_ONLY / TAIWAN_PIT_FEASIBILITY_VALIDATED / FORMAL_CORE_LOCKED

## 1. Core event clock

An index-rebalance event must be represented by at least four different clocks:

1. `reviewDataCutoff` — the data cutoff used by the index methodology.
2. `announcementKnownAt` — when the review result became public.
3. `effectiveFromSession` — the first session in which the new membership/weight is effective.
4. `trackerExecutionWindow` — the period in which index-tracking products may execute, which can include pre-effective and close-auction trading.

These clocks are not interchangeable.

Taiwan examples from official index rules:
- FTSE/TWSE Taiwan Index Series: quarterly review in March/June/September/December; detailed review results and execution date are published after the first Friday close, while changes become effective after the third Friday close (effective Monday).
- TWSE Corporate Governance 100: technical notice on the 7th trading day of the review month, five-trading-day gap, then effective from the 13th trading day.
- Some Taiwan Index Plus custom indices expose separate review baselines and fixed trading-day lags before effectiveness.

This is sufficient to prove that a Taiwan point-in-time index-event representation is feasible if the original technical notice/result artifact and effective-session rule are preserved.

## 2. Why an index change can matter

Positive mechanism candidates:
- mechanical demand/supply from passive or benchmark-aware funds;
- closing-auction concentration near implementation;
- temporary inventory/risk-transfer pressure on liquidity providers;
- changes in visibility, liquidity, and ownership composition;
- anticipatory trading between announcement and effective date.

The event is therefore not equivalent to ordinary company news. The economic mechanism can exist even when no new company fundamental information is released.

## 3. Strong counterevidence

The index effect is not stable enough to be treated as a universal directional rule.

External literature documents several conflicting results:
- older studies find sizable addition/deletion abnormal returns and volume effects;
- later research finds the S&P 500 index effect has structurally weakened;
- a 2024 Journal of Finance study reports the addition effect fell sharply over time despite larger passive assets;
- methodology, benchmark choice, outliers, and whether a name is a true addition/deletion versus a transfer across index families materially change conclusions.

Therefore:
- `ADD = bullish` and `DELETE = bearish` are prohibited deterministic rules;
- the event may primarily affect temporary price pressure, auction volume, liquidity, or tracking flow rather than medium-horizon alpha;
- highly anticipated reviews can be priced before public effective-day execution;
- Taiwan results cannot be inferred from S&P 500 evidence without Taiwan PIT/OOS testing.

## 4. Taiwan PIT source contract

For D11-14, L3 feasibility requires preserving:
- `indexFamily`
- `indexCode`
- `reviewType` (scheduled / extraordinary)
- `reviewDataCutoff`
- `announcementPublishedAt`
- `capturedAt`
- `effectiveFromSession`
- `constituentAction` (ADD / DELETE / WEIGHT_CHANGE / TRANSFER / UNKNOWN)
- `oldWeight`, `newWeight` when source-proven
- `sourceArtifactUrl`
- `sourceArtifactHash`
- `methodologyVersion`
- `sourceRevisionState`
- `knownAtQuality`

The conservative replay clock is `max(sourcePublishedAt if independently authenticated, capturedAt)`.
If native timestamp provenance is unavailable, use `capturedAt` and mark publication timing weaker.

## 5. Historical archive / licensing guard

TWSE e-shop index constituent products prove daily constituent files exist and include pre-effective / effective files, but access is product/subscription gated for some datasets.

This means:
- Taiwan PIT **feasibility** is validated;
- free/public full historical byte completeness is not automatically validated;
- a paid/licensed artifact can be valid research input if its terms allow the intended use;
- public methodology pages must not be used to fabricate historical constituent states.

## 6. Event-window design

A future OOS/Shadow study should freeze windows before outcomes:

- A0: last close before announcement
- A1: first session after announcement
- A2: announcement-to-effective interval
- E0: last session before effective implementation
- E1: effective session/opening/closing auction
- E+1 / E+3 / E+5: post-effective follow-through/reversal

Required outcomes:
- market/sector-relative return;
- overnight versus intraday split;
- opening gap;
- closing-auction volume share if available;
- turnover / spread / depth;
- abnormal volume;
- temporary versus persistent price effect;
- liquidity change;
- realized slippage for a hypothetical passive rebalance proxy.

## 7. Required controls

Positive evidence is rejected or downgraded when it disappears after:
- market, sector, size/liquidity and momentum controls;
- separating transfers between related indices from true net additions/deletions;
- excluding corporate-action contaminated dates;
- excluding names with concurrent earnings/material-information events;
- exact common-support dates;
- transaction cost and auction slippage;
- multiple-testing correction across index families/windows.

## 8. D11-09 cross-check: scheduled event windows

Monthly revenue deadline, earnings deadlines, investor-conference calendars and index review calendars are different certainty classes.

A regulatory deadline is not an exact publication schedule.
An index methodology schedule can define an expected review/effective window, but the actual technical notice remains the point-in-time public event artifact.

Therefore event-calendar state should distinguish:
- EXACT_SCHEDULED
- DATE_ONLY
- REGULATORY_DEADLINE_WINDOW
- EXPECTED_METHODOLOGY_WINDOW
- UNSCHEDULED
- UNKNOWN

This reinforces the existing Event Risk rule that “known event window” and “known exact announcement time” are different states.

## 9. System 1 / System 2 incremental-value assessment

Potential value:
- event-risk context and auction/liquidity stress;
- passive-flow exposure labeling;
- improved explanation of event-driven volume/closing-auction anomalies;
- avoiding false attribution of rebalance-related volume to company-specific sentiment or institutional conviction.

Not yet justified:
- ranking boost/penalty;
- automatic buy additions / sell deletions;
- pre-event de-risking;
- sizing or stop changes;
- live execution changes.

Current status:
`D11-14 = L3 / TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`.
No L4 claim until a prospective/OOS Taiwan cohort exists.
No `FORMAL_OPTIMIZATION_CANDIDATE`.
Formal Core unchanged.
