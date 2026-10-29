# 0.8.0 imported skinned character candidate — 2026-10-29

Base 35a2780dbe09e9e0e1a215209d6206c9d60e89a1. Owner prioritizes a visibly playable stylized game over actor likeness. Two licensed KayKit CC0 assets now load through Babylon GLB containers and instantiate across eight roles. Original procedural render pieces are hidden, gameplay/collision roots retained. Idle/walk/run/interact/cheer clips selected from real skeletal animation. Source tests: 28 PASS locally; final Chromium visual/gameplay validation PENDING. No target-device FPS or final art acceptance claimed. Runtime assets and license recorded in Docs/IMPORTED_CHARACTER_ASSETS.md. Rollback: revert this single cohort; old save key preserved.

# P05 browser candidate 0.7.0 — acceptance gates

| Gate | Current evidence |
|---|---|
| Original 12-second score / birds / wind | Source authored; Node schedule tests PENDING; audible device review NOT RUN |
| Natural meadow and character silhouette | Source authored; Babylon NullEngine geometry / visual Chromium PENDING; character production acceptance NOT GIVEN |
| Existing stage2 saved mission recovery | Root cause diagnosed; new restart and optional errand source + save tests PENDING |
| Gandalf story dialogue after arrival | Source + desktop/touch Chromium PENDING |
| Full canon chapters, film-level skinned GLB, 30 FPS physical device | NOT IMPLEMENTED / NOT VERIFIED |
| GitHub PR exact HEAD / Pages | PENDING at candidate authoring |

P04 first run 40925340163: FAIL scene mesh budget threshold (21/22 pass). Renderer was not run; no visual acceptance. New source reduces rich geometry to principal four and shares eye/skin materials while retaining named source-level hero detail regression and the same mesh-budget gate. Await exact-head retest.

# 0.6.0 P04 visual candidate
- SOURCE_AVAILABLE: original hero face eyes, eyebrows, lip shapes, tailoring and wizard silver strands.
- STATIC + UNIT / CHROMIUM / VISUAL: pending exact-head proof.
- Full skinning/artist-grade deformation and real-device GPU FPS: not asserted.

## P03 first visual test findings
Commit c35303064004057fd6dd6ea39951b46aadc360c0: source/node + Chromium PASS, artifact 12899098251. Birthday camera composition FAIL visual review due large mound blocking characters; corrective camera/crowd source created and needs new exact-head screenshot. Preserve accepted mission/save outcomes and no new runtime meshes.

# 0.5.0 P03 candidate acceptance

| Test | Gate |
|---|---|
| Gandalf-first progression and refusal to skip narrative gate | Unit + Chromium exact-head PENDING |
| Bilbo + Sam + apples legacy state compatibility | Unit and in-browser saved reload PENDING |
| Original birthday scene/2D fireworks and party skip | Desktop/WebGL screenshot PENDING |
| Canon Bilbo departs and Ring passes to Frodo | Deterministic unit + in-browser QA PENDING |
| Phone 360px dialogue and original start-triggered ambience | Preserve existing QA PENDING |
| Next source-licensed/skinned characters and Shire-Bree gameplay | Separate following P04+ milestones |

## 0.4.0 source receipts and P02 refinement
- Main a09e42e: Pages 40875240720 PASS, Chromium 40875240699 PASS; PR7 40874619398 Node/browser tests PASS for indoor gameplay, audio and mobile dialogue.
- Follow-up visual: moved distant furniture into a closer Hobbit-room composition, added small homely props; photo of new browser result + 360px UI/touch room proof required before P02 artistic acceptance.
- Hardware mobile GPU performance NOT DEVICE TESTED (CI uses SwiftShader).

# 0.4.0 candidate gates

| Gate | Status before exact-HEAD test |
|---|---|
| Mobile 390 px dialogue/chat full horizontal coverage | SOURCE_CANDIDATE + Chromium screenshot / bounds test pending |
| Music starts from Start tap | SOURCE_CANDIDATE + Chromium label check pending |
| High-first quality starts at 1x and self-adapts | SOURCE_CANDIDATE + browser smoke pending |
| Bag End room, interior/exit, sofa/books/lighting | SOURCE_CANDIDATE; Babylon NullEngine + Chromium gameplay screenshot pending |
| Save/return, legacy save recovery | SOURCE_CANDIDATE; unit + browser pending |
| Physical phone GPU / Windows 30 FPS | NOT DEVICE TESTED |

