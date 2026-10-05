import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_EVENT_SPECIFIC_LINKAGE_VERSION="0.5-RESEARCH";

function text(v){return v==null?"":String(v).trim();}
export function versionKeyV0_5(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}
export function issuerScopeEligibleV0_5(rowText){
  return !/代(?:重要)?子公司|子公司/.test(text(rowText));
}
export function familyMatchV0_5(rowText,family){
  const t=text(rowText);
  if(family==="CAPITAL_REDUCTION") return /減資/.test(t);
  if(family==="PAR_VALUE_CHANGE"){
    if(/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(t)) return false;
    return /股票面額變更|變更股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(t);
  }
  return false;
}
export function disclosureStageV0_5(rowText){
  const t=text(rowText);
  if(/公司債.*停止轉換|停止轉換期間/.test(t)) return "BOND_CONVERSION";
  if(/庫藏股|限制員工權利新股/.test(t)) return "OTHER_CAPITAL_CHANGE";
  if(/主管機關核准|業經核准/.test(t)) return "AUTHORITY_APPROVAL";
  if(/換股基準日|換發股票基準日|換發有價證券|換股作業計畫|換發股票作業計畫|換票作業/.test(t)) return "EXCHANGE_PLAN";
  if(/變更登記完成|資本額變更登記|資本變更登記/.test(t)) return "REGISTRATION";
  if(/減資基準日/.test(t)) return "BASE_DATE";
  if(/債權人/.test(t)) return "CREDITOR_NOTICE";
  if(/董事會決議|股東常會決議|股東會決議/.test(t)) return "CORPORATE_DECISION";
  if(/股票面額變更相關事宜|公告期間/.test(t)&&/面額/.test(t)) return "PAR_VALUE_NOTICE";
  return "OTHER";
}
export function capitalReductionSemanticV0_5(rowText){
  const t=text(rowText);
  if(/庫藏股|限制員工權利新股/.test(t)) return "OTHER_CAPITAL_CHANGE";
  if(/彌補虧損/.test(t)) return "LOSS_OFFSET";
  if(/現金減資|退還股款/.test(t)) return "RETURN_CAPITAL";
  return "GENERIC_CAPITAL_REDUCTION";
}
export function officialSubtypeSemanticV0_5(subtype){
  const t=text(subtype);
  if(/退還股款/.test(t)) return "RETURN_CAPITAL";
  if(/彌補虧損/.test(t)) return "LOSS_OFFSET";
  return null;
}
function isoFromCompact(token){
  if(!/^\d{8}$/.test(token)) return null;
  const iso=token.slice(0,4)+"-"+token.slice(4,6)+"-"+token.slice(6,8);
  const d=new Date(iso+"T00:00:00Z");
  return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===iso?iso:null;
}
function isoFromRoc(y,m,d){
  const iso=String(Number(y)+1911).padStart(4,"0")+"-"+String(Number(m)).padStart(2,"0")+"-"+String(Number(d)).padStart(2,"0");
  const dt=new Date(iso+"T00:00:00Z");
  return Number.isFinite(dt.getTime())&&dt.toISOString().slice(0,10)===iso?iso:null;
}
export function detailDateTokensV0_5(detail){
  const t=text(detail);
  const out=new Set();
  for(const m of t.matchAll(/(?<!\d)(20\d{6})(?!\d)/g)){
    const iso=isoFromCompact(m[1]);if(iso)out.add(iso);
  }
  for(const m of t.matchAll(/(?<!\d)(\d{3})[\/年](\d{1,2})[\/月](\d{1,2})日?/g)){
    const iso=isoFromRoc(m[1],m[2],m[3]);if(iso)out.add(iso);
  }
  return Object.freeze([...out].sort());
}
function correctionHint(row){return row?.correctionOrCancellationHint===true||/更正|修正/.test(text(row?.rowText));}
function cancellationHint(row){return /取消|撤銷|廢止/.test(text(row?.rowText));}

export function reconcileActionFamilyQueryIntegrityV0_5({
  yearRows=[],
  monthRows=[],
  family,
  startDate,
  endDate,
}={}){
  const keep=(r)=>r?.date&&r.date>=startDate&&r.date<=endDate&&issuerScopeEligibleV0_5(r.rowText)&&familyMatchV0_5(r.rowText,family);
  const y=(Array.isArray(yearRows)?yearRows:[]).filter(keep);
  const m=(Array.isArray(monthRows)?monthRows:[]).filter(keep);
  const ym=new Map(y.map(r=>[versionKeyV0_5(r),r]));
  const mm=new Map(m.map(r=>[versionKeyV0_5(r),r]));
  const onlyYear=[...ym.keys()].filter(k=>!mm.has(k)).map(k=>ym.get(k));
  const onlyMonth=[...mm.keys()].filter(k=>!ym.has(k)).map(k=>mm.get(k));
  const differences=[...onlyYear,...onlyMonth];
  return deepFreeze({
    family,
    yearFamilyRowCount:ym.size,
    monthFamilyRowCount:mm.size,
    onlyYearCount:onlyYear.length,
    onlyMonthCount:onlyMonth.length,
    exactKeysetReconciliation:onlyYear.length===0&&onlyMonth.length===0,
    periodicNoticeOnlyDivergence:
      differences.length>0 &&
      differences.every(r=>disclosureStageV0_5(r.rowText)==="PAR_VALUE_NOTICE"&&/公告期間/.test(text(r.rowText))),
    onlyYear:Object.freeze(onlyYear.map(r=>deepFreeze({key:versionKeyV0_5(r),rowText:r.rowText}))),
    onlyMonth:Object.freeze(onlyMonth.map(r=>deepFreeze({key:versionKeyV0_5(r),rowText:r.rowText}))),
  });
}

