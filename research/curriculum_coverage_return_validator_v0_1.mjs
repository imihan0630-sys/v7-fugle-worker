export const ALLOWED_RECOMMENDATIONS = Object.freeze([
  "ADD_MODULE",
  "EXTEND_EXISTING_SCOPE",
  "MERGE_INTO_EXISTING",
  "NOT_A_GAP",
  "EVIDENCE_INSUFFICIENT"
]);

export const STRUCTURAL_RECOMMENDATIONS = Object.freeze([
  "ADD_MODULE",
  "EXTEND_EXISTING_SCOPE",
  "MERGE_INTO_EXISTING"
]);

export const COVERAGE_STATES = Object.freeze([
  "PENDING_SPECIALIST_RETURN",
  "PARTIAL_EVIDENCE_RECEIVED",
  "RETURN_ACCEPTED_FOR_INTAKE",
  "COUNTERPART_OR_DEPENDENCY_REQUIRED",
  "DEPENDENCY_AUDIT_PENDING",
  "OWNER_APPROVAL_REQUIRED",
  "TERMINAL_DECISION_READY",
  "CANONICAL_UPDATE_COMPLETE",
  "CLOSED_NO_STRUCTURAL_CHANGE"
]);

const ALLOWED_TRANSITIONS = new Set([
  "PENDING_SPECIALIST_RETURN->PARTIAL_EVIDENCE_RECEIVED",
  "PENDING_SPECIALIST_RETURN->RETURN_ACCEPTED_FOR_INTAKE",
  "PARTIAL_EVIDENCE_RECEIVED->PARTIAL_EVIDENCE_RECEIVED",
  "PARTIAL_EVIDENCE_RECEIVED->RETURN_ACCEPTED_FOR_INTAKE",
  "RETURN_ACCEPTED_FOR_INTAKE->COUNTERPART_OR_DEPENDENCY_REQUIRED",
  "RETURN_ACCEPTED_FOR_INTAKE->DEPENDENCY_AUDIT_PENDING",
  "COUNTERPART_OR_DEPENDENCY_REQUIRED->DEPENDENCY_AUDIT_PENDING",
  "DEPENDENCY_AUDIT_PENDING->OWNER_APPROVAL_REQUIRED",
  "DEPENDENCY_AUDIT_PENDING->TERMINAL_DECISION_READY",
  "OWNER_APPROVAL_REQUIRED->TERMINAL_DECISION_READY",
  "TERMINAL_DECISION_READY->CANONICAL_UPDATE_COMPLETE",
  "TERMINAL_DECISION_READY->CLOSED_NO_STRUCTURAL_CHANGE"
]);

const SECTION_SPECS = Object.freeze([
  {key:"exactKnowledgeDefinition", number:1, needle:"Exact Knowledge Definition"},
  {key:"overlapMatrix", number:2, needle:"Existing-module Overlap Matrix"},
  {key:"scopeInsufficient", number:3, needle:"Why Current Scope Is Insufficient"},
  {key:"taiwanDataFeasibility", number:4, needle:"Taiwan Data Feasibility"},
  {key:"pitReplay", number:5, needle:"PIT / Replay Implication"},
  {key:"decisionRole", number:6, needle:"Decision Role"},
  {key:"antiDoubleCount", number:7, needle:"Anti-double-count Rule"},
  {key:"proposedOwner", number:8, needle:"Proposed Owner"},
  {key:"maturityStartingPoint", number:9, needle:"Maturity Starting Point"},
  {key:"terminalRecommendation", number:10, needle:"Terminal Recommendation"}
]);

const REQUIRED_HEADER_LABELS = Object.freeze([
  "Candidate ID",
  "Domain",
  "Specialist room",
  "Return artifact path",
  "Evidence cutoff",
  "Current candidate class",
  "Proposed terminal recommendation"
]);

function normalizeLine(s){
  return String(s ?? "").replace(/\r/g,"").trim();
}

function escapeRegex(s){
  return String(s).replace(/[.*+?^$()|[\]\\{}]/g,"\\$&");
}

function extractHeaderValue(markdown,label){
  const re=new RegExp("^-\\s*"+escapeRegex(label)+"\\s*:\\s*(.+)$","mi");
  const m=String(markdown).match(re);
  return m ? normalizeLine(m[1]) : null;
}

