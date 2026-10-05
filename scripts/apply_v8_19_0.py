"""Owner-approved Class-B C1 scan-origin and generation inventory; merge/deploy require separate approval."""
from pathlib import Path
import hashlib

path=Path('Worker.js')
text=path.read_text(encoding='utf-8')

def once(old,new,label):
    global text
    if text.count(old)!=1:
        raise SystemExit(f'{label}: expected one anchor, got {text.count(old)}')
    text=text.replace(old,new,1)

source_path=Path('research/system1_c1_scan_origin_generation_inventory_v0_1.mjs')
source=source_path.read_text(encoding='utf-8')
expected='27b4faa1d0ed94ae1049237d3f8dae873d0656b87f9b34265756c5d54930d1b1'
if hashlib.sha256(source.encode()).hexdigest()!=expected:
    raise SystemExit('Frozen C1 scan-origin inventory module changed')
source='\n'.join(line for line in source.splitlines() if not line.startswith('import ')).replace('export ','')
module='\n// BEGIN V8.19 C1 SCAN ORIGIN GENERATION INVENTORY\nconst C1_SCAN_ORIGIN=(()=>{\n'+source+'\nreturn {C1_SCAN_ORIGIN_SCHEMA_VERSION,C1_GENERATION_INVENTORY_SCHEMA_VERSION,C1_SCAN_ORIGINS,attachC1ScanOrigin,verifyC1ScanOrigin,readC1GenerationInventory};\n})();\n// END V8.19 C1 SCAN ORIGIN GENERATION INVENTORY\n'

once('const VERSION = "8.18.0-valuation-source-vintage";',
     'const VERSION = "8.19.0-c1-scan-origin-generation-inventory";','version')
once('function buildC1PopulationReceipt(',module+'function buildC1PopulationReceipt(','module')

once('async function persistC1PopulationReceipt(env,receipt) {',
'''async function persistC1PopulationReceipt(env,receipt,{scanOrigin=C1_SCAN_ORIGIN.C1_SCAN_ORIGINS.DIRECT_SAFE_PERSISTENCE_CALLER}={}) {
  receipt=C1_SCAN_ORIGIN.attachC1ScanOrigin(receipt,{origin:scanOrigin,scanDate:receipt?.sessionDate});''',
'attach origin before immutable persistence')

once('async function persistCompletedC1Safe(env,receipt,scanDate,{selectionVerified=false,captureError=null,now=Date.now()}={}) {',
'''async function persistCompletedC1Safe(env,receipt,scanDate,{selectionVerified=false,captureError=null,now=Date.now(),
  scanOrigin=C1_SCAN_ORIGIN.C1_SCAN_ORIGINS.DIRECT_SAFE_PERSISTENCE_CALLER}={}) {''',
'safe persistence origin argument')

once('    else save=await persistC1PopulationReceipt(env,receipt);',
     '    else save=await persistC1PopulationReceipt(env,receipt,{scanOrigin});',
     'propagate origin to immutable generation')

once('''c1PopulationSave = await persistCompletedC1Safe(env,scan.c1PopulationReceipt,marketDate,{selectionVerified:saved.verified===true,captureError:scan.c1CaptureError});''',
'''c1PopulationSave = await persistCompletedC1Safe(env,scan.c1PopulationReceipt,marketDate,{
        selectionVerified:saved.verified===true,captureError:scan.c1CaptureError,
        scanOrigin:C1_SCAN_ORIGIN.C1_SCAN_ORIGINS.AFTER_MARKET_SCAN_PIPELINE
      });''',
'normal after-market origin')

once('''const researchC1Population=await persistCompletedC1Safe(env,preview.c1PopulationReceipt,date,{
          selectionVerified:saved.verified===true,captureError:preview.researchC1Population?.error||null
        });''',
'''const researchC1Population=await persistCompletedC1Safe(env,preview.c1PopulationReceipt,date,{
          selectionVerified:saved.verified===true,captureError:preview.researchC1Population?.error||null,
          scanOrigin:C1_SCAN_ORIGIN.C1_SCAN_ORIGINS.STAGE_SELECTION_ROUTE
        });''',
'stage-selection origin')

once('''  await VALUATION_VINTAGE.verifyValuationSourceVintage({...JSON.parse(headerRow.header_json),rows});
  return true;''',
'''  const storedReceipt={...JSON.parse(headerRow.header_json),rows};
  await VALUATION_VINTAGE.verifyValuationSourceVintage(storedReceipt);
  C1_SCAN_ORIGIN.verifyC1ScanOrigin(storedReceipt);
  return true;''',
'origin readback validation')

route='''    // BEGIN V8.19 C1 GENERATION INVENTORY ROUTE
    if (url.pathname === "/api/research/c1-generation-inventory") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      if(!env.V7_DB) return json({ok:false,error:"NO_D1",researchOnly:true},503,true);
      try {
        const result=await C1_SCAN_ORIGIN.readC1GenerationInventory(env.V7_DB.withSession("first-primary"),{
          scanDate:url.searchParams.get("scanDate"),
          limit:url.searchParams.get("limit")||100
        });
        return json(result,200,true);
      } catch(error) {
        return json({ok:false,error:String(error).slice(0,240),researchOnly:true,decisionImpact:false,
          formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true},409,true);
      }
    }
    // END V8.19 C1 GENERATION INVENTORY ROUTE

'''
once('    if (url.pathname === "/api/research/c1-population") {',
     route+'    if (url.pathname === "/api/research/c1-population") {',
     'protected read-only generation inventory route')

Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/Worker-before-v8_19_0.mjs').write_text(path.read_text(encoding='utf-8'),encoding='utf-8')
path.write_text(text.replace('\r\n','\n'),encoding='utf-8',newline='\n')
print('Applied V8.19.0 C1 scan-origin/generation inventory provenance; Formal Core unchanged')
