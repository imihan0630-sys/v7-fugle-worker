# Corporate Actions & Capital Supply Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: CA-001 through CA-112 complete.
Status: MATERIALITY_CONFIRMED / RS_SEMANTICS_CONFIRMED / SUSPENSION_INTERACTION_FOUND / CROSS_LANE_PROTOTYPE_TESTED / EXCHANGE_SCOPED_SUSPENSION_CONTRACT / TWO_STAGE_LIFECYCLE_CONFIRMED.
Next: CA-113.

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

## CA-096 through CA-100 durable update
- Full real 8454 61-bar mechanics artifact materialized: `research/corporate_action_8454_full_window_v0_1.json`.
- Source-semantic falsification retained: Fugle FCNT000154 returned `adjusted:true` even when requested with `adjusted=false`; it is prohibited as raw evidence for this study. FCNT000002 preserves the raw 272 -> 261 ex-right discontinuity and is used for the real-bar witness.
- On 2025-10-09, 8454 ex-right contamination has aged out of 20-session price features but remains in 60-session features: ret60 raw -0.77% vs continuity +4.19%; MA60 about 259.62 vs 253.99; priorHigh60 287 vs 273.33. Full A/B setup does not flip in this witness.
- Volume semantics are split in `CORPORATE_ACTION_VOLUME_DENOMINATOR_SPEC.md`: RAW_SHARE_VOLUME, ISSUED_SHARE_TURNOVER and FREE_FLOAT_TURNOVER are separate spaces. Pure SUPPLY_CHANGE does not invalidate factual raw share-volume prints.
- Exact share denominators must use direct official point-in-time counts, not nominal stock-dividend ratios. 8454 official counts are 252,357,405 before and 264,975,275 after the 2025 increase; naive 5% backsolve is off by five shares. CA-096 artifact corrected accordingly.
- Real TPEx 5314 par-value-change suspension/resumption fixture added to PR #101: suspension 2025-03-20..03-28, resume 2025-03-31, expected prior symbol session 2025-03-19.
- Combined falsification matrix added: verified suspension / unknown suspension / B-130 stale cache / multiple actions / no-action identity.
- First integrated research run `36140962127` failed because the TPEx test asserted a field outside the validator return contract. The test, not the prototype, was corrected. Failure history is retained.
- Current PR #101 head `6729c56d045d993c58cd89290411d45a5b394142`: Research run `36141243309`, V8 Regression `36141242876` and V8 Repair `36141243153` all succeeded. Integration matrix step explicitly executed and passed.
- Evidence-gated owner memo materialized: `CORPORATE_ACTION_OWNER_DECISION_MEMO.md`. No owner option selected automatically.
- PR #100 remains blocked from promotion as market-session-only freshness. Symbol-session provenance is prerequisite.
- No Worker.js wiring from PR #101, no production deployment, no Formal Core change.

## Exact next continuation
CA-101 harden point-in-time issued-share denominator sourcing across major corporate-action families.
CA-102 denominator-vintage fixtures / no future share-count leakage.
CA-103 bounded raw-volume vs issued-share-turnover threshold disagreement study.
CA-104 institutional-flow / market-cap / valuation denominator interactions.
CA-105 lifecycle revision and same-day/multiple-stage edge cases.



