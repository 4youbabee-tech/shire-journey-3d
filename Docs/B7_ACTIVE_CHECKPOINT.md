# B7 active checkpoint — 2026-11-02

Active branch: `production/b7-living-world-01`
Latest B7 source commit: `f367ce7bf1b490cb181d7f4f4f3f07bdffa1a3e9`
This is a working candidate branched from the B6 candidate before its squash merge. It must be rebased/reconstructed on the new main head before opening a release PR; do not merge this branch as-is because it predates the B6 squash merge.

B6 Ring inspection PR #28 has now been merged as `1322214233dd98e73efb6c1e7b657ea374825fef`. Its exact-head browser workflow `41358020122` passed: source/npm tests, Ring desktop/mobile playback, Chromium WebGL, Bree, Shire Road and B1 evidence. Public Pages publication and public smoke are still running at checkpoint time: `41359625333` and `41359625336`.

B7 source candidate adds:
- Four original low-cost meadow animals (two sheep and two rabbits) in bounded patches, with separate grazing/foraging/hopping/rest routines.
- A 24-hour day/night lighting controller with morning, noon, sunset and night palette/sun transitions.
- Ambient sound mix changes at night (reduced birds and soft night ambience).
- Source-level tests for animal bounds, day-cycle continuity and Babylon light application.

B7 has not yet passed exact-head CI or browser visual playback. A dedicated desktop/mobile test and workflow trigger were being prepared but were not committed; do not claim B7 acceptance. The new B7 work is unmerged and does not affect the original Pages link.

Next:
1. Reconstruct this B7 source delta on top of the new main SHA after B6 merge.
2. Add exact-head Chromium desktop/mobile screenshots for morning, sunset and night; verify four animals and night resting.
3. Run npm ci, syntax and all tests; fix any failures.
4. Review actual raster artifacts for animal proportions, shadows, foliage/house collisions and mobile HUD.
5. Only then open B7 PR; preserve the existing Pages URL.
6. Continue B6 hero-art acceptance and later B8–B10; physical phone/low-end PC FPS still requires real-device testing.

Permanent game URL: https://4youbabee-tech.github.io/shire-journey-3d/
