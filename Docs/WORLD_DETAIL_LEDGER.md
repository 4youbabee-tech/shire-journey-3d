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
