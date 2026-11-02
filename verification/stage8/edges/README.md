# Stage 8 focused state and interaction verification

**44 browser check groups passed**, zero JavaScript/HTTP failures. **All 15 current JavaScript unit suites passed**, including seven new validation groups and a deterministic 500-operation transaction/checkpoint model. [Browser results](results.json) · [Unit results](unit-tests.json).

These are **system Chromium** checks: desktop 1280×720 (1440×1000 for the inherited parking test), touch emulation at 844×390 and portrait 390×844, plus viewport changes to 932×430. They are not physical iPhone/Safari testing. Runs used local Python HTTP servers and isolated disposable browser storage; parallel headless contexts shared the host. No runtime code was edited by this test work.

The primary complete route without debug teleporting is reported separately. This focused suite deliberately uses production save factories for starting supplies, health, quest prefixes and parking. Source debug/QA helpers shorten route travel, cause real pickup collisions, inject a combat/defeat state or temporary civilian fear. Actual keyboard/pointer/touch input then exercises the relevant game behaviour. Prepared fixtures are not presented as earned quest completion.

| Scenario | Passed checks | What ran |
| --- | ---: | --- |
| [Consumable regression](consumables/results.json) | 31 | Full bag, deferred reward pizza, funds/capacity, one-time rewards/pickups, full health, capped healing, spam, interruption, latest reload, coherent retry, corrupted saves, actual source defeat, safe encounter-abandoning recovery and landscape/portrait touch |
| [Interaction edges](interaction-edges/results.json) | 8 | Repeated E at locked square gate, remote/forged targets, pause/resume and viewport changes, frozen road, frightened essential giver across reload/recovery, cross-scene remount refusal/Q route, touch movement |
| [Rendered occlusion](occlusion/results.json) | 4 | Actual walking behind/in front of bench, collision, live jump/unchanged floor shadow and sort, original continuous baby/native scale, foliage-only fade with fixed opaque planter |
| [Parking transfers](parking-transfers/entry-evidence.json) | 1 combined group | Native moving-entry rejection, pedal/brake stop, reload during **both** animated carrier transfers, same parked coordinate, one baby/bicycle, exact health/score/pickup state, grounded wheels, at most one pending main animation loop |

The parking regression updates its historical test's food expectation to the authorized inventory behaviour: the one actual source pickup remains **one item in the bag** through transfers, rather than healing immediately. It does not alter gameplay. The new unit test verifies every authored exit/destination in both gate states, complete connectivity without either gate traversal, solid sweep boundaries, foot anchors, stable quest-prefix reloads, failed writes, stale caches and coherent retry.

**Actual gameplay evidence:** [Consumable clip](consumables/consumable-loop.webm) (16.65 seconds, 2× playback with long capture gaps capped), [locked exit](interaction-edges/01-locked-exit-refused.png), [recovered giver](interaction-edges/03-essential-target-recovered.png), [remote-bike route](interaction-edges/04-remote-bike-route-only.png), [touch resize/resume](interaction-edges/05-touch-resize-resume.png), [behind bench](occlusion/01-behind-bench.png), [live jump](occlusion/02-live-jump-grounded-shadow.png), [walked around bench](occlusion/03-around-front-bench.png), [foliage overlap](occlusion/04-foliage-only-fade.png), [dismount reload](parking-transfers/10-reload-during-dismount.png), [remount reload](parking-transfers/11-reload-during-remount.png). Each scenario folder includes PNG hashes; all were verified.

Run from BQ-Centrum:

```sh
node tests/centrum_validation.cjs
python3 tests/centrum_edge_browser.py
```

Optional `--scenario regression`, `interaction-edges`, `occlusion` or `parking-transfers` isolates a scenario. The summary consolidates completed scenario files only. Existing stage 6/7 test implementations are reused with output redirected here; historical evidence remains untouched. Screenshots accompany dynamic assertions and interaction traces; screenshots alone are not used to prove animation.
