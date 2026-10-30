# 0.9.2 production candidate — visible Ring and Hobbit-hole collision

Base main/Pages: `3f54c8d4b889ce8537de0595d5f628f7a2db9bfd` (0.9.1). Draft candidate; not merged or published.

- A real Babylon gold torus attaches to the imported right ring-finger bone on Bilbo and Frodo. Existing `ringPassed` remains the only owner authority: Bilbo before birthday departure; Frodo after the canonical party outcome. No duplicate story state or save-schema change.
- Every visible grass mound has front/interior, left, right and rear collision volumes. Bag End's front approach remains open. NullEngine regressions cover side/rear blocking and door access.
- Browser QA checks actual WebGL Ring meshes and ownership before/after the birthday outcome.

Exact-head source, desktop/touch browser, screenshots and CI are pending. Physical target-PC/phone 30 FPS remains NOT RUN. The full Ring investigation, packing, Shire-road pursuit and Bree remain unimplemented.

# Active production map — 0.9.1 opening region

0.9.1 adds earlier measured shadow relief and reload-safe manual quality; 54 local source tests PASS and exact-head browser/public checks gate release. The 0.9 art/story payload is unchanged.

Application cohort `dda4170` passed exact-head Actions 41110116242 (53 source tests; desktop/touch gameplay; continuous opening; natural party). Full evidence and limitations are in [CURRENT_PROJECT_STATE.md](CURRENT_PROJECT_STATE.md). This table supersedes the historical checkpoints below.

| Owner priority | Implemented and verified in this cohort | Next acceptance / scope boundary |
|---|---|---|
| Frodo, Gandalf, Bilbo, Sam | Four distinct licensed natural-proportion GLBs; 65-bone rigs, 12 clips, textured facial anatomy, blink/gaze/expression, authored costume and bare feet | Physical-device appearance and performance review; background actors reuse Sam's base |
| Opening under tree and arriving pony/cart | Real 27-second world scene, reading/rise/run/greeting/board/ride, harness/reins, distance-driven wheels, restored story positions and control | Continuous WebM reviewed; source-inspired original staging, not a shot-identical film reproduction |
| Life in the existing Shire | Three staggered gardeners, five activity states, four hand-following tools, 16 moving imported trees, bounded shared foliage instances, birds/clouds | Richer social encounters, additional residents and schedules are subsequent content |
| Sound and atmosphere | Original sampled 51-second score, four recorded footsteps, varied recorded forest excerpts, wind/cart fallback, gesture start and separate gains | Physical speaker/headphone review; recorded horse/cart/door/tool library not represented as complete |
| Image and environment | Sage terrain bitmap, textured summer nature and roadside planting; face-visible desktop/phone conversation cameras | Existing houses/roads retain their procedural construction; architectural/detail expansion remains queued |
| Story and play | Gandalf-first gate, optional original apple activity, Bag End interior, Arabic rule-based dialogue/memory, saved birthday and departure/Ring outcomes | Birthday remains a compact original vignette; F1-02 investigation onward is not implemented |
| Functional / publication | Source, real WebGL desktop/touch, save/collision/quest, full opening, both birthday paths PASS | Merge and Pages SHA checked by main's public smoke; no physical target-PC/phone FPS claim |

## Historical acceptance checkpoints

The records below are chronological evidence, not a second current queue. Earlier HOLD labels, pending tests and rejected assets retain their original meaning and are superseded by the active table where explicitly resolved.

# 0.9.0 production candidate — authored cast and opening-region polish

Prior integrated 4f46eee6bd41f81248114e0927db685a37c79d03 Actions 41099937846 PASS: source, desktop/touch gameplay and continuous opening; four packaged footstep buffers decoded. Artifact 12997642846 digest b8803c949096f1fe3beb92218aa06c57c77f3f1133c947e06965b1ee13d61d76. Reviewed its real JPEGs and chronological contact sheet. No physical-device performance claim: SwiftShader medians were 1 FPS desktop / 3 FPS touch emulation at adaptive resolution.

This cohort repairs the actual GLB wool albedos to standard sRGB. The attempted runtime gamma flag did not visibly fix the result; it is removed. scripts/repair-linear-wool.py admits only the four reviewed legacy payload hashes and preserves every non-wool buffer view byte-for-byte. Corrected asset receipts retain original input hashes and image means; the Blender authoring script now encodes future wool tiles correctly. Gandalf's woven wool mean changes from about 45/51/51 to 116/123/123 bytes, while skin/eyes/geometry/rig/animation data stay unchanged.

