import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const deploy=await readFile(new URL("../.github/workflows/v7-cloudflare.yml",import.meta.url),"utf8");
const regression=await readFile(new URL("../.github/workflows/v7-regression.yml",import.meta.url),"utf8");
const repair=await readFile(new URL("../.github/workflows/v7-repair-ci.yml",import.meta.url),"utf8");
let n=0;
const yes=(v,m)=>{assert.ok(v,m);n++;};
const no=(v,m)=>{assert.equal(v,false,m);n++;};

yes(deploy.includes("workflow_dispatch:"),"manual deploy path must remain available");
yes(deploy.includes('      - "Worker.js"'),"Worker change must auto-deploy");
yes(deploy.includes('      - "scripts/apply_v8_15_4.py"'),"current runtime patch chain must auto-deploy");
yes(deploy.includes('      - "data/v7_formal_scan_backfill.json"'),"existing build-data trigger must remain");
yes(deploy.includes('      - ".github/workflows/v7-cloudflare.yml"'),"deploy workflow change must self-trigger");
no(deploy.includes('      - "research/**"'),"research/** must not auto-deploy Production");
no(deploy.includes('      - "tests/**"'),"tests/** must not auto-deploy Production");
no(deploy.includes('      - "RESEARCH_WORKLIST.md"'),"research worklist must not auto-deploy Production");
no(deploy.includes('      - "!research/**/*.md"'),"obsolete research negative path must be removed");
no(deploy.includes('      - "!tests/inspect_official_quality_sources.mjs"'),"obsolete tests negative path must be removed");

yes(regression.includes("paths: [Worker.js, scripts/**, tests/**, .github/workflows/**]"),
  "Regression must continue validating tests/** changes");
yes(regression.includes("pull_request:\n    branches: [main]"),"Regression PR gate must remain");
yes(repair.includes('      - "research/**"'),"Repair CI must continue validating research/** changes");
yes(repair.includes('      - "tests/**"'),"Repair CI must continue validating tests/** changes");

yes(deploy.includes("node tests/capture_worker_backup.mjs"),"predeploy backup guard remains");
yes(deploy.includes("node tests/update_cloudflare_after_market_cron.mjs"),"Cron preservation guard remains");
yes(deploy.includes("node tests/verify_deployment.mjs"),"postdeploy verification remains");
yes(deploy.includes("Auto rollback if deployment verification fails"),"automatic rollback remains");

console.log(JSON.stringify({
  ok:true,assertions:n,researchAutoDeploy:false,testsAutoDeploy:false,
  runtimeAutoDeploy:true,manualDeploy:true,regressionCoveragePreserved:true,
  repairCoveragePreserved:true,rollbackPreserved:true,formalCoreImpact:false
}));
