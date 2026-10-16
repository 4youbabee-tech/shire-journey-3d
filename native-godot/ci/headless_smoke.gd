extends SceneTree
# Run via: godot --headless --path native-godot --script res://ci/headless_smoke.gd
# Regression checks for calendar rollover and deterministic weather across instances.
func _initialize() -> void:
    var clock = load("res://scripts/shire_clock.gd").new()
    if clock.day() != 22 or clock.month_name() != "Halimath":
        push_error("FAIL: Shire start day invalid")
        quit(2)
        return
    clock.advance(1440.0)
    if clock.day() != 23 or clock.story_year != 3001:
        push_error("FAIL: clock advance invalid")
        quit(3)
        return

    var weather_script = load("res://scripts/shire_weather.gd")
    var weather = weather_script.new()
    var independent_weather = weather_script.new()
    for seconds in [0.0, 150.0, 299.0, 300.0, 1800.0, 86400.0]:
        var kind: String = weather.type_at(seconds)
        if not kind in weather.KINDS:
            push_error("FAIL: unknown weather kind at %s" % seconds)
            quit(4)
            return
        if kind != independent_weather.type_at(seconds):
            push_error("FAIL: weather not deterministic across instances at %s" % seconds)
            quit(5)
            return
    weather.override_kind = "heavy_rain"
    if weather.type_at(150.0) != "heavy_rain" or not weather.is_raining(150.0):
        push_error("FAIL: rain override or rain state incorrect")
        quit(6)
        return
    weather.override_kind = "clear"
    if weather.is_raining(150.0) or weather.darkness_at(150.0) != 0.0:
        push_error("FAIL: clear weather state incorrect")
        quit(7)
        return

    print("PASS: Native Godot clock rollover, weather determinism and overrides")
    quit(0)
