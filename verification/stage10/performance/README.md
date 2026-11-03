# Stage 10 performance and remaining-limit review

This is a short **actual rendered Chromium profile**, not a physical-phone, Safari,
thermal or sustained-load benchmark. It preserves accepted scene scale, artwork,
physics and input. No runtime files were edited by this review.

Run alone on the shared host:

```sh
python tests/centrum_performance_review.py --label review
```

Playwright uses `/usr/bin/chromium`, a fresh disposable profile and a clean local
HTTP server. The source debug warp shortens travel to the authored cycling stop;
ordinary E performs the production transfer. Every profiled movement then uses
keyboard input. There are no actor teleports, debug item grants or pause tricks
in the measured walk. These samples complement, and do not replace, the separate
uninterrupted native-input WebKit acceptance run.

## Actual initial conditions and results

[Before-HUD-change data](before-hud.json): Chromium 154.0.8037.57, headless Linux,
1280×720, device scale 1, no CPU throttle and no screen recording. The other
browser acceptance run was closed before this run. It is still shared container
hardware, with no thermal or physical-device measurement. Fresh means a new
browser profile; filesystem/OS caches were not flushed. Function wrappers and
JSON clone timing add overhead; reported inclusive costs overlap and **must not
be summed**.

Fresh ready took **1.09 seconds** wall time. E to ready linked exploration took
**16.12 seconds**, including production transfer and initial source NPC/scene
preparation. The source NPC cache used compiled artwork and reported 576
prepared frames, 4.75 seconds of accumulated bitmap-extraction intervals and
16.82 seconds of wall-time warmup. Those extraction intervals include awaited
`createImageBitmap` completion; they are not synchronous CPU or worker-bake
measurements. NPC counters did not increase during the measured walk and
reported zero main-thread procedural NPC baking. No JS/HTTP errors occurred; the named
main game loop had maximum and final pending count one.

| Phase | Sampled frames | Frame interval median / p95 | Main loop CPU median / p95 |
|---|---:|---:|---:|
| Warm idle | 130 | 16.7 / 16.8 ms | 3.1 / 3.8 ms |
| Horizontal right | 77 | 16.8 / 33.4 ms | 11.2 / 13.2 ms |
| Depth up | 47 | 16.7 / 33.4 ms | 10.8 / 12.8 ms |
| Depth down | 42 | 33.3 / 33.4 ms | 11.5 / 14.0 ms |
| Diagonal right/up | 55 | 33.2 / 33.4 ms | 11.1 / 13.4 ms |
| Diagonal left/down | 52 | 33.3 / 33.4 ms | 11.8 / 13.9 ms |
| Idle after turns | 98 | 16.7 / 33.4 ms | 2.9 / 10.2 ms |

This initial script revision did not store resource hashes or per-phase cache
counters; the current repeatable probe does. Thus this initial JSON is retained
as a measured diagnostic rather than an exact-archive performance certificate.

## Concrete costs and repair scope

The largest measured synchronous walking function cost was the existing source
rig's frame baking:
`BearlyHeroRig.draw` averaged **6.95–8.67 ms** in moving phases, while warm idle
averaged 0.16 ms. Across the mixed-direction sample there were 266 cache misses,
118 transient bakes and 2.234 seconds additional measured bake CPU. Reported cache accounting
remained bounded at 98 frames / 19.14 MB, below its existing 32 MiB limit; this
is not a total browser/GPU-memory measurement.
Initial directions and start/stop easing build source mesh frames. Scheduling and
compositing were not CPU-traced, so these timings do not explain every frame gap.
This does not
justify replacing source bodies, weakening baby continuity, changing camera
scale or broadly rewriting the rig. It remains a measured cold/direction-change
cost, not a claim of consistently smooth mobile animation.

New scene/UI overhead was smaller but measurable:

- Square update averaged 0.89–1.17 ms per frame.
- Scene lookups cloned authored data 13–21 times per frame, totaling 0.42–0.67 ms.
- Inventory update averaged 0.47–0.61 ms per frame.
- Inside inventory, the frozen source Visits audit still ran 2.00–2.04 times per
  exploration frame, costing 0.23–0.29 ms per frame. The square then overwrote
  those source threat/position fields with its own current scene state.
- Across the modules, JSON parse/stringify ran about 42–49 pairs per frame,
  processing about 98–122k characters per frame. Combined inclusive clone timing
  was about 1.0–1.3 ms per frame; this overlaps the module costs above.

Skipping the frozen source Visits audit would save only about 0.25 ms per
exploration frame in this run. **That optimization was deliberately declined:**
touching the live-danger bridge creates disproportionate regression risk for
this small measured gain, while source motion baking dominates. Source danger
validation, renderers, cache limits and scene clone ownership remain unchanged.
The post-HUD repeat measures the approved narrow layout repair separately; it
does not claim a source-renderer performance fix or guaranteed FPS improvement.

## After-HUD sample before the fullscreen refinement

[Pre-fullscreen-refinement data](after-hud.json), **BQ_CENTRUM_STAGE10**, observed
2026-11-02 23:26 UTC, uses the same Chromium/viewport, ordinary-input sequence
and timing wrappers. The final WebKit, Firefox, HUD-gallery and fullscreen
browsers were all closed first. Archive building and clip encoding were held
until this browser closed. Its exact resource hashes are preserved as a diagnostic
from before the later scene-only fullscreen CSS/projection refinement. This probe
records 40 JavaScript/CSS resource
hashes, per-phase rig-cache counters and all eight passing invariants: no runtime,
console or HTTP errors; one pending main loop; bounded hero/NPC caches; no NPC
rebakes during the walk; and real movement in every requested direction.

Fresh ready took **1.19 seconds** and production E→ready Square took **15.29
seconds**. These are observed loading/transfer waits, not hidden with a teleport.

| Phase | Sampled frames | Frame interval median / p95 | Main loop CPU median / p95 |
|---|---:|---:|---:|
| Warm idle | 133 | 16.7 / 16.8 ms | 3.5 / 5.1 ms |
| Horizontal right | 88 | 16.7 / 33.4 ms | 11.2 / 14.0 ms |
| Depth up | 47 | 16.8 / 33.4 ms | 11.4 / 12.8 ms |
| Depth down | 50 | 16.7 / 33.4 ms | 10.9 / 12.7 ms |
| Diagonal right/up | 61 | 16.7 / 33.4 ms | 10.7 / 13.9 ms |
| Diagonal left/down | 60 | 16.7 / 33.4 ms | 10.8 / 15.8 ms |
| Idle after turns | 104 | 16.7 / 33.3 ms | 3.3 / 10.5 ms |

The new HUD placement has a measurable cost. `Inventory.update` averaged
**0.91–1.04 ms/frame**, versus 0.47–0.61 ms before: about **+0.37–0.49 ms/frame**
for the corresponding phases. Moving-phase p95 was 1.2–1.4 ms. Warm-idle main
loop median rose 0.4 ms; moving-phase medians stayed in the earlier range.
This is a modest measured cost for keeping controls clear of the passenger,
not a claim that layout is free. One before/after sample cannot establish
statistical significance or attribute changes in frame scheduling to the HUD.
The better sampled frame medians do not establish a performance optimization.

There was no substantial measured cache growth: hero accounting remained
**98 frames / 19.18 MB** (prior 19.14 MB), with the same 188,480-byte scratch
buffer; NPC accounting remained **576 frames / 45.70 MB**, with no additional
NPC bakes. Source hero walking still averaged 6.22–8.11 ms and added 2.334
seconds of synchronous bake time across new directions/start-stop phases.
Source renderers, cache limits, live-danger validation and physics were left
unchanged. No large frame regression or unbounded cache growth was observed in
this short desktop sample; sustained physical-device performance remains unknown.

## Final desktop sample after the fit/fullscreen repairs

