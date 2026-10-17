// System2 Scheme C BUILD display-only. Source authenticity is checked by the
// signed handoff receipt; this renderer never ranks, places orders, or writes D1.
import {sha256Hex} from './decision_archive.mjs';
const HASH=/^[0-9a-f]{64}$/i,DATE=/^\d{4}-\d{2}-\d{2}$/;
const UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const isDay=x=>typeof x==='string'&&DATE.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const isUtc=x=>typeof x==='string'&&UTC.test(x)&&Number.isFinite(Date.parse(x));
const clean=x=>String(x??'—').replace(/[\r\n|<>\t]/g,' ').trim().slice(0,90);
const taipei=x=>isUtc(x)?new Intl.DateTimeFormat('zh-TW',{
 timeZone:'Asia/Taipei',hourCycle:'h23',
 year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'
}).format(new Date(x)):'未知';
const deny=x=>{throw Error('S2_SCHEME_C_DAILY_REPORT_'+x);};
const unsigned=(x,k)=>Object.fromEntries(Object.entries(x).filter(([n])=>n!==k));
const STATES=new Set(['NON_PIT_SOURCE_OBSERVATION_READY',
 'PRELIMINARY_SOURCE_NOT_READY','INDEPENDENT_SOURCE_INCOMPLETE']);

