// Additional live canvas + post-master Web Audio recording. Original Playwright
// UI video remains separate; this stream does not pretend to include the DOM HUD.
import {writeFile} from 'node:fs/promises';import {resolve} from 'node:path';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
export async function startLiveAV(page){
 return page.evaluate(()=>new Promise((resolve,reject)=>{
  const source=document.querySelector('#game'),scene=BABYLON.Engine.LastCreatedScene,audio=window.__SHIRE__.qaAudioStream();
  if(!audio?.getAudioTracks().length){reject(Error('Missing real game audio stream'));return;}
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360;const ctx=canvas.getContext('2d'),stream=canvas.captureStream(30);for(const track of audio.getAudioTracks())stream.addTrack(track.clone());
  const mime='video/webm;codecs=vp8,opus';if(!MediaRecorder.isTypeSupported(mime)){reject(Error('VP8/Opus capture unavailable'));return;}
  const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:800000,audioBitsPerSecond:96000}),state={recorder,stream,chunks:[],frames:0,captions:[],start:0,error:null};window.__SHIRE_AV__=state;
  recorder.ondataavailable=e=>{if(e.data.size)state.chunks.push(e.data);};recorder.onerror=e=>{state.error=String(e.error||e);reject(Error(state.error));};recorder.onstart=()=>{state.didStart=true;};
  state.observer=scene.onAfterRenderObservable.add(()=>{ctx.drawImage(source,0,0,640,360);state.frames++;if(!state.start){state.start=performance.now();try{recorder.start(1000);resolve({mime,tracks:stream.getTracks().map(t=>t.kind),canvasOnly:true,postMasterAudio:true});}catch(e){state.error=String(e);reject(e);}}const el=[...document.querySelectorAll('#arrival-caption,#party-caption')].find(e=>!e.closest('[hidden]'));if(el&&el.textContent!==state.captions.at(-1)?.text)state.captions.push({at:(performance.now()-state.start)/1000,text:el.textContent});});
 }));
}
export async function stopLiveAV(page,out,label){
 const result=await page.evaluate(()=>new Promise((resolve,reject)=>{
  const state=window.__SHIRE_AV__;if(!state){resolve(null);return;}const scene=BABYLON.Engine.LastCreatedScene;scene.onAfterRenderObservable.remove(state.observer);
  state.recorder.onstop=()=>{if(state.error){reject(Error(state.error));return;}const blob=new Blob(state.chunks,{type:state.recorder.mimeType}),reader=new FileReader();reader.onerror=()=>reject(Error('A/V export failed'));reader.onload=()=>{for(const t of state.stream.getTracks())t.stop();window.__SHIRE_AV__=null;resolve({data:reader.result,frames:state.frames,captions:state.captions,wallSeconds:(performance.now()-state.start)/1000});};reader.readAsDataURL(blob);};state.recorder.stop();
 }));
 assert.ok(result&&result.frames>4,'A/V must contain actual rendered game frames');const raw=resolve(out,label+'-live-av-raw.webm'),file=resolve(out,label+'-live-av.webm');await writeFile(raw,Buffer.from(result.data.slice(result.data.indexOf(',')+1),'base64'));
 // Stream-copy only: write seek/duration metadata, without retiming or inserting audio.
 execFileSync('ffmpeg',['-v','error','-y','-i',raw,'-c','copy',file],{timeout:30000});
 const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_type,codec_name,width,height','-show_entries','format=duration','-of','json',file],{encoding:'utf8'}));assert.ok(probe.streams.some(s=>s.codec_type==='video'));assert.ok(probe.streams.some(s=>s.codec_type==='audio'));
 const pcm=execFileSync('ffmpeg',['-v','error','-i',file,'-map','0:a:0','-ac','1','-ar','8000','-f','f32le','pipe:1'],{timeout:30000,maxBuffer:12000000});let square=0,peak=0;for(let i=0;i<pcm.length;i+=4){const v=pcm.readFloatLE(i);square+=v*v;peak=Math.max(peak,Math.abs(v));}const rms=Math.sqrt(square/(pcm.length/4));assert.ok(rms>1e-6&&peak<=1.001,'Recorded game mix must be non-silent and unclipped');
 const metadata={file:label+'-live-av.webm',raw:label+'-live-av-raw.webm',source:'actual game canvas and post-master audio; original full-UI recording retained separately',frames:result.frames,wallSeconds:result.wallSeconds,media:probe,audio:{rms,peak},captions:result.captions};await writeFile(resolve(out,label+'-live-av.json'),JSON.stringify(metadata,null,2));return metadata;
}
