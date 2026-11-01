// Smooth, deterministic 24-hour lighting for the living Shire. One full day lasts 12 real minutes.
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
const keys=[
 {hour:0,sky:[.07,.11,.2],fog:[.09,.13,.19],ambient:[.055,.07,.11],ground:[.11,.14,.17],sun:[.14,.17,.25]},
 {hour:5,sky:[.25,.28,.4],fog:[.31,.28,.27],ambient:[.16,.13,.13],ground:[.23,.24,.19],sun:[.72,.43,.3]},
 {hour:7,sky:[.56,.67,.76],fog:[.62,.69,.65],ambient:[.32,.33,.28],ground:[.34,.4,.25],sun:[1,.72,.48]},
 {hour:12,sky:[.72,.85,.94],fog:[.76,.85,.83],ambient:[.42,.44,.37],ground:[.45,.54,.34],sun:[1,.96,.82]},
 {hour:17,sky:[.88,.6,.42],fog:[.71,.56,.49],ambient:[.38,.29,.23],ground:[.32,.36,.24],sun:[1,.57,.34]},
 {hour:19,sky:[.25,.26,.39],fog:[.3,.29,.36],ambient:[.13,.13,.19],ground:[.16,.19,.19],sun:[.48,.33,.4]},
 {hour:21,sky:[.07,.11,.2],fog:[.09,.13,.19],ambient:[.055,.07,.11],ground:[.11,.14,.17],sun:[.14,.17,.25]},
 {hour:24,sky:[.07,.11,.2],fog:[.09,.13,.19],ambient:[.055,.07,.11],ground:[.11,.14,.17],sun:[.14,.17,.25]}
];
function colorAt(hour,key){
 let i=0;while(i<keys.length-2&&hour>keys[i+1].hour)i++;
 const a=keys[i],b=keys[i+1],t=clamp((hour-a.hour)/(b.hour-a.hour));
 return a[key].map((v,j)=>v+(b[key][j]-v)*t);
}
export function sampleDayCycle(seconds,{period=720,startHour=8}={}){
 const elapsed=Math.max(0,Number.isFinite(seconds)?seconds:0),hour=((startHour+elapsed/period*24)%24+24)%24;
 const elevation=Math.sin((hour-6)/12*Math.PI),daylight=smooth(-.12,.24,elevation);
 const label=hour<5||hour>=21?'ليل هادئ':hour<7?'الفجر':hour<12?'الصباح':hour<16?'الظهيرة':hour<19?'العصر':'الغروب';
 const angle=(hour-6)/12*Math.PI,dx=-Math.cos(angle),dy=-Math.max(.12,elevation*1.65),dz=Math.sin(angle)*.48,length=Math.hypot(dx,dy,dz)||1;
 return {hour,daylight,label,sunIntensity:.075+daylight*1.05,hemiIntensity:.2+daylight*.5,exposure:.88+daylight*.17,
  sky:colorAt(hour,'sky'),fog:colorAt(hour,'fog'),ambient:colorAt(hour,'ambient'),ground:colorAt(hour,'ground'),sun:colorAt(hour,'sun'),
  sunDirection:[dx/length,dy/length,dz/length]};
}
export function createDayCycle(B,scene,world,{period=720,startHour=8,refreshSeconds=.2}={}){
 let elapsed=0,accumulator=refreshSeconds,current=sampleDayCycle(0,{period,startHour});
 function apply(sample){
  const [sx,sy,sz]=sample.sky,[fx,fy,fz]=sample.fog,[ax,ay,az]=sample.ambient,[gx,gy,gz]=sample.ground,[lx,ly,lz]=sample.sun,[dx,dy,dz]=sample.sunDirection;
  scene.clearColor.r=sx;scene.clearColor.g=sy;scene.clearColor.b=sz;
  scene.fogColor.set(fx,fy,fz);scene.ambientColor.set(ax,ay,az);
  scene.imageProcessingConfiguration.exposure=sample.exposure;
  world.sun.diffuse.set(lx,ly,lz);world.sun.intensity=sample.sunIntensity;world.sun.direction.set(dx,dy,dz);world.sun.position.set(-dx*55,-dy*55,-dz*55);
  world.hemi.intensity=sample.hemiIntensity;world.hemi.groundColor.set(gx,gy,gz);
 }
 apply(current);
 function snapshot(){return {...current,elapsed,period,startHour};}
 function advance(seconds){elapsed=Math.max(0,elapsed+seconds);current=sampleDayCycle(elapsed,{period,startHour});apply(current);return snapshot();}
 function update(dt){if(Number.isFinite(dt)&&dt>0){elapsed+=Math.min(dt,.2);accumulator+=dt;}if(accumulator>=refreshSeconds){accumulator%=refreshSeconds;current=sampleDayCycle(elapsed,{period,startHour});apply(current);}return snapshot();}
 return {update,advance,snapshot,dispose(){}};
}
