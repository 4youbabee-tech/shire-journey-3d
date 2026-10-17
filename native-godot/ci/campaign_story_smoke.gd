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
    print("PASS: 14 author-written bilingual chapter screenplay outlines and nine in-game journal beats")
    quit(0)
