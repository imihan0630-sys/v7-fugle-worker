import crypto from "node:crypto";
import { writeFile } from "node:fs/promises";

const TWSE_CURRENT_URL="https://openapi.twse.com.tw/v1/opendata/t187ap03_L";
const TDCC_URL="https://opendata.tdcc.com.tw/getOD.ashx?id=1-5";
export const SCHEMA_VERSION="D16_21_TDCC_TWSE_SELECTION_AUDIT_V0_1";

function sha(v){return crypto.createHash("sha256").update(typeof v==="string"?v:JSON.stringify(v)).digest("hex");}
function must(c,m){if(!c)throw new Error(m);}
function ordinary(v){return /^[1-9][0-9]{3}$/.test(String(v??"").trim());}
function norm(v){return String(v??"").normalize("NFKC").trim();}

export function parseCsv(text){
  const rows=[]; let row=[],cell="",q=false;
  const s=String(text).replace(/^\uFEFF/,"");
  for(let i=0;i<s.length;i++){
    const ch=s[i];
    if(q){
      if(ch==='"'&&s[i+1]==='"'){cell+='"';i++;}
      else if(ch==='"')q=false;
      else cell+=ch;
    }else{
      if(ch==='"')q=true;
      else if(ch===','){row.push(cell);cell="";}
      else if(ch==='\n'){row.push(cell.replace(/\r$/,""));rows.push(row);row=[];cell="";}
      else cell+=ch;
    }
  }
  if(cell.length||row.length){row.push(cell.replace(/\r$/,""));rows.push(row);}
  must(!q,"CSV_UNCLOSED_QUOTE");
  return rows.filter(r=>r.some(x=>String(x).trim()!==""));
}
export function parseTdccPresence(text){
  const table=parseCsv(text);
  must(table.length>1000,"TDCC_CSV_TOO_SMALL");
  const headers=table[0].map(norm);
  for(const h of ["資料日期","證券代號","持股分級","股數"])must(headers.includes(h),"TDCC_HEADER_MISSING_"+h);
  const idx=Object.fromEntries(headers.map((h,i)=>[h,i]));
  const bySymbol=new Map();
  let sourceDate=null;
  for(const r of table.slice(1)){
    const symbol=norm(r[idx["證券代號"]]);
    const date=norm(r[idx["資料日期"]]);
    const grade=norm(r[idx["持股分級"]]);
    if(!symbol||!date||!grade)continue;
    if(sourceDate===null)sourceDate=date;
    must(date===sourceDate,"TDCC_MULTIPLE_SOURCE_DATES");
    if(!bySymbol.has(symbol))bySymbol.set(symbol,new Set());
    bySymbol.get(symbol).add(grade);
  }
  must(/^20\d{6}$/.test(sourceDate||""),"TDCC_SOURCE_DATE_INVALID");
  const symbols=[...bySymbol.keys()].sort();
  const ordinarySymbols=symbols.filter(ordinary);
  const completeGrade17=ordinarySymbols.filter(s=>bySymbol.get(s).has("17"));
  return {sourceDate,symbols,ordinarySymbols,completeGrade17,rawRowCount:table.length-1};
}
export function parseTwseCurrent(payload){
  must(Array.isArray(payload)&&payload.length>500,"TWSE_CURRENT_PAYLOAD_INVALID");
  const rows=payload.map(r=>({
    symbol:norm(r["公司代號"]),
    companyName:norm(r["公司名稱"])||null,
    industry:norm(r["產業別"])||"UNKNOWN",
    listingDate:norm(r["上市日期"])||null,
  })).filter(r=>ordinary(r.symbol));
  const seen=new Set();
  for(const r of rows){must(!seen.has(r.symbol),"TWSE_DUPLICATE_SYMBOL");seen.add(r.symbol);}
  return rows.sort((a,b)=>a.symbol.localeCompare(b.symbol));
}
function coverageByIndustry(targetRows,tdccSet){
  const m=new Map();
  for(const r of targetRows){
    if(!m.has(r.industry))m.set(r.industry,{targetN:0,knownN:0,missingN:0});
    const x=m.get(r.industry); x.targetN++;
    if(tdccSet.has(r.symbol))x.knownN++;else x.missingN++;
  }
  return [...m.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([industry,x])=>({
    industry,...x,coverage:x.targetN?x.knownN/x.targetN:null,
  }));
}
export function buildAudit({twsePayload,tdccText,capturedAt,twseRawHash,tdccRawHash}){
  const capturedMs=Date.parse(capturedAt);must(Number.isFinite(capturedMs),"CAPTURED_AT_INVALID");
  const target=parseTwseCurrent(twsePayload);
  const tdcc=parseTdccPresence(tdccText);
  const targetSet=new Set(target.map(x=>x.symbol));
  const tdccSet=new Set(tdcc.completeGrade17);
  const rows=target.map(r=>({
    ...r,
    tdccState:tdccSet.has(r.symbol)?"KNOWN":"MISSING",
    entityLinkMethod:"EXACT_SECURITY_CODE",
  }));
  const knownN=rows.filter(r=>r.tdccState==="KNOWN").length;
  const missing=rows.filter(r=>r.tdccState==="MISSING").map(r=>r.symbol);
  const extraTdccOrdinary=tdcc.completeGrade17.filter(s=>!targetSet.has(s));
  const industryCoverage=coverageByIndustry(target,tdccSet);
  const sourceDateIso=tdcc.sourceDate.slice(0,4)+"-"+tdcc.sourceDate.slice(4,6)+"-"+tdcc.sourceDate.slice(6,8);
  must(sourceDateIso<=capturedAt.slice(0,10),"TDCC_SOURCE_DATE_AFTER_CAPTURE");
  const base={
    schemaVersion:SCHEMA_VERSION,
    scope:"TWSE_CURRENT_ORDINARY_COMMON_EQUITY_ONLY",
    tpexScope:"OUT_OF_SCOPE_NOT_INHERITED",
    capturedAt,
    firstKnownAtUpperBound:capturedAt,
    targetUniverse:{
      sourceId:"TWSE_OPENAPI_T187AP03_L",
      sourceUrl:TWSE_CURRENT_URL,
      rawHash:twseRawHash,
      targetN:rows.length,
      definition:"CURRENT_TWSE_FOUR_DIGIT_ORDINARY_COMPANY_REGISTRY_AT_CAPTURE",
    },
    alternativeData:{
      sourceId:"TDCC_OPEN_DATA_1_5",
      sourceUrl:TDCC_URL,
      rawHash:tdccRawHash,
      sourceDate:sourceDateIso,
      rawRowCount:tdcc.rawRowCount,
      ordinarySecurityN:tdcc.ordinarySymbols.length,
      ordinaryWithGrade17N:tdcc.completeGrade17.length,
      semantics:"WEEKLY_SHAREHOLDING_DISTRIBUTION_STOCK_NOT_FLOW",
      holderIdentity:"UNKNOWN",
      passiveShare:"UNKNOWN",
    },
    coverage:{
      knownN,
      missingN:missing.length,
      targetCoverage:rows.length?knownN/rows.length:null,
      missingSymbols:missing,
      extraTdccOrdinaryN:extraTdccOrdinary.length,
      extraTdccOrdinarySymbols:extraTdccOrdinary,
      industryCoverage,
      silentDrop:false,
      missingImputed:false,
    },
    entityLink:{
      method:"EXACT_SECURITY_CODE",
      targetRows:rows,
    },
    biasDiagnostics:{
      currentTargetPopulationFrozen:true,
      sourceDateBeforeOrEqualCapture:true,
      tdccIncludesNonTargetSecurities:true,
      targetMissingnessVisible:true,
      industryMissingnessVisible:true,
      entryExitInferenceFromThisCurrentCut:false,
      historicalBackfillPerformed:false,
      currentUniverseUsedForHistoricalDates:false,
    },
    outcomeAccessed:false,
    alphaClaimMade:false,
    formalCoreChanged:false,
  };
  return {...base,receiptHash:sha(base)};
}
async function fetchText(url){
  const r=await fetch(url,{headers:{accept:"*/*","user-agent":"Room11-D16-21-SelectionAudit/0.1"},signal:AbortSignal.timeout(45000)});
  const text=await r.text();
  if(!r.ok)throw new Error("HTTP_"+r.status+"_"+url);
  return {text,hash:sha(text)};
}
export async function runPhysical({capturedAt=new Date().toISOString(),outputPath=process.env.D16_21_OUTPUT||null}={}){
  const [twse,tdcc]=await Promise.all([fetchText(TWSE_CURRENT_URL),fetchText(TDCC_URL)]);
  const twsePayload=JSON.parse(twse.text);
  const out=buildAudit({twsePayload,tdccText:tdcc.text,capturedAt,twseRawHash:twse.hash,tdccRawHash:tdcc.hash});
  if(outputPath)await writeFile(outputPath,JSON.stringify(out,null,2)+"\n","utf8");
  return out;
}
if(import.meta.url===`file://${process.argv[1]}`)console.log(JSON.stringify(await runPhysical(),null,2));
