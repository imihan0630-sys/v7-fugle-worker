import {createHash} from "node:crypto";
import {deriveSameSlotBaselineCleanV01} from "./d02_pve256_same_slot_baseline_clean_guard_v0_1.mjs";

const DATE_RE=/^\d{4}-\d{2}-\d{2}$/;
const SLOT_RE=/^(?:0\d|1\d|2[0-3]):[0-5]\d$/;
const taipeiParts=value=>{
  const ms=Date.parse(value);
  if(!Number.isFinite(ms)) return null;
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date(ms));
  return Object.fromEntries(parts.filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
};
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==="object"?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
const sha256=value=>createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");

export function deriveBaselineContentReceiptV01(input={}) {
  const marketDate=DATE_RE.test(String(input.marketDate||""))?String(input.marketDate):null;
  const slotKey=SLOT_RE.test(String(input.slotKey||""))?String(input.slotKey):null;
  const baseline=input.baseline&&typeof input.baseline==="object"?input.baseline:{};
  const resetAt=DATE_RE.test(String(baseline.corporateActionResetAt||""))?String(baseline.corporateActionResetAt):null;
  const sessions=Array.isArray(baseline.sessions)?baseline.sessions:[];
  const normalized=[];
  const invalid=[];
  for(const session of sessions){
    const date=DATE_RE.test(String(session?.marketDate||""))?String(session.marketDate):null;
    if(!date){invalid.push({marketDate:null,reason:"SESSION_DATE_INVALID"});continue;}
    if(marketDate && date>=marketDate) continue;
    if(resetAt && date<resetAt) continue;
    const matches=(Array.isArray(session?.bars)?session.bars:[]).filter(b=>String(b?.slotKey||"")===slotKey);
    if(matches.length!==1){invalid.push({marketDate:date,reason:matches.length?"DUPLICATE_EXACT_SLOT":"EXACT_SLOT_MISSING"});continue;}
    const bar=matches[0];
    const volume=(typeof bar?.volume==="number"&&Number.isFinite(bar.volume)&&bar.volume>=0)?bar.volume:null;
    const p=taipeiParts(bar?.time);
    const timeDate=p?`${p.year}-${p.month}-${p.day}`:null;
    const timeSlot=p?`${p.hour}:${p.minute}`:null;
    if(volume===null){invalid.push({marketDate:date,reason:"EXACT_SLOT_VOLUME_INVALID"});continue;}
    if(!p||timeDate!==date||timeSlot!==slotKey){invalid.push({marketDate:date,reason:"EXACT_SLOT_TIME_IDENTITY_INVALID"});continue;}
    normalized.push({marketDate:date,slotKey,time:String(bar.time),volume});
  }
  normalized.sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
  const dedup=[];
  const seen=new Set();
  for(const row of normalized){
    if(seen.has(row.marketDate)){invalid.push({marketDate:row.marketDate,reason:"DUPLICATE_SESSION_DATE"});continue;}
    seen.add(row.marketDate);dedup.push(row);
  }
  const last20=dedup.slice(-20);
  const baselineAsOfDate=last20.at(-1)?.marketDate??null;
  const sameSlotHistoryValidityState=last20.length>=20?"PASS":(sessions.length?"FAIL":"UNKNOWN");
  let corporateActionContinuityState=input.corporateActionContinuityProof??null;
  if(!corporateActionContinuityState && resetAt && last20.length>=20 && last20.every(x=>x.marketDate>=resetAt)) corporateActionContinuityState="RESET_CLEAN_GE20";
  const contentIdentity={schemaVersion:"D02_PVE257_BASELINE_CONTENT_RECEIPT_V0_1",slotKey,marketDate,resetAt,last20};
  const receipt={
    schemaVersion:contentIdentity.schemaVersion,
    marketDate,slotKey,
    baselineWideLastMarketDate:DATE_RE.test(String(baseline.lastMarketDate||""))?String(baseline.lastMarketDate):null,
    corporateActionResetAt:resetAt,
    eligibleExactSlotSessionCount:dedup.length,
    invalidExactSlotSessions:invalid,
    last20ExactSlotDates:last20.map(x=>x.marketDate),
    baselineAsOfDate,
    baselineContentFingerprint:sha256(contentIdentity),
    sameSlotHistoryValidityState,
    corporateActionContinuityState:corporateActionContinuityState??"UNKNOWN"
  };
  receipt.guard=deriveSameSlotBaselineCleanV01({
    marketDate,
    baselineAsOfDate,
    expectedLatestComparableSlotDate:input.expectedLatestComparableSlotDate??null,
    slotHistoryCount:typeof input.slotHistoryCount==="number"?input.slotHistoryCount:last20.length,
    pvSlotRvol20:input.pvSlotRvol20,
    corporateActionContinuityState:receipt.corporateActionContinuityState,
    sameSlotHistoryValidityState
  });
  return receipt;
}
