#!/usr/bin/env python3
"""Extract original SOURCE D1 A1 history for owner-authorized raw transport.
Protected ephemeral runner only. Never logs rows, keys, IDs or plaintext.
PIT is NOT certified by this transport.
"""
import hashlib,json,os,sqlite3,sys
from collections import Counter

SQL_SHA="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12"
def die(m): raise RuntimeError("S2_RAW_COPY_"+m)
def sha(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for x in iter(lambda:f.read(1024*1024),b""): h.update(x)
 return h.hexdigest()
def main():
 if len(sys.argv)!=3: die("ARGS")
 sql,out=sys.argv[1:]
 if os.path.getsize(sql)!=316938975 or sha(sql)!=SQL_SHA: die("SQL_IDENTITY")
 os.makedirs(out,exist_ok=True)
 path=os.path.join(out,"source.sqlite")
 c=sqlite3.connect(path)
 with open(sql,encoding="utf-8") as f: c.executescript(f.read())
 if c.execute("PRAGMA integrity_check").fetchone()[0]!="ok": die("INTEGRITY")
 tables=[r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 's2_%'")]
 total=sum(c.execute('SELECT count(*) FROM "'+t+'"').fetchone()[0] for t in tables)
 if len(tables)!=55 or total!=113222: die("SOURCE_TOTAL")
 cols={}
 for table in ("s2_historical_ingest_batches","s2_historical_a1_bars"):
  cols[table]=[r[1] for r in c.execute('PRAGMA table_info("'+table+'")')]
 if c.execute("SELECT count(*) FROM s2_historical_ingest_batches").fetchone()[0]!=129 or c.execute("SELECT count(*) FROM s2_historical_a1_bars").fetchone()[0]!=84688: die("SOURCE_A1")
 for table,file in (("s2_historical_ingest_batches","batches.jsonl"),("s2_historical_a1_bars","bars.jsonl")):
  # Group bars by source batch to avoid per-row flushes for overlapping market dates.
  order="batch_id" if table.endswith("ingest_batches") else "batch_id,market_date,market,symbol,bar_id"
  p=os.path.join(out,file)
  fd=os.open(p,os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600)
  with os.fdopen(fd,"w",encoding="utf8") as dest:
   for row in c.execute('SELECT * FROM "'+table+'" ORDER BY '+order):
    if any(isinstance(v,bytes) for v in row): die("BINARY_UNSUPPORTED")
    dest.write(json.dumps(row,ensure_ascii=False,separators=(",",":"),allow_nan=False)+"\n")
 meta={"sourceSqlSha256":SQL_SHA,"sourceTableCount":len(tables),"sourceTotalRows":total,
       "barRows":84688,"batchRows":129,"columns":cols,"pitHistoricallyCertified":False,
       "sourceUnchanged":True,"frozenDecisionRows":c.execute("SELECT count(*) FROM s2_decisions").fetchone()[0]}
 with open(os.path.join(out,"meta.json"),"w",encoding="utf8") as f: json.dump(meta,f,separators=(",",":"))
 print(json.dumps({"stage":"RAW_COPY_SOURCE_LOCAL_RESTORE_OK","bars":84688,"batches":129,"sourceRows":total}))
 c.close()
if __name__=="__main__":
 try: main()
 except Exception as e:
  print("S2_RAW_COPY_FAIL_CLOSED",file=sys.stderr)
  sys.exit(2)
