# Stage24 actual alternating stride

Baseline: Linux headless Chromium154,1280×720 keyboard and844×390 Chromium CDP touch emulation, device scale1. Physical/Safari/human playback testing is not claimed. The same original artwork and0.60Square/0.80copied-route cameras are used. Screencast timestamps stay at1×;24fps is encoding, not gameFPS.

[Baseline manifest](before-manifest.json) combines four accepted fresh contexts from three invocations:32unmodified native gameplay JPEGs, four clips/28.7559seconds and eight held segments. Each direction covers3.77–5.31actual painted stride cycles. This target's own Stage23 commit`89f996a9d506f2dca2aab50903d61eee70bb0e04` is served by read-only Git fulfil; all served baseline hashes match. No donor is accessed. One original route-stop helper sets up each context, then parking/dismount, positioning, walking, pause/bag and remount use native controls. There are no walking-pose, health, NPC or reward grants.

- Square: [desktop clip](before/desktop-square-stride.webm) · [touch-emulated clip](phone-baseline/before/phone-square-stride.webm).
- Copied street: [desktop clip](source-baseline/before/desktop-street-stride.webm) · [touch-emulated clip](phone-baseline/before/phone-street-stride.webm).
- Native quarter-phase diagnostics: [desktop Square](before/desktop-square-right-native-phase-strip-diagnostic.png), [desktop source](source-baseline/before/desktop-street-right-native-phase-strip-diagnostic.png), [touch Square](phone-baseline/before/phone-square-right-native-phase-strip-diagnostic.png). These are unscaled160×120crops from actual gameplay frames, assembled side by side. They are phase diagnostics, not full screenshots or generated characters. The full source JPEGs remain alongside them.

The actual rendered feet already exchange numerical lead about ten times in a2.6secondSquare hold. That alone did not establish a readable alternating walk. Their starting separation biases one half-cycle: near-minus-far sole distance is−26.29…+74.24world units in Square, and about−26.8…+61.6on the source route. Relative opposite-lead spans balance at only.354Square/.428–.439source. One boot itself spans35.54–41.13world units at Square size. In native samples the strong half-cycle opens a visible wide step; in the weak half-cycle the boots pile together under the body, concealing the second forward step.

The draw wrapper observes production HeroRig audit *after actual painting*, including cached rendered phase, both sole positions, stance, body and original baby attachment. It owns no loop or movement/pose updates. Full sampled data remains in the raw per-run JSONs named by the manifest. A normal pause is entered only after recorded movement while the video encodes, then native play resumes. Every baseline context returns to the same grounded bicycle/original passenger with100HP, one pending main RAF, no gameJS/console/HTTP errors and project-only storage.

[Accepted frozen after manifest](accepted-results.json) combines four main contexts plus one existing native gang/J/recovery back-carrier check from three invocations. All five contexts pass.43normal native gameplay JPEGs and five1×clips/33.0114seconds are retained. Main right/left segments each cover4.54–5.15actual painted cycles; the naturally available back-carrier sample covers2.8125cycles, with the automatic return to front still enabled. No single-process whole-run claim is made.

| Actual rendered lead span | Stage23 baseline | Frozen Stage24 |
| --- | --- | --- |
| Square near minus far sole |−26.29…+74.24 |−50.26…+50.26 |
| Copied street |about−26.8…+61.6 |−44.21…+44.21 |
| Opposite-lead span balance |.354Square / .428–.439street |.990–1.000main / .990back |

Both feet pass ahead of and behind the common hip reference, with visible backward stance motion. Main acceptance requires at least three actual painted cycles per direction, both feet taking the lead, and opposite-lead spans balancing at≥.8. The old baseline already passed the first lead-swap test but fails the balance test, so a phase-only assertion cannot conceal the original problem.

- After Square: [desktop walking clip](after/desktop-square-stride.webm) · [touch-emulated clip](phone-after/after/phone-square-stride.webm).
- After copied street: [desktop clip](after/desktop-street-stride.webm) · [touch-emulated clip](phone-after/after/phone-street-stride.webm).
- Original back carrier after native combat: [clip](back-carrier/after/desktop-combat-back-carrier-motion.webm) · [raw result](back-carrier/after/results.json).
- After native phase diagnostics: [desktop Square](after/desktop-square-right-native-phase-strip-diagnostic.png), [desktop source](after/desktop-street-right-native-phase-strip-diagnostic.png), [touch Square](phone-after/after/phone-square-right-native-phase-strip-diagnostic.png).
- Actual chronological decoded native crops: [desktop Square](after/desktop-square-native-temporal-diagnostic.png) and [touch Square](phone-after/after/phone-square-native-temporal-diagnostic.png),16samples/.05second spacing, no enlargement. Full original clips/JPEGs remain alongside them.

AI review of actual normal gameplay and unscaled decoded sequences shows the opposite contact half-cycle now exposed: both original boots take comparable forward leads, while passing poses naturally overlap. The original baby/pouch stays continuous and attached; sampled shorts seams stay joined and boots grounded. The gait remains illustrated skinning, and tiny phone detail stays limited. This is not human playback, physical-device or smoothness/FPS proof.

All four peaceful contexts return to the same grounded bicycle/original passenger at100HP. The native back-carrier combat case preserves22damage to the target(60→38); player health decreases60→30. Up/down viewing, original baby scale, I/touch inventory and native pause/resume remain checked. Runtime hashes stay frozen, worker queues/bitmaps drain, cache limits remain98frames/32MiB, one pending main RAF, project-only storage and zero gameJS/console/HTTP errors.

The first focused back case is retained separately as a failed protocol attempt: `back-carrier-cycle-threshold-attempt/after/results.json`. Its additional two-back-cycle threshold failed when the original natural front return left1.3958backcycles. The focused rerun requires one complete back stride within that natural availability window and actually captured2.8125. Main eight segments retain the stricter three-cycle minimum. No game rule, health or carrier state was changed to satisfy the test.

Normal phase stills are selected from native screencast JPEGs against the real post-paint trace; timestamp gaps remain in metadata (baseline max.0985s, after max.0156s). The full draw trace and clips establish extrema and animation; four sampled crops alone do not establish an entire gait or smoothness.

Reproduce: `python3 tests/centrum_stage24_browser.py --phase before`; then `--phase after --require-alternation`. The focused original back check uses `--phase after --platform desktop --back-carrier`. Playwright/Chromium/ffmpeg are development tools only.
