# Shire Journey — Permanent 3D Asset Source Register

Status: Source leads curated on 2026-10-17. This register lives **in the game's production GitHub repository** and survives future chats. URLs are leads, **not proof of re-use rights**. Every imported item must have an individual model URL, author, version, license, format, provenance and content hash.

## User-supplied sources (preserved verbatim)

| ID | Provider | User's link | Strongest likely use | Asset admission status |
|---|---|---|---|---|
| 01 | Sketchfab | https://sketchfab.com/search?q=lord+of+the+rings&type=models&features=downloadable&sort_by=-likeCount | High-detail mesh/PBR scouting; some rigs | **Per-model review**: CC license, attribution, copyrighted franchises; user-authenticated downloads only; no bulk scraping |
| 02 | CGTrader | https://www.cgtrader.com/3d-models?keywords=lord+of+the+rings | PBR architecture/furniture candidates | **Per-model purchase/license**; free ≠ free to redistribute; paid items require approval |
| 03 | Thangs | https://thangs.com/search/lord%20of%20the%20rings | Mostly printable props | **Per-model review**; printing licenses don't automatically authorize shipping the mesh in a game |
| 04 | Cults3D | https://cults3d.com/en/search?q=lord+of+the+rings | Printable ornament reference | **Restricted**: default CULTS Private Use prohibits redistributing the digital model; STL is often not game-ready |
| 05 | Printables | https://www.printables.com/search/models?q=lord+of+the+rings | Printable sculpt/reference leads | **Per-model license**, topology/UV/rig conversion needed |
| 06 | 3DExport | https://3dexport.com/3d-models?search=lord+of+the+rings | Purchased/game-ready FBX & Blender candidates | **Per-model license and author verification** |
| 07 | MakerWorld | https://makerworld.com/en/search/models?keyword=lord+of+the+rings | Printable objects/reference | **Per-model license**, optimized game topology usually missing |
| 08 | Meshy AI | https://www.meshy.ai/search?q=lord+of+the+rings | Original designs inspired by Shire (not character copies) | **License + generation rights + model QA**; no paid provider initiated |
| 09 | Steam Workshop | https://steamcommunity.com/workshop/browse/?appid=730&searchtext=lord+of+the+rings | Modding references only | **Do not ingest** ripped game assets without original rights-holder permission |
| 10 | Nexus Mods | https://www.nexusmods.com/search/?gsearch=lord+of+the+rings | Mod-community reference and process | **Do not ingest** converted third-party copyrighted assets without explicit independent rights |
| 11 | The Miniatures Page | https://theminiaturespage.com/boards/topic.mv?topic_id=1045643 | Sculpting community and leads | **Reference/discussion only** until specific creator license verified |
| 12 | Patreon — Steve Lund | https://www.patreon.com/stevelund | Creature rigs/production leads | **License and creator identity review** before asset use; paid access requires explicit consent |
| 13 | Patreon — sulsulzukohere | https://www.patreon.com/sulsulzukohere | Costume references | **No game-extracted armor imports** without IP rights |
| 14 | 0VRM Discord | https://discordbotlist.com/servers/0vrm | VRM rigging & tool support | **Community only**; server membership and downloads may need logged-in user access |
| 15 | LOTR: The Second Age Discord | https://discord.gg/hStFXEbcT4 | Tolkien fan production discussion | **Community only**; no blanket right to assets or film props |

### High-confidence alternative sources for the production pipeline

| Source | License | Use | Status |
|---|---|---|---|
| KayKit Character Pack Adventures — https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0 | CC0 | Existing imported, animated, skinned GLB protagonists; **stylized, not photorealistic** | **Integrated**, pinned to source revision `672074b73ba276876a19e8816ecdc5241817ab47` |
| KayKit Furniture Bits — https://github.com/KayKit-Game-Assets/KayKit-Furniture-Bits-1.0 | CC0 | Benches, cupboards, tables, stools, furniture interiors and market props | **Automated vendor pipeline** pinned to revision `96d5930a8dbdb363409bbc2d3341718b00e17c9c` |
| Kenney Furniture Kit — https://kenney.nl/assets/furniture-kit | CC0 | 140 interiors / furniture models | Approved lead, not yet imported |
| Kenney Nature Kit — https://kenney.nl/assets/nature-kit | CC0 | Trees, rocks, foliage (low-detail distant vegetation) | Approved lead, not yet imported |
| Quaternius Nature Pack — https://quaternius.com/packs/ultimatenature.html | CC0 per pack | Original outdoor flora/terrain props | Approved lead, not yet imported |
| KayKit Medieval Hexagon — https://github.com/KayKit-Game-Assets/KayKit-Medieval-Hexagon-Pack-1.0 | CC0 | Non-Tolkien-specific village props only, after scale/style check | Approved lead, not yet imported |

## Non-negotiable admission gates

1. Verify **the individual asset**'s rights; don't infer them from a free download, the site name, or personal/noncommercial intent.
2. Never redistribute ripped film/game assets, scanned actor faces, LOTR film score/voice recordings, or third-party model conversions of uncertain origin.
3. Verify origin, exact pinned revision, file hash, and GLB/glTF PBR structure; write a provenance receipt.
4. Limit mesh and material draw calls; art direction must stay consistent. **Stylized CC0 kits are transitional**, not photorealism or film likeness.
5. Test with Godot 4.4.1 import, scripted scene/smoke tests, Windows EXE export and visual screenshots.
6. No purchases, Patreon subscriptions, Meshy provider charges or Discord access are assumed or auto-authorized.
7. Prefer GLB (skinned + animations) for characters and GLB/glTF for world/props. Printable STL is not directly game-ready.
8. Keep an unmodified build candidate before upgrading its art assets.

This register is the single stable discovery starting point for future production work. It does not claim a model was downloaded until its admission record exists.
