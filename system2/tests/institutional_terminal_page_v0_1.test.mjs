import assert from "node:assert/strict";
import { buildSystem2TerminalPageHtml } from "../deploy/terminal_page.mjs";

const html=buildSystem2TerminalPageHtml();
const required=[
  "多策略智慧選股終端","市場總控","候選股","決策工作台","虛擬部位","共振中心","策略中心","績效中心","事件 / 產業","證據 / 系統",
  "ACTUAL_HOLDINGS_SOURCE_NOT_WIRED","Formal Core: LOCKED","Real orders: DISABLED",
  "/api/system2/resonance","/api/system2/resonance/pool","/api/system2/resonance/operations","/api/system2/shadow/diagnostic","/health",
];
for(const token of required) assert.equal(html.includes(token),true,"missing UI token: "+token);
assert.equal(html.includes("不為了版面好看塞股票"),true);
assert.equal(/實際持股\s*[:：]\s*[0-9]/.test(html),false);
assert.equal(/real order enabled/i.test(html),false);

function strategyCard(strategyId) {
  const start=html.indexOf("<b>"+strategyId+"</b>");
  assert.notEqual(start,-1,"missing strategy card: "+strategyId);
  const end=html.indexOf("</div>",start);
  assert.notEqual(end,-1,"unterminated strategy card: "+strategyId);
  return html.slice(start,end);
}

const institutional=strategyCard("INSTITUTIONAL_ACCUMULATION");
assert.equal(institutional.includes("OWNER REVIEW PENDING"),true);
assert.equal(institutional.includes("SHADOW"),false);
assert.equal(institutional.includes("未啟動"),true);

const blackHorse=strategyCard("BLACK_HORSE_ACCUMULATION");
assert.equal(blackHorse.includes("RESEARCH ONLY"),true);
assert.equal(blackHorse.includes("SHADOW"),false);
assert.equal(blackHorse.includes("distinctness"),true);
assert.equal(blackHorse.includes("未啟動 Limited Shadow"),true);

const shortMomentum=strategyCard("SHORT_MOMENTUM");
assert.equal(shortMomentum.includes("ASSESSOR PENDING"),true);
assert.equal(shortMomentum.includes("OWNER REVIEW PENDING"),false);

const swingGrowth=strategyCard("SWING_GROWTH");
assert.equal(swingGrowth.includes("ASSESSOR PENDING"),true);
assert.equal(swingGrowth.includes("OWNER REVIEW PENDING"),false);

for(const token of [
  "Risk-on/off: UNKNOWN",
  "Trend/Range: UNKNOWN",
  "Actual Holdings</div><div class=\"value\">LOCKED",
  "ACTUAL_HOLDINGS_SOURCE_NOT_WIRED",
  "ACTUAL_POSITION_MONITOR_VERIFIED=false",
  "SAMPLE GATED",
  "READ API PENDING",
  "DATA GATED",
  "PIT GATED",
]) assert.equal(html.includes(token),true,"truthfulness boundary regressed: "+token);

assert.equal(html.includes("Formal Core: LOCKED"),true);
assert.equal(html.includes("Real orders: DISABLED"),true);


for(const token of [
  "監控訊號（RESEARCH）",
  "FROZEN DECISION ACTION",
  "id=\"decisionMonitorSignal\">NO_MONITOR_SIGNAL",
  "id=\"decisionFormalAction\">NO_FROZEN_DECISION",
  "id=\"decisionAction\">NO_FROZEN_DECISION",
  "MONITOR / RESEARCH",
  "research monitor resonance",
  "Monitor signal 是 research/shadow evidence，不等於正式進出場決策",
]) assert.equal(html.includes(token),true,"resonance authority boundary missing: "+token);

assert.equal(html.includes("function monitorSignalOf(r)"),true);
assert.equal(html.includes('if(r.displaySignal==="BUY_RESONANCE") return "BUY_RESONANCE";'),true);
assert.equal(html.includes('if(r.displaySignal==="EXIT_RESONANCE") return "EXIT_RESONANCE";'),true);
assert.equal(html.includes('function formalDecisionActionOf()'),true);
assert.equal(html.includes('return "NO_FROZEN_DECISION";'),true);

assert.equal(html.includes("function actionOf(r)"),false);
assert.equal(html.includes('return "ENTER";'),false);
assert.equal(html.includes('return "EXIT";'),false);
assert.equal(html.includes("actionable resonance"),false);
assert.equal(html.includes("<th>動作</th>"),false);

assert.equal(
  html.includes('document.getElementById("decisionAction").textContent=formalAction;'),
  true,
);
assert.equal(
  html.includes('document.getElementById("decisionMonitorSignal").textContent=monitorSignal;'),
  true,
);
assert.equal(
  html.includes('const formalAction=formalDecisionActionOf(r);'),
  true,
);

console.log("System2 institutional terminal page V0.1 tests PASS");
