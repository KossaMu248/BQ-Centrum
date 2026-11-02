# BQ-Centrum test report

2026-11-02 UTC, **BQ_CENTRUM_STAGE9**. Same five floors and accepted shallow camera/actor scale. This follow-up fills the listed environmental-art gaps, improves depth foot planting and extends browser verification. Original characters and cycling/crash/damage formulas remain preserved.

| Executed check | Actual result |
| --- | --- |
| Final core |16 JavaScript unit suites, 34 syntax checks and 944 pinned-source reconstruction checks passed. Includes all exits/arrivals, collision/occlusion, parking, quest/reward prefixes, inventory and coherent save/retry models. New depth math covers 24 midstance cases plus exhaustive footprint envelopes; new jamb/old-save recovery regressions pass.|
| Fresh earned route |15 milestones passed using ordinary controls from the original ride start: park, slip, arcade/courtyard approval, shortcut, report, reward, purchase, live Eat, same-bike remount and resumed ride. Three reloads; 813 local requests; zero JS/HTTP failures. No debug teleports or grants.|
| Rendered movement/characters |36 actual desktop/phone-emulated screenshots, 16 groups, no JS/HTTP failures. Up/down/diagonals, both facings, stop easing, furniture/front-back sorting, jump/floor shadows, gate/posts, passage arrival/collision and touch/reduced-motion. 83 curated original art/module hashes match; intentional adapter edits have strict reverse reconstruction.|
| Environmental review |11 actual gameplay captures cover new open/closed gate/cage, source cargo movement and aligned passage. Transparent generated **environment assets** have separate provenance; the labelled asset-renderer fixture is not a gameplay screenshot.|
| Firefox 153 |30 root/subpath startup/scene groups and a 15-execution native task/economy/reload/Eat/interruption/same-bike remount flow passed.|
| Linux WebKit 26.5 |30 root/subpath groups passed; 13 native task/economy groups completed before a 35-second Q timeout. A separate final five-group post-quest fixture passed Q→walk→same-bike remount (~12 seconds), named arrival and jamb collision. The original timeout cause is unproven; no uninterrupted full-flow pass is claimed.|

Chromium **154.0.8037.57** ran headless Linux at 1280×720 and 844×390 with touch emulation, plus viewport changes. Firefox/WebKit also ran real keyboard, held-pointer and menu touch input. **Linux WebKit and Chromium phone emulation are not physical iPhone/Safari tests.** Physical-device testing was explicitly skipped. Prepared scene/parking fixtures in focused checks are disclosed; only the separate fresh primary route is the earned no-debug acceptance.

Primary road damage was 100→10 HP; three genuine road pickups entered the bag. Two safe Eats before the task gave 50 HP / food 1. Report created entitlement without healing; one reward plus purchase and final Eat ended 70 HP, food 2, 20 kr. Transitions preserved health. Four page lifetimes showed one pending main loop, stable listener registrations, zero sampled duplicate passenger draws and AudioContext counts 1/0/0/0. All 118 dismount/remount heart samples matched shared health.

Primary frame deltas: 8,809 samples, median 16.7 ms, p95 50 ms, p99 66.7 ms, max 166.6 ms, including loading under concurrent shared-CPU tests. Other engines have substantial cold raster/scene stalls; per-load/frame measurements remain in their JSON. The focused WebKit return sampled median 45 ms / p95 79 ms / max 371 ms. These are observations, not mobile FPS certification.

The actual walking clip is 28.75 seconds at 2×. Sparse pure-depth midstance sole samples improved from 197/150 px/s down/up to 1.71/3.76; only 2/1 before and 2/2 after paired samples exist. Diagonal input/shape checks passed without enough settled pairs for a numerical comparison. Baby continuity/native scale and rigid source boots passed, but there is no newly authored toward/away character set.

The wider **historical Stage 8** verification passed 44 browser edge groups, two remount races and five real combat/defeat checks, including full bag/no money/full health, interruption, corruption/checkpoints, unavailable residents and duplicate rewards. It is retained as [historical evidence](verification/stage8/README.md), not claimed rerun wholesale or on physical devices during this follow-up.

Two primary preparations stopped on test-driver timing assumptions (braking into reverse and the former 155-speed depth helper). Only control sampling/helper timing changed; no physics was changed to make tests pass. The final complete route passed. WebKit’s short dpad wall-clock assertion likewise required held-input polling because cold frames were slow.

Evidence: [current index](verification/stage9/README.md), [earned full route and 3× real clip](verification/stage9/full-route/README.md), [normal-size character/walking review](verification/stage9/gameplay/README.md), [browser results](verification/stage9/browsers/README.md), [core checks](verification/stage9/core-checks.json). [README](README.md) has exact start instructions, controls and scope; [SOURCE_BASELINE](SOURCE_BASELINE.md) keeps the original pin/attribution.

Remaining limits: source side/front silhouettes, phone cover cropping of upper facades and far-right phone HUD overlap with the bear’s helmet (baby remains clear), gamepads and sustained physical/mobile performance. Clean root/subpath archive verification is recorded in the external exact-ZIP certificate beside delivery; generated art, source art and actual gameplay evidence are labelled separately.

Only the independent target and disposable test profiles were written. Saves use `bq-centrum:`; no donor save keys, repository, Git metadata or deployment was changed. The user authorized target-only GitHub pushes; Pages remains off. The clean allowlisted package excludes secrets, Git metadata, donor inspection archives, disposable caches/raw frames and obsolete HTML, retaining required immutable prepared artwork.
