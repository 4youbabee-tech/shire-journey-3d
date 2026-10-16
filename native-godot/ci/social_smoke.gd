extends SceneTree
# Headless pure-logic test under Godot 4.4.1.
func _initialize() -> void:
    # SceneTree._initialize runs before child _ready methods; defer scene checks.
    call_deferred("_run_smoke")

func _run_smoke() -> void:
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

    # Verify that repeated dialogue does not farm infinite relationship rewards.
    var npc = load("res://scripts/shire_npc.gd").new()
    npc.profile_id = "test_neighbour"
    npc.display_name = "Test Neighbour"
    npc.job = "gardener"
    var first = social.reply(npc, "friendship", 1, 8, 10.0, "clear")
    var after_first: int = int(social.ensure_person("test_neighbour")["affinity"])
    social.reply(npc, "friendship", 1, 8, 10.0, "clear")
    if first["en"].is_empty() or first["ar"].is_empty() or after_first != 53 or int(social.ensure_person("test_neighbour")["affinity"]) != 53:
        push_error("Same-day friendship reward or bilingual reply failed")
        quit(4)
        return
    social.reply(npc, "friendship", 1, 9, 10.0, "clear")
    if int(social.ensure_person("test_neighbour")["affinity"]) != 56:
        push_error("Next-day friendship reward failed")
        quit(5)
        return
    social.reply(npc, "favour", 1, 9, 10.0, "clear")
    var before_help: int = social.wisdom
    social.reply(npc, "favour", 1, 9, 10.0, "clear")
    social.reply(npc, "favour", 1, 9, 10.0, "clear")
    if social.wisdom != before_help + 1 or social.journal.size() != 2:
        push_error("Favour reward must be issued exactly once")
        quit(6)
        return
    social.events["party_ready"]=true
    var festive: Dictionary=social.reply(npc,"birthday",0,9,14.0,"clear")
    if not str(festive["en"]).contains("Party Field") or not social.available(npc.profile_id,0,14.0).has("birthday"):
        push_error("Birthday event did not change NPC conversations")
        quit(16)
        return
    var restored = load("res://scripts/shire_social.gd").new()
    restored.unpack(social.pack())
    if restored.events.get("party_ready",false) != true:
        push_error("Birthday conversation state did not persist")
        quit(17)
        return
    restored.reply(npc, "friendship", 1, 9, 10.0, "clear")
    if int(restored.ensure_person("test_neighbour")["affinity"]) != 56:
        push_error("Daily friendship cooldown not preserved after save/load")
        quit(7)
        return
    # Bag End is an actual scene graph with reachable exploration hotspots.
    var interior = load("res://scripts/shire_bag_end.gd").new()
    get_root().add_child(interior)
    if interior.get_child_count() < 25 or interior.interaction_at(interior.EXIT) != "exit" or interior.interaction_at(interior.ENTRY) != "":
        push_error("Bag End interior scene or exit interaction missing")
        quit(8)
        return
    if interior.interaction_at(interior.STUDY) != "study" or interior.interaction_at(interior.PANTRY) != "pantry" or interior.interaction_at(interior.HEARTH) != "hearth":
        push_error("Bag End study/pantry/hearth hotspots unavailable")
        quit(9)
        return
    var companion = load("res://scripts/shire_npc.gd").new()
    get_root().add_child(companion)
    companion.configure("sam", "Samwise Gamgee", "gardener", Vector3.ZERO, Vector3(8, 0, 8), Color("787b49"), 1)
    companion.body.begin_speaking("warm",3.0)
    if not companion.body.speaking or companion.body.speech_remaining<2.9:
        push_error("NPC conversation performance not active")
        quit(31)
        return
    companion.follow_player = true
    if not companion.body.is_imported and (companion.legs.size() != 2 or companion.arms.size() != 2 or companion.body.get_child_count() < 8):
        push_error("NPC rigged limbs missing")
        quit(14)
        return
    companion.update_schedule(13.0, true, Vector3(6, 0, 0), 1.0, 60.0)
    if not companion.body.is_imported and companion.body.get_node_or_null("FaceDetailLOD") == null:
        push_error("Character face detail LOD missing")
        quit(20)
        return
    if companion.action != "accompanying" or companion.position.x <= 0.0:
        push_error("Sam companion ignores player while raining")
        quit(10)
        return
    var road = load("res://scripts/shire_paths.gd")
    var walking_route: Array[Vector2] = road.route(Vector2(-24,-19),Vector2(41,8))
    if walking_route.is_empty() or walking_route.back().distance_to(Vector2(41,8))>.001 or walking_route.size()<2:
        push_error("Road path between Bag End and Water Bridge missing")
        quit(21)
        return
    companion.body.end_speaking()
    if companion.body.speaking or companion.body.speech_remaining>0.0:
        push_error("NPC conversation performance did not stop")
        quit(32)
        return
    companion.follow_player=false
    companion.home=Vector3.ZERO
    companion.work=Vector3(41,0,8)
    companion.position=Vector3(-24,0,-19)
    companion.terrain_height=func(x: float,z: float) -> float: return 2.75
    companion.update_schedule(10.0,false,Vector3(-24,0,-19),.5,66.0)
    if absf(companion.position.y-2.75)>.001 or companion.route_points.is_empty():
        push_error("NPC terrain tracking or cached village route missing")
        quit(22)
        return
    if OS.get_environment("GITHUB_ACTIONS")=="true":
        var hero = load("res://scripts/shire_avatar.gd").new()
        get_root().add_child(hero)
        hero.build("frodo",Color("8a7056"),3,true)
        if not hero.is_imported:
            push_error("Rigged CC0 Frodo model missing from exported project")
            quit(30)
            return
        hero.free()
    companion.free()
    var preparations = load("res://scripts/shire_activities.gd").new()
    for station in preparations.STATIONS:
        var px: float=float(station["x"])
        var pz: float=float(station["z"])
        var found: Dictionary=preparations.available_at(Vector3(px,0,pz),0)
        if found.is_empty() or str(found["id"]) != str(station["id"]):
            push_error("Missing birthday preparation hotspot")
            quit(11)
            return
        preparations.prepare(str(station["id"]),0)
    if preparations.progress() != 3:
        push_error("Birthday activity completion failed")
        quit(12)
        return
    var saved_preparations = load("res://scripts/shire_activities.gd").new()
    saved_preparations.unpack(preparations.pack())
    if saved_preparations.progress() != 3 or not saved_preparations.available_at(Vector3(-13,0,-4),0).is_empty():
        push_error("Birthday activity persistence failed")
        quit(13)
        return
    var shire_map = load("res://scripts/shire_map.gd").new()
    get_root().add_child(shire_map)
    shire_map.configure([["bagend","Bag End","", -24.0,-20.0]], Vector2(-24,-20))
    if shire_map.project(Vector2(-24,-20)).distance_to(shire_map.project(shire_map.player_position)) > 0.01:
        push_error("Shire map player projection failed")
        quit(15)
        return
    shire_map.free()
    var home = load("res://scripts/shire_cottage.gd").new()
    home.variant_id="bagshot_cottage"
    get_root().add_child(home)
    if home.get_child_count()<20 or home.interaction_at(home.ENTRY)!="" or home.interaction_at(home.EXIT)!="exit":
        push_error("Explorable Hobbiton home geometry or door invalid")
        quit(18)
        return
    if home.interaction_at(home.READING)!="reading" or home.interaction_at(home.PANTRY)!="pantry":
        push_error("Cottage furnishing interactions invalid")
        quit(19)
        return
    home.free()
    interior.free()
    npc.free()
    print("PASS: memory, 54 villagers, bilingual dialogue, once-per-day relationship and favour persistence")
    quit(0)