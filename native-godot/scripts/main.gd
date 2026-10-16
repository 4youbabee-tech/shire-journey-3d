extends Node3D
## SHIRE JOURNEY CHAPTER I: native Godot 4.3+ gameplay, not an HTML wrapper.
## Provenance: ORIGINAL-GAME gameplay based on film/book timelines without copying film dialogue.
const WorldScript=preload("res://scripts/shire_world.gd")
const PlayerScript=preload("res://scripts/player.gd")
const NPCScript=preload("res://scripts/shire_npc.gd")
const AnimalScript=preload("res://scripts/shire_animal.gd")
const ClockScript=preload("res://scripts/shire_clock.gd")
const WeatherScript=preload("res://scripts/shire_weather.gd")
const DialogueScript=preload("res://scripts/shire_dialogue.gd")
const SocialScript=preload("res://scripts/shire_social.gd")
const BagEndScript=preload("res://scripts/shire_bag_end.gd")
const ActivityScript=preload("res://scripts/shire_activities.gd")
const MapScript=preload("res://scripts/shire_map.gd")
const CottageScript=preload("res://scripts/shire_cottage.gd")
const SAVE_FILE="user://shire_journey_godot_save_v2.json"
var social: ShireSocial
var activities: ShireActivities
var shire: ShireWorld
var frodo: ShirePlayer
var clock: ShireClock
var weather: ShireWeather
var npcs: Dictionary={}
var animals: Array[ShireAnimal]=[]
var last_animal_tick:=0.0
var hud: CanvasLayer
var top_label: Label
var quest_label: Label
var prompt_label: Label
var tutorial_label: Label
var fps_label: Label
var dialogue_panel: PanelContainer
var dialogue_title: Label
var dialogue_text: Label
var dialogue_ar: Label
var choices: VBoxContainer
var pause_panel: PanelContainer
var stage:=0
var quest_flags: Dictionary={"market_supplies":false,"sam_joined":false}
var interact_npc: ShireNPC
var talking: ShireNPC
var in_conversation:=false
var paused_by_user:=false
var last_npc_update:=0.0
var autosave:=0.0
var elapsed_show:=0.0
var ambience: AudioStreamPlayer
var rain_audio: AudioStreamPlayer
var stream_audio: AudioStreamPlayer3D
var world_seed:=24
var start_notice_timer:=10.0
var inside_bag_end := false
var inside_cottage := false
var cottage_interior: ShireCottage
var current_cottage_id := ""
var current_cottage_name := ""
var camera_before_bag_end := false
var bag_end_interior: ShireBagEnd
var exterior_return := Vector3.ZERO
const BAG_END_ENTRANCE := Vector2(-24.0, -26.32)
const COTTAGE_DOORS := [
    ["bagshot_cottage","Bagshot Row Home",-44.0,-30.44],
    ["garden_cottage","North Garden Home",-45.0,-7.29],
    ["hill_cottage","South Hill Home",-18.0,-43.52],
    ["northern_cottage","North Lane Home",2.0,26.28],
    ["market_cottage","Market Hill Home",18.0,23.52]
]
const INTERIOR_ORIGIN := Vector3(1000.0, 0.0, 1000.0)
var nearest_landmark_id: String = ""
var nearest_landmark_distance: float = 99.0
var map_panel: PanelContainer
var map_view: ShireMap
var journal_panel: PanelContainer
var journal_body: Label
var landmark_pulse := 0.0
const LANDMARKS = [
    ["bagend", "Bag End", "منزل باغ إند", -24.0, -20.0],
    ["bagshot", "Bagshot Row", "صف باغشوت", -44.0, -26.0],
    ["party", "Party Field", "حقل الاحتفال", -2.0, -3.0],
    ["market", "Hobbiton Market", "سوق هوبيتون", 17.0, 8.0],
    ["mill", "The Old Mill", "الطاحونة القديمة", 32.0, -20.0],
    ["bridge", "Water Bridge", "جسر النهر", 41.0, 8.0],
    ["fields", "Southern Fields", "الحقول الجنوبية", -62.0, 28.0],
    ["garden", "Sam\'s Garden", "حديقة سام", -30.0, -13.0],
    ["lane", "Northern Lane", "الطريق الشمالي", 9.0, 65.0],
    ["willows", "River Willows", "صفصاف النهر", 43.0, -42.0]
]

func _ready() -> void:
    social=SocialScript.new()
    activities=ActivityScript.new()
    clock=ClockScript.new()
    weather=WeatherScript.new()
    shire=WorldScript.new()
    shire.name="LivingHobbiton"
    add_child(shire)
    frodo=PlayerScript.new()
    frodo.position=_ground(-30,-36)
    frodo.position.y+=.25
    add_child(frodo)
    frodo.yaw=2.71
    frodo.rotation.y=2.71
    _people()
    _animals()
    _soundscape()
    _interface()
    _refresh_story_entities()
    social.record("homecoming", "Awoke among the hills of Hobbiton", "استيقظت بين تلال هوبيتون", 0)
    _show_notice("September, T.A. 3001 — a birthday remembered", "سبتمبر عام 3001 — ذكرى عيد ميلاد بيلبو")
    Input.mouse_mode=Input.MOUSE_MODE_VISIBLE
    var new_game:=not FileAccess.file_exists(SAVE_FILE)
    if not new_game:
        load_game()
    else:
        _new_game()

