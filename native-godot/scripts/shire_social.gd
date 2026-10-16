class_name ShireSocial
extends RefCounted
## ORIGINAL-GAME offline social simulation. The canonical plot remains governed by main.gd.
const TOPICS := ["family", "harvest", "rumours", "friendship", "festival", "fears", "promise"]
const ROLE_WANTS := {"gardener":"a thriving garden", "baker":"a warm loaf for every neighbour", "farmer":"a peaceful harvest", "miller":"a steady mill wheel", "merchant":"a fair market", "weaver":"warm clothes for winter", "messenger":"a safe road", "carpenter":"a sound roof"}
const ROLE_AR := {"gardener":"حديقة مزدهرة", "baker":"خبز طازج للجيران", "farmer":"حصاد هادئ", "miller":"طاحونة تعمل جيداً", "merchant":"سوق عادلة", "weaver":"ثياب دافئة للشتاء", "messenger":"طريق آمن", "carpenter":"سقف يحمي العائلة"}
const MEM_LIMIT := 32
var bonds: Dictionary = {}
var journal: Array[Dictionary] = []
var events: Dictionary = {}
var discovered: Dictionary = {}
var favours: Dictionary = {}
var wisdom: int = 0

func ensure_person(id: String) -> Dictionary:
    if not bonds.has(id):
        bonds[id] = {"affinity": 50, "trust": 50, "respect": 50, "familiarity": 10, "last_day": -1, "encounters": 0, "memories": []}
    return bonds[id]

func tone(id: String, weather: String, hour: float, day: int) -> String:
    var b: Dictionary = ensure_person(id)
    if weather in ["heavy_rain", "storm"]: return "uneasy"
    if hour >= 21.0 or hour < 6.0: return "sleepy"
    if int(b["trust"]) >= 75: return "warm"
    if int(b["affinity"]) < 30: return "distant"
    if day > int(b["last_day"]) + 5 and int(b["encounters"]) > 0: return "wistful"
    return "content"

func meet(id: String, day: int) -> void:
    var b: Dictionary = ensure_person(id)
    if int(b["last_day"]) != day:
        b["encounters"] = int(b["encounters"]) + 1
        b["familiarity"] = mini(100, int(b["familiarity"]) + 2)
    b["last_day"] = day

func remember(id: String, topic: String, day: int, importance: int = 3) -> void:
    var b: Dictionary = ensure_person(id)
    var memories: Array = b["memories"]
    if not memories.is_empty() and str(memories.back().get("topic", "")) == topic and int(memories.back().get("day", -1)) == day: return
    memories.append({"topic": topic.substr(0, 35), "day": day, "importance": clampi(importance, 1, 100)})
    while memories.size() > MEM_LIMIT: memories.pop_front()

func recall(id: String, day: int) -> Dictionary:
    var memories: Array = ensure_person(id)["memories"]
    for i in range(memories.size() - 1, -1, -1):
        var m: Dictionary = memories[i]
        var age: int = maxi(0, day - int(m["day"]))
        var strength: int = int(m["importance"])
        if strength >= 100 or age <= (30 if strength >= 15 else 7 if strength >= 7 else 1 if strength >= 3 else 0): return m
    return {}

func relationship_change(id: String, attribute: String, amount: int) -> void:
    var b: Dictionary = ensure_person(id)
    if attribute in ["affinity", "trust", "respect", "familiarity"]:
        b[attribute] = clampi(int(b[attribute]) + amount, 0, 100)

func available(id: String, stage: int, hour: float) -> Array[String]:
    var options: Array[String] = ["greeting", "daily", "work", "memory", "friendship"]
    if hour >= 6.0 and hour < 21.0: options.append("favour")
    if stage >= 5: options.append("journey")
    return options

