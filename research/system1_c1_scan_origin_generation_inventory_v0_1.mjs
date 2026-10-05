const DATE=/^\d{4}-\d{2}-\d{2}$/;
const VERSION=/^(\d+)\.(\d+)\.(\d+)/;

export const C1_SCAN_ORIGIN_SCHEMA_VERSION="SYSTEM1_C1_SCAN_ORIGIN_V0_1";
export const C1_GENERATION_INVENTORY_SCHEMA_VERSION="SYSTEM1_C1_GENERATION_INVENTORY_V0_1";
export const C1_SCAN_ORIGINS=Object.freeze({
  AFTER_MARKET_SCAN_PIPELINE:"AFTER_MARKET_SCAN_PIPELINE",
  STAGE_SELECTION_ROUTE:"STAGE_SELECTION_ROUTE",
  DIRECT_SAFE_PERSISTENCE_CALLER:"DIRECT_SAFE_PERSISTENCE_CALLER"
});
const ORIGINS=new Set(Object.values(C1_SCAN_ORIGINS));
const FLAGS=Object.freeze({researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true});

function runtimeAtLeast819(value){
  const m=String(value||"").match(VERSION);
  if(!m)return false;
  const [major,minor]=m.slice(1,3).map(Number);
  return major>8||(major===8&&minor>=19);
}
function pathFor(origin){
  if(origin===C1_SCAN_ORIGINS.AFTER_MARKET_SCAN_PIPELINE)return {
    pathKind:"RUN_AFTER_MARKET_SCAN_CORE",
    requestRoute:null,
    dryRunComputation:false,
    triggerTransport:"NOT_IDENTIFIED_BY_THIS_CAPTURE"
  };
  if(origin===C1_SCAN_ORIGINS.STAGE_SELECTION_ROUTE)return {
    pathKind:"STAGE_SELECTION",
    requestRoute:"/api/scan/stage-selection",
    dryRunComputation:true,
    triggerTransport:"AUTHORIZED_ADMIN_ROUTE"
  };
  return {
    pathKind:"DIRECT_SAFE_PERSISTENCE_CALLER",
    requestRoute:null,
    dryRunComputation:null,
    triggerTransport:"NOT_IDENTIFIED_BY_THIS_CAPTURE"
  };
}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}

export function attachC1ScanOrigin(receipt,{origin=C1_SCAN_ORIGINS.DIRECT_SAFE_PERSISTENCE_CALLER,scanDate=null}={}){
  if(!receipt||typeof receipt!=="object"||!receipt.generationId)throw new Error("C1_SCAN_ORIGIN_RECEIPT_REQUIRED");
  if(!ORIGINS.has(origin))throw new Error("C1_SCAN_ORIGIN_UNKNOWN");
  const sessionDate=String(receipt.sessionDate||"");
  if(!DATE.test(sessionDate))throw new Error("C1_SCAN_ORIGIN_SESSION_DATE_REQUIRED");
  if(scanDate!==null&&String(scanDate)!==sessionDate)throw new Error("C1_SCAN_ORIGIN_SESSION_MISMATCH");
  if(!Number.isFinite(Date.parse(receipt.decisionAt)))throw new Error("C1_SCAN_ORIGIN_DECISION_CLOCK_REQUIRED");
  const capture={
    schemaVersion:C1_SCAN_ORIGIN_SCHEMA_VERSION,
    originKind:origin,
    ...pathFor(origin),
    generationId:String(receipt.generationId),
    sessionDate,
    decisionAt:String(receipt.decisionAt),
    persistencePath:"persistC1PopulationReceipt",
    persistedAfterSelectionVerification:origin!==C1_SCAN_ORIGINS.DIRECT_SAFE_PERSISTENCE_CALLER?true:null,
    backfilled:false,
    interpretation:"Runtime invocation path provenance only. It does not identify external scheduler/manual trigger unless explicitly captured.",
    ...FLAGS
  };
  if(receipt.scanOrigin&&!same(receipt.scanOrigin,capture))throw new Error("C1_SCAN_ORIGIN_CONFLICT");
  return receipt.scanOrigin?receipt:{...receipt,scanOrigin:capture};
}

