# B7 checkpoint — 2026-11-02, animal draw-budget repair

Branch: production/b7-living-world-02
Latest source commit: 9ca4af794af21dc78d0f806d21af085c8640907a

Exact-head run 41360364410 exposed two budget regressions: scene.meshes >= 240 and rigid character batching budget. The four animals originally used three child meshes each. The repair consolidates each animal to one vertex-coloured mesh and updates the native regression to enforce one mesh per animal. These budget assertions must pass on the new head before merge or publication.
B7 scope: four meadow animals, bounded routines/night rest, day-night lighting and sound variation, native and desktop/mobile browser tests.
B6 merge remains main SHA 1322214233dd98e73efb6c1e7b657ea374825fef. Permanent Pages URL unchanged: https://4youbabee-tech.github.io/shire-journey-3d/
B8 Weathertop, B9 Rivendell, B10 later campaign, complete B6 hero art and physical-device performance remain open.
