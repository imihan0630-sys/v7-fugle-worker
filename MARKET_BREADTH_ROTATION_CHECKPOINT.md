# Market Breadth + Sector Rotation + Leadership Checkpoint

Updated: 2026-09-28 18:05 Asia/Taipei
Current cursor: BR-001 through BR-028 complete.
Next: evidence accumulation plus BR-029 classification-vintage coverage audit; no threshold tuning.

## Durable conclusions

- Breadth is participation, not direction and not a standalone buy/sell rule.
- Literature is mixed: a 64-country study finds predictive breadth effects, while a broad study of 93 technical market indicators finds little robust/economic return predictability. Both sides are retained.
- Three universes must remain separate: official whole-market breadth, common-stock research breadth, Formal eligible-universe breadth.
- Current source sector breadth is NOT whole-market breadth because `normalizeMarketRow()` filters non-common instruments and close < NT$10 before `buildTodaySectorStats()`.
- Current system already has one-day sector breadth, average change, amount/volume activity, top-3 leaders and a sector hard gate. New research must not duplicate them.
- Highest incremental value is temporal breadth, participation divergence, new-high/MA participation, leadership concentration, sector-rank rotation and cross-sector correlation state.
- Breadth divergence should first be interpreted as concentration/participation divergence, not automatic reversal.
- New-high/new-low and MA breadth have substantial redundancy risk with current momentum/K-line/Residual RS and require incremental tests.
- Industry momentum has strong historical evidence but can weaken when cross-industry correlation rises.
- Sector rotation is a transition in relative leadership/participation; it is not merely today's top-return sector.
- Trade amount is activity, not capital inflow; do not mislabel it.
- Taiwan official data support market-level breadth: TWSE OpenAPI TWTaZU and TPEx official after-trading stats. Stock-level TWSE/TPEx daily data can support common/eligible breadth with explicit universes.
- First prospective market+sector feature set and hypotheses are frozen; no outcome-tuned threshold.
- Formal Core remains LOCKED.

## Existing-source finding

`buildTodaySectorStats()` currently computes:
- one-day positive-stock breadth;
- avgChange;
- amount/volume vs 20D;
- estimated institutional net value;
- top 3 daily leaders;
- composite sector score.

Formal candidate filtering currently rejects a sector when:
- breadth < 40%, OR
- avgChange < -1%, OR
- amountVs20DayAverage < 0.5.

This is existing production logic, not a newly approved research conclusion. The new lane will test its context/redundancy but will not modify it.

## Exact next continuation

BR-011: Breadth thrust / sudden participation expansion — distinguish practitioner concept from robust evidence.
BR-012: Breadth deterioration before/after market peaks — duration and false-alarm problem.
BR-013: Cross-sector correlation / dispersion as a rotation-environment variable.
BR-014: Leadership diffusion lifecycle: leader-only -> widening -> broad -> narrowing.
BR-015: Sector-strength decomposition to test whether current one-day hard gate is redundant or potentially information-losing, research-only.
BR-016: Point-in-time universe / listings-delistings / industry reclassification data quality.
BR-017: Build redundancy map against current sector score, Residual RS, PV, K-line, Regime.
BR-018: Decide whether existing official data permit zero-code/prospective snapshot research before any new collector/schema proposal.


## BR-011 through BR-025 — concept convergence

- Breadth thrust is retained as participation acceleration, but no named/fixed folklore threshold is adopted.
- Breadth divergence requires duration/false-alarm measurement; first interpret it as concentration/participation divergence, not an automatic market-top signal.
- Cross-sector correlation and return dispersion condition whether sector rotation is distinct from market beta.
- Leadership is modeled as a lifecycle: leader-only -> early diffusion -> broad participation -> possible late broadening -> narrowing -> leadership break.
- Existing Formal sector gate (breadth >=40%, avgChange >=-1%, amountVs20DayAverage >=0.5) is frozen production truth, not proof those thresholds are optimal. Research must test the current gate first rather than threshold sweep.
- Point-in-time universe and industry classification are mandatory. Current price histories do not freeze historical industry identity per bar; historical sector reconstruction with current classifications carries look-back risk.
- Concentration panel frozen: cap-weighted return vs equal-weight return vs median stock plus advance share/dispersion.
- Sector rotation uses continuous rank transition / percentile movement instead of only Top-N membership.
- Industry momentum is multi-horizon and classification-sensitive; evidence is not universal across countries/samples.
- Stock RS x sector state is a four-state interaction study, with no state pre-declared superior.
- Leadership concentration uses contribution shares/HHI/effective leaders with UNKNOWN semantics when denominators are unstable.
- Prospective breadth snapshot schema and readiness gates are frozen.
- Historical broad/sector claims remain data-quality limited by stale-history, survivorship and historical classification issues.
- Concept lane status: CONCEPT_COMPLETE / EVIDENCE_PENDING. Do not create more breadth indicators before evidence accumulates.
- Formal Core unchanged.

## Next lane
Open Fundamental Information Dynamics: distinguish fundamental level, change, surprise, revision and market price reaction.


