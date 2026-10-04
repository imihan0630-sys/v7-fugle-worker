"""Owner-approved Class-B implementation; concrete PR still needs Production approval."""
from pathlib import Path
import hashlib
path=Path('Worker.js');text=path.read_text(encoding='utf-8')
def replace_once(old,new,label):
    global text
    if text.count(old)!=1: raise SystemExit(f'{label}: expected 1 match, found {text.count(old)}')
    text=text.replace(old,new,1)
def module(filename,exports,prelude='',digest=None):
    s=Path('research',filename).read_text(encoding='utf-8')
    if digest and hashlib.sha256(s.encode()).hexdigest()!=digest: raise SystemExit('Frozen dependency changed: '+filename)
    s='\n'.join(line for line in s.splitlines() if not line.startswith('import ')).replace('export ','')
    return '(()=>{\n'+prelude+'\n'+'\n'.join('  '+line for line in s.splitlines())+'\n  return {'+exports+'};\n})();\n'
replace_once('const VERSION = "8.16.0-zero-pick-prospective-capture";', 'const VERSION = "8.17.0-shadow-cohort-membership";','version')
helpers='\n// BEGIN V8.17 SHADOW COHORT MODULES\n'
helpers+='const SHADOW_CANONICAL='+module('canonical_receipt_hash_v0_1.mjs','canonicalJcsJson,sha256HexUtf8',digest='d8ed1d112f999c098a3d108f55170d6fea4db0347ddbae1a7f62e0250d60145a')
helpers+='const SHADOW_CLASSIFIER='+module('shadow_semantic_classifier_v0_1.mjs','classifyShadowSemanticPopulation,sampleMembershipV2',digest='c6b5fb0917babdcaa0874f5dba294f00a2090f9dc60bbc20375d4aa46dbe82ef')
helpers+='const SHADOW_MEMBERSHIP='+module('system1_shadow_cohort_membership_v0_1.mjs',
    'SHADOW_MEMBERSHIP_VERSION,SHADOW_CAPTURE_VERSION,SHADOW_COMPARATOR,SHADOW_QUALITY_STATES,buildShadowCohort,shadowHash,shadowAssert,captureShadowFormalRanking',
    'const {canonicalJcsJson,sha256HexUtf8}=SHADOW_CANONICAL; const {classifyShadowSemanticPopulation,sampleMembershipV2}=SHADOW_CLASSIFIER;',digest='f9ca9ddbe4ffba540b163ca68275ab787cba9f48ee07b0b2ac4457829b9dfcf4')
helpers+='const SHADOW_STORAGE='+module('system1_shadow_cohort_storage_v0_1.mjs','persistShadowCohort,readShadowCohort,appendShadowQuality',
    'const {canonicalJcsJson,sha256HexUtf8}=SHADOW_CANONICAL; const {SHADOW_MEMBERSHIP_VERSION,SHADOW_QUALITY_STATES,buildShadowCohort,shadowHash,shadowAssert}=SHADOW_MEMBERSHIP;',digest='f9d14bf2e5769b21f32c59b594c1ab19811bb4d2e9567c2e342570d011af4417')
helpers+='// END V8.17 SHADOW COHORT MODULES\n'
replace_once('function buildC1PopulationReceipt(',helpers+'function buildC1PopulationReceipt(','modules')
replace_once('''        priorityScoreProvenance:"FORMAL_RUNTIME_RESULT_AT_C1_DECISION",
        selected:''','''        priorityScoreProvenance:"FORMAL_RUNTIME_RESULT_AT_C1_DECISION",
        actualRankingTuple:SHADOW_MEMBERSHIP.captureShadowFormalRanking(result,ordinal?.preSortOrdinal),
        selected:''','actual post-consensus tuple')
replace_once('''      derived,
      ...(zeroPickContext?{zeroPickRankObservation}:{}),''','''      derived,
      ...(f&&(["20日流動性不足","10至30億市值缺少強力特殊理由","30至100億市值流動性要求未達"].includes(result?.reason)||
        (c1Number(f.avgVolume20Lots)!==null&&f.avgVolume20Lots<(raw.close>=1000?300:1000)))?{membershipLiquidity:{
          ret60:c1Number(f.ret60),volatility20:c1Number(f.volatility20),
          institutionalInputs:Object.fromEntries(["foreignNet","trustNet","dealerNet","institutionTotalNet","foreignBuyDays","trustBuyDays","dealerBuyDays","chipConcentration"].map(k=>[k,c1Number(f[k])])),
          sourceProvenance:"REQUEST_LOCAL_KNOWN_BY_DECISION_AT_UPPER_BOUND",sourceEventAt:null
        }}:{}),
      ...(result?.ok===false&&String(result.reason||"").includes("A拉回承接/B突破後承接")?{membershipSetup:(()=>{
        const s=strategySetupState(f);return {A:s.A.checks,B:s.B.checks,metrics:s.metrics};
      })()}:{}),
      ...(zeroPickContext?{zeroPickRankObservation}:{}),''','full setup strata before sampling')
