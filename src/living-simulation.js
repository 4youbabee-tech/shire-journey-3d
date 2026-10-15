/* Shire Journey v1.0 living world pass — original authored environmental behaviours.
 * Source-aligned: characters may talk about local work, weather, market and rumours,
 * but they never know the Ring's secret or later off-screen film events.
 * Everything here is offline and deterministic, with near-player updates prioritised.
 */
'use strict';
const LIVING_DAY_SECONDS=18*60;
const LIVING_BARKS={
 npc_market_morning:{speaker:'Villager',en:'The market is lively this morning. The miller has flour, and the garden stalls have fresh vegetables.',ar:'السوق مليء بالحياة هذا الصباح. الطحّان أحضر الطحين، وبسطات الحدائق مليئة بالخضار الطازجة.'},
 npc_market_evening:{speaker:'Villager',en:'The market is winding down. Mind the lanterns on your way home.',ar:'السوق عم يسكّر شوي شوي. انتبه للفوانيس بطريق العودة إلى البيت.'},
 npc_market_night:{speaker:'Villager',en:'It is late for wandering. The market is quiet, and the neighbours have gone home.',ar:'تأخّر الوقت للتجوّل. السوق هادئ، والجيران رجعوا على بيوتهم.'},
 npc_market_dawn:{speaker:'Villager',en:'You are up before most of the Shire. Soon the bakers will open their doors.',ar:'إنت صاحي قبل معظم أهل الشاير. قريبًا الخبّازين رح يفتحوا أبوابهم.'},
 npc_market_uneasy:{speaker:'Villager',en:'The market folk speak more softly these days. There have been strangers on the roads.',ar:'أهل السوق صاروا يحكوا بصوت واطي هالأيام. في غرباء شُوهدوا على الطرقات.'},
 ambient_shire_garden:{speaker:'Gardeners',en:'Mind the roses! They need a little more water before supper.',ar:'دير بالك عالورد! بعده بحاجة لشوي مي قبل العشا.'},
 ambient_shire_market:{speaker:'Neighbours',en:'Fresh bread at the market! Warm from the ovens!',ar:'خبز طازج بالسوق! طالع سخن من الفرن!' },
 ambient_shire_evening:{speaker:'Neighbours',en:'Good evening! The lanterns will be lit soon.',ar:'مسا الخير! قريبًا رح يضوّوا الفوانيس.'},
 ambient_shire_night:{speaker:'Neighbours',en:'Quiet now. The little ones are asleep.',ar:'هدّوا صوتكن. الصغار ناموا.'},
 ambient_shire_anxious:{speaker:'Neighbours',en:'I do not like the sound of hooves after dark.',ar:'ما بحب أسمع وقع حوافر الخيل بعد العتمة.'},
 ambient_bree_market:{speaker:'Merchant',en:'Last call for provisions! The road has been busy today.',ar:'آخر نداء للمؤونة! الطريق كانت زحمة اليوم.'},
 ambient_bree_night:{speaker:'Inn guest',en:'Keep your voice down. Too many strangers listen at night.',ar:'وطّي صوتك. في غرباء كتار عم يسمعوا بالليل.'}
};
for(const [key,line] of Object.entries(LIVING_BARKS))LINES[key]=line;

