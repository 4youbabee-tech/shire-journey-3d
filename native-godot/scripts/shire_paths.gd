class_name ShirePaths
extends RefCounted
## Authored road connections. NPC routes remain deterministic and low-cost on old PCs.
## These waypoints describe the existing in-game trails, not an official map claim.
const ROADS = [
    Vector2(-24,-19),Vector2(-21,-10),Vector2(-9,-4),
    Vector2(17,8),Vector2(41,8),Vector2(-3,25),
    Vector2(9,65),Vector2(-44,-3),Vector2(31,-17)
]
const EDGES = [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[2,7],[3,8]]

static func _nearest(point: Vector2) -> int:
    var closest: int=0
    var distance: float=INF
    for i in range(ROADS.size()):
        var candidate: float=point.distance_to(ROADS[i])
        if candidate<distance:
            distance=candidate
            closest=i
    return closest

static func route(start: Vector2, destination: Vector2) -> Array[Vector2]:
    var result: Array[Vector2]=[]
    if start.distance_to(destination)<13.0:
        result.append(destination)
        return result
    var first: int=_nearest(start)
    var last: int=_nearest(destination)
    # Farmland far from a trail remains traversable directly.
    if start.distance_to(ROADS[first])>29.0 or destination.distance_to(ROADS[last])>29.0:
        result.append(destination)
        return result
    var distance: Array[float]=[]
    var parent: Array[int]=[]
    var visited: Array[bool]=[]
    for i in range(ROADS.size()):
        distance.append(INF)
        parent.append(-1)
        visited.append(false)
    distance[first]=0.0
    for step in range(ROADS.size()):
        var chosen: int=-1
        for i in range(ROADS.size()):
            if not visited[i] and (chosen==-1 or distance[i]<distance[chosen]):
                chosen=i
        if chosen==-1 or distance[chosen]==INF or chosen==last:
            break
        visited[chosen]=true
        for edge in EDGES:
            var neighbour: int=-1
            if int(edge[0])==chosen:
                neighbour=int(edge[1])
            elif int(edge[1])==chosen:
                neighbour=int(edge[0])
            if neighbour<0:
                continue
            var cost: float=distance[chosen]+ROADS[chosen].distance_to(ROADS[neighbour])
            if cost<distance[neighbour]:
                distance[neighbour]=cost
                parent[neighbour]=chosen
    var indexes: Array[int]=[]
    var current: int=last
    for iteration in range(ROADS.size()+1):
        if current<0:
            break
        indexes.push_front(current)
        if current==first:
            break
        current=parent[current]
    if indexes.is_empty() or indexes[0]!=first:
        result.append(destination)
        return result
    var path_length: float=start.distance_to(ROADS[first])+destination.distance_to(ROADS[last])+distance[last]
    if path_length > start.distance_to(destination)*2.4:
        result.append(destination)
        return result
    for idx in indexes:
        var waypoint: Vector2=ROADS[idx]
        if start.distance_to(waypoint)>1.4:
            result.append(waypoint)
    result.append(destination)
    return result
