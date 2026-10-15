// Read-only research admission gate. Never changes S2 strategy/runtime or System1 Formal.
import {readFileSync} from "node:fs";
const MATRIX="system2/migration/evidence/S2_M07_D08_FOUR_FAMILIES_EVIDENCE_ADMISSION_MATRIX_20261015_V0_1.json";
const FAMILIES=["TWSE_VALUATION_HISTORY_V0_1","TWSE_DAILY_VALUATION_YEAR_V0_1","TWSE_HISTORICAL_VALUATION_PERCENTILE_SNAPSHOT_V0_1","TWSE_SEMANTIC_UNIVERSE_V0_2"];
const guard=x=>{throw Error("M07_D08_ADMISSION_"+x)};
export function auditAdmission(matrix){
 if(!matrix||matrix.schemaVersion!=="S2_M07_D08_FOUR_TECHNICAL_FAMILIES_EVIDENCE_ADMISSION_MATRIX_20261015_V0_1"||!Array.isArray(matrix.families))guard("SCHEMA");
 if(matrix.families.length!==4||new Set(matrix.families.map(x=>x.family)).size!==4||matrix.families.some(x=>!FAMILIES.includes(x.family)))guard("FAMILY_SET");
 if(matrix.sourceR2SingleNonAtomicListedObjects!==26321||matrix.sourceOriginalG3ManifestPresenceAndListedSizeMatches!==25823||matrix.actualOriginalContentByteShaCrossMatchedToG3D1!==8)guard("SOURCE_PROOF_SCOPE_CHANGED");
 if(matrix.baseGuardrails?.independentAuditAccepted!==false||matrix.baseGuardrails?.noHistoryPromotionWithoutWriterFirstKnownAtPITAndIndependentAudit!==true||matrix.baseGuardrails?.targetR2LastAuthenticated!=="NOT_ENTITLED")guard("BASE_GUARDRAILS");
 const expected={"TWSE_VALUATION_HISTORY_V0_1":[18,123720095],"TWSE_DAILY_VALUATION_YEAR_V0_1":[13,35599291],"TWSE_HISTORICAL_VALUATION_PERCENTILE_SNAPSHOT_V0_1":[44,6993107],"TWSE_SEMANTIC_UNIVERSE_V0_2":[1,10556]};
 const rows=matrix.families.map(f=>{
  const [count,bytes]=expected[f.family];
  if(f.count!==count||f.listedBytes!==bytes||f.historicalResearchAdmission!=="DENIED_PENDING_PROVENANCE"||f.pointInTimeFirstKnownAt!=="UNKNOWN"||f.originalG3D1ManifestSHAJoin!=="NOT_ESTABLISHED")guard("UNQUALIFIED_SOURCE_PROMOTION");
  if(f.sourceWriterAttribution!=="UNKNOWN"&&f.sourceWriterAttribution!=="UNKNOWN_FOR_THESE_13")guard("WRITER_UNEVIDENCED");
  if(f.bodySHAAgainstOriginalR2MetadataMatched>1||f.bodySHAAgainstOriginalR2MetadataMatched<0)guard("BODY_SCOPE_DRIFT");
  return {family:f.family,objects:count,listedBytes:bytes,sourceWriterVerified:false,firstKnownAtPITVerified:false,originalD1ByteSHAJoined:false,historyAdmitted:false};
 });
 return {schemaVersion:"S2_M07_D08_FOUR_FAMILIES_FAIL_CLOSED_ADMISSION_V0_1",status:"4_OF_4_DENIED_PENDING_PROVENANCE__NO_FORMAL_OR_PIT_PROMOTION",objects:76,listedBytes:166323049,rows,admitted:0,denied:4,sourceR2Calls:0,d1Calls:0,writes:0,formalAuditAccepted:false};
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href){
 const result=auditAdmission(JSON.parse(readFileSync(MATRIX,"utf8")));
 process.stdout.write(JSON.stringify(result)+"\n");
}
