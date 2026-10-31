# Ring legacy staging — production checkpoint

The birthday now continues into an in-world Bag End scene. A three-dimensional plain gold ring follows Bilbo's rigged hand, drops to the wooden floor, remains after his departure, is picked up by Frodo, and goes into Gandalf's envelope. A wax seal appears before the envelope is handed back. No fiery inscription or later revelation occurs in this F1-01 window.

Reference: the supplied Story and Timeline Bible, F1-01; Fellowship screenplay by Walsh, Boyens and Jackson (2001), printed pages 27–32. The dialogue captions and staging are original. No film recordings, music or dialogue are included.

Canonical completion is committed only after the scene or explicit skip. An interrupted pending-party save replays the whole sequence. Original actor positions, rotations, enabled states, exterior lighting and camera near plane/FOV are restored on both ending paths.

Native tests exercise hand/floor/envelope visibility and scene restoration. Browser playback records the natural scene and checks that the actual ring mesh is enabled. Browser visual acceptance is still required; native tests do not establish visual quality or target-device performance.

Completed old saves can replay the bequest from the journal without restarting. Afterward the sealed envelope remains visible on the writing desk when visiting Bag End. The Ring's drop triggers a single original decaying inharmonic PCM cue; indoor nature is attenuated with a short gain transition. Both replay paths restore the exterior camera immediately.

House collision follows the rendered roof and mound; legacy saves embedded there move to the nearest clear local point. Shrub collision is batched, and its broad aggregate bounds are excluded from roadside-plant placement so one vegetation collider cannot suppress the entire village's planting. Grass-covered home mounds reuse the original meadow image at a separate five-by-three texture scale.

Actual first-pass WebGL review (5cd1518, Actions 41199409810 PASS) exposed a wrist anchor and an envelope hidden behind the hand. The reviewed revision uses finger/palm joints, real jewellery scale, a camera-facing folded flap and wax seal, a grounded floor rest, and a short two-character establishing shot. Bilbo visibly wears the Ring at the farewell and vanishes before the Bag End cut. This is a correction driven by captured gameplay, not a source-test-only approval.

Architecture replaces the floating circular plaster frontage with a grounded custom arch and timber outline. Licensed GLB leaf/flower clusters replace runtime smooth-ball shrubs and window flowers. Static small foliage freezes its world matrices; moving trees retain their wind transforms. Gardeners pause when their proposed step overlaps the player or a home footprint. These visual revisions require a new exact-head capture before merge.

Second visual review (ea25d49, Actions 41200348493 PASS, artifact 13042975311 SHA256 57d8d7e7a13e10111e6f35b42ce1e14ba0b3f3863099beaf1b5e3e0e8372e955) confirmed the new grounded fronts and textured planting, and exposed floating flowerpots and an over-tall wizard in the establishing frame. Pots now rest on the ground; Gandalf's world ratio is reduced from 2.20 to 1.76 times Frodo's height, with consistent cart scaling. His existing weighted beard gains original 256px strand albedo and normal detail without adding character geometry. Camera/gaze and departure walking are corrected; the private walk uses existing licensed wood footsteps.
