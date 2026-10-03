import {evaluateFormalSwitchMaturity,FORMAL_SWITCH_MATURITY_V0_1} from "./system1_evidence_automation_v0_1.mjs";

const DATE=/^\d{4}-\d{2}-\d{2}$/;
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const uniq=xs=>[...new Set(xs)];

function validPacket(p){
  return p?.schemaVersion==="SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1"&&
    p?.researchOnly===true&&p?.formalCoreLocked===true&&DATE.test(String(p?.sourceSessionDate||""))&&
    DATE.test(String(p?.targetTradeDate||""))&&typeof p?.generationId==="string"&&p.generationId.length>0&&
    p?.cohort?.n>=0&&Array.isArray(p?.cohort?.symbols)&&p.cohort.symbols.length===p.cohort.n&&
    p?.capture?.audit?.schemaVersion==="SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_3";
}
function packetComplete(p){
  if(!validPacket(p)) return false;
  const n=Number(p.cohort.n),audit=p.capture.audit;
  return audit.eligibleN===n&&audit.readyN===n&&audit.blockedN===0&&
    Number(p.capture.barRows)>=n*17&&Number(p.capture.quoteRows)>=n*17&&
    p?.c5?.denominatorN>0;
}
function validD5(r){
  return r?.schemaVersion==="SYSTEM1_D5_MATURITY_RECEIPT_V0_1"&&r?.mature===true&&
    DATE.test(String(r?.scanDate||""))&&typeof r?.symbol==="string"&&r.symbol.length>0&&
    typeof r?.parentGenerationId==="string"&&r.parentGenerationId.length>0&&
    finite(r?.afterCostReturnPct)!==null&&finite(r?.mfePct)!==null&&finite(r?.maePct)!==null&&
    Number.isFinite(Date.parse(String(r?.observedAt||"")));
}
function validRegime(r){
  return r?.schemaVersion==="SYSTEM1_MARKET_REGIME_RECEIPT_V0_1"&&r?.verified===true&&
    DATE.test(String(r?.scanDate||""))&&typeof r?.regime==="string"&&r.regime.trim().length>0&&
    Number.isFinite(Date.parse(String(r?.knownAt||"")));
}
function progress(value,target){return Math.min(100,Math.round((Math.max(0,value)/target)*10000)/100);}

