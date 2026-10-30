# Unpublished 0.9.0-dev asset receipt

This is an internal production candidate, not an accepted release. No film recordings, score, actor likenesses or paid generation were used. All runtime files are served by the existing repository; no third-party runtime URLs or credentials.

## Characters

Kay Lousberg / KayKit Character Pack Adventures 1.0, CC0. Existing source pin and original Git blob receipts remain in IMPORTED_CHARACTER_ASSETS.md. Current derivatives add a real POSITION morph target for brief eyelid closure, smaller head proportions, chair-sit clip, authored crooked staff, and existing joint-attached beard/robe. Ten clips retained. Role palettes remain distinct but shared facial topology is still an open art gate. Robe is rigid to hips; seated cloth intersections need further authoring. Current exact derivative hashes live in scripts/character-data/manifest.json.

## Horse

Quaternius, Ultimate Animated Animals, https://quaternius.com/packs/ultimateanimatedanimals.html . Official pack Drive folder 1uJ3N5HfB7jKTseJUNQr3N4YaN0UuEtHk; Horse.gltf file 1hbtY8kxnXiPdwYGVY7rWRgU0jl_-Q-LG. Explicit CC0 license file 1F2uy8T2fRpdc6gZ4mnS02_C2E63WvKtn retained as dist/assets/characters/QUATERNIUS-LICENSE.txt. Derivative keeps Idle/Walk/Eating, removes unrelated clips, prunes/deduplicates. Rigged horse replaces the procedural pony in browser runtime. Height 2.12 world units; source facing verified in real WebGL images.

## Nature

Quaternius, Ultimate Stylized Nature, https://quaternius.com/packs/ultimatestylizednature.html . Official pack Drive folder 1IV3bXHzkNvuNWFHPi4KPx-G4ghuxIuT-, glTF folder 1-ob9Aade1RIM3A_XKoQAOG6XqF2IDAIC. Selected MapleTree_1 / MapleTree_3 / Grass_Small / Flower_2_Clump, with bark/leaves/grass/flower images. Official page declares CC0. Folder license 1W3YGLar9Ie0Lwfw7QJv1x8oBLKFPuOkW also declares CC0 but its heading says Ultimate Platformer Pack; this source inconsistency is recorded, not silently corrected. Unmodified license retained beside runtime assets.

512px bark/leaves, 256px grass/flowers. Large normal maps omitted. Leaves recolored from autumn to summer, alpha-tested at .45 instead of blended, roughness .95. Four standalone GLBs total <800KB, using shared Babylon instances. Sixteen original tree collision anchors remain; 80 sparse understory clusters stay around those trees. No new collision/pathfinding authority. Exact payload hashes in scripts/environment-data/manifest.json. Reproduction: place official source files in /tmp/shire-nature-source, run review-nature-textures.py once on originals then prepare-nature-source.mjs (glTF Transform 4.2.1).

## Original music

Original 51-second harp/flute composition authored in scripts/compose-original-score.py. Sources are real recorded CC0 VSCO-2 Community Edition samples, Sam Gossner / Simon Dalzell; cutting contributions Elan Hickler / Soundemote. https://github.com/sgossner/VSCO-2-CE , source tree 440300901dfe9275fd84e0b7763af1f8443ae62e.

- Strings/Harp/KSHarp_D4_mf.wav: 1,921,690 bytes; verified Git blob 342eec5072e2c0a7fb7cb03b6f5b46d84ed6ac69.
- Woodwinds/Flute/susNV/LDFlute_susNV_C5_v1_1.wav: 2,491,416 bytes; verified Git blob 093129d6a876ce5f004279b2979894d0ed637a8d.

CC0 text retained as dist/assets/audio/VSCO-LICENSE.txt. Encode composer WAV with ffmpeg libmp3lame 96kbps, 22050Hz stereo. Output 613,191 bytes, SHA256 in scripts/audio-data/manifest.json. WebAudio decodes only after user interaction; separate master/music/effects controls retained. The audio decoder and duration are tested; listening acceptance on speakers/headphones is NOT RUN. Wind/birds/impact foley remain generated PCM; they are not falsely described as recordings.

## Delivery integrity

All reviewed binaries are losslessly gzip/base64 chunked (<600001 characters per part) and reconstructed at npm ci. Exact length/SHA256/header/buffer bounds are checked. Skinned assets additionally require skin weights and named clips; animation channel sampler/node references are validated. Static nature assets have a distinct manifest kind and do not bypass binary integrity checks. Rollback is reverting the candidate branch; save schema/key remain unchanged.
