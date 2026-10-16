# Native Godot Migration — Checkpoint 2026-10-16

## Completed on local editable files
- Migrated to a new native Godot 4 project structure (`project.godot`, `scenes/Main.tscn`, native GDScript controllers and simulations), not a disguised HTML game.
- Created 10 original GLB meshes; generated two synthetic WAV ambiences, modeled Hobbiton and Bag End in Godot scene code.
- Native 3D player control, day/night, rain/fog logic, 54 NPC profiles, bilingual offline dialogue with context, saved memories, stage-based Chapter I story with correct 3001-to-3018 transition.
- Introduced low-spec renderer choice `gl_compatibility`, near/far NPC update throttle and MultiMesh grass.

## Evidence & limitations
- Run `python3 tests/verify_native_release.py` for static GLB/audio/script reference checks.
- The environment creating these files has no Godot editor/runtime executable, so **no launch test, actual screenshots, Windows EXE export or target hardware FPS test was completed**.
- Visuals remain custom prototype artwork, not validated high-fidelity production assets; no external downloaded CC0 GLB can be claimed.
- Full playable Windows EXE, rigged/animated character models, full Bag End interior and later chapters are incomplete.
- Reference project `fellowship-personal-game` was not used or altered.

## Next real production gate
Import in Godot and run, resolve engine parser/runtime issues, benchmark real Windows machine, import audited licensed PBR assets, then release verified EXE and in-engine screenshots. Do not merge incomplete changes into main production without this gate.

## GitHub source checkpoint
Native source was staged on the branch `production/godot-native-chapter1-20261016`; linked GLB and OGG assets are committed separately. This branch has not been merged into `main`, because the Godot engine launch gate is still unverified.