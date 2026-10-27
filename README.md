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

## Browser-rendered QA candidate

The optional `.github/workflows/browser-qa.yml` workflow runs Babylon inside real headless Chromium WebGL (SwiftShader), records desktop and mobile-emulated interaction videos/screenshots, tests a complete original errand and save/reload, and uploads a `qa-evidence` artifact with FPS samples and exceptions. Software-rendered CI FPS is **not** a performance measurement for the target i7/2GB Windows GPU. This does not update the separate private ChatGPT Sites deployment; a new deployment must be verified against its exact source commit.

## Arabic character conversations and film chronology (candidate)

The F1-01 birthday-preparation safe window now includes Frodo. All four NPCs accept **typed Arabic questions** using an offline contextual intent engine with short topic memory; the UI openly labels this as **not a free-generative LLM**. Only small topic IDs are saved, not the text users enter. Responses are original lines within each character's current knowledge; no copyrighted dialogue or movie audio is used. Film-story progression beyond the opening is not yet implemented.

For truthful browser QA, the optional `?qa=1` hook permits controlled relocation between encounters after separate real WASD and joystick movement smoke tests. The visual artifact therefore proves WebGL rendering, UI, interaction and save-reload, but **not** continuous full-map pathfinding or target PC performance. The user-facing game without `?qa=1` has no relocation control.

**Evidence provenance:** PR-triggered GitHub Actions uses a synthetic merge commit by default; the browser QA workflow now checks out the actual PR head SHA and compares it against `EXPECTED_COMMIT_SHA` so later recordings and QA JSON can be tied to a reproducible exact-source commit. Scripted relocation in QA mode is not full-route navigation acceptance. See Docs for the original intermediate PR merge-ref run `40599606372` and its limitations.

The `40600040728` Actions run is the first exact-HEAD source checkout receipt (`8e39c0d`) with full WebGL QA PASS; video/images archived as artifact `12777793020`. The current follow-up art refinement is an unverified candidate until its own exact-HEAD CI. The private ChatGPT Sites host has **not** been updated by any GitHub commit.

## Storybook portraits and optional Arabic narration (0.2.1 candidate)

All four talking NPCs now have original embedded SVG portraits illustrating their distinct costume and hair silhouettes in the Arabic conversation panel. Users may tap **استمع · صوت آلي** to hear the current original dialogue via the browser's system speech synthesizer when Arabic speech is available. This does **not** imitate film actors; voice support and quality vary by device/browser, and no voice file or cloud voice endpoint is provided by the game. No prose or script text from the films is copied.

The four SVG images have an independent source/integrity regression test. Browser QA verifies portrait rendering in actual WebGL sessions. `package.json`, lockfile and client diagnostics use version 0.2.1. All changes remain separate from the UE4 project. This candidate is not yet approved for visual quality or device-performance gates.
