class_name ShireFootsteps
extends Node3D
## ORIGINAL-GAME synthesized movement foley; no unauthorized sound recordings.
const RATE := 16000
var on_wood := false
var elapsed := 0.0
var player: AudioStreamPlayer3D
var soil: AudioStreamWAV
var wood: AudioStreamWAV
var is_running := false

func _sample(wooden: bool) -> AudioStreamWAV:
    var rng:=RandomNumberGenerator.new()
    rng.seed=91283 if wooden else 31827
    var pcm:=PackedByteArray()
    var n: int=RATE/6
    pcm.resize(n*2)
    var low:=0.0
    for i in range(n):
        var t: float=float(i)/float(RATE)
        var pulse: float=exp(-t*38.0)
        var noise: float=rng.randf_range(-1.0,1.0)
        low=low*.77+noise*.23
        var signal_value: float=(sin(t*TAU*(180.0 if wooden else 95.0))*pulse*.31+low*pulse*.17)
        pcm.encode_s16(i*2,int(clampf(signal_value,-.93,.93)*32767))
    var wave:=AudioStreamWAV.new()
    wave.mix_rate=RATE
    wave.format=AudioStreamWAV.FORMAT_16_BITS
    wave.stereo=false
    wave.data=pcm
    return wave

func _ready() -> void:
    name="OriginalFootsteps"
    soil=_sample(false)
    wood=_sample(true)
    player=AudioStreamPlayer3D.new()
    player.volume_db=-20.0
    player.max_distance=15.0
    player.unit_size=3.0
    add_child(player)

func tick(movement_speed: float, grounded: bool, active: bool, delta: float) -> void:
    if not grounded or not active or movement_speed < 1.2:
        elapsed=0.0
        return
    is_running=movement_speed>6.0
    elapsed+=delta
    var interval: float=.29 if is_running else .45
    if elapsed>=interval:
        elapsed=fmod(elapsed,interval)
        player.stream=wood if on_wood else soil
        player.pitch_scale=(1.03 if is_running else .93)
        player.play()
