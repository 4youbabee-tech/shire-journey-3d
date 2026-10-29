# Shire Journey — Mobile cinematic production roadmap

## Owner contract and sources
Build the existing playable GitHub Pages browser game; do not restart, use Lovable, or assume Unreal imports. The owner wants the assistant to independently remember all required story beats, people, props, environmental life, audio, mobile UI and visuals without repeated prompts. Keep one active runtime writer; check exact main, PRs and Actions each iteration. No spending without separate approval. Never copy film screenplay dialogue, actor performances or copyrighted scores.

Authoritative references: supplied 00 Project Rules, 01 Story & Timeline, 02 Characters, 03 World, 06 Gameplay, 07 Mission Matrix, 10 Visual Asset Atlas and source Tolkien text. Keep film's causal order, original playable dialogue and canonical outcomes. Never conflate an original side errand with a film scene.

## Ordered tasks and acceptance (one live session / cohesive PR at a time)

| ID | Deliverable a player can experience | Status |
|---|---|---|
| P00 | Published 0.3.0: expanded Hobbiton, map, original Gandalf-cart cinematic | ACCEPTED, commit bf57bb3, Pages 40774862501 and Chromium 40774865147 PASS |
| P01 | Phone UI fits 360–390 px, dialogue fully readable, original music starts on Start tap, high-first adaptive quality | PASS on 0.4.0 main a09e42e; Chromium 40874619398 / 40875240699; 360px layout regression added to next exact-head QA |
| P02 | Walk through Bag End green door; furnished 3D interior with books, chairs, fireplace, room interactions and safe exit/save | FUNCTIONAL PASS on 0.4.0; cozy art / phone interior screenshot under visual QA this PR |
| P03 | Film-causal Shire: greet Gandalf, Bilbo and Sam preparation, Birthday party with original fireworks and family reactions | 0.5.0 main dd4eb5b: exact-head Node 22/22 and Chromium 40880096214 PASS; Pages 40880096111 PASS; physical device and film-level visual acceptance not claimed |
| P04 | Art upgrade of Bilbo/Frodo/Sam/Gandalf, full skinning and expressive original rigs, clothing and body/face animations | 0.5.1 PARTIAL SOURCE CANDIDATE: 4 attached procedural facial rigs / blink / talk / cheer, pending exact-head CI + visual review. Full skinning and new production outfits still missing |
| P05 | Lively villages: Merry, Pippin, Rosie, original villagers, gardening, carts, food, animation scheduling, interior/exterior life | AFTER P04 |
| P06 | F1-02 Shadow of the Past: Bag End ring story, packing with Sam, Frodo departs; authored cinema and checkpoint | AFTER P05 |
| P07 | F1-03 Shire road: friends join, Black Riders, forest hiding and ferry escape stealth | AFTER P06 |
| P08 | F1-04 Bree, Prancing Pony, Aragorn and Black Rider threat, Weathertop handoff | AFTER P07 |
| P09 | Storyline continuation from Rivendell according to 01/07, phased production | AFTER P08 |
| P10 | Final art/audio, quest, camera, mobile input and physical-device FPS acceptance | Iterative plus final gate |

Each task requires actual tested scene, screenshots desktop/mobile, safe quest/save/collision, exact-HEAD PASS and GitHub Pages update. Never label code-only work as visual or device acceptance.

## Technical decision
Keep Babylon.js/WebGL as stable browser baseline, optionally detect WebGPU later but do not require it while cross-browser support is limited. Art target: distinctive hand-painted/storybook look using licensed or original rigged glTF, LOD, instanced foliage, packed PBR/KTX2 textures where sensible; avoid high poly with no benefit. For mobile hardware 30 FPS is a measured target, not a promise; adaptive drawing resolution/shadows should gracefully trade expensive effects before playability. Music may begin only after a user tap due to Chrome's Web Audio policies.

References: https://www.babylonjs.com/specifications/ ; https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API ; https://developer.chrome.com/blog/autoplay ; https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md

## Working memory for later agents
Do not make the user repeat: Shire should be large, beautiful, populated, navigable, with places to enter; recognizable original-looking characters (not comical blocks); Arabic dialogue tied to story, voices, pastoral ambience and original automatic music; party must happen before the Ring investigation, Black Riders must appear on the road before Bree, Aragorn belongs in Bree/after, not Shire. Check each new shot for occluded doors, tree canopies, clipping interfaces, wasted GPU draws, and mobile thumb usability.

## Next action
Inspect latest main and active PRs; select earliest unaccepted P-step. Do real implementation then tests/QA, not new paperwork. On failure diagnose root cause, fix a coherent batch, rerun exact SHA. Do not merge or launch a parallel writer while an earlier PR is active.
