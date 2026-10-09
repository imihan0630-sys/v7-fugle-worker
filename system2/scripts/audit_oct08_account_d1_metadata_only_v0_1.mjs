// DATA_LANE Class A: one Cloudflare GraphQL account usage observation.
// NO Cloudflare D1 SQL, no D1 REST adapter, no quota grant or ledger mutation.
import {readFile,writeFile} from "node:fs/promises";
import {parseOct08AccountD1GraphqlV0_1,
 assessOct08D1ReadMetadataOnlyV0_1}
 from "../runtime/oct08_account_d1_graphql_metadata_observer_v0_1.mjs";

const out=process.env.S2_OCT08_ACCOUNT_D1_METADATA_OUTPUT||
 "/tmp/s2-oct08-account-d1-metadata-only.json";
const policyPath=new URL(
 "../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",
 import.meta.url);
const query=`query D1Daily($accountTag: String!, $start: Date!, $end: Date!) {
 viewer { accounts(filter: {accountTag: $accountTag}) {
  d1AnalyticsAdaptiveGroups(
   limit: 10000, filter: {date_geq: $start,date_leq: $end},
   orderBy: [date_ASC]
  ) {
   sum {rowsRead rowsWritten readQueries writeQueries}
   dimensions {date databaseId}
  }
 } }
}`;
let result;
try{
 const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
 const token=process.env.CLOUDFLARE_API_TOKEN||
  process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
 if(!accountId||!token)throw new Error("ACCOUNT_GRAPHQL_READONLY_CREDENTIALS_UNAVAILABLE");
 const observedAt=new Date().toISOString();
 const day=observedAt.slice(0,10);
 const response=await fetch("https://api.cloudflare.com/client/v4/graphql",{
  method:"POST",
  headers:{authorization:"Bearer "+token,
   "content-type":"application/json",accept:"application/json"},
  body:JSON.stringify({query,variables:{accountTag:accountId,start:day,end:day}}),
  signal:AbortSignal.timeout(30000),
 });
 if(!response.ok)throw new Error("ACCOUNT_GRAPHQL_HTTP_"+response.status);
 const payload=await response.json();
 const observation=parseOct08AccountD1GraphqlV0_1({payload,quotaDay:day});
 const reservePolicy=JSON.parse(await readFile(policyPath,"utf8"));
 result=assessOct08D1ReadMetadataOnlyV0_1({
  observation,reservePolicy,observedAt});
}catch(error){
 result={
  schemaVersion:"S2_OCT08_ACCOUNT_D1_GRAPHQL_METADATA_BLOCKED_V0_1",
  state:"BLOCKED_ACCOUNT_GRAPHQL_METADATA_UNAVAILABLE_NO_PHYSICAL_D1_AUTHORITY",
  observedAt:new Date().toISOString(),errorName:String(error?.name||"Error"),
  reason:String(error?.message||error).slice(0,240),
  accountReadHeadroomCertified:false,physicalD1ReadAuthorized:false,
  physicalD1WriteAuthorized:false,
  d1SqlQueriesByObserver:0,d1RowsReadByObserver:0,
  d1RowsWrittenByObserver:0,r2CallsByObserver:0,
  system1FormalRuntimeChanged:false,paidUpgradeAuthorized:false,
 };
 process.exitCode=1;
}
await writeFile(out,JSON.stringify(result,null,2)+"\n","utf8");
console.log("S2_OCT08_D1_ACCOUNT_METADATA_ONLY "+JSON.stringify({
 state:result.state,observedAt:result.observedAt,quotaDay:result.quotaDay,
 rowsReadLowerBound:result.observation?.rowsReadLowerBound??null,
 rowsWrittenLowerBound:result.observation?.rowsWrittenLowerBound??null,
 system1ReadReserveAuthorized:result.system1ReadReserveAuthorized??false,
 accountReadHeadroomCertified:result.accountReadHeadroomCertified,
 physicalD1ReadAuthorized:false,physicalD1WriteAuthorized:false,
 error:result.reason||null,
}));
