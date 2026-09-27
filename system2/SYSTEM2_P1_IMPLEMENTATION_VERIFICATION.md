# System 2 P1 Implementation Verification

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH-ONLY CORE VERIFIED / NOT DEPLOYED

## Implemented

- factor/PIT/UNKNOWN validation runtime:
  - `system2/runtime/factor_snapshot.mjs`
- immutable decision/hash builder:
  - `system2/runtime/decision_archive.mjs`
- TypeScript contracts:
  - `system2/src/contracts.ts`
- isolated research schema design:
  - `system2/sql/0001_research_core.sql`
- research core tests:
  - `system2/tests/research_core.test.mjs`

## Storage optimization before deployment

The initial one-row-per-factor physical design was rejected before deployment because full-market capture could create roughly:
- 9.5M factor rows/year at 20 factors;
- 14.25M factor rows/year at 30 factors;
- 28.5M factor rows/year at 60 factors.

V0.2 uses one immutable symbol/day factor bundle with JSON factor observations plus indexed core metadata.

Approximate symbol-day count at 1,900 stocks x 250 sessions is about 475,000 rows/year before strategy-decision rows.

## Tests performed

### Node research-core test
Result: PASS.

Validated:
- KNOWN factor construction;
- deep freezing;
- UNKNOWN cannot carry a fake normalized 0;
- future availableAt cannot be marked PIT-eligible;
- market-regime snapshot construction;
- deterministic decision SHA-256;
- SELECTED cannot contain missing required factors.

A test bug using synchronous `assert.throws` against an async decision builder was detected and fixed to `assert.rejects` before final verification.

### SQLite schema validation
Result: PASS.

The V0.2 SQL executed against an in-memory SQLite database and created 13 `s2_` tables successfully.

This validates SQL syntax/schema construction only; it is not a Cloudflare D1 production deployment.

## Isolation verification

- `Worker.js` was not modified by this System 2 implementation.
- No V8 Formal A/B, 3+3, capital, BUY/ADD/REDUCE/SELL/STOP, monitoring, signal or push behavior changed.
- No System 2 SQL was applied to the V8 production D1 database.
- No System 2 Worker/runtime was deployed.

## Next safe step

Choose/prepare isolated physical System 2 persistence and capture path, then start prospective Shadow data accumulation.

Preferred design: separate System 2 D1/database binding if practical, even if UI/site remains shared.

Any integration that touches V8 production storage/runtime is Class B and requires owner review before deployment.


## Limited Shadow extension verification (2026-09-27)

Status: PASS / RESEARCH-ONLY / NOT DEPLOYED.

Added after the original P1 core verification:
- StrategyContract（策略契約） validator and owner-approved registry;
- StrategyValidity（策略有效性） / EntryReadiness（進場準備度） evaluator;
- source-readiness receipts;
- S2-SM-LS-001 and S2-SG-LS-001 Limited Shadow preregistry;
- Limited Shadow decision builder;
- family-assessment receipts with REQUIRED-factor PIT checks;
- full-universe Shadow run completeness receipts;
- storage row serializers;
- storage design V0.3 + `s2_shadow_runs`.

Verified research-only invariants:
- no numeric score/weight/threshold frozen;
- REQUIRED UNKNOWN fails closed;
- hard invalidation outranks supportive evidence;
- valid-but-overextended remains WATCH;
- BUY_ELIGIBLE is now correctly preserved as QUALIFIED_NOT_SELECTED until a separate ranking/capacity layer enforces global max-12 / per-strategy max-3;
- incomplete/source-gap records are preserved;
- run receipt detects silent universe omissions;
- family receipt refuses to treat PIT-ineligible REQUIRED inputs as KNOWN;
- storage serializers preserve null rank/score and explicit validity/readiness/source states.

Incremental SQLite syntax check for the new `s2_shadow_runs` table and extended `s2_decisions` columns: PASS.

Important:
The code is still not scheduled or connected to physical System 2 persistence. No production D1 migration/deployment was performed.


## Candidate capacity / ranking infrastructure verification (2026-09-27)

Status: PASS / RESEARCH-ONLY / NO RANKING FORMULA FROZEN / NOT DEPLOYED.

Implemented:
- `SYSTEM2_CANDIDATE_CAPACITY_CONTRACT_V0_1.md`;
- `SYSTEM2_RANKING_RESEARCH_PLAN_V0_1.md`;
- `runtime/candidate_capacity.mjs`;
- `runtime/candidate_capacity_receipt.mjs`;
- `runtime/strategy_ordering_receipt.mjs`;
- extended storage serializers;
- research-only `s2_strategy_ordering_receipts` and `s2_capacity_runs`.

Verified:
- global max-12 mechanics;
- multi-strategy overlap consumes one global symbol slot;
- the same overlap can consume one active-monitor slot inside each relevant strategy;
- per-strategy active-monitor max-3 mechanics;
- no forced filling with WAIT / TOO_EXTENDED / ineligible names;
- retained-pool overflow fails closed instead of silently evicting a valid incumbent;
- qualified capacity overflow stays distinct from strategy rejection;
- strategy ordering receipt rejects duplicate symbols and preserves exact ordinals/policy versions;
- candidate-capacity receipt is deterministic under identical inputs;
- storage serializers preserve ordering/capacity metadata;
- incremental SQLite syntax validation for `s2_shadow_runs`, `s2_strategy_ordering_receipts`, and `s2_capacity_runs`: PASS.

Important:
The allocator does not calculate a universal score. It only consumes an already-versioned ordering sequence and enforces capacity.
The actual strategy-local ranking formula and global displacement policy remain research questions.


## Candidate lifecycle verification (2026-09-27)

Status: PASS / RESEARCH-ONLY / NOT DEPLOYED.

Implemented:
- `SYSTEM2_CANDIDATE_LIFECYCLE_CONTRACT_V0_1.md`;
- `runtime/candidate_lifecycle.mjs`;
- lifecycle/re-entry tests;
- research-only lifecycle/re-entry storage tables.

Verified:
- one failed strategy membership does not force global symbol removal when another membership retains observation value;
- a pool state cannot survive when no membership has observation value;
- SIM_FILLED（模擬成交） transitions into POSITION_MONITOR（持股監控）, which is outside candidate capacity;
- terminal candidate episodes cannot be silently reopened;
- re-entry requires a new candidateEpisodeId;
- lifecycle/re-entry receipts are immutable/hashable;
- incremental SQLite syntax validation for the lifecycle/re-entry tables: PASS.

No strategy-specific invalidation threshold was invented; those remain versioned strategy semantics.
