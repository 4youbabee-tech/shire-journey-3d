// Original gardeners pause to tend crops using existing articulated meshes.
const smooth=v=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
export function gardenerRoutine(seconds,phase,range){
 const total=((seconds+phase*3.7)%72+72)%72,t=total%24;
 let offsetX,heading,walking=false,tending=0;
 if(t<9){offsetX=-range+2*range*smooth(t/9);heading=Math.PI/2;walking=true;}
 else if(t<12){offsetX=range;heading=.4;tending=Math.sin(Math.PI*(t-9)/3);}
 else if(t<21){offsetX=range-2*range*smooth((t-12)/9);heading=-Math.PI/2;walking=true;}
 else{offsetX=-range;heading=-.4;tending=.35*Math.sin(Math.PI*(t-21)/3);}
 let activity=walking?'Walk':tending>.1?'Work':'Idle';
 if(total>=24&&total<36){offsetX=-range;walking=false;tending=.55+.35*Math.sin((total-24)*.7)**2;activity='Work';}
 else if(total>=36&&total<45){offsetX=-range;walking=false;tending=0;activity='Rest';}
 else if(total>=45&&total<48){offsetX=-range;walking=false;tending=0;activity='Socialize';}
 return {activity,offsetX,offsetZ:Math.sin((seconds+phase)*.21)*.12,heading,walking,tending,
  gait:walking?Math.sin(seconds*8+phase)*.22:0};
}

