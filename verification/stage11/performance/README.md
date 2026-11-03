# Stage 11 exclusive walking profile

Frozen Stage10 target commit `69ab19a79736eddb47a2988bb71787c538545cbc` versus final Stage11 runtime. Four separate exclusive, headless Linux Chromium154 runs, no recording/CPU throttle, device scale1:1280×720 desktop and844×390 touch emulation. Original target assets are served locally; the old runtime is overlaid from that exact target commit in memory. Debug route warp only shortens setup; E uses the original transfer, then normal keys perform walking. Phone emulation is not physical-device/Safari or thermal testing. Function timings are inclusive and instrumented; do not add them together or generalise these single host samples into a phone FPS guarantee.

| View / motion | Before loop median | After loop median | Before frame median / p95 | After frame median / p95 |
|---|---:|---:|---:|---:|
|desktop / horizontal-right|11.0ms|3.3ms|16.7 /33.4ms|16.7 /16.7ms|
|desktop / depth-up|11.5ms|3.2ms|16.8 /33.4ms|16.7 /16.7ms|
|desktop / depth-down|11.1ms|3.1ms|33.3 /33.4ms|16.7 /16.7ms|
|desktop / diagonal-right-up|11.0ms|3.1ms|33.2 /33.4ms|16.7 /16.8ms|
|desktop / diagonal-left-down|11.3ms|3.1ms|33.3 /33.4ms|16.7 /16.8ms|
|touch / horizontal-right|12.2ms|2.9ms|16.7 /33.4ms|16.7 /16.7ms|
|touch / depth-up|13.0ms|3.1ms|16.7 /33.4ms|16.7 /16.7ms|
|touch / depth-down|13.2ms|3.2ms|16.7 /33.4ms|16.7 /16.7ms|
|touch / diagonal-right-up|12.5ms|3.0ms|16.7 /33.4ms|16.7 /16.8ms|
|touch / diagonal-left-down|11.6ms|2.9ms|16.7 /33.4ms|16.7 /16.8ms|

All gameplay invariants pass in both current runs: actual movement in five direction groups, one pending main loop, bounded hero/NPC caches, no NPC rebakes or live main-thread hero bakes, ready worker with no failure, queue bounded to one active and one latest request, and no JS/console/HTTP errors. Main-thread walking CPU fell about70–78% in these samples. Source tile preparation and cold NPC setup remain: E→Square was15.60→15.97seconds desktop and15.33→15.14seconds emulation. Initial ready stayed about0.9–1.0seconds. This optimisation addresses live walking, not a claimed cold-load elimination.

The desktop JSON also contains a separate paused renderer-laboratory strict raw-RGBA comparison. Its byte-exact assertion failed and is retained honestly: offscreen/bitmap and canvas paths are not byte-identical. A later twelve-case premultiplied/opaque/matte comparison also exceeds its predeclared2/255 tolerance; differences are not confined to invisible transparent RGB. This is not a gameplay screenshot or performance failure. A settled-ImageBitmap retest also fails the same threshold. All twelve numeric gait/body/baby/landmark geometries match exactly; paired normal-size lab images show differences along clipped-triangle seams, with no pose displacement. The raster/clip backend is a plausible cause, not proven. [Paired diagnostics](../pose-audit/pixel-pairs/README.md) retain the failed criterion; no exact pixel-equivalence claim is made by this timing report. Original source artwork files are protected by the separate944-check verifier, and the production baby remains drawn on the main thread at its native scale.

Data: [desktop before](before-desktop.json), [desktop after including raw-RGBA diagnostic](after-desktop.json), [emulation before](before-touch.json), [emulation after](after-touch.json). Runtime hashes and conditions are embedded. Animation/first-heading lag is reviewed with actual clips separately.
