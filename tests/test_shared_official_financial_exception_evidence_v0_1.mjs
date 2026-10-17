import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {OFFICIAL_MOPS_QUARTER_SOURCE,planOfficialFinancialException,
 inspectOfficialMopsHtml,classifyOfficialFinancialException}
 from "../research/shared_official_financial_exception_evidence_v0_1.mjs";
let cases=0;
async function t(name,fn){await fn();cases++;console.log("PASS "+name);}
const parser=(_,symbol,year,q)=>({quarterEpsVerified:true,
 quarterEPS: symbol==="3236" ? .72 : .54,
 quarterEpsYear:year,quarterEpsQuarter:q});
function html(symbol,q,id="C",basis="合併綜合損益表"){
 return "CO_ID="+symbol+"&SYEAR=2026&SSEASON="+q+"&REPORT_ID="+id+
  "<html>"+basis+" 新台幣仟元 <table>基本每股盈餘 0.54 0.2</table>"+
  "檢查用原始官方報表其他欄位...".repeat(12)+"</html>";
}
const observe=(symbol,q,id,when="2026-10-16T15:35:00Z")=>
 inspectOfficialMopsHtml({symbol,year:2026,quarter:q,
  sourceUrl:OFFICIAL_MOPS_QUARTER_SOURCE,html:html(symbol,q,id,
    id==="A"?"個體綜合損益表":"合併綜合損益表"),
  observedAt:when,originalParser:parser});
