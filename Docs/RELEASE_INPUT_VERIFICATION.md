# 0.14.1 release candidate

The opening's final handoff now positions the logical body and visible player against the actual terrain height. It previously used a fixed zero-ground offset beside Gandalf, after the hill terrain had been added. A native Babylon regression uses the same placement function as the production handoff, then moves forward toward the wizard's real collision volume and back again without teleporting or disabling collision.

The failed public check used a fixed 4.5-second key hold. Software rendering can spend that interval drawing few or no simulation frames. The check now holds a real forward key until it observes over 0.3 world units of movement, with a hard 60-second deadline and key release in finally. A genuinely blocked player still fails. Both success and failure retain the before/after positions and rendered frame counters. No public relocation or other QA API is enabled.

Road/public still captures wait for two additional simulation/render iterations and allow 90 seconds for screenshot capture. This records the state after transitions rather than naming a stale framebuffer as the new scene. It does not freeze the game clock, reposition the camera, insert frames or infer target-device FPS.

The public-browser check is an independent main-branch Actions job, so deployment identity and real public controls can be checked without waiting for the longer opening/party/revelation recordings. Exact-head source, native, WebGL/road and public SHA checks remain release gates. This is a maintenance release of the existing Shire-to-Bree-gate chapter; it does not add Bree's inn or the later world, or make a completed-film-world claim.
