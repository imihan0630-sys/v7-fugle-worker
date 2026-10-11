import assert from "node:assert/strict";
import {admitSnapshot,attachBucketAndVintage} from "./d01_sara_provider_sidecar_admission_v0_1.mjs";
const query={symbol:"1101",timeframe:"60"};
const row=(t="2026-10-08T09:00:00+08:00")=>({date:t,open:100,high:102,low:99,close:101,volume:10,average:100.5});
const raw={symbol:"1101",type:"EQUITY",exchange:"TWSE",timeframe:"60",sort:"asc",data:[row()]};
const receipt={payloadSha256:"SYNTH_SHA",requestReceiptId:"SYNTH_R1",capturedAt:"2026-10-08T17:00:00+08:00",symbol:"1101",timeframe:"60",exchange:"TWSE",sourceKind:"PROVIDER_HTTP_RESPONSE"};
const proof=(date=raw.data[0].date)=>({date,completedAt:"2026-10-08T10:00:00+08:00",observedAt:"2026-10-08T17:00:00+08:00",revisionId:"SYNTH_REV1",sessionBucketReceiptId:"SYNTH_BUCKET1"});
const cert={sourceSha256:"SYNTH_SHA",bucketTimestampMeaning:"OPEN",sessionBucketCalendarCertified:true,corporateActionContinuityCertified:true,rowReceipts:[proof()]};
const admitted=()=>admitSnapshot(raw,query,receipt);
const check=(name,fn)=>{try{fn();console.log("PASS "+name);return true}catch(e){console.error("FAIL "+name+" "+e.message);return false}};
const t=[
["official-shaped response accepts snapshot not replay",()=>assert.equal(admitted().state,"RAW_SNAPSHOT_ACCEPTED_REPLAY_BLOCKED")],
["snapshot alone cannot claim predictor replay",()=>assert.equal(admitted().replaySafe,false)],
["connector contentId only blocked",()=>assert.equal(admitSnapshot({contentId:"FCNT000154?"},query,receipt).reason,"NO_PHYSICAL_ROWS")],
["empty raw rows not proven coverage",()=>assert.equal(admitSnapshot({...raw,data:[]},query,receipt).reason,"EMPTY_NOT_COVERAGE_PROOF")],
["wrong symbol blocked",()=>assert.equal(admitSnapshot({...raw,symbol:"2330"},query,receipt).reason,"SYMBOL_EXCHANGE_TIMEFRAME_MISMATCH")],
["wrong K period blocked",()=>assert.equal(admitSnapshot({...raw,timeframe:"D"},query,receipt).reason,"SYMBOL_EXCHANGE_TIMEFRAME_MISMATCH")],
["unsupported hourly adjusted blocked",()=>assert.equal(admitSnapshot({...raw,adjusted:true},query,receipt).reason,"INTRADAY_ADJUSTED_SEMANTICS_UNSUPPORTED")],
["no source capture clock blocked",()=>assert.equal(admitSnapshot(raw,query,{...receipt,capturedAt:null}).reason,"CAPTURE_RECEIPT_MISSING")],
["unknown provider response provenance blocked",()=>assert.equal(admitSnapshot(raw,query,{...receipt,sourceKind:"CONNECTOR_CONTENT_ID"}).reason,"NOT_A_PHYSICAL_PROVIDER_RESPONSE")],
["bare timezone-free timestamp blocked",()=>assert.equal(admitSnapshot({...raw,data:[row("2026-10-08T09:00:00")]},query,receipt).reason,"TIMESTAMP_MISSING_OR_UNSORTED")],
["raw invalid high-low blocked",()=>assert.equal(admitSnapshot({...raw,data:[{...row(),high:99}]},query,receipt).reason,"INVALID_OHLC")],
["minute stock volume unit not daily shares",()=>assert.equal(admitted().volumeUnit,"LOTS")],
["no sidecar means no replay",()=>assert.equal(attachBucketAndVintage(admitted(),raw,null,"2026-10-08T18:00:00+08:00").reason,"SIDECAR_HASH_MISMATCH")],
["wrong sidecar raw hash blocked",()=>assert.equal(attachBucketAndVintage(admitted(),raw,{...cert,sourceSha256:"OTHER"},"2026-10-08T18:00:00+08:00").reason,"SIDECAR_HASH_MISMATCH")],
["unknown start/end bucket meaning blocked",()=>assert.equal(attachBucketAndVintage(admitted(),raw,{...cert,bucketTimestampMeaning:"UNKNOWN"},"2026-10-08T18:00:00+08:00").reason,"BUCKET_TIMESTAMP_MEANING_UNKNOWN")],
["unknown calendar blocked",()=>assert.equal(attachBucketAndVintage(admitted(),raw,{...cert,sessionBucketCalendarCertified:false},"2026-10-08T18:00:00+08:00").reason,"SESSION_OR_PRICE_CONTINUITY_NOT_CERTIFIED")],
["missing row vintage blocked",()=>assert.equal(attachBucketAndVintage(admitted(),raw,{...cert,rowReceipts:[]},"2026-10-08T18:00:00+08:00").reason,"PER_BAR_VINTAGE_RECEIPT_MISSING")],
["no fake as-of 13:00 replay after 17:00 capture",()=>assert.equal(attachBucketAndVintage(admitted(),raw,cert,"2026-10-08T13:00:00+08:00").reason,"RETROSPECTIVE_BAR_NOT_AVAILABLE_AT_CUTOFF")],
["as-of after capture can use one but not MA240",()=>{let x=attachBucketAndVintage(admitted(),raw,cert,"2026-10-08T18:00:00+08:00");assert.equal(x.state,"PIT_PREFIX_CERTIFIED");assert.equal(x.verifiedBarCount,1);assert.equal(x.warmupReady,false)}],
["fake observed time predating capture blocked",()=>assert.equal(attachBucketAndVintage(admitted(),raw,{...cert,rowReceipts:[{...proof(),observedAt:"2026-10-08T10:00:00+08:00"}]},"2026-10-08T18:00:00+08:00").reason,"EARLIER_OBSERVATION_UNPROVEN")],
["same-row-count modified OHLC also requires new capture",()=>{let changed={...raw,data:[{...row(),close:100.8}]};let result=attachBucketAndVintage(admitted(),changed,cert,"2026-10-08T18:00:00+08:00");assert.equal(result.reason,"RAW_PAYLOAD_CHANGED_RECAPTURE_REQUIRED")}],
["future append not backfill earlier cutoff",()=>{let x=attachBucketAndVintage(admitted(),raw,cert,"2026-10-08T18:00:00+08:00");let raw2={...raw,data:[...raw.data,row("2026-10-09T09:00:00+08:00")]};let cert2={...cert,rowReceipts:[proof(),{date:"2026-10-09T09:00:00+08:00",completedAt:"2026-10-09T10:00:00+08:00",observedAt:"2026-10-09T17:00:00+08:00",revisionId:"SYNTH_REV2",sessionBucketReceiptId:"SYNTH_BUCKET2"}]};let y=attachBucketAndVintage(admitted(),raw2,cert2,"2026-10-08T18:00:00+08:00");assert.equal(y.reason,"RAW_PAYLOAD_CHANGED_RECAPTURE_REQUIRED")}],
];
let n=0;for(const [name,fn] of t)n+=check(name,fn)?1:0;
console.log(JSON.stringify({suite:"SARA_PHYSICAL_SIDECAR_NO_OUTCOMES",pass:n,total:t.length,failed:t.length-n}));
if(n<t.length)process.exitCode=1;