func option_label(topic: String) -> String:
    return {"greeting":"Greet them | ألقِ التحية", "daily":"Ask about the day | اسأل عن يومه", "work":"Ask about their work | اسأل عن عمله", "memory":"Remember earlier days | استرجع الذكريات", "friendship":"Share a kind word | كلمة طيبة", "favour":"Offer a small kindness | اعرض المساعدة", "journey":"Discuss the road | تحدّث عن الطريق"}.get(topic, topic)

func reply(npc: ShireNPC, topic: String, stage: int, day: int, hour: float, weather: String) -> Dictionary:
    var id: String = npc.profile_id
    var b: Dictionary = ensure_person(id)
    var mood: String = tone(id, weather, hour, day)
    var role: String = npc.job.to_lower()
    var desire: String = str(ROLE_WANTS.get(role, "the wellbeing of our neighbours"))
    var desire_ar: String = str(ROLE_AR.get(role, "راحة أهل القرية"))
    var en: String = ""
    var ar: String = ""
    var memory: Dictionary = recall(id, day)
    var who: String = npc.display_name
    match topic:
        "greeting":
            if mood == "warm":
                en = "Frodo! There you are. It's better here when friends remember to visit."
                ar = "فرودو! سعيد برؤيتك. تصبح القرية أجمل حين يزورنا الأصدقاء."
            elif mood == "distant":
                en = "Good day. We have not quite understood one another yet."
                ar = "نهارك سعيد. أظن أننا لم نفهم بعضنا جيداً بعد."
            elif mood == "sleepy":
                en = "The lamps have nearly burned down. We'd best talk at breakfast."
                ar = "الفوانيس توشك أن تنطفئ. لنتحدث وقت الفطور."
            elif mood == "uneasy":
                en = "That rain sounds fierce. Come out of the wind for a moment."
                ar = "المطر شديد اليوم. تعالَ بعيداً عن الرياح قليلاً."
            else:
                en = "Hullo, Frodo. The lanes are pleasant when one has company."
                ar = "أهلاً فرودو. تصبح الدروب أجمل برفقة الأصدقاء."
        "daily":
            if weather in ["storm", "heavy_rain", "light_rain"]:
                en = "The rain has changed my plans. Even a quiet Shire day has its surprises."
                ar = "غيّر المطر خططي اليوم. حتى الأيام الهادئة تحمل المفاجآت."
            elif hour < 11.0:
                en = "Up early, are you? The bread and fields won't see to themselves."
                ar = "استيقظت باكراً؟ الخبز والحقول بحاجة إلى من يعتني بها."
            else:
                en = "I've had a full day. There's comfort in an honest day's work."
                ar = "كان يوماً حافلاً. العمل الصادق يجلب راحة جميلة."
        "work":
            en = "As a %s, all I really hope for is %s. Small hopes matter." % [role, desire]
            ar = "في عملي، أتمنى %s. حتى الأمنيات الصغيرة مهمة." % desire_ar
        "memory":
            if memory.is_empty():
                en = "No grand adventures between us yet. Sometimes a cup of tea is enough."
                ar = "ليس لدينا مغامرات كبيرة بعد. أحياناً يكفي فنجان شاي."
            else:
                en = "I still remember when we spoke of %s, %d day(s) ago." % [str(memory["topic"]), maxi(0,day-int(memory["day"]))]
                ar = "ما زلت أتذكر حديثنا عن %s منذ %d يوم." % [str(memory["topic"]),maxi(0,day-int(memory["day"]))]
        "friendship":
            en = "That's a generous thought. A neighbour's kindness lasts longer than the day's sunshine."
            ar = "كلمات كريمة. تبقى طيبة الجار أطول من ضوء النهار."
            relationship_change(id, "affinity", 3)
            relationship_change(id, "trust", 1)
        "favour":
            if str(favours.get(id, "")) == "done":
                en = "You've already lent a hand. I haven't forgotten it."
                ar = "لقد ساعدتني من قبل، ولن أنسى ذلك."
            elif str(favours.get(id, "")) == "offered":
                favours[id] = "done"
                en = "There, that's one small worry lifted. Thank you for your time."
                ar = "هكذا زال هم صغير. أشكرك على وقتك."
                relationship_change(id, "trust", 6)
                relationship_change(id, "respect", 3)
                record("kindness_" + id, "Helped " + who, "ساعدت " + who, day)
            else:
                favours[id] = "offered"
                en = "Could you spare a moment to help with the day's work? Ask me again when you're ready."
                ar = "هل لديك وقت لتساعدني في عمل اليوم؟ اسألني مجدداً حين تصبح جاهزاً."
        "journey":
            if id == "sam" and stage >= 5:
                en = "Wherever that path leads, I'd rather you didn't walk it alone."
                ar = "أينما قادك الطريق، لا أحب أن تسلكه وحيداً."
            elif stage >= 5:
                en = "The roads have grown less familiar. Travel kindly, and take care."
                ar = "لم تعد الطرق مألوفة كما كانت. سافر بلطف واعتن بنفسك."
            else:
                en = "The old lanes have stories enough without setting out just yet."
                ar = "لدروبنا القديمة حكايات كثيرة قبل الرحيل."
        _:
            en = "Every season brings another small story."
            ar = "يحمل كل فصل حكاية صغيرة جديدة."
    meet(id, day)
    remember(id, topic, day, 7 if topic in ["friendship", "favour"] else 3)
    return {"speaker":who, "en":en, "ar":ar, "mood":mood}

