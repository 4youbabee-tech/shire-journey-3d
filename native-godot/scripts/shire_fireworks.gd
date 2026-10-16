class_name ShireFireworks
extends Node3D
## FILM MOMENT ACT_F1_02, inspired by project Gameplay Bible.
## Optional, deterministic one-time celebration. Never modifies story outcomes.
## All particles and sound are generated at runtime; no film score or assets.
const STATION := Vector2(5.0,-9.0)
const ACTIVE_FROM := 3
const ACTIVE_UNTIL := 5
const BURST_PALETTE := [Color("f5d28c"),Color("aac4e5"),Color("ecb0a5")]
var launched := false
var effect: Node3D
var elapsed := 0.0
var sound: AudioStreamPlayer3D

func _ready() -> void:
    name="BirthdayFireworkShow"
    effect=Node3D.new()
    effect.name="OriginalParticleFireworks"
    add_child(effect)
    sound=AudioStreamPlayer3D.new()
    sound.max_distance=42.0
    sound.volume_db=-18.0
    sound.stream=_generate_pop()
    add_child(sound)

func can_interact(world_position: Vector3, stage: int) -> bool:
    if launched or stage<ACTIVE_FROM or stage>=ACTIVE_UNTIL:
        return false
    return Vector2(world_position.x,world_position.z).distance_to(STATION)<2.8

func _generate_pop() -> AudioStreamWAV:
    const RATE := 16000
    const DURATION := .55
    var data := PackedByteArray()
    data.resize(int(RATE*DURATION)*2)
    var envelope := 0.0
    var rng := RandomNumberGenerator.new()
    rng.seed=3001
    for i in range(int(RATE*DURATION)):
        var t: float=float(i)/float(RATE)
        envelope=exp(-t*15.0)
        var waveform: float=(sin(TAU*125.0*t)*.65+rng.randf_range(-1.0,1.0)*.28)*envelope*.24
        data.encode_s16(i*2,int(clampf(waveform,-.95,.95)*32767.0))
    var result := AudioStreamWAV.new()
    result.format=AudioStreamWAV.FORMAT_16_BITS
    result.mix_rate=RATE
    result.stereo=false
    result.data=data
    return result

func _burst(color: Color, origin: Vector3, offset: float) -> void:
    var cloud:=CPUParticles3D.new()
    cloud.name="Burst"
    cloud.position=origin
    cloud.amount=54
    cloud.lifetime=1.65
    cloud.one_shot=true
    cloud.explosiveness=1.0
    cloud.emission_shape=CPUParticles3D.EMISSION_SHAPE_SPHERE
    cloud.emission_sphere_radius=.08
    cloud.direction=Vector3.UP
    cloud.spread=180.0
    cloud.gravity=Vector3(0,-2.25,0)
    cloud.initial_velocity_min=3.3+offset
    cloud.initial_velocity_max=5.4+offset
    cloud.scale_amount_min=.35
    cloud.scale_amount_max=.90
    cloud.color=color
    var speck:=SphereMesh.new()
    speck.radius=.045
    speck.height=.09
    speck.radial_segments=6
    speck.rings=4
    cloud.mesh=speck
    effect.add_child(cloud)
    cloud.emitting=true

func launch(stage: int) -> Dictionary:
    if launched or stage<ACTIVE_FROM or stage>=ACTIVE_UNTIL:
        return {}
    launched=true
    elapsed=0.0
    var origin:=Vector3(STATION.x,5.8,STATION.y)
    for i in range(BURST_PALETTE.size()):
        var direction_offset:=Vector3(float(i-1)*2.3,float(i%2)*1.0,float(i%2)*1.7)
        _burst(BURST_PALETTE[i],origin+direction_offset,float(i)*.5)
    sound.position=origin
    sound.play()
    return {
        "id":"gandalf_fireworks",
        "en":"Gandalf's fireworks scatter sparks above the birthday field. The neighbours cheer.",
        "ar":"تتناثر شرارات ألعاب غاندالف النارية فوق حقل الاحتفال، ويهتف الجيران."
    }

func _process(delta: float) -> void:
    if effect==null or effect.get_child_count()==0:
        return
    elapsed+=delta
    if elapsed>3.5:
        for child in effect.get_children():
            child.queue_free()

func pack() -> Dictionary:
    return {"launched":launched}

func unpack(saved: Dictionary) -> void:
    launched=saved.get("launched",false)==true
    if effect != null:
        for child in effect.get_children():
            child.queue_free()

func reset() -> void:
    launched=false
    elapsed=0.0
    if effect != null:
        for child in effect.get_children():
            child.queue_free()
