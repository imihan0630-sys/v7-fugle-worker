#!/usr/bin/env python3
"""Create an OFFLINE-ONLY Worker.js copy with a reviewed pinned-date API proposal.

Never writes Worker.js, production bindings, GitHub secrets or Cloudflare.
Concrete Worker runtime deployment requires independent approval and versioning.
"""
from pathlib import Path
import argparse
import hashlib
import json

HELPER = r"""
// BEGIN S1_P0_PINNED_SCAN_REQUEST_REVIEW_CANDIDATE
async function resolvePinnedScanRequestAuthority(env, body, observedAt=Date.now()) {
  const target=String(body?.marketDate||"").trim();
  if(!target) return observedAt; // Original unpinned manual interface unchanged.
  if(!/^\d{4}-\d{2}-\d{2}$/.test(target) ||
     new Date(target+"T00:00:00Z").toISOString().slice(0,10)!==target)
    throw new Error("PINNED_SCAN_DATE_INVALID");
  const today=taiwanDate(observedAt);
  const {hour,minute}=taiwanClock(observedAt);
  const hm=String(hour).padStart(2,"0")+":"+String(minute).padStart(2,"0");
  const sameSession=body?.onlyIfMissing===true && target===today && hm>="23:35" && hm<="23:59";
  const priorDayWindow=body?.scheduledFallback===true &&
    body?.onlyIfMissing===true && target===shiftDateString(today,-1) &&
    hm<"07:00";
  // Source rule: the prior 503 has an ambiguous outcome; even with a pinned
  // date, a fresh POST must NOT blindly replay an old attempt. This flag is
  // deliberately unset in the existing production environment.
  const priorSession=priorDayWindow &&
    env?.S1_PINNED_PRIOR_DAY_RECOVERY_ENABLED==="true";
  if(!sameSession && !priorSession)
    throw new Error(priorDayWindow?
      "PRIOR_DAY_REPLAY_OWNER_GATE_NOT_ENABLED":
      "PINNED_SCAN_DATE_NOT_AUTHORIZED_FOR_CLOCK");
  if(priorSession){
    const lastAttempt=await env.STOCKS_KV?.get("V7_LAST_SCAN_ATTEMPT","json");
    // Even an adjacent-date failure is an ambiguous prior POST, because
    // the legacy API previously ignored body.marketDate.
    if(lastAttempt?.status==="FAILED" &&
       [today,target].includes(String(lastAttempt.requestedDate||"")))
      throw new Error("AMBIGUOUS_PRIOR_BUSINESS_POST_NO_REPLAY");
  }
  await loadTradingCalendar(env,Number(target.slice(0,4)));
  if(!isTradingDate(target)) throw new Error("PINNED_SCAN_DATE_NOT_OFFICIAL_TRADING_SESSION");
  // Original runner keys leases, source cache and immutable C1 by the local
  // day of scheduledTime; pin it rather than trusting wall clock or body alone.
  return Date.parse(target+"T23:45:00+08:00");
}
// END S1_P0_PINNED_SCAN_REQUEST_REVIEW_CANDIDATE

"""

OLD = '''        const body=await request.json().catch(()=>({}));
        return json(await runAfterMarketScan(env, Date.now(),{onlyIfMissing:body.onlyIfMissing===true}), 200, true);'''
NEW = '''        const body=await request.json().catch(()=>({}));
        const businessTime=await resolvePinnedScanRequestAuthority(env,body,Date.now());
        return json(await runAfterMarketScan(env,businessTime,{onlyIfMissing:body.onlyIfMissing===true}),200,true);'''
# Source-anchored two-phase mutation barrier for the existing formal D1 lease.
# Heavy preflight/selection (and its timeouts) are retryable only BEFORE this
# durable marker. Once any formal config mutation could have begun, a later
# invocation is fail-closed even after an edge CPU-kill bypassed JS catch.
LEDGER_GUARD_OLD = '''        if((lease.snapshot?.status==="SUCCESS" && Boolean(lease.snapshot.testMode)===isTestMode(env)) || (latest?.scanDate===marketDate && Boolean(latest.dailyReport?.simulated)===isTestMode(env))) return {skipped:true,reason:"ALREADY_SCANNED",scanDate:marketDate,noSelectionOrExternalWrite:true};'''
LEDGER_GUARD_NEW = LEDGER_GUARD_OLD + '''
        if(lease.snapshot?.status==="FORMAL_COMMIT_STARTED")
          return {skipped:true,reason:"AMBIGUOUS_FORMAL_COMMIT_REPLAY_FORBIDDEN",
            requestedDate,previousCommitAt:lease.snapshot.commitAt||null,
            noSelectionOrExternalWrite:true,noPlanChanges:true,noPush:true};
'''
CORE_CALL_OLD = '''    const summary = await runAfterMarketScanCore(env, scheduledTime, options);'''
CORE_CALL_NEW = '''    const coreOptions=options.dryRun===true?options:{...options,
      onBeforeFormalMutation:async (marketDate)=>{
        if(!lease) throw new Error("FORMAL_D1_LEASE_MISSING_BEFORE_MUTATION");
        await persistSignalStateLease(env,lockKey,lease.token,{
          status:"FORMAL_COMMIT_STARTED",requestedDate,scanDate:marketDate,
          commitAt:new Date().toISOString(),testMode:isTestMode(env)
        });
      }
    };
    const summary = await runAfterMarketScanCore(env, scheduledTime, coreOptions);'''
