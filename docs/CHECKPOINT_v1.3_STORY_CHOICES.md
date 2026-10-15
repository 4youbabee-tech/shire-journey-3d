# v1.3 — Prewritten story dialogue + optional local generation

## User-requested correction
The player **never types a question**. The dialogue scene always uses authored on-screen choices (1–4 / click). A new Q / More story dialogue entry offers four contextual choices; the visible question wording changes by chapter and region.

## Implemented
- Region and chapter-specific prompts for Shire, Bree, Weathertop and Rivendell.
- Authored English replies with Arabic subtitles and existing text-to-speech integration.
- Saved bounded topic and relationship memory without storing the player's raw prompts.
- Existing main plot dialogue and mission state preserved; extra options return to original choices.
- **Experimental optional local text generator**: localhost Ollama `qwen2.5:0.5b` can rephrase a pre-authored answer within a prompt and lightweight validation guard. No typed question and no microphone. Disabled by default.
- No model or service bundled; if missing, the offline authored reply remains. Real model quality and CORS behavior have NOT been tested on the target user's PC. This mode does not provide a guarantee against hallucinations.

## Actual validation
- Story response logic: **11 / 11**.
- Browser UI with mocked rendering: **17 / 17**, including mocked local model response and save validation.
- Shire chapter logic: **26 / 26**.
- Bree: **11 / 11**.
- Weathertop: **16 / 16**.
- Rivendell: **14 / 14**.
- Real WebGL on headless Linux Xvfb Chromium **SwiftShader software**: drawing and bilingual NPC line verified, no JavaScript errors. Not a user GPU FPS benchmark.

## Asset and production status
This is an NPC dialogue upgrade, **not** a Witcher 3-level art rebuild. Realistic characters, realistic textures, full generative NPC agency, EXE export and completion of all books are still pending. Current browser demo and full project ZIP are delivered separately in the chat because all project data/audio assets are not yet committed to the repo.

## Strict isolation
`shire-journey-3d` is not `fellowship-personal-game`. No edits to the latter and no uploads of protected books or film assets.
