// Exact-head WebGL evidence: real region entry/input; QA relocation between encounters.
import assert from 'node:assert/strict';import {createServer} from 'node:http';import {mkdir,readFile,writeFile} from 'node:fs/promises';import {resolve,extname,sep} from 'node:path';import {chromium} from 'playwright';import {freshState,act,SAVE_KEY} from '../dist/simulation.mjs';
const root=resolve(process.env.QA_DIST||'dist'),out=resolve(process.env.QA_OUT||'qa-evidence/ring-inspection');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),p=resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!p.startsWith(root+sep))throw Error();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css'})[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const report={status:'NOT RUN',environment:'Chromium SwiftShader; not target-device performance',errors:[],views:[]};let browser;
try{
 browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 for(const [name,width,height]of [['desktop',1280,720],['mobile',390,844]]){
  const saved=freshState();for(const a of ['greet-wizard','accept','skip-apples','finish','start-party','party-finalize','research-ring','begin-revelation','finish-revelation','leave-village'])assert.equal(act(saved,a),true);saved.road={step:'bree',bree:{location:'inn',task:'rested'}};saved.position={x:-4,z:12};
  const context=await browser.newContext({viewport:{width,height},hasTouch:name==='mobile',isMobile:name==='mobile',recordVideo:{dir:out,size:{width,height}}});await context.addInitScript(({key,state})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(state));},{key:SAVE_KEY,state:saved});const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));const snap=()=>page.evaluate(()=>window.__SHIRE__.snapshot());
  const ready=async()=>{await page.locator('#start').waitFor({state:'visible',timeout:120000});await page.locator('#start').click();};
  const still=async label=>{const f=(await snap()).telemetry.frames;await page.waitForFunction(n=>window.__SHIRE__.snapshot().telemetry.frames>n+2,f,{timeout:60000});await page.locator('#qa-diagnostics').evaluate(el=>el.hidden=true);await page.screenshot({path:resolve(out,name+'-'+label+'.png'),timeout:90000});};
  await page.goto('http://127.0.0.1:'+server.address().port+'/?qa=1');await ready();if(process.env.EXPECTED_COMMIT_SHA)assert.equal((await snap()).commit,process.env.EXPECTED_COMMIT_SHA);
  await page.locator('#inspect-ring').waitFor({state:'visible',timeout:30000});
  if(name==='mobile')await page.locator('#inspect-ring').tap();else await page.keyboard.press('KeyR');
  await page.waitForFunction(()=>window.__SHIRE__.snapshot().ringInspection?.active);
  await page.waitForFunction(()=>{const s=window.__SHIRE__.snapshot(),e=s.camera.eye,t=s.camera.target;return s.ringInspection?.active&&s.ringInspection.visible&&s.camera.fov<.65&&Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2])<3.2;},null,{timeout:15000});
  const held=await snap(),ringCameraDistance=Math.hypot(...held.camera.eye.map((v,i)=>v-held.camera.target[i])),ringCameraFov=held.camera.fov;
  assert.equal(held.ringInspection.actor,'frodo');assert.equal(held.ringInspection.visible,true);assert.ok(ringCameraDistance<3.2,'camera settles on the held Ring before visual capture');assert.ok(ringCameraFov<.65,'Ring inspection uses a close cinematic field of view');await still('held-ring');
  const position=held.position;await page.keyboard.down('w');await page.waitForTimeout(700);await page.keyboard.up('w');const stopped=await snap();assert.ok(Math.hypot(stopped.position.x-position.x,stopped.position.z-position.z)<.02,'inspecting pauses locomotion');
  if(name==='mobile')await page.locator('#inspect-ring').tap();else await page.keyboard.press('Escape');const cancelled=await snap();assert.equal(cancelled.ringInspection.active,false);assert.equal(cancelled.ringInspection.visible,false);assert.equal(cancelled.state.ringInspections,0,'cancel has no saved completion');
  if(name==='mobile')await page.locator('#inspect-ring').tap();else await page.locator('#inspect-ring').click();
  await page.waitForFunction(()=>window.__SHIRE__.snapshot().ringInspection?.active,null,{timeout:5000});
  await page.waitForFunction(()=>{const s=window.__SHIRE__.snapshot();return s.ringInspection?.active&&s.ringInspection.beat?.id==='stow'&&!s.ringInspection.visible;},null,{timeout:15000});
  await page.waitForFunction(()=>window.__SHIRE__.snapshot().state.ringInspections===1,null,{timeout:45000});
  const stowed=await snap();assert.equal(stowed.ringInspection.active,false);assert.equal(stowed.ringInspection.visible,false);await still('stowed-ring');
  await page.reload();await ready();const restored=await snap();assert.equal(restored.state.ringInspections,1);assert.equal(restored.ringInspection.active,false);assert.equal(restored.ringInspection.visible,false);assert.ok(Math.abs(restored.camera.fov-.87)<.01,'camera FOV restores after the Ring scene');await still('saved-inspection');report.views.push({name,naturalCompletion:true,cancelRestores:true,movementPaused:true,ringCameraDistance,ringCameraFov,saved:restored});await context.close();
 }
 assert.deepEqual(report.errors,[]);report.status='PASS';
}finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));await browser?.close();server.close();}
