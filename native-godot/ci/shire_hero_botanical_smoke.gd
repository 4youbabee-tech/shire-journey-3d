extends SceneTree
## Full scene integration, not a filename-only or CI log-only assertion.
func _initialize() -> void:
    call_deferred("_verify")

func _verify() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Shire scene failed botanical integration")
        quit(180)
        return
    for i in range(5):
        await process_frame
    var root: Node = current_scene.find_child("ShireLayeredWoodland",true,false)
    if root == null or root.get_meta("blender_hero_assets",false) != true:
        push_error("Original Blender tree GLBs are missing from the playable scene")
        quit(181)
        return
    var count := 0
    for species in ["Oak","Beech","Alder","Willow"]:
        var name: String = "Hero_"+species+"_GPU"
        var view: Node = root.get_node_or_null(name)
        if not view is MultiMeshInstance3D:
            push_error("No actual imported canopy geometry for "+species)
            quit(182)
            return
        var trees: MultiMesh = (view as MultiMeshInstance3D).multimesh
        if trees == null or trees.mesh == null or trees.mesh.get_surface_count() < 4:
            push_error("Hero trunk/leaf materials not visible in "+species)
            quit(183)
            return
        count += trees.instance_count
    if count != 78:
        push_error("Expected 68 canopy trees and 10 willows, got %d" % count)
        quit(184)
        return
    print("PASS: 78 authored Blender oak, beech, alder and willow meshes placed inside running Shire")
    quit(0)
