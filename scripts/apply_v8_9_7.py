from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.9.6-hybrid-watch-audit";',
    'const VERSION = "8.9.7-recovery-hardening";',
    "runtime version"
)

replace_once(
'''    if(url.pathname==="/api/institution-status") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      await loadTradingCalendar(env,Number(taiwanDate().slice(0,4)));
      const marketDate=mostRecentWeekday(taiwanDate());
      const streak=await readInstitutionStreakMap(env,marketDate);
      return json({marketDate,ready:streak.ready,validDates:streak.validDates,missingDates:streak.missingDates,snapshotCounts:streak.snapshotCounts},200,true);
    }''',
'''    if(url.pathname==="/api/institution-status") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      const requestedDate=url.searchParams.get("marketDate");
      let marketDate;
      if(requestedDate===null) {
        await loadTradingCalendar(env,Number(taiwanDate().slice(0,4)));
        marketDate=mostRecentWeekday(taiwanDate());
      } else {
        marketDate=normalizeMarketDate(requestedDate);
        if(!marketDate || marketDate>taiwanDate() || marketDate<shiftDateString(taiwanDate(),-14)) return json({error:"法人查核日期無效、未來或過舊"},400,true);
        await loadTradingCalendar(env,Number(marketDate.slice(0,4)));
        if(!isTradingDate(marketDate)) return json({error:"法人查核不是交易日"},400,true);
      }
      const streak=await readInstitutionStreakMap(env,marketDate);
      return json({marketDate,ready:streak.ready,validDates:streak.validDates,missingDates:streak.missingDates,snapshotCounts:streak.snapshotCounts},200,true);
    }''',
    "historical institution status"
)

replace_once(
'''    // 手動執行盤後全市場掃描（部署驗收／補跑用）
    if (url.pathname === "/api/scan") {
      if (!isPushAuthorized(request, env) && !isAuthorized(request, env)) return json({ error: "未授權" }, 401, true);
      if (request.method !== "POST") return json({ error: "只接受 POST" }, 405, true);
      try {
        const body=await request.json().catch(()=>({}));
        return json(await runAfterMarketScan(env, Date.now(),{onlyIfMissing:body.onlyIfMissing===true}), 200, true);
      } catch (err) {
        return json({ error: String(err) }, 500, true);
      }
    }''',
'''    // 手動執行盤後全市場掃描（部署驗收／補跑用）
    if (url.pathname === "/api/scan") {
      if (!isPushAuthorized(request, env) && !isAuthorized(request, env)) return json({ error: "未授權" }, 401, true);
      if (request.method !== "POST") return json({ error: "只接受 POST" }, 405, true);
      try {
        const body=await request.json().catch(()=>({}));
        let scheduledTime=Date.now();
        if(body.marketDate!==undefined) {
          if(!isAuthorized(request,env)) return json({error:"歷史補跑僅接受管理員授權"},401,true);
          const date=normalizeMarketDate(body.marketDate);
          if(!date || date>taiwanDate() || date<shiftDateString(taiwanDate(),-14)) throw new Error("補跑日期無效、未來或超過14天");
          await loadTradingCalendar(env,Number(date.slice(0,4)));
          if(!isTradingDate(date)) throw new Error("補跑日期不是交易日");
          scheduledTime=Date.parse(date+"T10:20:00Z");
        }
        return json(await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:body.onlyIfMissing===true}), 200, true);
      } catch (err) {
        return json({ error: String(err) }, 500, true);
      }
    }''',
    "historical after-market recovery"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.9.7 recovery hardening")
