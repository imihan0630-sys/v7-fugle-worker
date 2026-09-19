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
    'const VERSION = "8.1.2-position-reconciliation";',
    'const VERSION = "8.1.3-ops-console-acceptance";',
    "runtime version"
)

# V8.1.0 may have reached the tracked daily report through its compatibility fallback,
# so patch the stable send/result lines instead of assuming one historical surrounding block.
daily_send='''      : await sendTrackedPush(dailyPayload, env,{note:"每日盤後結果／0檔回報"});'''
if text.count(daily_send)!=1:
    raise SystemExit(f"daily tracked send: expected 1 match, found {text.count(daily_send)}")
text=text.replace(daily_send,daily_send+'''\n    report={...report,signalId:dailyPayload.signalId,resultType:dailyPayload.resultType,\n      selectedCount:dailyPayload.selectedCount,checkedAt:new Date().toISOString()};''',1)

old_store='''    if (report.sent) await env.STOCKS_KV.put(reportKey, JSON.stringify(report), { expirationTtl: 14 * 86400 });'''
new_store='''    await env.STOCKS_KV.put(reportKey, JSON.stringify(report), { expirationTtl: 30 * 86400 });'''
if text.count(old_store)==1:
    text=text.replace(old_store,new_store,1)
else:
    old_store2='''    await env.STOCKS_KV.put(reportKey, JSON.stringify({...report,signalId:dailyPayload.signalId,resultType:dailyPayload.resultType,
      selectedCount:dailyPayload.selectedCount,checkedAt:new Date().toISOString()}), { expirationTtl: 30 * 86400 });'''
    if text.count(old_store2)!=1:
        raise SystemExit(f"daily report store: expected compatible match, found old={text.count(old_store)} alt={text.count(old_store2)}")
    text=text.replace(old_store2,new_store,1)

ui_anchor='''<div class="panel">

<b>格式範例：</b>'''

ui='''<div class="panel">
<h2>實際持股／成交回填</h2>
<p class="note">只更新既有標的的持股階段、實際股數、均價與第一筆成交時間；不會改買區、停損、資金配置、3Min或推播。</p>
<div class="actions">
<button class="secondary" onclick="loadPositions()">載入持股狀態</button>
<button class="primary" onclick="savePositions()">儲存持股回填</button>
</div>
<textarea id="positionsPayload" style="min-height:230px" spellcheck="false" placeholder='[{"symbol":"3105","positionStage":"FIRST","actualShares":50,"averageCost":495.5,"firstEntryConfirmedAt":"2026-09-21T01:30:00Z"}]'></textarea>
</div>

<div class="panel">
<h2>外部 App 交叉驗證</h2>
<p class="note">只做交集／差異統計，不改V7核心分數、3+3配額或正式交易計畫。</p>
<label>交易日</label><input id="externalDate" type="date">
<label style="margin-top:10px">來源</label><input id="externalSource" value="動能選股 App" maxlength="80">
<label style="margin-top:10px">標的代號（逗號、空白或換行分隔）</label>
<textarea id="externalSymbols" style="min-height:120px" spellcheck="false" placeholder="2330&#10;2454&#10;3105"></textarea>
<label>備註</label><textarea id="externalNotes" style="min-height:90px" maxlength="1500"></textarea>
<div class="actions">
<button class="primary" onclick="saveExternalValidation()">儲存並比對</button>
<button class="secondary" onclick="loadExternalValidation()">載入當日參考</button>
<button class="secondary" onclick="loadExternalStats()">查看30日統計</button>
</div>
</div>

''' + ui_anchor
replace_once(ui_anchor,ui,"admin operations panels")

script_anchor='''async function clearAll() {
  if (
    !confirm(
      "確定今天不監控任何標的？"
    )
  ) {
    return;
  }

  try {
    const result =
      await callApi(
        "POST",
        { stocks: [] }
      );

    document
      .getElementById(
        "payload"
      )
      .value = "[]";

    msg(
      "已設定今日 0 檔。"
    );

  } catch (e) {
    msg(
      String(e),
      false
    );
  }
}

</script>'''

script='''async function clearAll() {
  if (
    !confirm(
      "確定今天不監控任何標的？"
    )
  ) {
    return;
  }

  try {
    const result =
      await callApi(
        "POST",
        { stocks: [] }
      );

    document
      .getElementById(
        "payload"
      )
      .value = "[]";

    msg(
      "已設定今日 0 檔。"
    );

  } catch (e) {
    msg(
      String(e),
      false
    );
  }
}

async function loadPositions() {
  try {
    const data=await callApi("GET",undefined,"/api/positions");
    document.getElementById("positionsPayload").value=JSON.stringify(data.positions.map(item=>({
      symbol:item.symbol,
      positionStage:item.positionStage,
      actualShares:item.actualShares,
      averageCost:item.averageCost,
      firstEntryConfirmedAt:item.firstEntryConfirmedAt
    })),null,2);
    msg("已載入持股狀態，共 "+data.positions.length+" 檔。");
  } catch(e) { msg(String(e),false); }
}

async function savePositions() {
  try {
    const raw=document.getElementById("positionsPayload").value.trim();
    if(!raw) throw new Error("請先載入或貼上持股回填資料");
    const positions=JSON.parse(raw);
    const result=await callApi("POST",{positions},"/api/positions");
    msg("持股回填已驗證儲存，共 "+result.count+" 檔。\n不改交易計畫、不推播、不寫3Min。");
  } catch(e) { msg(String(e),false); }
}

function externalSymbols() {
  return [...new Set(document.getElementById("externalSymbols").value.split(/[\\s,，;；]+/).map(x=>x.trim()).filter(Boolean))];
}

async function saveExternalValidation() {
  try {
    const marketDate=document.getElementById("externalDate").value;
    if(!marketDate) throw new Error("請選擇交易日");
    const source=document.getElementById("externalSource").value.trim();
    const symbols=externalSymbols();
    if(!symbols.length) throw new Error("請輸入至少一檔外部App標的");
    const notes=document.getElementById("externalNotes").value;
    const result=await callApi("POST",{marketDate,source,symbols,notes},"/api/external-validation");
    msg("外部App參考已儲存並交叉比對。\n"+JSON.stringify(result,null,2));
  } catch(e) { msg(String(e),false); }
}

async function loadExternalValidation() {
  try {
    const marketDate=document.getElementById("externalDate").value;
    const path="/api/external-validation"+(marketDate?"?marketDate="+encodeURIComponent(marketDate):"");
    const data=await callApi("GET",undefined,path);
    if(data.reference) {
      document.getElementById("externalDate").value=data.reference.marketDate || data.marketDate || marketDate;
      document.getElementById("externalSource").value=data.reference.source || "";
      document.getElementById("externalSymbols").value=(data.reference.symbols || []).join("\n");
      document.getElementById("externalNotes").value=data.reference.notes || "";
    }
    msg("已載入外部參考。\n"+JSON.stringify(data,null,2));
  } catch(e) { msg(String(e),false); }
}

async function loadExternalStats() {
  try {
    const data=await callApi("GET",undefined,"/api/external-validation/stats");
    msg("外部App近30日交叉驗證統計：\n"+JSON.stringify(data,null,2));
  } catch(e) { msg(String(e),false); }
}

</script>'''
replace_once(script_anchor,script,"admin operations javascript")

path.write_text(text,encoding="utf-8")
print("Applied V8.1.3 operations console and acceptance identity")
