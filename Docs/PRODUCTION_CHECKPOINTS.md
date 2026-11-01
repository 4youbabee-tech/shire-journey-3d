# B5 merged — B6 active

B5 PR #27 merged as `de1df1859c6cc75aa7dfb04753f6525b079193dd`. Source head `da60df5845641d30c0ea4f0d073aadac6d65436a` passed all jobs in Actions `41353017080`: 89 source tests, full desktop/mobile Bree walkthrough, previous road, Bywater, opening, party, revelation and paired golden checks. Exact-head Bree artifact `13102017444` downloaded and SHA256 verified as `d589d73e295561d0e16c9d073c9f8fe786954a064ff7ed6bfb664c670b3824c7`; actual images reviewed. Real keyboard walking, innkeeper/Strider tasks, resting and restored indoor save passed on both viewports. Interior has 35 active regional meshes. Publication of 0.16.0 is tracked separately; do not infer it solely from merge.

B4 is already merged and its 0.15.0 public build was verified. B6 is active on `production/b6-ring-interaction-01`; saved checkpoint `db0aba4c5b0a7fa6f60588b1833083610951dc08` preserves nine original owner reference images and a tested Ring interaction module. Integration and visual refinement are in development; B6 is not completed or merged. Original references live under Docs/References and are indexed in OWNER_VISUAL_REFERENCES.md on that branch. B7–B10 and physical-device FPS acceptance remain open.

---

## Previous receipts

# B4 merged and published — B5 in CI

B4 PR #26 merged as `6613a74a114f83ebe3dd6ed37e78abd51d4116ff`. Exact source head `650529eea2d8cc558f3ecd7afb7b661cd7207ded` passed run `41351147934` (85 native tests, desktop/mobile Chromium, Bywater walkthrough, opening, party, revelation, road and golden evidence). Browser artifact `13101404657` was downloaded, SHA256 verified and actual desktop/mobile inn images reviewed. Digest: `a33e1e8ad550f0b70513b59dfe45ae8cc1a71d8bde88d17a3ead3552061aae90`.

Pages run `41352500004` succeeded. The original public `build-info.mjs` was independently fetched and serves version `0.15.0`, commit `6613a74a114f83ebe3dd6ed37e78abd51d4116ff`. Public rendered-game smoke is tracked separately in main run `41352500052`; hardware FPS remains unmeasured.

B5 PR #27 is the active candidate on `production/b5-bree-pony-01`; saved integration head `77ebf243a5b6e8ac54b6ea11f1c574b49147cc50`, run `41352380871`. 89 local source tests and full desktop/mobile Bree walking, lodging and save/reload passed. B5 is not yet merged or published. Current follow-up limits camera/party reset to real transitions and improves regional framing; it needs its own final validation. B6–B10 remain open. Owner images are approximate direction, not accepted game captures. Never call the entire requested game complete at this checkpoint.

---

## Historical receipts

# Latest execution checkpoint — connected B5 candidate

B4 PR #26 at `650529eea2d8cc558f3ecd7afb7b661cd7207ded` remains under exact-head CI run `41351147934`; source, road and golden jobs passed, full Chromium result still pending at this write.

B5 active branch: `production/b5-bree-pony-01`, prior saved source `df2f6981c95873a475cc59bfee86a84688c9700c`. Bree gate, town, Pony, dialogue tasks, party transitions, map, location and save restoration are now integrated as a 0.16.0 candidate. 89 native tests PASS; first Chromium desktop/mobile full Bree traversal PASS; final art/camera rerun and exact-head CI remain required. See [B5 active checkpoint](B5_ACTIVE_CHECKPOINT.md) and [owner art references](OWNER_VISUAL_REFERENCES.md). B5 is not declared completed or published. B6–B10 remain open.

---

## Earlier receipts

# Active execution receipt — B4 repair candidate

Base: `2fae96ee1ee7afeef2a6a48f92eac0995e7c90a4`, PR #26. Exact-head Actions `41348030595`: source, Chromium, road and golden evidence PASS. Browser artifact `13099743980` downloaded and actual desktop/mobile Green Dragon images inspected. Camera-edge mound occlusion and unarticulated single-mesh resident movement found; no merge acceptance granted.

0.15.0 source candidate preserves all inn details and residents while adding perimeter horizon placement, volume-based final camera clearance and six-bone single-mesh resident skinning. 85 native tests PASS locally. New Bywater browser playback records actual approach movement and live rigs on both viewports. Final exact-head CI, screenshot/video review and public deployment verification remain required. No target-device FPS claim.

B1–B3 merged; B4 active; B5 partial road only; B6–B7 partial; B8–B10 unbuilt. Continue the requested sequence after B4 acceptance. Historical receipts below retain their original status and do not override this receipt.

---

# Shire Journey — canonical production checkpoints

Owner's art target: the supplied warm, lush Shire concept image. It is a visual direction for real playable scenes: bright layered greens, natural rolling hills, mature varied trees, warm sun, welcoming round-door hobbit homes, expressive stylized 3D characters, residents, animals, readable mobile UI and environmental storytelling. Do not substitute a generated still for game evidence.

