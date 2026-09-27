import {FORMAL_GATE_ORDER} from "./formal_gate_replay_v0_1.mjs";

const SAFE_NOT_APPLICABLE_REASONS=new Set([
  "NOT_APPLICABLE_CAP_GTE_30",
  "NOT_APPLICABLE_CAP_GTE_100",
  "NO_POSITIVE_TTM_PE"
]);

const CHANNEL_STAGE_GATES=Object.freeze({
  PRE_SETUP:FORMAL_GATE_ORDER.slice(0,FORMAL_GATE_ORDER.indexOf("AB_SETUP")),
  POST_SETUP_PRECISION:["FUNDAMENTAL_COMPONENT_COUNT","FUNDAMENTAL_QUALITY","ATR_QUALITY"],
  TARGET:"TARGET_AVAILABLE",
  RR:"REWARD_RISK",
  GRADE:"FINAL_SIGNAL_GRADE"
});

function gate(observer,id){
  const row=observer?.gates?.[id];
  return row&&typeof row==="object"?row:{status:"UNKNOWN",reason:"GATE_NOT_CAPTURED"};
}

function isClear(row){
  if(row?.status==="PASS") return true;
  return row?.status==="NOT_EVALUABLE"&&SAFE_NOT_APPLICABLE_REASONS.has(String(row?.reason||""));
}

function blocker(row){
  if(isClear(row)) return null;
  const status=String(row?.status||"UNKNOWN");
  if(status==="FAIL") return "FAIL";
  if(status==="UNKNOWN") return "UNKNOWN";
  if(status==="NOT_EVALUABLE") return "NOT_EVALUABLE";
  return "UNKNOWN";
}

function firstBlocker(observer,ids){
  for(const id of ids){
    const row=gate(observer,id);
    const kind=blocker(row);
    if(kind) return {gate:id,kind,state:row};
  }
  return null;
}

function bool(v){return v===true||v===false?v:null;}

function chosenChannelFromSetup(setupGate){
  const a=bool(setupGate?.A),b=bool(setupGate?.B);
  if(a===null||b===null) return {channel:null,A:a,B:b,dualPass:null,state:"UNKNOWN"};
  if(b) return {channel:"B",A:a,B:b,dualPass:a===true,state:"PASS"};
  if(a) return {channel:"A",A:a,B:b,dualPass:false,state:"PASS"};
  return {channel:null,A:a,B:b,dualPass:false,state:"FAIL"};
}

function stageResult(status,extra={}){return {status,...extra};}

