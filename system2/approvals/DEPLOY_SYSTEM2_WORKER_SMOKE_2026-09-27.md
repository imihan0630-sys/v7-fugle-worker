APPROVAL=DEPLOY_SYSTEM2_WORKER_SMOKE

Owner authorization recorded in chat on 2026-09-27 Asia/Taipei.

Authorized scope:
- create/deploy only the isolated Worker `system2-shadow-research`;
- bind only the isolated D1 `system2-research` as `SYSTEM2_DB`;
- run a smoke health/read test against schema V0.5;
- keep `SYSTEM2_CAPTURE_ENABLED=false`;
- no Cron triggers;
- no production routes;
- no System 1/V8 code/runtime/binding modification;
- after smoke, disable Version URLs and leave workers.dev disabled.

This is a one-shot authorization marker.
