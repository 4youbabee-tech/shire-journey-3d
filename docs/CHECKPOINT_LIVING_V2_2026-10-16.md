# Shire Living World v2 - checkpoint 2026-10-16

## Verified repository facts
- Base branch: `main`, inspected head `3cec4169829098ed3a98e62893884b366040bd8e`.
- Published game: `PLAY-Shire-Journey.html` (~4.0 MB) and `builds/Shire-Journey-v1.4.html` (~4.1 MB).
- Documented v1.5 local release is **not** uploaded as a full game/source archive.
- Existing `src/living-simulation.js`, `src/npc-brain.js`, `src/game.js` were read. No change was made to `fellowship-personal-game`.

## Produced in this branch
- `src/shire-living-v2.js`: new independent offline add-on containing Shire clock, deterministic weather and gradients, NPC shelter routing hook, NPC dialogue memory/relationship state, bilingual status plate.
- `tests/living-v2.test.js`: 8 standalone Node tests.
- Existing playable HTML and base game code remain unmodified.

## Important runtime caveats
1. **This add-on is not yet inserted into the published HTML or official bundler**. To exercise it, load the JS as a classic script *after* the original game scripts and before/after initialization; its polling attaches when `window.__SHIRE__` is ready. An integrated playable build has **not** been produced.
2. Some hooks rely on global classic-script function bindings (e.g. `villageRoutine`, `selectNPCStoryTopic`). Integration requires runtime testing in the actual browser before claiming the NPC behavior works.
3. The current calendar uses a simplified 12x30-day model; special Shire intercalary days are not implemented.
4. Weather is logically simulated and influences the existing fog/night fields when attached. Rain particles, PBR, terrain overhaul, downloadable licensed GLB, rigged characters, voice audio and Windows EXE remain **not implemented**.
5. 720p/30FPS on user's Windows computer **not tested**. The 8 tests only cover stand-alone pure logic.
6. Existing `localStorage` save size and upgrade compatibility require full-browser regression; do not assume all 50 NPCs are now simulated.
7. No screenshots are claimed and there is no playable upgraded build.

## Tests
Run `node --test tests/living-v2.test.js` in a cloned checkout. Pure functions were also tested in a JavaScript execution context: 8/8 assertions passed.

## Next implementation checkpoint
- Wire addon into actual build source and single-file HTML.
- Run full browser smoke/regression and restore old save.
- Bring in external **verified licensed** geometry, materials, and animation.
- Build real Bag End/Hobbiton visual comparisons and screenshot evidence.
- Benchmark in real target hardware and package playable artifact.

## Source rules
The supplied project rules require canon provenance; new NPC/weather events here are ORIGINAL-GAME, not canon. No film, book PDF or private reference content is redistributed.
