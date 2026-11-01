# B7 checkpoint — 2026-11-02, single-draw-call fauna repair

Latest source commit: d58e65c34278c61122e6ddeb867c3a434a0e986f
PR #29: https://github.com/4youbabee-tech/shire-journey-3d/pull/29
Exact-head checks: https://github.com/4youbabee-tech/shire-journey-3d/actions/runs/41362696134

The earlier B7 attempts failed the strict scene mesh budget. The latest implementation combines all four animals (two sheep, two rabbits) into one merged geometry/draw call, preserving separate vertex-coloured silhouettes and applying per-animal movement/rotation by updating only their vertex ranges. It also moves the meadow patch to a clear open area and tests the combined mesh animation.
The browser test now checks that night daylight and sun intensity fall below the dusk values, not merely that the time label changes.
Wait for exact-head CI and review screenshot/video artifacts before merge. No deployment has been triggered; production main and Pages URL are unchanged.
B6 merged SHA: 1322214233dd98e73efb6c1e7b657ea374825fef.
Permanent URL: https://4youbabee-tech.github.io/shire-journey-3d/

Open final campaign scope: B6 hero visual acceptance, B8 Weathertop, B9 Rivendell, B10 later campaign, full-route acceptance, physical low-end phone/PC performance. Do not mark complete until playable and validated.
