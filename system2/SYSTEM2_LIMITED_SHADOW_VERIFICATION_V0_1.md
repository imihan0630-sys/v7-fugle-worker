# System 2 Limited Shadow Verification V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH-ONLY CODE CONTRACT VERIFIED / NOT SCHEDULED / NOT DEPLOYED

## Scope

Verified the first Limited Shadow（有限影子模擬） decision contract for:
- S2-SM-LS-001 — SHORT_MOMENTUM（短線動能）
- S2-SG-LS-001 — SWING_GROWTH（波段成長）

No live trading, push, V8 Formal, production D1 or Cloudflare behavior was changed.

## Implemented

- `system2/runtime/limited_shadow_v0_1.mjs`
  - freezes source-aware Shadow specs;
  - maps StrategyValidity（策略有效性） + EntryReadiness（進場準備度） to the existing immutable decision archive;
  - stores rank/totalScore as NULL in V0.1;
  - preserves source-readiness warnings;
  - freezes INCOMPLETE decisions instead of dropping them.

- `system2/tests/limited_shadow_v0_1.test.mjs`
  - owner-approved contract selection path;
  - REQUIRED evidence missing path;
  - valid-but-TOO_EXTENDED path;
  - source-blocked strategy rejection path.

- `system2/src/contracts.ts`
  - optional Shadow decision metadata for strategy validity, entry readiness, source readiness, shadow spec and evaluation mode.

- storage design V0.3
  - explicit strategy_validity;
  - entry_readiness;
  - source_readiness;
  - shadow_spec_id;
  - evaluation_mode.

## Verification result

PASS for the research-only logic harness.

Confirmed:
- VALID + BUY_ELIGIBLE -> SELECTED;
- REQUIRED family UNKNOWN -> INCOMPLETE + BLOCKED and is still frozen;
- VALID + TOO_EXTENDED -> WATCH, not REJECTED;
- rank and totalScore remain NULL;
- strategy validity and entry readiness remain separate in the frozen record;
- source-blocked strategies are not permitted to create Limited Shadow decisions;
- committed Limited Shadow test module parses successfully.

The existing `research_core` verification already covers deterministic immutable decision hashing and UNKNOWN->0 prohibition.

## Important limitation

The current verification proves contract/state-machine behavior, not stock-selection alpha.

The Limited Shadow layer does not yet calculate every strategy family state directly from raw exchange/fundamental sources. It consumes validated family assessments and freezes the resulting decision.

Therefore:
- no claim that S2-SM-LS-001 or S2-SG-LS-001 is live;
- no claim that a daily full-market scan is currently accumulating;
- no claim that any strategy threshold is empirically validated;
- no historical Shadow record may be fabricated.

## Persistence blocker

Always-on prospective Shadow accumulation still needs an isolated physical System 2 persistence + scheduled capture path.

Preferred:
separate System 2 D1/database binding.

If the only available implementation path touches V8 production runtime/storage, it becomes Class B and requires owner review before promotion.

## Next research-engineering step

Before persistence deployment:
1. define factor-family assessment receipts that make the provenance from raw factor observations -> family state explicit;
2. define full-market capture completeness accounting so every stock is either evaluated or has a frozen reason why it was not;
3. define source-session receipt and run-level fingerprint;
4. then connect the recorder to isolated persistence when available.

This keeps the future Shadow archive auditable and prevents selected-only survivorship.
