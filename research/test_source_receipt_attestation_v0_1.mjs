import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {auditSourceAttestation} from './source_receipt_attestation_v0_1.mjs';
const body = Buffer.from('official-source-bytes');
const mk = (receiptPatch={}, evidencePatch={}) => ({
 observedAt:'2026-10-02T04:00:00+08:00',
 knownAtTaipei:'2026-10-02T05:00:00+08:00',
 capturedAt:'2026-10-02T05:01:00+08:00',
 firstEligibleTaiwanDecision:'2026-10-02T18:10:00+08:00',
 sourceUrlOrContract:'https://example.gov/official',
 pointInTimeEligible:true,staleFlag:false,missingReason:null,
 sourceEvidence:{responseCompletedAt:'2026-10-02T05:00:00+08:00',transport:'AUTHORIZED_HTTP',sourceUrl:'https://example.gov/official',httpStatus:200,responseBodySha256:createHash('sha256').update(body).digest('hex'),responseBodyBytes:body.length,rawArchiveState:'IMMUTABLE_RAW_REPLAY_VERIFIED',rawArchiveRef:'research-raw/date/source.bin',automatedUseAuthorized:true,...evidencePatch},
 ...receiptPatch
});
const decisionTimestamp='2026-10-02T18:10:00+08:00';
let count=0;
function check(name,receipt,rawBody,expectedReason){
 const audit=auditSourceAttestation(receipt,{decisionTimestamp,rawBody});
 assert.equal(audit.cleanProspectiveEligible,!expectedReason,name);
 if(expectedReason)assert.ok(audit.reasons.includes(expectedReason),name+': '+audit.reasons.join(','));
 console.log(`${++count}. ${name}: ${expectedReason||'PASS'}`);
}
check('clean attested source',mk(),body,null);
check('legacy without source response',{...mk(),sourceEvidence:undefined},body,'SOURCE_RESPONSE_ATTESTATION_ABSENT');
check('backdated capture',mk({capturedAt:'2026-10-02T04:59:00+08:00'}),body,'BACKDATED_CAPTURE');
check('backdated knownAt',mk({knownAtTaipei:'2026-10-02T04:30:00+08:00'}),body,'BACKDATED_KNOWN_AT');
check('unauthenticated native proof cannot backdate',mk({knownAtTaipei:'2026-10-02T04:30:00+08:00'}, {providerNativeAvailabilityProof:true}),body,'BACKDATED_KNOWN_AT');
check('late capture',mk({capturedAt:'2026-10-02T18:11:00+08:00'}),body,'AFTER_DECISION');
check('missing raw archive',mk({}, {rawArchiveState:'HASH_ONLY',rawArchiveRef:null}),body,'IMMUTABLE_RAW_ARCHIVE_NOT_PROVEN');
check('different raw body',mk(),Buffer.from('altered'),'RAW_RESPONSE_HASH_OR_LENGTH_MISMATCH');
check('no raw body',mk(),null,'RAW_BYTES_UNAVAILABLE_FOR_REPLAY');
check('unlicensed market feed',mk({}, {automatedUseAuthorized:false}),body,'ENTITLEMENT_NOT_PROVEN');
check('wrong source url',mk({}, {sourceUrl:'https://other.gov/page'}),body,'SOURCE_URL_MISMATCH');
check('observed after response',mk({observedAt:'2026-10-02T05:01:01+08:00'}),body,'OBSERVATION_AFTER_RESPONSE');
check('source request after decision',mk({}, {responseCompletedAt:'2026-10-02T18:12:00+08:00'}),body,'AFTER_DECISION');
console.log(`PASS ${count} independent assertions`);