func _new_game() -> void:
    if inside_bag_end:
        _exit_bag_end()
    if inside_cottage:
        _exit_cottage()
    stage=0
    activities.reset()
    for station in ShireActivities.STATIONS:
        shire.set_party_prepared(str(station["id"]),false)
    quest_flags={"market_supplies":false,"sam_joined":false}
    social=SocialScript.new()
    clock.elapsed=0.0
    clock.story_year=3001
    _refresh_story_entities()
    _update_quest()

func _ground(x: float,z: float) -> Vector3:
    return Vector3(x,shire.elevation(x,z),z)

func _people() -> void:
    var listed : Array = [
        ["sam","Samwise Gamgee","gardener",-30,-13,-33,-14,Color("787b49")],
        ["bilbo","Bilbo Baggins","writer",-27,-20,-23,-21,Color("7c5639")],
        ["gandalf","Gandalf","wanderer",-11,-3,-10,-4,Color("77808a")],
        ["rosie","Rosie Cotton","innkeeper's daughter",-5,-10,-3,-4,Color("7c6778")],
        ["rowan","Rowan the Baker","baker",15,8,15,6,Color("ad8d65")],
        ["hobb","Hob Miller","miller",32,-20,33,-17,Color("526b76")],
        ["tansy","Tansy","gardener",-45,-3,-46,-7,Color("98876b")],
        ["hazel","Hazel","merchant",20,28,17,8,Color("6d6475")],
        ["hugo","Hugo","farmer",-62,28,-58,35,Color("73733f")],
        ["aster","Aster","courier",2,30,18,10,Color("8d704f")]
    ]
    # Forty-four original neighbours form a small living population without 44 per-frame AI agents.
    var names=["Willow","Merry","Bramble","Poppy","Clover","Milo","Daisy","Nettle","Robin","Perry","Nora","Hazelton","Elsie","Flint","Lark","Will","Maple","Tobit","Olive","Fenna","Bran","Tilly","Odo","Alma","Pipkin","Bess","Lina","Otto","Briar","Bert","Hilda","Silas","Ned","Una","Pell","Ferry","Celia","Ida","Nolan","Edie","Barley","Ivy","Mina","Ferdy"]
    var roles=["farmer","baker","gardener","flower seller","weaver","miller","carpenter","messenger"]
    var rng:=RandomNumberGenerator.new()
    rng.seed=3018
    for i in range(names.size()):
        var angle:=TAU*float(i)/float(names.size())
        var radius:=30.0+float(i%5)*7.0
        var home_x:=cos(angle)*radius-8.0
        var home_z:=sin(angle)*radius+7.0
        var work_x:=home_x+(rng.randf()-.5)*16.0
        var work_z:=home_z+(rng.randf()-.5)*16.0
        listed.append(["neighbour_%02d" % i,names[i]+" of Hobbiton",roles[i%roles.size()],home_x,home_z,work_x,work_z,Color.from_hsv(fmod(float(i)*.173,1.0),.31,.48)])
    for i in range(listed.size()):
        var p: Array=listed[i]
        var npc: ShireNPC=NPCScript.new()
        npc.configure(str(p[0]),str(p[1]),str(p[2]),_ground(float(p[3]),float(p[4])),_ground(float(p[5]),float(p[6])),p[7],i)
        npcs[str(p[0])]=npc
        add_child(npc)

func _animals() -> void:
    # Hens explore fields, rabbits flee from footsteps, butterflies avoid rain.
    for i in range(19):
        var kind: String="hen" if i<9 else "rabbit" if i<14 else "butterfly"
        var x: float=-44.0+float(i%7)*9.5
        var z: float=13.0+float(i%4)*11.0 if i<9 else -32.0+float(i%6)*5.0
        var pet: ShireAnimal=AnimalScript.new()
        pet.setup(kind,_ground(x,z),i)
        animals.append(pet)
        add_child(pet)

func _soundscape() -> void:
    ambience=AudioStreamPlayer.new()
    ambience.stream=load("res://assets/audio/shire_birds_original.ogg")
    ambience.volume_db=-20.0
    add_child(ambience)
    ambience.play()
    stream_audio=AudioStreamPlayer3D.new()
    stream_audio.stream=load("res://assets/audio/river_original.ogg")
    stream_audio.position=_ground(39,8)+Vector3(0,1,0)
    stream_audio.max_distance=42
    stream_audio.unit_size=10
    stream_audio.volume_db=-17
    add_child(stream_audio)
    stream_audio.play()
    rain_audio=AudioStreamPlayer.new()
    rain_audio.stream=load("res://assets/audio/shire_rain_original.ogg")
    rain_audio.volume_db=-48.0
    add_child(rain_audio)
    rain_audio.play()

