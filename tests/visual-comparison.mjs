// A fixed player-camera view for comparing real rasterization, not generated artwork.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.env.QA_DIST||'dist'),out=resolve(process.env.QA_OUT||'qa-visual');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{const p=resolve(root,'.'+(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!p.startsWith(root+sep))throw Error();res.setHeader('Content-Type',({'.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.html':'text/html'})[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:1280,height:720}});await page.goto(`http://127.0.0.1:${server.address().port}/?qa=1`);await page.locator('#start').waitFor({state:'visible',timeout:90000});await page.locator('#start').click();await page.evaluate(()=>window.__SHIRE__.qaReposition(8,6));await page.waitForTimeout(3000);await page.screenshot({path:resolve(out,'player-view.png')});await writeFile(resolve(out,'snapshot.json'),JSON.stringify(await page.evaluate(()=>window.__SHIRE__.snapshot()),null,2));}finally{await browser?.close();await new Promise(r=>server.close(r));}
