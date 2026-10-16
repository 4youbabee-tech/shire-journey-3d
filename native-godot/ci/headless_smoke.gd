extends SceneTree
# Run via: godot --headless --path native-godot --script res://ci/headless_smoke.gd
func _initialize() -> void:
    var script=load("res://scripts/shire_clock.gd")
    var sim=script.new()
    if sim.day()!=22 or sim.month_name()!="Halimath":
        push_error("FAIL: Shire start day invalid")
        quit(2)
        return
    sim.advance(1440.0)
    if sim.day()!=23 or sim.story_year!=3001:
        push_error("FAIL: clock advance invalid")
        quit(3)
        return
    var weather=load("res://scripts/shire_weather.gd").new()
    if weather.type_at(150.0)!=weather.type_at(150.0):
        push_error("FAIL: nondeterministic weather")
        quit(4)
        return
    print("PASS: Native Godot clock and weather tests")
    quit(0)