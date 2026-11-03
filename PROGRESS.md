# Stage 8 — Validation and repair

Validated the completed **BQ_CENTRUM_STAGE7** prototype without adding features, scenes, footprint or balance changes. Source pin remains `da109213fdf24947c2ac0b85de900214cc72e44f` / `AUTUMN_RIDE_ART_V19`.

Three actual defects were repaired:

- Repeated remount requests in the same event turn could invalidate the active transfer and leave exploration held. The link now rejects another request while the production transfer is underway.
- The transfer HUD could show five full hearts despite actual shared health being 10 HP. Its existing heart-label/fill update now runs before the transition return. This changes the display only; no health, physics, damage or artwork was changed.

- Clean-server console inspection also found the browser’s implicit `/favicon.ico`404. Both entries now declare an empty favicon, eliminating that request without adding artwork or changing the title screen.

## Verified work

The complete **fresh no-debug route** passed using ordinary controls: ride from the start, park, Metro Square, shop/slip, arcade passage, courtyard/correct parcel/caretaker delivery, open shortcut, square, report, claim reward, buy, select/Eat safely, return to the same bicycle, remount and ride. Three reloads preserved earned progress. Genuine road injuries reduced health 100→10; two intermediate safe Eats restored 50 before the task; the final result was **70 HP, food 2, 20 kr**. Transitions never granted health. The final recording checks visible transfer hearts against shared health.

Additional verification passed:

