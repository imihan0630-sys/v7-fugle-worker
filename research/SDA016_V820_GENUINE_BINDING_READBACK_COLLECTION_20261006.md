# SDA-016｜V8.20 Genuine Formal→C1 Binding Readback Collection

Date: 2026-10-06 Asia/Taipei  
Status: READ-ONLY EVIDENCE COLLECTOR EXTENSION / FORMAL CORE LOCKED

Purpose:
- Preserve the first genuine post-deploy V8.20 Formal→C1 binding readback.
- V8.20+ sessions require an exact binding to the same immutable C1 generation and fail closed if it is missing or mismatched.
- Pre-V8.20 sessions are explicitly marked LEGACY_PRE_V820_BINDING_NOT_REQUIRED; no historical binding is inferred or backfilled.

Validated fields:
- scanDate;
- exact C1 generation id;
- shared Formal/C1 decision clock;
- runtime version;
- source main SHA;
- C1 content/universe digests;
- C1 population count;
- AFTER_MARKET_SCAN_PIPELINE origin;
- appendOnly=true / superseded=false;
- explicit-binding-only authority;
- latest/inventory/selected-set inference all false.

Output:
`artifacts/system1-formal-c1-binding.json`

Existing schedule remains:
`00:10 Asia/Taipei` after the formal 23:35 scan.

Safety:
- read-only;
- no Worker runtime change;
- no D1 schema mutation;
- no Formal selection/capital/signal/push/order change;
- no System2 change.

Final latest-main lease base:
`1beeedded38ba39a951277069c09c45654304657`.
