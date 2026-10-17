// DATA_LANE #1068. Independent *source-only* native HTML original bytes
// reread of the real 2026-10-16 17:04 Taipei 4-control ISIN/CFI artifact.
// No new provider GET. Physical as-of source observations != an issuer
// guarantee that security class remained unchanged through 23:45,
// historical CFI version, all-market eligibility, AUDIT_LANE full PIT, Frozen.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const SHA=/^[a-f0-9]{64}$/;
const CUT='2026-10-16T15:45:00.000Z';
const HASH=x=>createHash('sha256').update(x).digest('hex');
const PIN=Object.freeze({
  receiptHash:'dc9b449aade5a9781369b8e4dc66a13930dd2c12b22f64df21ffda14191b2477',
  run:38877910182,artifactId:12036321387,
  zipHash:'61236b61389de43fe027c43bff670882557f654726dd6c8b397c1481c32655fa'
});
const CONTROL=Object.freeze({
  '2330':{market:'TWSE LISTED',nativeType:'Stocks',cfi:'ESVUFR',
    isin:'TW0002330008',currentStockSource:true},
  '3287':{market:'TPEx LISTED',nativeType:'Stocks',cfi:'ESVUFR',
    isin:'TW0003287009',currentStockSource:true},
  '9103':{market:'TWSE LISTED',nativeType:'TDR',cfi:'EDSDDR',
    isin:'TW0009103002',currentStockSource:false},
  '0050':{market:'TWSE LISTED',nativeType:'ETF',cfi:'CEOGEU',
    isin:'TW0000050004',currentStockSource:false}
});
const deny=k=>{throw Error('S2_DATA_PITA_2330_PRECUT_CFI_'+k)};
const utc=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
  new Date(Date.parse(x)).toISOString()===x;
