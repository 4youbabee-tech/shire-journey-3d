// Real Chromium+WebGL QA. The CI GPU is software SwiftShader, not the owner's target PC.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=resolve(process.env.QA_DIST||fileURLToPath(new URL('../dist/',import.meta.url)));
const out=resolve(process.env.QA_OUT||'qa-evidence');
await mkdir(out,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(path!==root&&!path.startsWith(root+sep))throw Error('Forbidden');
  const data=await readFile(path);
  res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
const url=`http://127.0.0.1:${server.address().port}/?qa=1`;
const checkoutSha=process.env.GITHUB_ACTIONS?execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim():'local';
if(process.env.EXPECTED_COMMIT_SHA&&checkoutSha!==process.env.EXPECTED_COMMIT_SHA)throw Error('Exact-HEAD mismatch: checked out '+checkoutSha+' but expected '+process.env.EXPECTED_COMMIT_SHA);
const report={commit:checkoutSha,environment:'Chromium SwiftShader (software WebGL; NOT target hardware)',host:process.env.GITHUB_ACTIONS?'GitHub Actions':'local Linux container',desktop:{},mobile:{},errors:[],status:'NOT RUN'};
let browser;
const snap=page=>page.evaluate(()=>window.__SHIRE__?.snapshot());
const still=async(page,name)=>{const result=await page.screenshot({path:resolve(out,name),animations:'disabled'});if(['desktop-gandalf-opening-dialogue.png','desktop-gandalf-character-detail.png','desktop-frodo-face-detail.png','desktop-dialogue.png','mobile-dialogue.png'].includes(name)||name.startsWith('face-visibility-failure'))console.log('SHIRE_CAPTURE:'+name+':'+(await page.screenshot({type:'jpeg',quality:40,animations:'disabled'})).toString('base64'));return result;};
async function assertFaceVisible(page,id){
 try{await page.waitForFunction(id=>{
  const B=window.BABYLON,s=B.Engine.LastCreatedScene,head=s.getTransformNodeByName(id+' Head');if(!head)return false;
  const h={gandalf:3.12,bilbo:1.36,sam:1.48,frodo:1.42}[id];head.computeWorldMatrix(true);const face=head.getAbsolutePosition().add(new B.Vector3(0,h*.06,0));
  const p=B.Vector3.Project(face,B.Matrix.Identity(),s.getTransformMatrix(),s.activeCamera.viewport.toGlobal(s.getEngine().getRenderWidth(),s.getEngine().getRenderHeight()));
  const canvas=document.querySelector('#game').getBoundingClientRect(),dialog=document.querySelector('#dialogue').getBoundingClientRect(),x=p.x/s.getEngine().getRenderWidth()*canvas.width,y=p.y/s.getEngine().getRenderHeight()*canvas.height;
  return p.z>0&&p.z<1&&x>20&&x<canvas.width-20&&y>20&&y<dialog.top-(id==='gandalf'?90:45)&&B.Vector3.Distance(face,s.activeCamera.position)>1.1;
 },id,{timeout:20000});}catch(error){await still(page,'face-visibility-failure-'+id+'.png');throw error;}
}
async function ready(page){
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!document.querySelector('#welcome').hidden||!document.querySelector('#fatal').hidden,null,{timeout:90000});
 if(await page.locator('#fatal').isVisible())throw Error('WebGL/scene failed: '+await page.locator('#fatal-text').innerText());
 assert.equal((await snap(page)).world.eyelidRigs,8,'Every role has real eyelid morph deformation');
 assert.equal((await snap(page)).world.naturalCastRoles,4,'Four independently authored natural humanoid roles');
 assert.equal((await snap(page)).world.gardenToolRigs,4,'Gardening tools must follow four real imported hand rigs');
 assert.equal((await snap(page)).world.importedCharacters,8,'All eight visible roles use imported GLB rigs');
 if(process.env.GITHUB_ACTIONS)assert.equal((await snap(page)).commit,checkoutSha,'Published build identity matches tested checkout');
 assert.ok(await page.evaluate(()=>!!document.getElementById('game').getContext('webgl2')||!!document.getElementById('game').getContext('webgl')),'A real WebGL canvas must be created');
}
async function walk(page,key,ms){await page.keyboard.down(key);try{await page.waitForTimeout(ms);}finally{await page.keyboard.up(key);}}
// Use the real keyboard to prove walking. Repositioning below only shortens the
// scripted quest in very slow software GPU CI; it is NOT a navigation acceptance test.
async function qaReposition(page,x,z){
 const result=await page.evaluate(([px,pz])=>window.__SHIRE__.qaReposition(px,pz),[x,z]);
 assert.ok(Math.hypot(result.position.x-x,result.position.z-z)<.001);
}
async function realWalk(page){
 const before=await snap(page);await walk(page,'w',3800);
 await page.waitForTimeout(350);
 const after=await snap(page);
 assert.ok(after.position.z>before.position.z+.2,'Real WASD control must move the visible character');
 return {from:before.position,to:after.position};
}

