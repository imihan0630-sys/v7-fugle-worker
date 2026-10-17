// System2 BUILD Class A / OFFLINE ONLY: consume exact DATA-lane native
// profile normalization and a complete four-digit A1 symbol receipt.
// NO network/DB/strategy/Shadow/Frozen; independently audited coverage requires
// a separate AUDIT original readback and is therefore always null here.
import {sha256Hex} from './decision_archive.mjs';
import {parseIndustryProfiles} from './b2_industry_snapshot_observer.mjs';
const DAY=/^\d{4}-\d{2}-\d{2}$/,UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,SHA=/^[a-f0-9]{64}$/i;
const day=x=>typeof x==='string'&&DAY.test(x)&&!Number.isNaN(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const utc=x=>typeof x==='string'&&UTC.test(x)&&!Number.isNaN(Date.parse(x));
const sym=x=>typeof x==='string'&&/^[1-9][0-9]{3}$/.test(x);
const deny=x=>{throw Error('S2_OFFICIAL_B5_COVERAGE_'+x)};
const unsigned=x=>Object.fromEntries(Object.entries(x).filter(([k])=>k!=='receiptHash'));
const signed=async x=>x&&typeof x==='object'&&SHA.test(x.receiptHash||'')&&
 await sha256Hex(unsigned(x))===x.receiptHash;
const validIdentity=x=>x&&sym(x.symbol)&&['TWSE','TPEX'].includes(x.market);
function nativeNormalizedRecord(x){
 return validIdentity(x)&&
 (x.officialIndustryCode===null||typeof x.officialIndustryCode==='string')&&
 (x.officialIndustryLabel===null||typeof x.officialIndustryLabel==='string')&&
 utc(x.firstKnownAtUtc)&&utc(x.availableAtUtc)&&utc(x.observedAtUtc)&&
 (x.effectiveFrom===null||day(x.effectiveFrom))&&
 (x.effectiveTo===null||day(x.effectiveTo))&&
 (x.supersededBy===null||typeof x.supersededBy==='string')&&
 SHA.test(x.sourceRowHash||'');
}
export async function buildSystem2NativeB5CoverageV0_1({
 universeReceipt,profileReceipts=[],generatedAtUtc
}={}){
 if(!utc(generatedAtUtc))deny('EVALUATION_CLOCK_REQUIRED');
 if(!(await signed(universeReceipt))||
  universeReceipt.schemaVersion!=='S2_A1_FOUR_DIGIT_UNIVERSE_HANDOFF_V0_1'||
  !day(universeReceipt.marketDate)||!utc(universeReceipt.observedAtUtc)||
  Date.parse(universeReceipt.observedAtUtc)>Date.parse(generatedAtUtc)||
  !SHA.test(universeReceipt.originalSourceReceiptHash||'')||
  !SHA.test(universeReceipt.independentSourceAuditHash||'')||
  universeReceipt.ordinaryShareClassCertified!==false||
  !Array.isArray(universeReceipt.rows)||universeReceipt.rows.length===0||
  universeReceipt.rows.length!==universeReceipt.fourDigitInstrumentCount)
  deny('SOURCE_UNIVERSE_SIGNED_EXACT_SCOPE_REQUIRED');
 const marketDate=universeReceipt.marketDate, observedCut=marketDate+'T15:45:00Z';
 const issuerIds=new Set(),byMarket={TWSE:[],TPEX:[]};
 for(const row of universeReceipt.rows){
  if(!validIdentity(row)||!SHA.test(row.sourceRowHash||'')||
   issuerIds.has(row.market+'|'+row.symbol))deny('SOURCE_UNIVERSE_IDENTITY_INVALID');
  issuerIds.add(row.market+'|'+row.symbol);byMarket[row.market].push(row);
 }
 if(!Array.isArray(profileReceipts)||profileReceipts.length>2)
   deny('PROFILE_RECEIPTS_INVALID');
 const profileByMarket=new Map();
 for(const receipt of profileReceipts){
  if(!(await signed(receipt))||
    receipt.schemaVersion!=='S2_DATA_NATIVE_B5_PROFILE_SOURCE_HANDOFF_V0_1'||
    !['TWSE','TPEX'].includes(receipt.market)||
    receipt.marketDate!==marketDate||
    !utc(receipt.sourceObservedAtUtc)||
    Date.parse(receipt.sourceObservedAtUtc)>Date.parse(generatedAtUtc)||
    !SHA.test(receipt.originalNativeSourceHash||'')||
    receipt.sourceFamily!=='OFFICIAL_B5_COMPANY_PROFILE'||
    !Array.isArray(receipt.rows)||
    profileByMarket.has(receipt.market))deny('PROFILE_ORIGINAL_RECEIPT_INVALID');
  for(const row of receipt.rows){
   if(!nativeNormalizedRecord(row)||row.market!==receipt.market||
    Date.parse(row.firstKnownAtUtc)>Date.parse(row.observedAtUtc)||
    Date.parse(row.availableAtUtc)>Date.parse(row.observedAtUtc)||
    Date.parse(row.observedAtUtc)>Date.parse(receipt.sourceObservedAtUtc)||
    (row.effectiveFrom&&row.effectiveTo&&row.effectiveFrom>=row.effectiveTo))
    deny('PROFILE_ROW_NATIVE_NORMALIZATION_INVALID');
  }
  profileByMarket.set(receipt.market,receipt);
 }
 const summaries=[],observations=[];
 for(const market of ['TWSE','TPEX']){
  const source=profileByMarket.get(market)??null;
  // Reuse the existing B2 official industry profile parser for a secondary
  // sanity check. It is not a proof of native original or PIT source time.
  const b2=source?parseIndustryProfiles(source.rows.map(x=>({
   公司代號:x.symbol,產業別:x.officialIndustryLabel??''
  })),market):null;
  if(source&&(source.rows.length>0&&b2?.state!=='OBSERVED'&&
    source.rows.some(x=>x.officialIndustryLabel)))deny('B2_PROFILE_PARSER_DISAGREEMENT');
  const groups=new Map();
  for(const x of source?.rows??[]){
   const a=groups.get(x.symbol)??[];a.push(x);groups.set(x.symbol,a);
  }
  const counter={market,sourceFourDigitInstrumentCount:byMarket[market].length,
   officialProfileSourcePresent:Boolean(source),
   provisionalClassifiedCount:0,unknownCount:0,conflictCount:0,
   lateOrClockUnusableCount:0,missingCodeOrLabelCount:0,
   missingProfileCount:0,sourceAfterPreferredTCut:source?
      Date.parse(source.sourceObservedAtUtc)>Date.parse(observedCut):null,
   independentlyCertifiedOrdinaryShareCount:null,
   independentlyCertifiedCurrentB5Count:null,
   independentlyCertifiedB5CoverageRate:null,
   provisionalCoverageRate:null,
   status:source?'PROVISIONAL_NATIVE_RECORDS_NOT_INDEPENDENTLY_AUDITED':'B5_SOURCE_NOT_READY'};
  for(const row of byMarket[market]){
   const xs=groups.get(row.symbol)??[];
   let state='OFFICIAL_INDUSTRY_UNKNOWN',code=null,label=null,firstKnownAt=null;
   if(!source||xs.length===0){state='B5_PROFILE_MISSING';counter.missingProfileCount++;}
   else if(xs.length!==1){state='B5_PROFILE_CONFLICT';counter.conflictCount++;}
   else{
    const x=xs[0];
    const labelB2=b2?.profiles[row.symbol]?.industry??null;
    if(labelB2!==x.officialIndustryLabel)deny('B2_PROFILE_PARSER_MISMATCH');
    if(!x.officialIndustryCode?.trim()||!x.officialIndustryLabel?.trim()){
      state='B5_CODE_OR_LABEL_UNKNOWN';counter.missingCodeOrLabelCount++;
    }else if(Date.parse(source.sourceObservedAtUtc)>Date.parse(observedCut)||
        Date.parse(x.firstKnownAtUtc)>Date.parse(observedCut)||
        Date.parse(x.availableAtUtc)>Date.parse(observedCut)||
        Date.parse(x.observedAtUtc)>Date.parse(observedCut)||
        x.effectiveFrom&&marketDate<x.effectiveFrom||
        x.effectiveTo&&marketDate>=x.effectiveTo||
        x.supersededBy!==null){
      state='B5_LATE_OR_VINTAGE_UNUSABLE';counter.lateOrClockUnusableCount++;
    }else{
      state='B5_NATIVE_PROVISIONAL_CLASSIFIED';
      code=x.officialIndustryCode;label=x.officialIndustryLabel;
      firstKnownAt=x.firstKnownAtUtc;counter.provisionalClassifiedCount++;
    }
   }
   if(state!=='B5_NATIVE_PROVISIONAL_CLASSIFIED')counter.unknownCount++;
   observations.push({
    market,symbol:row.symbol,sourceRowHash:row.sourceRowHash,
    sourceMarketDate:marketDate,state,officialIndustryCode:code,
    officialIndustryLabel:label,sourceFirstKnownAtUtc:firstKnownAt,
    nativeSourceReceiptHash:source?.receiptHash??null,
    officialCurrentB5IndependentAuditCertified:false,
    ordinarySharePITCertified:false,
    historicalClassificationPITCertified:false,
    strategyUseAuthorized:false
   });
  }
  counter.provisionalCoverageRate=counter.sourceFourDigitInstrumentCount?
    counter.provisionalClassifiedCount/counter.sourceFourDigitInstrumentCount:null;
  summaries.push(counter);
 }
 const total=summaries.reduce((a,x)=>a+x.sourceFourDigitInstrumentCount,0);
 if(total!==universeReceipt.fourDigitInstrumentCount||observations.length!==total)
  deny('MARKET_DENOMINATOR_RECONCILIATION_FAILED');
 const base={
  schemaVersion:'S2_OFFICIAL_B5_FULL_SOURCE_COVERAGE_READONLY_V0_1',
  marketDate,generatedAtUtc,preferredCutAtUtc:observedCut,
  originalUniverseReceiptHash:universeReceipt.receiptHash,
  originalSourceReceiptHash:universeReceipt.originalSourceReceiptHash,
  originalIndependentA1AuditHash:universeReceipt.independentSourceAuditHash,
  fourDigitInstrumentCount:total,
  ordinaryShareUniverseDenominator:null,
  profileReceiptsCount:profileReceipts.length,
  marketSummaries:summaries,observations,
  provisionalCurrentB5MappedCount:summaries.reduce((a,x)=>a+x.provisionalClassifiedCount,0),
  fullMarketIndependentlyCertifiedB5Coverage:null,
  sourceJoinState:profileReceipts.length===2?
   'BOTH_MARKETS_PROVISIONAL_NEEDS_INDEPENDENT_B5_AUDIT':
    'PROFILE_SOURCE_INCOMPLETE_DO_NOT_ZERO_SELECTION',
  permitHistoricalBackfill:false,independentB5OriginalAuditNotYetBound:true,
  industryResearchOnly:true,actualClassificationPITAccepted:false,
  strategyRanksAltered:false,selectedCount:null,zeroPickDay:null,
  system1FormalCoreChanged:false,ordersAuthorized:false,
  frozenD1Written:false,pushAuthorized:false,cloudflareD1Writes:0,
  cloudflareR2Writes:0,providerMarketGetsAdded:0,newCronCreated:0
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
