import assert from "node:assert/strict";
import {previousTaipeiDate,classifyC1Readiness,collectC1ReadOnlyPreflight} from "../research/system1_c1_readiness_v0_1.mjs";

const day="2026-10-01";
const scanStatus={scanDate:day,pipeline:{complete:true}};
const institutionStatus={marketDate:day,ready:true};
const qualityStatus={marketDate:day,index:{ready:true},tdcc:{ready:true},
  datasets:Object.fromEntries(["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"].map(key=>[key,{ready:true}]))};
const full={scanDate:day,receiptError:"C1_GENERATION_NOT_FOUND",scanStatus,institutionStatus,qualityStatus};
let n=0;
function eq(got,want){assert.equal(got,want);n+=1;}
eq(previousTaipeiDate(new Date("2026-10-01T16:23:45Z")),day);
eq(previousTaipeiDate(new Date("2026-10-02T06:30:00Z")),day);
assert.throws(()=>previousTaipeiDate("not a date"),/INVALID_OBSERVATION_CLOCK/);n++;
assert.throws(()=>classifyC1Readiness({...full,scanDate:"2026/10/01"}),/SCAN_DATE_REQUIRED/);n++;
const ready=classifyC1Readiness(full);
eq(ready.category,"C1_CAPTURE_OR_PERSISTENCE_GAP");
eq(ready.facts.qualityReady,true);
for(const flag of ["mayCountAsZeroPick","eligibleForResearch","decisionImpact","formalCoreImpact","noPlanChanges"]){
  eq(ready[flag],["noPlanChanges"].includes(flag));
}
eq(classifyC1Readiness({...full,scanStatus:{scanDate:"2026-09-30",pipeline:{complete:true}}}).category,"FORMAL_SCAN_NOT_CONFIRMED");
eq(classifyC1Readiness({...full,scanStatus:null}).category,"FORMAL_SCAN_STATUS_UNKNOWN");
eq(classifyC1Readiness({...full,scanStatus:{scanDate:day}}).category,"FORMAL_PIPELINE_UNVERIFIED");
eq(classifyC1Readiness({...full,institutionStatus:{marketDate:day,ready:false}}).category,"DATA_QUALITY_BLOCKED");
eq(classifyC1Readiness({...full,qualityStatus:{...qualityStatus,datasets:{...qualityStatus.datasets,FINANCIAL:{ready:false}}}}).category,"DATA_QUALITY_BLOCKED");
eq(classifyC1Readiness({...full,qualityStatus:{...qualityStatus,datasets:{}}}).category,"SOURCE_READBACK_UNKNOWN");
eq(classifyC1Readiness({...full,qualityStatus:{...qualityStatus,marketDate:"2026-09-30"}}).category,"SOURCE_READBACK_UNKNOWN");
eq(classifyC1Readiness({...full,receiptHttpStatus:401}).category,"AUTHORIZATION_BLOCKED");
eq(classifyC1Readiness({...full,readErrors:{qualityStatus:"AUTH_REJECTED"}}).category,"AUTHORIZATION_BLOCKED");
eq(classifyC1Readiness({...full,receiptError:"C1_DIGEST_MISMATCH"}).category,"C1_READ_FAILED");
const called=[];
const bodies={"/api/scan/status":scanStatus,
  ["/api/institution-status?marketDate="+day]:institutionStatus,
  ["/api/quality-status?marketDate="+day]:qualityStatus};
const mockFetch=async (url,options)=>{
  called.push({url,method:options.method,headers:options.headers});
  assert.equal(options.method,"GET");assert.equal(options.headers["x-admin-token"],"TEST_ONLY");
  return {ok:true,status:200,json:async()=>bodies[new URL(url).pathname+new URL(url).search]};
};
const preflight=await collectC1ReadOnlyPreflight({origin:"https://fixture.invalid/",token:"TEST_ONLY",
  scanDate:day,receiptError:"C1_GENERATION_NOT_FOUND",request:mockFetch});
eq(preflight.category,"C1_CAPTURE_OR_PERSISTENCE_GAP");
eq(called.length,3);
eq(JSON.stringify(preflight).includes("TEST_ONLY"),false);
const partial=await collectC1ReadOnlyPreflight({origin:"https://fixture.invalid",token:"TEST_ONLY",
  scanDate:day,receiptError:"C1_GENERATION_NOT_FOUND",request:async (url,options)=>{
    if(url.includes("quality-status")) throw new Error("FAKE_TIMEOUT TEST_ONLY");
    return mockFetch(url,options);
  }});
eq(partial.category,"SOURCE_READBACK_UNKNOWN");
eq(partial.facts.readErrors.qualityStatus,"READ_FAILED_OR_TIMEOUT");
eq(JSON.stringify(partial).includes("TEST_ONLY"),false);
const missingToken=await collectC1ReadOnlyPreflight({origin:"https://fixture.invalid",token:"",scanDate:day,receiptError:"C1_GENERATION_NOT_FOUND",request:()=>{throw Error("SHOULD_NOT_FETCH")}});
eq(missingToken.category,"AUTHORIZATION_BLOCKED");
console.log(JSON.stringify({ok:true,assertions:n,fixtureOnly:true,marketCalls:0,productionWrites:0,formalCoreImpact:false}));
