#!/usr/bin/env python3
"""Original SOURCE R2 full LIST vs original sealed G3 SOURCE D1 manifest.
No provider calls; list-only metadata is NOT content byte SHA and is non-atomic.
Original object keys, SQL, source rows never published.
"""
import hashlib,json,sqlite3,os,tempfile,sys
from pathlib import Path
SOURCE_SQL_SHA="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12"
PRIVATE_LIST_SHA="9b810c8a9fcdbd5fc596185e5de63850dbb0868ce7bdf76687a6a812c2ff1055"
PRIVATE_SUMMARY_SHA="0611b8eaaa4910abb76efa16a8bb7954c8334f4c8746d781fe3386b083e634dc"
SOURCE_BUCKET="system2-historical-research"
TABLES={"s2_historical_a1_pack_manifests":16100,"s2_historical_a1_segment_manifests":9723}
HEX=set("0123456789abcdef")
def sha(b):return hashlib.sha256(b).hexdigest()
def fail(v):raise ValueError("M07_FULL_LIST_JOIN_"+v)
def load_original_list(list_file,summary_file,strict=True):
    raw=Path(list_file).read_bytes()
    meta=Path(summary_file).read_bytes()
    if strict and (sha(raw)!=PRIVATE_LIST_SHA or sha(meta)!=PRIVATE_SUMMARY_SHA):
        fail("ORIGINAL_SOURCE_PRIVATE_ARTIFACT_SHA")
    try:receipt=json.loads(meta)
    except ValueError:fail("SOURCE_SUMMARY_NOT_JSON")
    if receipt.get("schemaVersion")!="S2_M07_SOURCE_R2_32PAGE_LIST_HASHED_INVENTORY_V0_1" or (
       receipt.get("status")!="SOURCE_R2_LIST_COMPLETE_SINGLE_NONATOMIC_SCAN__CONTENT_SHA_UNVERIFIED" or
       receipt.get("completeSingleScan") is not True or
       receipt.get("sourceBucket")!=SOURCE_BUCKET or
       receipt.get("sourceR2ObjectGetOperations")!=0 or
       receipt.get("sourceR2Writes")!=0 or
       receipt.get("sourceR2ListGetOperations")!=receipt.get("pagesRead")):
        fail("INVENTORY_ORIGINAL_SOURCE_SCOPE")
    observed=receipt.get("observedEntries");listed_bytes=receipt.get("listedBytesObserved")
    if not isinstance(observed,int) or observed<=0 or observed>32000 or (
       not isinstance(listed_bytes,int) or listed_bytes<0 or
       receipt.get("listedBucketTotalObjects")!=observed or
       receipt.get("listedBucketTotalBytes")!=listed_bytes):
        fail("INVENTORY_SIZES_OR_TRUNCATION_DRIFT")
    if strict and (observed!=26321 or listed_bytes!=504007793 or receipt.get("pagesRead")!=27):
        fail("ORIGINAL_OBSERVATION_CHANGED")
    lines=raw.splitlines()
    if len(lines)!=observed:fail("INVENTORY_ROWCOUNT_MISMATCH")
    inventory={};total=0
    for record in lines:
        try:item=json.loads(record)
        except ValueError:fail("PRIVATE_OBJECT_TUPLE_NOT_JSON")
        if not isinstance(item,list) or len(item)!=2:fail("PRIVATE_OBJECT_TUPLE_SHAPE")
        key,size=item
        if not isinstance(key,str) or len(key)!=64 or any(c not in HEX for c in key) or (
           not isinstance(size,int) or isinstance(size,bool) or size<0 or size>1e12 or
           key in inventory):
            fail("INVALID_OR_DUPLICATE_SOURCE_OBJECT_HASH")
        inventory[key]=size;total+=size
    if total!=listed_bytes:fail("INVENTORY_LISTED_BYTE_TOTAL_MISMATCH")
    if sum(x.get("observed",0) for x in receipt.get("pageReceipts",[]))!=observed:
        fail("INVENTORY_PAGE_SUM_MISMATCH")
    return inventory,receipt
