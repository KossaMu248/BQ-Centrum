# Stage20 native movement acceptance

[Summary](results.json), [baseline receipt](before/results.json), [after receipt](after/results.json). Four fresh contexts before and four after: original copied street and Metro Square, each desktop1280×720 and Chromium CDP touch844×390, scale1. Chromium154.0.8037.57 headless. These are actual held controls and production simulation updates; wall time is recorded separately. No FPS or physical-device claim.

Each context uses one original route-stop helper, then native dismount/park, held movement, door, pause/bag and same-bike remount controls. No later scene teleports, health/item grants or NPC fixture. All eight preserve100HP, grounded remount with baby mounted and one pendingRAF, with namespaced storage and no JS/console/HTTP errors. AFTER has no runtime hash drift.

| Cardinal movement | Before | After |
|---|---:|---:|
| Copied ordinary street horizontal |120|180|
| Copied street depth |140|140|
| Centrum horizontal |130|200|
| Centrum depth |52|80|
| Centrum projected horizontal/depth |97.5/39|150/60|

Units are world units per simulation second; projection row is logical screen pixels per simulation second. The source camera remains1.0 and Centrum.75. Both AFTER input modes give normalised source diagonal127.279/98.995 and square141.421/56.569 world rates. Released velocity settles; AFTER bench-west stops held downward input at y543.36–543.52 (limit544.2). Native square→arcade→square returns through named from-arcade arrival. Pause and inventory block movement. Health remains100 through controls and native remount.

The baseline is Git commit5af70787eff81586dcbf67bc25b208fb7a63d8a5. Read-only response fulfilment serves its HTML/JS/manifest while target implementation proceeds; original artwork is unchanged. Baseline working-tree hashes can drift and are not its source identity. The final harness adds physical-held event filtering; BEFORE short touch diagonals include dispatch/release tails, so only cardinal rates are compared. Release-travel fields include automation timing and are not analytic stopping distances. Receipt hashes and each harness hash are in the summary.

Three preserved attempts are excluded: missing legacy camera probe (two setup runs), then an AFTER collision probe sampled after key release. The final probe samples while held; no game workaround or relaxed wall boundary was needed.

A separate private normal-size review in ignored delivery/stage20-motion-review uses actual six temporal UP/DOWN frames and4.594seconds of native1×capture. The paired boots remain coherent across sampled phases, with no observed tearing/spinning; original continuous baby remains visible and approved frontal/oblique views remain. Gait is brisk articulated painted artwork. This is not proof of fully organic animation. No new public screenshots or clip are added.

Reproduce from repository root (Playwright and system Chromium required):

```sh
python tests/centrum_stage20_browser.py --phase after
```

This focused pass does not rerun the full quest/economy/browser-engine matrix. Physical phones/Safari and thermal testing remain skipped at the user's request.
