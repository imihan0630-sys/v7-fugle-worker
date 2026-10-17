# System 2｜每日選股啟動門檻正反複核 V0.2（獨立稽核）

- Date: 2026-10-17 Asia/Taipei
- Baseline main: `c24062ba64810d9a8a6ac63957a348bf81e32fce`
- Target: Correct and qualify V0.1 `S2_AUDIT_DAILY_SELECTION_LAUNCH_GATE_PROPORTIONALITY_20261017_V0_1.md` using explicit pro/con examination.
- Classification: AUDIT_LANE research evidence only. No runnable gate, strategy, source workflow, Cloudflare D1/R2, Cron, source-account, System1 Formal, Frozen, Shadow, push or order changes.
- Current owner-approved product: Scheme C = `NON_PIT_PREVIEW`, `PIT_A_PROSPECTIVE`, `PIT_B_HISTORICAL`; no new authorization inferred.

## 1. Pro/con decision ledger — 12 originally listed constraints

| V0.1 ID | Positive reason to loosen | Negative control / factual objection | V0.2 disposition |
|---|---|---|---|
| L01 Historical full D1/R2 migration | Today’s independent official market source can be read without historical destination backfill. | Must not imply prospective Stage1's actual 61-session factor inputs can be omitted. | **OK**: unhook PIT-B/full migration from NON_PIT_PREVIEW only. |
| L02 Blanket 61-session CFI historic vintage | A current as-of stock-class state can suffice if frozen scorer never uses historical CFI state. | Prior issuer type can still affect event-adjusted price features, listing transitions, IPO eligibility or market membership. Current CFI is not retrospective class proof. | **CONDITIONAL / Class B/C**: formally define USED_INPUT_MANIFEST and positive native T-cut common-share verification; historic intervals remain for historical-class dependent factors. |
| L03 Global 6-family historic CA completeness | Source-wide negative completeness requirement exceeds one symbol’s used factor windows. | Empty CA query != NO_EVENT; adjustments, retractions, share transformations and halt periods may affect moving averages and price levels, even for unobserved events. | **CONDITIONAL / Class B/C**: independent bounded relevant CA coverage (positive/negative/version/time), no unsupported exclusion or blanket PASS. |
| L04 Adjusted-continuity upstream/downstream mismatch | Evaluator accepts ADJUSTED_CONTINUITY, upstream only admits CLEAR_NO_ACTION — genuine code-contract contradiction. | Merely allowing a new enum invites unsupported adjusted prices, adjusted returns and after-cut leakage; real 2330/3287 event windows are not yet complete PIT-A. | **CONDITIONAL / Class B/C**: new version, original native corporate-action transform, as-of independent evidence, real negative cases. |
| L05 61-session/122-pair sources for every preview | A separately specified short-window descriptive 20-session watch could work without 61. | Existing 61-session Stage1/SMA60/ret60/ATR/volume context is not interchangeable with a new 20-session algorithm; incomplete TWSE/TPEx data bias market coverage. | **CONDITIONAL / new version ONLY**: retain old 122/122 collector and full-market promises; separately declare a 20-day limited universe with exact denominator and excluded unknowns. Do NOT make it the current production Stage1. |
| L06 Natural schedule only | The real original signed independent audit may survive a delayed/missed child; manual replay still useful. | Manual/push/PR replay is not evidence that a natural daily source schedule triggered or that report was ready by preferred cut. | **OK** for labelled research display, not scheduler acceptance. |
| L07 T23:45 cut excludes late preview | Post-cut truthful as-of-now observation still informative. | A late T+1 report is unsuitable for a historically qualified same-T Frozen decision/return start. | **OK** for explicitly late label, not past-date PIT. |
| L08 Final rank, D1 Frozen & all Shadow gates before showing anything | Human-readable research candidates need not wait on final formal persistence and permissions. | Without dated immutable **research observation** preservation, the user cannot later show what candidates appeared before subsequent price moves; a GitHub Artifact with short retention is not necessarily durable performance evidence. | **CONDITIONAL**: exempt ONLY formal D1 Frozen/rank; immediately add independent hash/time-bound create-only **non-PIT observation snapshot** with adequate retention, distinct from official frozen trade decisions. |
| L09 Account quota writer gate for read-only previews | GitHub Actions read-only Artifact consumer does not need D1 writer reservation. | The new dest daily Shadow diagnostic DOES actually write and needs provider quota and single writer; 10/12 SOURCE quarantine is not proof latest DEST route still wrong. | **OK**: no writer check for read-only path, never disable D1 writer budget controls. |
| L10 OOS/slippage/backtest before human source-only watch | Descriptive research can be shown before empirical alpha evidence. | May not market preview as profitable, formal trade idea, quantified expectancy or risk-controlled signal. | **OK** for NON_PIT_PREVIEW only. |
| L11 Class CFI missing suppresses all source-only candidates | Unknown-class raw observation can still be useful as raw data. | Source four-digit codes may include TDR, preferred, ETF or otherwise non-common security; users may treat visually ranked items as buyable stocks. | **CONDITIONAL**: label `SECURITY_TYPE_UNKNOWN` and `NOT_TRADE_ELIGIBLE`; exclude known non-common and never call full-market ordinary-share ranking. Verified class/tradeability required for PIT-A and any qualified recommendation. |
| L12 Seven known factor states | Factor dependency/rank redundancy can be researched separately. | Current frozen SHORT_MOMENTUM V0.1 assessor actually checks 7/7 factors; dropping any unknown just to pass turns into silent strategy selection and factor changes. | **NO DIRECT WAIVER**: static dependency and OOS comparison only; exact current factor states unchanged until reviewed strategy version/Owner approval. |

