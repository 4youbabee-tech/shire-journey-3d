# Shire Journey — Production roadmap

**Project isolation:** This repository is the WebGL game and is not `fellowship-personal-game`.

## Checkpoint gates

| Gate | Scope | Acceptance evidence | Current state |
|---|---|---|---|
| G0 | Independent repository and status | public README + roadmap commit | Completed |
| G1 | Publish runnable source + audio | GitHub tree contains bootable files, local and served runs verified | Pending |
| G2 | Bag End visual rebuild | actual in-game shots reviewed; improved character, house, flora assets | Pending; procedural prototypes only |
| G3 | Shire/Bree/Weathertop quality | manual traversal + WebGL smoke + dialogue, audio and saves | Partial automatic checks |
| G4 | Living NPC prototype | schedules, memory, contextual responses, actions and save/load | Partial authored behavior |
| G5 | Additional story chapters | playable chapter transition and canon checks | Not complete |
| G6 | Low-spec performance and release | 720p target Windows device test and optional executable | Not tested |

## Nonnegotiable acceptance criteria

- Do not claim cinematic or film-matching visuals unless screenshots from the actual engine support them.
- Do not claim a fully intelligent AI NPC if it is an authored choice tree with memory.
- Real dialogue UI uses choices, English sound and Arabic captions, no microphone.
- Preserve story outcomes and attribute new gameplay as game-original.
- Keep scene budgets practical for approximately 2GB VRAM.
- Never commit supplied PDF references/books or another project's code.
- Reports must distinguish simulated logic tests from actual WebGL and target-hardware tests.
