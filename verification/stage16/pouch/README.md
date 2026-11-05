# Stage16 original passenger/pouch renderer check

`pixels.json` is a Chromium renderer laboratory, **not an in-game screenshot or a gameplay test**. It compares the pinned target Stage15 HeroRig with Stage16, using unchanged original source images and the same original child painter. The laboratory consistently selects nine original expressions across thirteen production layouts at native artwork scale and height 200 (234 cases).

Final result: **PASS**. All 2,105 protected original face, chin, neck, collar and torso samples match exactly. The unchanged strict native 4/255 RGBA tolerance passes (worst 2). All transfer/boat cases retain the exact original final-scale clipping. Lifecycle, source/layout separation and bounded caching are checked separately by `tests/centrum_pouch_cache.cjs`.

Native rasterization followed by display scaling changes some pouch-boundary filtering compared with a clip constructed at the final display scale. This is **not a byte-identical foreground**: at height 200, the worst opaque autumn-background composite channel delta is 103, with at most 291 pixels over 4/255 in a 512×512 comparison. The original baby samples remain exact. `passenger-pouch-normal200-reference.png` is labelled renderer-reference artwork at normal200 scale, and actual gameplay evidence lives in `../browser/`. The normal-size front/back reference and nativeStreet gameplay were inspected for continuous neck/clothing and physical attachment.

Earlier failures are retained: native boat raw delta 5 exceeded the original strict 4 tolerance; adding original torso probes exposed five transfer overlap failures, worst 19. These were fixed by retaining the exact production clip for the short transfer and boat poses. `pixels-native-strict 4-failed-attempt.json` preserves the pre-repair failures and `pixels-transfer-repair-before-boat-attempt.json` preserves the transfer-only repair. Thresholds were not widened. Neither case is claimed optimized.

Run `python tests/centrum_pouch_pixels.py` with Playwright Python and system Chromium installed. No generated art, donor source, saves or runtime files are written by the lab. Browser emulation is not a physical-device test.
