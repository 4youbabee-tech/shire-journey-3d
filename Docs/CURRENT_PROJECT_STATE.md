# Active project state — Cozy Shire 0.9.2 candidate / 2026-10-31

- Official runtime: Babylon.js 9.32.1. This project is intentionally a small, relaxing Shire village experience; no other engine is part of this project's scope.
- Published `main` and Pages remain 0.9.1 at `3f54c8d4b889ce8537de0595d5f628f7a2db9bfd`. Permanent public URL remains https://4youbabee-tech.github.io/shire-journey-3d/.
- Active draft PR #15: `production/0.9.2-visible-ring-house-hulls`. Current tested base candidate `23341fc96cd88ffe34e1f704cb569d5ae71c3e8e` passed Actions 41186173680: npm ci, syntax, source tests, desktop/touch Chromium, opening playback, birthday playback and evidence artifact upload.
- Artifact 13036954292 contains real screenshots and WebM recordings. CI SwiftShader measured desktop median 1 FPS and touch-emulation median 3 FPS; these are software-renderer results, not physical-device performance results.
- The inspected Frodo Ring close-up was oversized/edge-on and the Bilbo detail screenshot was obscured by the opening dialogue. This candidate corrects the Ring to a thinner 0.018–0.03 local-unit band measured from the actual finger segment, aims the close-up camera along the ring opening, closes the dialogue before Bilbo capture, and asserts world-space size below 0.04. New exact-head CI and screenshot review are required.
- Every Hobbit-hole has front/interior plus left/right/rear invisible hulls; Bag End's front approach remains open. NullEngine tests passed on the previous candidate. Browser QA covers normal gameplay and story ownership; player walk-around visual review remains required.
- Current player experience is F1-01 only: Gandalf arrival, conversations, garden/apple task, Bag End interior, birthday gathering, Ring handoff and free exploration. No later film chapters or distant regions are in current scope.
- Current CI scene sample is about 920 meshes / 635k triangles desktop and 1,022 meshes / 649k triangles touch emulation. SwiftShader performance is not a hardware benchmark. Physical target PC/phone 30 FPS is NOT RUN.
- The current map is a compact original village schematic. Do not claim canonical film-map matching; map PDF visual reconciliation is not needed for the cozy single-village scope.

Historical 0.9.1 and earlier evidence remains below for provenance.

