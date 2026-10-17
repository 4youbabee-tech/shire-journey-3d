extends SceneTree
## Imported Blender tree evidence within the actual gameplay scene.
func _initialize() -> void:
    call_deferred("_check")

func _check() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Unable to open Shire for woodland verification")
        quit(161)
        return
    for i in range(5):
        await process_frame
    var woods: Node = current_scene.find_child("ShireLayeredWoodland",true,false)
    if woods == null or woods.get_meta("blender_hero_assets",false) != true:
        push_error("Missing genuine Blender branch-and-leaf woodland in playable Shire")
        quit(162)
        return
    var total := 0
    for species in ["Oak","Beech","Alder","Willow"]:
        var instance: Node = woods.get_node_or_null("Hero_"+species+"_GPU")
        if not instance is MultiMeshInstance3D or instance.multimesh == null:
            push_error("Missing actual imported hero tree mesh: "+species)
            quit(163)
            return
        var batch: MultiMesh = instance.multimesh
        if batch.mesh.get_surface_count() < 4:
            push_error("Missing independent bark/leaf GLB surfaces: "+species)
            quit(164)
            return
        total += batch.instance_count
    if total != 78:
        push_error("Expected 68 authored trees plus 10 willows: %d" % total)
        quit(165)
        return
    print("PASS: 78 actual Blender modeled trees, 4 species and material-batched GPU placements")
    quit(0)
