extends SceneTree
## Integration check for new playable-scene tree geometry and efficient batches.
func _initialize() -> void:
    call_deferred("_check")

func _check() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Unable to open Shire for woodland verification")
        quit(161)
        return
    for i in range(4):
        await process_frame
    var woods: Node = current_scene.find_child("ShireLayeredWoodland",true,false)
    if woods == null:
        push_error("Shire woodland not integrated in playable Godot scene")
        quit(162)
        return
    var expected: Array[String] = ["01_BarkTrunks","02_BranchWhorls","03_DeepLeafVolume","04_MidLeafVolume","05_SunlitLeafTips"]
    for name in expected:
        var batch = woods.get_node_or_null(name)
        if not batch is MultiMeshInstance3D or batch.multimesh == null or batch.multimesh.instance_count == 0:
            push_error("Missing actual woodland GPU geometry batch: " + name)
            quit(163)
            return
    var trunks: MultiMeshInstance3D = woods.get_node("01_BarkTrunks")
    if trunks.multimesh.instance_count != 68:
        push_error("Expected 68 real tree trunk instances, got %d" % trunks.multimesh.instance_count)
        quit(164)
        return
    print("PASS: 68 layered Shire trees, branches and 5 GPU batches in playable world")
    quit(0)
