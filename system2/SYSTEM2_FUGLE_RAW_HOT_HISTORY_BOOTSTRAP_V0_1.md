# System 2 Fugle Raw Hot-History Bootstrap V0.1

Updated: 2026-10-03 Asia/Taipei  
Status: REPOSITORY IMPLEMENTATION / PHYSICAL ACCEPTANCE PENDING  
Scope: S2-07 prospective recent RAW daily-history coverage only  
System 1 / V8 impact: NONE

## Why this lane exists

The official full-market TPEx historical daily-close transports are valid research sources but returned repeated HTTP 520 from GitHub-hosted runners during the recent-history warmup. Repeatedly adding equivalent TPEx full-market transports would not improve the integrity model.

System 2 already uses Fugle MarketData for the bounded Daily Resonance monitor. Fugle's stock Historical Candles contract supports daily listed/OTC equity history and an explicit `adjusted=false` request. V0.1 therefore adds a separate, rate-bounded **per-symbol RAW history bootstrap** for prospective System 2 readiness.

This is a source fallback for missing recent history, not a replacement for official current-day A1, historical cold-store research, or corporate-action continuity evidence.

## Frozen semantics

Every inserted bar must satisfy all of the following:

- ordinary four-digit TWSE/TPEX equity from the READY current-listing metadata source;
- explicit request `timeframe=D&adjusted=false`;
- OHLC internally consistent and inside the requested range;
- source exchange matches the listing market;
- volume interpreted as daily shares;
- price space is `RAW`;
- `available_at = observed_at` at the actual prospective response observation;
- `availability_basis=PROSPECTIVE_OBSERVATION`;
- `pit_availability_class=OBSERVED_AVAILABLE_UPPER_BOUND`;
- `continuity_state=UNVERIFIED`;
- no continuity promotion.

Fugle's daily `change` has an action-aware reference-price meaning. V0.1 preserves it only inside raw source provenance and writes normalized `change=null` so it cannot be mistaken for raw close-to-close change.

## Existing-row firewall

This lane fills only canonical market/symbol/date/RAW keys that are absent.

- Existing keys are reused rather than rewritten.
- Existing conflicting revisions block the symbol before fetch planning.
- The lane never inserts a second revision merely because the provider differs.
- The historical ingest completion receipt is written after all missing rows are persisted.
- A stable per-symbol infrastructure completion marker is written only after bar readback verification.
- Completed symbols are not fetched again by this V0.1 bootstrap.

This makes the lane one-time prospective seeding, not a silent historical revision service.

## Bounded API/resource policy

Workflow: `.github/workflows/system2-fugle-raw-hot-history-bootstrap.yml`

- no recurring schedule;
- main merge/push of this lane performs one physical batch;
- manual dispatch is available for additional batches;
- default 45 symbols per run, hard maximum 50;
- sequential source calls with at least 1100 ms spacing in the physical workflow;
- one request covers up to 300 calendar days per symbol, below the provider's single-request one-year ceiling;
- only symbols with fewer than 60 already PIT-eligible RAW bars and no prior completion marker are selected;
- TWSE/TPEX candidates are interleaved rather than allowing one market to consume the entire bounded batch.

No Cloudflare Cron slot is added.

## Authority firewall

V0.1 does not:

- certify `CLEAR_NO_ACTION` or `ADJUSTED_CONTINUITY`;
- write assessor policy;
- evaluate or rank strategies;
- create `s2_capacity_runs`;
- claim a zero-pick day;
- enable final selection;
- enable live push, capital allocation or orders;
- read or mutate System 1 production storage/runtime.

## Relationship to listing-age-aware history

PR #350 added the separate listing-age-aware preflight rule: mature listings remain under strict 60-prior-bar coverage, while recent listings cannot be required to possess bars from before their official listing date.

This bootstrap supplies the missing RAW bars. It does not weaken that preflight and does not make continuity READY.

## Acceptance sequence

1. Unit tests prove raw-source semantics, prospective availability and continuity firewall.
2. Bootstrap tests prove symbol cap, one-time completion marker, no overwrite of existing canonical keys and readback-before-completion.
3. System2 Research CI and V8 Regression must pass on the exact PR head.
4. First main physical run must use isolated `system2-research`, preserve System 1 files, and return a receipt with actual processed/inserted counts.
5. Re-run the read-only historical inventory and confirm PIT-eligible recent-history coverage increased without ambiguity.
6. Continuity remains a separate blocker until independently validated corporate-action/session provenance exists.