func _style_panel(box_color: Color=Color(.075,.11,.10,.89)) -> PanelContainer:
    var container:=PanelContainer.new()
    var st:=StyleBoxFlat.new()
    st.bg_color=box_color
    st.border_color=Color("a9895d")
    st.set_border_width_all(1)
    st.corner_radius_top_left=12
    st.corner_radius_top_right=12
    st.corner_radius_bottom_left=12
    st.corner_radius_bottom_right=12
    st.set_content_margin_all(15)
    container.add_theme_stylebox_override("panel",st)
    return container

func _text(content: String, font_size: int, color: Color) -> Label:
    var label:=Label.new()
    label.text=content
    label.add_theme_font_size_override("font_size",font_size)
    label.add_theme_color_override("font_color",color)
    label.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
    return label

func _interface() -> void:
    hud=CanvasLayer.new()
    hud.layer=12
    add_child(hud)
    var top:=_style_panel(Color(.08,.13,.11,.85))
    top.position=Vector2(20,18)
    top.custom_minimum_size=Vector2(480,76)
    hud.add_child(top)
    var stack:=VBoxContainer.new()
    top.add_child(stack)
    top_label=_text("",16,Color("f2e1b8"))
    stack.add_child(top_label)
    quest_label=_text("",15,Color("d1d9bd"))
    stack.add_child(quest_label)
    prompt_label=_text("",17,Color("fff0c3"))
    prompt_label.position=Vector2(18,635)
    prompt_label.custom_minimum_size=Vector2(1030,35)
    hud.add_child(prompt_label)
    tutorial_label=_text("WASD Move  •  Mouse Look  •  Shift Run  •  E Talk  •  V Camera  •  F5 Save  •  Esc Menu",13,Color("ead9bb"))
    tutorial_label.text="WASD Move   ·   E Interact   ·   M Map   ·   J Journal   ·   V Camera   ·   Shift Run   ·   F5 Save   ·   Esc Menu"
    tutorial_label.position=Vector2(18,682)
    tutorial_label.custom_minimum_size=Vector2(1070,26)
    tutorial_label.autowrap_mode=TextServer.AUTOWRAP_OFF
    hud.add_child(tutorial_label)
    fps_label=_text("",13,Color("ddd9b0"))
    fps_label.position=Vector2(1030,24)
    fps_label.custom_minimum_size=Vector2(225,24)
    fps_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT
    fps_label.autowrap_mode=TextServer.AUTOWRAP_OFF
    hud.add_child(fps_label)
    dialogue_panel=_style_panel(Color(.07,.095,.085,.96))
    dialogue_panel.position=Vector2(190,410)
    dialogue_panel.custom_minimum_size=Vector2(880,270)
    dialogue_panel.visible=false
    hud.add_child(dialogue_panel)
    var dialogue_stack:=VBoxContainer.new()
    dialogue_stack.add_theme_constant_override("separation",6)
    dialogue_panel.add_child(dialogue_stack)
    dialogue_title=_text("",19,Color("ecc98e"))
    dialogue_stack.add_child(dialogue_title)
    dialogue_text=_text("",17,Color("f6eee0"))
    dialogue_stack.add_child(dialogue_text)
    dialogue_ar=_text("",15,Color("c9d5cd"))
    dialogue_stack.add_child(dialogue_ar)
    choices=VBoxContainer.new()
    dialogue_stack.add_child(choices)
    pause_panel=_style_panel(Color(.07,.095,.085,.97))
    pause_panel.position=Vector2(430,145)
    pause_panel.custom_minimum_size=Vector2(420,330)
    pause_panel.visible=false
    hud.add_child(pause_panel)
    journal_panel=_style_panel(Color(.07,.095,.085,.96))
    journal_panel.position=Vector2(220,120)
    journal_panel.custom_minimum_size=Vector2(840,480)
    journal_panel.visible=false
    hud.add_child(journal_panel)
    journal_body=_text("",16,Color("eee3c9"))
    journal_body.custom_minimum_size=Vector2(800,440)
    journal_panel.add_child(journal_body)
    map_panel=_style_panel(Color(.07,.095,.085,.97))
    map_panel.position=Vector2(215,105)
    map_panel.custom_minimum_size=Vector2(850,500)
    map_panel.visible=false
    hud.add_child(map_panel)
    map_view=MapScript.new()
    map_panel.add_child(map_view)
    var items:=VBoxContainer.new()
    items.add_theme_constant_override("separation",10)
    pause_panel.add_child(items)
    items.add_child(_text("SHIRE JOURNEY  •  GODOT EDITION",22,Color("efd6a7")))
    items.add_child(_text("A quiet, living world in Hobbiton",15,Color("cdd4b8")))
    for label_name in ["Resume", "Save Journey", "Load Journey", "New Journey", "Close"]:
        var button:=Button.new()
        button.text=label_name
        button.custom_minimum_size=Vector2(350,38)
        items.add_child(button)
        button.pressed.connect(_menu_choice.bind(label_name))

func _menu_choice(item: String) -> void:
    match item:
        "Resume", "Close": _pause(false)
        "Save Journey": save_game()
        "Load Journey": load_game()
        "New Journey":
            _pause(false)
            _new_game()
            frodo.position=_ground(-30,-36)+Vector3.UP*.25
            frodo.yaw=2.71
            frodo.rotation.y=2.71