## CA-101 through CA-105 durable update
- Point-in-time share denominators are now explicitly separated: REGISTERED_ISSUED_SHARES, EXCHANGE_LISTED_SHARES/tradable supply, OUTSTANDING_SHARES, FREE_FLOAT_SHARES and EPS_WEIGHTED_AVERAGE_SHARES. `knownAt` and `effectiveFromSession` are independent replay gates.
- New durable source contract: `CORPORATE_ACTION_SHARE_DENOMINATOR_SOURCE_CONTRACT.md`.
- New anti-leakage/mechanics artifact: `research/corporate_action_denominator_vintage_threshold_v0_1.json`.
- New lifecycle edge artifact: `research/corporate_action_lifecycle_edge_matrix_v0_1.json`.
- 8454 remains a positive two-clock witness: registered issued shares changed before the later 2025-10-09 new-share listing; registration must not switch the listed/tradable denominator early.
- 2465 produced a critical falsification of the initial denominator interpretation. 10,000,000 cash-increase payment certificates began listed trading on 2025-11-17, but the official MOEA capital-change registration to NT$939,460,310 is dated 2026-01-06. Therefore 83,946,031 -> 93,946,031 on 2025-11-17 is NOT admissible as REGISTERED_ISSUED_SHARES truth.
- 2465 announcement semantics remain partially conflicting for exchange-listed/tradable denominator treatment because original public-listed common shares exclude 25,000,000 private-placement shares while the announcement's cumulative total numerically includes them. Public-tradable 58,946,031 -> 68,946,031 is retained only as a sensitivity scenario.
- CA-103 bounded mechanics: strict registered-share normalization yields 0/5 low-volume disagreements on 2465; public-tradable sensitivity yields 1/5 (2025-11-18 raw 1.0908796 vs normalized 1.0003297 crossing the 1.05 A low-volume boundary); 0/5 breakout-threshold disagreements. 8454 event-day witness also has no Boolean flip. No outcome/alpha inference.
- Structural result: a one-time denominator step affects a current-vs-prev5 turnover ratio only while the five-session lookback straddles the step; after six sessions on one constant denominator, scaling cancels algebraically absent another denominator change.
- Current institutional net-flow fields are raw share counts/sign streaks and remain factual across pure supply change. Any normalized institution-flow feature requires its own denominator space/vintage.
- Current Worker market-cap fallback `sharesOutstanding * close` is unsafe for historical replay if a current share snapshot is applied to an old price across corporate actions. Research market-cap/valuation must preserve denominator/date/source semantics; no Worker code changed.
- EPS weighted-average shares are a financial-report denominator and must never substitute for daily trading-supply denominators.
- CA-105 freezes same-day, revision, cancellation, late-correction, unit-scale+supply-change, conflict, 8454 and 2465 lifecycle fixtures. Conflicts fail closed; revisions preserve historical versions; no latest-wins shortcut.
- Formal Core unchanged. No Worker.js wiring, no production deployment, no alpha claim.

## Exact next continuation
CA-106 official TWSE + TPEx denominator-source archive/completeness receipt contract.
CA-107 pre-registered multi-event bounded denominator-disagreement sample.
CA-108 point-in-time market-cap / institutional-normalization replay fixtures.
CA-109 executable lifecycle revision/cancellation research-only tests.
CA-110 evidence checkpoint for a possible Class-A Shadow proposal only; no Formal merge/deploy.


## CA-106 through CA-110 durable update
- CA-106 source-contract receipt materialized in research/corporate_action_denominator_source_receipt_v0_1.json.
- TWSE official BFT51U is confirmed as a daily denominator backbone with both issued/listed share-base fields. Exact raw-unit normalization remains UNKNOWN because the official sample/format artifact was not retrievable by the research client. The official Chinese/English start-date discrepancy is preserved.
- TPEx official Daily Stock Quotes provide historical daily issued-share counts at public-page/artifact level; official TPEx statistics confirm capital and turnover use issued shares. Stable long-run machine/API ingestion remains PARTIAL.
- Full historical denominator archive remains NO_GO. Payment-certificate/private-placement treatment for the exact 2465 exchange-listed/tradable denominator remains PARTIAL_CONFLICT.
- CA-107 pre-registered four-family mechanics artifact is research/corporate_action_volume_semantic_family_sample_v0_1.json. 3593 flips both tested volume-condition interpretations; 8454 and 8422 are counterexamples showing material numeric changes need not flip booleans; 2465 strict registered lane shows 0/5 low-volume disagreements while unresolved tradable-supply sensitivity shows 1/5.
- CA-108 point-in-time downstream replay artifact is research/corporate_action_downstream_denominator_replay_v0_1.json. Raw institutional net shares remain factual; normalized flows and derived capitalization require explicit point-in-time denominator semantics.
- CA-109 research-only lifecycle state-machine prototype/tests were added to draft PR #101 branch. Commit 0c18332013a79faf5f184858b046e9d75d4d11c6 passed Research Corporate Action Prototype run 36148491289, V8 Regression run 36148491397, and V8 Repair run 36148491185. Research job 108115507007 explicitly passed the revision/cancellation lifecycle step.
- CA-110 readiness memo materialized in CORPORATE_ACTION_DENOMINATOR_SHADOW_READINESS.md.
- Readiness result: PROPOSAL_ONLY; denominator data gates are not ready for implementation.
- Formal Core, A/B logic, ranking, thresholds, capital, entry/add/reduce/sell/stop, monitor and push remain unchanged. No Worker.js wiring, no PR #101 merge, no production deploy.

