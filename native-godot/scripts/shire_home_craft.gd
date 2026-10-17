class_name ShireHomeCraft
extends RefCounted
## Nine original-game household identities: unique objects and bilingual domestic lore.
## Decoration has no collision, no Tick, no external asset/texture licensing risk.
const THEMES := {
    "bagshot_cottage":{"motif":"letters","accent":"aa6c45","fabric":"bcaa84","reading":["A folded letter from a distant cousin lies beside the household ledger.","توجد رسالة مطوية من قريب بعيد بجوار سجل المنزل."],"pantry":["The cupboards are neatly numbered for every visiting relation.","خزائن المؤونة مرقمة بعناية لكل قريب يزور الدار."],"hearth":["The family chairs are kept close together for evening stories.","تتقارب كراسي العائلة حول الموقد لحكايات المساء."]},
    "garden_cottage":{"motif":"seedlings","accent":"608454","fabric":"abc58f","reading":["Little gardening sketches mark the dates of spring's first seeds.","تحدد رسومات الزراعة الصغيرة مواعيد أولى بذور الربيع."],"pantry":["Seed packets and fresh herbs hang over the gardening table.","تتدلى أكياس البذور والأعشاب الطازجة فوق طاولة البستنة."],"hearth":["A warm stone pot waits to shelter tender plants on frosty nights.","ينتظر وعاء حجري دافئ ليحمي النباتات الغضة في الليالي الباردة."]},
    "hill_cottage":{"motif":"copper","accent":"b77c43","fabric":"a68468","reading":["Handwritten recipes have flour dust in the folds.","تختبئ آثار الطحين في طيات وصفات الطعام المكتوبة باليد."],"pantry":["Bright copper pots and wooden spoons crowd the kitchen shelves.","تملأ القدور النحاسية اللامعة والملاعق الخشبية رفوف المطبخ."],"hearth":["The smell of yesterday's bread seems to linger by the embers.","تبدو رائحة خبز الأمس باقية قرب الجمر."]},
    "northern_cottage":{"motif":"wool","accent":"9a7890","fabric":"c6b3c1","reading":["A family pattern book describes scarves made for old winters.","يحكي دفتر نقوش العائلة عن أوشحة حيكت لشتاءات مضت."],"pantry":["Baskets of washed wool wait for the spinning wheel.","تنتظر سلال الصوف المغسول قرب مغزل الغزل."],"hearth":["Soft blankets hang near the fire to dry after the rain.","تتدلى الأغطية الناعمة قرب النار لتجف بعد المطر."]},
    "market_cottage":{"motif":"market","accent":"b09b55","fabric":"e1cf96","reading":["A careful tally lists the food neighbours ordered this morning.","تسجل قائمة دقيقة ما طلبه الجيران من طعام هذا الصباح."],"pantry":["Wicker crates preserve the day's vegetables and fragrant loaves.","تحفظ سلال الخوص خضار اليوم وأرغفة الخبز العطرة."],"hearth":["A kettle is ready for merchants returning from the early market.","إبريق الشاي جاهز للتجار العائدين من السوق المبكرة."]},
    "west_row_cottage":{"motif":"joinery","accent":"8c6240","fabric":"a89772","reading":["A carpenter's sketches show a new round-door frame.","تكشف رسومات النجار عن إطار جديد لباب دائري."],"pantry":["Chisels and smooth wooden pegs rest on the workbench.","تستريح الأزاميل والأوتاد الخشبية الملساء فوق طاولة العمل."],"hearth":["Fine sawdust glitters beside the bench after a long day's craft.","يلمع نشارة الخشب قرب المقعد بعد يوم طويل من الحرفة."]},
    "west_grove_cottage":{"motif":"herbal","accent":"72936d","fabric":"b7c79a","reading":["The notebook remembers when each woodland herb was gathered.","يتذكر الدفتر موعد جمع كل عشبة من أحراش الغابة."],"pantry":["Dried leaves and fragrant bundles hang above glazed jars.","تتدلى الأوراق الجافة وحزم العطر فوق الجرار المزججة."],"hearth":["A healing tea steeps quietly in an earthenware cup.","ينقع شاي الأعشاب بهدوء في كوب فخاري."]},
    "longacre_cottage":{"motif":"harvest","accent":"c49a53","fabric":"d1bf8a","reading":["The family grain ledger marks good years and lean ones.","يسجل دفتر حبوب العائلة سنوات الرخاء وسنوات الشدة."],"pantry":["Golden sheaves and tidy flour sacks line the dry storage room.","تصطف سنابل ذهبية وأكياس طحين مرتبة داخل المخزن الجاف."],"hearth":["The farmers share a simple supper while the fields grow quiet.","يتقاسم المزارعون عشاء بسيطًا فيما تهدأ الحقول."]},
    "east_orchard_cottage":{"motif":"orchard","accent":"ad5946","fabric":"dbbba0","reading":["An orchard map counts every tree that survived the last winter.","تحصي خريطة البستان كل شجرة صمدت في الشتاء الماضي."],"pantry":["Red apples and small cider jars are stored on low oak shelves.","يُخزَّن التفاح الأحمر وجرار عصير التفاح على رفوف البلوط المنخفضة."],"hearth":["Baked apples cool beside the hearth for the next visitor.","يبرد التفاح المخبوز قرب الموقد للزائر القادم."]}
}

