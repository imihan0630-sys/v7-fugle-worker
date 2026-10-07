import assert from "node:assert/strict";
import {
  buildSystem2TerminalPageHtml,
  taipeiMarketDateTextV0_1,
  resolveTerminalSessionAlignmentV0_1,
} from "../deploy/terminal_page.mjs";

const html=buildSystem2TerminalPageHtml();
const required=[
  "多策略智慧選股終端","市場總控","候選股","決策工作台","部位管理","共振中心","策略中心","績效中心","事件 / 產業","證據 / 系統",
  "USER_UPLOADED_BROKER_SCREENSHOT","ACTUAL_POSITION_MONITOR_VERIFIED=false","Formal Core: LOCKED","Real orders: DISABLED",
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
  "Actual Holdings</div><div class=\"value\">PENDING",
  "NO VERIFIED OWNER SNAPSHOT",
  "USER_UPLOADED_BROKER_SCREENSHOT",
  "ACTUAL_POSITION_MONITOR_VERIFIED=false",
  "Broker API: NOT AUTHORIZED",
  "ACTUAL HOLDINGS",
  "VIRTUAL POSITIONS",
  "CANDIDATES",
  "WATCHLIST",
  "SIMULATED FILLS",
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


for(const token of [
  "FORMAL CANDIDATE PENDING",
  "FORMAL CANDIDATE PENDING / EMPTY",
  "S2-07 frozen daily candidate/read API 尚未接線",
  "MONITOR-ONLY｜Bounded Pool / Resonance",
  "MONITOR / RESEARCH",
  "MONITOR PROVENANCE",
  "strategyMemberships 不等於 formal candidate strategy authority",
  "MONITOR ROW · NOT FORMAL CANDIDATE",
  "id=\"decisionCandidateState\">NOT_AVAILABLE",
  "監控策略來源",
]) assert.equal(html.includes(token),true,"candidate-monitor separation missing: "+token);

assert.equal(html.includes("function formalCandidateRows()"),true);
assert.equal(html.includes("return [];"),true);
assert.equal(html.includes("function monitorRows()"),true);
assert.equal(html.includes('__rowAuthority:"MONITOR_ONLY"'),true);
assert.equal(html.includes('strategyAttributionAuthority'),false);
assert.equal(html.includes("function monitorMembershipsOf(r)"),true);
assert.equal(html.includes("monitorStrategyMemberships"),true);
assert.equal(html.includes("strategyMemberships"),true);
assert.equal(html.includes("MONITOR_PROVENANCE_UNRESOLVED"),true);

assert.equal(html.includes("function candidateRows()"),false);
assert.equal(html.includes("function strategyOf(r)"),false);
assert.equal(html.includes("UNRESOLVED_STRATEGY"),false);
assert.equal(html.includes('candidateState").textContent=(candidateRows()'),false);

assert.equal(
  html.includes('document.getElementById("candidateState").textContent="FORMAL CANDIDATE PENDING";'),
  true,
);
assert.equal(html.includes("monitorTable();"),true);
assert.equal(html.includes('data-monitor-symbol'),true);
assert.equal(html.includes('show("decision")'),true);
assert.equal(
  html.includes('document.getElementById("decisionCandidateState").textContent="NOT_AVAILABLE";'),
  true,
);
assert.equal(
  html.includes('document.getElementById("decisionAction").textContent=formalAction;'),
  true,
);
assert.equal(html.includes("disabled>全部</button>"),true);
assert.equal(html.includes("正式 per-strategy candidate filtering"),true);


const currentDate="2026-10-06";
assert.equal(taipeiMarketDateTextV0_1("2026-10-06T15:59:59.000Z"),"2026-10-06");
assert.equal(taipeiMarketDateTextV0_1("2026-10-06T16:00:00.000Z"),"2026-10-07");

const aligned=resolveTerminalSessionAlignmentV0_1({
  terminalMarketDate:currentDate,
  resonance:{marketDate:currentDate},
  pool:{marketDate:currentDate,state:"NO_ACTIVE_PRESELECTED_POOL",symbols:[]},
  operations:{marketDate:currentDate,state:"LATEST_POOL_REFRESH_NO_CAPACITY_RECEIPT"},
});
assert.equal(aligned.currentSessionReady,true);
assert.equal(aligned.state,"CURRENT_SESSION_ALIGNED");

const staleResonance=resolveTerminalSessionAlignmentV0_1({
  terminalMarketDate:currentDate,
  resonance:{marketDate:"2026-10-05",symbols:[{symbol:"3443"}]},
  pool:{marketDate:currentDate,state:"NO_ACTIVE_PRESELECTED_POOL",symbols:[]},
  operations:{marketDate:currentDate,state:"LATEST_POOL_REFRESH_NO_CAPACITY_RECEIPT"},
});
assert.equal(staleResonance.currentSessionReady,false);
assert.equal(staleResonance.state,"SESSION_DATE_MISMATCH");
assert.deepEqual(staleResonance.mismatchedSources,["resonance"]);

const crossPathMismatch=resolveTerminalSessionAlignmentV0_1({
  terminalMarketDate:currentDate,
  resonance:{marketDate:currentDate},
  pool:{marketDate:"2026-10-05"},
  operations:{marketDate:currentDate},
});
assert.equal(crossPathMismatch.currentSessionReady,false);
assert.equal(crossPathMismatch.state,"SESSION_DATE_MISMATCH");
assert.deepEqual(crossPathMismatch.mismatchedSources,["pool"]);

const unverified=resolveTerminalSessionAlignmentV0_1({
  terminalMarketDate:currentDate,
  resonance:{marketDate:currentDate},
  pool:null,
  operations:{marketDate:currentDate},
});
assert.equal(unverified.currentSessionReady,false);
assert.equal(unverified.state,"SESSION_ALIGNMENT_UNVERIFIED");
assert.deepEqual(unverified.missingSources,["pool"]);

for(const token of [
  "CURRENT SESSION CHECK",
  "CURRENT_SESSION_ALIGNED",
  "SESSION_DATE_MISMATCH",
  "SESSION_ALIGNMENT_UNVERIFIED",
  "STALE_BLOCKED",
  "STALE / PREVIOUS_SESSION",
  "decisionMarketDate",
  "decisionUpdatedAt",
  "decisionChartAsOf",
  "current-session resonance hidden",
  "current-session resonance rows",
]) assert.equal(html.includes(token),true,"current-session freshness guard missing: "+token);

assert.equal(html.includes('get("/api/system2/resonance"+q)'),true);
assert.equal(html.includes('get("/api/system2/resonance/pool"+q)'),true);
assert.equal(html.includes('get("/api/system2/resonance/operations"+q)'),true);
assert.equal(html.includes('const marketDate=taipeiMarketDateTextV0_1(new Date());'),true);
assert.equal(html.includes('S.sessionAlignment=resolveTerminalSessionAlignmentV0_1({'),true);
assert.equal(html.includes('if(!S.sessionAlignment.currentSessionReady)S.selected=null;'),true);
assert.equal(html.includes('function currentResonanceRows()'),true);
assert.equal(html.includes('if(!S.sessionAlignment?.currentSessionReady)return [];'),true);
assert.equal(html.includes('r.marketDate!==S.terminalMarketDate'),true);
assert.equal(html.includes('r.chart?.marketDate&&r.chart.marketDate!==S.terminalMarketDate'),true);
assert.equal(html.includes('timestampMatchesTerminalSession(r.updatedAt)'),true);
assert.equal(html.includes('timestampMatchesTerminalSession(r.chart?.asOf)'),true);

console.log("System2 institutional terminal page V0.1 tests PASS");
