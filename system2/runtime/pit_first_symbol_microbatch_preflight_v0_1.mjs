// BUILD_LANE: first verified symbol may clear Stage1 PIT even while the rest
// of the market remains UNKNOWN.  This is a read-only, audit-pinned admission
// preflight, NOT a selection scorer, ranking, Shadow or physical Frozen writer.
// Positive receipts MUST come from DATA originals plus an independently
// published AUDIT_LANE receipt: a producer self-hash is not enough.
import {sha256Hex} from './decision_archive.mjs';

const SHA=/^[a-f0-9]{64}$/, DAY=/^\d{4}-\d{2}-\d{2}$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const CA_FAMILIES=[
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL',
 'TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE',
 'TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE',
 'TPEX_PAR_VALUE_CHANGE_REFERENCE',
];
const wrong=code=>{throw Error('S2_FIRST_PIT_SYMBOL_'+code);};
const noHash=(value,key)=>Object.fromEntries(Object.entries(value).filter(([k])=>k!==key));
const utc=t=>typeof t==='string'&&UTC.test(t)&&Number.isFinite(Date.parse(t))
 &&new Date(Date.parse(t)).toISOString().slice(0,19)===t.slice(0,19);
const day=d=>typeof d==='string'&&DAY.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))
 &&new Date(Date.parse(d+'T00:00:00Z')).toISOString().slice(0,10)===d;
const positive=x=>Number.isSafeInteger(x)&&x>0;
const byCut=(x,cut)=>utc(x)&&Date.parse(x)<=Date.parse(cut);
const digest=async(value,field)=>SHA.test(value?.[field]||'') &&
 await sha256Hex(noHash(value,field))===value[field];

