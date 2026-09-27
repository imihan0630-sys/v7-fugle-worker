import fs from "node:fs";
import {decomposeRiskConcentration} from "../research/risk_concentration_bridge_v0_1.mjs";

const src=JSON.parse(fs.readFileSync("research/entry_reference_risk_sensitivity_production_receipt_20260928.json","utf8"));
const modes={};
for(const [name,m] of Object.entries(src.modes||{})){
  modes[name]=decomposeRiskConcentration({
    selectedCount:src.selectedCount,
    currentHHI:m.currentHHI,
    equalCapitalHHI:m.equalCapitalHHI,
    globalMinHHI:m.globalMinHHI
  });
}
console.log(JSON.stringify({
  ok:true,
  schemaVersion:"RISK_CONCENTRATION_BRIDGE_AUDIT_V0_1",
  sourceReceipt:"entry_reference_risk_sensitivity_production_receipt_20260928.json",
  scanDate:src.scanDate,
  modes,
  interpretation:"Descriptive bridge only: equal-capital reveals stop-geometry contribution imbalance; current-minus-equal isolates the incremental HHI associated with current sizing on the same names. Do not call these causal or independent components."
},null,2));
