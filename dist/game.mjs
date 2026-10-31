import {createRingLegacy,legacyBeat,LEGACY_SECONDS} from './ring-legacy.mjs';
import {loadNature} from './nature.mjs';
import {loadCharacters,CHARACTER_HEIGHTS} from './characters.mjs';
import {BUILD} from './build-info.mjs';
import {createWorld} from './world.mjs';
import {createBirthdayEffects,birthdayBeat,PARTY_SECONDS} from './party.mjs';
import {createBagEndInterior,nearBagDoor} from './interior.mjs';
import {createArrival,loadArrivalHorse,arrivalBeat,ARRIVAL_DURATION} from './arrival.mjs';
import {drawVillageMap} from './map.mjs';
import {MAP_BOUNDS} from './village-layout.mjs';
import {createAdaptiveQuality} from './adaptive-quality.mjs';
import {gardenerRoutine} from './life.mjs';
import {createShireAmbience} from './ambience.mjs';
import {replyToCharacter,STORY_WINDOW} from './conversation.mjs';
import {portraitSVG} from './portraits.mjs';
import {SAVE_KEY,NPCS,APPLES,frameDelta,freshState,restoreState,objective,nearestInteractable,talk,act,collect,dialogue,LORE} from './simulation.mjs';
const $=s=>document.querySelector(s),canvas=$('#game');
const qaEnabled=new URLSearchParams(location.search).has('qa');
let uiElapsed=0;const labelBindings=[];let qualityControl=null,arrival=null,cinematic=false,cinematicTime=0,cinematicStart=0,mapOpen=false,inside=false,interior=null,interiorLightState=null,outdoorMeshes=[],returnPosition={x:11,z:8.2},priorView={yaw:0,zoom:7.8},partyFx=null,partyActive=false,partyStart=0,partyOriginal=new Map(),ringLegacy=null;
let importedActors,engine,scene,world,state,started=false,activeNPC=null,journalOpen=false,yaw=0,pitch=.44,zoom=7.8,keys=new Set(),drag=null,joystick={x:0,y:0},toastTimer,saveTimer=0,time=0,soundEnabled=false,audio=null,audioTimer=null,destination=null,spokenText='';
const errors=[],telemetry={frames:0,seconds:0,collisions:0,interactions:0,collects:0,saves:0};
window.addEventListener('unhandledrejection',e=>fatal(e.reason?.message||String(e.reason)));
function fatal(message){errors.push(message);$('#loading').hidden=true;$('#fatal-text').textContent=message;$('#fatal').hidden=false;}
function readSave(){try{return restoreState(localStorage.getItem(SAVE_KEY));}catch{return freshState();}}
function save(){state.position=inside?{...returnPosition}:{x:world.body.position.x,z:world.body.position.z};try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));telemetry.saves++;}catch{notify('الحفظ غير متاح في هذا المتصفّح');}}
function notify(text){if(activeNPC){$('#toast').hidden=true;return;}$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,3500);}
function refresh(){ $('#objective').textContent=objective(state);
 const milestones=[state.gandalfMet,state.stage>=1,state.stage>=2,state.apples.length===3,state.stage>=5,state.partyCompleted];$('#quest-progress').querySelectorAll('i').forEach((e,i)=>e.classList.toggle('done',milestones[i]));
 for(const a of world.apples)a.root.setEnabled(!state.apples.includes(a.id));
 const bilbo=world.characters.find(c=>c.id==='bilbo');if(bilbo&&!partyActive)bilbo.root.setEnabled(!state.partyCompleted);
 $('#journal-objective').textContent=objective(state);
 const complete=[state.gandalfMet,state.stage>=1,state.stage>=2,state.apples.length===3,state.stage>=5,state.partyCompleted];
 $('#checklist').replaceChildren(...['رحّب بغاندالف','قابل بيلبو','ساعد سام في الحديقة','تفّاح البستان (اختياري)','ارجع إلى بيلبو','اشهد حفلة بيلبو'].map((t,i)=>{const li=document.createElement('li');li.textContent=(complete[i]?'✓  ':'○  ')+t;li.className=complete[i]?'checked':'';return li;}));
}
function closeDialogue(){window.speechSynthesis?.cancel();spokenText='';activeNPC=null;$('#dialogue').hidden=true;$('#npc-chat-input').value='';$('#chat-log').replaceChildren();keys.clear();canvas.focus();}
function present(id,custom){const newCharacter=activeNPC!==id;const npc=NPCS.find(n=>n.id===id);const content=custom||dialogue(state,id);activeNPC=id;clearTimeout(toastTimer);$('#toast').hidden=true;keys.clear();destination=null;$('#dialogue').hidden=false;$('#speaker').textContent=npc.name;$('#portrait').innerHTML=portraitSVG(id);$('#dialogue-text').textContent=content.text;spokenText=content.text;if(newCharacter){$('#chat-log').replaceChildren();$('#npc-chat-input').value='';}$('#choices').replaceChildren(...content.options.map(([label,action])=>{const button=document.createElement('button');button.textContent=label;button.onclick=()=>choose(action);return button;}));$('#choices button')?.focus();}
function sendChat(){if(!activeNPC)return;const input=$('#npc-chat-input');const question=input.value.trim().slice(0,170);if(!question)return;const response=replyToCharacter(state,activeNPC,question);spokenText=response.text;const log=$('#chat-log');for(const [kind,text] of [['player',question],['npc',response.text]]){const line=document.createElement('p');line.className='chat-'+kind;line.textContent=text;log.append(line);}input.value='';log.scrollTop=log.scrollHeight;save();}
function choose(action){if(action==='close'){closeDialogue();return;}if(LORE[action]){present(activeNPC,{text:LORE[action],options:[['شكرًا، نكمل حديثنا.','back'],['إلى اللقاء.','close']]});return;}if(action==='back'){present(activeNPC);return;}const changed=act(state,action);if(changed){refresh();save();notify(objective(state));}closeDialogue();}
function interact(){if(!started||activeNPC||journalOpen||cinematic||mapOpen||partyActive)return;
 if(inside){const prop=interior.nearby(world.body.position);if(!prop)return;if(prop.id==='exit-house'){leaveHouse();return;}if(prop.id==='diary'){state.insideVisited=true;save();notify('دفتر بيلبو مليء بملاحظات عن الضيوف وذكريات الأسفار القديمة.');return;}notify('المدفأة مشتعلة ودفء الصباح يملأ الغرفة.');return;}
 if(nearBagDoor(world.body.position)){enterHouse();return;}
 const near=nearestInteractable(state,world.body.position);if(!near)return;if(near.id==='party-tree'){beginParty();return;}if(near.id.startsWith('apple')){if(collect(state,near.id,world.body.position)){telemetry.collects++;refresh();save();notify(state.stage===3?'اكتملت السلة! ارجع إلى سام':`تفّاحة في السلة · ${state.apples.length}/3`);}return;}talk(state,near.id);telemetry.interactions++;save();present(near.id);}
