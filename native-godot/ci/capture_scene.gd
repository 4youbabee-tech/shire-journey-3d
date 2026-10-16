extends SceneTree
## Optional real-render screenshot test (must run with a graphical display, not --headless).
func _initialize() -> void:
    call_deferred("_capture")

func _capture() -> void:
    var result: Error = change_scene_to_file("res://scenes/Main.tscn")
    if result != OK:
        push_error("Cannot load game scene for screenshot")
        quit(2)
        return
    for i in range(16):
        await process_frame
    var image: Image = root.get_texture().get_image()
    if image == null or image.is_empty():
        push_error("No graphical frame produced")
        quit(3)
        return
    var file := "res://dist/in_engine_hobbiton.png"
    DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path("res://dist"))
    result = image.save_png(file)
    if result != OK:
        push_error("Screenshot could not be saved")
        quit(4)
        return
    print("SAVED TRUE IN-ENGINE SCREENSHOT: ",file)
    quit(0)