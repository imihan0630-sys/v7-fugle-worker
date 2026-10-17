// System 1 P0: read-only, exact-candidate D1 snapshot membership receipt.
// This inspects original persisted bytes ONLY. It never certifies MOPS originals,
// availability time, PIT, Formal selection, a legitimate zero pick or trading.
// Historical date is frozen to prevent opportunistic retrospective backfill.
import {createHash} from "node:crypto";
export const DATE="2026-10-16";
export const CODES=Object.freeze(["3236","5340","3147","4167","6122"]);
export const KIND="QUARTER_EPS";
export const ORIGINAL_SELECT="SELECT snapshot_json FROM v7_quality_snapshots WHERE dataset_key=?1 AND market_date=?2 LIMIT 1";
const isObj=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const digest=s=>createHash("sha256").update(s).digest("hex");
export function classifyOriginalD1QuarterEps({sourceDatabaseName,marketDate,rows,meta,observedAt}={}){
 const base={schema:"S1_P0_QUARTER_EPS_D1_SYMBOL_MEMBERSHIP_V0_1",
  date:DATE,sourceDatabase:"v7-live",observedAt:observedAt||null,
  queryIsOriginalD1ReadOnly:true,productionDataChanged:false,
  sourceOriginalReportVerified:false,filingPublishedAt:null,firstKnownAt:null,
  historicalPitCertified:false,formalSelectionCertified:false,
  zeroPicksCertified:false,canImport:false,canScan:false,canTrade:false,
  candidates:CODES.map(symbol=>({symbol,present:null,quarterEpsVerified:null,
   previousQuarterEpsVerified:null,readbackState:"UNKNOWN"}))};
 function blocked(reason,more={}){return {...base,state:"NOT_VERIFIED",reason,...more};}
 if(sourceDatabaseName!=="v7-live"||marketDate!==DATE)return blocked("SOURCE_OR_DATE_NOT_PINNED");
 if(!isObj(meta)||!Number.isSafeInteger(meta.rows_written)||meta.rows_written!==0||
    !Number.isSafeInteger(meta.rows_read)||meta.rows_read<0||meta.rows_read>20000)
   return blocked("D1_SELECT_METRICS_UNVERIFIED");
 if(!Array.isArray(rows)||rows.length!==1||!isObj(rows[0])||
    typeof rows[0].snapshot_json!=="string"||rows[0].snapshot_json.length>1000000)
   return blocked("EXACT_ONE_ORIGINAL_SNAPSHOT_REQUIRED",{rowsWritten:meta.rows_written,rowsRead:meta.rows_read});
 const raw=rows[0].snapshot_json;
 let snapshot;
 try {snapshot=JSON.parse(raw);} catch {return blocked("ORIGINAL_JSON_INVALID");}
 if(!isObj(snapshot)||!isObj(snapshot.stocks))return blocked("ORIGINAL_STOCK_MAP_INVALID");
 const symbols=Object.keys(snapshot.stocks);
 if(symbols.length>200||symbols.some(x=>!/^\d{4}$/.test(x)))
   return blocked("ORIGINAL_STOCK_MAP_NOT_BOUNDED");
 // Old snapshot variants may lack one metadata field; report that honestly,
 // but never infer reporting period, official reporting basis or true PIT.
 const exactPeriod=snapshot.asOfDate===DATE&&snapshot.year===2026&&snapshot.quarter===2;
 const countMatches=Number.isSafeInteger(snapshot.count)&&snapshot.count===symbols.length;
 const coverage=CODES.map(symbol=>{
  const row=snapshot.stocks[symbol];
  const present=Object.hasOwn(snapshot.stocks,symbol);
  const rowValid=present&&isObj(row);
  const q=rowValid&&row.quarterEpsVerified===true;
  const p=rowValid&&row.previousQuarterEpsVerified===true;
  const numeric=rowValid&&typeof row.quarterEPS==="number"&&Number.isFinite(row.quarterEPS)&&
   typeof row.previousQuarterEPS==="number"&&Number.isFinite(row.previousQuarterEPS);
  return {symbol,present,quarterEpsVerified:rowValid?row.quarterEpsVerified===true:false,
   previousQuarterEpsVerified:rowValid?row.previousQuarterEpsVerified===true:false,
   numericQuarterAndPreviousEps:Boolean(numeric),
   readbackState:!present?"ABSENT":!rowValid?"INVALID_ROW":q&&p&&numeric?
     "PRESENT_FLAGS_AND_NUMERIC_ONLY__ORIGINAL_SOURCE_NOT_CERTIFIED":"PRESENT_INCOMPLETE"};
 });
 return {...base,state:exactPeriod&&countMatches?"EXACT_SNAPSHOT_MEMBERSHIP_OBSERVED":"SNAPSHOT_METADATA_MISMATCH",
  reason:exactPeriod&&countMatches?"D1_STOCK_KEYS_READ_ONLY":"PERIOD_OR_COUNT_UNVERIFIED",
  rawD1SnapshotSha256:digest(raw),stockMapCount:symbols.length,
  reportedCount:Number.isSafeInteger(snapshot.count)?snapshot.count:null,
  reportedAsOfDate:snapshot.asOfDate??null,
  reportedYear:snapshot.year??null,reportedQuarter:snapshot.quarter??null,
  periodMatches:exactPeriod,countMatches,rowsWritten:meta.rows_written,rowsRead:meta.rows_read,
  candidates:coverage,missingCodes:coverage.filter(x=>!x.present).map(x=>x.symbol),
  // A stock with complete flags in D1 is still NOT certified as an original C filing.
  originalIssuerBasisPerCandidateCertified:false,
  sourceShaMatchedToOriginalMops:false,completeCandidateCoverageCertified:false};
}
