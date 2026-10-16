import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const cfi=readFileSync(".github/workflows/system2-m09-daily-native-cfi-independent-audit.yml","utf8");
const ca=readFileSync(".github/workflows/system2-m09-daily-six-ca-independent-audit.yml","utf8");
const upstream=readFileSync(".github/workflows/system2-shared-official-a1-independent-audit.yml","utf8");
const parseBlock=(body,name)=>{
  const marker="      - name: "+name+"\n";
  const at=body.indexOf(marker);
  assert.notEqual(at,-1,"step not found: "+name);
  const end=body.indexOf("\n      - name: ",at+marker.length);
  return body.slice(at,end===-1?undefined:end);
};
test("CFI only requests genuine native bytes when original upstream Artifact exists and is not expired",()=>{
 const pre=parseBlock(cfi,"Check original CFI Artifact exists before any download");
 assert.match(pre,/if: github\.event_name == 'workflow_run'/);
 assert.match(pre,/GH_TOKEN: \$\{\{ github\.token \}\}/);
 assert.match(pre,/github\.event\.workflow_run\.id/);
 assert.match(pre,/github\.event\.workflow_run\.run_attempt/);
 assert.match(pre,/gh api "repos\/\$\{GITHUB_REPOSITORY\}\/actions\/runs\/\$\{UPSTREAM_RUN\}\/artifacts\?per_page=100"/);
 assert.match(pre,/select\(\.name == \$n and \.expired == false\)/);
 assert.match(pre,/echo 'ready=false'/);
 assert.match(pre,/CFI_SOURCE_NOT_READY__ORIGINAL_ARTIFACT_ABSENT__HISTORICAL_PIT_BLOCKED/);
 assert.match(pre,/exit 2/);
 for(const step of [
  "Fetch exact upstream audit-source-run native original bytes",
  "Independently rehash all actually requested current ISIN CFI originals"
 ]){
  assert.match(parseBlock(cfi,step),/steps\.native_source\.outputs\.ready == 'true'/);
 }
 assert.match(parseBlock(cfi,"Retain independent native source audit receipt"),/steps\.native_source\.outputs\.ready == 'true'/);
});
test("CA source-not-ready observation does not become a six-family source or a certified no-event",()=>{
 const pre=parseBlock(ca,"Classify CA source readiness from actual downloaded native files");
 assert.match(pre,/test -s "\$R"/);
 assert.match(pre,/noEventMayBeClaimed/);
 assert.match(pre,/SUPPLEMENTAL_CA_SOURCE_NOT_READY/);
 assert.match(pre,/CA_SOURCE_NOT_READY__SIX_FAMILIES_UNOBSERVED__NO_EVENT_UNKNOWN__NO_PIT_OR_FROZEN/);
 assert.match(pre,/echo 'ready=false'/);
 assert.match(pre,/OBSERVED_EVENT_RISK_OVERLAY_ONLY_NOT_PIT_SELECTION/);
 assert.match(pre,/test -s "\$CA_ROOT\/ca-source-receipt\.json"/);
 assert.match(pre,/test -s "\$CA_ROOT\/ca-negative-risk\.json"/);
 assert.match(pre,/sourceFamilyDenominator/);
 assert.match(pre,/sourcesRetainedOriginalBytes/);
 for(const id of ["TWSE_EX_RIGHT_DIVIDEND_ACTUAL","TWSE_CAPITAL_REDUCTION_REFERENCE","TWSE_PAR_VALUE_CHANGE_REFERENCE",
                    "TPEX_EX_RIGHT_DIVIDEND_ACTUAL","TPEX_CAPITAL_REDUCTION_REFERENCE","TPEX_PAR_VALUE_CHANGE_REFERENCE"]){
  assert.ok(pre.includes(id),id);
 }
 assert.match(pre,/test -s "\$CA_ROOT\/\$\{ID\}-\$\{DAY\}\.json\.gz"/);
 assert.match(pre,/CA_ADVISORY_UNKNOWN_OR_INVALID_STATE/);
 assert.match(parseBlock(ca,"Separate-run SHA-256 rehash of six genuine official native original bodies"),/steps\.original_ca_ready\.outputs\.ready == 'true'/);
 assert.match(parseBlock(ca,"Preserve signed independent six-CA READ ONLY receipt 90 days"),/steps\.original_ca_ready\.outputs\.ready == 'true'/);
});
test("never use a successful parent source run as a fake PIT/CFI/CA day, preserve true provider timing",()=>{
 assert.match(upstream,/continue-on-error: true/);
 assert.match(upstream,/Observe native ISIN CFI for this exact audited preview only/);
 assert.match(upstream,/Observe six native CA sources and report present-action risks only/);
 assert.match(upstream,/Preserve native ISIN CFI originals for independent audit/);
 assert.match(upstream,/Preserve separate CA original bytes and advisory, never Frozen/);
 assert.match(cfi,/historicalOrdinarySharePITCertified/);
 assert.match(cfi,/frozenD1Written/);
 assert.match(ca,/historicalNoEventCoverageCertified/);
 assert.match(ca,/completeCorrectionsAndRetractionsCertified/);
 assert.match(ca,/frozenD1Written/);
 for(const text of [cfi,ca]){
  assert.doesNotMatch(text,/\bINSERT INTO\b|\bDELETE FROM\b|\bUPDATE s2_|\bDROP TABLE\b|\bALTER TABLE\b/i);
  assert.doesNotMatch(text,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|cloudflare\.com\/client\/v4/);
 }
});
