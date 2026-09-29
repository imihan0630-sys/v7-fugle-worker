export function validateMixedLotReceipt(r) {
  const errors=[]; const unknown=[];
  if (!r || !Number.isInteger(r.intendedShares) || r.intendedShares<=0) errors.push("INVALID_PARENT_SHARES");
  if (!r?.signalEventId) unknown.push("MISSING_SIGNAL_LINK");
  if (!Array.isArray(r?.legs)) errors.push("MISSING_LEGS");
  const legs=Array.isArray(r?.legs)?r.legs:[];
  const expectedReg=Math.floor((r?.intendedShares||0)/1000)*1000;
  const expectedOdd=(r?.intendedShares||0)%1000;
  const seen=new Set(); let total=0;
  for (const leg of legs) {
    if (!Number.isInteger(leg.intendedShares)||leg.intendedShares<=0) errors.push("INVALID_LEG_SHARES");
    total+=Number.isFinite(leg.intendedShares)?leg.intendedShares:0;
    if (leg.mechanism==="REGULAR" && leg.intendedShares!==expectedReg) errors.push("REGULAR_DECOMPOSITION_MISMATCH");
    if (leg.mechanism==="ODD_LOT" && leg.intendedShares!==expectedOdd) errors.push("ODD_DECOMPOSITION_MISMATCH");
    if (leg.benchmarkMechanism && leg.benchmarkMechanism!==leg.mechanism) errors.push("BENCHMARK_MECHANISM_MISMATCH");
    if (!leg.mechanismEligibleAtProvenance) unknown.push("MISSING_ELIGIBILITY_PROVENANCE");
    let filled=0;
    for (const f of leg.fills||[]) {
      if (!f.brokerFillId) unknown.push("MISSING_FILL_ID");
      else if (seen.has(f.brokerFillId)) errors.push("DUPLICATE_FILL_ID");
      else seen.add(f.brokerFillId);
      if (f.sourceType==="SIMULATED_DISCLOSURE") errors.push("SIMULATED_EVENT_AS_FILL");
      if (!Number.isInteger(f.shares)||f.shares<=0) errors.push("INVALID_FILL_SHARES"); else filled+=f.shares;
      if (leg.mechanismEligibleAt && f.fillAt && Date.parse(f.fillAt)<Date.parse(leg.mechanismEligibleAt)) errors.push("FILL_BEFORE_ELIGIBILITY");
    }
    if (filled>leg.intendedShares) errors.push("OVERFILL");
    if (filled<leg.intendedShares && leg.coverageComplete!==true) unknown.push("NONFILL_COVERAGE_INCOMPLETE");
    for (const o of leg.orders||[]) if (o.replacementOfOrderId && !(leg.orders||[]).some(x=>x.orderId===o.replacementOfOrderId)) errors.push("REPLACEMENT_LINEAGE_INVALID");
  }
  if (total!==r?.intendedShares) errors.push("PARENT_QUANTITY_MISMATCH");
  if (expectedReg>0 && !legs.some(x=>x.mechanism==="REGULAR")) errors.push("MISSING_REGULAR_LEG");
  if (expectedOdd>0 && !legs.some(x=>x.mechanism==="ODD_LOT")) errors.push("MISSING_ODD_LEG");
  return {valid:errors.length===0, attributionEligible:errors.length===0&&unknown.length===0, errors:[...new Set(errors)], unknown:[...new Set(unknown)]};
}
