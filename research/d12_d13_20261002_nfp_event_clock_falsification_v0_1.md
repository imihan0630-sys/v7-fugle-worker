# D12 × D13 | 2026-10-02 Employment Situation event-clock falsification pre-registration

Updated: 2026-10-02 05:37 Asia/Taipei  
Status: RESEARCH_ONLY / PRE_EVENT_PROTOCOL_FROZEN / NO OUTCOME JOIN  
Formal Core: LOCKED

## Event source and unambiguous clocks

BLS official October 2026 release calendar schedules September Employment Situation for **Friday 2026-10-02, 08:30 ET = 20:30 Asia/Taipei (EDT)**.

TAIFEX official after-hours rules for TX: **15:00-05:00 Asia/Taipei**, with trades attributed to the following regular trading session. The official complete night-session OHLC cannot be treated as observed at 18:10.

The 2026-10-02 Taiwan after-market decision is at **18:10**, exactly 140 minutes before the scheduled macro release.

Define four independent data objects; never overwrite an earlier object with a later one.

| Object | Window | Status for 18:10 decision | Role |
|---|---|---|---|
| KNOWN_EVENT_SCHEDULE | Calendar version received <=18:10 | PIT candidate only if provider/capture source attested | Event-risk context |
| TX_NIGHT_PRE_SCAN | 15:00-18:10 | PIT candidate only if trades captured by cutoff, exact contract/session and source provenance | Predictor |
| BLS_FIRST_PRINT | At/after 20:30 | FUTURE for 18:10 | Outcome/event realization |
| TX_NIGHT_EVENT_AND_AFTER | After 20:30 to session end 05:00 | FUTURE for 18:10 | Derivative market outcome |

**Do not treat the first next Taiwan regular session as a fixed calendar date without the official trading-calendar gate.** The weekend and any holiday closures are competing sources of information and time decay.

## Main hypotheses, stated symmetrically before outcomes

H0: The pre-announced macro release adds no incremental prediction of next Taiwan-open absolute gap, next-session range/MAE or tail-loss beyond Taiwan realized volatility/ATR, TAIWAN VIX, Taiwan market regime, domestic breadth/sector mix, regular Friday/weekend baseline and already-known global risk conditions.

H1a: The scheduled-release flag provides additional risk-state information conditional on those baselines.

H1b: The flag is redundant for after-market selection but may condition the post-20:30 TX response; this is a separate later decision time, not a valid 18:10 feature.

H1c: The conditional effect is limited to specific risk regimes (e.g. elevated VIX) rather than a universal event-day veto.

The sign of the NFP *surprise* remains UNKNOWN unless timestamped pre-release consensus is captured and the BLS first print is preserved after actual publication. Neither payroll direction nor a precommitted bullish/bearish label is inferred from the event schedule alone.

## Data contract

Keep separate immutable source parents for:
- BLS scheduled publication version, with actual HTTP source-response bytes/clock or retain SOURCE_ATTESTATION_INCOMPLETE;
- CBC official USD/TWD close if published before 18:10, with unit/quote direction;
- UST most recently *published* official curve before Taiwan 18:10 (not current same-US-calendar-date eventual table);
- TAIWAN VIX official same-session timestamped observation or UNKNOWN;
- TX 15:00-18:10 trade-level source snapshot, including contract month, trading-session attribution, rollover/expiry and source delay;
- optionally prior completed U.S. cash/session/tech states with their own first-known clocks.

All parents must pass the existing unified guard and stricter `research/source_receipt_attestation_v0_1.mjs` check. A render-only current webpage without archived raw response has descriptive source value but **strictCleanProspective = false**.

## Outcomes, blind during coverage stage

Primary: next Taiwan cash-session absolute opening gap; normalized range; downside MAE or tail-loss in a fixed window; independent date/event-cluster inference.

Secondary: signed gap, open-to-close, sector residual, reaction in the TX event window starting only after 20:30. Do not select one target after seeing which is strongest.

For multi-day horizons, use non-overlapping robustness or cluster/block methods; a single October 2 episode is not an inference sample.

## Competing explanations and negative controls

1. **Friday-weekend effect:** match non-release Fridays and comparable calendar-gap/holiday lengths before claiming an NFP effect.
2. **High-volatility confounding:** condition on existing ATR/realized-volatility/TAIWAN VIX. An event-week VIX rise is not independent confirmation if option quote quality is missing.
3. **Overnight global move:** compare pre-18:10 available global context separately from post-20:30 US equities/rates/oil moves. The latter are mediators or future outcomes, not 18:10 controls.
4. **Options expiry/roll:** TAIFEX TXO weekly expiry and TX contract roll state must be explicit. Do not relabel expiry-related positioning as macro effects.
5. **Taiwan specific events:** official company disclosure or geopolitical weekend news may dominate Monday gap; retain event-cluster flags rather than remove difficult dates after seeing their outcome.
6. **No-surprise measurement:** absent documented pre-release consensus vintage, macro surprise remains UNKNOWN even if current headlines later quote a consensus.
7. **Placebo:** same clock on matched non-NFP Fridays; date-shift events; compare risk targets to direction targets without hindsight re-ranking.

## Source-access and governance gates

BLS official calendar: https://www.bls.gov/schedule/2026/10_sched_list.htm  
TAIFEX official night-session rules: https://www.taifex.com.tw/cht/4/aHIntroduction

No 2026-10-02 actual 18:10 VIX/TX receipt is claimed in this protocol, created at 05:37 before the relevant session. No future realization is written. No new scheduled automation, production API call, shared worker/cron/schema change, or paid-source dependency is authorized here.

`D12-05`, `D12-10`, `D13-09`, `D13-11`, and `D13-12` maturity remain unchanged. Formal Core remains LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NO.

## Exact next continuation

1. On a session date with authorized live capture, preserve raw BLS/calendar and public-official market source replies **as bytes**, response-completed clock and usage terms.
2. Write append-only receipt parent before the 18:10 cutoff; independently read back archived bytes and verify hash/length and the strict attestation guard.
3. If unavailable by cutoff, store UNKNOWN/MISSING in a separate non-clean observation; do not reconstruct from 18:11 or the later full night.
4. Accumulate independent dates and source quality metrics; freeze minimum coverage gates before opening next-session outcomes.
5. Then run event-risk counterfactuals versus domestic baseline and matched non-NFP Friday clocks. If extra value is absent, retain calendar as descriptive risk context only.
