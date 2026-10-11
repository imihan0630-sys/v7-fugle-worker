import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const f=JSON.parse(readFileSync(new URL("./d03_source_full_backup_pit_window_cases_20261012_v0_1.json",import.meta.url),"utf8"));

function classify(x){
  if(!x.providerFullExport)return "SOURCE_BACKUP_UNVERIFIED";
  if(!x.plainHashMatchedAfterDecrypt||x.sqliteQuickCheck!=="ok"||
     x.restoredTables!==55||x.restoredIndexes!==63||x.restoredRows!==113222)
    return "SOURCE_BACKUP_CONFLICT";
  if(x.historicalBarRows===0)return "SOURCE_BACKUP_MATERIAL_EMPTY";
  if(x.secureTransferPhysicalReceipt&&!x.independentAuditAccepted)
    return "INVALID_TRANSFER_BEFORE_AUDIT";
  if(x.destinationParityAccepted&&(!x.secureTransferPhysicalReceipt||x.destinationImportedRows!==x.restoredRows))
    return "INVALID_PARITY_ORDER";
  if(x.destinationImportedRows>0&&!x.destinationParityAccepted)
    return "IMPORTED_STORAGE_UNVERIFIED";
  if(x.pitClocksAccepted&&!x.destinationParityAccepted)
    return "INVALID_PIT_ORDER";
  if(x.exactSymbolSessionCoverage&&!x.pitClocksAccepted)
    return "HISTORY_COVERAGE_WITHOUT_PIT";
  if(x.w0Ready&&(!x.pitClocksAccepted||!x.exactSymbolSessionCoverage||
     !x.corporateActionLineage||!x.haltIdentityContinuity))
    return "INVALID_W0_ORDER";
  if(x.bollingerExactParentSessions>=20&&(!x.w0Ready||!x.genuineC1Ready))
    return "HISTORY_ONLY_NOT_BOLLINGER_READY";
  if(x.adxReplayCertified&&(!x.w0Ready||!x.genuineC1Ready))
    return "STATE_ONLY_NOT_ADX_READY";
  if(x.genuineC1Ready&&!x.w0Ready)return "PARENT_ONLY_NOT_INPUT_READY";
  if(x.corporateActionLineage&&!x.pitClocksAccepted)return "ACTION_ONLY_NOT_INPUT_READY";
  if(x.haltIdentityContinuity&&!x.pitClocksAccepted)return "CONTINUITY_ONLY_NOT_INPUT_READY";
  if(x.secureTransferPhysicalReceipt&&x.independentAuditAccepted)
    return "DESTINATION_TRANSFER_PHYSICAL_VERIFIED";
  if(x.independentAuditAccepted)return "SOURCE_BACKUP_INDEPENDENT_AUDIT_ACCEPTED";
  return "SOURCE_FULL_BACKUP_ENGINEER_VERIFIED";
}

assert.equal(f.cases.length,20);
for(const c of f.cases)assert.equal(classify({...f.evidence,...c.mutation}),c.expected,c.id);
assert.equal(f.evidence.frozenDecisionRows,0);
assert.equal(f.evidence.destinationImportedRows,0);
assert.equal(f.evidence.secureTransferCodeMerged,true);
assert.equal(f.evidence.secureTransferPhysicalReceipt,false);
console.log(JSON.stringify({status:"PASS",cases:20,currentState:classify(f.evidence),restoredRows:f.evidence.restoredRows,historicalBarRows:f.evidence.historicalBarRows,maturityPct:56.7,formalCoreImpact:"NONE_LOCKED"}));
