# Shire Journey — Cozy Shire Production Plan

## Product promise

Build a small, beautiful, relaxing Babylon.js game that is enjoyable to open for 10–20 minutes. The player spends a quiet day in one Shire village: see Gandalf arrive, meet Frodo/Bilbo/Sam, wander among round green homes, help Sam in the garden, enter Bag End, enjoy the birthday gathering, witness the One Ring pass to Frodo, then continue exploring at their own pace.

This is intentionally a small experience, not a full three-film campaign, not a huge open world, and not a combat-heavy RPG. New distant regions, war systems, large quest chains, and complex AI are outside the current scope. Keep the existing Babylon.js 9.32.1 project and permanent GitHub Pages URL.

## Current playable foundation

- In-world Gandalf pony-cart arrival and Frodo opening, with skip and player-control handoff.
- Original Arabic conversations with Gandalf, Frodo, Bilbo and Sam.
- A small optional apple/garden task and a simple preparation path.
- Walkable Bag End interior with furniture and room collision.
- Birthday gathering with original lightweight fireworks and a canonical saved outcome.
- Real imported GLB character rigs, facial blink/gaze controls, original music and licensed/CC0 environmental audio.
- One compact village layout with 17 homes, 12 roads, a pond, orchard, market, trees, gardens and three scheduled gardeners.
- Save/reload, desktop controls, touch joystick/camera and adaptive quality selection.

## The small finished experience

1. **Arrival:** a peaceful morning; Frodo under the tree; Gandalf approaches by pony cart; hoof, wheel, harness and pastoral ambience; a short camera handoff to the player.
2. **Meet the village:** greet Frodo, Bilbo and Sam; short character-specific Arabic conversations; no lore spoilers or unrelated systems.
3. **Garden moment:** help Sam gather apples or tend the garden. Keep the objective understandable and short. The task is original optional village content, not falsely presented as a film event.
4. **Bag End:** walk through the green door, explore a cozy furnished interior, inspect a few meaningful props and return outside without collision glitches.
5. **Birthday:** a brief warm gathering with staggered villager reactions, original music/fireworks and a clear story beat.
6. **The Ring:** show a correctly scaled real 3D Ring on Bilbo before his departure and on Frodo only after the saved canonical handoff. A short close-up should make the object readable without turning it into an oversized gold bar.
7. **Free roam:** after the gathering, keep the village open for quiet exploration, conversations and ambience. Do not force a new chapter or threat encounter.

## Art direction

- Soft, warm, hand-painted storybook look: fresh greens, natural soil, warm timber, cream plaster, flower color variation and gentle morning light.
- Keep the hills, doors, paths and tree silhouettes readable from the normal player camera. Distinct house colors and garden silhouettes matter more than adding dozens of props.
- Hero characters should be recognizable by silhouette, face, hair, clothing and height. Avoid extreme cartoon distortion, blank eyes, floating feet, stiff arms and identical villagers.
- Prioritize Frodo, Gandalf, Bilbo and Sam; the three gardeners may stay lightweight background roles. Do not build a large cast before the core four look good in motion.
- Bag End needs warm interior light, a visible hearth, a table, books, dishes, cloth and a few interactable objects; do not fill every room with expensive clutter.
- Nature should be varied and gently animated: trees, a few flowers, birds, water, soft wind and chimney smoke. Use instancing/LOD and avoid hundreds of separate decorative meshes.

## Audio and feel

- Keep the original score, wind, birds, licensed forest ambience and CC0 footsteps already packaged.
- Improve only the most noticeable missing cues: cart/horse approach, soft wheel/harness, Bag End door, garden tool, pond/stream and party crowd layers.
- Keep audio start behind the user's Start interaction and preserve independent music/effects/master controls.
- Avoid loud UI, repetitive chirps and synchronized NPC motion. Quiet pauses are part of the experience.

## Performance and controls

- Target a smooth 30 FPS at 720p on the agreed PC and a physical phone, but do not claim hardware acceptance from SwiftShader.
- Current CI scene sample: roughly 920 meshes and 635k triangles on desktop; touch sample roughly 1,022 meshes and 649k triangles. SwiftShader medians were 1 FPS desktop and 3 FPS touch emulation on the current candidate. These software-only values are a profiling warning, not a physical-device measurement.
- Profile the heavy nature/GLB instances and scene updates before adding content. Prefer thin instances for repeated non-interactive flowers/grass, regular instances where picking is needed, low-poly collision hulls, distance-based actor updates and a small shadow budget.
- Keep Arabic UI legible at 360–390 px widths, with no dialogue/toast overlap. Touch joystick, camera drag and interaction must remain easy to use.
- Avoid unnecessary downloads, remote runtime asset dependencies and large textures. Existing assets are packaged locally; keep the small-device memory budget in view.

## Production batches

### C0 — Visible Ring and home collision

- Make the Ring a delicate band scaled from the real finger segment and aligned around the finger.
- Capture unobstructed Bilbo/Frodo WebGL close-ups; verify normal-gameplay ownership before/after the party.
- Keep house mound side/rear collision and Bag End's clear front approach.
- Pass source tests, desktop/touch Chromium and visual review before merge.

### C1 — Smooth, light village

- Measure mesh/draw-call/triangle/texture and animation cost in the existing village.
- Optimize repeated roadside nature and flower patches with instancing or safe distance culling; do not delete visual variety blindly.
- Reduce unnecessary per-frame NPC/label work while keeping nearby life animated.
- Re-test the same opening, party, Bag End and touch scenes to prevent regressions.

### C2 — Cozy atmosphere and tiny interactions

- Add only a few high-value moments: gentle pond motion, a small bird/butterfly pass, a garden tending action, a bench/rest interaction and a responsive house door.
- Keep all interactions optional and short. Do not add inventory complexity, combat, crafting trees or new story-management systems.

### C3 — Character and village polish

- Refine the four hero faces, eye direction, clothing folds/materials, hair silhouettes, hand placement and idle/talk/walk transitions.
- Improve the existing 17 homes with varied doors, windows, chimneys, gardens and interior props. Focus on the area visible from player routes.
- Stagger gardener routines and add a few social moments; no large crowd simulation.

### C4 — Final cozy slice acceptance

- Full natural opening and skip path; full apple/garden task; Bag End entry/exit; birthday and Ring handoff; free-roam after party.
- Desktop/touch WebGL tests, screenshots and real gameplay recordings.
- Physical target PC/phone FPS and memory test when those devices are available; otherwise explicitly NOT RUN.
- Merge only after the exact PR head passes and the real screenshots look right. Verify the public Pages SHA after deployment.

## Explicitly not in scope right now

No Bree, Rivendell, Moria, Helm's Deep, Mordor, trilogy campaign, giant world map, large NPC population, combat system, multiplayer, online AI service, or move to another engine. These can be reconsidered only if the owner later asks for a larger game. They are not blockers for this small cozy experience.

## Acceptance rule

The experience is accepted when it is pleasant to walk around, the four main characters look good enough in motion, the Ring handoff is visible and chronologically correct, Bag End and the garden work reliably, the village feels quietly alive, audio is warm, mobile controls are usable, no blocking collision/save bugs remain, and target-device performance has been measured honestly. A green test alone is not visual acceptance.
