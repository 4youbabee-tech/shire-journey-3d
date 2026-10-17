extends SceneTree
## Headless quest regression: timeline, distance, order and persistence.
func _initialize() -> void:
    var script=load("res://scripts/shire_neighbour_errands.gd")
    var work=script.new()
    if work.progress()!=0 or str(work.current().get("id",""))!="garden_herbs":
        push_error("First Shire errand missing")
        quit(101)
        return
    if not work.complete("mill_flour",0).is_empty() or not work.complete("garden_herbs",5).is_empty():
        push_error("Errands bypassed sequence or year gate")
        quit(102)
        return
    if not work.available_at(Vector3(80,0,80),0).is_empty():
        push_error("Errand unexpectedly usable at a distance")
        quit(103)
        return
    for index in range(script.STOPS.size()):
        var stop: Dictionary=script.STOPS[index]
        var id: String=str(stop["id"])
        var pos: Vector2=stop["pos"]
        if str(work.available_at(Vector3(pos.x,0,pos.y),0).get("id",""))!=id:
            push_error("Cannot reach errand location "+id)
            quit(104)
            return
        if work.complete(id,0).is_empty() or work.progress()!=index+1:
            push_error("Errand completion failed "+id)
            quit(105)
            return
        if not work.complete(id,0).is_empty():
            push_error("Errand can be claimed twice "+id)
            quit(106)
            return
    if not work.current().is_empty() or not work.available_at(Vector3(-3,0,13),0).is_empty():
        push_error("Completed errands remain interactable")
        quit(107)
        return
    var copy=script.new()
    copy.unpack(work.pack())
    if copy.progress()!=3:
        push_error("Save roundtrip lost errands")
        quit(108)
        return
    copy.unpack({"completed":{"mill_flour":true,"party_delivery":true,"unknown":true}})
    if copy.progress()!=0:
        push_error("Invalid save skipped task prerequisites")
        quit(109)
        return
    copy.unpack({"completed":{"garden_herbs":true,"mill_flour":true}})
    if copy.progress()!=2 or str(copy.current().get("id",""))!="party_delivery":
        push_error("Partial save restore regressed")
        quit(110)
        return
    copy.unpack({"completed":"not a dictionary"})
    if copy.progress()!=0:
        push_error("Malformed save was accepted")
        quit(111)
        return
    print("PASS: Shire neighbour errands (distance, era, order, save/load)")
    quit(0)
