# BUILD PIT-A｜SHORT_MOMENTUM launch Stage1 實際使用資料清單暨准入衝突紀錄（2026-10-16）

Authority: [owner-directed actual used-input scope correction](../migration/PIT_A_USED_INPUT_SCOPE_CORRECTION_PROPOSAL_V0_1.md), [PIT-A / PIT-B split](../migration/PIT_A_DAILY_SELECTION_PIT_B_HISTORICAL_BACKTEST_PRIORITY_V0_1.md), [fixed DATA/BUILD ownership](../SYSTEM2_PIT_DATA_BUILD_OWNERSHIP_AND_HANDOFF_V0_1.md).
Status: **Class A research-only proposal; DOES NOT MODIFY the currently effective Stage1 admission gate or freeze strategy weights.**

## 1. Verified code scope and factors

The target is exactly `SHORT_MOMENTUM V0.1-CONTRACT` with `S2-ASSESSOR-SM-LAUNCH-001 / 0.1-LAUNCH` using `source_first_short_momentum_evaluator_v0_1.mjs`, `stage1_assessor_policies_v0_1.mjs`, `a1_history_primitives_v0_1.mjs`, `strategy_evaluator.mjs`, and `strategy_contracts_v0_1.mjs` on latest GitHub main. The machine-readable read-only manifest `system2/runtime/pita_short_momentum_used_input_manifest_v0_1.mjs` binds these actual contracts and is tested against checked-in code. No other strategy or revised future weights are covered.

| Family | Actually checked Factor ID in launch assessor | Required state / decisive values |
|---|---|---|
| TECHNICAL_STRUCTURE | `TECH.TREND` | known: 5/10/20/60 MA, ret20/ret60; predicate uses MA order, MA20 one-session slope, ret20 |
| TECHNICAL_STRUCTURE | `TECH.STRUCTURE` | known: prior 20/60 high, prior 20 low, MA20 distance, ATR14%; predicate uses distance MA20, hard invalidations also check prior20 levels |
| PRICE_VOLUME | `PV.RELATIVE_VOLUME` | known current lots, prior20 mean lots and relative volume; predicate uses relativeVolume20Prior |
| PRICE_VOLUME | `PV.ACCEPTANCE` | known candle position and upper/lower shadows, distance prior20 high; predicate uses prior20 high distance |
| PRICE_VOLUME | `PV.RESPONSE` | known ret20, ret60 and volatility20; predicate uses ret20 |
| RISK_FRICTION | `RISK.LIQUIDITY` | known prior20 avg volume and transaction amount; severe illiquidity invalidation uses both |
| RISK_FRICTION | `RISK.EXTENSION` | known MA20 distance, prior20 high distance, ATR14%; **no numeric extension threshold is frozen** |

Total **7/7 explicitly observed Stage1 factors** and **3/3 launch required known families**. Missing any necessary metric makes its factor UNKNOWN; the manifest does not waive a known-state check simply because the final predicate reads fewer fields. All seven derive from the official 61-session A1 inputs. Each bar needs date/OHLC/volumeShares/tradeValue/original SHA and as-of availability, and the current bar must reconcile to the same-session official source ledger.

The immutable `SHORT_MOMENTUM` strategy contract has six families: `TECHNICAL_STRUCTURE`, `PRICE_VOLUME`, and `RISK_FRICTION` have `unknownBlocksEligibility=true`; `MARKET_REGIME` is contract **PRIMARY** but currently `unknownBlocksEligibility=false`; `CAPITAL_FLOW` is supportive and `FUNDAMENTAL_QUALITY` context. The launch assessor explicitly emits UNKNOWN for regime and flow. **This is not permission to drop regime/chips in other consumers**, to rewrite the strategy version, or to call a market context complete. `TECH.PATTERN_LIFECYCLE`, `RISK.REWARD_RISK` and the wider strategy contract declare additional factors **not checked as mandatory observations by this one launch assessor**; version changes or future scoring must undergo separate independent audit.

