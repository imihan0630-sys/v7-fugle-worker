from pathlib import Path

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text = text.replace(old, new, 1)


replace_once(
    'const VERSION = "8.0.3-3min-auth-check";',
    'const VERSION = "8.0.4-3min-current-plan-recovery";',
    "runtime version",
)

marker = '''    // 只讀既有3Min紀錄並保存驗收證據；不重選、不重送、不更動交易計畫。
    if (url.pathname === "/api/three-min/verify") {'''

route = '''    // V8.0.4：僅修復「目前仍有效」且先前明確因401/403授權失敗的3Min寫入。
    // 先做精確GET讀回避免重複POST；必要時最多POST一次既有payload。
    // 不重新選股、不改監控名單／資金／持倉、不送手機推播。
    if (url.pathname === "/api/three-min/recover-current") {
      if (!isAuthorized(request, env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if (request.method !== "POST") return json({error:"Method not allowed"},405,true);
      if (isTestMode(env)) return json({error:"TEST_MODE=true，正式3Min修復停用"},403,true);
      if (!env.STOCKS_KV) return json({error:"Missing STOCKS_KV"},503,true);
      try {
        const today=taiwanDate();
        await loadTradingCalendar(env,Number(today.slice(0,4)));
        if(today.slice(5)<="01-07") await loadTradingCalendar(env,Number(today.slice(0,4))-1);
        const currentMarketDate=mostRecentWeekday(today);
        const latest=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
        const config=await env.STOCKS_KV.get(KV_KEY,"json");
        if(!latest || !config) return json({error:"缺少目前盤後計畫或監控設定；停止修復",noWrite:true,noPlanChanges:true,noPush:true},409,true);
        if(latest.scanDate!==currentMarketDate || latest.dryRun===true || latest.config?.saved!==true || latest.config?.verified!==true) {
          return json({error:"最近盤後計畫不是目前有效且已驗證的正式計畫；停止修復",scanDate:latest.scanDate || null,currentMarketDate,noWrite:true,noPlanChanges:true,noPush:true},409,true);
        }
        const expected=latest.threeMinPayload;
        if(expected?.schemaVersion!=="V7_PLAN_2" || expected?.scanDate!==latest.scanDate || !Array.isArray(expected?.stocks) ||
           expected.stocks.length!==Number(latest.selectedCount || 0) || expected.planDate!==nextTradingDate(latest.scanDate)) {
          return json({error:"既有3Min payload與目前正式盤後計畫不一致；停止修復",noWrite:true,noPlanChanges:true,noPush:true},409,true);
        }
        const planSymbols=expected.stocks.map(stock=>String(stock.symbol));
        const configSymbols=Array.isArray(config.stocks) ? config.stocks.map(stock=>String(stock.symbol)) : [];
        if(latest.config?.updatedAt!==config.updatedAt || JSON.stringify(planSymbols)!==JSON.stringify(configSymbols) ||
           Number(expected.totalCapital)!==Number(config.totalCapital) || Number(expected.totalCapital)!==Number(latest.totalCapital)) {
          return json({error:"目前監控設定已改變，禁止重送舊3Min計畫",noWrite:true,noPlanChanges:true,noPush:true},409,true);
        }

        // 先GET精確讀回；若外部已存在完全相同payload，絕不再次POST。
        const priorReadback=await readThreeMinPlan(expected,env);
        if(priorReadback.authorizationFailed) {
          return json({error:"3Min讀回授權仍失敗",authorized:false,httpStatus:priorReadback.httpStatus,noWrite:true,noPlanChanges:true,noPush:true},403,true);
        }

        let bridge;
        let externalPostPerformed=false;
        if(priorReadback.verified===true) {
          bridge={...latest.threeMin,sent:true,simulated:false,verified:true,httpStatus:priorReadback.httpStatus,
            verificationNote:priorReadback.reason,readback:priorReadback,recoveredFromExistingRecord:true};
        } else if(latest.threeMin?.sent===true && latest.threeMin?.simulated!==true) {
          // 舊紀錄表示POST已被接受：只能GET，不可重送。
          bridge={...latest.threeMin,verified:false,readback:priorReadback,verificationNote:priorReadback.reason};
        } else if([401,403].includes(Number(latest.threeMin?.httpStatus))) {
          // 401/403明確表示先前外部未接受寫入；憑證已另經唯讀auth-check驗證後，才可補送一次。
          externalPostPerformed=true;
          bridge=await sendTo3Min(expected,env);
        } else {
          return json({error:"舊3Min失敗不是明確401/403；為避免重複資料，不自動POST",priorHttpStatus:latest.threeMin?.httpStatus ?? null,
            noWrite:true,noPlanChanges:true,noPush:true},409,true);
        }

        const verified=bridge?.sent===true && bridge?.simulated!==true && bridge?.verified===true;
        const previousRequirements=latest.diagnostics?.requirements30 || {};
        const previousRules=Array.isArray(previousRequirements.incompleteRules) ? previousRequirements.incompleteRules : [17,18,19,26,27,28,29];
        const incompleteRules=verified ? previousRules.filter(rule=>rule!==26) : (previousRules.includes(26) ? previousRules : [...previousRules,26]);
        const checkedAt=new Date().toISOString();
        const requirement26={
          complete:verified,
          scanDate:latest.scanDate,
          planDate:expected.planDate,
          schemaVersion:expected.schemaVersion,
          selectedCount:expected.stocks.length,
          externalPostAccepted:bridge?.sent===true && bridge?.simulated!==true,
          exactReadbackVerified:bridge?.verified===true && bridge?.simulated!==true,
          verifiedAt:verified ? checkedAt : null,
          recordId:bridge?.readback?.recordId || priorReadback?.recordId || null,
          proof:verified ? "目前有效V7_PLAN_2已由3Min接受並精確讀回" : "3Min尚未完成精確讀回"
        };
        const updated={...latest,
          version:VERSION,
          diagnostics:{...latest.diagnostics,requirements30:{...previousRequirements,complete:false,incompleteRules,requirement26}},
          threeMin:{...bridge,recoveryCheckedAt:checkedAt},
          pipeline:{...latest.pipeline,
            threeMinAccepted:bridge?.sent===true && bridge?.simulated!==true,
            threeMinVerified:bridge?.verified===true && bridge?.simulated!==true,
            complete:latest.pipeline?.configVerified===true && bridge?.verified===true && bridge?.simulated!==true && latest.pipeline?.dailyReportAccepted===true}
        };
        await env.STOCKS_KV.put(LAST_SCAN_KEY,JSON.stringify(updated),{expirationTtl:14*86400});
        const readback=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
        if(readback?.generatedAt!==updated.generatedAt || readback?.diagnostics?.requirements30?.requirement26?.complete!==verified) {
          return json({error:"修復結果KV讀回不一致",externalPostPerformed,threeMinAccepted:bridge?.sent===true,threeMinVerified:bridge?.verified===true,
            noPlanChanges:true,noPush:true},500,true);
        }
        return json({
          ok:verified,
          recovered:verified,
          scanDate:latest.scanDate,
          planDate:expected.planDate,
          selectedCount:expected.stocks.length,
          externalPostPerformed,
          recoveredFromExistingRecord:bridge?.recoveredFromExistingRecord===true,
          threeMinAccepted:bridge?.sent===true && bridge?.simulated!==true,
          threeMinVerified:bridge?.verified===true && bridge?.simulated!==true,
          httpStatus:bridge?.httpStatus ?? null,
          requirement26Complete:verified,
          noSelection:true,
          noPlanChanges:true,
          noPush:true
        },verified ? 200 : 502,true);
      } catch {
        return json({ok:false,recovered:false,error:"3Min目前計畫修復失敗；未重新選股或推播",noSelection:true,noPlanChanges:true,noPush:true},500,true);
      }
    }

''' + marker

replace_once(marker, route, "current 3Min plan recovery route")

path.write_text(text, encoding="utf-8")
print("Applied V8.0.4 guarded current-plan 3Min recovery")