func _pause(value: bool) -> void:
    paused_by_user=value
    pause_panel.visible=value
    frodo.active=not value and not in_conversation
    Input.mouse_mode=Input.MOUSE_MODE_VISIBLE if value else Input.MOUSE_MODE_CAPTURED

func _show_notice(en: String, ar: String) -> void:
    prompt_label.text=en+"  |  "+ar
    start_notice_timer=5.0

func _refresh_story_entities() -> void:
    if npcs.has("bilbo"):
        npcs["bilbo"].visible=stage<5
    if npcs.has("gandalf"):
        npcs["gandalf"].visible=stage>=3
    if npcs.has("sam"):
        npcs["sam"].follow_player=stage>=7 and not inside_bag_end

func _objective() -> String:
    match stage:
        0: return "Talk to Sam by Bag End's gardens | تحدّث مع سام"
        1: return "Explore the Party Field beneath the great tree"
        2: return "Help Rowan at the market | ساعد الخبّاز في السوق"
        3: return "Gandalf has arrived — speak with him by the lane"
        4: return "Return to Bag End and speak with Bilbo"
        5: return "T.A. 3018 — collect provisions from Rowan"
        6: return "Speak to Sam about the quiet departure"
        7: return "Follow the northern lane out of Hobbiton (towards z=65)"
        8: return "Chapter I complete — the road continues"
        _: return "Walk among neighbours and listen to the Shire"

func _update_quest() -> void:
    quest_label.text=_objective()

func _process(dt: float) -> void:
    if paused_by_user or journal_panel.visible or map_panel.visible:
        return
    # Dialogue does NOT freeze world time or neighbour schedules.
    clock.advance(dt)
    autosave+=dt
    elapsed_show+=dt
    last_npc_update+=dt
    last_animal_tick+=dt
    if last_animal_tick>.12:
        var sim_time:=last_animal_tick
        last_animal_tick=0.0
        var rain_now:=weather.is_raining(clock.elapsed)
        for pet in animals:
            pet.tick(clock.hour_value(),rain_now,frodo.position,sim_time,clock.elapsed,shire)
    if autosave>26.0:
        autosave=0.0
        save_game(false)
    if inside_bag_end or inside_cottage:
        top_label.text=("Bag End" if inside_bag_end else current_cottage_name)+" | منزل الهوبيت  •  "+clock.stamp()
        if start_notice_timer>0.0:
            start_notice_timer-=dt
        else:
            if inside_bag_end: _interior_prompt()
            else: _cottage_prompt()
        if int(elapsed_show)%2==0:
            fps_label.text="%d fps | Bag End interior" % Engine.get_frames_per_second()
        return
    var w:=weather.type_at(clock.elapsed)
    if last_npc_update>.10:
        var sim_delta:=last_npc_update
        last_npc_update=0.0
        for key in npcs:
            var npc: ShireNPC=npcs[key]
            if (key=="bilbo" and stage>=5) or (key=="gandalf" and stage<3):
                npc.visible=false
                continue
            npc.update_schedule(clock.hour_value(),weather.is_raining(clock.elapsed),frodo.position,sim_delta,clock.elapsed)
    _landmark_update(dt)
    shire.update_environment(clock.hour_value(),clock.light_factor(),w,weather.darkness_at(clock.elapsed),dt)
    shire.rainfall.position=frodo.position+Vector3(0,13,0)
    # Rain is an audible changing system, not only a visual sky overlay.
    rain_audio.volume_db=lerpf(rain_audio.volume_db,-17.0 if weather.is_raining(clock.elapsed) else -48.0,minf(dt*.8,1.0))
    ambience.volume_db=lerpf(ambience.volume_db,-31.0 if weather.is_raining(clock.elapsed) else -20.0,minf(dt*.4,1.0))
    top_label.text=clock.stamp()+"  •  "+w.replace("_"," ")
    if start_notice_timer>0:
        start_notice_timer-=dt
    else:
        _interaction_prompt()
    if int(elapsed_show)%2==0:
        fps_label.text="%d fps | %d villagers" % [Engine.get_frames_per_second(),npcs.size()]
    if stage==1 and not in_conversation and frodo.position.distance_to(_ground(-2,-3))<10.5:
        stage=2
        _show_notice("The Party Field is bustling; the baker could use your help.","الحفلة تقترب، والخباز بحاجة للمساعدة.")
        _update_quest()
        save_game(false)
    if stage==7 and frodo.position.z>64 and not in_conversation:
        stage=8
        _show_notice("CHAPTER I — THE ROAD GOES ON. More chapters remain in production.","انتهى الفصل الأول من النموذج. الرحلة ما زالت قيد التطوير.")
        _update_quest()
        save_game(false)
    if not ambience.playing:
        ambience.play()
    if not stream_audio.playing:
        stream_audio.play()
    if not rain_audio.playing:
        rain_audio.play()

func _nearest_npc() -> ShireNPC:
    var best: ShireNPC=null
    var distance:=3.5
    for key in npcs:
        var npc: ShireNPC=npcs[key]
        if not npc.visible:continue
        var value:=frodo.position.distance_to(npc.position)
        if value<distance:
            best=npc
            distance=value
    return best

