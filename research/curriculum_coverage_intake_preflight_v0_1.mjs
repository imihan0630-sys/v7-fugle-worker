import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {validateCoverageSpecialistReturnMarkdown} from "./curriculum_coverage_return_validator_v0_1.mjs";

export const COVERAGE_RETURN_ROUTES = Object.freeze([
  {candidateId:"COV-01",domain:"D01",artifactPath:"research/COV01_D01_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-02",domain:"D05",artifactPath:"research/COV02_D05_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-03",domain:"D06",artifactPath:"research/COV03_D06_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-04",domain:"D07",artifactPath:"research/COV04_D07_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-05",domain:"D08",artifactPath:"research/COV05_D08_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-06",domain:"D10",artifactPath:"research/COV06_D10_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-07",domain:"D12",artifactPath:"research/COV07_D12_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-08",domain:"D16",artifactPath:"research/COV08_D16_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-09",domain:"D19",artifactPath:"research/COV09_D19_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-10",domain:"D20",artifactPath:"research/COV10_D20_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-11",domain:"D21",artifactPath:"research/COV11_D21_SPECIALIST_RETURN_V0_1.md"},
  {candidateId:"COV-12",domain:"D22",artifactPath:"research/COV12_D22_SPECIALIST_RETURN_V0_1.md"}
]);

export function scanCoverageReturns({
  root=process.cwd(),
  existsSync=fs.existsSync,
  readFileSync=fs.readFileSync
}={}){
  const rows=[];

  for(const route of COVERAGE_RETURN_ROUTES){
    const abs=path.join(root,route.artifactPath);
    if(!existsSync(abs)){
      rows.push({
        ...route,
        present:false,
        contractStatus:"NOT_PRESENT",
        ok:null,
        errors:[],
        warnings:[]
      });
      continue;
    }

    const markdown=String(readFileSync(abs,"utf8"));
    const validation=validateCoverageSpecialistReturnMarkdown({
      markdown,
      expectedCandidateId:route.candidateId,
      expectedDomain:route.domain,
      expectedArtifactPath:route.artifactPath
    });

    rows.push({
      ...route,
      present:true,
      contractStatus:validation.status,
      ok:validation.ok,
      terminalRecommendation:validation.terminalRecommendation,
      errors:validation.errors,
      warnings:validation.warnings
    });
  }

  const present=rows.filter(x=>x.present).length;
  const valid=rows.filter(x=>x.present && x.ok===true).length;
  const invalid=rows.filter(x=>x.present && x.ok===false).length;
  const missing=rows.length-present;

  return {
    schemaVersion:"CURRICULUM_COVERAGE_INTAKE_PREFLIGHT_V0_1",
    ok:invalid===0,
    status:invalid===0 ? "PREFLIGHT_PASS" : "PREFLIGHT_BLOCKED_INVALID_RETURN",
    routeCount:rows.length,
    present,
    valid,
    invalid,
    missing,
    acceptedForIntake:0,
    note:"RETURN_CONTRACT_COMPLETE is not RETURN_ACCEPTED_FOR_INTAKE; 00-room intake remains required.",
    rows
  };
}

const invokedPath=process.argv[1] ? path.resolve(process.argv[1]) : null;
const selfPath=fileURLToPath(import.meta.url);

if(invokedPath===selfPath){
  const result=scanCoverageReturns();
  console.log(JSON.stringify(result,null,2));
  if(!result.ok) process.exitCode=1;
}
