// Human-readable, bounded DAILY PRELIMINARY observation report.
// Never authorizes orders, Frozen, formally ranked selection or PIT backtest.
import {sha256Hex} from './decision_archive.mjs';
const SHA=/^[a-f0-9]{64}$/i,DATE=/^\d{4}-\d\d-\d\d$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const clean=x=>String(x??'—').replace(/[\r\n|<>]/g,' ').trim().slice(0,90);
function fail(x){throw Error('S2_PRELIMINARY_REPORT_'+x);}
export async function buildPreliminaryUserReportV0_1({receipt}={}){
 if(!receipt||!DATE.test(receipt.marketDate||'')||
    !UTC.test(receipt.observedAtUtc||'')||
    !Number.isFinite(Date.parse(receipt.observedAtUtc))||
    !SHA.test(receipt.receiptHash||''))fail('MISSING_SIGNED_RECEIPT');
 const {receiptHash,...unsigned}=receipt;
 if(await sha256Hex(unsigned)!==receiptHash)fail('SOURCE_HASH_TAMPERED');
 if(receipt.schemaVersion!=='S2_PRELIMINARY_PV_WATCH_V0_2'||
    receipt.watchVersion!=='PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2'||
    receipt.selectedCount!==null||receipt.zeroPickDay!==null||
    receipt.finalSelectionAuthorized!==false||
    receipt.historicalBacktestCertified!==false||
    receipt.frozenWritten!==false||receipt.orderAuthorized!==false||
    receipt.pushAuthorized!==false||
    receipt.ordinaryEquityOnlyUniverseCertified!==false||
    !Array.isArray(receipt.watchlist))
  fail('FORMAL_OR_SECURITY_CLASS_PROMOTION');
 const full=receipt.state==='PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION';
 if(!full&&receipt.state!=='BLOCKED_SOURCE_INCOMPLETE')fail('STATE_UNEXPECTED');
 if(!full&&(receipt.watchlist.length||receipt.preliminaryMatchedCount!==null))
  fail('BLOCKED_WITH_WATCHLIST');
 const local=new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',
  year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',
  hourCycle:'h23'}).format(new Date(receipt.observedAtUtc));
 const lines=[
  '# System 2｜'+receipt.marketDate+' 盤後價量初步觀察',
  '',
  '**官方行情日期：** '+receipt.marketDate+'　**實際產生時間：** '+local+'（台北時間）',
  '**性質：** '+(full?'初步觀察名單，非正式選股':'來源不足，沒有合法觀察名單'),
  '**原始來源 SHA：** '+clean(receipt.originalSourceReceiptHash),
  '**獨立來源稽核 SHA：** '+clean(receipt.independentSourceAuditHash),
  ''
 ];
 if(full){
  const keys=['officialUniverseCount','historyContinuityUsableCount',
   'preliminaryMatchedCount','displayedCount','withheldHistoryCount',
   'anomalyQuarantinedCount','depositaryReceiptQuarantinedCount'];
  if(keys.some(k=>!Number.isSafeInteger(receipt[k])||receipt[k]<0)||
    receipt.displayedCount!==receipt.watchlist.length||
    receipt.watchlist.length>30||
    receipt.preliminaryMatchedCount<receipt.watchlist.length||
    receipt.historyContinuityUsableCount+receipt.withheldHistoryCount+
    receipt.anomalyQuarantinedCount+receipt.depositaryReceiptQuarantinedCount!==
      receipt.officialUniverseCount)
   fail('SOURCE_UNIVERSE_DENOMINATOR_INVALID');
  lines.push('**來源 '+receipt.officialUniverseCount+' 筆；61日可用 '+receipt.historyContinuityUsableCount+
   '；初選條件相符 '+receipt.preliminaryMatchedCount+'；顯示 '+receipt.displayedCount+'。**');
  lines.push('資料不足 '+receipt.withheldHistoryCount+'、原始價異常隔離 '+
    receipt.anomalyQuarantinedCount+'、可識別存託憑證隔離 '+
    receipt.depositaryReceiptQuarantinedCount+'。','','## 觀察候選','','| 顯示順序* | 代號 | 公司名稱 | 市場 | 5交易日原始價變化 | 證據狀態 |',
    '|---:|---|---|---|---:|---|');
  const seen=new Set();
  for(const [i,x] of receipt.watchlist.entries()){
    if(!/^[1-9]\d{3}$/.test(x.symbol||'')||
      !['TWSE','TPEX'].includes(x.market)||
      seen.has(x.market+'|'+x.symbol)||
      x.marketDate!==receipt.marketDate||
      !SHA.test(x.sourceRowHash||'')||
      x.companyActionPitStatus!=='UNKNOWN_NOT_CLEARED'||
      x.instrumentClassPITStatus!==
        'ORDINARY_EQUITY_CLASS_NOT_INDEPENDENTLY_ATTESTED'||
      x.formalStrategyValidity!==null||x.strategyRank!==null||
      x.triggerPrice!==null||x.stop!==null||x.targets!==null||
      x.aboveSma20!==true||x.positiveFiveSessionReturn!==true||
      !Number.isFinite(x.fiveSessionReturnPct)||x.fiveSessionReturnPct<=0)
     fail('WATCHLIST_ROW_UNAUTHORIZED');
    seen.add(x.market+'|'+x.symbol);
    lines.push('| '+(i+1)+' | '+clean(x.symbol)+' | '+clean(x.companyName)+
      ' | '+(x.market==='TWSE'?'上市':'上櫃')+' | +'+
      x.fiveSessionReturnPct.toFixed(2)+'% | 待驗證 |');
  }
 }else{
  lines.push('**來源不完整；不產生觀察候選，也不能宣稱正式選股為零檔。**');
 }
 lines.push('','*顯示順序僅依五交易日原始價變化排列，**不是策略排名、建議買進次序或績效預測**。',
   '所有候選的公司行動歷史 PIT 與普通股證券類別均尚未獨立認證；沒有發現事件不代表沒有公司行動。',
   '禁止把此觀察名單當成正式選股、BUY 推播、回測認證、Frozen 決策或交易指令。','','原始收據雜湊：'+receiptHash,
   'System 1 V8 Formal 與 Cloudflare D1/R2：均未變更。','');
 const markdown=lines.join('\n');
 return Object.freeze({markdown,metadata:{
  schemaVersion:'S2_PRELIMINARY_DAILY_USER_REPORT_V0_1',
  marketDate:receipt.marketDate,observedAtUtc:receipt.observedAtUtc,
  signedSourceReceiptHash:receiptHash,
  reportHash:await sha256Hex(markdown),
  displayedCount:full?receipt.watchlist.length:0,
  finalSelectionAuthorized:false,selectedCount:null,
  backtestCertified:false,frozenWritten:false,
 }});
}
