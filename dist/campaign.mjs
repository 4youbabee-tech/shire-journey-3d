
export const CAMPAIGN_REGIONS=Object.freeze([
 {id:'shire',name:'الشاير',biome:'green-hills',palette:'summer-green'},
 {id:'buckland',name:'باكلبري',biome:'river-hobbit-village',palette:'woodland-green'},
 {id:'bree',name:'بري',biome:'human-town',palette:'timber-amber'},
 {id:'weathertop',name:'قمة الطقس',biome:'windy-highlands',palette:'cold-stone'},
 {id:'rivendell',name:'ريفنديل',biome:'elven-valley',palette:'silver-water'},
 {id:'caradhras',name:'كارادراس',biome:'snow-mountain',palette:'snow-blue'},
 {id:'moria',name:'موريا',biome:'underground-dwarf-city',palette:'granite-ember'},
 {id:'lothlorien',name:'لورين',biome:'golden-forest',palette:'gold-leaf'},
 {id:'anduin',name:'الأندوين',biome:'great-river',palette:'river-teal'},
 {id:'amon-hen',name:'أمون هن',biome:'lake-shore-ruins',palette:'pine-stone'},
 {id:'rohan',name:'روهان',biome:'open-grassland',palette:'meadow-gold'},
 {id:'fangorn',name:'غابة فانغورن',biome:'ancient-forest',palette:'deep-moss'},
 {id:'edoras',name:'إيدوراس',biome:'hilltop-kingdom',palette:'timber-gold'},
 {id:'helms-deep',name:'هورنبرغ',biome:'mountain-fortress',palette:'dark-stone'},
 {id:'emyn-muil',name:'إمين مويل',biome:'rocky-wilderness',palette:'weathered-slate'},
 {id:'dead-marshes',name:'المستنقعات الميتة',biome:'mist-marsh',palette:'cold-olive'},
 {id:'ithilien',name:'إيثيليان',biome:'green-woodland',palette:'fern-green'},
 {id:'isengard',name:'إيزنغارد',biome:'industrial-fortress',palette:'iron-ash'},
 {id:'minas-tirith',name:'ميناس تيريث',biome:'white-stone-city',palette:'white-marble'},
 {id:'dunharrow',name:'دونهارو',biome:'mountain-refuge',palette:'heather-grey'},
 {id:'paths-of-dead',name:'دروب الموتى',biome:'haunted-mountain-pass',palette:'spectral-blue'},
 {id:'pelennor',name:'حقول بيلينور',biome:'war-plains',palette:'battle-earth'},
 {id:'cirith-ungol',name:'سيريث أونغول',biome:'dark-mountain-pass',palette:'black-stone'},
 {id:'mordor',name:'موردور',biome:'volcanic-wasteland',palette:'ash-red'},
 {id:'mount-doom',name:'جبل الهلاك',biome:'volcanic-crater',palette:'lava-ember'},
 {id:'grey-havens',name:'المرافئ الرمادية',biome:'western-coast',palette:'sea-silver'}
].map(Object.freeze));
export const CAMPAIGN_CHAPTERS=Object.freeze([
 {id:'F1-01',film:'Fellowship',title:'مقدمة والخاتم',lane:'shire',regions:['shire'],focus:['Bilbo','Frodo','Gandalf'],beat:'وصول غاندالف، حفلة بيلبو، انتقال الخاتم إلى فرودو',safeWindow:'القرية والتحضيرات والاحتفال',outcome:'بيلبو يرحل والخاتم يصبح مع فرودو',next:['F1-02'],partyRoster:['bilbo','frodo','sam','gandalf'],worldStateVariant:'shire-birthday',evidence:'SCRIPT-VERIFIED'},
 {id:'F1-02',film:'Fellowship',title:'ظل الماضي',lane:'ring-bearer',regions:['shire'],focus:['Frodo','Gandalf','Sam'],beat:'غاندالف يؤكد خطر الخاتم وصلته بسورون',safeWindow:'التحقيق والتجهيز والمغادرة خلسة',outcome:'فرودو يغادر الشاير',next:['F1-03'],partyRoster:['frodo','gandalf','sam'],worldStateVariant:'shire-after-birthday',evidence:'SCRIPT-VERIFIED'},
 {id:'F1-03',film:'Fellowship',title:'الطريق إلى بري',lane:'ring-bearer',regions:['shire','buckland'],focus:['Frodo','Sam','Merry','Pippin'],beat:'الفرسان السود يطاردون الهوبيت ويلتقي الرفاق',safeWindow:'التخفي والطريق والعبّارة',outcome:'الهوبيت يصلون إلى بري',next:['F1-04'],partyRoster:['frodo','sam','merry','pippin'],worldStateVariant:'shire-road',evidence:'SCRIPT-VERIFIED'},
 {id:'F1-04',film:'Fellowship',title:'بري وقمة الطقس',lane:'ring-bearer',regions:['bree','weathertop'],focus:['Hobbits','Aragorn','Nazgul'],beat:'أراغورن يصبح دليلهم ويصاب فرودو',safeWindow:'النزل والسفر والتخييم والدفاع',outcome:'الرفاق يسرعون نحو ريفنديل',next:['F1-05'],partyRoster:['frodo','sam','merry','pippin','aragorn'],worldStateVariant:'bree-night',evidence:'SCRIPT-VERIFIED'},
 {id:'F1-05',film:'Fellowship',title:'ريفنديل وتكوين الرفقة',lane:'fellowship',regions:['rivendell'],focus:['Frodo','Council','Fellowship'],beat:'المجلس يقرر تدمير الخاتم وتتكون الرفقة',safeWindow:'الاستكشاف والمعرفة وتجهيز الرحلة',outcome:'تسعة يخرجون من ريفنديل',next:['F1-06'],partyRoster:['frodo','sam','merry','pippin','aragorn','gandalf','legolas','gimli','boromir'],worldStateVariant:'rivendell-council',evidence:'SCRIPT-VERIFIED'},
 {id:'F1-06',film:'Fellowship',title:'كارادراس وموريا',lane:'fellowship',regions:['caradhras','moria'],focus:['Fellowship'],beat:'يفشل طريق الجبل وتكشف موريا مصير بالين ويهاجم البالروغ',safeWindow:'البقاء والألغاز والقتال والهروب',outcome:'يسقط غاندالف وتنجو الرفقة',next:['F1-07'],partyRoster:['frodo','sam','merry','pippin','aragorn','legolas','gimli','boromir'],worldStateVariant:'moria-fall',evidence:'SCRIPT-VERIFIED'},
 {id:'F1-07',film:'Fellowship',title:'لورين والأندوين',lane:'fellowship',regions:['lothlorien','anduin'],focus:['Fellowship','Galadriel'],beat:'الراحة والهدايا ورحلة النهر وتصدع الرفقة',safeWindow:'الاستكشاف الهادئ والتجهيز والقوارب',outcome:'تصل الرفقة إلى أمون هن',next:['F1-08'],partyRoster:['frodo','sam','merry','pippin','aragorn','legolas','gimli','boromir'],worldStateVariant:'lothlorien-anduin',evidence:'SCRIPT-VERIFIED'},
 {id:'F1-08',film:'Fellowship',title:'انقسام الرفقة',lane:'fellowship',regions:['amon-hen'],focus:['Frodo','Sam','Aragorn','Boromir','Uruk-hai'],beat:'يموت بورومير ويؤسر ميري وبيبين ويختار فرودو موردور',safeWindow:'القتال والمطاردة وتسليم المسارات',outcome:'تبدأ ثلاثة مسارات متوازية',next:['F2-01','F2-06'],partyRoster:['frodo','sam','aragorn','boromir','merry','pippin'],worldStateVariant:'amon-hen-breaking',evidence:'SCRIPT-VERIFIED'},
 {id:'F2-01',film:'Two Towers',title:'الصيادون الثلاثة والأسرى',lane:'rohan',regions:['rohan','fangorn'],focus:['Aragorn','Legolas','Gimli','Merry','Pippin'],beat:'يطارد الصيادون الأورك ويهرب الهوبيت إلى فانغورن',safeWindow:'التعقب والتحمل وقراءة الآثار',outcome:'تتقارب المسارات عند فانغورن وروهان',next:['F2-02'],partyRoster:['aragorn','legolas','gimli','merry','pippin'],worldStateVariant:'rohan-pursuit',evidence:'SCRIPT-VERIFIED'},
 {id:'F2-02',film:'Two Towers',title:'فانغورن وعودة غاندالف',lane:'rohan',regions:['fangorn'],focus:['Merry','Pippin','Treebeard','Hunters','Gandalf'],beat:'يظهر الإنت ويعود غاندالف',safeWindow:'الاستكشاف والحوار والتنقل مع الإنت',outcome:'يقود غاندالف الصيادين إلى إيدوراس',next:['F2-03'],partyRoster:['aragorn','legolas','gimli','merry','pippin','gandalf'],worldStateVariant:'fangorn-awakening',evidence:'SCRIPT-VERIFIED'},
 {id:'F2-03',film:'Two Towers',title:'إيدوراس',lane:'rohan',regions:['edoras'],focus:['Theoden','Eowyn','Eomer','Gandalf','Aragorn'],beat:'يستعيد ثيودن عافيته وتتضح الأزمة',safeWindow:'القصر والإسطبلات والمعدات والعلاقات',outcome:'تنسحب روهان نحو هورنبرغ',next:['F2-04'],partyRoster:['theoden','eowyn','eomer','gandalf','aragorn','legolas','gimli'],worldStateVariant:'edoras-restored',evidence:'SCRIPT-VERIFIED'},
 {id:'F2-04',film:'Two Towers',title:'الطريق والاستعداد لهورنبرغ',lane:'rohan',regions:['rohan','helms-deep'],focus:['Rohan party'],beat:'اللاجئون يتحركون تحت التهديد وتجهز الدفاعات',safeWindow:'المرافقة والإنقاذ وتجهيز الأسوار',outcome:'يصل جيش الأورك',next:['F2-05'],partyRoster:['aragorn','legolas','gimli','theoden','eowyn','merry'],worldStateVariant:'helms-deep-prep',evidence:'SCRIPT-VERIFIED'},
 {id:'F2-05',film:'Two Towers',title:'معركة هورنبرغ',lane:'rohan',regions:['helms-deep'],focus:['Aragorn','Legolas','Gimli','Theoden'],beat:'يتصاعد الحصار من الأسوار إلى القلعة ثم هجوم الفجر',safeWindow:'مراحل الدفاع والاختراق والانسحاب والهجوم',outcome:'تنجو روهان',next:['F2-08'],partyRoster:['aragorn','legolas','gimli','theoden'],worldStateVariant:'helms-deep-battle',evidence:'SCRIPT-VERIFIED'},
 {id:'F2-06',film:'Two Towers',title:'فرودو وسام وغولوم',lane:'ring-bearer',regions:['emyn-muil','dead-marshes'],focus:['Frodo','Sam','Gollum'],beat:'يصبح غولوم دليلًا ويزداد ضغط الخاتم',safeWindow:'التنقل والملاحة والثقة والبقاء',outcome:'الاقتراب من البوابة السوداء',next:['F2-07'],partyRoster:['frodo','sam','gollum'],worldStateVariant:'dead-marshes',evidence:'SCRIPT-VERIFIED'},
 {id:'F2-07',film:'Two Towers',title:'إيثيليان وفارامير',lane:'ring-bearer',regions:['ithilien'],focus:['Frodo','Sam','Gollum','Faramir'],beat:'يقبض الحراس على المجموعة ويختبر خطر الخاتم',safeWindow:'التخفي والاستطلاع والحوار',outcome:'يواصل فرودو طريقه نحو موردور',next:['F3-01'],requires:['F2-08'],partyRoster:['frodo','sam','gollum','faramir'],worldStateVariant:'ithilien-rangers',evidence:'SCRIPT-VERIFIED'},
 {id:'F2-08',film:'Two Towers',title:'الإنت وإيزنغارد',lane:'rohan',regions:['fangorn','isengard'],focus:['Merry','Pippin','Treebeard'],beat:'يقرر الإنت الهجوم على إيزنغارد',safeWindow:'تدمير البيئة والتنقل مع المخلوقات الكبيرة',outcome:'تتحطم آلة سارومان الحربية',next:['F3-01'],requires:['F2-05'],partyRoster:['merry','pippin','treebeard'],worldStateVariant:'isengard-flooded',evidence:'SCRIPT-VERIFIED'},
 {id:'F3-01',film:'Return of the King',title:'ما بعد إيزنغارد والبالانتير',lane:'gondor',regions:['isengard','rohan'],focus:['Fellowship allies','Pippin','Gandalf'],beat:'تجتمع المسارات ويكشف البالانتير الخطر',safeWindow:'الاستكشاف والتفاعل والانتقال',outcome:'يرحل غاندالف مع بيبين إلى غوندور',next:['F3-02'],requires:['F2-07','F2-08'],partyRoster:['gandalf','pippin','aragorn','legolas','gimli'],worldStateVariant:'isengard-aftermath',evidence:'FILM-CANON/MASTER-SUMMARY'},
 {id:'F3-02',film:'Return of the King',title:'ميناس تيريث والحشد',lane:'gondor',regions:['minas-tirith','rohan'],focus:['Gandalf','Pippin','Theoden','Eowyn','Merry'],beat:'تستعد غوندور وتستدعي المنارات نجدة روهان',safeWindow:'المدينة والحراسة والمنارات والحشد',outcome:'تتحرك الجيوش إلى الحرب',next:['F3-03'],partyRoster:['gandalf','pippin','theoden','eowyn','merry'],worldStateVariant:'minas-tirith-muster',evidence:'FILM-CANON/MASTER-SUMMARY'},
 {id:'F3-03',film:'Return of the King',title:'دروب الموتى',lane:'gondor',regions:['dunharrow','paths-of-dead'],focus:['Aragorn','Legolas','Gimli'],beat:'يطالب أراغورن بحق الطريق الملكي ويطلب الموتى',safeWindow:'عبور الرعب ومواجهة القسم والألغاز',outcome:'يحصل أراغورن على قوة حاسمة',next:['F3-04'],partyRoster:['aragorn','legolas','gimli'],worldStateVariant:'paths-of-dead',evidence:'FILM-CANON/MASTER-SUMMARY'},
 {id:'F3-04',film:'Return of the King',title:'الحصار وحقول بيلينور',lane:'gondor',regions:['minas-tirith','pelennor'],focus:['Gondor','Rohan','Mordor armies'],beat:'يبلغ الحصار ذروته في معركة الحقول',safeWindow:'دعم الحصار ومراحل الفرسان والإنقاذ',outcome:'ينهزم جيش موردور محليًا بكلفة كبيرة',next:['F3-05'],partyRoster:['gandalf','aragorn','legolas','gimli','eowyn','merry'],worldStateVariant:'pelennor-aftermath',evidence:'FILM-CANON/MASTER-SUMMARY'},
 {id:'F3-05',film:'Return of the King',title:'سيريث أونغول وموردور',lane:'ring-bearer',regions:['cirith-ungol','mordor'],focus:['Frodo','Sam','Gollum'],beat:'أزمة شيلوب وإنقاذ البرج والتنكر والمسير الأخير',safeWindow:'التخفي والإنقاذ والبقاء',outcome:'يصل حاملا الخاتم إلى جبل الهلاك',next:['F3-06'],partyRoster:['frodo','sam','gollum'],worldStateVariant:'mordor-march',evidence:'FILM-CANON/MASTER-SUMMARY'},
 {id:'F3-06',film:'Return of the King',title:'البوابة السوداء وجبل الهلاك',lane:'finale',regions:['mordor','mount-doom'],focus:['All major threads'],beat:'يشغل الحلفاء سورون ويصل الخاتم إلى أزمته الأخيرة ويدمر',safeWindow:'المواجهة المتوازية والعبور الأخير',outcome:'يسقط سورون',next:['F3-07'],partyRoster:['frodo','sam','aragorn','gandalf','legolas','gimli','eowyn','merry','pippin'],worldStateVariant:'mordor-finale',evidence:'FILM-CANON/MASTER-SUMMARY'},
 {id:'F3-07',film:'Return of the King',title:'العودة والوداع',lane:'epilogue',regions:['minas-tirith','shire','grey-havens'],focus:['Survivors'],beat:'التتويج والعودة والرحيل الأخير',safeWindow:'استكشاف ما بعد الحرب وحوارات الوداع',outcome:'تكتمل الحملة',next:[],partyRoster:['frodo','sam','aragorn','gandalf','legolas','gimli','merry','pippin'],worldStateVariant:'middle-earth-peace',evidence:'FILM-CANON/MASTER-SUMMARY'}
].map(chapter=>Object.freeze({...chapter,regions:Object.freeze(chapter.regions),focus:Object.freeze(chapter.focus),next:Object.freeze(chapter.next),requires:Object.freeze(chapter.requires||[]),partyRoster:Object.freeze(chapter.partyRoster)})));
export const CHAPTER_BY_ID=Object.freeze(Object.fromEntries(CAMPAIGN_CHAPTERS.map(chapter=>[chapter.id,chapter])));
export function getChapter(id){return CHAPTER_BY_ID[id]||null;}
export function isKnownChapter(id){return Object.prototype.hasOwnProperty.call(CHAPTER_BY_ID,id);}
export function canAdvanceChapter(state,nextId){
 const current=getChapter(state?.storyChapterId),next=getChapter(nextId);
 if(!current||!next||!current.next.includes(nextId))return false;
 if(current.id==='F1-01'&&!state.canonicalOutcomeFlags?.ringPassed)return false;
 if(current.id==='F1-02'&&!state.canonicalOutcomeFlags?.frodoDeparted)return false;
 if(next.requires.some(id=>state.chapterProgress?.[id]!=='complete'))return false;
 return true;
}
export function activateChapter(state,nextId){
 if(!canAdvanceChapter(state,nextId))return false;
 const current=getChapter(state.storyChapterId),next=getChapter(nextId);
 state.chapterProgress[current.id]='complete';state.chapterProgress[next.id]='active';
 state.storyChapterId=next.id;state.laneId=next.lane;state.worldStateVariant=next.worldStateVariant;
 state.partyRoster=[...next.partyRoster];return true;
}
export function createChapterProgress(active='F1-01'){
 const progress=Object.fromEntries(CAMPAIGN_CHAPTERS.map(chapter=>[chapter.id,'locked']));
 if(isKnownChapter(active))progress[active]='active';return progress;
}
