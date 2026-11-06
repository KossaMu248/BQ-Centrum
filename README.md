# BQ-Centrum

An independent, locally runnable prototype based on pinned **KossaMu248/BQ-Autumn** source. It retains the illustrated autumn ride, original baby and bicycle, connected to five compact walking areas and one complete task, **The Wrong Entrance**. Centrum adds two approved matching bear-only viewing angles while retaining the original baby renderer.

Play the published HTML: **https://kossamu248.github.io/BQ-Centrum/**.

## Start exactly

Get the source from [KossaMu248/BQ-Centrum](https://github.com/KossaMu248/BQ-Centrum), or build a fresh delivery with the package tool. A fresh `delivery/BQ-Centrum-validated.zip` is produced by `python3 tools/package-project.py`; its exact archive test certificate is external to that ZIP. For a fresh checkout:

```sh
git clone https://github.com/KossaMu248/BQ-Centrum.git
cd BQ-Centrum
```

In the **BQ-Centrum** directory containing `index.html`, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/**. Choose **LET’S RIDE**. Stop the server with **Ctrl+C**. There is no build, package installation, account, donor checkout or donor website dependency. Use a local HTTP server for the relative asset/manifest requests.

To serve under a repository subpath, start the server from the **parent** of the `BQ-Centrum` folder instead:

```sh
python3 -m http.server 8001 --bind 127.0.0.1
```

Open **http://127.0.0.1:8001/BQ-Centrum/**. Both `index.html` and the manifest’s `autumn-v19.html` entry are active, matching small HTML files. The clean package is checked at the root and under this subpath.

Stage20 makes walking brisker: Centrum200/80world units per second instead of130/52, and ordinary copied-street walking180instead of120. Stronger braking keeps stopping precise. Camera, original character/gait geometry, collision footprints, cycling/damage and special combat/water movement remain. [Actual results and limits](TEST_REPORT.md).

## Implemented scope

- Original cycling route, physics, damage, source artwork and production carrier transfers.
- **Metro Square ↔ Shopping Arcade ↔ Service Courtyard**, plus walkable **Billy’s Food Shop** and **Bicycle Workshop** off the arcade.
- A courtyard gate initially locked from the square side. Open it from the courtyard; afterwards it works both ways. The arcade route always reaches the task.
- Collision-aware walking, foot-anchor depth order, bounded shallow camera, a discovered-area map without fast travel, and three peaceful source residents with recoverable routines.
- One quest: accept the shopkeeper’s A5 slip, inspect B-04, present the slip to the caretaker, confirm the parcel, wait for the caretaker to move it, and report to the shop. Commercial cargo and documents are separate from edible food.
- A compact consumable economy: **five hearts / 100 HP**, **3 Billy’s maximum**, **+1 heart / 20 HP per pizza**, **20 fictional kr** per purchase. Redeem the task’s **40 kr + 1 Billy’s once** at the counter. Full bags keep the food entitlement reserved independently of money.
- Persistent authored wild pickups, atomic purchases/eating/rewards, coherent latest saves and complete retry checkpoints. No inventory/economy expansion or extra campaign was added.
- Restrained floor leaves, reduced-motion support, source foliage occlusion, small quest text and brief original baby expressions. Three environment-only gate, passage and cage assets now fill the reviewed gaps; see [provenance](assets/centrum/PROVENANCE.md). Original source character files remain intact; the approved new parent views are separate. Shallow depth steps now follow actual floor travel without changing actor scale or facing. The five-heart health row and compact bag/eating panels choose clear positions around the player, including narrow portrait views. Food and money appear only while the bag is open; I toggles it, and Settings → Bag provides touch access. Phone fullscreen retains that same readable scene presentation.

## Controls and route

| Situation | Keyboard | Touch/browser equivalent |
| --- | --- | --- |
| Ride | **↑ / W** pedal; **↓ / S** brake, then reverse; **← → / A D** lean; **Space** hop | Ride pedal/brake/lean/hop buttons |
| Park at Centrum | Stop with grounded wheels beside **CENTRUM · PARK HERE**, about **1.1 km** on the HUD; **E** | **Centrum · Park & enter** |
| Walk | **Arrows / WASD**; **Space** jump | Direction pad; two fingers support diagonals |
| Door/counter/parcel | Approach with a clear path, then **E / Enter** | Labelled interaction button; dialogue choices |
| Close dialogue | **Escape** | Close button |
| Map / pause / fullscreen | **M / P / F** | Map, Pause and ⛶ buttons |
| Bag | **I** toggles the bag; Tab/Enter selects **Eat** | Settings ⚙ → **BAG · I** → Eat / Cancel |
| Return to bike | **Q**; walk the indicated connections from another area | Back to bike |
| Retry checkpoint | **C**; **R** also retries while riding | Bag → Retry checkpoint |
| Original source on-foot combat | **G** grab/throw; **J** attack | Existing source on-foot controls |

Ride to the marked stop, stop and park. The original sequence transfers the baby into the carrier and parks the same bicycle in Metro Square. The bicycle stays outside shops. **Q** can walk to it within the same navigable square; elsewhere it shows a route back, with no teleport through walls. Approach the same parked bike and interact to remount using the original animation, then ride on. F3 retains source settings/debug helpers, but they are unnecessary for normal progression.

Move clear of an arrival threshold before using another exit. Doors require proximity and an unobstructed approach. The layout is stylised Hässelby-inspired scenery, not accurate geography.

## Eating, recovery and saves

Browsing the bag holds the simulation. **Eat** resumes live play for a **1.2-second** action and requires being stopped, grounded and outside active combat/danger. Moving, pausing, taking damage, changing areas, backgrounding or cancelling keeps the item and grants no healing. Full health keeps food. Wild Billy’s enter the bag rather than healing; **Bag full** leaves the pickup untouched.

Normal reload restores the latest committed state. Retry restores one complete checkpoint—health, food, money, collected IDs, quest/reward flags and location together. Durable task/reward completion, the shortcut and route checkpoints advance it. With **zero money, no food and below two hearts**, **Abandon encounter & rest** returns to a safe checkpoint at two hearts, resets encounters and grants no takeaway food. It cannot retain damage dealt to enemies while refilling health.

The existing `bq-centrum:scene-network:v1` document owns the adventure (schema 2 / layout 3), including the established quest, parking, resident and source-adventure components. Earlier **BQ-Centrum** keys can upgrade into it. Donor keys are never imported, cleared or written. Browser storage must be writable to commit progress. Ports/origins have separate browser saves, so the two local-server examples do not share a save.

## Verification and package

Read the compact [TEST_REPORT.md](TEST_REPORT.md) for actual test conditions, repairs, results and limitations. [Stage22 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage22/README.md) records the walking-layer and body-motion repair. [Stage21 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage21/README.md) records the wider camera, visible-edge rendering and preserved street combat. [Stage20 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage20/README.md) preserves faster walking and stopping/collision checks. [Stage19 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage19/README.md) preserves compact seating and sparse placement. [Stage18 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage18/README.md) preserves the shared-bench redesign and injured-eye repair. [Stage17 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage17/README.md) preserves the earlier prop-fit attempt rejected by the user. [Stage16 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage16/README.md) preserves source-street CPU/cache fixes, actual gameplay, peaceful rest and child/NPC review. [Stage15 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage15/README.md) preserves the wider Centrum-camera review. [Stage14 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage14/README.md) preserves entry timing and knee-animation verification. [Stage13 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage13/README.md) preserves the original angle and native-baby compositing review. [Stage 11 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage11/README.md) covers walking performance/poses and on-demand inventory; [Stage 10 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage10/README.md) preserves its HUD and browser checks; [Stage 9 evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage9/README.md) keeps the earned ride and gait review; the [Stage 8 full-route evidence](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage8/README.md) remains available. Prior [Stage 7 art review](https://github.com/KossaMu248/BQ-Centrum/blob/main/verification/stage7/README.md) remains available. Historical earlier evidence stays in the development workspace, outside the clean delivery.

Development verification needs Python Playwright, system Chromium at `/usr/bin/chromium`, Node.js and ffmpeg for recordings; the game itself needs none of those beyond a static server/browser. The cross-browser check additionally expects Playwright Firefox/WebKit binaries in `.test-browsers` (`PLAYWRIGHT_BROWSERS_PATH=.test-browsers python3 -m playwright install firefox webkit`) and the host libraries required by those engines. Test-browser binaries/libraries are excluded from delivery.

```sh
python3 tools/verify-source-integrity.py
node tests/centrum_validation.cjs
node tests/centrum_depth_gait.cjs
node tests/centrum_walk_pace.cjs
python3 tests/centrum_complete_route.py --out verification/stage16/full-route
python3 tests/centrum_edge_browser.py
python3 tests/centrum_remount_race.py
python3 tests/centrum_combat_validation.py
python3 tests/centrum_remaining_review.py
python3 tests/centrum_cross_browser.py --engine webkit --functional-only --out verification/stage16/browsers
python3 tests/centrum_cross_browser.py --engine firefox --smoke-only --out verification/stage16/browsers
node tests/centrum_hero_cache.cjs
python3 tests/centrum_inventory_access.py
node tests/centrum_directional_rig.cjs
node tests/centrum_camera.cjs
node tests/centrum_route_camera.cjs
node tests/centrum_npc_rest.cjs
node tests/centrum_prop_fit.cjs
node tests/centrum_street_bench.cjs
node tests/centrum_bench_occupancy.cjs
node tests/centrum_bench_density.cjs
node tests/centrum_damage_eyes.cjs
python3 tests/centrum_damage_eyes.py
node tests/centrum_npc_render.cjs
node tests/centrum_pouch_cache.cjs
node tests/centrum_native_cache.cjs
python3 tests/centrum_camera_review.py --out verification/local-camera-review
node tests/centrum_warmup_scheduling.cjs
node tests/centrum_scene_preparation.cjs
python3 tests/centrum_source_integrity.py
python3 tests/centrum_actor_provenance.py
python3 tests/centrum_stage16_browser.py --out verification/local-gameplay --clip
python3 tests/centrum_stage22_browser.py --phase after --out verification/local-stage22
python3 tests/centrum_mode_performance.py --out verification/local-performance --label desktop
python3 tests/centrum_npc_render_browser.py --out verification/local-npc-review
python3 tests/centrum_package_codec.py
python3 tools/package-project.py
python3 tests/centrum_standalone.py
```

`tools/package-project.py` creates the clean archive and SHA256 sidecar using an explicit allowlist. It excludes Git metadata, the donor inspection archive, credentials, disposable development/browser/Python caches, raw recording frames and obsolete HTML builds. **`assets/cache` contains required immutable source-prepared artwork/manifests**, not disposable development caches, and remains included with its original fallbacks. `PACKAGE_MANIFEST.json` hashes every payload file.

## Attribution and limits

Source: **KossaMu248/BQ-Autumn/main**, commit `da109213fdf24947c2ac0b85de900214cc72e44f`, build `AUTUMN_RIDE_ART_V19`. Upstream attribution also identifies **KossaMu248/BQ**, commit `65313c9e708e420999cd10c209f1b6fda1d29f31`. Original game/code/art retain their original ownership. [SOURCE_BASELINE.md](SOURCE_BASELINE.md) records provenance, loader precedence, character references and the precise integration changes.

System Chromium 154, Firefox 153 and Linux WebKit 26.5 were exercised as detailed in the test report. Physical-device and thermal testing were **skipped at the user’s request**. Linux WebKit and touch emulation do not constitute physical iPhone/Safari tests. Keyboard and touch controls are supported; gamepad mapping is not implemented.

Centrum uses a uniform 0.60 camera and the copied route uses 0.80: each shows 25% more world width and height than Stage20. The original 200-unit Centrum rig projects to 120 pixels; baby proportions, expressions and attachment stay native. The camera preserves the road anchor, aligns combat overlays and includes newly visible edge objects. The original title stays at 1.35; legacy copied rooms/gardens retain their closer framing. The same five compact scenes remain, with quiet nonwalkable margins where the whole map fits. Existing street combat remains available; Centrum is the peaceful exploration network. No overhead conversion, character regeneration or new floor is implied.

In the earlier Stage16 measurements on the shared Linux host, source walking CPU medians fell from26–28ms to about3ms; repeated start/stop no longer bakes transient bodies on the main thread. Actual frame intervals still vary16.7–33.3ms and occasional host stalls remain, so this is not a universal60FPS guarantee. Source entry measured about6.3seconds versus10.4 before, including established animations/preparation. Original transfer/boat clipping stays exact and retains its brief rendering cost. Runtime body caches are bounded and share one worker.

The bear now uses separate ownership for shorts and calf pixels, continuous moving trouser hems and coordinated torso/pelvis motion. Original distinct boots stay rigid, with restrained roll. Repaired source walking uses a 0.85 visual stride and compensating phase distance; controller speed is unchanged. Front/back carrier art and native baby expressions/attachment remain intact. Original default rendering and transfer/combat poses remain protected.

NPC walks now use original whole-pose keys (4 or2), so motion is visibly keyed rather than continuously redrawn. Resting applies to authored peaceful sit/read/smoke; combat knockdown recovery remains unchanged. Existing arena state persists across visits, without claiming a new complete ordinary street-NPC reload system. The original source phone baby remains recognisable but fine face/expression detail is small. Physical phones/Safari/thermal remain skipped. The historical source-worker pixel-equivalence diagnostic remains failed; new pouch/protected-baby tests are separate, with all protected probes exact and original transfer/boat pixels unchanged. Full conditions and per-run hash scope are in the current report.

The user authorized publication to the independent **KossaMu248/BQ-Centrum** repository. This project retains its own Git history/configuration; no donor Git metadata, repository, save keys or deployment was modified. The user also approved GitHub Pages; the playable target is linked above. The repository provides a compact Pages artifact containing the runtime, all original assets and attribution, while retaining historical evidence in Git. Current branch-based hosting has not exposed the compact artifact manifest after Stage22, so the final published artifact size is unverified; the live game code/assets were independently byte-checked. See GITHUB_PUBLICATION.md for this hosting limitation. Publication details and observed versions are recorded in GITHUB_PUBLICATION.md.