- **44 browser edge groups:** blocked/remote exits, all scene arrivals, residents’ fear/recovery, inventory/rewards, eating interruption, reload/corruption/retry, transfer reloads, collision/occlusion/jumps, pause and touch/viewport changes.
- **2 remount stress regressions** and **5 real-combat checks**. Production NPC punches caused 20→12→4→0 HP after actual attacks; combat/dead eating did not heal or consume food, and retry discarded the damaged fight.
- **All 15 unit suites**, including 7 new validation groups and 500 deterministic save/economy operations; **32 JS syntax checks**; **all 944 pinned-source checks**. Source cycling/crash/damage code and character/art hashes remain preserved outside documented integration/UI repairs.
- Clean extracted delivery at **/** and **/BQ-Centrum/**, desktop and Chromium touch emulation, including all five scenes and both active HTML entries. The detailed exact-archive certificate is supplied outside the zip beside the delivery.

Instrumentation found one pending main game loop, stable input-listener registrations and no sampled duplicate baby/bicycle. Source simulation stays held while exploring. Real normal-size screenshots, phase/input/state traces and clips support the results; fixtures in secondary stress tests are explicitly distinguished from the fully earned primary route.

[Compact test report](TEST_REPORT.md) · [Actual evidence](verification/stage8/README.md) · [Prior art/source comparison](verification/stage7/README.md)

## Delivery and limits

README now contains exact root/subpath start instructions, controls, implemented scope, save behaviour and attribution. The clean archive excludes donor inspection archives, Git metadata, secrets, disposable caches, raw frames and obsolete huge HTML. Required immutable source-prepared artwork under `assets/cache` remains runtime content. Both active HTML files remain about 13KB. Payload hashes, a SHA256 sidecar and an external validation certificate accompany the package.

Matched finished gate/passage/cage art remains missing and labelled development placeholders. Pure depth walking retains the source gait; phone cover views can crop upper facades. **Physical phones, Safari/WebKit, Firefox, gamepads and sustained mobile performance remain untested.** Headless/shared-CPU timings include loading stalls and are reported without a physical-device FPS guarantee. No unresolved normal-path blocker was found in the exercised scope; this is not exhaustive defect certification.

All work stayed inside BQ-Centrum and disposable local browser profiles. Target Git configuration/remotes are preserved. Neither donor repository/save keys nor deployment was written. **No remote push or GitHub Pages deployment was performed.**


# Stage 9 — Remaining scenery, gait and browser review

Implemented **BQ_CENTRUM_STAGE9** after the request to complete the listed remaining items. Physical-device testing was explicitly skipped. GitHub pushes were explicitly authorized only to https://github.com/KossaMu248/BQ-Centrum.git; the validated initial snapshot is 681c664. Pages stays off. Historical statements about no remotes/push describe earlier stages.

- Added three transparent environment-only assets for the gate, service passage and delivery cage, with source-style references, measured uniform crops/pivots and honest [provenance](assets/centrum/PROVENANCE.md). Original characters, baby face/neck/clothing, source crates, shops and title art remain unchanged.
- Improved shallow depth stepping using actual collision-resolved travel and an optional native-gait projection. Horizontal speed 155, depth 60, fixed actor 200 and original 12-unit depth radius. Native lift, rigid boots, body motion and baby scale are preserved. Stop easing retains heading; cache audits use the baked heading. No road physics/damage redesign.
- Real return-entry review found the expanded passage jamb covering its old arrival. The same named arrival now lands 1048,586 facing−1, clear of a 35×13 jamb footprint. Its lower art sorts at ground 550, with the upper facade behind the passenger. Five floors/dimensions, scene IDs and accepted camera remain unchanged. Old colliding saved positions use the existing safe fallback without losing supplies/gate progress.

Actual final checks: **16 unit suites, 34 syntax checks, 944 source reconstructions**; **36 Chromium normal-size gameplay screenshots and 16 review groups**, plus 11 environmental captures; **15-step fresh no-debug ride/task/reward/Eat/same-bike-remount route**, 813 local requests, no JS/HTTP errors, three reloads and final 70 HP / food 2 / 20 kr. Across four page lifetimes instrumentation found one pending loop, stable listener shapes, zero passenger-duplication samples and at most one AudioContext. The 118 transfer samples matched shared health.

The focused video has 57.14 seconds of actual walking shown at 2× (28.75 seconds). Sparse measured pure-depth sole slip fell from 197/150 px/s to 1.71/3.76; paired samples are only 2/1 before and 2/2 after, so this is observed improvement, not a universal animation benchmark. No dedicated toward/away artwork is claimed. Original source art is protected by hashes; exact optional renderer edits are reversed by the source verifier.

Firefox 153 and Linux WebKit 26.5 both passed 30 root/subpath startup/scene groups with desktop/phone viewports. Firefox also passed the 15-execution native task/economy/remount run. WebKit completed 13 task/economy groups before a 35-second return timeout. A separate post-quest fixture then passed native Q→walking→same-bike remount in about 12 seconds, plus final jamb return/collision checks (five groups per engine). The original timeout cause was not captured, so no single uninterrupted WebKit full-flow pass is claimed.

[Current report](TEST_REPORT.md) · [Stage9 evidence](verification/stage9/README.md) · [walking/character limits](verification/stage9/gameplay/README.md). The historical Stage 8 edge/combat results remain separate; those are not relabelled as fresh physical-device tests.

Remaining limits: source side/front silhouettes, cropped upper facades on phone cover framing, and possible far-right phone heart/bag overlap with the bear’s helmet; the baby stays visible. Physical phones/Safari were skipped; gamepads and sustained mobile/thermal performance remain untested. Linux/headless shared-CPU frame times include substantial cold/browser stalls and are no device performance guarantee. Neither donor repository/save/deployment was written. No Pages deployment or force push.


# Stage 10 — Remaining software limits

Implemented **BQ_CENTRUM_STAGE10**. Physical-device and thermal testing are skipped at the user’s request; no device service or setup is required from the user. The same five scenes, accepted camera/scale, source characters, original cycling physics and economy remain unchanged.

The status HUD now uses the actual cover-projected actor bounds and retains a clear position until it needs to move. Review reproduced four helmet overlaps in prior views. It also found a separate portrait bug: opening the bag at the south square could cover the baby. Compact bag/eating panels now use a clear vertical band when needed. Cached geometry and the existing inventory update drive placement; no new RAF, input listener, save or wallet was added. Riding/source-visit positions return outside Centrum; the project badge alone is offset below the original source-foot fullscreen toolbar to repair a directly reproduced blocked bag tap. Original buttons/handlers remain unchanged. A later native-fullscreen probe reproduced portrait shrink to about 25% of ordinary painted size from an inherited contain override. Mobile Centrum now keeps its accepted cover view; its existing toggle/gear replace the redundant overlapping source tools only while in that scene. Cached actual-fit HUD projection handles desktop letterboxing. Separate final supplements keep broad pre-refinement evidence hashes honest.

Actual checks on the frozen runtime passed:

- **16 unit suites, 34 syntax checks, 944 source reconstructions**; original artwork and three prior scenery PNGs remain unchanged.
- Final refined-code HUD/fullscreen supplements: **27 views / 11 groups / 328 actual moving-jumping-landing frames**, no baby/helmet overlap and stable docks. Both phone fullscreen sizes preserve exactly **1.0000×** normal painted height. Near-bike remount restores source tools with one bike/passenger and unchanged health. The broader **62-view / 36-group** gallery is retained as pre-fullscreen-refinement evidence.
- A complete **16-execution Linux WebKit** run: native task, delivery, shortcut, report/reward/purchase, live Eat/cancel, reload and same-bike Q/remount; then copied source-foot transfer/bag/remount. Every scene’s bag was opened/closed through real input. Health/food/wallet ended **80 / 2 / 20**, one pending loop, no runtime/console/HTTP/external errors, stable runtime hashes.
- **30 Firefox root/subpath executions**, desktop and touch viewport, all five scenes and both HTML entries, including native bag input and d-pad holds. No runtime/console/HTTP/external errors or code drift.

Final engine geometry cases also passed for all five landscape areas, portrait fallback and desktop letterboxing. A real source-foot fullscreen pointer obstruction found by Firefox was repaired with only a project badge offset; two post-repair groups in each engine verified clickable bag, source reset, 73 HP / food 0 / kr 0, one bike/passenger and grounded remount. Native Firefox actual desktop size and every fallback mode are labelled in the report.

An earlier baseline full WebKit flow also passed. The Stage 9 timeout was not reproduced; its original cause remains unproven. The harness now records bounded progress and the actual live page state on failure. Focused prepared parking/scene saves remain disclosed and do not replace the separate historical fresh earned Chromium road route.

Read-only profiling identified native source mesh baking as the main walking cost. The roughly 0.25 ms frozen-audit optimization was declined to preserve the live danger bridge for little gain. Source renderers and cache limits remain intact. The final exclusive desktop repeat passed eight invariants with one loop, bounded caches/no NPC rebakes and actual movement. Ready 1.09s, E→Square 15.09s; idle loop CPU median 3.2ms, moving 10.1–11.4ms and frame medians 16.7–33.2ms / p95 33.4ms. HUD layout has a small measured cost rather than a claimed free optimization. Final profile and responsive-gallery details are recorded in the Stage 10 evidence.

[Current test report](TEST_REPORT.md) · [Stage 10 evidence](verification/stage10/README.md) · [HUD review](verification/stage10/hud/README.md) · [browser flows](verification/stage10/browsers/README.md).

The original side/front silhouettes and some upper-façade cropping are retained presentation constraints. Cold preparation/first-direction bakes remain a measured cost, without a mobile FPS guarantee. Code inspection confirms gamepad mapping is not implemented; only keyboard/touch controls are supported. Physical testing is skipped. Target-only GitHub authorization continues; no donor repository/save, deployment or Pages configuration is changed.


# Stage 11 — Walking repair and on-demand inventory

Implemented **BQ_CENTRUM_STAGE11** following reported FPS lag, scuffed bear legs, unchanged up/down poses and unwanted permanent bag information. The five scenes, accepted camera/actor scale, cycling physics/damage, original characters and ledger remain unchanged.

Centrum now opts into one bounded OffscreenCanvas worker for production mesh rasterisation, sharing the 98-frame/32MiB cache, with one active and one latest request and synchronous fallback. Body/passenger use the returned pose together; no additional game RAF, input loop, simulation or audio was added. Shorter source steps follow actual collision-resolved travel at 130/52 walking speeds, stride ratio 0.70 and shallow projection 0.30, within the unchanged collision footprint. Fixed-size complete boots reuse the active v18 contact art; original pants and independent affine calf patches remove the old shrinkage/folds. Failed numeric-only leg prototypes were rejected after actual gameplay review. No character artwork was generated.

Up/down now changes the bear's supporting posture and uses the baby's original continuous leanForward/leanBack poses. Scale, neck/collar/clothing and physical carrier remain original; no fake overhead rotation or hidden rear-facing baby. This is directional three-quarter posing, not a new authored front/rear walking row.

**I** toggles the compact bag. Touch uses **Settings→BAG·I**, now in the sticky header rather than below the debug tools. Food/wallet appear only inside the bag; the five-heart health row remains. Existing pause/danger/live-eating/transaction/save rules are retained.9 groups / 27 real inventory views passed across riding, source-foot and Centrum; final WebKit verifies immediate top-header pointer access.

Actual final verification:

- 18 unit suites,35 JS syntax checks and944 strict source reconstructions passed, with two deliberately unreviewed in-memory source changes rejected. Original art/locomotion/road physics remain protected.160 anatomy cases check 12,480 painted triangles without inversions; numeric IK remains explicitly diagnostic.
- 44 normal-size desktop/touch walking screenshots plus28.33/25.64-second 1× capture intervals passed visual review, including clear-lane up/down start/stop and diagonals. Original baby scale/collar/attachment remain intact. Source baseline references and rejected iterations stay distinctly labelled.
- Four exclusive Chromium 154 baseline/current desktop/emulation profiles: main walking loop 11.0–13.2→2.9–3.3 ms, about 70–78% lower; current moving frame median 16.7 ms / p95 16.7–16.8 ms. One pending loop, bounded caches/worker queue, zero live main-thread hero bakes or NPC rebakes and no runtime/HTTP/console errors. These are measured host samples, not physical-mobile claims.
- Fresh 15-step no-debug ride/task/reward/purchase/Eat/same-bike-remount route passed with three reloads, 825 requests, no errors or sampled passenger duplication and final 70 HP / food 2 / 20 kr. Only intentional Eats healed. Actual 3× route recording is separate from the 1× walking clips.
- Linux WebKit 26.5 passed 16 native functional executions, all five scenes, top-header bag, full task/economy/reload/remount and copied source-foot, with worker ready, one loop, stable runtime hashes and no errors. Its prepared starting save is disclosed; it is not the fresh earned Chromium route or physical Safari.

The optional raster-equivalence lab remains a **failed** check: all 12 pairs exceed its original raw-byte/2-LSB visible threshold, even after native bitmap settling. Numeric geometry matches exactly; paired 1× lab images show differences along clipped-triangle seams. No byte/pixel-equivalence claim is made, and the threshold was not loosened. Original asset hashes and the accepted normal-size gameplay likeness are separate evidence.

Remaining limits: cold scene preparation around 15 seconds, brief first-heading idle fallback (~120ms extra in the recorded desktop sample), existing three-quarter silhouettes/facade cropping and synchronous fallback cost on unsupported workers. Physical-device/thermal tests remain skipped; no fresh Firefox claim. [Current report](TEST_REPORT.md) and [Stage11 evidence](verification/stage11/README.md) give actual conditions. Clean archive validation is recorded externally beside the delivery; publication remains limited to the authorized target main/Pages, with no donor/save/deployment changes.


# Stage12 — Correct leg ownership; real angles still pending

The user found defects missed by the prior visual gate. The larger foreground contact shoe had been scaled to the smaller idle shoe; the background shoe became larger. Lifted soleY also changed internal leg overlap. Source calf indices were misidentified and one patch included an extra unbooted fur column.

Corrected the source sampling, preserving total shoe size but assigning the production near/far proportions, matching foreground/background calf patches to their trouser openings, excluding that extra strip and keeping the current three-quarter far leg behind the near leg. Original source pixels, baby/attachment/scale, riding renderer, physics, camera/scenes, worker budget and on-demand I/menu inventory remain unchanged.

Verified 19 unit suites / 35 JS syntax / 944 strict source reconstructions, plus negative mutation checks. The regression fails against the published size/order bugs and passes 240 pose / 720 lift-order / 6 baby cases after repair. Actual 26 before/after screenshots and a 10.08-second 1× walking clip supplement the math; both desktop/touch post-metadata native transfer/move/pause/I/menu/remount checks pass with 100 HP unchanged and one bicycle/passenger. No JS/HTTP errors. [Evidence](verification/stage12/README.md).

**The up/down angle request remains unimplemented.** The prior change only leaned the same source view. A renewed audit found no compatible toward/away bear artwork; new matching bear-only views require permission under the user's earlier instruction prohibiting regenerated characters. The original baby must remain untouched. The explicit artwork question is pending; no generated views or false angle-completion claim are included.

This focused repair does not claim a fresh FPS, full quest/WebKit or clean-archive matrix. The existing Stage11 ZIP/certificate remains historical; use current source for Stage12. Physical testing remains skipped. No donor/save/deployment changes; publication stays limited to the authorized target main/Pages.
