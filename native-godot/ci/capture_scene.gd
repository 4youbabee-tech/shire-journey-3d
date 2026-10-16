extends SceneTree
## Graphic display QA, not a substitute for human evaluation of the rendered game.
func _initialize() -> void:
    call_deferred("_capture")

func _capture() -> void:
    var result: Error=change_scene_to_file("res://scenes/Main.tscn")
    if result != OK:
        push_error("Cannot load Hobbiton for screenshot")
        quit(2)
        return
    for i in range(18):
        await process_frame
    var game: Node=current_scene
    if game == null:
        push_error("Godot did not initialize Chapter I")
        quit(3)
        return
    # CI's interior save/load smoke can leave a user:// save; never photograph a stale location.
    game.call("_new_game")
    var player = game.get("frodo")
    player.position = game.call("_ground",-40.0,-41.0) + Vector3(0,.35,0)
    player.yaw = -2.65
    player.rotation.y = -2.65
    player.first_person = false
    player._update_camera()
    if game.get("inside_bag_end") == true or game.get("inside_cottage") == true:
        push_error("Exterior capture still inside an interior")
        quit(7)
        return
    DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path("res://dist"))
    if not await _save_frame("in_engine_hobbiton.png"):
        quit(4)
        return
    game.call("_enter_bag_end")
    if not await _save_frame("in_engine_bagend.png"):
        quit(5)
        return
    game.call("_exit_bag_end")
    game.call("_enter_cottage",["bagshot_cottage","Bagshot Row Home",-44.0,-30.44])
    if not await _save_frame("in_engine_cottage.png"):
        quit(6)
        return
    print("SAVED 3 IN-ENGINE SCREENS: HOBBITON, BAG END, COTTAGE")
    quit(0)

func _save_frame(filename: String) -> bool:
    for i in range(12):
        await process_frame
    var image: Image=root.get_texture().get_image()
    if image == null or image.is_empty():
        push_error("No graphical frame for "+filename)
        return false
    var filename_absolute := ProjectSettings.globalize_path("res://dist/"+filename)
    var result: Error=image.save_png(filename_absolute)
    if result != OK:
        push_error("Failed screenshot: "+filename)
        return false
    print("SAVED IN-ENGINE: ",filename)
    return true
