## Exact-head regression finding, root-cause correction
- First PR CI attempt `40773627395` at `892dbf6aa981396bfe56afc86fc95fbef821532c`: 16 of 17 Node tests PASS; one boundary regression FAIL because its expected collision limit was hardcoded for the old x=33 village edge. Source boundaries were correctly expanded to x=49. Fixed test to derive limit from `MAP_BOUNDS` and test a collision approach at the new east edge. No test assertion was removed or bypassed.
- Also extended tap-to-walk selection to the same map bounds so the new suburban roads can be reached through mobile pointer input. Corrective candidate requires exact-HEAD CI and visual screenshot recheck.

# Browser release 0.3.0 — Living Hobbiton (2026-10-28)

Preproduction: inspected `03_WORLD_LOCATIONS_AND_MAP_BIBLE` (The Shire / Hobbiton: warm domestic circular-door hill homes, gardens, primary routes, recognizable vistas; on-foot navigation), `06_GAMEPLAY_AND_SIDE_ACTIVITIES_BIBLE` (onboarding, low-threat conversations, safe save transitions), and `10_3D_VISUAL_ASSET_ATLAS_PRODUCTION` (location silhouettes, coherent source-led modeling). All new market and secondary neighborhood pieces are original game detail, not asserted film-specific events.

Base exact main `38e901a39eed8c62cd33e38ae71c1492403b8dd5`, prior Actions Browser WebGL 40771183719 PASS and Pages 40771183673 PASS.

Batch 2 scope: 4 to 17 hill houses; 4 to 12 connected pastoral roads; extended collision perimeter; garden benches, lanterns, shrubs, wells, produce marketplace; searchable parchment village map with player, characters, landmarks, quest apples; original short scripted pony/cart arrival with Frodo and Gandalf and a skip / journal replay control. Preserves existing five-stage apple quest, Arabic dialogues, save key/schema and eight characters. Static shared-material batching retained; no downloaded film models/audio. New test coverage for layout, cinematic restoration, map interaction and screenshots; target-device FPS is assessed only through physical testing.

Acceptance: exact-HEAD Node tests + Chromium WebGL desktop/mobile and captured browser images required before merge. Never claim physical device 30 FPS from SwiftShader. Rollback: revert single candidate commit; no Unreal/PES changes.

# Batch 1B 0.2.3 — proposed candidate (2026-10-28)

Based on inspected main a56d91cbbd9f4b3f41a7c9b30d273ee23af7a509. Browser 0.2.2 had exact-HEAD QA PASS 40768052892 and Pages PASS 40768052890.

This cohort introduces sustained device-measured FPS automatic scaling after 8 s warmup / 6 s sampling. Scaling steps are .25 with 12 s cooldown, capped at 2.25; sustained high FPS restores detail. User can select auto/high/light; 30 FPS target is NOT guaranteed. Existing three gardeners gain original pause-and-tend motions with existing rigs and plot bounds; no extra meshes, NPC authorities, collisions, story or save changes.

New unit tests and browser QA capture are SOURCE CANDIDATE pending exact-HEAD validation. SwiftShader results never establish target Windows/device FPS. Rollback is to revert this one commit; Unreal Governor/PES remains untouched.

# Current browser project state — 0.2.2 candidate

## Active authority (2026-10-28)
GitHub `4youbabee-tech/shire-journey-3d` is the sole active source. Public hosting is https://4youbabee-tech.github.io/shire-journey-3d/ . Babylon.js remains 9.32.1. Historical Sites and UE4 references below are archival and do not govern this browser project.

## Production batch 1A: animation integrity, rendering cost, audio controls
Base inspected through GitHub connector: `0a52cefd19f69e06e56704c0e9cdf9b2697e1f9f`; its Pages run `40752445899` succeeded.

- Fixed disconnected facial motion: eyes, nose, ears, hair, beard and hat now follow a common neck pivot.
- Batched rigid character geometry only within the same material and animated parent. 346 -> 200 scene meshes (-42.2%), identical 336,506 triangle count. This is a submission-cost reduction, not a measured 42% FPS gain or new production character art.
- Disabled automatic pointer-move picking; NPC DOM labels update at 10Hz with cached bindings and one layout read; QA serialization is throttled. Removed persistent framebuffer preservation.
- Corrected double DPR downscaling. Normal renders at CSS resolution; light at CSS / 1.5 with shadows disabled. Previously a DPR=3 phone rendered at CSS / 3. Explicit user quality control remains available.
- Increased shadow normal/depth bias to address observed triangular self-shadow artifacts. Requires actual screenshot review before acceptance.
- Added original generated PCM wind/leaf noise (no recordings), separate music/effects/master gain controls in journal, retained click-to-start sound. No listening-quality acceptance is claimed from automated tests.
- Clear tap destination on tab visibility changes to prevent unexpected resumed walking.

