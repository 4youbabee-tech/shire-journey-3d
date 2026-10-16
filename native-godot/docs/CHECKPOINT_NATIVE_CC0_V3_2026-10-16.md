# Shire Journey Native Godot - CC0 Art and Living World Checkpoint 3
Date: 2026-10-16

## Delivery
- Source branch: https://github.com/4youbabee-tech/shire-journey-3d/tree/production/godot-native-chapter1-20261016
- Godot engine: 4.4.1 Standard (GL Compatibility renderer), native GDScript, independent from WebGL/HTML. Run via `project.godot`.
- Windows export generated through GitHub Actions, with EXE and PCK kept side by side.

## Actual implementation
- Hobbiton + Bag End exterior, Shire paths, river, mill, market, garden and Party Field scene made of native Godot terrain and independently importable GLB geometry.
- 54 authored or seeded NPC identities, simulated schedules (work, rest, market, shelter), bilingual English/Arabic choice dialogue and bounded per-NPC memory/relationship save records.
- Frodo first/third-person camera, keyboard control, quests; original 3001 birthday prelude is separated from 3018 departure story chronologically.
- 19 simple chickens, rabbits and butterflies with daylight/rain activity and persistent state; chimney smoke, local rain particles and three project-created OGG loops.
- Four original 512px material maps, plus **Poly Haven Leafy Grass** official CC0 scanned diffuse/normal texture. Official 1K MD5 checks verified by the separate GitHub import workflow; source ZIP includes both original 1K and optimized 512 copies, while GitHub game branch includes the smaller 512 derivations with SHA256 checksums. Godot's ground material loads the actual optimized imported asset, not a mere web link.
- Corrected camera spawn, HUD wrapping, terrain back-face culling, and unsupported material constants after real Godot/Windows tests.

## Real tests
- Local static validator checks integrity of source files, GLB/audio/texture checksums, CC0 metadata and the implemented systems. Results are printed by `python3 tests/verify_native_release.py`.
- Required release gate: Godot 4.4.1 Linux headless asset import and parse, native simulation for 120 frames, **real screenshot via a virtual display**, Windows export, then **Windows EXE headless launch for 120 frames**.
- A virtual-display software-rendered screenshot cannot establish i7 gen6 / 8GB RAM / 2GB VRAM performance. The debug FPS shown in this software context must not be presented as performance on the user's Windows GPU.

## Art and rights
- Poly Haven page: https://polyhaven.com/a/leafy_grass; author Charlotte Baglioni; CC0 1.0. Verified official URL/hash metadata preserved in `assets/external/polyhaven_leafy_grass/LICENSE_AND_SOURCE.json`.
- All other scene GLB assets and sounds are ORIGINAL-GAME and their generators are included. No film visuals/audio or user-supplied PDF books have been redistributed.

## What is NOT finished
- Photorealistic or Witcher-3-quality graphics, fully rigged facially animated heroes, interiors for every hobbit house, complete seasons/astronomy/festivals, cinematic Frodo/Gandalf/Bilbo party scenes, comprehensive believable animal behaviors or independent procedural AI agents.
- Actual 720p/30fps on the target PC and realistic-graphics acceptance: not tested. This is a living-world prototype and Windows development candidate, not a finished AAA game.
- Unreal Engine conversion is possible later, but models/materials/audio/data can be transferred more readily than `.gd`, `.tscn`, dynamic world geometry and custom gameplay which require reimplementation.

## Next quality gate
Playtest the Windows candidate on the actual hardware, capture day/rain/dusk FPS, replace proxy Frodo/Sam/Bilbo with authored licensed rigged heroes, build a furnished Bag End interior and real cinematic action beats. Continue The Shire before adding Bree.