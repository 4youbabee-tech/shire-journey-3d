# Follow-up: B4 accepted; B5 camera/party refinement

B4 merged at 6613a74a114f83ebe3dd6ed37e78abd51d4116ff and publication identity verified as 0.15.0. B5 full local Chromium desktop/mobile walkthrough also passed after original material/sign improvements, with no browser errors. The current follow-up reserves camera/party reset for transitions only and adjusts indoor/outdoor framing; source tests and final browser rerun gate this head. Both canonical status documents contain the accepted B4 receipt.

# B5 active checkpoint — connected Bree candidate

Base B5 source checkpoint: `df2f6981c95873a475cc59bfee86a84688c9700c`. B4 PR #26 head remains `650529eea2d8cc558f3ecd7afb7b661cd7207ded`; run `41351147934` awaiting its full Chromium result at this receipt. Never merge on an older successful run.

## Implemented integration

The existing road gate now lazily activates Bree. Road encounters, ferry, world geography and original saves remain intact. `road.bree` stores location (town/inn) and task (arrival/lodging/warning/rested), validated on restore only after the ferry. Original dialogue and range gates require the innkeeper, Strider and safe room in sequence. Town/inn/road transitions preserve the party, swap collision and ground authority, reset camera/follower trails, update map and location text, and attenuate outdoor audio indoors. Return visits reuse resources.

13 town buildings, six articulated residents, gate, market, well, lanterns; Pony exterior and originally drawn sign; furnished hall, pantry, hearth, washbasin and two rooms. Shared existing surface tiles add wood/plaster/linen grain. B6 must improve the cast and Ring story staging; primitive residents are not accepted film likenesses.

## Evidence

89 source tests pass locally. Native regression enters from the actual road gate, changes interiors, round-trips the save, resumes the interior and returns to the Shire; repeated entry keeps mesh counts stable. First Chromium desktop and mobile runs PASS: actual keyboard walking through town/interior, innkeeper and Strider interaction, rest, real reload and saved position/quest restoration; no browser errors. `/tmp/bree-first-browser/report.json` is local evidence only, not a durable CI receipt. Later texture/sign/camera improvements require the current rerun and review. CI has a dedicated Bree walkthrough job and artifact upload.

## Open acceptance

Review final browser captures, complete CI on the actual new head, inspect previous chapters, review budgets and repeated transitions, merge B4 only after its own gates, then rebase/merge accepted B5 and verify the original Pages URL. No physical GPU/phone FPS acceptance is asserted. B8–B10 remain unbuilt; the east exit explicitly reports this. Continue B6/B7 and later chapters after this candidate passes. Owner references are approximate and documented in OWNER_VISUAL_REFERENCES.md.
