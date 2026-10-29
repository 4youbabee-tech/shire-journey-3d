// Render-independent game rules. Dialogue is original game writing, not film dialogue.
import {MAP_BOUNDS} from './village-layout.mjs';
export const SAVE_KEY='shire-journey-morning-v1';
// Preserve real-time movement at low render FPS, but ignore huge stalled-tab jumps.
export function frameDelta(elapsedMs){return Math.max(0,Math.min(elapsedMs/1000,.2));}
export const NPCS=[{id:'bilbo',name:'بيلبو',en:'Bilbo',x:8,z:7},{id:'sam',name:'سام',en:'Sam',x:-6,z:1},{id:'gandalf',name:'غاندالف',en:'Gandalf',x:-2,z:17},{id:'frodo',name:'فرودو',en:'Frodo',x:3,z:-4}];
export const APPLES=[{id:'apple-0',x:-18,z:12},{id:'apple-1',x:-17,z:17},{id:'apple-2',x:-21,z:15}];
export function freshState(){return {version:1,stage:0,apples:[],visited:[],position:{x:0,z:-15},completed:false,insideVisited:false,memories:[]};}
export function restoreState(raw){try{const s=JSON.parse(raw);if(!s||s.version!==1)return freshState();const valid=Number.isInteger(s.stage)&&s.stage>=0&&s.stage<=5&&Array.isArray(s.apples)&&Array.isArray(s.visited)&&s.position&&Number.isFinite(s.position.x)&&Number.isFinite(s.position.z)&&s.position.x>MAP_BOUNDS.minX+1&&s.position.x<MAP_BOUNDS.maxX-1&&s.position.z>MAP_BOUNDS.minZ+1&&s.position.z<MAP_BOUNDS.maxZ-1; if(!valid)return freshState();const apples=[...new Set(s.apples.filter(id=>APPLES.some(a=>a.id===id)))];if(s.stage>=3&&apples.length!==3)return freshState();return {...freshState(),stage:s.stage,apples,visited:[...new Set(s.visited.filter(id=>NPCS.some(n=>n.id===id)))],position:{x:s.position.x,z:s.position.z},completed:s.stage===5,insideVisited:s.insideVisited===true,memories:Array.isArray(s.memories)?s.memories.filter(v=>v&&NPCS.some(n=>n.id===v.id)&&typeof v.topic==='string'&&/^[a-z]{2,20}$/.test(v.topic)).slice(-16).map(v=>({id:v.id,topic:v.topic})):[]};}catch{return freshState();}}
export function objective(s){return ['قابل بيلبو قرب الباب الأخضر','تحدّث مع سام عند الحديقة',`اجمع تفّاح البستان · ${s.apples.length}/3`,'أعد التفّاح إلى سام','أخبر بيلبو أنّ التحضير اكتمل','استمتع بوقتك في الشاير'][s.stage];}
export function nearestInteractable(s,p){const objects=[...NPCS,...(s.stage===2?APPLES.filter(a=>!s.apples.includes(a.id)):[])];return objects.map(o=>({...o,distance:Math.hypot(o.x-p.x,o.z-p.z)})).filter(o=>o.distance<2.5).sort((a,b)=>a.distance-b.distance)[0]||null;}
export function talk(s,id){if(!NPCS.some(n=>n.id===id))return false;if(!s.visited.includes(id))s.visited.push(id);return true;}
export function act(s,action){if(action==='accept'&&s.stage===0){s.stage=1;return true;}if(action==='basket'&&s.stage===1){s.stage=2;return true;}if(action==='deliver'&&s.stage===2&&s.apples.length===3){s.stage=3;return true;}if(action==='thank-sam'&&s.stage===3){s.stage=4;return true;}if(action==='finish'&&s.stage===4){s.stage=5;s.completed=true;return true;}return false;}
export function collect(s,id,p){const a=APPLES.find(a=>a.id===id);if(!a||s.stage!==2||s.apples.includes(id)||Math.hypot(a.x-p.x,a.z-p.z)>=2.5)return false;s.apples.push(id);if(s.apples.length===3)act(s,'deliver');return true;}
export function dialogue(s,id){
 if(id==='bilbo'){
  if(s.stage===0)return {text:'أهلًا بك! يوم جميل للمشي، أليس كذلك؟ أجهّز لقاءً صغيرًا للأصدقاء تحت الشجرة الكبيرة. هل تساعدني؟ سام ينتظر قرب الحديقة.',options:[['بكل سرور، سأذهب إلى سام.','accept'],['احكِ لي عن هذا المكان.','bilbo-lore'],['سأتمشّى قليلًا أولًا.','close']]};
  if(s.stage===4)return {text:'ها أنت! رائحة التفّاح وصلت قبلك. سام أخبرني عن مساعدتك. تعال، هناك دائمًا مكان لصديق جديد تحت شجرة الحفل.',options:[['يسعدني أن أبقى معكم.','finish'],['سأعود بعد قليل.','close']]};
  return {text:s.completed?'اكتملت التحضيرات! خذ وقتك، واستمتع بالمكان. تستطيع زيارة غاندالف أو العودة إلى البستان.':'ستجد سام عند الحديقة أسفل الطريق. لا تستعجل؛ الشاير أجمل عندما نمشي على مهل.',options:[['احكِ لي عن الشاير.','bilbo-lore'],['إلى اللقاء يا بيلبو.','close']]};
 }
 if(id==='sam'){
  if(s.stage===1)return {text:'أرسلك بيلبو؟ ممتاز! نحتاج ثلاث تفّاحات من البستان خلفي. اتبع الطريق الصغير إلى الأشجار الحمراء، ثم ارجع إليّ.',options:[['سأجمع التفّاح.','basket'],['كيف أصل إلى البستان؟','sam-lore'],['سأعود قريبًا.','close']]};
  if(s.stage===3)return {text:'تفّاح ممتاز! سأجهّز السلال وألحق بكم. أخبر بيلبو أنّ كل شيء صار جاهزًا. شكرًا على مساعدتك.',options:[['سأوصل له الخبر.','thank-sam'],['لحظة، أريد أن أسألك.','sam-lore']]};
  return {text:s.stage===2?`البستان إلى يسار الطريق. جمعت ${s.apples.length} من ثلاث تفّاحات. سأنتظرك هنا.`:'أهلًا! أحب هذه الساعة؛ الحديقة هادئة والهواء لطيف. هل زرت بيلبو عند الباب الأخضر؟',options:[['احكِ لي عن الحديقة.','sam-lore'],['إلى اللقاء يا سام.','close']]};
 }
 if(id==='frodo')return {text:'صباح الخير! أساعد عمي بيلبو في التجهيز للاحتفال، وأترقّب قصص غاندالف عن السفر. هل تعرف الطريق إلى الشجرة الكبيرة؟',options:[['احكِ لي عن الاحتفال.','frodo-lore'],['سأستكشف القرية.','close']]};
 return {text:'كل رحلة تبدأ بخطوات قليلة. انظر حولك جيدًا: نافذة مضاءة، طريق صغير، وصديق لديه حكاية. هذه التفاصيل تجعل المكان حيًّا.',options:[['إلى أين يقود الطريق؟','gandalf-lore'],['سأستكشف القرية.','close']]};
}
export const LORE={
 'bilbo-lore':'هنا بيوت صغيرة وحدائق يعتني بها أصحابها. خلف كل باب حكاية، وعلى كل طريق فرصة للقاء جار. اليوم نأخذ استراحة للاحتفال بالصداقة.',
 'sam-lore':'أعتني بالزهور والخضار هنا. البستان وراء السياج الخشبي إلى الغرب؛ التفّاح المطلوب يلمع قرب الأرض. اقترب واضغط زر التفاعل.',
 'gandalf-lore':'في هذه التجربة يصل الطريق إلى أطراف القرية. الرحلة الأكبر لم تُبنَ بعد. أمّا الآن، فثمّة أصدقاء يستحقّون أن تتعرّف إليهم.',
 'frodo-lore':'نحضّر لقاءً تحت الشجرة الكبيرة. عمّي بيلبو يهتم بالضيوف وسام بالحديقة، وغاندالف يجلب المفاجآت. لا أعرف بعد كيف سيكون هذا اليوم.'
};
