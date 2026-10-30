# 0.9.0 opening-region asset receipt

This receipt describes the current 0.9 production payload; release verification is recorded in CURRENT_PROJECT_STATE.md and the PR checks. No film recordings, score, actor likenesses or paid-provider generation were used. All runtime files are served by the existing repository; no third-party runtime URLs or credentials. The original meadow bitmap was authored with the available built-in image generation tool; see GROUND_TEXTURE_PROVENANCE.md.

## Characters

Four authored natural-proportion roles use Quaternius Universal Base Characters, Modular Character Outfits — Fantasy and Universal Animation Library, CC0. Each has a 65-bone skeleton and 12 clips, anatomical textured face, eyelid/gaze/expression morphs, original role clothing and hair; Gandalf has a weighted robe, seated corrective drape and hand-following staff. These replace the rejected KayKit derivatives; the runtime does not load the older traveller/wizard models. Eight villagers/player roles reuse the four reviewed assets, each below 2.1MB. Source archive hashes, reproduction commands and original licence texts are in IMPORTED_CHARACTER_ASSETS.md and scripts/character-data/QUATERNIUS-LICENSES.txt. Exact current payload hashes live in scripts/character-data/manifest.json. Four original trowels are generated in garden-tools.mjs and follow imported palm frames.

## Horse

Quaternius, Ultimate Animated Animals, https://quaternius.com/packs/ultimateanimatedanimals.html . Official pack Drive folder 1uJ3N5HfB7jKTseJUNQr3N4YaN0UuEtHk; Horse.gltf file 1hbtY8kxnXiPdwYGVY7rWRgU0jl_-Q-LG. Explicit CC0 license file 1F2uy8T2fRpdc6gZ4mnS02_C2E63WvKtn retained as dist/assets/characters/QUATERNIUS-LICENSE.txt. Derivative keeps Idle/Walk/Eating, removes unrelated clips, prunes/deduplicates. Rigged horse replaces the procedural pony in browser runtime. Height 2.12 world units; source facing verified in real WebGL images.

## Nature

Quaternius, Ultimate Stylized Nature, https://quaternius.com/packs/ultimatestylizednature.html . Official pack Drive folder 1IV3bXHzkNvuNWFHPi4KPx-G4ghuxIuT-, glTF folder 1-ob9Aade1RIM3A_XKoQAOG6XqF2IDAIC. Selected MapleTree_1 / MapleTree_3 / Grass_Small / Flower_2_Clump, with bark/leaves/grass/flower images. Official page declares CC0. Folder license 1W3YGLar9Ie0Lwfw7QJv1x8oBLKFPuOkW also declares CC0 but its heading says Ultimate Platformer Pack; this source inconsistency is recorded, not silently corrected. Unmodified license retained beside runtime assets.

512px bark/leaves, 256px grass/flowers. Large normal maps omitted. Leaves recolored from autumn to summer, alpha-tested at .45 instead of blended, roughness .95. Four standalone GLBs total <800KB, using shared Babylon instances. Sixteen original tree collision anchors remain; 80 understory clusters and up to 220 roadside instances soften the existing paths. Placement respects cached static blocker bounds and actor clearance. No new collision/pathfinding authority. Exact payload hashes in scripts/environment-data/manifest.json. Reproduction: place official source files in /tmp/shire-nature-source, run review-nature-textures.py once on originals then prepare-nature-source.mjs (glTF Transform 4.2.1).

## Original music

Original 51-second harp/flute composition authored in scripts/compose-original-score.py. Sources are real recorded CC0 VSCO-2 Community Edition samples, Sam Gossner / Simon Dalzell; cutting contributions Elan Hickler / Soundemote. https://github.com/sgossner/VSCO-2-CE , source tree 440300901dfe9275fd84e0b7763af1f8443ae62e.

- Strings/Harp/KSHarp_D4_mf.wav: 1,921,690 bytes; verified Git blob 342eec5072e2c0a7fb7cb03b6f5b46d84ed6ac69.
- Woodwinds/Flute/susNV/LDFlute_susNV_C5_v1_1.wav: 2,491,416 bytes; verified Git blob 093129d6a876ce5f004279b2979894d0ed637a8d.

CC0 text retained as dist/assets/audio/VSCO-LICENSE.txt. Encode composer WAV with ffmpeg libmp3lame 96kbps, 22050Hz stereo. Output 613,191 bytes, SHA256 in scripts/audio-data/manifest.json. WebAudio decodes only after user interaction; separate master/music/effects controls retained. The audio decoder and duration are tested; physical-device listening is a separate acceptance gate.

## Recorded ambience and footsteps

Four Kenney CC0 contact variants total 10,831 bytes; adjacent contacts avoid the same buffer and use different filtering for soil/wood. The TinyWorlds CC0 forest derivative is a 43,601-byte mono MP3; varied excerpts, rate/pan and fades mix over the wind bed. Explicit pinned mirror acquisition, source/derivative hashes and licence evidence are in FOOTSTEP_ASSET_PROVENANCE.md, the runtime credit files and scripts/audio-data/*-receipt.json. All five recordings decode once after the user's Start gesture. Wind and cart/hoof fallback impacts remain generated audio; no recorded horse/cart fidelity is claimed.

## Delivery integrity

All reviewed binaries are losslessly gzip/base64 chunked (<600001 characters per part) and reconstructed at npm ci. Exact length/SHA256/header/buffer bounds are checked. Skinned assets additionally require skin weights and named clips; animation channel sampler/node references are validated. Static nature assets have a distinct manifest kind and do not bypass binary integrity checks. Rollback is reverting the candidate branch; save schema/key remain unchanged.
