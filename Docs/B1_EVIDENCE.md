# B1 evidence tooling

No visual assets, lighting, layout, animation, dialogue or camera behavior in the public game are changed. Only `game.mjs` gains an exact `perf=1` lazy import after boot. Ordinary URLs do not request either performance module. Existing assets and files are retained.

## Reference captures

Run `node tests/golden-shots.mjs` with Playwright 1.56.1 Chromium installed. Optional `QA_DIST`, `QA_OUT` and `EXPECTED_COMMIT_SHA` select source/output and enforce build identity. The runner serves a test-only harness; it is never in `dist`. Cameras are versioned in `tests/golden-camera-manifest.mjs`. Fixed poses and camera coordinates are written into `golden-report.json` with each PNG SHA256.

The `b1-evidence` Actions job checks out immutable 0.14.1 commit `9779857b1a7d802980056ecff3ed4048954e7881` separately and reconstructs its sealed assets with `npm ci`. It captures both that reference and the candidate with the same harness and cameras. `b1-comparison.png` pairs each real reference image with its candidate. No generated picture is used as evidence. An owner-supplied concept may guide later artwork; it is not a pixel-identical acceptance target for the existing assets.

Artifacts have 90-day Actions retention. Download/preserve them before expiration. The immutable source SHA and camera script make recapture possible; artifact existence is not permanent archival storage.

## Physical-device recording

Open the permanent game URL with `?perf=1`, enter the game, press **ابدأ القياس**, then walk for five active minutes. Menus, dialogue, cinematics and hidden-tab intervals pause counting. Genuine active stalls remain in the frame intervals; no simulation clamp is applied. The page downloads JSON at completion. **إيقاف وتصدير JSON** stops early and marks `completed:false`; press again to download the same report if automatic download was blocked.

Median FPS = 1000 / median frame ms. Low 5% FPS = 1000 / p95 frame ms. The report also provides mean slowest-5% FPS, active duration, completion, draw-call/active-triangle median/p95/max, estimated unique-texture MB, GPU, UA, canvas size, build SHA, optional device label and boot-ready time. Texture dimensions assume RGBA8 plus mipmaps/faces, so compressed/HDR allocations can differ. Resource byte totals are timing entries; missing/cross-origin byte sizes are counted explicitly. These are not a claim that G5 is met.

`tests/perf-playback.mjs` proves the opt-in exclusion and JSON download using an intentionally partial automated recording. This must never be reported as a five-minute phone result. Source tests cover known frame pacing, real stalls, excluded pauses and the 300000ms completion deadline.

## Pending acceptance

See `FILM_MATCH_MATRIX.md` for the complete current ledger. Owner visual acceptance, phone measurements, full screenplay/book reconciliation and PROJECT_GOVERNOR resolution remain pending. Do not label B1 fully accepted or the film world complete from a passing CI run.