## Execution rules
- Continue the existing Babylon.js 9.32.1 GitHub project; preserve all files/assets and permanent Pages URL.
- One coherent checkpoint branch at a time. No merging a candidate until source tests, exact-head Chromium playback, real game captures and budget review pass.
- Keep film events in film order; note book-order differences and source references. All dialogue, score and cinematic staging must be original or appropriately licensed.
- Every checkpoint records commit, Actions run, artifacts, screenshot/video evidence, test counts, budgets, unresolved gates and public deployment SHA.
- Never call SwiftShader or NullEngine a phone/PC performance result. G4/G5 require the owner's actual device and network.
- PROJECT_GOVERNOR was requested but not found in the repository; do not fabricate it. AGENTS.md is authoritative until that file is supplied.

## Checkpoint map

| ID | Deliverable | Current state | Acceptance |
|---|---|---|---|
| B1 | 12 fixed golden cameras, 0.14.1 before/after, opt-in 5-minute perf JSON, film/story matrix | MERGED, owner review pending | PR23; Actions 41256482254 attempt 2; artifact 13063093276 |
| B2 | Rich green palette, warm cinematic daylight, natural sky/fog, denser perimeter grove | MERGED | Merged before B3; preserve the approved palette, lighting and 28 tree anchors |
| B3 | Distinct Hobbiton hobbit holes, roofs, doors, windows, paths, gardens and Bag End interior detailing | MERGED | PR #25; merge base `45f1d6bea0444d71bf353a9c657ea2339f841901`; 17 homes; 82 tests and Chromium checks reported |
| B4 | Bywater, Green Dragon, Gamgee home, lanes and domestic activity | IN PROGRESS | PR #26; retain the inn and prove exact-head source, Chromium, visual and mesh-budget gates |
| B5 | Complete Shire-to-Bree route and Bree interior / Prancing Pony | PARTIAL | Existing fields, rider concealment, ferry, Bree exterior; finish interiors and continuity |
| B6 | Distinct expressive hero cast and Ring continuity (Bilbo hand, drop, Frodo hand, chain) | PARTIAL | Four visible story beats, closeup captures and continuous WebM |
| B7 | 20+ residents, children/animals, work/social/rest, weather/day cycle, layered sound | PARTIAL | Timed activity simulation, 60s gameplay recording and audio decode/listen review |
| B8 | Weathertop encounter | NOT STARTED | Story/save/route tests and cinematic playback |
| B9 | Rivendell and Council; Fellowship forms | NOT STARTED | Character roster, council dialogue, save checkpoint and route exit |
| B10 | Moria, Lothlórien, Amon Hen and later journey | NOT STARTED | Chapter-specific maps, gameplay, story-order and performance gates |

## Current verified base
- Public baseline before B1: 0.14.1, 9779857b1a7d802980056ecff3ed4048954e7881.
- B1 merge: eeaf9f09e0899f464197088f2a0c53167ad33c96.
- B1 run 41256482254, attempt 2: source + browser + evidence + road jobs PASS. First browser attempt exposed a brittle Frodo-sitting assertion; second run passed continuous opening, party and revelation.
- B1 artifacts: shire-b1-evidence 13063093276; browser evidence 13062989060; road playback 13063053146.
- B1 CI uses SwiftShader. It proves capture/exporter functionality, not phone performance. Owner's five-minute ?perf=1 export remains required.
- Film/Story Bible source PDFs are registered in Docs/FILM_MATCH_MATRIX.md; full screenplay/book reconciliation remains open.
- PROJECT_GOVERNOR not present; AGENTS.md read and followed.

## Accepted B2 implementation constraints (historical receipt)
Use existing licensed maple-a.glb and maple-b.glb; do not download unreviewed assets. Increase the number of tree anchors conservatively while retaining invisible trunk colliders and deferred GLB loading. Keep understory and road-edge planting bounded. Palette changes must be tested on the actual WebGL captures. Do not increase post-processing passes. Keep the mesh budget regression and record active triangles/draw calls. B2 may not change story logic, save format, controls or route geometry.


## Active B4 candidate — 2026-11-01

- Repository authority: `4youbabee-tech/shire-journey-3d`; permanent Pages URL unchanged.
- Candidate branch: `production/b4-bywater-green-dragon-01`; PR #26: https://github.com/4youbabee-tech/shire-journey-3d/pull/26.
- Current candidate before this documentation receipt: `a0d62d6321d7528f8b3fc102b01b3d9731b2be00`; base: `45f1d6bea0444d71bf353a9c657ea2339f841901`.
- Green Dragon dressing is attached to the existing Bywater Road home: hanging sign and original dragon emblem, two lanterns, two barrels, two porch seats and two flower boxes. Existing house, road, spawn, quest triggers and collision layout are retained.
- The five-worker experiment exceeded the established budget. Actions run `41343685566` checked out `4b6d431d0c301e085f2dbafec2e5cd22ad7545f9`, not the latest candidate: 81/83 tests passed; the two failures were the scene-character assertion (expected 8, actual 10) and the strict scene-mesh budget (`<240`). Chromium playback did not start because the source suite failed.
- The later candidate removes the two extra villagers, retains three background villagers, and updates the worker-count assertions. Its current world source reports eight total character roots and three background villagers. This is a source-level correction only; exact-head CI and screenshot/performance evidence are still required.
- Merge gate: exact-head `npm ci`, `npm run check`, full `npm test`, Chromium desktop/mobile opening, party, Ring-revelation and road playback, inspect uploaded screenshots/video and scene budgets. SwiftShader/NullEngine are not target-device FPS measurements.
