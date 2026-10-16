extends Node3D
# Native 3D migration seed; full higher-detail source delivered as ZIP checkpoint.
const HERO = preload("res://scripts/player.gd")
const SAVE = "user://shire_native.json"
var player: CharacterBody3D
var outside: Node3D
var inside: Node3D
var sun: DirectionalLight3D
var env: WorldEnvironment
var clock := 0.0
var indoors := false
var bad_weather := false
var npc_nodes: Dictionary = {}
var links: Dictionary = {}
var memories: Dictionary = {}
var focus := ""
var hud: Label
var panel: PanelContainer
var line: Label
var options: VBoxContainer
var quest: Dictionary = {"sam":false,"bread":false,"bilbo":false}
var villagers := [
 {"id":"sam","name":"Samwise Gamgee","home":Vector3(-18,0,2),"work":Vector3(-28,0,-14),"market":Vector3(8,0,9),"color":Color(.4,.55,.33)},
 {"id":"rosie","name":"Rosie Cotton","home":Vector3(18,0,8),"work":Vector3(8,0,10),"market":Vector3(11,0,12),"color":Color(.7,.42,.42)},
 {"id":"hob","name":"Hob Miller","home":Vector3(42,0,-10),"work":Vector3(30,0,-6),"market":Vector3(12,0,12),"color":Color(.45,.38,.3)},
 {"id":"rowan","name":"Rowan Baker","home":Vector3(18,0,18),"work":Vector3(7,0,12),"market":Vector3(9,0,8),"color":Color(.65,.48,.32)},
 {"id":"tansy","name":"Tansy","home":Vector3(-12,0,19),"work":Vector3(-11,0,11),"market":Vector3(6,0,12),"color":Color(.66,.5,.63)},
 {"id":"milo","name":"Milo","home":Vector3(-39,0,9),"work":Vector3(-36,0,12),"market":Vector3(9,0,12),"color":Color(.5,.47,.38)}
]

func _ready() -> void:
    for spec in {"forward":KEY_W,"back":KEY_S,"left":KEY_A,"right":KEY_D,"interact":KEY_E,"view":KEY_V,"sprint":KEY_SHIFT,"save":KEY_F5}:
        if not InputMap.has_action(spec): InputMap.add_action(spec)
        var e := InputEventKey.new()
        e.physical_keycode = {"forward":KEY_W,"back":KEY_S,"left":KEY_A,"right":KEY_D,"interact":KEY_E,"view":KEY_V,"sprint":KEY_SHIFT,"save":KEY_F5}[spec]
        InputMap.action_add_event(spec,e)
    env = WorldEnvironment.new()
    var environment := Environment.new()
    environment.background_mode = Environment.BG_SKY
    var sky := Sky.new()
    var material := ProceduralSkyMaterial.new()
    material.sky_top_color = Color(.42,.65,.81)
    material.sky_horizon_color = Color(.88,.78,.61)
    sky.sky_material = material
    environment.sky = sky
    environment.ambient_light_source = Environment.AMBIENT_SOURCE_SKY
    environment.fog_enabled = true
    environment.fog_density = .007
    env.environment = environment
    add_child(env)
    sun = DirectionalLight3D.new()
    sun.rotation_degrees = Vector3(-45,-40,0)
    sun.shadow_enabled = true
    sun.light_energy = 1.4
    add_child(sun)
    outside = Node3D.new()
    outside.name = "Hobbiton"
    add_child(outside)
    _build_land()
    _house(Vector3(-23,0,-20),8.2,Color(.25,.43,.25))
    for p in [Vector3(-8,0,30),Vector3(20,0,27),Vector3(32,0,-16),Vector3(-50,0,16)]:
        _house(p,4.0,Color(.35,.46,.29))
    _build_trees()
    inside = Node3D.new()
    inside.position = Vector3(1000,0,0)
    add_child(inside)
    _box(inside,Vector3(0,-.2,0),Vector3(16,.4,16),Color(.41,.28,.17),true)
    for x in [-8.,8.]:
        _box(inside,Vector3(x,2,0),Vector3(.4,4,16),Color(.59,.43,.31),true)
    _box(inside,Vector3(-2,.8,0),Vector3(4,.2,2),Color(.65,.43,.24))
    var lamp := OmniLight3D.new()
    lamp.light_color = Color(.98,.76,.47)
    lamp.light_energy = 1.5
    lamp.omni_range = 14
    lamp.position = Vector3(0,3,0)
    inside.add_child(lamp)
    for v in villagers:
        var p := Node3D.new()
        p.position = v["home"]+Vector3.UP
        outside.add_child(p)
        _ellipsoid(p,Vector3(0,.64,0),Vector3(.36,.5,.29),v["color"])
        _ellipsoid(p,Vector3(0,1.25,0),Vector3(.27,.3,.26),Color(.84,.66,.53))
        var tag := Label3D.new()
        tag.text = v["name"]
        tag.position.y = 2
        tag.font_size = 40
        tag.pixel_size = .008
        tag.billboard = BaseMaterial3D.BILLBOARD_ENABLED
        p.add_child(tag)
        npc_nodes[v["id"]] = p
        memories[v["id"]] = []
        links[v["id"]] = {"trust":50,"affinity":50}
    memories["bilbo"] = []
    links["bilbo"] = {"trust":80,"affinity":80}
    player = CharacterBody3D.new()
    player.set_script(HERO)
    player.position = Vector3(-23,2.5,-5)
    add_child(player)
    player.interact.connect(_interact)
    player.quick_save.connect(_save)
    _interface()
    _world_mode(false)

