extends Node3D
## SHIRE JOURNEY CHAPTER I: native Godot 4.3+ gameplay, not an HTML wrapper.
## Provenance: ORIGINAL-GAME gameplay based on film/book timelines without copying film dialogue.
const WorldScript=preload("res://scripts/shire_world.gd")
const PlayerScript=preload("res://scripts/player.gd")
const NPCScript=preload("res://scripts/shire_npc.gd")
const ClockScript=preload("res://scripts/shire_clock.gd")
const WeatherScript=preload("res://scripts/shire_weather.gd")
const DialogueScript=preload("res://scripts/shire_dialogue.gd")
const SAVE_FILE="user://shire_journey_godot_save_v2.json"
var shire: ShireWorld
var frodo: ShirePlayer
var clock: ShireClock
var weather: ShireWeather
var npcs: Dictionary={}
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
var stream_audio: AudioStreamPlayer3D
var world_seed:=24
var start_notice_timer:=10.0

func _ready() -> void:
    clock=ClockScript.new()
    weather=WeatherScript.new()
    shire=WorldScript.new()
    shire.name="LivingHobbiton"
    add_child(shire)
    frodo=PlayerScript.new()
    frodo.position=_ground(-20,-9)
    frodo.position.y+=.25
    add_child(frodo)
    _people()
    _soundscape()
    _interface()
    _refresh_story_entities()
    _show_notice("September, T.A. 3001 — a birthday remembered", "سبتمبر عام 3001 — ذكرى عيد ميلاد بيلبو")
    Input.mouse_mode=Input.MOUSE_MODE_VISIBLE
    var new_game:=not FileAccess.file_exists(SAVE_FILE)
    if not new_game:
        load_game()
    else:
        _new_game()

func _new_game() -> void:
    stage=0
    quest_flags={"market_supplies":false,"sam_joined":false}
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
    tutorial_label.position=Vector2(18,689)
    hud.add_child(tutorial_label)
    fps_label=_text("",13,Color("ddd9b0"))
    fps_label.position=Vector2(1135,24)
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
            frodo.position=_ground(-20,-9)+Vector3.UP*.25

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
    if paused_by_user:
        return
    # Dialogue does NOT freeze world time or neighbour schedules.
    clock.advance(dt)
    autosave+=dt
    elapsed_show+=dt
    last_npc_update+=dt
    if autosave>26.0:
        autosave=0.0
        save_game(false)
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
    shire.update_environment(clock.hour_value(),clock.light_factor(),w,weather.darkness_at(clock.elapsed),dt)
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
    interact_npc=_nearest_npc()
    if interact_npc:
        prompt_label.text="[E] Talk to %s | تحدث معه  •  %s" % [interact_npc.display_name,interact_npc.action]
    else:
        prompt_label.text="Walk the lanes of Hobbiton. The world continues while you explore."

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("menu"):
        if in_conversation:
            _end_conversation()
        else:
            _pause(not paused_by_user)
        get_viewport().set_input_as_handled()
    elif event.is_action_pressed("save_game") and not in_conversation:
        save_game()
        get_viewport().set_input_as_handled()
    elif event.is_action_pressed("interact") and not paused_by_user and not in_conversation:
        var npc:=_nearest_npc()
        if npc:
            _begin_conversation(npc)
            get_viewport().set_input_as_handled()

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
    _topics()

func _topics() -> void:
    for child in choices.get_children():
        child.queue_free()
    if not is_instance_valid(talking):return
    for topic in DialogueScript.available(talking,stage):
        var btn:=Button.new()
        btn.text=DialogueScript.label(topic)
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
    var reply: Dictionary=DialogueScript.answer(talking,topic,weather.type_at(clock.elapsed),clock.day_index(),stage)
    dialogue_title.text=str(reply["speaker"])
    dialogue_text.text=str(reply["en"])
    dialogue_ar.text=str(reply["ar"])
    talking.remember(str(reply["memory"]),clock.day_index(),7 if topic=="help" else 3)
    _story_effect(talking.profile_id,topic)
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

func save_game(notify: bool=true) -> void:
    var people_state: Dictionary={}
    for key in npcs:
        var npc: ShireNPC=npcs[key]
        people_state[key]=npc.pack()
    var game_state: Dictionary={
        "schema":2,"clock":clock.pack(),"stage":stage,
        "flags":quest_flags.duplicate(true),"weather_seed":weather.seed,
        "player":{"pos":[frodo.position.x,frodo.position.y,frodo.position.z],"yaw":frodo.yaw,"camera_first":frodo.first_person},
        "npcs":people_state}
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
    var restored: Dictionary=raw.get("npcs",{})
    for key in npcs:
        if restored.get(key) is Dictionary:
            npcs[key].unpack(restored[key])
    _refresh_story_entities()
    _update_quest()
    _show_notice("Saved journey loaded", "تم استرجاع الرحلة")