export function taipeiMarketDateTextV0_1(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("valid date is required");
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return byType.year + "-" + byType.month + "-" + byType.day;
}

export function resolveTerminalSessionAlignmentV0_1({
  terminalMarketDate,
  resonance = null,
  pool = null,
  operations = null,
} = {}) {
  if (typeof terminalMarketDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(terminalMarketDate)) {
    throw new Error("terminalMarketDate must be YYYY-MM-DD");
  }
  const observedDates = Object.freeze({
    resonance: resonance?.marketDate || null,
    pool: pool?.marketDate || null,
    operations: operations?.marketDate || null,
  });
  const missingSources = Object.freeze(
    Object.entries(observedDates).filter(([, value]) => !value).map(([key]) => key),
  );
  const mismatchedSources = Object.freeze(
    Object.entries(observedDates)
      .filter(([, value]) => value && value !== terminalMarketDate)
      .map(([key]) => key),
  );
  const currentSessionReady = missingSources.length === 0 && mismatchedSources.length === 0;
  return Object.freeze({
    terminalMarketDate,
    observedDates,
    missingSources,
    mismatchedSources,
    currentSessionReady,
    state: currentSessionReady
      ? "CURRENT_SESSION_ALIGNED"
      : mismatchedSources.length
        ? "SESSION_DATE_MISMATCH"
        : "SESSION_ALIGNMENT_UNVERIFIED",
  });
}

