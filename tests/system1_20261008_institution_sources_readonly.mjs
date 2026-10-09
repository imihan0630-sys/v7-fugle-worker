import {mkdir,writeFile} from "node:fs/promises";
import {fetchBufferedOfficialSource} from "./official_source_fetch_v0_1.mjs";
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
    const response=await fetchBufferedOfficialSource(sources[market],{
      method:"GET",headers:{accept:"application/json"},timeoutMs:55000
    },{maxAttempts:2});
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
      const table=p?.tables?.[0];
      const rows=market==="TWSE"?(Array.isArray(p?.data)?p.data:[]):
        (Array.isArray(table?.data)?table.data:[]);
      const codeColumn=market==="TWSE"?p?.fields?.indexOf("證券代號"):0;
      const ordinary=new Set(rows.map(row=>
        market==="TWSE"?String(row?.[codeColumn]||"").trim():
        String(row?.[0]||"").replaceAll("=","").replaceAll('"',"").trim())
        .filter(code=>/^[1-9][0-9]{3}$/.test(code)));
      r.ordinaryStockCount=ordinary.size;
      r.expectedSchemaMatches=market==="TWSE"?(codeColumn>=0):
        Array.isArray(table?.fields)&&table.fields.length===24&&table.fields[0]==="代號";

      r.validStructure=Boolean(r.tableCount>0||r.reportedRowCount>0);
    }else{r.errorClass="HTTP_"+response.status;}
  }catch(error){r.errorClass=error?.name==="TimeoutError"?"TIMEOUT":"NETWORK_OR_PARSE_ERROR";}
  report.sources[market]=r;
}
report.uniqueOrdinaryStockCountSum=
  Number(report.sources.TWSE.ordinaryStockCount||0)+Number(report.sources.TPEx.ordinaryStockCount||0);
report.workerMinimumCompleteStocks=1500;
report.ordinaryCountClearsMinimum=report.uniqueOrdinaryStockCountSum>=1500;
report.ordinaryCodeSetsMayOverlap=true; // Sum is not proof of unique cross-market union.
report.bothOfficialInstitutionSourcesReachable=report.sources.TWSE.reachable&&report.sources.TPEx.reachable;
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-20261008-institution-sources-readonly.json",JSON.stringify(report,null,2)+"\n");
console.log("SYSTEM1_20261008_INSTITUTION_SOURCE_READONLY="+JSON.stringify(report));