Other integrated work: original 512px sage meadow texture, continuous Frodo heading while approaching/boarding, leather harness/reins and cart footboard, a close conversation inspection of Frodo, and four original concave gardening tools following actual imported palm joints. Tool alignment is verified under parent/hand rotation; the LH look-direction convention required a corrected forward axis, caught by the native test. NPC tools are stowed during conversation/celebration. A licensed TinyWorlds forest clip now supplies varied excerpts with gentle pan/fades over the procedural wind; the old chirps remain only a decode fallback. See audio credits and sealed receipts for the explicit mirror chain.

Shipped GLB-only boot now creates actor roots/joints directly instead of allocating and discarding the legacy procedural body meshes. Native validation with deferred nature: 210 to 84 initial meshes and 600560 to 349780 initial triangles; all actor positions, scales, joint locations, worker schedules and static collider counts match. These are startup allocation counts in NullEngine, not GPU/FPS measurements.

Local source and asset validation: 53 tests PASS, with syntax checks. Exact-head CI/raster/recording verification remains the release gate for this source cohort. Save schema, canonical NPC locations and F1-01 outcomes remain unchanged. Later film windows and physical device acceptance remain separately tracked in the roadmap; do not interpret a version tag or technical test as a finished-game declaration.

# Active production polish — following 412bce3 verification

412bce35618266e46b4b95c9666aa57f476c0d16 exact-head Actions 41041444175 PASS: 49 source tests, native actor collision, desktop/touch gameplay, projected face visibility and continuous opening. Downloaded artifact 12970532462 (35,429,370 bytes); locally verified SHA256 c0979223983069d29ffcef74ed8a42c4ae22d7011f49411b2f4ffa9d328a862a. Reviewed real desktop/phone JPEGs and full WebM contact sheet. Software-only medians 2 FPS desktop / 5 FPS touch emulation; render resolution and adaptive state differ, so no hardware FPS or comparative speedup claim.

Raster findings: a transient notice covers Sam's eyes, Gandalf's mouth/beard approaches the dialogue panel, custom woven textures appear too dark, and opening still extraction incorrectly assumes browser wall-clock time equals encoded WebM time. Fixes now hide notices during dialogue, frame Gandalf higher with a larger visibility margin, interpret only the authored linear wool albedos as linear, and produce an explicitly chronological 16-frame contact sheet from the actual video rather than falsely naming frames by wall-clock stage. Preserve two seconds of actual handoff in the recording.

Add up to 220 shared grass/flower instances along existing road shoulders, with precomputed static blocker bounds and actor clearance; canonical actors, roads, colliders and story anchors stay authoritative. Add four Kenney CC0 footstep samples, converted to mono MP3 (10,831 bytes total), embedded in the same verified offline build pipeline. See FOOTSTEP_ASSET_PROVENANCE.md for explicit mirror acquisition, original/derivative hashes and licence. Source/runtime syntax and 50 Node tests PASS locally, including gesture-gated decode, decoded-buffer reuse and different adjacent recordings. New exact-head WebGL and visual review are required before release.

# Active work — natural cast integration, 2026-10-30

The 605c86a exact-head technical run passed, but the chibi art was rejected. Four licensed natural-proportion actors now replace it, with authored weighted costume, facial controls and floor/boarding clips. See IMPORTED_CHARACTER_ASSETS.md and the sealed manifest for exact source/license/asset provenance. Runtime integration includes semantic gaze/blink, stable shader capacity, continuous seated boarding, physical-distance wheel rotation, slower analog walking and close conversation framing. 48 source/NullEngine tests PASS. These do not constitute raster art approval or physical-device performance. Current branch remains a production draft while actual WebGL results are inspected. Canonical main/Pages remains d2c5d759 until the integrated candidate passes its gates.

Production map: cast source build and local integrity complete → exact-head WebGL body/face/clip/costume inspection → fix visible faults → village/audio/story-window integration → target-device acceptance → merge and Pages identity verification. F1-01 causal gates remain enforced; later chapters are not substituted for the agreed first-region quality. Source canon: supplied Story and Timeline Bible pp1–10 and Tolkien Concerning Hobbits pp25–27; film opening order remains the supplied screenplay sequence documented below. No copied protected dialogue/music.

# Resumed 0.9 corrective cohort — 2026-10-30

