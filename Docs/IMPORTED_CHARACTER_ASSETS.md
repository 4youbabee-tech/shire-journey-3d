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
