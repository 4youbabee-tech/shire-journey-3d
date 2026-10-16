class_name ShireClock
extends RefCounted
## ORIGINAL-GAME simulation. 24 real minutes per in-game day.
## AR: separates the 3001 birthday memory from 3018 departure chronology.
const MONTHS := ["Afteryule", "Solmath", "Rethe", "Astron", "Thrimidge", "Forelithe", "Afterlithe", "Wedmath", "Halimath", "Winterfilth", "Blotmath", "Foreyule"]
const WEEKDAYS := ["Sterday", "Sunday", "Monday", "Trewsday", "Hevensday", "Mersday", "Highday"]
const REAL_DAY := 1440.0
var elapsed := 0.0
var story_year := 3001
var stopped := false
var scheduled : Array[Dictionary] = []

func advance(dt: float) -> void:
    if stopped:
        return
    var before := absolute_game_minutes()
    elapsed += maxf(dt, 0.0)
    var after := absolute_game_minutes()
    for event in scheduled:
        if not event.get("fired", false) and before < float(event.get("at", 0.0)) and after >= float(event.get("at", 0.0)):
            event["fired"] = true
            var callback : Callable = event.get("callback", Callable())
            if callback.is_valid():
                callback.call()

func absolute_game_minutes() -> float:
    return elapsed * 60.0

func hour_value() -> float:
    return fposmod(6.0 + elapsed / 60.0, 24.0)

func day_index() -> int:
    return int(floor(elapsed / REAL_DAY))

func month_index() -> int:
    return (8 + int(floor((21 + day_index()) / 30.0))) % 12

func day() -> int:
    return (21 + day_index()) % 30 + 1

func month_name() -> String:
    return MONTHS[month_index()]

func weekday() -> String:
    return WEEKDAYS[(1 + day_index()) % 7]

func phase() -> String:
    var h := hour_value()
    if h >= 5.0 and h < 7.0:
        return "dawn"
    if h >= 7.0 and h < 11.0:
        return "morning"
    if h >= 11.0 and h < 14.0:
        return "noon"
    if h >= 14.0 and h < 18.0:
        return "afternoon"
    if h >= 18.0 and h < 20.0:
        return "dusk"
    return "night"

func light_factor() -> float:
    var h := hour_value()
    if h >= 5.0 and h < 7.0:
        return smoothstep(5.0, 7.0, h)
    if h >= 18.0 and h < 20.0:
        return 1.0 - smoothstep(18.0, 20.0, h)
    return 1.0 if h >= 7.0 and h < 18.0 else 0.0

func moon_phase() -> float:
    return fposmod(float(day_index()) / 28.0, 1.0)

func schedule_event(at_game_minute: float, callback: Callable) -> void:
    scheduled.append({"at":at_game_minute, "callback":callback, "fired":false})

func stamp() -> String:
    var h := int(hour_value())
    var m := int(floor(fposmod(hour_value(), 1.0) * 60.0))
    return "%s %d %s, T.A. %d | %02d:%02d" % [weekday(), day(), month_name(), story_year, h, m]

func pack() -> Dictionary:
    return {"elapsed":elapsed, "story_year":story_year}

func unpack(raw: Dictionary) -> void:
    elapsed = clampf(float(raw.get("elapsed", 0.0)), 0.0, 99999999.0)
    story_year = clampi(int(raw.get("story_year", 3001)), 3001, 3018)