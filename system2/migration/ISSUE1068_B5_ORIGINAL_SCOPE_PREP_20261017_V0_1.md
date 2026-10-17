# System 2 DATA_LANE｜B5 官方產業主分類：原始來源驗證前置契約（2026-10-17）

Status: **OFFLINE SOURCE-SCOPE ENGINEERING ONLY / PHYSICAL B5 NOT YET ACCEPTED**
Authority: owner industry Class A directive V1.0; #1068 source owner, BUILD #1132/#1234 consumer, AUDIT #1127 independent verifier.
Repository: latest GitHub main at execution; never treat this page's historical SHA as future current main.

## Why this is needed

The existing System 2 B2 industry snapshot observer already parses official TWSE/TPEx *current* industry profile rows. It does NOT, on its own, prove an exact market T original archived raw source, complete A1 market population join, historical B5 version PIT or independent audit. BUILD's six research seeds are separate examples, not current full-market B5 coverage. The new DATA utility reuses that parser, performs **no new endpoint GET**, preserves original-body SHA, actual source clock, explicit CONFLICT/UNKNOWN.

## New bounded code

- Code: system2/migration/issue1068_b5_original_industry_source_scope_v0_1.mjs
- Export: buildB5OriginalIndustrySourceHandoffV0_1
- Inputs: actual market date T, evaluation timestamp, upstream A1 original signed receipt hash, source A1 four-digit raw *instrument* universe, and exactly two official profile native raw bodies with genuine observations.
- Outputs: market-specific instrument denominator / mapped / UNKNOWN / CONFLICT, original raw-byte SHA256, observation clock, provider raw label/code field, native profile date where present, receipt digest, false-authority flags.
- Four-digit symbol is **not** a certified common share. Historical CFI, CA, revisions, native B5 effective version and PIT are still UNKNOWN.
- Duplicate profile symbols, future-dated native rows, source endpoint mismatch, impossible clock, malformed JSON and duplicate universe symbols fail closed or remain CONFLICT.
- Late original observation remains late. Raw profile bytes must be privately archived by the caller; they do not appear in the public receipt.
- Existing B2 profile parser/endpoint mapping are reused. No ranking, scorer, Worker, Cron, Cloudflare or System1 change.

## What this does NOT prove

At 2026-10-17 the true 2026-10-19 T date has not occurred. **Actual official native B5 population mapped/unknown/conflict remains UNKNOWN.** Synthetic tests are counterexamples, not actual market sources. The last true A1 T=2026-10-16 had 122/122 SOURCE integrity, not physical T=2026-10-19 industry profiles. This offline code is NOT a signed DATA→BUILD actual-source handoff, nor independent B5 / PIT / Frozen acceptance.

## Exact next DATA_LANE action

1. For actual next market T with independently verified A1 source, reuse existing physically captured native B5 TWSE/TPEx raw profile when available, otherwise one bounded official read-only profile per exchange. Preserve exact original bytes, source URL, observedAt, Run/Job/Artifact and SHA. Do not re-fetch already verified A1 historical OHLCV.
2. Join only the same-T original A1 4-digit instrument population. Report actual TWSE and TPEx covered/unknown/conflicted, native raw SHA, dated original rows, source timing, native-version absence, and full-class denominator still UNKNOWN.
3. **AUDIT_LANE #1127** independently download/recompute native ZIP SHA and inspect dates/code/labels, conflicts, completeness and historical vintage. Only after scoped independent acceptance hand over actual B5 receipt to BUILD #1132/#1234 for optional NON_PIT_PREVIEW industry context. Lack of B5 must not block valid Scheme C P0 source preview.
4. Continue DATA PIT-A 2330/TWSE (then 3287/TPEX) authoritative 61-session CFI/CA/NO_EVENT original evidence and PIT-B migration in parallel under separate quota authorization.

No newly authorized source GET, Cron, Cloudflare D1/R2, Frozen write or System1 formal modification is implied. selectedCount and zeroPickDay stay null; local PIT-A sample remains 0/2 until physically independently accepted.
