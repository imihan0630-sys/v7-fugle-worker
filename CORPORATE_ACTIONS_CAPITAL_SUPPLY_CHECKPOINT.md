# Corporate Actions & Capital Supply Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: CA-001 through CA-036 complete.
Status: CONCEPT_COMPLETE / SOURCE_AUDIT_COMPLETE / MATERIALITY_CONFIRMED / CLASS_B_PROPOSAL_READY.
Next: CA-037.

## Durable conclusions
- Announced equity supply/demand and realized share-base change are separate.
- Taiwan buyback purpose matters: employee transfer/equity conversion/cancellation are not equivalent.
- Planned buyback shares are not actual shares bought; execution rate and cancellation are required.
- Buyback announcement is contextual, not automatic bullish alpha.
- Cash capital increase is not automatically bearish; use of proceeds, governance and event stage matter.
- SEO announcement/pricing/ex-right/subscription/allotment/listing are separate clocks.
- Ex-right/ex-dividend/capital-reduction reference prices create mechanical price discontinuities; raw technical gaps must be firewalled.
- Price history adjustment semantics must be audited before K-line/pattern research around corporate actions.
- EPS numerator and share-count denominator effects are separate.
- CB issuance is potential dilution, not immediate realized dilution; new shares vs existing-share delivery matters.
- CB events can interact with SBL/shorting but trader intent is not inferred.
- Conversion terms must be point-in-time/vintaged.
- Net equity supply must combine realized, not merely announced, actions.
- Corporate-action context can explain unusual price-volume/institutional-flow behavior without becoming another score.
- Formal Core unchanged.

## Exact next continuation
CA-022 buyback official data-source audit.
CA-023 cash-capital-increase/new-share source audit.
CA-024 CB issue/conversion data audit.
CA-025 price-history corporate-action adjustment audit.
CA-026 minimal Shadow schema.
CA-027 small multi-date source validation only after source contracts pass.


## CA-022 through CA-030 durable update
- MOPS public treasury queries plus structured U02/U03/U17 feeds establish treasury lifecycle source feasibility; free full machine contract remains partial.
- Cash-capital-increase/new-share lifecycle is multi-source feasible via MOPS, U04/U05/U18 and TWSE ex-right/reference data.
- CB source coverage is strong via public MOPS plus structured U18/U24/U26/U28/U29/U32/U35/U38/U41 and M18; free full historical machine contract remains partial.
- Current Formal history fetch does not pin Fugle adjusted semantics, requests but discards action-aware daily change, and feeds close/high/low directly into return/MA/ATR/platform features.
- Corporate-action reference examples prove mechanical price discontinuities can be large enough to contaminate technical features if unbridged.
- Blind adjusted=true is not approved because of historical-replay look-ahead, benchmark-semantic and share-volume issues.
- Fugle corporate-actions dividends/capital-changes make an isolated Research registry feasible.
- Minimal Shadow schema and source-validation protocol are frozen.
- Any Formal history-semantic correction is Class B proposal-first; no production change.


## CA-031 through CA-036 durable update
- Three-event validation completed: 2412 cash dividend, 4554 ex-right reset, 8422 par-value change.
- Point-in-time reference bridging materially changes return, MA, ATR, support and structure features.
- 8422 is the decisive witness: raw series makes Formal A technical setup fail; target-date-known continuity bridge makes all A setup checks pass.
- Current provider adjusted history is unsafe for historical replay because old event-day traded closes can be rewritten onto a later adjustment basis.
- Class B proposal file created: CORPORATE_ACTION_HISTORY_SEMANTICS_PROPOSAL.md. It is documentation and a test plan only.
- Current latest capital/latest issued-common-share fields are current snapshots and cannot be used as historical shares outstanding.
- Formal Core unchanged.

## Exact next continuation
CA-037 widen the real event sample.
CA-038 research share-volume-unit bridging.
CA-039 run no-action controls.
CA-040 consider branch/test work only if the evidence remains material.
