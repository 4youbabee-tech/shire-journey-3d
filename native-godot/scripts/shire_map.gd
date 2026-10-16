class_name ShireMap
extends Control
## ORIGINAL-GAME discoverable parchment map: route orientation, no lore claims.
const SIZE := Vector2(790, 440)
var locations: Array = []
var player_position := Vector2.ZERO

func _ready() -> void:
    custom_minimum_size = SIZE
    mouse_filter = Control.MOUSE_FILTER_IGNORE

func configure(points: Array, position_world: Vector2) -> void:
    locations = points.duplicate(true)
    player_position = position_world
    queue_redraw()

func project(world: Vector2) -> Vector2:
    return Vector2(42.0+(world.x+105.0)/210.0*700.0, 45.0+(world.y+105.0)/210.0*330.0)

func _draw() -> void:
    draw_rect(Rect2(Vector2.ZERO,SIZE),Color("d6c29b"),true)
    var frame := Color("876e45")
    draw_rect(Rect2(14,14,762,412),frame,false,3.0)
    var ink := Color("4b432e")
    # A stylized river and connecting Shire lanes based on game-world coordinates.
    var river_points := PackedVector2Array()
    for z in range(-104,105,8):
        var x: float = 39.0 + 3.5*sin(float(z)*.042)
        river_points.append(project(Vector2(x,float(z))))
    draw_polyline(river_points,Color("659b99"),6.0,true)
    var lanes := [
        [Vector2(-46,-30),Vector2(-24,-20),Vector2(-2,-3),Vector2(17,8),Vector2(41,8)],
        [Vector2(-2,-3),Vector2(9,65)],
        [Vector2(-2,-3),Vector2(-62,28)],
        [Vector2(17,8),Vector2(32,-20)]
    ]
    for road in lanes:
        var line := PackedVector2Array()
        for point in road:
            line.append(project(point))
        draw_polyline(line,Color("b49162"),4.0,true)
    var font: Font = get_theme_default_font()
    if font == null:
        return
    draw_string(font,Vector2(27,34),"THE SHIRE  •  HOBBITON",HORIZONTAL_ALIGNMENT_LEFT,-1,18,ink)
    for location in locations:
        var p := project(Vector2(float(location[3]),float(location[4])))
        draw_circle(p,5.8,Color("466746"))
        draw_circle(p,3.2,Color("e9ddaf"))
        var label: String=str(location[1])
        # Stagger dense labels around Bag End so they remain legible.
        var shift := Vector2(9, -8)
        if str(location[0]) == "bagend": shift=Vector2(9,-17)
        if str(location[0]) == "bagshot": shift=Vector2(-102,17)
        if str(location[0]) == "garden": shift=Vector2(9,18)
        draw_string(font,p+shift,label,HORIZONTAL_ALIGNMENT_LEFT,-1,11,ink)
    var player_dot := project(player_position)
    draw_circle(player_dot,8.0,Color("7c3c2f"))
    draw_circle(player_dot,4.0,Color("fff1cd"))
    draw_string(font,Vector2(32,408),"YOU  •  Red marker    |    Press M or Esc to return",HORIZONTAL_ALIGNMENT_LEFT,-1,14,ink)
