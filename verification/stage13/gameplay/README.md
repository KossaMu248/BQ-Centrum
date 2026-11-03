# Actual Stage 13 walking

These are **actual gameplay screenshots and a recording**, captured from the current target files on a local HTTP server. They are not generated artwork previews. Chromium 154.0.8037.57, headless Linux, 1280×720 CSS pixels, device scale 1, build `BQ_CENTRUM_STAGE13`; no physical device was tested.

Run with the existing Python Playwright environment and Chromium/ffmpeg installed:

```sh
python3 tests/centrum_directional_gameplay.py --clip
```

The harness uses one disclosed debug route-stop setup at route position 7550. Native E then performs the existing dismount/baby transfer. Ordinary keyboard walking reaches the clear square lane and exercises right, left, up, down, all four diagonals and stopping. No scene teleport or state grant follows setup. This focused run does not replace the separate complete earned story/ride validation.

All 19 captures passed the fixed 200 logical-height and native continuous baby/collar/scale checks. Real up inputs select authored `away`, down inputs select authored `toward`, and both remain selected after stopping. Four diagonal regressions additionally verify actual horizontal/depth displacement without a collision, the selected authored view while held, and retention after both velocities reach zero. This covers the repaired braking bug: depth velocity settled before horizontal velocity and had incorrectly switched the actor back to a side view after releasing diagonal movement.

The original native baby reactions are `leanForward` while walking up and `leanBack` while walking down. Horizontal inputs retain the original source side renderer. `results.json` contains each screenshot hash, the four diagonal results and live renderer/scene audits; no JavaScript or HTTP error was observed.

Useful normal-size views:

- [Up / away](up-2.png)
- [Down / toward](down-2.png)
- [Stopped away](away-rest.png)
- [Stopped toward](toward-rest.png)
- [Diagonal stopped away](north-east-rest.png)
- [Diagonal stopped toward](south-west-rest.png)
- [Actual walking clip](walking.webm)

The clip shows 22.512 seconds of timestamped native gameplay at **1×**, encoded at 24 fps from 357 screencast samples. Encoding rate is not a game frame-rate measurement. Independent visual review accepted the distinct head/helmet/body/boot angles, original attached baby and paired legs. The walking remains articulated from measured painted pieces rather than a fully redrawn animation sequence.

The module prepares two views once, uses 11 steady drawing calls, and reports 1,143,632 bytes of part textures plus 1,132,204 bytes of canonical source canvases. This is a renderer allocation audit, not a total browser memory or exclusive performance measurement. It owns no animation loop or input listener.

Earlier pre-native-lean and pre-diagonal-braking captures are excluded from the deliverable and are not this final evidence. The separate renderer reference and protected-native-pixel lab are labelled as references, not gameplay.
