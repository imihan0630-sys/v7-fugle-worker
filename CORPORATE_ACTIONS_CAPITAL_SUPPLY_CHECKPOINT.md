# Corporate Actions & Capital Supply Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: CA-001 through CA-095 complete.
Status: MATERIALITY_CONFIRMED / RS_SEMANTICS_CONFIRMED / SUSPENSION_INTERACTION_FOUND / CROSS_LANE_PROTOTYPE_TESTED / EXCHANGE_SCOPED_SUSPENSION_CONTRACT / TWO_STAGE_LIFECYCLE_CONFIRMED.
Next: CA-096.

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


## CA-037 through CA-080 durable update
- Corporate-action research has advanced far beyond the initial three-event sample.
- Lifecycle semantics are frozen: price-reference events and realized share-supply/listing events are separate when they occur on different dates.
- Stock-dividend ex-right does not automatically rescale tradable-share volume; later new-share listing is a separate SUPPLY_CHANGE stage.
- Registry sample v0.2 is materialized and v0.1 is superseded for lifecycle semantics.
- Deterministic registry validation spec is materialized. Missing factors/timing remain UNKNOWN; never default to 1/0/no-event.
- Window relevance rule: historyStartDate < effectiveDate <= targetDate.
- Readiness is multidimensional: schema, point-in-time, technical price, technical volume, Price-RS, Total-RS, inference.
- First coverage manifest and readiness-qualified mechanics feature-delta sample are materialized.
- Four mechanics-qualified windows: 2412, 3593, 8103, 8422. 8454 remains excluded from first mechanics-delta sample because first-known/listed-share provenance is incomplete.
- 8422 still flips full A technical setup from raw FAIL to continuity PASS. 3593 proves price-only correction is insufficient because verified share-unit volume handling flips volume checks.
- Official TWSE discovery source map is frozen. TWT48U_ALL supports prospective ex-right discovery; historical public ex-right/capital-reduction/par-value pages plus official announcements provide validation; Data E-Shop documents complete paid historical files.
- Official TWSE historical monthly FMTQIK Price Index and MFI94U Total Return Index contracts are live-validated for 2025-10/11/12 and 2026-06/07.
- First RS semantic sample: 3593 Legacy RS +67.61% vs Price-Compatible +0.21%; 8103 +7.83% vs -6.47%; 8422 -88.67% vs +21.11%. These are semantic/mechanical findings, not alpha claims.
- Research-only Class B prototype exists on branch research/class-b-corporate-action-history-semantics-20260925. Draft PR #101 is open. It changes only research/test files and must not be merged without owner approval.
- No Worker.js wiring, no production deploy, no Formal Core change.

## Exact next continuation
CA-081 prospective daily corporate-action archive contract.
CA-082 bounded historical ingestion/completeness receipts.
CA-083 systematic matched no-action controls.
CA-084 contamination persistence horizon.
CA-085 interaction with history-freshness PR #100 and Pattern dual raw/adjusted spaces.


## CA-081 through CA-090 durable update
- Prospective archive and historical completeness-receipt contracts are frozen in CORPORATE_ACTION_ARCHIVE_SPEC.md.
- NO_EVENT is legal only after complete event-source coverage; otherwise EVENT_COVERAGE_UNKNOWN.
- Matched no-action control design is frozen by date/regime/exchange/sector/price tier/liquidity/market cap/trend/volatility.
- Contamination persistence sample shows numeric feature differences can last about 60 trading sessions; A/B condition/pass differences can persist for weeks.
- Critical PR #100 interaction found: market-wide session continuity alone misclassifies verified symbol-specific capital-action suspensions as stale/gapped.
- Comment added to draft PR #100 documenting 8422/3593/8103 suspension blocker.
- Symbol-session contract frozen: official market sessions minus VERIFIED symbol suspension sessions. Unknown suspension provenance fails closed.
- Draft PR #101 now includes pure suspension-aware symbol-session prototype and fixtures in addition to corporate-action continuity prototype.
- B-130 stale-cache rejection remains logically compatible: only verified suspension removes an expected symbol session.
- Cross-lane handoff spaces frozen: RAW_EXECUTION, TECHNICAL_CONTINUITY, PRICE_INDEX_COMPARABLE, TOTAL_RETURN_COMPARABLE.
- Pattern/K-line research consumes declared spaces and must not create an independent adjustment engine.
- Branch-only research workflow defines Node test commands, but no workflow run was observed; do not claim test-pass evidence.
- No Worker.js wiring in PR #101. No merge/deploy.

## Exact next continuation
CA-091 obtain executable PR #101 test evidence.
CA-092 integration order between PR #100 freshness and suspension/corporate-action context.
CA-093 prospective official suspension archive.
CA-094 multiple actions in one 60-session window.
CA-095 two-stage stock-dividend ex-right -> new-share-listing contamination.

## CA-091 through CA-095 durable update
- PR #101 now has executable GitHub Actions evidence. Research Corporate Action Prototype run `36138447978` passed both corporate-action continuity and symbol-session test suites; companion V8 Repair CI and Regression runs also passed.
- Integration order is now explicit: verified market sessions -> verified exchange-scoped symbol suspensions -> expected symbol sessions -> freshness validation -> corporate-action semantic transforms -> Pattern/K-line consumers. PR #100 must not be promoted as market-session-only freshness.
- Suspension archive scope is widened from TWSE-centric to exchange-scoped TWSE + TPEx. TWSE historical suspension CSV and TPEx Trading Halt/Resumption Trade CSV are official discovery surfaces. Exact direct TWSE TWTAWU payload fields and an exact TPEx machine endpoint remain UNKNOWN until successful capture contracts are archived.
- NO_SUSPENSION is legal only after the symbol's exchange/date/parser lane is complete. Missing cross-exchange coverage remains SUSPENSION_PROVENANCE_UNKNOWN / EVENT_COVERAGE_UNKNOWN.
- PR #101 commit `a6b45a4253648372dcb462f0cacfedea50234775` adds a real 8454 two-stage lifecycle test: 2025-08-21 stock-dividend ex-right plus 2025-10-09 new-share listing inside one rolling window.
- The 8454 test proves event-order invariance, keeps ex-right and supply stages separate, applies price bridging only where appropriate, does not mechanically rescale old share volume, and fails volume comparability closed at SUPPLY_CHANGE.
- Fresh runs on that commit all passed: Research Corporate Action Prototype `36139660200`, V8 Repair CI `36139659976`, V8 Regression Tests `36139660103`.
- This is mechanics/data-semantics evidence, not alpha evidence. No bullish/bearish inference, score, threshold or Formal eligibility change is authorized.
- No Worker.js wiring, no production deployment, no Formal Core change.

## Exact next continuation
CA-096 full 60-session 8454 real-bar lifecycle window.
CA-097 minimum point-in-time denominator contract for SUPPLY_CHANGE volume comparability.
CA-098 TPEx corporate-action suspension/resumption fixture plus exchange-scoped completeness tests.
CA-099 combined PR #100/#101 falsification matrix.
CA-100 evidence-gated owner decision memo only after CA-096..099; no autonomous merge/deploy.

