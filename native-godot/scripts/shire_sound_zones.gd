class_name ShireSoundZones
extends Node3D
## ORIGINAL-GAME sound design: original offline synthesized textures supplement
## existing original birds, stream and rain recordings. No film stems or actor VO.
const RATE := 16000
const LENGTH := 2
var wind: AudioStreamPlayer
var garden: AudioStreamPlayer3D
var market: AudioStreamPlayer3D
var mill: AudioStreamPlayer3D
var _rng := RandomNumberGenerator.new()

func _texture(kind: String, seed: int) -> AudioStreamWAV:
    _rng.seed = seed
    var raw := PackedByteArray()
    raw.resize(RATE * LENGTH * 2)
    var low := 0.0
    var mid := 0.0
    var strike := 0.0
    var tw := 0.0
    for frame in range(RATE * LENGTH):
        var t := float(frame) / float(RATE)
        var noise := _rng.randf_range(-1.0,1.0)
        low = low * .992 + noise * .008
        mid = mid * .83 + noise * .17
        var sound := 0.0
        match kind:
            "wind":
                sound = low * .66 + mid * .035 + sin(t * TAU * .45) * low * .12
            "garden":
                var song := maxf(0.0,sin(t * TAU * 7.3)) * maxf(0.0,sin(t * TAU * 1.1))
                sound = sin(t * TAU * (875.0 + sin(t*TAU*1.8)*165.0)) * song * .065 + low*.035
            "market":
                # Indistinct foley: cart wheels, footsteps and timber, not imitation speech.
                if _rng.randf()<.0008:
                    strike=_rng.randf_range(-.36,.36)
                strike*=.86
                sound = (mid*.07 + low*.11 + strike*.35 + sin(t*TAU*34.0)*.028)
            "mill":
                if frame % (RATE / 3) < 1:
                    strike=_rng.randf_range(.20,.42)
                strike*=.985
                sound = strike*sin(t*TAU*49.0) + low*.07
            _:
                sound=0.0
        raw.encode_s16(frame*2,int(clampf(sound,-.78,.78)*32767.0))
    var output := AudioStreamWAV.new()
    output.format=AudioStreamWAV.FORMAT_16_BITS
    output.mix_rate=RATE
    output.stereo=false
    output.loop_mode=AudioStreamWAV.LOOP_FORWARD
    output.data=raw
    return output

func _spatial(kind: String, where: Vector3, maximum: float, volume: float, seed: int) -> AudioStreamPlayer3D:
    var node:=AudioStreamPlayer3D.new()
    node.name=kind.capitalize()+"SoundZone"
    node.stream=_texture(kind,seed)
    node.position=where
    node.max_distance=maximum
    node.unit_size=8.0
    node.volume_db=volume
    add_child(node)
    node.play()
    return node

func _ready() -> void:
    wind=AudioStreamPlayer.new()
    wind.name="WindAtmosphere"
    wind.stream=_texture("wind",10230)
    wind.volume_db=-28.0
    add_child(wind)
    wind.play()
    garden=_spatial("garden",Vector3(-30,5,-13),28,-17,1303)
    market=_spatial("market",Vector3(17,2,8),38,-15,1387)
    mill=_spatial("mill",Vector3(32,2,-20),38,-17,3997)

func update_zones(hour: float, weather_kind: String, indoors: bool, delta: float) -> void:
    var stormy := weather_kind in ["storm","heavy_rain"]
    var evening := hour < 6.0 or hour > 21.0
    var smoothing := minf(delta*.75,1.0)
    wind.volume_db=lerpf(wind.volume_db,-42.0 if indoors else -17.0 if stormy else -28.0,smoothing)
    garden.volume_db=lerpf(garden.volume_db,-54.0 if evening or stormy else -18.0,smoothing)
    market.volume_db=lerpf(market.volume_db,-54.0 if evening or stormy else -18.0,smoothing)
    mill.volume_db=lerpf(mill.volume_db,-54.0 if evening else -20.0,smoothing)
