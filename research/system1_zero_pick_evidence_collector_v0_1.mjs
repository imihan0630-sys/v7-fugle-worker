import {createHash} from 'node:crypto';
import {canonicalJcsJson} from './canonical_receipt_hash_v0_1.mjs';
import {ZERO_PICK_RANK_OBSERVER_V0_1 as CONTRACT} from './system1_zero_pick_rank_input_observer_v0_1.mjs';
import {ZERO_PICK_COMPARATOR_V0_1 as COMPARATOR} from './system1_zero_pick_counterfactual_comparator_v0_1.mjs';

const sha=s=>createHash('sha256').update(s).digest('hex');
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const instant=s=>typeof s==='string'&&/(Z|[+-]\d{2}:\d{2})$/.test(s)?Date.parse(s):NaN;
const same=(a,b)=>canonicalJcsJson(a??null)===canonicalJcsJson(b??null);
const pools=['GENERAL','THOUSAND'];

// Input pages/adapted have already passed C1 digest, pagination and generation verification.
// No source fetching, tuple construction, missing-field repair, selection or economic comparison.
export function verifyC1ZeroPickProspectiveEvidence({pages,adapted,scanProof,formalSelectedCount}={}) {
  const header=pages[0].header,capture=header.zeroPickCapture;
  const rawRows=pages.flatMap(p=>p.chunks).sort((a,b)=>a.chunkIndex-b.chunkIndex).flatMap(c=>c.rows);
  const version=/^(\d+)\.(\d+)\.(\d+)(?:-|$)/.exec(header.effectiveRuntimeVersion||'');
  const modern=version&&(Number(version[1])>8||(Number(version[1])===8&&Number(version[2])>=16));
  const legacy=version&&!modern;
  const headerErrors=[];
  const checkHeader=(ok,code)=>{if(!ok)headerErrors.push(code);};
  const childPresentN=rawRows.filter(r=>r.zeroPickRankObservation!=null).length;
  const featureAdmittedN=rawRows.filter(r=>r.derived!=null).length;
  if(modern||capture||childPresentN){
    checkHeader(modern,'RUNTIME_LINEAGE_NOT_SUPPORTED');
    checkHeader(capture?.schemaVersion==='SYSTEM1_ZERO_PICK_C1_CAPTURE_V0_1','CAPTURE_SCHEMA_MISMATCH');
    checkHeader(capture?.fingerprintState==='SHA256_FINALIZED','CAPTURE_NOT_FINALIZED');
    checkHeader(capture?.sameScanOnly===true&&capture?.laterRepairAllowed===false&&
      capture?.historicalBackfillAllowed===false&&capture?.actualFormalRank===false&&capture?.providerCallDelta===0,
      'CAPTURE_FIREWALL_MISMATCH');
    checkHeader(capture?.semantics==='COUNTERFACTUAL_RANK_INPUT / RESEARCH_ONLY / NO_FORMAL_DECISION_IMPACT','CAPTURE_SEMANTICS_MISMATCH');
    checkHeader(pages.every(p=>same(p.header.zeroPickCapture,capture)&&p.header.featureN===header.featureN),'CAPTURE_HEADER_PAGINATION_MISMATCH');
    checkHeader(Number.isInteger(header.featureN)&&header.featureN===featureAdmittedN,'FEATURE_POPULATION_MISMATCH');
  }
  const adaptedBySymbol=new Map(adapted.rows.map(r=>[r.symbol,r]));
  const featurePoolN=Object.fromEntries(pools.map(pool=>[pool,rawRows.filter(r=>r.derived!=null&&
    finite(r.feature?.close)&&(r.feature.close>=1000?'THOUSAND':'GENERAL')===pool).length]));
  const rows=rawRows.map(raw=>{
    const observation=adaptedBySymbol.get(String(raw.symbol))?.zeroPickRankObservation;
    const errors=[];
    const check=(ok,code)=>{if(!ok)errors.push(code);};
    const close=raw.feature?.close,pool=finite(close)?(close>=1000?'THOUSAND':'GENERAL'):'UNKNOWN';
    let state='NO_FEATURE_CHILD';
    if(observation==null){
      if(modern&&raw.derived!=null){check(false,'FEATURE_CHILD_MISSING');state='INVALID';}
      else if(!modern)state=legacy?'LEGACY_NO_ZERO_PICK_CHILD':'UNVERSIONED_NO_ZERO_PICK_CHILD';
    }else{
      const c=observation,t=c.rankInput;
      state=c.rankInputStatus;
      check(same(c,raw.zeroPickRankObservation),'ADAPTED_CHILD_MISMATCH');
      check(raw.derived!=null,'CHILD_WITHOUT_FEATURE');
      check(c.schemaVersion===CONTRACT.observationSchemaVersion,'OBSERVATION_SCHEMA_MISMATCH');
      check(c.researchOnly===true&&c.decisionImpact===false&&c.formalCoreImpact===false&&
        c.actualFormalRank===false&&c.noTrade===true&&c.noPush===true&&
        c.economicSuperiority==='UNKNOWN'&&c.formalOptimizationCandidate==='NONE','OBSERVATION_FIREWALL_MISMATCH');
      const identity=x=>x?.symbol===String(raw.symbol)&&x?.pool===pool&&raw.pricePool===pool&&
        pools.includes(pool)&&x?.captureGeneration===header.generationId&&x?.scanDate===header.sessionDate&&x?.decisionAt===header.decisionAt;
      check(identity(c),'OBSERVATION_IDENTITY_MISMATCH');
      check(['COMPLETE','INCOMPLETE'].includes(state),'OBSERVATION_STATUS_INVALID');
      check(Array.isArray(c.missingFields)&&c.missingFields.every(x=>typeof x==='string'&&x.length>0),'MISSING_FIELDS_INVALID');
      if(state==='INCOMPLETE'){
        check(t===null,'INCOMPLETE_HAS_TUPLE');
        check(c.missingFields?.length>0,'INCOMPLETE_REASON_MISSING');
      }
      // Runtime's fail-closed source rejection intentionally contains no source-time fields.
      const rejected=state==='INCOMPLETE'&&Array.isArray(c.missingFields)&&c.missingFields.includes('OBSERVER_SOURCE_REJECTED');
      if(!rejected||c.sourceKnownAt||c.sourceKnownAtProvenance||c.sourceEventAt){
        check(['feature','sector','consensus'].every(k=>Number.isFinite(instant(c.sourceKnownAt?.[k]))&&
          instant(c.sourceKnownAt[k])<=instant(header.decisionAt)&&c.sourceKnownAt[k]===header.decisionAt),'SOURCE_TIME_NOT_PIT_UPPER_BOUND');
        check(c.sourceKnownAtProvenance?.semantics==='REQUEST_LOCAL_KNOWN_BY_DECISION_AT_UPPER_BOUND'&&
          c.sourceKnownAtProvenance?.notSourceEventTime===true,'SOURCE_TIME_SEMANTICS_MISMATCH');
        check(c.sourceEventAt?.featureSourceEventAt===null&&c.sourceEventAt?.sectorSourceEventAt===null,'INVENTED_SOURCE_EVENT_TIME');
        const exact=c.marketConsensusState==='EXACT_DATE_REFERENCE';
        check(exact||c.marketConsensusState==='ABSENT_OR_WRONG_DATE_AT_DECISION','CONSENSUS_STATE_INVALID');
        check(c.sourceKnownAtProvenance?.feature==='REQUEST_LOCAL_FEATURE_PRESENT_BEFORE_C1_DECISION_STAMP'&&
          c.sourceKnownAtProvenance?.sector==='REQUEST_LOCAL_SECTOR_STATE_PRESENT_BEFORE_C1_DECISION_STAMP'&&
          c.sourceKnownAtProvenance?.consensus===(exact?'REQUEST_LOCAL_EXACT_DATE_CONSENSUS_PRESENT_BEFORE_C1_DECISION_STAMP':
            'REQUEST_LOCAL_NO_EXACT_DATE_CONSENSUS_AT_DECISION'),'SOURCE_PROVENANCE_MISMATCH');
        check(exact?c.consensusObservedReferenceDate===header.sessionDate:
          c.consensusObservedReferenceDate===null||(typeof c.consensusObservedReferenceDate==='string'&&c.consensusObservedReferenceDate!==header.sessionDate),
          'CONSENSUS_DATE_MISMATCH');
        const updated=c.sourceEventAt?.consensusReferenceUpdatedAt;
        check(exact?(updated===null||(Number.isFinite(instant(updated))&&instant(updated)<=instant(header.decisionAt))):updated===null,
          'CONSENSUS_EVENT_NOT_PIT');
      }
      if(state==='COMPLETE'){
        check(t!=null&&typeof t==='object'&&!Array.isArray(t),'COMPLETE_TUPLE_MISSING');
        check(c.missingFields?.length===0,'COMPLETE_WITH_MISSING_FIELDS');
        if(t&&typeof t==='object'){
          check(identity(t),'TUPLE_IDENTITY_MISMATCH');
          check(t.schemaVersion===CONTRACT.rankInputSchemaVersion&&t.rankComparatorVersion===CONTRACT.rankComparatorVersion&&
            t.priorityScoreDefinitionVersion===CONTRACT.priorityScoreDefinitionVersion&&
            t.counterfactualFormulaVersion===CONTRACT.counterfactualFormulaVersion&&
            t.rankingTupleProvenance===CONTRACT.rankingTupleProvenance,'TUPLE_LINEAGE_MISMATCH');
          check(COMPARATOR.orderedFields.every(k=>finite(t[k])),'TUPLE_NUMERIC_MISSING');
          check(Number.isInteger(t.preSortOrdinal)&&t.preSortOrdinal>=0&&t.preSortOrdinal<featurePoolN[pool],'ORDINAL_INVALID');
          check(Number.isFinite(instant(t.rankingTupleKnownAt))&&instant(t.rankingTupleKnownAt)<=instant(header.decisionAt)&&
            t.rankingTupleKnownAt===header.decisionAt,'TUPLE_NOT_PIT_UPPER_BOUND');
          const d=t.decomposition;
          check(d&&['preConsensusPriorityScore','marketConsensusSources','marketConsensusBonus','institutionalScore','fundamentalScore','rsComponent','rrComponent'].every(k=>finite(d[k])),
            'DECOMPOSITION_NUMERIC_MISSING');
          check(Number.isInteger(d?.marketConsensusSources)&&d.marketConsensusSources>=0,'CONSENSUS_SOURCE_COUNT_INVALID');
          check(d?.marketConsensusState===c.marketConsensusState,'CONSENSUS_STATE_MISMATCH');
          const exact=c.marketConsensusState==='EXACT_DATE_REFERENCE';
          check(exact?d?.marketConsensusReferenceDate===header.sessionDate:
            d?.marketConsensusReferenceDate===null&&d?.marketConsensusSources===0&&d?.marketConsensusBonus===0&&t.marketConsensusScore===0,
            'CONSENSUS_LATER_REPAIR_OR_DATE_MISMATCH');
          check(t.rewardPerRisk===raw.derived?.rewardPerRisk&&t.setupQuality===raw.derived?.setupQuality&&
            d?.institutionalScore===raw.derived?.institutionalScore&&d?.fundamentalScore===raw.derived?.fundamentalScore&&
            finite(raw.feature?.ret20)&&finite(raw.feature?.marketReturn20)&&t.relativeStrength===raw.feature.ret20-raw.feature.marketReturn20,
            'TUPLE_STORED_SOURCE_MISMATCH');
          const {rankingTupleFingerprint,...payload}=t;
          check(typeof rankingTupleFingerprint==='string'&&/^[0-9a-f]{64}$/.test(rankingTupleFingerprint),'FINGERPRINT_FORMAT_INVALID');
          try{check(sha(canonicalJcsJson(payload))===rankingTupleFingerprint,'FINGERPRINT_MISMATCH');}
          catch{check(false,'FINGERPRINT_CANONICAL_INVALID');}
        }
      }
    }
    return {symbol:String(raw.symbol),pool,observation:observation===undefined?null:structuredClone(observation),
      validation:{status:errors.length?'INVALID':state,errors,counterfactualRankable:false}};
  });
  // Never renumber from C1 pagination/official-row order: the captured feature order is authoritative.
  for(const pool of pools){
    const byOrdinal=new Map();
    for(const row of rows.filter(r=>r.pool===pool&&r.observation?.rankInputStatus==='COMPLETE')){
      const n=row.observation?.rankInput?.preSortOrdinal;
      if(Number.isInteger(n)){const group=byOrdinal.get(n)||[];group.push(row);byOrdinal.set(n,group);}
    }
    for(const group of byOrdinal.values())if(group.length>1)for(const row of group){row.validation.status='INVALID';row.validation.errors.push('DUPLICATE_POOL_ORDINAL');}
  }
  for(const row of rows)row.validation.counterfactualRankable=headerErrors.length===0&&row.validation.status==='COMPLETE';
  const count=status=>rows.filter(r=>r.validation.status===status).length;
  const completeTupleN=count('COMPLETE'),incompleteTupleN=count('INCOMPLETE'),invalidTupleN=count('INVALID');
  const integrityVerified=Boolean(modern&&headerErrors.length===0&&invalidTupleN===0);
  const legitimateZeroPick=scanProof?.generationId===header.generationId&&scanProof?.scanDate===header.sessionDate&&
    scanProof?.pipelineComplete===true&&scanProof?.configVerified===true&&scanProof?.c1SaveVerified===true&&
    formalSelectedCount===0&&rawRows.every(r=>r.formalResult?.selected===false);
  return {schemaVersion:'SYSTEM1_ZERO_PICK_PROSPECTIVE_EVIDENCE_V0_1',generationId:header.generationId,
    sessionDate:header.sessionDate,decisionAt:header.decisionAt,sourceContentDigest:header.contentDigest,
    effectiveRuntimeVersion:header.effectiveRuntimeVersion??null,capture:structuredClone(capture??null),
    status:integrityVerified?'CAPTURE_INTEGRITY_VERIFIED':headerErrors.length||invalidTupleN?'CAPTURE_INTEGRITY_BLOCKED':
      legacy?'LEGACY_NO_ZERO_PICK_CHILD':'UNVERSIONED_NO_ZERO_PICK_CHILD',
    headerErrors,childPresentN,featureAdmittedN,completeTupleN,incompleteTupleN,invalidTupleN,
    finalizedFingerprintN:rows.filter(r=>r.validation.counterfactualRankable).length,
    poolCounts:Object.fromEntries(pools.map(p=>[p,{childPresentN:rows.filter(r=>r.pool===p&&r.observation!=null).length,
      completeTupleN:rows.filter(r=>r.pool===p&&r.validation.counterfactualRankable).length}])),
    legitimateZeroPick,readyForMatchedC5Join:integrityVerified&&legitimateZeroPick&&completeTupleN>0,
    eligibleForZeroPickCounterfactual:false,eligibilityReason:'MATCHED_C5_P1A_F9_JOIN_REQUIRED',
    cashEconomicComparisonAllowed:false,laterRepairPerformed:false,historicalBackfillPerformed:false,
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',researchOnly:true,decisionImpact:false,
    formalCoreImpact:false,noTrade:true,noPush:true,rows};
}
