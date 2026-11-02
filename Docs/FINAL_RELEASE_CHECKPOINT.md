# Shire Journey — final release checkpoint (2026-11-02)

## Latest merged production state
- Main: `12be632e84650b3225ab026aa3e48212eb6e89cb`
- B6 Ring inspection: merged and tested.
- B7 Living Shire: PR #29 merged as `12be632e84650b3225ab026aa3e48212eb6e89cb`.
- B7 exact candidate run `41363150632`: Bree, Ring, Shire Road, Living World and B1 evidence jobs passed; Chromium WebGL was the last running job at the time of merge. A separate newer exact-main validation/deployment workflow `41364474697` and Browser QA `41364474698` are running.
- Public URL remains: https://4youbabee-tech.github.io/shire-journey-3d/

## What is playable in the merged production branch
- Shire opening, Bag End interior, original birthday sequence and Ring handoff/revelation.
- Frodo/Sam departure and road encounters, Black Rider stealth refuge, Bucklebury ferry and Bree/Prancing Pony with innkeeper, Strider, room/rest task.
- B6 Ring inspection interaction.
- B7 four meadow animals, bounded movement, day/night lighting and day-aware ambience.

## Visual QA evidence
- B7 desktop/mobile morning, sunset and night captures and videos: Actions artifact `13105448958`, run `41363150632`. Report says PASS for both viewports; environment is Chromium SwiftShader, not physical-device FPS.
- B1 golden reference evidence: artifact `13106550498`, run `41363150632`. These are QA renders, not owner-approved final art.
- Owner visual references remain under `Docs/References`.

## Not final yet — do not claim full campaign completion
- B6 hero/cast visual polish is not accepted against owner images.
- B8 Weathertop is not implemented as a complete playable encounter.
- B9 Rivendell / Council is not implemented.
- B10 Moria, Lothlórien, Amon Hen and later campaign are not implemented.
- Full campaign end-to-end save/reload acceptance is not complete.
- Physical Android phone and low-end PC FPS have not been measured.
- The latest public deployment must be verified against the exact main SHA after Actions `41364474697` completes.

## Next ordered execution
1. Verify Actions 41364474697 and 41364474698; confirm Pages build-info serves main SHA above.
2. Build B8 Weathertop as a real walkable, saved, tested encounter.
3. Build B9 Rivendell and Council with character/story gates.
4. Build B10 onward as connected playable regions, not still images.
5. Run full campaign playback and mobile/desktop screenshots; inspect artifacts.
6. Owner tests the published URL on actual phone and low-end PC; tune adaptive quality from recorded measurements.
7. Only then tag and announce the final release.

Do not replace the existing permanent URL or overwrite user saves without migration.

## Mobile control update — 2026-11-02
A dedicated hold-to-sprint touch button is being added beside (above) the movement joystick. Desktop Shift remains supported. The touch control must release on pointer-up/cancel and browser focus loss; mobile browser QA compares actual walking and sprint distance over equal timed joystick movement. Do not merge until exact-head browser QA passes.
