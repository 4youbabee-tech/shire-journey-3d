class_name ShireAvatar
extends Node3D
## Original-game stylized hobbit fallback; a licensed rigged character GLB can replace it.
## Exterior proportions and facial features are intentionally distinct from film actor scans.
var arms: Array[Node3D] = []
var legs: Array[Node3D] = []
var face_detail: Node3D
var is_imported := false
var external_animation: AnimationPlayer
var idle_clip := ""
var walk_clip := ""
var run_clip := ""
var turn_clip := ""
var talk_clip := ""
var greet_clip := ""
var working_clip := ""
var imported_visual: Node3D
var face_mouth: MeshInstance3D
var eyelids: Array[MeshInstance3D] = []
var _facial_meshes: Array[MeshInstance3D] = []
var emotion := "content"
var speech_remaining := 0.0
var speech_length := 0.0
var speaking := false
var social_gesture := false
var _actor_seed := 0.0
var playing_walk := false
var animation_full_detail := true

func set_animation_lod(high_detail: bool) -> void:
    animation_full_detail=high_detail
    if is_imported and is_instance_valid(external_animation):
        external_animation.active=high_detail
    if face_detail != null:
        face_detail.visible=high_detail

var _sphere_mesh: SphereMesh
var _capsule_mesh: CapsuleMesh
var _box_mesh: BoxMesh
var _mats: Dictionary = {}

func _mat(tint: Color, gloss: bool = false) -> StandardMaterial3D:
    var id: String = tint.to_html() + str(gloss)
    if _mats.has(id):
        return _mats[id]
    var result := StandardMaterial3D.new()
    result.albedo_color = tint
    result.roughness = 0.28 if gloss else 0.84
    result.metallic = 0.04 if gloss else 0.0
    _mats[id] = result
    return result

func _piece(parent: Node3D, kind: int, at: Vector3, size: Vector3, tint: Color, gloss: bool = false) -> MeshInstance3D:
    var part := MeshInstance3D.new()
    if kind == 1:
        part.mesh = _capsule_mesh
    elif kind == 2:
        part.mesh = _box_mesh
    else:
        part.mesh = _sphere_mesh
    part.position = at
    part.scale = size
    part.material_override = _mat(tint, gloss)
    part.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(part)
    return part

func _setup_meshes() -> void:
    _sphere_mesh = SphereMesh.new()
    _sphere_mesh.radial_segments = 14
    _sphere_mesh.rings = 8
    _capsule_mesh = CapsuleMesh.new()
    _capsule_mesh.radial_segments = 10
    _capsule_mesh.rings = 6
    _box_mesh = BoxMesh.new()

