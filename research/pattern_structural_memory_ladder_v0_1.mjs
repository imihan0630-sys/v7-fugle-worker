// D01 DL-034 structural-memory ladder readiness helper v0.1
// Research-only. Does not inspect market outcomes itself.

const GATES=["G0","G1","G2","G3","G4","G5","G6","G7","G8","G9"];

export function auditStructuralMemoryLadder(statusByGate={}){
  for(const g of GATES){
    const s=statusByGate[g]||"UNRESOLVED";
    if(s==="UNRESOLVED"||s==="UNKNOWN"||s==="BLOCKED")
      return {
        status:"NOT_READY",
        earliestUnresolvedGate:g,
        maximumInterpretation:"NO_STRUCTURAL_SPECIFIC_CLAIM"
      };
    if(s==="FAILED")
      return {
        status:"FALSIFIED_AT_GATE",
        failedGate:g,
        maximumInterpretation:"STOP_AT_GATE_SPECIFIC_EXPLANATION"
      };
    if(s!=="PASSED")
      return {
        status:"QA_FAIL",
        reason:"UNKNOWN_GATE_STATUS",
        gate:g,
        value:s
      };
  }
  return {
    status:"ALL_GATES_PASSED",
    maximumInterpretation:"STRUCTURAL_SPECIFIC_REPRESENTATION_INCREMENTALITY_CANDIDATE",
    causalMemoryProofAuthorized:false,
    formalOptimizationAuthorized:false
  };
}

export function validateGateOrder(report=[]){
  let last=-1;
  for(const g of report){
    const i=GATES.indexOf(g);
    if(i<0) return {status:"QA_FAIL",reason:"UNKNOWN_GATE",gate:g};
    if(i<last) return {status:"QA_FAIL",reason:"GATE_ORDER_REVERSED",gate:g};
    last=i;
  }
  return {status:"VALID"};
}
