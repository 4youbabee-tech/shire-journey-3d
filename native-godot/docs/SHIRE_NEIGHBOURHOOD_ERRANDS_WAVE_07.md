# Wave 07 — Shire neighbourhood errands

Status: **integrated Chapter I candidate, not cinematic-final**.

An original optional three-stop bilingual gameplay loop connects Sam's garden,
the Old Mill, and a delivery table near Party Field. Each stop has an in-world
primitive-mesh prop, proximity-gated E interaction, map waypoint, journal
direction, and a saved completion state. Main-story stages are unchanged.

The existing schema-2 save remains compatible: older saves initialize errands
as unfinished; corrupted save entries are ignored and only a valid ordered
prefix is loaded. Birthday errands are disabled after the 3018 time jump.

All new props and writing are authored in this repository using Godot standard
primitives. No outside unlicensed assets or movie dialogue were imported.
PDF references are not present in this branch tree, so no unsupported claim is
made about reproducing them.

Acceptance: Godot 4.4.1 import + regression smoke + existing Windows export and
launch. An in-engine visual review remains required for art quality evaluation.
