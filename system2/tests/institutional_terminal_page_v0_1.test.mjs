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
console.log("System2 institutional terminal page V0.1 tests PASS");