replace_once('''    populationN:rows.length,featureN:featureRows?.length||0,rows,
    ...(zeroPickContext?''','''    populationN:rows.length,featureN:featureRows?.length||0,rows,
    shadowMembershipCapture:{schemaVersion:SHADOW_MEMBERSHIP.SHADOW_CAPTURE_VERSION,
      rankComparatorVersion:SHADOW_MEMBERSHIP.SHADOW_COMPARATOR,providerCallDelta:0,
      selectionRuleVersion:"FORMAL_UNCHANGED_FROM_V8_16_0",
      knownAtSemantics:"REQUEST_LOCAL_KNOWN_BY_DECISION_AT_UPPER_BOUND"},
    ...(zeroPickContext?''','C1 shadow capture identity')
replace_once('''  let save={ok:false,saved:0,readbackVerified:false,reason:null};
  try {''','''  let save={ok:false,saved:0,readbackVerified:false,reason:null};
  let shadowCohort={status:"NOT_CAPTURED",researchOnly:true,decisionImpact:false};
  try {''','safe persistence state')
replace_once('''    else save=await persistC1PopulationReceipt(env,receipt);
  } catch(error)''','''    else {
      save=await persistC1PopulationReceipt(env,receipt);
      if(save.ok===true&&save.readbackVerified===true) {
        try { shadowCohort={status:"VERIFIED",...await SHADOW_STORAGE.persistShadowCohort(env.V7_DB.withSession("first-primary"),receipt.generationId)}; }
        catch(error) { shadowCohort={status:"DATA_QUALITY_BLOCKED",error:String(error).slice(0,200),researchOnly:true,decisionImpact:false}; }
      }
    }
  } catch(error)''','fail-open overlay persistence')
replace_once('''    status:save.ok===true&&save.readbackVerified===true?"VERIFIED":"DATA_QUALITY_BLOCKED",
    researchOnly:''','''    status:save.ok===true&&save.readbackVerified===true?"VERIFIED":"DATA_QUALITY_BLOCKED",
    shadowCohort,
    researchOnly:''','research-only save readback')
route='''    // BEGIN V8.17 SHADOW COHORT ROUTES
    if (url.pathname === "/api/research/shadow-cohort" || url.pathname === "/api/research/shadow-cohort-quality") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      const quality=url.pathname.endsWith("-quality");
      if(request.method!==(quality?"POST":"GET")) return json({error:"Method not allowed"},405,true);
      if(!env.V7_DB) return json({ok:false,error:"NO_D1",researchOnly:true},503,true);
      try {
        const db=env.V7_DB.withSession("first-primary");
        const result=quality?await SHADOW_STORAGE.appendShadowQuality(db,await request.json()):await SHADOW_STORAGE.readShadowCohort(db,{
          generationId:url.searchParams.get("generationId"),scanDate:url.searchParams.get("scanDate"),
          cursor:url.searchParams.get("cursor")||0,limit:url.searchParams.get("limit")||50,
          qualityWatermark:url.searchParams.get("qualityWatermark")
        });
        return json(result,200,true);
      } catch(error) {
        return json({ok:false,error:String(error).slice(0,240),researchOnly:true,decisionImpact:false,noTrade:true,noPush:true},409,true);
      }
    }
    // END V8.17 SHADOW COHORT ROUTES

'''
replace_once('    if (url.pathname === "/api/research/c1-population") {',route+'    if (url.pathname === "/api/research/c1-population") {','protected research API')
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/Worker-before-v8_17_0.mjs').write_text(path.read_text(encoding='utf-8'),encoding='utf-8')
path.write_text(text.replace('\r\n','\n'),encoding='utf-8',newline='\n')
print('Applied V8.17.0 additive Shadow cohort membership; Formal Core unchanged')