func _box(parent: Node3D, pos: Vector3, size: Vector3, color: Color, collision: bool=false) -> void:
    var n := MeshInstance3D.new()
    var mesh := BoxMesh.new()
    mesh.size = size
    n.mesh = mesh
    n.position = pos
    var material := StandardMaterial3D.new()
    material.albedo_color = color
    n.material_override = material
    parent.add_child(n)
    if collision: n.create_trimesh_collision()

func _ellipsoid(parent: Node3D, pos: Vector3, size: Vector3, color: Color) -> void:
    var n := MeshInstance3D.new()
    var mesh := SphereMesh.new()
    mesh.radius = 1
    mesh.height = 2
    n.mesh = mesh
    n.position = pos
    n.scale = size
    var material := StandardMaterial3D.new()
    material.albedo_color = color
    n.material_override = material
    parent.add_child(n)

func _disk(parent: Node3D, pos: Vector3, radius: float, color: Color) -> void:
    var n := MeshInstance3D.new()
    var mesh := CylinderMesh.new()
    mesh.top_radius = radius
    mesh.bottom_radius = radius
    mesh.height = .18
    n.mesh = mesh
    n.position = pos
    n.rotation.x = PI/2
    var material := StandardMaterial3D.new()
    material.albedo_color = color
    n.material_override = material
    parent.add_child(n)

func _build_land() -> void:
    var terrain := MeshInstance3D.new()
    var plane := PlaneMesh.new()
    plane.size = Vector2(180,180)
    terrain.mesh = plane
    var material := StandardMaterial3D.new()
    material.albedo_color = Color(.30,.44,.23)
    terrain.material_override = material
    outside.add_child(terrain)
    terrain.create_trimesh_collision()
    for i in range(75):
        _ellipsoid(outside,Vector3(-45+float(i)*1.2,.05,10.0+sin(i*.36)*1.4),Vector3(.5,.12,.42),Color(.48,.39,.27))
    for i in range(5):
        _box(outside,Vector3(i*4,0.5,16),Vector3(3,.2,1.5),Color(.55,.36,.20))
    for i in range(10):
        _box(outside,Vector3(43,.3,-10+i*3.2),Vector3(7,.16,2.5),Color(.52,.39,.25))

func _house(where: Vector3, radius: float, tint: Color) -> void:
    _ellipsoid(outside,where+Vector3(0,1.3,-3),Vector3(radius,radius*.46,radius*.9),tint)
    _disk(outside,where+Vector3(0,1.32,radius*.65-3),radius*.26,Color(.66,.56,.35))
    _disk(outside,where+Vector3(0,1.32,radius*.65-2.89),radius*.22,Color(.20,.42,.31))

func _build_trees() -> void:
    var trunks := MultiMesh.new()
    var crowns := MultiMesh.new()
    var stem := CylinderMesh.new()
    stem.top_radius = .3
    stem.bottom_radius = .47
    stem.height = 5
    var foliage := SphereMesh.new()
    foliage.radius = 2.2
    foliage.height = 3.6
    for item in [trunks,crowns]:
        item.transform_format = MultiMesh.TRANSFORM_3D
    trunks.mesh = stem
    crowns.mesh = foliage
    trunks.instance_count = 170
    crowns.instance_count = 170
    var random := RandomNumberGenerator.new()
    random.seed = 3001
    for i in range(170):
        var x := random.randf_range(-84,84)
        var z := random.randf_range(-84,84)
        if Vector2(x+23,z+20).length()<14: x+=18
        var scale := random.randf_range(.7,1.5)
        trunks.set_instance_transform(i,Transform3D(Basis.IDENTITY.scaled(Vector3.ONE*scale),Vector3(x,2.5*scale,z)))
        crowns.set_instance_transform(i,Transform3D(Basis.IDENTITY.scaled(Vector3.ONE*scale),Vector3(x,5*scale,z)))
    for info in [[trunks,Color(.37,.26,.15)],[crowns,Color(.22,.40,.23)]]:
        var group := MultiMeshInstance3D.new()
        group.multimesh = info[0]
        var material := StandardMaterial3D.new()
        material.albedo_color = info[1]
        group.material_override = material
        outside.add_child(group)

