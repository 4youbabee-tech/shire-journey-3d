class_name ShireBagEnd
extends Node3D
## ORIGINAL-GAME explorable Bag End interior. Instantiated only when the player enters.
## Low-spec geometry: reusable materials, no external textures or copyrighted film assets.
const ENTRY := Vector3(0.0, 0.24, 2.8)
const EXIT := Vector3(0.0, 0.0, 6.45)
const STUDY := Vector3(-6.25, 0.0, -0.4)
const PANTRY := Vector3(6.25, 0.0, -1.3)
const HEARTH := Vector3(0.0, 0.0, -4.55)
var _materials: Dictionary = {}

func _ready() -> void:
    _build()
    _hearth_sound()

func _mat(hex: String, rough: float = 0.87, glow: bool = false) -> StandardMaterial3D:
    var key := hex + str(rough) + str(glow)
    if _materials.has(key):
        return _materials[key]
    var result := StandardMaterial3D.new()
    result.albedo_color = Color(hex)
    result.roughness = rough
    if glow:
        result.emission_enabled = true
        result.emission = Color(hex) * 0.65
    _materials[key] = result
    return result

func _block(at: Vector3, size: Vector3, color: String, collision: bool = false) -> void:
    var mesh := MeshInstance3D.new()
    var shape := BoxMesh.new()
    shape.size = size
    mesh.mesh = shape
    mesh.material_override = _mat(color)
    if collision:
        var static_body := StaticBody3D.new()
        static_body.position = at
        add_child(static_body)
        var collider := CollisionShape3D.new()
        var box := BoxShape3D.new()
        box.size = size
        collider.shape = box
        static_body.add_child(collider)
        static_body.add_child(mesh)
    else:
        mesh.position = at
        add_child(mesh)

func _round(at: Vector3, radius: float, height: float, color: String, sideways: bool = false, solid: bool = false) -> void:
    var mesh := MeshInstance3D.new()
    var cyl := CylinderMesh.new()
    cyl.top_radius = radius
    cyl.bottom_radius = radius
    cyl.height = height
    cyl.radial_segments = 32
    mesh.mesh = cyl
    mesh.position = at
    if sideways:
        mesh.rotation.x = PI / 2.0
    mesh.material_override = _mat(color)
    if solid:
        var static_body := StaticBody3D.new()
        static_body.position = at
        add_child(static_body)
        mesh.position = Vector3.ZERO
        static_body.add_child(mesh)
        var collider := CollisionShape3D.new()
        var cylinder := CylinderShape3D.new()
        cylinder.radius = radius
        cylinder.height = height
        collider.shape = cylinder
        static_body.add_child(collider)
    else:
        add_child(mesh)

func _sphere(at: Vector3, size: Vector3, color: String) -> void:
    var mesh := MeshInstance3D.new()
    mesh.mesh = SphereMesh.new()
    mesh.position = at
    mesh.scale = size
    mesh.material_override = _mat(color)
    add_child(mesh)

func _light(at: Vector3, strength: float = 1.4) -> void:
    var light := OmniLight3D.new()
    light.position = at
    light.light_color = Color("ffe4aa")
    light.light_energy = strength
    light.omni_range = 9.0
    light.shadow_enabled = false
    add_child(light)

func _hearth_sound() -> void:
    # Original procedurally synthesized fire; no downloaded film samples.
    const RATE := 16000
    const SECONDS := 2
    var raw := PackedByteArray()
    raw.resize(RATE * SECONDS * 2)
    var random := RandomNumberGenerator.new()
    random.seed = 940172
    var low_noise := 0.0
    var snap := 0.0
    for frame in range(RATE * SECONDS):
        low_noise = low_noise * 0.96 + random.randf_range(-1.0, 1.0) * 0.04
        if random.randf() < 0.002:
            snap = random.randf_range(-1.0, 1.0)
        snap *= 0.84
        var sample := clampf(low_noise * 0.19 + snap * 0.26, -0.85, 0.85)
        raw.encode_s16(frame * 2, int(sample * 32767.0))
    var stream := AudioStreamWAV.new()
    stream.format = AudioStreamWAV.FORMAT_16_BITS
    stream.mix_rate = RATE
    stream.stereo = false
    stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
    stream.data = raw
    var hearth_audio := AudioStreamPlayer3D.new()
    hearth_audio.name = "HearthFireOriginalAudio"
    hearth_audio.stream = stream
    hearth_audio.position = Vector3(0.0, 1.0, -4.9)
    hearth_audio.max_distance = 12.0
    hearth_audio.unit_size = 2.5
    hearth_audio.volume_db = -12.0
    add_child(hearth_audio)
    hearth_audio.play()