export function buildSystem2TerminalPageHtml() {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>System 2｜多策略智慧選股終端</title>
<style>
:root{
  color-scheme:dark;
  --bg:#071019;--bg2:#0b1520;--panel:#0f1b28;--panel2:#132231;--line:#24384a;
  --text:#f4f7fb;--muted:#91a4b7;--gold:#d8ad5b;--gold2:#f2cf83;--blue:#5aa9ff;
  --cyan:#49d6dd;--red:#ff5f6d;--green:#4bd29a;--amber:#ffbf5f;--violet:#9e8cff;
  --shadow:0 20px 50px rgba(0,0,0,.24);
}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:linear-gradient(145deg,#06101a 0,#0a1520 45%,#08121d 100%);color:var(--text);font:14px/1.5 Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",sans-serif}
button,input{font:inherit}
button{color:inherit}
a{color:inherit}
.app{min-height:100vh;display:grid;grid-template-columns:230px minmax(0,1fr)}
.sidebar{position:sticky;top:0;height:100vh;border-right:1px solid rgba(255,255,255,.07);background:rgba(6,13,21,.94);backdrop-filter:blur(14px);padding:20px 14px;display:flex;flex-direction:column;gap:18px}
.brand{padding:4px 8px 12px}.brand .kicker{font-size:11px;letter-spacing:.18em;color:var(--gold2);font-weight:800}.brand h1{font-size:19px;line-height:1.2;margin:7px 0 4px}.brand p{margin:0;color:var(--muted);font-size:12px}
.nav{display:grid;gap:6px}.nav button{border:0;background:transparent;text-align:left;padding:11px 12px;border-radius:10px;cursor:pointer;color:#b7c5d3;display:flex;align-items:center;gap:10px}.nav button:hover{background:#102030;color:#fff}.nav button.active{background:linear-gradient(90deg,rgba(216,173,91,.17),rgba(90,169,255,.09));color:#fff;box-shadow:inset 2px 0 0 var(--gold)}
.nav .icon{width:22px;text-align:center;color:var(--gold2)}
.sidefoot{margin-top:auto;padding:12px 10px;border-top:1px solid rgba(255,255,255,.06);color:var(--muted);font-size:11px}
.status-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;background:var(--amber)}
.main{min-width:0;padding:0 22px 30px}
.topbar{position:sticky;top:0;z-index:20;margin:0 -22px;padding:12px 22px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(7,16,25,.88);backdrop-filter:blur(16px)}
.topgrid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center}.marketstrip{display:flex;gap:8px;overflow:auto;padding-bottom:2px}.market-chip{min-width:max-content;background:#0d1b28;border:1px solid var(--line);border-radius:10px;padding:7px 10px}.market-chip b{font-size:12px}.market-chip span{display:block;color:var(--muted);font-size:10px}.market-chip.pending b{color:var(--amber)}
.topactions{display:flex;align-items:center;gap:9px}.clock{font-variant-numeric:tabular-nums;color:#dce8f3}.health-pill{border:1px solid var(--line);border-radius:999px;padding:6px 10px;font-size:11px;color:var(--muted)}.health-pill.ok{color:var(--green);border-color:rgba(75,210,154,.35)}.health-pill.warn{color:var(--amber);border-color:rgba(255,191,95,.35)}
.view{display:none;padding-top:22px}.view.active{display:block}.pagehead{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:16px}.pagehead h2{margin:0;font-size:26px}.pagehead p{margin:5px 0 0;color:var(--muted);max-width:760px}.eyebrow{font-size:11px;color:var(--gold2);font-weight:800;letter-spacing:.16em}
.grid{display:grid;gap:12px}.g4{grid-template-columns:repeat(4,minmax(0,1fr))}.g3{grid-template-columns:repeat(3,minmax(0,1fr))}.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.panel,.metric,.tablewrap{background:linear-gradient(180deg,rgba(17,30,43,.97),rgba(12,23,34,.98));border:1px solid rgba(255,255,255,.07);border-radius:14px;box-shadow:var(--shadow)}
.metric{padding:14px}.metric .label{font-size:11px;color:var(--muted);letter-spacing:.04em}.metric .value{font-size:24px;font-weight:800;margin-top:5px}.metric .sub{font-size:11px;color:var(--muted);margin-top:4px}
.panel{padding:16px}.panel h3{font-size:14px;margin:0 0 12px}.panel .hint{color:var(--muted);font-size:12px}
.hero{padding:18px;background:radial-gradient(circle at 90% 0,rgba(216,173,91,.14),transparent 38%),linear-gradient(180deg,rgba(17,30,43,.98),rgba(11,22,33,.98))}
.hero-line{display:flex;justify-content:space-between;gap:12px;align-items:center}.hero h3{font-size:20px;margin:0}.hero .tag{border:1px solid rgba(216,173,91,.36);color:var(--gold2);border-radius:999px;padding:5px 9px;font-size:11px}
.banner{display:flex;gap:10px;align-items:flex-start;border:1px solid rgba(255,191,95,.22);background:rgba(255,191,95,.07);padding:12px 14px;border-radius:12px;margin:12px 0}.banner strong{color:var(--amber)}.banner .small{color:var(--muted);font-size:12px}
.status{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:4px 8px;font-size:10px;font-weight:800;letter-spacing:.04em;border:1px solid var(--line);color:var(--muted);white-space:nowrap}.status.ready{color:var(--green);border-color:rgba(75,210,154,.35);background:rgba(75,210,154,.06)}.status.live{color:var(--blue);border-color:rgba(90,169,255,.35);background:rgba(90,169,255,.06)}.status.warn{color:var(--amber);border-color:rgba(255,191,95,.35);background:rgba(255,191,95,.06)}.status.locked{color:#b7c5d3}.status.shadow{color:var(--violet);border-color:rgba(158,140,255,.35)}
.tablewrap{overflow:auto}.table{width:100%;border-collapse:collapse;min-width:780px}.table th,.table td{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.055);text-align:left;vertical-align:middle}.table th{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:700}.table tbody tr:hover{background:rgba(255,255,255,.025)}.symbol{font-size:16px;font-weight:800}.muted{color:var(--muted)}.up{color:var(--red)}.down{color:var(--green)}.neutral{color:var(--blue)}
.action{font-weight:900;letter-spacing:.04em}.action.watch{color:var(--amber)}.action.enter,.action.add{color:var(--red)}.action.reduce,.action.exit{color:var(--green)}
.pills{display:flex;gap:6px;flex-wrap:wrap}.pill{background:#142536;border:1px solid var(--line);border-radius:999px;padding:4px 8px;font-size:10px;color:#c7d4df}
.kpis{margin-bottom:12px}.split{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(300px,.7fr);gap:12px}.decision-card{position:sticky;top:82px}.decision-card .big-action{font-size:30px;font-weight:900;letter-spacing:.06em;margin:4px 0 12px;color:var(--amber)}.kv{display:grid;grid-template-columns:120px 1fr;gap:7px 10px;font-size:12px;padding:8px 0;border-top:1px solid rgba(255,255,255,.05)}.kv span:nth-child(odd){color:var(--muted)}
.chartbox{height:360px;border:1px solid rgba(255,255,255,.06);border-radius:12px;background:#09141f;overflow:hidden}.chartbox canvas{width:100%;height:100%}
.tabs{display:flex;gap:6px;overflow:auto;margin:12px 0}.tabs button{border:1px solid var(--line);background:#0d1c29;padding:7px 10px;border-radius:9px;color:var(--muted);cursor:pointer}.tabs button.active{color:#fff;border-color:rgba(216,173,91,.45);background:rgba(216,173,91,.08)}
.placeholder{min-height:160px;display:grid;place-items:center;text-align:center;padding:24px;color:var(--muted)}.placeholder b{display:block;color:#dce8f3;margin-bottom:5px}.lockbox{border:1px dashed rgba(255,255,255,.12);border-radius:12px;padding:16px;color:var(--muted);background:rgba(255,255,255,.018)}.lockbox strong{color:#dce8f3}
.strategygrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.strategy{padding:13px;border:1px solid rgba(255,255,255,.07);border-radius:12px;background:#0c1925}.strategy b{display:block;margin-bottom:8px}.strategy p{color:var(--muted);font-size:11px;margin:8px 0 0}
.rescards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px}.rescard{border:1px solid var(--line);background:#0c1a27;border-radius:12px;padding:12px;cursor:pointer}.rescard:hover{border-color:var(--blue)}.meter{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:10px 0}.meter i{height:5px;background:#25394a;border-radius:4px}.meter i.on{background:var(--red)}.meter.exit i.on{background:var(--green)}
.feed{display:grid;gap:8px}.feeditem{display:grid;grid-template-columns:70px 1fr auto;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)}.feeditem time{color:var(--muted);font-variant-numeric:tabular-nums}.feeditem small{color:var(--muted)}
.raw{background:#08131d;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:12px;overflow:auto;white-space:pre-wrap;word-break:break-word;color:#9fb6ca;font:11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;max-height:280px}
.mobilebar{display:none}
@media(max-width:1100px){.g4{grid-template-columns:repeat(2,minmax(0,1fr))}.strategygrid{grid-template-columns:repeat(2,minmax(0,1fr))}.split{grid-template-columns:1fr}.decision-card{position:static}}
@media(max-width:760px){.app{grid-template-columns:1fr}.sidebar{display:none}.main{padding:0 12px 82px}.topbar{margin:0 -12px;padding:10px 12px}.topgrid{grid-template-columns:1fr}.topactions{justify-content:space-between}.g4,.g3,.g2,.strategygrid{grid-template-columns:1fr}.pagehead{align-items:flex-start;flex-direction:column}.pagehead h2{font-size:22px}.mobilebar{display:grid;grid-template-columns:repeat(5,1fr);position:fixed;left:0;right:0;bottom:0;z-index:50;background:rgba(6,13,21,.97);border-top:1px solid rgba(255,255,255,.08);padding:7px max(6px,env(safe-area-inset-right)) calc(7px + env(safe-area-inset-bottom)) max(6px,env(safe-area-inset-left))}.mobilebar button{border:0;background:transparent;color:var(--muted);font-size:10px;padding:5px 2px}.mobilebar button.active{color:var(--gold2)}.marketstrip{max-width:100vw}.chartbox{height:300px}}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar">
  <div class="brand"><div class="kicker">SYSTEM 2</div><h1>多策略智慧選股終端</h1><p>Research / Shadow Command Center</p></div>
  <nav class="nav" id="nav">
    <button data-view="command"><span class="icon">◈</span>市場總控</button>
    <button data-view="candidates"><span class="icon">◎</span>候選股</button>
    <button data-view="decision"><span class="icon">⌁</span>決策工作台</button>
    <button data-view="positions"><span class="icon">▣</span>虛擬部位</button>
    <button data-view="resonance"><span class="icon">≋</span>共振中心</button>
    <button data-view="strategies"><span class="icon">◇</span>策略中心</button>
    <button data-view="performance"><span class="icon">▥</span>績效中心</button>
    <button data-view="events"><span class="icon">✦</span>事件 / 產業</button>
    <button data-view="evidence"><span class="icon">⌘</span>證據 / 系統</button>
  </nav>
  <div class="sidefoot"><span class="status-dot"></span><span id="sideState">讀取系統狀態…</span><br>Formal Core: LOCKED<br>Real orders: DISABLED</div>
</aside>

<div class="main">
<header class="topbar">
  <div class="topgrid">
    <div class="marketstrip">
      <div class="market-chip pending"><b>TAIEX —</b><span>市場資料 API 待接</span></div>
      <div class="market-chip pending"><b>TPEx —</b><span>市場資料 API 待接</span></div>
      <div class="market-chip pending"><b>REGIME —</b><span>尚未形成正式 daily regime</span></div>
      <div class="market-chip"><b id="poolTop">POOL —</b><span>bounded only · max 9</span></div>
      <div class="market-chip"><b id="diagTop">DIAGNOSTIC —</b><span>每日 Shadow diagnostic</span></div>
    </div>
    <div class="topactions"><span class="health-pill warn" id="healthPill">SYSTEM CHECK</span><span class="clock" id="clock">--:--:--</span></div>
  </div>
</header>

<section class="view" id="view-command">
  <div class="pagehead"><div><div class="eyebrow">MARKET COMMAND CENTER</div><h2>市場總控</h2><p>先看市場環境、資料健康與今日 bounded pool，再進個股。市場 Regime 尚未有正式 daily authority 時，介面保持 UNKNOWN，不用紅綠燈硬猜。</p></div><span class="status shadow">SHADOW / READ-ONLY</span></div>
  <div class="grid g4 kpis">
    <div class="metric"><div class="label">今日監控池</div><div class="value" id="mPool">—</div><div class="sub">只允許已驗證 bounded pool</div></div>
    <div class="metric"><div class="label">共振確認</div><div class="value" id="mConfirmed">—</div><div class="sub">CONFIRMED only after finality</div></div>
    <div class="metric"><div class="label">Shadow Diagnostic</div><div class="value" id="mDiag">—</div><div class="sub">不是正式選股結果</div></div>
    <div class="metric"><div class="label">System Health</div><div class="value" id="mHealth">—</div><div class="sub">isolated System 2 runtime</div></div>
  </div>
  <div class="grid g2">
    <div class="panel hero"><div class="hero-line"><div><div class="eyebrow">TODAY</div><h3>今日操作焦點</h3></div><span class="tag">NO FAKE AUTHORITY</span></div><div id="todayFocus" class="placeholder"><div><b>等待可信 daily capacity / resonance 資料</b>沒有正式資料就顯示空，不為了版面好看塞股票。</div></div></div>
    <div class="panel"><h3>市場環境 / Regime</h3><div class="banner"><div>⚠</div><div><strong>目前 UI 骨架已就緒</strong><div class="small">Regime、breadth、turnover、sector rotation、USD/TWD 與國際傳導尚未有同一個可驗證 read API，因此先保持 UNKNOWN。</div></div></div><div class="pills"><span class="pill">Risk-on/off: UNKNOWN</span><span class="pill">Trend/Range: UNKNOWN</span><span class="pill">Large/Small: UNKNOWN</span><span class="pill">Volatility: UNKNOWN</span></div></div>
  </div>
  <div class="grid g2" style="margin-top:12px">
    <div class="panel"><h3>今日監控 / 警示</h3><div class="feed" id="commandAlerts"></div></div>
    <div class="panel"><h3>資料與排程</h3><div class="feed" id="commandOps"></div></div>
  </div>
</section>

<section class="view" id="view-candidates">
  <div class="pagehead"><div><div class="eyebrow">CANDIDATE BOARD</div><h2>候選股</h2><p>正式 Candidate Board 只接受未來 S2-07 frozen daily candidate/read API。現有 bounded pool / resonance 資料只會出現在下方獨立的 MONITOR-ONLY 區域，不代表正式選股結果。</p></div><span class="status warn" id="candidateState">FORMAL CANDIDATE PENDING</span></div>
  <div class="panel">
    <div class="hero-line"><h3>正式候選｜S2-07 Frozen Candidate</h3><span class="status warn">SOURCE NOT WIRED</span></div>
    <div class="tabs" id="candidateTabs" aria-label="Formal candidate strategy filters pending">
      <button class="active" data-filter="ALL" disabled>全部</button><button data-filter="SHORT_MOMENTUM" disabled>短線</button><button data-filter="SWING_GROWTH" disabled>波段</button><button data-filter="INSTITUTIONAL_ACCUMULATION" disabled>法人布局</button><button data-filter="BLACK_HORSE_ACCUMULATION" disabled>黑馬</button><button data-filter="INDUSTRY_TREND" disabled>產業</button><button data-filter="EVENT_DRIVEN" disabled>事件</button><button data-filter="VALUE_REVERSION" disabled>價值</button>
    </div>
    <div class="hint">策略 tabs 目前僅保留介面位置；在 authorized frozen candidate source 接線前不執行正式 per-strategy candidate filtering。</div>
    <div class="tablewrap" style="margin-top:10px"><table class="table"><thead><tr><th>股票</th><th>正式策略</th><th>排名</th><th>分數</th><th>Frozen Decision</th></tr></thead><tbody id="candidateBody"></tbody></table></div>
  </div>
  <div class="panel" style="margin-top:12px">
    <div class="hero-line"><h3>MONITOR-ONLY｜Bounded Pool / Resonance</h3><span class="status shadow" id="monitorState">MONITOR / RESEARCH</span></div>
    <div class="hint">此區僅顯示監控來源與 pool strategy provenance；strategyMemberships 不等於 formal candidate strategy authority。</div>
    <div class="tablewrap" style="margin-top:10px"><table class="table"><thead><tr><th>股票</th><th>監控策略來源</th><th>來源</th><th>共振</th><th>狀態</th><th>監控訊號（RESEARCH）</th></tr></thead><tbody id="monitorBody"></tbody></table></div>
  </div>
</section>

<section class="view" id="view-decision">
  <div class="pagehead"><div><div class="eyebrow">DECISION WORKSPACE</div><h2>決策工作台</h2><p>圖表、共振、策略、風險與進出場資訊集中在同一畫面。尚未由 frozen decision 提供的 entry / stop / target 不會自行生成。</p></div><span class="status shadow">TRACEABLE DECISION</span></div>
  <div class="split">
    <div class="panel">
      <div class="hero-line"><div><div class="symbol" id="decisionSymbol">尚未選擇標的</div><div class="muted" id="decisionMeta">可從 MONITOR-ONLY 或共振中心查看；不代表正式候選</div></div><div class="pills"><span class="pill">日K</span><span class="pill">EMA16</span><span class="pill">EMA64</span><span class="pill">Impulse MACD</span></div></div>
      <div class="chartbox" style="margin-top:12px"><canvas id="decisionChart"></canvas></div>
      <div class="tabs"><button class="active">價量</button><button>籌碼</button><button>法人</button><button>產業</button><button>基本面</button><button>估值</button><button>事件</button><button>Frozen History</button></div>
      <div class="lockbox"><strong>下方面板骨架已建好</strong><br>各資料家族等對應 PIT-safe read API 完成後直接接入；目前不以空值推導 bearish / bullish。</div>
    </div>
    <aside class="panel decision-card">
      <div class="eyebrow">FROZEN DECISION ACTION</div><div class="big-action" id="decisionAction">NO_FROZEN_DECISION</div>
      <div class="kv"><span>監控策略來源</span><span id="decisionStrategy">NO_MONITOR_PROVENANCE</span><span>正式候選</span><span id="decisionCandidateState">NOT_AVAILABLE</span><span>監控訊號</span><span id="decisionMonitorSignal">NO_MONITOR_SIGNAL</span><span>正式 Action</span><span id="decisionFormalAction">NO_FROZEN_DECISION</span><span>Market Date</span><span id="decisionMarketDate">—</span><span>Row updatedAt</span><span id="decisionUpdatedAt">—</span><span>Chart asOf</span><span id="decisionChartAsOf">—</span><span>信心</span><span>—</span><span>進場區</span><span>尚無 frozen decision</span><span>Trigger</span><span>—</span><span>Do-not-chase</span><span>—</span><span>Stop / Invalidation</span><span>—</span><span>Targets</span><span>—</span><span>Max holding</span><span>—</span><span>資料時間</span><span id="decisionTime">—</span></div>
      <div class="banner"><div>ⓘ</div><div><strong>權限邊界</strong><div class="small">Monitor signal 是 research/shadow evidence，不等於正式進出場決策。只有獨立 frozen decision authority 明確提供 formal action 時才可顯示正式 Action；目前沒有就保持 NO_FROZEN_DECISION。</div></div></div>
    </aside>
  </div>
</section>

<section class="view" id="view-positions">
  <div class="pagehead"><div><div class="eyebrow">POSITION MANAGEMENT</div><h2>部位管理</h2><p>ACTUAL HOLDINGS 與 VIRTUAL POSITIONS 永久分離。真實持股只接受 Owner 主動上傳券商庫存截圖後的確認快照；不串券商 API，也不把模擬成交轉成真實庫存。</p></div><span class="status shadow">NO BROKER ORDER AUTHORITY</span></div>
  <div class="grid g3">
    <div class="metric"><div class="label">Actual Holdings Source</div><div class="value" style="font-size:15px">AUTHORIZED</div><div class="sub">USER_UPLOADED_BROKER_SCREENSHOT</div></div>
    <div class="metric"><div class="label">Actual Holdings</div><div class="value">PENDING</div><div class="sub">NO VERIFIED OWNER SNAPSHOT</div></div>
    <div class="metric"><div class="label">Virtual Positions</div><div class="value">READY</div><div class="sub">SIMULATED / VIRTUAL ONLY</div></div>
  </div>
  <div class="grid g2" style="margin-top:12px">
    <div class="panel"><h3>ACTUAL HOLDINGS｜真實持股</h3><div class="lockbox"><strong>Source: USER_UPLOADED_BROKER_SCREENSHOT</strong><br>Last verified: NO VERIFIED SNAPSHOT<br>流程：上傳截圖 → ChatGPT/視覺辨識 → deterministic validation → REVIEW/CONFIRM → immutable snapshot。低信心或歧義不猜值、不寫入。<br><br><strong>Broker API: NOT AUTHORIZED · Real orders: DISABLED</strong></div></div>
    <div class="panel"><h3>VIRTUAL POSITIONS｜模擬部位</h3><div class="placeholder"><div><b>SIMULATED / VIRTUAL</b>來源為模擬成交與 s2_positions，只用於研究績效與虛擬持倉生命週期；永遠不能冒充 Actual Holdings。</div></div></div>
  </div>
  <div class="panel" style="margin-top:12px"><h3>資料域隔離</h3><div class="pills"><span class="pill">ACTUAL HOLDINGS</span><span class="pill">VIRTUAL POSITIONS</span><span class="pill">CANDIDATES</span><span class="pill">WATCHLIST</span><span class="pill">SIMULATED FILLS</span></div><div class="hint">各資料域來源與 authority 分開；Actual Holdings 只接受 confirmed screenshot snapshot。</div></div>
</section>

<section class="view" id="view-resonance">
  <div class="pagehead"><div><div class="eyebrow">RESONANCE CENTER</div><h2>共振中心</h2><p>目前已部署的實際能力：bounded pool、EMA16 / EMA64 / Impulse MACD、0/3–3/3、PROVISIONAL / CONFIRMED / RETRACTED 與 operations audit。</p></div><span class="status live">DEPLOYED BASELINE</span></div>
  <div class="grid g4">
    <div class="metric"><div class="label">監控檔數</div><div class="value" id="rCount">—</div><div class="sub">max 9 unique</div></div>
    <div class="metric"><div class="label">暫態共振</div><div class="value" id="rProv">—</div><div class="sub">盤中 provisional</div></div>
    <div class="metric"><div class="label">確認共振</div><div class="value" id="rConf">—</div><div class="sub">finality confirmed</div></div>
    <div class="metric"><div class="label">最新排程</div><div class="value" id="rOps">—</div><div class="sub">19:00 + intraday audit</div></div>
  </div>
  <div class="banner" id="sessionGuard"><div>⏱</div><div><strong>CURRENT SESSION CHECK</strong><div class="small" id="sessionGuardText">等待 Taipei marketDate 對齊檢查。</div></div></div>
  <div class="panel" style="margin-top:12px"><h3>Bounded Pool</h3><div class="rescards" id="resCards"></div></div>
  <div class="panel" style="margin-top:12px"><h3>共振圖</h3><div class="chartbox"><canvas id="resChart"></canvas></div><div class="hint" id="resHint">選擇標的查看日K共振。</div></div>
</section>

<section class="view" id="view-strategies">
  <div class="pagehead"><div><div class="eyebrow">MULTI-STRATEGY ENGINE</div><h2>策略中心</h2><p>策略彼此獨立，不因 A 策略不符合就排除 B 策略。每個策略有自己的主因子、排除條件、Regime、持有週期與版本。</p></div><span class="status shadow">VERSIONED / SHADOW FIRST</span></div>
  <div class="strategygrid">
    <div class="strategy"><b>SHORT_MOMENTUM</b><span class="status warn">ASSESSOR PENDING</span><p>短線動能、價量、突破與執行幾何。</p></div>
    <div class="strategy"><b>SWING_GROWTH</b><span class="status warn">ASSESSOR PENDING</span><p>波段成長、趨勢、基本面與估值共振。</p></div>
    <div class="strategy"><b>INSTITUTIONAL_ACCUMULATION</b><span class="status warn">OWNER REVIEW PENDING</span><p>法人連續性、持股結構與價格尚未充分反映；策略身份尚未取得 owner approval，因此未啟動。</p></div>
    <div class="strategy"><b>BLACK_HORSE_ACCUMULATION</b><span class="status locked">RESEARCH ONLY</span><p>大戶增加、散戶下降、量能受控與基本面轉折；與 INSTITUTIONAL_ACCUMULATION 的 distinctness 尚未證明，未啟動 Limited Shadow。</p></div>
    <div class="strategy"><b>INDUSTRY_TREND</b><span class="status warn">DATA GATED</span><p>產業循環、供需、價格、庫存與產能位置。</p></div>
    <div class="strategy"><b>FUNDAMENTAL_GROWTH</b><span class="status warn">DATA GATED</span><p>營收、獲利、毛利率、成長與預期差。</p></div>
    <div class="strategy"><b>EVENT_DRIVEN</b><span class="status warn">PIT GATED</span><p>事件傳導、half-life、beneficiary / victim 與失效條件。</p></div>
    <div class="strategy"><b>VALUE_REVERSION</b><span class="status warn">DATA GATED</span><p>歷史估值百分位、同業相對估值與 value-trap 防護。</p></div>
  </div>
</section>

<section class="view" id="view-performance">
  <div class="pagehead"><div><div class="eyebrow">PERFORMANCE & ATTRIBUTION</div><h2>績效中心</h2><p>績效必須依策略 / 版本 / Regime 分開，不把不同策略混成一個漂亮總報酬。正式 prospective 樣本不足時不顯示虛假的績效曲線。</p></div><span class="status warn">SAMPLE GATED</span></div>
  <div class="grid g4">
    <div class="metric"><div class="label">Total Return</div><div class="value">—</div><div class="sub">待可信 cohort</div></div>
    <div class="metric"><div class="label">Expectancy</div><div class="value">—</div><div class="sub">成本後</div></div>
    <div class="metric"><div class="label">Max Drawdown</div><div class="value">—</div><div class="sub">strategy/version split</div></div>
    <div class="metric"><div class="label">Capital Utilization</div><div class="value">—</div><div class="sub">不以 forced picks 美化</div></div>
  </div>
  <div class="grid g2" style="margin-top:12px"><div class="panel"><h3>策略績效曲線</h3><div class="placeholder"><div><b>尚未有足夠 prospective performance cohort</b>UI 已保留策略版本、Regime、月份與產業篩選。</div></div></div><div class="panel"><h3>Selected → Triggered → Filled → Profitable</h3><div class="placeholder"><div><b>Funnel 骨架完成</b>等待 execution / outcome lifecycle 的正式 population。</div></div></div></div>
</section>

<section class="view" id="view-events">
  <div class="pagehead"><div><div class="eyebrow">EVENT & INDUSTRY TRANSMISSION</div><h2>事件 / 產業</h2><p>事件不是新聞關鍵字加分。介面預留事件 → 產業傳導 → 公司 → 策略 → half-life / invalidation 的完整鏈。</p></div><span class="status warn">READ API PENDING</span></div>
  <div class="grid g2">
    <div class="panel"><h3>事件雷達</h3><div class="placeholder"><div><b>事件 timeline / firstKnownAt / availableAt</b>後續直接呈現受惠、受害、信心度、half-life、expiry 與 invalidation。</div></div></div>
    <div class="panel"><h3>產業循環</h3><div class="placeholder"><div><b>供給緊縮 → 價格上漲 → 獲利上修 → 主升 → 擴產 → 庫存回升</b>介面按循環階段呈現，不只顯示「產業好 / 壞」。</div></div></div>
  </div>
</section>

<section class="view" id="view-evidence">
  <div class="pagehead"><div><div class="eyebrow">EVIDENCE / OPERATIONS</div><h2>證據 / 系統</h2><p>所有操作畫面都必須能追溯到 observedAt、availableAt、版本與來源。這頁直接呈現現有 read-only health / operations / diagnostic 原始資料。</p></div><span class="status ready">TRACEABILITY FIRST</span></div>
  <div class="grid g3">
    <div class="panel"><h3>Health</h3><pre class="raw" id="rawHealth">讀取中…</pre></div>
    <div class="panel"><h3>Operations</h3><pre class="raw" id="rawOps">讀取中…</pre></div>
    <div class="panel"><h3>Shadow Diagnostic</h3><pre class="raw" id="rawDiag">讀取中…</pre></div>
  </div>
</section>
</div>
</div>

<nav class="mobilebar" id="mobileNav">
  <button data-view="command">總控</button><button data-view="candidates">候選</button><button data-view="decision">決策</button><button data-view="resonance">共振</button><button data-view="evidence">系統</button>
</nav>

<script>
${taipeiMarketDateTextV0_1.toString()}
${resolveTerminalSessionAlignmentV0_1.toString()}
const S={health:null,resonance:null,pool:null,ops:null,diag:null,selected:null,view:"command",filter:"ALL",terminalMarketDate:null,sessionAlignment:null};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=v=>v===null||v===undefined||v===""?"—":String(v);
const stateLabel=v=>String(v||"UNKNOWN").replaceAll("_"," ");
function taipeiClock(){try{return new Intl.DateTimeFormat("zh-TW",{timeZone:"Asia/Taipei",hour12:false,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date())}catch{return new Date().toLocaleString()}}
setInterval(()=>document.getElementById("clock").textContent=taipeiClock(),1000);document.getElementById("clock").textContent=taipeiClock();

function show(view){
 S.view=view;
 document.querySelectorAll(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+view));
 document.querySelectorAll("[data-view]").forEach(x=>x.classList.toggle("active",x.dataset.view===view));
 history.replaceState(null,"","#"+view);
 if(view==="decision") renderDecision();
 if(view==="resonance") renderResonanceChart();
}
document.querySelectorAll("[data-view]").forEach(x=>x.onclick=()=>show(x.dataset.view));
const initial=location.hash.slice(1);show(document.getElementById("view-"+initial)?initial:"command");

function formalCandidateRows(){
 return [];
}
function timestampMatchesTerminalSession(value){
 if(!value)return true;
 const date=new Date(value);
 if(!Number.isFinite(date.getTime()))return false;
 return taipeiMarketDateTextV0_1(date)===S.terminalMarketDate;
}
function resonanceRowCurrentSessionEligible(r){
 if(!S.sessionAlignment?.currentSessionReady)return false;
 if(!r||r.marketDate!==S.terminalMarketDate)return false;
 if(r.chart?.marketDate&&r.chart.marketDate!==S.terminalMarketDate)return false;
 if(!timestampMatchesTerminalSession(r.updatedAt))return false;
 if(!timestampMatchesTerminalSession(r.chart?.asOf))return false;
 return true;
}
function currentResonanceRows(){
 return (S.resonance?.symbols||[]).filter(resonanceRowCurrentSessionEligible);
}
function monitorRows(){
 if(!S.sessionAlignment?.currentSessionReady)return [];
 const resonanceRows=currentResonanceRows().map(x=>({...x,__source:"RESONANCE_MONITOR",__rowAuthority:"MONITOR_ONLY"}));
 if(resonanceRows.length) return resonanceRows;
 const poolRows=Array.isArray(S.pool?.symbols)?S.pool.symbols:[];
 return poolRows.map(x=>typeof x==="string"
  ?{symbol:x,marketDate:S.terminalMarketDate,__source:"BOUNDED_POOL",__rowAuthority:"MONITOR_ONLY"}
  :{...x,marketDate:S.terminalMarketDate,__source:"BOUNDED_POOL",__rowAuthority:"MONITOR_ONLY"});
}
function monitorMembershipsOf(r){
 const raw=Array.isArray(r?.monitorStrategyMemberships)
  ?r.monitorStrategyMemberships
  :(Array.isArray(r?.strategyMemberships)?r.strategyMemberships:[]);
 return [...new Set(raw.map(x=>typeof x==="string"?x:x?.strategyId).filter(Boolean).map(String))];
}
function monitorProvenanceLabel(r){
 const ids=monitorMembershipsOf(r);
 return ids.length?ids.join(", "):"MONITOR_PROVENANCE_UNRESOLVED";
}
function monitorSignalOf(r){
 if(r.displaySignal==="BUY_RESONANCE") return "BUY_RESONANCE";
 if(r.displaySignal==="EXIT_RESONANCE") return "EXIT_RESONANCE";
 if((r.entryCount||0)>0||(r.exitCount||0)>0) return "RESONANCE_FORMING";
 return "WATCH";
}
function formalDecisionActionOf(){
 return "NO_FROZEN_DECISION";
}
function candidateTable(){
 const body=document.getElementById("candidateBody");
 const rows=formalCandidateRows();
 if(!rows.length){
  body.innerHTML='<tr><td colspan="5"><div class="placeholder"><div><b>FORMAL CANDIDATE PENDING / EMPTY</b>S2-07 frozen daily candidate/read API 尚未接線；bounded pool / resonance 不會填入這張正式候選表。</div></div></td></tr>';
  return;
 }
}
function monitorTable(){
 const body=document.getElementById("monitorBody");
 const rows=monitorRows();
 const alignment=S.sessionAlignment;
 document.getElementById("monitorState").textContent=!alignment?.currentSessionReady
  ?(alignment?.state||"SESSION_ALIGNMENT_UNVERIFIED")+" · STALE_BLOCKED"
  :(rows.length?"MONITOR ONLY · "+rows.length:"MONITOR ONLY · EMPTY");
 if(!rows.length){
  body.innerHTML='<tr><td colspan="6"><div class="placeholder"><div><b>目前沒有 bounded monitor rows</b>這不等於 formal candidate zero-pick conclusion。</div></div></td></tr>';
  return;
 }
 body.innerHTML=rows.map(r=>{
  const rc=Math.max(Number(r.entryCount||0),Number(r.exitCount||0));
  const conf=r.signalConfirmationState||r.finality||"—";
  const provenance=monitorProvenanceLabel(r);
  const monitorSignal=monitorSignalOf(r);
  return '<tr data-monitor-symbol="'+esc(r.symbol)+'"><td><span class="symbol">'+esc(r.symbol)+'</span></td><td><span class="status shadow">MONITOR PROVENANCE</span> '+esc(provenance)+'</td><td>'+esc(r.__source)+'</td><td>'+rc+'/3</td><td>'+esc(conf)+'</td><td><span class="status shadow">MONITOR / RESEARCH</span> <span class="action watch">'+esc(monitorSignal)+'</span></td></tr>'
 }).join("");
 body.querySelectorAll("tr[data-monitor-symbol]").forEach(tr=>tr.onclick=()=>{S.selected=tr.dataset.monitorSymbol;show("decision")});
}

function drawChart(canvas,chart){
 if(!canvas)return;
 const dpr=devicePixelRatio||1,w=canvas.clientWidth,h=canvas.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;
 const c=canvas.getContext("2d");c.scale(dpr,dpr);c.clearRect(0,0,w,h);c.fillStyle="#09141f";c.fillRect(0,0,w,h);
 const rows=chart?.candles||[];
 if(!rows.length){c.fillStyle="#71889c";c.font="13px system-ui";c.fillText("目前沒有可顯示的 K 線資料",24,42);return}
 const pad={l:48,r:14,t:18,b:42};const chartH=h*.7-pad.t;
 const vals=rows.flatMap(x=>[Number(x.high),Number(x.low)]).filter(Number.isFinite);const min=Math.min(...vals),max=Math.max(...vals),span=max-min||1;
 const x=i=>pad.l+(i+.5)*(w-pad.l-pad.r)/rows.length,y=v=>pad.t+(max-v)/span*chartH;
 c.strokeStyle="#203547";c.lineWidth=1;for(let i=0;i<5;i++){const yy=pad.t+i*chartH/4;c.beginPath();c.moveTo(pad.l,yy);c.lineTo(w-pad.r,yy);c.stroke()}
 const bw=Math.max(2,(w-pad.l-pad.r)/rows.length*.58);
 rows.forEach((r,i)=>{const up=Number(r.close)>=Number(r.open);c.strokeStyle=c.fillStyle=up?"#ff5f6d":"#4bd29a";c.beginPath();c.moveTo(x(i),y(r.high));c.lineTo(x(i),y(r.low));c.stroke();c.fillRect(x(i)-bw/2,Math.min(y(r.open),y(r.close)),bw,Math.max(1,Math.abs(y(r.open)-y(r.close))))});
 function line(series,color){c.strokeStyle=color;c.lineWidth=1.5;c.beginPath();let started=false;(series||[]).forEach((p,i)=>{if(!Number.isFinite(Number(p.value)))return;const xx=x(i),yy=y(Number(p.value));if(!started){c.moveTo(xx,yy);started=true}else c.lineTo(xx,yy)});if(started)c.stroke()}
 line(chart.ema16,"#f2cf83");line(chart.ema64,"#5aa9ff");
 (chart.markers||[]).forEach(m=>{const i=rows.findIndex(r=>r.date===m.date);if(i<0||!Number.isFinite(Number(m.value)))return;c.fillStyle=m.side==="ENTRY"?"#ff5f6d":"#4bd29a";c.beginPath();c.arc(x(i),y(Number(m.value)),5,0,Math.PI*2);c.fill()})
}

function selectedMonitorRow(){const rows=monitorRows();return rows.find(x=>String(x.symbol)===String(S.selected))||rows[0]||null}
function renderDecision(){
 const r=selectedMonitorRow();if(r&&!S.selected)S.selected=r.symbol;
 document.getElementById("decisionSymbol").textContent=r?String(r.symbol):"尚未選擇標的";
 document.getElementById("decisionMeta").textContent=r?("MONITOR ROW · NOT FORMAL CANDIDATE · CURRENT SESSION "+S.terminalMarketDate+" · "+stateLabel(r.signalConfirmationState||r.lifecycleState||"WATCH")):((S.sessionAlignment?.state||"SESSION_ALIGNMENT_UNVERIFIED")+" · current-session monitor unavailable");
 const formalAction=formalDecisionActionOf(r);
 const monitorSignal=r?monitorSignalOf(r):"NO_MONITOR_SIGNAL";
 document.getElementById("decisionAction").textContent=formalAction;
 document.getElementById("decisionFormalAction").textContent=formalAction;
 document.getElementById("decisionCandidateState").textContent="NOT_AVAILABLE";
 document.getElementById("decisionMonitorSignal").textContent=monitorSignal;
 document.getElementById("decisionStrategy").textContent=r?monitorProvenanceLabel(r):"NO_MONITOR_PROVENANCE";
 document.getElementById("decisionMarketDate").textContent=r?fmt(r.marketDate):fmt(S.terminalMarketDate);
 document.getElementById("decisionUpdatedAt").textContent=r?fmt(r.updatedAt):"—";
 document.getElementById("decisionChartAsOf").textContent=r?fmt(r.chart?.asOf):"—";
 document.getElementById("decisionTime").textContent=r?fmt(r.updatedAt||r.chart?.asOf):"—";
 requestAnimationFrame(()=>drawChart(document.getElementById("decisionChart"),r?.chart||{}));
}
function resCard(r){
 const n=Math.max(Number(r.entryCount||0),Number(r.exitCount||0)),ex=Number(r.exitCount||0)>Number(r.entryCount||0);
 return '<div class="rescard" data-symbol="'+esc(r.symbol)+'"><div class="hero-line"><span class="symbol">'+esc(r.symbol)+'</span><span class="status '+((r.signalConfirmationState||"")==="CONFIRMED"?"ready":"shadow")+'">'+esc(r.signalConfirmationState||r.lifecycleState||"WATCH")+'</span></div><div class="meter '+(ex?"exit":"")+'">'+[1,2,3].map(i=>'<i class="'+(i<=n?"on":"")+'"></i>').join("")+'</div><div class="muted">'+n+'/3 · '+esc(r.displaySignal||"WATCH")+'</div></div>'
}
function renderResonanceChart(){
 const r=selectedMonitorRow();
 requestAnimationFrame(()=>drawChart(document.getElementById("resChart"),r?.chart||{}));
 document.getElementById("resHint").textContent=r
  ?(r.symbol+" · marketDate "+fmt(r.marketDate)+" · updatedAt "+fmt(r.updatedAt)+" · chart asOf "+fmt(r.chart?.asOf)+" · "+stateLabel(r.displaySignal||r.lifecycleState||"WATCH"))
  :((S.sessionAlignment?.state||"SESSION_ALIGNMENT_UNVERIFIED")+" · current-session resonance hidden");
}

function feedItem(label,text,badge){
 return '<div class="feeditem"><time>'+esc(label)+'</time><div>'+esc(text)+'</div><span class="status '+(badge||"locked")+'">'+esc(badge==="ready"?"READY":badge==="warn"?"CHECK":"INFO")+'</span></div>'
}
function render(){
 const rr=S.resonance||{},ops=S.ops||{},dg=S.diag||{},h=S.health||{},rows=currentResonanceRows();
 const alignment=S.sessionAlignment;
 document.getElementById("poolTop").textContent="POOL "+(alignment?.currentSessionReady?(S.pool?.symbolCount??rows.length??0):0);
 document.getElementById("diagTop").textContent="DIAG "+stateLabel(dg?.receipt?.state||dg?.state||"—");
 const ok=h?.schemaVersion==="1.1";
 document.getElementById("healthPill").className="health-pill "+(ok?"ok":"warn");
 document.getElementById("healthPill").textContent=ok?"SYSTEM2 ONLINE":"SYSTEM CHECK";
 document.getElementById("sideState").textContent=ok?"isolated runtime online":"system health unknown";
 document.getElementById("mPool").textContent=S.pool?.symbolCount??rows.length??"—";
 document.getElementById("mConfirmed").textContent=rr.confirmedResonanceCount??0;
 document.getElementById("mDiag").textContent=stateLabel(dg?.receipt?.state||dg?.state||"—");
 document.getElementById("mHealth").textContent=ok?"ONLINE":"CHECK";
 document.getElementById("rCount").textContent=rows.length;
 document.getElementById("rProv").textContent=rows.filter(x=>x.signalConfirmationState==="PROVISIONAL").length;
 document.getElementById("rConf").textContent=rows.filter(x=>x.signalConfirmationState==="CONFIRMED").length;
 document.getElementById("rOps").textContent=alignment?.currentSessionReady?stateLabel(ops.state||"—"):stateLabel(alignment?.state||"SESSION_ALIGNMENT_UNVERIFIED");
 const guard=document.getElementById("sessionGuard");
 const guardText=document.getElementById("sessionGuardText");
 if(alignment?.currentSessionReady){
  guard.style.display="";
  guardText.textContent="CURRENT_SESSION_ALIGNED · "+S.terminalMarketDate+" · resonance / pool / operations marketDate 一致";
 }else{
  guard.style.display="";
  guardText.textContent=(alignment?.state||"SESSION_ALIGNMENT_UNVERIFIED")+" · terminal="+fmt(S.terminalMarketDate)+" · resonance="+fmt(alignment?.observedDates?.resonance)+" · pool="+fmt(alignment?.observedDates?.pool)+" · operations="+fmt(alignment?.observedDates?.operations)+" · STALE/PREVIOUS_SESSION rows blocked";
 }
 const focus=document.getElementById("todayFocus");
 const triggered=rows.filter(x=>x.displaySignal==="BUY_RESONANCE"||x.displaySignal==="EXIT_RESONANCE");
 focus.innerHTML=triggered.length?'<div style="width:100%">'+triggered.map(x=>'<div class="feeditem"><time>'+esc(x.symbol)+'</time><div><b>'+esc(x.displaySignal)+'</b><br><small>'+esc(x.signalConfirmationState||"")+' · '+esc(x.updatedAt||"")+'</small></div><span class="status '+((x.signalConfirmationState||"")==="CONFIRMED"?"ready":"shadow")+'">'+esc(Math.max(x.entryCount||0,x.exitCount||0))+'/3</span></div>').join("")+'</div>':'<div><b>目前沒有確認的 research monitor resonance</b>若上游 capacity 尚未形成，系統保持空白，不強行補位。</div>';
 document.getElementById("commandAlerts").innerHTML=triggered.length?triggered.slice(0,6).map(x=>feedItem(x.symbol,x.displaySignal+" · "+(x.signalConfirmationState||"UNKNOWN"),x.signalConfirmationState==="CONFIRMED"?"ready":"warn")).join(""):feedItem("NOW","沒有新的 monitor resonance；正式 frozen decision 未接線","locked");
 document.getElementById("commandOps").innerHTML=[
  feedItem("POOL",stateLabel(ops.state||S.pool?.state||"UNKNOWN"),(S.pool?.symbolCount||0)>0?"ready":"warn"),
  feedItem("D1",h?.schemaVersion?"Schema "+h.schemaVersion:"schema unknown",h?.schemaVersion==="1.1"?"ready":"warn"),
  feedItem("CAPTURE",stateLabel(h?.captureState||"UNKNOWN"),h?.captureState==="CAPTURE_DISABLED"?"ready":"warn")
 ].join("");
 document.getElementById("candidateState").textContent="FORMAL CANDIDATE PENDING";
 candidateTable();
 monitorTable();
 document.getElementById("resCards").innerHTML=rows.length?rows.map(resCard).join(""):'<div class="placeholder"><div><b>目前沒有 current-session resonance rows</b>STALE / PREVIOUS_SESSION 不計入今日 monitor count，也不沿用到 current state。</div></div>';
 document.querySelectorAll(".rescard").forEach(x=>x.onclick=()=>{S.selected=x.dataset.symbol;renderResonanceChart()});
 document.getElementById("rawHealth").textContent=JSON.stringify(h,null,2);
 document.getElementById("rawOps").textContent=JSON.stringify(ops,null,2);
 document.getElementById("rawDiag").textContent=JSON.stringify(dg,null,2);
 renderDecision();renderResonanceChart();
}

async function get(url){const r=await fetch(url,{headers:{accept:"application/json"}});if(!r.ok)throw new Error(url+" HTTP "+r.status);return await r.json()}
async function load(){
 const marketDate=taipeiMarketDateTextV0_1(new Date());
 S.terminalMarketDate=marketDate;
 const q="?marketDate="+encodeURIComponent(marketDate);
 const results=await Promise.allSettled([
  get("/health"),get("/api/system2/resonance"+q),get("/api/system2/resonance/pool"+q),get("/api/system2/resonance/operations"+q),get("/api/system2/shadow/diagnostic")
 ]);
 [S.health,S.resonance,S.pool,S.ops,S.diag]=results.map(x=>x.status==="fulfilled"?x.value:null);
 S.sessionAlignment=resolveTerminalSessionAlignmentV0_1({
  terminalMarketDate:marketDate,
  resonance:S.resonance,
  pool:S.pool,
  operations:S.ops,
 });
 if(!S.sessionAlignment.currentSessionReady)S.selected=null;
 render();
}
load();setInterval(load,60000);addEventListener("resize",()=>{renderDecision();renderResonanceChart()});
</script>
</body>
</html>`;
}
