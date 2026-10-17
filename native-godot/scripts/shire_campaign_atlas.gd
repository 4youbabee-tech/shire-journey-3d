class_name ShireCampaignAtlas
extends RefCounted
## Author-written bilingual scene structure. This is not movie dialogue.
## CH_F1_01 is a playable Chapter I candidate; other scenes are screenplay only.
const SHIRE_FOCUS := [
    {"stage":0,"en":"The garden before the party: find Sam and learn whose home you are in.","ar":"الحديقة قبل الاحتفال: ابحث عن سام وتعرّف إلى الحياة في الشاير.","location":"Bag End / Garden","actor":"sam","tone":"warm"},
    {"stage":1,"en":"Follow lantern-lit lanes to the great Party Tree.","ar":"اتبع الممرات نحو شجرة الاحتفال الكبيرة.","location":"Party Field","actor":"frodo","tone":"curious"},
    {"stage":2,"en":"Help Rowan restock the busy market before the birthday feast.","ar":"ساعد روان في تجهيز السوق قبل وليمة عيد الميلاد.","location":"Hobbiton Market","actor":"rowan","tone":"lively"},
    {"stage":3,"en":"A grey-cloaked visitor brings questions no feast can answer.","ar":"ضيف يرتدي الرمادي يحمل أسئلة لا تجيب عنها الولائم.","location":"Village Lane","actor":"gandalf","tone":"uneasy"},
    {"stage":4,"en":"Return home; Bilbo wishes to speak privately before the night ends.","ar":"عد إلى البيت؛ يريد بيلبو حديثًا خاصًا قبل نهاية الليلة.","location":"Bag End","actor":"bilbo","tone":"wistful"},
    {"stage":5,"en":"Seventeen years later, ordinary errands conceal serious preparations.","ar":"بعد سبعة عشر عامًا، تخفي المهام اليومية استعدادات خطيرة.","location":"Market / Bag End","actor":"rowan","tone":"tense"},
    {"stage":6,"en":"Ask Sam to travel with you, even without answers about the road.","ar":"اطلب من سام أن يرافقك، رغم الغموض الذي ينتظر على الطريق.","location":"Sam's Garden","actor":"sam","tone":"loyal"},
    {"stage":7,"en":"Leave familiar paths without alarming the neighbours.","ar":"غادر الممرات المألوفة من دون إثارة قلق الجيران.","location":"Northern Lane","actor":"frodo","tone":"quiet"},
    {"stage":8,"en":"Hobbiton is behind you. Chapter II awaits production and testing.","ar":"أصبحت هوبيتون خلفك. الفصل الثاني لم يُنتَج بعد.","location":"North Road","actor":"sam","tone":"resolute"}
]
## Each future chapter has an original dramatic setup, middle task and exit beat.
## Future beats are production screenplay, not reachable or implemented gameplay.
const CHAPTER_SCENES := [
 {"id":"CH_F1_01","title":"The Shire","state":"playable_candidate","beats":[
   ["Birthday morning","Meet Sam among vegetable beds","التقِ سام بين أحواض الخضار"],
   ["Lanterns and guests","Trade stories while helping set the feast","تبادل الحكايات وساعد في تجهيز الوليمة"],
   ["Quiet departure","Leave the northern lane with Sam","غادر الطريق الشمالي مع سام"]]},
 {"id":"CH_F1_02","title":"Bree","state":"script_only","beats":[
   ["Rain at the gate","Find safe passage into the walled village","ادخل القرية المحاطة بالسور تحت المطر"],
   ["Whispers in the inn","Distinguish helpful warnings from careless gossip","فرّق بين النصيحة والشائعات في النزل"],
   ["A guarded exit","Leave before the watchers close the roads","غادر قبل أن يُحكم المراقبون السيطرة على الطرق"]]},
 {"id":"CH_F1_03","title":"Weathertop","state":"script_only","beats":[
   ["The empty watchtower","Scout the broken heights for a defensible camp","استكشف المرتفعات المهدّمة بحثًا عن مخيم آمن"],
   ["Night under threat","Keep companions together as dread approaches","أبقِ الرفاق مجتمعين مع اقتراب الخطر"],
   ["Race toward refuge","Aid the wounded and choose the safer descent","ساعد الجريح واختر النزول الأكثر أمانًا"]]},
 {"id":"CH_F1_04","title":"Rivendell","state":"script_only","beats":[
   ["Valley sanctuary","Recover as waterfalls mask the sounds of the road","استرح في وادٍ تخفي شلالاته ضجيج الطريق"],
   ["Uncomfortable counsel","Listen before accepting the burden ahead","استمع جيدًا قبل قبول المسؤولية القادمة"],
   ["Fellowship forms","Prepare equipment and depart with a new company","جهّز العتاد وانطلق مع رفقة جديدة"]]},
 {"id":"CH_F1_05","title":"Moria","state":"script_only","beats":[
   ["A sealed entrance","Read carvings and search for an opening","اقرأ النقوش وابحث عن مدخل"],
   ["Beneath the mountain","Navigate old halls by sound and torchlight","اعبر القاعات القديمة على ضوء المشاعل"],
   ["Flight from the deep","Protect the company during a desperate escape","احمِ الرفاق خلال هروب يائس"]]},
 {"id":"CH_F1_06","title":"Lothlorien","state":"script_only","beats":[
   ["Guarded woodland","Win permission to cross the high forest paths","احصل على إذن لعبور طرق الغابة المرتفعة"],
   ["Grief and renewal","Let each companion reflect on the road lost","دع كل رفيق يستعيد ما فقده على الطريق"],
   ["The river calls","Receive supplies and board the river craft","تسلّم المؤن واصعد إلى القوارب"]]},
 {"id":"CH_F1_07","title":"Amon Hen","state":"script_only","beats":[
   ["Two banks of a river","Find trails before the group must choose a direction","ابحث عن دروب قبل اضطرار الرفقة لاتخاذ قرار"],
   ["A fracture of trust","Discover how fear can divide well-meaning friends","اكتشف كيف يفرّق الخوف بين الأصدقاء"],
   ["Scattered paths","Choose whom to protect as the company separates","اختر من تحمي عندما تتفرق المجموعة"]]},
 {"id":"CH_F2_01","title":"Rohan","state":"script_only","beats":[
   ["Riders on open plains","Cross wind-beaten fields and earn local trust","اعبر السهول واكسب ثقة السكان"],
   ["The uneasy hall","Trace the source of despair in a royal court","ابحث عن مصدر اليأس في البلاط الملكي"],
   ["Mustering hope","Help the horse people prepare a long ride","ساعد الفرسان على الاستعداد لرحلة طويلة"]]},
 {"id":"CH_F2_02","title":"Helm's Deep","state":"script_only","beats":[
   ["Walls before dark","Inspect gates, supplies and vulnerable passages","افحص البوابات والمؤن والممرات الضعيفة"],
   ["Storm and siege","Coordinate defensive aid amid rain and confusion","نسّق الدفاع وسط المطر والفوضى"],
   ["Morning cost","Search for survivors and reckon with the damage","ابحث عن الناجين وقيّم حجم الخسائر"]]},
 {"id":"CH_F2_03","title":"Fangorn","state":"script_only","beats":[
   ["Among old roots","Learn the shifting woodland's landmarks","تعلّم معالم الغابة المتغيرة"],
   ["Voices of the forest","Approach the ancient guardians without provoking them","اقترب من حراس الغابة القدماء دون استفزاز"],
   ["March of branches","Witness the forest reclaim its dignity","شاهد الغابة تستعيد كرامتها"]]},
 {"id":"CH_F2_04","title":"Isengard","state":"script_only","beats":[
   ["Blackened land","Read signs of industry and poisoned water","اكتشف آثار الصناعة والمياه الملوثة"],
   ["A broken stronghold","Cross a flooded enclosure without losing the route","اعبر الحصن المغمور بالمياه"],
   ["After the machines","Record the changes before leaving the tower behind","سجّل التغييرات قبل ترك البرج خلفك"]]},
 {"id":"CH_F3_01","title":"Minas Tirith","state":"script_only","beats":[
   ["Seven circles","Find the safest route through a tiered city","اعثر على الطريق الأكثر أمانًا عبر المدينة المتدرجة"],
   ["Streets at war","Help civilians, couriers and defenders withstand panic","ساعد المدنيين والرسل والمدافعين"],
   ["A fragile dawn","Survey relief efforts while distant dangers remain","راجع جهود الإغاثة رغم استمرار الخطر"]]},
 {"id":"CH_F3_02","title":"Mordor","state":"script_only","beats":[
   ["Ash and silence","Conserve water and find cover across barren ground","وفّر الماء وابحث عن ساتر عبر الأرض القاحلة"],
   ["The narrowing road","Avoid patrols while the journey strains every friendship","تجنّب الدوريات فيما تختبر الرحلة الصداقة"],
   ["The burden ends","Carry the final choice through the volcanic darkness","واجه القرار الأخير وسط الظلام البركاني"]]},
 {"id":"CH_F3_03","title":"The Return","state":"script_only","beats":[
   ["Road home","Recognise both the comfort and change in familiar fields","تأمل الراحة والتغيير في الحقول المألوفة"],
   ["Healing the Shire","Support neighbours as gardens and homes recover","ساعد الجيران على إعادة الحياة للبيوت والحدائق"],
   ["An ordinary morning","Close the journey with relationships rather than conquest","اختم الرحلة بالعلاقات لا بالغلبة"]]}
]

static func shire_focus(stage: int) -> Dictionary:
    return SHIRE_FOCUS[clampi(stage,0,SHIRE_FOCUS.size()-1)].duplicate(true)

static func find_chapter(id: String) -> Dictionary:
    for chapter in CHAPTER_SCENES:
        if str(chapter["id"])==id:
            return chapter.duplicate(true)
    return {}

static func validate() -> Array[String]:
    var problems: Array[String]=[]
    var ids: Dictionary={}
    for chapter in CHAPTER_SCENES:
        var id: String=str(chapter["id"])
        if ids.has(id):
            problems.append("duplicate chapter: "+id)
        ids[id]=true
        if chapter["beats"].size()!=3:
            problems.append("missing three-act scene beats: "+id)
        for beat in chapter["beats"]:
            if beat.size()!=3 or str(beat[1]).is_empty() or str(beat[2]).is_empty():
                problems.append("bilingual beat incomplete: "+id)
    for index in range(SHIRE_FOCUS.size()):
        if int(SHIRE_FOCUS[index]["stage"])!=index:
            problems.append("invalid Shire stage")
    if CHAPTER_SCENES.size()!=14 or SHIRE_FOCUS.size()!=9:
        problems.append("unexpected chapter or Shire-stage count")
    return problems
