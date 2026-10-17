extends SceneTree
## End-to-end organic side activity: real interaction sites, market supply and save persistence.
func _initialize() -> void:
    call_deferred("_check")
func _check() -> void:
    if OS.get_environment("GITHUB_ACTIONS")!="true":
        push_error("Use isolated CI for save-state integration")
        quit(120)
        return
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Shire world does not load")
        quit(121)
        return
    for _i in range(7):
        await process_frame
    var game: Node=current_scene
    game.call("_new_game")
    var activity=game.get("foraging")
    if activity == null:
        push_error("Foraging model not installed in live chapter")
        quit(122)
        return
    var sites: Array=activity.SITES
    if sites.size()!=12:
        push_error("Unexpected foraging network")
        quit(123)
        return
    var root: Node=game.get("shire")
    var ecological: Node=root.find_child("ShireCraftedEcology",true,false)
    if ecological==null:
        push_error("Village world ecology did not render")
        quit(124)
        return
    for site in sites:
        if root.find_child("ForageSpot_"+str(site["id"]),true,false)==null:
            push_error("Missing visible gathering resource "+str(site["id"]))
            quit(125)
            return
    var actors: Node=game.get("frodo")
    for kind in ["fruit","herb","flower"]:
        var collected: int=0
        for site in sites:
            if str(site["kind"])!=kind or collected>=2:
                continue
            var x: float=float(site["x"])
            var z: float=float(site["z"])
            actors.position=game.call("_ground",x,z)
            game.call("_forage_action")
            collected+=1
            if int(activity.inventory[kind])!=collected:
                push_error("Failed to gather "+kind)
                quit(126)
                return
            game.call("_forage_action")
            if int(activity.inventory[kind])!=collected:
                push_error("Unlimited same-day gathering exploit")
                quit(127)
                return
    if not activity.can_deliver():
        push_error("Market delivery recipe invalid")
        quit(128)
        return
    actors.position=game.call("_ground",17.0,8.0)
    game.call("_forage_action")
    if int(activity.deliveries)!=1 or activity.can_deliver():
        push_error("Basket delivery did not consume recipe")
        quit(129)
        return
    game.call("save_game",false)
    game.call("_new_game")
    game.call("load_game")
    if int(game.get("foraging").deliveries)!=1:
        push_error("Market delivery did not survive full save-load")
        quit(130)
        return
    var day: int=int(game.get("clock").day_index())
    var first: Dictionary=sites[0]
    actors.position=game.call("_ground",float(first["x"]),float(first["z"]))
    if not game.get("foraging").nearby(actors.position,day).is_empty():
        push_error("Day-gated plant regrew before morning")
        quit(131)
        return
    if game.get("foraging").nearby(actors.position,day+1).is_empty():
        push_error("Plant did not become harvestable next day")
        quit(132)
        return
    print("PASS: 12 rendered forage plots, six pickups, market delivery and save-load")
    quit(0)
