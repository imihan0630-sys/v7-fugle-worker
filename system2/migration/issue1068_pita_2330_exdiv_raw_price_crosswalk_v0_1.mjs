// DATA_LANE #1068. Pure source-native reconciliation of the true 2330
// 2026-09-16 ex-dividend discontinuity: 9/15 & 9/16 raw bars plus
// TWSE original official ex-dividend row. Not a new factor or live adjustment.
// Historical vintage and negative NO_EVENT are still UNKNOWN.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {parseOfficialHistoricalA1PayloadV0_1,buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';

const sha=b=>createHash('sha256').update(b).digest('hex');
const pin=Object.freeze({
  market:'TWSE',symbol:'2330',exDate:'2026-09-16',preDate:'2026-09-15',
  targetCut:'2026-10-16T15:45:00.000Z',
  a1Receipt:'ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9',
  sourcePreSha:'6741abcbc098c17b8f8ea17c27f0a83848e3a3dcfc1880151b0f5a2909d0da4e',
  sourceExSha:'a3d20d9ab2ca7980cf4f03946cd218974cee16d1456589f12f74c89e8864776f',
  preRowHash:'0a8e2eaa4b9061d7e7a81eb0702dfbdd38d92287c9f4fa50daec01dec9682165',
  exRowHash:'2bc5f1db3c369f4b41d76b7ee545adb578b8ba07ffdea126d81cfcb0fe81dd43',
  caReceipt:'24a3b535b213034f38ca2ab265ce74b61e685359699646d96c2206714bce4b80',
  caSourceOnlyReceipt:'19d3d5f7499028da862016e46887355a1d054a3641fd2a836ad455cab31a647d',
  caBodySha:'1d8c673fef438beac4cf827388ba76d2febc1c18acfe0b00219a88b2173b7e3e',
  caObservedUtc:'2026-10-16T13:48:50.420Z',
  caFamily:'TWSE_EX_RIGHT_DIVIDEND_ACTUAL',
  oldArtifactId:12002806667,caArtifactId:12050321595
});
const deny=x=>{throw Error('S2_PITA_2330_EXDIV_'+x)};
const H=/^[0-9a-f]{64}$/;
const iso=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
 new Date(Date.parse(x)).toISOString()===x;
const n=x=>typeof x==='number'?x:Number(String(x).replaceAll(',','').trim());
const round6=x=>Math.round(x*1e6)/1e6;