static func vignette(id: String, place: String) -> Dictionary:
    var data: Dictionary=THEMES.get(id,{})
    if not data.has(place):
        return {}
    var words: Array=data[place]
    return {"en":str(words[0]),"ar":str(words[1])}

static func motif(id: String) -> String:
    return str(THEMES.get(id,{}).get("motif","none"))

static func _mat(color: String) -> StandardMaterial3D:
    var m:=StandardMaterial3D.new()
    m.albedo_color=Color(color)
    m.roughness=.87
    return m

static func _box(parent: Node3D, name: String, at: Vector3, size: Vector3, tint: String) -> void:
    var obj:=MeshInstance3D.new()
    obj.name=name
    var shape:=BoxMesh.new()
    shape.size=size
    obj.mesh=shape
    obj.position=at
    obj.material_override=_mat(tint)
    obj.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(obj)

static func _ball(parent: Node3D, name: String, at: Vector3, scale: Vector3, tint: String) -> void:
    var obj:=MeshInstance3D.new()
    obj.name=name
    var mesh:=SphereMesh.new()
    mesh.radial_segments=10
    mesh.rings=6
    obj.mesh=mesh
    obj.position=at
    obj.scale=scale
    obj.material_override=_mat(tint)
    obj.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(obj)

static func dress(home: Node3D, id: String) -> void:
    var theme: Dictionary=THEMES.get(id,{})
    if theme.is_empty():
        return
    var root:=Node3D.new()
    root.name="HouseCraft_"+id
    home.add_child(root)
    var accent: String=str(theme["accent"])
    var fabric: String=str(theme["fabric"])
    var kind: String=str(theme["motif"])
    # Keep central reading, pantry, hearth and exit interaction clear.
    _box(root,"OriginalHouseholdRunner",Vector3(1.7,.07,2.7),Vector3(2.4,.04,1.1),fabric)
    _box(root,"OriginalWindowDrapeLeft",Vector3(-5.68,2.2,-1.3),Vector3(.07,1.2,1.0),fabric)
    _box(root,"OriginalWindowDrapeRight",Vector3(5.68,2.2,1.0),Vector3(.07,1.2,.9),fabric)
    _box(root,"OriginalDisplayShelf",Vector3(4.9,1.1,3.6),Vector3(1.65,.13,.45),"785739")
    for k in range(6):
        _box(root,"OriginalKeepsake_%02d" % k,Vector3(-5.1+float(k%3)*.33,2.38+float(k/3)*.21,-3.5),
            Vector3(.17,.20,.22),accent)
    # Nine distinct motifs, using actual scene meshes rather than labels alone.
    for k in range(14):
        var col: int=k%7
        var row: int=k/7
        var x: float=3.82+float(col)*.19
        var z: float=2.94+float(row)*.37
        match kind:
            "letters":
                _box(root,"LetterAndWaxSeal_%02d" % k,Vector3(x,1.28,z),Vector3(.13,.019,.25),
                    "eadcb9" if k%3 else accent)
            "seedlings":
                _box(root,"TerracottaSeedTray_%02d" % k,Vector3(x,.69,z),Vector3(.16,.13,.16),"a16b47")
                _ball(root,"FreshSeedling_%02d" % k,Vector3(x,.84,z),Vector3(.09,.14,.085),"527744")
            "copper":
                _ball(root,"KitchenCopperPot_%02d" % k,Vector3(x,1.26,z),Vector3(.14,.13,.14),"bd8648")
            "wool":
                _ball(root,"SoftDyedWool_%02d" % k,Vector3(x,.45,z),Vector3(.17,.18,.15),
                    fabric if k%2 else accent)
            "market":
                _box(root,"MarketWickerCrate_%02d" % k,Vector3(x,.5,z),Vector3(.18,.20,.16),"967447")
                _ball(root,"Produce_%02d" % k,Vector3(x,.68,z),Vector3(.10,.11,.10),
                    "9baf5f" if k%2 else "b64a35")
            "joinery":
                _box(root,"CarpentersTool_%02d" % k,Vector3(x,.86,z),Vector3(.06,.10,.31),
                    "a28c66" if k%2 else "595f60")
            "herbal":
                _ball(root,"DriedHerbBundle_%02d" % k,Vector3(x,2.60,z),Vector3(.08,.30,.12),
                    "6d8a50" if k%2 else "a6a65b")
            "harvest":
                _ball(root,"CanvasGrainSack_%02d" % k,Vector3(x,.35,z),Vector3(.19,.32,.24),"c6af79")
            "orchard":
                _ball(root,"HarvestApple_%02d" % k,Vector3(x,1.26,z),Vector3(.15,.15,.15),
                    "af4434" if k%2 else "c99343")
    _box(root,"HandWovenHouseholdBedding",Vector3(-3.8,.72,2.9),Vector3(2.0,.12,1.25),fabric)
    _box(root,"KitchenOakWallPegRail",Vector3(5.0,2.55,-3.8),Vector3(1.6,.09,.13),"785739")
    for k in range(6):
        _box(root,"HandcarvedPeg_%d" % k,Vector3(4.45+float(k)*.21,2.43,-3.73),Vector3(.04,.21,.08),accent)
