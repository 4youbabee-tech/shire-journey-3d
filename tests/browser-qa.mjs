// Real Chromium+WebGL QA. The CI GPU is software SwiftShader, not the owner's target PC.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const out=resolve('qa-evidence');
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
const report={commit:process.env.GITHUB_SHA||'local',environment:'GitHub Actions Chromium SwiftShader (software WebGL; NOT target hardware)',desktop:{},mobile:{},errors:[],status:'NOT RUN'};
let browser;
const snap=page=>page.evaluate(()=>window.__SHIRE__?.snapshot());
const still=async(page,name)=>page.screenshot({path:resolve(out,name),animations:'disabled'});
async function ready(page){
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!document.querySelector('#welcome').hidden||!document.querySelector('#fatal').hidden,null,{timeout:90000});
 if(await page.locator('#fatal').isVisible())throw Error('WebGL/scene failed: '+await page.locator('#fatal-text').innerText());
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
 await ready(page);await still(page,'desktop-opening.png');await page.locator('#start').click();
 const walkEvidence=await realWalk(page);await still(page,'desktop-moving.png');await qaReposition(page,8,7);
 await still(page,'desktop-arrived.png');await talk(page);await still(page,'desktop-dialogue.png');
 await page.locator('#npc-chat-input').fill('من أنت؟');await page.locator('#npc-chat-send').click();
 assert.match(await page.locator('#chat-log').innerText(),/بيلبو/,'Free-text Arabic contextual dialogue must respond');
 await still(page,'desktop-arabic-chat.png');await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,1,'Bilbo dialogue advances quest');
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('#welcome:not([hidden])').waitFor({timeout:90000});
 assert.equal((await snap(page)).state.stage,1,'Browser save restores stage after reload');
 await page.locator('#start').click();await qaReposition(page,8,1);await qaReposition(page,-6,1);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,2,'Sam dialogue advances quest');
 await qaReposition(page,-18,1);await qaReposition(page,-18,12);await page.keyboard.press('e');
 assert.equal((await snap(page)).state.apples.length,1);
 await qaReposition(page,-17,17);await page.keyboard.press('e');assert.equal((await snap(page)).state.apples.length,2);
 await qaReposition(page,-21,15);await page.keyboard.press('e');assert.equal((await snap(page)).state.stage,3,'All three apples collected');
 await qaReposition(page,-21,1);await qaReposition(page,-6,1);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,4,'Apple return completes');
 await qaReposition(page,8,1);await qaReposition(page,8,7);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,5,'Quest completed in actual browser interactions');
 await still(page,'desktop-completed.png');
 report.desktop={status:'PASS',finishedQuest:true,reloadedSave:true,renderedWebGL:true,realWalkingSmoke:true,walkEvidence,qaRepositionBetweenEncounters:true,arabicChat:true,performance:await sampleFps(page),snapshot:await snap(page)};
 await desktop.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,recordVideo:{dir:out,size:{width:390,height:844}}});
 const touch=await mobile.newPage();touch.on('pageerror',e=>report.errors.push('mobile: '+e.message));
 await ready(touch);await touch.locator('#start').tap();
 const joy=await touch.locator('#joystick').boundingBox();assert.ok(joy,'Touch joystick must be visible');
 const cdp=await mobile.newCDPSession(touch),cx=joy.x+joy.width/2,cy=joy.y+joy.height/2;
 const before=await snap(touch);await mobileHold(cdp,cx,cy,0,-32,2400);const moved=await snap(touch);
 assert.ok(moved.position.z-before.position.z>.1,'Touch joystick must move character forward');
 await still(touch,'mobile-joystick.png');
 // QA-only move after the independently verified real touch walking smoke.
 await qaReposition(touch,-6,1);
 await touch.locator('#interact').waitFor({state:'visible',timeout:20000});
 assert.ok(await touch.locator('#interact').isVisible(),'Mobile interaction button should appear near Sam');
 await touch.locator('#interact').tap();await touch.locator('#dialogue:not([hidden])').waitFor({timeout:5000});
 await still(touch,'mobile-dialogue.png');
 await touch.locator('#npc-chat-input').fill('أين الحديقة؟');await touch.locator('#npc-chat-send').tap();
 assert.ok((await touch.locator('#chat-log').innerText()).length>15);await still(touch,'mobile-arabic-chat.png');
 await touch.locator('#dialogue-close').tap();
 const yaw=(await snap(touch)).camera.yaw;await mobileHold(cdp,290,410,-75,20,150);
 assert.ok(Math.abs((await snap(touch)).camera.yaw-yaw)>.1,'Touch drag must orbit camera');
 await still(touch,'mobile-camera.png');
 report.mobile={status:'PASS',touchJoystick:true,touchInteract:true,touchCamera:true,qaRepositionBetweenEncounters:true,arabicChat:true,performance:await sampleFps(touch),snapshot:await snap(touch)};
 await mobile.close();
 assert.deepEqual(report.errors,[],'No uncaught browser exceptions');report.status='PASS';
}catch(e){report.status='FAIL';report.errors.push(e.stack||String(e));console.error(e);process.exitCode=1;
}finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));console.log('BROWSER_QA_REPORT '+JSON.stringify({commit:report.commit,status:report.status,desktop:report.desktop.performance,mobile:report.mobile.performance,errors:report.errors.slice(0,3)}));await browser?.close();await new Promise(ok=>server.close(ok));}