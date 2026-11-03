# Actual gameplay baseline before Stage11 anatomy repair

This is real rendered gameplay from target commit `69ab19a79736eddb47a2988bb71787c538545cbc` (**BQ_CENTRUM_STAGE10**), captured on 2026-11-03. The local server overlaid that target HEAD's index, HeroRig, Square and depth module **in memory** while using the target's own assets. This kept the original .23 depth projection and 60 depth speed frozen while Stage11 edits progressed. No donor, runtime source, art or Git configuration was modified. Exact frozen-file hashes are in `results.json`.

The existing debug cycling stop prepared a valid parked bicycle once; ordinary E dismount and arrow-key movement performed all recorded gameplay. This is a disclosed movement fixture, not a no-debug complete quest run. Browser: Linux headless Chromium 154.0.8037.57, 1280×720, device scale 1, shared CPU. No physical-device or exclusive performance benchmark claim is made. Capturing/screenshot overhead lengthens each held-input interval beyond its explicit wait.

- `up-1/2/3.png`, `down-1/2/3.png`, `right-1/2/3.png`, `left-1/2/3.png`: original normal-size gameplay captures.
- `walking-baseline.webm`: **12.85 seconds at 1×**, 198 real CDP-captured frames. This frame count is a recording sample count, not measured game FPS.
- `actual-gameplay-contact-sheet.png`: clearly labelled reduced overview of four real source screenshots; full-size originals are supplied separately.
- `results.json`: renderer states, source landmarks, browser/build conditions and frozen runtime hashes. The audit is sampled immediately before each screenshot; gameplay advances during capture, so numeric samples need not match the exact later screenshot animation phase.

## Precise visual findings

1. **Direction is not reflected in the upper-body pose.** Native up/down movement translates the same right-facing chest, helmet, supporting arms and carrier silhouette. Lateral side boot-toe orientation remains. The clip demonstrates movement and articulation; this is more than a static screenshot finding.
2. **Leg geometry compresses and changes scale.** The down sequence bunches the knees/upper calves under the shorts while projected foot travel becomes depth movement; the result reads as a tight inward tuck rather than a distinct toward-view stride. In the 12 actual renderer samples, near heel-to-toe width ranges 16.25–44.39 world units (about63% contraction) and far width 24.08–44.97. The renderer still labels those shoes `rigidShoe:true`; that flag does not demonstrate visual rigidity. The samples show real painted mesh landmark geometry, not planned target positions.
3. **Clear comparison requires avoiding the parked bike.** Some first up/down frames correctly sort behind the foreground parked bicycle, hiding part of the lower legs. `up-2.png` gives a clear unobstructed upper/lower body. Horizontal frames move clear of the bicycle. This is expected depth occlusion, not a second bike/passenger.
4. **Source likeness remains intact.** All 12 baby audits retain the continuous source upper body, original collar and uniform scale 0.5710830421929589 at hero height 200. Face, neck and clothing remain attached; no artwork replacement occurred. That preservation should survive anatomy changes.

All four native movement directions ran, 12 screenshots were captured, and the clip completed with **zero JavaScript errors or HTTP failures**. No current-runtime anatomy approval is implied by this older baseline. Retest the final Stage11 implementation against these captures and its own real motion/landmarks.
