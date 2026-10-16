// DATA_LANE #1068: scoped ORIGINAL native CA byte readback for one symbol.
// Positive event rows have native raw source SHA, observedAt and exact
// source-row hash. Zero rows is NOT authoritative NO_EVENT nor historical PIT.
// Existing original GitHub artifact only; no official GET/D1/Frozen/strategy.
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const names=[
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL',
 'TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE',
 'TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE',
 'TPEX_PAR_VALUE_CHANGE_REFERENCE'
];
const SHA=/^[a-f0-9]{64}$/;
const observedCut='2026-10-16T15:45:00.000Z';
const err=x=>{throw Error('S2_PITA_2330_CA_NATIVE_'+x)};
const sh=b=>createHash('sha256').update(b).digest('hex');
const byCut=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
 Date.parse(x)<Date.parse(observedCut);
export function sourceNativeRowsForSymbolV0_1({
 sourceId,payload,symbol='2330'
}={}){
 if(!names.includes(sourceId)||symbol!=='2330'||!payload||
    typeof payload!=='object'||Array.isArray(payload))err('SOURCE_ID_OR_NATIVE_PAYLOAD_INVALID');
 let fields,rows;
 if(sourceId.startsWith('TWSE_')){
   fields=payload.fields;rows=payload.data;
 }else{
   const tables=payload.tables;
   if(!Array.isArray(tables)||tables.length!==1)
     err('TPEX_ORIGINAL_TABLE_AMBIGUOUS');
   fields=tables[0]?.fields;rows=tables[0]?.data;
 }
 if(!Array.isArray(fields)||!Array.isArray(rows)||
    fields.length<4||!rows.every(r=>Array.isArray(r)&&r.length===fields.length))
  err('NATIVE_FIELDS_OR_ROWS_INVALID');
 const idx=fields.findIndex(x=>['股票代號','證券代號','代號'].includes(String(x).trim()));
 if(idx<0)err('NATIVE_INSTRUMENT_CODE_IDENTITY_MISSING');
 return {totalNativeRows:rows.length,fields,
   matchingRows:rows.filter(r=>String(r[idx]).trim()===symbol)};
}
export async function inspectPita2330CARawV0_1({
 originalDir,readRaw=readFile
}={}){
 if(typeof originalDir!=='string'||!originalDir||typeof readRaw!=='function')
   err('INPUT_PATH_OR_READ_REQUIRED');
 const [native,outer]=await Promise.all([
  readRaw(resolve(originalDir,'source-original-six-ca.json')),
  readRaw(resolve(originalDir,'pita-ca-sourceonly-receipt.json'))
 ]).then(a=>a.map(b=>JSON.parse(b.toString('utf8'))));
 if(native.schemaVersion!=='S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1'||
    native.sourceFamilyDenominator!==6||
    native.sourcesRetainedOriginalBytes!==6||
    native.nativeRangeSchemaCandidates!==6||
    native.requestedStartDate!=='2026-07-21'||
    native.requestedEndDate!=='2026-10-16'||
    native.noEventMayBeClaimed!==false||
    native.historicalFirstKnownAtCertified!==false||
    native.entireRangeCorrectionAndCancellationCoverageCertified!==false||
    native.sourceContractCoverageComplete!==false||
    !SHA.test(native.receiptHash||'')||
    await sha256Hex(Object.fromEntries(Object.entries(native).filter(([k])=>k!=='receiptHash')))!==native.receiptHash||
    !Array.isArray(native.sourceReceipts)||native.sourceReceipts.length!==6)
   err('SIGNED_NATIVE_SIX_SOURCE_RECEIPT_INVALID');
 if(outer.schemaVersion!=='S2_DATA_PITA_2330_CURRENT_CA_ORIGINAL_RANGE_V0_1'||
    outer.observedSourceFamilies!==6||
    outer.sourceSchemaRangeCandidates!==6||
    outer.exactSignedSixCAReceiptHash!==native.receiptHash||
    outer.status!=='SIX_OFFICIAL_CA_ORIGINALS_CAPTURED_AS_OBSERVED_NOW_ONLY'||
    outer.marketDate!=='2026-10-16'||
    outer.authoritativeNegativeNoEventScopeCertified!==false||
    outer.directIssuerVersionAndAmendmentCompletenessCertified!==false||
    outer.pitEligible!==false||outer.frozenD1Written!==false||
    !SHA.test(outer.receiptHash||'')||
    await sha256Hex(Object.fromEntries(Object.entries(outer).filter(([k])=>k!=='receiptHash')))!==outer.receiptHash)
   err('OUTER_SOURCE_ONLY_RECEIPT_INVALID');
 const foundIds=new Set(),families=[];let totalPositive=0;
 for(const row of native.sourceReceipts){
   const id=row?.sourceId;
   if(!names.includes(id)||foundIds.has(id)||!row.originalBytesReadBackLocally||
      row.state!=='RANGE_SCHEMA_CANDIDATE_NOT_VINTAGE_CERTIFIED'||
      row.nativeSchema?.responseRangeVerified!==true||
      !byCut(row.capturedAtUtc)||!SHA.test(row.originalSha256||'')||
      row.effectiveVintageRevisionRetractionCoverageVerified!==false)
    err('CA_FAMILY_PROVENANCE_OR_DATE_INVALID');
   foundIds.add(id);
   let body;
   try{body=gunzipSync(await readRaw(resolve(originalDir,id+'-2026-10-16.json.gz')),{maxOutputLength:8_000_000})}
   catch{err('OFFICIAL_CA_NATIVE_GZIP_UNREADABLE')}
   if(body.length!==row.originalBytes||sh(body)!==row.originalSha256)
     err('ORIGINAL_CA_BODY_SHA_OR_BYTE_MISMATCH');
   let source;
   try{source=JSON.parse(body.toString('utf8'))}catch{err('ORIGINAL_NATIVE_JSON_INVALID')}
   const parsed=sourceNativeRowsForSymbolV0_1({sourceId:id,payload:source});
   if(parsed.totalNativeRows!==row.nativeSchema?.rowCount)
     err('OFFICIAL_CA_NATIVE_ROW_COUNT_MISMATCH');
   const positiveRows=[];
   for(const nativeRow of parsed.matchingRows){
     positiveRows.push({
       eventDateNative:String(nativeRow[0]).trim(),
       sourceFieldsRowSha256:await sha256Hex({fields:parsed.fields,row:nativeRow}),
       // Native event description is data, not an audited first publication.
       sourceNativeValues:nativeRow
     });
   }
   totalPositive+=positiveRows.length;
   families.push({sourceId:id,sourceNativeBodySha256:row.originalSha256,
     sourceNativeRows:parsed.totalNativeRows,
     originalPhysicallyObservedAtUtc:row.capturedAtUtc,
     observedPositive2330Rows:positiveRows.length,
     positiveRows,
     ifZeroRows:'NO_2330_ROW_OBSERVED_IN_THIS_RAW_VERSION__NO_EVENT_NOT_CERTIFIED'
   });
 }
 if(foundIds.size!==6)err('SIX_SOURCE_FAMILIES_NOT_EXHAUSTIVE');
 const base={
  schemaVersion:'S2_DATA_PITA_2330_NATIVE_CA_PER_SYMBOL_SOURCE_ONLY_V0_1',
  asOfMarketDate:'2026-10-16',
  originalEventRangeStartDate:'2026-07-21',originalEventRangeEndDate:'2026-10-16',
  symbol:'2330',market:'TWSE',
  sourceRunId:38910741802,originalSourceArtifactId:12050321595,
  sourceOriginalArtifactZipSha256:'7aa9216a5a28dbcbd22fc9041753325d5413e5286aaeae75016fee745c125ebc',
  sourceSixCAOriginalReceiptHash:native.receiptHash,
  producerSourceOnlyReceiptHash:outer.receiptHash,
  sourceFamilyCount:6,allNativeOriginalFamilyBodyHashesVerified:true,
  observed2330PositiveEventRows:totalPositive,
  nativeSourceFamilies:families,
  issuerPublicationFirstKnownAtHistoricallyCertified:false,
  historicalRevisionCancellationAndSuspensionCoverageCertified:false,
  authoritativeNoEventNegativeScopeCertified:false,
  futureDecisionCutCompletePITCertified:false,
  auditLaneIndependentFullPITAccepted:false,
  pitEligible:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return {...base,receiptHash:await sha256Hex(base)};
}
if(process.argv[1]?.endsWith('/issue1068_pita_2330_ca_symbol_native_readback_v0_1.mjs')){
 const r=await inspectPita2330CARawV0_1({
   originalDir:'/tmp/s2-pita-2330-original-six-ca'});
 const dir='/tmp/s2-pita-2330-ca-symbol-readback';
 await mkdir(dir,{recursive:true,mode:0o700});
 await writeFile(resolve(dir,'native-2330-ca-sourceonly-receipt.json'),
   JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({market:r.asOfMarketDate,symbol:r.symbol,
   sixBodiesRehashed:r.sourceFamilyCount,
   observedPositive2330EventRows:r.observed2330PositiveEventRows,
   positiveSourceFamilyIds:r.nativeSourceFamilies.filter(x=>x.observedPositive2330Rows>0).map(x=>x.sourceId),
   sourceOnlyReceiptHash:r.receiptHash,
   historicalRevisionsAndNoEventCertified:false,pitEligible:false,
   selectedCount:null,zeroPickDay:null,frozen:false,cloudflareD1Writes:0}));
}
