class_name ShireChapterCinema
extends CanvasLayer
## ORIGINAL-GAME story transitions. Accessible bilingual titles, original prose,
## no film frames, licensed film music, voices or video assets.
signal sequence_finished(cue: String)
const DURATION := 6.8
var active := false
var cue := ""
var elapsed := 0.0
var root: Control
var veil: ColorRect
var chapter_title: Label
var narrative: Label
var arabic: Label
var instruction: Label

func _label(value: String, font_size: int, tint: Color) -> Label:
    var result := Label.new()
    result.text = value
    result.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    result.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
    result.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    result.add_theme_font_size_override("font_size",font_size)
    result.add_theme_color_override("font_color",tint)
    result.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    result.offset_left=110
    result.offset_right=-110
    return result

func _ready() -> void:
    layer=30
    root=Control.new()
    root.name="CinematicCanvas"
    root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    root.mouse_filter=Control.MOUSE_FILTER_IGNORE
    root.visible=false
    add_child(root)
    veil=ColorRect.new()
    veil.name="LetterboxDissolve"
    veil.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    veil.color=Color(.021,.031,.026,0)
    veil.mouse_filter=Control.MOUSE_FILTER_IGNORE
    root.add_child(veil)
    chapter_title=_label("",42,Color("f3dbac"))
    chapter_title.anchor_top=.32
    chapter_title.anchor_bottom=.44
    chapter_title.offset_top=0
    chapter_title.offset_bottom=0
    root.add_child(chapter_title)
    narrative=_label("",22,Color("f2eddf"))
    narrative.anchor_top=.48
    narrative.anchor_bottom=.58
    narrative.offset_top=0
    narrative.offset_bottom=0
    root.add_child(narrative)
    arabic=_label("",22,Color("e2d5b8"))
    arabic.anchor_top=.61
    arabic.anchor_bottom=.71
    arabic.offset_top=0
    arabic.offset_bottom=0
    root.add_child(arabic)
    instruction=_label("SPACE / E  ·  Continue | متابعة",14,Color("c5b69a"))
    instruction.anchor_top=.85
    instruction.anchor_bottom=.92
    instruction.offset_top=0
    instruction.offset_bottom=0
    root.add_child(instruction)

func begin(kind: String) -> void:
    if active:
        return
    cue=kind
    elapsed=0.0
    active=true
    root.visible=true
    match kind:
        "years":
            chapter_title.text="SEVENTEEN YEARS LATER"
            narrative.text="The familiar hills endure. The road is changing."
            arabic.text="بعد سبعة عشر عاماً، بقيت التلال كما هي، لكن الطريق بدأ يتغيّر."
        "departure":
            chapter_title.text="CHAPTER I  ·  THE SHIRE"
            narrative.text="The green hills fall behind. Ahead lies the unknown road."
            arabic.text="تبقى تلال الشاير الخضراء خلفهما، ويبدأ أمامهما طريق مجهول."
        _:
            chapter_title.text="THE SHIRE"
            narrative.text="A quiet place with many stories."
            arabic.text="مكان هادئ يحمل حكايات كثيرة."
    veil.color.a=0.0
    chapter_title.modulate.a=0.0
    narrative.modulate.a=0.0
    arabic.modulate.a=0.0
    instruction.modulate.a=0.0

func _process(delta: float) -> void:
    if not active:
        return
    elapsed+=delta
    var reveal: float=smoothstep(.0,1.3,elapsed)
    var release: float=1.0-smoothstep(DURATION-1.7,DURATION,elapsed)
    var alpha: float=clampf(minf(reveal,release),0,1)
    veil.color.a=alpha*.93
    chapter_title.modulate.a=alpha
    narrative.modulate.a=alpha
    arabic.modulate.a=alpha
    instruction.modulate.a=alpha*.8
    if elapsed>=DURATION:
        finish()

func finish() -> void:
    if not active:
        return
    active=false
    root.visible=false
    var finished_cue: String=cue
    cue=""
    sequence_finished.emit(finished_cue)