func record(key: String, en: String, ar: String, day: int) -> bool:
    if discovered.has(key): return false
    discovered[key] = day
    journal.append({"id":key, "en":en.substr(0,180), "ar":ar.substr(0,180), "day":day})
    while journal.size() > 160: journal.pop_front()
    wisdom += 1
    return true

func pack() -> Dictionary:
    return {"bonds":bonds.duplicate(true),"journal":journal.duplicate(true),"events":events.duplicate(true),"discovered":discovered.duplicate(true),"favours":favours.duplicate(true),"wisdom":wisdom}

func unpack(raw: Dictionary) -> void:
    bonds.clear()
    if raw.get("bonds") is Dictionary:
        for id in raw["bonds"].keys().slice(0,80):
            if not raw["bonds"][id] is Dictionary: continue
            var b: Dictionary = raw["bonds"][id]
            var safe: Dictionary = ensure_person(str(id))
            for metric in ["affinity", "trust", "respect", "familiarity"]:
                safe[metric] = clampi(int(b.get(metric, 50)),0,100)
            safe["encounters"] = clampi(int(b.get("encounters",0)),0,10000)
            safe["last_day"] = clampi(int(b.get("last_day",-1)),-1,100000)
            safe["memories"] = []
            if b.get("memories") is Array:
                for entry in b["memories"].slice(-MEM_LIMIT):
                    if entry is Dictionary and entry.has("topic") and entry.has("day"):
                        safe["memories"].append({"topic":str(entry["topic"]).substr(0,35),"day":clampi(int(entry["day"]),0,100000),"importance":clampi(int(entry.get("importance",3)),1,100)})
    journal.clear()
    if raw.get("journal") is Array:
        for entry in raw["journal"].slice(-160):
            if entry is Dictionary and entry.has("id"):
                journal.append({"id":str(entry["id"]).substr(0,70),"en":str(entry.get("en","")).substr(0,180),"ar":str(entry.get("ar","")).substr(0,180),"day":clampi(int(entry.get("day",0)),0,100000)})
    discovered.clear()
    events.clear()
    favours.clear()
    for pair in [["discovered",discovered],["events",events],["favours",favours]]:
        if raw.get(pair[0]) is Dictionary:
            for id in raw[pair[0]].keys().slice(0,200): pair[1][str(id).substr(0,70)] = raw[pair[0]][id]
    wisdom = clampi(int(raw.get("wisdom",0)),0,10000)