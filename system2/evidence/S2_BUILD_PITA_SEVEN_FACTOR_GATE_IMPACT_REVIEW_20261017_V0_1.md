# System 2 BUILD｜PIT-A SHORT_MOMENTUM 七因子既有關卡 vs used-input 政策候選差異 V0.1

Date: 2026-10-17 Asia/Taipei
Authority: Class A / research-only impact study, **not an effective strategy or admission change**.
Owner: BUILD_LANE #1132/#1234. SOURCE owner DATA_LANE #1068; independent physical adjudication AUDIT_LANE.

## Why an impact diff now

Owner's 2026-10-17 three-track execution order prioritizes daily Scheme C preview, with daily PIT-A based on the **actual fields used by a frozen strategy/version** and historical PIT-B separately. The previous one-size-fits-all PIT-A historical-issuer/CA rule may demand PIT-B-style coverage from unrelated historical fields. But another error would be worse: dropping actual required price/volume, tradeability, risk or event continuity evidence to make an attractive stock pass.

Current effective gate 1: \`stage1_ca_pit_evidence_gate_v0_1.mjs\` requires global 6 historical CA source contracts, revision/suspension/NO_EVENT scope, independently accepted source completeness and \`CLEAR_NO_ACTION\`. A genuinely documented price adjustment still cannot pass this gate: the later evaluator's \`ADJUSTED_CONTINUITY\` does not override it.

Current effective gate 2: \`stage1_instrument_class_pit_gate_v0_1.mjs\` requires native historical CFI validity through the entire 61-session period, irrespective of whether the *actual launch scorer* reads historical class. Present native CFI still cannot be equated to a current at-cut independent audit; TDR/ETF positives remain excluded.

**Candidate design only:** per \`SHORT_MOMENTUM V0.1-CONTRACT\` / \`0.1-LAUNCH\` actual **7/7 factor uses**, require every used factor's 61 raw-bar original/time, native common-share identity at exact T cut, tradeability at T cut, relevant CA events/negative/revision evidence for each used feature and proven as-of-safe adjusted price-space or a pre-approved safe exclusion. If a factor actually uses historical issuer class, full historical CFI vintage stays mandatory. Market T denominator remains separate and never inferred from a single symbol.

This design is **not yet approved Class B/C**. It cannot change current Stage1 gates, thresholds, ranking, weights, selection, Frozen, Shadow or live outputs until specific future owner approval, actual DATA sources and independent AUDIT physical results.

## Reproducible review build

- \`system2/runtime/pita_stage1_used_input_gate_impact_diff_v0_1.mjs\`: derives live factor exposure from existing full 7-factor BUILD manifest; static two real event-positive SOURCE-only controls; hash-bound review receipt, not an admission result.
- \`system2/scripts/run_pita_stage1_used_input_gate_impact_readonly_v0_1.mjs\`: optional offline create-only JSON review output. No source provider GET or Cloudflare read/write.
- \`system2/tests/pita_stage1_used_input_gate_impact_diff_v0_1.test.mjs\`: eight groups for baseline 7/7, real dated events, factor-native-input exposure, volume caution, exact-cut audit unknown, source code strict-gate assertions, out-of-window/invalid event, incomplete factor and all authority locks.

Baseline with two distinct actual source-only controls from canonical DATA evidence:

| market T | symbol | known in-window event | actual A1 SOURCE | CFI at-cut independent PIT | CA price transform independent PIT | PIT-A |
|---|---|---|---|---|---|---|
| 2026-10-16 | 2330/TWSE | 2026-09-16 ex-dividend | 61/61 source-only | not certified | not certified | 0/1 local |
| 2026-10-16 | 3287/TPEX | 2026-08-26 ex-dividend; source diagnostics \`ma60\`, \`ret60\`, \`priorHigh60\` cross event | 61/61 source-only | not certified | not certified, T 23:45 source-arrival concern | 0/1 local |

Neither symbol has complete T-cut, tradeability and all required used-input independent proof. Their positive known event must **block unsupported unadjusted price-factor treatment**, not cause silent exclusion from all future prospective research or false application of hindsight-adjustment. RISK.LIQUIDITY / PV.RELATIVE_VOLUME have native volume/amount fields, so a cash-dividend *price* break is not identical to raw-volume continuity, but these factors cannot be certified event-neutral without required native scope evidence. The draft forbids bypass by labelling used input as “optional”.

## Falsification, required impact comparison before any Class B/C vote

1. Frozen policy baseline and future candidate must be run on exactly the same genuinely independently audited symbol/date/input universe, not merely compare 0 picks to a partial coverage sample.
2. Real negative controls include 2330/3287 in-window corporate actions, wrong-market company actions, after-cut official arrival, current CFI falsely projected through history, non-common securities, unknown negative NO_EVENT, altered 61-session source window, missing any of seven factors and duplicated periods.
3. A new algorithm must neither use future corrected information nor call synthetic audit SHA a physical AUDIT result.
4. Approval packet must show number eligible/UNKNOWN/rejected with date and full-market denominator, all candidate impact deltas, selected/rank changes, false-positive and false-negative counts, and prospective OOS/Shadow/cost implication. The current real local denominator is just **2 source-positive controls**, not full market.
5. No full-market selected count, zero-pick, rank or Frozen may become non-null from this Class A proposal. D1/R2/Cron/Secrets/paid tiers/new provider GET are excluded. System1 Formal stays LOCKED.

**Exact next action:** DATA #1068 provides original as-of used-input/CA/class/tradeability and source event chain; AUDIT independently signs exact symbol/T/cut; BUILD binds that receipt to this proposed matrix and current Stage1 unchanged, then submits a separate Class B/C admission-policy change for explicit owner review only if supported by actual positive/negative evidence. Until then \`pitA=0/2\`, \`selectedCount=null\`, \`zeroPickDay=null\`, Shadow 0/6 and Frozen 0.
