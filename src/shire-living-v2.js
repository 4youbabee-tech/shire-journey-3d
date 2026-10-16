/* Shire Journey 3D — Living World v2.0
 * EN: offline deterministic clock/weather, real NPC shelter and persistent memory.
 * AR: زمن وطقس وحياة سكان وذاكرة محفوظة؛ دون تعديل تسلسل القصة.
 */
(function(root,build){
  'use strict';
  const api=build();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.ShireLivingV2=api;
  if(typeof document!=='undefined'&&typeof window!=='undefined'){
    let attempts=0;
    const handle=setInterval(function(){
      if(root.__SHIRE__&&!root.__SHIRE_LIVING_V2_ATTACHED__){
        try{api.attach(root,document);root.__SHIRE_LIVING_V2_ATTACHED__=true;}
        catch(e){root.__SHIRE_LIVING_V2_ERROR__=String(e);console.error(e);}
        clearInterval(handle);
      }else if(++attempts>=160)clearInterval(handle);
    },125);
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MONTHS=['Afteryule','Solmath','Rethe','Astron','Thrimidge','Forelithe','Afterlithe','Wedmath','Halimath','Winterfilth','Blotmath','Foreyule'];
  const WEEKDAYS=['Sterday','Sunday','Monday','Trewsday','Hevensday','Mersday','Highday'];
  const TYPES=['clear','cloudy','overcast','light_rain','heavy_rain','storm','fog','mist'];
  const AR=['صافٍ','غائم جزئياً','غائم','مطر خفيف','مطر غزير','عاصفة','ضباب','ضباب خفيف'];
  const TOPICS={story_news:['the local news','الأخبار المحلية'],story_road:['the road ahead','الطريق أمامنا'],story_help:['helping a neighbour','مساعدة أحد الجيران'],story_memory:['our conversation','حديثنا']};
  const DAY_SECONDS=1440;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const ease=x=>{const t=clamp(x,0,1);return t*t*(3-2*t);};
  const rand=n=>{const x=Math.sin(n*127.1+78.233)*43758.5453;return x-Math.floor(x);};
  const dayIndex=seconds=>Math.floor(Math.max(0,Number(seconds)||0)/DAY_SECONDS);
  function clock(seconds){
    const t=Math.max(0,Number(seconds)||0),ordinal=8*30+21+dayIndex(t);
    const within=ordinal%360,month=Math.floor(within/30),hour=(6+t/60)%24;
    return {year:3018+Math.floor(ordinal/360),day:within%30+1,month:month+1,
      monthName:MONTHS[month],weekday:WEEKDAYS[(dayIndex(t)+1)%7],
      hour:Math.floor(hour),minute:Math.floor((hour%1)*60),dayIndex:dayIndex(t),
      phase:hour>=5&&hour<7?'dawn':hour>=7&&hour<11?'morning':
        hour>=11&&hour<14?'noon':hour>=14&&hour<18?'afternoon':
        hour>=18&&hour<20?'dusk':'night'};
  }
  function nightLevel(seconds){
    const hour=(6+Math.max(0,Number(seconds)||0)/60)%24;
    if(hour>=5&&hour<7)return 1-ease((hour-5)/2);
    if(hour>=18&&hour<20)return ease((hour-18)/2);
    return hour>=20||hour<5?1:0;
  }
  function weatherAt(seconds,seed=3018){
    const t=Math.max(0,Number(seconds)||0),slot=Math.floor(t/300);
    const pick=i=>{const r=rand(i+seed*3.11);return r<.34?0:r<.48?1:r<.60?2:r<.76?3:r<.84?4:r<.88?5:r<.95?6:7;};
    const prev=pick(slot-1),next=pick(slot),blend=ease(t%300/180);
    const power=[0,.24,.4,.5,.82,1,.66,.3];
    const intensity=power[prev]*(1-blend)+power[next]*blend,type=TYPES[next];
    const loss=next===6?.7:next===7?.35:next===5?.45:next===4?.25:0;
    return {type,previous:TYPES[prev],blend,intensity,
      visibility:clamp(1-loss*blend,.28,1),wetness:/rain|storm/.test(type)?intensity:0,
      windSpeed:clamp(.15+intensity*(type==='storm'?.85:.38),0,1),
      shelter:blend>.4&&/rain|storm/.test(type),labelAr:AR[next]};
  }
  function newWorld(){return {version:2,weatherSeed:3018,memories:{},relationships:{}};}
  function restoreWorld(raw){
    const result=newWorld();
    if(!raw||typeof raw!=='object')return result;
    if(Number.isInteger(raw.weatherSeed))result.weatherSeed=raw.weatherSeed;
    const source=raw.memories&&typeof raw.memories==='object'?raw.memories:{};
    for(const name of Object.keys(source).slice(0,100)){
      if(!/^[\w '-]{1,48}$/.test(name)||!Array.isArray(source[name]))continue;
      result.memories[name]=source[name].slice(-32).filter(x=>x&&
        Object.prototype.hasOwnProperty.call(TOPICS,x.topic)&&Number.isFinite(x.dayIndex))
        .map(x=>({topic:x.topic,dayIndex:clamp(Math.floor(x.dayIndex),0,100000),
          importance:clamp(Number(x.importance)||1,1,100)}));
    }
    const rel=raw.relationships&&typeof raw.relationships==='object'?raw.relationships:{};
    for(const name of Object.keys(rel).slice(0,100)){
      if(!/^[\w '-]{1,48}$/.test(name))continue;
      result.relationships[name]={};
      for(const key of ['affinity','trust','respect','familiarity'])
        result.relationships[name][key]=clamp(Number(rel[name]?.[key])||50,0,100);
    }
    return result;
  }
  function remember(world,name,topic,seconds,importance=3){
    if(!/^[\w '-]{1,48}$/.test(name)||!Object.prototype.hasOwnProperty.call(TOPICS,topic))return false;
    const history=world.memories[name]||(world.memories[name]=[]),day=dayIndex(seconds);
    if(history.length&&history.at(-1).dayIndex===day&&history.at(-1).topic===topic)return false;
    history.push({topic,dayIndex:day,importance:clamp(importance,1,100)});
    if(history.length>32)history.splice(0,history.length-32);
    const rel=world.relationships[name]||(world.relationships[name]={affinity:50,trust:50,respect:50,familiarity:20});
    rel.familiarity=clamp(rel.familiarity+2,0,100);
    if(topic==='story_help')rel.trust=clamp(rel.trust+3,0,100);
    if(topic==='story_memory')rel.affinity=clamp(rel.affinity+1,0,100);
    return true;
  }
  function recall(world,name,seconds,excluding){
    const day=dayIndex(seconds);
    const matches=(world.memories[name]||[]).filter(m=>m.topic!==excluding&&m.dayIndex<=day&&
      (m.importance===100||day-m.dayIndex<=(m.importance>=15?30:m.importance>=7?7:m.importance>=3?1:0)));
    return matches.at(-1)||null;
  }
  function attach(root,doc){
    const game=root.__SHIRE__,engine=game?.renderer;
    if(!game?.state||!engine)throw Error('Base Shire game not initialized');
    game.state.livingWorld=restoreWorld(game.state.livingWorld);
    if(typeof root.freshState==='function'){
      const fn=root.freshState;
      root.freshState=function(){const s=fn();s.livingWorld=newWorld();return s;};
    }
    if(typeof root.validateSave==='function'){
      const fn=root.validateSave;
      root.validateSave=function(raw){const s=fn(raw);s.livingWorld=restoreWorld(raw?.livingWorld);return s;};
    }
    if(typeof root.loadState==='function'){
      const fn=root.loadState;
      root.loadState=function(s){s.livingWorld=restoreWorld(s.livingWorld);return fn(s);};
    }
    // Weather changes fog and scene brightness INSIDE original GPU render pass.
    const oldDraw=engine.render.bind(engine);
    engine.render=function(meshes,t,indoor){
      const s=game.state,w=weatherAt(s.played,s.livingWorld?.weatherSeed);
      if(!indoor&&s.zone==='outside'){
        const dim=w.intensity*(/rain|storm|overcast/.test(w.type)?.23:.08);
        this.night=clamp(this.night+dim,0,1);
        if(Array.isArray(this.fog)){
          const tone=/fog|mist/.test(w.type)?[.66,.67,.63]:[.48,.52,.55];
          const f=clamp((1-w.visibility)*.8+dim*.2,0,.8);
          this.fog=this.fog.map((v,i)=>v*(1-f)+tone[i]*f);
        }
      }
      return oldDraw(meshes,t,indoor);
    };
    if(typeof root.ambientNightLevel==='function')
      root.ambientNightLevel=function(){return nightLevel(game.state.played);};
    if(typeof root.livingPeriod==='function')
      root.livingPeriod=function(sec){const p=clock(sec).phase;return p==='dusk'?'evening':p==='noon'||p==='afternoon'?'day':p;};
    // Actual AI pathing shifts towards a villager's house under heavy rain.
    if(typeof root.villageRoutine==='function'&&typeof root.approach==='function'){
      const fn=root.villageRoutine;
      root.villageRoutine=function(npc,dt){
        const s=game.state,w=weatherAt(s.played,s.livingWorld?.weatherSeed);
        if(s.zone==='outside'&&w.shelter&&Array.isArray(npc.home)&&npc.home.length===3){
          const home=npc.home;
          if(Math.hypot(npc.pos[0]-home[0],npc.pos[2]-home[2])>1.1)
            root.approach(npc,home,dt,.8);
          else{npc.activity='sheltering';npc.moving=0;}
          return true;
        }
        return fn(npc,dt);
      };
    }
    // Authored English / Arabic dialogue now recalls previous actual choices.
    if(typeof root.selectNPCStoryTopic==='function'){
      const fn=root.selectNPCStoryTopic;
      root.selectNPCStoryTopic=function(topic){
        const npc=game.dialogueNPC||null,s=game.state;
        if(!npc||!Object.prototype.hasOwnProperty.call(TOPICS,topic))return fn(topic);
        const history=recall(s.livingWorld,npc.name,s.played,'story_memory');
        const result=fn(topic);
        if(result===false)return result;
        if(topic==='story_memory'&&history&&typeof LINES!=='undefined'&&LINES.npc_story_answer){
          const old=TOPICS[history.topic];
          if(old){
            const entry=LINES.npc_story_answer;
            entry.en='I remember you asking about '+old[0]+'. It has stayed with me.';
            entry.ar='أتذكر أنك سألتني عن '+old[1]+'. وما زلت أفكر في حديثنا.';
            const en=doc.querySelector('#dialogue .dialogue-en'),ar=doc.querySelector('#dialogue .dialogue-ar');
            if(en)en.textContent=entry.en;
            if(ar)ar.textContent=entry.ar;
          }
        }
        remember(s.livingWorld,npc.name,topic,s.played,topic==='story_help'?7:topic==='story_memory'?15:3);
        game.save();
        return result;
      };
    }
    const hud=doc.createElement('div');hud.id='shire-living-status';hud.setAttribute('role','status');
    hud.style.cssText='position:fixed;right:12px;top:12px;z-index:95;pointer-events:none;'+
      'padding:8px 12px;border:1px solid #a99568;border-radius:8px;'+
      'background:rgba(17,31,25,.82);color:#fff1c9;font:13px/1.5 Georgia,serif;'+
      'text-align:right;max-width:260px;box-shadow:0 3px 15px #0007';
    doc.body.appendChild(hud);
    let last=Date.now();
    const timer=root.setInterval(()=>{
      const now=Date.now(),dt=clamp((now-last)/1000,0,2);last=now;
      const s=game.state;if(!s)return;
      // The original game advances the clock in play. Keep it moving in dialogues.
      if(game.mode==='dialogue'||game.mode==='cinema')s.played+=dt;
      const c=clock(s.played),w=weatherAt(s.played,s.livingWorld?.weatherSeed);
      hud.style.display=game.mode==='menu'||!['outside','inside'].includes(s.zone)?'none':'';
      hud.textContent=c.weekday+' · '+c.day+' '+c.monthName+' '+c.year+' · '+
        String(c.hour).padStart(2,'0')+':'+String(c.minute).padStart(2,'0')+
        ' | '+w.type.replace(/_/g,' ')+' · '+w.labelAr;
    },250);
    root.__SHIRE_LIVING_V2__={clock:()=>clock(game.state.played),
      weather:()=>weatherAt(game.state.played,game.state.livingWorld.weatherSeed),
      memory:name=>(game.state.livingWorld.memories[name]||[]).slice(),
      stop:()=>{root.clearInterval(timer);hud.remove();}};
  }
  return {MONTHS,WEEKDAYS,TYPES,DAY_SECONDS,clock,nightLevel,weatherAt,
    newWorld,restoreWorld,remember,recall,attach};
});