Validation before push: npm ci PASS; syntax PASS; 12 tests PASS including real NullEngine collision, joint parenting and moved eye vertices, and bounded audio volume. First local Chromium SwiftShader smoke passed desktop, mobile emulation, quest/save and Arabic chat before final audio/shadow changes; exact final candidate must pass again. Final local audio-control/desktop/mobile smoke PASS, no browser exceptions; sampled software medians 6 FPS desktop / 20 FPS touch emulation (not owner device, not a controlled speedup claim). Follow-up shadow-bias raster inspection reduced facade acne but residual roof/edge artifacts remain. Added generated build identity from actual CI checkout, visible in journal and snapshot; final exact-SHA CI remains pending. Cloud interactive browser reports WebGL not supported. Target PC and physical phone remain NOT RUN.

**NOT COMPLETE:** Batch 1A is a stabilization subset of owner batch 1. Production GLB faces/clothing/rigs, original sampled musical score, cinematic pony/cart arrival, daily schedules, environment art overhaul, birthday chapter and 30 FPS device acceptance remain open. No new primitive characters or marketing images count as these deliverables.

## Historical evidence (superseded where stated above)

# Current browser prototype state

Date: 2026-10-28 (Asia/Beirut).

## Authority and scope

The owner explicitly requested an online engine/browser route after the UE4 attempt, and asked to preserve recognizable characters and the original story direction. The canonical UE4 repository and Governor remain unavailable in this session. This is a separate proof of concept, not an official PES Runtime session or a claim to advance canonical gates. No canonical branch or unrelated GitHub repository was changed.

## M0 preparation actually performed

- Inspected the attached source-rules, story/timeline and visual-atlas introductions from their actual PDFs.
- Confirmed birthday preparations are an opening safe-window context; labeled the apple errand as ORIGINAL-GAME.
- Consulted official Babylon npm documentation, engine specifications and Playground documentation.
- Chose a self-contained Babylon browser implementation, with explicit static collision volumes and render-independent quest state.
- Selected acceptance checks: complete quest order; collect only nearby apples; reject duplicates; save round trip and corrupt-save recovery; native ground/house/boundary collisions; actual browser render and controls when available.
- Rollback: preserve source Git history; do not modify the canonical UE4 project. Reset only the browser-local demo save via an explicitly confirmed in-game action.

## Implemented

Third-person 3D world, keyboard/touch controls, three NPCs, original Arabic dialogue choices, original errand, collectible apples, journal, local save/load, optional synthesized birds, low-quality toggle, camera obstruction attempt, static geometry batching and a read-only QA surface.

## Evidence

- `npm run check`: PASS (JavaScript syntax).
- `npm test`: PASS, 6 tests: complete quest gates; save recovery; interaction range/visited deduplication; dialogue coverage; actual Babylon NullEngine scene and native house/ground/boundary collision checks; local script/style integrity.
- Native engine scene: 195 meshes including invisible collision geometry, 264686 triangles, 22 merged static batches, 26 explicit obstacle/boundary colliders, 4 characters including player.
- Browser rasterization attempt: BLOCKED. The provided cloud browser returned `WebGL not supported` when constructing the real engine. The error is visible in the UI; the game does not substitute a mock image.
- Browser movement/dialogue/touch/save-reload end-to-end: NOT RUN because rasterization is blocked.
- Performance on the owner's target device: NOT RUN. Triangle/batch counts are not an FPS measurement.
- Visual acceptance and actor/film resemblance: NOT ACCEPTED.

## Missing

Full trilogy, film scene sequences, voice acting, actor voices, facial lip sync, house interiors, larger maps, combat, production animation assets, adaptive pathfinding, cloud saves and multiplayer. No guarantee of full-game completion is made by this prototype.

## Storage and next step

