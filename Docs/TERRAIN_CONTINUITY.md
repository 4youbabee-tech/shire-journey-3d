# Raised Bag End and traversable Shire terrain

Source relationship: the official Hobbiton Movie Set history places Bag End atop the rising hill overlooking the Party Tree and lakeside. The supplied World, Locations & Map Bible, Shire and Bag End location sheets, calls for navigable landmark silhouettes, world-state variants, collision/backtracking/reload QA. This module implements that vertical relationship in the existing compact layout; it is not presented as an exact film-set survey or a new world map.

A compact hill rises around Bag End, with a flat party meadow and door terraces. The same deterministic elevation function positions terrain, roads, home structures, colliders, trees, flowers and villagers. Player camera height follows the real collision body; return positions and old X/Z saves gain the correct ground height without changing story state. Character bounds are normalized at zero elevation before restoring the actor's ground position, avoiding an offset caused by using world-space bounds on the hill.

The ground is one 80-subdivision render/collision mesh. Road edges independently sample elevation; static architecture bakes the height into the existing material batches. No separate scene or engine is introduced. First-region cinematic routes remain in the flat meadow; the indoor legacy scene remains at its existing independent coordinates.

Native acceptance uses the actual Babylon collision solver: climb onto the terrace, reach the real door interaction and walk back down without reset or falling. Both isolated terrain and full-world traversal are tested. Browser raster, return-from-interior, natural scenes, save and measured performance remain the next acceptance gates before this terrain branch can merge.

Reference: https://www.hobbitontours.com/discover/our-story/ . Modern tourist interiors and additions are not treated as Fellowship canon.
