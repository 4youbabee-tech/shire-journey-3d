# Checkpoint v2 - Shire Journey 3D, Native Godot 4.4.1
**Date:** 2026-10-16  
**Repository:** https://github.com/4youbabee-tech/shire-journey-3d  
**Branch:** `production/godot-native-chapter1-20261016`  
**Verified Windows/Linux build:** https://github.com/4youbabee-tech/shire-journey-3d/actions/runs/38908700660

## Actual completed work - ORIGINAL-GAME

- Replaced the old HTML delivery path with an independently editable Godot 4 project using the GL Compatibility renderer; the original HTML is preserved on GitHub.
- Constructed an explorable native 3D Hobbiton scene, including Bag End exterior, Hobbit holes, garden plots, paths, river, bridge, market stalls, Party Field and watermill.
- Imported ten original project-generated GLB scene assets for foliage, props and architecture and three original OGG ambiences (birds, river, rain). This checkpoint does **not** claim imported third-party CC0 mesh assets.
- Added four 512x512 original albedo/normal PBR-style material maps for grass and earth, material and texture checksums, a stone-trimmed round door and warm lanterns, and less intrusive fog. Corrected terrain face culling after a screenshot revealed missing ground.
- Added light hearth-smoke effects, limited local rain particles and smooth rain audio gain; these are simulation visuals, not cinematic particle production assets.
- Implemented Frodo 3D movement (WASD, sprint, jump, first/third camera) and fixed the opening spawn/camera to avoid roof collision and HUD wrapping.
- Added 54 seeded NPC profiles and schedule-based movement/working/socializing/rest/shelter and bilingual authored dialogue with bounded memory/relationship saves. These are not rigged photorealistic characters or independent generative AI agents.
- Added 19 simple stateful animals/insects (chickens, rabbits, butterflies), weather/day-night activity, and persistent state. Some low-spec draw culling is implemented.
- Implemented a 24-real-minute simulation clock and story transition between the 3001 birthday prelude and 3018 departure; this does not yet fully implement special intercalary Shire calendar days.
- Added serialized local save schema 2 covering player, story flags, NPC memory, weather and animals.

## Checks actually performed

- Local source check: **90/90** static Python assertions, including GLB validity, audio and checksums.
- GitHub Actions run `38908700660`: Linux import and GDScript parser check **passed**, native day/weather smoke **passed**, main scene simulated for 120 frames **passed**, virtual-display screenshot **captured**.
- The same run exported the Windows EXE and PCK and launched the exported Windows EXE headlessly for 120 frames: **passed**.
- A genuine software-rendered Godot screenshot is included as `docs/in_engine_hobbiton_2026-10-16.png`; this is not concept art and not a performance benchmark.
- Rendering on Linux's virtual/CPU graphics displayed low debug FPS. The 720p 30FPS requirement for Intel i7 gen6/8GB/2GB VRAM remains **unverified**.

## Known problems and non-completed milestones

- The scene is visibly prototype-stylized, not Witcher 3-like realistic. Real scanned PBR surfaces, photogrammetry, optimized LOD vegetation and art-directed landscape composition require further production.
- No rigged hero faces, skeletal animation library, blinking, advanced lip sync, English recorded voice cast or fully furnished Bag End interior.
- No 50 independent high-level offscreen planning agents, complete four-season and festival simulation, lore-bound local LLM generation, or final canon-adapted chapter cinematics.
- No target PC GPU benchmark, compatibility certification, digitally signed installer or polished Windows production release.
- The emitted Windows ZIP is a **playable test candidate**, not a final finished game. Its EXE and PCK must remain side by side.
- The reference repository `fellowship-personal-game` was not accessed or modified.

## Recommended continuation and Unreal bridge

Continue Chapter I in Godot 4 for the specified older PC. Keep GLB/FBX models, texture maps, OGG/WAV and JSON/data contracts as engine-independent assets. A future Unreal Engine 5 migration is feasible but **not a one-click conversion**: Godot `.gd`, `.tscn`, procedural world code, renderer settings, GUI and physics must be rewritten into C++/Blueprints and Unreal assets. Do not change engines before proving the Shire environment visually and functionally.

**Provenance:** All new weather, wildlife, market schedules and original side activities are `ORIGINAL-GAME`, not film or book canon. Original reference PDFs, scripts, film images or audio were not redistributed to the public repository. External CC0 sources considered but not yet integrated are documented in `ASSETS_AND_PROVENANCE.md`.