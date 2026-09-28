// Research-only / outcome-blind. Formal Core unchanged.
export function classifyCadenceRow(row = {}) {
  const required = ["scanDate","symbol","chipAsOfDate","chipConcentration","foreignBuyDays","trustBuyDays","dealerBuyDays","foreignNet","trustNet","dealerNet","institutionTotalNet"];
  const missing = required.filter(k => row[k] === null || row[k] === undefined || row[k] === "");
  if (missing.length) return {state:"UNKNOWN_PROVENANCE_OR_INPUT",missing};
  const nums=["chipConcentration","foreignBuyDays","trustBuyDays","dealerBuyDays","foreignNet","trustNet","dealerNet","institutionTotalNet"];
  if (nums.some(k => !Number.isFinite(Number(row[k])))) return {state:"UNKNOWN_INVALID_NUMERIC"};
  const actorSum=Number(row.foreignNet)+Number(row.trustNet)+Number(row.dealerNet);
  if (Math.abs(actorSum-Number(row.institutionTotalNet))>1e-6) return {state:"INVARIANT_VIOLATION",reason:"ACTOR_SUM_NE_INSTITUTION_TOTAL"};
  const flowSignature=[
    Number(row.foreignBuyDays),Number(row.trustBuyDays),Number(row.dealerBuyDays),
    Math.sign(Number(row.foreignNet)),Math.sign(Number(row.trustNet)),Math.sign(Number(row.dealerNet)),
    Math.sign(Number(row.institutionTotalNet))
  ].join("|");
  return {
    state:"CADENCE_PROVENANCE_COMPLETE",
    scanDate:String(row.scanDate),symbol:String(row.symbol),ownershipVintage:String(row.chipAsOfDate),
    ownershipLevel:Number(row.chipConcentration),flowSignature
  };
}

export function summarizeCadence(rows = []) {
  const classified=rows.map(classifyCadenceRow);
  const clean=classified.filter(x=>x.state==="CADENCE_PROVENANCE_COMPLETE");
  const unknown=classified.length-clean.length;
  const bySymbol=new Map();
  for(const x of clean){const a=bySymbol.get(x.symbol)||[];a.push(x);bySymbol.set(x.symbol,a);}
  let repeatedOwnershipExposureRows=0, ownershipUpdateTransitions=0, flowChangesWithinSameVintage=0;
  const vintageKeys=new Set(),scanDateKeys=new Set();
  for(const [symbol,a] of bySymbol){
    a.sort((x,y)=>x.scanDate.localeCompare(y.scanDate));
    let prev=null;
    for(const x of a){
      vintageKeys.add(symbol+"|"+x.ownershipVintage);scanDateKeys.add(x.scanDate);
      if(prev){
        if(x.ownershipVintage===prev.ownershipVintage){
          repeatedOwnershipExposureRows++;
          if(x.flowSignature!==prev.flowSignature) flowChangesWithinSameVintage++;
        } else ownershipUpdateTransitions++;
      }
      prev=x;
    }
  }
  return {
    state:unknown ? "PARTIAL_UNKNOWN" : "COMPLETE_INPUT",
    rows:classified.length,cleanRows:clean.length,unknownRows:unknown,
    independentOwnershipVintageUnits:vintageKeys.size,
    independentScanDates:scanDateKeys.size,
    repeatedOwnershipExposureRows,ownershipUpdateTransitions,flowChangesWithinSameVintage,
    inferenceGuard:"Repeated scanDates sharing chipAsOfDate are not independent ownership updates; flow may still change by scanDate.",
    outcomesUsed:false,formalChanged:false
  };
}