## 0.3.0 visual evidence before framing refinement
Exact-head Chromium at `932f2a999aae75f0d108fe2d49c3bdb091c8d6f7`: PASS all browser/map/story tests and 17/17 Node tests; screenshots artifact 12853642534. Visual review found cinematic too close to pony; a wider camera and real-time timeline are corrective candidates requiring new screenshot QA. SwiftShader median desktop 2 FPS / mobile emulated 6 FPS is software-only and does not establish physical device performance.

## Browser 0.3.0 corrective regression
First PR run 40773627395: FAIL 1/17 tests due to outdated test assumption of previous east boundary; 16 PASS, browser not run. Source candidate repairs test to assert collision at expanded boundary x=49 and extends tap movement bounds. Exact-head re-test required.

# Browser 0.3.0 production acceptance (candidate before CI)

| Feature | Acceptance gate |
|---|---|
| Expanded 17 hill homes / 12 road branches / market decorations | SOURCE_READY; collision, real Chrome screenshot required |
| Map with player, landmarks, NPCs and active apple task | SOURCE_READY; keyboard, touch and overlay QA required |
| Original Gandalf pony cart and Frodo encounter | SOURCE_READY; scene test + screenshot, exit restores actors |
| Existing quest, saving, collisions, mobile controls | Regression tests required at exact PR SHA |
| Hardware FPS / production-AAA characters / later film chapters | Not inferred from browser QA |

# Batch 1B 0.2.3 — pre-CI acceptance

| Gate | Evidence |
|---|---|
| Auto FPS scale, hysteresis, manual override | Source candidate; regression tests PENDING |
| Garden tending routines and bounds | Source candidate; runtime/QA PENDING |
| Browser WebGL desktop/mobile, save and chat | Exact-HEAD QA PENDING |
| GitHub Pages publication | PENDING |
| Target 30 FPS on physical devices, new rigged characters, cinematic pony/cart | NOT RUN / NOT IMPLEMENTED |

# Current acceptance — 0.2.2 candidate

| Gate | Status | Evidence / limitation |
|---|---|---|
| Base HEAD / previous Pages | PASS | 0a52cef; run 40752445899 |
| Dependency restore / source / 12 tests | PASS locally | Babylon 9.32.1 checksum; joint and collision assertions |
| Character rigid batching | PASS structurally | 346 -> 200 meshes; 336506 triangles unchanged |
| Whole-head articulation | PASS engine logic | Eye vertices move with neck; hair/features parented together |
| Desktop/touch browser | PENDING final SHA | Local final audio/input smoke PASS, software 6/20 FPS; not hardware acceptance |
| PCM ambience / gain controls | PASS unit; listening NOT RUN | Original noise plus existing synthesized birds/music |
| Production character art / animation clips | NOT IMPLEMENTED | Existing procedural silhouettes retained |
| Frodo / pony / cart cinematic | NOT IMPLEMENTED | Supplied screenplay sequence inspected; see ledger |
| Target PC 720p / physical phone 30 FPS | NOT RUN | SwiftShader never substitutes for owner GPU |
| Final candidate merge / Pages SHA | PENDING | Must inspect exact-SHA CI and publication before release claim |

The tables below are historical evidence, not current blanket acceptance.

# Browser prototype verification matrix

| Capability | Source | Static | Engine logic | Browser visual | Owner device |
|---|---|---|---|---|---|
| Scene and stylized characters | Implemented | PASS | NullEngine construction PASS | BLOCKED: cloud WebGL unavailable | NOT RUN |
| Walk/collision | Implemented | PASS | Native house/ground/boundary regression PASS | NOT RUN | NOT RUN |
| Camera/touch input | Implemented | PASS | NOT RUN | NOT RUN | NOT RUN |
| Dialogue and quest sequence | Implemented | PASS | Rules tests PASS | NOT RUN | NOT RUN |
| Apple range and duplicate protection | Implemented | PASS | PASS | NOT RUN | NOT RUN |
| Local persistence | Implemented | PASS | Serialization/validation PASS | Browser reload NOT RUN | NOT RUN |
| Audio | Synthesized birds only | PASS | NOT RUN | NOT RUN | NOT RUN |
| Performance | Geometry batching implemented | 22 static batches | Counts only | FPS NOT MEASURED | NOT RUN |
| Film plot and recognizable art | Opening context; original side errand | Provenance documented | No canon outcomes simulated | NOT ACCEPTED | NOT RUN |
| GitHub source backup | Dedicated repository supplied | Valid source tree | Prepared for cohesive commit | CI to be verified at pushed HEAD | N/A |

