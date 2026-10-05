import {canonicalJcsJson,sha256HexUtf8} from './canonical_receipt_hash_v0_1.mjs';

export const C1_SCAN_INVENTORY_SCHEMA='SYSTEM1_C1_SCAN_INVENTORY_V0_1';
const origins=new Set(['CRON_AFTER_MARKET','HTTP_SCAN_API','HTTP_SCAN_PREVIEW','HTTP_TEST_SCAN','HTTP_IMPORT_SCAN','STAGED_RECOVERY','HYBRID_RESEARCH_PREVIEW']);
const safety={researchOnly:true,decisionImpact:false,formalCoreImpact:false,promotionGradeOutcomeJoin:false,economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE'};
const versionRequired=v=>{const m=/^(\d+)\.(\d+)\./.exec(String(v||''));return !!m&&(Number(m[1])>8||(Number(m[1])===8&&Number(m[2])>=19));};
const rootHash=root=>sha256HexUtf8('C1_SCAN_INVENTORY_V0_1\n'+canonicalJcsJson(root));
const childInventory=receipt=>[['population','CAPTURED'],['zeroPick',receipt.zeroPickCapture?'HEADER_PRESENT_NOT_CHILD_ACCEPTANCE':'NOT_CAPTURED'],['shadowRanking',receipt.shadowCapture?'HEADER_PRESENT_NOT_CHILD_ACCEPTANCE':'NOT_CAPTURED'],['valuationSourceVintage',receipt.valuationSourceVintage?.status||'NOT_CAPTURED']].map(([name,status])=>({name,status}));

// Transport labels identify the observed entry point, never the remote actor or scheduler.
export function buildC1ScanInventory(receipt,context=null){
 const origin=origins.has(context?.origin)?context.origin:'UNKNOWN';
 const validClock=Number.isFinite(context?.scheduledTime)&&Number.isFinite(Date.parse(context?.observedAt))&&Date.parse(context.observedAt)<=Date.parse(receipt.decisionAt);
 const children=childInventory(receipt);
 return {...receipt,scanInventory:{schemaVersion:C1_SCAN_INVENTORY_SCHEMA,...safety,
  scanOrigin:{entryPoint:origin,actorIdentity:'NOT_PROVEN',cron:origin==='CRON_AFTER_MARKET'&&typeof context?.cron==='string'?context.cron.slice(0,80):null,
   executionMode:context?.staged===true?'STAGED_CAPTURE':context?.dryRun===true?'DRY_RUN':context?.dryRun===false?'NORMAL_SCAN':'UNKNOWN',
   requestedAt:validClock?new Date(context.scheduledTime).toISOString():null,observedAt:validClock?context.observedAt:null,clockState:validClock?'OBSERVED':'UNKNOWN'},
  marketInputOrigins:['TWSE','TPEx'].map(market=>{const m=context?.marketSources?.[market];return {market,state:m?'REQUEST_METADATA_OBSERVED':'UNKNOWN',source:typeof m?.source==='string'?m.source.slice(0,120):null,
   marketDate:typeof m?.marketDate==='string'?m.marketDate:null,fallback:typeof m?.fallback==='boolean'?m.fallback:null,count:Number.isInteger(m?.count)&&m.count>=0?m.count:null};}),
  generation:{id:receipt.generationId,source:'REQUEST_LOCAL_C1_BUILDER_RANDOM_UUID',sourceGenerationId:null,sessionDate:receipt.sessionDate,decisionAt:receipt.decisionAt,
   buildSourceSha:receipt.sourceMainSha,runtimeVersion:receipt.effectiveRuntimeVersion,sourceShaSemantics:'BUILD_COMMIT_NOT_PROOF_OF_LATEST_MAIN_AT_SCAN'},
  inventory:{scope:receipt.universeScope,populationN:receipt.populationN,featureN:receipt.featureN,
   provenance:'SAME_REQUEST_NORMALIZED_ROWS_BEFORE_HISTORY_ADMISSION',listingPopulation:'NOT_CAPTURED',providerAuthenticity:'NOT_INDEPENDENTLY_PROVEN',
   persistence:'EXISTING_IMMUTABLE_C1_D1_HEADER_AND_CHUNKS',children,shadowMembership:'SEPARATE_POST_C1_PERSISTENCE_CHECK_REQUIRED',outcomes:'NOT_CAPTURED'}}};
}

export async function finalizeC1ScanInventory(receipt){
 if(!receipt?.scanInventory){if(versionRequired(receipt?.effectiveRuntimeVersion))throw Error('C1_INVENTORY_CAPTURE_MISSING');return receipt;}
 const root={...receipt.scanInventory,inventory:{...receipt.scanInventory.inventory,children:childInventory(receipt)}};
 if(new TextEncoder().encode(canonicalJcsJson(root)).byteLength>12000)throw Error('C1_INVENTORY_BYTE_BOUND');
 const digest=await rootHash(root);
 const result={...receipt,scanInventory:root,rows:receipt.rows.map((r,i)=>i===0?{...r,c1ScanInventoryDigest:digest}:r)};
 if(new TextEncoder().encode(JSON.stringify(result)).byteLength>=10000000)throw Error('C1_INVENTORY_RECEIPT_BYTE_BOUND');
 return result;
}

export async function verifyC1ScanInventory(receipt){
 const root=receipt?.scanInventory;
 if(!root){if(versionRequired(receipt?.effectiveRuntimeVersion))throw Error('C1_INVENTORY_CAPTURE_MISSING');if(receipt?.rows?.some(r=>r.c1ScanInventoryDigest))throw Error('C1_INVENTORY_ORPHAN_ANCHOR');return {...safety,status:'LEGACY_NO_SCAN_INVENTORY',scanOrigin:'UNKNOWN',generationSource:'UNKNOWN',inventoryProvenance:'UNKNOWN'};}
 if(!versionRequired(receipt.effectiveRuntimeVersion))throw Error('C1_INVENTORY_LEGACY_NO_BACKFILL');
 if(root.schemaVersion!==C1_SCAN_INVENTORY_SCHEMA||Object.entries(safety).some(([k,v])=>root[k]!==v))throw Error('C1_INVENTORY_FIREWALL');
 if(root.generation?.id!==receipt.generationId||root.generation.sessionDate!==receipt.sessionDate||root.generation.decisionAt!==receipt.decisionAt||root.generation.buildSourceSha!==receipt.sourceMainSha||root.generation.runtimeVersion!==receipt.effectiveRuntimeVersion||root.inventory?.scope!==receipt.universeScope||root.inventory.populationN!==receipt.populationN||root.inventory.featureN!==receipt.featureN)throw Error('C1_INVENTORY_PARENT_MISMATCH');
 if(!receipt.rows?.length||receipt.rows[0].c1ScanInventoryDigest!==await rootHash(root))throw Error('C1_INVENTORY_ROOT_DIGEST');
 if(root.generation.source!=='REQUEST_LOCAL_C1_BUILDER_RANDOM_UUID'||root.generation.sourceGenerationId!==null||root.inventory.provenance!=='SAME_REQUEST_NORMALIZED_ROWS_BEFORE_HISTORY_ADMISSION'||canonicalJcsJson(root.inventory.children)!==canonicalJcsJson(childInventory(receipt)))throw Error('C1_INVENTORY_PROVENANCE');
 if(root.scanOrigin?.entryPoint!=='UNKNOWN'&&!origins.has(root.scanOrigin?.entryPoint))throw Error('C1_INVENTORY_ORIGIN');
 return {...safety,status:root.scanOrigin.entryPoint==='UNKNOWN'?'ORIGIN_UNKNOWN':'SCAN_INVENTORY_VERIFIED',generationId:receipt.generationId,scanOrigin:root.scanOrigin,generation:root.generation,marketInputOrigins:root.marketInputOrigins,generationSource:root.generation.source,inventoryProvenance:root.inventory.provenance,inventory:root.inventory};
}
