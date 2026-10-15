# High-production gate v0.9

Shire Journey is shifting toward a high-fidelity world (Witcher 3 is an artistic ambition, **not** current technical equivalence). Optional Windows EXE is a packaging/platform decision, not a graphics enhancement.

## Actual local deliverables

- `tools/validate_gltf_assets.py`: independently implemented glTF 2.0/GLB structural and asset-budget validator.
- `tests/test_asset_gate.py`: 6 automated tests, all passed.
- `production/asset_manifest.json`: target assets and budgets for Frodo, Sam, Gandalf, Bag End exterior, oak LOD0.
- `production/asset_audit.json`: current result **BLOCKED: 0/5 required high-quality assets present**.
- `production/PRODUCTION_GATE_AR.md`: Arabic art and technical quality gate.

These files are currently in the downloadable v0.9 *pipeline* archive in the conversation, **not yet synchronized as executable game code on GitHub**. This commit documents status only.

## Production decision

Keep v0.8 WebGL as a playable reference while investigating a production-grade asset renderer / Godot Windows-export route. No EXE has been built. Require actual rigged characters, PBR materials, realistic environment assets and tested optimization (i7 gen 6 / 8GB RAM / 2GB VRAM), then validate with real in-engine screenshots and target PC FPS.

The separate `fellowship-personal-game` repository is not involved.
