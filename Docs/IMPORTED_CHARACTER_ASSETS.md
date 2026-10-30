# Natural Shire cast — 2026-10-30 working production cohort

Four distinct self-contained GLBs replace the rejected KayKit chibi bodies. This is a rebuild on the existing Babylon.js runtime, not a new project. Each has one 65-bone rig, 12 retargeted/authored clips, textured anatomical face, separate eyelid/eye controls, eyebrows, smile, gaze and role clothing. Hobbit bare feet and floor reading/stand-up are authored; Gandalf has a weighted robe, hat, beard and hand-following staff. Compatible non-morph geometry is merged; each asset has 4–5 meshes and is below 2.1MB. Authoritative binary hashes and byte lengths are in scripts/character-data/manifest.json; derivative receipts are alongside it.

Source: Quaternius Universal Base Characters, Modular Character Outfits — Fantasy, Universal Animation Library (all free Standard downloads). Official pages: https://quaternius.com/packs/universalbasecharacters.html , https://quaternius.com/packs/modularcharacteroutfitsfantasy.html , https://quaternius.com/packs/universalanimationlibrary.html . Archive license texts are copied verbatim to scripts/character-data/QUATERNIUS-LICENSES.txt: CC0 1.0, no film models, actor scans, film dialogue or score.

Downloaded archive SHA256:
- universalbasecharacters.zip: fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40
- modularcharacteroutfitsfantasy.zip: c3468b18871cc8c8f05ab14df7712baf22cb9f389cbd870babf130e595187f70
- universalanimationlibrary.zip: cc73fc4e495b82958207316596317a3f40b9fa38065bde1027937452da537724

Reproduce with Blender 4.5.15 LTS and scripts/build-natural-cast.py --sources UNPACKED_ARCHIVES --output RAW --role ROLE for each of frodo/sam/bilbo/gandalf; then @gltf-transform/core, functions and extensions 4.2.1 plus Pillow using node scripts/optimize-natural-cast.mjs RAW OPTIMIZED. Normal production npm ci reconstructs the sealed GLBs from committed compressed chunks without a third-party asset download. Source-image URI typos are repaired only in temporary staging. Texture budgets: face 1024, other maps 512; JPEG for opaque colors, alpha retained where used.

Runtime: semantic morph selection prevents cape drape being driven as a blink. Shader influence capacity is fixed before interaction to avoid blink-dependent recompilation. Weighted interrupted fades remain normalized; one-shots retain completion across distance pauses. Gait speed follows actual root travel. The cart stops for the greeting/boarding; wheel rotation follows physical distance, and passenger hips align to the front bench after animation evaluation. First-story control begins beside Gandalf; replay preserves the saved position. Conversation camera brings actual 3D faces into view.

Source validation: 48 Node tests PASS, including complete binary/skin/animation integrity for every asset, morph capacity through full blinking, crossfade interruption, one-shot pause/resume, boarding continuity and story/save gates. Blender previews are authoring evidence only. Exact-head WebGL rendering/video must be inspected before merging this working cohort. No physical-device FPS is inferred from NullEngine, Blender or CI SwiftShader.

Historical asset records below describe superseded derivatives.

# 0.9.0-dev current derivative manifest

Current authoritative sizes/hashes: scripts/character-data/manifest.json. Ten retained clips including chair sitting, actual blink morph, reduced head proportions and authored staff replace previous 0.8 derivative hashes listed historically below. Horse source/license receipts are in QUALITY_CANDIDATE_ASSETS.md. Shared traveller faces and seated rigid-robe intersections remain unaccepted; no final art claim.

# Imported character assets — 0.8.0

Author: Kay Lousberg / KayKit. Pack: Character Pack Adventures 1.0.
Official source: https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0
License: CC0 1.0 Universal, https://creativecommons.org/publicdomain/zero/1.0/
Original models: Rogue.glb and Mage.glb. No film models or actor likenesses.
Runtime derivatives: traveller.glb and wizard.glb. Removed weapon geometry, retained 9 locomotion/interaction/rest clips, prune/dedup/resample using glTF Transform. Original source downloads remain outside runtime. Loading uses pinned Babylon.js loaders 9.32.1, served locally.

These are stylized game representations. One traveller rig is shared visually by the hobbit/villager roles; distinct screen-accurate costumes/faces are not claimed. The authored skin and animation clips replace procedural limb articulation in the visible models, while collision and narrative roots remain unchanged.

traveller.glb: SHA256 a29ce12fa455595f2f5f7c7822e5ff22ba453246649c5ddbf0f80dba4ee1dfeb, 2356472 bytes
wizard.glb: SHA256 c89764992fb6332cb5b2ca50e776d3aba1c1f5f7fd7b597e56ae86354ba49b90, 2372816 bytes

Recovery source pinned to upstream tree 672074b73ba276876a19e8816ecdc5241817ab47. Rogue source Git blob c8827661105eef7b2bfbef3bc676d41a47625733; Mage c89f19f6e707f6e07e4632a08876bd6d0172b082. Current derivatives retain original embedded atlas (1024px source); role override atlases are 256px. Added original continuous Gandalf beard and folded robe, attached to existing joints. All accessories follow the imported rig; robe is rigid to hips, not cloth simulation.

The original PR binary upload was truncated; current source of truth is scripts/character-data/manifest.json plus lossless compressed .b64 parts. prepare-characters.mjs builds standalone runtime GLBs before test/package, without network. Checksum and structural failures stop the build. To reproduce geometry, install @gltf-transform/core and @gltf-transform/functions 4.2.1 temporarily and supply official Rogue/Mage files at the paths specified in scripts/optimize-characters.mjs. Generated GLBs are excluded from git; archive chunks are the exact reviewed production payload.
