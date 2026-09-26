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