## Exact next continuation
CA-111 obtain an official TWSE BFT51U sample/format artifact and pin raw units.
CA-112 freeze a stable TPEx historical daily denominator ingestion contract.
CA-113 execute a bounded dual-exchange denominator archive pilot with completeness receipts.
CA-114 resolve payment-certificate/private-placement denominator treatment with daily exchange artifacts and an independent witness.
CA-115 re-evaluate Class-A Shadow implementation readiness only after CA-111 through CA-114 pass; Formal Core remains locked.


## CA-111 progress / CA-112 independent completion
- Contiguous cursor remains CA-001 through CA-110 complete because CA-111 is still unresolved.
- CA-111 receipt materialized: `research/twse_bft51u_unit_resolution_receipt_v0_1.json`.
- CA-111 positive evidence: BFT51U/BFT50U daily issued/listed fields are official; BFI85U exposes daily `交易單位` + `發行股數` from 2020-03-02; TRANISIN exposes daily security `交易單位`; T32 explicitly proves non-thousand-unit securities exist.
- CA-111 blocker retained: official BFT51U sample/format binaries are not readable through the current research client, indexed official text does not explicitly pin the raw issued/listed numeric unit, and a universal x1000 shortcut remains prohibited.
- CA-112 completed independently ahead of the contiguous cursor. New contract: `CORPORATE_ACTION_TPEX_DENOMINATOR_INGESTION_CONTRACT.md`.
- TPEx official EDIS S38 / `STKT2QUOTESN.TXT` format proves `成交股數` is 9(12) shares, `發行股數` is 9(13) shares, and `市值` is 9(14) NTD. S38 official lane starts 2015-11-16.
- Research-only S38 parser/test added to draft PR #101 branch. Commit `78f627d36de44e50d50f74bb387e19dec9558a7a` passed Research Corporate Action Prototype `36149848429`, V8 Regression `36149848439`, and V8 Repair `36149848481`; job `108120054170` explicitly passed the S38 parser test.
- CA-112 is semantic/parser complete but a full historical S38 byte archive has not been acquired.
- Formal Core remains locked. No Worker.js wiring, PR merge or production deploy.

## Updated exact continuation
CA-111 remains the next contiguous blocker: obtain explicit official BFT51U raw-unit proof or a fully verified alternative TWSE daily issued/listed-share lane with trading-unit guards.
CA-112 is already complete as an independent lane.
CA-113 may begin only as bounded archive-pilot preparation until CA-111 closes; full dual-exchange completeness cannot be claimed early.
CA-114 payment-certificate/private-placement denominator resolution follows with daily exchange artifacts and an independent witness.
CA-115 readiness re-evaluation remains gated by CA-111/113/114.


## CA-111 continued / CA-113 bounded preparation
- CA-111 remains IN_PROGRESS. Official TWSE public evidence was extended with the listed common-share/TDR share-count change announcement lane (LT185).
- LT185 is an official event-driven ledger with announcement/effective-date filtering and CSV export. TWSE filing-operation material explicitly describes 已上市股數 / 申報上市股數 / 累計 in 股 and states the illustrated cumulative listed-share count excludes private-placement and restricted-trading shares.
- This is a strong independent share-unit/event-semantic witness, but it is not a complete daily denominator snapshot. It therefore does NOT prove BFT51U raw units and does NOT by itself close CA-111.
- BFT51U universal x1000 remains PROHIBITED. BFI85U/TRANISIN/T32 remain trading-unit/reconciliation candidates until an explicit daily raw-unit contract is captured.
- CA-113 bounded archive-pilot preparation is materialized in `research/corporate_action_dual_exchange_archive_pilot_plan_v0_1.json`.
- Pilot is PREPARED_NOT_EXECUTED. TPEx S38 may proceed as a bounded archive-byte pilot; TWSE may proceed with event-ledger reconciliation preparation, but complete dual-exchange daily denominator coverage cannot be claimed while CA-111 is unresolved.
- CA-114 received an independent semantic witness: generic TWSE listed-share maintenance excludes private-placement/restricted shares from cumulative listed-share count. This strengthens the 2465 public-listed/private-placement separation, but payment certificates remain a distinct tradable stage, so the exact 2025-11-17 combined exchange-tradable denominator remains PARTIAL until a date-specific daily exchange artifact resolves instrument treatment.
- No outcome/alpha testing. No Worker.js wiring. No production deployment. Formal Core unchanged.