await t("bounded official public document requests",()=>{
 const plan=planOfficialFinancialException({symbols:["3236","5340"],year:2026,quarter:2});
 assert.equal(plan.requestCount,4);assert.equal(plan.maximumQueries,12);
 assert.deepEqual(plan.requests.map(x=>[x.symbol,x.quarter]),
  [["3236",2],["3236",1],["5340",2],["5340",1]]);
 assert(plan.requests.every(x=>x.method==="POST"&&x.sourceUrl===OFFICIAL_MOPS_QUARTER_SOURCE));
 assert(plan.requests.every(x=>x.bodyFields.year==="115"));
 assert.equal(plan.formalEligible,false);
 assert(Object.isFrozen(plan));assert(Object.isFrozen(plan.requests[0].bodyFields));
});
await t("source budgets and invalid symbols rejected",()=>{
 assert.throws(()=>planOfficialFinancialException({symbols:["3236","3236"],year:2026,quarter:2}),/BUDGET_OR_DUPLICATE/);
 assert.throws(()=>planOfficialFinancialException({symbols:Array(7).fill("3236"),year:2026,quarter:2}),/BUDGET_OR_DUPLICATE/);
 assert.throws(()=>planOfficialFinancialException({symbols:["00878"],year:2026,quarter:2}),/SCOPE/);
 assert.throws(()=>planOfficialFinancialException({symbols:["3236"],year:2026,quarter:4}),/SCOPE/);
 assert.equal(planOfficialFinancialException({symbols:["3236"],year:2026,quarter:1}).requests.length,0);
});
await t("direct original C + strict original parser source flags",()=>{
 const q2=observe("3236",2,"C");assert.equal(q2.basis,"CONSOLIDATED");
 assert.equal(q2.exactReportId,"C");assert.equal(q2.originalParserVerified,true);
 assert.equal(q2.state,"CONSOLIDATED_C_SOURCE_PARSER_PASS");
 assert.equal(q2.contentSha256,createHash("sha256").update(html("3236",2)).digest("hex"));
 assert.equal(q2.formalEligible,false);assert.equal(q2.historicalPointInTimeCertified,false);
});
await t("individual A must not become consolidated C",()=>{
 const q2=observe("5340",2,"A"),q1=observe("5340",1,"A");
 assert.equal(q2.basis,"INDIVIDUAL");assert.equal(q2.exactReportId,"A");
 assert.equal(q2.originalParserVerified,false);
 const verdict=classifyOfficialFinancialException({symbol:"5340",year:2026,quarter:2,
  decisionCutoffAt:"2026-10-17T00:30:00+08:00",reports:[q1,q2]});
 assert.equal(verdict.status,"INDIVIDUAL_BASIS_REQUIRES_SEPARATE_POLICY_REVIEW");
 assert.equal(verdict.sourceReady,false);assert.equal(verdict.system2FrozenEligible,false);
 assert.equal(verdict.canIssueTrade,false);
});
await t("C original-parsed before clock is still not PIT-certified or Formal",()=>{
 const v=classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:2,
  decisionCutoffAt:"2026-10-17T00:30:00+08:00",
  reports:[observe("3236",2,"C"),observe("3236",1,"C")]});
 assert.equal(v.status,"SOURCE_C_PARSED_PRE_CUTOFF_PROSPECTIVE_WITNESS");
 assert.equal(v.sourceReady,true);assert.equal(v.pointInTimeReady,false);
 assert.equal(v.formalEligible,false);assert.equal(v.zeroPicksCertified,false);
 assert.equal(v.searchHintsAcceptedAsProof,false);assert.equal(v.canIssueTrade,false);
});
await t("later web fetch cannot backfill earlier historic PIT",()=>{
 const v=classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:2,
  decisionCutoffAt:"2026-10-16T08:00:00Z",reports:[
   observe("3236",2,"C","2026-10-17T04:00:00Z"),
   observe("3236",1,"C","2026-10-17T04:01:00Z")]});
 assert.equal(v.status,"POST_CUTOFF_DISCOVERY_HISTORICAL_PIT_UNPROVEN");
 assert.equal(v.pointInTimeReady,false);assert.equal(v.formalEligible,false);
});
await t("unknown clock never quietly upgrades PIT",()=>{
 const v=classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:2,
  reports:[observe("3236",2,"C"),observe("3236",1,"C")]});
 assert.equal(v.status,"SOURCE_C_PARSED_PIT_NOT_ASSESSED");
 assert.equal(v.pointInTimeReady,false);
});
await t("web snippets cannot replace real official reports",()=>{
 const v=classifyOfficialFinancialException({symbol:"5340",year:2026,quarter:2,
  searchHints:["stock quote portal EPS=0.54","some social media article"]});
 assert.equal(v.status,"OFFICIAL_ORIGINAL_MISSING_OR_UNVERIFIED");
 assert.equal(v.searchHintCount,2);assert.equal(v.searchHintsAcceptedAsProof,false);
 assert.equal(v.sourceReady,false);
});
await t("missing previous quarter is UNKNOWN, not approved C",()=>{
 const v=classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:2,
  reports:[observe("3236",2,"C")]});
 assert.equal(v.status,"OFFICIAL_ORIGINAL_MISSING_OR_UNVERIFIED");
});
await t("source parser required and cannot trust match markers alone",()=>{
 const candidate=inspectOfficialMopsHtml({symbol:"3236",year:2026,quarter:2,
  html:html("3236",2),sourceUrl:OFFICIAL_MOPS_QUARTER_SOURCE,
  observedAt:"2026-10-17T00:00:00+08:00"});
 assert.equal(candidate.originalParserVerified,false);
 assert.equal(candidate.state,"CONSOLIDATED_C_ORIGINAL_PARSER_UNVERIFIED");
 const v=classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:2,
  reports:[candidate,observe("3236",1,"C")]});
 assert.equal(v.status,"OFFICIAL_SCHEMA_OR_PARSER_UNVERIFIED");
});
await t("fail if input origin is not canonical official MOPS",()=>{
 assert.throws(()=>inspectOfficialMopsHtml({symbol:"3236",year:2026,quarter:2,
  sourceUrl:"https://example.com/web/search",html:html("3236",2),
  observedAt:"2026-10-16T15:35:00Z",originalParser:parser}),/UNTRUSTED_URL/);
 assert.throws(()=>inspectOfficialMopsHtml({symbol:"3236",year:2026,quarter:2,
  sourceUrl:OFFICIAL_MOPS_QUARTER_SOURCE,html:"EPS 0.54",
  observedAt:"2026-10-16T15:35:00Z",originalParser:parser}),/RAW_BODY_INVALID/);
});
await t("original HTML mixed basis cannot pass",()=>{
 const mixed=html("5340",2,"A")+" "+html("5340",2,"C");
 const x=inspectOfficialMopsHtml({symbol:"5340",year:2026,quarter:2,
  sourceUrl:OFFICIAL_MOPS_QUARTER_SOURCE,html:mixed,
  observedAt:"2026-10-16T15:35:00Z",originalParser:parser});
 assert.equal(x.state,"OFFICIAL_REPORT_BASIS_CONFLICT");
 assert.equal(x.originalParserVerified,false);
});
await t("duplicate same-period vintages fail closed",()=>{
 const v=classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:2,
  reports:[observe("3236",2,"C"),observe("3236",2,"C"),observe("3236",1,"C")]});
 assert.equal(v.status,"DUPLICATE_VERSION_REQUIRES_ORIGINAL_RECONCILIATION");
});
await t("bad fabricated receipt metadata rejected",()=>{
 assert.throws(()=>classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:2,
  reports:[{symbol:"3236",year:2026,quarter:2,contentSha256:"a".repeat(64),
  observedAt:"2026-10-16T15:35:00Z",sourceUrl:"https://news.test/eps",
  sourceOnly:true,formalEligible:false}]}),/BAD_OR_UNTRUSTED_RECEIPT/);
});
await t("cross-year/date and Q1 special contracts block arbitrary promotion",()=>{
 assert.equal(classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:1,
  reports:[]}).status,"Q1_Q4_REQUIRES_SEPARATE_OFFICIAL_CONTRACT");
 assert.throws(()=>classifyOfficialFinancialException({symbol:"3236",year:2026,quarter:2,
  decisionCutoffAt:"not-an-instant"}),/CUTOFF_INVALID/);
});
await t("only pure research code, no business HTTP or storage mutations",async()=>{
 // The guarded source contract must have no transport, production bindings or business writes.
 const source=await readFile(new URL("../research/shared_official_financial_exception_evidence_v0_1.mjs",import.meta.url),"utf8");
 assert.doesNotMatch(source,/\bfetch\s*\(|\/api\/scan|\/api\/config|fugle-test|\.prepare\s*\(|\.put\s*\(/);
});
console.log(JSON.stringify({suite:"S1/S2 official EPS source exception research v0.1",
 tests:cases,pass:true,physicalSourceRead:false,formalRulesChanged:false,
 dailyScheduleAdded:false,system2PitCertified:false}));
