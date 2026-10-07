import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const agents=await readFile("AGENTS.md","utf8");
const bootstrap=await readFile("shared-knowledge/ROOM_BOOTSTRAP.md","utf8");
const registry=JSON.parse(await readFile("shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json","utf8"));

assert.match(agents,/MANDATORY user-visible reply epilogue gate/);
assert.match(agents,/any user-visible project reply/);
assert.match(agents,/日期：YYYY\/MM\/DD｜台北時間：HH:mm/);
assert.match(agents,/Asia\/Taipei/);
assert.match(agents,/no new-room exception/);

assert.match(bootstrap,/回覆結尾日期／台北時間規則（MANDATORY \/ FAIL-CLOSED）/);
assert.match(bootstrap,/每一則使用者可見的專案回覆/);
assert.match(bootstrap,/RESPONSE_EPILOGUE_GATE/);
assert.match(bootstrap,/RESPONSE_EPILOGUE_GATE_FAIL/);
assert.match(bootstrap,/日期：YYYY\/MM\/DD｜台北時間：HH:mm/);
assert.match(bootstrap,/新聊天室無例外/);

const rules=registry.rules||{};
assert.equal(rules.projectReplyTimestampPolicy,"MANDATORY_TAIPEI_TIMESTAMP_AT_END_FAIL_CLOSED");
assert.equal(rules.projectReplyTimestampFormat,"日期：YYYY/MM/DD｜台北時間：HH:mm");
assert.equal(rules.projectReplyTimestampTimezone,"Asia/Taipei");
assert.equal(rules.projectReplyTimestampAppliesToNewRooms,true);
assert.equal(rules.projectReplyTimestampAppliesToEveryUserVisibleProjectReply,true);
assert.equal(rules.projectReplyTimestampPreResponseGate,"RESPONSE_EPILOGUE_GATE");
assert.equal(rules.projectReplyTimestampGateFailure,"RESPONSE_EPILOGUE_GATE_FAIL");
assert.equal(rules.projectReplyTimestampMustBeFinalLine,true);
assert.ok(Array.isArray(rules.projectReplyTimestampNoExceptions));
for(const required of ["NEW_ROOM","SHORT_ACK","STATUS_UPDATE","PROGRESS_REPORT","FINAL_REPORT","MODE_SWITCH"]){
  assert.ok(rules.projectReplyTimestampNoExceptions.includes(required),`missing timestamp no-exception class: ${required}`);
}

console.log("Taipei user-visible reply epilogue governance guard passed");