export async function reconcileExdiv2330InputsV0_1({pre,ex,ca,provenance}={}){
 const p=provenance||{};
 if(pre?.symbol!=='2330'||ex?.symbol!=='2330'||
    pre.market!=='TWSE'||ex.market!=='TWSE'||
    pre.date!==pin.preDate||ex.date!==pin.exDate||
    pre.priceSpace!=='RAW'||ex.priceSpace!=='RAW'||
    pre.close!==2385||ex.close!==2380||
    pre.sourceRowHash!==pin.preRowHash||ex.sourceRowHash!==pin.exRowHash)
  deny('ORIGINAL_A1_INSTRUMENT_DATE_OR_BAR_MISMATCH');
 if(ca?.sourceId!==pin.caFamily||ca.eventDateNative!=='115年09月16日'||
    ca.stockCode!=='2330'||ca.name!=='台積電'||ca.type!=='息'||
    n(ca.prevClose)!==pre.close||n(ca.reference)!==2377.99||
    n(ca.dividend)!==7.000001||
    !H.test(ca.originalRowSha256||''))
  deny('OFFICIAL_DIVIDEND_EVENT_OR_REFERENCE_INVALID');
 if(p.sourcePreSha!==pin.sourcePreSha||p.sourceExSha!==pin.sourceExSha||
    p.caBodySha!==pin.caBodySha||p.originalA1ReceiptSha!==pin.a1Receipt||
    p.originalSixCAReceiptSha!==pin.caReceipt||
    p.currentCaSourceOnlyReceiptSha!==pin.caSourceOnlyReceipt||
    !iso(p.preOriginalCapturedAtUtc)||!iso(p.exOriginalCapturedAtUtc)||
    !iso(p.caOriginalCapturedAtUtc)||
    p.caOriginalCapturedAtUtc!==pin.caObservedUtc||
    [p.preOriginalCapturedAtUtc,p.exOriginalCapturedAtUtc,p.caOriginalCapturedAtUtc].some(
      x=>Date.parse(x)>=Date.parse(pin.targetCut)))
  deny('SOURCE_ORIGINAL_HASH_OR_PROSPECTIVE_CLOCK_INVALID');
 const rawChangePercent=(ex.close/pre.close-1)*100;
 const officialReferenceChangePercent=(ex.close/n(ca.reference)-1)*100;
 if(!Number.isFinite(rawChangePercent)||!Number.isFinite(officialReferenceChangePercent)||
    !(rawChangePercent<0&&officialReferenceChangePercent>0))
  deny('PRICE_SPACE_MISCLASSIFIED');
 const base={
  schemaVersion:'S2_DATA_PITA_2330_EXDIV_NATIVE_PRICE_REFERENCE_V0_1',
  status:'ACTUAL_OFFICIAL_EXDIV_REFERENCE_RECONCILED_SOURCE_ONLY',
  market:'TWSE',symbol:'2330',marketDate:'2026-10-16',
  exDividendDate:'2026-09-16',previousTradingDate:'2026-09-15',
  previousCloseRaw:pre.close,exDateCloseRaw:ex.close,
  officialExDividendReference:n(ca.reference),
  nativeDividendField:n(ca.dividend),
  nativeDividendFieldDiffersFromReferenceGap:
   Math.abs((pre.close-n(ca.reference))-n(ca.dividend))>0.001,
  officialReferenceGap:round6(pre.close-n(ca.reference)),
  rawTwoDayChangePercent:round6(rawChangePercent),
  exDividendReferenceChangePercent:round6(officialReferenceChangePercent),
  sourceA1PreviousBodySha256:pin.sourcePreSha,
  sourceA1ExDateBodySha256:pin.sourceExSha,
  sourceA1PreviousRowSha256:pin.preRowHash,
  sourceA1ExDateRowSha256:pin.exRowHash,
  sourceNativeEventBodySha256:pin.caBodySha,
  sourceNativeEventRowSha256:ca.originalRowSha256,
  officialA1ProducerArtifactId:pin.oldArtifactId,
  officialCAProducerArtifactId:pin.caArtifactId,
  caNativeOriginalFirstObservedAtUtc:pin.caObservedUtc,
  existingDecisionCutUtc:pin.targetCut,
  actualOriginalObservedBeforeCut:true,
  originalIssuerPublicationOnExDateProven:false,
  pricingReferenceOnlyNotA61DayAdjustment:true,
  '61DayAdjustedFeatureContinuityAudited':false,
  authoritativeNegativeNoEventProven:false,
  currentAsOfTradeabilityAudited:false,
  independentAuditLaneFullPITAccepted:false,
  correctedStage1MomentumComputed:false,
  currentSymbolPitEligible:false,
  selectedCount:null,zeroPickDay:null,shadowAuthorized:false,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreModified:false,
 };
 return {...base,receiptHash:await sha256Hex(base)};
}