| Item | Evidence / state |
|---|---|
| Recovery of existing unpublished work | PR #13 parent 6638beb; npm ci PASS; prior exact-head run 40982495511 / artifact 12945097923 hash verified |
| Interrupted crossfades / one-shot distance resume | Real Babylon 9.32.1 AnimationGroup regression tests PASS; new browser evidence pending |
| Distinct traveller head/hair silhouettes | Four source-authored morphs, real GLB vertex/eye bounds test PASS; final art NOT ACCEPTED |
| Hair palettes / blinking compatibility | Four existing atlases recolored, original blink deltas rescaled to avoid crossing eyelids; real GLB open/half/closed tests added; requires actual WebGL review |
| Background Socialize / gaze easing | Existing Interact clip selected; elapsed-time smoothing; not a new AI authority |
| Source verification | npm run check and 42/42 Node tests required after the eyelid deformation correction |
| New exact-head recording | Required before merge; PENDING at commit authoring |
| Performance / release | No physical-device results or new public release claimed; permanent Pages remains 0.8.0 |

# 0.9.0-dev release gate — HOLD / UNPUBLISHED

| Area | Implemented in candidate | Unmet acceptance |
|---|---|---|
| Characters | Eight skinned roles, blink morph, weighted transitions, gaze, distinct heights | Shared faces/hair; costumes/skin/cloth not accepted |
| Opening | 27s real scene, reading/rise/run/greeting/ride, real rigged horse | Seat/robe intersection and boarding polish; not cinematic acceptance |
| Sound | Original 51s sampled harp/flute, PCM foley, controls | Audible device review and varied environmental recordings absent |
| Life/nature | Five staggered plot-bound work states, CC0 textured instanced trees/understory | No rich social AI, hand/tool contacts or full schedules |
| Homes | Imported player now visible indoors; furnished Bag End, restored lighting | Other interiors and final architectural quality absent |
| Story | Existing F1-01 party/aftermath gates, original Arabic rules-based conversations | F1-02 investigation, F1-03 escape, F1-04 Bree NOT IMPLEMENTED |
| Verification | Source tests, real WebGL desktop/touch, continuous opening capture | Full-route physical-device navigation, 30 FPS hardware and listening review NOT RUN |
| Publication | Draft source checkpoint only | MUST NOT MERGE/PUBLISH as complete game |

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



# 0.8.0 final review correction

Cinematic/party early-return branches now update imported clip selection. Birthday WebGL QA must observe >=7 playing Cheer groups. Gandalf inspection camera uses current facing direction without moving any world anchor. Exact final SHA validation still required; Bree F1-02/F1-03/F1-04 sequence confirmed from supplied Story Bible, runtime chapters NOT IMPLEMENTED.

# 0.8.0 asset recovery — 2026-10-30

| Deliverable | Evidence / state |
|---|---|
| Complete licensed character source | KayKit CC0 raw Git blob hashes verified against official upstream; no actor likeness |
| Reproducible safe asset transfer | Chunked lossless gzip/base64 in repository; npm ci reconstructs locally and validates sizes/SHA256/GLB bounds |
| Visible skinned actors | Eight existing roles rendered locally, nine authored clips retained, camera/quest roots preserved |
| Gandalf identity | Head-attached continuous beard, hips-attached folded long robe, hat and neutral atlas; real close-up reviewed |
| Source tests | 30 PASS locally including deliberate truncated/corrupt GLBs rejected |
| Browser interactions | Local desktop/touch QA PASS; actual movement smoke plus QA relocation for quest steps; PNG/WebM generated |
| Performance | Local SwiftShader medians 3/8 FPS; target PC and physical phone NOT RUN |
| Exact-head CI / publish | Required next, PENDING at authoring; existing main remains 0.7.0 until successful merge/deploy |
| Final art | NOT ACCEPTED: shared hobbit faces/body, no blink/facial morph clips, model proportions still toy-like |
| Requested opening/tree/horse overhaul | NOT IMPLEMENTED by this repair; previous procedural arrival is preserved |



## Exact-head validation correction — e709002

The first candidate Actions run completed `npm ci` and all syntax checks. 55/56 source tests passed, including the new One Ring rig/ownership test and the new mound side/rear collision + Bag End door-access test. The sole failure was an older natural-world assertion counting all Babylon scene meshes as draw submissions; invisible collision hulls were included in that count. The correction keeps the original strict <240 visible render-mesh limit and adds a separate <100 total collision-volume bound. This is a measurement correction, not removal or relaxation of the collision requirement. Exact-head Actions must rerun before acceptance.
