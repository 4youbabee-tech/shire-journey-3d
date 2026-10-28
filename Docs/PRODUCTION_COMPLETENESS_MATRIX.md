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

