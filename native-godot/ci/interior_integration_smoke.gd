extends SceneTree
## Full Chapter I scene integration: enter, explore, save, load, leave.
func _initialize() -> void:
    call_deferred("_run")

func _run() -> void:
    if OS.get_environment("GITHUB_ACTIONS") != "true":
        push_error("Interior save/load smoke must run only in isolated GitHub Actions")
        quit(39)
        return
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Cannot instantiate chapter for interior integration test")
        quit(30)
        return
    for i in range(5):
        await process_frame
    var game: Node=current_scene
    if game == null:
        push_error("No chapter scene after load")
        quit(31)
        return
    game.call("_new_game")
    var player = game.get("frodo")
    player.position=game.call("_ground",-24.0,-26.32)
    if game.call("_near_bag_end_door") != true:
        push_error("Bag End door cannot be reached in the game world")
        quit(32)
        return
    game.call("_enter_bag_end")
    if game.get("inside_bag_end") != true or game.call("_interior_action") == "exit":
        push_error("Bag End entrance or interior spawn invalid")
        quit(33)
        return
    game.call("save_game",false)
    game.call("_exit_bag_end")
    if game.get("inside_bag_end") != false:
        push_error("Cannot leave Bag End")
        quit(34)
        return
    game.call("load_game")
    if game.get("inside_bag_end") != true:
        push_error("Bag End interior did not survive save/load")
        quit(35)
        return
    game.call("_exit_bag_end")
    game.call("_enter_cottage",["bagshot_cottage","Bagshot Row Home",-44.0,-30.44])
    if game.get("inside_cottage") != true or game.get("current_cottage_id") != "bagshot_cottage":
        push_error("Hobbiton cottage could not be entered")
        quit(36)
        return
    game.call("save_game",false)
    game.call("_exit_cottage")
    game.call("load_game")
    if game.get("inside_cottage") != true or game.get("current_cottage_id") != "bagshot_cottage":
        push_error("Hobbiton cottage failed save/load roundtrip")
        quit(37)
        return
    game.call("_exit_cottage")
    if game.get("inside_cottage") != false:
        push_error("Cannot exit cottage")
        quit(38)
        return
    print("PASS: Chapter I door, Bag End and cottage interior entry/exit, and save/load")
    quit(0)
