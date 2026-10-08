import {readFile,mkdir,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {buildSystem1OperationalAcceptance} from "../research/system1_operational_acceptance_v0_1.mjs";

const paths={
  c1:resolve(process.env.C1_EVIDENCE_OUTPUT||"artifacts/system1-c1-evidence.json"),
  c2:resolve(process.env.C2_EVIDENCE_OUTPUT||"artifacts/system1-c2-paired.json"),
  inventory:resolve(process.env.C1_INVENTORY_OUTPUT||"artifacts/system1-c1-generation-inventory.json"),
  binding:resolve(process.env.FORMAL_C1_BINDING_OUTPUT||"artifacts/system1-formal-c1-binding.json"),
  h1h5:resolve(process.env.H1_H5_READINESS_OUTPUT||"artifacts/system1-h1-h5-readiness.json"),
  output:resolve(process.env.OPERATIONAL_ACCEPTANCE_OUTPUT||"artifacts/system1-operational-acceptance.json")
};
const read=async p=>JSON.parse(await readFile(p,"utf8"));
const [c1,c2,inventory,binding,h1h5]=await Promise.all([
  read(paths.c1),read(paths.c2),read(paths.inventory),read(paths.binding),read(paths.h1h5)
]);
const receipt=buildSystem1OperationalAcceptance({
  trigger:{
    eventName:String(process.env.ACCEPTANCE_EVENT_NAME||""),
    schedule:String(process.env.ACCEPTANCE_SCHEDULE||"")
  },
  observedAt:process.env.ACCEPTANCE_OBSERVED_AT||new Date().toISOString(),
  c1,c2,inventory,binding,h1h5
});
await mkdir(dirname(paths.output),{recursive:true});
await writeFile(paths.output,JSON.stringify(receipt,null,2)+"\n","utf8");
console.log(JSON.stringify({
  ok:receipt.status==="OPERATIONAL_RECOVERY_PASS",status:receipt.status,
  genuineProspective:receipt.genuineProspective,scanDate:receipt.scanDate,generationId:receipt.generationId,
  runtimeVersion:receipt.runtimeVersion,bindingId:receipt.bindingId,populationN:receipt.populationN,
  formalSelectedN:receipt.formalSelectedN,firstBlocker:receipt.firstBlocker,
  blockers:receipt.blockers.map(x=>x.code),output:paths.output,
  formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
}));
if(receipt.status!=="OPERATIONAL_RECOVERY_PASS") process.exitCode=1;
