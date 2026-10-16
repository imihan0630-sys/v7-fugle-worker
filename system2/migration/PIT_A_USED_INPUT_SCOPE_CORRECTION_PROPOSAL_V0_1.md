# System 2｜PIT-A 每日選股依實際使用資料驗證：糾偏方案 V0.1

Date: 2026-10-16 Asia/Taipei  
Status: **OWNER-DIRECTED DESIGN CORRECTION — CLASS A RESEARCH/DIAGNOSTIC IMPLEMENTATION ONLY; CLASS B/C EFFECTIVE STRATEGY ADMISSION NOT ACTIVATED**  
Owner correction follows the earlier PIT-A daily-first / PIT-B historical-parallel approval. This file supersedes the *proposed future research requirement scope* in the previously over-broad PIT-A planning ledger, but **does not silently modify** the existing BUILD Stage1 assessor or its already-approved admission gate.

## Diagnosis: the deadlock was an evidence-scope error

Previously, a **single current daily-selection candidate** was rejected unless all sixty-one previous calendar sessions had independently reproduced issuer CFI effective-version history and all six families of complete historical corrections/cancellations/NO_EVENT negatives. That is a **historical-replay level completeness target**, and is not intrinsically required to answer whether a **particular data field used by a daily strategy** was actually available at a **real as-of decision time**.

PIT means **no used input was learned after the decision**. It does not mean every conceivable source and historical revision series must be fully reconstructed even if the factor does not use it. Conversely, a data feed present at decision time is insufficient if the strategy uses a derived signal whose window crosses an unhandled dividend, capital reduction, suspension, price-adjustment or security-type transition.

**One strategy's unused factor ≠ all strategies' unused factor.** Each strategy/version must declare its exact used input columns, window, transform, optional/exclusion policy, market Regime and materiality before any BUILD selection-use approval. No ad-hoc user-supplied `isUsed=false` flag; do not erase a critical missing feature to get a PASS.

## PIT-A as-of used-input acceptance (future BUILD interface)

Each daily candidate must produce the following **separate** evidence axes, with exact symbol/market/marketDate/asOfDecisionCut/source native body SHA/first physical observation/original first-known provenance/availableAt:

| Input or group | Daily PIT-A conditional policy | Do not mistake for |
|---|---|---|
| Exact 61-session price / volume bars, if 61 bars are used | REQUIRED: official calendar, 61 real raw rows, source identity, all observed/available before real cut and independent readback | Full historical issuer first-publication archive for research replay |
| Ordinary common-share identity | REQUIRED at the actual selection instant; native current issuer classification valid as of actual cut and independent audit | Automatic assumption that today's `ESVUFR` was valid for every prior historical date |
| Price continuity for **used** price-volume features | REQUIRED: known dividend/split/reduction events that materially affect the used window/transform must be handled, adjusted with PIT-valid data or excluded with a proven safe policy | Six current CA tables alone proving the absence of all historic events |
| Current halt / reinstatement / tradeability | REQUIRED at the actual cut and exchange-native observed/available before cut | No previous suspensions anywhere in history |
| Market Regime, institution/flow, technical, industry, fundamentals, valuation, catalysts | REQUIRED **only where the exact strategy/version consumes them**; every utilized upstream datum, date and transformation must pass as-of/PIT | An optional factor silently dropped or replaced with neutral 0 merely to authorize selection |
| Historical 61-session CFI original issuer versions | PIT-B research/backtest DEFAULT, PIT-A required **only if the daily strategy uses earlier class state, IPO eligibility or historic-class-dependent factor** | Blanket mandatory gate for strategies using only current valid security type |
| All-six-family historical authoritative `NO_EVENT` coverage | PIT-B archive completeness DEFAULT; PIT-A needs bounded **relevant event coverage / material price-continuity or tradeability** for **features it uses**, with unknown relevant events still BLOCKED | Non-event assertion from an empty/absent current row |
| Pre- / post-disclosure records | Use precise firstKnownAt, availableAt, revision effective version, source clock; no future releases | Replacing unknown original clocks with source download time or retrospective press release dates |

This is **not** a proposal to ignore company actions. For example, the REAL 2330 ex-dividend event 2026-09-16 falls **inside its 2026-07-21—10-16 61-bar input window**, so any cross-event return, breakout or average that depends on the unadjusted price discontinuity **fails** until an independently checked source-correct corporate-action transform or verifiable exclusion/robust computation is provided. No invented adjustment algorithm or favorable selection allowed.

## PIT-B full historical backtest remains independently complete

