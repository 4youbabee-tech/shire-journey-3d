extends CharacterBody3D
# AR: حركة أصلية Godot مع كاميرا أول/ثالث (ليس HTML).
signal interact
signal quick_save
var pivot: Node3D
var cam: Camera3D
var first := false
var enabled := true
var sensitivity := 0.0024

func _ready() -> void:
    var shape := CollisionShape3D.new()
    var capsule := CapsuleShape3D.new()
    capsule.radius = 0.36
    capsule.height = 1.5
    shape.position.y = 0.75
    shape.shape = capsule
    add_child(shape)
    pivot = Node3D.new()
    pivot.position.y = 1.4
    add_child(pivot)
    cam = Camera3D.new()
    cam.current = true
    cam.fov = 70
    pivot.add_child(cam)
    _camera()
    Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _camera() -> void:
    cam.position = Vector3.ZERO if first else Vector3(.6,.2,4.0)

func _unhandled_input(event: InputEvent) -> void:
    if event is InputEventMouseMotion and enabled and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
        rotation.y -= event.relative.x * sensitivity
        pivot.rotation.x = clampf(pivot.rotation.x-event.relative.y*sensitivity,-.75,.55)
    if event.is_action_pressed("view"):
        first = not first
        _camera()
    if event.is_action_pressed("interact") and enabled:
        interact.emit()
    if event.is_action_pressed("save"):
        quick_save.emit()
    if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
        Input.mouse_mode = Input.MOUSE_MODE_VISIBLE if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED else Input.MOUSE_MODE_CAPTURED

func _physics_process(dt: float) -> void:
    var axis := Input.get_vector("left","right","forward","back")
    var movement := (transform.basis * Vector3(axis.x,0,axis.y)).normalized() if enabled else Vector3.ZERO
    var speed := 6.5 if Input.is_action_pressed("sprint") else 4.1
    velocity.x = lerpf(velocity.x,movement.x*speed,minf(1,dt*8))
    velocity.z = lerpf(velocity.z,movement.z*speed,minf(1,dt*8))
    velocity.y = -0.2 if is_on_floor() else velocity.y-13.0*dt
    move_and_slide()
