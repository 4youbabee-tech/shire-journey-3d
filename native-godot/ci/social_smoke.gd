extends SceneTree
# Integration-free, deterministic social regression in real Godot GDScript.
func _initialize() -> void:
    var Social = load("res://scripts/shire_social.gd")
    var NPC = load("res://scripts/shire_npc.gd")
    var social = Social.new()
    var friend = NPC.new()
    friend.profile_id="sam"
    friend.display_name="Samwise Gamgee"
    friend.job="gardener"
    friend.seed_value=0
    var first:Dictionary=social.answer(friend,"greeting","clear",0,0,9.0)
    if not str(first.get("en","")).contains("Frodo"):
        push_error("Social greeting missing")
        quit(4)
        return
    var favor:Dictionary=social.take_action(friend,"help",0)
    if social.kindness != 1 or favor.is_empty():
        push_error("Kindness ledger failed")
        quit(5)
        return
    var discovered:Dictionary=social.discover(Vector3(-24,0,-20),0)
    if discovered.get("name","")!="Bag End gardens":
        push_error("Landmark discovery failed")
        quit(6)
        return
    var restored=Social.new()
    restored.unpack(social.pack())
    if restored.kindness != 1 or restored.discoveries.size()!=1:
        push_error("Social save/restore failed")
        quit(7)
        return
    for i in range(54):
        var npc=NPC.new()
        npc.profile_id="neighbour_%02d" % i
        npc.seed_value=i
        social.answer(npc,"work","clear",4,1,14.0)
    print("PASS: social dialogue, kindness, landmarks, save, 54 NPC variants")
    quit(0)