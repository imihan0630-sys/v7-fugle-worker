# System 2 Candidate Capacity Contract V0.1

Updated: 2026-09-27 Asia/Taipei
Status: OWNER-APPROVED CAPACITY INVARIANTS / RESEARCH-ONLY / RANKING FORMULA NOT FROZEN

## Purpose

Turn the already owner-approved candidate/watch capacity rules into an auditable machine contract without inventing a universal cross-strategy score.

This contract is System 2 only and does not alter System 1/V8.

## Frozen capacity invariants

1. Global candidate/watch pool: maximum 12 unique symbols.
2. Per strategy ACTIVE_INTRADAY_MONITOR（盤中主動監控）: maximum 3 symbols.
3. Maximums are not quotas. Never fill a weak or ineligible name only to reach 12 or 3.
4. One symbol with multiple valid strategy memberships consumes one global pool slot.
5. If that symbol is actively monitored under multiple strategies, it consumes one active-monitor slot in each relevant strategy.
6. Strategy memberships, entry/exit state, simulated fills and performance attribution remain separate.
7. Existing global-pool members are revalidated daily and retained while at least one strategy thesis still has meaningful observation value.
8. If one strategy membership fails while another remains valid, remove only the failed membership; do not automatically remove the symbol globally.
9. If more than 12 retained symbols somehow survive revalidation, treat this as an invariant violation rather than silently dropping a name.
10. Actual positions in POSITION_MONITOR（持股監控） remain outside candidate/entry-monitor caps.

## Ranking boundary

V0.1 deliberately does NOT define a universal numeric ranking formula.

The capacity layer accepts:
- retained candidates after strategy-specific revalidation;
- newly qualified candidates already ordered by an upstream, versioned priority policy;
- strategy-local active-monitor order already produced by the relevant strategy.

The capacity layer itself only:
- validates;
- deduplicates;
- preserves memberships;
- enforces maximums;
- records overflow/rejection reasons.

It must not create a total score from heterogeneous strategies.

## Global pool allocation

Order of operations:

1. Revalidate previous global-pool members.
2. Retain every symbol with at least one surviving strategy membership.
3. Remove only globally invalid symbols and freeze the removal reason.
4. Verify retained unique count <= 12.
5. Fill remaining vacancies from the externally ordered new-candidate sequence.
6. Deduplicate by symbol while merging strategy memberships.
7. Stop at 12 unique symbols; all remaining qualified names become CAPACITY_OVERFLOW（容量溢出）, not REJECTED（策略拒絕）.
8. If fewer than 12 valid names exist, keep fewer than 12.

Important:
CAPACITY_OVERFLOW means "valid but no current global slot", not "bad stock" and not "failed strategy".

## Strategy membership schema

Each symbol membership must preserve at least:
- strategyId;
- strategyVersion;
- strategyValidity;
- entryReadiness;
- setupId if known;
- decisionId / frozen evidence reference;
- strategyLocalRank if an approved/preregistered strategy-local rank exists;
- strategyLocalRankVersion;
- reasons / warnings.

A missing strategy-local rank must not be fabricated as zero.

## ACTIVE_INTRADAY_MONITOR allocation

Per strategy:
- only symbols already inside the global candidate/watch pool are eligible;
- strategyValidity must remain VALID;
- candidate should be in an entry-proximate state such as NEAR_ENTRY（接近進場）, ACTIVE_ENTRY_MONITOR（盤中主動監控） or BUY_ELIGIBLE（符合進場條件）;
- the strategy supplies its own preordered sequence;
- take at most 3;
- do not backfill with WATCH / WAIT / TOO_EXTENDED / CONFLICT / BLOCKED names merely to reach 3.

Multi-strategy overlap naturally consumes one slot in each strategy where it is selected for active monitoring.

## No universal winner

A SHORT_MOMENTUM（短線動能） local rank of 1 and a SWING_GROWTH（波段成長） local rank of 1 are not numerically comparable by default.

Any future global priority policy combining:
- regime priority;
- entry readiness;
- confluence;
- strategy confidence;
- concentration risk;
- turnover/opportunity cost

must be separately preregistered and validated before it can decide the order of new names competing for scarce global slots.

## Persistence / churn control

Daily retention is stateful.

Do not evict an existing valid candidate merely because a newly discovered candidate has a superficially higher raw value.
A future displacement policy must explicitly test:
- churn;
- rank-12/rank-13 instability;
- missed opportunity cost;
- observation value;
- strategy/regime changes;
- transaction/monitoring capacity costs.

Until such a displacement policy is validated, V0.1 only fills genuinely vacant slots.

## Required receipts

Each capacity run should preserve:
- prior pool;
- retained symbols;
- removed symbols + reasons;
- newly admitted symbols;
- capacity-overflow symbols;
- merged strategy memberships;
- per-strategy active-monitor assignments;
- global count;
- per-strategy counts;
- input ordering policy/version;
- timestamp and run hash/version.

## Research questions before ranking promotion

1. Does entry-readiness ordering add value over strategy-local rank alone?
2. Does MULTI_STRATEGY_CONFLUENCE（多策略共振） add incremental value after overlap/redundancy control?
3. Should regime priority alter global admission or only active-monitor priority?
4. Does retaining valid incumbents reduce destructive churn, or does it create stale opportunity cost?
5. When 12 slots are full, what displacement rule improves outcomes without date/sector/regime overfit?
6. Do industry concentration warnings need only display/measurement, or eventually a capacity cap?

No answer is assumed in V0.1.

## Current decision

CAPACITY INVARIANTS: OWNER-APPROVED.
RANKING / DISPLACEMENT / GLOBAL PRIORITY FORMULA: RESEARCH REQUIRED / NOT FROZEN.
