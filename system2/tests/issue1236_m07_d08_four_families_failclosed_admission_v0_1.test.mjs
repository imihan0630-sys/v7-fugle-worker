import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {auditAdmission} from "../migration/issue1236_m07_d08_four_families_failclosed_admission_v0_1.mjs";
const base=JSON.parse(readFileSync("system2/migration/evidence/S2_M07_D08_FOUR_FAMILIES_EVIDENCE_ADMISSION_MATRIX_20261015_V0_1.json","utf8"));
const clone=()=>structuredClone(base);
const good=auditAdmission(base);
assert.equal(good.denied,4);assert.equal(good.admitted,0);assert.equal(good.objects,76);assert.equal(good.listedBytes,166323049);
assert.ok(good.rows.every(r=>!r.historyAdmitted&&!r.firstKnownAtPITVerified&&!r.originalD1ByteSHAJoined));
for(const tweak of [
 d=>{d.families[0].historicalResearchAdmission="ADMITTED"},
 d=>{d.families[1].sourceWriterAttribution="VERIFIED"},
 d=>{d.families[2].pointInTimeFirstKnownAt="2026-10-07"},
 d=>{d.families[3].originalG3D1ManifestSHAJoin="VERIFIED"},
 d=>{d.families[0].bodySHAAgainstOriginalR2MetadataMatched=18},
 d=>{d.families[1].listedBytes+=1},
 d=>{d.families.pop()},
 d=>{d.baseGuardrails.independentAuditAccepted=true},
 d=>{d.actualOriginalContentByteShaCrossMatchedToG3D1=25823},
 d=>{d.baseGuardrails.targetR2LastAuthenticated="ENTITLED"}
]){let x=clone();tweak(x);assert.throws(()=>auditAdmission(x),/M07_D08_ADMISSION_/);}
console.log("M07 four-family fail-closed historical PIT and writer admission refusal PASS");