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
    # Capture with an independent spectator camera. Frodo's gameplay camera can
    # spring-arm clamp behind new buildings, terrain or orchard furniture.
    # Moving the player did not fix 2 consecutive obscured Hobbiton screenshots.
    player.active=false
    if game.get("inside_bag_end")==true or game.get("inside_cottage")==true:
        push_error("Exterior capture still inside an interior")
        quit(7)
        return
    # Fixed genuine late-afternoon game time for side-by-side art comparison.
    # The normal game retains its full playable time/weather simulation.
    var qa_clock: ShireClock = game.get("clock")
    var qa_weather: ShireWeather = game.get("weather")
    qa_clock.elapsed = 600.0
    qa_weather.override_kind = "clear"
    for wait in range(4):
        await process_frame
    DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path("res://dist"))
    var spectator:=Camera3D.new()
    spectator.name="QA_Independent_Exterior_Camera"
    spectator.fov=66.0
    spectator.near=.08
    game.add_child(spectator)
    spectator.current=true
    # Each photo is a real frame of this chapter, sampled from fixed elevated
    # viewpoints. Selection happens later using unmodified strict pixel gates.
    var views: Array=[
        ["bagend",Vector2(-39.0,-47.0),Vector2(-24.0,-20.0),8.0],
        ["party",Vector2(-10.0,18.0),Vector2(-2.0,-3.0),8.5],
        ["market",Vector2(10.0,25.0),Vector2(17.0,8.0),8.0],
        ["mill",Vector2(52.0,-3.0),Vector2(32.0,-20.0),10.0],
        ["highridge",Vector2(-6.0,-52.0),Vector2(-24.0,-20.0),12.0],
        ["village_valley",Vector2(-18.0,-65.0),Vector2(9.0,-9.0),7.0],
        ["waterfront",Vector2(12.0,-37.0),Vector2(34.0,-12.0),7.5]
    ]
    for view in views:
        var pos: Vector2=view[1]
        var aim: Vector2=view[2]
        var altitude: float=float(view[3])
        var camera_ground: Vector3=game.call("_ground",pos.x,pos.y)
        var target_ground: Vector3=game.call("_ground",aim.x,aim.y)
        spectator.global_position=camera_ground+Vector3.UP*altitude
        spectator.look_at(target_ground+Vector3.UP*2.3,Vector3.UP)
        if not await _save_frame("in_engine_hobbiton_candidate_%s.png" % str(view[0])):
            quit(4)
            return
    spectator.current=false
    spectator.queue_free()
    player.active=true
    player.camera.current=true
    game.call("_enter_bag_end")
    if not await _save_frame("in_engine_bagend.png"):
        quit(5)
        return
    game.call("_exit_bag_end")
    game.call("_enter_cottage",["bagshot_cottage","Bagshot Row Home",-44.0,-30.44])
    if not await _save_frame("in_engine_cottage.png"):
        quit(6)
        return
    print("SAVED 7 REAL IN-ENGINE HOBBITON ANGLES + BAG END + COTTAGE; strict selection follows")
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
