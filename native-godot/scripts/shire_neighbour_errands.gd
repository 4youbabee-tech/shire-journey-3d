class_name ShireNeighbourErrands
extends RefCounted
## Three original optional birthday-era tasks. No third-party art or dialogue.
const STOPS := [
    {"id":"garden_herbs","pos":Vector2(-32.0,-12.0),
     "en":"Gather herbs at Sam's garden","ar":"اجمع الأعشاب من حديقة سام",
     "done_en":"Garden herbs are wrapped for the party cooks.","done_ar":"صارت أعشاب الحديقة جاهزة لطهاة الاحتفال."},
    {"id":"mill_flour","pos":Vector2(29.0,-24.0),
     "en":"Collect flour at the Old Mill","ar":"خذ الطحين من الطاحونة القديمة",
     "done_en":"Fresh flour joins the herbs for the village feast.","done_ar":"انضم الطحين الطازج إلى الأعشاب استعدادًا للوليمة."},
    {"id":"party_delivery","pos":Vector2(-3.0,13.0),
     "en":"Deliver supplies to the party kitchen","ar":"سلّم المؤونة إلى مطبخ الاحتفال",
     "done_en":"The village cooks receive the supplies with thanks.","done_ar":"تسلّم طهاة القرية المؤونة بامتنان."}
]
const INTERACTION_RADIUS := 2.6
var completed: Dictionary = {}

func progress() -> int:
    return completed.size()

func reset() -> void:
    completed.clear()

func current() -> Dictionary:
    for stop in STOPS:
        if not completed.has(str(stop["id"])):
            return stop.duplicate(true)
    return {}

func available_at(player: Vector3, story_stage: int) -> Dictionary:
    if story_stage >= 5:
        return {}
    var stop: Dictionary=current()
    if stop.is_empty():
        return {}
    var location: Vector2=stop["pos"]
    if Vector2(player.x,player.z).distance_to(location) <= INTERACTION_RADIUS:
        return stop
    return {}

func complete(id: String, story_stage: int) -> Dictionary:
    if story_stage >= 5:
        return {}
    var stop: Dictionary=current()
    if stop.is_empty() or str(stop["id"])!=id:
        return {}
    completed[id]=true
    return {"id":id,"en":str(stop["done_en"]),"ar":str(stop["done_ar"]),
            "progress":progress(),"finished":progress()==STOPS.size()}

func pack() -> Dictionary:
    return {"completed":completed.duplicate(true)}

func unpack(raw: Dictionary) -> void:
    completed.clear()
    var stored=raw.get("completed",{})
    if not stored is Dictionary:
        return
    for stop in STOPS:
        var id: String=str(stop["id"])
        if stored.get(id,false)!=true:
            break
        completed[id]=true
