// Original lightweight celebration visuals for the F1-01 party safe window.
export const PARTY_SECONDS=14;
export function birthdayBeat(seconds){
 const s=Math.max(0,Math.min(PARTY_SECONDS,Number.isFinite(seconds)?seconds:0));
 if(s<4)return 'الأصدقاء يتجمعون حول بيلبو، والموسيقى تصل إلى التلال.';
 if(s<8)return 'تتوهّج السماء بالألعاب النارية، ويصفّق أهل الشاير فرحين.';
 if(s<11)return 'يلقي بيلبو نظرة أخيرة على الوجوه المألوفة… فقد حان وقت رحلته.';
 return 'غادر بيلبو بعد الاحتفال، وترك فرودو أمام إرث غير متوقّع.';
}
export function createBirthdayEffects(canvas){
 const ctx=canvas.getContext('2d');
 let started=0,active=false,bursts=[];
 function begin(now=performance.now()){
  canvas.width=Math.max(1,Math.min(window.innerWidth,1440));
  canvas.height=Math.max(1,Math.min(window.innerHeight,900));
  started=now;bursts=[];active=true;canvas.hidden=false;
 }
 function stop(){
  active=false;canvas.hidden=true;
  if(ctx)ctx.clearRect(0,0,canvas.width,canvas.height);
 }
 function frame(now=performance.now()){
  if(!active||!ctx)return;
  const t=Math.max(0,(now-started)/1000);
  if(t>=PARTY_SECONDS){stop();return;}
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const steps=Math.floor(t/1.7);
  while(bursts.length<=steps){
   const i=bursts.length;
   bursts.push({at:i*1.7,x:canvas.width*(.21+(i*17%51)/100),y:canvas.height*(.16+(i*9%18)/100),hue:(i*43+18)%360});
  }
  for(const b of bursts){const age=t-b.at;if(age<0||age>1.58)continue;
   for(let j=0;j<24;j++){
    const angle=j*Math.PI/12,r=age*70+age*age*30;
    const x=b.x+Math.cos(angle)*r,y=b.y+Math.sin(angle)*r+age*age*30;
    ctx.fillStyle='hsla('+((b.hue+j*5)%360)+',95%,75%,'+Math.max(0,.9-age*.57)+')';
    ctx.beginPath();ctx.arc(x,y,Math.max(.65,2.8-age),0,Math.PI*2);ctx.fill();
   }
  }
 }
 return {begin,stop,frame,get active(){return active;}};
}
