import { deepFreeze } from "./factor_snapshot.mjs";

function text(value){return String(value??"").trim();}
function int(value){const n=Number(value);return Number.isInteger(n)&&n>=0?n:null;}

export function classifyHistoricalAnnualResumeStateV0_1({
  market,
  year,
  receipt=null,
  checkpoint=null,
  manifests=[],
  objectHeadFailures=[],
} = {}) {
  const m=text(market);
  const y=Number(year);
  if(!["TWSE","TPEX"].includes(m))throw new Error("market must be TWSE or TPEX");
  if(!Number.isInteger(y)||y<2017)throw new Error("year must be >= 2017");
  if(!Array.isArray(manifests))throw new Error("manifests must be an array");
  if(!Array.isArray(objectHeadFailures))throw new Error("objectHeadFailures must be an array");

  const logicalKeys=new Set();
  let duplicateLogicalKeyCount=0;
  let manifestBarCount=0;
  for(const row of manifests){
    const key=[row.market,row.symbol,Number(row.year),row.price_space].join("|");
    if(logicalKeys.has(key))duplicateLogicalKeyCount+=1;
    logicalKeys.add(key);
    manifestBarCount+=Number(row.bar_count||0);
  }
  const manifestCount=manifests.length;

  const base={
    market:m,
    year:y,
    batchId:`S2-HIST-PACK-YEAR|${m}|${y}`,
    manifestCount,
    manifestBarCount,
    duplicateLogicalKeyCount,
    objectHeadFailureCount:objectHeadFailures.length,
    receiptPresent:Boolean(receipt),
    checkpointPresent:Boolean(checkpoint),
    receiptState:receipt?.state||null,
    checkpointState:checkpoint?.state||null,
    checkpointExpectedPackCount:int(checkpoint?.expected_pack_count),
    checkpointExpectedBarCount:int(checkpoint?.expected_bar_count),
    checkpointManifestCommittedCount:int(checkpoint?.manifest_committed_count),
    checkpointObjectReadyCount:int(checkpoint?.object_ready_count),
    sourceIdentityRecheckedDuringBackfill:true,
    d1WriteAuthorized:false,
    system1RuntimeChanged:false,
    schemaVersion:"S2_HISTORICAL_ANNUAL_RESUME_PREFLIGHT_V0_1",
  };

  if(duplicateLogicalKeyCount>0 || objectHeadFailures.length>0){
    return deepFreeze({...base,state:"BLOCKED_DURABLE_STATE_INCONSISTENT",
      reasons:[
        ...(duplicateLogicalKeyCount>0?["DUPLICATE_LOGICAL_MANIFEST_KEYS"]:[]),
        ...(objectHeadFailures.length>0?["R2_OBJECT_HEAD_VERIFICATION_FAILED"]:[]),
      ],
      resumeAuthorized:false,
    });
  }

  if(receipt){
    const receiptPackCount=int(receipt.pack_count);
    const receiptBarCount=int(receipt.bar_count);
    if(receipt.state!=="COMPLETE" || receiptPackCount!==manifestCount || receiptBarCount!==manifestBarCount){
      return deepFreeze({...base,state:"BLOCKED_DURABLE_STATE_INCONSISTENT",
        reasons:["COMPLETE_RECEIPT_AGGREGATE_MISMATCH"],resumeAuthorized:false});
    }
    const checkpointComplete=Boolean(
      checkpoint
      && checkpoint.state==="COMPLETE"
      && int(checkpoint.expected_pack_count)===manifestCount
      && int(checkpoint.expected_bar_count)===manifestBarCount
      && int(checkpoint.manifest_committed_count)===manifestCount
      && int(checkpoint.object_ready_count)===manifestCount
    );
    return deepFreeze({...base,
      state:checkpointComplete?"COMPLETE_RECEIPT_PRESENT":"COMPLETE_RECEIPT_CHECKPOINT_REPAIR_REQUIRED",
      reasons:checkpointComplete?[]:["COMPLETE_RECEIPT_REQUIRES_CHECKPOINT_FINALIZATION"],
      resumeAuthorized:true,
      checkpointRepairRequired:!checkpointComplete,
    });
  }

  if(!checkpoint && manifestCount===0){
    return deepFreeze({...base,state:"CLEAN_START",reasons:[],resumeAuthorized:true,checkpointRepairRequired:false});
  }

  if(checkpoint){
    const expectedPacks=int(checkpoint.expected_pack_count);
    const committed=int(checkpoint.manifest_committed_count);
    const ready=int(checkpoint.object_ready_count);
    if((expectedPacks!==null && manifestCount>expectedPacks)
      || (committed!==null && committed>manifestCount)
      || (ready!==null && committed!==null && ready<committed)){
      return deepFreeze({...base,state:"BLOCKED_DURABLE_STATE_INCONSISTENT",
        reasons:["PARTIAL_CHECKPOINT_ACCOUNTING_IMPOSSIBLE"],resumeAuthorized:false});
    }
  }

  return deepFreeze({...base,
    state:"PARTIAL_RESUME_CANDIDATE",
    reasons:["PARTIAL_DURABLE_STATE_PRESENT","SOURCE_IDENTITY_MUST_MATCH_ON_BACKFILL"],
    resumeAuthorized:true,
    checkpointRepairRequired:false,
  });
}
