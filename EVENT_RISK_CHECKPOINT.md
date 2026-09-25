# Event Risk, Gap Risk & Overnight Information Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: ER-001 through ER-025 complete.
Next: ER-026 source/data feasibility audit.
Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.

## Durable conclusions
- Daily return must be decomposed into overnight and intraday regimes with corporate-action/reference-price guards.
- Taiwan-specific literature supports treating overnight and daytime as distinct regimes, not a simple directional rule.
- MOPS material-information timing creates genuine after-close/pre-open event exposure.
- Scheduled-known and unscheduled events are separate states; NO_KNOWN_EVENT never means no event can occur.
- Stop prices are decision boundaries, not maximum-loss guarantees across gaps.
- Taiwan ±10% price limits can create multi-day constrained-exit/price-discovery risk; historical evidence is mechanism support, not a 2026 directional forecast.
- Limit price state and actual fillability are separate.
- Weekend/holiday duration is exposure time, not direction.
- Event category does not imply bullish/bearish sign.
- Fundamental surprise and price gap are separate layers; no double counting.
- Common-event exposure can create portfolio gap clustering beyond ordinary correlation.
- FIRST/ADD/FULL stages create different event exposure.
- Gap continuation/fill/reversal are outcomes to test, not rules.
- Start with simple market/sector-relative gap decomposition before complex factor models.
- Point-in-time event disclosure/vintage is mandatory.
- Formal Core remains LOCKED.

## Exact next continuation
ER-016 scheduled-event exposure calendar.
ER-017 Taiwan monthly revenue / earnings / investor-conference window semantics.
ER-018 gap-through-stop and limit-down stress.
ER-019 overseas-market lead/lag context.
ER-020 opening-auction / first-15m stabilization.
ER-021 common-event portfolio clustering.
ER-022 event-aware projected heat.
ER-023 falsification/negative controls.
ER-024 prospective Shadow protocol.
ER-025 convergence/readiness.


## ER-016 through ER-025 durable update
- Event-calendar certainty levels distinguish exact known schedules, date-only knowledge, deadline windows, unscheduled disclosures and UNKNOWN.
- Monthly revenue regulatory deadline is not an exact ex-ante publication date. Store regulatoryDeadline, scheduledEventAt, actualPublishedAt and firstKnownScheduledAt separately.
- Gap-through-stop risk is calibrated separately from planned stop risk, with empirical/scenario labels.
- Overseas-market and Taiwan-futures context are explanatory controls for overnight gaps, not duplicate macro scores.
- Opening auction is separated from post-open 5m/15m/30m path.
- Event-specific exposure graphs are preferred over narrative theme clustering.
- Event-aware portfolio heat uses alternative scenario paths rather than double-counting normal stop risk plus gap risk.
- Negative controls require same-stock non-event nights, same-date peers, market/sector residuals and corporate-action guards.
- Prospective ER-024 protocol captures all monitored symbols/dates, not only large gaps.
- No automatic pre-event avoidance, de-risking, gap chase or gap sell rule is approved.
- Formal Core unchanged.

## Exact next continuation
ER-026 audit current repository/runtime source for point-in-time event timestamps, opening/reference-price data and corporate-action guards.
ER-027 determine whether existing recorder can support prospective ER-024 with zero/shared-code changes.
ER-028 prepare research-only event-vintage capture proposal only if needed.
