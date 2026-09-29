// D15 synchronized return-panel contract v0.1 — research-only.
// Provides fail-closed PIT/common-support validation before correlation/covariance/effective-risk diagnostics.
// It does NOT create a corporate-action adjustment engine and does NOT modify Formal behavior.

import crypto from "node:crypto";

function s(v){return String(v??"").trim()}
function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function ms(v){const x=Date.parse(v||"");return Number.isFinite(x)?x:null}
function sha(value){return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex")}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

const ALLOWED_RETURN_SPACES=new Set(["PRICE_INDEX_COMPARABLE","TOTAL_RETURN_COMPARABLE"]);

function validateOrderedUniqueDates(dates){
  if(!Array.isArray(dates)||dates.length<2)return {ok:false,reason:"INSUFFICIENT_COMMON_SUPPORT"};
  let prev="";
  const seen=new Set();
  for(const raw of dates){
    const d=s(raw);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return {ok:false,reason:"INVALID_COMMON_SUPPORT_DATE"};
    if(seen.has(d))return {ok:false,reason:"DUPLICATE_COMMON_SUPPORT_DATE"};
    if(prev&&d<=prev)return {ok:false,reason:"NON_INCREASING_COMMON_SUPPORT"};
    seen.add(d);prev=d;
  }
  return {ok:true,dates:[...dates]};
}

function compareArrays(a,b){
  return a.length===b.length&&a.every((x,i)=>x===b[i]);
}

export function validateSynchronizedReturnPanel(receipt={},opts={}){
  const asOfMs=ms(receipt?.asOf);
  const parentId=s(receipt?.parentDecisionReceiptId);
  const panelVersion=s(receipt?.panelVersion);
  const returnSpace=s(receipt?.returnSpace);
  const commonSupportPolicy=s(receipt?.commonSupportPolicy);
  const selectedSymbols=Array.isArray(receipt?.selectedSymbols)?receipt.selectedSymbols.map(s):[];
  const parentSelectedSymbols=Array.isArray(receipt?.parentSelectedSymbols)?receipt.parentSelectedSymbols.map(s):[];
  const symbols=Array.isArray(receipt?.symbols)?receipt.symbols:[];
  const minimumCloseBars=Number.isInteger(opts.minimumCloseBars)?opts.minimumCloseBars:61;

  if(asOfMs===null||!parentId||!panelVersion)return {status:"UNKNOWN",valid:false,reasons:["MISSING_PARENT_OR_TIME_IDENTITY"]};
  if(!ALLOWED_RETURN_SPACES.has(returnSpace))return {status:"INVALID",valid:false,reasons:["UNAPPROVED_RETURN_SPACE"]};
  if(commonSupportPolicy!=="EXACT_LISTWISE_COMMON_SUPPORT")return {status:"INVALID",valid:false,reasons:["PAIRWISE_OR_UNFROZEN_SUPPORT_PROHIBITED"]};
  if(selectedSymbols.length<2||new Set(selectedSymbols).size!==selectedSymbols.length)return {status:"UNKNOWN",valid:false,reasons:["INVALID_SELECTED_SET"]};
  if(!compareArrays([...selectedSymbols].sort(),[...parentSelectedSymbols].sort()))return {status:"INVALID",valid:false,reasons:["PARENT_SELECTED_SET_MISMATCH"]};

  const support=validateOrderedUniqueDates(receipt?.commonSessions);
  if(!support.ok)return {status:"INVALID",valid:false,reasons:[support.reason]};
  if(support.dates.length<minimumCloseBars)return {status:"INSUFFICIENT_HISTORY",valid:false,reasons:["MINIMUM_COMMON_CLOSE_BARS_NOT_MET"],commonCloseBars:support.dates.length};

  const bySymbol=new Map();
  let constrainedBars=0;
  for(const raw of symbols){
    const symbol=s(raw?.symbol);
    if(!symbol||bySymbol.has(symbol))return {status:"INVALID",valid:false,reasons:["DUPLICATE_OR_MISSING_SYMBOL_RECEIPT"]};
    bySymbol.set(symbol,raw);
  }
  if(!compareArrays([...bySymbol.keys()].sort(),[...selectedSymbols].sort()))return {status:"INVALID",valid:false,reasons:["SYMBOL_RECEIPT_SET_MISMATCH"]};

  const normalized=[];
  for(const symbol of selectedSymbols){
    const item=bySymbol.get(symbol);
    const itemReturnSpace=s(item?.returnSpace);
    if(itemReturnSpace!==returnSpace)return {status:"INVALID",valid:false,reasons:["MIXED_RETURN_SPACE"],symbol};
    if(!s(item?.sourceReceiptId)||!s(item?.sourceHistoryHash)||!s(item?.continuityReceiptId)||!s(item?.symbolSessionContractVersion)||!s(item?.corporateActionRegistryVersion)){
      return {status:"UNKNOWN",valid:false,reasons:["MISSING_SOURCE_CONTINUITY_IDENTITY"],symbol};
    }
    const sourceAvailableAt=ms(item?.sourceAvailableAt);
    if(sourceAvailableAt===null||sourceAvailableAt>asOfMs)return {status:"INVALID",valid:false,reasons:["SOURCE_NOT_KNOWN_BY_ASOF"],symbol};

    const bars=Array.isArray(item?.bars)?item.bars:[];
    const dates=bars.map(b=>s(b?.date));
    if(!compareArrays(dates,support.dates))return {status:"INVALID",valid:false,reasons:["COMMON_SUPPORT_MISMATCH"],symbol};

    const closes=[];
    for(const bar of bars){
      const close=n(bar?.close);
      const availableAt=ms(bar?.availableAt);
      if(!(close>0))return {status:"INVALID",valid:false,reasons:["INVALID_CLOSE"],symbol,date:s(bar?.date)};
      if(availableAt===null||availableAt>asOfMs)return {status:"INVALID",valid:false,reasons:["BAR_NOT_KNOWN_BY_ASOF"],symbol,date:s(bar?.date)};
      if(bar?.symbolSessionVerified!==true)return {status:"UNKNOWN",valid:false,reasons:["SYMBOL_SESSION_NOT_VERIFIED"],symbol,date:s(bar?.date)};
      if(bar?.corporateActionContinuityResolved!==true)return {status:"UNKNOWN",valid:false,reasons:["CORPORATE_ACTION_CONTINUITY_UNRESOLVED"],symbol,date:s(bar?.date)};
      if(bar?.pseudoBar===true)return {status:"INVALID",valid:false,reasons:["PSEUDO_BAR_PROHIBITED"],symbol,date:s(bar?.date)};
      if(!s(bar?.sourceBarHash))return {status:"UNKNOWN",valid:false,reasons:["MISSING_SOURCE_BAR_HASH"],symbol,date:s(bar?.date)};
      if(bar?.priceLimitConstrained===true)constrainedBars+=1;
      closes.push(close);
    }

    const logReturns=[];
    for(let i=1;i<closes.length;i++)logReturns.push(Math.log(closes[i]/closes[i-1]));
    normalized.push({
      symbol,
      closes,
      logReturns,
      sourceReceiptId:s(item.sourceReceiptId),
      continuityReceiptId:s(item.continuityReceiptId),
      sourceHistoryHash:s(item.sourceHistoryHash)
    });
  }

  const identity={
    parentDecisionReceiptId:parentId,
    asOf:receipt.asOf,
    panelVersion,
    returnSpace,
    commonSupportPolicy,
    selectedSymbols:[...selectedSymbols],
    commonSessions:[...support.dates],
    sources:normalized.map(x=>({
      symbol:x.symbol,
      sourceReceiptId:x.sourceReceiptId,
      continuityReceiptId:x.continuityReceiptId,
      sourceHistoryHash:x.sourceHistoryHash
    }))
  };

  return {
    status:constrainedBars>0?"VALID_CONSTRAINED":"VALID",
    valid:true,
    researchOnly:true,
    decisionImpact:false,
    panelId:sha(identity),
    parentDecisionReceiptId:parentId,
    asOf:receipt.asOf,
    panelVersion,
    returnSpace,
    commonSupportPolicy,
    commonCloseBars:support.dates.length,
    synchronizedReturnObservations:support.dates.length-1,
    constrainedBars,
    symbols:normalized,
    semanticFirewall:"Exact listwise common support only. No pairwise deletion, zero-return imputation, raw corporate-action crossing, mixed return spaces, or backdated source availability."
  };
}

export function sampleRiskDiagnostics(validatedPanel={}){
  if(validatedPanel?.valid!==true)return {status:"UNKNOWN",reason:"PANEL_NOT_VALID"};
  const series=validatedPanel.symbols||[];
  const p=series.length;
  const nObs=validatedPanel.synchronizedReturnObservations;
  if(p<2||!Number.isInteger(nObs)||nObs<2)return {status:"UNKNOWN",reason:"INSUFFICIENT_PANEL"};
  if(series.some(x=>x.logReturns.length!==nObs))return {status:"UNKNOWN",reason:"RETURN_LENGTH_MISMATCH"};

  const means=series.map(x=>x.logReturns.reduce((a,b)=>a+b,0)/nObs);
  const covariance=Array.from({length:p},()=>Array(p).fill(0));
  for(let i=0;i<p;i++){
    for(let j=i;j<p;j++){
      let sum=0;
      for(let k=0;k<nObs;k++)sum+=(series[i].logReturns[k]-means[i])*(series[j].logReturns[k]-means[j]);
      const v=sum/(nObs-1);
      covariance[i][j]=v;covariance[j][i]=v;
    }
  }
  const stdev=covariance.map((row,i)=>Math.sqrt(Math.max(0,row[i])));
  const correlation=Array.from({length:p},(_,i)=>Array.from({length:p},(_,j)=>{
    const den=stdev[i]*stdev[j];
    return den>0?covariance[i][j]/den:(i===j?1:null);
  }));

  return {
    status:"READY_SAMPLE_DIAGNOSTICS",
    researchOnly:true,
    decisionImpact:false,
    panelId:validatedPanel.panelId,
    symbols:series.map(x=>x.symbol),
    observations:nObs,
    sampleMeanLogReturn:Object.fromEntries(series.map((x,i)=>[x.symbol,round(means[i],12)])),
    sampleVolatility:Object.fromEntries(series.map((x,i)=>[x.symbol,round(stdev[i],12)])),
    covariance:covariance.map(row=>row.map(v=>round(v,12))),
    correlation:correlation.map(row=>row.map(v=>v===null?null:round(v,10))),
    caveat:"Transparent sample baseline only. Shrinkage, clustering, downside dependence, eigen diagnostics and Effective Bets require separate preregistered estimators and stability tests."
  };
}
