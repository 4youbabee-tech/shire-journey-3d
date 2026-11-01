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
| B2 | Rich green palette, warm cinematic daylight, natural sky/fog, denser perimeter grove | IN PROGRESS | Exact-head Chromium, paired captures, source suite, mesh/triangle budget, owner art review |
| B3 | Distinct Hobbiton hobbit holes, roofs, doors, windows, paths, gardens and Bag End interior detailing | NOT STARTED | Map-derived coordinates, GLB/licence ledger, interior walk and screenshots |
| B4 | Bywater, Green Dragon, Gamgee home, lanes and domestic activity | NOT STARTED | Playable connected village, NPC schedules, day/night and A/V evidence |
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

## Active B2 implementation constraints
Use existing licensed maple-a.glb and maple-b.glb; do not download unreviewed assets. Increase the number of tree anchors conservatively while retaining invisible trunk colliders and deferred GLB loading. Keep understory and road-edge planting bounded. Palette changes must be tested on the actual WebGL captures. Do not increase post-processing passes. Keep the mesh budget regression and record active triangles/draw calls. B2 may not change story logic, save format, controls or route geometry.
