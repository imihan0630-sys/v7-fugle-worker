# D03 SHORT_MOMENTUM strategy-clock over-gating readback

Updated: 2026-10-07 Asia/Taipei

## Decision

Accept the D16/S2-CORR-20261007-002 finding as a D03 sampling and common-support blocker. Do not reinterpret the global Decision Clock as SHORT_MOMENTUM strategy readiness, and do not use globally blocked dates as natural zero-pick evidence.

## Support

- Frozen SHORT_MOMENTUM Stage-1 required families are TECHNICAL_STRUCTURE, PRICE_VOLUME and RISK_FRICTION plus universal PIT/session/source-integrity safeguards.
- B2 INDUSTRY_THESIS and A5 FUNDAMENTAL are not frozen SHORT_MOMENTUM launch requirements.
- Current global clock uses A1 TWSE + A1 TPEx + B2 for same-session readiness and also requires A5 by the candidate boundary.
- Prospective run 37577209442 observed A5 coverage true, B2 coverage false and global requiredReady false.
- The correction queue and D16 validation agree that GLOBAL_REQUIRED_SET differs from SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET.

## Counterevidence and alternative explanation

- The global clock can remain valid for genuinely cross-strategy uses that require A1+B2+A5.
- This evidence does not prove SHORT_MOMENTUM has alpha, nor that any blocked date would have produced a pick or profit.
- A blocked date can reflect strategy-required A1/integrity failure, an irrelevant-source over-gate, or a true evaluated zero-pick; these states must not be collapsed.
- One prospective mixed-source date does not establish outcome magnitude, frequency or regime persistence.

## D03 inference firewall

Required per-strategy denominators:
- expectedStrategyOpportunityN;
- strategyRequiredReadyN;
- universalIntegrityReadyN;
- strategyEvaluableN;
- policyDisabledN;
- naturalZeroPickN;
- dataUnknownN;
- irrelevantSourceMissingButNonBlockingN.

Required clocks and identity:
- strategyId / strategyVersion / stageId;
- dependencyContractVersion;
- universalIntegrityContractVersion;
- candidateReadyAt / evaluationReadyAt;
- source-generation identities and blockers.

## Validation and bias disposition

- PIT: later B2/A5 arrival cannot backdate SHORT_MOMENTUM candidateReadyAt.
- OOS / walk-forward: UNKNOWN; corrected runtime and prospective receipts do not yet exist.
- Selection bias: global gating can create informative censoring if unrelated-source readiness covaries with stress, sector events or publication timing.
- Look-ahead: post-boundary source arrival cannot rehabilitate an earlier decision row.
- Multiple testing / overfitting: no outcome, parameter or threshold fit.
- Factor redundancy: B2/A5 must not be counted as missing D03 factor evidence when the frozen strategy does not consume them.
- Date clustering: current physical example is one trading date.
- Cost, fillability and market-state dependence: UNKNOWN.
- Incrementality: System1/System2 comparison requires strategy-specific common-support rows after correction; otherwise apparent diversification can be mechanical missingness.

## Maturity

- D03 remains 56.7%.
- D03-09 and D03-10 remain L2/40.
- Outcomes remain CLOSED.
- Formal Core remains LOCKED.
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

## Exact next

Primary next remains the physical Layer-B lifecycle-event-union rehabilitation receipt. In parallel, consume S2-CORR-20261007-002 only after BUILD_LANE produces corrected strategy-specific readiness and a genuine trading-date mixed-dependency receipt showing SHORT_MOMENTUM evaluable while irrelevant B2/A5 are unavailable, SWING_GROWTH remains blocked, and A1/universal-integrity failures still fail closed. Preserve pre-fix over-gated rows as defect evidence.
