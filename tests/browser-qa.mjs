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
async function reach(page,x,z){
 for(let i=0;i<30;i++){
  const p=(await snap(page)).position,dx=x-p.x,dz=z-p.z;
  if(Math.hypot(dx,dz)<1.25)return;
  const alongZ=Math.abs(dz)>Math.abs(dx),key=alongZ?(dz>0?'w':'s'):(dx>0?'d':'a');
  const duration=Math.min(1150,Math.max(150,(Math.abs(alongZ?dz:dx)-.45)/2.9*1000));
  await walk(page,key,duration);
  const next=(await snap(page)).position;
  if(Math.hypot(x-next.x,z-next.z)>Math.hypot(dx,dz)-.07)throw Error(`Blocked while walking toward ${x},${z}: ${JSON.stringify(next)}`);
 }
 throw Error(`Could not reach ${x},${z}: ${JSON.stringify((await snap(page)).position)}`);
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
 const initial=(await snap(page)).position;await reach(page,0,7);await reach(page,8,7);
 assert.ok(Math.hypot((await snap(page)).position.x-initial.x,(await snap(page)).position.z-initial.z)>10,'Desktop WASD movement');
 await still(page,'desktop-arrived.png');await talk(page);await still(page,'desktop-dialogue.png');await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,1,'Bilbo dialogue advances quest');
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('#welcome:not([hidden])').waitFor({timeout:90000});
 assert.equal((await snap(page)).state.stage,1,'Browser save restores stage after reload');
 await page.locator('#start').click();await reach(page,8,1);await reach(page,-6,1);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,2,'Sam dialogue advances quest');
 await reach(page,-18,1);await reach(page,-18,12);await page.keyboard.press('e');
 assert.equal((await snap(page)).state.apples.length,1);
 await reach(page,-17,17);await page.keyboard.press('e');assert.equal((await snap(page)).state.apples.length,2);
 await reach(page,-21,15);await page.keyboard.press('e');assert.equal((await snap(page)).state.stage,3,'All three apples collected');
 await reach(page,-21,1);await reach(page,-6,1);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,4,'Apple return completes');
 await reach(page,8,1);await reach(page,8,7);await talk(page);await chooseFirst(page);
 assert.equal((await snap(page)).state.stage,5,'Quest completed in actual browser interactions');
 await still(page,'desktop-completed.png');
 report.desktop={status:'PASS',finishedQuest:true,reloadedSave:true,renderedWebGL:true,performance:await sampleFps(page),snapshot:await snap(page)};
 await desktop.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,recordVideo:{dir:out,size:{width:390,height:844}}});
 const touch=await mobile.newPage();touch.on('pageerror',e=>report.errors.push('mobile: '+e.message));
 await ready(touch);await touch.locator('#start').tap();
 const joy=await touch.locator('#joystick').boundingBox();assert.ok(joy,'Touch joystick must be visible');
 const cdp=await mobile.newCDPSession(touch),cx=joy.x+joy.width/2,cy=joy.y+joy.height/2;
 const before=await snap(touch);await mobileHold(cdp,cx,cy,0,-32,2400);const moved=await snap(touch);
 assert.ok(moved.position.z-before.position.z>1.5,'Touch joystick must move character forward');
 await still(touch,'mobile-joystick.png');
 await mobileHold(cdp,cx,cy,0,-32,2900);await mobileHold(cdp,cx,cy,-32,0,2100);
 assert.ok(await touch.locator('#interact').isVisible(),'Mobile interaction button should appear near Sam');
 await touch.locator('#interact').tap();await touch.locator('#dialogue:not([hidden])').waitFor({timeout:5000});
 await still(touch,'mobile-dialogue.png');await touch.locator('#dialogue-close').tap();
 const yaw=(await snap(touch)).camera.yaw;await mobileHold(cdp,290,410,-75,20,150);
 assert.ok(Math.abs((await snap(touch)).camera.yaw-yaw)>.1,'Touch drag must orbit camera');
 await still(touch,'mobile-camera.png');
 report.mobile={status:'PASS',touchJoystick:true,touchInteract:true,touchCamera:true,performance:await sampleFps(touch),snapshot:await snap(touch)};
 await mobile.close();
 assert.deepEqual(report.errors,[],'No uncaught browser exceptions');report.status='PASS';
}catch(e){report.status='FAIL';report.errors.push(e.stack||String(e));console.error(e);process.exitCode=1;
}finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));console.log('BROWSER_QA_REPORT '+JSON.stringify({commit:report.commit,status:report.status,desktop:report.desktop.performance,mobile:report.mobile.performance,errors:report.errors.slice(0,3)}));await browser?.close();await new Promise(ok=>server.close(ok));}