// DATA and AUDIT receipt shapes are an interface proposal for a FUTURE
// scoped handoff, not a claim that those original evidences exist today.
// expectedIndependentAuditHash must be obtained independently from trusted
// AUDIT_LANE main/artifact readback, never copied from producer's handoff.
export async function preflightFirstPitSymbolV0_1({
 dataHandoff=null,independentAudit=null,expectedIndependentAuditHash=null
}={}){
 const empty={
  schemaVersion:'S2_BUILD_FIRST_PIT_SYMBOL_PREFLIGHT_V0_1',
  state:'AWAITING_INDEPENDENT_SYMBOL_PIT_HANDOFF',
  pitTrack:'PIT_A',pitBHistoricalReplayCertified:false,
  marketDate:null,sourceSecurityWindowCount:null,
  pitScopeIndependentlyAcceptedCount:0,pitEvidenceUnknownCount:null,
  eligibleForStage1ResearchSymbols:[],
  strategyActuallyAssessedCount:null,rankedCount:null,selectedCount:null,
  zeroPickDay:null,fullMarketSelectionAuthorized:false,
  qualifiedShadowAuthorized:false,frozenD1Written:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
  system1FormalCoreChanged:false,
 };
 if(dataHandoff===null&&independentAudit===null&&expectedIndependentAuditHash===null)
  return Object.freeze({...empty,receiptHash:await sha256Hex(empty)});
 if(!dataHandoff||!independentAudit||!SHA.test(expectedIndependentAuditHash||''))
  wrong('INDEPENDENT_AUDIT_NOT_EXTERNALLY_PINNED');
 const h=dataHandoff,a=independentAudit,cut=h.decisionCutAtUtc;
 // Owner-approved PIT-A = prospective DAILY as-of; PIT-B is a separate
 // historical replay/backtest lane. A correctly hashed PIT-B receipt must
 // NEVER certify a PIT-A symbol just because its 61 rows are present.
 // These labels are routing requirements, NOT replacements for original
 // archived-by-cut bytes, CFI/CA vintages, or an independent AUDIT verdict.
 if(h.pitTrack!=='PIT_A'||
    h.evidenceUse!=='PROSPECTIVE_DAILY_SELECTION'||
    h.decisionCutMode!=='ACTUAL_FUTURE_OBSERVATION'||
    h.pitBApprovalUsedAsSubstitute!==false)
   wrong('PIT_A_PROSPECTIVE_ROUTE_REQUIRED');
 if(h.schemaVersion!=='S2_DATA_SYMBOL_PIT_SCOPE_HANDOFF_V0_1'||
    !day(h.marketDate)||!utc(cut)||!positive(h.sourceSecurityWindowCount)||
    !SHA.test(h.sourceOriginalReceiptHash||'')||
    !SHA.test(h.sourceIndependentAuditHash||'')||
    !Array.isArray(h.officialTradingDates)||h.officialTradingDates.length!==61||
    h.officialTradingDates.some((d,i)=>!day(d)||(i>0&&d<=h.officialTradingDates[i-1]))||
    h.officialTradingDates.at(-1)!==h.marketDate||
    !SHA.test(h.officialTradingDatesOriginalSha256||'')||
    !Array.isArray(h.symbols)||h.symbols.length<1||
    h.symbols.length>h.sourceSecurityWindowCount||
    h.selectionAuthorized!==false||h.shadowAuthorized!==false||
    h.frozenD1Written!==false||h.selectedCount!==null||h.zeroPickDay!==null||
    !(await digest(h,'receiptHash')))
  wrong('DATA_ORIGINAL_SCOPE_OR_HASH_INVALID');
 if(a.schemaVersion!=='S2_AUDIT_SYMBOL_PIT_SCOPE_RECEIPT_V0_1'||
    a.dataHandoffReceiptHash!==h.receiptHash||
    a.pitTrack!=='PIT_A'||a.pitTrack!==h.pitTrack||
    a.evidenceUse!==h.evidenceUse||
    a.decisionCutMode!==h.decisionCutMode||
    a.pitBHistoricalApprovalSubstituted!==false||
    a.marketDate!==h.marketDate||a.decisionCutAtUtc!==cut||
    a.verdict!=='PIT_SCOPE_INDEPENDENTLY_ACCEPTED'||
    !positive(a.auditRunId)||!positive(a.auditArtifactId)||
    !SHA.test(a.originalArchiveSha256||'')||
    !byCut(a.originalArchiveCapturedAtUtc,cut)||
    !utc(a.independentVerifiedAtUtc)||
    a.originalProviderBytesIndependentlyRehashed!==true||
    a.originalDecisionCutArchiveIndependentlyWitnessed!==true||
    a.classPeriodsPerSymbolIndependentlyAudited!==true||
    a.caRevisionAndNegativeScopeIndependentlyAudited!==true||
    !Array.isArray(a.auditedSymbols)||
    a.auditedSymbols.length!==h.symbols.length||
    !(await digest(a,'receiptHash'))||
    a.receiptHash!==expectedIndependentAuditHash)
  wrong('EXTERNAL_INDEPENDENT_AUDIT_OR_CUT_INVALID');
 const seen=new Set(),audited=new Set(),eligible=[];
 for(const member of a.auditedSymbols){
  const k=member?.market+':'+member?.symbol;
  if(audited.has(k)||!SHA.test(member?.dataSymbolSha256||'')||
     member?.verdict!=='PIT_SCOPE_INDEPENDENTLY_ACCEPTED')
    wrong('AUDIT_SYMBOL_OR_VERDICT_INVALID');
  audited.add(k);
 }
 for(const s of h.symbols){
  const key=s?.market+':'+s?.symbol;
  if(seen.has(key)||!['TWSE','TPEX'].includes(s?.market)||
     !/^[1-9][0-9]{3}$/.test(s?.symbol||'')||
     s.marketDate!==h.marketDate||s.pitVerdict!=='PIT_SCOPE_INDEPENDENTLY_ACCEPTED')
   wrong('SYMBOL_IDENTITY_OR_SCOPE_INVALID');
  seen.add(key);
  const matching=a.auditedSymbols.find(x=>x.market===s.market&&x.symbol===s.symbol);
  if(!matching||matching.dataSymbolSha256!==await sha256Hex(s))
   wrong('SYMBOL_INDEPENDENT_AUDIT_BINDING_INVALID');
  const hist=s.history;
  if(hist?.sessionCount!==61||
     hist.firstSessionDate!==h.officialTradingDates[0]||
     hist.lastSessionDate!==h.marketDate||
     !SHA.test(hist.originalProviderBytesSha256||'')||
     !SHA.test(hist.originalSourceAuditSha256||'')||
     !byCut(hist.originalArchiveCapturedAtUtc,cut)||
     !byCut(hist.lastBarAvailableAtUtc,cut)||
     hist.all61BarsIndividualOriginalVersionAndAsOfClocksAudited!==true||
     hist.all61BarHashesBoundToOfficialCalendar!==true)
   wrong('SYMBOL_A1_HISTORICAL_ASOF_NOT_ATTESTED');
  const periods=s.instrumentClass?.effectivePeriods;
  if(s.instrumentClass?.nativeInstrumentClass!=='ORDINARY_COMMON_SHARE'||
     !Array.isArray(periods)||!periods.length||
     s.instrumentClass.historicalNativeVersionsIndependentlyAudited!==true)
   wrong('HISTORICAL_ORDINARY_CLASS_UNVERIFIED');
  for(const p of periods)
   if(!day(p?.from)||!day(p?.through)||p.through<p.from||
      p.nativeCfi!=='ESVUFR'||!SHA.test(p.originalNativeSha256||'')||
      !byCut(p.originalCapturedAtUtc,cut)||!byCut(p.firstKnownAtUtc,cut)||
      !byCut(p.availableAtUtc,cut))
    wrong('CLASS_NATIVE_VERSION_OR_CLOCK_INVALID');
  // Check every official session has exactly one matching native class period.
  for(const d of h.officialTradingDates)
   if(periods.filter(p=>p.from<=d&&d<=p.through).length!==1)
    wrong('CLASS_61_SESSION_EFFECTIVE_PERIOD_GAP_OR_OVERLAP');
  const ca=s.corporateActions;
  if(!Array.isArray(ca?.sixNativeFamilies)||ca.sixNativeFamilies.length!==6||
     ca.allCorrectionsAndCancellationsIndependentlyAudited!==true||
     ca.allSuspensionsAndReinstatementsIndependentlyAudited!==true||
     ca.authoritativeNegativeNoEventScopeIndependentlyAudited!==true||
     ca.scopeFirstSessionDate!==h.officialTradingDates[0]||
     ca.scopeLastSessionDate!==h.marketDate)
   wrong('CORPORATE_ACTION_NEGATIVE_OR_REVISION_SCOPE_UNVERIFIED');
  const ids=new Set();
  for(const f of ca.sixNativeFamilies){
   if(!CA_FAMILIES.includes(f?.sourceId)||ids.has(f.sourceId)||
      !SHA.test(f.originalNativeSha256||'')||
      !byCut(f.originalCapturedAtUtc,cut)||!byCut(f.availableAtUtc,cut))
     wrong('SIX_NATIVE_CA_FAMILY_OR_CLOCK_INVALID');
   ids.add(f.sourceId);
  }
  eligible.push({symbol:s.symbol,market:s.market,
   dataSymbolSha256:matching.dataSymbolSha256,
   independentAuditReceiptHash:a.receiptHash,
   originalDataReceiptHash:h.receiptHash,
   state:'PIT_SCOPE_INDEPENDENTLY_ACCEPTED__STAGE1_ASSESSOR_NOT_EXECUTED'});
 }
 if(audited.size!==seen.size)
  wrong('AUDIT_EXTRA_OR_MISSING_SYMBOL');
 eligible.sort((x,y)=>x.symbol.localeCompare(y.symbol)||x.market.localeCompare(y.market));
 const base={...empty,
  state:'PIT_SYMBOL_MICROBATCH_ADMITTED_FOR_STAGE1_RESEARCH_ONLY',
  marketDate:h.marketDate,decisionCutAtUtc:cut,
  sourceSecurityWindowCount:h.sourceSecurityWindowCount,
  dataReceiptHash:h.receiptHash,independentAuditReceiptHash:a.receiptHash,
  pitScopeIndependentlyAcceptedCount:eligible.length,
  pitEvidenceUnknownCount:h.sourceSecurityWindowCount-eligible.length,
  eligibleForStage1ResearchSymbols:eligible,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
