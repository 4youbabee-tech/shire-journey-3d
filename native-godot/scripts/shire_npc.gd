class_name ShireNPC
extends Node3D
## Simple schedule driven person; no LLM may alter the quest or lore.
var profile_id := ""
var display_name := ""
var job := ""
var home : Vector3 = Vector3.ZERO
var work : Vector3 = Vector3.ZERO
var market : Vector3 = Vector3.ZERO
var destination : Vector3 = Vector3.ZERO
var travel_speed := 0.8
var mood := "cheerful"
var relation := {"affinity":50, "trust":50, "respect":50, "familiarity":20}
var memory : Array[Dictionary] = []
var body : Node3D
var look_at_player := false
var closeness := 99.0
var action := "resting"
var seed_value := 0

func configure(id_value: String, label: String, occupation: String, origin: Vector3, workplace: Vector3, palette: Color, seed_number: int) -> void:
    profile_id=id_value
    display_name=label
    job=occupation
    home=origin
    work=workplace
    market=Vector3(16,0,8)
    position=home
    seed_value=seed_number
    body=Node3D.new()
    add_child(body)
    make_part(Vector3(0, 0.82, 0),Vector3(.5,.66,.40),palette,0)
    make_part(Vector3(0,1.35,0),Vector3(.37,.37,.35),Color("edc7a2"),0)
    make_part(Vector3(0,1.55,-.02),Vector3(.37,.15,.35),Color("49312a"),0)
    for side in [-1.0,1.0]:
        make_part(Vector3(side*.19,.33,0),Vector3(.18,.36,.21),Color("554233"),1)
        make_part(Vector3(side*.40,.9,0),Vector3(.16,.44,.18),palette.lightened(.11),1)
        make_part(Vector3(side*.14,1.36,-.3),Vector3(.042,.043,.041),Color("2e2a23"),0)
    make_part(Vector3(0,1.24,-.37),Vector3(.095,.08,.12),Color("d9a57f"),0)

func make_part(where: Vector3, size_value: Vector3, color: Color, shape: int) -> void:
    var mesh:=MeshInstance3D.new()
    mesh.mesh=CapsuleMesh.new() if shape==1 else SphereMesh.new()
    mesh.position=where
    mesh.scale=size_value
    var material:=StandardMaterial3D.new()
    material.albedo_color=color
    material.roughness=.94
    mesh.material_override=material
    mesh.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    body.add_child(mesh)

func update_schedule(game_hour: float, rain: bool, player_pos: Vector3, delta: float, game_seconds: float) -> void:
    closeness=global_position.distance_to(player_pos)
    var target:=home
    if rain:
        target=home
        action="sheltering"
    elif game_hour>=7.0 and game_hour<12.0:
        target=work
        action="working"
    elif game_hour>=12.0 and game_hour<14.0:
        target=market
        action="socializing"
    elif game_hour>=14.0 and game_hour<18.0:
        target=work
        action="working"
    elif game_hour>=18.0 and game_hour<21.0:
        target=market if seed_value%3==0 else home
        action="visiting" if seed_value%3==0 else "resting"
    else:
        action="sleeping"
    destination=target
    if closeness<3.3 and look_at_player:
        body.rotation.y=lerp_angle(body.rotation.y, atan2(player_pos.x-global_position.x,player_pos.z-global_position.z), minf(delta*3.0,1.0))
    else:
        var target2:=Vector2(target.x,target.z)
        var current:=Vector2(position.x,position.z)
        var distance:=current.distance_to(target2)
        if distance>.3:
            # Far-off characters still advance their schedule; animation is distance-culled.
            var step:=minf(distance,delta*travel_speed * (2.0 if closeness>32 else 1.0))
            var direction:=(target2-current).normalized()
            position.x+=direction.x*step
            position.z+=direction.y*step
            body.rotation.y=lerp_angle(body.rotation.y,atan2(direction.x,direction.y),minf(delta*3.0,1.0))
            if closeness<35:
                body.position.y=sin(game_seconds*5.0+float(seed_value))*.035
        elif closeness<35:
            body.position.y=sin(game_seconds*.8+float(seed_value))*.012
        position.y=home.y if distance<=.3 else lerpf(position.y,target.y,minf(delta*2.0,1.0))
    visible=closeness<100.0
    # This node is updated by the world scheduler; disabling _process does not stop its simulation.
    if body != null and closeness>=35.0:
        body.position.y=0.0

func remember(topic: String, game_day: int, weight: int=4) -> void:
    memory.append({"topic":topic, "day":game_day, "weight":weight})
    if memory.size()>24:
        memory.pop_front()
    relation["familiarity"]=mini(100,int(relation["familiarity"])+2)
    if topic=="help":
        relation["trust"]=mini(100,int(relation["trust"])+6)
        relation["affinity"]=mini(100,int(relation["affinity"])+3)

func last_memory(current_day: int) -> Dictionary:
    for index in range(memory.size()-1,-1,-1):
        var entry: Dictionary=memory[index]
        if int(entry["weight"])>=100 or current_day-int(entry["day"])<=int(entry["weight"]):
            return entry
    return {}

func pack() -> Dictionary:
    return {"position":[position.x,position.y,position.z],"memory":memory.duplicate(true),"relation":relation.duplicate(true),"mood":mood}

func unpack(raw: Dictionary) -> void:
    if raw.has("position") and raw["position"] is Array and raw["position"].size()==3:
        var xyz: Array=raw["position"]
        position=Vector3(clampf(float(xyz[0]),-300,300),clampf(float(xyz[1]),-30,80),clampf(float(xyz[2]),-300,300))
    memory.clear()
    if raw.get("memory",null) is Array:
        for item in raw["memory"].slice(-24):
            if item is Dictionary and item.has("topic") and item.has("day") and item.has("weight"):
                memory.append({"topic":str(item["topic"]).substr(0,60),"day":clampi(int(item["day"]),0,10000),"weight":clampi(int(item["weight"]),1,100)})
    if raw.get("relation",null) is Dictionary:
        for attribute in relation.keys():
            relation[attribute]=clampi(int(raw["relation"].get(attribute,relation[attribute])),0,100)
    mood=str(raw.get("mood",mood)).substr(0,30)