Each hypothetical old decision T can use **only** historical native versions and initial source/publication clocks physically supportable by that old T. Backtests with insufficient historical issue class/effective version, CA revision/retraction/suspension or negative coverage **stay UNKNOWN and cannot be reported as PIT-certified**. Old frozen decisions are never edited to match today's data.

## Real 2330 input baseline, not an admission claim

- [Real DATA one-date TWSE T source](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38908458028) original at `2026-10-16T13:31:18.152Z`; **real 61/61** exact previous + same-day A1 original byte and symbol-bar hashes [main replay](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38909699033); source-only independent readback, not full strategy audit.
- Native `2330` Stocks / `ESVUFR` actually observed 2026-10-16 17:04 Taipei [native CFI](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38877910182), but current as-of class must still be separately accepted for the exact cutoff.
- [Six original CA family snapshots](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38910741802) observed 2026-10-16 21:48 Taipei, physically 6/6 bodies rehashed [source-only symbol extraction](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38911839798), with one actual 2330 ex-dividend 2026-09-16. **Source snapshots do not prove historically revision-complete CA or 2330 price-space correction**. Other five CA native tables currently without 2330 do **not** imply NO_EVENT.
- Trading-status at current cut and any actually-used market/chips/industry/financial input still require their own source-clock/audit facts. Earlier [prospective clock run](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38883865583) found B2 same-date dependency incomplete; if BUILD's pinned policy uses that dependency, it must stay UNKNOWN.
- Today 2026-10-16 **full current-market class-certified denominator remains UNKNOWN**, must NOT inherit Oct15 original 1,935 source-instrument count. Oct15 frozen historic 0/1935 UNKNOWN intact. This proposed gate does **not** assert one eligible stock, one selected stock, a zero-pick day, Shadow, or Frozen.

## Implementation order and protected admission boundary

1. **DATA_LANE / Class A:** publish *source-only* evidence/use diagnostics with immutable native hashes and actual observed availability; existing offline pure `system2/migration/pita_daily_asof_used_input_gate_v0_1.mjs` tests the four basic data-source facts, proves mandatory missing values cannot be skipped, and explicitly keeps `stage1EvaluationAuthorized=false`, `fullPITScopeAccepted=false`.
2. **BUILD_LANE:** propose one immutable per-strategy/version **USED_INPUT_MANIFEST** based on the actual SHORT_MOMENTUM source evaluator and market regime / institutional factors (not guesses), show which historical issuer-effective or CA lines are actually used, and link every required feature upstream to a native original source+exact cut. Factor drop/weight/threshold changes require separate strategy version and owner approval. Existing `pit_first_symbol_microbatch_preflight_v0_1.mjs` must remain untouched until the reviewed material admission-policy change is explicitly accepted.
3. **AUDIT_LANE:** independent run/artifact/body hash, true as-of clocks and each **required** factor input; certify `PIT_A_USED_INPUT_SCOPE_INDEPENDENTLY_ACCEPTED` only for exact symbol/date/strategy version **after** the revised contract is approved, while still requiring more comprehensive PIT-B for historical backtests.
4. **OWNER:** material relaxation/redefinition of an existing *effective* Stage1 admission gate is **Class B/C approval**; this 2026-10-16 request authorized diagnosis and preparation, NOT auto activation in production, new Cron, D1, Frozen or System1. A separate reviewed PR/strategy version can make the proposed conditional rule operative after evidence/impact assessment.
5. **BUILD selection:** even a genuinely accepted one-symbol PIT-A input only permits appropriately isolated read-only assessor evaluation under an approved contract; incomplete market = not full-market ranking, `selectedCount=null`, `zeroPickDay=null`; Frozen/Shadow and D1 writes require their own signed gates.

## Falsification tests

- Known 2330 dividend present + no verified adjustment/exclusion ⇒ fail closed.
- Current CFI observed but not audited as-of the exact cutoff ⇒ UNKNOWN.
- A1 60/61 or post-cut capture ⇒ UNKNOWN.
- Missing current trading status ⇒ UNKNOWN.
- Claimed unused chip/industry while strategy actually uses it ⇒ reject until true manifest owner binds it.
- Current CA snapshot with no 2330 rows ⇒ NEVER `NO_EVENT`.
- DATA self-signed audit digest without independently pinned AUDIT_LANE result ⇒ NO Stage1.
- Synthetic positive four-factor unit test ⇒ test of correctness only, **not** real 2330 PIT=1.
- PIT-B-only historical revision certificate must not automatically substitute for current as-of evidence.