[Final desktop data](final-desktop.json), **BQ_CENTRUM_STAGE10**, observed
2026-11-02 23:55 UTC, is the current profile. The 23:26 sample above remains
unchanged as the pre-refinement diagnostic. Since then, only
`centrum-inventory.js`, `centrum-inventory.css` and `centrum-square.css` changed
among the 40 hashed JavaScript/CSS resources. All 40 final hashes were checked
against the runtime after this profile and matched. Source game, rig, physics
and NPC-renderer hashes are unchanged between the two samples.

This repeats the same **1280×720 normal desktop** conditions and input durations.
It does not time mobile fullscreen: actual fullscreen fit/actor size and bag
pointer access have their own functional evidence. Both focused engines and all
fit/gallery/fullscreen browsers were closed; compression, encoding and archive
checks were held until the profile browser closed.

**All eight invariants passed again**, including no runtime/console/HTTP errors,
one main loop, bounded caches, no NPC rebakes and real movement in all requested
directions. Fresh ready was **1.09 seconds**; E→ready Square was **15.09 seconds**.

| Phase | Sampled frames | Frame interval median / p95 | Main loop CPU median / p95 |
|---|---:|---:|---:|
| Warm idle | 138 | 16.7 / 16.8 ms | 3.2 / 4.1 ms |
| Horizontal right | 89 | 16.7 / 33.4 ms | 10.7 / 12.8 ms |
| Depth up | 51 | 16.7 / 33.4 ms | 10.7 / 12.3 ms |
| Depth down | 47 | 33.2 / 33.4 ms | 11.4 / 16.2 ms |
| Diagonal right/up | 64 | 16.7 / 33.4 ms | 10.1 / 12.7 ms |
| Diagonal left/down | 62 | 16.7 / 33.4 ms | 10.7 / 11.7 ms |
| Idle after turns | 105 | 16.7 / 33.3 ms | 3.1 / 10.0 ms |

Depth-down included a **50.1 ms frame outlier** and 28.8 ms maximum synchronous
main-loop sample. This short test is not consistently 60 FPS. Inventory update
averaged **0.85–0.99 ms/frame**, p95 1.1–1.2 ms, versus 0.91–1.04 ms in the
pre-refinement run. Compared with the original HUD, corresponding phases still
cost about **+0.30–0.45 ms/frame**. Cached fit-aware math did not produce a large
additional sampled cost; variance between these single runs does not prove an
optimization or a guaranteed frame rate.

Hero cache accounting remained **98 frames / 19.05 MB**, with the same
188,480-byte scratch buffer. NPC cache accounting remained **576 frames /
45.70 MB**, with no rebakes. Native source hero drawing averaged 6.01–8.65 ms in
moving phases and accumulated 2.379 seconds of synchronous new-pose bake time.
No unbounded cache growth or large sampled regression was found. Source
renderers/cache limits/live-danger checks were deliberately preserved. This is
software evidence from the available desktop browser; physical, thermal and
sustained-mobile conclusions remain out of scope.

## What is a constraint, and what was not tested

Fixed side/front silhouettes, absence of dedicated toward/away source poses and
upper-façade cropping in phone cover framing are accepted presentation limits.
They are not a reason to shrink/rotate actors, hide the baby, replace source art
or expand the world. The optional depth gait preserves native source boots,
lift, body and baby; it is not newly authored directional animation.

No current JavaScript module contains `getGamepads`, `gamepadconnected`,
`gamepaddisconnected` or gamepad polling/listener support. **Gamepad input is not
implemented**; it should not be described merely as an untested supported input.
No support was added. Keyboard and touch-emulated controls have separate actual
acceptance evidence.

Physical phones/iPhone/Safari were skipped at the user's request. Sustained
mobile performance and thermal behaviour remain unmeasured. Existing historical
WebKit cold p95 stalls do not identify a reproducible software defect by
themselves. The separate Stage 10 Linux WebKit full flow now passed all 16 groups,
including Q→walking→same-bike remount; that resolves the previous uncompleted
flow check but does not establish physical iPhone/Safari behaviour.
