# Stage16 performance evidence

Profiles compare this target's pinned Stage15 commit `ffec905bf71296b63f2d38fab74a3ac20e2c3875` with the final Stage16 runtime. Baseline JS, CSS, HTML and manifest bytes are served from that target commit; unchanged local artwork is shared. This does not read or copy either donor checkout.

All four final mode profiles passed their runtime/console/HTTP and one-main-RAF-loop checks. These are exclusive, sequential headless Chromium 154.0.8037.57 runs on one shared Linux host, with no screen recording or CPU throttle. Desktop is 1280×720; phone-landscape emulation is 844×390, deviceScaleFactor 1. These performance runs drive native keyboard actions in both environments, using disclosed debug warps and god mode to isolate rendering. They are not physical iPhone/Safari tests or the primary gameplay acceptance run; actual interaction/touch and walking video evidence is under `../browser/`.

Main-loop CPU medians in milliseconds:

| Scenario | Desktop before→after | Phone emulation before→after |
|---|---:|---:|
| Copied ride idle |3.1→3.1|3.3→3.0|
| Copied street idle |18.0→2.8|18.9→2.4|
| Copied street cold walk |26.0→3.4|27.8→2.7|
| Copied street warm left walk |17.7→2.5|13.7→2.7|
| Copied street repeated starts/stops |26.5→2.9|22.1→2.5|
| Centrum side walk |3.5→3.1|3.4→2.6|

The copied-street cold-entry wall time fell 10.35→6.30 seconds on desktop and 10.40→6.38 seconds in phone emulation. This includes the production transfer and the new foreground source/native-worker preparation. Centrum entry was 2.97→2.81 seconds desktop and 2.60→2.78 seconds emulated phone; this small difference is not claimed as an improvement. Startup was comparable; all exact measurements, sample counts and p95/max values are in `comparison.json` and the four profile JSONs.

The measured cause was a live curved foreground pouch clip replaying on the main canvas at each passenger draw: the diagnostic attributed about 17.5ms per cached idle draw to its Canvas restore. The frozen-baseline [pouch-only-desktop.json.gz](pouch-only-desktop.json.gz) intermediate isolates the pouch optimization and reduced idle CPU 18.0→2.6ms. It is an intermediate experiment, not the final Stage16 runtime. The final implementation caches the original native pouch pixels with 48-frame/2MiB limits; original child art, scale, face and clothing probes are checked separately under `../pouch/`. Exact final-scale clipping remains on production transfer/boat poses and their render cost is intentionally retained.

The native source walk now opts into the existing shared worker with its original native geometry. Native and square cache/fallback families remain isolated. Final profiles recorded **zero main-thread transient body bakes**, versus 184 desktop/218 emulated phone at baseline. One shared body pool remained within 98 frames/32MiB; the final desktop pool was 19,823,920 bytes (18.91MiB), including 97 worker frames and one default source frame. There was at most one worker job and one queued job. The one-manager creation and serial native/square warmup are separately exercised by `tests/centrum_native_cache.cjs`. The target NPC path uses complete authored source poses: the sampled compiled walk cache fell 192 frames/15,234,048 bytes→0. World raster caching stayed within 40MiB. These counters are retained in `comparison.json`.

**Cadence limitation:** copied-route median RAF intervals still vary between 16.7 and33.3ms; early desktop ride/walk phases remain 33.3ms despite the lower CPU cost. Centrum medians are 16.7ms. Isolated 100ms+ shared-host stalls also occurred, especially during transfers. These results demonstrate lower CPU work and fewer live mesh stalls; they do not establish universal 60FPS. Transfer/boat clipping is not claimed optimized. The phone baseline's existing automatic backing scale fell to .75 during the run; the final phone run remained 1. Per-phase backing scales are recorded rather than hidden.

`residual-layers.json` is a browser-only render-layer ablation to investigate the remaining copied-route cadence. It temporarily skips one drawing layer at a time and restores all methods; it changes no runtime files or frame limits and is not a normal gameplay capture. The short control was already 16.7ms median before/after, so the earlier 33.3ms median was not reproduced. Skipping any single layer did not change cadence (p95 remained 33.3–33.4ms); skipping all reduced p95 to 16.7ms and CPU to 1.3ms. This identifies no single culprit and does not prove a fixed compositor cap. One 183ms interval occurred even with road skipped and main CPU below 10ms. No additional runtime change was made from this inconclusive diagnostic.

Reproduce (Python Playwright and system Chromium required):

```
python tests/centrum_mode_performance.py --baseline --label before-desktop
python tests/centrum_mode_performance.py --label after-desktop
python tests/centrum_mode_performance.py --baseline --touch --label before-touch
python tests/centrum_mode_performance.py --touch --label after-touch
```

Function wrappers are inclusive and overlap; do not sum their timings. Saved positions, pickups, wallet, health and quest behavior are tested separately; this render-isolation fixture is not a substitute for those tests.

Final runtime hashes: HeroRig `34d2c90e46f96b1ce9cd8630773737f46369502313e4cb1a1c313d49b2440263`; worker cache `38f3212052e12304e3ecf4a053f0141122660395593874151e23835717ee5eff`. All runtime hashes agree between the final desktop/touch profiles.

The five large new raw profiles are delivered as lossless `.json.gz` evidence: [desktop before](before-desktop.json.gz), [desktop after](after-desktop.json.gz), [emulation before](before-touch.json.gz), [emulation after](after-touch.json.gz), and the historical [pouch-only intermediate](pouch-only-desktop.json.gz). This encoding preserves every original UTF-8 byte, including whitespace; it changes no measurements and is not a new profiling run. [PROFILE_ENCODING.json](PROFILE_ENCODING.json) records original/compressed sizes and both hashes for all five exact-byte round trips. `comparison.json` keeps `profileSHA256` as the original decompressed-byte hash and records compressed hashes separately. Inspect without installing anything with `python3 -c "import gzip; print(gzip.open('verification/stage16/performance/after-desktop.json.gz', 'rt', encoding='utf-8').read(), end='')"`. The reproduction commands above still produce ordinary raw JSON before this optional artifact encoding.