export function classifyChannelStageRow({
  observer,
  scanDate=null,
  symbol=null,
  pool="UNKNOWN",
  selectedFlag=false
}={}){
  const setupGate=gate(observer,"AB_SETUP");
  const raw=chosenChannelFromSetup(setupGate);
  const preSetupBlocker=firstBlocker(observer,CHANNEL_STAGE_GATES.PRE_SETUP);

  let setup;
  if(preSetupBlocker){
    setup=stageResult("NOT_REACHED",{blocker:preSetupBlocker});
  }else if(setupGate.status==="PASS"&&raw.channel){
    setup=stageResult("PASS",{channel:raw.channel});
  }else if(setupGate.status==="FAIL"){
    setup=stageResult("FAIL",{reason:setupGate.reason||null});
  }else if(setupGate.status==="UNKNOWN"){
    setup=stageResult("UNKNOWN",{reason:setupGate.reason||null});
  }else{
    setup=stageResult("NOT_EVALUABLE",{reason:setupGate.reason||null});
  }

  const formalChannel=setup.status==="PASS"?raw.channel:null;
  const afterSetupIds=[
    ...CHANNEL_STAGE_GATES.POST_SETUP_PRECISION,
    CHANNEL_STAGE_GATES.TARGET,
    CHANNEL_STAGE_GATES.RR,
    CHANNEL_STAGE_GATES.GRADE
  ];

  const stageMap={};
  let priorClear=setup.status==="PASS";
  let inheritedBlocker=setup.status==="PASS"?null:{gate:"AB_SETUP",kind:setup.status,state:setupGate};
  for(const id of afterSetupIds){
    if(!priorClear){
      stageMap[id]=stageResult("NOT_REACHED",{blocker:inheritedBlocker});
      continue;
    }
    const row=gate(observer,id);
    if(isClear(row)){
      stageMap[id]=stageResult("PASS",{sourceState:row.status,reason:row.reason||null});
      continue;
    }
    const kind=blocker(row)||"UNKNOWN";
    stageMap[id]=stageResult(kind,{reason:row.reason||null});
    priorClear=false;
    inheritedBlocker={gate:id,kind,state:row};
  }

  const precisionPass=CHANNEL_STAGE_GATES.POST_SETUP_PRECISION.every(id=>stageMap[id]?.status==="PASS");
  const targetPass=stageMap[CHANNEL_STAGE_GATES.TARGET]?.status==="PASS";
  const rrPass=stageMap[CHANNEL_STAGE_GATES.RR]?.status==="PASS";
  const gradePass=stageMap[CHANNEL_STAGE_GATES.GRADE]?.status==="PASS";
  const qualified=observer?.formalResult?.ok===true;
  const firstPostSetupBlocker=setup.status==="PASS"?firstBlocker(observer,afterSetupIds):null;

  const invariants=[];
  if(raw.dualPass===true){
    invariants.push("A_B_DUAL_PASS_SHOULD_BE_STRUCTURAL_ZERO");
  }
  if(formalChannel==="B"&&rrPass&&stageMap[CHANNEL_STAGE_GATES.GRADE]?.status==="FAIL"){
    invariants.push("B_RR_PASS_FINAL_GRADE_FAIL_SHOULD_BE_STRUCTURAL_ZERO");
  }
  if(qualified&&!gradePass){
    invariants.push("FORMAL_OK_WITHOUT_OBSERVED_GRADE_PASS");
  }
  if(Boolean(selectedFlag)&&!qualified){
    invariants.push("SELECTED_WITHOUT_FORMAL_OK");
  }

  return {
    schemaVersion:"channel-stage-denominator-row-v0.1",
    scanDate:scanDate===null?null:String(scanDate),
    symbol:symbol===null?null:String(symbol),
    pool:["GENERAL","THOUSAND"].includes(String(pool))?String(pool):"UNKNOWN",
    rawSetup:{A:raw.A,B:raw.B,dualPass:raw.dualPass},
    preSetupBlocker,
    formalChannel,
    setup,
    postSetupPrecisionPass:precisionPass,
    stages:stageMap,
    targetPass,rrPass,gradePass,
    qualified,
    selected:Boolean(selectedFlag),
    firstPostSetupBlocker,
    invariantViolations:invariants,
    denominatorEligible:invariants.length===0,
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}

function emptyBucket(){
  return {
    formalChannelAssigned:0,
    postSetupPrecisionPass:0,
    targetPass:0,
    rrPass:0,
    gradePass:0,
    qualified:0,
    selected:0,
    targetFail:0,
    rrFail:0,
    gradeFail:0,
    unresolvedAfterSetup:0,
    firstPostSetupBlockerCounts:{}
  };
}

function bump(obj,key){obj[key]=(obj[key]||0)+1;}

export function summarizeChannelStageDenominators(rows=[]){
  const items=Array.isArray(rows)?rows:[];
  const byPool={
    GENERAL:{A:emptyBucket(),B:emptyBucket()},
    THOUSAND:{A:emptyBucket(),B:emptyBucket()},
    UNKNOWN:{A:emptyBucket(),B:emptyBucket()}
  };
  const rawSetupByPool={
    GENERAL:{A:0,B:0,DUAL:0},
    THOUSAND:{A:0,B:0,DUAL:0},
    UNKNOWN:{A:0,B:0,DUAL:0}
  };
  const setupNotReached={FAIL:0,UNKNOWN:0,NOT_EVALUABLE:0,OTHER:0};
  const invariantViolations={};
  let quarantinedInvariantRows=0;

  for(const row of items){
    const pool=byPool[row?.pool]?row.pool:"UNKNOWN";
    if(row?.rawSetup?.A===true) rawSetupByPool[pool].A+=1;
    if(row?.rawSetup?.B===true) rawSetupByPool[pool].B+=1;
    if(row?.rawSetup?.dualPass===true) rawSetupByPool[pool].DUAL+=1;

    for(const inv of row?.invariantViolations||[]) bump(invariantViolations,inv);
    if(row?.denominatorEligible===false){
      quarantinedInvariantRows+=1;
      continue;
    }

    const channel=row?.formalChannel;
    if(channel!=="A"&&channel!=="B"){
      if(row?.setup?.status==="NOT_REACHED"){
        const k=String(row?.setup?.blocker?.kind||"OTHER");
        setupNotReached[k in setupNotReached?k:"OTHER"]+=1;
      }
      continue;
    }

    const b=byPool[pool][channel];
    b.formalChannelAssigned+=1;
    if(row.postSetupPrecisionPass) b.postSetupPrecisionPass+=1;
    if(row.targetPass) b.targetPass+=1;
    if(row.rrPass) b.rrPass+=1;
    if(row.gradePass) b.gradePass+=1;
    if(row.qualified) b.qualified+=1;
    if(row.selected) b.selected+=1;

    const target=row.stages?.TARGET_AVAILABLE?.status;
    const rr=row.stages?.REWARD_RISK?.status;
    const grade=row.stages?.FINAL_SIGNAL_GRADE?.status;
    if(target==="FAIL") b.targetFail+=1;
    if(rr==="FAIL") b.rrFail+=1;
    if(grade==="FAIL") b.gradeFail+=1;
    if(["UNKNOWN","NOT_EVALUABLE"].includes(String(row?.firstPostSetupBlocker?.kind||""))) b.unresolvedAfterSetup+=1;
    if(row.firstPostSetupBlocker?.gate) bump(b.firstPostSetupBlockerCounts,row.firstPostSetupBlocker.gate);
  }

  return {
    schemaVersion:"channel-stage-denominator-summary-v0.1",
    rows:items.length,
    rawSetupByPool,
    byPool,
    setupNotReached,
    invariantViolations,
    quarantinedInvariantRows,
    interpretation:{
      rawSetup:"Pattern geometry observed on the row; not necessarily reached under Formal fail-fast order.",
      formalChannelAssigned:"All earlier ordered gates clear and exactly one valid A/B setup passes. Current A/B definitions are mathematically mutually exclusive; any dual-pass row is quarantined as an invariant violation even though production code defensively checks B first.",
      postSetupPrecisionPass:"Assigned channel also clears fundamental component count, fundamental quality and ATR before target evaluation.",
      targetPass:"Sequentially reached target and observed target available.",
      rrPass:"Sequentially reached RR and observed RR>=2.",
      gradePass:"Sequentially reached final signal grade and observed setupQuality>=65.",
      qualified:"Original Formal result ok=true; not inferred from counts.",
      selected:"External selectedFlag only; quota/ranking state is not reconstructed here."
    },
    policy:"These are same-scan sequential denominators from complete row observers, not bounded Shadow inference. UNKNOWN/NOT_EVALUABLE never become FAIL or PASS. Counts do not estimate outcomes or justify threshold changes.",
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}

export const CHANNEL_STAGE_DENOMINATOR_GATES=CHANNEL_STAGE_GATES;
