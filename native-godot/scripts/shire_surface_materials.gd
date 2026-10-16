class_name ShireSurfaceMaterials
extends RefCounted
## Approved CC0/PBR palette for domestic Hobbiton art; high quality without heavy shader passes.
const BASE := "res://assets/surfaces/polyhaven_cc0/"
static var _cache: Dictionary = {}

static func _make(category: String, tint: Color, repeat_uv: float, fallback_roughness: float) -> StandardMaterial3D:
    var key: String=category + "_" + tint.to_html() + "_" + str(repeat_uv)
    if _cache.has(key):
        return _cache[key]
    var mat:=StandardMaterial3D.new()
    mat.albedo_color=tint
    mat.roughness=fallback_roughness
    mat.metallic=0.0
    mat.uv1_scale=Vector3(repeat_uv,repeat_uv,1.0)
    var diffuse_path: String=BASE+category+"/albedo.jpg"
    var normal_path: String=BASE+category+"/normal_gl.jpg"
    if ResourceLoader.exists(diffuse_path):
        mat.albedo_texture=load(diffuse_path) as Texture2D
    if ResourceLoader.exists(normal_path):
        mat.normal_enabled=true
        mat.normal_texture=load(normal_path) as Texture2D
        mat.normal_scale=.34
    _cache[key]=mat
    return mat

static func floor_wood() -> StandardMaterial3D:
    return _make("floor",Color("d5bfaa"),4.0,.85)

static func plaster_walls() -> StandardMaterial3D:
    return _make("plaster",Color("eeddbb"),2.0,.94)

static func wooden_trim() -> StandardMaterial3D:
    return _make("floor",Color("bca283"),2.2,.86)

static func roof_turf() -> StandardMaterial3D:
    const DIFFUSE := "res://assets/external/polyhaven_leafy_grass/diffuse_512.jpg"
    const NORMAL := "res://assets/external/polyhaven_leafy_grass/normal_gl_512.jpg"
    if _cache.has("roof_turf"):
        return _cache["roof_turf"]
    var mat:=StandardMaterial3D.new()
    mat.albedo_color=Color("8bb17b")
    mat.roughness=.98
    mat.uv1_scale=Vector3(3.0,2.0,1.0)
    if ResourceLoader.exists(DIFFUSE):
        mat.albedo_texture=load(DIFFUSE) as Texture2D
    if ResourceLoader.exists(NORMAL):
        mat.normal_enabled=true
        mat.normal_texture=load(NORMAL) as Texture2D
        mat.normal_scale=.22
    _cache["roof_turf"]=mat
    return mat
