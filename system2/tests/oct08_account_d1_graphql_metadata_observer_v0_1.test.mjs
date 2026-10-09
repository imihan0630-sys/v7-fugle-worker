import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {parseOct08AccountD1GraphqlV0_1 as parse,
 assessOct08D1ReadMetadataOnlyV0_1 as assess,
 OCT08_D1_METADATA_LIMITS as limits}
 from "../runtime/oct08_account_d1_graphql_metadata_observer_v0_1.mjs";
const day="2026-10-09";
const at="2026-10-09T10:32:00Z";
const group=(databaseId,rowsRead,rowsWritten)=>({
 dimensions:{date:day,databaseId},sum:{rowsRead,rowsWritten},
});
const payload=(groups=[group("db-s2",782497,26919),
 group("db-s1",1200,1000)])=>({
 data:{viewer:{accounts:[{d1AnalyticsAdaptiveGroups:groups}]}}
});
const policy={directiveId:"S2-CORR-20261007-003",
 reserveNumberAuthorized:false,authorizedReserveRows:null,
 readReserveNumberAuthorized:false,authorizedReadReserveRows:null};
const v=parse({payload:payload(),quotaDay:day});
// Cloudflare may return errors:null for a clean response; still fail on errors[].
const nullErrorV=parse({payload:{...payload(),errors:null},quotaDay:day});
assert.equal(nullErrorV.rowsReadLowerBound,v.rowsReadLowerBound);
assert.equal(v.databaseGroupCount,2);
assert.equal(v.rowsReadLowerBound,783697);
assert.equal(v.rowsWrittenLowerBound,27919);
assert.match(v.normalizedCounterDigest,/^[0-9a-f]{64}$/);
assert.equal(v.usageSemantics,"ACCOUNT_DAILY_AGGREGATE_LOWER_BOUND");
const b=assess({observation:v,reservePolicy:policy,observedAt:at});
assert.equal(b.state,"OBSERVED_ACCOUNT_USAGE_ONLY_READ_HEADROOM_NOT_CERTIFIED");
assert.equal(b.system1ReadReserveAuthorized,false);
assert.equal(b.system1WriteReserveAuthorized,false);
assert.equal(b.accountReadHeadroomCertified,false);
assert.equal(b.physicalD1ReadAuthorized,false);
assert.equal(b.physicalD1WriteAuthorized,false);
assert.equal(b.sample36.localQueryHardCap,35000);
assert.equal(b.full11843.localQueryHardCap,150000);
assert.equal(b.sample36.measuredProtectedP0ReadCost,583256);
assert.ok(b.reasonCodes.includes("SYSTEM1_READ_RESERVE_NOT_EVIDENCE_AUTHORIZED"));
assert.ok(b.reasonCodes.includes("D1_RESERVATION_LEDGER_NOT_PHYSICALLY_RECONCILED_BY_METADATA_ONLY_AUDIT"));
assert.equal(b.d1SqlQueriesByObserver,0);
assert.equal(b.d1RowsReadByObserver,0);
assert.equal(b.d1RowsWrittenByObserver,0);
assert.equal(b.paidUpgradeAuthorized,false);
assert.equal(limits.dailyRowsRead,5000000);
const authorizedSynthetic={...policy,reserveNumberAuthorized:true,authorizedReserveRows:4000,
 readReserveNumberAuthorized:true,authorizedReadReserveRows:2000};
const stillNoGrant=assess({observation:v,reservePolicy:authorizedSynthetic,observedAt:at});
assert.equal(stillNoGrant.system1ReadReserveAuthorized,true);
assert.equal(stillNoGrant.accountReadHeadroomCertified,false);
assert.equal(stillNoGrant.physicalD1ReadAuthorized,false);
assert.equal(stillNoGrant.physicalD1WriteAuthorized,false);
const nearLimit=assess({observation:parse({
 payload:payload([group("db-s2",4999999,85000)]),quotaDay:day}),
 reservePolicy:authorizedSynthetic,observedAt:at});
