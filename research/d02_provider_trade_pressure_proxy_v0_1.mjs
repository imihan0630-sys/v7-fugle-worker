
const finite = v => Number.isFinite(Number(v)) ? Number(v) : null;
const isoMs = v => Number.isFinite(Date.parse(v)) ? Date.parse(v) : null;
const microToMs = v => {
  const n=finite(v);
  return n===null?null:Math.trunc(n/1000);
};
const dayTaipei = ms => {
  if(!Number.isFinite(ms)) return null;
  const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(ms));
  const o=Object.fromEntries(p.map(x=>[x.type,x.value]));
  return o.year&&o.month&&o.day?\`\${o.year}-\${o.month}-\${o.day}\`:null;
};

function blocked(reasons=[],extra={}){
  return {
    status:'UNKNOWN_BLOCKED',
    proxyEligible:false,
    trueOfiEligible:false,
    dynamicAbsorptionEligible:false,
    participantIntentEligible:false,
    unknownReasons:[...new Set(reasons)],
    ...extra
  };
}

export function normalizeFuglePressureSnapshot(raw={},fetchedAt){
  const reasons=[];
  const symbol=String(raw?.symbol??'').trim();
  const type=String(raw?.type??'').trim();
  const exchange=String(raw?.exchange??'').trim();
  const date=String(raw?.date??'').slice(0,10);
  const fetchMs=isoMs(fetchedAt);
  const total=raw?.total||{};
  const providerMs=microToMs(total?.time ?? raw?.lastUpdated);
  const tradeVolume=finite(total?.tradeVolume);
  const atBid=finite(total?.tradeVolumeAtBid);
  const atAsk=finite(total?.tradeVolumeAtAsk);
  const transaction=finite(total?.transaction);

  if(!symbol) reasons.push('MISSING_SYMBOL');
  if(!date) reasons.push('MISSING_MARKET_DATE');
  if(!['EQUITY','ODDLOT'].includes(type)) reasons.push('UNSUPPORTED_TICKER_TYPE');
  if(!exchange) reasons.push('MISSING_EXCHANGE');
  if(fetchMs===null) reasons.push('INVALID_FETCHED_AT');
  if(providerMs===null) reasons.push('INVALID_PROVIDER_TIME');
  if(providerMs!==null && date && dayTaipei(providerMs)!==date) reasons.push('PROVIDER_TIME_DATE_MISMATCH');
  if(fetchMs!==null && providerMs!==null && providerMs>fetchMs) reasons.push('PROVIDER_TIME_AFTER_FETCH');
  for(const [k,v] of [['tradeVolume',tradeVolume],['tradeVolumeAtBid',atBid],['tradeVolumeAtAsk',atAsk]]){
    if(v===null || v<0) reasons.push(\`INVALID_\${k.toUpperCase()}\`);
  }
  if(transaction!==null && transaction<0) reasons.push('INVALID_TRANSACTION_COUNT');
  if(raw?.isTrial===true) reasons.push('TRIAL_STATE');

  if(reasons.length) return blocked(reasons,{symbol,type,exchange,marketDate:date,sourceFetchedAt:fetchedAt});

  return {
    status:'NORMALIZED',
    proxyEligible:false,
    trueOfiEligible:false,
    dynamicAbsorptionEligible:false,
    participantIntentEligible:false,
    symbol,type,exchange,marketDate:date,
    sourceFetchedAt:fetchedAt,
    sourceFetchedAtMs:fetchMs,
    providerTimeMs:providerMs,
    providerTime:new Date(providerMs).toISOString(),
    tradeVolume,tradeVolumeAtBid:atBid,tradeVolumeAtAsk:atAsk,
    transaction,
    source:'FUGLE_INTRADAY_QUOTE',
    sourceSemantics:'PROVIDER_INSIDE_OUTSIDE_CUMULATIVE_NOT_TRUE_OFI'
  };
}

export function buildProviderTradePressureProxy(previous,current,{minCoverage=null}={}){
  const reasons=[];
  if(previous?.status!=='NORMALIZED') reasons.push('PREVIOUS_SNAPSHOT_INVALID');
  if(current?.status!=='NORMALIZED') reasons.push('CURRENT_SNAPSHOT_INVALID');
  if(reasons.length) return blocked(reasons);

  for(const k of ['symbol','type','exchange','marketDate']){
    if(previous[k]!==current[k]) reasons.push(\`IDENTITY_MISMATCH_\${k.toUpperCase()}\`);
  }
  if(current.sourceFetchedAtMs<=previous.sourceFetchedAtMs) reasons.push('FETCH_CLOCK_NOT_INCREASING');
  if(current.providerTimeMs<previous.providerTimeMs) reasons.push('PROVIDER_CLOCK_REGRESSION');

  const dTotal=current.tradeVolume-previous.tradeVolume;
  const dBid=current.tradeVolumeAtBid-previous.tradeVolumeAtBid;
  const dAsk=current.tradeVolumeAtAsk-previous.tradeVolumeAtAsk;
  const dTxn=previous.transaction!==null&&current.transaction!==null?current.transaction-previous.transaction:null;

  if(dTotal<0) reasons.push('TRADE_VOLUME_COUNTER_REGRESSION');
  if(dBid<0) reasons.push('AT_BID_COUNTER_REGRESSION');
  if(dAsk<0) reasons.push('AT_ASK_COUNTER_REGRESSION');
  if(dTxn!==null && dTxn<0) reasons.push('TRANSACTION_COUNTER_REGRESSION');

  if(reasons.length) return blocked(reasons,{deltaTradeVolume:dTotal,deltaAtBid:dBid,deltaAtAsk:dAsk,deltaTransaction:dTxn});
  if(dTotal===0) return blocked(['NO_NEW_TRADE_VOLUME'],{deltaTradeVolume:0,deltaAtBid:dBid,deltaAtAsk:dAsk,deltaTransaction:dTxn});

  const classified=dBid+dAsk;
  if(classified>dTotal) return blocked(['CLASSIFIED_VOLUME_EXCEEDS_TOTAL'],{
    deltaTradeVolume:dTotal,deltaAtBid:dBid,deltaAtAsk:dAsk,deltaClassifiedVolume:classified,deltaTransaction:dTxn
  });
  if(classified===0) return blocked(['NO_CLASSIFIED_VOLUME'],{
    deltaTradeVolume:dTotal,deltaAtBid:dBid,deltaAtAsk:dAsk,deltaClassifiedVolume:0,classificationCoverage:0,deltaTransaction:dTxn
  });

  const coverage=classified/dTotal;
  if(Number.isFinite(minCoverage) && coverage<minCoverage) return blocked(['CLASSIFICATION_COVERAGE_BELOW_PREREGISTERED_FLOOR'],{
    deltaTradeVolume:dTotal,deltaAtBid:dBid,deltaAtAsk:dAsk,deltaClassifiedVolume:classified,classificationCoverage:coverage,deltaTransaction:dTxn
  });

  const pressure=(dAsk-dBid)/classified;
  return {
    status:coverage<1?'PASS_PARTIAL_CLASSIFICATION':'PASS',
    proxyEligible:true,
    trueOfiEligible:false,
    dynamicAbsorptionEligible:false,
    participantIntentEligible:false,
    symbol:current.symbol,
    type:current.type,
    exchange:current.exchange,
    marketDate:current.marketDate,
    intervalStartFetchedAt:previous.sourceFetchedAt,
    intervalEndFetchedAt:current.sourceFetchedAt,
    intervalStartProviderTime:previous.providerTime,
    intervalEndProviderTime:current.providerTime,
    deltaTradeVolume:dTotal,
    deltaAtBid:dBid,
    deltaAtAsk:dAsk,
    deltaClassifiedVolume:classified,
    unclassifiedVolume:dTotal-classified,
    classificationCoverage:coverage,
    deltaTransaction:dTxn,
    providerTradePressureProxy:pressure,
    pressureSign:pressure>0?'ASK_SIDE_DOMINANT_PROXY':pressure<0?'BID_SIDE_DOMINANT_PROXY':'BALANCED_PROXY',
    sourceSemantics:'PROVIDER_INSIDE_OUTSIDE_DELTA_NOT_TRUE_OFI',
    unknownReasons:[]
  };
}

export function joinPressureWithPriceResponse(pressureReceipt,{priceStart=null,priceEnd=null}={}){
  if(!pressureReceipt?.proxyEligible) return blocked(['PRESSURE_PROXY_NOT_ELIGIBLE']);
  const a=finite(priceStart),b=finite(priceEnd);
  if(a===null||b===null||a<=0) return blocked(['PRICE_RESPONSE_INPUT_INVALID']);
  const bps=(b/a-1)*10000;
  const p=pressureReceipt.providerTradePressureProxy;
  let observableState='PRESSURE_RESPONSE_MIXED';
  if(p>0 && bps>0) observableState='ASK_PRESSURE_WITH_UP_PROGRESS';
  else if(p>0 && bps<=0) observableState='ASK_PRESSURE_WITH_WEAK_OR_NEGATIVE_PROGRESS';
  else if(p<0 && bps<0) observableState='BID_PRESSURE_WITH_DOWN_PROGRESS';
  else if(p<0 && bps>=0) observableState='BID_PRESSURE_WITH_WEAK_OR_POSITIVE_PROGRESS';
  return {
    status:'PASS',
    proxyEligible:true,
    trueOfiEligible:false,
    dynamicAbsorptionEligible:false,
    participantIntentEligible:false,
    providerTradePressureProxy:p,
    classificationCoverage:pressureReceipt.classificationCoverage,
    priceProgressBps:bps,
    observableState,
    interpretationBoundary:'OBSERVABLE_PRESSURE_RESPONSE_ONLY_NOT_ACCUMULATION_DISTRIBUTION_INTENT'
  };
}
