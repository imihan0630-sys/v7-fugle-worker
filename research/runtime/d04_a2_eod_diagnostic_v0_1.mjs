import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const D04_A2_EOD_DIAGNOSTIC_VERSION = "D04_A2_EOD_DIAGNOSTIC_V0_1";
export const D04_A2_EOD_EVIDENCE_EPOCH = "D04_A2_EOD_EPOCH_V0_1";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertMarketDate(value) {
  const text = requiredText(value, "marketDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("marketDate must be YYYY-MM-DD");
  const d = new Date(text + "T00:00:00Z");
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10) !== text) {
    throw new Error("marketDate is invalid");
  }
  return text;
}

function taipeiDate(iso) {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) throw new Error("timestamp invalid");
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year:"numeric", month:"2-digit", day:"2-digit"
  }).format(d);
}

function sha256Text(text) {
  return createHash("sha256").update(text).digest("hex");
}

export function normalizeTwseDate(value) {
  const digits=String(value??"").replace(/\D/g,"");
  if (digits.length===7) {
    return `${Number(digits.slice(0,3))+1911}-${digits.slice(3,5)}-${digits.slice(5,7)}`;
  }
  if (digits.length===8) {
    return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`;
  }
  return null;
}

function numeric(value) {
  const raw=String(value??"").replaceAll(",","").trim();
  if (!raw || raw==="--" || raw==="---") return null;
  const n=Number(raw);
  return Number.isFinite(n) && n>0 ? n : null;
}

export function monthAnchorsThrough(marketDate, count=3) {
  const date=assertMarketDate(marketDate);
  if (!Number.isInteger(count)||count<1||count>12) throw new Error("count must be 1..12");
  const [y,m]=date.split("-").map(Number);
  const out=[];
  for(let i=0;i<count;i+=1){
    const d=new Date(Date.UTC(y,m-1-i,1,12,0,0));
    out.push(`${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,"0")}01`);
  }
  return out;
}

export function fmtqikUrl(monthAnchor) {
  if(!/^\d{8}$/.test(String(monthAnchor||""))) throw new Error("monthAnchor must be YYYYMM01");
  return `https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=${monthAnchor}`;
}

export function parseFmtqikRawPayload(rawText, expectedMonthAnchor) {
  const raw=requiredText(rawText,"rawText");
  const anchor=requiredText(expectedMonthAnchor,"expectedMonthAnchor");
  if(!/^\d{8}$/.test(anchor)) throw new Error("expectedMonthAnchor must be YYYYMM01");
  let payload;
  try { payload=JSON.parse(raw); } catch { throw new Error("FMTQIK response is not JSON"); }
  const fields=payload?.fields;
  const rows=payload?.data;
  if(String(payload?.stat||"").toUpperCase()!=="OK"||!Array.isArray(fields)||!Array.isArray(rows)){
    throw new Error("FMTQIK payload invalid");
  }
  const dateIndex=fields.indexOf("日期");
  const closeIndex=fields.indexOf("發行量加權股價指數");
  if(dateIndex<0||closeIndex<0) throw new Error("FMTQIK required fields missing");
  const expectedPrefix=`${anchor.slice(0,4)}-${anchor.slice(4,6)}-`;
  const parsed=rows.map((row,index)=>{
    if(!Array.isArray(row)) throw new Error(`FMTQIK row ${index} invalid`);
    const date=normalizeTwseDate(row[dateIndex]);
    const close=numeric(row[closeIndex]);
    if(!date||!date.startsWith(expectedPrefix)||close===null){
      throw new Error(`FMTQIK row ${index} date/close invalid`);
    }
    return {date,close};
  });
  const dates=parsed.map(x=>x.date);
  if(new Set(dates).size!==dates.length) throw new Error("FMTQIK duplicate date in month");
  parsed.sort((a,b)=>a.date.localeCompare(b.date));
  return Object.freeze({
    sourceMonthAnchor:anchor,
    rows:Object.freeze(parsed),
    rowCount:parsed.length,
    rawPayloadSha256:sha256Text(raw),
    rawByteLength:Buffer.byteLength(raw,"utf8"),
  });
}

function populationStd(values){
  if(!Array.isArray(values)||values.length===0||values.some(x=>!Number.isFinite(x))) return null;
  const mean=values.reduce((a,b)=>a+b,0)/values.length;
  return Math.sqrt(values.reduce((s,x)=>s+(x-mean)**2,0)/values.length);
}

function simpleReturns(rows){
  return rows.slice(1).map((row,i)=>row.close/rows[i].close-1);
}

export function buildD04A2EodDiagnostic({
  marketDate, observedAt, monthlyPayloads
}={}){
  const date=assertMarketDate(marketDate);
  const seen=requiredText(observedAt,"observedAt");
  if(taipeiDate(seen)!==date) throw new Error("observation is not same Taipei date");
  if(!Array.isArray(monthlyPayloads)||monthlyPayloads.length<2){
    throw new Error("at least two monthly payloads required");
  }
  const all=monthlyPayloads.flatMap(x=>x.rows||[]).filter(x=>x.date<=date);
  all.sort((a,b)=>a.date.localeCompare(b.date));
  const dates=all.map(x=>x.date);
  if(new Set(dates).size!==dates.length) throw new Error("cross-month duplicate session date");
  const target=all.filter(x=>x.date===date);
  if(target.length===0){
    return Object.freeze({
      version:D04_A2_EOD_DIAGNOSTIC_VERSION,evidenceEpoch:D04_A2_EOD_EVIDENCE_EPOCH,
      marketDate:date,observedAt:seen,state:"TARGET_DATE_NOT_READY",
      pointInTimeDecisionEligible:false,promotionGradeProspectiveDateCount:0,
      formalDecisionImpact:false,sessionCount:all.length,lastSessionDate:all.at(-1)?.date||null,
      sourceMonths:Object.freeze(monthlyPayloads.map(x=>x.sourceMonthAnchor)),
    });
  }
  if(target.length!==1) throw new Error("target date duplicate across payloads");
  if(all.length<21){
    return Object.freeze({
      version:D04_A2_EOD_DIAGNOSTIC_VERSION,evidenceEpoch:D04_A2_EOD_EVIDENCE_EPOCH,
      marketDate:date,observedAt:seen,state:"INSUFFICIENT_21_SESSION_HISTORY",
      pointInTimeDecisionEligible:false,promotionGradeProspectiveDateCount:0,
      formalDecisionImpact:false,sessionCount:all.length,lastSessionDate:all.at(-1)?.date||null,
      sourceMonths:Object.freeze(monthlyPayloads.map(x=>x.sourceMonthAnchor)),
    });
  }
  const window=all.slice(-21);
  if(window.at(-1).date!==date) throw new Error("last 21 window does not end at target");
  const r20=simpleReturns(window);
  const r5=r20.slice(-5);
  const prior15=r20.slice(0,15);
  const mean=(xs)=>xs.reduce((a,b)=>a+b,0)/xs.length;
  const compound=(xs)=>xs.reduce((p,x)=>p*(1+x),1)-1;
  const d5=populationStd(r5), d20=populationStd(r20), d15=populationStd(prior15);
  return Object.freeze({
    version:D04_A2_EOD_DIAGNOSTIC_VERSION,
    evidenceEpoch:D04_A2_EOD_EVIDENCE_EPOCH,
    marketDate:date,observedAt:seen,state:"EOD_DIAGNOSTIC_READY",
    sourceMonths:Object.freeze(monthlyPayloads.map(x=>x.sourceMonthAnchor)),
    sourceReceipts:Object.freeze(monthlyPayloads.map(x=>Object.freeze({
      sourceMonthAnchor:x.sourceMonthAnchor,
      rawPayloadSha256:x.rawPayloadSha256,
      rawByteLength:x.rawByteLength,
      requestedAt:x.requestedAt||null,
      receivedAt:x.receivedAt||null,
      url:x.url||fmtqikUrl(x.sourceMonthAnchor),
    }))),
    officialSessionWindow:Object.freeze(window.map(x=>Object.freeze({...x}))),
    sessionCountAllObserved:all.length,
    metrics:Object.freeze({
      dispersion5:d5,
      dispersion20:d20,
      overlapRatio5to20:d20>0?d5/d20:null,
      prior15Dispersion:d15,
      nonOverlapRecent5ToPrior15:d15>0?d5/d15:null,
      meanReturn5:mean(r5),
      meanReturn20:mean(r20),
      cumulativeReturn5:compound(r5),
      cumulativeReturn20:compound(r20),
    }),
    formula:Object.freeze({
      semanticName:"ROLLING_CLOSE_TO_CLOSE_RETURN_DISPERSION_POPSTD_SIMPLE",
      returnType:"SIMPLE_CLOSE_TO_CLOSE",
      dispersionEstimator:"POPULATION_STD",
      annualized:false,
    }),
    pointInTimeDecisionEligible:false,
    existingDecisionClockContract:"S2_DECISION_CLOCK_COLLECTOR_CONTRACT_V0_3_UNCHANGED",
    relationToExistingDecisionClock:"SEPARATE_RESEARCH_EOD_EPOCH",
    promotionGradeProspectiveDateCount:0,
    immutableD1WritePerformed:false,
    runFingerprintLinked:false,
    formalDecisionImpact:false,
  });
}

export async function collectD04A2EodDiagnostic({
  marketDate,
  fetchImpl=globalThis.fetch,
  now=()=>new Date(),
}={}){
  const date=assertMarketDate(marketDate);
  if(typeof fetchImpl!=="function") throw new Error("fetchImpl is required");
  const startedAt=now().toISOString();
  if(taipeiDate(startedAt)!==date) throw new Error("collector must run on same Taipei market date");
  const monthlyPayloads=[];
  const rawFiles=[];
  for(const anchor of monthAnchorsThrough(date,3)){
    const url=fmtqikUrl(anchor);
    const requestedAt=now().toISOString();
    const response=await fetchImpl(url,{
      method:"GET",redirect:"follow",
      headers:{Accept:"application/json","User-Agent":"D04-A2-EOD-Diagnostic/0.1"},
    });
    const receivedAt=now().toISOString();
    if(!response?.ok) throw new Error(`FMTQIK ${anchor} HTTP_${response?.status}`);
    const rawText=await response.text();
    const parsed=parseFmtqikRawPayload(rawText,anchor);
    monthlyPayloads.push(Object.freeze({...parsed,url,requestedAt,receivedAt}));
    rawFiles.push(Object.freeze({anchor,url,requestedAt,receivedAt,rawText,rawPayloadSha256:parsed.rawPayloadSha256}));
  }
  const observedAt=now().toISOString();
  const diagnostic=buildD04A2EodDiagnostic({marketDate:date,observedAt,monthlyPayloads});
  return Object.freeze({
    reportVersion:D04_A2_EOD_DIAGNOSTIC_VERSION,
    startedAt,completedAt:observedAt,
    diagnostic,
    rawFiles:Object.freeze(rawFiles),
    safety:Object.freeze({
      httpMethods:Object.freeze(["GET"]),
      d1Written:false,workerMutated:false,cloudflareCronChanged:false,
      system1RuntimeUsed:false,existingDecisionClockCollectorChanged:false,
      formalCoreChanged:false,
    }),
  });
}

async function main(){
  const args={};
  for(let i=2;i<process.argv.length;i+=2){
    const k=process.argv[i],v=process.argv[i+1];
    if(!k?.startsWith("--")||v===undefined) throw new Error("arguments must be --key value");
    args[k.slice(2)]=v;
  }
  const marketDate=assertMarketDate(args["market-date"]);
  const outputDir=resolve(requiredText(args["output-dir"],"output-dir"));
  const report=await collectD04A2EodDiagnostic({marketDate});
  await mkdir(outputDir,{recursive:true});
  for(const raw of report.rawFiles){
    await writeFile(join(outputDir,`fmtqik-${raw.anchor}.raw.json`),raw.rawText,"utf8");
  }
  const publicReport={...report,rawFiles:report.rawFiles.map(({rawText,...x})=>x)};
  await writeFile(join(outputDir,`d04-a2-eod-${marketDate}.json`),JSON.stringify(publicReport,null,2)+"\n","utf8");
  console.log(JSON.stringify({
    result:"PASS",state:report.diagnostic.state,marketDate,
    evidenceEpoch:D04_A2_EOD_EVIDENCE_EPOCH,
    pointInTimeDecisionEligible:false,promotionGradeProspectiveDateCount:0,
    formalDecisionImpact:false,
  },null,2));
}
const isMain=process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url));
if(isMain) main().catch(e=>{console.error(e?.stack||String(e));process.exitCode=1;});
