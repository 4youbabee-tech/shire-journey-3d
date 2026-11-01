# B7 visual quality checkpoint — 2026-11-02

Latest candidate source: 2bc306063858036fb3c46929a9a000b724e3aea9
PR #29: https://github.com/4youbabee-tech/shire-journey-3d/pull/29

Performance issue from exact-head CI: individual animal child meshes pushed scene.meshes above the existing strict budget. A first repair reduced each animal to one mesh, but it did not yet satisfy the shared-scene budget. The current implementation consolidates the four animals into one shared thin-instanced mesh, retaining species scale, bounded movement, grazing/hopping/rest and per-instance transforms. This is the candidate intended for validation; do not assume the fix passes until exact-head source and WebGL CI finish.

B7 also includes a smooth day/night sky/fog/sun/ambient/exposure controller and daylight-aware ambient audio. Exact-head desktop/mobile browser evidence must be inspected before merge.

B6 is merged and its exact-head suite passed. The original Pages URL remains https://4youbabee-tech.github.io/shire-journey-3d/

Remaining scope: B6 hero visual acceptance; B8 Weathertop; B9 Rivendell; B10 onward; story/campaign continuity; target-phone and low-end-PC performance. No claim of full campaign completion until playable tests and publication verification pass.
