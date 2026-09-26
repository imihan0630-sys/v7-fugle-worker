# System 2 Bridge from V8

Updated: 2026-09-26
Status: ACTIVE BRIDGE V0.1

## Objective

Allow System 2 to reuse V8's accumulated research and selected infrastructure without coupling System 2 strategy behavior to V8 Formal Core.

## What can be shared

### Knowledge
All reusable market research indexed by `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md`.

### Data/source experience
Where safe and licensed/authorized, System 2 can reuse proven source contracts or source knowledge for:
- TWSE/TPEx universe and market data;
- institutions;
- TDCC ownership brackets;
- financials/monthly revenue;
- valuation;
- announcements/corporate actions;
- benchmark/industry data;
- research PIT metadata.

Reusing a source does not mean reusing V8's selection thresholds.

### Research methodology
PIT, UNKNOWN semantics, prospective Shadow, purged OOS, redundancy, costs, date clustering and overfit controls.

## What is not shared automatically

- A/B definitions;
- Top6 and 3+3 quotas;
- V8 ranking thresholds;
- V8 BUY/ADD/REDUCE/SELL/STOP logic;
- V8 capital allocation;
- V8 signal/push states;
- production Cloudflare bindings/secrets;
- V8 Formal optimization decisions.

## Decision-boundary rule

The bridge is **not** an approval path.

System 2 never sends a candidate to V8 for permission to select, enter, hold, reduce or exit. V8 A/B rules and V8 15-minute confirmation have zero authority over System 2 decisions.

If a future comparison screen displays both systems side by side, that is observation/benchmarking only:
- System 1 decision remains System 1;
- System 2 decision remains System 2;
- disagreement is preserved as research evidence rather than forced into one answer.

Any future data exchange must preserve this independence.

## Known motivation

V8 is intentionally selective. Historical research has identified low candidate/BUY-trigger opportunity and capital-utilization concerns, but this does not justify weakening V8. System 2 explores alternative strategy families under separate validation.

## Safety

Any shared runtime or production data-path change that can indirectly affect V8 is Class B under `RESEARCH_ENGINEERING_GOVERNANCE.md` and requires owner review before production promotion.