export function buildEventSpecificLinkageDiagnosticV0_5({
  event,
  issuerFamilyRows=[],
  actionFamilyQueryIntegrity,
}={}){
  if(!event||typeof event!=="object") throw new Error("event is required");
  const family=text(event.family);
  const effectiveDate=text(event.effectiveDate);
  const subtypeSemantic=officialSubtypeSemanticV0_5(event.officialSubtype);
  const detailDates=detailDateTokensV0_5(event.officialDetail);
  const rows=(Array.isArray(issuerFamilyRows)?issuerFamilyRows:[])
    .filter(r=>r?.date&&r.date<=effectiveDate&&issuerScopeEligibleV0_5(r.rowText)&&familyMatchV0_5(r.rowText,family))
    .map(r=>({...r,stage:disclosureStageV0_5(r.rowText),reductionSemantic:family==="CAPITAL_REDUCTION"?capitalReductionSemanticV0_5(r.rowText):null}))
    .sort((a,b)=>versionKeyV0_5(a).localeCompare(versionKeyV0_5(b)));

  let aligned=rows;
  let seed=null;
  if(family==="CAPITAL_REDUCTION"&&subtypeSemantic){
    const semanticSeeds=rows.filter(r=>r.reductionSemantic===subtypeSemantic);
    seed=semanticSeeds.filter(r=>r.stage==="CORPORATE_DECISION").at(-1) || semanticSeeds.at(-1) || null;
    if(seed){
      aligned=rows.filter(r=>r.date>=seed.date && !["OTHER_CAPITAL_CHANGE","BOND_CONVERSION"].includes(r.stage))
        .filter(r=>r.reductionSemantic==="GENERIC_CAPITAL_REDUCTION"||r.reductionSemantic===subtypeSemantic);
    }else{
      aligned=[];
    }
  }
  const stageCounts={};
  for(const r of aligned)stageCounts[r.stage]=(stageCounts[r.stage]||0)+1;
  const correctionRows=aligned.filter(correctionHint);
  const cancellationRows=aligned.filter(cancellationHint);
  const sourceIntegrityExact=actionFamilyQueryIntegrity?.exactKeysetReconciliation===true;

  return deepFreeze({
    schemaVersion:"S2_S2_07_EVENT_SPECIFIC_LINKAGE_DIAGNOSTIC_V0_5",
    version:S2_07_EVENT_SPECIFIC_LINKAGE_VERSION,
    eventKey:event.eventKey||null,
    sourceId:event.sourceId||null,
    symbol:event.symbol||null,
    family,
    effectiveDate,
    officialSubtype:event.officialSubtype||null,
    officialSubtypeSemantic:subtypeSemantic,
    officialDetailDateTokens:detailDates,
    actionFamilyQueryIntegrityExact:sourceIntegrityExact,
    periodicNoticeOnlyDivergence:actionFamilyQueryIntegrity?.periodicNoticeOnlyDivergence===true,
    semanticSeedVersionKey:seed?versionKeyV0_5(seed):null,
    semanticSeedDate:seed?.date||null,
    semanticAlignedRowCount:aligned.length,
    semanticAlignedStageCounts:deepFreeze(stageCounts),
    semanticAlignedVersionKeys:Object.freeze(aligned.map(versionKeyV0_5)),
    correctionObserved:correctionRows.length>0,
    correctionObservedVersionKeys:Object.freeze(correctionRows.map(versionKeyV0_5)),
    cancellationObserved:cancellationRows.length>0,
    cancellationObservedVersionKeys:Object.freeze(cancellationRows.map(versionKeyV0_5)),
    eventSpecificAnchorCandidate:
      sourceIntegrityExact &&
      aligned.length>0 &&
      detailDates.length>0 &&
      (family==="PAR_VALUE_CHANGE"||Boolean(seed)),
    promotionLinkageEstablished:false,
    noCancellationMayBeClaimed:false,
    eventLinkageCoverageComplete:false,
    boundedRevisionHistoryCoverageComplete:false,
    correctionHistoryComplete:false,
    cancellationHistoryComplete:false,
    knownAtVersionClockCertified:false,
    revisionCoverageComplete:false,
    technicalContinuityCertified:false,
    tradingAuthority:false,
  });
}

export function summarizeEventSpecificLinkageDiagnosticsV0_5(rows=[]){
  if(!Array.isArray(rows))throw new Error("rows must be array");
  return deepFreeze({
    schemaVersion:"S2_S2_07_EVENT_SPECIFIC_LINKAGE_SUMMARY_V0_5",
    eventCount:rows.length,
    actionFamilyQueryIntegrityExactCount:rows.filter(r=>r.actionFamilyQueryIntegrityExact).length,
    periodicNoticeOnlyDivergenceCount:rows.filter(r=>r.periodicNoticeOnlyDivergence).length,
    eventSpecificAnchorCandidateCount:rows.filter(r=>r.eventSpecificAnchorCandidate).length,
    correctionObservedCount:rows.filter(r=>r.correctionObserved).length,
    cancellationObservedCount:rows.filter(r=>r.cancellationObserved).length,
    promotionLinkageEstablishedCount:0,
    eventLinkageCoverageComplete:false,
    boundedRevisionHistoryCoverageComplete:false,
    correctionHistoryComplete:false,
    cancellationHistoryComplete:false,
    knownAtVersionClockCertified:false,
    revisionCoverageComplete:false,
    technicalContinuityCertified:false,
    tradingAuthority:false,
  });
}
