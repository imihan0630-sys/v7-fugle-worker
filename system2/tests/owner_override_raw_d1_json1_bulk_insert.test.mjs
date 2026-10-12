import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
const py=String.raw`import sqlite3,json
c=sqlite3.connect(":memory:")
c.execute("CREATE TABLE t(id TEXT PRIMARY KEY, val INTEGER NOT NULL, note TEXT)")
values=[["id"+str(i),i,None if i%3==0 else "x"+str(i)] for i in range(80)]
s="INSERT OR IGNORE INTO t(id,val,note) SELECT json_extract(value,'$[0]'),json_extract(value,'$[1]'),json_extract(value,'$[2]') FROM json_each(?)"
p=json.dumps(values,separators=(",",":"))
assert c.execute("SELECT count(*) FROM json_each(?)",(p,)).fetchone()[0]==80
c.execute(s,(p,))
assert c.execute("SELECT count(*) FROM t").fetchone()[0]==80
assert c.execute("SELECT val,note FROM t WHERE id='id3'").fetchone()==(3,None)
c.execute(s,(p,))
assert c.execute("SELECT count(*) FROM t").fetchone()[0]==80
print("S2_OWNER_RAW_COPY_JSON1_BIND_80_ROWS_IDEMPOTENT_PASS")
`;
const p=spawnSync("python3",["-c",py],{encoding:"utf8",timeout:12000});
assert.equal(p.status,0,p.stderr);
assert.match(p.stdout,/S2_OWNER_RAW_COPY_JSON1_BIND_80_ROWS_IDEMPOTENT_PASS/);
console.log("S2_OWNER_RAW_COPY_JSON1_SQLITE_FALSIFICATION_PASS");
