# D16-22 Taiwan Financial-Text Pipeline L3 Acceptance — 2026-10-09 V0.1

Updated: 2026-10-09 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / OPEN_WORLD_LLM_NOT_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Module: D16-22
Formal Core impact: NONE

## Scope

D16-22 advances from L2/40 to L3/60 for one bounded capability:

`TAIWAN_SOURCE_LOCAL_TEXT_TRANSFORMATION_PIPELINE`.

This validates that real Taiwan material-disclosure text can be frozen under a conservative point-in-time knowledge cut and transformed deterministically with fixed model/parser lineage.

It does NOT validate:
- unrestricted historical LLM forecasts;
- pretrained-model knowledge-cutoff safety;
- sentiment Alpha;
- event Alpha;
- source-independent incremental information;
- live ranking/selection/policy impact.

Open-world LLM historical PIT remains unvalidated.

## Real Taiwan corpus

Source:
Fugle Stock connector content type `FCNT000004` (重大訊息), whose rows link to original MOPS material-disclosure URLs.

Bounded corpus:
- 8 real disclosure documents;
- 4 Taiwan issuers: 2330, 2454, 2537, 3037;
- source-native timestamp/title/MOPS URL/structured description preserved;
- each document was independently replayed through its exact `target_id`.

Durable corpus:
`research/d16_22_taiwan_material_disclosure_corpus_20261009_v0_1.json`.

First GitHub commit containing the exact corpus:
`0e8ed18fd028c34ab00552a9187e2414ec98fd91`.

Conservative Room11 first-known upper bound:
`2026-10-09T04:39:10Z`.

Critical clock rule:
the historical MOPS/Fugle source-reported publication timestamp is preserved as source metadata but is NOT backdated into Room11 first-known time.

Any Room11 text decision before the GitHub evidence cut fails closed.

## Executable transformation

Implementation:
`research/d16_22_text_pipeline_l3_v0_1.mjs`.

Test:
`tests/test_d16_22_text_pipeline_l3_v0_1.mjs`.

Model lineage:
- modelVersion = `D16_22_SOURCE_LOCAL_LEXICON_V0_1`;
- tokenizerVersion = `UNICODE_NFKC_SUBSTRING_V0_1`;
- promptTemplateVersion = `NO_LLM_SOURCE_LOCAL_RULES_V0_1`;
- lexiconHash = `08a314baa9b9cee51a2a1049ac9ae671bf14550e67c6cb6ef96d4d59ffccaa87`.

The first accepted model is intentionally a deterministic source-local baseline, not an external LLM.

Frozen feature families:
- correction;
- uncertainty;
- adverse context;
- expansion context;
- no-major-impact language.

These are descriptive text features, not bullish/bearish votes.

## Contamination controls

The accepted pipeline:
- invokes no external LLM;
- performs no network retrieval;
- consumes no market outcome;
- consumes no current/future return;
- uses no model-internal company knowledge;
- uses source text only.

Entity/date/number redaction is tested as a control.
Core source-local lexical feature counts must remain unchanged after entity/date redaction.

This provides an executable contamination baseline for later model comparisons.

It does NOT prove future LLM models are uncontaminated.

## Simple baseline comparison

Every receipt keeps separately:
- title-only lexical baseline;
- full-document lexical transform.

No outcome is inspected when comparing the transformation objects.

A future encoder/LLM challenger must beat this simpler baseline under the same parent document identities and PIT cut; model complexity alone cannot create maturity or Alpha.

## Falsification suite

Dedicated suite:
15/15 PASS.

Tests include:
- corpus identity + conservative first-known;
- bitwise deterministic replay;
- pre-first-known decision rejection;
- source timestamp cannot substitute for Room11 first-known;
- fixed model/tokenizer/prompt lineage;
- no external LLM/retrieval/outcome;
- entity/date redaction stability;
- correction detection;
- adverse + uncertainty context without scalar sentiment;
- expansion context without Alpha claim;
- title-only vs full-text baseline visibility;
- duplicate document rejection;
- non-MOPS URL rejection;
- historical-backfill rejection;
- document mutation changes receipt identity.

## Physical CI evidence

Workflow:
`Research D16 Text Pipeline L3 Readonly`.

Exact head:
`5adb632c8686fb47846e12943fe544e242bdee72`.

Run:
`37885008617` — SUCCESS.

Receipt:
`58e89bb5ef6df9166c048a63f3b1dc36b60c39c61fd18e0ce62396cc98e6a2a7`.

Artifact:
- id: `11594994975`;
- digest: `sha256:ef15f58fda236b47e9695aba089699f1dbde22bc8ed4c87b6c2c23763afd6dbc`.

Research-only/no-network isolation:
PASS.

Same-head V8 Regression:
run `37885008498` — SUCCESS.

## L3 promotion-gate review

1. executable/tested Taiwan text pipeline — PASS.
2. immutable source/version/first-known lineage — PASS for the conservative Room11 capture cut.
3. deterministic replay — PASS.
4. fail-closed pre-cut use — PASS.
5. historical backfill — forbidden/PASS.
6. contamination baseline — PASS through source-local/no-network model plus redaction controls.
7. simple baseline — PASS through title-only vs full-text transforms.
8. model-version lineage — PASS.
9. outcome isolation — PASS.
10. Formal Core isolation — PASS.

## Why not L4

No prospective/OOS text-feature value evidence exists.

L4 requires, at minimum:
- prospective documents captured before the strategy decision;
- frozen parent document identities;
- a preregistered text task;
- outcome joins only after maturity;
- simple baseline comparison on the same documents;
- independent-date/episode accounting;
- model-version drift accounting;
- multiple-testing control;
- no same-parent double vote with D07/D17/D11;
- for any open-world LLM, point-in-time model-vintage / knowledge-cutoff evidence or a design that prevents model-internal future knowledge from answering the task.

## Maturity decision

D16-22:
L2/40 -> L3/60.

Interpretation:
Taiwan PIT text-corpus + deterministic source-local NLP transformation feasibility is validated.

Not implied:
- LLM PIT validation;
- predictive Alpha;
- sentiment trading value;
- selection/ranking authority.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core remains LOCKED.

## Exact next

1. Keep source-local baseline as the comparison floor.
2. Capture future material disclosures prospectively under immutable first-known receipts.
3. If an encoder/LLM challenger is introduced, freeze model/version/prompt/retrieval state before outcomes.
4. Preserve source-parent identity so D16-22 transformation cannot become a second independent vote from the same D07/D17/D11 evidence.
5. Do not open L4 until prospective outcomes mature across multiple independent dates/episodes.
