# Browser proof-of-concept decisions

- Owner selected a cartoon style and prioritized walking and talking over photorealism.
- Original procedural houses use circular doors/windows, grassy mounds, gardens and curved paths. Models are not film-production assets.
- Hobbits have short proportions, curly hair, waistcoats and bare feet. Gandalf has taller proportions, grey robes, beard, pointed hat and staff. Actor likeness is not claimed.
- Opening context derives from the attached story bible's birthday-preparation safe window. Apple collection and all dialogue are ORIGINAL-GAME and cannot be cited as film events.
- Do not advance main plot outcomes through this optional errand. The actual party, Ring transfer and departure are not implemented.
- Art stage: SOURCE_AVAILABLE / WAREHOUSE_PERSISTED after source push. No asset has UE_IMPORTED / WORLD_PLACED / RENDER_OBSERVED / ACCEPTED status in the canonical UE4 project.
- Browser evidence remains separate from Unreal evidence.

- Browser character-motion candidate: each hobbit receives independent procedural leg pivots; Bilbo carries an original miniature book and has silver-brown curls, Sam a garden trowel and sandy curls. Props and animations are source-authored, not yet render-observed or visually accepted. Gandalf's original staff remains unchanged.
- Browser QA proposed: software-WebGL screenshots/video must not be counted as Windows target device evidence or Unreal acceptance.

- Browser actual frame inspection run `40597990755`: grassy hill meshes occluded the iconic round house facades and high light strength washed out the path. Correction shifts house mound/roof back behind facade and reduces sun/fill lighting. Visual acceptance withheld until exact-head screenshot review.

- F1-01 canon boundary from `01_STORY_AND_TIMELINE_BIBLE.pdf`: birthday preparation safe window; Bilbo leaves and Ring passes to Frodo only in a later irreversible main event, not caused by the original apple errand. Current conversations explicitly avoid revealing future character knowledge.
- Browser newcomer Frodo: teal-blue waistcoat, dark curls, small satchel, modest hobbit stature; original procedurally shaped and not actor likeness. Physical scene still to be rechecked at exact candidate SHA.
- Conversational tiers: current offline Arabic contextual intent+topic memory (real, no external tokens); future optional generative AI is not wired or claimed. Do not place client-side secret keys in a GitHub Pages static app. Responses not official film dialogue.

- Browser visual evidence artifact `12778800072` shows grassy rounded hobbit houses with visible doors, party tree, Gandalf and distinct hobbit silhouettes; actual player view readable, but actor likeness and polished production animation have not met visual acceptance. Performance not extrapolated from SwiftShader.

- Bilbo refined from owner-provided 3D Visual Asset Atlas: burgundy long coat panels/tails, pale shirt lapels, greying curls and leather book. Maintains original procedural stylized geometry, not actor face/film asset. Requires new render inspection before acceptance.
- Browser QA-only position setter now requires localhost + `?qa=1`, unlike public play session; original side quest remains canon-neutral.

- F1-01: four new original portrait illustrations (Bilbo rust waistcoat and brown curls, Sam gardener clothing and trowel, Gandalf pointed gray hat and beard, Frodo teal clothing and dark curls) are embedded SVG, independent of actor likeness and movie photography. They're supporting UI assets, NOT replacement 3D character meshes.
- Optional Arabic system narration speaks only original text upon user click, never movie recordings or cloned character voices. It depends on installed browser voices and is not yet audited on target hardware.

- Quiet Shire liveliness candidate: varied bird chirps, quiet original three-note pastoral synthetic motif and faint leaves; character head/arm idle gestures, no path-changing AI or new main plot. Chosen Web Audio oscillators to avoid asset downloads and preserve modest GPU load. Requires browser gesture to activate mobile sound.

- Three small named background villagers added as ambient-only walkers in existing open garden plots; no story roles or new canon actions. Upper foliage includes small independent sway nodes without unmerging the static forest. Frame work is limited to 14 transformations; requires device FPS check.


## 2026-10-28 batch 1A decisions
- ORIGINAL-GAME engineering: preserve existing character silhouettes and triangle detail; merge only rigid pieces sharing material and joint. Never merge across limb/head pivots. No GLB/skin/production facial-art acceptance claimed.
- ORIGINAL-GAME sound: generate a PCM noise bed locally; separate master/music/effects. No film audio, tune or actor imitation imported.
- SCRIPT-VERIFIED reference inspection: supplied Fellowship screenplay, printed pp. 10–12 (PDF pp. 11–13), `EXT. HOBBITON WOODS` to `EXT. HOBBITON FIELDS`: Frodo reads beneath an old tree; approaching pony/cart and voice draw his attention; he rises and runs; cart travel intercuts with his run; he appears on the bank above the cart; the pair exchange greetings, laugh, and Frodo joins the front seat; then they pass cultivated fields. No screenplay dialogue is copied into game. Source describes end of summer/day; gentle morning is an owner-directed VISUAL-ONLY interpretation, not a script-verified time of day. The screenplay specifies a pony, not a full-size warhorse. Shot implementation is NOT IMPLEMENTED in batch 1A.
- Public GitHub Pages is the sole active browser deployment. Historical private Sites references are obsolete and must not be redeployed.

