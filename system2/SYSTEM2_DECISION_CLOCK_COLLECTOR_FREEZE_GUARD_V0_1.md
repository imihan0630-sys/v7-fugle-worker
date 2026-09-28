# System 2 Decision Clock（決策時間點）Collector Freeze Guard（擷取器凍結防護）V0.1

Updated: 2026-09-28 Asia/Taipei  
Status: FROZEN BEFORE FIRST PROSPECTIVE SAMPLE / RESEARCH-ONLY

## Purpose

The first ordinary eligible prospective trading date is 2026-09-29.

The Decision Clock collector contract already embeds a deterministic SHA-256 collector fingerprint inside every V0.3 daily bundle. This V0.1 adds a repository-side CI guard so one of the 13 collector-contract files cannot change silently before or during evidence accumulation.

## Frozen surface

The freeze manifest records the Git blob hash for exactly the same 13 files listed by:

`DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3`

The CI test first requires manifest paths to equal the collector-contract file list exactly, then runs `git hash-object` for every file and compares it with the frozen baseline.

A changed, added or omitted collector-contract file therefore fails System2 Research CI unless the freeze baseline is deliberately revised.

## Why Git blob hashes are used here

The evidence bundle continues to use the existing collector SHA-256 fingerprint.

The freeze guard uses Git blob hashes only as an independent repository-content immutability check. It does not replace or reinterpret the V0.3 collector fingerprint.

The two layers therefore answer different questions:

- bundle fingerprint: which collector contents produced this evidence artifact?
- freeze guard: did repository collector contents drift from the preregistered evidence baseline?

## CI trigger hardening

`.github/workflows/system2-research-ci.yml` now triggers not only for `system2/**`, but also whenever:

`.github/workflows/system2-prospective-clock-evidence-readonly.yml`

changes on push or pull request.

This closes the previous gap where a collector workflow-only edit might avoid System2 Research CI because the workflow file lives outside `system2/**`.

## Change policy after evidence begins

Once the first promotion-grade prospective sample exists, a material collector change must not be handled by simply refreshing hashes.

It requires:

1. a separately preregistered evidence epoch or collector contract version;
2. explicit documentation of what semantics changed;
3. a decision on whether old/new fingerprints may be compared or must remain separate;
4. new freeze baseline for the new epoch/version;
5. preservation of all prior evidence without rewriting history.

The freeze-test failure message states this requirement directly.

## Safety

This guard changes no runtime market logic and performs no external mutation.

- no D1 write;
- no Worker mutation;
- no Worker Cron authorization;
- capture remains false;
- no System 1/V8 Formal Core change;
- no outcome/return data is used.

This is Class A repository integrity hardening only.
