# BQ-Centrum validation report

2026-11-02 UTC. Validated existing build `BQ_CENTRUM_STAGE7`, including the three repairs below. No feature or map expansion was added.

## Conditions and actual results

System **Chromium 154.0.8037.57**, headless Linux; desktop 1280×720 and phone-landscape emulation 844×390, plus viewport changes. Fresh disposable browser profiles and local HTTP servers. **This was not physical iPhone/Android or Safari testing.**

| Test | Actual outcome |
| --- | --- |
| Complete fresh route | **15 steps passed**, 786 local requests, zero JS/HTTP failures. Ordinary inputs only: ride from x210, park, shop/slip, arcade passage, courtyard approval/movement, shortcut, square, report, reward, purchase, safe Eat, same bike, remount and ride. No debug teleport, god mode, health/item setter or pre-completed save. |
| State/input regressions | **44 browser groups passed**, zero JS/HTTP failures: full bag, no money, full health, repeat inputs, interrupted eating, reload, corruption, coherent retry, locked/remote exits, recovering essential residents, walking/occlusion/jumps, transfer reloads, pause and touch/viewport changes. |
| Remount repair | **2 regressions passed**: simultaneous public requests and same-task actual interaction-button clicks now complete the existing transfer. |
| Real combat/defeat | **5 checks passed**. After an explicitly prepared 20HP/1food practice fixture, actual J input provoked production NPCs; real punches caused 20→12→4→0HP. Eating/spam granted nothing; no automatic refill. C restored one checkpoint and discarded the damaged encounter. No forced final damage/death setter. |
| Unit/model checks | **All 15 JavaScript unit suites passed**. Seven new validation groups include every authored exit/arrival, both gate states, swept collision, foot sorting, quest-prefix reloads and 500 deterministic economy/save/retry operations. |
| Source/code checks | **32 JS syntax checks** and **all 944 pinned original-file checks passed**. Reviewed integration additions are reversed before hashing; cycling integration, terrain, crash/damage formulas, original assets and production character renderers remain preserved. |
| Standalone delivery | Clean extraction at **/** and **/BQ-Centrum/**, desktop and touch emulation: **28 startup/scene/entry checks**. Exact final-runtime hashes, network/console results and timings are recorded in the external delivery certificate; all five scenes and both HTML entries are exercised. |

The primary fresh ride took genuine road damage **100→10HP**, collected three authored wrappers, then used two legitimate safe Eats before the task (**50HP, food 1**). Reporting did not heal or auto-claim. Reward redemption, purchase and a final safe Eat ended at **70HP, food 2, 20kr**. Three reloads retained slip/gate/reward/purchase state. Every scene transition and carrier transfer preserved health. The original parked position/bicycle was used for remounting, with grounded wheels and controlled speed.

Across four page lifetimes, instrumentation observed **one pending main game loop**, stable listener-registration shapes, no sampled duplicate passenger draws and at most one AudioContext per page. Source road time/projectiles stay held during Centrum exploration. Native feet/ground shadows, carrier continuity, source expressions and NPC identities/routines were checked in real gameplay; hashes also protect the original artwork. Screenshots are supporting views, not the sole proof of interaction or animation.

The primary run recorded **8,164 frame deltas**: median 16.7ms, p95 33.4ms, p99 50.1ms, max 150ms, including loading and concurrent tests on a shared container. The extracted-package test separately records cold startup and per-scene frame/load timings. These are headless observations, not a physical-phone performance certification; cold/shared-CPU stalls remain possible.

## Repairs

Two remount requests within the same event turn could let the second request invalidate the first transfer’s generation, leaving exploration held with a pending mount animation. `centrum-link.js` now rejects remount requests unless the production Visits actor is in its stable street state without a transfer. The first request retains ownership and finishes.

A rendered transfer review also caught stale five-heart UI during dismount despite actual shared health being 10HP. The source Visits refresh returned for transitions before painting its current health. The existing heart-label/fill update now runs before that return, so transfer hearts match the shared value; no health is granted. The final primary run checks the live HUD during transfer and records corrected gameplay.

Clean-server console inspection found a browser-initiated `/favicon.ico`404 that Page request hooks did not expose. Both entries now declare an empty data favicon; no artwork or title-screen design was added. Final package checks capture console errors as well as Page/network events.

Health, items, transfer artwork and road physics were not changed by these repairs.

## Evidence and reproduction

- [Complete earned route: screenshots, input/state evidence and 63-second actual 3× clip](verification/stage8/full-route/README.md).
- [44 focused browser groups](verification/stage8/edges/README.md), [remount race](verification/stage8/remount-race/README.md), [real combat and 9.5-second clip](verification/stage8/combat/README.md).
- [Current stage index](verification/stage8/README.md), [core checks](verification/stage8/core-checks.json), [prior normal-size character/art review](verification/stage7/README.md).
- [Standalone test description](verification/stage8/standalone/README.md). The exact delivery certificate and package SHA256 are supplied beside the zip; volatile standalone results are intentionally outside the archive to avoid self-referential/stale certificates.

The focused stress tests disclose their starting fixtures and source debug setup. They do not substitute for the separate fully earned no-debug primary route. Clips contain actual rendered gameplay, not generated art; playback speed and capped wait gaps are disclosed. A transfer assertion initially included hidden, uninitialized preparation HUD elements; the retained real trace was rechecked for actual initialized transfer UI, with 130 correct samples and no changed images. Some attempted road-driver preparations stopped on harness assumptions about braking/full health; those were corrected without changing the game, and only the final complete route is marked passed.

Run instructions and controls are in [README.md](README.md). Relevant commands include `node tests/centrum_validation.cjs`, `python3 tests/centrum_complete_route.py`, `python3 tests/centrum_edge_browser.py`, `python3 tests/centrum_remount_race.py`, `python3 tests/centrum_combat_validation.py`, `python3 tools/verify-source-integrity.py` and the package/standalone commands listed there. Unlisted inherited/historical browser scripts were not all rerun and are not claimed passed.

## Delivery boundaries and remaining limits

The clean archive has split runtime files, required local artwork, attribution, current evidence and payload hashes. It excludes donor inspection archives, all Git metadata, secrets, disposable caches, raw recording frames and obsolete huge HTML builds. Required immutable prepared artwork under `assets/cache` is retained as runtime content. Both active HTML files remain about 13KB. Credential-pattern and forbidden-path scans found no matches; those scans are not a general security audit.

Only BQ-Centrum and disposable local browser profiles were written. Runtime save operations use `bq-centrum:`; donor-key sentinels remain untouched. The target Git configuration hash and empty remote list remain unchanged. No donor checkout/repository, donor save or deployment was written, and no remote push or GitHub Pages deployment was performed.

Matched finished gate/passage/cage artwork is still missing and labelled development placeholders. Source depth walking can slide; phone cover views crop some upper facades while preserving actor scale. Physical phones, Safari/WebKit, Firefox, gamepads and long-duration/mobile thermal performance remain **untested**. No further normal-path blocker was found in the exercised scope; this is not a claim of exhaustive defect freedom.
