// System2 DATA_LANE only: bounded, public, no-auth positive TWTAWU source
// representation diagnostic. Never certify NO_EVENT or NC-T01 continuity.
import { createHash } from "node:crypto";

export const TWTAWU_PARITY_DIAGNOSTIC_VERSION="S2_TWTAWU_POSITIVE_JSON_CSV_DIAGNOSTIC_V0_1";
export const TWTAWU_POSITIVE_CONTROL=Object.freeze({
  startDate:"2026-08-13",endDate:"2026-08-14",
  symbol:"1218",suspendedDate:"2026-08-13",resumedDate:"2026-08-14",
  source:"TWSE_TWTAWU_POSITIVE_CONTROL_RUN_37488505236",
});

const BASE="https://www.twse.com.tw/rwd/zh/afterTrading/TWTAWU";
const HEADERS=Object.freeze({
  Accept:"application/json,text/csv,text/plain,*/*",
  "User-Agent":"Mozilla/5.0 System2-Research-TWTAWU-Readonly/0.1",
  Referer:"https://www.twse.com.tw/zh/trading/historical/twtawu.html",
});
const requiredFields=["證券代號","暫停交易日期","恢復交易日期"];
const digest=body=>createHash("sha256").update(body,"utf8").digest("hex");
const normal=field=>String(field??"").replace(/\uFEFF/g,"").replace(/\s+/g,"").replace(/[　]/g,"").trim();

export function buildTwtaWuDiagnosticUrlV0_1(format,{startDate,endDate}=TWTAWU_POSITIVE_CONTROL){
  if(!["json","csv"].includes(format))throw new Error("unsupported response candidate");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(startDate)||!/^\d{4}-\d{2}-\d{2}$/.test(endDate)||
    startDate>endDate)throw new Error("invalid bounded date identity");
  const params=new URLSearchParams({
    startDate:startDate.replaceAll("-",""),
    endDate:endDate.replaceAll("-",""),
    querytype:"3",response:format,
  });
  return BASE+"?"+params.toString();
}

export function decodeTwtaWuDateV0_1(value){
  const text=normal(value);
  if(text===""||text==="--"||text==="-")return null;
  const match=text.match(/^(\d{2,4})[\/\-.年](\d{1,2})[\/\-.月](\d{1,2})(?:日)?$/);
  if(!match)throw new Error("unknown TWTAWU date format");
  const yyyy=Number(match[1])<=1911?Number(match[1])+1911:Number(match[1]);
  const mm=Number(match[2]),dd=Number(match[3]);
  const iso=String(yyyy).padStart(4,"0")+"-"+String(mm).padStart(2,"0")+"-"+String(dd).padStart(2,"0");
  if(!Number.isInteger(yyyy)||!Number.isInteger(mm)||!Number.isInteger(dd)||
    mm<1||mm>12||dd<1||dd>31||
    new Date(iso+"T00:00:00Z").toISOString().slice(0,10)!==iso){
    throw new Error("invalid TWTAWU date value");
  }
  return iso;
}

export function parseCsvRecordsStrictV0_1(body){
  if(typeof body!=="string"||!body.trim())throw new Error("CSV body absent");
  const rows=[];let row=[];let cell="";let quoted=false;
  for(let i=0;i<body.length;i++){
    const ch=body[i];
    if(quoted){
      if(ch==='"'&&body[i+1]==='"'){cell+='"';i++;}
      else if(ch==='"')quoted=false;
      else cell+=ch;
      continue;
    }
    if(ch==='"'){
      if(cell!=="")throw new Error("CSV unescaped quote");
      quoted=true;
    }else if(ch===","){row.push(cell);cell="";}
    else if(ch==="\r"||ch==="\n"){
      if(ch==="\r"&&body[i+1]==="\n")i++;
      row.push(cell);cell="";
      if(row.some(x=>normal(x)!==""))rows.push(row);
      row=[];
    }else{cell+=ch;}
  }
  if(quoted)throw new Error("CSV unclosed quote");
  if(cell!==""||row.length){row.push(cell);if(row.some(x=>normal(x)!==""))rows.push(row);}
  return rows;
}

function normalizeRows(fields,rows){
  if(!Array.isArray(fields)||!Array.isArray(rows))throw new Error("row container missing");
  const cols=fields.map(normal);
  const index=requiredFields.map(label=>cols.indexOf(label));
  if(index.some(n=>n<0))throw new Error("TWTAWU required fields missing");
  const result=[];
  for(const row of rows){
    if(!Array.isArray(row)||row.length<cols.length)throw new Error("TWTAWU row shape incomplete");
    const symbol=normal(row[index[0]]);
    if(!/^[0-9A-Za-z]{4,8}$/.test(symbol))throw new Error("unrecognized TWTAWU security code");
    const start=decodeTwtaWuDateV0_1(row[index[1]]);
    const end=decodeTwtaWuDateV0_1(row[index[2]]);
    if(!start)throw new Error("suspension date absent");
    if(end&&end<start)throw new Error("resumption date before suspension");
    result.push({symbol,suspendedDate:start,resumedDate:end});
  }
  const ids=result.map(x=>JSON.stringify(x)).sort();
  if(new Set(ids).size!==ids.length)throw new Error("duplicate TWTAWU normalized row");
  return ids;
}

