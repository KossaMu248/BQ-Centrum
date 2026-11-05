# Stage16 actual gameplay

[Aggregate result](results.json) records 12 executions covering 10 distinct scenario groups and 52 normal-size real gameplay screenshots. The final two transfer groups were repeated with numerical hint-clearance instrumentation. Chromium154.0.8037.57 ran headless at1280×720 and844×390 with CDP touch emulation, device scale1, plus a390×844 portrait resize. This is not physical-phone/Safari testing. Functional recordings are separate from the exclusive performance profiles.

Each fresh scenario/context used one disclosed original debug route stop. Subsequent primary movement, riding, braking, transfers and doors used actual inputs without teleports or health/item/quest/NPC grants.

| Run | Actual coverage |
| --- | --- |
| [Desktop primary](desktop-primary/results.json) | Native ride/Q/dismount, street movement/depth, pause, I/bag, fullscreen, source workshop entry/return, same-bike remount; actual riding/braking toCentrum, E, bag, reload and Qreturn.11 captures. |
| [Phone primary](phone-primary/results.json) | Same two groups using CDP touch controls, with portrait movement/landscape restore.13 captures. |
| [Peaceful rest](rest/results.json) | Three actual authored residents hold sit/read/smoke through32simulation seconds desktop/18phone. Quietnear-pass leaves them resting; actual grounded moving-foot contact wakes without damage/combat rewards.8 captures. |
| [Child crew](kids/results.json) | Actual original child gangsters at94 against adult128 on route,93.70625 against127.6 on street; original bottle/rock release.4 captures. |
| [Final transfer](final-transfer/results.json) | Both viewports: native transfer to carrier, carrier walking/bag, native transfer back to chair and grounded same-bike remount on finalHero.8 captures. |
| [Final transfer/hint](final-transfer-hint/results.json) | Repeats the final transfer groups with exact original baby-head Canvas bounds and visible hint DOM bounds: overlap0 desktop/phone; route-only stylesheet loaded.8 captures. |

Actual road encounters reduce100→40HP in primary runs; Centrum and reload retain40 without healing. Primary instrumentation observes one mainRAF/audio context. All successful runs have no page/console/HTTP errors or runtime hash changes within a run.

Primary/rest runs preceded the final production-transfer/boat clipping exception and route hint placement; child runs used an intermediateHero. Their original runtime/harness hashes remain in the aggregate and are **not** relabelled final. The late changes were verified by the two fresh final-transfer supplements on each viewport. Current standalone/performance/pixel/source checks separately bind the final runtime. This stage does not repeat the whole story/economy campaign.

The first rest harness attempt compared benign civilian arrival/departure counters as combat counters. That failed attempt remains in the development workspace; the corrected check permits ordinary routines while checking damage/action/reward invariants. No runtime change was needed for that correction.

Actual native1× walking recordings: [desktop7.126s](desktop-primary/desktop-source-walking.webm) and [phone10.075s](phone-primary/phone-source-walking.webm), total17.201s. They are timestamped screencasts encoded at24fps for playback; this is not a gameFPS measurement. No continuous rest clip was recorded: state traces, elapsed simulation time and before/after gameplay frames provide that evidence.

Representative actual gameplay: [final desktop carrier](final-transfer-hint/desktop/native-carrier-walk.jpg), [final phone carrier](final-transfer-hint/phone/native-carrier-walk.jpg), [shorter children](kids/phone/street-smaller-children.jpg), [quiet resting residents](rest/desktop/peaceful-after-32s.jpg), [preserved Centrum view](phone-primary/phone/centrum-wider-preserved.jpg). Reference/renderer boards live elsewhere and are labelled accordingly.

Limits: the final source-phone baby head is about14.76×15.99CSSpx, recognisable but with small fine-expression details; source interiors retain their original closer225-unit presentation. Original brief body crossfade/articulated gait remain. Ordinary sourceNPCs retain existing arena memory, without a new complete reload persistence system. Physical device/thermal tests remain skipped.
