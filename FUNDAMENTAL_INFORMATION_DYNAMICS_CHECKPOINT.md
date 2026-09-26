# Fundamental Information Dynamics Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: FD-001 through FD-035 complete.
Next: event-clock/vintage evidence accumulation; concept lane complete.

## Durable conclusions
- Exact 2026 record-high revenue citation corrected to DOI 10.1016/j.frl.2026.109911. The event mechanism is horizon-dependent: short-term reversal can coexist with longer drift, especially conditional on pre-event run-up and institutional selling.
- Current V8.7.11 revenue evidence is CURRENT_SNAPSHOT_ONLY with firstKnownAt=null and historicalHighStatus=UNKNOWN_REQUIRES_HISTORY; it cannot establish announcement day or record-high-at-the-time state.
- The normal Formal enrichment already fetches full-market TWSE/TPEx monthly revenue, so future first-observed event receipts can potentially reuse the source with zero extra API calls; touching shared parser/storage remains Class-B proposal-first.
- Conservative prospective event timing uses next official session after first clean after-market observation when exact filing time is unavailable; missed prior scans => OBSERVATION_DELAY_UNKNOWN.

- Current Formal fundamentalScore uses realized fundamental LEVEL/CHANGE measures but no source-level surprise, consensus, revision or forecast fields.
- Growth != surprise. Revenue YoY/MoM and EPS YoY are realized changes, not expectation errors.
- PEAD is a substantial literature but not a guaranteed modern trading edge; mechanisms and persistence vary.
- Revenue surprise can add information beyond earnings surprise.
- Taiwan mandatory monthly revenue disclosure makes monthly fundamental events unusually valuable, but exact first-known publication timing is mandatory.
- Corrected/current MOPS values cannot be backfilled as if known historically; first-known vintage is required.
- Analyst forecast revisions have evidence in Taiwan, but current system has no verified consensus source. Missing consensus/revision must remain UNKNOWN.
- Fundamental surprise must be interpreted jointly with immediate price reaction and, if available, analyst revision speed.
- Price/fundamental disagreement is a research state, not a reason to ignore price.
- Recent Taiwan evidence on record-high monthly revenue suggests short-horizon reversal and longer-horizon drift can coexist; horizon and pre-event run-up matter.
- Peer earnings/revenue events can transfer information, but competitive versus common-demand effects must be separated.
- Formal Core remains LOCKED.

## Existing-source audit

Present:
- revenueMonth / revenueMoM / revenueYoY / revenueYTDYoY
- EPS / true single-quarter EPS review / epsYoY
- margins / margin YoY
- fundamentalScore
- official announcements / valuation

Absent in current main Worker source:
- surprise
- consensus
- revision
- forecast

## Exact next continuation

FD-011: Define surprise measurement hierarchy: true consensus, company guidance, seasonal/model expectation.
FD-012: Standardized Unexpected Earnings (SUE) and why naive EPS YoY is not SUE.
FD-013: Revenue acceleration/deceleration vs surprise; seasonality in monthly revenue.
FD-014: Earnings quality: cash flow/accruals and persistence versus headline EPS.
FD-015: Margin surprise and operating leverage.
FD-016: Guidance / outlook language and management forecast changes.
FD-017: Event-time alignment and abnormal-return baselines for Taiwan.
FD-018: Interaction with K-line/price-volume: gap-and-hold, gap-and-fade, no-reaction.
FD-019: Data-source feasibility / historical vintage audit in current repository.
FD-020: Freeze minimal prospective Fundamental Event Shadow schema.


## FD-011 through FD-028 — concept convergence

- Expectation source is part of the surprise variable: true analyst consensus, company guidance, frozen model expectation and simple realized change are separate objects.
- EPS YoY is not SUE. SUE requires actual minus pre-event expectation plus an explicit scale; every expectation/scale variant is a separate experiment.
- Taiwan monthly revenue requires seasonality/calendar controls. YoY acceleration is change-of-growth, not surprise.
- Cash/accrual quality is a genuine missing dimension in current main Worker source. MOPS exposes cash-flow statements, but high accrual must not be simplistically labeled bad/manipulated.
- Margin level, margin change and true margin surprise are separate. Revenue acceleration with margin compression is not automatically bad.
- MOPS/TWSE provide financial forecast / forecast-vs-actual and investor-conference disclosure surfaces, but management guidance is not analyst consensus and coverage is selective.
- Fundamental event studies require exact first-published / first-tradable timing and multi-news guards; date-only events cannot support clean intraday attribution.
- Fundamental information x K-line/price-volume reaction states are frozen; price disagreement with headline fundamentals is itself data.
- Earnings persistence, base effects and mean reversion must be separated from one-quarter growth.
- Accrual effects are entangled with investment/growth/risk; a simple low-accrual ranking is rejected.
- Analyst dispersion/disagreement is conditional and measurement-sensitive; current system has no point-in-time consensus provider.
- Fundamental momentum is a sequence concept but has an overreaction/representativeness counterstate.
- Own-history innovation and peer-relative innovation answer distinct questions and must remain separate.
- Redundancy map against existing fundamentalScore/K-line/PV/RS/attention/regime is frozen.
- Feasibility tiers: official point-in-time events first; cash/guidance second; analyst consensus/revision requires external point-in-time data.
- Concept lane status: CONCEPT_COMPLETE / EVIDENCE_PENDING. Formal Core unchanged.

## Next lane
Derivatives Information & Volatility Surface.