function headingIndex(lines,spec){
  const exact=spec.needle.toLowerCase();
  for(let i=0;i<lines.length;i++){
    const line=lines[i].trim();
    if(!/^#{2,4}\s+/.test(line)) continue;
    const body=line.replace(/^#{2,4}\s+/,"").trim().toLowerCase();
    if(body.includes(exact)) return i;
  }
  return -1;
}

function extractSections(markdown){
  const lines=String(markdown).replace(/\r/g,"").split("\n");
  const positions=SECTION_SPECS.map(spec=>({...spec,index:headingIndex(lines,spec)}));
  const result={};
  for(let i=0;i<positions.length;i++){
    const p=positions[i];
    if(p.index<0){ result[p.key]=null; continue; }
    let end=lines.length;
    for(let j=i+1;j<positions.length;j++){
      if(positions[j].index>p.index){
        end=Math.min(end,positions[j].index);
        break;
      }
    }
    result[p.key]=lines.slice(p.index+1,end).join("\n").trim();
  }
  return result;
}

function uniqueRecommendationTokens(text){
  return ALLOWED_RECOMMENDATIONS.filter(x=>new RegExp("\\b"+x+"\\b").test(String(text)));
}

export function validateCoverageSpecialistReturnMarkdown({
  markdown,
  expectedCandidateId=null,
  expectedDomain=null,
  expectedArtifactPath=null
}={}){
  const errors=[];
  const warnings=[];
  const src=String(markdown ?? "");

  if(!src.trim()){
    return {ok:false,status:"BLOCKED_EMPTY_RETURN",errors:["EMPTY_RETURN"],warnings,terminalRecommendation:null,sections:{}};
  }

  const header={};
  for(const label of REQUIRED_HEADER_LABELS){
    header[label]=extractHeaderValue(src,label);
    if(!header[label]) errors.push("MISSING_HEADER:"+label);
  }

  const candidateId=header["Candidate ID"];
  const domain=header["Domain"];
  const artifactPath=header["Return artifact path"];
  const headerRecommendation=header["Proposed terminal recommendation"];

  if(candidateId && !/^COV-(0[1-9]|1[0-2])$/.test(candidateId)) errors.push("INVALID_CANDIDATE_ID");
  if(domain && !/^D(0[1-9]|1[0-9]|2[0-2])$/.test(domain)) errors.push("INVALID_DOMAIN");
  if(artifactPath && !/^research\/.+\.md$/.test(artifactPath)) errors.push("INVALID_ARTIFACT_PATH");

  if(expectedCandidateId && candidateId!==expectedCandidateId) errors.push("CANDIDATE_ID_MISMATCH");
  if(expectedDomain && domain!==expectedDomain) errors.push("DOMAIN_MISMATCH");
  if(expectedArtifactPath && artifactPath!==expectedArtifactPath) errors.push("ARTIFACT_PATH_MISMATCH");

  const sections=extractSections(src);
  for(const spec of SECTION_SPECS){
    const body=sections[spec.key];
    if(body===null) errors.push("MISSING_SECTION:"+spec.key);
    else if(!body.trim()) errors.push("EMPTY_SECTION:"+spec.key);
  }

  const terminalTokens=uniqueRecommendationTokens(sections.terminalRecommendation ?? "");
  if(terminalTokens.length!==1) errors.push("TERMINAL_RECOMMENDATION_MUST_BE_EXACTLY_ONE");
  const terminalRecommendation=terminalTokens.length===1 ? terminalTokens[0] : null;

  if(headerRecommendation){
    if(!ALLOWED_RECOMMENDATIONS.includes(headerRecommendation)) errors.push("INVALID_HEADER_RECOMMENDATION");
    if(terminalRecommendation && headerRecommendation!==terminalRecommendation) errors.push("HEADER_TERMINAL_RECOMMENDATION_MISMATCH");
  }

  const unknownCoercionPatterns=[
    /UNKNOWN\s*(?:=|->|→)\s*0\b/i,
    /UNKNOWN\s*(?:=|->|→)\s*BAD\b/i,
    /UNKNOWN\s*(?:=|->|→)\s*(?:NO[-_ ]?EVENT|NONE)\b/i
  ];
  if(unknownCoercionPatterns.some(re=>re.test(src))) errors.push("UNKNOWN_COERCION_FORBIDDEN");

  if(sections.taiwanDataFeasibility && !/(source|來源|authority|權威|access|存取|history|歷史|data|資料)/i.test(sections.taiwanDataFeasibility)){
    warnings.push("TAIWAN_DATA_SECTION_HAS_NO_OBVIOUS_SOURCE_SEMANTICS");
  }
  if(sections.pitReplay && !/(knownAt|capturedAt|vintage|PIT|Replay|重播|時點|UNKNOWN)/i.test(sections.pitReplay)){
    warnings.push("PIT_REPLAY_SECTION_HAS_NO_OBVIOUS_CLOCK_SEMANTICS");
  }
  if(sections.antiDoubleCount && !/(double|重複|overlap|shared|same|同一|duplicate)/i.test(sections.antiDoubleCount)){
    warnings.push("ANTI_DOUBLE_COUNT_SECTION_MAY_BE_TOO_VAGUE");
  }

  return {
    ok:errors.length===0,
    status:errors.length===0 ? "RETURN_CONTRACT_COMPLETE" : "BLOCKED_RETURN_CONTRACT_INCOMPLETE",
    errors,
    warnings,
    terminalRecommendation,
    header,
    sections
  };
}

function hasNonEmpty(o,key){
  const v=o?.[key];
  if(Array.isArray(v)) return v.length>0;
  return v!==null && v!==undefined && String(v).trim()!=="";
}

export function validateCoverageStateTransition({
  fromState,
  toState,
  metadata={},
  terminalRecommendation=null
}={}){
  const errors=[];
  const warnings=[];

  if(!COVERAGE_STATES.includes(fromState)) errors.push("INVALID_FROM_STATE");
  if(!COVERAGE_STATES.includes(toState)) errors.push("INVALID_TO_STATE");

  if(COVERAGE_STATES.includes(fromState) && COVERAGE_STATES.includes(toState)){
    if(!ALLOWED_TRANSITIONS.has(fromState+"->"+toState)) errors.push("ILLEGAL_STATE_TRANSITION");
  }

  const requiredMeta=[
    "candidateId","changedAt","sourceArtifacts","evidenceCutoff","actorRoom","reason","canonicalImpact"
  ];
  for(const k of requiredMeta){
    if(!hasNonEmpty(metadata,k)) errors.push("MISSING_TRANSITION_METADATA:"+k);
  }

  if(metadata.candidateId && !/^COV-(0[1-9]|1[0-2])$/.test(metadata.candidateId)){
    errors.push("INVALID_TRANSITION_CANDIDATE_ID");
  }

  if(terminalRecommendation!==null && !ALLOWED_RECOMMENDATIONS.includes(terminalRecommendation)){
    errors.push("INVALID_TERMINAL_RECOMMENDATION");
  }

  const structural=STRUCTURAL_RECOMMENDATIONS.includes(terminalRecommendation);

  if(fromState==="DEPENDENCY_AUDIT_PENDING" && toState==="TERMINAL_DECISION_READY" && structural){
    errors.push("STRUCTURAL_DECISION_MUST_PASS_OWNER_APPROVAL");
  }

  if(fromState==="OWNER_APPROVAL_REQUIRED" && toState==="TERMINAL_DECISION_READY"){
    if(!hasNonEmpty(metadata,"ownerApprovalArtifact")) errors.push("OWNER_APPROVAL_ARTIFACT_REQUIRED");
    if(!structural) warnings.push("OWNER_APPROVAL_PATH_WITH_NONSTRUCTURAL_RECOMMENDATION");
  }

  if(toState==="OWNER_APPROVAL_REQUIRED"){
    if(!structural) errors.push("OWNER_APPROVAL_ONLY_FOR_STRUCTURAL_RECOMMENDATION");
    for(const k of ["dependencyAuditArtifact","overlapResult","antiOrphanResult","owner"]){
      if(!hasNonEmpty(metadata,k)) errors.push("MISSING_STRUCTURAL_GATE:"+k);
    }
  }

  if(toState==="CANONICAL_UPDATE_COMPLETE"){
    if(!structural) errors.push("CANONICAL_UPDATE_REQUIRES_STRUCTURAL_RECOMMENDATION");
    for(const k of ["commitSha","ownerApprovalArtifact","dependencyAuditArtifact","overlapResult","antiOrphanResult","owner"]){
      if(!hasNonEmpty(metadata,k)) errors.push("MISSING_CANONICAL_UPDATE_GATE:"+k);
    }
  }

  if(toState==="CLOSED_NO_STRUCTURAL_CHANGE"){
    if(!["NOT_A_GAP","EVIDENCE_INSUFFICIENT"].includes(terminalRecommendation)){
      errors.push("CLOSED_NO_STRUCTURAL_CHANGE_REQUIRES_NONSTRUCTURAL_TERMINAL");
    }
  }

  if(toState==="RETURN_ACCEPTED_FOR_INTAKE" && metadata.returnContractComplete!==true){
    errors.push("RETURN_CONTRACT_COMPLETE_FLAG_REQUIRED");
  }

  return {
    ok:errors.length===0,
    status:errors.length===0 ? "TRANSITION_ALLOWED" : "TRANSITION_BLOCKED",
    errors,
    warnings,
    structuralRecommendation:structural
  };
}
