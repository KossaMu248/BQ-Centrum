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
