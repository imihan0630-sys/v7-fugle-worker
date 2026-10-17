// System 2 BUILD / Class A: bounded cross-industry activity overlay.
// Reuse V1.1 gross-activity radar and V1.0 six historical research seeds.
// Never interpret observed theme member activity as audited complete themes,
// issuer revenue exposure, net funds inflow, ranking or strategy authority.
import {sha256Hex} from './decision_archive.mjs';
import {buildSystem2IndustryActivityRadarV0_1} from './industry_activity_rotation_radar_v0_1.mjs';
const HEX=/^[0-9a-f]{64}$/i;
const UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const time=x=>typeof x==='string'&&UTC.test(x)&&Number.isFinite(Date.parse(x));
const day=x=>typeof x==='string'&&DAY.test(x)&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const fail=s=>{throw Error('S2_INDUSTRY_THEME_OVERLAP_'+s)};
const uid=r=>r.market+'|'+r.symbol;
const validName=x=>typeof x==='string'&&/^[A-Z0-9_]{2,80}$/.test(x);
const nsum=a=>a.reduce((x,y)=>x+y,0);
const pct=v=>v===null?'UNKNOWN':(v*100).toFixed(2)+'%';
const safe=x=>String(x??'UNKNOWN').replace(/[|<>\t\r\n]/g,' ').slice(0,90);
const unsigned=x=>Object.fromEntries(Object.entries(x).filter(([k])=>k!=='receiptHash'));
function seedOk(s){
 if(!s||!['TWSE','TPEX'].includes(s.market)||!/^[1-9][0-9]{3}$/.test(s.symbol||'')||
    !time(s.knownAtUtc)||typeof s.sourcePath!=='string'||!s.sourcePath.startsWith('research/')||
    s.formalIndustryCode!==null||!Array.isArray(s.edges)||
    (s.industryChange&&(!day(s.industryChange.effectiveFrom)||!day(s.industryChange.announcedOn))))
   return false;
 return s.edges.every(e=>validName(e.subindustry)&&validName(e.theme)&&
    typeof e.product==='string'&&e.product.length>0&&
    typeof e.supplyRole==='string'&&e.supplyRole.length>0&&
    e.exposureMagnitude==='UNKNOWN');
}
function summarize(members,knownTotal){
 const good=members.filter(x=>typeof x.tradeValueTwd==='number'&&Number.isFinite(x.tradeValueTwd));
 const vals=good.map(x=>x.tradeValueTwd);
 const allKnown=good.length===members.length;
 const total=allKnown?nsum(vals):null;
 const sorted=[...vals].sort((a,b)=>b-a);
 const returns=members.filter(x=>typeof x.dailyReturnPercent==='number'&&Number.isFinite(x.dailyReturnPercent));
 const up=returns.filter(x=>x.dailyReturnPercent>0).length;
 const down=returns.filter(x=>x.dailyReturnPercent<0).length;
 const eq=returns.length===members.length&&returns.length?
   nsum(returns.map(x=>x.dailyReturnPercent))/returns.length:null;
 return {
   observedResearchMemberCount:members.length,
   knownTradeValueMembers:good.length,
   missingTradeValueMembers:members.length-good.length,
   observedPartialMemberTradeValueTwd:nsum(vals),
   observedMemberTradeValueTwd:total,
   observedMemberShareOfFourDigitScope:total!==null&&knownTotal>0?
     total/knownTotal:null,
   officiallyCompleteCohortMembership:false,
   auditedCohortOrdinaryShareMarketFraction:null,
   trueIssuerRevenueExposureWeightedTradeValueTwd:null,
   knownReturnCount:returns.length,
   up,down,flat:returns.length-up-down,
   equalWeightedDailyReturnPercent:eq,
   top1MemberConcentration:total>0?(sorted[0]||0)/total:null,
   top3MemberConcentration:total>0?nsum(sorted.slice(0,3))/total:null,
   institutionalNetAmountTwd:null,
   sessionHistoryCoverage:{1:good.length,5:0,20:0,60:0},
   rotationInference:'INSUFFICIENT_EVIDENCE',
   sourceQuality:'BOUNDED_PRIOR_RESEARCH_NOT_CURRENT_FULL_UNIVERSE'
 };
}
export async function buildSystem2IndustryThemeOverlapV0_1({
 activityReceipt,radarSourceInputs,priorResearchSeeds,generatedAtUtc
}={}){
 if(!activityReceipt||activityReceipt.schemaVersion!=='S2_INDUSTRY_ACTIVITY_ROTATION_RADAR_V0_1'||
   !HEX.test(activityReceipt.receiptHash||'')||
   await sha256Hex(unsigned(activityReceipt))!==activityReceipt.receiptHash||
   activityReceipt.selectedCount!==null||activityReceipt.zeroPickDay!==null||
   activityReceipt.classificationPITAccepted!==false||
   activityReceipt.realStrategyRankAuthorized!==false||
   activityReceipt.frozenD1Written!==false||activityReceipt.system1FormalCoreChanged!==false)
   fail('ACTIVITY_RECEIPT_INVALID');
 if(!time(generatedAtUtc)||Date.parse(generatedAtUtc)<Date.parse(activityReceipt.generatedAtUtc)||
   !radarSourceInputs||radarSourceInputs.marketDate!==activityReceipt.marketDate||
   radarSourceInputs.a1OriginalReceiptHash!==activityReceipt.a1OriginalReceiptHash)
   fail('ACTIVITY_DATE_OR_GENERATION_CLOCK_INVALID');
 const recalculated=await buildSystem2IndustryActivityRadarV0_1({
   ...radarSourceInputs,generatedAtUtc:activityReceipt.generatedAtUtc
 });
 if(recalculated.receiptHash!==activityReceipt.receiptHash)
   fail('ACTIVITY_SOURCE_REPLAY_MISMATCH');
 const universe=radarSourceInputs.sourceUniverse,bars=radarSourceInputs.dailyRows;
 const ids=new Map();
 for(const row of universe){
   const k=uid(row);
   if(ids.has(k)||!HEX.test(row.sourceRowHash||''))fail('SOURCE_UNIVERSE_ROW_HASH_REQUIRED');
   ids.set(k,row.sourceRowHash);
 }
 const byStock=new Map();
 for(const row of bars){
   const k=uid(row);
   if(!ids.has(k)||byStock.has(k)||row.sourceRowHash!==ids.get(k))
     fail('A1_BAR_ORIGINAL_ROW_HASH_MISMATCH');
   byStock.set(k,row);
 }
 const e=priorResearchSeeds;
 if(!e||e.schemaVersion!=='S2_INDUSTRY_PRIOR_RESEARCH_REUSE_SEEDS_V0_1'||
   e.researchOnly!==true||e.b5CurrentFullMarketCertified!==false||
   e.pitCertified!==false||e.formalCoreChanged!==false||
   !Array.isArray(e.records)||e.records.some(x=>!seedOk(x)))
   fail('EXISTING_RESEARCH_EVIDENCE_CONTRACT_INVALID');
 const seedSeen=new Set(),sub=new Map(),theme=new Map();
 const inScope=new Set(),active=new Set(),rejectedLate=new Set(),knownWithoutEdge=new Set();
 const cutoff=Date.parse(activityReceipt.marketDate+'T15:45:00Z');
 const observed=Date.parse(activityReceipt.observedAtUtc);
 for(const record of e.records){
   const k=uid(record);
   if(seedSeen.has(k))fail('DUPLICATED_ISSUER_RESEARCH_SEED');
   seedSeen.add(k);
   if(!ids.has(k))continue;
   inScope.add(k);
   // Old research is NOT reconstructed back to its announced/effective date.
   if(Date.parse(record.knownAtUtc)>Math.min(cutoff,observed)||
      (record.industryChange&&activityReceipt.marketDate<record.industryChange.effectiveFrom)){
     rejectedLate.add(k);continue;
   }
   active.add(k);
   if(record.edges.length===0)knownWithoutEdge.add(k);
   for(const edge of record.edges){
     for(const [kind,name,groups] of [
       ['SUBINDUSTRY',edge.subindustry,sub],['THEME',edge.theme,theme]
     ]){
       const groupKey=kind+'|'+name;
       if(!groups.has(groupKey))groups.set(groupKey,new Map());
       const members=groups.get(groupKey);
       let member=members.get(k);
       if(!member){
         const bar=byStock.get(k)||null;
         member={
           market:record.market,symbol:record.symbol,companyName:record.name??null,
           originalA1RowHash:ids.get(k),
           tradeValueTwd:bar?.tradeValueTwd??null,
           dailyReturnPercent:bar&&typeof bar.closePrice==='number'&&
             typeof bar.priorClosePrice==='number'&&bar.priorClosePrice>0?
               (bar.closePrice/bar.priorClosePrice-1)*100:null,
           researchSourcePath:record.sourcePath,
           researchFirstKnownAtUtc:record.knownAtUtc,
           products:[],supplyChainRoles:[],
           exposureShare:'UNKNOWN',strategyUseAuthorized:false
         };
         members.set(k,member);
       }
       if(!member.products.includes(edge.product))member.products.push(edge.product);
       if(!member.supplyChainRoles.includes(edge.supplyRole))member.supplyChainRoles.push(edge.supplyRole);
     }
   }
 }
 const amount=activityReceipt.observedFourDigitScopeTradeValueTwd;
 const collect=groups=>[...groups.entries()].map(([k,ms])=>{
   const members=[...ms.values()].sort((a,b)=>uid(a).localeCompare(uid(b)));
   return {
     cohortCode:k.split('|')[1],
     cohortType:k.split('|')[0],
     memberScope:'ONLY_EXISTING_RESEARCH_CAPTURED_BEFORE_T_CUT',
     marketComposition:[...new Set(members.map(x=>x.market))].sort(),
     members,
     ...summarize(members,amount)
   };
 }).sort((a,b)=>a.cohortCode.localeCompare(b.cohortCode));
 const themes=collect(theme),subs=collect(sub);
 const appearances=new Map();
 for(const t of themes)for(const m of t.members)appearances.set(uid(m),(appearances.get(uid(m))||0)+1);
 const overlaps=[...appearances].filter(([,n])=>n>1).map(([stock,n])=>({stock,themeCount:n}));
 const unique=[...appearances.keys()].map(k=>byStock.get(k)).filter(Boolean);
 const uniqueComplete=unique.length===appearances.size&&unique.every(x=>typeof x.tradeValueTwd==='number');
 const allThemeComplete=themes.every(g=>g.observedMemberTradeValueTwd!==null);
 const themeSum=allThemeComplete?nsum(themes.map(g=>g.observedMemberTradeValueTwd)):null;
 const uniqueSum=uniqueComplete?nsum(unique.map(x=>x.tradeValueTwd)):null;
 const base={
  schemaVersion:'S2_INDUSTRY_THEME_OVERLAP_V0_1',
  marketDate:activityReceipt.marketDate,observedAtUtc:activityReceipt.observedAtUtc,
  generatedAtUtc,activityReceiptHash:activityReceipt.receiptHash,
  a1OriginalReceiptHash:activityReceipt.a1OriginalReceiptHash,
  b5OriginalScopeReceiptHash:activityReceipt.b5SourceScopeReceiptHash,
  reusedResearchSeedVersion:e.schemaVersion,
  researchSeedEvidenceHash:await sha256Hex(e),
  fourDigitInstrumentScopeCount:activityReceipt.fourDigitInstrumentUniverseCount,
  originalResearchSeedIssuerCount:e.records.length,
  researchIssuerInA1ScopeCount:inScope.size,
  researchIssuerKnownByTCount:active.size,
  researchIssuerExcludedByTimeCount:rejectedLate.size,
  researchIssuerKnownButNoProductEdgeCount:knownWithoutEdge.size,
  auditedCurrentThemeFullMembershipDenominator:null,
  auditedCurrentSubindustryFullMembershipDenominator:null,
  subindustryGroups:subs,themeGroups:themes,
  themeGrossMemberMembershipCount:[...appearances.values()].reduce((a,b)=>a+b,0),
  uniqueThemeResearchMemberCount:appearances.size,
  overlappingThemeStockCount:overlaps.length,
  overlapStockIdentities:overlaps,
  summedThemeMemberGrossTradeValueTwd:themeSum,
  uniqueObservedThemeMemberGrossTradeValueTwd:uniqueSum,
  duplicatedActivityFromCrossThemeMembersTwd:themeSum!==null&&uniqueSum!==null?
    themeSum-uniqueSum:null,
  summedThemeAmountIsUniqueMoneyFlow:false,
  activityIsNotNetMoneyFlow:true,
  verifiedRevenueShareWeightingAvailable:false,
  fullUniverseThemeCoverageRate:null,
  nativeInstitutionalNetMoneyValueTwd:null,
  rotationInference:'INSUFFICIENT_EVIDENCE',
  classificationPITAccepted:false,
  selectedCount:null,zeroPickDay:null,
  strategyScoreImpact:0,frozenD1Written:false,shadowAuthorized:false,
  ordersAuthorized:false,pushAuthorized:false,
  providerGetsAdded:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
export function renderSystem2IndustryThemeOverlapV0_1(result){
 if(!result||result.schemaVersion!=='S2_INDUSTRY_THEME_OVERLAP_V0_1'||
    !HEX.test(result.receiptHash||''))fail('RENDER_CONTRACT_INVALID');
 const lines=[
  '### B. 細產業與跨產業題材（既有研究樣本，非全市場認證）','',
  '**交易日：** '+safe(result.marketDate)+
  '｜**舊研究於本次 A1 母體內：** '+result.researchIssuerInA1ScopeCount+
  '｜**有當時可用研究證據：** '+result.researchIssuerKnownByTCount+
  '｜**因時間不符排除：** '+result.researchIssuerExcludedByTimeCount,
  '**正式完整題材／細產業成員分母：** UNKNOWN；這些成交值僅是已列出研究成員的交易活躍度，非全題材市占、淨流入或營收曝險。',
  '',
  '| 類型 | 題材／細分類 | 研究成員數 | 研究成員成交值 TWD | Top1 集中度 | 漲／跌／平（有報酬） |',
  '|---|---|---:|---:|---:|---|'
 ];
 for(const group of [...result.subindustryGroups,...result.themeGroups]){
  lines.push('| '+group.cohortType+' | '+safe(group.cohortCode)+' | '+
    group.observedResearchMemberCount+' | '+
    (group.observedMemberTradeValueTwd===null?'UNKNOWN':group.observedMemberTradeValueTwd.toFixed(0))+
    ' | '+pct(group.top1MemberConcentration)+' | '+group.up+'/'+group.down+'/'+group.flat+
    '（'+group.knownReturnCount+'/'+group.observedResearchMemberCount+'） |');
 }
 if(!result.themeGroups.length&&!result.subindustryGroups.length)
  lines.push('| — | SOURCE_NOT_READY | 0（研究樣本） | UNKNOWN | UNKNOWN | UNKNOWN |');
 lines.push('','**跨題材重疊：** 多重題材股票 '+
   result.overlappingThemeStockCount+' 檔；題材成員出現次數 '+
   result.themeGrossMemberMembershipCount+'；不同題材總和不得被當作唯一全市場資金。',
  '**題材成交值加總：** '+
  (result.summedThemeMemberGrossTradeValueTwd===null?'UNKNOWN':result.summedThemeMemberGrossTradeValueTwd.toFixed(0))+
  ' TWD；**去重研究成員成交值：** '+
  (result.uniqueObservedThemeMemberGrossTradeValueTwd===null?'UNKNOWN':result.uniqueObservedThemeMemberGrossTradeValueTwd.toFixed(0))+
  ' TWD（均不是淨流入）。',
  '**明確缺口：** 官方全市場普通股、當日分類歷史/PIT、題材完整成員、收入權重、法人、5/20/60 日與 Regime 仍需獨立來源。',
  '**原始產業雷達 hash：** '+result.activityReceiptHash,
  '**跨題材報告 hash：** '+result.receiptHash,'');
 return lines.join('\n');
}
