class_name ShireHouseholdChronicle
extends RefCounted
## Nine original bilingual household resolutions; persisted by existing social journal.
const ENDINGS := {
    "bagshot_cottage":["The family entrusts you with letters for neighbours far away. Kind words travel further than any cart.","تأتمنك العائلة على رسائل لجيران بعيدين. وتصل الكلمات الطيبة أبعد من أي عربة."],
    "garden_cottage":["Fresh seedlings are shared with friends who will tend them. Another Shire garden will bloom.","تُوزَّع الشتلات الجديدة على الأصدقاء الذين سيعتنون بها. وستزهر حديقة أخرى في الشاير."],
    "hill_cottage":["The baker keeps a warm loaf for weary travellers returning over the hill.","يحتفظ الخباز برغيف دافئ للمسافرين المتعبين العائدين عبر التلة."],
    "northern_cottage":["A woven blanket is ready for a neighbour before the first winter frost.","أصبح غطاء منسوج جاهزًا لأحد الجيران قبل أول صقيع شتوي."],
    "market_cottage":["The merchant sets aside a supper basket for those delayed on the road.","يترك التاجر سلة عشاء لمن تأخروا في الطريق."],
    "west_row_cottage":["The carpenter has finished a sturdy round door with the help of three neighbours.","أنهى النجار بابًا دائريًا متينًا بمساعدة ثلاثة جيران."],
    "west_grove_cottage":["The herbalist shares a soothing tea and careful advice with tired woodcutters.","تقدّم العشّابة شايًا مهدئًا ونصائح نافعة للحطّابين المتعبين."],
    "longacre_cottage":["The farmers save enough grain to share with neighbours after a difficult harvest.","يدّخر المزارعون من الحبوب ما يكفي لمساعدة الجيران بعد حصاد صعب."],
    "east_orchard_cottage":["Baskets of orchard apples are delivered to the birthday tables for everyone.","تصل سلال تفاح البستان إلى موائد عيد الميلاد للجميع."]
}

static func complete_if_ready(social: ShireSocial, home_id: String, day: int) -> Dictionary:
    if not ENDINGS.has(home_id):
        return {}
    for station in ["reading", "pantry", "hearth"]:
        if not social.discovered.has("cottage_" + home_id + "_" + station):
            return {}
    var key: String="household_chronicle_" + home_id
    if social.discovered.has(key):
        return {}
    var words: Array=ENDINGS[home_id]
    if not social.record(key,str(words[0]),str(words[1]),day):
        return {}
    return {"en":str(words[0]),"ar":str(words[1])}