export async function verifyExdiv2330OriginalsV0_1({
 oldSourceDir,caSourceDir,readRaw=readFile
}={}){
 if(!oldSourceDir||!caSourceDir||typeof readRaw!=='function')
  deny('ORIGINAL_INPUT_PATHS_REQUIRED');
 const [oldBytes,caBytes,outerBytes]=await Promise.all([
  readRaw(resolve(oldSourceDir,'official-61-2026-10-15.json')),
  readRaw(resolve(caSourceDir,'source-original-six-ca.json')),
  readRaw(resolve(caSourceDir,'pita-ca-sourceonly-receipt.json')),
 ]);
 let old,caRec,outer;
 try{old=JSON.parse(oldBytes);caRec=JSON.parse(caBytes);outer=JSON.parse(outerBytes)}
 catch{deny('SIGNED_ORIGINAL_RECEIPT_JSON_INVALID')}
 if(old?.receiptHash!==pin.a1Receipt||
    old.marketDate!=='2026-10-15'||
    old.receivedMarketDateCount!==122||
    caRec?.receiptHash!==pin.caReceipt||
    caRec.sourcesRetainedOriginalBytes!==6||
    outer?.receiptHash!==pin.caSourceOnlyReceipt||
    outer.exactSignedSixCAReceiptHash!==caRec.receiptHash)
  deny('PINNED_ORIGINAL_SOURCE_RECEIPT_INVALID');
 const r=caRec.sourceReceipts?.find(x=>x.sourceId===pin.caFamily);
 if(!r||r.originalSha256!==pin.caBodySha||
    r.capturedAtUtc!==pin.caObservedUtc||r.originalBytesReadBackLocally!==true)
  deny('OFFICIAL_CA_EVENT_NATIVE_RECEIPT_INVALID');
 const barPrev=old.bySymbol?.['TWSE|2330']?.bars?.find(x=>x.date===pin.preDate);
 const barEx=old.bySymbol?.['TWSE|2330']?.bars?.find(x=>x.date===pin.exDate);
 if(!barPrev||!barEx)deny('SIGNED_SOURCE_2330_BARS_MISSING');
 const buffers={};
 for(const [label,date,expected] of [
  ['pre',pin.preDate,pin.sourcePreSha],['ex',pin.exDate,pin.sourceExSha]
 ]){
   let raw;
   try{raw=gunzipSync(await readRaw(resolve(oldSourceDir,
      'original-json/TWSE-'+date+'.json.gz')),{maxOutputLength:25_000_000})}
   catch{deny('RAW_A1_BODY_UNREADABLE')}
   if(sha(raw)!==expected)deny('RAW_A1_BODY_SHA_MISMATCH');
   let body,parsed;
   try{
     body=JSON.parse(raw);
     parsed=parseOfficialHistoricalA1PayloadV0_1({
      market:'TWSE',marketDate:date,
      observedAt:label==='pre'?barPrev.firstKnownAt:barEx.firstKnownAt,
      sourceUrl:buildOfficialHistoricalA1UrlV0_1('TWSE',date),
      payload:body
     });
   }catch{deny('NATIVE_A1_PARSER_OR_DATE_INVALID')}
   const matching=parsed.rows.filter(x=>x.symbol==='2330');
   const bar=label==='pre'?barPrev:barEx;
   if(parsed.state!=='READY'||matching.length!==1||
      matching[0].close!==bar.close||
      await sha256Hex(matching[0].sourceFields)!==bar.sourceRowHash||
      bar.sourceOriginalResponseSha256!==expected||
      !iso(bar.firstKnownAt)||Date.parse(bar.firstKnownAt)>=Date.parse(pin.targetCut))
     deny('RAW_A1_BAR_OR_SNAPSHOT_NOT_BOUND');
   buffers[label]=bar;
 }
 let rawEvent,parsedCa;
 try{
  rawEvent=gunzipSync(await readRaw(resolve(caSourceDir,
   pin.caFamily+'-2026-10-16.json.gz')),{maxOutputLength:8_000_000});
  parsedCa=JSON.parse(rawEvent)
 }catch{deny('NATIVE_CA_BODY_UNREADABLE')}
 if(sha(rawEvent)!==pin.caBodySha||
    !Array.isArray(parsedCa.fields)||!Array.isArray(parsedCa.data))
  deny('RAW_CA_BODY_SHA_OR_SCHEMA_MISMATCH');
 const idxs=['資料日期','股票代號','股票名稱','除權息前收盤價','除權息參考價','權值+息值','權/息']
  .map(name=>parsedCa.fields.indexOf(name));
 if(idxs.some(i=>i<0))deny('OFFICIAL_CA_NATIVE_COLUMN_MISSING');
 const originals=parsedCa.data.filter(row=>String(row[idxs[1]]).trim()==='2330'&&
   String(row[idxs[0]]).trim()==='115年09月16日');
 if(originals.length!==1)deny('OFFICIAL_EVENT_MISSING_OR_DUPLICATE');
 const row=originals[0];
 const event={
  sourceId:pin.caFamily,eventDateNative:row[idxs[0]],
  stockCode:row[idxs[1]],name:row[idxs[2]],
  prevClose:row[idxs[3]],reference:row[idxs[4]],
  dividend:row[idxs[5]],type:row[idxs[6]],
  originalRowSha256:await sha256Hex({fields:parsedCa.fields,row})
 };
 return reconcileExdiv2330InputsV0_1({
  pre:buffers.pre,ex:buffers.ex,ca:event,provenance:{
   sourcePreSha:pin.sourcePreSha,sourceExSha:pin.sourceExSha,
   caBodySha:pin.caBodySha,originalA1ReceiptSha:pin.a1Receipt,
   originalSixCAReceiptSha:pin.caReceipt,
   currentCaSourceOnlyReceiptSha:pin.caSourceOnlyReceipt,
   preOriginalCapturedAtUtc:buffers.pre.firstKnownAt,
   exOriginalCapturedAtUtc:buffers.ex.firstKnownAt,
   caOriginalCapturedAtUtc:r.capturedAtUtc,
  }
 });
}
if(process.argv[1]?.endsWith('/issue1068_pita_2330_exdiv_raw_price_crosswalk_v0_1.mjs')){
 const result=await verifyExdiv2330OriginalsV0_1({
  oldSourceDir:'/tmp/s2-pita-exdiv-a1-original',
  caSourceDir:'/tmp/s2-pita-exdiv-ca-original'
 });
 const out='/tmp/s2-pita-2330-exdiv-native-readback';
 await mkdir(out,{recursive:true,mode:0o700});
 await writeFile(resolve(out,'original-2330-exdiv-price-reference.json'),
  JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  status:result.status,rawReturnPercent:result.rawTwoDayChangePercent,
  nativeExReferenceReturnPercent:result.exDividendReferenceChangePercent,
  sourceOnly:true,correctedStrategyFeature:false,PIT:false,Frozen:false,
  receiptHash:result.receiptHash}));
}
