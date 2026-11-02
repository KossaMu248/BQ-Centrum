# Stage 8 — Validation and repair

Validated the completed **BQ_CENTRUM_STAGE7** prototype without adding features, scenes, footprint or balance changes. Source pin remains `da109213fdf24947c2ac0b85de900214cc72e44f` / `AUTUMN_RIDE_ART_V19`.

Three actual defects were repaired:

- Repeated remount requests in the same event turn could invalidate the active transfer and leave exploration held. The link now rejects another request while the production transfer is underway.
- The transfer HUD could show five full hearts despite actual shared health being 10HP. Its existing heart-label/fill update now runs before the transition return. This changes the display only; no health, physics, damage or artwork was changed.

- Clean-server console inspection also found the browser’s implicit `/favicon.ico`404. Both entries now declare an empty favicon, eliminating that request without adding artwork or changing the title screen.

## Verified work

The complete **fresh no-debug route** passed using ordinary controls: ride from the start, park, Metro Square, shop/slip, arcade passage, courtyard/correct parcel/caretaker delivery, open shortcut, square, report, claim reward, buy, select/Eat safely, return to the same bicycle, remount and ride. Three reloads preserved earned progress. Genuine road injuries reduced health 100→10; two intermediate safe Eats restored 50 before the task; the final result was **70HP, food 2, 20kr**. Transitions never granted health. The final recording checks visible transfer hearts against shared health.

Additional verification passed:

- **44 browser edge groups:** blocked/remote exits, all scene arrivals, residents’ fear/recovery, inventory/rewards, eating interruption, reload/corruption/retry, transfer reloads, collision/occlusion/jumps, pause and touch/viewport changes.
- **2 remount stress regressions** and **5 real-combat checks**. Production NPC punches caused 20→12→4→0HP after actual attacks; combat/dead eating did not heal or consume food, and retry discarded the damaged fight.
- **All 15 unit suites**, including 7 new validation groups and 500 deterministic save/economy operations; **32 JS syntax checks**; **all 944 pinned-source checks**. Source cycling/crash/damage code and character/art hashes remain preserved outside documented integration/UI repairs.
- Clean extracted delivery at **/** and **/BQ-Centrum/**, desktop and Chromium touch emulation, including all five scenes and both active HTML entries. The detailed exact-archive certificate is supplied outside the zip beside the delivery.

Instrumentation found one pending main game loop, stable input-listener registrations and no sampled duplicate baby/bicycle. Source simulation stays held while exploring. Real normal-size screenshots, phase/input/state traces and clips support the results; fixtures in secondary stress tests are explicitly distinguished from the fully earned primary route.

[Compact test report](TEST_REPORT.md) · [Actual evidence](verification/stage8/README.md) · [Prior art/source comparison](verification/stage7/README.md)

## Delivery and limits

README now contains exact root/subpath start instructions, controls, implemented scope, save behaviour and attribution. The clean archive excludes donor inspection archives, Git metadata, secrets, disposable caches, raw frames and obsolete huge HTML. Required immutable source-prepared artwork under `assets/cache` remains runtime content. Both active HTML files remain about 13KB. Payload hashes, a SHA256 sidecar and an external validation certificate accompany the package.

Matched finished gate/passage/cage art remains missing and labelled development placeholders. Pure depth walking retains the source gait; phone cover views can crop upper facades. **Physical phones, Safari/WebKit, Firefox, gamepads and sustained mobile performance remain untested.** Headless/shared-CPU timings include loading stalls and are reported without a physical-device FPS guarantee. No unresolved normal-path blocker was found in the exercised scope; this is not exhaustive defect certification.

All work stayed inside BQ-Centrum and disposable local browser profiles. Target Git configuration/remotes are preserved. Neither donor repository/save keys nor deployment was written. **No remote push or GitHub Pages deployment was performed.**
