# Stage 12 — Anatomical near/far leg identity

This corrects the published Stage 11 leg construction; it does **not** supply new up/down viewing angles. The old direction logic still selects a three-quarter source view plus lean poses. Genuine directional art remains a separate root task.

## Confirmed defects and repair

- The published renderer mapped the larger foreground contact shoe to the small idle-shoe width, while enlarging the background shoe to the large foreground width: **near 34.54 / far 42.13 pixels** at logical hero 200. The repaired pair preserves their total mass but follows the production profile's 125:108 proportions: **near 41.13 / far 35.54 pixels**. Both remain different original contact-source regions; neither is cloned or mirrored per leg.
- Source-idle index ordering does not match anatomical depth. The foreground calf now uses the larger central source-fur patch and the background calf its smaller source-left patch; each attaches to its corresponding production trouser opening. The narrow extra source-right orange column has no independent boot and is excluded using a measured source-space contour. Original pants/torso/baby pixels remain unchanged.
- Internal side/front leg paint order is consistently **the complete far calf+boot, then the complete near calf+boot**, with native pants last. Swing lift cannot swap which limb faces the camera. The scene still sorts the whole actor by its ground anchor; jumping and shadows remain independent.

The default source renderer branch and cycling simulation are unchanged. The bounded worker serializes the same amended functions/profile data; no new worker, RAF, input listener, save, art file or framework was added.

## Actual verification

[Published baseline](before/results.json) overlays only `hero-rig.js` from target commit `e5b0daa58ea5bdbddc866767badea86901169290` in memory. [Repaired gameplay](after/results.json) uses the working candidate. Each contains 13 full 1280×720 gameplay screenshots at normal logical actor 200, after a disclosed source debug-stop setup, native E transfer and ordinary walking to a clear floor lane. There is no teleport after initial parking. Before/after are comparable gameplay sequences, **not identical animation phases**.

[Actual repaired walking clip](after/walking.webm) captures 10.08 seconds at 1×, including right/left/up/down movement.24 fps is its encoding rate, not a game-FPS claim. Selected extracted moving frames and the 13 full screenshots were inspected: the foreground boot is larger/lower, the background boot smaller/behind, calves remain separate and the extra fur column is absent. This is a focused visual check, not an exhaustive animation certificate. All captures preserve the original baby collar/continuous upper body and exact source uniform scale 0.5710830421929589. Worker ready/no failure; zero JavaScript or HTTP errors.

[Regression results](regression.json) replay the actual published renderer: it fails both the near/far sizing guard and independent lifted-leg paint-order guard. The repaired renderer passes 240 pose cases, 720 complete-leg lift/order cases and 6 baby/facing cases. A further [whole-leg regression](regression-whole-leg-order.json) caught the intermediate split-component order (both calves, then both boots), which could let a far boot paint over near fur. The corrected test inspects every submitted calf/boot triangle; the actual intermediate source fails and final source passes. These guards inspect the actual source texels submitted in triangles, rather than a declared ordering label. The existing 160-case anatomy test also passes with 15,360 positive-orientation source triangles. Math/triangle checks supplement, not replace, the screenshots and clip.

No physical phone, Safari, thermal or exclusive frame-time test was run by this focused repair. The same scene/camera scale remains; up/down still lacks a newly authored viewing angle. Source audit and labelled crops are in [foot-audit](../foot-audit/README.md); source references are not in-game screenshots.
