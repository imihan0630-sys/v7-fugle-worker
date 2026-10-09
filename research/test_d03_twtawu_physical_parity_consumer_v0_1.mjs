import fs from 'node:fs';

const fixture=JSON.parse(fs.readFileSync(new URL('./d03_twtawu_physical_parity_consumer_cases_20261009_v0_1.json',import.meta.url)));
const clone=x=>structuredClone(x);
const setPath=(o,p,v)=>{if(p)o[p]=v;};

function classify(x){
  const transport=x.physicalSuccess&&x.jsonHttp200&&x.csvHttp200&&x.exactBoundedQueryIdentity&&
    x.sameMarketDateScope&&x.jsonRawHashPresent&&x.csvRawHashPresent&&x.rawByteCountsPositive;
  let positive='UNKNOWN';
  if(transport&&x.rowSetParity&&x.jsonRowCount>0&&x.csvRowCount>0&&x.knownPositivePresentBoth){
    positive=x.sameAuthorityRoot||x.sameProducerRoot
      ?'PASS_L2_SAME_AUTHORITY_PARITY'
      :x.independentBackendProven?'PASS_L4_INDEPENDENT_SEMANTIC_CANDIDATE':'UNKNOWN';
  }else if(transport&&!x.rowSetParity)positive='CONFLICT';

  const emptyParity=transport&&x.rowSetParity&&x.negativeClaimRequested&&
    x.jsonRowCount===0&&x.csvRowCount===0;
  const negativeReady=emptyParity&&x.exportContractIndependentlyPinned&&
    x.rangeExhaustivenessProven&&x.noPaginationTruncationProven&&
    x.revisionCancellationCoverage&&x.sourceCoverageComplete&&x.observedBeforeDecision;
  const w0Ready=negativeReady&&x.symbolSessionCertified&&x.corporateActionAncestryCertified&&
    x.identityTransitionDisposed&&x.continuityReceiptHashBound;
  return {positive,negativeReady,w0Ready};
}

let passed=0;
for(const c of fixture.cases){
  const x=clone(fixture.base);
  setPath(x,c.path,c.value);setPath(x,c.path2,c.value2);setPath(x,c.path3,c.value3);
  Object.assign(x,c.patch||{});
  const actual=classify(x);
  if(actual.positive!==c.expectedPositive||actual.negativeReady!==c.expectedNegativeReady||actual.w0Ready!==c.expectedW0Ready)
    throw new Error(`${c.id}: ${JSON.stringify(actual)}`);
  passed++;
}

const current=classify(fixture.base);
if(current.positive!=='PASS_L2_SAME_AUTHORITY_PARITY'||current.negativeReady||current.w0Ready)
  throw new Error('current physical evidence over-promoted');

console.log(JSON.stringify({
  status:'PASS',cases:passed,
  physicalRunId:fixture.physicalEvidence.runId,
  currentPositiveEvidence:current.positive,
  currentNegativeCompletenessReady:current.negativeReady,
  currentW0Ready:current.w0Ready,
  d03MaturityPct:56.7,
  formalCoreImpact:'NONE_LOCKED'
}));
