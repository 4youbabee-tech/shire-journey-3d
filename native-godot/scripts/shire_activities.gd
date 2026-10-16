class_name ShireActivities
extends RefCounted
## FILM-EXPANDED optional setup around Bilbo's birthday. Never changes canonical plot.
const STATIONS := [
    {"id":"birthday_bunting","x":-13.0,"z":-4.0,"en":"Hang the birthday bunting","ar":"علّق زينة عيد الميلاد","done_en":"Birthday bunting has been hung at Party Field.","done_ar":"علّقت زينة عيد الميلاد في حقل الاحتفال."},
    {"id":"birthday_tables","x":-8.0,"z":8.0,"en":"Set the birthday tables","ar":"حضّر طاولات عيد الميلاد","done_en":"The birthday tables are ready for the neighbours.","done_ar":"صارت طاولات عيد الميلاد جاهزة للجيران."},
    {"id":"birthday_lanterns","x":9.0,"z":3.0,"en":"Light the party lanterns","ar":"أشعل فوانيس الاحتفال","done_en":"Warm lanterns now welcome guests to the field.","done_ar":"الفوانيس المضيئة ترحّب بضيوف الاحتفال."}
]
var prepared: Dictionary = {}

func available_at(player_pos: Vector3, story_stage: int) -> Dictionary:
    if story_stage >= 5:
        return {}
    for station in STATIONS:
        if prepared.has(str(station["id"])):
            continue
        var where := Vector2(float(station["x"]), float(station["z"]))
        if Vector2(player_pos.x,player_pos.z).distance_to(where) < 2.65:
            return station
    return {}

func prepare(id: String, story_stage: int) -> Dictionary:
    if story_stage >= 5 or prepared.has(id):
        return {}
    for station in STATIONS:
        if str(station["id"]) == id:
            prepared[id] = true
            return {"id":id,"en":str(station["done_en"]),"ar":str(station["done_ar"]),"finished":prepared.size() == STATIONS.size()}
    return {}

func is_prepared(id: String) -> bool:
    return prepared.has(id)

func progress() -> int:
    return prepared.size()

func reset() -> void:
    prepared.clear()

func pack() -> Dictionary:
    return {"prepared":prepared.duplicate(true)}

func unpack(raw: Dictionary) -> void:
    prepared.clear()
    var restored = raw.get("prepared",{})
    if not restored is Dictionary:
        return
    for station in STATIONS:
        var id: String = str(station["id"])
        if restored.get(id,false) == true:
            prepared[id] = true