MUTATION_OLD = '''  if (!dryRun) {
    // 7.4.5：完整 1,800+ 檔 × 65日 history 已由 D1 保存，不能再整包塞進單一 KV value。'''
MUTATION_NEW = '''  if (!dryRun) {
    // Any prior CPU kill after this durable D1 marker makes a subsequent
    // retry ambiguous. Never overwrite existing plans or replay push blindly.
    if(typeof options.onBeforeFormalMutation!=="function")
      throw new Error("FORMAL_COMMIT_MARKER_REQUIRED");
    await options.onBeforeFormalMutation(marketDate);
    // 7.4.5：完整 1,800+ 檔 × 65日 history 已由 D1 保存，不能再整包塞進單一 KV value。'''

CAPABILITY = '''    // Exact authenticated runtime capability handshake, no business write.
    if (url.pathname === "/api/scan/session-date-capability") {
      if (!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN_REQUIRED"},401,true);
      if (request.method !== "GET") return json({error:"GET_ONLY"},405,true);
      return json({ok:true,legacyDateBodyIgnored:false,
        pinnedMarketDateSupported:true,priorDayFallbackRequiresOnlyIfMissing:true,
        priorDayTaipeiCutoff:"07:00",maxHistoricalRewindDays:1,
        priorDayFallbackEnabled:env?.S1_PINNED_PRIOR_DAY_RECOVERY_ENABLED==="true",
        priorDayReplayIsNotAuthorizedByCapabilityAlone:true,
        version:VERSION,productionSourceReadOnly:true},200,true);
    }

'''

def patch(text):
    if text.count(OLD)!=1: raise RuntimeError("ORIGINAL_SCAN_API_ANCHOR_DRIFT")
    if text.count("function isHistoryWarmupSchedule(")!=1:
        raise RuntimeError("ORIGINAL_WORKER_SCHEDULE_ANCHOR_DRIFT")
    if text.count('if (url.pathname === "/api/scan") {')!=1:
        raise RuntimeError("ORIGINAL_SCAN_ENDPOINT_ANCHOR_DRIFT")
    if text.count('const LIVE_STALE_SECONDS = 90;')!=1:
        raise RuntimeError("ORIGINAL_90_SECOND_QUOTE_CONTRACT_DRIFT")
    for original,replacement in [
        (LEDGER_GUARD_OLD,LEDGER_GUARD_NEW),
        (CORE_CALL_OLD,CORE_CALL_NEW),
        (MUTATION_OLD,MUTATION_NEW)
    ]:
        if text.count(original)!=1: raise RuntimeError("ORIGINAL_FORMAL_MUTATION_BARRIER_ANCHOR_DRIFT")
        text=text.replace(original,replacement,1)
    text=text.replace("function isHistoryWarmupSchedule(",HELPER+"function isHistoryWarmupSchedule(",1)
    text=text.replace(OLD,NEW,1)
    text=text.replace('    if (url.pathname === "/api/scan") {',
                      CAPABILITY+'    if (url.pathname === "/api/scan") {',1)
    return text

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--source",default="Worker.js")
    ap.add_argument("--output",default="artifacts/system1-pinned-scan-worker-reviewonly.mjs")
    args=ap.parse_args()
    root=Path(__file__).resolve().parents[1]
    source=root/args.source
    target=root/args.output
    before=source.read_text(encoding="utf-8")
    after=patch(before)
    if before==after: raise RuntimeError("NO_PATCH_APPLIED")
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(after,encoding="utf-8")
    assert source.read_text(encoding="utf-8")==before
    sha=lambda x:hashlib.sha256(x.encode("utf-8")).hexdigest()
    print(json.dumps({"scope":"SYSTEM1_PINNED_SCAN_REVIEW_ONLY",
        "source_sha256":sha(before),"candidate_sha256":sha(after),
        "runtime_worker_unchanged":True,
        "worker_production_deployed":False,
        "supportOnlyOnePriorDayBefore07Taipei":True,
        "sourceAndC1SelectionPolicyChanged":False,
        "needsIndependentApproval":True,
        "candidatePath":str(target.relative_to(root))}))

if __name__=="__main__":main()
