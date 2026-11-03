# Stage 10 HUD and fullscreen review

Fixed the compact heart/bag/wallet row covering the bear’s helmet at phone approach points. Placement now uses the displayed actor position, keeps a clear dock until movement requires a change, and uses a safe vertical band in portrait. The existing bag/eating panel can move into a clear band and scroll when space is tight. Fonts, colours, Billy’s artwork, controls and source character artwork are unchanged. No camera movement, actor resizing, new input listener, timer, animation loop or save was added.

The review also reproduced a fullscreen defect: the source `contain` rule overrode the mobile scene’s `cover` rule. Native phone fullscreen reduced painted actor height to **83.75% in landscape and 25.49% in portrait**. The narrow scene-only mobile fullscreen override restores `cover`; both final measured ratios are **1.0000**. The redundant source fullscreen toolbar is hidden only in mobile Centrum, where the existing Square fullscreen/settings buttons remain available. Its original toolbar returns outside the scene.

## Actual results

- [Complete gallery](gallery-results.json): **62 real screenshots / 36 groups**, all five scene approach points at **1280×720 desktop, 844×390 phone landscape and 390×844 portrait**. Bag/Eat-cancel/Close, health/food preservation, dialogue, pause/resume, viewport changes and stable docks passed. This gallery predates only the final actual-fit/fullscreen refinement; its original UI and image hashes are preserved under `pre-fullscreen/`.
- [Final focused review](quick-results.json): **15 screenshots / 7 groups** against the final code. Its actual movement/jump/landing probes observed **170 portrait and 158 landscape painted frames**, with **zero baby/helmet overlaps**. Projected body-top spans of **89.68 / 47.82 px** confirm actual animation. The portrait dock changed once and the landscape dock stayed fixed; rest samples had no jitter.
- [Final desktop fullscreen](fullscreen-results.json): **2 screenshots / 1 group**. The existing button entered **native Chromium fullscreen**; pause, camera/world position and height-200 actor were preserved on entry; resume, movement and the visible exit worked without health gain. Geometry uses the actual `contain` letterboxing.
- [Final phone fullscreen and scope](phone-fullscreen-results.json): **10 screenshots / 3 groups**. Landscape actor height stayed **161.11→161.11 px** and portrait **292.01→292.01 px**. Both native modes retained camera, readable baby/helmet, touch buttons and accessible bag controls. A prepared valid near-bike fixture then used the normal Back-to-bike/remount sequence: **one bicycle, one passenger, 80 HP and food unchanged, grounded wheels, speed 0**. The original fullscreen toolbar became visible outside Square and its exit worked.

All accepted runs above had **zero JavaScript exceptions or HTTP failures**. Every ordinary scene capture retained the original continuous baby upper body/collar and uniform source scale **0.5710830421929589** at hero height **200**. The inventory action unit suite and JavaScript syntax check passed. No character or environment image was generated for this stage.

These were **Chromium 154.0.8037.57 on Linux**, device scale 1. Phone cases use mobile/touch emulation, not physical iPhone, iOS or Safari testing. Functional runs shared the workspace with other browser checks; these are not performance measurements. The separate exclusive profiler and Firefox/Linux WebKit results are reported by their own stage-10 evidence.

## Screenshots and comparisons

All links below are actual gameplay screenshots, not generated scene illustrations.

| Case | Before | Final |
|---|---|---|
| Landscape helmet / passage | [original HUD](before/phone-landscape/shopping-arcade.png) | [safe dock](after/phone-landscape/boundary-comparison.png) |
| Portrait north boundary | [original HUD](before/phone-portrait/boundary-comparison.png) | [safe dock](after/phone-portrait/boundary-comparison.png) |
| Portrait bag / baby | — | [clear bag](after/phone-portrait/metro-square-bag.png) |
| Portrait eating / baby | — | [clear live action](after/phone-portrait/metro-square-eating.png) |
| Landscape native fullscreen | [shrunk actor](fullscreen-before/mobile-fullscreen/phone-landscape-native.png) | [preserved scale](after/mobile-fullscreen/phone-landscape-native.png) |
| Portrait native fullscreen | [shrunk actor and duplicate toolbar](fullscreen-before/mobile-fullscreen/phone-portrait-native.png) | [preserved scale / single scene toolbar](after/mobile-fullscreen/phone-portrait-native.png) |
| Leaving Square in fullscreen | — | [original ride toolbar restored](after/mobile-fullscreen/original-route-tools-restored.png) |