func _interaction_prompt() -> void:
    if in_conversation:
        return
    if _near_bag_end_door():
        prompt_label.text="[E] Enter Bag End | ادخل إلى باغ إند"
        return
    var cottage_door: Array=_nearest_cottage_door()
    if not cottage_door.is_empty():
        prompt_label.text="[E] Enter %s | ادخل المنزل" % str(cottage_door[1])
        return
    var party_station: Dictionary=activities.available_at(frodo.position,stage)
    if not party_station.is_empty():
        prompt_label.text="[E] %s | %s (%d/3)" % [party_station["en"],party_station["ar"],activities.progress()]
        return
    interact_npc=_nearest_npc()
    if interact_npc:
        prompt_label.text="[E] Talk to %s | تحدث معه  •  %s" % [interact_npc.display_name,interact_npc.action]
    else:
        prompt_label.text="Walk the lanes of Hobbiton. The world continues while you explore."

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("menu"):
        if in_conversation:
            _end_conversation()
        elif map_panel.visible:
            _toggle_map()
        else:
            _pause(not paused_by_user)
        get_viewport().set_input_as_handled()
    elif event is InputEventKey and event.pressed and not event.echo and event.physical_keycode == KEY_J and not in_conversation and not map_panel.visible:
        _toggle_journal()
        get_viewport().set_input_as_handled()
    elif event is InputEventKey and event.pressed and not event.echo and event.physical_keycode == KEY_M and not in_conversation and not journal_panel.visible:
        _toggle_map()
        get_viewport().set_input_as_handled()
    elif event.is_action_pressed("save_game") and not in_conversation:
        save_game()
        get_viewport().set_input_as_handled()
    elif event.is_action_pressed("interact") and not paused_by_user and not in_conversation and not journal_panel.visible and not map_panel.visible:
        if inside_bag_end:
            _interact_interior()
            get_viewport().set_input_as_handled()
        elif inside_cottage:
            _interact_cottage()
            get_viewport().set_input_as_handled()
        elif _near_bag_end_door():
            _enter_bag_end()
            get_viewport().set_input_as_handled()
        elif not _nearest_cottage_door().is_empty():
            _enter_cottage(_nearest_cottage_door())
            get_viewport().set_input_as_handled()
        else:
            var party_station: Dictionary=activities.available_at(frodo.position,stage)
            if not party_station.is_empty():
                _prepare_party_station(str(party_station["id"]))
                get_viewport().set_input_as_handled()
            else:
                var npc:=_nearest_npc()
                if npc:
                    _begin_conversation(npc)
                    get_viewport().set_input_as_handled()

func _prepare_party_station(id: String) -> void:
    var outcome: Dictionary=activities.prepare(id,stage)
    if outcome.is_empty():
        return
    shire.set_party_prepared(id,true)
    social.record(id,str(outcome["en"]),str(outcome["ar"]),clock.day_index())
    if outcome["finished"]:
        social.events["party_ready"]=true
        social.record("birthday_party_ready","Party Field is ready for Bilbo's birthday.","حقل الاحتفال جاهز لعيد ميلاد بيلبو.",clock.day_index())
        _show_notice("All preparations are complete! Return to the neighbours.", "اكتملت تحضيرات الاحتفال! عُد إلى الجيران.")
    else:
        _show_notice(str(outcome["en"]),str(outcome["ar"]))
    save_game(false)

func _begin_conversation(npc: ShireNPC) -> void:
    talking=npc
    in_conversation=true
    frodo.active=false
    Input.mouse_mode=Input.MOUSE_MODE_VISIBLE
    dialogue_panel.visible=true
    npc.look_at_player=true
    dialogue_title.text=npc.display_name+"  •  "+npc.job
    dialogue_text.text="A neighbour waits to hear what you have to say."
    dialogue_ar.text="أحد أهل الشاير يصغي إلى حديثك."
    social.meet(npc.profile_id,clock.day_index())
    _topics()

func _topics() -> void:
    for child in choices.get_children():
        child.queue_free()
    if not is_instance_valid(talking):return
    for topic in social.available(talking.profile_id,stage,clock.hour_value()):
        var btn:=Button.new()
        btn.text=social.option_label(topic)
        btn.custom_minimum_size=Vector2(790,29)
        btn.add_theme_font_size_override("font_size",14)
        choices.add_child(btn)
        btn.pressed.connect(_choose_topic.bind(topic))
    var goodbye:=Button.new()
    goodbye.text="Leave conversation | إنهاء الحديث"
    goodbye.custom_minimum_size=Vector2(790,29)
    choices.add_child(goodbye)
    goodbye.pressed.connect(_end_conversation)

func _choose_topic(topic: String) -> void:
    if not is_instance_valid(talking):return
    var reply: Dictionary=social.reply(talking,topic,stage,clock.day_index(),clock.hour_value(),weather.type_at(clock.elapsed))
    dialogue_title.text=str(reply["speaker"])
    dialogue_text.text=str(reply["en"])
    dialogue_ar.text=str(reply["ar"])
    talking.remember(topic,clock.day_index(),7 if topic in ["friendship","favour"] else 3)
    _story_effect(talking.profile_id,"help" if topic=="favour" and str(social.favours.get(talking.profile_id,""))=="done" else topic)
    _topics()
    save_game(false)

