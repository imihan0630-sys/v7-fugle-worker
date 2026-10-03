# System 1 Production auto-deploy trigger decoupling — Class B review

Date: 2026-10-03 Asia/Taipei
Status: CLASS-B CANDIDATE / NOT MERGED / NOT DEPLOYED / FORMAL CORE LOCKED

## Problem

The current V8 Cloudflare Deploy push-path contract includes:
- RESEARCH_WORKLIST.md
- research/**
- tests/**

Therefore a Class-A research-only merge or a test-only merge can rebuild and
redeploy the Production Worker even when Worker.js and the guarded runtime
patch chain are unchanged.

This creates unnecessary Production exposure and turns otherwise isolated
research merges into operational Class-B events.

## Candidate change

Only the push.paths trigger set in .github/workflows/v7-cloudflare.yml changes.

Remove automatic Production deploy triggers for:
- RESEARCH_WORKLIST.md
- research/**
- !research/**/*.md
- tests/**
- !tests/inspect_official_quality_sources.mjs

Preserve automatic deploy triggers for:
- Worker.js
- the full guarded scripts/apply_* runtime patch chain
- existing build-data triggers
- .github/workflows/v7-cloudflare.yml itself

Preserve workflow_dispatch for explicit manual deployment.

## Validation remains separated from deployment

V8 Regression continues to validate tests/** changes.
V8 Repair CI continues to validate research/** and tests/** changes.
Therefore research/test changes still receive CI; they simply stop causing an
automatic Production Worker deployment on main push.

## Deployment safety remains

The deploy workflow still contains:
- predeploy Production snapshot;
- actual Worker/Cron backup;
- version downgrade guard;
- code-only Cloudflare Worker upload;
- Cron preservation/migration guard;
- postdeploy version/configuration verification;
- research-only readback;
- automatic rollback on failed verification.

No business rule, Worker function, D1 schema, signal, push, order, capital,
C3/C4/C5 research contract or System2 path changes.

## Operational implication

A future change only to a deployment verifier/test helper no longer silently
redeploys Production merely because the test file was merged.

If the operator intentionally needs to exercise a changed deployment verifier,
use the preserved workflow_dispatch path under explicit Class-B approval.

This is deliberate: verifier changes affect the deployment process, not the
currently running Worker, and should not cause an implicit Production upload.

## Rollback

Re-add the five removed broad path patterns to v7-cloudflare.yml.
No Worker/data rollback is required because this candidate changes only GitHub
Actions trigger routing.

## Approval boundary

Passing CI is not deployment authorization.
Merging this workflow change itself triggers the current v7-cloudflare workflow
once, so explicit owner Class-B approval is required before merge.