| Scene approach | Desktop | Phone landscape | Portrait |
|---|---|---|---|
| Metro Square | [view](pre-fullscreen/desktop/metro-square.png) | [view](pre-fullscreen/phone-landscape/metro-square.png) | [view](pre-fullscreen/phone-portrait/metro-square.png) |
| Shopping Arcade | [view](pre-fullscreen/desktop/shopping-arcade.png) | [view](pre-fullscreen/phone-landscape/shopping-arcade.png) | [view](pre-fullscreen/phone-portrait/shopping-arcade.png) |
| Service Courtyard | [view](pre-fullscreen/desktop/service-courtyard.png) | [view](pre-fullscreen/phone-landscape/service-courtyard.png) | [view](pre-fullscreen/phone-portrait/service-courtyard.png) |
| Food shop | [view](pre-fullscreen/desktop/food-shop.png) | [view](pre-fullscreen/phone-landscape/food-shop.png) | [view](pre-fullscreen/phone-portrait/food-shop.png) |
| Bicycle workshop | [view](pre-fullscreen/desktop/bicycle-workshop.png) | [view](pre-fullscreen/phone-landscape/bicycle-workshop.png) | [view](pre-fullscreen/phone-portrait/bicycle-workshop.png) |

## Method and limits

Canonical production parking saves and named entrances prepare scene fixtures; the source debug stop shortens setup only. Subsequent approach walking, touch controls, bag actions, jumps, fullscreen and remounts use normal runtime input. The near-bike scope explicitly uses the valid `from-cycle-route` anchor. This component review does not relabel fixtures as the separate earned full quest path.

The harness records original body/baby `drawImage` matrices and compares actual displayed bounds with DOM widgets. The helmet check conservatively uses the upper 30% of the painted source-body bounds; the continuous baby piece uses its actual transformed source tile. Live probes check each painted frame, including the inventory-before-scene update ordering. Separate screenshots alone are not the animation proof.

[before.json](before.json) records seven original-HUD views and four confirmed helmet overlaps. [phone-fullscreen-probe.json](phone-fullscreen-probe.json) is the diagnostic scale-failure baseline, not a passing scale acceptance. [Initial focused proof](quick-initial-results.json) and [earlier desktop fullscreen proof](fullscreen-pre-refinement.json) retain their exact earlier hashes and separate images. Failed draft test reports are excluded from accepted evidence.

Upper façades still crop in phone cover framing, as required to retain the accepted actor size. Narrow portrait panels may scroll; the checked Eat/Close controls remain reachable. At 1280×720 the preserved source page can place its lower touch row below the fold; desktop keyboard movement and visible controls passed. Phone movement/interact/pause controls were directly hit-tested and used. Physical-device and thermal testing were skipped; unlisted viewport sizes and sustained device performance are not certified here. Gamepad input is unimplemented.

Re-run with the existing Python Playwright installation and `/usr/bin/chromium`:

```sh
python tests/centrum_hud_review.py
python tests/centrum_hud_review.py --quick
python tests/centrum_hud_review.py --fullscreen-only
python tests/centrum_hud_review.py --phone-fullscreen-acceptance
node tests/centrum_inventory.cjs
```

[summary.json](summary.json) lists the accepted reports and final runtime hashes. [frames.sha256](frames.sha256) hashes every retained screenshot. The game itself still needs only the ordinary local HTTP server described in the main README.
