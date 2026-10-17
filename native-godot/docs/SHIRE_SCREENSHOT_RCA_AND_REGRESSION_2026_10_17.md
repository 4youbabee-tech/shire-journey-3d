# Shire Screenshot Failure RCA — October 17, 2026

## Failure
Runs 39018356668 and 39019179613 failed the strict in-engine exterior screenshot
gate: Hobbiton had 11 distinct sampled color tiles, below the required 14. Bag End
and cottage passed. The visual gate remained meaningful; it was not disabled.

## Underlying capture fragility
The capture harness photographed Frodo's third-person gameplay camera. This camera
uses reactive collision/spring-arm positioning and can end up behind near world
geometry after new houses, fences and foliage are added. Moving Frodo once did not
solve the regression, proving a single preselected gameplay camera pose is brittle.

## Root-oriented solution
- Isolate photography in a dedicated high spectator Camera3D, independent of
  player camera collision and physics.
- Collect five fixed world-space vantage photos across Bag End, Party Field, market,
  mill and high ridge from the real running Godot scene.
- Strictly reject any flat candidate and choose the passing photo with the most
  distinct color tiles. Fail closed if all views fail; never create or substitute
  synthetic scenes to make production QA green.
- Always upload actual unselected diagnostic PNGs before pixel QA, even when the
  gate fails, so maintainers can inspect geometry and camera occlusion.
- Unit-test rejected flat images, mixed candidate selection, insufficient samples
  and defective interior frames; preserve the original 12/45/14 acceptance thresholds.

These are machine-visibility tests, NOT artistic/AAA, gameplay performance or device
acceptance. A passing result requires an exact-head Godot build.