The first private Sites deployment succeeded: https://shire-journey-a-morning.mavos-8036.chatgpt.site . Deployment ID: `appgdep_6ae126c912408191a74140bd950c5297`. The matching source SHA is the Git HEAD supplied to publication, not a SHA invented in this document. Record deployment receipts outside the candidate to avoid circular SHA mutation. The owner supplied the dedicated repository `4youbabee-tech/shire-journey-3d`; it initially contained only an 18-byte README. These sources are prepared for a single cohesive commit preserving that initial history. The game modules match deployed Site source `7b6d9f84e180d251be5b93c7b31c20830e67f682`. The engine is restored from a pinned npm dependency with SHA256 verification. No credentials were requested or entered.

Next acceptance step: the owner opens the deployed URL in a WebGL-capable browser and provides actual render/interaction evidence. Fix any observed runtime defects before expanding the story.

## Browser QA / character-motion candidate (2026-10-28)

- Added articulated hobbit leg pivots and a simple procedural walk cycle, with idle settling. Bilbo and Sam now have distinct hair colors and handheld silhouette props (book and garden trowel). These are original stylized models, not validated screen-accurate likenesses.
- Added a Chromium WebGL CI runner that attempts end-to-end desktop walking, dialogue, apple collection, save/reload, and simulated mobile joystick, touch camera and tap interaction. The runner records WebM videos, PNG captures, browser errors and sampled FPS to an Actions artifact.
- At candidate authoring time: browser visual QA, mobile interaction, hardware FPS and visual acceptance are NOT RUN; the new workflow must report a successful run before any browser-playability claims are upgraded. CI SwiftShader is not the specified target device.
- Local `npm ci`: BLOCKED by this execution container's inability to resolve registry.npmjs.org. Previous GitHub Actions `40596189871` passed at base commit `324e35f`; exact candidate HEAD must be re-tested by GitHub Actions.
- The private ChatGPT Sites deployment has not been updated; GitHub and Sites deployments are separate. No Unreal source was changed.

- Candidate check run `40597790986`: **FAIL** in syntax check because an extra closing brace was inserted into the eye-loop of `dist/world.mjs` (line 65); browser steps NOT RUN. The brace was removed in the follow-up corrective candidate. This was a source-authoring defect, not a WebGL/engine failure. Await new exact-HEAD CI evidence.

- Run `40597990755`: source `npm ci`, syntax and unit tests PASS; **real Chromium WebGL rendered** opening and walking and uploaded `shire-browser-evidence` artifact (PNG, WebM, report). The end-to-end script FAILED reaching its first waypoint: movement advanced only ~16.4 world units during ~38 wall-clock seconds at 5–7 software-rendered FPS. Root cause: frame dt was capped at 40ms, causing slow-motion at low render rates. Corrective candidate raises the elapsed-time cap to 200ms with a unit regression test; not yet validated at this new exact HEAD.
- Visual inspection of actual Chromium screenshot found a strong overexposure and hill geometry overlapping house door fronts; source candidate reduces lighting and repositions mound/roof behind round facades. Screenshot/video of this new candidate still NOT RUN. Do not mistake the run's failed walkthrough for a complete quest or acceptable performance.

## Arabic conversational and opening-story candidate (2026-10-28)

- Follow-up browser attempt `40598395983` at `3f28fc9`: source tests PASS and real WebGL screenshot produced, with round doors now visible. Browser walk-through FAIL due to intermittent low-FPS software rendering and per-event keyboard sampling; no proof of quest finish, touch or hardware FPS. A clear test-only `?qa=1` reposition hook now allows verifying actual dialogue/quest/save via DOM interaction while separately recording real WASD and touch-joystick motion. Such QA relocation is explicitly NOT a full navigation playthrough.
- Added Frodo to the small village, original blue waistcoat and satchel, and separate physical proportions for Bilbo, Sam and Frodo; stylized identities remain unapproved visually until new WebGL evidence.
- Added an Arabic typed conversation interface with character-specific original responses, topic memory and spoiler-aware F1-01 story window. This is OFFLINE-CONTEXTUAL, not generative remote AI. A true LLM agent requires a secure server endpoint, model billing, monitoring and story guardrails; none is deployed. The stage-driven apple activity remains ORIGINAL-GAME and does not advance the Ring transfer or main canon plot.
- New unit tests for conversation provenance, topics, save-memory bounds and non-spoiler chapter gating; browser video/desktop/mobile testing at this exact candidate SHA still NOT RUN before CI.