function showJournal(){if(!started||activeNPC||partyActive)return;keys.clear();destination=null;journalOpen=true;$('#journal').hidden=false;refresh();$('#journal-close').focus();}
function closeJournal(){journalOpen=false;$('#journal').hidden=true;canvas.focus();}
function speakDialogue(){const synthesizer=window.speechSynthesis,Utterance=window.SpeechSynthesisUtterance;if(!activeNPC||!spokenText)return;if(!synthesizer||!Utterance){notify('القراءة العربية غير مدعومة في هذا المتصفح');return;}synthesizer.cancel();const utterance=new Utterance(spokenText.slice(0,900));utterance.lang='ar';utterance.rate=activeNPC==='gandalf'?.86:activeNPC==='frodo'?1.06:.96;utterance.pitch=activeNPC==='gandalf'?.85:activeNPC==='frodo'?1.1:1;const voices=synthesizer.getVoices?.()||[];utterance.voice=voices.find(v=>v.lang?.toLowerCase().startsWith('ar'))||null;synthesizer.speak(utterance);}
function setupInput(){
 window.addEventListener('keydown',e=>{if(e.target instanceof Element&&e.target.closest('input,textarea')){if(e.code==='Escape')closeDialogue();return;}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='Escape'){if(mapOpen)closeMap();if(activeNPC)closeDialogue();if(journalOpen)closeJournal();if(cinematic)endOpening();if(partyActive)finishParty();return;}if(e.code==='KeyM'){mapOpen?closeMap():showMap();return;}if(e.repeat)return;if(e.code==='KeyE'){interact();return;}if(e.code==='KeyJ'){journalOpen?closeJournal():showJournal();return;}keys.add(e.code);destination=null;});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();joystick.x=joystick.y=0;drag=null;});
 canvas.addEventListener('pointerdown',e=>{if(activeNPC||journalOpen)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);canvas.focus();});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>6)drag.moved=true;yaw-=dx*.005;pitch=Math.max(.2,Math.min(.95,pitch+dy*.003));drag.x=e.clientX;drag.y=e.clientY;});
 canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;if(!moved&&started){const pick=scene.pick(scene.pointerX,scene.pointerY,m=>m===world.ground);if(pick?.hit){const p=pick.pickedPoint;if(p.x>MAP_BOUNDS.minX+2&&p.x<MAP_BOUNDS.maxX-2&&p.z>MAP_BOUNDS.minZ+2&&p.z<MAP_BOUNDS.maxZ-2){destination={x:p.x,z:p.z};notify('امشِ إلى المكان المحدّد · استخدم الأسهم لإلغاء المسار');}}}});canvas.addEventListener('pointercancel',()=>drag=null);
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(4.5,Math.min(12,zoom+e.deltaY*.007));},{passive:false});
 const joy=$('#joystick'),stick=$('#stick');let joyId=null;function joyMove(e){const r=joy.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;const len=Math.hypot(dx,dy),max=35;if(len>max){dx*=max/len;dy*=max/len;}joystick={x:dx/max,y:-dy/max};stick.style.transform=`translate(${dx}px,${dy}px)`;destination=null;}
 joy.addEventListener('pointerdown',e=>{joyId=e.pointerId;joy.setPointerCapture(e.pointerId);joyMove(e);});joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId)joyMove(e);});for(const event of ['pointerup','pointercancel','lostpointercapture'])joy.addEventListener(event,()=>{joyId=null;joystick={x:0,y:0};stick.style.transform='';});
 $('#npc-chat-form').addEventListener('submit',e=>{e.preventDefault();sendChat();});$('#npc-voice').onclick=speakDialogue;$('#interact').onclick=interact;$('#dialogue-close').onclick=closeDialogue;$('#journal-open').onclick=showJournal;$('#journal-close').onclick=closeJournal;$('#return').onclick=closeJournal;$('#map-open').onclick=showMap;$('#map-close').onclick=closeMap;$('#arrival-skip').onclick=endOpening;$('#party-skip').onclick=finishParty;$('#replay-arrival').onclick=()=>{closeJournal();beginOpening();};
 $('#reset').onclick=()=>{if(!confirm('هل تبدأ القصة من وصول غاندالف؟ سيُستبدل تقدّمك المحفوظ.'))return;closeJournal();restartStory();};$('#restart-story').onclick=()=>{if(!confirm('هل تبدأ من وصول غاندالف؟ سيُستبدل تقدّمك المحفوظ.'))return;restartStory();};
 // Fresh sessions retain the owner's high-first preference. Explicit manual
 // choices survive reloads, including low-cost mode on a weaker device.
 qualityControl=createAdaptiveQuality({coarse:false});try{const mode=localStorage.getItem('shire-render-quality-v1');if(['auto','quality','light'].includes(mode))qualityControl.setMode(mode);}catch{}
 $('#quality').onclick=()=>{const m=qualityControl.snapshot().mode,next=m==='auto'?'quality':m==='quality'?'light':'auto';qualityControl.setMode(next);try{localStorage.setItem('shire-render-quality-v1',next);}catch{}applyQuality();};applyQuality();
 for(const channel of ['master','music','effects'])$('#volume-'+channel).oninput=e=>audio?.setVolume(channel,Number(e.target.value));
 $('#sound').onclick=toggleSound;window.addEventListener('resize',()=>engine.resize());document.addEventListener('visibilitychange',()=>{keys.clear();joystick.x=joystick.y=0;destination=null;drag=null;if(document.hidden&&started)save();if(audio)document.hidden?audio.suspend():soundEnabled&&audio.resume();});window.addEventListener('pagehide',()=>{if(started)save();});
}
function showMap(){if(!started||cinematic||activeNPC||journalOpen||inside||partyActive)return;keys.clear();destination=null;mapOpen=true;$('#world-map').hidden=false;drawVillageMap($('#village-map'),world.body.position,state.stage,state.apples);$('#map-close').focus();}
function closeMap(){mapOpen=false;$('#world-map').hidden=true;canvas.focus();}
function restartStory(){if(inside)leaveHouse();if(activeNPC)closeDialogue();if(mapOpen)closeMap();if(partyActive)finishParty();state=freshState();world.body.position.set(0,.72,-15);yaw=0;destination=null;keys.clear();started=true;$('#welcome').hidden=true;$('#hud').hidden=false;refresh();save();if(!soundEnabled)void toggleSound();beginOpening();}
function beginOpening(){if(inside)leaveHouse();if(!arrival)return;cinematic=true;cinematicTime=0;cinematicStart=performance.now();destination=null;keys.clear();arrival.begin(scene.activeCamera);$('#hud').hidden=true;$('#arrival-cinematic').hidden=false;$('#arrival-caption').textContent=arrivalBeat(0);}
function endOpening(){if(cinematic){arrival.end();cinematic=false;}$('#arrival-cinematic').hidden=true;$('#hud').hidden=false;canvas.focus();if(state.stage===0&&!state.gandalfMet){world.body.position.set(-2,.72,14.8);world.player.root.position.set(-2,.02,14.8);scene.activeCamera.position.set(1,2.5,13);scene.activeCamera.setTarget(new window.BABYLON.Vector3(-2,2.34,17));save();present('gandalf');notify('التقِ غاندالف لتبدأ حكاية الشاير');}else notify('أهلًا بعودتك إلى الشاير');}
function enterHouse(){
 if(inside||!started||cinematic||activeNPC)return;
 if(!interior)interior=createBagEndInterior(window.BABYLON,scene);
 returnPosition={x:world.body.position.x,z:world.body.position.z};priorView={yaw,zoom};
 const keep=new Set([...world.player.root.getChildMeshes(),world.body]);
 outdoorMeshes=scene.meshes.filter(m=>!interior.meshes.includes(m)&&!keep.has(m)&&m.isEnabled());
 for(const m of outdoorMeshes)m.setEnabled(false);
 for(const collider of interior.colliders)world.colliders.push(collider);
 interiorLightState={sun:world.sun.isEnabled(),hemi:world.hemi.intensity};world.sun.setEnabled(false);world.hemi.intensity=.42;interior.setActive(true);inside=true;state.insideVisited=true;world.body.position.set(interior.spawn.x,interior.spawn.y,interior.spawn.z);
 yaw=0;zoom=5.9;destination=null;keys.clear();scene.activeCamera.position.set(160,4.1,132.8);scene.activeCamera.setTarget(new window.BABYLON.Vector3(160,1.4,143));save();$('#location>div').firstChild.textContent='داخل بيت بيلبو';
 notify('دخلت بيت الهوبيت · اقترب من الباب الأخضر للعودة');
}
function leaveHouse(){
 if(!inside)return;
 interior.setActive(false);if(interiorLightState){world.sun.setEnabled(interiorLightState.sun);world.hemi.intensity=interiorLightState.hemi;}for(const m of outdoorMeshes)m.setEnabled(true);outdoorMeshes=[];
 for(const collider of interior.colliders){const i=world.colliders.indexOf(collider);if(i>=0)world.colliders.splice(i,1);}
 inside=false;world.body.position.set(returnPosition.x,.72,returnPosition.z);yaw=priorView.yaw;zoom=priorView.zoom;scene.activeCamera.position.set(returnPosition.x,4.1,returnPosition.z-zoom);scene.activeCamera.setTarget(new window.BABYLON.Vector3(returnPosition.x,1.4,returnPosition.z));
 destination=null;keys.clear();save();$('#location>div').firstChild.textContent='هوبيتون';notify('عدت إلى الشاير');
}
function beginParty(resume=false){
 if(!started||inside||partyActive||activeNPC||cinematic)return;
 if(resume){if(!state.partyStarted||state.partyCompleted)return;}
 else if(!act(state,'start-party'))return;
 partyActive=true;partyStart=performance.now();partyOriginal=new Map();keys.clear();destination=null;
 const positions={bilbo:[-3,25],frodo:[0,25],gandalf:[-6,26],sam:[2.7,25],'farmer-ada':[-4.8,23.2],'farmer-berin':[4.5,26.4],'gardener-nell':[.3,27.4]};
 for(const c of world.characters){if(!positions[c.id])continue;partyOriginal.set(c.id,{position:c.root.position.clone(),rotation:c.root.rotation.clone()});c.root.position.set(positions[c.id][0],0,positions[c.id][1]);c.root.rotation.y=Math.PI;}
 const B=window.BABYLON,V=B.Vector3;
 // View from the north path, away from the roof mound that obscured the first party screenshot.
 scene.activeCamera.position.set(4,5.7,34);scene.activeCamera.setTarget(new V(-1,1.8,24));
 $('#hud').hidden=true;$('#party-cinematic').hidden=false;$('#party-caption').textContent=birthdayBeat(0);
 partyFx.begin(partyStart);refresh();save();
}
function finishParty(){
 if(!partyActive)return;
 partyActive=false;partyFx?.stop();ringLegacy?.end();
 if(!state.partyCompleted)act(state,'party-finalize');
 for(const c of world.characters){const old=partyOriginal.get(c.id);if(old){c.root.position.copyFrom(old.position);c.root.rotation.copyFrom(old.rotation);}}
 partyOriginal.clear();
 $('#party-cinematic').hidden=true;$('#hud').hidden=false;refresh();save();canvas.focus();
 notify('انتهت ليلة الاحتفال، وترك بيلبو خاتمه لفرودو قبل أن يغادر.');
}
function applyQuality(){if(!qualityControl)return;const {scale,shadows,mode}=qualityControl.snapshot();if(engine.getHardwareScalingLevel()!==scale)engine.setHardwareScalingLevel(scale);scene.shadowsEnabled=shadows;if(world.shadow)world.shadow.getShadowMap().refreshRate=shadows?1:0;$('#quality').textContent=mode==='auto'?'جودة تلقائية':mode==='quality'?'جودة عالية':'جودة خفيفة';engine.resize();}
async function toggleSound(){soundEnabled=!soundEnabled;$('#sound').textContent=soundEnabled?'♫ الأجواء مفعّلة':'♫';$('#sound').setAttribute('aria-label',soundEnabled?'إيقاف أصوات الشاير':'تشغيل أصوات الشاير');if(!soundEnabled){await audio?.stop();return;}const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio){soundEnabled=false;notify('الصوت غير مدعوم بهذا المتصفّح');return;}try{if(!audio)audio=createShireAmbience(Audio);for(const channel of ['master','music','effects'])audio.setVolume(channel,Number($('#volume-'+channel).value));await audio.start();notify('أجواء الشاير: عصافير وألحان هادئة أصلية');}catch{soundEnabled=false;$('#sound').textContent='♫';notify('تعذّر تشغيل الصوت على هذا الجهاز');}}
function animate(dt){time+=dt;const B=window.BABYLON,V=B.Vector3;
 if(cinematic){cinematicTime=Math.min(ARRIVAL_DURATION,(performance.now()-cinematicStart)/1000);const pose=arrival.update(cinematicTime,scene.activeCamera);importedActors?.update(dt,null,false,pose);audio?.update(dt,{cart:pose.cartMoving,cartDistance:window.BABYLON.Vector3.Distance(scene.activeCamera.position,arrival.root.position)});$('#arrival-caption').textContent=arrivalBeat(cinematicTime);if(cinematicTime>=ARRIVAL_DURATION)endOpening();return;}
 if(partyActive){
  const elapsed=Math.max(0,(performance.now()-partyStart)/1000);
  if(elapsed>=PARTY_SECONDS){
   if(!ringLegacy?.active){partyFx.stop();if(!interior)interior=createBagEndInterior(B,scene);if(!ringLegacy)ringLegacy=createRingLegacy(B,scene,world,interior);ringLegacy.begin();}
   const t=elapsed-PARTY_SECONDS,pose=ringLegacy.update(t);importedActors?.update(dt,null,false,pose);$('#party-caption').textContent=legacyBeat(t).caption;
   if(t>=LEGACY_SECONDS)finishParty();return;
  }
  partyFx.frame(performance.now());
  $('#party-caption').textContent=birthdayBeat(elapsed);
  for(const c of world.characters){if(!partyOriginal.has(c.id))continue;c.left.rotation.x=Math.sin(elapsed*2.5+c.root.uniqueId)*.28;c.right.rotation.x=-c.left.rotation.x;c.head.rotation.y=Math.sin(elapsed*.8+c.root.uniqueId)*.15;}
  importedActors?.update(dt,null,true);
  if(elapsed>=PARTY_SECONDS)finishParty();
  return;
 }
 const blocked=!started||!!activeNPC||journalOpen||mapOpen;let moving=false;
 if(!blocked){let forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)+joystick.y;let strafe=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+joystick.x;let dx=Math.sin(yaw)*forward+Math.cos(yaw)*strafe,dz=Math.cos(yaw)*forward-Math.sin(yaw)*strafe;
 if(destination){dx=destination.x-world.body.position.x;dz=destination.z-world.body.position.z;if(Math.hypot(dx,dz)<.3){destination=null;dx=dz=0;}}
 const len=Math.hypot(dx,dz),speed=(keys.has('ShiftLeft')?3.2:1.35)*Math.min(1,len);if(len>.05){dx/=len;dz/=len;moving=true;const desired=Math.atan2(dx,dz)+Math.PI;let diff=Math.atan2(Math.sin(desired-world.player.root.rotation.y),Math.cos(desired-world.player.root.rotation.y));world.player.root.rotation.y+=diff*Math.min(1,dt*10);}
 const before=world.body.position.clone();world.body.moveWithCollisions(new V(moving?dx*speed*dt:0,-.12,moving?dz*speed*dt:0));if(moving&&V.Distance(before,world.body.position)<speed*dt*.2){telemetry.collisions++;if(destination)destination=null;}
 if(world.body.position.y<-.5||!Number.isFinite(world.body.position.x)){world.body.position.set(0,.72,-15);destination=null;notify('رجعنا إلى بداية الطريق');}
 saveTimer+=dt;if(saveTimer>3){save();saveTimer=0;}
 }
 world.player.root.position.set(world.body.position.x,world.body.position.y-.7,world.body.position.z);
 for(const c of world.characters){if(c.id==='player'){const gait=moving?Math.sin(time*11)*.48:0;c.left.rotation.x=moving?-gait:Math.sin(time*1.4)*.035;c.right.rotation.x=-c.left.rotation.x;if(c.leftLeg){c.leftLeg.rotation.x=gait;c.rightLeg.rotation.x=-gait;}continue;}const phase=time*1.15+c.root.uniqueId;const speaking=activeNPC===c.id;c.root.position.y=0;c.left.rotation.x=Math.sin(phase)*.11+(c.id==='sam'?Math.sin(time*.42)*.14:0);c.right.rotation.x=Math.sin(phase+.9)*-.1+(speaking?Math.sin(time*2)*.17:0);c.head.rotation.y=Math.sin(time*.62+c.root.uniqueId)*.065;c.head.rotation.x=Math.sin(time*.47+c.root.uniqueId)*.025;c.head.rotation.z=speaking?Math.sin(time*1.55+c.root.uniqueId)*.042:Math.sin(phase*.38)*.012;if(c.leftLeg){c.leftLeg.rotation.x=Math.sin(phase*.6)*.014;c.rightLeg.rotation.x=-c.leftLeg.rotation.x;}if(speaking){const dx=world.body.position.x-c.root.position.x,dz=world.body.position.z-c.root.position.z;c.root.rotation.y=Math.atan2(dx,dz)+Math.PI;}}
 // Keep movement deterministic and local: background workers pace within their garden plots.
 for(const tree of world.leaves){tree.root.rotation.z=Math.sin(time*.75+tree.phase)*tree.amplitude;tree.root.rotation.x=Math.sin(time*.55+tree.phase)*tree.amplitude*.65;}
 for(const villager of world.workers){const r=gardenerRoutine(time,villager.phase,villager.range);villager.activity=r.activity;villager.root.position.x=villager.home.x+r.offsetX;villager.root.position.z=villager.home.z+r.offsetZ;const turn=Math.atan2(Math.sin(r.heading-villager.root.rotation.y),Math.cos(r.heading-villager.root.rotation.y));villager.root.rotation.y+=turn*Math.min(1,dt*3.5);villager.left.rotation.x=r.gait+r.tending*Math.sin(time*4.2+villager.phase)*.3;villager.right.rotation.x=-r.gait-r.tending*Math.cos(time*4+villager.phase)*.3;if(villager.leftLeg){villager.leftLeg.rotation.x=-r.gait;villager.rightLeg.rotation.x=r.gait;}}
 for(const a of world.apples){a.root.position.y=.4+Math.sin(time*2.5+a.root.uniqueId)*.06;a.root.rotation.y=time*.4;a.halo.scaling.setAll(1+Math.sin(time*3)*.1);}
 for(const bird of world.birds){const t=time*.13+bird.phase;bird.root.position.set(Math.cos(t)*21,10+Math.sin(t*2),Math.sin(t)*15+8);bird.root.rotation.y=-t;bird.root.rotation.z=Math.sin(time*8+bird.phase)*.18;const flap=Math.sin(time*17+bird.phase)*.18;bird.wingL.scaling.z=1+flap;bird.wingR.scaling.z=1-flap;}
 const target=new V(world.body.position.x,1.25,world.body.position.z);let desired;
 if(!started){desired=new V(1+Math.sin(time*.06)*1.6,5.2,-23);scene.activeCamera.position.copyFrom(desired);scene.activeCamera.setTarget(new V(0,2,4));}
 else {const npc=activeNPC&&world.characters.find(c=>c.id===activeNPC);if(npc){npc.imported.head.computeWorldMatrix(true);target.copyFrom(npc.imported.head.getAbsolutePosition());target.y+=CHARACTER_HEIGHTS[npc.id]*.06-(npc.id==='gandalf'?.6:.38);const direction=world.body.position.subtract(npc.root.position);direction.y=0;if(direction.lengthSquared()<.16)direction.copyFrom(B.Vector3.TransformNormal(new V(0,0,-1),npc.root.getWorldMatrix()));direction.normalize();const angle=.45,c=Math.cos(angle),s=Math.sin(angle);desired=target.add(new V(direction.x*c+direction.z*s,.12,direction.z*c-direction.x*s).scale(npc.id==='gandalf'?2.8:2.1));}else desired=target.add(new V(-Math.sin(yaw)*zoom,Math.sin(pitch)*zoom+.8,-Math.cos(yaw)*zoom));scene.activeCamera.fov+=( (npc?.76:.87)-scene.activeCamera.fov)*(1-Math.exp(-dt*6));const ray=new B.Ray(target,desired.subtract(target).normalize(),V.Distance(target,desired));const hit=scene.pickWithRay(ray,m=>world.colliders.includes(m)&&m.metadata?.cameraBlocker!==false);if(hit?.hit&&hit.distance>.05)desired=target.add(ray.direction.scale(Math.max(.65,hit.distance-.28)));scene.activeCamera.position=B.Vector3.Lerp(scene.activeCamera.position,desired,1-Math.exp(-dt*7));scene.activeCamera.setTarget(target);}
 if(started&&!activeNPC&&!journalOpen&&!mapOpen&&!cinematic&&!partyActive){const near=inside?interior.nearby(world.body.position):nearBagDoor(world.body.position)?{id:'enter-house',name:'ادخل بيت الهوبيت'}:nearestInteractable(state,world.body.position);$('#interaction').hidden=!near;if(near)$('#interact span').textContent=near.id.startsWith('apple')?'التقط التفّاحة':near.id==='party-tree'?'ابدأ حفلة بيلبو':inside||near.id==='enter-house'?near.name:'تحدّث مع '+near.name;}else $('#interaction').hidden=true;
 uiElapsed+=dt;if(uiElapsed>=.1){uiElapsed=0;const rect=canvas.getBoundingClientRect();
 for(const {npc,el,character} of labelBindings){const p=character.root.position.add(new V(0,(CHARACTER_HEIGHTS[npc.id]||1.45)+.25,0)),distance=V.Distance(scene.activeCamera.position,p);const projected=V.Project(p,B.Matrix.Identity(),scene.getTransformMatrix(),scene.activeCamera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight()));el.hidden=!started||!!activeNPC||journalOpen||partyActive||!character.root.isEnabled()||distance>22||projected.z<0||projected.z>1;el.style.left=projected.x/engine.getRenderWidth()*rect.width+'px';el.style.top=projected.y/engine.getRenderHeight()*rect.height+'px';}
 }
 if(state.completed){world.sun.diffuse=B.Color3.Lerp(world.sun.diffuse,new B.Color3(1,.82,.55),dt*.1);}
 if(mapOpen&&telemetry.frames%20===0)drawVillageMap($('#village-map'),world.body.position,state.stage,state.apples);
  audio?.update(dt,{moving,wood:inside});importedActors?.update(dt,activeNPC,partyActive);telemetry.frames++;telemetry.seconds+=dt;if(qaEnabled&&telemetry.frames%15===0){const diag=$('#qa-diagnostics');if(diag)diag.textContent=JSON.stringify(snapshot());}
}
function snapshot(){return {version:BUILD.version,commit:BUILD.commit,storyWindow:STORY_WINDOW.id,state:structuredClone(state),position:{x:world?.body.position.x,y:world?.body.position.y,z:world?.body.position.z},started,activeNPC,journalOpen,camera:{yaw,pitch,zoom},fps:Math.round(engine?.getFps()||0),inside,indoorStats:interior?.stats||null,party:{active:partyActive,started:state?.partyStarted||false,completed:state?.partyCompleted||false,participants:partyActive?partyOriginal.size:0,legacy:ringLegacy?.active?ringLegacy.beat:null},cinematic:{active:cinematic,time:cinematicTime,duration:ARRIVAL_DURATION},audio:audio?{state:audio.state,score:audio.score,foley:audio.foley}:null,mapOpen,quality:qualityControl?.snapshot(),renderSize:engine?{width:engine.getRenderWidth(),height:engine.getRenderHeight(),scale:engine.getHardwareScalingLevel(),shadows:scene.shadowsEnabled}:null,meshes:scene?.meshes.length,triangles:scene?scene.meshes.reduce((n,m)=>n+m.getTotalIndices()/3,0):0,telemetry:{...telemetry},errors:[...errors],world:world?.stats};}
async function boot(){try{const B=window.BABYLON;if(!B)throw Error('تعذّر تحميل محرك Babylon.js. أعد تحميل الصفحة.');engine=new B.Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true,powerPreference:'default'});engine.loadingScreen={displayLoadingUI(){},hideLoadingUI(){}};scene=new B.Scene(engine);const camera=new B.UniversalCamera('third-person camera',new B.Vector3(0,5,-23),scene);camera.minZ=.15;camera.maxZ=200;camera.fov=.87;camera.inputs.clear();world=createWorld(B,scene,{deferredNature:true,deferredCharacters:true});await loadNature(B,scene,world);importedActors=await loadCharacters(B,scene,world);partyFx=createBirthdayEffects($('#party-fx'));arrival=createArrival(B,scene,world);await loadArrivalHorse(B,scene,arrival);state=readSave();world.body.position.set(state.position.x,.72,state.position.z);world.body.onCollide=()=>telemetry.collisions++;
 for(const npc of NPCS){const label=document.createElement('span');label.className='npc-label';label.id='label-'+npc.id;label.textContent=npc.name;label.hidden=true;$('#npc-labels').append(label);labelBindings.push({npc,el:label,character:world.characters.find(c=>c.id===npc.id)});}
 if(new URLSearchParams(location.search).has('qa')){const pre=document.createElement('pre');pre.id='qa-diagnostics';pre.style.cssText='position:fixed;left:5px;bottom:2px;max-width:95%;font:8px monospace;color:white;background:#0008;pointer-events:none;z-index:2;direction:ltr;white-space:pre-wrap;max-height:36px;overflow:hidden';document.body.append(pre);}
 $('#build-version').textContent='الإصدار '+BUILD.version+(BUILD.commit?' · '+BUILD.commit.slice(0,7):' · اختبار محلي');
 refresh();setupInput();await scene.whenReadyAsync();$('#loading').hidden=true;$('#welcome').hidden=false;$('#resume-note').hidden=state.stage===0;$('#restart-story').hidden=state.stage===0;$('#start').textContent=state.stage>0?'أكمل الحفظ السابق ←':'ابدأ الرحلة ←';$('#start').onclick=()=>{started=true;$('#welcome').hidden=true;$('#hud').hidden=false;canvas.focus();if(!soundEnabled)void toggleSound();if(state.partyStarted&&!state.partyCompleted)beginParty(true);else if(state.stage===0)beginOpening();else notify('مرحبًا بعودتك إلى الشاير');};
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();notify('توقّف عرض الرسومات مؤقتًا. نحاول استعادته…');});canvas.addEventListener('webglcontextrestored',()=>notify('عاد عرض الرسومات'));engine.runRenderLoop(()=>{if(document.hidden)return;const dt=frameDelta(engine.getDeltaTime());animate(dt);scene.render();if(qualityControl?.sample(engine.getFps(),engine.getDeltaTime()/1000,started&&!document.hidden))applyQuality();});window.__SHIRE__=Object.freeze((new URLSearchParams(location.search).has('qa')&&['localhost','127.0.0.1'].includes(location.hostname))?{snapshot,qaReposition:(x,z)=>{if(!started||![x,z].every(Number.isFinite)||x<MAP_BOUNDS.minX+2||x>MAP_BOUNDS.maxX-2||z<MAP_BOUNDS.minZ+2||z>MAP_BOUNDS.maxZ-2)throw Error('Invalid QA location');world.body.position.set(x,.72,z);destination=null;save();return snapshot();}}:{snapshot});
}catch(e){fatal(e.message||String(e));}}
boot();