func _build() -> void:
    name = "BagEndInterior"
    # Three connected rooms; two genuine passages and an entry vestibule.
    _block(Vector3(0, -0.22, 0), Vector3(18.0, 0.44, 14.0), "8c6847", true)
    _block(Vector3(0, 3.7, 0), Vector3(18, 0.34, 14), "aa8e65", true)
    for z in [-7.0, 7.0]:
        if z < 0.0:
            _block(Vector3(0, 1.8, z), Vector3(18.0, 3.6, 0.42), "bc9d73", true)
        else:
            _block(Vector3(-5.0, 1.8, z), Vector3(8.0, 3.6, 0.42), "bc9d73", true)
            _block(Vector3(5.0, 1.8, z), Vector3(8.0, 3.6, 0.42), "bc9d73", true)
            _block(Vector3(0, 3.12, z), Vector3(2.2, 1.36, 0.42), "bc9d73", true)
    for x in [-9.0, 9.0]:
        _block(Vector3(x, 1.8, 0), Vector3(0.42, 3.6, 14.0), "b99a70", true)
    for x in [-3.55, 3.55]:
        for z in [-4.35, 4.35]:
            _block(Vector3(x, 1.8, z), Vector3(0.32, 3.6, 5.3), "b99a70", true)
        _block(Vector3(x, 3.12, 0), Vector3(0.32, 1.15, 3.4), "b99a70", true)
        for z in [-1.65, 1.65]:
            _block(Vector3(x, 1.45, z), Vector3(0.45, 2.9, 0.28), "664329")
    # Wooden joists, floor runners and entrance.
    for z in [-5.2, -1.0, 3.2]:
        _block(Vector3(0, 3.45, z), Vector3(17.6, 0.24, 0.28), "5a3926")
    _block(Vector3(0, 0.018, 2.2), Vector3(2.15, 0.03, 7.8), "944b33")
    _block(Vector3(0, 0.04, -2.4), Vector3(3.9, 0.04, 3.6), "793b36")
    _round(Vector3(0, 1.35, 6.87), 1.30, 0.12, "416c35", true)
    _sphere(Vector3(0.65, 1.32, 6.70), Vector3(0.11, 0.11, 0.11), "d4a352")
    # Living room: usable central table, hearth, shelves and domestic props.
    _round(Vector3(-0.65, 0.86, 0.15), 1.1, 0.16, "745034", false, true)
    for x in [-1.30, 0.0]:
        for z in [-0.35, 0.65]:
            _block(Vector3(x, 0.40, z), Vector3(0.18, 0.8, 0.19), "513522")
    for x in [-2.5, 1.85]:
        _block(Vector3(x, 0.44, 1.1), Vector3(0.85, 0.16, 0.86), "715035")
        _block(Vector3(x, 0.93, 1.54), Vector3(0.85, 0.9, 0.19), "715035")
    _block(Vector3(0, 1.35, -6.65), Vector3(2.5, 2.50, 0.76), "6d6154", true)
    _block(Vector3(0, 0.52, -6.18), Vector3(1.50, 0.85, 0.30), "291e19")
    _block(Vector3(0, 1.78, -6.10), Vector3(1.50, 0.22, 0.35), "291e19")
    _sphere(Vector3(-0.3, 0.36, -6.0), Vector3(0.38, 0.30, 0.13), "df8336")
    _sphere(Vector3(0.25, 0.43, -6.0), Vector3(0.31, 0.46, 0.14), "f2af4e")
    _light(Vector3(0, 2.25, -4.3), 1.8)
    for z in [-3.65, -1.5]:
        _block(Vector3(3.1, 1.48, z), Vector3(0.48, 2.55, 1.65), "5b402b")
        for y in [0.65, 1.35, 2.05]:
            _block(Vector3(2.79, y, z), Vector3(0.65, 0.09, 1.7), "9b7545")
    # Study/bedroom: writing desk, book collection, sleeping place.
    _block(Vector3(-6.35, 0.88, -1.2), Vector3(2.1, 0.19, 1.2), "765035", true)
    for x in [-7.1, -5.6]:
        _block(Vector3(x, 0.42, -1.2), Vector3(0.18, 0.82, 0.18), "513522")
    _block(Vector3(-6.35, 0.99, -1.35), Vector3(0.6, 0.06, 0.42), "e1cb9e")
    _block(Vector3(-7.4, 1.5, -5.0), Vector3(2.25, 2.6, 0.6), "5d3e2b")
    for shelf in [0.55, 1.25, 1.95]:
        _block(Vector3(-7.4, shelf, -4.69), Vector3(2.3, 0.12, 0.62), "ad8254")
        for i in range(9):
            var shades := ["7a4734", "59705e", "bd985c", "525d7e"]
            _block(Vector3(-8.25 + i * 0.22, shelf + 0.2, -4.67), Vector3(0.15, 0.32, 0.3), shades[i % shades.size()])
    _block(Vector3(-6.1, 0.43, 4.3), Vector3(2.95, 0.65, 2.0), "6c4d35", true)
    _block(Vector3(-6.1, 0.81, 4.3), Vector3(2.7, 0.16, 1.78), "a59775")
    _block(Vector3(-6.1, 0.93, 5.05), Vector3(1.3, 0.18, 0.53), "e7d9af")
    _light(Vector3(-6.0, 2.7, -0.2), 1.0)
    # Pantry/kitchen: table, barrels, hanging copper cookware and cupboards.
    _block(Vector3(6.1, 0.93, -0.5), Vector3(2.3, 0.20, 1.3), "8b643d", true)
    for x in [5.25, 6.95]:
        for z in [-0.95, -0.05]:
            _block(Vector3(x, 0.46, z), Vector3(0.20, 0.90, 0.21), "57402c")
    for x in [5.0, 6.5, 8.0]:
        _round(Vector3(x, 0.52, 4.55), 0.53, 1.03, "80552f")
        _round(Vector3(x, 1.08, 4.55), 0.56, 0.11, "503721")
    for x in [5.05, 6.3, 7.55]:
        _round(Vector3(x, 1.7, -5.7), 0.42, 0.12, "a47744")
    _block(Vector3(7.7, 1.22, -1.4), Vector3(0.9, 2.22, 2.2), "765537")
    _light(Vector3(6.0, 2.7, 1.0), 1.15)

func interaction_at(local_position: Vector3) -> String:
    if local_position.distance_to(EXIT) < 2.3:
        return "exit"
    if local_position.distance_to(STUDY) < 2.0:
        return "study"
    if local_position.distance_to(PANTRY) < 2.0:
        return "pantry"
    if local_position.distance_to(HEARTH) < 2.0:
        return "hearth"
    return ""
