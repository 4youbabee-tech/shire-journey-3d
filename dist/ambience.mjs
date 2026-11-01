import {createVillageFoley} from './village-foley.mjs';
// Original sampled music, procedural nature and licensed CC0 footstep recordings.
import {pastoralPhrase} from './score.mjs';
export function createShireAmbience(AudioContextConstructor){
 const context=new AudioContextConstructor(),master=context.createGain();master.gain.value=.22;master.connect(context.destination);
 const nature=context.createGain(),music=context.createGain(),effects=context.createGain();nature.connect(effects);music.connect(master);effects.connect(master);const village=createVillageFoley(context,effects);let creakClock=0,leatherClock=0,loadClock=0,houseClock=0,houseEvent=0;
 let captureDestination=null,ringDrops=0,daylight=1;
 function captureStream(){if(!context.createMediaStreamDestination)return null;if(!captureDestination){captureDestination=context.createMediaStreamDestination();master.connect(captureDestination);}return captureDestination.stream;}
 const levels={master:1,music:.65,effects:1};
 function setVolume(channel,value){if(!(channel in levels)||!Number.isFinite(value))return;levels[channel]=Math.max(0,Math.min(1,value));const node=channel==='master'?master:channel==='music'?music:effects;node.gain.setValueAtTime(levels[channel]*(channel==='master'?.22:1),context.currentTime);}
 for(const key of Object.keys(levels))setVolume(key,levels[key]);
 // A four-second looping filtered-noise bed: wind through leaves with soft air movement.
 const buffer=context.createBuffer(1,context.sampleRate*4,context.sampleRate),samples=buffer.getChannelData(0);let last=0;
 for(let i=0;i<samples.length;i++){last=(last+.025*(Math.random()*2-1))/1.025;samples[i]=last*2.25;}
 const wind=context.createBufferSource(),windGain=context.createGain();wind.buffer=buffer;wind.loop=true;windGain.gain.value=.08;wind.connect(windGain);windGain.connect(nature);let windStarted=false;
 let timer=null,phrase=0,birdTick=0,scoreBuffer=null,scoreSource=null,scorePromise=null,scoreStatus='unloaded',scoreError=null,footClock=0,cartClock=0,foleyBuffers=[],foleyStatus='unloaded',lastFoot=-1,foleyPromise=null,forestBuffer=null;
 async function loadScore(){
  if(!context.decodeAudioData||typeof fetch!=='function')return;
  if(!scorePromise)scorePromise=(async()=>{try{scoreStatus='loading';const response=await fetch(new URL('./assets/audio/hearth-and-hills.mp3',import.meta.url));if(!response.ok)throw Error('Score HTTP '+response.status);scoreBuffer=await context.decodeAudioData(await response.arrayBuffer());scoreStatus='decoded';}catch(error){scoreStatus='fallback';scoreError=error.message;}})();
  await scorePromise;
 }
 async function loadFoley(){
  if(!context.decodeAudioData||typeof fetch!=='function'){foleyStatus='fallback';return;}
  if(!foleyPromise)foleyPromise=(async()=>{foleyStatus='loading';const results=await Promise.allSettled(['footstep-00','footstep-02','footstep-06','footstep-09','forest-birds'].map(async name=>{const response=await fetch(new URL('./assets/audio/'+name+'.mp3',import.meta.url));if(!response.ok)throw Error('Foley HTTP '+response.status);return context.decodeAudioData(await response.arrayBuffer());}));foleyBuffers=results.slice(0,4).filter(r=>r.status==='fulfilled').map(r=>r.value);forestBuffer=results[4]?.status==='fulfilled'?results[4].value:null;foleyStatus=foleyBuffers.length===4?'decoded':foleyBuffers.length?'partial':'fallback';})();
  await foleyPromise;
 }
 const ringImpact=context.createBuffer(1,Math.floor(context.sampleRate*.65),context.sampleRate),metal=ringImpact.getChannelData(0);
 for(let i=0;i<metal.length;i++){const t=i/context.sampleRate;metal[i]=(.35*Math.sin(t*2*Math.PI*1720)+.19*Math.sin(t*2*Math.PI*2387)+.11*Math.sin(t*2*Math.PI*3671))*Math.exp(-t*13)*Math.min(1,t*2500);}
 function ringDrop(){if(context.state!=='running')return;const source=context.createBufferSource(),gain=context.createGain();source.buffer=ringImpact;gain.gain.value=.5;source.connect(gain);gain.connect(effects);source.onended=()=>{source.disconnect?.();gain.disconnect?.();};source.start();ringDrops++;}
 function setInterior(on){const value=on?.12:1;if(nature.gain.setTargetAtTime)nature.gain.setTargetAtTime(value,context.currentTime,.4);else nature.gain.setValueAtTime(value,context.currentTime);}
 function beginScore(){if(!scoreBuffer||scoreSource)return;scoreSource=context.createBufferSource();scoreSource.buffer=scoreBuffer;scoreSource.loop=true;scoreSource.connect(music);scoreSource.start();}
 const impact=context.createBuffer(1,Math.floor(context.sampleRate*.22),context.sampleRate);
 const impactData=impact.getChannelData(0);let rseed=4831;
 for(let i=0;i<impactData.length;i++){rseed=(Math.imul(rseed,1664525)+1013904223)>>>0;const t=i/context.sampleRate;impactData[i]=((rseed/4294967296*2-1)*.35+Math.sin(t*410)*.5)*Math.exp(-t*33)*Math.min(1,t*1400);}
 function step(volume,rate=1,foot=false,wood=false){
  if(context.state!=='running')return;const source=context.createBufferSource(),gain=context.createGain();
  if(foot&&foleyBuffers.length){const next=(lastFoot+1+Math.floor(Math.random()*Math.max(1,foleyBuffers.length-1)))%foleyBuffers.length;lastFoot=next;source.buffer=foleyBuffers[next];}else source.buffer=impact;
  if(source.playbackRate)source.playbackRate.value=rate;gain.gain.value=volume;
  const filter=foot&&foleyBuffers.length&&context.createBiquadFilter?context.createBiquadFilter():null;
  if(filter){filter.type='lowpass';filter.frequency.value=wood?4400:1000;source.connect(filter);filter.connect(gain);}else source.connect(gain);
  gain.connect(effects);source.onended=()=>{source.disconnect?.();filter?.disconnect();gain.disconnect?.();};source.start();
 }

 const osc=(freq,when,duration,volume,type='sine',end=freq,bus=effects)=>{
  const o=context.createOscillator(),g=context.createGain();o.type=type;
  o.frequency.setValueAtTime(Math.max(1,freq),when);o.frequency.exponentialRampToValueAtTime(Math.max(1,end),when+duration);
  g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(volume,when+Math.min(.11,duration*.23));g.gain.exponentialRampToValueAtTime(.0001,when+duration);
  o.connect(g);g.connect(bus);o.start(when);o.stop(when+duration+.01);
 };
 function birds(now){
  const i=birdTick++;
  if(forestBuffer&&forestBuffer.duration>.6){
   const source=context.createBufferSource(),gain=context.createGain(),duration=Math.min(3.4,forestBuffer.duration-.1),offset=(i*1.713)%Math.max(.1,forestBuffer.duration-duration-.05);source.buffer=forestBuffer;source.playbackRate.value=.97+(i%4)*.02;
   gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.08,now+.18);gain.gain.setValueAtTime(.08,now+duration-.3);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
   const pan=context.createStereoPanner?.();source.connect(gain);if(pan){pan.pan.setValueAtTime(Math.sin(i*2.399)*.5,now);gain.connect(pan);pan.connect(nature);}else gain.connect(nature);
   source.onended=()=>{source.disconnect?.();gain.disconnect?.();pan?.disconnect();};source.start(now,offset,duration);source.stop?.(now+duration+.05);windGain.gain.setValueAtTime(.07,now);return;
  }

  // Two separated whistles with pitch curves feel less electronic than fixed beeps.
  const base=1050+(i%5)*90;
  osc(base,now,.19,.028,'sine',base*1.36,nature);
  osc(base*1.4,now+.27,.24,.020,'sine',base*.91,nature);
  windGain.gain.setValueAtTime(.06+.035*Math.sin(i*.41),now);
 }
 function song(now){for(const n of pastoralPhrase(phrase++))osc(n.frequency,now+n.at,n.duration,n.volume,n.wave,n.frequency*.997,music);}
 function cycle(){if(context.state!=='running')return;const now=context.currentTime+.07;if(daylight>.2)birds(now);else{const i=birdTick++;if(i%3===0)osc(420+(i%4)*24,now,.42,.008,'sine',365,nature);}if(!scoreBuffer&&(birdTick-1)%2===0)song(now+.12);}
 return {
  captureStream,ringDrop,setInterior,setDaylight(value){if(Number.isFinite(value))daylight=Math.max(0,Math.min(1,value));},cue:(name,options)=>village.cue(name,options),get worldFoley(){return {...village.snapshot,ringDrops};},
  get foley(){return {status:foleyStatus,decoded:foleyBuffers.length,forestDecoded:!!forestBuffer};},
  get score(){return {status:scoreStatus,duration:scoreBuffer?.duration||0,error:scoreError};},
  update(dt,{moving=false,wood=false,cart=false,cartDistance=30,houseDistance=Infinity,housePan=0}={}){
   if(context.state!=='running')return;
   footClock+=moving?dt:0;if(moving&&footClock>.47){footClock%=.47;step(wood?.12:.085,wood?1.03:.94,true,wood);}
   creakClock+=cart?dt:0;leatherClock+=cart?dt:0;loadClock+=cart?dt:0;const nearGain=1/(1+Math.max(0,cartDistance)*.15);
   if(cart&&creakClock>1.43){creakClock%=1.43;village.cue('cart-creak',{volume:.34*nearGain,rate:.94+(Math.floor(context.currentTime)%4)*.025});}
   if(cart&&leatherClock>2.17){leatherClock%=2.17;village.cue('leather',{volume:.22*nearGain});}
   if(cart&&loadClock>3.71){loadClock%=3.71;village.cue('cart-load',{volume:.16*nearGain,rate:.87});}
   if(houseDistance<9){houseClock+=dt;if(houseClock>13+(houseEvent%3)*4.3){houseClock=0;const name=['leather','book-page','door-close'][houseEvent++%3];village.cue(name,{volume:.16/(1+houseDistance*.35),pan:housePan});}}
   cartClock+=cart?dt:0;if(cart&&cartClock>.28){cartClock%=.28;step(.22/(1+cartDistance*.15),.62+(Math.floor(context.currentTime*4)%2)*.15);}
  },
  setVolume,get levels(){return {...levels};},get state(){return context.state;},
  start:async()=>{await context.resume();if(!windStarted){wind.start();windStarted=true;}await Promise.all([loadScore(),loadFoley(),village.load()]);beginScore();cycle();if(!timer)timer=setInterval(cycle,6000);},
  suspend:()=>context.suspend(),resume:()=>context.resume(),
  stop:()=>{village.stop();if(timer){clearInterval(timer);timer=null;}return context.suspend();},
  close:()=>{village.stop();if(timer)clearInterval(timer);return context.close();}
 };
}

