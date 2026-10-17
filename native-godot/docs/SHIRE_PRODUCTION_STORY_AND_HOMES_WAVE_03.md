# Shire Journey - Narrative Pass 01 and expanded homesteads

**Status**: bilingual production screenplay, not 14 playable chapters.
The new `shire_campaign_atlas.gd` covers all fourteen registered chapters with
three distinct plot beats each (42 total), plus nine playable Shire stage captions
used by the **actual in-game journal**. These are original written lines, not
transcribed film dialogue. Only the Shire chapter has a playable scene.

Game world: four extra hobbit homes in Bagshot Row, southern lanes and fields
(the existing curved HobbitHole and architecture kits). They are not additional
enterable interiors; no independent household schedules are falsely claimed.

CI includes both headless atlas consistency checks against
`JourneyChapterRegistry` and runtime Godot art checks. Native Blender district
models are now assessed against per-model batched mesh counts instead of insisting
that the simple-material mill has as many draw groups as a market stall.

Next acceptance: actual in-engine screenshot review, full character rigs/visemes,
market/mill dressing detail, interior furnishing and low-VRAM benchmarking.
