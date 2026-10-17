// BUILD Class A: source-bounded industry enrichment. It never affects selection.
import {sha256Hex} from './decision_archive.mjs';
const HEX=/^[a-f0-9]{64}$/i,DAY=/^\d{4}-\d{2}-\d{2}$/,UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const isDay=x=>typeof x==='string'&&DAY.test(x)&&!Number.isNaN(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const isTime=x=>typeof x==='string'&&UTC.test(x)&&!Number.isNaN(Date.parse(x));
const fail=k=>{throw Error('S2_INDUSTRY_ENRICHMENT_'+k)};
const original=x=>Object.fromEntries(Object.entries(x).filter(([k])=>k!=='receiptHash'));
const safe=x=>String(x??'UNKNOWN').replace(/[\r\n|<>\t]/g,' ').slice(0,90);
const key=x=>x.market+'|'+x.symbol;
const cutoff=d=>Date.parse(d+'T15:45:00Z'); // T 23:45 Taipei; NEVER backfill T+1 knowledge.
const isRecord=r=>r&&/^[1-9][0-9]{3}$/.test(r.symbol||'')&&['TWSE','TPEX'].includes(r.market)&&
 isTime(r.knownAtUtc)&&typeof r.sourcePath==='string'&&r.sourcePath.startsWith('research/')&&
 typeof r.formalIndustryLabel==='string'&&r.formalIndustryLabel.length>0&&
 r.formalIndustryCode===null&&Array.isArray(r.edges)&&r.edges.every(e=>e&&
 typeof e.subindustry==='string'&&typeof e.product==='string'&&
 typeof e.supplyRole==='string'&&typeof e.theme==='string'&&
 e.exposureMagnitude==='UNKNOWN')&&
 (!r.industryChange||(isDay(r.industryChange.effectiveFrom)&&
  isDay(r.industryChange.announcedOn)&&r.industryChange.newLabel===r.formalIndustryLabel));
export async function buildSystem2IndustryResearchEnrichmentV0_1({handoff,evidence,generatedAtUtc}={}){
 if(!isTime(generatedAtUtc))fail('GENERATION_CLOCK_INVALID');
 if(!handoff||handoff.schemaVersion!=='S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1'||
   !HEX.test(handoff.receiptHash||'')||
   await sha256Hex(original(handoff))!==handoff.receiptHash||
   !isDay(handoff.marketDate)||!isTime(handoff.auditedAtUtc)||
   Date.parse(generatedAtUtc)<Date.parse(handoff.auditedAtUtc)||
   handoff.selectedCount!==null||handoff.zeroPickDay!==null||
   handoff.frozenD1Written!==false||handoff.pitACertificationGranted!==false||
   handoff.pitBCertificationGranted!==false||handoff.system1FormalCoreChanged!==false)
  fail('SIGNED_SOURCE_OR_AUTHORITY_INVALID');
 if(!evidence||evidence.schemaVersion!=='S2_INDUSTRY_PRIOR_RESEARCH_REUSE_SEEDS_V0_1'||
   evidence.pitCertified!==false||evidence.b5CurrentFullMarketCertified!==false||
   !Array.isArray(evidence.records))fail('EVIDENCE_SEED_NOT_SOURCE_BOUNDED');
 const seenSeed=new Set();
 for(const rec of evidence.records){
  if(!isRecord(rec)||seenSeed.has(key(rec)))fail('SEED_INVALID_OR_CONFLICTED');
  seenSeed.add(key(rec));
 }
 const ready=handoff.state==='NON_PIT_SOURCE_OBSERVATION_READY';
 if(!ready&&!['PRELIMINARY_SOURCE_NOT_READY','INDEPENDENT_SOURCE_INCOMPLETE'].includes(handoff.state))
  fail('SOURCE_STATE_UNKNOWN');
 const p=ready?handoff.previewReport:null;
 if(ready&&(!p||!HEX.test(p.receiptHash||'')||
   await sha256Hex(original(p))!==p.receiptHash||
   p.marketDate!==handoff.marketDate||
   p.sourceOriginalReceiptHash!==handoff.originalSourceReceiptHash||
   p.sourceAuditHashNotStrategyPIT!==handoff.independentSourceAuditHash||
   p.requestedLayer!=='NON_PIT_PREVIEW'||!Array.isArray(p.previewRows)||
   p.previewRows.length!==handoff.observedPreviewCount||
   p.strategySelectedCount!==null||p.frozenD1Written!==false||
   p.ordersAuthorized!==false))fail('SOURCE_PREVIEW_HASH_OR_AUTHORITY_INVALID');
 if(!ready&&(handoff.previewReport!==null||handoff.observedPreviewCount!==null))
  fail('BLOCKED_SOURCE_HAS_PREVIEW');
 const evidenceMap=new Map(evidence.records.map(r=>[key(r),r]));
 const seenPreview=new Set(), rows=[];
 for(const [i,r] of (p?.previewRows||[]).entries()){
  if(!r||!/^[1-9][0-9]{3}$/.test(r.symbol||'')||
   !['TWSE','TPEX'].includes(r.market)||r.marketDate!==handoff.marketDate||
   r.previewDisplayOrder!==i+1||seenPreview.has(key(r))||
   !HEX.test(r.sourceRowHash||'')||r.formalStrategyRank!==null||
   r.previewIsTradeRecommendation!==false)
   fail('PREVIEW_ROW_INVALID_OR_DUPLICATED');
  seenPreview.add(key(r));
  const record=evidenceMap.get(key(r));
  const known=record&&Date.parse(record.knownAtUtc)<=cutoff(handoff.marketDate)&&
    Date.parse(record.knownAtUtc)<=Date.parse(p.originalObservedAtUtc);
  // Effective-dated change is not a license to recreate older histories
  // using a source first captured after the historical market date.
  const effective=known&&(!record.industryChange||
    handoff.marketDate>=record.industryChange.effectiveFrom);
  const active=Boolean(known&&effective);
  const edges=active?record.edges.map(e=>({
    subindustry:e.subindustry,product:e.product,supplyRole:e.supplyRole,
    theme:e.theme,revenueShare:'UNKNOWN',orderShare:'UNKNOWN',
    capacityShare:'UNKNOWN',evidenceSource:record.sourcePath,
    confidence:'BOUNDED_PRIOR_RESEARCH_NOT_PIT',strategyUseAuthorized:false
  })):[];
  rows.push({
   displayOrder:i+1,symbol:r.symbol,market:r.market,companyName:r.companyName,
   marketDate:handoff.marketDate,sourceRowHash:r.sourceRowHash,
   formalIndustryLabel:active?record.formalIndustryLabel:null,
   formalIndustryCode:null,officialCurrentB5Verified:false,
   researchLabelState:active?'HISTORICAL_RESEARCH_CAPTURE_ONLY':'OFFICIAL_INDUSTRY_UNKNOWN',
   subindustryState:edges.length?'BOUNDED_PRODUCT_EVIDENCE':'SUBINDUSTRY_UNKNOWN',
   supplyChainEdges:edges,themeIds:[...new Set(edges.map(e=>e.theme))],
   industryChangeEffectiveFrom:active?record.industryChange?.effectiveFrom??null:null,
   evidenceFirstKnownAt:active?record.knownAtUtc:null,
   sourcePath:active?record.sourcePath:null,
   originalRevenueExposure:'UNKNOWN',
   historicalClassificationPITCertified:false,
   independentlyAuditedForStrategy:false,
   industryScoreEffect:0,
   strategySelectedCount:null
  });
 }
 const labelCount=rows.filter(r=>r.formalIndustryLabel!==null).length;
 const subCount=rows.filter(r=>r.supplyChainEdges.length>0).length;
 const base={
  schemaVersion:'S2_INDUSTRY_RESEARCH_ENRICHMENT_V0_1',researchOnly:true,
  marketDate:handoff.marketDate,generatedAtUtc,sourceReady:ready,
  sourceHandoffHash:handoff.receiptHash,
  originalSourceHash:handoff.originalSourceReceiptHash,
  originalIndependentSourceAuditHash:handoff.independentSourceAuditHash,
  evidenceSeedVersion:evidence.schemaVersion,evidenceTotalResearchIssuerRecords:evidence.records.length,
  sourceFourDigitUniverseCount:ready?p.sourceUniverseCount:null,
  fullMarketOrdinaryShareDenominator:null,
  currentOfficialB5FullMarketDenominator:null,currentOfficialB5VerifiedCount:null,
  fullMarketIndustryCoverageRate:null,
  previewRowCount:ready?rows.length:null,
  previewPriorResearchLabelCount:ready?labelCount:null,
  previewSubindustryProductEvidenceCount:ready?subCount:null,
  previewOfficialIndustryUnknownCount:ready?rows.length-labelCount:null,
  previewSubindustryUnknownCount:ready?rows.length-subCount:null,
  rows,
  b5NativeCurrentCoverageState:'NOT_JOINED_SOURCE_FROM_DATA_LANE',
  maturity:'PRIOR_RESEARCH_REUSE_ONLY_NOT_CURRENT_FULL_MARKET_COVERAGE',
  historicalReclassificationNativePITCertified:false,
  officialShortMomentumScoringChanged:false,
  selectedCount:null,zeroPickDay:null,pitACertified:false,pitBCertified:false,
  frozenD1Written:false,shadowAuthorized:false,ordersAuthorized:false,
  pushesAuthorized:false,providerGetsAdded:0,cloudflareD1Writes:0,
  cloudflareR2Writes:0,system1FormalCoreChanged:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
export function renderIndustryResearchContextV0_1(r){
 if(!r||r.schemaVersion!=='S2_INDUSTRY_RESEARCH_ENRICHMENT_V0_1')fail('RENDER_CONTRACT_INVALID');
 const lines=['## 產業／供應鏈研究補充（Class A；不影響原有 Scheme C 名單）','',
 '**分類來源：** 重用 BR-046／BR-047／BR-083 既有研究捕捉，並非當日全市場 B5 原始來源讀回。',
 '**官方當日 B5 覆蓋：** UNKNOWN；普通股全市場分母 UNKNOWN；未取得完整來源前不顯示產業輪動強弱排名。',
 '**證據性質：** 以下主產業文字僅是舊研究中當時的官方分類摘記，未認證今日官方代碼、歷史 PIT、產品收入占比或策略加分。',
 ''];
 if(!r.sourceReady)lines.push('**SOURCE_NOT_READY：** 原研究候選來源未就緒，產業模組不得製造零檔選股結論。');
 else{
  lines.push('**研究名單內既有分類證據：** '+r.previewPriorResearchLabelCount+'/'+r.previewRowCount+
  '；**具備細分類／產品線索：** '+r.previewSubindustryProductEvidenceCount+'/'+r.previewRowCount+'。','',
  '| 代號 | 市場 | 舊研究主產業摘記 | 細分類／產品 | 供應鏈角色 | 題材 | 警告 |',
  '|---|---|---|---|---|---|---|');
  for(const x of r.rows){
   const edge=x.supplyChainEdges;
   lines.push('| '+safe(x.symbol)+' | '+safe(x.market)+
    ' | '+safe(x.formalIndustryLabel??'OFFICIAL_INDUSTRY_UNKNOWN')+
    ' | '+safe(edge.length?edge.map(e=>e.product).join('、'):'SUBINDUSTRY_UNKNOWN')+
    ' | '+safe(edge.length?edge.map(e=>e.supplyRole).join('、'):'UNKNOWN')+
    ' | '+safe(x.themeIds.length?x.themeIds.join('、'):'UNKNOWN')+
    ' | '+(x.formalIndustryLabel?'尚待當日 B5／獨立 PIT 驗證':'來源未建立，不推論')+' |');
  }
 }
 lines.push('','**不做的事：** 不依官方產業推定題材會員、不把技術能力推成營收、不把 2026/06/01 產業變更回填到前一歷史日期、不啟動新 GET／Cron／D1／Frozen／Shadow 或交易。','**產業研究收據 SHA：** '+r.receiptHash,'');
 return lines.join('\n');
}
