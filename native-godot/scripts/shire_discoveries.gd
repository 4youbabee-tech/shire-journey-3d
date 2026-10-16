class_name ShireDiscoveries
extends RefCounted
## FILM-EXPANDED / ORIGINAL-GAME one-time environmental vignettes.
## Distinct named locations, meaningful cultural notes; never rewrites story events.
const SITES := [
 {"id":"bridge","pos":Vector2(35.0,8.0),"en":"Examine the old Water Bridge","ar":"تفحّص جسر النهر العتيق",
  "text_en":"Worn wooden rails tell of generations crossing the Water on market mornings.",
  "text_ar":"تحكي الدرابزينات الخشبية البالية عن أجيال عبرت النهر في صباحات السوق."},
 {"id":"mill","pos":Vector2(30.5,-20.5),"en":"Listen beside the watermill","ar":"أنصت إلى صوت الطاحونة",
  "text_en":"The wheel turns steadily; even the miller measures the days by the water.",
  "text_ar":"تدور عجلة الطاحونة بانتظام، والماء نفسه يساعد الطحان على قياس الأيام."},
 {"id":"garden","pos":Vector2(-28.0,-13.5),"en":"Look over Sam's garden","ar":"تأمل حديقة سام",
  "text_en":"Well-tended seedlings and damp earth reveal a gardener who notices every season.",
  "text_ar":"تكشف الشتلات المعتنى بها والأرض الرطبة عن بستاني يعرف أسرار الفصول."},
 {"id":"market","pos":Vector2(23.0,12.0),"en":"Inspect the market goods","ar":"تفحّص بضائع السوق",
  "text_en":"Bread, vegetables and crates arrive along the lanes, each with a neighbour's story.",
  "text_ar":"يصل الخبز والخضار والصناديق عبر الطرقات، ولكل منها حكاية عند الجيران."},
 {"id":"fields","pos":Vector2(-62.0,30.0),"en":"Study the southern fields","ar":"تأمل الحقول الجنوبية",
  "text_en":"Rows of green growth show why the Shire's families value careful, patient work.",
  "text_ar":"تُظهر صفوف الزرع لماذا يقدّر أهل الشاير العمل المتقن والصبر."},
 {"id":"willows","pos":Vector2(37.0,-42.0),"en":"Pause by the river willows","ar":"توقف عند صفصاف النهر",
  "text_en":"The reeds lean over the banks, and willow branches stir when the wind shifts.",
  "text_ar":"تميل أعواد القصب فوق الضفاف وتتحرك أغصان الصفصاف مع تغيّر الريح."}
]
var seen: Dictionary = {}

func nearest(world: Vector3, inside: bool = false) -> Dictionary:
    if inside:
        return {}
    var player:=Vector2(world.x,world.z)
    for site in SITES:
        if seen.has(str(site["id"])):
            continue
        if player.distance_to(site["pos"])<2.1:
            return site
    return {}

func discover(id: String) -> Dictionary:
    if seen.has(id):
        return {}
    for site in SITES:
        if str(site["id"])==id:
            seen[id]=true
            return {"id":id,"en":str(site["text_en"]),"ar":str(site["text_ar"]),"progress":seen.size()}
    return {}

func pack() -> Dictionary:
    return {"seen":seen.duplicate(true)}

func unpack(raw: Dictionary) -> void:
    seen.clear()
    var restored=raw.get("seen",{})
    if not restored is Dictionary:
        return
    for site in SITES:
        var id: String=str(site["id"])
        if restored.get(id,false)==true:
            seen[id]=true

func reset() -> void:
    seen.clear()
