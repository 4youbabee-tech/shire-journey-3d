class_name JourneyChapterRegistry
extends RefCounted
## Production-scoped chapter graph for Middle-earth Journey. This is NOT a claim
## that future chapters are currently playable, rendered, or cinematic-final.
const CHAPTERS := [
    {"id":"CH_F1_01","name":"The Shire","name_ar":"الشاير","location":"LOC_SHIRE_HOBBITON","status":"playable_candidate","next":"CH_F1_02","visual":"pastoral hills, Hobbit homes, natural lanes"},
    {"id":"CH_F1_02","name":"Bree","name_ar":"بري","location":"LOC_ERIADOR_BREE","status":"not_implemented","next":"CH_F1_03","visual":"wet timber village, the Prancing Pony, lanterns"},
    {"id":"CH_F1_03","name":"Weathertop","name_ar":"قمة الرياح","location":"LOC_ERIADOR_WEATHERTOP","status":"not_implemented","next":"CH_F1_04","visual":"exposed ruined stone watchtower and wild scrub"},
    {"id":"CH_F1_04","name":"Rivendell","name_ar":"ريفندل","location":"LOC_RIVENDELL","status":"not_implemented","next":"CH_F1_05","visual":"terraced Elven architecture, waterfalls, autumn gardens"},
    {"id":"CH_F1_05","name":"Moria","name_ar":"مورْيا","location":"LOC_MORIA","status":"not_implemented","next":"CH_F1_06","visual":"vast Dwarven masonry, deep shadow and underground halls"},
    {"id":"CH_F1_06","name":"Lothlorien","name_ar":"لوثْلورين","location":"LOC_LOTHLORIEN","status":"not_implemented","next":"CH_F1_07","visual":"living ancient forest, elevated Elven walkways"},
    {"id":"CH_F1_07","name":"Amon Hen","name_ar":"أمون هن","location":"LOC_AMON_HEN","status":"not_implemented","next":"CH_F2_01","visual":"river cliffs and ancient wooded ruins"},
    {"id":"CH_F2_01","name":"Rohan","name_ar":"روهان","location":"LOC_ROHAN","status":"not_implemented","next":"CH_F2_02","visual":"sweeping grasslands and timber hall settlements"},
    {"id":"CH_F2_02","name":"Helm's Deep","name_ar":"هلمز ديب","location":"LOC_HELMS_DEEP","status":"not_implemented","next":"CH_F2_03","visual":"mountain fortress and defensive stoneworks"},
    {"id":"CH_F2_03","name":"Fangorn","name_ar":"فانغورن","location":"LOC_FANGORN","status":"not_implemented","next":"CH_F2_04","visual":"dense ancient woods and massive trees"},
    {"id":"CH_F2_04","name":"Isengard","name_ar":"آيزنغارد","location":"LOC_ISENGARD","status":"not_implemented","next":"CH_F3_01","visual":"industrialized stone ring and black tower"},
    {"id":"CH_F3_01","name":"Minas Tirith","name_ar":"ميناس تيريث","location":"LOC_MINAS_TIRITH","status":"not_implemented","next":"CH_F3_02","visual":"white stone tiered city"},
    {"id":"CH_F3_02","name":"Mordor","name_ar":"موردور","location":"LOC_MORDOR","status":"not_implemented","next":"CH_F3_03","visual":"volcanic slopes and hostile ash plains"},
    {"id":"CH_F3_03","name":"The Return","name_ar":"العودة","location":"LOC_SHIRE_RETURN","status":"not_implemented","next":"","visual":"homecoming and post-war Shire state"}
]

static func find(chapter_id: String) -> Dictionary:
    for chapter in CHAPTERS:
        if chapter["id"]==chapter_id:
            return chapter.duplicate(true)
    return {}

static func next_chapter(chapter_id: String) -> Dictionary:
    var current: Dictionary=find(chapter_id)
    if current.is_empty() or str(current["next"]).is_empty():
        return {}
    return find(str(current["next"]))

static func validate() -> Array[String]:
    var errors: Array[String]=[]
    var registered: Dictionary={}
    for chapter in CHAPTERS:
        var id: String=str(chapter["id"])
        if id.is_empty() or registered.has(id):
            errors.append("duplicate/empty chapter ID: "+id)
        registered[id]=true
    for chapter in CHAPTERS:
        var following: String=str(chapter["next"])
        if not following.is_empty() and not registered.has(following):
            errors.append("unreachable successor: "+following)
        if str(chapter["status"]) not in ["playable_candidate","not_implemented","approved"]:
            errors.append("invalid status: "+str(chapter["id"]))
    return errors