def match_original_source_manifest(db,inventory,receipt):
    source_count=0;present=0;absent=0;wrong_size=0
    packs=0;segments=0;seen=set()
    for table,expected in TABLES.items():
        count=db.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
        if count!=expected:fail("ORIGINAL_MANIFEST_TABLE_COUNT_CHANGED")
        for key,actual_sha,bytes_count,bucket in db.execute(
           f'SELECT object_key,object_sha256,gzip_bytes,object_bucket FROM "{table}"'):
            source_count+=1
            if not isinstance(key,str) or not key or (
               not isinstance(actual_sha,str) or len(actual_sha)!=64 or
               not isinstance(bytes_count,int) or bytes_count<0 or bucket!=SOURCE_BUCKET):
                fail("ORIGINAL_MANIFEST_ROW_INVALID")
            id=sha(key.encode("utf8"))
            if id in seen:fail("DUPLICATE_D1_MANIFEST_KEY_ACROSS_TABLES")
            seen.add(id)
            size=inventory.get(id)
            if size is None:
                absent+=1
            elif size!=bytes_count:
                wrong_size+=1
            else:
                present+=1
                if table=="s2_historical_a1_pack_manifests":packs+=1
                else:segments+=1
    if source_count!=25823:fail("ORIGINAL_MANIFEST_FULL_COUNT")
    extra=len(inventory)-sum(1 for x in inventory if x in seen)
    if extra<0 or present+absent+wrong_size!=source_count:fail("PARITY_SUM_UNEXPECTED")
    exact=absent==wrong_size==0
    return {
      "schemaVersion":"S2_M07_ORIGINAL_SOURCE_D1_VS_FULL_R2_LISTING_METADATA_CROSSWALK_V0_1",
      "status":("COMPLETE_LIST_ORIGINAL_D1_MANIFEST_PRESENCE_SIZE_PARITY__BYTE_SHA_UNVERIFIED"
        if exact else "COMPLETE_LIST_ORIGINAL_D1_MANIFEST_PRESENCE_SIZE_GAPS_OR_DRIFT"),
      "originalSourceSQLSha256":SOURCE_SQL_SHA,
      "sourceR2SingleNonAtomicScan":True,
      "sourceR2ListPagesRead":receipt["pagesRead"],
      "sourceR2ActualListObjectEntries":len(inventory),
      "sourceR2ListedBytes":receipt["listedBytesObserved"],
      "sourceD1ManifestRowsScanned":source_count,
      "sourceD1ManifestPresenceAndSizeMatchingRows":present,
      "sourceD1AnnualPackPresenceMatchingRows":packs,
      "sourceD1SegmentPresenceMatchingRows":segments,
      "sourceD1ManifestNotFoundInSourceR2List":absent,
      "sourceD1ManifestFoundWithSizeMismatch":wrong_size,
      "sourceR2ListedObjectsWithNoSourceD1PackOrSegmentManifest":extra,
      "completeManifestPresenceAndSizeMatched":exact,
      "sourceR2UnmatchedObjectsAreNecessarilyOrphaned":False,
      "entireSourceR2ObjectByteSha256Verified":False,
      "originalR2BodyByteShaMatchesD1CountPreviouslyProven":8,
      "sourceR2SnapshotAtomicityVerified":False,
      "historicalFirstKnownAtOrFrozenCertified":False,
      "originSqlAndObjectKeysPublished":False,
      "sourceR2ObjectBodyDownloadsInThisRun":0,
      "cloudflareAPICalls":0,
      "sourceD1RemoteQueries":0,
      "destinationD1Writes":0,
      "targetR2EntitlementUnchanged":True,
      "independentAuditorAccepted":False
    }
def run(sqlpath,private,summary):
    sql=Path(sqlpath)
    if not sql.is_file() or sql.is_symlink() or sql.stat().st_size!=316938975:
        fail("ORIGINAL_SOURCE_SQL_SIZE")
    h=hashlib.sha256()
    with sql.open("rb") as stream:
        for block in iter(lambda:stream.read(1024*1024),b""):h.update(block)
    if h.hexdigest()!=SOURCE_SQL_SHA:fail("ORIGINAL_SOURCE_SQL_SHA256")
    inventory,receipt=load_original_list(private,summary)
    with tempfile.TemporaryDirectory(prefix="s2-m07-source-list-manifest-") as tmp:
        os.chmod(tmp,0o700)
        db=sqlite3.connect(os.path.join(tmp,"original.sqlite"))
        try:
            db.executescript(sql.read_text(encoding="utf8"))
            if db.execute("PRAGMA integrity_check").fetchone()[0]!="ok":
                fail("ORIGINAL_RESTORE_INTEGRITY")
            return match_original_source_manifest(db,inventory,receipt)
        finally:db.close()
if __name__=="__main__":
    try:
        if len(sys.argv)!=4:fail("USAGE")
        print(json.dumps(run(*sys.argv[1:]),sort_keys=True,separators=(",",":")))
    except Exception as e:
        msg=str(e)
        print(msg if msg.startswith("M07_FULL_LIST_JOIN_") else "M07_FULL_LIST_JOIN_UNKNOWN_FAIL_CLOSED",file=sys.stderr)
        sys.exit(2)
