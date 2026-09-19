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
    'const VERSION = "8.0.2-requirement26-acceptance";',
    'const VERSION = "8.0.3-3min-auth-check";',
    "runtime version",
)

marker = '''    // 只讀既有3Min紀錄並保存驗收證據；不重選、不重送、不更動交易計畫。
    if (url.pathname === "/api/three-min/verify") {'''

route = '''    // V8.0.3：只讀驗證目前正式 3Min Token 是否可授權 GET。
    // 不寫 3Min、不改選股/交易計畫、不推播，也不回傳任何憑證或外部回覆本文。
    if (url.pathname === "/api/three-min/auth-check") {
      if (!isAuthorized(request, env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if (request.method !== "GET") return json({error:"Method not allowed"},405,true);
      const endpointConfigured = Boolean(env.THREEMIN_VERIFY_URL);
      const tokenConfigured = Boolean(env.THREEMIN_API_TOKEN);
      const base = {endpointConfigured, tokenConfigured, noWrite:true, noPlanChanges:true, noPush:true};
      if (!endpointConfigured || !tokenConfigured) {
        return json({ok:false, authorized:false, httpStatus:null, ...base},503,true);
      }
      try {
        const response = await fetchWithDeadline(env.THREEMIN_VERIFY_URL,{
          method:"GET",
          headers:{"content-type":"application/json",authorization:`Bearer ${env.THREEMIN_API_TOKEN}`},
          redirect:"manual"
        });
        const authorized = response.ok === true;
        return json(
          {ok:authorized, authorized, httpStatus:response.status, ...base},
          authorized ? 200 : ([401,403].includes(response.status) ? 403 : 502),
          true
        );
      } catch {
        return json({ok:false, authorized:false, httpStatus:null, ...base},502,true);
      }
    }

''' + marker

replace_once(marker, route, "3Min auth check route")

path.write_text(text, encoding="utf-8")
print("Applied V8.0.3 read-only 3Min auth check")
