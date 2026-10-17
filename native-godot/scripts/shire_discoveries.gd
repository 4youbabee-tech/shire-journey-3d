class_name ShireDiscoveries
extends RefCounted
## FILM-EXPANDED / ORIGINAL-GAME one-time environmental vignettes.
## Distinct named locations, meaningful cultural notes; never rewrites story events.
const SITES := [
 {"id":"bridge","pos":Vector2(35.0,8.0),"en":"Examine the old Water Bridge","ar":"تفحّص جسر النهر العتيق",
  "text_en":"Worn wooden rails tell of generations crossing the Water on market mornings.",
  "text_ar":"تحكي الدرابزينات الخشبية البالية عن أجيال عبرت النهر في صباحات السوق."},
 {"id":"mill","pos":Vector2(30.5,-20.5),"en":"Listen beside the watermill","ar":"أنصت إلى صوت الطاحونة",
  "text_en":"The wheel turns steadily; even the miller measures the days by the water.",
  "text_ar":"تدور عجلة الطاحونة بانتظام، والماء نفسه يساعد الطحان على قياس الأيام."},
 {"id":"garden","pos":Vector2(-28.0,-13.5),"en":"Look over Sam's garden","ar":"تأمل حديقة سام",
  "text_en":"Well-tended seedlings and damp earth reveal a gardener who notices every season.",
  "text_ar":"تكشف الشتلات المعتنى بها والأرض الرطبة عن بستاني يعرف أسرار الفصول."},
 {"id":"market","pos":Vector2(23.0,12.0),"en":"Inspect the market goods","ar":"تفحّص بضائع السوق",
  "text_en":"Bread, vegetables and crates arrive along the lanes, each with a neighbour's story.",
  "text_ar":"يصل الخبز والخضار والصناديق عبر الطرقات، ولكل منها حكاية عند الجيران."},
 {"id":"fields","pos":Vector2(-62.0,30.0),"en":"Study the southern fields","ar":"تأمل الحقول الجنوبية",
  "text_en":"Rows of green growth show why the Shire's families value careful, patient work.",
  "text_ar":"تُظهر صفوف الزرع لماذا يقدّر أهل الشاير العمل المتقن والصبر."},
 {"id":"willows","pos":Vector2(37.0,-42.0),"en":"Pause by the river willows","ar":"توقف عند صفصاف النهر",
  "text_en":"The reeds lean over the banks, and willow branches stir when the wind shifts.",
  "text_ar":"تميل أعواد القصب فوق الضفاف وتتحرك أغصان الصفصاف مع تغيّر الريح."} ,
 {"id":"orchard","pos":Vector2(-79.0,15.0),"en":"Inspect the orchard boundary","ar":"تفحّص أطراف البستان",
  "text_en":"Fallen apples nourish soil and insects, while the harvest feeds neighbours.",
  "text_ar":"يغذّي التفاح المتساقط التربة والحشرات، كما يطعم المحصول أهل القرية."},
 {"id":"hedgerow","pos":Vector2(-43.0,17.0),"en":"Listen to the hens by the hedge","ar":"أنصت إلى الدجاج قرب السياج",
  "text_en":"Small feet stir the grass. Even a quiet homestead has its own busy rhythms.",
  "text_ar":"تقلّب الأقدام الصغيرة العشب؛ حتى الدار الهادئة لها إيقاع مليء بالحركة."},
 {"id":"hillpath","pos":Vector2(-49.0,-39.0),"en":"Follow the worn hillside path","ar":"تأمل الدرب فوق التل",
  "text_en":"Countless familiar journeys have worn the track: to a neighbour's door and home before dusk.",
  "text_ar":"رسمت الرحلات المتكررة هذا الدرب: إلى باب جار، ثم العودة إلى البيت قبل المساء."},
 {"id":"party_tree","pos":Vector2(-4.0,-8.0),"en":"Study the grass at Party Field","ar":"تأمل العشب في حقل الاحتفال",
  "text_en":"Grass bears the tracks of tables and laughter; fresh shoots will follow the feast.",
  "text_ar":"يحفظ العشب آثار الطاولات والضحكات، ثم تنمو براعم جديدة بعد الوليمة."},
 {"id":"north_lane","pos":Vector2(9.0,63.0),"en":"Look down the northern lane","ar":"انظر إلى امتداد الطريق الشمالي",
  "text_en":"The cottages thin out, and the village sounds fade behind the hedges.",
  "text_ar":"تقل البيوت هنا وتتلاشى أصوات القرية خلف الأسيجة."},
 {"id":"mill_brook","pos":Vector2(40.0,-18.0),"en":"Follow the water below the mill","ar":"تتبّع مجرى الماء قرب الطاحونة",
  "text_en":"The current carries leaves past the wheel, working long after the miller goes home.",
  "text_ar":"يحمل التيار أوراق الشجر قرب العجلة، ويواصل الماء عمله بعد عودة الطحّان."},
 {"id":"bagshot_letter","pos":Vector2(-36.8,-33.5),"en":"Read a letter on Bagshot Row","ar":"اقرأ رسالة في صف باغشوت",
  "text_en":"A cousin's sealed letter waits beside the porch, ready for the evening reading.","text_ar":"تنتظر رسالة مختومة من أحد الأقارب قرب الرواق لتُقرأ عند حلول المساء."},
 {"id":"north_garden_seeds","pos":Vector2(-37.8,-10.5),"en":"Inspect the spring seed trays","ar":"تفحّص صواني بذور الربيع",
  "text_en":"Every labelled sprout carries the careful hopes of the northern gardeners.","text_ar":"تحمل كل شتلة موسومة آمال البستانيين الذين يعتنون بحدائق الشمال."},
 {"id":"south_hill_copper","pos":Vector2(-10.8,-46.5),"en":"Study the bright cooking pots","ar":"تأمل قدور الطبخ اللامعة",
  "text_en":"Polished copper vessels are ready for bread and soup shared with travellers.","text_ar":"تنتظر الأواني النحاسية المصقولة خبزًا وحساءً يُقدّمان للمسافرين."},
 {"id":"north_lane_wool","pos":Vector2(9.2,22.5),"en":"Inspect the household wool","ar":"تفحّص صوف أهل الحارة",
  "text_en":"Soft dyed wool will become warm blankets when the winter nights grow long.","text_ar":"سيتحوّل الصوف المصبوغ الناعم إلى أغطية دافئة حين تطول ليالي الشتاء."},
 {"id":"market_hill_produce","pos":Vector2(25.2,20.5),"en":"Examine the produce table","ar":"تفحّص طاولة المحاصيل",
  "text_en":"Fresh vegetables are sorted into crates for the first market visitors.","text_ar":"تُفرز الخضراوات الطازجة في صناديق قبل وصول أوائل زوار السوق."},
 {"id":"western_row_joinery","pos":Vector2(-54.8,-19.5),"en":"Inspect the carpenter's workbench","ar":"تفحّص منضدة النجّار",
  "text_en":"Little pegs and measured wood tell of a new round door for a neighbour.","text_ar":"تحكي الأوتاد الصغيرة والأخشاب المقاسة عن باب دائري جديد لأحد الجيران."},
 {"id":"western_grove_herbs","pos":Vector2(-53.8,3.5),"en":"Examine the woodland herbs","ar":"تفحّص أعشاب الغابة",
  "text_en":"Carefully dried leaves wait in the shade for a cold season's herbal tea.","text_ar":"تنتظر الأوراق المجففة بعناية في الظلّ لتصبح شايًا عشبيًا في موسم البرد."},
 {"id":"longacre_sheaves","pos":Vector2(-26.8,37.5),"en":"Inspect the harvest sacks","ar":"تفحّص أكياس الحصاد",
  "text_en":"Grain saved from the autumn fields will carry many families through winter.","text_ar":"ستعين الحبوب المحفوظة من حقول الخريف عائلات كثيرة خلال الشتاء."},
 {"id":"eastern_orchard_apples","pos":Vector2(39.2,32.5),"en":"Inspect the orchard apple crates","ar":"تفحّص صناديق تفاح البستان",
  "text_en":"The ripest apples are put aside for neighbours preparing the next feast.","text_ar":"تُحفظ أكثر حبات التفاح نضجًا للجيران الذين يستعدون للوليمة المقبلة."}
]
var seen: Dictionary = {}

func nearest(world: Vector3, inside: bool = false) -> Dictionary:
    if inside:
        return {}
    var player:=Vector2(world.x,world.z)
    for site in SITES:
        if seen.has(str(site["id"])):
            continue
        if player.distance_to(site["pos"])<2.1:
            return site
    return {}

func discover(id: String) -> Dictionary:
    if seen.has(id):
        return {}
    for site in SITES:
        if str(site["id"])==id:
            seen[id]=true
            return {"id":id,"en":str(site["text_en"]),"ar":str(site["text_ar"]),"progress":seen.size()}
    return {}

func pack() -> Dictionary:
    return {"seen":seen.duplicate(true)}

func unpack(raw: Dictionary) -> void:
    seen.clear()
    var restored=raw.get("seen",{})
    if not restored is Dictionary:
        return
    for site in SITES:
        var id: String=str(site["id"])
        if restored.get(id,false)==true:
            seen[id]=true

func reset() -> void:
    seen.clear()
