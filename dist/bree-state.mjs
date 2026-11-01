// Original Bree staging; this chapter follows the existing ferry encounter.
export const BREE_POINTS=Object.freeze({gate:{x:0,z:-36},inn:{x:0,z:11.5},exit:{x:0,z:-9.8},keeper:{x:-5,z:3.5},strider:{x:5,z:5},room:{x:-4,z:12},east:{x:34,z:2}});
export const BREE_TASKS=Object.freeze(['arrival','lodging','warning','rested']);
export function restoreBree(value){
 if(!value||!['town','inn'].includes(value.location)||!BREE_TASKS.includes(value.task))return null;
 return {location:value.location,task:value.task};
}
export const freshBree=()=>({location:'town',task:'arrival'});
export const nearBree=(p,q,r=2.5)=>Number.isFinite(p?.x)&&Number.isFinite(p?.z)&&Math.hypot(p.x-q.x,p.z-q.z)<r;
export function breeInteraction(state,p){
 if(state.location==='town'){
  if(nearBree(p,BREE_POINTS.inn))return {id:'bree-enter',name:'ادخل نزل الحصان الجامح'};
  if(nearBree(p,BREE_POINTS.gate))return {id:'bree-gate',name:'عُد إلى بوابة بري'};
  if(nearBree(p,BREE_POINTS.east))return {id:'bree-east',name:'افحص الطريق الشرقي'};
 }else{
  if(nearBree(p,BREE_POINTS.exit,2))return {id:'bree-exit',name:'اخرج إلى ساحة بري'};
  if(nearBree(p,BREE_POINTS.keeper))return {id:'bree-keeper',name:'تحدّث مع بارليمان باتربر'};
  if(nearBree(p,BREE_POINTS.strider))return {id:'bree-strider',name:'تحدّث مع الجوال عند الموقد'};
  if(nearBree(p,BREE_POINTS.room,2))return {id:'bree-rest',name:'استرح في الغرفة الآمنة'};
 }return null;
}
export function actBree(state,action,p){
 if(breeInteraction(state,p)?.id!==action)return false;
 if(action==='bree-enter'){state.location='inn';return true;}
 if(action==='bree-exit'){state.location='town';return true;}
 if(action==='bree-keeper'&&state.task==='arrival'){state.task='lodging';return true;}
 if(action==='bree-strider'&&state.task==='lodging'){state.task='warning';return true;}
 if(action==='bree-rest'&&state.task==='warning'){state.task='rested';return true;}
 return false;
}
export function breeObjective(s){return ({arrival:'وصلت إلى بري. ابحث عن نزل الحصان الجامح واسأل صاحبه عن غرفة.',lodging:'الغرفة جاهزة. الجوال قرب الموقد يراقب الباب؛ تحدّث معه قبل النوم.',warning:'ابتعد عن النوافذ. اجمع رفاقك واسترح في الغرفة الآمنة.',rested:'انقضت الليلة بسلام. رفاقك مستعدون؛ افحص الطريق الشرقي.'})[s.task];}
export function drawBreeMap(canvas,p,s){const c=canvas.getContext('2d');if(!c)return;const w=canvas.width,h=canvas.height,inside=s.location==='inn',scale=inside?18:45,xy=q=>({x:w/2+q.x/scale*(w/2-25),y:h/2-q.z/scale*(h/2-25)});c.clearRect(0,0,w,h);c.fillStyle=inside?'#c8ad80':'#ccd0b5';c.fillRect(0,0,w,h);c.strokeStyle='#7b7059';c.lineWidth=inside?4:12;c.beginPath();for(const [i,q]of (inside?[BREE_POINTS.exit,{x:0,z:5},{x:0,z:12}]:[BREE_POINTS.gate,{x:0,z:2},BREE_POINTS.inn]).entries()){const v=xy(q);i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y);}c.stroke();c.font='bold 14px Tahoma';c.textAlign='center';for(const [name,q]of (inside?[['الباب',BREE_POINTS.exit],['باتربر',BREE_POINTS.keeper],['الجوال',BREE_POINTS.strider],['الغرفة',BREE_POINTS.room]]:[['بوابة بري',BREE_POINTS.gate],['الحصان الجامح',BREE_POINTS.inn],['الطريق الشرقي',BREE_POINTS.east]])){const v=xy(q);c.fillStyle='#574831';c.beginPath();c.arc(v.x,v.y,5,0,7);c.fill();c.fillText(name,v.x,v.y-10);}const v=xy(p);c.fillStyle='#285a83';c.beginPath();c.arc(v.x,v.y,7,0,7);c.fill();}
