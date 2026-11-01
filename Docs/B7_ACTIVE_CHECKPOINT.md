# B7 active checkpoint — 2026-11-02

Branch: `production/b7-living-world-02`
Source commit: `9c08e303158f815b03fdd64333754d4d897a69e6`
Base: post-B6 main `1322214233dd98e73efb6c1e7b657ea374825fef`

B6 Ring inspection was merged as 1322214233dd98e73efb6c1e7b657ea374825fef. Exact-head CI run 41358020122 passed all jobs, including Ring desktop/mobile playback, Chromium WebGL, Bree, Shire Road and B1 evidence.

B7 candidate now adds:
- Four original meadow animals (two sheep, two rabbits), each with three merged meshes and no gameplay colliders.
- Bounded grazing/foraging/hopping routines and night rest.
- 24-hour day/night lighting, sky/fog/ambient/sun changes and Arabic time-of-day HUD label.
- Daylight-aware ambient sound: birds reduce at night.
- Native Babylon tests and desktop/mobile Chromium captures for morning, sunset and night.

B7 is committed but not accepted yet. Open a PR to main, run exact-head npm/source and Chromium tests, inspect the images and confirm no regressions to B6/Bree/road. No public deployment until all gates pass.
The existing game URL remains https://4youbabee-tech.github.io/shire-journey-3d/

Still outstanding after B7: full B6 hero art and story visual acceptance, richer NPC schedules/social behaviors, B8 Weathertop, B9 Rivendell, B10 remaining campaign, target phone/low-end PC performance and final full-route acceptance. Do not call the game complete until these are playable and tested.
