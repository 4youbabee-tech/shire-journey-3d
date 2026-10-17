extends SceneTree
## Headless field-note regression: translations, location, save, double reward.
func _initialize() -> void:
    call_deferred("_verify")

func _verify() -> void:
    var source=load("res://scripts/shire_discoveries.gd")
    var notes=source.new()
    if source.SITES.size()!=21:
        push_error("Expected 21 original village and household field notes")
        quit(121)
        return
    var ids: Dictionary={}
    for site in source.SITES:
        var id: String=str(site["id"])
        if ids.has(id):
            push_error("Duplicate field-note ID "+id)
            quit(122)
            return
        ids[id]=true
        for key in ["en","ar","text_en","text_ar"]:
            if str(site.get(key,"")).strip_edges().is_empty():
                push_error("Untranslated field note "+id+"/"+key)
                quit(123)
                return
        var p: Vector2=site["pos"]
        var location:=Vector3(p.x,0.0,p.y)
        if not notes.nearest(location,true).is_empty():
            push_error("Interior discovery permitted")
            quit(124)
            return
        if str(notes.nearest(location).get("id",""))!=id:
            push_error("Field note unreachable or overlapping "+id)
            quit(125)
            return
        var found: Dictionary=notes.discover(id)
        if found.is_empty() or int(found.get("progress",-1))!=ids.size():
            push_error("Field note reward failed "+id)
            quit(126)
            return
        if not notes.discover(id).is_empty() or not notes.nearest(location).is_empty():
            push_error("Duplicate field-note reward "+id)
            quit(127)
            return
    var copy=source.new()
    copy.unpack(notes.pack())
    if copy.seen.size()!=21:
        push_error("Field-note save roundtrip failed")
        quit(128)
        return
    copy.unpack({"seen":{"orchard":true,"garden":true,"invalid_id":true}})
    if copy.seen.size()!=2:
        push_error("Unknown ID accepted in save")
        quit(129)
        return
    copy.unpack({"seen":"invalid"})
    if not copy.seen.is_empty():
        push_error("Malformed save accepted")
        quit(130)
        return
    notes.reset()
    if not notes.seen.is_empty():
        push_error("Field-note reset failed")
        quit(131)
        return
    print("PASS: 21 bilingual Shire field notes, reachability, dedup and persistence")
    quit(0)
