# 0.9.2 production candidate — visible Ring and Hobbit-hole collision

Base main/Pages: `3f54c8d4b889ce8537de0595d5f628f7a2db9bfd` (0.9.1). Draft candidate; not merged or published.

- A real Babylon gold torus attaches to the imported right ring-finger bone on Bilbo and Frodo. Existing `ringPassed` remains the only owner authority: Bilbo before birthday departure; Frodo after the canonical party outcome. No duplicate story state or save-schema change.
- Every visible grass mound has front/interior, left, right and rear collision volumes. Bag End's front approach remains open. NullEngine regressions cover side/rear blocking and door access.
- Browser QA checks actual WebGL Ring meshes and ownership before/after the birthday outcome.

Exact-head source, desktop/touch browser, screenshots and CI are pending. Physical target-PC/phone 30 FPS remains NOT RUN. The full Ring investigation, packing, Shire-road pursuit and Bree remain unimplemented.

# 0.9.1 measured quality response and saved device preference

0.9.0 was merged through PR13 as `be008c5f833cdf1e6d6d10ff32bdebd290375862`, after exact-head Actions 41111878012 PASS. Its corrected original opening/party WebMs now visibly include return to the game interface; artifact 13004596236 ZIP SHA256 `5d473d2e81a3f20f1f824abda7d5396542f33d6a8a930cb1a56036fe98eac3f5`, downloaded and verified. The permanent public game remains the same Pages URL.

Root cause: severe sustained slowdown left the expensive shadow pass active until resolution reached scale 2.25, sacrificing face/texture clarity through several cooldown windows first. Auto now disables shadows at the first qualified median below 20 FPS; moderate 20–26 FPS slowdown still takes gradual resolution steps. The eight-second startup grace, six-second/ten-sample window, hysteresis, recovery and manual override remain. No decision is based on a device-name guess. Fresh sessions retain high-first defaults; an explicit auto/high/light choice survives reload in a separate small preference key without touching story saves. The auto button no longer falsely labels a degraded mode as high quality.

54 source tests PASS locally, including sustained severe/moderate cases, brief hitch rejection, manual control and recovery. Browser QA adds real touch selection of high/light, a real navigation/reload, restored light-mode render/shadow assertions and unchanged story progress. Automatic screenshots and FPS sampling occur before manual changes. Exact-head browser playback and public identity are required gates; this is a quality-policy fix, not a claimed measured target-device speedup.

# Active 0.9 verification — 2026-10-30

