# Remount re-entry regression

The audit reproduced a same-task remount race: two valid public requests could both return false after the first had started the source transfer. The link then stayed in exploration while the pending mount animation was never advanced.

The repair checks the live source visit mode/transition before issuing another remount generation. Both regression variants now pass:

- Two same-task public requests: first succeeds, second is rejected.
- Two same-task clicks on the actual on-screen interaction button: one production transfer completes and riding resumes.

This is a deliberately stronger re-entry stress than ordinary separate keyboard taps, whose microtasks drain between events. The focused test uses a disposable browser and the existing debug warp only to prepare the authored route stop; it does not claim to satisfy the separate full native ride.

Actual sampled mount phases advance between 0 and 1. Afterward there is one bicycle/passenger, grounded wheels, controlled speed and unchanged health. Listener counts remain stable, at most one main RAF loop is pending, and no duplicate passenger draw or JavaScript/HTTP failure was detected.

[Structured evidence](results.json) · [Capture hashes](frames.sha256)

- [Public requests: production transfer](requests-production-transfer.png)
- [Public requests: single bicycle riding](requests-single-bike-riding.png)
- [DOM clicks: production transfer](DOM-clicks-production-transfer.png)
- [DOM clicks: single bicycle riding](DOM-clicks-single-bike-riding.png)

Run from BQ-Centrum: `python3 tests/centrum_remount_race.py`. System Chromium `/usr/bin/chromium`, headless desktop 1280×720. Physical devices and other engines were not tested by this regression.