## Updated exact continuation
CA-111: continue official TWSE daily raw-unit proof; prefer explicit BFT51U/BFI85U format/sample or an equivalent daily official share lane with trading-unit guard.
CA-113: execute only bounded TPEx archive bytes + TWSE event-ledger reconciliation receipts; do not claim full dual-exchange completeness before CA-111 closes.
CA-114: obtain a 2465 date-specific daily exchange artifact around 2025-11-17 that distinguishes ordinary listed shares, private-placement shares and payment-certificate tradable supply.
CA-115 remains gated by CA-111/113/114.


## CA-111 closure — official BFT51U/BFI85U unit reconciliation
- Authorized browser retrieval succeeded for the official BFT51U sample CSV and BFI85U sample CSV after the earlier binary-only research path failed.
- BFT51U sample 2019-07-29 provides both 發行張數 and 上市股數. BFI85U independently provides 交易單位 and 發行股數.
- 2330: BFT51U 發行張數 25,930,380; 上市股數 25,930,380,458. BFI85U trade unit 1,000; 發行股數 25,930,380. 25,930,380 × 1,000 = 25,930,380,000, leaving 458 shares. Therefore 發行張數 is not an exact share count and blind ×1000 loses the sub-lot remainder.
- 8454: 140,058 × 1,000 = 140,058,000 versus 上市股數 140,058,500, independently leaving 500 shares.
- 8422: 108,888 × 1,000 exactly equals 108,888,000, retained as a counterexample showing why a few exact-multiple rows can falsely make ×1000 look universally valid.
- BFI85U 00636K trade unit=100 proves security-specific non-1,000 trading units exist; its date differs from the BFT51U row and is used only as a unit guard.
- Resolution: `TWSE_BFT51U_RAW_UNIT_CONTRACT=RESOLVED`; `universalMultiplyBy1000=REJECTED_FOR_EXACT_SHARE_DENOMINATOR`.
- Preferred exact listed-share candidate: BFT51U 上市股數 raw field. Registered-issued exact shares still require a remainder-preserving source; BFT51U 發行張數 alone is insufficient.
- Receipt: `research/twse_bft51u_unit_resolution_receipt_v0_2.json`.
- CA-112 was already independently complete, so contiguous cursor now advances through CA-112.
- Formal Core remains locked; no Worker.js wiring, merge, deployment or decision-rule change.

## Updated exact continuation
CA-113 bounded dual-exchange denominator archive pilot with per-date/per-symbol completeness and revision receipts.
CA-114 payment-certificate/private-placement denominator resolution using daily exchange artifacts plus an independent witness.
CA-115 Class-A Shadow readiness re-evaluation only after CA-113/114 pass.


## CA-113 alignment / CA-114 semantic-stage resolution
- CA-113 pilot plan upgraded to v0.2 after CA-111 closure. TWSE exact listed-share candidate lane is now BFT51U 上市股數 raw field; BFT51U 發行張數 remains lot-count only and universal x1000 remains rejected. Pilot status is READY_FOR_BOUNDED_EXECUTION, not complete.
- Full archive completeness is still gated by bounded source bytes/receipts with expected-vs-observed sessions, revision/knownAt coverage, suspension handling and parser-failure accounting on both exchanges.
- CA-114 semantic stage for 2465 is materially resolved in `research/corporate_action_2465_payment_certificate_resolution_v0_1.json`.
- 2025-11-17 issuer/TWSE-approved listing disclosure separates 58,946,031 original listed common shares (excluding 25,000,000 private-placement common shares) from 10,000,000 payment-certificate tradable units. Therefore 68,946,031 is a derived combined tradable-unit universe only for metrics whose denominator contract explicitly combines both instrument types; it is NOT registered-issued common shares.
- 93,946,031 on the 2025-11-17 disclosure is a cumulative listing figure that includes payment certificates and must not be relabeled as registered-issued ordinary shares at that date.
- Registration approval occurred 2026-01-06; new ordinary shares list and payment certificates terminate/convert on 2026-01-16. This independently falsifies backward leakage of the later ordinary-share state into 2025-11-17.
- Remaining CA-114 gate is archive evidence, not semantic guesswork: capture bounded date-specific TWSE daily artifacts around 2025-11-17 and reconcile BFT51U/security rows with the explicit instrument-stage contract.
- No outcome testing, no historical Shadow fabrication, no Formal change.

