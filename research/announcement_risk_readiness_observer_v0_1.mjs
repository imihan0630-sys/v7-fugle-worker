export const FORMAL_ANNOUNCEMENT_RISK_RE=/停止交易|重大損失|重整|退票|財報不實/;

function normDate(v){
  const d=String(v??"").replace(/\D/g,"");
  if(d.length===7) return `${Number(d.slice(0,3))+1911}-${d.slice(3,5)}-${d.slice(5,7)}`;
  if(d.length===8) return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
  return null;
}
function symbolOf(row={}){
  return String(row["公司代號"]??row.SecuritiesCompanyCode??"").trim();
}
function titleOf(row={}){
  return String(row["主旨"]??row["主旨 "]??"").trim();
}
function shiftDay(iso,days){
  const t=Date.parse(iso+"T00:00:00Z");
  if(!Number.isFinite(t)) return null;
  return new Date(t+days*86400000).toISOString().slice(0,10);
}

export function classifyFormalAnnouncementTitle(title){
  const text=String(title??"");
  return {
    title:text,
    matched:FORMAL_ANNOUNCEMENT_RISK_RE.test(text),
    lexicalOnly:true
  };
}

export function auditAnnouncementPayload({
  scanDate,
  twsePayload,
  tpexPayload,
  validatedSnapshot=null,
  transportWitness=null
}={}){
  const arrays=Array.isArray(twsePayload)&&Array.isArray(tpexPayload);
  const rows=arrays?[...twsePayload,...tpexPayload]:[];
  const lower=shiftDay(scanDate,-30);
  let validShapeRows=0,recentRows=0,futureRows=0,olderRows=0,riskTitleRows=0;
  const symbols=new Set();
  for(const row of rows){
    const symbol=symbolOf(row), date=normDate(row?.["發言日期"]), title=titleOf(row);
    if(!/^[1-9][0-9]{3}$/.test(symbol)||!date||!title) continue;
    validShapeRows++;
    if(date>scanDate){futureRows++;continue;}
    if(lower&&date<lower){olderRows++;continue;}
    recentRows++;symbols.add(symbol);
    if(FORMAL_ANNOUNCEMENT_RISK_RE.test(title)) riskTitleRows++;
  }
  const sourcesVerified=validatedSnapshot?.sourcesVerified===true;
  const validatedCount=Number.isFinite(Number(validatedSnapshot?.count))?Number(validatedSnapshot.count):null;
  const rawBothEmpty=arrays&&twsePayload.length===0&&tpexPayload.length===0;
  const transportAttested=transportWitness?.twseHttpOk===true&&transportWitness?.tpexHttpOk===true;
  let evidenceState;
  if(!arrays) evidenceState="RAW_PAYLOAD_SHAPE_UNKNOWN";
  else if(!sourcesVerified) evidenceState="SNAPSHOT_NOT_SOURCE_VERIFIED";
  else if(rawBothEmpty) evidenceState=transportAttested
    ?"VERIFIED_EMPTY_WITH_TRANSPORT_WITNESS"
    :"VERIFIED_EMPTY_WITHOUT_PERSISTED_TRANSPORT_WITNESS";
  else evidenceState="VERIFIED_NONEMPTY_PAYLOAD";
  return {
    schemaVersion:"announcement-risk-readiness-observer-v0.1",
    scanDate,
    raw:{twseRows:Array.isArray(twsePayload)?twsePayload.length:null,tpexRows:Array.isArray(tpexPayload)?tpexPayload.length:null,rawBothEmpty,validShapeRows,recentRows,futureRows,olderRows,recentSymbolCount:symbols.size,riskTitleRows},
    snapshot:{sourcesVerified,validatedCount,asOfDate:validatedSnapshot?.asOfDate??null},
    transport:{attested:transportAttested,witness:transportWitness??null},
    evidenceState,
    guards:{
      zeroEventsIsNotAutomaticallySourceFailure:true,
      sourcesVerifiedIsNotPerSymbolCoverage:true,
      titleRegexIsLexicalOnly:true,
      outcomeDataUsed:false,
      formalCoreChanged:false
    }
  };
}
