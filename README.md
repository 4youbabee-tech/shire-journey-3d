# Shire Journey — A Morning in the Shire

A small, original, stylized 3D browser exploration game built with **Babylon.js 9.32.1**. This is a browser proof of concept authorized separately from the existing UE4 production project. It does not replace its canonical `develop`, open a PES session, or claim compliance with an unavailable ProjectGovernor.

## What is implemented

- Third-person walking, running, camera drag and wheel zoom.
- Touch joystick, touch camera and interaction button; tap ground to walk in a straight line (not obstacle-avoiding pathfinding).
- An original procedurally modeled hobbit village with rounded houses, green doors, garden, orchard, pond and party tree.
- Stylized Bilbo, Sam and Gandalf with distinct clothing, height and props. These are simplified original interpretations, not actor likenesses or film models.
- Original Arabic branching dialogue, a five-step party-preparation side activity, apple collection, journal and completion state.
- Native Babylon ellipsoid collisions with ground, house volumes, tree trunks, tables and village boundary.
- Validated local browser saves; no account, server saves, multiplayer or cloud synchronization.
- Optional synthesized bird sounds. No actor voices, voice cloning, voice acting or AI live conversations.
- Engine file and license vendored locally; no CDN runtime requests.

The story context is the Shire's birthday preparations. The apple errand is **ORIGINAL-GAME**, not an event claimed to occur in the film. The actual birthday sequence, Ring transfer, departure, Bree and the remaining trilogy are **not implemented**. House interiors are not accessible.

## Run and test

For a fresh GitHub checkout, run `npm ci` first. This installs the pinned Babylon.js 9.32.1 dependency and copies the exact checksum-verified engine into `dist/vendor/`. Then serve `dist/` from an HTTP static server. No bundler is needed. The deployed Site already contains the engine. WebGL is required. Open `?qa=1` to display read-only diagnostics: player position, stage, FPS, counters and scene statistics.

```sh
npm run check
npm test
```

Tests require Node 20+ and use the vendored Babylon **NullEngine** for real scene construction and collision checks. NullEngine does not rasterize pixels and cannot establish visual quality, shader compatibility or device FPS.

## Controls

WASD / arrow keys: move. Shift: run. Drag scene: camera. Mouse wheel: distance. E: interact. J: journal. Escape: close dialogue/journal. On touch devices, use the left joystick, drag the scene to look, and tap the interaction button when nearby.

Tap-to-walk moves straight toward the selected ground point and stops at obstacles; use manual controls to walk around them.

## Source layout

- `dist/simulation.mjs`: story state, interaction distances, save validation, dialogue and objectives.
- `dist/world.mjs`: procedural art, native collision volumes, character scene graph and static batching.
- `dist/game.mjs`: browser input, camera, UI, audio, persistence and frame adapter.
- `tests/game.test.mjs`: quest, persistence, dialogue, engine construction and native collision regression checks.
- `.openai/hosting.json`: hosting identity; its Git endpoint is separate from GitHub.

## GitHub source and deployment

This dedicated repository is `4youbabee-tech/shire-journey-3d`. Its game modules, HTML, CSS and tests match the published Sites prototype. The 8.4 MB third-party engine is reproducibly restored by `npm ci` and verified against the exact SHA256 used for that deployment. Hosting identity is kept out of this repository.

Pushes to `main` run syntax and all six regression tests on GitHub Actions. The optional manual Pages workflow additionally publishes `dist/` after the owner has enabled Pages with GitHub Actions. No Pages deployment has been requested by the automation itself.

The first private browser candidate is hosted at https://shire-journey-a-morning.mavos-8036.chatgpt.site . Successful hosting does not establish successful WebGL rendering. The provided cloud browser has no WebGL support; see the verification limits below.

## Scope and verification

Read `Docs/CURRENT_PROJECT_STATE.md` and `Docs/PRODUCTION_COMPLETENESS_MATRIX.md` before making completion claims. This first revision is not the full game and is not visually accepted or device-tested.

Babylon's license and notices are in `dist/vendor/`. Project art and dialogue are original generated code; no film extracts, book passages, audio tracks or uploaded reference PDFs are redistributed.
