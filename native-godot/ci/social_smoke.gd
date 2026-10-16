extends SceneTree
# Headless pure-logic test under Godot 4.4.1.
func _initialize() -> void:
    var social=load("res://scripts/shire_social.gd").new()
    social.meet("sam",0)
    social.remember("sam","gardens",0,15)
    if social.recall("sam",7).is_empty():
        push_error("Social memory expired too soon")
        quit(1)
        return
    social.relationship_change("sam","trust",10)
    social.record("party_field","Visited Party Field","زرت حقل الاحتفال",0)
    var copy=load("res://scripts/shire_social.gd").new()
    copy.unpack(social.pack())
    if int(copy.ensure_person("sam")["trust"])!=60 or copy.journal.size()!=1:
        push_error("Social persistence roundtrip failed")
        quit(2)
        return
    for i in range(54):
        copy.meet("villager_%02d" % i,0)
    if copy.bonds.size()<55:
        push_error("54 NPC social records failed")
        quit(3)
        return
    print("PASS: social memory, relationship, diary and 54 villagers")
    quit(0)