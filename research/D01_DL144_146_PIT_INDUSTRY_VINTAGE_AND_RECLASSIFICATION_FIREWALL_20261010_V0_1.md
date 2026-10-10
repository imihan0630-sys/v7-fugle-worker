# D01 DL-144~146 — PIT Industry-Classification Vintage, Reclassification and D16 Support Firewall

Date: 2026-10-10 Asia/Taipei
Owner: 01｜K線與型態研究室 (D01)
Status: OUTCOME_BLIND / CLASS_A_RESEARCH_ONLY / NO_FORMAL_CHANGE
Depends on: D09-01 official membership authority (Room07); D01 DL-095 / DL-108~143; SDA-001 / SDA-002.
Primary public witness: TPEx announcement 2026-05-19, effective 2026-06-01, 13 TPEx companies, symbols unchanged:
https://www.tpex.org.tw/storage/eb_data/11505/11502011171.html
Upstream verified D09 owner artifact: research/BR083_D09_01_TPEX_EFFECTIVE_DATED_RECLASSIFICATION_2026_V0_1.md.
Additional TWSE historical example: 2023-07-03 reclassification notice:
https://www.twse.com.tw/rwd/zh/announcement/announcement_detail?id=346FAB95F87B11EDB2DA005056BE380E&response=html
Neither notice proves the COMPLETE historical membership universe. Source announcement date alone is not evidence of the exact intraday first-known instant.

## DL-144 — PIT taxonomy/membership vintage contract

The predictor-time industry lookup is a source-vintage join, not a modern industry-label lookup. Keep independent:
1. securityIdentity and exchange/market membership;
2. classificationSchemeId, taxonomyVersion, nativeSectorId and nativeSectorName;
3. official announcement date versus actual firstObservableAt/availableAt;
4. effectiveFrom / effectiveToExclusive membership interval;
5. capture/revision clock; owner receiptId/hash; as-of coverage state.

For decision t, an ACTIVE classification must be both (a) effective at t and (b) known/available by t, including the relevant source vintage. A known future classification announcement is ForthcomingContext, NOT active sector membership. A retroactively reconstructed classification effective at t but not provably available by t is PIT_BLOCKED, never assumed to have been usable on that day. Distinguish retrospective historical truth from a genuinely archived contemporaneous snapshot.

Example from TPEx:
- 1595: electronic components -> semiconductors; 3131: other electronics -> semiconductors;
- 6125: optoelectronics -> electrical machinery;
- 4905: communication networks -> biotech/medical.
The effective date is 2026-06-01. On a prior decision date, a backtest cannot compute member-relative rankings as though the post-effective assignment already applied. The exact 2026-05-19 first-known intraday time is not established by publication *date* alone.

Required states:
- INDUSTRY_VINTAGE_ACTIVE_CERTIFIED
- INDUSTRY_FUTURE_ANNOUNCED_NOT_EFFECTIVE
- INDUSTRY_SOURCE_NOT_YET_AVAILABLE
- INDUSTRY_MEMBERSHIP_UNKNOWN_BLOCKED
- INDUSTRY_MEMBERSHIP_CONFLICT_BLOCKED
- INDUSTRY_TAXONOMY_BRIDGE_UNKNOWN_BLOCKED
- INDUSTRY_COVERAGE_PARTIAL

Unknown/conflicting sector metadata blocks industry-conditioned inference; it need not block independent price-only pattern detection when the D01 structural source chain is otherwise certified. Present-day industry tags must never backfill unknown past vintages.

## DL-145 — Reclassification does not create price-pattern Alpha

Pure official industry reclassification does not change security identity, past RAW OHLC, swing pivot timestamps, structural-root identity, or established pattern episode ID. No industry-classification-induced PIVOT_READY, BREAKOUT_CONFIRMED, extra signal or pattern reset is admissible.

Industry index, peer return, sector relative strength and top-sector rank CAN change solely because constituent membership changed, even with the stock's price path held fixed. That is a COMPOSITION_BREAK, not evidence of a new price breakout. Require before/after classification-vintage decomposition, separate membership-composition impact from price-return impact, and exclude-self/leave-one-out controls where a stock's own return contributes to its assigned sector measure (D09/SDA-009 ownership).

Exception: a *separate* owner-certified issuer/economic-regime boundary (D08/D14) may legitimately require stale-memory reconfirmation or a break under DL-138~140. The classification notice alone neither proves nor disproves an economic boundary. Never translate sector change into company fundamentals, motive, causal event severity or future returns.

Cross-domain anti-double-count:
- D01 pattern geometry and D03 price trend often share PRICE_OHLC ancestry.
- D09 sector conditions may contain the target stock's own returns, so same-price/self-contribution must be stripped for any putatively independent confirmation.
- Several sector labels/versions of one security are not multiple independent pattern witnesses.
- No positive sector-related confirmation is a Formal gate/score until D16 residual/OOS evidence and owner approval.

