// Lightweight, original synthesized Shire soundscape. No copyrighted recordings.
export function createShireAmbience(AudioContextConstructor){
 const context=new AudioContextConstructor(),master=context.createGain();master.gain.value=.22;master.connect(context.destination);
 let timer=null,index=0;const osc=(freq,when,duration,volume,type='sine',end=freq)=>{
  const o=context.createOscillator(),g=context.createGain();o.type=type;
  o.frequency.setValueAtTime(Math.max(1,freq),when);o.frequency.exponentialRampToValueAtTime(Math.max(1,end),when+duration);
  g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(volume,when+Math.min(.045,duration*.25));g.gain.exponentialRampToValueAtTime(.0001,when+duration);
  o.connect(g);g.connect(master);o.start(when);o.stop(when+duration+.01);
 };
 function cycle(){
  if(context.state!=='running')return;
  const t=context.currentTime+.04,index0=index++;
  // Distant birds: differing intervals and pitches prevent monotonous beeps.
  for(let i=0;i<3;i++){const start=t+i*.13,base=1250+(index0%4)*120+i*180;osc(base,start,.13,.13,'sine',base*1.43);}
  // Warm three-note original pastoral bell-like motif every other cycle.
  if(index0%2===0){const base=[261.63,329.63,392,293.66][index0%4];for(let i=0;i<3;i++){const note=base*[1,1.25,1.5][i];osc(note,t+.6+i*.48,.9,.035,'triangle',note*.997);}}
  // Occasional soft leaf/rustle transients, kept very quiet.
  if(index0%3===0)for(let i=0;i<4;i++)osc(140+i*80,t+2.1+i*.09,.17,.011,'triangle',85+i*35);
 }
 return {
  get state(){return context.state;},
  start:async()=>{await context.resume();cycle();if(!timer)timer=setInterval(cycle,5500);},
  suspend:()=>context.suspend(),
  resume:()=>context.resume(),
  stop:()=>{if(timer){clearInterval(timer);timer=null;}return context.suspend();},
  close:()=>{if(timer)clearInterval(timer);return context.close();}
 };
}