func build(character_id: String, cloth: Color, seed_number: int, rich_detail: bool = false) -> void:
    _setup_meshes()
    _actor_seed = float(seed_number)*0.47
    # Higher-detail freely licensed assets can be dropped in without modifying gameplay.
    # Never fetch an unlicensed actor likeness or film model.
    const CC0_HEROES := {"frodo":"Rogue", "sam":"Rogue", "bilbo":"Rogue_Hooded", "gandalf":"Mage"}
    if CC0_HEROES.has(character_id):
        var asset_path: String = "res://assets/characters/cc0_kaykit/" + str(CC0_HEROES[character_id]) + ".glb"
        if ResourceLoader.exists(asset_path):
            var imported: Resource = load(asset_path)
            if imported is PackedScene:
                var scene: Node = (imported as PackedScene).instantiate()
                if scene is Node3D:
                    add_child(scene)
                    imported_visual = scene
                    scene.scale=Vector3.ONE*(0.7 if character_id!="gandalf" else 0.92)
                    is_imported = true
                    var animator: Node = scene.find_child("AnimationPlayer",true,false)
                    if animator is AnimationPlayer:
                        external_animation = animator
                        for clip in external_animation.get_animation_list():
                            if idle_clip.is_empty() and str(clip).to_lower().contains("idle"): idle_clip=str(clip)
                            if walk_clip.is_empty() and str(clip).to_lower().contains("walk"): walk_clip=str(clip)
                            if run_clip.is_empty() and ("run" in str(clip).to_lower() or "sprint" in str(clip).to_lower()): run_clip=str(clip)
                            if turn_clip.is_empty() and ("turn" in str(clip).to_lower() or "rotate" in str(clip).to_lower()): turn_clip=str(clip)
                            if talk_clip.is_empty() and ("talk" in str(clip).to_lower() or "interact" in str(clip).to_lower()): talk_clip=str(clip)
                            if greet_clip.is_empty() and ("wave" in str(clip).to_lower() or "greet" in str(clip).to_lower()): greet_clip=str(clip)
                            if working_clip.is_empty() and ("work" in str(clip).to_lower() or "look" in str(clip).to_lower()): working_clip=str(clip)
                        if not idle_clip.is_empty(): external_animation.play(idle_clip)
                    for child in scene.find_children("*","MeshInstance3D",true,false):
                        if child is MeshInstance3D and child.mesh != null and child.mesh.get_blend_shape_count() > 0:
                            _facial_meshes.append(child)
                    return
                scene.free()
    var hair_choices := [Color("33231b"),Color("553b29"),Color("7b5533"),Color("3c3028"),Color("976b3c")]
    var skin_choices := [Color("edc7a2"),Color("e3ae8d"),Color("f0ceb3"),Color("c99e82")]
    var hair: Color = hair_choices[posmod(seed_number, hair_choices.size())]
    var skin: Color = skin_choices[posmod(seed_number + 1, skin_choices.size())]
    var trousers: Color = cloth.darkened(.36)
    var shirt: Color = cloth.lightened(.18)
    var leather := Color("71553d")
    var ear_tint: Color = skin.darkened(.10)
    var head := Node3D.new()
    head.name = "HeadAndFace"
    add_child(head)
    _piece(self,0,Vector3(0,.92,0),Vector3(.53,.62,.39),cloth)
    _piece(self,0,Vector3(0,1.12,-.10),Vector3(.43,.20,.34),shirt)
    _piece(self,0,Vector3(0,1.40,-.015),Vector3(.36,.34,.34),skin)
    _piece(self,0,Vector3(0,1.67,.055),Vector3(.38,.15,.35),hair)
    _piece(self,2,Vector3(0,.77,-.375),Vector3(.58,.065,.075),leather)
    _piece(self,2,Vector3(0,.79,-.423),Vector3(.095,.09,.045),Color("c2a163"),true)
    if rich_detail:
        for side in [-1.0,1.0]:
            _piece(self,0,Vector3(side*.22,1.05,-.32),Vector3(.17,.27,.07),shirt)
        for index in range(3):
            _piece(self,0,Vector3(.015,1.09-float(index)*.10,-.465),Vector3(.028,.028,.023),Color("cdb78a"),true)
        _piece(self,0,Vector3(.28,1.43,.01),Vector3(.10,.15,.09),ear_tint)
        _piece(self,0,Vector3(-.28,1.43,.01),Vector3(.10,.15,.09),ear_tint)
    face_detail = Node3D.new()
    face_detail.name = "FaceDetailLOD"
    add_child(face_detail)
    for side in [-1.0,1.0]:
        _piece(face_detail,0,Vector3(side*.147,1.443,-.304),Vector3(.056,.055,.035),Color("fcf8e9"))
        _piece(face_detail,0,Vector3(side*.147,1.445,-.333),Vector3(.027,.035,.018),Color("342d28"),true)
        var lid: MeshInstance3D = _piece(face_detail,0,Vector3(side*.147,1.443,-.348),Vector3(.068,.046,.023),skin)
        lid.visible = false
        eyelids.append(lid)
        _piece(face_detail,0,Vector3(side*.147,1.528,-.310),Vector3(.081,.023,.026),hair)
        _piece(face_detail,0,Vector3(side*.14,1.302,-.289),Vector3(.094,.052,.040),skin.lightened(.08))
    _piece(face_detail,0,Vector3(0,1.368,-.346),Vector3(.087,.090,.097),skin.darkened(.03))
    face_mouth = _piece(face_detail,0,Vector3(0,1.245,-.343),Vector3(.090,.018,.021),Color("945f56"))
    for index in range(5):
        var wave: float=float(index)-2.0
        _piece(face_detail,0,Vector3(wave*.12,1.635-absf(wave)*.034,-.21),Vector3(.15,.10,.20),hair)
    for side in [-1.0,1.0]:
        var leg_pivot := Node3D.new()
        leg_pivot.name="Leg_%s" % str(side)
        leg_pivot.position=Vector3(side*.20,.70,0)
        add_child(leg_pivot)
        legs.append(leg_pivot)
        _piece(leg_pivot,1,Vector3(0,-.25,.025),Vector3(.21,.34,.23),trousers)
        _piece(leg_pivot,0,Vector3(0,-.61,-.10),Vector3(.21,.10,.33),skin)
        var arm_pivot := Node3D.new()
        arm_pivot.name="Arm_%s" % str(side)
        arm_pivot.position=Vector3(side*.43,1.16,0)
        add_child(arm_pivot)
        arms.append(arm_pivot)
        _piece(arm_pivot,1,Vector3(side*.025,-.22,.015),Vector3(.17,.34,.19),shirt)
        _piece(arm_pivot,0,Vector3(side*.03,-.53,-.01),Vector3(.14,.14,.15),skin)
    set_detail_range(0.0)

