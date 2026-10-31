# Cozy Shire — World and production decisions / 2026-10-31

## Product scope

- This is a small, relaxing Babylon.js village experience, not a full trilogy adaptation or giant open-world campaign. Keep the player in one Shire district and make the existing space pleasant, alive and easy to explore.
- The short playable loop is Gandalf's arrival → friendly conversations → Sam's optional garden/apple task → Bag End exploration → birthday gathering → visible Ring handoff → free roam.
- The existing 17 homes / 12 roads / orchard / market / pond are retained. Improve the visible core and the routes the player actually walks before adding any new region.
- Keep four hero characters (Frodo, Gandalf, Bilbo, Sam) and a small background cast. Do not grow crowd count or introduce heavy AI just to make the village look busy.

## Ring

- The Ring is a real Babylon torus attached to the imported right `ring_01_r` bone of Bilbo and Frodo. The saved canonical `ringPassed` result is the only owner authority: Bilbo before the birthday outcome, Frodo after it.
- Earlier close-up evidence showed a too-large edge-on gold strip and a Bilbo screenshot hidden by the Gandalf opening dialogue. Correct the ring to a thin band measured from `ring_01_r → ring_02_r`, align its opening axis to the finger, and frame inspection along that axis with no dialogue overlay.
- Current candidate target: diameter 0.018–0.03 local units, thickness 12% of diameter, world-space bounding extent below 0.04. Actual WebGL screenshots and exact-head tests decide acceptance.

## Homes and comfort

- Keep one front/interior hull and three side/rear mound hulls per house; preserve Bag End's door approach. Invisible collision volumes are counted separately from visible render meshes.
- Prioritize a clear front door, warm windows, chimney, small gardens, natural paths and a cozy Bag End interior. Avoid adding clutter that blocks the player or camera.

## Performance

- Current scene has ~920 meshes / 635k triangles desktop and ~1,022 meshes / 649k triangles in touch emulation. Nature currently creates 300 patches and 220 roadside placements; profile and instance these before adding more decorative meshes.
- SwiftShader medians (1 FPS desktop / 3 FPS touch emulation) are software-only. No physical target device has been tested in this evidence set.

## Historical 0.9.2 candidate — house collision and Ring owner

Base main/Pages: `3f54c8d4b889ce8537de0595d5f628f7a2db9bfd`. Draft branch only; do not treat as published.



## Exact-head browser correction — 90d8519

Actions 41187332860 passed npm install, syntax and all source tests, then Chromium correctly exposed one stale browser assertion: the post-party Frodo ownership check still expected the previous oversized Ring range (0.035–0.065), while the new intended range is 0.018–0.03. The runtime handoff itself was not the failing condition; the stale expected-size assertion was. The assertion now matches the new finger-sized geometry. Re-run exact-head desktop/touch Chromium and inspect the new unobstructed Ring close-ups before accepting this candidate.
