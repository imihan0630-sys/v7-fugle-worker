// BUILD Class A, offline-only: inspect DATA B5 source-only original-scope receipt.
// Not a synthetic DATA->BUILD native PIT handoff; no selection, writes, or provider GET.
import {createHash} from 'node:crypto';
const sha=s=>createHash('sha256').update(s).digest('hex');
const HASH=/^[a-f0-9]{64}$/i;
const iso=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(s)&&Number.isFinite(Date.parse(s));
const bad=c=>{throw Error('S2_B5_DATA_SCOPE_BRIDGE_'+c)};
export function inspectDataB5OriginalScopeForBuildV0_1({dataReceipt,sourceUniverse,marketDate}={}){
 const d=dataReceipt;
 if(!d||d.schemaVersion!=='S2_DATA_B5_ORIGINAL_SOURCE_SCOPE_V0_1'||
    !HASH.test(d.receiptHash||'')||
    sha(JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k])=>k!=='receiptHash'))))!==d.receiptHash)
   bad('DATA_RECEIPT_HASH_INVALID');
 if(typeof marketDate!=='string'||d.marketDate!==marketDate||
    !iso(d.evaluationAtUtc)||!HASH.test(d.a1SourceReceiptHash||'')||
    !Array.isArray(d.mapping)||!Array.isArray(d.summaries)||d.summaries.length!==2||
    d.sourceScope!=='PROSPECTIVE_CURRENT_PROFILE_ONLY'||
    d.originalSourceAuditState!=='PENDING_INDEPENDENT_AUDIT'||
    d.officialB5FullMarketIndependentAccepted!==false||
    d.certifiedOrdinaryShareDenominator!==null||
    d.independentPITAccepted!==false||d.selectionAuthorized!==false||
    d.selectedCount!==null||d.zeroPickDay!==null||d.frozenD1Written!==false)
   bad('DATA_AUTHORITY_OR_DATE_INVALID');
 if(!Array.isArray(sourceUniverse)||sourceUniverse.length===0)bad('A1_SCOPE_MISSING');
 const expected=new Set();
 for(const row of sourceUniverse){
   if(!['TWSE','TPEX'].includes(row?.market)||!/^[1-9][0-9]{3}$/.test(row?.symbol||'')||
      expected.has(row.market+'|'+row.symbol))bad('A1_IDENTITY_INVALID');
   expected.add(row.market+'|'+row.symbol);
 }
 if(d.mapping.length!==expected.size)bad('DATA_A1_DENOMINATOR_MISMATCH');
 const observed=new Set(),tally={TWSE:{mapped:0,unknown:0,conflict:0},TPEX:{mapped:0,unknown:0,conflict:0}};
 for(const row of d.mapping){
   const id=row?.market+'|'+row?.symbol;
   if(!expected.has(id)||observed.has(id))bad('DATA_A1_IDENTITY_MISMATCH');
   observed.add(id);
   const state=row.currentIndustryState;
   if(state==='CURRENT_PROFILE_SOURCE_ONLY'){
     if(!row.officialIndustryRawValue||!row.nativeIndustryField)bad('MAPPED_VALUE_MISSING');
     tally[row.market].mapped++;
   }else if(state==='OFFICIAL_INDUSTRY_UNKNOWN'){
     if(row.officialIndustryRawValue!==null)tally[row.market].unknown+=0,bad('UNKNOWN_HAS_LABEL');
     tally[row.market].unknown++;
   }else if(state==='PROFILE_IDENTITY_CONFLICT'){
     if(row.officialIndustryRawValue!==null)bad('CONFLICT_HAS_LABEL');
     tally[row.market].conflict++;
   }else bad('UNRECOGNIZED_CLASSIFICATION_STATE');
   if(row.instrumentOrdinaryShareClassCertified!==false||
      row.industryHistoricalEffectiveWindowCertified!==false||
      row.independentB5Audited!==false||row.strategyUseAuthorized!==false)
      bad('ROW_AUTHORITY_ESCALATION');
 }
 let matched=0,unknown=0,conflict=0;
 for(const market of ['TWSE','TPEX']){
   const s=d.summaries.find(x=>x?.market===market);
   const all=d.summaries.filter(x=>x?.market===market);
   if(all.length!==1||!HASH.test(s.originalRawBodySha256||'')||
      !iso(s.observedAtUtc)||!['boolean'].includes(typeof s.beforeEvaluation)||
      s.independentB5Audited!==false||s.a1SourceInstrumentDenominator!==
        sourceUniverse.filter(x=>x.market===market).length||
      ['mapped','unknown','conflict'].some(k=>s[k]!==tally[market][k])||
      s.totalAccountsFor!==true)
      bad('PER_MARKET_ORIGINAL_SCOPE_MISMATCH');
   matched+=s.mapped;unknown+=s.unknown;conflict+=s.conflict;
 }
 if(d.mappedInstrumentCount!==matched||d.unknownInstrumentCount!==unknown||
    d.conflictInstrumentCount!==conflict||matched+unknown+conflict!==expected.size||
    d.sourceLateAtEvaluation!==d.summaries.some(s=>!s.beforeEvaluation))
   bad('TOTALS_OR_CLOCK_INVALID');
 const late=d.sourceLateAtEvaluation;
 return Object.freeze({
   schemaVersion:'S2_BUILD_B5_DATA_SCOPE_INSPECTION_V0_1',
   marketDate,classificationAuthority:'SOURCE_ONLY_NOT_INDEPENDENT_B5',
   sourceUniverseInstrumentCount:expected.size,
   mappedSourceOnlyCount:matched,unknownCount:unknown,conflictCount:conflict,
   twse:{...tally.TWSE},tpex:{...tally.TPEX},
   sourceLateAtEvaluation:late,
   currentOfficialFullMarketCoverageCertified:null,
   historicalIndustryPITCertified:false,
   sourceForDailyIndustryDisplayAuthorized:false,
   sourceForStrategyAuthorized:false,
   ordinaryShareUniverseDenominator:null,
   selectedCount:null,zeroPickDay:null,frozenD1Written:false,
   blockers:[
     'DATA_A1_IDENTITY_ONLY_NOT_INDEPENDENT_AUDIT',
     'B5_NATIVE_ORIGINAL_INDEPENDENT_READBACK_REQUIRED',
     'B5_ACTUAL_FIRST_KNOWN_AVAILABLE_AND_EFFECTIVE_VINTAGES_REQUIRED',
     ...(late?['B5_SOURCE_LATE_AT_EVALUATION']:[])
   ]
 });
}
