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

Poly Haven's CC0 API was researched (https://polyhaven.com/our-api), but **no Poly Haven or third-party visual assets are bundled in this checkpoint**. External rights and import will be tracked separately when verified locally and in-engine.