**Count**: 5 OK (L01/L06/L07/L09/L10), 6 conditional (L02/L03/L04/L05/L08/L11), 1 NO DIRECT WAIVER (L12).

## 2. New negative finding V0.1 underemphasized

- `NON_PIT_PREVIEW` must not be relabelled as certified `selectedCount`, zero-pick, Shadow or official D1 Frozen. However **without a durable, dated, immutable observation snapshot even honest research picks cannot later be independently forward-evaluated**. The lightweight research snapshot should be capture-at-time, source hash/market date/strategy-preview version/observed time, symbols and warning states with adequate retention; it does **not** authorize returns or backdating.
- A NEW limited-source preview must neither preserve the old strategy ID/weights nor portray the source population as a complete ordinary stock universe or true TopN. Coverage and missing symbols must be explicit.
- PIT-A / eligibility selection is still blocked for known CA positive events without verified input price-space transform. The narrower gate is a *different safe proof contract*, not the absence of checks.
- Market regime is central to user’s multistrategy design; a purely PV descriptive watch is not a complete multi-strategy stock selector. Mark `REGIME_UNKNOWN` if no evidence and never call all strategies operational.

## 3. Genuine minimal activation sequence

**P0 (already within owner-approved Class A Scheme C):** deliver most recent real T source-limited named descriptive observation with signed original source link; date and actual observation/late time, source bounds, company action/class/sector/regime warnings and preserved immutable NON_PIT observational receipt. This may be marked `RESEARCH_PREVIEW_ONLY`, never BUY or official selected. No full PIT-B, D1/R2 historical migration, OOS, source Cron natural-proof prerequisite for labelled manual replay. For automatic successful delivery SLA, natural source→audit→Scheme C child still independently required.

**P1 (owner Class B/C decision):** a separate pre-approved new SHORT_MOMENTUM Stage1 admission revision, restricted strictly to genuine strategy USED_INPUT factor lineage; T-cut class/tradeability and bounded relevant CA adjusted continuity; compare against frozen old contract with positive and negative market-date/symbol controls, exact independent physical PIT-A Audit and versioned differences before authorization. Preserve existing gates until owner approval.

**P2:** optional versioned 20-day incomplete-coverage preview and factor-redundancy research. Do not substitute for fully official Shadow selection.

## 4. Confirmed limits from latest GitHub source

- Current code: `system2/runtime/stage1_instrument_class_pit_gate_v0_1.mjs` insists on native historical CFI valid through window. `system2/runtime/stage1_ca_pit_evidence_gate_v0_1.mjs` demands global six-family completeness and CLEAR_NO_ACTION; downstream evaluator supports ADJUSTED_CONTINUITY. These contradictions motivate policy proposal, not authorization.
- Latest read-only Scheme C daily delivery contract: a natural **audit child** does not establish original native scheduled Cron origin. GitHub PR/manual replay has distinct label. Last verified 2026-10-16 source-only snapshot included 519 descriptive matches/30 displayed, not a future automatic market T, PIT-A, actual final Shadow, or Frozen.
- Shared Knowledge governance: UNKNOWN must not become PASS/BAD/zero; System1 Formal Core remains isolated.

## Source anchors

- [Initial audit](./S2_AUDIT_DAILY_SELECTION_LAUNCH_GATE_PROPORTIONALITY_20261017_V0_1.md)
- [Owner-approved Scheme C](./S2_OWNER_APPROVED_SCHEME_C_THREE_LAYER_SELECTION_20261017_V0_1.md)
- [Current seven-factor analysis](./S2_BUILD_PITA_SEVEN_FACTOR_GATE_IMPACT_REVIEW_20261017_V0_1.md)
- [PIT-A used-input scope correction](../migration/PIT_A_USED_INPUT_SCOPE_CORRECTION_PROPOSAL_V0_1.md)
- [Current CFI gate](../runtime/stage1_instrument_class_pit_gate_v0_1.mjs)
- [Current CA gate](../runtime/stage1_ca_pit_evidence_gate_v0_1.mjs)
- [Existing Shadow destination workflow](../../.github/workflows/system2-daily-shadow-diagnostic.yml)
- [Scheme C preview consumer](../../.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml)

This file is *falsification and correction of earlier recommendations*. It is NOT a policy change, owner approval, release or physical preview acceptance.
