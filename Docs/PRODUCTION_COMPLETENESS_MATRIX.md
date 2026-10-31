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



## Exact-head browser correction — 90d8519

Actions 41187332860 passed npm install, syntax and all source tests, then Chromium correctly exposed one stale browser assertion: the post-party Frodo ownership check still expected the previous oversized Ring range (0.035–0.065), while the new intended range is 0.018–0.03. The runtime handoff itself was not the failing condition; the stale expected-size assertion was. The assertion now matches the new finger-sized geometry. Re-run exact-head desktop/touch Chromium and inspect the new unobstructed Ring close-ups before accepting this candidate.


## Visual-evidence correction — d4ffc8a

Exact-head Actions 41187684996 passed source tests, desktop/touch Chromium, full opening playback and full birthday playback. However, inspection of the uploaded artifact showed both Ring close-up PNGs were black even though the report confirmed the real mesh and correct finger bone. The gameplay engine is created with `preserveDrawingBuffer:false`; the inspection helper stopped the render loop and issued only one manual render, so the browser screenshot did not retain the WebGL frame. The next QA helper keeps a render-only loop active during the close-up capture, hides the HUD, and uses an oblique camera around the finger. Until the new PNGs are inspected, Ring visual acceptance remains NOT PASSED; no merge or publication.


## Ring capture frame synchronization — 4dae2c3

The next exact-head browser run passed its source gates and real desktop/touch playback, but the two Ring close-up PNGs remained black. The capture helper now awaits two browser animation/compositor frames after switching to the inspection camera and records ring world position, ring axis and camera position/target in the QA report. The ring visual gate is still NOT PASSED until those actual PNGs show the hand and band clearly.
