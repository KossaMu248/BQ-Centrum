# Stage14 fresh cross-browser checks

Frozen **BQ_CENTRUM_STAGE14**, local static HTTP servers on Linux. **Linux WebKit 26.5 passed 16 functional executions**; **Firefox 153.0 passed 30 smoke checks** across four root/subpath × desktop/touch-viewport groups. All runtime hashes stayed unchanged. [Combined result](results.json), [WebKit](webkit-results.json), [Firefox](firefox-results.json).

WebKit used desktop 1280×720 at scale 1. Its production-factory fixtures supply valid named scene/parking arrivals, 73 HP for scene checks and 60 HP / one food for the full task flow. After those disclosed fixtures, native controls perform the actual story, transactions and return; this is not a fresh earned cycling-route acceptance. All five scene loads/bags passed. Native up/away and down/toward movements, resting view retention, original continuous baby/collar/scale and original lower legs/shoes are asserted and captured at normal gameplay size.

The full WebKit flow passed pause/resize/resume, shop slip, reload, arcade passage, delivery inspection/caretaker approval and visible movement, shortcut, report/reward/purchase, live atomic Eat, movement-interrupted Eat without item loss, coherent reload, Q walk to the same bike, original grounded remount and copied source-foot bag. It ended the task/eating/return sequence at 80 HP; the ledger retains food 2 / money 20. Source road simulation stays held while exploring. One pending game loop and project-only storage passed, with no JavaScript/console/HTTP/external/prefix errors. [Actual native interaction video](webkit/native-network-loop.webm) is 161.08 encoded seconds at 1× after the disclosed setup; video encoding/recording overhead is not a gameplay FPS measurement.

Firefox used 1280×720 desktop and 844×390 `has_touch` viewports, scale 1, at `/` and `/BQ-Centrum/`. Firefox does not support Playwright `is_mobile`; these are viewport/touch-capability checks. Native dpad mouse-pointer holds and actual touch menu taps are labelled separately. Four Square groups passed eight authored up/down/rest assertions; all 20 scene loads/movement/native bags, both active HTML aliases and fresh native riding inputs passed. Scene fixtures kept 73 HP. No full Firefox quest flow or recording is claimed.

There are 28 real normal-size screenshots (10 WebKit / 18 Firefox), including both new angles in all tested Square groups. Original baby continuity/readability, distinct paired grounded boots and true parent silhouettes were visually reviewed in the WebKit and Firefox normal-size views. [Frame hashes](frames.sha256) and [clip hash](clips.sha256) bind the actual evidence. No generated illustration is labelled gameplay.

The full browser command invocations were:

```sh
python3 tests/centrum_cross_browser.py --engine webkit --functional-only --out verification/stage14/browsers
python3 tests/centrum_cross_browser.py --engine firefox --smoke-only --out verification/stage14/browsers
```

Physical devices, iPhone/Safari and thermal measurements remain skipped at the user's request. Linux WebKit and Firefox touch viewports are not physical-device testing. Source/engine differences and recording make these functional/visual checks, not exclusive frame-time profiles; those live separately in `../performance`. The gait still uses articulated painted parts and an oblique away view to keep the original baby visible.