func _world_mode(enter: bool) -> void:
    indoors = enter
    outside.visible = not enter
    inside.visible = enter
    player.velocity = Vector3.ZERO
    player.position = Vector3(1000,1.7,3.2) if enter else Vector3(-23,1.7,-5)

func _interface() -> void:
    var layer := CanvasLayer.new()
    add_child(layer)
    hud = Label.new()
    hud.position = Vector2(20,20)
    hud.add_theme_font_size_override("font_size",20)
    hud.add_theme_color_override("font_color",Color(.97,.85,.61))
    layer.add_child(hud)
    panel = PanelContainer.new()
    panel.position = Vector2(250,425)
    panel.custom_minimum_size = Vector2(775,200)
    panel.visible = false
    layer.add_child(panel)
    var col := VBoxContainer.new()
    panel.add_child(col)
    line = Label.new()
    line.custom_minimum_size = Vector2(760,65)
    col.add_child(line)
    options = VBoxContainer.new()
    col.add_child(options)

func _process(dt: float) -> void:
    clock += dt
    var hour := fmod(6+clock/60,24)
    bad_weather = int(clock/280)%7==5
    sun.light_energy = (.18 if hour>19 or hour<5 else .7 if bad_weather else 1.35)
    sun.rotation_degrees.x = -15-45*maxf(0,sin((hour-5)*PI/15))
    if env.environment != null:
        env.environment.fog_density = .022 if bad_weather else .007
    for v in villagers:
        var p: Node3D = npc_nodes[v["id"]]
        var destination: Vector3 = v["home"] if bad_weather or hour<7 or hour>21 else v["work"] if hour<12 or hour>15 else v["market"]
        p.position = p.position.move_toward(destination+Vector3.UP,dt*.75)
    var quest_text := "Find Sam and speak to him." if not quest["sam"] else "Bring home provisions from the market." if not quest["bread"] else "Speak to Bilbo inside Bag End."
    hud.text = "SHIRE JOURNEY - Godot 3D\n%02d:%02d  |  22 Halimath 3001\n%s  |  E: interact  V: camera  F5: save\n%s" % [int(hour),int((hour-int(hour))*60),"Rain" if bad_weather else "Clear",quest_text]

func _interact() -> void:
    if panel.visible: return
    if indoors:
        if player.position.distance_to(Vector3(1000,1,-2))<4:
            _talk("bilbo")
        else:
            _world_mode(false)
        return
    for v in villagers:
        if player.position.distance_to(npc_nodes[v["id"]].position)<3.2:
            _talk(v["id"])
            return
    if player.position.distance_to(Vector3(-23,1,-12))<7:
        _world_mode(true)
        return
    if player.position.distance_to(Vector3(8,1,10))<8:
        quest["bread"] = true
        _save()
        return

func _talk(id: String) -> void:
    focus = id
    panel.visible = true
    player.enabled = false
    Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
    var who := "Bilbo Baggins" if id=="bilbo" else id.capitalize()
    var recall := "I remember our earlier talk." if memories[id].size()>0 else "There's work to be done in the Shire."
    line.text = who+": "+recall+"\n"+("ما زلت أتذكر حديثنا." if memories[id].size()>0 else "لدينا عمل كثير في الشاير.")
    for node in options.get_children(): node.queue_free()
    for label in ["How is the day? | كيف يمضي يومك؟","Can I help? | هل أساعدك؟","Goodbye | إلى اللقاء"]:
        var button := Button.new()
        button.text = label
        button.pressed.connect(func():_choice(id,label))
        options.add_child(button)

func _choice(id: String, label: String) -> void:
    if label.begins_with("Goodbye"):
        panel.visible = false
        player.enabled = true
        Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
        return
    memories[id].append({"day":int(clock/1440),"topic":label})
    links[id]["trust"]=mini(100,links[id]["trust"]+2)
    if id=="sam": quest["sam"]=true
    if id=="bilbo": quest["bilbo"]=true
    line.text = "A little kindness makes a home.\nالقليل من اللطف يجعل الدار بيتًا."
    _save()

func _save() -> void:
    var f := FileAccess.open(SAVE,FileAccess.WRITE)
    if f != null:
        f.store_string(JSON.stringify({"clock":clock,"quest":quest,"memories":memories,"links":links,"indoors":indoors}, "  "))
        f.close()