R7 feature hash for D01 price-only geometry must not change upon cosmetic/reclassification metadata alone; outer explanation/context may bind the as-of owner sector receipt as non-price provenance. Actual independent corporate action or issuer-regime changes follow their own owner guard, not this sector rule.

## DL-146 — D16 parent/child support and placebos

Freeze a common-support join for a named D01 geometry child vs exact-price-only parent. Both MUST share:
- securityIdentity, point-in-time eligible symbol-session set, predictor cutoff;
- raw/continuity price history, data/source receipts and price-root ancestry;
- as-of scheme/taxonomy/membership receipt version and full denominator/coverage state;
- peer universe and self-exclusion rule, industry-index version, sector-return benchmark definition;
- horizon, transaction costs, missingness, censoring and clustering policy.

Denominator counts: complete eligible/current vintage, incomplete/UNKNOWN, conflict, taxonomy-unbridged, known future announcement not-yet-effective, and reclassification boundary. Never silently drop difficult cases to make child look better. A current modern peer list attached to historical survivors is not a valid historical cohort.

Pre-outcome placebo/control families:
1. SAME_PRICE_PATH_FIXED_MEMBERSHIP_RECLASS: freeze OHLC, swap only valid as-of sector context; geometry must remain identical, sector-only change is diagnostic.
2. SAME_INDUSTRY_NO_RECLASS: matched price geometry with stable membership.
3. RECLASS_NO_PATTERN: effective switch without independent D01 geometry.
4. PATTERN_NO_RECLASS: D01 geometry under stable classification.
5. FUTURE_ANNOUNCEMENT_NOT_YET_EFFECTIVE: prevent early new-sector ranking.
6. SAME_PRICE_SELF_IN_SECTOR_VS_LOO: compare inclusive industry feature vs excluding-self D09 feature.
7. TAXONOMY_UNBRIDGED: differing industry classification schemes are non-comparable, not zero change.
8. ISSUER_EVENT_WITH_RECLASS: separate D08/D14 regime receipt before attributing structure.

Freeze evaluation families, denominators, sector/issuer/date clusters and multiple-testing family BEFORE inspecting returns. Primary comparison is incremental pattern value over exact-price parent + PIT sector-state comparator, on identical support. Secondary checks isolate composition/industry leadership confounding. D16 owns inference; D01 cannot call statistical significance.

## Adversarial oracle and physical-source gate

Companion test: research/test_d01_dl144_146_industry_vintage_firewall_v0_1.mjs.
It checks temporal membership, overlapping certificates, future announcements, no mechanical pattern reset, parent-child receipt matching, direct-price ancestry and source coverage. Synthetic cases test logic only; no market returns and no historical Shadow outcomes are opened.

Frozen witness for real R7 remains TWSE 1101 / 2021-06-15 / 60 prior eligible symbol-sessions plus target. The exact-window R1-R6 owner bundle still lacks an accepted physical readback in the authoritative D01 checkpoint. Do not substitute the 2026 TPEx reclassification announcement or another System2 witness for that bundle. Without R1-R6, physical R7 stays BLOCKED.

## Falsification and upgrade gate

Plausible positive mechanism: sector context helps distinguish a genuine price-structure response from sectorwide moves, but requires an independent residual beyond price/trend/sector and clean exposure vintages.
Competing explanations: classification composition, market/sector shock, self-inclusion, corporate-event correlation, vintage selection, source latency, survivorship, matching/liquidity and clustering.
Fail conditions: invalid first-known vintage; unequal parent/child support; performance sensitivity solely to label backfill; disappearance after excluding-self; missing/unknown membership silently omitted; post-effective sector used pre-effective; outcome-tuned pattern groups.

Consequently: D01 = L3 / 60.0% (11 of 11 basic modules covered), Pattern alpha = UNKNOWN; SDA-001 and SDA-002 remain OPEN/REMEDIATION_IN_PROGRESS; no L4; no R09; no outcome join; no Formal/Worker/D1/runtime changes.

## Exact next continuation

1. Check latest main again for physically complete 1101/2021-06-15 R1-R6 receipts; accept only exact frozen window.
2. Run Node native adversarial test and CI readback; do not mislabel code review as native execution.
3. Hand classification-vintage dependency to Room07/D09, and future common-support/leave-one-out cluster analysis to Room11/D16.
4. If no physical R1-R6, continue only NEW outcome-blind D01 research; prioritize price-pattern/sector-index *taxonomy-bridge* version break and its missingness denominator without duplicating D09 owner data collection.
5. No maturity/Alpha or Formal promotion without PIT, prospective/OOS, independent residual, costs and owner approval.
