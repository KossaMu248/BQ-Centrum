# Stage 11 Linux WebKit functional review

**Passed: 16 executions, 8 real gameplay screenshots and one actual 1× browser recording.** Linux WebKit26.5, headless on Debian13, desktop1280×720. This is not physical Safari/iPhone testing. The run took244.97s and overlapped the separate Chromium functional route; its sampled timings are not a performance benchmark.

The first seven executions check fresh startup/real pedal input, all five existing scenes with actual movement and native Settings→Bag clicks, and the active HTML alias. Scene-loading fixtures use the production save factory, named entrances, recorded valid parking and73HP. In every area the new sticky-header Bag is initially inside the viewport, without scrolling, and passes a real `elementFromPoint` hit check before clicking. Opening/closing keeps shared health unchanged.

The remaining flow starts from a disclosed production parking/60HP/one-food fixture, then uses ordinary controls for walking, pause/resize/resume, food-shop dialogue, accepting the slip, reloading, the arcade passage, cage inspection/caretaker approval, delivery movement, shortcut opening, workshop visit, report/reward/purchase, live Eat and movement cancellation, another reload, courtyard return and Q walking to the same bicycle. Production remount is grounded. Native Q then exercises the copied source-foot transfer, its header Bag and another remount. The final state is80HP / food2 /20kr; cancellation costs no food and transitions grant no health. This fixture-based engine review is separate from the fresh earned Chromium road acceptance.

All scene/functional worker samples report ready with no failure; initial fresh-ride/alias samples correctly show an unprepared worker before Centrum is opened. One main loop, project-only storage reads/writes, unchanged runtime hashes and zero JS, console, HTTP, external or out-of-prefix errors were recorded. All eight screenshot hashes were read back and match the report. Ready worker checks establish functioning integration; the separate strict renderer pixel-equivalence diagnostic remains failed and is not relabelled by this functional pass.

[Complete results](webkit-results.json) · [combined report](results.json) · [actual native interaction video](webkit/native-network-loop.webm) · [delivery acknowledgement](webkit/functional/courtyard-delivery.png) · [same-bike remount](webkit/functional/remounted-original-bike.png) · [copied source-foot](webkit/functional/source-foot-cleared-scene-hud.png) · [screenshot hashes](frames.sha256)

Two earlier attempts remain outside the package: an overstrict pre-scroll menu bounds assertion, then an intentionally interrupted old-menu run while Bag was moved to the visible header. They do not count toward this final pass. Firefox was not rerun in this stage; earlier Firefox evidence remains historical.

```sh
python3 tests/centrum_cross_browser.py --engine webkit --functional-only --out verification/stage11/browsers
```

Playwright, the project-local WebKit binary and its development libraries are testing tools, excluded from delivery. The game needs only a static local server. Physical-device testing is skipped at the user's request.
