// Adaptive render resolution after sustained measured performance; user overrides win.
export function createAdaptiveQuality({coarse=false}={}){
 const baseline=coarse?1.5:1;
 let mode='auto',scale=baseline,shadows=!coarse,ready=0,window=0,cooldown=0,adjustments=0,median=null,samples=[];
 const snapshot=()=>({mode,scale,shadows,adjustments,median});
 function setMode(next){
  if(!['auto','quality','light'].includes(next))throw Error('Invalid render quality');
  mode=next;scale=next==='quality'?1:next==='light'?1.75:baseline;
  shadows=next==='quality'?true:next==='light'?false:!coarse;
  ready=0;window=0;cooldown=0;median=null;samples=[];return snapshot();
 }
 function sample(fps,elapsed,playing=true){
  if(mode!=='auto'||!playing||!Number.isFinite(fps)||fps<=0||!Number.isFinite(elapsed)||elapsed<=0)return false;
  const dt=Math.min(elapsed,1);
  if(ready<8){ready+=dt;return false;}
  if(cooldown>0){cooldown=Math.max(0,cooldown-dt);return false;}
  window+=dt;samples.push(fps);
  if(window<6||samples.length<10)return false;
  samples.sort((a,b)=>a-b);median=samples[Math.floor(samples.length/2)];
  window=0;samples=[];let updated=false;
  // Preserve readable faces/textures on sustained severe slowdown: remove the
  // extra shadow pass before reducing the primary image's pixel resolution.
  if(median<20&&shadows){shadows=false;updated=true;}
  else if(median<26&&scale<2.25){scale=Math.min(2.25,Math.round((scale+.25)*100)/100);updated=true;}
  else if(median>44){if(scale>baseline){scale=Math.max(baseline,Math.round((scale-.25)*100)/100);updated=true;}else if(!coarse&&!shadows){shadows=true;updated=true;}}
  if(updated){adjustments++;cooldown=12;}return updated;
 }
 return {snapshot,setMode,sample};
}
