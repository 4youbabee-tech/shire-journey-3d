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

    # The side-quest contract runs in existing CI without dispatching a second workflow.
    var errand_script = load("res://scripts/shire_neighbour_errands.gd")
    var errands = errand_script.new()
    if not errands.complete("mill_flour",0).is_empty() or not errands.complete("garden_herbs",5).is_empty():
        push_error("FAIL: Birthday errands bypassed order or chapter era")
        quit(81)
        return
    for stop in errand_script.STOPS:
        var pos: Vector2=stop["pos"]
        if str(errands.available_at(Vector3(pos.x,0,pos.y),0).get("id","")) != str(stop["id"]):
            push_error("FAIL: Errand location inaccessible "+str(stop["id"]))
            quit(82)
            return
        if errands.complete(str(stop["id"]),0).is_empty():
            push_error("FAIL: Errand could not be completed")
            quit(83)
            return
    if errands.progress()!=3 or not errands.current().is_empty():
        push_error("FAIL: Neighbour delivery did not finish")
        quit(84)
        return
    var replay=errand_script.new()
    replay.unpack(errands.pack())
    if replay.progress()!=3:
        push_error("FAIL: Neighbour errand save/load regression")
        quit(85)
        return
    replay.unpack({"completed":{"mill_flour":true}})
    if replay.progress()!=0:
        push_error("FAIL: Corrupted save allowed errand sequence skip")
        quit(86)
        return

    print("PASS: Native Godot clock rollover, weather determinism and overrides")
    quit(0)
