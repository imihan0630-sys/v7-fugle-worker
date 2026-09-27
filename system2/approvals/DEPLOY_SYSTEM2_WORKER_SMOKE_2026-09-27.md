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

RETRY_AFTER_VERSION_URL_FIX=REQUESTED


RESULT=PASS
INITIAL_ATTEMPT_RUN=36314452669
INITIAL_ATTEMPT_JOB=108606394382
INITIAL_ATTEMPT_DIAGNOSIS=WRANGLER_DEPLOY_CREATED_VERSION_BUT_NO_VERSION_URL_WITH_NO_TRAFFIC_TARGET
RECOVERY_RUN=36314596516
RECOVERY_JOB=108606794301
READ_ONLY_STATE_AUDIT_RUN=36314678044
READ_ONLY_STATE_AUDIT_JOB=108607025869
WORKER_NAME=system2-shadow-research
D1_DATABASE=system2-research
D1_BINDING=SYSTEM2_DB
SCHEMA_VERSION=0.5
HEALTH_SMOKE=PASS
CAPTURE_ENABLED=false
SCHEDULED_CAPTURE_ALLOWED=false
CRON_COUNT=0
WORKERS_DEV_ENABLED=false
PREVIEW_URLS_ENABLED=false
SYSTEM1_RUNTIME_USED=false
SYSTEM1_PRODUCTION_FILES_CHANGED=false
ONE_SHOT_PUSH_TRIGGER=DISARMED
