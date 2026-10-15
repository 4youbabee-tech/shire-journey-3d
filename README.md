# SHIRE JOURNEY 3D

**Private, personal-use browser 3D adventure prototype** set in Middle-earth. This repository is **independent** of `fellowship-personal-game` (a separate Unreal Engine project). Do not merge their codebases or reuse their project management.

## Intended experience
- Follow the central Tolkien story with Frodo as the main character, switching to other heroes when the narrative requires.
- Semi-open areas organized by chapters; exploration, interactive quests, and cinematic story moments remain balanced.
- First-person/third-person camera toggle.
- English spoken lines and Arabic subtitles; four-choice conversations inspired by *Fallout 4*. **No microphone and no typed dialogue.**
- Living NPC goals, schedules, event memory, social consequences, context-sensitive actions, and eventually AI-assisted response selection.
- Cinematic art direction inspired by *The Lord of the Rings* films and the rich, grounded environmental style of *The Witcher 3*. Those are **artistic targets**, not claims of parity.
- Target hardware: Intel Core i7 6th generation, 8 GB RAM, roughly 2 GB VRAM. Optimize for 720p / 30 FPS baseline, adjustable detail, and strong CPU/GPU budgets.

## State (2026-10-15)
Prototype development is in progress. Earlier Shire and Bree playable chapters were validated in a browser. The next checkpoint includes a Weathertop work-in-progress and contextual, authored NPC memory interactions. **This is not a finished Witcher-3-quality game**: the models, animations and materials remain prototypical; generative NPC AI is not yet live.

## Milestone checklist
- [x] Playable Shire prototype: movement, camera, Bag End, voice/subtitle choice dialogue, saving
- [x] Playable compact Bree chapter: tavern and Strider, role switching
- [ ] Production-quality Bag End exterior and Frodo/hero models (external assets, LODs and PBR materials)
- [ ] Comprehensive performance profiling on the target computer
- [ ] NPC AI backend with a secure API gateway, memory persistence, deterministic action permissions, and fallback for offline play
- [ ] Canon-consistent chapter expansion through the end of the story
- [ ] Windows desktop packaging / EXE and full regression QA

## Important distinctions
1. The source and the published test build must be explicit about what is implemented, tested, and aspirational.
2. The private repository should **not** contain any Tolkien book PDFs, screenplay PDFs, unlicensed audio, or secrets. Story/source references remain outside the repository.
3. NPC offline authored responses are not generative AI; future integrations must preserve on-screen dialogue choices.
4. A successful automated logic test is not evidence of final visual quality or target-device FPS.

## Run
When the source and standalone HTML artifacts have been pushed, open `PLAY-Shire-Journey.html` in a desktop Chrome/Edge browser. For the modular build, serve the directory with a local static HTTP server and visit `index.html`. Press WASD to move, E to interact, V to toggle view, and the number keys to choose dialogue.

All characters, music, dialogue, models and third-party dependencies must be reviewed for licensing before any public release. Personal-use scope does not automatically grant redistribution rights.
