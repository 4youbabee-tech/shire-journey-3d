# B5 implementation checkpoint

Base: B4 candidate `650529eea2d8cc558f3ecd7afb7b661cd7207ded`, PR #26; exact-head run `41351147934` still awaiting full Chromium completion at this receipt. B1–B3 merged. B4 native tests, road playback and paired golden CI passed; do not merge until remaining Chromium and visual review pass.

New B5 source modules: `dist/bree.mjs`, `dist/bree-state.mjs`, `dist/town-resident.mjs`. Original 13-building town, square, gates, market, well, lamps; Prancing Pony exterior emblem and furnished interior with hearth, pantry, tables, chairs, wash basin and two bedrooms; six independent low-cost articulated residents; range-gated lodging/warning/rest progression. Three native tests pass, including actual collision walking along the town street to the inn, interior/exterior switching and resumed location.

These modules are NOT yet connected to the live road controller or save schema. They are source work in progress, not an accepted B5 release. Next: connect closed Bree gate to lazy region activation; restore road/Bree location and task with migration; reset travelling companions and camera on transitions; map and interior audio; Chromium recordings on both viewports; full earlier regression suite; review lighting, materials, collisions and budgets. Verify disposal and repeat transition stability.

The three new owner images are approximate direction documented in OWNER_VISUAL_REFERENCES.md. No exact recreation or real-device performance acceptance is implied. B6–B10 remain open.
