# Market-Cap Source Identity Capture — Class B Proposal

Updated: 2026-09-27 Asia/Taipei
Status: PROPOSAL ONLY — NO IMPLEMENTATION / NO DEPLOYMENT
Formal Core: LOCKED
Engineering class: B (shared scan/runtime observability)

## Purpose
Preserve the already-loaded pre-merge source identity needed to study the existing 10/30/100bn market-cap boundaries without changing the value used by Formal.

This proposal does not change enrichment precedence, marketCapYi, sharesOutstanding, market-cap thresholds, A/B, RR, ranking, quota, capital, monitoring, signal or push logic.

## Why pre-merge capture is required
Current fetchEnrichment() separately holds official and custom stock objects, then flattens them with object spread. mergeEnrichment() later receives only the flattened stock. Source identity cannot be reliably reconstructed after that point.

The isolated helper research/market_cap_source_classifier_v0_1.mjs shows source-path classification is deterministic only while official and custom objects remain separate.

## Minimum additive research receipt
One row per scan generation + symbol:
- scanDate, symbol, market
- marketCapYiFormalInput
- marketCapSourceType, marketCapSourceField, marketCapSourceId, marketCapSourceDate, marketCapCapturedAt, marketCapPointInTimeEligible
- sharesOutstandingFormalInput, sharesSourceType, sharesSourceId, sharesSourceDate, sharesCapturedAt
- close, closeDate
- customOverrideFlags for market-cap aliases and shares aliases
- selectedRawExplicitAlias + numeric-conversion state
- selectedRawSharesAlias + numeric-conversion state
- lowerAliasShadowing flags
- sourceQualityState
- classifierVersion
- parent scan-generation / feature-universe receipt id
- writer timestamp / immutable generation identity

## Source-date rules
Source identity and source-date proof are separate.
- TPEx profile raw rows expose Date.
- TWSE/MOPS CSV fallback validates 出表日期/exportDate.
- Current normalized stock/sourceMeta path drops sufficient date detail that the date remains UNKNOWN unless captured before that loss.
- Custom payload meta/asOf is dropped by normalizeEnrichmentPayload(); do not infer custom source date from scanDate.
- UNKNOWN remains UNKNOWN. No historical source-date reconstruction.

## Zero-extra-call constraint
Use only objects already fetched for the normal after-market scan.
- zero added market-data/network calls;
- zero alternate market-cap calculation for Formal;
- zero historical fallback from current shares.

## Completeness receipt
Per scan generation:
- parent feature-row/requested symbol count;
- captured row count;
- source-type counts;
- source-date known/unknown counts;
- PIT eligible/ineligible/unknown counts;
- invalid-alias / override-null counts;
- explicit descriptive boundary-near counts for 10/30/100bn under a frozen band;
- truncation=false or explicit pagination/hasMore.

A date is promotion-grade for later market-cap-floor research only when parent/capture counts reconcile and source/PIT missingness is explicit.

## Storage semantics
Prefer immutable append-only research generation keyed by scan generation + symbol, or an immutable parent receipt with an additive evidence overlay.
Do not use same-date mutable legacy Shadow as the sole lineage parent.

## Validation before implementation
1. Run the isolated classifier tests against Worker merge semantics.
2. Retain fixed adversarial cases: custom explicit; custom shares override; official shares fallback; custom null overwrite; invalid first explicit alias shadowing lower alias; comma-formatted custom shares under current toNumber.
3. Captured marketCapYiFormalInput must equal the actual Formal feature value; mismatch fails closed.
4. Verify source-date propagation separately for TWSE/TPEx profile and fallback paths.
5. Verify custom source-date remains UNKNOWN when metadata was not retained.
6. Prove zero added fetches.
7. Prove zero Formal decision diff on fixed fixtures.

## Governance
Implementation touches shared scan/enrichment/persistence and requires owner approval before code or deployment.
Merge-precedence, alias-precedence, market-cap input, fallback or threshold changes are outside this proposal.

Decision: CLASS_B_PROPOSAL_READY / ZERO_EXTRA_CALL / PREMERGE_CAPTURE_ONLY / NO_FORMAL_CHANGE
