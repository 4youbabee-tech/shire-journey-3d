extends SceneTree
func _initialize() -> void:
    var atlas=load("res://scripts/shire_campaign_atlas.gd")
    var registry=load("res://scripts/journey_chapter_registry.gd")
    if not atlas.validate().is_empty():
        push_error("Campaign atlas screenplay graph invalid: %s" % str(atlas.validate()))
        quit(90)
        return
    if registry.CHAPTERS.size()!=atlas.CHAPTER_SCENES.size():
        push_error("Campaign screenplay does not cover existing journey registry")
        quit(91)
        return
    for chapter in registry.CHAPTERS:
        var row: Dictionary=atlas.find_chapter(str(chapter["id"]))
        if row.is_empty():
            push_error("Missing planned scenario chapter: "+str(chapter["id"]))
            quit(92)
            return
        if chapter["status"]=="not_implemented" and row["state"]!="script_only":
            push_error("Unbuilt journey chapter mislabeled playable in script atlas")
            quit(93)
            return
    for stage in range(9):
        var beat: Dictionary=atlas.shire_focus(stage)
        if int(beat["stage"])!=stage or str(beat["en"]).is_empty() or str(beat["ar"]).is_empty():
            push_error("Bilingual Shire gameplay stage outline missing")
            quit(94)
            return
    # Cover player-facing field observations in an existing mandatory CI smoke.
    var library=load("res://scripts/shire_discoveries.gd")
    var journal=library.new()
    if library.SITES.size()<21:
        push_error("Missing the expanded 21 Shire field observation sites")
        quit(95)
        return
    var known: Dictionary={}
    for site in library.SITES:
        var id: String=str(site["id"])
        if known.has(id) or str(site.get("en","")).is_empty() or str(site.get("ar","")).is_empty() or str(site.get("text_en","")).is_empty() or str(site.get("text_ar","")).is_empty():
            push_error("Duplicate or untranslated Shire field note "+id)
            quit(96)
            return
        known[id]=true
        var p: Vector2=site["pos"]
        var spot:=Vector3(p.x,0.0,p.y)
        if not journal.nearest(spot,true).is_empty() or str(journal.nearest(spot).get("id",""))!=id:
            push_error("Indoor access or overlapping field note "+id)
            quit(97)
            return
        var reward: Dictionary=journal.discover(id)
        if reward.is_empty() or not journal.discover(id).is_empty():
            push_error("Field note not collectible exactly once "+id)
            quit(98)
            return
    var restored=library.new()
    restored.unpack(journal.pack())
    if restored.seen.size()!=library.SITES.size():
        push_error("Field note save roundtrip invalid")
        quit(99)
        return
    print("PASS: expanded original bilingual Shire field notes, interior lock and persistence")
    print("PASS: 14 author-written bilingual chapter screenplay outlines and nine in-game journal beats")
    quit(0)
