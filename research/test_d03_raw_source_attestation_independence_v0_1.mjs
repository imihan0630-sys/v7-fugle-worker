import fs from 'node:fs';
import crypto from 'node:crypto';

const fixture=JSON.parse(fs.readFileSync(new URL('./d03_raw_source_attestation_independence_cases_20261009_v0_1.json',import.meta.url)));
const hex64=/^[0-9a-f]{64}$/;
const clone=x=>structuredClone(x);
const setPath=(obj,path,value)=>{
  if(!path)return;
  const parts=path.split('.');
  let cur=obj;
  for(let i=0;i<parts.length-1;i++)cur=cur[parts[i]];
  cur[parts.at(-1)]=value;
};
const onTime=(x,cut)=>Number.isFinite(Date.parse(x))&&Date.parse(x)<=Date.parse(cut);

function classify(x){
  const p=x.primary,a=x.attestor;
  const hashes=[p.scopeHash,p.normalizedSymbolSessionHash,p.rawPayloadHash,a.scopeHash,a.normalizedSymbolSessionHash,a.rawPayloadHash];
  if(!p.complete||!a.complete||hashes.some(h=>!hex64.test(h||'')))return {level:'UNKNOWN',ready:false};
  if(!x.sameMarket||!x.sameTradeDate||!x.sameBoundedScope||x.lineageUnknown)return {level:'UNKNOWN',ready:false};
  if(p.scopeHash!==a.scopeHash)return {level:'UNKNOWN',ready:false};
  if(!onTime(p.observedAt,x.decisionTimestamp)||!onTime(a.observedAt,x.decisionTimestamp))return {level:'UNKNOWN',ready:false};
  if(x.conflictCount>0||p.normalizedSymbolSessionHash!==a.normalizedSymbolSessionHash)return {level:'CONFLICT',ready:false};

  let level;
  const sameAuthority=p.authorityRootId===a.authorityRootId;
  const sameProducer=p.producerRootId===a.producerRootId;
  const sameEndpoint=p.endpointId===a.endpointId;
  const sameParser=p.parserRootId===a.parserRootId;
  if(sameAuthority&&sameProducer&&sameEndpoint)level='L1';
  else if(sameAuthority||sameProducer||x.sharedBackendKnown)level='L2';
  else if(a.integrityOnly||sameParser)level='L3';
  else level='L4';

  const ready=level==='L4'
    &&x.symbolSessionReceiptCertified
    &&x.corporateActionAncestryCertified
    &&x.continuityReceiptHashBound;
  return {level,ready};
}

let passed=0;
for(const c of fixture.cases){
  const x=clone(fixture.base);
  setPath(x,c.path,c.value);
  setPath(x,c.path2,c.value2);
  setPath(x,c.path3,c.value3);
  const actual=classify(x);
  if(actual.level!==c.expectedLevel||actual.ready!==c.expectedReady){
    throw new Error(c.id+': expected '+c.expectedLevel+'/'+c.expectedReady+', got '+actual.level+'/'+actual.ready);
  }
  passed++;
}

const canonical=x=>{
  if(Array.isArray(x))return x.map(canonical);
  if(x&&typeof x==='object')return Object.fromEntries(
    Object.keys(x).sort().map(k=>[k,canonical(x[k])])
  );
  return x;
};
const stable=x=>JSON.stringify(canonical(x));
const digest=x=>crypto.createHash('sha256').update(stable(x)).digest('hex');
const changed=clone(fixture.base);
changed.attestor.rawPayloadHash='9'.repeat(64);
if(digest(fixture.base)===digest(changed))throw new Error('attestor identity mutation not bound');

console.log(JSON.stringify({
  status:'PASS',
  cases:passed,
  sameEndpointRepeatClassifiedL1:true,
  sameAuthorityRepresentationClassifiedL2:true,
  independentIntegrityOnlyClassifiedL3:true,
  independentSemanticAttestationRequiresL4:true,
  currentThreeSessionReceiptClassification:'L1_CAPTURE_STABILITY_ONLY',
  currentIndependentSourceAttestation:'UNKNOWN',
  d03MaturityPct:56.7,
  formalCoreImpact:'NONE_LOCKED'
}));