## BR-026 — Sector-gate provenance capture deployed; evidence accumulation starts prospectively

- Production audit confirmed that pre-V8.14 evidence was insufficient to falsify the existing sector hard gate:
  - `researchMarketContext.advancePct` was Formal-normalized breadth, not official whole-market breadth;
  - Shadow snapshots lacked the actual gate inputs breadth / avgChange / amountVs20DayAverage;
  - gate failure short-circuits `scoreCandidate()`, so rejected names do not have a valid full gate-bypassed Formal RR/eligibility result.
- V8.14.0 `SECTOR_GATE_AUDIT_V0_1` now freezes the PIT gate inputs, each pass/fail check, combined state and exact 40% / -1% / 0.5 thresholds inside existing research-only Shadow snapshots.
- Market breadth context now declares its universe explicitly as `TWSE_TPEX_COMBINED_FORMAL_NORMALIZED` and `officialWholeMarketBreadth=false`.
- New bounded `SECTOR_GATE_REJECTED` cohort: exact existing sector-gate reject reason, deterministic A/B-closeness ordering, max 6 per pool per scan. This is not a full rejected-universe archive.
- A/B technical context is recorded with `fullFormalCounterfactual=false`; it must not be interpreted as “would have been a Formal pick if the sector gate were removed.”
- Deployment evidence: PR #111; merge `eb1ef7f1d86a8013c0fd58d97cdfaa7369f677e7`; PR Regression 36234970884 SUCCESS; PR Repair 36234970803 SUCCESS; main Regression 36235023368 SUCCESS; Cloudflare Deploy 36235023379 SUCCESS.
- Formal sector gate, A/B logic, ranking, quotas, capital and all operation signals remain unchanged.

### Frozen first evidence protocol
- Start only with clean post-deploy PIT scans.
- Minimum first descriptive review: >=20 independent clean scan dates with mature D1/D3/D5 outcomes.
- Compare frozen gate-pass context versus bounded `SECTOR_GATE_REJECTED`.
- Outcomes: D1/D3/D5 return, MFE, MAE, false-breakout / stop-risk where observable.
- Stratify which component failed: breadth, avgChange, activity; preserve multi-failure rows.
- Condition on A/B technical readiness, sector RS, Price-Volume, setup quality and market regime.
- Inference unit = scan date; use date clustering / leave-one-date-out.
- Do not sweep 40% / -1% / 0.5 for a prettier result.
- Because the rejected cohort is bounded, do not estimate full-market opportunity loss from it.

Status: `WAITING_PROSPECTIVE / NOT_OPTIMIZATION_READY`.
First expected valid cohort: 2026-09-29, conditional on V8.12 history/source admission.


## BR-027 / BR-028 — 07-room integration checkpoint

### New durable conclusions
- Industry classification is a PIT variable. Current labels must never be backfilled into historical Sector RS / breadth / rotation studies. TWSE effective-dated reclassification evidence makes bounded Taiwan PIT membership feasible, while complete historical machine-readable coverage remains UNKNOWN.
- Taiwan-specific counterevidence means Sector RS cannot receive a permanent positive sign. Industry momentum / reversal depends on horizon, taxonomy, market and regime.
- Sector price strength must be decomposed from participation concentration and then tested against physical-cycle evidence. A leader-dominated sector move is not equivalent to broad industry confirmation.
- Physical-cycle confirmation must stay separate from price confirmation: production / sales / inventory / capacity / pricing / company transmission can disagree, and disagreement is itself a research state.
- Do not create a new composite industry score yet. Preserve the state vector and test interaction states prospectively.
- Existing System 1 same-day sector breadth / avgChange / amount activity / hard gate remain unchanged and become baseline controls for incremental tests.
- The six-layer Industry Cycle Confirmation Stack is a direct research bridge to System 2's owner-approved `INDUSTRY_THESIS` family, whose source readiness remains incomplete.

### D09 maturity decision
`D09-01 產業分類與分類Vintage`: L2 -> L3.
Reason: official Taiwan effective-date reclassification evidence establishes decision-time classification feasibility for prospective and bounded historical research. This is a PIT-feasibility upgrade only; it does not claim complete historical membership coverage or automation.

### Explicit non-upgrades
- D09-02 Sector RS remains L3: mechanism / Taiwan PIT feasibility already exist, but prospective/OOS evidence is not yet sufficient for L4.
- D09-06 Sector Rotation remains L2: concept is mature, but a clean PIT rank-transition cohort is still evidence-pending.
- No breadth / rotation threshold, sector hard gate, priority weight or Formal score changed.

### Exact next continuation
BR-029: audit effective-dated classification source coverage and define `classificationSchemeId / effectiveFrom / effectiveTo / knownAt` receipt.
BR-030: when the first valid V8.14 prospective sector-gate cohort exists, compare leader-only versus broad participation without tuning thresholds.
BR-031: join those observations to the D10 physical-cycle state by information date, preserving separate clocks and UNKNOWNs.
