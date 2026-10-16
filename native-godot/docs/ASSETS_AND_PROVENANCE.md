# Asset provenance and rights

All `.glb` meshes shipped in `assets/models` were created by `scripts/generate_models.py` for this project using parametric original geometry. The textures/materials are authored vertex colours (no textures extracted from The Lord of the Rings films).

`shire_birds_original.ogg` and `river_original.ogg` are entirely synthetic audio produced by `scripts/generate_audio.py`, with no film music or copyrighted recordings.

External candidate assets investigated but **NOT included and NOT represented as imported**:
- Quaternius Stylized Nature MegaKit (CC0): https://quaternius.com/packs/stylizednaturemegakit.html
- Quaternius Ultimate Stylized Nature Pack (CC0): https://quaternius.com/packs/ultimatestylizednature.html
- Kenney Nature Kit (CC0): https://kenney.nl/assets/nature-kit

User-supplied source PDFs and film scripts are strictly local references and must never be added to a public GitHub repo or release.

## Native 2026-10-16 atmospheric upgrade

Four 512x512 original project-generated JPEG material maps (grass/path albedo/normal) are authored by `scripts/make_pbr_ground.py` and included with checksums in `assets/manifest.json`. These are procedural artistic textures, **not photographic scans**. They do not by themselves achieve Witcher 3-equivalent realism.

A custom project-generated 9-second OGG rain ambience is produced by `scripts/generate_rain.py`; no outside audio or recorded film material is used. Village chickens, rabbits, and butterflies and smoke particles are original parametric Godot meshes and particle systems authored in `scripts/shire_animal.gd` and `scripts/shire_world.gd`.

At the earlier atmosphere checkpoint, no external assets were yet bundled. **That historical limitation was superseded** by the verified CC0 Poly Haven Leafy Grass import documented below.

## REAL CC0 MATERIAL IMPORT - 16 OCT 2026

Official Poly Haven Leafy Grass https://polyhaven.com/a/leafy_grass by Charlotte Baglioni; CC0 1.0.
Two 1K JPG textures were downloaded from the official `api.polyhaven.com/files/leafy_grass` endpoint and MD5-verified. For the limited-memory target, the *game material* references two optimized 512px derivatives checked into GitHub and recorded in `assets/manifest.json`. Original 1K files and their official MD5 are preserved in this source ZIP and in the source metadata JSON; the separate import workflow can regenerate and verify the originals. The project now uses verified external scanned grass **in-engine**. Credit: Powered by Poly Haven (build-time API used).

This asset is a photographic scan (diffuse + normal), while all previous procedural GLB objects remain relatively stylised. Full photorealistic world and rigged characters are not yet achieved.