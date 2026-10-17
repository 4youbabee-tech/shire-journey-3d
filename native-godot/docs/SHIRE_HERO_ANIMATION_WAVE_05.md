Hero animation production wave 05 - source implemented, awaiting runtime CI.

Four named characters have licensed CC0 GLB sources loaded in existing Avatar.build.
This change adds explicit run clip discovery and deterministic locomotion selection.
Player sprint now requests a run clip when a licensed GLB provides one; otherwise
walk animation remains a graceful fallback. Far-NPC coarse simulation is unchanged.
Godot CI instantiates all four heroes in an actual running scene, checks imported
Skeleton3D and AnimationPlayer content and validates movement clip selection.

LIMIT: KayKit rigs are stylized, not believable human portraits, and face blend
shapes/visemes are not required by this test. Final realistic human sculpt,
hair, clothing, facial rig, texture licenses and user acceptance remain pending.
