// Self-contained original music and pastoral soundscape. Mobile-safe Web Audio.
import {pastoralPhrase} from './score.mjs';
export function createShireAmbience(AudioContextConstructor){
 const context=new AudioContextConstructor(),master=context.createGain();master.gain.value=.22;master.connect(context.destination);
 const music=context.createGain(),effects=context.createGain();music.connect(master);effects.connect(master);
 const levels={master:1,music:.65,effects:1};
 function setVolume(channel,value){if(!(channel in levels)||!Number.isFinite(value))return;levels[channel]=Math.max(0,Math.min(1,value));const node=channel==='master'?master:channel==='music'?music:effects;node.gain.setValueAtTime(levels[channel]*(channel==='master'?.22:1),context.currentTime);}
 for(const key of Object.keys(levels))setVolume(key,levels[key]);
 // A four-second looping filtered-noise bed: wind through leaves with soft air movement.
 const buffer=context.createBuffer(1,context.sampleRate*4,context.sampleRate),samples=buffer.getChannelData(0);let last=0;
 for(let i=0;i<samples.length;i++){last=(last+.025*(Math.random()*2-1))/1.025;samples[i]=last*2.25;}
 const wind=context.createBufferSource(),windGain=context.createGain();wind.buffer=buffer;wind.loop=true;windGain.gain.value=.08;wind.connect(windGain);windGain.connect(effects);let windStarted=false;
 let timer=null,phrase=0,birdTick=0,scoreBuffer=null,scoreSource=null,scorePromise=null,scoreStatus='unloaded',scoreError=null,footClock=0,cartClock=0;
 async function loadScore(){
  if(!context.decodeAudioData||typeof fetch!=='function')return;
  if(!scorePromise)scorePromise=(async()=>{try{scoreStatus='loading';const response=await fetch(new URL('./assets/audio/hearth-and-hills.mp3',import.meta.url));if(!response.ok)throw Error('Score HTTP '+response.status);scoreBuffer=await context.decodeAudioData(await response.arrayBuffer());scoreStatus='decoded';}catch(error){scoreStatus='fallback';scoreError=error.message;}})();
  await scorePromise;
 }
 function beginScore(){if(!scoreBuffer||scoreSource)return;scoreSource=context.createBufferSource();scoreSource.buffer=scoreBuffer;scoreSource.loop=true;scoreSource.connect(music);scoreSource.start();}
 const impact=context.createBuffer(1,Math.floor(context.sampleRate*.22),context.sampleRate);
 const impactData=impact.getChannelData(0);let rseed=4831;
 for(let i=0;i<impactData.length;i++){rseed=(Math.imul(rseed,1664525)+1013904223)>>>0;const t=i/context.sampleRate;impactData[i]=((rseed/4294967296*2-1)*.35+Math.sin(t*410)*.5)*Math.exp(-t*33)*Math.min(1,t*1400);}
 function step(volume,rate=1){if(context.state!=='running')return;const s=context.createBufferSource(),g=context.createGain();s.buffer=impact;if(s.playbackRate)s.playbackRate.value=rate;g.gain.value=volume;s.connect(g);g.connect(effects);s.start();}
 const osc=(freq,when,duration,volume,type='sine',end=freq,bus=effects)=>{
  const o=context.createOscillator(),g=context.createGain();o.type=type;
  o.frequency.setValueAtTime(Math.max(1,freq),when);o.frequency.exponentialRampToValueAtTime(Math.max(1,end),when+duration);
  g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(volume,when+Math.min(.11,duration*.23));g.gain.exponentialRampToValueAtTime(.0001,when+duration);
  o.connect(g);g.connect(bus);o.start(when);o.stop(when+duration+.01);
 };
 function birds(now){
  const i=birdTick++;
  // Two separated whistles with pitch curves feel less electronic than fixed beeps.
  const base=1050+(i%5)*90;
  osc(base,now,.19,.028,'sine',base*1.36);
  osc(base*1.4,now+.27,.24,.020,'sine',base*.91);
  windGain.gain.setValueAtTime(.06+.035*Math.sin(i*.41),now);
 }
 function song(now){for(const n of pastoralPhrase(phrase++))osc(n.frequency,now+n.at,n.duration,n.volume,n.wave,n.frequency*.997,music);}
 function cycle(){if(context.state!=='running')return;const now=context.currentTime+.07;birds(now);if(!scoreBuffer&&(birdTick-1)%2===0)song(now+.12);}
 return {
  get score(){return {status:scoreStatus,duration:scoreBuffer?.duration||0,error:scoreError};},
  update(dt,{moving=false,wood=false,cart=false,cartDistance=30}={}){
   if(context.state!=='running')return;
   footClock+=moving?dt:0;if(moving&&footClock>.47){footClock%=.47;step(wood?.12:.085,wood?1.16:.83);}
   cartClock+=cart?dt:0;if(cart&&cartClock>.28){cartClock%=.28;step(.22/(1+cartDistance*.15),.62+(Math.floor(context.currentTime*4)%2)*.15);}
  },
  setVolume,get levels(){return {...levels};},get state(){return context.state;},
  start:async()=>{await context.resume();if(!windStarted){wind.start();windStarted=true;}await loadScore();beginScore();cycle();if(!timer)timer=setInterval(cycle,6000);},
  suspend:()=>context.suspend(),resume:()=>context.resume(),
  stop:()=>{if(timer){clearInterval(timer);timer=null;}return context.suspend();},
  close:()=>{if(timer)clearInterval(timer);return context.close();}
 };
}

