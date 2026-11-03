# Stage11 earned route — passed

Fresh disposable Chromium154,1280×720 Linux headless. Ordinary ride/walk/interact input; no debug warp, teleport, health/quest/wallet/food setter or prepared save. All15 executions passed with825 local requests,11 capture steps and zeroJS/HTTP errors.

Rode the original road, collected its authored pizzas and received real road injuries; stopped/parked with the original transfer; entered Square→Arcade→shop, accepted the slip, walked the visible passage, inspected/confirmed B-04 and had the caretaker move it; opened the courtyard shortcut; returned/reported/claimed once/bought; selected and ate safely; returned to the same bicycle, remounted with grounded wheels and rode on. Three reloads retained the earned quest/gate/reward/purchase state. Only intentional Eats healed; area transitions did not. Final70HP /food2 /20kr.

Instrumentation found max1 pending main loop, zero passenger-ownership violations and stable expected listener registrations across the three reloads. Transfer-heart samples match shared70HP during the final mount. Full traces are in [results.json](results.json).

[Actual route recording](wrong-entrance-loop.webm):255.22seconds captured, shown at3× with reload gaps capped to2seconds. It is browser gameplay, not generated artwork and not an FPS benchmark. [Frame hashes](frames.sha256) preserve normal-size screenshots.

The final Bag button was moved from the bottom to the sticky header of the existing Settings menu during this run. JavaScript/CSS/renderer/physics stayed frozen; I handles this keyboard route throughout. The separate final WebKit/extracted-package pointer tests verify the final top-header menu. This markup timing is disclosed rather than claiming a single frozen HTML hash across this route.
