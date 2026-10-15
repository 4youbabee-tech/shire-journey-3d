/* Shire Journey — NPC Context Brain v1.2
 * Authored, offline, knowledge-bounded story choices plus optional local Ollama paraphrasing.
 * English spoken response + matching Arabic subtitle; no recording/microphone.
 * Narrative canon: public local facts only; secret Ring knowledge never leaked by villagers.
 */
'use strict';
const NPC_BRAIN_TOPICS=['places','work','weather','danger','ring','help','friends','memory','greeting','story_news','story_road','story_help','story_memory'];
const NPC_BRAIN_PERSONAS={
 'Rowan':['baker','خبّاز'], 'Hob Miller':['miller','طحّان'], 'Tansy':['gardener','بستانية'],
 'Hazel':['baker','خبّازة'], 'Hugo':['farmer','مزارع'], 'Aster':['traveller','مسافر'],
 'Bree Traveller':['traveller','مسافر'], 'Bree Merchant':['merchant','تاجر'],
 'Stablehand':['stablehand','عامل الإسطبل'], 'Wandering Pilgrim':['pilgrim','حاجّ'],
 'Barliman':['innkeeper','صاحب النزل'], 'Bree Guard':['guard','حارس'],
 'Elen the Guide':['guide','مرشدة'], 'Iril the Healer':['healer','معالجة'],
 'Gandalf':['wizard','ساحر'], 'Sam':['gardener','بستاني'], 'Frodo':['traveller','مسافر'],
 'Pippin':['traveller','مسافر'], 'Aragorn':['ranger','حارس طرق']
};
const NPC_BRAIN_ALIASES={
 bagend:['bag end','bagend','bagshot','باغ اند','باغ إند','بيت بيلبو'],
 water:['river','water','stream','النهر','نهر','الماء'],market:['market','shop','bazaar','السوق','سوق'],
 mill:['mill','flour','الطاحونة','طاحونة','مطحنة'],meadow:['meadow','flowers','المرج','مروج'],
 gate:['gate','ferry','البوابة','عبارة'], 'prancing-pony':['prancing pony','pony','inn','tavern','نزل','المهر'],
 'north-gate':['north gate','بوابة الشمال','البوابة الشمالية'],
 rivendell_bridge:['bridge','الجسر'],rivendell_waterfall:['waterfall','falls','الشلال'],
 rivendell_library:['library','books','مكتبة','المكتبة'],rivendell_court:['council','court','المجلس','الساحة']
};
const NPC_BRAIN_SIGNS={
 places:['where','how do i get','way to','directions','find','location','أين','وين','كيف اوصل','كيف أصل','طريق','دلني','دلّني','مكان','الاتجاه'],
 work:['work','job','trade','craft','garden','bake','farm','عمل','شغل','مهنة','تعمل','تشتغل','الزراعة','الخبز'],
 weather:['weather','rain','sun','night','morning','evening','الطقس','مطر','ليل','صباح','جو','مساء'],
 danger:['danger','rider','stranger','safe','enemy','road','الخطر','خطر','فرسان','فارس','غريب','غرباء','آمن','الأمان'],
 ring:['ring','one ring','الخاتم','خاتم'],
 help:['help','assist','need','could i','مساعدة','مساعدتك','اساعد','أساعد','تحتاج'],
 friends:['sam','frodo','gandalf','aragorn','friend','neighbor','friends','سام','فرودو','غاندالف','أراغورن','صديق','الجيران'],
 memory:['remember','last time','before','again','remember me','تتذكر','تذكر','المرة الماضية','سابقا','قبل','حكينا'],
 greeting:['hello','hi','hey','good morning','thanks','thank you','مرحبا','اهلا','أهلا','شكرا','شكراً','صباح الخير']
};
function npcBrainClean(s){return String(s||'').normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670]/g,'').replace(/[?؟!,؛.:()"'\[\]{}<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,180)}
function npcBrainValidMemory(raw){
 const out={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
 for(const [n,v] of Object.entries(raw).slice(0,36)){
  if(!NPC_BRAIN_PERSONAS[n]||!v||typeof v!=='object'||Array.isArray(v))continue;
  out[n]={count:Math.max(0,Math.min(3000,Math.floor(Number(v.count)||0))),
   trust:Math.max(-3,Math.min(3,Math.floor(Number(v.trust)||0))),
   last:NPC_BRAIN_TOPICS.includes(v.last)?v.last:'greeting',
   history:Array.isArray(v.history)?v.history.filter(x=>NPC_BRAIN_TOPICS.includes(x)).slice(-6):[]};
 }
 return out;
}
function npcBrainTopic(input){
 const s=npcBrainClean(input);if(!s)return 'greeting';
 // Hard narrative privacy rule: attempts to ask about the Ring are detected first.
 if(NPC_BRAIN_SIGNS.ring.some(w=>s.includes(w)))return 'ring';
 // If a known landmark is named, treat it as a local directions question.
 if(Object.values(NPC_BRAIN_ALIASES).some(arr=>arr.some(w=>s.includes(w))))return 'places';
 const precedence=['memory','places','danger','work','weather','help','friends','greeting'];
 for(const k of precedence)if(NPC_BRAIN_SIGNS[k].some(w=>s.includes(w)))return k;
 return 'unknown';
}
function npcBrainZone(zone){return zone==='bree'?'bree':zone==='rivendell'?'rivendell':zone==='weathertop'?'weathertop':'outside'}
function npcBrainLandmark(query,ctx){
 const s=npcBrainClean(query);const places=Array.isArray(ctx.locations)?ctx.locations:[];
 let possible=places.filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z));
 let scored=possible.map(p=>{
  const names=[npcBrainClean(p.name),npcBrainClean(p.ar),...(NPC_BRAIN_ALIASES[p.id]||[])];
  let score=names.reduce((best,n)=>Math.max(best,n&&s.includes(n)?n.length:0),0);
  return {p,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
 return scored.length?scored[0].p:null;
}
function npcBrainContextReply(name,question,ctx={},prior={}){
 const role=NPC_BRAIN_PERSONAS[name]||['resident','أحد السكان'], zone=npcBrainZone(ctx.zone),
  topic=npcBrainTopic(question), played=Number(ctx.played)||0, stage=Number(ctx.stage)||0,
  isTense=(stage>=4||zone==='bree'||zone==='weathertop'),
  prev=NPC_BRAIN_TOPICS.includes(prior.last)?prior.last:null,
  trust=Math.max(-3,Math.min(3,Number(prior.trust)||0)),talked=Math.max(0,Number(prior.count)||0);
 const me=name;let en='',ar='',delta=0;
 const here={outside:['the Shire','الشاير'],bree:['Bree','بري'],weathertop:['the hill road','درب التلة'],rivendell:['the Elven valley','الوادي الإلفي']}[zone];
 if(topic==='ring'){
  if(name==='Gandalf'&&stage>=1){en='Some matters are too dangerous for an open road. We should speak in private, where no stranger can overhear.';ar='هناك أمور خطيرة جدًا لنناقشها على الطريق. لنتحدّث في مكان خاص بعيدًا عن الغرباء.';}
  else if(name==='Aragorn'&&stage>=10){en='Keep your purpose quiet. The roads have ears, and I will discuss no precious burden before strangers.';ar='أبقِ هدفك سرًّا. للطرق آذان، ولن أتحدّث عن أي عبء ثمين أمام الغرباء.';}
  else {en='I know no secret about such a thing. Better ask someone you trust; rumours on the road can be dangerous.';ar='ما بعرف أي سرّ عن هالشي. الأفضل تسأل شخصًا بتثق فيه؛ إشاعات الطريق ممكن تكون خطيرة.';}
 }else if(topic==='places'){
  const dest=npcBrainLandmark(question,ctx), pos=ctx.npcPos;
  if(dest&&Array.isArray(pos)&&pos.length>=3){
   let dx=dest.x-pos[0],dz=dest.z-pos[2],dist=Math.round(Math.hypot(dx,dz));
   const ew=Math.abs(dx)>5?(dx>0?['east','شرق']:['west','غرب']):null;
   const ns=Math.abs(dz)>5?(dz>0?['south','جنوب']:['north','شمال']):null;
   const dir=[ew,ns].filter(Boolean);const eng=dir.map(d=>d[0]).join(' and ')||'along this lane',arb=dir.map(d=>d[1]).join(' و')||'على هذا الدرب';
   en=`${dest.name} is about ${dist} paces ${eng} from here on our village map. Follow the paths and keep an eye out for the signs.`;
   ar=`${dest.ar||dest.name} على بعد حوالي ${dist} خطوة باتجاه ${arb} بحسب خريطتنا. اتبع الدروب وانتبه للعلامات.`;
  }else{en=`I know these paths around ${here[0]}, but not every road beyond them. Ask about a local landmark shown on your map.`;ar=`بعرف الدروب حول ${here[1]}، لكن مش كل الطرق البعيدة. اسألني عن معلم موجود على خريطتك.`;}
 }else if(topic==='work'){
  en=`I spend much of my day as a ${role[0]} here in ${here[0]}. The work changes with the hour, and neighbours need each other.`;
  ar=`بقضي معظم نهاري بعملي كـ${role[1]} هون في ${here[1]}. الشغل بيتغيّر حسب الوقت، والجيران بحاجة لبعضهم.`;
 }else if(topic==='weather'){
  let night=ctx.period==='night',evening=ctx.period==='evening';
  en=night?'The air has cooled, and most windows are lit. Watch the path after dark.':evening?'The sun is sinking. The lanterns will guide folk home soon.':'The day is bright enough for work in the gardens, though weather can turn quickly.';
  ar=night?'الجو برد، ومعظم النوافذ مضوية. انتبه للدرب بعد العتمة.':evening?'الشمس عم تغيب، وقريبًا الفوانيس بترشد الناس لبيوتها.':'النهار مناسب للشغل بالحدائق، لكن الطقس ممكن يتغيّر بسرعة.';
 }else if(topic==='danger'){
  en=isTense?'People have been whispering about riders and strangers. Stay on the travelled paths, and do not wander alone after dark.':'The country feels peaceful today, but a traveller should still be mindful of unfamiliar roads.';
  ar=isTense?'الناس عم تهمس عن فرسان وغرباء. خليك على الدروب المعروفة وما تتجوّل لحالك بعد العتمة.':'البلاد هادئة اليوم، لكن المسافر لازم ينتبه للطرق اللي ما بيعرفها.';
 }else if(topic==='help'){
  if(name==='Tansy'||name==='Bree Merchant'){
   en=trust>0?'You have helped me before. Thank you again. I will remember your kindness.':'A neighbour who offers help is always welcome. Talk to me about my work if you want to lend a hand.';
   ar=trust>0?'ساعدتني من قبل، شكرًا مرة تانية. رح أتذكّر لطفك.':'الجار اللي بعرض المساعدة مرحّب فيه. اسألني عن شغلي إذا بدك تساعد.';
  }else{en='Thank you for asking. Keeping an eye on our neighbours matters more than any grand promise.';ar='شكرًا لأنك سألت. الاهتمام بالجيران أهم من أي وعد كبير.';}delta=1;
 }else if(topic==='friends'){
  en=`Friends and neighbours make ${here[0]} feel like home. I trust deeds more than grand stories.`;
  ar=`الأصدقاء والجيران هنّي اللي بيخلّوا ${here[1]} متل البيت. أنا بثق بالأفعال أكتر من الحكايات الكبيرة.`;
 }else if(topic==='memory'){
  en=talked?`We have spoken ${talked} time${talked===1?'':'s'} before. Last time we talked about ${prev||'the village'}; I remember that.`:'We have only just met. Names and good deeds are worth remembering.';
  ar=talked?`حكينا ${talked} مرة من قبل. آخر مرة كان حديثنا عن ${npcBrainTopicAr(prev)}، وبتذكّر هالشي.`:'تعرّفنا على بعض هلّق. الأسماء والأعمال الطيبة بتستحق التذكّر.';
 }else if(topic==='greeting'){
  en=`Good to see you again${talked?', traveller':''}. The paths of ${here[0]} are always better with friendly faces.`;
  ar=`أهلًا فيك${talked?' مرة تانية':''}. دروب ${here[1]} أحلى بوجود الوجوه الطيبة.`;
 }else{
  en=`I cannot give you a sure answer to that. I can talk about local places, daily work, weather, danger, or our last conversation.`;
  ar=`ما عندي جواب مؤكّد لهالسؤال. فيك تسألني عن الأماكن القريبة، الشغل اليومي، الطقس، المخاطر، أو حديثنا السابق.`;
 }
 // Store small, bounded, non-sensitive topic history (not verbatim user text).
 const record={count:Math.min(3000,talked+1),trust:Math.max(-3,Math.min(3,trust+delta)),last:NPC_BRAIN_TOPICS.includes(topic)?topic:'greeting',history:[...(Array.isArray(prior.history)?prior.history:[]),NPC_BRAIN_TOPICS.includes(topic)?topic:'greeting'].slice(-6)};
 return {topic,english:en,arabic:ar,speaker:me,record,zone,source:'AUTHORED-OFFLINE'};
}
function npcBrainTopicAr(t){return {places:'الأماكن',work:'الشغل',weather:'الطقس',danger:'الطرقات والمخاطر',ring:'الأخبار الغامضة',help:'المساعدة',friends:'الأصدقاء',greeting:'التحيات',memory:'الذكريات'}[t]||'القرية'}

// All player prompts below are PREWRITTEN storyline dialogue options. Never read typed questions.
const NPC_STORY_LABELS={
 story_news:['What have you noticed lately?','شو لاحظت بالآونة الأخيرة؟'],
 story_road:['Which road should we take?','أي طريق يجب أن نسلك؟'],
 story_help:['How can I help here?','كيف بقدر ساعد هون؟'],
 story_memory:['Do you remember what we discussed?','هل تتذكر ما تحدثنا عنه؟'],
 story_another:['Ask about something else.','اسأل عن موضوع آخر.'],
 story_back:['Return to our conversation.','العودة إلى الحديث الأساسي.']
};
Object.assign(CHOICES,NPC_STORY_LABELS);

// The words offered to the player adapt to the active chapter, never ask for text input.
function npcStoryQuestionLabels(zone,stage){
 if(zone==='weathertop')return {
  story_news:['Have you noticed anyone following us?','هل لاحظت أحدًا يتبعنا؟'],
  story_road:['Where can we find shelter?','أين يمكن أن نحتمي؟'],
  story_help:['How can I protect the company?','كيف يمكنني حماية الرفقة؟'],
  story_memory:['What did we decide before?','ماذا قررنا من قبل؟']};
 if(zone==='rivendell')return {
  story_news:['What is happening in this valley?','ماذا يحدث في هذا الوادي؟'],
  story_road:['Where are the library and council court?','أين المكتبة وساحة المجلس؟'],
  story_help:['How can I help the wounded?','كيف أساعد الجرحى؟'],
  story_memory:['Do you remember our last talk?','هل تتذكر حديثنا الأخير؟']};
 if(zone==='bree')return {
  story_news:['What have you heard at the inn?','ماذا سمعت في النزل؟'],
  story_road:['Which way leads to the northern gate?','أي طريق يؤدي إلى البوابة الشمالية؟'],
  story_help:['Can I be of use here?','هل يمكنني المساعدة هنا؟'],
  story_memory:['Have we spoken before?','هل تحدثنا من قبل؟']};
 if(stage>=4)return {
  story_news:['Are strangers troubling the Shire?','هل يزعج الغرباء أهل الشاير؟'],
  story_road:['Which lane leads east?','أي طريق يؤدي شرقًا؟'],
  story_help:['Can I help the neighbours before leaving?','هل أساعد الجيران قبل الرحيل؟'],
  story_memory:['What do you remember of our talks?','ماذا تتذكر من أحاديثنا؟']};
 return {
  story_news:['How are things in Hobbiton?','كيف الأحوال في هوبيتون؟'],
  story_road:['Where is the eastern lane?','أين الطريق الشرقي؟'],
  story_help:['Who needs a hand today?','من يحتاج المساعدة اليوم؟'],
  story_memory:['Do you remember meeting me?','هل تتذكر لقاءنا؟']};
}
const NPC_STORY_WORLD={
 outside:{name:'the Shire',ar:'الشاير',news:[
 ['The market is busy with bread and flowers. The neighbours still keep an eye on the eastern lanes.','السوق مزدحم بالخبز والزهور، والجيران بعدهم منتبهين للطرق الشرقية.'],
 ['The gardens are bright and the mill keeps working. There is talk of travellers beyond our fields.','الحدائق مزهرة والطاحونة تعمل، والناس تتحدث عن مسافرين وراء الحقول.']],
 danger:['The quieter paths feel less safe now. Keep your companions near, and avoid strangers after dusk.','الدروب الهادئة لم تعد آمنة كما كانت. أبقِ رفاقك قربك وتجنب الغرباء بعد الغروب.'],
 road:['Take the eastern lane beyond the market. The old mill and the river bridge help you find your bearings.','اسلك الطريق الشرقي بعد السوق؛ الطاحونة القديمة وجسر النهر علامتان مهمتان للطريق.']},
 inside:{name:'Bag End',ar:'باغ إند',news:[['The house is quiet, though the roads beyond the hill are not.','البيت هادئ، لكن الطرق خارج التل ليست كذلك.']],danger:['We should speak quietly. It is better not to draw attention to the house.','من الأفضل أن نتحدث بهدوء وألا نلفت الأنظار إلى البيت.'],road:['The front path leads down to Hobbiton, with the eastern lane beyond.','الممر الأمامي ينزل نحو هوبيتون، وبعده الطريق الشرقي.']},
 bree:{name:'Bree',ar:'بري',news:[['The Prancing Pony has travellers from several roads. Not everyone speaks plainly about their journey.','في نزل المهر الراقص مسافرون من طرق عدة، وليس الجميع يتحدث بصراحة عن رحلته.'],['People speak softly near the northern gate. The streets are busy, but the night makes everyone cautious.','الناس تتحدث بهدوء قرب البوابة الشمالية؛ الشوارع مزدحمة لكن الليل يجعل الجميع حذرًا.']],danger:['Keep close to the inn and avoid drawing a crowd. The northern gate is worth watching.','ابقَ قرب النزل ولا تجذب الحشود. من الأفضل مراقبة البوابة الشمالية.'],road:['The northern gate lies beyond the inn. Speak to the guard before taking the open road.','البوابة الشمالية بعد النزل؛ تحدث إلى الحارس قبل الخروج إلى الطريق.']},
 weathertop:{name:'Weathertop',ar:'ويذرتوب',news:[['The ruins give little shelter. The wind carries every sound across this exposed hill.','الأطلال لا توفر ملجأً كبيرًا، والريح تنقل كل صوت فوق هذه التلة المكشوفة.']],danger:['Keep low among the stones. An open hill is no place for an unguarded fire.','انخفض بين الحجارة؛ التلة المكشوفة ليست مكانًا مناسبًا لنار بلا حراسة.'],road:['Stay close to Aragorn and the ruined crown. The safer route is the one the ranger has checked.','ابقَ قرب أراغورن وقمة الأطلال؛ الطريق الآمن هو الذي تفقده الحارس.']},
 rivendell:{name:'Rivendell',ar:'ريفنديل',news:[['The valley is peaceful enough to heal in. The waterfalls and library paths are open to guests.','الوادي هادئ بما يكفي للاستشفاء، ومسارات الشلالات والمكتبة مفتوحة للضيوف.']],danger:['Rest first. The paths beyond this valley are not to be chosen in haste.','استرح أولًا، فالطرق وراء هذا الوادي لا ينبغي اختيارها بتسرّع.'],road:['Follow the bridge toward the council courtyard. The library lies along the eastern path.','اعبر الجسر نحو ساحة المجلس، وتقع المكتبة على الطريق الشرقي.']}
};
function npcStoryZone(zone){return Object.prototype.hasOwnProperty.call(NPC_STORY_WORLD,zone)?zone:'outside'}
function npcStorySelect(name,topic,ctx={},prior={}){
 const zone=npcStoryZone(ctx.zone),place=NPC_STORY_WORLD[zone],stage=Math.max(0,Number(ctx.stage)||0);
 const count=Math.max(0,Math.min(3000,Number(prior.count)||0));
 const trust=Math.max(-3,Math.min(3,Number(prior.trust)||0));
 const rotation=(count+name.length+stage)%place.news.length;
 const recurring=Array.isArray(prior.history)&&prior.history.includes('help');
 let core=place.news[rotation],intro=['The morning finds us busy.','There is always something happening nearby.','I have kept my eyes open.'][rotation%3],introAr=['الصباح مليء بالأعمال.','هناك أمور تحدث دائمًا حولنا.','كنت أراقب ما يجري.'][rotation%3];
 let en='',ar='',delta=0;
 if(topic==='story_news'){
   if(stage>=4&&zone==='outside')core=[place.danger[0],place.danger[1]];
   en=intro+' '+core[0];ar=introAr+' '+core[1];
 }else if(topic==='story_road'){
   en=place.road[0];ar=place.road[1];
   if(zone==='rivendell'&&stage<15){en='The valley roads are not yet open to our company.';ar='طرق الوادي ليست مفتوحة بعد لرفقتنا.';}
 }else if(topic==='story_help'){
   if(trust>0||recurring){en='I remember your kindness. A little help with everyday work can keep the whole village going.';ar='بتذكر لطفك. القليل من المساعدة بالأعمال اليومية يساند القرية كلها.';}
   else if(zone==='weathertop'){en='Keep an eye on the stones and stay close to the others. That is help enough tonight.';ar='راقب الحجارة وابقَ قريبًا من الرفاق. هذه أكبر مساعدة الليلة.';}
   else if(zone==='rivendell'){en='Let the weary rest. The healers have much to do and welcome a quiet hand.';ar='دع المتعبين يستريحون. المعالجون لديهم الكثير من العمل ويرحّبون بالمساعدة الهادئة.';}
   else if(name==='Hob Miller'){en='The miller needs the missing tool from the riverbank. Even small kindnesses matter.';ar='الطحّان بحاجة إلى أداته المفقودة قرب ضفة النهر. حتى المساعدة الصغيرة مهمة.';}
   else{en='A neighbour can always use help with the market, the gardens, or the lane.';ar='الجيران دائمًا يحتاجون مساعدة في السوق أو الحدائق أو الطريق.';}
   delta=1;
 }else if(topic==='story_memory'){
   const last=(prior.history||[]).filter(x=>x!=='story_memory').slice(-1)[0];
   const labels={story_news:['news from around here','أخبار المنطقة'],story_road:['the road ahead','الطريق القادم'],story_help:['helping our neighbours','مساعدة الجيران']};
   if(!count){en='We have only just met. I will remember a friend who listens.';ar='تعرّفنا على بعض الآن. سأتذكر الصديق الذي يُحسن الإصغاء.';}
   else {en='We spoke before about '+(labels[last]||['our meeting','لقائنا'])[0]+'. I have not forgotten.';ar='تحدثنا من قبل عن '+(labels[last]||['لقائنا','لقائنا'])[1]+'، ولم أنسَ ذلك.';}
 }else{return null;}
 // Preserve small bounded topic memory, not raw user strings; no spoilers on ordinary NPC paths.
 const record={count:Math.min(3000,count+1),trust:Math.max(-3,Math.min(3,trust+delta)),last:'greeting',history:[...(Array.isArray(prior.history)?prior.history:[]),topic].slice(-6)};
 return {speaker:name,english:en,arabic:ar,record,topic,source:'OFFLINE-CONSTRAINED-GRAMMAR',zone};
}
// Optional true SMALL LOCAL GENERATIVE MODEL, never automatic web API use.
// The model only rewrites a grounded, bilingual canonical reply; story choices remain authored.
const LOCAL_STORY_MODEL='qwen2.5:0.5b';
async function npcLocalGenerateParaphrase(base,context={}){
 if(typeof fetch!=='function')return null;
 let timer;const controller=new AbortController();
 try{
   timer=setTimeout(()=>controller.abort(),9000);
   const prompt=`You are a short narrative dialogue stylist for an UNOFFICIAL fantasy game. Never invent facts or change story events. Only rephrase the following EXISTING reply, preserving every concrete fact. Do not add any character, place, secret, plot, promise or gameplay instruction. Return ONLY a JSON object with two strings: english (English, <= 240 characters), arabic (faithful Arabic translation, <= 260 characters). Speaker: ${String(context.name||'villager').slice(0,55)}. This is NOT freeform Q&A. Original English: ${base.english}. Arabic: ${base.arabic}.`;
   const res=await fetch('http://127.0.0.1:11434/api/generate',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({model:LOCAL_STORY_MODEL,prompt,stream:false,format:'json',options:{temperature:.22,num_predict:140}})});
   if(!res.ok)return null;
   const data=await res.json();let parsed=JSON.parse(String(data.response||'{}'));
   if(typeof parsed.english!=='string'||typeof parsed.arabic!=='string')return null;
   const en=parsed.english.trim(),ar=parsed.arabic.trim();
   if(en.length<12||en.length>240||ar.length<12||ar.length>260||!/[\u0600-\u06ff]/.test(ar)||/[<>]/.test(en+ar))return null;
   // No spoilers or lore revelations from ordinary NPCs; if unsure, use canonical response.
   if(/one ring|ringbearer|sauron|mordor|nazg[uû]l|secret ring|spoiler/i.test(en)||/الخاتم الأوحد|ساورون|نازغول|موردور/i.test(ar))return null;
   return {...base,english:en,arabic:ar,source:'LOCAL-OLLAMA-EXPERIMENTAL'};
 }catch(e){return null}finally{clearTimeout(timer)}
}
