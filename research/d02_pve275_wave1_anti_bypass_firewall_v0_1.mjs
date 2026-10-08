import {evaluatePve270H001Reopen} from "./d02_pve270_h001_dual_prerequisite_gate_v0_1.mjs";
import {evaluatePve273H20BaselineFreshness} from "./d02_pve273_h20_baseline_freshness_bridge_v0_1.mjs";
import {evaluatePve274H003BaselineSymmetry} from "./d02_pve274_h003_baseline_symmetry_gate_v0_1.mjs";

export const PVE275_SCHEMA="D02_PVE275_WAVE1_ANTI_BYPASS_FIREWALL_V0_1";
const KEYS=new Set(["D02-02:H001","D02-03:H20","D02-06:H003"]);

export function evaluatePve275Wave1AntiBypass(input={}){
  const key=String(input.evidenceKey||"");
  if(!KEYS.has(key)) return Object.freeze({
    schemaVersion:PVE275_SCHEMA,evidenceKey:key,pass:false,state:"UNSUPPORTED_EVIDENCE_KEY",
    reasons:Object.freeze(["UNSUPPORTED_EVIDENCE_KEY"]),outcomeAccessAuthorized:false,
    maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false
  });

  let inner;
  if(key==="D02-02:H001"){
    inner=evaluatePve270H001Reopen({
      candidateMarketDate:input.candidateMarketDate,
      baseline:input.baseline,
      quotaSchedule:input.quotaSchedule,
      outcomeAccessOpened:false,
      maturityPromotionRequested:false
    });
  }else if(key==="D02-03:H20"){
    inner=evaluatePve273H20BaselineFreshness(input.receipt||{},input.context||{});
  }else{
    inner=evaluatePve274H003BaselineSymmetry(input.receipt||{},input.context||{});
  }

  const pass=inner?.pass===true||inner?.reopenEligible===true;
  const reasons=Array.isArray(inner?.reasons)?inner.reasons:[];
  return Object.freeze({
    schemaVersion:PVE275_SCHEMA,
    evidenceKey:key,
    pass,
    state:pass?"WAVE1_PREOUTCOME_ADMISSION_FIREWALL_PASS":"WAVE1_FAIL_CLOSED",
    reasons:Object.freeze([...reasons]),
    innerSchemaVersion:inner?.schemaVersion??null,
    cleanProspectiveRowAuthorized:pass,
    outcomeAccessAuthorized:false,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false,
    legacyGateDirectUseAuthorized:false
  });
}
