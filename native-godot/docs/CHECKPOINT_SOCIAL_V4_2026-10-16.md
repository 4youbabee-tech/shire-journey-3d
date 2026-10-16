# Shire Journey - Social World checkpoint 4

## Actual implementation
- Added `scripts/shire_social.gd`, offline deterministic English/Arabic dialogue profiles for primary characters and varied supporting villagers, context-aware weather/day/stage responses, and support for friendship, rumours, place directions and neighbour assistance.
- Added in-world landmark discoveries (Bag End, Party Field, Market, Watermill, Bridge, Fields, Eastern Road). Discoveries and goodwill persist inside save schema 2 using a new optional `social` field, keeping existing saves loadable.
- Added local favour ledger and journal entries (up to 100). Narrative progression remains gated by the existing stage logic; no AI fabricates story outcomes.
- Added native social smoke test `ci/social_smoke.gd` to exercise the behaviour in Godot.

## Verification
- Existing offline integrity validator: 101 PASS / 0 FAIL on local source archive.
- Native Godot and Windows runs must pass CI separately before claiming a runnable v4 build. The scene art still uses proxy character meshes; no rigged facial animation or cinematic photorealism is claimed.

## Continuation
- Perform real Godot import and Windows headless smoke with `ci/social_smoke.gd`.
- Add dense crafted interiors, meaningful village ambient animations, and fully rigged art with license records. Profile target Windows 2 GB VRAM at 720p, not software CI FPS.
- The Hobbiton set is a focused Shire chapter, not a complete Middle-earth world.