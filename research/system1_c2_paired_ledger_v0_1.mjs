import {createHash} from "node:crypto";
import {adaptC1PopulationPages,observeRow,challenge,SAFETY} from "./system1_selection_isolated_v0_1.mjs";

// Offline comparison on ONE cryptographically verified immutable C1 generation.
// Admission facts are descriptive; WATCH/BUY/returns cannot be manufactured.
export const C2_SHORT_REQUIRED=Object.freeze([
  ...SAFETY,"PRICE_FLOOR","HISTORY_60D","RS_CONTEXT","DAILY_ABNORMALITY",
  "LIQUIDITY","ANNOUNCEMENT_RISK","ATR_QUALITY","SECTOR_GATE"
]);
export const C2_SWING_EXTRA=Object.freeze([
  "MARKET_CAP_FLOOR","SMALL_CAP_SPECIAL","MID_CAP_LIQUIDITY",
  "CHIP_CONCENTRATION_PRESENT","FINANCIAL_SOURCE_COMPLETENESS",
  "VALUATION_RELATIVE_RISK","FUNDAMENTAL_COMPONENT_COUNT","FUNDAMENTAL_QUALITY"
]);

function gatesOnly(gates,required) {
  const fail=required.filter(id=>gates[id]?.status==="FAIL");
  const unknown=required.filter(id=>!["FAIL","PASS"].includes(gates[id]?.status));
  return {status:fail.length?"FAIL":unknown.length?"UNKNOWN":"PASS",fail,unknown};
}
function aggregateCounts(rows,field) {
  return rows.reduce((out,row)=>{const k=row[field];out[k]=(out[k]||0)+1;return out;},{});
}

export function buildC2ProspectivePairedLedger(pages,{watchUntil=null,revalidatedAt=null}={}) {
  const source=adaptC1PopulationPages(pages); // hash/coverage/generation verification is mandatory.
  if(source.captureCompleteness!=="IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE"||
      !/^[a-f0-9]{40}$/i.test(source.sourceMainSha||"")||
      source.rows.length!==source.universe.length)
    throw new Error("C2_VERIFIED_FULL_C1_REQUIRED");
  const original=source.universe.join("\n");
  const rawMap=new Map(source.rows.map(row=>[row.symbol,row]));
  if(rawMap.size!==source.universe.length||source.universe.some(symbol=>!rawMap.has(symbol)))
    throw new Error("C2_SYMBOL_DENOMINATOR_MISMATCH");
  const pairs=source.universe.map(symbol=>{
    const raw=rawMap.get(symbol), observed=observeRow(raw,source.decisionAt);
    const short=gatesOnly(observed.gates,C2_SHORT_REQUIRED);
    const swing=gatesOnly(observed.gates,[...C2_SHORT_REQUIRED,...C2_SWING_EXTRA]);
    const shortWithoutSafety=gatesOnly(observed.gates,C2_SHORT_REQUIRED.filter(id=>!SAFETY.includes(id)));
    const shortLifecycle=challenge(raw,source.decisionAt,{strategy:"SHORT",watchUntil,revalidatedAt});
    const swingLifecycle=challenge(raw,source.decisionAt,{strategy:"SWING",watchUntil,revalidatedAt});
    const missingSafety=SAFETY.filter(id=>observed.gates[id]?.status!=="PASS");
    return {
      symbol,pool:observed.pool,sessionDate:source.sessionDate,parentId:source.generationId,
      formal:{qualified:raw.formalResult?.ok===true,selected:raw.formalResult?.selected===true,
        firstFailure:raw.formalResult?.reason??"UNKNOWN"},
      short:{gateStatus:short.status,failedGates:short.fail,unknownGates:short.unknown,
        withoutSafetyGateStatus:shortWithoutSafety.status,lifecycle:shortLifecycle.status,
        blockers:shortLifecycle.blockers,missingSafety},
      swing:{gateStatus:swing.status,failedGates:swing.fail,unknownGates:swing.unknown,
        lifecycle:swingLifecycle.status,blockers:swingLifecycle.blockers},
      buyAuthorized:false,allocation:0,signal:null,researchOnly:true,decisionImpact:false
    };
  });
  const tally={populationN:pairs.length,
    formalQualifiedN:pairs.filter(x=>x.formal.qualified).length,
    formalSelectedN:pairs.filter(x=>x.formal.selected).length,
    shortGateCounts:aggregateCounts(pairs.map(x=>({status:x.short.gateStatus})),"status"),
    shortLifecycleCounts:aggregateCounts(pairs.map(x=>({status:x.short.lifecycle})),"status"),
    swingGateCounts:aggregateCounts(pairs.map(x=>({status:x.swing.gateStatus})),"status"),
    swingLifecycleCounts:aggregateCounts(pairs.map(x=>({status:x.swing.lifecycle})),"status"),
    shortSafetyUnverifiedN:pairs.filter(x=>x.short.missingSafety.length>0).length,
    // A conditional upper-bound diagnostic, never a selected/watch/BUY count.
    formalRejectedButConditionalShortGatesPassN:pairs.filter(x=>!x.formal.qualified&&x.short.withoutSafetyGateStatus==="PASS").length
  };
  const fingerprint=createHash("sha256").update(JSON.stringify([
    "C2_PAIRED_LEDGER_V0_1",source.generationId,source.contentDigest,source.universeDigest,
    source.sourceMainSha,source.sessionDate,source.decisionAt,original
  ])).digest("hex");
  return {schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId:source.generationId,
    sessionDate:source.sessionDate,decisionAt:source.decisionAt,
    sourceMainSha:source.sourceMainSha,sourceContentDigest:source.contentDigest,
    universeDigest:source.universeDigest,fingerprint,
    tally,pairs,economicSuperiority:"UNKNOWN",executionComparison:"UNKNOWN",
    candidateCountLiftIsNotPerformance:true,completeMatchedCohort:true,
    watchIsNotFormalSelection:true,formalCoreLocked:true,researchOnly:true,
    decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}