const htmlPlain=x=>String(x).replace(/<[^>]*>/g,' ')
  .replace(/&nbsp;|&#160;/ig,' ').replace(/&amp;/ig,'&')
  .replace(/&#(\d+);/g,(_,num)=>String.fromCodePoint(Number(num)))
  .replace(/[\s\u00a0\u3000]+/g,' ').trim();
export function independentlyReadSingleNativeClassV0_1({html,code}={}){
 if(typeof html!=='string'||!/^[0-9]{4}$/.test(code||''))
  deny('NATIVE_HTML_INPUT_INVALID');
 const matches=[];
 for(const tr of html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)||[]){
   const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)]
      .map(x=>htmlPlain(x[1]));
   if(cells.length<9||cells[2]!==code)continue;
   const candidate={isin:cells[1],code:cells[2],name:cells[3],
     market:cells[4],type:cells[5],listedAt:cells[7],cfi:cells[8]};
   if(!/^TW[0-9A-Z]{10}$/.test(candidate.isin)||
      !/^[A-Z]{6}$/.test(candidate.cfi)||!candidate.market||!candidate.type)
     deny('NATIVE_FIELDS_OR_CFI_INVALID');
   matches.push(candidate);
 }
 if(matches.length!==1)deny('NATIVE_SYMBOL_NOT_EXACTLY_ONCE');
 return matches[0];
}
export async function verifyPita2330PrecutFourNativeCfiV0_1({
 originalDir,readRaw=readFile
}={}){
 if(typeof originalDir!=='string'||!originalDir||typeof readRaw!=='function')
  deny('IMMUTABLE_ORIGINAL_DIR_REQUIRED');
 const obj=JSON.parse((await readRaw(resolve(originalDir,'receipt.json'))).toString('utf8'));
 const {receiptHash,...base}=obj;
 if(obj?.schemaVersion!=='S2_M09_NATIVE_SINGLE_ISIN_CFI_TRANSPORT_V0_1'||
    obj.source!=='OFFICIAL_TWSE_NATIVE_INDIVIDUAL_ISIN_CFI'||
    obj.controlsChecked!==4||obj.nativeCfiRowsObserved!==4||
    obj.currentNativeStockCfiObserved!==2||
    obj.currentNativeEvidenceScope!=='AS_OBSERVED_NOW_NOT_HISTORICAL_EFFECTIVE_VINTAGE'||
    obj.historicalSecurityClassPitCertified!==false||
    obj.ordinaryCommonSharePITCertified!==false||
    obj.formalStage1SelectionAuthorized!==false||
    obj.selectedCount!==null||obj.zeroPickDay!==null||
    obj.frozenD1Written!==false||obj.cloudflareD1Writes!==0||
    receiptHash!==PIN.receiptHash||await sha256Hex(base)!==receiptHash||
    !Array.isArray(obj.sourceReceipts)||obj.sourceReceipts.length!==4||
    !utc(obj.actualObservationStartUtc)||!utc(obj.finishedAtUtc)||
    Date.parse(obj.finishedAtUtc)>=Date.parse(CUT))
  deny('ORIGINAL_RECEIPT_SHA_SCOPE_OR_DATE_INVALID');
 const originals=[];const seen=new Set();
 for(const r of obj.sourceReceipts){
   const p=CONTROL[r.code];
   if(!p||seen.has(r.code)||r.state!=='NATIVE_SINGLE_CFI_ROW_OBSERVED'||
      !SHA.test(r.originalSha256||'')||r.originalBytes<150||
      r.rawByteReadback!==true||
      !utc(r.observedAtUtc)||
      Date.parse(r.observedAtUtc)<Date.parse(obj.actualObservationStartUtc)||
      Date.parse(r.observedAtUtc)>Date.parse(obj.finishedAtUtc)||
      Date.parse(r.observedAtUtc)>=Date.parse(CUT)||
      r.cfi!==p.cfi||r.isin!==p.isin||
      r.nativeMarketLabel!==p.market||r.nativeTypeLabel!==p.nativeType||
      r.currentObservedStockCfi!==p.currentStockSource||
      r.historicalEffectiveFromDate!==null||
      r.originalPublicationAtUtc!==null||
      r.nativeTypeHistoricallyPITCertified!==false)
    deny('CONTROL_ORIGINAL_ROW_CLOCK_OR_IDENTITY_INVALID');
   seen.add(r.code);
   let native;
   try{
     native=gunzipSync(await readRaw(resolve(originalDir,'native-'+r.code+'.html.gz')),
       {maxOutputLength:1_500_000});
   }catch{deny('ORIGINAL_NATIVE_GZIP_UNREADABLE')}
   if(native.length!==r.originalBytes||HASH(native)!==r.originalSha256)
     deny('NATIVE_HTML_ORIGINAL_BYTE_SHA_INVALID');
   const independentlyParsed=independentlyReadSingleNativeClassV0_1({
    html:native.toString('utf8'),code:r.code});
   if(independentlyParsed.isin!==p.isin||
      independentlyParsed.cfi!==p.cfi||
      independentlyParsed.market!==p.market||
      independentlyParsed.type!==p.nativeType)
    deny('INDEPENDENT_HTML_CLASS_REPRODUCTION_MISMATCH');
   originals.push({code:r.code,market:p.market,originalNativeSha256:r.originalSha256,
     originalNativeBytes:r.originalBytes,
     firstPhysicalObservedAtUtc:r.observedAtUtc,
     nativeCfi:p.cfi,nativeType:p.nativeType,
     originalCurrentStockPositive:p.currentStockSource,
     timeTrueSourceBeforeCut:true,issuerInitialPublicationHistoricallyKnown:false});
 }
 if(seen.size!==4||!seen.has('2330')||
    originals.filter(x=>x.originalCurrentStockPositive).length!==2)
  deny('FOUR_ORIGINAL_POSITIVE_NEGATIVE_CONTROL_INCOMPLETE');
 const source2330=originals.find(x=>x.code==='2330');
 const result={
   schemaVersion:'S2_DATA_PITA_2330_PRECUT_NATIVE_CLASS_SOURCE_READBACK_V0_1',
   sourceMarketDate:'2026-10-16',decisionCutAtUtc:CUT,
   originalRunId:PIN.run,originalArtifactId:PIN.artifactId,
   originalArtifactZipSha256:PIN.zipHash,
   originalSignedReceiptHash:receiptHash,
   realNativeOriginalBodiesIndependentlyRehashed:4,
   currentSourceStockPositives:2,currentSourceNonShareControls:2,
   original2330CurrentOrdinaryStockSourcePositive:true,
   original2330PrecutNativeCFI:'ESVUFR',
   original2330PrecutNativeMarket:'TWSE LISTED',
   original2330CapturedAtUtc:source2330.firstPhysicalObservedAtUtc,
   originalFourControls:originals,
   sourceAvailabilityBeforeCutVerified:true,
   currentNativeStockClassValidAtFinalCutIndependentlyCertified:false,
   historical61IssuerEffectiveVersionCFICertified:false,
   independentAuditLaneFullPitAccepted:false,
   thisDoesNotPromoteSelection:true,pitEligible:false,
   selectedCount:null,zeroPickDay:null,frozenD1Written:false,
   shadowAuthorized:false,cloudflareD1Reads:0,cloudflareD1Writes:0,
   cloudflareR2Writes:0,system1FormalCoreChanged:false
 };
 return Object.freeze({...result,receiptHash:await sha256Hex(result)});
}
if(process.argv[1]?.endsWith('/issue1068_pita_2330_precut_cfi_four_original_source_readback_v0_1.mjs')){
 const r=await verifyPita2330PrecutFourNativeCfiV0_1({
   originalDir:'/tmp/s2-pita-2330-cfi-precursor-4-originals'});
 const out='/tmp/s2-data-2330-precut-cfi4-sourceonly';
 await mkdir(out,{recursive:true,mode:0o700});
 await writeFile(resolve(out,'2330-precut-cfi4-independent-native-source-only.json'),
   JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
   originalBodies:r.realNativeOriginalBodiesIndependentlyRehashed,
   currentStockControls:r.currentSourceStockPositives,
   nonShareControls:r.currentSourceNonShareControls,
   symbol:'2330',originallyAvailableBeforeCut:r.sourceAvailabilityBeforeCutVerified,
   original2330SourceClass:r.original2330PrecutNativeCFI,
   fullCutClassIndependentAudit:false,
   PIT:false,Frozen:false,selectedCount:null,zeroPickDay:null,
   receiptHash:r.receiptHash
 }));
}
