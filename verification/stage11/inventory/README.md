# Stage 11 inventory access

The bag is now opened with **I**, or **Settings → BAG · I** on touch. The permanent bag count, wallet and floating inventory button are gone. Food and money appear only inside the opened compact bag. Square retains its separate five-heart health row; copied riding/source-foot health controls are preserved. The short live eating indicator remains visible only during its action.

Settings closes before its bag request opens. The existing inventory update waits for the old menu hold to clear; it adds no timer or animation loop. Pending requests stay separate from browsing, are cancelled on incompatible context/input changes, and never clear an explicit P pause. Closing the bag restores the visible Settings gear. Dialogue, map, transition, danger and eating rules continue through the existing controller and ledger.

Actual Chromium checks passed:

- **24 gameplay screenshots / 8 groups:** desktop and touch-emulated ride → copied source-foot → ride → parked Centrum cycles, using production Q/E transfers after a disclosed starting-save fixture. All three modes exercised held/repeated I, I close, I from Settings, native Settings/Bag clicks, focus return, paused browsing and live Eat/cancel. One intentional Eat per independent save changed 60→80 HP and food 2→1; subsequent transfers/cancellations kept **80 HP / food 1 / 40 kr**. Map/dialogue guards left no unexpected pending bag.
- **3 current-build screenshots / 1 group:** the original footer counter node remains for source updates, but its parent is actually `hidden`, `display:none` and 0×0. Square subtitle/map no longer expose a bag count. I opens the bag, and full health still disables Eat.
- Existing inventory action unit suite and JavaScript syntax check passed. Both browser runs had **zero JavaScript exceptions or HTTP failures**.

Every captured view reports **BQ_CENTRUM_STAGE11**. The inventory JS/CSS stayed unchanged during the complete successful run. Entry-point editions changed during its setup; the original entry hashes remain recorded with that scope note. The separate presentation report records the current entry hashes. Other Stage 11 renderer/worker work is reviewed separately; these are inventory-input and presentation results.

| Context | Ordinary play | I opens bag | Bag from Settings |
|---|---|---|---|
| Riding | [desktop](desktop/riding-ordinary.png) | [desktop](desktop/riding-i-open.png) | [touch](touch/riding-menu-open.png) |
| Copied source-foot | [desktop](desktop/source-foot-ordinary.png) | [desktop](desktop/source-foot-i-open.png) | [touch](touch/source-foot-menu-open.png) |
| Centrum | [touch](touch/centrum-ordinary.png) | [touch](touch/centrum-i-open.png) | [touch](touch/centrum-menu-open.png) |

[Live eating](touch/centrum-live-eat.png) · [map without bag counts](presentation/map-no-bag-count.png) · [current-build full-health bag](presentation/current-build-i-bag.png)

The starting receipt, money, food and health are production-factory fixtures, not a claim to replay the earned story task. The secondary presentation check uses the public prototype entry and is labelled separately. Screenshots are actual browser gameplay, not generated illustrations. Chromium **154.0.8037.57 on Linux** used **1280×720 desktop** and **844×390 mobile/touch emulation**, device scale 1. Physical-device testing was skipped; no iPhone/Safari certification is claimed.

Re-run from the project root with the existing Playwright/system Chromium setup:

```sh
python tests/centrum_inventory_access.py
python tests/centrum_inventory_access.py --presentation-only
node tests/centrum_inventory.cjs
```

[Complete results](results.json) · [presentation results](presentation-results.json) · [summary](summary.json) · [screenshot hashes](frames.sha256)
