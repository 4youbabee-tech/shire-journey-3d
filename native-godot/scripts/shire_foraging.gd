class_name ShireForaging
extends RefCounted
## Original optional domestic Shire activity; deterministic, bounded, no loot farming exploit.
## Real interactable sites, morning regrowth, market delivery and versioned persistence.
const SITES := [
    {"id":"orchard_1","kind":"fruit","x":-77.0,"z":21.0},
    {"id":"orchard_2","kind":"fruit","x":-70.0,"z":32.0},
    {"id":"orchard_3","kind":"fruit","x":-65.0,"z":40.0},
    {"id":"orchard_4","kind":"fruit","x":-74.0,"z":39.0},
    {"id":"herb_1","kind":"herb","x":-33.0,"z":-17.0},
    {"id":"herb_2","kind":"herb","x":-49.0,"z":-20.0},
    {"id":"herb_3","kind":"herb","x":-39.0,"z":37.0},
    {"id":"herb_4","kind":"herb","x":-15.0,"z":-35.0},
    {"id":"flower_1","kind":"flower","x":-13.0,"z":14.0},
    {"id":"flower_2","kind":"flower","x":3.0,"z":24.0},
    {"id":"flower_3","kind":"flower","x":27.0,"z":28.0},
    {"id":"flower_4","kind":"flower","x":-1.0,"z":40.0}
]
const NEED_PER_KIND := 2
const MARKET := Vector2(17.0,8.0)
var inventory: Dictionary={"fruit":0,"herb":0,"flower":0}
var last_harvest_day: Dictionary={}
var deliveries: int=0

func reset() -> void:
    inventory={"fruit":0,"herb":0,"flower":0}
    last_harvest_day.clear()
    deliveries=0

func can_deliver() -> bool:
    return int(inventory["fruit"])>=NEED_PER_KIND and int(inventory["herb"])>=NEED_PER_KIND and int(inventory["flower"])>=NEED_PER_KIND

func nearby(pos: Vector3, day: int) -> Dictionary:
    var here:=Vector2(pos.x,pos.z)
    if here.distance_to(MARKET)<3.6 and can_deliver():
        return {"mode":"deliver","id":"baker_basket","en":"Deliver a foraged Shire basket to the market",
            "ar":"سلّم سلّة من محصول الشاير إلى السوق"}
    for site in SITES:
        if int(last_harvest_day.get(str(site["id"]),-1))>=day:
            continue
        var where:=Vector2(float(site["x"]),float(site["z"]))
        if here.distance_to(where)<2.4:
            var kind: String=str(site["kind"])
            var label: String="orchard fruit" if kind=="fruit" else "wild herbs" if kind=="herb" else "garden flowers"
            var arabic: String="ثمار البستان" if kind=="fruit" else "الأعشاب البرية" if kind=="herb" else "زهور الحديقة"
            return {"mode":"collect","id":str(site["id"]),"en":"Gather "+label,"ar":"اجمع "+arabic}
    return {}

func perform(action: Dictionary, day: int) -> Dictionary:
    if action.is_empty():
        return {}
    if str(action.get("mode",""))=="deliver":
        if not can_deliver():
            return {}
        for kind in inventory.keys():
            inventory[kind]=int(inventory[kind])-NEED_PER_KIND
        deliveries+=1
        return {"id":"basket_delivery_%d" % deliveries,
            "en":"Delivered a Shire harvest basket to the market. Neighbours will share it.",
            "ar":"سلّمت سلة من محصول الشاير إلى السوق ليتقاسمها الجيران."}
    if str(action.get("mode",""))!="collect":
        return {}
    var id: String=str(action.get("id",""))
    if int(last_harvest_day.get(id,-1))>=day:
        return {}
    for site in SITES:
        if str(site["id"])!=id:
            continue
        var kind: String=str(site["kind"])
        inventory[kind]=mini(99,int(inventory[kind])+1)
        last_harvest_day[id]=day
        return {"id":"forage_"+id+"_day_"+str(day),
            "en":"Collected "+kind+" for the market basket.",
            "ar":"جمعت محصولًا من الشاير لإعداد سلة السوق."}
    return {}

func progress_text() -> String:
    return "Shire harvest %d / %d / %d (fruit / herbs / flowers) • Baskets: %d" % [
        int(inventory["fruit"]),int(inventory["herb"]),int(inventory["flower"]),deliveries]

func pack() -> Dictionary:
    return {"inventory":inventory.duplicate(true),"last_harvest_day":last_harvest_day.duplicate(true),
        "deliveries":deliveries}

func unpack(raw: Dictionary) -> void:
    reset()
    var source=raw.get("inventory",{})
    if source is Dictionary:
        for kind in inventory.keys():
            inventory[kind]=clampi(int(source.get(kind,0)),0,99)
    var harvested=raw.get("last_harvest_day",{})
    if harvested is Dictionary:
        for site in SITES:
            var id: String=str(site["id"])
            if harvested.has(id):
                last_harvest_day[id]=clampi(int(harvested[id]),0,100000)
    deliveries=clampi(int(raw.get("deliveries",0)),0,10000)
