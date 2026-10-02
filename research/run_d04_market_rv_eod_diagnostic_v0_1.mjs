import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runD04EodDiagnosticV0_1 } from "./d04_market_rv_eod_diagnostic_v0_1.mjs";

function arg(name){
  const i=process.argv.indexOf("--"+name);
  return i>=0?process.argv[i+1]:null;
}
export async function main(){
  const marketDate=arg("market-date");
  const output=arg("output")||("system2/artifacts/d04-eod-rv-"+marketDate+".json");
  const report=await runD04EodDiagnosticV0_1({marketDate});
  const absolute=resolve(output);
  await mkdir(dirname(absolute),{recursive:true});
  await writeFile(absolute,JSON.stringify(report,null,2)+"\n","utf8");
  console.log(JSON.stringify({
    result:"PASS",
    marketDate:report.marketDate,
    state:report.state,
    actualObservedAt:report.actualObservedAt,
    evidenceClass:report.evidenceClass,
    promotionGradeProspectiveDateCount:0,
    formalDecisionImpact:false,
  },null,2));
}
if(process.argv[1] && resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
  main().catch((error)=>{console.error(error?.stack||String(error));process.exitCode=1;});
}
