# Stage 10: complete WebKit flow and HUD regression

The **pre-fullscreen-refinement** Linux WebKit **26.5** flow passed through the complete task, economy, reload and same-bike remount. Firefox **153.0** passed the corresponding root/subpath desktop and touch-viewport regression. Their exact raw hashes and records remain unchanged under `final/`. Later changes only refine UI geometry and HTML asset version markers; the quest, economy, input and physics handlers are unchanged. Physical devices were explicitly skipped; this is not Safari or physical iPhone testing.

| Recorded run | Actual result |
|---|---|
| WebKit baseline, before final HUD repair | 15 grouped executions passed |
| WebKit pre-fullscreen-refinement HUD, native flow plus copied source-foot regression | 16 grouped executions passed |
| Firefox pre-fullscreen-refinement HUD, root/subpath × desktop/touch viewport | 30 grouped executions passed |

The original Stage 9 35-second return timeout did not recur in either complete WebKit run. The final Q trace shows genuine walking from the courtyard-gate arrival at 1300,820 to the original parked bicycle, followed by the production transfer: the last sample at 9.95 seconds is already remounting; the next poll completed riding. The historical timeout remains preserved in [Stage 9](../../stage9/browsers/README.md); its underlying cause was not established. Cycling physics and runtime Q navigation were unchanged.

**Current geometry acceptance:** [fullscreen/object-fit phase](fullscreen-final/README.md) checks all five scenes and preserves the source obstruction found during its Firefox follow-up. The [final source-toolbar repair phase](source-fullscreen-final/README.md) then passes both engines with a real bag hit below the toolbar, same bike/passenger and unchanged supplies. The main 16/30 runs and clips below were captured before these geometry refinements; the full quest was not rerun for CSS/projection-only changes.

[Aggregate results](results.json) · [Pre-refinement main engine records](final/results.json) · [PNG hashes](frames.sha256) · [Media hashes](media.sha256) · [Baseline records](baseline-webkit/README.md)

## Actual input and disclosed starting state

Each full native flow starts from a **production-factory parking fixture**: Metro Square, 60 HP and one previously collected Billy’s. It then uses keyboard/pointer input without teleporting between steps: square → arcade → food shop/slip → reload → arcade passage → courtyard inspection/slip/parcel approval → caretaker cargo movement → gate/square → workshop → shop/report/reward/purchase → safe Eat → interrupted Eat → reload → courtyard shortcut/square → Q walking → same original bicycle/remount.

The final run additionally opens/closes the bag after remount, then uses the copied production Q dismount to the existing source street, opens/closes the bag there, and Q-remounts again. Both outside-scene checks recorded `layout=null` and no `data-scene-dock`. Final shared state remained **80 HP, food 2, 20 kr**; menu browsing changed no health, food or money. These prepared-start results are separate from the earlier fresh no-debug Chromium ride acceptance.

Seven of each full run’s executions are setup/scene checks; eight cover the native centrum interaction flow. The final sixteenth execution checks source-foot behaviour. Counts describe grouped executions rather than distinct features.

Firefox’s 30 executions cover both `index.html` and `autumn-v19.html`, local `/` and `/BQ-Centrum/`, all five rendered scenes, native walking and bag controls. Its **20 scene instances** each open/close the rendered bag by actual click or touch tap, record button/panel geometry and check unchanged health. All recorded centrum HUD-clear flags were true, with native source baby-face continuity flags retained. Two extra group records cover sustained d-pad pointer holds; they reuse the corresponding bag action and are not extra distinct bag actions.

Both pre-refinement main engine runs recorded **zero runtime exceptions, console errors, HTTP failures, external requests or requests escaping the repository subpath**. Source HTML/JS/CSS hashes matched before and after each run, with no runtime drift. Captured main-loop metrics never exceeded one pending main game callback. These records supplement the separate normal-size visual character comparison; audit flags alone are not visual proof.

## Pre-fullscreen-refinement gameplay evidence

- WebKit final: [square](final/webkit/functional/root-desktop-metro-square.png), [food room](final/webkit/functional/root-desktop-food-shop.png), [delivery approval](final/webkit/functional/courtyard-delivery.png), [workshop](final/webkit/functional/workshop-native-arrival.png), [original bicycle remounted](final/webkit/functional/remounted-original-bike.png), [copied source-foot HUD reset](final/webkit/functional/source-foot-cleared-scene-hud.png).
- Firefox final: [square desktop](final/firefox/smoke/root-desktop-metro-square.png), [square phone viewport](final/firefox/smoke/root-touch-viewport-metro-square.png), [food room phone viewport under subpath](final/firefox/smoke/subpath-touch-viewport-food-shop.png).
- [Walking video frame](final/webkit/functional/return-walking-frame.png): the actual full-size frame at 10.00 seconds in the short clip (133.60 seconds in the full recording), checked for visible baby/helmet and unobscured HUD.
- [Short return/remount clip](final/webkit/return-remount-1x.webm): actual **1×**, **30.00 seconds**, taken from seconds 123.60–153.60 of the final recording; includes the return and source-foot regression. [Exact clip metadata](clip.json).
- [Full final WebKit native flow](final/webkit/native-network-loop.webm): actual **1×**, **153.60 seconds**, 18,240,184 bytes, including the final source-foot regression. [Baseline full native flow](baseline-webkit/webkit/native-network-loop.webm): actual **1×**, 141.36 seconds. These are real browser recordings, not generated illustrations or a series of screenshot assertions.

## Conditions and reproduction

The final engine runs overlapped the Chromium HUD gallery on the same host for at least part of their duration. Their frame intervals are **shared-host functional measurements**, not isolated performance benchmarks. WebKit’s last 360 centrum intervals had median 41 ms, p95 62 ms and maximum 353 ms; the subsequent source-foot sample had median 46 ms, p95 85 ms and maximum 426 ms. One representative final Firefox touch-view scene sampled median 25.07 ms, p95 66.22 ms and maximum 232.02 ms. Raw per-context samples are retained. Sustained mobile/thermal performance is untested.

```sh
python3 tests/centrum_cross_browser.py --engine webkit --functional-only --out verification/stage10/browsers/reproduction-webkit
python3 tests/centrum_cross_browser.py --engine firefox --smoke-only --out verification/stage10/browsers/reproduction-firefox
```

The harness defaults to Stage 10 output and rejects output paths outside BQ-Centrum. Q waits observe actual progress for at most 120 seconds and preserve the active page’s Link/Square/visits state and metrics on failure. Python compilation passed. Playwright browser builds are Firefox 1538 and WebKit 2336, using project-local development binaries/libraries under ignored `.test-browsers/`; those are excluded from delivery. [Engine installation and WPE conditions](../../stage9/browsers/README.md) remain applicable.

Firefox uses a 1280×720 desktop or 844×390 `has_touch` viewport, device scale 1; Playwright does not support its `is_mobile` option. Sustained d-pad holds use native mouse PointerEvents because the touchscreen driver exposes tap rather than held contact; menu actions use native touch taps. Linux WebKit uses WPE headless, not Safari. Physical touch ergonomics, Safari, physical phones, gamepads and sustained mobile/thermal behaviour remain untested.
