// Original gardeners pause to tend crops using existing articulated meshes.
const smooth=v=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
export function gardenerRoutine(seconds,phase,range){
 const t=((seconds+phase*3.7)%24+24)%24;
 let offsetX,heading,walking=false,tending=0;
 if(t<9){offsetX=-range+2*range*smooth(t/9);heading=Math.PI/2;walking=true;}
 else if(t<12){offsetX=range;heading=.4;tending=Math.sin(Math.PI*(t-9)/3);}
 else if(t<21){offsetX=range-2*range*smooth((t-12)/9);heading=-Math.PI/2;walking=true;}
 else{offsetX=-range;heading=-.4;tending=.35*Math.sin(Math.PI*(t-21)/3);}
 return {offsetX,offsetZ:Math.sin((seconds+phase)*.21)*.12,heading,walking,tending,
  gait:walking?Math.sin(seconds*8+phase)*.22:0};
}
