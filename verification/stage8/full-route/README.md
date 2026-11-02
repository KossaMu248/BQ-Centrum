# Complete earned route — actual gameplay

**Passed from a fresh browser context without debug teleporting or state setters.** The player rode the copied road with ordinary pedal/brake controls, collected three authored wrappers and took real road damage (100 → 10 HP). At the marked stop, the production dismount parked the original bicycle and transferred the one baby. Two real selected eating actions restored10 → 30 → 50 HP, leaving food1 before accepting the task.

The same adventure then completed **Metro Square → food shop/slip → arcade passage → courtyard inspection/slip approval/B-04 confirmation → caretaker delivery → courtyard gate → square → report at shop → one-time40kr+1Billy’s →20kr purchase → selected safe Eat → same bicycle → production remount → ride**. The final state was **70 HP, food2, wallet20kr**, exactly matching three consumptions, the one-time reward and one purchase. No transition granted health.

Reloads at the earned slip, opened shortcut/approved delivery and completed purchase retained the coherent quest, food, money, health, pickup IDs and parked-bike identity. Actual transfer phase samples, foot movement, live eating durations and the recording provide animation/interaction evidence beyond screenshots. All page lifetimes kept one pending main animation loop, unchanged listener-registration shapes and zero sampled duplicate passengers.

[Structured results and native road samples](results.json) · [Actual complete-loop clip at3× speed](wrong-entrance-loop.webm) · [PNG hashes](frames.sha256).

## Actual captures

- [01-fresh-ride.png](01-fresh-ride.png)
- [02-rode-to-stop.png](02-rode-to-stop.png)
- [03-production-dismount.png](03-production-dismount.png)
- [04-metro-square.png](04-metro-square.png)
- [05-accepted-task.png](05-accepted-task.png)
- [06-caretaker-delivery.png](06-caretaker-delivery.png)
- [07-open-shortcut.png](07-open-shortcut.png)
- [07-production-remount.png](07-production-remount.png)
- [08-bought-pizza.png](08-bought-pizza.png)
- [09-selected-and-ate-safe.png](09-selected-and-ate-safe.png)
- [10-remounted-original-bike.png](10-remounted-original-bike.png)
- [11-ride-resumed.png](11-ride-resumed.png)

## Test conditions and limits

System `/usr/bin/chromium`, headless, 1280×720, native clock and actual keyboard/browser controls, isolated local HTTP server and disposable empty storage. No health, inventory, wallet, quest or source-physics setter was used. Frame timings include loading/scene changes and concurrent container work; they are not physical-phone or Safari results. Three preliminary driver attempts adjusted test assumptions; the recorded final path is one continuously earned adventure, including its reloads. No runtime files were changed by this test.

Run `python3 tests/centrum_complete_route.py` from BQ-Centrum. `--road-only` is a diagnostic that stops before the quest. The script’s read-only audits guide native inputs; it never calls a debug warp.
