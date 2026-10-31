// Packaged Kenney CC0 recordings; decoded once after the browser audio gesture.
export const VILLAGE_CLIPS=Object.freeze(['door-open','door-close','cart-creak-1','cart-creak-2','cart-creak-3','leather-1','leather-2','book-page','cart-load']);
const GROUPS=Object.freeze({'cart-creak':['cart-creak-1','cart-creak-2','cart-creak-3'],leather:['leather-1','leather-2']});
export function createVillageFoley(context,output){
 const buffers=new Map(),voices=new Set(),indices=new Map();let pending=null,status='unloaded',plays=0;const events={};
 async function load(){
  if(context.state!=='running')return;
  if(!context.decodeAudioData||typeof fetch!=='function'){status='fallback';return;}
  if(!pending)pending=(async()=>{status='loading';const results=await Promise.allSettled(VILLAGE_CLIPS.map(async name=>{const r=await fetch(new URL('./assets/audio/'+name+'.mp3',import.meta.url));if(!r.ok)throw Error('Foley HTTP '+r.status);buffers.set(name,await context.decodeAudioData(await r.arrayBuffer()));}));status=results.every(r=>r.status==='fulfilled')?'decoded':buffers.size?'partial':'fallback';})();
  await pending;
 }
 function cue(name,{volume=.2,rate=1,pan=0}={}){
  if(context.state!=='running'||voices.size>=4)return false;
  const choices=(GROUPS[name]||[name]).filter(n=>buffers.has(n));if(!choices.length)return false;
  const index=indices.get(name)||0;indices.set(name,index+1);const source=context.createBufferSource(),gain=context.createGain(),panner=context.createStereoPanner?.();source.buffer=buffers.get(choices[index%choices.length]);
  if(source.playbackRate)source.playbackRate.value=Math.max(.8,Math.min(1.2,Number.isFinite(rate)?rate:1));gain.gain.value=Math.max(0,Math.min(.7,Number.isFinite(volume)?volume:.2));source.connect(gain);
  if(panner){panner.pan.value=Math.max(-1,Math.min(1,Number.isFinite(pan)?pan:0));gain.connect(panner);panner.connect(output);}else gain.connect(output);
  const done=()=>{voices.delete(source);source.disconnect?.();gain.disconnect?.();panner?.disconnect?.();};source.onended=done;voices.add(source);source.start();plays++;events[name]=(events[name]||0)+1;return true;
 }
 function stop(){for(const source of [...voices]){source.stop?.();source.onended?.();}voices.clear();}
 return {load,cue,stop,get snapshot(){return {status,decoded:buffers.size,voices:voices.size,plays,events:{...events}};}};
}
