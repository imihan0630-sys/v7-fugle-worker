// Pure, read-only reconciliation for display snapshots. Does NOT authorize
// business signals, order execution, plan persistence, or a Cron success receipt.
const validMs=x=>{
  const n=Date.parse(String(x?.generatedAtIso||""));
  return Number.isFinite(n)?n:null;
};
const symbolSet=list=>{
  if(!Array.isArray(list))return null;
  // Mirror protected V8.10 aideenMonitorIdentity: same ticker in separate
  // independent pools is not a duplicate monitoring identity.
  const identities=list.map(x=>{
    const symbol=String(x?.symbol||x?.plan?.symbol||x?.code||"").trim();
    const pool=String(x?.strategyPool||x?.plan?.strategyPool||"FORMAL").trim();
    return symbol&&pool?pool+":"+symbol:"";
  });
  const set=new Set(identities);
  return set.size===identities.length&&identities.every(Boolean)?set:null;
};
const samePopulation=(snapshot,planned)=>{
  const expected=symbolSet(planned);
  const actual=symbolSet(snapshot?.results);
  if(!expected||!actual||expected.size!==actual.size)return false;
  if(snapshot?.monitoredCount!==undefined&&Number(snapshot.monitoredCount)!==actual.size)return false;
  return [...expected].every(symbol=>actual.has(symbol));
};
export function reconcileDisplaySnapshotsV0_1({
 d1=null,kv=null,planned=[],tradeDate="",intraday=false,nowMs=Date.now(),staleSeconds=90
}={}){
  const d1Ms=validMs(d1),kvMs=validMs(kv);
  const d1Population=samePopulation(d1,planned);
  const kvPopulation=samePopulation(kv,planned);
  const d1SameDate=d1?.tradeDate===tradeDate;
  const kvSameDate=kv?.tradeDate===tradeDate;
  const age=ms=>ms===null?null:Math.round((nowMs-ms)/1000);
  const d1Age=age(d1Ms),kvAge=age(kvMs);
  const inWindowFresh=v=>v!==null&&v>=-5&&v<=staleSeconds;
  const d1Eligible=d1SameDate&&d1Population&&d1Ms!==null;
  const kvEligible=kvSameDate&&kvPopulation&&kvMs!==null;
  const kvNewer=kvEligible&&(!d1Eligible||kvMs>d1Ms);
  // Never replace an authoritative D1 snapshot with KV solely on a read error
  // unless source dates & monitored symbols match. During trade, also require
  // a fresh KV producer timestamp (a new HTTP checkedAt is NOT evidence).
  const preferKv=kvNewer&&(!intraday||inWindowFresh(kvAge))&&
    (!d1Eligible||!intraday||!inWindowFresh(d1Age));
  const selected=preferKv?kv:d1;
  const selectedSource=preferKv?"KV_DEGRADED":(d1?"D1_PRIMARY":kvEligible?"KV_ONLY":"NONE");
  const snapshot=selected||(kvEligible?kv:null);
  const source=selected?selectedSource:(snapshot?"KV_ONLY":"NONE");
  const selectedAge=age(validMs(snapshot));
  const populationMatches=samePopulation(snapshot,planned);
  const currentTradingDate=snapshot?.tradeDate===tradeDate;
  const fresh=Boolean(snapshot&&currentTradingDate&&populationMatches&&inWindowFresh(selectedAge));
  return {
    snapshot,source,liveFresh:intraday?fresh:null,
    degraded:source==="KV_DEGRADED"||source==="KV_ONLY",
    d1AgeSeconds:d1Age,kvAgeSeconds:kvAge,selectedAgeSeconds:selectedAge,
    populationMatches,currentTradingDate,d1PopulationMatches:d1Population,
    kvPopulationMatches:kvPopulation,
    d1PersistenceUnverified:Boolean(snapshot?.liveStoreResult?.stored===false)
  };
}
