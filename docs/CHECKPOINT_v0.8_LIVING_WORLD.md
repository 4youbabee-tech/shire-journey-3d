# Checkpoint v0.8 — Living World pass

**Date:** 2026-10-16

The local downloadable Shire Journey WebGL v0.8 candidate adds: proximity-driven NPC head attention, geometric eyelid blink, subtle breathing offset, grass/dirt/stone/wood/water footsteps, and gradual Shire twilight. Existing three-chapter story and English voice / Arabic subtitles are preserved.

Local automated logic regression summary:
- Shire: 26/26
- Bree: 11/11
- Weathertop: 16/16
- v0.7 NPC: 9/9
- v0.8 new features: 15/15

**Important:** The new full HTML/source/audio archive has **not been committed to this GitHub repository**. A WebGL graphics smoke run under Linux SwiftShader timed out; this does not establish real GPU performance or visual quality.

## Mapping the owner's production proposal

The proposed paths ending in Unreal C++ files / Unreal assets (e.g., `ShireNPCContextSubsystem.cpp`, `UHierarchicalInstancedStaticMeshComponent`, `.uasset`, or the cited Drive import commandlets) belong to an Unreal production workflow; they are not files of this custom WebGL runtime and must never be copied from the separate `fellowship-personal-game` project.

The transferable requirements are:
1. Replace primitive procedural characters and buildings with licensed/self-made GLB assets and correct PBR texture channels.
2. Rig and skin unified characters with animation clips, face rig/blink, additive head-gaze and, eventually, foot IK.
3. Daily schedules, location-aware NPC choices, persistent memories and authored story knowledge boundaries.
4. English voice and Arabic subtitles for every on-screen dialogue choice, no microphone.
5. Wildlife, wind shaders, surface-aware sounds, time-of-day cues, contextual side quests.
6. Low-spec profiling on i7 gen 6 / 8 GB / ~2 GB VRAM; target 720p / 30 FPS only after hardware testing.

**Not delivered:** genuine PBR world art, unified skeletal characters, facial morph target animations, real LLM-based NPCs, complete trilogy, or verified 30 FPS. Do not describe v0.8 as final quality.

**Next hard gate:** commit and test the executable game source/assets separately from reference PDFs, and acquire/author optimized GLB hero assets for Bag End and Frodo. Preserve the other repo untouched.
