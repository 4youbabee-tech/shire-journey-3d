class_name ShireDialogue
extends RefCounted
## Authored, conditional English/Arabic reply selection; story secrets gated.
## We do not claim copyrighted Tolkien dialogue; all lines below are original.
const TOPICS = ["greeting", "weather", "work", "help", "memory", "journey"]

static func available(npc: ShireNPC, stage: int) -> Array[String]:
    var topics: Array[String]=["greeting","weather","work","memory"]
    if npc.profile_id in ["sam", "rowan", "rosie", "gandalf"]:
        topics.append("help")
    if stage>=5 and npc.profile_id in ["sam", "gandalf"]:
        topics.append("journey")
    return topics

static func label(topic: String) -> String:
    return {"greeting":"Say hello | ألقِ التحية", "weather":"Ask about weather | اسأل عن الطقس", "work":"Ask about the day | اسأل عن العمل", "help":"Offer help | اعرض المساعدة", "memory":"Recall a conversation | تذكّر حديثاً", "journey":"Talk about the road | تحدّث عن الطريق"}.get(topic,topic)

static func answer(npc: ShireNPC, topic: String, weather: String, game_day: int, stage: int) -> Dictionary:
    var name:=npc.display_name
    var remember:=npc.last_memory(game_day)
    var line_en: String=""
    var line_ar: String=""
    var cue: String=""
    match topic:
        "greeting":
            if int(npc.relation["affinity"])>=65:
                line_en="Frodo, there you are! I was hoping we'd cross paths again."
                line_ar="فرودو! كنت أتمنى أن نلتقي مجددًا."
            elif weather in ["heavy_rain", "storm"]:
                line_en="You chose a damp day for a walk. Come in from the rain."
                line_ar="اخترت يومًا ممطرًا للمشي. تعالَ واحتمِ من المطر."
            else:
                line_en="Good day, Frodo. A fine hour to be among neighbours."
                line_ar="نهارك سعيد يا فرودو. إنه وقت جميل لزيارة الجيران."
        "weather":
            if weather in ["storm","heavy_rain","light_rain"]:
                line_en="The gardens are grateful for this rain. The paths will be muddy by supper."
                line_ar="الحدائق ممتنة لهذا المطر، لكن الطرق ستصبح موحلة قبل العشاء."
            else:
                line_en="A breeze from the fields. A fine day to set small things right."
                line_ar="نسيم من الحقول. يوم مناسب لإنجاز الأعمال الصغيرة."
        "work":
            line_en="There's always something to do as a %s. The Shire doesn't tend itself." % npc.job
            line_ar="هناك دائمًا ما يشغلني في عملي. الأرض لا تعتني بنفسها."
        "help":
            cue="help"
            if npc.profile_id=="sam":
                line_en="A few hands in the garden would be welcome. I saved a corner of the path for us."
                line_ar="بعض المساعدة في الحديقة ستكون رائعة. تركت لنا جانبًا من الممر."
            elif npc.profile_id=="gandalf":
                line_en="Sometimes the best assistance is to notice what others overlook."
                line_ar="أحيانًا أفضل مساعدة هي أن تلاحظ ما يغفل عنه الآخرون."
            else:
                line_en="You're kind to ask. A neighbour remembers a hand lent freely."
                line_ar="من لطفك أن تسأل. الجار لا ينسى المساعدة الصادقة."
        "memory":
            if not remember.is_empty():
                line_en="I remember our talk of %s. It has stayed with me." % str(remember["topic"])
                line_ar="أتذكر حديثنا السابق، وما زلت أفكر فيه."
            else:
                line_en="We have plenty of days ahead for stories of our own."
                line_ar="أمامنا أيام كثيرة لنصنع فيها حكاياتنا."
        "journey":
            if stage>=5 and npc.profile_id=="sam":
                line_en="I won't ask where the road goes. Only whether you would have me beside you."
                line_ar="لن أسأل إلى أين يؤدي الطريق. سأسأل فقط إن كنت تريدني إلى جانبك."
            elif stage>=5 and npc.profile_id=="gandalf":
                line_en="Keep your preparations quiet. Not every traveller on the road is a friend."
                line_ar="حافظ على سرية استعداداتك. ليس كل مسافر على الطريق صديقًا."
            else:
                line_en="There is time enough to think about the road when it comes."
                line_ar="سيأتي وقت التفكير بالطريق عندما يحين أوانه."
        _:
            line_en="A pleasant Shire day, isn't it?"
            line_ar="إنه يوم جميل في الشاير، أليس كذلك؟"
    return {"speaker":name, "en":line_en, "ar":line_ar, "memory":cue if cue!="" else topic}