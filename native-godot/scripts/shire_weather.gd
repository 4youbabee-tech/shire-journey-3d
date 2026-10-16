class_name ShireWeather
extends RefCounted
## Weather is seeded and reproducible across save/load; no network required.
const KINDS := ["clear", "cloudy", "overcast", "light_rain", "heavy_rain", "storm", "mist", "fog"]
var seed := 3018
var override_kind := ""
func type_at(seconds: float) -> String:
    if override_kind != "":
        return override_kind
    var slot := int(floor(seconds / 300.0))
    var rng := RandomNumberGenerator.new()
    rng.seed = seed + slot * 99173
    var r := rng.randf()
    if r < 0.37: return "clear"
    if r < 0.56: return "cloudy"
    if r < 0.65: return "overcast"
    if r < 0.82: return "light_rain"
    if r < 0.88: return "heavy_rain"
    if r < 0.92: return "storm"
    if r < 0.97: return "mist"
    return "fog"
func blend_at(seconds: float) -> float:
    return smoothstep(0.0, 180.0, fposmod(seconds, 300.0))
func darkness_at(seconds: float) -> float:
    var kind := type_at(seconds)
    var amount := {"clear":0.0,"cloudy":0.1,"overcast":0.25,"light_rain":0.35,"heavy_rain":0.50,"storm":0.64,"mist":0.18,"fog":0.26}
    return float(amount.get(kind, 0.0)) * blend_at(seconds)
func is_raining(seconds: float) -> bool:
    return type_at(seconds) in ["light_rain", "heavy_rain", "storm"] and blend_at(seconds) > 0.3