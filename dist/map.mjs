import {MAP_BOUNDS,HOMES,ROADS,LANDMARKS} from './village-layout.mjs';
import {NPCS,APPLES} from './simulation.mjs';
const project=(x,z,w,h)=>({x:30+(x-MAP_BOUNDS.minX)/(MAP_BOUNDS.maxX-MAP_BOUNDS.minX)*(w-60),
 y:30+(MAP_BOUNDS.maxZ-z)/(MAP_BOUNDS.maxZ-MAP_BOUNDS.minZ)*(h-60)});
export function drawVillageMap(canvas,player,stage,apples=[]){
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const w=canvas.width,h=canvas.height;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#e5d5a8';ctx.fillRect(0,0,w,h);
 // Soft hand-drawn paper grid and meadows.
 ctx.strokeStyle='rgba(113,121,71,.13)';ctx.lineWidth=1;
 for(let i=45;i<w;i+=45){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
 for(let i=45;i<h;i+=45){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}
 for(const [x,z] of [[-28,17],[-22,30],[28,33],[34,-30],[-38,-34],[3,48]]){
  const p=project(x,z,w,h);ctx.fillStyle='#b1bd88';ctx.beginPath();ctx.ellipse(p.x,p.y,48,27,.4,0,Math.PI*2);ctx.fill();
 }
 const pond=project(21,-2,w,h);ctx.beginPath();ctx.ellipse(pond.x,pond.y,23,15,-.4,0,2*Math.PI);ctx.fillStyle='#8ebcbb';ctx.fill();
 ctx.lineCap='round';ctx.lineJoin='round';
 for(const road of ROADS){
  for(const [width,color] of [[road.width*6+4,'#c4a77a'],[road.width*6,'#f0ddaa']]){
   ctx.beginPath();ctx.lineWidth=width;ctx.strokeStyle=color;
   road.points.forEach(([x,z],i)=>{const p=project(x,z,w,h);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.stroke();
  }
 }
 for(const home of HOMES){const p=project(home.x,home.z,w,h),r=5+home.s*4;
  ctx.fillStyle=home.color==='rust'?'#b7775c':home.color==='blue'?'#698e98':'#789862';
  ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#554b36';ctx.lineWidth=1.4;ctx.stroke();
 }
 for(const spot of LANDMARKS){
  const p=project(spot.x,spot.z,w,h);
  ctx.font='bold 14px Tahoma, sans-serif';ctx.textAlign='center';ctx.fillStyle='#3a4930';
  ctx.fillText(spot.name,p.x,p.y-17);
 }
 for(const npc of NPCS){const p=project(npc.x,npc.z,w,h);
  ctx.beginPath();ctx.fillStyle='#6a5350';ctx.arc(p.x,p.y,5.5,0,2*Math.PI);ctx.fill();
  ctx.lineWidth=1.3;ctx.strokeStyle='#f9ecd0';ctx.stroke();
 }
 if(stage===2)for(const apple of APPLES){if(apples.includes(apple.id))continue;
  const p=project(apple.x,apple.z,w,h);ctx.fillStyle='#c34c38';ctx.beginPath();ctx.arc(p.x,p.y,5,0,2*Math.PI);ctx.fill();
 }
 if(player&&Number.isFinite(player.x)&&Number.isFinite(player.z)){
  const p=project(player.x,player.z,w,h);
  ctx.beginPath();ctx.fillStyle='#173f6b';ctx.arc(p.x,p.y,11,0,2*Math.PI);ctx.fill();
  ctx.lineWidth=3;ctx.strokeStyle='#fff9dc';ctx.stroke();
  ctx.font='bold 12px Tahoma';ctx.fillStyle='#173f6b';ctx.fillText('أنت هنا',p.x,p.y-18);
 }
 ctx.font='bold 18px Georgia,serif';ctx.fillStyle='#45563b';ctx.textAlign='center';ctx.fillText('N',w/2,23);
}