## Updated exact continuation
CA-113 execute bounded TWSE/TPEx archive receipts and quantify completeness/revision/UNKNOWN counts.
CA-114 reconcile 2465 bounded daily TWSE rows against the now-frozen instrument-stage semantics; if source rows do not expose payment-certificate instrument supply, preserve metric-specific UNKNOWN rather than forcing one denominator.
CA-115 re-evaluate Class-A Shadow implementation readiness only after CA-113 archive receipts and CA-114 reconciliation pass.


## CA-113 bounded pilot — first official public-lane receipts / suspension negative control
- Continued from CA-113 without restarting prior CA work.
- TPEx official daily close-quote public output is independently confirmed to expose an exact raw `發行股數` field in shares. Current official output shows 5314 with a raw issued-share value, consistent with the already-frozen S38 semantic contract; this validates the public daily lane as a reconciliation witness, not as a substitute for bounded historical S38 bytes.
- Strong suspension negative control captured for 5314: TPEx official announcement states par-value-change trading suspension from 2025-03-20 through 2025-03-28 and new shares resume trading 2025-03-31. These sessions must be counted as VERIFIED_SUSPENSION, not MISSING, in CA-113 completeness receipts.
- Separate TPEx official announcement proves a later event-driven suspension beginning 2025-10-14. This falsifies any assumption that one corporate-action suspension calendar can be extrapolated indefinitely from a single event family; symbol-session provenance is required per bounded window.
- TWSE official BFT51U product contract reconfirmed as daily, generated ~14:40, with both 發行張數 and 上市股數. Historical BFT51U archive bytes remain subscription/product-gated in the public path; current web evidence therefore does NOT prove bounded 2025-11-17 daily BFT51U rows for 2465.
- CA-114 guard strengthened: TWSE public daily trading report proves 2465 traded around the target period, but that report does not expose the BFT51U listed-share/payment-certificate denominator fields. It cannot close CA-114. Preserve the payment-certificate-inclusive denominator as metric-specific UNKNOWN until a date-specific denominator artifact exposes/reconciles both instrument stages.
- Completeness accounting consequence: expected sessions must be generated from market sessions minus VERIFIED_SUSPENSION symbol-sessions. Missing daily denominator rows outside verified suspensions remain UNKNOWN/MISSING_SOURCE; they cannot be silently treated as no-change. No revision/knownAt completeness claim is made yet.
- Status: CA-113 PARTIAL_RECEIPTS / ARCHIVE_BYTES_PENDING; CA-114 SEMANTIC_STAGE_RESOLVED_DAILY_ARCHIVE_RECEIPT_PENDING. No alpha/outcome test, no historical Shadow fabrication, no Formal change.
- Exact continuation: acquire bounded historical TPEx S38 bytes for event-centered witness windows and materialize expected/observed/verified-suspension/unknown counts; obtain bounded TWSE BFT51U daily artifact access or an equivalent exact daily listed-share artifact for the same witness windows, especially 2465 around 2025-11-17; then evaluate revision/knownAt coverage before CA-115.


