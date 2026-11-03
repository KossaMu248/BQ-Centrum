# Final actual walking and character review

These are **real rendered BQ-Centrum gameplay captures**, not generated illustrations. Desktop and phone runs used the same frozen runtime hashes (recorded in both result files), the same accepted camera and requested 200-unit source hero. No donor was read, source artwork regenerated or runtime changed by this capture work.

## Conditions and exercised movement

| Run | Actual conditions | Evidence |
| --- | --- | --- |
| Desktop | Linux headless Chromium 154.0.8037.57, 1280×720, device scale 1; normal keyboard arrows | 22 normal-size screenshots; `walking-after.webm`, 28.50-second 1× file (28.33-second captured interval), 525 sampled recording frames |
| Phone landscape | Same Chromium, 844×390, mobile/touch emulation, device scale 1; actual CDP touch presses and two-touch diagonals | 22 normal-size screenshots; `walking-after-phone.webm`, 25.71-second 1× file (25.64-second captured interval), 513 sampled recording frames |

The existing debug route stop prepared a valid original parked bicycle once, followed by normal E dismount. No debug scene teleport or state grant followed that preparation. Both runs used native up/down/right/left movement, walked to an unobscured floor lane, repeated up/down starts and stops, moved diagonally southeast/northwest, and ended at rest. This is a disclosed movement fixture; it is not the separate no-debug task/remount campaign acceptance run.

`actual-gameplay-contact-sheet.png` is a reduced desktop overview. `actual-phone-gameplay-contact-sheet.png` lays out four native 844×390 phone captures. All original normal-size PNGs are included. `results.json` / `results-phone.json` contain exact runtime hashes, input/motion states, source/render metadata, worker status and capture hashes; `frames.sha256` covers screenshots/clips.

## Actual visual verdict

The initial two anatomy attempts were rejected after normal-size review: stable numeric spans had hidden pinched fur, hooked calves and a triangular boot wedge. The accepted renderer uses coherent whole fur patches and complete masked source boots. Representative clear-lane up/down, diagonal and stopped frames were viewed at normal size, together with the earlier moving-frame geometry gate. The calves keep their natural volume; cuffs remain attached and the previous orange hooks/sole wedge are absent in these reviewed frames. Boots preserve full heel/toe outlines while stepping. This is a representative rendered review, not an exhaustive inspection of every video frame.

All 44 captured renderer audits preserve requested hero height 200, the original continuous baby upper body/neck/collar/clothing, and uniform source scale 0.5710830421929589. The baby’s original lean-forward/up and lean-back/down expressions remain recognisable at ordinary size; the shared supporting torso/pouch pose changes with direction. Carrier attachment does not change merely from walking direction. Actual boot spans remain approximately 34.536/42.134 world units across samples, supporting the visual review. Diagnostic IK targets are labelled separately and are not represented as painted knee measurements.

The source actors remain shallow three-quarter paintings, mirrored for left. This is directional posing of that source rig, **not new authored frontal/rear artwork**. No long hidden-baby rear view, overhead rotation or replacement character was introduced. Phone controls/status do not obscure the baby in the exercised views; upper facades still crop under the accepted phone cover framing.

## Technical results and limits

Both runs completed with **zero JavaScript, console or HTTP errors**. The raster worker was ready before movement, stayed ready without failure, and retained at most one pending and one queued request. The two runs ended at 100 shared health. The recorded image counts are video sample counts, not measured game FPS; screenshot/recording overhead and shared CPU conditions prevent a physical-device performance claim.

The first up-heading probe sampled a desktop directional-pose delay of about 119.8ms after movement began. Phone movement and directional pose first appeared in the same observed sample (~100.6ms after the probe began), so no extra lag was resolved at that sampling interval; this does not prove zero touch/input latency. A brief correct native-idle fallback can occur for an uncached heading. Numeric state is sampled immediately before screenshots, while gameplay advances; a sample need not match the exact later screenshot animation phase.

After all screenshots and clips, a **separate paused offscreen raster laboratory** compared direct/worker paths at 320×300/logical200. Its initial declared 2LSB visible-channel policy failed all 12 cases; raw equality was also false. The full result was saved honestly under `../pose-audit/pixel-equivalence.json` (a failed-attempt copy is preserved separately). That laboratory is not gameplay, does not certify anatomy or animation, and no backend byte-equivalence pass is claimed here. The renderer owner is reviewing the cause; use the main test report for the final diagnostic disposition.

Physical phones, physical iPhone/Safari and thermal performance were not tested. Chromium phone emulation is not physical-device evidence. The separate browser-functional and performance reports state their own conditions and results.
