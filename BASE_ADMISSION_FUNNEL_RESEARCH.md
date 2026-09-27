# Base Admission Funnel Research

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## AF-001 — exact early funnel

Current scoreCandidate basePassed=false exits, in order:
1. close < NT$10;
2. historyDays < 60;
3. missing marketReturn20 or sectorReturn20;
4. missing marketCapYi;
5. marketCapYi < NT$1bn;
6. abs(changePercent||0) >= 9.8;
7. primary 20-day liquidity reject unless low-volume exception;
8. NT$1–3bn special-reason reject;
9. NT$3–10bn extra-liquidity reject;
10. missing chipConcentration.

Everything after this point returns basePassed=true even when rejected.

This ordering matters: a stock failing an earlier policy cannot reveal whether it would fail a later strategy gate. Reconstructing later-gate outcomes for such rows as if Formal evaluated them is prohibited.

## AF-002 — classify policy vs data quality vs strategy hypothesis

Frozen taxonomy:
- UNIVERSE_POLICY: close<10; marketCap<1bn.
- DATA_READINESS: history<60; missing market/sector RS; missing market cap; missing chip concentration.
- MARKET_STATE_PROXY: abs(changePercent)>=9.8.
- EXECUTABILITY_POLICY_HYPOTHESIS: three liquidity/size-conditioned rules.

These categories have different counterfactual meaning. DATA_READINESS failures are not bad stocks. UNIVERSE_POLICY exclusions require a deliberate universe-change study, not ordinary factor tuning.

## AF-003 — Shadow observability

Existing REJECTED_AFTER_BASE cannot capture any AF-001 row because all have basePassed=false.

Existing BROAD_CONTROL is not a complete admission-reject ledger. It has its own sampling/eligibility construction and can systematically exclude or only incidentally include some early rejects.

Therefore early-funnel opportunity-cost claims require reason-stratified prospective controls with sampling denominators.

## AF-004 — highest-value evidence holes

Priority for prospective evidence is based on decision relevance, not on easiest coding:
A. EXTREME_MOVE_PROXY_REJECTED — strategy/risk hypothesis with proven semantic mismatch versus exact exchange limit state.
B. LIQ_PRIMARY_LOW_VOLUME_REJECTED — systematic Shadow hole.
C. LIQ_SMALLCAP_SPECIAL_REASON_REJECTED / LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED — bounded/incidental coverage today.
D. DATA_READINESS rejects — coverage/data-quality diagnostics, not return-based alpha controls.
E. PRICE_LT10 / MARKETCAP_LT1BN — universe-policy controls only if owner later wants to study expanding the tradable universe.

## AF-005 — no denominator-free opportunity-cost estimate

A bounded rejected sample can estimate path characteristics only for its sample. It cannot estimate total rejected count, total missed winners, zero-pick reduction or capital-utilization improvement unless the sampling fraction or full reason count is preserved per scanDate.

Required receipt per reason: eligibleBeforeReasonCount, rejectedByReasonCount, archivedRejectedCount, samplingRule, samplingFraction, unknownCount.

## AF-006 — anti-selection-bias controls

For strategy-hypothesis rejects, preserve at rejection time where already computed: scanDate/exchange/symbol/pool, exact reason and continuous distance to threshold, price/size/sector, liquidity and execution fields with provenance, ATR/RS/regime fields that are PIT-valid, and upstream pass states.

Never fill downstream A/B/RR/fundamental states that Formal did not evaluate unless a separately labeled research-only counterfactual recomputation is performed from immutable same-scan inputs.

## AF-007 — optimization bridge

A base-admission reform can become a FORMAL_OPTIMIZATION_CANDIDATE only when a reason-stratified prospective cohort shows stable opportunity loss after execution/risk controls, across independent dates and relevant price/size/regime strata, with no material MAE/stop/no-follow-through/cost/coverage harm.

Candidate scarcity or idle cash is not sufficient evidence.

Current status: COUNTERFACTUAL_COVERAGE_GAP_CONFIRMED / FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.