## Batch 1B artistic/engineering decision
- Preserve prior Babylon procedural art, collision and narrative. Three original non-dialogue villagers gain deterministic travel-and-tend gestures using unchanged geometry. Adaptive scaling only after sustained measured GPU frame rate; initial detail remains unchanged until sampled. No new canonical scene or character model accepted.

## 2026-10-28 Browser 0.3.0 art direction / source provenance
- WORLD BIBLE: the Shire/Hobbiton = pastoral hills, Hobbit-holes and gardens, onboarding and exploration; Bag End remains the dominant navigational landmark. Routes are legible without forcing map usage.
- LAYOUT: 17 procedurally modeled original Hobbit dwellings and 12 roads; market, lanterns, benches, two wells and shrubs are small-game design interpretation and do not assert film-canonicity.
- STORY: original short arrival of a pony-cart with Gandalf and Frodo inspired by the source safe window, without copied screenplay dialogue or film audio. Explicit skip/replay; no canonical Ring action changed.
- TECHNICAL: no texture network requests; retain merged static materials and low-triangle details, expanded village boundaries with save validation, test scene/character restoration and screen-rendered evidence. Performance on owner device remains a separate metric.

- CINEMATIC VISUAL REVIEW: initial shot showed an unflattering cropped close-up of primitive cart and pony; reframe the original-game arrival as a medium/wide Shire road shot with scenery and Gandalf visible. Preserve skip and full automatic return; time is monotonic real elapsed instead of frame-rate-dependent simulation stepping.

## Mobile milestone P01–P02, Bag End playable interior
The source World Bible calls Bag End a Hobbit narrative hub with dense lived-in props, circular geometry and interior state transitions. This release adds an ORIGINAL-GAME furnished room with timber ceiling, books, table, firelight, readable diary, and safe door-based entry/exit. No film set replica or soundtrack copied. Switching exterior meshes off indoors reduces competing draw calls. The home remains a contained location rather than a separate second-world authority. Mobile HUD priorities: conversation controls and thumb access over decorative panels; music begins only after voluntary Start tap. High-first adaptive resolution is a preference, not a physical 30 FPS guarantee.

- 0.4.0 visual intervention: first interior screenshot looked spacious/empty versus Hobbit lived-in reference. Shift furniture forward and add warm domestic foreground details (herbs, candle stands, luggage and blanket) without new collisions. Mobile interior screenshot acceptance added to QA.

## 0.5.0 original Shire story and birthday art decision
The timeline Bible fixes F1-01: Gandalf arrives, Bilbo prepares birthday festivities, then Bilbo departs and the Ring passes to Frodo. This candidate makes the first meeting with Gandalf an explicit prerequisite before Bilbo's preparation; retains optional original apple errand, adds inexpensive colored 2D fireworks and original Arabic voice-subtitled birthday, shifts existing NPCs into a temporary scene, restores them on skip, then hides Bilbo after departure. No canonical outcomes change, no film song or dialogue copy. 2D overlay avoids extra shaded 3D meshes.

## P03 birthday shot QA
Rendered screenshot exposed a green foreground hillside occlusion at first party camera coordinate (11,7,12). Avoid camera-only edits that alter story positions or collision. New camera is outside the mound to the north, looks south toward seven existing villagers temporarily assembled under the tree. This reuses accepted meshes and restores all individuals at end/skip, keeping draw cost bounded.

## P04 hero-art pass
Refine initial toy-like character proportions with narrower faces and hair silhouettes, pupils, eyebrows and modest lip/shading details; differentiate clothing and wizard beard. Keep no copyrighted film actor scan, preserve original NPC identities and current plot; keep material batching and existing neck/arm/leg pivots.

P04 corrective art decision: retain high-resolution facial sculpting only on the four story heroes, not background laborers. Use the existing skin/eye material batches instead of distinct blush/lip materials, avoiding extra grouped draw calls. Preserve strict mesh count regression, original costume silhouette and narrative IDs.

## 2026-10-29 P05 game presentation and story choice
- Player-supplied real mobile screenshot is direct rejection evidence for the prior flat green toy-like presentation and old-save apple primary objective. New art stays ORIGINAL-GAME; mellow palette, ground vertex colors, naturalized silhouettes and smaller flowers do not claim film character likeness.
- Acoustic impression of an original pastoral song is synthesized through inexpensive Web Audio triangle/sine notes with bass and 12-second phrase variation; no copyrighted recordings or film music. Wind and birds have independent effects control.
- Avoid rewriting existing progress. A saved game can restart from Gandalf arrival via an explicit action, or continue the optional apple side activity and reach the party through Sam. All main canon outcomes remain gated by their story actions.
