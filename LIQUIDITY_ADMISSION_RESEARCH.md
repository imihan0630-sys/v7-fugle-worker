# Liquidity Admission Gate Research

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## LQ-001 — Current Formal gate

The current after-market selector uses price-tier-specific 20-day average-volume admission:
- close < NT$1,000: minLots = 1,000 lots;
- close >= NT$1,000: minLots = 300 lots.

If avgVolume20Lots is below minLots, the only current exception requires all of:
- avgAmount20 >= NT$50m;
- `spreadPercent` observed and <=0.5%;
- `orderBookDepthGood===true` OR `depthScore>=80`.

Additional market-cap rules:
- 10–30bn NTD: avgVolume20Lots >= 1.5*minLots AND institutionalScore >=70;
- 30–100bn NTD: avgVolume20Lots >=1.2*minLots unless the low-volume exception passed.

These rejection paths occur before quarterly/valuation/sector/A-B/RR gates and return `basePassed=false`.

## LQ-002 — Existing Shadow has a liquidity-selection-bias hole

Current BROAD_CONTROL explicitly requires avgVolume20Lots >= minLots.
Therefore it cannot represent stocks rejected by the primary liquidity gate.

Current REJECTED_AFTER_BASE requires `result.basePassed===true`.
The three liquidity-admission rejection reasons all return `basePassed=false`.

Conclusion:
`LIQUIDITY_REJECTED_CONTROL = ABSENT` in the existing standard Shadow design.

This is materially important because the gate can remove a large part of the universe; without a rejected cohort, the system cannot tell whether the gate is protecting against poor/execution-hostile names or discarding useful opportunities.

## LQ-003 — Low-volume exception input provenance is not proven

Repository-wide source audit finds the Formal exception reads:
- `spreadPercent`;
- `orderBookDepthGood`;
- `depthScore`.

No repository-side constructor/assignment for those exact Formal field names was found.

However this does NOT prove they are absent in Production:
- `normalizeEnrichmentPayload` accepts external stock objects;
- `mergeEnrichment` spreads arbitrary `...extra` fields into the market row;
- `buildMarketFeatures` spreads `...stock` into the feature object.

Therefore an external enrichment provider can populate the fields.

Correct status:
`UPSTREAM_REPOSITORY_PROVENANCE_NOT_FOUND / EXTERNAL_INJECTION_FEASIBLE / PRODUCTION_FIELD_COVERAGE_UNKNOWN`.

Do not call the exception dead.
Do not assume it is live.
Prospective receipt must record field presence and provenance.

The V8.8.1 research microstructure recorder has `spreadPct`, top-five depth and depthImbalance, but those are research-only intraday fields with different names and timing. They are not evidence that the Formal after-market `spreadPercent/orderBookDepthGood/depthScore` inputs are populated.

## LQ-004 — Why gate relaxation cannot be inferred from candidate scarcity

Low BUY frequency / idle capital can originate from:
- no qualified selections;
- liquidity admission;
- A/B setup scarcity;
- RR;
- entry conversion;
- deliberate reserve / second tranche;
- data-quality failure.

Increasing the number of early-admitted stocks is not automatically an improvement.

A liquidity change is useful only if rejected opportunities:
1. survive later quality dimensions sufficiently often;
2. have attractive forward path versus matched admitted controls;
3. remain executable after spread/slippage/depth/cost evidence;
4. do not worsen MAE/stop/no-follow-through or zero-pick robustness.

## LQ-005 — Prospective rejected-control contract

Machine spec:
`research/liquidity_gate_rejected_control_spec_v0_1.json`.

Frozen cohorts:
- LIQ_LOW_AVG_VOLUME_REJECTED;
- LIQ_SMALLCAP_SPECIAL_REASON_REJECTED;
- LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED;
- LIQ_LOW_VOLUME_EXCEPTION_PASS as descriptive positive control.

For every rejected row:
`fullFormalCounterfactual=false`.

Research may compute later A/B technical context descriptively, but it may never state that the stock “would have been a Formal pick” because the production path intentionally stops earlier and later gates remain unproven.

## LQ-006 — First falsification, not threshold search

First test the existing gate as-is.

Primary comparisons:
- exact rejection reason;
- volumeThresholdRatio = avgVolume20Lots/minLots as continuous distance;
- price tier;
- market-cap tier;
- D1/D3/D5/D10/D20, MFE, MAE;
- same-date matched admitted names;
- execution/liquidity evidence where prospectively valid.

Do not search 800/700/500 lots or alternative 300 thresholds after outcomes.

If evidence supports relaxation, the first optimization candidate should be a **reformulation question** (for example, volume+amount+cost/depth evidence), not a lower arbitrary lot threshold chosen from winners.

## LQ-007 — Optimization bridge

Current status:
`EVIDENCE_GAP_CAPTURE_CANDIDATE / NOT_FORMAL_OPTIMIZATION_CANDIDATE`.

Potential future candidate:
`LIQUIDITY_ADMISSION_REFORMULATION`.

It becomes a FORMAL_OPTIMIZATION_CANDIDATE only if prospective rejected-control evidence shows a stable opportunity-cost benefit after:
- execution-cost and spread/depth controls;
- independent scan-date inference;
- price-tier/size/sector/regime strata;
- OOS/holdout;
- downside/false-follow-through;
- zero-pick/capital-utilization impact.

If rejected names are worse, hard to execute, or the apparent benefit disappears after costs, retain the current gate.

No Formal threshold or runtime behavior changed.
