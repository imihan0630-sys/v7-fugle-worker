function finite(v){return Number.isFinite(Number(v))?Number(v):null}
function pct(n,d){return d>0?Math.round(n/d*10000)/100:null}
function assertDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s||''))) throw new Error('INVALID_SCAN_DATE')}

export function buildAboveMaBreadthReceipt({scanDate,classificationSchemeId,members,features,candidateSymbol=null,windows=[20,60]}){
  assertDate(scanDate);
  if(!classificationSchemeId) throw new Error('CLASSIFICATION_SCHEME_REQUIRED');
  if(!Array.isArray(members)||!Array.isArray(features)) throw new Error('ARRAY_INPUT_REQUIRED');
  const seen=new Set();
  for(const m of members){
    const s=String(m?.symbol||'');
    if(!s) throw new Error('MEMBER_SYMBOL_REQUIRED');
    if(seen.has(s)) throw new Error('DUPLICATE_MEMBER_SYMBOL:'+s);
    seen.add(s);
    if(!m?.industry) throw new Error('MEMBER_INDUSTRY_REQUIRED:'+s);
  }
  const fmap=new Map(features.map(f=>[String(f?.symbol||''),f]));
  const groups={};
  for(const m of members)(groups[m.industry]??=[]).push(m);
  const sectors={};
  for(const [industry,group] of Object.entries(groups)){
    const byWindow={};
    for(const w of windows){
      let ready=0,pass=0;
      for(const m of group){
        const f=fmap.get(String(m.symbol));
        const close=finite(f?.close), ma=finite(f?.['ma'+w]), days=finite(f?.historyDays);
        const ok=f?.historyAdmissionUsable===true && close!==null && ma!==null && ma>0 && days!==null && days>=w;
        if(ok){ready++; if(close>ma)pass++;}
      }
      const membershipN=group.length,unknown=membershipN-ready;
      const out={windowTradingDays:w,membershipN,historyReadyN:ready,unknownHistoryN:unknown,passN:pass,
        aboveMaPct:ready?pct(pass,ready):null,coveragePct:pct(ready,membershipN),
        lowerBoundPct:pct(pass,membershipN),upperBoundPct:pct(pass+unknown,membershipN),
        state:ready===0?'UNKNOWN_NO_HISTORY_READY':(unknown>0?'PARTIAL_COVERAGE':'KNOWN')};
      if(candidateSymbol && group.some(m=>String(m.symbol)===String(candidateSymbol))){
        const others=group.filter(m=>String(m.symbol)!==String(candidateSymbol));
        let r2=0,p2=0;
        for(const m of others){
          const f=fmap.get(String(m.symbol));
          const close=finite(f?.close),ma=finite(f?.['ma'+w]),days=finite(f?.historyDays);
          const ok=f?.historyAdmissionUsable===true && close!==null && ma!==null && ma>0 && days!==null && days>=w;
          if(ok){r2++;if(close>ma)p2++;}
        }
        const n2=others.length,u2=n2-r2;
        out.leaveOneOut={candidateSymbol:String(candidateSymbol),membershipN:n2,historyReadyN:r2,unknownHistoryN:u2,passN:p2,
          aboveMaPct:r2?pct(p2,r2):null,coveragePct:n2?pct(r2,n2):null,
          lowerBoundPct:n2?pct(p2,n2):null,upperBoundPct:n2?pct(p2+u2,n2):null,
          state:r2===0?'UNKNOWN_NO_HISTORY_READY':(u2>0?'PARTIAL_COVERAGE':'KNOWN')};
      }
      byWindow[String(w)]=out;
    }
    sectors[industry]={industry,membershipN:group.length,windows:byWindow};
  }
  return {schemaVersion:'ABOVE_MA_BREADTH_RECEIPT_V0_1',researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    scanDate,classificationSchemeId,candidateSymbol:candidateSymbol?String(candidateSymbol):null,windows:[...windows],sectors};
}
