// Render-independent game rules. Dialogue is original game writing, not film dialogue.
import {MAP_BOUNDS,EAST_GATE} from './village-layout.mjs';
import {CAMPAIGN_CHAPTERS,getChapter,isKnownChapter,canAdvanceChapter,activateChapter,createChapterProgress} from './campaign.mjs';
export const SAVE_KEY='shire-journey-morning-v1';
// Preserve real-time movement at low render FPS, but ignore huge stalled-tab jumps.
export function frameDelta(elapsedMs){return Math.max(0,Math.min(elapsedMs/1000,.2));}
export const NPCS=[{id:'bilbo',name:'بيلبو',en:'Bilbo',x:8,z:7},{id:'sam',name:'سام',en:'Sam',x:-6,z:1},{id:'gandalf',name:'غاندالف',en:'Gandalf',x:-2,z:17},{id:'frodo',name:'فرودو',en:'Frodo',x:3,z:-4},{id:'merry',name:'ميري',en:'Merry',x:70,z:-15},{id:'pippin',name:'بيبين',en:'Pippin',x:79,z:-10}];
export const PARTY_TREE=Object.freeze({id:'party-tree',name:'شجرة احتفال بيلبو',x:-2,z:21});
export const APPLES=[{id:'apple-0',x:-18,z:12},{id:'apple-1',x:-17,z:17},{id:'apple-2',x:-21,z:15}];
export function freshState(){return {version:2,storyChapterId:'F1-01',laneId:'shire',worldStateVariant:'shire-birthday',partyRoster:['bilbo','frodo','sam','gandalf'],knowledgeFlags:{ringDangerKnown:false,sauronConnectionKnown:false,samKnowsDeparture:false},canonicalOutcomeFlags:{bilboDeparted:false,ringPassed:false,frodoDeparted:false,hobbitsReachedBree:false},optionalActivityFlags:{appleErrandCompleted:false,applesSkipped:false},chapterProgress:createChapterProgress('F1-01'),ringInvestigated:false,gandalfExplainedRing:false,suppliesPacked:false,frodoDeparted:false,companionsJoined:false,stage:0,apples:[],visited:[],position:{x:0,z:-15},completed:false,insideVisited:false,gandalfMet:false,partyStarted:false,partyCompleted:false,bilboGone:false,ringPassed:false,applesSkipped:false,memories:[]};}
export function restoreState(raw){
 try{
  const saved=JSON.parse(raw);if(!saved||![1,2].includes(saved.version))return freshState();
  const valid=Number.isInteger(saved.stage)&&saved.stage>=0&&saved.stage<=5&&Array.isArray(saved.apples)&&Array.isArray(saved.visited)&&saved.position&&Number.isFinite(saved.position.x)&&Number.isFinite(saved.position.z)&&saved.position.x>MAP_BOUNDS.minX+1&&saved.position.x<MAP_BOUNDS.maxX-1&&saved.position.z>MAP_BOUNDS.minZ+1&&saved.position.z<MAP_BOUNDS.maxZ-1;
  if(!valid)return freshState();
  const apples=[...new Set(saved.apples.filter(id=>APPLES.some(a=>a.id===id)))];
  if(saved.stage>=3&&apples.length!==3&&!(saved.stage>=4&&saved.applesSkipped===true))return freshState();
  if((saved.partyStarted===true||saved.partyCompleted===true)&&saved.stage!==5)return freshState();
  const partyCompleted=saved.partyCompleted===true;
  const storyChapterId=saved.version===1?(partyCompleted?'F1-02':'F1-01'):(isKnownChapter(saved.storyChapterId)?saved.storyChapterId:(partyCompleted?'F1-02':'F1-01'));
  if(storyChapterId==='F1-02'&&!partyCompleted)return freshState();
  const frodoDeparted=saved.version===2&&saved.frodoDeparted===true;
  if(storyChapterId==='F1-03'&&!frodoDeparted)return freshState();
  const ringInvestigated=saved.version===2&&saved.ringInvestigated===true;
  const gandalfExplainedRing=saved.version===2&&saved.gandalfExplainedRing===true;
  const suppliesPacked=saved.version===2&&saved.suppliesPacked===true;
  if(gandalfExplainedRing&&!ringInvestigated||suppliesPacked&&!gandalfExplainedRing)return freshState();
  const visited=[...new Set(saved.visited.filter(id=>NPCS.some(n=>n.id===id)))];
  const memories=Array.isArray(saved.memories)?saved.memories.filter(v=>v&&NPCS.some(n=>n.id===v.id)&&typeof v.topic==='string'&&/^[a-z]{2,20}$/.test(v.topic)).slice(-16).map(v=>({id:v.id,topic:v.topic})):[];
  const chapterProgress=createChapterProgress('F1-01');
  chapterProgress['F1-01']=partyCompleted?'complete':'active';
  chapterProgress['F1-02']=storyChapterId==='F1-02'?'active':storyChapterId==='F1-03'?'complete':'locked';
  chapterProgress['F1-03']=storyChapterId==='F1-03'?'active':'locked';
  if(saved.version===2&&saved.chapterProgress)for(const [id,status] of Object.entries(saved.chapterProgress))if(isKnownChapter(id)&&['locked','active','complete'].includes(status))chapterProgress[id]=status;
  const state={...freshState(),storyChapterId,laneId:storyChapterId==='F1-01'?'shire':storyChapterId.startsWith('F1-')?'ring-bearer':saved.laneId||'ring-bearer',worldStateVariant:storyChapterId==='F1-01'?'shire-birthday':storyChapterId==='F1-02'?'shire-after-birthday':storyChapterId==='F1-03'?'shire-road':saved.worldStateVariant||'shire-road',partyRoster:storyChapterId==='F1-01'?['bilbo','frodo','sam','gandalf']:storyChapterId==='F1-02'?['frodo','gandalf','sam']:storyChapterId==='F1-03'?['frodo','sam','merry','pippin']:Array.isArray(saved.partyRoster)?saved.partyRoster:[],knowledgeFlags:{ringDangerKnown:gandalfExplainedRing,sauronConnectionKnown:gandalfExplainedRing,samKnowsDeparture:suppliesPacked},canonicalOutcomeFlags:{bilboDeparted:partyCompleted,ringPassed:partyCompleted,frodoDeparted, hobbitsReachedBree:saved.version===2&&saved.canonicalOutcomeFlags?.hobbitsReachedBree===true},optionalActivityFlags:{appleErrandCompleted:apples.length===3,applesSkipped:saved.applesSkipped===true},chapterProgress,ringInvestigated,gandalfExplainedRing,suppliesPacked,frodoDeparted,companionsJoined:saved.version===2&&saved.companionsJoined===true,stage:saved.stage,apples,visited,position:{x:saved.position.x,z:saved.position.z},completed:saved.stage===5,insideVisited:saved.insideVisited===true,gandalfMet:saved.gandalfMet===true||saved.stage>0,partyStarted:saved.partyStarted===true||partyCompleted,partyCompleted,bilboGone:partyCompleted,ringPassed:partyCompleted,applesSkipped:saved.applesSkipped===true,memories};
  if(state.companionsJoined&&storyChapterId!=='F1-03')return freshState();
  return state;
 }catch{return freshState();}
}
export function objective(s){
 if(s.storyChapterId==='F1-02'){if(!s.ringInvestigated)return 'ادخل بيت بيلبو وافحص دفتره وملاحظاته القديمة';if(!s.gandalfExplainedRing)return 'تحدّث مع غاندالف عن حقيقة الخاتم';if(!s.suppliesPacked)return 'ساعد سام في تجهيز المؤن للرحلة';return 'اتبع البوابة الشرقية وغادر الشاير';}
 if(s.storyChapterId==='F1-03'){return s.companionsJoined?'اتبع الطريق الشرقي نحو عبّارة برانديواين':'تفقّد باكلبري والتقِ بميري وبيبين';}
 if(s.stage===0)return s.gandalfMet?'قابل بيلبو عند الباب الأخضر':'حيِّ غاندالف العائد إلى الشاير';
 if(s.stage===5)return s.partyCompleted?'بدأ ظل الماضي؛ ابحث عن فرودو قرب بيت بيلبو':s.partyStarted?'شاهد الاحتفال ووداع بيلبو':'توجّه إلى شجرة الاحتفال لبدء الحفلة';
 return ['','تحدّث مع سام عند الحديقة',`ارجع إلى سام أو اجمع التفّاح (اختياري) · ${s.apples.length}/3`,'أعد التفّاح إلى سام','أخبر بيلبو أنّ التحضير اكتمل'][s.stage];
}
export function nearestInteractable(s,p){
 const activeNPCs=NPCS.filter(n=>(n.id!=='bilbo'||!s.partyCompleted)&&(!['merry','pippin'].includes(n.id)||s.storyChapterId==='F1-03'));
 const objects=[...activeNPCs,...(s.stage===2?APPLES.filter(a=>!s.apples.includes(a.id)):[]),...(s.stage===5&&!s.partyStarted&&!s.partyCompleted?[PARTY_TREE]:[]),...(s.storyChapterId==='F1-02'&&s.suppliesPacked?[{id:'shire-gate',name:'البوابة الشرقية للشاير',x:EAST_GATE.x,z:EAST_GATE.z}]:[])];
 return objects.map(o=>({...o,distance:Math.hypot(o.x-p.x,o.z-p.z)})).filter(o=>o.distance<2.5).sort((a,b)=>a.distance-b.distance)[0]||null;
}
export function talk(s,id){if(!NPCS.some(n=>n.id===id))return false;if(['merry','pippin'].includes(id)&&s.storyChapterId!=='F1-03')return false;if(!s.visited.includes(id))s.visited.push(id);if(s.storyChapterId==='F1-03'&&s.visited.includes('merry')&&s.visited.includes('pippin')){s.companionsJoined=true;s.partyRoster=['frodo','sam','merry','pippin'];}return true;}
export function act(s,action){
 if(action==='greet-wizard'&&s.stage===0&&!s.gandalfMet){s.gandalfMet=true;return true;}
 if(action==='start-party'&&s.stage===5&&!s.partyStarted){s.partyStarted=true;return true;}
 if(action==='party-finalize'&&s.stage===5&&s.partyStarted&&!s.partyCompleted){s.partyCompleted=true;s.bilboGone=true;s.ringPassed=true;s.canonicalOutcomeFlags.bilboDeparted=true;s.canonicalOutcomeFlags.ringPassed=true;return activateChapter(s,'F1-02');}
 if(action==='investigate-ring'&&s.storyChapterId==='F1-02'&&s.partyCompleted&&!s.ringInvestigated){s.ringInvestigated=true;return true;}
 if(action==='explain-ring'&&s.storyChapterId==='F1-02'&&s.ringInvestigated&&!s.gandalfExplainedRing){s.gandalfExplainedRing=true;s.knowledgeFlags.ringDangerKnown=true;s.knowledgeFlags.sauronConnectionKnown=true;return true;}
 if(action==='pack-supplies'&&s.storyChapterId==='F1-02'&&s.gandalfExplainedRing&&!s.suppliesPacked){s.suppliesPacked=true;s.knowledgeFlags.samKnowsDeparture=true;return true;}
 if(action==='depart-shire'&&s.storyChapterId==='F1-02'&&s.suppliesPacked&&!s.frodoDeparted){s.frodoDeparted=true;s.canonicalOutcomeFlags.frodoDeparted=true;return activateChapter(s,'F1-03');}
 if(action==='accept'&&s.stage===0&&s.gandalfMet){s.stage=1;return true;}
 if(action==='basket'&&s.stage===1){s.stage=2;return true;}
 if(action==='skip-apples'&&(s.stage===1||s.stage===2)){s.stage=4;s.applesSkipped=true;s.optionalActivityFlags.applesSkipped=true;return true;}
 if(action==='deliver'&&s.stage===2&&s.apples.length===3){s.stage=3;s.optionalActivityFlags.appleErrandCompleted=true;return true;}
 if(action==='thank-sam'&&s.stage===3){s.stage=4;return true;}
 if(action==='finish'&&s.stage===4){s.stage=5;s.completed=true;return true;}
 return false;
}
export function collect(s,id,p){const a=APPLES.find(a=>a.id===id);if(!a||s.stage!==2||s.apples.includes(id)||Math.hypot(a.x-p.x,a.z-p.z)>=2.5)return false;s.apples.push(id);if(s.apples.length===3)act(s,'deliver');return true;}
export function dialogue(s,id){
 if(s.storyChapterId==='F1-02'){
  if(id==='frodo')return {text:!s.ringInvestigated?'بعد رحيل عمي، بقيت في البيت أسئلة كثيرة عن الخاتم. أريد أن أعود إلى بيت بيلبو وأفحص أوراقه قبل أن أتحدث مع غاندالف.':!s.gandalfExplainedRing?'وجدت ملاحظات قديمة في دفتر بيلبو. أشعر أن الأمر أكبر من ذكرى عائلية؛ يجب أن أسمع ما يعرفه غاندالف.':'الآن فهمت لماذا كان غاندالف قلقًا. علينا أن نستعد بهدوء، وسام يعرف ما نحتاجه للطريق.',options:[['سأعود إلى بيت بيلبو.','close'],['سأتحدث مع غاندالف.','close']]};
  if(id==='gandalf'){
   if(!s.ringInvestigated)return {text:'لا ينبغي أن نتعجل. افحص ملاحظات بيلبو في بيته أولًا، ثم عد إليّ؛ هناك أمور لا يجوز أن تبقى مجهولة.',options:[['سأفحص دفتر بيلبو.','close']]};
   if(!s.gandalfExplainedRing)return {text:'الخاتم الذي يحمله فرودو ليس زينة عادية. إنه الخاتم الأوحد، وصِلته بسورون تجعل بقاءه في الشاير خطرًا. يجب أن يغادر فرودو قبل أن يصل الظل إلى هذه التلال.',options:[['فهمت الخطر. سأستعد للمغادرة.','explain-ring']]};
   return {text:'لقد عرف فرودو الآن ما يكفي ليختار الطريق. لا نريد أن نثير الانتباه؛ تحدث إلى سام واجمع المؤن، ثم غادروا من الطريق الشرقي.',options:[['سأطلب من سام تجهيز المؤن.','close']]};
  }
  if(id==='sam'){
   if(!s.gandalfExplainedRing)return {text:'أشعر أن شيئًا تغيّر منذ رحيل السيد بيلبو. غاندالف يعرف أكثر مما يقول، فاسأله قبل أن نجهز الطريق.',options:[['سأتحدث مع غاندالف.','close']]};
   if(!s.suppliesPacked)return {text:'إذا كان فرودو سيغادر، فسأجهز له خبزًا وطعامًا وعباءة خفيفة. أعطني لحظة لأربط الحقيبة وأضعها قرب الباب.',options:[['جهّز المؤن يا سام.','pack-supplies']]};
   return {text:'الحقيبة جاهزة، والطريق الشرقي واضح حتى باكلبري. سأرافق فرودو؛ لا ينبغي أن يسافر وحده.',options:[['لننطلق.','close']]};
  }
 }
 if(s.storyChapterId==='F1-03'){
  if(id==='merry')return {text:'فرودو! عرفنا أنك ستسلك الطريق شرقًا. أنا ميري، وأعرف ممرات باكلبري وضفاف النهر. لن نتركك تسافر وحدك.',options:[['سعيد برؤيتك يا ميري.','close'],['أين بيبين؟','close']]};
  if(id==='pippin')return {text:'وصلت أخيرًا! الطريق إلى العبّارة يمر بين الأشجار، لكن لا تتأخروا عند الغروب. سمعت أخبارًا عن فرسان غرباء على الطريق.',options:[['ابقَ معنا يا بيبين.','close'],['لنسر معًا.','close']]};
  if(id==='frodo')return {text:s.companionsJoined?'ميري وبيبين انضما إلينا، وسام يحمل المؤن. علينا متابعة الطريق إلى العبّارة قبل أن يحل الظلام.':'وصلنا إلى باكلبري. أبحث عن ميري وبيبين؛ قد يعرفان طريق العبور إلى الضفة الأخرى.',options:[['سأبحث عن رفاقي.','close']]};
 }

 if(id==='bilbo'){
  if(s.stage===0&&!s.gandalfMet)return {text:'غاندالف عاد إلى الشاير، وقد سمع الناس صوت عربته في الطريق. حيّه أولًا ثم عد إليّ؛ فالحفلة تحتاج إلى أصدقاء يساعدوننا.',options:[['سأرحّب به ثم أعود.','close']]};
  if(s.stage===0)return {text:'أهلًا بك! يوم جميل للمشي، أليس كذلك؟ أجهّز لقاءً صغيرًا للأصدقاء تحت الشجرة الكبيرة. هل تساعدني؟ سام ينتظر قرب الحديقة.',options:[['بكل سرور، سأذهب إلى سام.','accept'],['احكِ لي عن هذا المكان.','bilbo-lore'],['سأتمشّى قليلًا أولًا.','close']]};
  if(s.partyCompleted)return {text:'ترك بيلبو بيته وذكرياته خلفه واختار أن يسافر بعد الحفلة. الآن يحمل فرودو أمرًا جديدًا، وستتغيّر الأيام شيئًا فشيئًا.',options:[['سأبحث عن فرودو.','close']]};
  if(s.stage===4)return {text:s.apples.length===3?'ها أنت! رائحة التفّاح وصلت قبلك. سام أخبرني عن مساعدتك. تعال، هناك دائمًا مكان لصديق جديد تحت شجرة الحفل.':'سام يتابع تحضيرات الحفلة، وهناك ما هو أهم من سلال البستان: لنتوجّه إلى الشجرة الكبيرة لنشهد هذه الليلة.',options:[['يسعدني أن أبقى معكم.','finish'],['سأعود بعد قليل.','close']]};
  return {text:s.completed?'اكتملت التحضيرات! خذ وقتك، واستمتع بالمكان. تستطيع زيارة غاندالف أو العودة إلى البستان.':'ستجد سام عند الحديقة أسفل الطريق. لا تستعجل؛ الشاير أجمل عندما نمشي على مهل.',options:[['احكِ لي عن الشاير.','bilbo-lore'],['إلى اللقاء يا بيلبو.','close']]};
 }
 if(id==='sam'){
  if(s.stage===1)return {text:'أرسلك بيلبو؟ ممتاز! نحتاج ثلاث تفّاحات من البستان خلفي. اتبع الطريق الصغير إلى الأشجار الحمراء، ثم ارجع إليّ.',options:[['أساعد في جمع التفّاح (اختياري).','basket'],['أكمل الحكاية إلى حفلة بيلبو.','skip-apples'],['كيف أصل إلى البستان؟','sam-lore'],['سأعود قريبًا.','close']]};
  if(s.stage===3)return {text:'تفّاح ممتاز! سأجهّز السلال وألحق بكم. أخبر بيلبو أنّ كل شيء صار جاهزًا. شكرًا على مساعدتك.',options:[['سأوصل له الخبر.','thank-sam'],['لحظة، أريد أن أسألك.','sam-lore']]};
  return {text:s.stage===2?`يمكنك جمع التفّاح من البستان إذا أحببت، لكنه نشاط جانبي وليس من أحداث القصة. جمعت ${s.apples.length} من ثلاث تفّاحات.`:'أهلًا! أحب هذه الساعة؛ الحديقة هادئة والهواء لطيف. هل زرت بيلبو عند الباب الأخضر؟',options:s.stage===2?[['أريد متابعة حفلة بيلبو الآن.','skip-apples'],['سأكمل التفّاح.','close'],['أين البستان؟','sam-lore']]:[['احكِ لي عن الحديقة.','sam-lore'],['إلى اللقاء يا سام.','close']]};
 }
 if(id==='frodo'){if(s.partyCompleted)return {text:'انتهت ليلة عيد ميلاد بيلبو، لكنه مضى في طريقه تاركًا كتبه وبيته وخاتمًا غريبًا. أحتاج إلى هدوء قليل وإلى نصيحة غاندالف قبل أن أعرف معنى ما حدث.',options:[['ستجدني بالقرب من البيت.','close'],['حدّثني عن بيلبو.','frodo-lore']]};return {text:'صباح الخير! أساعد عمي بيلبو في التجهيز للاحتفال، وأترقّب قصص غاندالف عن السفر. هل تعرف الطريق إلى الشجرة الكبيرة؟',options:[['احكِ لي عن الاحتفال.','frodo-lore'],['سأستكشف القرية.','close']]};}
 if(id==='gandalf'&&s.stage===0&&!s.gandalfMet)return {text:'أعود دائمًا إلى هذه التلال بسرور. شاهدت فرودو في الطريق، وسمعت أن بيلبو يستعد لليلة لا تُنسى. اذهب إليه بعد أن تلقي التحية؛ فمساعدته ستجعل الفرح يعم القرية.',options:[['أهلًا بعودتك، سأقابل بيلبو.','greet-wizard'],['احكِ لي عن الدروب.','gandalf-lore']]};
 if(s.partyCompleted)return {text:'كان بيلبو يحمل شوقًا إلى الطرق البعيدة. رحل بعد الاحتفال، وترك فرودو أمام أسئلة تستحق بعض الوقت. الرفق به الآن أهم من أي مغامرة سريعة.',options:[['سأتحدّث مع فرودو.','close'],['كيف تبدأ الرحلات؟','gandalf-lore']]};
 return {text:'القرية تستعد للغناء والأنوار. ما أجمل أن يلتقي أهل الشاير قبل أن تقودهم الطرق إلى حكايات أكبر.',options:[['إلى أين تقود الطرق؟','gandalf-lore'],['إلى اللقاء.','close']]};
}
export const LORE={
 'bilbo-lore':'هنا بيوت صغيرة وحدائق يعتني بها أصحابها. خلف كل باب حكاية، وعلى كل طريق فرصة للقاء جار. اليوم نأخذ استراحة للاحتفال بالصداقة.',
 'sam-lore':'أعتني بالزهور والخضار هنا. البستان وراء السياج الخشبي إلى الغرب؛ التفّاح المطلوب يلمع قرب الأرض. اقترب واضغط زر التفاعل.',
 'gandalf-lore':'من هذه التلال تتفرّع دروب نحو الأنهار والغابات، ومن هناك إلى بلدة بري. أمّا اليوم فينبغي أن نعيش فرحة الاحتفال قبل أن يحين وقت السفر.',
 'frodo-lore':'نحضّر لقاءً تحت الشجرة الكبيرة. عمّي بيلبو يهتم بالضيوف وسام بالحديقة، وغاندالف يجلب المفاجآت. لا أعرف بعد كيف سيكون هذا اليوم.'
};
