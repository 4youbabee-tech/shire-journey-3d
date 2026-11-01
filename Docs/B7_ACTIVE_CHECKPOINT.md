# B7 active checkpoint — 2026-11-02

Latest source commit: 8835c5a1239a379d1163b8fff21dc0f3caca0996
PR #29: https://github.com/4youbabee-tech/shire-journey-3d/pull/29
Exact-head workflow: https://github.com/4youbabee-tech/shire-journey-3d/actions/runs/41363112185

Latest repair: the combined one-draw-call fauna mesh now initializes dynamic position and normal vertex buffers before animation updates. The preceding run failed because the merged geometry's position buffer was not dynamic, so updateVerticesData did not alter the geometry. The native test now checks the changed vertex buffer. Exact-head B7 plus regression jobs are currently in progress. Do not merge until all are green and visual artifacts reviewed.

Main remains at B6 merge SHA 1322214233dd98e73efb6c1e7b657ea374825fef. Public Pages link remains https://4youbabee-tech.github.io/shire-journey-3d/

Still open and not implemented/accepted as final: B6 full hero art visual polish; B8 Weathertop complete playable region; B9 Rivendell playable region/council; B10 onward campaign; full end-to-end campaign, save/reload acceptance; real low-end phone and PC performance test. This project is NOT final yet.
