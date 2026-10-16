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
    var restored = load("res://scripts/shire_social.gd").new()
    restored.unpack(social.pack())
    restored.reply(npc, "friendship", 1, 9, 10.0, "clear")
    if int(restored.ensure_person("test_neighbour")["affinity"]) != 56:
        push_error("Daily friendship cooldown not preserved after save/load")
        quit(7)
        return
    npc.free()
    print("PASS: memory, 54 villagers, bilingual dialogue, once-per-day relationship and favour persistence")
    quit(0)