func _story_effect(who: String,topic: String) -> void:
    if stage==0 and who=="sam" and topic=="greeting":
        stage=1
    elif stage==2 and who=="rowan" and topic=="help":
        stage=3
    elif stage==3 and who=="gandalf" and topic=="greeting":
        stage=4
    elif stage==4 and who=="bilbo" and topic=="greeting":
        # Canon progression: Bilbo leaves after T.A. 3001 birthday; do not merge with 3018.
        stage=5
        clock.story_year=3018
        clock.elapsed=0.0
        for key in npcs:
            var npc: ShireNPC=npcs[key]
            if key!="sam":
                npc.memory.clear()
        _show_notice("Seventeen years pass. T.A. 3018: Frodo prepares to leave.","مضت سبع عشرة سنة. يستعد فرودو للرحيل.")
    elif stage==5 and who=="rowan" and topic=="help":
        quest_flags["market_supplies"]=true
        stage=6
    elif stage==6 and who=="sam" and topic=="journey":
        quest_flags["sam_joined"]=true
        stage=7
    _refresh_story_entities()
    _update_quest()

func _end_conversation() -> void:
    if is_instance_valid(talking):talking.look_at_player=false
    talking=null
    in_conversation=false
    dialogue_panel.visible=false
    frodo.active=true
    Input.mouse_mode=Input.MOUSE_MODE_CAPTURED

func _nearest_cottage_door() -> Array:
    if inside_bag_end or inside_cottage:
        return []
    var here := Vector2(frodo.position.x,frodo.position.z)
    var nearest: Array=[]
    var best: float=2.95
    for entry in COTTAGE_DOORS:
        var dist: float=here.distance_to(Vector2(float(entry[2]),float(entry[3])))
        if dist<best:
            best=dist
            nearest=entry
    return nearest

func _enter_cottage(entry: Array) -> void:
    if inside_bag_end or inside_cottage:
        return
    exterior_return=frodo.position
    camera_before_bag_end=frodo.first_person
    current_cottage_id=str(entry[0])
    current_cottage_name=str(entry[1])
    cottage_interior=CottageScript.new()
    cottage_interior.variant_id=current_cottage_id
    cottage_interior.display_name=current_cottage_name
    cottage_interior.position=INTERIOR_ORIGIN
    add_child(cottage_interior)
    inside_cottage=true
    frodo.first_person=true
    shire.visible=false
    for key in npcs: npcs[key].visible=false
    for pet in animals: pet.visible=false
    frodo.position=INTERIOR_ORIGIN+ShireCottage.ENTRY
    frodo.velocity=Vector3.ZERO
    frodo.yaw=0.0
    frodo.rotation.y=0.0
    frodo._update_camera()
    ambience.volume_db=-32.0
    stream_audio.volume_db=-52.0
    rain_audio.volume_db=-52.0
    social.record("home_"+current_cottage_id,"Visited "+current_cottage_name,"زرت "+current_cottage_name,clock.day_index())
    _show_notice("A homely cottage. Explore the shelves, pantry and hearth.", "منزل دافئ. استكشف الرفوف والمخزن والموقد.")

func _exit_cottage() -> void:
    if not inside_cottage:
        return
    inside_cottage=false
    frodo.position=exterior_return
    frodo.velocity=Vector3.ZERO
    frodo.yaw=PI
    frodo.rotation.y=PI
    frodo.first_person=camera_before_bag_end
    frodo._update_camera()
    shire.visible=true
    for key in npcs: npcs[key].visible=true
    for pet in animals: pet.visible=true
    if is_instance_valid(cottage_interior):
        cottage_interior.queue_free()
        cottage_interior=null
    current_cottage_id=""
    current_cottage_name=""
    stream_audio.volume_db=-17.0
    _refresh_story_entities()
    _show_notice("Back outside in Hobbiton","عدت إلى هوبيتون")

func _cottage_prompt() -> void:
    if not is_instance_valid(cottage_interior):
        return
    match cottage_interior.interaction_at(frodo.position-INTERIOR_ORIGIN):
        "exit": prompt_label.text="[E] Leave cottage | اخرج من المنزل"
        "reading": prompt_label.text="[E] Look at the family books | انظر إلى كتب العائلة"
        "pantry": prompt_label.text="[E] Inspect the pantry | تفقّد المخزن"
        "hearth": prompt_label.text="[E] Warm yourself by the fire | اقترب من الموقد"
        _: prompt_label.text="Explore the cottage | استكشف المنزل"

func _interact_cottage() -> void:
    if not is_instance_valid(cottage_interior):
        return
    var place: String=cottage_interior.interaction_at(frodo.position-INTERIOR_ORIGIN)
    if place=="exit":
        _exit_cottage()
        return
    if place=="":
        return
    social.record("cottage_"+current_cottage_id+"_"+place,"Explored "+place+" in "+current_cottage_name,"استكشفت "+current_cottage_name,clock.day_index())
    _show_notice("A small story from ordinary Shire life.", "تفصيل صغير من حياة الشاير اليومية.")
    save_game(false)

