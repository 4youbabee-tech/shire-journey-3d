extends SceneTree
# Native social simulation gate: bilingual choices, memory, goodwill and 54 residents.
func _initialize() -> void:
    var Social = load("res://scripts/shire_social.gd")
    var NPC = load("res://scripts/shire_npc.gd")
    var social = Social.new()
    var sam = NPC.new()
    sam.profile_id = "sam"
    sam.display_name = "Samwise Gamgee"
    sam.job = "gardener"
    sam.seed_value = 0
    var options = social.available("sam", 0, 9.0)
    if not options.has("greeting") or not options.has("favour"):
        push_error("FAIL: available dialogue choices")
        quit(4)
        return
    var reply: Dictionary = social.reply(sam,"greeting",0,0,9.0,"clear")
    if not str(reply.get("en","")).contains("Frodo") or str(reply.get("ar","")).is_empty():
        push_error("FAIL: bilingual response")
        quit(5)
        return
    social.reply(sam,"favour",0,0,9.0,"clear")
    social.reply(sam,"favour",0,0,9.0,"clear")
    if social.wisdom != 1 or social.favours.get("sam","") != "done":
        push_error("FAIL: consequence of kindness")
        quit(6)
        return
    var restored = Social.new()
    restored.unpack(social.pack())
    if restored.wisdom != 1 or restored.favours.get("sam","") != "done":
        push_error("FAIL: save restore")
        quit(7)
        return
    for i in range(54):
        var villager = NPC.new()
        villager.profile_id = "neighbour_%02d" % i
        villager.display_name = "Villager"
        villager.job = "farmer"
        social.reply(villager,"work",1,1,14.0,"clear")
    if social.bonds.size() < 54:
        push_error("FAIL: 54 independent relationships")
        quit(8)
        return
    print("PASS: bilingual social choices, kindness, persisted memories, 54 NPC records")
    quit(0)