Tested application commit: `dda4170ec7f7e8ccc57b1a34564649b64b05dfd4`. Exact-head [Actions 41110116242](https://github.com/4youbabee-tech/shire-journey-3d/actions/runs/41110116242) and all three browser scenarios PASS: desktop/touch gameplay, continuous opening, independent natural birthday playback. Source: 53/53 Node tests and syntax checks PASS. The independent celebration verifies seven live cheering rigs, no early Ring outcome, natural completion, and Bilbo's disabled actor/collider. The gameplay scenario separately exercises the actual Skip button and saved canonical outcomes.

Evidence artifact `13002803152`: 50,930,532 bytes; ZIP SHA256 `da1b337209a6a2f35665c6680686b525bf3e8b2e57c755c94a3ea5856a8468ad`. Downloaded and hash-verified; real JPEGs, phone dialogue, 3D wizard inspection, opening/party chronological contact sheets and WebMs reviewed. Contact sheets sample the complete recordings, including loading/welcome; their frames must not be mislabeled by assuming wall-clock time equals encoded video time. No generated promotional picture substitutes for game evidence.

Software-only median: desktop 1 FPS, touch emulation 2 FPS. This runner uses Chromium/SwiftShader, not a physical GPU/phone; no 30 FPS hardware acceptance or comparative speedup is asserted. Localhost QA uses fixture player repositioning between encounters, not an accepted full-route walking test. It also exercises real WASD/touch movement. The main-push workflow additionally opens the naked permanent public URL, requires the exact deployed merge SHA, checks that public repositioning is unavailable, watches the opening, talks to Gandalf, walks with actual keys, and opens the map. Its result is the publication identity gate, separate from this candidate receipt.

Permanent game: https://4youbabee-tech.github.io/shire-journey-3d/ . The accepted application cohort is the first Shire region; later film windows and physical-device acceptance remain in the production queue. This receipt does not declare the entire requested game finished.

## Historical production log

All sections below retain their original checkpoint state. Superseded asset names, pending tests, old public versions and rejected art describe those checkpoints only; the active receipt above and current sealed manifests take precedence.

# 34ebba0 real-raster review and celebration test timing

Actions 41107576136 reached the birthday celebration after loading the new cast, recording a clear Frodo conversation, decoding audio, exercising saving/interior/quests and verifying seven cheering rigs. Real screenshots confirm the corrected grey robe and sage ground. The test then timed out clicking party-skip: a blocking software-GPU screenshot consumed the remaining 14-second scene, so the button disappeared after natural completion. This is a test sequencing failure, not an accepted whole-run PASS.

Fix: exercise Skip immediately after live cheering is verified, before any blocking party screenshot. Add an independent natural-playback test that resumes a valid pending-party save created by the actual rules, watches the full scene without Skip, verifies canon outcomes are not committed early, and confirms Bilbo's actor/collider disappear. Its real WebM and chronological contact sheet provide the celebration visual evidence. Both paths remain required; no skip assertion is silently bypassed when the timer ends.

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

# Actual raster review and fixes — 2026-10-30

ac681b9 Actions 41039717209: source tests and desktop/touch gameplay PASS; full opening test failed after synchronous PNG+JPEG screenshots delayed real-time playback past the asserted Run window. Retrieved real JPEG bytes from job 124009245355 and inspected them directly despite the unavailable local environment. No visual acceptance: the first Gandalf dialogue captured sky before camera retarget; Bilbo/Sam QA stood at the actor origin and the camera entered the head; dialogue covered the face. Gandalf's unobstructed in-world inspection does show the new anatomical face and complete grey costume. These defects are tracked as integration faults, not accepted screenshots.

Fix cohort: native invisible actor body colliders follow the existing narrative roots; player collision uses Babylon's existing coordinator, and removed actors disable their volumes. Camera rays ignore these invisible volumes. QA walks up beside Bilbo/Sam instead of placing the player inside them, without weakening navigation assertions. Conversation camera has a nonzero stand-off fallback, targets the actual head joint and frames the face above the parchment. Dialogue height is bounded to 55vh desktop/58dvh phone, and actual projected face visibility is asserted in desktop and phone gameplay. The original opening test again runs continuously; after the WebM closes, explicit FFmpeg extracts real stage frames so screenshot overhead cannot advance the story. No simulation seeking, no game pause, no generated imagery. Artifacts retain 90 days. Native collision regression and all existing checks must PASS on this exact head before review.

Local execution remains unavailable; no new local test or physical-device FPS claim. Previous f317e6a complete source/browser/unskipped opening run is recorded below. Keep the integrated candidate draft until actual new camera/face/pose imagery is inspected.

# f317e6a exact-head runtime verification — 2026-10-30

Actions 41038771459 PASS: clean install, all 48 source tests, desktop and emulated touch interaction/save/party, and full unskipped 27-second opening. No browser errors. Evidence artifact 12968938578, 36,319,505 bytes, GitHub SHA256 digest 19420d4ce1075c2cb68645c1727c1585998b064110ec5366e0e4a9de9f787925. The artifact has not been locally downloaded/hash-verified because the execution environment became unavailable after the source commit. Software SwiftShader median 1 FPS desktop / 2 FPS touch emulation; these are NOT target-device measurements.

Continue visual review through source-controlled real JPEG previews in Actions logs and original PNG/WebM artifacts. Full opening now saves its four real PNG stills (previous stage names only identified report entries). No external messaging or upload service. Authoring review identified mismatched peasant tunic patches against Gandalf's grey robe; share the actual woven robe material for those garment primitives. Cinematic mutual gaze now uses the other actor's real head joint height, rather than a fixed root offset. Keep production draft; do not merge based on technical PASS alone.

# Active work — natural cast integration, 2026-10-30

The 605c86a exact-head technical run passed, but the chibi art was rejected. Four licensed natural-proportion actors now replace it, with authored weighted costume, facial controls and floor/boarding clips. See IMPORTED_CHARACTER_ASSETS.md and the sealed manifest for exact source/license/asset provenance. Runtime integration includes semantic gaze/blink, stable shader capacity, continuous seated boarding, physical-distance wheel rotation, slower analog walking and close conversation framing. 48 source/NullEngine tests PASS. These do not constitute raster art approval or physical-device performance. Current branch remains a production draft while actual WebGL results are inspected. Canonical main/Pages remains d2c5d759 until the integrated candidate passes its gates.

Production map: cast source build and local integrity complete → exact-head WebGL body/face/clip/costume inspection → fix visible faults → village/audio/story-window integration → target-device acceptance → merge and Pages identity verification. F1-01 causal gates remain enforced; later chapters are not substituted for the agreed first-region quality. Source canon: supplied Story and Timeline Bible pp1–10 and Tolkien Concerning Hobbits pp25–27; film opening order remains the supplied screenplay sequence documented below. No copied protected dialogue/music.

# 2026-10-30 — resumed 0.9 candidate: rig continuity and traveller identity

M0: canonical main d2c5d759a5b33d1a69677e22b38749f09f7508a4 / Pages 40977406475 PASS. Recovered existing draft PR #13 at 6638bebceb49b53e5765e2da75d3de6d859210a5 through the connected GitHub API; no new project or hosting. Restored source/asset chunks and verified exact Git blob hashes after transfer. Clean npm ci reconstructs all reviewed GLBs/audio/environment successfully. Prior exact-head browser run 40982495511 PASS; downloaded artifact 12945097923 and verified archive SHA256 a8615dd0516345532e3621bf325d3659e1cc3ec84d3e69dbe56d5da9c2bc91a1.

M1 diagnosis: inspected actual prior raster images. Gandalf inspection screenshot is almost entirely occluded by a tree despite a successful DOM/rig test. Source also drops the previous pose during an interrupted crossfade, resumes every distance-paused clip with forced looping (including one-shot Rise), and treats Socialize as Idle. Head gaze easing depends on render FPS. Hobbit roles still share the same long-haired head shape/color.

M2 implementation: weighted clip mixer retains all fading contributions until zero; distance pausing happens only on state changes, preserves looping and never revives a completed one-shot. Socialize selects existing Interact; gaze smoothing uses elapsed seconds. Automatic pointer-move picking was already disabled by createWorld; retain that configuration and the existing explicit tap-ground/camera collision rays. The duplicate boot assignment was removed on review; it provides no new performance gain. No claimed FPS gain without a measurement.

M3 art/QA: four authored, distinct corrective head morphs on the existing licensed traveller mesh; shorter irregular hair, smaller/narrower head profiles and dark Frodo / sandy Sam / greying Bilbo palettes. Existing skin weights, eyelid morphs, clips, collision and story anchors retained; no additional mesh/draw call. This is a corrective cartoon pass, not final character art, facial acting or actor likeness. QA now requires four live silhouette morphs and rejects a blocked Gandalf inspection view. Added three real Babylon AnimationGroup regressions plus a real GLB vertex/eye-shape test. Initial syntax and 41/41 Node tests PASS; follow-up adds full-blink deformation coverage and requires 42/42 tests. Smaller faces now scale their original blink deltas, preventing eye-vertex inversion at closure. Babylon AssetContainer clone behavior was also checked: independent manager/target objects per actor.

M4-M7: new exact-head Chromium desktop/touch and continuous opening results PENDING at authoring; inspect new PNG/WebM before accepting these changes. Public cloud browser opened permanent URL but reported WebGL not supported, so it cannot provide raster/performance acceptance. Prior exact-head CI 40982495511 measured SwiftShader medians 1/3 FPS (desktop/touch emulation); the earlier 3/7 values were local samples. Both are software-only. Real i7/8GB/2GB Windows 720p, physical phone >=30FPS, audio listening and final art approval NOT RUN. Retain draft until visual review; no new release claimed. Later F1-02/F1-03/F1-04, expanded interiors and complete cinematic art remain open. Rollback this cohesive follow-up commit on PR #13; save key/schema unchanged.

# 0.9.0-dev — UNPUBLISHED production work, 2026-10-30

Owner explicitly requires a complete integrated game and rejects defective/incomplete releases. This candidate MUST remain draft and unmerged; passing automation is not release authorization or final art/game acceptance. Permanent Pages remains on 0.8.0 main d2c5d759a5b33d1a69677e22b38749f09f7508a4. Fresh connector read confirms that HEAD; Pages 40977406475 and browser 40977406378 succeeded.

Implemented locally: actual eyelid morph closure and bounded gaze, time-based weighted clip transitions (removed conflicting frame-based default blending after a real seated-pose failure), floor/chair sitting and rise clips; source proportions varied by role. Full 27-second original in-engine reading/rise/run/cart greeting/ride sequence; imported CC0 skinned horse, vertical spoked wheels, corrected horse facing, lap book and authored staff. Original sampled 51-second harp/flute music through gesture-gated WebAudio; PCM foley and channel controls. Three staggered plot-bound workers now have Idle/Walk/Work/Rest/Socialize states; fixed schedule wrap teleport. CC0 textured maple trees and sparse instanced understory replace procedural crowns at all 16 original anchors. Shared deterministic surface textures; indoor ceiling ribs, windows and furnishing details. Fixed invisible indoor imported player and unsupported floating furniture; indoor sun state now restored on exit. Existing collision/save/story authority retained.

References: supplied Fellowship screenplay and Story Bible checked before the shot order. This is an original adaptation, not copied film dialogue/music or exact shot reconstruction. F1-01 birthday -> F1-02 Ring investigation/packing -> F1-03 Black Riders/Bucklebury -> F1-04 Bree remains mandatory. No direct Shire-to-Bree shortcut added. Only the existing opening story window is playable; the later chapters and most home interiors are NOT implemented.

Evidence: 37 Node tests and syntax checks required after npm ci. Previous local full desktop/touch WebGL passed with nature (SwiftShader median 2 / 7 FPS), but final fade/route/book corrections require the final rerun recorded below. Full real-timeline opening test now checks hip position, not only playing group names; 0.9 seated regression initially FAILED, fixed by removing competing default blending; subsequent continuous playback PASS with real WebM and decoded 51s score. Screenshot calls were removed from the continuous runner because slow software capture advanced time before images; gameplay runner still produces actual PNGs and WebMs. No physical Windows i7/2GB VRAM or real-phone measurements, audio listening review, skin/cloth art acceptance or complete navigation playthrough are claimed.

Release blockers: distinct convincing faces/hair/costumes remain open, seated robe/seat alignment and boarding transition need authoring, village social actions and tool/hand contacts remain limited, houses/paths still too simple, only Bag End interior exists, audio sample variety/listening review absent, real-device >=30FPS unverified, F1-02..F1-04/Bree content absent. Do not label this a complete game. Assets/licenses/receipts: QUALITY_CANDIDATE_ASSETS.md. Rollback: revert candidate; save key/schema unchanged.

## Final local verification for this draft

After clean npm ci: syntax PASS, 37/37 Node tests PASS. Final desktop 1280x720 and touch-emulated 390x844 Chromium WebGL QA PASS with zero page exceptions; walking, dialogue/chat, saved reload, furnished Bag End and birthday state gates exercised (quest steps use explicit QA relocation). Software medians desktop 3 FPS / touch 7 FPS; these are not owner hardware. Continuous opening playback PASS without skip/QA relocation; seated hip position checked, skinned horse Idle/Walk observed, 51s music decoded, control/dialogue handoff correct. Real local PNG/WebM files are in qa-090-gate; inspected indoor player visibility and outdoor foliage. Remaining issues listed above still block release. Exact-commit GitHub CI is pending when this commit is authored; do not publish on an automation pass alone.

# 0.8.0 final animation review — 2026-10-30

Review of the first recovery candidate found early returns for cinematic/party state skipped the imported actor state selector. Existing idle animations continued rendering, but Frodo did not select walk and party participants did not select Cheer. Corrected both branches without adding another character/world authority. Added real browser assertion for at least seven playing Cheer groups during birthday. Inspection camera now derives Gandalf's actual head facing direction and leaves actor/story positions untouched. Revalidate this final source cohort before merge; prior 1e546218 evidence does not cover these corrections. Roadmap requirement reconfirmed from supplied Story Bible: F1-02 Shadow of the Past precedes F1-03 Black Riders/Bucklebury, then F1-04 Bree/Weathertop. No Bree runtime delivered in 0.8.0.

# 0.8.0 recovery candidate — 2026-10-30

Canonical main inspected: 35a2780dbe09e9e0e1a215209d6206c9d60e89a1 (0.7.0); Pages 40946139312 and browser 40946139327 PASS. Resume the existing PR #12, not a new project. PR head 38d8172b28ca22c619d4f6539b08c092f07b6630 failed browser run 40960752539 with Invalid typed array length while importing traveller.glb. Both committed GLBs were only 786444 bytes, inconsistent with their declared >2MB lengths. Prior prose claiming local success does not establish remote asset integrity.

M0/M1 diagnosis and repair: downloaded official CC0 KayKit source at tree 672074b73ba276876a19e8816ecdc5241817ab47. Raw Rogue/Mage Git blob hashes independently match upstream c8827661105eef7b2bfbef3bc676d41a47625733 / c89f19f6e707f6e07e4632a08876bd6d0172b082. Removed weapons and retained nine animation clips. Authored continuous beard and folded robe meshes attached to Gandalf's existing head/hips joints; neutralized stray pink/cyan atlas colors. This is an approximate cartoon game cast, not film likeness or accepted final character art. Hobbit roles still share a face/body base; authored blinking, distinct expressive faces and nuanced seated conversation remain open.

M2/M3 source validation: self-contained character payloads are losslessly gzip/base64 chunked in scripts/character-data, assembled by npm ci / prepare-engine. No external runtime downloads. Every reconstructed asset must pass exact bytes, SHA256, GLB header/chunk and buffer-view bounds, skin-weight presence and required locomotion clips. Corruption/truncation regression tests added. Generated GLBs no longer pass through the connector's size-limited binary request. Rollback is revert PR #12; original version-1 save key remains compatible.

Local evidence after final robe/texture changes: npm syntax and 30 Node tests PASS; Chromium SwiftShader desktop 1280x720 and emulated touch 390x844 full existing QA PASS, no page exceptions. Tests cover actual keyboard/joystick smoke, touch camera, dialogue, Bag End, party and saved progress; quest progression uses explicit localhost QA relocation between encounters, not full-route navigation acceptance. Recorded actual WebM videos and screenshots. Software medians desktop 3 FPS / mobile emulation 8 FPS are NOT physical-device results. Local fixed-camera before/after uses main 0.7.0 game/index/build modules and identical world geometry. Added fixed-camera Gandalf inspection at his existing position without moving scene/story objects.

M4-M7 exact candidate GitHub CI, visual review and Pages verification: PENDING at commit authoring. Do not merge before exact-head browser QA PASS and screenshot review. Hardware i7/8GB/2GB/720p 30FPS, physical phone/audio and owner visual acceptance NOT RUN. This is owner batch 1 recovery, not completion of all five batches. Arrival pony/cart/environment remain the earlier procedural vignette; requested Frodo-under-tree film-sequence reconstruction has NOT been implemented in this batch.

# 0.8.0 imported skinned character candidate — 2026-10-29

Base 35a2780dbe09e9e0e1a215209d6206c9d60e89a1. Owner prioritizes a visibly playable stylized game over actor likeness. Two licensed KayKit CC0 assets now load through Babylon GLB containers and instantiate across eight roles. Original procedural render pieces are hidden, gameplay/collision roots retained. Idle/walk/run/interact/cheer clips selected from real skeletal animation. Source tests: 28 PASS locally; first full local Chromium desktop/mobile flow PASS (software WebGL only); final costume atlas orientation corrected after raster inspection and requires exact-SHA CI. No target-device FPS or final art acceptance claimed. Runtime assets and license recorded in Docs/IMPORTED_CHARACTER_ASSETS.md. Rollback: revert this single cohort; old save key preserved.

# P05 0.7.0 — owner-driven playable presentation fix (source candidate 2026-10-29)

Base exact main 5872b9fde795b1bdf961a7ca5b95be96d4602651. Owner's real phone screenshot showed an older stage2 apple mission, a primitive player silhouette and a Gandalf figure without immediate story interaction. The previous 0.6.0 exact-head CI passed but did not simulate this existing saved state. No accepted character art or hardware FPS claim is made.

Single cohesive candidate: original 12-second melody with bass/harmony (pastoral score, Web Audio only, no movie audio/copyrighted tune) plus varied birds, filtered leaf-wind bed and active sound settings. Meadow receives low-cost deterministic vertex-color mottling on one ground mesh, more natural foliage color balance and smaller flowers. Player cloak/pack and softened character sleeves/trousers reduce toy-like silhouette without purchasing or importing models; three existing workers remain animated; flying birds visibly flutter. Strict runtime mesh budget retained and source test added.

Narrative: opening cart leads into a genuine Gandalf dialogue after the cinematic. Previously saved apple-stage progress remains available, but welcome page now offers explicit fresh story restart. Sam offers a no-apples route to the Bilbo party; apple gathering is an optional original side errand. Persist `applesSkipped` in version-1 save schema, validate against corrupted saves, no forced save resets. Broader trilogy and film-level art are not claimed.

Acceptance: SOURCE CANDIDATE until latest exact-SHA Node/Chromium screenshots/audio API evidence, then review and merge. Real user-device audio listening, visual acceptance and GPU FPS NOT RUN. Single-commit rollback is safe, with existing save key preserved.

## Source gate finding — P04 art draw-call budget
Exact-candidate Action 40925340163 at 20e895c7704e7fe26271cb9d7c2954d8f65b128a: 21/22 Node tests PASSED, the scene-mesh budget regression rejected the candidate before browser render. Root cause was adding original extra face material groups for every ambient character, increasing rigid-merged draw calls despite batching. Corrected the source: hero-only rich facial details, shared existing face/eye materials for cheek and lip, keep worker base rigs light. The strict mesh-budget test remains unchanged. Re-run exact-HEAD Node and browser before merge.

# 0.6.0 P04 hero-art candidate
Based on source main dd4eb5bcb5013621e1a9ad1c5c518801af7b6fd5; latest published 0.5.0 WebGL/Pages PASSED. This cohesive candidate adds original Babylon hero facial/costume mesh details via the existing rig hierarchy, slimmer simplified faces and hair, eye irises, brow/lip expression, vest panels, Gandalf beard and subtle scene exposure. It retains rigid batching and quest/collisions/saves. Test exact-head unit and desktop/mobile Chromium visual evidence before acceptance. Full licensed/imported skinned glTF rig with deforming animations is distinct further work and is NOT ACCEPTED by this pass.

## Exact-SHA visual diagnosis and one cohesive correction
PR9 source test c35303064004057fd6dd6ea39951b46aadc360c0, Actions 40878519654: all Node + real desktop/touch Chromium PASS; render screenshot desktop-birthday-party.png showed a large green foreground roof mound occluding the celebrations and too few active participants in the shot. Root cause: camera placed at x11,z12 within the Bag End hillside volume. Updated initial party camera to x4,z34 looking toward tree and seven existing NPCs, no additional drawn character geometry, plus screenshot/participant assertion. New candidate requires exact SHA WebGL before merge. Do not confuse QA SwiftShader median 2 FPS with physical phone capability.

# 0.5.0 P03 — Shire birthday narrative candidate

Base main a4aceaff770316d56e6cce8fe5f82bff45ce4a28, 0.4.0 live Pages run 40876613784 PASS and Chromium 40876613773 PASS. Player-visible source candidate: mandatory original Gandalf greeting before meeting Bilbo, then retained Sam/apple preparation, a fixed-location birthday party trigger under the celebration tree, 14-second skippable original firework scene, character gestures and Bilbo departure/Ring handoff. Canon source: 01 Story Timeline F1-01 and 07 Mission Matrix. Skip and watch have the same postconditions; a saved in-progress party resumes on next Start. New unit/browser regression and desktop firework screenshot must pass at the exact candidate SHA. No film dialogue, soundtrack or actor likenesses copied.

Next tasks remain character art, richer crowd life and F1-02/F1-03/Bree; no claims of those until production evidence. Existing mission saves load without reset, older stage5 progress can start the party. Rollback revert the single candidate commit; old save key remains unchanged.

## Visual adjustment following exact-SHA browser review
Run 40874619398 at 77562d2e30aecac321caeb5cfe8d518fde178e5c: Node and desktop/touch Chromium PASS; actual screenshot of Bag End revealed overlarge empty foreground. Moved furniture closer, added warm household props and candles, updated diary/hearth focus distances and added actual mobile interior screenshot test. Requires exact-HEAD rerun for this corrective commit.

# 0.4.0 Mobile phone presentation and Bag End entrance (source candidate)

Source base exact main bf57bb315d0bc5679cb7503309d87990b057c554, with prior Pages run 40774862501 PASS and Chromium 40774865147 PASS. Candidate integrates high-first adaptive render, music started from the actual Start tap (WebAudio gesture policy), safer mobile HUD and fully column-stacked dialogue/chat, plus an actual on-demand furnished Babylon 3D interior at Bag End with safe door entry/exit, room object interactions and persisted visitation. Outdoor meshes are temporarily disabled when indoors; only the player remains in scene, collisions switch to room bounds. The auto-save persists the outdoor return point to avoid out-of-bounds resumption. No new paid/licensed film resources. New tests must prove rendered room and mobile controls before merge.

## 0.3.0 cinematic visual review
PR exact-head GitHub Chromium `40773771757` at `932f2a999aae75f0d108fe2d49c3bdb091c8d6f7`: source/node tests and real browser gameplay/dialogue/map/intro both desktop and touch PASS, artifact `12853642534`; screenshots visually inspected. Original intro camera was too close to the low-poly pony and cropped the cart. Camera has been reset to a deliberate medium/wide village side shot from the very first frame, pony head/ears toned down, and cinematic timeline tied to monotonic real elapsed time to avoid stretching at low render FPS. These refinements need fresh exact-HEAD screenshots, with physical Windows FPS still a separate measurement.

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


Next acceptance step: the owner opens the deployed URL in a WebGL-capable browser and provides actual render/interaction evidence. Fix any observed runtime defects before expanding the story.

## Browser QA / character-motion candidate (2026-10-28)

- Added articulated hobbit leg pivots and a simple procedural walk cycle, with idle settling. Bilbo and Sam now have distinct hair colors and handheld silhouette props (book and garden trowel). These are original stylized models, not validated screen-accurate likenesses.
- Added a Chromium WebGL CI runner that attempts end-to-end desktop walking, dialogue, apple collection, save/reload, and simulated mobile joystick, touch camera and tap interaction. The runner records WebM videos, PNG captures, browser errors and sampled FPS to an Actions artifact.
- At candidate authoring time: browser visual QA, mobile interaction, hardware FPS and visual acceptance are NOT RUN; the new workflow must report a successful run before any browser-playability claims are upgraded. CI SwiftShader is not the specified target device.
- Local `npm ci`: BLOCKED by this execution container's inability to resolve registry.npmjs.org. Previous GitHub Actions `40596189871` passed at base commit `324e35f`; exact candidate HEAD must be re-tested by GitHub Actions.

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