export function buildSystem1FormalMaturityLedger({
  packets=[],d5Receipts=[],regimeReceipts=[],validation={}
}={}){
  if(!Array.isArray(packets)||!Array.isArray(d5Receipts)||!Array.isArray(regimeReceipts))
    throw new Error("SYSTEM1_MATURITY_ARRAY_INPUTS_REQUIRED");

  const packetKeys=new Set(),validPackets=[],invalidPacketN=[];
  for(const p of packets){
    if(!validPacket(p)){invalidPacketN.push(p?.targetTradeDate||null);continue;}
    const key=p.sourceSessionDate+"|"+p.generationId;
    if(packetKeys.has(key)) throw new Error("SYSTEM1_MATURITY_DUPLICATE_PACKET");
    packetKeys.add(key);validPackets.push(p);
  }
  const completedPackets=validPackets.filter(packetComplete);
  const scanDates=uniq(completedPackets.map(p=>p.sourceSessionDate)).sort();

  const d5Keys=new Set(),validD5Rows=[],invalidD5N=[];
  for(const r of d5Receipts){
    if(!validD5(r)){invalidD5N.push((r?.scanDate||"?")+"|"+(r?.symbol||"?"));continue;}
    const key=r.scanDate+"|"+r.symbol+"|"+r.parentGenerationId;
    if(d5Keys.has(key)) throw new Error("SYSTEM1_MATURITY_DUPLICATE_D5_ROW");
    d5Keys.add(key);validD5Rows.push(r);
  }

  const regimeKeys=new Set(),validRegimes=[];
  for(const r of regimeReceipts){
    if(!validRegime(r)) continue;
    if(regimeKeys.has(r.scanDate)) throw new Error("SYSTEM1_MATURITY_DUPLICATE_REGIME_DATE");
    regimeKeys.add(r.scanDate);validRegimes.push(r);
  }
  const eligibleD5Rows=validD5Rows.filter(r=>scanDates.includes(r.scanDate));
  const regimeMap=new Map(validRegimes.map(r=>[r.scanDate,r.regime]));
  const completedRegimes=uniq(scanDates.map(d=>regimeMap.get(d)).filter(Boolean)).sort();
  const years=uniq(scanDates.map(d=>Number(d.slice(0,4)))).sort();

  const gate=evaluateFormalSwitchMaturity({
    matureD5Rows:eligibleD5Rows.length,
    completeProspectiveSnapshots:completedPackets.length,
    scanDates,calendarYears:years,marketRegimes:completedRegimes,
    dateClusterDirectionAgreementPct:validation?.dateClusterDirectionAgreementPct??null,
    sourceCoveragePass:validation?.sourceCoveragePass===true,
    purgedHoldoutPass:validation?.purgedHoldoutPass===true,
    multipleTestingPass:validation?.multipleTestingPass===true,
    redundancyPass:validation?.redundancyPass===true,
    costStressPass:validation?.costStressPass===true,
    afterCostReturnAvailable:validation?.afterCostReturnAvailable===true,
    drawdownTailAvailable:validation?.drawdownTailAvailable===true,
    mfeMaeAvailable:validation?.mfeMaeAvailable===true,
    triggerFillFunnelAvailable:validation?.triggerFillFunnelAvailable===true,
    turnoverConcentrationAvailable:validation?.turnoverConcentrationAvailable===true,
    deploymentReserveAvailable:validation?.deploymentReserveAvailable===true,
    brokerFillsCashComplete:validation?.brokerFillsCashComplete===true
  });

  const t=FORMAL_SWITCH_MATURITY_V0_1;
  return {
    schemaVersion:"SYSTEM1_FORMAL_MATURITY_LEDGER_V0_1",
    countingRules:{
      prospectiveSnapshot:"ONE_COMPLETE_TARGET_SESSION_PACKET_COUNTS_AT_MOST_ONE",
      d5Row:"ONE_VERIFIED_MATURE_SYMBOL_SCAN_GENERATION_ROW",
      independentScanDate:"UNIQUE_SOURCE_SESSION_DATE_FROM_COMPLETE_PACKET",
      calendarYear:"UNIQUE_YEAR_FROM_COMPLETE_SCAN_DATE",
      marketRegime:"VERIFIED_REGIME_RECEIPT_ON_COMPLETE_SCAN_DATE_ONLY"
    },
    observed:{
      validPacketN:validPackets.length,completeProspectiveSnapshots:completedPackets.length,
      independentScanDates:scanDates.length,matureD5Rows:eligibleD5Rows.length,
      calendarYears:years.length,marketRegimes:completedRegimes.length,
      scanDates,years,regimes:completedRegimes
    },
    progressPct:{
      matureD5Rows:progress(eligibleD5Rows.length,t.matureD5Rows),
      completeProspectiveSnapshots:progress(completedPackets.length,t.completeProspectiveSnapshots),
      independentScanDates:progress(scanDates.length,t.independentScanDates),
      calendarYears:progress(years.length,t.calendarYears),
      marketRegimes:progress(completedRegimes.length,t.marketRegimes)
    },
    exclusions:{
      invalidPacketN:invalidPacketN.length,invalidPacketKeys:invalidPacketN,
      incompletePacketN:validPackets.length-completedPackets.length,
      invalidD5N:invalidD5N.length,invalidD5Keys:invalidD5N,
      d5OutsideCompleteScanDates:validD5Rows.filter(r=>!scanDates.includes(r.scanDate)).map(r=>r.scanDate+"|"+r.symbol)
    },
    gate,
    interpretation:{
      threeSymbolsInOneC3CohortDoNotCountAsThreeSnapshots:true,
      c3SameDaySimulationDoesNotCountAsMatureD5:true,
      incompletePacketDoesNotCountAsZeroOrNegativeDay:true,
      missingRegimeDoesNotInferDefaultRegime:true,
      passingThresholdsStillRequiresClassCReview:true
    },
    formalOptimizationCandidate:gate.formalOptimizationCandidate,
    autoSwitchAuthorized:false,formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