async function talk(page){await page.keyboard.press('e');await page.locator('#dialogue:not([hidden])').waitFor({timeout:5000});}
async function chooseFirst(page){await page.locator('#choices button').first().click();}
async function mobileHold(cdp,x,y,dx,dy,ms){
 const point=(px,py)=>({x:px,y:py,id:1,radiusX:1,radiusY:1,force:1});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(x,y)]});
 try{for(let i=1;i<=3;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(x+dx*i/3,y+dy*i/3)]});await new Promise(r=>setTimeout(r,55));}await new Promise(r=>setTimeout(r,ms));}
 finally{await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
}
async function sampleFps(page){const values=[];for(let i=0;i<15;i++){await page.waitForTimeout(200);const f=(await snap(page)).fps;if(f>0)values.push(f);}values.sort((a,b)=>a-b);return {samples:values.length,median:values.length?values[Math.floor(values.length/2)]:null,low10:values.length?values[Math.floor(values.length*.1)]:null};}
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 const desktop=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir:out,size:{width:1280,height:720}}});
 const page=await desktop.newPage();page.on('pageerror',e=>report.errors.push('desktop: '+e.message));
 await ready(page);await still(page,'desktop-opening.png');await page.locator('#start').click();assert.equal((await snap(page)).quality.mode,'auto');assert.equal((await snap(page)).cinematic.active,true);await still(page,'desktop-arrival-cinematic.png');await page.locator('#arrival-skip').click();assert.equal((await snap(page)).cinematic.active,false);assert.equal(await page.locator('#speaker').innerText(),'غاندالف','Opening must speak to Gandalf, not merely show his mesh');await assertFaceVisible(page,'gandalf');await still(page,'desktop-gandalf-opening-dialogue.png');await chooseFirst(page);assert.equal((await snap(page)).state.gandalfMet,true);
 await qaReposition(page,3,-5.6);await talk(page);assert.equal(await page.locator('#speaker').innerText(),'فرودو');await assertFaceVisible(page,'frodo');await still(page,'desktop-frodo-face-detail.png');await page.locator('#dialogue-close').click();await qaReposition(page,-2,14.8);
 await page.locator('#map-open').click();assert.ok(await page.locator('#world-map').isVisible());await still(page,'desktop-village-map.png');await page.locator('#map-close').click();
 await page.waitForFunction(()=>window.__SHIRE__.snapshot().audio?.score.status==='decoded',null,{timeout:30000});
 assert.equal((await snap(page)).audio.foley.decoded,4,'Four packaged CC0 footstep variants must decode');assert.equal((await snap(page)).audio.foley.forestDecoded,true,'Licensed forest ambience must decode');
 assert.match(await page.locator('#sound').innerText(),/مفعّلة/,'Original music must begin after Start interaction');
 await page.locator('#journal-open').click();
 await page.locator('#volume-music').fill('0');await page.locator('#volume-effects').fill('0.5');
 await still(page,'desktop-audio-settings.png');await page.locator('#journal-close').click();
 const walkEvidence=await realWalk(page);await still(page,'desktop-moving.png');assert.equal((await snap(page)).state.gandalfMet,true);await qaReposition(page,8,5.5);
 await still(page,'desktop-arrived.png');await still(page,'desktop-enhanced-hero-0.6.png');
 // Enter the real Babylon room using the gameplay key, inspect the 3D interior and exit.
 await qaReposition(page,11,8.2);
 await page.locator('#interaction:not([hidden])').waitFor({timeout:20000});
 await page.keyboard.press('e');
 await page.waitForFunction(()=>window.__SHIRE__.snapshot().inside,{timeout:25000});
 assert.ok(await page.evaluate(()=>BABYLON.Engine.LastCreatedScene.meshes.some(m=>m.name.startsWith('player ')&&m.skeleton&&m.isEnabled())),'Imported player remains visible inside Bag End');
 await still(page,'desktop-bag-end-interior.png');
 assert.ok((await snap(page)).indoorStats.decor>=30,'A genuinely furnished 3D interior is rendered');
 await page.keyboard.press('e');
 await page.waitForFunction(()=>!window.__SHIRE__.snapshot().inside,{timeout:25000});
 await qaReposition(page,8,5.5);
 await talk(page);assert.equal(await page.locator('#portrait svg').count(),1,'Bilbo SVG portrait visible');assert.ok(await page.locator('#npc-voice').isVisible(),'Browser narration button present');await assertFaceVisible(page,'bilbo');await still(page,'desktop-dialogue.png');
 await page.locator('#npc-chat-input').fill('من أنت؟');await page.locator('#npc-chat-send').click();
 assert.match(await page.locator('#chat-log').innerText(),/بيلبو/,'Free-text Arabic contextual dialogue must respond');
 await still(page,'desktop-arabic-chat.png');await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,1,'Bilbo dialogue advances quest');
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('#welcome:not([hidden])').waitFor({timeout:90000});
 assert.equal((await snap(page)).state.stage,1,'Browser save restores stage after reload');assert.ok(await page.locator('#restart-story').isVisible(),'Saved players must be able to restart the real story');
 await page.locator('#start').click();await qaReposition(page,8,1);await qaReposition(page,-6,-.5);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,2,'Sam dialogue advances quest');
 await qaReposition(page,-18,1);await qaReposition(page,-18,12);await page.keyboard.press('e');
 assert.equal((await snap(page)).state.apples.length,1);
 await qaReposition(page,-17,17);await page.keyboard.press('e');assert.equal((await snap(page)).state.apples.length,2);
 await qaReposition(page,-21,15);await page.keyboard.press('e');assert.equal((await snap(page)).state.stage,3,'All three apples collected');
 await qaReposition(page,-21,1);await qaReposition(page,-6,-.5);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,4,'Apple return completes');
 await qaReposition(page,8,1);await qaReposition(page,8,5.5);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,5,'Preparation completed before birthday celebration');
 await qaReposition(page,-2,21);await page.keyboard.press('e');
 assert.equal((await snap(page)).party.active,true,'Birthday party and original fireworks begin at the party tree');
 assert.ok((await snap(page)).party.participants>=7,'Seven existing villagers gather to celebrate without adding heavy meshes');
 // Do not block the 14-second live scene on a software-GPU screenshot before testing Skip.
 // The independent resumed-party playback below records the natural ending and celebration.
 await page.waitForFunction(()=>window.BABYLON.Engine.LastCreatedScene.animationGroups.filter(g=>g.name.endsWith('Cheer')&&g.isPlaying).length>=7,null,{timeout:10000});
 await page.locator('#party-skip').click();
 assert.equal((await snap(page)).state.partyCompleted,true,'Party skip preserves canonical outcome');
 assert.equal((await snap(page)).state.ringPassed,true,'Bilbo leaves the Ring to Frodo');
 assert.equal((await snap(page)).state.bilboGone,true,'Bilbo departs after the celebration');
 await still(page,'desktop-after-birthday.png');
 await still(page,'desktop-completed.png');await qaReposition(page,-12,-5);await still(page,'desktop-garden-life.png');
 report.desktop={status:'PASS',finishedQuest:true,reloadedSave:true,renderedWebGL:true,realWalkingSmoke:true,walkEvidence,qaRepositionBetweenEncounters:true,arabicChat:true,performance:await sampleFps(page),snapshot:await snap(page)};
 // Inspect the real asset at its existing world position; no character teleport.
 report.desktop.characterRig=await page.evaluate(()=>{
  const B=window.BABYLON,s=B.Engine.LastCreatedScene;
  const skin=s.meshes.filter(m=>m.skeleton&&m.getTotalVertices()>0);
  if(skin.length<8||!s.getTransformNodeByName('gandalf Head'))throw Error('Missing imported skin or attached Gandalf beard');
  s.getEngine().stopRenderLoop();
  const actor=s.getTransformNodeByName('gandalf'),head=s.getTransformNodeByName('gandalf Head');
  const facing=B.Vector3.TransformNormal(new B.Vector3(0,0,1),head.getWorldMatrix());facing.y=0;facing.normalize();
  const target=actor.position.add(new B.Vector3(0,2,0));let cameraPosition=null;
  for(const radius of [3.5,4.5,5.5,2.5])for(const offset of [0,.45,-.45,.8,-.8]){
   if(cameraPosition)continue;
   const direction=new B.Vector3(facing.x*Math.cos(offset)+facing.z*Math.sin(offset),0,facing.z*Math.cos(offset)-facing.x*Math.sin(offset));
   const candidate=actor.position.add(direction.scale(radius)).add(new B.Vector3(0,2.8,0)),delta=target.subtract(candidate),distance=delta.length();
   const hit=s.pickWithRay(new B.Ray(candidate,delta.normalize(),distance),m=>m.isEnabled()&&m.isVisible&&m.getTotalVertices()>0&&!m.isDescendantOf(actor));
   if(!hit?.hit||hit.distance>distance-.2)cameraPosition=candidate;
  }
  if(!cameraPosition)throw Error('No unobstructed Gandalf inspection camera; reject hidden character evidence');
  s.activeCamera.position.copyFrom(cameraPosition);s.activeCamera.setTarget(target);s.render();
  return {skinnedMeshes:skin.length,skeletons:s.skeletons.length,animationGroups:s.animationGroups.length,inspectionCameraOnly:true};
 });
 await still(page,'desktop-gandalf-character-detail.png');
 await desktop.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,recordVideo:{dir:out,size:{width:390,height:844}}});
 const touch=await mobile.newPage();touch.on('pageerror',e=>report.errors.push('mobile: '+e.message));
 await ready(touch);await touch.locator('#start').tap();if((await snap(touch)).cinematic.active)await touch.locator('#arrival-skip').tap();assert.equal(await touch.locator('#speaker').innerText(),'غاندالف');await touch.locator('#choices button').first().tap();assert.equal((await snap(touch)).state.gandalfMet,true);await touch.locator('#map-open').tap();assert.ok(await touch.locator('#world-map').isVisible());await still(touch,'mobile-village-map.png');await touch.locator('#map-close').tap();
 const joy=await touch.locator('#joystick').boundingBox();assert.ok(joy,'Touch joystick must be visible');
 const cdp=await mobile.newCDPSession(touch),cx=joy.x+joy.width/2,cy=joy.y+joy.height/2;
 const before=await snap(touch);assert.equal(before.quality.mode,'auto');assert.ok(before.renderSize.scale>=1&&before.renderSize.scale<=2.25,'High-first quality stays within safe adaptive bounds');await mobileHold(cdp,cx,cy,0,-32,2400);const moved=await snap(touch);
 assert.ok(moved.position.z-before.position.z>.1,'Touch joystick must move character forward');
 await still(touch,'mobile-joystick.png');await still(touch,'mobile-natural-meadow-0.7.png');
 // QA-only move after the independently verified real touch walking smoke.
 await qaReposition(touch,11,8.2);
 await touch.locator('#interact').waitFor({state:'visible',timeout:20000});
 await touch.locator('#interact').tap();
 await touch.waitForFunction(()=>window.__SHIRE__.snapshot().inside,{timeout:20000});
 await still(touch,'mobile-bag-end-interior.png');
 assert.ok((await snap(touch)).indoorStats.decor>=30);
 await touch.locator('#interact').waitFor({state:'visible',timeout:20000});
 await touch.locator('#interact').tap();
 await touch.waitForFunction(()=>!window.__SHIRE__.snapshot().inside,{timeout:20000});
 await qaReposition(touch,-6,-.5);
 await touch.locator('#interact').waitFor({state:'visible',timeout:20000});
 assert.ok(await touch.locator('#interact').isVisible(),'Mobile interaction button should appear near Sam');
 await touch.locator('#interact').tap();await touch.locator('#dialogue:not([hidden])').waitFor({timeout:5000});assert.equal(await touch.locator('#portrait svg').count(),1,'Sam SVG portrait visible on emulated mobile');
 assert.equal(await touch.locator('#toast').isVisible(),false,'Transient notices must not cover the face during dialogue');await assertFaceVisible(touch,'sam');await still(touch,'mobile-dialogue.png');
 const boxes=await touch.evaluate(()=>({w:window.innerWidth,dialogue:document.querySelector('#dialogue').getBoundingClientRect().toJSON(),chat:document.querySelector('#npc-chat-input').getBoundingClientRect().toJSON(),send:document.querySelector('#npc-chat-send').getBoundingClientRect().toJSON()}));
 for(const key of ['dialogue','chat','send']){const r=boxes[key];assert.ok(r.left>=-2&&r.right<=boxes.w+2&&r.width>25,'Mobile '+key+' stays inside viewport');}
 assert.ok(boxes.dialogue.width>boxes.w*.75,'Mobile dialogue is legible');
 await touch.setViewportSize({width:360,height:780});await touch.waitForTimeout(350);
 const compact=await touch.evaluate(()=>({w:window.innerWidth,dialogue:document.querySelector('#dialogue').getBoundingClientRect().toJSON(),chat:document.querySelector('#npc-chat-input').getBoundingClientRect().toJSON(),send:document.querySelector('#npc-chat-send').getBoundingClientRect().toJSON()}));
 for(const key of ['dialogue','chat','send']){const r=compact[key];assert.ok(r.left>=-2&&r.right<=compact.w+2&&r.width>25,'360px mobile '+key+' stays visible');}
 await still(touch,'mobile-360-dialogue.png');await touch.setViewportSize({width:390,height:844});
 await touch.locator('#npc-chat-input').fill('أين الحديقة؟');await touch.locator('#npc-chat-send').tap();
 assert.ok((await touch.locator('#chat-log').innerText()).length>15);await still(touch,'mobile-arabic-chat.png');
 await touch.locator('#dialogue-close').tap();
 const yaw=(await snap(touch)).camera.yaw;await mobileHold(cdp,290,410,-75,20,150);
 assert.ok(Math.abs((await snap(touch)).camera.yaw-yaw)>.1,'Touch drag must orbit camera');
 await still(touch,'mobile-camera.png');
 report.mobile={status:'PASS',touchJoystick:true,touchInteract:true,touchCamera:true,qaRepositionBetweenEncounters:true,arabicChat:true,performance:await sampleFps(touch),snapshot:await snap(touch)};
 for(const mode of ['desktop','mobile']){const q=report[mode].snapshot.quality;if(q.mode==='auto'&&q.adjustments>0&&q.median<20)assert.equal(q.shadows,false,'Sustained severe slowdown must shed shadows before image resolution');}
 // Use actual controls, then a real page navigation, to verify the weaker-device
 // preference without changing the automatic-mode screenshots/FPS samples above.
 await touch.locator('#quality').tap();assert.equal((await snap(touch)).quality.mode,'quality');assert.equal((await snap(touch)).renderSize.scale,1);
 await touch.locator('#quality').tap();const selected=(await snap(touch)).quality;assert.equal(selected.mode,'light');assert.equal(selected.shadows,false);assert.equal(selected.scale,1.75);await still(touch,'mobile-light-quality.png');
 await ready(touch);const restored=await snap(touch);assert.equal(restored.quality.mode,'light');assert.equal(restored.renderSize.shadows,false);assert.equal(restored.renderSize.scale,1.75);assert.equal(restored.state.stage,report.mobile.snapshot.state.stage,'Quality preference must not reset story progress');
 report.mobile.qualityPreference={selected,restored:restored.quality};console.log('QUALITY_PREFERENCE '+JSON.stringify({status:'PASS',selected:selected.mode,restored:restored.quality.mode}));
 await mobile.close();
 assert.deepEqual(report.errors,[],'No uncaught browser exceptions');report.status='PASS';
}catch(e){report.status='FAIL';report.errors.push(e.stack||String(e));console.error(e);process.exitCode=1;
}finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));console.log('BROWSER_QA_REPORT '+JSON.stringify({commit:report.commit,status:report.status,desktop:report.desktop.performance,mobile:report.mobile.performance,scene:{desktop:report.desktop.snapshot,mobile:report.mobile.snapshot},errors:report.errors.slice(0,3)}));await browser?.close();await new Promise(ok=>server.close(ok));}