func begin_speaking(mood_name: String, duration: float = 2.5) -> void:
    emotion = mood_name
    speaking = true
    speech_remaining = clampf(duration, .4, 9.0)
    speech_length = speech_remaining
    social_gesture = false

func end_speaking() -> void:
    speaking = false
    speech_remaining = 0.0
    emotion = "content"

func _face_pose(seconds: float, delta: float, distance: float) -> void:
    var blink: bool = fposmod(seconds + _actor_seed, 5.35) < .12
    var mouth_amount: float = 0.0
    if speaking and speech_remaining > 0.0:
        mouth_amount = .25 + absf(sin(seconds * 14.1 + _actor_seed))* .68
    for lid in eyelids:
        lid.visible = blink
    if is_instance_valid(face_mouth):
        face_mouth.scale.y = lerpf(face_mouth.scale.y, .018 + mouth_amount*.095, minf(delta*14.0,1.0))
        var tilt: float = .075 if emotion == "warm" else -.065 if emotion in ["uneasy","distant"] else 0.0
        face_mouth.rotation.z = lerpf(face_mouth.rotation.z, tilt, minf(delta*5.0,1.0))
    for part in _facial_meshes:
        var mesh = part.mesh
        if mesh == null:
            continue
        for i in range(mesh.get_blend_shape_count()):
            var channel: String=str(mesh.get_blend_shape_name(i)).to_lower()
            var target: float=0.0
            if "blink" in channel:
                target = 1.0 if blink else 0.0
            elif "smile" in channel or "happy" in channel:
                target = .72 if emotion in ["warm","content"] and speaking else 0.0
            elif "sad" in channel or "frown" in channel:
                target = .6 if emotion in ["uneasy","wistful","distant"] else 0.0
            elif "jaw" in channel or "mouth_open" in channel or "viseme" in channel:
                target = mouth_amount
            else:
                continue
            part.set_blend_shape_value(i,lerpf(part.get_blend_shape_value(i),target,minf(delta*10.0,1.0)))
    if is_instance_valid(imported_visual):
        var nod: float=.026*sin(seconds*4.1+_actor_seed) if speaking else .008*sin(seconds*1.2+_actor_seed)
        imported_visual.rotation.x=lerpf(imported_visual.rotation.x,nod,minf(delta*4.0,1.0))

func set_detail_range(distance: float) -> void:
    if face_detail != null:
        face_detail.visible = distance < 19.0

## Runs distinguishable motion when licensed GLB ships a run clip; safe walking fallback.
## No invented skeletal deformation or facial visemes are claimed.
func select_motion(walking: bool, running: bool = false) -> String:
    if walking and running and not run_clip.is_empty():
        return run_clip
    if walking and not walk_clip.is_empty():
        return walk_clip
    if speaking and speech_remaining > 0.0 and not talk_clip.is_empty():
        return talk_clip
    if social_gesture and not greet_clip.is_empty():
        return greet_clip
    if social_gesture and not working_clip.is_empty():
        return working_clip
    return idle_clip

func animate_walk(walking: bool, seconds: float, delta: float, distance: float, companion: bool = false, running: bool = false) -> void:
    speech_remaining=maxf(0.0,speech_remaining-delta)
    if animation_full_detail:
        _face_pose(seconds,delta,distance)
    if is_imported:
        if is_instance_valid(external_animation):
            var clip: String=select_motion(walking,running)
            if not clip.is_empty() and external_animation.has_animation(clip):
                if external_animation.current_animation != clip:
                    external_animation.play(clip,0.20)
        return
    set_detail_range(distance)
    if distance > 35.0:
        return
    var gait: float=seconds*(9.0 if companion else 6.0)
    var amplitude: float=.43 if walking else .18 if speech_remaining>0.0 else .09 if social_gesture else .026
    for i in range(legs.size()):
        var phase: float=gait+float(i)*PI
        var swing: float=sin(phase)*amplitude
        legs[i].rotation.x=lerpf(legs[i].rotation.x,swing,minf(delta*9.0,1.0))
        arms[i].rotation.x=lerpf(arms[i].rotation.x,-swing*.78,minf(delta*9.0,1.0))
