// System 2 BUILD Class A. Research-only 1-day ACTIVITY, not money inflow.
// This consumes DATA's native source-only B5 handoff and already-observed A1
// rows. No provider GET, D1/R2, Cron, scoring, rank, Frozen or trade.
import {sha256Hex} from './decision_archive.mjs';
import {inspectDataB5OriginalScopeForBuildV0_1} from './industry_b5_data_scope_bridge_v0_1.mjs';
const HASH=/^[0-9a-f]{64}$/i;
const ISO=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const fail=x=>{throw Error('S2_INDUSTRY_ACTIVITY_'+x)};
const okTime=x=>typeof x==='string'&&ISO.test(x)&&Number.isFinite(Date.parse(x));
const okDay=x=>typeof x==='string'&&DAY.test(x)&&!Number.isNaN(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const clean=x=>String(x??'UNKNOWN').replace(/[|<>\r\n\t]/g,' ').slice(0,75);
const id=x=>x.market+'|'+x.symbol;
const sum=xs=>xs.reduce((a,b)=>a+b,0);
const ratio=(n,d)=>d>0?n/d:null;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const value=x=>x===null||finite(x);
const classify=x=>x==='CURRENT_PROFILE_SOURCE_ONLY';
function aggregate(members,denom){
 const valid=members.filter(x=>finite(x.tradeValueTwd));
 const values=valid.map(x=>x.tradeValueTwd);
 const complete=valid.length===members.length;
 const total=complete?sum(values):null;
 const sorted=[...values].sort((a,b)=>b-a);
 const good=members.filter(x=>finite(x.returnPercent));
 const up=good.filter(x=>x.returnPercent>0).length;
 const down=good.filter(x=>x.returnPercent<0).length;
 const flat=good.length-up-down;
 const fullReturns=good.length===members.length;
 return {
  memberCount:members.length,turnoverKnownCount:valid.length,
  turnoverMissingCount:members.length-valid.length,
  observedPartialTradeValueTwd:sum(values),
  tradeValueTwd:total,
  tradeValueShareWithinObservedFourDigitScope:complete&&finite(denom)?ratio(total,denom):null,
  officialOrdinaryShareMarketTurnoverShare:null,
  top1Concentration:complete?ratio(sorted[0]||0,total):null,
  top3Concentration:complete?ratio(sum(sorted.slice(0,3)),total):null,
  dailyReturnKnownCount:good.length,
  dailyReturnMissingCount:members.length-good.length,
  up,down,flat,
  upShareOfKnownReturns:ratio(up,good.length),
  equalWeightedReturnPercent:fullReturns?ratio(sum(good.map(x=>x.returnPercent)),good.length):null,
  turnoverWeightedReturnPercent:fullReturns&&complete&&total>0?
    sum(members.map(x=>x.returnPercent*x.tradeValueTwd))/total:null,
  institutionalForeignNet:null,institutionalTrustNet:null,institutionalDealerNet:null,
  institutionalTotalNet:null,institutionalNetUnit:'UNKNOWN',
  activityVs5:null,activityVs20:null,activityVs60:null,
  activityShareDailyDelta:null,
  rotationInference:'INSUFFICIENT_EVIDENCE',
  rotationReason:'No independently checked historical comparable member set, institution flow, or regime',
  sourceOnly:true
 };
}
/**
 * Strict diagnostic on the four-digit A1 original-instrument scope.
 * IMPORTANT: current B5 native labels are not independent current B5/PIT
 * certification, and 4-digit scope is NOT a validated ordinary-share universe.
 * Even complete synthetic input cannot become a real full-market radar.
 */
export async function buildSystem2IndustryActivityRadarV0_1({
 marketDate,observedAtUtc,generatedAtUtc,a1OriginalReceiptHash,
 dataB5ScopeReceipt,sourceUniverse,dailyRows=[]
}={}){
 if(!okDay(marketDate)||!okTime(observedAtUtc)||!okTime(generatedAtUtc)||
   Date.parse(generatedAtUtc)<Date.parse(observedAtUtc)||
   !HASH.test(a1OriginalReceiptHash||''))
    fail('TIME_OR_SOURCE_RECEIPT_REQUIRED');
 const b5=inspectDataB5OriginalScopeForBuildV0_1({
  dataReceipt:dataB5ScopeReceipt,sourceUniverse,marketDate
 });
 if(a1OriginalReceiptHash!==dataB5ScopeReceipt.a1SourceReceiptHash)
   fail('A1_SOURCE_HASH_MISMATCH');
 if(!Array.isArray(dailyRows))fail('DAILY_ROWS_INVALID');
 const sourceIds=new Set(sourceUniverse.map(id));
 const bars=new Map();
 for(const row of dailyRows){
  const k=id(row);
  if(!sourceIds.has(k)||bars.has(k)||row.marketDate!==marketDate||
     !value(row.tradeValueTwd)||!value(row.volumeShares)||
     (finite(row.tradeValueTwd)&&row.tradeValueTwd<0)||
     (finite(row.volumeShares)&&row.volumeShares<0)||
     !value(row.closePrice)||!value(row.priorClosePrice)||
     (finite(row.closePrice)&&row.closePrice<=0)||
     (finite(row.priorClosePrice)&&row.priorClosePrice<=0)||
     !HASH.test(row.sourceRowHash||''))
     fail('DAILY_ROW_SCOPE_OR_UNIT_INVALID');
  bars.set(k,row);
 }
 const all=sourceUniverse.map(x=>{
  const bar=bars.get(id(x))||null;
  const classified=dataB5ScopeReceipt.mapping.find(y=>id(y)===id(x));
  const industry=classify(classified.currentIndustryState)?
    classified.officialIndustryRawValue:null;
  return {
   market:x.market,symbol:x.symbol,marketDate,
   rawIndustry:industry,
   industrySourceState:classified.currentIndustryState,
   sourceRowHash:bar?.sourceRowHash??null,
   tradeValueTwd:bar?.tradeValueTwd??null,
   volumeShares:bar?.volumeShares??null,
   returnPercent:bar&&finite(bar.closePrice)&&finite(bar.priorClosePrice)?
    (bar.closePrice/bar.priorClosePrice-1)*100:null,
   ordinaryShareClassIndependentlyCertified:false,
   currentIndustryIndependentlyCertified:false,
   industryHistoricalPITCertified:false
  };
 });
 const allTurnoverKnown=all.every(x=>finite(x.tradeValueTwd));
 const observedTotal=allTurnoverKnown?sum(all.map(x=>x.tradeValueTwd)):null;
 const groups=new Map();
 for(const row of all){
  if(!row.rawIndustry)continue;
  const k=row.market+'|'+row.rawIndustry;
  if(!groups.has(k))groups.set(k,[]);
  groups.get(k).push(row);
 }
 const mainIndustries=[...groups.entries()].map(([k,rows])=>({
  industryKey:k,market:rows[0].market,
  industryRawValue:rows[0].rawIndustry,
  classificationAuthority:'B5_NATIVE_SOURCE_ONLY_NOT_INDEPENDENTLY_AUDITED',
  ...aggregate(rows,observedTotal)
 })).sort((a,b)=>a.industryKey.localeCompare(b.industryKey));
 const markets=['TWSE','TPEX'].map(m=>{
  const r=all.filter(x=>x.market===m);
  const classified=r.filter(x=>x.rawIndustry);
  const s=dataB5ScopeReceipt.summaries.find(x=>x.market===m);
  return {
   market:m,fourDigitInstrumentCount:r.length,
   dailyBarRowCount:r.filter(x=>x.sourceRowHash!==null).length,
   dailyBarMissingCount:r.filter(x=>x.sourceRowHash===null).length,
   b5SourceOnlyMappedCount:classified.length,
   b5SourceUnknownCount:s.unknown,
   b5SourceConflictCount:s.conflict,
   independentlyCertifiedOrdinaryShareCount:null,
   independentlyCertifiedOfficialIndustryCount:null,
   provisionalInstrumentCoverage:ratio(classified.length,r.length)
  };
 });
 const dateCutUtc=marketDate+'T15:45:00Z';
 const late=Date.parse(observedAtUtc)>Date.parse(dateCutUtc)||
   b5.sourceLateAtEvaluation;
 const base={
  schemaVersion:'S2_INDUSTRY_ACTIVITY_ROTATION_RADAR_V0_1',
  marketDate,observedAtUtc,generatedAtUtc,dateCutUtc,
  state:all.length&&allTurnoverKnown?'SOURCE_ONLY_PARTIAL':'SOURCE_NOT_READY',
  lateRelativeToReferenceCut:late,
  sourceEvidenceLevel:'CALLER_BOUND_A1_AND_B5_SOURCE_ONLY_NO_INDEPENDENT_NATIVE_READBACK',
  a1OriginalReceiptHash,b5SourceScopeReceiptHash:dataB5ScopeReceipt.receiptHash,
  fourDigitInstrumentUniverseCount:all.length,
  actualDailyBarRows:dailyRows.length,
  missingDailyBarRows:all.length-dailyRows.length,
  perMarket:markets,
  observedFourDigitScopeTradeValueTwd:observedTotal,
  officialOrdinaryShareMarketTradeValueTwd:null,
  actualOfficialMainIndustryCoverageRate:null,
  officialOrdinaryShareDenominator:null,
  sourceOnlyIndustryCount:mainIndustries.length,
  mainIndustries,
  subindustryGroups:[],
  themeGroups:[],
  crossThemeOverlapCount:null,
  currentClassificationCoverageState:'SOURCE_ONLY_NOT_INDEPENDENT_B5',
  classificationPITAccepted:false,
  sessionHistory:{1:allTurnoverKnown?1:0,5:0,20:0,60:0},
  institutionNetAmountTwd:null,
  institutionNetAmountUnit:'UNKNOWN',
  inferredRotationState:'INSUFFICIENT_EVIDENCE',
  caveats:[
   'TURNOVER_IS_GROSS_ACTIVITY_NOT_NET_CAPITAL_INFLOW',
   'FOUR_DIGIT_INSTRUMENTS_NOT_CERTIFIED_ORDINARY_SHARES',
   'OFFICIAL_B5_NATIVE_ORIGINAL_INDEPENDENT_AUDIT_NOT_YET_BOUND',
   'CURRENT_PROFILE_NOT_HISTORICAL_PIT',
   'NO_VERIFIED_INSTITUTION_HISTORY_OR_REGIME',
   'NO_VALIDATED_SUBINDUSTRY_OR_THEME_MEMBERSHIP',
   ...(late?['SOURCE_AFTER_T2345_RESEARCH_REFERENCE_CUT'] :[]),
   ...(!allTurnoverKnown?['SOURCE_ROWS_OR_TRADE_VALUE_INCOMPLETE']:[])
  ],
  thresholdBasedStateActivated:false,
  strategyScoreImpact:0,
  realStrategyRankAuthorized:false,
  selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,shadowAuthorized:false,
  ordersAuthorized:false,pushAuthorized:false,
  providerGetsAdded:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
export function renderSystem2IndustryActivityRadarV0_1(r){
 if(!r||r.schemaVersion!=='S2_INDUSTRY_ACTIVITY_ROTATION_RADAR_V0_1'||
  !HASH.test(r.receiptHash||''))fail('RENDER_RECEIPT_INVALID');
 const out=[
  '## 產業資金輪動雷達（SOURCE ONLY；Class A）','',
  '**交易日：** '+clean(r.marketDate)+'｜**來源觀察：** '+clean(r.observedAtUtc)+
  '｜**產生：** '+clean(r.generatedAtUtc),
  '**狀態：** '+r.state+(r.lateRelativeToReferenceCut?'｜晚於 T23:45 參考截止':''),
  '**定義：** 成交值＝雙邊撮合交易活躍度，並非淨買超／淨資金流入。',
  '**母體：** 四碼證券 '+r.fourDigitInstrumentUniverseCount+
  '；逐股價量 '+r.actualDailyBarRows+'/'+r.fourDigitInstrumentUniverseCount+
  '；普通股認證分母 UNKNOWN；當日 B5 官方獨立認證 UNKNOWN。','',
  '### A. 主產業成交活躍度（非正式全市場排行）','',
  '| 市場 | 原始產業值 | 成員 | 成交值（元） | 觀察四碼母體占比 | 上漲／下跌／持平（有價差者） | Top1 / Top3 |',
  '|---|---|---:|---:|---:|---|---|'
 ];
 for(const x of r.mainIndustries){
  const pct=n=>n===null?'UNKNOWN':(n*100).toFixed(1)+'%';
  out.push('| '+clean(x.market)+' | '+clean(x.industryRawValue)+
   ' | '+x.memberCount+' | '+(x.tradeValueTwd===null?'UNKNOWN':x.tradeValueTwd.toFixed(0))+
   ' | '+pct(x.tradeValueShareWithinObservedFourDigitScope)+
   ' | '+x.up+'/'+x.down+'/'+x.flat+'（'+x.dailyReturnKnownCount+'/'+x.memberCount+'）'+
   ' | '+pct(x.top1Concentration)+' / '+pct(x.top3Concentration)+' |');
 }
 if(!r.mainIndustries.length)out.push('| — | SOURCE_NOT_READY | — | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |');
 out.push('','### B. 細產業及跨題材','',
  'SOURCE_NOT_READY：尚無經獨立驗證、適用本交易日的完整多對多細分類／題材成員及營收曝險分母，不推算題材總淨流入。','',
  '### C. 輪動線索與法人','',
  'ROTATION_INFERENCE = INSUFFICIENT_EVIDENCE；法人買賣超 UNKNOWN；5／20／60 日有效歷史不足。不得以單日成交熱度推論跨產業資金轉帳。','',
  '### D. 相關個股','',
  '需等待當日原始逐股類別、細產業與供應鏈獨立來源證據；目前不發出正式股票強弱排行或買賣訊號。','',
  '**研究來源識別：** '+r.a1OriginalReceiptHash+'｜B5 SOURCE ONLY：'+r.b5SourceScopeReceiptHash,
  '**本次報告 SHA：** '+r.receiptHash,'');
 return out.join('\n');
}