An engine construction or CI pass does not establish browser playability, visual acceptance or target-device performance. No official PES session is marked COMPLETE.

## 2026-10-28 proposed browser evidence

| Added check | Source | Current status before CI evidence |
|---|---|---|
| Articulated hobbit walking and handheld props | `dist/world.mjs`, `dist/game.mjs` | Source candidate; NOT VISUALLY ACCEPTED |
| Actual Chromium WebGL render, desktop quest and save/reload | `tests/browser-qa.mjs` | Automated workflow added; NOT RUN at document authoring |
| Emulated mobile joystick/camera/interact | Same runner | NOT RUN at document authoring; not a physical phone test |
| 720p FPS evidence | CI artifact JSON | NOT MEASURED on target hardware; software SwiftShader samples only |
| Site deployment linked to this commit | Separate ChatGPT Sites origin | NOT DEPLOYED / NOT VERIFIED |

- `40597790986`: FAIL at JS syntax; no browser images/video or FPS generated. Root cause corrected in subsequent candidate; browser tests still require successful execution.

- `40597990755` at `06bb84e`: real WebGL RENDER_OBSERVED and desktop movement video captured; source tests PASS; browser quest E2E FAIL at first waypoint because of time-step cap; dialogue, quest completion, mobile and target hardware NOT RUN. Software WebGL screenshot showed house-door occlusion and overexposure, corrected only in follow-up unverified source candidate.

- `40598395983` at `3f28fc9`: JS tests PASS, Babylon WebGL screenshot real, but end-to-end travel FAIL on low-FPS software rendering. House doors visible; no chapter/gameplay completion proof, no 30 FPS device measurement.
- New candidate: Frodo mesh and free-text Arabic contextual conversations SOURCE_AVAILABLE, local conversation engine unit tests PASS (3); integrated build, browser interaction and visual acceptance await exact-HEAD Actions evidence. **True generative AI: NOT IMPLEMENTED.**
- Story: F1-01 pre-party canon context. Original apple-collection side activity only; movie plot cutscenes and locked ring-transfer outcome remain NOT IMPLEMENTED.

- PR browser QA `40599606372`: PASS on synthetic merge ref `1a8f9bc` (artifact `12778800072`). WebGL real rendering PASS; dialogue + localized contextual chat PASS; quest functional DOM flow PASS with QA relocation; save/reload PASS; desktop movement smoke PASS; mobile touch emulation PASS. **Exact feature HEAD still NOT RUN** until corrected checkout. Full-map walking/pathfinding NOT RUN, physical device NOT RUN, visual resemblance NOT ACCEPTED.
- Software SwiftShader samples were 3 FPS desktop median and 7 FPS mobile-emulated median. Target-device FPS NOT MEASURED and 30 FPS target NOT VERIFIED.

- Exact-head run `40600040728`: PASS at SHA `8e39c0d`, artifact `12777793020`, 10 Node tests + real Chromium WebGL desktop/phone-emulated flow, no browser exceptions. Browser live dialogue, save and task gates PASS via QA relocation, full walking path NOT ACCEPTED. Rendering 2 FPS desktop / 6 FPS simulated mobile in **software GPU**, hardware target 30 FPS NOT VERIFIED.
- Bilbo costume silhouette and Arabic metadata update: candidate SOURCE_AVAILABLE, RENDER_OBSERVED only after new exact-HEAD build. Character visual resemblance remains a design target, not an accepted claim.

- `40600431467` exact-head `8413ac7`: browser QA PASS; no full-route pathfinding proof or target-device performance acceptance.
- Proposed 0.2.1 Arabic portrait UI: SVG source and tests added; browser screenshot/video validation PENDING. Optional Arabic browser-system narration is SOURCE_AVAILABLE only; device speech synthesis NOT RUN. True model-backed generative conversation NOT IMPLEMENTED.

- Soundscape + NPC gestures candidate: SOURCE_AVAILABLE after push, JavaScript/unit/Chromium checks pending; original Web Audio synthesis, opt-in button, pause on background tab, no film recording. Actual phone audio and visual acceptance NOT TESTED.

- Background farmers (3) / light swaying canopies (11): source candidate; PASS only after exact-head tests, still NOT PHYSICAL-DEVICE TESTED. No pathfinding/day schedule.


