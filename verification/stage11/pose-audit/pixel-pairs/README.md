# Native and worker raster diagnostic

These are **renderer laboratory frames**, not gameplay screenshots or new
character artwork. Each transparent 320×300 PNG contains the actual source
renderer at logical height 200. The `autumn-matte-diff-x4` PNGs show absolute
source-over differences on RGB(181,179,144), amplified four times. Actual
walking, interactions and animation are reviewed separately in the gameplay
captures and 1× clips.

Reproduce from the project root with Python Playwright and system Chromium:

```sh
python tests/centrum_hero_pixels.py
```

The script uses a fresh local server and disposable browser profile. It requests
source hero preparation on the title screen, then draws offscreen references;
it does not claim to replay the story or ride. This run used Chromium
154.0.8037.57, headless Linux, 1280×720, device scale 1. It was allowed to overlap
functional browser work and is **not an FPS benchmark**. Physical phones,
Safari and thermal behaviour were not tested.

## Actual result

[Full results](results.json) contain twelve poses: horizontal/up/down at cycle
phases 0, .25, .5 and .75. All runtime, console and HTTP checks passed. The
numeric gait, body, landmarks and baby geometry matched exactly in every case
(maximum numeric difference **0**). Source assets were reused; their files were
not edited.

**Raw RGBA equality and the predeclared visible 2-LSB tolerance both failed in
all twelve cases.** They remain failed; no threshold was loosened. Differences
are not explained solely by RGB values under transparent pixels:

- Maximum alpha difference: **109/255**.
- Maximum premultiplied RGB difference: **75/255**.
- Maximum RGB difference where both pixels are opaque: **47/255**.
- Maximum source-over difference: **106/255** on white and **71/255** on the
  autumn-floor matte. Mean painted-channel difference on that floor was about
  **0.81–1.06/255**.

The first native draw used `HTMLCanvasElement`. The script then waited for
`pendingBitmaps === 0` and redrew the same native pose using its cached
`ImageBitmap`. The worker also returned `ImageBitmap`. The same differences
remained after settling, ruling out a simple first-Canvas versus cached-bitmap
comparison error.

At 1× the paired frames have matching pose/shape placement. The amplified
matte differences trace regular clipped-triangle seams across the rasterized
body. This is consistent with raster/clip/filter differences between the DOM
canvas and OffscreenCanvas paths; the exact browser backend mechanism has not
been proven. Native baby geometry and expression scale match. The normal-size
rendered gameplay review accepted the final calves, cuffs and boots separately.
That visual review does **not** turn this stricter raster comparison into a pass.

## Paired 1× references

| Pose | First native Canvas draw | Settled native bitmap | Worker bitmap | Amplified matte difference |
|---|---|---|---|---|
| Horizontal, phase 0 | [PNG](horizontal-0-native-first.png) | [PNG](horizontal-0-native-settled.png) | [PNG](horizontal-0-worker.png) | [×4](horizontal-0-autumn-matte-diff-x4.png) |
| Up, phase .25 | [PNG](up-0_25-native-first.png) | [PNG](up-0_25-native-settled.png) | [PNG](up-0_25-worker.png) | [×4](up-0_25-autumn-matte-diff-x4.png) |
| Down, phase .25 | [PNG](down-0_25-native-first.png) | [PNG](down-0_25-native-settled.png) | [PNG](down-0_25-worker.png) | [×4](down-0_25-autumn-matte-diff-x4.png) |

The earlier unmodified [phone-context comparison](../pixel-equivalence.json)
records the original failure before the explicit bitmap-settling check. It is
Chromium touch emulation, not physical iPhone/Safari evidence. No game runtime
change was made in response to these diagnostic differences.