func _near_bag_end_door() -> bool:
    if inside_bag_end or inside_cottage:
        return false
    var here := Vector2(frodo.position.x, frodo.position.z)
    return here.distance_to(BAG_END_ENTRANCE) < 3.1

func _enter_bag_end() -> void:
    if inside_bag_end:
        return
    if not is_instance_valid(bag_end_interior):
        bag_end_interior = BagEndScript.new()
        bag_end_interior.position = INTERIOR_ORIGIN
        add_child(bag_end_interior)
    exterior_return = frodo.position
    camera_before_bag_end = frodo.first_person
    inside_bag_end = true
    frodo.first_person = true
    shire.visible = false
    for key in npcs:
        npcs[key].visible = false
    for pet in animals:
        pet.visible = false
    frodo.position = INTERIOR_ORIGIN + ShireBagEnd.ENTRY
    frodo.velocity = Vector3.ZERO
    frodo.yaw = 0.0
    frodo.rotation.y = 0.0
    frodo._update_camera()
    ambience.volume_db = -33.0
    stream_audio.volume_db = -52.0
    rain_audio.volume_db = -52.0
    social.record("bagend_entered", "Entered Bag End", "دخلت منزل باغ إند", clock.day_index())
    _show_notice("Bag End — explore the study, hearth and pantry.", "باغ إند — استكشف المكتبة والمدفأة والمخزن.")

func _exit_bag_end() -> void:
    if not inside_bag_end:
        return
    inside_bag_end = false
    frodo.position = exterior_return
    frodo.velocity = Vector3.ZERO
    frodo.yaw = PI
    frodo.rotation.y = PI
    frodo.first_person = camera_before_bag_end
    frodo._update_camera()
    shire.visible = true
    for key in npcs:
        npcs[key].visible = true
    for pet in animals:
        pet.visible = true
    if is_instance_valid(bag_end_interior):
        bag_end_interior.queue_free()
        bag_end_interior = null
    stream_audio.volume_db = -17.0
    _refresh_story_entities()
    _show_notice("Back in Hobbiton", "عدت إلى هوبيتون")

func _interior_action() -> String:
    if not is_instance_valid(bag_end_interior):
        return ""
    return bag_end_interior.interaction_at(frodo.position - INTERIOR_ORIGIN)

func _interior_prompt() -> void:
    match _interior_action():
        "exit":
            prompt_label.text = "[E] Leave Bag End | اخرج من باغ إند"
        "study":
            prompt_label.text = "[E] Read Bilbo's study notes | تفحّص مكتب بيلبو"
        "pantry":
            prompt_label.text = "[E] Explore the pantry | استكشف المخزن"
        "hearth":
            prompt_label.text = "[E] Sit by the hearth | اجلس قرب الموقد"
        _:
            prompt_label.text = "Bag End: study, pantry, hearth and round door | استكشف غرف المنزل"

func _interact_interior() -> void:
    match _interior_action():
        "exit":
            _exit_bag_end()
            return
        "study":
            social.record("bagend_study", "Read the papers in Bilbo's study", "قرأت أوراق مكتب بيلبو", clock.day_index())
            _show_notice("Old maps and travel notes lie on the writing desk.", "على المكتب خرائط قديمة وملاحظات سفر.")
        "pantry":
            social.record("bagend_pantry", "Explored Bag End's pantry", "استكشفت مخزن باغ إند", clock.day_index())
            _show_notice("The shelves are carefully stocked for a quiet Shire day.", "الرفوف مليئة بمؤونة يوم هادئ في الشاير.")
        "hearth":
            social.record("bagend_hearth", "Rested beside the Bag End hearth", "استرحت قرب موقد باغ إند", clock.day_index())
            _show_notice("The hearth is warm, and Hobbiton seems far away.", "الموقد دافئ، وتبدو هوبيتون بعيدة عن الهموم.")
        _:
            return
    save_game(false)

func save_game(notify: bool=true) -> void:
    var people_state: Dictionary={}
    for key in npcs:
        var npc: ShireNPC=npcs[key]
        people_state[key]=npc.pack()
    var saved_player_pos: Vector3=exterior_return if (inside_bag_end or inside_cottage) else frodo.position
    var game_state: Dictionary={
        "schema":2,"clock":clock.pack(),"stage":stage,
        "flags":quest_flags.duplicate(true),"weather_seed":weather.seed,
        "player":{"pos":[saved_player_pos.x,saved_player_pos.y,saved_player_pos.z],"yaw":frodo.yaw,"camera_first":camera_before_bag_end if (inside_bag_end or inside_cottage) else frodo.first_person,"inside_bag_end":inside_bag_end,"inside_cottage":inside_cottage,"cottage_id":current_cottage_id},
        "npcs":people_state,"social":social.pack(),"activities":activities.pack(),
        "animals":animals.map(func(pet): return pet.pack())}
    var file:=FileAccess.open(SAVE_FILE,FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify(game_state))
        file.close()
        if notify:_show_notice("Journey saved", "تم حفظ الرحلة")
    elif notify:
        _show_notice("Save failed: disk access unavailable", "تعذر حفظ اللعبة")

