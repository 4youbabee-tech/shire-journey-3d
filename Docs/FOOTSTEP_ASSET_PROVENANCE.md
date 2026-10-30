# Packaged footstep recordings

Author: Kenney Vleugels / Kenney.nl. Original pack: RPG Audio 1.0.
Official listing: https://kenney.nl/assets/rpg-audio — CC0 1.0.
Original licence text: dist/assets/audio/KENNEY-RPG-AUDIO-LICENSE.txt.

The official listing's CC0 declaration was checked. The direct site download returned HTTP 403 in this environment. The four unmodified OGG source files were acquired from the public redistributable mirror at https://github.com/euuuuuuan/moonshard-warden-public/tree/897d26af64aab4003b057b3910a7118279b927d8/src/assets/kenney-rpg-audio , with its verbatim upstream licence. This is a mirror acquisition, not a claim of downloading Kenney's original ZIP. Source names: footstep00.ogg, footstep02.ogg, footstep06.ogg, footstep09.ogg. Source SHA256 values exactly match that repository's per-file provenance records.

Conversion: FFmpeg, mono 22050 Hz MP3 at 64 kb/s. All four outputs total 10,831 bytes. scripts/audio-data/footsteps-receipt.json records original and derivative SHA256/byte lengths. scripts/audio-data/manifest.json and compressed payloads are the build authority; npm ci reconstructs and verifies them offline along with the existing original 51-second score. No runtime external audio download.

Playback begins only after the player's explicit gesture. Loaded buffers are reused, adjacent footfalls choose different recordings, and a low-pass filter softens outdoor dirt footfalls relative to wood. The existing procedural impact remains a network/decode fallback and continues to supply the current cart cadence. This addition is four licensed footstep variants; it is not a claim that all environmental/horse/cart sounds are recorded assets.