## CA-113/CA-114 bounded daily-source evidence update
- CA-113 official TPEx historical public query contract is now validated across independent eras. The endpoint returns daily market-wide rows including exact `發行股數` in shares; 2017-05-24 symbol 1258 and 2021-07-19 symbol 5820 both reconcile successfully, while 2025-03-22 weekend returns zero rows.
- 5314 event-centered witness: issued shares are 14,700,000 on 2025-03-18/19, rows are absent at the checked 2025-03-20 and 2025-03-28 verified-suspension boundaries, then issued shares are 294,000,000 on 2025-03-31 resume and 2025-04-01. The exact 20x denominator step aligns to market resumption, not to a missing-data shortcut.
- New artifact: `research/corporate_action_ca113_bounded_public_lane_receipt_v0_1.json`.
- CA-113 status advances to `TPEX_BOUNDED_PUBLIC_LANE_VALIDATED / S38_BYTES_PENDING / TWSE_EXACT_LISTED_ARCHIVE_PENDING`. The public query does not prove immutable S38 bytes/hash, first-known timing or complete revision history.
- CA-114 gained a decisive daily-source falsification. TWSE MI_QFIIS 2465 `發行股數` is 83,946,031 on 2025-11-11, jumps to 93,946,031 on 2025-11-12 with reason `2` and company-report date 2025-11-12, and remains 93,946,031 through the 2025-11-17 payment-certificate trading start.
- That MI_QFIIS step occurs before payment certificates trade and before 2026-01-06 MOEA registration approval. Therefore MI_QFIIS `發行股數` is a distinct company-reporting/foreign-ownership-table semantic lane and is NOT interchangeable with REGISTERED_ISSUED_COMMON_SHARES, EXCHANGE_LISTED_COMMON_SHARES or combined tradable supply.
- New artifact: `research/corporate_action_2465_payment_certificate_resolution_v0_2.json`.
- CA-114 status advances to `DAILY_ISSUED_REPORT_CONFLICT_CONFIRMED / EXACT_LISTED_TRADABLE_ARCHIVE_PENDING`. The 58,946,031 listed ordinary + 10,000,000 payment-certificate = 68,946,031 combined tradable sensitivity remains valid only for an explicitly combined-instrument metric contract; it is not registered-issued common shares.
- Positive and negative evidence both strengthen the same design rule: denominator fields with similar names cannot be merged across reporting, registration and trading-supply clocks.
- Formal Core remains locked. No Worker.js wiring, PR merge, production deployment, ranking/threshold/capital/monitor/push change.

## Updated exact continuation
CA-113: obtain immutable TPEx S38 bytes/hash if feasible and continue bounded completeness/revision receipts; the public historical query is already validated as an official reconciliation lane.
CA-114: obtain BFT51U `上市股數` or equivalent exact daily TWSE listed-share artifacts around 2465 2025-11-11..2025-11-18 and determine payment-certificate representation. Preserve UNKNOWN if the exact daily source cannot express a metric-compatible combined tradable denominator.
CA-115: do not re-evaluate Class-A Shadow implementation readiness until the remaining TWSE exact-listed-share/archive gate is resolved and CA-113 completeness is sufficient.


## CA-113/114 event-state reconstruction contract refinement
- New artifact: `research/corporate_action_event_state_reconstruction_contract_v0_1.json`.
- A key distinction is now frozen: a complete official event ledger can reconstruct a bounded daily state, but only for the exact semantic space it actually governs. This is not the same as possessing a daily snapshot archive.
- Reconstruction is admissible only with a verified pre-window baseline, complete relevant event-family coverage, effective-session dates, knownAt/vintage preservation, revision/cancellation chains, suspension-aware expected sessions and explicit instrument mapping.
- Missing baseline, incomplete event-family coverage, unknown effective session, unresolved revision chain or instrument mapping all fail closed to UNKNOWN.
- Applied to 2465, 2025-11-17 can be represented as separate states: listed common 58,946,031; payment-certificate tradable units 10,000,000; combined tradable sensitivity 68,946,031 only for metrics explicitly defined across both instruments; private-placement 25,000,000 remains outside public listed-common supply; registered-issued common shares remain a separate clock.
- MI_QFIIS 93,946,031 from 2025-11-12 remains a reporting-table state and is explicitly prohibited as a substitute for any of those trading/registration semantic spaces.
- This narrows the remaining blocker: CA-114 semantic definition is no longer the main uncertainty; the unresolved gate is exact bounded archive/completeness/knownAt evidence, especially TWSE daily listed-share reconciliation and TPEx immutable-byte provenance.
- CA-115 remains blocked. Formal Core unchanged.


