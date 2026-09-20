import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {portalNav};"
).toString("base64")+"#"+Date.now());

assert.ok(source.includes("function portalNav(active)"));

for(const [key,href,label] of [
  ["system","/system","監控總控"],
  ["journal","/journal","交易日誌"],
  ["performance","/performance","績效分析中心"],\n  ["research","/research","研究驗證"]
]){
  const html=mod.portalNav(key);
  assert.ok(html.includes('href="/system"'));
  assert.ok(html.includes('href="/journal"'));
  assert.ok(html.includes('href="/performance"'));\n  assert.ok(html.includes('href="/research"'));
  assert.ok(html.includes(label));
  assert.ok(html.includes('href="'+href+'" aria-current="page"'));
}

assert.ok(source.includes('${portalNav("system")}'));
assert.ok(source.includes('${portalNav("journal")}'));
assert.ok(source.includes('${portalNav("performance")}'));\nassert.ok(source.includes('portalNav("research")'));

console.log(JSON.stringify({
  ok:true,
  version:"8.6.1-or-later",
  sharedNavigation:true,
  activePageHighlight:true,
  routes:["/system","/journal","/performance","/research"]
}));
