# Firefox and Linux WebKit evidence

Actual headless Firefox **153.0** and Linux WebKit **26.5** ran the local project. This is not physical iPhone, Safari, or mobile Firefox testing. Physical devices were explicitly skipped. Screenshots are real game renders at 1280×720 desktop or 844×390 phone-landscape viewport; no character artwork was regenerated.

| Suite | Firefox | Linux WebKit |
|---|---|---|
| Root/subpath startup, all five scenes, native movement, touch controls and both HTML entries | 30 executions passed | 30 executions passed |
| Native scene/task/economy/reload/remount flow | 15 executions passed | 13 executions passed, then final Q/remount wait exceeded 35 seconds |
| Final focused Q/remount, final illustrated passage arrival and jamb collision | 5 executions passed | 5 executions passed |

Counts include repeated setup/startup checks and are not counts of distinct features. The original uninterrupted WebKit functional run remains failed in its JSON. Its timeout actor state was not captured: failure instrumentation referenced an already closed outer page. A separate post-quest fixture at the same square entrance completed real Q walking and the original grounded remount in about 12 seconds. That pass does not erase the earlier timeout or establish its cause.

[Aggregate and current capture hashes](results.json) · [PNG hashes](frames.sha256) · [video hash](media.sha256)

Raw records: [Firefox startup/scene suite](firefox-smoke-results.json), [Firefox functional flow](firefox-functional-results.json), [Firefox final focused checks](firefox-final-results.json); [WebKit startup/scene suite](webkit-smoke-results.json), [WebKit partial functional flow](webkit-functional-results.json), [WebKit final focused checks](webkit-final-results.json). `*-results.json` aliases hold each engine's latest five-check focused run. Historical capture paths overwritten by later real captures are explicitly listed as superseded, with original hashes retained; they are not claimed to match current files.

## Actual interaction and fixture scope

The startup tests begin with an ordinary ride input. Scene tests prepare validated adventure saves using the production factory. The functional run begins parked in Metro Square at 60 HP with one previously collected Billy's and then uses real keyboard/pointer input for walking, pause/resize, doors, the slip, delivery cage/caretaker confirmation, the courtyard shortcut, workshop visit, reporting/reward, purchase, safe Eat, interrupted Eat, reload and same-bike remount. There are no teleports between those functional steps. This prepared start is separate from the parent report's fresh no-debug Chromium ride-to-remount acceptance.

The final focused run prepares a disclosed completed-quest state (80 HP, food 2, 20 kr) at square arrival 1300,820, then uses actual Q and waits for observed walking/remount progress. The passage test prepares the courtyard and uses the actual exit, checks the named arcade arrival at 1048,586, then holds movement into the final jamb footprint. Native depth movement runs with the final 60-unit depth speed and unchanged 200-pixel actor scale.

Both engines recorded zero runtime exceptions, console errors, failed local HTTP responses, external runtime requests or requests escaping the subpath in these final suites. Captured metrics include one pending main animation loop, listener registrations, health/quest/save state, frame intervals and native source baby-face continuity flags. These automated flags supplement the separate normal-size character comparison; they are not visual proof by themselves.

## Normal-size views and motion

- Firefox: [square desktop](firefox/root-desktop-metro-square.png), [food room desktop](firefox/root-desktop-food-shop.png), [square phone viewport](firefox/subpath-touch-viewport-metro-square.png), [delivery](firefox/courtyard-delivery.png), [workshop](firefox/workshop-native-arrival.png), [final passage collision](firefox/last-steps/final-passage-jamb-collision.png).
- WebKit: [square desktop](webkit/root-desktop-metro-square.png), [food room desktop](webkit/root-desktop-food-shop.png), [square phone viewport](webkit/subpath-touch-viewport-metro-square.png), [delivery](webkit/courtyard-delivery.png), [workshop](webkit/workshop-native-arrival.png), [final passage collision](webkit/last-steps/final-passage-jamb-collision.png), [same original bike remounted](webkit/last-steps/final-q-return-remounted.png).
- [Firefox native network loop](firefox/native-network-loop.webm): actual 1× recording, **238.68 seconds**, 28,094,203 bytes. Includes the disclosed prepared exploration start and native interactions through remount. The failed WebKit flow recording was unfinalized and discarded; its screenshots and state/input trace are retained. The main Stage9 walking and fresh-route clips provide additional actual motion evidence.

## Conditions and reproducibility

The Playwright browser builds are Firefox1538 and WebKit2336. Runtime binaries and extracted Debian13 browser libraries were installed only under ignored `.test-browsers/`; they are development tooling and excluded from delivery. WebKit uses the Linux WPE headless backend. Its host requirement preflight cannot discover the project-local libraries; actual browser launch and rendered interaction were tested with those libraries in `LD_LIBRARY_PATH`.

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/.test-browsers" python3 tests/centrum_cross_browser.py --engine firefox --smoke-only
PLAYWRIGHT_BROWSERS_PATH="$PWD/.test-browsers" python3 tests/centrum_cross_browser.py --engine webkit --smoke-only
PLAYWRIGHT_BROWSERS_PATH="$PWD/.test-browsers" python3 tests/centrum_cross_browser.py --engine firefox --functional-only
PLAYWRIGHT_BROWSERS_PATH="$PWD/.test-browsers" python3 tests/centrum_cross_browser.py --engine webkit --last-steps-only
```

The harness sets local library paths where present. A future suite invocation writes its current `results.json`; the curated aggregate here records all archived scopes. Sustained d-pad holds use actual mouse-generated PointerEvents because Playwright's touchscreen API exposes tap rather than held contact; bag controls use native touch tap. Firefox has-touch viewport mode does not emulate a mobile engine. Browser fullscreen/physical touch ergonomics, gamepads, sustained mobile/thermal performance remain untested. Shared-CPU frame times include cold loading stalls: the focused WebKit return sampled median45ms/p9579ms/max371ms, while an earlier cold scene sample reached median136ms/p95459ms. These measurements are not device FPS guarantees.

After these recorded runs, the reproduction harness was hardened to observe native return progress for up to120seconds in both flow modes and capture the active flow page’s Link/Square/metrics on failure. That test-only change passed Python compilation; the long flow was not rerun and the original35second WebKit timeout remains recorded above.
