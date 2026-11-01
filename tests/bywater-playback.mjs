
// Resume a valid saved party checkpoint and watch its natural ending, without Skip.
import assert from 'node:assert/strict';import {createServer} from 'node:http';import {mkdir,readFile,writeFile} from 'node:fs/promises';import {resolve,extname,sep} from 'node:path';import {execFileSync} from 'node:child_process';import {chromium} from 'playwright';
import {freshState,act,SAVE_KEY,PARTY_TREE} from '../dist/simulation.mjs';
const root=resolve(process.env.QA_DIST||'dist'),out=resolve(process.env.QA_OUT||'qa-evidence/bywater');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),p=resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!p.startsWith(root+sep))throw Error();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.jpg':'image/jpeg'})[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const checkoutSha=process.env.GITHUB_ACTIONS?execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim():'local';
if(process.env.EXPECTED_COMMIT_SHA&&checkoutSha!==process.env.EXPECTED_COMMIT_SHA)throw Error('Bywater checkout mismatch');
const report={commit:checkoutSha,environment:'Chromium SwiftShader; not physical-device performance',errors:[],views:[]};let browser;
try{
 browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 for(const [name,width,height]of [['desktop',1280,720],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile',recordVideo:{dir:out,size:{width,height}}});
  const saved=freshState();act(saved,'greet-wizard');act(saved,'accept');saved.position={x:29,z:-35};
  await context.addInitScript(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key:SAVE_KEY,state:saved});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/?qa=1');await page.locator('#start').waitFor({state:'visible',timeout:90000});await page.locator('#start').click();
  await page.evaluate(()=>window.__SHIRE__.qaView(0,.32,7));await page.waitForTimeout(2000);
  const before=await page.evaluate(()=>window.__SHIRE__.snapshot());assert.equal(before.cinematic.active,false);if(process.env.GITHUB_ACTIONS)assert.equal(before.commit,checkoutSha);
  await page.screenshot({path:resolve(out,name+'-inn.png')});
  const skin=await page.evaluate(()=>{const s=BABYLON.Engine.LastCreatedScene;return ['bywater-innkeeper','bywater-baker'].map(id=>{const m=s.getMeshByName(id+' single-mesh resident');return {id,vertices:m.getTotalVertices(),bones:m.skeleton.bones.length,matrices:Array.from(m.skeleton.getTransformMatrices(m)),enabled:m.isEnabled()};});});
  await page.keyboard.down('a');await page.waitForTimeout(1800);await page.keyboard.up('a');await page.waitForTimeout(700);
  const after=await page.evaluate(()=>window.__SHIRE__.snapshot());assert.ok(Math.hypot(after.position.x-before.position.x,after.position.z-before.position.z)>.15,'Natural input walks through inn approach');
  for(const rig of skin){assert.equal(rig.bones,6);assert.equal(rig.enabled,true);}
  await page.screenshot({path:resolve(out,name+'-approach-walk.png')});report.views.push({name,before,after,skin});await context.close();
 }
 assert.deepEqual(report.errors,[]);report.status='PASS';
}finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));await browser?.close();server.close();}