export function verifyC1ScanOrigin(receipt){
  if(!receipt||typeof receipt!=="object")throw new Error("C1_SCAN_ORIGIN_RECEIPT_REQUIRED");
  const modern=runtimeAtLeast819(receipt.effectiveRuntimeVersion);
  const value=receipt.scanOrigin;
  if(!modern){
    if(value!==undefined&&value!==null)throw new Error("C1_SCAN_ORIGIN_LEGACY_CONFLICT");
    return {status:"LEGACY_NO_SCAN_ORIGIN",originKind:null,eligibleForOriginInference:false,...FLAGS};
  }
  if(!value||value.schemaVersion!==C1_SCAN_ORIGIN_SCHEMA_VERSION)throw new Error("C1_SCAN_ORIGIN_CAPTURE_MISSING");
  if(!ORIGINS.has(value.originKind))throw new Error("C1_SCAN_ORIGIN_UNKNOWN");
  if(value.generationId!==receipt.generationId||value.sessionDate!==receipt.sessionDate||value.decisionAt!==receipt.decisionAt)
    throw new Error("C1_SCAN_ORIGIN_PARENT_MISMATCH");
  if(value.persistencePath!=="persistC1PopulationReceipt"||value.backfilled!==false||
     value.researchOnly!==true||value.decisionImpact!==false||value.formalCoreImpact!==false||
     value.noPlanChanges!==true||value.noTrade!==true||value.noPush!==true)
    throw new Error("C1_SCAN_ORIGIN_CONTRACT_MISMATCH");
  const expected=pathFor(value.originKind);
  for(const [key,val] of Object.entries(expected))if(value[key]!==val)throw new Error("C1_SCAN_ORIGIN_PATH_MISMATCH");
  return {status:"SCAN_ORIGIN_CAPTURED",originKind:value.originKind,pathKind:value.pathKind,
    eligibleForOriginInference:true,triggerTransport:value.triggerTransport,...FLAGS};
}

export async function readC1GenerationInventory(db,{scanDate,limit=100}={}){
  if(!db?.prepare)throw new Error("C1_GENERATION_INVENTORY_D1_REQUIRED");
  const date=String(scanDate||"");
  if(!DATE.test(date))throw new Error("C1_GENERATION_INVENTORY_SCAN_DATE_REQUIRED");
  const bound=Math.max(1,Math.min(250,Number(limit)||100));
  const countRow=await db.prepare(`SELECT COUNT(*) AS n FROM trade_research_c1_generations WHERE scan_date=?1`).bind(date).first();
  const total=Math.max(0,Number(countRow?.n)||0);
  const result=await db.prepare(`SELECT generation_id,scan_date,decision_at,captured_at,source_main_sha,runtime_version,
    universe_digest,content_digest,population_n,captured_n,feature_n,chunk_count,completeness,header_json,created_at
    FROM trade_research_c1_generations WHERE scan_date=?1 ORDER BY decision_at ASC,generation_id ASC LIMIT ?2`).bind(date,bound).all();
  const stored=result?.results||[];
  const generations=stored.map((row,index)=>{
    let header=null,origin=null,error=null;
    try{
      header=JSON.parse(row.header_json);
      origin=verifyC1ScanOrigin(header);
    }catch(e){error=String(e).slice(0,200);}
    return {
      ordinal:index+1,
      generationId:row.generation_id,
      sessionDate:row.scan_date,
      decisionAt:row.decision_at,
      capturedAt:row.captured_at,
      createdAt:row.created_at,
      sourceMainSha:row.source_main_sha,
      runtimeVersion:row.runtime_version,
      universeDigest:row.universe_digest,
      contentDigest:row.content_digest,
      populationN:Number(row.population_n),
      capturedN:Number(row.captured_n),
      featureN:Number(row.feature_n),
      chunkCount:Number(row.chunk_count),
      completeness:row.completeness,
      originStatus:error?"DATA_QUALITY_BLOCKED":origin.status,
      originKind:error?null:origin.originKind,
      pathKind:error?null:origin.pathKind??null,
      triggerTransport:error?null:origin.triggerTransport??null,
      error
    };
  });
  const modern=generations.filter(x=>runtimeAtLeast819(x.runtimeVersion));
  return {
    schemaVersion:C1_GENERATION_INVENTORY_SCHEMA_VERSION,
    scanDate:date,
    generationCount:total,
    returnedCount:generations.length,
    limit:bound,
    truncated:total>generations.length,
    integrityComplete:generations.every(x=>x.originStatus!=="DATA_QUALITY_BLOCKED"),
    modernOriginCoverageComplete:modern.length?modern.every(x=>x.originStatus==="SCAN_ORIGIN_CAPTURED"):null,
    snapshotMutableUntilSessionComplete:true,
    historicalBackfillPerformed:false,
    generations,
    ...FLAGS
  };
}