assert.equal(nearLimit.sample36.exceedsPublishedDailyReadLimit,true);
assert.ok(nearLimit.reasonCodes.includes("OBSERVED_READ_BUDGET_PROJECTION_EXCEEDS_DAILY_LIMIT"));
const invalid=[
 ["MISSING_ROWS_READ",payload([group("db-s2",undefined,26919)])],
 ["NULL_ROWS_READ",payload([group("db-s2",null,26919)])],
 ["MISSING_ROWS_WRITTEN",payload([group("db-s2",1,undefined)])],
 ["NAN_ROWS_READ",payload([group("db-s2",NaN,2)])],
 ["NEGATIVE_ROWS_READ",payload([group("db-s2",-1,2)])],
 ["FRACTIONAL_ROWS_READ",payload([group("db-s2",1.25,2)])],
 ["STRING_ROWS_READ",payload([group("db-s2","0",2)])],
 ["OVERFLOW_ROWS_READ",payload([group("db-s2",Number.MAX_SAFE_INTEGER,2),
  group("db-s1",1,2)])],
 ["DUPLICATE_DATABASE",payload([group("db-s2",1,2),group("db-s2",3,4)])],
 ["WRONG_DAY",payload([{...group("db-s2",1,2),dimensions:{
  date:"2026-10-08",databaseId:"db-s2"}}])],
 ["MISSING_DATABASE_ID",payload([{...group("db-s2",1,2),dimensions:{
  date:day,databaseId:undefined}}])],
 ["EMPTY_GROUPS",payload([])],
 ["MISSING_GROUPS",{data:{viewer:{accounts:[{}]}}}],
 ["NO_ACCOUNTS",{data:{viewer:{accounts:[]}}}],
 ["TWO_ACCOUNTS",{data:{viewer:{accounts:[
  {d1AnalyticsAdaptiveGroups:[group("db-a",1,2)]},
  {d1AnalyticsAdaptiveGroups:[group("db-b",3,4)]}
 ]}}}],
 ["GRAPHQL_PARTIAL_ERROR",{...payload(),
  errors:[{message:"partial data: rowsRead unavailable"}]}],
 ["GRAPHQL_MALFORMED_ERRORS",{...payload(),errors:{message:"error"}}],
 ["MISSING_DATA",{}],
];
for(const [name,adversarial] of invalid){
 await assert.rejects(async()=>parse({payload:adversarial,quotaDay:day}),
  undefined,name);
}
await assert.rejects(async()=>parse({payload:payload(),quotaDay:"2026-10-9"}));
await assert.rejects(async()=>assess({observation:v,reservePolicy:policy,
 observedAt:"2026-10-10T00:05:00Z"}),/READ_USAGE_QUOTA_DAY_DRIFT/);
const workflow=await readFile(new URL(
 "../../.github/workflows/system2-oct08-account-d1-metadata-only.yml",
 import.meta.url),"utf8");
const cli=await readFile(new URL(
 "../scripts/audit_oct08_account_d1_metadata_only_v0_1.mjs",import.meta.url),"utf8");
assert.match(workflow,/d1-account-metadata-only/);
assert.match(workflow,/system2-research/);
assert.match(workflow,/read-only.*account.*metadata|metadata.*only/i);
assert.doesNotMatch(workflow,/wrangler.*deploy|R2_ACCESS_KEY|PUSH_WEBHOOK/);
assert.doesNotMatch(cli,/createRemoteD1RestAdapter|\.prepare\s*\(|\.batch\s*\(|\.run\s*\(/);
assert.match(cli,/graphql/);
assert.ok(cli.includes("const token=process.env.CLOUDFLARE_API_TOKEN||"));
assert.ok(workflow.includes("CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}"));
console.log("OCT08_ACCOUNT_D1_METADATA_ONLY_POSITIVE_AND_18_ADVERSARIAL_FAIL_CLOSED_PASS");
