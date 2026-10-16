# SHIRE JOURNEY 3D — One cinematic quality bar for EVERY chapter

**Status: production policy, not a claim of completion.**
**Applies to:** Chapter I / The Shire AND every later playable chapter, location, transition and finale.
**Technical baseline:** Godot 4.4.1, Windows. The existing 1280×720 GL Compatibility build is a baseline for low-spec testing, **not** the definition of cinematic fidelity.

## One standard, no downgraded later chapters

The Shire is the visual, narrative and engineering **reference chapter**. Each subsequent chapter must reach the same *level of craft*, even if its lighting, architecture, creatures, vegetation and palette necessarily differ. Every chapter needs an authored benchmark scene, a complete playable route, asset provenance and an independently recorded visual, audio and gameplay review.

A successful CI build, image screenshot, number of NPCs, or count of props does NOT independently establish a cinematic release. No placeholder chapter, low-poly CC0 art, generic dialogue, inaccessible interior or untested transition may be labeled FINAL.

## Acceptance criteria — all are mandatory, for each chapter

1. **Characters:** licensed/original high-fidelity, distinct and consistent faces, costumes, hair and creature rigs; no duplicate temporary protagonists; correct physical scale, silhouette and materials; reviewed closeups and in-motion profiles.
2. **Animation and performance:** genuine locomotion state machine (idle/walk/run/turn/stop), environmental interactions, contextual gestures, believable facial expressions; for voiced performances, edited voice recordings and timed lip/viseme cues. Procedural mouth movement without audio is a fallback, not final.
3. **Environment:** authored area-specific terrain, foliage, ground scatter, layered distance, readable landmarks, coherent scale, collision and traversable paths; each named site in the applicable map bible must be traced to a playable scene or a documented scoped exclusion.
4. **Architecture / interiors:** individually art-directed exterior façades and functional interiors where gameplay requires them; refined topology, convincing surfaces, doors, furnishings, set dressing, character-scale transitions, proper light direction.
5. **Materials / lighting / camera:** calibrated PBR maps where appropriate, physically coherent roughness and texel density, filmic exposure/contrast without clipping, justified post-processing, dusk/night/rain grading, controlled cinematic framing; assess real frames in-engine. Avoid treating generic free low-poly packs as final-quality art.
6. **Sound / music / VO:** original or appropriately licensed environmental stems, sound zones, footsteps, indoor/outdoor acoustics, dialogue recordings (where authored), mix balancing, localization/subtitle sync, consistent audio levels; no unauthorized film soundtrack or voice clones.
7. **NPC life and narrative:** persistent, tested social memory, schedules, quests, events, meaningful reactivity and the chapter's canonical timeline. Bilingual text quality checked in context; optional lore clearly separated from source events.
8. **Gameplay / polish:** fully reachable main quest from opening to handoff, optional activities, save/load at interiors and transitions, complete journal/map/UI, pause/menu/skip accessibility, tested failure/recovery states, no dead ends.
9. **Performance / stability:** measured frame-time and memory on actual target hardware in daylight, rain, market crowd and indoor scenes; no repeated critical hitches or asset-loading failures. Capture exact machine, resolution, build, scenario, results; **never invent a target-device benchmark**.
10. **Legal / provenance / packaging:** traceable rights for every redistributed asset, hashes and versioned receipts, automated imports, repeatable packaging, installer/archive integrity, Windows execution verification.

## Release evidence rules

- For **each** of these ten areas, provide a **reviewer**, **evidence reference** (link or versioned QA report path), and a justified state. Screenshots are valid evidence for *appearance only*, not for lip sync, performance or game completion.
- A mechanical CI smoke can mark a software scenario PASS, not a complete art or player-experience PASS.
- Each future chapter starts at **pending**; the same acceptance contract applies, no exemptions.
- Whole-game cinematic FINAL requires **every** chapter individually accepted AND a separate end-to-end continuity/transition/playthrough review for the entire game.
- Current Chapter I status: **playable candidate; cinematic art/performance quality NOT approved**.
- Keep a versioned manual evidence manifest at `production/quality/chapter_acceptance.json` and use `tools/audit_quality_contract.py`.
- Normal CI builds may produce candidates while the audit is incomplete; a release claiming *cinematic final* must run `--require-final` and fail while outstanding requirements remain.
- Do not call a project final based on a spec, generated picture, or successful compilation.

## Immediate Chapter I quality debt (truthful as of 2026-10-17)

- KayKit hero characters and many villagers are stylized/placeholder, not realistic fully face-rigged hero art.
- Some Poly Haven CC0 PBR surfaces and environmental models are imported, but architecture geometry, terrain and foliage fidelity are not fully art-directed or reviewed.
- Thematic original/bilingual text and scripted transitions exist; recorded full VO, lipsync and cinematic camera blocking are not complete.
- Indoor/exterior interaction, discovery, save/load and Windows CI smoke exist; long-form hands-on gameplay and genuine target-device frame-time proof remain outstanding.
- The existing GitHub Windows ZIP is a **development candidate** until all gates are verified.

### Per-chapter delivery template (for every later chapter)

Copy `production/quality/chapter_template.json` and replace the chapter id, canonical story/map coverage, representative benchmark scenes and art-specific evidence. The first implementation of each chapter must include one playable vertical slice with verified character, location, quest, cutscene, audio, save/load and measurement workflows; only then extend breadth. Final gates never become more lenient than the Shire's.

### Useful supporting documents

- `ASSET_SOURCE_CATALOG.md` (provenance and audited asset leads)
- The attached project Source Rules, Map Bible, Characters Bible, Gameplay Bible, Visual Reference Bible and Production Systems Index
- GitHub Actions: `.github/workflows/godot-native.yml`
