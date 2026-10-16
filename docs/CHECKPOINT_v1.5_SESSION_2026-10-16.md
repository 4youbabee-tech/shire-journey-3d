# Shire Journey v1.5 — Session checkpoint (2026-10-16)

This commit documents a **verified maintenance checkpoint**, not a finished high-fidelity production game.

## Actual source changes in downloadable checkpoint
- Reset Chapter I ending button label to **Continue to Bree — Chapter II**, including after returning from later chapters.
- Correct Bree end narrative to reflect the already-playable Weathertop Chapter III.
- Add `tools/test_chapter_labels.py` to exercise the Chapter I / II / I transition sequence.
- Add `tools/release_check.py` to validate offline HTML bundling, source inclusion, dialogue-without-typing policy, version text, and test evidence.
- Rebuild single-file HTML from modular source and prepare downloadable project ZIP, Arabic session report and Arabic handoff guide.

## Evidence from the v1.5 local session
- Shire: **26/26**
- Bree: **11/11**
- Weathertop: **16/16**
- Rivendell: **14/14**
- Authored NPC choice UI: **17/17**
- Chapter label regression: **4/4**
- Release integrity checks: **23/23**
- Chromium WebGL (Linux ANGLE SwiftShader software rendering): **passed; no JS errors**.
- ZIP archive integrity: **passed; 188 files**.

## Clear limits
- Real user GPU FPS **not measured**; CPU SwiftShader is not representative of the Windows target.
- No new PBR assets, rigged characters, full AI agent model, Witcher 3-level graphics, complete trilogy or Windows EXE were produced in this checkpoint.
- The complete v1.5 ZIP/HTML game artifacts are delivered in the conversation. **GitHub still does not host the full executable/source tree of this release**; this documentation commit does not imply a GitHub deployment.
- Separate `fellowship-personal-game` repo is untouched.

## Next validated milestones
1. Publish the audited playable source and separately licensed assets to `shire-journey-3d`.
2. Obtain/author and integrate PBR GLB asset set for the first polished Bag End scene.
3. Build/validate rigged Frodo/Sam with believable animation, look-at, facial cues.
4. Profile 720p 30-FPS target on i7 gen 6 / 8GB / 2GB-VRAM Windows hardware.
5. Continue scene expansion only after quality and performance benchmarks are backed by screenshots, tests and save-compatibility evidence.
