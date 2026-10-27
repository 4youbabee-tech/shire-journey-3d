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
