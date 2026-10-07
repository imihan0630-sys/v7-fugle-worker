import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";

const apiKey=process.env.FUGLE_API_KEY;
assert.ok(apiKey,"FUGLE_API_KEY is required");

const symbol="2454";
const marketDate="2026-10-06";
const slotKey="11:45";
const url=`https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/${symbol}?from=${marketDate}&to=${marketDate}&timeframe=15&fields=open,high,low,close,volume&sort=asc`;

const res=await fetch(url,{headers:{"X-API-KEY":apiKey,accept:"application/json"},signal:AbortSignal.timeout(45000)});
const rawText=await res.text();
assert.equal(res.ok,true,`historical 15m HTTP ${res.status}`);
const rawHash=createHash("sha256").update(rawText).digest("hex");
let payload; try{payload=JSON.parse(rawText)}catch{throw new Error("historical 15m invalid JSON")}
const rows=Array.isArray(payload?.data)?payload.data:[];
const fmt=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false});
const localParts=value=>{
  const ms=Date.parse(value); if(!Number.isFinite(ms)) return null;
  const p=Object.fromEntries(fmt.formatToParts(new Date(ms)).filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
  return {date:`${p.year}-${p.month}-${p.day}`,clock:`${p.hour}:${p.minute}`};
};
const identities=rows.map((row,index)=>({index,time:String(row?.date||row?.time||""),local:localParts(row?.date||row?.time)}));
const target=identities.filter(x=>x.local?.date===marketDate&&x.local?.clock===slotKey);
const report={
  schemaVersion:"D02_PVE258_PRIOR_SLOT_AVAILABILITY_V0_1",
  generatedAt:new Date().toISOString(),
  readOnly:true,
  outcomeFieldsEmitted:false,
  symbol,
  marketDate,
  slotKey,
  httpStatus:res.status,
  provider:"FUGLE",
  endpointFamily:"historical/candles",
  timeframe:"15",
  rawPayloadHash:rawHash,
  rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
  sourceRowCount:rows.length,
  targetSlotOccurrenceCount:target.length,
  targetSlotExistsExactlyOnce:target.length===1,
  firstSourceLocalIdentity:identities[0]?.local??null,
  lastSourceLocalIdentity:identities.at(-1)?.local??null,
  mutationCount:0
};
assert.equal(report.targetSlotExistsExactlyOnce,true,"2454 2026-10-06 11:45 exact slot not uniquely observed");
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/d02-pve258-prior-slot-availability.json",JSON.stringify(report,null,2)+"\n");
console.log("D02_PVE258_RESULT="+JSON.stringify(report));
