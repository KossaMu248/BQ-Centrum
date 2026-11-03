# Final source-foot fullscreen bag repair

Both engines passed two grouped executions: startup/valid fixture preparation, then the near-bike remount → riding bag → copied source-foot bag → same-bike/source exit cycle. This follow-up tests the final CSS repair after the earlier Firefox source obstruction.

The project inventory bar now sits at **154 px** only in expanded copied source visits. Original source fullscreen tools stay at 108 px. Normal riding, normal source visits and centrum positioning are unaffected by this selector.

| Engine | Actual fullscreen view | Bag / toolbar bounds | Result |
|---|---|---|---|
| Firefox 153 | Native virtual desktop 1366×768, requested portrait viewport | Bag y154–190; tools y108–141 | Actual hit target `inventoryOpenBtn`; native touch tap opened/closed bag |
| Linux WebKit 26.5 | Viewport fallback, landscape 844×390 | Bag y154–188; tools y108–140 | Actual hit target `inventoryOpenBtn`; native touch tap opened/closed bag |

The factory prepares the same valid original bicycle at named `from-cycle-route` (248,730), with 73 HP, food 0 and money 0. Actual Q and bag inputs follow; there are no teleports between transfers. Both checks retained exactly **73 / 0 / 0**, one bicycle/passenger ownership, grounded mounted wheels and the same route position. In source-foot mode the chair alpha was zero and the passenger used the source carrier. The scene HUD audit was null and its scene dock attribute absent. Q exited source-foot and restored riding successfully.

[Both engine records](results.json) · [Firefox](firefox-results.json) · [WebKit](webkit-results.json) · [Screenshot hashes](frames.sha256). Each before/after runtime hash set matched, and runtime/console/HTTP/external errors were zero. Firefox’s native screenshot is limited to its configured screenshot buffer; the actual native desktop dimensions and successful hit are recorded separately. The WebKit landscape capture shows its full actual viewport.

Only `css/centrum-inventory.css` changed after the preceding fullscreen geometry phase: the scoped source-fullscreen bar offset. Quest, economy, controls, transfers, character artwork and cycling physics were not modified. The full quest was not repeated for this CSS-only follow-up.

```sh
python3 tests/centrum_presentation_browsers.py --engine all --source-only --out verification/stage10/browsers/reproduction-source-fullscreen
```

The complete geometry checker is `python3 tests/centrum_presentation_browsers.py --engine all --out verification/stage10/browsers/reproduction-geometry`. Both engines are headless software tests; this is not physical iPhone/Safari testing or a mobile-performance guarantee.
