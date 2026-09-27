function norm(v){return v===null||v===undefined?null:String(v);}
function sameKey(a,b,key){
  const x=norm(a?.[key]),y=norm(b?.[key]);
  if(x===null||y===null) return null;
  return x===y;
}
function pattern(row){return `A:${row?.A?.bitmask||"??????"}|B:${row?.B?.bitmask||"??????"}`;}
function result(state,extra={}){
  return {
    schemaVersion:"ab-setup-sequential-population-row-v0.1",
    state,
    setupFirstFailureEligible:state==="SETUP_FIRST_FAILURE",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    ...extra
  };
}

export function classifySequentialABSetupPopulation({channelStageRow,marginRow}={}){
  if(!channelStageRow||!marginRow){
    return result("UNKNOWN",{reason:"MISSING_INPUT"});
  }

  const keyChecks={
    scanDate:sameKey(channelStageRow,marginRow,"scanDate"),
    symbol:sameKey(channelStageRow,marginRow,"symbol"),
    pool:sameKey(channelStageRow,marginRow,"pool")
  };
  if(Object.values(keyChecks).some(v=>v===false)){
    return result("UNKNOWN",{reason:"ROW_KEY_MISMATCH",keyChecks});
  }
  if(keyChecks.symbol!==true){
    return result("UNKNOWN",{reason:"SYMBOL_KEY_UNCERTAIN",keyChecks});
  }

  const stageA=channelStageRow?.rawSetup?.A;
  const stageB=channelStageRow?.rawSetup?.B;
  const marginA=marginRow?.A?.pass;
  const marginB=marginRow?.B?.pass;
  if(typeof stageA!=="boolean"||typeof stageB!=="boolean"||
     typeof marginA!=="boolean"||typeof marginB!=="boolean"){
    return result("UNKNOWN",{reason:"AB_PASS_STATE_UNCERTAIN",keyChecks});
  }
  if(stageA!==marginA||stageB!==marginB){
    return result("UNKNOWN",{
      reason:"AB_GEOMETRY_STATE_MISMATCH",
      keyChecks,
      observed:{stageA,stageB,marginA,marginB}
    });
  }

  const setup=String(channelStageRow?.setup?.status||"UNKNOWN");
  const common={
    scanDate:norm(marginRow.scanDate),
    symbol:norm(marginRow.symbol),
    pool:norm(marginRow.pool)||"UNKNOWN",
    keyChecks,
    A:{pass:marginA,bitmask:marginRow?.A?.bitmask||null,failedCount:marginRow?.A?.failedCount??null,failedChecks:marginRow?.A?.failedChecks||[]},
    B:{pass:marginB,bitmask:marginRow?.B?.bitmask||null,failedCount:marginRow?.B?.failedCount??null,failedChecks:marginRow?.B?.failedChecks||[]},
    nearestChannel:marginRow?.nearestChannel||null,
    failedACount:marginRow?.failedACount??marginRow?.A?.failedCount??null,
    failedBCount:marginRow?.failedBCount??marginRow?.B?.failedCount??null,
    checkPattern:pattern(marginRow),
    rawMargins:{A:marginRow?.A?.rawMargins||null,B:marginRow?.B?.rawMargins||null},
    warnings:Array.isArray(marginRow?.warnings)?marginRow.warnings:[],
    formalChannel:channelStageRow?.formalChannel||null
  };

  if(setup==="NOT_REACHED"){
    return result("PRE_SETUP_NOT_REACHED",{
      ...common,
      reason:"EARLIER_FORMAL_GATE_BLOCKED_SETUP",
      blocker:channelStageRow?.setup?.blocker||channelStageRow?.preSetupBlocker||null
    });
  }
  if(setup==="UNKNOWN"||setup==="NOT_EVALUABLE"){
    return result("UNKNOWN",{...common,reason:`SEQUENTIAL_SETUP_${setup}`});
  }
  if(setup==="FAIL"){
    if(marginA||marginB){
      return result("UNKNOWN",{...common,reason:"SEQUENTIAL_FAIL_BUT_RAW_CHANNEL_PASSES"});
    }
    return result("SETUP_FIRST_FAILURE",{
      ...common,
      reason:"ALL_EARLIER_GATES_CLEAR_AND_AB_SETUP_FAILS",
      interpretation:"This row is eligible for the exact setup-first-failure population. nearestChannel remains Hamming-only; raw margins remain unnormalized."
    });
  }
  if(setup==="PASS"){
    const expected=marginB?"B":marginA?"A":null;
    if(!expected||channelStageRow?.formalChannel!==expected){
      return result("UNKNOWN",{...common,reason:"FORMAL_CHANNEL_PRECEDENCE_MISMATCH",expected});
    }
    return result("SETUP_PASS",{
      ...common,
      reason:"ALL_EARLIER_GATES_CLEAR_AND_AB_SETUP_PASSES",
      interpretation:"This row belongs to the sequential setup-pass denominator, not the setup-first-failure cohort."
    });
  }
  return result("UNKNOWN",{...common,reason:"UNRECOGNIZED_SEQUENTIAL_SETUP_STATE"});
}

function emptyPool(){
  return {
    setupFirstFailure:0,setupPass:0,preSetupNotReached:0,unknown:0,
    firstFailureByNearest:{A:0,B:0,TIE:0,UNKNOWN:0},
    firstFailurePatterns:{}
  };
}
function bump(obj,key){obj[key]=(obj[key]||0)+1;}

export function summarizeSequentialABSetupPopulation(rows=[]){
  const items=Array.isArray(rows)?rows:[];
  const byPool={GENERAL:emptyPool(),THOUSAND:emptyPool(),UNKNOWN:emptyPool()};
  for(const row of items){
    const p=byPool[row?.pool]?row.pool:"UNKNOWN";
    const b=byPool[p];
    if(row?.state==="SETUP_FIRST_FAILURE"){
      b.setupFirstFailure+=1;
      const near=["A","B","TIE"].includes(row?.nearestChannel)?row.nearestChannel:"UNKNOWN";
      b.firstFailureByNearest[near]+=1;
      bump(b.firstFailurePatterns,row?.checkPattern||"UNKNOWN");
    }else if(row?.state==="SETUP_PASS") b.setupPass+=1;
    else if(row?.state==="PRE_SETUP_NOT_REACHED") b.preSetupNotReached+=1;
    else b.unknown+=1;
  }
  return {
    schemaVersion:"ab-setup-sequential-population-summary-v0.1",
    rows:items.length,
    byPool,
    setupFirstFailureTotal:Object.values(byPool).reduce((s,x)=>s+x.setupFirstFailure,0),
    setupPassTotal:Object.values(byPool).reduce((s,x)=>s+x.setupPass,0),
    policy:"Only SETUP_FIRST_FAILURE rows may populate the setup-reject denominator. Raw A/B geometry from PRE_SETUP_NOT_REACHED rows is explicitly excluded. UNKNOWN never becomes FAIL/PASS. No outcomes or threshold changes.",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