## Evidence observed after Arabic conversation candidate

- GitHub Actions PR run `40599606372`: PASS. Evidence artifact `12778800072` contains actual WebGL desktop (1280×720) and emulated touch-mobile (390×844) screenshots/WebM recordings, dialogue, quest-completion and reload checks. Original apple quest completed by scripted UI interactions with **QA-only relocation between encounters**, not full-map physical walking. Real WASD/joystick smoke motion, camera drag and chat input separately tested.
- PR merge-ref checkout was `1a8f9bcec05d8e851f6d5722d1860e02855a0143`, whereas feature branch head was `69ca8a0990934d5a7e63edc5c465f0bfd2c00bda`. Since the report used `GITHUB_SHA`, this evidence is valid for a synthetic PR merge candidate, NOT an exact-HEAD claim for the feature commit. Follow-up changes pin checkout to the PR head SHA and assert the actual git checkout equals expected SHA. Await a new run before claiming exact-HEAD validation.
- CI SwiftShader rendering was **3 FPS desktop median** and **7 FPS emulated mobile median**; those are software renderer numbers, not hardware scores. Native i7/8GB/2GB/720p 30 FPS and physical touch testing remain NOT RUN. Visual screenshot inspected: pleasant recognizable village silhouette, but stylized geometric characters lack AAA/film resemblance; overall visual acceptance remains NOT ACCEPTED.

## Visual refinement candidate and strict evidence (2026-10-28)

- Source at `8e39c0d` passed exact-checkout GitHub Actions run `40600040728`: all npm/Node tests and Chromium WebGL browser QA PASS, artifacts `12777793020` (desktop/mobile WebM, screenshots, report). `report.commit` matches PR head SHA. Arabic chat, save/reload, 5 NPCs, quest state and touch events observed. Full quest uses QA-only relocation between encounters, not continuous walking acceptance. Software SwiftShader median 2 FPS desktop, 6 FPS mobile emulation; target i7+8GB+2GB 720p/30 FPS NOT RUN, visual production acceptance NOT GIVEN.
- Subsequent single art candidate adds Bilbo's distinct long burgundy coat, linen lapels and silvery temple curls matching the reference visual-atlas costume silhouette without importing film models. Visible titles/portrait initial are Arabic. The QA relocation helper is limited to localhost with explicit `?qa=1`; production website has no teleport hook. This art patch is SOURCE_AVAILABLE until a new screenshot and CI run prove it.

## 0.2.1 original illustrated portraits and speech candidate (2026-10-28)

- Previous exact-head browser QA at `8413ac7f081d7979215ce194c06c1284bdd5d7c0` completed **PASS** in run `40600431467`; source syntax/logic and Chromium WebGL browser simulation passed, with the established QA-only relocation limitation. This does NOT establish physical device FPS or full-route walking.
- New candidate: four original embedded SVG portraits in Arabic NPC conversation UI, one optional click-to-speak control using system SpeechSynthesis API (Arabic voice only where OS/browser supports it), corresponding SVG integrity test, and source version 0.2.1. No actor voice or generative LLM is claimed, and no browser audio-playback acceptance is claimed until manually heard.
- The owner-provided private ChatGPT Sites URL has NOT been redeployed. The existing GitHub feature PR remains separate from the canonical browser `main` until this new candidate's exact-HEAD CI and visuals are assessed. 30 FPS on the specified physical PC remains NOT RUN.

## Ambient life soundscape and idle animation candidate (2026-10-28)
- Added original synthesized low-volume bell/melody accents, varied birds and leaf-like sounds behind a user-tapped sound button. This is not film music and not actor dialogue; depends on browser Web Audio support and manual activation. No external audio files or runtime network needed.
- NPC idle head turning, hand gestures, and light swaying differ by character, with stronger gestures while speaking; no route-based NPC AI or real character voice acting is claimed.
- Static source candidate at authoring; new exact-SHA CI/browser acceptance NOT RUN yet. Actual phone audio, UX and target hardware FPS require device evidence. Old release 0.2.1 remains published until separately merged/deployed.

- Living Shire candidate: 3 non-dialogue background farmers/gardeners now pace fixed safe plots, 11 small upper canopies sway in an original wind loop, no navmesh or quest impact. CI/head validation and on-device performance NOT RUN at authoring. Original five interactive characters unchanged.

