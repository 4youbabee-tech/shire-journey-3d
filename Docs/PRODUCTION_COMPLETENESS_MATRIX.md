# Cozy Shire — Active Production Matrix / 0.9.2 candidate

| Area | Current state | Acceptance still required |
|---|---|---|
| Runtime / deployment | Babylon.js 9.32.1; main/Pages 0.9.1; PR #15 draft | Exact-head 0.9.2 QA, merge and Pages SHA verification |
| Opening | Gandalf pony-cart arrival, Frodo dialogue and control handoff | Visual review of camera, horse/cart, sound and timing |
| Characters | Four authored CC0 hero GLBs; 65-bone rigs; 12 clips per hero; eyelid/gaze support | Face/cloth/hand/foot close-ups and smoother in-motion transitions |
| Ring | Real torus attached to Bilbo/Frodo ring-finger bones; ownership follows saved `ringPassed` | Current finger-size patch, unobstructed close-ups and normal gameplay visibility |
| Village | 17 homes, 12 roads, orchard, market, pond, gardens, 16 animated canopies, 3 gardeners | Visual variety, collision walk-around, low-cost nature and calm NPC schedules |
| Bag End | Functional interior; 102 decor objects / 2 lights in CI sample | Cozy visual review, useful tiny interactions, safe door/camera/collision |
| Garden task | Three apples and Sam interaction; save/reload | Clear optional objective and pleasant feedback |
| Birthday | Seven existing participants, original 14-second effects, skip/save outcomes | Natural-playback and post-party free-roam visual review |
| Audio | Original 51-second score, four CC0 footsteps, licensed forest ambience | Cart/hoof, door, garden, pond and party layers; listening review |
| Mobile | Touch joystick, camera drag, interaction, Arabic dialogue at 360–390 px | Physical phone usability and FPS/memory test |
| Performance | SwiftShader warning only; 920–1,022 meshes and ~635–649k triangles | Profile and optimize; physical PC/phone 30 FPS NOT RUN |
| Scope | One cozy Shire village experience | No full trilogy or large-region expansion in current scope |

## Active order

1. C0: correct Ring scale and real close-ups; verify house collision in WebGL.
2. C1: optimize existing village nature/mesh/animation costs.
3. C2: add a few tiny optional atmosphere/comfort interactions.
4. C3: polish the four hero characters, homes and calm village life.
5. C4: full cozy-slice desktop/touch and physical-device acceptance, then publish.

Source tests, WebGL, visual acceptance and physical-device acceptance are separate gates. SwiftShader is never represented as hardware FPS.

Historical records below are retained for provenance only; the active matrix above defines the current product scope.