export async function buildSchemeCDailyVisibleReportV0_1({handoff}={}){
 const h=handoff;
 if(!h||typeof h!=='object'||Array.isArray(h)||
    h.schemaVersion!=='S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1'||
    !HASH.test(h.receiptHash||'')||
    await sha256Hex(unsigned(h,'receiptHash'))!==h.receiptHash)
  deny('SIGNED_HANDOFF_NOT_VERIFIED');
 if(!STATES.has(h.state)||!isDay(h.marketDate)||
    !Number.isSafeInteger(h.auditRunId)||h.auditRunId<=0||
    !isUtc(h.auditedAtUtc)||!HASH.test(h.originalSourceReceiptHash||'')||
    !HASH.test(h.independentSourceAuditHash||'')||
    h.pitACertificationGranted!==false||h.pitBCertificationGranted!==false||
    h.fullMarketOrdinaryShareCount!==null||
    h.selectedCount!==null||h.zeroPickDay!==null||
    h.shadowAuthorized!==false||h.realStrategyRankAuthorized!==false||
    h.frozenD1Written!==false||h.pushAuthorized!==false||
    h.ordersAuthorized!==false||h.cloudflareD1Writes!==0||
    h.cloudflareR2Writes!==0||h.system1FormalCoreChanged!==false)
  deny('AUTHORITY_OR_SOURCE_INVALID');
 const ready=h.state==='NON_PIT_SOURCE_OBSERVATION_READY';
 const p=h.previewReport;
 if((ready&&!p)||(!ready&&(p!==null||
    h.observedPreviewCount!==null||h.descriptiveSourceMatches!==null)))
  deny('SOURCE_READINESS_CONTRADICTION');
 if(ready&&(
    p.schemaVersion!=='S2_THREE_LAYER_SELECTION_V0_1'||
    !HASH.test(p.receiptHash||'')||
    await sha256Hex(unsigned(p,'receiptHash'))!==p.receiptHash||
    p.requestedLayer!=='NON_PIT_PREVIEW'||
    !['SOURCE_BOUNDED_NON_PIT_PREVIEW','LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY'].includes(p.state)||
    p.marketDate!==h.marketDate||
    p.sourceOriginalReceiptHash!==h.originalSourceReceiptHash||
    p.sourceAuditHashNotStrategyPIT!==h.independentSourceAuditHash||
    p.sourcePreliminaryReceiptHash!==h.previewReceiptHash||
    p.previewAuthority!==true||
    p.pitACertificationGranted!==false||p.pitBCertificationGranted!==false||
    p.frozenD1Written!==false||p.ordersAuthorized!==false||
    p.pushAuthorized!==false||p.strategySelectedCount!==null||
    p.certifiedZeroPickDay!==null||p.ordinaryEquityUniverseCertified!==false||
    !isUtc(p.originalObservedAtUtc)||
    !Number.isSafeInteger(p.sourceUniverseCount)||p.sourceUniverseCount<=0||
    !Number.isSafeInteger(p.preliminarySourceMatchedCount)||
    p.preliminarySourceMatchedCount<0||p.preliminarySourceMatchedCount>p.sourceUniverseCount||
    !Number.isSafeInteger(h.descriptiveSourceMatches)||
    !Number.isSafeInteger(h.observedPreviewCount)||
    p.preliminarySourceMatchedCount!==h.descriptiveSourceMatches||
    p.displayedPreviewCount!==h.observedPreviewCount||
    !Array.isArray(p.previewRows)||p.previewRows.length!==h.observedPreviewCount||
    p.previewRows.length>30))
  deny('PREVIEW_HASH_LINEAGE_OR_COUNTER_INVALID');
 const lines=[
  '# System 2｜'+h.marketDate+' 非 PIT 研究預覽',
  '',
  '**來源交易日：** '+h.marketDate,
  '**獨立來源稽核時間：** '+taipei(h.auditedAtUtc)+'（台北時間）',
  '**報告性質：** 研究觀察，非正式選股或買賣／放空建議。',
  '**來源 SHA：** '+h.originalSourceReceiptHash,
  '**獨立稽核 SHA：** '+h.independentSourceAuditHash,
  '**稽核 Run：** '+h.auditRunId,
  ''
 ];
 if(!ready){
  if(!Array.isArray(h.blockers)||h.blockers.length===0||
     h.blockers.some(s=>typeof s!=='string'||s.length>140))
    deny('BLOCKED_REASON_MISSING');
  lines.push('## SOURCE_NOT_READY：沒有合法預覽來源','',
    '資料不完整或尚未完成稽核，**不得宣稱正式選股為零檔**。',
    '**缺漏原因：** '+h.blockers.map(clean).join('；'),'',
    '也不得把前一交易日的研究名單假裝成今天的結果。');
 }else{
  const late=p.state==='LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY';
  lines.push(
   '**實際預覽觀察時間：** '+taipei(p.originalObservedAtUtc)+'（台北時間）',
   '**資料時效：** '+(late?'**LATE_SOURCE：延後取得，只能作描述性回顧；不能倒填交易日截止決策或前瞻績效。**':
   '來源在預覽截止範圍內，但 PIT-A 與 Forward 績效都尚未認證。'),
   '**原始四碼證券：** '+p.sourceUniverseCount+'（不是經獨立驗證的全市場普通股數）',
   '**描述性價量條件相符：** '+p.preliminarySourceMatchedCount,
   '**顯示觀察：** '+h.observedPreviewCount,
   '',
   '## 來源限定的觀察名單','',
   '| 顯示順序* | 代號 | 名稱 | 市場 | 5日原始價變化 | 研究狀態 | 風險與證據 |',
   '|---:|---|---|---|---:|---|---|'
  );
  const seen=new Set();
  for(const [i,row] of p.previewRows.entries()){
   if(!row||row.previewDisplayOrder!==i+1||
      !/^[1-9]\d{3}$/.test(row.symbol||'')||
      !['TWSE','TPEX'].includes(row.market)||row.marketDate!==h.marketDate||
      !HASH.test(row.sourceRowHash||'')||
      !Number.isFinite(row.descriptiveRawFiveSessionReturnPct)||
      row.descriptiveRawFiveSessionReturnPct<=0||
      row.priceAboveRawSma20!==true||
      !['RESEARCH_OBSERVATION_ONLY','CA_OR_CLOCK_REVIEW_HOLD'].includes(row.status)||
      !Array.isArray(row.warnings)||
      row.warnings.some(x=>typeof x!=='string')||
      row.formalStrategyScore!==null||row.formalStrategyRank!==null||
      row.previewIsTradeRecommendation!==false||
      row.entryPrice!==null||row.stop!==null||row.targets!==null)
    deny('PREVIEW_ROW_NOT_SAFE');
   const key=row.market+'|'+row.symbol;
   if(seen.has(key))deny('DUPLICATE_STOCK');
   seen.add(key);
   const notices=[];
   if(row.warnings.includes('KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED'))
    notices.push('已知公司行動，價位待查');
   if(row.warnings.includes('LATE_DISCOVERED_CA_EVENT_NOT_BACKDATED'))
    notices.push('事後事件不可倒填');
   if(row.warnings.includes('ORDINARY_SHARE_CLASS_NOT_INDEPENDENTLY_CERTIFIED'))
    notices.push('普通股資格未核准');
   if(row.warnings.includes('COMPANY_ACTION_PIT_NOT_CLEARED'))
    notices.push('CA PIT 未核准');
   if(row.warnings.includes('MARKET_REGIME_NOT_CERTIFIED'))
    notices.push('市場 Regime 未核准');
   if(row.warnings.includes('ORIGINAL_PREVIEW_OBSERVED_AFTER_REQUESTED_CUT'))
    notices.push('晚於原截止');
   const hold=row.status==='CA_OR_CLOCK_REVIEW_HOLD';
   if(hold)notices.unshift('暫緩解讀');
   lines.push('| '+(i+1)+' | '+clean(row.symbol)+' | '+
      clean(row.companyName)+' | '+(row.market==='TWSE'?'上市':'上櫃')+
      ' | +'+row.descriptiveRawFiveSessionReturnPct.toFixed(2)+'% | '+
      (hold?'資料／事件待查':'價量初步觀察')+' | '+notices.map(clean).join('；')+' |');
  }
  if(h.observedPreviewCount===0)
   lines.push('','本日無顯示中的描述性觀察，不代表正式策略選股零檔。');
  lines.push('','**觀察理由：** 使用既有61交易日原始行情，收盤價在20日原始收盤均線上方、最近5交易日原始價正向，當日量額均大於0；這些不是經 PIT 認證的完整多策略評分。',
   '**公司行動：** 原始價格可能受除權息影響；已知事件要另行核對，未知不代表 NO_EVENT。',
   '**顯示順序*：** 僅依五交易日原始價變化排列，不是正式選股排名或建議進場順位。');
 }
 lines.push('','','---','**三層狀態：** NON_PIT_PREVIEW 僅供研究；PIT-A 未核准；PIT-B 未核准。',
  '**不代表：** BUY、SHORT、trigger、stop、target、正式 Top6、Frozen/Shadow、真實績效或零入選。',
  '**系統隔離：** 不改 System 1 V8 Formal、Cloudflare D1/R2、正式 Cron、監控或推播。',
  '**交接收據 SHA：** '+h.receiptHash,'');
 const markdown=lines.join('\n');
 return Object.freeze({markdown,metadata:Object.freeze({
  schemaVersion:'S2_SCHEME_C_DAILY_VISIBLE_REPORT_V0_1',
  marketDate:h.marketDate,handoffReceiptHash:h.receiptHash,
  sourceAuditRunId:h.auditRunId,sourceReady:ready,
  lateSource:ready?p.state==='LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY':null,
  displayedCount:ready?h.observedPreviewCount:null,
  strategySelectedCount:null,zeroPickDay:null,
  pitACertified:false,pitBCertified:false,frozenWritten:false,
  ordersAuthorized:false,pushAuthorized:false,
  reportHash:await sha256Hex(markdown)
 })});
}