## 2. PIT-A mandatory actual-as-of source groups

1. **A1 and calendar:** 61 original official sessions, matching exact raw OHLCV/turnover and individually protected source SHA; each used source fact observed and available by the real cut, with independent source witness.
2. **CURRENT native ordinary-share identity:** as-of actual T/cut, original CFI `Stocks/ESVUFR` and separate original/auditor SHA, without pretending current classification proves every historic session.
3. **Price-space continuity for exactly the used price features:** corporate action positive events in the 61 sessions must receive true PIT-valid price adjustment lineage or an independently attested exclusion/insensitivity. Unknown relevant events **block** the feature. No silent “all six CA families have no rows so NO_EVENT” shortcut.
4. **TRADEABLE right now:** original trading status, halt/restart, authentic clock, pinned independent evidence at the decision cut.
5. **SOURCE LEDGER / exact-day denomination:** current marketDate and verified all-market source population are required for all-market conclusions; cannot transfer previous date's `1935` to current Oct16. Research-scoped one stock is not a complete day's ranking.
6. **PIT family signature and version:** actual native original source, firstKnownAt/availableAt, external AUDIT hash bound to each used input and strategy/policy version, not a producer self-hash.

## 3. Real physical 2330 evidence and BLOCKERS

As of this version, **2330 TWSE / 2026-10-16** has (a) genuine native original A1 **61/61** + BUILD source-only real readback, and (b) genuine CA six current native original bodies **6/6**, one positive September 16 dividend, separately consumed by BUILD [PR #1420](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1420). Current native share classification has a source-only observed positive. None of these has separately accepted current as-of strategy-level AUDIT or a verified price adjustment/exclusion for the dividend. Actual tradeable status and full current-day universe remain unverified/UNKNOWN; `selectedCount=null`, `zeroPickDay=null`, `Frozen=false`.

**Technical contradiction located (Class B/C candidate):** `source_first_short_momentum_evaluator_v0_1.mjs` accepts continuity state `CLEAR_NO_ACTION` **or** `ADJUSTED_CONTINUITY` at the downstream factor consumption point. Yet its upstream `stage1_ca_pit_evidence_gate_v0_1.mjs` only yields `CLEAR_NO_ACTION` and explicitly rejects any event, including an adjusted one, after blanket six-family historical completeness. Thus a legitimate, independent-rehashed dividend-adjusted event cannot reach downstream in the current pipeline. The old `stage1_instrument_class_pit_gate_v0_1.mjs` also requires 61-session native historical effective-period CFI rows; owner correction says **that old requirement is PIT-B only unless historical class state is itself used**. Neither gate may be changed as a quiet Class-A “bugfix,” since this materially changes effective Stage1 eligibility. Propose a distinct strategy/CA-adjustment contract version and independent source/cut/audit tests for owner Class B/C review.

## 4. Handoff and independence

- **BUILD completed here:** versioned actual used-input manifest and drift/negative tests; no scoring or strategy route modified.
- **DATA #1068:** provide genuinely used T/cut native CFI, CA price-continuity and trading-status proof, plus any other actually used upstream facts; separate PIT-B historical archival continues but cannot automatically block actual valid daily PIT-A.
- **AUDIT_LANE:** independently verify each *actual used input*, native original SHA and cut, including a correctly adjusted/excluded 2330 2026-09-16 dividend or explicitly reject eligibility; independently check actual tradeability and current-day class.
- **OWNER_DECISION_REQUIRED:** after a reviewed strategy impact/invalidation matrix, explicitly authorize or reject any policy change removing historical CFI blanket gate and allowing an independently proven CA adjusted price-space into Stage1.
- **BUILD after approval:** code versioned change, adversarial tests/CI/shadow isolation, and only then a real read-only Stage1 assessor, without all-market or Frozen authority until separately satisfied.

This document is not a completion of real PIT-A acceptance, an independently audited 2330 price adjustment or a trading recommendation.
