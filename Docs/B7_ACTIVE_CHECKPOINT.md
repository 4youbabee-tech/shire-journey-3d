# B7 checkpoint — 2026-11-02, species meshes and twilight QA

Latest source commit: 18202141c882ee243fa1ef35dae15f7d7081c5c3
PR #29: https://github.com/4youbabee-tech/shire-journey-3d/pull/29
Exact-head CI: run 41362014872 is in progress.

Changes since previous B7 candidate:
- Replaced generic shared animal silhouette with separate sheep and rabbit low-poly silhouettes.
- Each species uses one shared thin-instanced mesh for two animals; only two animal draw calls total.
- Moved the meadow animals to a clearer west meadow patch for visual review.
- Extended the twilight daylight curve so sunset retains more light before night.
- Updated native and desktop/mobile browser QA assertions to validate the two species batches and the clearer meadow.

Do not merge B7 until run 41362014872 is fully green and its screenshot/video artifacts are reviewed. Earlier exact-head attempts exposed the scene mesh budget and a sunset-to-night assertion; both were addressed but need current-head confirmation.
B6 Ring inspection is merged in main at 1322214233dd98e73efb6c1e7b657ea374825fef. B5 Bree and road/ferry remain in main.
Permanent Pages URL: https://4youbabee-tech.github.io/shire-journey-3d/

Not yet delivered: full B6 hero art acceptance, B8 Weathertop, B9 Rivendell, B10 later campaign, full-campaign end-to-end acceptance and physical low-end device FPS. These remain open; do not label the game final until playable and validated.
