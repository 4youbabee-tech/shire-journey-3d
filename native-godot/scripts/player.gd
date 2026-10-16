class_name ShirePlayer
extends CharacterBody3D
const AvatarScript = preload("res://scripts/shire_avatar.gd")
## WASD + mouse, Shift sprint, Space jump, V camera. Frodo is original controlled actor.
var speed := 5.2
var gravity := 16.0
var first_person := false
var yaw := 0.0
var pitch := -0.18
var visual : Node3D
var avatar: ShireAvatar
var camera : Camera3D
var head_pivot : Node3D
var body_parts : Array[Node3D] = []
var active := true

func _ready() -> void:
    name="Frodo"
    var collision := CollisionShape3D.new()
    var capsule := CapsuleShape3D.new()
    capsule.radius = 0.37
    capsule.height = 1.55
    collision.shape = capsule
    collision.position.y = 0.79
    add_child(collision)
    visual=Node3D.new()
    visual.name="FrodoVisual"
    add_child(visual)
    avatar=AvatarScript.new()
    avatar.name="FrodoAvatar"
    visual.add_child(avatar)
    avatar.build("frodo",Color("7c513c"),13,true)
    head_pivot=Node3D.new()
    head_pivot.position=Vector3(0, 1.38, 0)
    add_child(head_pivot)
    camera=Camera3D.new()
    camera.current=true
    camera.fov=70.0
    camera.near=0.06
    head_pivot.add_child(camera)
    _update_camera()

func _unhandled_input(event: InputEvent) -> void:
    if event is InputEventMouseMotion and Input.mouse_mode==Input.MOUSE_MODE_CAPTURED:
        yaw-=event.relative.x*0.003
        pitch=clampf(pitch-event.relative.y*0.0023,-1.0,0.7)
        rotation.y=yaw
        _update_camera()
    if event is InputEventMouseButton and event.pressed and event.button_index==MOUSE_BUTTON_LEFT and active:
        Input.mouse_mode=Input.MOUSE_MODE_CAPTURED
    if event.is_action_pressed("camera_toggle") and active:
        first_person=not first_person
        _update_camera()

func _update_camera() -> void:
    if not is_instance_valid(camera):
        return
    camera.position=Vector3(0,0,0) if first_person else Vector3(0.45, 1.15, 3.35)
    head_pivot.rotation.x=pitch
    visual.visible=not first_person

func _physics_process(dt: float) -> void:
    if not active:
        velocity.x=move_toward(velocity.x,0.0,dt*10.0)
        velocity.z=move_toward(velocity.z,0.0,dt*10.0)
        velocity.y-=gravity*dt
        move_and_slide()
        return
    var input:=Input.get_vector("move_left","move_right","move_forward","move_back")
    var forward:=-global_transform.basis.z
    var right:=global_transform.basis.x
    var direction:=(right*input.x-forward*input.y)
    direction.y=0.0
    direction=direction.normalized()
    var scale_speed:=1.52 if Input.is_action_pressed("sprint") else 1.0
    velocity.x=move_toward(velocity.x,direction.x*speed*scale_speed,dt*18.0)
    velocity.z=move_toward(velocity.z,direction.z*speed*scale_speed,dt*18.0)
    if not is_on_floor():
        velocity.y-=gravity*dt
    elif Input.is_action_just_pressed("jump"):
        velocity.y=5.0
    else:
        velocity.y=0.0
    move_and_slide()
    if not first_person and direction.length()>0.01:
        visual.position.y=sin(Time.get_ticks_msec()*0.014)*0.045
    else:
        visual.position.y=move_toward(visual.position.y,0.0,dt*2.0)
    avatar.animate_walk(direction.length()>0.05,Time.get_ticks_msec()*.001,dt,0.0)