function livingPeriod(played){
 let t=((played%LIVING_DAY_SECONDS)+LIVING_DAY_SECONDS)%LIVING_DAY_SECONDS/LIVING_DAY_SECONDS;
 let brightness=Math.cos(t*Math.PI*2);
 if(brightness<-.32)return 'night';
 if(brightness<.22)return t<.5?'evening':'dawn';
 return t<.14||t>.88?'morning':'day';
}
function livingRegionMood(zone,stage){
 if(zone==='bree')return 'watchful';
 if(zone==='weathertop')return 'danger';
 return stage>=4?'uneasy':stage>=3?'preparing':'peaceful';
}
const LIVING_PATHS={
 Rowan:{morning:[[22,15],[20.9,14.8],[22.5,15.5]],day:[[22,15],[23.6,15.8],[20.6,14.1]],evening:[[22,15],[22.3,16]],night:[[22,15],[21.5,15.5]],dawn:[[21.5,15],[22,15]]},
 'Hob Miller':{morning:[[-11,53],[-10,52]],day:[[-11,53],[-10,50.7],[-12,52.5]],evening:[[-11,53],[-12.1,52]],night:[[-11,53],[-11.6,52.9]],dawn:[[-11.5,53],[-11,53]]},
 Tansy:{morning:[[-49,2],[-47.7,1.5]],day:[[-49,2],[-47,1],[-45,3]],evening:[[-49,2],[-50.2,2.5]],night:[[-49,2],[-50,1.7]],dawn:[[-49,2],[-48,2.4]]},
 Hazel:{morning:[[25,20],[24.1,21]],day:[[25,20],[23.8,22],[22.8,24]],evening:[[25,20],[26.2,20.9]],night:[[25,20],[25.6,20.8]],dawn:[[25,20],[24.5,20.5]]},
 Hugo:{morning:[[-16,49],[-14.5,49.5]],day:[[-16,49],[-14,50],[-12,51]],evening:[[-16,49],[-17,48.7]],night:[[-16,49],[-16.5,49.1]],dawn:[[-16,49],[-15.5,49.4]]},
 Aster:{morning:[[44,-20],[43,-21]],day:[[44,-20],[46,-20],[44,-23]],evening:[[44,-20],[43.8,-21.4]],night:[[44,-20],[44.8,-19.9]],dawn:[[44,-20],[44.1,-21]]}
};
function plannedVillagerStop(name,played,phase=0){
 const p=LIVING_PATHS[name];if(!p)return null;
 const period=livingPeriod(played),route=p[period]||p.day;
 // Stable 12-second dwell periods; no frame-dependent randomness.
 const index=Math.floor((played+phase*3)/12)%route.length;
 return {period,index,point:route[index]};
}
function contextualNeighbourLine(name,zone,stage,played){
 if(zone==='bree')return 'npc_news_bree';
 const mood=livingRegionMood(zone,stage);
 if(mood==='uneasy')return 'npc_market_uneasy';
 let period=livingPeriod(played);
 return period==='night'?'npc_market_night':period==='evening'?'npc_market_evening':period==='dawn'?'npc_market_dawn':'npc_market_morning';
}
function contextualRouteLine(person,zone,stage){
 // Return directions derived from actual in-game landmark coordinates.
 // Avoid knowledge of future chapters and avoid pretending to know unseen locations.
 if(zone!=='outside'||stage>=4)return 'npc_road_warning';
 const goals={'Tansy':'market','Hazel':'bagend','Hugo':'mill','Aster':'gate','Rowan':'mill','Hob Miller':'market'};
 const dest=(WORLD.locations||[]).find(l=>l.id===(goals[person.name]||'market'));
 if(!dest)return 'npc_road_warning';
 const dx=dest.x-person.pos[0],dz=dest.z-person.pos[2];
 const ew=Math.abs(dx)>5?(dx>0?'east':'west'):null;
 const ns=Math.abs(dz)>5?(dz>0?'south':'north'):null;
 const dir=[ew,ns].filter(Boolean).join(' and ')||'along the lane';
 const arDir=[ew?(ew==='east'?'شرق':'غرب'):null,ns?(ns==='south'?'جنوب':'شمال'):null].filter(Boolean).join(' وباتجاه ')||'على طول الطريق';
 const crossing=(person.pos[0]-riverX(person.pos[2]))*(dest.x-riverX(dest.z))<0;
 const bridgeEn=crossing?' Cross the wooden bridge where the road meets the Water.':'';
 const bridgeAr=crossing?' اقطع الجسر الخشبي عند النهر.':'';
 const approx=Math.round(Math.hypot(dx,dz));
 const en=`For ${dest.name}, head ${dir}, following the village paths.${bridgeEn} It is about ${approx} paces on our map.`;
 const ar=`لتوصل على ${dest.ar}، روح باتجاه ${arDir} وامشِ على دروب القرية.${bridgeAr} المسافة حوالي ${approx} خطوة على خريطتنا.`;
 LINES.npc_guide_local={speaker:person.name,en,ar};
 return 'npc_guide_local';
}
function buildLivingEcology(renderer){
 WORLD.livingEcology=[];
 const rabbitSpots=[[-49,-31],[-40,-13],[12,-35],[30,-20],[58,31],[72,-7]];
 for(let i=0;i<rabbitSpots.length;i++){
  let g=new Geo(),hue=['#a89370','#807464','#9e896c'][i%3];
  g.sphere([0,.22,0],[.27,.25,.46],hue,12,8);
  g.sphere([0,.32,.39],[.22,.20,.24],shade(hue,1.12),11,7);
  for(let side of [-1,1]){
   g.sphere([side*.12,.66,.38],[.08,.27,.10],hue,9,7);
   g.sphere([side*.12,.66,.456],[.038,.21,.032],'#b78f87',7,5);
   g.sphere([side*.13,.34,.595],[.023,.028,.017],'#241c19',6,5);
   g.sphere([side*.18,.11,-.24],[.14,.10,.16],shade(hue,.87),8,5);
  }
  g.sphere([0,.32,-.42],[.15,.15,.16],'#d0c4a8',10,6);
  let mesh=renderer.mesh(g);mesh.cast=false;
  let [x,z]=rabbitSpots[i];WORLD.livingEcology.push({kind:'rabbit',mesh,anchor:[x,z],phase:i*1.71,pos:[x,ground(x,z),z],fleeUntil:0});
 }
 // Tiny warm motes near the stream and front gardens: appear only as dusk falls.
 for(let i=0;i<20;i++){
  let g=new Geo();g.sphere([0,0,0],[.036,.036,.036],i%3?'#e3d488':'#d8efac',7,5);
  let mesh=renderer.mesh(g,3);mesh.cast=false;mesh.visible=false;
  let z=-54+(i%10)*13.6,x=i<10?riverX(z)+(i%2?4.5:-4.5):-37+(i%5)*3.1;
  if(i>=10)z=-27+Math.floor((i-10)/5)*4.3;
  WORLD.livingEcology.push({kind:'firefly',mesh,anchor:[x,z],phase:i*2.399,speed:.6+(i%3)*.12});
 }
 // Warm inner panes at village houses; never falsify global dynamic light sources.
 let lampGeo=new Geo();
 for(const h of WORLD.houses){
  if(h.x===undefined)continue;
  let y=height(h.x,h.z),s=h.s;
  for(let dir of [-1,1])lampGeo.sphere([h.x+dir*2.65*s,y+1.23*s,h.z+.45*s],[.30*s,.28*s,.012*s],'#e5b978',14,8);
 }
 const lamp=renderer.mesh(lampGeo,3);lamp.cast=false;lamp.visible=false;
 WORLD.livingLamps=lamp;
}
function updateLivingEcology(t,played,zone,playerPos,quality,nightLevel){
 if(!WORLD.livingEcology)return;
 const shire=zone==='outside';
 for(const a of WORLD.livingEcology){
  const dist=Math.hypot(a.anchor[0]-playerPos[0],a.anchor[1]-playerPos[2]);
  if(a.kind==='rabbit'){
   let available=shire && nightLevel<.82 && dist<68 && (quality!=='low'||dist<25);
   a.mesh.visible=available;
   if(!available)continue;
   let near=dist<6.5,tt=t*.37+a.phase,rad=near?7:2.5;
   let x=a.anchor[0]+Math.sin(tt)*rad,z=a.anchor[1]+Math.cos(tt*.81)*rad;
   let hop=Math.max(0,Math.sin(t*7+a.phase));
   a.pos=[x,ground(x,z)+hop*.28,z];
   a.mesh.model=M.trs(a.pos,[0,tt+Math.PI*.5,0]);
  }else{
   let visible=shire && nightLevel>.35 && dist<52 && quality!=='low';
   a.mesh.visible=visible;
   if(!visible)continue;
   let x=a.anchor[0]+Math.sin(t*.78+a.phase)*.77;
   let z=a.anchor[1]+Math.cos(t*.61+a.phase)*.78;
   let y=ground(x,z)+.85+Math.sin(t*1.22+a.phase)*.55;
   let flicker=.60+.25*Math.sin(t*4+a.phase);
   a.mesh.model=M.trs([x,y,z],[0,0,0],[flicker,flicker,flicker]);
  }
 }
 if(WORLD.livingLamps)WORLD.livingLamps.visible=shire && nightLevel>.28;
}
function livingMeshesForZone(zone){
 if(zone!=='outside')return [];
 return [...(WORLD.livingEcology||[]).filter(a=>a.mesh.visible).map(a=>a.mesh),...(WORLD.livingLamps?.visible?[WORLD.livingLamps]:[])];
}
function livingAmbientCue(played,zone,stage){
 if(zone==='weathertop')return null;
 if(zone==='bree')return 'ambient_bree_night';
 if(stage>=4)return 'ambient_shire_anxious';
 const p=livingPeriod(played);
 return p==='night'?'ambient_shire_night':p==='evening'?'ambient_shire_evening':p==='morning'?'ambient_shire_garden':'ambient_shire_market';
}