export function parseTwtaWuJsonRowsV0_1(body){
  const payload=JSON.parse(body);
  if(!payload||typeof payload!=="object"||Array.isArray(payload))
    throw new Error("official JSON envelope missing");
  if(String(payload.stat??"").toUpperCase()!=="OK")throw new Error("official status not OK");
  const fields=payload.fields,data=payload.data;
  return normalizeRows(fields,data);
}

export function parseTwtaWuCsvRowsV0_1(body){
  const records=parseCsvRecordsStrictV0_1(body.replace(/^\uFEFF/,""));
  const headerIndex=records.findIndex(row=>
    requiredFields.every(x=>row.map(normal).includes(x)));
  if(headerIndex<0)throw new Error("CSV official header not proven");
  const fields=records[headerIndex],data=records.slice(headerIndex+1);
  if(data.length===0)throw new Error("CSV positive-control row absent");
  return normalizeRows(fields,data);
}

function hasPositive(rows,expected){
  const key=JSON.stringify({
    symbol:expected.symbol,suspendedDate:expected.suspendedDate,
    resumedDate:expected.resumedDate,
  });
  return rows.includes(key);
}

async function acquire(url,fetchImpl,timeoutMs){
  const response=await fetchImpl(url,{
    method:"GET",headers:HEADERS,signal:AbortSignal.timeout(timeoutMs),
  });
  const text=await response.text();
  return {
    status:Number(response.status),ok:response.ok===true,
    contentType:response.headers?.get?.("content-type")||null,
    rawByteCount:Buffer.byteLength(text,"utf8"),
    hash:digest(text),body:text,
  };
}

export async function probeTwtaWuPositiveJsonCsvParityV0_1({
  fetchImpl=globalThis.fetch,observedAt=()=>new Date().toISOString(),
  timeoutMs=20000,positiveControl=TWTAWU_POSITIVE_CONTROL,
}={}){
  if(typeof fetchImpl!=="function")throw new Error("fetch implementation required");
  if(typeof observedAt!=="function")throw new Error("actual observation clock required");
  if(!Number.isInteger(timeoutMs)||timeoutMs<1000||timeoutMs>60000)
    throw new Error("timeout bound invalid");

  const urls={
    json:buildTwtaWuDiagnosticUrlV0_1("json",positiveControl),
    csvCandidate:buildTwtaWuDiagnosticUrlV0_1("csv",positiveControl),
  };
  const report={
    schemaVersion:TWTAWU_PARITY_DIAGNOSTIC_VERSION,
    source:"TWSE_TWTAWU",
    positiveControl,
    urls,
    result:"BLOCKED_POSITIVE_PARITY_UNVERIFIED",
    blockers:[],
    observations:{},
    jsonCsvRowSetParity:false,
    sameScopeOfficialExportContractProven:false,
    exactRangeCompletenessProven:false,
    absenceCertifiesNoSuspension:false,
    noEventMayBeClaimed:false,
    technicalContinuityCertified:false,
    ncT01PromotionAuthorized:false,
    decisionTimestampBound:false,
    historicalPITPublicationProven:false,
    d1RowsRead:0,d1RowsWritten:0,r2Writes:0,
    system1RuntimeUsed:false,
  };
  try{
    const response=await acquire(urls.json,fetchImpl,timeoutMs);
    report.observations.json={
      httpStatus:response.status,contentType:response.contentType,
      rawByteCount:response.rawByteCount,sha256:response.hash,
      observedAt:observedAt(),
    };
    if(!response.ok)throw new Error("official JSON response HTTP "+response.status);
    const rows=parseTwtaWuJsonRowsV0_1(response.body);
    report.observations.json.normalizedRowCount=rows.length;
    report.observations.json.positiveControlPresent=hasPositive(rows,positiveControl);
    if(!report.observations.json.positiveControlPresent)
      throw new Error("official JSON known 1218 event absent");
    const exportResponse=await acquire(urls.csvCandidate,fetchImpl,timeoutMs);
    report.observations.csvCandidate={
      httpStatus:exportResponse.status,contentType:exportResponse.contentType,
      rawByteCount:exportResponse.rawByteCount,sha256:exportResponse.hash,
      observedAt:observedAt(),
    };
    if(!exportResponse.ok)throw new Error("unverified CSV export candidate HTTP "+exportResponse.status);
    const exportRows=parseTwtaWuCsvRowsV0_1(exportResponse.body);
    report.observations.csvCandidate.normalizedRowCount=exportRows.length;
    report.observations.csvCandidate.positiveControlPresent=hasPositive(exportRows,positiveControl);
    if(!report.observations.csvCandidate.positiveControlPresent)
      throw new Error("unverified CSV export does not contain positive control");
    if(JSON.stringify(rows)!==JSON.stringify(exportRows))
      throw new Error("JSON CSV candidate normalized row sets disagree");
    report.jsonCsvRowSetParity=true;
    // Two representations may share an incomplete backend; this probe never
    // self-certifies range identity, no truncation, or a negative/no-event.
    report.result="MATCHED_POSITIVE_PARITY_DIAGNOSTIC_ONLY";
    report.blockers.push("SAME_SCOPE_EXPORT_PROVENANCE_NOT_INDEPENDENTLY_CERTIFIED");
    report.blockers.push("EXACT_BOUNDED_RANGE_COMPLETENESS_NOT_PROVEN");
    report.blockers.push("PROSPECTIVE_PIT_WINDOW_NOT_OBSERVED");
  }catch(error){
    report.blockers.push("FAIL_CLOSED:"+String(error?.message||error).slice(0,240));
  }
  return Object.freeze(report);
}