## D11-14 cross-lane update — index adjustment / passive-flow PIT feasibility
- New dedicated anchor: `INDEX_ADJUSTMENT_PASSIVE_FLOW_RESEARCH.md`.
- New source receipt: `research/d11_index_adjustment_pit_receipt_v0_1.json`.
- Taiwan index-event clocks are now separated into review-data cutoff, announcement knownAt, effectiveFrom session and tracker execution window.
- Official TWSE/FTSE and TWSE index methodologies provide explicit announcement/effective timing; TWSE e-shop products prove daily pre-effective/effective constituent artifacts exist, though some historical bytes are subscription/licensing gated.
- D11-14 advances from L2 to L3 because Taiwan PIT data feasibility and time semantics are source-proven. No outcome/alpha claim is made.
- Falsification is frozen: ADD is not a universal bullish rule and DELETE is not a universal bearish rule. International evidence shows index effects vary over time and methodology, can attenuate, and differ for true adds/deletes versus transfers.
- Required future controls: market/sector/size/liquidity/momentum, transfers vs true changes, concurrent corporate actions/news, common support, costs and auction slippage.
- CA-113/114 cursor is unchanged; this cross-lane work does not close or overwrite the denominator archive gates.
- Formal Core remains locked.

## D11-04 / D11-05 long-block — CB and treasury-stock PIT state machines (2026-10-01 Asia/Taipei)
- Continued from latest room tracker; D17 fixed-cadence capture remained time-dependent, so a nonblocked D11 branch was advanced instead of idling.
- New anchor: `CAPITAL_STRUCTURE_EVENT_STATE_MACHINE_RESEARCH.md`.
- New machine-readable contract: `research/d11_cb_treasury_event_state_contract_v0_1.json`.
- D11-04 CB advances L2 -> L3 on Taiwan PIT/source feasibility only. Issue, listing, conversion window, conversion-price adjustment, conversion/share delivery, early-redemption/call, delisting/maturity and capital-registration clocks are now separated.
- CB falsification: issue announcement != dilution date; conversion-window opening != converted amount; call notice != converted shares; quarterly new-share disclosure != exact daily denominator.
- D11-05 treasury stock advances L2 -> L3 on Taiwan PIT/source feasibility only. Board authorization, filing, two-month execution, threshold disclosures, completion, actual execution and later transfer/conversion/cancellation are separate states.
- Treasury falsification: plan != execution. Planned quantity cannot be treated as realized demand or outstanding-share reduction.
- D17-06 dependency deepened but remains L2: expectation is pre-event planned state; surprise is newly knowable realization; final execution data cannot backdate the earlier expectation.
- D11 maturity 48.6% -> 51.4%; room 08 aggregate 44.4% -> 45.9%.
- No outcome join, no historical Shadow fabrication, no Formal change, no FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: prospective immutable CB lifecycle receipts and treasury plan-to-execution receipts; only then preregister D17-06 expectation-vs-realization metrics before returns.

## D11 prospective receipt contract — 2026-10-01
- Added outcome-blind receipt contract `research/d11_cb_treasury_prospective_receipt_contract_v0_1.json`.
- Common replay rule: `knownAtUpperBound = capturedAt` unless provider availability is independently authenticated; source publication time alone cannot backdate availability.
- CB receipts require bond identity plus issue/listing/maturity/conversion-period/conversion-price/outstanding-balance/call/delisting/share-delivery state, with explicit UNKNOWN for missing revision/effective-date evidence.
- Treasury receipts require plan identity plus authorization/purpose/planned quantity, cumulative/final actual purchases, execution ratio and eventual transfer/conversion/cancellation disposition.
- Negative controls are frozen before outcomes: call notice without converted-share evidence; conversion window without actual conversion; authorized buyback with low/unknown execution; completed buyback not yet cancelled; later reissue/transfer.
- Outcome join remains CLOSED. Before any returns are inspected, D17-06 expectation/realization definitions, event time zero, horizons, control cohorts and missingness policy must be preregistered.
- Formal Core unchanged; maturity unchanged by this contract itself.
- Exact next: append the first independent-date source receipts for CB and treasury states, then repeat on later independent dates before considering L4/OOS.
