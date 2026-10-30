# 0.9.0 production candidate — authored cast and opening-region polish

Prior integrated 4f46eee6bd41f81248114e0927db685a37c79d03 Actions 41099937846 PASS: source, desktop/touch gameplay and continuous opening; four packaged footstep buffers decoded. Artifact 12997642846 digest b8803c949096f1fe3beb92218aa06c57c77f3f1133c947e06965b1ee13d61d76. Reviewed its real JPEGs and chronological contact sheet. No physical-device performance claim: SwiftShader medians were 1 FPS desktop / 3 FPS touch emulation at adaptive resolution.

This cohort repairs the actual GLB wool albedos to standard sRGB. The attempted runtime gamma flag did not visibly fix the result; it is removed. scripts/repair-linear-wool.py admits only the four reviewed legacy payload hashes and preserves every non-wool buffer view byte-for-byte. Corrected asset receipts retain original input hashes and image means; the Blender authoring script now encodes future wool tiles correctly. Gandalf's woven wool mean changes from about 45/51/51 to 116/123/123 bytes, while skin/eyes/geometry/rig/animation data stay unchanged.

Other integrated work: original 512px sage meadow texture, continuous Frodo heading while approaching/boarding, leather harness/reins and cart footboard, a close conversation inspection of Frodo, and four original concave gardening tools following actual imported palm joints. Tool alignment is verified under parent/hand rotation; the LH look-direction convention required a corrected forward axis, caught by the native test. NPC tools are stowed during conversation/celebration. A licensed TinyWorlds forest clip now supplies varied excerpts with gentle pan/fades over the procedural wind; the old chirps remain only a decode fallback. See audio credits and sealed receipts for the explicit mirror chain.

Shipped GLB-only boot now creates actor roots/joints directly instead of allocating and discarding the legacy procedural body meshes. Native validation with deferred nature: 210 to 84 initial meshes and 600560 to 349780 initial triangles; all actor positions, scales, joint locations, worker schedules and static collider counts match. These are startup allocation counts in NullEngine, not GPU/FPS measurements.

Local source and asset validation: 53 tests PASS, with syntax checks. Exact-head CI/raster/recording verification remains the release gate for this source cohort. Save schema, canonical NPC locations and F1-01 outcomes remain unchanged. Later film windows and physical device acceptance remain separately tracked in the roadmap; do not interpret a version tag or technical test as a finished-game declaration.

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
