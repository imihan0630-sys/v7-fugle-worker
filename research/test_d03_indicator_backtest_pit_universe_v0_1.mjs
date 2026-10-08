import fs from 'node:fs';
import crypto from 'node:crypto';

const fixture=JSON.parse(fs.readFileSync(new URL('./d03_indicator_backtest_pit_universe_cases_20261008_v0_1.json',import.meta.url)));
const hex64=/^[0-9a-f]{64}$/;
const clone=x=>structuredClone(x);
const setPath=(obj,path,value)=>{
  const parts=path.split('.');
  let cur=obj;
  for(let i=0;i<parts.length-1;i++) cur=cur[parts[i]];
  cur[parts.at(-1)]=value;
};
const stable=x=>JSON.stringify(x,Object.keys(x).sort());
const hash=x=>crypto.createHash('sha256').update(stable(x)).digest('hex');

function qualifies(x){
  const required=['datasetManifestHash','policyRegistrationHash','evaluatorCodeHash','factorDefinitionHash','regimeVersionHash','executionAssumptionHash','costModelHash'];
  if(required.some(k=>!hex64.test(x.planIdentity?.[k]||''))) return false;
  if(!hex64.test(x.planHash||'')) return false;
  const u=x.universeReceipt;
  if(!u||u.marketDate!==x.marketDate||u.decisionTimestamp!==x.decisionTimestamp) return false;
  if(!hex64.test(u.registryHash||'')||!hex64.test(u.historicalUniverseSnapshotHash||'')||!hex64.test(u.receiptHash||'')) return false;
  if(u.membershipSourceMode!=='HISTORICAL_PIT') return false;
  const seen=new Set();
  for(const m of u.members||[]){
    if('membershipEndDate' in m||'delistingDate' in m||'effectiveTo' in m) return false;
    const key=m.market+'|'+m.symbol;
    if(seen.has(key)) return false;
    seen.add(key);
    if(!m.membershipId||!hex64.test(m.membershipHash||'')) return false;
    if(m.replayEligible!==true||m.membershipStateAtReplay==='UNKNOWN') return false;
    if(m.excluded===true&&m.exclusionState!=='KNOWN') return false;
    if(m.excluded!==true&&m.exclusionState!=='NONE') return false;
  }
  const eligible=(u.members||[]).filter(m=>m.replayEligible===true&&m.excluded!==true).length;
  if((u.members||[]).length===0&&!u.emptyUniverseProven) return false;
  if(eligible===0&&(u.members||[]).length>0&&x.accounting.zeroSampleCompletion) return false;
  if(x.accounting.eligibleCount!==eligible||x.accounting.accountedCount!==eligible||x.accounting.sampleCount!==eligible||x.accounting.stateCountSum!==eligible) return false;
  if(eligible===0&&x.accounting.zeroSampleCompletion!==true) return false;
  if(eligible>0&&x.accounting.zeroSampleCompletion!==false) return false;
  const c=x.checkpoint;
  if(c.planHash!==x.planHash||!c.checkpointHashValid||!c.partitionHashesValid||!c.rollingDigestValid||!c.completedDatePresent) return false;
  if(!x.factorEvidence.allAvailableByDecision||!x.factorEvidence.allContinuityReadyOrExplicitUnknown) return false;
  if(x.validation.claimType==='OOS'&&x.validation.trainTestDateOverlapCount!==0) return false;
  if(!x.validation.dateClusterAuditComplete||!x.validation.walkForwardOrderValid) return false;
  return true;
}

let passed=0;
for(const c of fixture.cases){
  const x=clone(fixture.base);
  if(c.path) setPath(x,c.path,c.value);
  const actual=qualifies(x);
  if(actual!==c.expected) throw new Error(c.id+': expected '+c.expected+', got '+actual);
  passed++;
}

const allExcluded=clone(fixture.base);
for(const m of allExcluded.universeReceipt.members){m.excluded=true;m.exclusionState='KNOWN';}
allExcluded.accounting={eligibleCount:0,accountedCount:0,sampleCount:0,stateCountSum:0,zeroSampleCompletion:true};
if(qualifies(allExcluded)) throw new Error('all-excluded universe masqueraded as proved empty');

const provedEmpty=clone(fixture.base);
provedEmpty.universeReceipt.members=[];
provedEmpty.universeReceipt.emptyUniverseProven=true;
provedEmpty.accounting={eligibleCount:0,accountedCount:0,sampleCount:0,stateCountSum:0,zeroSampleCompletion:true};
if(!qualifies(provedEmpty)) throw new Error('proved empty PIT universe rejected');

const changedFactor=clone(fixture.base);
changedFactor.planIdentity.factorDefinitionHash='8'.repeat(64);
if(hash(fixture.base.planIdentity)===hash(changedFactor.planIdentity)) throw new Error('factor identity mutation not bound');

console.log(JSON.stringify({
  status:'PASS',
  cases:passed+2,
  currentSurvivorUniverseRejected:true,
  allExcludedZeroSampleRejected:true,
  provedEmptyUniverseAccepted:true,
  factorIdentityMutationChangesPlanInput:true,
  d03MaturityPct:56.7,
  formalCoreImpact:'NONE_LOCKED'
}));
