import {mkdir,writeFile} from "node:fs/promises";
import {fetchBufferedOfficialSource} from "./official_source_fetch_v0_1.mjs";
const targetDate="2026-10-08";
const sources=[
  {id:"TWSE_INDEX",kind:"json",url:"https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=20261008",key:"data"},
  {id:"TWSE_VALUATION",kind:"json",url:"https://www.twse.com.tw/exchangeReport/BWIBBU_d?response=json&date=20261008&selectType=ALL",key:"data"},
  {id:"TPEX_VALUATION",kind:"json",url:"https://www.tpex.org.tw/openapi/v1/tpex_mainboard_peratio_analysis",key:null},
  {id:"TWSE_ANNOUNCEMENTS",kind:"json",url:"https://openapi.twse.com.tw/v1/opendata/t187ap04_L",key:null},
  {id:"TPEX_ANNOUNCEMENTS",kind:"json",url:"https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap04_O",key:null},
  {id:"TDCC",kind:"csv",url:"https://opendata.tdcc.com.tw/getOD.ashx?id=1-5",key:null},
  {id:"MOPS_EPS",kind:"csv",url:"https://mopsfin.twse.com.tw/opendata/t187ap14_L.csv",key:null}
];
export const sanitizeError=error=>{
 const str=String(error?.message||error||"");
 return str.includes("HTTP 403")||str.includes("disallows access")?"ACCESS_REJECTED":
  str.includes("HTTP 404")?"HTTP_404":
  /timeout|aborted/i.test(str)?"TIMEOUT":
  /json|parse|Unexpected token/i.test(str)?"INVALID_PAYLOAD":
  "NETWORK_OR_SOURCE_ERROR";
};
export function summarizeJson(id,p){
 const rows=Array.isArray(p)?p:
   Array.isArray(p?.data)?p.data:
   Array.isArray(p?.tables)?p.tables:
   null;
 return {bodyJson:true,topArray:Array.isArray(p),logicalEntryCount:rows?.length??null,
  fieldCount:Array.isArray(p?.fields)?p.fields.length:null,
  reportedDate:typeof p?.date==="string"?p.date:null,
  officialStatus:typeof p?.stat==="string"?p.stat:null,
  hasNonemptyStructure:rows?.length>0};
}
export function summarizeCsv(t){
 // Do not emit raw text, headers or raw financial records into the public artifact.
 const lineCount=t.split(/\r?\n/).filter(Boolean).length;
 const firstLine=t.split(/\r?\n/,1)[0]||"";
 return {bodyCsv:true,nonemptyLineCount:lineCount,hasHeader:firstLine.includes(","),
  hasNonemptyStructure:lineCount>1};
}
async function probe(p){
 const result={source:p.id,httpStatus:null,sourceReachable:false,parsed:false,
  errorClass:null,dataAsOf20261008Proven:false};
 try{
  const resp=await fetchBufferedOfficialSource(p.url,{headers:{
   accept:p.kind==="csv"?"text/csv,text/plain,*/*":"application/json,text/plain,*/*",
   "user-agent":"Mozilla/5.0 System1-Quality-ReadOnly/0.1"
  },timeoutMs:18000},{maxAttempts:2});
  result.httpStatus=resp.status;result.sourceReachable=true;
  if(p.kind==="json"){
   const j=await resp.json();
   Object.assign(result,summarizeJson(p.id,j));result.parsed=true;
   result.dataAsOf20261008Proven=String(j?.date||"")==="20261008";
  }else{
   const csv=await resp.text();
   Object.assign(result,summarizeCsv(csv));result.parsed=true;
  }
 }catch(e){result.errorClass=sanitizeError(e);}
 return result;
}
async function main(){
 const report={schemaVersion:"SYSTEM1_20261008_OFFICIAL_QUALITY_SOURCE_READONLY_V0_1",
  inspectedAt:new Date().toISOString(),targetDate,
  scope:"SOURCE_ONLY_NOT_D1_STORAGE_NOT_QUALITY_ACCEPTANCE",
  noSecrets:true,noWorkerCalls:true,noCloudflareCalls:true,
  noMutation:true,noPlanChanges:true,noSelection:true,noPush:true,
  sources:{}};
 // Three at a time: bound public official access and avoid unnecessary burst concurrency.
 for(let i=0;i<sources.length;i+=3){
  const responses=await Promise.all(sources.slice(i,i+3).map(probe));
  for(const x of responses)report.sources[x.source]=x;
 }
 report.reachableSourceCount=Object.values(report.sources).filter(x=>x.sourceReachable).length;
 report.parsedSourceCount=Object.values(report.sources).filter(x=>x.parsed).length;
 report.officialQualityInProductionReady=false;
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/system1-20261008-quality-source-readonly.json",JSON.stringify(report,null,2)+"\n");
 console.log("SYSTEM1_20261008_QUALITY_SOURCE_READONLY="+JSON.stringify(report));
}
if(import.meta.url===new URL("file://"+process.argv[1]).href)
 main().catch(err=>{console.error("QUALITY_SOURCE_READONLY_FATAL:"+sanitizeError(err));process.exitCode=2});
