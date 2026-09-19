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
    'const VERSION = "8.5.0-trade-journal";',
    'const VERSION = "8.5.1-journal-ux";',
    "runtime version"
)

replace_once(
    '  <button onclick="loadJournal()">載入紀錄</button><p class="muted">Token 只保存在本頁 sessionStorage，不寫入網址。勝率只計算已完成的 BUY → SELL/STOP_LOSS 回合，未出場不算輸贏。</p></div>',
    '  <button onclick="loadJournal()">載入紀錄</button><p id="journalStatus" class="muted"><b>尚未載入資料。</b> 日誌 API 有權限保護；請輸入 ADMIN_TOKEN 後按「載入紀錄」。</p><p class="muted">Token 只保存在本頁 sessionStorage，不寫入網址。勝率只計算已完成的 BUY → SELL/STOP_LOSS 回合，未出場不算輸贏。</p></div>',
    "journal visible auth hint"
)

replace_once(
    '    const token=document.getElementById("token").value.trim();sessionStorage.setItem("v8AdminToken",token);',
    '    const status=document.getElementById("journalStatus"); const token=document.getElementById("token").value.trim(); if(!token){status.innerHTML="<b>尚未載入：</b>請先輸入 ADMIN_TOKEN。資料庫內容不會公開顯示。";return} sessionStorage.setItem("v8AdminToken",token); status.textContent="讀取交易日誌中…";',
    "journal load status start"
)

replace_once(
    '    const d=await r.json();if(!r.ok){alert(d.error||"讀取失敗");return}',
    '    const d=await r.json();if(!r.ok){status.innerHTML="<b>讀取失敗：</b>"+esc(d.error||("HTTP "+r.status));return} status.innerHTML="<b>已載入：</b>"+esc(d.recordedDays)+" 個交易日、"+esc(d.plans)+" 筆選股計畫、"+esc(d.signals)+" 筆訊號事件。";',
    "journal load result"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.5.1 journal UX")