func load_game() -> void:
    if not FileAccess.file_exists(SAVE_FILE):
        _show_notice("No saved journey yet", "لا توجد رحلة محفوظة")
        return
    var file:=FileAccess.open(SAVE_FILE,FileAccess.READ)
    if not file:return
    var text:=file.get_as_text()
    file.close()
    if text.length()>1600000:return
    var raw=JSON.parse_string(text)
    if not raw is Dictionary or int(raw.get("schema",-1))!=2:
        _show_notice("Save file version not supported", "ملف حفظ غير متوافق")
        return
    if inside_bag_end:
        _exit_bag_end()
    if inside_cottage:
        _exit_cottage()
    social.unpack(raw.get("social",{}))
    activities.unpack(raw.get("activities",{}))
    for station in ShireActivities.STATIONS:
        var id: String=str(station["id"])
        shire.set_party_prepared(id,activities.is_prepared(id))
    clock.unpack(raw.get("clock",{}))
    stage=clampi(int(raw.get("stage",0)),0,8)
    weather.seed=int(raw.get("weather_seed",3018))
    if raw.get("flags") is Dictionary:
        quest_flags["sam_joined"]=raw["flags"].get("sam_joined",false)==true
        quest_flags["market_supplies"]=raw["flags"].get("market_supplies",false)==true
    var data: Dictionary=raw.get("player",{})
    if data.get("pos") is Array and data["pos"].size()==3:
        var vals: Array=data["pos"]
        frodo.position=Vector3(clampf(float(vals[0]),-100,100),clampf(float(vals[1]),-30,40),clampf(float(vals[2]),-100,100))
    frodo.yaw=clampf(float(data.get("yaw",0)),-10000,10000)
    frodo.rotation.y=frodo.yaw
    frodo.first_person=bool(data.get("camera_first",false))
    frodo._update_camera()
    if data.get("inside_bag_end",false)==true:
        _enter_bag_end()
        camera_before_bag_end=bool(data.get("camera_first",false))
        frodo.first_person = true
        frodo._update_camera()
    elif data.get("inside_cottage",false)==true:
        for door in COTTAGE_DOORS:
            if str(door[0])==str(data.get("cottage_id","")):
                _enter_cottage(door)
                camera_before_bag_end=bool(data.get("camera_first",false))
                break
    var restored: Dictionary=raw.get("npcs",{})
    for key in npcs:
        if restored.get(key) is Dictionary:
            npcs[key].unpack(restored[key])
    var animal_data=raw.get("animals",[])
    if animal_data is Array:
        for index in range(mini(animals.size(),animal_data.size())):
            if animal_data[index] is Dictionary:
                animals[index].unpack(animal_data[index])
    _refresh_story_entities()
    _update_quest()
    _show_notice("Saved journey loaded", "تم استرجاع الرحلة")


func _landmark_update(dt: float) -> void:
    landmark_pulse+=dt
    if landmark_pulse<.25: return
    landmark_pulse=0.0
    nearest_landmark_id=""
    nearest_landmark_distance=99.0
    for point in LANDMARKS:
        var key: String=str(point[0])
        var distance: float=Vector2(frodo.position.x,frodo.position.z).distance_to(Vector2(float(point[3]),float(point[4])))
        if distance<nearest_landmark_distance:
            nearest_landmark_id=key
            nearest_landmark_distance=distance
        if distance<8.0 and social.record("landmark_"+key,"Discovered "+str(point[1]),"اكتشفت "+str(point[2]),clock.day_index()):
            _show_notice("Discovered: "+str(point[1]),"اكتشفت "+str(point[2]))
            save_game(false)

func _toggle_journal() -> void:
    if paused_by_user or in_conversation: return
    journal_panel.visible=not journal_panel.visible
    frodo.active=not journal_panel.visible
    Input.mouse_mode=Input.MOUSE_MODE_VISIBLE if journal_panel.visible else Input.MOUSE_MODE_CAPTURED
    if not journal_panel.visible: return
    var entries: Array[String]=["THE SHIRE JOURNAL | يوميات الشاير", "Wisdom / الحكمة: %d  |  Places: %d / %d" % [social.wisdom,social.discovered.size(),LANDMARKS.size()+1],""]
    for item in social.journal.slice(-12):
        entries.append("Day %d · %s" % [int(item.get("day",0)),str(item.get("en",""))])
        entries.append(str(item.get("ar","")))
    entries.append("Press J to return to the world | اضغط J للعودة")
    journal_body.text="\n".join(entries)
func _toggle_map() -> void:
    if paused_by_user or in_conversation or journal_panel.visible or inside_bag_end or inside_cottage:
        return
    map_panel.visible = not map_panel.visible
    frodo.active = not map_panel.visible
    Input.mouse_mode = Input.MOUSE_MODE_VISIBLE if map_panel.visible else Input.MOUSE_MODE_CAPTURED
    if map_panel.visible:
        map_view.configure(LANDMARKS,Vector2(frodo.position.x,frodo.position.z))
