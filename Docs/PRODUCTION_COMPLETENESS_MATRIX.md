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
