# Baseline uninterrupted WebKit run

Linux WebKit 26.5 passed all 15 grouped executions of the native functional flow before the final Stage 10 HUD placement change. Seven are setup/scene executions; eight cover the interaction flow. The production save factory prepares parked Metro Square at 60 HP with one collected Billy’s. Walking, doors, task/slip/delivery, caretaker movement, courtyard shortcut, workshop visit, reporting, one-time reward, counter purchase, safe Eat, interrupted Eat, two reloads and same-bike Q/remount then use actual inputs without teleports between steps.

[Full result](webkit-results.json) · [Summary](summary.json) · [Real 1× gameplay clip](webkit/native-network-loop.webm) (141.36 seconds) · [PNG hashes](frames.sha256) · [Video hash](media.sha256).

The last Q sample at 10.01 seconds is already in the production remount phase; the next poll completed riding. Health remained 80, food 2 and wallet 20 kr. Runtime/console/HTTP/external-request errors were zero, with one pending main animation loop. The last 360 frame intervals had median 38 ms, p95 57 ms and maximum 343 ms in this shared headless environment. This is Linux WebKit, not Safari/iPhone. The earlier 35-second Stage 9 timeout did not recur; its cause remains unproved.
