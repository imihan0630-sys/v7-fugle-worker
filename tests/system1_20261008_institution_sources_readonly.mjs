import {mkdir,writeFile} from "node:fs/promises";
const date="2026-10-08";
const sources={
  TWSE:"https://www.twse.com.tw/rwd/zh/fund/T86?response=json&date=20261008&selectType=ALL",
  TPEx:"https://www.tpex.org.tw/www/zh-tw/insti/dailyTrade?type=Daily&sect=EW&date=115%2F10%2F08&id=&response=json"
};
const report={schemaVersion:"SYSTEM1_20261008_OFFICIAL_INSTITUTION_SOURCE_V0_1",
  observedAt:new Date().toISOString(),marketDate:date,
  evidenceGrade:"PUBLIC_OFFICIAL_SOURCE_ONLY",d1InstitutionWriteVerified:false,
  streakThreeTradingDatesVerified:false,formalScanVerified:false,
  noCredentials:true,noPost:true,noD1Write:true,noPlanChanges:true,noTrade:true,noPush:true,
  sources:{}};
for(const market of ["TWSE","TPEx"]){
  const r={httpStatus:null,reachable:false,officialStatus:null,officialDate:null,tableCount:null,reportedRowCount:null,errorClass:null};
  try{
    const response=await fetch(sources[market],{
      method:"GET",headers:{accept:"application/json"},signal:AbortSignal.timeout(26000)});
    r.httpStatus=response.status;
    if(response.ok){
      const p=await response.json();
      r.reachable=true;
      r.officialStatus=p?.stat??p?.status??null;
      r.officialDate=p?.date??p?.Date??null;
      r.tableCount=Array.isArray(p?.tables)?p.tables.length:null;
      r.reportedRowCount=Array.isArray(p?.data)?p.data.length:
        Array.isArray(p?.aaData)?p.aaData.length:null;
      r.fieldCount=Array.isArray(p?.fields)?p.fields.length:null;
      r.validStructure=Boolean(r.tableCount>0||r.reportedRowCount>0);
    }else{r.errorClass="HTTP_"+response.status;}
  }catch(error){r.errorClass=error?.name==="TimeoutError"?"TIMEOUT":"NETWORK_OR_PARSE_ERROR";}
  report.sources[market]=r;
}
report.bothOfficialInstitutionSourcesReachable=report.sources.TWSE.reachable&&report.sources.TPEx.reachable;
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-20261008-institution-sources-readonly.json",JSON.stringify(report,null,2)+"\n");
console.log("SYSTEM1_20261008_INSTITUTION_SOURCE_READONLY="+JSON.stringify(report));
